angular.module('wipApp.todo.service', [])
// A RESTful factory for retrieving projects from 'projects.json'
.factory('todos', ['$http', function ($http) {
	var todoPath = '/backApp/v1.0/todos';
    var userPath = '/backApp/v1.0/users';
	var todos = {};
	todos.viewAllByDueDate = function () {
  		return $http.post(todoPath+"/viewAllByDueDate");
	};
/*
	todos.getAlltodos = function (id) {
		return $http.post(todoPath+"/viewAll", {project_idx:id});
	};*/
	todos.getAlltodos = function (id) {
		return $http.post(todoPath+"/viewAll",{project_idx:id});
	};

    todos.getAllUsers = function (id) {
        return $http.post(userPath+"/viewAll",{project_idx:id});
    };

	todos.ModifyProject = function (id, name) {
		return $http.post(todoPath+"/modify",{project_idx:id, name:name});
	};
	todos.deleteTodo = function (todo_idx, project_idx) {
  		return $http.post(todoPath+"/del",{todo_idx:todo_idx, project_idx:project_idx});
	};
	todos.AddTodo = function (newTodo) {
 		return $http.post(todoPath+"/add",newTodo);
	};

	return todos;
}]);