# ⛔️ DEPRECATED: This module has been superseded by the [multiformats](https://github.com/multiformats/js-multiformats) module <!-- omit in toc -->

# js-multicodec <!-- omit in toc -->

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](https://protocol.ai)
[![](https://img.shields.io/badge/project-multiformats-blue.svg?style=flat-square)](https://github.com/multiformats/multiformats)
[![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](https://webchat.freenode.net/?channels=%23ipfs)
[![](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/multiformats/js-multicodec/ci/master?style=flat-square)
![Codecov](https://img.shields.io/codecov/c/github/multiformats/js-multicodec?style=flat-square)

> JavaScript implementation of the multicodec specification

## Lead Maintainer <!-- omit in toc -->

[Henrique Dias](http://github.com/hacdias)

## Table of Contents <!-- omit in toc -->

- [Install](#install)
- [Usage](#usage)
  - [Example](#example)
  - [API](#api)
- [Updating the lookup table](#updating-the-lookup-table)
- [Contribute](#contribute)
- [License](#license)

## Install

```sh
> npm install multicodec
```

## Usage

### Example

```JavaScript

const multicodec = require('multicodec')

const prefixedProtobuf = multicodec.addPrefix('protobuf', protobufBuffer)
// prefixedProtobuf 0x50...

// The multicodec codec values can be accessed directly:
console.log(multicodec.DAG_CBOR)
// 113

// To get the string representation of a codec, e.g. for error messages:
console.log(multicodec.getNameFromCode(113))
// dag-cbor
```

### API

https://multiformats.github.io/js-multicodec/

[multicodec default table](https://github.com/multiformats/multicodec/blob/master/table.csv)

## Updating the lookup table

Updating the lookup table is done with a script. The source of truth is the
[multicodec default table](https://github.com/multiformats/multicodec/blob/master/table.csv).
Update the table with running:

    npm run update-table

## Contribute

Contributions welcome. Please check out [the issues](https://github.com/multiformats/js-multicodec/issues).

Check out our [contributing document](https://github.com/multiformats/multiformats/blob/master/contributing.md) for more information on how we work, and about contributing in general. Please be aware that all interactions related to multiformats are subject to the IPFS [Code of Conduct](https://github.com/ipfs/community/blob/master/code-of-conduct.md).

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

[MIT](LICENSE) © 2016 Protocol Labs Inc.
