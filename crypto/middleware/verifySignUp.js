const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUsernameOrEmail = (req, res, next) => {
    // check for duplicate username
    User.findOne({
        where: {
            username: req.body.username,
        },
    }).then((user) => {
        if (user) {
            res.status(400).send({
                error: "That username is already in use!",
            });
            return;
        }

        // check for duplicate email
        User.findOne({
            where: {
                email: req.body.email,
            },
        }).then((user) => {
            if (user) {
                res.status(400).send({
                    error: "That email is already in use!",
                });
                return;
            }

            next();
        });
    });
};

// verify that password meets all requirements
const allowPassword = (req, res, next) => {
    // assign variables to first and second password
    const pass1 = req.body.password;
    const pass2 = req.body.confirmPassword;

    // expression checks to make sure there are numbers, letters, and at least one special character.
    const passMatch = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

    // if passwords don't match
    if (pass1 !== pass2) {
        return res.status(400).send({ error: "Passwords must match!" });
    }

    // if password doesn't meet length/content requirements
    if (pass1.length < 8 || !passMatch.test(pass1)) {
        return res.status(400).send({
            error:
                "Password must be at least 8 characters long and include one special character and one number!",
        });
    }

    next();
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    allowPassword,
};

module.exports = verifySignUp;
