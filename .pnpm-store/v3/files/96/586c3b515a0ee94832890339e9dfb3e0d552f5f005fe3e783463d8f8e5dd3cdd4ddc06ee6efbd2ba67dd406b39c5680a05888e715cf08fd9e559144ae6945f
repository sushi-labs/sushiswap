[<img width="200" alt="get in touch with Consensys Diligence" src="https://user-images.githubusercontent.com/2865694/56826101-91dcf380-685b-11e9-937c-af49c2510aa0.png">](https://diligence.consensys.net)<br/>
<sup>
[[  🌐  ](https://diligence.consensys.net/?utm_source=github_npm&utm_medium=banner&utm_campaign=solidity-parser-diligence)  [  📩  ](mailto:diligence@consensys.net)  [  🔥  ](https://consensys.github.io/diligence/)]
</sup><br/><br/>


solidity-parser-diligence
=====================

A Solidity parser built on top of a robust [ANTLR4 grammar](https://github.com/consensys/solidity-antlr4).

Now maintained by the ConsenSys Diligence team! :tada:

You can find this new package in NPM at `solidity-parser-diligence` (https://www.npmjs.com/package/solidity-parser-diligence).

### Usage

```javascript
import parser from 'solidity-parser-diligence';

var input = `
    contract test {
        uint256 a;
        function f() {}
    }
`
try {
    parser.parse(input)
} catch (e) {
    if (e instanceof parser.ParserError) {
        console.log(e.errors)
    }
}
```

The `parse` method also accepts a second argument which lets you specify the
following options, in a style similar to the _esprima_ API:

| Key      | Type    | Default | Description                                                                                                                                                                                          |
|----------|---------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| tolerant | Boolean | false   | When set to `true` it will collect syntax errors and place them in a list under the key `errors` inside the root node of the returned AST. Otherwise, it will raise a `parser.ParserError`.          |
| loc      | Boolean | false   | When set to `true`, it will add location information to each node, with start and stop keys that contain the corresponding line and column numbers. Column numbers start from 0, lines start from 1. |
| range    | Boolean | false   | When set to `true`, it will add range information to each node, which consists of a two-element array with start and stop character indexes in the input.                                            |


#### Example with location information

```javascript
parser.parse('contract test { uint a; }', { loc: true })

// { type: 'SourceUnit',
//   children:
//    [ { type: 'ContractDefinition',
//        name: 'test',
//        baseContracts: [],
//        subNodes: [Array],
//        kind: 'contract',
//        loc: [Object] } ],
//   loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 24 } } }

```

#### Example using a visitor to walk over the AST

```javascript
var ast = parser.parse('contract test { uint a; }')

// output the path of each import found
parser.visit(ast, {
  ImportDirective: function(node) {
    console.log(node.path)
  }
})
```

### Authors

Gonçalo Sá ([@gnsps](https://twitter.com/gnsps))

Federico Bond ([@federicobond](https://github.com/federicobond))

### License

MIT
