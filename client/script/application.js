'use strict';

angular.module('application', [
  'ngRoute'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/main', {
    templateUrl: 'markup/main.html', 
    controller: 'main'
  })
  .otherwise({
    redirectTo: '/main'
  });
}]);
