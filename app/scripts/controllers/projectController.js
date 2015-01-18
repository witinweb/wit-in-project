angular.module('wipApp.project.controller', [])
.controller('projectController', ['$scope', '$stateParams', '$state', 'projects', 'notificationFactory', 
	function (  $scope,   $stateParams,   $state,   projects, notificationFactory) {
	
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
	// all the items
    $scope.projects = [];
    // the item being added
    $scope.newProject = {};
    // indicates if the view is being loaded
    //$scope.loading = false;
    // indicates if the view is in add mode
    //$scope.addMode = false;

	$scope.createProject = function(){
		// 기존에 동일한 이름의 프로젝트가 있는지 확인
		var duplicated = isNameDuplicated($scope.newProject.name);
		
		if(!duplicated){
  		$scope.newProject.id = Math.floor(Math.random() * 100) +1;
  		$scope.projects.unshift($scope.newProject);
  		console.log($scope.newProject);
        requestSuccess();
  		$scope.newProject.name = '';
		} else{
			notificationFactory.error("The project already exists.")
		}
	}
	$scope.deleteProject = function (project) {
	// 서버통신시 필요한 id
			//$scope.id = id;

			// 삭제 변수 지정
			var title = "Delete '" + project.name + "'";
	var msg = "Are you sure you want to remove this project?";
	var confirmCallback = function () {
		var index = $scope.projects.indexOf(project);
			$scope.projects.splice(index, 1);
	};
	modalWindowFactory.show(title, msg, confirmCallback);

	};

	$scope.projects = projects.data.projects;;

	}]);