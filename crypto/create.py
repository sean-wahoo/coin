import hashlib
import time

class Block:

    def __init__(self, index, proof_no, prev_hash, data, timestamp = None):

        self.index = index
        self.proof_no = proof_no
        self.prev_hash = prev_hash
        self.data = data
        self.timestamp = timestamp or time.time()

        # first block class

    @property
    def calculate_hash(self):

        block_of_string = "{}{}{}{}{}".format(self.index, self.proof_no, self.prev_hash, self.data, self.timestamp)

        return hashlib.sha256(block_of_string.encode()).hexdigest()

        # calculates the cryptographic hash of every block

    def __repr__(self):

        return "{} - {} - {} - {} - {}".format(self.index, self.proof_no, self.prev_hash, self.data, self.timestamp)

    
class BlockChain:

    def __init__(self):

        self.chain = []
        self.current_data = []
        self.nodes = set()
        self.construct_genesis()

    def construct_genesis(self):

        self.construct_block(proof_no = 0, prev_hash = 0)

        # constructs the inital block

    def construct_block(self, proof_no, prev_hash):

        block = Block(index = len(self.chain), proof_no = proof_no, prev_hash = prev_hash, data = self.current_data)
        self.current_data = []

        self.chain.append(block)
        return block

        #constructs a new block and adds it to the chain

    @staticmethod
    def check_validity(block, prev_block):

        if prev_block.index + 1 != block.index:
            return False

        elif prev_block.calculate_hash != block.prev_hash:
            return False

        elif not BlockChain.verifying_proof(block.proof_no, prev_block.proof_no):
            return False

        elif block.timestamp <= prev_block.timestamp:
            return False

        return True
        
        # checks whether the blockchain is valid

    def new_data(self, sender, recipient, quantity):

        self.current_data.append({
            'sender': sender,
            'recipient': recipient,
            'quantity': quantity
        })
        return True

        # adds a new transaction to the data of the transaction

    @staticmethod
    def proof_of_work(prev_proof):

        # protects the blockchain from attack
        # placeholder algo for discouraging mining, need to make crypto unmineable
        proof_no = 0
        while BlockChain.verifying_proof(proof_no, prev_proof) is False:
            proof_no += 1

        return proof_no

    @staticmethod
    def verifying_proof(last_proof, proof):
        # verifying the proof

        guess = f'{last_proof}{proof}'.encode()
        guess_hash = hashlib.sha256(guess).hexdigest()
        return guess_hash[:4] == "0000"

    @property
    def latest_block(self):

        # returns the last block in the chain

        return self.chain[-1]



blockchain = BlockChain()

print("TIME TO MINE SOME NEW COIN")
print(blockchain.chain)

last_block = blockchain.latest_block
last_proof_no = last_block.proof_no
proof_no = blockchain.proof_of_work(last_proof_no)

blockchain.new_data(
    sender = "0",
    recipient = "sean",
    quantity = 1
)

last_hash = last_block.calculate_hash
block = blockchain.construct_block(proof_no, last_hash)

print("JUST MINED SOME NEW COIN")
print(blockchain.chain)
