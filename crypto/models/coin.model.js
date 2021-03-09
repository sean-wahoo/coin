module.exports = (sequelize, Sequelize) => {
    const Coin = sequelize.define("coins", {
        hash: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        amount: {
            type: Sequelize.INTEGER,
        },
        owner: {
            type: Sequelize.STRING,
        },
    });
    return Coin;
};
