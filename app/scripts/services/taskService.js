angular.module('wipApp.task.service', [])
// A RESTful factory for retrieving projects from 'projects.json'
.factory('tasks', ['$http', 'utils', function ($http, utils) {
  var path = '/backApp/v1.0/tasks';
  var tasks = {};

  tasks.getAlltasks = function () {
    return $http.post(path+"/viewAll");
  };
  tasks.AddProject = function (name) {
    return $http.post(path+"/add",name);
  };
  tasks.ModifyProject = function (id, name) {
    return $http.post(path+"/modify",{project_idx:id, name:name});
  };
  tasks.DeleteProject = function (id) {
    return $http.post(path+"/del",{project_idx:id});
  };

  return tasks;
}]);