(function () {
    'use strict';

    angular
        .module('App')
        .factory('OutputInvoiceService', OutputInvoiceService);

    function OutputInvoiceService() {
        return {
            invoices: [],

            getOutputInvoice: getOutputInvoice,
            addItem: addItem,
            editItem: editItem,
            deleteItem: deleteItem,
            deleteItemInvoice: deleteItemInvoice,
            _deleteItemInvoiceReduce: deleteItemInvoiceReduce,
            setOutputInvoice: setOutputInvoice,

            uploadOutputInvoice: uploadOutputInvoice
        };

        function getOutputInvoice() {
            if (OutputInvoiceService.invoices === undefined) {
                var invoices = localStorage.getItem('warehouse_outputs_invoices');
                invoices = JSON.parse(invoices);
                OutputInvoiceService.invoices = invoices;
            }

            if (OutputInvoiceService.invoices === null) {
                OutputInvoiceService.invoices = [];
            }

            return OutputInvoiceService.invoices.sort();
        }

        function addItem(item) {
            OutputInvoiceService.invoices.push(item);
            setOutputInvoice();
        }

        function editItem(item) {
            var invoices = OutputInvoiceService.invoices;
            for (var i = 0; i < invoices.length; i++) {
                if (invoices[i].id == item.id) {
                    invoices.splice(i, 1, item);
                    setOutputInvoice();
                    break;
                }
            }
        }

        function deleteItem(id) {
            var invoices = OutputInvoiceService.invoices;
            for (var i = 0; i < invoices.length; i++) {
                if (invoices[i].id == id) {
                    invoices.splice(i, 1);
                    setOutputInvoice();
                    break;
                }
            }
        }

        function deleteItemInvoice(id) {
            OutputInvoiceService.invoices = OutputInvoiceService.invoices.filter(function (el) {
                return el.invoiceID != id;
            });
            setOutputInvoice();
        }

        function deleteItemInvoiceReduce(id) {
            OutputInvoiceService.invoices = OutputInvoiceService.invoices.reduce(function (invoices, invoice) {
                if (invoice.invoiceID != id) {
                    invoices.push(invoice);
                }
                return invoices;
            }, []);

            setOutputInvoice();
        }

        function setOutputInvoice() {
            localStorage.setItem('warehouse_outputs_invoices', JSON.stringify(OutputInvoiceService.invoices));
        }


        function uploadOutputInvoice(invoices) {
            localStorage.setItem('warehouse_outputs_invoices', JSON.stringify(invoices));
            OutputInvoiceService.invoices = undefined;
        }

    }

})();
