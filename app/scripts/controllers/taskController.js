angular.module('wipApp.task.controller', [])
.controller('taskController', ['$scope', '$stateParams', '$state','utils', 'tasks', 'notificationFactory', 'modalWindowFactory', 
	function ($scope, $stateParams, $state, utils, tasks, notificationFactory, modalWindowFactory) {
	
	$scope.project = utils.findById($scope.projects, $stateParams.projectId);

	$scope.addMode = false;
	$scope.hasTask = false;
	$scope.newTask = {};
	$scope.newTask.project_idx = $stateParams.projectId;
	
	// Toggle the grid between add and normal mode
    $scope.toggleAddMode = function () {
        $scope.addMode = !$scope.addMode;
 
        // Default new item name is empty
        $scope.newTask.name = '';
    };	

    $scope.addTask = function(){
    		tasks.AddTask($scope.newTask)
			.success(function(response){
				if(response.error_info == null){
					requestSuccess();
					console.log(response);
					//$scope.tasks.unshift(response.new_task);
					//$scope.newTask = {};
					
				}else{
					$scope.error = response.error_info.msg;
					requestError();
				}
			})
    };

	$scope.tasksList = function(){
		tasks.getAlltasks($stateParams.projectId)
		   .success(function (response) {
				if(response.error_info == null){
					if(response.category_list == null){
						$scope.hasTask = !$scope.hasTask;
					} else{
						$scope.categorys = response.category_list;
						$scope.tasks = $scope.categorys.task_list;
						console.table($scope.categorys);	
					}
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