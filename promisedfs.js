/** @module Promised FS
 * @name media
 * @author Serg A. Osipov
 * @email serg.osipov@gmail.com
 * @overview Wrapper for some methods of system fs module with promises
 */

'use strict';
var fs = require('fs');
//var RSVP = require('rsvp');
var mkdirp = require('mkdirp');

/**
 * Проверка наличия элемента файловой системы.
 * @param  {string} path  Пусть к элементу файловой системы
 * @return {promise}      Promise объект, resolve вызов которого получит результат - true|false  в зависимости от результата проверки.
 */
var exists=exports.exists=function(path){
	return new Promise(function(resolve, reject){
		fs.exists(path, resolve);
	});
};

/**
 * Сведения об элементе файловой системы
 * @param  {string} path  Пусть к элементу файловой системы
 * @return {promise}      Promise объект, resolve вызов которого получит результат - объект stats
 */
var stat=exports.stat=function(path){
	return new Promise(function(resolve, reject){
		fs.stat(path, getStdHandler(resolve, reject));
	});
};



/**
 * Создание указанного пути папок
 * @param  {string} path  Пусть к элементу файловой системы, возможно не существующий - он будет создан
 * @return {promise}      Promise объект, resolve вызов которого получит результат - путь к созданной папке
 */
var mkdir=exports.mkdir=function(path){
	return new Promise(function(resolve, reject){
		var pth = require('path');
		fs.mkdir(path, function(err) {
			if(err){
				if(err.errno === 34) {
					mkdir(pth.dirname(path))
					.then(function(){
						mkdir(path).then(resolve).catch(reject);
					}).catch(reject);
				}else if(err.errno === 17){ // уже есть
					resolve(path);
				};
			}else{
				resolve(path);
			};
			//Manually run the callback since we used our own callback to do all these
			
		});
/*
		mkdirp(path, function(err){
			if(err){
				reject(err);
			}else{
				resolve(path);
			};
		});
*/

	});
};

/**
 * Создание симлинка
 * @param  {string} filepath  Пусть к элементу файловой системы
 * @param  {string} linkpath  Пусть к симлинку
 * @return {promise}          Promise объект, resolve вызов которого получит результат - путь к созданному симлинку
 */
var symlink=exports.symlink=function(filepath, linkpath){
	return new Promise(function(resolve, reject){
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
	return new Promise(function(resolve, reject){
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
	return new Promise(function(resolve, reject){
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
	return new Promise(function(resolve, reject){
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
	return new Promise(function(resolve, reject){
		fs.readdir(path, getStdHandler(resolve, reject));
	});
};

/**
 * Получить стандартный обработчик. Стандартная фабрика для генерации стандартного обработчика вызовов fs
 * @param  {function} resolve  Callback, вызываемый в случае удачи.
 * @param  {function} reject   Callback, вызываемый в случае ошибки.
 * @return {function}          Стандартный обработчик.
 */
function getStdHandler(resolve, reject){
	return function(err, result){
		if(err){
			reject(err);
		}else{
			
//			console.log(result);
			
			resolve(result)
		};
	};
};
