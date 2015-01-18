angular.module('wipApp.user.controller', [])
.controller('userController', ['$rootScope','$scope', '$stateParams', '$state', 'user',
	function ( $rootScope, $scope,   $stateParams,   $state, user) {
	  //$scope.item = utils.findById($scope.contact.items, $stateParams.itemId);
	  $scope.login = function(){
	  	user.login($scope.id, $scope.password)
				.success(function (response) {
				    if(response.error_info == null){
				    	$rootScope.$loginState = true;
				    	$rootScope.$userInfo = response.user_info;
				    	console.log(response);
				    }else{
				    	$scope.error = response.error_info.msg;
				    	console.log(response.error_info.id);
				    }
				    //console.log(response);
				    //$scope.response = custs;
				})
				.error(function (response) {
				    $scope.error = response.error_msg;
				    console.log(response);
				});
	  };
	}]);
