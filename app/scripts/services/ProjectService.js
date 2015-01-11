angular.module('wipApp.projects.service', [

])
.factory('ProjectService',
    ['$http', '$cookies', '$rootScope',
    function ($http, $cookies, $rootScope) {

        var projectLists = $http.post('backApp/v1.0/projects/ViewAll', { accessToken: $rootScope.globals.currentUser.accessToken })
                .success( function (response){
                    
                projectLists = response.project_list;
                return projectLists;
            });

        var factory = {};
        factory.UserProject = function (idx, accessToken, callback) {

              $http.post('backApp/v1.0/projects/add', { name: name, accessToken: accessToken })
                .success(function (response){
                   callback(response);
                });
                return 
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
            return projectLists;
        };
 
        return factory;
    }]);