;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7078],
  {
    37463: (e) => {
      e.exports = { backButton: 'backButton-yMMXpYEB' }
    },
    54829: (e) => {
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
        accessible: 'accessible-nGEmjtaX',
      }
    },
    62845: (e) => {
      e.exports = {
        'tablet-normal-breakpoint': 'screen and (max-width: 768px)',
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
        withSidebar: 'withSidebar-F0WBLDV5',
        content: 'content-F0WBLDV5',
        tabContent: 'tabContent-F0WBLDV5',
        applyToAllButton: 'applyToAllButton-F0WBLDV5',
      }
    },
    12009: (e) => {
      e.exports = {
        themesButtonText: 'themesButtonText-w7kgghoW',
        themesButtonIcon: 'themesButtonIcon-w7kgghoW',
        defaultsButtonText: 'defaultsButtonText-w7kgghoW',
        defaultsButtonItem: 'defaultsButtonItem-w7kgghoW',
        remove: 'remove-w7kgghoW',
      }
    },
    92910: (e) => {
      e.exports = {
        separator: 'separator-QjUlCDId',
        small: 'small-QjUlCDId',
        normal: 'normal-QjUlCDId',
        large: 'large-QjUlCDId',
      }
    },
    22265: (e, t, a) => {
      a.d(t, {
        DialogSidebarContainer: () => d,
        DialogSidebarItem: () => h,
        DialogSidebarWrapper: () => m,
      })
      var i = a(50959),
        n = a(97754),
        l = a.n(n),
        s = a(9745),
        r = a(65631),
        o = a(68648),
        c = a(54829)
      function d(e) {
        const { mode: t, className: a, ...n } = e,
          { isMobile: s, isTablet: o } = (0, r.getSidebarMode)(t),
          d = l()(c.container, o && c.isTablet, s && c.isMobile, a)
        return i.createElement('div', {
          ...n,
          className: d,
          'data-role': 'dialog-sidebar',
        })
      }
      function m(e) {
        return i.createElement('div', { className: c.wrapper, ...e })
      }
      function h(e) {
        const {
            mode: t,
            title: a,
            icon: n,
            isActive: d,
            onClick: m,
            tag: h = 'div',
            reference: u,
            className: p,
            ..._
          } = e,
          { isMobile: g, isTablet: b } = (0, r.getSidebarMode)(t),
          v = d
            ? null == n
              ? void 0
              : n.active
            : null == n
              ? void 0
              : n.default
        return i.createElement(
          h,
          {
            ..._,
            ref: u,
            className: l()(
              c.tab,
              b && c.isTablet,
              g && c.isMobile,
              d && c.active,
              p,
            ),
            onClick: m,
          },
          n && i.createElement(s.Icon, { className: c.icon, icon: v }),
          !b &&
            i.createElement(
              'span',
              { className: l()(c.title, !n && c.withoutIcon) },
              i.createElement('span', { className: c.titleText }, a),
              g && i.createElement(s.Icon, { className: c.nested, icon: o }),
            ),
        )
      }
    },
    65631: (e, t, a) => {
      function i(e) {
        return { isMobile: 'mobile' === e, isTablet: 'tablet' === e }
      }
      a.d(t, { getSidebarMode: () => i })
    },
    56080: (e, t, a) => {
      a.r(t), a.d(t, { GeneralChartPropertiesDialogRenderer: () => me })
      var i = a(11542),
        n = a(50959),
        l = a(962),
        s = a(94720),
        r = a(82064),
        o = a(50182),
        c = a(66849),
        d = a(11062),
        m = a(56840),
        h = a.n(m),
        u = a(75531),
        p = a(90692),
        _ = a(9745),
        g = a(14483),
        b = a(81351),
        v = a(51613),
        f = a(11014),
        y = (a(42053), a(3615))
      const k = i.t(null, void 0, a(40837))
      var T = a(50655),
        S = a(53180),
        C = a(74628),
        A = a(51768),
        L = a(70412),
        E = a(32563),
        z = a(12009)
      function I(e) {
        const {
            themeName: t,
            chartWidgetCollection: a,
            onRemove: i,
            manager: l,
          } = e,
          [s, r] = (0, L.useHover)(),
          o = n.useCallback(
            () =>
              ((e, t, a) => {
                ;(0, y.showConfirm)(
                  {
                    text: k.format({ name: e }),
                    onConfirm: ({ dialogClose: a }) => {
                      ;(0, f.removeTheme)(e), t && t(e), a()
                    },
                  },
                  a,
                )
              })(t, i, l),
            [t, i, l],
          ),
          c = n.useCallback(() => {
            ;(0, f.loadTheme)(a, { themeName: t, standardTheme: !1 }).then(
              () => {
                ;(0, A.trackEvent)('GUI', 'Switch to custom theme')
              },
            )
          }, [t, a])
        return n.createElement(
          'div',
          { ...r },
          n.createElement(b.AccessibleMenuItem, {
            'data-series-theme-item-theme-name': t,
            className: z.defaultsButtonItem,
            isActive: !1,
            label: t,
            onClick: c,
            toolbox: n.createElement(C.MenuRemoveButton, {
              className: z.remove,
              hidden: !E.mobiletouch && !s,
              onClick: o,
            }),
          }),
        )
      }
      var x = a(95276),
        D = a(81261),
        M = a(44996)
      const N = i.t(null, void 0, a(19611)),
        B = i.t(null, void 0, a(73169)),
        w = (0, S.appendEllipsis)(i.t(null, void 0, a(9908))),
        j = i.t(null, void 0, a(75819)),
        P = g.enabled('chart_template_storage')
      class H extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._manager = null),
            (this._reference = n.createRef()),
            (this._handleApplyDefaults = () => {
              const { model: e, chartWidgetCollection: t } = this.props
              e.restorePreferences()
              const a = (0, f.getCurrentTheme)().name
              ;(0, f.loadTheme)(t, {
                themeName: a,
                standardTheme: !0,
                applyOverrides: !0,
                onlyActiveChart: !0,
              })
            }),
            (this._handleSaveAs = () => {
              if (P) {
                const { model: e } = this.props
                window.runOrSignIn(
                  () =>
                    (async (e, t, i) => {
                      const [n, l] = await Promise.all([
                        a.e(7648).then(a.bind(a, 57351)),
                        (0, f.getThemeNames)(),
                      ])
                      n.showThemeSaveDialog(e, t, l, i)
                    })(
                      e.model().theme(),
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
              P &&
                (0, f.getThemeNames)().then((e) => {
                  this.setState({ themes: e })
                })
            }),
            (this._handleListboxFocus = (e) => {
              e.target instanceof HTMLElement &&
                (0, D.handleAccessibleMenuFocus)(e, this._reference)
            }),
            (this._handleRenameClose = () => {
              var e
              null === (e = this._reference.current) ||
                void 0 === e ||
                e.focus()
            }),
            (this.state = { themes: [] }),
            this._syncThemeList()
        }
        render() {
          return n.createElement(
            T.SlotContext.Consumer,
            null,
            (e) => (
              (this._manager = e),
              n.createElement(
                p.MatchMedia,
                { rule: 'screen and (max-width: 768px)' },
                (e) =>
                  n.createElement(
                    x.ControlDisclosure,
                    {
                      id: 'series-theme-manager',
                      className: !e && z.themesButtonText,
                      hideArrowButton: e,
                      'data-name': 'theme-select',
                      ref: this._reference,
                      buttonChildren: this._getPlaceHolderItem(e),
                      onListboxFocus: this._handleListboxFocus,
                      onListboxKeyDown: D.handleAccessibleMenuKeyDown,
                    },
                    this._getThemeItems(e),
                  ),
              )
            ),
          )
        }
        _getPlaceHolderItem(e) {
          return e
            ? n.createElement(_.Icon, {
                className: z.themesButtonIcon,
                icon: M,
              })
            : N
        }
        _getThemeItems(e) {
          const {
              isApplyToAllVisible: t,
              chartWidgetCollection: a,
              applyToAllCallback: i,
            } = this.props,
            { themes: l } = this.state
          return n.createElement(
            n.Fragment,
            null,
            e &&
              t &&
              n.createElement(b.AccessibleMenuItem, {
                className: z.defaultsButtonItem,
                isActive: !1,
                label: j,
                onClick: i,
              }),
            n.createElement(b.AccessibleMenuItem, {
              'data-name': 'series-theme-manager-apply-defaults',
              className: z.defaultsButtonItem,
              isActive: !1,
              label: B,
              onClick: this._handleApplyDefaults,
            }),
            P &&
              n.createElement(b.AccessibleMenuItem, {
                'data-name': 'series-theme-manager-save-as',
                className: z.defaultsButtonItem,
                isActive: !1,
                label: w,
                onClick: this._handleSaveAs,
              }),
            l.length > 0 &&
              n.createElement(
                n.Fragment,
                null,
                n.createElement(v.PopupMenuSeparator, { key: 'separator' }),
                l.map((e) =>
                  n.createElement(I, {
                    key: e,
                    themeName: e,
                    onRemove: this._handleRemoveTheme,
                    chartWidgetCollection: a,
                    manager: this._manager,
                  }),
                ),
              ),
          )
        }
      }
      var W = a(59064),
        U = a(71953),
        R = a(24437),
        V = a(97754),
        G = a.n(V),
        Y = a(50238),
        F = a(16838),
        O = a(54079),
        q = a(22265),
        K = a(65631),
        X = a(54829)
      function Z(e) {
        const [t, a] = (0, Y.useRovingTabindexElement)(null)
        return n.createElement(q.DialogSidebarItem, {
          ...e,
          className: F.PLATFORM_ACCESSIBILITY_ENABLED ? X.accessible : void 0,
          tag: F.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div',
          reference: t,
          tabIndex: a,
        })
      }
      function J(e) {
        if (!F.PLATFORM_ACCESSIBILITY_ENABLED)
          return n.createElement(q.DialogSidebarContainer, { ...e })
        const { mode: t, className: a, ...i } = e,
          { isMobile: l, isTablet: s } = (0, K.getSidebarMode)(t),
          r = G()(X.container, s && X.isTablet, l && X.isMobile, a)
        return n.createElement(O.Toolbar, {
          ...i,
          className: r,
          orientation: 'vertical',
          blurOnEscKeydown: !1,
          blurOnClick: !1,
          'data-role': 'dialog-sidebar',
        })
      }
      var Q = a(86656)
      const $ = {
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
      }
      var ee = a(48199),
        te = a(38223),
        ae = a(37463)
      function ie(e) {
        return n.createElement(ee.BackButton, {
          className: ae.backButton,
          size: 'medium',
          'aria-label': i.t(null, { context: 'input' }, a(16936)),
          preservePaddings: !0,
          flipIconOnRtl: (0, te.isRtl)(),
          ...e,
        })
      }
      var ne = a(62845)
      const le = 'properties_dialog.last_page_id'
      class se extends n.PureComponent {
        constructor(e) {
          var t
          super(e),
            (this._renderChildren = ({ requestResize: e, isSmallWidth: t }) => (
              (this._requestResize = e),
              n.createElement(
                'div',
                { className: ne.content },
                this._renderTabs(t),
                this._renderTabContent(t),
              )
            )),
            (this._renderApplyToAllButton = () =>
              n.createElement(
                p.MatchMedia,
                { rule: R.DialogBreakpoints.TabletNormal },
                (e) => this._renderApplyToAll(e),
              )),
            (this._renderFooterLeft = () => {
              const { model: e, chartWidgetCollection: t } = this.props,
                { isApplyToAllVisible: a } = this.state
              return n.createElement(H, {
                model: e,
                isApplyToAllVisible: a,
                applyToAllCallback: this._handleApplyToAll,
                chartWidgetCollection: t,
              })
            }),
            (this._createTabClickHandler = (e) => () => this._selectPage(e)),
            (this._selectPage = (e, t) => {
              const { activePage: a } = this.state
              e !== a &&
                (a &&
                  a.definitions.unsubscribe(
                    this._onChangeActivePageDefinitions,
                  ),
                null !== e &&
                  (t || h().setValue(le, e.id),
                  e.definitions.subscribe(this._onChangeActivePageDefinitions)),
                this.setState({ activePage: e, tableKey: Date.now() }, () => {
                  this._requestResize && this._requestResize()
                }))
            }),
            (this._onChangeActivePageDefinitions = () => {
              U.logger.logNormal('Definition collection was updated'),
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
              W.globalCloseDelegate.fire()
            }),
            (this._handleApplyToAll = () => {
              const { chartWidgetCollection: e, model: t } = this.props,
                { isApplyToAllVisible: a } = this.state
              a && e.applyPreferencesToAllCharts(t)
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
              ;(0, F.updateTabIndexes)(),
                setTimeout(() => {
                  const [t] = (0, F.queryTabbableElements)(e)
                  t && t.focus()
                })
            })
          const { pages: a, activePageId: i } = e,
            l = a.filter((e) => e.visible.value())
          let s =
            null !== (t = l.find((e) => e.id === i)) && void 0 !== t ? t : null
          if (!s) {
            const e = h().getValue(le),
              t = l.find((t) => t.id === e)
            s = t || (l.length > 0 ? l[0] : null)
          }
          this.state = {
            activePage: s,
            visiblePages: l,
            isApplyToAllVisible: (0, u.isMultipleLayout)(
              e.chartWidgetCollection.layout.value(),
            ),
            tableKey: Date.now(),
          }
        }
        componentDidMount() {
          const { chartWidgetCollection: e, pages: t } = this.props,
            { activePage: a } = this.state
          e.layout.subscribe(this._syncApplyToAllVisibility),
            a && a.definitions.subscribe(this._onChangeActivePageDefinitions),
            t.forEach((e) => e.visible.subscribe(this._onTabVisibilityChanged))
        }
        componentWillUnmount() {
          const { chartWidgetCollection: e, pages: t } = this.props,
            { activePage: a } = this.state
          a && a.definitions.unsubscribe(this._onChangeActivePageDefinitions),
            e.layout.unsubscribe(this._syncApplyToAllVisibility),
            t.forEach((e) =>
              e.visible.unsubscribe(this._onTabVisibilityChanged),
            )
        }
        render() {
          const { isOpened: e, onClose: t, shouldReturnFocus: l } = this.props,
            { activePage: s } = this.state
          return n.createElement(
            p.MatchMedia,
            { rule: R.DialogBreakpoints.TabletSmall },
            (r) =>
              n.createElement(o.AdaptiveConfirmDialog, {
                className: ne.withSidebar,
                dataName: 'series-properties-dialog',
                onClose: t,
                isOpened: e,
                title: null !== s && r ? s.title : i.t(null, void 0, a(74207)),
                footerLeftRenderer: this._renderFooterLeft,
                additionalButtons: this._renderApplyToAllButton(),
                additionalHeaderElement:
                  null !== s && r
                    ? n.createElement(ie, {
                        onClick: this._handleBackClick,
                      })
                    : void 0,
                onSubmit: this._handleSubmit,
                onForceFocus: F.PLATFORM_ACCESSIBILITY_ENABLED
                  ? this._handleForceFocus
                  : void 0,
                onCancel: this._handleCancel,
                render: this._renderChildren,
                submitOnEnterKey: !1,
                shouldReturnFocus: l,
              }),
          )
        }
        _renderTabContent(e) {
          const { pages: t } = this.props,
            a = this._getCurrentPage(e)
          if (a) {
            const e = t.find((e) => e.id === a.id),
              i = e ? e.definitions.value() : []
            return n.createElement(
              Q.TouchScrollContainer,
              { className: ne.tabContent, onScroll: this._handleScroll },
              n.createElement(
                c.ControlCustomWidthContext.Provider,
                { value: $ },
                n.createElement(
                  d.PropertyTable,
                  { key: this.state.tableKey },
                  i.map((e) =>
                    n.createElement(r.Section, { key: e.id, definition: e }),
                  ),
                ),
              ),
            )
          }
          return null
        }
        _renderTabs(e) {
          const { activePage: t, visiblePages: a } = this.state
          if (t && e) return null
          const i = this._getCurrentPage(e)
          return n.createElement(
            p.MatchMedia,
            { rule: R.DialogBreakpoints.TabletNormal },
            (e) =>
              n.createElement(
                p.MatchMedia,
                { rule: R.DialogBreakpoints.TabletSmall },
                (t) => {
                  const l = t ? 'mobile' : e ? 'tablet' : void 0
                  return n.createElement(
                    J,
                    { mode: l, onScroll: this._handleScroll },
                    a.map((e) =>
                      n.createElement(Z, {
                        key: e.id,
                        mode: l,
                        'data-name': e.id,
                        title: e.title,
                        icon: e.icon,
                        onClick: this._createTabClickHandler(e),
                        isActive: i ? e.id === i.id : void 0,
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
            n.createElement(
              'span',
              { className: ne.applyToAllButton },
              n.createElement(
                s.Button,
                { appearance: 'stroke', onClick: this._handleApplyToAll },
                i.t(null, void 0, a(75819)),
              ),
            )
          )
        }
        _getCurrentPage(e) {
          const { pages: t } = this.props,
            { activePage: a } = this.state
          let i = null
          return a ? (i = a) : !e && t.length && (i = t[0]), i
        }
      }
      var re = a(76422),
        oe = a(85067),
        ce = a(37591)
      const de = i.t(null, void 0, a(74207))
      class me extends oe.DialogRenderer {
        constructor(e) {
          super(),
            (this._handleClose = () => {
              l.unmountComponentAtNode(this._container),
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
          l.render(
            n.createElement(se, {
              title: de,
              isOpened: !0,
              onSubmit: this._handleSubmit,
              onClose: this._handleClose,
              onCancel: this._handleCancel,
              pages: this._propertyPages,
              model: this._model,
              activePageId: this._activePageId,
              chartWidgetCollection: this._chartWidgetCollection,
              shouldReturnFocus: null == e ? void 0 : e.shouldReturnFocus,
            }),
            this._container,
          ),
            this._setVisibility(!0),
            re.emit('edit_object_dialog', {
              objectType: 'mainSeries',
              scriptTitle: this._model
                .mainSeries()
                .title(ce.TitleDisplayTarget.StatusLine),
            })
        }
        _ensureCheckpoint(e) {
          return void 0 === e && (e = this._model.createUndoCheckpoint()), e
        }
      }
    },
    51613: (e, t, a) => {
      a.d(t, { PopupMenuSeparator: () => r })
      var i = a(50959),
        n = a(97754),
        l = a.n(n),
        s = a(92910)
      function r(e) {
        const { size: t = 'normal', className: a, ariaHidden: n = !1 } = e
        return i.createElement('div', {
          className: l()(
            s.separator,
            'small' === t && s.small,
            'normal' === t && s.normal,
            'large' === t && s.large,
            a,
          ),
          role: 'separator',
          'aria-hidden': n,
        })
      }
    },
    47102: (e) => {
      e.exports = {
        accessible: 'accessible-NQERJsv9',
        active: 'active-NQERJsv9',
      }
    },
    90826: (e) => {
      e.exports = { button: 'button-Y1TCZogJ', active: 'active-Y1TCZogJ' }
    },
    81351: (e, t, a) => {
      a.d(t, { AccessibleMenuItem: () => m })
      var i = a(50959),
        n = a(97754),
        l = a.n(n),
        s = a(3343),
        r = a(50238),
        o = a(16838),
        c = a(16396),
        d = a(47102)
      function m(e) {
        const { className: t, ...a } = e,
          [n, m] = (0, r.useRovingTabindexElement)(null)
        return i.createElement(c.PopupMenuItem, {
          ...a,
          className: l()(
            o.PLATFORM_ACCESSIBILITY_ENABLED && d.accessible,
            e.isActive && d.active,
            t,
          ),
          reference: n,
          tabIndex: m,
          onKeyDown: (e) => {
            if (
              !o.PLATFORM_ACCESSIBILITY_ENABLED ||
              e.target !== e.currentTarget
            )
              return
            const t = (0, s.hashFromEvent)(e)
            ;(13 !== t && 32 !== t) ||
              (e.preventDefault(),
              n.current instanceof HTMLElement && n.current.click())
          },
          'data-role': o.PLATFORM_ACCESSIBILITY_ENABLED ? 'menuitem' : void 0,
          'aria-disabled':
            (o.PLATFORM_ACCESSIBILITY_ENABLED && e.isDisabled) || void 0,
        })
      }
    },
    74628: (e, t, a) => {
      a.d(t, { MenuRemoveButton: () => d })
      var i = a(50959),
        n = a(97754),
        l = a.n(n),
        s = a(50238),
        r = a(16838),
        o = a(96040),
        c = a(90826)
      function d(e) {
        const { tooltip: t, onClick: a, ...n } = e,
          [d, m] = (0, s.useRovingTabindexElement)(null)
        return r.PLATFORM_ACCESSIBILITY_ENABLED
          ? i.createElement(
              'button',
              {
                ref: d,
                tabIndex: m,
                onClick: a,
                className: l()(c.button, n.isActive && c.active),
                type: 'button',
              },
              i.createElement(o.RemoveButton, {
                'aria-label': t,
                ...n,
                'data-tooltip': t,
              }),
            )
          : i.createElement(o.RemoveButton, { ...e, 'data-tooltip': t })
      }
    },
    68648: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentcolor" stroke-width="1.3" d="M12 9l5 5-5 5"/></svg>'
    },
    60558: (e) => {
      e.exports = {
        ar: ['الحيوانات والطبيعة'],
        ca_ES: ['animals i natura'],
        cs: 'animals & nature',
        de: ['Tiere & Natur'],
        el: 'animals & nature',
        en: 'animals & nature',
        es: ['animales y naturaleza'],
        fa: 'animals & nature',
        fr: ['animaux & nature'],
        he_IL: ['בעלי חיים וטבע'],
        hu_HU: 'animals & nature',
        id_ID: ['hewan & alam'],
        it: ['animali e natura'],
        ja: ['動物 & 自然'],
        ko: ['애니멀 & 네이처'],
        ms_MY: ['haiwan & alam'],
        nl_NL: 'animals & nature',
        pl: ['zwierzęta i natura'],
        pt: ['animais & natureza'],
        ro: 'animals & nature',
        ru: ['животные и природа'],
        sv: ['djur & natur'],
        th: ['สัตว์และธรรมชาติ'],
        tr: ['hayvanlar & doğa'],
        vi: ['động vật và thiên nhiên'],
        zh: ['动物&自然'],
        zh_TW: ['動物&自然'],
      }
    },
    14232: (e) => {
      e.exports = {
        ar: ['أنشطة'],
        ca_ES: ['activitat'],
        cs: 'activity',
        de: ['Aktivität'],
        el: 'activity',
        en: 'activity',
        es: ['actividad'],
        fa: 'activity',
        fr: ['activité'],
        he_IL: ['פעילות'],
        hu_HU: 'activity',
        id_ID: ['aktivitas'],
        it: ['attività'],
        ja: ['アクティビティ'],
        ko: ['액티비티'],
        ms_MY: ['aktiviti'],
        nl_NL: 'activity',
        pl: ['aktywność'],
        pt: ['atividade'],
        ro: 'activity',
        ru: ['спорт и активность'],
        sv: ['aktiviteter'],
        th: ['กิจกรรม'],
        tr: ['aktivite'],
        vi: ['hoạt động'],
        zh: ['活动'],
        zh_TW: ['活動'],
      }
    },
    35305: (e) => {
      e.exports = {
        ar: ['الطعام والشراب'],
        ca_ES: ['menjar i begudes'],
        cs: 'food & drink',
        de: ['Essen & Trinken'],
        el: 'food & drink',
        en: 'food & drink',
        es: ['comida y bebida'],
        fa: 'food & drink',
        fr: ['nourriture & boissons'],
        he_IL: ['אוכל ושתייה'],
        hu_HU: 'food & drink',
        id_ID: ['makanan & minuman'],
        it: ['cibo e bevande'],
        ja: ['フード & ドリンク'],
        ko: ['푸드 & 드링크'],
        ms_MY: ['makanan & minuman'],
        nl_NL: 'food & drink',
        pl: ['żywność i napoje'],
        pt: ['comida & bebida'],
        ro: 'food & drink',
        ru: ['еда и напитки'],
        sv: ['mat & dryck'],
        th: ['อาหารเครื่องดื่ม'],
        tr: ['yiyecek & içecek'],
        vi: ['đồ ăn & đồ uống'],
        zh: ['食物&饮料'],
        zh_TW: ['食物&飲料'],
      }
    },
    49546: (e) => {
      e.exports = {
        ar: ['أعلام'],
        ca_ES: ['banderes'],
        cs: 'flags',
        de: ['Flaggen'],
        el: 'flags',
        en: 'flags',
        es: ['banderas'],
        fa: 'flags',
        fr: ['drapeaux'],
        he_IL: ['דגלים'],
        hu_HU: 'flags',
        id_ID: ['bendera'],
        it: ['bandiere'],
        ja: ['旗'],
        ko: ['플래그'],
        ms_MY: ['bendera-bendera'],
        nl_NL: 'flags',
        pl: ['flagi'],
        pt: ['bandeiras'],
        ro: 'flags',
        ru: ['флаги'],
        sv: ['flaggor'],
        th: ['ธง'],
        tr: ['bayraklar'],
        vi: ['gắn cờ'],
        zh: ['旗帜'],
        zh_TW: ['旗幟'],
      }
    },
    72302: (e) => {
      e.exports = {
        ar: ['أشياء'],
        ca_ES: ['objectes'],
        cs: 'objects',
        de: ['Objekte'],
        el: 'objects',
        en: 'objects',
        es: ['objetos'],
        fa: 'objects',
        fr: ['objets'],
        he_IL: ['אובייקטים'],
        hu_HU: 'objects',
        id_ID: ['objek'],
        it: ['oggetti'],
        ja: ['モノ'],
        ko: ['오브젝트'],
        ms_MY: ['objek-objek'],
        nl_NL: 'objects',
        pl: ['obiekty'],
        pt: ['objetos'],
        ro: 'objects',
        ru: ['предметы'],
        sv: ['objekt'],
        th: ['วัตถุ'],
        tr: ['nesneler'],
        vi: ['các đối tượng'],
        zh: ['物品'],
        zh_TW: ['物品'],
      }
    },
    96330: (e) => {
      e.exports = {
        ar: ['الابتسامات والأشخاص'],
        ca_ES: ['cares i gent'],
        cs: 'smiles & people',
        de: ['Smilies & Menschen'],
        el: 'smiles & people',
        en: 'smiles & people',
        es: ['emoticonos y personas'],
        fa: 'smiles & people',
        fr: ['sourires & personnes'],
        he_IL: ['חיוכים ואנשים'],
        hu_HU: 'smiles & people',
        id_ID: ['senyuman & orang'],
        it: ['smile e persone'],
        ja: ['スマイル & 人物'],
        ko: ['스마일 & 피플'],
        ms_MY: ['senyuman & orang'],
        nl_NL: 'smiles & people',
        pl: ['buźki i osoby'],
        pt: ['smiles & pessoas'],
        ro: 'smiles & people',
        ru: ['эмоции и люди'],
        sv: ['leenden & människor'],
        th: ['รอยยิ้มและผู้คน'],
        tr: ['gülümsemeler & insanlar'],
        vi: ['nụ cười và mọi người'],
        zh: ['笑脸&人像'],
        zh_TW: ['笑臉&人像'],
      }
    },
    6878: (e) => {
      e.exports = {
        ar: ['رموز'],
        ca_ES: ['símbols'],
        cs: 'symbols',
        de: ['Symbole'],
        el: 'symbols',
        en: 'symbols',
        es: ['simbolos'],
        fa: 'symbols',
        fr: ['symboles'],
        he_IL: ['סימולים'],
        hu_HU: 'symbols',
        id_ID: ['simbol'],
        it: ['simboli'],
        ja: ['記号'],
        ko: ['심볼'],
        ms_MY: ['simbol-simbol'],
        nl_NL: 'symbols',
        pl: ['symbole'],
        pt: ['símbolos'],
        ro: 'symbols',
        ru: ['символы'],
        sv: ['symboler'],
        th: ['สัญญาลักษณ์'],
        tr: ['semboller'],
        vi: ['mã giao dịch'],
        zh: ['符号'],
        zh_TW: ['符號'],
      }
    },
    15426: (e) => {
      e.exports = {
        ar: ['مستخدَمٌ حديثاً'],
        ca_ES: ['usat recentment'],
        cs: 'recently used',
        de: ['Zuletzt genutzt'],
        el: 'recently used',
        en: 'recently used',
        es: ['usados con frecuencia'],
        fa: 'recently used',
        fr: ['récemment utilisé'],
        he_IL: ['נעשה בו שימוש לאחרונה'],
        hu_HU: 'recently used',
        id_ID: ['baru digunakan'],
        it: ['usato di recente'],
        ja: ['最近使用したもの'],
        ko: ['최근에 쓰임'],
        ms_MY: ['baru lepas digunakan'],
        nl_NL: 'recently used',
        pl: ['ostatnio używane'],
        pt: ['usados recentemente'],
        ro: 'recently used',
        ru: ['недавние'],
        sv: ['nyligen använd'],
        th: ['ที่เพิ่งใช้ล่าสุด'],
        tr: ['son zamanlarda kullanılanlar'],
        vi: ['Sử dụng gần đây'],
        zh: ['最近使用'],
        zh_TW: ['最近使用'],
      }
    },
    15395: (e) => {
      e.exports = {
        ar: ['السفر والأماكن'],
        ca_ES: ['viatges i llocs'],
        cs: 'travel & places',
        de: ['Reisen & Orte'],
        el: 'travel & places',
        en: 'travel & places',
        es: ['viajes y destinos'],
        fa: 'travel & places',
        fr: ['voyages & lieux'],
        he_IL: ['נסיעות ומקומות'],
        hu_HU: 'travel & places',
        id_ID: ['perjalanan & tempat'],
        it: ['viaggi e località'],
        ja: ['トラベル & 場所'],
        ko: ['트래블 & 플레이스'],
        ms_MY: ['melancong & tempat-tempat'],
        nl_NL: 'travel & places',
        pl: ['podróże i miejsca'],
        pt: ['viagens & lugares'],
        ro: 'travel & places',
        ru: ['путешествия'],
        sv: ['resor & platser'],
        th: ['การเดินทางและสถานที่'],
        tr: ['seyahat & yerler'],
        vi: ['du lịch & địa điểm'],
        zh: ['旅游&地点'],
        zh_TW: ['旅遊&地點'],
      }
    },
    72171: (e) => {
      e.exports = {
        ar: ['مركز'],
        ca_ES: ['Centre'],
        cs: 'Center',
        de: ['Zentrieren'],
        el: 'Center',
        en: 'Center',
        es: ['Centro'],
        fa: 'Center',
        fr: ['Centre'],
        he_IL: ['מרכז'],
        hu_HU: 'Center',
        id_ID: ['Tengah'],
        it: ['Centro'],
        ja: ['中央'],
        ko: ['센터'],
        ms_MY: ['Pusat'],
        nl_NL: 'Center',
        pl: ['Środek'],
        pt: ['Centro'],
        ro: 'Center',
        ru: ['По центру'],
        sv: ['Centrera'],
        th: ['ตรงกลาง'],
        tr: ['Orta'],
        vi: ['Trung tâm'],
        zh: ['中心'],
        zh_TW: ['中心'],
      }
    },
    74207: (e) => {
      e.exports = {
        ar: ['إعدادات الرسم البياني'],
        ca_ES: ['Configuració de gràfics'],
        cs: 'Chart settings',
        de: ['Chart Einstellungen'],
        el: 'Chart settings',
        en: 'Chart settings',
        es: ['Configuración del gráfico'],
        fa: 'Chart settings',
        fr: ['Paramètres du graphique'],
        he_IL: ['הגדרות גרף'],
        hu_HU: 'Chart settings',
        id_ID: ['Pengaturan chart'],
        it: ['Impostazioni grafico'],
        ja: ['チャート設定'],
        ko: ['차트 세팅'],
        ms_MY: ['Tetapan Carta'],
        nl_NL: 'Chart settings',
        pl: ['Ustawienia wykresu'],
        pt: ['Configurações do gráfico'],
        ro: 'Chart settings',
        ru: ['Настройки графика'],
        sv: ['Diagraminställningar'],
        th: ['การตั้งค่าชาร์ต'],
        tr: ['Grafik ayarları'],
        vi: ['Cài đặt biểu đồ'],
        zh: ['图表设置'],
        zh_TW: ['圖表設定'],
      }
    },
    73169: (e) => {
      e.exports = {
        ar: ['تطبيق الإعدادات الافتراضية'],
        ca_ES: ['Aplica configuracions per defecte'],
        cs: ['Apply Defaults'],
        de: ['Voreinstellungen anwenden'],
        el: ['Apply Defaults'],
        en: 'Apply defaults',
        es: ['Aplicar configuraciones por defecto'],
        fa: ['Apply Defaults'],
        fr: ['Appliquer les paramètres par défaut'],
        he_IL: ['החל ברירת מחדל'],
        hu_HU: ['Alapértelmezett Alkalmazása'],
        id_ID: ['Terapkan Pengaturan Awal'],
        it: ['Applica predefiniti'],
        ja: ['デフォルトを適用'],
        ko: ['기본설정'],
        ms_MY: ['Guna Pakai Lalai'],
        nl_NL: ['Apply Defaults'],
        pl: ['Zastosuj domyślne'],
        pt: ['Aplicar padrões'],
        ro: ['Apply Defaults'],
        ru: ['Применить по умолчанию'],
        sv: ['Tillämpa standardinställningarna'],
        th: ['ตั้งให้เป็นค่าเบื้องต้น'],
        tr: ['Varsayılanları uygula'],
        vi: ['Áp dụng Nhiều mặc định'],
        zh: ['应用默认'],
        zh_TW: ['套用預設值'],
      }
    },
    75819: (e) => {
      e.exports = {
        ar: ['تفعيل على الكل'],
        ca_ES: ['Aplica-ho a tot'],
        cs: 'Apply to all',
        de: ['Auf alle Anwenden'],
        el: 'Apply to all',
        en: 'Apply to all',
        es: ['Aplicar a todo'],
        fa: 'Apply to all',
        fr: ['Appliquer à tous'],
        he_IL: ['החל על הכל'],
        hu_HU: 'Apply to all',
        id_ID: ['Terapkan ke seluruh'],
        it: ['Applica su tutti'],
        ja: ['すべてに適用'],
        ko: ['모두 적용'],
        ms_MY: ['Tertakluk untuk semua'],
        nl_NL: 'Apply to all',
        pl: ['Zastosuj do wszystkich'],
        pt: ['Aplicar a todos'],
        ro: 'Apply to all',
        ru: ['Применить ко всем'],
        sv: ['Använd för alla'],
        th: ['ดำเนินการกับทั้งหมด'],
        tr: ['Hepsine uygula'],
        vi: ['Áp dụng cho tất cả'],
        zh: ['应用至全部'],
        zh_TW: ['全部套用'],
      }
    },
    91757: (e) => {
      e.exports = {
        ar: ['الأسفل'],
        ca_ES: ['Part inferior'],
        cs: 'Bottom',
        de: ['Unten'],
        el: 'Bottom',
        en: 'Bottom',
        es: ['Parte inferior'],
        fa: ['پایین'],
        fr: ['Bas'],
        he_IL: ['תחתית'],
        hu_HU: ['Alsó'],
        id_ID: ['Dasar'],
        it: ['Sotto'],
        ja: ['下'],
        ko: ['아래'],
        ms_MY: ['Bawah'],
        nl_NL: 'Bottom',
        pl: ['Dno'],
        pt: ['Em baixo'],
        ro: 'Bottom',
        ru: ['Снизу'],
        sv: ['Botten'],
        th: ['ข้างล่าง'],
        tr: ['Alt'],
        vi: ['Đáy'],
        zh: ['底部'],
        zh_TW: ['底部'],
      }
    },
    16079: (e) => {
      e.exports = {
        ar: ['متدرج'],
        ca_ES: 'Gradient',
        cs: 'Gradient',
        de: ['Farbverlauf'],
        el: 'Gradient',
        en: 'Gradient',
        es: ['Gradiente'],
        fa: 'Gradient',
        fr: ['Dégradé'],
        he_IL: ['משולב'],
        hu_HU: 'Gradient',
        id_ID: ['Gradien'],
        it: ['Gradiente'],
        ja: ['グラデーション'],
        ko: ['그래디언트'],
        ms_MY: ['Gradien'],
        nl_NL: 'Gradient',
        pl: 'Gradient',
        pt: ['Gradiente'],
        ro: 'Gradient',
        ru: ['Градиент'],
        sv: ['Lutning'],
        th: ['ไล่เฉดสี'],
        tr: ['Gradyan'],
        vi: 'Gradient',
        zh: ['渐变'],
        zh_TW: ['漸層'],
      }
    },
    40837: (e) => {
      e.exports = {
        ar: ['هل تريد حقًا حذف قالب الرسم البياني "{name}"؟'],
        ca_ES: ["De debò que voleu eliminar la plantilla de gràfic '{name}'?"],
        cs: "Do you really want to delete Chart Template '{name}' ?",
        de: ["Möchten Sie die Chart-Vorlage '{name}' wirklich löschen?"],
        el: "Do you really want to delete Chart Template '{name}' ?",
        en: "Do you really want to delete Chart Template '{name}' ?",
        es: [
          "¿Está seguro de que desea eliminar la plantilla de gráfico '{name}'?",
        ],
        fa: "Do you really want to delete Chart Template '{name}' ?",
        fr: ['Voulez-vous vraiment supprimer le modèle de graphique "{name}"?'],
        he_IL: ["האם אתה באמת רוצה למחוק את תבנית הגרף '{name}'?"],
        hu_HU: "Do you really want to delete Chart Template '{name}' ?",
        id_ID: [
          "Apakah anda benar-benar ingin menghapus Template Chart '{name}' ?",
        ],
        it: ["Si vuole davvero cancellare il modello del grafico '{name}'?"],
        ja: ["本当にチャートテンプレート '{name}' を削除しますか？"],
        ko: ["차트 템플릿 '{name}'를 정말 삭제하시겠습니까?"],
        ms_MY: [
          "Adakah anda benar-benar ingin memadamkan Templat Carta '{name}' ?",
        ],
        nl_NL: "Do you really want to delete Chart Template '{name}' ?",
        pl: ['Czy na pewno chcesz usunąć szablon wykresu „{name}”?'],
        pt: ["Você realmente quer apagar o Template '{name}' do Gráfico?"],
        ro: "Do you really want to delete Chart Template '{name}' ?",
        ru: ['Вы действительно хотите удалить шаблон графика "{name}"?'],
        sv: ['Vill du verkligen radera diagrammall "{name}"?'],
        th: ["คุณต้องการลบเทมเพลตแผนภูมิ '{name}' หรือไม่"],
        tr: ["'{name}' Grafik Taslağını gerçekten silmek istiyor musunuz?"],
        vi: ["Bạn có thực sự muốn xoá Mẫu Biểu đồ '{name}' không?"],
        zh: ["您真的要删除图表模板'{name}'吗？"],
        zh_TW: ["您真的要刪除圖表模板'{name}'嗎？"],
      }
    },
    42973: (e) => {
      e.exports = {
        ar: ['خط منقط'],
        ca_ES: ['Línia de punts'],
        cs: 'Dotted line',
        de: ['Gepunktete Linie'],
        el: 'Dotted line',
        en: 'Dotted line',
        es: ['Linea de puntos'],
        fa: 'Dotted line',
        fr: ['Ligne pointillée'],
        he_IL: ['קו מנוקד'],
        hu_HU: 'Dotted line',
        id_ID: ['Garis titik-titik'],
        it: ['Linea punteggiata'],
        ja: ['点線'],
        ko: ['도트 라인'],
        ms_MY: ['Garis Bertitik'],
        nl_NL: 'Dotted line',
        pl: ['Linia kropkowana'],
        pt: ['Linha Pontilhada'],
        ro: 'Dotted line',
        ru: ['Точечный пунктир'],
        sv: ['Prickad linje'],
        th: ['เส้นไข่ปลา'],
        tr: ['Noktalı Çizgi'],
        vi: ['Đường chấm chấm'],
        zh: ['点虚线'],
        zh_TW: ['點虛線'],
      }
    },
    59317: (e) => {
      e.exports = {
        ar: ['خط متقطع'],
        ca_ES: ['Línia discontínua'],
        cs: 'Dashed line',
        de: ['Gestrichelte Linie'],
        el: 'Dashed line',
        en: 'Dashed line',
        es: ['Linea discontinua'],
        fa: 'Dashed line',
        fr: ['Ligne traitillée'],
        he_IL: ['קו מקווקו'],
        hu_HU: 'Dashed line',
        id_ID: ['Garis putus-putus'],
        it: ['Linea tratteggiata'],
        ja: ['破線'],
        ko: ['대쉬 라인'],
        ms_MY: ['Garis Putus-Putus'],
        nl_NL: 'Dashed line',
        pl: ['Linia przerywana'],
        pt: ['Linha Tracejada'],
        ro: 'Dashed line',
        ru: ['Штриховой пунктир'],
        sv: ['Streckad linje'],
        th: ['เส้นประ'],
        tr: ['Kesik Çizgi'],
        vi: ['Đường Đứt nét'],
        zh: ['短虚线'],
        zh_TW: ['短虛線'],
      }
    },
    77405: (e) => {
      e.exports = {
        ar: ['أفقي'],
        ca_ES: ['Horitzontal'],
        cs: 'Horizontal',
        de: 'Horizontal',
        el: 'Horizontal',
        en: 'Horizontal',
        es: 'Horizontal',
        fa: 'Horizontal',
        fr: 'Horizontal',
        he_IL: ['אופקי'],
        hu_HU: 'Horizontal',
        id_ID: 'Horizontal',
        it: ['Orizzontale'],
        ja: ['水平'],
        ko: ['가로'],
        ms_MY: ['Melintang'],
        nl_NL: 'Horizontal',
        pl: ['Poziomo'],
        pt: 'Horizontal',
        ro: 'Horizontal',
        ru: ['Горизонтальная'],
        sv: ['Vågrät'],
        th: ['แนวนอน'],
        tr: ['Yatay'],
        vi: ['Ngang'],
        zh: ['横式'],
        zh_TW: ['橫式'],
      }
    },
    45044: (e) => {
      e.exports = {
        ar: 'Hidden',
        ca_ES: 'Hidden',
        cs: 'Hidden',
        de: ['Versteckt'],
        el: 'Hidden',
        en: 'Hidden',
        es: ['Oculto'],
        fa: 'Hidden',
        fr: ['Masqué'],
        he_IL: ['מוסתר'],
        hu_HU: 'Hidden',
        id_ID: ['Tersembunyi'],
        it: ['Nascondi'],
        ja: ['非表示に'],
        ko: ['숨겨진'],
        ms_MY: ['Tersembunyi'],
        nl_NL: 'Hidden',
        pl: ['Ukryty'],
        pt: ['Ocultados'],
        ro: 'Hidden',
        ru: ['Cкрыто'],
        sv: 'Hidden',
        th: 'Hidden',
        tr: ['Gizli'],
        vi: ['Bị ẩn'],
        zh: ['隐藏'],
        zh_TW: ['隱藏'],
      }
    },
    19286: (e) => {
      e.exports = {
        ar: ['يسار'],
        ca_ES: ['Esquerra'],
        cs: 'Left',
        de: ['Links'],
        el: 'Left',
        en: 'Left',
        es: ['Izquierda'],
        fa: 'Left',
        fr: ['Gauche'],
        he_IL: ['שמאל'],
        hu_HU: ['Bal'],
        id_ID: ['Kiri'],
        it: ['Sinistra'],
        ja: ['左'],
        ko: ['왼쪽'],
        ms_MY: ['Kiri'],
        nl_NL: 'Left',
        pl: ['Lewo'],
        pt: ['Esquerda'],
        ro: 'Left',
        ru: ['Слева'],
        sv: ['Vänster'],
        th: ['ซ้าย'],
        tr: ['Sol'],
        vi: ['Bên trái'],
        zh: ['左'],
        zh_TW: ['左'],
      }
    },
    76476: (e) => {
      e.exports = {
        ar: ['وسط'],
        ca_ES: ['Al mig'],
        cs: 'Middle',
        de: ['Mitte'],
        el: 'Middle',
        en: 'Middle',
        es: ['En el medio'],
        fa: 'Middle',
        fr: ['Milieu'],
        he_IL: ['אמצע'],
        hu_HU: 'Middle',
        id_ID: ['Tengah'],
        it: ['Medio'],
        ja: ['中央'],
        ko: ['미들'],
        ms_MY: ['Tengah'],
        nl_NL: 'Middle',
        pl: ['Środek'],
        pt: ['No meio'],
        ro: 'Middle',
        ru: ['По центру'],
        sv: ['Mitten'],
        th: ['ตรงกลาง'],
        tr: ['Orta'],
        vi: ['Giữa'],
        zh: ['中间'],
        zh_TW: ['中間'],
      }
    },
    55362: (e) => {
      e.exports = {
        ar: ['عادي'],
        ca_ES: 'Normal',
        cs: ['Běžné'],
        de: 'Normal',
        el: 'Normal',
        en: 'Normal',
        es: 'Normal',
        fa: ['خط'],
        fr: 'Normal',
        he_IL: ['רגיל'],
        hu_HU: ['Normális'],
        id_ID: 'Normal',
        it: ['Normale'],
        ja: ['普通'],
        ko: ['정상'],
        ms_MY: ['Biasa'],
        nl_NL: ['Normaal'],
        pl: ['Normalny'],
        pt: 'Normal',
        ro: 'Normal',
        ru: ['Обычный'],
        sv: 'Normal',
        th: ['ปกติ'],
        tr: 'Normal',
        vi: ['Bình thường'],
        zh: ['普通'],
        zh_TW: ['正常'],
      }
    },
    35637: (e) => {
      e.exports = {
        ar: ['ثابت'],
        ca_ES: ['Sòlid'],
        cs: 'Solid',
        de: ['Einfarbig'],
        el: 'Solid',
        en: 'Solid',
        es: ['Sólido'],
        fa: 'Solid',
        fr: ['Uni'],
        he_IL: ['סולידי'],
        hu_HU: 'Solid',
        id_ID: 'Solid',
        it: ['Tinta unita'],
        ja: ['ソリッド'],
        ko: ['솔리드'],
        ms_MY: ['Padu'],
        nl_NL: 'Solid',
        pl: ['Jednolite'],
        pt: ['Sólido'],
        ro: 'Solid',
        ru: ['Сплошной'],
        sv: 'Solid',
        th: ['สีเดียว'],
        tr: ['Katı'],
        vi: 'Solid',
        zh: 'Solid',
        zh_TW: 'Solid',
      }
    },
    21141: (e) => {
      e.exports = {
        ar: ['يمين'],
        ca_ES: ['Dreta'],
        cs: 'Right',
        de: ['Rechts'],
        el: 'Right',
        en: 'Right',
        es: ['Derecha'],
        fa: 'Right',
        fr: ['Droite'],
        he_IL: ['ימין'],
        hu_HU: ['Jobb'],
        id_ID: ['Kanan'],
        it: ['Destra'],
        ja: ['右'],
        ko: ['오른쪽'],
        ms_MY: ['Kanan'],
        nl_NL: 'Right',
        pl: ['Prawy'],
        pt: ['Direita'],
        ro: 'Right',
        ru: ['Справа'],
        sv: ['Höger'],
        th: ['ขวา'],
        tr: ['Sağ'],
        vi: ['Phải'],
        zh: ['右'],
        zh_TW: ['右'],
      }
    },
    65994: (e) => {
      e.exports = {
        ar: ['الأعلى'],
        ca_ES: ['Part superior'],
        cs: 'Top',
        de: ['Oben'],
        el: 'Top',
        en: 'Top',
        es: ['Parte superior'],
        fa: 'Top',
        fr: ['Haut'],
        he_IL: ['עליון'],
        hu_HU: ['Felső'],
        id_ID: ['Teratas'],
        it: ['Sopra'],
        ja: ['上'],
        ko: ['탑'],
        ms_MY: ['Atas'],
        nl_NL: 'Top',
        pl: ['Szczyt'],
        pt: ['Em cima'],
        ro: 'Top',
        ru: ['Сверху'],
        sv: ['Topp'],
        th: ['บน'],
        tr: ['Üst'],
        vi: ['Trên đầu'],
        zh: ['顶部'],
        zh_TW: ['頂部'],
      }
    },
    92960: (e) => {
      e.exports = {
        ar: ['محاذاة النص'],
        ca_ES: ['Alineació del text'],
        cs: 'Text alignment',
        de: ['Textausrichtung'],
        el: 'Text alignment',
        en: 'Text alignment',
        es: ['Alineación del texto'],
        fa: 'Text alignment',
        fr: ['Alignement du texte'],
        he_IL: ['יישור טקסט'],
        hu_HU: 'Text alignment',
        id_ID: ['Perataan teks'],
        it: ['Allineamento testo'],
        ja: ['テキストの配置'],
        ko: ['텍스트 얼라인'],
        ms_MY: ['jajaran teks'],
        nl_NL: 'Text alignment',
        pl: ['Wyrównanie tekstu'],
        pt: ['Alinhamento do texto'],
        ro: 'Text alignment',
        ru: ['Выравнивание текста'],
        sv: ['Textjustering'],
        th: ['การจัดตำแหน่งตัวอักษร'],
        tr: ['Metin hizalama'],
        vi: ['Căn chỉnh chữ'],
        zh: ['文字对齐'],
        zh_TW: ['文字對齊'],
      }
    },
    90581: (e) => {
      e.exports = {
        ar: ['اتجاه النص'],
        ca_ES: ['Orientació del text'],
        cs: 'Text orientation',
        de: ['Text Ausrichtung'],
        el: 'Text orientation',
        en: 'Text orientation',
        es: ['Orientación del texto'],
        fa: 'Text orientation',
        fr: ['Orientation du texte'],
        he_IL: ['כיוון טקסט'],
        hu_HU: 'Text orientation',
        id_ID: ['Orientasi teks'],
        it: ['Orientamento testo'],
        ja: ['テキストの向き'],
        ko: ['텍스트 방향'],
        ms_MY: ['Orientasi teks'],
        nl_NL: 'Text orientation',
        pl: ['Kierunek tekstu'],
        pt: ['Orientação do Texto'],
        ro: 'Text orientation',
        ru: ['Ориентация текста'],
        sv: ['Textriktning'],
        th: ['การเรียงตัวของตัวอักษร'],
        tr: ['Metin yönü'],
        vi: ['Chiều của chữ'],
        zh: ['文字方向'],
        zh_TW: ['文字方向'],
      }
    },
    78019: (e) => {
      e.exports = {
        ar: [
          'استخدم علامات رياضية خاصة لتحل محل الرسومات المحددة: + ، - ، / ، * للسعر و + ، - لفهرس العمود.',
        ],
        ca_ES: [
          "Feu servir signes matemàtics especials per desplaçar els dibuixos seleccionats: +,-,/,* per al preu i +,- per a l'índex de barres.",
        ],
        cs: 'Use special math signs to displace selected drawings: +,-,/,* for price and +,- for bar index.',
        de: [
          'Verwenden Sie spezielle mathematische Zeichen, um ausgewählte Zeichnungen zu verschieben: +,-,/,* für Preis- und +,- für Balken-Index.',
        ],
        el: 'Use special math signs to displace selected drawings: +,-,/,* for price and +,- for bar index.',
        en: 'Use special math signs to displace selected drawings: +,-,/,* for price and +,- for bar index.',
        es: [
          'Utilice signos matemáticos especiales para desplazar los dibujos seleccionados: +,-,/,* para el precio y +,- para el índice de barras.',
        ],
        fa: 'Use special math signs to displace selected drawings: +,-,/,* for price and +,- for bar index.',
        fr: [
          "Utilisez des signes mathématiques spéciaux pour déplacer les dessins sélectionnés : +,-,/,* pour le prix et +,- pour l'index des barres.",
        ],
        he_IL: [
          'השתמש בסימנים מתמטיים מיוחדים כדי להחליף שרטוטים נבחרים: +,-,/,* עבור המחיר ו-+,- עבור בר אינדקס.',
        ],
        hu_HU:
          'Use special math signs to displace selected drawings: +,-,/,* for price and +,- for bar index.',
        id_ID: [
          'Gunakan tanda matematika khusus untuk memindahkan gambar yang dipilih: +,-,/,* untuk harga dan +,- untuk indeks bar.',
        ],
        it: [
          "Per spostare i disegni selezionati, potete utilizzare i segni matematici speciali: +,-,/,* per il prezzo e +,- per l'indice delle barre.",
        ],
        ja: [
          '選択中の描画をまとめて移動するには演算子を使用します。価格に対しては+ , - , / , *、バーインデックスに対しては+ ,- を使用します。',
        ],
        ko: [
          '선택한 드로윙을 대체하려면 특수 연산 부호를 사용합니다. 가격에는 +,-,/,*, 막대 인덱스는 +,-입니다.',
        ],
        ms_MY: [
          'Gunakan simbol matematik istimewa untuk menganjakkan lukisan-lukisan terpilih:  +,-,/,* untuk harga dan +,- untuk indeks bar.',
        ],
        nl_NL:
          'Use special math signs to displace selected drawings: +,-,/,* for price and +,- for bar index.',
        pl: [
          'Użyj specjalnych znaków matematycznych, aby zastąpić wybrane rysunki: +,-,/,* dla ceny i +,- dla indeksu słupka.',
        ],
        pt: [
          'Usar símbolos matemáticos especiais para deslocar os desenhos selecionados: +,-,/,* para preço e +,- para o índice de barras.',
        ],
        ro: 'Use special math signs to displace selected drawings: +,-,/,* for price and +,- for bar index.',
        ru: [
          'Используйте специальные символы, чтобы перемещать выбранные объекты рисования: +, -, /, * для цены и +, - для индекса бара.',
        ],
        sv: [
          'Använd särskilda matematiska tecken för att förflytta valda ritningar: +,-,/,* för pris och +,- för stapelindex.',
        ],
        th: [
          'ใช้เครื่องหมายทางคณิตศาสตร์พิเศษเพื่อแทนที่ภาพวาดที่เลือก: +,-,/,* สำหรับราคา และ +,- สำหรับดัชนีแท่ง',
        ],
        tr: [
          'Özel matematik işaretleri ile seçili çizimleri oynatın. +,-,/,* ile fiyatı ve +,- ile çubuk endeksi oynar.',
        ],
        vi: [
          'Sử dụng các dấu hiệu toán học đặc biệt để thay thế các bản vẽ đã chọn: +, -, /, * cho giá và +, - cho chỉ số thanh.',
        ],
        zh: [
          '使用特殊的数学符号替换选定的图形：+,-,/,* 表示价格，+,- 表示K线指数。',
        ],
        zh_TW: [
          '使用特殊的數學符號替換選定的圖形：+,-,/,* 表示價格，+,- 表示K線指數。',
        ],
      }
    },
    44085: (e) => {
      e.exports = {
        ar: ['عمودي'],
        ca_ES: 'Vertical',
        cs: 'Vertical',
        de: ['Vertikal'],
        el: 'Vertical',
        en: 'Vertical',
        es: 'Vertical',
        fa: 'Vertical',
        fr: 'Vertical',
        he_IL: ['אנכי'],
        hu_HU: 'Vertical',
        id_ID: 'Vertical',
        it: ['Verticale'],
        ja: ['垂直'],
        ko: ['세로'],
        ms_MY: ['Menegak'],
        nl_NL: 'Vertical',
        pl: ['Pionowo'],
        pt: 'Vertical',
        ro: 'Vertical',
        ru: ['Вертикальная'],
        sv: ['Lodrät'],
        th: ['แนวตั้ง'],
        tr: ['Dikey'],
        vi: ['Dọc'],
        zh: ['竖式'],
        zh_TW: ['直式'],
      }
    },
    76080: (e) => {
      e.exports = {
        ar: ['على سبيل المثال +1'],
        ca_ES: ['p. ex., +1'],
        cs: 'e.g. +1',
        de: ['z.B. +1'],
        el: 'e.g. +1',
        en: 'e.g. +1',
        es: ['p. ej., +1'],
        fa: 'e.g. +1',
        fr: ['p. ex. +1'],
        he_IL: ['לְמָשָׁל /+1'],
        hu_HU: 'e.g. +1',
        id_ID: ['misalnya +1'],
        it: ['es. +1'],
        ja: ['例. +1'],
        ko: 'e.g. +1',
        ms_MY: ['cth. +1'],
        nl_NL: 'e.g. +1',
        pl: ['np. +1'],
        pt: ['ex.: +1'],
        ro: 'e.g. +1',
        ru: ['н-р, +1'],
        sv: ['t. ex. +1'],
        th: ['เช่น. +1'],
        tr: ['örn. +1'],
        vi: 'e.g. +1',
        zh: ['例如 +1'],
        zh_TW: ['例如+1'],
      }
    },
    95166: (e) => {
      e.exports = {
        ar: ['/2'],
        ca_ES: ['p. ex., /2'],
        cs: 'e.g. /2',
        de: ['z.B. /2'],
        el: 'e.g. /2',
        en: 'e.g. /2',
        es: ['p. ej., /2'],
        fa: 'e.g. /2',
        fr: ['p. ex. /2'],
        he_IL: ['לְמָשָׁל /2'],
        hu_HU: 'e.g. /2',
        id_ID: ['misalnya /2'],
        it: ['es. /2'],
        ja: ['例. /2'],
        ko: 'e.g. /2',
        ms_MY: ['cth. /2'],
        nl_NL: 'e.g. /2',
        pl: ['np. /2'],
        pt: ['ex.: /2'],
        ro: 'e.g. /2',
        ru: ['н-р, /2'],
        sv: ['t. ex. /2'],
        th: ['ยกตัวอย่าง/2'],
        tr: ['örn. /2'],
        vi: 'e.g. /2',
        zh: ['例如 /2'],
        zh_TW: ['例如 /2'],
      }
    },
  },
])
