'use strict';

// declare modules
angular.module('Authentication', []);
angular.module('Project', []);

angular.module('BasicHttpAuthExample', [
        'Authentication',
        'Project',
        'ngRoute',
        'ngCookies'
    ])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider
            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'app/modules/authentication/views/login.html',
                hideMenus: true
            })
            .when('/join', {
                controller: 'LoginController',
                templateUrl: 'app/modules/authentication/views/join.html'
            })
            .when('/', {
                controller: 'ProjectController',
                templateUrl: 'app/modules/project/views/project.html'
            })

            .otherwise({ redirectTo: '/login' });
    }])

    .run(['$rootScope', '$location', '$cookieStore', '$http',
        function ($rootScope, $location, $cookieStore, $http) {
            // keep user logged in after page refresh
            $rootScope.globals = $cookieStore.get('globals') || {};
            if ($rootScope.globals.currentUser) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
            }

            $rootScope.$on('$locationChangeStart', function (event, next, current) {
                // redirect to login page if not logged in
                if ($location.path() !== '/login' && !$rootScope.globals.currentUser && $location.path() !== '/join' ) {
                    $location.path('/login');
                }
            });
        }]);