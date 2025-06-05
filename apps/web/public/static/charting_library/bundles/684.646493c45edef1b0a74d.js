;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [684, 9255],
  {
    159255: (t, e, n) => {
      n.r(e), n.d(e, { default: () => T })
      var o = (() => {
          if ('undefined' != typeof Map) return Map
          function t(t, e) {
            var n = -1
            return t.some((t, o) => t[0] === e && ((n = o), !0)), n
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
                  o = this.__entries__[n]
                return o && o[1]
              }),
              (e.prototype.set = function (e, n) {
                var o = t(this.__entries__, e)
                ~o
                  ? (this.__entries__[o][1] = n)
                  : this.__entries__.push([e, n])
              }),
              (e.prototype.delete = function (e) {
                var n = this.__entries__,
                  o = t(n, e)
                ~o && n.splice(o, 1)
              }),
              (e.prototype.has = function (e) {
                return !!~t(this.__entries__, e)
              }),
              (e.prototype.clear = function () {
                this.__entries__.splice(0)
              }),
              (e.prototype.forEach = function (t, e) {
                void 0 === e && (e = null)
                for (var n = 0, o = this.__entries__; n < o.length; n++) {
                  var i = o[n]
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
        r =
          void 0 !== n.g && n.g.Math === Math
            ? n.g
            : 'undefined' != typeof self && self.Math === Math
              ? self
              : 'undefined' != typeof window && window.Math === Math
                ? window
                : Function('return this')(),
        s =
          'function' == typeof requestAnimationFrame
            ? requestAnimationFrame.bind(r)
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
        h = 'undefined' != typeof MutationObserver,
        u = (() => {
          function t() {
            ;(this.connected_ = !1),
              (this.mutationEventsAdded_ = !1),
              (this.mutationsObserver_ = null),
              (this.observers_ = []),
              (this.onTransitionEnd_ = this.onTransitionEnd_.bind(this)),
              (this.refresh = ((t, e) => {
                var n = !1,
                  o = !1,
                  i = 0
                function r() {
                  n && ((n = !1), t()), o && h()
                }
                function a() {
                  s(r)
                }
                function h() {
                  var t = Date.now()
                  if (n) {
                    if (t - i < 2) return
                    o = !0
                  } else (n = !0), (o = !1), setTimeout(a, e)
                  i = t
                }
                return h
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
                h
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
        c = (t, e) => {
          for (var n = 0, o = Object.keys(e); n < o.length; n++) {
            var i = o[n]
            Object.defineProperty(t, i, {
              value: e[i],
              enumerable: !1,
              writable: !1,
              configurable: !0,
            })
          }
          return t
        },
        d = (t) => (t && t.ownerDocument && t.ownerDocument.defaultView) || r,
        l = b(0, 0, 0, 0)
      function v(t) {
        return Number.parseFloat(t) || 0
      }
      function f(t) {
        for (var e = [], n = 1; n < arguments.length; n++)
          e[n - 1] = arguments[n]
        return e.reduce((e, n) => e + v(t['border-' + n + '-width']), 0)
      }
      function p(t) {
        var e = t.clientWidth,
          n = t.clientHeight
        if (!e && !n) return l
        var o = d(t).getComputedStyle(t),
          i = ((t) => {
            for (
              var e = {}, n = 0, o = ['top', 'right', 'bottom', 'left'];
              n < o.length;
              n++
            ) {
              var i = o[n],
                r = t['padding-' + i]
              e[i] = v(r)
            }
            return e
          })(o),
          r = i.left + i.right,
          s = i.top + i.bottom,
          a = v(o.width),
          h = v(o.height)
        if (
          ('border-box' === o.boxSizing &&
            (Math.round(a + r) !== e && (a -= f(o, 'left', 'right') + r),
            Math.round(h + s) !== n && (h -= f(o, 'top', 'bottom') + s)),
          !((t) => t === d(t).document.documentElement)(t))
        ) {
          var u = Math.round(a + r) - e,
            c = Math.round(h + s) - n
          1 !== Math.abs(u) && (a -= u), 1 !== Math.abs(c) && (h -= c)
        }
        return b(i.left, i.top, a, h)
      }
      var g =
        'undefined' != typeof SVGGraphicsElement
          ? (t) => t instanceof d(t).SVGGraphicsElement
          : (t) =>
              t instanceof d(t).SVGElement && 'function' == typeof t.getBBox
      function m(t) {
        return i
          ? g(t)
            ? ((t) => {
                var e = t.getBBox()
                return b(0, 0, e.width, e.height)
              })(t)
            : p(t)
          : l
      }
      function b(t, e, n, o) {
        return { x: t, y: e, width: n, height: o }
      }
      var y = (() => {
          function t(t) {
            ;(this.broadcastWidth = 0),
              (this.broadcastHeight = 0),
              (this.contentRect_ = b(0, 0, 0, 0)),
              (this.target = t)
          }
          return (
            (t.prototype.isActive = function () {
              var t = m(this.target)
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
        _ = function (t, e) {
          var n,
            o,
            i,
            r,
            s,
            a,
            h,
            u =
              ((o = (n = e).x),
              (i = n.y),
              (r = n.width),
              (s = n.height),
              (a =
                'undefined' != typeof DOMRectReadOnly
                  ? DOMRectReadOnly
                  : Object),
              (h = Object.create(a.prototype)),
              c(h, {
                x: o,
                y: i,
                width: r,
                height: s,
                top: i,
                right: o + r,
                bottom: s + i,
                left: o,
              }),
              h)
          c(this, { target: t, contentRect: u })
        },
        w = (() => {
          function t(t, e, n) {
            if (
              ((this.activeObservations_ = []),
              (this.observations_ = new o()),
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
                if (!(t instanceof d(t).Element))
                  throw new TypeError('parameter 1 is not of type "Element".')
                var e = this.observations_
                e.has(t) ||
                  (e.set(t, new y(t)),
                  this.controller_.addObserver(this),
                  this.controller_.refresh())
              }
            }),
            (t.prototype.unobserve = function (t) {
              if (!arguments.length)
                throw new TypeError('1 argument required, but only 0 present.')
              if ('undefined' != typeof Element && Element instanceof Object) {
                if (!(t instanceof d(t).Element))
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
                    (t) => new _(t.target, t.broadcastRect()),
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
        E = 'undefined' != typeof WeakMap ? new WeakMap() : new o(),
        O = function t(e) {
          if (!(this instanceof t))
            throw new TypeError('Cannot call a class as a function.')
          if (!arguments.length)
            throw new TypeError('1 argument required, but only 0 present.')
          var n = u.getInstance(),
            o = new w(e, n, this)
          E.set(this, o)
        }
      ;['observe', 'unobserve', 'disconnect'].forEach((t) => {
        O.prototype[t] = function () {
          var e
          return (e = E.get(this))[t].apply(e, arguments)
        }
      })
      const T = void 0 !== r.ResizeObserver ? r.ResizeObserver : O
    },
    174786: (t, e, n) => {
      n.d(e, { default: () => o })
      const o = () => {}
    },
    207809: (t, e, n) => {
      n.d(e, { TouchBackend: () => f })
      var o,
        i = n(6346)
      !((t) => {
        ;(t.mouse = 'mouse'), (t.touch = 'touch'), (t.keyboard = 'keyboard')
      })(o || (o = {}))
      class r {
        get delay() {
          var t
          return null !== (t = this.args.delay) && void 0 !== t ? t : 0
        }
        get scrollAngleRanges() {
          return this.args.scrollAngleRanges
        }
        get getDropTargetElementsAtPoint() {
          return this.args.getDropTargetElementsAtPoint
        }
        get ignoreContextMenu() {
          var t
          return null !== (t = this.args.ignoreContextMenu) && void 0 !== t && t
        }
        get enableHoverOutsideTarget() {
          var t
          return (
            null !== (t = this.args.enableHoverOutsideTarget) &&
            void 0 !== t &&
            t
          )
        }
        get enableKeyboardEvents() {
          var t
          return (
            null !== (t = this.args.enableKeyboardEvents) && void 0 !== t && t
          )
        }
        get enableMouseEvents() {
          var t
          return null !== (t = this.args.enableMouseEvents) && void 0 !== t && t
        }
        get enableTouchEvents() {
          var t
          return null === (t = this.args.enableTouchEvents) || void 0 === t || t
        }
        get touchSlop() {
          return this.args.touchSlop || 0
        }
        get delayTouchStart() {
          var t, e, n, o
          return null !==
            (o =
              null !==
                (n =
                  null === (t = this.args) || void 0 === t
                    ? void 0
                    : t.delayTouchStart) && void 0 !== n
                ? n
                : null === (e = this.args) || void 0 === e
                  ? void 0
                  : e.delay) && void 0 !== o
            ? o
            : 0
        }
        get delayMouseStart() {
          var t, e, n, o
          return null !==
            (o =
              null !==
                (n =
                  null === (t = this.args) || void 0 === t
                    ? void 0
                    : t.delayMouseStart) && void 0 !== n
                ? n
                : null === (e = this.args) || void 0 === e
                  ? void 0
                  : e.delay) && void 0 !== o
            ? o
            : 0
        }
        get window() {
          return this.context && this.context.window
            ? this.context.window
            : 'undefined' != typeof window
              ? window
              : void 0
        }
        get document() {
          var t
          return (
            null === (t = this.context) || void 0 === t
              ? void 0
              : t.document
          )
            ? this.context.document
            : this.window
              ? this.window.document
              : void 0
        }
        get rootElement() {
          var t
          return (
            (null === (t = this.args) || void 0 === t
              ? void 0
              : t.rootElement) || this.document
          )
        }
        constructor(t, e) {
          ;(this.args = t), (this.context = e)
        }
      }
      const s = 1,
        a = 0
      function h(t) {
        return void 0 === t.button || t.button === a
      }
      function u(t) {
        return !!t.targetTouches
      }
      function c(t, e) {
        return u(t)
          ? ((t, e) =>
              1 === t.targetTouches.length
                ? c(t.targetTouches[0])
                : e &&
                    1 === t.touches.length &&
                    t.touches[0].target === e.target
                  ? c(t.touches[0])
                  : void 0)(t, e)
          : { x: t.clientX, y: t.clientY }
      }
      const d = (() => {
          let t = !1
          try {
            addEventListener(
              'test',
              () => {},
              Object.defineProperty({}, 'passive', {
                get: () => ((t = !0), !0),
              }),
            )
          } catch (t) {}
          return t
        })(),
        l = {
          [o.mouse]: {
            start: 'mousedown',
            move: 'mousemove',
            end: 'mouseup',
            contextmenu: 'contextmenu',
          },
          [o.touch]: {
            start: 'touchstart',
            move: 'touchmove',
            end: 'touchend',
          },
          [o.keyboard]: { keydown: 'keydown' },
        }
      class v {
        profile() {
          var t
          return {
            sourceNodes: this.sourceNodes.size,
            sourcePreviewNodes: this.sourcePreviewNodes.size,
            sourcePreviewNodeOptions: this.sourcePreviewNodeOptions.size,
            targetNodes: this.targetNodes.size,
            dragOverTargetIds:
              (null === (t = this.dragOverTargetIds) || void 0 === t
                ? void 0
                : t.length) || 0,
          }
        }
        get document() {
          return this.options.document
        }
        setup() {
          const t = this.options.rootElement
          t &&
            ((0, i.invariant)(
              !v.isSetUp,
              'Cannot have two Touch backends at the same time.',
            ),
            (v.isSetUp = !0),
            this.addEventListener(t, 'start', this.getTopMoveStartHandler()),
            this.addEventListener(
              t,
              'start',
              this.handleTopMoveStartCapture,
              !0,
            ),
            this.addEventListener(t, 'move', this.handleTopMove),
            this.addEventListener(t, 'move', this.handleTopMoveCapture, !0),
            this.addEventListener(t, 'end', this.handleTopMoveEndCapture, !0),
            this.options.enableMouseEvents &&
              !this.options.ignoreContextMenu &&
              this.addEventListener(
                t,
                'contextmenu',
                this.handleTopMoveEndCapture,
              ),
            this.options.enableKeyboardEvents &&
              this.addEventListener(
                t,
                'keydown',
                this.handleCancelOnEscape,
                !0,
              ))
        }
        teardown() {
          const t = this.options.rootElement
          t &&
            ((v.isSetUp = !1),
            (this._mouseClientOffset = {}),
            this.removeEventListener(
              t,
              'start',
              this.handleTopMoveStartCapture,
              !0,
            ),
            this.removeEventListener(t, 'start', this.handleTopMoveStart),
            this.removeEventListener(t, 'move', this.handleTopMoveCapture, !0),
            this.removeEventListener(t, 'move', this.handleTopMove),
            this.removeEventListener(
              t,
              'end',
              this.handleTopMoveEndCapture,
              !0,
            ),
            this.options.enableMouseEvents &&
              !this.options.ignoreContextMenu &&
              this.removeEventListener(
                t,
                'contextmenu',
                this.handleTopMoveEndCapture,
              ),
            this.options.enableKeyboardEvents &&
              this.removeEventListener(
                t,
                'keydown',
                this.handleCancelOnEscape,
                !0,
              ),
            this.uninstallSourceNodeRemovalObserver())
        }
        addEventListener(t, e, n, o = !1) {
          const i = d ? { capture: o, passive: !1 } : o
          this.listenerTypes.forEach((o) => {
            const r = l[o][e]
            r && t.addEventListener(r, n, i)
          })
        }
        removeEventListener(t, e, n, o = !1) {
          const i = d ? { capture: o, passive: !1 } : o
          this.listenerTypes.forEach((o) => {
            const r = l[o][e]
            r && t.removeEventListener(r, n, i)
          })
        }
        connectDragSource(t, e) {
          const n = this.handleMoveStart.bind(this, t)
          return (
            this.sourceNodes.set(t, e),
            this.addEventListener(e, 'start', n),
            () => {
              this.sourceNodes.delete(t),
                this.removeEventListener(e, 'start', n)
            }
          )
        }
        connectDragPreview(t, e, n) {
          return (
            this.sourcePreviewNodeOptions.set(t, n),
            this.sourcePreviewNodes.set(t, e),
            () => {
              this.sourcePreviewNodes.delete(t),
                this.sourcePreviewNodeOptions.delete(t)
            }
          )
        }
        connectDropTarget(t, e) {
          const n = this.options.rootElement
          if (!this.document || !n) return () => {}
          const o = (o) => {
            if (!this.document || !n || !this.monitor.isDragging()) return
            let i
            switch (o.type) {
              case l.mouse.move:
                i = { x: o.clientX, y: o.clientY }
                break
              case l.touch.move:
                var r, s
                i = {
                  x:
                    (null === (r = o.touches[0]) || void 0 === r
                      ? void 0
                      : r.clientX) || 0,
                  y:
                    (null === (s = o.touches[0]) || void 0 === s
                      ? void 0
                      : s.clientY) || 0,
                }
            }
            const a =
                null != i ? this.document.elementFromPoint(i.x, i.y) : void 0,
              h = a && e.contains(a)
            return a === e || h ? this.handleMove(o, t) : void 0
          }
          return (
            this.addEventListener(this.document.body, 'move', o),
            this.targetNodes.set(t, e),
            () => {
              this.document &&
                (this.targetNodes.delete(t),
                this.removeEventListener(this.document.body, 'move', o))
            }
          )
        }
        getTopMoveStartHandler() {
          return this.options.delayTouchStart || this.options.delayMouseStart
            ? this.handleTopMoveStartDelay
            : this.handleTopMoveStart
        }
        installSourceNodeRemovalObserver(t) {
          this.uninstallSourceNodeRemovalObserver(),
            (this.draggedSourceNode = t),
            (this.draggedSourceNodeRemovalObserver = new MutationObserver(
              () => {
                t &&
                  !t.parentElement &&
                  (this.resurrectSourceNode(),
                  this.uninstallSourceNodeRemovalObserver())
              },
            )),
            t &&
              t.parentElement &&
              this.draggedSourceNodeRemovalObserver.observe(t.parentElement, {
                childList: !0,
              })
        }
        resurrectSourceNode() {
          this.document &&
            this.draggedSourceNode &&
            ((this.draggedSourceNode.style.display = 'none'),
            this.draggedSourceNode.removeAttribute('data-reactid'),
            this.document.body.appendChild(this.draggedSourceNode))
        }
        uninstallSourceNodeRemovalObserver() {
          this.draggedSourceNodeRemovalObserver &&
            this.draggedSourceNodeRemovalObserver.disconnect(),
            (this.draggedSourceNodeRemovalObserver = void 0),
            (this.draggedSourceNode = void 0)
        }
        constructor(t, e, n) {
          ;(this.getSourceClientOffset = (t) => {
            const e = this.sourceNodes.get(t)
            return (
              e &&
              ((t) => {
                const e = 1 === t.nodeType ? t : t.parentElement
                if (!e) return
                const { top: n, left: o } = e.getBoundingClientRect()
                return { x: o, y: n }
              })(e)
            )
          }),
            (this.handleTopMoveStartCapture = (t) => {
              h(t) && (this.moveStartSourceIds = [])
            }),
            (this.handleMoveStart = (t) => {
              Array.isArray(this.moveStartSourceIds) &&
                this.moveStartSourceIds.unshift(t)
            }),
            (this.handleTopMoveStart = (t) => {
              if (!h(t)) return
              const e = c(t)
              e &&
                (u(t) && (this.lastTargetTouchFallback = t.targetTouches[0]),
                (this._mouseClientOffset = e)),
                (this.waitingForDelay = !1)
            }),
            (this.handleTopMoveStartDelay = (t) => {
              if (!h(t)) return
              const e =
                t.type === l.touch.start
                  ? this.options.delayTouchStart
                  : this.options.delayMouseStart
              ;(this.timeout = setTimeout(
                this.handleTopMoveStart.bind(this, t),
                e,
              )),
                (this.waitingForDelay = !0)
            }),
            (this.handleTopMoveCapture = () => {
              this.dragOverTargetIds = []
            }),
            (this.handleMove = (t, e) => {
              this.dragOverTargetIds && this.dragOverTargetIds.unshift(e)
            }),
            (this.handleTopMove = (t) => {
              if (
                (this.timeout && clearTimeout(this.timeout),
                !this.document || this.waitingForDelay)
              )
                return
              const { moveStartSourceIds: e, dragOverTargetIds: n } = this,
                o = this.options.enableHoverOutsideTarget,
                i = c(t, this.lastTargetTouchFallback)
              if (!i) return
              if (
                this._isScrolling ||
                (!this.monitor.isDragging() &&
                  ((t, e, n, o, i) => {
                    if (!i) return !1
                    const r = (180 * Math.atan2(o - e, n - t)) / Math.PI + 180
                    for (let t = 0; t < i.length; ++t) {
                      const e = i[t]
                      if (
                        e &&
                        (null == e.start || r >= e.start) &&
                        (null == e.end || r <= e.end)
                      )
                        return !0
                    }
                    return !1
                  })(
                    this._mouseClientOffset.x || 0,
                    this._mouseClientOffset.y || 0,
                    i.x,
                    i.y,
                    this.options.scrollAngleRanges,
                  ))
              )
                return void (this._isScrolling = !0)
              var r, s, a, h
              if (
                (!this.monitor.isDragging() &&
                  Object.hasOwn(this._mouseClientOffset, 'x') &&
                  e &&
                  ((r = this._mouseClientOffset.x || 0),
                  (s = this._mouseClientOffset.y || 0),
                  (a = i.x),
                  (h = i.y),
                  Math.sqrt(
                    Math.pow(Math.abs(a - r), 2) + Math.pow(Math.abs(h - s), 2),
                  ) > (this.options.touchSlop ? this.options.touchSlop : 0)) &&
                  ((this.moveStartSourceIds = void 0),
                  this.actions.beginDrag(e, {
                    clientOffset: this._mouseClientOffset,
                    getSourceClientOffset: this.getSourceClientOffset,
                    publishSource: !1,
                  })),
                !this.monitor.isDragging())
              )
                return
              const u = this.sourceNodes.get(this.monitor.getSourceId())
              this.installSourceNodeRemovalObserver(u),
                this.actions.publishDragSource(),
                t.cancelable && t.preventDefault()
              const d = (n || [])
                  .map((t) => this.targetNodes.get(t))
                  .filter((t) => !!t),
                l = this.options.getDropTargetElementsAtPoint
                  ? this.options.getDropTargetElementsAtPoint(i.x, i.y, d)
                  : this.document.elementsFromPoint(i.x, i.y),
                v = []
              for (const t in l) {
                if (!Object.hasOwn(l, t)) continue
                let e = l[t]
                for (null != e && v.push(e); e; )
                  (e = e.parentElement), e && -1 === v.indexOf(e) && v.push(e)
              }
              const f = v
                .filter((t) => d.indexOf(t) > -1)
                .map((t) => this._getDropTargetId(t))
                .filter((t) => !!t)
                .filter((t, e, n) => n.indexOf(t) === e)
              if (o)
                for (const t in this.targetNodes) {
                  const e = this.targetNodes.get(t)
                  if (u && e && e.contains(u) && -1 === f.indexOf(t)) {
                    f.unshift(t)
                    break
                  }
                }
              f.reverse(), this.actions.hover(f, { clientOffset: i })
            }),
            (this._getDropTargetId = (t) => {
              const e = this.targetNodes.keys()
              let n = e.next()
              while (!1 === n.done) {
                const o = n.value
                if (t === this.targetNodes.get(o)) return o
                n = e.next()
              }
            }),
            (this.handleTopMoveEndCapture = (t) => {
              ;(this._isScrolling = !1),
                (this.lastTargetTouchFallback = void 0),
                ((t) => void 0 === t.buttons || 0 == (t.buttons & s))(t) &&
                  (this.monitor.isDragging() && !this.monitor.didDrop()
                    ? (t.cancelable && t.preventDefault(),
                      (this._mouseClientOffset = {}),
                      this.uninstallSourceNodeRemovalObserver(),
                      this.actions.drop(),
                      this.actions.endDrag())
                    : (this.moveStartSourceIds = void 0))
            }),
            (this.handleCancelOnEscape = (t) => {
              'Escape' === t.key &&
                this.monitor.isDragging() &&
                ((this._mouseClientOffset = {}),
                this.uninstallSourceNodeRemovalObserver(),
                this.actions.endDrag())
            }),
            (this.options = new r(n, e)),
            (this.actions = t.getActions()),
            (this.monitor = t.getMonitor()),
            (this.sourceNodes = new Map()),
            (this.sourcePreviewNodes = new Map()),
            (this.sourcePreviewNodeOptions = new Map()),
            (this.targetNodes = new Map()),
            (this.listenerTypes = []),
            (this._mouseClientOffset = {}),
            (this._isScrolling = !1),
            this.options.enableMouseEvents && this.listenerTypes.push(o.mouse),
            this.options.enableTouchEvents && this.listenerTypes.push(o.touch),
            this.options.enableKeyboardEvents &&
              this.listenerTypes.push(o.keyboard)
        }
      }
      const f = (t, e = {}, n = {}) => new v(t, e, n)
    },
    85783: (t, e, n) => {
      n.d(e, { useDragLayer: () => s })
      var o = n(50959),
        i = n(76121),
        r = n(284570)
      function s(t) {
        const e = (0, r.useDragDropManager)().getMonitor(),
          [n, s] = (0, i.useCollector)(e, t)
        return (
          (0, o.useEffect)(() => e.subscribeToOffsetChange(s)),
          (0, o.useEffect)(() => e.subscribeToStateChange(s)),
          n
        )
      }
    },
  },
])
