const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");

// middleware for protecting routes (all but login and register as of now)
const verifyToken = (req, res, next) => {
    // get token from header
    let token = req.headers["authorization"];

    if (!token) {
        return res.status(403).send({
            error: "No token - not authorized!",
        });
    }

    // verify the token against the server key
    jwt.verify(token, config.secret, (err, decoded) => {
        // token could just be invalid or it could have expired (1h)
        if (err) {
            return res.status(401).send({
                error: "Provided token not authorized!",
            });
        }

        // set a user id in the request before sending off. this will be used
        // in some data fetching and verification.
        req.userId = decoded.id;
        next();
    });
};

const authJwt = {
    verifyToken,
};

module.exports = authJwt;
