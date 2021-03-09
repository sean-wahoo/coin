const controller = require("../controllers/blockchain.controller");
const authJwt = require("../middleware/authJwt");

// blockchain/block oriented routes (very subject to change)
module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // all of these routes are protected, so all users need to be authorized
    app.use(authJwt.verifyToken);

    // current route to add a new block to the blockchain (will likely be moved to middleware
    // due to nature of operation)
    app.post("/api/blockchain/newBlock", controller.insertBlock);
};
