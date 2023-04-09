const User = require('../models/user');

const getLeaderBoard = async (req,res) => {
    try{
       User.find()
       .select('_id name totalExpenses')
       .then (users => {
         const userLeaderBoard = [];
            users.forEach(user => {
                userLeaderBoard.push( {name: user.name, amount : user.totalExpenses || 0});
            });
            userLeaderBoard.sort((a , b) => b.amount - a.amount);
            //console.log(userLeaderBoard);
            res.status(200).json(userLeaderBoard);
       })   
    } catch(err) {
       console.log(err);
       res.status(500).json(err);
    }
}

module.exports = {getLeaderBoard};