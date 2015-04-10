'use strict';
var debug=require('debug')('RoambiTest:example_2:debug');

describe("example 2", function doLogin() {
	it("should example again", function doTest(done) {
		debug("example again");
		done();
	});
	it("should example again again", function doTest(done) {
		debug("again");
		done();
	});
});

//run only the following tests if the platform is win
describe.win.only("example 2.win", function doLogin() {
	it("should example again", function doTest(done) {
		debug("example again");
		done();
	});
	it("should example again again", function doTest(done) {
		debug("again");
		done();
	});
});

//run only the following tests if the platform is android
describe.android.only("example 2.android", function doLogin() {
	it("should example again", function doTest(done) {
		debug("example again");
		done();
	});
	it("should example again again", function doTest(done) {
		debug("again");
		done();
	});
});

//run only the following tests if the platform is ios
describe.ios.only("example 2.ios", function doLogin() {
	it("should example again", function doTest(done) {
		debug("example again");
		done();
	});
	it("should example again again", function doTest(done) {
		debug("again");
		done();
	});
});

//run only the following tests if the platform is web
describe.web.only("example 2.web", function doLogin() {
	it("should example again", function doTest(done) {
		debug("example again");
		done();
	});
	it("should example again again", function doTest(done) {
		debug("again");
		done();
	});
});