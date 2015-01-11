angular.module('wipApp.task.service', [

])
.factory('TaskService',
    ['$http', '$cookies', '$rootScope',
    function ($http, $cookies, $rootScope) {

        var taskLists = $http.post('backApp/v1.0/tasks/ViewAll', { project_idx: 10, accessToken: $rootScope.globals.currentUser.accessToken })
                .success( function (response){
                    //result 처리
                       console.log(response.result);
                    taskLists = response.task_list;
                    return taskLists;
                })
                .error( function (response){
                    console.log(response.result);
                    taskLists = response.error_msg;
                    return taskLists;
                });

        var factory = {};
        factory.UserProject = function (idx, accessToken, callback) {

              $http.post('backApp/v1.0/projects/add', { name: name, accessToken: accessToken })
                .success(function (response){
                   callback(response);
                });
                return 
        };
        factory.Add = function (name, accessToken, callback) {
            $http.post('backApp/v1.0/tasks/add', { name: name, accessToken: accessToken })
                .success(function (response){
                   callback(response);
                });
        };

        factory.Modify = function (name, idx, accessToken, callback) {

            $http.post('backApp/v1.0/tasks/modify', { name: name, project_idx: idx, accessToken: accessToken })
                .success(function (response){
                   callback(response);
                });
        };

        factory.Delete = function (idx, accessToken, callback) {

            $http.post('backApp/v1.0/tasks/del', { project_idx: idx, accessToken: accessToken })
                .success(function (response){
                   callback(response);
                });
        };

        factory.ViewAll = function (callback) {

            $http.post('backApp/v1.0/tasks/ViewAll')
                .success(function (response){
                   callback(response);
                });
        };

        factory.View = function () {
            return taskLists;
        };
 
        return factory;
    }]);