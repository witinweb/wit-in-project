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

	$scope.addTodoMode = false;
	$scope.newTodo = {};
	$scope.hasTodo = true;
	$scope.newTodo.project_idx = $stateParams.projectId;
	
    $scope.toggleAddTodoMode = function () {
        $scope.addTodoMode = !$scope.addTodoMode;
 
        // Default new item name is empty
        $scope.newTodo = {};
    };	

    $scope.addTodo = function(){
    		todos.AddTodo($scope.newTodo)
			.success(function(response){
				if(response.error_info == null){
					$scope.todos.unshift(response.data); // response 확인
					$scope.toggleAddTodoMode();
					requestSuccess();
					
				}else{
					$scope.error = response.error_info.msg;
					requestError();
				}
			})
    };

    $scope.getAlltodos = function(id){
		todos.getAlltodos(id)
		   .success(function (response) {
				if(response.error_info == null){
					$scope.hasTodo = false;		
					console.log(response);	
					
				}else{
					console.log(response.error_info.msg);
				}
			})
		   .error(function (response) {
		    	console.log(response);
			});	
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
		    	console.log(response); //에러 처리 확인
			});	
	};

	// Updates an item
	$scope.updateTodo = function (todo) {
		todo.editMode = false;
		// Only update if there are changes
		if (isDirty(item)) {
			//knownItemsFactory.update({ id: item.id }, item, function (success) {
			requestSuccess();
		}, requestError);
		}
	}

	$scope.deleteTodo = function(todo){
		todos.deleteTodo(todo)
		   .success(function (response) {
				if(response.error_info == null){
					$scope.hasTodo = false;		
					console.log(response);	
					
				}else{
					console.log(response.error_info.msg);
				}
			})
		   .error(function (response) {
		    	console.log(response);
			});	
	};

	if($stateParams.projectId == undefined){
		$scope.viewAllByDueDate();	
	} else{
		$scope.getAlltodos($stateParams.projectId);
	}
		
}]);