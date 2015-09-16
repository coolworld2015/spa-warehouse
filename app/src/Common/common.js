(function () {
    'use strict';

    angular
        .module('App')
        .directive('digitsOnly', digitsOnly);

    function digitsOnly() {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.on('keydown', onKeyDown);
                scope.onKeyDown = onKeyDown;

                function onKeyDown(event) {
                    var charCode = event.keyCode;
                    if (
                        (charCode > 47 && charCode < 58) || 						// Digits
                        (charCode > 95 && charCode < 105) || 						// Numpad
                        (charCode == 110 || charCode == 190 || charCode == 188) ||  // Dots&Coma
                        (charCode == 8 || charCode == 46) || 						// Backspace&Delete
                        (charCode >= 37 && charCode <= 40) ||  						// Arrows
                        (charCode == 9)  						                    // Tab
                    )
                        return true;
                    else {
                        event.preventDefault();
                    }
                }
            }
        };
    }

    angular
        .module('App')
        .directive('dirMenu', dirMenu);

    function dirMenu() {
        return {
            restrict: 'E',
            templateUrl:'Common/dir-menu.html'
        }
    }

    angular
        .module('App')
        .directive('dirMain', dirMain);

    function dirMain() {
        return {
            restrict: 'E',
            templateUrl:'Common/dir-main.html'
        }
    }
	
    angular
        .module('App')
        .directive('scrollTo', scrollTo);

    scrollTo.$inject = ['$location', '$anchorScroll'];

    function scrollTo($location, $anchorScroll) {
        return function (scope, element, attrs) {
            element.bind('click', function (event) {
                var location = attrs.scrollTo;
                $location.hash(location);
                $anchorScroll();
                document.getElementById(location).focus();
            });
        };
    }

    angular
        .module('App')
        .controller('mainCtrl', mainCtrl);

    mainCtrl.$inject = ['$scope'];

    function mainCtrl($scope) {
        $scope.mainNav1 = function (event) {
            event = event || 'main';
            $scope.title = event;
            $scope.view = event;
        };
    }
})();