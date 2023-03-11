const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const Blockchain = require("./blockchain");


const port = process.argv[2];

const uuid = require("uuid").v1;
const nodeAddress = uuid().split("-").join("");

const bitcoin = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// get entire blockchain
app.get("/blockchain", function (req, res) {
  res.send(bitcoin);
});

// create a new transaction
app.post("/transaction", function (req, res) {
  const blockIndex = bitcoin.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  res.json({ note: `A new transaction will be added to Block ${blockIndex}.` });
});

// create a new block
app.get("/mine", function (req, res) {
  const lastBlock = bitcoin.getPreviousBlock();
  const previousBlockHash = lastBlock["hash"];
  const currentBlockData = {
    transactions: bitcoin.pendingTransactions,
    blockIndex: lastBlock["blockIndex"] + 1,
  };
  const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = bitcoin.hashBlock(
    previousBlockHash,
    currentBlockData,
    nonce
  );

  bitcoin.createNewTransaction(6.25, "0x00000000", nodeAddress);

  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
  res.json({ note: "A new block was mined successfully...", block: newBlock });
});

app.listen(port, function () {
  console.log(`listening on port ${port}...`);
});
