// Make sure to include the `ui.router` module as a dependency
angular.module('wipApp', [
 /* 'wipApp.projects',
  'wipApp.projects.service',
  */
  'wipApp.user.controller',
  'wipApp.user.service',
  'wipApp.project.controller',
  'wipApp.project.service',
  'wipApp.task.controller',
  'wipApp.task.service',
  'wipApp.util.service',
  'mm.foundation',
  'wipApp.modal',
  'ui.router', 
  'ngAnimate',
  'ngCookies',
  'notificationFactory'
])

.run(['$rootScope', '$state', '$stateParams', '$cookieStore', '$http' ,function ($rootScope, $state, $stateParams, $cookieStore, $http) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.userInfo = $cookieStore.get('userInfo') || {};
        if ($rootScope.userInfo) {
        	$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.userInfo.accessToken;
        }
  			$rootScope.$on('$locationChangeSuccess', function(event, next, current) {
  				/*console.log(event, next, current);
  				console.log($state.current.name);
            // redirect to login page if not logged in
            if (e.$state.current.name !== 'login' && !$rootScope.userInfo) {
            	console.log('not login');
                $state.go('login',{redirect:true});
            }*/
        });
    
    }
  ]
)

.config(['$stateProvider', '$urlRouterProvider',function ($stateProvider,   $urlRouterProvider) {
	/////////////////////////////
	// Redirects and Otherwise //
	/////////////////////////////
	// Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
	$urlRouterProvider

	  // The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
	  // Here we are just setting up some convenience urls.
	  //.when('/p?id', '/projects/:id')
	  //.when('/project/:id', '/projects/:id')

	  // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
	  .otherwise('/login');
	//////////////////////////
	// State Configurations //
	//////////////////////////
	$stateProvider
	  //////////
	  // Login //
	  //////////
	  .state("login", {
	    url: "/login",
	    templateUrl: "app/templates/login.html",
	    controller: "userController"
	  })
	  //////////
	  // Join //
	  //////////
	  .state("join", {
	    url: "/join",
	    templateUrl: "app/templates/join.html",
	    controller: "userController"
	  })
	  //////////
	  // Project //
	  //////////
	  .state("projects", {
	    url: "/projects",
	  //  abstract: true,
	    templateUrl: "app/templates/projects.html",
	    resolve: {
				projectsList: ['projects',
				function( projects){
				  return projects.getAllProjects()
				   .success(function (response) {
						if(response.error_info == null){
							return response;
						}else{
							console.log(response.error_info.msg);
						}
						})
				   .error(function (response) {
				    console.log(response);
						});
				}]
			},
	    controller: "projectController"
	  })
	  //////////
	  // Project List //
	  //////////
	  //.state('projects.list', {

      // Using an empty url means that this child state will become active
      // when its parent's url is navigated to. Urls of child states are
      // automatically appended to the urls of their parent. So this state's
      // url is '/projects' (because '/projects' + '').
    //	url: '',

      // IMPORTANT: Now we have a state that is not a top level state. Its
      // template will be inserted into the ui-view within this state's
      // parent's template; so the ui-view within projects.html. This is the
      // most important thing to remember about templates.
    //  templateUrl: 'app/templates/projects.list.html',
    //  controller: "projectController"
    //  })
	  //////////
	  // Project Detail //
	  //////////
	  .state('projects.detail', {

      // Using an empty url means that this child state will become active
      // when its parent's url is navigated to. Urls of child states are
      // automatically appended to the urls of their parent. So this state's
      // url is '/projects' (because '/projects' + '').
    	url: '/{projectId:[0-9]{1,4}}',

      templateUrl: 'app/templates/tasks.list.html',
      controller: 'taskController'
    })
}]);