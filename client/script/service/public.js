'use strict';

angular.module('application')
.service('publicService', [
  '$http',
  'services',
  function($http, services){
    return {
      getPublicData: function(){
        var publicPath = services.application + '/public/some/data';
        return $http({
          method: 'GET',
          url: publicPath,
        });
      }
    };
  }
]);
