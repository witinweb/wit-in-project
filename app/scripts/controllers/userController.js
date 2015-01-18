angular.module('wipApp.user.controller', [])
.controller('userController', ['$scope', '$stateParams', '$state', 'user',
	function ($scope,   $stateParams,   $state, user) {
	  //$scope.item = utils.findById($scope.contact.items, $stateParams.itemId);
	  $scope.login = function(){
	  	user.Login($scope.id, $scope.password)
				.success(function (response) {
				    if(response.error_info == null){
				    	user.SetUser(response.user_info);
				    	$state.go('projects',{redirect:true});
				    }else{
				    	$scope.error = response.error_info.msg;
				    }
				})
				.error(function (response) {
				    $scope.error = response.error_msg;
				    console.log(response);
				});
	  };
	  $scope.join = function(){
	  	user.Join($scope.name, $scope.id, $scope.password)
				.success(function (response) {
				    if(response.error_info == null){
				    	console.log(response);
				    }else{
				    	$scope.error = response.error_info.msg;
				    }
				})
				.error(function (response) {
				    $scope.error = response.error_msg;
				    console.log(response);
				});
	  };
	  $scope.logout = function(){
	  	user.Logout();
	  };
	}]);
