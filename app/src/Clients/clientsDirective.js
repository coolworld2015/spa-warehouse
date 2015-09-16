(function () {
    'use strict';

    angular
        .module('App')
        .directive('dirClients', dirClients);

    function dirClients() {
        return {
            restrict: 'E',
            link: function (scope) {
                scope.$watch('currentPage', currentPage);
                scope.$watch('numPerPage', currentPage);

                function currentPage() {
                    if (Object.prototype.toString.call(scope.clients) == '[object Array]') {
                        var begin = ((scope.currentPage - 1) * scope.numPerPage);
                        var end = parseInt(begin) + parseInt(scope.numPerPage);
                        scope.filteredClients = scope.clients.slice(begin, end);
                        scope.totalItems = scope.clients.length;
                    }
                }
            },
            templateUrl: 'Clients/dir-clients.html'
        }
    }

    angular
        .module('App')
        .directive('dirClientsEdit', dirClientsEdit);

    function dirClientsEdit() {
        return {
            restrict: 'E',
            templateUrl: 'Clients/dir-clients-edit.html'
        }
    }

    angular
        .module('App')
        .directive('dirClientsAdd', dirClientsAdd);

    function dirClientsAdd() {
        return {
            restrict: 'E',
            templateUrl: 'Clients/dir-clients-add.html'
        }
    }

    angular
        .module('App')
        .directive('dirClientsDialog', dirClientsDialog);

    function dirClientsDialog() {
        return {
            restrict: 'E',
            templateUrl: 'Clients/dir-clients-dialog.html'
        }
    }
})();
