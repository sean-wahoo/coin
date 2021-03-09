const db = require("../models");
const BlockChain = db.blockchain;
const crypto = require("crypto");
const User = db.user;
const { mine } = require("../crypto.js");
const V = require("max-validator");

const validateTransaction = (Transaction) => {
    try {
        // declare transaction schematic
        const transactionSchema = {
            amount: "required|number",
            sender: "required|string",
            recipient: "required|string",
        };

        const validated = V.validate(Transaction, transactionSchema);

        // all that needs to be checked right now is that the transaction is shaped correctly
        if (!validated.hasError) return true;
        else {
            return false;
        }
    } catch (err) {
        console.error(err);
        return false;
    }
};

const validateBlock = (Block, senderPublicKey, signature) => {
    try {
        // declare schema of block
        const blockSchema = {
            nonce: "required|number",
            hash: "required",
            prev: "required",
            ts: "required",
            transaction: "required|json",
            signature: "required",
        };

        // we need to check not only the shape of the block, but also that it is a valid signature
        const validated = V.validate(Block, blockSchema);
        if (!validated.hasError) {
            const verifier = crypto.createVerify("SHA256");
            verifier.update(Block.transaction.toString());

            // make sure that the private key used to sign the transaction has
            // the same public key pair
            const isValid = verifier.verify(senderPublicKey, signature);

            if (isValid) {
                return true;
            }

            return false;
        } else {
            console.log(validated.hasError);
            return false;
        }
    } catch (err) {
        console.error(err);
        return false;
    }
};

exports.insertBlock = (req, res, next) => {
    const userId = req.userId; // user id of sender
    const Block = mine(
        req.body.amount, // amount of coin to send
        req.body.sender, // public key of who is sending it
        req.body.recipient // public key of who is recieving it
    );

    // find the sender in the user database
    User.findOne({
        where: {
            id: userId,
        },
    })
        .then((user) => {
            // find the most recent block for the previous hash field on new block
            BlockChain.findAll({
                limit: 1,
                order: [["createdAt", "DESC"]],
            })
                .then((latestBlock) => {
                    // get private key of who is sending in transaction to create signature
                    // this will later be verified by the public key
                    const privateKey = user.privateKey;

                    // create signature
                    const sign = crypto.createSign("SHA256");
                    sign.update(Block.transaction.toString()).end();
                    const signature = sign.sign(privateKey);

                    // assign signature to block data for server validation
                    Block.signature = signature;

                    // assign previous hash to new block
                    Block.prev = latestBlock.hash || "";

                    // check if transaction and block are valid for creation
                    if (
                        validateTransaction(Block.transaction) &&
                        validateBlock(
                            Block,
                            Block.transaction.sender,
                            Block.signature
                        )
                    ) {
                        // make transaction into string so it can be inserted
                        Block.transaction = Block.transaction.toString();

                        // insert block
                        BlockChain.create(Block);
                        res.send({
                            message: "Block inserted successfully!",
                        });
                        next();
                    }

                    return res.send({ error: "There was an error somewhere!" });
                })
                .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
};
