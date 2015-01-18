angular.module('wipApp.user.controller', [])
.controller('userController', ['$scope', '$stateParams', '$state', 'utils',
	function (  $scope,   $stateParams,   $state,   utils) {
	  //$scope.item = utils.findById($scope.contact.items, $stateParams.itemId);
	  $scope.login = function(){
	  	$state.go('projects.list', {redirect:true});
	  };
	}]);
