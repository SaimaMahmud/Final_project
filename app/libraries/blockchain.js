var Block = require('./block');

function Transaction(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
}

function BlockChain(difficulty) {
    this.createGenesisBlock = function() {
        return new Block(new Date(), [], null);
    }
    this.chain = [this.createGenesisBlock()];
    this.difficulty = difficulty;
    this.pendingTransactions = [];
    this.miningReward = 100;
    this.getLatestBlock = function() {
        return this.chain[this.chain.length - 1];
    }

    this.minePendingTransactions = function(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions)
        block.mineBlock(this.difficulty);
        block.previousHash = this.chain[this.chain.length - 1].hash
        console.log('Block mined successfully.')
        this.chain.push(block)
		console.log('Miner is ' + miningRewardAddress)
        this.pendingTransactions = [
            new Transaction('Mining Reward', miningRewardAddress, this.miningReward)
        ]
    }

    this.createTransaction = function(transaction) {
        this.pendingTransactions.push(transaction)
    }

    this.getBalanceOfAddress = function(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= parseInt(trans.amount);
                }
                if (trans.toAddress === address) {
                    balance += parseInt(trans.amount);
                }
            }
        }
        return balance;
    }

    this.isChainValid = function() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
            return true;
        }
    }
	
	this.reset = function(difficulty) {
		this.chain = [this.createGenesisBlock()];
		this.difficulty = difficulty;
		this.pendingTransactions = [];
		this.miningReward = 100 * this.difficulty;
	}
}

module.exports = BlockChain;