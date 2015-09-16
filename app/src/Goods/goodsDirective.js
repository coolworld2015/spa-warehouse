(function () {
    'use strict';

    angular
        .module('App')
        .directive('dirGoods', dirGoods);

    function dirGoods() {
        return {
            restrict: 'E',
            link: function (scope) {
                scope.$watch('currentPage', currentPage);
                scope.$watch('numPerPage', currentPage);

                function currentPage() {
                    if (Object.prototype.toString.call(scope.goods) == '[object Array]') {
                        var begin = ((scope.currentPage - 1) * scope.numPerPage);
                        var end = parseInt(begin) + parseInt(scope.numPerPage);
                        scope.filteredGoods = scope.goods.slice(begin, end);
                        scope.totalItems = scope.goods.length;
                    }
                }
            },
            templateUrl: 'Goods/dir-goods.html'
        }
    }

    angular
        .module('App')
        .directive('dirGoodsEdit', dirGoodsEdit);

    function dirGoodsEdit() {
        return {
            restrict: 'E',
            templateUrl: 'Goods/dir-goods-edit.html'
        }
    }

    angular
        .module('App')
        .directive('dirGoodsAdd', dirGoodsAdd);

    function dirGoodsAdd() {
        return {
            restrict: 'E',
            templateUrl: 'Goods/dir-goods-add.html'
        }
    }

    angular
        .module('App')
        .directive('dirGoodsDialog', dirGoodsDialog);

    function dirGoodsDialog() {
        return {
            restrict: 'E',
            templateUrl: 'Goods/dir-goods-dialog.html'
        }
    }

})();
