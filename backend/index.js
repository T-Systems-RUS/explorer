'use strict';

var express = require('express'),
    app = express(),
    port = process.env.PORT || 4000,
    bodyParser = require('body-parser'),
    cors = require('cors');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
var routes = require('./api/routes/explorerRoutes');
routes(app);

app.listen(port);

console.log('Explorer API started on ' + port);