(function () {
    'use strict';

    angular
        .module('App')
        .controller('Goods', Goods);

    Goods.$inject = ['$rootScope', '$scope', 'GoodsService'];

    function Goods($rootScope, $scope, GoodsService) {
        $scope.$watch('currentPage', currentPage);
        $scope.$watch('numPerPage', currentPage);

        angular.extend($scope, {
            numPerPage: $rootScope.numPerPage,
            init: init,
            _getGoodsON: getGoodsON,
            _getGoodsOnStatic: getGoodsOnStatic,
            _currentPage: currentPage,
            numPages: numPages,
            updateChange: updateChange,
            goodsBack: goodsBack,
            goodsEditBack: goodsEditBack,
            goodsSubmit: goodsSubmit,
            goodsDeleteDialog: goodsDeleteDialog,
            goodsDelete: goodsDelete,
            goodsSort: goodsSort,
            goodsEditForm: goodsEditForm,
            goodsAdd: goodsAdd,
            goodsToStore: goodsToStore,
            goodsAddSubmit: goodsAddSubmit
        });

        function init() {
            $scope.sort = 'name';
            $scope.title = 'Commodities';
            $scope.currentPage = 1;
            $scope.maxSize = 5;

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                getGoodsOnStatic();
            } else {
				$scope.goods = GoodsService.getGoods();
			}
        }

        function getGoodsON() {
            $scope.filteredGoods = [];
            $rootScope.myError = false;
            GoodsService.getGoods()
                .then(function (data) {
                    $rootScope.loading = false;
                    $scope.goods = data.data;
                    currentPage();
                    $rootScope.view = 'goods';
                })
                .catch(function (data) {
                    $rootScope.loading = false;
                    $rootScope.myError = true;
                    console.log('catch getGoodsON - ' + data.status);
                    $rootScope.view = 'goods';
                });
        }

        function getGoodsOnStatic() {
            $scope.filteredGoods = [];
            $rootScope.myError = false;
            GoodsService.getGoods()
                .then(function (data) {
                    $rootScope.loading = false;
                    $scope.goods = data.data;
                    currentPage();
                })
                .catch(function (data) {
                    $rootScope.loading = false;
                    $rootScope.myError = true;
                    console.log('catch getGoodsON - ' + data.status);
                    $rootScope.view = 'goods';
                });
        }

        function currentPage() {
            if (Object.prototype.toString.call($scope.goods) == '[object Array]') {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage);
                var end = parseInt(begin) + parseInt($scope.numPerPage);
                $scope.filteredGoods = $scope.goods.slice(begin, end);
                $scope.totalItems = $scope.goods.length;
            }
        }

        function numPages() {
            return Math.ceil($scope.goods.length / $scope.numPerPage);
        }

        function updateChange(val, id) {
            switch (id) {
                case 'name':
                    $scope.name = val;
                    break;
                case 'price':
                    $scope.price = val;
                    break;
                case 'description':
                    $scope.description = val;
                    break;
                case 'numPerPage':
                    $scope.numPerPage = val;
                    break;
            }
        }

        function goodsBack() {
            $rootScope.id = 0;
            $rootScope.view = 'main';
        }


        function goodsEditBack() {
            $rootScope.view = 'goods';
        }

        function goodsSubmit() {
            if (this.form.$invalid) {
                return;
            }

            $scope.filteredGoods = [];
            $rootScope.myError = false;
            $rootScope.loading = true;

            var item = {
                id: $scope.id,
                name: $scope.name,
                price: $scope.price,
                quantity: 0,
                description: $scope.description
            };

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                GoodsService.editItem(item)
                    .then(function () {
                        getGoodsON();
                    })
                    .catch(function (data) {
                        $rootScope.loading = false;
                        $rootScope.myError = true;
                        console.log('catch - ' + data.status);
                        $rootScope.view = 'goods';
                    });
            } else {
                GoodsService.editItem(item);
                $rootScope.view = 'goods';
                $rootScope.loading = false;
            }
        }

		function goodsDeleteDialog() {
            $rootScope.view = 'goodsDialog';
		}

        function goodsDelete() {
            $scope.filteredGoods = [];
            $rootScope.myError = false;
            $rootScope.loading = true;

            var id = $scope.id;

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                GoodsService.deleteItem(id)
                    .then(function () {
                        getGoodsON();
                    })
                    .catch(function (data) {
                        $rootScope.loading = false;
                        $rootScope.myError = true;
                        console.log('catch - ' + data.status);
                        $rootScope.view = 'goods';
                    });
            } else {
                GoodsService.deleteItem(id);
                $rootScope.view = 'goods';
                $rootScope.loading = false;
            }
        }

        function goodsSort(val) {
            $scope.sort = val;
            $scope.rev = !$scope.rev;
        }

        function goodsEditForm(item) {
            var price = 0;
            var arr;
            $scope.id = item.id;
            $scope.name = item.name;
            $scope.price = item.price;
            $scope.sum = item.sum;
            $scope.quantity = item.quantity;
            $scope.description = item.description;

            arr = item.price.split(',');
            if (arr.length == 1) {
                price = Number(price).toFixed(2);
            }

            if (arr.length > 1) {
                price = item.price.split(',');
                price = price[0] + price[1];
                price = price / 100;
                $scope.price = price.toFixed(2);
            }

            $rootScope.view = 'goodsEdit';
        }

        function goodsAdd() {
            $scope.name = '';
            $scope.price = '';
            $scope.sum = 0;
            $scope.description = '';
            $scope.quantity = 0;

            $rootScope.view = 'goodsAdd';
        }

        function goodsToStore() {
            $scope.goods.filter(function (el) {
                if (el.store == true) {
                    $rootScope.store.push(el);
                    return el;
                }
            });
        }

        function goodsAddSubmit() {
            if (this.form.$invalid) {
                return;
            }

            $scope.filteredUsers = [];
            $rootScope.myError = false;
            $rootScope.loading = true;

            var id = (Math.random() * 1000000).toFixed();
            var item = {
                id: id,
                name: $scope.name,
                price: $scope.price,
                quantity: 0,
                description: $scope.description
            };

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                GoodsService.addItem(item)
                    .then(function () {
                        $scope.filteredGoods = [];
                        $rootScope.myError = false;
                        getGoodsON();
                    })
                    .catch(function (data) {
                        $rootScope.loading = false;
                        $rootScope.myError = true;
                        console.log('catch addItem - ' + data.status);
                        $rootScope.view = 'goods';
                    });
            } else {
                GoodsService.addItem(item);
                init();
                $rootScope.view = 'goods';
                $rootScope.loading = false;
            }
        }
    }
})();















