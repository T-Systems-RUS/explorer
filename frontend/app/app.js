// begin AltSheets changes
///////////////////////////////
// TODO: Put go into a config.js
// But how to include a file from local?

var GETH_HOSTNAME = "localhost";	// put your IP address!
var APP_HOSTNAME = "See package.json --> scripts --> start: Change 'localhost'!!!";

var GETH_RPCPORT = 8545; 		// for geth --rpcport GETH_RPCPORT
var APP_PORT = "See package.json --> scripts --> start: Perhaps change '8000'";

// this is creating the corrected geth command
var WL = window.location;
var geth_command = "geth --rpc --rpcaddr " + GETH_HOSTNAME + " --rpcport " + GETH_RPCPORT + '\
 --rpcapi "web3,eth" ' + ' --rpccorsdomain "' + WL.protocol + "//" + WL.host + '"';

////////////////////////////////////////////////////
//end AltSheets changes


'use strict';


angular.module('environment', []).
provider('envService', function() {

    'use strict';

    var local = {};

    local.pregQuote = function(string, delimiter) {
        return (string + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
    };

    local.stringToRegex = function(string) {
        return new RegExp(local.pregQuote(string).replace(/\\\*/g, '.*').replace(/\\\?/g, '.'), 'g');
    };

    this.environment = 'development'; // default
    this.data = {}; // user defined environments data

    /**
     * config() allow pass as object the
     * desired environments with their domains
     * and variables
     *
     * @param {Object} config
     * @return {Void}
     */
    this.config = function(config) {
        this.data = config;
    };

    /**
     * set() set the desired environment
     * based on the passed string
     *
     * @param {String} environment
     * @return {Void}
     */
    this.set = function(environment) {
        this.environment = environment;
    };

    /**
     * get() returns the current environment
     *
     * @return {Void}
     */
    this.get = function() {
        return this.environment;
    };

    /**
     * read() returns the desired variable based
     * on passed argument
     *
     * @param {String} variable
     * @return {Void}
     */
    this.read = function(variable) {
        if (typeof variable === 'undefined' || variable === '' || variable === 'all') {
            return this.data.vars[this.get()];
        }
        else if (typeof this.data.vars[this.get()][variable] === 'undefined') {
            return this.data.vars.defaults[variable];
        }

        return this.data.vars[this.get()][variable];
    };

    /**
     * is() checks if the passed environment
     * matches with the current environment
     *
     * @param {String} environment
     * @return {Boolean}
     */
    this.is = function(environment) {
        return (environment === this.environment);
    };

    /**
     * check() looks for a match between
     * the actual domain (where the script is running)
     * and any of the domains under env constant in
     * order to set the running environment
     *
     * @return {Void}
     */
    this.check = function() {
        var	self = this,
            location = window.location.host,
            matches = [],
            keepGoing = true;

        angular.forEach(this.data.domains, function(v, k) {
            angular.forEach(v, function(v) {
                if (location.match(local.stringToRegex(v))) {
                    matches.push({
                        environment: k,
                        domain: v
                    });
                }
            });
        });

        angular.forEach(matches, function(v, k) {
            if (keepGoing) {
                if (location === v.domain) {
                    keepGoing = false;
                }

                void 0;
                self.environment = v.environment;
            }
        });
    };

    this.$get = function() {
        return this;
    };
});


angular.module('ethExplorer', ['environment', 'ngRoute', 'ui.bootstrap', 'filters', 'ngSanitize'])
    .config(['envServiceProvider', '$routeProvider',
        function (envServiceProvider, $routeProvider) {
            $routeProvider.when('/', {
                templateUrl: 'views/main.html',
                controller: 'mainCtrl'
            }).when('/block/:blockId', {
                templateUrl: 'views/blockInfos.html',
                controller: 'blockInfosCtrl'
            }).when('/tx/:transactionId', {
                templateUrl: 'views/transactionInfos.html',
                controller: 'transactionInfosCtrl'
            }).when('/address/:addressId', {
                templateUrl: 'views/addressInfos.html',
                controller: 'addressInfosCtrl'
            }).// info page with links:
            when('/chain/api', {
                templateUrl: 'views/api/api.html',
                controller: 'chainInfosCtrl'
            }).// getBlock (current) & getBlock (last)
            when('/chain/', {
                templateUrl: 'views/chainInfos.html',
                controller: 'chainInfosCtrl'
            }).when('/chain/gaslimit', {
                templateUrl: 'views/api/gaslimit.html',
                controller: 'chainInfosCtrl'
            }).when('/chain/difficulty', {
                templateUrl: 'views/api/difficulty.html',
                controller: 'chainInfosCtrl'
            })./*
            // fast = doesn't need to getBlock any block
            when('/chain/blocknumber', {
                templateUrl: 'views/api/blocknumber.html',
                controller: 'fastInfosCtrl'
            }).
            when('/chain/supply', {
                templateUrl: 'views/api/supply.html',
                controller: 'fastInfosCtrl'
            }).
            when('/chain/mined', {
                templateUrl: 'views/api/mined.html',
                controller: 'fastInfosCtrl'
            }).

            // begin of: not yet, see README.md
            when('/chain/supply/public', {
                templateUrl: 'views/api/supplypublic.html',
                controller: 'fastInfosCtrl'
            }).*/
            // end of: not yet, see README.md

            otherwise({
                redirectTo: '/'
            });
            envServiceProvider.config({
                domains: {
                    development: ['localhost'],
                    test: ['test.dltstax.net'],
                    production: ['hackathon.dltstax.net']
                },
                vars: {
                    development: {
                        apiUrl: 'http://localhost:8888/explorer/api',
                    },
                    test: {
                        apiUrl: 'http://test.dltstax.net/explorer/api'
                    },
                    production: {
                        apiUrl: 'http://hackathon.dltstax.net/explorer/api',
                    },
                    defaults: {
                        apiUrl: 'http://hackathon.dltstax.net/explorer/api',
                    }
                }
            });

            // run the environment check, so the comprobation is made
            // before controllers and services are built
            envServiceProvider.check();
            //$locationProvider.html5Mode(true);
        }])
    .run(function ($rootScope) {

        // $rootScope.web3 = web3;
        function sleepFor(sleepDuration) {
            var now = new Date().getTime();
            while (new Date().getTime() < now + sleepDuration) { /* do nothing */
            }
        }
    });
