;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [959],
  {
    695257: (e, t) => {
      var r = Symbol.for('react.element'),
        n = Symbol.for('react.portal'),
        o = Symbol.for('react.fragment'),
        u = Symbol.for('react.strict_mode'),
        a = Symbol.for('react.profiler'),
        c = Symbol.for('react.provider'),
        i = Symbol.for('react.context'),
        f = Symbol.for('react.forward_ref'),
        s = Symbol.for('react.suspense'),
        l = Symbol.for('react.memo'),
        p = Symbol.for('react.lazy'),
        y = Symbol.iterator
      var d = {
          isMounted: () => !1,
          enqueueForceUpdate: () => {},
          enqueueReplaceState: () => {},
          enqueueSetState: () => {},
        },
        h = Object.assign,
        _ = {}
      function v(e, t, r) {
        ;(this.props = e),
          (this.context = t),
          (this.refs = _),
          (this.updater = r || d)
      }
      function b() {}
      function m(e, t, r) {
        ;(this.props = e),
          (this.context = t),
          (this.refs = _),
          (this.updater = r || d)
      }
      ;(v.prototype.isReactComponent = {}),
        (v.prototype.setState = function (e, t) {
          if ('object' != typeof e && 'function' != typeof e && null != e)
            throw Error(
              'setState(...): takes an object of state variables to update or a function which returns an object of state variables.',
            )
          this.updater.enqueueSetState(this, e, t, 'setState')
        }),
        (v.prototype.forceUpdate = function (e) {
          this.updater.enqueueForceUpdate(this, e, 'forceUpdate')
        }),
        (b.prototype = v.prototype)
      var S = (m.prototype = new b())
      ;(S.constructor = m), h(S, v.prototype), (S.isPureReactComponent = !0)
      var w = Array.isArray,
        k = Object.prototype.hasOwnProperty,
        E = { current: null },
        $ = { key: !0, ref: !0, __self: !0, __source: !0 }
      function R(e, t, n) {
        var o,
          u = {},
          a = null,
          c = null
        if (null != t)
          for (o in (void 0 !== t.ref && (c = t.ref),
          void 0 !== t.key && (a = '' + t.key),
          t))
            k.call(t, o) && !Object.hasOwn($, o) && (u[o] = t[o])
        var i = arguments.length - 2
        if (1 === i) u.children = n
        else if (1 < i) {
          for (var f = Array(i), s = 0; s < i; s++) f[s] = arguments[s + 2]
          u.children = f
        }
        if (e && e.defaultProps)
          for (o in (i = e.defaultProps)) void 0 === u[o] && (u[o] = i[o])
        return {
          $$typeof: r,
          type: e,
          key: a,
          ref: c,
          props: u,
          _owner: E.current,
        }
      }
      function C(e) {
        return 'object' == typeof e && null !== e && e.$$typeof === r
      }
      var g = /\/+/g
      function j(e, t) {
        return 'object' == typeof e && null !== e && null != e.key
          ? ((e) => {
              var t = { '=': '=0', ':': '=2' }
              return '$' + e.replace(/[=:]/g, (e) => t[e])
            })('' + e.key)
          : t.toString(36)
      }
      function O(e, t, o, u, a) {
        var c = typeof e
        ;('undefined' !== c && 'boolean' !== c) || (e = null)
        var i = !1
        if (null === e) i = !0
        else
          switch (c) {
            case 'string':
            case 'number':
              i = !0
              break
            case 'object':
              switch (e.$$typeof) {
                case r:
                case n:
                  i = !0
              }
          }
        if (i)
          return (
            (a = a((i = e))),
            (e = '' === u ? '.' + j(i, 0) : u),
            w(a)
              ? ((o = ''),
                null != e && (o = e.replace(g, '$&/') + '/'),
                O(a, t, o, '', (e) => e))
              : null != a &&
                (C(a) &&
                  (a = ((e, t) => ({
                    $$typeof: r,
                    type: e.type,
                    key: t,
                    ref: e.ref,
                    props: e.props,
                    _owner: e._owner,
                  }))(
                    a,
                    o +
                      (!a.key || (i && i.key === a.key)
                        ? ''
                        : ('' + a.key).replace(g, '$&/') + '/') +
                      e,
                  )),
                t.push(a)),
            1
          )
        if (((i = 0), (u = '' === u ? '.' : u + ':'), w(e)))
          for (var f = 0; f < e.length; f++) {
            var s = u + j((c = e[f]), f)
            i += O(c, t, o, s, a)
          }
        else if (
          ((s = ((e) =>
            null === e || 'object' != typeof e
              ? null
              : 'function' == typeof (e = (y && e[y]) || e['@@iterator'])
                ? e
                : null)(e)),
          'function' == typeof s)
        )
          for (e = s.call(e), f = 0; !(c = e.next()).done; )
            i += O((c = c.value), t, o, (s = u + j(c, f++)), a)
        else if ('object' === c)
          throw (
            ((t = String(e)),
            Error(
              'Objects are not valid as a React child (found: ' +
                ('[object Object]' === t
                  ? 'object with keys {' + Object.keys(e).join(', ') + '}'
                  : t) +
                '). If you meant to render a collection of children, use an array instead.',
            ))
          )
        return i
      }
      function x(e, t, r) {
        if (null == e) return e
        var n = [],
          o = 0
        return O(e, n, '', '', (e) => t.call(r, e, o++)), n
      }
      function P(e) {
        if (-1 === e._status) {
          var t = e._result
          ;(t = t()).then(
            (t) => {
              ;(0 !== e._status && -1 !== e._status) ||
                ((e._status = 1), (e._result = t))
            },
            (t) => {
              ;(0 !== e._status && -1 !== e._status) ||
                ((e._status = 2), (e._result = t))
            },
          ),
            -1 === e._status && ((e._status = 0), (e._result = t))
        }
        if (1 === e._status) return e._result.default
        throw e._result
      }
      var I = { current: null },
        T = { transition: null },
        V = {
          ReactCurrentDispatcher: I,
          ReactCurrentBatchConfig: T,
          ReactCurrentOwner: E,
        }
      ;(t.Children = {
        map: x,
        forEach: (e, t, r) => {
          x(
            e,
            function () {
              t.apply(this, arguments)
            },
            r,
          )
        },
        count: (e) => {
          var t = 0
          return (
            x(e, () => {
              t++
            }),
            t
          )
        },
        toArray: (e) => x(e, (e) => e) || [],
        only: (e) => {
          if (!C(e))
            throw Error(
              'React.Children.only expected to receive a single React element child.',
            )
          return e
        },
      }),
        (t.Component = v),
        (t.Fragment = o),
        (t.Profiler = a),
        (t.PureComponent = m),
        (t.StrictMode = u),
        (t.Suspense = s),
        (t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = V),
        (t.cloneElement = (e, t, n) => {
          if (null == e)
            throw Error(
              'React.cloneElement(...): The argument must be a React element, but you passed ' +
                e +
                '.',
            )
          var o = h({}, e.props),
            u = e.key,
            a = e.ref,
            c = e._owner
          if (null != t) {
            if (
              (void 0 !== t.ref && ((a = t.ref), (c = E.current)),
              void 0 !== t.key && (u = '' + t.key),
              e.type && e.type.defaultProps)
            )
              var i = e.type.defaultProps
            for (f in t)
              k.call(t, f) &&
                !Object.hasOwn($, f) &&
                (o[f] = void 0 === t[f] && void 0 !== i ? i[f] : t[f])
          }
          var f = arguments.length - 2
          if (1 === f) o.children = n
          else if (1 < f) {
            i = Array(f)
            for (var s = 0; s < f; s++) i[s] = arguments[s + 2]
            o.children = i
          }
          return {
            $$typeof: r,
            type: e.type,
            key: u,
            ref: a,
            props: o,
            _owner: c,
          }
        }),
        (t.createContext = (e) => (
          ((e = {
            $$typeof: i,
            _currentValue: e,
            _currentValue2: e,
            _threadCount: 0,
            Provider: null,
            Consumer: null,
            _defaultValue: null,
            _globalName: null,
          }).Provider = { $$typeof: c, _context: e }),
          (e.Consumer = e)
        )),
        (t.createElement = R),
        (t.createFactory = (e) => {
          var t = R.bind(null, e)
          return (t.type = e), t
        }),
        (t.createRef = () => ({ current: null })),
        (t.forwardRef = (e) => ({ $$typeof: f, render: e })),
        (t.isValidElement = C),
        (t.lazy = (e) => ({
          $$typeof: p,
          _payload: { _status: -1, _result: e },
          _init: P,
        })),
        (t.memo = (e, t) => ({
          $$typeof: l,
          type: e,
          compare: void 0 === t ? null : t,
        })),
        (t.startTransition = (e) => {
          var t = T.transition
          T.transition = {}
          try {
            e()
          } finally {
            T.transition = t
          }
        }),
        (t.unstable_act = () => {
          throw Error(
            'act(...) is not supported in production builds of React.',
          )
        }),
        (t.useCallback = (e, t) => I.current.useCallback(e, t)),
        (t.useContext = (e) => I.current.useContext(e)),
        (t.useDebugValue = () => {}),
        (t.useDeferredValue = (e) => I.current.useDeferredValue(e)),
        (t.useEffect = (e, t) => I.current.useEffect(e, t)),
        (t.useId = () => I.current.useId()),
        (t.useImperativeHandle = (e, t, r) =>
          I.current.useImperativeHandle(e, t, r)),
        (t.useInsertionEffect = (e, t) => I.current.useInsertionEffect(e, t)),
        (t.useLayoutEffect = (e, t) => I.current.useLayoutEffect(e, t)),
        (t.useMemo = (e, t) => I.current.useMemo(e, t)),
        (t.useReducer = (e, t, r) => I.current.useReducer(e, t, r)),
        (t.useRef = (e) => I.current.useRef(e)),
        (t.useState = (e) => I.current.useState(e)),
        (t.useSyncExternalStore = (e, t, r) =>
          I.current.useSyncExternalStore(e, t, r)),
        (t.useTransition = () => I.current.useTransition()),
        (t.version = '18.2.0')
    },
    50959: (e, t, r) => {
      e.exports = r(695257)
    },
  },
])
