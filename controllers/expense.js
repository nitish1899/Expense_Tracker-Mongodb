const Expense = require('../models/expense');
const User = require('../models/user');
const Downloads = require('../models/download');
const S3Services = require('../services/s3services');

var ITEMS_PER_PAGE =2 ;

function isstringinvalid(string){
  if(string == undefined || string.length === 0){
      return true;
  } else {
      return false;
  }      
}

exports.postExpenseDetails = async (req, res) => {
  try{
     const {amount, description, category} = req.body;
     if(isstringinvalid(`${amount}`) || isstringinvalid(description) || isstringinvalid(category)){
        return res.status(400).json({message: 'Invalid details', success: false});
     } else { 
        const expense = new Expense(
            {amount: amount, description: description, category: category, userId: req.user._id}
            );
            const data = await expense.save();
        try{
            const user = await User.findById( req.user._id );
             if(user){
                totalExpenses = +user.totalExpenses + +amount;
              await user.updateOne({ totalExpenses: totalExpenses});
              return res.status(201).json({addedExpense: data, message: "expense added"});
            }
        } catch(err) {
            return res.status(501).json({message: err, success: false});
        }  
     }
  } catch (err) {
    return res.status(500).json({message: 'Something went wrong', success: false});
  }
}

exports.getExpenseDetails = async (req, res) => {
    try{
        const x = +(req.query.itemPerPage || 1);
        ITEMS_PER_PAGE = x  ;
        const page = req.query.page || 1;
        let totalItems ;
        Expense.count({userId: req.user._id})
        .then((total) => {
            totalItems = total;
            return Expense.find({userId: req.user._id}).skip((page-1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE) 
        })
        .then((expenseDetails) => {
            return res.status(200).json({
                AllExpenses : expenseDetails ,
                isPremiumUser : req.user.ispremiumuser,
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                nextPage: +page+1,
                hasPreviousPage:page>1,
                previousPage:+page-1,
                lastPage:Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
        })
        .catch((err) => console.log(err));
    } catch (err){
        console.log(err);
        return res.status(500).json({err: 'Something went wrong', success: false});
    }
}

exports.deleteExpenseDetails = async (req, res) => {
    try{ 
        const expenseId = req.params.id;
        const expense = await Expense.findById(expenseId);
        if(req.user._id.toString() === expense.userId.toString()){
            const result = await Expense.findByIdAndRemove(expenseId);
            User.findById(req.user._id )
            .then(async (user) => {
                if(user){
                   const totalExpenses = +user.totalExpenses - +expense.amount;
                   await user.updateOne({ totalExpenses: totalExpenses});
                   res.status(200).json({ message: "expense deleted"});
                }
            })
           .catch((err) =>{
                return res.status(501).json({message: err, success: false});
            })    
        }
    } catch (err) {
        return res.status(500).json({err: 'Something went wrong', success: false});
    }
}

exports.downloadexpense = async (req,res) => {
    try {
      const expenses = await Expense.find({userId: req.user._id}); // here expenses are array. 
      const stringifiedExpenses = JSON.stringify(expenses); // converting array to string 
      // filename should depend upon userid
      const userid = req.user._id;
      const filename = `Expense${userid}/${new Date()}.txt`;
      const fileUrl = await S3Services.uploadToS3(stringifiedExpenses, filename);
      const download = new Downloads({fileUrl, userId: req.user._id });
      const urladdedtotable = await download.save();
      res.status(201).json({ fileUrl, success: true});
    } catch(err) {
      console.log(err);
      res.status(500).json({ fileUrl:'', success: false, err: err});  
    }  
}    

exports.getUrlTable = async (req,res) => {
    try{ 
        const response = await Downloads.find({userId: req.user._id});
        res.status(201).json({response,success: true})
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err}); 
    }
}