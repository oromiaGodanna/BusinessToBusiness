export {};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const userType = ["Buyer", "Seller", "Admin", "Both"];

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

const topicsSchema = new Schema({
    title: String,
    subTitle: String,
    icon: String,
    tasks : [taskSchema],
    FAQs: [FAQSchema],
    popular: Boolean,
});

const Task = mongoose.model('Task', taskSchema);
const Topic = mongoose.model('Topic', topicsSchema);

module.exports = {
      Topic: Topic,
       Task: Task
};
module.exports.validateTopics = function(topic){

}

module.exports.validateTask = function(task){
    const schema = {
        taskName: Joi.string().required(),
        userType: Joi.string(),
        preConditions: Joi.array().items(Joi.string()).default(null),
        description: Joi.string()
    }
    return Joi.validate(task, schema);
}

module.exports.validateFAQ = function(FAQ){
    const schema = {
        question : Joi.string().required(),
        answer: Joi.string().required()
    }
    return Joi.validate(FAQ, schema);
}
