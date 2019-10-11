'use strict';
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(`http://${process.env.NODE_RPC_HOST}:${process.env.NODE_RPC_PORT}`));
exports.getBlockInfo = function (req, res) {
    console.log(`Requested block ${req.params.blockId} info`);
    web3.eth.getBlock(req.params.blockId).then(function (result) {
        console.log(result);
        res.json(result);
    });
};
exports.getTransactionInfo = function (req, res) {
    console.log(`Requested transaction ${req.params.transactionId} info`);
    web3.eth.getTransaction(req.params.transactionId).then(function (result) {
        console.log(result);
        res.json(result);
    });
};
exports.getAddressInfo = function (req, res) {
    console.log(`Requested address ${req.params.addressId} info`);
    var responseBody = {};
    web3.eth.getBalance(req.params.addressId).then(function (result) {
        console.log(result);
        responseBody.balance = result;
        web3.eth.getTransactionCount(req.params.addressId).then(function (result) {
            console.log(result);
            responseBody.transactionCount = result;
            web3.eth.getCode(req.params.addressId).then(function (result) {
                console.log(result);
                responseBody.code = result;
                res.json(responseBody);
            });
        });
    });

};
exports.getStats = function (req, res) {
    console.log("getting stats");
    let responseBody = {};
    let currentTXnumber;
    web3.eth.getBlockNumber().then(function (result) {
        currentTXnumber = result;
        responseBody.recentTransactions = [];
        let txPromises = [];
        for (let i = 0; i < 10 && currentTXnumber - i >= 0; i++) {
            console.log(`getting tx from block ${(currentTXnumber - i).toString()}`);
            let number = currentTXnumber - i;
            let transactionFromBlock = web3.eth.getTransactionFromBlock(number.toString(), 0);
            transactionFromBlock.then(function (result) { // jshint ignore:line
                console.log(`getting tx from block ${currentTXnumber - i}`);
                responseBody.recentTransactions.push(result);
            });
            txPromises.push(transactionFromBlock);
        }
        const currentBlockNumber = result;
        responseBody.blocks = [];
        let blockPromises = [];
        for (let i = 0; i < 10 && currentBlockNumber - i >= 0; i++) {
            console.log(`getting block ${currentBlockNumber - i}`);
            let number1 = currentBlockNumber - i;
            let block = web3.eth.getBlock(number1.toString());
            blockPromises.push(block);
            block.then(function (result) { // jshint ignore:line
                responseBody.blocks.push(result);
            });
        }
        let promises = [txPromises, blockPromises];
        return Promise.all([].concat.apply([], promises));
    }).then(function () {
        res.json(responseBody);
    });
};