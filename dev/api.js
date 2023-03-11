const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// get entire blockchain
app.get('/blockchain', function(req, res) {
   res.send(bitcoin); 
});

// create a new transaction
app.post('/transaction', function (req, res) {
  console.log(req.body);
    res.send(`The amount of the transaction is ${req.body.amount} bitcoin`);
  })

// mine a block
app.get('/mine', function(req, res) {

var express = require('express')
var app = express()

app.get('/', function(req, res){
  res.send('Hello Moto');
});

app.listen(3000, function() {
    console.log('listening on port 3000!')
});