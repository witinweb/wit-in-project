'use strict';

angular.module('Project')
    .controller('ProjectController', ['$scope','$modal', 'ProjectService', function ($scope, $modal, ProjectService) {
   		
    	$scope.newProject = function () {
		    var modalInstance = $modal.open({
		      	templateUrl: 'app/modules/project/views/newProject.html',
		      	controller: 'modalInstanceController'
		    });
	        modalInstance.result.then(function (ProjectItem) {
		      $scope.projectItem = ProjectItem;
		    });
		}
    }]);

angular.module('Project')
    .controller('modalInstanceController', ['$scope', '$rootScope', '$modalInstance', 'ProjectService', function ($scope, $rootScope, $modalInstance, ProjectService) {
    	$scope.data = {};
		$scope.addProject = function () {
			$scope.dataLoading = true;
			ProjectService.Add($scope.data.name, $rootScope.globals.currentUser.accessToken, function(response) {
                if(response.result) {
                	$modalInstance.close($scope.data.name);
                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}])

   .controller('projectListController',['$scope', function ($scope) {
	   $scope.projectListViewType = 'grid';
	   $scope.searchInfo = {
	    projectName : ''
	   };

	   $scope.toggleprojectListViewType = function () {
	    if($scope.projectListViewType === 'grid'){
	      $scope.projectListViewType = 'list';
	    }else{
	      $scope.projectListViewType = 'grid';
	    }
	   };

	   $scope.search = function (searchInfo) {
	    $scope.$broadcast('search:newSearchInfo',searchInfo);
	   };
 	}]);