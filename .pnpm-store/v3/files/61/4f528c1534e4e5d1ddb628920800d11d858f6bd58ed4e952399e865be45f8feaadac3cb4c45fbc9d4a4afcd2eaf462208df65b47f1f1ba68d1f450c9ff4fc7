"use strict";

var exec = require( "child_process" ).exec
var fs = require( "fs" )
var os = require( "os" )
var path = require( "path" )
var yaml = require('js-yaml')
var buildYamlSchema = require('./schema')
const spawn = require('child_process').spawn
var Watchpack = require("watchpack");


var Lambda = function( o ) {
	this.settings = o || {};
	return this;
}

Lambda.prototype._resolve_refs = function( $config ) {
	this.envs = {}

	if (
		(typeof $config.AWS_KEY === "object") &&
		Object.prototype.hasOwnProperty.call( $config.AWS_KEY , 'Ref') &&
		(typeof $config.AWS_KEY.Ref === "string") &&
		($config.AWS_KEY.Ref.indexOf('env.') === 0)
	) {
		this.envs[ $config.AWS_KEY.Ref.split('env.')[1] ] = process.env[ $config.AWS_KEY.Ref.split('env.')[1] ]
		$config.AWS_KEY = process.env[ $config.AWS_KEY.Ref.split('env.')[1] ]
	}

	if (
		(typeof $config.AWS_SECRET === "object") &&
		Object.prototype.hasOwnProperty.call( $config.AWS_SECRET , 'Ref') &&
		(typeof $config.AWS_SECRET.Ref === "string") &&
		($config.AWS_SECRET.Ref.indexOf('env.') === 0)
	) {
		this.envs[ $config.AWS_SECRET.Ref.split('env.')[1] ] = process.env[ $config.AWS_SECRET.Ref.split('env.')[1] ]
		$config.AWS_SECRET = process.env[ $config.AWS_SECRET.Ref.split('env.')[1] ]
	}


	if (
		(typeof $config.Role === "object") &&
		Object.prototype.hasOwnProperty.call( $config.Role , 'Ref') &&
		(typeof $config.Role.Ref === "string") &&
		($config.Role.Ref.indexOf('env.') === 0)
	) {
		this.envs[ $config.Role.Ref.split('env.')[1] ] = process.env[ $config.Role.Ref.split('env.')[1] ]
		$config.Role = process.env[ $config.Role.Ref.split('env.')[1] ]
	}

	return $config;
}

Lambda.prototype._parse_config_file = function( program ) {

	if (program.substr(-7) === '.lambda')
		program = program.substr(0,program.length - 7)

	var config_file = program + '.lambda'
	if ( !fs.existsSync( config_file ) ) {
		console.log('Lambda config not found (' + program + '.lambda )')
		process.exit(-1)
	}
	var $config;
	try {
		//var $config = JSON.parse(fs.readFileSync( config_file, "utf8"))
		$config = yaml.safeLoad(fs.readFileSync( config_file, "utf8"), {
			schema: buildYamlSchema(),
			onWarning: function(warning) {
				console.error(warning);
			},
			json: true,
		})
	} catch (e) {
		console.log('Invalid config file (' + program + '.lambda )', e )
		if ( this.settings.exitOnError !== false )
			process.exit(-1)
		return;
	}
	// console.log( JSON.stringify($config, null, "\t"))

	$config = this._resolve_refs($config);


	if (!$config.FunctionName)
		$config.FunctionName = program.split('/').slice(-1)[0]

	var $configPath = program.split('/').slice(0,-1).join('/')
	//console.log( $configPath )

	var fullFunctionPath

	if (($config.PATH.substr(0,1) === '/') || ($config.PATH.substr(0,2) == '~/')) {
		fullFunctionPath =  ($config.PATH).replace(/\/\.\//g, '/')
	} else {
		fullFunctionPath = (process.cwd() + '/' + $configPath + '/' + $config.PATH).replace(/\/\.\//g, '/')
	}

	if ( fullFunctionPath.substr(-1) !== '/')
		fullFunctionPath+='/'

	//console.log($fullFunctionPath)

	$config.PATH = fullFunctionPath;

	return $config;
}



Lambda.prototype.deploy = function( program ) {
	var aws = require( "aws-sdk" )

	if (process.env.AWSPILOT_DOCKER_WORKDIR)
		process.chdir(process.env.AWSPILOT_DOCKER_WORKDIR)

	if (program.substr(-7) === '.lambda')
		program = program.substr(0,program.length - 7)

	var config_file = program + '.lambda'
	if ( !fs.existsSync( config_file ) ) {
		console.log('Lambda config not found (' + program + '.lambda )')
		process.exit(-1)
	}

	try {
		//var $config = JSON.parse(fs.readFileSync( config_file, "utf8"))
		var $config = yaml.safeLoad(fs.readFileSync( config_file, "utf8"), {
			schema: buildYamlSchema(),
			onWarning: function(warning) {
				console.error(warning);
			},
			json: true,
		})
	} catch (e) {
		console.log('Invalid config file (' + program + '.lambda )', e )
		if ( _this.settings.exitOnError !== false )
			process.exit(-1)
		return;
	}
	// console.log( JSON.stringify($config, null, "\t"))
	if (
		(typeof $config.AWS_KEY === "object") &&
		Object.prototype.hasOwnProperty.call( $config.AWS_KEY , 'Ref') &&
		(typeof $config.AWS_KEY.Ref === "string") &&
		($config.AWS_KEY.Ref.indexOf('env.') === 0)
	)
		$config.AWS_KEY = process.env[ $config.AWS_KEY.Ref.split('env.')[1] ]

	if (
		(typeof $config.AWS_SECRET === "object") &&
		Object.prototype.hasOwnProperty.call( $config.AWS_SECRET , 'Ref') &&
		(typeof $config.AWS_SECRET.Ref === "string") &&
		($config.AWS_SECRET.Ref.indexOf('env.') === 0)
	)
		$config.AWS_SECRET = process.env[ $config.AWS_SECRET.Ref.split('env.')[1] ]


	if (
		(typeof $config.Role === "object") &&
		Object.prototype.hasOwnProperty.call( $config.Role , 'Ref') &&
		(typeof $config.Role.Ref === "string") &&
		($config.Role.Ref.indexOf('env.') === 0)
	)
		$config.Role = process.env[ $config.Role.Ref.split('env.')[1] ]

	if (!$config.FunctionName)
		$config.FunctionName = program.split('/').slice(-1)[0]

	if (!/^([a-zA-Z0-9-_.]+)(:(\$LATEST|[a-zA-Z0-9-_]+))?$/.test($config.FunctionName)) {
		console.log("Invalid function name", $config.FunctionName );
		process.exit(-1);
	}

	aws.config.update({
		accessKeyId: $config.AWS_KEY,
		secretAccessKey: $config.AWS_SECRET,
		region: $config.AWS_REGION
	})

	var lambdaV2 = new aws.Lambda( { apiVersion: "2015-03-31" } )


	var _this = this

	var tmpfile = path.join( os.tmpdir(), $config.FunctionName + "-" + new Date().getTime() + ".zip" )
	var $configPath = program.split('/').slice(0,-1).join('/')

	var fullFunctionPath
	if (($config.PATH.substr(0,1) === '/') || ($config.PATH.substr(0,2) == '~/')) {
		fullFunctionPath =  ($config.PATH).replace(/\/\.\//g, '/')
	} else {
		fullFunctionPath = (process.cwd() + '/' + $configPath + '/' + $config.PATH).replace(/\/\.\//g, '/')
	}

	if (fullFunctionPath.substr(-1) !== '/')
		fullFunctionPath+='/'

	if (!fs.existsSync( fullFunctionPath )) {
		console.log( "No such directory:" + fullFunctionPath )
		process.exit(-1)
	}

	var $cwd = process.cwd()
	process.chdir( fullFunctionPath )

	var zipfileList = '.'

	try {
		var packageJson = fs.readFileSync( 'package.json', 'utf8' )

		if ( packageJson ) {
			var packageJsonFiles = JSON.parse( packageJson ).files

			if ( typeof packageJsonFiles === 'object' ) {
				zipfileList = packageJsonFiles.join( ' ' )
			}
		}
	} catch (e) { }

	var $zipCmd = "zip -r -9  " + tmpfile + ' ' + zipfileList

	// maxBuffer specifies the largest amount of data allowed on stdout or stderr - if this value is exceeded then the child process is killed.
	exec( $zipCmd, { maxBuffer: 1024 * 1024 * 5 /* 5MB */} ,function( err /*, stdout, stderr */ ) {
		process.chdir($cwd)
		if ( err ) {
			console.log("Error generating zip file")
			throw err;
		}
		var buffer = fs.readFileSync( tmpfile )

		// var params = {
		// 	FunctionName: $config.FunctionName,
		// 	FunctionZip: buffer,
		// 	Handler: $config.Handler,
		// 	Mode: 'event',
		// 	Role: $config.Role,
		// 	Runtime: $config.Runtime || 'nodejs10.x',
		// 	Description: $config.Description,
		// 	MemorySize: $config.MemorySize,
		// 	Timeout: $config.Timeout
		// }

		if (typeof $config.Environment !== "object")
			$config.Environment = {}

		if (typeof $config.Environment.Variables !== "object")
			$config.Environment.Variables = {}

		if (typeof $config.Tags !== "object")
			$config.Tags = {}

		var paramsV2 = {
			Code: { ZipFile: buffer, },
			Description: $config.Description,
			FunctionName: $config.FunctionName,
			Handler: $config.Handler,
			MemorySize: $config.MemorySize,
			Publish: true,
			Role: $config.Role,
			Runtime: $config.Runtime || 'nodejs10.x',
			Timeout: $config.Timeout,
			Environment: $config.Environment,
			Layers: $config.Layers || [],
			Tags: $config.Tags,
			//VpcConfig: {}
		};

		// remove temp file
		fs.unlinkSync( tmpfile )

		lambdaV2.createFunction( paramsV2, function( err ) {
			if ( err && err.code !== 'ResourceConflictException') {
				console.log("ERROR:", err )
				if ( _this.settings.exitOnError !== false )
					process.exit(-1);

				return
			}

			if ( err && err.code === 'ResourceConflictException') {

				// console.log("function exists, should update config and code")
				var paramsV2 = {
					Description: $config.Description,
					FunctionName: $config.FunctionName,
					Handler: $config.Handler,
					MemorySize: $config.MemorySize,
					Role: $config.Role,
					Runtime: $config.Runtime || 'nodejs10.x',
					Timeout: $config.Timeout,
					Environment: $config.Environment,
					Layers: $config.Layers || [],
					//Tags: $config.Tags,
					//VpcConfig: {}
				};

				// interesting: tags not supported by updateFunctionConfiguration but it will remve tags
				lambdaV2.updateFunctionConfiguration(paramsV2, function(err, data) {
					if ( err) {
						console.log("ERROR:", err )
						if ( _this.settings.exitOnError !== false )
							process.exit(-1)

						return;
					}

					var paramsV2 = {
						FunctionName: $config.FunctionName,
						//DryRun: true || false,
						Publish: true,
						// RevisionId: 'STRING_VALUE',
						ZipFile: buffer,
					};
					lambdaV2.updateFunctionCode(paramsV2, function( err ) {
						if ( err) {
							console.log("ERROR:", err )
							if ( _this.settings.exitOnError !== false )
								process.exit(-1)
							return;
						}

						// lambdaV2.listTags({ Resource: data.FunctionArn }, function(err, data) {
						// 	console.log( err, data )
						// });

						// lambdaV2.listTags({ Resource: data.FunctionArn }, function(err, data) {
						// 	console.log( err, data )
						// });

						if (Object.keys($config.Tags).length) {
							lambdaV2.tagResource({ Resource: data.FunctionArn, Tags: $config.Tags }, function( err ) {
								if (err) console.log("WARNING: tagResource failed on function ", $config.FunctionName )
								console.log( "Deployed!" );
							});

							return;
						}

						// @todo: listTags, diff with $config.Tags, untagResource not in $config.Tags, tagResource with $config.Tags
						console.log( "Deployed!" );
						return;
					});


				})
				return;
			}
			console.log( "Deployed!" );
		});


	} );
}

Lambda.prototype.delete = function( program ) {
	var aws = require( "aws-sdk" )

	if (program.substr(-7) === '.lambda')
		program = program.substr(0,program.length - 7)

	var config_file = program + '.lambda'
	if ( !fs.existsSync( config_file ) ) {
		console.log('Lambda config not found (' + program + '.lambda )')
		process.exit(-1)
	}

	try {
		//var $config = JSON.parse(fs.readFileSync( config_file, "utf8"))
		var $config = yaml.safeLoad(fs.readFileSync( config_file, "utf8"), {
			schema: buildYamlSchema(),
			onWarning: function(warning) {
				console.error(warning);
			},
			json: true,
		})
	} catch (e) {
		console.log('Invalid config file (' + program + '.lambda )', e )
		process.exit(-1)
	}

	if (
		(typeof $config.AWS_KEY === "object") &&
		Object.prototype.hasOwnProperty.call( $config.AWS_KEY , 'Ref') &&
		(typeof $config.AWS_KEY.Ref === "string") &&
		($config.AWS_KEY.Ref.indexOf('env.') === 0)
	)
		$config.AWS_KEY = process.env[ $config.AWS_KEY.Ref.split('env.')[1] ]

	if (
		(typeof $config.AWS_SECRET === "object") &&
		Object.prototype.hasOwnProperty.call( $config.AWS_SECRET , 'Ref') &&
		(typeof $config.AWS_SECRET.Ref === "string") &&
		($config.AWS_SECRET.Ref.indexOf('env.') === 0)
	)
		$config.AWS_SECRET = process.env[ $config.AWS_SECRET.Ref.split('env.')[1] ]


	if (
		(typeof $config.Role === "object") &&
		Object.prototype.hasOwnProperty.call( $config.Role , 'Ref') &&
		(typeof $config.Role.Ref === "string") &&
		($config.Role.Ref.indexOf('env.') === 0)
	)
		$config.Role = process.env[ $config.Role.Ref.split('env.')[1] ]


	aws.config.update({
		accessKeyId: $config.AWS_KEY,
		secretAccessKey: $config.AWS_SECRET,
		region: $config.AWS_REGION
	})

	if (!$config.FunctionName)
		$config.FunctionName = program.split('/').slice(-1)[0]

	var lambdaV2 = new aws.Lambda( { apiVersion: "2015-03-31" } )


	lambdaV2.deleteFunction({ FunctionName: $config.FunctionName }, function( err ) {
		if ( err && err.code !== 'ResourceNotFoundException') {
			console.log("delete error:", err )
			process.exit(-1)
		}

		if ( err &&  err.code === 'ResourceNotFoundException')
			console.log("WARNING: deleteFunction ",$config.FunctionName,": ResourceNotFoundException " )
		else
			console.log( "Deleted!" );
	});
}


Lambda.prototype.invoke = function( program ) {
	var aws = require( "aws-sdk" )

	if (program.substr(-7) === '.lambda')
		program = program.substr(0,program.length - 7)

	var config_file = program + '.lambda'
	if ( !fs.existsSync( config_file ) ) {
		console.log('Lambda config not found (' + program + '.lambda )')
		process.exit(-1)
	}

	try {
		//var $config = JSON.parse(fs.readFileSync( config_file, "utf8"))
		var $config = yaml.safeLoad(fs.readFileSync( config_file, "utf8"), {
			schema: buildYamlSchema(),
			onWarning: function(warning) {
				console.error(warning);
			},
			json: true,
		})
	} catch (e) {
		console.log('Invalid config file (' + program + '.lambda )', e )
		process.exit(-1)
	}

	if (
		(typeof $config.AWS_KEY === "object") &&
		Object.prototype.hasOwnProperty.call( $config.AWS_KEY , 'Ref') &&
		(typeof $config.AWS_KEY.Ref === "string") &&
		($config.AWS_KEY.Ref.indexOf('env.') === 0)
	)
		$config.AWS_KEY = process.env[ $config.AWS_KEY.Ref.split('env.')[1] ]

	if (
		(typeof $config.AWS_SECRET === "object") &&
		Object.prototype.hasOwnProperty.call( $config.AWS_SECRET , 'Ref') &&
		(typeof $config.AWS_SECRET.Ref === "string") &&
		($config.AWS_SECRET.Ref.indexOf('env.') === 0)
	)
		$config.AWS_SECRET = process.env[ $config.AWS_SECRET.Ref.split('env.')[1] ]


	if (
		(typeof $config.Role === "object") &&
		Object.prototype.hasOwnProperty.call( $config.Role , 'Ref') &&
		(typeof $config.Role.Ref === "string") &&
		($config.Role.Ref.indexOf('env.') === 0)
	)
		$config.Role = process.env[ $config.Role.Ref.split('env.')[1] ]


	aws.config.update({
		accessKeyId: $config.AWS_KEY,
		secretAccessKey: $config.AWS_SECRET,
		region: $config.AWS_REGION
	})

	if (!$config.FunctionName)
		$config.FunctionName = program.split('/').slice(-1)[0]


	var lambdaV2 = new aws.Lambda( { apiVersion: "2015-03-31" } )


	var paramsV2 = {
		FunctionName: $config.FunctionName,
		//ClientContext: 'STRING_VALUE',
		InvocationType:'RequestResponse',
		LogType: 'Tail',
		Payload: JSON.stringify({}),
	};
	lambdaV2.invoke(paramsV2, function(err, data) {
		if ( err ) {
			console.log("invoke error:", err )
			process.exit(-1)
		}
		try {
			console.log(JSON.stringify(JSON.parse(data.Payload), null, "\t"))
		} catch(e) {}
		console.log("------------")
		console.log( Buffer.from( data.LogResult, 'base64').toString() )
	});
}

Lambda.prototype.start = function( program ) {

	var l = new Lambda( { exitOnError: false } )
	var config = l._parse_config_file( program )
	var config_path = path.resolve( program );

	var cwd = process.cwd()
	var wp = new Watchpack({
		aggregateTimeout: 3000, // wait 1 quiet sec then fire agregated
		//mfollowSymlinks: true,
		ignored: "**/.git",
		// poll: true,
		// poll: true, undefined=native, true=default, 3000=ms
	});


	console.log("---|", ( process.env.AWSPILOT_DOCKER_WORKDIR ? 'DOCKER' : 'LOCAL' ) ,new Date().toISOString() )
	try {
		l.deploy( program )
	} catch (e) { console.log(e) }

	var files = [config_path]
	var folders = [config.PATH]

	if (process.env.AWSPILOT_DOCKER_WORKDIR) {
		files = []
		folders = [config.PATH, path.dirname(config_path) ]
	}

	wp.watch({
		files: files,
		directories: folders,
		//missing: listOfNotExistingItems,
		startTime: Date.now() - 10000
	});

	//wp.watch([program], [config.PATH], Date.now() - 10000);


	// wp.on("change", function(filePath, explanation) {
	// 	console.log("filePath change", filePath, explanation )
	// });
	// wp.on("remove", function(filePath, explanation) {
	// 	console.log("filePath remove", filePath, explanation )
	// });
	wp.on("aggregated", function( changes, removals ) {
		console.log("\n---|", ( process.env.AWSPILOT_DOCKER_WORKDIR ? 'DOCKER' : 'LOCAL' ), new Date().toISOString() )

		//console.log("changes", typeof changes, changes)
		Array.from(changes).map(function(filePath) {
			console.log("---| * ", filePath )
		})
		Array.from(removals).map(function(filePath) {
			console.log("---| - ", filePath )
		})

		try {
			process.chdir(cwd)
			l.deploy( program )
		} catch (e) { console.log(e) }
	});
}

Lambda.prototype.start_docker = function( program ) {

	var l = new Lambda( { exitOnError: true } )
	var config = l._parse_config_file( program )
	//console.log( config )

	var envs = []
	Object.keys(l.envs).map(function(env_k) {
		envs.push('-e')
		envs.push(env_k + '=' + l.envs[env_k] )
	})
	//console.log( l.envs )
	//console.log( envs )
	var config_path = path.resolve( program );


	spawn('docker',
		[
			'run',
			'-it',
			'--rm',
			'-v', config_path + ':' + config_path,
			'-v', config.PATH + ':' + config.PATH,
			'-e', 'AWSPILOT_DOCKER_WORKDIR='+path.dirname(config_path)+'/',
			'-e', 'AWSPILOT_LAMBDA_CONFIG=' + config_path.slice(path.dirname(config_path).length+1) ,
		]
		.concat( envs )
		.concat([
			'awspilotdev/lambda_deploy_nodejs8.10',
			//'sh'
		])

	, {stdio: [process.stdin, process.stdout, process.stderr]});
}

module.exports = new Lambda( );
