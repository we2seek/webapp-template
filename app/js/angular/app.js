(function() {
    'use strict';

    angular
        .module('myApp', ['ui.bootstrap'])
        .controller('MainController', ['$scope', '$http', function($scope, $http) {
            $scope.welcome_header = 'Charley says Angular is works...';
            $scope.items = [];

            $http.get('js/angular/items.json')
                .then(function(resp) {
                    console.log(resp.data);
                    $scope.items = resp.data;
                });

            $scope.dt = new Date();

        }]);

})();
