;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [653],
  {
    4665: (e) => {
      e.exports = {
        loader: 'loader-UL6iwcBa',
        static: 'static-UL6iwcBa',
        item: 'item-UL6iwcBa',
        'tv-button-loader': 'tv-button-loader-UL6iwcBa',
        medium: 'medium-UL6iwcBa',
        small: 'small-UL6iwcBa',
        black: 'black-UL6iwcBa',
        white: 'white-UL6iwcBa',
        gray: 'gray-UL6iwcBa',
        primary: 'primary-UL6iwcBa',
      }
    },
    36718: (e) => {
      e.exports = {
        'default-drawer-min-top-distance': '100px',
        wrap: 'wrap-_HnK0UIN',
        positionBottom: 'positionBottom-_HnK0UIN',
        backdrop: 'backdrop-_HnK0UIN',
        drawer: 'drawer-_HnK0UIN',
        positionLeft: 'positionLeft-_HnK0UIN',
      }
    },
    238: (e) => {
      e.exports = {
        separator: 'separator-QjUlCDId',
        small: 'small-QjUlCDId',
        normal: 'normal-QjUlCDId',
        large: 'large-QjUlCDId',
      }
    },
    49128: (e) => {
      e.exports = { icon: 'icon-WB2y0EnP', dropped: 'dropped-WB2y0EnP' }
    },
    26996: (e, t, o) => {
      o.d(t, { Loader: () => c })
      var r,
        n = o(50959),
        a = o(97754),
        i = o(4665),
        s = o.n(i)
      function c(e) {
        const {
            className: t,
            size: o = 'medium',
            staticPosition: r,
            color: i = 'black',
          } = e,
          c = a(s().item, s()[i], s()[o])
        return n.createElement(
          'span',
          { className: a(s().loader, r && s().static, t) },
          n.createElement('span', { className: c }),
          n.createElement('span', { className: c }),
          n.createElement('span', { className: c }),
        )
      }
      !((e) => {
        ;(e.Medium = 'medium'), (e.Small = 'small')
      })(r || (r = {}))
    },
    37558: (e, t, o) => {
      o.d(t, { DrawerContext: () => i, DrawerManager: () => a })
      var r = o(50959),
        n = o(99054)
      class a extends r.PureComponent {
        constructor(e) {
          super(e),
            (this._isBodyFixed = !1),
            (this._addDrawer = (e) => {
              this.setState((t) => ({ stack: [...t.stack, e] }))
            }),
            (this._removeDrawer = (e) => {
              this.setState((t) => ({ stack: t.stack.filter((t) => t !== e) }))
            }),
            (this.state = { stack: [] })
        }
        componentDidUpdate(e, t) {
          !t.stack.length &&
            this.state.stack.length &&
            ((0, n.setFixedBodyState)(!0), (this._isBodyFixed = !0)),
            t.stack.length &&
              !this.state.stack.length &&
              this._isBodyFixed &&
              ((0, n.setFixedBodyState)(!1), (this._isBodyFixed = !1))
        }
        componentWillUnmount() {
          this.state.stack.length &&
            this._isBodyFixed &&
            (0, n.setFixedBodyState)(!1)
        }
        render() {
          return r.createElement(
            i.Provider,
            {
              value: {
                addDrawer: this._addDrawer,
                removeDrawer: this._removeDrawer,
                currentDrawer: this.state.stack.length
                  ? this.state.stack[this.state.stack.length - 1]
                  : null,
              },
            },
            this.props.children,
          )
        }
      }
      const i = r.createContext(null)
    },
    41590: (e, t, o) => {
      o.d(t, { Drawer: () => h })
      var r = o(50959),
        n = o(50151),
        a = o(97754),
        i = o(92184),
        s = o(42842),
        c = o(37558),
        l = o(29197),
        d = o(86656),
        u = o(36718)
      var p
      function h(e) {
        const {
            position: t = 'Bottom',
            onClose: o,
            children: d,
            reference: p,
            className: h,
            theme: f = u,
          } = e,
          g = (0, n.ensureNotNull)((0, r.useContext)(c.DrawerContext)),
          [v] = (0, r.useState)(() => (0, i.randomHash)()),
          w = (0, r.useRef)(null),
          b = (0, r.useContext)(l.CloseDelegateContext)
        return (
          (0, r.useLayoutEffect)(
            () => (
              (0, n.ensureNotNull)(w.current).focus({ preventScroll: !0 }),
              b.subscribe(g, o),
              g.addDrawer(v),
              () => {
                g.removeDrawer(v), b.unsubscribe(g, o)
              }
            ),
            [],
          ),
          r.createElement(
            s.Portal,
            null,
            r.createElement(
              'div',
              { ref: p, className: a(u.wrap, u[`position${t}`]) },
              v === g.currentDrawer &&
                r.createElement('div', { className: u.backdrop, onClick: o }),
              r.createElement(
                m,
                {
                  className: a(f.drawer, u[`position${t}`], h),
                  ref: w,
                  'data-name': e['data-name'],
                },
                d,
              ),
            ),
          )
        )
      }
      !((e) => {
        ;(e.Left = 'Left'), (e.Bottom = 'Bottom')
      })(p || (p = {}))
      const m = (0, r.forwardRef)((e, t) => {
        const { className: o, ...n } = e
        return r.createElement(d.TouchScrollContainer, {
          className: a(u.drawer, o),
          tabIndex: -1,
          ref: t,
          ...n,
        })
      })
    },
    11684: (e, t, o) => {
      o.d(t, { PopupMenuSeparator: () => c })
      var r,
        n = o(50959),
        a = o(97754),
        i = o.n(a),
        s = o(238)
      function c(e) {
        const { size: t = 'normal', className: o, ariaHidden: r = !1 } = e
        return n.createElement('div', {
          className: i()(
            s.separator,
            'small' === t && s.small,
            'normal' === t && s.normal,
            'large' === t && s.large,
            o,
          ),
          role: 'separator',
          'aria-hidden': r,
        })
      }
      !((e) => {
        ;(e.Small = 'small'), (e.Large = 'large'), (e.Normal = 'normal')
      })(r || (r = {}))
    },
    10381: (e, t, o) => {
      o.d(t, { ToolWidgetCaret: () => c })
      var r = o(50959),
        n = o(97754),
        a = o(9745),
        i = o(49128),
        s = o(578)
      function c(e) {
        const { dropped: t, className: o } = e
        return r.createElement(a.Icon, {
          className: n(o, i.icon, { [i.dropped]: t }),
          icon: s,
        })
      }
    },
    86656: (e, t, o) => {
      o.d(t, { TouchScrollContainer: () => l })
      var r = o(50959),
        n = o(59142),
        a = o(50151),
        i = o(49483)
      const s = CSS.supports('overscroll-behavior', 'none')
      let c = 0
      const l = (0, r.forwardRef)((e, t) => {
        const { children: o, ...a } = e,
          l = (0, r.useRef)(null)
        return (
          (0, r.useImperativeHandle)(t, () => l.current),
          (0, r.useLayoutEffect)(() => {
            if (i.CheckMobile.iOS())
              return (
                c++,
                null !== l.current &&
                  (s
                    ? 1 === c &&
                      (document.body.style.overscrollBehavior = 'none')
                    : (0, n.disableBodyScroll)(l.current, {
                        allowTouchMove: d(l),
                      })),
                () => {
                  c--,
                    null !== l.current &&
                      (s
                        ? 0 === c &&
                          (document.body.style.overscrollBehavior = '')
                        : (0, n.enableBodyScroll)(l.current))
                }
              )
          }, []),
          r.createElement('div', { ref: l, ...a }, o)
        )
      })
      function d(e) {
        return (t) => {
          const o = (0, a.ensureNotNull)(e.current),
            r = document.activeElement
          return (
            !o.contains(t) || (null !== r && o.contains(r) && r.contains(t))
          )
        }
      }
    },
    40173: (e, t, o) => {
      function r(e, t, o = {}) {
        return Object.assign(
          {},
          e,
          ((e, t, o = {}) => {
            const r = Object.assign({}, t)
            for (const n of Object.keys(t)) {
              const a = o[n] || n
              a in e && (r[n] = [e[a], t[n]].join(' '))
            }
            return r
          })(e, t, o),
        )
      }
      o.d(t, { mergeThemes: () => r })
    },
    38576: (e) => {
      e.exports = {
        button: 'button-GwQQdU8S',
        hover: 'hover-GwQQdU8S',
        clicked: 'clicked-GwQQdU8S',
        isInteractive: 'isInteractive-GwQQdU8S',
        accessible: 'accessible-GwQQdU8S',
        isGrouped: 'isGrouped-GwQQdU8S',
        isActive: 'isActive-GwQQdU8S',
        isOpened: 'isOpened-GwQQdU8S',
        isDisabled: 'isDisabled-GwQQdU8S',
        text: 'text-GwQQdU8S',
        icon: 'icon-GwQQdU8S',
        endIcon: 'endIcon-GwQQdU8S',
      }
    },
    97373: (e) => {
      e.exports = { button: 'button-xNqEcuN2' }
    },
    55973: (e) => {
      e.exports = { title: 'title-u3QJgF_p' }
    },
    95389: (e) => {
      e.exports = {
        button: 'button-merBkM5y',
        hover: 'hover-merBkM5y',
        clicked: 'clicked-merBkM5y',
        accessible: 'accessible-merBkM5y',
        arrow: 'arrow-merBkM5y',
        arrowWrap: 'arrowWrap-merBkM5y',
        isOpened: 'isOpened-merBkM5y',
      }
    },
    78135: (e, t, o) => {
      o.d(t, {
        HorizontalAttachEdge: () => n,
        HorizontalDropDirection: () => i,
        VerticalAttachEdge: () => r,
        VerticalDropDirection: () => a,
        getPopupPositioner: () => l,
      })
      var r,
        n,
        a,
        i,
        s = o(50151)
      !((e) => {
        ;(e[(e.Top = 0)] = 'Top'),
          (e[(e.Bottom = 1)] = 'Bottom'),
          (e[(e.AutoStrict = 2)] = 'AutoStrict')
      })(r || (r = {})),
        ((e) => {
          ;(e[(e.Left = 0)] = 'Left'), (e[(e.Right = 1)] = 'Right')
        })(n || (n = {})),
        ((e) => {
          ;(e[(e.FromTopToBottom = 0)] = 'FromTopToBottom'),
            (e[(e.FromBottomToTop = 1)] = 'FromBottomToTop')
        })(a || (a = {})),
        ((e) => {
          ;(e[(e.FromLeftToRight = 0)] = 'FromLeftToRight'),
            (e[(e.FromRightToLeft = 1)] = 'FromRightToLeft')
        })(i || (i = {}))
      const c = {
        verticalAttachEdge: r.Bottom,
        horizontalAttachEdge: n.Left,
        verticalDropDirection: a.FromTopToBottom,
        horizontalDropDirection: i.FromLeftToRight,
        verticalMargin: 0,
        horizontalMargin: 0,
        matchButtonAndListboxWidths: !1,
      }
      function l(e, t) {
        return (o) => {
          const { contentWidth: l, contentHeight: d, availableHeight: u } = o,
            p = (0, s.ensureNotNull)(e).getBoundingClientRect(),
            {
              horizontalAttachEdge: h = c.horizontalAttachEdge,
              horizontalDropDirection: m = c.horizontalDropDirection,
              horizontalMargin: f = c.horizontalMargin,
              verticalMargin: g = c.verticalMargin,
              matchButtonAndListboxWidths: v = c.matchButtonAndListboxWidths,
            } = t
          let w = t.verticalAttachEdge ?? c.verticalAttachEdge,
            b = t.verticalDropDirection ?? c.verticalDropDirection
          w === r.AutoStrict &&
            (u < p.y + p.height + g + d
              ? ((w = r.Top), (b = a.FromBottomToTop))
              : ((w = r.Bottom), (b = a.FromTopToBottom)))
          const B = w === r.Top ? -1 * g : g,
            D = h === n.Right ? p.right : p.left,
            E = w === r.Top ? p.top : p.bottom,
            T = {
              x: D - (m === i.FromRightToLeft ? l : 0) + f,
              y: E - (b === a.FromBottomToTop ? d : 0) + B,
            }
          return v && (T.overrideWidth = p.width), T
        }
      }
    },
    81348: (e, t, o) => {
      o.d(t, {
        DEFAULT_TOOL_WIDGET_BUTTON_THEME: () => s,
        ToolWidgetButton: () => c,
      })
      var r = o(50959),
        n = o(97754),
        a = o(9745),
        i = o(38576)
      const s = i,
        c = r.forwardRef((e, t) => {
          const {
              tag: o = 'div',
              icon: s,
              endIcon: c,
              isActive: l,
              isOpened: d,
              isDisabled: u,
              isGrouped: p,
              isHovered: h,
              isClicked: m,
              onClick: f,
              text: g,
              textBeforeIcon: v,
              title: w,
              theme: b = i,
              className: B,
              forceInteractive: D,
              inactive: E,
              'data-name': T,
              'data-tooltip': _,
              ...k
            } = e,
            y = n(B, b.button, (w || _) && 'apply-common-tooltip', {
              [b.isActive]: l,
              [b.isOpened]: d,
              [b.isInteractive]: (D || Boolean(f)) && !u && !E,
              [b.isDisabled]: Boolean(u || E),
              [b.isGrouped]: p,
              [b.hover]: h,
              [b.clicked]: m,
            }),
            C =
              s &&
              ('string' == typeof s
                ? r.createElement(a.Icon, { className: b.icon, icon: s })
                : r.cloneElement(s, {
                    className: n(b.icon, s.props.className),
                  }))
          return 'button' === o
            ? r.createElement(
                'button',
                {
                  ...k,
                  ref: t,
                  type: 'button',
                  className: n(y, b.accessible),
                  disabled: u && !E,
                  onClick: f,
                  title: w,
                  'data-name': T,
                  'data-tooltip': _,
                },
                v &&
                  g &&
                  r.createElement(
                    'div',
                    { className: n('js-button-text', b.text) },
                    g,
                  ),
                C,
                !v &&
                  g &&
                  r.createElement(
                    'div',
                    { className: n('js-button-text', b.text) },
                    g,
                  ),
              )
            : r.createElement(
                'div',
                {
                  ...k,
                  ref: t,
                  'data-role': 'button',
                  className: y,
                  onClick: u ? void 0 : f,
                  title: w,
                  'data-name': T,
                  'data-tooltip': _,
                },
                v &&
                  g &&
                  r.createElement(
                    'div',
                    { className: n('js-button-text', b.text) },
                    g,
                  ),
                C,
                !v &&
                  g &&
                  r.createElement(
                    'div',
                    { className: n('js-button-text', b.text) },
                    g,
                  ),
                c && r.createElement(a.Icon, { icon: c, className: i.endIcon }),
              )
        })
    },
    56388: (e, t, o) => {
      o.d(t, { ToolWidgetIconButton: () => s })
      var r = o(50959),
        n = o(97754),
        a = o(81348),
        i = o(97373)
      const s = r.forwardRef((e, t) => {
        const { className: o, id: s, ...c } = e
        return r.createElement(a.ToolWidgetButton, {
          id: s,
          'data-name': s,
          ...c,
          ref: t,
          className: n(o, i.button),
        })
      })
    },
    16829: (e, t, o) => {
      o.d(t, { ToolWidgetMenuSummary: () => i })
      var r = o(50959),
        n = o(97754),
        a = o(55973)
      function i(e) {
        return r.createElement(
          'div',
          { className: n(e.className, a.title) },
          e.children,
        )
      }
    },
    20626: (e, t, o) => {
      o.d(t, { ToolWidgetMenu: () => w })
      var r = o(50959),
        n = o(97754),
        a = o.n(n),
        i = o(3343),
        s = o(20520),
        c = o(10381),
        l = o(90186),
        d = o(37558),
        u = o(41590),
        p = o(78135),
        h = o(90692),
        m = o(56570),
        f = o(76460),
        g = o(95389)
      var v
      !((e) => {
        ;(e[(e.Vertical = 2)] = 'Vertical'),
          (e[(e.Horizontal = 0)] = 'Horizontal')
      })(v || (v = {}))
      class w extends r.PureComponent {
        constructor(e) {
          super(e),
            (this._wrapperRef = null),
            (this._controller = r.createRef()),
            (this._onPopupCloseOnClick = (e) => {
              'keyboard' === e.detail.clickType && this.focus()
            }),
            (this._handleMenuFocus = (e) => {
              e.relatedTarget === this._wrapperRef &&
                this.setState((e) => ({ ...e, isOpenedByButton: !0 })),
                this.props.onMenuFocus?.(e)
            }),
            (this._handleWrapperRef = (e) => {
              ;(this._wrapperRef = e),
                this.props.reference && this.props.reference(e)
            }),
            (this._handleOpen = () => {
              'div' !== this.props.tag &&
                (this.setState((e) => ({ ...e, isOpenedByButton: !1 })),
                this.props.menuReference?.current?.addEventListener(
                  'popup-menu-close-event',
                  this._onPopupCloseOnClick,
                ),
                this._controller.current?.focus())
            }),
            (this._handleClick = (e) => {
              ;(m.enabled('skip_event_target_check') ||
                e.target instanceof Node) &&
                e.currentTarget.contains(e.target) &&
                (this._handleToggleDropdown(void 0, (0, f.isKeyboardClick)(e)),
                this.props.onClick &&
                  this.props.onClick(e, !this.state.isOpened))
            }),
            (this._handleToggleDropdown = (e, t = !1) => {
              const { onClose: o, onOpen: r } = this.props,
                { isOpened: n } = this.state,
                a = 'boolean' == typeof e ? e : !n
              this.setState({ isOpened: a, shouldReturnFocus: !!a && t }),
                a && r && r(),
                !a && o && o()
            }),
            (this._handleClose = () => {
              this.close()
            }),
            (this._handleKeyDown = (e) => {
              const { orientation: t = 'horizontal' } = this.props
              if (e.defaultPrevented) return
              if (!(e.target instanceof Node)) return
              const o = (0, i.hashFromEvent)(e)
              if (e.currentTarget.contains(e.target))
                switch (o) {
                  case 40:
                    if ('div' === this.props.tag || 'horizontal' !== t) return
                    if (this.state.isOpened) return
                    e.preventDefault(), this._handleToggleDropdown(!0, !0)
                    break
                  case 27:
                    if (!this.state.isOpened || !this.props.closeOnEsc) return
                    e.preventDefault(),
                      e.stopPropagation(),
                      this._handleToggleDropdown(!1)
                }
              else {
                if ('div' === this.props.tag) return
                switch (o) {
                  case 27: {
                    e.preventDefault()
                    const { shouldReturnFocus: t, isOpenedByButton: o } =
                      this.state
                    this._handleToggleDropdown(!1),
                      t && o && this._wrapperRef?.focus()
                    break
                  }
                }
              }
            }),
            (this.state = {
              isOpened: !1,
              shouldReturnFocus: !1,
              isOpenedByButton: !1,
            })
        }
        render() {
          const {
              tag: e = 'div',
              id: t,
              arrow: o,
              content: n,
              isDisabled: i,
              isDrawer: s,
              isShowTooltip: d,
              title: u,
              className: p,
              hotKey: m,
              theme: f,
              drawerBreakpoint: g,
              tabIndex: v,
              isClicked: w,
            } = this.props,
            { isOpened: B } = this.state,
            D = a()(p, f.button, {
              'apply-common-tooltip': d || !i,
              [f.isDisabled]: i,
              [f.isOpened]: B,
              [f.clicked]: w,
            }),
            E = b(n) ? n({ isOpened: B }) : n
          return 'button' === e
            ? r.createElement(
                'button',
                {
                  type: 'button',
                  id: t,
                  className: a()(D, f.accessible),
                  disabled: i,
                  onClick: this._handleClick,
                  title: u,
                  'data-tooltip-hotkey': m,
                  ref: this._handleWrapperRef,
                  onKeyDown: this._handleKeyDown,
                  tabIndex: v,
                  ...(0, l.filterDataProps)(this.props),
                  ...(0, l.filterAriaProps)(this.props),
                },
                E,
                o &&
                  r.createElement(
                    'div',
                    { className: f.arrow },
                    r.createElement(
                      'div',
                      { className: f.arrowWrap },
                      r.createElement(c.ToolWidgetCaret, { dropped: B }),
                    ),
                  ),
                this.state.isOpened &&
                  (g
                    ? r.createElement(h.MatchMedia, { rule: g }, (e) =>
                        this._renderContent(e),
                      )
                    : this._renderContent(s)),
              )
            : r.createElement(
                'div',
                {
                  id: t,
                  className: D,
                  onClick: i ? void 0 : this._handleClick,
                  title: u,
                  'data-tooltip-hotkey': m,
                  ref: this._handleWrapperRef,
                  'data-role': 'button',
                  tabIndex: v,
                  onKeyDown: this._handleKeyDown,
                  'aria-haspopup': this.props['aria-haspopup'],
                  ...(0, l.filterDataProps)(this.props),
                },
                E,
                o &&
                  r.createElement(
                    'div',
                    { className: f.arrow },
                    r.createElement(
                      'div',
                      { className: f.arrowWrap },
                      r.createElement(c.ToolWidgetCaret, { dropped: B }),
                    ),
                  ),
                this.state.isOpened &&
                  (g
                    ? r.createElement(h.MatchMedia, { rule: g }, (e) =>
                        this._renderContent(e),
                      )
                    : this._renderContent(s)),
              )
        }
        close() {
          this.props.menuReference?.current?.removeEventListener(
            'popup-menu-close-event',
            this._onPopupCloseOnClick,
          ),
            this._handleToggleDropdown(!1)
        }
        focus() {
          this._wrapperRef?.focus()
        }
        update() {
          null !== this._controller.current && this._controller.current.update()
        }
        _renderContent(e) {
          const {
              menuDataName: t,
              minWidth: o,
              menuClassName: n,
              menuRole: a,
              maxHeight: i,
              drawerPosition: c = 'Bottom',
              children: l,
              noMomentumBasedScroll: h,
            } = this.props,
            { isOpened: m } = this.state,
            f = {
              horizontalMargin: this.props.horizontalMargin || 0,
              verticalMargin: this.props.verticalMargin || 2,
              verticalAttachEdge: this.props.verticalAttachEdge,
              horizontalAttachEdge: this.props.horizontalAttachEdge,
              verticalDropDirection: this.props.verticalDropDirection,
              horizontalDropDirection: this.props.horizontalDropDirection,
              matchButtonAndListboxWidths:
                this.props.matchButtonAndListboxWidths,
            },
            g = Boolean(m && e && c),
            v = b(l) ? l({ isDrawer: g }) : l
          return g
            ? r.createElement(
                d.DrawerManager,
                null,
                r.createElement(
                  u.Drawer,
                  {
                    reference: this.props.drawerReference,
                    onClose: this._handleClose,
                    position: c,
                    'data-name': t,
                  },
                  v,
                ),
              )
            : r.createElement(
                s.PopupMenu,
                {
                  reference: this.props.menuReference,
                  role: a,
                  controller: this._controller,
                  closeOnClickOutside: this.props.closeOnClickOutside,
                  doNotCloseOn: this,
                  isOpened: m,
                  minWidth: o,
                  onClose: this._handleClose,
                  position: (0, p.getPopupPositioner)(this._wrapperRef, f),
                  className: n,
                  maxHeight: i,
                  'data-name': t,
                  tabIndex: 'div' !== this.props.tag ? -1 : void 0,
                  onOpen: this._handleOpen,
                  onKeyDown: this.props.onMenuKeyDown,
                  onFocus: this._handleMenuFocus,
                  noMomentumBasedScroll: h,
                },
                v,
              )
        }
      }
      function b(e) {
        return 'function' == typeof e
      }
      w.defaultProps = { arrow: !0, closeOnClickOutside: !0, theme: g }
    },
    20792: (e, t, o) => {
      o.d(t, { DEFAULT_TOOLBAR_BUTTON_THEME: () => i, ToolbarButton: () => s })
      var r = o(50959),
        n = o(81348),
        a = o(50238)
      const i = n.DEFAULT_TOOL_WIDGET_BUTTON_THEME,
        s = (0, r.forwardRef)((e, t) => {
          const { tooltip: o, ...i } = e,
            [s, c] = (0, a.useRovingTabindexElement)(t)
          return r.createElement(n.ToolWidgetButton, {
            'aria-label': o,
            ...i,
            tag: 'button',
            ref: s,
            tabIndex: c,
            'data-tooltip': o,
          })
        })
    },
    45827: (e, t, o) => {
      o.d(t, { ToolbarIconButton: () => s })
      var r = o(50959),
        n = o(50238),
        a = o(56388)
      const i = (0, r.forwardRef)((e, t) => {
          const { tooltip: o, ...n } = e
          return r.createElement(a.ToolWidgetIconButton, {
            'aria-label': o,
            ...n,
            tag: 'button',
            ref: t,
            'data-tooltip': o,
            'data-tooltip-show-on-focus': 'true',
          })
        }),
        s = (0, r.forwardRef)((e, t) => {
          const [o, a] = (0, n.useRovingTabindexElement)(t)
          return r.createElement(i, { ...e, ref: o, tabIndex: a })
        })
    },
    88811: (e, t, o) => {
      o.d(t, { ToolbarMenuButton: () => d })
      var r = o(50959),
        n = o(39416),
        a = o(50238),
        i = o(7047),
        s = o(20626),
        c = o(20243)
      const l = (0, r.forwardRef)((e, t) => {
          const { tooltip: o, tag: a, buttonRef: i, reference: l, ...d } = e,
            u = (0, n.useFunctionalRefObject)(l ?? null)
          return r.createElement(s.ToolWidgetMenu, {
            'aria-label': o,
            ...d,
            ref: t,
            tag: a ?? 'button',
            reference: i ?? u,
            'data-tooltip': o,
            onMenuKeyDown: c.handleAccessibleMenuKeyDown,
            onMenuFocus: (e) => (0, c.handleAccessibleMenuFocus)(e, i ?? u),
          })
        }),
        d = (0, r.forwardRef)((e, t) => {
          const { tooltip: o, menuReference: s = null, ...c } = e,
            [d, u] = (0, a.useRovingTabindexElement)(null),
            p = (0, n.useFunctionalRefObject)(s)
          return r.createElement(l, {
            'aria-label': o,
            'aria-haspopup': 'menu',
            ...i.MouseClickAutoBlurHandler.attributes(),
            ...c,
            ref: t,
            tag: 'button',
            buttonRef: d,
            tabIndex: u,
            menuReference: p,
            tooltip: o,
          })
        })
    },
    77151: (e, t, o) => {
      o.d(t, {
        RegistryProvider: () => c,
        registryContextType: () => l,
        validateRegistry: () => s,
      })
      var r = o(50959),
        n = o(19036),
        a = o.n(n)
      const i = r.createContext({})
      function s(e, t) {
        a().checkPropTypes(t, e, 'context', 'RegistryContext')
      }
      function c(e) {
        const { validation: t, value: o } = e
        return s(o, t), r.createElement(i.Provider, { value: o }, e.children)
      }
      function l() {
        return i
      }
    },
    578: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8" width="16" height="8"><path fill="currentColor" d="M0 1.475l7.396 6.04.596.485.593-.49L16 1.39 14.807 0 7.393 6.122 8.58 6.12 1.186.08z"/></svg>'
    },
  },
])
