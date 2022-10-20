---
title: '@corex/deepmerge'
custom_edit_url: 'https://github.com/iamvishnusankar/corex/edit/master/packages/deepmerge/README.md'
---

A zero dependency object merger with typescript support and built in common merge utilities. Support merging of n number of objects

## Installation

```
yarn add @corex/deepmerge
```

## Usage

```ts
import { merge } from '@corex/deepmerge'

merge([obj1, obj2, obj3], { options })
```

## Merge Options

| property       | default   | description                                                                                          |
| -------------- | --------- | ---------------------------------------------------------------------------------------------------- |
| arrayMergeType | `combine` | Merge two array by concatenation and remove duplicates. Available options are `combine`, `overwrite` |
| arrayMerge     | -         | Custom merge function to handle array merging.                                                       |

## Simple Object Merge

```ts
const obj1 = {
  a: 1,
  b: {
    c: 2,
  },
}

const obj2 = {
  a: 2,
  b: {
    c: 4,
    d: 5,
  },
}

const result = merge([obj1, obj2])
console.log(result)

// {
//   a: 2,
//   b: {
//     c: 4,
//     d: 5,
//   },
// }
```

## Array Merge

```ts
const arr1 = {
  a: [1, 2, 3],
}
const arr2 = {
  a: [3, 4, 5],
}

const result = merge([arr1, arr2])
console.log(result)

// result = {
//   a: [1, 2, 3, 4, 5],
// }
```

## Complex Merge

```ts
const obj1 = {
  a: 2,
  b: (x: number, y: number) => x + y,
  c: [1, 2, 4],
  d: {
    e: [4, 5, 7],
  },
}

console.log(obj1.b(7, 5)) // ==> 12

const obj2 = {
  a: 10,
  b: (x: number, y: number) => x / y,
  c: [20, 30],
  d: {
    e: [4, 7, 5],
    f: {
      g: 'another',
    },
  },
}

const obj3 = {
  b: (x: number, y: number) => x * y,
  c: [1, 2, 4],
  d: {
    e: [4, 7, 5],
  },
}

const result = merge([obj1, obj2, obj3])

console.log(result.b(7, 5)) // ==> 35
```

## Array merge types

By default `@corex/deepmerge` uses combine merge. However user can implement their own methods to perform merge or use the built in `overwrite`.

### Overwrite merge

```ts
const obj1 = {
  a: [1, 2, 3],
  b: ['c', 'd'],
  c: {
    d: [1, 2],
  },
}

const obj2 = {
  a: [1, 7, 6],
  b: ['e', 'f'],
  c: {
    d: [9, 10],
  },
}

const obj3 = {
  a: [20, 40],
}

const result = merge([obj1, obj2, obj3], {
  arrayMergeType: 'overwrite',
})
console.log(result)

// result = {
//   a: [20, 40],
//   b: ['e', 'f'],
//   c: {
//     d: [9, 10],
//   },
// }
```

### Custom merge function

```ts
const obj1 = {
  a: ['1', '2'],
  c: {
    d: [1000, 500],
  },
}

const obj2 = {
  a: ['4', '5'],
  c: {
    d: [60, 80],
  },
}

const customMergeFn = (_: any[], __: any[]) => 42

const result = merge([obj1, obj2], {
  arrayMerge: customMergeFn,
})
console.log(result)

// {
//   a: 42,
//   c: {
//     d: 42,
//   },
// }
```
