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

const nonce = 37;

console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce));

// Test Result 1: 4cb9fa1c628cd3eb991d66e77363e02c7e1a68f39a386e759645f5761dc65e60
// Test Result 2: e49ead1ffc517fc1c22a58cbe9f53362fdecece9d945fbf7fbf33bff26d1fc6c