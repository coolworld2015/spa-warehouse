(function () {
    'use strict';

    angular
        .module('App')
        .directive('dirUsers', dirUsers);

    function dirUsers() {
        return {
            restrict: 'E',
			link: function (scope) {
				scope.$watch('currentPage', currentPage);
				scope.$watch('numPerPage', currentPage);
		
				function currentPage() {
					if (Object.prototype.toString.call(scope.users) == '[object Array]') {
						var begin = ((scope.currentPage - 1) * scope.numPerPage);
						var end = parseInt(begin) + parseInt(scope.numPerPage);
						scope.filteredUsers = scope.users.slice(begin, end);
						scope.totalItems = scope.users.length;
					}
				}
            },            
			templateUrl: 'Users/dir-users.html'
        }
    }

    angular
        .module('App')
        .directive('dirUsersEdit', dirUsersEdit);

    function dirUsersEdit() {
        return {
            restrict: 'E',
            templateUrl: 'Users/dir-users-edit.html'
        }
    }

    angular
        .module('App')
        .directive('dirUsersAdd', dirUsersAdd);

    function dirUsersAdd() {
        return {
            restrict: 'E',
            templateUrl: 'Users/dir-users-add.html'
        }
    }

    angular
        .module('App')
        .directive('dirUsersDialog', dirUsersDialog);

    function dirUsersDialog() {
        return {
            restrict: 'E',
            templateUrl: 'Users/dir-users-dialog.html'
        }
    }
})();
