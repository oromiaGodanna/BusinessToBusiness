var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// add constraints 

var measurementSchema = new Schema({
    name:{type:String,require:true},
    createDate:{type:Date,default: Date.now()},
});

exports.Measurement = mongoose.model("Measurement", measurementSchema);
