

# cli-lambda-deploy
Command line tool deploy code to [AWS Lambda](http://aws.amazon.com/lambda/).  


[![npm test](https://github.com/awspilot/cli-lambda-deploy/actions/workflows/test.yml/badge.svg)](https://github.com/awspilot/cli-lambda-deploy/actions/workflows/test.yml)
[![Downloads](https://img.shields.io/npm/dm/aws-lambda?maxAge=2592000)](https://www.npmjs.com/package/aws-lambda)
[![Downloads](https://img.shields.io/npm/dy/aws-lambda?maxAge=2592000)](https://www.npmjs.com/package/aws-lambda)
[![Downloads](https://img.shields.io/npm/dt/aws-lambda?maxAge=2592000)](https://www.npmjs.com/package/aws-lambda)

### Notes

Versions prior to 1.0.5 suffer from "Command Injection" vulnerability,  
thanks [snyk.io](https://snyk.io/vuln) and [Song Li](http://songli.io) of Johns Hopkins University for reporting.

## Installation

```
npm install -g aws-lambda
```

WARN: upgrading to v1.0.0 will remove your function environment and layers if they are not defined in the config file  

## Config file

* PATH must point to your code folder and is relative to the config file  
* PATH can be relative or absolute  
* If not set, Runtime defaults to **nodejs10.x**  
* If not set, FunctionName defaults to the name of the config file ("my-function" in this case)  
* You can use **Ref** to reference environment variables in the form of env.YOUR_ENVIRONMENT_NAME  
* `lambda deploy <file.lambda>` credentials needs permissions to **CreateFunction**, **UpdateFunctionConfiguration** and **UpdateFunctionCode**  
* `lambda delete <file.lambda>` credentials needs permissions to **DeleteFunction**  
* `lambda invoke <file.lambda>` credentials needs permissions to **InvokeFunction**  


## Sample JSON config

```

{
	"PATH": "./test-function",
	"AWS_KEY": { "Ref" : "env.AWS_ACCESS_KEY_ID" },,
	"AWS_SECRET": { "Ref" : "env.AWS_SECRET_ACCESS_KEY"},
	"AWS_REGION": "us-east-1",

	"FunctionName": "test-lambda",
	"Role": "your_amazon_role",
	"Runtime": "nodejs10.x",
	"Handler": "index.handler",
	"MemorySize": "128",
	"Timeout": "3",
	"Environment": {
		"Variables": {
			"Hello": "World",
		}
	},
	"Layers": [
		"arn:aws:lambda:eu-central-1:452980636694:layer:awspilot-dynamodb-2_0_0-beta:1"
	],
	"Tags": {
		"k1": "v1",
		"k2": "v2"
	},
	"Description": ""
}
```

## Sample YAML config

```
# unlike json, comments are allowed in yaml, yey!
# remember to use spaces not tabs 😞
PATH: ./new-function
AWS_KEY:  !Ref "env.lambda_deploy_aws_key"
AWS_SECRET: !Ref "env.lambda_deploy_aws_secret"
AWS_REGION: "eu-central-1"

FunctionName: new-function-v12
Role: "arn:aws:iam::452980636694:role/CliLambdaDeploy-TestRole-1H89NZ845HHBK"
Runtime: "nodejs8.10"
Handler: "index.handler"
MemorySize: "128"
Timeout: "3"
Environment:
    Variables:
        Hello: "World"
Layers:
    - "arn:aws:lambda:eu-central-1:452980636694:layer:awspilot-dynamodb-2_0_0-beta:1"
Tags:
    k1: v1
    k2: v2
Description: ""
```



## Deploy from Local to AWS Lambda

```
// if installed globally then
$ lambda deploy /path/to/my-function.lambda
$ lambda deploy ../configs/my-function.lambda

// if 'npm installed' without the -g then you must use the full path
$ node_modules/.bin/lambda /path/to/my-function.lambda

// you can also add it in your scripts section of your package.json scripts: { "deploy-func1": "lambda deploy ../config/func1.lambda" }
$ npm run deploy-func1
```

## Watch config file

aws-lambda can also watch the config file and the code folder specified in the config.PATH for changes and re-reploy on change

```
$ lambda start ../configs/my-function.lambda
```
