angular.module('wipApp.todo.service', [])
// A RESTful factory for retrieving projects from 'projects.json'
.factory('todos', ['$http', function ($http) {
  var taskPath = '/backApp/v1.0/todos';
  var todoPath = '/backApp/v1.0/todos';
  var todos = {};

  todos.getAlltodos = function (id) {
    return $http.post(taskPath+"/viewAll", {project_idx:id});
  };
  todos.AddTask = function (newTask) {
    return $http.post(taskPath+"/add",newTask);
  };
  todos.ModifyProject = function (id, name) {
    return $http.post(taskPath+"/modify",{project_idx:id, name:name});
  };
  todos.DeleteProject = function (id) {
    return $http.post(taskPath+"/del",{project_idx:id});
  };
  todos.AddTodo = function (newTodo) {
    return $http.post(todoPath+"/add",newTodo);
  };

  return todos;
}]);