(function () {
    'use strict';

    angular
        .module('App')
        .controller('Store', Store);

    Store.$inject = ['$rootScope', '$scope', 'storeData', '$location', '$anchorScroll'];

    function Store($rootScope, $scope, storeData, $location, $anchorScroll) {
        $scope.numPerPage = $rootScope.numPerPage;
        $scope.init = init;
        $scope.numPages = numPages;
        $scope.updateChange = updateChange;
        $scope.storeBack = storeBack;
        $scope.storeEditBack = storeEditBack;
        $scope.storeSubmit = storeSubmit;
        $scope.storeDelete = storeDelete;
        $scope.storeSort = storeSort;
        $scope.storeEditForm = storeEditForm;
        $scope.storeAdd = storeAdd;
        $scope.storeAddSubmit = storeAddSubmit;

        function init() {
            $scope.sort = 'name';
            $scope.title = 'Store';
            $scope.store = storeData.getStore();

            $scope.myScrollTo = function (id) {
                $location.hash(id);
                $anchorScroll();
                var id1 = document.getElementById(id);
                id1.focus();
            };

            $scope.currentPage = 1;
            $scope.maxSize = 5;
        }

        function numPages() {
            return Math.ceil($scope.store.length / $scope.numPerPage);
        }

        function updateChange(val, id) {
            switch (id) {
                case 'name':
                    $scope.name = val;
                    break;
                case 'price':
                    $scope.price = val;
                    break;
                case 'quantity':
                    $scope.quantity = val;
                    break;
                case 'description':
                    $scope.description = val;
                    break;
                case 'numPerPage':
                    $scope.numPerPage = val;
                    break;
            }
        }

        function storeBack() {
            $rootScope.id = 0;
            $rootScope.view = 'main';
        }

        function storeEditBack() {
            $rootScope.view = 'store';
        }

        function storeSubmit() {
            var obj = {
                id: $scope.id,
                name: $scope.name,
                price: $scope.price,
                quantity: $scope.quantity,
                description: $scope.description
            };

            for (var i = 0; i < $scope.store.length; i++) {
                if ($scope.store[i].id == $scope.id) {
                    $scope.store.splice(i, 1, obj);
                    storeData.setStore($scope.store);
                }
            }
            $rootScope.view = 'store';
        }

        function storeDelete() {
            for (var i = 0; i < $scope.store.length; i++) {
                if ($scope.store[i].id == $scope.id) {
                    $scope.store.splice(i, 1);
                }
            }
            storeData.setStore($scope.store);
            storeData.setCounter($scope.storeCount);
            $rootScope.view = 'store';
        }

        function storeSort(val) {
            $scope.sort = val;
            $scope.rev = !$scope.rev;
        }

        function storeEditForm(item) {
            $rootScope.view = 'storeEdit';

            $scope.id = item.id;
            $scope.name = item.name;
            $scope.price = item.price;
            $scope.quantity = item.quantity;
            $scope.qnt = Number(item.quantity).toFixed(2);
            $scope.description = item.description;
        }

        function storeAdd() {
            $scope.name = '';
            $scope.quantity = '';
            $scope.description = '';

            $rootScope.view = 'storeAdd';
        }

        function storeAddSubmit() {
            $scope.storeCount++;
            var obj = {
                id: $scope.storeCount,
                name: $scope.name,
                price: $scope.price,
                quantity: $scope.quantity,
                description: $scope.description
            };

            $scope.store.push(obj);
            storeData.setStore($scope.store);
            $rootScope.view = 'store';
        }
    }
})();
















