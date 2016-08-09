'use strict';

var app = angular.module('myApp', []);

app.controller('MainController', ['$scope', '$http', function($scope, $http){
    $scope.welcome_header = 'Kitty says Angular is works...';
    $scope.items = [];

    $http.get('js/items.json')
         .then(function(resp){
            console.log(resp.data);
            $scope.items = resp.data;
         });

}]);