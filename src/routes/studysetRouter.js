const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Studysets = require('../models/Studysets');

const studysetRouter = express.Router();

studysetRouter.use(bodyParser.json());

studysetRouter.route('/')
.get((req,res,next) => {
    Studysets.find({})
    .then((studysets) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(studysets);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Studysets.create(req.body)
    .then((studyset) => {
        console.log('Studyset Created ', studyset);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(studyset);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /studysets');
})
.delete((req, res, next) => {
    Studysets.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

studysetRouter.route('/:studysetId')
.get((req,res,next) => {
    Studysets.findById(req.params.studysetId)
    .then((studyset) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(studyset);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /studysets/'+ req.params.studysetId);
})
.put((req, res, next) => {
    Studysets.findByIdAndUpdate(req.params.studysetId, {
        $set: req.body
    }, { new: true })
    .then((studyset) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(studyset);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Studysets.findByIdAndRemove(req.params.studysetId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

studysetRouter.route('/:studysetId/exercises')
.get((req,res,next) => {
    Studysets.findById(req.params.studysetId)
    .then((studyset) => {
        if (studyset != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(studyset.exercises);
        }
        else {
            err = new Error('Studyset ' + req.params.studysetId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Studysets.findById(req.params.studysetId)
    .then((studyset) => {
        if (studyset != null) {
            studyset.exercises.push(req.body);
            studyset.save()
            .then((studyset) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(studyset);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Studyset ' + req.params.studysetId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /studysets/'
        + req.params.studysetId + '/exercises');
})
.delete((req, res, next) => {
    Studysets.findById(req.params.studysetId)
    .then((studyset) => {
        if (studyset != null) {
            for (var i = (studyset.exercises.length -1); i >= 0; i--) {
                studyset.exercises.id(studyset.exercises[i]._id).remove();
            }
            studyset.save()
            .then((studyset) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(studyset);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Studyset ' + req.params.studysetId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

studysetRouter.route('/:studysetId/exercises/:exerciseId')
.get((req,res,next) => {
    Studysets.findById(req.params.studysetId)
    .then((studyset) => {
        if (studyset != null && studyset.exercises.id(req.params.exerciseId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(studyset.exercises.id(req.params.exerciseId));
        }
        else if (studyset == null) {
            err = new Error('Studyset ' + req.params.studysetId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Exercise ' + req.params.exerciseId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /studysets/'+ req.params.studysetId
        + '/exercises/' + req.params.exerciseId);
})
.put((req, res, next) => {
    Studysets.findById(req.params.studysetId)
    .then((studyset) => {
        if (studyset != null && studyset.exercises.id(req.params.exerciseId) != null) {
            if (req.body.rating) {
                studyset.exercises.id(req.params.exerciseId).rating = req.body.rating;
            }
            if (req.body.exercise) {
                studyset.exercises.id(req.params.exerciseId).exercise = req.body.exercise;                
            }
            studyset.save()
            .then((studyset) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(studyset);                
            }, (err) => next(err));
        }
        else if (studyset == null) {
            err = new Error('Studyset ' + req.params.studysetId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Exercise ' + req.params.exerciseId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Studysets.findById(req.params.studysetId)
    .then((studyset) => {
        if (studyset != null && studyset.exercises.id(req.params.exerciseId) != null) {
            studyset.exercises.id(req.params.exerciseId).remove();
            studyset.save()
            .then((studyset) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(studyset);                
            }, (err) => next(err));
        }
        else if (studyset == null) {
            err = new Error('Studyset ' + req.params.studysetId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Exercise ' + req.params.exerciseId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = studysetRouter;