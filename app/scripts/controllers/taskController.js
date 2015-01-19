angular.module('wipApp.task.controller', [])
.controller('taskController', ['$scope', '$stateParams', '$state','utils', 'tasks', 'notificationFactory', 'modalWindowFactory', 
	function ($scope, $stateParams, $state, utils, tasks, notificationFactory, modalWindowFactory) {
	
	$scope.project = utils.findById($scope.projects, $stateParams.projectId);

	$scope.tasksList = function(){
		tasks.getAlltasks($stateParams.projectId)
		   .success(function (response) {
				if(response.error_info == null){
					$scope.categorys = response.category_list;
					$scope.tasks = $scope.categorys.task_list;
					console.table($scope.categorys);
				}else{
					console.log(response.error_info.msg);
				}
				})
		   .error(function (response) {
		    console.log(response);
				});	
	}

	$scope.tasksList();
		
}]);