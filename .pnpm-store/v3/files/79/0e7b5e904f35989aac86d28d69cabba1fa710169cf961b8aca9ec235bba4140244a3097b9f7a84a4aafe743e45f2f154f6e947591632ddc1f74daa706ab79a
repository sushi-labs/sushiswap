---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "no-spaces-before-semicolon | Solhint"
date:        "Wed, 19 Feb 2020 23:51:45 GMT"
author:      "Franco Victorio <victorio.franco@gmail.com>"
---

# no-spaces-before-semicolon
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Style%20Guide%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Semicolon must not have spaces before.

## Options
This rule accepts a string option of rule severity. Must be one of "error", "warn", "off". Default to warn.

### Example Config
```json
{
  "rules": {
    "no-spaces-before-semicolon": "warn"
  }
}
```


## Examples
### 👍 Examples of **correct** code for this rule

#### Expression with correct semicolon align

```solidity
var (a, b,) = test1.test2(); a + b;
test(1, 2, b);
```

### 👎 Examples of **incorrect** code for this rule

#### Expression with incorrect semicolon align

```solidity
var (a, b) = test1.test2() ; a + b;
test(1, 2, b) ;
test(1, 2, b)/* test */;
for ( ;;) {}
for (i = 0; ;) {}
for ( ; a < b;) {}
```

## Version
This rule was introduced in [Solhint 1.1.5](https://github.com/protofire/solhint/tree/v1.1.5)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/align/no-spaces-before-semicolon.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/align/no-spaces-before-semicolon.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/align/no-spaces-before-semicolon.js)
