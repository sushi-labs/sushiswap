---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "code-complexity | Solhint"
date:        "Wed, 19 Feb 2020 23:51:46 GMT"
author:      "Franco Victorio <victorio.franco@gmail.com>"
---

# code-complexity
![Category Badge](https://img.shields.io/badge/-Best%20Practise%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)

## Description
Function has cyclomatic complexity "current" but allowed no more than maxcompl.

## Options
This rule accepts an array of options:

| Index | Description                                           | Default Value |
| ----- | ----------------------------------------------------- | ------------- |
| 0     | Rule severity. Must be one of "error", "warn", "off". | warn          |
| 1     | Maximum allowed cyclomatic complexity                 | 7             |


### Example Config
```json
{
  "rules": {
    "code-complexity": ["warn",7]
  }
}
```


## Examples
### 👍 Examples of **correct** code for this rule

#### Low code complexity

```solidity
 if (a > b) {                   
   if (b > c) {                 
     if (c > d) {               
     }                          
   }                            
 }                              
for (i = 0; i < b; i += 1) { }  
do { d++; } while (b > c);       
while (d > e) { }               
```

### 👎 Examples of **incorrect** code for this rule

#### High code complexity

```solidity
 if (a > b) {                   
   if (b > c) {                 
     if (c > d) {               
       if (d > e) {             
       } else {                 
       }                        
     }                          
   }                            
 }                              
for (i = 0; i < b; i += 1) { }  
do { d++; } while (b > c);       
while (d > e) { }               
```

## Version
This rule was introduced in [Solhint 1.1.5](https://github.com/protofire/solhint/tree/v1.1.5)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/best-practises/code-complexity.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/best-practises/code-complexity.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/best-practises/code-complexity.js)
