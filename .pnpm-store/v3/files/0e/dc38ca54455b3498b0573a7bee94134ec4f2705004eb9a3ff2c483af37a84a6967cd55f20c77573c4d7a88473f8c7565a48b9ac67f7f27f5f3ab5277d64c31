[![Build Status](https://travis-ci.org/DirtyHairy/async-mutex.svg?branch=master)](https://travis-ci.org/DirtyHairy/async-mutex)
[![npm version](https://badge.fury.io/js/async-mutex.svg)](https://badge.fury.io/js/async-mutex)
[![Coverage Status](https://coveralls.io/repos/github/DirtyHairy/async-mutex/badge.svg?branch=master)](https://coveralls.io/github/DirtyHairy/async-mutex?branch=master)

# What is it?

This package implements primitives for synchronizing asynchronous operations in
Javascript.

## Mutex

The term "mutex" usually refers to a data structure used to synchronize
concurrent processes running on different threads. For example, before accessing
a non-threadsafe resource, a thread will lock the mutex. This is guaranteed
to block the thread until no other thread holds a lock on the mutex and thus
enforces exclusive access to the resource. Once the operation is complete, the
thread releases the lock, allowing other threads to acquire a lock and access the
resource.

While Javascript is strictly single-threaded, the asynchronous nature of its
execution model allows for race conditions that require similar synchronization
primitives. Consider for example a library communicating with a web worker that
needs to exchange several subsequent messages with the worker in order to achieve
a task. As these messages are exchanged in an asynchronous manner, it is perfectly
possible that the library is called again during this process. Depending on the
way state is handled during the async process, this will lead to race conditions
that are hard to fix and even harder to track down.

This library solves the problem by applying the concept of mutexes to Javascript.
Locking the mutex will return a promise that resolves once the mutex becomes
available. Once the async process is complete (usually taking multiple
spins of the event loop), a callback supplied to the caller is called in order
to release the mutex, allowing the next scheduled worker to execute.

# Semaphore

Imagine a situation where you need to control access to several instances of
a shared resource. For example, you might want to distribute images between several
worker processes that perform transformations, or you might want to create a web
crawler that performs a defined number of requests in parallel.

A semaphore is a data structure that is initialized to a positive integer value and that
can be locked multiple times.
As long as the semaphore value is positive, locking it will return the current value
and the locking process will continue execution immediately; the semaphore will
be decremented upon locking. Releasing the lock will increment the semaphore again.

Once the semaphore has reached zero, the next process that attempts to acquire a lock
will be suspended until another process releases its lock and this increments the semaphore
again.

This library provides a semaphore implementation for Javascript that is similar to the
mutex implementation described above.

# How to use it?

## Installation

You can install the library into your project via npm

    npm install async-mutex

The library is written in TypeScript and will work in any environment that
supports ES5, ES6 promises and `Array.isArray`. On ancient browsers,
a shim can be used (e.g. [core-js](https://github.com/zloirock/core-js)).
No external typings are required for using this library with
TypeScript (version >= 2).

Starting with Node 12.16 and 13.7, native ES6 style imports are supported.

**WARNING:** Node 13 versions < 13.2.0 fail to import this package correctly.
Node 12 and earlier are fine, as are newer versions of Node 13.

## Importing

**CommonJS:**
```javascript
var Mutex = require('async-mutex').Mutex;
var Semaphore = require('async-mutex').Semaphore;
var withTimeout = require('async-mutex').withTimeout;
```

**ES6:**
```javascript
import {Mutex, Semaphore, withTimeout} from 'async-mutex';
```

With the latest version of Node, native ES6 style imports are supported.

**TypeScript:**
```typescript
import {Mutex, MutexInterface, Semaphore, SemaphoreInterface, withTimeout} from 'async-mutex';
```

##  Mutex API

### Creating

```typescript
const mutex = new Mutex();
```

Create a new mutex.

### Locking

Promise style:
```typescript
mutex
    .acquire()
    .then(function(release) {
        // ...
    });
```

async/await:
```typescript
const release = await mutex.acquire();
try {
    // ...
} finally {
    release();
}
```

`acquire` returns an (ES6) promise that will resolve as soon as the mutex is
available and ready to be accessed. The promise resolves with a function `release` that
must be called once the mutex should be released again.

**IMPORTANT:** Failure to call `release` will hold the mutex locked and will
likely deadlock the application. Make sure to call `release` under all circumstances
and handle exceptions accordingly.

#### Alternate release API

A locked mutex can also be released by calling the `release` method on the mutex. This will
release the current lock on the mutex.

**WARNING:** Using this API comes with the inherent danger of releasing a mutex locked
in an entirely unrelated place. Use with care.

Promise style:
```typescript
mutex
    .acquire()
    .then(function() {
        // ...

        // Please read and understand the WARNING above before using this API.
        mutex.release();
    });
```

async/await:
```typescript
await mutex.acquire();
try {
    // ...
} finally {
    // Please read and understand the WARNING above before using this API.
    mutex.release();
}
```

### Synchronized code execution

Promise style:
```typescript
mutex
    .runExclusive(function() {
        // ...
    })
    .then(function(result) {
        // ...
    });
```

async/await:
```typescript
await mutex.runExclusive(async () => {
    // ...
});
```

`runExclusive` schedules the supplied callback to be run once the mutex is unlocked.
The function may return a promise. Once the promise is resolved or rejected (or immediately after
execution if an immediate value was returned),
the mutex is released. `runExclusive` returns a promise that adopts the state of the function result.

The mutex is released and the result rejected if an exception occurs during execution
if the callback.

### Checking whether the mutex is locked

```typescript
mutex.isLocked();
```

##  Semaphore API

### Creating

```typescript
const semaphore = new Semaphore(initialValue);
```

Creates a new semaphore. `initialValue` is a positive integer that defines the
initial value of the semaphore (aka the maximum number of concurrent consumers)

### Locking

Promise style:
```typescript
semaphore
    .acquire()
    .then(function([value, release]) {
        // ...

        release();
    });
```

async/await:
```typescript
const [value, release] = await semaphore.acquire();
try {
    // ...
} finally {
    release();
}
```

`acquire` returns an (ES6) promise that will resolve as soon as the semaphore is
available and ready to be accessed. The promise resolves to an array with the
first entry being the current value of the semaphore, and the second value a
function that must be called to release the semaphore once the critical operation
has completed.

**IMPORTANT:** Failure to call `release` will hold the semaphore locked and will
likely deadlock the application. Make sure to call `release` under all circumstances
and handle exceptions accordingly.

#### Alternate release API

A locked semaphore can also be released by calling the `release` method on the semaphore.
This will release the most recent lock on the semaphore. As such, this will only work with
semaphores with `maxValue == 1`. Calling this on other semaphores will throw an exception.

**WARNING:** Using this API comes with the inherent danger of releasing a semaphore locked
in an entirely unrelated place. Use with care.

Promise style:
```typescript
semaphore
    .acquire()
    .then(function([value]) {
        // ...

        // Please read and understand the WARNING above before using this API.
        semaphore.release();
    });
```

async/await:
```typescript
const [value] = await semaphore.acquire();
try {
    // ...
} finally {
    // Please read and understand the WARNING above before using this API.
    semaphore.release();
}
```

### Synchronized code execution

Promise style:
```typescript
semaphore
    .runExclusive(function(value) {
        // ...
    })
    .then(function(result) {
        // ...
    });
```

async/await:
```typescript
await semaphore.runExclusive(async (value) => {
    // ...
});
```

`runExclusive` schedules the supplied callback to be run once the semaphore is available.
The callback will receive the current value of the semaphore as its argument.
The function may return a promise. Once the promise is resolved or rejected (or immediately after
execution if an immediate value was returned),
the semaphore is released. `runExclusive` returns a promise that adopts the state of the function result.

The semaphore is released and the result rejected if an exception occurs during execution
if the callback.

### Checking whether the semaphore is locked

```typescript
semaphore.isLocked();
```

The semaphore is considered to be locked if it has a value of zero.

## Limiting the time waiting for a mutex or semaphore to become available

Sometimes it is desirable to limit the time a program waits for a mutex or
semaphore to become available. The `withTimeout` decorator can be applied
to both semaphores and mutexes and changes the behavior of `acquire` and
`runExclusive` accordingly.

```typescript
    const mutexWithTimeout = withTimeout(new Mutex(), 100, new Error('timeout'));
    const semaphoreWithTimeout = withTimeout(new Semaphore(5), 100, new Error('timeout'));
```

The API of the decorated mutex or semaphore is unchanged.

The second argument of `withTimeout` is
the timeout in milliseconds. After the timeout is exceeded, the promise returned by
`acquire` and `runExclusive` will reject. The latter will not run the provided callback in
case of an timeout.

The third argument of `withTimeout` is optional and can be used to
customize the error with which the promise is rejected.

# License

Feel free to use this library under the conditions of the MIT license.
