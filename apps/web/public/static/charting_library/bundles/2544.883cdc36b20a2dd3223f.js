;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2544],
  {
    67797: (e) => {
      e.exports = {
        menuWrap: 'menuWrap-Kq3ruQo8',
        isMeasuring: 'isMeasuring-Kq3ruQo8',
        scrollWrap: 'scrollWrap-Kq3ruQo8',
        momentumBased: 'momentumBased-Kq3ruQo8',
        menuBox: 'menuBox-Kq3ruQo8',
        isHidden: 'isHidden-Kq3ruQo8',
      }
    },
    43010: (e, t, s) => {
      s.d(t, { useIsomorphicLayoutEffect: () => i })
      var n = s(50959)
      function i(e, t) {
        ;('undefined' == typeof window ? n.useEffect : n.useLayoutEffect)(e, t)
      }
    },
    36383: (e, t, s) => {
      s.d(t, { useOutsideEvent: () => r })
      var n = s(50959),
        i = s(43010),
        o = s(27267)
      function r(e) {
        const {
            click: t,
            mouseDown: s,
            touchEnd: r,
            touchStart: l,
            handler: a,
            reference: u,
          } = e,
          c = (0, n.useRef)(null),
          d = (0, n.useRef)(
            'undefined' == typeof window
              ? 0
              : new window.CustomEvent('timestamp').timeStamp,
          )
        return (
          (0, i.useIsomorphicLayoutEffect)(() => {
            const e = { click: t, mouseDown: s, touchEnd: r, touchStart: l },
              n = u ? u.current : c.current
            return (0, o.addOutsideEventListener)(d.current, n, a, document, e)
          }, [t, s, r, l, a]),
          u || c
        )
      }
    },
    9745: (e, t, s) => {
      s.d(t, { Icon: () => i })
      var n = s(50959)
      const i = n.forwardRef((e, t) => {
        const {
            icon: s = '',
            title: i,
            ariaLabel: o,
            ariaLabelledby: r,
            ariaHidden: l,
            ...a
          } = e,
          u = !!(i || o || r)
        return n.createElement('span', {
          role: 'img',
          ...a,
          ref: t,
          'aria-label': o,
          'aria-labelledby': r,
          'aria-hidden': l || !u,
          title: i,
          dangerouslySetInnerHTML: { __html: s },
        })
      })
    },
    83021: (e, t, s) => {
      s.d(t, { SubmenuContext: () => i, SubmenuHandler: () => o })
      var n = s(50959)
      const i = n.createContext(null)
      function o(e) {
        const [t, s] = (0, n.useState)(null),
          o = (0, n.useRef)(null),
          r = (0, n.useRef)(new Map())
        return (
          (0, n.useEffect)(
            () => () => {
              null !== o.current && clearTimeout(o.current)
            },
            [],
          ),
          n.createElement(
            i.Provider,
            {
              value: {
                current: t,
                setCurrent: (e) => {
                  null !== o.current &&
                    (clearTimeout(o.current), (o.current = null))
                  null === t
                    ? s(e)
                    : (o.current = setTimeout(() => {
                        ;(o.current = null), s(e)
                      }, 100))
                },
                registerSubmenu: (e, t) => (
                  r.current.set(e, t),
                  () => {
                    r.current.delete(e)
                  }
                ),
                isSubmenuNode: (e) =>
                  Array.from(r.current.values()).some((t) => t(e)),
              },
            },
            e.children,
          )
        )
      }
    },
    99663: (e, t, s) => {
      s.d(t, { Slot: () => i, SlotContext: () => o })
      var n = s(50959)
      class i extends n.Component {
        shouldComponentUpdate() {
          return !1
        }
        render() {
          return n.createElement('div', {
            style: { position: 'fixed', zIndex: 150, left: 0, top: 0 },
            ref: this.props.reference,
          })
        }
      }
      const o = n.createContext(null)
    },
    67961: (e, t, s) => {
      s.d(t, { OverlapManager: () => r, getRootOverlapManager: () => a })
      var n = s(50151),
        i = s(34811)
      class o {
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
          ;(this._storage = new o()),
            (this._windows = new Map()),
            (this._index = 0),
            (this._document = e),
            (this._container = e.createDocumentFragment())
        }
        setContainer(e) {
          const t = this._container,
            s = null === e ? this._document.createDocumentFragment() : e
          !((e, t) => {
            Array.from(e.childNodes).forEach((e) => {
              e.nodeType === Node.ELEMENT_NODE && t.appendChild(e)
            })
          })(t, s),
            (this._container = s)
        }
        registerWindow(e) {
          this._storage.has(e) || this._storage.add(e)
        }
        ensureWindow(e, t = { position: 'fixed', direction: 'normal' }) {
          const s = this._windows.get(e)
          if (void 0 !== s) return s
          this.registerWindow(e)
          const n = this._document.createElement('div')
          if (
            ((n.style.position = t.position),
            (n.style.zIndex = this._index.toString()),
            (n.dataset.id = e),
            void 0 !== t.index)
          ) {
            const e = this._container.childNodes.length
            if (t.index >= e) this._container.appendChild(n)
            else if (t.index <= 0)
              this._container.insertBefore(n, this._container.firstChild)
            else {
              const e = this._container.childNodes[t.index]
              this._container.insertBefore(n, e)
            }
          } else
            'reverse' === t.direction
              ? this._container.insertBefore(n, this._container.firstChild)
              : this._container.appendChild(n)
          return this._windows.set(e, n), ++this._index, n
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
        moveLastWindowToTop() {
          const e = this._storage.getItems(),
            t = e[e.length - 1]
          t && this.moveToTop(t)
        }
        moveToTop(e) {
          if (this.getZindex(e) !== this._index) {
            const t = this.ensureWindow(e)
            this._windows.forEach((e, s) => {
              e.hasAttribute(i.FOCUS_TRAP_DATA_ATTRIBUTE) &&
                e.setAttribute(
                  i.FOCUS_TRAP_DATA_ATTRIBUTE,
                  e === t ? 'true' : 'false',
                )
            }),
              (t.style.zIndex = (++this._index).toString())
          }
        }
        removeWindow(e) {
          this.unregisterWindow(e)
        }
      }
      const l = new WeakMap()
      function a(e = document) {
        const t = e.getElementById('overlap-manager-root')
        if (null !== t) return (0, n.ensureDefined)(l.get(t))
        {
          const t = new r(e),
            s = ((e) => {
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
          return l.set(s, t), t.setContainer(s), e.body.appendChild(s), t
        }
      }
      var u
      !((e) => {
        e[(e.BaseZindex = 150)] = 'BaseZindex'
      })(u || (u = {}))
    },
    99054: (e, t, s) => {
      s.d(t, { setFixedBodyState: () => u })
      const n = (() => {
        let e
        return () => {
          if (void 0 === e) {
            const t = document.createElement('div'),
              s = t.style
            ;(s.visibility = 'hidden'),
              (s.width = '100px'),
              (s.msOverflowStyle = 'scrollbar'),
              document.body.appendChild(t)
            const n = t.offsetWidth
            t.style.overflow = 'scroll'
            const i = document.createElement('div')
            ;(i.style.width = '100%'), t.appendChild(i)
            const o = i.offsetWidth
            t.parentNode?.removeChild(t), (e = n - o)
          }
          return e
        }
      })()
      function i(e, t, s) {
        null !== e && e.style.setProperty(t, s)
      }
      function o(e, t) {
        return getComputedStyle(e, null).getPropertyValue(t)
      }
      function r(e, t) {
        return Number.parseInt(o(e, t))
      }
      let l = 0,
        a = !1
      function u(e) {
        const { body: t } = document,
          s = t.querySelector('.widgetbar-wrap')
        if (e && 1 == ++l) {
          const e = o(t, 'overflow'),
            l = r(t, 'padding-right')
          'hidden' !== e.toLowerCase() &&
            t.scrollHeight > t.offsetHeight &&
            (i(s, 'right', `${n()}px`),
            (t.style.paddingRight = `${l + n()}px`),
            (a = !0)),
            t.classList.add('i-no-scroll')
        } else if (
          !e &&
          l > 0 &&
          0 == --l &&
          (t.classList.remove('i-no-scroll'), a)
        ) {
          i(s, 'right', '0px')
          let e = 0
          0,
            t.scrollHeight <= t.clientHeight && (e -= n()),
            (t.style.paddingRight = (e < 0 ? 0 : e) + 'px'),
            (a = !1)
        }
      }
    },
    90692: (e, t, s) => {
      s.d(t, { MatchMedia: () => i })
      var n = s(50959)
      class i extends n.PureComponent {
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
          e.addEventListener('change', this._handleChange)
        }
        _unsubscribe(e) {
          e.removeEventListener('change', this._handleChange)
        }
      }
    },
    64706: (e, t, s) => {
      s.d(t, { MenuContext: () => n })
      const n = s(50959).createContext(null)
    },
    27317: (e, t, s) => {
      s.d(t, { DEFAULT_MENU_THEME: () => _, Menu: () => v })
      var n = s(50959),
        i = s(97754),
        o = s.n(i),
        r = s(50151),
        l = s(9859),
        a = s(14729),
        u = s(50655),
        c = s(59064),
        d = s(67961),
        h = s(26709),
        p = s(83021),
        m = s(64706),
        f = s(67797)
      const _ = f
      var g
      !((e) => {
        e[(e.IndentFromWindow = 0)] = 'IndentFromWindow'
      })(g || (g = {}))
      class v extends n.PureComponent {
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
              if (this.state.isMeasureValid && !t) return
              const { position: s } = this.props,
                n = (0, r.ensureNotNull)(this._containerRef)
              let i = n.getBoundingClientRect()
              const o = document.documentElement.clientHeight,
                a = document.documentElement.clientWidth,
                u = this.props.closeOnScrollOutsideOffset ?? 0
              let c = o - 0 - u
              const d = i.height > c
              if (d) {
                ;((0, r.ensureNotNull)(this._scrollWrapRef).style.overflowY =
                  'scroll'),
                  (i = n.getBoundingClientRect())
              }
              const { width: h, height: p } = i,
                m =
                  'function' == typeof s
                    ? s({
                        contentWidth: h,
                        contentHeight: p,
                        availableWidth: a,
                        availableHeight: o,
                      })
                    : s,
                f = m?.indentFromWindow?.left ?? 0,
                _ =
                  a -
                  (m.overrideWidth ?? h) -
                  (m?.indentFromWindow?.right ?? 0),
                g = (0, l.clamp)(m.x, f, Math.max(f, _)),
                v = (m?.indentFromWindow?.top ?? 0) + u,
                y =
                  o -
                  (m.overrideHeight ?? p) -
                  (m?.indentFromWindow?.bottom ?? 0)
              let b = (0, l.clamp)(m.y, v, Math.max(v, y))
              if (
                (m.forbidCorrectYCoord &&
                  b < m.y &&
                  ((c -= m.y - b), (b = m.y)),
                t &&
                  void 0 !== this.props.closeOnScrollOutsideOffset &&
                  m.y <= this.props.closeOnScrollOutsideOffset)
              )
                return void this._handleGlobalClose(!0)
              const w = m.overrideHeight ?? (d ? c : void 0)
              this.setState(
                {
                  appearingMenuHeight: t ? this.state.appearingMenuHeight : w,
                  appearingMenuWidth: t
                    ? this.state.appearingMenuWidth
                    : m.overrideWidth,
                  appearingPosition: { x: g, y: b },
                  isMeasureValid: !0,
                },
                () => {
                  this.props.doNotRestorePosition ||
                    this._restoreScrollPosition(),
                    e && e()
                },
              )
            }),
            (this._restoreScrollPosition = () => {
              const e = document.activeElement,
                t = (0, r.ensureNotNull)(this._containerRef)
              if (null !== e && t.contains(e))
                try {
                  e.scrollIntoView()
                } catch (e) {}
              else
                (0, r.ensureNotNull)(this._scrollWrapRef).scrollTop =
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
              this._scroll = (0, r.ensureNotNull)(this._scrollWrapRef).scrollTop
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
            t?.subscribe(null, this._handleCustomRemeasureDelegate),
            window.addEventListener('resize', this._resize)
          const s = null !== this.context
          this._hotkeys ||
            s ||
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
            t?.unsubscribe(null, this._handleCustomRemeasureDelegate),
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
              'aria-label': s,
              'aria-labelledby': i,
              'aria-activedescendant': r,
              'aria-hidden': l,
              'aria-describedby': c,
              'aria-invalid': d,
              children: h,
              minWidth: _,
              theme: g = f,
              className: v,
              maxHeight: b,
              onMouseOver: w,
              onMouseOut: x,
              onKeyDown: C,
              onFocus: S,
              onBlur: E,
            } = this.props,
            {
              appearingMenuHeight: R,
              appearingMenuWidth: M,
              appearingPosition: W,
              isMeasureValid: T,
            } = this.state,
            O = {
              '--ui-kit-menu-max-width': `${W && W.x}px`,
              maxWidth: 'calc(100vw - var(--ui-kit-menu-max-width) - 6px)',
            }
          return n.createElement(
            m.MenuContext.Provider,
            { value: this },
            n.createElement(
              p.SubmenuHandler,
              null,
              n.createElement(
                u.SlotContext.Provider,
                { value: this._manager },
                n.createElement(
                  'div',
                  {
                    id: e,
                    role: t,
                    'aria-label': s,
                    'aria-labelledby': i,
                    'aria-activedescendant': r,
                    'aria-hidden': l,
                    'aria-describedby': c,
                    'aria-invalid': d,
                    className: o()(v, g.menuWrap, !T && g.isMeasuring),
                    style: {
                      height: R,
                      left: W && W.x,
                      minWidth: _,
                      position: 'fixed',
                      top: W && W.y,
                      width: M,
                      ...(this.props.limitMaxWidth && O),
                    },
                    'data-name': this.props['data-name'],
                    'data-tooltip-show-on-focus':
                      this.props['data-tooltip-show-on-focus'],
                    ref: this._handleContainerRef,
                    onScrollCapture: this.props.onScroll,
                    onContextMenu: a.preventDefaultForContextMenu,
                    tabIndex: this.props.tabIndex,
                    onMouseOver: w,
                    onMouseOut: x,
                    onKeyDown: C,
                    onFocus: S,
                    onBlur: E,
                  },
                  n.createElement(
                    'div',
                    {
                      className: o()(
                        g.scrollWrap,
                        !this.props.noMomentumBasedScroll && g.momentumBased,
                      ),
                      style: {
                        overflowY: void 0 !== R ? 'scroll' : 'auto',
                        maxHeight: b,
                      },
                      onScrollCapture: this._handleScroll,
                      ref: this._handleScrollWrapRef,
                    },
                    n.createElement(y, { className: g.menuBox }, h),
                  ),
                ),
              ),
              n.createElement(u.Slot, { reference: this._handleSlot }),
            ),
          )
        }
        update(e) {
          e ? this._resizeForced() : this._resize()
        }
        focus(e) {
          this._containerRef?.focus(e)
        }
        blur() {
          this._containerRef?.blur()
        }
      }
      function y(e) {
        const t = (0, r.ensureNotNull)((0, n.useContext)(p.SubmenuContext)),
          s = n.useRef(null)
        return n.createElement(
          'div',
          {
            ref: s,
            className: e.className,
            onMouseOver: (e) => {
              if (
                !(
                  null !== t.current &&
                  e.target instanceof Node &&
                  ((n = e.target), s.current?.contains(n))
                )
              )
                return
              var n
              t.isSubmenuNode(e.target) || t.setCurrent(null)
            },
            'data-name': 'menu-inner',
          },
          e.children,
        )
      }
      v.contextType = p.SubmenuContext
    },
    29197: (e, t, s) => {
      s.d(t, { CloseDelegateContext: () => o })
      var n = s(50959),
        i = s(59064)
      const o = n.createContext(i.globalCloseDelegate)
    },
    42842: (e, t, s) => {
      s.d(t, { Portal: () => u, PortalContext: () => c })
      var n = s(50959),
        i = s(32227),
        o = s(55698),
        r = s(67961),
        l = s(34811),
        a = s(99663)
      class u extends n.PureComponent {
        constructor() {
          super(...arguments), (this._uuid = (0, o.nanoid)())
        }
        componentWillUnmount() {
          this._manager().removeWindow(this._uuid)
        }
        render() {
          const e = this._manager().ensureWindow(
            this._uuid,
            this.props.layerOptions,
          )
          ;(e.style.top = this.props.top || ''),
            (e.style.bottom = this.props.bottom || ''),
            (e.style.left = this.props.left || ''),
            (e.style.right = this.props.right || ''),
            (e.style.pointerEvents = this.props.pointerEvents || '')
          const t = this.props.className
          return (
            t &&
              ('string' == typeof t
                ? e.classList.add(t)
                : e.classList.add(...t)),
            this.props.shouldTrapFocus &&
              !e.hasAttribute(l.FOCUS_TRAP_DATA_ATTRIBUTE) &&
              e.setAttribute(l.FOCUS_TRAP_DATA_ATTRIBUTE, 'true'),
            this.props['aria-hidden'] && e.setAttribute('aria-hidden', 'true'),
            i.createPortal(
              n.createElement(c.Provider, { value: this }, this.props.children),
              e,
            )
          )
        }
        moveToTop() {
          this._manager().moveToTop(this._uuid)
        }
        _manager() {
          return null === this.context
            ? (0, r.getRootOverlapManager)()
            : this.context
        }
      }
      u.contextType = a.SlotContext
      const c = n.createContext(null)
    },
    50655: (e, t, s) => {
      s.d(t, { Slot: () => n.Slot, SlotContext: () => n.SlotContext })
      var n = s(99663)
    },
  },
])
