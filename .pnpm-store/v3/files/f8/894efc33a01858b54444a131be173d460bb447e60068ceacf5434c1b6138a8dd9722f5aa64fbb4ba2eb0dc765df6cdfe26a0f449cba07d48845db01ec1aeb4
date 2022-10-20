dnscache for Node
===================

This module wraps the [dns](http://nodejs.org/api/dns.html) module methods and provide a caching layer in between.
Every call to a dns method is first looked into the local cache, in case of cache hit the value from cache is returned, in case of cache miss the original dns call is made
and the return value is cached in the local cache.

It is very similar to GOF Proxy design pattern providing a Cache Proxy.

The goal of this module is to cache the most used/most recent dns calls, to avoid the network delay and improve the performance.

Once this module is enabled, all the subsequent calls to `require('dns')` are wrapped too.

**NOTE:** There are situations where the built-in `dns` functions would throw, rather than call back with an error. Due to the fact that asynchronous caching mechanisms are supported, all errors for these functions will be passed as the first argument to the callback.

Installation
------------

`npm install dnscache`

Usage
-----

```javascript
var dns = require('dns'),
    dnscache = require('dnscache')({
        "enable" : true,
        "ttl" : 300,
        "cachesize" : 1000
    });
    
    //to use the cached dns either of dnscache or dns can be called.
    //all the methods of dns are wrapped, this one just shows lookup on an example
    
    //will call the wrapped dns
    dnscache.lookup('www.yahoo.com', function(err, result) {
        //do something with result
    });
    
    //will call the wrapped dns
    dns.lookup('www.google.com', function(err, result) {
        //do something with result
    });
    

```

Configuration
-------------

   * `enable` - Whether dnscache is enabled or not, defaults to `false`.
   * `ttl` - ttl in seconds for cache-entries. Default: `300`
   * `cachesize` - number of cache entries, defaults to `1000`
   * `cache` - If a custom cache needs to be used instead of the supplied cache implementation. Only for Advanced Usage. Custom Cache needs to have same interface for `get` and `set`.


Advanced Caching
----------------

If you want to use a different cache mechanism (ex: `mdbm`, `redis`), you only need to create an object similar to this:

```javascript
var Cache = function(config) {

    this.set = function(key, value, callback) {};

    this.get = function(key, callback) {};
};
```


Build Status
------------

[![Build Status](https://secure.travis-ci.org/yahoo/dnscache.png?branch=master)](http://travis-ci.org/yahoo/dnscache)


Node Badge
----------

[![NPM](https://nodei.co/npm/dnscache.png)](https://nodei.co/npm/dnscache/)
