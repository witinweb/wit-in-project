app.controller('ProjectsController', ['$scope', '$rootScope', '$location', 'AuthenticationService', 'projects',
            function ($scope, $rootScope, $location, AuthenticationService, projects) {
                $scope.listProject = function(){
                    projects.ViewAll(function(response){
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
                    projects.Add($scope.name, $rootScope.globals.currentUser.accessToken, function(response) {
                        if(response.result) {
                            $scope.listProject();
                            $scope.name = '';
                        } else {
                            $scope.error = response.message;
                        }
                    });
                };

                $scope.modifyProject = function (name, idx) {
                    projects.Modify(name, idx, $rootScope.globals.currentUser.accessToken, function(response) {
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
                    projects.Delete(idx, $rootScope.globals.currentUser.accessToken, function(response) {
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