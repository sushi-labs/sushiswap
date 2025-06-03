;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [4811],
  {
    540191: (e) => {
      e.exports = {
        menuWrap: 'menuWrap-Kq3ruQo8',
        isMeasuring: 'isMeasuring-Kq3ruQo8',
        scrollWrap: 'scrollWrap-Kq3ruQo8',
        momentumBased: 'momentumBased-Kq3ruQo8',
        menuBox: 'menuBox-Kq3ruQo8',
        isHidden: 'isHidden-Kq3ruQo8',
      }
    },
    908783: (e, t, n) => {
      n.d(t, { useOutsideEvent: () => r })
      var s = n(50959),
        i = n(778199)
      function r(e) {
        const {
            click: t,
            mouseDown: n,
            touchEnd: r,
            touchStart: o,
            handler: l,
            reference: a,
            ownerDocument: u = document,
          } = e,
          c = (0, s.useRef)(null),
          d = (0, s.useRef)(new CustomEvent('timestamp').timeStamp)
        return (
          (0, s.useLayoutEffect)(() => {
            const e = { click: t, mouseDown: n, touchEnd: r, touchStart: o },
              s = a ? a.current : c.current
            return (0, i.addOutsideEventListener)(d.current, s, l, u, e)
          }, [t, n, r, o, l]),
          a || c
        )
      }
    },
    823030: (e, t, n) => {
      n.d(t, { SubmenuContext: () => i, SubmenuHandler: () => r })
      var s = n(50959)
      const i = s.createContext(null)
      function r(e) {
        const [t, n] = (0, s.useState)(null),
          r = (0, s.useRef)(null),
          o = (0, s.useRef)(new Map())
        return (
          (0, s.useEffect)(
            () => () => {
              null !== r.current && clearTimeout(r.current)
            },
            [],
          ),
          s.createElement(
            i.Provider,
            {
              value: {
                current: t,
                setCurrent: (e) => {
                  null !== r.current &&
                    (clearTimeout(r.current), (r.current = null))
                  null === t
                    ? n(e)
                    : (r.current = setTimeout(() => {
                        ;(r.current = null), n(e)
                      }, 100))
                },
                registerSubmenu: (e, t) => (
                  o.current.set(e, t),
                  () => {
                    o.current.delete(e)
                  }
                ),
                isSubmenuNode: (e) =>
                  Array.from(o.current.values()).some((t) => t(e)),
              },
            },
            e.children,
          )
        )
      }
    },
    682925: (e, t, n) => {
      n.d(t, { Slot: () => i, SlotContext: () => r })
      var s = n(50959)
      class i extends s.Component {
        shouldComponentUpdate() {
          return !1
        }
        render() {
          return s.createElement('div', {
            style: { position: 'fixed', zIndex: 150, left: 0, top: 0 },
            ref: this.props.reference,
          })
        }
      }
      const r = s.createContext(null)
    },
    801808: (e, t, n) => {
      n.d(t, { OverlapManager: () => r, getRootOverlapManager: () => l })
      var s = n(650151)
      class i {
        constructor() {
          this._storage = []
        }
        add(e) {
          this._storage.push(e)
        }
        remove(e) {
          this._storage = this._storage.filter((t) => e !== t)
        }
        has(e) {
          return this._storage.includes(e)
        }
        getItems() {
          return this._storage
        }
      }
      class r {
        constructor(e = document) {
          ;(this._storage = new i()),
            (this._windows = new Map()),
            (this._index = 0),
            (this._document = e),
            (this._container = e.createDocumentFragment())
        }
        setContainer(e) {
          const t = this._container,
            n = null === e ? this._document.createDocumentFragment() : e
          !((e, t) => {
            Array.from(e.childNodes).forEach((e) => {
              e.nodeType === Node.ELEMENT_NODE && t.appendChild(e)
            })
          })(t, n),
            (this._container = n)
        }
        registerWindow(e) {
          this._storage.has(e) || this._storage.add(e)
        }
        ensureWindow(e, t = { position: 'fixed', direction: 'normal' }) {
          const n = this._windows.get(e)
          if (void 0 !== n) return n
          this.registerWindow(e)
          const s = this._document.createElement('div')
          if (
            ((s.style.position = t.position),
            (s.style.zIndex = this._index.toString()),
            (s.dataset.id = e),
            void 0 !== t.index)
          ) {
            const e = this._container.childNodes.length
            if (t.index >= e) this._container.appendChild(s)
            else if (t.index <= 0)
              this._container.insertBefore(s, this._container.firstChild)
            else {
              const e = this._container.childNodes[t.index]
              this._container.insertBefore(s, e)
            }
          } else
            'reverse' === t.direction
              ? this._container.insertBefore(s, this._container.firstChild)
              : this._container.appendChild(s)
          return this._windows.set(e, s), ++this._index, s
        }
        unregisterWindow(e) {
          this._storage.remove(e)
          const t = this._windows.get(e)
          void 0 !== t &&
            (null !== t.parentElement && t.parentElement.removeChild(t),
            this._windows.delete(e))
        }
        getZindex(e) {
          const t = this.ensureWindow(e)
          return Number.parseInt(t.style.zIndex || '0')
        }
        moveToTop(e) {
          if (this.getZindex(e) !== this._index) {
            this.ensureWindow(e).style.zIndex = (++this._index).toString()
          }
        }
        removeWindow(e) {
          this.unregisterWindow(e)
        }
      }
      const o = new WeakMap()
      function l(e = document) {
        const t = e.getElementById('overlap-manager-root')
        if (null !== t) return (0, s.ensureDefined)(o.get(t))
        {
          const t = new r(e),
            n = ((e) => {
              const t = e.createElement('div')
              return (
                (t.style.position = 'absolute'),
                (t.style.zIndex = (150).toString()),
                (t.style.top = '0px'),
                (t.style.left = '0px'),
                (t.id = 'overlap-manager-root'),
                t
              )
            })(e)
          return o.set(n, t), t.setContainer(n), e.body.appendChild(n), t
        }
      }
    },
    285089: (e, t, n) => {
      n.d(t, { setFixedBodyState: () => a })
      var s = n(735922)
      const i = () =>
          !window.matchMedia('screen and (min-width: 768px)').matches,
        r = () => !window.matchMedia('screen and (min-width: 1280px)').matches
      let o = 0,
        l = !1
      function a(e) {
        const { body: t } = document,
          n = t.querySelector('.widgetbar-wrap')
        if (e && 1 == ++o) {
          const e = (0, s.getCSSProperty)(t, 'overflow'),
            i = (0, s.getCSSPropertyNumericValue)(t, 'padding-right')
          'hidden' !== e.toLowerCase() &&
            t.scrollHeight > t.offsetHeight &&
            ((0, s.setStyle)(n, 'right', `${(0, s.getScrollbarWidth)()}px`),
            (t.style.paddingRight = `${i + ((0, s.getScrollbarWidth))()}px`),
            (l = !0)),
            t.classList.add('i-no-scroll')
        } else if (
          !e &&
          o > 0 &&
          0 == --o &&
          (t.classList.remove('i-no-scroll'), l)
        ) {
          ;(0, s.setStyle)(n, 'right', '0px')
          let e = 0
          ;(e = n
            ? ((a = (0, s.getContentWidth)(n)),
              i() ? 0 : r() ? 45 : Math.min(Math.max(a, 45), 450))
            : 0),
            t.scrollHeight <= t.clientHeight &&
              (e -= (0, s.getScrollbarWidth)()),
            (t.style.paddingRight = (e < 0 ? 0 : e) + 'px'),
            (l = !1)
        }
        var a
      }
    },
    930052: (e, t, n) => {
      n.d(t, { MatchMedia: () => i })
      var s = n(50959)
      class i extends s.PureComponent {
        constructor(e) {
          super(e),
            (this._handleChange = () => {
              this.forceUpdate()
            }),
            (this.state = { query: window.matchMedia(this.props.rule) })
        }
        componentDidMount() {
          this._subscribe(this.state.query)
        }
        componentDidUpdate(e, t) {
          this.state.query !== t.query &&
            (this._unsubscribe(t.query), this._subscribe(this.state.query))
        }
        componentWillUnmount() {
          this._unsubscribe(this.state.query)
        }
        render() {
          return this.props.children(this.state.query.matches)
        }
        static getDerivedStateFromProps(e, t) {
          return e.rule !== t.query.media
            ? { query: window.matchMedia(e.rule) }
            : null
        }
        _subscribe(e) {
          e.addListener(this._handleChange)
        }
        _unsubscribe(e) {
          e.removeListener(this._handleChange)
        }
      }
    },
    230553: (e, t, n) => {
      n.d(t, { MenuContext: () => s })
      const s = n(50959).createContext(null)
    },
    510618: (e, t, n) => {
      n.d(t, { DEFAULT_MENU_THEME: () => f, Menu: () => g })
      var s = n(50959),
        i = n(497754),
        r = n.n(i),
        o = n(650151),
        l = n(44681),
        a = n(199663),
        u = n(753327),
        c = n(370981),
        d = n(801808),
        h = n(376202),
        p = n(823030),
        m = n(230553),
        _ = n(540191)
      const f = _
      class g extends s.PureComponent {
        constructor(e) {
          super(e),
            (this._containerRef = null),
            (this._scrollWrapRef = null),
            (this._raf = null),
            (this._scrollRaf = null),
            (this._scrollTimeout = void 0),
            (this._manager = new d.OverlapManager()),
            (this._hotkeys = null),
            (this._scroll = 0),
            (this._handleContainerRef = (e) => {
              ;(this._containerRef = e),
                this.props.reference &&
                  ('function' == typeof this.props.reference &&
                    this.props.reference(e),
                  'object' == typeof this.props.reference &&
                    (this.props.reference.current = e))
            }),
            (this._handleScrollWrapRef = (e) => {
              ;(this._scrollWrapRef = e),
                'function' == typeof this.props.scrollWrapReference &&
                  this.props.scrollWrapReference(e),
                'object' == typeof this.props.scrollWrapReference &&
                  (this.props.scrollWrapReference.current = e)
            }),
            (this._handleCustomRemeasureDelegate = () => {
              this._resizeForced(), this._handleMeasure()
            }),
            (this._handleMeasure = ({
              callback: e,
              forceRecalcPosition: t,
            } = {}) => {
              var n, s, i, r, a, u, c, d, h, p, m, _
              if (this.state.isMeasureValid && !t) return
              const { position: f } = this.props,
                g = (0, o.ensureNotNull)(this._containerRef)
              let v = g.getBoundingClientRect()
              const x = document.documentElement.clientHeight,
                y = document.documentElement.clientWidth,
                C =
                  null !== (n = this.props.closeOnScrollOutsideOffset) &&
                  void 0 !== n
                    ? n
                    : 0
              let b = x - 0 - C
              const w = v.height > b
              if (w) {
                ;((0, o.ensureNotNull)(this._scrollWrapRef).style.overflowY =
                  'scroll'),
                  (v = g.getBoundingClientRect())
              }
              const { width: S, height: M } = v,
                W =
                  'function' == typeof f
                    ? f({
                        contentWidth: S,
                        contentHeight: M,
                        availableWidth: y,
                        availableHeight: x,
                      })
                    : f,
                R =
                  null !==
                    (i =
                      null === (s = null == W ? void 0 : W.indentFromWindow) ||
                      void 0 === s
                        ? void 0
                        : s.left) && void 0 !== i
                    ? i
                    : 0,
                E =
                  y -
                  (null !== (r = W.overrideWidth) && void 0 !== r ? r : S) -
                  (null !==
                    (u =
                      null === (a = null == W ? void 0 : W.indentFromWindow) ||
                      void 0 === a
                        ? void 0
                        : a.right) && void 0 !== u
                    ? u
                    : 0),
                N = (0, l.clamp)(W.x, R, Math.max(R, E)),
                O =
                  (null !==
                    (d =
                      null === (c = null == W ? void 0 : W.indentFromWindow) ||
                      void 0 === c
                        ? void 0
                        : c.top) && void 0 !== d
                    ? d
                    : 0) + C,
                D =
                  x -
                  (null !== (h = W.overrideHeight) && void 0 !== h ? h : M) -
                  (null !==
                    (m =
                      null === (p = null == W ? void 0 : W.indentFromWindow) ||
                      void 0 === p
                        ? void 0
                        : p.bottom) && void 0 !== m
                    ? m
                    : 0)
              let T = (0, l.clamp)(W.y, O, Math.max(O, D))
              if (
                (W.forbidCorrectYCoord &&
                  T < W.y &&
                  ((b -= W.y - T), (T = W.y)),
                t &&
                  void 0 !== this.props.closeOnScrollOutsideOffset &&
                  W.y <= this.props.closeOnScrollOutsideOffset)
              )
                return void this._handleGlobalClose(!0)
              const P =
                null !== (_ = W.overrideHeight) && void 0 !== _
                  ? _
                  : w
                    ? b
                    : void 0
              this.setState(
                {
                  appearingMenuHeight: t ? this.state.appearingMenuHeight : P,
                  appearingMenuWidth: t
                    ? this.state.appearingMenuWidth
                    : W.overrideWidth,
                  appearingPosition: { x: N, y: T },
                  isMeasureValid: !0,
                },
                () => {
                  this._restoreScrollPosition(), e && e()
                },
              )
            }),
            (this._restoreScrollPosition = () => {
              const e = document.activeElement,
                t = (0, o.ensureNotNull)(this._containerRef)
              if (null !== e && t.contains(e))
                try {
                  e.scrollIntoView()
                } catch (e) {}
              else
                (0, o.ensureNotNull)(this._scrollWrapRef).scrollTop =
                  this._scroll
            }),
            (this._resizeForced = () => {
              this.setState({
                appearingMenuHeight: void 0,
                appearingMenuWidth: void 0,
                appearingPosition: void 0,
                isMeasureValid: void 0,
              })
            }),
            (this._resize = () => {
              null === this._raf &&
                (this._raf = requestAnimationFrame(() => {
                  this.setState({
                    appearingMenuHeight: void 0,
                    appearingMenuWidth: void 0,
                    appearingPosition: void 0,
                    isMeasureValid: void 0,
                  }),
                    (this._raf = null)
                }))
            }),
            (this._handleGlobalClose = (e) => {
              this.props.onClose(e)
            }),
            (this._handleSlot = (e) => {
              this._manager.setContainer(e)
            }),
            (this._handleScroll = () => {
              this._scroll = (0, o.ensureNotNull)(this._scrollWrapRef).scrollTop
            }),
            (this._handleScrollOutsideEnd = () => {
              clearTimeout(this._scrollTimeout),
                (this._scrollTimeout = setTimeout(() => {
                  this._handleMeasure({ forceRecalcPosition: !0 })
                }, 80))
            }),
            (this._handleScrollOutside = (e) => {
              e.target !== this._scrollWrapRef &&
                (this._handleScrollOutsideEnd(),
                null === this._scrollRaf &&
                  (this._scrollRaf = requestAnimationFrame(() => {
                    this._handleMeasure({ forceRecalcPosition: !0 }),
                      (this._scrollRaf = null)
                  })))
            }),
            (this.state = {})
        }
        componentDidMount() {
          this._handleMeasure({ callback: this.props.onOpen })
          const {
            customCloseDelegate: e = c.globalCloseDelegate,
            customRemeasureDelegate: t,
          } = this.props
          e.subscribe(this, this._handleGlobalClose),
            null == t || t.subscribe(null, this._handleCustomRemeasureDelegate),
            window.addEventListener('resize', this._resize)
          const n = null !== this.context
          this._hotkeys ||
            n ||
            ((this._hotkeys = h.createGroup({ desc: 'Popup menu' })),
            this._hotkeys.add({
              desc: 'Close',
              hotkey: 27,
              handler: () => {
                this.props.onKeyboardClose && this.props.onKeyboardClose(),
                  this._handleGlobalClose()
              },
            })),
            this.props.repositionOnScroll &&
              window.addEventListener('scroll', this._handleScrollOutside, {
                capture: !0,
              })
        }
        componentDidUpdate() {
          this._handleMeasure()
        }
        componentWillUnmount() {
          const {
            customCloseDelegate: e = c.globalCloseDelegate,
            customRemeasureDelegate: t,
          } = this.props
          e.unsubscribe(this, this._handleGlobalClose),
            null == t ||
              t.unsubscribe(null, this._handleCustomRemeasureDelegate),
            window.removeEventListener('resize', this._resize),
            window.removeEventListener('scroll', this._handleScrollOutside, {
              capture: !0,
            }),
            this._hotkeys && (this._hotkeys.destroy(), (this._hotkeys = null)),
            null !== this._raf &&
              (cancelAnimationFrame(this._raf), (this._raf = null)),
            null !== this._scrollRaf &&
              (cancelAnimationFrame(this._scrollRaf), (this._scrollRaf = null)),
            this._scrollTimeout && clearTimeout(this._scrollTimeout)
        }
        render() {
          const {
              id: e,
              role: t,
              'aria-label': n,
              'aria-labelledby': i,
              'aria-activedescendant': o,
              'aria-hidden': l,
              'aria-describedby': c,
              'aria-invalid': d,
              children: h,
              minWidth: f,
              theme: g = _,
              className: x,
              maxHeight: y,
              onMouseOver: C,
              onMouseOut: b,
              onKeyDown: w,
              onFocus: S,
              onBlur: M,
            } = this.props,
            {
              appearingMenuHeight: W,
              appearingMenuWidth: R,
              appearingPosition: E,
              isMeasureValid: N,
            } = this.state,
            O = {
              '--ui-kit-menu-max-width': `${E && E.x}px`,
              maxWidth: 'calc(100vw - var(--ui-kit-menu-max-width) - 6px)',
            }
          return s.createElement(
            m.MenuContext.Provider,
            { value: this },
            s.createElement(
              p.SubmenuHandler,
              null,
              s.createElement(
                u.SlotContext.Provider,
                { value: this._manager },
                s.createElement(
                  'div',
                  {
                    id: e,
                    role: t,
                    'aria-label': n,
                    'aria-labelledby': i,
                    'aria-activedescendant': o,
                    'aria-hidden': l,
                    'aria-describedby': c,
                    'aria-invalid': d,
                    className: r()(x, g.menuWrap, !N && g.isMeasuring),
                    style: {
                      height: W,
                      left: E && E.x,
                      minWidth: f,
                      position: 'fixed',
                      top: E && E.y,
                      width: R,
                      ...(this.props.limitMaxWidth && O),
                    },
                    'data-name': this.props['data-name'],
                    ref: this._handleContainerRef,
                    onScrollCapture: this.props.onScroll,
                    onContextMenu: a.preventDefaultForContextMenu,
                    tabIndex: this.props.tabIndex,
                    onMouseOver: C,
                    onMouseOut: b,
                    onKeyDown: w,
                    onFocus: S,
                    onBlur: M,
                  },
                  s.createElement(
                    'div',
                    {
                      className: r()(
                        g.scrollWrap,
                        !this.props.noMomentumBasedScroll && g.momentumBased,
                      ),
                      style: {
                        overflowY: void 0 !== W ? 'scroll' : 'auto',
                        maxHeight: y,
                      },
                      onScrollCapture: this._handleScroll,
                      ref: this._handleScrollWrapRef,
                    },
                    s.createElement(v, { className: g.menuBox }, h),
                  ),
                ),
              ),
              s.createElement(u.Slot, { reference: this._handleSlot }),
            ),
          )
        }
        update(e) {
          e ? this._resizeForced() : this._resize()
        }
        focus(e) {
          var t
          null === (t = this._containerRef) || void 0 === t || t.focus(e)
        }
        blur() {
          var e
          null === (e = this._containerRef) || void 0 === e || e.blur()
        }
      }
      function v(e) {
        const t = (0, o.ensureNotNull)((0, s.useContext)(p.SubmenuContext)),
          n = s.useRef(null)
        return s.createElement(
          'div',
          {
            ref: n,
            className: e.className,
            onMouseOver: (e) => {
              if (
                !(
                  null !== t.current &&
                  e.target instanceof Node &&
                  ((s = e.target),
                  null === (i = n.current) || void 0 === i
                    ? void 0
                    : i.contains(s))
                )
              )
                return
              var s, i
              t.isSubmenuNode(e.target) || t.setCurrent(null)
            },
            'data-name': 'menu-inner',
          },
          e.children,
        )
      }
      g.contextType = p.SubmenuContext
    },
    28466: (e, t, n) => {
      n.d(t, { CloseDelegateContext: () => r })
      var s = n(50959),
        i = n(370981)
      const r = s.createContext(i.globalCloseDelegate)
    },
    813113: (e, t, n) => {
      n.d(t, { Portal: () => a, PortalContext: () => u })
      var s = n(50959),
        i = n(500962),
        r = n(925931),
        o = n(801808),
        l = n(682925)
      class a extends s.PureComponent {
        constructor() {
          super(...arguments), (this._uuid = (0, r.nanoid)())
        }
        componentWillUnmount() {
          this._manager().removeWindow(this._uuid)
        }
        render() {
          const e = this._manager().ensureWindow(
            this._uuid,
            this.props.layerOptions,
          )
          return (
            (e.style.top = this.props.top || ''),
            (e.style.bottom = this.props.bottom || ''),
            (e.style.left = this.props.left || ''),
            (e.style.right = this.props.right || ''),
            (e.style.pointerEvents = this.props.pointerEvents || ''),
            this.props.className && e.classList.add(this.props.className),
            this.props['aria-hidden'] && e.setAttribute('aria-hidden', 'true'),
            i.createPortal(
              s.createElement(u.Provider, { value: this }, this.props.children),
              e,
            )
          )
        }
        moveToTop() {
          this._manager().moveToTop(this._uuid)
        }
        _manager() {
          return null === this.context
            ? (0, o.getRootOverlapManager)()
            : this.context
        }
      }
      a.contextType = l.SlotContext
      const u = s.createContext(null)
    },
    753327: (e, t, n) => {
      n.d(t, { Slot: () => s.Slot, SlotContext: () => s.SlotContext })
      var s = n(682925)
    },
  },
])
