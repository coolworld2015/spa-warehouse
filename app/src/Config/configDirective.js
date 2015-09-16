(function () {
    'use strict';

    angular
        .module('App')
        .directive('dirConfig', dirConfig);

    function dirConfig() {
        return {
            restrict: 'E',
            templateUrl: 'Config/dir-config.html'
        }
    }

})();
