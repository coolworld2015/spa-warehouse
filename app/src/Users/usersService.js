(function () {
    'use strict';

    angular
        .module('App')
        .factory('UsersService', UsersService);

    UsersService.$inject = ['$rootScope', '$http', '$q'];

    function UsersService($rootScope, $http, $q) {
        var webUrl = $rootScope.myConfig.webUrl;

        return {
            users: [],
            numPerPage: 10,

            getUsers: getUsers,
            _getUsersON: getUsersON,
            _getUsersOFF: getUsersOFF,

            addItem: addItem,
            _addItemON: addItemON,
            _addItemOFF: addItemOFF,

            editItem: editItem,
            _editItemON: editItemON,
            _editItemOFF: editItemOFF,

            deleteItem: deleteItem,
            _deleteItemON: deleteItemON,
            _deleteItemOFF: deleteItemOFF,

            setUsers: setUsers,
            uploadUsers: uploadUsers,
            _sort: sort
        };

        function getUsers() {
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                return getUsersON();
            } else {
                return getUsersOFF();
            }
        }

        function getUsersON() {
            $rootScope.loading = true;
            var url = webUrl + 'api/users/get';
            return $http.get(url)
                .then(function (result) {
                    result.data.sort(sort);
                    return result;
                })
                .catch(function (reject) {
                    return $q.reject(reject);
                });
        }

        function getUsersOFF() {
            if (UsersService.users === undefined) {
                var users = localStorage.getItem('warehouse_users');
                users = JSON.parse(users);
                UsersService.users = users;
            }

            if (UsersService.users === null) {
                UsersService.users = [
                    {id: '1', name: '1', pass: '1', description: 'description'}
                ];
                localStorage.setItem('warehouse_users', JSON.stringify(users));
            }

            return UsersService.users.sort(sort);
        }

        function addItem(item) {
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                return addItemON(item);
            } else {
                return addItemOFF(item);
            }
        }

        function addItemON(item) {
            var url = webUrl + 'api/users/add';
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                })
                .catch(function (reject) {
                    return $q.reject(reject);
                });
        }

        function addItemOFF(item) {
            UsersService.users.push(item);
            setUsers();
        }

        function editItem(item) {
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                return editItemON(item);
            } else {
                return editItemOFF(item);
            }
        }

        function editItemON(item) {
            var url = webUrl + 'api/users/update';
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                })
                .catch(function (reject) {
                    return $q.reject(reject);
                });
        }

        function editItemOFF(item) {
            var users = UsersService.users;
            if (users) {
                for (var i = 0; i < users.length; i++) {
                    if (users[i].id == item.id) {
                        users.splice(i, 1, item);
                        setUsers();
                        break;
                    }
                }
            }
        }

        function deleteItem(id) {
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                return deleteItemON(id);
            } else {
                return deleteItemOFF(id);
            }
        }

        function deleteItemON(id) {
            var url = webUrl + 'api/users/delete';
            var user = {
                "id": id
            };
            return $http.post(url, user)
                .then(function (result) {
                    return result;
                })
                .catch(function (reject) {
                    return $q.reject(reject);
                });
        }

        function deleteItemOFF(id) {
            var users = UsersService.users;
            for (var i = 0; i < users.length; i++) {
                if (users[i].id == id) {
                    users.splice(i, 1);
                    setUsers();
                    break;
                }
            }
        }

        function setUsers() {
            localStorage.setItem('warehouse_users', JSON.stringify(UsersService.users));
        }

        function uploadUsers(users) {
            localStorage.setItem('warehouse_users', JSON.stringify(users));
            UsersService.users = undefined;
        }

        function sort(a, b) {
            var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
            if (nameA < nameB) {
                return -1
            }
            if (nameA > nameB) {
                return 1
            }
            return 0;
        }
    }
})();