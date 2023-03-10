function Blockchain() {
    this.chain = [];
    this.pendingTransactions = [];
}

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
   const newBlock = {
        blockIndex: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce,
        hash: hash,
        previousBlockHash: previousBlockHash,
   };

   this.pendingTransactions = [];
   this.chain.push(newBlock);

   return newBlock;
}


Blockchain.prototype.getPreviousBlock = function() {
    return this.chain[this.chain.length - 1];
}


Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
    const newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient,
    };

    this.pendingTransactions.push(newTransaction);

    return this.getPreviousBlock()['blockIndex'] + 1
}



module.exports = Blockchain; 