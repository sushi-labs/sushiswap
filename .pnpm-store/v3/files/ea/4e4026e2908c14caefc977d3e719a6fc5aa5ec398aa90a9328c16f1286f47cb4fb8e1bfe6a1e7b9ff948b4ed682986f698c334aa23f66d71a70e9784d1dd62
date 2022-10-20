# WHATWG Node Generic Server Adapter

`@whatwg-node/server` helps you to create a generic server implementation by using WHATWG Fetch API for Node.js, AWS Lambda, Cloudflare Workers, Deno, Express, Fastify, Koa, Next.js and Sveltekit.

Once you create an adapter with `createServerAdapter`, you don't need to install any other platform specific package since the generic adapter will handle it automatically.

## How to start

Let's create a basic Hello World server adapter.

```ts
// myServerAdapter.ts
import { createServerAdapter } from '@whatwg-node/server'

export default createServerAdapter((request: Request) => {
  return new Response(`Hello World!`, { status: 200 })
})
```

## Integrations

You can use your server adapter with the following integrations:

### Node.js

[Node.js](https://nodejs.org/api/http.html) is the most popular server side JavaScript runtime.

```ts
import myServerAdapter from './myServerAdapter'
import { createServer } from 'http'

// You can create your Node server instance by using our adapter
const nodeServer = createServer(myServerAdapter)
// Then start listening on some port
nodeServer.listen(4000)
```

### AWS Lambda

AWS Lambda is a serverless computing platform that makes it easy to build applications that run on the AWS cloud. Our adaoter is platform agnostic so they can fit together easily. In order to reduce the boilerplate we prefer to use [Serverless Express from Vendia](https://github.com/vendia/serverless-express).

```ts
import myServerAdapter from './myServerAdapter'
import type { Handler } from '@aws-cdk/aws-lambda'
import { configure } from '@vendia/serverless-express'

export const handler: Handler = configure({
  app: myServerAdapter
})
```

### Cloudflare Workers

Cloudflare Workers provides a serverless execution environment that allows you to create entirely new applications or augment existing ones without configuring or maintaining infrastructure. It uses Fetch API already so we can use our adapter as an event listener like below;

```ts
import myServerAdapter from './myServerAdapter'

self.addEventListener('fetch', myServerAdapter)
```

### Deno

[Deno is a simple, modern and secure runtime for JavaScript and TypeScript that uses V8 and is built in Rust](https://deno.land/).
You can use our adapter as a Deno request handler like below;

```ts
import { serve } from 'https://deno.land/std@0.117.0/http/server.ts'
import myServerAdapter from './myServerAdapter'

serve(myServerAdapter, {
  // Listen any port you want
  addr: ':4000'
})
```

### Express

[Express is the most popular web framework for Node.js.](https://expressjs.com/) It is a minimalist framework that provides a robust set of features to handle HTTP on Node.js applications.

You can easily integrate your adapter into your Express application with a few lines of code.

```ts
import express from 'express'
import myServerAdapter from './myServerAdapter'

const app = express()

// Bind our adapter to `/mypath` endpoint
app.use('/mypath', myServerAdapter)

app.listen(4000, () => {
  console.log('Running the server at http://localhost:4000/mypath')
})
```

### Fastify

[Fastify is one of the popular HTTP server frameworks for Node.js.](https://www.fastify.io/). You can use your adapter easily with Fastify.

So you can benefit from the powerful plugins of Fastify ecosystem.
[See the ecosystem](https://www.fastify.io/docs/latest/Guides/Ecosystem/)

```ts
import myServerAdapter from './myServerAdapter'
import fastify, { FastifyRequest, FastifyReply } from 'fastify'

// This is the fastify instance you have created
const app = fastify({ logger: true })

/**
 * We pass the incoming HTTP request to our adapter
 * and handle the response using Fastify's `reply` API
 * Learn more about `reply` https://www.fastify.io/docs/latest/Reply/
 **/
app.route({
  url: '/mypath',
  method: ['GET', 'POST', 'OPTIONS'],
  handler: async (req, reply) => {
    const response = await myServerAdapter.handleNodeRequest(req, {
      req,
      reply
    })
    response.headers.forEach((value, key) => {
      reply.header(key, value)
    })

    reply.status(response.status)

    reply.send(response.body)

    return reply
  }
})

app.listen(4000)
```

### Koa

[Koa is another Node.js server framework designed by the team behind Express, which aims to be a smaller, more expressive.](https://koajs.com/) You can add your adapter to your Koa application with a few lines of code then [benefit middlewares written for Koa.](https://github.com/koajs/koa/wiki)

```ts
import Koa from 'koa'
import myServerAdapter from './myServerAdapter'

const app = new Koa()

app.use(async ctx => {
  const response = await myServerAdapter.handleNodeRequest(ctx.req)

  // Set status code
  ctx.status = response.status

  // Set headers
  response.headers.forEach((value, key) => {
    ctx.append(key, value)
  })

  ctx.body = response.body
})

app.listen(4000, () => {
  console.log('Running the server at http://localhost:4000')
})
```

### Next.js

[Next.js](https://nextjs.org/) is a web framework that allows you to build websites very quickly and our new server adapter can be integrated with Next.js easily as an API Route.

```ts
// pages/api/myEndpoint.ts
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import myServerAdapter from './myServerAdapter'
import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    // Disable body parsing if you expect a request other than JSON
    bodyParser: false
  }
}

export default myServerAdapter
```

### SvelteKit

[SvelteKit](https://kit.svelte.dev/) is the fastest way to build svelte apps. It is very simple, and let you build frontend & backend in a single place

```ts
import myServerAdapter from './myServerAdapter'

export { myServerAdapter as get, myServerAdapter as post }
```

### Bun

[Bun](https://bun.sh/) is a modern JavaScript runtime like Node or Deno, and it supports Fetch API as a first class citizen.
So the configuration is really simple like any other JS runtime;

```ts
import myServerAdapter from './myServerAdapter'

Bun.serve(myServerAdapter)

const server = Bun.serve(yoga)

console.info(`Server is running on ${server.hostname}`)
```

## File Uploads / Multipart Requests

Multipart requests are a type of HTTP request that allows you to send blobs together with regular text data which has a mime-type `multipart/form-data`.

For example, if you send a multipart request from a browser with `FormData`, you can get the same `FormData` object in your request handler.

```ts
import { createServerAdapter } from '@whatwg-node/server'

const myServerAdapter = createServerAdapter(async request => {
  // Parse the request as `FormData`
  const formData = await request.formData()
  // Select the file
  const file = formData.get('file')
  // Process it as a string
  const fileTextContent = await file.text()
  // Select the other text parameter
  const regularTextData = formData.get('additionalStuff')
  // ...
  return new Response('{ "message": "ok" }', {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
})
```

You can learn more about [File API](https://developer.mozilla.org/en-US/docs/Web/API/File) on MDN documentation.

## Routing and Middlewares

We'd recommend to use [itty-router](https://github.com/kwhitley/itty-router) to handle routing and middleware approach. So it is really easy to integrate your router to `@whatwg-node/server`.

### Basic Routing

```ts
import { Router } from 'itty-router'
import { createServerAdapter } from '@whatwg-node/server'

// now let's create a router (note the lack of "new")
const router = Router()
// GET collection index
router.get('/todos', () => new Response('Todos Index!'))
// GET item
router.get('/todos/:id', ({ params }) => new Response(`Todo #${params.id}`))
// POST to the collection (we'll use async here)
router.post('/todos', async request => {
  const content = await request.json()
  return new Response('Creating Todo: ' + JSON.stringify(content))
})

// Redirect to a URL
router.get('/google', () => Response.redirect('http://www.google.com'))

// 404 for everything else
router.all('*', () => new Response('Not Found.', { status: 404 }))

// attach the router to our server adapter
const myServerAdapter = createServerAdapter(router)

// Then use it in any environment
import { createServer } from 'http'
const httpServer = createServer(myServer)
httpServer.listen(4000)
```

### Middlewares to handle CORS, cookies and more

There is another package called [itty-router-extras](https://www.npmjs.com/package/itty-router-extras) that provides some utilities for your platform agnostic server implementation. The following example shows how to get the cookies as an object from the request.

```ts
import { withCookies } from 'itty-router-extras'

router.get('/foo', withCookies, ({ cookies }) => {
  // cookies are parsed from the header into request.cookies
  return new Response(`Cookies: ${JSON.stringify(cookies)}`)
})
```

You can also setup a CORS middleware to handle preflight CORS requests.

```ts
import { withCors } from 'itty-router-extras'

router.all(
  '*',
  withCors({
    origin: 'http://localhost:4000',
    methods: 'GET, POST, PATCH, DELETE',
    headers: 'authorization, referer, origin, content-type',
    credentials: false
  })
)
```
