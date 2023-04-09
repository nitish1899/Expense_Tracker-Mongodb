const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

require("dotenv").config();

var cors = require('cors');

const app = express();

//createWriteStream : reads sequentially from the current file position.
// flag:a  open file for appending . the file is created if it does not exist
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  {flags: 'a'}
);

app.use(cors());

const signupRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premiumFeatures');
const passwordRoutes = require('./routes/forgotPassword');

app.use(express.static('public'));
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/user',signupRoutes);
app.use('/expense',expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium',premiumRoutes);
app.use('/password',passwordRoutes);

app.use((req,res) => {
  console.log('URL : ',req.url);
  console.log('Request has arrived .');
  res.sendFile(path.join(__dirname,`public/${req.url}`));
})

app.use(errorController.get404);

// go to mongodb atlas -> create cluster -> connect to created cluster and get url.
mongoose.connect(`mongodb+srv://nkword1899:${process.env.password}@nitishcluster0.e0nwreq.mongodb.net/Expense_Tracker?retryWrites=true&w=majority`)
.then( result =>{
  app.listen(3000);
})
.catch(err => {
  console.log(err);
})