const mongoose = require('mongoose')



const itemCategoy  = new mongoose.Schema({
     categoryname : {
        type:String,
        require:true,
     }, 
     restaurantId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
     }  
});

const Category = mongoose.model('Category', itemCategoy)

module.exports = Category ; 