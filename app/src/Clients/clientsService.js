(function () {
    'use strict';

    angular
        .module('App')
        .factory('ClientsService', ClientsService);

    ClientsService.$inject = ['$rootScope', '$http', '$q'];

    function ClientsService($rootScope, $http, $q) {
        var webUrl = $rootScope.myConfig.webUrl;

        return {
            clients: [],
            numPerPage: 10,

            getClients: getClients,
            _getClientsON: getClientsON,
            _getClientsOFF: getClientsOFF,

            addItem: addItem,
            _addItemON: addItemON,
            _addItemOFF: addItemOFF,

            editItem: editItem,
            _editItemON: editItemON,
            _editItemOFF: editItemOFF,

            deleteItem: deleteItem,
            _deleteItemON: deleteItemON,
            _deleteItemOFF: deleteItemOFF,

            setClients: setClients,

            uploadClients: uploadClients,
            _sort: sort
        };

        function getClients() {
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                return getClientsON();
            } else {
                return getClientsOFF();
            }
        }

        function getClientsON() {
            $rootScope.loading = true;
            var url = webUrl + 'api/clients/get';
            return $http.get(url)
                .then(function (result) {
                    result.data.sort(sort);
                    return result;
                })
                .catch(function (reject) {
                    return $q.reject(reject);
                });
        }

        function getClientsOFF() {
            if (ClientsService.clients === undefined) {
                var clients = localStorage.getItem('warehouse_clients');
                clients = JSON.parse(clients);
                ClientsService.clients = clients;
            }

            if (ClientsService.clients === null) {
                ClientsService.clients = [];
            }

            return ClientsService.clients.sort(sort);
        }

        function addItem(item) {
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                return addItemON(item);
            } else {
                return addItemOFF(item);
            }
        }

        function addItemON(item) {
            var url = webUrl + 'api/clients/add';
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                })
                .catch(function (reject) {
                    return $q.reject(reject);
                });
        }

        function addItemOFF(item) {
            ClientsService.clients.push(item);
            setClients();
        }

        function editItem(item) {
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                return editItemON(item);
            } else {
                return editItemOFF(item);
            }
        }

        function editItemON(item) {
            var url = webUrl + 'api/clients/update';
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                })
                .catch(function (reject) {
                    return $q.reject(reject);
                });
        }

        function editItemOFF(item) {
            var clients = ClientsService.clients;
            for (var i = 0; i < clients.length; i++) {
                if (clients[i].id == item.id) {
                    clients.splice(i, 1, item);
                    setClients();
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
            var url = webUrl + 'api/clients/delete';
            var item = {
                "id": id
            };
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                })
                .catch(function (reject) {
                    return $q.reject(reject);
                });
        }

        function deleteItemOFF(id) {
            var clients = ClientsService.clients;
            for (var i = 0; i < clients.length; i++) {
                if (clients[i].id == id) {
                    clients.splice(i, 1);
                    setClients();
                    break;
                }
            }
        }

        function setClients() {
            localStorage.setItem('warehouse_clients', JSON.stringify(ClientsService.clients));
        }

        function uploadClients(clients) {
            localStorage.setItem('warehouse_clients', JSON.stringify(clients));
            ClientsService.clients = undefined;
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
