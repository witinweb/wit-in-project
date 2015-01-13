app.factory('AuthenticationService', ['$http', '$cookies', '$rootScope', function ($http, $cookies, $rootScope) {
        var factory = {};

        factory.Join = function (name, id, password, callback) {
            $http.post('/backApp/v1.0/users/join', { name: name, id: id, password: password })
                .success(function (response){
                   callback(response);
                });
        };

        factory.Login = function (id, password, callback) {
            $http.post('/backApp/v1.0/users/login', { id: id, password: password })
                .success(function (response) {
                    callback(response);
                });

        };

        factory.Logout = function (callback){
            $http.post('/backApp/v1.0/users/logout')
                .success(function (response) {
                    callback(response);
                });
        }
 
        factory.SetCredentials = function (id, name, accessToken) {
            $rootScope.globals = {
                currentUser: {
                    LOGIN_ID: id,
                    LOGIN_NAME: name,
                    accessToken: accessToken
                }
            };
 
            //$http.defaults.headers.common['Authorization'] = 'Basic ' + accessToken; // jshint ignore:line
        };
 
 
        factory.ClearCredentials = function () {
            $rootScope.globals = {
                currentUser: {
                    LOGIN_ID: undefined,
                    LOGIN_NAME: undefined,
                    accessToken: undefined
                }
            };
            //$http.defaults.headers.common.Authorization = 'Basic ';
        };
 
        return factory;
    }]);