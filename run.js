#!/usr/bin/env node
"use strict";

var platforms=["android", "ios", "win", "web"],
    config={},
    tests_to_run=[], all_tests=[];

var fs=require('fs'),
	debug=require('debug')('RoambiTest:debug'),
	path=require('path'),
	argv=require('yargs')
		.help('help').alias('help', 'h')
		.option('config', {
			describe: 'config.json file to use saved settings',
			default:'./config.json'
		})
	    .option('platform', {
	    	alias:'p',
	        describe: 'platform name. One of <'+platforms.join("|")+'>'
	    })
	    .option('suite', {
	    	alias:"s",
	        describe: 'suite to run'
	    })
	    .option('test', {
	    	alias:'t',
	        describe: 'test to run'
	    })
	    .option('ci', {
			describe: 'run tests with CI configuration'
		})
		.config('config')
		.require('platform')
	    .check(verifyArgs)
	    .argv,
    Mocha = require('mocha'),
    read = require('fs-readdir-recursive');

//validate the args passed are valid
function verifyArgs(argv, options) {
	//verify the platform is valid
	if( !argv.platform in platforms )
		return false;
	//verify the suite is valid
	if( argv.suite && !fs.statSync("./suites/"+argv.suite).isDirectory() )
		return false;
	//verify the test is valid
	if( argv.suite && argv.test && !fs.statSync("./suites/"+argv.suite+"/"+argv.test).isFile() )
		return false;
	return true;
}

config.platform=argv.platform;
fs.writeFileSync(argv.config, JSON.stringify(config, null, 2));

config.suite=argv.suite;
config.test=argv.test;

var mocha = new Mocha({
    ui: 'bdd',
    reporter: argv.ci ? 'json' : 'spec'
});

//find all available tests
all_tests=read(__dirname+'/suites', function testFilter(filename) {
	return filename[0] !== '.';
});

debug("all_tests "+JSON.stringify(all_tests, null, 2));
debug("config "+JSON.stringify(config, null, 2));

//the default state is to run all tests in all suites
// suite = true test = true => run only the specified test in the specified suite
if( config.suite && config.test ) {
	debug("suite = true, test = true");
	all_tests.forEach(function doFilter(test) {
		debug("matching "+test+" "+config.suite+"/"+config.test);
		if( test.match(new RegExp(config.suite+"/"+config.test)) )
			tests_to_run.push("suites/"+test);
	});
}
// suite = true test = false => run all of the tests in the specified suite
else if( config.suite && !config.test ) {
	debug("suite = true, test = false");
	all_tests.forEach(function doFilter(test) {
		debug("matching "+test+" "+config.suite);
		if( test.match(new RegExp(config.suite)) )
			tests_to_run.push("suites/"+test);
	});
}
// suite = false test = true => run the specified test no matter which suite it's in
else if( !config.suite && config.test ) {
	debug("suite = false, test = true");
	all_tests.forEach(function doFilter(test) {
		debug("matching "+test+" .*/"+config.test);
		if( test.match(new RegExp(".*/"+config.test)) )
			tests_to_run.push("suites/"+test);
	});
}
// suite = false test = false => run all tests in all suites
else if( !config.suite && !config.test ) {
	debug("suite = false, test = false");
	all_tests.forEach(function doPushTestToRun(test) {
		tests_to_run.push("suites/"+test);
	});
}
tests_to_run.forEach(function doAddFile(test) {
	mocha.addFile(
        path.join(test)
    );
});

debug("tests_to_run "+JSON.stringify(tests_to_run, null, 2));

process.env["PLATFORM"]=config.platform;

mocha.suite.on('pre-require', function onPreRequire(context) {
	context.describe.android=function(title, fn) {
		//return without running tests if platform doesn't equal android
		if( process.env["PLATFORM"] != "android" ) 
			return false;
		var suite = context.describe(title, fn);
	    mocha.grep(suite.fullTitle());
	    return suite;
	};
	context.describe.ios=function(title, fn) {
		//return without running tests if platform doesn't equal ios
		if( process.env["PLATFORM"] != "ios" ) 
			return false;
		var suite = context.describe(title, fn);
	    mocha.grep(suite.fullTitle());
	    return suite;
	};
	context.describe.web=function(title, fn) {
		//return without running tests if platform doesn't equal web
		if( process.env["PLATFORM"] != "web" ) 
			return false;
		var suite = context.describe(title, fn);
	    mocha.grep(suite.fullTitle());
	    return suite;
	};
	context.describe.win=function(title, fn) {
		//return without running tests if platform doesn't equal win
		if( process.env["PLATFORM"] != "win" ) 
			return false;
		var suite = context.describe(title, fn);
	    mocha.grep(suite.fullTitle());
	    return suite;
	};
});
mocha.run(function onRun(failures){
    process.on('exit', function onExit() {
        process.exit(failures);
    });
});
