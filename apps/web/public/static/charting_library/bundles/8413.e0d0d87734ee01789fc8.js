;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [8413],
  {
    645300: (e) => {
      e.exports = {}
    },
    966076: (e) => {
      e.exports = {
        'default-drawer-min-top-distance': '100px',
        wrap: 'wrap-_HnK0UIN',
        positionBottom: 'positionBottom-_HnK0UIN',
        backdrop: 'backdrop-_HnK0UIN',
        drawer: 'drawer-_HnK0UIN',
        positionLeft: 'positionLeft-_HnK0UIN',
      }
    },
    671986: (e) => {
      e.exports = {
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
        item: 'item-jFqVJoPk',
        hovered: 'hovered-jFqVJoPk',
        isDisabled: 'isDisabled-jFqVJoPk',
        isActive: 'isActive-jFqVJoPk',
        shortcut: 'shortcut-jFqVJoPk',
        toolbox: 'toolbox-jFqVJoPk',
        withIcon: 'withIcon-jFqVJoPk',
        'round-icon': 'round-icon-jFqVJoPk',
        icon: 'icon-jFqVJoPk',
        labelRow: 'labelRow-jFqVJoPk',
        label: 'label-jFqVJoPk',
        showOnHover: 'showOnHover-jFqVJoPk',
        'disclosure-item-circle-logo': 'disclosure-item-circle-logo-jFqVJoPk',
        showOnFocus: 'showOnFocus-jFqVJoPk',
      }
    },
    934587: (e) => {
      e.exports = { icon: 'icon-WB2y0EnP', dropped: 'dropped-WB2y0EnP' }
    },
    778199: (e, t, o) => {
      function n(e, t, o, n, r) {
        function i(r) {
          if (e > r.timeStamp) return
          const i = r.target
          void 0 !== o &&
            null !== t &&
            null !== i &&
            i.ownerDocument === n &&
            (t.contains(i) || o(r))
        }
        return (
          r.click && n.addEventListener('click', i, !1),
          r.mouseDown && n.addEventListener('mousedown', i, !1),
          r.touchEnd && n.addEventListener('touchend', i, !1),
          r.touchStart && n.addEventListener('touchstart', i, !1),
          () => {
            n.removeEventListener('click', i, !1),
              n.removeEventListener('mousedown', i, !1),
              n.removeEventListener('touchend', i, !1),
              n.removeEventListener('touchstart', i, !1)
          }
        )
      }
      o.d(t, { addOutsideEventListener: () => n })
    },
    800417: (e, t, o) => {
      function n(e) {
        return i(e, a)
      }
      function r(e) {
        return i(e, s)
      }
      function i(e, t) {
        const o = Object.entries(e).filter(t),
          n = {}
        for (const [e, t] of o) n[e] = t
        return n
      }
      function a(e) {
        const [t, o] = e
        return 0 === t.indexOf('data-') && 'string' == typeof o
      }
      function s(e) {
        return 0 === e[0].indexOf('aria-')
      }
      o.d(t, {
        filterAriaProps: () => r,
        filterDataProps: () => n,
        filterProps: () => i,
        isAriaAttribute: () => s,
        isDataAttribute: () => a,
      })
    },
    636080: (e, t, o) => {
      o.d(t, { CircleLogo: () => a, hiddenCircleLogoClass: () => i })
      var n = o(50959),
        r = o(439067)
      o(645300)
      const i = 'tv-circle-logo--visually-hidden'
      function a(e) {
        var t, o
        const i = (0, r.getStyleClasses)(e.size, e.className),
          a =
            null !== (o = null !== (t = e.alt) && void 0 !== t ? t : e.title) &&
            void 0 !== o
              ? o
              : ''
        return (0, r.isCircleLogoWithUrlProps)(e)
          ? n.createElement('img', {
              className: i,
              crossOrigin: '',
              src: e.logoUrl,
              alt: a,
              title: e.title,
              loading: e.loading,
              'aria-label': e['aria-label'],
              'aria-hidden': e['aria-hidden'],
            })
          : n.createElement(
              'span',
              {
                className: i,
                title: e.title,
                'aria-label': e['aria-label'],
                'aria-hidden': e['aria-hidden'],
              },
              e.placeholderLetter,
            )
      }
    },
    439067: (e, t, o) => {
      o.d(t, { getStyleClasses: () => r, isCircleLogoWithUrlProps: () => i })
      var n = o(497754)
      function r(e, t) {
        return n('tv-circle-logo', `tv-circle-logo--${e}`, t)
      }
      function i(e) {
        return 'logoUrl' in e && void 0 !== e.logoUrl && 0 !== e.logoUrl.length
      }
    },
    163694: (e, t, o) => {
      o.d(t, { DrawerContext: () => a, DrawerManager: () => i })
      var n = o(50959),
        r = o(285089)
      class i extends n.PureComponent {
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
            ((0, r.setFixedBodyState)(!0), (this._isBodyFixed = !0)),
            t.stack.length &&
              !this.state.stack.length &&
              this._isBodyFixed &&
              ((0, r.setFixedBodyState)(!1), (this._isBodyFixed = !1))
        }
        componentWillUnmount() {
          this.state.stack.length &&
            this._isBodyFixed &&
            (0, r.setFixedBodyState)(!1)
        }
        render() {
          return n.createElement(
            a.Provider,
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
      const a = n.createContext(null)
    },
    759339: (e, t, o) => {
      o.d(t, { Drawer: () => h })
      var n = o(50959),
        r = o(650151),
        i = o(497754),
        a = o(189904),
        s = o(813113),
        l = o(163694),
        c = o(28466),
        d = o(742554),
        u = o(966076)
      function h(e) {
        const {
            position: t = 'Bottom',
            onClose: o,
            children: d,
            className: h,
            theme: m = u,
          } = e,
          v = (0, r.ensureNotNull)((0, n.useContext)(l.DrawerContext)),
          [f] = (0, n.useState)(() => (0, a.randomHash)()),
          g = (0, n.useRef)(null),
          w = (0, n.useContext)(c.CloseDelegateContext)
        return (
          (0, n.useLayoutEffect)(
            () => (
              (0, r.ensureNotNull)(g.current).focus({ preventScroll: !0 }),
              w.subscribe(v, o),
              v.addDrawer(f),
              () => {
                v.removeDrawer(f), w.unsubscribe(v, o)
              }
            ),
            [],
          ),
          n.createElement(
            s.Portal,
            null,
            n.createElement(
              'div',
              { className: i(u.wrap, u[`position${t}`]) },
              f === v.currentDrawer &&
                n.createElement('div', { className: u.backdrop, onClick: o }),
              n.createElement(
                p,
                {
                  className: i(m.drawer, u[`position${t}`], h),
                  ref: g,
                  'data-name': e['data-name'],
                },
                d,
              ),
            ),
          )
        )
      }
      const p = (0, n.forwardRef)((e, t) => {
        const { className: o, ...r } = e
        return n.createElement(d.TouchScrollContainer, {
          className: i(u.drawer, o),
          tabIndex: -1,
          ref: t,
          ...r,
        })
      })
    },
    192063: (e, t, o) => {
      o.d(t, { DEFAULT_POPUP_MENU_ITEM_THEME: () => c, PopupMenuItem: () => u })
      var n = o(50959),
        r = o(497754),
        i = o(32133),
        a = o(370981),
        s = o(636080),
        l = o(671986)
      const c = l
      function d(e) {
        e.stopPropagation()
      }
      function u(e) {
        const {
            id: t,
            role: o,
            className: c,
            title: u,
            labelRowClassName: h,
            labelClassName: p,
            toolboxClassName: m,
            shortcut: v,
            forceShowShortcuts: f,
            icon: g,
            iconClassname: w,
            isActive: b,
            isDisabled: k,
            isHovered: E,
            appearAsDisabled: C,
            label: D,
            link: x,
            showToolboxOnHover: N,
            showToolboxOnFocus: _,
            target: O,
            rel: T,
            toolbox: y,
            reference: M,
            onMouseOut: B,
            onMouseOver: F,
            onKeyDown: P,
            suppressToolboxClick: L = !0,
            theme: A = l,
            tabIndex: S,
            tagName: R,
            renderComponent: U,
            roundedIcon: I,
            iconAriaProps: W,
            circleLogo: Q,
            dontClosePopup: H,
            onClick: j,
            onClickArg: z,
            trackEventObject: G,
            trackMouseWheelClick: K,
            trackRightClick: V,
            ...q
          } = e,
          J = (0, n.useRef)(null),
          $ = (0, n.useMemo)(
            () =>
              ((e) => {
                function t(t) {
                  const { reference: o, ...r } = t,
                    i = null != e ? e : r.href ? 'a' : 'div',
                    a =
                      'a' === i
                        ? r
                        : ((e) => {
                            const {
                              download: t,
                              href: o,
                              hrefLang: n,
                              media: r,
                              ping: i,
                              rel: a,
                              target: s,
                              type: l,
                              referrerPolicy: c,
                              ...d
                            } = e
                            return d
                          })(r)
                  return n.createElement(i, { ...a, ref: o })
                }
                return (t.displayName = `DefaultComponent(${e})`), t
              })(R),
            [R],
          ),
          X = null != U ? U : $
        return n.createElement(
          X,
          {
            ...q,
            id: t,
            role: o,
            className: r(c, A.item, g && A.withIcon, {
              [A.isActive]: b,
              [A.isDisabled]: k || C,
              [A.hovered]: E,
            }),
            title: u,
            href: x,
            target: O,
            rel: T,
            reference: (e) => {
              ;(J.current = e), 'function' == typeof M && M(e)
              'object' == typeof M && (M.current = e)
            },
            onClick: (e) => {
              if (k) return
              G && (0, i.trackEvent)(G.category, G.event, G.label)
              j && j(z, e)
              H || (0, a.globalCloseMenu)()
            },
            onContextMenu: (e) => {
              G &&
                V &&
                (0, i.trackEvent)(G.category, G.event, `${G.label}_rightClick`)
            },
            onMouseUp: (e) => {
              if (1 === e.button && x && G) {
                let e = G.label
                K && (e += '_mouseWheelClick'),
                  (0, i.trackEvent)(G.category, G.event, e)
              }
            },
            onMouseOver: F,
            onMouseOut: B,
            onKeyDown: P,
            tabIndex: S,
          },
          Q &&
            n.createElement(s.CircleLogo, {
              ...W,
              className: l['disclosure-item-circle-logo'],
              size: 'xxxsmall',
              logoUrl: Q.logoUrl,
              placeholderLetter: Q.placeholderLetter,
            }),
          g &&
            n.createElement('span', {
              'aria-label': W && W['aria-label'],
              'aria-hidden': W && Boolean(W['aria-hidden']),
              className: r(A.icon, I && l['round-icon'], w),
              dangerouslySetInnerHTML: { __html: g },
            }),
          n.createElement(
            'span',
            { className: r(A.labelRow, h) },
            n.createElement('span', { className: r(A.label, p) }, D),
          ),
          (void 0 !== v || f) &&
            n.createElement(
              'span',
              { className: A.shortcut },
              (Y = v) && Y.split('+').join(' + '),
            ),
          void 0 !== y &&
            n.createElement(
              'span',
              {
                onClick: L ? d : void 0,
                className: r(m, A.toolbox, {
                  [A.showOnHover]: N,
                  [A.showOnFocus]: _,
                }),
              },
              y,
            ),
        )
        var Y
      }
    },
    624216: (e, t, o) => {
      o.d(t, { PopupMenu: () => h })
      var n = o(50959),
        r = o(500962),
        i = o(162942),
        a = o(813113),
        s = o(510618),
        l = o(28466)
      const c = n.createContext(void 0)
      var d = o(908783)
      const u = n.createContext({ setMenuMaxWidth: !1 })
      function h(e) {
        const {
            controller: t,
            children: o,
            isOpened: h,
            closeOnClickOutside: p = !0,
            doNotCloseOn: m,
            onClickOutside: v,
            onClose: f,
            onKeyboardClose: g,
            'data-name': w = 'popup-menu-container',
            ...b
          } = e,
          k = (0, n.useContext)(l.CloseDelegateContext),
          E = n.useContext(u),
          C = (0, n.useContext)(c),
          D = (0, d.useOutsideEvent)({
            handler: (e) => {
              v && v(e)
              if (!p) return
              const t = (0, i.default)(m) ? m() : null == m ? [] : [m]
              if (t.length > 0 && e.target instanceof Node)
                for (const o of t) {
                  const t = r.findDOMNode(o)
                  if (t instanceof Node && t.contains(e.target)) return
                }
              f()
            },
            mouseDown: !0,
            touchStart: !0,
          })
        return h
          ? n.createElement(
              a.Portal,
              {
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                pointerEvents: 'none',
              },
              n.createElement(
                'span',
                { ref: D, style: { pointerEvents: 'auto' } },
                n.createElement(
                  s.Menu,
                  {
                    ...b,
                    onClose: f,
                    onKeyboardClose: g,
                    onScroll: (t) => {
                      const { onScroll: o } = e
                      o && o(t)
                    },
                    customCloseDelegate: k,
                    customRemeasureDelegate: C,
                    ref: t,
                    'data-name': w,
                    limitMaxWidth: E.setMenuMaxWidth,
                  },
                  o,
                ),
              ),
            )
          : null
      }
    },
    515783: (e, t, o) => {
      o.d(t, { ToolWidgetCaret: () => l })
      var n = o(50959),
        r = o(497754),
        i = o(72571),
        a = o(934587),
        s = o(100578)
      function l(e) {
        const { dropped: t, className: o } = e
        return n.createElement(i.Icon, {
          className: r(o, a.icon, { [a.dropped]: t }),
          icon: s,
        })
      }
    },
    742554: (e, t, o) => {
      o.d(t, { TouchScrollContainer: () => s })
      var n = o(50959),
        r = o(259142),
        i = o(650151),
        a = o(601227)
      const s = (0, n.forwardRef)((e, t) => {
        const { children: o, ...i } = e,
          s = (0, n.useRef)(null)
        return (
          (0, n.useImperativeHandle)(t, () => s.current),
          (0, n.useLayoutEffect)(() => {
            if (a.CheckMobile.iOS())
              return (
                null !== s.current &&
                  (0, r.disableBodyScroll)(s.current, { allowTouchMove: l(s) }),
                () => {
                  null !== s.current && (0, r.enableBodyScroll)(s.current)
                }
              )
          }, []),
          n.createElement('div', { ref: s, ...i }, o)
        )
      })
      function l(e) {
        return (t) => {
          const o = (0, i.ensureNotNull)(e.current),
            n = document.activeElement
          return (
            !o.contains(t) || (null !== n && o.contains(n) && n.contains(t))
          )
        }
      }
    },
    278029: (e) => {
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
    442919: (e) => {
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
    476853: (e, t, o) => {
      o.d(t, {
        HorizontalAttachEdge: () => r,
        HorizontalDropDirection: () => a,
        VerticalAttachEdge: () => n,
        VerticalDropDirection: () => i,
        getPopupPositioner: () => c,
      })
      var n,
        r,
        i,
        a,
        s = o(650151)
      !((e) => {
        ;(e[(e.Top = 0)] = 'Top'),
          (e[(e.Bottom = 1)] = 'Bottom'),
          (e[(e.AutoStrict = 2)] = 'AutoStrict')
      })(n || (n = {})),
        ((e) => {
          ;(e[(e.Left = 0)] = 'Left'), (e[(e.Right = 1)] = 'Right')
        })(r || (r = {})),
        ((e) => {
          ;(e[(e.FromTopToBottom = 0)] = 'FromTopToBottom'),
            (e[(e.FromBottomToTop = 1)] = 'FromBottomToTop')
        })(i || (i = {})),
        ((e) => {
          ;(e[(e.FromLeftToRight = 0)] = 'FromLeftToRight'),
            (e[(e.FromRightToLeft = 1)] = 'FromRightToLeft')
        })(a || (a = {}))
      const l = {
        verticalAttachEdge: n.Bottom,
        horizontalAttachEdge: r.Left,
        verticalDropDirection: i.FromTopToBottom,
        horizontalDropDirection: a.FromLeftToRight,
        verticalMargin: 0,
        horizontalMargin: 0,
        matchButtonAndListboxWidths: !1,
      }
      function c(e, t) {
        return (o) => {
          var c, d
          const { contentWidth: u, contentHeight: h, availableHeight: p } = o,
            m = (0, s.ensureNotNull)(e).getBoundingClientRect(),
            {
              horizontalAttachEdge: v = l.horizontalAttachEdge,
              horizontalDropDirection: f = l.horizontalDropDirection,
              horizontalMargin: g = l.horizontalMargin,
              verticalMargin: w = l.verticalMargin,
              matchButtonAndListboxWidths: b = l.matchButtonAndListboxWidths,
            } = t
          let k =
              null !== (c = t.verticalAttachEdge) && void 0 !== c
                ? c
                : l.verticalAttachEdge,
            E =
              null !== (d = t.verticalDropDirection) && void 0 !== d
                ? d
                : l.verticalDropDirection
          k === n.AutoStrict &&
            (p < m.y + m.height + w + h
              ? ((k = n.Top), (E = i.FromBottomToTop))
              : ((k = n.Bottom), (E = i.FromTopToBottom)))
          const C = k === n.Top ? -1 * w : w,
            D = v === r.Right ? m.right : m.left,
            x = k === n.Top ? m.top : m.bottom,
            N = {
              x: D - (f === a.FromRightToLeft ? u : 0) + g,
              y: x - (E === i.FromBottomToTop ? h : 0) + C,
            }
          return b && (N.overrideWidth = m.width), N
        }
      }
    },
    747633: (e, t, o) => {
      o.d(t, {
        DEFAULT_TOOL_WIDGET_BUTTON_THEME: () => s,
        ToolWidgetButton: () => l,
      })
      var n = o(50959),
        r = o(497754),
        i = o(72571),
        a = o(278029)
      const s = a,
        l = n.forwardRef((e, t) => {
          const {
              tag: o = 'div',
              icon: s,
              endIcon: l,
              isActive: c,
              isOpened: d,
              isDisabled: u,
              isGrouped: h,
              isHovered: p,
              isClicked: m,
              onClick: v,
              text: f,
              textBeforeIcon: g,
              title: w,
              theme: b = a,
              className: k,
              forceInteractive: E,
              inactive: C,
              'data-name': D,
              'data-tooltip': x,
              ...N
            } = e,
            _ = r(k, b.button, (w || x) && 'apply-common-tooltip', {
              [b.isActive]: c,
              [b.isOpened]: d,
              [b.isInteractive]: (E || Boolean(v)) && !u && !C,
              [b.isDisabled]: Boolean(u || C),
              [b.isGrouped]: h,
              [b.hover]: p,
              [b.clicked]: m,
            }),
            O =
              s &&
              ('string' == typeof s
                ? n.createElement(i.Icon, { className: b.icon, icon: s })
                : n.cloneElement(s, {
                    className: r(b.icon, s.props.className),
                  }))
          return 'button' === o
            ? n.createElement(
                'button',
                {
                  ...N,
                  ref: t,
                  type: 'button',
                  className: r(_, b.accessible),
                  disabled: u && !C,
                  onClick: v,
                  title: w,
                  'data-name': D,
                  'data-tooltip': x,
                },
                g &&
                  f &&
                  n.createElement(
                    'div',
                    { className: r('js-button-text', b.text) },
                    f,
                  ),
                O,
                !g &&
                  f &&
                  n.createElement(
                    'div',
                    { className: r('js-button-text', b.text) },
                    f,
                  ),
              )
            : n.createElement(
                'div',
                {
                  ...N,
                  ref: t,
                  'data-role': 'button',
                  className: _,
                  onClick: u ? void 0 : v,
                  title: w,
                  'data-name': D,
                  'data-tooltip': x,
                },
                g &&
                  f &&
                  n.createElement(
                    'div',
                    { className: r('js-button-text', b.text) },
                    f,
                  ),
                O,
                !g &&
                  f &&
                  n.createElement(
                    'div',
                    { className: r('js-button-text', b.text) },
                    f,
                  ),
                l && n.createElement(i.Icon, { icon: l, className: a.endIcon }),
              )
        })
    },
    518799: (e, t, o) => {
      o.d(t, {
        DEFAULT_TOOL_WIDGET_MENU_THEME: () => f,
        ToolWidgetMenu: () => g,
      })
      var n = o(50959),
        r = o(497754),
        i = o(930202),
        a = o(624216),
        s = o(515783),
        l = o(800417),
        c = o(163694),
        d = o(759339),
        u = o(476853),
        h = o(930052),
        p = o(156963),
        m = o(111706),
        v = o(442919)
      const f = v
      class g extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._wrapperRef = null),
            (this._controller = n.createRef()),
            (this._handleWrapperRef = (e) => {
              ;(this._wrapperRef = e),
                this.props.reference && this.props.reference(e)
            }),
            (this._handleOpen = () => {
              var e
              'div' !== this.props.tag &&
                (null === (e = this._controller.current) ||
                  void 0 === e ||
                  e.focus())
            }),
            (this._handleClick = (e) => {
              ;(p.enabled('skip_event_target_check') ||
                e.target instanceof Node) &&
                e.currentTarget.contains(e.target) &&
                (this._handleToggleDropdown(void 0, (0, m.isKeyboardClick)(e)),
                this.props.onClick &&
                  this.props.onClick(e, !this.state.isOpened))
            }),
            (this._handleToggleDropdown = (e, t = !1) => {
              const { onClose: o, onOpen: n } = this.props,
                { isOpened: r } = this.state,
                i = 'boolean' == typeof e ? e : !r
              this.setState({ isOpened: i, shouldReturnFocus: !!i && t }),
                i && n && n(),
                !i && o && o()
            }),
            (this._handleClose = () => {
              this.close()
            }),
            (this._handleKeyDown = (e) => {
              var t
              const { orientation: o = 'horizontal' } = this.props
              if (e.defaultPrevented) return
              if (!(e.target instanceof Node)) return
              const n = (0, i.hashFromEvent)(e)
              if (e.currentTarget.contains(e.target))
                switch (n) {
                  case 40:
                    if ('div' === this.props.tag || 'horizontal' !== o) return
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
                switch (n) {
                  case 27: {
                    e.preventDefault()
                    const { shouldReturnFocus: o } = this.state
                    this._handleToggleDropdown(!1),
                      o &&
                        (null === (t = this._wrapperRef) ||
                          void 0 === t ||
                          t.focus())
                    break
                  }
                }
              }
            }),
            (this.state = { isOpened: !1, shouldReturnFocus: !1 })
        }
        render() {
          const {
              tag: e = 'div',
              id: t,
              arrow: o,
              content: i,
              isDisabled: a,
              isDrawer: c,
              isShowTooltip: d,
              title: u,
              className: p,
              hotKey: m,
              theme: v,
              drawerBreakpoint: f,
              tabIndex: g,
              isClicked: w,
            } = this.props,
            { isOpened: b } = this.state,
            k = r(p, v.button, {
              'apply-common-tooltip': d || !a,
              [v.isDisabled]: a,
              [v.isOpened]: b,
              [v.clicked]: w,
            })
          return 'button' === e
            ? n.createElement(
                'button',
                {
                  type: 'button',
                  id: t,
                  className: r(k, v.accessible),
                  disabled: a,
                  onClick: this._handleClick,
                  title: u,
                  'data-tooltip-hotkey': m,
                  ref: this._handleWrapperRef,
                  onKeyDown: this._handleKeyDown,
                  tabIndex: g,
                  ...(0, l.filterDataProps)(this.props),
                  ...(0, l.filterAriaProps)(this.props),
                },
                i,
                o &&
                  n.createElement(
                    'div',
                    { className: v.arrow },
                    n.createElement(
                      'div',
                      {
                        className: v.arrowWrap,
                      },
                      n.createElement(s.ToolWidgetCaret, { dropped: b }),
                    ),
                  ),
                this.state.isOpened &&
                  (f
                    ? n.createElement(h.MatchMedia, { rule: f }, (e) =>
                        this._renderContent(e),
                      )
                    : this._renderContent(c)),
              )
            : n.createElement(
                'div',
                {
                  id: t,
                  className: k,
                  onClick: a ? void 0 : this._handleClick,
                  title: u,
                  'data-tooltip-hotkey': m,
                  ref: this._handleWrapperRef,
                  'data-role': 'button',
                  tabIndex: g,
                  onKeyDown: this._handleKeyDown,
                  ...(0, l.filterDataProps)(this.props),
                },
                i,
                o &&
                  n.createElement(
                    'div',
                    { className: v.arrow },
                    n.createElement(
                      'div',
                      { className: v.arrowWrap },
                      n.createElement(s.ToolWidgetCaret, { dropped: b }),
                    ),
                  ),
                this.state.isOpened &&
                  (f
                    ? n.createElement(h.MatchMedia, { rule: f }, (e) =>
                        this._renderContent(e),
                      )
                    : this._renderContent(c)),
              )
        }
        close() {
          this._handleToggleDropdown(!1)
        }
        focus() {
          var e
          null === (e = this._wrapperRef) || void 0 === e || e.focus()
        }
        update() {
          null !== this._controller.current && this._controller.current.update()
        }
        _renderContent(e) {
          const {
              menuDataName: t,
              minWidth: o,
              menuClassName: r,
              maxHeight: i,
              drawerPosition: s = 'Bottom',
              children: l,
            } = this.props,
            { isOpened: h } = this.state,
            p = {
              horizontalMargin: this.props.horizontalMargin || 0,
              verticalMargin: this.props.verticalMargin || 2,
              verticalAttachEdge: this.props.verticalAttachEdge,
              horizontalAttachEdge: this.props.horizontalAttachEdge,
              verticalDropDirection: this.props.verticalDropDirection,
              horizontalDropDirection: this.props.horizontalDropDirection,
              matchButtonAndListboxWidths:
                this.props.matchButtonAndListboxWidths,
            },
            m = Boolean(h && e && s),
            v = ((e) => 'function' == typeof e)(l) ? l({ isDrawer: m }) : l
          return m
            ? n.createElement(
                c.DrawerManager,
                null,
                n.createElement(
                  d.Drawer,
                  { onClose: this._handleClose, position: s, 'data-name': t },
                  v,
                ),
              )
            : n.createElement(
                a.PopupMenu,
                {
                  reference: this.props.menuReference,
                  controller: this._controller,
                  closeOnClickOutside: this.props.closeOnClickOutside,
                  doNotCloseOn: this,
                  isOpened: h,
                  minWidth: o,
                  onClose: this._handleClose,
                  position: (0, u.getPopupPositioner)(this._wrapperRef, p),
                  className: r,
                  maxHeight: i,
                  'data-name': t,
                  tabIndex: 'div' !== this.props.tag ? -1 : void 0,
                  onOpen: this._handleOpen,
                  onKeyDown: this.props.onMenuKeyDown,
                  onFocus: this.props.onMenuFocus,
                },
                v,
              )
        }
      }
      g.defaultProps = { arrow: !0, closeOnClickOutside: !0, theme: v }
    },
    100578: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8" width="16" height="8"><path fill="currentColor" d="M0 1.475l7.396 6.04.596.485.593-.49L16 1.39 14.807 0 7.393 6.122 8.58 6.12 1.186.08z"/></svg>'
    },
  },
])
