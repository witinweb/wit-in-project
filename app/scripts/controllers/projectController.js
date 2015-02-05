angular.module('wipApp.project.controller', [])
.controller('projectController', ['$scope', '$stateParams', '$state', 'projectsList' ,'projects', 'notificationFactory', 'modalWindowFactory', 
	function (  $scope,   $stateParams,   $state, projectsList,  projects, notificationFactory, modalWindowFactory) {


    $scope.showAddProjectForm = false;
    $scope.showAddProjectButton = true;
	// PRIVATE FUNCTIONS 
    // 성공 알림 function
	var requestSuccess = function () {
  		notificationFactory.success();
	}
	// 실패 알림 function
	var requestError = function () {
		notificationFactory.error();
	}
	// 이름 중복 검사 function
	var isNameDuplicated = function (projectName) {
		return $scope.projects.some(function (entry) {
			return entry.name.toUpperCase() == projectName.toUpperCase();
		});
	};
    // Toggle an item between normal and edit mode
    $scope.toogleAddProjectFrom = function () {
        // Toggle
        $scope.showAddProjectForm = !$scope.showAddProjectForm;
        $scope.showAddProjectButton = !$scope.showAddProjectButton;

        // if todo is not in edit mode anymore
        if (!todo.editMode) {
            // Restore name
            todo.name = todo.serverName;
        } else {
            // save server name to restore it if the user cancel edition
            todo.serverName = todo.name;

            // Set edit mode = false and restore the name for the rest of items in edit mode
            // (there should be only one)
            $scope.todos.forEach(function (i) {
                // item is not the item being edited now and it is in edit mode
                if (todo.id != i.id && i.editMode) {
                    // Restore name
                    i.name = i.serverName;
                    i.editMode = false;
                }
            });
        }
    };
	// all the items
    $scope.projects = [];
    // the item being added
    $scope.newProject = {};
    // indicates if the view is being loaded
    //$scope.loading = false;
    // indicates if the view is in add mode
    //$scope.addMode = false;

	$scope.addProject = function(){
		projects.AddProject($scope.newProject)
			.success(function(response){
				if(response.error_info == null){
					requestSuccess();
					$scope.projects.push(response.new_project);
					$scope.newProject = {};
					
				}else{
					$scope.error = response.error_info.msg;
					requestError();
				}
			})
		// 기존에 동일한 이름의 프로젝트가 있는지 확인
		/*var duplicated = isNameDuplicated($scope.newProject.name);
		
		if(!duplicated){
  		$scope.newProject.id = Math.floor(Math.random() * 100) +1;
  		$scope.projects.unshift($scope.newProject);
  		console.log($scope.newProject);
        requestSuccess();
  		$scope.newProject.name = '';
		} else{
			notificationFactory.error("The project already exists.")
		}*/
	};
	$scope.modifyProject = function (project){
		projects.ModifyProject(project.idx, project.name)
			.success(function(response){
				if(response.error_info == null){
					requestSuccess();
					
				}else{
					$scope.error = response.error_info.msg;
					requestError();
				}
			})
	};
        //todo prevent delete click event
	$scope.deleteProject = function (project){
		var title = "Delete '" + project.name + "'";
		var msg = "Are you sure you want to remove this project?";
		var confirmCallback = function () {
			requestSuccess();
			var index = $scope.projects.indexOf(project);
			$scope.projects.splice(index, 1);
			
		};
		modalWindowFactory.show(title, msg, confirmCallback, project.idx);
	};

	//프로젝트 리스트 
	$scope.projects = projectsList.data.project_list;
	//console.table(projectsList.data.project_list);
}]);