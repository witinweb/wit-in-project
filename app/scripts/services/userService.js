angular.module('wipApp.user.service', [

])
.factory('user', ['$http','$rootScope', '$cookieStore', '$state', function ($http, $rootScope, $cookieStore, $state) {
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
    $cookieStore.put('userInfo', $rootScope.userInfo);
	};

	user.Logout = function () {
	    $rootScope.userInfo = {};
	    $cookieStore.remove('userInfo');
	    $http.defaults.headers.common.Authorization = 'Basic ';
      $state.go('login',{redirect:true});
	};
  return user;
}]);