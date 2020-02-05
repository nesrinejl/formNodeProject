const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");


const formRoutes = require('./api/routes/form.js');
const formModels = require('./api/models/form');

const mongoose = require("mongoose");

/**Mongoose connect */
const uri = "mongodb+srv://Nesrine:" +
    process.env.MONGO_ATLAS_PW + "@cluster0-is3xf.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log("DB Connection Error:" + err.message);
    });
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**handling CORS */
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,PATCH");
        return res.status(200).json({});
    }
    next();

});

// routes
/** form's routes **/
app.use('/forms', formRoutes);

/**handling errors */

app.use((req, res, next) => {
    const error = new Error('Not found ! ');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        }
    });
});



module.exports = app;