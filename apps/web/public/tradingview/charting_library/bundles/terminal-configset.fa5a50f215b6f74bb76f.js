;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [8179],
  {
    758222: (e) => {
      e.exports = {
        'light-button': 'light-button-bYDQcOkp',
        link: 'link-bYDQcOkp',
        content: 'content-bYDQcOkp',
        'visually-hidden': 'visually-hidden-bYDQcOkp',
        nowrap: 'nowrap-bYDQcOkp',
        'ellipsis-container': 'ellipsis-container-bYDQcOkp',
        'text-wrap-container': 'text-wrap-container-bYDQcOkp',
        'text-wrap-with-ellipsis': 'text-wrap-with-ellipsis-bYDQcOkp',
        icon: 'icon-bYDQcOkp',
        'force-direction-ltr': 'force-direction-ltr-bYDQcOkp',
        'force-direction-rtl': 'force-direction-rtl-bYDQcOkp',
        'with-grouped': 'with-grouped-bYDQcOkp',
        'variant-quiet-primary': 'variant-quiet-primary-bYDQcOkp',
        selected: 'selected-bYDQcOkp',
        'typography-regular16px': 'typography-regular16px-bYDQcOkp',
        'typography-medium16px': 'typography-medium16px-bYDQcOkp',
        'typography-regular14px': 'typography-regular14px-bYDQcOkp',
        'typography-semibold14px': 'typography-semibold14px-bYDQcOkp',
        'typography-semibold16px': 'typography-semibold16px-bYDQcOkp',
        'size-xsmall': 'size-xsmall-bYDQcOkp',
        'with-start-icon': 'with-start-icon-bYDQcOkp',
        'with-end-icon': 'with-end-icon-bYDQcOkp',
        'no-content': 'no-content-bYDQcOkp',
        wrap: 'wrap-bYDQcOkp',
        'size-small': 'size-small-bYDQcOkp',
        'size-medium': 'size-medium-bYDQcOkp',
        'variant-primary': 'variant-primary-bYDQcOkp',
        'color-gray': 'color-gray-bYDQcOkp',
        caret: 'caret-bYDQcOkp',
        grouped: 'grouped-bYDQcOkp',
        pills: 'pills-bYDQcOkp',
        active: 'active-bYDQcOkp',
        'disable-active-on-touch': 'disable-active-on-touch-bYDQcOkp',
        'disable-active-state-styles': 'disable-active-state-styles-bYDQcOkp',
        'color-green': 'color-green-bYDQcOkp',
        'color-red': 'color-red-bYDQcOkp',
        'variant-secondary': 'variant-secondary-bYDQcOkp',
        'variant-ghost': 'variant-ghost-bYDQcOkp',
      }
    },
    959189: (e, t, n) => {
      function r(e, t) {
        return (
          t ||
          null == e ||
          (('string' == typeof e || Array.isArray(e)) && 0 === e.length)
        )
      }
      n.d(t, { isIconOnly: () => r })
    },
    898237: (e, t, n) => {
      n.d(t, { LightAnchorButton: () => l, LightButton: () => i.LightButton })
      var r = n(418920),
        i = n(943158),
        a = n(50959),
        o = n(591365),
        s = n(273388)
      function l(e) {
        const {
            className: t,
            isSelected: n,
            children: i,
            startIcon: l,
            iconOnly: c,
            ellipsis: d,
            showCaret: u,
            forceDirection: p,
            endIcon: h,
            color: g,
            variant: m,
            reference: S,
            size: T,
            enableActiveStateStyles: _,
            renderComponent: v = o.CustomComponentDefaultLink,
            typography: k,
            textWrap: f = !1,
            maxLines: b,
            style: y = {},
            ...L
          } = e,
          P = f ? (null != b ? b : 2) : 1,
          C = P > 0 ? { ...y, '--ui-lib-light-button-content-max-lines': P } : y
        return a.createElement(
          v,
          {
            ...L,
            className: (0, r.useLightButtonClasses)({
              className: t,
              isSelected: n,
              children: i,
              startIcon: l,
              iconOnly: c,
              showCaret: u,
              forceDirection: p,
              endIcon: h,
              color: g,
              variant: m,
              size: T,
              enableActiveStateStyles: _,
              typography: k,
              textWrap: f,
              isLink: !0,
            }),
            reference: (0, s.isomorphicRef)(S),
            style: C,
          },
          a.createElement(
            r.LightButtonContent,
            {
              showCaret: u,
              startIcon: l,
              endIcon: h,
              iconOnly: c,
              ellipsis: d,
              textWrap: f,
            },
            i,
          ),
        )
      }
    },
    418920: (e, t, n) => {
      n.d(t, { LightButtonContent: () => m, useLightButtonClasses: () => g })
      var r = n(50959),
        i = n(497754),
        a = n(601198),
        o = n(72571),
        s = n(234539),
        l = n(959189),
        c = n(380327)
      const d = r.createContext({ isInButtonGroup: !1, isGroupPrimary: !1 })
      var u = n(602948),
        p = n(758222),
        h = n.n(p)
      const g = (e, t) => {
        const n = (0, r.useContext)(s.CustomBehaviourContext),
          a = (0, r.useContext)(c.ControlGroupContext),
          { isInButtonGroup: o, isGroupPrimary: u } = (0, r.useContext)(d),
          {
            className: p,
            isSelected: g,
            children: m,
            startIcon: S,
            showCaret: T,
            endIcon: _,
            forceDirection: v,
            iconOnly: k,
            color: f = 'gray',
            variant: b = 'primary',
            size: y = 'medium',
            enableActiveStateStyles: L = n.enableActiveStateStyles,
            typography: P,
            isLink: C = !1,
            textWrap: E,
            isPills: I,
            isActive: O,
          } = e,
          D =
            h()[
              `typography-${((e, t, n) => {
                if (n) {
                  const e = n.replace(/^\D+/g, '')
                  return t ? `semibold${e}` : n
                }
                return 'xsmall' === e
                  ? t
                    ? 'semibold14px'
                    : 'regular14px'
                  : 'small' === e || 'medium' === e
                    ? t
                      ? 'semibold16px'
                      : 'regular16px'
                    : ''
              })(y, g || I, P || void 0)}`
            ]
        return i(
          p,
          h()['light-button'],
          C && h().link,
          O && h().active,
          g && h().selected,
          (0, l.isIconOnly)(m, k) && h()['no-content'],
          S && h()['with-start-icon'],
          (T || _) && h()['with-end-icon'],
          t && h()['with-grouped'],
          v && h()[`force-direction-${v}`],
          h()[`variant-${u ? 'primary' : b}`],
          h()[`color-${u ? 'gray' : f}`],
          h()[`size-${y}`],
          D,
          !L && h()['disable-active-state-styles'],
          a.isGrouped && h().grouped,
          E && h().wrap,
          o && h()['disable-active-on-touch'],
          I && h().pills,
        )
      }
      function m(e) {
        const {
          startIcon: t,
          endIcon: n,
          showCaret: s,
          iconOnly: c,
          ellipsis: d = !0,
          textWrap: p,
          tooltipText: g,
          children: m,
        } = e
        return r.createElement(
          r.Fragment,
          null,
          t && r.createElement(o.Icon, { className: h().icon, icon: t }),
          !(0, l.isIconOnly)(m, c) &&
            r.createElement(
              'span',
              {
                className: i(
                  h().content,
                  !p && h().nowrap,
                  'apply-overflow-tooltip',
                  'apply-overflow-tooltip--check-children-recursively',
                  'apply-overflow-tooltip--allow-text',
                ),
                'data-overflow-tooltip-text':
                  null != g ? g : (0, a.getTextForTooltip)(m),
              },
              p || d
                ? r.createElement(
                    r.Fragment,
                    null,
                    r.createElement(
                      'span',
                      {
                        className: i(
                          !p && d && h()['ellipsis-container'],
                          p && h()['text-wrap-container'],
                          p && d && h()['text-wrap-with-ellipsis'],
                        ),
                      },
                      m,
                    ),
                    r.createElement(
                      'span',
                      { className: h()['visually-hidden'], 'aria-hidden': !0 },
                      m,
                    ),
                  )
                : r.createElement(
                    r.Fragment,
                    null,
                    m,
                    r.createElement(
                      'span',
                      { className: h()['visually-hidden'], 'aria-hidden': !0 },
                      m,
                    ),
                  ),
            ),
          (n || s) &&
            ((e) =>
              r.createElement(o.Icon, {
                className: i(h().icon, e.showCaret && h().caret),
                icon: e.showCaret ? u : e.endIcon,
              }))(e),
        )
      }
    },
    943158: (e, t, n) => {
      n.d(t, { LightButton: () => o })
      var r = n(50959),
        i = n(380327),
        a = n(418920)
      function o(e) {
        const { isGrouped: t } = r.useContext(i.ControlGroupContext),
          {
            reference: n,
            className: o,
            isSelected: s,
            children: l,
            startIcon: c,
            iconOnly: d,
            ellipsis: u,
            showCaret: p,
            forceDirection: h,
            endIcon: g,
            color: m,
            variant: S,
            size: T,
            enableActiveStateStyles: _,
            typography: v,
            textWrap: k = !1,
            maxLines: f,
            style: b = {},
            isPills: y,
            isActive: L,
            tooltipText: P,
            ...C
          } = e,
          E = k ? (null != f ? f : 2) : 1,
          I = E > 0 ? { ...b, '--ui-lib-light-button-content-max-lines': E } : b
        return r.createElement(
          'button',
          {
            ...C,
            className: (0, a.useLightButtonClasses)(
              {
                className: o,
                isSelected: s,
                children: l,
                startIcon: c,
                iconOnly: d,
                showCaret: p,
                forceDirection: h,
                endIcon: g,
                color: m,
                variant: S,
                size: T,
                enableActiveStateStyles: _,
                typography: v,
                textWrap: k,
                isPills: y,
                isActive: L,
              },
              t,
            ),
            ref: n,
            style: I,
          },
          r.createElement(
            a.LightButtonContent,
            {
              showCaret: p,
              startIcon: c,
              endIcon: g,
              iconOnly: d,
              ellipsis: u,
              textWrap: k,
              tooltipText: P,
            },
            l,
          ),
        )
      }
    },
    380327: (e, t, n) => {
      n.d(t, { ControlGroupContext: () => r })
      const r = n(50959).createContext({
        isGrouped: !1,
        cellState: { isTop: !0, isRight: !0, isBottom: !0, isLeft: !0 },
      })
    },
    409245: (e, t, n) => {
      function r(e) {
        const { reference: t, ...n } = e
        return { ...n, ref: t }
      }
      n.d(t, { renameRef: () => r })
    },
    591365: (e, t, n) => {
      n.d(t, { CustomComponentDefaultLink: () => a })
      var r = n(50959),
        i = n(409245)
      function a(e) {
        return r.createElement('a', { ...(0, i.renameRef)(e) })
      }
      r.PureComponent
    },
    234539: (e, t, n) => {
      n.d(t, { CustomBehaviourContext: () => r })
      const r = (0, n(50959).createContext)({ enableActiveStateStyles: !0 })
      r.displayName = 'CustomBehaviourContext'
    },
    718736: (e, t, n) => {
      n.d(t, { useFunctionalRefObject: () => a })
      var r = n(50959),
        i = n(855393)
      function a(e) {
        const t = (0, r.useMemo)(
            () =>
              ((e) => {
                const t = (n) => {
                  e(n), (t.current = n)
                }
                return (t.current = null), t
              })((e) => {
                s.current(e)
              }),
            [],
          ),
          n = (0, r.useRef)(null),
          a = (t) => {
            if (null === t) return o(n.current, t), void (n.current = null)
            n.current !== e && ((n.current = e), o(n.current, t))
          },
          s = (0, r.useRef)(a)
        return (
          (s.current = a),
          (0, i.useIsomorphicLayoutEffect)(() => {
            if (null !== t.current)
              return s.current(t.current), () => s.current(null)
          }, [e]),
          t
        )
      }
      function o(e, t) {
        null !== e && ('function' == typeof e ? e(t) : (e.current = t))
      }
    },
    855393: (e, t, n) => {
      n.d(t, { useIsomorphicLayoutEffect: () => i })
      var r = n(50959)
      function i(e, t) {
        ;('undefined' == typeof window ? r.useEffect : r.useLayoutEffect)(e, t)
      }
    },
    72571: (e, t, n) => {
      n.d(t, { Icon: () => i })
      var r = n(50959)
      const i = r.forwardRef((e, t) => {
        const { icon: n = '', ...i } = e
        return r.createElement('span', {
          ...i,
          ref: t,
          dangerouslySetInnerHTML: { __html: n },
        })
      })
    },
    601198: (e, t, n) => {
      n.d(t, { getTextForTooltip: () => o })
      var r = n(50959)
      const i = (e) => (0, r.isValidElement)(e) && Boolean(e.props.children),
        a = (e) =>
          null == e || 'boolean' == typeof e || '{}' === JSON.stringify(e)
            ? ''
            : e.toString() + ' ',
        o = (e) =>
          Array.isArray(e) || (0, r.isValidElement)(e)
            ? r.Children.toArray(e)
                .reduce((e, t) => {
                  let n = ''
                  return (
                    (n =
                      (0, r.isValidElement)(t) && i(t)
                        ? o(t.props.children)
                        : (0, r.isValidElement)(t) && !i(t)
                          ? ''
                          : a(t)),
                    e.concat(n)
                  )
                }, '')
                .trim()
            : a(e)
    },
    273388: (e, t, n) => {
      function r(e) {
        return (t) => {
          e.forEach((e) => {
            'function' == typeof e ? e(t) : null != e && (e.current = t)
          })
        }
      }
      function i(e) {
        return r([e])
      }
      n.d(t, { isomorphicRef: () => i, mergeRefs: () => r })
    },
    247465: (e, t, n) => {
      n.d(t, { isCancelled: () => a, makeCancelable: () => i })
      class r extends Error {
        constructor() {
          super('CancelToken')
        }
      }
      function i(e) {
        let t = !1
        return {
          promise: new Promise((n, i) => {
            e.then((e) => (t ? i(new r()) : n(e))),
              e.catch((e) => i(t ? new r() : e))
          }),
          cancel() {
            t = !0
          },
        }
      }
      function a(e) {
        return e instanceof r
      }
    },
    865266: (e, t, n) => {
      n.d(t, { useRovingTabindexElement: () => o })
      var r = n(50959),
        i = n(718736),
        a = n(892932)
      function o(e, t = []) {
        const [n, o] = (0, r.useState)(!1),
          s = (0, i.useFunctionalRefObject)(e)
        return (
          (0, r.useLayoutEffect)(() => {
            if (!a.PLATFORM_ACCESSIBILITY_ENABLED) return
            const e = s.current
            if (null === e) return
            const t = (e) => {
              switch (e.type) {
                case 'roving-tabindex:main-element':
                  o(!0)
                  break
                case 'roving-tabindex:secondary-element':
                  o(!1)
              }
            }
            return (
              e.addEventListener('roving-tabindex:main-element', t),
              e.addEventListener('roving-tabindex:secondary-element', t),
              () => {
                e.removeEventListener('roving-tabindex:main-element', t),
                  e.removeEventListener('roving-tabindex:secondary-element', t)
              }
            )
          }, t),
          [s, a.PLATFORM_ACCESSIBILITY_ENABLED ? (n ? 0 : -1) : void 0]
        )
      }
    },
    350159: (e) => {
      e.exports = {
        container: 'container-RoCcHn9S',
        active: 'active-RoCcHn9S',
        title: 'title-RoCcHn9S',
        inactive: 'inactive-RoCcHn9S',
        titleText: 'titleText-RoCcHn9S',
        indicator: 'indicator-RoCcHn9S',
        disconnected: 'disconnected-RoCcHn9S',
        failed: 'failed-RoCcHn9S',
        connecting: 'connecting-RoCcHn9S',
        connected: 'connected-RoCcHn9S',
        loginTooltip: 'loginTooltip-RoCcHn9S',
      }
    },
    311138: (e) => {
      e.exports = { tab: 'tab-jJ_D7IlA', accessible: 'accessible-jJ_D7IlA' }
    },
    486141: (e) => {
      e.exports = { wrapper: 'wrapper-k5swolgQ', text: 'text-k5swolgQ' }
    },
    828790: (e) => {
      e.exports = { wrapper: 'wrapper-mXzF5cTO', button: 'button-mXzF5cTO' }
    },
    793361: (e, t, n) => {
      n.d(t, { splitThousands: () => i })
      var r = n(150335)
      function i(e, t = '&nbsp;') {
        let n = e + ''
        ;-1 !== n.indexOf('e') &&
          (n = ((e) =>
            (0, r.fixComputationError)(e)
              .toFixed(10)
              .replace(/\.?0+$/, ''))(Number(e)))
        const i = n.split('.')
        return (
          i[0].replace(/\B(?=(\d{3})+(?!\d))/g, t) + (i[1] ? '.' + i[1] : '')
        )
      }
    },
    713264: (e, t, n) => {
      n.r(t), n.d(t, { getTerminalConfigSet: () => I })
      var r = n(609838)
      const i = {
        paper_trading: {
          name: 'paper_trading',
          title: r.t(null, void 0, n(477660)),
          buttonOpenTooltip: r.t(null, void 0, n(265115)),
          buttonCloseTooltip: r.t(null, void 0, n(924898)),
          ctor: null,
          _gaEvent: 'Trading Panel',
        },
        scripteditor: {
          name: 'scripteditor',
          title: r.t(null, void 0, n(603813)),
          buttonOpenTooltip: r.t(null, void 0, n(781414)),
          buttonCloseTooltip: r.t(null, void 0, n(193246)),
          ctor: null,
          _gaEvent: 'Pine Editor',
        },
        backtesting: {
          name: 'backtesting',
          title: r.t(null, void 0, n(876809)),
          buttonOpenTooltip: r.t(null, void 0, n(777278)),
          buttonCloseTooltip: r.t(null, void 0, n(83361)),
          ctor: null,
          _gaEvent: 'Strategy Tester',
        },
        screener: {
          name: 'screener',
          title: r.t(null, void 0, n(562286)),
          buttonOpenTooltip: r.t(null, void 0, n(991959)),
          buttonCloseTooltip: r.t(null, void 0, n(773071)),
          ctor: null,
          _gaEvent: 'Screener',
        },
      }
      var a = n(650151),
        o = n(382280),
        s = (n(656846), n(112235))
      class l {
        constructor(e) {
          ;(this._contentRenderer = Promise.resolve()),
            (this._spinnerContainer = document.createElement('div')),
            (this._offlineScreenContainer = document.createElement('div')),
            (this._renderer = Promise.resolve()),
            (this._bridge = e),
            (0, o.waitTradingService)().then((e) => {
              ;(this._trading = e),
                this.onStatusChange(e.connectStatus()),
                this._trading.onConnectionStatusChange.subscribe(
                  this,
                  this.onStatusChange,
                )
            }),
            n
              .e(7102)
              .then(n.bind(n, 974063))
              .then((e) => {
                e.render(this._spinnerContainer)
              }),
            (0, s.renderOfflineScreen)(
              (0, a.ensureDefined)(this._offlineScreenContainer),
            )
        }
        activate() {
          this._contentRenderer.then(() => {
            this._content &&
              this._content.drawAttention &&
              this._content.drawAttention()
          })
        }
        onStatusChange(e, t) {
          this._connectStatus !== e &&
            ((this._connectStatus = this._trading.connectStatus()),
            window.navigator.onLine
              ? ((this._contentRenderer = Promise.resolve()),
                this._content && this._content.remove(),
                2 === e && this._renderSpinner(),
                3 !== e && 4 !== e
                  ? 1 === e &&
                    this._renderAccountManager(this._trading.activeBroker())
                  : this._renderSpinner())
              : this._renderOfflineScreen())
        }
        _renderSpinner() {
          ;(this._bridge.container.innerText = ''),
            (this._content = this._bridge.container.appendChild(
              this._spinnerContainer,
            ))
        }
        _renderOfflineScreen() {
          ;(this._bridge.container.innerText = ''),
            (this._content = this._bridge.container.appendChild(
              this._offlineScreenContainer,
            ))
        }
        async _createAccountManager(e) {
          const { AccountManager: t } = await Promise.all([
              n.e(2666),
              n.e(4015),
              n.e(3842),
              n.e(6),
              n.e(5649),
              n.e(8056),
              n.e(5993),
              n.e(2639),
              n.e(3502),
              n.e(9842),
              n.e(7080),
              n.e(6747),
              n.e(6884),
              n.e(4578),
              n.e(2486),
              n.e(2251),
              n.e(5896),
              n.e(6874),
              n.e(2069),
              n.e(9255),
              n.e(8210),
              n.e(5267),
              n.e(8951),
              n.e(4811),
              n.e(8413),
              n.e(3637),
              n.e(2874),
              n.e(5951),
              n.e(8354),
            ]).then(n.bind(n, 225604)),
            { SummaryFieldsVisibilityManager: r } = await Promise.all([
              n.e(2666),
              n.e(4015),
              n.e(3842),
              n.e(6),
              n.e(5649),
              n.e(8056),
              n.e(5993),
              n.e(2639),
              n.e(3502),
              n.e(9842),
              n.e(7080),
              n.e(6747),
              n.e(6884),
              n.e(4578),
              n.e(2486),
              n.e(2251),
              n.e(5896),
              n.e(6874),
              n.e(2069),
              n.e(9255),
              n.e(8210),
              n.e(5267),
              n.e(8951),
              n.e(4811),
              n.e(8413),
              n.e(3637),
              n.e(2874),
              n.e(5951),
              n.e(8354),
            ]).then(n.bind(n, 241347))
          if (this._contentRenderer !== this._renderer) return
          this._content && this._content.remove()
          const i = new r(
            (0, a.ensureNotNull)(e).accountManagerInfo().summary,
            this._trading.getBrokerTradingSettingsStorage,
          )
          this._content = await t.create({
            broker: e,
            bridge: this._bridge,
            mode: 1,
            summaryFieldsVisibilityManager: i,
          })
        }
        _renderAccountManager(e) {
          this._renderer = this._contentRenderer = this._createAccountManager(e)
        }
        _renderBrokerSelectScreen() {
          0
        }
      }
      var c = n(50959),
        d = n(497754),
        u = n.n(d),
        p = n(156963),
        h = n(247465),
        g = n(481330),
        m = n(17212),
        S = n(898237),
        T = n(865266),
        _ = n(828790)
      const v = r.t(null, void 0, n(287085))
      function k(e) {
        const {
            onClick: t,
            onWidthChange: i,
            tradeButtonWidth: a,
            showHint: o,
            isActive: s,
          } = e,
          [, l] = (0, T.useRovingTabindexElement)(null),
          d = (0, c.useRef)(null)
        return (
          (0, c.useEffect)(() => {
            var e, t
            i(
              null !==
                (t =
                  null === (e = d.current) || void 0 === e
                    ? void 0
                    : e.offsetWidth) && void 0 !== t
                ? t
                : 0,
            )
          }, []),
          c.createElement(
            'div',
            { className: _.wrapper, ref: d },
            c.createElement(
              S.LightButton,
              {
                size: 'xsmall',
                color: 'gray',
                onClick: t,
                variant: s ? 'primary' : 'secondary',
                title: r.t(null, void 0, n(629208)),
                className: u()('apply-common-tooltip', _.button),
                'area-label': r.t(null, void 0, n(629208)),
                tabIndex: l,
                'data-name': 'trade-panel-button',
              },
              v,
              !1,
            ),
          )
        )
      }
      var f = n(350159)
      const b = r.t(null, void 0, n(537435)),
        y = p.enabled('dom_widget') || p.enabled('order_panel'),
        L = { 4: 'failed', 2: 'connecting', 1: 'connected', 3: 'disconnected' },
        P = {
          4: r.t(null, void 0, n(46287)),
          2: r.t(null, void 0, n(413859)),
          1: r.t(null, void 0, n(200304)),
          3: r.t(null, void 0, n(698585)),
        }
      class C extends c.PureComponent {
        constructor(e) {
          super(e),
            (this._trading = null),
            (this._tradingServiceCancelable = null),
            (this._titleClick = () => {
              const { onClick: e } = this.props
              e && e()
            }),
            (this._update = () => {
              const e = this._trading,
                t = e && e.activeBroker(),
                n = e ? e.connectStatus() : 3,
                r = null !== e,
                i = !!r && e.tradingPanel.isOpeningAvailable.value(),
                a = !!r && e.tradingPanel.isOpened.value(),
                o = window.is_authenticated && r && null !== t && 1 === n
              this.setState({
                status: n,
                hasActiveBroker: o,
                title: o ? t.accountManagerInfo().accountTitle : b,
                isOpeningTradingPanelAvailable: i,
                isTradingPanelOpened: a,
              })
            }),
            (this._handleClickTradeButton = () => {
              null !== this._trading &&
                this._trading.toggleTradingPanelVisibility()
            }),
            (this.state = {
              status: 3,
              hasActiveBroker: !1,
              title: b,
              isOpeningTradingPanelAvailable: !1,
              isTradingPanelOpened: !1,
              tradeButtonWidth: 0,
            })
        }
        componentDidMount() {
          const e = (0, o.tradingService)()
          null === e
            ? ((this._tradingServiceCancelable = (0, h.makeCancelable)(
                (0, o.waitTradingService)(),
              )),
              this._tradingServiceCancelable.promise.then(
                this._onTradingService.bind(this),
              ))
            : this._onTradingService(e)
        }
        componentWillUnmount() {
          this._cancelWaitingTrading(),
            null !== this._trading &&
              (this._trading.onBrokerChange.unsubscribe(this, this._update),
              this._trading.onConnectionStatusChange.unsubscribe(
                this,
                this._update,
              ),
              this._trading.tradingPanel.isOpeningAvailable.unsubscribe(
                this._update,
              ),
              this._trading.tradingPanel.isOpened.unsubscribe(this._update))
        }
        render() {
          const {
              status: e,
              hasActiveBroker: t,
              title: n,
              tradeButtonWidth: r,
              isOpeningTradingPanelAvailable: i,
            } = this.state,
            a = (1 === e || t) && y && i,
            o = { '--trade-button-width': a ? r : 0 }
          return c.createElement(
            c.Fragment,
            null,
            c.createElement(
              m.FooterToolbarTab,
              {
                style: o,
                className: d(
                  g.bottomTradingTabClassName,
                  this.props.tooltip && 'apply-common-tooltip',
                  f.container,
                  f[L[e]],
                  { [f.active]: this.props.isActive, [f.inactive]: !t },
                ),
                onClick: this._titleClick,
                'data-name': this.props.dataName,
                'data-active': this.props.isActive,
                'aria-pressed': this.props.isActive,
                tooltip: this.props.tooltip,
              },
              c.createElement(
                'span',
                { className: f.title },
                c.createElement('span', { className: f.titleText }, n),
              ),
              c.createElement('div', {
                className: d(f.indicator, 'apply-common-tooltip'),
                title: P[e],
              }),
            ),
            a &&
              c.createElement(k, {
                onClick: this._handleClickTradeButton,
                tradeButtonWidth: r,
                onWidthChange: (e) =>
                  this.setState({ ...this.state, tradeButtonWidth: e }),
                showHint: void 0 !== this.props.dataName,
                isActive: this.state.isTradingPanelOpened,
              }),
          )
        }
        _onTradingService(e) {
          this._cancelWaitingTrading(),
            (this._trading = e),
            e.onBrokerChange.subscribe(this, this._update),
            e.onConnectionStatusChange.subscribe(this, this._update),
            e.tradingPanel.isOpeningAvailable.subscribe(this._update),
            e.tradingPanel.isOpened.subscribe(this._update),
            this._update()
        }
        _cancelWaitingTrading() {
          null !== this._tradingServiceCancelable &&
            (this._tradingServiceCancelable.cancel(),
            (this._tradingServiceCancelable = null))
        }
      }
      var E = n(372605)
      function I() {
        const e = {
          paper_trading: {
            ctor: l,
            customTitleComponent: C,
            buttonOpenTooltip: r.t(null, void 0, n(35554)),
            buttonCloseTooltip: r.t(null, void 0, n(906052)),
          },
        }
        return (0, E.merge)((0, E.clone)(i), e)
      }
    },
    17212: (e, t, n) => {
      n.d(t, { FooterToolbarTab: () => c })
      var r = n(50959),
        i = n(497754),
        a = n.n(i),
        o = n(865266),
        s = n(892932),
        l = n(311138)
      function c(e) {
        const { tooltip: t, children: n, className: i, ...c } = e,
          [d, u] = (0, o.useRovingTabindexElement)(null),
          p = s.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div'
        return r.createElement(
          p,
          {
            'aria-label': s.PLATFORM_ACCESSIBILITY_ENABLED ? t : void 0,
            ...c,
            ref: d,
            tabIndex: u,
            type: s.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : void 0,
            'data-tooltip': t,
            className: a()(
              l.tab,
              s.PLATFORM_ACCESSIBILITY_ENABLED && l.accessible,
              i,
            ),
          },
          n,
        )
      }
    },
    112235: (e, t, n) => {
      n.d(t, { OfflineScreen: () => s, renderOfflineScreen: () => l })
      var r = n(50959),
        i = n(500962),
        a = n(609838),
        o = n(486141)
      function s() {
        return r.createElement(
          'div',
          { className: o.wrapper },
          r.createElement(
            'p',
            { className: o.text },
            a.t(null, void 0, n(394021)),
          ),
        )
      }
      function l(e) {
        i.render(r.createElement(s, null), e)
      }
    },
    656846: (e, t, n) => {
      var r, i, a, o, s, l, c, d, u, p, h, g, m, S, T
      n.d(t, {
        AccountType: () => g,
        BracketType: () => d,
        DisconnectType: () => m,
        OrderOrPositionMessageType: () => h,
        PipValueType: () => S,
        RestrictionType: () => T,
        TradingEntityType: () => l,
      }),
        ((e) => {
          ;(e[(e.CONNECTED = 1)] = 'CONNECTED'),
            (e[(e.CONNECTING = 2)] = 'CONNECTING'),
            (e[(e.DISCONNECTED = 3)] = 'DISCONNECTED'),
            (e[(e.ERROR = 4)] = 'ERROR')
        })(r || (r = {})),
        ((e) => {
          ;(e[(e.LIMIT = 1)] = 'LIMIT'),
            (e[(e.MARKET = 2)] = 'MARKET'),
            (e[(e.STOP = 3)] = 'STOP'),
            (e[(e.STOPLIMIT = 4)] = 'STOPLIMIT')
        })(i || (i = {})),
        ((e) => {
          ;(e[(e.BUY = 1)] = 'BUY'), (e[(e.SELL = -1)] = 'SELL')
        })(a || (a = {})),
        ((e) => {
          ;(e[(e.CANCELED = 1)] = 'CANCELED'),
            (e[(e.FILLED = 2)] = 'FILLED'),
            (e[(e.INACTIVE = 3)] = 'INACTIVE'),
            (e[(e.PLACING = 4)] = 'PLACING'),
            (e[(e.REJECTED = 5)] = 'REJECTED'),
            (e[(e.WORKING = 6)] = 'WORKING')
        })(o || (o = {})),
        ((e) => {
          ;(e[(e.ALL = 0)] = 'ALL'),
            (e[(e.CANCELED = 1)] = 'CANCELED'),
            (e[(e.FILLED = 2)] = 'FILLED'),
            (e[(e.INACTIVE = 3)] = 'INACTIVE'),
            (e[(e.REJECTED = 5)] = 'REJECTED'),
            (e[(e.WORKING = 6)] = 'WORKING')
        })(s || (s = {})),
        ((e) => {
          ;(e[(e.Order = 1)] = 'Order'), (e[(e.Position = 2)] = 'Position')
        })(l || (l = {})),
        ((e) => {
          ;(e[(e.ORDER = 1)] = 'ORDER'), (e[(e.POSITION = 2)] = 'POSITION')
        })(c || (c = {})),
        ((e) => {
          ;(e[(e.StopLoss = 0)] = 'StopLoss'),
            (e[(e.TakeProfit = 1)] = 'TakeProfit'),
            (e[(e.TrailingStop = 2)] = 'TrailingStop')
        })(d || (d = {})),
        ((e) => {
          ;(e[(e.LIMITPRICE = 1)] = 'LIMITPRICE'),
            (e[(e.STOPPRICE = 2)] = 'STOPPRICE'),
            (e[(e.TAKEPROFIT = 3)] = 'TAKEPROFIT'),
            (e[(e.STOPLOSS = 4)] = 'STOPLOSS')
        })(u || (u = {})),
        ((e) => {
          ;(e[(e.ERROR = 0)] = 'ERROR'), (e[(e.SUCCESS = 1)] = 'SUCCESS')
        })(p || (p = {})),
        ((e) => {
          ;(e.Information = 'information'),
            (e.Warning = 'warning'),
            (e.Error = 'error')
        })(h || (h = {})),
        ((e) => {
          ;(e.Demo = 'demo'), (e.Live = 'live')
        })(g || (g = {})),
        ((e) => {
          ;(e[(e.LogOut = 0)] = 'LogOut'),
            (e[(e.FailedRestoring = 1)] = 'FailedRestoring'),
            (e[(e.Offline = 2)] = 'Offline'),
            (e[(e.APIError = 3)] = 'APIError'),
            (e[(e.TwoFactorRequired = 4)] = 'TwoFactorRequired'),
            (e[(e.CancelAuthorization = 5)] = 'CancelAuthorization'),
            (e[(e.TimeOutForAuthorization = 6)] = 'TimeOutForAuthorization'),
            (e[(e.OauthError = 7)] = 'OauthError'),
            (e[(e.BrokenConnection = 8)] = 'BrokenConnection'),
            (e[(e.FailedSignIn = 9)] = 'FailedSignIn')
        })(m || (m = {})),
        ((e) => {
          ;(e[(e.None = 0)] = 'None'),
            (e[(e.Pips = 1)] = 'Pips'),
            (e[(e.Ticks = 2)] = 'Ticks')
        })(S || (S = {})),
        ((e) => {
          ;(e.Halted = 'HALTED'),
            (e.NotShortable = 'NOT-SHORTABLE'),
            (e.HardToBorrow = 'HARD-TO-BORROW')
        })(T || (T = {}))
    },
    282729: (e, t, n) => {
      var r
      n.d(t, { StopType: () => r }),
        ((e) => {
          ;(e[(e.StopLoss = 0)] = 'StopLoss'),
            (e[(e.TrailingStop = 1)] = 'TrailingStop')
        })(r || (r = {}))
    },
    484095: (e, t, n) => {
      function r(e) {
        return e instanceof i
      }
      n.d(t, { UserFriendlyError: () => i, isUserFriendlyError: () => r })
      class i extends Error {
        constructor({
          detailedErrorMessage: e,
          userFriendlyMessage: t,
          cause: n,
        }) {
          super(t),
            (this.name = 'UserFriendlyError'),
            (this.detailedErrorMessage = e),
            (this.cause = n)
        }
      }
    },
    637401: (e, t, n) => {
      n.d(t, {
        getErrorCauses: () => I,
        getErrorMessage: () => C,
        getLoggerMessage: () => E,
        isFinalOrderStatus: () => y,
        makeNonTradableSymbolText: () => P,
        orderStatusToText: () => T,
        orderTypeToText: () => k,
        positionSideToText: () => L,
        roundToStepByPriceTypeAndSide: () => f,
        roundUpToPowerOf10: () => b,
        sideToText: () => v,
      })
      var r = n(609838),
        i = n(960521),
        a = n(656846),
        o = n(282729),
        s = (n(793361), n(372605), n(6835)),
        l = n(311757),
        c = (n(802778), n(484095))
      const d = { 2: {}, 1: {} },
        u = { 2: {}, 1: {} },
        p = {},
        h = {},
        g = {}
      let m = !1
      ;(0, s.getLogger)('Trading.Utils')
      var S
      !((e) => {
        ;(e[(e.Unauthorized = 401)] = 'Unauthorized'),
          (e[(e.TooManyRequests = 429)] = 'TooManyRequests')
      })(S || (S = {}))
      r.t(null, void 0, n(378505))
      function T(e) {
        return _(), g[e]
      }
      function _() {
        m ||
          ((m = !0),
          (d[2][2] = r.t(null, { context: 'Market order' }, n(610952))),
          (d[2][1] = r.t(null, { context: 'Limit order' }, n(382377))),
          (d[2][3] = r.t(null, { context: 'order' }, n(608921))),
          (d[2][4] = r.t(null, { context: 'Stop limit order' }, n(779062))),
          (d[1][2] = r.t(null, void 0, n(359758))),
          (d[1][1] = r.t(null, void 0, n(398157))),
          (d[1][3] = r.t(null, { context: 'order' }, n(7122))),
          (d[1][4] = r.t(null, void 0, n(900853))),
          (u[2][a.BracketType.TakeProfit] = r.t(
            null,
            { context: 'Take profit order' },
            n(347947),
          )),
          (u[2][a.BracketType.StopLoss] = r.t(
            null,
            { context: 'Stop loss order' },
            n(15307),
          )),
          (u[2][a.BracketType.TrailingStop] = r.t(
            null,
            { context: 'Trailing stop order' },
            n(154462),
          )),
          (u[1][a.BracketType.TakeProfit] = r.t(null, void 0, n(129266))),
          (u[1][a.BracketType.StopLoss] = r.t(null, void 0, n(241648))),
          (u[1][a.BracketType.TrailingStop] = r.t(null, void 0, n(86430))),
          (p[1] = r.t(null, { context: 'trading' }, n(63470))),
          (p[-1] = r.t(null, { context: 'trading' }, n(742259))),
          (h[1] = r.t(null, { context: 'trading' }, n(274771))),
          (h[-1] = r.t(null, { context: 'trading' }, n(951219))),
          (g[2] = r.t(null, void 0, n(885323))),
          (g[1] = r.t(null, void 0, n(767207))),
          (g[6] = r.t(null, void 0, n(328231))),
          (g[3] = r.t(null, void 0, n(614841))),
          (g[4] = r.t(null, void 0, n(373425))),
          (g[5] = r.t(null, void 0, n(442060))))
      }
      function v(e, t) {
        _()
        const n = p[e]
        return t ? n.toUpperCase() : n
      }
      function k(e) {
        const {
          orderType: t,
          uppercase: n,
          shorten: r,
          parentId: i,
          stopType: s,
        } = e
        _()
        const l = r ? 2 : 1
        let c = d,
          p = t
        return (
          void 0 !== i &&
            ((c = u),
            3 === t &&
              (p =
                s === o.StopType.TrailingStop
                  ? a.BracketType.TrailingStop
                  : a.BracketType.StopLoss),
            1 === t && (p = a.BracketType.TakeProfit)),
          n ? c[l][p].toUpperCase() : c[l][p]
        )
      }
      function f(e, t, n, r) {
        const a = (0, i.Big)(e).div(t)
        return (1 === n && 1 === r) || (2 === n && -1 === r)
          ? a.round(0, 0).mul(t).toNumber()
          : (1 === n && -1 === r) || (2 === n && 1 === r)
            ? a.round(0, 3).mul(t).toNumber()
            : 0
      }
      r.t(null, void 0, n(609372))
      function b(e) {
        const t = Math.ceil(Math.log10(e))
        return (0, i.Big)(10).pow(t).toNumber()
      }
      function y(e) {
        return -1 !== [2, 1, 5].indexOf(e)
      }
      function L(e) {
        return _(), h[e]
      }
      function P(e, t) {
        return r
          .t(null, void 0, n(221456))
          .replace('{symbol}', e)
          .replace('{broker}', t)
      }
      function C(e) {
        if (void 0 === e) return r.t(null, void 0, n(328523))
        let t
        return (
          (t =
            e instanceof Error
              ? e.message
              : 'object' == typeof e
                ? JSON.stringify(e)
                : e.toString()),
          (0, l.removeTags)(t)
        )
      }
      function E(e) {
        return e instanceof c.UserFriendlyError
          ? (0, l.removeTags)(e.detailedErrorMessage)
          : C(e)
      }
      a.BracketType.StopLoss,
        r.t(null, void 0, n(241648)),
        a.BracketType.TakeProfit,
        r.t(null, void 0, n(129266)),
        a.BracketType.TrailingStop,
        r.t(null, void 0, n(86430)),
        a.BracketType.StopLoss,
        a.BracketType.TakeProfit,
        a.BracketType.TrailingStop
      new Set([
        'date',
        'dateOrDateTime',
        'default',
        'fixed',
        'variablePrecision',
        'formatQuantity',
        'formatPrice',
        'formatPriceForexSup',
        'integerSeparated',
        'localDate',
        'localDateOrDateTime',
        'percentage',
        'pips',
        'profit',
        'profitInInstrumentCurrency',
        'side',
        'positionSide',
        'status',
        'symbol',
        'text',
        'type',
        'marginPercent',
        'empty',
      ])
      function I(e) {
        return (0, c.isUserFriendlyError)(e) && void 0 !== e.cause
          ? [...I(e.cause), e.cause]
          : [e]
      }
    },
    481330: (e, t, n) => {
      n.d(t, {
        addAsciiDotIfTextDoesNotEndWithSentenceEndingMark: () => X,
        adjustSavedCustomFieldsValues: () => B,
        alignToMinTick: () => te,
        bottomTradingTabClassName: () => g,
        brokersListFromPlans: () => m,
        checkIsExistingPosition: () => G,
        convertActionDescriptionsToActions: () => _,
        executionText: () => T,
        filterDurationsByOrderType: () => w,
        filterDurationsBySymbolDurations: () => A,
        findDurationMetaInfo: () => D,
        formatValue: () => q,
        getAsk: () => j,
        getBid: () => F,
        getCryptoBalanceValue: () => Z,
        getCurrency: () => b,
        getDefaultOrderType: () => R,
        getLast: () => W,
        getOrderDuration: () => M,
        getOrderPrice: () => J,
        getPlatform: () => K,
        getPriceStep: () => V,
        getQuotePrice: () => U,
        getTimestamp: () => N,
        isBatsQuotes: () => E,
        isBrokerSupportOrderModification: () => L,
        isDefined: () => I,
        isMintickMultiple: () => Y,
        isModifyOrderSupported: () => P,
        isMoveOrderSupported: () => C,
        isNoQuotes: () => H,
        isOAuthAuthType: () => S,
        isOrderActive: () => v,
        isOrderTypeAllowed: () => ee,
        makeBrokerSideMaintananceFeatureToggleName: () => k,
        makeDatePlus24UTCHours: () => O,
        makeInitialOrderDuration: () => x,
        makeMaintananceFeatureToggleName: () => f,
        makeOrderDuration: () => z,
        orderStatusToText: () => p.orderStatusToText,
        roundToStepRequired: () => Q,
      })
      var r = n(960521),
        i = n(650151),
        a = n(372605),
        o = n(601227),
        s = n(69111),
        l = n(282729),
        c = n(758265),
        d = n(973602),
        u = n(807107),
        p = n(637401)
      const h = 'Paper',
        g = 'js-bottom-trading-tab'
      function m(e, t) {
        const n = new Map(e.map((e) => [e.id, e])),
          r = new Map(t.map((e) => [e.slug_name, e])),
          a = [{ metainfo: (0, i.ensureDefined)(n.get(h)) }]
        return (
          t.forEach((e) => {
            n.has(e.slug_name) &&
              a.push({
                metainfo: (0, i.ensureDefined)(n.get(e.slug_name)),
                brokerPlan: e,
              })
          }),
          e.forEach((e) => {
            r.has(e.id) || e.id === h || a.push({ metainfo: e })
          }),
          a
        )
      }
      function S(e) {
        return (
          void 0 !== e &&
          ['oauth', 'oauth2-implicit-flow', 'oauth2-code-flow'].includes(e)
        )
      }
      function T(e, t) {
        const n =
          (0, p.sideToText)(e.side) + ' ' + e.qty + ' @ ' + t.format(e.price)
        return n.substring(0, 1).toUpperCase() + n.substring(1).toLowerCase()
      }
      function _(e) {
        return e
          ? e.map((e) =>
              '-' === e.text || e.separator
                ? new d.Separator()
                : new c.ActionWithStandardIcon({
                    actionId: 'Trading.CustomActionId',
                    options: {
                      name: e.name,
                      checkable: e.checkable,
                      checked: e.checked,
                      disabled: void 0 !== e.enabled && !e.enabled,
                      label: e.text,
                      statName: e.statName,
                      icon: e.icon,
                      iconId: e.iconId,
                      shortcutHint: e.shortcutHint,
                      onExecute: (t) => {
                        const n = t.getState()
                        e.action({
                          checkable: n.checkable,
                          checked: n.checked,
                          enabled: !n.disabled,
                          text: n.label,
                        })
                      },
                    },
                  }),
            )
          : []
      }
      function v(e) {
        return 6 === e || 3 === e
      }
      function k(e) {
        return `${e}-brokers-side-maintenance`.toLowerCase()
      }
      function f(e) {
        return `${e}-maintenance`.toLowerCase()
      }
      function b(e, t) {
        return (!t && e.currencySign) || e.currency || ''
      }
      function y(e, t) {
        return Boolean(
          void 0 !== e.parentId &&
            t.supportModifyBrackets &&
            ((t.supportTrailingStop && t.supportModifyTrailingStop) ||
              e.stopType !== l.StopType.TrailingStop),
        )
      }
      function L(e) {
        return (
          e.supportModifyOrderPrice ||
          e.supportEditAmount ||
          e.supportModifyBrackets ||
          !1
        )
      }
      function P(e, t) {
        const n = 2 !== e.type && void 0 === e.parentId && L(t),
          r = y(e, t)
        return n || r
      }
      function C(e, t) {
        const n = void 0 === e.parentId && t.supportModifyOrderPrice,
          r = y(e, t)
        return Boolean(n || r)
      }
      function E(e) {
        var t
        return (
          'BATS' ===
          (null === (t = e.originalName) || void 0 === t
            ? void 0
            : t.split(':')[0])
        )
      }
      function I(e) {
        return null != e
      }
      function O() {
        const e = new Date()
        return e.setUTCHours(e.getUTCHours() + 24), e
      }
      function D(e, t) {
        return e.find((e) => e.value === t)
      }
      function M(e) {
        const {
          orderDuration: t,
          orderType: n,
          savedDuration: r,
          orderDurations: i,
          symbolDurations: a,
        } = e
        if (void 0 !== t) return t
        const o = ((e) => {
          const {
            duration: t,
            orderDurations: n,
            orderType: r,
            symbolDurations: i,
          } = e
          if (null === t || void 0 === n) return null
          const a = A(n, i),
            o = D(w(a, null != r ? r : null), t.type)
          if (void 0 === o) return null
          if (void 0 !== t.datetime && (o.hasDatePicker || o.hasTimePicker)) {
            const e = 864e5,
              n = o.hasTimePicker
                ? t.datetime < Date.now()
                : Math.floor((t.datetime - Date.now()) / e) < 0
            t.datetime = n ? O().getTime() : t.datetime
          }
          return t
        })({ duration: r, orderType: n, orderDurations: i, symbolDurations: a })
        return null !== o ? { ...o } : x(n, i, a)
      }
      function x(e, t, n) {
        var r
        if (void 0 === t) return null
        const i = w(A(t, n), e)
        if (0 === i.length) return null
        return z(
          null !== (r = i.find((e) => e.default)) && void 0 !== r ? r : i[0],
        )
      }
      function z(e) {
        const t = { type: e.value }
        return (
          Boolean(e.hasTimePicker || e.hasDatePicker) && (t.datetime = N(O())),
          t
        )
      }
      function A(e, t) {
        return 0 === e.length || void 0 === t || 0 === t.length
          ? e
          : e.filter(({ value: e }) => t.includes(e))
      }
      function w(e, t) {
        const n = [1, 3, 4]
        return e.filter((e) => {
          var r
          const i = null !== (r = e.supportedOrderTypes) && void 0 !== r ? r : n
          return null === t || i.includes(t)
        })
      }
      function N(e) {
        return e.valueOf()
      }
      function B(e, t) {
        if (void 0 === t.customFields) return {}
        const n = {}
        return (
          t.customFields.forEach((t) => {
            var r
            const i = 'ComboBox' === t.inputType
            if (i && t.forceUserEnterInitialValue) return
            const a = i ? t.items[0].value : t.value,
              o = null !== (r = e[t.id]) && void 0 !== r ? r : a
            void 0 !== o && (n[t.id] = o)
          }),
          n
        )
      }
      function R(e) {
        return e.supportLimitOrders
          ? 1
          : e.supportMarketOrders
            ? 2
            : e.supportStopLimitOrders
              ? 4
              : e.supportStopOrders
                ? 3
                : void 0
      }
      function Y(e, t) {
        if (0 === t) return !1
        const n = Math.round(1e15 * t) / 1e15,
          i = new r.Big(e),
          a = new r.Big(n)
        return i.mod(a).eq(0)
      }
      function j(e) {
        return (0, a.isNumber)(e.ask)
          ? e.ask
          : (0, a.isNumber)(e.trade)
            ? e.trade
            : 0
      }
      function F(e) {
        return (0, a.isNumber)(e.bid)
          ? e.bid
          : (0, a.isNumber)(e.trade)
            ? e.trade
            : 0
      }
      function W(e) {
        return (0, a.isNumber)(e.trade) ? e.trade : 0
      }
      function H(e) {
        return null === e || void 0 === e.ask || void 0 === e.bid
      }
      function U(e, t) {
        return 1 === t ? j(e) : F(e)
      }
      function V(e) {
        const {
          priceType: t,
          minTick: n,
          price: r,
          variableMinTickData: i,
          limitPriceStep: a,
          stopPriceStep: o,
        } = e
        return 1 === t && void 0 !== a
          ? a
          : 2 === t && void 0 !== o
            ? o
            : void 0 !== i && void 0 !== r
              ? (0, u.getMinTick)({
                  minTick: n,
                  price: r,
                  variableMinTickData: i,
                })
              : n
      }
      function Q(e) {
        const {
          priceType: t,
          minTick: n,
          limitPriceStep: r,
          stopPriceStep: i,
        } = e
        return 1 === t && void 0 !== r
          ? r !== n
          : 2 === t && void 0 !== i && i !== n
      }
      function G(e) {
        return (
          void 0 !== e && (0 !== e.qty || 0 !== e.longQty || 0 !== e.shortQty)
        )
      }
      function K() {
        if ((0, o.isDesktopApp)()) return 'Desktop App'
        const e = (0, s.isOnMobileAppPage)('old')
        return o.CheckMobile.isIPad()
          ? e
            ? 'iPad App'
            : 'iPad Web'
          : o.CheckMobile.any()
            ? o.CheckMobile.Android()
              ? (0, s.isOnMobileAppPage)('new')
                ? 'Android App'
                : 'Android Web'
              : o.CheckMobile.iOS()
                ? e
                  ? 'iPhone App'
                  : 'iPhone Web'
                : 'Unknown Mobile Web'
            : 'Desktop Web'
      }
      function q(e, t) {
        if (null === e) return null
        const n = t.format(e)
        if (t.parse) {
          const e = t.parse(n)
          if (e.res) return e.value
        }
        return Number.parseFloat(n)
      }
      function Z({ balance: e, ...t }) {
        return null === e
          ? null
          : ((e) => {
              const { side: t, isExistingOrder: n, qty: i, orderPrice: a } = e
              return n && i && a
                ? -1 === t
                  ? new r.Big(i)
                  : new r.Big(i).mul(a)
                : new r.Big(0)
            })({ ...t })
              .plus(e.available)
              .toNumber()
      }
      function J(e, t) {
        switch (e.type) {
          case 1:
          case 4:
            return e.limitPrice
          case 3:
            return e.stopPrice
          default:
            return U(t, e.side)
        }
      }
      const $ = {
        visible: ['.', '｡', '。', '!', '?', '？', '！'],
        invisible: ['︀', '︁'],
      }
      function X(e) {
        const t = e.trim(),
          n = t.slice(-1),
          r = $.invisible.includes(n) ? t.charAt(t.length - 2) : n
        return $.visible.includes(r) ? t : t + '.'
      }
      function ee(e, t) {
        return void 0 === t || 0 === t.length || t.includes(e)
      }
      function te(e, t) {
        return t > 1 ? e : (0, r.Big)(e).div(t).round(0, 1).mul(t).toNumber()
      }
    },
    602948: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M3.92 7.83 9 12.29l5.08-4.46-1-1.13L9 10.29l-4.09-3.6-.99 1.14Z"/></svg>'
    },
    382377: (e) => {
      e.exports = {
        ar: 'Lmt',
        ca_ES: 'Lmt',
        cs: 'Lmt',
        de: 'Lmt',
        el: 'Lmt',
        en: 'Lmt',
        es: 'Lmt',
        fa: 'Lmt',
        fr: 'Lmt',
        he_IL: ['לימיט'],
        hu_HU: 'Lmt',
        id_ID: 'Lmt',
        it: 'Lmt',
        ja: ['指'],
        ko: ['지정가'],
        ms_MY: 'Lmt',
        nl_NL: 'Lmt',
        pl: 'Lmt',
        pt: 'Lmt',
        ro: 'Lmt',
        ru: ['Лмт'],
        sv: 'Lmt',
        th: ['ลิมิต'],
        tr: 'Lmt',
        vi: 'Lmt',
        zh: ['限价单'],
        zh_TW: ['限價單'],
      }
    },
    610952: (e) => {
      e.exports = {
        ar: 'Mkt',
        ca_ES: 'Mkt',
        cs: 'Mkt',
        de: 'Mkt',
        el: 'Mkt',
        en: 'Mkt',
        es: 'Mkt',
        fa: 'Mkt',
        fr: 'Mkt',
        he_IL: ['מארקט'],
        hu_HU: 'Mkt',
        id_ID: 'Mkt',
        it: 'Mkt',
        ja: ['成'],
        ko: ['시장가'],
        ms_MY: 'Mkt',
        nl_NL: 'Mkt',
        pl: 'Mkt',
        pt: 'Mkt',
        ro: 'Mkt',
        ru: ['Мкт'],
        sv: 'Mkt',
        th: ['มาร์เก็ต'],
        tr: 'Mkt',
        vi: 'Mkt',
        zh: ['市价单'],
        zh_TW: ['市價單'],
      }
    },
    779062: (e) => {
      e.exports = {
        ar: 'Stp lmt',
        ca_ES: 'Stp lmt',
        cs: 'Stp lmt',
        de: 'Stp lmt',
        el: 'Stp lmt',
        en: 'Stp lmt',
        es: 'Stp lmt',
        fa: 'Stp lmt',
        fr: 'Stp lmt',
        he_IL: ['סטופ לימיט'],
        hu_HU: 'Stp lmt',
        id_ID: 'Stp lmt',
        it: 'Stp lmt',
        ja: ['逆 (指値執行)'],
        ko: ['손실지정가'],
        ms_MY: 'Stp lmt',
        nl_NL: 'Stp lmt',
        pl: 'Stp lmt',
        pt: 'Stp lmt',
        ro: 'Stp lmt',
        ru: ['Стп-лмт'],
        sv: 'Stp lmt',
        th: ['สต๊อปลิมิต'],
        tr: 'Stp lmt',
        vi: 'Stp lmt',
        zh: ['止损限价单'],
        zh_TW: ['止損限價單'],
      }
    },
    15307: (e) => {
      e.exports = {
        ar: ['إيقاف الخسارة'],
        ca_ES: 'SL',
        cs: 'SL',
        de: 'SL',
        el: 'SL',
        en: 'SL',
        es: 'SL',
        fa: 'SL',
        fr: 'SL',
        he_IL: 'SL',
        hu_HU: 'SL',
        id_ID: 'SL',
        it: 'SL',
        ja: 'SL',
        ko: 'SL',
        ms_MY: 'SL',
        nl_NL: 'SL',
        pl: 'SL',
        pt: 'SL',
        ro: 'SL',
        ru: ['СЛ'],
        sv: 'SL',
        th: 'SL',
        tr: ['ZD'],
        vi: 'SL',
        zh: 'SL',
        zh_TW: 'SL',
      }
    },
    347947: (e) => {
      e.exports = {
        ar: ['جني الأرباح'],
        ca_ES: 'TP',
        cs: 'TP',
        de: 'TP',
        el: 'TP',
        en: 'TP',
        es: 'TP',
        fa: 'TP',
        fr: 'TP',
        he_IL: 'TP',
        hu_HU: 'TP',
        id_ID: 'TP',
        it: 'TP',
        ja: 'TP',
        ko: 'TP',
        ms_MY: 'TP',
        nl_NL: 'TP',
        pl: 'TP',
        pt: 'TP',
        ro: 'TP',
        ru: ['ТП'],
        sv: 'TP',
        th: 'TP',
        tr: ['KA'],
        vi: 'TP',
        zh: 'TP',
        zh_TW: 'TP',
      }
    },
    154462: (e) => {
      e.exports = {
        ar: ['وقف متحرك'],
        ca_ES: 'TRAIL',
        cs: 'TRAIL',
        de: 'TRAIL',
        el: 'TRAIL',
        en: 'TRAIL',
        es: 'TRAIL',
        fa: 'TRAIL',
        fr: 'TRAIL',
        he_IL: ['TRAIL נגרר'],
        hu_HU: 'TRAIL',
        id_ID: 'TRAIL',
        it: 'TRAIL',
        ja: 'TRAIL',
        ko: ['트레일'],
        ms_MY: 'TRAIL',
        nl_NL: 'TRAIL',
        pl: 'TRAIL',
        pt: 'TRAIL',
        ro: 'TRAIL',
        ru: ['Трейлинг-стоп'],
        sv: 'TRAIL',
        th: ['เส้นทาง'],
        tr: ['İZLEYEN'],
        vi: ['RAY'],
        zh: 'TRAIL',
        zh_TW: 'TRAIL',
      }
    },
    7122: (e) => {
      e.exports = {
        ar: ['إيقاف'],
        ca_ES: 'Stop',
        cs: 'Stop',
        de: 'Stop',
        el: 'Stop',
        en: 'Stop',
        es: 'Stop',
        fa: 'Stop',
        fr: 'Stop',
        he_IL: ['עצור'],
        hu_HU: 'Stop',
        id_ID: 'Stop',
        it: 'Stop',
        ja: ['逆指値'],
        ko: ['스탑'],
        ms_MY: ['Renti'],
        nl_NL: 'Stop',
        pl: 'Stop',
        pt: 'Stop',
        ro: 'Stop',
        ru: ['Стоп'],
        sv: ['Stopp'],
        th: ['หยุด'],
        tr: 'Stop',
        vi: ['Lệnh dừng'],
        zh: ['止损'],
        zh_TW: ['停損'],
      }
    },
    608921: (e) => {
      e.exports = {
        ar: 'Stp',
        ca_ES: 'Stp',
        cs: 'Stp',
        de: 'Stp',
        el: 'Stp',
        en: 'Stp',
        es: 'Stp',
        fa: 'Stp',
        fr: 'Stp',
        he_IL: ['סטופ'],
        hu_HU: 'Stp',
        id_ID: 'Stp',
        it: 'Stp',
        ja: ['逆'],
        ko: ['역지정가'],
        ms_MY: 'Stp',
        nl_NL: 'Stp',
        pl: 'Stp',
        pt: 'Stp',
        ro: 'Stp',
        ru: ['Стп'],
        sv: 'Stp',
        th: ['สต๊อป'],
        tr: 'Stp',
        vi: 'Stp',
        zh: ['止损单'],
        zh_TW: ['止損單'],
      }
    },
    63470: (e) => {
      e.exports = {
        ar: ['شراء'],
        ca_ES: ['Compra'],
        cs: 'Buy',
        de: 'Buy',
        el: 'Buy',
        en: 'Buy',
        es: ['Comprar'],
        fa: 'Buy',
        fr: ['Acheter'],
        he_IL: ['קניה'],
        hu_HU: 'Buy',
        id_ID: ['Beli'],
        it: ['Compra'],
        ja: ['買い'],
        ko: ['바이'],
        ms_MY: ['Beli'],
        nl_NL: 'Buy',
        pl: ['Kupno'],
        pt: ['Comprar'],
        ro: 'Buy',
        ru: ['Покупка'],
        sv: ['Köp'],
        th: ['ซื้อ'],
        tr: ['Al'],
        vi: ['Mua'],
        zh: ['买入'],
        zh_TW: ['買入'],
      }
    },
    274771: (e) => {
      e.exports = {
        ar: ['شراء'],
        ca_ES: ['Llarg'],
        cs: 'Long',
        de: 'Long',
        el: 'Long',
        en: 'Long',
        es: ['Largo'],
        fa: 'Long',
        fr: ['long'],
        he_IL: ['לונג'],
        hu_HU: 'Long',
        id_ID: ['Pembelian'],
        it: 'Long',
        ja: ['ロング'],
        ko: ['매수'],
        ms_MY: ['Panjang'],
        nl_NL: 'Long',
        pl: 'Long',
        pt: ['Comprado'],
        ro: 'Long',
        ru: ['Длинная'],
        sv: ['Lång'],
        th: ['การ buy'],
        tr: ['Uzun'],
        vi: ['Vị thế Mua'],
        zh: ['做多'],
        zh_TW: ['做多'],
      }
    },
    742259: (e) => {
      e.exports = {
        ar: ['بيع'],
        ca_ES: ['Ven'],
        cs: 'Sell',
        de: 'Sell',
        el: 'Sell',
        en: 'Sell',
        es: ['Vender'],
        fa: 'Sell',
        fr: ['Vendre'],
        he_IL: ['מכירה'],
        hu_HU: 'Sell',
        id_ID: ['Jual'],
        it: ['Vendi'],
        ja: ['売り'],
        ko: ['셀'],
        ms_MY: ['Jual'],
        nl_NL: 'Sell',
        pl: ['Sprzedaż'],
        pt: ['Vender'],
        ro: 'Sell',
        ru: ['Продажа'],
        sv: ['Sälj'],
        th: ['ขาย'],
        tr: ['Sat'],
        vi: ['Bán'],
        zh: ['卖出'],
        zh_TW: ['賣出'],
      }
    },
    951219: (e) => {
      e.exports = {
        ar: ['بيع على المكشوف'],
        ca_ES: ['Curt'],
        cs: 'Short',
        de: 'Short',
        el: 'Short',
        en: 'Short',
        es: ['Corto'],
        fa: 'Short',
        fr: ['court'],
        he_IL: ['שורט'],
        hu_HU: 'Short',
        id_ID: ['Penjualan'],
        it: 'Short',
        ja: ['ショート'],
        ko: ['매도'],
        ms_MY: ['Singkat'],
        nl_NL: 'Short',
        pl: 'Short',
        pt: ['Vendido'],
        ro: 'Short',
        ru: ['Короткая'],
        sv: ['Kort'],
        th: ['การ sell'],
        tr: ['Kısa'],
        vi: ['Vị thế Bán'],
        zh: ['做空'],
        zh_TW: ['做空'],
      }
    },
    200304: (e) => {
      e.exports = {
        ar: ['تم الاتصال'],
        ca_ES: 'Connected',
        cs: 'Connected',
        de: ['Verbunden'],
        el: 'Connected',
        en: 'Connected',
        es: ['Conectado'],
        fa: 'Connected',
        fr: ['Connecté'],
        he_IL: ['מחובר'],
        hu_HU: ['Csatlakoztatva'],
        id_ID: ['Terhubung'],
        it: ['Connesso'],
        ja: ['接続されました'],
        ko: ['연결됨'],
        ms_MY: ['Bersambung'],
        nl_NL: 'Connected',
        pl: ['Połączony'],
        pt: ['Conectado'],
        ro: 'Connected',
        ru: ['Подключено'],
        sv: ['Ansluten'],
        th: ['เชื่อมต่อแล้ว'],
        tr: ['Bağlandı'],
        vi: ['Đã kết nối'],
        zh: ['已连接'],
        zh_TW: ['已連接'],
      }
    },
    413859: (e) => {
      e.exports = {
        ar: ['جاري الاتصال'],
        ca_ES: ['Connectant'],
        cs: 'Connecting',
        de: ['Es wird verbunden'],
        el: 'Connecting',
        en: 'Connecting',
        es: ['Conectando'],
        fa: 'Connecting',
        fr: ['Connexion'],
        he_IL: ['מתחבר'],
        hu_HU: ['Csatlakozás'],
        id_ID: ['Menghubungkan'],
        it: ['Connessione in corso...'],
        ja: ['接続中'],
        ko: ['연결중'],
        ms_MY: ['Sedang disambungkan'],
        nl_NL: 'Connecting',
        pl: ['Podłączanie'],
        pt: ['Conectando'],
        ro: 'Connecting',
        ru: ['Идет соединение'],
        sv: ['Ansluter'],
        th: ['กำลังเชื่อมต่อ'],
        tr: ['Bağlanıyor'],
        vi: ['Đang kết nối'],
        zh: ['正在连接'],
        zh_TW: ['正在連接'],
      }
    },
    773071: (e) => {
      e.exports = {
        ar: ['إغلق الفلترة'],
        ca_ES: 'Close Screener',
        cs: 'Close Screener',
        de: ['Screener schließen'],
        el: 'Close Screener',
        en: 'Close Screener',
        es: ['Cerrar analizador'],
        fa: 'Close Screener',
        fr: ['Fermer le screener'],
        he_IL: ['סגור סורק'],
        hu_HU: 'Close Screener',
        id_ID: ['Tutup Penyaring'],
        it: ['Chiudi screener'],
        ja: ['スクリーナーを閉じる'],
        ko: ['스크리너 닫기'],
        ms_MY: ['Tutup Penyaring'],
        nl_NL: 'Close Screener',
        pl: ['Zamknij Skaner'],
        pt: ['Fechar o Rastreador'],
        ro: 'Close Screener',
        ru: ['Закрыть Скринер'],
        sv: ['Stäng Screener'],
        th: ['ปิดตัวช่วยคัดกรอง'],
        tr: ['Takipçiyi Kapat'],
        vi: ['Đóng Bộ lọc'],
        zh: ['关闭筛选器'],
        zh_TW: ['關閉篩選器'],
      }
    },
    83361: (e) => {
      e.exports = {
        ar: ['أغلق اختبار الاستراتيجيات'],
        ca_ES: 'Close Strategy Tester',
        cs: 'Close Strategy Tester',
        de: ['Strategie-Tester schließen'],
        el: 'Close Strategy Tester',
        en: 'Close Strategy Tester',
        es: ['Cerrar Simulador de estrategias'],
        fa: 'Close Strategy Tester',
        fr: ['Fermer le testeur de stratégie'],
        he_IL: ['סגור בוחן אסטרטגיות'],
        hu_HU: 'Close Strategy Tester',
        id_ID: ['Tutup Penguji Strategi'],
        it: ['Chiudi tester strategia'],
        ja: ['ストラテジーテスターを閉じる'],
        ko: ['전략 테스터 닫기'],
        ms_MY: ['Tutup Penguji Strategi'],
        nl_NL: 'Close Strategy Tester',
        pl: ['Zamknij Tester Strategii'],
        pt: ['Fechar o Teste de Estratégia'],
        ro: 'Close Strategy Tester',
        ru: ['Закрыть Тестер стратегий'],
        sv: ['Stäng strategitestaren'],
        th: ['ปิดตัวทดสอบกลยุทธ์'],
        tr: ['Strateji Testini Kapat'],
        vi: ['Đóng Kiểm tra Chiến lược'],
        zh: ['关闭策略测试器'],
        zh_TW: ['關閉策略測試器'],
      }
    },
    193246: (e) => {
      e.exports = {
        ar: ['إغلق محرر سكربت باين'],
        ca_ES: 'Close Pine Editor',
        cs: ['Close Pine Script™ Editor'],
        de: ['Pine Script™ Editor Schließen'],
        el: ['Close Pine Script™ Editor'],
        en: 'Close Pine Editor',
        es: ['Cerrar el Editor de Pine'],
        fa: ['Close Pine Script™ Editor'],
        fr: ["Fermer l'éditeur de Pine script"],
        he_IL: ['סגור עורך Pine'],
        hu_HU: ['Close Pine Script™ Editor'],
        id_ID: ['Tutup Editor Skrip Pine'],
        it: ['Chiudi editor pine'],
        ja: ['Pineスクリプト™ エディタを閉じる'],
        ko: ['파인 스크립트 에디터 닫기'],
        ms_MY: ['Tutup Anak Tetingkap Editor Skrip'],
        nl_NL: ['Close Pine Script™ Editor'],
        pl: ['Zamknij edytor skryptów Pine'],
        pt: ['Fechar Editor Pine'],
        ro: ['Close Pine Script™ Editor'],
        ru: ['Закрыть редактор Pine'],
        sv: ['Stäng Pine-skript Editor'],
        th: ['ปิดตัวแก้ไข Pine Script™'],
        tr: ['Pine Editörünü Kapat'],
        vi: ['Đóng trình Chỉnh sửa Pine Script™'],
        zh: ['关闭Pine脚本编辑器'],
        zh_TW: ['關閉Pine腳本編輯器'],
      }
    },
    924898: (e) => {
      e.exports = {
        ar: ['أغلق لوحة التداول'],
        ca_ES: 'Close Trading Panel',
        cs: 'Close Trading Panel',
        de: ['Trading-Panel schließen'],
        el: 'Close Trading Panel',
        en: 'Close Trading Panel',
        es: ['Cerrar panel de trading'],
        fa: 'Close Trading Panel',
        fr: ['Fermer le panneau de trading'],
        he_IL: ['סגור חלונית מסחר'],
        hu_HU: 'Close Trading Panel',
        id_ID: ['Tutup Panel Trading'],
        it: ['Chiudi pannello di trading'],
        ja: ['トレードパネルを閉じる'],
        ko: ['트레이딩 패널 닫기'],
        ms_MY: ['Tutup Panel Dagangan'],
        nl_NL: 'Close Trading Panel',
        pl: ['Zamknij Terminal Transakcyjny'],
        pt: ['Fechar o Painel de Negociação'],
        ro: 'Close Trading Panel',
        ru: ['Закрыть торговую панель'],
        sv: ['Stäng tradingpanelen'],
        th: ['ปิดหน้าต่างการซื้อขาย'],
        tr: ['İşlem Panelini Kapat'],
        vi: ['Đóng Bảng Giao dịch'],
        zh: ['关闭交易面板'],
        zh_TW: ['關閉交易面板'],
      }
    },
    906052: (e) => {
      e.exports = {
        ar: ['اغلاق مدير الحساب'],
        ca_ES: 'Close account manager',
        cs: 'Close account manager',
        de: ['Kontomanager schließen'],
        el: 'Close account manager',
        en: 'Close account manager',
        es: ['Cerrar gestor de cuentas'],
        fa: 'Close account manager',
        fr: ['Fermer le gestionnaire de compte'],
        he_IL: ['סגור את מנהל החשבונות'],
        hu_HU: 'Close account manager',
        id_ID: ['Tutup pengelola akun'],
        it: ['Chiudi gestione conto'],
        ja: ['アカウントマネージャーを閉じる'],
        ko: ['계정 관리자 닫기'],
        ms_MY: ['Tutup pengurus akaun'],
        nl_NL: 'Close account manager',
        pl: ['Zamknij menedżera konta'],
        pt: ['Fechar gerenciador de conta'],
        ro: 'Close account manager',
        ru: ['Закрыть меню управления счётом'],
        sv: ['Stäng kontohanteraren'],
        th: ['ปิดการจัดการบัญชี'],
        tr: ['Yakın hesap yöneticisi'],
        vi: ['Đóng trình quản lý tài khoản'],
        zh: ['关闭客户经理'],
        zh_TW: ['關閉帳戶管理中心'],
      }
    },
    537435: (e) => {
      e.exports = {
        ar: ['مدير الحساب'],
        ca_ES: 'Account Manager',
        cs: 'Account Manager',
        de: ['Account-Manager'],
        el: 'Account Manager',
        en: 'Account Manager',
        es: ['Gestor de cuentas'],
        fa: 'Account Manager',
        fr: ['Gestionnaire de compte'],
        he_IL: ['מנהל החשבון'],
        hu_HU: ['Számla Menedzser'],
        id_ID: ['Pengelola Akun'],
        it: ['Gestione conto'],
        ja: ['アカウントマネージャー'],
        ko: ['어카운트 매니저'],
        ms_MY: ['Pengurus Akaun'],
        nl_NL: 'Account Manager',
        pl: ['Menadżer konta'],
        pt: ['Gerenciador de Conta'],
        ro: 'Account Manager',
        ru: ['Управление счётом'],
        sv: ['Kontoansvarig'],
        th: ['การจัดการบัญชี'],
        tr: ['Hesap Yöneticisi'],
        vi: ['Quản lý Tài khoản'],
        zh: ['账户管理器'],
        zh_TW: ['帳號管理中心'],
      }
    },
    698585: (e) => {
      e.exports = {
        ar: ['تم قطع الاتصال'],
        ca_ES: 'Disconnected',
        cs: 'Disconnected',
        de: ['Unterbrochen'],
        el: 'Disconnected',
        en: 'Disconnected',
        es: ['Desconectado'],
        fa: 'Disconnected',
        fr: ['Déconnecté'],
        he_IL: ['מנותק'],
        hu_HU: ['Szétválasztva'],
        id_ID: ['Hubungan Terputus'],
        it: ['Disconnesso'],
        ja: ['切断されました'],
        ko: ['연결끊겼음'],
        ms_MY: ['Terputus'],
        nl_NL: 'Disconnected',
        pl: ['Rozłączony'],
        pt: ['Desconectado'],
        ro: 'Disconnected',
        ru: ['Отключено'],
        sv: ['Frånkopplad'],
        th: ['ยกเลิกการเชื่อมต่อแล้ว'],
        tr: ['Bağlantı Kesilmiş'],
        vi: ['Đã mất kết nối'],
        zh: ['已断开'],
        zh_TW: ['已解除'],
      }
    },
    46287: (e) => {
      e.exports = {
        ar: ['لم تنجح'],
        ca_ES: 'Failed',
        cs: 'Failed',
        de: ['Fehlgeschlagen'],
        el: 'Failed',
        en: 'Failed',
        es: ['Falló'],
        fa: 'Failed',
        fr: ['Échoué'],
        he_IL: ['נכשל'],
        hu_HU: ['Sikertelen'],
        id_ID: ['Gagal'],
        it: ['Fallito'],
        ja: ['失敗しました'],
        ko: ['실패'],
        ms_MY: ['Gagal'],
        nl_NL: 'Failed',
        pl: ['Błąd'],
        pt: ['Falhou'],
        ro: 'Failed',
        ru: ['Сбой подключения'],
        sv: ['Misslyckades'],
        th: ['ไม่ผ่าน'],
        tr: ['Başarısız'],
        vi: ['Thất bại'],
        zh: ['失败'],
        zh_TW: ['失敗'],
      }
    },
    609372: (e) => {
      e.exports = {
        ar: ['لم ينجح تسجيل الدخول'],
        ca_ES: ['Error en iniciar sessió'],
        cs: 'Failed to login',
        de: ['Login fehlgeschlagen'],
        el: 'Failed to login',
        en: 'Failed to login',
        es: ['Error al iniciar sesión'],
        fa: 'Failed to login',
        fr: ['Echec de la connexion'],
        he_IL: ['ההתחברות נכשלה'],
        hu_HU: 'Failed to login',
        id_ID: ['Gagal masuk'],
        it: ['Impossibile acceder'],
        ja: ['ログインに失敗しました'],
        ko: ['로그인 실패'],
        ms_MY: ['Gagal untuk log masuk'],
        nl_NL: 'Failed to login',
        pl: ['Nie udało się zalogować'],
        pt: ['Falha ao entrar'],
        ro: 'Failed to login',
        ru: ['Не удалось войти'],
        sv: ['Inloggningen misslyckades'],
        th: ['เข้าสู่ระบบไม่สำเร็จ'],
        tr: ['Giriş yapılamadı'],
        vi: ['Đăng nhập thất bại'],
        zh: ['登录失败'],
        zh_TW: ['登入失敗'],
      }
    },
    781414: (e) => {
      e.exports = {
        ar: ['فتح محرر Pine Script™ في تبويبة جديدة '],
        ca_ES: 'Open Pine Editor',
        cs: 'Open Pine Editor',
        de: ['Pine Script™ Editor in neuem Tab öffnen'],
        el: 'Open Pine Editor',
        en: 'Open Pine Editor',
        es: ['Abrir el Editor de Pine'],
        fa: 'Open Pine Editor',
        fr: ["Ouvrir l'éditeur Pine Script™ dans un nouvel onglet"],
        he_IL: ['פתח את עורך Pine Script™ בטאב חדש'],
        hu_HU: 'Open Pine Editor',
        id_ID: ['Buka Editor Pine Script™ pada tab baru'],
        it: ['Apri Editor Pine Script™ su nuova scheda'],
        ja: ['Pineスクリプト™ エディタを開く'],
        ko: ['새 탭에서 파인 에디터 열기'],
        ms_MY: ['Buka Editor Pine Script™ di dalam tab baru'],
        nl_NL: 'Open Pine Editor',
        pl: ['Otwórz Edytor Pine Script™ w nowej zakładce'],
        pt: ['Abrir Editor Pine'],
        ro: 'Open Pine Editor',
        ru: ['Открыть редактор Pine Script™'],
        sv: ['Öppna Pineredigeraren'],
        th: ['เปิดตัวแก้ไข Pine Script™ ในแท็บใหม่'],
        tr: ["Pine Script™ Editor'ı yeni sekmede açın"],
        vi: ['Mở Pine Script™ Editor trong tab mới '],
        zh: ['在新标签页中打开Pine Script™编辑器'],
        zh_TW: ['在新頁籤中打開Pine Script™編輯器'],
      }
    },
    991959: (e) => {
      e.exports = {
        ar: ['فتح فلتر البحث'],
        ca_ES: 'Open Screener',
        cs: 'Open Screener',
        de: ['Screener öffnen'],
        el: 'Open Screener',
        en: 'Open Screener',
        es: ['Abrir analizador'],
        fa: 'Open Screener',
        fr: ['Ouvrir le screener'],
        he_IL: ['סורק פתוח'],
        hu_HU: 'Open Screener',
        id_ID: ['Buka Penyaring'],
        it: ['Apri Screener'],
        ja: ['スクリーナーを開く'],
        ko: ['스크리너 열기'],
        ms_MY: ['Buka Penyaring'],
        nl_NL: 'Open Screener',
        pl: ['Otwórz Skaner'],
        pt: ['Abrir Tela'],
        ro: 'Open Screener',
        ru: ['Открыть Скринер'],
        sv: ['Öppna Screener'],
        th: ['เปิดตัวช่วยคัดกรอง'],
        tr: ['Takipçiyi Aç'],
        vi: ['Mở Bộ lọc'],
        zh: ['打开筛选器'],
        zh_TW: ['打開篩選器'],
      }
    },
    777278: (e) => {
      e.exports = {
        ar: ['فتح مختبِر الاستراتيجية'],
        ca_ES: 'Open Strategy Tester',
        cs: 'Open Strategy Tester',
        de: ['Strategie-Tester öffnen'],
        el: 'Open Strategy Tester',
        en: 'Open Strategy Tester',
        es: ['Abrir Simulador de estrategias'],
        fa: 'Open Strategy Tester',
        fr: ['Ouvrir le Testeur de Stratégie'],
        he_IL: ['פתח את בוחן האסטרטגיה'],
        hu_HU: ['Stratégia Tesztelés Megnyitása'],
        id_ID: ['Buka Penguji Strategi'],
        it: ['Apri Tester strategia'],
        ja: ['ストラテジーテスターを開く'],
        ko: ['전략테스터 열기'],
        ms_MY: ['Buka Penguji Strategi'],
        nl_NL: 'Open Strategy Tester',
        pl: ['Otwórz tester strategii'],
        pt: ['Abrir Teste de Estratégias'],
        ro: 'Open Strategy Tester',
        ru: ['Посмотреть результаты тестирования стратегий'],
        sv: ['Öppna strategitestaren'],
        th: ['เปิดตัวทดสอบกลยุทธ์'],
        tr: ['Strateji Testini Aç'],
        vi: ['Mở Kiểm tra Chiến lược'],
        zh: ['打开策略测试器'],
        zh_TW: ['開啟策略測試器'],
      }
    },
    265115: (e) => {
      e.exports = {
        ar: ['فتح منصة التداول'],
        ca_ES: 'Open Trading Panel',
        cs: 'Open Trading Panel',
        de: ['Trading-Konsole öffnen'],
        el: 'Open Trading Panel',
        en: 'Open Trading Panel',
        es: ['Abrir Panel de trading'],
        fa: 'Open Trading Panel',
        fr: ['Ouvrir le panneau de Trading'],
        he_IL: ['לוח עסקאות פתוחות'],
        hu_HU: ['Kereskedési Terminál Megnyitása'],
        id_ID: ['Buka Panel Trading'],
        it: ['Apri Pannello trading'],
        ja: ['トレードパネルを開く'],
        ko: ['트레이딩패널열기'],
        ms_MY: ['Buka Panel Dagangan'],
        nl_NL: ['Open handelspaneel'],
        pl: ['Otwórz Terminal Transakcyjny'],
        pt: ['Abrir painel de negociação'],
        ro: 'Open Trading Panel',
        ru: ['Открыть торговую панель'],
        sv: ['Öppna handelspanel'],
        th: ['เปิดหน้าต่างการซื้อขาย'],
        tr: ['İşlem Panelini Aç'],
        vi: ['Mở Bảng Giao dịch'],
        zh: ['打开交易面板'],
        zh_TW: ['開啟交易面板'],
      }
    },
    35554: (e) => {
      e.exports = {
        ar: ['افتح مدير الحساب'],
        ca_ES: 'Open account manager',
        cs: 'Open account manager',
        de: ['Kontomanager öffnen'],
        el: 'Open account manager',
        en: 'Open account manager',
        es: ['Abrir gestor de cuentas'],
        fa: 'Open account manager',
        fr: ['Ouvrir le gestionnaire de compte'],
        he_IL: ['פתח את מנהל החשבונות'],
        hu_HU: 'Open account manager',
        id_ID: ['Buka pengelola akun'],
        it: ['Apri gestione conto'],
        ja: ['アカウントマネージャーを開く'],
        ko: ['계정 관리자 열기'],
        ms_MY: ['Buka pengurus akaun'],
        nl_NL: 'Open account manager',
        pl: ['Otwórz menedżera konta'],
        pt: ['Abrir gerenciador de conta'],
        ro: 'Open account manager',
        ru: ['Открыть меню управления счётом'],
        sv: ['Öppna kontohanteraren'],
        th: ['เปิดการจัดการบัญชี'],
        tr: ['Hesap yöneticisi açın'],
        vi: ['Mở trình quản lý tài khoản'],
        zh: ['打开客户经理'],
        zh_TW: ['打開帳戶管理中心'],
      }
    },
    394021: (e) => {
      e.exports = {
        ar: ['لا يوجد اتصال بالإنترنت'],
        ca_ES: 'Lost internet connection',
        cs: 'Lost internet connection',
        de: ['Internetverbindung unterbrochen'],
        el: 'Lost internet connection',
        en: 'Lost internet connection',
        es: ['Se ha perdido la conexión a internet'],
        fa: 'Lost internet connection',
        fr: ['Connexion Internet perdue'],
        he_IL: ['החיבור לאינטרנט אבד'],
        hu_HU: 'Lost internet connection',
        id_ID: ['Sambungan Internet Terputus'],
        it: ['Connessione internet persa'],
        ja: ['インターネット接続が失われました'],
        ko: ['인터넷 컨넥션 끊김'],
        ms_MY: ['Sambungan internet telah hilang'],
        nl_NL: 'Lost internet connection',
        pl: ['Połączenie z Internetem zostało przerwane'],
        pt: ['Perda da conexão de internet'],
        ro: 'Lost internet connection',
        ru: ['Потеряно соединение с интернетом'],
        sv: ['Förlorad internetkontakt'],
        th: ['ไม่มีสัญญาณการเชื่อมต่ออินเทอร์เน็ต'],
        tr: ['İnternet Bağlantısı Kesildi'],
        vi: ['Mất kết nối'],
        zh: ['网络连接中断'],
        zh_TW: ['網路連線中斷'],
      }
    },
    398157: (e) => {
      e.exports = {
        ar: ['محدد بسعر'],
        ca_ES: ['Límit'],
        cs: 'Limit',
        de: 'Limit',
        el: 'Limit',
        en: 'Limit',
        es: ['Límite'],
        fa: 'Limit',
        fr: ['Limite'],
        he_IL: ['לימיט'],
        hu_HU: ['Korlát'],
        id_ID: 'Limit',
        it: ['Limite'],
        ja: ['指値'],
        ko: ['리밋'],
        ms_MY: ['Had'],
        nl_NL: ['Limiet'],
        pl: 'Limit',
        pt: ['Limite'],
        ro: 'Limit',
        ru: ['Лимит'],
        sv: ['Limitorder'],
        th: ['จำกัด'],
        tr: 'Limit',
        vi: ['Giới hạn'],
        zh: ['限价'],
        zh_TW: ['限價'],
      }
    },
    359758: (e) => {
      e.exports = {
        ar: ['فوري - بسعر السوق'],
        ca_ES: ['Mercat'],
        cs: ['Trh'],
        de: ['Markt'],
        el: 'Market',
        en: 'Market',
        es: ['Mercado'],
        fa: 'Market',
        fr: ['Marché'],
        he_IL: ['מארקט'],
        hu_HU: ['Piac'],
        id_ID: ['Pasar'],
        it: ['Mercato'],
        ja: ['成行'],
        ko: ['마켓'],
        ms_MY: ['Pasaran'],
        nl_NL: 'Market',
        pl: ['Rynek'],
        pt: ['Mercado'],
        ro: 'Market',
        ru: ['Рыночная'],
        sv: ['Marknad'],
        th: ['ตลาด'],
        tr: ['Piyasa'],
        vi: ['Thị trường'],
        zh: ['市价'],
        zh_TW: ['市場'],
      }
    },
    562286: (e) => {
      e.exports = {
        ar: ['المنصّات'],
        ca_ES: ['Analitzador'],
        cs: 'Screener',
        de: 'Screener',
        el: 'Screener',
        en: 'Screener',
        es: ['Analizador'],
        fa: 'Screener',
        fr: 'Screener',
        he_IL: ['סורק'],
        hu_HU: ['Átvizsgálás'],
        id_ID: ['Penyaring'],
        it: 'Screener',
        ja: ['スクリーナー'],
        ko: ['스크리너'],
        ms_MY: ['Penyaring'],
        nl_NL: 'Screener',
        pl: ['Skaner'],
        pt: ['Rastreador'],
        ro: 'Screener',
        ru: ['Скринер'],
        sv: 'Screener',
        th: ['ตัวช่วยคัดกรอง'],
        tr: ['Takipçi'],
        vi: ['Bộ lọc'],
        zh: ['筛选器'],
        zh_TW: ['篩選器'],
      }
    },
    241648: (e) => {
      e.exports = {
        ar: ['وقف الخسارة'],
        ca_ES: ['Prou pèrdues'],
        cs: 'Stop Loss',
        de: ['Stop-Loss'],
        el: 'Stop Loss',
        en: 'Stop Loss',
        es: 'Stop Loss',
        fa: 'Stop Loss',
        fr: 'Stop Loss',
        he_IL: ['סטופ לוס'],
        hu_HU: 'Stop Loss',
        id_ID: 'Stop Loss',
        it: ['Stop loss'],
        ja: ['損切り'],
        ko: ['스탑로스'],
        ms_MY: ['Renti Rugi'],
        nl_NL: ['Stop-loss'],
        pl: 'Stop Loss',
        pt: 'Stop Loss',
        ro: 'Stop Loss',
        ru: ['Стоп-лосс'],
        sv: 'Stop Loss',
        th: ['ตัดขาดทุน'],
        tr: ['Zarar Durdur'],
        vi: ['Cắt lỗ'],
        zh: ['止损'],
        zh_TW: ['停損'],
      }
    },
    900853: (e) => {
      e.exports = {
        ar: ['إيقاف محدّد'],
        ca_ES: ['Límit de stop'],
        cs: 'StopLimit',
        de: 'StopLimit',
        el: 'StopLimit',
        en: 'StopLimit',
        es: 'StopLimit',
        fa: 'StopLimit',
        fr: ['Limite du Stop'],
        he_IL: ['סטופ-לימיט'],
        hu_HU: 'StopLimit',
        id_ID: ['LimitStop'],
        it: 'StopLimit',
        ja: ['逆指値 (指値執行)'],
        ko: ['스탑리밋'],
        ms_MY: ['Had Renti'],
        nl_NL: 'StopLimit',
        pl: ['Stop limit'],
        pt: ['StopLimite'],
        ro: 'StopLimit',
        ru: ['Стоплимит'],
        sv: ['Stoppgräns'],
        th: ['สต๊อปลิมิต'],
        tr: 'StopLimit',
        vi: ['Cắt lỗ'],
        zh: ['限价止损'],
        zh_TW: ['限價停損'],
      }
    },
    876809: (e) => {
      e.exports = {
        ar: ['اختبار استراتيجية'],
        ca_ES: ["Simulador d'estratègies"],
        cs: 'Strategy Tester',
        de: ['Strategie-Tester'],
        el: 'Strategy Tester',
        en: 'Strategy Tester',
        es: ['Simulador de estrategias'],
        fa: 'Strategy Tester',
        fr: ['Testeur de Stratégie'],
        he_IL: ['בוחן האסטרטגיה'],
        hu_HU: ['Stratégia Tesztelés'],
        id_ID: ['Penguji Strategi'],
        it: ['Tester strategia'],
        ja: ['ストラテジーテスター'],
        ko: ['전략테스터'],
        ms_MY: ['Penguji Strategi'],
        nl_NL: 'Strategy Tester',
        pl: ['Tester Strategii'],
        pt: ['Teste de Estratégias'],
        ro: 'Strategy Tester',
        ru: ['Тестер стратегий'],
        sv: ['Strategitestaren'],
        th: ['ตัวทดสอบกลยุทธ์'],
        tr: ['Strateji Testi'],
        vi: ['Kiểm tra Chiến lược'],
        zh: ['策略测试器'],
        zh_TW: ['策略測試器'],
      }
    },
    603813: (e) => {
      e.exports = {
        ar: ['محرر Pine'],
        ca_ES: 'Pine Editor',
        cs: 'Pine Editor',
        de: ['Pine-Editor'],
        el: 'Pine Editor',
        en: 'Pine Editor',
        es: ['Editor de Pine'],
        fa: 'Pine Editor',
        fr: ['Editeur Pine'],
        he_IL: ['עורך Pine'],
        hu_HU: ['Pine Szerkesztő'],
        id_ID: ['Editor Pine'],
        it: ['Editor Pine'],
        ja: ['Pine エディタ'],
        ko: ['Pine 에디터'],
        ms_MY: ['Editor Pine'],
        nl_NL: 'Pine Editor',
        pl: ['Pine edytor'],
        pt: ['Editor Pine'],
        ro: 'Pine Editor',
        ru: ['Редактор Pine'],
        sv: ['Pinehanterare'],
        th: ['ไพน์เอดิเตอร์'],
        tr: ['Pine Editör'],
        vi: ['Trình chỉnh sửa Pine Editor'],
        zh: ['Pine编辑器'],
        zh_TW: ['Pine編輯器'],
      }
    },
    629208: (e) => {
      e.exports = {
        ar: ['ضع أمرا عبر لوحة الأوامر أو DOM'],
        ca_ES: 'Place an order via Order Panel or DOM',
        cs: 'Place an order via Order Panel or DOM',
        de: ['Platzieren Sie eine Order im Order-Panel oder DOM'],
        el: 'Place an order via Order Panel or DOM',
        en: 'Place an order via Order Panel or DOM',
        es: ['Cursar una orden a través del Panel de órdenes o DOM'],
        fa: 'Place an order via Order Panel or DOM',
        fr: ["Passer un ordre via le panneau d'ordres ou DOM"],
        he_IL: ['מקם פקודה דרך לוח פקודות או DOM'],
        hu_HU: 'Place an order via Order Panel or DOM',
        id_ID: ['Letakkan order melalui Panel Order atau DOM'],
        it: ['Effettua un ordine tramite il Pannello ordini o il DOM'],
        ja: ['注文パネル／板情報で注文する'],
        ko: ['주문 패널 또는 DOM을 통해 주문하기'],
        ms_MY: ['Sila buat pesanan melalui Panel Pesanan atau DOM'],
        nl_NL: 'Place an order via Order Panel or DOM',
        pl: ['Złóż zlecenie przez Panel Zleceń lub DOM'],
        pt: ['Colocar uma ordem por meio do Painel de Ordens ou DOM'],
        ro: 'Place an order via Order Panel or DOM',
        ru: ['Размешайте заявки через Панель заявок или Стакан заявок (DOM)'],
        sv: 'Place an order via Order Panel or DOM',
        th: 'Place an order via Order Panel or DOM',
        tr: ['Emir Paneli veya DOM üzerinden emir verin'],
        vi: ['Đặt lệnh qua Bảng điều khiển Đặt lệnh hoặc DOM'],
        zh: ['通过订单面板或DOM下订单'],
        zh_TW: ['透過訂單面板或DOM下訂單'],
      }
    },
    129266: (e) => {
      e.exports = {
        ar: ['جني أرباح'],
        ca_ES: ['Agafa guanys'],
        cs: 'Take Profit',
        de: ['Take-Profit'],
        el: 'Take Profit',
        en: 'Take Profit',
        es: 'Take Profit',
        fa: 'Take Profit',
        fr: ['Prise de profits'],
        he_IL: ['לקיחת רווח'],
        hu_HU: 'Take Profit',
        id_ID: ['Ambil Profit'],
        it: ['Take profit'],
        ja: ['利益確定'],
        ko: ['프라핏타겟'],
        ms_MY: ['Ambil Untung'],
        nl_NL: ['Take profit'],
        pl: 'Take Profit',
        pt: ['Realização de Lucro'],
        ro: 'Take Profit',
        ru: ['Тейк-профит'],
        sv: ['Ta vinsten'],
        th: ['เก็บกำไร'],
        tr: ['Kâr Al'],
        vi: ['Chốt Lãi'],
        zh: ['止盈'],
        zh_TW: ['停利'],
      }
    },
    378505: (e) => {
      e.exports = {
        ar: [
          'تم تجاوز حد اتصال الوسيط. تأكد من عدم وجود جلسة متزامنة وحاول إعادة الاتصال.',
        ],
        ca_ES:
          "The broker connection limit has been exceeded. Make sure you don't have a concurrent session and try to reconnect. If the issue persists, please, contact your broker.",
        cs: "The broker connection limit has been exceeded. Make sure you don't have a concurrent session and try to reconnect. If the issue persists, please, contact your broker.",
        de: [
          'Das Verbindungslimit des Brokers wurde überschritten. Stellen Sie bitte sicher, dass Sie keine gleichzeitigen Sessions haben, und versuchen Sie, die Verbindung erneut herzustellen.',
        ],
        el: "The broker connection limit has been exceeded. Make sure you don't have a concurrent session and try to reconnect. If the issue persists, please, contact your broker.",
        en: "The broker connection limit has been exceeded. Make sure you don't have a concurrent session and try to reconnect. If the issue persists, please, contact your broker.",
        es: [
          'Se ha superado el límite de conexión del broker. Asegúrese de que no tiene una sesión simultánea e intente conectarse de nuevo. Si persiste el problema, póngase en contacto con su broker.',
        ],
        fa: "The broker connection limit has been exceeded. Make sure you don't have a concurrent session and try to reconnect. If the issue persists, please, contact your broker.",
        fr: [
          "La limite de connexion du courtier a été dépassée. Assurez-vous que vous n'avez pas de session en cours et essayez de vous reconnecter.",
        ],
        he_IL: [
          'חרגת ממגבלת החיבור של הברוקר. ודא שאין לך הפעלה פתוחה במקביל ונסה להתחבר מחדש.',
        ],
        hu_HU:
          "The broker connection limit has been exceeded. Make sure you don't have a concurrent session and try to reconnect. If the issue persists, please, contact your broker.",
        id_ID: [
          'Batas koneksi broker telah terlampaui. Pastikan anda tidak memiliki sesi bersamaan dan coba untuk menyambungkannya kembali.',
        ],
        it: [
          'Il limite di connessione del broker è stato superato. Assicurarsi di non avere una sessione contemporanea e prova a riconnetterti.',
        ],
        ja: [
          'ブローカーの接続制限数を超えました。同時接続のセッションがないかを確認してから、再接続をお試しください。',
        ],
        ko: [
          '브로커 연결 제한을 초과했습니다. 동시 접속 중인 세션이 없는지 확인하고 다시 연결해 보세요.',
        ],
        ms_MY: [
          'Had sambungan broker telah dilepasi. Pastikan anda tidak mempunyai sesi serentak dan cuba sambung semula.',
        ],
        nl_NL:
          "The broker connection limit has been exceeded. Make sure you don't have a concurrent session and try to reconnect. If the issue persists, please, contact your broker.",
        pl: [
          'Limit połączeń z brokerem został przekroczony. Upewnij się, że nie masz równoległej sesji i spróbuj połączyć się ponownie.',
        ],
        pt: [
          'O limite de conexão da corretora foi excedido. Verifique se você não tem uma sessão simultânea e tente se reconectar. Se o problema persistir, entre em contato com a sua corretora.',
        ],
        ro: "The broker connection limit has been exceeded. Make sure you don't have a concurrent session and try to reconnect. If the issue persists, please, contact your broker.",
        ru: [
          'Вы превысили лимит подключений к брокеру. Убедитесь, что у вас нет активной одновременной сессии, и попробуйте подключиться снова.',
        ],
        sv: "The broker connection limit has been exceeded. Make sure you don't have a concurrent session and try to reconnect. If the issue persists, please, contact your broker.",
        th: "The broker connection limit has been exceeded. Make sure you don't have a concurrent session and try to reconnect. If the issue persists, please, contact your broker.",
        tr: [
          'Aracı bağlantı sınırı aşıldı. Eşzamanlı bir oturumunuz olmadığından emin olun ve yeniden bağlanmayı deneyin.',
        ],
        vi: [
          'Hạn mức kết nối với nhà giao dịch đã bị vượt. Nhớ đảm bảo bạn không truy cập phiên đồng thời rồi thử kết nối lại. Nếu sự cố vẫn tiếp diễn, vui lòng liên hệ với nhà môi giới của bạn.',
        ],
        zh: [
          '已超出经纪商连接限制。确保您没有并发会话并尝试重新连接。如果问题仍然存在，请联系您的经纪商。',
        ],
        zh_TW: [
          '經紀商連接已超過限制。確保您沒有並發交易時段，然後嘗試重新連線。如果問題仍然存在，請聯絡您的經紀商。',
        ],
      }
    },
    477660: (e) => {
      e.exports = {
        ar: ['منصة التداول'],
        ca_ES: 'Trading Panel',
        cs: 'Trading Panel',
        de: ['Trading-Panel'],
        el: 'Trading Panel',
        en: 'Trading Panel',
        es: ['Panel de trading'],
        fa: 'Trading Panel',
        fr: ['Espace de Trading'],
        he_IL: ['לוח מסחר'],
        hu_HU: ['Kereskedési Terminál'],
        id_ID: ['Panel Trading'],
        it: ['Pannello trading'],
        ja: ['トレードパネル'],
        ko: ['트레이딩패널'],
        ms_MY: ['Panel Dagangan'],
        nl_NL: ['Handelspaneel'],
        pl: ['Terminal Transakcyjny'],
        pt: ['Painel de negociação'],
        ro: 'Trading Panel',
        ru: ['Торговая панель'],
        sv: ['Tradingpanel'],
        th: ['หน้าต่างการซื้อขาย'],
        tr: ['İşlem Paneli'],
        vi: ['Bảng Giao dịch'],
        zh: ['交易面板'],
        zh_TW: ['交易面板'],
      }
    },
    86430: (e) => {
      e.exports = {
        ar: ['وقف الخسارة المتحرك'],
        ca_ES: ['Topall de pèrdua dinàmic'],
        cs: 'Trailing Stop',
        de: 'Trailing Stop',
        el: 'Trailing Stop',
        en: 'Trailing Stop',
        es: ['Tope de pérdida dinámico'],
        fa: 'Trailing Stop',
        fr: 'Trailing Stop',
        he_IL: ['טריילינג-סטופ'],
        hu_HU: 'Trailing Stop',
        id_ID: 'Trailing Stop',
        it: 'Trailing Stop',
        ja: ['トレーリングストップ'],
        ko: ['트레일링 스탑'],
        ms_MY: ['Jejakan Renti'],
        nl_NL: 'Trailing Stop',
        pl: ['Zlecenie Trailing Stop'],
        pt: 'Trailing Stop',
        ro: 'Trailing Stop',
        ru: ['Трейлинг-стоп'],
        sv: ['Efterföljande stopp'],
        th: ['การเลื่อนจุดตัดขาดทุน'],
        tr: ['İz süren Stop'],
        vi: ['Lệnh cắt lỗ dưới'],
        zh: ['跟踪止损'],
        zh_TW: ['移動停損'],
      }
    },
    221456: (e) => {
      e.exports = {
        ar: ['لا يمكنك تداول الرمز {symbol} على ‎{broker}‎ من خلال Tradingview.'],
        ca_ES: [
          'No podeu negociar el símbol {symbol} a TradingView a través de {broker}.',
        ],
        cs: "You can't trade the symbol {symbol} at TradingView via {broker}.",
        de: [
          'Sie können das Symbol {symbol} bei TradingView nicht mit {broker} handeln.',
        ],
        el: "You can't trade the symbol {symbol} at TradingView via {broker}.",
        en: "You can't trade the symbol {symbol} at TradingView via {broker}.",
        es: [
          'No puede negociar el símbolo {symbol} en TradingView a través de {broker}.',
        ],
        fa: "You can't trade the symbol {symbol} at TradingView via {broker}.",
        fr: [
          "Vous ne pouvez pas trader le symbole {symbol} sur TradingView par l'intermédiaire de {broker}.",
        ],
        he_IL: [
          'אינך יכול לסחור בסימול {symbol} ב TradingView באמצעות {broker}.',
        ],
        hu_HU:
          "You can't trade the symbol {symbol} at TradingView via {broker}.",
        id_ID: [
          'Anda tidak dapat melakukan trade pada simbol {symbol} di TradingView via {broker}.',
        ],
        it: ['Su TradingView non puoi fare trading su {symbol} con {broker}.'],
        ja: [
          'TradingViewでシンボル {symbol} を {broker} で取引することはできません。',
        ],
        ko: [
          '트레이딩뷰에서 {broker}을 거쳐 {symbol}을 직접 트레이드할 수는 없으며, 브로커 페이지로 가서 트레이드하여야 합니다.',
        ],
        ms_MY: ['Anda tidak boleh berdagang simbol {symbol} dengan {broker}.'],
        nl_NL:
          "You can't trade the symbol {symbol} at TradingView via {broker}.",
        pl: [
          'Na TradingView nie możesz handlować na {symbol} za pośrednictwem {broker}.',
        ],
        pt: [
          'Você não pode negociar esse símbolo {symbol} no TradingView por meio da {broker}.',
        ],
        ro: "You can't trade the symbol {symbol} at TradingView via {broker}.",
        ru: ['Нельзя торговать символ {symbol} через {broker} на TradingView.'],
        sv: ['Du kan inte handla {symbol} på TradingView via {broker}.'],
        th: [
          'คุณไม่สามารถทำการซื้อขายสัญลักษณ์ {symbol} บน TradingView ผ่าน {broker} ได้',
        ],
        tr: ['{symbol} sembolünde {broker} aracılığıyla işlem yapamazsınız.'],
        vi: [
          'Bạn không thể giao dịch mã {symbol} trên Tradingview thông qua {broker}.',
        ],
        zh: ['您不能通过{broker}在TradingView交易商品{symbol}。'],
        zh_TW: ['您不能透過{broker}在TradingView交易商品{symbol}。'],
      }
    },
    767207: (e) => {
      e.exports = {
        ar: ['ملغاة'],
        ca_ES: ['cancel·lades'],
        cs: ['zrušeno'],
        de: ['storniert'],
        el: 'cancelled',
        en: 'cancelled',
        es: ['canceladas'],
        fa: 'cancelled',
        fr: ['annulé'],
        he_IL: ['בוטל'],
        hu_HU: ['törölve'],
        id_ID: ['dibatalkan'],
        it: ['annullato'],
        ja: ['キャンセル'],
        ko: ['취소됐음'],
        ms_MY: ['dibatalkan'],
        nl_NL: 'cancelled',
        pl: ['odwołany'],
        pt: ['cancelado'],
        ro: 'cancelled',
        ru: ['отменена'],
        sv: ['avbruten'],
        th: ['ถูกยกเลิก'],
        tr: ['iptal edildi'],
        vi: ['Đã hủy'],
        zh: ['已取消'],
        zh_TW: ['已取消'],
      }
    },
    885323: (e) => {
      e.exports = {
        ar: ['نُفّذ الأمر'],
        ca_ES: ['executades'],
        cs: 'filled',
        de: ['ausgeführt'],
        el: 'filled',
        en: 'filled',
        es: ['ejecutadas'],
        fa: 'filled',
        fr: ['rempli'],
        he_IL: ['התקבל'],
        hu_HU: ['kitöltve'],
        id_ID: ['terpenuhi'],
        it: ['completato'],
        ja: ['約定'],
        ko: ['체결됨'],
        ms_MY: ['diisi'],
        nl_NL: 'filled',
        pl: ['zamknięte'],
        pt: ['Executado'],
        ro: 'filled',
        ru: ['исполнены'],
        sv: ['fylld'],
        th: ['เติมแล้ว'],
        tr: ['gerçekleşti'],
        vi: ['lệnh đã thực hiện thành công'],
        zh: ['已成交'],
        zh_TW: ['已成交'],
      }
    },
    614841: (e) => {
      e.exports = {
        ar: ['غير مفعل'],
        ca_ES: ['Pendents'],
        cs: 'inactive',
        de: ['inaktiv'],
        el: 'inactive',
        en: 'inactive',
        es: ['Pendientes'],
        fa: 'inactive',
        fr: ['inactif'],
        he_IL: ['לא פעיל'],
        hu_HU: ['inaktív'],
        id_ID: ['tidak aktif'],
        it: ['inattivo'],
        ja: ['非アクティブ'],
        ko: ['비활성'],
        ms_MY: ['tidak aktif'],
        nl_NL: 'inactive',
        pl: ['nieaktywny'],
        pt: ['inativo'],
        ro: 'inactive',
        ru: ['неактивны'],
        sv: ['inaktiv'],
        th: ['ที่ไม่ใช้งาน'],
        tr: ['etkin değil'],
        vi: ['không hoạt động'],
        zh: ['未成交'],
        zh_TW: ['不活躍'],
      }
    },
    373425: (e) => {
      e.exports = {
        ar: ['وضع'],
        ca_ES: ['executant'],
        cs: 'placing',
        de: ['platziere'],
        el: 'placing',
        en: 'placing',
        es: ['ejecutando'],
        fa: 'placing',
        fr: ['placement'],
        he_IL: ['מציב'],
        hu_HU: ['forgalomba hozás'],
        id_ID: ['menempatkan'],
        it: ['posizione'],
        ja: ['注文中'],
        ko: ['내는중'],
        ms_MY: ['meletakkan'],
        nl_NL: 'placing',
        pl: ['umieszczanie'],
        pt: ['posicionar'],
        ro: 'placing',
        ru: ['размещается'],
        sv: ['placerar'],
        th: ['กำลังเลื่อน'],
        tr: ['veriyor'],
        vi: ['đang đặt'],
        zh: ['放置'],
        zh_TW: ['配售'],
      }
    },
    442060: (e) => {
      e.exports = {
        ar: ['مرفوض'],
        ca_ES: ['rebutjades'],
        cs: 'rejected',
        de: ['abgelehnt'],
        el: 'rejected',
        en: 'rejected',
        es: ['rechazada'],
        fa: 'rejected',
        fr: ['rejeté'],
        he_IL: ['נדחה'],
        hu_HU: ['visszautasítva'],
        id_ID: ['ditolak'],
        it: ['respinto'],
        ja: ['拒否'],
        ko: ['거부됨'],
        ms_MY: ['ditolak'],
        nl_NL: 'rejected',
        pl: ['odrzucono'],
        pt: ['rejeitado'],
        ro: 'rejected',
        ru: ['отклонена'],
        sv: ['avvisad'],
        th: ['ถูกปฏิเสธ'],
        tr: ['reddedildi'],
        vi: ['đã bị từ chối'],
        zh: ['被拒绝'],
        zh_TW: ['被拒'],
      }
    },
    328231: (e) => {
      e.exports = {
        ar: ['جار العمل'],
        ca_ES: ['vigents'],
        cs: 'working',
        de: ['aktiv'],
        el: 'working',
        en: 'working',
        es: ['vigentes'],
        fa: 'working',
        fr: ['travaille'],
        he_IL: ['עובד'],
        hu_HU: ['működő'],
        id_ID: ['bekerja'],
        it: ['in funzione'],
        ja: ['稼働中'],
        ko: ['작동중'],
        ms_MY: ['berfungsi'],
        nl_NL: 'working',
        pl: ['oczekujące'],
        pt: ['ativa'],
        ro: 'working',
        ru: ['обрабатываются'],
        sv: ['arbetar'],
        th: ['กำลังทำงาน'],
        tr: ['işlemde'],
        vi: ['đang hoạt động'],
        zh: ['可执行'],
        zh_TW: ['運轉中'],
      }
    },
  },
])
