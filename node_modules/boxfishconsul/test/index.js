var should = require('chai').should();
var assert = require('chai').assert;
var consul = require('../index');
    
describe('BoxfishConsul', function() {

	it('should connect to local consul', function() {
		consul.nodeList(function(nodes) {
			assert(true, 'nodes found');
		});
	});

	it('should get the list of services', function(done) {
		consul.init().api.agent.service.list(function(err, services) {
			if (err) throw err;
			else done();
		});
	});

	it('should get the list of services', function(done) {
		consul.init().api.catalog.service.list(function(err, services) {
			if (err) throw err;
			assert(true, 'found the list of services' + services);

			consul.init().api.catalog.service.nodes('consul', function(err, result) {
				if (err) throw err;
				console.log(result);
				assert(true, 'service found');
				done();
			});
		});
	});

	it('should get the list of services', function(done) {
		consul.findService('consul').then(function(services) {
			console.log(services);
			done();
		}, assert);
	});
	
});