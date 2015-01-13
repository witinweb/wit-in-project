app.controller('ModalInstanceController', function ($scope, $rootScope, $modalInstance, ProjectService, idx) {
	$scope.idx = idx;
	$scope.ok = function () {
	    ProjectService.Delete($scope.idx, $rootScope.globals.currentUser.accessToken, function(response) {
          if(response.result) {
              $modalInstance.close();            
          } else {
            
          }
	    });
	   
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});