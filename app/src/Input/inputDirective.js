(function () {
    'use strict';

    angular
        .module('App')
        .directive('dirInput', dirInput);

    function dirInput() {
        return {
            restrict: 'E',
            link: function (scope) {
					scope.$watch('currentPage', currentPage);
					scope.$watch('numPerPage', currentPage);
					
					function currentPage() {
					    if (Object.prototype.toString.call(scope.input) == '[object Array]') {
							var begin = ((scope.currentPage - 1) * scope.numPerPage);
							var end = parseInt(begin) + parseInt(scope.numPerPage);
							scope.filteredInput = scope.input.slice(begin, end);
							scope.totalItems = scope.input.length;
						}
					}
            },
            templateUrl: 'Input/dir-input.html'
        }
    }

    angular
        .module('App')
        .directive('dirInputEdit', dirInputEdit);

    function dirInputEdit() {
        return {
            restrict: 'E',
            templateUrl: 'Input/dir-input-edit.html'
        }
    }

    angular
        .module('App')
        .directive('dirInputAdd', dirInputAdd);

    function dirInputAdd() {
        return {
            restrict: 'E',
            templateUrl: 'Input/dir-input-add.html'
        }
    }

    angular
        .module('App')
        .directive('dirInputAddInvoice', dirInputAddInvoice);

    function dirInputAddInvoice() {
        return {
            restrict: 'E',
            templateUrl: 'Input/dir-input-invoice.html'
        }
    }

    angular
        .module('App')
        .directive('dirInputEditInvoice', dirInputEditInvoice);

    function dirInputEditInvoice() {
        return {
            restrict: 'E',
            templateUrl: 'Input/dir-input-edit-invoice.html'
        }
    }
	
    angular
        .module('App')
        .directive('dirInputEditForm', dirInputEditForm);

    function dirInputEditForm() {
        return {
            restrict: 'E',
            templateUrl: 'Input/dir-input-edit-form.html'
        }
    }

    angular
        .module('App')
        .directive('dirInputDialog', dirInputDialog);

    function dirInputDialog() {
        return {
            restrict: 'E',
            templateUrl: 'Input/dir-input-dialog.html'
        }
    }

    angular
        .module('App')
        .directive('dirInputDialogInvoice', dirInputDialogInvoice);

    function dirInputDialogInvoice() {
        return {
            restrict: 'E',
            templateUrl: 'Input/dir-input-dialog-invoice.html'
        }
    }

})();