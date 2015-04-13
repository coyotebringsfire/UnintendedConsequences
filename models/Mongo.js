var Q=require('q'),
	dateFormat = require('dateformat'),
	MongoClient = require('mongodb').MongoClient,
	debug=require('debug')('RoambiTest:model:mongo:debug'),
	now;

function Mongo() {
	var mongo_db;
	this.model="mongo";

	this.connect=function(options) {
		var deferred = Q.defer()
			connectString="mongodb://";
		if( options.login )
			connectString+=options.login+":"+options.password+"@";
		connectString+=options.host+":"+options.port+"/testruns";
		debug("connectString:"+connectString);
		MongoClient.connect(connectString, function(err, db) {
			if(err) 
				return deferred.reject(err);
			debug("connect ", db);
			mongo_db=db;
			return deferred.resolve(this);
		});
		return deferred.promise;
	};
	this.save=function(path) {
		var deferreds = [],
			inFile=require(__dirname+'/../'+path);
			debug("saving test results");

		Object.keys(inFile).forEach( function parseSuiteResults(suite) {
			var s=suite;
			Object.keys(inFile[suite]).forEach( function parseTestResults(test) {
				var t=test;
				var deferred = Q.defer();
				deferreds.push( deferred.promise );
				mongo_db.collection("testruns").insert({"passed":inFile[s][t] === "PASSED", "suite":s, "test":t, "timestamp":dateFormat(now, "isoDateTime")}, {upsert:false}, function(err, result) {
					if(err) {
						debug("insert error:"+err);
						deferred.reject("insert results "+err);
					}
					debug("pass insert results "+result);
					deferred.resolve(result);
				});
			});
		});

		return Q.all(deferreds);
	};
	this.close=function() {
		debug("closing db");
		var deferred=Q.defer();
		mongo_db.close();
		setTimeout( deferred.resolve, 0);
		return deferred.promise;
	};
}

module.exports=Mongo;