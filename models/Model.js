var fs=require('fs'),
	debug=require('debug')('RoambiTest:model:debug');

function Model(model) {
	if( !fs.statSync(__dirname+"/"+model+".js").isFile() ) {
		throw new Error("INVALIDMODEL");
	}
	//inject the specified model
	var m=require("./"+model+".js");
	debug(m);
	m.apply(this);
}

module.exports=Model;
