'use strict';

angular.module('application')
.controller('main', [
  '$scope',
  '$timeout',
  'corsService',
  'loginService',
  'publicService',
  'sessionService',
  'protectedService',
  'authenticatedService',
  'petService',
  function(
    $scope, 
    $timeout, 
    corsService, 
    loginService,
    publicService,
    sessionService,
    protectedService,
    authenticatedService,
    petService
  ) {
    var DELAY = 1000;
    $scope.panels = [];
    
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
      message: 'trying to get protected data',
      process: function(){
        return protectedService.getProtectedData();
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
    
    var mkContanier = function(message){
      return {
        message: message,
        process: function(isSuccess, response){
          this.success  = isSuccess;
          this.response = response;
          this.data     = response.data || 'empty data';
          this.status   = response.status;
        }
      };
    };
    
    var makeRequest = function(){
      var panel = [];
      var index = 0;
      var probeRequest = probeRequests[index];
      var makeRequest = function(probeRequest, mkNext){
        var container = mkContanier(probeRequest.message);
        var next = mkNext(container);
        probeRequest.process().then(next(true), next(false));
        panel.push(container);
      };
      var mkNext = function(container){
        return function(isSuccess){
          return function(response, error){
            container.process(isSuccess, response);
            index++;
            if(index < probeRequests.length){
              var probeRequest = probeRequests[index];
              makeRequest(probeRequest, mkNext);
            }
          };
        };
      };
      makeRequest(probeRequest, mkNext);
      panel.index = $scope.panels.length +1;
      $scope.panels.unshift(panel);
    };
    
    var getUser = function(){
      $scope.connecting = true;
      sessionService.fetchSessionData()
        .success(function(userDTO){
          $scope.fullyAuthenticated = true;
          $scope.connecting = false;
          $scope.nickName = userDTO.firstName + ' ' + userDTO.lastName;
          makeRequest();
        })
        .error(function(error){
          $scope.connecting = false;
          makeRequest();
        });
    };
    
    
    $scope.login = function(credentials){
      if (!$scope.loginForm.$valid){
        $scope.invalidSubmit = true;
      }
      else{
        $scope.invalidSubmit = false;
        $scope.connecting = true;
        //$timeout(function(){
        loginService.login(credentials)
          .success(function(){
            $scope.partialAuthenticated = true;
            $scope.connecting = false;
            $scope.loginError = null;
            makeRequest();
          })
          .error(function(error){
            $scope.connecting = false;
            $scope.loginError = 'Credenciales incorrectas';
            makeRequest();
          });
        //}, DELAY);
      }
    };
    
    $scope.complete = function(credentials){
      if (!$scope.completeForm.$valid){
        $scope.invalidSubmit = true;
      }
      else{
        $scope.invalidSubmit = false;
        $scope.completing = true;
        //$timeout(function(){
        loginService.complete(credentials.codigo)
          .success(function(){
            $scope.fullyAuthenticated = true;
            $scope.partialAuthenticated = false;
            $scope.completing = false;
            $scope.completeError = null;
            getUser();
          })
          .error(function(error){
            $scope.completing = false;
            $scope.completeError = 'Codigo incorrecto';
            makeRequest();
          });
        //}, DELAY);
      }
    };
    
    $scope.logout = function(){
      $scope.loginout = true;
      loginService.logout()
        .success(function(){
          $scope.fullyAuthenticated = false;
          $scope.loginout = false;
          makeRequest();
        })
        .error(function(error){
          $scope.logoutError = 'Error al finalizar sesion';
          makeRequest();
        });
    };
   
    getUser();
    
    
    
  
}]);
