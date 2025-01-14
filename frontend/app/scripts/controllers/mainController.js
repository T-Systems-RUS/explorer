//var cryptoSocket = require('crypto-socket');
angular.module('ethExplorer')
    .controller('mainCtrl', ['$http', '$rootScope', '$scope', '$location', 'envService', function ($http, $rootScope, $scope, $location, envService) {

        // Display & update block list
        getStats();


        $scope.processRequest = function () {
            var requestStr = $scope.ethRequest;


            if (requestStr !== undefined) {

                // maybe we can create a service to do the reg ex test, so we can use it in every controller ?

                var regexpTx = /[0-9a-zA-Z]{64}?/;
                //var regexpAddr =  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/; // TODO ADDR REGEX or use isAddress(hexString) API ?
                var regexpAddr = /^(0x)?[0-9a-f]{40}$/; //New ETH Regular Expression for Addresses
                var regexpBlock = /[0-9]{1,7}?/;

                var result = regexpTx.test(requestStr);
                if (result === true) {
                    goToTxInfos(requestStr);
                } else {
                    result = regexpAddr.test(requestStr.toLowerCase());
                    if (result === true) {
                        goToAddrInfos(requestStr.toLowerCase());
                    } else {
                        result = regexpBlock.test(requestStr);
                        if (result === true) {
                            goToBlockInfos(requestStr);
                        } else {
                            console.log("nope");
                            return null;
                        }
                    }
                }
            } else {
                return null;
            }
        };


        function goToBlockInfos(requestStr) {
            $location.path('/block/' + requestStr);
        }

        function goToAddrInfos(requestStr) {
            $location.path('/address/' + requestStr.toLowerCase());
        }

        function goToTxInfos(requestStr) {
            $location.path('/tx/' + requestStr);
        }

        function updateStats() {
            $scope.blockNum = web3.eth.blockNumber; // now that was easy

            if ($scope.blockNum !== undefined) {

                // TODO: put the 2 web3.eth.getBlock into the async function below
                //       easiest to first do with fastInfosCtrl
                var blockNewest = web3.eth.getBlock($scope.blockNum);

                if (blockNewest !== undefined) {

                    // difficulty
                    $scope.difficulty = blockNewest.difficulty;
                    $scope.difficultyToExponential = blockNewest.difficulty.toExponential(3);

                    $scope.totalDifficulty = blockNewest.totalDifficulty;
                    $scope.totalDifficultyToExponential = blockNewest.totalDifficulty.toExponential(3);

                    $scope.totalDifficultyDividedByDifficulty = $scope.totalDifficulty.dividedBy($scope.difficulty);
                    $scope.totalDifficultyDividedByDifficulty_formatted = $scope.totalDifficultyDividedByDifficulty.toFormat(1);

                    $scope.AltsheetsCoefficient = $scope.totalDifficultyDividedByDifficulty.dividedBy($scope.blockNum);
                    $scope.AltsheetsCoefficient_formatted = $scope.AltsheetsCoefficient.toFormat(4);

                    // large numbers still printed nicely:
                    $scope.difficulty_formatted = $scope.difficulty.toFormat(0);
                    $scope.totalDifficulty_formatted = $scope.totalDifficulty.toFormat(0);

                    // Gas Limit

                    // Time
                    var newDate = new Date();
                    newDate.setTime(blockNewest.timestamp * 1000);
                    $scope.time = newDate.toUTCString();

                    $scope.secondsSinceBlock1 = blockNewest.timestamp - 1438226773;
                    $scope.daysSinceBlock1 = ($scope.secondsSinceBlock1 / 86400).toFixed(2);

                    // Average Block Times:
                    // TODO: make fully async, put below into 'fastInfosCtrl'

                    var blockBefore = web3.eth.getBlock($scope.blockNum - 1);
                    if (blockBefore !== undefined) {
                        $scope.blocktime = blockNewest.timestamp - blockBefore.timestamp;
                    }
                    $scope.range1 = 100;
                    range = $scope.range1;
                    var blockPast = web3.eth.getBlock(Math.max($scope.blockNum - range, 0));
                    if (blockBefore !== undefined) {
                        $scope.blocktimeAverage1 = ((blockNewest.timestamp - blockPast.timestamp) / range).toFixed(2);
                    }
                    $scope.range2 = 1000;
                    range = $scope.range2;
                    var blockPast = web3.eth.getBlock(Math.max($scope.blockNum - range, 0));
                    if (blockBefore !== undefined) {
                        $scope.blocktimeAverage2 = ((blockNewest.timestamp - blockPast.timestamp) / range).toFixed(2);
                    }
                    $scope.range3 = 10000;
                    range = $scope.range3;
                    var blockPast = web3.eth.getBlock(Math.max($scope.blockNum - range, 0));
                    if (blockBefore !== undefined) {
                        $scope.blocktimeAverage3 = ((blockNewest.timestamp - blockPast.timestamp) / range).toFixed(2);
                    }
                    $scope.range4 = 100000;
                    range = $scope.range4;
                    var blockPast = web3.eth.getBlock(Math.max($scope.blockNum - range, 0));
                    if (blockBefore !== undefined) {
                        $scope.blocktimeAverage4 = ((blockNewest.timestamp - blockPast.timestamp) / range).toFixed(2);
                    }

                    range = $scope.blockNum;
                    var blockPast = web3.eth.getBlock(1);
                    if (blockBefore !== undefined) {
                        $scope.blocktimeAverageAll = ((blockNewest.timestamp - blockPast.timestamp) / range).toFixed(2);
                    }

                    //fastAnswers($scope);
                    //$scope=BlockExplorerConstants($scope);

                }
            }
            // Block Explorer Info
            $scope.isConnected = web3.isConnected();
            //$scope.peerCount = web3.net.peerCount;
            $scope.versionApi = web3.version.api;
            $scope.versionClient = web3.version.client;
            //$scope.versionNetwork = web3.version.network;
            $scope.versionCurrency = web3.version.ethereum; // TODO: change that to currencyname?

            // ready for the future:
            try {
                $scope.versionWhisper = web3.version.whisper;
            } catch (err) {
                $scope.versionWhisper = err.message;
            }
        }

        function getStats() {
            var url = envService.read('apiUrl') + '/stats';
            return $http.get(url).then(function (response) {
                var data = response.data;
                $scope.txNumber = data.blockNumber;
                $scope.recenttransactions = data.recentTransactions;
                $scope.blocks = data.blocks;
            });
        }
    }]);

angular.module('filters', []).filter('truncate', function () {
    return function (text, length, end) {
        if (isNaN(length))
            length = 10;

        if (end === undefined)
            end = "...";

        if (text.length <= length || text.length - end.length <= length) {
            return text;
        } else {
            return String(text).substring(0, length - end.length) + end;
        }
    };
}).filter('diffFormat', function () {
    return function (diffi) {
        if (isNaN(diffi)) return diffi;
        var n = diffi / 1000000000000;
        return n.toFixed(3) + " T";
    };
}).filter('stylize', function () {
    return function (style) {
        if (isNaN(style)) return style;
        var si = '<span class="btn btn-primary">' + style + '</span>';
        return si;
    };
}).filter('stylize2', function () {
    return function (text) {
        if (isNaN(text)) return text;
        var si = '<i class="fa fa-exchange"></i> ' + text;
        return si;
    };
}).filter('hashFormat', function () {
    return function (hashr) {
        if (isNaN(hashr)) return hashr;
        var n = hashr / 1000000000000;
        return n.toFixed(3) + " TH/s";
    };
}).filter('sizeFormat', function () {
    return function (size) {
        if (isNaN(size)) return size;
        var s = size / 1000;
        return s.toFixed(3) + " kB";
    };
});
