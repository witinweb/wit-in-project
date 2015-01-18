angular.module('wipApp.task.controller', [])
.controller('taskController', ['$scope', '$stateParams', '$state','utils', 'notificationFactory', 'modalWindowFactory', 
	function ($scope, $stateParams, $state, utils, notificationFactory, modalWindowFactory) {
	
	$scope.project = utils.findById($scope.projects, $stateParams.projectId);	
}]);