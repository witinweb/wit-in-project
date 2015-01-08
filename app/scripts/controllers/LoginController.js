app.controller('LoginController', ['$scope', '$rootScope', '$state', 'AuthenticationService', 'projects', function ($scope, $rootScope, $state,  AuthenticationService, projects) {
                // reset login status
                AuthenticationService.ClearCredentials();

                $scope.login = function () {
                    $scope.dataLoading = true;
                    AuthenticationService.Login($scope.id, $scope.password, function(response) {
                        if(response.result) {
                            AuthenticationService.SetCredentials($scope.id, response.name, response.accessToken);
                            $state.go('home');
                        } else {
                            $scope.error = response.error_msg;
                            $scope.dataLoading = false;
                        }
                    });
                };
                
                $scope.join = function(){
                    $scope.dataLoading = true;
                    AuthenticationService.Join($scope.name, $scope.id, $scope.password, function(response) {
                        if(response.result) {
                            $state.go('login');
                        } else {
                            $scope.error = response.error_msg;
                            $scope.dataLoading = false;
                        }
                    });
                };

                $scope.logout = function () {
                    AuthenticationService.Logout(function(response){
                        if(response.result){
                            AuthenticationService.ClearCredentials();
                            $state.go('login');
                        }
                    }); 
                };
            }]);