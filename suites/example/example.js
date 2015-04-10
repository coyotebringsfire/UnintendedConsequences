'use strict';
var debug=require('debug')('RoambiTest:example:debug');

describe("example", function doExample() {
	it("should example", function doTest(done) {
		debug("example");
		done();
	});
});

//skip these android specific tests
describe.android.skip("example.android", function doLogin() {
	it("should example", function doTest(done) {
		debug("doing something");
		done();
	});
	it("should example 2", function doTest(done) {
		debug("doing something else");
		done();
	});
});

//skip these ios specific tests
describe.ios.skip("example.ios", function doLogin() {
	it("should example", function doTest(done) {
		debug("doing something");
		done();
	});
	it("should example 2", function doTest(done) {
		debug("doing something else");
		done();
	});
});

//skip these web specific tests
describe.web.skip("example.web", function doLogin() {
	it("should example", function doTest(done) {
		debug("doing something");
		done();
	});
	it("should example 2", function doTest(done) {
		debug("doing something else");
		done();
	});
});

//skip these win specific tests
describe.win.skip("example.win", function doLogin() {
	it("should example", function doTest(done) {
		debug("doing something");
		done();
	});
	it("should example 2", function doTest(done) {
		debug("doing something else");
		done();
	});
});

