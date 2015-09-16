(function () {
    'use strict';

    angular
        .module('App')
        .factory('InputService', InputService);
		
    InputService.$inject = ['$rootScope', '$http', '$q'];    
	
	function InputService($rootScope, $http, $q) {
        var webUrl = $rootScope.myConfig.webUrl;
		
        return {
            inputs: [],

            getInput: getInput,
			_getInputON: getInputON,
			_getInputOFF: getInputOFF,
			
            addItem: addItem,
            _addItemON: addItemON,
            _addItemOFF: addItemOFF,
			
            editItem: editItem,
            _editItemON: editItemON,
            _editItemOFF: editItemOFF,
			
            deleteItem: deleteItem,
            _deleteItemON: deleteItemON,
            _deleteItemOFF: deleteItemOFF,
			
            setInput: setInput,

            uploadInput: uploadInput,
            _sort: sort
        };
		
        function getInput() {
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                return getInputON();
            } else {
                return getInputOFF();
            }
        }

        function getInputON() {
            $rootScope.loading = true;
            var url = webUrl + 'api/inputs/get';
            return $http.get(url)
                .then(function (result) {
                    result.data.sort(sort);
                    return result;
                })
                .catch(function (reject) {
                    return $q.reject(reject);
                });
        }

        function getInputOFF() {
            if (InputService.inputs === undefined) {
                var inputs = localStorage.getItem('warehouse_inputs');
                inputs = JSON.parse(inputs);
                InputService.inputs = inputs;
            }

            if (InputService.inputs === null) {
                InputService.inputs = [];
            }

            return InputService.inputs.sort(sort);
        }
		
        function addItem(item) {
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                return addItemON(item);
            } else {
                return addItemOFF(item);
            }
        }

        function addItemON(item) {
            var url = webUrl + 'api/inputs/add';
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                })
                .catch(function (reject) {
                    return $q.reject(reject);
                });
        }

        function addItemOFF(item) {
            InputService.inputs.push(item);
            setInput();
        }
		
        function editItem(item) {
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                return editItemON(item);
            } else {
                return editItemOFF(item);
            }
        }

        function editItemON(item) {
            var url = webUrl + 'api/inputs/update';
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                })
                .catch(function (reject) {
                    return $q.reject(reject);
                });
        }
	
        function editItemOFF(item) {
            var inputs = InputService.inputs;
            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].id == item.id) {
                    inputs.splice(i, 1, item);
                    setInput();
                    break;
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
            var url = webUrl + 'api/inputs/delete';
            var item = {
                "id": id
            };
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                })
                .catch(function (reject) {
                    return $q.reject(reject);
                });
        }

        function deleteItemOFF(id) {
            var inputs = InputService.inputs;
            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].id == id) {
                    inputs.splice(i, 1);
                    setInput();
                    break;
                }
            }
        }

        function setInput() {
            localStorage.setItem('warehouse_inputs', JSON.stringify(InputService.inputs));
        }

        function uploadInput(inputs) {
            localStorage.setItem('warehouse_inputs', JSON.stringify(inputs));
            InputService.inputs = undefined;
        }

        function sort(a, b) {
            return parseInt(a.number) - parseInt(b.number);
        }
    }
})();
