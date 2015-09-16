(function () {
    'use strict';

    angular
        .module('App', ['ui.bootstrap']);

    angular
        .module('App')
        .run(init);

    init.$inject = ['$rootScope'];

    function init($rootScope) {
        angular.extend($rootScope, {
            //view: 'login',
            view: 'main',
            id: 0,
            numPerPage: 10,
            store: [],
            isActive: isActive,
            mainNav: mainNav
        });

		var mode;
		if ($rootScope.mode === undefined) {
			mode = localStorage.getItem('warehouse_mode');
			mode = JSON.parse(mode);
			$rootScope.mode = mode;
		}
		if ($rootScope.mode === null) {
			mode = 'OFF-LINE (LocalStorage)';
			localStorage.setItem('warehouse_mode', JSON.stringify(mode));
			$rootScope.mode = mode;
		}

        $rootScope.myConfig = {
            webUrl: 'http://coolworld.herokuapp.com/'
            //webUrl: 'http://localhost:3000/'
        };

        function mainNav(event) {
            event = event || 'main';
            $rootScope.title = event;
            $rootScope.view = event;
            switch (event) {
                case 'main':
                {
                    $rootScope.id = 0;
                    break
                }
                case 'store':
                {
                    $rootScope.id = 1;
                    angular.element(document.getElementById('Store')).scope().init();
                    break
                }
                case 'goods':
                {
                    $rootScope.id = 2;
                    angular.element(document.getElementById('Goods')).scope().init();
                    break
                }
                case 'clients':
                {
                    $rootScope.id = 3;
                    angular.element(document.getElementById('Clients')).scope().init();
                    break
                }
                case 'input':
                {
                    $rootScope.id = 4;
                    angular.element(document.getElementById('Input')).scope().init();
                    break
                }
                case 'output':
                {
                    $rootScope.id = 5;
                    angular.element(document.getElementById('Output')).scope().init();
                    break
                }
                case 'users':
                {
                    $rootScope.id = 6;
                    angular.element(document.getElementById('Users')).scope().init();
                    break
                }
                case 'config':
                {
                    $rootScope.id = 7;
                    angular.element(document.getElementById('Config')).scope().init();
                    break
                }
            }
        }



        function isActive (param) {
            return (param == $rootScope.id);
        }
    }
})();