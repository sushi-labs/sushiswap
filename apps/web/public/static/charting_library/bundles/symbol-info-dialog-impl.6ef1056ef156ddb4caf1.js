;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9374],
  {
    5849: (e, t, r) => {
      r.d(t, { default: () => a })
      const a = (e) => {
        for (var t = -1, r = null == e ? 0 : e.length, a = {}; ++t < r; ) {
          var o = e[t]
          a[o[0]] = o[1]
        }
        return a
      }
    },
    81702: (e, t, r) => {
      r.d(t, { default: () => a })
      const a = (e) => (e && e.length ? e[0] : void 0)
    },
    50041: (e) => {
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
    88803: (e) => {
      e.exports = {
        'tablet-normal-breakpoint': 'screen and (max-width: 768px)',
        'small-height-breakpoint': 'screen and (max-height: 360px)',
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
      }
    },
    33172: (e) => {
      e.exports = { icon: 'icon-OJpk_CAQ' }
    },
    17946: (e, t, r) => {
      r.d(t, { CustomBehaviourContext: () => a })
      const a = (0, r(50959).createContext)({ enableActiveStateStyles: !0 })
      a.displayName = 'CustomBehaviourContext'
    },
    36383: (e, t, r) => {
      r.d(t, { useOutsideEvent: () => i })
      var a = r(50959),
        o = r(27267)
      function i(e) {
        const {
            click: t,
            mouseDown: r,
            touchEnd: i,
            touchStart: n,
            handler: s,
            reference: l,
            ownerDocument: c = document,
          } = e,
          d = (0, a.useRef)(null),
          u = (0, a.useRef)(new CustomEvent('timestamp').timeStamp)
        return (
          (0, a.useLayoutEffect)(() => {
            const e = { click: t, mouseDown: r, touchEnd: i, touchStart: n },
              a = l ? l.current : d.current
            return (0, o.addOutsideEventListener)(u.current, a, s, c, e)
          }, [t, r, i, n, s]),
          l || d
        )
      }
    },
    9745: (e, t, r) => {
      r.d(t, { Icon: () => o })
      var a = r(50959)
      const o = a.forwardRef((e, t) => {
        const { icon: r = '', ...o } = e
        return a.createElement('span', {
          ...o,
          ref: t,
          dangerouslySetInnerHTML: { __html: r },
        })
      })
    },
    99663: (e, t, r) => {
      r.d(t, { Slot: () => o, SlotContext: () => i })
      var a = r(50959)
      class o extends a.Component {
        shouldComponentUpdate() {
          return !1
        }
        render() {
          return a.createElement('div', {
            style: {
              position: 'fixed',
              zIndex: 150,
              left: 0,
              top: 0,
            },
            ref: this.props.reference,
          })
        }
      }
      const i = a.createContext(null)
    },
    90186: (e, t, r) => {
      function a(e) {
        return i(e, n)
      }
      function o(e) {
        return i(e, s)
      }
      function i(e, t) {
        const r = Object.entries(e).filter(t),
          a = {}
        for (const [e, t] of r) a[e] = t
        return a
      }
      function n(e) {
        const [t, r] = e
        return 0 === t.indexOf('data-') && 'string' == typeof r
      }
      function s(e) {
        return 0 === e[0].indexOf('aria-')
      }
      r.d(t, {
        filterAriaProps: () => o,
        filterDataProps: () => a,
        filterProps: () => i,
        isAriaAttribute: () => s,
        isDataAttribute: () => n,
      })
    },
    67961: (e, t, r) => {
      r.d(t, { OverlapManager: () => i, getRootOverlapManager: () => s })
      var a = r(50151)
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
      class i {
        constructor(e = document) {
          ;(this._storage = new o()),
            (this._windows = new Map()),
            (this._index = 0),
            (this._document = e),
            (this._container = e.createDocumentFragment())
        }
        setContainer(e) {
          const t = this._container,
            r = null === e ? this._document.createDocumentFragment() : e
          !((e, t) => {
            Array.from(e.childNodes).forEach((e) => {
              e.nodeType === Node.ELEMENT_NODE && t.appendChild(e)
            })
          })(t, r),
            (this._container = r)
        }
        registerWindow(e) {
          this._storage.has(e) || this._storage.add(e)
        }
        ensureWindow(e, t = { position: 'fixed', direction: 'normal' }) {
          const r = this._windows.get(e)
          if (void 0 !== r) return r
          this.registerWindow(e)
          const a = this._document.createElement('div')
          if (
            ((a.style.position = t.position),
            (a.style.zIndex = this._index.toString()),
            (a.dataset.id = e),
            void 0 !== t.index)
          ) {
            const e = this._container.childNodes.length
            if (t.index >= e) this._container.appendChild(a)
            else if (t.index <= 0)
              this._container.insertBefore(a, this._container.firstChild)
            else {
              const e = this._container.childNodes[t.index]
              this._container.insertBefore(a, e)
            }
          } else
            'reverse' === t.direction
              ? this._container.insertBefore(a, this._container.firstChild)
              : this._container.appendChild(a)
          return this._windows.set(e, a), ++this._index, a
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
      const n = new WeakMap()
      function s(e = document) {
        const t = e.getElementById('overlap-manager-root')
        if (null !== t) return (0, a.ensureDefined)(n.get(t))
        {
          const t = new i(e),
            r = ((e) => {
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
          return n.set(r, t), t.setContainer(r), e.body.appendChild(r), t
        }
      }
    },
    99054: (e, t, r) => {
      r.d(t, { setFixedBodyState: () => c })
      const a = (() => {
        let e
        return () => {
          var t
          if (void 0 === e) {
            const r = document.createElement('div'),
              a = r.style
            ;(a.visibility = 'hidden'),
              (a.width = '100px'),
              (a.msOverflowStyle = 'scrollbar'),
              document.body.appendChild(r)
            const o = r.offsetWidth
            r.style.overflow = 'scroll'
            const i = document.createElement('div')
            ;(i.style.width = '100%'), r.appendChild(i)
            const n = i.offsetWidth
            null === (t = r.parentNode) || void 0 === t || t.removeChild(r),
              (e = o - n)
          }
          return e
        }
      })()
      function o(e, t, r) {
        null !== e && e.style.setProperty(t, r)
      }
      function i(e, t) {
        return getComputedStyle(e, null).getPropertyValue(t)
      }
      function n(e, t) {
        return Number.parseInt(i(e, t))
      }
      let s = 0,
        l = !1
      function c(e) {
        const { body: t } = document,
          r = t.querySelector('.widgetbar-wrap')
        if (e && 1 == ++s) {
          const e = i(t, 'overflow'),
            s = n(t, 'padding-right')
          'hidden' !== e.toLowerCase() &&
            t.scrollHeight > t.offsetHeight &&
            (o(r, 'right', `${a()}px`),
            (t.style.paddingRight = `${s + a()}px`),
            (l = !0)),
            t.classList.add('i-no-scroll')
        } else if (
          !e &&
          s > 0 &&
          0 == --s &&
          (t.classList.remove('i-no-scroll'), l)
        ) {
          o(r, 'right', '0px')
          let e = 0
          0,
            t.scrollHeight <= t.clientHeight && (e -= a()),
            (t.style.paddingRight = (e < 0 ? 0 : e) + 'px'),
            (l = !1)
        }
      }
    },
    24437: (e, t, r) => {
      r.d(t, { DialogBreakpoints: () => o })
      var a = r(88803)
      const o = {
        SmallHeight: a['small-height-breakpoint'],
        TabletSmall: a['tablet-small-breakpoint'],
        TabletNormal: a['tablet-normal-breakpoint'],
      }
    },
    29562: (e, t, r) => {
      r.d(t, { SymbolSearchFlag: () => v })
      var a = r(50959),
        o = r(97754),
        i = r.n(o),
        n = r(24633),
        s = r(36279)
      const l = r.p + 'mock-dark.16b5f3a431f502b03ae3.svg',
        c = r.p + 'mock-light.d201313017eb2c1b989f.svg'
      function d(e) {
        return e === n.StdTheme.Dark ? l : c
      }
      var u = r(77975),
        h = r(45345),
        p = r(50151)
      const m = s.LogoSize.Medium
      var _ = r(33172)
      function v(e) {
        const { country: t, providerId: r, sourceId: o, className: n } = e,
          l = (0, u.useWatchedValueReadonly)({ watchedValue: h.watchedTheme }),
          [c, v] = (0, a.useState)(
            (({ country: e, providerId: t, sourceId: r }) => {
              const a = (0, s.getLogoUrlResolver)()
              return (o) => {
                const i = (e) => a.getProviderLogoUrl(e, m),
                  n = [
                    { value: r, resolve: i },
                    {
                      value: e,
                      resolve: (e) => a.getCountryFlagUrl(e.toUpperCase(), m),
                    },
                    { value: t, resolve: i },
                  ].find(({ value: e }) => void 0 !== e && e.length > 0)
                return void 0 !== n
                  ? n.resolve((0, p.ensureDefined)(n.value))
                  : d(o)
              }
            })({ country: t, providerId: r, sourceId: o })(l),
          )
        return a.createElement('img', {
          className: i()(n, _.icon),
          crossOrigin: '',
          src: c,
          onError: () => {
            v(d(l))
          },
        })
      }
    },
    90692: (e, t, r) => {
      r.d(t, { MatchMedia: () => o })
      var a = r(50959)
      class o extends a.PureComponent {
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
    42842: (e, t, r) => {
      r.d(t, { Portal: () => l, PortalContext: () => c })
      var a = r(50959),
        o = r(962),
        i = r(25931),
        n = r(67961),
        s = r(99663)
      class l extends a.PureComponent {
        constructor() {
          super(...arguments), (this._uuid = (0, i.nanoid)())
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
            o.createPortal(
              a.createElement(c.Provider, { value: this }, this.props.children),
              e,
            )
          )
        }
        moveToTop() {
          this._manager().moveToTop(this._uuid)
        }
        _manager() {
          return null === this.context
            ? (0, n.getRootOverlapManager)()
            : this.context
        }
      }
      l.contextType = s.SlotContext
      const c = a.createContext(null)
    },
    93317: (e) => {
      e.exports = {
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
        dialog: 'dialog-mBXAEZtB',
        wrap: 'wrap-mBXAEZtB',
        separator: 'separator-mBXAEZtB',
        groupSeparator: 'groupSeparator-mBXAEZtB',
        widgetSeparator: 'widgetSeparator-mBXAEZtB',
        firstGroup: 'firstGroup-mBXAEZtB',
        row: 'row-mBXAEZtB',
        item: 'item-mBXAEZtB',
        title: 'title-mBXAEZtB',
        valueItem: 'valueItem-mBXAEZtB',
        copyButton: 'copyButton-mBXAEZtB',
        sessionHeader: 'sessionHeader-mBXAEZtB',
        sessionWidget: 'sessionWidget-mBXAEZtB',
        timeZone: 'timeZone-mBXAEZtB',
        link: 'link-mBXAEZtB',
        icon: 'icon-mBXAEZtB',
        startSlot: 'startSlot-mBXAEZtB',
      }
    },
    78029: (e) => {
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
    76856: (e) => {
      e.exports = { icon: 'icon-mwO_HX5L' }
    },
    31409: (e, t, r) => {
      r.d(t, {
        DEFAULT_TOOL_WIDGET_BUTTON_THEME: () => s,
        ToolWidgetButton: () => l,
      })
      var a = r(50959),
        o = r(97754),
        i = r(9745),
        n = r(78029)
      const s = n,
        l = a.forwardRef((e, t) => {
          const {
              tag: r = 'div',
              icon: s,
              endIcon: l,
              isActive: c,
              isOpened: d,
              isDisabled: u,
              isGrouped: h,
              isHovered: p,
              isClicked: m,
              onClick: _,
              text: v,
              textBeforeIcon: f,
              title: g,
              theme: S = n,
              className: y,
              forceInteractive: b,
              inactive: k,
              'data-name': I,
              'data-tooltip': x,
              ...M
            } = e,
            T = o(y, S.button, (g || x) && 'apply-common-tooltip', {
              [S.isActive]: c,
              [S.isOpened]: d,
              [S.isInteractive]: (b || Boolean(_)) && !u && !k,
              [S.isDisabled]: Boolean(u || k),
              [S.isGrouped]: h,
              [S.hover]: p,
              [S.clicked]: m,
            }),
            z =
              s &&
              ('string' == typeof s
                ? a.createElement(i.Icon, { className: S.icon, icon: s })
                : a.cloneElement(s, {
                    className: o(S.icon, s.props.className),
                  }))
          return 'button' === r
            ? a.createElement(
                'button',
                {
                  ...M,
                  ref: t,
                  type: 'button',
                  className: o(T, S.accessible),
                  disabled: u && !k,
                  onClick: _,
                  title: g,
                  'data-name': I,
                  'data-tooltip': x,
                },
                f &&
                  v &&
                  a.createElement(
                    'div',
                    { className: o('js-button-text', S.text) },
                    v,
                  ),
                z,
                !f &&
                  v &&
                  a.createElement(
                    'div',
                    { className: o('js-button-text', S.text) },
                    v,
                  ),
              )
            : a.createElement(
                'div',
                {
                  ...M,
                  ref: t,
                  'data-role': 'button',
                  className: T,
                  onClick: u ? void 0 : _,
                  title: g,
                  'data-name': I,
                  'data-tooltip': x,
                },
                f &&
                  v &&
                  a.createElement(
                    'div',
                    { className: o('js-button-text', S.text) },
                    v,
                  ),
                z,
                !f &&
                  v &&
                  a.createElement(
                    'div',
                    { className: o('js-button-text', S.text) },
                    v,
                  ),
                l && a.createElement(i.Icon, { icon: l, className: n.endIcon }),
              )
        })
    },
    63065: (e, t, r) => {
      r.r(t), r.d(t, { SymbolInfoDialogImpl: () => ue })
      var a = r(962),
        o = r(50959),
        i = r(97754),
        n = r(11542),
        s = r(9745),
        l = r(17946),
        c = r(2948),
        d = r(50041),
        u = r.n(d)
      const h = {
          small: 'regular14px',
          medium: 'semibold16px',
          large: 'semibold18px',
        },
        p = (e) => {
          const t = (0, o.useContext)(l.CustomBehaviourContext),
            {
              className: r,
              isSelected: a,
              isDimmed: n,
              isHovered: s,
              size: c = 'medium',
              color: d,
              startIcon: p,
              endIcon: m,
              showCaret: _,
              enableActiveStateStyles: v = t.enableActiveStateStyles,
              typography: f,
              iconOnly: g,
              isLink: S = !1,
              isActivated: y,
            } = e
          return i(
            r,
            u()['text-button'],
            S && u().link,
            a && u().selected,
            n && u().dimmed,
            s && u().hovered,
            u()[`text-button-${d}-${c}`],
            p && u()['with-start-icon'],
            g && u()['icon-only'],
            (_ || m) && u()['with-end-icon'],
            !v && u()['disable-active-state-styles'],
            f ? u()[`typography-${f}`] : u()[`typography-${h[c]}`],
            y && u().activated,
          )
        }
      function m(e) {
        return o.createElement(
          o.Fragment,
          null,
          o.createElement('span', {
            className: i(
              u().background,
              e.statesWithoutBg && u()['states-without-bg'],
            ),
          }),
          e.startIcon &&
            o.createElement(s.Icon, {
              ...e.startIconAriaAttrs,
              className: u()['start-icon'],
              icon: e.startIcon,
            }),
          o.createElement('span', { className: u().content }, e.children),
          (e.endIcon || e.showCaret) &&
            ((e) =>
              o.createElement(s.Icon, {
                ...(e.showCaret ? void 0 : e.endIconAriaAttrs),
                className: i(u()['end-icon'], e.showCaret && u().caret),
                icon: e.showCaret ? c : e.endIcon,
              }))(e),
        )
      }
      function _(e) {
        const {
          reference: t,
          className: r,
          isSelected: a,
          isHovered: i,
          isDimmed: n,
          children: s,
          startIcon: l,
          startIconAriaAttrs: c,
          showCaret: d,
          color: u,
          endIcon: h,
          endIconAriaAttrs: _,
          size: v,
          typography: f,
          iconOnly: g,
          statesWithoutBg: S,
          isActivated: y,
          ...b
        } = e
        return o.createElement(
          'button',
          {
            ...b,
            className: p({
              className: r,
              isSelected: a,
              isHovered: i,
              startIcon: l,
              showCaret: d,
              endIcon: h,
              color: u,
              size: v,
              typography: f,
              iconOnly: g,
              isDimmed: n,
              isActivated: y,
            }),
            ref: t,
          },
          o.createElement(
            m,
            {
              showCaret: d,
              startIcon: l,
              startIconAriaAttrs: { ...c },
              endIcon: h,
              endIconAriaAttrs: { ..._ },
              statesWithoutBg: S,
            },
            s,
          ),
        )
      }
      r(21593)
      var v = r(35057),
        f = r(76413),
        g = r(34392)
      class S extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._fullSessionScheduleViewModel =
              new f.FullSessionScheduleViewModel(e.source))
        }
        componentWillUnmount() {
          this._fullSessionScheduleViewModel.destroy()
        }
        render() {
          var e, t
          const {
            className: r,
            showAllDays: a,
            timeZoneClassName: i,
          } = this.props
          return (
            null ===
              (t =
                null === (e = this.props.source.marketStatusModel()) ||
                void 0 === e
                  ? void 0
                  : e.futuresContractExpirationTime()) || void 0 === t
              ? void 0
              : t.expired().value()
          )
            ? null
            : o.createElement(g.FullSessionScheduleRenderer, {
                className: r,
                timezone: this._fullSessionScheduleViewModel.timezone(),
                now: this._fullSessionScheduleViewModel.currentTimeValue(),
                sessionDays: this._fullSessionScheduleViewModel.sessionsDays,
                showAllDays: a,
                timeZoneClassName: i,
              })
        }
      }
      var y = r(31409),
        b = r(65446),
        k = r(12481),
        I = r(38780),
        x = r(83358)
      const M = (0, k.default)(T, 1500)
      function T() {
        document.removeEventListener('scroll', T),
          document.removeEventListener('touchstart', T),
          document.removeEventListener('mouseout', T),
          (0, I.hide)()
      }
      const z = 400
      function N(e, t = {}) {
        const {
          initialDelay: a = z,
          leaveOnMouseOut: o,
          text: i = n.t(null, void 0, r(79732)),
        } = t
        ;(0, I.showOnElement)(e, {
          below: !0,
          tooltipDelay: a,
          content: {
            type: 'html',
            data: `${i} <span style="vertical-align: middle;">${x}</span>`,
          },
        }),
          document.addEventListener('scroll', T),
          document.addEventListener('touchstart', T),
          o || document.addEventListener('mouseout', T)
      }
      var L = r(47531),
        E = r(68182),
        D = r(92450),
        w = r(67330),
        C = r(93317)
      function H(e) {
        const { onClose: t, isOpened: a, groups: s, statusProvider: l } = e,
          [c, d] = (0, o.useState)(!1),
          u = (0, o.useRef)(null),
          h = (0, o.useRef)(null),
          p = c ? E : L
        return (
          (0, o.useEffect)(() => {
            null !== h.current && h.current()
          }, [c]),
          o.createElement(v.AdaptivePopupDialog, {
            ref: u,
            className: C.dialog,
            isOpened: a,
            title: n.t(null, void 0, r(12014)),
            onClose: t,
            onClickOutside: t,
            dataName: 'symbol-info-dialog',
            render: ({ requestResize: e }) => (
              (h.current = e),
              o.createElement(
                'div',
                { className: C.wrap, 'data-symbol-info-dialog-content': !0 },
                m(),
                s.flat().length &&
                  l &&
                  o.createElement('div', {
                    className: i(C.separator, C.widgetSeparator),
                  }),
                l &&
                  o.createElement(
                    o.Fragment,
                    null,
                    o.createElement(
                      'div',
                      { className: C.sessionHeader },
                      o.createElement(
                        'span',
                        { className: C.title },
                        n.t(null, void 0, r(25866)),
                      ),
                      o.createElement(
                        _,
                        {
                          onClick: () => d(!c),
                          color: 'light-gray',
                          size: 'small',
                          startIcon: p,
                        },
                        n.t(null, void 0, r(50923)),
                      ),
                    ),
                    o.createElement(S, {
                      source: l,
                      showAllDays: c,
                      className: C.sessionWidget,
                      timeZoneClassName: C.timeZone,
                    }),
                  ),
              )
            ),
            showSeparator: !0,
          })
        )
        function m() {
          return s
            ? s.map((e, t) =>
                e.length
                  ? o.createElement(
                      o.Fragment,
                      { key: t },
                      o.createElement(
                        'div',
                        { className: 0 === t ? C.firstGroup : void 0 },
                        ((e) => {
                          const t = []
                          for (let r = 0; r < e.length; r += 2)
                            t.push(e.slice(r, r + 2))
                          return t.map((e, t) =>
                            o.createElement(U, { key: t, fields: e }),
                          )
                        })(e),
                      ),
                      t !== s.length - 1 &&
                        o.createElement('div', {
                          className: i(C.separator, C.groupSeparator),
                        }),
                    )
                  : null,
              )
            : null
        }
      }
      function W(e) {
        return (
          (t = e.value || e.defValue || '-').charAt(0).toUpperCase() +
          t.substring(1)
        )
        var t
      }
      function U(e) {
        return o.createElement(
          'div',
          { className: C.row },
          e.fields.map((e, t) => o.createElement(P, { key: t, field: e })),
        )
      }
      function P(e) {
        const { field: t } = e
        return o.createElement(
          'div',
          { className: C.item },
          o.createElement('span', { className: C.title }, t.title),
          o.createElement(A, {
            value: W(t),
            startSlot: t.startSlot,
            canCopy: t.canCopy,
            link: t.link,
          }),
        )
      }
      function A(e) {
        const { value: t, canCopy: a, link: l, startSlot: c } = e,
          d = (0, o.useRef)(null),
          u = l ? 'a' : 'div',
          h = '-' !== t
        return o.createElement(
          'div',
          { className: C.valueItem },
          c && h && o.createElement('div', { className: C.startSlot }, c),
          o.createElement(
            u,
            { href: l, target: '_blank', className: i(l && C.link) },
            o.createElement('span', { ref: d }, t),
            l && o.createElement(s.Icon, { icon: w, className: C.icon }),
          ),
          a &&
            h &&
            o.createElement(y.ToolWidgetButton, {
              className: C.copyButton,
              onClick: async () => {
                await (0, b.copyToClipboard)({ text: t }),
                  d.current &&
                    (N(d.current, {
                      initialDelay: 0,
                      leaveOnMouseOut: !0,
                      text: n.t(null, void 0, r(82833)),
                    }),
                    M())
              },
              icon: D,
            }),
        )
      }
      var B = r(97145),
        j = r(10585),
        F = r(71625)
      const V = new B.WatchedValue(!1)
      class Y {
        constructor(e) {
          ;(this._symbolInfo = new B.WatchedValue(null)),
            (this._quotesProvider = new F.QuotesProvider('simple')),
            (this._setSymbolInfo = (e) => {
              this._marketStatusModel.setSymbolInfo(e)
            }),
            (this._symbol = e.pro_name),
            this._quotesProvider.setQuotesSessionSymbol(this._symbol),
            this._symbolInfo.setValue(e),
            (this._marketStatusModel = new j.MarketStatusModel(
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
          return new B.WatchedValue(this._symbol).readonly()
        }
        isSymbolInvalid() {
          return new B.WatchedValue(!1).readonly()
        }
        marketStatusModel() {
          return this._marketStatusModel
        }
        errorStatus() {
          return new B.WatchedValue(null).readonly()
        }
        symbolInfo() {
          return this._symbolInfo.readonly()
        }
        hidden() {
          return V.readonly()
        }
        dataProblemModel() {
          return null
        }
        dataUpdatedModeModel() {
          return null
        }
      }
      class Z {
        constructor(e) {
          this._adapter = new Y(e)
        }
        destroy() {
          this._adapter.destroy()
        }
        getAdapter() {
          return this._adapter.marketStatusModel() ? this._adapter : null
        }
      }
      var G = r(97304),
        O = r(14483)
      function J(e, t) {
        const r = Math.floor(t / 1e4) % 1e4,
          a = (Math.floor(t / 100) % 100) - 1,
          o = t % 100
        return e.format(new Date(Date.UTC(r, a, o)))
      }
      var R = r(29562),
        Q = r(76856)
      function K(e) {
        return o.createElement(R.SymbolSearchFlag, { ...e, className: Q.icon })
      }
      var X = r(42960),
        q = r(71766),
        $ = r(50151),
        ee = r(24658)
      const te = new Set(['cfd', 'etf', 'reit', 'etn', 'dr', 'cdi'])
      function re(e) {
        var t
        return (
          (null !== (t = e.minmove2) && void 0 !== t ? t : 0) > 0 &&
          !e.fractional &&
          0 !== e.pricescale
        )
      }
      function ae(e) {
        return re(e) && void 0 !== e.pricescale
          ? new q.PriceFormatter(
              e.pricescale / (0, $.ensureDefined)(e.minmove2),
            ).format((0, $.ensureDefined)(e.minmove2) / e.pricescale)
          : null
      }
      function oe(e) {
        const { minmov: t, pricescale: a, fractional: o, minmove2: i } = e
        if (void 0 === t || void 0 === a) return null
        if (o && a && t)
          return i
            ? n.t(
                null,
                {
                  context: 'double fractional tick size',
                  replace: { minmove2: String(i), pricescale: String(a / i) },
                },
                r(72653),
              )
            : `${t}/${a}`
        const { variable_tick_size: s, ...l } = e
        return (0, X.createSeriesFormatter)(l, 'default').format(t / a)
      }
      function ie(e) {
        const { type: t = '', typespecs: r = [] } = e
        return [t, ...r.filter((e) => ee.VISIBLE_TYPESPECS.has(e))]
          .map((e) => (te.has(e) ? e.toUpperCase() : e))
          .join(' ')
      }
      function ne(e) {
        return !1
      }
      function se(e) {
        return !0
      }
      function le(e) {
        return 'expiration' in e
      }
      const ce = new Set([
        'stock',
        'fund',
        'dr',
        'right',
        'warrant',
        'structured',
      ])
      let de
      class ue {
        constructor() {
          ;(this._container = null),
            (this._renderDialog = (e) => {
              this._container ||
                (this._container = document.createElement('div')),
                a.render(o.createElement(H, { ...e }), this._container)
            }),
            (this._close = () => {
              this._container && a.unmountComponentAtNode(this._container)
            })
        }
        async show(e) {
          const t = e.symbolInfo
          if (!t) return
          let a
          a = new Z(t)
          const i = ((e) => {
            const t = (0, O.enabled)('show_exchange_logos')
            return [
              {
                title: n.t(null, void 0, r(3297)),
                group: 1,
                propName: (0, O.enabled)('charting_library_base')
                  ? 'name'
                  : 'pro_name',
              },
              {
                title: n.t(null, void 0, r(29601)),
                group: 1,
                propName: 'description',
              },
              {
                title: n.t(null, void 0, r(22992)),
                group: 1,
                propName: 'front_contract',
                visibility: ne,
                canCopy: !0,
              },
              {
                title: n.t(null, void 0, r(31672)),
                group: 1,
                propName: 'sector',
                visibility: (e) => {
                  var t
                  return ce.has(null !== (t = e.type) && void 0 !== t ? t : '')
                },
              },
              {
                title: n.t(null, void 0, r(91746)),
                group: 1,
                propName: 'industry',
                visibility: (e) => {
                  var t
                  return ce.has(null !== (t = e.type) && void 0 !== t ? t : '')
                },
              },
              {
                title: n.t(null, void 0, r(54465)),
                group: 1,
                propName: 'isin',
                canCopy: !0,
                visibility: (e) => !1,
              },
              {
                title: n.t(null, void 0, r(58416)),
                group: 2,
                propName: 'type',
                getter: ie,
              },
              {
                title: n.t(null, void 0, r(49263)),
                group: 2,
                propName: 'expiration',
                visibility: le,
                formatter: J.bind(null, e.dateFormatter),
              },
              {
                title: n.t(null, void 0, r(64659)),
                group: 2,
                propName: 'pointvalue',
              },
              {
                title: n.t(null, void 0, r(91617)),
                group: 2,
                propName: 'listed_exchange',
                visibility: se,
                getStartSlot: (e, r) => {
                  var a
                  const i =
                      null !== (a = null == r ? void 0 : r.country_code) &&
                      void 0 !== a
                        ? a
                        : e.country,
                    n = e.exchange_logo
                  return t
                    ? o.createElement(K, {
                        country: i,
                        providerId: e.provider_id,
                        sourceId: n,
                      })
                    : void 0
                },
              },
              {
                title: n.t(null, void 0, r(77295)),
                group: 2,
                propName: 'exchange',
                visibility: se,
              },
              {
                title: n.t(null, void 0, r(46147)),
                group: 2,
                propName: 'source',
                getter: X.getSourceForEconomySymbol,
                visibility: (e) => Boolean((0, X.getSourceForEconomySymbol)(e)),
              },
              {
                title: n.t(null, void 0, r(50985)),
                group: 2,
                propName: 'currency_code',
                getter: (e) => (0, X.symbolOriginalCurrency)(e, !0),
                visibility: (e) =>
                  Boolean((0, X.symbolOriginalCurrency)(e, !0)),
                formatter: (e) => (null != e ? e : ''),
                defValue: '',
              },
              {
                title: n.t(null, void 0, r(59607)),
                group: 2,
                propName: 'value_unit_id',
                getter: (t) => e.unitDescription((0, X.measureUnitId)(t)),
                visibility: (t) =>
                  Boolean(
                    (0, X.measureUnitId)(t) &&
                      (0, X.isMeasureUnitSymbol)(t) &&
                      e.showUnit,
                  ),
                formatter: (e) => (null != e ? e : ''),
                defValue: '',
              },
              {
                title: n.t(null, void 0, r(77534)),
                group: 2,
                propName: 'unit_id',
                getter: (t) =>
                  e.unitDescription((0, X.symbolOriginalUnit)(t, !!e.showUnit)),
                visibility: (t) =>
                  Boolean((0, X.symbolOriginalUnit)(t, !!e.showUnit)),
                formatter: (e) => (null != e ? e : ''),
                defValue: '',
              },
              {
                title: n.t(null, void 0, r(45221)),
                group: 2,
                propName: 'pip_size',
                getter: ae,
                visibility: re,
              },
              {
                title: n.t(null, void 0, r(55209)),
                group: 2,
                propName: 'tick_size',
                getter: oe,
              },
            ]
          })(e)
          ;(0, G.getAdditionalSymbolInfoFields)().forEach((e) => {
            i.push({ title: e.title, propName: e.propertyName, group: 3 })
          }),
            this._retrieveValues(i, t)
          const s = {
            isOpened: !0,
            onClose: () => {
              null == a || a.destroy(), this._close()
            },
            groups: this._separateByGroups(i),
            statusProvider: null == a ? void 0 : a.getAdapter(),
          }
          this._renderDialog(s)
        }
        static getInstance() {
          return de || (de = new ue()), de
        }
        _setSectorIndustry(e, t) {}
        _defaultFormatter(e) {
          var t
          return null !== (t = null == e ? void 0 : e.toString()) &&
            void 0 !== t
            ? t
            : '-'
        }
        _setFieldValue(e, t) {
          ;(void 0 === e.value || t) && (e.value = t)
        }
        _retrieveValues(e, t, r) {
          var a, o
          const i = null != r ? r : t
          for (let n = 0; n < e.length; n++) {
            const s = e[n].getter,
              l =
                null === (o = (a = e[n]).getStartSlot) || void 0 === o
                  ? void 0
                  : o.call(a, t, r)
            if ((l && (e[n].startSlot = l), s)) {
              const t = s(i)
              null !== t && this._setFieldValue(e[n], t)
              continue
            }
            const c = e[n].propName,
              d = c in i ? c : void 0
            if (void 0 !== d) {
              const t = i[d]
              this._setFieldValue(
                e[n],
                (e[n].formatter || this._defaultFormatter)(t),
              )
            }
          }
          this._removeHiddenFields(i, e)
        }
        _removeHiddenFields(e, t) {
          for (let r = 0; r < t.length; r++) {
            const a = t[r]
            void 0 === a.visibility || a.visibility(e) || (t.splice(r, 1), r--)
          }
        }
        _separateByGroups(e) {
          const t = {}
          return (
            e.forEach((e) => {
              const r = e.group
              t[r] || (t[r] = []), t[r].push(e)
            }),
            Object.values(t)
          )
        }
        async _getMarket(e) {
          return null
        }
      }
    },
    24658: (e, t, r) => {
      r.d(t, { VISIBLE_TYPESPECS: () => n, marketType: () => s })
      var a = r(11542)
      const o = new Map([
        ['cfd', a.t(null, void 0, r(87592))],
        ['dr', a.t(null, void 0, r(67245))],
        ['index', a.t(null, void 0, r(12754))],
        ['forex', a.t(null, void 0, r(39512))],
        ['right', a.t(null, { context: 'symbol_type' }, r(9898))],
        ['bond', a.t(null, void 0, r(79852))],
        ['bitcoin', a.t(null, void 0, r(8448))],
        ['crypto', a.t(null, void 0, r(8448))],
        ['economic', a.t(null, void 0, r(88720))],
        ['indices', a.t(null, void 0, r(60804))],
        ['futures', a.t(null, void 0, r(81859))],
        ['stock', a.t(null, void 0, r(36931))],
        ['commodity', a.t(null, void 0, r(12629))],
      ])
      r(42053)
      const i = new Map(),
        n = new Set([
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
      function s(e, t = [], r = !0) {
        const a = t.filter((e) => n.has(e)),
          s = `${e}_${a.sort().join('_')}`,
          l = i.get(s)
        if (void 0 !== l) return l
        const c = r ? ((e) => o.get(e) || e)(e) : e,
          d = Boolean(t.length) ? [c, ...a].join(' ') : c
        return i.set(s, d), d
      }
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
    25931: (e, t, r) => {
      r.d(t, { nanoid: () => a })
      const a = (e = 21) =>
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
    72653: (e) => {
      e.exports = {
        ar: ['1/{minmove2} من 1/{pricescale}'],
        ca_ES: '1/{minmove2} of 1/{pricescale}',
        cs: '1/{minmove2} of 1/{pricescale}',
        de: ['1/{minmove2} von 1/{pricescale}'],
        el: '1/{minmove2} of 1/{pricescale}',
        en: '1/{minmove2} of 1/{pricescale}',
        es: ['1/{minmove2} de 1/{pricescale}'],
        fa: '1/{minmove2} of 1/{pricescale}',
        fr: ['1/{minmove2} de 1/{pricescale}'],
        he_IL: ['1/{minmove2} מתוך 1/{pricescale}'],
        hu_HU: '1/{minmove2} of 1/{pricescale}',
        id_ID: ['1/{minmove2} dari 1/{pricescale}'],
        it: ['1/{minmove2} di 1/{pricescale}'],
        ja: ['1/{pricescale}に対して1/{minmove2}'],
        ko: ['1/{pricescale} 의 1/{minmove2}'],
        ms_MY: ['1/{minmove2} untuk 1/{pricescale}'],
        nl_NL: '1/{minmove2} of 1/{pricescale}',
        pl: ['1/{minmove2} z 1/{pricescale}'],
        pt: ['1/{minmove2} de 1/{pricescale}'],
        ro: '1/{minmove2} of 1/{pricescale}',
        ru: ['1/{minmove2} от 1/{pricescale}'],
        sv: ['1/{minmove2} av 1/{pricescale}'],
        th: '1/{minmove2} of 1/{pricescale}',
        tr: ["1/{pricescale}'in 1/{minmove2}'si"],
        vi: ['1/{minmove2} trong số 1/{pricescale}'],
        zh: ['1/{pricescale}的1/{minmove2}'],
        zh_TW: ['1/{pricescale}的1/{minmove2}'],
      }
    },
    19801: (e) => {
      e.exports = {
        ar: ['الجمعة'],
        ca_ES: ['Dv'],
        cs: 'Fr',
        de: 'Fr',
        el: 'Fr',
        en: 'Fr',
        es: ['V'],
        fa: 'Fr',
        fr: ['Ven'],
        he_IL: ['שישי'],
        hu_HU: ['P'],
        id_ID: ['Jum'],
        it: ['Ven'],
        ja: ['金'],
        ko: ['금'],
        ms_MY: 'Fr',
        nl_NL: 'Fr',
        pl: ['Pt'],
        pt: ['Sexta'],
        ro: 'Fr',
        ru: ['Пт'],
        sv: 'Fr',
        th: 'Fr',
        tr: ['Cum'],
        vi: 'Fr',
        zh: ['周五'],
        zh_TW: ['周五'],
      }
    },
    11268: (e) => {
      e.exports = {
        ar: ['الاثنين'],
        ca_ES: ['Dl'],
        cs: 'Mo',
        de: 'Mo',
        el: 'Mo',
        en: 'Mo',
        es: ['L'],
        fa: 'Mo',
        fr: 'Mo',
        he_IL: ['שני'],
        hu_HU: ['H'],
        id_ID: ['Sen'],
        it: ['Lun'],
        ja: ['月'],
        ko: ['월'],
        ms_MY: 'Mo',
        nl_NL: 'Mo',
        pl: ['Pn'],
        pt: ['Seg'],
        ro: 'Mo',
        ru: ['Пн'],
        sv: 'Mo',
        th: ['โม'],
        tr: ['Pzt'],
        vi: 'Mo',
        zh: ['周一'],
        zh_TW: ['周一'],
      }
    },
    63331: (e) => {
      e.exports = {
        ar: ['السبت'],
        ca_ES: ['Ds'],
        cs: 'Sa',
        de: 'Sa',
        el: 'Sa',
        en: 'Sa',
        es: ['Sáb'],
        fa: 'Sa',
        fr: 'Sa',
        he_IL: ['שבת'],
        hu_HU: ['Szo'],
        id_ID: ['Sab'],
        it: ['Sab'],
        ja: ['土'],
        ko: ['토'],
        ms_MY: 'Sa',
        nl_NL: 'Sa',
        pl: ['Sob.'],
        pt: ['Sáb.'],
        ro: 'Sa',
        ru: ['Сб'],
        sv: 'Sa',
        th: 'Sa',
        tr: ['Cmt'],
        vi: 'Sa',
        zh: ['周六'],
        zh_TW: ['周六'],
      }
    },
    85954: (e) => {
      e.exports = {
        ar: ['الأحد'],
        ca_ES: ['Dg'],
        cs: 'Su',
        de: 'Su',
        el: 'Su',
        en: 'Su',
        es: ['Do'],
        fa: 'Su',
        fr: 'Su',
        he_IL: ['ראשון'],
        hu_HU: ['V'],
        id_ID: ['Min'],
        it: ['Dom'],
        ja: ['日'],
        ko: ['일'],
        ms_MY: 'Su',
        nl_NL: 'Su',
        pl: ['Nd.'],
        pt: ['Dom'],
        ro: 'Su',
        ru: ['Вс'],
        sv: 'Su',
        th: 'Su',
        tr: ['Paz'],
        vi: 'Su',
        zh: ['周日'],
        zh_TW: ['周日'],
      }
    },
    26230: (e) => {
      e.exports = {
        ar: ['الأربعاء'],
        ca_ES: ['Dc'],
        cs: 'We',
        de: 'We',
        el: 'We',
        en: 'We',
        es: ['X'],
        fa: 'We',
        fr: 'We',
        he_IL: 'We',
        hu_HU: ['Sze'],
        id_ID: ['Rab'],
        it: ['Mer'],
        ja: ['水'],
        ko: ['수'],
        ms_MY: 'We',
        nl_NL: 'We',
        pl: ['Śr'],
        pt: ['Quarta'],
        ro: 'We',
        ru: ['Ср'],
        sv: 'We',
        th: ['วันพุธ'],
        tr: ['Çar'],
        vi: ['T4'],
        zh: ['周三'],
        zh_TW: ['周三'],
      }
    },
    24793: (e) => {
      e.exports = {
        ar: ['الخميس'],
        ca_ES: ['Dj'],
        cs: 'Th',
        de: 'Th',
        el: 'Th',
        en: 'Th',
        es: ['Ju'],
        fa: 'Th',
        fr: 'Th',
        he_IL: ['חמישי'],
        hu_HU: ['Cs'],
        id_ID: ['Kam'],
        it: ['Gio'],
        ja: ['木'],
        ko: ['목'],
        ms_MY: 'Th',
        nl_NL: 'Th',
        pl: ['Czw.'],
        pt: ['Quinta'],
        ro: 'Th',
        ru: ['Чт'],
        sv: 'Th',
        th: 'Th',
        tr: ['Per'],
        vi: 'Th',
        zh: ['周四'],
        zh_TW: ['周四'],
      }
    },
    31533: (e) => {
      e.exports = {
        ar: ['الثلاثاء'],
        ca_ES: ['Ma'],
        cs: 'Tu',
        de: 'Tu',
        el: 'Tu',
        en: 'Tu',
        es: ['Ma'],
        fa: 'Tu',
        fr: 'Tu',
        he_IL: ['שלישי'],
        hu_HU: ['K'],
        id_ID: ['Sel'],
        it: ['Mar'],
        ja: ['火'],
        ko: ['화'],
        ms_MY: 'Tu',
        nl_NL: 'Tu',
        pl: ['Wt'],
        pt: ['Terça'],
        ro: 'Tu',
        ru: ['Вт'],
        sv: 'Tu',
        th: 'Tu',
        tr: ['Sal'],
        vi: ['Thứ 3'],
        zh: ['周二'],
        zh_TW: ['周二'],
      }
    },
    9898: (e) => {
      e.exports = {
        ar: ['حق'],
        ca_ES: ['Right (dret de subscripció)'],
        cs: 'Right',
        de: ['Rechter'],
        el: 'Right',
        en: 'Right',
        es: ['Right (derecho de suscripción)'],
        fa: 'Right',
        fr: ['De droite'],
        he_IL: ['זכות Right'],
        hu_HU: 'Right',
        id_ID: ['Kanan'],
        it: ['Diritto'],
        ja: ['ストックオプション'],
        ko: ['라이트'],
        ms_MY: ['Benar'],
        nl_NL: 'Right',
        pl: ['Prawo do udostępniania'],
        pt: ['Direita'],
        ro: 'Right',
        ru: ['Право на акцию'],
        sv: ['Höger'],
        th: ['สิทธิ'],
        tr: ['Sağ'],
        vi: ['Phải'],
        zh: ['认股权'],
        zh_TW: ['認股權'],
      }
    },
    80395: (e) => {
      e.exports = {
        ar: ['إغلاق القائمة'],
        ca_ES: 'Close menu',
        cs: 'Close menu',
        de: ['Menü schließen'],
        el: 'Close menu',
        en: 'Close menu',
        es: ['Cerrar menú'],
        fa: 'Close menu',
        fr: ['Fermer le menu'],
        he_IL: ['סגור תפריט'],
        hu_HU: 'Close menu',
        id_ID: ['Pilih menu'],
        it: ['Chiudere menù'],
        ja: ['メニューを閉じる'],
        ko: ['메뉴 닫기'],
        ms_MY: ['Tutup menu'],
        nl_NL: 'Close menu',
        pl: ['Zamknij menu'],
        pt: ['Fechar menu'],
        ro: 'Close menu',
        ru: ['Закрыть меню'],
        sv: ['Stäng menyn'],
        th: ['ปิดเมนู'],
        tr: ['Menüyü kapat'],
        vi: ['Đóng menu'],
        zh: ['关闭菜单'],
        zh_TW: ['關閉選單'],
      }
    },
    50985: (e) => {
      e.exports = {
        ar: ['عملة'],
        ca_ES: ['Divisa'],
        cs: ['Měna'],
        de: ['Währung'],
        el: 'Currency',
        en: 'Currency',
        es: ['Divisa'],
        fa: 'Currency',
        fr: ['Devise'],
        he_IL: ['מַטְבֵּעַ'],
        hu_HU: ['Valuta'],
        id_ID: ['Mata Uang'],
        it: ['Valuta'],
        ja: ['通貨'],
        ko: ['통화'],
        ms_MY: ['Mata wang'],
        nl_NL: 'Currency',
        pl: ['Waluta'],
        pt: ['Moeda'],
        ro: 'Currency',
        ru: ['Валюта'],
        sv: ['Valuta'],
        th: ['สกุลเงิน'],
        tr: ['Döviz'],
        vi: ['Tiền tệ'],
        zh: ['货币'],
        zh_TW: ['貨幣'],
      }
    },
    22992: (e) => {
      e.exports = {
        ar: ['العقد الحالي'],
        ca_ES: ['Contracte vigent'],
        cs: ['Current Contract'],
        de: ['Aktueller Kontrakt'],
        el: ['Current Contract'],
        en: 'Current contract',
        es: ['Contrato vigente'],
        fa: ['Current Contract'],
        fr: ['Contrat en cours'],
        he_IL: ['החוזה הנוכחי'],
        hu_HU: ['Current Contract'],
        id_ID: ['Kontrak Saat Ini'],
        it: ['Contratto corrente'],
        ja: ['当限'],
        ko: ['커런트 컨트랙트'],
        ms_MY: ['Kontrak Semasa'],
        nl_NL: ['Current Contract'],
        pl: ['Aktualny kontrakt'],
        pt: ['Contrato atual'],
        ro: ['Current Contract'],
        ru: ['Текущий контракт'],
        sv: ['Nuvarande kontrakt'],
        th: ['สัญญาปัจจุบัน'],
        tr: ['Mevcut Sözleşme'],
        vi: ['Hợp đồng hiện tại'],
        zh: ['当前合约'],
        zh_TW: ['Current Contract'],
      }
    },
    50923: (e) => {
      e.exports = {
        ar: 'All sessions',
        ca_ES: 'All sessions',
        cs: 'All sessions',
        de: ['Alle Sitzungen'],
        el: 'All sessions',
        en: 'All sessions',
        es: ['Todas las sesiones'],
        fa: 'All sessions',
        fr: ['Toutes les sessions'],
        he_IL: ['כל הסשנים'],
        hu_HU: 'All sessions',
        id_ID: ['Seluruh sesi'],
        it: ['Tutte le sessioni'],
        ja: ['全セッション'],
        ko: ['모든 세션'],
        ms_MY: ['Semua sesi'],
        nl_NL: 'All sessions',
        pl: ['Wszystkie sesje'],
        pt: ['Todas as sessões'],
        ro: 'All sessions',
        ru: ['Все сессии'],
        sv: 'All sessions',
        th: 'All sessions',
        tr: ['Tüm oturumlar'],
        vi: ['Tất cả các phiên'],
        zh: ['所有会话'],
        zh_TW: ['所有交易時段'],
      }
    },
    97637: (e) => {
      e.exports = {
        ar: ['أبريل'],
        ca_ES: ['Abril'],
        cs: 'April',
        de: 'April',
        el: 'April',
        en: 'April',
        es: ['Abril'],
        fa: ['آوریل'],
        fr: ['Avril'],
        he_IL: ['‏אפריל'],
        hu_HU: ['Április'],
        id_ID: 'April',
        it: ['Aprile'],
        ja: ['4月'],
        ko: ['4월'],
        ms_MY: 'April',
        nl_NL: 'April',
        pl: ['Kwiecień'],
        pt: ['Abril'],
        ro: 'April',
        ru: ['Апрель'],
        sv: 'April',
        th: ['เมษายน'],
        tr: ['Nisan'],
        vi: ['Tháng Tư'],
        zh: ['4月'],
        zh_TW: ['四月'],
      }
    },
    86797: (e) => {
      e.exports = {
        ar: ['أغسطس'],
        ca_ES: ['Agost'],
        cs: 'August',
        de: 'August',
        el: 'August',
        en: 'August',
        es: ['Agosto'],
        fa: ['آگوست'],
        fr: ['Août'],
        he_IL: ['‏אוגוסט'],
        hu_HU: ['Augusztus'],
        id_ID: ['Agustus'],
        it: ['Agosto'],
        ja: ['8月'],
        ko: ['8월'],
        ms_MY: ['Ogos'],
        nl_NL: 'August',
        pl: ['Sierpień'],
        pt: ['Agosto'],
        ro: 'August',
        ru: ['Август'],
        sv: ['Augusti'],
        th: ['สิงหาคม'],
        tr: ['Ağustos'],
        vi: ['Tháng Tám'],
        zh: ['8月'],
        zh_TW: ['八月'],
      }
    },
    79852: (e) => {
      e.exports = {
        ar: ['سند'],
        ca_ES: ['Bo'],
        cs: 'Bond',
        de: ['Anleihe'],
        el: 'Bond',
        en: 'Bond',
        es: ['Bono'],
        fa: 'Bond',
        fr: ['Obligation'],
        he_IL: ['אגרת חוב'],
        hu_HU: 'Bond',
        id_ID: ['Surat hutang'],
        it: ['Obbligazione'],
        ja: ['債券'],
        ko: ['채권'],
        ms_MY: ['Bon'],
        nl_NL: 'Bond',
        pl: ['Obligacja'],
        pt: ['Título'],
        ro: 'Bond',
        ru: ['Облигации'],
        sv: ['Obligation'],
        th: ['พันธบัตร'],
        tr: ['Tahvil'],
        vi: ['Trái phiếu'],
        zh: ['债券'],
        zh_TW: ['債券'],
      }
    },
    55669: (e) => {
      e.exports = {
        ar: ['ديسمبر'],
        ca_ES: ['Desembre'],
        cs: 'December',
        de: ['Dezember'],
        el: 'December',
        en: 'December',
        es: ['Diciembre'],
        fa: ['دسامبر'],
        fr: ['Décembre'],
        he_IL: ['דצמבר‏'],
        hu_HU: 'December',
        id_ID: ['Desember'],
        it: ['Dicembre'],
        ja: ['12月'],
        ko: ['12월'],
        ms_MY: ['Disember'],
        nl_NL: 'December',
        pl: ['Grudzień'],
        pt: ['Dezembro'],
        ro: 'December',
        ru: ['Декабрь'],
        sv: 'December',
        th: ['ธันวาคม'],
        tr: ['Aralık'],
        vi: ['Tháng Mười hai'],
        zh: ['12月'],
        zh_TW: ['十二月'],
      }
    },
    29601: (e) => {
      e.exports = {
        ar: ['الوصف'],
        ca_ES: ['Descripció'],
        cs: ['Popis'],
        de: ['Beschreibung'],
        el: 'Description',
        en: 'Description',
        es: ['Descripción'],
        fa: ['شرح'],
        fr: 'Description',
        he_IL: ['תיאור'],
        hu_HU: ['Leírás'],
        id_ID: ['Deskripsi'],
        it: ['Descrizione'],
        ja: ['詳細'],
        ko: ['설명'],
        ms_MY: ['Huraian'],
        nl_NL: ['Beschrijving'],
        pl: ['Opis'],
        pt: ['Descrição'],
        ro: 'Description',
        ru: ['Описание'],
        sv: ['Beskrivning'],
        th: ['คำอธิบาย'],
        tr: ['Açıklama'],
        vi: ['Mô tả'],
        zh: ['描述'],
        zh_TW: ['描述'],
      }
    },
    80227: (e) => {
      e.exports = {
        ar: ['المنطقة الزمنية للبورصة'],
        ca_ES: ['Zona horària del mercat de valors'],
        cs: 'Exchange timezone',
        de: ['Zeitzone wechseln'],
        el: 'Exchange timezone',
        en: 'Exchange timezone',
        es: ['Zona horaria del mercado de valores'],
        fa: 'Exchange timezone',
        fr: ['Fuseau horaire de la bourse'],
        he_IL: ['אזור זמן של הבורסה'],
        hu_HU: 'Exchange timezone',
        id_ID: ['Zona waktu bursa'],
        it: ['Fusorario di riferimento'],
        ja: ['取引所のタイムゾーン'],
        ko: ['거래소 시간대'],
        ms_MY: ['Zon masa bursa'],
        nl_NL: 'Exchange timezone',
        pl: ['Strefa czasowa giełdy'],
        pt: ['Fuso horário da Bolsa'],
        ro: 'Exchange timezone',
        ru: ['Часовой пояс биржи'],
        sv: ['Börsens tidszon'],
        th: ['เขตเวลาตลาดหลักทรัพย์'],
        tr: ['Borsa saat dilimi'],
        vi: ['Múi giờ giao dịch'],
        zh: ['交易所时区'],
        zh_TW: ['交易所時區'],
      }
    },
    49263: (e) => {
      e.exports = {
        ar: ['تاريخ انتهاء الصلاحية'],
        ca_ES: ['Data de caducitat'],
        cs: 'Expiration date',
        de: ['Ablaufdatum'],
        el: 'Expiration date',
        en: 'Expiration date',
        es: ['Fecha de vencimiento'],
        fa: 'Expiration date',
        fr: ["Date d'expiration"],
        he_IL: ['תאריך תפוגה'],
        hu_HU: 'Expiration date',
        id_ID: ['Tanggal kadaluarsa'],
        it: ['Data di scadenza'],
        ja: ['有効期限'],
        ko: ['만기 날짜'],
        ms_MY: ['Tarikh tamat tempoh'],
        nl_NL: 'Expiration date',
        pl: ['Data ważności'],
        pt: ['Data de expiração'],
        ro: 'Expiration date',
        ru: ['Истечение срока'],
        sv: ['Utgångsdatum'],
        th: ['วันหมดอายุ'],
        tr: ['Son kullanma tarihi'],
        vi: ['Ngày hết hạn'],
        zh: ['到期日'],
        zh_TW: ['到期日'],
      }
    },
    16467: (e) => {
      e.exports = {
        ar: ['فبراير'],
        ca_ES: ['Febrer'],
        cs: 'February',
        de: ['Februar'],
        el: 'February',
        en: 'February',
        es: ['Febrero'],
        fa: 'February',
        fr: ['Février'],
        he_IL: ['פברואר‏'],
        hu_HU: ['Február'],
        id_ID: ['Februari'],
        it: ['Febbraio'],
        ja: ['2月'],
        ko: ['2월'],
        ms_MY: ['Februari'],
        nl_NL: 'February',
        pl: ['Luty'],
        pt: ['Fevereiro'],
        ro: 'February',
        ru: ['Февраль'],
        sv: ['Februari'],
        th: ['กุมภาพันธ์'],
        tr: ['Şubat'],
        vi: ['Tháng Hai'],
        zh: ['2月'],
        zh_TW: ['二月'],
      }
    },
    564: (e) => {
      e.exports = {
        ar: ['الجمعة'],
        ca_ES: ['Dv'],
        cs: 'Fri',
        de: ['Fr'],
        el: 'Fri',
        en: 'Fri',
        es: ['Vi'],
        fa: 'Fri',
        fr: ['Ven'],
        he_IL: ['שישי'],
        hu_HU: ['Pén'],
        id_ID: ['Jum'],
        it: ['Ven'],
        ja: ['金'],
        ko: ['금'],
        ms_MY: ['Jum'],
        nl_NL: 'Fri',
        pl: ['Pt'],
        pt: ['Sexta'],
        ro: 'Fri',
        ru: ['Пт'],
        sv: ['Fre'],
        th: ['ศุกร์'],
        tr: ['Cum'],
        vi: ['Thứ 6'],
        zh: ['周五'],
        zh_TW: ['周五'],
      }
    },
    72970: (e) => {
      e.exports = {
        ar: ['الجمعة'],
        ca_ES: ['Divendres'],
        cs: 'Friday',
        de: ['Freitag'],
        el: 'Friday',
        en: 'Friday',
        es: ['Viernes'],
        fa: 'Friday',
        fr: ['Vendredi'],
        he_IL: ['יום שישי'],
        hu_HU: ['Péntek'],
        id_ID: ['Jumat'],
        it: ['Venerdì'],
        ja: ['金曜日'],
        ko: ['금요일'],
        ms_MY: ['Jumaat'],
        nl_NL: 'Friday',
        pl: ['Piątek'],
        pt: ['Sexta'],
        ro: 'Friday',
        ru: ['Пятница'],
        sv: ['Fredag'],
        th: ['วันศุกร์'],
        tr: ['Cuma'],
        vi: ['Thứ Sáu'],
        zh: ['周五'],
        zh_TW: ['周五'],
      }
    },
    54465: (e) => {
      e.exports = {
        ar: 'ISIN',
        ca_ES: 'ISIN',
        cs: 'ISIN',
        de: 'ISIN',
        el: 'ISIN',
        en: 'ISIN',
        es: 'ISIN',
        fa: 'ISIN',
        fr: 'ISIN',
        he_IL: ['Isin'],
        hu_HU: 'ISIN',
        id_ID: 'ISIN',
        it: 'ISIN',
        ja: 'ISIN',
        ko: 'ISIN',
        ms_MY: 'ISIN',
        nl_NL: 'ISIN',
        pl: 'ISIN',
        pt: 'ISIN',
        ro: 'ISIN',
        ru: ['Код ISIN'],
        sv: 'ISIN',
        th: 'ISIN',
        tr: 'ISIN',
        vi: 'ISIN',
        zh: 'ISIN',
        zh_TW: 'ISIN',
      }
    },
    91746: (e) => {
      e.exports = {
        ar: ['صناعة'],
        ca_ES: ['Indústria'],
        cs: 'Industry',
        de: ['Branche'],
        el: 'Industry',
        en: 'Industry',
        es: ['Industria'],
        fa: ['صنعت'],
        fr: ['Industrie'],
        he_IL: ['תעשיה'],
        hu_HU: ['Iparág'],
        id_ID: ['Industri'],
        it: ['Industria'],
        ja: ['業種'],
        ko: ['산업'],
        ms_MY: ['Industri'],
        nl_NL: 'Industry',
        pl: ['Branża'],
        pt: ['Indústria'],
        ro: 'Industry',
        ru: ['Отрасль'],
        sv: ['Bransch'],
        th: ['อุตสาหกรรม'],
        tr: ['Endüstri'],
        vi: ['Công nghiệp'],
        zh: ['行业'],
        zh_TW: ['產業'],
      }
    },
    26910: (e) => {
      e.exports = {
        ar: ['يناير'],
        ca_ES: ['Gener'],
        cs: 'January',
        de: ['Januar'],
        el: 'January',
        en: 'January',
        es: ['Enero'],
        fa: 'January',
        fr: ['Janvier'],
        he_IL: ['ינואר‏'],
        hu_HU: ['Január'],
        id_ID: ['Januari'],
        it: ['Gennaio'],
        ja: ['1月'],
        ko: ['1월'],
        ms_MY: ['Januari'],
        nl_NL: 'January',
        pl: ['Styczeń'],
        pt: ['Janeiro'],
        ro: 'January',
        ru: ['Январь'],
        sv: ['Januari'],
        th: ['มกราคม'],
        tr: ['Ocak'],
        vi: ['Tháng Một'],
        zh: ['1月'],
        zh_TW: ['一月'],
      }
    },
    23230: (e) => {
      e.exports = {
        ar: ['يوليو'],
        ca_ES: ['Juliol'],
        cs: 'July',
        de: ['Juli'],
        el: 'July',
        en: 'July',
        es: ['Julio'],
        fa: 'July',
        fr: ['Juillet'],
        he_IL: ['יולי‏'],
        hu_HU: ['Július'],
        id_ID: ['Juli'],
        it: ['Luglio'],
        ja: ['7月'],
        ko: ['7월'],
        ms_MY: ['Julai'],
        nl_NL: 'July',
        pl: ['Lipiec'],
        pt: ['Julho'],
        ro: 'July',
        ru: ['Июль'],
        sv: ['Juli'],
        th: ['กรกฎาคม'],
        tr: ['Temmuz'],
        vi: ['Tháng Bảy'],
        zh: ['7月'],
        zh_TW: ['七月'],
      }
    },
    49385: (e) => {
      e.exports = {
        ar: ['يونيو'],
        ca_ES: ['Juny'],
        cs: 'June',
        de: ['Juni'],
        el: 'June',
        en: 'June',
        es: ['Junio'],
        fa: 'June',
        fr: ['Juin'],
        he_IL: ['יוני‏'],
        hu_HU: ['Június'],
        id_ID: ['Juni'],
        it: ['Giugno'],
        ja: ['6月'],
        ko: ['6월'],
        ms_MY: ['Jun'],
        nl_NL: 'June',
        pl: ['Czerwiec'],
        pt: ['Junho'],
        ro: 'June',
        ru: ['Июнь'],
        sv: ['Juni'],
        th: ['มิถุนายน'],
        tr: ['Haziran'],
        vi: ['Tháng Sáu'],
        zh: ['6月'],
        zh_TW: ['六月'],
      }
    },
    90784: (e) => {
      e.exports = {
        ar: ['أكتوبر'],
        ca_ES: ['Octubre'],
        cs: 'October',
        de: 'October',
        el: 'October',
        en: 'October',
        es: ['Octubre'],
        fa: 'October',
        fr: ['Octobre'],
        he_IL: ['אוקטובר‏'],
        hu_HU: ['Október'],
        id_ID: ['Oktober'],
        it: ['Ottobre'],
        ja: ['10月'],
        ko: ['10월'],
        ms_MY: ['Oktober'],
        nl_NL: 'October',
        pl: ['Październik'],
        pt: ['Outubro'],
        ro: 'October',
        ru: ['Октябрь'],
        sv: ['Oktober'],
        th: ['ตุลาคม'],
        tr: ['Ekim'],
        vi: ['Tháng Mười'],
        zh: ['10月'],
        zh_TW: ['十月'],
      }
    },
    79732: (e) => {
      e.exports = {
        ar: ['تم نسخ الرابط إلى الحافظة'],
        ca_ES: ['Enllaç copiat al porta-retalls'],
        cs: 'Link copied to clipboard',
        de: ['Link in Zwischenablage kopiert'],
        el: 'Link copied to clipboard',
        en: 'Link copied to clipboard',
        es: ['Enlace copiado al portapapeles'],
        fa: 'Link copied to clipboard',
        fr: ['Lien copié dans le presse-papier'],
        he_IL: ['הקישור הועתק ללוח'],
        hu_HU: 'Link copied to clipboard',
        id_ID: ['Tautan disalin ke papan klip'],
        it: ['Link copiato'],
        ja: ['リンクがクリップボードにコピーされました'],
        ko: ['클립보드에 링크 카피되었음'],
        ms_MY: ['Pautan disalin kepada papan keratan'],
        nl_NL: 'Link copied to clipboard',
        pl: ['Link skopiowany do schowka'],
        pt: ['Link copiado para a área de transferência'],
        ro: 'Link copied to clipboard',
        ru: ['Ссылка скопирована в буфер'],
        sv: ['Länken har kopierats till Urklipp'],
        th: ['ลิงค์ถูกก็อปปี้ไปยังคลิปบอร์ด'],
        tr: ['Bağlantı panoya kopyalandı'],
        vi: ['Liên kết được sao chép vào bộ nhớ tạm'],
        zh: ['链接复制到剪贴板'],
        zh_TW: ['鏈接複製到剪貼簿'],
      }
    },
    91617: (e) => {
      e.exports = {
        ar: ['البورصة المدرجة'],
        ca_ES: ['Mercat cotitzat'],
        cs: ['Listed Exchange'],
        de: ['Gelistete Börse'],
        el: ['Listed Exchange'],
        en: 'Listed exchange',
        es: ['Mercado cotizado'],
        fa: ['Listed Exchange'],
        fr: ['Bourse agréée'],
        he_IL: ['בורסה רשומה'],
        hu_HU: ['Listázott Tőzsde'],
        id_ID: ['Bursa Terdaftar'],
        it: ['Quotato in borsa'],
        ja: ['上場取引所'],
        ko: ['상장 거래소'],
        ms_MY: ['Bursa Tersenarai'],
        nl_NL: ['Listed Exchange'],
        pl: ['Wymieniona Giełda'],
        pt: ['Bolsa listada'],
        ro: ['Listed Exchange'],
        ru: ['Зарегистрирован'],
        sv: ['Listad börs'],
        th: ['รายการตลาดหลักทรัพย์'],
        tr: ['Kayıtlı Borsa'],
        vi: ['Giao dịch đã thống kê'],
        zh: ['上市交易所'],
        zh_TW: ['列表交易所'],
      }
    },
    83085: (e) => {
      e.exports = {
        ar: ['يوم الاثنين'],
        ca_ES: ['Dl'],
        cs: 'Mon',
        de: 'Mon',
        el: 'Mon',
        en: 'Mon',
        es: ['Lu'],
        fa: 'Mon',
        fr: ['Lun'],
        he_IL: ['שני'],
        hu_HU: ['Hét'],
        id_ID: ['Sen'],
        it: ['Lun'],
        ja: ['月'],
        ko: ['월'],
        ms_MY: ['Isnin'],
        nl_NL: 'Mon',
        pl: ['Pon'],
        pt: ['Seg'],
        ro: 'Mon',
        ru: ['Пн'],
        sv: ['Mån'],
        th: ['จันทร์'],
        tr: ['Pzt'],
        vi: ['Thứ 2'],
        zh: ['周一'],
        zh_TW: ['周一'],
      }
    },
    61199: (e) => {
      e.exports = {
        ar: ['الاثنين'],
        ca_ES: ['Dilluns'],
        cs: 'Monday',
        de: ['Montag'],
        el: 'Monday',
        en: 'Monday',
        es: ['Lunes'],
        fa: 'Monday',
        fr: ['Lundi'],
        he_IL: ['יום שני'],
        hu_HU: ['Hétfő'],
        id_ID: ['Senin'],
        it: ['Lunedì'],
        ja: ['月曜日'],
        ko: ['월요일'],
        ms_MY: ['Isnin'],
        nl_NL: 'Monday',
        pl: ['Poniedziałek'],
        pt: ['Segunda'],
        ro: 'Monday',
        ru: ['Понедельник'],
        sv: ['Måndag'],
        th: ['วันจันทร์'],
        tr: ['Pazartesi'],
        vi: ['Thứ Hai'],
        zh: ['周一'],
        zh_TW: ['周一'],
      }
    },
    68327: (e) => {
      e.exports = {
        ar: ['مايو'],
        ca_ES: ['Maig'],
        cs: ['Květen'],
        de: ['Mai'],
        el: ['Μαι'],
        en: 'May',
        es: ['Mayo'],
        fa: ['می'],
        fr: ['Mai'],
        he_IL: ['מאי'],
        hu_HU: ['Május'],
        id_ID: ['Mei'],
        it: ['Maggio'],
        ja: ['5月'],
        ko: ['5월'],
        ms_MY: ['Mei'],
        nl_NL: ['Mei'],
        pl: ['Maj'],
        pt: ['Мaio'],
        ro: 'May',
        ru: ['Май'],
        sv: ['Maj'],
        th: ['พ.ค.'],
        tr: 'May',
        vi: ['Tháng Năm'],
        zh: ['5月'],
        zh_TW: ['五月'],
      }
    },
    84675: (e) => {
      e.exports = {
        ar: ['مارس'],
        ca_ES: ['Març'],
        cs: 'March',
        de: ['März'],
        el: 'March',
        en: 'March',
        es: ['Marzo'],
        fa: 'March',
        fr: ['Mars'],
        he_IL: ['מרץ‏'],
        hu_HU: ['Március'],
        id_ID: ['Maret'],
        it: ['Marzo'],
        ja: ['3月'],
        ko: ['3월'],
        ms_MY: ['Mac'],
        nl_NL: 'March',
        pl: ['Marzec'],
        pt: ['Março'],
        ro: 'March',
        ru: ['Март'],
        sv: ['Mars'],
        th: ['มีนาคม'],
        tr: ['Mart'],
        vi: ['Tháng Ba'],
        zh: ['3月'],
        zh_TW: ['三月'],
      }
    },
    83949: (e) => {
      e.exports = {
        ar: ['السوق مفتوح'],
        ca_ES: ['Mercat obert'],
        cs: 'Market open',
        de: ['Markt ist geöffnet'],
        el: 'Market open',
        en: 'Market open',
        es: ['Mercado abierto'],
        fa: 'Market open',
        fr: ['Marché ouvert'],
        he_IL: ['שוק פתוח'],
        hu_HU: 'Market open',
        id_ID: ['Pasar buka'],
        it: ['Mercato aperto'],
        ja: ['市場開始'],
        ko: ['마켓 오픈'],
        ms_MY: ['Pasaran dibuka'],
        nl_NL: 'Market open',
        pl: ['Rynek jest otwarty'],
        pt: ['Mercado aberto'],
        ro: 'Market open',
        ru: ['Рынок открыт'],
        sv: ['Marknaden är öppen'],
        th: ['ตลาดเปิด'],
        tr: ['Piyasa açık'],
        vi: ['Thị trường Mở'],
        zh: ['开市'],
        zh_TW: ['開市'],
      }
    },
    95814: (e) => {
      e.exports = {
        ar: ['السوق مغلق'],
        ca_ES: ['Mercat tancat'],
        cs: 'Market closed',
        de: ['Markt ist geschlossen'],
        el: 'Market closed',
        en: 'Market closed',
        es: ['Mercado cerrado'],
        fa: 'Market closed',
        fr: ['Marché fermé'],
        he_IL: ['השוק סגור'],
        hu_HU: 'Market closed',
        id_ID: ['Pasar tutup'],
        it: ['Mercato chiuso'],
        ja: ['市場終了'],
        ko: ['마켓 클로즈드'],
        ms_MY: ['Pasaran ditutup'],
        nl_NL: 'Market closed',
        pl: ['Rynek jest zamknięty'],
        pt: ['Mercado fechado'],
        ro: 'Market closed',
        ru: ['Рынок закрыт'],
        sv: ['Marknaden är stängd'],
        th: ['ตลาดปิด'],
        tr: ['Piyasa kapalı'],
        vi: ['Thị trường đóng cửa'],
        zh: ['休市'],
        zh_TW: ['休市'],
      }
    },
    59607: (e) => {
      e.exports = {
        ar: ['مقياس'],
        ca_ES: ['Mida'],
        cs: 'Measure',
        de: ['Messen'],
        el: 'Measure',
        en: 'Measure',
        es: ['Medida'],
        fa: 'Measure',
        fr: ['Mesure'],
        he_IL: ['מדידה'],
        hu_HU: 'Measure',
        id_ID: ['Mengukur'],
        it: ['Misura'],
        ja: ['ものさし'],
        ko: ['재기'],
        ms_MY: ['Langkah'],
        nl_NL: 'Measure',
        pl: ['Linijka'],
        pt: ['Medir'],
        ro: 'Measure',
        ru: ['Линейка'],
        sv: ['Mäta'],
        th: ['การวัด'],
        tr: ['Ölç'],
        vi: ['Đo lường'],
        zh: ['测量'],
        zh_TW: ['測量'],
      }
    },
    71194: (e) => {
      e.exports = {
        ar: ['نوفمبر'],
        ca_ES: ['Novembre'],
        cs: 'November',
        de: 'November',
        el: 'November',
        en: 'November',
        es: ['Noviembre'],
        fa: 'November',
        fr: ['Novembre'],
        he_IL: ['נובמבר‏'],
        hu_HU: 'November',
        id_ID: 'November',
        it: ['Novembre'],
        ja: ['11月'],
        ko: ['11월'],
        ms_MY: 'November',
        nl_NL: 'November',
        pl: ['Listopad'],
        pt: ['Novembro'],
        ro: 'November',
        ru: ['Ноябрь'],
        sv: 'November',
        th: ['พฤศจิกายน'],
        tr: ['Kasım'],
        vi: ['Tháng Mười một'],
        zh: ['11月'],
        zh_TW: ['十一月'],
      }
    },
    3297: (e) => {
      e.exports = {
        ar: ['الاسم'],
        ca_ES: ['Nom'],
        cs: 'Name',
        de: 'Name',
        el: 'Name',
        en: 'Name',
        es: ['Nombre'],
        fa: 'Name',
        fr: ['Nom'],
        he_IL: ['שם'],
        hu_HU: ['Érme'],
        id_ID: ['Nama'],
        it: ['Nome'],
        ja: ['名前'],
        ko: ['이름'],
        ms_MY: ['Nama'],
        nl_NL: 'Name',
        pl: ['Nazwa'],
        pt: ['Nome'],
        ro: 'Name',
        ru: ['Название'],
        sv: ['Namn'],
        th: ['ชื่อ'],
        tr: ['Adı'],
        vi: ['Tên'],
        zh: ['名称'],
        zh_TW: ['名稱'],
      }
    },
    46147: (e) => {
      e.exports = {
        ar: ['مصدر'],
        ca_ES: ['Font'],
        cs: ['Zdroj'],
        de: ['Quelle'],
        el: 'Source',
        en: 'Source',
        es: ['Fuente'],
        fa: 'Source',
        fr: 'Source',
        he_IL: ['מקור'],
        hu_HU: ['Forrás'],
        id_ID: ['Sumber'],
        it: ['Sorgente'],
        ja: ['ソース'],
        ko: ['소스'],
        ms_MY: ['Sumber'],
        nl_NL: 'Source',
        pl: ['Źródło'],
        pt: ['Fonte'],
        ro: 'Source',
        ru: ['Источник'],
        sv: ['Källa'],
        th: ['จุดกำเนิด'],
        tr: ['Kaynak'],
        vi: ['Nguồn'],
        zh: ['来源'],
        zh_TW: ['來源'],
      }
    },
    36835: (e) => {
      e.exports = {
        ar: ['السبت'],
        ca_ES: ['Ds'],
        cs: 'Sat',
        de: ['Sa'],
        el: 'Sat',
        en: 'Sat',
        es: ['Sáb'],
        fa: 'Sat',
        fr: ['Sam'],
        he_IL: ['שבת'],
        hu_HU: ['Szom'],
        id_ID: ['Sab'],
        it: ['Sab'],
        ja: ['土'],
        ko: ['토'],
        ms_MY: ['Sabtu'],
        nl_NL: 'Sat',
        pl: ['Sob'],
        pt: ['Sáb.'],
        ro: 'Sat',
        ru: ['Сб'],
        sv: ['Lör'],
        th: ['เสาร์'],
        tr: ['Cmt'],
        vi: ['Thứ 7'],
        zh: ['周六'],
        zh_TW: ['周六'],
      }
    },
    1144: (e) => {
      e.exports = {
        ar: ['السبت'],
        ca_ES: ['Dissabte'],
        cs: 'Saturday',
        de: ['Samstag'],
        el: 'Saturday',
        en: 'Saturday',
        es: ['Sábado'],
        fa: 'Saturday',
        fr: ['Samedi'],
        he_IL: ['יום שבת'],
        hu_HU: ['Szombat'],
        id_ID: ['Sabtu'],
        it: ['Sabato'],
        ja: ['土曜日'],
        ko: ['토요일'],
        ms_MY: ['Sabtu'],
        nl_NL: 'Saturday',
        pl: ['Sobota'],
        pt: ['Sábado'],
        ro: 'Saturday',
        ru: ['Суббота'],
        sv: ['Lördag'],
        th: ['เสาร์'],
        tr: ['Cumartesi'],
        vi: ['Thứ Bảy'],
        zh: ['周六'],
        zh_TW: ['周六'],
      }
    },
    31672: (e) => {
      e.exports = {
        ar: ['قطاع'],
        ca_ES: 'Sector',
        cs: 'Sector',
        de: ['Sektor'],
        el: 'Sector',
        en: 'Sector',
        es: 'Sector',
        fa: 'Sector',
        fr: ['Secteur'],
        he_IL: ['סקטור'],
        hu_HU: ['Szektor'],
        id_ID: ['Sektor'],
        it: ['Settore'],
        ja: ['セクター'],
        ko: ['섹터'],
        ms_MY: ['Sektor'],
        nl_NL: 'Sector',
        pl: ['Sektor'],
        pt: ['Setor'],
        ro: 'Sector',
        ru: ['Сектор'],
        sv: ['Sektor'],
        th: ['ภาค'],
        tr: ['Sektör'],
        vi: ['Khu vực'],
        zh: ['板块'],
        zh_TW: ['部門'],
      }
    },
    61132: (e) => {
      e.exports = {
        ar: ['سبتمبر'],
        ca_ES: ['Setembre'],
        cs: 'September',
        de: 'September',
        el: 'September',
        en: 'September',
        es: ['Septiembre'],
        fa: 'September',
        fr: ['Septembre'],
        he_IL: ['ספטמבר‏'],
        hu_HU: ['Szeptember'],
        id_ID: 'September',
        it: ['Settembre'],
        ja: ['9月'],
        ko: ['9월'],
        ms_MY: 'September',
        nl_NL: 'September',
        pl: ['Wrzesień'],
        pt: ['Setembro'],
        ro: 'September',
        ru: ['Сентябрь'],
        sv: 'September',
        th: ['กันยายน'],
        tr: ['Eylül'],
        vi: ['Tháng Chín'],
        zh: ['9月'],
        zh_TW: ['九月'],
      }
    },
    86577: (e) => {
      e.exports = {
        ar: ['الأحد'],
        ca_ES: ['Dg'],
        cs: 'Sun',
        de: ['Son'],
        el: 'Sun',
        en: 'Sun',
        es: ['Do'],
        fa: 'Sun',
        fr: ['Dim'],
        he_IL: ['יום ראשון'],
        hu_HU: ['Vas'],
        id_ID: ['Min'],
        it: ['Dom'],
        ja: ['日'],
        ko: ['일'],
        ms_MY: ['Ahad'],
        nl_NL: 'Sun',
        pl: ['Niedz.'],
        pt: ['Dom'],
        ro: 'Sun',
        ru: ['Вс'],
        sv: ['Sön'],
        th: ['อาทิตย์'],
        tr: ['Paz'],
        vi: ['CN'],
        zh: ['周日'],
        zh_TW: ['周日'],
      }
    },
    72149: (e) => {
      e.exports = {
        ar: ['الأحد'],
        ca_ES: ['Diumenge'],
        cs: 'Sunday',
        de: ['Sonntag'],
        el: 'Sunday',
        en: 'Sunday',
        es: ['Domingo'],
        fa: 'Sunday',
        fr: ['Dimanche'],
        he_IL: ['יום ראשון'],
        hu_HU: ['Vasárnap'],
        id_ID: ['Minggu'],
        it: ['Domenica'],
        ja: ['日曜日'],
        ko: ['일요일'],
        ms_MY: ['Ahad'],
        nl_NL: 'Sunday',
        pl: ['Niedziela'],
        pt: ['Domingo'],
        ro: 'Sunday',
        ru: ['Воскресенье'],
        sv: ['Söndag'],
        th: ['อาทิตย์'],
        tr: ['Pazar'],
        vi: ['Chủ nhật'],
        zh: ['周日'],
        zh_TW: ['周日'],
      }
    },
    12014: (e) => {
      e.exports = {
        ar: ['معلومات الرمز'],
        ca_ES: ['Informació del símbol'],
        cs: 'Symbol Info',
        de: 'Symbol Info',
        el: 'Symbol Info',
        en: 'Symbol Info',
        es: ['Información del símbolo'],
        fa: 'Symbol Info',
        fr: ['Info du Symbole'],
        he_IL: ['מידע על הסימול'],
        hu_HU: ['Szimbólum Infó'],
        id_ID: ['Info Simbol'],
        it: ['Informazioni simbolo'],
        ja: ['シンボル情報'],
        ko: ['심볼 정보'],
        ms_MY: ['Maklumat Simbol'],
        nl_NL: 'Symbol Info',
        pl: ['Informacje o Symbolu'],
        pt: ['Informações do símbolo'],
        ro: 'Symbol Info',
        ru: ['Информация по инструменту'],
        sv: ['Symbolinformation'],
        th: ['ข้อมูลสัญลักษณ์'],
        tr: ['Sembol Bilgisi'],
        vi: ['Thông tin Mã giao dịch'],
        zh: ['商品信息'],
        zh_TW: ['商品資訊'],
      }
    },
    64659: (e) => {
      e.exports = {
        ar: ['قيمة النقطة'],
        ca_ES: ['Valor del punt'],
        cs: 'Point value',
        de: ['Punktwert'],
        el: 'Point value',
        en: 'Point value',
        es: ['Valor del punto'],
        fa: 'Point value',
        fr: ['Valeur du point'],
        he_IL: ['נקודת ערך Point value'],
        hu_HU: 'Point value',
        id_ID: ['Nilai poin'],
        it: ['Valore punto'],
        ja: ['ポイント値'],
        ko: ['포인트 밸류'],
        ms_MY: ['Nilai mata'],
        nl_NL: 'Point value',
        pl: ['Wartość punktu'],
        pt: ['Valor do ponto'],
        ro: 'Point value',
        ru: ['Значение пункта'],
        sv: ['Punktvärde'],
        th: ['มูลค่าของจุด'],
        tr: ['Nokta Değeri'],
        vi: ['Giá trị điểm'],
        zh: ['点值'],
        zh_TW: ['計點值'],
      }
    },
    29985: (e) => {
      e.exports = {
        ar: ['ما بعد الجلسة'],
        ca_ES: ['Postmercat'],
        cs: 'Post-market',
        de: ['Nachbörslich'],
        el: 'Post-market',
        en: 'Post-market',
        es: ['Posmercado'],
        fa: 'Post-market',
        fr: ['Post-marché'],
        he_IL: ['פוסט-מרקט'],
        hu_HU: 'Post-market',
        id_ID: ['Pasca-pasar'],
        it: ['Post-mercato'],
        ja: ['アフターマーケット'],
        ko: ['포스트 마켓'],
        ms_MY: ['Pasca-pasaran'],
        nl_NL: 'Post-market',
        pl: 'Post-market',
        pt: ['Pós-mercado'],
        ro: 'Post-market',
        ru: ['Вечерняя торговая сессия'],
        sv: ['Efter marknadens stängning'],
        th: ['หลังตลาดปิด'],
        tr: ['Kapanış-sonrası'],
        vi: ['Thị trường sau khi đóng cửa'],
        zh: ['盘后时段'],
        zh_TW: ['盤後時段'],
      }
    },
    45221: (e) => {
      e.exports = {
        ar: ['حجم النقطة'],
        ca_ES: ['Mida del Pip'],
        cs: ['Pip Size'],
        de: ['Pip-Größe'],
        el: ['Pip Size'],
        en: 'Pip size',
        es: ['Tamaño del Pip'],
        fa: ['Pip Size'],
        fr: ['Valeur du pip'],
        he_IL: ['גודל Pip'],
        hu_HU: ['Pip Méret'],
        id_ID: ['Ukuran Pip'],
        it: ['Dimensione Pip'],
        ja: ['Pipサイズ'],
        ko: ['핍사이즈'],
        ms_MY: ['Saiz Pip'],
        nl_NL: ['Pip Size'],
        pl: ['Rozmiar Pip'],
        pt: ['Tamanho do Pip'],
        ro: ['Pip Size'],
        ru: ['Объём пункта'],
        sv: ['Pipstorlek'],
        th: ['ขนาดของปิ้บ'],
        tr: ['Pip Miktarı'],
        vi: ['Cỡ Pip'],
        zh: ['点值大小'],
        zh_TW: ['Pip 大小'],
      }
    },
    56042: (e) => {
      e.exports = {
        ar: ['ما قبل الجلسة'],
        ca_ES: ['Premercat'],
        cs: 'Pre-market',
        de: ['Vorbörslich'],
        el: 'Pre-market',
        en: 'Pre-market',
        es: ['Premercado'],
        fa: 'Pre-market',
        fr: ['Pré-marché'],
        he_IL: ['פרה-מרקט'],
        hu_HU: 'Pre-market',
        id_ID: ['Pra-pasar'],
        it: ['Pre-mercato'],
        ja: ['プレマーケット'],
        ko: ['프리 마켓'],
        ms_MY: ['Pra-pasaran'],
        nl_NL: 'Pre-market',
        pl: 'Pre-market',
        pt: ['Pré-mercado'],
        ro: 'Pre-market',
        ru: ['Предторговый период'],
        sv: ['Före marknadens öppning'],
        th: ['ก่อนตลาดเปิด'],
        tr: ['Açılış-öncesi'],
        vi: ['Thị trường trước giờ mở cửa'],
        zh: ['盘前时段'],
        zh_TW: ['盤前時段'],
      }
    },
    75094: (e) => {
      e.exports = {
        ar: ['الأربعاء'],
        ca_ES: ['Dc'],
        cs: 'Wed',
        de: ['Mi'],
        el: 'Wed',
        en: 'Wed',
        es: ['Mi'],
        fa: 'Wed',
        fr: ['Mer'],
        he_IL: ['רביעי'],
        hu_HU: ['Szer'],
        id_ID: ['Rab'],
        it: ['Mer'],
        ja: ['水'],
        ko: ['수'],
        ms_MY: ['Rabu'],
        nl_NL: 'Wed',
        pl: ['Śr.'],
        pt: ['Quarta'],
        ro: 'Wed',
        ru: ['Ср'],
        sv: ['Ons'],
        th: ['พุธ'],
        tr: ['Çar'],
        vi: ['Thứ 4'],
        zh: ['周三'],
        zh_TW: ['周三'],
      }
    },
    7147: (e) => {
      e.exports = {
        ar: ['الأربعاء'],
        ca_ES: ['Dimecres'],
        cs: 'Wednesday',
        de: ['Mittwoch'],
        el: 'Wednesday',
        en: 'Wednesday',
        es: ['Miércoles'],
        fa: 'Wednesday',
        fr: ['Mercredi'],
        he_IL: ['יום רביעי'],
        hu_HU: ['Szerda'],
        id_ID: ['Rabu'],
        it: ['Mercoledì'],
        ja: ['水曜日'],
        ko: ['수요일'],
        ms_MY: ['Rabu'],
        nl_NL: 'Wednesday',
        pl: ['Środa'],
        pt: ['Quarta'],
        ro: 'Wednesday',
        ru: ['Среда'],
        sv: ['Onsdag'],
        th: ['พุธ'],
        tr: ['Çarşamba'],
        vi: ['Thứ tư'],
        zh: ['周三'],
        zh_TW: ['周三'],
      }
    },
    82833: (e) => {
      e.exports = {
        ar: ['تم نسخ النص إلى الحافظة'],
        ca_ES: 'Text copied to clipboard',
        cs: 'Text copied to clipboard',
        de: ['Text in die Zwischenablage kopiert'],
        el: 'Text copied to clipboard',
        en: 'Text copied to clipboard',
        es: ['Texto copiado en el portapapeles'],
        fa: 'Text copied to clipboard',
        fr: ['Texte copié dans le presse-papiers'],
        he_IL: ['הטקסט הועתק ללוח'],
        hu_HU: 'Text copied to clipboard',
        id_ID: ['Teks disalin ke clipboard'],
        it: ['Testo copiato negli appunti'],
        ja: ['クリップボードにコピーされたテキスト'],
        ko: ['클립보드에 텍스트 카피되었음'],
        ms_MY: ['Teks disalin ke papan keratan'],
        nl_NL: 'Text copied to clipboard',
        pl: ['Tekst skopiowany do schowka'],
        pt: ['Texto copiado para área de transferência'],
        ro: 'Text copied to clipboard',
        ru: ['Текст скопирован в буфер обмена'],
        sv: ['Text sparad till urklipp'],
        th: ['คัดลอกข้อความลงคลิปบอร์ด'],
        tr: ['Panoya kopyalanan metin'],
        vi: ['Đã sao chép văn bản vào bộ nhớ tạm'],
        zh: ['复制到剪贴板的文本'],
        zh_TW: ['複製到剪貼簿的文字'],
      }
    },
    9787: (e) => {
      e.exports = {
        ar: ['الخميس'],
        ca_ES: ['Dj'],
        cs: 'Thu',
        de: ['Do'],
        el: 'Thu',
        en: 'Thu',
        es: ['Jue'],
        fa: 'Thu',
        fr: ['Jeu'],
        he_IL: ['חמישי'],
        hu_HU: ['Cs'],
        id_ID: ['Kamis'],
        it: ['Gio'],
        ja: ['木'],
        ko: ['목'],
        ms_MY: ['Khamis'],
        nl_NL: 'Thu',
        pl: ['Czw.'],
        pt: ['Qui'],
        ro: 'Thu',
        ru: ['Чт'],
        sv: ['Tor'],
        th: ['พฤหัสบดี'],
        tr: ['Per'],
        vi: ['Thứ 5'],
        zh: ['周四'],
        zh_TW: ['周四'],
      }
    },
    7951: (e) => {
      e.exports = {
        ar: ['الخميس'],
        ca_ES: ['Dijous'],
        cs: 'Thursday',
        de: ['Donnerstag'],
        el: 'Thursday',
        en: 'Thursday',
        es: ['Jueves'],
        fa: 'Thursday',
        fr: ['Jeudi'],
        he_IL: ['יום חמישי'],
        hu_HU: ['Csütörtök'],
        id_ID: ['Kamis'],
        it: ['Giovedì'],
        ja: ['木曜日'],
        ko: ['목요일'],
        ms_MY: ['Khamis'],
        nl_NL: 'Thursday',
        pl: ['Czwartek'],
        pt: ['Quinta'],
        ro: 'Thursday',
        ru: ['Четверг'],
        sv: ['Torsdag'],
        th: ['พฤหัสบดี'],
        tr: ['Perşembe'],
        vi: ['Thứ năm'],
        zh: ['周四'],
        zh_TW: ['周四'],
      }
    },
    55209: (e) => {
      e.exports = {
        ar: ['حجم التيك'],
        ca_ES: ['Mida del tick'],
        cs: 'Tick size',
        de: ['Tickgröße'],
        el: 'Tick size',
        en: 'Tick size',
        es: ['Tamaño del tick'],
        fa: 'Tick size',
        fr: ['Taille du tick'],
        he_IL: ['גודל Tick'],
        hu_HU: 'Tick size',
        id_ID: ['Ukuran tick'],
        it: ['Dimensione tick'],
        ja: ['ティックサイズ'],
        ko: ['틱 사이즈'],
        ms_MY: ['Saiz tick'],
        nl_NL: 'Tick size',
        pl: ['Rozmiar ticka'],
        pt: ['Tamanho do tick'],
        ro: 'Tick size',
        ru: ['Размер тика'],
        sv: ['Tickstorlek'],
        th: ['ขนาด Tick'],
        tr: ['fiyat adımı boyutu'],
        vi: ['Cỡ Tick'],
        zh: ['Tick大小'],
        zh_TW: ['Tick大小'],
      }
    },
    94316: (e) => {
      e.exports = {
        ar: ['الثلاثاء'],
        ca_ES: ['Març'],
        cs: 'Tue',
        de: ['Die'],
        el: 'Tue',
        en: 'Tue',
        es: ['Mar'],
        fa: 'Tue',
        fr: ['Mar'],
        he_IL: ['שלישי'],
        hu_HU: ['Ke'],
        id_ID: ['Selasa'],
        it: ['Mar'],
        ja: ['火'],
        ko: ['화'],
        ms_MY: ['Selasa'],
        nl_NL: 'Tue',
        pl: ['Wt.'],
        pt: ['Terça'],
        ro: 'Tue',
        ru: ['Вт'],
        sv: ['Tis'],
        th: ['อังคาร'],
        tr: ['Sal'],
        vi: ['Thứ 3'],
        zh: ['周二'],
        zh_TW: ['周二'],
      }
    },
    44979: (e) => {
      e.exports = {
        ar: ['الثلاثاء'],
        ca_ES: ['Dimarts'],
        cs: 'Tuesday',
        de: ['Dienstag'],
        el: 'Tuesday',
        en: 'Tuesday',
        es: ['Martes'],
        fa: 'Tuesday',
        fr: ['Mardi'],
        he_IL: ['יום שלישי'],
        hu_HU: ['Kedd'],
        id_ID: ['Selasa'],
        it: ['Martedì'],
        ja: ['火曜日'],
        ko: ['화요일'],
        ms_MY: ['Selasa'],
        nl_NL: 'Tuesday',
        pl: ['Wtorek'],
        pt: ['Terça'],
        ro: 'Tuesday',
        ru: ['Вторник'],
        sv: ['Tisdag'],
        th: ['อังคาร'],
        tr: ['Salı'],
        vi: ['Thứ ba'],
        zh: ['周二'],
        zh_TW: ['周一'],
      }
    },
    58416: (e) => {
      e.exports = {
        ar: ['نوع'],
        ca_ES: ['Tipus'],
        cs: ['Typ'],
        de: ['Typ'],
        el: ['Τύπος'],
        en: 'Type',
        es: ['Tipo'],
        fa: ['نوع'],
        fr: 'Type',
        he_IL: ['סוג'],
        hu_HU: ['Típus'],
        id_ID: ['Tipe'],
        it: ['Tipo'],
        ja: ['タイプ'],
        ko: ['타입'],
        ms_MY: ['Jenis'],
        nl_NL: 'Type',
        pl: ['Typ'],
        pt: ['Tipo'],
        ro: 'Type',
        ru: ['Тип'],
        sv: ['Typ'],
        th: ['ประเภท'],
        tr: ['Tip'],
        vi: ['Loại'],
        zh: ['类型'],
        zh_TW: ['種類'],
      }
    },
    77534: (e) => {
      e.exports = {
        ar: ['وحدة'],
        ca_ES: ['Unitat'],
        cs: 'Unit',
        de: ['Einheit'],
        el: 'Unit',
        en: 'Unit',
        es: ['Unidad'],
        fa: 'Unit',
        fr: ['Unité'],
        he_IL: ['יחידה'],
        hu_HU: 'Unit',
        id_ID: 'Unit',
        it: ['Unità'],
        ja: ['単位'],
        ko: ['유닛'],
        ms_MY: 'Unit',
        nl_NL: 'Unit',
        pl: ['Jednostka'],
        pt: ['Unidade'],
        ro: 'Unit',
        ru: ['Единица'],
        sv: ['Enhet'],
        th: ['หน่วย'],
        tr: ['Birim'],
        vi: ['Đơn vị'],
        zh: ['单位'],
        zh_TW: ['單位'],
      }
    },
    12629: (e) => {
      e.exports = {
        ar: ['السلع'],
        ca_ES: 'commodity',
        cs: 'commodity',
        de: ['Rohstoff'],
        el: 'commodity',
        en: 'commodity',
        es: ['materia prima'],
        fa: 'commodity',
        fr: ['produit de base'],
        he_IL: ['סחורה'],
        hu_HU: 'commodity',
        id_ID: ['komiditas'],
        it: ['materia prima'],
        ja: ['コモディティ'],
        ko: ['상품'],
        ms_MY: ['komoditi'],
        nl_NL: 'commodity',
        pl: ['towar'],
        pt: 'commodity',
        ro: 'commodity',
        ru: ['товары'],
        sv: ['Råvaror'],
        th: ['คอมมอดิตี้'],
        tr: ['Emtia'],
        vi: ['hàng hóa'],
        zh: ['商品'],
        zh_TW: ['商品'],
      }
    },
    87592: (e) => {
      e.exports = {
        ar: ['عقود الفروقات'],
        ca_ES: 'cfd',
        cs: 'cfd',
        de: 'cfd',
        el: 'cfd',
        en: 'cfd',
        es: 'cfd',
        fa: 'cfd',
        fr: 'cfd',
        he_IL: ['חוזה הפרשים cfd'],
        hu_HU: 'cfd',
        id_ID: 'cfd',
        it: 'cfd',
        ja: ['CFD'],
        ko: ['씨에프디'],
        ms_MY: 'cfd',
        nl_NL: 'cfd',
        pl: 'cfd',
        pt: 'cfd',
        ro: 'cfd',
        ru: 'cfd',
        sv: 'cfd',
        th: 'cfd',
        tr: 'cfd',
        vi: 'cfd',
        zh: ['差价合约'],
        zh_TW: 'cfd',
      }
    },
    8448: (e) => {
      e.exports = {
        ar: ['العملات الرقمية'],
        ca_ES: ['cripto'],
        cs: 'crypto',
        de: 'crypto',
        el: 'crypto',
        en: 'crypto',
        es: ['cripto'],
        fa: 'crypto',
        fr: 'crypto',
        he_IL: ['קריפטו'],
        hu_HU: ['kripto'],
        id_ID: 'crypto',
        it: ['cripto'],
        ja: ['暗号'],
        ko: ['크립토'],
        ms_MY: ['kripto'],
        nl_NL: 'crypto',
        pl: ['krypto'],
        pt: ['Cripto'],
        ro: 'crypto',
        ru: ['криптовалюты'],
        sv: ['krypto'],
        th: ['คริปโต'],
        tr: ['kripto'],
        vi: ['tiền điện tử'],
        zh: ['加密'],
        zh_TW: 'crypto',
      }
    },
    67245: (e) => {
      e.exports = {
        ar: ['إيصال إيداع'],
        ca_ES: 'dr',
        cs: 'dr',
        de: 'dr',
        el: 'dr',
        en: 'dr',
        es: 'dr',
        fa: 'dr',
        fr: 'dr',
        he_IL: 'dr',
        hu_HU: 'dr',
        id_ID: 'dr',
        it: 'dr',
        ja: ['預託証券'],
        ko: 'dr',
        ms_MY: 'dr',
        nl_NL: 'dr',
        pl: ['Potwierdzenie wpłaty'],
        pt: 'dr',
        ro: 'dr',
        ru: ['Депоз. расписки'],
        sv: 'dr',
        th: 'dr',
        tr: 'dr',
        vi: 'dr',
        zh: 'dr',
        zh_TW: 'dr',
      }
    },
    88720: (e) => {
      e.exports = {
        ar: ['اقتصاد'],
        ca_ES: ['economia'],
        cs: 'economy',
        de: ['Wirtschaft'],
        el: 'economy',
        en: 'economy',
        es: ['economía'],
        fa: 'economy',
        fr: ['économie'],
        he_IL: ['כַּלְכָּלָה'],
        hu_HU: 'economy',
        id_ID: ['ekonomi'],
        it: ['economia'],
        ja: ['経済指標'],
        ko: ['경제'],
        ms_MY: ['ekonomi'],
        nl_NL: 'economy',
        pl: ['gospodarka'],
        pt: ['economia'],
        ro: 'economy',
        ru: ['экономические данные'],
        sv: ['ekonomi'],
        th: ['เศรษฐกิจ'],
        tr: ['ekonomi'],
        vi: ['kinh tế'],
        zh: ['经济'],
        zh_TW: ['經濟'],
      }
    },
    39512: (e) => {
      e.exports = {
        ar: ['فوركس'],
        ca_ES: ['Forex'],
        cs: 'forex',
        de: ['Devisen'],
        el: 'forex',
        en: 'forex',
        es: ['Forex'],
        fa: 'forex',
        fr: ['Forex'],
        he_IL: ['מט"ח'],
        hu_HU: 'forex',
        id_ID: 'forex',
        it: 'forex',
        ja: ['FX'],
        ko: ['외환'],
        ms_MY: 'forex',
        nl_NL: 'forex',
        pl: 'forex',
        pt: 'forex',
        ro: 'forex',
        ru: ['форекс'],
        sv: ['valutor'],
        th: ['ฟอเร็กซ์'],
        tr: ['döviz'],
        vi: 'forex',
        zh: ['外汇'],
        zh_TW: ['外匯'],
      }
    },
    81859: (e) => {
      e.exports = {
        ar: ['العقود الآجلة'],
        ca_ES: ['futurs'],
        cs: 'futures',
        de: ['Futures'],
        el: 'futures',
        en: 'futures',
        es: ['futuros'],
        fa: 'futures',
        fr: 'futures',
        he_IL: ['חוזים עתידיים'],
        hu_HU: 'futures',
        id_ID: ['kontrak berjangka'],
        it: ['future'],
        ja: ['先物'],
        ko: ['퓨쳐스'],
        ms_MY: ['pasaran hadapan'],
        nl_NL: 'futures',
        pl: ['Kontrakty terminowe'],
        pt: ['futuros'],
        ro: 'futures',
        ru: ['фьючерсы'],
        sv: ['terminer'],
        th: ['ฟิวเจอร์ส'],
        tr: ['vadeli'],
        vi: ['hợp đồng tương lai'],
        zh: ['期货'],
        zh_TW: ['期貨'],
      }
    },
    12754: (e) => {
      e.exports = {
        ar: ['مؤشر'],
        ca_ES: ['índex'],
        cs: 'index',
        de: ['Index'],
        el: 'index',
        en: 'index',
        es: ['índice'],
        fa: 'index',
        fr: ['indice'],
        he_IL: ['מדד'],
        hu_HU: 'index',
        id_ID: ['indeks'],
        it: ['indice'],
        ja: ['指数'],
        ko: ['지수'],
        ms_MY: ['indeks'],
        nl_NL: 'index',
        pl: ['indeks'],
        pt: ['índice'],
        ro: 'index',
        ru: ['индексы'],
        sv: 'index',
        th: ['ดัชนี'],
        tr: ['endeks'],
        vi: ['chỉ số'],
        zh: ['指数'],
        zh_TW: ['指數'],
      }
    },
    60804: (e) => {
      e.exports = {
        ar: ['المؤشرات'],
        ca_ES: 'indices',
        cs: 'indices',
        de: ['Indizes'],
        el: 'indices',
        en: 'indices',
        es: ['índices'],
        fa: 'indices',
        fr: 'indices',
        he_IL: ['מדדים'],
        hu_HU: 'indices',
        id_ID: ['indeks'],
        it: ['Indici'],
        ja: ['指数'],
        ko: ['지수'],
        ms_MY: ['indeks'],
        nl_NL: ['indexen'],
        pl: ['indeksy'],
        pt: ['índices'],
        ro: 'indices',
        ru: ['индексы'],
        sv: ['index'],
        th: ['ดัชนี'],
        tr: ['endeks'],
        vi: ['các chỉ báo'],
        zh: ['指数'],
        zh_TW: ['指數'],
      }
    },
    36931: (e) => {
      e.exports = {
        ar: ['سهم'],
        ca_ES: ['accions'],
        cs: 'stock',
        de: ['Aktie'],
        el: 'stock',
        en: 'stock',
        es: ['acciones'],
        fa: 'stock',
        fr: 'stock',
        he_IL: ['מניה'],
        hu_HU: 'stock',
        id_ID: ['saham'],
        it: ['azione'],
        ja: ['株式'],
        ko: ['스탁'],
        ms_MY: ['saham'],
        nl_NL: 'stock',
        pl: ['akcja'],
        pt: ['ação'],
        ro: 'stock',
        ru: ['акция'],
        sv: ['aktier'],
        th: ['หุ้น'],
        tr: ['hisse'],
        vi: ['cổ phiếu'],
        zh: ['股票'],
        zh_TW: ['股票'],
      }
    },
  },
])
