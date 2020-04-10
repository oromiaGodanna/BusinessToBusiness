const express = require('express');
const router = express.Router();
const Task = require('../models/task');

//Create task
router.post('/create', async( req, res)=>{
    //validate
    const {error} = Task.validateTask(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //create task object
    let task = new Task({
        taskName: req.body.taskName,
        userType: req.body.userType,
        preConditions: req.body.preConditions,
        description: req.body.description
    });
    //save the task object
    try{
        const newTask = await task.save();
        res.json({
            status: 200,
            success: true,
            msg: 'Task successfully Created',
            taks: newTask});
    }catch(error){
        console.log(error);
        res.json({
            status: 400, 
            success: false, 
            msg: 'Failed to create the task', 
            errorMesage: error.errmsg});
    }
});

//Get All Tasks
router.get('/', async(req, res)=>{
    try{
        const tasks = await Task.find();
        res.json({ 
            status: 200, 
            success: true, 
            msg: 'All Tasks successfully retrived', 
            tasks:tasks});
    }catch(error){
        res.json({
            status: 400, 
            success: false,
            msg: 'Failed to create the Task', 
            errorMesage: error.errmsg});
    }
});

//get tasks with a filte
router.get('/search', async(req, res)=>{
    try{
    const userType = req.body.userType;
    const taskName = req.body.taskName;
    var tasks;
    if(userType == undefined && taskName == undefined){
        tasks = await Task.find();
    }else if(userType == undefined){
        tasks = await Task.find({taskName: { $regex : new RegExp(taskName, "i" )}});
    }else if(taskName == undefined){
        tasks = await Task.find({userType: { $regex : new RegExp(userType, "i" )}});
    }else{
        tasks = await Task.find({
        userType: { $regex: new RegExp(userType, "i")}, 
        taskName: { $regex : new RegExp(taskName, "i" )}
    });
    }
    if(!tasks) return res.json({status: 404, success: false, msg: 'Task with this Name can not be found'});
    if(tasks.length == 0) return res.json({status: 200, success: true, msg: 'No tasks Exist with this filter'});
        res.json({
            status: 200,
            success: true,
            msg: 'Tasks retrived',
            tasks: tasks
        });
    }catch(error){
        res.json({
            status: 400,
            success: false,
            msg: 'task retrival failed'
        });
    }
});

//get task by id
router.get('/:id', async(req, res)=>{
    try{
        const task = await Task.findById(req.params.id);
        if(!task)  return res.json({status: 404, success: false, msg: 'A Task specified could not be found'});
        res.json({
            status: 200,
            success: true,
            msg: 'Task retrived',
            task: task});
    }catch(error){
        console.log(Error);
        res.json({
            status: 400,
            success: false,
            msg: 'task retrival failed',
            errorMesage: error.errmsg});
    }

});

//edit Task
router.put('/:id', async(req, res)=>{
    try {
        const editedTask = await Task.findByIdAndUpdate(req.params.id,req.body, {new: true});
        if(!editedTask) return res.json({status: 404, success: false, msg: 'Customer with this Id can not be found'});
        res.json({ 
            status: 200, 
            success: true, 
            msg: 'Task successfully Updated', 
            tasks:editedTask});
        }
    catch(error){
        console.log(error);
        res.json({
            status: 400, 
            success: false,
            msg: ' Task Update failed', 
            errorMesage: error.errmsg});
    }

});

//remove task
router.delete('/:id', async(req, res)=>{
    try{
        const task = await Task.findById(req.params.id);
        if(!task) return res.json({status: 404, success: false,msg: 'A Task with this id can not be found'});
        const deletedTask = await Task.findByIdAndRemove(req.params.id);
        res.json({
            status: 200,
            success: true,
            msg: 'Task successfully edited',
            task: task
        });
    }catch(error){
        res.json({
            status: 400,
            success: false,
            msg: 'task deletion failed',
            errorMesage: error.errmsg
        });
    }
});

module.exports = router;

