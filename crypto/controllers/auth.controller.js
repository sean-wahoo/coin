const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { generateKeyPairSync } = require("crypto");

exports.signup = (req, res) => {
    // generate the public and private key for the user. these will
    // function as a wallet (public key) and a unique signature (private key)
    // and be used in transactions to verify identity
    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    // hash the password and create the user
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        publicKey,
        privateKey,
    })
        .then(() => {
            res.send({ message: "User registered successfully!" });
        })
        .catch((err) => {
            res.status(500).send({ error: err.message });
        });
};

exports.signin = (req, res) => {
    // find the user in the database based on the username or email used in registration
    User.findOne({
        where: {
            [Op.or]: [
                { username: req.body.username },
                { email: req.body.email },
            ],
        },
    })
        .then((user) => {
            // if no user exists
            if (!user) {
                return res
                    .status(404)
                    .send({ error: "There is no user with that username!" });
            }

            // compare the password given with the saved hash
            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            // if the password is invalid
            if (!passwordIsValid) {
                return res.status(404).send({
                    accessToken: null,
                    error: "Invalid Password!",
                });
            }

            // create session token signed with the secret saved on the server. include
            // the user's id, username, email, and public key in the token. those fields
            // cannot be changed in the future without reauthorizing the user, so they can
            // be cached within the cookie.
            const token = jwt.sign(
                {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    publicKey: user.publicKey,
                },
                config.secret,
                {
                    expiresIn: "1h",
                }
            );

            // return the same values in the cookie for immediate use, and the cookie data
            // to be saved.
            return res.status(200).send({
                id: user.id,
                username: user.username,
                publicKey: user.publicKey,
                email: user.email,
                sessionToken: token,
            });
        })
        .catch((err) => {
            res.status(500).send({ error: err.message });
        });
};
