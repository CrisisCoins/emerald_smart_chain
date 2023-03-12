const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const rp = require("request-promise");
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

// Creates a new transaction
app.post("/transaction", function (req, res) {
  const newTransaction = req.body;
  const blockIndex =
    bitcoin.mergeTransactionWithPendingTransactions(newTransaction);
  res.json({
    note: `The transaction will be merged into block ${blockIndex}.`,
  });
});

// Creates new transaction and broadcast to all nodes
app.post("/transaction/broadcast", function (req, res) {
  const newTransaction = bitcoin.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  bitcoin.mergeTransactionWithPendingTransactions(newTransaction);

  const requestPromises = [];
  bitcoin.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + "/transaction",
      method: "POST",
      body: newTransaction,
      json: true,
    };
    requestPromises.push(rp(requestOptions));
  });
  Promise.all(requestPromises).then((data) => {
    res.json({
      note: "A transaction was created and broadcasted successfully...",
    });
  });
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
  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
  const requestPromises = [];
  bitcoin.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + "/receive-new-blockInstance",
      method: "POST",
      body: { newBlock: newBlock },
      json: true,
    };
    requestPromises.push(rp(requestOptions));
  });
  Promise.all(requestPromises)
    .then((data) => {
      const requestOptions = {
        uri: bitcoin.currentNodeUrl + "/transaction/broadcast",
        method: "POST",
        body: {
          amount: 6.25,
          sender: "0x000000000",
          recipient: nodeAddress,
        },
        json: true,
      };
      return rp(requestOptions);
    })
    .then((data) => {
      res.json({
        note: "A new block was mined successfully...",
        block: newBlock,
      });
    });
});

// registers a new node and broadcast new node to the current network
app.post("/register-and-broadcast-node", function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1)
    bitcoin.networkNodes.push(newNodeUrl);

  const registerNodePromises = [];
  bitcoin.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + "/register-node",
      method: "POST",
      body: { newNodeUrl: newNodeUrl },
      json: true,
    };
    registerNodePromises.push(rp(requestOptions));
  });
  Promise.all(registerNodePromises)
    .then((data) => {
      const bulkRegistrationOptions = {
        uri: newNodeUrl + "/register-nodes-bulk",
        method: "POST",
        body: {
          allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl],
        },
        json: true,
      };

      return rp(bulkRegistrationOptions);
    })
    .then((data) => {
      res.json({
        note: "A new node has been registered with the network successfully...",
      });
    });
});

// registers node with the other networks nodes
app.post("/register-node", function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  const nodeNotCurrentlyExisting =
    bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
  const notNewNode = bitcoin.currentNodeUrl !== newNodeUrl;
  if (nodeNotCurrentlyExisting && notNewNode)
    bitcoin.networkNodes.push(newNodeUrl);
  res.json({
    note: "A new block instance has been mined and broadcasted successfully...",
  });
});

// register all present nodes together with new node together
app.post("/register-nodes-bulk", function (req, res) {
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach((networkNodeUrl) => {
    const nodeAlreadyInNetworkNodeArray =
      bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
    const notSameNode = bitcoin.currentNodeUrl !== networkNodeUrl;
    if (nodeAlreadyInNetworkNodeArray && notSameNode)
      bitcoin.networkNodes.push(networkNodeUrl);
  });

  res.json({
    note: "Bulk registration of nodes successfully registered on all nodes...",
  });
});

app.listen(port, function () {
  console.log(`listening on port ${port}...`);
});
