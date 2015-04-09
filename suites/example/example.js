'use strict';
var debug=require('debug')('RoambiTest:login:debug');

describe("login", function doLogin() {
	it("should login", function doTest(done) {
		debug("login");
		done();
	});
});
/*
describe.android("login.android", function doLogin() {
	it("should login", function doTest(done) {
		debug("doing something");
		done();
	});
	it("should login 2", function doTest(done) {
		debug("doing something else");
		done();
	});
});

describe.ios("login.ios", function doLogin() {
	it("should login", function doTest(done) {
		debug("doing something");
		done();
	});
	it("should login 2", function doTest(done) {
		debug("doing something else");
		done();
	});
});

describe.web("login.web", function doLogin() {
	it("should login", function doTest(done) {
		debug("doing something");
		done();
	});
	it("should login 2", function doTest(done) {
		debug("doing something else");
		done();
	});
});

describe.win("login.win", function doLogin() {
	it("should login", function doTest(done) {
		debug("doing something");
		done();
	});
	it("should login 2", function doTest(done) {
		debug("doing something else");
		done();
	});
});
*/