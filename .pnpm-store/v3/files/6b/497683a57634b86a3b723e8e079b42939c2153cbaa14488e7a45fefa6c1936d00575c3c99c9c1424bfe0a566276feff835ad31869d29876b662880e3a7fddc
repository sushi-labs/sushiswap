# GraphQL Import Node

This extension makes your NodeJS application able to import `graphql` files. It uses `require.extensions` to allow you to import/require from `.graphql` files in NodeJS environment. The imported content will be a compiled version of the GraphQL string (`DocumentNode`).

It needs to be installed `graphql` on the project. Then, you can install it using npm or yarn;

```
yarn add graphql-import-node
```

After that, you need to load this library before anything else.

## Usage with Node (JavaScript)

Make sure to run your NodeJS process with `-r` flag:

```
node -r graphql-import-node/register index.js
```

Or, you can require it manually in your index file:

```js
// CommonJS
require('graphql-import-node/register');
```

```js
// ES2016
import 'graphql-import-node';
```

Now you should be able to do:

```js
const schema = require('./schema.graphql');
```

## Usage with TypeScript

If you are using TypeScript (with `ts-node` or `ts-node-dev`), make sure to add the same `-r graphql-import-node/register` flag:

```
ts-node -r graphql-import-node/register index.ts
```

or to have typings for `*.graphql` files it'd better to add the import the library like below;

```ts
import 'graphql-import-node';
```

Now you should be able to do:

```ts
import * as schema from './schema.graphql';
```

## Usage with Jest

If you are running a test environment like Jest, you should add the following configuration to your Jest config:

```json
{
  "transform": {
    "^.+\\.graphql$": "graphql-import-node/jest"
  }
}
```
