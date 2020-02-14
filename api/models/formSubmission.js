const mongoose = require("mongoose");


// response Schema
const responseSchema = mongoose.Schema({
    content: {
        type: String,
    },
    responseType: {
        type: String,
        enum: ["QCM", "normal"],
        required: true
    },
    choiceResponses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Choice'
    }],
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }
});

// formSubmission Schema
const formSubmissionSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    form: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    responses: [responseSchema]

})



module.exports = mongoose.model("FormSubmission", formSubmissionSchema);