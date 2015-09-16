(function () {
    'use strict';

    angular
        .module('App')
        .controller('Users', Users);

    Users.$inject = ['$rootScope', '$scope', 'UsersService'];

    function Users($rootScope, $scope, UsersService) {
        $scope.$watch('currentPage', currentPage);
        $scope.$watch('numPerPage', currentPage);

        angular.extend($scope, {
            numPerPage: $rootScope.numPerPage,
            init: init,
            _getUsersON: getUsersON,
            _getUsersOnStatic: getUsersOnStatic,
            _currentPage: currentPage,
            numPages: numPages,
            updateChange: updateChange,
            usersBack: usersBack,
            usersEditBack: usersEditBack,
            usersSubmit: usersSubmit,
            usersDeleteDialog: usersDeleteDialog,
            usersDelete: usersDelete,
            usersSort: usersSort,
            usersEditForm: usersEditForm,
            usersAdd: usersAdd,
            usersAddSubmit: usersAddSubmit
        });

        function init() {
            $scope.sort = 'name';
            $scope.title = 'Users';
            $scope.currentPage = 1;
            $scope.maxSize = 5;

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                getUsersOnStatic();
            } else {
				$scope.users = UsersService.getUsers();
			}
        }

        function getUsersON() {
            $scope.filteredUsers = [];
            $rootScope.myError = false;
            UsersService.getUsers()
                .then(function (data) {
                    $rootScope.loading = false;
                    $scope.users = data.data;
                    $rootScope.view = 'users';
                })
                .catch(function (data) {
                    $rootScope.loading = false;
                    $rootScope.myError = true;
                    console.log('catch getUsersON - ' + data.status);
                    $rootScope.view = 'users';
                });
        }

        function getUsersOnStatic() {
            $scope.filteredUsers = [];
            $rootScope.myError = false;
            UsersService.getUsers()
                .then(function (data) {
                    $rootScope.loading = false;
                    $scope.users = data.data;
                    currentPage();
                })
                .catch(function (data) {
                    $rootScope.loading = false;
                    $rootScope.myError = true;
                    console.log('catch getUsersON - ' + data.status);
                    $rootScope.view = 'users';
                });
        }

        function currentPage() {
            if (Object.prototype.toString.call($scope.users) == '[object Array]') {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage);
                var end = parseInt(begin) + parseInt($scope.numPerPage);
                $scope.filteredUsers = $scope.users.slice(begin, end);
                $scope.totalItems = $scope.users.length;
            }
        }

        function numPages() {
            return Math.ceil($scope.users.length / $scope.numPerPage);
        }

        function updateChange(val, id) {
            switch (id) {
                case 'name':
                    $scope.name = val;
                    break;
                case 'pass':
                    $scope.pass = val;
                    break;
                case 'description':
                    $scope.description = val;
                    break;
                case 'numPerPage':
                    $scope.numPerPage = val;
                    break;
            }
        }

        function usersBack() {
            $rootScope.id = 0;
            $rootScope.view = 'main';
        }

        function usersEditBack() {
            $rootScope.view = 'users';
        }

        function usersSubmit() {
            if (this.form.$invalid) {
                return;
            }

            $scope.filteredUsers = [];
            $rootScope.myError = false;
            $rootScope.loading = true;

            var user = {
                id: $scope.id,
                name: $scope.name,
                pass: $scope.pass,
                description: $scope.description
            };

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                UsersService.editItem(user)
                    .then(function () {
                        getUsersON();
                    })
                    .catch(function (data) {
                        $rootScope.loading = false;
                        $rootScope.myError = true;
                        console.log('catch - ' + data.status);
                        $rootScope.view = 'users';
                    });
            } else {
                UsersService.editItem(user);
                $rootScope.view = 'users';
                $rootScope.loading = false;
            }
        }

        function usersDeleteDialog() {
            $rootScope.view = 'usersDialog';
        }

        function usersDelete() {
            $scope.filteredUsers = [];
            $rootScope.myError = false;
            $rootScope.loading = true;

            var id = $scope.id;
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                UsersService.deleteItem(id)
                    .then(function () {
                        getUsersON();
                    })
                    .catch(function (data) {
                        $rootScope.loading = false;
                        $rootScope.myError = true;
                        console.log('catch - ' + data.status);
                        $rootScope.view = 'users';
                    });
            } else {
                UsersService.deleteItem(id);
                $rootScope.view = 'users';
                $rootScope.loading = false;
            }
        }

        function usersSort(val) {
            $scope.sort = val;
            $scope.rev = !$scope.rev;
        }

        function usersEditForm(item) {
            $rootScope.view = 'usersEdit';

            $scope.id = item.id;
            $scope.name = item.name;
            $scope.pass = item.pass;
            $scope.description = item.description;
        }

        function usersAdd() {
            $scope.name = '';
            $scope.pass = '';
            $scope.description = '';

            $rootScope.view = 'usersAdd';
        }

        function usersAddSubmit() {
            if (this.form.$invalid) {
                return;
            }

            $scope.filteredUsers = [];
            $rootScope.myError = false;
            $rootScope.loading = true;

            var id = (Math.random() * 1000000).toFixed();
            var user = {
                id: id,
                name: $scope.name,
                pass: $scope.pass,
                description: $scope.description
            };

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                UsersService.addItem(user)
                    .then(function () {
                        $scope.filteredUsers = [];
                        $rootScope.myError = false;
                        getUsersON();
                    })
                    .catch(function (data) {
                        $rootScope.loading = false;
                        $rootScope.myError = true;
                        console.log('catch addItem - ' + data.status);
                        $rootScope.view = 'users';
                    });
            } else {
                UsersService.addItem(user);
                init();
                $rootScope.view = 'users';
                $rootScope.loading = false;
            }
        }
    }
})();















