/** @module Promised FS
 * @name pfs
 * @author Serg A. Osipov
 * @email serg.osipov@gmail.com
 * @overview Wrapper for some useful methods of system fs module with promises
 */

'use strict';

var fs     = require('fs');
var cf     = require('cf');
var mkdirp = require('mkdirp');
var move   = require('mv');
var crypto = require('crypto');


/**
 * Проверка является ли заданный путь, путём к существующуму файлу
 * @param  {string} path  Предполагаемый путь к файлу
 * @return {promise}      Promise объект, resolve вызов которого получит результат - true/false
 */
var isfile=exports.isfile=function(path){
	//- return new Promise(function(resolve, reject){
	return cf.asy(arguments, function(path, resolve, reject){
		exists(path)
		.then(function(exist){
			if(!exist) throw new Error('Not exists');
			return stat(path);
		})
		.then(function(stats){
			if(!stats.isFile()) throw new Error('Not file');
			return true;
		})
		.then(resolve, reject).catch(reject);
	});
};


/**
 * Проверка является ли заданный путь, путём к существуещему файлу-ссылке
 * @param  {string} path  Предполагаемый путь к файлу
 * @return {promise}      Promise объект, resolve вызов которого получит результат - true/false
 */
var issymlink=exports.symlink=function(path){
	//- return new Promise(function(resolve, reject){
	return cf.asy(arguments, function(path, resolve, reject){
		exists(path)
		.then(function(exist){
			if(!exist) throw new Error('Not exists');
			return lstat(path);
		})
		.then(function(stats){
			if(!stats.isSymbolicLink()) throw new Error('Not symlink');
			return stats;
		})
		.then(resolve, reject).catch(reject);
	});
};


/**
 * Проверка является ли заданный путь, путём к сущей директории
 * @param  {string} path  Предполагаемый путь к папке
 * @return {promise}      Promise объект, resolve вызов которого получит результат - true/false
 */
var isfolder=exports.isfolder=function(path){
	//- return new Promise(function(resolve, reject){
	return cf.asy(arguments, function(path, resolve, reject){
		exists(path)
		.then(function(exist){
			if(!exist) throw new Error('Not exists');
			return stat(path);
		})
		.then(function(stats){
			if(!stats.isDirectory()) throw new Error('Not folder');
			return true;
		})
		.then(resolve, reject).catch(reject);
	});
};

/**
 * Вычисление md5
 * @param  {string} path  Путь к файлу
 * @return {promise}      Promise объект, resolve вызов которого получит результат - md5 указанного файла
 */
var md5=exports.md5=function(path){
	//-return new Promise(function(resolve, reject){
	return cf.asy(arguments, function(path, resolve, reject){
		exists(path)
		.then(function(exist){
			if(!exist) throw new Error('Not exists');
			return exist;
		})
		.then(function(exist){
			return stat(path)
		})
		.then(function(stats){
			if(!stats.isFile()) throw new Error('Only files allowed');
			return stats.size;
		})
		.then(function(size){
			return new Promise(function(rlv, rjc){
				var md5sum = crypto.createHash('md5');
				var s = fs.ReadStream(path);
				s.on('error', rjc);
				s.on('data', function(d) { md5sum.update(d); });
				s.on('end', function() {
					rlv(md5sum.digest('hex'));
				})
			});
		})
		.then(resolve, reject).catch(reject);
	});
};


/**
 * Проверка наличия элемента файловой системы.
 * @param  {string} path  Пусть к элементу файловой системы
 * @return {promise}      Promise объект, resolve вызов которого получит результат - true|false  в зависимости от результата проверки.
 */
var exists=exports.exists=function(path){
	//- return new Promise(function(resolve, reject){
	return cf.asy(arguments, function(path, resolve, reject){
		fs.exists(path, resolve);
	});
};

/**
 * Сведения об элементе файловой системы
 * @param  {string} path  Пусть к элементу файловой системы
 * @return {promise}      Promise объект, resolve вызов которого получит результат - объект stats
 */
var stat=exports.stat=function(path){
	//- return new Promise(function(resolve, reject){
	return cf.asy(arguments, function(path, resolve, reject){
		fs.stat(path, getStdHandler(resolve, reject));
	});
};



/**
 * Создание указанного пути папок
 * @param  {string} path  Пусть к элементу файловой системы, возможно не существующий - он будет создан
 * @return {promise}      Promise объект, resolve вызов которого получит результат - путь к созданной папке
 */
var mkdir=exports.mkdir=function(path){
	//- return new Promise(function(resolve, reject){
	return cf.asy(arguments, function(path, resolve, reject){

/*
		var pth = require('path');
		fs.mkdir(path, function(err) {
			if(err){
				if(err.errno === 34) {
					mkdir(pth.dirname(path))
					.then(function(){
						mkdir(path).then(resolve).catch(reject);
					}, reject).catch(reject);
				}else if(err.errno === -17){ // уже есть
					stat(path)
					.then(function(stats){
						if(stats.isDirectory()){
							resolve(path);
						}else{
							reject(err);
						};
					}).catch(reject);
				}else{
					//console.log(err);
					reject(err);
				};
			}else{
				resolve(path);
			};
			//Manually run the callback since we used our own callback to do all these
			
		});
*/

		mkdirp(path, function(err){
			if(err){
				reject(err);
			}else{
				resolve(path);
			};
		});

	});
};

/**
 * Создание симлинка
 * @param  {string} filepath  Пусть к элементу файловой системы
 * @param  {string} linkpath  Пусть к симлинку
 * @return {promise}          Promise объект, resolve вызов которого получит результат - путь к созданному симлинку
 */
var symlink=exports.symlink=function(filepath, linkpath){
	//- return new Promise(function(resolve, reject){
	return cf.asy(arguments, function(filepath, linkpath, resolve, reject){
		fs.symlink(filepath, linkpath, function(err){
			if(err){
				reject(err);
			}else{
				resolve(linkpath);
			};
		});
	});
};


/**
 * Удаления файла.
 * @param  {string} path  Путь к файлу
 * @return {promise}      Promise объект, resolve вызов которого получит результат - список удалённых элементов
 */
var unlink=exports.unlink=function(path){
	//- return new Promise(function(resolve, reject){
	return cf.asy(arguments, function(path, resolve, reject){
		fs.unlink(path, function(err){
			if(err){
				reject(err);
			}else{
				resolve(path);
			};
		});

	});
};

/**
 * Удаление папки со всеми его дочерними элементами. Быстро, на сколько только можно
 * @param  {string} path  Путь к папке, которую будем удалять
 * @return {promise}      Promise объект, resolve вызов которого получит результат - список удалённых элементов
 */
var rmdir=exports.rmdir=function(path){
	//- return new Promise(function(resolve, reject){
	return cf.asy(arguments, function(path, resolve, reject){
		readdir(path)
		.then(
			function(files){
				var promises=files.map(function(file){
					return rm(path + '/' +file);
				});
				Promise.all(promises).then(function(posts){
					fs.rmdir(path, function(err){
						if(err){
							reject(err);
						}else{
							var result=[];
							posts.forEach(function(post){
								post.forEach(function(item){
									result.push(item);
								})
							})
							result.push(path);
							resolve(result);
						};
					});
				});
			},
			reject
		).catch(reject);
	});
};

/**
 * Удаление элемента файловой системы со всеми его дочерними элементами. Медленно.
 * @param  {string} path  Путь к элементам папки, который будем удалять
 * @return {promise}      Promise объект, resolve вызов которого получит результат - список удалённых элементов
 */
var rm=exports.rm=function (path){
	//- return new Promise(function(resolve, reject){
	return cf.asy(arguments, function(path, resolve, reject){
		stat(path)
		.then(
			function(stats){
				if(stats.isDirectory()){
					rmdir(path).then(resolve, reject);
				}else{
					unlink(path)
					.then(
						function(result){
							resolve([result]);
						},
						reject
					);
				};
			},
			reject
		).catch(reject);
	});
};

/**
 * Чтение списка элементов директории
 * @param  {string} path  Путь к папке, которую будем читать
 * @return {promise}      Promise объект, resolve вызов которого получит результат - список прочитанных элементов.
 */
var readdir=exports.readdir=function (path){
	//- return new Promise(function(resolve, reject){
	return cf.asy(arguments, function(path, resolve, reject){
		fs.readdir(path, getStdHandler(resolve, reject));
	});
};

/**
 * Перемещение файла
 * @param  {string} src   Путь и имя файла, который будем перемещать
 * @param  {string} dst   Новый путь и имя файла в которые будем перемещать
 * @return {promise}      Promise объект, resolve вызов которого получит результат - новое положение файла (dst).
 */
var mv=exports.mv=function (src, dst){
	//return new Promise(function(resolve, reject){
	//-return cf.asy(arguments, function(src, dst, resolve, reject){
	return cf.asy(arguments, function(src, dst, resolve, reject){
		move(src, dst, {mkdirp: true}, getStdHandler(resolve, reject, dst));
	});
};


/**
 * Получить стандартный обработчик. Стандартная фабрика для генерации стандартного обработчика вызовов fs
 * @param  {function} resolve  Callback, вызываемый в случае удачи.
 * @param  {function} reject   Callback, вызываемый в случае ошибки.
 * @return {function}          Стандартный обработчик.
 */
function getStdHandler(resolve, reject, res){
	return function(err, result){
		if(err){
			reject(err);
		}else{
			resolve(result || res);
		};
	};
};
