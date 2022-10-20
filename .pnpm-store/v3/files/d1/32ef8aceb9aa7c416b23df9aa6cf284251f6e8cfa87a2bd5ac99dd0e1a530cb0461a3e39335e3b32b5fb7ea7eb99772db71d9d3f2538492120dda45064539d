---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "bracket-align | Solhint"
date:        "Wed, 19 Feb 2020 23:51:44 GMT"
author:      "Franco Victorio <victorio.franco@gmail.com>"
---

# bracket-align
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Style%20Guide%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Open bracket must be on same line. It must be indented by other constructions by space.

## Options
This rule accepts a string option of rule severity. Must be one of "error", "warn", "off". Default to warn.

### Example Config
```json
{
  "rules": {
    "bracket-align": "warn"
  }
}
```


## Examples
### 👍 Examples of **correct** code for this rule

#### Correctly aligned function brackets

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        
                function a (
                    uint a
                ) 
                    public  
                {
                  continue;
                }
            
      }
    
```

### 👎 Examples of **incorrect** code for this rule

#### Incorrectly aligned function brackets

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        
                function a (uint a) public{
                  continue;
                }

      }
    
```

## Version
This rule was introduced in [Solhint 2.0.0-alpha.0](https://github.com/protofire/solhint/tree/v2.0.0-alpha.0)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/align/bracket-align.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/align/bracket-align.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/align/bracket-align.js)
