const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();


const previousBlockHash = '0x9898989898';
const currentBlockData = [
    {
        amount: 20,
        sender: '0x9898989898989',
        recipient: '0x9898989898989'
    },
    {
        amount: 120,
        sender: '0x363633989898989',
        recipient: '0x978585498989898989'
    },
    {
        amount: 220,
        sender: '0x925896398989898989',
        recipient: '0x989894747489898989'
    }
];

console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, 286572));

// Test Nonce Value: 286572
// Generated hash from previous test result: 00003a2d2cc953b5c4e884ea8f075a5db10e0ca4117e113f773b1d00ca81236d