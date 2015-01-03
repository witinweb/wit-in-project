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
            $rootScope.hasProject = 0;
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

    .controller('sidebarController', ['$scope', '$rootScope', '$route', '$location', 'AuthenticationService', 'ProjectService',
            function ($scope, $rootScope, $route, $location, AuthenticationService, ProjectService) {
                $scope.listProject = function(){
                    ProjectService.ViewAll(function(response){
                        if(response.result){
                            $scope.noneProject = "";
                            $rootScope.hasProject = 1;
                            var project_list = [];
                            for (var i in response.project_list) {
                                project_list[i] = response.project_list[i][0];
                            }
                            $scope.projectList = project_list;
                        } else {
                            $scope.noneProject = "프로젝트가 없습니다";
                            $rootScope.hasProject = 0;
                        }
                    });
                };

                $scope.listProject();

                $scope.addProject = function () {
                    ProjectService.Add($scope.name, $rootScope.globals.currentUser.accessToken, function(response) {
                        if(response.result) {
                            $scope.listProject();
                            $scope.name = '';
                        } else {
                            $scope.error = response.message;
                        }
                    });
                };

                $scope.modifyProject = function (name, idx) {
                    ProjectService.Modify(name, idx, $rootScope.globals.currentUser.accessToken, function(response) {
                        if(response.result) {
                            $scope.listProject();
                            $scope.name = '';
                        } else {
                            $scope.error = response.message;
                        }
                    });
                };

                $scope.logout = function () {
                    AuthenticationService.Logout(function(response){
                        if(response.result){
                            AuthenticationService.ClearCredentials();
                            $location.path('/login');
                        }
                    }); 
                };
        }]);