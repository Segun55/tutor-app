const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Lesson = require('../models/lesson');
const Subject = require('../models/subject');

    router.get('/', checkAuth, (req, res, next)=> {
        Lesson.find()
        .select('subject level _id')
        .populate('subject', 'name')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                lessons: docs.map(doc => {
                    return {
                        _id: doc._id,
                        subject: doc.subject,
                        level: doc.level,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/lesson/' + doc._id
                        }
                    }
                })
                
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    });

    router.post('/', checkAuth, (req, res, next)=> {
        Subject.findById(req.body.subjectId)
            .then(subject => {
                if(!subject){
                    return res.status(404).json({
                        message: 'subject not found'
                    });
                }
                const lesson = new Lesson({
                    _id: mongoose.Types.ObjectId(),
                    level: req.body.level,
                    subject: req.body.subjectId
                });
                return lessons.save();
            })
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'Lesson stored', 
                    createdLesson: {
                        _id: result._id,
                        subject: result.subject,
                        level: result.level
                    },
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/lessons/' + result.id
                    }
                });
            })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    });


    router.get('/:lessonId', checkAuth, (req, res, next)=> {
        Lesson.findById(req.params.lessonId)
        .populate('subject')
        .exec()
        .then(lesson => {
            if (!lesson){
                return res.status(404).json({
                    message: 'Lesson not found'
                })
            }
            res.status(200).json({
                lesson: lesson,
                request: {
                    type: 'GET',
                    url: 'htt://localhost:3000/lessons'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error:err
            });
        });
    });


    router.delete('/:lessonId', checkAuth, (req, res, next)=> {
        Lesson.remove({ _id: req.params.lessonId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Lesson deleted',
                request: {
                    type: 'POST',
                    url: 'htt://localhost:3000/lessons',
                    body: {subjectId: 'ID', level: 'Number'}
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    });
quantity
    // why the error code
module.exports  = router;
