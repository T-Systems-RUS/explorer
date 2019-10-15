
angular.module('ethExplorer')
    .controller('blockInfosCtrl', ['$rootScope', '$scope', '$location', '$routeParams','$q', '$http', 'envService', function ($rootScope, $scope, $location, $routeParams,$q, $http, envService) {

        $scope.init = function () {


            $scope.blockId = $routeParams.blockId;


            if ($scope.blockId !== undefined) {

                getBlockInfos()
                    .then(function (response) {
                        var result = response.data;
                        var number = $scope.blockId;

                        $scope.result = result;

                        $scope.numberOfUncles = result.uncles.length;

                        //if ($scope.numberOfUncles!=0) {
                        //	uncle1=result.uncles[0];
                        //	console.log(web3.eth.getUncle(uncle1));
                        //}

                        if (result.hash !== undefined) {
                            $scope.hash = result.hash;
                        } else {
                            $scope.hash = 'pending';
                        }
                        if (result.miner !== undefined) {
                            $scope.miner = result.miner;
                        } else {
                            $scope.miner = 'pending';
                        }
                        $scope.gasLimit = result.gasLimit;
                        $scope.gasUsed = result.gasUsed;
                        $scope.nonce = result.nonce;
                        var diff = ("" + result.difficulty).replace(/['"]+/g, '') / 1000000000000;
                        $scope.difficulty = diff.toFixed(3) + " T";
                        $scope.nonce = result.nonce;
                        $scope.number = result.number;
                        $scope.parentHash = result.parentHash;
                        $scope.uncledata = result.sha3Uncles;
                        $scope.rootHash = result.stateRoot;
                        $scope.blockNumber = result.number;
                        $scope.timestamp = new Date(result.timestamp * 1000).toUTCString();
                        $scope.extraData = result.extraData.slice(2);
                        $scope.dataFromHex = hex2a(result.extraData.slice(2));
                        $scope.size = result.size;
                        $scope.firstBlock = false;
                        $scope.lastBlock = false;
                        if ($scope.blockNumber !== undefined) {
                            $scope.conf = number - $scope.blockNumber + " Confirmations";
                            if (number === $scope.blockNumber) {
                                $scope.conf = 'Unconfirmed';
                                $scope.lastBlock = true;
                            }
                            if ($scope.blockNumber === 0) {
                                $scope.firstBlock = true;
                            }
                        }
                    });

            } else {
                $location.path("/");
            }


            function getBlockInfos() {
                return $http.get(envService.read('apiUrl') + '/block/'+$scope.blockId);
            }


        };
        $scope.init();

        function hex2a(hexx) {
            var hex = hexx.toString(); //force conversion
            var str = '';
            for (var i = 0; i < hex.length; i += 2)
                str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));

            return str;
        }
    }]);
