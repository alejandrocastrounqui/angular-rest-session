'use strict';

angular.module('application')
.controller('main', [
  '$scope',
  'loginService',
  'corsService',
  'publicService',
  'authenticatedService',
  'petService',
  function(
    $scope, 
    loginService,
    corsService, 
    publicService,
    authenticatedService,
    petService
  ) {
    
    var probeRequests = [{
      message: 'trying to get cors data',
      process: function(){
        return corsService.getCorsData();
      }
    },{
      message: 'trying to get public data',
      process: function(){
        return publicService.getPublicData();
      }
    },{
      message: 'trying to get private data',
      process: function(){
        return authenticatedService.getPrivateData();
      }
    },{
      message: 'trying to get pets from user bruced',
      process: function(){
        return petService.getByOwnername('bruced');
      }
    },{
      message: 'trying to get pets from user steveh',
      process: function(){
        return petService.getByOwnername('steveh');
      }
    },{
      message: 'trying to get pets from user adrians',
      process: function(){
        return petService.getByOwnername('adrians');
      }
    },{
      message: 'trying to get pets from user davem',
      process: function(){
        return petService.getByOwnername('davem');
      }
    }];
    
    var makeRequest = function(){
      var index = 0;
      var next = function(isSuccess){
        return function(previusResponse){
          console.log(isSuccess?'success':'error');
          console.log(previusResponse);
          if(index < probeRequests.length){
            var probeRequest = probeRequests[index++];
            console.log(probeRequest.message);
            probeRequest.process().then(next(true), next(false));
          }
        };
      };
      next(true)("start");
    };
    
    makeRequest();
    
    $scope.login = function(credentials){
      if (!$scope.loginForm.$valid){
        $scope.invalidSubmit = true;
      }
      else{
        $scope.invalidSubmit = false;
        $scope.connecting = true;
        loginService.login(credentials)
          .success(function(){
            $scope.partialAuthenticated = true;
            $scope.connecting = false;
            $scope.loginError = null;
          })
          .error(function(error){
            $scope.connecting = false;
            $scope.loginError = error;
          });
      }
    };
    
   
    
    
    
  
}]);
