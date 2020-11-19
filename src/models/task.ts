export {};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const userType = ["Buyer", "Seller", "Admin"];

const taskSchema = new Schema({
    taskName: {
        type: String,
        required: [true, 'The Task Name should be specified']
    },
    description: String,
    userType: {
        type: String,
        enum: userType,
    },
    preConditions: [String],
});
const FAQSchema = new Schema({
    question: String,
    answer: String
});
const catagorySchema = new Schema({
    title: String,
    subTitle: String,
    tasks : [taskSchema],
    FAQ: [FAQSchema],
    popular: Boolean,
    
    
    

})
const Task = mongoose.model('Task', taskSchema);
module.exports = Task;

module.exports.validateTask = function(task){
    const schema = {
        taskName: Joi.string().required(),
        userType: Joi.string(),
        preConditions: Joi.array().items(Joi.string()).default(null),
        description: Joi.string()
    }
    return Joi.validate(task, schema);
}
