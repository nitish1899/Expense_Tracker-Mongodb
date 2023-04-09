const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name : {
    type: String,
    required : true
  },
  email: {
    type: String,
    required : true
  },
  password : {
    type: String,
    required : true
  },
  phNo : {
    type: String,
    required : true
  },
  ispremiumuser : {
    type: Boolean
  },
  totalExpenses : {
     type : Number
  }
});

module.exports = mongoose.model('User',userSchema);