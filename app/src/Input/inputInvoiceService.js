(function () {
    'use strict';

    angular
        .module('App')
        .factory('InputInvoiceService', InputInvoiceService);

    InputInvoiceService.$inject = ['$rootScope', '$http', '$q'];

    function InputInvoiceService($rootScope, $http, $q) {
        var webUrl = $rootScope.myConfig.webUrl;

        return {
            invoices: [],

            getInputInvoice: getInputInvoice,
            _getInputInvoiceON: getInputInvoiceON,
            _getInputInvoiceOFF: getInputInvoiceOFF,

            addItem: addItem,
            _addItemON: addItemON,
            _addItemOFF: addItemOFF,

            editItem: editItem,
            _editItemON: editItemON,
            _editItemOFF: editItemOFF,

            deleteItem: deleteItem,
            _deleteItemON: deleteItemON,
            _deleteItemOFF: deleteItemOFF,

            deleteItemInvoice: deleteItemInvoice,
            _deleteItemInvoiceReduce: deleteItemInvoiceReduce,
            setInputInvoice: setInputInvoice,

            uploadInputInvoice: uploadInputInvoice
        };

        function getInputInvoice() {
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                return getInputInvoiceON();
            } else {
                return getInputInvoiceOFF();
            }
        }

        function getInputInvoiceON() {
            $rootScope.loading = true;
            var url = webUrl + 'api/invoicein/get';
            return $http.get(url)
                .then(function (result) {
                    result.data.sort();
                    return result;
                })
                .catch(function (reject) {
                    return $q.reject(reject);
                });
        }

        function getInputInvoiceOFF() {
            if (InputInvoiceService.invoices === undefined) {
                var invoices = localStorage.getItem('warehouse_inputs_invoices');
                invoices = JSON.parse(invoices);
                InputInvoiceService.invoices = invoices;
            }

            if (InputInvoiceService.invoices === null) {
                InputInvoiceService.invoices = [];
            }

            return InputInvoiceService.invoices.sort();
        }

        function addItem(item) {
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                return addItemON(item);
            } else {
                return addItemOFF(item);
            }
        }

        function addItemON(item) {
            var url = webUrl + 'api/invoicein/add';
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                })
                .catch(function (reject) {
                    return $q.reject(reject);
                });
        }

        function addItemOFF(item) {
            InputInvoiceService.invoices.push(item);
            setInputInvoice();
        }

        function editItem(item) {
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                return editItemON(item);
            } else {
                return editItemOFF(item);
            }
        }

        function editItemON(item) {
            var url = webUrl + 'api/invoicein/update';
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                })
                .catch(function (reject) {
                    return $q.reject(reject);
                });
        }

        function editItemOFF(item) {
            var invoices = InputInvoiceService.invoices;
            for (var i = 0; i < invoices.length; i++) {
                if (invoices[i].id == item.id) {
                    invoices.splice(i, 1, item);
                    setInputInvoice();
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
            var url = webUrl + 'api/invoicein/delete';
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
            var invoices = InputInvoiceService.invoices;
            for (var i = 0; i < invoices.length; i++) {
                if (invoices[i].id == id) {
                    invoices.splice(i, 1);
                    setInputInvoice();
                    break;
                }
            }
        }

        function deleteItemInvoice(id) {
            InputInvoiceService.invoices = InputInvoiceService.invoices.filter(function (el) {
                return el.invoiceID != id;
            });
            setInputInvoice();
        }

        function deleteItemInvoiceReduce(id) {
            InputInvoiceService.invoices = InputInvoiceService.invoices.reduce(function (invoices, invoice) {
                if (invoice.invoiceID != id) {
                    invoices.push(invoice);
                }
                return invoices;
            }, []);

            setInputInvoice();
        }

        function setInputInvoice() {
            localStorage.setItem('warehouse_inputs_invoices', JSON.stringify(InputInvoiceService.invoices));
        }


        function uploadInputInvoice(invoices) {
            localStorage.setItem('warehouse_inputs_invoices', JSON.stringify(invoices));
            InputInvoiceService.invoices = undefined;
        }

    }

})();
