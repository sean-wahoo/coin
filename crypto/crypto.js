"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = __importStar(require("crypto"));
var Transaction = /** @class */ (function () {
    function Transaction(amount, sender, // public key
    recipient // public key
    ) {
        this.amount = amount;
        this.sender = sender;
        this.recipient = recipient;
        console.log("this: " + this);
    }
    Transaction.prototype.toString = function () {
        return JSON.stringify(this);
    };
    return Transaction;
}());
var Block = /** @class */ (function () {
    function Block(prev, transaction, 
    // public hash: crypto.Hash,
    signature, ts) {
        if (ts === void 0) { ts = Date.now(); }
        this.prev = prev;
        this.transaction = transaction;
        this.signature = signature;
        this.ts = ts;
        this.nonce = Math.round(Math.random() * 999999999);
    }
    Object.defineProperty(Block.prototype, "hash", {
        get: function () {
            var str = JSON.stringify(this);
            var hash = crypto.createHash('SHA256');
            hash.update(str).end();
            return hash.digest('hex');
        },
        enumerable: true,
        configurable: true
    });
    return Block;
}());
// class Chain {
//     public static instance = new Chain();
//     chain: Block[];
//     constructor() {
//         this.chain = [new Block("", new Transaction(100, 'genesis', 'satoshi'))]
//     }
//     get lastBlock() {
//         return this.chain[this.chain.length - 1]
//     }
//     mine(nonce: number) {
//         let solution = 1;
//         console.log("Mining...")
//         while (true) {
//             const hash = crypto.createHash("MD5"); // change to sha
//             hash.update((nonce + solution).toString()).end();
//             const attempt = hash.digest('hex');
//             if (attempt.substr(0, 4) === "0000") {
//                 console.log(`Solved: ${solution}`);
//                 return solution
//             }
//             solution += 1
//         }
//     }
//     addBlock(transaction: Transaction, senderPublicKey: string, signature: Buffer) {
//         const verifier = crypto.createVerify('SHA256')
//         verifier.update(transaction.toString())
//         const isValid = verifier.verify(senderPublicKey, signature)
//         if (isValid) {
//             const newBlock = new Block(this.lastBlock.hash, transaction)
//             this.mine(newBlock.nonce)
//             this.chain.push(newBlock)
//         }
//     }
// }
// class Wallet {
//     public publicKey: string;
//     public privateKey: string;
//     constructor() {
//         const keypair = crypto.generateKeyPairSync('rsa', {
//             modulusLength: 2048,
//             publicKeyEncoding: { type: 'spki', format: "pem" },
//             privateKeyEncoding: {type: "pkcs8", format: "pem"}
//         })
//         this.privateKey = keypair.privateKey;
//         this.publicKey = keypair.publicKey
//     }
//     sendCoin(amount: number, recipientPublicKey: string) {
//         const transaction = new Transaction(amount, this.publicKey, recipientPublicKey);
//         const sign = crypto.createSign('SHA256')
//         sign.update(transaction.toString()).end()
//         const signature = sign.sign(this.privateKey)
//         Chain.instance.addBlock(transaction, this.publicKey, signature)
//     }
// }
// const satoshi = new Wallet()
// const bob = new Wallet()
// const alice = new Wallet()
// satoshi.sendCoin(50, bob.publicKey)
// bob.sendCoin(23, alice.publicKey)
// alice.sendCoin(4, bob.publicKey)
exports.mine = function (amount, sender, recipient) {
    // const { publicKey, privateKey } = sender;
    var nonce = Math.round(Math.random() * 999999999);
    var solution = 1;
    console.log("Mining...");
    var hash;
    while (true) {
        hash = crypto.createHash("MD5");
        hash.update((nonce + solution).toString()).end();
        var attempt = hash.digest('hex');
        if (attempt.substr(0, 4) === "0000") {
            console.log("Solved: " + solution);
            break;
        }
        solution += 1;
    }
    var transaction = new Transaction(amount, sender, recipient);
    return new Block("", transaction, Buffer.alloc(1));
};
// class Block {
//     public nonce = Math.round(Math.random() * 999999999)
//     constructor(
//         public prevHash: string,
//         public transaction: Transaction,
//         public ts = Date.now()
//     ) { }
//     get hash() {
//         const str = JSON.stringify(this)
//         const hash = crypto.createHash('SHA256')
//         hash.update(str).end()
//         return hash.digest('hex')
//     }
// }
// sendCoin(amount: number, recipientPublicKey: string) {
//         const transaction = new Transaction(amount, this.publicKey, recipientPublicKey);
//         const sign = crypto.createSign('SHA256')
//         sign.update(transaction.toString()).end()
//         const signature = sign.sign(this.privateKey)
//         Chain.instance.addBlock(transaction, this.publicKey, signature)
//     }
// const verifier = crypto.createVerify('SHA256')
//         verifier.update(transaction.toString())
//         const isValid = verifier.verify(senderPublicKey, signature)
//         if (isValid) {
//             const newBlock = new Block(this.lastBlock.hash, transaction)
//             this.mine(newBlock.nonce)
//             this.chain.push(newBlock)
//         }
