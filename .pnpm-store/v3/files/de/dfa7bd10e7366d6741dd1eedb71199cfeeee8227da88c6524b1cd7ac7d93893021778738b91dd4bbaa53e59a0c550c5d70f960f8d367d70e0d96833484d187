# Writing plugins

You can write your own plugins to add new rules to Solhint. Plugins are just npm packages that export an array of new rules. A plugin can be as simple as:

```javascript
module.exports = [MyNewRule]
```

where `MyNewRule` is a class that implements the rule.

As with shareable configs, there is a convention for the name of these packages: their name has to start with `solhint-plugin-`.

## Structure of a custom rule

A rule is a class that follows two conventions: the constructor accepts a reporter and a config, and `ruleId` field is present in the object. This `ruleId` is the one that will be used to activate and configure the rule. For example:

```javascript
class MyNewRule {
  constructor(reporter, config) {
    this.ruleId = 'my-new-rule'

    this.reporter = reporter
    this.config = config

    ...
  }
```

This is enough for the rule to work but, of course, this will do nothing. Rules are implemented using a visitor pattern: you implement methods that are called when a node in the AST is entered or exited. For example, let's make a rule that forbids naming contracts `Foo`:

```javascript
class NoFoosAllowed {
  constructor(reporter, config) {
    this.ruleId = 'no-foos'

    this.reporter = reporter
    this.config = config
  }

  enterContractDefinition(ctx) {
    const identifier = ctx.children[1]
    const text = identifier.getText()

    if (text === 'Foo') {
      this.reporter.error(ctx, this.ruleId, 'Contracts cannot be named "Foo"')
    }
  }
}
```

_You can see a list of the available AST nodes [here](https://github.com/solidityj/solidity-antlr4/blob/master/Solidity.g4)._

After adding this rule to the exported array, you can publish your package. Remember to prefix the name with `solhint-plugin-`. Let's say our plugin is called `solhint-plugin-naming` and that we already published it and installed it in some project. Then, we can activate this rule in the configuration:

```json
{
  "plugins": ["naming"],
  "rules": {
    "naming/no-foos": "error"
  }
}
```

And that's it! Notice that we have to qualify the rule name when we enable it, but in the rule definition we only set the rule name.
