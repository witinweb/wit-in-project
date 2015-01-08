angular.module('wipApp.projects.service', [

])
.factory('projects',
    ['$http', '$cookies', '$rootScope',
    function ($http, $cookies, $rootScope) {

        var projects = $http.post('backApp/v1.0/projects/ViewAll').then( function (response){
            console.log(response.project_list);
            var project_list = [];
            for (var i in response.project_list) {
                project_list[i] = response.project_list[i][0];
            }
            return project_list;
        });

        var factory = {};
        factory.UserProject = function (idx, accessToken, callback) {
              $http.post('backApp/v1.0/projects/add', { name: name, accessToken: accessToken })
                .success(function (response){
                   callback(response);
                });
        };
        factory.Add = function (name, accessToken, callback) {
            $http.post('backApp/v1.0/projects/add', { name: name, accessToken: accessToken })
                .success(function (response){
                   callback(response);
                });
        };

        factory.Modify = function (name, idx, accessToken, callback) {

            $http.post('backApp/v1.0/projects/modify', { name: name, project_idx: idx, accessToken: accessToken })
                .success(function (response){
                   callback(response);
                });
        };

        factory.Delete = function (idx, accessToken, callback) {

            $http.post('backApp/v1.0/projects/del', { project_idx: idx, accessToken: accessToken })
                .success(function (response){
                   callback(response);
                });
        };

        factory.ViewAll = function (callback) {

            $http.post('backApp/v1.0/projects/ViewAll')
                .success(function (response){
                   callback(response);
                });
        };

        factory.View = function () {

            return projects;
        };
 
        return factory;
    }]);