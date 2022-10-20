/*
* Copyright (c) 2013, Yahoo! Inc. All rights reserved.
* Copyrights licensed under the New BSD License.
* See the accompanying LICENSE file for terms.
*/

var CacheObject = function (conf) {
    conf = conf || {};
    conf.ttl = parseInt(conf.ttl, 10) || 300; //0 is not permissible
    conf.cachesize = parseInt(conf.cachesize, 10) || 1000; //0 is not permissible
    
    this.ttl = conf.ttl * 1000;
    this.max = conf.cachesize;

    this.count = 0;
    this.data = {};
    var next = require('asap');

    this.set = function (key, value, callback) {
        var self = this;
        next(function () {
            if (self.data[key]) {
                if (self.data[key].newer) {
                    if (self.data[key].older) {
                        self.data[key].newer.older = self.data[key].older;
                        self.data[key].older.newer = self.data[key].newer;
                    } else {
                        self.tail = self.data[key].newer;
                        delete self.tail.older;
                    }

                    self.data[key].older = self.head;
                    self.head.newer = self.data[key];
                    delete self.data[key].newer;
                    self.head = self.data[key];
                }

                self.head.val = value;
                self.head.hit = 0;
                self.head.ts = Date.now();
            } else {
                // key is not exist
                self.data[key] = {
                    "key" : key,
                    "val" : value,
                    "hit" : 0,
                    "ts" : Date.now()
                };

                if (!self.head) {
                    // cache is empty
                    self.head = self.data[key];
                    self.tail = self.data[key];
                } else {
                    // insert the new entry to the front
                    self.head.newer = self.data[key];
                    self.data[key].older = self.head;
                    self.head = self.data[key];
                }

                if (self.count >= self.max) {
                    // remove the tail
                    var temp = self.tail;
                    self.tail = self.tail.newer;
                    delete self.tail.next;
                    delete self.data[temp.key];
                } else {
                    self.count = self.count + 1;
                }
            }
            /* jshint -W030 */
            callback && callback(null, value);
        });
    };

    this.get = function (key, callback) {
        var self = this;
        if (!callback) {
            throw('cache.get callback is required.');
        }

        next(function () {
            if (!self.data[key]) {
                return callback(null, undefined);
            }
            var value;
            if (conf.ttl !== 0 && (Date.now() - self.data[key].ts) >= self.ttl) {
                if (self.data[key].newer) {
                    if (self.data[key].older) {
                        // in the middle of the list
                        self.data[key].newer.older = self.data[key].older;
                        self.data[key].older.newer = self.data[key].newer;
                    } else {
                        // tail
                        self.tail = self.data[key].newer;
                        delete self.tail.older;
                    }
                } else {
                    // the first item
                    if (self.data[key].older) {
                        self.head = self.data[key].older;
                        delete self.head.newer;
                    } else {
                        // 1 items
                        delete self.head;
                        delete self.tail;
                    }
                }

                delete self.data[key];
                self.count = self.count - 1;
            } else {
                self.data[key].hit = self.data[key].hit + 1;
                value = self.data[key].val;
            }
            callback(null, value);
        });
    };
};

module.exports = CacheObject;
