---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "reason-string | Solhint"
date:        "Wed, 19 Feb 2020 23:51:48 GMT"
author:      "Franco Victorio <victorio.franco@gmail.com>"
---

# reason-string
![Category Badge](https://img.shields.io/badge/-Best%20Practise%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)

## Description
Require or revert statement must have a reason string and check that each reason string is at most N characters long.

## Options
This rule accepts an array of options:

| Index | Description                                                                                                 | Default Value    |
| ----- | ----------------------------------------------------------------------------------------------------------- | ---------------- |
| 0     | Rule severity. Must be one of "error", "warn", "off".                                                       | warn             |
| 1     | A JSON object with a single property "maxLength" specifying the max number of characters per reason string. | {"maxLength":32} |


### Example Config
```json
{
  "rules": {
    "reason-string": ["warn",{"maxLength":32}]
  }
}
```


## Examples
### 👍 Examples of **correct** code for this rule

#### Require with reason string

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        
        function b() public {
          require(!has(role, account), "Roles: account already has role");
          role.bearer[account] = true;
          role.bearer[account] = true;
        }
    
      }
    
```

### 👎 Examples of **incorrect** code for this rule

#### Require without reason string

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        
        function b() public {
          require(!has(role, account));
          role.bearer[account] = true;
          role.bearer[account] = true;
        }
    
      }
    
```

## Version
This rule was introduced in [Solhint 3.0.0-rc.1](https://github.com/protofire/solhint/tree/v3.0.0-rc.1)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/best-practises/reason-string.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/best-practises/reason-string.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/best-practises/reason-string.js)
