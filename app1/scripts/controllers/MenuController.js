app.controller('MenuController', ['$scope', '$rootScope', '$state', '$stateParams', 'AuthenticationService', function ($scope, $rootScope, $state,  $stateParams, AuthenticationService) {
    $scope.logout = function () {
        AuthenticationService.Logout(function(response){
            if(response.result){
                AuthenticationService.ClearCredentials();
                $rootScope.$loginState = false;
                $state.go("login", { redirect : true });
            }
        }); 
    };
}]);