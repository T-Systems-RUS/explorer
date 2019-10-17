
angular.module('ethExplorer')
    .controller('addressInfosCtrl', ['$rootScope', '$scope', '$location', '$routeParams','$q', '$http', 'envService', function ($rootScope, $scope, $location, $routeParams,$q, $http, envService) {

        $scope.init=function()
        {

            $scope.addressId=$routeParams.addressId;
            var addressId = $routeParams.addressId;

            if($scope.addressId!==undefined) {
            	getAddressBalance()
                    .then(function(response){
                        var result = response.data;
                    	$scope.balance = result.balance;
                        $scope.txCount = result.transactionCount;
                        $scope.code = result.code;

                    });
            } else {
                $location.path("/");
            }

            function getAddressBalance(){
                return $http.get(envService.read('apiUrl')+'/address/'+addressId);
            }
        };
        $scope.init();
}]);
