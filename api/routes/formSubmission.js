const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const formSubmissionControllers = require("../controllers/formSubmission");

// get request
//router.get('/', formSubmissionControllers.formSubmission_get_all);


// post request 
router.post('/', formSubmissionControllers.formSubmission_create);

// get a formSubmission by userId and formId

router.get('/', formSubmissionControllers.formSubmissions_get_formSubmission);

// post a response 
router.post('/:formSubmissionId/responses', checkAuth, formSubmissionControllers.formSubmissions_post_responses);

//get submitted forms by userId
router.get('/submitted', checkAuth, formSubmissionControllers.getSubmittedFormByUserId);

// patch request update response
router.patch('/:formSubmissionId/responses/:responseId', checkAuth, formSubmissionControllers.formSubmissions_update_responses);


// get nomber of responses (form)
router.get('/forms', checkAuth, formSubmissionControllers.formSubmissions_count_forms);


/**
// delete request 

router.delete('/:formSubmissionId', formSubmissionControllers.formSubmission_delete_formSubmission);

*/
module.exports = router;