promisedfs
-----

Promised wrapper over system fs object


Install
--------

npm install "git+https://github.com/angryoyc/promisedfs.git"

Tests
------
```
make test
```


Example
--------
```
	var pfs = require("promisedfs");
	pfs.isfile('/etc/hosts')
	.then(
		function(stats){
			console.log('specified path is existing file' + stats.size);
		},
		function(err){
			console.log(err);
		}
	)
```
