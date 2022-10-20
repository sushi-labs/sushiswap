/*jshint newcap: false */
/*global describe, it*/
/*
* Copyright (c) 2013, Yahoo! Inc. All rights reserved.
* Copyrights licensed under the New BSD License.
* See the accompanying LICENSE file for terms.
*/

var assert = require('assert'),
    async = require('async'),
    Mod_cache = require('../lib/cache.js');

describe('caching tests', function() {

    it('should return a Cache Object with defaults', function() {
        var conf = {};
        new Mod_cache(conf);
        assert.ok(conf);
        assert.equal(conf.ttl, 300);
        assert.equal(conf.cachesize, 1000);
    });

    it('should return a Cache Object with defaults without config', function() {
        var mod = new Mod_cache();
        assert.equal(mod.ttl, 300 * 1000);
        assert.equal(mod.max, 1000);
    });

    it('should cache entries for lru', function(done) {
        var CacheObject = new Mod_cache({"ttl" : 300, "cachesize" : 5}),
            array = Array.apply(null, Array(5)).map(function(v, k) { return k; });

        async.each(array, function (name, callback) {
            CacheObject.set(name, name, function () {
                callback(null);
            });
        }, function () {
            CacheObject.get(0, function (err0) {
                CacheObject.get(1, function (err1, data1) {
                    CacheObject.get('unknownkey', function (err2, data2) {
                        assert.equal(true, data1 !== undefined && data2 === undefined);
                        assert.equal(null, err0);
                        assert.equal(null, err1);
                        assert.equal(null, err2);
                        done();
                    });
                });
            });
        });
    });

    it('should update multiple keys', function(done) {
        var CacheObject = new Mod_cache({
            ttl: 300,
            cachesize: 5
        });

        CacheObject.set(1, 1, function () {
            CacheObject.set(2, 2, function () {
                CacheObject.set(3, 30, function () {
                    CacheObject.set(3, 31, function () {
                        CacheObject.set(2, 4, function () {
                            CacheObject.set(2, 5, function () {
                                CacheObject.set(1, 6, function () {
                                    assert.equal(CacheObject.count, 3);
                                    assert.equal(CacheObject.tail.key, 3);
                                    assert.equal(CacheObject.tail.val, 31);
                                    assert.equal(CacheObject.head.key, 1);
                                    assert.equal(CacheObject.head.val, 6);
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    it('should get a key', function(done) {
        var CacheObject = new Mod_cache({
            ttl: 300,
            cachesize: 5
        });
        CacheObject.set(1, 1, function () {
            CacheObject.set(1, 2, function () {
                CacheObject.get(1, function (err, rec) {
                    assert.equal(rec, 2);
                    done();
                });
            });
        });
    });

    it('should allow to see hit stats', function(done) {
        var CacheObject = new Mod_cache({
            ttl: 300,
            cachesize: 5
        });

        CacheObject.set(1, 1, function () {
            CacheObject.get(1, function () {
                CacheObject.get(1, function () {
                    assert.equal(CacheObject.data['1'].hit, 2);
                    done();
                });
            });
        });
    });

    it('should expire a single item', function(done) {
        var CacheObject = new Mod_cache({
            ttl: 1,
            cachesize: 5
        }), noop = function() {};
        CacheObject.set(1, 1);
        CacheObject.get(1, noop);
        CacheObject.get(1, noop);
        setTimeout(function(){
            CacheObject.get(1, function () {
                assert.equal(undefined, CacheObject.data['1']);
                done();
            });
        }, 1200);
    });

    it('should not expire a key', function(done) {
        var CacheObject = new Mod_cache({
            ttl: 0,
            cachesize: 5
        });
        CacheObject.set(2, 2);
        CacheObject.set(1, 1);
        setTimeout(function(){
            CacheObject.get(1, function () {
                assert.ok(CacheObject.data['1']);
                assert.equal(CacheObject.data['1'].val, 1);
                done();
            });
        }, 1200);
    });

    it('should expire head via ttl', function(done) {
        var CacheObject = new Mod_cache({
            ttl: 1,
            cachesize: 5
        });
        CacheObject.set(2, 2);
        CacheObject.set(1, 1);
        setTimeout(function(){
            CacheObject.get(1, function () {
                assert.equal(undefined, CacheObject.data['1']);
                done();
            });
        }, 1200);
    });

    it('should expire tail via ttl', function(done) {
        var CacheObject = new Mod_cache({
            ttl: 1,
            cachesize: 5
        });
        CacheObject.set(1, 1);
        CacheObject.set(2, 2);
        setTimeout(function(){
            CacheObject.get(1, function () {
                assert.equal(undefined, CacheObject.data['1']);
                done();
            });
        }, 1200);
    });

    it('should expire middle via ttl', function(done) {
        var CacheObject = new Mod_cache({
            ttl: 1,
            cachesize: 5
        });
        CacheObject.set(3, 3);
        CacheObject.set(1, 1);
        CacheObject.set(2, 2);
        setTimeout(function(){
            CacheObject.get(1, function () {
                assert.equal(undefined, CacheObject.data['1']);
                done();
            });
        }, 1200);
    });

    it('should throw if cache.get does not get a callback', function() {
        var CacheObject = new Mod_cache({
            ttl: 1,
            cachesize: 5
        });

        assert.throws(function() {
            CacheObject.get(1);
        }, /callback is required/);
    });

    it('should remove items from cache when cache limit is hit', function(done) {
        var CacheObject = new Mod_cache({
            ttl: 1,
            cachesize: 2
        });

        CacheObject.set(1, 1, function() {
            assert.equal(CacheObject.count, 1);
            CacheObject.set(2, 1, function() {
                assert.equal(CacheObject.count, 2);
                CacheObject.set(3, 1, function() {
                    assert.equal(CacheObject.count, 2);
                    done();
                });
            });
        });
    });

    it('should not error when calling cache.get on an expired key twice in the same tick', function(done) {
        var CacheObject = new Mod_cache({
            ttl: 1,
            cachesize: 5
        });
        CacheObject.set(1, 1);
        setTimeout(function() {
            CacheObject.get(1, Function.prototype);
            CacheObject.get(1, function() {
                done();
            });
        }, 1200);
    });

});
