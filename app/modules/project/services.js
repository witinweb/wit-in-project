'use strict';
 
angular.module('Project')
 
.factory('ProjectService',
    ['$http', '$cookies', '$rootScope',
    function ($http, $cookies, $rootScope) {
        var service = {};

        service.Add = function (name, accessToken, callback) {

            $http.post('backApp/v1.0/projects/add', { name: name, accessToken: accessToken })
                .success(function (response){
                   callback(response);
                });
        };

        service.ViewAll = function (callback) {

            $http.post('backApp/v1.0/projects/ViewAll')
                .success(function (response){
                    console.log(response);
                   callback(response);
                });
        };
 
        return service;
    }]);