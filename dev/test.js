const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

bitcoin.createNewBlock(5069634, '0x323435', '0x434565');
bitcoin.createNewBlock(302068929, '0x989873', '0x124234');
bitcoin.createNewBlock(506930206, '0x090808', '0x848373');

console.log(bitcoin);