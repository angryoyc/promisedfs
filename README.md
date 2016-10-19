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
	pfs.exists('/etc/hosts')
	.then(
		function(exist){
			console.log(exist);
		},
		function(err){
			console.log(err);
		}
	)
```
