#!/usr/bin/env node
"use strict";

var platforms=["android", "ios", "win", "web"],
    config={}, now,
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
	    .option('db.port', {
	    	describe: 'db port'
	    })
	    .option('db.host', {
	    	describe: 'db host'
	    })
		.config('config')
		.require('platform')
	    .check(verifyArgs)
	    .argv, i, j, subdirFiles,
    Mocha = require('mocha'),
    dateFormat = require('dateformat'),
    Model=require('./models/Model'),
    model=new Model("Mongo");

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
config.db={
	port: argv.db.port,
	host: argv.db.host
};
fs.writeFileSync(argv.config, JSON.stringify(config, null, 2));

debug("test arg "+argv._);
tests_to_run=argv._;

now=new Date();
process.env["multi"]="spec=- json=logs/"+dateFormat(now, "isoDateTime")+".json";
var mocha = new Mocha({
    ui: 'bdd',
    reporter: "mocha-multi"
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
	platforms.forEach(function addPlatformFilter(p) {
		debug("updating describe method for "+p);
		var P=p;
		context.describe[P]=function(title, fn) {
			//return without running tests if platform doesn't equal android
			debug("checking for "+P+" platform"+process.env["PLATFORM"]);
			if( process.env["PLATFORM"] != P ) 
				return false;
			var suite = context.describe(title, fn);
		    return suite;
		};
		context.describe[P].skip=function(title, fn) {
			var suite = context.describe.skip(title, fn);
		    return suite;
		};
		context.describe[P].only=function(title, fn) {
			if( process.env["PLATFORM"] != P ) 
				return false;
			var suite = context.describe(title, fn);
			mocha.grep(suite.fullTitle());
		    return suite;
		};
	});
});

mocha.run(function onRun(failures){
	process.on('beforeExit', function beforeExit() {
		if( typeof process.saved === typeof undefined ) {
	    	debug(process.saved+" saving results: logs/"+dateFormat(now, "isoDateTime"));
	    	model.connect(config.db)
	    		.then(function() {
	    			debug("saving");
	    			return model.save("logs/"+dateFormat(now, "isoDateTime"));
	    		})
	    		.then(function() {
	    			debug("closing:"+JSON.stringify(model));
	    			return model.close();
	    		})
	    		.then(function() {
	    			debug("DONE");
	    			process.saved=true;
	    			process.exit(failures);
	    		}, function(err) {
	    			debug("ERROR "+err);
	    			process.exit(failures);
	    		});
    	}
    });
    process.on('exit', function onExit() {
    	debug("onExit");
    });
});
