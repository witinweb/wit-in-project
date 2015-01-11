app.controller('TaskController', ['$scope', '$rootScope', '$state', '$modal', 'taskLists', 'TaskService',
            function ($scope, $rootScope, $state, $modal, taskLists, TaskService) {
                console.log(taskLists.data);
                $scope.taskLists = taskLists.data.task_list;

                //$scope.recentProject = $scope.projectLists[0];
                //console.log($scope.recentProject.name);

                $scope.addProject = function () {
                    ProjectService.Add($scope.name, $rootScope.globals.currentUser.accessToken, function(response) {
                        if(response.result) {
                            console.log(projectLists.data.project_list);
                            ProjectService.projectLists;
                            //console.log(response);
                        } else {
                            $scope.error = response.message;
                        }
                    });
                };

                $scope.modifyProject = function (name, idx) {
                    ProjectService.Modify(name, idx, $rootScope.globals.currentUser.accessToken, function(response) {
                        if(response.result) {
                            $scope.edit = !$scope.edit;
                        } else {
                            $scope.error = response.message;
                        }
                    });
                };

                $scope.deleteProject = function (idx) {
                    $scope.idx = idx;
                    var modalInstance = $modal.open({
                        templateUrl: 'delete.html',
                        controller: 'ModalInstanceController',
                        resolve: {
                            idx: function () {
                              return $scope.idx;
                            }
                        }
                    });
                    modalInstance.result.then(function (ProjectItem) {
                      console.log("삭제했어요")
                    });
                };
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
                };
                */
        }])