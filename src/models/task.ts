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
    userType: {
        type: String,
        enum: userType,
    },
    preConditions: [String],
    description: String,
});

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
