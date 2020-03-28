var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var wishlistSchema = new Schema({
    productIds: {type: [String]},
    
});



module.exports = mongoose.model("Wishlist", wishlistSchema);