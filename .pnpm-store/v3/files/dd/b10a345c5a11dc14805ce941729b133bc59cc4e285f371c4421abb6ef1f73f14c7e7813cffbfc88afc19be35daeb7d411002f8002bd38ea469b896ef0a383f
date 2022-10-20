---
layout:      default
title:       Solhint Project Structure
date:        2019-08-27 16:11:00 +0000
author:      "@think-in-universe"
description: Introduction of the structure of the project, how it works, and how to add new rules, etc.
---


# Architecture

This document is for developers who want to understand the structure and mechanisms of this project, and how to contribute.


## Project Structure

The file structure below describes the major structure of the project.

```
├── docs                                 # documentation
├── lib                                  # main source code
│   ├── comment-directive-parser.js      # comment parsers
│   ├── common                           # utility modules for syntax parsing, reporting, etc.
│   ├── config                           # helpers for loading solhint configuration
│   ├── config.js                        # load config
│   ├── doc                              # documentation utilities
│   ├── grammar                          # solidity grammar, generated with ANTLR
│   ├── index.js                         # main entry point
│   ├── load-rules.js                    # module for loading rules
│   ├── reporter.js                      # module for reporting results
│   ├── rules                            # source for solhint rules
│   └── tree-listener.js                 # used for register all loaded rules
├── scripts                              # script for generating grammar and rule docs
├── solhint.js                           # solhint command line
├── solidity-antlr4                      # git submodule for solidity-antlr4
└── test                                 # tests
```

## How solhint Works

### Solidity Grammar with ANTLR

Solhint depends on [ANTLR4](http://www.antlr.org/) to generate the Solidity parser, following the grammar description taken from
[solidity-antlr4](https://github.com/solidityj/solidity-antlr4).

To update the Solidity grammar, you need to update the Git submodule solidity-antlr4:

```sh
git submodule update --remote # update to latest version
# or checkout a specific commit or tag:
# cd solidity-antlr4
# git checkout abc123
```

Then run `scripts/build-grammar.sh`. (Java Runtime Environment 7, or later, is required for running the script.)

### How to Add A New Rule

The Solhint rules in `lib/rules` contains the different lint requirements, such as naming, best practices, security, etc.

The rules are implemented with a [visitor pattern](https://en.wikipedia.org/wiki/Visitor_pattern). You can extend the `BaseChecker` class with the `ruleId` and `meta` fields to define a rule, and implement methods that are called when a node in the AST is entered or exited. The constructor accepts a reporter and a config, and `ruleId` field is present in the object. This `ruleId` is the one that will be used to activate and configure the rule.

For example, `lib/rules/align/indent.js`:

```javascript

const ruleId = 'indent'
const DEFAULT_SEVERITY = 'error'
const DEFAULT_INDENTS = 4
const meta = {
  type: 'align',

  docs: {
    // ...
  },

  isDefault: true,
  recommended: true,
  defaultSetup: [DEFAULT_SEVERITY, DEFAULT_INDENTS],

  schema: [
    {
      type: 'array',
      items: [{ type: 'integer' }],
      uniqueItems: true,
      minItems: 2
    }
  ]
}

class IndentChecker {
  constructor(reporter, config) {
    this.reporter = reporter
    this.ruleId = ruleId
    this.meta = meta
    this.linesWithError = []

    const indent = this.parseConfig(config).indent || 4
    const indentUnit = this.parseConfig(config).unit || 'spaces'

    this.blockValidator = new BlockValidator(indent, indentUnit, reporter, this.ruleId)

    // ...
  }

  enterBlock(ctx) {
    this.blockValidator.validateBlock(ctx)
  }

  enterContractDefinition(ctx) {
    this.blockValidator.validateBlock(ctx)
  }

  enterStructDefinition(ctx) {
    this.blockValidator.validateBlock(ctx)
  }

  enterEnumDefinition(ctx) {
    this.blockValidator.validateBlock(ctx)
  }

  enterImportDirective(ctx) {
    this.blockValidator.validateBlock(ctx)
  }

```

Developers of new rules need to have a basic understanding about the concepts and structure of the AST, and execute the proper logic when certain nodes in the AST are visited.

You can see a list of the available AST nodes in the [solidity-antlr4](https://github.com/solidityj/solidity-antlr4/blob/master/Solidity.g4) project.


### How to Add a Plugin

You can write your own plugins to add new rules to Solhint. A plugin is just an npm packages that exports an array of new rules. The name of the package has to follow the naming convention of `solhint-plugin-<plugin-name>`.

Read [this document](https://github.com/protofire/solhint/blob/master/docs/writing-plugins.md) to learn more about writing plugins.


### How to Add Shared Configuration

Shareable configs are configurations that you can use and extend from. They can be useful for using the same base configuration in all your projects or for basing your configuration from a well-known one.

You can either use a shared configuration from `solhint` or from a npm package with the naming convention `solhint-config-<config-name>`.

Read [this document](https://github.com/protofire/solhint/blob/master/docs/shareable-configs.md) to learn more about shared configurations.


## How to Contribute

Solhint is an open source project, and you can follow the [instructions here](https://github.com/protofire/solhint/blob/master/docs/contributing.md) to contribute.

Thanks for your contribution to Solhint.

### Update Rules Doc

To update the rules docs after adding new rules, run one of the commands below:

- Update all rule docs and rule index pages

`./scripts/generate-rule-docs.js or npm run docs`

- Update rule doc for specific rule

`./scripts/generate-rule-docs.js --rule-id no-spaces-before-semicolon or npm run docs -- --rule-id no-spaces-before-semicolon`
