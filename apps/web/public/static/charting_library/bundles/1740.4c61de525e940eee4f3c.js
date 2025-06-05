;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1740, 4370],
  {
    59255: (t, e, n) => {
      n.r(e), n.d(e, { default: () => I })
      var r = (() => {
          if ('undefined' != typeof Map) return Map
          function t(t, e) {
            var n = -1
            return t.some((t, r) => t[0] === e && ((n = r), !0)), n
          }
          return (() => {
            function e() {
              this.__entries__ = []
            }
            return (
              Object.defineProperty(e.prototype, 'size', {
                get: function () {
                  return this.__entries__.length
                },
                enumerable: !0,
                configurable: !0,
              }),
              (e.prototype.get = function (e) {
                var n = t(this.__entries__, e),
                  r = this.__entries__[n]
                return r && r[1]
              }),
              (e.prototype.set = function (e, n) {
                var r = t(this.__entries__, e)
                ~r
                  ? (this.__entries__[r][1] = n)
                  : this.__entries__.push([e, n])
              }),
              (e.prototype.delete = function (e) {
                var n = this.__entries__,
                  r = t(n, e)
                ~r && n.splice(r, 1)
              }),
              (e.prototype.has = function (e) {
                return !!~t(this.__entries__, e)
              }),
              (e.prototype.clear = function () {
                this.__entries__.splice(0)
              }),
              (e.prototype.forEach = function (t, e) {
                void 0 === e && (e = null)
                for (var n = 0, r = this.__entries__; n < r.length; n++) {
                  var i = r[n]
                  t.call(e, i[1], i[0])
                }
              }),
              e
            )
          })()
        })(),
        i =
          'undefined' != typeof window &&
          'undefined' != typeof document &&
          window.document === document,
        o =
          void 0 !== n.g && n.g.Math === Math
            ? n.g
            : 'undefined' != typeof self && self.Math === Math
              ? self
              : 'undefined' != typeof window && window.Math === Math
                ? window
                : Function('return this')(),
        s =
          'function' == typeof requestAnimationFrame
            ? requestAnimationFrame.bind(o)
            : (t) => setTimeout(() => t(Date.now()), 1e3 / 60)
      var a = [
          'top',
          'right',
          'bottom',
          'left',
          'width',
          'height',
          'size',
          'weight',
        ],
        c = 'undefined' != typeof MutationObserver,
        l = (() => {
          function t() {
            ;(this.connected_ = !1),
              (this.mutationEventsAdded_ = !1),
              (this.mutationsObserver_ = null),
              (this.observers_ = []),
              (this.onTransitionEnd_ = this.onTransitionEnd_.bind(this)),
              (this.refresh = ((t, e) => {
                var n = !1,
                  r = !1,
                  i = 0
                function o() {
                  n && ((n = !1), t()), r && c()
                }
                function a() {
                  s(o)
                }
                function c() {
                  var t = Date.now()
                  if (n) {
                    if (t - i < 2) return
                    r = !0
                  } else (n = !0), (r = !1), setTimeout(a, e)
                  i = t
                }
                return c
              })(this.refresh.bind(this), 20))
          }
          return (
            (t.prototype.addObserver = function (t) {
              ~this.observers_.indexOf(t) || this.observers_.push(t),
                this.connected_ || this.connect_()
            }),
            (t.prototype.removeObserver = function (t) {
              var e = this.observers_,
                n = e.indexOf(t)
              ~n && e.splice(n, 1),
                !e.length && this.connected_ && this.disconnect_()
            }),
            (t.prototype.refresh = function () {
              this.updateObservers_() && this.refresh()
            }),
            (t.prototype.updateObservers_ = function () {
              var t = this.observers_.filter(
                (t) => (t.gatherActive(), t.hasActive()),
              )
              return t.forEach((t) => t.broadcastActive()), t.length > 0
            }),
            (t.prototype.connect_ = function () {
              i &&
                !this.connected_ &&
                (document.addEventListener(
                  'transitionend',
                  this.onTransitionEnd_,
                ),
                window.addEventListener('resize', this.refresh),
                c
                  ? ((this.mutationsObserver_ = new MutationObserver(
                      this.refresh,
                    )),
                    this.mutationsObserver_.observe(document, {
                      attributes: !0,
                      childList: !0,
                      characterData: !0,
                      subtree: !0,
                    }))
                  : (document.addEventListener(
                      'DOMSubtreeModified',
                      this.refresh,
                    ),
                    (this.mutationEventsAdded_ = !0)),
                (this.connected_ = !0))
            }),
            (t.prototype.disconnect_ = function () {
              i &&
                this.connected_ &&
                (document.removeEventListener(
                  'transitionend',
                  this.onTransitionEnd_,
                ),
                window.removeEventListener('resize', this.refresh),
                this.mutationsObserver_ && this.mutationsObserver_.disconnect(),
                this.mutationEventsAdded_ &&
                  document.removeEventListener(
                    'DOMSubtreeModified',
                    this.refresh,
                  ),
                (this.mutationsObserver_ = null),
                (this.mutationEventsAdded_ = !1),
                (this.connected_ = !1))
            }),
            (t.prototype.onTransitionEnd_ = function (t) {
              var e = t.propertyName,
                n = void 0 === e ? '' : e
              a.some((t) => !!~n.indexOf(t)) && this.refresh()
            }),
            (t.getInstance = function () {
              return (
                this.instance_ || (this.instance_ = new t()), this.instance_
              )
            }),
            (t.instance_ = null),
            t
          )
        })(),
        u = (t, e) => {
          for (var n = 0, r = Object.keys(e); n < r.length; n++) {
            var i = r[n]
            Object.defineProperty(t, i, {
              value: e[i],
              enumerable: !1,
              writable: !1,
              configurable: !0,
            })
          }
          return t
        },
        f = (t) => (t && t.ownerDocument && t.ownerDocument.defaultView) || o,
        h = g(0, 0, 0, 0)
      function d(t) {
        return Number.parseFloat(t) || 0
      }
      function p(t) {
        for (var e = [], n = 1; n < arguments.length; n++)
          e[n - 1] = arguments[n]
        return e.reduce((e, n) => e + d(t['border-' + n + '-width']), 0)
      }
      function v(t) {
        var e = t.clientWidth,
          n = t.clientHeight
        if (!e && !n) return h
        var r = f(t).getComputedStyle(t),
          i = ((t) => {
            for (
              var e = {}, n = 0, r = ['top', 'right', 'bottom', 'left'];
              n < r.length;
              n++
            ) {
              var i = r[n],
                o = t['padding-' + i]
              e[i] = d(o)
            }
            return e
          })(r),
          o = i.left + i.right,
          s = i.top + i.bottom,
          a = d(r.width),
          c = d(r.height)
        if (
          ('border-box' === r.boxSizing &&
            (Math.round(a + o) !== e && (a -= p(r, 'left', 'right') + o),
            Math.round(c + s) !== n && (c -= p(r, 'top', 'bottom') + s)),
          !((t) => t === f(t).document.documentElement)(t))
        ) {
          var l = Math.round(a + o) - e,
            u = Math.round(c + s) - n
          1 !== Math.abs(l) && (a -= l), 1 !== Math.abs(u) && (c -= u)
        }
        return g(i.left, i.top, a, c)
      }
      var m =
        'undefined' != typeof SVGGraphicsElement
          ? (t) => t instanceof f(t).SVGGraphicsElement
          : (t) =>
              t instanceof f(t).SVGElement && 'function' == typeof t.getBBox
      function _(t) {
        return i
          ? m(t)
            ? ((t) => {
                var e = t.getBBox()
                return g(0, 0, e.width, e.height)
              })(t)
            : v(t)
          : h
      }
      function g(t, e, n, r) {
        return { x: t, y: e, width: n, height: r }
      }
      var b = (() => {
          function t(t) {
            ;(this.broadcastWidth = 0),
              (this.broadcastHeight = 0),
              (this.contentRect_ = g(0, 0, 0, 0)),
              (this.target = t)
          }
          return (
            (t.prototype.isActive = function () {
              var t = _(this.target)
              return (
                (this.contentRect_ = t),
                t.width !== this.broadcastWidth ||
                  t.height !== this.broadcastHeight
              )
            }),
            (t.prototype.broadcastRect = function () {
              var t = this.contentRect_
              return (
                (this.broadcastWidth = t.width),
                (this.broadcastHeight = t.height),
                t
              )
            }),
            t
          )
        })(),
        y = function (t, e) {
          var n,
            r,
            i,
            o,
            s,
            a,
            c,
            l =
              ((r = (n = e).x),
              (i = n.y),
              (o = n.width),
              (s = n.height),
              (a =
                'undefined' != typeof DOMRectReadOnly
                  ? DOMRectReadOnly
                  : Object),
              (c = Object.create(a.prototype)),
              u(c, {
                x: r,
                y: i,
                width: o,
                height: s,
                top: i,
                right: r + o,
                bottom: s + i,
                left: r,
              }),
              c)
          u(this, { target: t, contentRect: l })
        },
        S = (() => {
          function t(t, e, n) {
            if (
              ((this.activeObservations_ = []),
              (this.observations_ = new r()),
              'function' != typeof t)
            )
              throw new TypeError(
                'The callback provided as parameter 1 is not a function.',
              )
            ;(this.callback_ = t),
              (this.controller_ = e),
              (this.callbackCtx_ = n)
          }
          return (
            (t.prototype.observe = function (t) {
              if (!arguments.length)
                throw new TypeError('1 argument required, but only 0 present.')
              if ('undefined' != typeof Element && Element instanceof Object) {
                if (!(t instanceof f(t).Element))
                  throw new TypeError('parameter 1 is not of type "Element".')
                var e = this.observations_
                e.has(t) ||
                  (e.set(t, new b(t)),
                  this.controller_.addObserver(this),
                  this.controller_.refresh())
              }
            }),
            (t.prototype.unobserve = function (t) {
              if (!arguments.length)
                throw new TypeError('1 argument required, but only 0 present.')
              if ('undefined' != typeof Element && Element instanceof Object) {
                if (!(t instanceof f(t).Element))
                  throw new TypeError('parameter 1 is not of type "Element".')
                var e = this.observations_
                e.has(t) &&
                  (e.delete(t), e.size || this.controller_.removeObserver(this))
              }
            }),
            (t.prototype.disconnect = function () {
              this.clearActive(),
                this.observations_.clear(),
                this.controller_.removeObserver(this)
            }),
            (t.prototype.gatherActive = function () {
              this.clearActive(),
                this.observations_.forEach((e) => {
                  e.isActive() && this.activeObservations_.push(e)
                })
            }),
            (t.prototype.broadcastActive = function () {
              if (this.hasActive()) {
                var t = this.callbackCtx_,
                  e = this.activeObservations_.map(
                    (t) => new y(t.target, t.broadcastRect()),
                  )
                this.callback_.call(t, e, t), this.clearActive()
              }
            }),
            (t.prototype.clearActive = function () {
              this.activeObservations_.splice(0)
            }),
            (t.prototype.hasActive = function () {
              return this.activeObservations_.length > 0
            }),
            t
          )
        })(),
        w = 'undefined' != typeof WeakMap ? new WeakMap() : new r(),
        O = function t(e) {
          if (!(this instanceof t))
            throw new TypeError('Cannot call a class as a function.')
          if (!arguments.length)
            throw new TypeError('1 argument required, but only 0 present.')
          var n = l.getInstance(),
            r = new S(e, n, this)
          w.set(this, r)
        }
      ;['observe', 'unobserve', 'disconnect'].forEach((t) => {
        O.prototype[t] = function () {
          var e
          return (e = w.get(this))[t].apply(e, arguments)
        }
      })
      const I = void 0 !== o.ResizeObserver ? o.ResizeObserver : O
    },
    20037: (t, e, n) => {
      function r() {
        return (
          (r =
            Object.assign ||
            ((t) => {
              for (var e = 1; e < arguments.length; e++) {
                var n = arguments[e]
                for (var r in n) Object.hasOwn(n, r) && (t[r] = n[r])
              }
              return t
            })),
          r.apply(this, arguments)
        )
      }
      function i(t, e) {
        return (
          (i = Object.setPrototypeOf || ((t, e) => ((t.__proto__ = e), t))),
          i(t, e)
        )
      }
      function o(t, e) {
        ;(t.prototype = Object.create(e.prototype)),
          (t.prototype.constructor = t),
          i(t, e)
      }
      function s(t) {
        if (void 0 === t)
          throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called",
          )
        return t
      }
      n.d(e, { FixedSizeList: () => I, VariableSizeList: () => O })
      var a = Number.isNaN || ((t) => 'number' == typeof t && t != t)
      function c(t, e) {
        if (t.length !== e.length) return !1
        for (var n = 0; n < t.length; n++)
          if (((r = t[n]), (i = e[n]), !(r === i || (a(r) && a(i))))) return !1
        var r, i
        return !0
      }
      const l = (t, e) => {
        var n
        void 0 === e && (e = c)
        var r,
          i = [],
          o = !1
        return function () {
          for (var s = [], a = 0; a < arguments.length; a++) s[a] = arguments[a]
          return (
            (o && n === this && e(s, i)) ||
              ((r = t.apply(this, s)), (o = !0), (n = this), (i = s)),
            r
          )
        }
      }
      var u = n(50959),
        f =
          'object' == typeof performance && 'function' == typeof performance.now
            ? () => performance.now()
            : () => Date.now()
      function h(t) {
        cancelAnimationFrame(t.id)
      }
      function d(t, e) {
        var n = f()
        var r = {
          id: requestAnimationFrame(function i() {
            f() - n >= e ? t.call(null) : (r.id = requestAnimationFrame(i))
          }),
        }
        return r
      }
      var p = null
      function v(t) {
        if ((void 0 === t && (t = !1), null === p || t)) {
          var e = document.createElement('div'),
            n = e.style
          ;(n.width = '50px'),
            (n.height = '50px'),
            (n.overflow = 'scroll'),
            (n.direction = 'rtl')
          var r = document.createElement('div'),
            i = r.style
          return (
            (i.width = '100px'),
            (i.height = '100px'),
            e.appendChild(r),
            document.body.appendChild(e),
            e.scrollLeft > 0
              ? (p = 'positive-descending')
              : ((e.scrollLeft = 1),
                (p = 0 === e.scrollLeft ? 'negative' : 'positive-ascending')),
            document.body.removeChild(e),
            p
          )
        }
        return p
      }
      var m = (t, e) => t
      function _(t) {
        var e,
          n,
          i = t.getItemOffset,
          a = t.getEstimatedTotalSize,
          c = t.getItemSize,
          f = t.getOffsetForIndexAndAlignment,
          p = t.getStartIndexForOffset,
          _ = t.getStopIndexForStartIndex,
          b = t.initInstanceProps,
          y = t.shouldResetStyleCacheOnItemSizeChange,
          S = t.validateProps
        return (
          (n = e =
            ((t) => {
              function e(e) {
                var n
                return (
                  ((n = t.call(this, e) || this)._instanceProps = b(
                    n.props,
                    s(s(n)),
                  )),
                  (n._outerRef = void 0),
                  (n._resetIsScrollingTimeoutId = null),
                  (n.state = {
                    instance: s(s(n)),
                    isScrolling: !1,
                    scrollDirection: 'forward',
                    scrollOffset:
                      'number' == typeof n.props.initialScrollOffset
                        ? n.props.initialScrollOffset
                        : 0,
                    scrollUpdateWasRequested: !1,
                  }),
                  (n._callOnItemsRendered = void 0),
                  (n._callOnItemsRendered = l((t, e, r, i) =>
                    n.props.onItemsRendered({
                      overscanStartIndex: t,
                      overscanStopIndex: e,
                      visibleStartIndex: r,
                      visibleStopIndex: i,
                    }),
                  )),
                  (n._callOnScroll = void 0),
                  (n._callOnScroll = l((t, e, r) =>
                    n.props.onScroll({
                      scrollDirection: t,
                      scrollOffset: e,
                      scrollUpdateWasRequested: r,
                    }),
                  )),
                  (n._getItemStyle = void 0),
                  (n._getItemStyle = (t) => {
                    var e,
                      r = n.props,
                      o = r.direction,
                      s = r.itemSize,
                      a = r.layout,
                      l = n._getItemStyleCache(y && s, y && a, y && o)
                    if (Object.hasOwn(l, t)) e = l[t]
                    else {
                      var u = i(n.props, t, n._instanceProps),
                        f = c(n.props, t, n._instanceProps),
                        h = 'horizontal' === o || 'horizontal' === a,
                        d = 'rtl' === o,
                        p = h ? u : 0
                      l[t] = e = {
                        position: 'absolute',
                        left: d ? void 0 : p,
                        right: d ? p : void 0,
                        top: h ? 0 : u,
                        height: h ? '100%' : f,
                        width: h ? f : '100%',
                      }
                    }
                    return e
                  }),
                  (n._getItemStyleCache = void 0),
                  (n._getItemStyleCache = l((t, e, n) => ({}))),
                  (n._onScrollHorizontal = (t) => {
                    var e = t.currentTarget,
                      r = e.clientWidth,
                      i = e.scrollLeft,
                      o = e.scrollWidth
                    n.setState((t) => {
                      if (t.scrollOffset === i) return null
                      var e = n.props.direction,
                        s = i
                      if ('rtl' === e)
                        switch (v()) {
                          case 'negative':
                            s = -i
                            break
                          case 'positive-descending':
                            s = o - r - i
                        }
                      return (
                        (s = Math.max(0, Math.min(s, o - r))),
                        {
                          isScrolling: !0,
                          scrollDirection:
                            t.scrollOffset < i ? 'forward' : 'backward',
                          scrollOffset: s,
                          scrollUpdateWasRequested: !1,
                        }
                      )
                    }, n._resetIsScrollingDebounced)
                  }),
                  (n._onScrollVertical = (t) => {
                    var e = t.currentTarget,
                      r = e.clientHeight,
                      i = e.scrollHeight,
                      o = e.scrollTop
                    n.setState((t) => {
                      if (t.scrollOffset === o) return null
                      var e = Math.max(0, Math.min(o, i - r))
                      return {
                        isScrolling: !0,
                        scrollDirection:
                          t.scrollOffset < e ? 'forward' : 'backward',
                        scrollOffset: e,
                        scrollUpdateWasRequested: !1,
                      }
                    }, n._resetIsScrollingDebounced)
                  }),
                  (n._outerRefSetter = (t) => {
                    var e = n.props.outerRef
                    ;(n._outerRef = t),
                      'function' == typeof e
                        ? e(t)
                        : null != e &&
                          'object' == typeof e &&
                          Object.hasOwn(e, 'current') &&
                          (e.current = t)
                  }),
                  (n._resetIsScrollingDebounced = () => {
                    null !== n._resetIsScrollingTimeoutId &&
                      h(n._resetIsScrollingTimeoutId),
                      (n._resetIsScrollingTimeoutId = d(
                        n._resetIsScrolling,
                        150,
                      ))
                  }),
                  (n._resetIsScrolling = () => {
                    ;(n._resetIsScrollingTimeoutId = null),
                      n.setState({ isScrolling: !1 }, () => {
                        n._getItemStyleCache(-1, null)
                      })
                  }),
                  n
                )
              }
              o(e, t),
                (e.getDerivedStateFromProps = (t, e) => (g(t, e), S(t), null))
              var n = e.prototype
              return (
                (n.scrollTo = function (t) {
                  ;(t = Math.max(0, t)),
                    this.setState(
                      (e) =>
                        e.scrollOffset === t
                          ? null
                          : {
                              scrollDirection:
                                e.scrollOffset < t ? 'forward' : 'backward',
                              scrollOffset: t,
                              scrollUpdateWasRequested: !0,
                            },
                      this._resetIsScrollingDebounced,
                    )
                }),
                (n.scrollToItem = function (t, e) {
                  void 0 === e && (e = 'auto')
                  var n = this.props.itemCount,
                    r = this.state.scrollOffset
                  ;(t = Math.max(0, Math.min(t, n - 1))),
                    this.scrollTo(f(this.props, t, e, r, this._instanceProps))
                }),
                (n.componentDidMount = function () {
                  var t = this.props,
                    e = t.direction,
                    n = t.initialScrollOffset,
                    r = t.layout
                  if ('number' == typeof n && null != this._outerRef) {
                    var i = this._outerRef
                    'horizontal' === e || 'horizontal' === r
                      ? (i.scrollLeft = n)
                      : (i.scrollTop = n)
                  }
                  this._callPropsCallbacks()
                }),
                (n.componentDidUpdate = function () {
                  var t = this.props,
                    e = t.direction,
                    n = t.layout,
                    r = this.state,
                    i = r.scrollOffset
                  if (r.scrollUpdateWasRequested && null != this._outerRef) {
                    var o = this._outerRef
                    if ('horizontal' === e || 'horizontal' === n)
                      if ('rtl' === e)
                        switch (v()) {
                          case 'negative':
                            o.scrollLeft = -i
                            break
                          case 'positive-ascending':
                            o.scrollLeft = i
                            break
                          default:
                            var s = o.clientWidth,
                              a = o.scrollWidth
                            o.scrollLeft = a - s - i
                        }
                      else o.scrollLeft = i
                    else o.scrollTop = i
                  }
                  this._callPropsCallbacks()
                }),
                (n.componentWillUnmount = function () {
                  null !== this._resetIsScrollingTimeoutId &&
                    h(this._resetIsScrollingTimeoutId)
                }),
                (n.render = function () {
                  var t = this.props,
                    e = t.children,
                    n = t.className,
                    i = t.direction,
                    o = t.height,
                    s = t.innerRef,
                    c = t.innerElementType,
                    l = t.innerTagName,
                    f = t.itemCount,
                    h = t.itemData,
                    d = t.itemKey,
                    p = void 0 === d ? m : d,
                    v = t.layout,
                    _ = t.outerElementType,
                    g = t.outerTagName,
                    b = t.style,
                    y = t.useIsScrolling,
                    S = t.width,
                    w = this.state.isScrolling,
                    O = 'horizontal' === i || 'horizontal' === v,
                    I = O ? this._onScrollHorizontal : this._onScrollVertical,
                    M = this._getRangeToRender(),
                    x = M[0],
                    z = M[1],
                    E = []
                  if (f > 0)
                    for (var R = x; R <= z; R++)
                      E.push(
                        (0, u.createElement)(e, {
                          data: h,
                          key: p(R, h),
                          index: R,
                          isScrolling: y ? w : void 0,
                          style: this._getItemStyle(R),
                        }),
                      )
                  var T = a(this.props, this._instanceProps)
                  return (0, u.createElement)(
                    _ || g || 'div',
                    {
                      className: n,
                      onScroll: I,
                      ref: this._outerRefSetter,
                      style: r(
                        {
                          position: 'relative',
                          height: o,
                          width: S,
                          overflow: 'auto',
                          WebkitOverflowScrolling: 'touch',
                          willChange: 'transform',
                          direction: i,
                        },
                        b,
                      ),
                    },
                    (0, u.createElement)(c || l || 'div', {
                      children: E,
                      ref: s,
                      style: {
                        height: O ? '100%' : T,
                        pointerEvents: w ? 'none' : void 0,
                        width: O ? T : '100%',
                      },
                    }),
                  )
                }),
                (n._callPropsCallbacks = function () {
                  if (
                    'function' == typeof this.props.onItemsRendered &&
                    this.props.itemCount > 0
                  ) {
                    var t = this._getRangeToRender(),
                      e = t[0],
                      n = t[1],
                      r = t[2],
                      i = t[3]
                    this._callOnItemsRendered(e, n, r, i)
                  }
                  if ('function' == typeof this.props.onScroll) {
                    var o = this.state,
                      s = o.scrollDirection,
                      a = o.scrollOffset,
                      c = o.scrollUpdateWasRequested
                    this._callOnScroll(s, a, c)
                  }
                }),
                (n._getRangeToRender = function () {
                  var t = this.props,
                    e = t.itemCount,
                    n = t.overscanCount,
                    r = this.state,
                    i = r.isScrolling,
                    o = r.scrollDirection,
                    s = r.scrollOffset
                  if (0 === e) return [0, 0, 0, 0]
                  var a = p(this.props, s, this._instanceProps),
                    c = _(this.props, a, s, this._instanceProps),
                    l = i && 'backward' !== o ? 1 : Math.max(1, n),
                    u = i && 'forward' !== o ? 1 : Math.max(1, n)
                  return [
                    Math.max(0, a - l),
                    Math.max(0, Math.min(e - 1, c + u)),
                    a,
                    c,
                  ]
                }),
                e
              )
            })(u.PureComponent)),
          (e.defaultProps = {
            direction: 'ltr',
            itemData: void 0,
            layout: 'vertical',
            overscanCount: 2,
            useIsScrolling: !1,
          }),
          n
        )
      }
      var g = (t, e) => {
          t.children,
            t.direction,
            t.height,
            t.layout,
            t.innerTagName,
            t.outerTagName,
            t.width,
            e.instance
        },
        b = (t, e, n) => {
          var r = t.itemSize,
            i = n.itemMetadataMap,
            o = n.lastMeasuredIndex
          if (e > o) {
            var s = 0
            if (o >= 0) {
              var a = i[o]
              s = a.offset + a.size
            }
            for (var c = o + 1; c <= e; c++) {
              var l = r(c)
              ;(i[c] = { offset: s, size: l }), (s += l)
            }
            n.lastMeasuredIndex = e
          }
          return i[e]
        },
        y = (t, e, n, r, i) => {
          while (r <= n) {
            var o = r + Math.floor((n - r) / 2),
              s = b(t, o, e).offset
            if (s === i) return o
            s < i ? (r = o + 1) : s > i && (n = o - 1)
          }
          return r > 0 ? r - 1 : 0
        },
        S = (t, e, n, r) => {
          for (var i = t.itemCount, o = 1; n < i && b(t, n, e).offset < r; )
            (n += o), (o *= 2)
          return y(t, e, Math.min(n, i - 1), Math.floor(n / 2), r)
        },
        w = (t, e) => {
          var n = t.itemCount,
            r = e.itemMetadataMap,
            i = e.estimatedItemSize,
            o = e.lastMeasuredIndex,
            s = 0
          if ((o >= n && (o = n - 1), o >= 0)) {
            var a = r[o]
            s = a.offset + a.size
          }
          return s + (n - o - 1) * i
        },
        O = _({
          getItemOffset: (t, e, n) => b(t, e, n).offset,
          getItemSize: (t, e, n) => n.itemMetadataMap[e].size,
          getEstimatedTotalSize: w,
          getOffsetForIndexAndAlignment: (t, e, n, r, i) => {
            var o = t.direction,
              s = t.height,
              a = t.layout,
              c = t.width,
              l = 'horizontal' === o || 'horizontal' === a ? c : s,
              u = b(t, e, i),
              f = w(t, i),
              h = Math.max(0, Math.min(f - l, u.offset)),
              d = Math.max(0, u.offset - l + u.size)
            switch (
              ('smart' === n &&
                (n = r >= d - l && r <= h + l ? 'auto' : 'center'),
              n)
            ) {
              case 'start':
                return h
              case 'end':
                return d
              case 'center':
                return Math.round(d + (h - d) / 2)
              default:
                return r >= d && r <= h ? r : r < d ? d : h
            }
          },
          getStartIndexForOffset: (t, e, n) =>
            ((t, e, n) => {
              var r = e.itemMetadataMap,
                i = e.lastMeasuredIndex
              return (i > 0 ? r[i].offset : 0) >= n
                ? y(t, e, i, 0, n)
                : S(t, e, Math.max(0, i), n)
            })(t, n, e),
          getStopIndexForStartIndex: (t, e, n, r) => {
            for (
              var i = t.direction,
                o = t.height,
                s = t.itemCount,
                a = t.layout,
                c = t.width,
                l = 'horizontal' === i || 'horizontal' === a ? c : o,
                u = b(t, e, r),
                f = n + l,
                h = u.offset + u.size,
                d = e;
              d < s - 1 && h < f;
            )
              d++, (h += b(t, d, r).size)
            return d
          },
          initInstanceProps: (t, e) => {
            var n = {
              itemMetadataMap: {},
              estimatedItemSize: t.estimatedItemSize || 50,
              lastMeasuredIndex: -1,
            }
            return (
              (e.resetAfterIndex = (t, r) => {
                void 0 === r && (r = !0),
                  (n.lastMeasuredIndex = Math.min(n.lastMeasuredIndex, t - 1)),
                  e._getItemStyleCache(-1),
                  r && e.forceUpdate()
              }),
              n
            )
          },
          shouldResetStyleCacheOnItemSizeChange: !1,
          validateProps: (t) => {
            t.itemSize
          },
        }),
        I = _({
          getItemOffset: (t, e) => e * t.itemSize,
          getItemSize: (t, e) => t.itemSize,
          getEstimatedTotalSize: (t) => {
            var e = t.itemCount
            return t.itemSize * e
          },
          getOffsetForIndexAndAlignment: (t, e, n, r) => {
            var i = t.direction,
              o = t.height,
              s = t.itemCount,
              a = t.itemSize,
              c = t.layout,
              l = t.width,
              u = 'horizontal' === i || 'horizontal' === c ? l : o,
              f = Math.max(0, s * a - u),
              h = Math.min(f, e * a),
              d = Math.max(0, e * a - u + a)
            switch (
              ('smart' === n &&
                (n = r >= d - u && r <= h + u ? 'auto' : 'center'),
              n)
            ) {
              case 'start':
                return h
              case 'end':
                return d
              case 'center':
                var p = Math.round(d + (h - d) / 2)
                return p < Math.ceil(u / 2)
                  ? 0
                  : p > f + Math.floor(u / 2)
                    ? f
                    : p
              default:
                return r >= d && r <= h ? r : r < d ? d : h
            }
          },
          getStartIndexForOffset: (t, e) => {
            var n = t.itemCount,
              r = t.itemSize
            return Math.max(0, Math.min(n - 1, Math.floor(e / r)))
          },
          getStopIndexForStartIndex: (t, e, n) => {
            var r = t.direction,
              i = t.height,
              o = t.itemCount,
              s = t.itemSize,
              a = t.layout,
              c = t.width,
              l = e * s,
              u = 'horizontal' === r || 'horizontal' === a ? c : i,
              f = Math.ceil((u + n - l) / s)
            return Math.max(0, Math.min(o - 1, e + f - 1))
          },
          initInstanceProps: (t) => {},
          shouldResetStyleCacheOnItemSizeChange: !0,
          validateProps: (t) => {
            t.itemSize
          },
        })
    },
    25931: (t, e, n) => {
      n.d(e, { nanoid: () => r })
      const r = (t = 21) =>
        crypto
          .getRandomValues(new Uint8Array(t))
          .reduce(
            (t, e) =>
              (t +=
                (e &= 63) < 36
                  ? e.toString(36)
                  : e < 62
                    ? (e - 26).toString(36).toUpperCase()
                    : e > 62
                      ? '-'
                      : '_'),
            '',
          )
    },
  },
])
