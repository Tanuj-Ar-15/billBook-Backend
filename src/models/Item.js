
const mongoose = require('mongoose')



const itemshcema = new mongoose.Schema({
    restaurant_id:{
        type : mongoose.Schema.type.objectId,
        ref:"User"
    },
    sizeId:{
        type:mongoose.Schema.types.objectId,
        ref:"Size"
    },
    itemname:{
        type:String,
        require:true,
    },
    type:{
        type:Boolean,
        default:"veg"
    },
    price:[{}]


});

const Item = mongoose.model('Item',itemshcema);


module.exports = Item ;