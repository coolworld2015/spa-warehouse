(function () {
    'use strict';

    angular
        .module('App')
        .controller('Config', Config);

    Config.$inject = ['$scope', '$rootScope', '$http', 'ClientsService', 'GoodsService', 'UsersService'];

    function Config($scope, $rootScope, $http, ClientsService, GoodsService, UsersService) {

        angular.extend($scope, {
            init: init,
            toggleMode: toggleMode,
            updateChange: updateChange,
            doAction: doAction,

            _getClientsHeroku: getClientsHeroku,
            _getGoodsHeroku: getGoodsHeroku,
            _getUsersHeroku: getUsersHeroku,

            _loading: loading,
            _error: error,
            _complete: complete,

            toMain: toMain
        });

        init();

        function init() {
            $scope.mode = $rootScope.mode;
            $scope.error = false;
            $scope.complete = false;

            $scope.options = [
                {name: 'Select transaction', value: 'none'},
                {name: 'Get clients (Heroku)', value: 'heroku.clients.get'},
                {name: 'Get goods (Heroku)', value: 'heroku.goods.get'},
                {name: 'Get users (Heroku)', value: 'heroku.users.get'}
            ];
            $scope.selectedItem = $scope.options[0];
        }

        function toggleMode() {
            if ($scope.mode == 'OFF-LINE (LocalStorage)') {
                $scope.mode = 'ON-LINE (Heroku)';
                $rootScope.mode = 'ON-LINE (Heroku)';
            } else {
                $scope.mode = 'OFF-LINE (LocalStorage)';
                $rootScope.mode = 'OFF-LINE (LocalStorage)';
            }
			localStorage.setItem('warehouse_mode', JSON.stringify($scope.mode));
            toMain();
        }

        function updateChange(val, id) {
            switch (id) {
                case 'selectedItem':
                    $scope.selectedItem = val;
                    break;
            }
        }

        function doAction() {
            loading();

            switch ($scope.selectedItem.value) {
                case 'none':
                {
                    error();
                    break;
                }

                case 'heroku.clients.get':
                {
                    getClientsHeroku();
                    break;
                }

                case 'heroku.goods.get':
                {
                    getGoodsHeroku();
                    break;
                }

                case 'heroku.users.get':
                {
                    getUsersHeroku();
                    break;
                }
            }
        }

        function getClientsHeroku() {
            var url = 'http://coolworld2015a1.herokuapp.com/api/clients/get';
            $http.get(url)
                .then(function (results) {
                    console.log(results.data);
                    ClientsService.uploadClients(results.data);
                    complete();
                })
                .catch(function (data) {
                    console.log('catch - ' + data.status);
                    console.log(data);
                    error();
                });
        }

        function getGoodsHeroku() {
            var url = 'http://coolworld2015a1.herokuapp.com/api/goods/get';
            $http.get(url)
                .then(function (results) {
                    console.log(results.data);
                    GoodsService.uploadGoods(results.data);
                    complete();
                })
                .catch(function (data) {
                    console.log('catch - ' + data.status);
                    console.log(data);
                    error();
                });
        }

        function getUsersHeroku() {
            var url = 'http://coolworld2015a1.herokuapp.com/api/users/get';
            $http.get(url)
                .then(function (results) {
                    console.log(results.data);
                    UsersService.uploadUsers(results.data);
                    complete();
                })
                .catch(function (data) {
                    console.log('catch - ' + data.status);
                    console.log(data);
                    error();
                });
        }

        function loading() {
            $rootScope.loading = true;
            $scope.$broadcast('scrollThere');
            $scope.complete = false;
            $scope.error = false;
        }

        function error() {
            $rootScope.loading = false;
            $scope.complete = false;
            $scope.loading = false;
            $scope.error = true;
        }

        function complete() {
            $rootScope.loading = false;
            $scope.error = false;
            $scope.loading = false;
            $scope.complete = true;
        }

        function toMain() {
            $rootScope.id = 0;
            $rootScope.view = 'main';
        }
    }
})();

