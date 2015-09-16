(function () {
    'use strict';

    angular
        .module('App')
        .controller('Input', Input);

    Input.$inject = ['$scope', '$rootScope', '$filter', 'InputService', 'InputInvoiceService', 'ClientsService', 'GoodsService', 'inputTransaction'];

    function Input($scope, $rootScope, $filter, InputService, InputInvoiceService, ClientsService, GoodsService, inputTransaction) {
        $scope.$watch('currentPage', currentPage);
        $scope.$watch('numPerPage', currentPage);

        angular.extend($scope, {
            numPerPage: $rootScope.numPerPage,
            init: init,
            _getInputON: getInputON,
            _getInputOnStatic: getInputOnStatic,
            _currentPage: currentPage,
            _clientsFill: clientsFill,
            numPages: numPages,
            updateChange: updateChange,
            inputSort: inputSort,
            inputBack: inputBack,
            inputAdd: inputAdd,
            inputAddSubmit: inputAddSubmit,
            inputEditForm: inputEditForm,
            inputDeleteDialog: inputDeleteDialog,
            inputDelete: inputDelete,
            inputSubmitTotal: inputSubmitTotal,
            inputSubmit: inputSubmit,
            inputEditBack: inputEditBack,

            inputAddInvoice: inputAddInvoice,
            inputAddSubmitInvoice: inputAddSubmitInvoice,
            goodsToStore: goodsToStore,
            inputEditInvoice: inputEditInvoice,
            inputDeleteInvoiceDialog: inputDeleteInvoiceDialog,
            inputDeleteInvoice: inputDeleteInvoice,
            inputEditInvoiceSubmit: inputEditInvoiceSubmit,
            inputEditExitInvoice: inputEditExitInvoice,
            goInputEditForm: goInputEditForm
        });

        function init() {
            $scope.sort = 'number';
            $scope.sortInvoice = 'invoiceID';
            $scope.title = 'Purchase Invoices';
            $scope.currentPage = 1;
            $scope.maxSize = 5;

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                $scope.filteredClients = [];
                $rootScope.myError = false;
                ClientsService.getClients()
                    .then(function (data) {
                        $rootScope.loading = false;
                        $scope.clients = data.data;
                        clientsFill();
                    })
                    .catch(function (data) {
                        $rootScope.loading = false;
                        $rootScope.myError = true;
                        console.log('catch - ' + data.status);
                        console.log(data);
                    });
            } else {
                $scope.clients = ClientsService.getClients();
                clientsFill();
            }

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                $scope.filteredGoods = [];
                $rootScope.myError = false;
                GoodsService.getGoods()
                    .then(function (data) {
                        $rootScope.loading = false;
                        $scope.goods = data.data;
                        $scope.goodsOptions = [].concat($scope.goods);
                        $scope.goodsOptions.unshift({name: 'Select commodities'});
                        $scope.selectedItemInvoice = $scope.goodsOptions[0].name;
                    })
                    .catch(function (data) {
                        $rootScope.loading = false;
                        $rootScope.myError = true;
                        console.log('catch - ' + data.status);
                        console.log(data);
                    });
            } else {
                $scope.goods = GoodsService.getGoods();
                $scope.goodsOptions = [].concat($scope.goods);
                $scope.goodsOptions.unshift({name: 'Select commodities'});
                $scope.selectedItemInvoice = $scope.goodsOptions[0].name;
            }

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                getInputOnStatic();
            } else {
                $scope.input = InputService.getInput();
            }

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                $rootScope.myError = false;
                InputInvoiceService.getInputInvoice()
                    .then(function (data) {
                        $rootScope.loading = false;
                        $scope.inputInvoice = data.data;
                    })
                    .catch(function (data) {
                        $rootScope.loading = false;
                        $rootScope.myError = true;
                        console.log('catch - ' + data.status);
                        console.log(data);
                    });
            } else {
                $scope.inputInvoice = InputInvoiceService.getInputInvoice();
            }

        }

        function getInputON() {
            $scope.filteredInput = [];
            $rootScope.myError = false;
            InputService.getInput()
                .then(function (data) {
                    $rootScope.loading = false;
                    $scope.input = data.data;
                    $rootScope.view = 'input';
                })
                .catch(function (data) {
                    $rootScope.loading = false;
                    $rootScope.myError = true;
                    console.log('catch - ' + data.status);
                    console.log(data);
                    $rootScope.view = 'input';
                });
        }

        function getInputOnStatic() {
            $scope.filteredInput = [];
            $rootScope.myError = false;
            InputService.getInput()
                .then(function (data) {
                    $rootScope.loading = false;
                    $scope.input = data.data;
                    currentPage();
                })
                .catch(function (data) {
                    $rootScope.loading = false;
                    $rootScope.myError = true;
                    console.log('catch - ' + data.status);
                    console.log(data);
                    $rootScope.view = 'input';
                });
        }

        function currentPage() {
            if (Object.prototype.toString.call($scope.input) == '[object Array]') {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage);
                var end = parseInt(begin) + parseInt($scope.numPerPage);
                $scope.filteredInput = $scope.input.slice(begin, end);
                $scope.totalItems = $scope.input.length;
            }
        }

        function clientsFill() {
            $scope.clientsOptions = [].concat($scope.clients);
            $scope.clientsOptions.unshift({name: 'Select customer'});
            $scope.selectedItem = $scope.clientsOptions[0].name;
        }

        function numPages() {
            return Math.ceil($scope.input.length / $scope.numPerPage);
        }

        function updateChange(val, id) {
            switch (id) {
                case 'selectedItem':
                    $scope.error = false;
                    if (val) {
                        $scope.clientID = val.id;
                    } else {
                        $scope.clientID = '0';
                    }
                    $scope.selectedItem = val;
                    break;
                case 'number':
                    $scope.number = val;
                    break;
                case 'date':
                    $scope.date = val;
                    break;
                case 'description':
                    $scope.description = val;
                    break;
                case 'numPerPage':
                    $scope.numPerPage = val;
                    break;

                case 'selectedItemInvoice':
                    $scope.errorInvoice = false;
                    if (val) {
                        $scope.goodsID = val.id;
                        $scope.invoicePrice = parseFloat(val.price).toFixed(2);
                    } else {
                        $scope.invoicePrice = '0.00';
                    }
                    $scope.selectedItemInvoice = val;
                    break;

                case 'invoicePrice':
                    $scope.invoicePrice = val;
                    break;
                case 'invoiceQuantity':
                    $scope.invoiceQuantity = val;
                    break;
                case 'invoiceDescription':
                    $scope.invoiceDescription = val;
                    break;
            }
        }

        function inputSort(val) {
            $scope.sort = val;
            $scope.rev = !$scope.rev;
        }

        function inputBack() {
            $rootScope.id = 0;
            $rootScope.view = 'main';
        }

        function inputAdd() {
            var number = $scope.input.length;
            $scope.number = ++number;
            $scope.description = '';
            $scope.total = 0;
            var now = new Date();
            $scope.date = $filter('date')(now, 'dd/MM/yyyy H:mm:ss ');

            $scope.options = [].concat($scope.clients);
            $scope.options.unshift({name: 'Select customer'});
            $scope.selectedItem = $scope.options[0];

            $rootScope.view = 'inputAdd';
        }

        function inputAddSubmit() {
            if ($scope.selectedItem.name == 'Select customer') {
                $scope.error = true;
                return;
            }

            if (this.form.$invalid) {
                return;
            }

            $scope.filteredInput = [];
            $rootScope.myError = false;
            $rootScope.loading = true;

            var id = (Math.random() * 1000000).toFixed();
            var item = {
                id: id,
                number: $scope.number,
                client: $scope.selectedItem.name,
                clientID: $scope.clientID,
                date: $scope.date,
                total: $scope.total,
                description: $scope.description
            };

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                InputService.addItem(item)
                    .then(function () {
                        $scope.filteredInput = [];
                        $rootScope.myError = false;
                        $rootScope.loading = false;
                        getInputOnStatic();
                        $scope.inputEditForm(item);
                    })
                    .catch(function (data) {
                        $rootScope.loading = false;
                        $rootScope.myError = true;
                        console.log('catch addItem - ' + data.status);
                        $rootScope.view = 'input';
                    });
            } else {
                InputService.addItem(item);
                $scope.inputEditForm(item);
                $rootScope.loading = false;
            }
        }

        function inputEditForm(item) {
            $scope.invoiceFilter = {invoiceID: item.id};
            $scope.id = item.id;
            $scope.number = item.number;
            $scope.client = item.client;
            $scope.clientID = item.clientID;
            $scope.date = item.date;
            $scope.total = item.total;
            $scope.sum = parseFloat(item.total).toFixed(2);
            $scope.description = item.description;

            $rootScope.view = 'inputEdit';
        }

        function inputDeleteDialog() {
            $rootScope.view = 'inputDialog';
        }

        function inputDelete() {
            $scope.filteredInput = [];
            $rootScope.myError = false;
            $rootScope.loading = true;

            var id = $scope.id;

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                InputService.deleteItem(id)
                    .then(function () {
                        getInputON();
                    })
                    .catch(function (data) {
                        $rootScope.loading = false;
                        $rootScope.myError = true;
                        console.log('catch - ' + data.status);
                        $rootScope.view = 'clients';
                    });
            } else {
                InputService.deleteItem(id);

                inputTransaction.setClientSum($scope.clientID, -$scope.total);

                $scope.inputInvoice.forEach(function (el) {
                    if (el.invoiceID == $scope.id) {
                        inputTransaction.setStoreSum(el.goodsID, -el.quantity);
                    }
                });

                InputInvoiceService.deleteItemInvoice($scope.id);
                $rootScope.loading = false;
                $rootScope.view = 'input';
            }
        }

        function inputSubmitTotal() {
            var item = {
                id: $scope.id,
                number: $scope.number,
                client: $scope.client,
                clientID: $scope.clientID,
                date: $scope.date,
                total: $scope.total,
                description: $scope.description
            };

            InputService.editItem(item);
        }

        function inputSubmit() {
            if (this.form.$invalid) {
                return;
            }

            $scope.filteredInput = [];
            $rootScope.myError = false;
            $rootScope.loading = true;

            var item = {
                id: $scope.id,
                number: $scope.number,
                client: $scope.client,
                clientID: $scope.clientID,
                date: $scope.date,
                total: $scope.total,
                description: $scope.description
            };

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                InputService.editItem(item)
                    .then(function () {
                        getInputOnStatic();
                        $rootScope.view = 'inputEditForm';
                    })
                    .catch(function (data) {
                        $rootScope.loading = false;
                        $rootScope.myError = true;
                        console.log('catch - ' + data.status);
                        $rootScope.view = 'input';
                    });
            } else {
                InputService.editItem(item);
                $rootScope.view = 'inputEditForm';
                $rootScope.loading = false;
            }
        }

        function inputEditBack() {
            $rootScope.view = 'input';
        }

        function inputAddInvoice() {
            $scope.invoiceQuantity = '';
            $scope.invoicePrice = '';
            $scope.invoiceDescription = '';

            $scope.errorInvoice = false;
            $scope.goodsOptions = [].concat($scope.goods);
            $scope.goodsOptions.unshift({name: 'Select commodities'});
            $scope.selectedItemInvoice = $scope.goodsOptions[0];

            $rootScope.view = 'inputAddInvoice';
        }

        function inputAddSubmitInvoice() {
            if ($scope.selectedItemInvoice.name == 'Select commodities') {
                $scope.errorInvoice = true;
                return;
            }

            if (this.form.$invalid) {
                return;
            }

            $scope.invoiceID = $scope.id;
            $scope.invoiceTotal = parseFloat($scope.invoiceQuantity) * parseFloat($scope.invoicePrice);
            $scope.total = parseFloat($scope.total) + parseFloat($scope.invoiceTotal);
            $scope.sum = parseFloat($scope.total).toFixed(2);

            var id = (Math.random() * 1000000).toFixed();
            var item = {
                id: id,
                invoiceID: $scope.invoiceID,
                goods: $scope.selectedItemInvoice.name,
                goodsID: $scope.goodsID,
                price: $scope.invoicePrice,
                quantity: $scope.invoiceQuantity,
                total: $scope.invoiceTotal,
                description: $scope.invoiceDescription
            };

            InputInvoiceService.addItem(item);
            $scope.inputSubmitTotal();

            inputTransaction.setClientSum($scope.clientID, $scope.invoiceTotal);
            inputTransaction.setStoreSum($scope.goodsID, $scope.invoiceQuantity);

            $scope.goodsToStore();
            $rootScope.view = 'inputEditForm';
        }

        function goodsToStore() {
            $scope.goods.filter(function (el) {
                if (el.store === true) {
                    $rootScope.store.push(el);
                    return el;
                }
            });
        }

        function inputEditInvoice(item) {
            $scope.invoiceRecordID = item.id;
            $scope.invoiceID = item.invoiceID;
            $scope.goodsID = item.goodsID;
            $scope.invoiceGoods = item.goods;
            $scope.invoiceQuantity = item.quantity;
            $scope.invoicePrice = item.price;
            $scope.invoiceDescription = item.description;
            $scope.invoiceTotal = parseFloat(item.total).toFixed(2);

            $rootScope.view = 'inputEditInvoice';
        }

        function inputDeleteInvoiceDialog() {
            $rootScope.view = 'inputInvoiceDialog';
        }

        function inputDeleteInvoice() {
            var id = $scope.invoiceRecordID;
            InputInvoiceService.deleteItem(id);

            $scope.total = parseFloat($scope.total) - parseFloat($scope.invoiceTotal);
            $scope.inputSubmitTotal();

            inputTransaction.setClientSum($scope.clientID, -$scope.invoiceTotal);
            inputTransaction.setStoreSum($scope.goodsID, -$scope.invoiceQuantity);

            $scope.sum = parseFloat($scope.total).toFixed(2);
            $rootScope.view = 'inputEditForm';
        }

        function inputEditInvoiceSubmit() {
            if (this.form.$invalid) {
                return;
            }
            var item = {
                id: $scope.invoiceRecordID,
                invoiceID: $scope.invoiceID,
                goodsID: $scope.goodsID,
                goods: $scope.invoiceGoods,
                price: $scope.invoicePrice,
                quantity: $scope.invoiceQuantity,
                total: $scope.invoiceTotal,
                description: $scope.invoiceDescription
            };

            InputInvoiceService.editItem(item);
            $rootScope.view = 'inputEditForm';
        }

        function inputEditExitInvoice() {
            $rootScope.view = 'inputEdit';
        }

        function goInputEditForm() {
            $rootScope.view = 'inputEditForm';
        }
    }
})();

















