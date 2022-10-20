/*
 * Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var dns = require('dns'),
    dnscache = require('../lib/index.js')({"enable" : true, "ttl" : 300, "cachesize" : 1000}),
    now = Date.now(), now1;
    //to use the cached dns either of dnscahe or dns can be called    
    dnscache.lookup('www.yahoo.com', function(err, result) {
        console.log('lookup time to www.yahoo.com without cache: ', Date.now() - now);
        now = Date.now();
        dnscache.lookup('www.yahoo.com', function(err, result) {
            console.log('lookup time to www.yahoo.com with cache: ', Date.now() - now);
            console.log(typeof dnscache.internalCache);
        });
    });
    
    now1 = Date.now();
    //dns methods are wrapped too with the cached dns
    dns.lookup('www.google.com', function(err, result) {
        console.log('lookup time to www.google.com without cache: ', Date.now() - now1);
        now1 = Date.now();
        dns.lookup('www.google.com', function(err, result) {
            console.log('lookup time to www.google.com with cache: ', Date.now() - now1);
            console.log(typeof dns.internalCache);
        });
    });
    

/* Sample output on console.log
 * lookup time to www.yahoo.com without cache:  6
 * lookup time to www.yahoo.com with cache:  1
 * object
 * lookup time to www.google.com without cache:  8
 * lookup time to www.google.com with cache:  1
 * object
 */