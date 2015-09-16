(function () {
    'use strict';

    angular
        .module('App')
        .factory('OutputService', OutputService);
		
    OutputService.$inject = ['$rootScope', '$http', '$q'];    
	
    function OutputService($rootScope, $http, $q) {
        var webUrl = $rootScope.myConfig.webUrl;
		
        return {
            outputs: [],

            getOutput: getOutput,
			_getOutputON: getOutputON,
			_getOutputOFF: getOutputOFF,
			
            addItem: addItem,
            _addItemON: addItemON,
            _addItemOFF: addItemOFF,
			
            editItem: editItem,
            _editItemON: editItemON,
            _editItemOFF: editItemOFF,
			
            deleteItem: deleteItem,
            _deleteItemON: deleteItemON,
            _deleteItemOFF: deleteItemOFF,
			
            setOutput: setOutput,

            uploadOutput: uploadOutput,
            _sort: sort
        };
		
        function getOutput() {
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                return getOutputON();
            } else {
                return getOutputOFF();
            }
        }

        function getOutputON() {
            $rootScope.loading = true;
            var url = webUrl + 'api/outputs/get';
            return $http.get(url)
                .then(function (result) {
                    result.data.sort(sort);
                    return result;
                })
                .catch(function (reject) {
                    return $q.reject(reject);
                });
        }

        function getOutputOFF() {
            if (OutputService.outputs === undefined) {
                var outputs = localStorage.getItem('warehouse_outputs');
                outputs = JSON.parse(outputs);
                OutputService.outputs = outputs;
            }

            if (OutputService.outputs === null) {
                OutputService.outputs = [];
            }

            return OutputService.outputs.sort(sort);
        }
		
        function addItem(item) {
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                return addItemON(item);
            } else {
                return addItemOFF(item);
            }
        }

        function addItemON(item) {
            var url = webUrl + 'api/outputs/add';
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                })
                .catch(function (reject) {
                    return $q.reject(reject);
                });
        }
	
        function addItemOFF(item) {
            OutputService.outputs.push(item);
            setOutput();
        }
		
        function editItem(item) {
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                return editItemON(item);
            } else {
                return editItemOFF(item);
            }
        }

        function editItemON(item) {
            var url = webUrl + 'api/outputs/update';
            return $http.post(url, item)
                .then(function (result) {
                    return result;
                })
                .catch(function (reject) {
                    return $q.reject(reject);
                });
        }
		
        function editItemOFF(item) {
            var outputs = OutputService.outputs;
            for (var i = 0; i < outputs.length; i++) {
                if (outputs[i].id == item.id) {
                    outputs.splice(i, 1, item);
                    setOutput();
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
            var url = webUrl + 'api/outputs/delete';
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
            var outputs = OutputService.outputs;
            for (var i = 0; i < outputs.length; i++) {
                if (outputs[i].id == id) {
                    outputs.splice(i, 1);
                    setOutput();
                    break;
                }
            }
        }

        function setOutput() {
            localStorage.setItem('warehouse_outputs', JSON.stringify(OutputService.outputs));
        }

        function uploadOutput(outputs) {
            localStorage.setItem('warehouse_outputs', JSON.stringify(outputs));
            OutputService.outputs = undefined;
        }

        function sort(a, b) {
            return parseInt(a.number) - parseInt(b.number);
        }
    }
})();
