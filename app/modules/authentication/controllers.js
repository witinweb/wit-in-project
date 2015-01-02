'use strict';

angular.module('Authentication')

    .controller('LoginController',
        ['$scope', '$rootScope', '$location', 'AuthenticationService',
            function ($scope, $rootScope, $location, AuthenticationService) {
                // reset login status
                AuthenticationService.ClearCredentials();

                $scope.login = function () {
                    $scope.dataLoading = true;
                    AuthenticationService.Login($scope.id, $scope.password, function(response) {
                        if(response.result) {
                            AuthenticationService.SetCredentials($scope.id, $scope.password);
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