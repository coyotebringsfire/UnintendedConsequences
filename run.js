#!/usr/bin/env node
"use strict";

var platforms=["android", "ios", "win", "web"],
    config={},
    tests_to_run=[];

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
	    .boolean('ci', {
			describe: 'run tests with CI configuration'
		})
		.config('config')
		.require('platform')
	    .check(verifyArgs)
	    .argv, i, j, subdirFiles,
    Mocha = require('mocha'),
    read = require('fs-readdir-recursive');

//validate the args passed are valid
function verifyArgs(argv, options) {
	//verify the platform is valid
	if( !argv.platform in platforms )
		return false;
	//verify the test is valid
	argv._.forEach(function(testFileToRun) {
		if( !fs.statSync(testFileToRun).isFile() )
			return false;
	});
	return true;
}

config.platform=argv.platform;
fs.writeFileSync(argv.config, JSON.stringify(config, null, 2));

debug("test arg "+argv._);
tests_to_run=argv._;

var mocha = new Mocha({
    ui: 'bdd',
    reporter: argv.ci ? 'json' : 'spec'
});

debug("config "+JSON.stringify(config, null, 2));

for( i=0; i<tests_to_run.length; i++) {
	if( fs.statSync(tests_to_run[i]).isDirectory() ) {
		subdirFiles=fs.readdirSync(tests_to_run[i]);
		for( j=0; j<subdirFiles.length; j++ ) {
			tests_to_run.push(tests_to_run[i]+"/"+subdirFiles[j]);
		}
	}
}

tests_to_run.forEach(function doAddFile(test) {
	var tst=test;
	//if the argument is a directory, return
	if( fs.statSync(tst).isDirectory() ) {
		return;
	} else {
		debug("adding test "+test);
		mocha.addFile(
	        path.join(test)
	    );
	}
});

process.env["PLATFORM"]=config.platform;

mocha.suite.on('pre-require', function onPreRequire(context) {
	
	context.describe.android=function(title, fn) {
		//return without running tests if platform doesn't equal android
		debug("checking platform for android "+process.env["PLATFORM"]);
		if( process.env["PLATFORM"] != "android" ) 
			return false;
		var suite = context.describe(title, fn);
	    return suite;
	};
	context.describe.android.skip=function(title, fn) {
		var suite = context.describe.skip(title, fn);
	    return suite;
	};
	context.describe.android.only=function(title, fn) {
		if( process.env["PLATFORM"] != "android" ) 
			return false;
		var suite = context.describe(title, fn);
		mocha.grep(suite.fullTitle());
	    return suite;
	};

	context.describe.ios=function(title, fn) {
		//return without running tests if platform doesn't equal ios
		debug("checking platform for ios "+process.env["PLATFORM"]);
		if( process.env["PLATFORM"] != "ios" ) 
			return false;
		var suite = context.describe(title, fn);
	    return suite;
	};
	context.describe.ios.skip=function(title, fn) {
		var suite = context.describe.skip(title, fn);
	    return suite;
	};
	context.describe.ios.only=function(title, fn) {
		if( process.env["PLATFORM"] != "ios" ) 
			return false;
		var suite = context.describe(title, fn);
		mocha.grep(suite.fullTitle());
	    return suite;
	};

	context.describe.web=function(title, fn) {
		//return without running tests if platform doesn't equal web
		debug("checking platform for web "+process.env["PLATFORM"]);
		if( process.env["PLATFORM"] != "web" ) 
			return false;
		var suite = context.describe(title, fn);
	    return suite;
	};
	context.describe.web.skip=function(title, fn) {
		var suite = context.describe.skip(title, fn);
	    return suite;
	};
	context.describe.web.only=function(title, fn) {
		if( process.env["PLATFORM"] != "web" ) 
			return false;
		var suite = context.describe(title, fn);
		mocha.grep(suite.fullTitle());
	    return suite;
	};

	context.describe.win=function(title, fn) {
		//return without running tests if platform doesn't equal win
		debug("checking platform for win "+process.env["PLATFORM"]);
		if( process.env["PLATFORM"] != "win" ) 
			return false;
		var suite = context.describe(title, fn);
	    return suite;
	};
	context.describe.win.skip=function(title, fn) {
		var suite = context.describe.skip(title, fn);
	    return suite;
	};
	context.describe.win.only=function(title, fn) {
		if( process.env["PLATFORM"] != "win" ) 
			return false;
		var suite = context.describe(title, fn);
		mocha.grep(suite.fullTitle());
	    return suite;
	};
	
	debug(context);
});

mocha.run(function onRun(failures){
    process.on('exit', function onExit() {
        process.exit(failures);
    });
});
