---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "indent | Solhint"
date:        "Wed, 19 Feb 2020 23:51:45 GMT"
author:      "Franco Victorio <victorio.franco@gmail.com>"
---

# indent
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Style%20Guide%20Rules-informational)
![Default Severity Badge error](https://img.shields.io/badge/Default%20Severity-error-red)
> The {"extends": "solhint:default"} property in a configuration file enables this rule.

> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Indentation is incorrect.

## Options
This rule accepts an array of options:

| Index | Description                                           | Default Value |
| ----- | ----------------------------------------------------- | ------------- |
| 0     | Rule severity. Must be one of "error", "warn", "off". | error         |
| 1     | Number of indents                                     | 4             |


### Example Config
```json
{
  "rules": {
    "indent": ["error",4]
  }
}
```


## Examples
### 👍 Examples of **correct** code for this rule

#### Contract with correct indentation

```solidity
contract A {                                       
    function a() public view returns (uint, uint) {
        return (1, 2);                             
    }                                              
                                                   
    function b() public view returns (uint, uint) {
        (                                          
            uint c,                                
            uint d                                 
        ) = a();                                   
        return (c, d);                             
    }                                              
}                                                  
```

### 👎 Examples of **incorrect** code for this rule

#### Contract with incorrect indentation

```solidity
    contract A {        
        uint private a; 
    }                   
```

## Version
This rule was introduced in [Solhint 1.1.5](https://github.com/protofire/solhint/tree/v1.1.5)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/align/indent.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/align/indent.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/align/indent.js)
