;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9374],
  {
    95074: (e) => {
      e.exports = {
        'text-button': 'text-button-H6_2ZGVv',
        link: 'link-H6_2ZGVv',
        content: 'content-H6_2ZGVv',
        'text-button-brand-small': 'text-button-brand-small-H6_2ZGVv',
        background: 'background-H6_2ZGVv',
        'with-start-icon': 'with-start-icon-H6_2ZGVv',
        'with-end-icon': 'with-end-icon-H6_2ZGVv',
        'icon-only': 'icon-only-H6_2ZGVv',
        'start-icon': 'start-icon-H6_2ZGVv',
        'end-icon': 'end-icon-H6_2ZGVv',
        hovered: 'hovered-H6_2ZGVv',
        'states-without-bg': 'states-without-bg-H6_2ZGVv',
        'disable-active-state-styles': 'disable-active-state-styles-H6_2ZGVv',
        dimmed: 'dimmed-H6_2ZGVv',
        selected: 'selected-H6_2ZGVv',
        caret: 'caret-H6_2ZGVv',
        activated: 'activated-H6_2ZGVv',
        'typography-semibold18px': 'typography-semibold18px-H6_2ZGVv',
        'typography-semibold16px': 'typography-semibold16px-H6_2ZGVv',
        'typography-semibold14px': 'typography-semibold14px-H6_2ZGVv',
        'typography-regular14px': 'typography-regular14px-H6_2ZGVv',
        'typography-regular16px': 'typography-regular16px-H6_2ZGVv',
        'text-button-brand-medium': 'text-button-brand-medium-H6_2ZGVv',
        'text-button-brand-large': 'text-button-brand-large-H6_2ZGVv',
        'text-button-gray-small': 'text-button-gray-small-H6_2ZGVv',
        'text-button-gray-medium': 'text-button-gray-medium-H6_2ZGVv',
        'text-button-gray-large': 'text-button-gray-large-H6_2ZGVv',
        'text-button-light-gray-small': 'text-button-light-gray-small-H6_2ZGVv',
        'text-button-light-gray-medium':
          'text-button-light-gray-medium-H6_2ZGVv',
        'text-button-light-gray-large': 'text-button-light-gray-large-H6_2ZGVv',
      }
    },
    96108: (e) => {
      e.exports = {
        'tablet-normal-breakpoint': '(max-width: 768px)',
        'small-height-breakpoint': '(max-height: 360px)',
        'tablet-small-breakpoint': '(max-width: 440px)',
      }
    },
    72041: (e) => {
      e.exports = {
        label: 'label-ou2KkVr5',
        text: 'text-ou2KkVr5',
        icon: 'icon-ou2KkVr5',
      }
    },
    6963: (e) => {
      e.exports = { icon: 'icon-OJpk_CAQ' }
    },
    17946: (e, t, n) => {
      n.d(t, { CustomBehaviourContext: () => o })
      const o = (0, n(50959).createContext)({ enableActiveStateStyles: !0 })
      o.displayName = 'CustomBehaviourContext'
    },
    43010: (e, t, n) => {
      n.d(t, { useIsomorphicLayoutEffect: () => i })
      var o = n(50959)
      function i(e, t) {
        ;('undefined' == typeof window ? o.useEffect : o.useLayoutEffect)(e, t)
      }
    },
    36383: (e, t, n) => {
      n.d(t, { useOutsideEvent: () => s })
      var o = n(50959),
        i = n(43010),
        r = n(27267)
      function s(e) {
        const {
            click: t,
            mouseDown: n,
            touchEnd: s,
            touchStart: a,
            handler: l,
            reference: c,
          } = e,
          u = (0, o.useRef)(null),
          d = (0, o.useRef)(
            'undefined' == typeof window
              ? 0
              : new window.CustomEvent('timestamp').timeStamp,
          )
        return (
          (0, i.useIsomorphicLayoutEffect)(() => {
            const e = { click: t, mouseDown: n, touchEnd: s, touchStart: a },
              o = c ? c.current : u.current
            return (0, r.addOutsideEventListener)(d.current, o, l, document, e)
          }, [t, n, s, a, l]),
          c || u
        )
      }
    },
    9745: (e, t, n) => {
      n.d(t, { Icon: () => i })
      var o = n(50959)
      const i = o.forwardRef((e, t) => {
        const {
            icon: n = '',
            title: i,
            ariaLabel: r,
            ariaLabelledby: s,
            ariaHidden: a,
            ...l
          } = e,
          c = !!(i || r || s)
        return o.createElement('span', {
          role: 'img',
          ...l,
          ref: t,
          'aria-label': r,
          'aria-labelledby': s,
          'aria-hidden': a || !c,
          title: i,
          dangerouslySetInnerHTML: { __html: n },
        })
      })
    },
    99663: (e, t, n) => {
      n.d(t, { Slot: () => i, SlotContext: () => r })
      var o = n(50959)
      class i extends o.Component {
        shouldComponentUpdate() {
          return !1
        }
        render() {
          return o.createElement('div', {
            style: { position: 'fixed', zIndex: 150, left: 0, top: 0 },
            ref: this.props.reference,
          })
        }
      }
      const r = o.createContext(null)
    },
    90186: (e, t, n) => {
      function o(e) {
        return r(e, s)
      }
      function i(e) {
        return r(e, a)
      }
      function r(e, t) {
        const n = Object.entries(e).filter(t),
          o = {}
        for (const [e, t] of n) o[e] = t
        return o
      }
      function s(e) {
        const [t, n] = e
        return 0 === t.indexOf('data-') && 'string' == typeof n
      }
      function a(e) {
        return 0 === e[0].indexOf('aria-')
      }
      n.d(t, {
        filterAriaProps: () => i,
        filterDataProps: () => o,
        filterProps: () => r,
        isAriaAttribute: () => a,
        isDataAttribute: () => s,
      })
    },
    67961: (e, t, n) => {
      n.d(t, { OverlapManager: () => s, getRootOverlapManager: () => l })
      var o = n(50151),
        i = n(34811)
      class r {
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
      class s {
        constructor(e = document) {
          ;(this._storage = new r()),
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
          const o = this._document.createElement('div')
          if (
            ((o.style.position = t.position),
            (o.style.zIndex = this._index.toString()),
            (o.dataset.id = e),
            void 0 !== t.index)
          ) {
            const e = this._container.childNodes.length
            if (t.index >= e) this._container.appendChild(o)
            else if (t.index <= 0)
              this._container.insertBefore(o, this._container.firstChild)
            else {
              const e = this._container.childNodes[t.index]
              this._container.insertBefore(o, e)
            }
          } else
            'reverse' === t.direction
              ? this._container.insertBefore(o, this._container.firstChild)
              : this._container.appendChild(o)
          return this._windows.set(e, o), ++this._index, o
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
            this._windows.forEach((e, n) => {
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
      const a = new WeakMap()
      function l(e = document) {
        const t = e.getElementById('overlap-manager-root')
        if (null !== t) return (0, o.ensureDefined)(a.get(t))
        {
          const t = new s(e),
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
          return a.set(n, t), t.setContainer(n), e.body.appendChild(n), t
        }
      }
      var c
      !((e) => {
        e[(e.BaseZindex = 150)] = 'BaseZindex'
      })(c || (c = {}))
    },
    99054: (e, t, n) => {
      n.d(t, { setFixedBodyState: () => c })
      const o = (() => {
        let e
        return () => {
          if (void 0 === e) {
            const t = document.createElement('div'),
              n = t.style
            ;(n.visibility = 'hidden'),
              (n.width = '100px'),
              (n.msOverflowStyle = 'scrollbar'),
              document.body.appendChild(t)
            const o = t.offsetWidth
            t.style.overflow = 'scroll'
            const i = document.createElement('div')
            ;(i.style.width = '100%'), t.appendChild(i)
            const r = i.offsetWidth
            t.parentNode?.removeChild(t), (e = o - r)
          }
          return e
        }
      })()
      function i(e, t, n) {
        null !== e && e.style.setProperty(t, n)
      }
      function r(e, t) {
        return getComputedStyle(e, null).getPropertyValue(t)
      }
      function s(e, t) {
        return Number.parseInt(r(e, t))
      }
      let a = 0,
        l = !1
      function c(e) {
        const { body: t } = document,
          n = t.querySelector('.widgetbar-wrap')
        if (e && 1 == ++a) {
          const e = r(t, 'overflow'),
            a = s(t, 'padding-right')
          'hidden' !== e.toLowerCase() &&
            t.scrollHeight > t.offsetHeight &&
            (i(n, 'right', `${o()}px`),
            (t.style.paddingRight = `${a + o()}px`),
            (l = !0)),
            t.classList.add('i-no-scroll')
        } else if (
          !e &&
          a > 0 &&
          0 == --a &&
          (t.classList.remove('i-no-scroll'), l)
        ) {
          i(n, 'right', '0px')
          let e = 0
          0,
            t.scrollHeight <= t.clientHeight && (e -= o()),
            (t.style.paddingRight = (e < 0 ? 0 : e) + 'px'),
            (l = !1)
        }
      }
    },
    87896: (e, t, n) => {
      n.d(t, { createReactRoot: () => d })
      var o = n(50959),
        i = n(32227),
        r = n(4237)
      const s = (0, o.createContext)({
        isOnMobileAppPage: () => !1,
        isRtl: !1,
        locale: 'en',
      })
      var a = n(84015),
        l = n(63273)
      const c = {
        iOs: 'old',
        android: 'new',
        old: 'old',
        new: 'new',
        any: 'any',
      }
      function u(e) {
        const [t] = (0, o.useState)({
          isOnMobileAppPage: (e) => (0, a.isOnMobileAppPage)(c[e]),
          isRtl: (0, l.isRtl)(),
          locale: window.locale,
        })
        return o.createElement(s.Provider, { value: t }, e.children)
      }
      function d(e, t, n = 'legacy') {
        const s = o.createElement(u, null, e)
        if ('modern' === n) {
          const e = (0, r.createRoot)(t)
          return (
            e.render(s),
            {
              render(t) {
                e.render(o.createElement(u, null, t))
              },
              unmount() {
                e.unmount()
              },
            }
          )
        }
        return (
          i.render(s, t),
          {
            render(e) {
              i.render(o.createElement(u, null, e), t)
            },
            unmount() {
              i.unmountComponentAtNode(t)
            },
          }
        )
      }
    },
    24437: (e, t, n) => {
      n.d(t, { DialogBreakpoints: () => i })
      var o = n(96108)
      const i = {
        SmallHeight: o['small-height-breakpoint'],
        TabletSmall: o['tablet-small-breakpoint'],
        TabletNormal: o['tablet-normal-breakpoint'],
      }
    },
    29562: (e, t, n) => {
      n.d(t, { SymbolSearchFlag: () => g })
      var o = n(50959),
        i = n(97754),
        r = n.n(i),
        s = n(24633),
        a = n(36279)
      const l = n.p + 'mock-dark.16b5f3a431f502b03ae3.svg',
        c = n.p + 'mock-light.d201313017eb2c1b989f.svg'
      function u(e) {
        return e === s.StdTheme.Dark ? l : c
      }
      var d = n(77975),
        m = n(45345),
        p = n(50151)
      const h = a.LogoSize.Medium
      var v = n(6963)
      function g(e) {
        const {
            country: t,
            tooltip: n,
            providerId: i,
            sourceId: s,
            className: l,
          } = e,
          c = (0, d.useWatchedValueReadonly)({ watchedValue: m.watchedTheme }),
          [g, y] = (0, o.useState)(
            (({ country: e, providerId: t, sourceId: n }) => {
              const o = (0, a.getLogoUrlResolver)()
              return (i) => {
                const r = (e) => o.getProviderLogoUrl(e, h),
                  s = [
                    { value: n, resolve: r },
                    {
                      value: e,
                      resolve: (e) => o.getCountryFlagUrl(e.toUpperCase(), h),
                    },
                    { value: t, resolve: r },
                  ].find(({ value: e }) => void 0 !== e && e.length > 0)
                return void 0 !== s
                  ? s.resolve((0, p.ensureDefined)(s.value))
                  : u(i)
              }
            })({ country: t, providerId: i, sourceId: s })(c),
          )
        return o.createElement('img', {
          className: r()(l, 'apply-common-tooltip', v.icon),
          crossOrigin: '',
          'data-tooltip': n,
          src: g,
          onError: () => {
            y(u(c))
          },
        })
      }
    },
    90692: (e, t, n) => {
      n.d(t, { MatchMedia: () => i })
      var o = n(50959)
      class i extends o.PureComponent {
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
    42842: (e, t, n) => {
      n.d(t, { Portal: () => c, PortalContext: () => u })
      var o = n(50959),
        i = n(32227),
        r = n(55698),
        s = n(67961),
        a = n(34811),
        l = n(99663)
      class c extends o.PureComponent {
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
              !e.hasAttribute(a.FOCUS_TRAP_DATA_ATTRIBUTE) &&
              e.setAttribute(a.FOCUS_TRAP_DATA_ATTRIBUTE, 'true'),
            this.props['aria-hidden'] && e.setAttribute('aria-hidden', 'true'),
            i.createPortal(
              o.createElement(u.Provider, { value: this }, this.props.children),
              e,
            )
          )
        }
        moveToTop() {
          this._manager().moveToTop(this._uuid)
        }
        _manager() {
          return null === this.context
            ? (0, s.getRootOverlapManager)()
            : this.context
        }
      }
      c.contextType = l.SlotContext
      const u = o.createContext(null)
    },
    97635: (e) => {
      e.exports = {
        'tablet-small-breakpoint': '(max-width: 440px)',
        dialog: 'dialog-mBXAEZtB',
        wrap: 'wrap-mBXAEZtB',
        separator: 'separator-mBXAEZtB',
        groupSeparator: 'groupSeparator-mBXAEZtB',
        widgetSeparator: 'widgetSeparator-mBXAEZtB',
        firstGroup: 'firstGroup-mBXAEZtB',
        row: 'row-mBXAEZtB',
        item: 'item-mBXAEZtB',
        menuButton: 'menuButton-mBXAEZtB',
        multipleLinks: 'multipleLinks-mBXAEZtB',
        title: 'title-mBXAEZtB',
        valueItem: 'valueItem-mBXAEZtB',
        copyButton: 'copyButton-mBXAEZtB',
        sessionHeader: 'sessionHeader-mBXAEZtB',
        sessionWidget: 'sessionWidget-mBXAEZtB',
        timeZone: 'timeZone-mBXAEZtB',
        link: 'link-mBXAEZtB',
        icon: 'icon-mBXAEZtB',
        startSlot: 'startSlot-mBXAEZtB',
        endSlot: 'endSlot-mBXAEZtB',
      }
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
    17265: (e) => {
      e.exports = { icon: 'icon-mwO_HX5L' }
    },
    81348: (e, t, n) => {
      n.d(t, {
        DEFAULT_TOOL_WIDGET_BUTTON_THEME: () => a,
        ToolWidgetButton: () => l,
      })
      var o = n(50959),
        i = n(97754),
        r = n(9745),
        s = n(38576)
      const a = s,
        l = o.forwardRef((e, t) => {
          const {
              tag: n = 'div',
              icon: a,
              endIcon: l,
              isActive: c,
              isOpened: u,
              isDisabled: d,
              isGrouped: m,
              isHovered: p,
              isClicked: h,
              onClick: v,
              text: g,
              textBeforeIcon: y,
              title: f,
              theme: b = s,
              className: w,
              forceInteractive: _,
              inactive: x,
              'data-name': E,
              'data-tooltip': S,
              ...C
            } = e,
            I = i(w, b.button, (f || S) && 'apply-common-tooltip', {
              [b.isActive]: c,
              [b.isOpened]: u,
              [b.isInteractive]: (_ || Boolean(v)) && !d && !x,
              [b.isDisabled]: Boolean(d || x),
              [b.isGrouped]: m,
              [b.hover]: p,
              [b.clicked]: h,
            }),
            A =
              a &&
              ('string' == typeof a
                ? o.createElement(r.Icon, { className: b.icon, icon: a })
                : o.cloneElement(a, {
                    className: i(b.icon, a.props.className),
                  }))
          return 'button' === n
            ? o.createElement(
                'button',
                {
                  ...C,
                  ref: t,
                  type: 'button',
                  className: i(I, b.accessible),
                  disabled: d && !x,
                  onClick: v,
                  title: f,
                  'data-name': E,
                  'data-tooltip': S,
                },
                y &&
                  g &&
                  o.createElement(
                    'div',
                    { className: i('js-button-text', b.text) },
                    g,
                  ),
                A,
                !y &&
                  g &&
                  o.createElement(
                    'div',
                    { className: i('js-button-text', b.text) },
                    g,
                  ),
              )
            : o.createElement(
                'div',
                {
                  ...C,
                  ref: t,
                  'data-role': 'button',
                  className: I,
                  onClick: d ? void 0 : v,
                  title: f,
                  'data-name': E,
                  'data-tooltip': S,
                },
                y &&
                  g &&
                  o.createElement(
                    'div',
                    { className: i('js-button-text', b.text) },
                    g,
                  ),
                A,
                !y &&
                  g &&
                  o.createElement(
                    'div',
                    { className: i('js-button-text', b.text) },
                    g,
                  ),
                l && o.createElement(r.Icon, { icon: l, className: s.endIcon }),
              )
        })
    },
    30995: (e, t, n) => {
      n.r(t), n.d(t, { SymbolInfoDialogImpl: () => fe })
      var o = n(50959),
        i = n(97754),
        r = n.n(i),
        s = n(11542),
        a = n(9745),
        l = n(17946),
        c = n(2948),
        u = n(95074),
        d = n.n(u)
      const m = {
          small: 'regular14px',
          medium: 'semibold16px',
          large: 'semibold18px',
        },
        p = (e) => {
          const t = (0, o.useContext)(l.CustomBehaviourContext),
            {
              className: n,
              isSelected: r,
              isDimmed: s,
              isHovered: a,
              size: c = 'medium',
              color: u,
              startIcon: p,
              endIcon: h,
              showCaret: v,
              enableActiveStateStyles: g = t.enableActiveStateStyles,
              typography: y,
              iconOnly: f,
              isLink: b = !1,
              isActivated: w,
            } = e
          return i(
            n,
            d()['text-button'],
            b && d().link,
            r && d().selected,
            s && d().dimmed,
            a && d().hovered,
            d()[`text-button-${u}-${c}`],
            p && d()['with-start-icon'],
            f && d()['icon-only'],
            (v || h) && d()['with-end-icon'],
            !g && d()['disable-active-state-styles'],
            y ? d()[`typography-${y}`] : d()[`typography-${m[c]}`],
            w && d().activated,
          )
        }
      function h(e) {
        return o.createElement(
          o.Fragment,
          null,
          o.createElement('span', {
            className: i(
              d().background,
              e.statesWithoutBg && d()['states-without-bg'],
            ),
          }),
          e.startIcon &&
            o.createElement(a.Icon, {
              ...e.startIconAriaAttrs,
              className: d()['start-icon'],
              icon: e.startIcon,
            }),
          o.createElement('span', { className: d().content }, e.children),
          (e.endIcon || e.showCaret) &&
            ((e) =>
              o.createElement(a.Icon, {
                ...(e.showCaret ? void 0 : e.endIconAriaAttrs),
                className: i(d()['end-icon'], e.showCaret && d().caret),
                icon: e.showCaret ? c : e.endIcon,
              }))(e),
        )
      }
      function v(e) {
        const {
          reference: t,
          className: n,
          isSelected: i,
          isHovered: r,
          isDimmed: s,
          children: a,
          startIcon: l,
          startIconAriaAttrs: c,
          showCaret: u,
          color: d,
          endIcon: m,
          endIconAriaAttrs: v,
          size: g,
          typography: y,
          iconOnly: f,
          statesWithoutBg: b,
          isActivated: w,
          ..._
        } = e
        return o.createElement(
          'button',
          {
            ..._,
            className: p({
              className: n,
              isSelected: i,
              isHovered: r,
              startIcon: l,
              showCaret: u,
              endIcon: m,
              color: d,
              size: g,
              typography: y,
              iconOnly: f,
              isDimmed: s,
              isActivated: w,
            }),
            ref: t,
          },
          o.createElement(
            h,
            {
              showCaret: u,
              startIcon: l,
              startIconAriaAttrs: { ...c },
              endIcon: m,
              endIconAriaAttrs: { ...v },
              statesWithoutBg: b,
            },
            a,
          ),
        )
      }
      n(21593)
      n(49406)
      var g = n(79418),
        y = n(53350),
        f = n(75725)
      class b extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._fullSessionScheduleViewModel =
              new y.FullSessionScheduleViewModel(e.source))
        }
        componentWillUnmount() {
          this._fullSessionScheduleViewModel.destroy()
        }
        render() {
          const {
            className: e,
            showAllDays: t,
            timeZoneClassName: n,
          } = this.props
          return this.props.source
            .marketStatusModel()
            ?.futuresContractExpirationTime()
            ?.expired()
            .value()
            ? null
            : o.createElement(f.FullSessionScheduleRenderer, {
                className: e,
                timezone: this._fullSessionScheduleViewModel.timezone(),
                now: this._fullSessionScheduleViewModel.currentTimeValue(),
                sessionDays: this._fullSessionScheduleViewModel.sessionsDays,
                showAllDays: t,
                timeZoneClassName: n,
              })
        }
      }
      var w = n(81348),
        _ = n(56616),
        x = n(90484),
        E = n(38780),
        S = n(83358)
      const C = (0, x.default)(I, 1500)
      function I() {
        document.removeEventListener('scroll', I),
          document.removeEventListener('touchstart', I),
          document.removeEventListener('mouseout', I),
          (0, E.hide)()
      }
      const A = 400
      function N(e, t = {}) {
        const {
          initialDelay: o = A,
          leaveOnMouseOut: i,
          withoutThumbsupIcon: r,
          text: a = s.t(null, void 0, n(23339)),
        } = t
        ;(0, E.showOnElement)(e, {
          below: !0,
          tooltipDelay: o,
          content: {
            type: 'html',
            data: `${a}${r ? '' : ` <span style="vertical-align: middle;">${S}</span>`}`,
          },
        }),
          document.addEventListener('scroll', I),
          document.addEventListener('touchstart', I),
          i || document.addEventListener('mouseout', I)
      }
      var B = n(16792),
        k = n(47531),
        V = n(68182),
        Z = n(92450),
        H = n(67330),
        T = n(97635)
      function M(e) {
        const { onClose: t, isOpened: r, groups: a, statusProvider: l } = e,
          [c, u] = (0, o.useState)(!1),
          d = (0, o.useRef)(null),
          m = (0, o.useRef)(null),
          p = c ? V : k
        return (
          (0, o.useEffect)(() => {
            null !== m.current && m.current()
          }, [c]),
          o.createElement(g.AdaptivePopupDialog, {
            ref: d,
            className: T.dialog,
            isOpened: r,
            title: s.t(null, void 0, n(17502)),
            onClose: t,
            onClickOutside: t,
            dataName: 'symbol-info-dialog',
            render: ({ requestResize: e }) => (
              (m.current = e),
              o.createElement(
                'div',
                { className: T.wrap, 'data-symbol-info-dialog-content': !0 },
                h(),
                a.flat().length &&
                  l &&
                  o.createElement('div', {
                    className: i(T.separator, T.widgetSeparator),
                  }),
                l &&
                  o.createElement(
                    o.Fragment,
                    null,
                    o.createElement(
                      'div',
                      { className: T.sessionHeader },
                      o.createElement(
                        'span',
                        { className: T.title },
                        s.t(null, void 0, n(94031)),
                      ),
                      o.createElement(
                        v,
                        {
                          onClick: () => u(!c),
                          color: 'light-gray',
                          size: 'small',
                          startIcon: p,
                        },
                        s.t(null, void 0, n(17606)),
                      ),
                    ),
                    o.createElement(b, {
                      source: l,
                      showAllDays: c,
                      className: T.sessionWidget,
                      timeZoneClassName: T.timeZone,
                    }),
                  ),
              )
            ),
            showSeparator: !0,
          })
        )
        function h() {
          return a
            ? a.map((e, t) =>
                e.length
                  ? o.createElement(
                      o.Fragment,
                      { key: t },
                      o.createElement(
                        'div',
                        { className: 0 === t ? T.firstGroup : void 0 },
                        ((e) => {
                          const t = []
                          for (let n = 0; n < e.length; n += 2)
                            t.push(e.slice(n, n + 2))
                          return t.map((e, t) =>
                            o.createElement(D, { key: t, fields: e }),
                          )
                        })(e),
                      ),
                      t !== a.length - 1 &&
                        o.createElement('div', {
                          className: i(T.separator, T.groupSeparator),
                        }),
                    )
                  : null,
              )
            : null
        }
      }
      function D(e) {
        return o.createElement(
          'div',
          { className: T.row },
          e.fields.map((e, t) => {
            const n = ((e) => {
              const t = e.value || e.defValue || '-'
              return !1 === e.capitalize || Array.isArray(t)
                ? t
                : (0, B.capitalizeFirstLetter)(t)
            })(e)
            return Array.isArray(n)
              ? o.createElement(G, { key: t, field: e, fieldValue: n })
              : o.createElement(L, { key: t, field: e, fieldValue: n })
          }),
        )
      }
      function G(e) {
        const { field: t, fieldValue: n } = e,
          i = (0, o.useMemo)(
            () =>
              n
                .map((e) => {
                  try {
                    return new URL(e)
                  } catch (e) {
                    return
                  }
                })
                .filter((e) => void 0 !== e),
            [n],
          ),
          [r, ...s] = i
        return o.createElement(
          'div',
          { className: T.item },
          o.createElement('span', { className: T.title }, t.title),
          o.createElement(
            'div',
            { className: T.multipleLinks },
            o.createElement(O, {
              value: U(r),
              startSlot: t.startSlot,
              endSlot: t.endSlot,
              canCopy: t.canCopy,
              link: n[0],
            }),
            s.length
              ? o.createElement(
                  ToolWidgetMenu,
                  {
                    className: T.menuButton,
                    arrow: !1,
                    closeOnClickOutside: !0,
                    horizontalAttachEdge: HorizontalAttachEdge.Right,
                    horizontalDropDirection:
                      HorizontalDropDirection.FromRightToLeft,
                    verticalAttachEdge: VerticalAttachEdge.AutoStrict,
                    content: o.createElement(a.Icon, { icon: dotsIcon }),
                  },
                  s.map((e) =>
                    o.createElement(PopupMenuItem, {
                      suppressToolboxClick: !1,
                      onClick: () => window.open(e.href),
                      label: U(e),
                      key: e.href,
                      toolbox: o.createElement(a.Icon, {
                        className: T.icon,
                        icon: H,
                      }),
                    }),
                  ),
                )
              : null,
          ),
        )
      }
      function U(e) {
        return e.hostname.replace(/^www\./g, '')
      }
      function L(e) {
        const { field: t, fieldValue: n } = e
        return o.createElement(
          'div',
          { className: T.item },
          o.createElement('span', { className: T.title }, t.title),
          o.createElement(O, {
            value: n,
            startSlot: t.startSlot,
            endSlot: t.endSlot,
            canCopy: t.canCopy,
            link: t.link,
          }),
        )
      }
      function O(e) {
        const { value: t, canCopy: r, link: l, startSlot: c, endSlot: u } = e,
          d = (0, o.useRef)(null),
          m = l ? 'a' : 'div',
          p = '-' !== t
        return o.createElement(
          'div',
          { className: T.valueItem },
          c && p && o.createElement('div', { className: T.startSlot }, c),
          o.createElement(
            m,
            { href: l, target: '_blank', className: i(l && T.link) },
            o.createElement('span', { ref: d }, t),
            l && o.createElement(a.Icon, { icon: H, className: T.icon }),
          ),
          r &&
            p &&
            o.createElement(w.ToolWidgetButton, {
              className: T.copyButton,
              onClick: async () => {
                await (0, _.copyToClipboard)({ text: t }),
                  d.current &&
                    (N(d.current, {
                      initialDelay: 0,
                      leaveOnMouseOut: !0,
                      text: s.t(null, void 0, n(17254)),
                    }),
                    C())
              },
              icon: Z,
            }),
          u && p && o.createElement('div', { className: T.endSlot }, u),
        )
      }
      var P = n(64147),
        R = n(90823),
        F = n(76742)
      const W = new P.WatchedValue(!1)
      class z {
        constructor(e) {
          ;(this._symbolInfo = new P.WatchedValue(null)),
            (this._quotesProvider = new F.QuotesProvider('simple')),
            (this._setSymbolInfo = (e) => {
              this._marketStatusModel.setSymbolInfo(e)
            }),
            (this._symbol = e.pro_name),
            this._quotesProvider.setQuotesSessionSymbol(this._symbol),
            this._symbolInfo.setValue(e),
            (this._marketStatusModel = new R.MarketStatusModel(
              this._quotesProvider,
            )),
            this._symbolInfo.subscribe(this._setSymbolInfo, {
              callWithLast: !0,
            })
        }
        destroy() {
          this._quotesProvider.destroy(),
            this._marketStatusModel.destroy(),
            this._symbolInfo.unsubscribe(this._setSymbolInfo)
        }
        symbol() {
          return new P.WatchedValue(this._symbol).readonly()
        }
        isSymbolInvalid() {
          return new P.WatchedValue(!1).readonly()
        }
        marketStatusModel() {
          return this._marketStatusModel
        }
        errorStatus() {
          return new P.WatchedValue(null).readonly()
        }
        symbolInfo() {
          return this._symbolInfo.readonly()
        }
        hidden() {
          return W.readonly()
        }
        dataProblemModel() {
          return null
        }
        dataUpdatedModeModel() {
          return null
        }
        async pineSourceCodeModel() {
          return null
        }
      }
      class Q {
        constructor(e) {
          this._adapter = new z(e)
        }
        destroy() {
          this._adapter.destroy()
        }
        getAdapter() {
          return this._adapter.marketStatusModel() ? this._adapter : null
        }
      }
      var X = n(4454),
        q = n(56570)
      function $(e, t) {
        const n = Math.floor(t / 1e4) % 1e4,
          o = (Math.floor(t / 100) % 100) - 1,
          i = t % 100
        return e.format(new Date(Date.UTC(n, o, i)))
      }
      var j = n(29562),
        K = n(17265)
      function Y(e) {
        return o.createElement(j.SymbolSearchFlag, { ...e, className: K.icon })
      }
      var J = n(68805),
        ee = n(50151),
        te = n(725),
        ne = n(74395)
      const oe = new Set(['cfd', 'etf', 'reit', 'etn', 'dr', 'cdi'])
      function ie(e, t) {
        return (e.minmove2 ?? 0) > 0 && !e.fractional && 0 !== e.pricescale
      }
      function re(e, t) {
        return ie(e) && void 0 !== e.pricescale
          ? new te.PriceFormatter({
              priceScale: e.pricescale / (0, ee.ensureDefined)(e.minmove2),
            }).format((0, ee.ensureDefined)(e.minmove2) / e.pricescale)
          : null
      }
      function se(e, t) {
        const { minmov: o, pricescale: i, fractional: r, minmove2: a } = e
        if (void 0 === o || void 0 === i) return null
        if (r && i && o)
          return a
            ? s.t(
                null,
                {
                  context: 'double fractional tick size',
                  replace: { minmove2: String(a), pricescale: String(i / a) },
                },
                n(13197),
              )
            : `${o}/${i}`
        const { variable_tick_size: l, ...c } = e
        return (0, J.createSeriesFormatter)(c, 'default').format(o / i)
      }
      function ae(e, t) {
        const { type: n = '', typespecs: o = [] } = e
        return [n, ...o.filter((e) => ne.VISIBLE_TYPESPECS.has(e))]
          .map((e) => (oe.has(e) ? e.toUpperCase() : e))
          .join(' ')
      }
      function le(e, t) {
        return !1
      }
      function ce(e, t) {
        return !0
      }
      function ue(e, t) {
        return 'expiration' in e
      }
      const de = new Set([
        'stock',
        'fund',
        'dr',
        'right',
        'warrant',
        'structured',
      ])
      var me = n(92315),
        pe = n(72041)
      function he(e) {
        const { className: t } = e
        return o.createElement(
          'span',
          { className: r()(t, pe.label) },
          o.createElement(a.Icon, { className: pe.icon, icon: me }),
          o.createElement(
            'span',
            { className: pe.text },
            s.t(null, void 0, n(54602)),
          ),
        )
      }
      var ve = n(88145)
      var ge = n(87896)
      let ye
      class fe {
        constructor() {
          ;(this._container = null),
            (this._rootInstance = null),
            (this._renderDialog = (e) => {
              this._container ||
                (this._container = document.createElement('div'))
              const t = o.createElement(M, { ...e })
              this._rootInstance
                ? this._rootInstance.render(t)
                : (this._rootInstance = (0, ge.createReactRoot)(
                    t,
                    this._container,
                  ))
            }),
            (this._close = () => {
              this._rootInstance?.unmount(), (this._rootInstance = null)
            }),
            (this._getVisibleURL = (e) => {
              try {
                return new URL(e).hostname.replace(/^www\./g, '')
              } catch (e) {
                return
              }
            })
        }
        async show(e) {
          const t = e.symbolInfo
          if (!t) return
          let i
          i = new Q(t)
          const r = ((e) => {
            const t = (0, q.enabled)('show_exchange_logos')
            return [
              {
                title: s.t(null, void 0, n(99709)),
                group: 1,
                propName: 'name',
                getEndSlot: (e) => {
                  if ((0, ve.isSymbolDelisted)(e.typespecs))
                    return o.createElement(he, null)
                },
              },
              {
                title: s.t(null, void 0, n(78734)),
                group: 1,
                propName: 'description',
              },
              {
                title: s.t(null, void 0, n(12272)),
                group: 1,
                propName: 'front_contract',
                visibility: le,
                canCopy: !0,
              },
              {
                title: s.t(null, void 0, n(99804)),
                group: 1,
                propName: 'sector',
                visibility: (e, t) => de.has(e.type ?? '') && !!t?.sector,
              },
              {
                title: s.t(null, void 0, n(7727)),
                group: 1,
                propName: 'industry',
                visibility: (e, t) => de.has(e.type ?? '') && !!t?.industry,
              },
              {
                title: s.t(null, void 0, n(88104)),
                group: 1,
                propName: 'isin-displayed',
                canCopy: !0,
                visibility: (e, t) => !1,
              },
              {
                title: s.t(null, void 0, n(56536)),
                group: 1,
                propName: 'figi',
                canCopy: !0,
                getter: (e, t) =>
                  e.figi && e.figi['exchange-level']
                    ? e.figi['exchange-level']
                    : null,
                visibility: (e, t) => !1,
              },
              {
                title: s.t(null, void 0, n(16045)),
                group: 1,
                propName: 'web_site_url',
                showURLAsValue: !0,
                capitalize: !1,
                visibility: (e, t) => 'stock' === e.type && !!t?.web_site_url,
              },
              {
                title: s.t(null, void 0, n(26931)),
                group: 1,
                propName: 'homepage',
                showURLAsValue: !0,
                capitalize: !1,
                visibility: (e, t) => 'fund' === e.type && !!t?.homepage,
              },
              {
                title: s.t(null, void 0, n(16045)),
                group: 1,
                propName: 'website',
                capitalize: !1,
                getter: (e, t) => (t?.website ? t?.website : null),
                visibility: (e, t) => !!t?.website?.length,
              },
              {
                title: s.t(null, void 0, n(98413)),
                group: 2,
                propName: 'type',
                getter: ae,
              },
              {
                title: s.t(null, void 0, n(88191)),
                group: 2,
                propName: 'expiration',
                visibility: ue,
                formatter: $.bind(null, e.dateFormatter),
              },
              {
                title: s.t(null, void 0, n(81314)),
                group: 2,
                propName: 'pointvalue',
              },
              {
                title: s.t(null, void 0, n(41224)),
                group: 2,
                propName: 'listed_exchange',
                visibility: ce,
                getStartSlot: (e, n) => {
                  const i = n?.country_code ?? e.country,
                    r = e.exchange_logo
                  return t
                    ? o.createElement(Y, {
                        country: i,
                        providerId: e.provider_id,
                        sourceId: r,
                      })
                    : void 0
                },
              },
              {
                title: s.t(null, void 0, n(86905)),
                group: 2,
                propName: 'exchange',
                visibility: ce,
              },
              {
                title: s.t(null, void 0, n(97751)),
                group: 2,
                propName: 'source',
                getter: J.getSourceForEconomySymbol,
                visibility: (e, t) =>
                  Boolean((0, J.getSourceForEconomySymbol)(e)),
              },
              {
                title: s.t(null, void 0, n(81849)),
                group: 2,
                propName: 'currency_code',
                getter: (e, t) => (0, J.symbolOriginalCurrency)(e, !0),
                visibility: (e, t) =>
                  Boolean((0, J.symbolOriginalCurrency)(e, !0)),
                formatter: (e) => e ?? '',
                defValue: '',
              },
              {
                title: s.t(null, void 0, n(91563)),
                group: 2,
                propName: 'value_unit_id',
                getter: (t, n) => e.unitDescription((0, J.measureUnitId)(t)),
                visibility: (t, n) =>
                  Boolean(
                    (0, J.measureUnitId)(t) &&
                      (0, J.isMeasureUnitSymbol)(t) &&
                      e.showUnit,
                  ),
                formatter: (e) => e ?? '',
                defValue: '',
              },
              {
                title: s.t(null, void 0, n(33564)),
                group: 2,
                propName: 'unit_id',
                getter: (t, n) =>
                  e.unitDescription((0, J.symbolOriginalUnit)(t, !!e.showUnit)),
                visibility: (t, n) =>
                  Boolean((0, J.symbolOriginalUnit)(t, !!e.showUnit)),
                formatter: (e) => e ?? '',
                defValue: '',
              },
              {
                title: s.t(null, void 0, n(39245)),
                group: 2,
                propName: 'pip_size',
                getter: re,
                visibility: ie,
              },
              {
                title: s.t(null, void 0, n(24431)),
                group: 2,
                propName: 'tick_size',
                getter: se,
              },
            ]
          })(e)
          ;(0, X.getAdditionalSymbolInfoFields)().forEach((e) => {
            r.push({ title: e.title, propName: e.propertyName, group: 3 })
          }),
            this._retrieveValues(r, t),
            this._renderDialog(this._createDialogProps(r, i))
        }
        static getInstance() {
          return ye || (ye = new fe()), ye
        }
        _createDialogProps(e, t) {
          return {
            isOpened: !0,
            onClose: () => {
              t?.destroy(), this._close()
            },
            groups: this._separateByGroups(e),
            statusProvider: t?.getAdapter(),
          }
        }
        _setURLs(e, t) {}
        _defaultFormatter(e) {
          return e?.toString() ?? '-'
        }
        _setFieldValue(e, t) {
          ;(void 0 === e.value || t) && (e.value = t)
        }
        _retrieveValues(e, t, n) {
          const o = n ?? t
          for (let i = 0; i < e.length; i++) {
            const r = e[i].getter,
              s = e[i].getStartSlot?.(t, n),
              a = e[i].getEndSlot?.(t, n)
            if ((s && (e[i].startSlot = s), a && (e[i].endSlot = a), r)) {
              const o = r(t, n)
              null !== o && this._setFieldValue(e[i], o)
              continue
            }
            const l = e[i].propName,
              c = l in o ? l : void 0
            if (void 0 !== c) {
              const t = o[c]
              this._setFieldValue(
                e[i],
                (e[i].formatter || this._defaultFormatter)(t),
              )
            }
          }
          this._removeHiddenFields(t, e, n)
        }
        _removeHiddenFields(e, t, n) {
          for (let o = 0; o < t.length; o++) {
            const i = t[o]
            void 0 === i.visibility ||
              i.visibility(e, n) ||
              (t.splice(o, 1), o--)
          }
        }
        _separateByGroups(e) {
          const t = {}
          return (
            e.forEach((e) => {
              const n = e.group
              t[n] || (t[n] = []), t[n].push(e)
            }),
            Object.values(t)
          )
        }
        async _getMarket(e) {
          return null
        }
      }
    },
    74395: (e, t, n) => {
      n.d(t, { VISIBLE_TYPESPECS: () => s, marketType: () => a })
      var o = n(11542)
      const i = new Map([
        ['cfd', o.t(null, void 0, n(79599))],
        ['dr', o.t(null, void 0, n(47268))],
        ['index', o.t(null, void 0, n(87464))],
        ['forex', o.t(null, void 0, n(17770))],
        ['right', o.t(null, { context: 'symbol_type' }, n(53174))],
        ['bond', o.t(null, void 0, n(42358))],
        ['bitcoin', o.t(null, void 0, n(46128))],
        ['crypto', o.t(null, void 0, n(46128))],
        ['economic', o.t(null, void 0, n(54094))],
        ['indices', o.t(null, void 0, n(90250))],
        ['futures', o.t(null, void 0, n(4723))],
        ['stock', o.t(null, void 0, n(76752))],
        ['commodity', o.t(null, void 0, n(70932))],
      ])
      n(21251)
      const r = new Map(),
        s = new Set([
          'cfd',
          'spreadbet',
          'defi',
          'yield',
          'government',
          'corporate',
          'mutual',
          'money',
          'etf',
          'unit',
          'trust',
          'reit',
          'etn',
          'convertible',
          'closedend',
          'crypto',
          'oracle',
        ])
      function a(e, t = [], n = !0) {
        const o = t.filter((e) => s.has(e)),
          a = `${e}_${o.sort().join('_')}`,
          l = r.get(a)
        if (void 0 !== l) return l
        const c = n ? ((e) => i.get(e) || e)(e) : e,
          u = Boolean(t.length) ? [c, ...o].join(' ') : c
        return r.set(a, u), u
      }
    },
    16792: (e, t, n) => {
      function o(e) {
        return e.charAt(0).toUpperCase() + e.substring(1)
      }
      n.d(t, { capitalizeFirstLetter: () => o })
    },
    2948: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M3.92 7.83 9 12.29l5.08-4.46-1-1.13L9 10.29l-4.09-3.6-.99 1.14Z"/></svg>'
    },
    47531: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="m4.67 7.38.66-.76L9 9.84l3.67-3.22.66.76L9 11.16 4.67 7.38Z"/></svg>'
    },
    68182: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="m4.67 10.62.66.76L9 8.16l3.67 3.22.66-.76L9 6.84l-4.33 3.78Z"/></svg>'
    },
    83358: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"><g clip-path="url(#clip0)"><path fill="#FFDB5E" d="M13.651 7.972c0-.168-.04-.325-.107-.468-.447-1.442-2.54-1.337-5.516-1.407-.498-.012-.213-.6-.038-1.89.113-.838-.428-2.127-1.337-2.127-1.5 0-.057 1.183-1.383 4.108-.708 1.562-2.291.687-2.291 2.257v3.573c0 .61.06 1.198.919 1.295.833.093.646.687 1.847.687h6.015a1.112 1.112 0 0 0 1.11-1.111c0-.254-.088-.486-.232-.673.34-.19.573-.55.573-.966a1.1 1.1 0 0 0-.232-.672c.341-.19.576-.55.576-.967 0-.303-.123-.578-.32-.779a1.105 1.105 0 0 0 .416-.86z"/><path fill="#EE9547" d="M9.673 9.083h2.867c.39 0 .757-.209.956-.544a.292.292 0 0 0-.502-.298.53.53 0 0 1-.454.259H9.604a.528.528 0 0 1 0-1.056h1.962a.292.292 0 0 0 0-.583H9.603a1.112 1.112 0 0 0-1.11 1.111c0 .342.158.644.4.848a1.107 1.107 0 0 0-.332.791c0 .343.16.646.404.85a1.105 1.105 0 0 0 .14 1.693 1.102 1.102 0 0 0 .042 1.52c.208.208.49.325.785.326h1.828a1.117 1.117 0 0 0 .956-.544.292.292 0 0 0-.502-.298.531.531 0 0 1-.454.258H9.932a.528.528 0 0 1 0-1.055H12.1a1.117 1.117 0 0 0 .956-.544.292.292 0 1 0-.501-.298.526.526 0 0 1-.454.259H9.745a.529.529 0 0 1 0-1.056h2.697a1.116 1.116 0 0 0 .956-.544.292.292 0 0 0-.501-.298.525.525 0 0 1-.455.259h-2.77a.529.529 0 0 1 0-1.056z"/></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h12v12H0z" transform="translate(2 2)"/></clipPath></defs></svg>'
    },
    67330: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M4.5 3C3.67 3 3 3.67 3 4.5v9c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5V10h-1v3.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-9c0-.28.22-.5.5-.5H8V3H4.5ZM11 4h2.3L9.14 8.15l.7.7L14 4.71V7h1V3h-4v1Z"/></svg>'
    },
    92450: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M6.5 2C5.67 2 5 2.67 5 3.5v8c0 .83.67 1.5 1.5 1.5h8c.83 0 1.5-.67 1.5-1.5v-8c0-.83-.67-1.5-1.5-1.5h-8ZM6 3.5c0-.28.22-.5.5-.5h8c.28 0 .5.22.5.5v8a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-8Zm-3 3c0-.28.22-.5.5-.5H4V5h-.5C2.67 5 2 5.67 2 6.5v8c0 .83.67 1.5 1.5 1.5h8c.83 0 1.5-.67 1.5-1.5V14h-1v.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-8Z"/></svg>'
    },
    55698: (e, t, n) => {
      n.d(t, { nanoid: () => o })
      const o = (e = 21) =>
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
