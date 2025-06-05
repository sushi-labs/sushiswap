;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1371, 4773, 1277],
  {
    259142: (e, t) => {
      var n, r, o
      ;(r = [t]),
        (n = (e) => {
          function t(e) {
            if (Array.isArray(e)) {
              for (var t = 0, n = Array(e.length); t < e.length; t++)
                n[t] = e[t]
              return n
            }
            return Array.from(e)
          }
          Object.defineProperty(e, '__esModule', { value: !0 })
          var n = !1
          if ('undefined' != typeof window) {
            var r = {
              get passive() {
                n = !0
              },
            }
            window.addEventListener('testPassive', null, r),
              window.removeEventListener('testPassive', null, r)
          }
          var o =
              'undefined' != typeof window &&
              window.navigator &&
              window.navigator.platform &&
              /iP(ad|hone|od)/.test(window.navigator.platform),
            c = [],
            u = !1,
            a = -1,
            i = void 0,
            s = void 0,
            f = (e) =>
              c.some(
                (t) =>
                  !(!t.options.allowTouchMove || !t.options.allowTouchMove(e)),
              ),
            l = (e) => {
              var t = e || window.event
              return (
                !!f(t.target) ||
                1 < t.touches.length ||
                (t.preventDefault && t.preventDefault(), !1)
              )
            },
            d = () => {
              setTimeout(() => {
                void 0 !== s &&
                  ((document.body.style.paddingRight = s), (s = void 0)),
                  void 0 !== i &&
                    ((document.body.style.overflow = i), (i = void 0))
              })
            }
          ;(e.disableBodyScroll = (e, r) => {
            if (o) {
              if (!e)
                return void console.error(
                  'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
                )
              if (e && !c.some((t) => t.targetElement === e)) {
                var d = { targetElement: e, options: r || {} }
                ;(c = [].concat(t(c), [d])),
                  (e.ontouchstart = (e) => {
                    1 === e.targetTouches.length &&
                      (a = e.targetTouches[0].clientY)
                  }),
                  (e.ontouchmove = (t) => {
                    var n, r, o, c
                    1 === t.targetTouches.length &&
                      ((r = e),
                      (c = (n = t).targetTouches[0].clientY - a),
                      !f(n.target) &&
                        ((r && 0 === r.scrollTop && 0 < c) ||
                        ((o = r) &&
                          o.scrollHeight - o.scrollTop <= o.clientHeight &&
                          c < 0)
                          ? l(n)
                          : n.stopPropagation()))
                  }),
                  u ||
                    (document.addEventListener(
                      'touchmove',
                      l,
                      n ? { passive: !1 } : void 0,
                    ),
                    (u = !0))
              }
            } else {
              ;(v = r),
                setTimeout(() => {
                  if (void 0 === s) {
                    var e = !!v && !0 === v.reserveScrollBarGap,
                      t =
                        window.innerWidth - document.documentElement.clientWidth
                    e &&
                      0 < t &&
                      ((s = document.body.style.paddingRight),
                      (document.body.style.paddingRight = t + 'px'))
                  }
                  void 0 === i &&
                    ((i = document.body.style.overflow),
                    (document.body.style.overflow = 'hidden'))
                })
              var p = { targetElement: e, options: r || {} }
              c = [].concat(t(c), [p])
            }
            var v
          }),
            (e.clearAllBodyScrollLocks = () => {
              o
                ? (c.forEach((e) => {
                    ;(e.targetElement.ontouchstart = null),
                      (e.targetElement.ontouchmove = null)
                  }),
                  u &&
                    (document.removeEventListener(
                      'touchmove',
                      l,
                      n ? { passive: !1 } : void 0,
                    ),
                    (u = !1)),
                  (c = []),
                  (a = -1))
                : (d(), (c = []))
            }),
            (e.enableBodyScroll = (e) => {
              if (o) {
                if (!e)
                  return void console.error(
                    'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                  )
                ;(e.ontouchstart = null),
                  (e.ontouchmove = null),
                  (c = c.filter((t) => t.targetElement !== e)),
                  u &&
                    0 === c.length &&
                    (document.removeEventListener(
                      'touchmove',
                      l,
                      n ? { passive: !1 } : void 0,
                    ),
                    (u = !1))
              } else
                1 === c.length && c[0].targetElement === e
                  ? (d(), (c = []))
                  : (c = c.filter((t) => t.targetElement !== e))
            })
        }),
        void 0 === (o = 'function' == typeof n ? n.apply(t, r) : n) ||
          (e.exports = o)
    },
    472535: (e, t, n) => {
      var r = n(756237),
        o = {
          childContextTypes: !0,
          contextType: !0,
          contextTypes: !0,
          defaultProps: !0,
          displayName: !0,
          getDefaultProps: !0,
          getDerivedStateFromError: !0,
          getDerivedStateFromProps: !0,
          mixins: !0,
          propTypes: !0,
          type: !0,
        },
        c = {
          name: !0,
          length: !0,
          prototype: !0,
          caller: !0,
          callee: !0,
          arguments: !0,
          arity: !0,
        },
        u = {
          $$typeof: !0,
          compare: !0,
          defaultProps: !0,
          displayName: !0,
          propTypes: !0,
          type: !0,
        },
        a = {}
      function i(e) {
        return r.isMemo(e) ? u : a[e.$$typeof] || o
      }
      ;(a[r.ForwardRef] = {
        $$typeof: !0,
        render: !0,
        defaultProps: !0,
        displayName: !0,
        propTypes: !0,
      }),
        (a[r.Memo] = u)
      var s = Object.defineProperty,
        f = Object.getOwnPropertyNames,
        l = Object.getOwnPropertySymbols,
        d = Object.getOwnPropertyDescriptor,
        p = Object.getPrototypeOf,
        v = Object.prototype
      e.exports = function e(t, n, r) {
        if ('string' != typeof n) {
          if (v) {
            var o = p(n)
            o && o !== v && e(t, o, r)
          }
          var u = f(n)
          l && (u = u.concat(l(n)))
          for (var a = i(t), y = i(n), m = 0; m < u.length; ++m) {
            var h = u[m]
            if (!(c[h] || (r && r[h]) || (y && y[h]) || (a && a[h]))) {
              var g = d(n, h)
              try {
                s(t, h, g)
              } catch (e) {}
            }
          }
        }
        return t
      }
    },
    760198: (e, t) => {
      var n = 'function' == typeof Symbol && Symbol.for,
        r = n ? Symbol.for('react.element') : 60103,
        o = n ? Symbol.for('react.portal') : 60106,
        c = n ? Symbol.for('react.fragment') : 60107,
        u = n ? Symbol.for('react.strict_mode') : 60108,
        a = n ? Symbol.for('react.profiler') : 60114,
        i = n ? Symbol.for('react.provider') : 60109,
        s = n ? Symbol.for('react.context') : 60110,
        f = n ? Symbol.for('react.async_mode') : 60111,
        l = n ? Symbol.for('react.concurrent_mode') : 60111,
        d = n ? Symbol.for('react.forward_ref') : 60112,
        p = n ? Symbol.for('react.suspense') : 60113,
        v = n ? Symbol.for('react.suspense_list') : 60120,
        y = n ? Symbol.for('react.memo') : 60115,
        m = n ? Symbol.for('react.lazy') : 60116,
        h = n ? Symbol.for('react.block') : 60121,
        g = n ? Symbol.for('react.fundamental') : 60117,
        S = n ? Symbol.for('react.responder') : 60118,
        b = n ? Symbol.for('react.scope') : 60119
      function E(e) {
        if ('object' == typeof e && null !== e) {
          var t = e.$$typeof
          switch (t) {
            case r:
              switch ((e = e.type)) {
                case f:
                case l:
                case c:
                case a:
                case u:
                case p:
                  return e
                default:
                  switch ((e = e && e.$$typeof)) {
                    case s:
                    case d:
                    case m:
                    case y:
                    case i:
                      return e
                    default:
                      return t
                  }
              }
            case o:
              return t
          }
        }
      }
      function w(e) {
        return E(e) === l
      }
      ;(t.AsyncMode = f),
        (t.ConcurrentMode = l),
        (t.ContextConsumer = s),
        (t.ContextProvider = i),
        (t.Element = r),
        (t.ForwardRef = d),
        (t.Fragment = c),
        (t.Lazy = m),
        (t.Memo = y),
        (t.Portal = o),
        (t.Profiler = a),
        (t.StrictMode = u),
        (t.Suspense = p),
        (t.isAsyncMode = (e) => w(e) || E(e) === f),
        (t.isConcurrentMode = w),
        (t.isContextConsumer = (e) => E(e) === s),
        (t.isContextProvider = (e) => E(e) === i),
        (t.isElement = (e) =>
          'object' == typeof e && null !== e && e.$$typeof === r),
        (t.isForwardRef = (e) => E(e) === d),
        (t.isFragment = (e) => E(e) === c),
        (t.isLazy = (e) => E(e) === m),
        (t.isMemo = (e) => E(e) === y),
        (t.isPortal = (e) => E(e) === o),
        (t.isProfiler = (e) => E(e) === a),
        (t.isStrictMode = (e) => E(e) === u),
        (t.isSuspense = (e) => E(e) === p),
        (t.isValidElementType = (e) =>
          'string' == typeof e ||
          'function' == typeof e ||
          e === c ||
          e === l ||
          e === a ||
          e === u ||
          e === p ||
          e === v ||
          ('object' == typeof e &&
            null !== e &&
            (e.$$typeof === m ||
              e.$$typeof === y ||
              e.$$typeof === i ||
              e.$$typeof === s ||
              e.$$typeof === d ||
              e.$$typeof === g ||
              e.$$typeof === S ||
              e.$$typeof === b ||
              e.$$typeof === h))),
        (t.typeOf = E)
    },
    756237: (e, t, n) => {
      e.exports = n(760198)
    },
    811195: (e, t) => {
      var n,
        r = Symbol.for('react.element'),
        o = Symbol.for('react.portal'),
        c = Symbol.for('react.fragment'),
        u = Symbol.for('react.strict_mode'),
        a = Symbol.for('react.profiler'),
        i = Symbol.for('react.provider'),
        s = Symbol.for('react.context'),
        f = Symbol.for('react.server_context'),
        l = Symbol.for('react.forward_ref'),
        d = Symbol.for('react.suspense'),
        p = Symbol.for('react.suspense_list'),
        v = Symbol.for('react.memo'),
        y = Symbol.for('react.lazy'),
        m = Symbol.for('react.offscreen')
      function h(e) {
        if ('object' == typeof e && null !== e) {
          var t = e.$$typeof
          switch (t) {
            case r:
              switch ((e = e.type)) {
                case c:
                case a:
                case u:
                case d:
                case p:
                  return e
                default:
                  switch ((e = e && e.$$typeof)) {
                    case f:
                    case s:
                    case l:
                    case y:
                    case v:
                    case i:
                      return e
                    default:
                      return t
                  }
              }
            case o:
              return t
          }
        }
      }
      ;(n = Symbol.for('react.module.reference')),
        (t.isContextConsumer = (e) => h(e) === s)
    },
    361357: (e, t, n) => {
      e.exports = n(811195)
    },
    386942: (e, t, n) => {
      n.r(t),
        n.d(t, {
          Provider: () => B,
          ReactReduxContext: () => s,
          batch: () => c.unstable_batchedUpdates,
          connect: () => q,
          createDispatchHook: () => H,
          createSelectorHook: () => v,
          createStoreHook: () => F,
          shallowEqual: () => N,
          useDispatch: () => z,
          useSelector: () => y,
          useStore: () => I,
        })
      var r = n(104322),
        o = n(107231),
        c = n(500962)
      let u = (e) => {
        e()
      }
      const a = () => u
      var i = n(50959)
      const s = (0, i.createContext)(null)
      function f() {
        return (0, i.useContext)(s)
      }
      const l = () => {
        throw new Error('uSES not initialized!')
      }
      let d = l
      const p = (e, t) => e === t
      function v(e = s) {
        const t = e === s ? f : () => (0, i.useContext)(e)
        return (e, n = p) => {
          const { store: r, subscription: o, getServerState: c } = t(),
            u = d(o.addNestedSub, r.getState, c || r.getState, e, n)
          return (0, i.useDebugValue)(u), u
        }
      }
      const y = v()
      var m = n(315882),
        h = n(330950),
        g = n(472535),
        S = n.n(g),
        b = n(361357)
      const E = [
        'initMapStateToProps',
        'initMapDispatchToProps',
        'initMergeProps',
      ]
      function w(
        e,
        t,
        n,
        r,
        { areStatesEqual: o, areOwnPropsEqual: c, areStatePropsEqual: u },
      ) {
        let a,
          i,
          s,
          f,
          l,
          d = !1
        function p(d, p) {
          const v = !c(p, i),
            y = !o(d, a, p, i)
          return (
            (a = d),
            (i = p),
            v && y
              ? ((s = e(a, i)),
                t.dependsOnOwnProps && (f = t(r, i)),
                (l = n(s, f, i)),
                l)
              : v
                ? (e.dependsOnOwnProps && (s = e(a, i)),
                  t.dependsOnOwnProps && (f = t(r, i)),
                  (l = n(s, f, i)),
                  l)
                : y
                  ? (() => {
                      const t = e(a, i),
                        r = !u(t, s)
                      return (s = t), r && (l = n(s, f, i)), l
                    })()
                  : l
          )
        }
        return (o, c) =>
          d
            ? p(o, c)
            : ((a = o),
              (i = c),
              (s = e(a, i)),
              (f = t(r, i)),
              (l = n(s, f, i)),
              (d = !0),
              l)
      }
      function x(e) {
        return (t) => {
          const n = e(t)
          function r() {
            return n
          }
          return (r.dependsOnOwnProps = !1), r
        }
      }
      function C(e) {
        return e.dependsOnOwnProps
          ? Boolean(e.dependsOnOwnProps)
          : 1 !== e.length
      }
      function P(e, t) {
        return (t, { displayName: n }) => {
          const r = (e, t) =>
            r.dependsOnOwnProps ? r.mapToProps(e, t) : r.mapToProps(e, void 0)
          return (
            (r.dependsOnOwnProps = !0),
            (r.mapToProps = (t, n) => {
              ;(r.mapToProps = e), (r.dependsOnOwnProps = C(e))
              let o = r(t, n)
              return (
                'function' == typeof o &&
                  ((r.mapToProps = o),
                  (r.dependsOnOwnProps = C(o)),
                  (o = r(t, n))),
                o
              )
            }),
            r
          )
        }
      }
      function T(e, t) {
        return (n, r) => {
          throw new Error(
            `Invalid value of type ${typeof e} for ${t} argument when connecting component ${r.wrappedComponentName}.`,
          )
        }
      }
      function M(e, t, n) {
        return (0, m.default)({}, n, e, t)
      }
      const O = { notify() {}, get: () => [] }
      function k(e, t) {
        let n,
          r = O
        function o() {
          u.onStateChange && u.onStateChange()
        }
        function c() {
          n ||
            ((n = t ? t.addNestedSub(o) : e.subscribe(o)),
            (r = (() => {
              const e = a()
              let t = null,
                n = null
              return {
                clear() {
                  ;(t = null), (n = null)
                },
                notify() {
                  e(() => {
                    let e = t
                    while (e) e.callback(), (e = e.next)
                  })
                },
                get() {
                  let e = [],
                    n = t
                  while (n) e.push(n), (n = n.next)
                  return e
                },
                subscribe(e) {
                  let r = !0,
                    o = (n = { callback: e, next: null, prev: n })
                  return (
                    o.prev ? (o.prev.next = o) : (t = o),
                    () => {
                      r &&
                        null !== t &&
                        ((r = !1),
                        o.next ? (o.next.prev = o.prev) : (n = o.prev),
                        o.prev ? (o.prev.next = o.next) : (t = o.next))
                    }
                  )
                },
              }
            })()))
        }
        const u = {
          addNestedSub: (e) => (c(), r.subscribe(e)),
          notifyNestedSubs: () => {
            r.notify()
          },
          handleChangeWrapper: o,
          isSubscribed: () => Boolean(n),
          trySubscribe: c,
          tryUnsubscribe: () => {
            n && (n(), (n = void 0), r.clear(), (r = O))
          },
          getListeners: () => r,
        }
        return u
      }
      const R = !(
        'undefined' == typeof window ||
        void 0 === window.document ||
        void 0 === window.document.createElement
      )
        ? i.useLayoutEffect
        : i.useEffect
      function j(e, t) {
        return e === t ? 0 !== e || 0 !== t || 1 / e == 1 / t : e != e && t != t
      }
      function N(e, t) {
        if (j(e, t)) return !0
        if (
          'object' != typeof e ||
          null === e ||
          'object' != typeof t ||
          null === t
        )
          return !1
        const n = Object.keys(e),
          r = Object.keys(t)
        if (n.length !== r.length) return !1
        for (let r = 0; r < n.length; r++)
          if (!Object.hasOwn(t, n[r]) || !j(e[n[r]], t[n[r]])) return !1
        return !0
      }
      const $ = ['reactReduxForwardedRef']
      let A = l
      const _ = [null, null]
      function L(e, t, n, r, o, c) {
        ;(e.current = r),
          (n.current = !1),
          o.current && ((o.current = null), c())
      }
      function D(e, t) {
        return e === t
      }
      const q = (
        e,
        t,
        n,
        {
          pure: r,
          areStatesEqual: o = D,
          areOwnPropsEqual: c = N,
          areStatePropsEqual: u = N,
          areMergedPropsEqual: a = N,
          forwardRef: f = !1,
          context: l = s,
        } = {},
      ) => {
        const d = l,
          p = ((e) =>
            e
              ? 'function' == typeof e
                ? P(e)
                : T(e, 'mapStateToProps')
              : x(() => ({})))(e),
          v = ((e) =>
            e && 'object' == typeof e
              ? x((t) =>
                  ((e, t) => {
                    const n = {}
                    for (const r in e) {
                      const o = e[r]
                      'function' == typeof o && (n[r] = (...e) => t(o(...e)))
                    }
                    return n
                  })(e, t),
                )
              : e
                ? 'function' == typeof e
                  ? P(e)
                  : T(e, 'mapDispatchToProps')
                : x((e) => ({ dispatch: e })))(t),
          y = ((e) =>
            e
              ? 'function' == typeof e
                ? (
                    (e) =>
                    (t, { displayName: n, areMergedPropsEqual: r }) => {
                      let o,
                        c = !1
                      return (t, n, u) => {
                        const a = e(t, n, u)
                        return c ? r(a, o) || (o = a) : ((c = !0), (o = a)), o
                      }
                    }
                  )(e)
                : T(e, 'mergeProps')
              : () => M)(n),
          g = Boolean(e)
        return (e) => {
          const t = e.displayName || e.name || 'Component',
            n = `Connect(${t})`,
            r = {
              shouldHandleStateChanges: g,
              displayName: n,
              wrappedComponentName: t,
              WrappedComponent: e,
              initMapStateToProps: p,
              initMapDispatchToProps: v,
              initMergeProps: y,
              areStatesEqual: o,
              areStatePropsEqual: u,
              areOwnPropsEqual: c,
              areMergedPropsEqual: a,
            }
          function s(t) {
            const [n, o, c] = (0, i.useMemo)(() => {
                const { reactReduxForwardedRef: e } = t,
                  n = (0, h.default)(t, $)
                return [t.context, e, n]
              }, [t]),
              u = (0, i.useMemo)(
                () =>
                  n &&
                  n.Consumer &&
                  (0, b.isContextConsumer)(i.createElement(n.Consumer, null))
                    ? n
                    : d,
                [n, d],
              ),
              a = (0, i.useContext)(u),
              s =
                Boolean(t.store) &&
                Boolean(t.store.getState) &&
                Boolean(t.store.dispatch),
              f = Boolean(a) && Boolean(a.store)
            const l = s ? t.store : a.store,
              p = f ? a.getServerState : l.getState,
              v = (0, i.useMemo)(
                () =>
                  ((e, t) => {
                    const {
                        initMapStateToProps: n,
                        initMapDispatchToProps: r,
                        initMergeProps: o,
                      } = t,
                      c = (0, h.default)(t, E)
                    return w(n(e, c), r(e, c), o(e, c), e, c)
                  })(l.dispatch, r),
                [l],
              ),
              [y, S] = (0, i.useMemo)(() => {
                if (!g) return _
                const e = k(l, s ? void 0 : a.subscription),
                  t = e.notifyNestedSubs.bind(e)
                return [e, t]
              }, [l, s, a]),
              x = (0, i.useMemo)(
                () => (s ? a : (0, m.default)({}, a, { subscription: y })),
                [s, a, y],
              ),
              C = (0, i.useRef)(),
              P = (0, i.useRef)(c),
              T = (0, i.useRef)(),
              M = (0, i.useRef)(!1),
              O = ((0, i.useRef)(!1), (0, i.useRef)(!1)),
              j = (0, i.useRef)()
            R(
              () => (
                (O.current = !0),
                () => {
                  O.current = !1
                }
              ),
              [],
            )
            const N = (0, i.useMemo)(
                () => () =>
                  T.current && c === P.current ? T.current : v(l.getState(), c),
                [l, c],
              ),
              D = (0, i.useMemo)(
                () => (e) =>
                  y
                    ? ((e, t, n, r, o, c, u, a, i, s, f) => {
                        if (!e) return () => {}
                        let l = !1,
                          d = null
                        const p = () => {
                          if (l || !a.current) return
                          const e = t.getState()
                          let n, p
                          try {
                            n = r(e, o.current)
                          } catch (e) {
                            ;(p = e), (d = e)
                          }
                          p || (d = null),
                            n === c.current
                              ? u.current || s()
                              : ((c.current = n),
                                (i.current = n),
                                (u.current = !0),
                                f())
                        }
                        return (
                          (n.onStateChange = p),
                          n.trySubscribe(),
                          p(),
                          () => {
                            if (
                              ((l = !0),
                              n.tryUnsubscribe(),
                              (n.onStateChange = null),
                              d)
                            )
                              throw d
                          }
                        )
                      })(g, l, y, v, P, C, M, O, T, S, e)
                    : () => {},
                [y],
              )
            var q, B, F
            let I
            ;(q = L), (B = [P, C, M, c, T, S]), R(() => q(...B), F)
            try {
              I = A(D, N, p ? () => v(p(), c) : N)
            } catch (e) {
              throw (
                (j.current &&
                  (e.message += `\nThe error may be correlated with this previous error:\n${j.current.stack}\n\n`),
                e)
              )
            }
            R(() => {
              ;(j.current = void 0), (T.current = void 0), (C.current = I)
            })
            const H = (0, i.useMemo)(
              () => i.createElement(e, (0, m.default)({}, I, { ref: o })),
              [o, e, I],
            )
            return (0, i.useMemo)(
              () => (g ? i.createElement(u.Provider, { value: x }, H) : H),
              [u, H, x],
            )
          }
          const l = i.memo(s)
          if (
            ((l.WrappedComponent = e), (l.displayName = s.displayName = n), f)
          ) {
            const t = i.forwardRef((e, t) =>
              i.createElement(
                l,
                (0, m.default)({}, e, { reactReduxForwardedRef: t }),
              ),
            )
            return (t.displayName = n), (t.WrappedComponent = e), S()(t, e)
          }
          return S()(l, e)
        }
      }
      const B = ({ store: e, context: t, children: n, serverState: r }) => {
        const o = (0, i.useMemo)(() => {
            const t = k(e)
            return {
              store: e,
              subscription: t,
              getServerState: r ? () => r : void 0,
            }
          }, [e, r]),
          c = (0, i.useMemo)(() => e.getState(), [e])
        R(() => {
          const { subscription: t } = o
          return (
            (t.onStateChange = t.notifyNestedSubs),
            t.trySubscribe(),
            c !== e.getState() && t.notifyNestedSubs(),
            () => {
              t.tryUnsubscribe(), (t.onStateChange = void 0)
            }
          )
        }, [o, c])
        const u = t || s
        return i.createElement(u.Provider, { value: o }, n)
      }
      function F(e = s) {
        const t = e === s ? f : () => (0, i.useContext)(e)
        return () => {
          const { store: e } = t()
          return e
        }
      }
      const I = F()
      function H(e = s) {
        const t = e === s ? I : F(e)
        return () => t().dispatch
      }
      const z = H()
      var W, U
      ;(W = o.useSyncExternalStoreWithSelector),
        (d = W),
        ((e) => {
          A = e
        })(r.useSyncExternalStore),
        (U = c.unstable_batchedUpdates),
        (u = U)
    },
    254773: (e, t, n) => {
      n.d(t, { buffers: () => a.H, default: () => Y, eventChannel: () => O })
      var r = n(749209),
        o = n(315882),
        c = n(330950),
        u = n(375880),
        a = n(90932),
        i = n(721153)
      function s() {
        var e = {}
        return (
          (e.promise = new Promise((t, n) => {
            ;(e.resolve = t), (e.reject = n)
          })),
          e
        )
      }
      const f = s
      var l = [],
        d = 0
      function p(e) {
        try {
          m(), e()
        } finally {
          h()
        }
      }
      function v(e) {
        l.push(e), d || (m(), g())
      }
      function y(e) {
        try {
          return m(), e()
        } finally {
          g()
        }
      }
      function m() {
        d++
      }
      function h() {
        d--
      }
      function g() {
        var e
        for (h(); !d && void 0 !== (e = l.shift()); ) p(e)
      }
      var S = (e) => (t) => e.some((e) => C(e)(t)),
        b = (e) => (t) => e(t),
        E = (e) => (t) => t.type === String(e),
        w = (e) => (t) => t.type === e,
        x = () => a.k
      function C(e) {
        var t =
          '*' === e
            ? x
            : (0, u.string)(e)
              ? E
              : (0, u.array)(e)
                ? S
                : (0, u.stringableFunc)(e)
                  ? E
                  : (0, u.func)(e)
                    ? b
                    : (0, u.symbol)(e)
                      ? w
                      : null
        if (null === t) throw new Error('invalid pattern: ' + e)
        return t(e)
      }
      var P = { type: r.CHANNEL_END_TYPE },
        T = (e) => e && e.type === r.CHANNEL_END_TYPE
      function M(e) {
        void 0 === e && (e = (0, a.e)())
        var t = !1,
          n = []
        return {
          take: (r) => {
            t && e.isEmpty()
              ? r(P)
              : e.isEmpty()
                ? (n.push(r),
                  (r.cancel = () => {
                    ;(0, a.r)(n, r)
                  }))
                : r(e.take())
          },
          put: (r) => {
            if (!t) {
              if (0 === n.length) return e.put(r)
              n.shift()(r)
            }
          },
          flush: (n) => {
            t && e.isEmpty() ? n(P) : n(e.flush())
          },
          close: () => {
            if (!t) {
              t = !0
              var e = n
              n = []
              for (var r = 0, o = e.length; r < o; r++) {
                ;(0, e[r])(P)
              }
            }
          },
        }
      }
      function O(e, t) {
        void 0 === t && (t = (0, a.n)())
        var n,
          r = !1,
          o = M(t),
          c = () => {
            r || ((r = !0), (0, u.func)(n) && n(), o.close())
          }
        return (
          (n = e((e) => {
            T(e) ? c() : o.put(e)
          })),
          (n = (0, a.o)(n)),
          r && n(),
          { take: o.take, flush: o.flush, close: c }
        )
      }
      function k() {
        var e,
          t,
          n,
          o,
          c,
          u,
          i =
            ((t = !1),
            (o = n = []),
            (c = () => {
              o === n && (o = n.slice())
            }),
            (u = () => {
              t = !0
              var e = (n = o)
              ;(o = []),
                e.forEach((e) => {
                  e(P)
                })
            }),
            ((e = {})[r.MULTICAST] = !0),
            (e.put = (e) => {
              if (!t)
                if (T(e)) u()
                else
                  for (var c = (n = o), a = 0, i = c.length; a < i; a++) {
                    var s = c[a]
                    s[r.MATCH](e) && (s.cancel(), s(e))
                  }
            }),
            (e.take = (e, n) => {
              void 0 === n && (n = x),
                t
                  ? e(P)
                  : ((e[r.MATCH] = n),
                    c(),
                    o.push(e),
                    (e.cancel = (0, a.o)(() => {
                      c(), (0, a.r)(o, e)
                    })))
            }),
            (e.close = u),
            e),
          s = i.put
        return (
          (i.put = (e) => {
            e[r.SAGA_ACTION]
              ? s(e)
              : v(() => {
                  s(e)
                })
          }),
          i
        )
      }
      function R(e, t) {
        var n = e[r.CANCEL]
        ;(0, u.func)(n) && (t.cancel = n),
          e.then(t, (e) => {
            t(e, !0)
          })
      }
      var j,
        N = 0,
        $ = () => ++N
      function A(e) {
        e.isRunning() && e.cancel()
      }
      var _ =
        (((j = {})[a.T] = (e, t, n) => {
          var o = t.channel,
            c = void 0 === o ? e.channel : o,
            a = t.pattern,
            i = t.maybe,
            s = (e) => {
              e instanceof Error ? n(e, !0) : !T(e) || i ? n(e) : n(r.TERMINATE)
            }
          try {
            c.take(s, (0, u.notUndef)(a) ? C(a) : null)
          } catch (e) {
            return void n(e, !0)
          }
          n.cancel = s.cancel
        }),
        (j[a.P] = (e, t, n) => {
          var r = t.channel,
            o = t.action,
            c = t.resolve
          v(() => {
            var t
            try {
              t = (r ? r.put : e.dispatch)(o)
            } catch (e) {
              return void n(e, !0)
            }
            c && (0, u.promise)(t) ? R(t, n) : n(t)
          })
        }),
        (j[a.A] = (e, t, n, r) => {
          var o = r.digestEffect,
            c = N,
            i = Object.keys(t)
          if (0 !== i.length) {
            var s = (0, a.l)(t, n)
            i.forEach((e) => {
              o(t[e], c, s[e], e)
            })
          } else n((0, u.array)(t) ? [] : {})
        }),
        (j[a.R] = (e, t, n, r) => {
          var o = r.digestEffect,
            c = N,
            i = Object.keys(t),
            s = (0, u.array)(t) ? (0, a.m)(i.length) : {},
            f = {},
            l = !1
          i.forEach((e) => {
            var t = (t, r) => {
              l ||
                (r || (0, a.s)(t)
                  ? (n.cancel(), n(t, r))
                  : (n.cancel(), (l = !0), (s[e] = t), n(s)))
            }
            ;(t.cancel = a.t), (f[e] = t)
          }),
            (n.cancel = () => {
              l || ((l = !0), i.forEach((e) => f[e].cancel()))
            }),
            i.forEach((e) => {
              l || o(t[e], c, f[e], e)
            })
        }),
        (j[a.C] = (e, t, n, r) => {
          var o = t.context,
            c = t.fn,
            i = t.args,
            s = r.task
          try {
            var f = c.apply(o, i)
            if ((0, u.promise)(f)) return void R(f, n)
            if ((0, u.iterator)(f))
              return void U(e, f, s.context, N, (0, a.j)(c), !1, n)
            n(f)
          } catch (e) {
            n(e, !0)
          }
        }),
        (j[a.a] = (e, t, n) => {
          var r = t.context,
            o = t.fn,
            c = t.args
          try {
            var a = (e, t) => {
              ;(0, u.undef)(e) ? n(t) : n(e, !0)
            }
            o.apply(r, c.concat(a)), a.cancel && (n.cancel = a.cancel)
          } catch (e) {
            n(e, !0)
          }
        }),
        (j[a.F] = (e, t, n, r) => {
          var o = t.context,
            c = t.fn,
            i = t.args,
            s = t.detached,
            f = r.task,
            l = ((e) => {
              var t = e.context,
                n = e.fn,
                r = e.args
              try {
                var o = n.apply(t, r)
                if ((0, u.iterator)(o)) return o
                var c = !1
                return (0, a.q)((e) =>
                  c
                    ? { value: e, done: !0 }
                    : ((c = !0), { value: o, done: !(0, u.promise)(o) }),
                )
              } catch (e) {
                return (0, a.q)(() => {
                  throw e
                })
              }
            })({ context: o, fn: c, args: i }),
            d = ((e, t) =>
              e.isSagaIterator ? { name: e.meta.name } : (0, a.j)(t))(l, c)
          y(() => {
            var t = U(e, l, f.context, N, d, s, void 0)
            s
              ? n(t)
              : t.isRunning()
                ? (f.queue.addTask(t), n(t))
                : t.isAborted()
                  ? f.queue.abort(t.error())
                  : n(t)
          })
        }),
        (j[a.J] = (e, t, n, r) => {
          var o = r.task,
            c = (e, t) => {
              if (e.isRunning()) {
                var n = { task: o, cb: t }
                ;(t.cancel = () => {
                  e.isRunning() && (0, a.r)(e.joiners, n)
                }),
                  e.joiners.push(n)
              } else e.isAborted() ? t(e.error(), !0) : t(e.result())
            }
          if ((0, u.array)(t)) {
            if (0 === t.length) return void n([])
            var i = (0, a.l)(t, n)
            t.forEach((e, t) => {
              c(e, i[t])
            })
          } else c(t, n)
        }),
        (j[a.b] = (e, t, n, o) => {
          var c = o.task
          t === r.SELF_CANCELLATION
            ? A(c)
            : (0, u.array)(t)
              ? t.forEach(A)
              : A(t),
            n()
        }),
        (j[a.S] = (e, t, n) => {
          var r = t.selector,
            o = t.args
          try {
            n(r.apply(void 0, [e.getState()].concat(o)))
          } catch (e) {
            n(e, !0)
          }
        }),
        (j[a.d] = (e, t, n) => {
          var r = t.pattern,
            o = M(t.buffer),
            c = C(r),
            u = function t(n) {
              T(n) || e.channel.take(t, c), o.put(n)
            },
            a = o.close
          ;(o.close = () => {
            u.cancel(), a()
          }),
            e.channel.take(u, c),
            n(o)
        }),
        (j[a.f] = (e, t, n, r) => {
          n(r.task.isCancelled())
        }),
        (j[a.g] = (e, t, n) => {
          t.flush(n)
        }),
        (j[a.G] = (e, t, n, r) => {
          n(r.task.context[t])
        }),
        (j[a.h] = (e, t, n, r) => {
          var o = r.task
          ;(0, a.p)(o.context, t), n()
        }),
        j)
      function L(e, t) {
        return e + '?' + t
      }
      function D(e) {
        var t = e.name,
          n = e.location
        return n ? t + '  ' + L(n.fileName, n.lineNumber) : t
      }
      function q(e) {
        var t = (0, a.u)((e) => e.cancelledTasks, e)
        return t.length
          ? ['Tasks cancelled due to error:'].concat(t).join('\n')
          : ''
      }
      var B = null,
        F = [],
        I = (e) => {
          ;(e.crashedEffect = B), F.push(e)
        },
        H = () => {
          ;(B = null), (F.length = 0)
        },
        z = () => {
          var e,
            t,
            n = F[0],
            r = F.slice(1),
            o = n.crashedEffect
              ? ((e = n.crashedEffect),
                (t = (0, a.v)(e))
                  ? t.code + '  ' + L(t.fileName, t.lineNumber)
                  : '')
              : null
          return [
            'The above error occurred in task ' +
              D(n.meta) +
              (o ? ' \n when executing effect ' + o : ''),
          ]
            .concat(
              r.map((e) => '    created by ' + D(e.meta)),
              [q(F)],
            )
            .join('\n')
        }
      function W(e, t, n, o, c, u, i) {
        var s
        void 0 === i && (i = a.t)
        var l,
          d,
          p = 0,
          v = null,
          y = [],
          m = Object.create(n),
          h = ((e, t, n) => {
            var r,
              o = [],
              c = !1
            function u(e) {
              t(), s(), n(e, !0)
            }
            function i(t) {
              o.push(t),
                (t.cont = (i, s) => {
                  c ||
                    ((0, a.r)(o, t),
                    (t.cont = a.t),
                    s
                      ? u(i)
                      : (t === e && (r = i), o.length || ((c = !0), n(r))))
                })
            }
            function s() {
              c ||
                ((c = !0),
                o.forEach((e) => {
                  ;(e.cont = a.t), e.cancel()
                }),
                (o = []))
            }
            return (
              i(e), { addTask: i, cancelAll: s, abort: u, getTasks: () => o }
            )
          })(
            t,
            () => {
              y.push.apply(
                y,
                h.getTasks().map((e) => e.meta.name),
              )
            },
            g,
          )
        function g(t, n) {
          if (n) {
            if (((p = 2), I({ meta: c, cancelledTasks: y }), S.isRoot)) {
              var o = z()
              H(), e.onError(t, { sagaStack: o })
            }
            ;(d = t), v && v.reject(t)
          } else
            t === r.TASK_CANCEL ? (p = 1) : 1 !== p && (p = 3),
              (l = t),
              v && v.resolve(t)
          S.cont(t, n),
            S.joiners.forEach((e) => {
              e.cb(t, n)
            }),
            (S.joiners = null)
        }
        var S =
          (((s = {})[r.TASK] = !0),
          (s.id = o),
          (s.meta = c),
          (s.isRoot = u),
          (s.context = m),
          (s.joiners = []),
          (s.queue = h),
          (s.cancel = () => {
            0 === p && ((p = 1), h.cancelAll(), g(r.TASK_CANCEL, !1))
          }),
          (s.cont = i),
          (s.end = g),
          (s.setContext = (e) => {
            ;(0, a.p)(m, e)
          }),
          (s.toPromise = () => (
            v || ((v = f()), 2 === p ? v.reject(d) : 0 !== p && v.resolve(l)),
            v.promise
          )),
          (s.isRunning = () => 0 === p),
          (s.isCancelled = () => 1 === p || (0 === p && 1 === t.status)),
          (s.isAborted = () => 2 === p),
          (s.result = () => l),
          (s.error = () => d),
          s)
        return S
      }
      function U(e, t, n, o, c, i, s) {
        var f = e.finalizeRunEffect((t, n, o) => {
          if ((0, u.promise)(t)) R(t, o)
          else if ((0, u.iterator)(t)) U(e, t, d.context, n, c, !1, o)
          else if (t && t[r.IO]) {
            ;(0, _[t.type])(e, t.payload, o, p)
          } else o(t)
        })
        v.cancel = a.t
        var l = {
            meta: c,
            cancel: () => {
              0 === l.status && ((l.status = 1), v(r.TASK_CANCEL))
            },
            status: 0,
          },
          d = W(e, l, n, o, c, i, s),
          p = { task: d, digestEffect: y }
        return s && (s.cancel = d.cancel), v(), d
        function v(e, n) {
          try {
            var c
            n
              ? ((c = t.throw(e)), H())
              : (0, a.y)(e)
                ? ((l.status = 1),
                  v.cancel(),
                  (c = (0, u.func)(t.return)
                    ? t.return(r.TASK_CANCEL)
                    : { done: !0, value: r.TASK_CANCEL }))
                : (c = (0, a.z)(e)
                    ? (0, u.func)(t.return)
                      ? t.return()
                      : { done: !0 }
                    : t.next(e)),
              c.done
                ? (1 !== l.status && (l.status = 3), l.cont(c.value))
                : y(c.value, o, v)
          } catch (e) {
            if (1 === l.status) throw e
            ;(l.status = 2), l.cont(e, !0)
          }
        }
        function y(t, n, r, o) {
          void 0 === o && (o = '')
          var c,
            u = $()
          function i(n, o) {
            c ||
              ((c = !0),
              (r.cancel = a.t),
              e.sagaMonitor &&
                (o
                  ? e.sagaMonitor.effectRejected(u, n)
                  : e.sagaMonitor.effectResolved(u, n)),
              o &&
                ((e) => {
                  B = e
                })(t),
              r(n, o))
          }
          e.sagaMonitor &&
            e.sagaMonitor.effectTriggered({
              effectId: u,
              parentEffectId: n,
              label: o,
              effect: t,
            }),
            (i.cancel = a.t),
            (r.cancel = () => {
              c ||
                ((c = !0),
                i.cancel(),
                (i.cancel = a.t),
                e.sagaMonitor && e.sagaMonitor.effectCancelled(u))
            }),
            f(t, u, i)
        }
      }
      function V(e, t) {
        var n = e.channel,
          r = void 0 === n ? k() : n,
          o = e.dispatch,
          c = e.getState,
          u = e.context,
          s = void 0 === u ? {} : u,
          f = e.sagaMonitor,
          l = e.effectMiddlewares,
          d = e.onError,
          p = void 0 === d ? a.B : d
        for (
          var v = arguments.length, m = new Array(v > 2 ? v - 2 : 0), h = 2;
          h < v;
          h++
        )
          m[h - 2] = arguments[h]
        var g = t.apply(void 0, m)
        var S,
          b = $()
        if (
          (f &&
            ((f.rootSagaStarted = f.rootSagaStarted || a.t),
            (f.effectTriggered = f.effectTriggered || a.t),
            (f.effectResolved = f.effectResolved || a.t),
            (f.effectRejected = f.effectRejected || a.t),
            (f.effectCancelled = f.effectCancelled || a.t),
            (f.actionDispatched = f.actionDispatched || a.t),
            f.rootSagaStarted({ effectId: b, saga: t, args: m })),
          l)
        ) {
          var E = i.compose.apply(void 0, l)
          S = (e) => (t, n, r) => E((t) => e(t, n, r))(t)
        } else S = a.E
        var w = {
          channel: r,
          dispatch: (0, a.D)(o),
          getState: c,
          sagaMonitor: f,
          onError: p,
          finalizeRunEffect: S,
        }
        return y(() => {
          var e = U(w, g, s, b, (0, a.j)(t), !0, void 0)
          return f && f.effectResolved(b, e), e
        })
      }
      const K = (e) => {
          var t,
            n = void 0 === e ? {} : e,
            r = n.context,
            u = void 0 === r ? {} : r,
            i = n.channel,
            s = void 0 === i ? k() : i,
            f = n.sagaMonitor,
            l = (0, c.default)(n, ['context', 'channel', 'sagaMonitor'])
          function d(e) {
            var n = e.getState,
              r = e.dispatch
            return (
              (t = V.bind(
                null,
                (0, o.default)({}, l, {
                  context: u,
                  channel: s,
                  dispatch: r,
                  getState: n,
                  sagaMonitor: f,
                }),
              )),
              (e) => (t) => {
                f && f.actionDispatched && f.actionDispatched(t)
                var n = e(t)
                return s.put(t), n
              }
            )
          }
          return (
            (d.run = () => t.apply(void 0, arguments)),
            (d.setContext = (e) => {
              ;(0, a.p)(u, e)
            }),
            d
          )
        },
        Y = K
    },
    12415: (e, t, n) => {
      var r = n(50959)
      var o =
          'function' == typeof Object.is
            ? Object.is
            : (e, t) =>
                (e === t && (0 !== e || 1 / e == 1 / t)) || (e != e && t != t),
        c = r.useState,
        u = r.useEffect,
        a = r.useLayoutEffect,
        i = r.useDebugValue
      function s(e) {
        var t = e.getSnapshot
        e = e.value
        try {
          var n = t()
          return !o(e, n)
        } catch (e) {
          return !0
        }
      }
      var f =
        'undefined' == typeof window ||
        void 0 === window.document ||
        void 0 === window.document.createElement
          ? (e, t) => t()
          : (e, t) => {
              var n = t(),
                r = c({ inst: { value: n, getSnapshot: t } }),
                o = r[0].inst,
                f = r[1]
              return (
                a(() => {
                  ;(o.value = n), (o.getSnapshot = t), s(o) && f({ inst: o })
                }, [e, n, t]),
                u(
                  () => (
                    s(o) && f({ inst: o }),
                    e(() => {
                      s(o) && f({ inst: o })
                    })
                  ),
                  [e],
                ),
                i(n),
                n
              )
            }
      t.useSyncExternalStore =
        void 0 !== r.useSyncExternalStore ? r.useSyncExternalStore : f
    },
    102179: (e, t, n) => {
      var r = n(50959),
        o = n(104322)
      var c =
          'function' == typeof Object.is
            ? Object.is
            : (e, t) =>
                (e === t && (0 !== e || 1 / e == 1 / t)) || (e != e && t != t),
        u = o.useSyncExternalStore,
        a = r.useRef,
        i = r.useEffect,
        s = r.useMemo,
        f = r.useDebugValue
      t.useSyncExternalStoreWithSelector = (e, t, n, r, o) => {
        var l = a(null)
        if (null === l.current) {
          var d = { hasValue: !1, value: null }
          l.current = d
        } else d = l.current
        l = s(() => {
          function e(e) {
            if (!i) {
              if (((i = !0), (u = e), (e = r(e)), void 0 !== o && d.hasValue)) {
                var t = d.value
                if (o(t, e)) return (a = t)
              }
              return (a = e)
            }
            if (((t = a), c(u, e))) return t
            var n = r(e)
            return void 0 !== o && o(t, n) ? t : ((u = e), (a = n))
          }
          var u,
            a,
            i = !1,
            s = void 0 === n ? null : n
          return [() => e(t()), null === s ? void 0 : () => e(s())]
        }, [t, n, r, o])
        var p = u(e, l[0], l[1])
        return (
          i(() => {
            ;(d.hasValue = !0), (d.value = p)
          }, [p]),
          f(p),
          p
        )
      }
    },
    104322: (e, t, n) => {
      e.exports = n(12415)
    },
    107231: (e, t, n) => {
      e.exports = n(102179)
    },
    330950: (e, t, n) => {
      function r(e, t) {
        if (null == e) return {}
        var n,
          r,
          o = {},
          c = Object.keys(e)
        for (r = 0; r < c.length; r++)
          (n = c[r]), t.indexOf(n) >= 0 || (o[n] = e[n])
        return o
      }
      n.d(t, { default: () => r })
    },
  },
])
