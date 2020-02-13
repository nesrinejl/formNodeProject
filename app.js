const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// form routes
const formRoutes = require('./api/routes/form.js');

// user routes 
const userRoutes = require('./api/routes/user.js');
// formSubmission routes
const formSubmissionRoutes = require('./api/routes/formSubmission');


mongoose.set('useCreateIndex', true)

/**Mongoose connect */
// const uri = "mongodb+srv://Nesrine:" +
//     process.env.MONGO_ATLAS_PW + "@cluster0-is3xf.mongodb.net/test?retryWrites=true&w=majority";
const uri = "mongodb://heroku_hjrd0sp1:bst0fpi51r73rr97v9erjlg7v8@ds151586.mlab.com:51586/heroku_hjrd0sp1" ;
mongoose.connect(uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log("DB Connection Error:" + err.message);
    });
mongoose.Promise = global.Promise;
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

// ROUTES


/** form's routes **/
app.use('/forms', formRoutes);

/** user's routes */
app.use("/users", userRoutes);

/** formSubmission routes */
app.use("/form-submissions", formSubmissionRoutes);


// front 
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/views/login.html");
})
app.use(express.static('public'));
//handling errors 
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