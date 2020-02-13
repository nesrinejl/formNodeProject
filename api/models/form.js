const mongoose = require("mongoose");


// choice schema for QCM
choiceSchema = mongoose.Schema({
    choiceContent: String,


});


// questions schema
const questionSchema = mongoose.Schema({
    content: {
        type: String,
    },
    requiredQuestion: Boolean,
    questionType: {
        type: String,
        enum: ["QCM", "normal"],
        required: true
    },
    choices: [choiceSchema],


});

// form schema
const formSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    nameForm: { type: String, required: true },
    description: { type: String, required: true },
    questions: [questionSchema],


}, { timestamps: true });

module.exports = mongoose.model("Question", questionSchema);
module.exports = mongoose.model("Choice", choiceSchema);
module.exports = mongoose.model("Form", formSchema);