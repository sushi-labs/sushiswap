;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2306],
  {
    266783: (e) => {
      var t = Object.prototype.hasOwnProperty
      function o(e, t) {
        return e === t ? 0 !== e || 0 !== t || 1 / e == 1 / t : e != e && t != t
      }
      e.exports = (e, i) => {
        if (o(e, i)) return !0
        if (
          'object' != typeof e ||
          null === e ||
          'object' != typeof i ||
          null === i
        )
          return !1
        var n = Object.keys(e),
          r = Object.keys(i)
        if (n.length !== r.length) return !1
        for (var s = 0; s < n.length; s++)
          if (!t.call(i, n[s]) || !o(e[n[s]], i[n[s]])) return !1
        return !0
      }
    },
    70132: (e) => {
      e.exports = {}
    },
    419619: (e) => {
      e.exports = {}
    },
    165719: (e) => {
      e.exports = {}
    },
    488803: (e) => {
      e.exports = {
        'tablet-normal-breakpoint': 'screen and (max-width: 768px)',
        'small-height-breakpoint': 'screen and (max-height: 360px)',
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
      }
    },
    312005: (e) => {
      e.exports = {
        wrap: 'wrap-Nn3SCuEL',
        icon: 'icon-Nn3SCuEL',
        colorBg: 'colorBg-Nn3SCuEL',
        color: 'color-Nn3SCuEL',
        multicolor: 'multicolor-Nn3SCuEL',
        white: 'white-Nn3SCuEL',
      }
    },
    31188: (e) => {
      e.exports = { button: 'button-BuUjli6L' }
    },
    820835: (e) => {
      e.exports = {
        item: 'item-KdWj36gM',
        withIcon: 'withIcon-KdWj36gM',
        icon: 'icon-KdWj36gM',
        labelRow: 'labelRow-KdWj36gM',
        multiWidth: 'multiWidth-KdWj36gM',
        buttonWrap: 'buttonWrap-KdWj36gM',
        buttonLabel: 'buttonLabel-KdWj36gM',
      }
    },
    380327: (e, t, o) => {
      o.d(t, { ControlGroupContext: () => i })
      const i = o(50959).createContext({
        isGrouped: !1,
        cellState: { isTop: !0, isRight: !0, isBottom: !0, isLeft: !0 },
      })
    },
    718736: (e, t, o) => {
      o.d(t, { useFunctionalRefObject: () => r })
      var i = o(50959),
        n = o(855393)
      function r(e) {
        const t = (0, i.useMemo)(
            () =>
              ((e) => {
                const t = (o) => {
                  e(o), (t.current = o)
                }
                return (t.current = null), t
              })((e) => {
                l.current(e)
              }),
            [],
          ),
          o = (0, i.useRef)(null),
          r = (t) => {
            if (null === t) return s(o.current, t), void (o.current = null)
            o.current !== e && ((o.current = e), s(o.current, t))
          },
          l = (0, i.useRef)(r)
        return (
          (l.current = r),
          (0, n.useIsomorphicLayoutEffect)(() => {
            if (null !== t.current)
              return l.current(t.current), () => l.current(null)
          }, [e]),
          t
        )
      }
      function s(e, t) {
        null !== e && ('function' == typeof e ? e(t) : (e.current = t))
      }
    },
    855393: (e, t, o) => {
      o.d(t, { useIsomorphicLayoutEffect: () => n })
      var i = o(50959)
      function n(e, t) {
        ;('undefined' == typeof window ? i.useEffect : i.useLayoutEffect)(e, t)
      }
    },
    72571: (e, t, o) => {
      o.d(t, { Icon: () => n })
      var i = o(50959)
      const n = i.forwardRef((e, t) => {
        const { icon: o = '', ...n } = e
        return i.createElement('span', {
          ...n,
          ref: t,
          dangerouslySetInnerHTML: { __html: o },
        })
      })
    },
    65160: (e, t, o) => {
      function i(e) {
        const { paddingTop: t, paddingBottom: o } = window.getComputedStyle(e)
        return [t, o].reduce(
          (e, t) => e - Number((t || '').replace('px', '')),
          e.clientHeight,
        )
      }
      function n(e, t = !1) {
        const o = getComputedStyle(e),
          i = [o.height]
        return (
          'border-box' !== o.boxSizing &&
            i.push(
              o.paddingTop,
              o.paddingBottom,
              o.borderTopWidth,
              o.borderBottomWidth,
            ),
          t && i.push(o.marginTop, o.marginBottom),
          i.reduce((e, t) => e + (Number.parseFloat(t) || 0), 0)
        )
      }
      function r(e, t = !1) {
        const o = getComputedStyle(e),
          i = [o.width]
        return (
          'border-box' !== o.boxSizing &&
            i.push(
              o.paddingLeft,
              o.paddingRight,
              o.borderLeftWidth,
              o.borderRightWidth,
            ),
          t && i.push(o.marginLeft, o.marginRight),
          i.reduce((e, t) => e + (Number.parseFloat(t) || 0), 0)
        )
      }
      o.d(t, {
        contentHeight: () => i,
        outerHeight: () => n,
        outerWidth: () => r,
      })
    },
    601198: (e, t, o) => {
      o.d(t, { getTextForTooltip: () => s })
      var i = o(50959)
      const n = (e) => (0, i.isValidElement)(e) && Boolean(e.props.children),
        r = (e) =>
          null == e || 'boolean' == typeof e || '{}' === JSON.stringify(e)
            ? ''
            : e.toString() + ' ',
        s = (e) =>
          Array.isArray(e) || (0, i.isValidElement)(e)
            ? i.Children.toArray(e)
                .reduce((e, t) => {
                  let o = ''
                  return (
                    (o =
                      (0, i.isValidElement)(t) && n(t)
                        ? s(t.props.children)
                        : (0, i.isValidElement)(t) && !n(t)
                          ? ''
                          : r(t)),
                    e.concat(o)
                  )
                }, '')
                .trim()
            : r(e)
    },
    111706: (e, t, o) => {
      function i(e) {
        return 0 === e.detail
      }
      o.d(t, { isKeyboardClick: () => i })
    },
    496818: (e, t, o) => {
      o.d(t, { Draggable: () => l, PointerBackend: () => a })
      var i = o(650151),
        n = o(821205),
        r = o(601227),
        s = o(972535)
      o(165719)
      class l {
        constructor(e) {
          var t, o
          ;(this._helper = null),
            (this._handleDragStart = (e) => {
              var t
              if (null !== this._helper) return
              const o = this._source
              o.classList.add('ui-draggable-dragging')
              const [i, r] = [(0, n.outerWidth)(o), (0, n.outerHeight)(o)]
              ;(this._helper = {
                startTop: Number.parseFloat(o.style.top) || 0,
                startLeft: Number.parseFloat(o.style.left) || 0,
                nextTop: null,
                nextLeft: null,
                raf: null,
                size: [i, r],
                containment:
                  this._containment instanceof HTMLElement
                    ? [
                        Number.parseInt(
                          getComputedStyle(this._containment).borderLeftWidth,
                        ) +
                          Number.parseInt(
                            getComputedStyle(this._containment).paddingLeft,
                          ),
                        Number.parseInt(
                          getComputedStyle(this._containment).borderTopWidth,
                        ) +
                          Number.parseInt(
                            getComputedStyle(this._containment).paddingTop,
                          ),
                        this._containment.offsetWidth -
                          Number.parseInt(
                            getComputedStyle(this._containment)
                              .borderRightWidth,
                          ) -
                          Number.parseInt(
                            getComputedStyle(this._containment).paddingRight,
                          ) -
                          Number.parseInt(getComputedStyle(o).marginLeft) -
                          Number.parseInt(getComputedStyle(o).marginRight) -
                          i,
                        this._containment.offsetHeight -
                          Number.parseInt(
                            getComputedStyle(this._containment)
                              .borderBottomWidth,
                          ) -
                          Number.parseInt(
                            getComputedStyle(this._containment).paddingBottom,
                          ) -
                          Number.parseInt(getComputedStyle(o).marginTop) -
                          Number.parseInt(getComputedStyle(o).marginBottom) -
                          r,
                      ]
                    : 'window' === this._containment
                      ? [
                          window.scrollX,
                          window.scrollY,
                          window.scrollX +
                            document.documentElement.offsetWidth -
                            i,
                          window.scrollY +
                            document.documentElement.offsetHeight -
                            r,
                        ]
                      : null,
              }),
                null === (t = this._start) || void 0 === t || t.call(this)
            }),
            (this._handleDragMove = (e) => {
              var t
              if (null === this._helper) return
              const { current: o, initial: i } = e.detail,
                n = this._source,
                r = this._helper.nextTop,
                s = this._helper.nextLeft,
                l = 'y' === this._axis || !1 === this._axis || 0 !== o.movementY
              if (l) {
                const e = this._helper.startTop
                isFinite(e) &&
                  (this._helper.nextTop = o.clientY - i.clientY + e)
              }
              const a =
                'x' === this._axis || !1 === this._axis || 0 !== o.movementY
              if (a) {
                const e = this._helper.startLeft
                isFinite(e) &&
                  (this._helper.nextLeft = o.clientX - i.clientX + e)
              }
              if (null !== this._helper.containment) {
                const [e, t, o, i] = this._helper.containment
                l &&
                  this._helper.nextTop &&
                  ((this._helper.nextTop = Math.min(this._helper.nextTop, i)),
                  (this._helper.nextTop = Math.max(this._helper.nextTop, t))),
                  a &&
                    this._helper.nextLeft &&
                    ((this._helper.nextLeft = Math.min(
                      this._helper.nextLeft,
                      o,
                    )),
                    (this._helper.nextLeft = Math.max(
                      this._helper.nextLeft,
                      e,
                    )))
              }
              null !== this._helper.raf ||
                (r === this._helper.nextTop && s === this._helper.nextLeft) ||
                (this._helper.raf = requestAnimationFrame(() => {
                  null !== this._helper &&
                    (null !== this._helper.nextTop &&
                      ((n.style.top = this._helper.nextTop + 'px'),
                      (this._helper.nextTop = null)),
                    null !== this._helper.nextLeft &&
                      ((n.style.left = this._helper.nextLeft + 'px'),
                      (this._helper.nextLeft = null)),
                    (this._helper.raf = null))
                })),
                null === (t = this._drag) || void 0 === t || t.call(this)
            }),
            (this._handleDragStop = (e) => {
              var t
              if (null === this._helper) return
              this._source.classList.remove('ui-draggable-dragging'),
                (this._helper = null),
                null === (t = this._stop) || void 0 === t || t.call(this)
            })
          const i = (this._source = e.source)
          i.classList.add('ui-draggable')
          const r = (this._handle =
            null !== (t = e.handle ? i.querySelector(e.handle) : null) &&
            void 0 !== t
              ? t
              : i)
          r.classList.add('ui-draggable-handle'),
            (this._start = e.start),
            (this._stop = e.stop),
            (this._drag = e.drag),
            (this._backend = new a({
              handle: r,
              onDragStart: this._handleDragStart,
              onDragMove: this._handleDragMove,
              onDragStop: this._handleDragStop,
            })),
            (this._axis = null !== (o = e.axis) && void 0 !== o && o),
            (this._containment = e.containment)
        }
        destroy() {
          const e = this._source
          e.classList.remove('ui-draggable'),
            e.classList.remove('ui-draggable-dragging')
          this._handle.classList.remove('ui-draggable-handle'),
            this._backend.destroy(),
            null !== this._helper &&
              (this._helper.raf && cancelAnimationFrame(this._helper.raf),
              (this._helper = null))
        }
      }
      class a {
        constructor(e) {
          ;(this._initial = null),
            (this._handlePointerDown = (e) => {
              if (null !== this._initial) return
              if (
                !(
                  e.target instanceof Element && this._handle.contains(e.target)
                )
              )
                return
              if (
                ((this._initial = e),
                !this._dispatchEvent(
                  this._createEvent('pointer-drag-start', e),
                ))
              )
                return void (this._initial = null)
              e.preventDefault()
              const t = this._getEventTarget()
              t.addEventListener('pointermove', this._handlePointerMove),
                t.addEventListener('pointerup', this._handlePointerUp),
                t.addEventListener('pointercancel', this._handlePointerUp),
                t.addEventListener('lostpointercapture', this._handlePointerUp),
                t.setPointerCapture(e.pointerId)
            }),
            (this._handlePointerMove = (e) => {
              null !== this._initial &&
                this._initial.pointerId === e.pointerId &&
                (e.preventDefault(),
                this._dispatchEvent(this._createEvent('pointer-drag-move', e)))
            }),
            (this._handlePointerUp = (e) => {
              if (
                null === this._initial ||
                this._initial.pointerId !== e.pointerId
              )
                return
              e.preventDefault()
              const t = this._getEventTarget()
              t.removeEventListener('pointermove', this._handlePointerMove),
                t.removeEventListener('pointerup', this._handlePointerUp),
                t.removeEventListener('pointercancel', this._handlePointerUp),
                t.removeEventListener(
                  'lostpointercapture',
                  this._handlePointerUp,
                ),
                t.releasePointerCapture(this._initial.pointerId),
                this._dispatchEvent(this._createEvent('pointer-drag-stop', e)),
                (this._initial = null)
            })
          const t = (this._handle = e.handle)
          ;(this._onDragStart = e.onDragStart),
            (this._onDragMove = e.onDragMove),
            (this._onDragStop = e.onDragStop),
            (t.style.touchAction = 'none')
          this._getEventTarget().addEventListener(
            'pointerdown',
            this._handlePointerDown,
          )
        }
        destroy() {
          this._handle.style.touchAction = ''
          const e = this._getEventTarget()
          e.removeEventListener('pointerdown', this._handlePointerDown),
            e.removeEventListener('pointermove', this._handlePointerMove),
            e.removeEventListener('pointerup', this._handlePointerUp),
            e.removeEventListener('pointercancel', this._handlePointerUp),
            e.removeEventListener('lostpointercapture', this._handlePointerUp),
            null !== this._initial &&
              (e.releasePointerCapture(this._initial.pointerId),
              (this._initial = null))
        }
        _getEventTarget() {
          return r.CheckMobile.iOS() || ((0, r.isMac)() && s.touch)
            ? window.document.documentElement
            : this._handle
        }
        _dispatchEvent(e) {
          switch (e.type) {
            case 'pointer-drag-start':
              this._onDragStart(e)
              break
            case 'pointer-drag-move':
              this._onDragMove(e)
              break
            case 'pointer-drag-stop':
              this._onDragStop(e)
          }
          return !e.defaultPrevented
        }
        _createEvent(e, t) {
          return (
            (0, i.assert)(null !== this._initial),
            new CustomEvent(e, {
              bubbles: !0,
              cancelable: !0,
              detail: { backend: this, initial: this._initial, current: t },
            })
          )
        }
      }
    },
    821205: (e, t, o) => {
      o.d(t, {
        contentHeight: () => n.contentHeight,
        html: () => r,
        outerHeight: () => n.outerHeight,
        outerWidth: () => n.outerWidth,
        position: () => l,
      })
      var i = o(650151),
        n = o(65160)
      function r(e, t) {
        return (
          void 0 === t ||
            (null === t && (e.innerHTML = ''),
            ('string' != typeof t && 'number' != typeof t) ||
              (e.innerHTML = String(t))),
          e
        )
      }
      function s(e) {
        if (!e.getClientRects().length) return { top: 0, left: 0 }
        const t = e.getBoundingClientRect(),
          o = (0, i.ensureNotNull)(e.ownerDocument.defaultView)
        return { top: t.top + o.pageYOffset, left: t.left + o.pageXOffset }
      }
      function l(e) {
        const t = getComputedStyle(e)
        let o,
          i = { top: 0, left: 0 }
        if ('fixed' === t.position) o = e.getBoundingClientRect()
        else {
          o = s(e)
          const t = e.ownerDocument
          let n = e.offsetParent || t.documentElement
          while (
            n &&
            (n === t.body || n === t.documentElement) &&
            'static' === getComputedStyle(n).position
          )
            n = n.parentElement
          n &&
            n !== e &&
            1 === n.nodeType &&
            ((i = s(n)),
            (i.top += Number.parseFloat(getComputedStyle(n).borderTopWidth)),
            (i.left += Number.parseFloat(getComputedStyle(n).borderLeftWidth)))
        }
        return {
          top: o.top - i.top - Number.parseFloat(t.marginTop),
          left: o.left - i.left - Number.parseFloat(t.marginLeft),
        }
      }
    },
    996038: (e, t, o) => {
      o.d(t, { DialogBreakpoints: () => n })
      var i = o(488803)
      const n = {
        SmallHeight: i['small-height-breakpoint'],
        TabletSmall: i['tablet-small-breakpoint'],
        TabletNormal: i['tablet-normal-breakpoint'],
      }
    },
    523847: (e, t, o) => {
      o.d(t, { ColorPickerButton: () => _ })
      var i = o(50959),
        n = o(497754),
        r = o.n(n),
        s = o(650151),
        l = o(72571),
        a = o(724377),
        c = o(32240),
        h = o(206397),
        d = o(972646),
        p = o(860184),
        u = o(518799),
        g = o(834297),
        m = o(476853),
        v = o(312005)
      function _(e) {
        const {
            property: t,
            icon: o,
            propertyApplier: n,
            title: _,
            undoText: w,
            isToolbarFixed: f,
            className: T,
          } = e,
          y = (0, g.useProperty)(t),
          b = (0, i.useRef)(null),
          L = y ? (0, a.parseRgba)(y)[3] : void 0,
          x = '' === y,
          C = String(A()).toLowerCase() === p.white,
          [S, E, P] = (0, h.useCustomColors)()
        return i.createElement(
          u.ToolWidgetMenu,
          {
            className: T,
            verticalDropDirection: f
              ? m.VerticalDropDirection.FromBottomToTop
              : void 0,
            horizontalDropDirection: f
              ? m.HorizontalDropDirection.FromLeftToRight
              : void 0,
            horizontalAttachEdge: f ? m.HorizontalAttachEdge.Left : void 0,
            verticalAttachEdge: f ? m.VerticalAttachEdge.Top : void 0,
            content: i.createElement(
              'div',
              { className: v.wrap },
              i.createElement(l.Icon, { className: v.icon, icon: o }),
              i.createElement(
                'div',
                { className: v.colorBg },
                i.createElement('div', {
                  className: r()(v.color, x && v.multicolor, C && v.white),
                  style: x ? void 0 : { backgroundColor: y },
                }),
              ),
            ),
            arrow: !1,
            title: _,
            ref: b,
            'data-name': e['data-name'],
            menuDataName: `${e['data-name']}-menu`,
          },
          i.createElement(d.ColorPicker, {
            color: A(),
            opacity: L,
            onColorChange: (e, t) => {
              const o = y
                ? (0, c.alphaToTransparency)((0, a.parseRgba)(y)[3])
                : 0
              M((0, c.generateColor)(String(e), o, true)),
                t || (0, s.ensureNotNull)(b.current).close()
            },
            onOpacityChange: (e) => {
              M((0, c.generateColor)(y, (0, c.alphaToTransparency)(e), !0))
            },
            selectOpacity: void 0 !== L,
            selectCustom: !0,
            customColors: S,
            onAddColor: (e) => {
              E(e), (0, s.ensureNotNull)(b.current).close()
            },
            onRemoveCustomColor: P,
          }),
        )
        function A() {
          return y ? (0, a.rgbToHexString)((0, a.parseRgb)(y)) : null
        }
        function M(e) {
          n.setProperty(t, e, w)
        }
      }
    },
    822598: (e, t, o) => {
      o.d(t, { LineWidthButton: () => T })
      var i = o(50959),
        n = o(497754),
        r = o(650151),
        s = o(72571),
        l = o(518799),
        a = o(834297),
        c = o(192063),
        h = o(493173),
        d = o(476853),
        p = o(222978),
        u = o(114631),
        g = o(206096),
        m = o(206483),
        v = o(266611),
        _ = o(820835)
      const w = (0, h.mergeThemes)(c.DEFAULT_POPUP_MENU_ITEM_THEME, _),
        f = [
          { value: 1, icon: p },
          { value: 2, icon: u },
          { value: 3, icon: g },
          { value: 4, icon: m },
        ]
      function T(e) {
        const {
            multipleProperty: t,
            title: o,
            undoText: h,
            propertyApplier: p,
            isToolbarFixed: u,
            className: g,
            isSmallScreen: m,
          } = e,
          T = (0, a.useProperty)((0, r.ensureDefined)(t)),
          y = 'mixed' === T || !T,
          b = ((e) => {
            const t = f.find((t) => t.value === e)
            if (!t) return v
            return t.icon
          })(T)
        return i.createElement(
          l.ToolWidgetMenu,
          {
            className: g,
            arrow: !1,
            title: o,
            'data-name': e['data-name'],
            menuDataName: `${e['data-name']}-menu`,
            verticalDropDirection: u
              ? d.VerticalDropDirection.FromBottomToTop
              : void 0,
            horizontalDropDirection: u
              ? d.HorizontalDropDirection.FromRightToLeft
              : void 0,
            horizontalAttachEdge: u ? d.HorizontalAttachEdge.Right : void 0,
            verticalAttachEdge: u ? d.VerticalAttachEdge.Top : void 0,
            content: i.createElement(
              'div',
              null,
              y
                ? i.createElement(
                    'div',
                    { className: _.multiWidth },
                    i.createElement(s.Icon, { icon: v }),
                  )
                : i.createElement(
                    'div',
                    { className: _.buttonWrap },
                    !m && i.createElement(s.Icon, { icon: b }),
                    i.createElement(
                      'div',
                      { className: n(!m && _.buttonLabel) },
                      `${T}px`,
                    ),
                  ),
            ),
          },
          f.map(({ value: e, icon: t }) =>
            i.createElement(c.PopupMenuItem, {
              key: e,
              theme: w,
              label: `${e}px`,
              icon: t,
              isActive: e === T,
              onClick: L,
              onClickArg: e,
            }),
          ),
        )
        function L(e) {
          e &&
            t &&
            (p.beginUndoMacro(h),
            t.setValue(e, void 0, {
              applyValue: (e, t) => {
                p.setProperty(e, t, h)
              },
            }),
            p.endUndoMacro())
        }
      }
    },
    834297: (e, t, o) => {
      o.d(t, { useProperty: () => n })
      var i = o(50959)
      const n = (e) => {
        const [t, o] = (0, i.useState)(e.value())
        return (
          (0, i.useEffect)(() => {
            const t = (e) => {
              o(e.value())
            }
            t(e)
            const i = {}
            return e.subscribe(i, t), () => e.unsubscribe(i, t)
          }, [e]),
          t
        )
      }
    },
    190266: (e, t, o) => {
      o.d(t, { runOrSignIn: () => i, runOrSignInWithPromo: () => n })
      function i(e, t) {
        e()
      }
      function n(e, t, o) {
        o()
      }
    },
    313739: (e, t, o) => {
      o.d(t, { MatchMediaMap: () => s })
      var i = o(50959),
        n = o(266783),
        r = o.n(n)
      class s extends i.Component {
        constructor(e) {
          super(e),
            (this._handleMediaChange = () => {
              const e = a(this.state.queries, (e, t) => t.matches)
              let t = !1
              for (const o in e)
                if (Object.hasOwn(e, o) && this.state.matches[o] !== e[o]) {
                  t = !0
                  break
                }
              t && this.setState({ matches: e })
            })
          const { rules: t } = this.props
          this.state = l(t)
        }
        shouldComponentUpdate(e, t) {
          return (
            !r()(e, this.props) ||
            !r()(t.rules, this.state.rules) ||
            !r()(t.matches, this.state.matches)
          )
        }
        componentDidMount() {
          this._migrate(null, this.state.queries)
        }
        componentDidUpdate(e, t) {
          r()(e.rules, this.props.rules) ||
            this._migrate(t.queries, this.state.queries)
        }
        componentWillUnmount() {
          this._migrate(this.state.queries, null)
        }
        render() {
          return this.props.children(this.state.matches)
        }
        static getDerivedStateFromProps(e, t) {
          if (r()(e.rules, t.rules)) return null
          const { rules: o } = e
          return l(o)
        }
        _migrate(e, t) {
          null !== e &&
            a(e, (e, t) => {
              t.removeListener(this._handleMediaChange)
            }),
            null !== t &&
              a(t, (e, t) => {
                t.addListener(this._handleMediaChange)
              })
        }
      }
      function l(e) {
        const t = a(e, (e, t) => window.matchMedia(t))
        return {
          queries: t,
          matches: a(t, (e, t) => t.matches),
          rules: { ...e },
        }
      }
      function a(e, t) {
        const o = {}
        for (const i in e) Object.hasOwn(e, i) && (o[i] = t(i, e[i]))
        return o
      }
    },
    493173: (e, t, o) => {
      function i(e, t, o = {}) {
        return Object.assign(
          {},
          e,
          ((e, t, o = {}) => {
            const i = Object.assign({}, t)
            for (const n of Object.keys(t)) {
              const r = o[n] || n
              r in e && (i[n] = [e[r], t[n]].join(' '))
            }
            return i
          })(e, t, o),
        )
      }
      o.d(t, { mergeThemes: () => i })
    },
    154784: (e) => {
      e.exports = {
        button: 'button-KTgbfaP5',
        hover: 'hover-KTgbfaP5',
        clicked: 'clicked-KTgbfaP5',
        bg: 'bg-KTgbfaP5',
        icon: 'icon-KTgbfaP5',
        isActive: 'isActive-KTgbfaP5',
        isTransparent: 'isTransparent-KTgbfaP5',
        isGrayed: 'isGrayed-KTgbfaP5',
        isHidden: 'isHidden-KTgbfaP5',
        accessible: 'accessible-KTgbfaP5',
      }
    },
    502869: (e) => {
      e.exports = { button: 'button-xNqEcuN2' }
    },
    864549: (e, t, o) => {
      o.d(t, { ToolButton: () => l })
      var i = o(50959),
        n = o(497754),
        r = o(72571),
        s = o(154784)
      const l = (0, i.forwardRef)((e, t) => {
        const {
            id: o,
            activeClass: l,
            children: a,
            className: c,
            icon: h,
            isActive: d,
            isGrayed: p,
            isHidden: u,
            isTransparent: g,
            theme: m = s,
            onClick: v,
            onKeyDown: _,
            buttonHotKey: w,
            tooltipPosition: f = 'vertical',
            tag: T = 'div',
            tabIndex: y,
            tooltip: b,
            ...L
          } = e,
          x = 'button' === e.tag
        return i.createElement(
          T,
          {
            'aria-label': x ? b : void 0,
            ...L,
            id: o,
            type: x ? 'button' : void 0,
            className: n(
              m.button,
              c,
              d && l,
              {
                'apply-common-tooltip': Boolean(b),
                'common-tooltip-vertical': Boolean(b) && 'vertical' === f,
                [m.isActive]: d,
                [m.isGrayed]: p,
                [m.isHidden]: u,
                [m.isTransparent]: g,
              },
              x && m.accessible,
            ),
            onClick: v,
            onKeyDown: _,
            'data-role': x ? void 0 : 'button',
            ref: t,
            tabIndex: y,
            'data-tooltip-hotkey': w,
            'aria-pressed': x ? d : void 0,
            'data-tooltip': b,
          },
          i.createElement(
            'div',
            { className: m.bg },
            h &&
              ('string' == typeof h
                ? i.createElement(r.Icon, { className: m.icon, icon: h })
                : i.createElement('span', { className: m.icon }, h)),
            a,
          ),
        )
      })
    },
    395907: (e, t, o) => {
      o.d(t, { ToolWidgetIconButton: () => l })
      var i = o(50959),
        n = o(497754),
        r = o(747633),
        s = o(502869)
      const l = i.forwardRef((e, t) => {
        const { className: o, id: l, ...a } = e
        return i.createElement(r.ToolWidgetButton, {
          id: l,
          'data-name': l,
          ...a,
          ref: t,
          className: n(o, s.button),
        })
      })
    },
    679112: (e, t, o) => {
      o.d(t, { drawingToolsIcons: () => i })
      const i = {
        SyncDrawing: o(299088),
        arrow: o(363743),
        cursor: o(418953),
        dot: o(372196),
        performance: '',
        drawginmode: o(53950),
        drawginmodeActive: o(401532),
        eraser: o(927999),
        group: o(134059),
        hideAllDrawings: o(245820),
        hideAllDrawingsActive: o(484959),
        hideAllIndicators: o(842321),
        hideAllIndicatorsActive: o(875895),
        hideAllDrawingTools: o(193756),
        hideAllDrawingToolsActive: o(842650),
        hideAllPositionsTools: o(157313),
        hideAllPositionsToolsActive: o(265162),
        lockAllDrawings: o(691244),
        lockAllDrawingsActive: o(665186),
        magnet: o(268385),
        heart: o(10862),
        smile: o(507636),
        sticker: o(662567),
        strongMagnet: o(146049),
        measure: o(688518),
        removeAllDrawingTools: o(535149),
        showObjectsTree: o(36515),
        zoom: o(6894),
        'zoom-out': o(745360),
      }
    },
    800756: (e, t, o) => {
      o.r(t), o.d(t, { FavoriteDrawingToolbar: () => m })
      var i = o(609838),
        n = o(43066),
        r = o(110495),
        s = (o(650151), o(98454)),
        l = o(973602),
        a = o(462056),
        c = o(683471),
        h = o(526122),
        d = o(870122),
        p = o(131595),
        u = o(650802),
        g = o(919577)
      o(70132)
      class m extends n.FloatingToolbar {
        constructor(e) {
          super({
            dragOnlyInsideToolbar: !0,
            defaultPosition: e,
            positionSettingsKey: 'chart.favoriteDrawingsPosition',
            positionStorageType: 'device',
          }),
            (this._linetoolsWidgets = {}),
            (this._canBeShownValue = new u.WatchedValue(!1)),
            this._attachHandlers(),
            this._loadVisibilityState(),
            (this._hideAction = this._createHideToolbarAction())
        }
        show() {
          this._canBeShownValue.value() &&
            (this.isVisible() || this._renderAllLinetools(), super.show())
        }
        showAndSaveSettingsValue() {
          this._canBeShownValue.value() &&
            (p.TVLocalStorage.setItem(
              'ChartFavoriteDrawingToolbarWidget.visible',
              'true',
            ),
            this.show())
        }
        hideAndSaveSettingsValue() {
          p.TVLocalStorage.setItem(
            'ChartFavoriteDrawingToolbarWidget.visible',
            'false',
          ),
            this.hide()
        }
        canBeShown() {
          return this._canBeShownValue.readonly()
        }
        _onFavoriteAdded(e) {
          this.addWidget(this._createLinetoolWidget(e)),
            r.LinetoolsFavoritesStore.favorites().filter(v).length > 0 &&
              (this._canBeShownValue.setValue(!0),
              this.showAndSaveSettingsValue())
        }
        _onFavoriteRemoved(e) {
          this.removeWidget(this._linetoolsWidgets[e]),
            delete this._linetoolsWidgets[e],
            0 === r.LinetoolsFavoritesStore.favorites().filter(v).length &&
              (this._canBeShownValue.setValue(!1), this.hide())
        }
        _onFavoriteMoved() {
          this._renderAllLinetools()
        }
        _onSelectedLinetoolChanged(e) {
          Object.keys(this._linetoolsWidgets).forEach((t) => {
            this._linetoolsWidgets[t].classList.toggle('i-active', e === t)
          })
        }
        _createLinetoolWidget(e) {
          const t = `<span class="tv-favorited-drawings-toolbar__widget apply-common-tooltip ${e === c.tool.value() ? 'i-active' : ''}" title="${h.lineToolsInfo[e].localizedName}" data-name="FavoriteToolbar${e}">${h.lineToolsInfo[e].icon}</span>`,
            o = (0, s.parseHtmlElement)(t)
          return (
            o.addEventListener('click', async (t) => {
              t.preventDefault(),
                await (0, g.initLineTool)(e),
                c.tool.value() !== e && c.tool.setValue(e)
            }),
            (this._linetoolsWidgets[e] = o),
            o
          )
        }
        _renderAllLinetools() {
          ;(this._linetoolsWidgets = {}),
            this.removeWidgets(),
            r.LinetoolsFavoritesStore.favorites()
              .filter((e) => h.lineToolsInfo[e] && !0)
              .forEach((e) => {
                this.addWidget(this._createLinetoolWidget(e))
              })
        }
        _attachHandlers() {
          r.LinetoolsFavoritesStore.favoriteAdded.subscribe(
            this,
            this._onFavoriteAdded,
          ),
            r.LinetoolsFavoritesStore.favoriteRemoved.subscribe(
              this,
              this._onFavoriteRemoved,
            ),
            r.LinetoolsFavoritesStore.favoriteMoved.subscribe(
              this,
              this._onFavoriteMoved,
            ),
            r.LinetoolsFavoritesStore.favoritesSynced.subscribe(null, () => {
              this._loadVisibilityState(), this._renderAllLinetools()
            }),
            this.onContextMenu((e) => {
              e.preventDefault(),
                a.ContextMenuManager.showMenu([this._hideAction], e)
            }),
            c.tool.subscribe(this._onSelectedLinetoolChanged.bind(this))
        }
        _createHideToolbarAction() {
          return new l.Action({
            actionId: 'Chart.FavoriteDrawingToolsToolbar.Hide',
            options: {
              label: i.t(null, void 0, o(574813)),
              onExecute: () => {
                this.hideAndSaveSettingsValue()
              },
            },
          })
        }
        _loadVisibilityState() {
          const e = r.LinetoolsFavoritesStore.favorites().filter(v).length > 0
          this._canBeShownValue.setValue(e)
          const t = r.LinetoolsFavoritesStore.favoritesCount() > 0
          let o
          const i = d.getValue('ChartFavoriteDrawingToolbarWidget.visible')
          void 0 !== i
            ? (d.remove('ChartFavoriteDrawingToolbarWidget.visible', {
                forceFlush: !0,
              }),
              (o = 'false' !== i),
              p.TVLocalStorage.setItem(
                'ChartFavoriteDrawingToolbarWidget.visible',
                i,
              ))
            : (o =
                'false' !==
                p.TVLocalStorage.getItem(
                  'ChartFavoriteDrawingToolbarWidget.visible',
                )),
            o && t ? this.show() : this.hide()
        }
      }
      function v(e) {
        return !0
      }
    },
    43066: (e, t, o) => {
      o.d(t, {
        FLOATING_TOOLBAR_REACT_WIDGETS_CLASS: () => g,
        FloatingToolbar: () => v,
      })
      var i = o(370981),
        n = o(972535),
        r = o(49630),
        s = o(870122),
        l = o(650802),
        a = o(181370)
      class c extends a.ChunkLoader {
        _startLoading() {
          return Promise.all([o.e(1553), o.e(2377)])
            .then(o.bind(o, 177525))
            .then((e) => e.HammerJS)
        }
      }
      var h = o(131595),
        d = o(496818),
        p = o(98454),
        u = o(25388)
      o(419619)
      const g = 'floating-toolbar-react-widgets',
        m = `<div class="tv-floating-toolbar i-closed i-hidden"><div class="tv-floating-toolbar__widget-wrapper"><div class="tv-floating-toolbar__drag js-drag">${u}</div><div class="tv-floating-toolbar__content js-content"></div><div class="${g}"></div></div></div>`
      class v {
        constructor(e) {
          ;(this._widget = document.createElement('div')),
            (this._isVertical = !1),
            (this._hiddingTimeoutId = null),
            (this._visibility = new l.WatchedValue(!1)),
            (this._windowResizeListener = this._onWindowResize.bind(this)),
            (this._responsiveResizeFunction = null),
            (this._showTimeStamp = null),
            (this._draggable = null),
            (this._preventClickUntilAnimation = (e) => {
              null !== this._showTimeStamp &&
                performance.now() - this._showTimeStamp < this.hideDuration() &&
                e.stopPropagation()
            }),
            v._toolbars.push(this),
            (this._options = e),
            (this._widget = (0, p.parseHtmlElement)(m)),
            (this._content = this._widget
              .getElementsByClassName('js-content')
              .item(0)),
            (this._reactWidgetsContainer = this._widget
              .getElementsByClassName(g)
              .item(0)),
            this._setZIndex(v._startZIndex + v._toolbars.length - 1),
            this._options.addClass &&
              (this._widget.className += ` ${this._options.addClass}`),
            this._options['data-name'] &&
              (this._widget.dataset.name = this._options['data-name']),
            this._options.layout &&
              'auto' !== this._options.layout &&
              ((this._isVertical = 'vertical' === this._options.layout),
              this._updateLayoutType()),
            this._widget.addEventListener(
              'click',
              this._preventClickUntilAnimation,
              !0,
            )
        }
        destroy() {
          this.hide(!0),
            v._toolbars.splice(v._toolbars.indexOf(this), 1),
            this._widget.removeEventListener(
              'click',
              this._preventClickUntilAnimation,
              !0,
            ),
            document.body.contains(this._widget) &&
              document.body.removeChild(this._widget),
            null !== this._draggable && this._draggable.destroy(),
            (this._widget.innerHTML = ''),
            (this._responsiveResizeFunction = null)
        }
        setResponsiveResizeFunc(e) {
          this._responsiveResizeFunction = e
        }
        isVisible() {
          return this._visibility.value()
        }
        visibility() {
          return this._visibility.readonly()
        }
        isVertical() {
          return this._isVertical
        }
        show() {
          this.isVisible() ||
            (document.body.contains(this._widget) ||
              (this._init(), document.body.appendChild(this._widget)),
            this._setHiddingTimeout(null),
            window.addEventListener('resize', this._windowResizeListener),
            this.raise(),
            this._visibility.setValue(!0),
            (this._showTimeStamp = performance.now()),
            this._widget.classList.contains('i-hidden')
              ? (this._widget.classList.remove('i-hidden'),
                setTimeout(() => {
                  this.isVisible() && this._widget.classList.remove('i-closed')
                }))
              : this._widget.classList.remove('i-closed'),
            this._onWindowResize())
        }
        hide(e = !1) {
          if (!this.isVisible()) return
          const t = this._widget.classList.contains('i-closed')
          if (
            (this._widget.classList.add('i-closed'),
            this._visibility.setValue(!1),
            e || t)
          )
            this._setHiddingTimeout(null),
              this._widget.classList.add('i-hidden')
          else {
            const e = setTimeout(() => {
              this._setHiddingTimeout(null),
                this._widget.classList.add('i-hidden')
            }, this.hideDuration())
            this._setHiddingTimeout(e)
          }
          window.removeEventListener('resize', this._windowResizeListener)
        }
        raise() {
          v._toolbars.length + v._startZIndex !== this._zIndex() &&
            (v._toolbars.splice(v._toolbars.indexOf(this), 1),
            v._toolbars.push(this),
            v._updateAllZIndexes())
        }
        hideDuration() {
          return 0.75 * r.dur
        }
        addWidget(e, t = {}) {
          const o = this.widgetsCount()
          if ((void 0 === t.index && (t.index = o), t.index < 0 || t.index > o))
            throw new Error(`Index must be in [0, ${o}]`)
          const i = document.createElement('div')
          ;(i.className = 'tv-floating-toolbar__widget js-widget'),
            i.appendChild(e)
          const n =
            t.index === o ? null : this._content.childNodes.item(t.index)
          this._content.insertBefore(i, n), this._onWindowResize()
        }
        getReactWidgetContainer() {
          return this._reactWidgetsContainer
        }
        removeWidget(e) {
          const t = this._findWrapperForWidget(e)
          t && (this._content.removeChild(t), this._onWindowResize())
        }
        widgetsCount() {
          return this._content.childNodes.length
        }
        showWidget(e) {
          const t = this._findWrapperForWidget(e)
          t && t.classList.remove('i-hidden')
        }
        hideWidget(e) {
          const t = this._findWrapperForWidget(e)
          t && t.classList.add('i-hidden')
        }
        removeWidgets() {
          while (this._content.firstChild)
            this._content.removeChild(this._content.firstChild)
          this._onWindowResize()
        }
        onContextMenu(e) {
          if (n.mobiletouch) {
            new c().load().then((t) => {
              const o = new t(this._widget)
              o.get('press').set({ time: 500 }),
                o.on('press', (t) => {
                  this._preventWidgetTouchEndEvent(), e(t.srcEvent)
                })
            })
          } else this._widget.addEventListener('contextmenu', e)
        }
        checkPosition() {
          const e = this._getCorrectedWidgetRect(),
            t = { left: e.left, top: e.top }
          this._correctPosition(t),
            (e.left === t.left && e.top === t.top) ||
              ((this._widget.style.left = t.left + 'px'),
              (this._widget.style.top = t.top + 'px'))
        }
        _determineCurrentLayoutVertical(e) {
          const t = this._isVertical ? e.height : e.width
          return window.innerWidth < t && window.innerWidth < window.innerHeight
        }
        _getWidget() {
          return this._widget
        }
        _findWrapperForWidget(e) {
          const t = this._content.getElementsByClassName('js-widget')
          for (let o = 0; o < t.length; ++o) {
            const i = t.item(o)
            if (i.contains(e)) return i
          }
          return null
        }
        _onVerticalChanged(e, t) {}
        _correctPosition(e) {
          const t = this._getCorrectedWidgetRect(),
            o = this._getSavedPosition(),
            i = window.innerWidth - t.right,
            n = window.innerHeight - t.bottom
          i < 0
            ? (e.left = Math.max(0, window.innerWidth - t.width))
            : o && o.left > e.left && (e.left = Math.min(e.left + i, o.left)),
            n < 0
              ? (e.top = Math.max(0, window.innerHeight - t.height))
              : o && o.top > e.top && (e.top = Math.min(e.top + n, o.top))
        }
        _getCorrectedWidgetRect() {
          const e = this._widget.getBoundingClientRect()
          if (this._widget.classList.contains('i-closed')) {
            const t = 1 / 0.925 - 1,
              o = e.width * t,
              i = e.height * t
            return {
              bottom: e.bottom + i / 2,
              height: e.height + i,
              left: e.left - o / 2,
              right: e.right + o / 2,
              top: e.top - i / 2,
              width: e.width + o,
            }
          }
          return e
        }
        _getSavedPosition() {
          var e
          let t
          if ('device' === this._options.positionStorageType) {
            const e = h.TVLocalStorage.getItem(
              this._options.positionSettingsKey,
            )
            t = null !== e ? JSON.parse(e) : null
          } else
            t =
              null !==
                (e = (0, s.getJSON)(this._options.positionSettingsKey)) &&
              void 0 !== e
                ? e
                : null
          return null !== t && 'top' in t && 'left' in t ? t : null
        }
        _setHiddingTimeout(e) {
          null !== this._hiddingTimeoutId &&
            clearTimeout(this._hiddingTimeoutId),
            (this._hiddingTimeoutId = e)
        }
        _preventWidgetTouchEndEvent() {
          const e = (t) => {
            t.preventDefault(), this._widget.removeEventListener('touchend', e)
          }
          this._widget.addEventListener('touchend', e)
        }
        _updateLayoutType() {
          this._widget.classList.toggle('i-vertical', this._isVertical)
        }
        _onWindowResize() {
          if ('auto' === (this._options.layout || 'auto')) {
            const e = this._isVertical,
              t = this._getCorrectedWidgetRect()
            ;(this._isVertical = this._determineCurrentLayoutVertical(t)),
              this._updateLayoutType(),
              e !== this._isVertical &&
                this._onVerticalChanged(this._isVertical, e)
          }
          this.checkPosition(), this._resizeResponsive()
        }
        _resizeResponsive() {
          if (null === this._responsiveResizeFunction) return
          let e = this._options.layout || 'auto'
          'auto' === e && (e = this._isVertical ? 'vertical' : 'horizontal')
          const t =
              'vertical' === e
                ? this._widget.clientHeight
                : this._widget.clientWidth,
            o = ('vertical' === e ? window.innerHeight : window.innerWidth) - t
          this._responsiveResizeFunction(t, o, e)
        }
        _setZIndex(e) {
          this._widget.style.zIndex = String(e)
        }
        _zIndex() {
          return Number(this._widget.style.zIndex)
        }
        _loadPosition() {
          var e
          const t =
            null !== (e = this._getSavedPosition()) && void 0 !== e
              ? e
              : this._options.defaultPosition
          ;(this._widget.style.left = Math.round(t.left) + 'px'),
            (this._widget.style.top = Math.round(t.top) + 'px'),
            this._onWindowResize()
        }
        _savePosition() {
          const e = this._widget.getBoundingClientRect()
          if ('device' === this._options.positionStorageType)
            try {
              h.TVLocalStorage.setItem(
                this._options.positionSettingsKey,
                JSON.stringify({ left: e.left, top: e.top }),
              )
            } catch (e) {}
          else
            (0, s.setJSON)(this._options.positionSettingsKey, {
              left: e.left,
              top: e.top,
            })
        }
        _init() {
          this._loadPosition(),
            (this._draggable = new d.Draggable({
              source: this._widget,
              containment: 'window',
              handle: '.js-drag',
              start: i.globalCloseMenu,
              stop: this._savePosition.bind(this),
            })),
            this._widget.addEventListener('pointerdown', this.raise.bind(this))
        }
        static _updateAllZIndexes() {
          v._toolbars.forEach((e, t) => {
            e._setZIndex(v._startZIndex + t)
          })
        }
      }
      ;(v._startZIndex = 20), (v._toolbars = [])
    },
    875091: (e, t, o) => {
      o.d(t, { LineToolPropertiesWidgetBase: () => Ae })
      var i = o(50959),
        n = o(500962),
        r = o(609838),
        s = o(664902),
        l = o(156963),
        a = o(650802),
        c = o(372605),
        h = o(683471),
        d = o(770366),
        p = o(986790),
        u = o(650151),
        g = o(804550)
      class m extends g.default {
        constructor(e, t, o) {
          super(),
            (this._listenersMappers = []),
            (this._isProcess = !1),
            (this._baseProperty = e),
            (this._propertyApplier = t),
            (this._undoText = o)
        }
        destroy() {
          this._baseProperty.destroy(), super.destroy()
        }
        value() {
          return this._baseProperty.value()
        }
        setValue(e) {
          ;(this._isProcess = !0),
            this._baseProperty.setValue(e, void 0, {
              applyValue: (e, t) =>
                this._propertyApplier.setProperty(e, t, this._undoText),
            }),
            (this._isProcess = !1),
            this._listenersMappers.forEach((e) => {
              e.method.call(e.obj, this, '')
            })
        }
        subscribe(e, t) {
          const o = (o) => {
              this._isProcess || t.call(e, this, '')
            },
            i = { obj: e, method: t, callback: o }
          this._listenersMappers.push(i), this._baseProperty.subscribe(e, o)
        }
        unsubscribe(e, t) {
          var o
          const i = (0, u.ensureDefined)(
            null ===
              (o = this._listenersMappers.find(
                (o) => o.obj === e && o.method === t,
              )) || void 0 === o
              ? void 0
              : o.callback,
          )
          this._baseProperty.unsubscribe(e, i)
        }
        unsubscribeAll(e) {
          this._baseProperty.unsubscribeAll(e)
        }
      }
      var v = o(29742),
        _ = o(497754),
        w = o.n(_),
        f = o(313739),
        T = o(43066),
        y = o(996038)
      const b = T.FLOATING_TOOLBAR_REACT_WIDGETS_CLASS + '__button'
      function L(e) {
        const {
            templateButton: t,
            propertyButtons: o,
            commonButtons: n,
            isDrawingFinished: r,
            isToolbarFixed: s,
            buttonClassName: l,
            activeChartWidget: a,
          } = e,
          c = a.hasModel() && a.model().selection().dataSources()
        return c && c.length
          ? i.createElement(
              f.MatchMediaMap,
              {
                rules: {
                  isSmallWidth: y.DialogBreakpoints.TabletSmall,
                  isSmallHeight: 'screen and (max-height: 430px)',
                },
              },
              ({ isSmallWidth: e, isSmallHeight: t }) =>
                i.createElement(
                  i.Fragment,
                  null,
                  h(),
                  r &&
                    i.createElement(
                      i.Fragment,
                      null,
                      Boolean(o.length) &&
                        o.map((o, n) =>
                          i.createElement(o.component, {
                            ...o.props,
                            key: `${o.props.title}_${n}`,
                            className: w()(b, l),
                            isSmallScreen: e || t,
                            isToolbarFixed: s,
                          }),
                        ),
                      Boolean(n.length) &&
                        n.map((o, n) => {
                          const r = e || t
                          return r
                            ? o.showForSmallScreen
                              ? i.createElement(o.component, {
                                  ...o.props,
                                  isSmallScreen: r,
                                  key: `${o.props.title}_${n}`,
                                  className: w()(b, l),
                                })
                              : null
                            : i.createElement(o.component, {
                                ...o.props,
                                key: `${o.props.title}_${n}`,
                                className: w()(b, l),
                              })
                        }),
                    ),
                ),
            )
          : h()
        function h() {
          return null === t
            ? null
            : i.createElement(t.component, {
                ...t.props,
                isToolbarFixed: s,
                isDrawingFinished: r,
                className: w()(b, l),
              })
        }
      }
      var x = o(32133),
        C = o(395907),
        S = o(561964)
      function E(e) {
        const { title: t, activeChartWidget: o, className: n } = e
        return i.createElement(C.ToolWidgetIconButton, {
          className: n,
          icon: S,
          title: t,
          onClick: async () => {
            ;(0, x.trackEvent)('GUI', 'Context action on drawings', 'Settings')
            const e = o.model().selection().lineDataSources(),
              t = e.length
            1 === t
              ? await o.showChartPropertiesForSource(e[0], void 0, {
                  onWidget: o.onWidget(),
                })
              : t > 1 && (await o.showChartPropertiesForSources({ sources: e }))
          },
          'data-name': 'settings',
        })
      }
      var P = o(834297),
        A = o(864549),
        M = o(31188)
      function z(e) {
        const { className: t, ...o } = e
        return i.createElement(A.ToolButton, {
          className: _(t, M.button),
          tooltipPosition: 'horizontal',
          ...o,
        })
      }
      var B = o(665186),
        D = o(691244)
      function W(e) {
        const { activeChartWidget: t, className: n } = e,
          s = t.model().selection().lineDataSources()
        if (0 === s.length) return null
        const l = s[0].properties().frozen,
          a = (0, P.useProperty)(l),
          c = a
            ? { tooltip: r.t(null, void 0, o(715101)), icon: B }
            : { tooltip: r.t(null, void 0, o(642284)), icon: D }
        return i.createElement(z, {
          className: n,
          isActive: Boolean(a),
          onClick: () => {
            ;(0, x.trackEvent)('GUI', 'Context action on drawings', 'Lock'),
              t.toggleLockSelectedObject()
          },
          'data-name': Boolean(a) ? 'unlock' : 'lock',
          ...c,
        })
      }
      var k = o(535149)
      function N(e) {
        const { title: t, activeChartWidget: o, className: n } = e
        return i.createElement(C.ToolWidgetIconButton, {
          className: n,
          icon: k,
          title: t,
          'data-name': 'remove',
          onClick: () => {
            ;(0, x.trackEvent)('GUI', 'Context action on drawings', 'Remove'),
              o.removeSelectedSources()
          },
        })
      }
      var V = o(72571),
        F = o(804395),
        I = o(972535),
        R = o(518799),
        H = o(800553),
        O = o(462056),
        K = o(367187),
        j = o(180185),
        U = o(376202),
        Z = o(973602),
        G = o(484959)
      function $(e, t) {
        const i = [
            (0, K.createVisualOrderAction)(e, t),
            (0, K.createChangeIntervalsVisibilitiesAction)(e, t),
          ],
          n = ((e, t) => {
            const i = [],
              n = j.isMacKeyboard ? ' +' : '',
              s = t.filter((e) => e.cloneable())
            s.length > 0 &&
              i.push(
                new Z.Action({
                  actionId: 'Chart.LineTool.Clone',
                  options: {
                    name: 'clone',
                    icon: o(636296),
                    shortcutHint:
                      j.humanReadableModifiers(U.Modifiers.Mod) + n + ' Drag',
                    label: r.t(null, void 0, o(552977)),
                    onExecute: () => {
                      e.model().cloneLineTools(s, !1),
                        (0, x.trackEvent)(
                          'GUI',
                          'Context action on drawings',
                          'Clone',
                        )
                    },
                  },
                }),
              )
            const l = t.filter((e) => e.copiable())
            if (l.length > 0) {
              const t = {
                name: 'copy',
                label: r.t(null, void 0, o(35216)),
                shortcutHint:
                  j.humanReadableModifiers(U.Modifiers.Mod) + n + ' C',
                onExecute: () => {
                  e.chartWidgetCollection().clipboard.uiRequestCopy(l)
                },
              }
              i.push(
                new Z.Action({
                  actionId: 'Chart.Clipboard.CopyLineTools',
                  options: t,
                  id: 'Copy',
                }),
              )
            }
            return ((e, t) =>
              !!(null == e ? void 0 : e.isMultipleLayout().value()) &&
              t.some((e) => e.isSynchronizable()))(e, t)
              ? (i.push(...(0, K.createSyncDrawingActions)(e, t)), i)
              : i
          })(e, t)
        return (
          n.length && i.push(new Z.Separator(), ...n),
          i.push(
            new Z.Separator(),
            ((e) =>
              new Z.Action({
                actionId: 'Chart.SelectedObject.Hide',
                options: {
                  label: r.t(null, void 0, o(831971)),
                  icon: G,
                  onExecute: () => {
                    e.hideSelectedObject()
                  },
                  name: 'hide',
                },
              }))(e),
          ),
          i
        )
      }
      var q = o(844996)
      function J(e) {
        const {
            title: t,
            activeChartWidget: o,
            isSmallScreen: n,
            className: r,
          } = e,
          s = o.model().selection().lineDataSources(),
          [l, a] = (0, i.useState)([]),
          c = (0, i.useRef)(null),
          h = (0, i.useMemo)(() => new K.ActionsProvider(o), [o]),
          d = (0, i.useCallback)(
            () => h.contextMenuActionsForSources(s),
            [h, s],
          ),
          p = (0, i.useCallback)(() => {
            if (n) return
            const e = $(o, s)
            a(Y(e))
          }, [n, o, s]),
          u = (0, i.useCallback)(
            (e) => {
              n &&
                d().then((t) => {
                  const o = Y(t)
                  window.matchMedia(y.DialogBreakpoints.TabletSmall).matches ||
                  !F.isAnyMobile
                    ? O.ContextMenuManager.showMenu(
                        o,
                        e,
                        {
                          mode: F.isAnyMobile ? 'drawer' : 'menu',
                          'data-name': 'more-menu',
                        },
                        { menuName: 'LineToolFloatingToolbarMoreMenu' },
                      )
                    : a(o)
                })
            },
            [n, d],
          )
        return (
          (0, i.useEffect)(() => {
            var e
            l.length && (null === (e = c.current) || void 0 === e || e.update())
          }, [l]),
          i.createElement(
            R.ToolWidgetMenu,
            {
              className: r,
              ref: c,
              arrow: !1,
              onOpen: p,
              onClick: u,
              title: t,
              content: i.createElement(V.Icon, { icon: q }),
              'data-name': 'more',
              menuDataName: 'more-menu',
              closeOnEsc: !0,
            },
            i.createElement(H.ActionsTable, { parentIsOpened: !0, items: l }),
          )
        )
      }
      function Y(e) {
        if (I.touch && !window.matchMedia('(pointer:fine)').matches) {
          const t = e.filter((e) => 'Copy' !== e.id)
          if (t.length === e.length) return t
          const o = []
          return (
            t.forEach((e) => {
              ;('separator' !== e.type ||
                (o.length > 0 && 'separator' !== o[o.length - 1].type)) &&
                o.push(e)
            }),
            o
          )
        }
        return e
      }
      var X = o(694454),
        Q = o(476853),
        ee = o(200501),
        te = o(123851),
        oe = o(357740),
        ie = o(780427)
      function ne(e) {
        const {
            property: t,
            propertyApplier: n,
            title: s,
            undoText: l,
            isToolbarFixed: a,
            className: c,
          } = e,
          h = (0, P.useProperty)(t),
          d = (0, i.useMemo)(
            () => [
              new Z.Action({
                actionId: 'Chart.LineTool.Toolbar.ChangeLineStyleToSolid',
                options: {
                  icon: ee,
                  label: r.t(null, void 0, o(301277)),
                  active: X.LineStyle.Solid === h,
                  onExecute: () => n.setProperty(t, X.LineStyle.Solid, l),
                },
              }),
              new Z.Action({
                actionId: 'Chart.LineTool.Toolbar.ChangeLineStyleToDashed',
                options: {
                  icon: te,
                  label: r.t(null, void 0, o(459317)),
                  active: X.LineStyle.Dashed === h,
                  onExecute: () => n.setProperty(t, X.LineStyle.Dashed, l),
                },
              }),
              new Z.Action({
                actionId: 'Chart.LineTool.Toolbar.ChangeLineStyleToDotted',
                options: {
                  icon: oe,
                  label: r.t(null, void 0, o(842973)),
                  active: X.LineStyle.Dotted === h,
                  onExecute: () => n.setProperty(t, X.LineStyle.Dotted, l),
                },
              }),
            ],
            [n, t, h],
          )
        return i.createElement(
          R.ToolWidgetMenu,
          {
            className: c,
            arrow: !1,
            content: i.createElement(V.Icon, { icon: re(h) }),
            title: s,
            'data-name': e['data-name'],
            menuDataName: `${e['data-name']}-menu`,
            verticalDropDirection: a
              ? Q.VerticalDropDirection.FromBottomToTop
              : void 0,
            horizontalDropDirection: a
              ? Q.HorizontalDropDirection.FromRightToLeft
              : void 0,
            horizontalAttachEdge: a ? Q.HorizontalAttachEdge.Right : void 0,
            verticalAttachEdge: a ? Q.VerticalAttachEdge.Top : void 0,
          },
          i.createElement(H.ActionsTable, { items: d }),
        )
      }
      function re(e) {
        switch (e) {
          case X.LineStyle.Solid:
            return ee
          case X.LineStyle.Dashed:
            return te
          case X.LineStyle.Dotted:
            return oe
          case 'mixed':
            return ie
          default:
            return ''
        }
      }
      const se = [10, 11, 12, 14, 16, 20, 24, 28, 32, 40]
      function le(e) {
        const {
            property: t,
            propertyApplier: o,
            title: n,
            undoText: r,
            isToolbarFixed: s,
            className: l,
          } = e,
          a = (0, P.useProperty)(t),
          c = se.map(
            (e) =>
              new Z.Action({
                actionId: 'Chart.LineTool.Toolbar.ChangeFontSizeProperty',
                options: {
                  label: e.toString(),
                  onExecute: () => o.setProperty(t, e, r),
                  active: e === a,
                },
              }),
          )
        return i.createElement(
          R.ToolWidgetMenu,
          {
            arrow: !1,
            content: a,
            className: l,
            title: n,
            verticalDropDirection: s
              ? Q.VerticalDropDirection.FromBottomToTop
              : void 0,
            horizontalDropDirection: s
              ? Q.HorizontalDropDirection.FromRightToLeft
              : void 0,
            horizontalAttachEdge: s ? Q.HorizontalAttachEdge.Right : void 0,
            verticalAttachEdge: s ? Q.VerticalAttachEdge.Top : void 0,
            'data-name': e['data-name'],
            menuDataName: `${e['data-name']}-menu`,
          },
          i.createElement(H.ActionsTable, { items: c }),
        )
      }
      var ae = o(632863),
        ce = o(919577),
        he = o(580384),
        de = o(350299),
        pe = o(76821),
        ue = o(608280)
      function ge(e) {
        const {
            model: t,
            onRestore: n,
            onSave: s,
            isDrawingFinished: a,
            isToolbarFixed: c,
            className: h,
            ...d
          } = e,
          [p, u] = (0, i.useState)(!1),
          [g, m] = (0, i.useState)(null),
          v = (0, i.useRef)(null)
        ;(0, i.useEffect)(() => {
          var e
          null === (e = v.current) || void 0 === e || e.update()
        }, [p])
        const _ = (0, i.useMemo)(() => {
            if (s)
              return () => {
                t.showSaveDialog((e) => {
                  t.saveTemplate(e, JSON.stringify(s()))
                })
              }
          }, [t, s]),
          w = (0, i.useMemo)(() => {
            const e = []
            return (
              a &&
                _ &&
                e.push(
                  new Z.Action({
                    actionId: 'Chart.LineTool.Templates.SaveAs',
                    options: {
                      label: (0, de.appendEllipsis)(
                        r.t(null, void 0, o(933751)),
                      ),
                      onExecute: _,
                    },
                  }),
                ),
              e.push(
                new Z.Action({
                  actionId: 'Chart.LineTool.Templates.ApplyDefaults',
                  options: {
                    label: r.t(null, void 0, o(486528)),
                    onExecute: n,
                  },
                }),
              ),
              p
                ? e.push(new Z.Loader('Chart.LineTool.Templates.Apply'))
                : !p &&
                  (null == g ? void 0 : g.length) &&
                  (e.push(new Z.Separator()),
                  e.push(
                    ...g.map(
                      (e) =>
                        new Z.Action({
                          actionId: 'Chart.LineTool.Templates.Apply',
                          options: {
                            label: e,
                            onExecute: () =>
                              ((e) => {
                                void 0 !== e && t.loadTemplate(e)
                              })(e),
                            showToolboxOnHover: !0,
                            toolbox: {
                              type: pe.ToolboxType.Delete,
                              action: () => t.deleteAction(e),
                            },
                          },
                        }),
                    ),
                  )),
              e
            )
          }, [_, n, g, t, a, p])
        return i.createElement(
          R.ToolWidgetMenu,
          {
            title: r.t(null, void 0, o(891900)),
            content: i.createElement(V.Icon, { icon: ue }),
            onOpen: l.enabled('drawing_templates')
              ? () => {
                  u(!0),
                    t.templatesLoaded().then(() => {
                      const e = t.getData()
                      void 0 !== e && (m(e), u(!1))
                    }),
                    (0, x.trackEvent)(
                      'GUI',
                      'Context action on drawings',
                      'Templates',
                    )
                }
              : void 0,
            arrow: !1,
            className: h,
            'data-name': 'templates',
            menuDataName: 'templates-menu',
            verticalDropDirection: c
              ? Q.VerticalDropDirection.FromBottomToTop
              : void 0,
            horizontalDropDirection: c
              ? Q.HorizontalDropDirection.FromLeftToRight
              : void 0,
            horizontalAttachEdge: c ? Q.HorizontalAttachEdge.Left : void 0,
            verticalAttachEdge: c ? Q.VerticalAttachEdge.Top : void 0,
            ref: v,
            ...d,
          },
          i.createElement(H.ActionsTable, { items: w }),
        )
      }
      var me = o(602164),
        ve = o(577461),
        _e = o(955643),
        we = o(946839)
      const fe = !l.enabled('widget') || window.is_authenticated,
        Te = new s.TranslatedString(
          'change line tool(s) font size',
          r.t(null, void 0, o(436819)),
        ),
        ye = new s.TranslatedString(
          'change line tool(s) line style',
          r.t(null, void 0, o(654769)),
        ),
        be = new s.TranslatedString(
          'apply drawing template',
          r.t(null, void 0, o(349037)),
        ),
        Le = new s.TranslatedString(
          'line tool(s) line style',
          r.t(null, { context: 'line tool property name' }, o(2443)),
        ),
        xe = r.t(null, void 0, o(389517)),
        Ce = r.t(null, void 0, o(734596)),
        Se = r.t(null, void 0, o(141610)),
        Ee = r.t(null, void 0, o(832733)),
        Pe = r.t(null, void 0, o(417006))
      class Ae {
        constructor(e) {
          ;(this._isDrawingFinished = new a.WatchedValue(!0)),
            (this._currentTool = null),
            (this._updateVisibilityTimeout = null),
            (this._lineWidthsProperty = null),
            (this._lineColorsProperty = null),
            (this._currentProperties = null),
            (this._floatingContainer = null),
            (this._floatingToolbarRendered = !1),
            (this._toolbarVisible = !1),
            (this._propertiesVisible = !1),
            (this._templatesButton = null),
            (this._propertyButtons = []),
            (this._commonButtons = []),
            (this._handleSourceEdit = (e) => {
              h.isDirectionalMovementActive.value() ||
                (e
                  ? this._floatingToolbar.hide(!0)
                  : this._floatingToolbarRendered &&
                    this._floatingToolbar.show())
            }),
            (this._chartWidgetCollection = e),
            (this._floatingToolbar = new T.FloatingToolbar({
              defaultPosition: {
                top: ae.HEADER_TOOLBAR_HEIGHT_EXPANDED + 15,
                left: window.innerWidth / 2,
              },
              positionSettingsKey: 'properties_toolbar.position',
              positionStorageType: 'device',
              layout: 'horizontal',
              'data-name': 'drawing-toolbar',
            })),
            (this._floatingContainer =
              this._floatingToolbar.getReactWidgetContainer()),
            (this._isToolMovingNowSpawn = h.isToolMovingNow.spawn()),
            (this._isToolEditingNowSpawn = h.isToolEditingNow.spawn()),
            (this._toolSpawn = h.tool.spawn()),
            (this._iconToolSpawn = h.iconTool.spawn()),
            (this._emojiToolSpawn = h.emojiTool.spawn()),
            (this._selectedSourcesSpawn =
              this._chartWidgetCollection.selectedSources.spawn()),
            this._isToolMovingNowSpawn.subscribe(this._handleSourceEdit),
            this._isToolEditingNowSpawn.subscribe(this._handleSourceEdit),
            this._toolSpawn.subscribe(this._onToolChanged.bind(this), {
              callWithLast: !0,
            }),
            this._iconToolSpawn.subscribe(() =>
              this._onToolChanged(h.tool.value()),
            ),
            this._emojiToolSpawn.subscribe(() =>
              this._onToolChanged(h.tool.value()),
            ),
            this._selectedSourcesSpawn.subscribe(() =>
              this.onSourceChanged(this.selectedSources()),
            ),
            this._chartWidgetCollection.onAboutToBeDestroyed.subscribe(
              this,
              this.destroy,
              !0,
            )
        }
        destroy() {
          this._isToolMovingNowSpawn.destroy(),
            this._isToolEditingNowSpawn.destroy(),
            this._toolSpawn.destroy(),
            this._iconToolSpawn.destroy(),
            this._emojiToolSpawn.destroy(),
            this._selectedSourcesSpawn.destroy()
        }
        refresh() {
          this.onSourceChanged(this.selectedSources())
        }
        onSourceChanged(e) {
          if (!(null == e ? void 0 : e.length))
            return (
              (this._propertiesVisible = !1),
              (this._toolbarVisible = !1),
              void this.hide()
            )
          if (
            (this._createCommonButtons(),
            e.every((t) => t.toolname === e[0].toolname)
              ? this._showTemplatesOf({ sources: e })
              : this._templatesButton && this._clearTemplatesButton(),
            1 === e.length)
          ) {
            const t = e[0]
            t.isAvailableInFloatingWidget() &&
            this.activeChartWidget().model().model().dataSourceForId(t.id())
              ? (!t.userEditEnabled() ||
                  (!(0, ve.isLineDrawnWithPressedButton)(t.toolname) &&
                    this.activeChartWidget().model().lineBeingCreated()) ||
                  this._isDrawingFinished.setValue(!0),
                this.showPropertiesOf(t.toolname, t.properties(), !0),
                (this._toolbarVisible = !0))
              : this.hide()
          } else
            this._clearProperties(),
              this._createWidthsButton(void 0, !0),
              this._createLineStyleButton(),
              this._createColorsButton(void 0, !0),
              this._createBackgroundsButton(void 0, !0),
              this._createTextColorsButton(void 0, !0),
              (this._propertiesVisible = !0)
          this._updateVisibility()
        }
        activeChartWidget() {
          return this._chartWidgetCollection.activeChartWidget.value()
        }
        selectedSources() {
          return this._chartWidgetCollection.selectedSources
            .value()
            .filter(ce.isLineTool)
        }
        hide() {
          this._updateVisibilityTimeout &&
            clearTimeout(this._updateVisibilityTimeout),
            (this._updateVisibilityTimeout = setTimeout(() => {
              ;(0, ce.unsetNewToolProperties)(),
                this._floatingToolbar.hide(!0),
                this._isToolbarRendered() && this._unmountFloatingToolbar(),
                this._clearProperties(),
                this._clearCommonButtons()
            }, 0)),
            delete this._propertyApplier
        }
        templatesList() {
          return this._templatesList
        }
        _onToolChanged(e, t) {
          this._currentTool = e
          const o = this.selectedSources()
          if (this._isDrawingToolExcludingCustomUrlEventTool(e)) {
            if ((this._isDrawingFinished.setValue(!1), fe)) {
              const o =
                t instanceof me.DefaultProperty
                  ? t
                  : (0, ce.setNewToolProperties)(
                      e,
                      'LineToolIcon' === e
                        ? h.iconTool.value()
                        : 'LineToolEmoji' === e
                          ? h.emojiTool.value()
                          : void 0,
                      this._chartWidgetCollection.activeChartWidget
                        .value()
                        .model()
                        .model(),
                    )
              this.showPropertiesOf(e, o, t instanceof me.DefaultProperty),
                this._showTemplatesOf({ tool: e, properties: o }),
                (this._toolbarVisible = !0)
            }
            this._updateVisibility()
          } else
            o && o.length
              ? (o.length > 1 && this._isDrawingFinished.setValue(!0),
                this.onSourceChanged(this.selectedSources()))
              : this.hide()
        }
        _propertyApplierImpl() {
          return (
            this._propertyApplier ||
              (this._propertyApplier = new we.PropertyApplierWithoutSavingChart(
                () => this.activeChartWidget().model(),
                new a.WatchedValue(false),
              )),
            this._propertyApplier
          )
        }
        _clearProperties() {
          this._clearPropertyButtons(),
            this._lineWidthsProperty &&
              (this._lineWidthsProperty.destroy(),
              (this._lineWidthsProperty = null)),
            this._lineColorsProperty &&
              (this._lineColorsProperty.destroy(),
              (this._lineColorsProperty = null)),
            this._currentProperties && (this._currentProperties = null)
        }
        _show() {
          this._updateVisibilityTimeout &&
            clearTimeout(this._updateVisibilityTimeout),
            (this._updateVisibilityTimeout = setTimeout(() => {
              this._renderFloatingToolbar(),
                this._floatingToolbar.show(),
                this._floatingToolbar.checkPosition()
            }, 0))
        }
        _addPropertyButton(e) {
          this._propertyButtons.push(e), this._renderFloatingToolbar()
        }
        _addCommonButton(e) {
          this._commonButtons.push(e), this._renderFloatingToolbar()
        }
        _addTemplatesButton(e) {
          this._templatesButton = e
        }
        _renderFloatingToolbar() {
          null !== this._floatingContainer &&
            this.activeChartWidget() &&
            this.activeChartWidget().hasModel() &&
            (n.render(
              i.createElement(L, {
                templateButton: this._templatesButton,
                propertyButtons: this._propertyButtons,
                commonButtons: this._commonButtons,
                isDrawingFinished: this._isDrawingFinished.value(),
                activeChartWidget: this.activeChartWidget(),
              }),
              this._floatingContainer,
            ),
            (this._floatingToolbarRendered = !0))
        }
        _unmountFloatingToolbar() {
          null !== this._floatingContainer &&
            (n.unmountComponentAtNode(this._floatingContainer),
            (this._floatingToolbarRendered = !1))
        }
        _clearTemplatesButton() {
          this._templatesButton = null
        }
        _clearPropertyButtons() {
          this._propertyButtons = []
        }
        _clearCommonButtons() {
          this._commonButtons = []
        }
        _isToolbarRendered() {
          return this._floatingToolbarRendered
        }
        _createSettingsButton() {
          const e = {
            component: E,
            props: { title: xe, activeChartWidget: this.activeChartWidget() },
          }
          this._addCommonButton(e)
        }
        _createLockButton() {
          const e = {
            component: W,
            props: {
              title: 'Lock',
              activeChartWidget: this.activeChartWidget(),
            },
          }
          this._addCommonButton(e)
        }
        _createRemoveButton() {
          const e = {
            component: N,
            props: { title: Ce, activeChartWidget: this.activeChartWidget() },
            showForSmallScreen: !0,
          }
          this._addCommonButton(e)
        }
        _createDotsButton() {
          this._addCommonButton({
            component: J,
            props: { title: Se, activeChartWidget: this.activeChartWidget() },
            showForSmallScreen: !0,
          })
        }
        _createAlertButton() {}
        _createSourceActions() {
          this._createLockButton()
        }
        _createLineStyleButton(e) {
          const t = this.selectedSources().filter(ce.isLineTool)
          if (!t.length) return !1
          let o,
            i = this._propertyApplierImpl()
          if (1 === t.length) {
            if (((o = t[0].properties().linestyle || e), !o)) return !1
          } else {
            const e = t
              .map((e) => e.properties().linestyle || e.properties().lineStyle)
              .filter(c.notUndefined)
            if (!e.length) return !1
            ;(o = new d.CollectiblePropertyUndoWrapper(
              new p.LineToolCollectedProperty(e),
              Le,
              this._propertyApplierImpl(),
            )),
              (i = { ...i, setProperty: (e, t) => e.setValue(t) })
          }
          return (
            this._addPropertyButton({
              component: ne,
              props: {
                property: o,
                title: Ee,
                propertyApplier: i,
                'data-name': 'style',
                undoText: ye,
              },
            }),
            !0
          )
        }
        _createFontSizeButton(e) {
          const t = this.selectedSources()
          if (0 === t.length) return !1
          const o = t[0]
          if (!(0, _e.isDataSource)(o)) return !1
          const i = {
            component: le,
            props: {
              property: o.properties().fontsize || e,
              title: Pe,
              propertyApplier: this._propertyApplierImpl(),
              'data-name': 'font-size',
              undoText: Te,
            },
          }
          return this._addPropertyButton(i), !0
        }
        _createCommonButtons() {
          this._commonButtons.length && this._clearCommonButtons(),
            l.enabled('property_pages') && this._createSettingsButton(),
            this._createSourceActions(),
            this._createRemoveButton(),
            this._createDotsButton()
        }
        _prepareProperties(e) {
          const t = this.selectedSources().filter((t) => t.properties()[e])
          if (!(t.filter((t) => t.properties()[e].visible()).length < 1))
            return t.map((t) => t.properties()[e]).filter(c.notNull)
        }
        _createProperty(e, t, o, i) {
          if (t) {
            const e = this._prepareProperties(o)
            if (!e) return
            return this._isWidthProperty(e[0])
              ? new m(
                  new p.MultipleLineWidthsProperty(e),
                  this._propertyApplierImpl(),
                  i,
                )
              : new v.CollectibleColorPropertyUndoWrapper(
                  new p.MultipleLineColorsProperty(e),
                  this._propertyApplierImpl(),
                  i,
                )
          }
          if (e && e.visible())
            return this._isWidthProperty(e)
              ? new p.MultipleLineWidthsProperty([e])
              : new v.CollectibleColorPropertyDirectWrapper(
                  new p.MultipleLineColorsProperty([e]),
                )
        }
        _shouldShowBackgroundProperty(e, t) {
          return !t || !t.fillBackground || !!t.fillBackground.value()
        }
        _isDrawingToolExcludingCustomUrlEventTool(e) {
          return (
            Boolean(
              null == e ? void 0 : e.toLowerCase().includes('linetool'),
            ) &&
            'LineToolTweet' !== e &&
            'LineToolIdea' !== e &&
            'LineToolImage' !== e
          )
        }
        _updateVisibility() {
          ;(fe || this._isDrawingFinished.value()) &&
          (this._toolbarVisible || this._propertiesVisible)
            ? this._show()
            : this.hide()
        }
        _showTemplatesOf(e) {
          if ((this._templatesButton && this._clearTemplatesButton(), !fe))
            return
          let t, o, i, n
          if ('sources' in e) {
            if (
              ((t = e.sources),
              (o = t[0].toolname),
              (i = t[0].properties()),
              1 === t.length)
            ) {
              const e = t[0]
              n = () => e.template()
            }
          } else (o = e.tool), (i = e.properties)
          ;(this._templatesList = new he.LinetoolTemplatesList(o, (e) => {
            if (t) {
              const o = this.activeChartWidget().model()
              o.beginUndoMacro(be, !1),
                t.forEach((t) => o.applyLineToolTemplate(t, e, be)),
                o.endUndoMacro(),
                this.onSourceChanged(t)
            } else
              i.mergeAndFire(e), i.saveDefaults(), this._onToolChanged(o, i)
          })),
            this._addTemplatesButton({
              component: ge,
              props: {
                key: 'Templates',
                model: this._templatesList,
                onSave: l.enabled('drawing_templates') ? n : void 0,
                onRestore: () => {
                  void 0 !== t
                    ? this.activeChartWidget()
                        .model()
                        .restoreLineToolsFactoryDefaults(t)
                    : i.restoreFactoryDefaults(),
                    this.refresh()
                },
              },
            })
        }
        _isWidthProperty(e) {
          return e instanceof p.LineToolWidthsProperty
        }
      }
    },
    580384: (e, t, o) => {
      o.r(t), o.d(t, { LinetoolTemplatesList: () => d })
      var i = o(609838),
        n = o(986661),
        r = o(855342),
        s = o(357739),
        l = o(190266),
        a = o(153055),
        c = o(980458)
      const h = o(156963).enabled('drawing_templates')
      class d {
        constructor(e, t) {
          ;(this._toolName = e),
            (this._applyTemplate = t),
            (this._templatesDeferred = h ? this._loadData() : Promise.resolve())
        }
        getData() {
          return n.store.getState().templates[this._toolName]
        }
        templatesLoaded() {
          return this._templatesDeferred
        }
        loadTemplate(e, t) {
          n.store.dispatch(
            (0, r.loadTemplate)(this._toolName, e, (e) => {
              this._applyTemplate(e), null == t || t()
            }),
          )
        }
        removeTemplate(e) {
          n.store.dispatch((0, r.startRemoveTemplate)(this._toolName, e))
        }
        saveTemplate(e, t) {
          const o = (0, s.clean)(e)
          n.store.dispatch((0, r.saveTemplate)(this._toolName, o, t))
        }
        deleteAction(e) {
          ;(0, l.runOrSignIn)(
            () => {
              const t = i.t(null, { replace: { name: e } }, o(774935))
              ;(0, a.showConfirm)({
                text: t,
                onConfirm: (t) => {
                  this.removeTemplate(e), t.dialogClose()
                },
              })
            },
            { source: 'Delete line tool template' },
          )
        }
        showSaveDialog(e) {
          ;(0, l.runOrSignIn)(
            () => {
              ;(0, a.showRename)({
                title: i.t(null, void 0, o(933751)),
                text: i.t(null, void 0, o(350912)) + ':',
                maxLength: 64,
                source: this.getData() || [],
                autocompleteFilter: c.autocompleteFilter,
                onRename: (t) => {
                  if (-1 !== (this.getData() || []).indexOf(t.newValue)) {
                    const n = i.t(
                      null,
                      { replace: { name: t.newValue } },
                      o(571527),
                    )
                    ;(0, a.showConfirm)(
                      {
                        text: n,
                        onConfirm: (o) => {
                          e(t.newValue), o.dialogClose(), t.dialogClose()
                        },
                        onClose: t.focusInput,
                      },
                      t.innerManager,
                    )
                  } else e(t.newValue), t.dialogClose()
                },
              })
            },
            { source: 'Save line tool template', sourceMeta: 'Chart' },
          )
        }
        async _loadData() {
          return new Promise((e) => {
            this.getData()
              ? e()
              : n.store.dispatch((0, r.getTemplates)(this._toolName, e))
          })
        }
      }
    },
    526122: (e, t, o) => {
      o.d(t, { lineToolsInfo: () => f })
      var i = o(650151),
        n = o(609838),
        r = o(725784),
        s = (o(336379), o(259517)),
        l = o(679112)
      const a = {
        SyncDrawing: n.t(null, void 0, o(736551)),
        arrow: n.t(null, void 0, o(696237)),
        cursor: n.t(null, void 0, o(429908)),
        dot: n.t(null, void 0, o(860925)),
        performance: n.t(null, void 0, o(579165)),
        drawginmode: n.t(null, void 0, o(749421)),
        eraser: n.t(null, void 0, o(299289)),
        group: n.t(null, void 0, o(691977)),
        hideAllDrawings: n.t(null, void 0, o(717517)),
        lockAllDrawings: n.t(null, void 0, o(537057)),
        magnet: n.t(null, void 0, o(937140)),
        measure: n.t(null, void 0, o(659607)),
        removeAllDrawingTools: n.t(null, void 0, o(376091)),
        showObjectsTree: n.t(null, void 0, o(551072)),
        zoom: n.t(null, void 0, o(38925)),
        'zoom-out': n.t(null, void 0, o(949895)),
      }
      var c = o(456765),
        h = o(180185),
        d = o(132877)
      const p = (0, h.humanReadableModifiers)(h.Modifiers.Shift, !1),
        u = (0, h.humanReadableModifiers)(h.Modifiers.Alt, !1),
        g = (0, h.humanReadableModifiers)(h.Modifiers.Mod, !1),
        m = { keys: [p], text: n.t(null, void 0, o(240234)) },
        v = { keys: [p], text: n.t(null, void 0, o(468125)) },
        _ = { keys: [p], text: n.t(null, void 0, o(481591)) },
        w = {
          LineTool5PointsPattern: {},
          LineToolABCD: {},
          LineToolArc: {},
          LineToolArrow: {},
          LineToolArrowMarkDown: {},
          LineToolArrowMarkLeft: {},
          LineToolArrowMarkRight: {},
          LineToolArrowMarkUp: {},
          LineToolBalloon: {},
          LineToolComment: {},
          LineToolBarsPattern: {},
          LineToolBezierCubic: {},
          LineToolBezierQuadro: {},
          LineToolBrush: {},
          LineToolCallout: {},
          LineToolCircleLines: {},
          LineToolCypherPattern: {},
          LineToolDateAndPriceRange: {},
          LineToolDateRange: {},
          LineToolDisjointAngle: { hotKey: (0, r.hotKeySerialize)(m) },
          LineToolElliottCorrection: {},
          LineToolElliottDoubleCombo: {},
          LineToolElliottImpulse: {},
          LineToolElliottTriangle: {},
          LineToolElliottTripleCombo: {},
          LineToolEllipse: { hotKey: (0, r.hotKeySerialize)(v) },
          LineToolExtended: {},
          LineToolFibChannel: {},
          LineToolFibCircles: { hotKey: (0, r.hotKeySerialize)(v) },
          LineToolFibRetracement: {},
          LineToolFibSpeedResistanceArcs: {},
          LineToolFibSpeedResistanceFan: { hotKey: (0, r.hotKeySerialize)(_) },
          LineToolFibSpiral: {},
          LineToolFibTimeZone: {},
          LineToolFibWedge: {},
          LineToolFlagMark: {},
          LineToolFlatBottom: { hotKey: (0, r.hotKeySerialize)(m) },
          LineToolAnchoredVWAP: {},
          LineToolGannComplex: {},
          LineToolGannFixed: {},
          LineToolGannFan: {},
          LineToolGannSquare: {
            hotKey: (0, r.hotKeySerialize)({
              keys: [p],
              text: n.t(null, void 0, o(510289)),
            }),
          },
          LineToolHeadAndShoulders: {},
          LineToolHorzLine: {
            hotKey: (0, r.hotKeySerialize)({
              keys: [u, 'H'],
              text: '{0} + {1}',
            }),
          },
          LineToolHorzRay: {},
          LineToolIcon: {},
          LineToolEmoji: {},
          LineToolInsidePitchfork: {},
          LineToolNote: {},
          LineToolNoteAbsolute: {},
          LineToolSignpost: {},
          LineToolParallelChannel: { hotKey: (0, r.hotKeySerialize)(m) },
          LineToolPitchfan: {},
          LineToolPitchfork: {},
          LineToolPolyline: {},
          LineToolPath: {},
          LineToolPrediction: {},
          LineToolPriceLabel: {},
          LineToolPriceNote: { hotKey: (0, r.hotKeySerialize)(m) },
          LineToolArrowMarker: {},
          LineToolPriceRange: {},
          LineToolProjection: {},
          LineToolRay: {},
          LineToolRectangle: {
            hotKey: (0, r.hotKeySerialize)({
              keys: [p],
              text: n.t(null, void 0, o(481591)),
            }),
          },
          LineToolCircle: {},
          LineToolRegressionTrend: {},
          LineToolRiskRewardLong: {},
          LineToolRiskRewardShort: {},
          LineToolFixedRangeVolumeProfile: {},
          LineToolRotatedRectangle: { hotKey: (0, r.hotKeySerialize)(m) },
          LineToolSchiffPitchfork: {},
          LineToolSchiffPitchfork2: {},
          LineToolSineLine: {},
          LineToolText: {},
          LineToolTextAbsolute: {},
          LineToolThreeDrivers: {},
          LineToolTimeCycles: {},
          LineToolTrendAngle: { hotKey: (0, r.hotKeySerialize)(m) },
          LineToolTrendBasedFibExtension: {},
          LineToolTrendBasedFibTime: {},
          LineToolTrendLine: { hotKey: (0, r.hotKeySerialize)(m) },
          LineToolInfoLine: {},
          LineToolTriangle: {},
          LineToolTrianglePattern: {},
          LineToolVertLine: {
            hotKey: (0, r.hotKeySerialize)({
              keys: [u, 'V'],
              text: '{0} + {1}',
            }),
          },
          LineToolCrossLine: {},
          LineToolHighlighter: {},
          LineToolGhostFeed: {},
          SyncDrawing: { iconActive: l.drawingToolsIcons.SyncDrawingActive },
          arrow: {},
          cursor: {},
          dot: {},
          drawginmode: { iconActive: l.drawingToolsIcons.drawginmodeActive },
          eraser: {},
          group: {},
          hideAllDrawings: {
            iconActive: l.drawingToolsIcons.hideAllDrawingsActive,
            hotKey: (0, r.hotKeySerialize)({
              keys: [g, u, 'H'],
              text: '{0} + {1} + {2}',
            }),
          },
          lockAllDrawings: {
            iconActive: l.drawingToolsIcons.lockAllDrawingsActive,
          },
          magnet: {
            hotKey: (0, r.hotKeySerialize)({ keys: [g], text: '{0}' }),
          },
          measure: {
            hotKey: (0, r.hotKeySerialize)({
              keys: [p],
              text: n.t(null, void 0, o(132868)),
            }),
          },
          removeAllDrawingTools: {},
          showObjectsTree: {},
          zoom: {},
          'zoom-out': {},
        }
      const f = {}
      Object.entries(w)
        .map(([e, t]) => {
          var o, n
          const r =
            null !== (o = s.lineToolsIcons[e]) && void 0 !== o
              ? o
              : l.drawingToolsIcons[e]
          ;(0, i.assert)(!!r, `Icon is not defined for drawing "${e}"`)
          const h =
            null !== (n = c.lineToolsLocalizedNames[e]) && void 0 !== n
              ? n
              : a[e]
          ;(0, i.assert)(
            !!h,
            `Localized name is not defined for drawing "${e}"`,
          )
          return {
            ...t,
            name: e,
            icon: r,
            localizedName: h,
            selectHotkey: d.lineToolsSelectHotkeys[e],
          }
        })
        .forEach((e) => {
          f[e.name] = e
        })
    },
    227009: (e, t, o) => {
      var i = o(664902).TranslatedString,
        n = o(875091).LineToolPropertiesWidgetBase
      const r = o(523847).ColorPickerButton,
        s = o(822598).LineWidthButton
      var l = o(394071),
        a = o(621065),
        c = o(448984),
        h = new i('change line tool(s) color', o.tf(null, void 0, o(368519))),
        d = new i(
          'change line tool(s) background color',
          o.tf(null, void 0, o(674350)),
        ),
        p = new i(
          'change line tool(s) text color',
          o.tf(null, void 0, o(16631)),
        ),
        u = new i(
          'change line tool(s) line width',
          o.tf(null, void 0, o(141648)),
        ),
        g = o.tf(null, void 0, o(940054)),
        m = o.tf(null, void 0, o(712928)),
        v = o.tf(null, void 0, o(319221)),
        _ = o.tf(null, void 0, o(121327)),
        w = o.tf(null, void 0, o(938455)),
        f = o.tf(null, void 0, o(671845)),
        T = o.tf(null, void 0, o(832733)),
        y = o.tf(null, void 0, o(23886)),
        b = o.tf(null, void 0, o(286327)),
        L = o.tf(null, void 0, o(447059)),
        x = o.tf(null, void 0, o(36785)),
        C = o.tf(null, void 0, o(749593)),
        S = o.tf(null, void 0, o(867455)),
        E = o.tf(null, void 0, o(179964)),
        P = o.tf(null, void 0, o(745320))
      class A extends n {
        constructor(e) {
          super(e), (this._templatesButton = null)
        }
        _createWidthsButton(e, t) {
          if (
            (this._lineWidthsProperty &&
              (this._lineWidthsProperty.destroy(),
              (this._lineWidthsProperty = null)),
            (this._lineWidthsProperty = this._createProperty(
              e,
              t,
              'linesWidths',
              u,
            )),
            !this._lineWidthsProperty)
          )
            return !0
          var o = b
          t &&
            1 !==
              this.selectedSources().filter((e) => e.properties().linesWidths)
                .length &&
            (o = L)
          return (
            this._addPropertyButton({
              component: s,
              props: {
                title: o,
                multipleProperty: this._lineWidthsProperty,
                propertyApplier: this._propertyApplierImpl(),
                'data-name': 'line-tool-width',
                undoText: u,
              },
            }),
            !0
          )
        }
        _createColorsButton(e, t) {
          return (
            this._lineColorsProperty &&
              (this._lineColorsProperty.destroy(),
              (this._lineColorsProperty = null)),
            (this._lineColorsProperty = this._createProperty(
              e,
              t,
              'linesColors',
              h,
            )),
            !this._lineColorsProperty ||
              (this._addPropertyButton({
                component: r,
                props: {
                  icon: l,
                  title: m,
                  property: this._lineColorsProperty,
                  propertyApplier: this._propertyApplierImpl(),
                  'data-name': 'line-tool-color',
                  undoText: h,
                },
              }),
              !0)
          )
        }
        _createBackgroundsButton(e, t) {
          return (
            this._backgroundsProperty &&
              (this._backgroundsProperty.destroy(),
              (this._backgroundsProperty = null)),
            (this._backgroundsProperty = this._createProperty(
              e,
              t,
              'backgroundsColors',
              d,
            )),
            !this._backgroundsProperty ||
              (this._addPropertyButton({
                component: r,
                props: {
                  icon: a,
                  title: f,
                  property: this._backgroundsProperty,
                  propertyApplier: this._propertyApplierImpl(),
                  'data-name': 'background-color',
                  undoText: d,
                },
              }),
              !0)
          )
        }
        _createTextColorsButton(e, t) {
          return (
            this._textColorsProperty &&
              (this._textColorsProperty.destroy(),
              (this._textColorsProperty = null)),
            (this._textColorsProperty = this._createProperty(
              e,
              t,
              'textsColors',
              p,
            )),
            !this._textColorsProperty ||
              (this._addPropertyButton({
                component: r,
                props: {
                  icon: c,
                  title: _,
                  property: this._textColorsProperty,
                  propertyApplier: this._propertyApplierImpl(),
                  'data-name': 'text-color',
                  undoText: p,
                },
              }),
              !0)
          )
        }
        _getPossibleProperty(e) {
          for (
            var t = [], o = this._defaultToolProperties(), i = 0;
            i < o.length;
            i++
          ) {
            var n = o[i]
            n.name in e && t.push(n)
          }
          return t
        }
        showPropertiesOf(e, t, o) {
          this._toolExceptionCases ||
            (this._toolExceptionCases = this._createToolExceptionCases())
          var i = this._toolExceptionCases[e] || this._getPossibleProperty(t)
          if (
            (this._clearProperties(), (this._propertiesVisible = !1), i.length)
          ) {
            for (var n = {}, s = 0; s < i.length; s++) {
              for (
                var l = i[s], a = t, c = l.name.split('.'), h = 0;
                h < c.length;
                ++h
              )
                a = a && a[c[h]]
              var d = l.showIf
              if ('function' != typeof d || d(a, t)) {
                var p = l.factory
                if (p && p.call(this, a, o)) continue
                if (!a) continue
                if (
                  ((this._propertiesVisible = !0), 'combobox' !== l.inputType)
                ) {
                  const e = {
                    component: r,
                    props: {
                      icon: l.iconSvgCode,
                      title: l.title,
                      'data-name': l.dataName,
                      property: a,
                      propertyApplier: this._propertyApplierImpl(),
                      undoText: l.undoText,
                    },
                  }
                  this._addPropertyButton(e)
                  continue
                }
                n[l.name] = a
              }
            }
            this._currentProperties = n
          }
        }
        _defaultToolProperties() {
          return [
            {
              name: 'linesColors',
              inputType: 'colorPicker',
              iconSvgCode: l,
              title: g,
              factory: A.prototype._createColorsButton,
              dataName: 'line-tool-color',
            },
            {
              name: 'backgroundsColors',
              inputType: 'colorPicker',
              iconSvgCode: a,
              title: w,
              factory: A.prototype._createBackgroundsButton,
              dataName: 'background-color',
              showIf: this._shouldShowBackgroundProperty,
            },
            {
              name: 'textsColors',
              title: v,
              inputType: 'colorPicker',
              iconSvgCode: c,
              factory: A.prototype._createTextColorsButton,
              dataName: 'text-color',
            },
            {
              name: 'linesWidths',
              inputType: 'combobox',
              factory: A.prototype._createWidthsButton,
            },
            {
              name: 'linestyle',
              title: T,
              inputType: 'combobox',
              factory: A.prototype._createLineStyleButton,
            },
          ]
        }
        _regressionToolExceptionCases() {
          return [
            {
              name: 'linesWidths',
              inputType: 'combobox',
              factory: A.prototype._createWidthsButton,
            },
          ]
        }
        _pathExceptionCases() {
          return [
            {
              name: 'linesColors',
              inputType: 'colorPicker',
              iconSvgCode: l,
              title: g,
              factory: A.prototype._createColorsButton,
              dataName: 'line-tool-color',
            },
            {
              name: 'linesWidths',
              inputType: 'combobox',
              factory: A.prototype._createWidthsButton,
            },
            {
              name: 'lineStyle',
              title: T,
              inputType: 'combobox',
              factory: A.prototype._createLineStyleButton,
            },
          ]
        }
        _riskPropertiesExceptionCases() {
          return [
            {
              name: 'textcolor',
              title: v,
              inputType: 'colorPicker',
              iconSvgCode: c,
              dataName: 'text-color',
              undoText: p,
            },
            {
              name: 'profitBackground',
              title: x,
              inputType: 'colorPicker',
              iconSvgCode: a,
              dataName: 'background-color',
              undoText: d,
            },
            {
              name: 'stopBackground',
              title: C,
              inputType: 'colorPicker',
              iconSvgCode: a,
              dataName: 'background-color',
              undoText: d,
            },
          ]
        }
        _rangeExceptionCases() {
          return [
            {
              name: 'linecolor',
              inputType: 'colorPicker',
              iconSvgCode: l,
              title: g,
              dataName: 'line-tool-color',
              undoText: h,
            },
            {
              name: 'backgroundColor',
              inputType: 'colorPicker',
              iconSvgCode: a,
              title: w,
              dataName: 'background-color',
              showIf: this._shouldShowBackgroundProperty,
              undoText: d,
            },
            {
              name: 'linesWidths',
              inputType: 'combobox',
              factory: A.prototype._createWidthsButton,
            },
          ]
        }
        _brushPropertiesExceptionCase() {
          return [
            {
              name: 'linesColors',
              inputType: 'colorPicker',
              iconSvgCode: l,
              title: g,
              factory: A.prototype._createColorsButton,
              dataName: 'line-tool-color',
            },
            {
              name: 'backgroundsColors',
              inputType: 'colorPicker',
              iconSvgCode: a,
              title: w,
              dataName: 'background-color',
              factory: A.prototype._createBackgroundsButton,
            },
            {
              name: 'linesWidths',
              inputType: 'combobox',
              factory: A.prototype._createWidthsButton,
            },
          ]
        }
        _bezierPropertiesExceptionCases() {
          return [
            {
              name: 'linesColors',
              inputType: 'colorPicker',
              iconSvgCode: l,
              title: g,
              factory: A.prototype._createColorsButton,
              dataName: 'line-tool-color',
            },
            {
              name: 'backgroundsColors',
              inputType: 'colorPicker',
              iconSvgCode: a,
              dataName: 'background-color',
              title: w,
              factory: A.prototype._createBackgroundsButton,
              showIf: this._shouldShowBackgroundProperty,
            },
            {
              name: 'linesWidths',
              inputType: 'combobox',
              factory: A.prototype._createWidthsButton,
            },
            {
              name: 'linestyle',
              title: T,
              inputType: 'combobox',
              factory: A.prototype._createLineStyleButton,
            },
          ]
        }
        _textPropertiesExceptionCases() {
          return [
            {
              name: 'color',
              title: v,
              inputType: 'colorPicker',
              iconSvgCode: c,
              dataName: 'text-color',
              undoText: p,
            },
            {
              name: 'backgroundColor',
              title: w,
              inputType: 'colorPicker',
              iconSvgCode: a,
              dataName: 'background-color',
              showIf: this._shouldShowBackgroundProperty,
              undoText: d,
            },
            {
              name: 'fontsize',
              title: y,
              inputType: 'combobox',
              factory: A.prototype._createFontSizeButton,
            },
          ]
        }
        _notePropertiesExceptionCases() {
          return [
            {
              name: 'markerColor',
              title: S,
              inputType: 'colorPicker',
              iconSvgCode: l,
              dataName: 'line-tool-color',
              undoText: h,
            },
            {
              name: 'textColor',
              title: v,
              inputType: 'colorPicker',
              iconSvgCode: c,
              dataName: 'text-color',
              undoText: p,
            },
            {
              name: 'fontSize',
              title: y,
              inputType: 'combobox',
              factory: A.prototype._createFontSizeButton,
            },
          ]
        }
        _createToolExceptionCases() {
          return {
            LineToolBrush: A.prototype._brushPropertiesExceptionCase(),
            LineToolBezierQuadro: A.prototype._bezierPropertiesExceptionCases(),
            LineToolBezierCubic: A.prototype._bezierPropertiesExceptionCases(),
            LineToolText: A.prototype._textPropertiesExceptionCases(),
            LineToolTextAbsolute: A.prototype._textPropertiesExceptionCases(),
            LineToolBalloon: A.prototype._textPropertiesExceptionCases(),
            LineToolComment: A.prototype._textPropertiesExceptionCases(),
            LineToolCallout: A.prototype._textPropertiesExceptionCases(),
            LineToolPriceLabel: A.prototype._textPropertiesExceptionCases(),
            LineToolDateRange: A.prototype._rangeExceptionCases(),
            LineToolPriceRange: A.prototype._rangeExceptionCases(),
            LineToolDateAndPriceRange: A.prototype._rangeExceptionCases(),
            LineToolNote: A.prototype._notePropertiesExceptionCases(),
            LineToolNoteAbsolute: A.prototype._notePropertiesExceptionCases(),
            LineToolRiskRewardLong: A.prototype._riskPropertiesExceptionCases(),
            LineToolRiskRewardShort:
              A.prototype._riskPropertiesExceptionCases(),
            LineToolPath: A.prototype._pathExceptionCases(),
            LineToolRegressionTrend:
              A.prototype._regressionToolExceptionCases(),
            LineToolBarsPattern: [
              {
                name: 'color',
                title: g,
                inputType: 'colorPicker',
                iconSvgCode: a,
                dataName: 'background-color',
                undoText: h,
              },
            ],
            LineToolProjection: [
              {
                name: 'color1',
                title: E,
                inputType: 'colorPicker',
                iconSvgCode: a,
                dataName: 'background-color',
                undoText: d,
              },
              {
                name: 'color2',
                title: P,
                inputType: 'colorPicker',
                iconSvgCode: a,
                dataName: 'background-color',
                undoText: d,
              },
              {
                name: 'linesWidths',
                inputType: 'combobox',
                factory: A.prototype._createWidthsButton,
              },
            ],
            LineToolSignpost: [
              {
                name: 'linesColors',
                inputType: 'colorPicker',
                iconSvgCode: a,
                dataName: 'background-color',
                title: g,
                factory: A.prototype._createBackgroundsButton,
                showIf: (e, t) => t && t.showImage.value(),
              },
              {
                name: 'fontSize',
                title: y,
                inputType: 'combobox',
                factory: A.prototype._createFontSizeButton,
              },
            ],
          }
        }
      }
      e.exports = A
    },
    855342: (e, t, o) => {
      o.d(t, {
        addTemplate: () => s,
        getTemplates: () => n,
        loadTemplate: () => h,
        removeTemplate: () => a,
        saveTemplate: () => c,
        setTemplates: () => r,
        startRemoveTemplate: () => l,
      })
      var i = o(765827)
      function n(e, t) {
        return { type: i.GET_TEMPLATES, toolName: e, callback: t }
      }
      function r(e, t) {
        return { type: i.SET_TEMPLATES, templates: t, toolName: e }
      }
      function s(e, t) {
        return {
          type: i.ADD_TEMPLATE,
          templateName: t,
          toolName: e,
        }
      }
      function l(e, t) {
        return { type: i.START_REMOVE_TEMPLATE, templateName: t, toolName: e }
      }
      function a(e, t) {
        return { type: i.REMOVE_TEMPLATE, templateName: t, toolName: e }
      }
      function c(e, t, o) {
        return {
          type: i.SAVE_TEMPLATE,
          templateName: t,
          toolName: e,
          content: o,
        }
      }
      function h(e, t, o) {
        return {
          type: i.LOAD_TEMPLATE,
          toolName: e,
          templateName: t,
          callback: o,
        }
      }
    },
    765827: (e, t, o) => {
      function i(e) {
        return 'LINE_TOOL_TEMPLATE__' + e
      }
      o.d(t, {
        ADD_TEMPLATE: () => c,
        GET_TEMPLATES: () => n,
        LOAD_TEMPLATE: () => h,
        REMOVE_TEMPLATE: () => l,
        SAVE_TEMPLATE: () => a,
        SET_TEMPLATES: () => r,
        START_REMOVE_TEMPLATE: () => s,
      })
      const n = i('GET_TEMPLATES'),
        r = i('SET_TEMPLATES'),
        s = i('START_REMOVE_TEMPLATE'),
        l = i('REMOVE_TEMPLATE'),
        a = i('SAVE_TEMPLATE'),
        c = i('ADD_TEMPLATE'),
        h = i('LOAD_TEMPLATE')
    },
    986661: (e, t, o) => {
      o.d(t, { store: () => b })
      var i = o(691622),
        n = o(254773),
        r = o(336349),
        s = o(650151),
        l = o(765827),
        a = o(6835),
        c = o(855342)
      function h(e, t) {
        return t
      }
      var d = o(362830)
      const p = (0, a.getLogger)('Chart.LineToolTemplatesList')
      function u(e, t) {
        return t
      }
      function* g() {
        for (;;) {
          const {
            toolName: e,
            templateName: t,
            content: o,
          } = u(l.SAVE_TEMPLATE, yield (0, r.take)(l.SAVE_TEMPLATE))
          try {
            yield (0, r.call)(d.backend.saveDrawingTemplate, e, t, o),
              yield (0, r.put)((0, c.addTemplate)(e, t))
          } catch (e) {
            p.logWarn(e)
          }
        }
      }
      function* m() {
        for (;;) {
          const { toolName: e, templateName: t } = u(
            l.START_REMOVE_TEMPLATE,
            yield (0, r.take)(l.START_REMOVE_TEMPLATE),
          )
          try {
            yield (0, r.call)(d.backend.removeDrawingTemplate, e, t),
              yield (0, r.put)((0, c.removeTemplate)(e, t))
          } catch (e) {
            p.logWarn(e)
          }
        }
      }
      function* v() {
        const e = new Map()
        for (;;) {
          const { toolName: o, callback: i } = u(
            l.GET_TEMPLATES,
            yield (0, r.take)(l.GET_TEMPLATES),
          )
          e.has(o)
            ? (0, s.ensureDefined)(e.get(o)).push(i)
            : (e.set(o, [i]), yield (0, r.fork)(t, o))
        }
        function* t(t) {
          try {
            const e = h(
              d.backend.getDrawingTemplates,
              yield (0, r.call)(d.backend.getDrawingTemplates, t),
            )
            yield (0, r.put)((0, c.setTemplates)(t, e))
          } catch (e) {
            p.logWarn(e)
          }
          ;(0, s.ensureDefined)(e.get(t)).forEach((e) =>
            null == e ? void 0 : e(),
          ),
            e.delete(t)
        }
      }
      function* _() {
        for (;;) {
          const {
            toolName: e,
            templateName: t,
            callback: o,
          } = u(l.LOAD_TEMPLATE, yield (0, r.take)(l.LOAD_TEMPLATE))
          try {
            const i = h(
              d.backend.loadDrawingTemplate,
              yield (0, r.call)(d.backend.loadDrawingTemplate, e, t),
            )
            o && o(i)
          } catch (e) {
            p.logWarn(e)
          }
        }
      }
      function* w() {
        yield (0, r.all)([
          (0, r.call)(v),
          (0, r.call)(g),
          (0, r.call)(m),
          (0, r.call)(_),
        ])
      }
      const f = { templates: {} }
      function T(e, t) {
        return e.localeCompare(t, void 0, { numeric: !0 })
      }
      function y(e = f, t) {
        switch (t.type) {
          case l.ADD_TEMPLATE: {
            const { toolName: o, templateName: i } = t
            if (!e.templates[o].includes(i)) {
              const t = [...e.templates[o], i].sort(T)
              return { ...e, templates: { ...e.templates, [o]: t } }
            }
            return e
          }
          case l.SET_TEMPLATES: {
            const { toolName: o, templates: i } = t
            return { ...e, templates: { ...e.templates, [o]: [...i].sort(T) } }
          }
          case l.REMOVE_TEMPLATE: {
            const { toolName: o, templateName: i } = t
            return {
              ...e,
              templates: {
                ...e.templates,
                [o]: e.templates[o].filter((e) => e !== i),
              },
            }
          }
          default:
            return e
        }
      }
      const b = (() => {
        const e = (0, n.default)(),
          t = (0, i.createStore)(y, (0, i.applyMiddleware)(e))
        return e.run(w), t
      })()
    },
    29742: (e, t, o) => {
      o.d(t, {
        CollectibleColorPropertyDirectWrapper: () => l,
        CollectibleColorPropertyUndoWrapper: () => s,
      })
      var i = o(650151),
        n = o(804550)
      class r extends n.default {
        constructor(e) {
          super(),
            (this._listenersMappers = []),
            (this._isProcess = !1),
            (this._baseProperty = e)
        }
        destroy() {
          this._baseProperty.destroy(), super.destroy()
        }
        value() {
          const e = this._baseProperty.value()
          return 'mixed' === e ? '' : e
        }
        visible() {
          return this._baseProperty.visible()
        }
        setValue(e) {
          ;(this._isProcess = !0),
            this._baseProperty.setValue('' === e ? 'mixed' : e, void 0, {
              applyValue: this._applyValue.bind(this),
            }),
            (this._isProcess = !1),
            this._listenersMappers.forEach((e) => {
              e.method.call(e.obj, this, '')
            })
        }
        subscribe(e, t) {
          const o = (o) => {
              this._isProcess || t.call(e, this, '')
            },
            i = { obj: e, method: t, callback: o }
          this._listenersMappers.push(i), this._baseProperty.subscribe(e, o)
        }
        unsubscribe(e, t) {
          var o
          const n = (0, i.ensureDefined)(
            null ===
              (o = this._listenersMappers.find(
                (o) => o.obj === e && o.method === t,
              )) || void 0 === o
              ? void 0
              : o.callback,
          )
          this._baseProperty.unsubscribe(e, n)
        }
        unsubscribeAll(e) {
          this._baseProperty.unsubscribeAll(e)
        }
      }
      class s extends r {
        constructor(e, t, o) {
          super(e), (this._propertyApplier = t), (this._undoText = o)
        }
        _applyValue(e, t) {
          this._propertyApplier.setProperty(e, t, this._undoText)
        }
      }
      class l extends r {
        _applyValue(e, t) {
          e.setValue(t)
        }
      }
    },
    770366: (e, t, o) => {
      o.d(t, { CollectiblePropertyUndoWrapper: () => a })
      var i = o(650151),
        n = o(609838),
        r = o(664902),
        s = o(804550)
      const l = new r.TranslatedString(
        'change {propertyName} property',
        n.t(null, void 0, o(18567)),
      )
      class a extends s.default {
        constructor(e, t, o) {
          super(),
            (this._isProcess = !1),
            (this._listenersMappers = []),
            (this._valueApplier = {
              applyValue: (e, t) => {
                this._propertyApplier.setProperty(e, t, l)
              },
            }),
            (this._baseProperty = e),
            (this._propertyApplier = o),
            (this._propertyName = t)
        }
        destroy() {
          this._baseProperty.destroy(), super.destroy()
        }
        value() {
          return this._baseProperty.value()
        }
        setValue(e, t) {
          this._propertyApplier.beginUndoMacro(
            l.format({ propertyName: this._propertyName }),
          ),
            (this._isProcess = !0),
            this._baseProperty.setValue(e, void 0, this._valueApplier),
            (this._isProcess = !1),
            this._propertyApplier.endUndoMacro(),
            this._listenersMappers.forEach((e) => {
              e.method.call(e.obj, this, '')
            })
        }
        subscribe(e, t) {
          const o = () => {
            this._isProcess || t.call(e, this, '')
          }
          this._listenersMappers.push({ obj: e, method: t, callback: o }),
            this._baseProperty.subscribe(e, o)
        }
        unsubscribe(e, t) {
          var o
          const n = (0, i.ensureDefined)(
            null ===
              (o = this._listenersMappers.find(
                (o) => o.obj === e && o.method === t,
              )) || void 0 === o
              ? void 0
              : o.callback,
          )
          this._baseProperty.unsubscribe(e, n)
        }
        unsubscribeAll(e) {
          this._baseProperty.unsubscribeAll(e)
        }
      }
    },
    110495: (e, t, o) => {
      o.d(t, { LinetoolsFavoritesStore: () => a })
      var i = o(466052),
        n = o(870122)
      const r = ['LineToolBalloon'],
        s = !1
      var l, a
      !((e) => {
        function t() {
          var t, i
          e.favorites = []
          let a = !1
          const c = Boolean(
              void 0 === (0, n.getValue)('chart.favoriteDrawings'),
            ),
            h = (0, n.getJSON)('chart.favoriteDrawings', [])
          if (0 === h.length && c && 'undefined' != typeof window) {
            const e = JSON.parse(
              null !==
                (i =
                  null === (t = window.urlParams) || void 0 === t
                    ? void 0
                    : t.favorites) && void 0 !== i
                ? i
                : '{}',
            ).drawingTools
            e && Array.isArray(e) && h.push(...e)
          }
          h.forEach((t, i) => {
            const n = t.tool || t
            o(n)
              ? r.includes(n)
                ? (a = !0)
                : e.favorites.push(n)
              : s && s.includes(n) && e.hiddenToolsPositions.set(n, i)
          }),
            a && l(),
            e.favoritesSynced.fire()
        }
        function o(e) {
          return 'string' == typeof e && '' !== e && !(s && s.includes(e))
        }
        function l(t) {
          const o = e.favorites.slice()
          e.hiddenToolsPositions.forEach((e, t) => {
            o.splice(e, 0, t)
          }),
            (0, n.setJSON)('chart.favoriteDrawings', o, t)
        }
        ;(e.favorites = []),
          (e.favoritesSynced = new i.Delegate()),
          (e.hiddenToolsPositions = new Map()),
          (e.favoriteIndex = (t) => e.favorites.indexOf(t)),
          (e.isValidLineToolName = o),
          (e.saveFavorites = l),
          t(),
          n.onSync.subscribe(null, t)
      })(l || (l = {})),
        ((e) => {
          function t(e) {
            return l.isValidLineToolName(e)
          }
          function o() {
            return l.favorites.length
          }
          function n(e) {
            return -1 !== l.favoriteIndex(e)
          }
          ;(e.favoriteAdded = new i.Delegate()),
            (e.favoriteRemoved = new i.Delegate()),
            (e.favoriteMoved = new i.Delegate()),
            (e.favoritesSynced = l.favoritesSynced),
            (e.favorites = () => l.favorites.slice()),
            (e.isValidLineToolName = t),
            (e.favoritesCount = o),
            (e.favorite = (e) => (e < 0 || e >= o() ? '' : l.favorites[e])),
            (e.addFavorite = (o, i) =>
              !(n(o) || !t(o) || 'performance' === o) &&
              (l.favorites.push(o),
              l.saveFavorites(i),
              e.favoriteAdded.fire(o),
              !0)),
            (e.removeFavorite = (t, o) => {
              const i = l.favoriteIndex(t)
              if (-1 === i) return !1
              l.favorites.splice(i, 1)
              const n = l.hiddenToolsPositions
              return (
                n.forEach((e, t) => {
                  e > i && n.set(t, e - 1)
                }),
                l.saveFavorites(o),
                e.favoriteRemoved.fire(t),
                !0
              )
            }),
            (e.isFavorite = n),
            (e.moveFavorite = (i, n, r) => {
              if (n < 0 || n >= o() || !t(i)) return !1
              const s = l.favoriteIndex(i)
              if (-1 === s || n === s) return !1
              const a = l.hiddenToolsPositions
              return (
                a.forEach((e, t) => {
                  s < e && n > e ? e-- : n < e && s > e && e++, a.set(t, e)
                }),
                l.favorites.splice(s, 1),
                l.favorites.splice(n, 0, i),
                l.saveFavorites(r),
                e.favoriteMoved.fire(i, s, n),
                !0
              )
            })
        })(a || (a = {}))
    },
    946839: (e, t, o) => {
      o.d(t, { PropertyApplierWithoutSavingChart: () => i })
      class i {
        constructor(e, t) {
          ;(this._undoModelSupplier = e), (this._featureToggle = t)
        }
        setProperty(e, t, o) {
          this._undoModelSupplier().setProperty(
            e,
            t,
            o,
            this._featureToggle.value(),
          )
        }
        beginUndoMacro(e) {
          return this._undoModelSupplier().beginUndoMacro(
            e,
            this._shouldWeKeepChartValidated(),
          )
        }
        endUndoMacro() {
          this._undoModelSupplier().endUndoMacro()
        }
        setWatchedValue(e, t, o) {
          this._undoModelSupplier().undoHistory().setWatchedValue(e, t, o, !0)
        }
        _shouldWeKeepChartValidated() {
          const e = this._undoModelSupplier()
            .model()
            .isAutoSaveEnabled()
            .value()
          return this._featureToggle.value() && e
        }
      }
    },
    980458: (e, t, o) => {
      function i(e, t) {
        return Boolean(
          '' === e || (e && -1 !== t.toLowerCase().indexOf(e.toLowerCase())),
        )
      }
      o.d(t, { autocompleteFilter: () => i })
    },
    844996: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M7.5 13a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM5 14.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zm9.5-1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM12 14.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zm9.5-1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM19 14.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0z"/></svg>'
    },
    134059: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30" height="30"><path fill="currentColor" d="M5.5 13A2.5 2.5 0 0 0 3 15.5 2.5 2.5 0 0 0 5.5 18 2.5 2.5 0 0 0 8 15.5 2.5 2.5 0 0 0 5.5 13zm9.5 0a2.5 2.5 0 0 0-2.5 2.5A2.5 2.5 0 0 0 15 18a2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 15 13zm9.5 0a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0 2.5 2.5 2.5 2.5 0 0 0 2.5-2.5 2.5 2.5 0 0 0-2.5-2.5z"/></svg>'
    },
    363743: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M11.682 16.09l3.504 6.068 1.732-1-3.497-6.057 3.595-2.1L8 7.74v10.512l3.682-2.163zm-.362 1.372L7 20V6l12 7-4.216 2.462 3.5 6.062-3.464 2-3.5-6.062z"/></svg>'
    },
    418953: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor"><path d="M18 15h8v-1h-8z"/><path d="M14 18v8h1v-8zM14 3v8h1v-8zM3 15h8v-1h-8z"/></g></svg>'
    },
    372196: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><circle fill="currentColor" cx="14" cy="14" r="3"/></svg>'
    },
    401532: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fill-rule="evenodd"><path fill-rule="nonzero" d="M23.002 23C23 23 23 18.003 23 18.003L15.998 18C16 18 16 22.997 16 22.997l7.002.003zM15 18.003A1 1 0 0 1 15.998 17h7.004c.551 0 .998.438.998 1.003v4.994A1 1 0 0 1 23.002 24h-7.004A.993.993 0 0 1 15 22.997v-4.994z"/><path d="M19 20h1v2h-1z"/><path fill-rule="nonzero" d="M22 17.5v-2a2.5 2.5 0 0 0-5 0v2h1v-2a1.5 1.5 0 0 1 3 0v2h1z"/><g fill-rule="nonzero"><path d="M3 14.707A1 1 0 0 1 3.293 14L14.439 2.854a1.5 1.5 0 0 1 2.122 0l2.585 2.585a1.5 1.5 0 0 1 0 2.122L8 18.707a1 1 0 0 1-.707.293H4a1 1 0 0 1-1-1v-3.293zm1 0V18h3.293L18.439 6.854a.5.5 0 0 0 0-.708l-2.585-2.585a.5.5 0 0 0-.708 0L4 14.707z"/><path d="M13.146 4.854l4 4 .708-.708-4-4zm-9 9l4 4 .708-.708-4-4z"/><path d="M15.146 6.146l-9 9 .708.708 9-9z"/></g></g></svg>'
    },
    53950: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fill-rule="evenodd"><path fill-rule="nonzero" d="M23.002 23C23 23 23 18.003 23 18.003L15.998 18C16 18 16 22.997 16 22.997l7.002.003zM15 18.003A1 1 0 0 1 15.998 17h7.004c.551 0 .998.438.998 1.003v4.994A1 1 0 0 1 23.002 24h-7.004A.993.993 0 0 1 15 22.997v-4.994z"/><path d="M19 20h1v2h-1z"/><path fill-rule="nonzero" d="M22 14.5a2.5 2.5 0 0 0-5 0v3h1v-3a1.5 1.5 0 0 1 3 0v.5h1v-.5z"/><g fill-rule="nonzero"><path d="M3 14.707A1 1 0 0 1 3.293 14L14.439 2.854a1.5 1.5 0 0 1 2.122 0l2.585 2.585a1.5 1.5 0 0 1 0 2.122L8 18.707a1 1 0 0 1-.707.293H4a1 1 0 0 1-1-1v-3.293zm1 0V18h3.293L18.439 6.854a.5.5 0 0 0 0-.708l-2.585-2.585a.5.5 0 0 0-.708 0L4 14.707z"/><path d="M13.146 4.854l4 4 .708-.708-4-4zm-9 9l4 4 .708-.708-4-4z"/><path d="M15.146 6.146l-9 9 .708.708 9-9z"/></g></g></svg>'
    },
    927999: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 31" width="29" height="31"><g fill="currentColor" fill-rule="nonzero"><path d="M15.3 22l8.187-8.187c.394-.394.395-1.028.004-1.418l-4.243-4.243c-.394-.394-1.019-.395-1.407-.006l-11.325 11.325c-.383.383-.383 1.018.007 1.407l1.121 1.121h7.656zm-9.484-.414c-.781-.781-.779-2.049-.007-2.821l11.325-11.325c.777-.777 2.035-.78 2.821.006l4.243 4.243c.781.781.78 2.048-.004 2.832l-8.48 8.48h-8.484l-1.414-1.414z"/><path d="M13.011 22.999h7.999v-1h-7.999zM13.501 11.294l6.717 6.717.707-.707-6.717-6.717z"/></g></svg>'
    },
    10862: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M24.13 14.65a6.2 6.2 0 0 0-.46-9.28c-2.57-2.09-6.39-1.71-8.75.6l-.92.91-.92-.9c-2.36-2.32-6.18-2.7-8.75-.61a6.2 6.2 0 0 0-.46 9.28l9.07 8.92c.58.57 1.53.57 2.12 0l9.07-8.92Zm-9.77 8.2 9.07-8.91a5.2 5.2 0 0 0-.39-7.8c-2.13-1.73-5.38-1.45-7.42.55L14 8.29l-1.62-1.6c-2.03-2-5.29-2.28-7.42-.55a5.2 5.2 0 0 0-.4 7.8l9.08 8.91c.2.2.52.2.72 0Z"/></svg>'
    },
    268385: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fill-rule="evenodd"><path fill-rule="nonzero" d="M14 10a2 2 0 0 0-2 2v11H6V12c0-4.416 3.584-8 8-8s8 3.584 8 8v11h-6V12a2 2 0 0 0-2-2zm-3 2a3 3 0 0 1 6 0v10h4V12c0-3.864-3.136-7-7-7s-7 3.136-7 7v10h4V12z"/><path d="M6.5 18h5v1h-5zm10 0h5v1h-5z"/></g></svg>'
    },
    688518: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" d="M2 9.75a1.5 1.5 0 0 0-1.5 1.5v5.5a1.5 1.5 0 0 0 1.5 1.5h24a1.5 1.5 0 0 0 1.5-1.5v-5.5a1.5 1.5 0 0 0-1.5-1.5zm0 1h3v2.5h1v-2.5h3.25v3.9h1v-3.9h3.25v2.5h1v-2.5h3.25v3.9h1v-3.9H22v2.5h1v-2.5h3a.5.5 0 0 1 .5.5v5.5a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5v-5.5a.5.5 0 0 1 .5-.5z" transform="rotate(-45 14 14)"/></svg>'
    },
    36515: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor"><path fill-rule="nonzero" d="M14 18.634l-.307-.239-7.37-5.73-2.137-1.665 9.814-7.633 9.816 7.634-.509.394-1.639 1.269-7.667 5.969zm7.054-6.759l1.131-.876-8.184-6.366-8.186 6.367 1.123.875 7.063 5.491 7.054-5.492z"/><path d="M7 14.5l-1 .57 8 6.43 8-6.5-1-.5-7 5.5z"/><path d="M7 17.5l-1 .57 8 6.43 8-6.5-1-.5-7 5.5z"/></g></svg>'
    },
    507636: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M4.05 14a9.95 9.95 0 1 1 19.9 0 9.95 9.95 0 0 1-19.9 0ZM14 3a11 11 0 1 0 0 22 11 11 0 0 0 0-22Zm-3 13.03a.5.5 0 0 1 .64.3 2.5 2.5 0 0 0 4.72 0 .5.5 0 0 1 .94.34 3.5 3.5 0 0 1-6.6 0 .5.5 0 0 1 .3-.64Zm.5-4.53a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm5 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></svg>'
    },
    662567: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M7 4h14a3 3 0 0 1 3 3v11c0 .34-.03.67-.08 1H20.3c-1.28 0-2.31.97-2.31 2.24V24H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Zm12 19.92A6 6 0 0 0 23.66 20H20.3c-.77 0-1.31.48-1.31 1.24v2.68ZM3 7a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4v11a7 7 0 0 1-7 7H7a4 4 0 0 1-4-4V7Zm8 9.03a.5.5 0 0 1 .64.3 2.5 2.5 0 0 0 4.72 0 .5.5 0 0 1 .94.34 3.5 3.5 0 0 1-6.6 0 .5.5 0 0 1 .3-.64Zm.5-4.53a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm5 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></svg>'
    },
    146049: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="nonzero" d="M14 5a7 7 0 0 0-7 7v3h4v-3a3 3 0 1 1 6 0v3h4v-3a7 7 0 0 0-7-7zm7 11h-4v3h4v-3zm-10 0H7v3h4v-3zm-5-4a8 8 0 1 1 16 0v8h-6v-8a2 2 0 1 0-4 0v8H6v-8zm3.293 11.294l-1.222-2.037.858-.514 1.777 2.963-2 1 1.223 2.037-.858.514-1.778-2.963 2-1zm9.778-2.551l.858.514-1.223 2.037 2 1-1.777 2.963-.858-.514 1.223-2.037-2-1 1.777-2.963z"/></svg>'
    },
    299088: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor"><path fill-rule="nonzero" d="M15.039 5.969l-.019-.019-2.828 2.828.707.707 2.474-2.474c1.367-1.367 3.582-1.367 4.949 0s1.367 3.582 0 4.949l-2.474 2.474.707.707 2.828-2.828-.019-.019c1.415-1.767 1.304-4.352-.334-5.99-1.638-1.638-4.224-1.749-5.99-.334zM5.97 15.038l-.019-.019 2.828-2.828.707.707-2.475 2.475c-1.367 1.367-1.367 3.582 0 4.949s3.582 1.367 4.949 0l2.474-2.474.707.707-2.828 2.828-.019-.019c-1.767 1.415-4.352 1.304-5.99-.334-1.638-1.638-1.749-4.224-.334-5.99z"/><path d="M10.485 16.141l5.656-5.656.707.707-5.656 5.656z"/></g></svg>'
    },
    842650: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M19.76 6.07l-.7.7a13.4 13.4 0 011.93 2.47c.19.3.33.55.42.72l.03.04-.03.04a15 15 0 01-2.09 2.9c-1.47 1.6-3.6 3.12-6.32 3.12-.98 0-1.88-.2-2.7-.52l-.77.76c1.03.47 2.18.76 3.47.76 3.12 0 5.5-1.75 7.06-3.44a16 16 0 002.38-3.38v-.02h.01L22 10l.45.22.1-.22-.1-.22L22 10l.45-.22-.01-.02a5.1 5.1 0 00-.15-.28 16 16 0 00-2.53-3.41zM6.24 13.93l.7-.7-.27-.29a15 15 0 01-2.08-2.9L4.56 10l.03-.04a15 15 0 012.09-2.9c1.47-1.6 3.6-3.12 6.32-3.12.98 0 1.88.2 2.7.52l.77-.76A8.32 8.32 0 0013 2.94c-3.12 0-5.5 1.75-7.06 3.44a16 16 0 00-2.38 3.38v.02h-.01L4 10l-.45-.22-.1.22.1.22L4 10l-.45.22.01.02a5.5 5.5 0 00.15.28 16 16 0 002.53 3.41zm6.09-.43a3.6 3.6 0 004.24-4.24l-.93.93a2.6 2.6 0 01-2.36 2.36l-.95.95zm-1.97-3.69l-.93.93a3.6 3.6 0 014.24-4.24l-.95.95a2.6 2.6 0 00-2.36 2.36zm11.29 7.84l-.8.79a1.5 1.5 0 000 2.12l.59.59a1.5 1.5 0 002.12 0l1.8-1.8-.71-.7-1.8 1.79a.5.5 0 01-.7 0l-.59-.59a.5.5 0 010-.7l.8-.8-.71-.7zm-5.5 3.5l.35.35-.35-.35.01-.02.02-.02.02-.02a4.68 4.68 0 01.65-.5c.4-.27 1-.59 1.65-.59.66 0 1.28.33 1.73.77.44.45.77 1.07.77 1.73a2.5 2.5 0 01-.77 1.73 2.5 2.5 0 01-1.73.77h-4a.5.5 0 01-.42-.78l1-1.5 1-1.5a.5.5 0 01.07-.07zm.74.67a3.46 3.46 0 01.51-.4c.35-.24.75-.42 1.1-.42.34 0 .72.17 1.02.48.3.3.48.68.48 1.02 0 .34-.17.72-.48 1.02-.3.3-.68.48-1.02.48h-3.07l.49-.72.97-1.46zM21.2 2.5L5.5 18.2l-.7-.7L20.5 1.8l.7.7z"/></svg>'
    },
    875895: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" d="M16.47 3.7A8.32 8.32 0 0013 2.94c-3.12 0-5.5 1.75-7.06 3.44a16 16 0 00-2.38 3.38v.02h-.01L4 10l-.45-.22-.1.22.1.22L4 10l-.45.22.01.02a5.5 5.5 0 00.15.28 16 16 0 002.53 3.41l.7-.7-.27-.29a15 15 0 01-2.08-2.9L4.56 10l.03-.04a15 15 0 012.09-2.9c1.47-1.6 3.6-3.12 6.32-3.12.98 0 1.88.2 2.7.52l.77-.76zm-7.04 7.04l.93-.93a2.6 2.6 0 012.36-2.36l.95-.95a3.6 3.6 0 00-4.24 4.24zm.1 5.56c1.03.47 2.18.76 3.47.76 3.12 0 5.5-1.75 7.06-3.44a16 16 0 002.38-3.38v-.02h.01L22 10l.45.22.1-.22-.1-.22L22 10l.45-.22-.01-.02-.02-.03-.01-.03a9.5 9.5 0 00-.57-1 16 16 0 00-2.08-2.63l-.7.7.27.29a15.01 15.01 0 012.08 2.9l.03.04-.03.04a15 15 0 01-2.09 2.9c-1.47 1.6-3.6 3.12-6.32 3.12-.98 0-1.88-.2-2.7-.52l-.77.76zm2.8-2.8a3.6 3.6 0 004.24-4.24l-.93.93a2.6 2.6 0 01-2.36 2.36l-.95.95zm7.9 3.73c-.12.12-.23.35-.23.77v2h1v1h-1v2c0 .58-.14 1.1-.52 1.48-.38.38-.9.52-1.48.52s-1.1-.14-1.48-.52c-.38-.38-.52-.9-.52-1.48h1c0 .42.1.65.23.77.12.12.35.23.77.23.42 0 .65-.1.77-.23.12-.12.23-.35.23-.77v-2h-1v-1h1v-2c0-.58.14-1.1.52-1.48.38-.38.9-.52 1.48-.52s1.1.14 1.48.52c.38.38.52.9.52 1.48h-1c0-.42-.1-.65-.23-.77-.12-.12-.35-.23-.77-.23-.42 0-.65.1-.77.23zm2.56 6.27l-1.14-1.15.7-.7 1.15 1.14 1.15-1.14.7.7-1.14 1.15 1.14 1.15-.7.7-1.15-1.14-1.15 1.14-.7-.7 1.14-1.15zM21.2 2.5L5.5 18.2l-.7-.7L20.5 1.8l.7.7z"/></svg>'
    },
    265162: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M5.5 18.2L21.2 2.5l-.7-.7L4.8 17.5l.7.7zM19.05 6.78l.71-.7a14.26 14.26 0 0 1 2.08 2.64 14.26 14.26 0 0 1 .6 1.05v.02h.01L22 10l.45.22-.01.02a5.18 5.18 0 0 1-.15.28 16 16 0 0 1-2.23 3.1c-1.56 1.69-3.94 3.44-7.06 3.44-1.29 0-2.44-.3-3.47-.76l.76-.76c.83.32 1.73.52 2.71.52 2.73 0 4.85-1.53 6.33-3.12a15.01 15.01 0 0 0 2.08-2.9l.03-.04-.03-.04a15 15 0 0 0-2.36-3.18zM22 10l.45-.22.1.22-.1.22L22 10zM6.94 13.23l-.7.7a14.24 14.24 0 0 1-2.08-2.64 14.28 14.28 0 0 1-.6-1.05v-.02h-.01L4 10l-.45-.22.01-.02a5.55 5.55 0 0 1 .15-.28 16 16 0 0 1 2.23-3.1C7.5 4.69 9.88 2.94 13 2.94c1.29 0 2.44.3 3.47.76l-.76.76A7.27 7.27 0 0 0 13 3.94c-2.73 0-4.85 1.53-6.33 3.12a15 15 0 0 0-2.08 2.9l-.03.04.03.04a15.01 15.01 0 0 0 2.36 3.18zM4 10l-.45.22-.1-.22.1-.22L4 10zm9 3.56c-.23 0-.46-.02-.67-.06l.95-.95a2.6 2.6 0 0 0 2.36-2.36l.93-.93a3.6 3.6 0 0 1-3.57 4.3zm-3.57-2.82l.93-.93a2.6 2.6 0 0 1 2.36-2.36l.95-.95a3.6 3.6 0 0 0-4.24 4.24zM17.5 21.9l3.28 2.18a.5.5 0 1 1-.56.84L17.5 23.1l-2.72 1.82a.5.5 0 1 1-.56-.84l3.28-2.18zM18.58 19.22a.5.5 0 0 1 .7-.14L22 20.9l2.72-1.82a.5.5 0 0 1 .56.84L22 22.1l-3.28-2.18a.5.5 0 0 1-.14-.7z"/></svg>'
    },
    665186: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M14 6a3 3 0 0 0-3 3v3h6V9a3 3 0 0 0-3-3zm4 6V9a4 4 0 0 0-8 0v3H8.5A2.5 2.5 0 0 0 6 14.5v7A2.5 2.5 0 0 0 8.5 24h11a2.5 2.5 0 0 0 2.5-2.5v-7a2.5 2.5 0 0 0-2.5-2.5H18zm-5 5a1 1 0 1 1 2 0v2a1 1 0 1 1-2 0v-2zm-6-2.5c0-.83.67-1.5 1.5-1.5h11c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5h-11A1.5 1.5 0 0 1 7 21.5v-7z"/></svg>'
    },
    691244: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M14 6a3 3 0 0 0-3 3v3h8.5a2.5 2.5 0 0 1 2.5 2.5v7a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 6 21.5v-7A2.5 2.5 0 0 1 8.5 12H10V9a4 4 0 0 1 8 0h-1a3 3 0 0 0-3-3zm-1 11a1 1 0 1 1 2 0v2a1 1 0 1 1-2 0v-2zm-6-2.5c0-.83.67-1.5 1.5-1.5h11c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5h-11A1.5 1.5 0 0 1 7 21.5v-7z"/></svg>'
    },
    245820: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M4.56 14a10.05 10.05 0 00.52.91c.41.69 1.04 1.6 1.85 2.5C8.58 19.25 10.95 21 14 21c3.05 0 5.42-1.76 7.07-3.58A17.18 17.18 0 0023.44 14a9.47 9.47 0 00-.52-.91c-.41-.69-1.04-1.6-1.85-2.5C19.42 8.75 17.05 7 14 7c-3.05 0-5.42 1.76-7.07 3.58A17.18 17.18 0 004.56 14zM24 14l.45-.21-.01-.03a7.03 7.03 0 00-.16-.32c-.11-.2-.28-.51-.5-.87-.44-.72-1.1-1.69-1.97-2.65C20.08 7.99 17.45 6 14 6c-3.45 0-6.08 2-7.8 3.92a18.18 18.18 0 00-2.64 3.84v.02h-.01L4 14l-.45-.21-.1.21.1.21L4 14l-.45.21.01.03a5.85 5.85 0 00.16.32c.11.2.28.51.5.87.44.72 1.1 1.69 1.97 2.65C7.92 20.01 10.55 22 14 22c3.45 0 6.08-2 7.8-3.92a18.18 18.18 0 002.64-3.84v-.02h.01L24 14zm0 0l.45.21.1-.21-.1-.21L24 14zm-10-3a3 3 0 100 6 3 3 0 000-6zm-4 3a4 4 0 118 0 4 4 0 01-8 0z"/></svg>'
    },
    193756: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M5 10.76l-.41-.72-.03-.04.03-.04a15 15 0 012.09-2.9c1.47-1.6 3.6-3.12 6.32-3.12 2.73 0 4.85 1.53 6.33 3.12a15.01 15.01 0 012.08 2.9l.03.04-.03.04a15 15 0 01-2.09 2.9c-1.47 1.6-3.6 3.12-6.32 3.12-2.73 0-4.85-1.53-6.33-3.12a15 15 0 01-1.66-2.18zm17.45-.98L22 10l.45.22-.01.02a5.04 5.04 0 01-.15.28 16.01 16.01 0 01-2.23 3.1c-1.56 1.69-3.94 3.44-7.06 3.44-3.12 0-5.5-1.75-7.06-3.44a16 16 0 01-2.38-3.38v-.02h-.01L4 10l-.45-.22.01-.02a5.4 5.4 0 01.15-.28 16 16 0 012.23-3.1C7.5 4.69 9.88 2.94 13 2.94c3.12 0 5.5 1.75 7.06 3.44a16.01 16.01 0 012.38 3.38v.02h.01zM22 10l.45-.22.1.22-.1.22L22 10zM3.55 9.78L4 10l-.45.22-.1-.22.1-.22zm6.8.22A2.6 2.6 0 0113 7.44 2.6 2.6 0 0115.65 10 2.6 2.6 0 0113 12.56 2.6 2.6 0 0110.35 10zM13 6.44A3.6 3.6 0 009.35 10 3.6 3.6 0 0013 13.56c2 0 3.65-1.58 3.65-3.56A3.6 3.6 0 0013 6.44zm7.85 12l.8-.8.7.71-.79.8a.5.5 0 000 .7l.59.59c.2.2.5.2.7 0l1.8-1.8.7.71-1.79 1.8a1.5 1.5 0 01-2.12 0l-.59-.59a1.5 1.5 0 010-2.12zM16.5 21.5l-.35-.35a.5.5 0 00-.07.07l-1 1.5-1 1.5a.5.5 0 00.42.78h4a2.5 2.5 0 001.73-.77A2.5 2.5 0 0021 22.5a2.5 2.5 0 00-.77-1.73A2.5 2.5 0 0018.5 20a3.1 3.1 0 00-1.65.58 5.28 5.28 0 00-.69.55v.01h-.01l.35.36zm.39.32l-.97 1.46-.49.72h3.07c.34 0 .72-.17 1.02-.48.3-.3.48-.68.48-1.02 0-.34-.17-.72-.48-1.02-.3-.3-.68-.48-1.02-.48-.35 0-.75.18-1.1.42a4.27 4.27 0 00-.51.4z"/></svg>'
    },
    842321: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M5 10.76a13.27 13.27 0 01-.41-.72L4.56 10l.03-.04a15 15 0 012.08-2.9c1.48-1.6 3.6-3.12 6.33-3.12s4.85 1.53 6.33 3.12a15.01 15.01 0 012.08 2.9l.03.04-.03.04a15 15 0 01-2.08 2.9c-1.48 1.6-3.6 3.12-6.33 3.12s-4.85-1.53-6.33-3.12a15 15 0 01-1.66-2.18zm17.45-.98L22 10l.45.22-.01.02a14.3 14.3 0 01-.6 1.05c-.4.64-1 1.48-1.78 2.33-1.56 1.7-3.94 3.44-7.06 3.44s-5.5-1.75-7.06-3.44a16 16 0 01-2.23-3.1 9.39 9.39 0 01-.15-.28v-.02h-.01L4 10l-.45-.22.01-.02a5.59 5.59 0 01.15-.28 16 16 0 012.23-3.1C7.5 4.69 9.87 2.94 13 2.94c3.12 0 5.5 1.75 7.06 3.44a16 16 0 012.23 3.1 9.5 9.5 0 01.15.28v.01l.01.01zM22 10l.45-.22.1.22-.1.22L22 10zM3.55 9.78L4 10l-.45.22-.1-.22.1-.22zm6.8.22A2.6 2.6 0 0113 7.44 2.6 2.6 0 0115.65 10 2.6 2.6 0 0113 12.56 2.6 2.6 0 0110.35 10zM13 6.44A3.6 3.6 0 009.35 10c0 1.98 1.65 3.56 3.65 3.56s3.65-1.58 3.65-3.56A3.6 3.6 0 0013 6.44zM20 18c0-.42.1-.65.23-.77.12-.13.35-.23.77-.23.42 0 .65.1.77.23.13.12.23.35.23.77h1c0-.58-.14-1.1-.52-1.48-.38-.38-.9-.52-1.48-.52s-1.1.14-1.48.52c-.37.38-.52.9-.52 1.48v2h-1v1h1v2c0 .42-.1.65-.23.77-.12.13-.35.23-.77.23-.42 0-.65-.1-.77-.23-.13-.12-.23-.35-.23-.77h-1c0 .58.14 1.1.52 1.48.38.37.9.52 1.48.52s1.1-.14 1.48-.52c.37-.38.52-.9.52-1.48v-2h1v-1h-1v-2zm1.65 4.35l1.14 1.15-1.14 1.15.7.7 1.15-1.14 1.15 1.14.7-.7-1.14-1.15 1.14-1.15-.7-.7-1.15 1.14-1.15-1.14-.7.7z"/></svg>'
    },
    157313: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M4.5 10a8.46 8.46 0 0 0 .46.8c.38.6.94 1.4 1.68 2.19 1.48 1.6 3.62 3.13 6.36 3.13s4.88-1.53 6.36-3.13A15.07 15.07 0 0 0 21.5 10a7.41 7.41 0 0 0-.46-.8c-.38-.6-.94-1.4-1.68-2.19-1.48-1.6-3.62-3.13-6.36-3.13S8.12 5.4 6.64 7A15.07 15.07 0 0 0 4.5 10zM22 10l.41-.19-.4.19zm0 0l.41.19-.4-.19zm.41.19l.09-.19-.09-.19-.01-.02a6.86 6.86 0 0 0-.15-.28c-.1-.18-.25-.45-.45-.76-.4-.64-.99-1.48-1.77-2.32C18.47 4.74 16.11 3 13 3 9.89 3 7.53 4.74 5.97 6.43A15.94 15.94 0 0 0 3.6 9.79v.02h-.01L3.5 10l.09.19.01.02a6.59 6.59 0 0 0 .15.28c.1.18.25.45.45.76.4.64.99 1.48 1.77 2.32C7.53 15.26 9.89 17 13 17c3.11 0 5.47-1.74 7.03-3.43a15.94 15.94 0 0 0 2.37-3.36v-.02h.01zM4 10l-.41-.19.4.19zm9-2.63c-1.5 0-2.7 1.18-2.7 2.63s1.2 2.63 2.7 2.63c1.5 0 2.7-1.18 2.7-2.63S14.5 7.37 13 7.37zM9.4 10C9.4 8.07 11 6.5 13 6.5s3.6 1.57 3.6 3.5S15 13.5 13 13.5A3.55 3.55 0 0 1 9.4 10zm8.1 11.9l3.28 2.18a.5.5 0 1 1-.56.84L17.5 23.1l-2.72 1.82a.5.5 0 1 1-.56-.84l3.28-2.18zm1.78-2.82a.5.5 0 0 0-.56.84L22 22.1l3.28-2.18a.5.5 0 1 0-.56-.84L22 20.9l-2.72-1.82z"/></svg>'
    },
    6894: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M17.646 18.354l4 4 .708-.708-4-4z"/><path d="M12.5 21a8.5 8.5 0 1 1 0-17 8.5 8.5 0 0 1 0 17zm0-1a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z"/><path d="M9 13h7v-1H9z"/><path d="M13 16V9h-1v7z"/></svg>'
    },
    745360: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M17.646 18.354l4 4 .708-.708-4-4z"/><path d="M12.5 21a8.5 8.5 0 1 1 0-17 8.5 8.5 0 0 1 0 17zm0-1a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z"/><path d="M9 13h7v-1H9z"/></svg>'
    },
    123851: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" d="M4 13h5v1H4v-1zM12 13h5v1h-5v-1zM20 13h5v1h-5v-1z"/></svg>'
    },
    357740: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor"><circle cx="9" cy="14" r="1"/><circle cx="4" cy="14" r="1"/><circle cx="14" cy="14" r="1"/><circle cx="19" cy="14" r="1"/><circle cx="24" cy="14" r="1"/></svg>'
    },
    780427: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M5.5 7a.5.5 0 0 0 0 1h17a.5.5 0 0 0 0-1h-17Zm0 6a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3Zm7 0a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3Zm6.5.5c0-.28.22-.5.5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5ZM7 20a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm5-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/></svg>'
    },
    200501: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path stroke="currentColor" d="M4 13.5h20"/></svg>'
    },
    636296: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M8 9.5H6.5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V20m-8-1.5h11a1 1 0 0 0 1-1v-11a1 1 0 0 0-1-1h-11a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1z"/></svg>'
    },
    621065: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" fill="none"><path stroke="currentColor" d="M13.5 6.5l-3-3-7 7 7.59 7.59a2 2 0 0 0 2.82 0l4.18-4.18a2 2 0 0 0 0-2.82L13.5 6.5zm0 0v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6"/><path fill="currentColor" d="M0 16.5C0 15 2.5 12 2.5 12S5 15 5 16.5 4 19 2.5 19 0 18 0 16.5z"/><circle fill="currentColor" cx="9.5" cy="9.5" r="1.5"/></svg>'
    },
    25388: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 12" width="8" height="12" fill="currentColor"><rect width="2" height="2" rx="1"/><rect width="2" height="2" rx="1" y="5"/><rect width="2" height="2" rx="1" y="10"/><rect width="2" height="2" rx="1" x="6"/><rect width="2" height="2" rx="1" x="6" y="5"/><rect width="2" height="2" rx="1" x="6" y="10"/></svg>'
    },
    222978: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 1" width="18" height="1"><rect width="18" height="1" fill="currentColor" rx=".5"/></svg>'
    },
    114631: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 2" width="18" height="2"><rect width="18" height="2" fill="currentColor" rx="1"/></svg>'
    },
    206096: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 3" width="18" height="3"><rect width="18" height="3" fill="currentColor" rx="1.5"/></svg>'
    },
    206483: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 4" width="18" height="4"><rect width="18" height="4" fill="currentColor" rx="2"/></svg>'
    },
    266611: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><rect width="18" height="2" rx="1" x="5" y="14"/><rect width="18" height="1" rx=".5" x="5" y="20"/><rect width="18" height="3" rx="1.5" x="5" y="7"/></svg>'
    },
    394071: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" width="17" height="17" fill="none"><path stroke="currentColor" d="M1.5 11.5l-.7.7a1 1 0 0 0-.3.71v3.59h3.59a1 1 0 0 0 .7-.3l.71-.7m-4-4l9-9m-9 9l2 2m2 2l9-9m-9 9l-2-2m11-7l1.3-1.3a1 1 0 0 0 0-1.4l-2.6-2.6a1 1 0 0 0-1.4 0l-1.3 1.3m4 4l-4-4m-7 11l9-9"/></svg>'
    },
    608280: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none" stroke="currentColor"><path stroke-linecap="round" d="M15.5 18.5h6m-3 3v-6"/><rect width="6" height="6" rx="1.5" x="6.5" y="6.5"/><rect width="6" height="6" rx="1.5" x="15.5" y="6.5"/><rect width="6" height="6" rx="1.5" x="6.5" y="15.5"/></svg>'
    },
    448984: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 15" width="13" height="15" fill="none"><path stroke="currentColor" d="M4 14.5h2.5m2.5 0H6.5m0 0V.5m0 0h-5a1 1 0 0 0-1 1V4m6-3.5h5a1 1 0 0 1 1 1V4"/></svg>'
    },
    561964: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path fill="currentcolor" fill-rule="evenodd" clip-rule="evenodd" d="M13 5.5c0-.28.22-.5.5-.5h1c.28 0 .5.22.5.5V7.05l.4.09c.9.18 1.73.53 2.46 1.02l.34.23.29-.3.81-.8c.2-.2.52-.2.71 0l.7.7.36-.35-.35.35c.2.2.2.51 0 .7l-.82.82-.29.29.23.34c.49.73.84 1.57 1.02 2.46l.08.4H22.5c.28 0 .5.22.5.5v1a.5.5 0 0 1-.5.5H20.95l-.09.4c-.18.9-.53 1.73-1.02 2.46l-.23.34.3.29.8.81c.2.2.2.52 0 .71l-.7.7a.5.5 0 0 1-.7 0l-.82-.8-.29-.3-.34.23c-.73.49-1.57.84-2.46 1.02l-.4.08V22.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5V20.95l-.4-.09a6.96 6.96 0 0 1-2.46-1.02l-.34-.23-.29.3-.81.8.35.36-.35-.35a.5.5 0 0 1-.71 0l-.7-.71a.5.5 0 0 1 0-.7l-.36-.36.35.35.82-.81.29-.29-.23-.34a6.96 6.96 0 0 1-1.02-2.46l-.08-.4H5.5a.5.5 0 0 1-.5-.5v-1c0-.28.22-.5.5-.5H7.05l.09-.4c.18-.9.53-1.73 1.02-2.46l.23-.34-.3-.29-.8-.81a.5.5 0 0 1 0-.71l.7-.7c.2-.2.51-.2.7 0l.82.8.29.3.34-.23a6.96 6.96 0 0 1 2.46-1.02l.4-.08V5.5zm.5-1.5c-.83 0-1.5.67-1.5 1.5v.75c-.73.2-1.43.48-2.06.86l-.54-.53a1.5 1.5 0 0 0-2.12 0l-.7.7a1.5 1.5 0 0 0 0 2.12l.53.54A7.95 7.95 0 0 0 6.25 12H5.5c-.83 0-1.5.67-1.5 1.5v1c0 .83.67 1.5 1.5 1.5h.75c.2.73.48 1.43.86 2.06l-.53.54a1.5 1.5 0 0 0 0 2.12l.7.7a1.5 1.5 0 0 0 2.12 0l.54-.53c.63.38 1.33.67 2.06.86v.75c0 .83.67 1.5 1.5 1.5h1c.83 0 1.5-.67 1.5-1.5v-.75a7.95 7.95 0 0 0 2.06-.86l.54.53a1.5 1.5 0 0 0 2.12 0l.7-.7a1.5 1.5 0 0 0 0-2.12l-.53-.54c.38-.63.67-1.33.86-2.06h.75c.83 0 1.5-.67 1.5-1.5v-1c0-.83-.67-1.5-1.5-1.5h-.75a7.95 7.95 0 0 0-.86-2.06l.53-.54a1.5 1.5 0 0 0 0-2.12l-.7-.7a1.5 1.5 0 0 0-2.12 0l-.54.53A7.95 7.95 0 0 0 16 6.25V5.5c0-.83-.67-1.5-1.5-1.5h-1zM12 14a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm2-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>'
    },
    925931: (e, t, o) => {
      o.d(t, { nanoid: () => i })
      const i = (e = 21) =>
        crypto
          .getRandomValues(new Uint8Array(e))
          .reduce(
            (e, t) =>
              (e +=
                (t &= 63) < 36
                  ? t.toString(36)
                  : t < 62
                    ? (t - 26).toString(36).toUpperCase()
                    : t > 62
                      ? '-'
                      : '_'),
            '',
          )
    },
  },
])
