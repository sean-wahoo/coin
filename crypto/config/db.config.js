require("dotenv").config();

module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: process.env.DB_PASSWORD,
    DB: "crypto",
    dialect: "mysql",
    pool: {
        max: 20,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};
