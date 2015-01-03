'use strict';
 
angular.module('Project')
 
.factory('AuthenticationService',
    ['$http', '$cookieStore', '$rootScope',
    function ($http, $cookieStore, $rootScope) {
        var service = {};

        service.Join = function (name, id, password, callback) {

            $http.post('backApp/v1.0/users/join', { name: name, id: id, password: password })
                .success(function (response){
                   callback(response);
                });
        };

        service.Login = function (id, password, callback) {

            $http.post('backApp/v1.0/users/login', { id: id, password: password })
                .success(function (response) {
                    callback(response);
                    console.log(response);
                });

        };
 
        service.SetCredentials = function (id, accessToken) {
            $rootScope.accessToken = accessToken;
            $rootScope.globals = {
                currentUser: {
                    id: id,
                    accessToken: accessToken
                }
            };
 
            $http.defaults.headers.common['Authorization'] = 'Basic ' + accessToken; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        };
 
        service.ClearCredentials = function () {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        };
 
        return service;
    }]);