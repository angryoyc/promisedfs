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
	console.log('stat', path);
	return new RSVP.Promise(function(resolve, reject){
		fs.stat(path, function(err, stats){
			if(err){
				reject(err);
			}else{
				resolve(stats);
			};
		});
	});
};

var unlink=exports.unlink=function(path){
	return new RSVP.Promise(function(resolve, reject){
		fs.unlink(path, function(err){
			if(err){
				reject(err);
			}else{
				resolve(path);
			};
		});
	});
};

var rmdir=exports.rmdir=function(path){
	return new RSVP.Promise(function(resolve, reject){
		readdir(path)
		.then(
			function(files){
				var promises=files.map(function(file){
					return rm(path + '/' +file);
				});
				console.log('all promises');
				RSVP.all(promises).then(function(posts){
					console.log('all promises results', posts);
					fs.rmdir(path, function(err){
						if(err){
							reject(err);
						}else{
							resolve(path);
						};
					});
				});
			},
			function(err){
				reject(err);
			}
		).catch(function(reason){reject(reason);});
	});
};

var rm=exports.rm=function (path){
	console.log('rm', path);
	return new RSVP.Promise(function(resolve, reject){
		stat(path)
		.then(
			function(stats){
				if(stats.isDirectory()){
					rmdir(path)
					.then(
						function(result){
							resolve(result);
						},
						function(err){
							reject(err);
						}
					);
				}else{
					unlink(path)
					.then(
						function(result){
							resolve(result);
						},
						function(err){
							reject(err);
						}
					);
				};
			},
			function(err){
				reject(err);
			}
		).catch(function(reason){reject(reason);});
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
