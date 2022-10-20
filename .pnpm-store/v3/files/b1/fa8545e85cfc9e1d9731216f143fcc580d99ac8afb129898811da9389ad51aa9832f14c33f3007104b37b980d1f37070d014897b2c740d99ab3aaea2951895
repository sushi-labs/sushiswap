# @n1ru4l/graphql-live-query

[![npm version](https://img.shields.io/npm/v/@n1ru4l/graphql-live-query.svg)](https://www.npmjs.com/package/@n1ru4l/graphql-live-query) [![npm downloads](https://img.shields.io/npm/dm/@n1ru4l/graphql-live-query.svg)](https://www.npmjs.com/package/@n1ru4l/graphql-live-query)

Primitives for adding GraphQL live query operation support to any GraphQL server.

For a usage of those utility functions check out `InMemoryLiveQueryStore`(https://github.com/n1ru4l/graphql-live-queries/tree/main/packages/in-memory-live-query-store/src/InMemoryLiveQueryStore.ts).

## Install Instructions

```bash
yarn add -E @n1ru4l/graphql-live-query
```

## API

### `GraphQLLiveDirective`

Add the `@live` directive to your schema.

```ts
import { GraphQLSchema, specifiedDirectives } from "graphql";
import { GraphQLLiveDirective } from "@n1ru4l/graphql-live-query";
import { query, mutation, subscription } from "./schema";

const schema = new GraphQLSchema({
  query,
  mutation,
  subscription,
  directives: [
    GraphQLLiveDirective,
    /* Keep @defer/@stream/@if/@skip */ ...specifiedDirectives,
  ],
});
```

**Note:** If you are using a SDL first approach for defining your schema (such as advocated by `makeExecutableSchema`) you must add the directly to your type-definitions. In order to be as up to date as possible we recommend using `graphql-tools/utils` `astFromDirective` together with `print` exported from `graphql` for generating the SDL from `GraphQLLiveDirective`.

**Example ([on CodeSandbox](https://codesandbox.io/s/graphqllivedirective-usage-with-makeexecutableschema-xv2q5?file=/src/schema.ts:376-483)
):**

```ts
import { makeExecutableSchema } from "@graphql-tools/schema";
import { astFromDirective } from "@graphql-tools/utils";
import { GraphQLLiveDirective } from "@n1ru4l/graphql-live-query";
import { print, GraphQLSchema } from "graphql";

const typeDefinitions = /* GraphQL */ `
  type Query {
    ping: Boolean
  }
`;

const resolvers = {
  Query: {
    ping: () => true
  }
};

const liveDirectiveTypeDefs = print(
  astFromDirective(GraphQLLiveDirective)
);

export const schema = makeExecutableSchema({
  typeDefs: [typeDefinitions, liveDirectiveTypeDefs],
  resolvers
});
```

### `isLiveQueryOperationDefinitionNode`

Determine whether a `DefinitionNode` is a `LiveQueryOperationDefinitionNode`.

```ts
import { parse, getOperationAST } from "graphql";
import { isLiveQueryOperationDefinitionNode } from "@n1ru4l/graphql-live-query";

const liveQueryOperationDefinitionNode = getOperationAST(
  parse(/* GraphQL */ `
    query @live {
      me {
        id
        login
      }
    }
  `)
);

isLiveQueryOperationDefinitionNode(liveQueryOperationDefinitionNode); // true

const queryOperationDefinitionNode = getOperationAST(
  parse(/* GraphQL */ `
    query {
      me {
        id
        login
      }
    }
  `)
);

isLiveQueryOperationDefinitionNode(queryOperationDefinitionNode); // false

const conditionalLiveQueryDefinitionNode = getOperationAST(
  parse(/* GraphQL */ `
    query($isClient: Boolean = false) @live(if: $isClient) {
      me {
        id
        login
      }
    }
  `)
);

isLiveQueryOperationDefinitionNode(conditionalLiveQueryDefinitionNode); // false
isLiveQueryOperationDefinitionNode(
  conditionalLiveQueryDefinitionNode,
  /* variables */ {
    isClient: false,
  }
); // false
isLiveQueryOperationDefinitionNode(
  conditionalLiveQueryDefinitionNode,
  /* variables */ {
    isClient: true,
  }
); // true
```

### `NoLiveMixedWithDeferStreamRule`

Validation rule for raising a GraphQLError for a operation that use `@live` mixed with `@defer` and `@stream`.

```ts
import { parse, validate, specifiedRules } from "graphql";
import { NoLiveMixedWithDeferStreamRule } from "@n1ru4l/graphql-live-query";
import schema from "./schema";

const document = parse(/* GraphQL */ `
  query @live {
    users @stream {
      id
      login
    }
  }
`);

const [error] = validate(schema, document, [
  /* default validation rules */ ...specifiedRules,
  NoLiveMixedWithDeferStreamRule,
]);

console.log(error); // [GraphQLError: Cannot mix "@stream" with "@live".]
```
