'use strict';

angular.module('application')
.service('petService', [
  '$http',
  'services',
  function($http, services){
    return {
      getByOwnername: function(ownername){
        var byOwnernamePath = services.application + '/pet/from/'+ownername;
        return $http({
          method: 'GET',
          url: byOwnernamePath,
        });
      }
    };
  }
]);
