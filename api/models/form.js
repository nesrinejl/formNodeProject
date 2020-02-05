const mongoose = require("mongoose");

const formSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    nameForm: { type: String, required: true },
    description: { type: String, required: true },
});
module.exports = mongoose.model("Form", formSchema);