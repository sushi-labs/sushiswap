# And

> Join arrays with commas and »and« before the last item

[![Build Status](https://travis-ci.org/rasshofer/and.svg)](https://travis-ci.org/rasshofer/and)
[![Coverage Status](https://coveralls.io/repos/github/rasshofer/and/badge.svg)](https://coveralls.io/github/rasshofer/and)
[![Dependency Status](https://david-dm.org/rasshofer/and/status.svg)](https://david-dm.org/rasshofer/and)
[![Dependency Status](https://david-dm.org/rasshofer/and/dev-status.svg)](https://david-dm.org/rasshofer/and)

## Installation

```shell
npm install and
```

## Usage

```js
const and = require('and');

console.log(and(['John', 'Frank', 'Jimmy'])); // = 'John, Frank & Jimmy'

console.log(and(['John', 'Frank'])); // = 'John & Frank'

console.log(and(['Frank'])); // = 'Frank'

console.log(and(['John', 'Frank', 'Jimmy'], 'and')); // = 'John, Frank and Jimmy'

console.log(and(['John', 'Frank', 'Jimmy'], 'or')); // = 'John, Frank or Jimmy'

console.log(and(['John', 'Frank', 'Jimmy'], 'and', true)); // = 'John, Frank, and Jimmy'
```

## API

`and` accepts the following three parameters.

### `data`

Input data.

Example: `['John', 'Frank', 'Jimmy']`

### `separator`

The separator to be used for the last item.

Example: `and`

Default: `&` (= language-independent)

### `oxfordComma`

Use oxford comma in front of the last separator?

Example: `true` (= `'John, Frank, and Jimmy'`)

Default: `false` (= `'John, Frank and Jimmy'`)

## Changelog

* 0.0.3
  * Fix oxford comma for <3 items
* 0.0.2
  * Fix README
* 0.0.1
  * Initial version

## License

Copyright (c) 2018 [Thomas Rasshofer](http://thomasrasshofer.com/)  
Licensed under the MIT license.

See LICENSE for more info.
