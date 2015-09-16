(function () {
    'use strict';

    angular
        .module('App')
        .factory('storeData', storeData);

    function storeData() {
        return {
            getStore: getStore
        };

        function getStore() {
            var goods = localStorage.getItem('warehouse_goods');
            goods = JSON.parse(goods);

            var store = [];
            if (goods === null) {
                goods = [];
            }

            goods.filter(function (el) {
                if (el.store === true) {
                    store.push(el);
                    return el;
                }
            });
            return store;
        }

    }
})();
