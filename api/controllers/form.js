const mongoose = require("mongoose");

const Form = require("../models/form");

const FormSubmission = require('../models/formSubmission');

// get all forms
exports.forms_get_all = (req, res, next) => {
    Form.find()
        .select('nameForm description questions user timestamp _id')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                forms: docs.map(doc => {
                    return {
                        name: doc.nameForm,
                        description: doc.description,
                        questions: doc.questions,
                        user: doc.user,
                        timestamp: doc.timestamp,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/forms/' + doc._id
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

// create form 
exports.forms_create_form = (req, res, next) => {

    const form = new Form({
        _id: new mongoose.Types.ObjectId(),
        nameForm: req.body.nameForm,
        description: req.body.description,

        questions: req.body.questions,
    });
    form.save()
        .then(result => {
            res.status(201).json({
                message: "Form created successfully",
                createdForm: {
                    name: result.nameForm,
                    description: result.description,
                    questions: result.questions,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/forms/' + result._id
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
// get form by id
exports.forms_get_form = (req, res, next) => {
    const id = req.params.formId;

    Form.findById(id)
        .select("nameForm description questions user timestamp _id")
        .exec()
        .then(form => {

            if (!form) {
                return res.status(404).json({
                    message: "Form not found !",
                })

            }
            res.status(200).json(
                form,
            );

        })
        .catch(
            err => {
                console.log(err);
                res.status(500).json({ error: err });
            });
}

// get forms by user Id
exports.getFormsByUserId = (req, res, next) => {
    const userId = req.query.userId;

    Form.find(userId)
        .select("nameForm description questions user timestamp _id")
        .exec()
        .then(forms => {

            if (!forms) {
                return res.status(404).json({
                    message: "Form not found !",
                })

            }
            res.status(200).json(
                forms,
            );

        })
        .catch(
            err => {
                console.log(err);
                res.status(500).json({ error: err });
            });
}



// delete form
exports.forms_delete_form = (req, res, next) => {
    const id = req.params.formId;
    Form.remove({ _id: id })
        .exec()
        .then(
            result => {
                res.status(200)
                    .json({
                        message: "Form deleted",
                        request: {
                            type: 'POST',
                            url: 'http://localhost:3000/forms/',
                        }
                    });
            })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}


// update form
exports.forms_update_form = (req, res, next) => {
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
}

// get questions by formId
exports.questions_get_all = (req, res, next) => {
    const id = req.params.formId;

    Form.findById(id)
        .select("questions")
        .exec()
        .then(questions => {

            if (!questions) {
                return res.status(404).json({
                    message: "Questions not found !",
                })

            }
            res.status(200).json(
                questions

            );

        })

    .catch(
        err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

}



// get question by Question ID

exports.questions_get_question = (req, res, next) => {
    const formId = req.params.formId;
    const questionId = req.params.questionId;

    // this.questions_get_all;

    Form.findById(formId)
        .select("questions")
        .exec()
        .then(form => {

            if (!form) {
                return res.status(404).json({
                    message: "Form not found !",
                })
            };
            for (let i = 0; i < form.questions.length; i++) {

                if (form.questions[i]._id == questionId) {

                    res.status(200).json({
                        question: form.questions[i],
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/forms'
                        }
                    });
                }
            };
        })
        .catch(
            err => {
                console.log(err);
                res.status(500)
                    .json({ error: err });
            }
        );
}

//delete question 
exports.questions_delete_question = (req, res, next) => {
    const formId = req.params.formId;
    const questionId = req.params.questionId;

    Form.update({ _id: formId }, {
        $pull: {
            questions: {
                _id: questionId
            }
        }
    })

    .exec()
        .then(form => {
            if (!form) {
                return res.status(404).json({
                    message: "Form not found !",
                })
            };
            res.status(200).json({
                form: form,
                message: "Question deleted successfully",
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/forms/' + formId
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



// update a question
exports.questions_update_question = (req, res, next) => {
    const formId = req.params.formId;
    const questionId = req.params.questionId;

    Form.update({ _id: formId }, {
            $addToSet: { responses: req.body.responses }

        })
        .exec()
        .then(form => {
            if (!form) {
                return res.status(404).json({
                    message: "Form not found !",
                })
            };
            res.status(200).json({
                form: form,
                message: "Question updated successfully",
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/forms/' + formId
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
};

// stat
exports.form_stat = (req, res, next) => {
    formId = req.params.formId;

    Form.findById(formId)
        .exec()
        .then(
            form => {
                if (!form) {
                    return res.status(404).json({
                        message: "Form  not found !",
                    })
                };
                FormSubmission.find({ form: formId })
                    .exec()
                    .then(
                        formSubmissions => {
                            var formStatistic = {};
                            formStatistic.questions = [];


                            // var form = {...form }._doc;
                            console.log(form);
                            for (let i = 0; i < form.questions.length; i++) {

                                if (form.questions[i].questionType == "normal") {

                                    //form.questions[i]['responses'] = [];
                                    var responses = [];
                                    for (let j = 0; j < formSubmissions.length; j++) {

                                        var response = formSubmissions[j].responses.find((res) => res.question.equals(form.questions[i]._id));

                                        if (response) {
                                            //form.questions[i]['responses'].push(response.content);
                                            responses.push(response.content);
                                        }
                                    };
                                    console.log(responses);
                                    //  form.questions[i].responses = responses;
                                    formStatistic.questions.push({
                                        _id: form.questions[i]._id,
                                        responses: responses,
                                        choices: []

                                    });

                                } else if (form.questions[i].questionType == 'QCM') {

                                    var choices = [];
                                    for (var j = 0; j < form.questions[i].choices.length; j++) {

                                        // form.questions[i].choices[j]['choiceCount'] = 0;
                                        var choiceCount = 0;
                                        for (let k = 0; k < formSubmissions.length; k++) {

                                            var response = formSubmissions[k].responses.find((res) => res.question.equals(form.questions[i]._id));

                                            if (response) {

                                                if (response.choiceResponses.find((choice) => choice.equals(form.questions[i].choices[j]._id))) {
                                                    // form.questions[i].choices[j]['choiceCount'] = form.questions[i].choices[j]['choiceCount'] + 1;
                                                    choiceCount = choiceCount + 1;
                                                }
                                            }

                                        }
                                        console.log(choiceCount);
                                        //form.questions[i].choices[j].choiceCount = choiceCount;
                                        // form.questions[i].choices[j] = {...form.questions[i].choices[j], choiceCount: choiceCount };
                                        choices.push({
                                            _id: form.questions[i].choices[j]._id,
                                            choiceCount: choiceCount
                                        });
                                    }
                                    formStatistic.questions.push({
                                        _id: form.questions[i]._id,
                                        responses: [],
                                        choices: choices
                                    });

                                }

                            };
                            res.status(200).json({
                                form: formStatistic,
                                request: {
                                    type: 'GET',
                                    url: 'http://localhost:3000/forms'
                                }
                            });
                        }


                    )
                    .catch(
                        err => {
                            console.log(err);
                            res.status(500).json({ error: err });
                        });


            })
        .catch(
            err => {
                console.log(err);
                res.status(500).json({ error: err });
            });
}




//stats 2
exports.form_stats = (req, res, next) => {
    formId = req.params.formId;

    Form.findById(formId)
        .exec()
        .then(
            form => {
                if (!form) {
                    return res.status(404).json({
                        message: "Form  not found !",
                    })
                };
                FormSubmission.find({ form: formId })
                    .exec()
                    .then(
                        formSubmissions => {

                            console.log(form);
                            for (let i = 0; i < form.questions.length; i++) {

                                if (form.questions[i].questionType == "normal") {

                                    form.questions[i]['responses'] = [];

                                    for (let j = 0; j < formSubmissions.length; j++) {

                                        var response = formSubmissions[j].responses.find((res) => res.question.equals(form.questions[i]._id));

                                        if (response) {
                                            form.questions[i]['responses'].push(response.content);
                                        }

                                    };
                                    console.log(form.questions[i]['responses']);
                                } else if (form.questions[i].questionType == 'QCM') {


                                    for (var j = 0; j < form.questions[i].choices.length; j++) {

                                        form.questions[i].choices[j]['choiceCount'] = 0;

                                        for (let k = 0; k < formSubmissions.length; k++) {

                                            var response = formSubmissions[k].responses.find((res) => res.question.equals(form.questions[i]._id));

                                            if (response) {

                                                if (response.choiceResponses.find((choice) => choice.equals(form.questions[i].choices[j]._id))) {
                                                    form.questions[i].choices[j]['choiceCount'] = form.questions[i].choices[j]['choiceCount'] + 1;

                                                }
                                            }

                                        }
                                        console.log(form.questions[i].choices[j]['choiceCount']);
                                    }

                                };

                            };
                            res.status(200).json({
                                form: form,
                                request: {
                                    type: 'GET',
                                    url: 'http://localhost:3000/forms'
                                }
                            });
                        }


                    )
                    .catch(
                        err => {
                            console.log(err);
                            res.status(500).json({ error: err });
                        });


            })
        .catch(
            err => {
                console.log(err);
                res.status(500).json({ error: err });
            });
}