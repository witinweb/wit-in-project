'use strict';

angular.module('Project')
    .controller('ProjectController', ['$scope','$rootScope','$modal', function ($scope, $rootScope, $modal) {
    	$scope.accessToken = $rootScope.accessToken;
    	$scope.newProject = function () {
		    var modalInstance = $modal.open({
		      templateUrl: 'newProject.html',
		      controller: 'newProjectController'
		    });
		}
    }])

    .controller('newProjectController', function ($scope, $modalInstance) {

		$scope.ok = function () {
			$modalInstance.close($scope.selected.item);
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	})

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