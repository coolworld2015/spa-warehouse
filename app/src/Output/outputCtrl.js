(function () {
    'use strict';

    angular
        .module('App')
        .controller('Output', Output);

    Output.$inject = ['$scope', '$rootScope', '$filter', 'OutputService', 'OutputInvoiceService', 'ClientsService', 'GoodsService', 'outputTransaction'];

    function Output($scope, $rootScope, $filter, OutputService, OutputInvoiceService, ClientsService, GoodsService, outputTransaction) {
        $scope.$watch('currentPage', currentPage);
        $scope.$watch('numPerPage', currentPage);
		
		angular.extend($scope, {
            numPerPage: $rootScope.numPerPage,
            init: init,
			_getOutputON: getOutputON,
            _getOutputOnStatic: getOutputOnStatic,
			_currentPage: currentPage,
			_clientsFill: clientsFill,
            numPages: numPages,
            updateChange: updateChange,
            outputSort: outputSort,
            outputBack: outputBack,
            outputAdd: outputAdd,
            outputAddSubmit: outputAddSubmit,
            outputEditForm: outputEditForm,
            outputDeleteDialog: outputDeleteDialog,
            outputDelete: outputDelete,
            outputSubmitTotal: outputSubmitTotal,
            outputSubmit: outputSubmit,
            outputEditBack: outputEditBack,
			
            outputAddInvoice: outputAddInvoice,
            outputAddSubmitInvoice: outputAddSubmitInvoice,
            goodsToStore: goodsToStore,
            outputEditInvoice: outputEditInvoice,
            outputDeleteInvoiceDialog: outputDeleteInvoiceDialog,
            outputDeleteInvoice: outputDeleteInvoice,
            outputEditInvoiceSubmit: outputEditInvoiceSubmit,
            outputEditExitInvoice: outputEditExitInvoice,
            goOutputEditForm: goOutputEditForm
        });

        function init() {
            $scope.sort = 'number';
            $scope.sortInvoice = 'id';
            $scope.title = 'Sales Invoices';
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
                getOutputOnStatic();
            } else {
				$scope.output = OutputService.getOutput();
			}
			
            $scope.outputInvoice = OutputInvoiceService.getOutputInvoice();
        }

        function getOutputON() {
			$scope.filteredOutput = [];
			$rootScope.myError = false;
			OutputService.getOutput()
				.then(function (data) {
					$rootScope.loading = false;
					$scope.output = data.data;
					$rootScope.view = 'output';
				})
				.catch(function (data) {
					$rootScope.loading = false;
					$rootScope.myError = true;
					console.log('catch - ' + data.status);
					console.log(data);
					$rootScope.view = 'output';
				});
		}

        function getOutputOnStatic() {
            $scope.filteredOutput = [];
            $rootScope.myError = false;
            OutputService.getOutput()
                .then(function (data) {
                    $rootScope.loading = false;
                    $scope.output = data.data;
                    currentPage();
                })
                .catch(function (data) {
                    $rootScope.loading = false;
                    $rootScope.myError = true;
                    console.log('catch - ' + data.status);
                    console.log(data);
                    $rootScope.view = 'output';
                });
        }

        function currentPage() {
            if (Object.prototype.toString.call($scope.output) == '[object Array]') {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage);
                var end = parseInt(begin) + parseInt($scope.numPerPage);
                $scope.filteredOutput = $scope.output.slice(begin, end);
                $scope.totalItems = $scope.output.length;
            }
        }

		function clientsFill() {
			$scope.clientsOptions = [].concat($scope.clients);
			$scope.clientsOptions.unshift({name: 'Select customer'});
			$scope.selectedItem = $scope.clientsOptions[0].name;	
		}
		
        function numPages() {
            return Math.ceil($scope.output.length / $scope.numPerPage);
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

        function outputSort(val) {
            $scope.sort = val;
            $scope.rev = !$scope.rev;
        }

        function outputBack() {
            $rootScope.id = 0;
            $rootScope.view = 'main';
        }

        function outputAdd() {
            var number = $scope.output.length;
            $scope.number = ++number;
            $scope.description = '';
            $scope.total = 0;
            var now = new Date();
            $scope.date = $filter('date')(now, 'dd/MM/yyyy H:mm:ss ');

            $scope.options = [].concat($scope.clients);
            $scope.options.unshift({name: 'Select customer'});
            $scope.selectedItem = $scope.options[0];

            $rootScope.view = 'outputAdd';
        }

        function outputAddSubmit() {
            if ($scope.selectedItem.name == 'Select customer') {
                $scope.error = true;
                return;
            }

            if (this.form.$invalid) {
                return;
            }

            $scope.filteredOutput = [];
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
                OutputService.addItem(item)
                    .then(function () {
                        $scope.filteredOutput = [];
                        $rootScope.myError = false;
                        getOutputON();
                    })
                    .catch(function (data) {
                        $rootScope.loading = false;
                        $rootScope.myError = true;
                        console.log('catch addItem - ' + data.status);
                        $rootScope.view = 'output';
                    });
            } else {
                OutputService.addItem(item);
                $scope.outputEditForm(item);
                $rootScope.loading = false;
            }
        }

        function outputEditForm(item) {
            $scope.invoiceFilter = {invoiceID: item.id};
            $scope.id = item.id;
            $scope.number = item.number;
            $scope.client = item.client;
            $scope.clientID = item.clientID;
            $scope.date = item.date;
            $scope.total = item.total;
            $scope.sum = parseFloat(item.total).toFixed(2);
            $scope.description = item.description;

            $rootScope.view = 'outputEdit';
        }

        function outputDeleteDialog() {
            $rootScope.view = 'outputDialog';
        }

        function outputDelete() {
            $scope.filteredInput = [];
            $rootScope.myError = false;
            $rootScope.loading = true;
			
			var id = $scope.id;
			
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                OutputService.deleteItem(id)
                    .then(function () {
                        getOutputON();
                    })
                    .catch(function (data) {
                        $rootScope.loading = false;
                        $rootScope.myError = true;
                        console.log('catch - ' + data.status);
                        $rootScope.view = 'clients';
                    });
            } else {
				OutputService.deleteItem(id);
				$rootScope.view = 'output';
                $rootScope.loading = false;
            }
			
            outputTransaction.setClientSum($scope.clientID, -$scope.total);

            $scope.outputInvoice.forEach(function (el) {
                if (el.invoiceID == $scope.id) {
                    outputTransaction.setStoreSum(el.goodsID, -el.quantity);
                }
            });

            OutputInvoiceService.deleteItemInvoice($scope.id);
        }

        function outputSubmitTotal() {
            var item = {
                id: $scope.id,
                number: $scope.number,
                client: $scope.client,
                clientID: $scope.clientID,
                date: $scope.date,
                total: $scope.total,
                description: $scope.description
            };

            OutputService.editItem(item);
        }

        function outputSubmit() {
            if (this.form.$invalid) {
                return;
            }

            $scope.filteredOutput = [];
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
                OutputService.editItem(item)
                    .then(function () {
                        getOutputON();
                    })
                    .catch(function (data) {
                        $rootScope.loading = false;
                        $rootScope.myError = true;
                        console.log('catch - ' + data.status);
                        $rootScope.view = 'output';
                    });
            } else {
                OutputService.editItem(item);
                $rootScope.view = 'outputEditForm';
                $rootScope.loading = false;
            }
        }

        function outputEditBack() {
            $rootScope.view = 'output';
        }

        function outputAddInvoice() {
            $scope.goods = GoodsService.getGoods();
            $scope.invoiceQuantity = '';
            $scope.invoicePrice = '';
            $scope.invoiceDescription = '';

            $scope.errorInvoice = false;
            $scope.goodsOptions = [].concat($scope.goods);
            $scope.goodsOptions.unshift({name: 'Select commodities'});
            $scope.selectedItemInvoice = $scope.goodsOptions[0];

            $rootScope.view = 'outputAddInvoice';
        }

        function outputAddSubmitInvoice() {
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

            OutputInvoiceService.addItem(item);
            $scope.outputSubmitTotal();

            outputTransaction.setClientSum($scope.clientID, $scope.invoiceTotal);
            outputTransaction.setStoreSum($scope.goodsID, $scope.invoiceQuantity);

            $scope.goodsToStore();
            $rootScope.view = 'outputEditForm';
        }

        function goodsToStore() {
            $scope.goods.filter(function (el) {
                if (el.store === true) {
                    $rootScope.store.push(el);
                    return el;
                }
            });
        }

        function outputEditInvoice(item) {
            $scope.invoiceRecordID = item.id;
            $scope.invoiceID = item.invoiceID;
            $scope.goodsID = item.goodsID;
            $scope.invoiceGoods = item.goods;
            $scope.invoiceQuantity = item.quantity;
            $scope.invoicePrice = item.price;
            $scope.invoiceDescription = item.description;
            $scope.invoiceTotal = parseFloat(item.total).toFixed(2);

            $rootScope.view = 'outputEditInvoice';
        }
		
        function outputDeleteInvoiceDialog() {
            $rootScope.view = 'outputInvoiceDialog';
        }
		
        function outputDeleteInvoice() {
            var id = $scope.invoiceRecordID;
            OutputInvoiceService.deleteItem(id);

            $scope.total = parseFloat($scope.total) - parseFloat($scope.invoiceTotal);
            $scope.outputSubmitTotal();

            outputTransaction.setClientSum($scope.clientID, -$scope.invoiceTotal);
            outputTransaction.setStoreSum($scope.goodsID, -$scope.invoiceQuantity);

            $scope.sum = parseFloat($scope.total).toFixed(2);
            $rootScope.view = 'outputEditForm';
        }

        function outputEditInvoiceSubmit() {
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

            OutputInvoiceService.editItem(item);
            $rootScope.view = 'outputEditForm';
        }

        function outputEditExitInvoice() {
            $rootScope.view = 'outputEdit';
        }

        function goOutputEditForm() {
            $rootScope.view = 'outputEditForm';
        }
    }
})();

















