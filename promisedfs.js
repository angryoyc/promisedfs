/** @module Promised FS
 * @name media
 * @author Serg A. Osipov
 * @email serg.osipov@gmail.com
 * @overview Wrapper for some methods of system fs module with promises
 */

var fs = require('fs');
var RSVP = require('rsvp');

var exists=exports.exists=function(path){
	return new RSVP.Promise(function(resolve, reject){
		fs.exists(path, function(exist){
			resolve(exist);
		});
	});
};

var stat=exports.stat=function(path){
	return new RSVP.Promise(function(resolve, reject){
		fs.stat(path, function(stats){
			resolve(stats);
		});
	});
};

var unlink=exports.unlink=function(path){
	return new RSVP.Promise(function(resolve, reject){
		fs.unlink(path, function(err){
			if(err){
				reject(err);
			}else{
				resolve(true);
			};
		});
	});
};

var rmdir=exports.rmdir=function(path){
	return new RSVP.Promise(function(resolve, reject){
		return readdir(path)
		.then(function(files){
			var promises=files.map(function(file){
				return rm(path + '/' +file);
			});
			RSVP.all(promises).then(function(posts){
				resolve();
			});
		})
	});
};

var rm=exports.rm=function (path){
	return new RSVP.Promise(function(resolve, reject){
		return stat(path)
		.then(function(stats){
			if(stats.isDirectory()){
				return rmdir(path);
			}else{
				return unlink(path);
			};
		});
	});
};

var readdir=exports.readdir=function (path){
	return new RSVP.Promise(function(resolve, reject){
		fs.readdir(path, function(err, files){
			if(err){
				reject(err);
			}else{
				resolve(files);
			};
		});
	});
};
