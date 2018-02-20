const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Workouts = require('../models/Workouts');

const workoutRouter = express.Router();

workoutRouter.use(bodyParser.json());

workoutRouter.route('/')
.get((req,res,next) => {
    Workouts.find({})
    .populate('workout')
    .then((workouts) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(workouts);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Workouts.create(req.body)
    .then((workout) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(workout);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /workouts');
})
.delete((req, res, next) => {
    Workouts.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});


workoutRouter.route('/:workoutId')
.get((req,res,next) => {
    Workouts.findById(req.params.workoutId)
    .then((workout) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(workout);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /workouts/'+ req.params.workoutId);
})
.put((req, res, next) => {
    Workouts.findByIdAndUpdate(req.params.workoutId, {
        $set: req.body
    }, { new: true })
    .then((workout) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(workout);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Workouts.findByIdAndRemove(req.params.workoutId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = workoutRouter;