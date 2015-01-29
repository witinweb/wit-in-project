angular.module('wipApp.todo.controller', [])
.controller('todoController', ['$scope', '$stateParams', '$state','utils', 'todos', 'notificationFactory', 'modalWindowFactory', 
	function ($scope, $stateParams, $state, utils, todos, notificationFactory, modalWindowFactory) {
	// PRIVATE FUNCTIONS 
    // 성공 알림 function
	var requestSuccess = function () {
  		notificationFactory.success();
	}
	// 실패 알림 function
	var requestError = function () {
		notificationFactory.error();
	}

	$scope.project = utils.findById($scope.projects, $stateParams.projectId);

	$scope.addTaskMode = false;
	$scope.addTodoMode = false;
	$scope.hasTask = true;
	$scope.newTask = {};
	$scope.newTodo = {};
	$scope.newTask.project_idx = $stateParams.projectId;
	$scope.newTodo.project_idx = $stateParams.projectId;
	
	// Toggle the grid between add and normal mode
    $scope.toggleAddTaskMode = function () {
        $scope.addTaskMode = !$scope.addTaskMode;
 
        // Default new item name is empty
        $scope.newTask = {};
    };
    $scope.toggleAddTodoMode = function () {
        $scope.addTodoMode = !$scope.addTodoMode;
 
        // Default new item name is empty
        $scope.newTodo = {};
    };	

    $scope.addTask = function(){
    		tasks.AddTask($scope.newTask)
			.success(function(response){
				if(response.error_info == null){
					requestSuccess();
					console.log(response);
                    $state.reload();
					//$scope.tasks.unshift(response.new_task);
					//$scope.newTask = {};
					
				}else{
					$scope.error = response.error_info.msg;
					requestError();
				}
			})
    };

    $scope.addTodo = function(task){
    		$scope.newTodo.task_idx = task.idx;
    		console.log($scope.newTodo);
    		tasks.AddTodo($scope.newTodo)
			.success(function(response){
				if(response.error_info == null){
					requestSuccess();
					console.log(response);
                    $state.reload();
					//$scope.todos.unshift(response.new_todo);
					//$scope.newTodo = {};
					
				}else{
					$scope.error = response.error_info.msg;
					requestError();
				}
			})
    };

	$scope.viewAllByDueDate = function(){
		todos.viewAllByDueDate()
		   .success(function (response) {
				if(response.error_info == null){
					$scope.allTodos = response.todo_list;
					console.log($scope.allTodos);	
					
				}else{
					console.log(response.error_info.msg);
				}
			})
		   .error(function (response) {
		    	console.log(response);
			});	
	}

	$scope.viewAllByDueDate();
		
}]);