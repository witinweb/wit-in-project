'use strict';

// declare modules
angular.module('Authentication', []);
angular.module('Project', ['mm.foundation']);

angular.module('BasicHttpAuthExample', [
        'Authentication',
        'Project',
        'ngRoute',
        'ngCookies'
    ])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider
            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'app/modules/authentication/views/login.html',
                hideMenus: true
            })
            .when('/join', {
                controller: 'LoginController',
                templateUrl: 'app/modules/authentication/views/join.html'
            })
            .when('/', {
                controller: 'ProjectController',
                templateUrl: 'app/modules/project/views/project.html'
            })

            .otherwise({ redirectTo: '/login' });
    }])

    .run(['$rootScope', '$location', '$cookies', '$http',
        function ($rootScope, $location, $cookies, $http) {
            // keep user logged in after page refresh
            $rootScope.globals = {
                currentUser: {
                    LOGIN_ID: $cookies['LOGIN_ID'],
                    LOGIN_NAME: $cookies['LOGIN_NAME'],
                    accessToken: $cookies['accessToken']
                }
            };

            if ($cookies['LOGIN_ID']) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.accessToken; // jshint ignore:line
            }

            $rootScope.$on('$locationChangeStart', function (event, next, current) {
                // redirect to login page if not logged in
                if (($location.path() !== '/login' && !$cookies['LOGIN_ID']) || (!$cookies['LOGIN_ID'] && $location.path() !== '/join')) {
                    $location.path('/login');
                }

                if ($location.path() == '/login' && $cookies['LOGIN_ID']) {
                    $location.path('/');
                }
            });
        }])

    .controller('sidebarController', ['$scope', '$route', '$location', 'AuthenticationService',
            function ($scope, $route, $location, AuthenticationService) {
               
                $scope.logout = function () {
                    AuthenticationService.Logout(function(response){
                        if(response.result){
                            AuthenticationService.ClearCredentials();
                            $location.path('/login');
                        }
                    }); 
                };
        }]);