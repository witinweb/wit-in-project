angular.module('wipApp.user.service', [

])
.factory('user', ['$http','$rootScope', function ($http, $rootScope) {
  var path = '/backApp/v1.0/users';
  var user = {};

  user.Login = function (id, password) {
    return $http.post(path+'/login', { id: id, password: password });
  };
  user.Join = function (name, id, password) {
    return $http.post(path+'/join', { name: name, id: id, password: password });
  };
  user.SetUser = function (user) {
  	$rootScope.loginState = true;
		$rootScope.userInfo = user;
		$http.defaults.headers.common['Authorization'] = 'Basic ' + user.accessToken;
	};

	user.Logout = function () {
	    $rootScope.globals = {};
	    $cookieStore.remove('globals');
	    $http.defaults.headers.common.Authorization = 'Basic ';
	};
  return user;
}]);