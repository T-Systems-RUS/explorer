'use strict';
module.exports = function(app) {
    var explorerApi = require('../controllers/explorerController');
    app.route('/block/:blockId').get(explorerApi.getBlockInfo);
    app.route('/tx/:transactionId').get(explorerApi.getTransactionInfo);
    app.route('/address/:addressId').get(explorerApi.getAddressInfo);
    app.route('/stats').get(explorerApi.getStats);
};