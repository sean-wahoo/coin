module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        email: {
            type: Sequelize.STRING,
        },
        username: {
            type: Sequelize.STRING,
        },
        password: {
            type: Sequelize.STRING,
        },
        publicKey: {
            type: Sequelize.STRING,
        },
        privateKey: {
            type: Sequelize.STRING,
        },
    });
    return User;
};
