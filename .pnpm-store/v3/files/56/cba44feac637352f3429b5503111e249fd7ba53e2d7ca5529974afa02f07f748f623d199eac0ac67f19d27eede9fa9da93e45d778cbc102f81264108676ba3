⛔️ DEPRECATED: This module has been superseded by the [multiformats](https://github.com/multiformats/js-multiformats) module <!-- omit in toc -->

js-multibase <!-- omit in toc -->
============

[![pl](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](https://protocol.ai)
[![project](https://img.shields.io/badge/project-multiformats-blue.svg?style=flat-square)](https://github.com/multiformats/multiformats)
[![irc](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](https://webchat.freenode.net/?channels=%23ipfs)
[![codecov](https://img.shields.io/codecov/c/github/multiformats/js-multibase.svg?style=flat-square)](https://codecov.io/gh/multiformats/js-multibase)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/multiformats/js-multibase/ci?label=ci&style=flat-square)](https://github.com/multiformats/js-multibase/actions?query=branch%3Amaster+workflow%3Aci+)

> JavaScript implementation of the [multibase](https://github.com/multiformats/multibase) specification

## Lead Maintainer <!-- omit in toc -->

[Hugo Dias](https://github.com/hugomrdias)

## Table of Contents <!-- omit in toc -->

- [Install](#install)
  - [NPM](#npm)
  - [Browser through `<script>` tag](#browser-through-script-tag)
- [Usage](#usage)
  - [Example](#example)
- [API](#api)
- [Contribute](#contribute)
- [License](#license)

## Install

### NPM

```sh
$ npm install --save multibase
```

### Browser through `<script>` tag

Loading this module through a script tag will make the `Multibase` obj available in the global namespace.

```html
<script src="https://unpkg.com/multibase/dist/index.min.js"></script>
```

## Usage

### Example

```JavaScript
const multibase = require('multibase')

const bytes = multibase.encode('base58btc', new TextEncoder().encode('hey, how is it going'))

const decodedBytes = multibase.decode(bytes)
console.log(decodedBytes.toString())
// hey, how is it going
```

## API
https://multiformats.github.io/js-multibase/

## Contribute

Contributions welcome. Please check out [the issues](https://github.com/multiformats/js-multibase/issues).

Check out our [contributing document](https://github.com/multiformats/multiformats/blob/master/contributing.md) for more information on how we work, and about contributing in general. Please be aware that all interactions related to multiformats are subject to the IPFS [Code of Conduct](https://github.com/ipfs/community/blob/master/code-of-conduct.md).

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

[MIT](LICENSE) © Protocol Labs Inc.
