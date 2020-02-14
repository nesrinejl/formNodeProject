const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Form = require("../models/form");
const User = require("../models/user");


// delete
exports.user_delete = (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


// update JWT token

exports.update_token = (req, res, next) => {
    const token = req.body.token;
    const id = req.params.userId;

    User.findOneAndUpdate({
        _id: id
    }, {
        token: token
    }).then(user => {
        return res.status(200).json(
            user
        );
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

// get user by email
exports.getUserByEmail = (req, res) => {

    User.find({ email: req.query.email })
        .exec()
        .then(user => {

            if (!user) {
                return res.status(404).json({
                    message: "User not found !",
                })
            }
            return res.status(200).json(

                user[0]
            );
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })

}