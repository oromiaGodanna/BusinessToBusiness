var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// add constraints 

var cartEntrySchema = new Schema({

    productId:{type:String},
    amount:{type:Number},
    price:{type:Number},
    
});

var cartSchema = new Schema({
    cartEntries:[cartEntrySchema]
    
});

module.exports = mongoose.model("Cart", cartSchema);

