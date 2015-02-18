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
    // all the items
    $scope.categories = [];
    $scope.users = [];
	$scope.addTodoMode = false;
	$scope.newTodo = {};
	$scope.hasTodo = true;
    $scope.showDatePicker = false;
	$scope.newTodo.project_idx = $stateParams.projectId;
	
	$scope.toggleAddTodoMode = function () {
	    $scope.addTodoMode = !$scope.addTodoMode;

	    // Default new item name is empty
	    $scope.newTodo = {};
	};	

	// Toggle an item between normal and edit mode
	$scope.toggleEditMode = function (todo,category ) {
		// Toggle
		todo.editMode = !todo.editMode;

		// if todo is not in edit mode anymore
		if (!todo.editMode) {
			// Restore name
			todo.name = todo.serverName;
		} else {
			// save server name to restore it if the user cancel edition
			todo.serverName = todo.name;

			// Set edit mode = false and restore the name for the rest of items in edit mode 
			// (there should be only one)
            $scope.categories.forEach(function (i) {
			// item is not the item being edited now and it is in edit mode
				if (category.idx != i.idx && i.editMode) {
					// Restore name
					i.name = i.serverName;
					i.editMode = false;
				}
			});
		}
	};

    $scope.addTodo = function(){
        $scope.newTodo.category_idx = $scope.selectedCategory.originalObject.idx;
        $scope.newTodo.project_idx = $stateParams.projectId;
        $scope.newTodo.receiver_idx = $scope.selectedReceiver.originalObject.idx;
        console.table($scope.newTodo);
    		todos.AddTodo($scope.newTodo)
			.success(function(response){
				if(response.error_info == null){
					//$scope.todos.unshift(response.data); // response 확인
					//$scope.toggleAddTodoMode();
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
					$scope.categories = response.category_list;
					console.table(response.category_list);
					
				}else{
					console.log(response.error_info.msg);
				}
			})
		   .error(function (response) {
		    	console.log(response);
			});	
	};

    $scope.getAllUsers = function(id){
        todos.getAllUsers(id)
            .success(function (response) {
                if(response.error_info == null){
                    $scope.users = response.user_list;
                    console.table(response.user_list);

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
			knownItemsFactory.update({ id: item.id }, item, function (success) {
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

	// In edit mode, if user press ENTER, update item
	$scope.updateOnEnter = function (item, args) {
	    // if key is enter
	    if (args.keyCode == 13) {
	        $scope.updateItem(item);
	        // remove focus
	        args.target.blur();
	    }
	};

	// In add mode, if user press ENTER, add item
	$scope.saveOnEnter = function (item, args) {
	    // if key is enter
	    if (args.keyCode == 13) {
	        $scope.createItem();
	        // remove focus
	        args.target.blur();
	    }
	};

	if($stateParams.projectId == undefined){
		$scope.viewAllByDueDate();	
	} else{
		$scope.getAlltodos($stateParams.projectId);
        $scope.getAllUsers($stateParams.projectId);
	}

		
}]);