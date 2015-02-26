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

exports.unlink=function(path){
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

exports.rmdir=function(path){
	return new RSVP.Promise(function(resolve, reject){
		fs.rmdir(path, function(err){
			if(err){
				reject(err);
			}else{
				resolve(true);
			};
		});
	});
};

