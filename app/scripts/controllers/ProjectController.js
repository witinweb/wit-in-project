app.controller('ProjectsController', ['$scope', '$rootScope', '$state', '$stateParams', '$modal', 'projectLists', 'ProjectService',
            function ($scope, $rootScope, $state, $stateParams, $modal, projectLists, ProjectService) {
                $scope.projectLists = projectLists.data.project_list;

                $rootScope.recentProject = $scope.projectLists[0].idx;

                console.log($rootScope.globals.currentUser);
                $scope.addProject = function () {
                    ProjectService.Add($scope.name, $rootScope.globals.currentUser.accessToken, function(response) {
                        if(response.result) {
                            console.log(response.result);
                            $scope.projectLists.unshift({'idx':response.project_idx, 'name':$scope.name, 'master_idx':$rootScope.globals.currentUser.LOGIN_ID});

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

                $scope.deleteProject = function (idx, $index) {
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
                        $scope.projectLists.splice($index, 1);
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