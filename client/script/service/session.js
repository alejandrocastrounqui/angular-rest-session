'use strict';

angular.module('application')
.service('sessionService', [
  '$http',
  'services',
  function($http, services){
    return {
      fetchSessionData: function(){
        var userPath = services.application + '/session/user';
        return $http({
          method: 'GET',
          url: userPath,
          withCredentials: true
        });
      }
    };
  }
]);
