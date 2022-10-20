# ![Itty Router][logo-image]

[![npm package][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Open Issues][issues-image]][issues-url]
<a href="https://github.com/kwhitley/itty-router-extras" target="\_parent">
  <img alt="" src="https://img.shields.io/github/stars/kwhitley/itty-router-extras.svg?style=social&label=Star" />
</a>
<a href="https://twitter.com/kevinrwhitley" target="\_parent">
  <img alt="" src="https://img.shields.io/twitter/follow/kevinrwhitley.svg?style=social&label=Follow" />
</a>

An assortment of delicious (yet lightweight and tree-shakeable) extras for the calorie-light [itty-router](https://www.npmjs.com/package/itty-router).  These further simplify routing code!

#### DISCLAIMER: This package is in draft-mode, so the functionality and API may change over the next week or so until we solidify and release a v1.x.  Then it should remain stable for the foreseeable future!

## Installation

```
npm install itty-router itty-router-extras
```

# Includes the following:

### class
- **[StatusError](#statuserror)** - throw these to control HTTP status codes that itty responds with.

### middleware (add inline as route handlers)
- **[withContent](#withcontent)** - safely parses and embeds content request bodies (e.g. text/json) as `request.content`
- **[withCookies](#withcookies)** - embeds cookies into request as `request.cookies` (object)
- **[withParams](#withparams)** - embeds route params directly into request as a convenience

### response
- **[error](#error)** - returns JSON-formatted Response with `{ error: message, status }` and the matching status code on the response.
- **[json](#json)** - returns JSON-formatted Response with options passed to the Response (e.g. headers, status, etc)
- **[missing](#missing)** - returns JSON-formatted 404 Response with `{ error: message, status: 404 }`
- **[status](#status)** - returns JSON-formatted Response with `{ message, status }` and the matching status code on the response.
- **[text](#text)** - returns plaintext-formatted Response with options passed to the Response (e.g. headers, status, etc). This is simply a normal Response, but included for code-consistency with `json()`

### routers
- **[ThrowableRouter](#throwablerouter)** - this is anauto-magic convenience wrapper around [itty-router](https://www.npmjs.com/package/itty-router) that simply adds automatic exception handling (with automatic response), rather than requiring `try/catch` blocks within your middleware/handlers, or manually calling a `.catch(error)` on the `router.handle`. Use this if you don't need to intercept errors for logging - otherwise, [use itty core Router with .catch()].(#advanced-error-handling).

## Example
```js
import {
  json,
  missing,
  error,
  status,
  withContent,
  withParams,
  ThrowableRouter,
} from 'itty-router-extras'

const todos = [
  { id: '13', value: 'foo' },
  { id: '14', value: 'bar' },
  { id: '15', value: 'baz' },
]

// create an error-safe itty router
const router = ThrowableRouter({ base: '/todos' })

// GET collection index
router.get('/', () => json(todos))

// GET item
router.get('/:id', withParams, ({ id }) => {
  const todo = todos.find(t => t.id === Number(id))

  return todo
  ? json(todo)
  : missing('That todo was not found.')
})

// POST to the collection
router.post('/', withContent, ({ content }) =>
  content
  ? status(204) // send a 204 no-content response
  : error(400, 'You probably need some content for that...')
)

// 404 for everything else
router.all('*', () => missing('Are you sure about that?'))

// attach the router "handle" to the event handler
addEventListener('fetch', event =>
  event.respondWith(router.handle(event.request))
)
```

# API

### Classes

##### `StatusError(status: number, message: string): Error` <a id="statuserror"></a>
Throw these to control HTTP status codes that itty responds with.
```js
import { ThrowableRouter, StatusError } from 'itty-router-extras'

router.get('/bad', () => {
  throw new StatusError(400, 'Bad Request')
})

// GET /bad
400 {
  error: 'Bad Request',
  status: 400
}
```

### Middleware

##### `withContent: function` <a id="withcontent"></a>
Safely parses and embeds content request bodies (e.g. text/json) as `request.content`.
```js
import { ThrowableRouter, StatusError } from 'itty-router-extras'

const router = ThrowableRouter()

router
  .post('/form', withContent, ({ content }) => {
    // body content (json, text, or form) is parsed and ready to go, if found.
  })
  .post('/otherwise', async request => {
    try {
      const content = await request.json()

      // do something with the content
    } catch (err) {
      throw new StatusError(400, 'Bad Request')
    }
  })
```

##### `withCookies: function` <a id="withcookies"></a>
Embeds cookies into request as `request.cookies` (object).
```js
import { withCookies } from 'itty-router-extras'

router.get('/foo', withCookies, ({ cookies }) => {
  // cookies are parsed from the header into request.cookies
})
```

##### `withParams: function` <a id="withparams"></a>
Embeds route params directly into request as a convenience.  *NOTE: `withParams` cannot be applied globally upstream, as it will have seen no route params at this stage (to spread into the request).*
```js
import { withParams } from 'itty-router-extras'

router
  .get('/:collection/:id?', withParams, ({ collection, id }) => {
    // route params are embedded into the request for convenience
  })
  .get('/otherwise/:collection/:id?', ({ params }) => {
    // this just saves having to extract params from the request.params object
    const { collection, id } = params
  })
```

### Response


##### `error(status: number, message?: string): Response` <a id="error"></a>
##### `error(status: number, payload?: object): Response`
Returns JSON-formatted Response with `{ error: message, status }` (or custom payload) and the matching status code on the response.
```js
import { error, json } from 'itty-router-extras'

router.get('/secrets', request =>
  request.isLoggedIn
  ? json({ my: 'secrets' })
  : error(401, 'Not Authenticated')
)

// GET /secrets -->
401 {
  error: 'Not Authenticated',
  status: 401
}

// custom payloads...
error(500, { custom: 'payload' }) -->
500 {
  custom: 'payload'
}
```

##### `json(content: object, options?: object): Response` <a id="json"></a>
Returns JSON-formatted Response with options passed to the Response (e.g. headers, status, etc).
```js
const todos = [
  { id: 1, text: 'foo' },
  { id: 2, text: 'bar' },
]

router.get('/todos', () => json(todos))
```

##### `missing(message?: string): Response` <a id="missing"></a>
##### `missing(payload?: object): Response`
```js
router
  .get('/not-found', () => missing('Oops!  We could not find that page.'))
  .get('/custom-not-found', () => missing({ message: 'Are you sure about that?' }))

// GET /not-found -->
404 {
  error: 'Oops!  We could not find that page.',
  status: 404
}

// GET /custom-not-found -->
404 {
  message: 'Are you sure about that?'
}
```

##### `status(status: number, message?: string): Response` <a id="status"></a>
##### `status(status: number, payload?: object): Response`
Returns JSON-formatted Response with `{ message, status }` and the matching status code on the response.
```js
router
  .post('/silent-success', withContent, ({ content }) => status(204))
  .post('/success', withContent, ({ content }) => status(201, 'Created!'))
  .post('/custom-success', withContent, ({ content }) => status(201, { created: 'Todo#1' }))

// POST /silent-success -->
204

// POST /success -->
201 {
  message: 'Created!',
  status: 201
}

// POST /custom-success -->
201 {
  created: 'Todo#1'
}
```

##### `text(content: string, options?: object): Response` <a id="text"></a>
Returns plaintext-formatted Response with options passed to the Response (e.g. headers, status, etc). This is simply a normal Response, but included for code-consistency with `json()`.
```js
router.get('/plaintext', () => text('OK!'))

// GET /plaintext -->
200 OK!
```

### Routers

#### `ThrowableRouter(options?: object): Proxy` <a id="throwablerouter"></a>
This is a convenience wrapper around [itty-router](https://www.npmjs.com/package/itty-router) that simply adds automatic exception handling (with automatic response), rather than requiring `try/catch` blocks within your middleware/handlers, or manually calling a `.catch(error)` on the `router.handle`. **For more elaborate error handling, such as logging errors before a response, [use the core Router from itty-router (see example)](#advanced-error-handling).**
```js
import { ThrowableRouter, StatusError } from 'itty-router-extras'

const router = ThrowableRouter()

router
  .get('/accidental', request => request.oops.this.doesnt.exist)
  .get('/intentional', request => {
    throw new StatusError(400, 'Bad Request')
  })

exports default {
  fetch: router.handle
}

// GET /accidental
500 {
  error: 'Internal Error.',
  status: 500,
}

// GET /intentional
400 {
  error: 'Bad Request',
  status: 400,
}
```

Adding stack traces via `{ stack: true }`:
```js
import { ThrowableRouter } from 'itty-router-extras'

const router = ThrowableRouter({ stack: true })

router
  .get('/accidental', request => request.oops.this.doesnt.exist)

exports default {
  fetch: router.handle
}

// GET /accidental
500 {
  error: 'Cannot find "this" of undefined...',
  stack: 'Cannot find "this" of undefined blah blah blah on line 6...',
  status: 500,
}
```

### Advanced Error Handling
Once you need to control more elaborate error handling, simply ditch `ThrowableRouter` (because it will catch and respond before you can), and add your own `.catch(err)` to the core itty `Router` as follows:
```js
import { Router } from 'itty-router'
import { error } from 'itty-router-extras'
import { logTheErrorSomewhere } from 'some-other-repo'

const router = Router()

router
  .get('/accidental', request => request.oops.this.doesnt.exist)

exports default {
  fetch: (request, ...args) => router
                                 .handle(request, ...args)
                                 .catch(async err => {
                                   // do something fancy with the error
                                   await logTheErrorSomewhere({
                                     url: request.url,
                                     error: err.message,
                                   })

                                   // then return an error response to the user/request
                                   return error(500, 'Internal Serverless Error')
                                 })
}

// GET /accidental
500 {
  error: 'Internal Serverless Error',
  status: 500,
}
```

[twitter-image]:https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fitty-router-extras
[logo-image]:https://user-images.githubusercontent.com/865416/112549341-a4377300-8d8b-11eb-8977-574967dede99.png
[gzip-image]:https://img.shields.io/bundlephobia/minzip/itty-router-extras
[gzip-url]:https://bundlephobia.com/result?p=itty-router-extras
[issues-image]:https://img.shields.io/github/issues/kwhitley/itty-router-extras
[issues-url]:https://github.com/kwhitley/itty-router-extras/issues
[npm-image]:https://img.shields.io/npm/v/itty-router-extras.svg
[npm-url]:http://npmjs.org/package/itty-router-extras
[travis-image]:https://travis-ci.org/kwhitley/itty-router-extras.svg?branch=v0.x
[travis-url]:https://travis-ci.org/kwhitley/itty-router-extras
[david-image]:https://david-dm.org/kwhitley/itty-router-extras/status.svg
[david-url]:https://david-dm.org/kwhitley/itty-router-extras
[coveralls-image]:https://coveralls.io/repos/github/kwhitley/itty-router-extras/badge.svg?branch=v0.x
[coveralls-url]:https://coveralls.io/github/kwhitley/itty-router-extras?branch=v0.x

## Contributors
These folks are the real heroes, making open source the powerhouse that it is!  Help out and get your name added to this list! <3

#### Core, Concepts, and Codebase
- [@mvasigh](https://github.com/mvasigh) - for constantly discussing these ridiculously-in-the-weeds topics with me.  And then for writing the TS interfaces (or simply re-writing in TS), right Mehdi??

#### Fixes & Docs
- [@rubnogueira](https://github.com/rubnogueira)
