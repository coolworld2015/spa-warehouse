describe('clientsData', function () {
    var clientsData, scope, mockClients, unsortedClients, sortedClients,
        mockCounter;

    beforeEach(module('App'));

    beforeEach(inject(function (_clientsData_) {
        clientsData = _clientsData_;

        scope = {};

        mockClients = [{
            id: 1,
            name: 'a'
        }];

        unsortedClients = [{
            name: 'Ed'
        }, {
            name: 'Andrew'
        }];

        sortedClients = [{
            name: 'Andrew'
        }, {
            name: 'Ed'
        }];

        localStorage.setItem('sklad_clients', JSON.stringify(mockClients));

        mockCounter = 777;

        localStorage.setItem('sklad_clients_count', mockCounter);
    }));

    describe('getClients', function () {
        it('should exist method getClients', function () {
            clientsData.getClients.should.be.defined;
            clientsData.getClients.should.be.a('function');
        });

        it('should getClients return array', function () {
            clientsData.getClients().should.deep.equal(mockClients);
        });

        it('should getClients return sorted array', function () {
            localStorage.setItem('sklad_clients', JSON.stringify(unsortedClients));
            clientsData.getClients().should.be.deep.equal(sortedClients);
        });
    });

    describe('getCounter', function () {
        it('should exist method getCounter', function () {
            clientsData.getCounter.should.be.defined;
            clientsData.getCounter.should.be.a('function');
        });

        it('should getCounter return number', function () {
            localStorage.setItem('sklad_clients_count', mockCounter);
            parseInt(clientsData.getCounter()).should.be.deep.equal(mockCounter);
        });
    });

    describe('setClients', function () {
        it('should exist method setClients', function () {
            clientsData.setClients.should.be.defined;
            clientsData.setClients.should.be.a('function');
        });

        it('should setClients set clients in localStorage', function () {
            clientsData.setClients(mockClients);
            JSON.parse(localStorage.getItem('sklad_clients')).should.be.deep.equal(mockClients);
        });
    });

    describe('setCounter', function () {
        it('should exist method setCounter', function () {
            clientsData.setCounter.should.be.defined;
            clientsData.setCounter.should.be.a('function');
        });

        it('should setCounter set clients in localStorage', function () {
            clientsData.setCounter(mockCounter);
            JSON.parse(localStorage.getItem('sklad_clients_count')).should.be.deep.equal(mockCounter);
        });
    });
});
