const express = require('express');
const router = express.Router(); 
const mongoose = require('mongoose');
const Subject = require('../models/Subject');
const checkAuth = require('../middleware/check-auth');

// get request for all subjects
router.get('/', (req, res, next) =>{
    Subject.find()
    .select('name level _id')
    .exec()
    .then(doc =>{
        const response = {
            count: docs.length,
            subjects: docs.map(doc => {
                return{
                    name: doc.name,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/subjects/' + doc_id
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    });
});


//post request
router.post('/', checkAuth, (req, res, next) =>{
    const subject = new Subject({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
     
    });
        subject
        .save()
        .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Handling POST requests to /subjects',
            createdSubject: {
                name: result.name,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/subjects/' + result.id
                }
            }
        });    
        })
        .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
            });
        }); 
});

//get request for a single subject..
router.get('/:subjectId', (req, res, next) =>{
    const id = req.params.subjectId;
    Subject.findById(id)
    .select('name level _id')
    .exec()
    .then(doc => {
        console.log('From Database', doc);
        if (doc){
            res.status(200).json({
                subject: doc,
                type: 'GET',
                description: 'Get a subject',
                url: 'http://localhost:3000/subjects/'
            });}
            else{
                res.status(404).json({message: 'No valid entry found for the provided ID '})
            }
    }) 
    .catch(err =>{
        console.log(err);
        res.status(500).json({error:err});
    });
});


//update request for a subject
router.patch('/:sujectId', checkAuth, (req, res, next) =>{
    const id = req.params.subjecttId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    subject.update({_id : id}, {$set: updateOps})
    .exec()
    .then(result =>{
        res.status(200).json({
            message: 'Subject updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/subjects/' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });

});


//delete request for a subject
router.delete('/:subjectId', checkAuth, (req, res, next) =>{
    const id = req.params.subjectId;
   Subject.remove({_id : id})
    .exec()
    .then(res => {
        res.status(200).json({
            message: 'Subject deleted'
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err
        });  
    });
});


module.exports = router;