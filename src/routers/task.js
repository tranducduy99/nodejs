const express = require("express");
const Task = require('../models/task');
const router = new express.Router();
router.post('/tasks', (req, res) => {
    const task = new Task(req.body);
    task.save().then((result) => {
        res.status(201).send(task)
    }).catch((err) => {
         res.status(400).send(err)
    });
})
router.get('/tasks', (req, res) => {
    Task.find({}).then(tasks => {
        res.status(200).send(tasks)
    }). catch(error => {
        res.status(400).send(error)
    })
})

router.get('/task/:id', (req, res) => {
    const _id = req.params.id;
    Task.findById(_id).then(task => {
        res.status(200).send(task)
    }).catch(error => {
        res.status(400).send(error)
    })
})
module.exports = router;