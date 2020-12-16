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
    description: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        enum: userType,
    },
    preConditions: {
        type: String,
        default: 'None'
    },
    steps : {
        type: String,
        default: 'None'
    },
});

const FAQSchema = new Schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true
    }
});

const topicsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    subTitle: {
        type: String,
        required: true
    },
    icon: String,
    tasks : [taskSchema],
    FAQs: [FAQSchema],
    popular: Boolean,
});

//const Task = mongoose.model('Task', taskSchema);
const Topic = mongoose.model('Topic', topicsSchema);

module.exports = {
      Topic: Topic,
};
module.exports.validateTopics = function(topic){

}

module.exports.validateTask = function(task){
    const schema = {
        taskName: Joi.string().required(),
        description: Joi.string().required(),
        userType: Joi.string(),
        preConditions: Joi.string().default(null),
        steps: Joi.string().default(null)
      
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
