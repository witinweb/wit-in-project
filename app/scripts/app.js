var app = angular.module('wipApp', [
    'ui.router',
    'ngCookies',
    'wipApp.projects',
    'wipApp.projects.service'
]);

app.run(['$rootScope', '$state', '$stateParams', '$cookies', function ($rootScope, $state, $stateParams, $cookies) {
    // It's very handy to add references to $state and $stateParams to the $rootScope
    // so that you can access them from any scope within your applications.For example,
    // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
    // to active whenever 'contacts.list' or one of its decendents is active.
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$loginState = false;
    $rootScope.globals = {
            currentUser: {
                LOGIN_ID: $cookies['LOGIN_ID'],
                LOGIN_NAME: $cookies['LOGIN_NAME'],
                accessToken: $cookies['accessToken']
            }
        };
      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if($rootScope.globals.currentUser.accessToken != undefined){
          $rootScope.$loginState = true;
        }
        console.log("$rootScope.globals.currentUser.accessToken :"+$rootScope.globals.currentUser.accessToken);
      });
    //only change location state
    //$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    // redirect to login page if not logged in
    //console.log("url: "+toState.name+", token: "+$rootScope.globals.currentUser.accessToken);
    //console.log("$rootScope.globals.currentUser.accessToken :"+$rootScope.globals.currentUser.accessToken+", $cookies.accessToken:"+$cookies.accessToken);
    //if(toState.name != "login" && $cookies.accessToken != undefined){
     //   console.log("login!!");
        //$state.transitionTo('project');
   // }
   // if ( (($location.path() !== '/login') && ($rootScope.globals.currentUser.accessToken == undefined)) || (($location.path() !== '/join') && ($rootScope.globals.currentUser.accessToken == undefined)) ) {
        //$state.go('');        
    //}
    //don't redirect to login page if logged in
    //if ( ($location.path() == '/login') && ($rootScope.globals.currentUser.accessToken != undefined) ) {
       //$state.go('login');
    //}
    //});
}]);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider,   $urlRouterProvider) {

      /////////////////////////////
      // Redirects and Otherwise //
      /////////////////////////////

      // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
      $urlRouterProvider

        // The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
        // Here we are just setting up some convenience urls.
        .when('/p?id', '/projects/:id')
        .when('/projects/:id', '/projects/:id')

        // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
        .otherwise('/');


       //////////////////////////
      // State Configurations //
      //////////////////////////

      // Use $stateProvider to configure your states.
      $stateProvider

        ///////////
        // Login //
        ///////////

        .state('login', {
          url: '/',
          templateUrl: 'app/templates/login.html'
        })

        ///////////
        // Join //
        ///////////

        .state('join', {
          url: '/join',
          templateUrl: 'app/templates/join.html'
        })

       
}]);