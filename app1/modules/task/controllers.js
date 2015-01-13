'use strict';

angular.module('Task')

    .controller('TaskController',
        ['$scope', '$rootScope', '$location', 'TaskService',
            function ($scope, $rootScope, $location, TaskService) {

                $scope.login = function () {
                    $scope.dataLoading = true;
                    AuthenticationService.Login($scope.id, $scope.password, function(response) {
                        if(response.result) {
                            AuthenticationService.SetCredentials($scope.id, response.name, response.accessToken);
                            $location.path('/');
                        } else {
                            $scope.error = response.message;
                            $scope.dataLoading = false;
                        }
                    });
                };
                
                $scope.join = function(){
                    $scope.dataLoading = true;
                    AuthenticationService.Join($scope.name, $scope.id, $scope.password, function(response) {
                        if(response.result) {
                            $location.path('/login');
                        } else {
                            $scope.error = response.error_msg;
                            $scope.dataLoading = false;
                        }
                    });
                };
            }]);