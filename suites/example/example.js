'use strict';
var debug=require('debug')('RoambiTest:example:debug');

describe("example", function doExample() {
	it("should example", function doTest(done) {
		debug("example");
		done();
	});
});

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

