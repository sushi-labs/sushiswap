---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "avoid-low-level-calls | Solhint"
date:        "Wed, 19 Feb 2020 23:51:52 GMT"
author:      "Franco Victorio <victorio.franco@gmail.com>"
---

# avoid-low-level-calls
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Security%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Avoid to use low level calls.

## Options
This rule accepts a string option of rule severity. Must be one of "error", "warn", "off". Default to warn.

### Example Config
```json
{
  "rules": {
    "avoid-low-level-calls": "warn"
  }
}
```


## Examples
### 👎 Examples of **incorrect** code for this rule

#### Using low level calls

```solidity
msg.sender.call(code);
a.callcode(test1);
a.delegatecall(test1);
```

## Version
This rule was introduced in [Solhint 1.1.6](https://github.com/protofire/solhint/tree/v1.1.6)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/security/avoid-low-level-calls.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/security/avoid-low-level-calls.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/security/avoid-low-level-calls.js)
