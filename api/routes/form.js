const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Form = require('../models/form');

// get request
router.get('/', (req, res, next) => {
    Form.find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(
            err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            }
        );
});


// post request 
router.post('/', (req, res, next) => {

    const form = new Form({
        _id: new mongoose.Types.ObjectId(),
        nameForm: req.body.nameForm,
        description: req.body.description,
    });

    form
        .save()
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log(err));
    res.status(201).json({
        message: "Handling POST request to /form",
        createdForm: form,
    });
});



// get a form by id
router.get('/:formId', (req, res, next) => {
    const id = req.params.formId;

    Form.findById(id)
        .exec()
        .then(doc => {
            console.log("From database :", doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: "No valid entry found for provided ID" });
            }

        })
        .catch(
            err => {
                console.log(err);
                res.status(500).json({ error: err });
            });

});

// patch request (update)
router.patch('/:formId', (req, res, next) => {
    const id = req.params.formId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Form.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(
            result => {
                res.status(200)
                    .json(result);
            })
        .catch(
            err => {
                console.log(err);
                res.status(500)
                    .json({ error: err });
            }
        );
});


// delete request 

router.delete('/:formId', (req, res, next) => {
    const id = req.params.formId;
    Form.remove({ _id: id })
        .exec()
        .then(
            result => {
                res.status(200)
                    .json(result);
            })
        .catch(
            err => {
                console.log(err);
                res.status(500)
                    .json({ error: err });
            }
        );
});
module.exports = router;