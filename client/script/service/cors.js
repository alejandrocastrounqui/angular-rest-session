'use strict';

angular.module('application')
.service('corsService', [
  '$http',
  'services',
  function($http, services){
    return {
      getCorsData: function(){
        var corsPath = services.application + '/cors';
        return $http({
          method: 'GET',
          url: corsPath,
        });
      }
    };
  }
]);
