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
			connectString="mongodb://"+options.host+":"+options.port+"/testruns";
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
		var deferredFailures = [],
			deferredPasses = [],
			inFile=require(__dirname+'/../'+path);
			debug("saving test results");

		inFile.failures.forEach(function doSaveFailure(failedTest) {
			var deferred = Q.defer();
			deferredFailures.push( deferred.promise );
			failedTest.timestamp=dateFormat(now, "isoDateTime");
			mongo_db.collection("failedTests").insert(failedTest, {upsert:true}, function(err, result) {
				if(err) {
					debug("insert error:"+err);
					deferred.reject("insert results "+err);
				}
				debug("insert results "+result);
				deferred.resolve(result);
			});
		});
		inFile.passes.forEach(function doSavePass(passedTest) {
			var deferred = Q.defer();
			deferredPasses.push( deferred.promise );
			passedTest.timestamp=dateFormat(now, "isoDateTime");
			mongo_db.collection("passedTests").insert(passedTest, {upsert:true}, function(err, result) {
				if(err) {
					debug("insert error:"+err);
					deferred.reject("insert results "+err);
				}
				debug("insert results "+result);
				deferred.resolve(result);
			});
		});

		return Q.all(deferredPasses.concat(deferredFailures));
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