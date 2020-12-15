const express = require('express');
const router = express.Router();
const {Topic,Task } = require('../models/task');

router.post('/', async(req, res)=>{
    let topic = new Topic({
        title: req.body.title,
        subTitle: req.body.subTitle,
        icon: req.body.icon,
        tasks: req.body.tasks
    });
    try{
        const newTopic = await topic.save();
        res.json({
            status: 200,
            success: true,
            topic: newTopic
        })
    }catch(error){
        console.log(error);
        res.json({
            status: 400, 
            success: false, 
            msg: 'Failed to create the catagory', 
            errorMesage: error.errmsg
        });
    }
    });

router.get('/', async(req, res) => {
    try{
        const topics = await Topic.find();
        res.json({ 
            status: 200, 
            success: true, 
            msg: 'All Topics successfully retrived', 
           topics: topics});
    }catch(error){
        res.json({
            status: 400, 
            success: false,
            msg: 'Failed to retrice Topics', 
            errorMesage: error.errmsg});
    }
});

router.put('/addTask/:topic_id', async(req, res)=>{
    const task = {
        taskName : req.body.taskName,
        description : req.body.description,
        userType : req.body.userType,
        preConditions : req.body.preConditions
    }
    try{
        const topic = await Topic.findOneAndUpdate({_id: req.params.topic_id}, {$addToSet: {'tasks' :  task}}, {new: true});
        if(!topic) return res.json({ status: 404, success: false, msg: 'Topic with this Id can not be found' });
        res.json({
            status: 200,
            success: true,
            msg: 'Task Added successfullt',
            topic:topic
        })
    }catch(error){
        res.json({
            status: 400, 
            success: false,
            msg: 'Failed to add task to the Topic specified', 
            errorMesage: error.errmsg});   
    }
});

router.put('/addFAQ/:topic_id', async(req, res)=>{
    const FAQ = {
        question: req.body.question,
        answer: req.body.answer
    }
    try{
        const topic = await Topic.findOneAndUpdate({_id: req.params.topic_id}, {$addToSet: {'FAQs' :  FAQ}}, {new: true});
        if(!topic) return res.json({ status: 404, success: false, msg: 'Topic with this Id can not be found' });
        res.json({
            status: 200,
            success: true,
            msg: 'Question Added successfullt',
            topic:topic
        })
    }catch(error){
        res.json({
            status: 400, 
            success: false,
            msg: 'Failed to add question to the Topic specified', 
            errorMesage: error.errmsg});   
    }

})
// router.put('/updateTask/:topic_id/:task_id', async(req, res) =>{
//     const topic = await Topic.findById(req.params.topic_id);

// });

router.delete('/deleteTopic/:topic_id', async(req, res)=>{
    try{
        const topic = await Topic.findByIdAndRemove(req.params.topic_id);
        res.json({
            status: 200,
            success: true,
            msg: 'topic successfully deleted',
            topic: topic
        })
    }catch(error){
        res.json({
            status: 400,
            success: false,
            msg: 'Topic deletion failed',
            errorMesage: error.errmsg
        });
    }
});

router.delete('/deleteTask/:topic_id/:task_id', async(req, res)=>{
    try{
      const task = await Topic.update(
           {_id: req.params.topic_id},
           {$pull : {'tasks' : {_id: req.params.task_id}}})
       res.json({
        status: 200,
        success: true,
        msg: 'topic successfully deleted',
        task: task });    
    }catch(error){
        res.json({
            status: 400,
            success: false,
            msg: 'Task deletion failed',
            errorMesage: error.errmsg
        });
    }
});

router.delete('/deleteFAQ/:topic_id/:FAQ_id', async(req, res)=>{
    try{
        const FAQ = await Topic.update(
             {_id: req.params.topic_id},
             {$pull : {'FAQs' : {_id: req.params.FAQ_id}}})
         res.json({
          status: 200,
          success: true,
          msg: 'Question successfully deleted',
          FAQ: FAQ });    
      }catch(error){
          res.json({
              status: 400,
              success: false,
              msg: 'Question deletion failed',
              errorMesage: error.errmsg
          });
      }
})




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
router.get('/tasks', async(req, res)=>{
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

//get tasks with a filter
router.get('/search/:filters', async(req, res)=>{
    const filter = JSON.parse(req.params.filters);
    try{
        const tasks = await Task.find(filter);
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

