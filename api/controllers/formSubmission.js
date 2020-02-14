const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


const FormSubmission = require('../models/formSubmission');

const Form = require('../models/form');
// create formSubmission

exports.formSubmission_create = (req, res, next) => {

    const formSubmission = new FormSubmission({
        _id: new mongoose.Types.ObjectId(),
        form: req.body.form,
        user: req.body.user,
        responses: req.body.responses
    });
    formSubmission.save()
        .then(result => {
            Form.find({ _id: req.body.form })
                .exec()
                .then(
                    form => {
                        console.log(form.questions);
                        res.status(201).json({
                            message: "formSubmission created successfully",
                            createdFormSubmission: {
                                formId: result.formId,
                                userId: result.userId,
                                responses: result.responses,
                                _id: result._id,
                                request: {
                                    type: 'GET',
                                    url: 'http://localhost:3000/form-submissions/' + result._id
                                }
                            },
                        })
                    }
                )
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        message: "question does not exist",
                        error: err
                    })
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


// get formSubmission by userId and formId

exports.formSubmissions_get_formSubmission = (req, res, next) => {
    const formId = req.params.formId;
    const userId = req.params.userId;

    FormSubmission.find(userId, formId)
        .select("form user responses _id")
        .exec()
        .then(formSubmission => {

            if (!formSubmission) {
                return res.status(404).json({
                    message: "FormSubmission not found !",
                })

            }
            res.status(200).json(formSubmission);

        })
        .catch(
            err => {
                console.log(err);
                res.status(500).json({ error: err });
            });

};

// add response 
exports.formSubmissions_post_responses = (req, res, next) => {
    const formSubmissionId = req.params.formSubmissionId;
    FormSubmission.update({ _id: formSubmissionId }, { $addToSet: { responses: req.body.responses } })
        .exec()
        .then(formSubmission => {
            if (!formSubmission) {
                return res.status(404).json({
                    message: "FormSubmission not found !",
                })
            }
            res.status(200).json({
                formSubmission: formSubmission,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/form-submissions'
                }
            })
        })
        .catch(
            err => {
                console.log(err);
                res.status(500).json({ error: err });
            });
};

// get submitted forms by userId 
exports.getSubmittedFormByUserId = (req, res) => {
    console.log('ok');
    const userId = req.query.userId;

    FormSubmission.find({ user: userId })
        .exec()
        .then(
            formSubmissions => {

                var formIds = formSubmissions.map((formSubmission) => formSubmission.form);
                console.log(formIds.length);
                //var submittedForms = [];
                Form.find({
                        '_id': { $in: formIds }
                    })
                    .exec()
                    .then(
                        submittedForms => {
                            res.status(200).json(submittedForms);
                        }
                    )
                    .catch();
            }
        )
        .catch(
            err => {
                console.log(err);
                res.status(500).json({ error: err });
            });
};


// update responses

exports.formSubmissions_update_responses = (req, res, next) => {
    const formSubmissionId = req.params.formSubmissionId;
    const responseId = req.params.responseId;

    FormSubmission.findOneAndUpdate(formSubmissionId)
        .exec()
        .then(
            formSubmission => {

                if (!formSubmission) {
                    return res.status(404).json({
                        message: "Form submission not found !",
                    })
                };
                for (let i = 0; i < formSubmission.responses.length; i++) {

                    if (formSubmission.responses[i]._id == responseId) {

                        res.status(200).json({
                            responses: req.body.responses,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/forms'
                            }
                        });
                    }
                };
            }
        )
        .catch(
            err => {
                console.log(err);
                res.status(500).json({ error: err });
            }
        );

}


// get a number of users by fomrId
exports.formSubmissions_count_forms = (req, res, next) => {
    formId = req.params.formId;

    FormSubmission.find(formId)

    .exec()
        .then(
            docs => {
                const response = {
                    count: docs.length,
                    formSubmissions: docs.map(doc => {
                        return {
                            form: doc.form,
                            user: doc.user,
                            responses: doc.responses,
                            _id: doc._id
                        }
                    })
                }
                res.status(200).json(response);
            })
        .catch(
            err => {
                console.log(err);
                res.status(500).json({ error: err });
            });
}

// stats