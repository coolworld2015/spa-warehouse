(function () {
    'use strict';

    angular
        .module('App')
        .directive('dirOutput', dirOutput);

    function dirOutput() {
        return {
            restrict: 'E',
            link: function (scope) {
                scope.$watch('currentPage', currentPage);
                scope.$watch('numPerPage', currentPage);

                function currentPage() {
                    if (Object.prototype.toString.call(scope.output) == '[object Array]') {
                        var begin = ((scope.currentPage - 1) * scope.numPerPage);
                        var end = parseInt(begin) + parseInt(scope.numPerPage);
                        scope.filteredOutput = scope.output.slice(begin, end);
                        scope.totalItems = scope.output.length;
                    }
                }
            },
            templateUrl: 'Output/dir-output.html'
        }
    }

    angular
        .module('App')
        .directive('dirOutputEdit', dirOutputEdit);

    function dirOutputEdit() {
        return {
            restrict: 'E',
            templateUrl: 'Output/dir-output-edit.html'
        }
    }

    angular
        .module('App')
        .directive('dirOutputAdd', dirOutputAdd);

    function dirOutputAdd() {
        return {
            restrict: 'E',
            templateUrl: 'Output/dir-output-add.html'
        }
    }

    angular
        .module('App')
        .directive('dirOutputAddInvoice', dirOutputAddInvoice);

    function dirOutputAddInvoice() {
        return {
            restrict: 'E',
            templateUrl: 'Output/dir-output-invoice.html'
        }
    }

    angular
        .module('App')
        .directive('dirOutputEditInvoice', dirOutputEditInvoice);

    function dirOutputEditInvoice() {
        return {
            restrict: 'E',
            templateUrl: 'Output/dir-output-edit-invoice.html'
        }
    }

    angular
        .module('App')
        .directive('dirOutputEditForm', dirOutputEditForm);

    function dirOutputEditForm() {
        return {
            restrict: 'E',
            templateUrl: 'Output/dir-output-edit-form.html'
        }
    }

    angular
        .module('App')
        .directive('dirOutputDialog', dirOutputDialog);

    function dirOutputDialog() {
        return {
            restrict: 'E',
            templateUrl: 'Output/dir-output-dialog.html'
        }
    }

    angular
        .module('App')
        .directive('dirOutputDialogInvoice', dirOutputDialogInvoice);

    function dirOutputDialogInvoice() {
        return {
            restrict: 'E',
            templateUrl: 'Output/dir-output-dialog-invoice.html'
        }
    }

})();