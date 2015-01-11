'use strict';

// declare modules
angular.module('Authentication', []);
angular.module('Project', ['mm.foundation']);
angular.module('Task', ['mm.foundation']);

angular.module('BasicHttpAuthExample', [
        'Authentication',
        'Project',
        'Task',
        'ngRoute',
        'ngCookies',
        'mm.foundation'        
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
            .when('/projects/:project_idx', {
                controller: 'TaskController',
                templateUrl: 'app/modules/task/views/task.html',
                resolve: {
                    task : function (TaskService, $route) {
                      return TaskService.get({
                        project_idx : $route.current.params.project_idx 
                      }).$promise;
                    }
                }
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

    .controller('sidebarController', ['$scope', '$rootScope', '$route', '$location','$modal', 'AuthenticationService', 'ProjectService',
            function ($scope, $rootScope, $route, $location, $modal, AuthenticationService, ProjectService) {
                $scope.listProject = function(){
                    ProjectService.ViewAll(function(response){
                        if(response.result){
                            $scope.noneProject = "";
                            var project_list = [];
                            for (var i in response.project_list) {
                                project_list[i] = response.project_list[i][0];
                            }
                            $scope.projectList = project_list;
                            $scope.projectList.edit = 0;
                        } else {
                            $scope.noneProject = "프로젝트가 없습니다";
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
                        } else {
                            $scope.error = response.message;
                        }
                    });
                };

                $scope.deleteProject = function (idx) {
                    $scope.idx = idx;
                    var modalInstance = $modal.open({
                        templateUrl: 'delete.html',
                        controller: 'ModalInstanceCtrl',
                        resolve: {
                            idx: function () {
                              return $scope.idx;
                            }
                        }
                    });
                    modalInstance.result.then(function (ProjectItem) {
                      $scope.listProject();
                    });
                }
                /*
                $scope.deleteProject = function (name, idx) {
                    ProjectService.Delete(idx, $rootScope.globals.currentUser.accessToken, function(response) {
                        if(response.result) {
                            $scope.listProject();
                        } else {
                            $scope.error = response.message;
                        }
                    });
                };
*/
                $scope.logout = function () {
                    AuthenticationService.Logout(function(response){
                        if(response.result){
                            AuthenticationService.ClearCredentials();
                            $location.path('/login');
                        }
                    }); 
                };
        }])
        .controller('ModalInstanceCtrl', function ($scope, $rootScope, $modalInstance, ProjectService, idx) {
            $scope.idx = idx;
            $scope.ok = function () {
                ProjectService.Delete($scope.idx, $rootScope.globals.currentUser.accessToken, function(response) {
                        if(response.result) {
                            $modalInstance.close();            
                        } else {
                            
                        }
                    });
                
            };

            $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
            };
        });
        