angular.module('wipApp.project.service', [])
// A RESTful factory for retrieving projects from 'projects.json'
.factory('projects', ['$http', 'utils', function ($http, utils) {
  var path = 'assets/projects.json';
  var projects = {};

  projects.getAllProjects = function () {
    return $http.post(path);
  };
  projects.get = function (id) {
    return projects.then(function(){
      return utils.findById(projects, id);
    })
  };
  return projects;
}]);