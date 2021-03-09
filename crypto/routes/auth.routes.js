const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

// auth oriented routes
module.exports = (app) => {
    app.use((req, res, next) => {
        // set some necessary headers
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept, Authorization"
        );
        next();
    });

    // sign up route
    app.post(
        "/api/auth/signup",
        [
            // make sure to pass through verifcations
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.allowPassword,
        ],

        // sign up user
        controller.signup
    );

    // sign in user (doesn't need signup verifications)
    app.post("/api/auth/signin", controller.signin);
};
