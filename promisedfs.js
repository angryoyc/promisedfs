/** @module Promised FS
 * @name media
 * @author Serg A. Osipov
 * @email serg.osipov@gmail.com
 * @overview Wrapper for some methods of system fs module with promises
 */

var fs = require('fs');
var RSVP = require('rsvp');

exports.exists=function(path){
	return new RSVP.Promise(function(resolve, reject){
		fs.exists(path, function(exist){
			resolve(exist);
		});
	});
};

exports.stat=function stat(path){
	return new RSVP.Promise(function(resolve, reject){
		fs.stat(path, function(stats){
			resolve(stats);
		});
	});
};

exports.unlink=function unlink(path){
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

exports.rmdir=function rm(path){
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

exports.rm=function rm(path){
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

exports.readdir=function readdir(path){
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
