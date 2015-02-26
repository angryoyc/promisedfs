/** @module Promised FS
 * @name media
 * @author Serg A. Osipov
 * @email serg.osipov@gmail.com
 * @overview Wrapper for some methods of system fs module with promises
 */

var fs = require('fs');
var RSVP = require('rsvp');

/**
 * Проверка наличия элемента файловой системы.
 * @param  {string} path  Пусть к элементу файловой системы
 * @return {promise}      Promise объект, resolve вызов которого получит результат - true|false  в зависимости от результата проверки.
 */
var exists=exports.exists=function(path){
	return new RSVP.Promise(function(resolve, reject){
		fs.exists(path, resolve);
	});
};

/**
 * Сведения об элементе файловой системы
 * @param  {string} path  Пусть к элементу файловой системы
 * @return {promise}      Promise объект, resolve вызов которого получит результат - объект stats
 */
var stat=exports.stat=function(path){
	return new RSVP.Promise(function(resolve, reject){
		fs.stat(path, getStdHandler(resolve, reject));
	});
};

/**
 * Удаления файла.
 * @param  {string} path  Путь к файлу
 * @return {promise}      Promise объект, resolve вызов которого получит результат - список удалённых элементов
 */
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

/**
 * Удаление папки со всеми его дочерними элементами. Быстро, на сколько только можно
 * @param  {string} path  Путь к папке, которую будем удалять
 * @return {promise}      Promise объект, resolve вызов которого получит результат - список удалённых элементов
 */
var rmdir=exports.rmdir=function(path){
	return new RSVP.Promise(function(resolve, reject){
		readdir(path)
		.then(
			function(files){
				var promises=files.map(function(file){
					return rm(path + '/' +file);
				});
				RSVP.all(promises).then(function(posts){
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
	return new RSVP.Promise(function(resolve, reject){
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
	return new RSVP.Promise(function(resolve, reject){
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
			resolve(result)
		};
	};
};
