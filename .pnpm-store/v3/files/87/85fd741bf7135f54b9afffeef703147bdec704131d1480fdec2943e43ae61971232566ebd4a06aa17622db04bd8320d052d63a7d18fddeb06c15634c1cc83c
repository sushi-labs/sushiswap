(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.RTKQ = {}));
})(this, (function (exports) { 'use strict';

    var __extends = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    };
    var __defProp = Object.defineProperty;
    var __defProps = Object.defineProperties;
    var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
    var __getOwnPropSymbols = Object.getOwnPropertySymbols;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __propIsEnum = Object.prototype.propertyIsEnumerable;
    var __defNormalProp = function (obj, key, value) { return key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value: value }) : obj[key] = value; };
    var __spreadValues = function (a2, b2) {
        for (var prop in b2 || (b2 = {}))
            if (__hasOwnProp.call(b2, prop))
                __defNormalProp(a2, prop, b2[prop]);
        if (__getOwnPropSymbols)
            for (var _e = 0, _f = __getOwnPropSymbols(b2); _e < _f.length; _e++) {
                var prop = _f[_e];
                if (__propIsEnum.call(b2, prop))
                    __defNormalProp(a2, prop, b2[prop]);
            }
        return a2;
    };
    var __spreadProps = function (a2, b2) { return __defProps(a2, __getOwnPropDescs(b2)); };
    var __objRest = function (source, exclude) {
        var target = {};
        for (var prop in source)
            if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
                target[prop] = source[prop];
        if (source != null && __getOwnPropSymbols)
            for (var _e = 0, _f = __getOwnPropSymbols(source); _e < _f.length; _e++) {
                var prop = _f[_e];
                if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
                    target[prop] = source[prop];
            }
        return target;
    };
    var __async = function (__this, __arguments, generator) {
        return new Promise(function (resolve, reject) {
            var fulfilled = function (value) {
                try {
                    step(generator.next(value));
                }
                catch (e2) {
                    reject(e2);
                }
            };
            var rejected = function (value) {
                try {
                    step(generator.throw(value));
                }
                catch (e2) {
                    reject(e2);
                }
            };
            var step = function (x2) { return x2.done ? resolve(x2.value) : Promise.resolve(x2.value).then(fulfilled, rejected); };
            step((generator = generator.apply(__this, __arguments)).next());
        });
    };
    // src/query/core/apiState.ts
    exports.QueryStatus = void 0;
    (function (QueryStatus2) {
        QueryStatus2["uninitialized"] = "uninitialized";
        QueryStatus2["pending"] = "pending";
        QueryStatus2["fulfilled"] = "fulfilled";
        QueryStatus2["rejected"] = "rejected";
    })(exports.QueryStatus || (exports.QueryStatus = {}));
    function getRequestStatusFlags(status) {
        return {
            status: status,
            isUninitialized: status === exports.QueryStatus.uninitialized,
            isLoading: status === exports.QueryStatus.pending,
            isSuccess: status === exports.QueryStatus.fulfilled,
            isError: status === exports.QueryStatus.rejected
        };
    }
    // src/query/utils/isAbsoluteUrl.ts
    function isAbsoluteUrl(url) {
        return new RegExp("(^|:)//").test(url);
    }
    // src/query/utils/joinUrls.ts
    var withoutTrailingSlash = function (url) { return url.replace(/\/$/, ""); };
    var withoutLeadingSlash = function (url) { return url.replace(/^\//, ""); };
    function joinUrls(base, url) {
        if (!base) {
            return url;
        }
        if (!url) {
            return base;
        }
        if (isAbsoluteUrl(url)) {
            return url;
        }
        base = withoutTrailingSlash(base);
        url = withoutLeadingSlash(url);
        return base + "/" + url;
    }
    // src/query/utils/flatten.ts
    var flatten = function (arr) { return [].concat.apply([], arr); };
    // src/query/utils/isOnline.ts
    function isOnline() {
        return typeof navigator === "undefined" ? true : navigator.onLine === void 0 ? true : navigator.onLine;
    }
    // src/query/utils/isDocumentVisible.ts
    function isDocumentVisible() {
        if (typeof document === "undefined") {
            return true;
        }
        return document.visibilityState !== "hidden";
    }
    // ../../node_modules/immer/dist/immer.esm.js
    function n(n2) {
        for (var t2 = arguments.length, r2 = Array(t2 > 1 ? t2 - 1 : 0), e2 = 1; e2 < t2; e2++)
            r2[e2 - 1] = arguments[e2];
        {
            var i2 = Y[n2], o2 = i2 ? typeof i2 == "function" ? i2.apply(null, r2) : i2 : "unknown error nr: " + n2;
            throw Error("[Immer] " + o2);
        }
    }
    function t(n2) {
        return !!n2 && !!n2[Q];
    }
    function r(n2) {
        return !!n2 && (function (n3) {
            if (!n3 || typeof n3 != "object")
                return false;
            var t2 = Object.getPrototypeOf(n3);
            if (t2 === null)
                return true;
            var r2 = Object.hasOwnProperty.call(t2, "constructor") && t2.constructor;
            return r2 === Object || typeof r2 == "function" && Function.toString.call(r2) === Z;
        }(n2) || Array.isArray(n2) || !!n2[L] || !!n2.constructor[L] || s(n2) || v(n2));
    }
    function i(n2, t2, r2) {
        r2 === void 0 && (r2 = false), o(n2) === 0 ? (r2 ? Object.keys : nn)(n2).forEach(function (e2) {
            r2 && typeof e2 == "symbol" || t2(e2, n2[e2], n2);
        }) : n2.forEach(function (r3, e2) {
            return t2(e2, r3, n2);
        });
    }
    function o(n2) {
        var t2 = n2[Q];
        return t2 ? t2.i > 3 ? t2.i - 4 : t2.i : Array.isArray(n2) ? 1 : s(n2) ? 2 : v(n2) ? 3 : 0;
    }
    function u(n2, t2) {
        return o(n2) === 2 ? n2.has(t2) : Object.prototype.hasOwnProperty.call(n2, t2);
    }
    function a(n2, t2) {
        return o(n2) === 2 ? n2.get(t2) : n2[t2];
    }
    function f(n2, t2, r2) {
        var e2 = o(n2);
        e2 === 2 ? n2.set(t2, r2) : e2 === 3 ? (n2.delete(t2), n2.add(r2)) : n2[t2] = r2;
    }
    function c(n2, t2) {
        return n2 === t2 ? n2 !== 0 || 1 / n2 == 1 / t2 : n2 != n2 && t2 != t2;
    }
    function s(n2) {
        return X && n2 instanceof Map;
    }
    function v(n2) {
        return q && n2 instanceof Set;
    }
    function p(n2) {
        return n2.o || n2.t;
    }
    function l(n2) {
        if (Array.isArray(n2))
            return Array.prototype.slice.call(n2);
        var t2 = tn(n2);
        delete t2[Q];
        for (var r2 = nn(t2), e2 = 0; e2 < r2.length; e2++) {
            var i2 = r2[e2], o2 = t2[i2];
            o2.writable === false && (o2.writable = true, o2.configurable = true), (o2.get || o2.set) && (t2[i2] = { configurable: true, writable: true, enumerable: o2.enumerable, value: n2[i2] });
        }
        return Object.create(Object.getPrototypeOf(n2), t2);
    }
    function d(n2, e2) {
        return e2 === void 0 && (e2 = false), y(n2) || t(n2) || !r(n2) ? n2 : (o(n2) > 1 && (n2.set = n2.add = n2.clear = n2.delete = h), Object.freeze(n2), e2 && i(n2, function (n3, t2) {
            return d(t2, true);
        }, true), n2);
    }
    function h() {
        n(2);
    }
    function y(n2) {
        return n2 == null || typeof n2 != "object" || Object.isFrozen(n2);
    }
    function b(t2) {
        var r2 = rn[t2];
        return r2 || n(18, t2), r2;
    }
    function m(n2, t2) {
        rn[n2] || (rn[n2] = t2);
    }
    function _() {
        return U || n(0), U;
    }
    function j(n2, t2) {
        t2 && (b("Patches"), n2.u = [], n2.s = [], n2.v = t2);
    }
    function O(n2) {
        g(n2), n2.p.forEach(S), n2.p = null;
    }
    function g(n2) {
        n2 === U && (U = n2.l);
    }
    function w(n2) {
        return U = { p: [], l: U, h: n2, m: true, _: 0 };
    }
    function S(n2) {
        var t2 = n2[Q];
        t2.i === 0 || t2.i === 1 ? t2.j() : t2.O = true;
    }
    function P(t2, e2) {
        e2._ = e2.p.length;
        var i2 = e2.p[0], o2 = t2 !== void 0 && t2 !== i2;
        return e2.h.g || b("ES5").S(e2, t2, o2), o2 ? (i2[Q].P && (O(e2), n(4)), r(t2) && (t2 = M(e2, t2), e2.l || x(e2, t2)), e2.u && b("Patches").M(i2[Q], t2, e2.u, e2.s)) : t2 = M(e2, i2, []), O(e2), e2.u && e2.v(e2.u, e2.s), t2 !== H ? t2 : void 0;
    }
    function M(n2, t2, r2) {
        if (y(t2))
            return t2;
        var e2 = t2[Q];
        if (!e2)
            return i(t2, function (i2, o3) {
                return A(n2, e2, t2, i2, o3, r2);
            }, true), t2;
        if (e2.A !== n2)
            return t2;
        if (!e2.P)
            return x(n2, e2.t, true), e2.t;
        if (!e2.I) {
            e2.I = true, e2.A._--;
            var o2 = e2.i === 4 || e2.i === 5 ? e2.o = l(e2.k) : e2.o;
            i(e2.i === 3 ? new Set(o2) : o2, function (t3, i2) {
                return A(n2, e2, o2, t3, i2, r2);
            }), x(n2, o2, false), r2 && n2.u && b("Patches").R(e2, r2, n2.u, n2.s);
        }
        return e2.o;
    }
    function A(e2, i2, o2, a2, c2, s2) {
        if (c2 === o2 && n(5), t(c2)) {
            var v2 = M(e2, c2, s2 && i2 && i2.i !== 3 && !u(i2.D, a2) ? s2.concat(a2) : void 0);
            if (f(o2, a2, v2), !t(v2))
                return;
            e2.m = false;
        }
        if (r(c2) && !y(c2)) {
            if (!e2.h.F && e2._ < 1)
                return;
            M(e2, c2), i2 && i2.A.l || x(e2, c2);
        }
    }
    function x(n2, t2, r2) {
        r2 === void 0 && (r2 = false), n2.h.F && n2.m && d(t2, r2);
    }
    function z(n2, t2) {
        var r2 = n2[Q];
        return (r2 ? p(r2) : n2)[t2];
    }
    function I(n2, t2) {
        if (t2 in n2)
            for (var r2 = Object.getPrototypeOf(n2); r2;) {
                var e2 = Object.getOwnPropertyDescriptor(r2, t2);
                if (e2)
                    return e2;
                r2 = Object.getPrototypeOf(r2);
            }
    }
    function k(n2) {
        n2.P || (n2.P = true, n2.l && k(n2.l));
    }
    function E(n2) {
        n2.o || (n2.o = l(n2.t));
    }
    function R(n2, t2, r2) {
        var e2 = s(t2) ? b("MapSet").N(t2, r2) : v(t2) ? b("MapSet").T(t2, r2) : n2.g ? function (n3, t3) {
            var r3 = Array.isArray(n3), e3 = { i: r3 ? 1 : 0, A: t3 ? t3.A : _(), P: false, I: false, D: {}, l: t3, t: n3, k: null, o: null, j: null, C: false }, i2 = e3, o2 = en;
            r3 && (i2 = [e3], o2 = on);
            var u2 = Proxy.revocable(i2, o2), a2 = u2.revoke, f2 = u2.proxy;
            return e3.k = f2, e3.j = a2, f2;
        }(t2, r2) : b("ES5").J(t2, r2);
        return (r2 ? r2.A : _()).p.push(e2), e2;
    }
    function D(e2) {
        return t(e2) || n(22, e2), function n2(t2) {
            if (!r(t2))
                return t2;
            var e3, u2 = t2[Q], c2 = o(t2);
            if (u2) {
                if (!u2.P && (u2.i < 4 || !b("ES5").K(u2)))
                    return u2.t;
                u2.I = true, e3 = F(t2, c2), u2.I = false;
            }
            else
                e3 = F(t2, c2);
            return i(e3, function (t3, r2) {
                u2 && a(u2.t, t3) === r2 || f(e3, t3, n2(r2));
            }), c2 === 3 ? new Set(e3) : e3;
        }(e2);
    }
    function F(n2, t2) {
        switch (t2) {
            case 2:
                return new Map(n2);
            case 3:
                return Array.from(n2);
        }
        return l(n2);
    }
    function N() {
        function r2(n2, t2) {
            var r3 = s2[n2];
            return r3 ? r3.enumerable = t2 : s2[n2] = r3 = { configurable: true, enumerable: t2, get: function () {
                    var t3 = this[Q];
                    return f2(t3), en.get(t3, n2);
                }, set: function (t3) {
                    var r4 = this[Q];
                    f2(r4), en.set(r4, n2, t3);
                } }, r3;
        }
        function e2(n2) {
            for (var t2 = n2.length - 1; t2 >= 0; t2--) {
                var r3 = n2[t2][Q];
                if (!r3.P)
                    switch (r3.i) {
                        case 5:
                            a2(r3) && k(r3);
                            break;
                        case 4:
                            o2(r3) && k(r3);
                    }
            }
        }
        function o2(n2) {
            for (var t2 = n2.t, r3 = n2.k, e3 = nn(r3), i2 = e3.length - 1; i2 >= 0; i2--) {
                var o3 = e3[i2];
                if (o3 !== Q) {
                    var a3 = t2[o3];
                    if (a3 === void 0 && !u(t2, o3))
                        return true;
                    var f3 = r3[o3], s3 = f3 && f3[Q];
                    if (s3 ? s3.t !== a3 : !c(f3, a3))
                        return true;
                }
            }
            var v2 = !!t2[Q];
            return e3.length !== nn(t2).length + (v2 ? 0 : 1);
        }
        function a2(n2) {
            var t2 = n2.k;
            if (t2.length !== n2.t.length)
                return true;
            var r3 = Object.getOwnPropertyDescriptor(t2, t2.length - 1);
            return !(!r3 || r3.get);
        }
        function f2(t2) {
            t2.O && n(3, JSON.stringify(p(t2)));
        }
        var s2 = {};
        m("ES5", { J: function (n2, t2) {
                var e3 = Array.isArray(n2), i2 = function (n3, t3) {
                    if (n3) {
                        for (var e4 = Array(t3.length), i3 = 0; i3 < t3.length; i3++)
                            Object.defineProperty(e4, "" + i3, r2(i3, true));
                        return e4;
                    }
                    var o4 = tn(t3);
                    delete o4[Q];
                    for (var u2 = nn(o4), a3 = 0; a3 < u2.length; a3++) {
                        var f3 = u2[a3];
                        o4[f3] = r2(f3, n3 || !!o4[f3].enumerable);
                    }
                    return Object.create(Object.getPrototypeOf(t3), o4);
                }(e3, n2), o3 = { i: e3 ? 5 : 4, A: t2 ? t2.A : _(), P: false, I: false, D: {}, l: t2, t: n2, k: i2, o: null, O: false, C: false };
                return Object.defineProperty(i2, Q, { value: o3, writable: true }), i2;
            }, S: function (n2, r3, o3) {
                o3 ? t(r3) && r3[Q].A === n2 && e2(n2.p) : (n2.u && function n3(t2) {
                    if (t2 && typeof t2 == "object") {
                        var r4 = t2[Q];
                        if (r4) {
                            var e3 = r4.t, o4 = r4.k, f3 = r4.D, c2 = r4.i;
                            if (c2 === 4)
                                i(o4, function (t3) {
                                    t3 !== Q && (e3[t3] !== void 0 || u(e3, t3) ? f3[t3] || n3(o4[t3]) : (f3[t3] = true, k(r4)));
                                }), i(e3, function (n4) {
                                    o4[n4] !== void 0 || u(o4, n4) || (f3[n4] = false, k(r4));
                                });
                            else if (c2 === 5) {
                                if (a2(r4) && (k(r4), f3.length = true), o4.length < e3.length)
                                    for (var s3 = o4.length; s3 < e3.length; s3++)
                                        f3[s3] = false;
                                else
                                    for (var v2 = e3.length; v2 < o4.length; v2++)
                                        f3[v2] = true;
                                for (var p2 = Math.min(o4.length, e3.length), l2 = 0; l2 < p2; l2++)
                                    f3[l2] === void 0 && n3(o4[l2]);
                            }
                        }
                    }
                }(n2.p[0]), e2(n2.p));
            }, K: function (n2) {
                return n2.i === 4 ? o2(n2) : a2(n2);
            } });
    }
    function T() {
        function e2(n2) {
            if (!r(n2))
                return n2;
            if (Array.isArray(n2))
                return n2.map(e2);
            if (s(n2))
                return new Map(Array.from(n2.entries()).map(function (n3) {
                    return [n3[0], e2(n3[1])];
                }));
            if (v(n2))
                return new Set(Array.from(n2).map(e2));
            var t2 = Object.create(Object.getPrototypeOf(n2));
            for (var i2 in n2)
                t2[i2] = e2(n2[i2]);
            return u(n2, L) && (t2[L] = n2[L]), t2;
        }
        function f2(n2) {
            return t(n2) ? e2(n2) : n2;
        }
        var c2 = "add";
        m("Patches", { $: function (t2, r2) {
                return r2.forEach(function (r3) {
                    for (var i2 = r3.path, u2 = r3.op, f3 = t2, s2 = 0; s2 < i2.length - 1; s2++) {
                        var v2 = o(f3), p2 = "" + i2[s2];
                        v2 !== 0 && v2 !== 1 || p2 !== "__proto__" && p2 !== "constructor" || n(24), typeof f3 == "function" && p2 === "prototype" && n(24), typeof (f3 = a(f3, p2)) != "object" && n(15, i2.join("/"));
                    }
                    var l2 = o(f3), d2 = e2(r3.value), h2 = i2[i2.length - 1];
                    switch (u2) {
                        case "replace":
                            switch (l2) {
                                case 2:
                                    return f3.set(h2, d2);
                                case 3:
                                    n(16);
                                default:
                                    return f3[h2] = d2;
                            }
                        case c2:
                            switch (l2) {
                                case 1:
                                    return h2 === "-" ? f3.push(d2) : f3.splice(h2, 0, d2);
                                case 2:
                                    return f3.set(h2, d2);
                                case 3:
                                    return f3.add(d2);
                                default:
                                    return f3[h2] = d2;
                            }
                        case "remove":
                            switch (l2) {
                                case 1:
                                    return f3.splice(h2, 1);
                                case 2:
                                    return f3.delete(h2);
                                case 3:
                                    return f3.delete(r3.value);
                                default:
                                    return delete f3[h2];
                            }
                        default:
                            n(17, u2);
                    }
                }), t2;
            }, R: function (n2, t2, r2, e3) {
                switch (n2.i) {
                    case 0:
                    case 4:
                    case 2:
                        return function (n3, t3, r3, e4) {
                            var o2 = n3.t, s2 = n3.o;
                            i(n3.D, function (n4, i2) {
                                var v2 = a(o2, n4), p2 = a(s2, n4), l2 = i2 ? u(o2, n4) ? "replace" : c2 : "remove";
                                if (v2 !== p2 || l2 !== "replace") {
                                    var d2 = t3.concat(n4);
                                    r3.push(l2 === "remove" ? { op: l2, path: d2 } : { op: l2, path: d2, value: p2 }), e4.push(l2 === c2 ? { op: "remove", path: d2 } : l2 === "remove" ? { op: c2, path: d2, value: f2(v2) } : { op: "replace", path: d2, value: f2(v2) });
                                }
                            });
                        }(n2, t2, r2, e3);
                    case 5:
                    case 1:
                        return function (n3, t3, r3, e4) {
                            var i2 = n3.t, o2 = n3.D, u2 = n3.o;
                            if (u2.length < i2.length) {
                                var a2 = [u2, i2];
                                i2 = a2[0], u2 = a2[1];
                                var s2 = [e4, r3];
                                r3 = s2[0], e4 = s2[1];
                            }
                            for (var v2 = 0; v2 < i2.length; v2++)
                                if (o2[v2] && u2[v2] !== i2[v2]) {
                                    var p2 = t3.concat([v2]);
                                    r3.push({ op: "replace", path: p2, value: f2(u2[v2]) }), e4.push({ op: "replace", path: p2, value: f2(i2[v2]) });
                                }
                            for (var l2 = i2.length; l2 < u2.length; l2++) {
                                var d2 = t3.concat([l2]);
                                r3.push({ op: c2, path: d2, value: f2(u2[l2]) });
                            }
                            i2.length < u2.length && e4.push({ op: "replace", path: t3.concat(["length"]), value: i2.length });
                        }(n2, t2, r2, e3);
                    case 3:
                        return function (n3, t3, r3, e4) {
                            var i2 = n3.t, o2 = n3.o, u2 = 0;
                            i2.forEach(function (n4) {
                                if (!o2.has(n4)) {
                                    var i3 = t3.concat([u2]);
                                    r3.push({ op: "remove", path: i3, value: n4 }), e4.unshift({ op: c2, path: i3, value: n4 });
                                }
                                u2++;
                            }), u2 = 0, o2.forEach(function (n4) {
                                if (!i2.has(n4)) {
                                    var o3 = t3.concat([u2]);
                                    r3.push({ op: c2, path: o3, value: n4 }), e4.unshift({ op: "remove", path: o3, value: n4 });
                                }
                                u2++;
                            });
                        }(n2, t2, r2, e3);
                }
            }, M: function (n2, t2, r2, e3) {
                r2.push({ op: "replace", path: [], value: t2 === H ? void 0 : t2 }), e3.push({ op: "replace", path: [], value: n2.t });
            } });
    }
    var G;
    var U;
    var W = typeof Symbol != "undefined" && typeof Symbol("x") == "symbol";
    var X = typeof Map != "undefined";
    var q = typeof Set != "undefined";
    var B = typeof Proxy != "undefined" && Proxy.revocable !== void 0 && typeof Reflect != "undefined";
    var H = W ? Symbol.for("immer-nothing") : ((G = {})["immer-nothing"] = true, G);
    var L = W ? Symbol.for("immer-draftable") : "__$immer_draftable";
    var Q = W ? Symbol.for("immer-state") : "__$immer_state";
    var Y = { 0: "Illegal state", 1: "Immer drafts cannot have computed properties", 2: "This object has been frozen and should not be mutated", 3: function (n2) {
            return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + n2;
        }, 4: "An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.", 5: "Immer forbids circular references", 6: "The first or second argument to `produce` must be a function", 7: "The third argument to `produce` must be a function or undefined", 8: "First argument to `createDraft` must be a plain object, an array, or an immerable object", 9: "First argument to `finishDraft` must be a draft returned by `createDraft`", 10: "The given draft is already finalized", 11: "Object.defineProperty() cannot be used on an Immer draft", 12: "Object.setPrototypeOf() cannot be used on an Immer draft", 13: "Immer only supports deleting array indices", 14: "Immer only supports setting array indices and the 'length' property", 15: function (n2) {
            return "Cannot apply patch, path doesn't resolve: " + n2;
        }, 16: 'Sets cannot have "replace" patches.', 17: function (n2) {
            return "Unsupported patch operation: " + n2;
        }, 18: function (n2) {
            return "The plugin for '" + n2 + "' has not been loaded into Immer. To enable the plugin, import and call `enable" + n2 + "()` when initializing your application.";
        }, 20: "Cannot use proxies if Proxy, Proxy.revocable or Reflect are not available", 21: function (n2) {
            return "produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '" + n2 + "'";
        }, 22: function (n2) {
            return "'current' expects a draft, got: " + n2;
        }, 23: function (n2) {
            return "'original' expects a draft, got: " + n2;
        }, 24: "Patching reserved attributes like __proto__, prototype and constructor is not allowed" };
    var Z = "" + Object.prototype.constructor;
    var nn = typeof Reflect != "undefined" && Reflect.ownKeys ? Reflect.ownKeys : Object.getOwnPropertySymbols !== void 0 ? function (n2) {
        return Object.getOwnPropertyNames(n2).concat(Object.getOwnPropertySymbols(n2));
    } : Object.getOwnPropertyNames;
    var tn = Object.getOwnPropertyDescriptors || function (n2) {
        var t2 = {};
        return nn(n2).forEach(function (r2) {
            t2[r2] = Object.getOwnPropertyDescriptor(n2, r2);
        }), t2;
    };
    var rn = {};
    var en = { get: function (n2, t2) {
            if (t2 === Q)
                return n2;
            var e2 = p(n2);
            if (!u(e2, t2))
                return function (n3, t3, r2) {
                    var e3, i3 = I(t3, r2);
                    return i3 ? "value" in i3 ? i3.value : (e3 = i3.get) === null || e3 === void 0 ? void 0 : e3.call(n3.k) : void 0;
                }(n2, e2, t2);
            var i2 = e2[t2];
            return n2.I || !r(i2) ? i2 : i2 === z(n2.t, t2) ? (E(n2), n2.o[t2] = R(n2.A.h, i2, n2)) : i2;
        }, has: function (n2, t2) {
            return t2 in p(n2);
        }, ownKeys: function (n2) {
            return Reflect.ownKeys(p(n2));
        }, set: function (n2, t2, r2) {
            var e2 = I(p(n2), t2);
            if (e2 == null ? void 0 : e2.set)
                return e2.set.call(n2.k, r2), true;
            if (!n2.P) {
                var i2 = z(p(n2), t2), o2 = i2 == null ? void 0 : i2[Q];
                if (o2 && o2.t === r2)
                    return n2.o[t2] = r2, n2.D[t2] = false, true;
                if (c(r2, i2) && (r2 !== void 0 || u(n2.t, t2)))
                    return true;
                E(n2), k(n2);
            }
            return n2.o[t2] === r2 && typeof r2 != "number" && (r2 !== void 0 || t2 in n2.o) || (n2.o[t2] = r2, n2.D[t2] = true, true);
        }, deleteProperty: function (n2, t2) {
            return z(n2.t, t2) !== void 0 || t2 in n2.t ? (n2.D[t2] = false, E(n2), k(n2)) : delete n2.D[t2], n2.o && delete n2.o[t2], true;
        }, getOwnPropertyDescriptor: function (n2, t2) {
            var r2 = p(n2), e2 = Reflect.getOwnPropertyDescriptor(r2, t2);
            return e2 ? { writable: true, configurable: n2.i !== 1 || t2 !== "length", enumerable: e2.enumerable, value: r2[t2] } : e2;
        }, defineProperty: function () {
            n(11);
        }, getPrototypeOf: function (n2) {
            return Object.getPrototypeOf(n2.t);
        }, setPrototypeOf: function () {
            n(12);
        } };
    var on = {};
    i(en, function (n2, t2) {
        on[n2] = function () {
            return arguments[0] = arguments[0][0], t2.apply(this, arguments);
        };
    }), on.deleteProperty = function (t2, r2) {
        return isNaN(parseInt(r2)) && n(13), en.deleteProperty.call(this, t2[0], r2);
    }, on.set = function (t2, r2, e2) {
        return r2 !== "length" && isNaN(parseInt(r2)) && n(14), en.set.call(this, t2[0], r2, e2, t2[0]);
    };
    var un = function () {
        function e2(t2) {
            var e3 = this;
            this.g = B, this.F = true, this.produce = function (t3, i3, o2) {
                if (typeof t3 == "function" && typeof i3 != "function") {
                    var u2 = i3;
                    i3 = t3;
                    var a2 = e3;
                    return function (n2) {
                        var t4 = this;
                        n2 === void 0 && (n2 = u2);
                        for (var r2 = arguments.length, e4 = Array(r2 > 1 ? r2 - 1 : 0), o3 = 1; o3 < r2; o3++)
                            e4[o3 - 1] = arguments[o3];
                        return a2.produce(n2, function (n3) {
                            var r3;
                            return (r3 = i3).call.apply(r3, [t4, n3].concat(e4));
                        });
                    };
                }
                var f2;
                if (typeof i3 != "function" && n(6), o2 !== void 0 && typeof o2 != "function" && n(7), r(t3)) {
                    var c2 = w(e3), s2 = R(e3, t3, void 0), v2 = true;
                    try {
                        f2 = i3(s2), v2 = false;
                    }
                    finally {
                        v2 ? O(c2) : g(c2);
                    }
                    return typeof Promise != "undefined" && f2 instanceof Promise ? f2.then(function (n2) {
                        return j(c2, o2), P(n2, c2);
                    }, function (n2) {
                        throw O(c2), n2;
                    }) : (j(c2, o2), P(f2, c2));
                }
                if (!t3 || typeof t3 != "object") {
                    if ((f2 = i3(t3)) === H)
                        return;
                    return f2 === void 0 && (f2 = t3), e3.F && d(f2, true), f2;
                }
                n(21, t3);
            }, this.produceWithPatches = function (n2, t3) {
                return typeof n2 == "function" ? function (t4) {
                    for (var r3 = arguments.length, i4 = Array(r3 > 1 ? r3 - 1 : 0), o2 = 1; o2 < r3; o2++)
                        i4[o2 - 1] = arguments[o2];
                    return e3.produceWithPatches(t4, function (t5) {
                        return n2.apply(void 0, [t5].concat(i4));
                    });
                } : [e3.produce(n2, t3, function (n3, t4) {
                        r2 = n3, i3 = t4;
                    }), r2, i3];
                var r2, i3;
            }, typeof (t2 == null ? void 0 : t2.useProxies) == "boolean" && this.setUseProxies(t2.useProxies), typeof (t2 == null ? void 0 : t2.autoFreeze) == "boolean" && this.setAutoFreeze(t2.autoFreeze);
        }
        var i2 = e2.prototype;
        return i2.createDraft = function (e3) {
            r(e3) || n(8), t(e3) && (e3 = D(e3));
            var i3 = w(this), o2 = R(this, e3, void 0);
            return o2[Q].C = true, g(i3), o2;
        }, i2.finishDraft = function (t2, r2) {
            var e3 = t2 && t2[Q];
            e3 && e3.C || n(9), e3.I && n(10);
            var i3 = e3.A;
            return j(i3, r2), P(void 0, i3);
        }, i2.setAutoFreeze = function (n2) {
            this.F = n2;
        }, i2.setUseProxies = function (t2) {
            t2 && !B && n(20), this.g = t2;
        }, i2.applyPatches = function (n2, r2) {
            var e3;
            for (e3 = r2.length - 1; e3 >= 0; e3--) {
                var i3 = r2[e3];
                if (i3.path.length === 0 && i3.op === "replace") {
                    n2 = i3.value;
                    break;
                }
            }
            e3 > -1 && (r2 = r2.slice(e3 + 1));
            var o2 = b("Patches").$;
            return t(n2) ? o2(n2, r2) : this.produce(n2, function (n3) {
                return o2(n3, r2);
            });
        }, e2;
    }();
    var an = new un();
    var fn = an.produce;
    var cn = an.produceWithPatches.bind(an);
    an.setAutoFreeze.bind(an);
    an.setUseProxies.bind(an);
    var pn = an.applyPatches.bind(an);
    an.createDraft.bind(an);
    an.finishDraft.bind(an);
    var immer_esm_default = fn;
    var randomString = function randomString2() {
        return Math.random().toString(36).substring(7).split("").join(".");
    };
    var ActionTypes = {
        INIT: "@@redux/INIT" + randomString(),
        REPLACE: "@@redux/REPLACE" + randomString(),
        PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
            return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
        }
    };
    function isPlainObject(obj) {
        if (typeof obj !== "object" || obj === null)
            return false;
        var proto = obj;
        while (Object.getPrototypeOf(proto) !== null) {
            proto = Object.getPrototypeOf(proto);
        }
        return Object.getPrototypeOf(obj) === proto;
    }
    function miniKindOf(val) {
        if (val === void 0)
            return "undefined";
        if (val === null)
            return "null";
        var type = typeof val;
        switch (type) {
            case "boolean":
            case "string":
            case "number":
            case "symbol":
            case "function": {
                return type;
            }
        }
        if (Array.isArray(val))
            return "array";
        if (isDate(val))
            return "date";
        if (isError(val))
            return "error";
        var constructorName = ctorName(val);
        switch (constructorName) {
            case "Symbol":
            case "Promise":
            case "WeakMap":
            case "WeakSet":
            case "Map":
            case "Set":
                return constructorName;
        }
        return type.slice(8, -1).toLowerCase().replace(/\s/g, "");
    }
    function ctorName(val) {
        return typeof val.constructor === "function" ? val.constructor.name : null;
    }
    function isError(val) {
        return val instanceof Error || typeof val.message === "string" && val.constructor && typeof val.constructor.stackTraceLimit === "number";
    }
    function isDate(val) {
        if (val instanceof Date)
            return true;
        return typeof val.toDateString === "function" && typeof val.getDate === "function" && typeof val.setDate === "function";
    }
    function kindOf(val) {
        var typeOfVal = typeof val;
        {
            typeOfVal = miniKindOf(val);
        }
        return typeOfVal;
    }
    function warning(message) {
        if (typeof console !== "undefined" && typeof console.error === "function") {
            console.error(message);
        }
        try {
            throw new Error(message);
        }
        catch (e2) {
        }
    }
    function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
        var reducerKeys = Object.keys(reducers);
        var argumentName = action && action.type === ActionTypes.INIT ? "preloadedState argument passed to createStore" : "previous state received by the reducer";
        if (reducerKeys.length === 0) {
            return "Store does not have a valid reducer. Make sure the argument passed to combineReducers is an object whose values are reducers.";
        }
        if (!isPlainObject(inputState)) {
            return "The " + argumentName + ' has unexpected type of "' + kindOf(inputState) + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
        }
        var unexpectedKeys = Object.keys(inputState).filter(function (key) {
            return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
        });
        unexpectedKeys.forEach(function (key) {
            unexpectedKeyCache[key] = true;
        });
        if (action && action.type === ActionTypes.REPLACE)
            return;
        if (unexpectedKeys.length > 0) {
            return "Unexpected " + (unexpectedKeys.length > 1 ? "keys" : "key") + " " + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + ". ") + "Expected to find one of the known reducer keys instead: " + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
        }
    }
    function assertReducerShape(reducers) {
        Object.keys(reducers).forEach(function (key) {
            var reducer = reducers[key];
            var initialState2 = reducer(void 0, {
                type: ActionTypes.INIT
            });
            if (typeof initialState2 === "undefined") {
                throw new Error('The slice reducer for key "' + key + "\" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.");
            }
            if (typeof reducer(void 0, {
                type: ActionTypes.PROBE_UNKNOWN_ACTION()
            }) === "undefined") {
                throw new Error('The slice reducer for key "' + key + '" returned undefined when probed with a random type. ' + ("Don't try to handle '" + ActionTypes.INIT + "' or other actions in \"redux/*\" ") + "namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.");
            }
        });
    }
    function combineReducers(reducers) {
        var reducerKeys = Object.keys(reducers);
        var finalReducers = {};
        for (var i2 = 0; i2 < reducerKeys.length; i2++) {
            var key = reducerKeys[i2];
            {
                if (typeof reducers[key] === "undefined") {
                    warning('No reducer provided for key "' + key + '"');
                }
            }
            if (typeof reducers[key] === "function") {
                finalReducers[key] = reducers[key];
            }
        }
        var finalReducerKeys = Object.keys(finalReducers);
        var unexpectedKeyCache;
        {
            unexpectedKeyCache = {};
        }
        var shapeAssertionError;
        try {
            assertReducerShape(finalReducers);
        }
        catch (e2) {
            shapeAssertionError = e2;
        }
        return function combination(state, action) {
            if (state === void 0) {
                state = {};
            }
            if (shapeAssertionError) {
                throw shapeAssertionError;
            }
            {
                var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
                if (warningMessage) {
                    warning(warningMessage);
                }
            }
            var hasChanged = false;
            var nextState = {};
            for (var _i = 0; _i < finalReducerKeys.length; _i++) {
                var _key = finalReducerKeys[_i];
                var reducer = finalReducers[_key];
                var previousStateForKey = state[_key];
                var nextStateForKey = reducer(previousStateForKey, action);
                if (typeof nextStateForKey === "undefined") {
                    var actionType = action && action.type;
                    throw new Error("When called with an action of type " + (actionType ? '"' + String(actionType) + '"' : "(unknown type)") + ', the slice reducer for key "' + _key + '" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.');
                }
                nextState[_key] = nextStateForKey;
                hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
            }
            hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
            return hasChanged ? nextState : state;
        };
    }
    function compose() {
        for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
            funcs[_key] = arguments[_key];
        }
        if (funcs.length === 0) {
            return function (arg) {
                return arg;
            };
        }
        if (funcs.length === 1) {
            return funcs[0];
        }
        return funcs.reduce(function (a2, b2) {
            return function () {
                return a2(b2.apply(void 0, arguments));
            };
        });
    }
    function isCrushed() {
    }
    if (typeof isCrushed.name === "string" && isCrushed.name !== "isCrushed") {
        warning('You are currently using minified code outside of NODE_ENV === "production". This means that you are running a slower development build of Redux. You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify or setting mode to production in webpack (https://webpack.js.org/concepts/mode/) to ensure you have the correct code for your production build.');
    }
    // ../../node_modules/reselect/es/defaultMemoize.js
    var NOT_FOUND = "NOT_FOUND";
    function createSingletonCache(equals) {
        var entry;
        return {
            get: function get(key) {
                if (entry && equals(entry.key, key)) {
                    return entry.value;
                }
                return NOT_FOUND;
            },
            put: function put(key, value) {
                entry = {
                    key: key,
                    value: value
                };
            },
            getEntries: function getEntries() {
                return entry ? [entry] : [];
            },
            clear: function clear() {
                entry = void 0;
            }
        };
    }
    function createLruCache(maxSize, equals) {
        var entries = [];
        function get(key) {
            var cacheIndex = entries.findIndex(function (entry2) {
                return equals(key, entry2.key);
            });
            if (cacheIndex > -1) {
                var entry = entries[cacheIndex];
                if (cacheIndex > 0) {
                    entries.splice(cacheIndex, 1);
                    entries.unshift(entry);
                }
                return entry.value;
            }
            return NOT_FOUND;
        }
        function put(key, value) {
            if (get(key) === NOT_FOUND) {
                entries.unshift({
                    key: key,
                    value: value
                });
                if (entries.length > maxSize) {
                    entries.pop();
                }
            }
        }
        function getEntries() {
            return entries;
        }
        function clear() {
            entries = [];
        }
        return {
            get: get,
            put: put,
            getEntries: getEntries,
            clear: clear
        };
    }
    var defaultEqualityCheck = function defaultEqualityCheck2(a2, b2) {
        return a2 === b2;
    };
    function createCacheKeyComparator(equalityCheck) {
        return function areArgumentsShallowlyEqual(prev, next) {
            if (prev === null || next === null || prev.length !== next.length) {
                return false;
            }
            var length = prev.length;
            for (var i2 = 0; i2 < length; i2++) {
                if (!equalityCheck(prev[i2], next[i2])) {
                    return false;
                }
            }
            return true;
        };
    }
    function defaultMemoize(func, equalityCheckOrOptions) {
        var providedOptions = typeof equalityCheckOrOptions === "object" ? equalityCheckOrOptions : {
            equalityCheck: equalityCheckOrOptions
        };
        var _providedOptions$equa = providedOptions.equalityCheck, equalityCheck = _providedOptions$equa === void 0 ? defaultEqualityCheck : _providedOptions$equa, _providedOptions$maxS = providedOptions.maxSize, maxSize = _providedOptions$maxS === void 0 ? 1 : _providedOptions$maxS, resultEqualityCheck = providedOptions.resultEqualityCheck;
        var comparator = createCacheKeyComparator(equalityCheck);
        var cache = maxSize === 1 ? createSingletonCache(comparator) : createLruCache(maxSize, comparator);
        function memoized() {
            var value = cache.get(arguments);
            if (value === NOT_FOUND) {
                value = func.apply(null, arguments);
                if (resultEqualityCheck) {
                    var entries = cache.getEntries();
                    var matchingEntry = entries.find(function (entry) {
                        return resultEqualityCheck(entry.value, value);
                    });
                    if (matchingEntry) {
                        value = matchingEntry.value;
                    }
                }
                cache.put(arguments, value);
            }
            return value;
        }
        memoized.clearCache = function () {
            return cache.clear();
        };
        return memoized;
    }
    // ../../node_modules/reselect/es/index.js
    function getDependencies(funcs) {
        var dependencies = Array.isArray(funcs[0]) ? funcs[0] : funcs;
        if (!dependencies.every(function (dep) {
            return typeof dep === "function";
        })) {
            var dependencyTypes = dependencies.map(function (dep) {
                return typeof dep === "function" ? "function " + (dep.name || "unnamed") + "()" : typeof dep;
            }).join(", ");
            throw new Error("createSelector expects all input-selectors to be functions, but received the following types: [" + dependencyTypes + "]");
        }
        return dependencies;
    }
    function createSelectorCreator(memoize) {
        for (var _len = arguments.length, memoizeOptionsFromArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            memoizeOptionsFromArgs[_key - 1] = arguments[_key];
        }
        var createSelector2 = function createSelector3() {
            for (var _len2 = arguments.length, funcs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                funcs[_key2] = arguments[_key2];
            }
            var _recomputations = 0;
            var _lastResult;
            var directlyPassedOptions = {
                memoizeOptions: void 0
            };
            var resultFunc = funcs.pop();
            if (typeof resultFunc === "object") {
                directlyPassedOptions = resultFunc;
                resultFunc = funcs.pop();
            }
            if (typeof resultFunc !== "function") {
                throw new Error("createSelector expects an output function after the inputs, but received: [" + typeof resultFunc + "]");
            }
            var _directlyPassedOption = directlyPassedOptions, _directlyPassedOption2 = _directlyPassedOption.memoizeOptions, memoizeOptions = _directlyPassedOption2 === void 0 ? memoizeOptionsFromArgs : _directlyPassedOption2;
            var finalMemoizeOptions = Array.isArray(memoizeOptions) ? memoizeOptions : [memoizeOptions];
            var dependencies = getDependencies(funcs);
            var memoizedResultFunc = memoize.apply(void 0, [function () {
                    _recomputations++;
                    return resultFunc.apply(null, arguments);
                }].concat(finalMemoizeOptions));
            var selector = memoize(function () {
                var params = [];
                var length = dependencies.length;
                for (var i2 = 0; i2 < length; i2++) {
                    params.push(dependencies[i2].apply(null, arguments));
                }
                _lastResult = memoizedResultFunc.apply(null, params);
                return _lastResult;
            });
            Object.assign(selector, {
                resultFunc: resultFunc,
                memoizedResultFunc: memoizedResultFunc,
                dependencies: dependencies,
                lastResult: function lastResult() {
                    return _lastResult;
                },
                recomputations: function recomputations() {
                    return _recomputations;
                },
                resetRecomputations: function resetRecomputations() {
                    return _recomputations = 0;
                }
            });
            return selector;
        };
        return createSelector2;
    }
    var createSelector = /* @__PURE__ */ createSelectorCreator(defaultMemoize);
    // src/isPlainObject.ts
    function isPlainObject2(value) {
        if (typeof value !== "object" || value === null)
            return false;
        var proto = Object.getPrototypeOf(value);
        if (proto === null)
            return true;
        var baseProto = proto;
        while (Object.getPrototypeOf(baseProto) !== null) {
            baseProto = Object.getPrototypeOf(baseProto);
        }
        return proto === baseProto;
    }
    // src/utils.ts
    /** @class */ ((function (_super) {
        __extends(MiddlewareArray, _super);
        function MiddlewareArray() {
            var args = [];
            for (var _e = 0; _e < arguments.length; _e++) {
                args[_e] = arguments[_e];
            }
            var _this = _super.apply(this, args) || this;
            Object.setPrototypeOf(_this, MiddlewareArray.prototype);
            return _this;
        }
        Object.defineProperty(MiddlewareArray, Symbol.species, {
            get: function () {
                return MiddlewareArray;
            },
            enumerable: false,
            configurable: true
        });
        MiddlewareArray.prototype.concat = function () {
            var arr = [];
            for (var _e = 0; _e < arguments.length; _e++) {
                arr[_e] = arguments[_e];
            }
            return _super.prototype.concat.apply(this, arr);
        };
        MiddlewareArray.prototype.prepend = function () {
            var arr = [];
            for (var _e = 0; _e < arguments.length; _e++) {
                arr[_e] = arguments[_e];
            }
            if (arr.length === 1 && Array.isArray(arr[0])) {
                return new (MiddlewareArray.bind.apply(MiddlewareArray, __spreadArray([void 0], arr[0].concat(this))))();
            }
            return new (MiddlewareArray.bind.apply(MiddlewareArray, __spreadArray([void 0], arr.concat(this))))();
        };
        return MiddlewareArray;
    })(Array));
    function freezeDraftable(val) {
        return r(val) ? immer_esm_default(val, function () {
        }) : val;
    }
    // src/createAction.ts
    function createAction(type, prepareAction) {
        function actionCreator() {
            var args = [];
            for (var _e = 0; _e < arguments.length; _e++) {
                args[_e] = arguments[_e];
            }
            if (prepareAction) {
                var prepared = prepareAction.apply(void 0, args);
                if (!prepared) {
                    throw new Error("prepareAction did not return an object");
                }
                return __spreadValues(__spreadValues({
                    type: type,
                    payload: prepared.payload
                }, "meta" in prepared && { meta: prepared.meta }), "error" in prepared && { error: prepared.error });
            }
            return { type: type, payload: args[0] };
        }
        actionCreator.toString = function () { return "" + type; };
        actionCreator.type = type;
        actionCreator.match = function (action) { return action.type === type; };
        return actionCreator;
    }
    // src/mapBuilders.ts
    function executeReducerBuilderCallback(builderCallback) {
        var actionsMap = {};
        var actionMatchers = [];
        var defaultCaseReducer;
        var builder = {
            addCase: function (typeOrActionCreator, reducer) {
                {
                    if (actionMatchers.length > 0) {
                        throw new Error("`builder.addCase` should only be called before calling `builder.addMatcher`");
                    }
                    if (defaultCaseReducer) {
                        throw new Error("`builder.addCase` should only be called before calling `builder.addDefaultCase`");
                    }
                }
                var type = typeof typeOrActionCreator === "string" ? typeOrActionCreator : typeOrActionCreator.type;
                if (type in actionsMap) {
                    throw new Error("addCase cannot be called with two reducers for the same action type");
                }
                actionsMap[type] = reducer;
                return builder;
            },
            addMatcher: function (matcher, reducer) {
                {
                    if (defaultCaseReducer) {
                        throw new Error("`builder.addMatcher` should only be called before calling `builder.addDefaultCase`");
                    }
                }
                actionMatchers.push({ matcher: matcher, reducer: reducer });
                return builder;
            },
            addDefaultCase: function (reducer) {
                {
                    if (defaultCaseReducer) {
                        throw new Error("`builder.addDefaultCase` can only be called once");
                    }
                }
                defaultCaseReducer = reducer;
                return builder;
            }
        };
        builderCallback(builder);
        return [actionsMap, actionMatchers, defaultCaseReducer];
    }
    // src/createReducer.ts
    function isStateFunction(x2) {
        return typeof x2 === "function";
    }
    function createReducer(initialState2, mapOrBuilderCallback, actionMatchers, defaultCaseReducer) {
        if (actionMatchers === void 0) { actionMatchers = []; }
        var _e = typeof mapOrBuilderCallback === "function" ? executeReducerBuilderCallback(mapOrBuilderCallback) : [mapOrBuilderCallback, actionMatchers, defaultCaseReducer], actionsMap = _e[0], finalActionMatchers = _e[1], finalDefaultCaseReducer = _e[2];
        var getInitialState;
        if (isStateFunction(initialState2)) {
            getInitialState = function () { return freezeDraftable(initialState2()); };
        }
        else {
            var frozenInitialState_1 = freezeDraftable(initialState2);
            getInitialState = function () { return frozenInitialState_1; };
        }
        function reducer(state, action) {
            if (state === void 0) { state = getInitialState(); }
            var caseReducers = __spreadArray([
                actionsMap[action.type]
            ], finalActionMatchers.filter(function (_e) {
                var matcher = _e.matcher;
                return matcher(action);
            }).map(function (_e) {
                var reducer2 = _e.reducer;
                return reducer2;
            }));
            if (caseReducers.filter(function (cr) { return !!cr; }).length === 0) {
                caseReducers = [finalDefaultCaseReducer];
            }
            return caseReducers.reduce(function (previousState, caseReducer) {
                if (caseReducer) {
                    if (t(previousState)) {
                        var draft = previousState;
                        var result = caseReducer(draft, action);
                        if (typeof result === "undefined") {
                            return previousState;
                        }
                        return result;
                    }
                    else if (!r(previousState)) {
                        var result = caseReducer(previousState, action);
                        if (typeof result === "undefined") {
                            if (previousState === null) {
                                return previousState;
                            }
                            throw Error("A case reducer on a non-draftable value must not return undefined");
                        }
                        return result;
                    }
                    else {
                        return immer_esm_default(previousState, function (draft) {
                            return caseReducer(draft, action);
                        });
                    }
                }
                return previousState;
            }, state);
        }
        reducer.getInitialState = getInitialState;
        return reducer;
    }
    // src/createSlice.ts
    function getType(slice, actionKey) {
        return slice + "/" + actionKey;
    }
    function createSlice(options) {
        var name = options.name;
        if (!name) {
            throw new Error("`name` is a required option for createSlice");
        }
        if (typeof process !== "undefined" && true) {
            if (options.initialState === void 0) {
                console.error("You must provide an `initialState` value that is not `undefined`. You may have misspelled `initialState`");
            }
        }
        var initialState2 = typeof options.initialState == "function" ? options.initialState : freezeDraftable(options.initialState);
        var reducers = options.reducers || {};
        var reducerNames = Object.keys(reducers);
        var sliceCaseReducersByName = {};
        var sliceCaseReducersByType = {};
        var actionCreators = {};
        reducerNames.forEach(function (reducerName) {
            var maybeReducerWithPrepare = reducers[reducerName];
            var type = getType(name, reducerName);
            var caseReducer;
            var prepareCallback;
            if ("reducer" in maybeReducerWithPrepare) {
                caseReducer = maybeReducerWithPrepare.reducer;
                prepareCallback = maybeReducerWithPrepare.prepare;
            }
            else {
                caseReducer = maybeReducerWithPrepare;
            }
            sliceCaseReducersByName[reducerName] = caseReducer;
            sliceCaseReducersByType[type] = caseReducer;
            actionCreators[reducerName] = prepareCallback ? createAction(type, prepareCallback) : createAction(type);
        });
        function buildReducer() {
            var _e = typeof options.extraReducers === "function" ? executeReducerBuilderCallback(options.extraReducers) : [options.extraReducers], _f = _e[0], extraReducers = _f === void 0 ? {} : _f, _g = _e[1], actionMatchers = _g === void 0 ? [] : _g, _h = _e[2], defaultCaseReducer = _h === void 0 ? void 0 : _h;
            var finalCaseReducers = __spreadValues(__spreadValues({}, extraReducers), sliceCaseReducersByType);
            return createReducer(initialState2, finalCaseReducers, actionMatchers, defaultCaseReducer);
        }
        var _reducer;
        return {
            name: name,
            reducer: function (state, action) {
                if (!_reducer)
                    _reducer = buildReducer();
                return _reducer(state, action);
            },
            actions: actionCreators,
            caseReducers: sliceCaseReducersByName,
            getInitialState: function () {
                if (!_reducer)
                    _reducer = buildReducer();
                return _reducer.getInitialState();
            }
        };
    }
    // src/nanoid.ts
    var urlAlphabet = "ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW";
    var nanoid = function (size) {
        if (size === void 0) { size = 21; }
        var id = "";
        var i2 = size;
        while (i2--) {
            id += urlAlphabet[Math.random() * 64 | 0];
        }
        return id;
    };
    // src/createAsyncThunk.ts
    var commonProperties = [
        "name",
        "message",
        "stack",
        "code"
    ];
    var RejectWithValue = /** @class */ (function () {
        function RejectWithValue(payload, meta) {
            this.payload = payload;
            this.meta = meta;
        }
        return RejectWithValue;
    }());
    var FulfillWithMeta = /** @class */ (function () {
        function FulfillWithMeta(payload, meta) {
            this.payload = payload;
            this.meta = meta;
        }
        return FulfillWithMeta;
    }());
    var miniSerializeError = function (value) {
        if (typeof value === "object" && value !== null) {
            var simpleError = {};
            for (var _e = 0, commonProperties_1 = commonProperties; _e < commonProperties_1.length; _e++) {
                var property = commonProperties_1[_e];
                if (typeof value[property] === "string") {
                    simpleError[property] = value[property];
                }
            }
            return simpleError;
        }
        return { message: String(value) };
    };
    function createAsyncThunk(typePrefix, payloadCreator, options) {
        var fulfilled = createAction(typePrefix + "/fulfilled", function (payload, requestId, arg, meta) { return ({
            payload: payload,
            meta: __spreadProps(__spreadValues({}, meta || {}), {
                arg: arg,
                requestId: requestId,
                requestStatus: "fulfilled"
            })
        }); });
        var pending = createAction(typePrefix + "/pending", function (requestId, arg, meta) { return ({
            payload: void 0,
            meta: __spreadProps(__spreadValues({}, meta || {}), {
                arg: arg,
                requestId: requestId,
                requestStatus: "pending"
            })
        }); });
        var rejected = createAction(typePrefix + "/rejected", function (error, requestId, arg, payload, meta) { return ({
            payload: payload,
            error: (options && options.serializeError || miniSerializeError)(error || "Rejected"),
            meta: __spreadProps(__spreadValues({}, meta || {}), {
                arg: arg,
                requestId: requestId,
                rejectedWithValue: !!payload,
                requestStatus: "rejected",
                aborted: (error == null ? void 0 : error.name) === "AbortError",
                condition: (error == null ? void 0 : error.name) === "ConditionError"
            })
        }); });
        var displayedWarning = false;
        var AC = typeof AbortController !== "undefined" ? AbortController : /** @class */ (function () {
            function class_1() {
                this.signal = {
                    aborted: false,
                    addEventListener: function () {
                    },
                    dispatchEvent: function () {
                        return false;
                    },
                    onabort: function () {
                    },
                    removeEventListener: function () {
                    },
                    reason: void 0,
                    throwIfAborted: function () {
                    }
                };
            }
            class_1.prototype.abort = function () {
                {
                    if (!displayedWarning) {
                        displayedWarning = true;
                        console.info("This platform does not implement AbortController. \nIf you want to use the AbortController to react to `abort` events, please consider importing a polyfill like 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'.");
                    }
                }
            };
            return class_1;
        }());
        function actionCreator(arg) {
            return function (dispatch, getState, extra) {
                var requestId = (options == null ? void 0 : options.idGenerator) ? options.idGenerator(arg) : nanoid();
                var abortController = new AC();
                var abortReason;
                var abortedPromise = new Promise(function (_2, reject) { return abortController.signal.addEventListener("abort", function () { return reject({ name: "AbortError", message: abortReason || "Aborted" }); }); });
                var started = false;
                function abort(reason) {
                    if (started) {
                        abortReason = reason;
                        abortController.abort();
                    }
                }
                var promise = function () {
                    return __async(this, null, function () {
                        var _a, _b, finalAction, conditionResult, err_1, skipDispatch;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    _e.trys.push([0, 4, , 5]);
                                    conditionResult = (_a = options == null ? void 0 : options.condition) == null ? void 0 : _a.call(options, arg, { getState: getState, extra: extra });
                                    if (!isThenable(conditionResult)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, conditionResult];
                                case 1:
                                    conditionResult = _e.sent();
                                    _e.label = 2;
                                case 2:
                                    if (conditionResult === false) {
                                        throw {
                                            name: "ConditionError",
                                            message: "Aborted due to condition callback returning false."
                                        };
                                    }
                                    started = true;
                                    dispatch(pending(requestId, arg, (_b = options == null ? void 0 : options.getPendingMeta) == null ? void 0 : _b.call(options, { requestId: requestId, arg: arg }, { getState: getState, extra: extra })));
                                    return [4 /*yield*/, Promise.race([
                                            abortedPromise,
                                            Promise.resolve(payloadCreator(arg, {
                                                dispatch: dispatch,
                                                getState: getState,
                                                extra: extra,
                                                requestId: requestId,
                                                signal: abortController.signal,
                                                rejectWithValue: function (value, meta) {
                                                    return new RejectWithValue(value, meta);
                                                },
                                                fulfillWithValue: function (value, meta) {
                                                    return new FulfillWithMeta(value, meta);
                                                }
                                            })).then(function (result) {
                                                if (result instanceof RejectWithValue) {
                                                    throw result;
                                                }
                                                if (result instanceof FulfillWithMeta) {
                                                    return fulfilled(result.payload, requestId, arg, result.meta);
                                                }
                                                return fulfilled(result, requestId, arg);
                                            })
                                        ])];
                                case 3:
                                    finalAction = _e.sent();
                                    return [3 /*break*/, 5];
                                case 4:
                                    err_1 = _e.sent();
                                    finalAction = err_1 instanceof RejectWithValue ? rejected(null, requestId, arg, err_1.payload, err_1.meta) : rejected(err_1, requestId, arg);
                                    return [3 /*break*/, 5];
                                case 5:
                                    skipDispatch = options && !options.dispatchConditionRejection && rejected.match(finalAction) && finalAction.meta.condition;
                                    if (!skipDispatch) {
                                        dispatch(finalAction);
                                    }
                                    return [2 /*return*/, finalAction];
                            }
                        });
                    });
                }();
                return Object.assign(promise, {
                    abort: abort,
                    requestId: requestId,
                    arg: arg,
                    unwrap: function () {
                        return promise.then(unwrapResult);
                    }
                });
            };
        }
        return Object.assign(actionCreator, {
            pending: pending,
            rejected: rejected,
            fulfilled: fulfilled,
            typePrefix: typePrefix
        });
    }
    function unwrapResult(action) {
        if (action.meta && action.meta.rejectedWithValue) {
            throw action.payload;
        }
        if (action.error) {
            throw action.error;
        }
        return action.payload;
    }
    function isThenable(value) {
        return value !== null && typeof value === "object" && typeof value.then === "function";
    }
    // src/tsHelpers.ts
    var hasMatchFunction = function (v2) {
        return v2 && typeof v2.match === "function";
    };
    // src/matchers.ts
    var matches = function (matcher, action) {
        if (hasMatchFunction(matcher)) {
            return matcher.match(action);
        }
        else {
            return matcher(action);
        }
    };
    function isAnyOf() {
        var matchers = [];
        for (var _e = 0; _e < arguments.length; _e++) {
            matchers[_e] = arguments[_e];
        }
        return function (action) {
            return matchers.some(function (matcher) { return matches(matcher, action); });
        };
    }
    function isAllOf() {
        var matchers = [];
        for (var _e = 0; _e < arguments.length; _e++) {
            matchers[_e] = arguments[_e];
        }
        return function (action) {
            return matchers.every(function (matcher) { return matches(matcher, action); });
        };
    }
    function hasExpectedRequestMetadata(action, validStatus) {
        if (!action || !action.meta)
            return false;
        var hasValidRequestId = typeof action.meta.requestId === "string";
        var hasValidRequestStatus = validStatus.indexOf(action.meta.requestStatus) > -1;
        return hasValidRequestId && hasValidRequestStatus;
    }
    function isAsyncThunkArray(a2) {
        return typeof a2[0] === "function" && "pending" in a2[0] && "fulfilled" in a2[0] && "rejected" in a2[0];
    }
    function isPending() {
        var asyncThunks = [];
        for (var _e = 0; _e < arguments.length; _e++) {
            asyncThunks[_e] = arguments[_e];
        }
        if (asyncThunks.length === 0) {
            return function (action) { return hasExpectedRequestMetadata(action, ["pending"]); };
        }
        if (!isAsyncThunkArray(asyncThunks)) {
            return isPending()(asyncThunks[0]);
        }
        return function (action) {
            var matchers = asyncThunks.map(function (asyncThunk) { return asyncThunk.pending; });
            var combinedMatcher = isAnyOf.apply(void 0, matchers);
            return combinedMatcher(action);
        };
    }
    function isRejected() {
        var asyncThunks = [];
        for (var _e = 0; _e < arguments.length; _e++) {
            asyncThunks[_e] = arguments[_e];
        }
        if (asyncThunks.length === 0) {
            return function (action) { return hasExpectedRequestMetadata(action, ["rejected"]); };
        }
        if (!isAsyncThunkArray(asyncThunks)) {
            return isRejected()(asyncThunks[0]);
        }
        return function (action) {
            var matchers = asyncThunks.map(function (asyncThunk) { return asyncThunk.rejected; });
            var combinedMatcher = isAnyOf.apply(void 0, matchers);
            return combinedMatcher(action);
        };
    }
    function isRejectedWithValue() {
        var asyncThunks = [];
        for (var _e = 0; _e < arguments.length; _e++) {
            asyncThunks[_e] = arguments[_e];
        }
        var hasFlag = function (action) {
            return action && action.meta && action.meta.rejectedWithValue;
        };
        if (asyncThunks.length === 0) {
            return function (action) {
                var combinedMatcher = isAllOf(isRejected.apply(void 0, asyncThunks), hasFlag);
                return combinedMatcher(action);
            };
        }
        if (!isAsyncThunkArray(asyncThunks)) {
            return isRejectedWithValue()(asyncThunks[0]);
        }
        return function (action) {
            var combinedMatcher = isAllOf(isRejected.apply(void 0, asyncThunks), hasFlag);
            return combinedMatcher(action);
        };
    }
    function isFulfilled() {
        var asyncThunks = [];
        for (var _e = 0; _e < arguments.length; _e++) {
            asyncThunks[_e] = arguments[_e];
        }
        if (asyncThunks.length === 0) {
            return function (action) { return hasExpectedRequestMetadata(action, ["fulfilled"]); };
        }
        if (!isAsyncThunkArray(asyncThunks)) {
            return isFulfilled()(asyncThunks[0]);
        }
        return function (action) {
            var matchers = asyncThunks.map(function (asyncThunk) { return asyncThunk.fulfilled; });
            var combinedMatcher = isAnyOf.apply(void 0, matchers);
            return combinedMatcher(action);
        };
    }
    function isAsyncThunkAction() {
        var asyncThunks = [];
        for (var _e = 0; _e < arguments.length; _e++) {
            asyncThunks[_e] = arguments[_e];
        }
        if (asyncThunks.length === 0) {
            return function (action) { return hasExpectedRequestMetadata(action, ["pending", "fulfilled", "rejected"]); };
        }
        if (!isAsyncThunkArray(asyncThunks)) {
            return isAsyncThunkAction()(asyncThunks[0]);
        }
        return function (action) {
            var matchers = [];
            for (var _e = 0, asyncThunks_1 = asyncThunks; _e < asyncThunks_1.length; _e++) {
                var asyncThunk = asyncThunks_1[_e];
                matchers.push(asyncThunk.pending, asyncThunk.rejected, asyncThunk.fulfilled);
            }
            var combinedMatcher = isAnyOf.apply(void 0, matchers);
            return combinedMatcher(action);
        };
    }
    // src/index.ts
    N();
    // src/query/utils/copyWithStructuralSharing.ts
    var isPlainObject3 = isPlainObject2;
    function copyWithStructuralSharing(oldObj, newObj) {
        if (oldObj === newObj || !(isPlainObject3(oldObj) && isPlainObject3(newObj) || Array.isArray(oldObj) && Array.isArray(newObj))) {
            return newObj;
        }
        var newKeys = Object.keys(newObj);
        var oldKeys = Object.keys(oldObj);
        var isSameObject = newKeys.length === oldKeys.length;
        var mergeObj = Array.isArray(newObj) ? [] : {};
        for (var _e = 0, newKeys_1 = newKeys; _e < newKeys_1.length; _e++) {
            var key = newKeys_1[_e];
            mergeObj[key] = copyWithStructuralSharing(oldObj[key], newObj[key]);
            if (isSameObject)
                isSameObject = oldObj[key] === mergeObj[key];
        }
        return isSameObject ? oldObj : mergeObj;
    }
    // src/query/fetchBaseQuery.ts
    var defaultFetchFn = function () {
        var args = [];
        for (var _e = 0; _e < arguments.length; _e++) {
            args[_e] = arguments[_e];
        }
        return fetch.apply(void 0, args);
    };
    var defaultValidateStatus = function (response) { return response.status >= 200 && response.status <= 299; };
    var isJsonContentType = function (headers) {
        var _a, _b;
        return (_b = (_a = headers.get("content-type")) == null ? void 0 : _a.trim()) == null ? void 0 : _b.startsWith("application/json");
    };
    var handleResponse = function (response, responseHandler) { return __async(void 0, null, function () {
        var text;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (typeof responseHandler === "function") {
                        return [2 /*return*/, responseHandler(response)];
                    }
                    if (responseHandler === "text") {
                        return [2 /*return*/, response.text()];
                    }
                    if (!(responseHandler === "json")) return [3 /*break*/, 2];
                    return [4 /*yield*/, response.text()];
                case 1:
                    text = _e.sent();
                    return [2 /*return*/, text.length ? JSON.parse(text) : null];
                case 2: return [2 /*return*/];
            }
        });
    }); };
    function stripUndefined(obj) {
        if (!isPlainObject2(obj)) {
            return obj;
        }
        var copy = __spreadValues({}, obj);
        for (var _e = 0, _f = Object.entries(copy); _e < _f.length; _e++) {
            var _g = _f[_e], k2 = _g[0], v2 = _g[1];
            if (typeof v2 === "undefined")
                delete copy[k2];
        }
        return copy;
    }
    function fetchBaseQuery(_a) {
        var _this = this;
        if (_a === void 0) { _a = {}; }
        var _b = _a, baseUrl = _b.baseUrl, _e = _b.prepareHeaders, prepareHeaders = _e === void 0 ? function (x2) { return x2; } : _e, _f = _b.fetchFn, fetchFn = _f === void 0 ? defaultFetchFn : _f, paramsSerializer = _b.paramsSerializer, baseFetchOptions = __objRest(_b, [
            "baseUrl",
            "prepareHeaders",
            "fetchFn",
            "paramsSerializer"
        ]);
        if (typeof fetch === "undefined" && fetchFn === defaultFetchFn) {
            console.warn("Warning: `fetch` is not available. Please supply a custom `fetchFn` property to use `fetchBaseQuery` on SSR environments.");
        }
        return function (arg, api) { return __async(_this, null, function () {
            var signal, getState, extra, endpoint, forced, type, meta, _a2, url, _e, method, _f, headers, _g, body, _h, params, _j, responseHandler, _k, validateStatus, rest, config, _l, isJsonifiable, divider, query, request, requestClone, response, e2_1, responseClone, resultData, responseText, handleResponseError_1, e2_2;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        signal = api.signal, getState = api.getState, extra = api.extra, endpoint = api.endpoint, forced = api.forced, type = api.type;
                        _a2 = typeof arg == "string" ? { url: arg } : arg, url = _a2.url, _e = _a2.method, method = _e === void 0 ? "GET" : _e, _f = _a2.headers, headers = _f === void 0 ? new Headers({}) : _f, _g = _a2.body, body = _g === void 0 ? void 0 : _g, _h = _a2.params, params = _h === void 0 ? void 0 : _h, _j = _a2.responseHandler, responseHandler = _j === void 0 ? "json" : _j, _k = _a2.validateStatus, validateStatus = _k === void 0 ? defaultValidateStatus : _k, rest = __objRest(_a2, [
                            "url",
                            "method",
                            "headers",
                            "body",
                            "params",
                            "responseHandler",
                            "validateStatus"
                        ]);
                        config = __spreadValues(__spreadProps(__spreadValues({}, baseFetchOptions), {
                            method: method,
                            signal: signal,
                            body: body
                        }), rest);
                        _l = config;
                        return [4 /*yield*/, prepareHeaders(new Headers(stripUndefined(headers)), { getState: getState, extra: extra, endpoint: endpoint, forced: forced, type: type })];
                    case 1:
                        _l.headers = _m.sent();
                        isJsonifiable = function (body2) { return typeof body2 === "object" && (isPlainObject2(body2) || Array.isArray(body2) || typeof body2.toJSON === "function"); };
                        if (!config.headers.has("content-type") && isJsonifiable(body)) {
                            config.headers.set("content-type", "application/json");
                        }
                        if (isJsonifiable(body) && isJsonContentType(config.headers)) {
                            config.body = JSON.stringify(body);
                        }
                        if (params) {
                            divider = ~url.indexOf("?") ? "&" : "?";
                            query = paramsSerializer ? paramsSerializer(params) : new URLSearchParams(stripUndefined(params));
                            url += divider + query;
                        }
                        url = joinUrls(baseUrl, url);
                        request = new Request(url, config);
                        requestClone = request.clone();
                        meta = { request: requestClone };
                        _m.label = 2;
                    case 2:
                        _m.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fetchFn(request)];
                    case 3:
                        response = _m.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e2_1 = _m.sent();
                        return [2 /*return*/, { error: { status: "FETCH_ERROR", error: String(e2_1) }, meta: meta }];
                    case 5:
                        responseClone = response.clone();
                        meta.response = responseClone;
                        responseText = "";
                        _m.label = 6;
                    case 6:
                        _m.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, Promise.all([
                                handleResponse(response, responseHandler).then(function (r2) { return resultData = r2; }, function (e2) { return handleResponseError_1 = e2; }),
                                responseClone.text().then(function (r2) { return responseText = r2; }, function () {
                                })
                            ])];
                    case 7:
                        _m.sent();
                        if (handleResponseError_1)
                            throw handleResponseError_1;
                        return [3 /*break*/, 9];
                    case 8:
                        e2_2 = _m.sent();
                        return [2 /*return*/, {
                                error: {
                                    status: "PARSING_ERROR",
                                    originalStatus: response.status,
                                    data: responseText,
                                    error: String(e2_2)
                                },
                                meta: meta
                            }];
                    case 9: return [2 /*return*/, validateStatus(response, resultData) ? {
                            data: resultData,
                            meta: meta
                        } : {
                            error: {
                                status: response.status,
                                data: resultData
                            },
                            meta: meta
                        }];
                }
            });
        }); };
    }
    // src/query/HandledError.ts
    var HandledError = /** @class */ (function () {
        function HandledError(value, meta) {
            if (meta === void 0) { meta = void 0; }
            this.value = value;
            this.meta = meta;
        }
        return HandledError;
    }());
    // src/query/retry.ts
    function defaultBackoff(attempt, maxRetries) {
        if (attempt === void 0) { attempt = 0; }
        if (maxRetries === void 0) { maxRetries = 5; }
        return __async(this, null, function () {
            var attempts, timeout;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        attempts = Math.min(attempt, maxRetries);
                        timeout = ~~((Math.random() + 0.4) * (300 << attempts));
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(function (res) { return resolve(res); }, timeout); })];
                    case 1:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function fail(e2) {
        throw Object.assign(new HandledError({ error: e2 }), {
            throwImmediately: true
        });
    }
    var retryWithBackoff = function (baseQuery, defaultOptions) { return function (args, api, extraOptions) { return __async(void 0, null, function () {
        var options, retry2, result, e2_3;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    options = __spreadValues(__spreadValues({
                        maxRetries: 5,
                        backoff: defaultBackoff
                    }, defaultOptions), extraOptions);
                    retry2 = 0;
                    _e.label = 1;
                case 1:
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 4, , 6]);
                    return [4 /*yield*/, baseQuery(args, api, extraOptions)];
                case 3:
                    result = _e.sent();
                    if (result.error) {
                        throw new HandledError(result);
                    }
                    return [2 /*return*/, result];
                case 4:
                    e2_3 = _e.sent();
                    retry2++;
                    if (e2_3.throwImmediately || retry2 > options.maxRetries) {
                        if (e2_3 instanceof HandledError) {
                            return [2 /*return*/, e2_3.value];
                        }
                        throw e2_3;
                    }
                    return [4 /*yield*/, options.backoff(retry2, options.maxRetries)];
                case 5:
                    _e.sent();
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 1];
                case 7: return [2 /*return*/];
            }
        });
    }); }; };
    var retry = /* @__PURE__ */ Object.assign(retryWithBackoff, { fail: fail });
    // src/query/core/setupListeners.ts
    var onFocus = /* @__PURE__ */ createAction("__rtkq/focused");
    var onFocusLost = /* @__PURE__ */ createAction("__rtkq/unfocused");
    var onOnline = /* @__PURE__ */ createAction("__rtkq/online");
    var onOffline = /* @__PURE__ */ createAction("__rtkq/offline");
    var initialized = false;
    function setupListeners(dispatch, customHandler) {
        function defaultHandler() {
            var handleFocus = function () { return dispatch(onFocus()); };
            var handleFocusLost = function () { return dispatch(onFocusLost()); };
            var handleOnline = function () { return dispatch(onOnline()); };
            var handleOffline = function () { return dispatch(onOffline()); };
            var handleVisibilityChange = function () {
                if (window.document.visibilityState === "visible") {
                    handleFocus();
                }
                else {
                    handleFocusLost();
                }
            };
            if (!initialized) {
                if (typeof window !== "undefined" && window.addEventListener) {
                    window.addEventListener("visibilitychange", handleVisibilityChange, false);
                    window.addEventListener("focus", handleFocus, false);
                    window.addEventListener("online", handleOnline, false);
                    window.addEventListener("offline", handleOffline, false);
                    initialized = true;
                }
            }
            var unsubscribe = function () {
                window.removeEventListener("focus", handleFocus);
                window.removeEventListener("visibilitychange", handleVisibilityChange);
                window.removeEventListener("online", handleOnline);
                window.removeEventListener("offline", handleOffline);
                initialized = false;
            };
            return unsubscribe;
        }
        return customHandler ? customHandler(dispatch, { onFocus: onFocus, onFocusLost: onFocusLost, onOffline: onOffline, onOnline: onOnline }) : defaultHandler();
    }
    // src/query/endpointDefinitions.ts
    var DefinitionType;
    (function (DefinitionType2) {
        DefinitionType2["query"] = "query";
        DefinitionType2["mutation"] = "mutation";
    })(DefinitionType || (DefinitionType = {}));
    function isQueryDefinition(e2) {
        return e2.type === DefinitionType.query;
    }
    function isMutationDefinition(e2) {
        return e2.type === DefinitionType.mutation;
    }
    function calculateProvidedBy(description, result, error, queryArg, meta, assertTagTypes) {
        if (isFunction(description)) {
            return description(result, error, queryArg, meta).map(expandTagDescription).map(assertTagTypes);
        }
        if (Array.isArray(description)) {
            return description.map(expandTagDescription).map(assertTagTypes);
        }
        return [];
    }
    function isFunction(t2) {
        return typeof t2 === "function";
    }
    function expandTagDescription(description) {
        return typeof description === "string" ? { type: description } : description;
    }
    // src/query/core/buildThunks.ts
    function defaultTransformResponse(baseQueryReturnValue) {
        return baseQueryReturnValue;
    }
    function buildThunks(_e) {
        var _this = this;
        var reducerPath = _e.reducerPath, baseQuery = _e.baseQuery, endpointDefinitions = _e.context.endpointDefinitions, serializeQueryArgs = _e.serializeQueryArgs, api = _e.api;
        var patchQueryData = function (endpointName, args, patches) { return function (dispatch) {
            var endpointDefinition = endpointDefinitions[endpointName];
            dispatch(api.internalActions.queryResultPatched({
                queryCacheKey: serializeQueryArgs({
                    queryArgs: args,
                    endpointDefinition: endpointDefinition,
                    endpointName: endpointName
                }),
                patches: patches
            }));
        }; };
        var updateQueryData = function (endpointName, args, updateRecipe) { return function (dispatch, getState) {
            var _e, _f;
            var currentState = api.endpoints[endpointName].select(args)(getState());
            var ret = {
                patches: [],
                inversePatches: [],
                undo: function () { return dispatch(api.util.patchQueryData(endpointName, args, ret.inversePatches)); }
            };
            if (currentState.status === exports.QueryStatus.uninitialized) {
                return ret;
            }
            if ("data" in currentState) {
                if (r(currentState.data)) {
                    var _g = cn(currentState.data, updateRecipe), patches = _g[1], inversePatches = _g[2];
                    (_e = ret.patches).push.apply(_e, patches);
                    (_f = ret.inversePatches).push.apply(_f, inversePatches);
                }
                else {
                    var value = updateRecipe(currentState.data);
                    ret.patches.push({ op: "replace", path: [], value: value });
                    ret.inversePatches.push({
                        op: "replace",
                        path: [],
                        value: currentState.data
                    });
                }
            }
            dispatch(api.util.patchQueryData(endpointName, args, ret.patches));
            return ret;
        }; };
        var executeEndpoint = function (_0, _1) { return __async(_this, [_0, _1], function (arg, _e) {
            var endpointDefinition, transformResponse, result, baseQueryApi_1, what, err, _f, _g, key, _h, error_1;
            var signal = _e.signal, rejectWithValue = _e.rejectWithValue, fulfillWithValue = _e.fulfillWithValue, dispatch = _e.dispatch, getState = _e.getState, extra = _e.extra;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        endpointDefinition = endpointDefinitions[arg.endpointName];
                        _j.label = 1;
                    case 1:
                        _j.trys.push([1, 7, , 8]);
                        transformResponse = defaultTransformResponse;
                        result = void 0;
                        baseQueryApi_1 = {
                            signal: signal,
                            dispatch: dispatch,
                            getState: getState,
                            extra: extra,
                            endpoint: arg.endpointName,
                            type: arg.type,
                            forced: arg.type === "query" ? isForcedQuery(arg, getState()) : void 0
                        };
                        if (!endpointDefinition.query) return [3 /*break*/, 3];
                        return [4 /*yield*/, baseQuery(endpointDefinition.query(arg.originalArgs), baseQueryApi_1, endpointDefinition.extraOptions)];
                    case 2:
                        result = _j.sent();
                        if (endpointDefinition.transformResponse) {
                            transformResponse = endpointDefinition.transformResponse;
                        }
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, endpointDefinition.queryFn(arg.originalArgs, baseQueryApi_1, endpointDefinition.extraOptions, function (arg2) { return baseQuery(arg2, baseQueryApi_1, endpointDefinition.extraOptions); })];
                    case 4:
                        result = _j.sent();
                        _j.label = 5;
                    case 5:
                        if (typeof process !== "undefined" && true) {
                            what = endpointDefinition.query ? "`baseQuery`" : "`queryFn`";
                            err = void 0;
                            if (!result) {
                                err = what + " did not return anything.";
                            }
                            else if (typeof result !== "object") {
                                err = what + " did not return an object.";
                            }
                            else if (result.error && result.data) {
                                err = what + " returned an object containing both `error` and `result`.";
                            }
                            else if (result.error === void 0 && result.data === void 0) {
                                err = what + " returned an object containing neither a valid `error` and `result`. At least one of them should not be `undefined`";
                            }
                            else {
                                for (_f = 0, _g = Object.keys(result); _f < _g.length; _f++) {
                                    key = _g[_f];
                                    if (key !== "error" && key !== "data" && key !== "meta") {
                                        err = "The object returned by " + what + " has the unknown property " + key + ".";
                                        break;
                                    }
                                }
                            }
                            if (err) {
                                console.error("Error encountered handling the endpoint " + arg.endpointName + ".\n              " + err + "\n              It needs to return an object with either the shape `{ data: <value> }` or `{ error: <value> }` that may contain an optional `meta` property.\n              Object returned was:", result);
                            }
                        }
                        if (result.error)
                            throw new HandledError(result.error, result.meta);
                        _h = fulfillWithValue;
                        return [4 /*yield*/, transformResponse(result.data, result.meta, arg.originalArgs)];
                    case 6: return [2 /*return*/, _h.apply(void 0, [_j.sent(), {
                                fulfilledTimeStamp: Date.now(),
                                baseQueryMeta: result.meta
                            }])];
                    case 7:
                        error_1 = _j.sent();
                        if (error_1 instanceof HandledError) {
                            return [2 /*return*/, rejectWithValue(error_1.value, { baseQueryMeta: error_1.meta })];
                        }
                        if (typeof process !== "undefined" && true) {
                            console.error("An unhandled error occured processing a request for the endpoint \"" + arg.endpointName + "\".\nIn the case of an unhandled error, no tags will be \"provided\" or \"invalidated\".", error_1);
                        }
                        else {
                            console.error(error_1);
                        }
                        throw error_1;
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        function isForcedQuery(arg, state) {
            var _a, _b, _c, _d;
            var requestState = (_b = (_a = state[reducerPath]) == null ? void 0 : _a.queries) == null ? void 0 : _b[arg.queryCacheKey];
            var baseFetchOnMountOrArgChange = (_c = state[reducerPath]) == null ? void 0 : _c.config.refetchOnMountOrArgChange;
            var fulfilledVal = requestState == null ? void 0 : requestState.fulfilledTimeStamp;
            var refetchVal = (_d = arg.forceRefetch) != null ? _d : arg.subscribe && baseFetchOnMountOrArgChange;
            if (refetchVal) {
                return refetchVal === true || (Number(new Date()) - Number(fulfilledVal)) / 1e3 >= refetchVal;
            }
            return false;
        }
        var queryThunk = createAsyncThunk(reducerPath + "/executeQuery", executeEndpoint, {
            getPendingMeta: function () {
                return { startedTimeStamp: Date.now() };
            },
            condition: function (arg, _e) {
                var getState = _e.getState;
                var _a, _b;
                var state = getState();
                var requestState = (_b = (_a = state[reducerPath]) == null ? void 0 : _a.queries) == null ? void 0 : _b[arg.queryCacheKey];
                var fulfilledVal = requestState == null ? void 0 : requestState.fulfilledTimeStamp;
                if ((requestState == null ? void 0 : requestState.status) === "pending")
                    return false;
                if (isForcedQuery(arg, state))
                    return true;
                if (fulfilledVal)
                    return false;
                return true;
            },
            dispatchConditionRejection: true
        });
        var mutationThunk = createAsyncThunk(reducerPath + "/executeMutation", executeEndpoint, {
            getPendingMeta: function () {
                return { startedTimeStamp: Date.now() };
            }
        });
        var hasTheForce = function (options) { return "force" in options; };
        var hasMaxAge = function (options) { return "ifOlderThan" in options; };
        var prefetch = function (endpointName, arg, options) { return function (dispatch, getState) {
            var force = hasTheForce(options) && options.force;
            var maxAge = hasMaxAge(options) && options.ifOlderThan;
            var queryAction = function (force2) {
                if (force2 === void 0) { force2 = true; }
                return api.endpoints[endpointName].initiate(arg, { forceRefetch: force2 });
            };
            var latestStateValue = api.endpoints[endpointName].select(arg)(getState());
            if (force) {
                dispatch(queryAction());
            }
            else if (maxAge) {
                var lastFulfilledTs = latestStateValue == null ? void 0 : latestStateValue.fulfilledTimeStamp;
                if (!lastFulfilledTs) {
                    dispatch(queryAction());
                    return;
                }
                var shouldRetrigger = (Number(new Date()) - Number(new Date(lastFulfilledTs))) / 1e3 >= maxAge;
                if (shouldRetrigger) {
                    dispatch(queryAction());
                }
            }
            else {
                dispatch(queryAction(false));
            }
        }; };
        function matchesEndpoint(endpointName) {
            return function (action) {
                var _a, _b;
                return ((_b = (_a = action == null ? void 0 : action.meta) == null ? void 0 : _a.arg) == null ? void 0 : _b.endpointName) === endpointName;
            };
        }
        function buildMatchThunkActions(thunk, endpointName) {
            return {
                matchPending: isAllOf(isPending(thunk), matchesEndpoint(endpointName)),
                matchFulfilled: isAllOf(isFulfilled(thunk), matchesEndpoint(endpointName)),
                matchRejected: isAllOf(isRejected(thunk), matchesEndpoint(endpointName))
            };
        }
        return {
            queryThunk: queryThunk,
            mutationThunk: mutationThunk,
            prefetch: prefetch,
            updateQueryData: updateQueryData,
            patchQueryData: patchQueryData,
            buildMatchThunkActions: buildMatchThunkActions
        };
    }
    function calculateProvidedByThunk(action, type, endpointDefinitions, assertTagType) {
        return calculateProvidedBy(endpointDefinitions[action.meta.arg.endpointName][type], isFulfilled(action) ? action.payload : void 0, isRejectedWithValue(action) ? action.payload : void 0, action.meta.arg.originalArgs, "baseQueryMeta" in action.meta ? action.meta.baseQueryMeta : void 0, assertTagType);
    }
    // src/query/core/buildSlice.ts
    function updateQuerySubstateIfExists(state, queryCacheKey, update) {
        var substate = state[queryCacheKey];
        if (substate) {
            update(substate);
        }
    }
    function getMutationCacheKey(id) {
        var _a;
        return (_a = "arg" in id ? id.arg.fixedCacheKey : id.fixedCacheKey) != null ? _a : id.requestId;
    }
    function updateMutationSubstateIfExists(state, id, update) {
        var substate = state[getMutationCacheKey(id)];
        if (substate) {
            update(substate);
        }
    }
    var initialState = {};
    function buildSlice(_e) {
        var reducerPath = _e.reducerPath, queryThunk = _e.queryThunk, mutationThunk = _e.mutationThunk, _f = _e.context, definitions = _f.endpointDefinitions, apiUid = _f.apiUid, extractRehydrationInfo = _f.extractRehydrationInfo, hasRehydrationInfo = _f.hasRehydrationInfo, assertTagType = _e.assertTagType, config = _e.config;
        var resetApiState = createAction(reducerPath + "/resetApiState");
        var querySlice = createSlice({
            name: reducerPath + "/queries",
            initialState: initialState,
            reducers: {
                removeQueryResult: function (draft, _e) {
                    var queryCacheKey = _e.payload.queryCacheKey;
                    delete draft[queryCacheKey];
                },
                queryResultPatched: function (draft, _e) {
                    var _f = _e.payload, queryCacheKey = _f.queryCacheKey, patches = _f.patches;
                    updateQuerySubstateIfExists(draft, queryCacheKey, function (substate) {
                        substate.data = pn(substate.data, patches.concat());
                    });
                }
            },
            extraReducers: function (builder) {
                builder.addCase(queryThunk.pending, function (draft, _e) {
                    var meta = _e.meta, arg = _e.meta.arg;
                    var _a, _b;
                    if (arg.subscribe) {
                        (_b = draft[_a = arg.queryCacheKey]) != null ? _b : draft[_a] = {
                            status: exports.QueryStatus.uninitialized,
                            endpointName: arg.endpointName
                        };
                    }
                    updateQuerySubstateIfExists(draft, arg.queryCacheKey, function (substate) {
                        substate.status = exports.QueryStatus.pending;
                        substate.requestId = meta.requestId;
                        if (arg.originalArgs !== void 0) {
                            substate.originalArgs = arg.originalArgs;
                        }
                        substate.startedTimeStamp = meta.startedTimeStamp;
                    });
                }).addCase(queryThunk.fulfilled, function (draft, _e) {
                    var meta = _e.meta, payload = _e.payload;
                    updateQuerySubstateIfExists(draft, meta.arg.queryCacheKey, function (substate) {
                        var _a;
                        if (substate.requestId !== meta.requestId)
                            return;
                        substate.status = exports.QueryStatus.fulfilled;
                        substate.data = ((_a = definitions[meta.arg.endpointName].structuralSharing) != null ? _a : true) ? copyWithStructuralSharing(substate.data, payload) : payload;
                        delete substate.error;
                        substate.fulfilledTimeStamp = meta.fulfilledTimeStamp;
                    });
                }).addCase(queryThunk.rejected, function (draft, _e) {
                    var _f = _e.meta, condition = _f.condition, arg = _f.arg, requestId = _f.requestId, error = _e.error, payload = _e.payload;
                    updateQuerySubstateIfExists(draft, arg.queryCacheKey, function (substate) {
                        if (condition) ;
                        else {
                            if (substate.requestId !== requestId)
                                return;
                            substate.status = exports.QueryStatus.rejected;
                            substate.error = payload != null ? payload : error;
                        }
                    });
                }).addMatcher(hasRehydrationInfo, function (draft, action) {
                    var queries = extractRehydrationInfo(action).queries;
                    for (var _e = 0, _f = Object.entries(queries); _e < _f.length; _e++) {
                        var _g = _f[_e], key = _g[0], entry = _g[1];
                        if ((entry == null ? void 0 : entry.status) === exports.QueryStatus.fulfilled || (entry == null ? void 0 : entry.status) === exports.QueryStatus.rejected) {
                            draft[key] = entry;
                        }
                    }
                });
            }
        });
        var mutationSlice = createSlice({
            name: reducerPath + "/mutations",
            initialState: initialState,
            reducers: {
                removeMutationResult: function (draft, _e) {
                    var payload = _e.payload;
                    var cacheKey = getMutationCacheKey(payload);
                    if (cacheKey in draft) {
                        delete draft[cacheKey];
                    }
                }
            },
            extraReducers: function (builder) {
                builder.addCase(mutationThunk.pending, function (draft, _e) {
                    var meta = _e.meta, _f = _e.meta, requestId = _f.requestId, arg = _f.arg, startedTimeStamp = _f.startedTimeStamp;
                    if (!arg.track)
                        return;
                    draft[getMutationCacheKey(meta)] = {
                        requestId: requestId,
                        status: exports.QueryStatus.pending,
                        endpointName: arg.endpointName,
                        startedTimeStamp: startedTimeStamp
                    };
                }).addCase(mutationThunk.fulfilled, function (draft, _e) {
                    var payload = _e.payload, meta = _e.meta;
                    if (!meta.arg.track)
                        return;
                    updateMutationSubstateIfExists(draft, meta, function (substate) {
                        if (substate.requestId !== meta.requestId)
                            return;
                        substate.status = exports.QueryStatus.fulfilled;
                        substate.data = payload;
                        substate.fulfilledTimeStamp = meta.fulfilledTimeStamp;
                    });
                }).addCase(mutationThunk.rejected, function (draft, _e) {
                    var payload = _e.payload, error = _e.error, meta = _e.meta;
                    if (!meta.arg.track)
                        return;
                    updateMutationSubstateIfExists(draft, meta, function (substate) {
                        if (substate.requestId !== meta.requestId)
                            return;
                        substate.status = exports.QueryStatus.rejected;
                        substate.error = payload != null ? payload : error;
                    });
                }).addMatcher(hasRehydrationInfo, function (draft, action) {
                    var mutations = extractRehydrationInfo(action).mutations;
                    for (var _e = 0, _f = Object.entries(mutations); _e < _f.length; _e++) {
                        var _g = _f[_e], key = _g[0], entry = _g[1];
                        if (((entry == null ? void 0 : entry.status) === exports.QueryStatus.fulfilled || (entry == null ? void 0 : entry.status) === exports.QueryStatus.rejected) && key !== (entry == null ? void 0 : entry.requestId)) {
                            draft[key] = entry;
                        }
                    }
                });
            }
        });
        var invalidationSlice = createSlice({
            name: reducerPath + "/invalidation",
            initialState: initialState,
            reducers: {},
            extraReducers: function (builder) {
                builder.addCase(querySlice.actions.removeQueryResult, function (draft, _e) {
                    var queryCacheKey = _e.payload.queryCacheKey;
                    for (var _f = 0, _g = Object.values(draft); _f < _g.length; _f++) {
                        var tagTypeSubscriptions = _g[_f];
                        for (var _h = 0, _j = Object.values(tagTypeSubscriptions); _h < _j.length; _h++) {
                            var idSubscriptions = _j[_h];
                            var foundAt = idSubscriptions.indexOf(queryCacheKey);
                            if (foundAt !== -1) {
                                idSubscriptions.splice(foundAt, 1);
                            }
                        }
                    }
                }).addMatcher(hasRehydrationInfo, function (draft, action) {
                    var _a, _b, _c, _d;
                    var provided = extractRehydrationInfo(action).provided;
                    for (var _e = 0, _f = Object.entries(provided); _e < _f.length; _e++) {
                        var _g = _f[_e], type = _g[0], incomingTags = _g[1];
                        for (var _h = 0, _j = Object.entries(incomingTags); _h < _j.length; _h++) {
                            var _k = _j[_h], id = _k[0], cacheKeys = _k[1];
                            var subscribedQueries = (_d = (_b = (_a = draft[type]) != null ? _a : draft[type] = {})[_c = id || "__internal_without_id"]) != null ? _d : _b[_c] = [];
                            for (var _l = 0, cacheKeys_1 = cacheKeys; _l < cacheKeys_1.length; _l++) {
                                var queryCacheKey = cacheKeys_1[_l];
                                var alreadySubscribed = subscribedQueries.includes(queryCacheKey);
                                if (!alreadySubscribed) {
                                    subscribedQueries.push(queryCacheKey);
                                }
                            }
                        }
                    }
                }).addMatcher(isAnyOf(isFulfilled(queryThunk), isRejectedWithValue(queryThunk)), function (draft, action) {
                    var _a, _b, _c, _d;
                    var providedTags = calculateProvidedByThunk(action, "providesTags", definitions, assertTagType);
                    var queryCacheKey = action.meta.arg.queryCacheKey;
                    for (var _e = 0, providedTags_1 = providedTags; _e < providedTags_1.length; _e++) {
                        var _f = providedTags_1[_e], type = _f.type, id = _f.id;
                        var subscribedQueries = (_d = (_b = (_a = draft[type]) != null ? _a : draft[type] = {})[_c = id || "__internal_without_id"]) != null ? _d : _b[_c] = [];
                        var alreadySubscribed = subscribedQueries.includes(queryCacheKey);
                        if (!alreadySubscribed) {
                            subscribedQueries.push(queryCacheKey);
                        }
                    }
                });
            }
        });
        var subscriptionSlice = createSlice({
            name: reducerPath + "/subscriptions",
            initialState: initialState,
            reducers: {
                updateSubscriptionOptions: function (draft, _e) {
                    var _f = _e.payload, queryCacheKey = _f.queryCacheKey, requestId = _f.requestId, options = _f.options;
                    var _a;
                    if ((_a = draft == null ? void 0 : draft[queryCacheKey]) == null ? void 0 : _a[requestId]) {
                        draft[queryCacheKey][requestId] = options;
                    }
                },
                unsubscribeQueryResult: function (draft, _e) {
                    var _f = _e.payload, queryCacheKey = _f.queryCacheKey, requestId = _f.requestId;
                    if (draft[queryCacheKey]) {
                        delete draft[queryCacheKey][requestId];
                    }
                }
            },
            extraReducers: function (builder) {
                builder.addCase(querySlice.actions.removeQueryResult, function (draft, _e) {
                    var queryCacheKey = _e.payload.queryCacheKey;
                    delete draft[queryCacheKey];
                }).addCase(queryThunk.pending, function (draft, _e) {
                    var _f = _e.meta, arg = _f.arg, requestId = _f.requestId;
                    var _a, _b, _c, _d;
                    if (arg.subscribe) {
                        var substate = (_b = draft[_a = arg.queryCacheKey]) != null ? _b : draft[_a] = {};
                        substate[requestId] = (_d = (_c = arg.subscriptionOptions) != null ? _c : substate[requestId]) != null ? _d : {};
                    }
                }).addCase(queryThunk.rejected, function (draft, _e) {
                    var _f = _e.meta, condition = _f.condition, arg = _f.arg, requestId = _f.requestId; _e.error; _e.payload;
                    var _a, _b, _c, _d;
                    if (condition && arg.subscribe) {
                        var substate = (_b = draft[_a = arg.queryCacheKey]) != null ? _b : draft[_a] = {};
                        substate[requestId] = (_d = (_c = arg.subscriptionOptions) != null ? _c : substate[requestId]) != null ? _d : {};
                    }
                }).addMatcher(hasRehydrationInfo, function (draft) { return __spreadValues({}, draft); });
            }
        });
        var configSlice = createSlice({
            name: reducerPath + "/config",
            initialState: __spreadValues({
                online: isOnline(),
                focused: isDocumentVisible(),
                middlewareRegistered: false
            }, config),
            reducers: {
                middlewareRegistered: function (state, _e) {
                    var payload = _e.payload;
                    state.middlewareRegistered = state.middlewareRegistered === "conflict" || apiUid !== payload ? "conflict" : true;
                }
            },
            extraReducers: function (builder) {
                builder.addCase(onOnline, function (state) {
                    state.online = true;
                }).addCase(onOffline, function (state) {
                    state.online = false;
                }).addCase(onFocus, function (state) {
                    state.focused = true;
                }).addCase(onFocusLost, function (state) {
                    state.focused = false;
                }).addMatcher(hasRehydrationInfo, function (draft) { return __spreadValues({}, draft); });
            }
        });
        var combinedReducer = combineReducers({
            queries: querySlice.reducer,
            mutations: mutationSlice.reducer,
            provided: invalidationSlice.reducer,
            subscriptions: subscriptionSlice.reducer,
            config: configSlice.reducer
        });
        var reducer = function (state, action) { return combinedReducer(resetApiState.match(action) ? void 0 : state, action); };
        var actions = __spreadProps(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, configSlice.actions), querySlice.actions), subscriptionSlice.actions), mutationSlice.actions), {
            unsubscribeMutationResult: mutationSlice.actions.removeMutationResult,
            resetApiState: resetApiState
        });
        return { reducer: reducer, actions: actions };
    }
    // src/query/core/buildSelectors.ts
    var skipToken = /* @__PURE__ */ Symbol.for("RTKQ/skipToken");
    var skipSelector = skipToken;
    var initialSubState = {
        status: exports.QueryStatus.uninitialized
    };
    var defaultQuerySubState = /* @__PURE__ */ immer_esm_default(initialSubState, function () {
    });
    var defaultMutationSubState = /* @__PURE__ */ immer_esm_default(initialSubState, function () {
    });
    function buildSelectors(_e) {
        var serializeQueryArgs = _e.serializeQueryArgs, reducerPath = _e.reducerPath;
        return { buildQuerySelector: buildQuerySelector, buildMutationSelector: buildMutationSelector, selectInvalidatedBy: selectInvalidatedBy };
        function withRequestFlags(substate) {
            return __spreadValues(__spreadValues({}, substate), getRequestStatusFlags(substate.status));
        }
        function selectInternalState(rootState) {
            var state = rootState[reducerPath];
            {
                if (!state) {
                    if (selectInternalState.triggered)
                        return state;
                    selectInternalState.triggered = true;
                    console.error("Error: No data found at `state." + reducerPath + "`. Did you forget to add the reducer to the store?");
                }
            }
            return state;
        }
        function buildQuerySelector(endpointName, endpointDefinition) {
            return function (queryArgs) {
                var selectQuerySubState = createSelector(selectInternalState, function (internalState) {
                    var _a, _b;
                    return (_b = queryArgs === skipToken ? void 0 : (_a = internalState == null ? void 0 : internalState.queries) == null ? void 0 : _a[serializeQueryArgs({
                        queryArgs: queryArgs,
                        endpointDefinition: endpointDefinition,
                        endpointName: endpointName
                    })]) != null ? _b : defaultQuerySubState;
                });
                return createSelector(selectQuerySubState, withRequestFlags);
            };
        }
        function buildMutationSelector() {
            return function (id) {
                var _a;
                var mutationId;
                if (typeof id === "object") {
                    mutationId = (_a = getMutationCacheKey(id)) != null ? _a : skipToken;
                }
                else {
                    mutationId = id;
                }
                var selectMutationSubstate = createSelector(selectInternalState, function (internalState) {
                    var _a2, _b;
                    return (_b = mutationId === skipToken ? void 0 : (_a2 = internalState == null ? void 0 : internalState.mutations) == null ? void 0 : _a2[mutationId]) != null ? _b : defaultMutationSubState;
                });
                return createSelector(selectMutationSubstate, withRequestFlags);
            };
        }
        function selectInvalidatedBy(state, tags) {
            var _a;
            var apiState = state[reducerPath];
            var toInvalidate = new Set();
            for (var _e = 0, _f = tags.map(expandTagDescription); _e < _f.length; _e++) {
                var tag = _f[_e];
                var provided = apiState.provided[tag.type];
                if (!provided) {
                    continue;
                }
                var invalidateSubscriptions = (_a = tag.id !== void 0 ? provided[tag.id] : flatten(Object.values(provided))) != null ? _a : [];
                for (var _g = 0, invalidateSubscriptions_1 = invalidateSubscriptions; _g < invalidateSubscriptions_1.length; _g++) {
                    var invalidate = invalidateSubscriptions_1[_g];
                    toInvalidate.add(invalidate);
                }
            }
            return flatten(Array.from(toInvalidate.values()).map(function (queryCacheKey) {
                var querySubState = apiState.queries[queryCacheKey];
                return querySubState ? [
                    {
                        queryCacheKey: queryCacheKey,
                        endpointName: querySubState.endpointName,
                        originalArgs: querySubState.originalArgs
                    }
                ] : [];
            }));
        }
    }
    // src/query/defaultSerializeQueryArgs.ts
    var defaultSerializeQueryArgs = function (_e) {
        var endpointName = _e.endpointName, queryArgs = _e.queryArgs;
        return endpointName + "(" + JSON.stringify(queryArgs, function (key, value) { return isPlainObject2(value) ? Object.keys(value).sort().reduce(function (acc, key2) {
            acc[key2] = value[key2];
            return acc;
        }, {}) : value; }) + ")";
    };
    // src/query/createApi.ts
    function buildCreateApi() {
        var modules = [];
        for (var _e = 0; _e < arguments.length; _e++) {
            modules[_e] = arguments[_e];
        }
        return function baseCreateApi(options) {
            var extractRehydrationInfo = defaultMemoize(function (action) {
                var _a, _b;
                return (_b = options.extractRehydrationInfo) == null ? void 0 : _b.call(options, action, {
                    reducerPath: (_a = options.reducerPath) != null ? _a : "api"
                });
            });
            var optionsWithDefaults = __spreadProps(__spreadValues({
                reducerPath: "api",
                serializeQueryArgs: defaultSerializeQueryArgs,
                keepUnusedDataFor: 60,
                refetchOnMountOrArgChange: false,
                refetchOnFocus: false,
                refetchOnReconnect: false
            }, options), {
                extractRehydrationInfo: extractRehydrationInfo,
                tagTypes: __spreadArray([], options.tagTypes || [])
            });
            var context = {
                endpointDefinitions: {},
                batch: function (fn2) {
                    fn2();
                },
                apiUid: nanoid(),
                extractRehydrationInfo: extractRehydrationInfo,
                hasRehydrationInfo: defaultMemoize(function (action) { return extractRehydrationInfo(action) != null; })
            };
            var api = {
                injectEndpoints: injectEndpoints,
                enhanceEndpoints: function (_e) {
                    var addTagTypes = _e.addTagTypes, endpoints = _e.endpoints;
                    if (addTagTypes) {
                        for (var _f = 0, addTagTypes_1 = addTagTypes; _f < addTagTypes_1.length; _f++) {
                            var eT = addTagTypes_1[_f];
                            if (!optionsWithDefaults.tagTypes.includes(eT)) {
                                optionsWithDefaults.tagTypes.push(eT);
                            }
                        }
                    }
                    if (endpoints) {
                        for (var _g = 0, _h = Object.entries(endpoints); _g < _h.length; _g++) {
                            var _j = _h[_g], endpointName = _j[0], partialDefinition = _j[1];
                            if (typeof partialDefinition === "function") {
                                partialDefinition(context.endpointDefinitions[endpointName]);
                            }
                            else {
                                Object.assign(context.endpointDefinitions[endpointName] || {}, partialDefinition);
                            }
                        }
                    }
                    return api;
                }
            };
            var initializedModules = modules.map(function (m2) { return m2.init(api, optionsWithDefaults, context); });
            function injectEndpoints(inject) {
                var evaluatedEndpoints = inject.endpoints({
                    query: function (x2) { return __spreadProps(__spreadValues({}, x2), { type: DefinitionType.query }); },
                    mutation: function (x2) { return __spreadProps(__spreadValues({}, x2), { type: DefinitionType.mutation }); }
                });
                for (var _e = 0, _f = Object.entries(evaluatedEndpoints); _e < _f.length; _e++) {
                    var _g = _f[_e], endpointName = _g[0], definition = _g[1];
                    if (!inject.overrideExisting && endpointName in context.endpointDefinitions) {
                        if (typeof process !== "undefined" && true) {
                            console.error("called `injectEndpoints` to override already-existing endpointName " + endpointName + " without specifying `overrideExisting: true`");
                        }
                        continue;
                    }
                    context.endpointDefinitions[endpointName] = definition;
                    for (var _h = 0, initializedModules_1 = initializedModules; _h < initializedModules_1.length; _h++) {
                        var m2 = initializedModules_1[_h];
                        m2.injectEndpoint(endpointName, definition);
                    }
                }
                return api;
            }
            return api.injectEndpoints({ endpoints: options.endpoints });
        };
    }
    // src/query/fakeBaseQuery.ts
    function fakeBaseQuery() {
        return function () {
            throw new Error("When using `fakeBaseQuery`, all queries & mutations must use the `queryFn` definition syntax.");
        };
    }
    // src/query/core/buildMiddleware/cacheCollection.ts
    var build = function (_e) {
        var reducerPath = _e.reducerPath, api = _e.api, context = _e.context;
        var _f = api.internalActions, removeQueryResult = _f.removeQueryResult, unsubscribeQueryResult = _f.unsubscribeQueryResult;
        return function (mwApi) {
            var currentRemovalTimeouts = {};
            return function (next) { return function (action) {
                var _a;
                var result = next(action);
                if (unsubscribeQueryResult.match(action)) {
                    var state = mwApi.getState()[reducerPath];
                    var queryCacheKey = action.payload.queryCacheKey;
                    handleUnsubscribe(queryCacheKey, (_a = state.queries[queryCacheKey]) == null ? void 0 : _a.endpointName, mwApi, state.config);
                }
                if (api.util.resetApiState.match(action)) {
                    for (var _e = 0, _f = Object.entries(currentRemovalTimeouts); _e < _f.length; _e++) {
                        var _g = _f[_e], key = _g[0], timeout = _g[1];
                        if (timeout)
                            clearTimeout(timeout);
                        delete currentRemovalTimeouts[key];
                    }
                }
                if (context.hasRehydrationInfo(action)) {
                    var state = mwApi.getState()[reducerPath];
                    var queries = context.extractRehydrationInfo(action).queries;
                    for (var _h = 0, _j = Object.entries(queries); _h < _j.length; _h++) {
                        var _k = _j[_h], queryCacheKey = _k[0], queryState = _k[1];
                        handleUnsubscribe(queryCacheKey, queryState == null ? void 0 : queryState.endpointName, mwApi, state.config);
                    }
                }
                return result;
            }; };
            function handleUnsubscribe(queryCacheKey, endpointName, api2, config) {
                var _a;
                var endpointDefinition = context.endpointDefinitions[endpointName];
                var keepUnusedDataFor = (_a = endpointDefinition == null ? void 0 : endpointDefinition.keepUnusedDataFor) != null ? _a : config.keepUnusedDataFor;
                var currentTimeout = currentRemovalTimeouts[queryCacheKey];
                if (currentTimeout) {
                    clearTimeout(currentTimeout);
                }
                currentRemovalTimeouts[queryCacheKey] = setTimeout(function () {
                    var subscriptions = api2.getState()[reducerPath].subscriptions[queryCacheKey];
                    if (!subscriptions || Object.keys(subscriptions).length === 0) {
                        api2.dispatch(removeQueryResult({ queryCacheKey: queryCacheKey }));
                    }
                    delete currentRemovalTimeouts[queryCacheKey];
                }, keepUnusedDataFor * 1e3);
            }
        };
    };
    // src/query/core/buildMiddleware/invalidationByTags.ts
    var build2 = function (_e) {
        var reducerPath = _e.reducerPath, context = _e.context, endpointDefinitions = _e.context.endpointDefinitions, mutationThunk = _e.mutationThunk, api = _e.api, assertTagType = _e.assertTagType, refetchQuery = _e.refetchQuery;
        var removeQueryResult = api.internalActions.removeQueryResult;
        return function (mwApi) { return function (next) { return function (action) {
            var result = next(action);
            if (isAnyOf(isFulfilled(mutationThunk), isRejectedWithValue(mutationThunk))(action)) {
                invalidateTags(calculateProvidedByThunk(action, "invalidatesTags", endpointDefinitions, assertTagType), mwApi);
            }
            if (api.util.invalidateTags.match(action)) {
                invalidateTags(calculateProvidedBy(action.payload, void 0, void 0, void 0, void 0, assertTagType), mwApi);
            }
            return result;
        }; }; };
        function invalidateTags(tags, mwApi) {
            var rootState = mwApi.getState();
            var state = rootState[reducerPath];
            var toInvalidate = api.util.selectInvalidatedBy(rootState, tags);
            context.batch(function () {
                var valuesArray = Array.from(toInvalidate.values());
                for (var _e = 0, valuesArray_1 = valuesArray; _e < valuesArray_1.length; _e++) {
                    var queryCacheKey = valuesArray_1[_e].queryCacheKey;
                    var querySubState = state.queries[queryCacheKey];
                    var subscriptionSubState = state.subscriptions[queryCacheKey];
                    if (querySubState && subscriptionSubState) {
                        if (Object.keys(subscriptionSubState).length === 0) {
                            mwApi.dispatch(removeQueryResult({
                                queryCacheKey: queryCacheKey
                            }));
                        }
                        else if (querySubState.status !== exports.QueryStatus.uninitialized) {
                            mwApi.dispatch(refetchQuery(querySubState, queryCacheKey));
                        }
                        else ;
                    }
                }
            });
        }
    };
    // src/query/core/buildMiddleware/polling.ts
    var build3 = function (_e) {
        var reducerPath = _e.reducerPath, queryThunk = _e.queryThunk, api = _e.api, refetchQuery = _e.refetchQuery;
        return function (mwApi) {
            var currentPolls = {};
            return function (next) { return function (action) {
                var result = next(action);
                if (api.internalActions.updateSubscriptionOptions.match(action) || api.internalActions.unsubscribeQueryResult.match(action)) {
                    updatePollingInterval(action.payload, mwApi);
                }
                if (queryThunk.pending.match(action) || queryThunk.rejected.match(action) && action.meta.condition) {
                    updatePollingInterval(action.meta.arg, mwApi);
                }
                if (queryThunk.fulfilled.match(action) || queryThunk.rejected.match(action) && !action.meta.condition) {
                    startNextPoll(action.meta.arg, mwApi);
                }
                if (api.util.resetApiState.match(action)) {
                    clearPolls();
                }
                return result;
            }; };
            function startNextPoll(_e, api2) {
                var queryCacheKey = _e.queryCacheKey;
                var state = api2.getState()[reducerPath];
                var querySubState = state.queries[queryCacheKey];
                var subscriptions = state.subscriptions[queryCacheKey];
                if (!querySubState || querySubState.status === exports.QueryStatus.uninitialized)
                    return;
                var lowestPollingInterval = findLowestPollingInterval(subscriptions);
                if (!Number.isFinite(lowestPollingInterval))
                    return;
                var currentPoll = currentPolls[queryCacheKey];
                if (currentPoll == null ? void 0 : currentPoll.timeout) {
                    clearTimeout(currentPoll.timeout);
                    currentPoll.timeout = void 0;
                }
                var nextPollTimestamp = Date.now() + lowestPollingInterval;
                var currentInterval = currentPolls[queryCacheKey] = {
                    nextPollTimestamp: nextPollTimestamp,
                    pollingInterval: lowestPollingInterval,
                    timeout: setTimeout(function () {
                        currentInterval.timeout = void 0;
                        api2.dispatch(refetchQuery(querySubState, queryCacheKey));
                    }, lowestPollingInterval)
                };
            }
            function updatePollingInterval(_e, api2) {
                var queryCacheKey = _e.queryCacheKey;
                var state = api2.getState()[reducerPath];
                var querySubState = state.queries[queryCacheKey];
                var subscriptions = state.subscriptions[queryCacheKey];
                if (!querySubState || querySubState.status === exports.QueryStatus.uninitialized) {
                    return;
                }
                var lowestPollingInterval = findLowestPollingInterval(subscriptions);
                if (!Number.isFinite(lowestPollingInterval)) {
                    cleanupPollForKey(queryCacheKey);
                    return;
                }
                var currentPoll = currentPolls[queryCacheKey];
                var nextPollTimestamp = Date.now() + lowestPollingInterval;
                if (!currentPoll || nextPollTimestamp < currentPoll.nextPollTimestamp) {
                    startNextPoll({ queryCacheKey: queryCacheKey }, api2);
                }
            }
            function cleanupPollForKey(key) {
                var existingPoll = currentPolls[key];
                if (existingPoll == null ? void 0 : existingPoll.timeout) {
                    clearTimeout(existingPoll.timeout);
                }
                delete currentPolls[key];
            }
            function clearPolls() {
                for (var _e = 0, _f = Object.keys(currentPolls); _e < _f.length; _e++) {
                    var key = _f[_e];
                    cleanupPollForKey(key);
                }
            }
        };
        function findLowestPollingInterval(subscribers) {
            if (subscribers === void 0) { subscribers = {}; }
            var lowestPollingInterval = Number.POSITIVE_INFINITY;
            for (var _e = 0, _f = Object.values(subscribers); _e < _f.length; _e++) {
                var subscription = _f[_e];
                if (!!subscription.pollingInterval)
                    lowestPollingInterval = Math.min(subscription.pollingInterval, lowestPollingInterval);
            }
            return lowestPollingInterval;
        }
    };
    // src/query/core/buildMiddleware/windowEventHandling.ts
    var build4 = function (_e) {
        var reducerPath = _e.reducerPath, context = _e.context, api = _e.api, refetchQuery = _e.refetchQuery;
        var removeQueryResult = api.internalActions.removeQueryResult;
        return function (mwApi) { return function (next) { return function (action) {
            var result = next(action);
            if (onFocus.match(action)) {
                refetchValidQueries(mwApi, "refetchOnFocus");
            }
            if (onOnline.match(action)) {
                refetchValidQueries(mwApi, "refetchOnReconnect");
            }
            return result;
        }; }; };
        function refetchValidQueries(api2, type) {
            var state = api2.getState()[reducerPath];
            var queries = state.queries;
            var subscriptions = state.subscriptions;
            context.batch(function () {
                for (var _e = 0, _f = Object.keys(subscriptions); _e < _f.length; _e++) {
                    var queryCacheKey = _f[_e];
                    var querySubState = queries[queryCacheKey];
                    var subscriptionSubState = subscriptions[queryCacheKey];
                    if (!subscriptionSubState || !querySubState)
                        continue;
                    var shouldRefetch = Object.values(subscriptionSubState).some(function (sub) { return sub[type] === true; }) || Object.values(subscriptionSubState).every(function (sub) { return sub[type] === void 0; }) && state.config[type];
                    if (shouldRefetch) {
                        if (Object.keys(subscriptionSubState).length === 0) {
                            api2.dispatch(removeQueryResult({
                                queryCacheKey: queryCacheKey
                            }));
                        }
                        else if (querySubState.status !== exports.QueryStatus.uninitialized) {
                            api2.dispatch(refetchQuery(querySubState, queryCacheKey));
                        }
                    }
                }
            });
        }
    };
    // src/query/core/buildMiddleware/cacheLifecycle.ts
    var neverResolvedError = new Error("Promise never resolved before cacheEntryRemoved.");
    var build5 = function (_e) {
        var api = _e.api, reducerPath = _e.reducerPath, context = _e.context, queryThunk = _e.queryThunk, mutationThunk = _e.mutationThunk;
        var isQueryThunk = isAsyncThunkAction(queryThunk);
        var isMutationThunk = isAsyncThunkAction(mutationThunk);
        var isFullfilledThunk = isFulfilled(queryThunk, mutationThunk);
        return function (mwApi) {
            var lifecycleMap = {};
            return function (next) { return function (action) {
                var stateBefore = mwApi.getState();
                var result = next(action);
                var cacheKey = getCacheKey(action);
                if (queryThunk.pending.match(action)) {
                    var oldState = stateBefore[reducerPath].queries[cacheKey];
                    var state = mwApi.getState()[reducerPath].queries[cacheKey];
                    if (!oldState && state) {
                        handleNewKey(action.meta.arg.endpointName, action.meta.arg.originalArgs, cacheKey, mwApi, action.meta.requestId);
                    }
                }
                else if (mutationThunk.pending.match(action)) {
                    var state = mwApi.getState()[reducerPath].mutations[cacheKey];
                    if (state) {
                        handleNewKey(action.meta.arg.endpointName, action.meta.arg.originalArgs, cacheKey, mwApi, action.meta.requestId);
                    }
                }
                else if (isFullfilledThunk(action)) {
                    var lifecycle = lifecycleMap[cacheKey];
                    if (lifecycle == null ? void 0 : lifecycle.valueResolved) {
                        lifecycle.valueResolved({
                            data: action.payload,
                            meta: action.meta.baseQueryMeta
                        });
                        delete lifecycle.valueResolved;
                    }
                }
                else if (api.internalActions.removeQueryResult.match(action) || api.internalActions.removeMutationResult.match(action)) {
                    var lifecycle = lifecycleMap[cacheKey];
                    if (lifecycle) {
                        delete lifecycleMap[cacheKey];
                        lifecycle.cacheEntryRemoved();
                    }
                }
                else if (api.util.resetApiState.match(action)) {
                    for (var _e = 0, _f = Object.entries(lifecycleMap); _e < _f.length; _e++) {
                        var _g = _f[_e], cacheKey2 = _g[0], lifecycle = _g[1];
                        delete lifecycleMap[cacheKey2];
                        lifecycle.cacheEntryRemoved();
                    }
                }
                return result;
            }; };
            function getCacheKey(action) {
                if (isQueryThunk(action))
                    return action.meta.arg.queryCacheKey;
                if (isMutationThunk(action))
                    return action.meta.requestId;
                if (api.internalActions.removeQueryResult.match(action))
                    return action.payload.queryCacheKey;
                if (api.internalActions.removeMutationResult.match(action))
                    return getMutationCacheKey(action.payload);
                return "";
            }
            function handleNewKey(endpointName, originalArgs, queryCacheKey, mwApi2, requestId) {
                var endpointDefinition = context.endpointDefinitions[endpointName];
                var onCacheEntryAdded = endpointDefinition == null ? void 0 : endpointDefinition.onCacheEntryAdded;
                if (!onCacheEntryAdded)
                    return;
                var lifecycle = {};
                var cacheEntryRemoved = new Promise(function (resolve) {
                    lifecycle.cacheEntryRemoved = resolve;
                });
                var cacheDataLoaded = Promise.race([
                    new Promise(function (resolve) {
                        lifecycle.valueResolved = resolve;
                    }),
                    cacheEntryRemoved.then(function () {
                        throw neverResolvedError;
                    })
                ]);
                cacheDataLoaded.catch(function () {
                });
                lifecycleMap[queryCacheKey] = lifecycle;
                var selector = api.endpoints[endpointName].select(endpointDefinition.type === DefinitionType.query ? originalArgs : queryCacheKey);
                var extra = mwApi2.dispatch(function (_2, __, extra2) { return extra2; });
                var lifecycleApi = __spreadProps(__spreadValues({}, mwApi2), {
                    getCacheEntry: function () { return selector(mwApi2.getState()); },
                    requestId: requestId,
                    extra: extra,
                    updateCachedData: endpointDefinition.type === DefinitionType.query ? function (updateRecipe) { return mwApi2.dispatch(api.util.updateQueryData(endpointName, originalArgs, updateRecipe)); } : void 0,
                    cacheDataLoaded: cacheDataLoaded,
                    cacheEntryRemoved: cacheEntryRemoved
                });
                var runningHandler = onCacheEntryAdded(originalArgs, lifecycleApi);
                Promise.resolve(runningHandler).catch(function (e2) {
                    if (e2 === neverResolvedError)
                        return;
                    throw e2;
                });
            }
        };
    };
    // src/query/core/buildMiddleware/queryLifecycle.ts
    var build6 = function (_e) {
        var api = _e.api, context = _e.context, queryThunk = _e.queryThunk, mutationThunk = _e.mutationThunk;
        var isPendingThunk = isPending(queryThunk, mutationThunk);
        var isRejectedThunk = isRejected(queryThunk, mutationThunk);
        var isFullfilledThunk = isFulfilled(queryThunk, mutationThunk);
        return function (mwApi) {
            var lifecycleMap = {};
            return function (next) { return function (action) {
                var _a, _b, _c;
                var result = next(action);
                if (isPendingThunk(action)) {
                    var _e = action.meta, requestId = _e.requestId, _f = _e.arg, endpointName_1 = _f.endpointName, originalArgs_1 = _f.originalArgs;
                    var endpointDefinition = context.endpointDefinitions[endpointName_1];
                    var onQueryStarted = endpointDefinition == null ? void 0 : endpointDefinition.onQueryStarted;
                    if (onQueryStarted) {
                        var lifecycle_1 = {};
                        var queryFulfilled = new Promise(function (resolve, reject) {
                            lifecycle_1.resolve = resolve;
                            lifecycle_1.reject = reject;
                        });
                        queryFulfilled.catch(function () {
                        });
                        lifecycleMap[requestId] = lifecycle_1;
                        var selector_1 = api.endpoints[endpointName_1].select(endpointDefinition.type === DefinitionType.query ? originalArgs_1 : requestId);
                        var extra = mwApi.dispatch(function (_2, __, extra2) { return extra2; });
                        var lifecycleApi = __spreadProps(__spreadValues({}, mwApi), {
                            getCacheEntry: function () { return selector_1(mwApi.getState()); },
                            requestId: requestId,
                            extra: extra,
                            updateCachedData: endpointDefinition.type === DefinitionType.query ? function (updateRecipe) { return mwApi.dispatch(api.util.updateQueryData(endpointName_1, originalArgs_1, updateRecipe)); } : void 0,
                            queryFulfilled: queryFulfilled
                        });
                        onQueryStarted(originalArgs_1, lifecycleApi);
                    }
                }
                else if (isFullfilledThunk(action)) {
                    var _g = action.meta, requestId = _g.requestId, baseQueryMeta = _g.baseQueryMeta;
                    (_a = lifecycleMap[requestId]) == null ? void 0 : _a.resolve({
                        data: action.payload,
                        meta: baseQueryMeta
                    });
                    delete lifecycleMap[requestId];
                }
                else if (isRejectedThunk(action)) {
                    var _h = action.meta, requestId = _h.requestId, rejectedWithValue = _h.rejectedWithValue, baseQueryMeta = _h.baseQueryMeta;
                    (_c = lifecycleMap[requestId]) == null ? void 0 : _c.reject({
                        error: (_b = action.payload) != null ? _b : action.error,
                        isUnhandledError: !rejectedWithValue,
                        meta: baseQueryMeta
                    });
                    delete lifecycleMap[requestId];
                }
                return result;
            }; };
        };
    };
    // src/query/core/buildMiddleware/devMiddleware.ts
    var build7 = function (_e) {
        var api = _e.api, apiUid = _e.context.apiUid, reducerPath = _e.reducerPath;
        return function (mwApi) {
            var initialized2 = false;
            return function (next) { return function (action) {
                var _a, _b;
                if (!initialized2) {
                    initialized2 = true;
                    mwApi.dispatch(api.internalActions.middlewareRegistered(apiUid));
                }
                var result = next(action);
                if (api.util.resetApiState.match(action)) {
                    mwApi.dispatch(api.internalActions.middlewareRegistered(apiUid));
                }
                if (typeof process !== "undefined" && true) {
                    if (api.internalActions.middlewareRegistered.match(action) && action.payload === apiUid && ((_b = (_a = mwApi.getState()[reducerPath]) == null ? void 0 : _a.config) == null ? void 0 : _b.middlewareRegistered) === "conflict") {
                        console.warn("There is a mismatch between slice and middleware for the reducerPath \"" + reducerPath + "\".\nYou can only have one api per reducer path, this will lead to crashes in various situations!" + (reducerPath === "api" ? "\nIf you have multiple apis, you *have* to specify the reducerPath option when using createApi!" : ""));
                    }
                }
                return result;
            }; };
        };
    };
    // src/query/core/buildMiddleware/index.ts
    function buildMiddleware(input) {
        var reducerPath = input.reducerPath, queryThunk = input.queryThunk;
        var actions = {
            invalidateTags: createAction(reducerPath + "/invalidateTags")
        };
        var middlewares = [
            build7,
            build,
            build2,
            build3,
            build4,
            build5,
            build6
        ].map(function (build8) { return build8(__spreadProps(__spreadValues({}, input), {
            refetchQuery: refetchQuery
        })); });
        var middleware = function (mwApi) { return function (next) {
            var applied = compose.apply(void 0, middlewares.map(function (middleware2) { return middleware2(mwApi); }))(next);
            return function (action) {
                if (mwApi.getState()[reducerPath]) {
                    return applied(action);
                }
                return next(action);
            };
        }; };
        return { middleware: middleware, actions: actions };
        function refetchQuery(querySubState, queryCacheKey, override) {
            if (override === void 0) { override = {}; }
            return queryThunk(__spreadValues({
                type: "query",
                endpointName: querySubState.endpointName,
                originalArgs: querySubState.originalArgs,
                subscribe: false,
                forceRefetch: true,
                queryCacheKey: queryCacheKey
            }, override));
        }
    }
    // src/query/core/buildInitiate.ts
    function buildInitiate(_e) {
        var serializeQueryArgs = _e.serializeQueryArgs, queryThunk = _e.queryThunk, mutationThunk = _e.mutationThunk, api = _e.api, context = _e.context;
        var runningQueries = {};
        var runningMutations = {};
        var _f = api.internalActions, unsubscribeQueryResult = _f.unsubscribeQueryResult, removeMutationResult = _f.removeMutationResult, updateSubscriptionOptions = _f.updateSubscriptionOptions;
        return {
            buildInitiateQuery: buildInitiateQuery,
            buildInitiateMutation: buildInitiateMutation,
            getRunningOperationPromises: getRunningOperationPromises,
            getRunningOperationPromise: getRunningOperationPromise
        };
        function getRunningOperationPromise(endpointName, argOrRequestId) {
            var endpointDefinition = context.endpointDefinitions[endpointName];
            if (endpointDefinition.type === DefinitionType.query) {
                var queryCacheKey = serializeQueryArgs({
                    queryArgs: argOrRequestId,
                    endpointDefinition: endpointDefinition,
                    endpointName: endpointName
                });
                return runningQueries[queryCacheKey];
            }
            else {
                return runningMutations[argOrRequestId];
            }
        }
        function getRunningOperationPromises() {
            return __spreadArray(__spreadArray([], Object.values(runningQueries)), Object.values(runningMutations)).filter(function (t2) { return !!t2; });
        }
        function middlewareWarning(getState) {
            var _a, _b;
            {
                if (middlewareWarning.triggered)
                    return;
                var registered = (_b = (_a = getState()[api.reducerPath]) == null ? void 0 : _a.config) == null ? void 0 : _b.middlewareRegistered;
                if (registered !== void 0) {
                    middlewareWarning.triggered = true;
                }
                if (registered === false) {
                    console.warn("Warning: Middleware for RTK-Query API at reducerPath \"" + api.reducerPath + "\" has not been added to the store.\nFeatures like automatic cache collection, automatic refetching etc. will not be available.");
                }
            }
        }
        function buildInitiateQuery(endpointName, endpointDefinition) {
            var queryAction = function (arg, _e) {
                var _f = _e === void 0 ? {} : _e, _g = _f.subscribe, subscribe = _g === void 0 ? true : _g, forceRefetch = _f.forceRefetch, subscriptionOptions = _f.subscriptionOptions;
                return function (dispatch, getState) {
                    var queryCacheKey = serializeQueryArgs({
                        queryArgs: arg,
                        endpointDefinition: endpointDefinition,
                        endpointName: endpointName
                    });
                    var thunk = queryThunk({
                        type: "query",
                        subscribe: subscribe,
                        forceRefetch: forceRefetch,
                        subscriptionOptions: subscriptionOptions,
                        endpointName: endpointName,
                        originalArgs: arg,
                        queryCacheKey: queryCacheKey
                    });
                    var thunkResult = dispatch(thunk);
                    middlewareWarning(getState);
                    var requestId = thunkResult.requestId, abort = thunkResult.abort;
                    var statePromise = Object.assign(Promise.all([runningQueries[queryCacheKey], thunkResult]).then(function () { return api.endpoints[endpointName].select(arg)(getState()); }), {
                        arg: arg,
                        requestId: requestId,
                        subscriptionOptions: subscriptionOptions,
                        queryCacheKey: queryCacheKey,
                        abort: abort,
                        unwrap: function () {
                            return __async(this, null, function () {
                                var result;
                                return __generator(this, function (_e) {
                                    switch (_e.label) {
                                        case 0: return [4 /*yield*/, statePromise];
                                        case 1:
                                            result = _e.sent();
                                            if (result.isError) {
                                                throw result.error;
                                            }
                                            return [2 /*return*/, result.data];
                                    }
                                });
                            });
                        },
                        refetch: function () {
                            dispatch(queryAction(arg, { subscribe: false, forceRefetch: true }));
                        },
                        unsubscribe: function () {
                            if (subscribe)
                                dispatch(unsubscribeQueryResult({
                                    queryCacheKey: queryCacheKey,
                                    requestId: requestId
                                }));
                        },
                        updateSubscriptionOptions: function (options) {
                            statePromise.subscriptionOptions = options;
                            dispatch(updateSubscriptionOptions({
                                endpointName: endpointName,
                                requestId: requestId,
                                queryCacheKey: queryCacheKey,
                                options: options
                            }));
                        }
                    });
                    if (!runningQueries[queryCacheKey]) {
                        runningQueries[queryCacheKey] = statePromise;
                        statePromise.then(function () {
                            delete runningQueries[queryCacheKey];
                        });
                    }
                    return statePromise;
                };
            };
            return queryAction;
        }
        function buildInitiateMutation(endpointName) {
            return function (arg, _e) {
                var _f = _e === void 0 ? {} : _e, _g = _f.track, track = _g === void 0 ? true : _g, fixedCacheKey = _f.fixedCacheKey;
                return function (dispatch, getState) {
                    var thunk = mutationThunk({
                        type: "mutation",
                        endpointName: endpointName,
                        originalArgs: arg,
                        track: track,
                        fixedCacheKey: fixedCacheKey
                    });
                    var thunkResult = dispatch(thunk);
                    middlewareWarning(getState);
                    var requestId = thunkResult.requestId, abort = thunkResult.abort, unwrap = thunkResult.unwrap;
                    var returnValuePromise = thunkResult.unwrap().then(function (data) { return ({ data: data }); }).catch(function (error) { return ({ error: error }); });
                    var reset = function () {
                        dispatch(removeMutationResult({ requestId: requestId, fixedCacheKey: fixedCacheKey }));
                    };
                    var ret = Object.assign(returnValuePromise, {
                        arg: thunkResult.arg,
                        requestId: requestId,
                        abort: abort,
                        unwrap: unwrap,
                        unsubscribe: reset,
                        reset: reset
                    });
                    runningMutations[requestId] = ret;
                    ret.then(function () {
                        delete runningMutations[requestId];
                    });
                    if (fixedCacheKey) {
                        runningMutations[fixedCacheKey] = ret;
                        ret.then(function () {
                            if (runningMutations[fixedCacheKey] === ret)
                                delete runningMutations[fixedCacheKey];
                        });
                    }
                    return ret;
                };
            };
        }
    }
    function safeAssign(target) {
        var args = [];
        for (var _e = 1; _e < arguments.length; _e++) {
            args[_e - 1] = arguments[_e];
        }
        Object.assign.apply(Object, __spreadArray([target], args));
    }
    // src/query/core/module.ts
    var coreModuleName = /* @__PURE__ */ Symbol();
    var coreModule = function () { return ({
        name: coreModuleName,
        init: function (api, _e, context) {
            var baseQuery = _e.baseQuery, tagTypes = _e.tagTypes, reducerPath = _e.reducerPath, serializeQueryArgs = _e.serializeQueryArgs, keepUnusedDataFor = _e.keepUnusedDataFor, refetchOnMountOrArgChange = _e.refetchOnMountOrArgChange, refetchOnFocus = _e.refetchOnFocus, refetchOnReconnect = _e.refetchOnReconnect;
            T();
            var assertTagType = function (tag) {
                if (typeof process !== "undefined" && true) {
                    if (!tagTypes.includes(tag.type)) {
                        console.error("Tag type '" + tag.type + "' was used, but not specified in `tagTypes`!");
                    }
                }
                return tag;
            };
            Object.assign(api, {
                reducerPath: reducerPath,
                endpoints: {},
                internalActions: {
                    onOnline: onOnline,
                    onOffline: onOffline,
                    onFocus: onFocus,
                    onFocusLost: onFocusLost
                },
                util: {}
            });
            var _f = buildThunks({
                baseQuery: baseQuery,
                reducerPath: reducerPath,
                context: context,
                api: api,
                serializeQueryArgs: serializeQueryArgs
            }), queryThunk = _f.queryThunk, mutationThunk = _f.mutationThunk, patchQueryData = _f.patchQueryData, updateQueryData = _f.updateQueryData, prefetch = _f.prefetch, buildMatchThunkActions = _f.buildMatchThunkActions;
            var _g = buildSlice({
                context: context,
                queryThunk: queryThunk,
                mutationThunk: mutationThunk,
                reducerPath: reducerPath,
                assertTagType: assertTagType,
                config: {
                    refetchOnFocus: refetchOnFocus,
                    refetchOnReconnect: refetchOnReconnect,
                    refetchOnMountOrArgChange: refetchOnMountOrArgChange,
                    keepUnusedDataFor: keepUnusedDataFor,
                    reducerPath: reducerPath
                }
            }), reducer = _g.reducer, sliceActions = _g.actions;
            safeAssign(api.util, {
                patchQueryData: patchQueryData,
                updateQueryData: updateQueryData,
                prefetch: prefetch,
                resetApiState: sliceActions.resetApiState
            });
            safeAssign(api.internalActions, sliceActions);
            Object.defineProperty(api.util, "updateQueryResult", {
                get: function () {
                    if (typeof process !== "undefined" && true) {
                        console.warn("`api.util.updateQueryResult` has been renamed to `api.util.updateQueryData`, please change your code accordingly");
                    }
                    return api.util.updateQueryData;
                }
            });
            Object.defineProperty(api.util, "patchQueryResult", {
                get: function () {
                    if (typeof process !== "undefined" && true) {
                        console.warn("`api.util.patchQueryResult` has been renamed to `api.util.patchQueryData`, please change your code accordingly");
                    }
                    return api.util.patchQueryData;
                }
            });
            var _h = buildMiddleware({
                reducerPath: reducerPath,
                context: context,
                queryThunk: queryThunk,
                mutationThunk: mutationThunk,
                api: api,
                assertTagType: assertTagType
            }), middleware = _h.middleware, middlewareActions = _h.actions;
            safeAssign(api.util, middlewareActions);
            safeAssign(api, { reducer: reducer, middleware: middleware });
            var _j = buildSelectors({
                serializeQueryArgs: serializeQueryArgs,
                reducerPath: reducerPath
            }), buildQuerySelector = _j.buildQuerySelector, buildMutationSelector = _j.buildMutationSelector, selectInvalidatedBy = _j.selectInvalidatedBy;
            safeAssign(api.util, { selectInvalidatedBy: selectInvalidatedBy });
            var _k = buildInitiate({
                queryThunk: queryThunk,
                mutationThunk: mutationThunk,
                api: api,
                serializeQueryArgs: serializeQueryArgs,
                context: context
            }), buildInitiateQuery = _k.buildInitiateQuery, buildInitiateMutation = _k.buildInitiateMutation, getRunningOperationPromises = _k.getRunningOperationPromises, getRunningOperationPromise = _k.getRunningOperationPromise;
            safeAssign(api.util, {
                getRunningOperationPromises: getRunningOperationPromises,
                getRunningOperationPromise: getRunningOperationPromise
            });
            return {
                name: coreModuleName,
                injectEndpoint: function (endpointName, definition) {
                    var _a, _b;
                    var anyApi = api;
                    (_b = (_a = anyApi.endpoints)[endpointName]) != null ? _b : _a[endpointName] = {};
                    if (isQueryDefinition(definition)) {
                        safeAssign(anyApi.endpoints[endpointName], {
                            select: buildQuerySelector(endpointName, definition),
                            initiate: buildInitiateQuery(endpointName, definition)
                        }, buildMatchThunkActions(queryThunk, endpointName));
                    }
                    else if (isMutationDefinition(definition)) {
                        safeAssign(anyApi.endpoints[endpointName], {
                            select: buildMutationSelector(),
                            initiate: buildInitiateMutation(endpointName)
                        }, buildMatchThunkActions(mutationThunk, endpointName));
                    }
                }
            };
        }
    }); };
    // src/query/core/index.ts
    var createApi = /* @__PURE__ */ buildCreateApi(coreModule());

    exports.buildCreateApi = buildCreateApi;
    exports.copyWithStructuralSharing = copyWithStructuralSharing;
    exports.coreModule = coreModule;
    exports.createApi = createApi;
    exports.fakeBaseQuery = fakeBaseQuery;
    exports.fetchBaseQuery = fetchBaseQuery;
    exports.retry = retry;
    exports.setupListeners = setupListeners;
    exports.skipSelector = skipSelector;
    exports.skipToken = skipToken;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=rtk-query.umd.js.map
