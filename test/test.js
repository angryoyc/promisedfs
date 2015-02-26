#!/usr/local/bin/node
var RSVP = require('rsvp');
var pfs = require('../promisedfs');

pfs.rmdir('/tmp/22')
.then(
	function(result){
		console.log(result);
	},
	function(err){
		console.log(err);
	}
);
