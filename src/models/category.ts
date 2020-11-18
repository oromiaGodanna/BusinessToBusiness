var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// add constraints 

var categorySchema = new Schema({

    name:{type:String,require:true},
    subCategories:{type: [String], required:true},
    image:{type:String,require:true},
    
});

var subCategorySchema = new Schema({
    name:{type:String,require:true},
});


exports.Category = mongoose.model("Category", categorySchema);
exports.SubCategory = mongoose.model("SubCategory", subCategorySchema);
