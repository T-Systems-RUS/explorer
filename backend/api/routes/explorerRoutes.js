'use strict';
module.exports = function(router) {
    var explorerApi = require('../controllers/explorerController');
    router.get('/block/:blockId',explorerApi.getBlockInfo);
    router.get('/tx/:transactionId', explorerApi.getTransactionInfo);
    router.get('/address/:addressId', explorerApi.getAddressInfo);
    router.get('/chain/api');
    router.get('/chain/');
    router.get('/chain/gaslimit');
    router.get('/stats', explorerApi.getStats);
};