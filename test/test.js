#!/usr/local/bin/node

var should = require('should');
var fs = require('fs');
var pfs = require("../promisedfs");


describe('PromisedFS', function(){
	var dirpath = __dirname + '/files/';
	var dirpath2 = __dirname + '/files/dir/';
	var dirpath3 =  dirpath2 + 'dir';
	var symlink =  dirpath2 + 'symlink';
	var filepath1 = __dirname + '/files/file';
	var filepath2 = __dirname + '/files/file2'
	var filepath3 = __dirname + '/files/file3'
	var filepath4 = __dirname + '/files/file4'


	fs.createReadStream(filepath1).pipe(fs.createWriteStream(filepath3));
	fs.createReadStream(filepath1).pipe(fs.createWriteStream(filepath4));
	fs.mkdirSync(dirpath2);
	fs.createReadStream(filepath1).pipe(fs.createWriteStream(dirpath2+'/file5'));


	describe('exists', function(){

		it('should return answer "true" for path ' + filepath1, function(done){
			pfs.exists(filepath1)
			.then(
				function(exist){
					exist.should.equal(true);
					done();
				},
				function(err){
					return done(err);
				}
			)
		})

		it('should return answer "false" for path ' + filepath2, function(done){
			pfs.exists(filepath2)
			.then(
				function(exist){
					exist.should.equal(false);
					done();
				},
				function(err){
					return done(err);
				}
			)
		})
	});


	describe('stat', function(){
		it('should return stats object with true size for path ' + filepath1, function(done){
			pfs.stat(filepath1)
			.then(
				function(stats){
					stats.should.type('object');
					stats.size.should.type('number');
					stats.size.should.equal(526);
					done();
				},
				function(err){
					return done(err);
				}
			).catch(done);
		})
	});

	describe('readdir', function(){
		it('should return list of folder files for path ' + dirpath, function(done){
			pfs.readdir(dirpath)
			.then(
				function(ls){
					ls.should.type('object');
					ls.length.should.type('number');
					ls.length.should.equal(4);
					done();
				},
				function(err){
					return done(err);
				}
			).catch(done);
		})
	});

	describe('mkdir', function(){
		it('should create path and return it ' + dirpath3, function(done){
			pfs.mkdir(dirpath3)
			.then(
				function(ls){
					ls.should.type('string');
					done();
				},
				function(err){
					return done(err);
				}
			).catch(done);
		})
	});

	describe('symlink', function(){
		it('should create simlink and return path to it: ' + symlink, function(done){
			pfs.symlink(filepath1, symlink)
			.then(
				function(ls){
					ls.should.type('string');
					ls.should.equal(symlink);
					done();
				},
				function(err){
					return done(err);
				}
			).catch(done);
		})
	});

	describe('unlink', function(){
		it('should remove file and and return it path ' + filepath3, function(done){
			pfs.unlink(filepath3)
			.then(
				function(removedfile){
					removedfile.should.type('string');
					removedfile.should.equal(filepath3);
					done();
				},
				function(err){
					return done(err);
				}
			).catch(done);
		})
	});

	describe('rmdir', function(){
		it('should remove folder and and return removed itemes list ' + dirpath2, function(done){
			pfs.rm(dirpath2)
			.then(
				function(removedfileslist){
					removedfileslist.should.type('object');
					done();
				},
				function(err){
					return done(err);
				}
			).catch(done);
		})
	});

	describe('rm', function(){
		it('should remove any fs-item and return it\'s pathes ' + filepath4, function(done){
			pfs.rm(filepath4)
			.then(
				function(removedfileslist){
					removedfileslist.should.type('object');
					done();
				},
				function(err){
					return done(err);
				}
			).catch(done);
		})
	});

});
