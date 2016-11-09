'use strict';

angular.module('application')
.service('authenticatedService', [
  '$http',
  'services',
  function($http, services){
    return {
      getPrivateData: function(){
        var authenticatedPath = services.application + '/authenticated/some/data';
        return $http({
          method: 'GET',
          url: authenticatedPath,
        });
      }
    };
  }
]);
