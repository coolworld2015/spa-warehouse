(function () {
    'use strict';

    angular
        .module('App')
        .directive('dirStore', dirStore);

    function dirStore() {
        return {
            restrict: 'E',
            link: function (scope) {
					scope.$watch('currentPage', currentPage);
					scope.$watch('numPerPage', currentPage);
					
					function currentPage() {
						var begin = ((scope.currentPage - 1) * scope.numPerPage);
						var end = parseInt(begin) + parseInt(scope.numPerPage);
						scope.filteredStore = scope.store.slice(begin, end);
						scope.totalItems = scope.store.length;
					};
            },
            templateUrl: 'Store/dir-store.html'
        };
    }

    angular
        .module('App')
        .directive('dirStoreEdit', dirStoreEdit);

    function dirStoreEdit() {
        return {
            restrict: 'E',
            templateUrl: 'Store/dir-store-edit.html'
        };
    }

    angular
        .module('App')
        .directive('dirStoreAdd', dirStoreAdd);

    function dirStoreAdd() {
        return {
            restrict: 'E',
            templateUrl: 'Store/dir-store-add.html'
        };
    }
})();
