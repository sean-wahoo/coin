module.exports = (sequelize, Sequelize) => {
    const BlockChain = sequelize.define(
        "blockchain",
        {
            hash: {
                type: Sequelize.STRING,
            },
            prev: {
                type: Sequelize.STRING,
            },
            transaction: {
                type: Sequelize.STRING,
            },
            nonce: {
                type: Sequelize.STRING,
            },
        },
        {
            freezeTableName: true,
        }
    );
    return BlockChain;
};
