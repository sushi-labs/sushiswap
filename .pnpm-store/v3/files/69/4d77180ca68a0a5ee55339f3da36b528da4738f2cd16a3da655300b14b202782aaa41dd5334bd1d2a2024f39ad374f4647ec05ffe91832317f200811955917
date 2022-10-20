/*
* Copyright (c) 2013, Yahoo! Inc. All rights reserved.
* Copyrights licensed under the New BSD License.
* See the accompanying LICENSE file for terms.
*/

var CacheObject = require('./cache.js'),
    deepCopy = require('lodash.clone'),
    dns = require('dns');

/*
 * Stores the list of callbacks waiting for a dns call.
 */
var callbackList = {};

// original function storage
var backup_object = {
    lookup : dns.lookup,
    resolve : dns.resolve,
    resolve4 : dns.resolve4,
    resolve6 : dns.resolve6,
    resolveMx : dns.resolveMx,
    resolveTxt : dns.resolveTxt,
    resolveSrv : dns.resolveSrv,
    resolveNs : dns.resolveNs,
    resolveCname : dns.resolveCname,
    reverse : dns.reverse
};

/*
 * Make a deep copy of the supplied object. This function reliably copies only
 * what is valid for a JSON object, array, or other element.
 */
var deepCopy = function (o) {
    var newArr, ix, newObj, prop;

    if (!o || typeof o !== 'object') {
        return o;
    }

    if (Array.isArray(o)) {
        newArr = [];
        for (ix = 0; ix < o.length; ix += 1) {
            newArr.push(deepCopy(o[ix]));
        }
        return newArr;
    } else {
        newObj = {};
        for (prop in o) {
            /* istanbul ignore else */
            if (o.hasOwnProperty(prop)) {
                newObj[prop] = deepCopy(o[prop]);
            }
        }
        return newObj;
    }
};


// original function storage
var EnhanceDns = function (conf) {
        conf = conf || {};
        conf.ttl = parseInt(conf.ttl, 10) || 300; //0 is not allowed ie it ttl is set to 0, it will take the default
        conf.cachesize = parseInt(conf.cachesize, 10); //0 is allowed but it will disable the caching

        if (isNaN(conf.cachesize)) {
            conf.cachesize = 1000; //set default cache size to 1000 records max
        }

        if(!conf.enable || conf.cachesize <= 0) {
            delete dns.internalCache;
            for(var key in backup_object) {
                /* istanbul ignore else */
                if (backup_object.hasOwnProperty(key)) {
                    dns[key] = backup_object[key];
                }
            }
            return dns;
        }

        // insert cache object to the instance
        if(!dns.internalCache) {
            dns.internalCache = conf.cache ? new conf.cache(conf) : new CacheObject(conf);
            callbackList = {};
        }

        var cache = dns.internalCache;

        // override dns.lookup method
        dns.lookup = function (domain, options, callback) {
            var family = 0;
            var hints = 0;
            var all = false;
            if (arguments.length === 2) {
                callback = options;
                options = family;
            } else if (typeof options === 'object') {
                if (options.family) {
                    family = +options.family;
                    if (family !== 4 && family !== 6) {
                        callback(new Error('invalid argument: `family` must be 4 or 6'));
                        return;
                    }
                }
                /*istanbul ignore next - "hints" require node 0.12+*/
                if (options.hints) {
                    hints = +options.hints;
                }
                all = (options.all === true);
            } else if (options) {
                family = +options;
                if (family !== 4 && family !== 6) {
                    callback(new Error('invalid argument: `family` must be 4 or 6'));
                    return;
                }
            }

            var key = 'lookup_' + domain + '_' + family + '_' + hints + '_' + all;
            cache.get(key, function (error, record) {
                if (record) {
                    /*istanbul ignore next - "all" option require node 4+*/
                    if (Array.isArray(record)) {
                        return callback(error, record);
                    }
                    return callback(error, record.address, record.family);
                }

                var list = callbackList[key] = callbackList[key] || [];
                list.push(callback);

                if (list.length > 1) { return; }

                try{
                    backup_object.lookup(domain, options, function (err, address, family_r) {
                        if (err) {
                            list.forEach(function (cb) { cb(err); });
                            delete callbackList[key];
                            return;
                        }
                        var value;
                        /*istanbul ignore next - "all" option require node 4+*/
                        if (Array.isArray(address)) {
                            value = deepCopy(address);
                        } else {
                            value = {
                                'address' : address,
                                'family' : family_r
                            };
                        }
                        cache.set(key, value, function () {
                            list.forEach(function (cb) { cb(err, address, family_r); });
                            delete callbackList[key];
                        });
                    });
                } catch (err) {
                    /*istanbul ignore next - doesn't throw in node 0.10*/
                    callback(err);
                }
            });
        };

        // override dns.resolve method
        dns.resolve = function (domain, type, callback) {
            var type_new, callback_new;

            if (typeof type === 'string') {
                type_new = type;
                callback_new = callback;
            } else {
                type_new = "A";
                callback_new = type;
            }

            var key = 'resolve_' + domain + '_' + type_new;
            cache.get(key, function (error, record) {
                if (record) {
                    return callback_new(error, deepCopy(record), true);
                }

                var list = callbackList[key] = callbackList[key] || [];
                list.push(callback_new);

                if (list.length > 1) { return; }

                try {
                    backup_object.resolve(domain, type_new, function (err, addresses) {
                        if (err) {
                            list.forEach(function (cb) { cb(err); });
                            delete callbackList[key];
                            return;
                        }
                        cache.set(key, addresses, function () {
                            list.forEach(function (cb) { cb(err, deepCopy(addresses), false); });
                            delete callbackList[key];
                        });
                    });
                } catch (err) {
                    /*istanbul ignore next - doesn't throw in node 0.10*/
                    callback_new(err);
                }
            });
        };

        // override dns.resolve4 method
        dns.resolve4 = function (domain, callback) {
            var key = 'resolve4_' + domain;
            cache.get(key, function (error, record) {
                if (record) {
                    return callback(error, deepCopy(record));
                }

                var list = callbackList[key] = callbackList[key] || [];
                list.push(callback);

                if (list.length > 1) { return; }

                try {
                    backup_object.resolve4(domain, function (err, addresses) {
                        if (err) {
                            list.forEach(function (cb) { cb(err); });
                            delete callbackList[key];
                            return;
                        }
                        cache.set(key, addresses, function () {
                            list.forEach(function (cb) { cb(err, deepCopy(addresses)); });
                            delete callbackList[key];
                        });
                    });
                } catch (err) {
                    /*istanbul ignore next - doesn't throw in node 0.10*/
                    callback(err);
                }
            });
        };

        // override dns.resolve6 method
        dns.resolve6 = function (domain, callback) {
            var key = 'resolve6_' + domain;
            cache.get(key, function (error, record) {
                if (record) {
                    return callback(error, deepCopy(record));
                }

                var list = callbackList[key] = callbackList[key] || [];
                list.push(callback);

                if (list.length > 1) { return; }

                try {
                    backup_object.resolve6(domain, function (err, addresses) {
                        if (err) {
                            list.forEach(function (cb) { cb(err); });
                            delete callbackList[key];
                            return;
                        }
                        cache.set(key, addresses, function () {
                            list.forEach(function (cb) { cb(err, deepCopy(addresses)); });
                            delete callbackList[key];
                        });
                    });
                } catch (err) {
                    /*istanbul ignore next - doesn't throw in node 0.10*/
                    callback(err);
                }
            });
        };

        // override dns.resolveMx method
        dns.resolveMx = function (domain, callback) {
            var key = 'resolveMx_' + domain;
            cache.get(key, function (error, record) {
                if (record) {
                    return callback(error, deepCopy(record));
                }

                var list = callbackList[key] = callbackList[key] || [];
                list.push(callback);

                if (list.length > 1) { return; }

                try {
                    backup_object.resolveMx(domain, function (err, addresses) {
                        if (err) {
                            list.forEach(function (cb) { cb(err); });
                            delete callbackList[key];
                            return;
                        }
                        cache.set(key, addresses, function () {
                            list.forEach(function (cb) { cb(err, deepCopy(addresses)); });
                            delete callbackList[key];
                        });
                    });
                } catch (err) {
                    /*istanbul ignore next - doesn't throw in node 0.10*/
                    callback(err);
                }
            });
        };

        // override dns.resolveTxt method
        dns.resolveTxt = function (domain, callback) {
            var key = 'resolveTxt_' + domain;
            cache.get(key, function (error, record) {
                if (record) {
                    return callback(error, deepCopy(record));
                }

                var list = callbackList[key] = callbackList[key] || [];
                list.push(callback);

                if (list.length > 1) { return; }

                try {
                    backup_object.resolveTxt(domain, function (err, addresses) {
                        if (err) {
                            list.forEach(function (cb) { cb(err); });
                            delete callbackList[key];
                            return;
                        }
                        cache.set(key, addresses, function () {
                            list.forEach(function (cb) { cb(err, deepCopy(addresses)); });
                            delete callbackList[key];
                        });
                    });
                } catch (err) {
                    /*istanbul ignore next - doesn't throw in node 0.10*/
                    callback(err);
                }
            });
        };

        // override dns.resolveSrv method
        dns.resolveSrv = function (domain, callback) {
            var key = 'resolveSrv_' + domain;
            cache.get(key, function (error, record) {
                if (record) {
                    return callback(error, deepCopy(record));
                }

                var list = callbackList[key] = callbackList[key] || [];
                list.push(callback);

                /* istanbul ignore if */
                if (list.length > 1) { return; }

                try {
                    backup_object.resolveSrv(domain, function (err, addresses) {
                        if (err) {
                            list.forEach(function (cb) { cb(err); });
                            delete callbackList[key];
                            return;
                        }
                        cache.set(key, addresses, function () {
                            list.forEach(function (cb) { cb(err, deepCopy(addresses)); });
                            delete callbackList[key];
                        });
                    });
                } catch (err) {
                    /*istanbul ignore next - doesn't throw in node 0.10*/
                    callback(err);
                }
            });
        };

        // override dns.resolveNs method
        dns.resolveNs = function (domain, callback) {
            var key = 'resolveNs_' + domain;
            cache.get(key, function (error, record) {
                if (record) {
                    return callback(error, deepCopy(record));
                }

                var list = callbackList[key] = callbackList[key] || [];
                list.push(callback);

                if (list.length > 1) { return; }

                try {
                    backup_object.resolveNs(domain, function (err, addresses) {
                        if (err) {
                            list.forEach(function (cb) { cb(err); });
                            delete callbackList[key];
                            return;
                        }
                        cache.set(key, addresses, function () {
                            list.forEach(function (cb) { cb(err, deepCopy(addresses)); });
                            delete callbackList[key];
                        });
                    });
                } catch (err) {
                    /*istanbul ignore next - doesn't throw in node 0.10*/
                    callback(err);
                }
            });
        };

        // override dns.resolveCname method
        dns.resolveCname = function (domain, callback) {
            var key = 'resolveCname_' + domain;
            cache.get(key, function (error, record) {
                if (record) {
                    return callback(error, deepCopy(record));
                }

                var list = callbackList[key] = callbackList[key] || [];
                list.push(callback);

                if (list.length > 1) { return; }

                try {
                    backup_object.resolveCname(domain, function (err, addresses) {
                        if (err) {
                            list.forEach(function (cb) { cb(err); });
                            delete callbackList[key];
                            return;
                        }
                        cache.set(key, addresses, function () {
                            list.forEach(function (cb) { cb(err, deepCopy(addresses)); });
                            delete callbackList[key];
                        });
                    });
                } catch (err) {
                    /*istanbul ignore next - doesn't throw in node 0.10*/
                    callback(err);
                }
            });
        };

        // override dns.reverse method
        dns.reverse = function (ip, callback) {
            var key = 'reverse_' + ip;
            cache.get(key, function (error, record) {
                if (record) {
                    return callback(error, deepCopy(record));
                }

                var list = callbackList[key] = callbackList[key] || [];
                list.push(callback);

                if (list.length > 1) { return; }

                try {
                    backup_object.reverse(ip, function (err, addresses) {
                        if (err) {
                            list.forEach(function (cb) { cb(err); });
                            delete callbackList[key];
                            return;
                        }
                        cache.set(key, addresses, function () {
                            list.forEach(function (cb) { cb(err, deepCopy(addresses)); });
                            delete callbackList[key];
                        });
                    });
                } catch (err) {
                    /*istanbul ignore next - doesn't throw in node 0.10*/
                    callback(err);
                }
            });
        };
        return dns;
};

module.exports = function(conf) {
    return new EnhanceDns(conf);
};
