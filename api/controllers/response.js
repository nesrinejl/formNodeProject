const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


const Response = require('../models/response');


// get all questions
exports.questions_get_all = (req, res, next) => {
    Response.find()
        .select('content _id')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                questions: docs.map(doc => {
                    return {
                        content: doc.content,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/questions/' + doc._id
                        }
                    }
                })
            };

            res.status(200).json(response);
        })
        .catch(
            err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            }
        );
};

// create question

exports.questions_create_question = (req, res, next) => {

    const question = new Question({
        _id: new mongoose.Types.ObjectId(),
        content: req.body.content,
    });
    question.save()
        .then(result => {
            res.status(201).json({
                message: "Question created successfully",
                createdQuestion: {
                    content: result.content,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/questions/' + result._id
                    }
                },
            });
        })
        .catch(
            err => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            });
};


// get question by id 

exports.questions_get_question = (req, res, next) => {
    const id = req.params.questionId;

    Question.findById(id)
        .select("content _id")
        .exec()
        .then(question => {

            if (!question) {
                return res.status(404).json({
                    message: "Question not found !",
                })

            }
            res.status(200).json({
                question: question,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/questions'
                }
            });

        })
        .catch(
            err => {
                console.log(err);
                res.status(500).json({ error: err });
            });

};

//update question

exports.questions_update_question = (req, res, next) => {
    const id = req.params.questionId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Question.update({ _id: id }, { $set: updateOps })
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
};


// delete question

exports.questions_delete_question = (req, res, next) => {
    const id = req.params.questionId;
    Question.remove({ _id: id })
        .exec()
        .then(
            result => {
                res.status(200)
                    .json({
                        message: "Question deleted",
                        request: {
                            type: 'POST',
                            url: 'http://localhost:3000/questions/',
                            body: {
                                content: 'String',

                            }
                        }
                    });
            })
        .catch(
            err => {
                console.log(err);
                res.status(500)
                    .json({ error: err });
            }
        );
}