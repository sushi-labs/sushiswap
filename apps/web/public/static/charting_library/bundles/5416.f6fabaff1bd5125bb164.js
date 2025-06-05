;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5416],
  {
    377145: (e, t, o) => {
      function s(e, t) {
        return e === t
      }
      function n(e, t, o) {
        if (null === t || null === o || t.length !== o.length) return !1
        for (var s = t.length, n = 0; n < s; n++) if (!e(t[n], o[n])) return !1
        return !0
      }
      function r(e) {
        var t = Array.isArray(e[0]) ? e[0] : e
        if (!t.every((e) => 'function' == typeof e)) {
          var o = t.map((e) => typeof e).join(', ')
          throw new Error(
            'Selector creators expect all input-selectors to be functions, instead received the following types: [' +
              o +
              ']',
          )
        }
        return t
      }
      o.d(t, { createSelector: () => i })
      var i = ((e) => {
        for (
          var t = arguments.length, o = Array(t > 1 ? t - 1 : 0), s = 1;
          s < t;
          s++
        )
          o[s - 1] = arguments[s]
        return () => {
          for (var t = arguments.length, s = Array(t), n = 0; n < t; n++)
            s[n] = arguments[n]
          var i = 0,
            a = s.pop(),
            u = r(s),
            h = e.apply(
              void 0,
              [() => (i++, a.apply(null, arguments))].concat(o),
            ),
            d = e(() => {
              for (var e = [], t = u.length, o = 0; o < t; o++)
                e.push(u[o].apply(null, arguments))
              return h.apply(null, e)
            })
          return (
            (d.resultFunc = a),
            (d.dependencies = u),
            (d.recomputations = () => i),
            (d.resetRecomputations = () => (i = 0)),
            d
          )
        }
      })((e) => {
        var t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : s,
          o = null,
          r = null
        return () => (
          n(t, o, arguments) || (r = e.apply(null, arguments)),
          (o = arguments),
          r
        )
      })
    },
    207809: (e, t, o) => {
      o.d(t, { TouchBackend: () => g })
      var s,
        n = o(6346)
      !((e) => {
        ;(e.mouse = 'mouse'), (e.touch = 'touch'), (e.keyboard = 'keyboard')
      })(s || (s = {}))
      class r {
        get delay() {
          var e
          return null !== (e = this.args.delay) && void 0 !== e ? e : 0
        }
        get scrollAngleRanges() {
          return this.args.scrollAngleRanges
        }
        get getDropTargetElementsAtPoint() {
          return this.args.getDropTargetElementsAtPoint
        }
        get ignoreContextMenu() {
          var e
          return null !== (e = this.args.ignoreContextMenu) && void 0 !== e && e
        }
        get enableHoverOutsideTarget() {
          var e
          return (
            null !== (e = this.args.enableHoverOutsideTarget) &&
            void 0 !== e &&
            e
          )
        }
        get enableKeyboardEvents() {
          var e
          return (
            null !== (e = this.args.enableKeyboardEvents) && void 0 !== e && e
          )
        }
        get enableMouseEvents() {
          var e
          return null !== (e = this.args.enableMouseEvents) && void 0 !== e && e
        }
        get enableTouchEvents() {
          var e
          return null === (e = this.args.enableTouchEvents) || void 0 === e || e
        }
        get touchSlop() {
          return this.args.touchSlop || 0
        }
        get delayTouchStart() {
          var e, t, o, s
          return null !==
            (s =
              null !==
                (o =
                  null === (e = this.args) || void 0 === e
                    ? void 0
                    : e.delayTouchStart) && void 0 !== o
                ? o
                : null === (t = this.args) || void 0 === t
                  ? void 0
                  : t.delay) && void 0 !== s
            ? s
            : 0
        }
        get delayMouseStart() {
          var e, t, o, s
          return null !==
            (s =
              null !==
                (o =
                  null === (e = this.args) || void 0 === e
                    ? void 0
                    : e.delayMouseStart) && void 0 !== o
                ? o
                : null === (t = this.args) || void 0 === t
                  ? void 0
                  : t.delay) && void 0 !== s
            ? s
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
          var e
          return (
            null === (e = this.context) || void 0 === e
              ? void 0
              : e.document
          )
            ? this.context.document
            : this.window
              ? this.window.document
              : void 0
        }
        get rootElement() {
          var e
          return (
            (null === (e = this.args) || void 0 === e
              ? void 0
              : e.rootElement) || this.document
          )
        }
        constructor(e, t) {
          ;(this.args = e), (this.context = t)
        }
      }
      const i = 1,
        a = 0
      function u(e) {
        return void 0 === e.button || e.button === a
      }
      function h(e) {
        return !!e.targetTouches
      }
      function d(e, t) {
        return h(e)
          ? ((e, t) =>
              1 === e.targetTouches.length
                ? d(e.targetTouches[0])
                : t &&
                    1 === e.touches.length &&
                    e.touches[0].target === t.target
                  ? d(e.touches[0])
                  : void 0)(e, t)
          : { x: e.clientX, y: e.clientY }
      }
      const l = (() => {
          let e = !1
          try {
            addEventListener(
              'test',
              () => {},
              Object.defineProperty({}, 'passive', {
                get: () => ((e = !0), !0),
              }),
            )
          } catch (e) {}
          return e
        })(),
        c = {
          [s.mouse]: {
            start: 'mousedown',
            move: 'mousemove',
            end: 'mouseup',
            contextmenu: 'contextmenu',
          },
          [s.touch]: {
            start: 'touchstart',
            move: 'touchmove',
            end: 'touchend',
          },
          [s.keyboard]: { keydown: 'keydown' },
        }
      class v {
        profile() {
          var e
          return {
            sourceNodes: this.sourceNodes.size,
            sourcePreviewNodes: this.sourcePreviewNodes.size,
            sourcePreviewNodeOptions: this.sourcePreviewNodeOptions.size,
            targetNodes: this.targetNodes.size,
            dragOverTargetIds:
              (null === (e = this.dragOverTargetIds) || void 0 === e
                ? void 0
                : e.length) || 0,
          }
        }
        get document() {
          return this.options.document
        }
        setup() {
          const e = this.options.rootElement
          e &&
            ((0, n.invariant)(
              !v.isSetUp,
              'Cannot have two Touch backends at the same time.',
            ),
            (v.isSetUp = !0),
            this.addEventListener(e, 'start', this.getTopMoveStartHandler()),
            this.addEventListener(
              e,
              'start',
              this.handleTopMoveStartCapture,
              !0,
            ),
            this.addEventListener(e, 'move', this.handleTopMove),
            this.addEventListener(e, 'move', this.handleTopMoveCapture, !0),
            this.addEventListener(e, 'end', this.handleTopMoveEndCapture, !0),
            this.options.enableMouseEvents &&
              !this.options.ignoreContextMenu &&
              this.addEventListener(
                e,
                'contextmenu',
                this.handleTopMoveEndCapture,
              ),
            this.options.enableKeyboardEvents &&
              this.addEventListener(
                e,
                'keydown',
                this.handleCancelOnEscape,
                !0,
              ))
        }
        teardown() {
          const e = this.options.rootElement
          e &&
            ((v.isSetUp = !1),
            (this._mouseClientOffset = {}),
            this.removeEventListener(
              e,
              'start',
              this.handleTopMoveStartCapture,
              !0,
            ),
            this.removeEventListener(e, 'start', this.handleTopMoveStart),
            this.removeEventListener(e, 'move', this.handleTopMoveCapture, !0),
            this.removeEventListener(e, 'move', this.handleTopMove),
            this.removeEventListener(
              e,
              'end',
              this.handleTopMoveEndCapture,
              !0,
            ),
            this.options.enableMouseEvents &&
              !this.options.ignoreContextMenu &&
              this.removeEventListener(
                e,
                'contextmenu',
                this.handleTopMoveEndCapture,
              ),
            this.options.enableKeyboardEvents &&
              this.removeEventListener(
                e,
                'keydown',
                this.handleCancelOnEscape,
                !0,
              ),
            this.uninstallSourceNodeRemovalObserver())
        }
        addEventListener(e, t, o, s = !1) {
          const n = l ? { capture: s, passive: !1 } : s
          this.listenerTypes.forEach((s) => {
            const r = c[s][t]
            r && e.addEventListener(r, o, n)
          })
        }
        removeEventListener(e, t, o, s = !1) {
          const n = l ? { capture: s, passive: !1 } : s
          this.listenerTypes.forEach((s) => {
            const r = c[s][t]
            r && e.removeEventListener(r, o, n)
          })
        }
        connectDragSource(e, t) {
          const o = this.handleMoveStart.bind(this, e)
          return (
            this.sourceNodes.set(e, t),
            this.addEventListener(t, 'start', o),
            () => {
              this.sourceNodes.delete(e),
                this.removeEventListener(t, 'start', o)
            }
          )
        }
        connectDragPreview(e, t, o) {
          return (
            this.sourcePreviewNodeOptions.set(e, o),
            this.sourcePreviewNodes.set(e, t),
            () => {
              this.sourcePreviewNodes.delete(e),
                this.sourcePreviewNodeOptions.delete(e)
            }
          )
        }
        connectDropTarget(e, t) {
          const o = this.options.rootElement
          if (!this.document || !o) return () => {}
          const s = (s) => {
            if (!this.document || !o || !this.monitor.isDragging()) return
            let n
            switch (s.type) {
              case c.mouse.move:
                n = { x: s.clientX, y: s.clientY }
                break
              case c.touch.move:
                var r, i
                n = {
                  x:
                    (null === (r = s.touches[0]) || void 0 === r
                      ? void 0
                      : r.clientX) || 0,
                  y:
                    (null === (i = s.touches[0]) || void 0 === i
                      ? void 0
                      : i.clientY) || 0,
                }
            }
            const a =
                null != n ? this.document.elementFromPoint(n.x, n.y) : void 0,
              u = a && t.contains(a)
            return a === t || u ? this.handleMove(s, e) : void 0
          }
          return (
            this.addEventListener(this.document.body, 'move', s),
            this.targetNodes.set(e, t),
            () => {
              this.document &&
                (this.targetNodes.delete(e),
                this.removeEventListener(this.document.body, 'move', s))
            }
          )
        }
        getTopMoveStartHandler() {
          return this.options.delayTouchStart || this.options.delayMouseStart
            ? this.handleTopMoveStartDelay
            : this.handleTopMoveStart
        }
        installSourceNodeRemovalObserver(e) {
          this.uninstallSourceNodeRemovalObserver(),
            (this.draggedSourceNode = e),
            (this.draggedSourceNodeRemovalObserver = new MutationObserver(
              () => {
                e &&
                  !e.parentElement &&
                  (this.resurrectSourceNode(),
                  this.uninstallSourceNodeRemovalObserver())
              },
            )),
            e &&
              e.parentElement &&
              this.draggedSourceNodeRemovalObserver.observe(e.parentElement, {
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
        constructor(e, t, o) {
          ;(this.getSourceClientOffset = (e) => {
            const t = this.sourceNodes.get(e)
            return (
              t &&
              ((e) => {
                const t = 1 === e.nodeType ? e : e.parentElement
                if (!t) return
                const { top: o, left: s } = t.getBoundingClientRect()
                return { x: s, y: o }
              })(t)
            )
          }),
            (this.handleTopMoveStartCapture = (e) => {
              u(e) && (this.moveStartSourceIds = [])
            }),
            (this.handleMoveStart = (e) => {
              Array.isArray(this.moveStartSourceIds) &&
                this.moveStartSourceIds.unshift(e)
            }),
            (this.handleTopMoveStart = (e) => {
              if (!u(e)) return
              const t = d(e)
              t &&
                (h(e) && (this.lastTargetTouchFallback = e.targetTouches[0]),
                (this._mouseClientOffset = t)),
                (this.waitingForDelay = !1)
            }),
            (this.handleTopMoveStartDelay = (e) => {
              if (!u(e)) return
              const t =
                e.type === c.touch.start
                  ? this.options.delayTouchStart
                  : this.options.delayMouseStart
              ;(this.timeout = setTimeout(
                this.handleTopMoveStart.bind(this, e),
                t,
              )),
                (this.waitingForDelay = !0)
            }),
            (this.handleTopMoveCapture = () => {
              this.dragOverTargetIds = []
            }),
            (this.handleMove = (e, t) => {
              this.dragOverTargetIds && this.dragOverTargetIds.unshift(t)
            }),
            (this.handleTopMove = (e) => {
              if (
                (this.timeout && clearTimeout(this.timeout),
                !this.document || this.waitingForDelay)
              )
                return
              const { moveStartSourceIds: t, dragOverTargetIds: o } = this,
                s = this.options.enableHoverOutsideTarget,
                n = d(e, this.lastTargetTouchFallback)
              if (!n) return
              if (
                this._isScrolling ||
                (!this.monitor.isDragging() &&
                  ((e, t, o, s, n) => {
                    if (!n) return !1
                    const r = (180 * Math.atan2(s - t, o - e)) / Math.PI + 180
                    for (let e = 0; e < n.length; ++e) {
                      const t = n[e]
                      if (
                        t &&
                        (null == t.start || r >= t.start) &&
                        (null == t.end || r <= t.end)
                      )
                        return !0
                    }
                    return !1
                  })(
                    this._mouseClientOffset.x || 0,
                    this._mouseClientOffset.y || 0,
                    n.x,
                    n.y,
                    this.options.scrollAngleRanges,
                  ))
              )
                return void (this._isScrolling = !0)
              var r, i, a, u
              if (
                (!this.monitor.isDragging() &&
                  Object.hasOwn(this._mouseClientOffset, 'x') &&
                  t &&
                  ((r = this._mouseClientOffset.x || 0),
                  (i = this._mouseClientOffset.y || 0),
                  (a = n.x),
                  (u = n.y),
                  Math.sqrt(
                    Math.pow(Math.abs(a - r), 2) + Math.pow(Math.abs(u - i), 2),
                  ) > (this.options.touchSlop ? this.options.touchSlop : 0)) &&
                  ((this.moveStartSourceIds = void 0),
                  this.actions.beginDrag(t, {
                    clientOffset: this._mouseClientOffset,
                    getSourceClientOffset: this.getSourceClientOffset,
                    publishSource: !1,
                  })),
                !this.monitor.isDragging())
              )
                return
              const h = this.sourceNodes.get(this.monitor.getSourceId())
              this.installSourceNodeRemovalObserver(h),
                this.actions.publishDragSource(),
                e.cancelable && e.preventDefault()
              const l = (o || [])
                  .map((e) => this.targetNodes.get(e))
                  .filter((e) => !!e),
                c = this.options.getDropTargetElementsAtPoint
                  ? this.options.getDropTargetElementsAtPoint(n.x, n.y, l)
                  : this.document.elementsFromPoint(n.x, n.y),
                v = []
              for (const e in c) {
                if (!Object.hasOwn(c, e)) continue
                let t = c[e]
                for (null != t && v.push(t); t; )
                  (t = t.parentElement), t && -1 === v.indexOf(t) && v.push(t)
              }
              const g = v
                .filter((e) => l.indexOf(e) > -1)
                .map((e) => this._getDropTargetId(e))
                .filter((e) => !!e)
                .filter((e, t, o) => o.indexOf(e) === t)
              if (s)
                for (const e in this.targetNodes) {
                  const t = this.targetNodes.get(e)
                  if (h && t && t.contains(h) && -1 === g.indexOf(e)) {
                    g.unshift(e)
                    break
                  }
                }
              g.reverse(), this.actions.hover(g, { clientOffset: n })
            }),
            (this._getDropTargetId = (e) => {
              const t = this.targetNodes.keys()
              let o = t.next()
              while (!1 === o.done) {
                const s = o.value
                if (e === this.targetNodes.get(s)) return s
                o = t.next()
              }
            }),
            (this.handleTopMoveEndCapture = (e) => {
              ;(this._isScrolling = !1),
                (this.lastTargetTouchFallback = void 0),
                ((e) => void 0 === e.buttons || 0 == (e.buttons & i))(e) &&
                  (this.monitor.isDragging() && !this.monitor.didDrop()
                    ? (e.cancelable && e.preventDefault(),
                      (this._mouseClientOffset = {}),
                      this.uninstallSourceNodeRemovalObserver(),
                      this.actions.drop(),
                      this.actions.endDrag())
                    : (this.moveStartSourceIds = void 0))
            }),
            (this.handleCancelOnEscape = (e) => {
              'Escape' === e.key &&
                this.monitor.isDragging() &&
                ((this._mouseClientOffset = {}),
                this.uninstallSourceNodeRemovalObserver(),
                this.actions.endDrag())
            }),
            (this.options = new r(o, t)),
            (this.actions = e.getActions()),
            (this.monitor = e.getMonitor()),
            (this.sourceNodes = new Map()),
            (this.sourcePreviewNodes = new Map()),
            (this.sourcePreviewNodeOptions = new Map()),
            (this.targetNodes = new Map()),
            (this.listenerTypes = []),
            (this._mouseClientOffset = {}),
            (this._isScrolling = !1),
            this.options.enableMouseEvents && this.listenerTypes.push(s.mouse),
            this.options.enableTouchEvents && this.listenerTypes.push(s.touch),
            this.options.enableKeyboardEvents &&
              this.listenerTypes.push(s.keyboard)
        }
      }
      const g = (e, t = {}, o = {}) => new v(e, t, o)
    },
    85783: (e, t, o) => {
      o.d(t, { useDragLayer: () => i })
      var s = o(50959),
        n = o(76121),
        r = o(284570)
      function i(e) {
        const t = (0, r.useDragDropManager)().getMonitor(),
          [o, i] = (0, n.useCollector)(t, e)
        return (
          (0, s.useEffect)(() => t.subscribeToOffsetChange(i)),
          (0, s.useEffect)(() => t.subscribeToStateChange(i)),
          o
        )
      }
    },
  },
])
