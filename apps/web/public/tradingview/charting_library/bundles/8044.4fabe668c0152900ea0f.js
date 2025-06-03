;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [8044],
  {
    90932: (n, r, t) => {
      t.d(r, {
        A: () => q,
        B: () => w,
        C: () => U,
        D: () => O,
        E: () => a,
        F: () => M,
        G: () => Y,
        H: () => P,
        J: () => B,
        K: () => Q,
        L: () => nn,
        M: () => tn,
        N: () => $,
        O: () => on,
        P: () => k,
        Q: () => j,
        R: () => R,
        S: () => F,
        T: () => _,
        U: () => un,
        Y: () => X,
        _: () => V,
        a: () => K,
        a2: () => rn,
        a3: () => en,
        b: () => D,
        d: () => G,
        e: () => x,
        f: () => H,
        g: () => W,
        h: () => z,
        i: () => E,
        j: () => C,
        k: () => f,
        l: () => S,
        m: () => b,
        n: () => I,
        o: () => v,
        p: () => l,
        q: () => h,
        r: () => s,
        s: () => N,
        t: () => c,
        u: () => p,
        v: () => T,
        y: () => A,
        z: () => g,
      })
      var e = t(749209),
        o = t(315882),
        u = t(375880)
      const i = (n, r) => {
        var t
        void 0 === r && (r = !0)
        var o = new Promise((e) => {
          t = setTimeout(e, n, r)
        })
        return (
          (o[e.CANCEL] = () => {
            clearTimeout(t)
          }),
          o
        )
      }
      var f = (
          (n) => () =>
            n
        )(!0),
        c = () => {}
      var a = (n) => n
      'function' == typeof Symbol &&
        Symbol.asyncIterator &&
        Symbol.asyncIterator
      var l = (n, r) => {
          ;(0, o.default)(n, r),
            Object.getOwnPropertySymbols &&
              Object.getOwnPropertySymbols(r).forEach((t) => {
                n[t] = r[t]
              })
        },
        p = (n, r) => {
          var t
          return (t = []).concat.apply(t, r.map(n))
        }
      function s(n, r) {
        var t = n.indexOf(r)
        t >= 0 && n.splice(t, 1)
      }
      function v(n) {
        var r = !1
        return () => {
          r || ((r = !0), n())
        }
      }
      var y = (n) => {
          throw n
        },
        d = (n) => ({ value: n, done: !0 })
      function h(n, r, t) {
        void 0 === r && (r = y), void 0 === t && (t = 'iterator')
        var e = {
          meta: { name: t },
          next: n,
          throw: r,
          return: d,
          isSagaIterator: !0,
        }
        return 'undefined' != typeof Symbol && (e[Symbol.iterator] = () => e), e
      }
      function w(n, r) {
        var t = r.sagaStack
        console.error(n), console.error(t)
      }
      var E = (n) =>
          new Error(
            "\n  redux-saga: Error checking hooks detected an inconsistent state. This is likely a bug\n  in redux-saga code and not yours. Thanks for reporting this in the project's github repo.\n  Error: " +
              n +
              '\n',
          ),
        b = (n) => Array.apply(null, new Array(n)),
        O = (n) => (r) =>
          n(Object.defineProperty(r, e.SAGA_ACTION, { value: !0 })),
        g = (n) => n === e.TERMINATE,
        A = (n) => n === e.TASK_CANCEL,
        N = (n) => g(n) || A(n)
      function S(n, r) {
        var t = Object.keys(n),
          e = t.length
        var o,
          i = 0,
          f = (0, u.array)(n) ? b(e) : {},
          a = {}
        return (
          t.forEach((n) => {
            var t = (t, u) => {
              o ||
                (u || N(t)
                  ? (r.cancel(), r(t, u))
                  : ((f[n] = t), ++i === e && ((o = !0), r(f))))
            }
            ;(t.cancel = c), (a[n] = t)
          }),
          (r.cancel = () => {
            o || ((o = !0), t.forEach((n) => a[n].cancel()))
          }),
          a
        )
      }
      function C(n) {
        return { name: n.name || 'anonymous', location: T(n) }
      }
      function T(n) {
        return n[e.SAGA_LOCATION]
      }
      var m = { isEmpty: f, put: c, take: c }
      function L(n, r) {
        void 0 === n && (n = 10)
        var t = new Array(n),
          e = 0,
          o = 0,
          u = 0,
          i = (r) => {
            ;(t[o] = r), (o = (o + 1) % n), e++
          },
          f = () => {
            if (0 != e) {
              var r = t[u]
              return (t[u] = null), e--, (u = (u + 1) % n), r
            }
          },
          c = () => {
            for (var n = []; e; ) n.push(f())
            return n
          }
        return {
          isEmpty: () => 0 == e,
          put: (f) => {
            var a
            if (e < n) i(f)
            else
              switch (r) {
                case 1:
                  throw new Error("Channel's Buffer overflow!")
                case 3:
                  ;(t[o] = f), (u = o = (o + 1) % n)
                  break
                case 4:
                  ;(a = 2 * n),
                    (t = c()),
                    (e = t.length),
                    (o = t.length),
                    (u = 0),
                    (t.length = a),
                    (n = a),
                    i(f)
              }
          },
          take: f,
          flush: c,
        }
      }
      var I = () => m,
        j = (n) => L(n, 3),
        x = (n) => L(n, 4),
        P = Object.freeze({
          __proto__: null,
          none: I,
          fixed: (n) => L(n, 1),
          dropping: (n) => L(n, 2),
          sliding: j,
          expanding: x,
        }),
        _ = 'TAKE',
        k = 'PUT',
        q = 'ALL',
        R = 'RACE',
        U = 'CALL',
        K = 'CPS',
        M = 'FORK',
        B = 'JOIN',
        D = 'CANCEL',
        F = 'SELECT',
        G = 'ACTION_CHANNEL',
        H = 'CANCELLED',
        W = 'FLUSH',
        Y = 'GET_CONTEXT',
        z = 'SET_CONTEXT',
        J = (n, r) => {
          var t
          return (
            ((t = {})[e.IO] = !0),
            (t.combinator = !1),
            (t.type = n),
            (t.payload = r),
            t
          )
        }
      function Q(n, r) {
        return (
          void 0 === n && (n = '*'),
          (0, u.pattern)(n)
            ? J(_, { pattern: n })
            : (0, u.multicast)(n) && (0, u.notUndef)(r) && (0, u.pattern)(r)
              ? J(_, { channel: n, pattern: r })
              : (0, u.channel)(n)
                ? J(_, { channel: n })
                : void 0
        )
      }
      function X(n, r) {
        return (
          (0, u.undef)(r) && ((r = n), (n = void 0)),
          J(k, { channel: n, action: r })
        )
      }
      function V(n) {
        var r = J(q, n)
        return (r.combinator = !0), r
      }
      function Z(n, r) {
        var t,
          e = null
        return (
          (0, u.func)(n)
            ? (t = n)
            : ((0, u.array)(n)
                ? ((e = n[0]), (t = n[1]))
                : ((e = n.context), (t = n.fn)),
              e && (0, u.string)(t) && (0, u.func)(e[t]) && (t = e[t])),
          { context: e, fn: t, args: r }
        )
      }
      function $(n) {
        for (
          var r = arguments.length, t = new Array(r > 1 ? r - 1 : 0), e = 1;
          e < r;
          e++
        )
          t[e - 1] = arguments[e]
        return J(U, Z(n, t))
      }
      function nn(n) {
        for (
          var r = arguments.length, t = new Array(r > 1 ? r - 1 : 0), e = 1;
          e < r;
          e++
        )
          t[e - 1] = arguments[e]
        return J(M, Z(n, t))
      }
      function rn(n) {
        return J(B, n)
      }
      function tn(n) {
        return void 0 === n && (n = e.SELF_CANCELLATION), J(D, n)
      }
      function en(n) {
        void 0 === n && (n = a)
        for (
          var r = arguments.length, t = new Array(r > 1 ? r - 1 : 0), e = 1;
          e < r;
          e++
        )
          t[e - 1] = arguments[e]
        return J(F, { selector: n, args: t })
      }
      function on(n, r) {
        return J(G, { pattern: n, buffer: r })
      }
      var un = $.bind(null, i)
    },
    375880: (n, r, t) => {
      t.d(r, {
        array: () => c,
        channel: () => s,
        func: () => i,
        iterator: () => l,
        multicast: () => d,
        notUndef: () => u,
        pattern: () => p,
        promise: () => a,
        string: () => f,
        stringableFunc: () => v,
        symbol: () => y,
        undef: () => o,
      })
      var e = t(749209),
        o = (n) => null == n,
        u = (n) => null != n,
        i = (n) => 'function' == typeof n,
        f = (n) => 'string' == typeof n,
        c = Array.isArray,
        a = (n) => n && i(n.then),
        l = (n) => n && i(n.next) && i(n.throw),
        p = function n(r) {
          return r && (f(r) || y(r) || i(r) || (c(r) && r.every(n)))
        },
        s = (n) => n && i(n.take) && i(n.close),
        v = (n) => i(n) && Object.hasOwn(n, 'toString'),
        y = (n) =>
          Boolean(n) &&
          'function' == typeof Symbol &&
          n.constructor === Symbol &&
          n !== Symbol.prototype,
        d = (n) => s(n) && n[e.MULTICAST]
    },
    749209: (n, r, t) => {
      t.d(r, {
        CANCEL: () => o,
        CHANNEL_END_TYPE: () => u,
        IO: () => i,
        MATCH: () => f,
        MULTICAST: () => c,
        SAGA_ACTION: () => a,
        SAGA_LOCATION: () => y,
        SELF_CANCELLATION: () => l,
        TASK: () => p,
        TASK_CANCEL: () => s,
        TERMINATE: () => v,
      })
      var e = (n) => '@@redux-saga/' + n,
        o = e('CANCEL_PROMISE'),
        u = e('CHANNEL_END'),
        i = e('IO'),
        f = e('MATCH'),
        c = e('MULTICAST'),
        a = e('SAGA_ACTION'),
        l = e('SELF_CANCELLATION'),
        p = e('TASK'),
        s = e('TASK_CANCEL'),
        v = e('TERMINATE'),
        y = e('LOCATION')
    },
    336349: (n, r, t) => {
      t.d(r, {
        all: () => o._,
        call: () => o.N,
        cancel: () => o.M,
        fork: () => o.L,
        join: () => o.a2,
        put: () => o.Y,
        select: () => o.a3,
        take: () => o.K,
        takeEvery: () => s,
        takeLatest: () => v,
        throttle: () => y,
      })
      var e = t(375880),
        o = t(90932),
        u = (n) => ({ done: !0, value: n }),
        i = {}
      function f(n) {
        return (0, e.channel)(n)
          ? 'channel'
          : (0, e.stringableFunc)(n)
            ? String(n)
            : (0, e.func)(n)
              ? n.name
              : String(n)
      }
      function c(n, r, t) {
        var e,
          f,
          c,
          a = r
        function l(r, t) {
          if (a === i) return u(r)
          if (t && !f) throw ((a = i), t)
          e && e(r)
          var o = t ? n[f](t) : n[a]()
          return (
            (a = o.nextState),
            (c = o.effect),
            (e = o.stateUpdater),
            (f = o.errorState),
            a === i ? u(r) : c
          )
        }
        return (0, o.q)(l, (n) => l(null, n), t)
      }
      function a(n, r) {
        for (
          var t = arguments.length, e = new Array(t > 2 ? t - 2 : 0), u = 2;
          u < t;
          u++
        )
          e[u - 2] = arguments[u]
        var i,
          a = { done: !1, value: (0, o.K)(n) },
          l = (n) => ({
            done: !1,
            value: o.L.apply(void 0, [r].concat(e, [n])),
          }),
          p = (n) => (i = n)
        return c(
          {
            q1: () => ({ nextState: 'q2', effect: a, stateUpdater: p }),
            q2: () => ({ nextState: 'q1', effect: l(i) }),
          },
          'q1',
          'takeEvery(' + f(n) + ', ' + r.name + ')',
        )
      }
      function l(n, r) {
        for (
          var t = arguments.length, e = new Array(t > 2 ? t - 2 : 0), u = 2;
          u < t;
          u++
        )
          e[u - 2] = arguments[u]
        var i,
          a,
          l = { done: !1, value: (0, o.K)(n) },
          p = (n) => ({
            done: !1,
            value: o.L.apply(void 0, [r].concat(e, [n])),
          }),
          s = (n) => ({ done: !1, value: (0, o.M)(n) }),
          v = (n) => (i = n),
          y = (n) => (a = n)
        return c(
          {
            q1: () => ({ nextState: 'q2', effect: l, stateUpdater: y }),
            q2: () =>
              i
                ? { nextState: 'q3', effect: s(i) }
                : { nextState: 'q1', effect: p(a), stateUpdater: v },
            q3: () => ({ nextState: 'q1', effect: p(a), stateUpdater: v }),
          },
          'q1',
          'takeLatest(' + f(n) + ', ' + r.name + ')',
        )
      }
      function p(n, r, t) {
        for (
          var e = arguments.length, u = new Array(e > 3 ? e - 3 : 0), i = 3;
          i < e;
          i++
        )
          u[i - 3] = arguments[i]
        var a,
          l,
          p = { done: !1, value: (0, o.O)(r, (0, o.Q)(1)) },
          s = () => ({ done: !1, value: (0, o.K)(l) }),
          v = (n) => ({
            done: !1,
            value: o.L.apply(void 0, [t].concat(u, [n])),
          }),
          y = { done: !1, value: (0, o.U)(n) },
          d = (n) => (a = n),
          h = (n) => (l = n)
        return c(
          {
            q1: () => ({ nextState: 'q2', effect: p, stateUpdater: h }),
            q2: () => ({ nextState: 'q3', effect: s(), stateUpdater: d }),
            q3: () => ({ nextState: 'q4', effect: v(a) }),
            q4: () => ({ nextState: 'q2', effect: y }),
          },
          'q1',
          'throttle(' + f(r) + ', ' + t.name + ')',
        )
      }
      function s(n, r) {
        for (
          var t = arguments.length, e = new Array(t > 2 ? t - 2 : 0), u = 2;
          u < t;
          u++
        )
          e[u - 2] = arguments[u]
        return o.L.apply(void 0, [a, n, r].concat(e))
      }
      function v(n, r) {
        for (
          var t = arguments.length, e = new Array(t > 2 ? t - 2 : 0), u = 2;
          u < t;
          u++
        )
          e[u - 2] = arguments[u]
        return o.L.apply(void 0, [l, n, r].concat(e))
      }
      function y(n, r, t) {
        for (
          var e = arguments.length, u = new Array(e > 3 ? e - 3 : 0), i = 3;
          i < e;
          i++
        )
          u[i - 3] = arguments[i]
        return o.L.apply(void 0, [p, n, r, t].concat(u))
      }
    },
    691622: (n, r, t) => {
      function e(n, r, t) {
        return (
          r in n
            ? Object.defineProperty(n, r, {
                value: t,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (n[r] = t),
          n
        )
      }
      function o(n, r) {
        var t = Object.keys(n)
        if (Object.getOwnPropertySymbols) {
          var e = Object.getOwnPropertySymbols(n)
          r &&
            (e = e.filter(
              (r) => Object.getOwnPropertyDescriptor(n, r).enumerable,
            )),
            t.push.apply(t, e)
        }
        return t
      }
      function u(n) {
        for (var r = 1; r < arguments.length; r++) {
          var t = null != arguments[r] ? arguments[r] : {}
          r % 2
            ? o(Object(t), !0).forEach((r) => {
                e(n, r, t[r])
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(t))
              : o(Object(t)).forEach((r) => {
                  Object.defineProperty(
                    n,
                    r,
                    Object.getOwnPropertyDescriptor(t, r),
                  )
                })
        }
        return n
      }
      function i(n) {
        return (
          'Minified Redux error #' +
          n +
          '; visit https://redux.js.org/Errors?code=' +
          n +
          ' for the full message or use the non-minified dev environment for full errors. '
        )
      }
      t.d(r, {
        applyMiddleware: () => h,
        bindActionCreators: () => y,
        combineReducers: () => s,
        compose: () => d,
        createStore: () => p,
      })
      var f =
          ('function' == typeof Symbol && Symbol.observable) || '@@observable',
        c = () => Math.random().toString(36).substring(7).split('').join('.'),
        a = {
          INIT: '@@redux/INIT' + c(),
          REPLACE: '@@redux/REPLACE' + c(),
          PROBE_UNKNOWN_ACTION: () => '@@redux/PROBE_UNKNOWN_ACTION' + c(),
        }
      function l(n) {
        if ('object' != typeof n || null === n) return !1
        for (var r = n; null !== Object.getPrototypeOf(r); )
          r = Object.getPrototypeOf(r)
        return Object.getPrototypeOf(n) === r
      }
      function p(n, r, t) {
        var e
        if (
          ('function' == typeof r && 'function' == typeof t) ||
          ('function' == typeof t && 'function' == typeof arguments[3])
        )
          throw new Error(i(0))
        if (
          ('function' == typeof r && void 0 === t && ((t = r), (r = void 0)),
          void 0 !== t)
        ) {
          if ('function' != typeof t) throw new Error(i(1))
          return t(p)(n, r)
        }
        if ('function' != typeof n) throw new Error(i(2))
        var o = n,
          u = r,
          c = [],
          s = c,
          v = !1
        function y() {
          s === c && (s = c.slice())
        }
        function d() {
          if (v) throw new Error(i(3))
          return u
        }
        function h(n) {
          if ('function' != typeof n) throw new Error(i(4))
          if (v) throw new Error(i(5))
          var r = !0
          return (
            y(),
            s.push(n),
            () => {
              if (r) {
                if (v) throw new Error(i(6))
                ;(r = !1), y()
                var t = s.indexOf(n)
                s.splice(t, 1), (c = null)
              }
            }
          )
        }
        function w(n) {
          if (!l(n)) throw new Error(i(7))
          if (void 0 === n.type) throw new Error(i(8))
          if (v) throw new Error(i(9))
          try {
            ;(v = !0), (u = o(u, n))
          } finally {
            v = !1
          }
          for (var r = (c = s), t = 0; t < r.length; t++) {
            ;(0, r[t])()
          }
          return n
        }
        function E(n) {
          if ('function' != typeof n) throw new Error(i(10))
          ;(o = n), w({ type: a.REPLACE })
        }
        function b() {
          var n,
            r = h
          return (
            ((n = {
              subscribe: (n) => {
                if ('object' != typeof n || null === n) throw new Error(i(11))
                function t() {
                  n.next && n.next(d())
                }
                return t(), { unsubscribe: r(t) }
              },
            })[f] = function () {
              return this
            }),
            n
          )
        }
        return (
          w({ type: a.INIT }),
          ((e = { dispatch: w, subscribe: h, getState: d, replaceReducer: E })[
            f
          ] = b),
          e
        )
      }
      function s(n) {
        for (var r = Object.keys(n), t = {}, e = 0; e < r.length; e++) {
          var o = r[e]
          0, 'function' == typeof n[o] && (t[o] = n[o])
        }
        var u,
          f = Object.keys(t)
        try {
          !((n) => {
            Object.keys(n).forEach((r) => {
              var t = n[r]
              if (void 0 === t(void 0, { type: a.INIT })) throw new Error(i(12))
              if (void 0 === t(void 0, { type: a.PROBE_UNKNOWN_ACTION() }))
                throw new Error(i(13))
            })
          })(t)
        } catch (n) {
          u = n
        }
        return (n, r) => {
          if ((void 0 === n && (n = {}), u)) throw u
          for (var e = !1, o = {}, c = 0; c < f.length; c++) {
            var a = f[c],
              l = t[a],
              p = n[a],
              s = l(p, r)
            if (void 0 === s) {
              r && r.type
              throw new Error(i(14))
            }
            ;(o[a] = s), (e = e || s !== p)
          }
          return (e = e || f.length !== Object.keys(n).length) ? o : n
        }
      }
      function v(n, r) {
        return function () {
          return r(n.apply(this, arguments))
        }
      }
      function y(n, r) {
        if ('function' == typeof n) return v(n, r)
        if ('object' != typeof n || null === n) throw new Error(i(16))
        var t = {}
        for (var e in n) {
          var o = n[e]
          'function' == typeof o && (t[e] = v(o, r))
        }
        return t
      }
      function d() {
        for (var n = arguments.length, r = new Array(n), t = 0; t < n; t++)
          r[t] = arguments[t]
        return 0 === r.length
          ? (n) => n
          : 1 === r.length
            ? r[0]
            : r.reduce((n, r) => () => n(r.apply(void 0, arguments)))
      }
      function h() {
        for (var n = arguments.length, r = new Array(n), t = 0; t < n; t++)
          r[t] = arguments[t]
        return (n) => () => {
          var t = n.apply(void 0, arguments),
            e = () => {
              throw new Error(i(15))
            },
            o = {
              getState: t.getState,
              dispatch: () => e.apply(void 0, arguments),
            },
            f = r.map((n) => n(o))
          return (
            (e = d.apply(void 0, f)(t.dispatch)),
            u(u({}, t), {}, { dispatch: e })
          )
        }
      }
    },
    721153: (n, r, t) => {
      function e(n) {
        return (
          'Minified Redux error #' +
          n +
          '; visit https://redux.js.org/Errors?code=' +
          n +
          ' for the full message or use the non-minified dev environment for full errors. '
        )
      }
      t.d(r, { compose: () => a, createStore: () => c })
      var o =
          ('function' == typeof Symbol && Symbol.observable) || '@@observable',
        u = () => Math.random().toString(36).substring(7).split('').join('.'),
        i = {
          INIT: '@@redux/INIT' + u(),
          REPLACE: '@@redux/REPLACE' + u(),
          PROBE_UNKNOWN_ACTION: () => '@@redux/PROBE_UNKNOWN_ACTION' + u(),
        }
      function f(n) {
        if ('object' != typeof n || null === n) return !1
        for (var r = n; null !== Object.getPrototypeOf(r); )
          r = Object.getPrototypeOf(r)
        return Object.getPrototypeOf(n) === r
      }
      function c(n, r, t) {
        var u
        if (
          ('function' == typeof r && 'function' == typeof t) ||
          ('function' == typeof t && 'function' == typeof arguments[3])
        )
          throw new Error(e(0))
        if (
          ('function' == typeof r && void 0 === t && ((t = r), (r = void 0)),
          void 0 !== t)
        ) {
          if ('function' != typeof t) throw new Error(e(1))
          return t(c)(n, r)
        }
        if ('function' != typeof n) throw new Error(e(2))
        var a = n,
          l = r,
          p = [],
          s = p,
          v = !1
        function y() {
          s === p && (s = p.slice())
        }
        function d() {
          if (v) throw new Error(e(3))
          return l
        }
        function h(n) {
          if ('function' != typeof n) throw new Error(e(4))
          if (v) throw new Error(e(5))
          var r = !0
          return (
            y(),
            s.push(n),
            () => {
              if (r) {
                if (v) throw new Error(e(6))
                ;(r = !1), y()
                var t = s.indexOf(n)
                s.splice(t, 1), (p = null)
              }
            }
          )
        }
        function w(n) {
          if (!f(n)) throw new Error(e(7))
          if (void 0 === n.type) throw new Error(e(8))
          if (v) throw new Error(e(9))
          try {
            ;(v = !0), (l = a(l, n))
          } finally {
            v = !1
          }
          for (var r = (p = s), t = 0; t < r.length; t++) {
            ;(0, r[t])()
          }
          return n
        }
        function E(n) {
          if ('function' != typeof n) throw new Error(e(10))
          ;(a = n), w({ type: i.REPLACE })
        }
        function b() {
          var n,
            r = h
          return (
            ((n = {
              subscribe: (n) => {
                if ('object' != typeof n || null === n) throw new Error(e(11))
                function t() {
                  n.next && n.next(d())
                }
                return t(), { unsubscribe: r(t) }
              },
            })[o] = function () {
              return this
            }),
            n
          )
        }
        return (
          w({ type: i.INIT }),
          ((u = { dispatch: w, subscribe: h, getState: d, replaceReducer: E })[
            o
          ] = b),
          u
        )
      }
      function a() {
        for (var n = arguments.length, r = new Array(n), t = 0; t < n; t++)
          r[t] = arguments[t]
        return 0 === r.length
          ? (n) => n
          : 1 === r.length
            ? r[0]
            : r.reduce((n, r) => () => n(r.apply(void 0, arguments)))
      }
    },
    315882: (n, r, t) => {
      function e() {
        return (
          (e = Object.assign
            ? Object.assign.bind()
            : (n) => {
                for (var r = 1; r < arguments.length; r++) {
                  var t = arguments[r]
                  for (var e in t) Object.hasOwn(t, e) && (n[e] = t[e])
                }
                return n
              }),
          e.apply(this, arguments)
        )
      }
      t.d(r, { default: () => e })
    },
  },
])
