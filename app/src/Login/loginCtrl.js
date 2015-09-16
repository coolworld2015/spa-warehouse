(function () {
    'use strict';

    angular
        .module('App')
        .directive('dirLogin', dirLogin);

    function dirLogin() {
        return {
            restrict: 'E',
            controller: dirLoginCtrl,
            templateUrl: 'Login/dir-login.html'
        }
    }

    angular
        .module('App')
        .controller('dirLoginCtrl', dirLoginCtrl);

    dirLoginCtrl.$inject = ['$scope', '$rootScope', 'UsersService'];

    function dirLoginCtrl($scope, $rootScope, UsersService) {
        angular.extend($scope, {
            checkUser: checkUser,
            updateChange: updateChange,
            toLogin: toLogin,
			_check: check,
            toMain: toMain
        });

        function checkUser(name, pass) {
            var users = UsersService.getUsers();

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                $rootScope.myError = false;
                $rootScope.loading = true;

                UsersService.getUsers()
                    .then(function (data) {
                        $rootScope.loading = false;
                        users = data.data;
						check(users, name, pass);
                    })
                    .catch(function (data) {
                        $rootScope.loading = false;
                        $rootScope.myError = true;
                        console.log('catch - ' + data.status);
                        console.log(data);
                    });
            } else {
				check(users, name, pass);
			}
        }

        function updateChange(val, id) {
            $scope.error = false;
            switch (id) {
                case 'name':
                    $scope.name = val;
                    break;
                case 'pass':
                    $scope.pass = val;
                    break;
            }
        }

        function toLogin() {
            if (this.form.$invalid) {
                return;
            }
            checkUser($scope.name, $scope.pass);
        }
		
		function check(users, name, pass) {
			if (users) {
				for (var i = 0; i < users.length; i++) {
					if (users[i].name == name && users[i].pass == pass) {
						$rootScope.view = 'main';
					}
				}
			$scope.name = '';
			$scope.pass = '';
			$scope.error = true;
			}	
		}
		
        function toMain() {
            $rootScope.view = 'main';
        }
    }
})();