'use strict';

angular.module('application')
.service('loginService', [
  '$http',
  'services',
  function($http, services){
    return {
      login: function(credentials){
        var loginPath = services.application + '/login';
        return $http({
          method: 'POST',
          url: loginPath,
          data: $.param(credentials),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true
        });
      },
      complete: function(code){
        var completePath = services.application + '/session/complete';
        return $http({
          method: 'POST',
          url: completePath,
          data: $.param({code:code}),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true
        });
      },
      logout: function(){
        var logoutPath = services.application + '/logout';
        return $http({
          method: 'GET',
          url: logoutPath,
          withCredentials: true
        });
      }
    };
  }
]);
