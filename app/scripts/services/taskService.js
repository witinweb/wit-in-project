angular.module('wipApp.task.service', [])
// A RESTful factory for retrieving projects from 'projects.json'
.factory('tasks', ['$http', function ($http) {
  var taskPath = '/backApp/v1.0/tasks';
  var todoPath = '/backApp/v1.0/todos';
  var tasks = {};

  tasks.getAlltasks = function (id) {
    return $http.post(taskPath+"/viewAll", {project_idx:id});
  };
  tasks.AddTask = function (newTask) {
    return $http.post(taskPath+"/add",newTask);
  };
  tasks.ModifyProject = function (id, name) {
    return $http.post(taskPath+"/modify",{project_idx:id, name:name});
  };
  tasks.DeleteProject = function (id) {
    return $http.post(taskPath+"/del",{project_idx:id});
  };
  tasks.AddTodo = function (newTodo) {
    return $http.post(todoPath+"/add",newTodo);
  };

  return tasks;
}]);