;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7078],
  {
    84263: (e) => {
      e.exports = { backButton: 'backButton-yMMXpYEB' }
    },
    33090: (e) => {
      e.exports = {
        wrapper: 'wrapper-nGEmjtaX',
        container: 'container-nGEmjtaX',
        tab: 'tab-nGEmjtaX',
        active: 'active-nGEmjtaX',
        title: 'title-nGEmjtaX',
        icon: 'icon-nGEmjtaX',
        withoutIcon: 'withoutIcon-nGEmjtaX',
        titleText: 'titleText-nGEmjtaX',
        nested: 'nested-nGEmjtaX',
        isTablet: 'isTablet-nGEmjtaX',
        isMobile: 'isMobile-nGEmjtaX',
        showLastDivider: 'showLastDivider-nGEmjtaX',
        medium: 'medium-nGEmjtaX',
        large: 'large-nGEmjtaX',
        withoutArrow: 'withoutArrow-nGEmjtaX',
        accessible: 'accessible-nGEmjtaX',
      }
    },
    29016: (e) => {
      e.exports = {
        'tablet-normal-breakpoint': '(max-width: 768px)',
        'tablet-small-breakpoint': '(max-width: 440px)',
        withSidebar: 'withSidebar-F0WBLDV5',
        content: 'content-F0WBLDV5',
        tabContent: 'tabContent-F0WBLDV5',
        applyToAllButton: 'applyToAllButton-F0WBLDV5',
      }
    },
    58467: (e) => {
      e.exports = {
        themesButtonText: 'themesButtonText-w7kgghoW',
        themesButtonIcon: 'themesButtonIcon-w7kgghoW',
        defaultsButtonText: 'defaultsButtonText-w7kgghoW',
        defaultsButtonItem: 'defaultsButtonItem-w7kgghoW',
        remove: 'remove-w7kgghoW',
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
    22265: (e, t, i) => {
      i.d(t, { DialogSidebarItem: () => u, DialogSidebarWrapper: () => h })
      var n,
        l = i(50959),
        a = i(97754),
        o = i.n(a),
        s = i(9745),
        r = i(65631),
        c = i(68648),
        m = i(33090)
      function h(e) {
        return l.createElement('div', { className: m.wrapper, ...e })
      }
      function u(e) {
        const {
            mode: t,
            title: i,
            icon: n,
            isActive: a,
            onClick: h,
            tag: u = 'div',
            reference: d,
            className: b,
            mobileFontSize: p = 'medium',
            showLastDivider: g,
            useBoldIconsForMobile: v,
            hideArrow: y,
            ...T
          } = e,
          { isMobile: _, isTablet: C } = (0, r.getSidebarMode)(t),
          f = (() => {
            if (_ && v) return n?.bold
            return a ? n?.bold : n?.default
          })()
        return l.createElement(
          u,
          {
            ...T,
            ref: d,
            title: C ? i : '',
            className: o()(
              m.tab,
              C && m.isTablet,
              _ && m.isMobile,
              a && m.active,
              y && m.withoutArrow,
              b,
              C && 'apply-common-tooltip',
            ),
            onClick: h,
          },
          n && l.createElement(s.Icon, { className: m.icon, icon: f }),
          !C &&
            l.createElement(
              'span',
              {
                className: o()(
                  m.title,
                  !n && m.withoutIcon,
                  'medium' === p ? m.medium : m.large,
                  g && m.showLastDivider,
                ),
              },
              l.createElement(
                'span',
                { className: o()(m.titleText, 'apply-overflow-tooltip') },
                i,
              ),
              _ &&
                !y &&
                l.createElement(s.Icon, { className: m.nested, icon: c }),
            ),
        )
      }
      !((e) => {
        ;(e.Medium = 'medium'), (e.Large = 'large')
      })(n || (n = {}))
    },
    65631: (e, t, i) => {
      var n, l
      function a(e) {
        return { isMobile: 'mobile' === e, isTablet: 'tablet' === e }
      }
      i.d(t, { getSidebarMode: () => a }),
        ((e) => {
          ;(e.Bold = 'bold'), (e.Default = 'default')
        })(n || (n = {})),
        ((e) => {
          ;(e.Tablet = 'tablet'), (e.Mobile = 'mobile')
        })(l || (l = {}))
    },
    56080: (e, t, i) => {
      i.r(t), i.d(t, { GeneralChartPropertiesDialogRenderer: () => ue })
      var n = i(11542),
        l = i(50959),
        a = i(67248),
        o = i(68215),
        s = i(50182),
        r = i(66849),
        c = i(71891),
        m = i(56840),
        h = i.n(m),
        u = i(68993),
        d = i(90692),
        b = i(9745),
        p = i(56570),
        g = i(10838),
        v = i(11684),
        y = i(85662),
        T = (i(21251), i(3615))
      const _ = n.t(null, void 0, i(6113))
      var C = i(50655),
        f = i(34585),
        S = i(38068),
        k = i(51768),
        A = i(70412),
        E = i(32563),
        w = i(58519),
        M = i(58467)
      function P(e) {
        const {
            themeName: t,
            chartWidgetCollection: i,
            onRemove: n,
            manager: a,
          } = e,
          [o, s] = (0, A.useHover)(),
          r = l.useCallback(
            () =>
              ((e, t, i) => {
                ;(0, T.showConfirm)(
                  {
                    text: _.format({ name: e }),
                    onConfirm: ({ dialogClose: i }) => {
                      ;(0, y.removeTheme)(e), t && t(e), i()
                    },
                  },
                  i,
                )
              })(t, n, a),
            [t, n, a],
          ),
          c = l.useCallback(() => {
            ;(0, w.loadTheme)(i, { themeName: t, standardTheme: !1 }).then(
              () => {
                ;(0, k.trackEvent)('GUI', 'Switch to custom theme')
              },
            )
          }, [t, i])
        return l.createElement(
          'div',
          { ...s },
          l.createElement(g.AccessibleMenuItem, {
            'data-series-theme-item-theme-name': t,
            className: M.defaultsButtonItem,
            isActive: !1,
            label: t,
            onClick: c,
            toolbox: l.createElement(S.MenuRemoveButton, {
              className: M.remove,
              hidden: !E.mobiletouch && !o,
              onClick: r,
            }),
          }),
        )
      }
      var B = i(95276),
        x = i(20243),
        D = i(44996)
      const I = n.t(null, void 0, i(93553)),
        N = n.t(null, void 0, i(96413)),
        R = (0, f.appendEllipsis)(n.t(null, void 0, i(76266))),
        L = n.t(null, void 0, i(77571)),
        F = p.enabled('chart_template_storage')
      class W extends l.PureComponent {
        constructor(e) {
          super(e),
            (this._manager = null),
            (this._reference = l.createRef()),
            (this._handleApplyDefaults = () => {
              const { model: e, chartWidgetCollection: t } = this.props
              e.restorePreferences()
              const i = (0, y.getCurrentTheme)().name
              ;(0, w.loadTheme)(t, {
                themeName: i,
                standardTheme: !0,
                applyOverrides: !0,
                onlyActiveChart: !0,
              })
            }),
            (this._handleSaveAs = () => {
              if (F) {
                const { model: e } = this.props
                window.runOrSignIn(
                  () =>
                    (async (e, t, n) => {
                      const [l, a] = await Promise.all([
                        Promise.all([i.e(1715), i.e(7648)]).then(
                          i.bind(i, 57351),
                        ),
                        (0, y.getThemeNames)(),
                      ])
                      l.showThemeSaveDialog(e, t, a, n)
                    })(
                      e.model().template(),
                      this._syncThemeList,
                      this._handleRenameClose,
                    ),
                  { source: 'Save theme in chart properties' },
                )
              }
            }),
            (this._handleRemoveTheme = (e) => {
              this.setState({
                themes: this.state.themes.filter((t) => t !== e),
              })
            }),
            (this._syncThemeList = () => {
              F &&
                (0, y.getThemeNames)().then((e) => {
                  this.setState({ themes: e })
                })
            }),
            (this._handleListboxFocus = (e) => {
              e.target instanceof HTMLElement &&
                (0, x.handleAccessibleMenuFocus)(e, this._reference)
            }),
            (this._handleRenameClose = () => {
              this._reference.current?.focus()
            }),
            (this.state = { themes: [] }),
            this._syncThemeList()
        }
        render() {
          return l.createElement(
            C.SlotContext.Consumer,
            null,
            (e) => (
              (this._manager = e),
              l.createElement(
                d.MatchMedia,
                { rule: '(max-width: 768px)' },
                (e) =>
                  l.createElement(
                    B.ControlDisclosure,
                    {
                      id: 'series-theme-manager',
                      className: !e && M.themesButtonText,
                      hideArrowButton: e,
                      'data-name': 'theme-select',
                      ref: this._reference,
                      buttonChildren: this._getPlaceHolderItem(e),
                      onListboxFocus: this._handleListboxFocus,
                      onListboxKeyDown: x.handleAccessibleMenuKeyDown,
                    },
                    this._getThemeItems(e),
                  ),
              )
            ),
          )
        }
        _getPlaceHolderItem(e) {
          return e
            ? l.createElement(b.Icon, {
                className: M.themesButtonIcon,
                icon: D,
              })
            : I
        }
        _getThemeItems(e) {
          const {
              isApplyToAllVisible: t,
              chartWidgetCollection: i,
              applyToAllCallback: n,
            } = this.props,
            { themes: a } = this.state
          return l.createElement(
            l.Fragment,
            null,
            e &&
              t &&
              l.createElement(g.AccessibleMenuItem, {
                className: M.defaultsButtonItem,
                isActive: !1,
                label: L,
                onClick: n,
              }),
            l.createElement(g.AccessibleMenuItem, {
              'data-name': 'series-theme-manager-apply-defaults',
              className: M.defaultsButtonItem,
              isActive: !1,
              label: N,
              onClick: this._handleApplyDefaults,
            }),
            F &&
              l.createElement(g.AccessibleMenuItem, {
                'data-name': 'series-theme-manager-save-as',
                className: M.defaultsButtonItem,
                isActive: !1,
                label: R,
                onClick: this._handleSaveAs,
              }),
            a.length > 0 &&
              l.createElement(
                l.Fragment,
                null,
                l.createElement(v.PopupMenuSeparator, { key: 'separator' }),
                a.map((e) =>
                  l.createElement(P, {
                    key: e,
                    themeName: e,
                    onRemove: this._handleRemoveTheme,
                    chartWidgetCollection: i,
                    manager: this._manager,
                  }),
                ),
              ),
          )
        }
      }
      var z = i(59064),
        V = i(71953),
        j = i(24437),
        G = i(97754),
        X = i.n(G),
        K = i(50238),
        H = i(6190),
        O = i(22265),
        U = i(65631),
        q = i(33090)
      const Q = (0, l.forwardRef)((e, t) => {
        const [i, n] = (0, K.useRovingTabindexElement)(t),
          { className: a } = e
        return l.createElement(O.DialogSidebarItem, {
          ...e,
          className: X()(q.accessible, a),
          tag: 'button',
          reference: i,
          tabIndex: n,
        })
      })
      function J(e) {
        const { mode: t, className: i, ...n } = e,
          { isMobile: a, isTablet: o } = (0, U.getSidebarMode)(t),
          s = X()(q.container, o && q.isTablet, a && q.isMobile, i)
        return l.createElement(H.Toolbar, {
          ...n,
          className: s,
          orientation: 'vertical',
          blurOnEscKeydown: !1,
          blurOnClick: !1,
          'data-role': 'dialog-sidebar',
        })
      }
      var Y = i(86656)
      const Z = {
        areaSymbolMinTick: 'normal',
        areaSymbolTimezone: 'normal',
        barSymbolMinTick: 'normal',
        barSymbolTimezone: 'normal',
        baselineSymbolMinTick: 'normal',
        baselineSymbolTimezone: 'normal',
        candleSymbolMinTick: 'normal',
        candleSymbolTimezone: 'normal',
        dateFormat: 'normal',
        haSymbolMinTick: 'normal',
        haSymbolTimezone: 'normal',
        hiloSymbolMinTick: 'normal',
        hiloSymbolTimezone: 'normal',
        hollowCandleSymbolMinTick: 'normal',
        hollowCandleSymbolTimezone: 'normal',
        kagiAtrLength: 'normal',
        kagiReversalAmount: 'normal',
        kagiStyle: 'normal',
        kagiSymbolMinTick: 'normal',
        kagiSymbolTimezone: 'normal',
        lineSymbolMinTick: 'normal',
        lineSymbolTimezone: 'normal',
        sessionId: 'normal',
        lockScale: 'normal',
        mainSeriesSymbolAreaPriceSource: 'normal',
        mainSeriesSymbolBaseLevelPercentage: 'normal',
        mainSeriesSymbolBaseLinePriceSource: 'normal',
        mainSeriesSymbolLinePriceSource: 'normal',
        mainSeriesSymbolStyleType: 'normal',
        navButtons: 'big',
        paneButtons: 'big',
        scalesCurrencyUnit: 'big',
        autoLogButtonsVisibility: 'big',
        pbLb: 'normal',
        pbSymbolMinTick: 'normal',
        pbSymbolTimezone: 'normal',
        pnfAtrLength: 'normal',
        pnfBoxSize: 'normal',
        pnfReversalAmount: 'normal',
        pnfSources: 'normal',
        pnfStyle: 'normal',
        pnfSymbolMinTick: 'normal',
        pnfSymbolTimezone: 'normal',
        rangeSymbolMinTick: 'normal',
        rangeSymbolTimezone: 'normal',
        renkoAtrLength: 'normal',
        renkoBoxSize: 'normal',
        renkoStyle: 'normal',
        renkoSymbolMinTick: 'normal',
        renkoSymbolTimezone: 'normal',
        scalesPlacement: 'normal',
        symbolLastValueLabel: 'big',
        symbolTextSource: 'normal',
        tradingNotifications: 'normal',
        tpoSymbolMinTick: 'normal',
        tpoSymbolTimezone: 'normal',
        volFootprintSymbolMinTick: 'normal',
        volFootprintSymbolTimezone: 'normal',
      }
      var $ = i(48199),
        ee = i(63273),
        te = i(84263)
      function ie(e) {
        return l.createElement($.BackButton, {
          className: te.backButton,
          size: 'medium',
          'aria-label': n.t(null, { context: 'input' }, i(41256)),
          preservePaddings: !0,
          flipIconOnRtl: (0, ee.isRtl)(),
          ...e,
        })
      }
      var ne = i(19291),
        le = i(29016)
      const ae = 'properties_dialog.last_page_id'
      class oe extends l.PureComponent {
        constructor(e) {
          super(e),
            (this._renderChildren = ({ requestResize: e, isSmallWidth: t }) => (
              (this._requestResize = e),
              l.createElement(
                'div',
                { className: le.content },
                this._renderTabs(t),
                this._renderTabContent(t),
              )
            )),
            (this._renderApplyToAllButton = () =>
              l.createElement(
                d.MatchMedia,
                { rule: j.DialogBreakpoints.TabletNormal },
                (e) => this._renderApplyToAll(e),
              )),
            (this._renderFooterLeft = () => {
              const { model: e, chartWidgetCollection: t } = this.props,
                { isApplyToAllVisible: i } = this.state
              return l.createElement(W, {
                model: e,
                isApplyToAllVisible: i,
                applyToAllCallback: this._handleApplyToAll,
                chartWidgetCollection: t,
              })
            }),
            (this._createTabClickHandler = (e) => () => this._selectPage(e)),
            (this._selectPage = (e, t) => {
              const { activePage: i } = this.state
              e !== i &&
                (i &&
                  i.definitions.unsubscribe(
                    this._onChangeActivePageDefinitions,
                  ),
                null !== e &&
                  (t || h().setValue(ae, e.id),
                  e.definitions.subscribe(this._onChangeActivePageDefinitions)),
                this.setState({ activePage: e, tableKey: Date.now() }, () => {
                  this._requestResize && this._requestResize()
                }))
            }),
            (this._onChangeActivePageDefinitions = () => {
              V.logger.logNormal('Definition collection was updated'),
                this.setState({ tableKey: Date.now() }, () => {
                  this._requestResize && this._requestResize()
                })
            }),
            (this._onTabVisibilityChanged = () => {
              const e = this.props.pages.filter((e) => e.visible.value())
              this.setState({ visiblePages: e })
              const t = this.state.activePage
              null === t ||
                e.includes(t) ||
                this._selectPage(0 === e.length ? null : e[0], !0)
            }),
            (this._handleCancel = () => {
              this.props.onCancel(), this.props.onClose()
            }),
            (this._handleSubmit = () => {
              this.props.onSubmit(), this.props.onClose()
            }),
            (this._handleScroll = () => {
              z.globalCloseDelegate.fire()
            }),
            (this._handleApplyToAll = () => {
              const { chartWidgetCollection: e, model: t } = this.props,
                { isApplyToAllVisible: i } = this.state
              i && e.applyPreferencesToAllCharts(t)
            }),
            (this._syncApplyToAllVisibility = () => {
              const { chartWidgetCollection: e } = this.props
              this.setState({
                isApplyToAllVisible: (0, u.isMultipleLayout)(e.layout.value()),
              })
            }),
            (this._handleBackClick = () => {
              const { activePage: e } = this.state
              e &&
                e.definitions.unsubscribe(this._onChangeActivePageDefinitions),
                this.setState({ activePage: null })
            }),
            (this._handleForceFocus = (e) => {
              ;(0, ne.updateTabIndexes)(),
                setTimeout(() => {
                  const [t] = (0, ne.queryTabbableElements)(e)
                  t && t.focus()
                })
            })
          const { pages: t, activePageId: i } = e,
            n = t.filter((e) => e.visible.value())
          let a = n.find((e) => e.id === i) ?? null
          if (!a) {
            const e = h().getValue(ae),
              t = n.find((t) => t.id === e)
            a = t || (n.length > 0 ? n[0] : null)
          }
          this.state = {
            activePage: a,
            visiblePages: n,
            isApplyToAllVisible: (0, u.isMultipleLayout)(
              e.chartWidgetCollection.layout.value(),
            ),
            tableKey: Date.now(),
          }
        }
        componentDidMount() {
          const { chartWidgetCollection: e, pages: t } = this.props,
            { activePage: i } = this.state
          e.layout.subscribe(this._syncApplyToAllVisibility),
            i && i.definitions.subscribe(this._onChangeActivePageDefinitions),
            t.forEach((e) => e.visible.subscribe(this._onTabVisibilityChanged))
        }
        componentWillUnmount() {
          const { chartWidgetCollection: e, pages: t } = this.props,
            { activePage: i } = this.state
          i && i.definitions.unsubscribe(this._onChangeActivePageDefinitions),
            e.layout.unsubscribe(this._syncApplyToAllVisibility),
            t.forEach((e) =>
              e.visible.unsubscribe(this._onTabVisibilityChanged),
            )
        }
        render() {
          const { isOpened: e, onClose: t, shouldReturnFocus: a } = this.props,
            { activePage: o } = this.state
          return l.createElement(
            d.MatchMedia,
            { rule: j.DialogBreakpoints.TabletSmall },
            (r) =>
              l.createElement(s.AdaptiveConfirmDialog, {
                className: le.withSidebar,
                dataName: 'series-properties-dialog',
                onClose: t,
                isOpened: e,
                title: null !== o && r ? o.title : n.t(null, void 0, i(32514)),
                footerLeftRenderer: this._renderFooterLeft,
                additionalButtons: this._renderApplyToAllButton(),
                additionalHeaderElement:
                  null !== o && r
                    ? l.createElement(ie, { onClick: this._handleBackClick })
                    : void 0,
                onSubmit: this._handleSubmit,
                onForceFocus: this._handleForceFocus,
                onCancel: this._handleCancel,
                render: this._renderChildren,
                submitOnEnterKey: !1,
                shouldReturnFocus: a,
              }),
          )
        }
        _renderTabContent(e) {
          const { pages: t } = this.props,
            i = this._getCurrentPage(e)
          if (i) {
            const e = t.find((e) => e.id === i.id),
              n = e ? e.definitions.value() : []
            return l.createElement(
              Y.TouchScrollContainer,
              { className: le.tabContent, onScroll: this._handleScroll },
              l.createElement(
                r.ControlCustomWidthContext.Provider,
                { value: Z },
                l.createElement(
                  c.PropertyTable,
                  { key: this.state.tableKey },
                  n.map((e) =>
                    l.createElement(o.Section, { key: e.id, definition: e }),
                  ),
                ),
              ),
            )
          }
          return null
        }
        _renderTabs(e) {
          const { activePage: t, visiblePages: i } = this.state
          if (t && e) return null
          const n = this._getCurrentPage(e)
          return l.createElement(
            d.MatchMedia,
            { rule: j.DialogBreakpoints.TabletNormal },
            (e) =>
              l.createElement(
                d.MatchMedia,
                { rule: j.DialogBreakpoints.TabletSmall },
                (t) => {
                  const a = t ? 'mobile' : e ? 'tablet' : void 0
                  return l.createElement(
                    J,
                    { mode: a, onScroll: this._handleScroll },
                    i.map((e) =>
                      l.createElement(Q, {
                        key: e.id,
                        mode: a,
                        'data-name': e.id,
                        title: e.title,
                        icon: e.icon,
                        onClick: this._createTabClickHandler(e),
                        isActive: n ? e.id === n.id : void 0,
                      }),
                    ),
                  )
                },
              ),
          )
        }
        _renderApplyToAll(e) {
          const { isApplyToAllVisible: t } = this.state
          return (
            !e &&
            t &&
            l.createElement(
              'span',
              { className: le.applyToAllButton },
              l.createElement(
                a.Button,
                { appearance: 'stroke', onClick: this._handleApplyToAll },
                n.t(null, void 0, i(77571)),
              ),
            )
          )
        }
        _getCurrentPage(e) {
          const { pages: t } = this.props,
            { activePage: i } = this.state
          let n = null
          return i ? (n = i) : !e && t.length && (n = t[0]), n
        }
      }
      var se = i(76422),
        re = i(29280),
        ce = i(19466),
        me = i(87896)
      const he = n.t(null, void 0, i(32514))
      class ue extends re.DialogRenderer {
        constructor(e) {
          super(),
            (this._handleClose = () => {
              this._rootInstance?.unmount(),
                this._setVisibility(!1),
                this._onClose && this._onClose()
            }),
            (this._handleSubmit = () => {}),
            (this._handleCancel = () => {
              this._model.undoToCheckpoint(this._checkpoint)
            }),
            (this._propertyPages = e.propertyPages),
            (this._model = e.model),
            (this._activePageId = e.activePageId),
            (this._onClose = e.onClose),
            (this._chartWidgetCollection = e.chartWidgetCollection),
            (this._checkpoint = this._ensureCheckpoint(e.undoCheckPoint))
        }
        hide(e) {
          e ? this._handleCancel() : this._handleSubmit(), this._handleClose()
        }
        isVisible() {
          return this.visible().value()
        }
        show(e) {
          this.visible().value() ||
            ((this._rootInstance = (0, me.createReactRoot)(
              l.createElement(oe, {
                title: he,
                isOpened: !0,
                onSubmit: this._handleSubmit,
                onClose: this._handleClose,
                onCancel: this._handleCancel,
                pages: this._propertyPages,
                model: this._model,
                activePageId: this._activePageId,
                chartWidgetCollection: this._chartWidgetCollection,
                shouldReturnFocus: e?.shouldReturnFocus,
              }),
              this._container,
            )),
            this._setVisibility(!0),
            se.emit('edit_object_dialog', {
              objectType: 'mainSeries',
              scriptTitle: this._model
                .mainSeries()
                .title(ce.TitleDisplayTarget.StatusLine),
            }))
        }
        _ensureCheckpoint(e) {
          return void 0 === e && (e = this._model.createUndoCheckpoint()), e
        }
      }
    },
    11684: (e, t, i) => {
      i.d(t, { PopupMenuSeparator: () => r })
      var n,
        l = i(50959),
        a = i(97754),
        o = i.n(a),
        s = i(238)
      function r(e) {
        const { size: t = 'normal', className: i, ariaHidden: n = !1 } = e
        return l.createElement('div', {
          className: o()(
            s.separator,
            'small' === t && s.small,
            'normal' === t && s.normal,
            'large' === t && s.large,
            i,
          ),
          role: 'separator',
          'aria-hidden': n,
        })
      }
      !((e) => {
        ;(e.Small = 'small'), (e.Large = 'large'), (e.Normal = 'normal')
      })(n || (n = {}))
    },
    26448: (e) => {
      e.exports = {
        accessible: 'accessible-NQERJsv9',
        active: 'active-NQERJsv9',
      }
    },
    9306: (e) => {
      e.exports = { button: 'button-Y1TCZogJ', active: 'active-Y1TCZogJ' }
    },
    10838: (e, t, i) => {
      i.d(t, { AccessibleMenuItem: () => m })
      var n = i(50959),
        l = i(97754),
        a = i.n(l),
        o = i(3343),
        s = i(50238),
        r = i(16396),
        c = i(26448)
      function m(e) {
        const { className: t, ...i } = e,
          [l, m] = (0, s.useRovingTabindexElement)(null)
        return n.createElement(r.PopupMenuItem, {
          ...i,
          className: a()(c.accessible, e.isActive && c.active, t),
          reference: l,
          tabIndex: m,
          onKeyDown: (e) => {
            if (e.target !== e.currentTarget) return
            const t = (0, o.hashFromEvent)(e)
            ;(13 !== t && 32 !== t) ||
              (e.preventDefault(),
              l.current instanceof HTMLElement && l.current.click())
          },
          'data-role': 'menuitem',
          'aria-disabled': e.isDisabled || void 0,
          toolboxRole: 'toolbar',
        })
      }
    },
    38068: (e, t, i) => {
      i.d(t, { MenuRemoveButton: () => h })
      var n = i(50959),
        l = i(97754),
        a = i.n(l),
        o = i(11542),
        s = i(50238),
        r = i(96040),
        c = i(60925),
        m = i(9306)
      function h(e) {
        const { onClick: t, isActive: l, onKeyDown: h, ...u } = e,
          [d, b] = (0, s.useRovingTabindexElement)(null)
        return n.createElement(
          'button',
          {
            ref: d,
            tabIndex: b,
            onClick: t,
            onKeyDown: h,
            className: a()(m.button, l && m.active, 'apply-common-tooltip'),
            'aria-label': o.t(null, void 0, i(67410)),
            'data-tooltip': o.t(null, void 0, i(67410)),
            type: 'button',
          },
          n.createElement(r.RemoveButton, {
            ...u,
            isActive: l,
            title: '',
            icon: c,
          }),
        )
      }
    },
    68648: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentcolor" stroke-width="1.3" d="M12 9l5 5-5 5"/></svg>'
    },
  },
])
