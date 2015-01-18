angular.module('wipApp.project.service', [])
// A RESTful factory for retrieving projects from 'projects.json'
.factory('projects', ['$http', 'utils', function ($http, utils) {
  var path = '/backApp/v1.0/projects';
  var projects = {};

  projects.getAllProjects = function () {
    return $http.post(path+"/viewAll");
  };
  projects.AddProject = function (name) {
    return $http.post(path+"/add",name);
  };
  projects.ModifyProject = function (id, name) {
    return $http.post(path+"/modify",{project_idx:id, name:name});
  };
  projects.DeleteProject = function (id) {
    return $http.post(path+"/del",{project_idx:id});
  };

  return projects;
}]);