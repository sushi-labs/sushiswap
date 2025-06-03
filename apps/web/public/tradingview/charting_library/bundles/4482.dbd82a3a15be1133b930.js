;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [4482],
  {
    64482: (t, e, r) => {
      function n(t) {
        for (
          var e = arguments.length, r = Array(e > 1 ? e - 1 : 0), n = 1;
          n < e;
          n++
        )
          r[n - 1] = arguments[n]
        throw Error(
          '[Immer] minified error nr: ' +
            t +
            (r.length ? ' ' + r.map((t) => "'" + t + "'").join(',') : '') +
            '. Find the full error at: https://bit.ly/3cXEKWf',
        )
      }
      function o(t) {
        return !!t && !!t[J]
      }
      function i(t) {
        return (
          !!t &&
          (((t) => {
            if (!t || 'object' != typeof t) return !1
            var e = Object.getPrototypeOf(t)
            if (null === e) return !0
            var r = Object.hasOwn(e, 'constructor') && e.constructor
            return (
              r === Object ||
              ('function' == typeof r && Function.toString.call(r) === B)
            )
          })(t) ||
            Array.isArray(t) ||
            !!t[q] ||
            !!t.constructor[q] ||
            s(t) ||
            v(t))
        )
      }
      function u(t, e, r) {
        void 0 === r && (r = !1),
          0 === c(t)
            ? (r ? Object.keys : G)(t).forEach((n) => {
                ;(r && 'symbol' == typeof n) || e(n, t[n], t)
              })
            : t.forEach((r, n) => e(n, r, t))
      }
      function c(t) {
        var e = t[J]
        return e
          ? e.i > 3
            ? e.i - 4
            : e.i
          : Array.isArray(t)
            ? 1
            : s(t)
              ? 2
              : v(t)
                ? 3
                : 0
      }
      function f(t, e) {
        return 2 === c(t) ? t.has(e) : Object.hasOwn(t, e)
      }
      function a(t, e) {
        return 2 === c(t) ? t.get(e) : t[e]
      }
      function l(t, e, r) {
        var n = c(t)
        2 === n ? t.set(e, r) : 3 === n ? (t.delete(e), t.add(r)) : (t[e] = r)
      }
      function p(t, e) {
        return t === e ? 0 !== t || 1 / t == 1 / e : t != t && e != e
      }
      function s(t) {
        return L && t instanceof Map
      }
      function v(t) {
        return V && t instanceof Set
      }
      function d(t) {
        return t.o || t.t
      }
      function y(t) {
        if (Array.isArray(t)) return Array.prototype.slice.call(t)
        var e = H(t)
        delete e[J]
        for (var r = G(e), n = 0; n < r.length; n++) {
          var o = r[n],
            i = e[o]
          !1 === i.writable && ((i.writable = !0), (i.configurable = !0)),
            (i.get || i.set) &&
              (e[o] = {
                configurable: !0,
                writable: !0,
                enumerable: i.enumerable,
                value: t[o],
              })
        }
        return Object.create(Object.getPrototypeOf(t), e)
      }
      function h(t, e) {
        return (
          void 0 === e && (e = !1),
          g(t) ||
            o(t) ||
            !i(t) ||
            (c(t) > 1 && (t.set = t.add = t.clear = t.delete = b),
            Object.freeze(t),
            e && u(t, (t, e) => h(e, !0), !0)),
          t
        )
      }
      function b() {
        n(2)
      }
      function g(t) {
        return null == t || 'object' != typeof t || Object.isFrozen(t)
      }
      function O(t) {
        var e = Q[t]
        return e || n(18, t), e
      }
      function m(t, e) {
        Q[t] || (Q[t] = e)
      }
      function w() {
        return K
      }
      function P(t, e) {
        e && (O('Patches'), (t.u = []), (t.s = []), (t.v = e))
      }
      function j(t) {
        A(t), t.p.forEach(_), (t.p = null)
      }
      function A(t) {
        t === K && (K = t.l)
      }
      function S(t) {
        return (K = { p: [], l: K, h: t, m: !0, _: 0 })
      }
      function _(t) {
        var e = t[J]
        0 === e.i || 1 === e.i ? e.j() : (e.O = !0)
      }
      function E(t, e) {
        e._ = e.p.length
        var r = e.p[0],
          o = void 0 !== t && t !== r
        return (
          e.h.g || O('ES5').S(e, t, o),
          o
            ? (r[J].P && (j(e), n(4)),
              i(t) && ((t = D(e, t)), e.l || x(e, t)),
              e.u && O('Patches').M(r[J], t, e.u, e.s))
            : (t = D(e, r, [])),
          j(e),
          e.u && e.v(e.u, e.s),
          t !== $ ? t : void 0
        )
      }
      function D(t, e, r) {
        if (g(e)) return e
        var n = e[J]
        if (!n) return u(e, (o, i) => k(t, n, e, o, i, r), !0), e
        if (n.A !== t) return e
        if (!n.P) return x(t, n.t, !0), n.t
        if (!n.I) {
          ;(n.I = !0), n.A._--
          var o = 4 === n.i || 5 === n.i ? (n.o = y(n.k)) : n.o
          u(3 === n.i ? new Set(o) : o, (e, i) => k(t, n, o, e, i, r)),
            x(t, o, !1),
            r && t.u && O('Patches').R(n, r, t.u, t.s)
        }
        return n.o
      }
      function k(t, e, r, n, u, c) {
        if (o(u)) {
          var a = D(
            t,
            u,
            c && e && 3 !== e.i && !f(e.D, n) ? c.concat(n) : void 0,
          )
          if ((l(r, n, a), !o(a))) return
          t.m = !1
        }
        if (i(u) && !g(u)) {
          if (!t.h.F && t._ < 1) return
          D(t, u), (e && e.A.l) || x(t, u)
        }
      }
      function x(t, e, r) {
        void 0 === r && (r = !1), t.h.F && t.m && h(e, r)
      }
      function R(t, e) {
        var r = t[J]
        return (r ? d(r) : t)[e]
      }
      function F(t, e) {
        if (e in t)
          for (var r = Object.getPrototypeOf(t); r; ) {
            var n = Object.getOwnPropertyDescriptor(r, e)
            if (n) return n
            r = Object.getPrototypeOf(r)
          }
      }
      function C(t) {
        t.P || ((t.P = !0), t.l && C(t.l))
      }
      function I(t) {
        t.o || (t.o = y(t.t))
      }
      function M(t, e, r) {
        var n = s(e)
          ? O('MapSet').N(e, r)
          : v(e)
            ? O('MapSet').T(e, r)
            : t.g
              ? ((t, e) => {
                  var r = Array.isArray(t),
                    n = {
                      i: r ? 1 : 0,
                      A: e ? e.A : w(),
                      P: !1,
                      I: !1,
                      D: {},
                      l: e,
                      t,
                      k: null,
                      o: null,
                      j: null,
                      C: !1,
                    },
                    o = n,
                    i = Y
                  r && ((o = [n]), (i = Z))
                  var u = Proxy.revocable(o, i),
                    c = u.revoke,
                    f = u.proxy
                  return (n.k = f), (n.j = c), f
                })(e, r)
              : O('ES5').J(e, r)
        return (r ? r.A : w()).p.push(n), n
      }
      function N(t) {
        return (
          o(t) || n(22, t),
          (function t(e) {
            if (!i(e)) return e
            var r,
              n = e[J],
              o = c(e)
            if (n) {
              if (!n.P && (n.i < 4 || !O('ES5').K(n))) return n.t
              ;(n.I = !0), (r = T(e, o)), (n.I = !1)
            } else r = T(e, o)
            return (
              u(r, (e, o) => {
                ;(n && a(n.t, e) === o) || l(r, e, t(o))
              }),
              3 === o ? new Set(r) : r
            )
          })(t)
        )
      }
      function T(t, e) {
        switch (e) {
          case 2:
            return new Map(t)
          case 3:
            return Array.from(t)
        }
        return y(t)
      }
      function X() {
        function t(t, e) {
          var r = i[t]
          return (
            r
              ? (r.enumerable = e)
              : (i[t] = r =
                  {
                    configurable: !0,
                    enumerable: e,
                    get: function () {
                      var e = this[J]
                      return Y.get(e, t)
                    },
                    set: function (e) {
                      var r = this[J]
                      Y.set(r, t, e)
                    },
                  }),
            r
          )
        }
        function e(t) {
          for (var e = t.length - 1; e >= 0; e--) {
            var o = t[e][J]
            if (!o.P)
              switch (o.i) {
                case 5:
                  n(o) && C(o)
                  break
                case 4:
                  r(o) && C(o)
              }
          }
        }
        function r(t) {
          for (var e = t.t, r = t.k, n = G(r), o = n.length - 1; o >= 0; o--) {
            var i = n[o]
            if (i !== J) {
              var u = e[i]
              if (void 0 === u && !f(e, i)) return !0
              var c = r[i],
                a = c && c[J]
              if (a ? a.t !== u : !p(c, u)) return !0
            }
          }
          var l = !!e[J]
          return n.length !== G(e).length + (l ? 0 : 1)
        }
        function n(t) {
          var e = t.k
          if (e.length !== t.t.length) return !0
          var r = Object.getOwnPropertyDescriptor(e, e.length - 1)
          return !(!r || r.get)
        }
        var i = {}
        m('ES5', {
          J: (e, r) => {
            var n = Array.isArray(e),
              o = ((e, r) => {
                if (e) {
                  for (var n = Array(r.length), o = 0; o < r.length; o++)
                    Object.defineProperty(n, '' + o, t(o, !0))
                  return n
                }
                var i = H(r)
                delete i[J]
                for (var u = G(i), c = 0; c < u.length; c++) {
                  var f = u[c]
                  i[f] = t(f, e || !!i[f].enumerable)
                }
                return Object.create(Object.getPrototypeOf(r), i)
              })(n, e),
              i = {
                i: n ? 5 : 4,
                A: r ? r.A : w(),
                P: !1,
                I: !1,
                D: {},
                l: r,
                t: e,
                k: o,
                o: null,
                O: !1,
                C: !1,
              }
            return Object.defineProperty(o, J, { value: i, writable: !0 }), o
          },
          S: (t, r, i) => {
            i
              ? o(r) && r[J].A === t && e(t.p)
              : (t.u &&
                  (function t(e) {
                    if (e && 'object' == typeof e) {
                      var r = e[J]
                      if (r) {
                        var o = r.t,
                          i = r.k,
                          c = r.D,
                          a = r.i
                        if (4 === a)
                          u(i, (e) => {
                            e !== J &&
                              (void 0 !== o[e] || f(o, e)
                                ? c[e] || t(i[e])
                                : ((c[e] = !0), C(r)))
                          }),
                            u(o, (t) => {
                              void 0 !== i[t] || f(i, t) || ((c[t] = !1), C(r))
                            })
                        else if (5 === a) {
                          if (
                            (n(r) && (C(r), (c.length = !0)),
                            i.length < o.length)
                          )
                            for (var l = i.length; l < o.length; l++) c[l] = !1
                          else
                            for (var p = o.length; p < i.length; p++) c[p] = !0
                          for (
                            var s = Math.min(i.length, o.length), v = 0;
                            v < s;
                            v++
                          )
                            void 0 === c[v] && t(i[v])
                        }
                      }
                    }
                  })(t.p[0]),
                e(t.p))
          },
          K: (t) => (4 === t.i ? r(t) : n(t)),
        })
      }
      r.d(e, { configureStore: () => wt, createSlice: () => At })
      var z,
        K,
        U = 'undefined' != typeof Symbol && 'symbol' == typeof Symbol('x'),
        L = 'undefined' != typeof Map,
        V = 'undefined' != typeof Set,
        W =
          'undefined' != typeof Proxy &&
          void 0 !== Proxy.revocable &&
          'undefined' != typeof Reflect,
        $ = U
          ? Symbol.for('immer-nothing')
          : (((z = {})['immer-nothing'] = !0), z),
        q = U ? Symbol.for('immer-draftable') : '__$immer_draftable',
        J = U ? Symbol.for('immer-state') : '__$immer_state',
        B =
          ('undefined' != typeof Symbol && Symbol.iterator,
          '' + Object.prototype.constructor),
        G =
          'undefined' != typeof Reflect && Reflect.ownKeys
            ? Reflect.ownKeys
            : void 0 !== Object.getOwnPropertySymbols
              ? (t) =>
                  Object.getOwnPropertyNames(t).concat(
                    Object.getOwnPropertySymbols(t),
                  )
              : Object.getOwnPropertyNames,
        H =
          Object.getOwnPropertyDescriptors ||
          ((t) => {
            var e = {}
            return (
              G(t).forEach((r) => {
                e[r] = Object.getOwnPropertyDescriptor(t, r)
              }),
              e
            )
          }),
        Q = {},
        Y = {
          get: (t, e) => {
            if (e === J) return t
            var r = d(t)
            if (!f(r, e))
              return ((t, e, r) => {
                var n,
                  o = F(e, r)
                return o
                  ? 'value' in o
                    ? o.value
                    : null === (n = o.get) || void 0 === n
                      ? void 0
                      : n.call(t.k)
                  : void 0
              })(t, r, e)
            var n = r[e]
            return t.I || !i(n)
              ? n
              : n === R(t.t, e)
                ? (I(t), (t.o[e] = M(t.A.h, n, t)))
                : n
          },
          has: (t, e) => e in d(t),
          ownKeys: (t) => Reflect.ownKeys(d(t)),
          set: (t, e, r) => {
            var n = F(d(t), e)
            if (null == n ? void 0 : n.set) return n.set.call(t.k, r), !0
            if (!t.P) {
              var o = R(d(t), e),
                i = null == o ? void 0 : o[J]
              if (i && i.t === r) return (t.o[e] = r), (t.D[e] = !1), !0
              if (p(r, o) && (void 0 !== r || f(t.t, e))) return !0
              I(t), C(t)
            }
            return (
              (t.o[e] === r &&
                'number' != typeof r &&
                (void 0 !== r || e in t.o)) ||
              ((t.o[e] = r), (t.D[e] = !0), !0)
            )
          },
          deleteProperty: (t, e) => (
            void 0 !== R(t.t, e) || e in t.t
              ? ((t.D[e] = !1), I(t), C(t))
              : delete t.D[e],
            t.o && delete t.o[e],
            !0
          ),
          getOwnPropertyDescriptor: (t, e) => {
            var r = d(t),
              n = Reflect.getOwnPropertyDescriptor(r, e)
            return n
              ? {
                  writable: !0,
                  configurable: 1 !== t.i || 'length' !== e,
                  enumerable: n.enumerable,
                  value: r[e],
                }
              : n
          },
          defineProperty: () => {
            n(11)
          },
          getPrototypeOf: (t) => Object.getPrototypeOf(t.t),
          setPrototypeOf: () => {
            n(12)
          },
        },
        Z = {}
      u(Y, (t, e) => {
        Z[t] = function () {
          return (arguments[0] = arguments[0][0]), e.apply(this, arguments)
        }
      }),
        (Z.deleteProperty = function (t, e) {
          return Y.deleteProperty.call(this, t[0], e)
        }),
        (Z.set = function (t, e, r) {
          return Y.set.call(this, t[0], e, r, t[0])
        })
      var tt = (() => {
          function t(t) {
            ;(this.g = W),
              (this.F = !0),
              (this.produce = (t, r, o) => {
                if ('function' == typeof t && 'function' != typeof r) {
                  var u = r
                  r = t
                  var c = this
                  return function (t) {
                    void 0 === t && (t = u)
                    for (
                      var n = arguments.length,
                        o = Array(n > 1 ? n - 1 : 0),
                        i = 1;
                      i < n;
                      i++
                    )
                      o[i - 1] = arguments[i]
                    return c.produce(t, (t) => {
                      var n
                      return (n = r).call.apply(n, [this, t].concat(o))
                    })
                  }
                }
                var f
                if (
                  ('function' != typeof r && n(6),
                  void 0 !== o && 'function' != typeof o && n(7),
                  i(t))
                ) {
                  var a = S(this),
                    l = M(this, t, void 0),
                    p = !0
                  try {
                    ;(f = r(l)), (p = !1)
                  } finally {
                    p ? j(a) : A(a)
                  }
                  return 'undefined' != typeof Promise && f instanceof Promise
                    ? f.then(
                        (t) => (P(a, o), E(t, a)),
                        (t) => {
                          throw (j(a), t)
                        },
                      )
                    : (P(a, o), E(f, a))
                }
                if (!t || 'object' != typeof t) {
                  if ((f = r(t)) === $) return
                  return void 0 === f && (f = t), this.F && h(f, !0), f
                }
                n(21, t)
              }),
              (this.produceWithPatches = (t, r) =>
                'function' == typeof t
                  ? (r) => {
                      for (
                        var n = arguments.length,
                          o = Array(n > 1 ? n - 1 : 0),
                          i = 1;
                        i < n;
                        i++
                      )
                        o[i - 1] = arguments[i]
                      return this.produceWithPatches(r, (e) =>
                        t.apply(void 0, [e].concat(o)),
                      )
                    }
                  : [
                      this.produce(t, r, (t, e) => {
                        ;(n = t), (o = e)
                      }),
                      n,
                      o,
                    ]),
              'boolean' == typeof (null == t ? void 0 : t.useProxies) &&
                this.setUseProxies(t.useProxies),
              'boolean' == typeof (null == t ? void 0 : t.autoFreeze) &&
                this.setAutoFreeze(t.autoFreeze)
          }
          var e = t.prototype
          return (
            (e.createDraft = function (t) {
              i(t) || n(8), o(t) && (t = N(t))
              var e = S(this),
                r = M(this, t, void 0)
              return (r[J].C = !0), A(e), r
            }),
            (e.finishDraft = (t, e) => {
              var r = (t && t[J]).A
              return P(r, e), E(void 0, r)
            }),
            (e.setAutoFreeze = function (t) {
              this.F = t
            }),
            (e.setUseProxies = function (t) {
              t && !W && n(20), (this.g = t)
            }),
            (e.applyPatches = function (t, e) {
              var r
              for (r = e.length - 1; r >= 0; r--) {
                var n = e[r]
                if (0 === n.path.length && 'replace' === n.op) {
                  t = n.value
                  break
                }
              }
              r > -1 && (e = e.slice(r + 1))
              var i = O('Patches').$
              return o(t) ? i(t, e) : this.produce(t, (t) => i(t, e))
            }),
            t
          )
        })(),
        et = new tt(),
        rt = et.produce
      et.produceWithPatches.bind(et),
        et.setAutoFreeze.bind(et),
        et.setUseProxies.bind(et),
        et.applyPatches.bind(et),
        et.createDraft.bind(et),
        et.finishDraft.bind(et)
      const nt = rt
      r(377145)
      var ot = r(691622)
      function it(t) {
        return (e) => {
          var r = e.dispatch,
            n = e.getState
          return (e) => (o) => ('function' == typeof o ? o(r, n, t) : e(o))
        }
      }
      var ut = it()
      ut.withExtraArgument = it
      const ct = ut
      var ft,
        at =
          ((ft = (t, e) => (
            (ft =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                ((t, e) => {
                  t.__proto__ = e
                })) ||
              ((t, e) => {
                for (var r in e) Object.hasOwn(e, r) && (t[r] = e[r])
              })),
            ft(t, e)
          )),
          (t, e) => {
            if ('function' != typeof e && null !== e)
              throw new TypeError(
                'Class extends value ' +
                  String(e) +
                  ' is not a constructor or null',
              )
            function r() {
              this.constructor = t
            }
            ft(t, e),
              (t.prototype =
                null === e
                  ? Object.create(e)
                  : ((r.prototype = e.prototype), new r()))
          }),
        lt = (t, e) => {
          for (var r = 0, n = e.length, o = t.length; r < n; r++, o++)
            t[o] = e[r]
          return t
        },
        pt = Object.defineProperty,
        st =
          (Object.defineProperties,
          Object.getOwnPropertyDescriptors,
          Object.getOwnPropertySymbols),
        vt = Object.prototype.hasOwnProperty,
        dt = Object.prototype.propertyIsEnumerable,
        yt = (t, e, r) =>
          e in t
            ? pt(t, e, {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: r,
              })
            : (t[e] = r),
        ht = (t, e) => {
          for (var r in e || (e = {})) vt.call(e, r) && yt(t, r, e[r])
          if (st)
            for (var n = 0, o = st(e); n < o.length; n++) {
              r = o[n]
              dt.call(e, r) && yt(t, r, e[r])
            }
          return t
        },
        bt =
          'undefined' != typeof window &&
          window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            : () => {
                if (0 !== arguments.length)
                  return 'object' == typeof arguments[0]
                    ? ot.compose
                    : ot.compose.apply(null, arguments)
              }
      'undefined' != typeof window &&
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__
      function gt(t) {
        if ('object' != typeof t || null === t) return !1
        for (var e = t; null !== Object.getPrototypeOf(e); )
          e = Object.getPrototypeOf(e)
        return Object.getPrototypeOf(t) === e
      }
      var Ot = ((t) => {
        function e() {
          for (var r = [], n = 0; n < arguments.length; n++) r[n] = arguments[n]
          var o = t.apply(this, r) || this
          return Object.setPrototypeOf(o, e.prototype), o
        }
        return (
          at(e, t),
          Object.defineProperty(e, Symbol.species, {
            get: () => e,
            enumerable: !1,
            configurable: !0,
          }),
          (e.prototype.concat = function () {
            for (var e = [], r = 0; r < arguments.length; r++)
              e[r] = arguments[r]
            return t.prototype.concat.apply(this, e)
          }),
          (e.prototype.prepend = function () {
            for (var t = [], r = 0; r < arguments.length; r++)
              t[r] = arguments[r]
            return 1 === t.length && Array.isArray(t[0])
              ? new (e.bind.apply(e, lt([void 0], t[0].concat(this))))()
              : new (e.bind.apply(e, lt([void 0], t.concat(this))))()
          }),
          e
        )
      })(Array)
      function mt() {
        return (t) =>
          ((t) => {
            void 0 === t && (t = {})
            var e = t.thunk,
              r = void 0 === e || e,
              n = (t.immutableCheck, t.serializableCheck, new Ot())
            r &&
              (!((t) => 'boolean' == typeof t)(r)
                ? n.push(ct.withExtraArgument(r.extraArgument))
                : n.push(ct))
            0
            return n
          })(t)
      }
      function wt(t) {
        var e,
          r = mt(),
          n = t || {},
          o = n.reducer,
          i = void 0 === o ? void 0 : o,
          u = n.middleware,
          c = void 0 === u ? r() : u,
          f = n.devTools,
          a = void 0 === f || f,
          l = n.preloadedState,
          p = void 0 === l ? void 0 : l,
          s = n.enhancers,
          v = void 0 === s ? void 0 : s
        if ('function' == typeof i) e = i
        else {
          if (!gt(i))
            throw new Error(
              '"reducer" is a required argument, and must be a function or an object of functions that can be passed to combineReducers',
            )
          e = (0, ot.combineReducers)(i)
        }
        var d = c
        'function' == typeof d && (d = d(r))
        var y = ot.applyMiddleware.apply(void 0, d),
          h = ot.compose
        a && (h = bt(ht({ trace: !1 }, 'object' == typeof a && a)))
        var b = [y]
        Array.isArray(v)
          ? (b = lt([y], v))
          : 'function' == typeof v && (b = v(b))
        var g = h.apply(void 0, b)
        return (0, ot.createStore)(e, p, g)
      }
      function Pt(t, e) {
        function r() {
          for (var r = [], n = 0; n < arguments.length; n++) r[n] = arguments[n]
          if (e) {
            var o = e.apply(void 0, r)
            if (!o) throw new Error('prepareAction did not return an object')
            return ht(
              ht(
                { type: t, payload: o.payload },
                'meta' in o && { meta: o.meta },
              ),
              'error' in o && { error: o.error },
            )
          }
          return { type: t, payload: r[0] }
        }
        return (
          (r.toString = () => '' + t),
          (r.type = t),
          (r.match = (e) => e.type === t),
          r
        )
      }
      function jt(t) {
        var e,
          r = {},
          n = [],
          o = {
            addCase: (t, e) => {
              var n = 'string' == typeof t ? t : t.type
              if (n in r)
                throw new Error(
                  'addCase cannot be called with two reducers for the same action type',
                )
              return (r[n] = e), o
            },
            addMatcher: (t, e) => (n.push({ matcher: t, reducer: e }), o),
            addDefaultCase: (t) => ((e = t), o),
          }
        return t(o), [r, n, e]
      }
      function At(t) {
        var e = t.name,
          r = t.initialState
        if (!e) throw new Error('`name` is a required option for createSlice')
        var n = t.reducers || {},
          u =
            'function' == typeof t.extraReducers
              ? jt(t.extraReducers)
              : [t.extraReducers],
          c = u[0],
          f = void 0 === c ? {} : c,
          a = u[1],
          l = void 0 === a ? [] : a,
          p = u[2],
          s = void 0 === p ? void 0 : p,
          v = Object.keys(n),
          d = {},
          y = {},
          h = {}
        v.forEach((t) => {
          var r,
            o,
            i = n[t],
            u = e + '/' + t
          'reducer' in i ? ((r = i.reducer), (o = i.prepare)) : (r = i),
            (d[t] = r),
            (y[u] = r),
            (h[t] = o ? Pt(u, o) : Pt(u))
        })
        var b = ((t, e, r, n) => {
          void 0 === r && (r = [])
          var u = 'function' == typeof e ? jt(e) : [e, r, n],
            c = u[0],
            f = u[1],
            a = u[2],
            l = nt(t, () => {})
          return (t, e) => {
            void 0 === t && (t = l)
            var r = lt(
              [c[e.type]],
              f.filter((t) => (0, t.matcher)(e)).map((t) => t.reducer),
            )
            return (
              0 === r.filter((t) => !!t).length && (r = [a]),
              r.reduce((t, r) => {
                if (r) {
                  var n
                  if (o(t)) return void 0 === (n = r(t, e)) ? t : n
                  if (i(t)) return nt(t, (t) => r(t, e))
                  if (void 0 === (n = r(t, e))) {
                    if (null === t) return t
                    throw Error(
                      'A case reducer on a non-draftable value must not return undefined',
                    )
                  }
                  return n
                }
                return t
              }, t)
            )
          }
        })(r, ht(ht({}, f), y), l, s)
        return { name: e, reducer: b, actions: h, caseReducers: d }
      }
      X()
    },
    377145: (t, e, r) => {
      function n(t, e) {
        return t === e
      }
      function o(t, e, r) {
        if (null === e || null === r || e.length !== r.length) return !1
        for (var n = e.length, o = 0; o < n; o++) if (!t(e[o], r[o])) return !1
        return !0
      }
      function i(t) {
        var e = Array.isArray(t[0]) ? t[0] : t
        if (!e.every((t) => 'function' == typeof t)) {
          var r = e.map((t) => typeof t).join(', ')
          throw new Error(
            'Selector creators expect all input-selectors to be functions, instead received the following types: [' +
              r +
              ']',
          )
        }
        return e
      }
      r.d(e, { createSelector: () => u })
      var u = ((t) => {
        for (
          var e = arguments.length, r = Array(e > 1 ? e - 1 : 0), n = 1;
          n < e;
          n++
        )
          r[n - 1] = arguments[n]
        return () => {
          for (var e = arguments.length, n = Array(e), o = 0; o < e; o++)
            n[o] = arguments[o]
          var u = 0,
            c = n.pop(),
            f = i(n),
            a = t.apply(
              void 0,
              [() => (u++, c.apply(null, arguments))].concat(r),
            ),
            l = t(() => {
              for (var t = [], e = f.length, r = 0; r < e; r++)
                t.push(f[r].apply(null, arguments))
              return a.apply(null, t)
            })
          return (
            (l.resultFunc = c),
            (l.dependencies = f),
            (l.recomputations = () => u),
            (l.resetRecomputations = () => (u = 0)),
            l
          )
        }
      })((t) => {
        var e =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : n,
          r = null,
          i = null
        return () => (
          o(e, r, arguments) || (i = t.apply(null, arguments)),
          (r = arguments),
          i
        )
      })
    },
  },
])
