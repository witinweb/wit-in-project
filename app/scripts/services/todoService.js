angular.module('wipApp.todo.service', [])
// A RESTful factory for retrieving projects from 'projects.json'
.factory('todos', ['$http', function ($http) {
  var todoPath = '/backApp/v1.0/todos';
  var todos = {};
  todos.viewAllByDueDate = function () {
    return $http.post(todoPath+"/viewAllByDueDate");
  };

  todos.getAlltodos = function (id) {
    return $http.post(todoPath+"/viewAll", {project_idx:id});
  };
  todos.AddTask = function (newTask) {
    return $http.post(todoPath+"/add",newTask);
  };
  todos.ModifyProject = function (id, name) {
    return $http.post(todoPath+"/modify",{project_idx:id, name:name});
  };
  todos.DeleteProject = function (id) {
    return $http.post(todoPath+"/del",{project_idx:id});
  };
  todos.AddTodo = function (newTodo) {
    return $http.post(todoPath+"/add",newTodo);
  };

  return todos;
}]);