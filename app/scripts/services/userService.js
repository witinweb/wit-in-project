angular.module('wipApp.user.service', [

])
.factory('user', ['$http', function ($http) {
  var path = '/backApp/v1.0/users';
  var user = {};

  user.login = function (id, password) {
    return $http.post(path+'/login', { id: id, password: password });
  };
  user.get = function (id) {
    return user.then(function(){
      return utils.findById(user, id);
    })
  };
  return user;
}]);