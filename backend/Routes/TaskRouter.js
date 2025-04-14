const express = require('express');
const { createTask, FetchAllTasks, updateTaskById, deleteTaskById } = require('../Controllers/TaskController');
const router = express.Router();
//To get all the tasks
router.get('/',FetchAllTasks)

//To create a rask
router.post('/',createTask)

//To update a rask
router.put('/:id',updateTaskById)

//To delete a rask
router.delete('/:id',deleteTaskById)





module.exports = router;