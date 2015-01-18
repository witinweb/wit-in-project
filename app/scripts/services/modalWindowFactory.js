angular.module('wipApp.modal', [

])
.factory('modalWindowFactory', function ($modal) {
 
    var modalWindowController = _modalWindowController;
 
    return {
 
        // Show a modal window with the specified title and msg
        show: function (title, msg, confirmCallback, id) {
 
            // Show window
            var modalInstance = $modal.open({
                templateUrl: 'app/templates/modalWindow.html',
                controller: modalWindowController,
                size: 'sm',
                resolve: {
                    title: function () {
                        return title;
                    },
                    body: function () {
                        return msg;
                    },
                    id: function(){
                        return id;
                    }
                }
            });
 
            // Register confirm and cancel callbacks
            modalInstance.result.then(
                // if any, execute confirm callback
                function() {
                    if (confirmCallback != undefined) {
                        confirmCallback();
                    }
                },
                // if any, execute cancel callback
                function () {
                    if (cancelCallback != undefined) {
                        cancelCallback();
                    }
                });
        }
    };
 
 
    // Internal controller used by the modal window
    function _modalWindowController($scope, $modalInstance, title, body, id, projects) {
        $scope.title = "";
        $scope.body = "";
 
        // If specified, fill window title and message with parameters
        if (title) {
            $scope.title = title;
        }
        if (body) {
            $scope.body = body;
        }
        console.log(id);
 
        $scope.confirm = function () {
            projects.DeleteProject(id)
            .success(function(response){
                if(response.error_info == null){
                    console.log(response);
                    
                }else{
                    console.log(response.error_info.msg);
                }
            })
            $modalInstance.close();
        };
 
        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    };
 
 
});