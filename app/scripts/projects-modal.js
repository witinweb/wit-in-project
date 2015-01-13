angular.module('wipApp.modal', [

])

.controller('ModalInstanceController', function ($scope, $rootScope, $modalInstance,  id) {
	console.log(id);
	$scope.ok = function () {
		$modalInstance.close();      
	    /*ProjectService.Delete($scope.idx, $rootScope.globals.currentUser.accessToken, function(response) {
          if(response.result) {
              $modalInstance.close();            
          } else {
            
          }
	    });*/
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});