angular.module('wipApp.projects.service', [

])

// A RESTful factory for retrieving projects from 'projects.json'
.factory('projects', ['$http', 'utils', function ($http, utils) {
  var path = 'assets/projects.json';

  var projects = $http.get(path).then(function (resp) {
    return resp.data.projects;
  });

  var factory = {};
  factory.all = function () {
    return projects;
  };
  factory.get = function (id) {
    return projects.then(function(){
      return utils.findById(projects, id);
    })
  };
  return factory;
}]);