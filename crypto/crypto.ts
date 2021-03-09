import * as crypto from "crypto"


// mostly a testing ground right now


class Transaction {
    constructor(
        public amount: number,
        public sender: string, // public key
        public recipient: string // public key
    ) { console.log(`this: ${this}`) }
    
    toString() {
        return JSON.stringify(this)
    }
}

class Block {

    public nonce = Math.round(Math.random() * 999999999)

    constructor(
        public prev: string,
        public transaction: Transaction,
        // public hash: crypto.Hash,
        public signature: Buffer,
        public ts = Date.now()
    ) { }



    get hash() {
        const str = JSON.stringify(this)
        const hash = crypto.createHash('SHA256')
        hash.update(str).end()
        return hash.digest('hex')
    }

}

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

exports.mine = (amount: number, sender: string, recipient: string) => {
    // const { publicKey, privateKey } = sender;
    const nonce = Math.round(Math.random() * 999999999)


    let solution = 1;
    console.log("Mining...")
    let hash;
    while (true) {
        hash = crypto.createHash("MD5");
        hash.update((nonce + solution).toString()).end();

        const attempt = hash.digest('hex');

        if (attempt.substr(0, 4) === "0000") {
            console.log(`Solved: ${solution}`);
            break;
        }

        solution += 1

    }

    const transaction = new Transaction(amount, sender, recipient)

    return new Block("", transaction, Buffer.alloc(1))

    
}

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
