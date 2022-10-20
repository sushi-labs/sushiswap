[![Build Status](https://secure.travis-ci.org/adaltas/node-http-status.png)](http://travis-ci.org/adaltas/node-http-status)

# HTTP Status codes for Node

Utility to interact with HTTP status codes.

## Usage

Once you require this module, you may call it with either an HTTP code or a message name. With an HTTP code, you will get the message name while with a message name you will get an HTTP code.

### HTTP Status Codes
HTTP code names, messages, and classes are respectively accessible with the property `{code}_NAME`, `{code}_MESSAGE` and `{code}_CLASS`. This includes all statuses in the [IANA HTTP Status Code Registry](https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml), with the only addition being `418 I'm a teapot`.

Extra status code are also made available that are not defined in the IANA registry, but used by popular software. They are grouped by category. Specific properties are exported by `http-status` under the property `extra` followed by the category name. Also, extra codes are merge with regular status codes and made available as modules available inside `http-status/lib/{category}`.

Available categories are:

<dl>
  <dt><code>unofficial</code></dt>
  <dd>This represent a list of codes which are not specified by any standard.</dd>
  <dt><code>iis</code></dt>
  <dd>Microsoft's Internet Information Services (IIS) web server expands the 4xx error class to signal errors with the client's request.</dd>
  <dt><code>nginx</code></dt>
  <dd>The NGINX web server software expands the 4xx error class to signal issues with the client's request.</dd>
  <dt><code>cloudflare</code></dt>
  <dd>Cloudflare's reverse proxy service expands the 5xx error class to signal issues with the origin server.</dd>
</dl>

### HTTP Status Code Classes

In addition to HTTP status codes, this module also contains status code classes under the `classes` property. Similar to HTTP codes, you can access class names and messages with the property `{class}_NAME` and `{class}_MESSAGE`

## API

The API is structured as follows:

```
100
100_NAME
100_MESSAGE
100_CLASS
CONTINUE
101
101_NAME
101_MESSAGE
101_CLASS
SWITCHING_PROTOCOLS
…
classes.
├── 1xx
├── 1xx_NAME
├── 1xx_MESSAGE
├── INFORMATIONAL
├── 2xx
├── 2xx_NAME
├── 2xx_MESSAGE
├── SUCCESSFUL
├── …
extra.
├── unofficial.
│   ├── 103
│   ├── 103_NAME
│   ├── 103_MESSAGE
│   ├── 103_CLASS
│   ├── CHECKPOINT
│   ├── …
├── iis.
│   ├── 440
│   ├── 440_NAME
│   ├── 440_MESSAGE
│   ├── 440_CLASS
│   ├── LOGIN_TIME_OUT
│   ├── …
├── nginx.
│   ├── 444
│   ├── 444_NAME
│   ├── 444_MESSAGE
│   ├── 444_CLASS
│   ├── NO_RESPONSE
│   ├── …
├── cloudflare.
│   ├── 520
│   ├── 520_NAME
│   ├── 520_MESSAGE
│   ├── 520_CLASS
│   ├── UNKNOWN_ERROR
│   ├── …
```

For additional information, please refer to [original code](./src/index.litcoffee).

### Example Usage

```javascript
const status = require('http-status');

console.info(status.INTERNAL_SERVER_ERROR);
// Output: 500

console.info(status[500]);
console.info(status[status.INTERNAL_SERVER_ERROR]);
// Both output: "Internal Server Error"

console.info(status['500_NAME']);
console.info(status[`${status.INTERNAL_SERVER_ERROR}_NAME`]);
// Both output: "INTERNAL_SERVER_ERROR"

console.info(status['500_MESSAGE']);
console.info(status[`${status.INTERNAL_SERVER_ERROR}_MESSAGE`]);
// Both output: "A generic error message, given when an unexpected condition was encountered and no more specific message is suitable."

console.info(status['500_CLASS']);
console.info(status[`${status.INTERNAL_SERVER_ERROR}_CLASS`]);
// Both output: "5xx"
```

### Example using `classes`

```javascript
const status = require('http-status');

const responseCode = status.INTERNAL_SERVER_ERROR;

switch (status[`${responseCode}_CLASS`]) {
  case status.classes.INFORMATIONAL:
    // The responseCode is 1xx
    break;
  case status.classes.SUCCESSFUL:
    // The responseCode is 2xx
    break;
  case status.classes.REDIRECTION:
    // The responseCode is 3xx
    break;
  case status.classes.CLIENT_ERROR:
    // The responseCode is 4xx
    break;
  case status.classes.SERVER_ERROR:
    // The responseCode is 5xx
    break;

  default:
    // Unknown
    break;
}
```

### Example Using `extra` Property

```javascript
// Accessing property from the NGINX category
const status = require('http-status');
console.info(status.extra.nginx.NO_RESPONSE)
// Accessing default HTTP status merged with NGINX status
const status = require('http-status/lib/nginx');
console.info(status.IM_A_TEAPOT);
console.info(status.NO_RESPONSE)
```

### Express Example

```javascript
const express = require('express'),
      redis   = require('redis'),
      status  = require('http-status');
// New Express HTTP server
const app = express.createServer();
// Regster a route
app.get('/', (req, res) => {
  const client = redis.createClient();
  client.ping((err, msg) => {
    if (err) {
      return res.send(status.INTERNAL_SERVER_ERROR);
    }
    res.send(msg, status.OK);
  });
});
// Start the HTTP server
app.listen(3000);
```

## Contributors

- David Worms: <https://github.com/wdavidw>
- Daniel Gasienica: <https://github.com/gasi>
- Rodrigo: <rfsbraz@gmail.com>
- Paul Vollmer: <paul.vollmer@fh-potsdam.de>
- James Barcellano: <https://github.com/ckeboss>

This package is developed by [Adaltas](http://www.adaltas.com).

## Developers

To automatically generate a new version:

```
yarn run release
```

There is currently no CI, copy/paste the code after release. Note, commits and tags are automatically pushed before publishing.

```
npm publish
```
