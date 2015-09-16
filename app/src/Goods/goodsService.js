(function () {
    'use strict';

    angular
        .module('App')
        .factory('GoodsService', GoodsService);

    GoodsService.$inject = ['$rootScope', '$http', '$q'];

    function GoodsService($rootScope, $http, $q) {
        var webUrl = $rootScope.myConfig.webUrl;

        return {
            goods: [],
            numPerPage: 10,

            getGoods: getGoods,
            _getGoodsON: getGoodsON,
            _getGoodsOFF: getGoodsOFF,

            addItem: addItem,
            _addItemON: addItemON,
            _addItemOFF: addItemOFF,

            editItem: editItem,
            _editItemON: editItemON,
            _editItemOFF: editItemOFF,

            deleteItem: deleteItem,
            _deleteItemON: deleteItemON,
            _deleteItemOFF: deleteItemOFF,

            setGoods: setGoods,

            uploadGoods: uploadGoods,
            _sort: sort
        };

        function getGoods() {
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                return getGoodsON();
            } else {
                return getGoodsOFF();
            }
        }

        function getGoodsON() {
            $rootScope.loading = true;
            var url = webUrl + 'api/goods/get';
            return $http.get(url)
                .then(function (result) {
                    result.data.sort(sort);
                    return result;
                })
                .catch(function (reject) {
                    return $q.reject(reject);
                });
        }

        function getGoodsOFF() {
            if (GoodsService.goods === undefined) {
                var goods = localStorage.getItem('warehouse_goods');
                goods = JSON.parse(goods);
                GoodsService.goods = goods;
            }

            if (GoodsService.goods === null) {
                GoodsService.goods = [];
            }

            return GoodsService.goods.sort(sort);
        }

        function addItem(item) {
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                return addItemON(item);
            } else {
                return addItemOFF(item);
            }
        }

        function addItemON(item) {
            var url = webUrl + 'api/goods/add';
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                })
                .catch(function (reject) {
                    return $q.reject(reject);
                });
        }

        function addItemOFF(item) {
            GoodsService.goods.push(item);
            setGoods();
        }

        function editItem(item) {
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                return editItemON(item);
            } else {
                return editItemOFF(item);
            }
        }

        function editItemON(item) {
            var url = webUrl + 'api/goods/update';
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                })
                .catch(function (reject) {
                    return $q.reject(reject);
                });
        }

        function editItemOFF(item) {
            var goods = GoodsService.goods;
            for (var i = 0; i < goods.length; i++) {
                if (goods[i].id == item.id) {
                    goods.splice(i, 1, item);
                    setGoods();
                    break;
                }
            }
        }

        function deleteItem(id) {
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                return deleteItemON(id);
            } else {
                return deleteItemOFF(id);
            }
        }

        function deleteItemON(id) {
            var url = webUrl + 'api/goods/delete';
            var user = {
                "id": id
            };
            return $http.post(url, user)
                .then(function (result) {
                    return result;
                })
                .catch(function (reject) {
                    return $q.reject(reject);
                });
        }

        function deleteItemOFF(id) {
            var goods = GoodsService.goods;
            for (var i = 0; i < goods.length; i++) {
                if (goods[i].id == id) {
                    goods.splice(i, 1);
                    setGoods();
                    break;
                }
            }
        }

        function setGoods() {
            localStorage.setItem('warehouse_goods', JSON.stringify(GoodsService.goods));
        }

        function uploadGoods(goods) {
            localStorage.setItem('warehouse_goods', JSON.stringify(goods));
            GoodsService.goods = undefined;
        }
		
        function sort(a, b) {
            var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
            if (nameA < nameB) {
                return -1
            }
            if (nameA > nameB) {
                return 1
            }
            return 0;
        }
    }
})();