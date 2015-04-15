'use strict';
var debug=require('debug')('Gibraltar:example:debug'),
	should=require('should');

describe("example", function doExample() {
	it("should example", function doTest(done) {
		debug("example");
		done();
	});
});

//skip these android specific tests
describe.android("example.android", function doLogin() {
	it("should example", function doTest(done) {
		debug("doing something");
		done();
	});
	it("should example 2 fail", function doTest(done) {
		debug("doing something else");
		should.fail();
		done();
	});
});

//skip these ios specific tests
describe.ios("example.ios", function doLogin() {
	it("should example", function doTest(done) {
		debug("doing something");
		done();
	});
	it("should example 2 fail", function doTest(done) {
		debug("doing something else");
		should.fail();
		done();
	});
});


