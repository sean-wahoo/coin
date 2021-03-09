const app = require("express")();
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

const db = require("./models");

db.sequelize.sync().then(() => {
    console.log("Resync DB");
});

require("./routes/auth.routes")(app);
require("./routes/blockchain.routes")(app);

app.listen(5000, () => {
    console.log("up on port 5000");
});

// TODO: create an entirely in-memory database system that starts
// when the testing function is run and removes itself once it's
// done. this will be used for unit-testing database coupled
// functions.
