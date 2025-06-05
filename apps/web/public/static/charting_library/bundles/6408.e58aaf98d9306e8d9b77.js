;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [6408],
  {
    5734: (t) => {
      t.exports = {
        dialog: 'dialog-aRAWUDhF',
        rounded: 'rounded-aRAWUDhF',
        shadowed: 'shadowed-aRAWUDhF',
        fullscreen: 'fullscreen-aRAWUDhF',
        darker: 'darker-aRAWUDhF',
        backdrop: 'backdrop-aRAWUDhF',
      }
    },
    8326: (t) => {
      t.exports = {
        'tablet-normal-breakpoint': 'screen and (max-width: 768px)',
        'tooltip-offset': '20px',
        dialog: 'dialog-qyCw0PaN',
        dragging: 'dragging-qyCw0PaN',
        dialogAnimatedAppearance: 'dialogAnimatedAppearance-qyCw0PaN',
        dialogAnimation: 'dialogAnimation-qyCw0PaN',
        dialogTooltip: 'dialogTooltip-qyCw0PaN',
      }
    },
    53017: (t, e, i) => {
      function s(t) {
        return (e) => {
          t.forEach((t) => {
            'function' == typeof t ? t(e) : null != t && (t.current = e)
          })
        }
      }
      function o(t) {
        return s([t])
      }
      i.d(e, { isomorphicRef: () => o, mergeRefs: () => s })
    },
    52778: (t, e, i) => {
      i.d(e, { OutsideEvent: () => o })
      var s = i(36383)
      function o(t) {
        const { children: e, ...i } = t
        return e((0, s.useOutsideEvent)(i))
      }
    },
    95711: (t, e, i) => {
      i.d(e, { PopupContext: () => s })
      const s = i(50959).createContext(null)
    },
    16181: (t, e, i) => {
      i.d(e, { PopupDialog: () => M })
      var s = i(50959),
        o = i(97754),
        n = i(50151),
        a = i(99663),
        r = i(67961),
        l = i(90186),
        h = i(5734)
      class d extends s.PureComponent {
        constructor() {
          super(...arguments),
            (this._manager = new r.OverlapManager()),
            (this._handleSlot = (t) => {
              this._manager.setContainer(t)
            })
        }
        render() {
          const {
              rounded: t = !0,
              shadowed: e = !0,
              fullscreen: i = !1,
              darker: n = !1,
              className: r,
              backdrop: d,
              containerTabIndex: c = -1,
            } = this.props,
            u = o(
              r,
              h.dialog,
              t && h.rounded,
              e && h.shadowed,
              i && h.fullscreen,
              n && h.darker,
            ),
            p = (0, l.filterDataProps)(this.props),
            g = this.props.style
              ? { ...this._createStyles(), ...this.props.style }
              : this._createStyles()
          return s.createElement(
            s.Fragment,
            null,
            s.createElement(
              a.SlotContext.Provider,
              { value: this._manager },
              d &&
                s.createElement('div', {
                  onClick: this.props.onClickBackdrop,
                  className: h.backdrop,
                }),
              s.createElement(
                'div',
                {
                  ...p,
                  className: u,
                  style: g,
                  ref: this.props.reference,
                  onFocus: this.props.onFocus,
                  onMouseDown: this.props.onMouseDown,
                  onMouseUp: this.props.onMouseUp,
                  onClick: this.props.onClick,
                  onKeyDown: this.props.onKeyDown,
                  tabIndex: c,
                  'aria-label': this.props.containerAriaLabel,
                },
                this.props.children,
              ),
            ),
            s.createElement(a.Slot, { reference: this._handleSlot }),
          )
        }
        _createStyles() {
          const {
            bottom: t,
            left: e,
            width: i,
            right: s,
            top: o,
            zIndex: n,
            height: a,
          } = this.props
          return {
            bottom: t,
            left: e,
            right: s,
            top: o,
            zIndex: n,
            maxWidth: i,
            height: a,
          }
        }
      }
      var c = i(86431),
        u = i(52778),
        p = i(37160)
      function g(t, e, i, s) {
        return t + e > s && (t = s - e), t < i && (t = i), t
      }
      function _(t) {
        return {
          x: (0, p.clamp)(t.x, 20, document.documentElement.clientWidth - 20),
          y: (0, p.clamp)(t.y, 20, window.innerHeight - 20),
        }
      }
      function m(t) {
        return { x: t.clientX, y: t.clientY }
      }
      function f(t) {
        return { x: t.touches[0].clientX, y: t.touches[0].clientY }
      }
      class v {
        constructor(t, e, i = { boundByScreen: !0 }) {
          ;(this._drag = null),
            (this._canBeTouchClick = !1),
            (this._frame = null),
            (this._onMouseDragStart = (t) => {
              if (0 !== t.button || this._isTargetNoDraggable(t)) return
              t.preventDefault(),
                document.addEventListener('mousemove', this._onMouseDragMove),
                document.addEventListener('mouseup', this._onMouseDragEnd)
              const e = _(m(t))
              this._dragStart(e)
            }),
            (this._onTouchDragStart = (t) => {
              if (this._isTargetNoDraggable(t)) return
              ;(this._canBeTouchClick = !0),
                t.preventDefault(),
                this._header.addEventListener(
                  'touchmove',
                  this._onTouchDragMove,
                  { passive: !1 },
                )
              const e = _(f(t))
              this._dragStart(e)
            }),
            (this._onMouseDragEnd = (t) => {
              t.target instanceof Node &&
                this._header.contains(t.target) &&
                t.preventDefault(),
                document.removeEventListener(
                  'mousemove',
                  this._onMouseDragMove,
                ),
                document.removeEventListener('mouseup', this._onMouseDragEnd),
                this._onDragStop()
            }),
            (this._onTouchDragEnd = (t) => {
              this._header.removeEventListener(
                'touchmove',
                this._onTouchDragMove,
              ),
                this._onDragStop(),
                this._canBeTouchClick &&
                  ((this._canBeTouchClick = !1),
                  ((t) => {
                    if (t instanceof SVGElement) {
                      const e = document.createEvent('SVGEvents')
                      e.initEvent('click', !0, !0), t.dispatchEvent(e)
                    }
                    t instanceof HTMLElement && t.click()
                  })(t.target))
            }),
            (this._onMouseDragMove = (t) => {
              const e = _(m(t))
              this._dragMove(e)
            }),
            (this._onTouchDragMove = (t) => {
              ;(this._canBeTouchClick = !1), t.preventDefault()
              const e = _(f(t))
              this._dragMove(e)
            }),
            (this._onDragStop = () => {
              ;(this._drag = null),
                this._header.classList.remove('dragging'),
                this._options.onDragEnd && this._options.onDragEnd()
            }),
            (this._dialog = t),
            (this._header = e),
            (this._options = i),
            this._header.addEventListener('mousedown', this._onMouseDragStart),
            this._header.addEventListener('touchstart', this._onTouchDragStart),
            this._header.addEventListener('touchend', this._onTouchDragEnd)
        }
        destroy() {
          null !== this._frame && cancelAnimationFrame(this._frame),
            this._header.removeEventListener(
              'mousedown',
              this._onMouseDragStart,
            ),
            document.removeEventListener('mouseup', this._onMouseDragEnd),
            this._header.removeEventListener(
              'touchstart',
              this._onTouchDragStart,
            ),
            this._header.removeEventListener('touchend', this._onTouchDragEnd),
            document.removeEventListener('mouseleave', this._onMouseDragEnd)
        }
        updateOptions(t) {
          this._options = t
        }
        _dragStart(t) {
          const e = this._dialog.getBoundingClientRect()
          this._drag = {
            startX: t.x,
            startY: t.y,
            finishX: t.x,
            finishY: t.y,
            dialogX: e.left,
            dialogY: e.top,
          }
          const i = Math.round(e.left),
            s = Math.round(e.top)
          ;(this._dialog.style.transform = `translate(${i}px, ${s}px)`),
            this._header.classList.add('dragging'),
            this._options.onDragStart && this._options.onDragStart()
        }
        _dragMove(t) {
          if (this._drag) {
            if (
              ((this._drag.finishX = t.x),
              (this._drag.finishY = t.y),
              null !== this._frame)
            )
              return
            this._frame = requestAnimationFrame(() => {
              if (this._drag) {
                const e = t.x - this._drag.startX,
                  i = t.y - this._drag.startY
                this._moveDialog(this._drag.dialogX + e, this._drag.dialogY + i)
              }
              this._frame = null
            })
          }
        }
        _moveDialog(t, e) {
          const i = this._dialog.getBoundingClientRect(),
            { boundByScreen: s } = this._options,
            o = g(t, i.width, s ? 0 : -1 / 0, s ? window.innerWidth : 1 / 0),
            n = g(e, i.height, s ? 0 : -1 / 0, s ? window.innerHeight : 1 / 0)
          this._dialog.style.transform = `translate(${Math.round(o)}px, ${Math.round(n)}px)`
        }
        _isTargetNoDraggable(t) {
          return (
            t.target instanceof Element &&
            null !== t.target.closest('[data-disable-drag]')
          )
        }
      }
      const y = { vertical: 0 }
      class D {
        constructor(t, e) {
          ;(this._frame = null),
            (this._isFullscreen = !1),
            (this._handleResize = () => {
              null === this._frame &&
                (this._frame = requestAnimationFrame(() => {
                  this.recalculateBounds(), (this._frame = null)
                }))
            }),
            (this._dialog = t),
            (this._guard = e.guard || y),
            (this._calculateDialogPosition = e.calculateDialogPosition),
            (this._initialHeight = t.style.height),
            window.addEventListener('resize', this._handleResize)
        }
        updateOptions(t) {
          ;(this._guard = t.guard || y),
            (this._calculateDialogPosition = t.calculateDialogPosition)
        }
        setFullscreen(t) {
          this._isFullscreen !== t &&
            ((this._isFullscreen = t), this.recalculateBounds())
        }
        centerAndFit() {
          const { x: t, y: e } = this.getDialogsTopLeftCoordinates(),
            i = this._calcAvailableHeight(),
            s = this._calcDialogHeight()
          if (i === s)
            if (this._calculateDialogPosition) {
              const { left: t, top: e } = this._calculateDialogPosition(
                this._dialog,
                document.documentElement,
                this._guard,
              )
              this._dialog.style.transform = `translate(${Math.round(t)}px, ${Math.round(e)}px)`
            } else this._dialog.style.height = s + 'px'
          ;(this._dialog.style.top = '0px'),
            (this._dialog.style.left = '0px'),
            (this._dialog.style.transform = `translate(${t}px, ${e}px)`)
        }
        getDialogsTopLeftCoordinates() {
          const { clientHeight: t, clientWidth: e } = document.documentElement,
            i = this._calcDialogHeight(),
            s = e / 2 - this._dialog.clientWidth / 2,
            o = t / 2 - i / 2
          return { x: Math.round(s), y: Math.round(o) }
        }
        recalculateBounds() {
          var t
          const { clientHeight: e, clientWidth: i } = document.documentElement,
            { vertical: s } = this._guard,
            o =
              null === (t = this._calculateDialogPosition) || void 0 === t
                ? void 0
                : t.call(
                    this,
                    this._dialog,
                    { clientWidth: i, clientHeight: e },
                    { vertical: s },
                  )
          if (this._isFullscreen) {
            if (
              ((this._dialog.style.top = '0px'),
              (this._dialog.style.left = '0px'),
              (this._dialog.style.width = '100%'),
              (this._dialog.style.height = '100%'),
              (this._dialog.style.transform = 'none'),
              o)
            ) {
              const { left: t, top: e, width: i, height: s } = o
              ;(this._dialog.style.transform = `translate(${Math.round(t)}px, ${Math.round(e)}px)`),
                i &&
                  ((this._dialog.style.width = `${i}px`),
                  (this._dialog.style.minWidth = 'unset')),
                s &&
                  ((this._dialog.style.height = `${s}px`),
                  (this._dialog.style.minHeight = 'unset'))
            }
          } else if (o) {
            const { left: t, top: e } = o
            this._dialog.style.transform = `translate(${Math.round(t)}px, ${Math.round(e)}px)`
          } else {
            ;(this._dialog.style.width = ''), (this._dialog.style.height = '')
            const t = this._dialog.getBoundingClientRect(),
              o = e - 2 * s,
              n = g(t.left, t.width, 0, i),
              a = g(t.top, t.height, s, e)
            ;(this._dialog.style.top = '0px'),
              (this._dialog.style.left = '0px'),
              (this._dialog.style.transform = `translate(${Math.round(n)}px, ${Math.round(a)}px)`),
              (this._dialog.style.height =
                o < t.height ? o + 'px' : this._initialHeight)
          }
        }
        destroy() {
          window.removeEventListener('resize', this._handleResize),
            null !== this._frame &&
              (cancelAnimationFrame(this._frame), (this._frame = null))
        }
        _calcDialogHeight() {
          const t = this._calcAvailableHeight()
          return t < this._dialog.clientHeight ? t : this._dialog.clientHeight
        }
        _calcAvailableHeight() {
          return (
            document.documentElement.clientHeight - 2 * this._guard.vertical
          )
        }
      }
      var E = i(42842),
        x = i(95711),
        S = i(99054),
        T = i(8326)
      T['tooltip-offset']
      class F extends s.PureComponent {
        constructor(t) {
          super(t),
            (this._dialog = null),
            (this._cleanUpFunctions = []),
            (this._prevActiveElement = null),
            (this._handleDialogRef = (t) => {
              const { reference: e } = this.props
              ;(this._dialog = t), 'function' == typeof e && e(t)
            }),
            (this._handleFocus = (t) => {
              this._moveToTop()
            }),
            (this._handleMouseDown = (t) => {
              this._moveToTop()
            }),
            (this._handleTouchStart = (t) => {
              this._moveToTop()
            }),
            (this.state = { canFitTooltip: !1 })
        }
        render() {
          return s.createElement(
            x.PopupContext.Provider,
            { value: this },
            s.createElement(
              u.OutsideEvent,
              {
                mouseDown: !0,
                touchStart: !0,
                handler: this.props.onClickOutside,
              },
              (t) =>
                s.createElement(
                  'div',
                  {
                    ref: t,
                    'data-outside-boundary-for': this.props.name,
                    onFocus: this._handleFocus,
                    onMouseDown: this._handleMouseDown,
                    onTouchStart: this._handleTouchStart,
                    'data-dialog-name': this.props['data-dialog-name'],
                  },
                  s.createElement(
                    d,
                    {
                      style: this._applyAnimationCSSVariables(),
                      ...this.props,
                      reference: this._handleDialogRef,
                      className: o(T.dialog, this.props.className),
                    },
                    !1,
                    this.props.children,
                  ),
                ),
            ),
          )
        }
        componentDidMount() {
          const { draggable: t, boundByScreen: e, onDragStart: i } = this.props,
            s = (0, n.ensureNotNull)(this._dialog)
          if (t) {
            const t = s.querySelector('[data-dragg-area]')
            if (t && t instanceof HTMLElement) {
              const o = new v(s, t, {
                boundByScreen: Boolean(e),
                onDragStart: i,
              })
              this._cleanUpFunctions.push(() => o.destroy()), (this._drag = o)
            }
          }
          ;(this._prevActiveElement = document.activeElement),
            this.props.autofocus &&
              !s.contains(document.activeElement) &&
              s.focus(),
            (this._isFullScreen() || this.props.fixedBody) &&
              (0, S.setFixedBodyState)(!0)
          const { guard: o, calculateDialogPosition: a } = this.props
          if (this.props.resizeHandler) this._resize = this.props.resizeHandler
          else {
            const t = new D(s, { guard: o, calculateDialogPosition: a })
            this._cleanUpFunctions.push(() => t.destroy()), (this._resize = t)
          }
          if (
            (this.props.isAnimationEnabled &&
              this.props.growPoint &&
              this._applyAppearanceAnimation(this.props.growPoint),
            this.props.centeredOnMount && this._resize.centerAndFit(),
            this._resize.setFullscreen(this._isFullScreen()),
            this.props.shouldForceFocus)
          ) {
            if (this.props.onForceFocus) return void this.props.onForceFocus(s)
            s.focus()
          }
        }
        componentDidUpdate() {
          if (this._resize) {
            const { guard: t, calculateDialogPosition: e } = this.props
            this._resize.updateOptions({
              guard: t,
              calculateDialogPosition: e,
            }),
              this._resize.setFullscreen(this._isFullScreen())
          }
          this._drag &&
            this._drag.updateOptions({
              boundByScreen: Boolean(this.props.boundByScreen),
              onDragStart: this.props.onDragStart,
            })
        }
        componentWillUnmount() {
          var t
          if (
            this.props.shouldReturnFocus &&
            this._prevActiveElement &&
            document.body.contains(this._prevActiveElement) &&
            (null === document.activeElement ||
              document.activeElement === document.body ||
              (null === (t = this._dialog) || void 0 === t
                ? void 0
                : t.contains(document.activeElement)))
          )
            try {
              this._prevActiveElement.focus({ preventScroll: !0 })
            } catch (t) {}
          for (const t of this._cleanUpFunctions) t()
          ;(this._isFullScreen() || this.props.fixedBody) &&
            (0, S.setFixedBodyState)(!1)
        }
        focus() {
          this._dialog && this._dialog.focus()
        }
        centerAndFit() {
          this._resize && this._resize.centerAndFit()
        }
        recalculateBounds() {
          this._resize && this._resize.recalculateBounds()
        }
        _moveToTop() {
          null !== this.context && this.context.moveToTop()
        }
        _applyAnimationCSSVariables() {
          return {
            '--animationTranslateStartX': null,
            '--animationTranslateStartY': null,
            '--animationTranslateEndX': null,
            '--animationTranslateEndY': null,
          }
        }
        _applyAppearanceAnimation(t) {
          if (this._resize && this._dialog) {
            const { x: e, y: i } = t,
              { x: s, y: o } = this._resize.getDialogsTopLeftCoordinates()
            this._dialog.style.setProperty(
              '--animationTranslateStartX',
              `${e}px`,
            ),
              this._dialog.style.setProperty(
                '--animationTranslateStartY',
                `${i}px`,
              ),
              this._dialog.style.setProperty(
                '--animationTranslateEndX',
                `${s}px`,
              ),
              this._dialog.style.setProperty(
                '--animationTranslateEndY',
                `${o}px`,
              ),
              this._dialog.classList.add(T.dialogAnimatedAppearance)
          }
        }
        _handleTooltipFit() {
          0
        }
        _isFullScreen() {
          return Boolean(this.props.fullscreen)
        }
      }
      ;(F.contextType = E.PortalContext),
        (F.defaultProps = {
          boundByScreen: !0,
          draggable: !0,
          centeredOnMount: !0,
          shouldReturnFocus: !0,
        })
      const M = (0, c.makeOverlapable)(F)
    },
    86431: (t, e, i) => {
      i.d(e, { makeOverlapable: () => n })
      var s = i(50959),
        o = i(42842)
      function n(t) {
        return class extends s.PureComponent {
          render() {
            const { isOpened: e, root: i } = this.props
            if (!e) return null
            const n = s.createElement(t, { ...this.props, zIndex: 150 })
            return 'parent' === i ? n : s.createElement(o.Portal, null, n)
          }
        }
      }
    },
  },
])
