'use strict';
var debug=require('debug')('RoambiTest:login:debug');

if( process.env["PLATFORM"] === "android" ) {
	describe("login.android", function doLogin() {
		it("should login", function doTest(done) {
			debug("doing something");
			done();
		});
		it("should login 2", function doTest(done) {
			debug("doing something else");
			done();
		});
	});
}
