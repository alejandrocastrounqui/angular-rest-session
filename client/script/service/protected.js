'use strict';

angular.module('application')
.service('protectedService', [
  '$http',
  'services',
  function($http, services){
    return {
      getProtectedData: function(){
        var protectedPath = services.application + '/protected/some/data';
        return $http({
          method: 'GET',
          url: protectedPath,
          withCredentials: true
        });
      }
    };
  }
]);
