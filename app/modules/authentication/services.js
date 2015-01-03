'use strict';
 
angular.module('Authentication')
 
.factory('AuthenticationService',
    ['$http', '$cookies', '$rootScope',
    function ($http, $cookies, $rootScope) {
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
                });

        };

        service.Logout = function (callback){
            $http.post('backApp/v1.0/users/logout')
                .success(function (response) {
                    callback(response);
                });
        }
 
        service.SetCredentials = function (id, name, accessToken) {
            //$rootScope.accessToken = accessToken;
            $rootScope.globals = {
                currentUser: {
                    LOGIN_ID: id,
                    LOGIN_NAME: name,
                    accessToken: accessToken
                }
            };
 
            $http.defaults.headers.common['Authorization'] = 'Basic ' + accessToken; // jshint ignore:line
        };
 
 
        service.ClearCredentials = function () {
            $rootScope.globals = {
                currentUser: {
                    LOGIN_ID: '',
                    LOGIN_NAME: '',
                    accessToken: ''
                }
            };
            $http.defaults.headers.common.Authorization = 'Basic ';
        };
 
        return service;
    }]);