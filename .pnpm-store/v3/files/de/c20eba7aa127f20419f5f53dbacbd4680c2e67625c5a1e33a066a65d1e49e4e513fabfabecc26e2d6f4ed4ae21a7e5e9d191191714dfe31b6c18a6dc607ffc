# Shareable Configs

Shareable configs are configurations that you can use and extend from. They can be useful for using the same base configuration in all your projects or for basing your configuration from a well-known one.

To use a shareable config, you have to add it to your Solhint configuration:

```
  "extends": ["solhint:recommended", "protofire"]
```

This example shows the two kind of shareable configs that you can use: the ones included with Solhint, that start with `solhint:`, and the ones that you can install from npm. The latter are packages that are prefixed with `solhint-config-`, so in this case the package would be installed doing `npm install solhint-config-protofire` but used as just `protofire` when adding it.

## Creating your own shareable config

Shareable configs are regular npm packages. There are only two conditions:

- The name of the package must start with `solhint-config-`
- The package must export a regular object with the same structure as a regular configuration object (i.e. the one in your `.solhint.json`).

For example, a very minimal `index.js` in this package could be:

```javascript
module.exports = {
  rules: {
    'max-line-length': 80
  }
}
```

After creating this package you can publish it to npm to make it available for everyone.
