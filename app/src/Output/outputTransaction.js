(function () {
    'use strict';

    angular
        .module('App')
        .factory('outputTransaction', outputTransaction);

    outputTransaction.$inject = ['ClientsService', 'GoodsService'];

    function outputTransaction(ClientsService, GoodsService) {
        return {
            setClientSum: setClientSum,
            setStoreSum: setStoreSum
        };

        function setClientSum(id, sum) {
            var clients = ClientsService.getClients();
            for (var i = 0; i < clients.length; i++) {
                if (clients[i].id == id) {
                    clients[i].sum = parseFloat(clients[i].sum) - parseFloat(sum);
                    ClientsService.setClients(clients);
                }
            }
        }

        function setStoreSum(id, quantity) {
            var goods = GoodsService.getGoods();
            console.log(id + '  -  ' + quantity);
            for (var i = 0; i < goods.length; i++) {
                if (goods[i].id == id) {
                    goods[i].quantity = parseFloat(goods[i].quantity) - parseFloat(quantity);
                    goods[i].store = true;
                    GoodsService.setGoods(goods);
                }
            }
        }
    }
})();
