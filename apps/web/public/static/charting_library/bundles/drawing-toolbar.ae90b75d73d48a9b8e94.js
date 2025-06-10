;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2878],
  {
    3845: (e) => {
      e.exports = { 'default-drawer-min-top-distance': '100px' }
    },
    22413: (e) => {
      e.exports = {
        favorite: 'favorite-_FRQhM5Y',
        hovered: 'hovered-_FRQhM5Y',
        disabled: 'disabled-_FRQhM5Y',
        focused: 'focused-_FRQhM5Y',
        active: 'active-_FRQhM5Y',
        checked: 'checked-_FRQhM5Y',
      }
    },
    95214: (e) => {
      e.exports = {
        item: 'item-zwyEh4hn',
        label: 'label-zwyEh4hn',
        labelRow: 'labelRow-zwyEh4hn',
        toolbox: 'toolbox-zwyEh4hn',
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
    67842: (e, t, o) => {
      o.d(t, { useResizeObserver: () => s })
      var n = o(50959),
        i = o(43010),
        l = o(39416)
      function s(e, t = []) {
        const { callback: o, ref: s = null } = ((e) =>
            'function' == typeof e ? { callback: e } : e)(e),
          a = (0, n.useRef)(null),
          r = (0, n.useRef)(o)
        r.current = o
        const c = (0, l.useFunctionalRefObject)(s),
          u = (0, n.useCallback)(
            (e) => {
              c(e),
                null !== a.current &&
                  (a.current.disconnect(), null !== e && a.current.observe(e))
            },
            [c, a],
          )
        return (
          (0, i.useIsomorphicLayoutEffect)(
            () => (
              (a.current = new ResizeObserver((e, t) => {
                r.current(e, t)
              })),
              c.current && u(c.current),
              () => {
                a.current?.disconnect()
              }
            ),
            [c, ...t],
          ),
          u
        )
      }
    },
    47201: (e, t, o) => {
      function n(...e) {
        return (t) => {
          for (const o of e) void 0 !== o && o(t)
        }
      }
      o.d(t, { createSafeMulticastEventHandler: () => n })
    },
    45601: (e, t, o) => {
      o.d(t, { Measure: () => i })
      var n = o(67842)
      function i(e) {
        const { children: t, onResize: o } = e
        return t((0, n.useResizeObserver)(o || (() => {}), [null === o]))
      }
    },
    74670: (e, t, o) => {
      o.d(t, { useActiveDescendant: () => l })
      var n = o(50959),
        i = o(39416)
      function l(e, t = []) {
        const [o, l] = (0, n.useState)(!1),
          s = (0, i.useFunctionalRefObject)(e)
        return (
          (0, n.useLayoutEffect)(() => {
            const e = s.current
            if (null === e) return
            const t = (e) => {
              switch (e.type) {
                case 'active-descendant-focus':
                  l(!0)
                  break
                case 'active-descendant-blur':
                  l(!1)
              }
            }
            return (
              e.addEventListener('active-descendant-focus', t),
              e.addEventListener('active-descendant-blur', t),
              () => {
                e.removeEventListener('active-descendant-focus', t),
                  e.removeEventListener('active-descendant-blur', t)
              }
            )
          }, t),
          [s, o]
        )
      }
    },
    71402: (e, t, o) => {
      o.d(t, { RemoveTitleType: () => n, removeTitlesMap: () => l })
      var n,
        i = o(11542)
      !((e) => {
        ;(e.Add = 'add'), (e.Remove = 'remove')
      })(n || (n = {}))
      const l = {
        [n.Add]: i.t(null, void 0, o(69207)),
        [n.Remove]: i.t(null, void 0, o(85106)),
      }
    },
    36189: (e, t, o) => {
      o.d(t, { FavoriteButton: () => h })
      var n = o(50959),
        i = o(97754),
        l = o.n(i),
        s = o(9745),
        a = o(71402),
        r = o(74670),
        c = o(39146),
        u = o(48010),
        d = o(22413)
      function h(e) {
        const {
            className: t,
            isFilled: o,
            isActive: i,
            onClick: h,
            title: m,
            ...v
          } = e,
          [p, g] = (0, r.useActiveDescendant)(null),
          b =
            m ??
            (o
              ? a.removeTitlesMap[a.RemoveTitleType.Remove]
              : a.removeTitlesMap[a.RemoveTitleType.Add])
        return (
          (0, n.useLayoutEffect)(() => {
            const e = p.current
            e instanceof HTMLElement &&
              b &&
              e.dispatchEvent(new CustomEvent('common-tooltip-update'))
          }, [b, p]),
          n.createElement(s.Icon, {
            ...v,
            className: l()(
              d.favorite,
              'apply-common-tooltip',
              o && d.checked,
              i && d.active,
              g && d.focused,
              t,
            ),
            onClick: h,
            icon: o ? c : u,
            title: b,
            ariaLabel: b,
            ref: p,
          })
        )
      }
    },
    78036: (e, t, o) => {
      o.d(t, { useEnsuredContext: () => l })
      var n = o(50959),
        i = o(50151)
      function l(e) {
        return (0, i.ensureNotNull)((0, n.useContext)(e))
      }
    },
    70412: (e, t, o) => {
      o.d(t, {
        hoverMouseEventFilter: () => l,
        useAccurateHover: () => s,
        useHover: () => i,
      })
      var n = o(50959)
      function i() {
        const [e, t] = (0, n.useState)(!1)
        return [
          e,
          {
            onMouseOver: (e) => {
              l(e) && t(!0)
            },
            onMouseOut: (e) => {
              l(e) && t(!1)
            },
          },
        ]
      }
      function l(e) {
        return !e.currentTarget.contains(e.relatedTarget)
      }
      function s(e) {
        const [t, o] = (0, n.useState)(!1)
        return (
          (0, n.useEffect)(() => {
            const t = (t) => {
              if (null === e.current) return
              const n = e.current.contains(t.target)
              o(n)
            }
            return (
              document.addEventListener('mouseover', t),
              () => document.removeEventListener('mouseover', t)
            )
          }, []),
          t
        )
      }
    },
    29006: (e, t, o) => {
      o.d(t, { useResizeObserver: () => n.useResizeObserver })
      var n = o(67842)
    },
    29185: (e, t, o) => {
      o.d(t, { useWatchedValue: () => i })
      var n = o(50959)
      const i = (e, t = []) => {
        const [o, i] = (0, n.useState)(e.value())
        return (
          (0, n.useEffect)(() => {
            const t = (e) => i(e)
            return e.subscribe(t), () => e.unsubscribe(t)
          }, [e, ...t]),
          [o, (t) => e.setValue(t)]
        )
      }
    },
    81332: (e, t, o) => {
      o.d(t, { multilineLabelWithIconAndToolboxTheme: () => s })
      var n = o(40173),
        i = o(9059),
        l = o(95214)
      const s = (0, n.mergeThemes)(i, l)
    },
    11684: (e, t, o) => {
      o.d(t, { PopupMenuSeparator: () => r })
      var n,
        i = o(50959),
        l = o(97754),
        s = o.n(l),
        a = o(238)
      function r(e) {
        const { size: t = 'normal', className: o, ariaHidden: n = !1 } = e
        return i.createElement('div', {
          className: s()(
            a.separator,
            'small' === t && a.small,
            'normal' === t && a.normal,
            'large' === t && a.large,
            o,
          ),
          role: 'separator',
          'aria-hidden': n,
        })
      }
      !((e) => {
        ;(e.Small = 'small'), (e.Large = 'large'), (e.Normal = 'normal')
      })(n || (n = {}))
    },
    6132: (e, t, o) => {
      var n = o(22134)
      function i() {}
      function l() {}
      ;(l.resetWarningCache = i),
        (e.exports = () => {
          function e(e, t, o, i, l, s) {
            if (s !== n) {
              var a = new Error(
                'Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types',
              )
              throw ((a.name = 'Invariant Violation'), a)
            }
          }
          function t() {
            return e
          }
          e.isRequired = e
          var o = {
            array: e,
            bool: e,
            func: e,
            number: e,
            object: e,
            string: e,
            symbol: e,
            any: e,
            arrayOf: t,
            element: e,
            elementType: e,
            instanceOf: t,
            node: e,
            objectOf: t,
            oneOf: t,
            oneOfType: t,
            shape: t,
            exact: t,
            checkPropTypes: l,
            resetWarningCache: i,
          }
          return (o.PropTypes = o), o
        })
    },
    19036: (e, t, o) => {
      e.exports = o(6132)()
    },
    22134: (e) => {
      e.exports = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED'
    },
    89888: (e) => {
      e.exports = { button: 'button-LkmyTVRc', active: 'active-LkmyTVRc' }
    },
    77020: (e) => {
      e.exports = {
        dropdown: 'dropdown-pbhJWNrt',
        buttonWrap: 'buttonWrap-pbhJWNrt',
        control: 'control-pbhJWNrt',
        arrow: 'arrow-pbhJWNrt',
        arrowIcon: 'arrowIcon-pbhJWNrt',
        isOpened: 'isOpened-pbhJWNrt',
        hover: 'hover-pbhJWNrt',
        isGrayed: 'isGrayed-pbhJWNrt',
        accessible: 'accessible-pbhJWNrt',
      }
    },
    55973: (e) => {
      e.exports = { title: 'title-u3QJgF_p' }
    },
    3088: (e) => {
      e.exports = {
        container: 'container-Wp9adlfh',
        mirror: 'mirror-Wp9adlfh',
        background: 'background-Wp9adlfh',
        arrow: 'arrow-Wp9adlfh',
      }
    },
    11766: (e) => {
      e.exports = { item: 'item-uxNfqe_g', label: 'label-uxNfqe_g' }
    },
    63754: (e) => {
      e.exports = {
        drawingToolbar: 'drawingToolbar-BfVZxb4b',
        isHidden: 'isHidden-BfVZxb4b',
        inner: 'inner-BfVZxb4b',
        group: 'group-BfVZxb4b',
        lastGroup: 'lastGroup-BfVZxb4b',
        fill: 'fill-BfVZxb4b',
      }
    },
    55613: (e) => {
      e.exports = {
        toggleButton: 'toggleButton-OhcB9eH7',
        collapsed: 'collapsed-OhcB9eH7',
        background: 'background-OhcB9eH7',
        arrow: 'arrow-OhcB9eH7',
        accessible: 'accessible-OhcB9eH7',
      }
    },
    74099: (e) => {
      e.exports = { item: 'item-yfwdxbRo', hovered: 'hovered-yfwdxbRo' }
    },
    89265: (e) => {
      e.exports = {
        desktopSize: 'desktopSize-l1SzP6TV',
        smallSize: 'smallSize-l1SzP6TV',
        tabs: 'tabs-l1SzP6TV',
        categories: 'categories-l1SzP6TV',
      }
    },
    33892: (e) => {
      e.exports = { sticker: 'sticker-aZclaNCs' }
    },
    65171: (e) => {
      e.exports = {
        'tablet-small-breakpoint': '(max-width: 440px)',
        stickerRow: 'stickerRow-KUOIljqV',
      }
    },
    59453: (e) => {
      e.exports = { wrapper: 'wrapper-FNeSdxed' }
    },
    33430: (e) => {
      e.exports = { drawer: 'drawer-PzCssz1z', menuBox: 'menuBox-PzCssz1z' }
    },
    57503: (e) => {
      e.exports = {
        toolButtonMagnet: 'toolButtonMagnet-wg76fIbD',
        toolButtonMagnet__menuItem: 'toolButtonMagnet__menuItem-wg76fIbD',
        toolButtonMagnet__hintPlaceholder:
          'toolButtonMagnet__hintPlaceholder-wg76fIbD',
      }
    },
    73824: (e) => {
      e.exports = {
        sectionTitle: 'sectionTitle-Srvnqigs',
        newBadge: 'newBadge-Srvnqigs',
        label: 'label-Srvnqigs',
      }
    },
    82374: (e) => {
      e.exports = {
        wrap: 'wrap-Z4M3tWHb',
        scrollWrap: 'scrollWrap-Z4M3tWHb',
        noScrollBar: 'noScrollBar-Z4M3tWHb',
        content: 'content-Z4M3tWHb',
        icon: 'icon-Z4M3tWHb',
        scrollBot: 'scrollBot-Z4M3tWHb',
        scrollTop: 'scrollTop-Z4M3tWHb',
        isVisible: 'isVisible-Z4M3tWHb',
        iconWrap: 'iconWrap-Z4M3tWHb',
        fadeBot: 'fadeBot-Z4M3tWHb',
        fadeTop: 'fadeTop-Z4M3tWHb',
      }
    },
    29703: (e) => {
      e.exports = { iconContainer: 'iconContainer-dmpvVypS' }
    },
    20243: (e, t, o) => {
      o.d(t, {
        focusFirstMenuItem: () => u,
        handleAccessibleMenuFocus: () => r,
        handleAccessibleMenuKeyDown: () => c,
        queryMenuElements: () => m,
      })
      var n = o(19291),
        i = o(57177),
        l = o(68335),
        s = o(15754)
      const a = [37, 39, 38, 40]
      function r(e, t) {
        if (!e.target) return
        const o = e.relatedTarget?.getAttribute('aria-activedescendant')
        if (e.relatedTarget !== t.current) {
          const e = o && document.getElementById(o)
          if (!e || e !== t.current) return
        }
        u(e.target)
      }
      function c(e) {
        if (e.defaultPrevented) return
        const t = (0, l.hashFromEvent)(e)
        if (!a.includes(t)) return
        const o = document.activeElement
        if (!(document.activeElement instanceof HTMLElement)) return
        const s = m(e.currentTarget).sort(n.navigationOrderComparator)
        if (0 === s.length) return
        const r =
          document.activeElement.closest('[data-role="menuitem"]') ||
          document.activeElement.parentElement?.querySelector(
            '[data-role="menuitem"]',
          )
        if (!(r instanceof HTMLElement)) return
        const c = s.indexOf(r)
        if (-1 === c) return
        const u = v(r),
          p = u.indexOf(document.activeElement),
          g = -1 !== p,
          b = (e) => {
            o && (0, i.becomeSecondaryElement)(o),
              (0, i.becomeMainElement)(e),
              e.focus()
          }
        switch ((0, n.mapKeyCodeToDirection)(t)) {
          case 'inlinePrev':
            if (!u.length) return
            e.preventDefault(),
              b(0 === p ? s[c] : g ? d(u, p, -1) : u[u.length - 1])
            break
          case 'inlineNext':
            if (!u.length) return
            e.preventDefault(),
              p === u.length - 1 ? b(s[c]) : b(g ? d(u, p, 1) : u[0])
            break
          case 'blockPrev': {
            e.preventDefault()
            const t = d(s, c, -1)
            if (g) {
              const e = h(t, p)
              b(e || t)
              break
            }
            b(t)
            break
          }
          case 'blockNext': {
            e.preventDefault()
            const t = d(s, c, 1)
            if (g) {
              const e = h(t, p)
              b(e || t)
              break
            }
            b(t)
          }
        }
      }
      function u(e) {
        const [t] = m(e)
        t && ((0, i.becomeMainElement)(t), t.focus())
      }
      function d(e, t, o) {
        return e[(t + e.length + o) % e.length]
      }
      function h(e, t) {
        const o = v(e)
        return o.length ? o[(t + o.length) % o.length] : null
      }
      function m(e) {
        return Array.from(
          e.querySelectorAll(
            '[data-role="menuitem"]:not([disabled]):not([aria-disabled])',
          ),
        ).filter((0, s.createScopedVisibleElementFilter)(e))
      }
      function v(e) {
        return Array.from(
          e.querySelectorAll('[tabindex]:not([disabled]):not([aria-disabled])'),
        ).filter((0, s.createScopedVisibleElementFilter)(e))
      }
    },
    40894: (e, t, o) => {
      o.d(t, { MenuFavoriteButton: () => u })
      var n = o(50959),
        i = o(97754),
        l = o.n(i),
        s = o(50238),
        a = o(36189),
        r = o(71402),
        c = o(89888)
      function u(e) {
        const { onClick: t, isFilled: o, isActive: i, ...u } = e,
          [d, h] = (0, s.useRovingTabindexElement)(null),
          m = o
            ? r.removeTitlesMap[r.RemoveTitleType.Remove]
            : r.removeTitlesMap[r.RemoveTitleType.Add]
        return (
          (0, n.useLayoutEffect)(() => {
            const e = d.current
            e instanceof HTMLElement &&
              e.dispatchEvent(new CustomEvent('common-tooltip-update'))
          }, [m, d]),
          n.createElement(
            'button',
            {
              ref: d,
              tabIndex: h,
              onClick: t,
              className: l()(c.button, i && c.active, 'apply-common-tooltip'),
              type: 'button',
              'aria-label': m,
              'data-tooltip': m,
            },
            n.createElement(a.FavoriteButton, {
              ...u,
              isFilled: o,
              isActive: i,
              title: '',
            }),
          )
        )
      }
    },
    16829: (e, t, o) => {
      o.d(t, { ToolWidgetMenuSummary: () => s })
      var n = o(50959),
        i = o(97754),
        l = o(55973)
      function s(e) {
        return n.createElement(
          'div',
          { className: i(e.className, l.title) },
          e.children,
        )
      }
    },
    37159: (e, t, o) => {
      o.r(t), o.d(t, { DrawingToolbarRenderer: () => wo })
      var n = o(50959),
        i = o(32227),
        l = o(50151),
        s = o(97754),
        a = o.n(s),
        r = o(32563),
        c = o(56840),
        u = o(56570),
        d = o(928),
        h = o(76422),
        m = o(52033),
        v = o(49483),
        p = o(84015),
        g = o(2627)
      class b {
        constructor(e) {
          this._drawingsAccess = e || { tools: [], type: 'black' }
        }
        isToolEnabled(e) {
          const t = this._findTool(e)
          return (
            !(!t || !t.grayed) ||
            ('black' === this._drawingsAccess.type ? !t : !!t)
          )
        }
        isToolGrayed(e) {
          const t = this._findTool(e)
          return Boolean(t && t.grayed)
        }
        _findTool(e) {
          return this._drawingsAccess.tools.find((t) => t.name === e)
        }
      }
      var f = o(59511),
        T = o(6307),
        C = o(9745),
        w = o(61119),
        _ = o(78871),
        x = o(45601),
        E = o(82374),
        F = o(61380)
      class k extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._scroll = null),
            (this._handleScrollTop = () => {
              this.animateTo(
                Math.max(
                  0,
                  this.currentPosition() - (this.state.heightWrap - 50),
                ),
              )
            }),
            (this._handleScrollBot = () => {
              this.animateTo(
                Math.min(
                  (this.state.heightContent || 0) -
                    (this.state.heightWrap || 0),
                  this.currentPosition() + (this.state.heightWrap - 50),
                ),
              )
            }),
            (this._handleResizeWrap = ([e]) => {
              this.setState({ heightWrap: e.contentRect.height })
            }),
            (this._handleResizeContent = ([e]) => {
              this.setState({ heightContent: e.contentRect.height })
            }),
            (this._handleScroll = () => {
              const { onScroll: e } = this.props
              e && e(this.currentPosition(), this.isAtTop(), this.isAtBot()),
                this._checkButtonsVisibility()
            }),
            (this._checkButtonsVisibility = () => {
              const { isVisibleTopButton: e, isVisibleBotButton: t } =
                  this.state,
                o = this.isAtTop(),
                n = this.isAtBot()
              o || e
                ? o && e && this.setState({ isVisibleTopButton: !1 })
                : this.setState({ isVisibleTopButton: !0 }),
                n || t
                  ? n && t && this.setState({ isVisibleBotButton: !1 })
                  : this.setState({ isVisibleBotButton: !0 })
            }),
            (this.state = {
              heightContent: 0,
              heightWrap: 0,
              isVisibleBotButton: !1,
              isVisibleTopButton: !1,
            })
        }
        componentDidMount() {
          this._checkButtonsVisibility()
        }
        componentDidUpdate(e, t) {
          ;(t.heightWrap === this.state.heightWrap &&
            t.heightContent === this.state.heightContent) ||
            this._handleScroll()
        }
        currentPosition() {
          return this._scroll ? this._scroll.scrollTop : 0
        }
        isAtTop() {
          return this.currentPosition() <= 1
        }
        isAtBot() {
          return (
            this.currentPosition() + this.state.heightWrap >=
            this.state.heightContent - 1
          )
        }
        animateTo(e, t = _.dur) {
          const o = this._scroll
          o &&
            (0, w.doAnimate)({
              onStep(e, t) {
                o.scrollTop = t
              },
              from: o.scrollTop,
              to: Math.round(e),
              easing: _.easingFunc.easeInOutCubic,
              duration: t,
            })
        }
        render() {
          const {
              children: e,
              isVisibleScrollbar: t,
              isVisibleFade: o,
              isVisibleButtons: i,
              onMouseOver: l,
              onMouseOut: s,
            } = this.props,
            {
              heightContent: r,
              heightWrap: c,
              isVisibleBotButton: u,
              isVisibleTopButton: d,
            } = this.state
          return n.createElement(
            x.Measure,
            { onResize: this._handleResizeWrap },
            (h) =>
              n.createElement(
                'div',
                { className: E.wrap, onMouseOver: l, onMouseOut: s, ref: h },
                n.createElement(
                  'div',
                  {
                    className: a()(E.scrollWrap, { [E.noScrollBar]: !t }),
                    onScroll: this._handleScroll,
                    ref: (e) => (this._scroll = e),
                  },
                  n.createElement(
                    x.Measure,
                    { onResize: this._handleResizeContent },
                    (t) =>
                      n.createElement(
                        'div',
                        { className: E.content, ref: t },
                        e,
                      ),
                  ),
                ),
                o &&
                  n.createElement('div', {
                    className: a()(E.fadeTop, { [E.isVisible]: d && r > c }),
                  }),
                o &&
                  n.createElement('div', {
                    className: a()(E.fadeBot, { [E.isVisible]: u && r > c }),
                  }),
                i &&
                  n.createElement(
                    'div',
                    {
                      className: a()(E.scrollTop, {
                        [E.isVisible]: d && r > c,
                      }),
                      onClick: this._handleScrollTop,
                    },
                    n.createElement(
                      'div',
                      { className: E.iconWrap },
                      n.createElement(C.Icon, { icon: F, className: E.icon }),
                    ),
                  ),
                i &&
                  n.createElement(
                    'div',
                    {
                      className: a()(E.scrollBot, {
                        [E.isVisible]: u && r > c,
                      }),
                      onClick: this._handleScrollBot,
                    },
                    n.createElement(
                      'div',
                      { className: E.iconWrap },
                      n.createElement(C.Icon, { icon: F, className: E.icon }),
                    ),
                  ),
              ),
          )
        }
      }
      k.defaultProps = { isVisibleScrollbar: !0 }
      var S = o(26709),
        y = o(59064),
        L = o(29835),
        A = o(50238)
      function M(e) {
        const [t, o] = (0, A.useRovingTabindexElement)(null)
        return n.createElement(L.ToolButton, {
          ...e,
          ref: t,
          tag: 'button',
          tabIndex: o,
        })
      }
      function I(e) {
        const {
          id: t,
          action: o,
          isActive: i,
          isHidden: l,
          isTransparent: s,
          toolName: a,
        } = e
        return n.createElement(M, {
          id: t,
          icon: g.lineToolsInfo[a].icon,
          isActive: i,
          isHidden: l,
          isTransparent: s,
          onClick: o,
          tooltip: g.lineToolsInfo[a].localizedName,
          'data-name': a,
        })
      }
      var W,
        B = o(11542),
        D = o(90186),
        N = o(29185),
        R = o(64147)
      !((e) => {
        ;(e.Icons = 'icons'), (e.Emojis = 'emojis'), (e.Stickers = 'stickers')
      })(W || (W = {}))
      const V = c.getValue('ToolButtonIcons.LastCategory', W.Emojis),
        H = new R.WatchedValue(V)
      function z() {
        const [e, t] = (0, N.useWatchedValue)(H)
        return [
          e,
          (0, n.useCallback)(
            (e) => {
              t(e),
                ((e) => {
                  c.setValue('ToolButtonIcons.LastCategory', e)
                })(e)
            },
            [t],
          ),
        ]
      }
      var P = o(99616),
        O = o(59453)
      function j(e) {
        return n.createElement('div', { className: O.wrapper }, e.text)
      }
      var U = o(84243),
        Z = o(51609),
        G = o(22976),
        K = o(70616),
        q = o(18042),
        J = o(44986),
        Q = o(83778),
        Y = o(48748)
      const $ = [
          '0xF087',
          '0xF088',
          '0xF164',
          '0xF165',
          '0xF0A4',
          '0xF0A5',
          '0xF007',
          '0xF0A6',
          '0xF0A7',
          '0xF118',
          '0xF11A',
          '0xF119',
          '0xF183',
        ],
        X = [
          '0xF153',
          '0xF154',
          '0xF155',
          '0xF156',
          '0xF157',
          '0xF158',
          '0xF159',
          '0xF195',
          '0xF15A',
        ],
        ee = [
          '0xF060',
          '0xF061',
          '0xF062',
          '0xF063',
          '0xF053',
          '0xF054',
          '0xF077',
          '0xF078',
          '0xF07D',
          '0xF07E',
          '0xF0A9',
          '0xF0AA',
          '0xF0AB',
          '0xF0D9',
          '0xF0DA',
          '0xF0D7',
          '0xF0D8',
          '0xF102',
          '0xF103',
          '0xF104',
          '0xF105',
          '0xF106',
          '0xF107',
          '0xF137',
          '0xF139',
          '0xF13A',
          '0xF112',
          '0xF064',
          '0xF148',
          '0xF149',
          '0xF177',
          '0xF178',
          '0xF175',
          '0xF176',
          '0xF01A',
          '0xF01B',
          '0xF065',
          '0xF066',
        ],
        te = [
          '0xF11D',
          '0xF11E',
          '0xF024',
          '0xF004',
          '0xF005',
          '0xF006',
          '0xF046',
          '0xF00C',
          '0xF00D',
          '0xF011',
          '0xF012',
          '0xF021',
          '0xF01E',
          '0xF192',
          '0xF041',
          '0xF14A',
          '0xF055',
          '0xF056',
          '0xF057',
          '0xF059',
          '0xF058',
          '0xF05A',
          '0xF05B',
          '0xF05C',
          '0xF05D',
          '0xF05E',
          '0xF067',
          '0xF068',
          '0xF069',
          '0xF06A',
          '0xF071',
          '0xF06E',
          '0xF070',
          '0xF075',
          '0xF08A',
          '0xF0A3',
          '0xF0E5',
          '0xF110',
          '0xF111',
          '0xF123',
          '0xF124',
          '0xF10C',
          '0xF128',
          '0xF129',
          '0xF12A',
          '0xF140',
          '0xF113',
          '0xF17C',
          '0xF179',
        ],
        oe = ['0xF06C', '0xF185', '0xF186', '0xF188', '0xF0E7'],
        ne = [
          '0xF000',
          '0xF002',
          '0xF00E',
          '0xF015',
          '0xF017',
          '0xF030',
          '0xF013',
          '0xF043',
          '0xF06B',
          '0xF072',
          '0xF076',
          '0xF080',
          '0xF084',
          '0xF040',
          '0xF0A1',
          '0xF0A2',
          '0xF0D6',
          '0xF0E3',
          '0xF0EB',
          '0xF0F3',
          '0xF135',
          '0xF13D',
          '0xF2FE',
        ],
        ie = [...$, ...X, ...ee, ...te, ...oe, ...ne].map((e) => +e),
        le = new Set(ie)
      const se = [
          {
            title: B.t(null, { context: 'emoji_group' }, o(88906)),
            emojis: [],
            content: n.createElement(P.IconItem, { icon: J }),
          },
          {
            title: B.t(null, { context: 'emoji_group' }, o(51853)),
            emojis: $,
            content: n.createElement(P.IconItem, { icon: Q }),
          },
          {
            title: B.t(null, { context: 'emoji_group' }, o(33282)),
            emojis: te,
            content: n.createElement(P.IconItem, { icon: K }),
          },
          {
            title: B.t(null, { context: 'emoji_group' }, o(10522)),
            emojis: oe,
            content: n.createElement(P.IconItem, { icon: Y }),
          },
          {
            title: B.t(null, { context: 'emoji_group' }, o(14143)),
            emojis: X,
            content: n.createElement(P.IconItem, { icon: G }),
          },
          {
            title: B.t(null, { context: 'emoji_group' }, o(98355)),
            emojis: ne,
            content: n.createElement(P.IconItem, { icon: q }),
          },
          {
            title: B.t(null, { context: 'emoji_group' }, o(74245)),
            emojis: ee,
            content: n.createElement(P.IconItem, { icon: Z }),
          },
        ],
        ae = {
          [W.Icons]: U.drawingToolsIcons.heart,
          [W.Emojis]: U.drawingToolsIcons.smile,
          [W.Stickers]: U.drawingToolsIcons.sticker,
        },
        re = [
          {
            title: W.Emojis,
            content: n.createElement(j, { text: B.t(null, void 0, o(16290)) }),
          },
          {
            title: W.Stickers,
            content: n.createElement(j, { text: B.t(null, void 0, o(50428)) }),
          },
          {
            title: W.Icons,
            content: n.createElement(j, { text: B.t(null, void 0, o(73829)) }),
          },
        ]
      var ce = o(3343),
        ue = o(20520),
        de = o(27317),
        he = o(76460),
        me = o(41590),
        ve = o(40173),
        pe = o(20243),
        ge = o(14665)
      const be = o(77020),
        fe = (0, n.forwardRef)((e, t) => {
          const {
              buttonActiveClass: o,
              buttonClass: i,
              buttonIcon: l,
              buttonTitle: a,
              buttonHotKey: c,
              dropdownTooltip: u,
              children: d,
              isActive: h,
              isGrayed: m,
              onClickWhenGrayed: v,
              checkable: p,
              isSmallTablet: g,
              theme: b = be,
              onClickButton: f,
              onArrowClick: T,
              openDropdownByClick: w,
              onMenuFocus: _ = pe.handleAccessibleMenuFocus,
              onMenuKeyDown: x = pe.handleAccessibleMenuKeyDown,
              ...E
            } = e,
            F = (0, ve.mergeThemes)(de.DEFAULT_MENU_THEME, {
              menuBox: b.menuBox,
            }),
            [k, S] = (0, n.useState)(!1),
            [y, M] = (0, n.useState)(!1),
            I = (0, n.useRef)(null),
            W = (0, n.useRef)(null),
            B = (0, n.useRef)(null),
            D = (0, n.useRef)(0),
            N = (0, n.useRef)(0),
            [R, V] = (0, A.useRovingTabindexElement)(null),
            [H, z] = (0, A.useRovingTabindexElement)(null)
          return (
            (0, n.useImperativeHandle)(t, () => ({ open: () => S(!0) }), []),
            n.createElement(
              'div',
              {
                ...E,
                className: s(b.dropdown, {
                  [b.isGrayed]: m,
                  [b.isActive]: h,
                  [b.isOpened]: k,
                }),
                onClick: m ? v : void 0,
                onKeyDown: (e) => {
                  if (e.defaultPrevented || !(e.target instanceof Node)) return
                  const t = (0, ce.hashFromEvent)(e)
                  if (e.currentTarget.contains(e.target) || 27 !== t) return
                  e.preventDefault(), P(!1), y && H?.current?.focus()
                },
                ref: I,
              },
              n.createElement(
                'div',
                { ref: W, className: b.control },
                n.createElement(
                  'div',
                  {
                    ...(() => {
                      if (!m)
                        return r.mobiletouch
                          ? p
                            ? { onTouchStart: U, onTouchEnd: G, onTouchMove: Z }
                            : { onClick: j }
                          : { onMouseDown: U, onMouseUp: K }
                      return {}
                    })(),
                    className: s(b.buttonWrap, b.accessible),
                  },
                  n.createElement(L.ToolButton, {
                    activeClass: o,
                    className: s(i, b.button),
                    icon: l,
                    isActive: h,
                    isGrayed: m,
                    isTransparent: !p,
                    ref: R,
                    tag: 'button',
                    tabIndex: V,
                    onClick: (e) => {
                      if (!(0, he.isKeyboardClick)(e)) return
                      w ? P(!0, !0) : f?.()
                    },
                    tooltip: a,
                    buttonHotKey: c,
                    'data-tooltip-delay': 1500,
                    tooltipPosition: 'vertical',
                  }),
                ),
                !m &&
                  !r.mobiletouch &&
                  n.createElement(
                    'button',
                    {
                      className: s(
                        b.arrow,
                        u && 'apply-common-tooltip common-tooltip-vertical',
                        b.accessible,
                      ),
                      onClick: (e) => {
                        T?.(), P(void 0, (0, he.isKeyboardClick)(e))
                      },
                      onKeyDown: (e) => {
                        if (e.defaultPrevented || !(e.target instanceof Node))
                          return
                        const t = (0, ce.hashFromEvent)(e)
                        if (e.currentTarget.contains(e.target))
                          switch (t) {
                            case 39:
                              if (k) return
                              e.preventDefault(), P(!0, !0)
                              break
                            case 27:
                              if (!k) return
                              e.preventDefault(), P(!1)
                          }
                      },
                      type: 'button',
                      ref: H,
                      tabIndex: z,
                      'aria-pressed': h,
                      'aria-label': u,
                      'data-tooltip': u,
                    },
                    n.createElement(C.Icon, {
                      className: b.arrowIcon,
                      icon: ge,
                    }),
                  ),
              ),
              !m &&
                (g
                  ? k &&
                    n.createElement(
                      me.Drawer,
                      { className: b.drawer, onClose: O, position: 'Bottom' },
                      d,
                    )
                  : n.createElement(
                      ue.PopupMenu,
                      {
                        theme: F,
                        doNotCloseOn: () => {
                          if (null === I.current) return []
                          return [I.current]
                        },
                        isOpened: k,
                        onClose: O,
                        position: () => {
                          if (!W || !W.current) return { x: 0, y: 0 }
                          const e = W.current.getBoundingClientRect()
                          return { x: e.left + e.width + 1, y: e.top - 6 }
                        },
                        onKeyDown: x,
                        onFocus: (e) => _(e, H),
                        controller: B,
                        onOpen: () => {
                          B.current?.focus()
                        },
                        tabIndex: -1,
                      },
                      d,
                    )),
            )
          )
          function P(e, t = !1) {
            const o = void 0 !== e ? e : !k
            S(o), M(!!o && t)
          }
          function O() {
            P(!1)
          }
          function j() {
            f && f(), P()
          }
          function U() {
            if (r.mobiletouch && !p) !N.current && f && f()
            else {
              if (D.current)
                return clearTimeout(D.current), (D.current = 0), void P(!0)
              D.current = setTimeout(() => {
                ;(D.current = 0), !N.current && f && f()
              }, 175)
            }
            N.current = setTimeout(() => {
              ;(N.current = 0), P(!0)
            }, 300)
          }
          function Z() {
            clearTimeout(N.current),
              (N.current = 0),
              clearTimeout(D.current),
              (D.current = 0)
          }
          function G(e) {
            e.cancelable && e.preventDefault(), K()
          }
          function K() {
            N.current &&
              (clearTimeout(N.current),
              (N.current = 0),
              k
                ? P(!1)
                : p || k || r.mobiletouch || (!h && !w)
                  ? !D.current && f && f()
                  : P(!0))
          }
        })
      var Te = o(38297),
        Ce = o(85034),
        we = o(59063),
        _e = o(21097)
      class xe extends we.CommonJsonStoreService {
        constructor(e, t, o, n, i = 18) {
          super(_e.TVXWindowEvents, c, e, t, []),
            (this._onChangeDrawingState = () => {
              const e = d[this._drawingType].value()
              this._promote(e)
            }),
            (this._sanitizer = o),
            (this._drawingType = n),
            (this._maxRecentCount = i),
            d[this._drawingType].subscribe(this._onChangeDrawingState)
        }
        destroy() {
          d[this._drawingType].unsubscribe(this._onChangeDrawingState),
            super.destroy()
        }
        _deserialize(e) {
          const t = this._sanitizer(e)
          return this._removeUnavailableRecents(e, t)
        }
        _removeUnavailableRecents(e, t) {
          return (
            Array.isArray(e)
              ? e.length > this._maxRecentCount &&
                (t = e.slice(0, this._maxRecentCount))
              : (t = []),
            t
          )
        }
        _promote(e) {
          let t = [...this.get()]
          const o = t.indexOf(e)
          ;-1 !== o && t.splice(o, 1),
            (t = [e, ...t.slice(0, this._maxRecentCount - 1)]),
            this.set(t)
        }
      }
      const Ee = new xe(
        'RECENT_ICONS_CHANGED',
        'linetoolicon.recenticons',
        (e) => e.filter((e) => le.has(e)),
        'iconTool',
      )
      var Fe = o(29703)
      function ke(e) {
        const { fallback: t, ...o } = e
        return n.createElement(
          n.Suspense,
          { fallback: t ?? null },
          n.createElement(Se, { ...o }),
        )
      }
      const Se = n.lazy(async () => {
        const { getSvgContentForCharCode: e } = await o
          .e(7987)
          .then(o.bind(o, 25482))
        return {
          default: (t) => {
            const { charCode: o } = t,
              i = e(o) ?? void 0
            return n.createElement(C.Icon, {
              icon: i,
              className: Fe.iconContainer,
            })
          },
        }
      })
      var ye = o(74099)
      var Le = o(173)
      const Ae = new xe(
        'RECENT_EMOJIS_CHANGED',
        'linetoolemoji.recents',
        Le.removeUnavailableEmoji,
        'emojiTool',
      )
      var Me
      !((e) => {
        ;(e.Elon = 'elon'),
          (e.Doge = 'doge'),
          (e.Dislike = 'dislike'),
          (e.Yolo = 'yolo'),
          (e.Whale = 'whale'),
          (e.Wagmi = 'wagmi'),
          (e.Tendies = 'tendies'),
          (e.Short = 'short'),
          (e.Rugged = 'rugged'),
          (e.Shill = 'shill'),
          (e.Rekt = 'rekt'),
          (e.Sell = 'sell'),
          (e.PaperHands = 'paper-hands'),
          (e.Og = 'og'),
          (e.Fud = 'fud'),
          (e.Gm = 'gm'),
          (e.Ngmi = 'ngmi'),
          (e.Moon = 'moon'),
          (e.Love = 'love'),
          (e.Lambo = 'lambo'),
          (e.Ethereum = 'ethereum'),
          (e.Look = 'look'),
          (e.DiamondHand = 'diamond-hand'),
          (e.Leap = 'leap'),
          (e.Like = 'like'),
          (e.Few = 'few'),
          (e.Bitcoin = 'bitcoin'),
          (e.BagHolder = 'bag-holder'),
          (e.BuyTheDip = 'buy-the-dip'),
          (e.Buy = 'buy'),
          (e.Hodl = 'hodl')
      })(Me || (Me = {}))
      const Ie = [
        'elon',
        'doge',
        'dislike',
        'yolo',
        'whale',
        'wagmi',
        'tendies',
        'short',
        'rugged',
        'shill',
        'rekt',
        'sell',
        'paper-hands',
        'og',
        'fud',
        'gm',
        'ngmi',
        'moon',
        'love',
        'lambo',
        'ethereum',
        'look',
        'diamond-hand',
        'leap',
        'like',
        'few',
        'bitcoin',
        'bag-holder',
        'buy-the-dip',
        'buy',
        'hodl',
      ]
      var We = o(37603),
        Be = o(90624)
      const De = new Set(Ie)
      const Ne = [
          {
            title: B.t(null, { context: 'emoji_group' }, o(88906)),
            emojis: [],
            content: n.createElement(P.IconItem, { icon: We }),
          },
          {
            title: 'TradingView',
            emojis: Ie,
            content: n.createElement(P.IconItem, { icon: Be }),
          },
        ],
        Re = new xe(
          'RECENT_STICKERS_CHANGED',
          'linetoolsticker.recents',
          (e) => e.filter((e) => De.has(e)),
          'stickerTool',
          3,
        )
      var Ve = o(78036),
        He = o(47291),
        ze = o(33892)
      var Pe,
        Oe = o(26601),
        je = o(65171)
      !((e) => {
        ;(e.Icon = 'LineToolIcon'),
          (e.Emoji = 'LineToolEmoji'),
          (e.Sticker = 'LineToolSticker')
      })(Pe || (Pe = {}))
      const Ue = {
        [W.Icons]: {
          service: Ee,
          toolName: 'LineToolIcon',
          ItemComponent: (e) => {
            const { emoji: t, className: o } = e
            return n.createElement(
              'div',
              { className: a()(ye.item, o) },
              n.createElement(ke, { charCode: Number(t) }),
            )
          },
          icons: se,
          onEmojiSelect: (e) => {
            d.iconTool.setValue(Number(e)), d.tool.setValue('LineToolIcon')
          },
        },
        [W.Emojis]: {
          service: Ae,
          toolName: 'LineToolEmoji',
          icons: (0, Le.emojiGroups)(),
          onEmojiSelect: (e) => {
            d.emojiTool.setValue(e), d.tool.setValue('LineToolEmoji')
          },
        },
        [W.Stickers]: {
          service: Re,
          toolName: 'LineToolSticker',
          ItemComponent: (e) => {
            const { emoji: t } = e,
              { size: i } = (0, Ve.useEnsuredContext)(
                He.EmojiListContentContext,
              ),
              [l, s] = (0, n.useState)()
            return (
              (0, n.useEffect)(() => {
                o.e(5598)
                  .then(o.bind(o, 47992))
                  .then(({ getSvgContentForSticker: e }) => {
                    const o = e(t)
                    o && s(o)
                  })
              }, []),
              n.createElement(C.Icon, {
                className: ze.sticker,
                icon: null !== l ? l : void 0,
                style: { width: `${i}px`, height: `${i}px` },
              })
            )
          },
          RowComponent: (e) =>
            n.createElement(Oe.EmojisRow, { ...e, className: je.stickerRow }),
          icons: Ne,
          onEmojiSelect: (e) => {
            d.stickerTool.setValue(e), d.tool.setValue('LineToolSticker')
          },
          getEmojiSize: (e) => (e ? 78 : 112),
        },
      }
      var Ze = o(89265)
      function Ge(e) {
        const {
            isSmallTablet: t,
            maxHeight: o,
            activeTab: i,
            setActiveTab: l,
          } = e,
          a = Ue[i],
          {
            service: r,
            ItemComponent: c,
            RowComponent: u,
            onEmojiSelect: d,
            getEmojiSize: h,
          } = a,
          m = h && h(t),
          [v, p] = (0, n.useState)(Ke(a))
        return (
          (0, n.useLayoutEffect)(() => {
            const e = {},
              t = () => {
                const e = Ke(a)
                p(e)
              }
            return (
              t(),
              r.getOnChange().subscribe(e, t),
              () => {
                r.getOnChange().unsubscribeAll(e)
              }
            )
          }, [a]),
          n.createElement(
            'div',
            { style: { maxHeight: o } },
            n.createElement(Te.EmojiList, {
              className: s(Ze.desktopSize, t && Ze.smallSize),
              emojis: v,
              onSelect: (e) => {
                d(e), (0, y.globalCloseMenu)()
              },
              ItemComponent: c,
              RowComponent: u,
              height: o,
              category: i,
              emojiSize: m,
            }),
            n.createElement(Ce.GroupTabs, {
              className: Ze.tabs,
              tabClassName: Ze.categories,
              tabs: re,
              activeTab: i,
              onTabClick: (e) => {
                l(e)
              },
            }),
          )
        )
      }
      function Ke(e) {
        const { icons: t, service: o } = e,
          n = [...t],
          i = o.get()
        return (
          (n[0].emojis = i.map((e) => String(e))),
          n.filter((e) => e.emojis.length)
        )
      }
      var qe = o(19291),
        Je = o(68335),
        Qe = o(3845),
        Ye = o(33430)
      const $e = {
          icon: B.t(null, void 0, o(37913)),
          dropdownTooltip: B.t(null, void 0, o(73829)),
        },
        Xe = (0, ve.mergeThemes)(be, {
          menuBox: Ye.menuBox,
          drawer: Ye.drawer,
        }),
        et = Number.parseInt(Qe['default-drawer-min-top-distance'])
      function tt(e) {
        const { isGrayed: t, isSmallTablet: o } = e,
          i = (0, D.filterDataProps)(e),
          [l, s] = z(),
          [a] = (0, N.useWatchedValue)(d.tool),
          { toolName: r } = Ue[l]
        return n.createElement(
          fe,
          {
            theme: Xe,
            buttonIcon: ae[l],
            buttonTitle: $e.icon,
            dropdownTooltip: $e.dropdownTooltip,
            isActive: a === r,
            isGrayed: t,
            isSmallTablet: o,
            onClickButton: () => {
              c()
            },
            onClickWhenGrayed: () =>
              (0, h.emit)('onGrayedObjectClicked', {
                type: 'drawing',
                name: g.lineToolsInfo[r].localizedName,
              }),
            onArrowClick: () => {
              c('menu')
            },
            openDropdownByClick: !0,
            onMenuFocus: ot,
            onMenuKeyDown: (e) => {
              if (e.defaultPrevented) return
              const t = (0, Je.hashFromEvent)(e)
              ;(9 !== t && t !== Je.Modifiers.Shift + 9) ||
                (0, qe.updateTabIndexes)()
            },
            ...i,
          },
          n.createElement(Ge, {
            isSmallTablet: o,
            maxHeight: o ? Math.min(679, window.innerHeight - et) : 679,
            activeTab: l,
            setActiveTab: s,
          }),
        )
        function c(e) {
          0
        }
      }
      function ot(e) {
        if (!e.target) return
        const t = e.currentTarget
        e.target === t &&
          ((0, qe.updateTabIndexes)(),
          setTimeout(() => {
            if (document.activeElement !== t) return
            const [e] = (0, qe.queryTabbableElements)(t).sort(
              qe.navigationOrderComparator,
            )
            e && e.focus()
          }))
      }
      var nt = o(32679)
      class it extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._handleClick = () => {
              this.props.saveDefaultOnChange && (0, nt.allowSavingDefaults)(!0)
              const e = !this.props.property.value()
              this.props.property.setValue(e),
                this.props.saveDefaultOnChange &&
                  (0, nt.allowSavingDefaults)(!1),
                this.props.onClick && this.props.onClick(e)
            }),
            (this.state = {
              isActive: this.props.property.value(),
            })
        }
        componentDidMount() {
          this.props.property.subscribe(this, this._onChange)
        }
        componentWillUnmount() {
          this.props.property.unsubscribe(this, this._onChange)
        }
        render() {
          const { toolName: e } = this.props,
            { isActive: t } = this.state,
            o = g.lineToolsInfo[e]
          return n.createElement(M, {
            icon: t && o.iconActive ? o.iconActive : o.icon,
            isActive: t,
            onClick: this._handleClick,
            tooltip: o.localizedName,
            buttonHotKey: o.hotKey,
            'data-name': e,
          })
        }
        _onChange(e) {
          this.setState({ isActive: e.value() })
        }
      }
      class lt extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._handleClick = () => {
              d.tool.setValue(this.props.toolName), this.props.onClick?.()
            }),
            (this._onChange = () => {
              this.setState({
                isActive: d.tool.value() === this.props.toolName,
              })
            }),
            (this.state = { isActive: d.tool.value() === this.props.toolName })
        }
        componentDidMount() {
          d.tool.subscribe(this._onChange)
        }
        componentWillUnmount() {
          d.tool.unsubscribe(this._onChange)
        }
        render() {
          const { toolName: e } = this.props,
            { isActive: t } = this.state,
            o = g.lineToolsInfo[e]
          return n.createElement(M, {
            icon: g.lineToolsInfo[e].icon,
            isActive: t,
            isTransparent: !0,
            onClick: this._handleClick,
            tooltip: o.localizedName,
            buttonHotKey: o.hotKey,
            'data-name': e,
          })
        }
      }
      class st extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._boundUndoModel = null),
            (this._handleClick = () => {
              const e = this._activeChartWidget()
              e.hasModel() && e.model().zoomFromViewport()
            }),
            (this._syncUnzoomButton = () => {
              const e = this._activeChartWidget()
              let t = !1
              if (e.hasModel()) {
                const o = e.model()
                this._boundUndoModel !== o &&
                  (this._boundUndoModel &&
                    this._boundUndoModel
                      .zoomStack()
                      .onChange()
                      .unsubscribe(null, this._syncUnzoomButton),
                  o
                    .zoomStack()
                    .onChange()
                    .subscribe(null, this._syncUnzoomButton),
                  (this._boundUndoModel = o)),
                  (t = !o.zoomStack().isEmpty())
              } else e.withModel(null, this._syncUnzoomButton)
              this.setState({ isVisible: t })
            }),
            (this.state = { isVisible: !1 })
        }
        componentDidMount() {
          this.props.chartWidgetCollection.activeChartWidget.subscribe(
            this._syncUnzoomButton,
            { callWithLast: !0 },
          )
        }
        componentWillUnmount() {
          this.props.chartWidgetCollection.activeChartWidget.unsubscribe(
            this._syncUnzoomButton,
          )
        }
        render() {
          return this.state.isVisible
            ? n.createElement(I, {
                action: this._handleClick,
                isTransparent: !0,
                toolName: 'zoom-out',
              })
            : n.createElement('div', null)
        }
        _activeChartWidget() {
          return this.props.chartWidgetCollection.activeChartWidget.value()
        }
      }
      var at = o(11684),
        rt = o(26744),
        ct = o(16829),
        ut = o(40894),
        dt = o(10838),
        ht = o(81332),
        mt = o(32755),
        vt = o(73824)
      function pt(e) {
        return 'name' in e
      }
      new Set(['LineToolTable'])
      class gt extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._onChangeDrawingState = () => {
              const e = this._getActiveToolName()
              this.setState({ current: e || this.state.current, isActive: !!e })
            }),
            (this._handleClickButton = () => {
              this._trackClick()
              const { current: e } = this.state
              !v.CheckMobile.any() && e && this._selectTool(e)
            }),
            (this._handleClickItem = (e) => {
              this._selectTool(e)
            }),
            (this._handleGrayedClick = (e) => {
              ;(0, h.emit)('onGrayedObjectClicked', {
                type: 'drawing',
                name: g.lineToolsInfo[e].localizedName,
              })
            }),
            (this._handleClickFavorite = (e) => {
              this.state.favState && this.state.favState[e]
                ? rt.LinetoolsFavoritesStore.removeFavorite(e)
                : rt.LinetoolsFavoritesStore.addFavorite(e)
            }),
            (this._onAddFavorite = (e) => {
              this.setState({ favState: { ...this.state.favState, [e]: !0 } })
            }),
            (this._onRemoveFavorite = (e) => {
              this.setState({ favState: { ...this.state.favState, [e]: !1 } })
            }),
            (this._onSyncFavorites = () => {
              this.setState({ favState: this._composeFavState() })
            }),
            (this._handleArrowClick = () => {
              this._trackClick('menu')
            }),
            (this._trackClick = (e) => {
              const { trackLabel: t } = this.props
            })
          const t = this._getActiveToolName()
          this.state = {
            current: t || this._firstNonGrayedTool(),
            favState: this._composeFavState(),
            isActive: !!t,
          }
        }
        componentDidMount() {
          d.tool.subscribe(this._onChangeDrawingState),
            rt.LinetoolsFavoritesStore.favoriteAdded.subscribe(
              null,
              this._onAddFavorite,
            ),
            rt.LinetoolsFavoritesStore.favoriteRemoved.subscribe(
              null,
              this._onRemoveFavorite,
            ),
            rt.LinetoolsFavoritesStore.favoritesSynced.subscribe(
              null,
              this._onSyncFavorites,
            )
        }
        componentWillUnmount() {
          d.tool.unsubscribe(this._onChangeDrawingState),
            rt.LinetoolsFavoritesStore.favoriteAdded.unsubscribe(
              null,
              this._onAddFavorite,
            ),
            rt.LinetoolsFavoritesStore.favoriteRemoved.unsubscribe(
              null,
              this._onRemoveFavorite,
            ),
            rt.LinetoolsFavoritesStore.favoritesSynced.unsubscribe(
              null,
              this._onSyncFavorites,
            )
        }
        componentDidUpdate(e, t) {
          e.lineTools !== this.props.lineTools &&
            this.setState({ favState: this._composeFavState() })
        }
        render() {
          const { current: e, favState: t, isActive: o } = this.state
          if (!e) return n.createElement(n.Fragment, null)
          const {
              favoriting: i,
              grayedTools: l,
              lineTools: s,
              dropdownTooltip: a,
              isSmallTablet: r,
            } = this.props,
            c = this._showShortcuts(),
            u = g.lineToolsInfo[e],
            d = (0, D.filterDataProps)(this.props)
          return n.createElement(
            'span',
            null,
            n.createElement(
              fe,
              {
                buttonIcon: u.icon,
                buttonTitle: u.localizedName,
                buttonHotKey: u.hotKey,
                dropdownTooltip: a,
                isActive: o,
                onClickButton: this._handleClickButton,
                onArrowClick: this._handleArrowClick,
                isSmallTablet: r,
                ...d,
              },
              s.map((s, a) => {
                if ('title' in s)
                  return n.createElement(
                    n.Fragment,
                    { key: s.title ?? `separator${a}` },
                    a > 0 ? n.createElement(at.PopupMenuSeparator, null) : null,
                    s.title &&
                      n.createElement(
                        ct.ToolWidgetMenuSummary,
                        { className: vt.sectionTitle },
                        s.title,
                      ),
                  )
                const { name: u } = s,
                  d = g.lineToolsInfo[u]?.selectHotkey?.hash,
                  h = g.lineToolsInfo[u],
                  m = l[u]
                return n.createElement(dt.AccessibleMenuItem, {
                  key: u,
                  'data-name': u,
                  theme: r ? ht.multilineLabelWithIconAndToolboxTheme : void 0,
                  dontClosePopup: m,
                  forceShowShortcuts: c,
                  shortcut: !r && d ? (0, Je.humanReadableHash)(d) : void 0,
                  icon: h.icon,
                  isActive: o && e === u,
                  appearAsDisabled: m,
                  label: n.createElement(
                    'div',
                    { className: vt.label },
                    h.localizedName,
                    !1,
                  ),
                  showToolboxOnFocus: !0,
                  onClick: m ? this._handleGrayedClick : this._handleClickItem,
                  onClickArg: u,
                  showToolboxOnHover: !t[u],
                  toolbox:
                    i && !m
                      ? n.createElement(ut.MenuFavoriteButton, {
                          isActive: o && e === u,
                          isFilled: t[u],
                          onClick: () => this._handleClickFavorite(u),
                        })
                      : void 0,
                })
              }),
            ),
          )
        }
        _firstNonGrayedTool() {
          const { grayedTools: e, lineTools: t } = this.props
          return t.find((t) => pt(t) && !e[t.name])?.name
        }
        _showShortcuts() {
          return this.props.lineTools.some((e) => 'hotkeyHash' in e)
        }
        _getActiveToolName() {
          return this.props.lineTools.find(
            (e) => pt(e) && e.name === d.tool.value(),
          )?.name
        }
        async _selectTool(e) {
          await (0, mt.initLineTool)(e), d.tool.setValue(e)
        }
        _composeFavState() {
          const e = {}
          return (
            this.props.lineTools.forEach((t) => {
              pt(t) &&
                (e[t.name] = rt.LinetoolsFavoritesStore.isFavorite(t.name))
            }),
            e
          )
        }
      }
      var bt = o(51768),
        ft = o(16396),
        Tt = o(11766)
      const Ct = (0, ve.mergeThemes)(ft.DEFAULT_POPUP_MENU_ITEM_THEME, Tt),
        wt = !1
      class _t extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._handleRemoveToolClick = () => {
              r.mobiletouch || this._handleRemoveDrawings(), Et()
            }),
            (this._handleRemoveDrawings = () => {
              xt('remove drawing'),
                this.props.chartWidgetCollection.activeChartWidget
                  .value()
                  .actions()
                  .paneRemoveAllDrawingTools.execute()
            }),
            (this._handleRemoveStudies = () => {
              xt('remove indicator'),
                this.props.chartWidgetCollection.activeChartWidget
                  .value()
                  .actions()
                  .paneRemoveAllStudies.execute()
            }),
            (this._handleRemoveAll = () => {
              xt('remove all'),
                this.props.chartWidgetCollection.activeChartWidget
                  .value()
                  .actions()
                  .paneRemoveAllStudiesDrawingTools.execute()
            }),
            (this._handleActiveChartWidgetChanged = (e) => {
              this._activeChartWidget &&
                this._unsubscribeToModelChanges(this._activeChartWidget),
                e && this._subscribeToModelChanges(e),
                (this._activeChartWidget = e),
                this._handleCollectionChanged()
            }),
            (this._handleCollectionChanged = () => {
              this.setState(this._getActualState())
            }),
            (this._getActualState = () => {
              if (
                !this._activeChartWidget ||
                !this._activeChartWidget.hasModel()
              )
                return {
                  removeAllDrawingsLabel: B.t(null, void 0, o(96374)),
                  removeAllStudiesLabel: B.t(null, void 0, o(99984)),
                  removeAllLabel: B.t(null, void 0, o(53981)),
                }
              const e = this._activeChartWidget.actions()
              return {
                removeAllDrawingsLabel:
                  e.paneRemoveAllDrawingTools.getState().label,
                removeAllStudiesLabel: e.paneRemoveAllStudies.getState().label,
                removeAllLabel:
                  e.paneRemoveAllStudiesDrawingTools.getState().label,
              }
            }),
            (this._activeChartWidget =
              this.props.chartWidgetCollection.activeChartWidget.value()),
            (this.state = this._getActualState())
        }
        componentDidMount() {
          this.props.chartWidgetCollection.activeChartWidget.subscribe(
            this._handleActiveChartWidgetChanged,
            { callWithLast: !0 },
          )
        }
        componentWillUnmount() {
          this._activeChartWidget &&
            this._unsubscribeToModelChanges(this._activeChartWidget),
            this.props.chartWidgetCollection.activeChartWidget.unsubscribe(
              this._handleActiveChartWidgetChanged,
            )
        }
        render() {
          const e = this.props.isSmallTablet ? Ct : void 0,
            {
              removeAllDrawingsLabel: t,
              removeAllStudiesLabel: i,
              removeAllLabel: l,
            } = this.state
          return n.createElement(
            fe,
            {
              buttonIcon: g.lineToolsInfo[this.props.toolName].icon,
              buttonTitle: t,
              onClickButton: this._handleRemoveToolClick,
              dropdownTooltip: B.t(null, void 0, o(2671)),
              isSmallTablet: this.props.isSmallTablet,
              'data-name': this.props.toolName,
              onArrowClick: this._handleArrowClick,
              openDropdownByClick: wt,
            },
            n.createElement(dt.AccessibleMenuItem, {
              'data-name': 'remove-drawing-tools',
              label: t,
              onClick: this._handleRemoveDrawings,
              theme: e,
            }),
            n.createElement(dt.AccessibleMenuItem, {
              'data-name': 'remove-studies',
              label: i,
              onClick: this._handleRemoveStudies,
              theme: e,
            }),
            n.createElement(dt.AccessibleMenuItem, {
              'data-name': 'remove-all',
              label: l,
              onClick: this._handleRemoveAll,
              theme: e,
            }),
          )
        }
        _handleArrowClick() {
          Et('menu')
        }
        _subscribeToModelChanges(e) {
          e.withModel(this, () => {
            this._handleCollectionChanged(),
              e
                .model()
                .model()
                .dataSourceCollectionChanged()
                .subscribe(this, this._handleCollectionChanged)
          })
        }
        _unsubscribeToModelChanges(e) {
          e.hasModel() &&
            e
              .model()
              .model()
              .dataSourceCollectionChanged()
              .unsubscribe(this, this._handleCollectionChanged),
            e.modelCreated().unsubscribeAll(this)
        }
      }
      function xt(e) {
        ;(0, bt.trackEvent)('GUI', 'Chart Left Toolbar', e)
      }
      function Et(e) {
        0
      }
      var Ft = o(7029),
        kt = o(90995),
        St = o(14881)
      const yt = n.createContext({ hideMode: 'drawings', isActive: !1 })
      function Lt(e) {
        const {
            hideMode: t,
            option: { label: o, dataName: i, getBoxedValue: l },
            isSmallTablet: s,
            onClick: a,
          } = e,
          { hideMode: r, isActive: c } = (0, n.useContext)(yt),
          u = l?.()
        return 'all' === t || u
          ? n.createElement(dt.AccessibleMenuItem, {
              label: o,
              isActive: r === t && c,
              onClick: () => {
                a(t, (0, kt.toggleHideMode)(t))
              },
              'data-name': i,
              theme: s ? Ct : void 0,
            })
          : n.createElement(n.Fragment, null)
      }
      const At = {
        drawings: {
          active: U.drawingToolsIcons.hideAllDrawingToolsActive,
          inactive: U.drawingToolsIcons.hideAllDrawingTools,
        },
        indicators: {
          active: U.drawingToolsIcons.hideAllIndicatorsActive,
          inactive: U.drawingToolsIcons.hideAllIndicators,
        },
        positions: {
          active: U.drawingToolsIcons.hideAllPositionsToolsActive,
          inactive: U.drawingToolsIcons.hideAllPositionsTools,
        },
        all: {
          active: U.drawingToolsIcons.hideAllDrawingsActive,
          inactive: U.drawingToolsIcons.hideAllDrawings,
        },
      }
      function Mt(e) {
        const { isSmallTablet: t } = e,
          [{ isActive: i, hideMode: s }, a] = (0, n.useState)(() => ({
            isActive: !1,
            hideMode: (0, kt.getSavedHideMode)(),
          }))
        ;(0, n.useEffect)(
          () => (
            St.hideStateChange.subscribe(null, a),
            () => {
              St.hideStateChange.unsubscribe(null, a)
            }
          ),
          [],
        )
        const r = g.lineToolsInfo.hideAllDrawings,
          {
            trackLabel: c,
            tooltip: u,
            dataName: d,
          } = (0, l.ensureDefined)((0, kt.getHideOptions)().get(s)),
          h = At[s][i ? 'active' : 'inactive'],
          m = i ? u.active : u.inactive
        return n.createElement(
          fe,
          {
            buttonIcon: h,
            buttonTitle: m,
            buttonHotKey: r.hotKey,
            dropdownTooltip: Ft.t(null, void 0, o(95343)),
            onClickButton: () => {
              ;(0, kt.toggleHideMode)(s), It(c, !i), Wt(i ? 'on' : 'off')
            },
            isSmallTablet: t,
            isActive: i,
            checkable: !0,
            'data-name': 'hide-all',
            'data-type': d,
            onArrowClick: () => {
              Wt('menu')
            },
          },
          n.createElement(
            yt.Provider,
            { value: { isActive: i, hideMode: s } },
            Array.from((0, kt.getHideOptions)()).map(([e, o]) =>
              n.createElement(Lt, {
                key: e,
                hideMode: e,
                option: o,
                isSmallTablet: t,
                onClick: v,
              }),
            ),
          ),
        )
        function v(e, t) {
          It(
            (0, l.ensureDefined)((0, kt.getHideOptions)().get(e)).trackLabel,
            t,
          )
        }
      }
      function It(e, t) {
        ;(0, bt.trackEvent)(
          'GUI',
          'Chart Left Toolbar',
          `${e} ${t ? 'on' : 'off'}`,
        )
      }
      function Wt(e) {
        0
      }
      var Bt = o(9726),
        Dt = o(53573)
      const Nt = B.t(null, void 0, o(51465))
      class Rt extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._instance = null),
            (this._promise = null),
            (this._bindedForceUpdate = () => this.forceUpdate()),
            (this._handleClick = () => {
              null !== this._instance &&
                (this._instance.isVisible()
                  ? (this._instance.hideAndSaveSettingsValue(),
                    this._trackClick(!1))
                  : (this._instance.showAndSaveSettingsValue(),
                    this._trackClick(!0)))
            })
        }
        componentDidMount() {
          const e = (this._promise = (0, l.ensureNotNull)(
            (0, Bt.getFavoriteDrawingToolbarPromise)(),
          ))
          e.then((t) => {
            this._promise === e &&
              ((this._instance = t),
              this._instance.canBeShown().subscribe(this._bindedForceUpdate),
              this._instance.visibility().subscribe(this._bindedForceUpdate),
              this.forceUpdate())
          })
        }
        componentWillUnmount() {
          ;(this._promise = null),
            null !== this._instance &&
              (this._instance.canBeShown().unsubscribe(this._bindedForceUpdate),
              this._instance.visibility().unsubscribe(this._bindedForceUpdate),
              (this._instance = null))
        }
        render() {
          return null !== this._instance && this._instance.canBeShown().value()
            ? n.createElement(M, {
                id: this.props.id,
                icon: Dt,
                isActive: this._instance.isVisible(),
                onClick: this._handleClick,
                tooltip: Nt,
              })
            : null
        }
        _trackClick(e) {
          0
        }
      }
      var Vt = o(77975),
        Ht = o(92693),
        zt = o(81171),
        Pt = o(57503)
      const Ot = {
        [Ht.MagnetMode.WeakMagnet]: {
          id: Ht.MagnetMode.WeakMagnet,
          name: 'weakMagnet',
          icon: U.drawingToolsIcons.magnet,
          localizedName: B.t(null, void 0, o(3519)),
        },
        [Ht.MagnetMode.StrongMagnet]: {
          id: Ht.MagnetMode.StrongMagnet,
          name: 'strongMagnet',
          icon: U.drawingToolsIcons.strongMagnet,
          localizedName: B.t(null, void 0, o(94593)),
        },
      }
      function jt(e) {
        const { isSmallTablet: t } = e,
          i = (0, Vt.useWatchedValueReadonly)({
            watchedValue: (0, zt.magnetEnabled)(),
          }),
          l = (0, Vt.useWatchedValueReadonly)({
            watchedValue: (0, zt.magnetMode)(),
          })
        return n.createElement(
          'div',
          { className: Pt.toolButtonMagnet },
          n.createElement(
            fe,
            {
              'data-name': 'magnet-button',
              buttonIcon: Ot[l].icon,
              buttonTitle: g.lineToolsInfo.magnet.localizedName,
              dropdownTooltip: B.t(null, void 0, o(41964)),
              isActive: i,
              onClickButton: () => {
                const e = !i
                ;(0, bt.trackEvent)(
                  'GUI',
                  'Chart Left Toolbar',
                  'magnet mode ' + (e ? 'on' : 'off'),
                ),
                  !1
                ;(0, zt.setIsMagnetEnabled)(e)
              },
              buttonHotKey: g.lineToolsInfo.magnet.hotKey,
              checkable: !0,
              isSmallTablet: t,
              onArrowClick: () => {
                0
              },
            },
            Object.values(Ot).map(
              ({ id: e, name: o, localizedName: a, icon: r }) =>
                n.createElement(dt.AccessibleMenuItem, {
                  key: e,
                  className: t ? Pt.toolButtonMagnet__menuItem : void 0,
                  'data-name': o,
                  icon: r,
                  isActive: i && l === e,
                  label: a,
                  onClick: s,
                  onClickArg: e,
                }),
            ),
          ),
          !1,
        )
        function s(e) {
          void 0 !== e &&
            ((0, bt.trackEvent)(
              'GUI',
              'Magnet mode',
              e === Ht.MagnetMode.WeakMagnet ? 'Weak' : 'Strong',
            ),
            (0, zt.setMagnetMode)(e))
        }
      }
      var Ut
      !((e) => {
        ;(e.Screenshot = 'drawing-toolbar-screenshot'),
          (e.FavoriteDrawings = 'drawing-toolbar-favorite-drawings'),
          (e.ObjectTree = 'drawing-toolbar-object-tree')
      })(Ut || (Ut = {}))
      var Zt = o(70412),
        Gt = o(14729),
        Kt = o(27235),
        qt = o(29197),
        Jt = o(6190),
        Qt = o(3088)
      const Yt = Qt,
        $t = 'http://www.w3.org/2000/svg'
      function Xt(e) {
        const { direction: t, theme: o = Qt } = e
        return n.createElement(
          'svg',
          {
            xmlns: $t,
            width: '9',
            height: '27',
            viewBox: '0 0 9 27',
            className: s(o.container, 'right' === t ? o.mirror : null),
            onContextMenu: Gt.preventDefault,
          },
          n.createElement(
            'g',
            { fill: 'none', fillRule: 'evenodd' },
            n.createElement('path', {
              className: o.background,
              d: 'M4.5.5a4 4 0 0 1 4 4v18a4 4 0 1 1-8 0v-18a4 4 0 0 1 4-4z',
            }),
            n.createElement('path', {
              className: o.arrow,
              d: 'M5.5 10l-2 3.5 2 3.5',
            }),
          ),
        )
      }
      var eo = o(39416),
        to = o(7047),
        oo = o(55613)
      const no = (0, ve.mergeThemes)(Yt, oo),
        io = {
          hide: B.t(null, void 0, o(99838)),
          show: B.t(null, void 0, o(32579)),
        },
        lo = (0, n.forwardRef)((e, t) => {
          const { toolbarVisible: o, 'data-name': i } = e,
            l = (0, eo.useFunctionalRefObject)(t)
          return n.createElement(
            'button',
            {
              'data-tooltip-show-on-focus': 'true',
              ...to.MouseClickAutoBlurHandler.attributes(),
              ref: l,
              type: 'button',
              'aria-label': o ? io.hide : io.show,
              'data-tooltip': o ? io.hide : io.show,
              className: s(
                no.toggleButton,
                'apply-common-tooltip common-tooltip-vertical',
                !o && no.collapsed,
                no.accessible,
              ),
              onClick: () => {
                T.isDrawingToolbarVisible.setValue(
                  !T.isDrawingToolbarVisible.value(),
                )
              },
              'data-name': i,
              'data-value': o ? 'visible' : 'collapsed',
            },
            n.createElement(Xt, {
              direction: o ? 'left' : 'right',
              theme: o ? void 0 : no,
            }),
          )
        })
      var so = o(37558),
        ao = o(24437),
        ro = o(90692)
      const co = { chartWidgetCollection: o(19036).any.isRequired }
      var uo = o(77151),
        ho = o(63754)
      const mo = u.enabled('right_toolbar'),
        vo = u.enabled('keep_object_tree_widget_in_right_toolbar'),
        po = (0, v.onWidget)(),
        go = new m.Delegate(),
        bo = bt.trackEvent.bind(null, 'GUI', 'Chart Left Toolbar'),
        fo = (e, t) => bo(`${e} ${t ? 'on' : 'off'}`)
      class To extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._grayedTools = {}),
            (this._handleMeasureClick = () => {
              Co('measure')
            }),
            (this._handleZoomInClick = () => {
              Co('zoom in')
            }),
            (this._handleDrawingClick = (e) => {
              fo('drawing mode', e), Co('drawing mode', e ? 'on' : 'off')
            }),
            (this._handleLockClick = (e) => {
              fo('lock all drawing', e), Co('lock', e ? 'on' : 'off')
            }),
            (this._handleSyncClick = (e) => {
              fo('sync', e), Co('sync', e ? 'on' : 'off')
            }),
            (this._handleObjectsTreeClick = () => {
              this._activeChartWidget().showObjectsTreeDialog(),
                Co('object tree')
            }),
            (this._handleMouseOver = (e) => {
              ;(0, Zt.hoverMouseEventFilter)(e) &&
                this.setState({ isHovered: !0 })
            }),
            (this._handleMouseOut = (e) => {
              ;(0, Zt.hoverMouseEventFilter)(e) &&
                this.setState({ isHovered: !1 })
            }),
            (this._handleChangeVisibility = (e) => {
              this.setState({ isVisible: e })
            }),
            (this._handleEsc = () => {
              d.resetToCursor(!0)
            }),
            (this._handleWidgetbarSettled = (e) => {
              this.setState({
                isWidgetbarVisible: Boolean(
                  window.widgetbar?.visible().value(),
                ),
                widgetbarSettled: e,
              })
            }),
            (this._handleWidgetbarVisible = (e) => {
              this.setState({ isWidgetbarVisible: e })
            }),
            d.init(),
            (this._toolsFilter = new b(this.props.drawingsAccess)),
            (this._filteredLineTools = f.lineTools.reduce((e, t) => {
              const { id: o, title: n, trackLabel: i } = t,
                l = (e) =>
                  this._toolsFilter.isToolEnabled(
                    g.lineToolsInfo[e.name].localizedName,
                  ),
                s = []
              return (
                (0, f.isLineToolsGroupWithSections)(t)
                  ? t.sections.forEach((e) => {
                      const t = e.items.filter(l)
                      t.length && s.push({ title: e.title }, ...t)
                    })
                  : s.push(...t.items.filter(l)),
                s.length &&
                  e.push({ id: o, title: n, trackLabel: i, items: s }),
                e
              )
            }, [])),
            this._filteredLineTools.forEach((e) => {
              e.items.forEach((e) => {
                'name' in e &&
                  (this._grayedTools[e.name] = this._toolsFilter.isToolGrayed(
                    g.lineToolsInfo[e.name].localizedName,
                  ))
              })
            }),
            (this.state = {
              isHovered: !1,
              isVisible: T.isDrawingToolbarVisible.value(),
              isWidgetbarVisible: Boolean(window.widgetbar?.visible().value()),
              widgetbarSettled: void 0 !== window.widgetbar,
            }),
            (this._features = {
              favoriting:
                !this.props.readOnly && !po && u.enabled('items_favoriting'),
              multicharts: u.enabled('support_multicharts'),
              tools: !po || !0,
            }),
            (this._registry = {
              chartWidgetCollection: this.props.chartWidgetCollection,
            }),
            this._negotiateResizer()
        }
        componentDidMount() {
          T.isDrawingToolbarVisible.subscribe(this._handleChangeVisibility),
            y.globalCloseDelegate.subscribe(this, this._handleGlobalClose),
            (this._tool = d.tool.spawn()),
            this._tool.subscribe(this._updateHotkeys.bind(this)),
            this._initHotkeys(),
            this.props.widgetbarSettled &&
              (this.props.widgetbarSettled.subscribe(
                this,
                this._handleWidgetbarSettled,
              ),
              v.CheckMobile.any() &&
                window.widgetbar
                  ?.visible()
                  .subscribe(this._handleWidgetbarVisible))
        }
        componentWillUnmount() {
          window.widgetbar?.visible().unsubscribe(this._handleWidgetbarVisible),
            T.isDrawingToolbarVisible.unsubscribe(this._handleChangeVisibility),
            y.globalCloseDelegate.unsubscribe(this, this._handleGlobalClose),
            this._tool.destroy(),
            this._hotkeys.destroy()
        }
        componentDidUpdate(e, t) {
          const { isVisible: o, widgetbarSettled: n } = this.state
          o !== t.isVisible &&
            (h.emit('toggle_sidebar', !o),
            c.setValue('ChartDrawingToolbarWidget.visible', o),
            this._negotiateResizer()),
            t.widgetbarSettled !== n &&
              n &&
              v.CheckMobile.any() &&
              window.widgetbar
                ?.visible()
                .subscribe(this._handleWidgetbarVisible)
        }
        render() {
          const {
              bgColor: e,
              chartWidgetCollection: t,
              readOnly: o,
            } = this.props,
            { isHovered: i, isVisible: l } = this.state,
            a = { backgroundColor: e && `#${e}` }
          let c
          c = n.createElement(lo, {
            toolbarVisible: l,
            'data-name': 'toolbar-drawing-toggle-button',
          })
          const h = () =>
            !!this._features.tools &&
            !(!u.enabled('show_object_tree') || (vo && !mo))
          return n.createElement(
            uo.RegistryProvider,
            { validation: co, value: this._registry },
            n.createElement(
              qt.CloseDelegateContext.Provider,
              { value: go },
              n.createElement(
                so.DrawerManager,
                null,
                n.createElement(
                  ro.MatchMedia,
                  { rule: ao.DialogBreakpoints.TabletSmall },
                  (e) =>
                    n.createElement(
                      Jt.Toolbar,
                      {
                        id: 'drawing-toolbar',
                        className: s(ho.drawingToolbar, { [ho.isHidden]: !l }),
                        style: a,
                        onClick: this.props.onClick,
                        onContextMenu: Gt.preventDefaultForContextMenu,
                        orientation: 'vertical',
                      },
                      n.createElement(
                        k,
                        {
                          onScroll: this._handleGlobalClose,
                          isVisibleFade: r.mobiletouch,
                          isVisibleButtons: !r.mobiletouch && i,
                          isVisibleScrollbar: !1,
                          onMouseOver: this._handleMouseOver,
                          onMouseOut: this._handleMouseOut,
                        },
                        n.createElement(
                          'div',
                          { className: ho.inner },
                          !o &&
                            n.createElement(
                              'div',
                              { className: ho.group, style: a },
                              this._filteredLineTools.map((o) =>
                                n.createElement(gt, {
                                  key: o.id,
                                  'data-name': o.id,
                                  chartWidgetCollection: t,
                                  favoriting:
                                    this._features.favoriting &&
                                    !(
                                      'linetool-group-cursors' === o.id &&
                                      (0, p.isOnMobileAppPage)('any')
                                    ),
                                  grayedTools: this._grayedTools,
                                  dropdownTooltip: o.title,
                                  lineTools: o.items,
                                  isSmallTablet: e,
                                  trackLabel: o.trackLabel,
                                }),
                              ),
                              this._toolsFilter.isToolEnabled('Font Icons') &&
                                n.createElement(tt, {
                                  'data-name': 'linetool-group-font-icons',
                                  isGrayed: this._grayedTools['Font Icons'],
                                  isSmallTablet: e,
                                }),
                            ),
                          !o &&
                            n.createElement(
                              'div',
                              { className: ho.group, style: a },
                              n.createElement(lt, {
                                toolName: 'measure',
                                onClick: this._handleMeasureClick,
                              }),
                              n.createElement(lt, {
                                toolName: 'zoom',
                                onClick: this._handleZoomInClick,
                              }),
                              n.createElement(st, { chartWidgetCollection: t }),
                            ),
                          !o &&
                            n.createElement(
                              'div',
                              { className: ho.group, style: a },
                              n.createElement(jt, { isSmallTablet: e }),
                              this._features.tools &&
                                n.createElement(it, {
                                  property: d.properties().childs()
                                    .stayInDrawingMode,
                                  saveDefaultOnChange: !0,
                                  toolName: 'drawginmode',
                                  onClick: this._handleDrawingClick,
                                }),
                              this._features.tools &&
                                n.createElement(it, {
                                  property: d.lockDrawings(),
                                  toolName: 'lockAllDrawings',
                                  onClick: this._handleLockClick,
                                }),
                              this._features.tools &&
                                n.createElement(Mt, { isSmallTablet: e }),
                              !1,
                            ),
                          !o &&
                            this._features.tools &&
                            n.createElement(
                              'div',
                              { className: ho.group, style: a },
                              n.createElement(_t, {
                                chartWidgetCollection: t,
                                isSmallTablet: e,
                                toolName: 'removeAllDrawingTools',
                              }),
                            ),
                          n.createElement('div', {
                            className: ho.fill,
                            style: a,
                          }),
                          !o &&
                            (this._features.tools || !1) &&
                            n.createElement(
                              'div',
                              {
                                className: s(ho.group, ho.lastGroup),
                                style: a,
                              },
                              !1,
                              this._features.tools &&
                                this._features.favoriting &&
                                n.createElement(Rt, {
                                  id: Ut.FavoriteDrawings,
                                }),
                              h() &&
                                n.createElement(I, {
                                  id: Ut.ObjectTree,
                                  action: this._handleObjectsTreeClick,
                                  toolName: 'showObjectsTree',
                                }),
                            ),
                        ),
                      ),
                    ),
                ),
                c,
              ),
            ),
          )
        }
        _activeChartWidget() {
          return this.props.chartWidgetCollection.activeChartWidget.value()
        }
        _negotiateResizer() {
          const e = Kt.TOOLBAR_WIDTH_COLLAPSED
          this.props.resizerBridge.negotiateWidth(
            this.state.isVisible ? Kt.TOOLBAR_WIDTH_EXPANDED : e,
          )
        }
        _handleGlobalClose() {
          go.fire()
        }
        _updateHotkeys() {
          this._hotkeys.promote()
        }
        _initHotkeys() {
          ;(this._hotkeys = S.createGroup({ desc: 'Drawing Toolbar' })),
            this._hotkeys.add({
              desc: 'Reset',
              hotkey: 27,
              handler: () => this._handleEsc(),
              isDisabled: () => d.toolIsCursor(d.tool.value()),
            })
        }
      }
      function Co(e, t) {
        0
      }
      class wo {
        constructor(e, t) {
          ;(this._component = null),
            (this._handleRef = (e) => {
              this._component = e
            }),
            (this._container = e),
            i.render(
              n.createElement(To, { ...t, ref: this._handleRef }),
              this._container,
            )
        }
        destroy() {
          i.unmountComponentAtNode(this._container)
        }
        getComponent() {
          return (0, l.ensureNotNull)(this._component)
        }
      }
    },
    59511: (e, t, o) => {
      o.d(t, {
        isLineToolsGroupWithSections: () => r,
        lineTools: () => a,
        lineToolsFlat: () => c,
      })
      var n = o(11542),
        i = (o(49483), o(56570)),
        l = o(37265)
      const s = i.enabled('image_drawingtool'),
        a = [
          {
            id: 'linetool-group-cursors',
            title: n.t(null, void 0, o(81578)),
            sections: [
              {
                items: [
                  { name: 'cursor' },
                  { name: 'dot' },
                  { name: 'arrow' },
                  { name: 'demonstration' },
                  null,
                ].filter(l.isExistent),
              },
              { items: [{ name: 'eraser' }] },
            ],
            trackLabel: null,
          },
          {
            id: 'linetool-group-trend-line',
            title: n.t(null, void 0, o(48773)),
            sections: [
              {
                title: n.t(null, void 0, o(56982)),
                items: [
                  { name: 'LineToolTrendLine' },
                  { name: 'LineToolRay' },
                  { name: 'LineToolInfoLine' },
                  { name: 'LineToolExtended' },
                  { name: 'LineToolTrendAngle' },
                  { name: 'LineToolHorzLine' },
                  { name: 'LineToolHorzRay' },
                  { name: 'LineToolVertLine' },
                  { name: 'LineToolCrossLine' },
                ],
              },
              {
                title: n.t(null, void 0, o(59934)),
                items: [
                  { name: 'LineToolParallelChannel' },
                  { name: 'LineToolRegressionTrend' },
                  { name: 'LineToolFlatBottom' },
                  { name: 'LineToolDisjointAngle' },
                ],
              },
              {
                title: n.t(null, void 0, o(36167)),
                items: [
                  { name: 'LineToolPitchfork' },
                  { name: 'LineToolSchiffPitchfork2' },
                  { name: 'LineToolSchiffPitchfork' },
                  { name: 'LineToolInsidePitchfork' },
                ],
              },
            ],
            trackLabel: null,
          },
          {
            id: 'linetool-group-gann-and-fibonacci',
            title: n.t(null, void 0, o(2654)),
            sections: [
              {
                title: n.t(null, void 0, o(26578)),
                items: [
                  { name: 'LineToolFibRetracement' },
                  { name: 'LineToolTrendBasedFibExtension' },
                  { name: 'LineToolFibChannel' },
                  { name: 'LineToolFibTimeZone' },
                  { name: 'LineToolFibSpeedResistanceFan' },
                  { name: 'LineToolTrendBasedFibTime' },
                  { name: 'LineToolFibCircles' },
                  { name: 'LineToolFibSpiral' },
                  { name: 'LineToolFibSpeedResistanceArcs' },
                  { name: 'LineToolFibWedge' },
                  { name: 'LineToolPitchfan' },
                ],
              },
              {
                title: n.t(null, void 0, o(51494)),
                items: [
                  { name: 'LineToolGannSquare' },
                  { name: 'LineToolGannFixed' },
                  { name: 'LineToolGannComplex' },
                  { name: 'LineToolGannFan' },
                ],
              },
            ],
            trackLabel: null,
          },
          {
            id: 'linetool-group-patterns',
            title: n.t(null, void 0, o(46417)),
            sections: [
              {
                title: n.t(null, void 0, o(46417)),
                items: [
                  { name: 'LineTool5PointsPattern' },
                  { name: 'LineToolCypherPattern' },
                  { name: 'LineToolHeadAndShoulders' },
                  { name: 'LineToolABCD' },
                  { name: 'LineToolTrianglePattern' },
                  { name: 'LineToolThreeDrivers' },
                ],
              },
              {
                title: n.t(null, void 0, o(44255)),
                items: [
                  { name: 'LineToolElliottImpulse' },
                  { name: 'LineToolElliottCorrection' },
                  { name: 'LineToolElliottTriangle' },
                  { name: 'LineToolElliottDoubleCombo' },
                  { name: 'LineToolElliottTripleCombo' },
                ],
              },
              {
                title: n.t(null, void 0, o(77915)),
                items: [
                  { name: 'LineToolCircleLines' },
                  { name: 'LineToolTimeCycles' },
                  { name: 'LineToolSineLine' },
                ],
              },
            ],
            trackLabel: null,
          },
          {
            id: 'linetool-group-prediction-and-measurement',
            title: n.t(null, void 0, o(1410)),
            sections: [
              {
                title: n.t(null, void 0, o(75747)),
                items: [
                  { name: 'LineToolRiskRewardLong' },
                  { name: 'LineToolRiskRewardShort' },
                  { name: 'LineToolPrediction' },
                  { name: 'LineToolBarsPattern' },
                  { name: 'LineToolGhostFeed' },
                  { name: 'LineToolProjection' },
                ].filter(l.isExistent),
              },
              {
                title: n.t(null, void 0, o(69260)),
                items: [
                  { name: 'LineToolAnchoredVWAP' },
                  { name: 'LineToolFixedRangeVolumeProfile' },
                  null,
                ].filter(l.isExistent),
              },
              {
                title: n.t(null, void 0, o(97050)),
                items: [
                  { name: 'LineToolPriceRange' },
                  { name: 'LineToolDateRange' },
                  { name: 'LineToolDateAndPriceRange' },
                ],
              },
            ],
            trackLabel: null,
          },
          {
            id: 'linetool-group-geometric-shapes',
            title: n.t(null, void 0, o(22145)),
            sections: [
              {
                title: n.t(null, void 0, o(65695)),
                items: [
                  { name: 'LineToolBrush' },
                  { name: 'LineToolHighlighter' },
                ],
              },
              {
                title: n.t(null, void 0, o(19147)),
                items: [
                  { name: 'LineToolArrowMarker' },
                  { name: 'LineToolArrow' },
                  { name: 'LineToolArrowMarkUp' },
                  { name: 'LineToolArrowMarkDown' },
                  { name: 'LineToolArrowMarkLeft' },
                  { name: 'LineToolArrowMarkRight' },
                ].filter(l.isExistent),
              },
              {
                title: n.t(null, void 0, o(65781)),
                items: [
                  { name: 'LineToolRectangle' },
                  { name: 'LineToolRotatedRectangle' },
                  { name: 'LineToolPath' },
                  { name: 'LineToolCircle' },
                  { name: 'LineToolEllipse' },
                  { name: 'LineToolPolyline' },
                  { name: 'LineToolTriangle' },
                  { name: 'LineToolArc' },
                  { name: 'LineToolBezierQuadro' },
                  { name: 'LineToolBezierCubic' },
                ],
              },
            ],
            trackLabel: null,
          },
          {
            id: 'linetool-group-annotation',
            title: n.t(null, void 0, o(32064)),
            sections: [
              {
                title: n.t(null, void 0, o(65831)),
                items: [
                  { name: 'LineToolText' },
                  { name: 'LineToolTextAbsolute' },
                  { name: 'LineToolTextNote' },
                  { name: 'LineToolPriceNote' },
                  { name: 'LineToolNote' },
                  { name: 'LineToolTable' },
                  { name: 'LineToolCallout' },
                  { name: 'LineToolComment' },
                  { name: 'LineToolPriceLabel' },
                  { name: 'LineToolSignpost' },
                  { name: 'LineToolFlagMark' },
                ].filter(l.isExistent),
              },
              {
                title: n.t(null, void 0, o(93111)),
                items: [
                  s ? { name: 'LineToolImage' } : null,
                  null,
                  null,
                ].filter(l.isExistent),
              },
            ],
            trackLabel: null,
          },
        ]
      function r(e) {
        return 'sections' in e
      }
      const c = a.flatMap((e) =>
        r(e) ? e.sections.flatMap((e) => e.items) : e.items,
      )
    },
    77151: (e, t, o) => {
      o.d(t, {
        RegistryProvider: () => r,
        registryContextType: () => c,
        validateRegistry: () => a,
      })
      var n = o(50959),
        i = o(19036),
        l = o.n(i)
      const s = n.createContext({})
      function a(e, t) {
        l().checkPropTypes(t, e, 'context', 'RegistryContext')
      }
      function r(e) {
        const { validation: t, value: o } = e
        return a(o, t), n.createElement(s.Provider, { value: o }, e.children)
      }
      function c() {
        return s
      }
    },
    61380: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 10" width="20" height="10"><path fill="none" stroke="currentColor" stroke-width="1.5" d="M2 1l8 8 8-8"/></svg>'
    },
    51609: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M4.31 14.5a1.07 1.07 0 0 1 0-1.5L13 4.3c.42-.41 1.1-.41 1.52 0l.99 1c.42.42.41 1.11-.02 1.53l-5.38 5.12h12.83c.6 0 1.07.48 1.07 1.07v1.43c0 .6-.48 1.07-1.07 1.07H10.1l5.38 5.13c.44.41.45 1.1.02 1.53l-1 .99c-.41.42-1.1.42-1.5 0L4.3 14.5Zm7.97 9.38-8.67-8.67c-.81-.8-.82-2.12 0-2.93l8.68-8.67c.8-.81 2.12-.82 2.92 0l1 .99c.82.82.8 2.16-.04 2.96l-3.57 3.4h10.33c1.14 0 2.07.93 2.07 2.07v1.43c0 1.15-.93 2.07-2.07 2.07H12.6l3.57 3.4c.84.8.86 2.14.03 2.97l-.99.99c-.8.8-2.12.8-2.93 0Z"/></svg>'
    },
    22976: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M4.87 4.52a.5.5 0 0 1 .61.35L6.91 10h5.47l1.03-4.67c.14-.63 1.04-.63 1.18 0L15.62 10h5.47l1.43-5.13a.5.5 0 0 1 .96.26L22.13 10H25a.5.5 0 0 1 0 1h-3.15l-.83 3H25a.5.5 0 0 1 0 1h-4.26l-2.15 7.75c-.17.6-1.03.58-1.16-.03L15.7 15h-3.42l-1.72 7.72c-.13.6-1 .63-1.16.03L7.26 15H3a.5.5 0 1 1 0-1h3.98l-.83-3H3a.5.5 0 1 1 0-1h2.87L4.52 5.13a.5.5 0 0 1 .35-.61ZM7.19 11l.83 3h3.47l.66-3H7.2Zm5.99 0-.67 3h2.98l-.67-3h-1.64Zm1.42-1L14 7.3l-.6 2.7h1.2Zm1.25 1 .66 3h3.47l.83-3h-4.96Zm3.85 4h-2.97l1.32 5.94L19.7 15Zm-8.43 0H8.3l1.65 5.94L11.27 15Z"/></svg>'
    },
    70616: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="M7.5 24v-5.5m0 0s2.7-1.1 4.5-1c2.1.12 2.9 1.88 5 2 1.8.1 4.5-1 4.5-1v-6m-14 6v-6m0 0v-6s2.7-1.1 4.5-1c2.1.12 2.9 1.88 5 2 1.8.1 4.5-1 4.5-1v6m-14 0s2.7-1.1 4.5-1c2.1.12 2.9 1.88 5 2 1.8.1 4.5-1 4.5-1"/></svg>'
    },
    48748: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M14.08 3.73c.1.16.1.37 0 .54a9.4 9.4 0 0 0 3.35 13.26 9.9 9.9 0 0 0 6.49 1.18.5.5 0 0 1 .5.76 10.67 10.67 0 0 1-3.83 3.64 10.91 10.91 0 0 1-14.28-3.3A10.44 10.44 0 0 1 8.69 5.56a10.86 10.86 0 0 1 4.9-2.06.5.5 0 0 1 .49.22Zm8.3 15.61v.5c-1.91 0-3.8-.5-5.45-1.44a10.64 10.64 0 0 1-3.95-3.97 10.4 10.4 0 0 1-.3-9.72 9.6 9.6 0 0 0-6.37 5.39 9.39 9.39 0 0 0 .83 9.14 9.7 9.7 0 0 0 3.6 3.17 9.92 9.92 0 0 0 12.21-2.59c-.19.02-.38.02-.57.02v-.5Z"/></svg>'
    },
    18042: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M6 11.69C6 7.46 9.56 4 14 4c4.44 0 8 3.46 8 7.69 0 2.63-1.2 4.93-3.25 6.31H14.5v-5H18v-1h-8v1h3.5v5H9.14A8.06 8.06 0 0 1 6 11.69Zm2 6.67a9.1 9.1 0 0 1-3-6.67C5 6.87 9.05 3 14 3s9 3.87 9 8.69a8.51 8.51 0 0 1-3 6.62V22h-2v3h-8v-3H8v-3.64ZM11 22v2h6v-2h-6Zm-2-1v-2h10v2H9Z"/></svg>'
    },
    44986: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M6 14.5C6 9.78 9.78 6 14.5 6c4.72 0 8.5 3.78 8.5 8.5 0 4.72-3.78 8.5-8.5 8.5A8.46 8.46 0 0 1 6 14.5ZM14.5 5A9.46 9.46 0 0 0 5 14.5c0 5.28 4.22 9.5 9.5 9.5s9.5-4.22 9.5-9.5S19.78 5 14.5 5ZM14 16V9h1v6h4v1h-5Z"/></svg>'
    },
    83778: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M6 14.5C6 9.78 9.78 6 14.5 6c4.72 0 8.5 3.78 8.5 8.5 0 4.72-3.78 8.5-8.5 8.5A8.46 8.46 0 0 1 6 14.5ZM14.5 5A9.46 9.46 0 0 0 5 14.5c0 5.28 4.22 9.5 9.5 9.5s9.5-4.22 9.5-9.5S19.78 5 14.5 5ZM12 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm4 1a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm-6 4-.43.26v.01l.03.03a3.55 3.55 0 0 0 .3.4 5.7 5.7 0 0 0 9.22 0 5.42 5.42 0 0 0 .28-.4l.02-.03v-.01L19 17l-.43-.26v.02a2.45 2.45 0 0 1-.24.32c-.17.21-.43.5-.78.79a4.71 4.71 0 0 1-6.88-.8 4.32 4.32 0 0 1-.23-.31l-.01-.02L10 17Z"/></svg>'
    },
    90624: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 112" width="28" height="28"><path fill="#fff" d="M63.42 93.22a37.13 37.13 0 1 0 .01-74.27 37.13 37.13 0 0 0-.01 74.27Z"/><path fill="#fff" d="M45.48 48.85c-.71.04-1.96 0-3.17.2-2.36.41-4.72.85-7.03 1.51a30.65 30.65 0 0 0-4.87 2.02c-1.9.9-3.74 1.93-5.59 2.94-.66.36-.71.86-.16 1.39.53.53 1.1 1.01 1.7 1.44 2.43 1.63 4.91 3.15 7.3 4.85 2.77 1.95 5.86 3.03 8.95 4.03 3.5 1.14 7.15.85 10.72.38 4.05-.54 8.1-1.3 11.9-2.96 2.17-.95 4.21-2.22 6.27-3.44.88-.5.86-.86.08-1.5-1.59-1.28-3.16-2.6-4.82-3.78-3.73-2.66-7.65-4.85-12.05-6a29.47 29.47 0 0 0-9.23-1.08Zm6.56-21.95v8.8c0 1.1-.02 2.18-.03 3.27 0 .86.33 1.39 1.14 1.47.38.04.77.06 1.16.11 2.8.35 3.14.13 3.99-2.86.77-2.7 1.47-5.44 2.22-8.15.31-1.12.5-1.18 1.5-.79 1.98.78 3.95 1.58 5.94 2.32.77.29 1.03.6.7 1.56-.98 2.94-1.86 5.92-2.77 8.89-.09.28-.15.57-.21.86-.42 2.02-.37 2.12 1.37 2.8.25.1.5.21.74.34.51.3.91.26 1.38-.19 2.34-2.22 4.75-4.34 7.05-6.6.74-.73 1.57-.62 2.16-.04A83.06 83.06 0 0 1 82 42.52c.64.73.6 1.52-.04 2.3a273.4 273.4 0 0 1-4.69 5.62c-.46.53-.44.98-.02 1.44 1.46 1.55 2.93 3.1 4.4 4.63 1.1 1.13 2.21 2.24 3.3 3.37 1.05 1.07 1.12 1.67.06 2.77-1.44 1.5-2.86 3.08-4.51 4.23a87.09 87.09 0 0 1-10 6.28 32.38 32.38 0 0 1-12.28 3.5c-4.54.36-9.07.43-13.57-.15a59.04 59.04 0 0 1-9.69-2.07 38.4 38.4 0 0 1-8.35-3.83 51.59 51.59 0 0 1-5.8-4.13 73.78 73.78 0 0 1-6.18-5.38c-1.29-1.3-2.33-2.9-3.38-4.46-.58-.84-.06-1.55.59-2.1 1.14-.96 2.32-1.9 3.42-2.9.72-.65.95-.96 1.62-1.67.5-.53.43-1.02-.07-1.51-1.3-1.3-1.52-1.76-2.83-3.07-.6-.59-.74-1.1-.07-1.79 1.66-1.72 4.35-4.22 5.97-5.98.8-.86.9-.82 1.7.12 1.6 1.9 2.12 2.97 3.78 4.83.87.98 1.19 1.55 2.5 1.04 2.37-.95 1.76-.7 1.05-3.35-.64-2.37-1-2.96-1.72-5.3-.08-.26-.17-.5-.23-.75-.33-1.2-.3-1.33.8-1.7 2.06-.68 5.56-1.72 7.62-2.4.8-.27 1.16.18 1.39.93.73 2.55 1.01 3.38 1.77 5.92.2.72.48 1.41.84 2.05.7 1.18 1.13 1.4 2.27 1.36 1.96-.07 2.24-.3 2.24-2.45 0-3.1-.06-6.21-.14-9.32-.04-1.53-.07-1.62 1.34-1.66 2.3-.06 4.61-.02 6.96-.02"/><path fill="#2962FF" d="M63.42 90.92a34.26 34.26 0 1 0 .01-68.52 34.26 34.26 0 0 0-.01 68.52Z"/><path fill="#FF5200" d="M45.69 49.83c-.67.03-1.83 0-2.95.17-2.2.35-4.4.72-6.54 1.28-1.56.4-3.06 1.05-4.53 1.7-1.76.77-3.47 1.64-5.2 2.49-.6.3-.66.73-.15 1.17.5.45 1.03.86 1.59 1.22 2.26 1.37 4.56 2.66 6.79 4.1 2.57 1.64 5.45 2.55 8.31 3.4 3.26.96 6.65.72 9.98.32 3.76-.46 7.52-1.1 11.06-2.5 2.01-.8 3.92-1.88 5.82-2.9.82-.44.8-.74.08-1.27-1.48-1.09-2.94-2.2-4.48-3.2-3.47-2.25-7.11-4.1-11.2-5.06a30.03 30.03 0 0 0-8.59-.91v-.01Zm6.09-18.54v7.44l-.02 2.76c0 .72.3 1.17 1.05 1.24.36.03.73.05 1.08.1 2.6.29 2.92.1 3.71-2.43.72-2.28 1.37-4.59 2.07-6.88.29-.94.45-1 1.4-.66 1.84.66 3.66 1.33 5.52 1.95.7.25.95.52.64 1.32-.9 2.48-1.72 5-2.57 7.5-.08.25-.14.5-.2.74-.38 1.7-.34 1.79 1.28 2.37.23.08.47.17.7.28.47.26.84.22 1.27-.16 2.18-1.87 4.42-3.67 6.56-5.58.69-.61 1.46-.52 2-.03a73.41 73.41 0 0 1 3.37 3.24c.6.6.56 1.28-.03 1.94-1.44 1.6-2.89 3.18-4.37 4.74-.43.46-.4.83-.01 1.22a340.4 340.4 0 0 0 4.1 3.91c1 .96 2.04 1.9 3.06 2.85.97.9 1.03 1.41.05 2.34-1.34 1.26-2.66 2.6-4.2 3.57a82.59 82.59 0 0 1-9.29 5.3 32.44 32.44 0 0 1-11.42 2.97c-4.22.3-8.43.36-12.62-.13a59.71 59.71 0 0 1-9-1.75c-2.76-.77-5.3-1.91-7.77-3.24a48.2 48.2 0 0 1-5.39-3.49c-2-1.4-3.92-2.92-5.75-4.54-1.2-1.09-2.17-2.45-3.15-3.76-.53-.72-.05-1.31.55-1.78 1.06-.82 2.16-1.6 3.18-2.45.67-.55 1.27-1.17 1.9-1.77.46-.45.4-.86-.07-1.28l-3.64-3.32c-.55-.5-.68-.93-.05-1.51 1.53-1.46 3.01-2.98 4.52-4.46.74-.72.84-.7 1.58.1 1.5 1.61 2.98 3.24 4.51 4.8.82.84 1.75 1.09 2.96.65 2.21-.8 2.3-.73 1.63-2.97-.6-2-1.32-3.96-2-5.93-.07-.22-.16-.42-.21-.63-.3-1.02-.28-1.12.74-1.43 1.92-.59 3.85-1.11 5.77-1.69.75-.23 1.08.15 1.3.78.67 2.16 1.33 4.32 2.04 6.46.18.61.44 1.2.78 1.74.66 1 1.72.98 2.78.94 1.83-.06 2.09-.25 2.09-2.07 0-2.62-.06-5.25-.13-7.87-.04-1.3-.07-1.37 1.24-1.4 2.14-.06 4.29-.02 6.47-.02"/><path fill="#FDD600" d="m53.5 54.08.15-.32c-.5-.49-.91-1.15-1.5-1.44a9.83 9.83 0 0 0-6.84-.8c-1.95.5-3.23 1.92-4.14 3.57-.98 1.8-1.33 3.8-.09 5.64.54.8 1.38 1.44 2.16 2.04a6.98 6.98 0 0 0 10.61-2.68c.4-.87.27-1.18-.66-1.48-.98-.31-1.98-.59-2.96-.9-.65-.22-1.31-.44-1.31-1.3 0-.82.53-1.15 1.24-1.35 1.12-.3 2.23-.65 3.34-.97Zm-7.81-4.25c3.23-.15 5.9.29 8.58.92 4.08.96 7.73 2.8 11.21 5.06 1.54.99 3 2.1 4.48 3.2.72.53.74.82-.08 1.26-1.91 1.03-3.82 2.1-5.82 2.9-3.54 1.4-7.3 2.04-11.07 2.5-3.32.4-6.72.65-9.97-.31-2.87-.85-5.74-1.76-8.32-3.41-2.22-1.43-4.52-2.72-6.78-4.1a12 12 0 0 1-1.6-1.21c-.5-.45-.45-.86.17-1.18 1.72-.86 3.43-1.72 5.19-2.48 1.48-.65 2.97-1.3 4.52-1.7 2.16-.56 4.35-.93 6.55-1.28 1.12-.18 2.28-.14 2.94-.18"/><path fill="#1D1D1B" d="M53.5 54.08c-1.11.33-2.22.67-3.34.98-.71.19-1.24.52-1.24 1.34 0 .86.67 1.1 1.3 1.3.99.32 1.99.6 2.97.9.93.3 1.05.61.66 1.49a6.98 6.98 0 0 1-10.62 2.68 9.18 9.18 0 0 1-2.16-2.04c-1.24-1.85-.9-3.85.1-5.65.9-1.65 2.18-3.07 4.13-3.57a9.84 9.84 0 0 1 6.84.8c.6.3 1.01.95 1.5 1.44l-.15.33"/></svg>'
    },
    14665: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 16" width="10" height="16"><path d="M.6 1.4l1.4-1.4 8 8-8 8-1.4-1.4 6.389-6.532-6.389-6.668z"/></svg>'
    },
    39146: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" d="M9 1l2.35 4.76 5.26.77-3.8 3.7.9 5.24L9 13l-4.7 2.47.9-5.23-3.8-3.71 5.25-.77L9 1z"/></svg>'
    },
    48010: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M9 2.13l1.903 3.855.116.236.26.038 4.255.618-3.079 3.001-.188.184.044.259.727 4.237-3.805-2L9 12.434l-.233.122-3.805 2.001.727-4.237.044-.26-.188-.183-3.079-3.001 4.255-.618.26-.038.116-.236L9 2.13z"/></svg>'
    },
  },
])
