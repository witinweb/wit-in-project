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
            //page refresh or init
            $rootScope.globals = {
                currentUser: {
                    LOGIN_ID: $cookies['LOGIN_ID'],
                    LOGIN_NAME: $cookies['LOGIN_NAME'],
                    accessToken: $cookies['accessToken']
                }
            };

            if ($rootScope.globals.currentUser.LOGIN_ID) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.accessToken; // jshint ignore:line
            }
            //only change location state
            $rootScope.$on('$locationChangeStart', function (event, next, current) {
                // redirect to login page if not logged in
                if (($location.path() !== '/login' && !$rootScope.globals.currentUser.LOGIN_ID ) || ($location.path() !== '/join' && !$rootScope.globals.currentUser.LOGIN_ID)) {
                    $location.path('/login');
                }
                //don't redirect to login page if logged in
                if ($location.path() == '/login' && $rootScope.globals.currentUser.LOGIN_ID ) {
                    $location.path('/');
                }
            });
        }])

    .controller('sidebarController', ['$scope', '$route', '$location', 'AuthenticationService', 'ProjectService',
            function ($scope, $route, $location, AuthenticationService, ProjectService) {
                console.log("AA");
                ProjectService.ViewAll(function(response){
                    console.log(response.result);
                    if(response.result){
                        console.log(response.project_list);
                        $scope.projectList = response.project_list;
                    } else {
                        $scope.error = response.message;
                    }
                });

                $scope.logout = function () {
                    AuthenticationService.Logout(function(response){
                        if(response.result){
                            AuthenticationService.ClearCredentials();
                            $location.path('/login');
                        }
                    }); 
                };
        }]);