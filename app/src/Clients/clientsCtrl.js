(function () {
    'use strict';

    angular
        .module('App')
        .controller('Clients', Clients);

    Clients.$inject = ['$rootScope', '$scope', '$filter', 'ClientsService'];

    function Clients($rootScope, $scope, $filter, ClientsService) {
        $scope.$watch('currentPage', currentPage);
        $scope.$watch('numPerPage', currentPage);

        angular.extend($scope, {
            numPerPage: $rootScope.numPerPage,
            init: init,
            _getClientsON: getClientsON,
            _getClientsOnStatic: getClientsOnStatic,
            _currentPage: currentPage,
            numPages: numPages,
            updateChange: updateChange,
            clientsBack: clientsBack,
            clientsEditBack: clientsEditBack,
            clientsSubmit: clientsSubmit,
            clientsDeleteDialog: clientsDeleteDialog,
            clientsDelete: clientsDelete,
            clientsSort: clientsSort,
            clientsEditForm: clientsEditForm,
            clientsAdd: clientsAdd,
            clientsAddSubmit: clientsAddSubmit
        });

        function init() {
            $scope.sort = 'name';
            $scope.title = $filter('lowercase')('Customers');
            $scope.title = $filter('uppercase')('Customers');
            $scope.title = 'Customers';
            $scope.currentPage = 1;
            $scope.maxSize = 5;

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                getClientsOnStatic();
            } else {
                $scope.clients = ClientsService.getClients();
            }
        }

        function getClientsON() {
            $scope.filteredClients = [];
            $rootScope.myError = false;
            ClientsService.getClients()
                .then(function (data) {
                    $rootScope.loading = false;
                    $scope.clients = data.data;
                    $rootScope.view = 'clients';
                })
                .catch(function (data) {
                    $rootScope.loading = false;
                    $rootScope.myError = true;
                    console.log('catch getClientsON - ' + data.status);
                    $rootScope.view = 'clients';
                });
        }

        function getClientsOnStatic() {
            $scope.filteredClients = [];
            $rootScope.myError = false;
            ClientsService.getClients()
                .then(function (data) {
                    $rootScope.loading = false;
                    $scope.clients = data.data;
                    currentPage();
                })
                .catch(function (data) {
                    $rootScope.loading = false;
                    $rootScope.myError = true;
                    console.log('catch getClientsON - ' + data.status);
                    $rootScope.view = 'clients';
                });
        }

        function currentPage() {
            if (Object.prototype.toString.call($scope.clients) == '[object Array]') {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage);
                var end = parseInt(begin) + parseInt($scope.numPerPage);
                $scope.filteredClients = $scope.clients.slice(begin, end);
                $scope.totalItems = $scope.clients.length;
            }
        }

        function numPages() {
            return Math.ceil($scope.clients.length / $scope.numPerPage);
        }

        function updateChange(val, id) {
            switch (id) {
                case 'name':
                    $scope.name = val;
                    break;
                case 'address':
                    $scope.address = val;
                    break;
                case 'phone':
                    $scope.phone = val;
                    break;
                case 'sum':
                    $scope.sum = val;
                    break;
                case 'description':
                    $scope.description = val;
                    break;
                case 'numPerPage':
                    $scope.numPerPage = val;
                    break;
            }
        }

        function clientsBack() {
            $rootScope.id = 0;
            $rootScope.view = 'main';
        }

        function clientsEditBack() {
            $rootScope.view = 'clients';
        }

        function clientsSubmit() {
            if (this.form.$invalid) {
                return;
            }

            $scope.filteredClients = [];
            $rootScope.myError = false;
            $rootScope.loading = true;

            var client = {
                id: $scope.id,
                name: $scope.name,
                address: $scope.address,
                phone: $scope.phone,
                sum: $scope.sum,
                description: $scope.description
            };

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                ClientsService.editItem(client)
                    .then(function () {
                        getClientsON();
                    })
                    .catch(function (data) {
                        $rootScope.loading = false;
                        $rootScope.myError = true;
                        console.log('catch - ' + data.status);
                        $rootScope.view = 'clients';
                    });
            } else {
                ClientsService.editItem(client);
                $rootScope.view = 'clients';
                $rootScope.loading = false;
            }
        }

        function clientsDeleteDialog() {
            $rootScope.view = 'clientsDialog';
        }

        function clientsDelete() {
            $scope.filteredClients = [];
            $rootScope.myError = false;
            $rootScope.loading = true;

            var id = $scope.id;

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                ClientsService.deleteItem(id)
                    .then(function () {
                        getClientsON();
                    })
                    .catch(function (data) {
                        $rootScope.loading = false;
                        $rootScope.myError = true;
                        console.log('catch - ' + data.status);
                        $rootScope.view = 'clients';
                    });
            } else {
                ClientsService.deleteItem(id);
                $rootScope.view = 'clients';
                $rootScope.loading = false;
            }
        }

        function clientsSort(val) {
            $scope.sort = val;
            $scope.rev = !$scope.rev;
        }

        function clientsEditForm(item) {
            $scope.id = item.id;
            $scope.name = item.name;
            $scope.address = item.address;
            $scope.phone = item.phone;
            $scope.sum = item.sum;
            $scope.total = Number(item.sum).toFixed(2);
            $scope.description = item.description;

            $rootScope.view = 'clientsEdit';
        }

        function clientsAdd() {
            $scope.name = '';
            $scope.address = '';
            $scope.phone = '';
            $scope.description = '';

            $rootScope.view = 'clientsAdd';
        }

        function clientsAddSubmit() {
            if (this.form.$invalid) {
                return;
            }

            $scope.filteredUsers = [];
            $rootScope.myError = false;
            $rootScope.loading = true;

            var id = (Math.random() * 1000000).toFixed();
            var client = {
                id: id,
                name: $scope.name,
                address: $scope.address,
                phone: $scope.phone,
                description: $scope.description,
                sum: 0
            };

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                ClientsService.addItem(client)
                    .then(function () {
                        $scope.filteredClients = [];
                        $rootScope.myError = false;
                        getClientsON();
                    })
                    .catch(function (data) {
                        $rootScope.loading = false;
                        $rootScope.myError = true;
                        console.log('catch addItem - ' + data.status);
                        $rootScope.view = 'clients';
                    });
            } else {
                ClientsService.addItem(client);
                init();
                $rootScope.view = 'clients';
                $rootScope.loading = false;
            }
        }
    }
})();

















