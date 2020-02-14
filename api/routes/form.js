const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require('../middleware/check-auth');

const formControllers = require("../controllers/form");
const Form = require('../models/form');

// get request
router.get('/', checkAuth, formControllers.forms_get_all);

// post request 
router.post('/', checkAuth, formControllers.forms_create_form);

// get a form by id
router.get('/:formId', formControllers.forms_get_form);

// patch request (update)
router.patch('/:formId', checkAuth, formControllers.forms_update_form);

// delete request 
router.delete('/:formId', checkAuth, formControllers.forms_delete_form);

// get question by id 
router.get('/:formId/questions/:questionId', checkAuth, formControllers.questions_get_question);

// get all questions
router.get('/questions/:formId', checkAuth, formControllers.questions_get_all);

// delete question 
router.delete('/:formId/questions/:questionId', checkAuth, formControllers.questions_delete_question);

// update question
router.patch('/:formId/questions/:questionId', checkAuth, formControllers.questions_update_question);

// get form by user Id 
router.get('/', checkAuth, formControllers.getFormsByUserId);

// stat
router.get('/:formId/statistics', checkAuth, formControllers.form_stat);

//stat 2
router.get('/:formId/statisticss', checkAuth, formControllers.form_stats);
module.exports = router;