const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

bitcoin.createNewBlock(5069634, '0x90809080', '0x03040303', '0x43435464');

bitcoin.createNewTransaction(10, '0x3333333', '0x99999999');

bitcoin.createNewBlock(4369605, '0x9425259080', '0x033323040303', '06565x43435464');

bitcoin.createNewTransaction(16, '0x9993333333', '0x99834999999');
bitcoin.createNewTransaction(110, '0x8883333333', '0x93239999999');
bitcoin.createNewTransaction(610, '0x3999333333', '0x9332349999999');

bitcoin.createNewBlock(30206, '0x676767080', '0x1243323040303', '5x43435464');
console.log(bitcoin.chain[2]);
