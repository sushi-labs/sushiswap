;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5093],
  {
    625650: (e) => {
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
    645300: (e) => {
      e.exports = {}
    },
    234404: (e, t, i) => {
      i.d(t, { Loader: () => n })
      var s = i(50959),
        l = i(497754),
        o = i(625650),
        a = i.n(o)
      function n(e) {
        const {
            className: t,
            size: i = 'medium',
            staticPosition: o,
            color: n = 'black',
          } = e,
          r = l(a().item, a()[n], a()[i])
        return s.createElement(
          'span',
          { className: l(a().loader, o && a().static, t) },
          s.createElement('span', { className: r }),
          s.createElement('span', { className: r }),
          s.createElement('span', { className: r }),
        )
      }
    },
    958057: (e, t, i) => {
      i.d(t, {
        batsToRealtimeCrucialHtml: () => C,
        batsToRealtimeHtml1: () => w,
        batsToRealtimeHtml2WithExchange: () => y,
        batsToRealtimeHtml2WithoutExchange: () => S,
        delayHtml: () => u,
        delayNoRealtimeHtml: () => _,
        delayToRealtimeHtml: () => c,
        delayTooltip: () => o,
        delayWithoutMarketAgreement: () => b,
        eodHtml: () => p,
        eodTooltip: () => a,
        exchangeByOriginalExchangeTooltip: () => d,
        notAccurate1PerSecondTooltip: () => n,
        notAccurateCboeTooltip: () => r,
        tFEXorMOEXorLSEorChixauHtml: () => h,
        tickByTickHtml1: () => g,
        tickByTickHtml1FullInfo: () => m,
        tickByTickHtml2: () => v,
      })
      var s = i(609838),
        l = i(311757)
      const o = s.t(null, void 0, i(257310)),
        a = s.t(null, void 0, i(659315)),
        n = s.t(null, void 0, i(215815)),
        r = s.t(null, void 0, i(345e3)),
        d = s.t(null, void 0, i(107435)),
        u =
          (s.t(null, void 0, i(624680)),
          s.t(null, void 0, i(999214)),
          s.t(null, void 0, i(6044)),
          s.t(null, void 0, i(831461)),
          s.t(null, void 0, i(332960)),
          s.t(null, void 0, i(152449)),
          (0, l.htmlEscape)(s.t(null, void 0, i(538611)))),
        h = (0, l.htmlEscape)(s.t(null, void 0, i(301084))),
        c = (0, l.htmlEscape)(s.t(null, void 0, i(652984))),
        _ = (0, l.htmlEscape)(s.t(null, void 0, i(689022))),
        p = (0, l.htmlEscape)(s.t(null, void 0, i(52916))),
        m = (0, l.htmlEscape)(s.t(null, void 0, i(449321))),
        g = (0, l.htmlEscape)(s.t(null, void 0, i(425978))),
        v = (0, l.htmlEscape)(s.t(null, void 0, i(28412))),
        b = (0, l.htmlEscape)(s.t(null, void 0, i(791459))),
        w = s.t(null, void 0, i(806667)),
        S =
          (s.t(
            null,
            {
              context:
                'Part of: "Real-time data for {symbolName} is provided by {exchange} exchange."',
            },
            i(712978),
          ),
          s.t(
            null,
            {
              context:
                'Part of: "Real-time data for {symbolName} is provided by {exchange} exchange."',
            },
            i(864565),
          ),
          s.t(null, void 0, i(102310))),
        y = s.t(null, void 0, i(729512)),
        C = s.t(null, void 0, i(886753))
      s.t(null, void 0, i(353205)), s.t(null, void 0, i(115993))
    },
    190787: (e, t, i) => {
      function s(e, t) {
        null === e.firstChild
          ? (e.textContent = t)
          : (e.firstChild.nodeValue = t)
      }
      i.d(t, { updateTextNode: () => s })
    },
    626800: (e, t, i) => {
      i.d(t, { safeShortName: () => l })
      var s = i(949345)
      function l(e) {
        try {
          return (0, s.shortName)(e)
        } catch (t) {
          return e
        }
      }
    },
    118737: (e, t, i) => {
      i.d(t, {
        removeUsdFromCryptoPairLogos: () => a,
        resolveLogoUrls: () => o,
      })
      var s = i(868333)
      const l = (0, s.getLogoUrlResolver)()
      function o(e, t = s.LogoSize.Medium) {
        const i = e.logoid,
          o = e['base-currency-logoid'],
          a = e['currency-logoid'],
          n = i && l.getSymbolLogoUrl(i, t)
        if (n) return [n]
        const r = o && l.getSymbolLogoUrl(o, t),
          d = a && l.getSymbolLogoUrl(a, t)
        return r && d ? [r, d] : r ? [r] : d ? [d] : []
      }
      function a(e) {
        return 2 !== e.length
          ? e
          : ((e) => e.some((e) => n(e)))(e) &&
              !((e) => e.some((e) => e.includes('country') && !n(e)))(e)
            ? e.filter((e) => !n(e))
            : e
      }
      function n(e) {
        return !1
      }
    },
    41192: (e, t, i) => {
      i.d(t, { getBlockStyleClasses: () => l, getLogoStyleClasses: () => o })
      var s = i(497754)
      function l(e, t) {
        return s('tv-circle-logo-pair', `tv-circle-logo-pair--${e}`, t)
      }
      function o(e, t) {
        return s(
          'tv-circle-logo-pair__logo',
          `tv-circle-logo-pair__logo--${e}`,
          !t && 'tv-circle-logo-pair__logo-empty',
        )
      }
    },
    636080: (e, t, i) => {
      i.d(t, { CircleLogo: () => a, hiddenCircleLogoClass: () => o })
      var s = i(50959),
        l = i(439067)
      i(645300)
      const o = 'tv-circle-logo--visually-hidden'
      function a(e) {
        var t, i
        const o = (0, l.getStyleClasses)(e.size, e.className),
          a =
            null !== (i = null !== (t = e.alt) && void 0 !== t ? t : e.title) &&
            void 0 !== i
              ? i
              : ''
        return (0, l.isCircleLogoWithUrlProps)(e)
          ? s.createElement('img', {
              className: o,
              crossOrigin: '',
              src: e.logoUrl,
              alt: a,
              title: e.title,
              loading: e.loading,
              'aria-label': e['aria-label'],
              'aria-hidden': e['aria-hidden'],
            })
          : s.createElement(
              'span',
              {
                className: o,
                title: e.title,
                'aria-label': e['aria-label'],
                'aria-hidden': e['aria-hidden'],
              },
              e.placeholderLetter,
            )
      }
    },
    439067: (e, t, i) => {
      i.d(t, { getStyleClasses: () => l, isCircleLogoWithUrlProps: () => o })
      var s = i(497754)
      function l(e, t) {
        return s('tv-circle-logo', `tv-circle-logo--${e}`, t)
      }
      function o(e) {
        return 'logoUrl' in e && void 0 !== e.logoUrl && 0 !== e.logoUrl.length
      }
    },
    265742: (e, t, i) => {
      var s = i(500962)
      ;(t.createRoot = s.createRoot), s.hydrateRoot
    },
    323709: (e) => {
      e.exports = {}
    },
    377539: (e) => {
      e.exports = {
        marginlegendhoriz: '4px',
        legend: 'legend-l31H9iuA',
        item: 'item-l31H9iuA',
        withAction: 'withAction-l31H9iuA',
        selected: 'selected-l31H9iuA',
        last: 'last-l31H9iuA',
        text: 'text-l31H9iuA',
        noWrapWrapper: 'noWrapWrapper-l31H9iuA',
        noWrap: 'noWrap-l31H9iuA',
        series: 'series-l31H9iuA',
        valuesAdditionalWrapper: 'valuesAdditionalWrapper-l31H9iuA',
        valueItem: 'valueItem-l31H9iuA',
        valueTitle: 'valueTitle-l31H9iuA',
        valueValue: 'valueValue-l31H9iuA',
        hideUniportantValueItems: 'hideUniportantValueItems-l31H9iuA',
        unimportant: 'unimportant-l31H9iuA',
        valuesWrapper: 'valuesWrapper-l31H9iuA',
        wrappable: 'wrappable-l31H9iuA',
        directionColumn: 'directionColumn-l31H9iuA',
        titlesWrapper: 'titlesWrapper-l31H9iuA',
        button: 'button-l31H9iuA',
        statusesWrapper: 'statusesWrapper-l31H9iuA',
        logoWrapper: 'logoWrapper-l31H9iuA',
        buttonsWrapper: 'buttonsWrapper-l31H9iuA',
        buttons: 'buttons-l31H9iuA',
        statusesWrapper__statuses: 'statusesWrapper__statuses-l31H9iuA',
        pairContainer: 'pairContainer-l31H9iuA',
        logo: 'logo-l31H9iuA',
        hidden: 'hidden-l31H9iuA',
        noActions: 'noActions-l31H9iuA',
        titleWrapper: 'titleWrapper-l31H9iuA',
        title: 'title-l31H9iuA',
        intervalTitle: 'intervalTitle-l31H9iuA',
        withDot: 'withDot-l31H9iuA',
        disabled: 'disabled-l31H9iuA',
        disabledOnInterval: 'disabledOnInterval-l31H9iuA',
        withCustomTextColor: 'withCustomTextColor-l31H9iuA',
        study: 'study-l31H9iuA',
        mainTitle: 'mainTitle-l31H9iuA',
        descTitle: 'descTitle-l31H9iuA',
        hideValues: 'hideValues-l31H9iuA',
        has5Buttons: 'has5Buttons-l31H9iuA',
        stayInHoveredMode: 'stayInHoveredMode-l31H9iuA',
        withTail: 'withTail-l31H9iuA',
        loader: 'loader-l31H9iuA',
        providerTitle: 'providerTitle-l31H9iuA',
        exchangeTitle: 'exchangeTitle-l31H9iuA',
        styleTitle: 'styleTitle-l31H9iuA',
        priceSourceTitle: 'priceSourceTitle-l31H9iuA',
        minHideIntervalTitle: 'minHideIntervalTitle-l31H9iuA',
        microHideIntervalTitle: 'microHideIntervalTitle-l31H9iuA',
        hideExchangeProviderTitles: 'hideExchangeProviderTitles-l31H9iuA',
        flagged: 'flagged-l31H9iuA',
        medium: 'medium-l31H9iuA',
        minimized: 'minimized-l31H9iuA',
        micro: 'micro-l31H9iuA',
        linked: 'linked-l31H9iuA',
        onlyOneButtonCanBeStick: 'onlyOneButtonCanBeStick-l31H9iuA',
        touchMode: 'touchMode-l31H9iuA',
        buttonIcon: 'buttonIcon-l31H9iuA',
        flag: 'flag-l31H9iuA',
        invisibleHover: 'invisibleHover-l31H9iuA',
        eye: 'eye-l31H9iuA',
        eyeLoading: 'eyeLoading-l31H9iuA',
        'eye-animation': 'eye-animation-l31H9iuA',
        linking: 'linking-l31H9iuA',
        intervalEye: 'intervalEye-l31H9iuA',
        markerContainer: 'markerContainer-l31H9iuA',
        flagWrapper: 'flagWrapper-l31H9iuA',
        sourcesWrapper: 'sourcesWrapper-l31H9iuA',
        legendMainSourceWrapper: 'legendMainSourceWrapper-l31H9iuA',
        sources: 'sources-l31H9iuA',
        toggler: 'toggler-l31H9iuA pane-button-e6PF69Df',
        onlyOneSourceShown: 'onlyOneSourceShown-l31H9iuA',
        counter: 'counter-l31H9iuA',
        iconArrow: 'iconArrow-l31H9iuA',
        objectTree: 'objectTree-l31H9iuA',
        closed: 'closed-l31H9iuA',
        objectsTreeCanBeShown: 'objectsTreeCanBeShown-l31H9iuA',
      }
    },
    694815: (e) => {
      e.exports = {
        'css-value-pane-controls-padding-left': '1px',
        'css-value-pane-controls-padding-right': '4px',
        css_value_pane_controls_margin_top: '4',
        css_value_pane_controls_button_size: '22',
        css_value_pane_controls_button_touch_size: '22',
        paneControls: 'paneControls-JQv8nO8e',
        hidden: 'hidden-JQv8nO8e',
        forceHidden: 'forceHidden-JQv8nO8e',
        button: 'button-JQv8nO8e pane-button-e6PF69Df',
        buttonIcon: 'buttonIcon-JQv8nO8e',
        minimize: 'minimize-JQv8nO8e',
        restore: 'restore-JQv8nO8e',
        newButton: 'newButton-JQv8nO8e',
        touchMode: 'touchMode-JQv8nO8e',
        maximize: 'maximize-JQv8nO8e',
        collapse: 'collapse-JQv8nO8e',
        'maximize-animation-up-bracket':
          'maximize-animation-up-bracket-JQv8nO8e',
        'maximize-animation-down-bracket':
          'maximize-animation-down-bracket-JQv8nO8e',
        'minimize-animation-up-bracket':
          'minimize-animation-up-bracket-JQv8nO8e',
        'minimize-animation-down-bracket':
          'minimize-animation-down-bracket-JQv8nO8e',
        up: 'up-JQv8nO8e',
        'up-animation': 'up-animation-JQv8nO8e',
        down: 'down-JQv8nO8e',
        'down-animation': 'down-animation-JQv8nO8e',
        buttonsWrapper: 'buttonsWrapper-JQv8nO8e',
      }
    },
    707488: (e) => {
      e.exports = {
        blockHidden: 'blockHidden-e6PF69Df',
        'pane-button': 'pane-button-e6PF69Df',
      }
    },
    364123: (e) => {
      e.exports = {
        'css-value-small-size': '18px',
        'css-value-medium-size': '22px',
        'css-value-large-size': '28px',
        'css-value-border-radius-small-size': '9px',
        'css-value-border-radius-medium-size': '11px',
        'css-value-border-radius-large-size': '8px',
        statuses: 'statuses-Lgtz1OtS',
        statusItem: 'statusItem-Lgtz1OtS',
        statuses_hidden: 'statuses_hidden-Lgtz1OtS',
        small: 'small-Lgtz1OtS',
        medium: 'medium-Lgtz1OtS',
        large: 'large-Lgtz1OtS',
        blinking: 'blinking-Lgtz1OtS',
        'blinking-animation': 'blinking-animation-Lgtz1OtS',
        marketStatusOpen: 'marketStatusOpen-Lgtz1OtS',
        marketStatusClose: 'marketStatusClose-Lgtz1OtS',
        marketStatusPre: 'marketStatusPre-Lgtz1OtS',
        marketStatusPost: 'marketStatusPost-Lgtz1OtS',
        marketStatusHoliday: 'marketStatusHoliday-Lgtz1OtS',
        marketStatusExpired: 'marketStatusExpired-Lgtz1OtS',
        marketStatusCustom: 'marketStatusCustom-Lgtz1OtS',
        invalidSymbol: 'invalidSymbol-Lgtz1OtS',
        replayModeAutoPlay: 'replayModeAutoPlay-Lgtz1OtS',
        replayModePause: 'replayModePause-Lgtz1OtS',
        replayModePointSelect: 'replayModePointSelect-Lgtz1OtS',
        'blinking-animation-custom': 'blinking-animation-custom-Lgtz1OtS',
        notAccurate: 'notAccurate-Lgtz1OtS',
        delay: 'delay-Lgtz1OtS',
        eod: 'eod-Lgtz1OtS',
        dataProblemHigh: 'dataProblemHigh-Lgtz1OtS',
        dataProblemLow: 'dataProblemLow-Lgtz1OtS',
      }
    },
    803609: (e, t, i) => {
      i.r(t), i.d(t, { ControlBarNavigation: () => Z })
      var s = i(650151),
        l = i(609838),
        o = i(972535),
        a = i(156963),
        n = i(493898),
        r = i(710263),
        d = i(98454),
        u = i(725784),
        h = i(601227),
        c = i(180185),
        _ = (i(32133), i(958198)),
        p = i(23317),
        m = i(689612),
        g = i(577576),
        v = i(593724),
        b = i(691986),
        w = i(776996),
        S = i(678529),
        y = i(50119),
        C = i(362884),
        M = i(250662),
        f = i(542205)
      i(323709)
      const V = (0, c.humanReadableModifiers)(c.Modifiers.Alt, !1),
        E = (0, c.humanReadableModifiers)(c.Modifiers.Shift, !1),
        L = (0, c.humanReadableModifiers)(c.Modifiers.Mod, !1),
        W = (0, u.hotKeySerialize)({ keys: [V, 'R'], text: '{0} + {1}' }),
        T = (0, u.hotKeySerialize)({
          keys: [V, 'Click', V, 'Enter'],
          text: '{0} + {1}, {2} + {3}',
        }),
        k = (0, u.hotKeySerialize)({ keys: [y], text: '{0}' }),
        x = (0, u.hotKeySerialize)({ keys: [C], text: '{0}' }),
        A = (0, u.hotKeySerialize)({ keys: [L, M], text: '{0} + {1}' }),
        H = (0, u.hotKeySerialize)({ keys: [L, f], text: '{0} + {1}' }),
        B = (0, u.hotKeySerialize)({
          keys: [V, E, C],
          text: '{0} + {1} + {2}',
        }),
        P = l.t(null, void 0, i(247602)),
        D = l.t(null, void 0, i(461311)),
        I = l.t(null, void 0, i(256470)),
        z = l.t(null, void 0, i(48293)),
        N = l.t(null, void 0, i(540653)),
        O = l.t(null, void 0, i(135809)),
        R = l.t(null, void 0, i(834301)),
        F = l.t(null, void 0, i(426721)),
        G = `<div class="control-bar-wrapper">\n\t<div class="control-bar control-bar--hidden">\n\t\t<div class="control-bar__group js-btn-group js-btn-group-zoom">\n\t\t\t<div class="control-bar__btn control-bar__btn--zoom-out apply-common-tooltip" title="${P}" data-tooltip-hotkey="${H}">\n\t\t\t\t${p}\n\t\t\t</div>\n\t\t\t<div class="control-bar__btn control-bar__btn--zoom-in apply-common-tooltip" title="${D}" data-tooltip-hotkey="${A}">\n\t\t\t\t${g}\n\t\t\t</div>\n\t\t</div>\n\t\t<div class="control-bar__group js-btn-group js-btn-group-maximize">\n\t\t\t<div class="control-bar__btn control-bar__btn--maximize apply-common-tooltip" title="${I}" data-tooltip-hotkey="${T}">\n\t\t\t\t${b}\n\t\t\t</div>\n\t\t\t<div class="control-bar__btn control-bar__btn--minimize js-hidden apply-common-tooltip" title="${z}" data-tooltip-hotkey="${T}">\n\t\t\t\t${w}\n\t\t\t</div>\n\t\t</div>\n\t\t<div class="control-bar__group js-btn-group js-btn-group-scroll">\n\t\t\t<div class="control-bar__btn control-bar__btn--move-left apply-common-tooltip" title="${N}" data-tooltip-hotkey="${k}">\n\t\t\t\t${m}\n\t\t\t</div>\n\t\t\t<div class="control-bar__btn control-bar__btn--move-right apply-common-tooltip" title="${O}" data-tooltip-hotkey="${x}">\n\t\t\t\t${m}\n\t\t\t</div>\n\t\t</div>\n\t\t<div class="control-bar__group js-btn-group js-btn-group-reset-scale">\n\t\t\t<div class="control-bar__btn control-bar__btn--turn-button control-bar__btn--btn-hidden apply-common-tooltip js-btn-reset" title="${R}" data-tooltip-hotkey="${W}">\n\t\t\t\t${v}\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>`,
        U = `<div class="control-bar-wrapper control-bar-wrapper--back-present">\n\t<div class="control-bar control-bar__btn control-bar__btn--btn-hidden apply-common-tooltip" title="${F}" data-tooltip-hotkey="${B}">\n\t\t${S}\n\t</div>\n</div>`,
        j = h.CheckMobile.any(),
        $ = 'control-bar__btn--btn-hidden',
        X = {
          zoomInOut: !0,
          maximize: !0,
          scrollLeftRight: !0,
          resetScale: !0,
          goToRealtime: !0,
        }
      class Z {
        constructor(e, t, i) {
          ;(this._widget = (0, s.ensureNotNull)(
            (0, d.parseHtml)(G).querySelector('.control-bar-wrapper'),
          )),
            (this._controlBar = (0, s.ensureNotNull)(
              this._widget.querySelector('.control-bar'),
            )),
            (this._back = (0, s.ensureNotNull)(
              (0, d.parseHtml)(U).querySelector('.control-bar-wrapper'),
            )),
            (this._btnGroups = Array.from(
              this._controlBar.querySelectorAll('.js-btn-group'),
            )),
            (this._targetPaneWidget = null),
            (this._backButtonVisible = !1),
            (this._boundMouseHandler = null),
            (this._chartModel = null),
            (this._checkIntervalId = 0),
            (this._controlBarVisible = !1),
            (this._priceAxisChanged = null),
            (this._resetScalesAvailable = null),
            (this._priceAxisName = 'right'),
            (this._rafId = 0),
            (this._visibilityTypeProperty = null),
            (this._boundUpdateMaximizeButtonsVisibility =
              this._updateMaximizeButtonsVisibility.bind(this)),
            (this._boundToggleFullscreenButtons =
              this._toggleFullscreenButtons.bind(this)),
            (this._paneWidth = 0),
            (this._leftPriceScaleWidth = 0),
            (this._rightPriceScaleWidth = 0),
            (this._chart = e),
            (this._parent = t),
            (this._options = Object.assign({}, X, i)),
            (this._visibilityPrioritizedGroups = this._initGroupDescriptions()),
            this._init(),
            this._initHandlers(),
            this.updatePosition()
        }
        destroy() {
          var e
          null !== this._visibilityTypeProperty &&
            (this._visibilityTypeProperty.unsubscribe(
              this,
              this._onVisibilityTypeChange,
            ),
            (this._visibilityTypeProperty = null)),
            null !== this._boundMouseHandler &&
              (this._parent.removeEventListener(
                'mousemove',
                this._boundMouseHandler,
                !1,
              ),
              this._parent.removeEventListener(
                'mouseleave',
                this._boundMouseHandler,
                !1,
              ),
              (this._boundMouseHandler = null)),
            null !== this._priceAxisChanged &&
              (this._priceAxisChanged.unsubscribe(
                this,
                this._updateBackBtnPosition,
              ),
              (this._priceAxisChanged = null)),
            clearInterval(this._checkIntervalId),
            null === (e = this._resetScalesAvailable) ||
              void 0 === e ||
              e.destroy()
          const t = this._chart.getResizerDetacher()
          t.fullscreenable.unsubscribe(
            this._boundUpdateMaximizeButtonsVisibility,
          ),
            t.fullscreen.unsubscribe(this._boundToggleFullscreenButtons),
            (this._chart = null)
        }
        updatePosition() {
          const e = (this._targetPaneWidget = this._getTargetPaneWidget())
          if (null === e) return
          const t = e.getElement().querySelector('.chart-markup-table .pane')
          if (null === t) return
          ;(this._paneWidth = e.width()),
            (this._leftPriceScaleWidth =
              this._chart.getPriceAxisMaxWidthByName('left')),
            (this._rightPriceScaleWidth =
              this._chart.getPriceAxisMaxWidthByName('right'))
          const i =
            this._parent.getBoundingClientRect().bottom -
            t.getBoundingClientRect().bottom +
            this._bottomMargin(e)
          ;(this._widget.style.bottom = `${i}px`),
            (this._back.style.bottom = `${i}px`),
            this._updateBtnGroupVisibility()
        }
        _getTargetPaneWidget() {
          const e = this._chart.maximizedPaneWidget()
          if (e) return e
          const t = [...this._chart.paneWidgets()].reverse()
          for (const e of t)
            if (
              e.height() >=
              this._widget.clientHeight + 28 + this._bottomMargin(e)
            )
              return e
          return null
        }
        _bottomMargin(e) {
          return e.containsMainSeries() ? 27 : 0
        }
        _init() {
          if (h.CheckMobile.any())
            for (const e of this._btnGroups) e.classList.add('js-hidden')
          ;(this._buttons = {
            zoomIn: this._widget.querySelector('.control-bar__btn--zoom-in'),
            zoomOut: this._widget.querySelector('.control-bar__btn--zoom-out'),
            moveLeft: this._widget.querySelector(
              '.control-bar__btn--move-left',
            ),
            moveRight: this._widget.querySelector(
              '.control-bar__btn--move-right',
            ),
            turn: this._widget.querySelector('.control-bar__btn--turn-button'),
            maximize: this._widget.querySelector('.control-bar__btn--maximize'),
            minimize: this._widget.querySelector('.control-bar__btn--minimize'),
          }),
            this._initVisibility(),
            this._parent.appendChild(this._widget),
            this._parent.appendChild(this._back),
            (this._backButtonVisible = !1),
            (this._priceAxisName = (0, r.isRtl)() ? 'left' : 'right'),
            this._chart.withModel(this, () => {
              var e
              ;(this._chartModel = this._chart.model()),
                (this._priceAxisChanged =
                  this._chart.getPriceAxisWidthChangedByName(
                    this._priceAxisName,
                  )),
                this._priceAxisChanged.subscribe(
                  this,
                  this._updateBackBtnPosition,
                ),
                (this._resetScalesAvailable = this._chartModel
                  .model()
                  .resetScalesAvailable()
                  .spawn()),
                this._resetScalesAvailable.subscribe(
                  this._updateResetScalesButtonVisibility.bind(this),
                  { callWithLast: !0 },
                )
              const t = this._chart.getResizerDetacher()
              t.fullscreenable.subscribe(
                this._boundUpdateMaximizeButtonsVisibility,
              ),
                t.fullscreen.subscribe(this._boundToggleFullscreenButtons),
                this._updateMaximizeButtonsVisibility(),
                this._updateBackBtnPosition(),
                null === (e = this._back.querySelector('.control-bar__btn')) ||
                  void 0 === e ||
                  e.addEventListener('click', () => {
                    null !== this._chartModel &&
                      this._chartModel.timeScale().scrollToRealtime(!0)
                  }),
                (this._checkIntervalId = setInterval(() => this._check(), 1e3))
            })
        }
        _initHandlers() {
          const e = o.mobiletouch ? 'touchstart' : 'mousedown',
            t = o.mobiletouch ? ['touchend'] : ['mouseup', 'mouseout']
          this._buttons.moveLeft.addEventListener(e, (e) => {
            e.preventDefault(),
              this._chart.scrollHelper().moveByBar(1),
              this._trackEvent('Move Left')
          }),
            this._buttons.moveRight.addEventListener(e, (e) => {
              e.preventDefault(),
                this._chart.scrollHelper().moveByBar(-1),
                this._trackEvent('Move Right')
            })
          for (const e of t)
            this._buttons.moveLeft.addEventListener(e, () =>
              this._chart.scrollHelper().stopMove(),
            ),
              this._buttons.moveRight.addEventListener(e, () =>
                this._chart.scrollHelper().stopMove(),
              )
          this._buttons.turn.addEventListener('click', (e) => {
            e.preventDefault(),
              this._chart.GUIResetScales(),
              this._trackEvent('Reset to Default Settings')
          }),
            this._buttons.zoomOut.addEventListener('click', (e) => {
              e.preventDefault(),
                null !== this._chartModel && this._chartModel.zoomOut(),
                this._trackEvent('Zoom Out')
            }),
            this._buttons.zoomIn.addEventListener('click', (e) => {
              e.preventDefault(),
                null !== this._chartModel && this._chartModel.zoomIn(),
                this._trackEvent('Zoom In')
            }),
            this._buttons.maximize.addEventListener('click', (e) => {
              e.preventDefault(),
                this._chart.setActive(!0),
                this._chart.getResizerDetacher().requestFullscreen(),
                this._trackEvent(' Maximize Chart')
            }),
            this._buttons.minimize.addEventListener('click', (e) => {
              e.preventDefault(),
                this._chart.getResizerDetacher().exitFullscreen(),
                this._trackEvent(' Restore Chart')
            })
          const i = (e) =>
            e.addEventListener('contextmenu', (e) => e.preventDefault())
          i(this._buttons.moveLeft),
            i(this._buttons.moveRight),
            i(this._buttons.turn),
            i(this._buttons.zoomOut),
            i(this._buttons.zoomIn),
            i(this._buttons.minimize),
            i(this._buttons.maximize)
        }
        _initGroupDescriptions() {
          return [
            {
              shouldBeHiddenOnMobile: !1,
              available: this._isMaximizeButtonAvailable.bind(this),
              className: 'js-btn-group-maximize',
              element: this._getBtnGroup('js-btn-group-maximize'),
              totalWidth: 50,
            },
            {
              shouldBeHiddenOnMobile: !1,
              available: () => this._options.resetScale,
              className: 'js-btn-group-reset-scale',
              element: this._getBtnGroup('js-btn-group-reset-scale'),
              totalWidth: 50,
            },
            {
              shouldBeHiddenOnMobile: !a.enabled(
                'show_zoom_and_move_buttons_on_touch',
              ),
              available: () => this._options.zoomInOut,
              className: 'js-btn-group-zoom',
              element: this._getBtnGroup('js-btn-group-zoom'),
              totalWidth: 86,
            },
            {
              shouldBeHiddenOnMobile: !a.enabled(
                'show_zoom_and_move_buttons_on_touch',
              ),
              available: () => this._options.scrollLeftRight,
              className: 'js-btn-group-scroll',
              element: this._getBtnGroup('js-btn-group-scroll'),
              totalWidth: 86,
            },
          ]
        }
        _check() {
          var e
          if (null === this._chartModel || !this._options.goToRealtime) return
          const t = this._chartModel.timeScale().rightOffset() < 0
          t !== this._backButtonVisible &&
            ((this._backButtonVisible = t),
            null === (e = this._back.querySelector('.control-bar__btn')) ||
              void 0 === e ||
              e.classList.toggle($, !this._backButtonVisible))
        }
        _initVisibility() {
          ;(this._visibilityTypeProperty = (0, n.actualBehavior)()),
            this._visibilityTypeProperty.subscribe(
              this,
              this._onVisibilityTypeChange,
            ),
            this._onVisibilityTypeChange()
        }
        _onVisibilityTypeChange() {
          if (null === this._visibilityTypeProperty) return
          const e = this._visibilityTypeProperty.value()
          'alwaysOn' === e || 'alwaysOff' === e
            ? ((this._controlBarVisible = 'alwaysOn' === e),
              null !== this._boundMouseHandler &&
                (this._parent.removeEventListener(
                  'mousemove',
                  this._boundMouseHandler,
                  !1,
                ),
                this._parent.removeEventListener(
                  'mouseleave',
                  this._boundMouseHandler,
                  !1,
                ),
                (this._boundMouseHandler = null)))
            : ((this._controlBarVisible = !1),
              this._boundMouseHandler ||
                ((this._boundMouseHandler =
                  this._visibilityMouseHandler.bind(this)),
                this._parent.addEventListener(
                  'mousemove',
                  this._boundMouseHandler,
                ),
                this._parent.addEventListener(
                  'mouseleave',
                  this._boundMouseHandler,
                ))),
            this._updateControlBarVisibility()
        }
        _visibilityMouseHandler(e) {
          if (e.buttons) return
          if (null !== this._chartModel && this._chartModel.lineBeingCreated())
            return
          let t = 'mouseleave' !== e.type
          if ('mousemove' === e.type) {
            const i = this._widget.getBoundingClientRect(),
              s =
                100 -
                (this._targetPaneWidget
                  ? this._bottomMargin(this._targetPaneWidget)
                  : 0)
            t =
              e.clientX >= i.left - 100 &&
              e.clientX <= i.right + 100 &&
              e.clientY >= i.top - s &&
              e.clientY <= i.bottom + 100
          }
          this._controlBarVisible !== t &&
            ((this._controlBarVisible = t),
            null === this._rafId &&
              (this._rafId =
                this._controlBar.ownerDocument.defaultView.requestAnimationFrame(
                  this._updateControlBarVisibility.bind(this),
                )))
        }
        _updateControlBarVisibility() {
          ;(this._rafId = null),
            this._controlBar.classList.toggle(
              'control-bar--hidden',
              !this._controlBarVisible,
            )
        }
        _updateBackBtnPosition() {
          if (
            'left' === this._priceAxisName ||
            'right' === this._priceAxisName
          ) {
            const e =
              this._chart.getPriceAxisMaxWidthByName(this._priceAxisName) + 14
            e && (this._back.style.marginRight = `${e}px`)
          }
        }
        _updateBtnGroupVisibility() {
          const e = this._leftPriceScaleWidth + this._paneWidth,
            t = (e + this._rightPriceScaleWidth) / 2
          let i = 2 * Math.min(e - t, t - this._leftPriceScaleWidth) - 50 - 50,
            s = !1
          for (const e of this._visibilityPrioritizedGroups) {
            e.enoughSpaceForGroup = !1
            e.available() &&
              (!j || !e.shouldBeHiddenOnMobile) &&
              ((i -= e.totalWidth),
              (e.enoughSpaceForGroup = i >= 0 && !s),
              (s = s || !e.enoughSpaceForGroup)),
              !e.enoughSpaceForGroup !==
                e.element.classList.contains('js-hidden') &&
                e.element.classList.toggle('js-hidden', !e.enoughSpaceForGroup)
          }
          this._updateControlBarPosition()
        }
        _getBtnGroup(e) {
          return (0, s.ensureDefined)(
            this._btnGroups.find((t) => t.classList.contains(e)),
          )
        }
        _updateControlBarPosition() {
          const e = this._visibilityPrioritizedGroups.reduce(
              (e, t) => e + (t.enoughSpaceForGroup ? t.totalWidth : 0),
              0,
            ),
            t =
              (this._paneWidth +
                this._leftPriceScaleWidth +
                this._rightPriceScaleWidth) /
                2 -
              Math.ceil(e / 2)
          this._widget.style.left = `${t}px`
        }
        _updateResetScalesButtonVisibility() {
          if (null === this._chartModel) return
          const e = this._chartModel.model().resetScalesAvailable().value()
          this._buttons.turn.classList.toggle($, !e)
        }
        _updateMaximizeButtonsVisibility() {
          this._updateBtnGroupVisibility()
        }
        _toggleFullscreenButtons() {
          const e = this._chart.inFullscreen()
          this._buttons.maximize.classList.toggle('js-hidden', e),
            this._buttons.minimize.classList.toggle('js-hidden', !e)
        }
        _isMaximizeButtonAvailable() {
          return (
            !!this._options.maximize &&
            !!this._chart.getResizerDetacher().fullscreenable.value() &&
            !_.mediaState.isPhoneSizeDevice()
          )
        }
        _trackEvent(e) {
          0
        }
      }
    },
    289190: (e, t, i) => {
      i.r(t), i.d(t, { LegendWidget: () => tl })
      var s = i(327714),
        l = i(343370),
        o = i(650151),
        a = i(650802),
        n = i(372605),
        r = i(724377),
        d = i(778199),
        u = i(156963),
        h = i(601227),
        c = i(190787),
        _ = i(892932),
        p = i(521744),
        m = i(159255),
        g = i(714337),
        v = i(689635),
        b = i(796966),
        w = i(462892),
        S = i(377539),
        y = i(707488)
      const C = h.CheckMobile.any()
      function M(e, t) {
        e.dataset.status = t ? 'loading' : void 0
      }
      class f {
        constructor(e, t, i) {
          ;(this._el = null),
            (this._firstBlockWrapper = null),
            (this._titlesWrapperEl = null),
            (this._titleContainers = []),
            (this._titleElements = []),
            (this._valuesElements = []),
            (this._actionsParentEl = null),
            (this._actionAdditionalWrapperEl = null),
            (this._stayInHoveredMode = !1),
            (this._mode = 4),
            (this._statusesWrapper = null),
            (this._loader = null),
            (this._valuesParentEl = null),
            (this._valuesAdditionalWrapperEl = null),
            (this._resizeObserver = null),
            (this._hideInvisibleHover = null),
            (this._hideValues = null),
            (this._allButtonsWidth = null),
            (this._lastStatusesWrapperWidth = null),
            (this._lastActionsWrapperWidth = null),
            (this._showActionsHandler = null),
            (this._hideActionsHandler = null),
            (this._selectedSourceHandler = null),
            (this._mouseEventHandlers = []),
            (this._disableTimeout = null),
            (this._updateDisabledState = (e = this._disabled.value()) => {
              null !== this._el &&
                (this._el.classList.toggle(S.disabled, e),
                this._updateLoadingState(),
                this._updateStatusWidgetVisibility(e),
                this._updateTitleMaxWidth())
            }),
            (this._updateLoadingState = (e = this._loading.value()) => {
              if (null !== this._el) {
                this._el.classList.toggle(
                  S.eyeLoading,
                  e && !this._disabled.value(),
                ),
                  M(this._el, e)
              }
              null !== this._loader && this._loader.toggleVisibility(e),
                this._updateShowValues()
            }),
            (this._model = e),
            (this._parentEl = t),
            (this._disabled = this._model.disabled().spawn()),
            this._disabled.subscribe(this._updateDisabledState),
            (this._disabledOnInterval = this._model
              .disabledOnInterval()
              .spawn()),
            this._disabledOnInterval.subscribe(
              this._updateDisabledOnIntervalState.bind(this),
            ),
            (this._selected = this._model.selected().spawn()),
            this._selected.subscribe(this._updateSelectedState.bind(this)),
            (this._loading = this._model.loading().spawn()),
            this._loading.subscribe(
              ((e, t) => {
                let i = 0
                return (s) => {
                  clearTimeout(i), s ? e() : (i = setTimeout(e, t))
                }
              })(this._updateLoadingState, 700),
            ),
            (this._isTitleHidden = this._model.isTitleHidden().spawn()),
            (this._isRowHidden = this._model.isRowHidden().spawn()),
            this._isTitleHidden.subscribe(this._updateShowTitles.bind(this)),
            this._isRowHidden.subscribe(this._updateShowLine.bind(this)),
            this._createTitlesSpawns()
          for (let e = 0; e < this._titlesSpawns.length; e++)
            this._titlesSpawns[e].title.subscribe(
              this._updateTitlesHandler.bind(this, e),
            )
          ;(this._values = this._model.values().spawn()),
            this._values.subscribe(this._updateValues.bind(this)),
            this._createValuesSpawns(),
            this._addValuesSpawnsSubscriptions(),
            (this._actionsSpawnArray = this._model
              .actions()
              .map((e) => ({
                visible: e.visible.spawn(),
                title: void 0 === e.title ? null : e.title.spawn(),
              })))
          for (let e = 0; e < this._actionsSpawnArray.length; e++) {
            this._actionsSpawnArray[e].visible.subscribe(
              this._updateActionVisibilities.bind(this, e),
            )
            const t = this._actionsSpawnArray[e].title
            null !== t && t.subscribe(this._updateActionTitle.bind(this, e))
          }
          ;(this._withActions = i.withActions),
            this._render(),
            this._updateStates(),
            this._updateShowTitles(),
            this._updateShowValues(),
            this._updateShowLine(),
            (this._loader = (0, w.createPointsLoaderRenderer)(
              (0, o.ensureNotNull)(this._valuesParentEl),
              { className: S.loader },
            )),
            (this._customTextColor = i.customTextColor.spawn()),
            this._customTextColor.subscribe(
              this._updateCustomTextColor.bind(this),
            ),
            this._updateCustomTextColor(),
            this._withActions &&
              ((this._showActionsHandler = (0, b.wrapHandlerWithPreventEvent)(
                this._showActions.bind(this),
              )),
              (this._hideActionsHandler = (0, b.wrapHandlerWithPreventEvent)(
                this._hideActions.bind(this),
              )),
              (this._selectedSourceHandler = (0, v.defaultPreventedHandler)(
                this._model.setSourceSelected.bind(this._model),
              )),
              null !== this._titlesWrapperEl &&
                (C ||
                  (this._titlesWrapperEl.addEventListener(
                    'mouseenter',
                    this._showActionsHandler,
                  ),
                  this._titlesWrapperEl.addEventListener(
                    'mouseleave',
                    this._hideActionsHandler,
                  )),
                this._mouseEventHandlers.push(
                  new v.MouseEventHandler(this._titlesWrapperEl, {
                    mouseDoubleClickEvent: this._model.onShowSettings.bind(
                      this._model,
                    ),
                    doubleTapEvent: this._model.onShowSettings.bind(
                      this._model,
                    ),
                    mouseClickEvent: this._selectedSourceHandler,
                    tapEvent: this._selectedSourceHandler,
                  }),
                )),
              null === this._actionAdditionalWrapperEl ||
                null === this._actionsParentEl ||
                C ||
                (this._actionAdditionalWrapperEl.addEventListener(
                  'mouseenter',
                  this._showActionsHandler,
                ),
                this._actionAdditionalWrapperEl.addEventListener(
                  'mouseleave',
                  this._hideActionsHandler,
                ),
                this._actionsParentEl.addEventListener('contextmenu', (e) => {
                  e.preventDefault(), e.stopPropagation()
                })))
        }
        destroy() {
          var e, t, i
          this._disabled.destroy(),
            this._disabledOnInterval.destroy(),
            this._selected.destroy(),
            this._loading.destroy(),
            this._isTitleHidden.destroy(),
            this._isRowHidden.destroy(),
            this._customTextColor.destroy(),
            null === (e = this._loader) || void 0 === e || e.destroy(),
            null !== this._disableTimeout && clearTimeout(this._disableTimeout)
          for (const e of this._titlesSpawns) e.title.destroy()
          if (null !== this._titlesWrapperEl) {
            for (const e of this._mouseEventHandlers) e.destroy()
            ;(this._titleContainers = []),
              (this._titleElements = []),
              this._withActions &&
                null !== this._selectedSourceHandler &&
                null !== this._showActionsHandler &&
                null !== this._hideActionsHandler &&
                (C ||
                  (this._titlesWrapperEl.removeEventListener(
                    'mouseenter',
                    this._showActionsHandler,
                  ),
                  this._titlesWrapperEl.removeEventListener(
                    'mouseleave',
                    this._hideActionsHandler,
                  ))),
              (this._titlesWrapperEl = null)
          }
          for (const e of this._actionsSpawnArray) {
            e.visible.destroy()
            const t = e.title
            null !== t && t.destroy()
          }
          if (
            (null !== this._actionAdditionalWrapperEl &&
              (this._withActions &&
                null !== this._showActionsHandler &&
                null !== this._hideActionsHandler &&
                !C &&
                (this._actionAdditionalWrapperEl.removeEventListener(
                  'mouseenter',
                  this._showActionsHandler,
                ),
                this._actionAdditionalWrapperEl.removeEventListener(
                  'mouseleave',
                  this._hideActionsHandler,
                )),
              (this._actionAdditionalWrapperEl = null)),
            (this._actionsParentEl = null),
            this._removeValuesSpawnsSubscriptions(),
            this._values.destroy(),
            null !== this._valuesParentEl &&
              ((this._valuesElements = []), (this._valuesParentEl = null)),
            null === (t = this._hideInvisibleHover) ||
              void 0 === t ||
              t.destroy(),
            null === (i = this._hideValues) || void 0 === i || i.destroy(),
            null !== this._resizeObserver &&
              (this._resizeObserver.disconnect(),
              (this._resizeObserver = null)),
            null !== this._el)
          ) {
            ;(0, o.ensureNotNull)(this._el.parentNode).removeChild(this._el),
              (this._el = null)
          }
        }
        getHeight() {
          return null === this._el ? null : 24
        }
        updateMode(e) {
          ;(this._mode === e && null !== this._allButtonsWidth) ||
            ((this._mode = e), this._updateAllButtonsWidth())
        }
        _render() {
          this._renderTitle(),
            this._renderActions(),
            this._renderValues(),
            (this._el = document.createElement('div')),
            M(this._el, this._loading.value()),
            (this._firstBlockWrapper = document.createElement('div')),
            this._firstBlockWrapper.classList.add(S.noWrapWrapper),
            this._firstBlockWrapper.appendChild(
              (0, o.ensureNotNull)(this._titlesWrapperEl),
            ),
            null !== this._actionsParentEl &&
              this._firstBlockWrapper.appendChild(this._actionsParentEl),
            this._el.appendChild(this._firstBlockWrapper),
            this._el.appendChild((0, o.ensureNotNull)(this._valuesParentEl)),
            this._parentEl.append(this._el)
        }
        _renderTitle() {
          var e
          null === this._titlesWrapperEl &&
            ((this._titlesWrapperEl = document.createElement('div')),
            this._titlesWrapperEl.classList.add(S.titlesWrapper))
          for (let t = 0; t < this._titlesSpawns.length; t++) {
            const i =
                null !== (e = this._titlesSpawns[t].title.value()) &&
                void 0 !== e
                  ? e
                  : '',
              s = this._titlesSpawns[t].class,
              l = document.createElement('div')
            l.classList.add(S.titleWrapper, s, 'apply-overflow-tooltip'),
              this._titlesSpawns[t].dataSetName &&
                (l.dataset.name = this._titlesSpawns[t].dataSetName)
            const o = this._titlesSpawns[t].tooltip
            void 0 !== o &&
              (l.classList.add('apply-common-tooltip'),
              l.setAttribute('title', o))
            const a = this._titlesSpawns[t].onClick
            if (void 0 !== a) {
              l.classList.add(S.withAction)
              const e = (e) => {
                var t
                null === (t = this._selectedSourceHandler) ||
                  void 0 === t ||
                  t.call(this, e),
                  a()
              }
              this._mouseEventHandlers.push(
                new v.MouseEventHandler(
                  l,
                  {
                    mouseClickEvent: e,
                    tapEvent: h.CheckMobile.any() ? void 0 : e,
                  },
                  { ignoreClickAndTapOnDblClickOrDblTap: !0 },
                ),
              )
            }
            const n = document.createElement('div')
            n.classList.add(S.title),
              i.length > 0
                ? (n.appendChild(document.createTextNode(i)),
                  l.classList.add(S.withDot))
                : l.classList.add(y.blockHidden),
              l.appendChild(n),
              this._titlesWrapperEl.appendChild(l),
              this._titleContainers.push(l),
              this._titleElements.push(n)
          }
        }
        _renderActions() {
          if (!this._withActions) return
          null === this._actionsParentEl &&
            ((this._actionsParentEl = document.createElement('div')),
            this._actionsParentEl.classList.add(S.buttonsWrapper),
            this._parentEl.append(this._actionsParentEl),
            (this._actionAdditionalWrapperEl = document.createElement('div')),
            this._actionAdditionalWrapperEl.classList.add(S.buttons),
            this._actionsParentEl.appendChild(this._actionAdditionalWrapperEl))
          const e = (0, o.ensureNotNull)(this._actionAdditionalWrapperEl),
            t = p.trackingModeIsAvailable ? 'large' : 'small'
          for (const i of this._model.actions()) {
            const s = (0, g.createActionElement)(
              i,
              S.button,
              S.buttonIcon,
              y.blockHidden,
              t,
            )
            e.appendChild(s)
          }
        }
        _initWrappersIfNotInitialized() {
          return (
            null === this._valuesParentEl &&
              ((this._valuesParentEl = document.createElement('div')),
              this._valuesParentEl.classList.add(S.valuesWrapper),
              (this._valuesAdditionalWrapperEl = document.createElement('div')),
              this._valuesAdditionalWrapperEl.classList.add(
                S.valuesAdditionalWrapper,
              ),
              this._valuesParentEl.appendChild(
                this._valuesAdditionalWrapperEl,
              )),
            (0, o.ensureNotNull)(this._valuesAdditionalWrapperEl)
          )
        }
        _isWidthButtonsMode() {
          return (
            null !== this._el &&
            (this._el.classList.contains(S.withAction) ||
              this._disabled.value() ||
              this._selected.value() ||
              this._stayInHoveredMode)
          )
        }
        _updateTitlesHandler(e, t) {
          const i = (0, o.ensureNotNull)(this._titleContainers[e]),
            s = 0 === t.length
          i.classList.toggle(y.blockHidden, s),
            i.classList.toggle(S.withDot, !s),
            (0, c.updateTextNode)(
              (0, o.ensureNotNull)(this._titleElements[e]),
              t,
            )
        }
        _updateStates(e) {
          this._updateDisabledState(),
            this._updateDisabledOnIntervalState(),
            this._updateSelectedState(),
            this._updateLoadingState(),
            e && this._clearDisableState()
        }
        _updateValuesHTMLElHandler(e, t) {
          const i = (0, o.ensure)(this._valuesElements[e].value)
          ;(0, c.updateTextNode)(i, t), this._updateShowValues()
        }
        _updateValueColorHandler(e, t = '') {
          ;(0, o.ensure)(this._valuesElements[e].value).style.color = t
        }
        _updateValueVisibleHandler(e, t) {
          const i = (0, o.ensure)(this._valuesElements[e].value).closest(
            `.${S.valueItem}`,
          )
          null !== i && i.classList.toggle(y.blockHidden, !t),
            this._updateShowValues()
        }
        _updateShowLine() {
          null !== this._el &&
            this._el.classList.toggle(y.blockHidden, this._isRowHidden.value())
        }
        _createValuesSpawns() {
          this._valuesSpawnArray = this._values
            .value()
            .map((e) => ({
              value: e.value.spawn(),
              color: e.color.spawn(),
              visible: e.visible.spawn(),
              title: e.title.spawn(),
            }))
        }
        _removeValuesSpawnsSubscriptions() {
          for (const e of this._valuesSpawnArray)
            e.value.destroy(),
              e.color.destroy(),
              e.visible.destroy(),
              e.title.destroy()
          this._valuesSpawnArray = []
        }
        _addValuesSpawnsSubscriptions() {
          for (let e = 0; e < this._valuesSpawnArray.length; e++) {
            const t = this._valuesSpawnArray[e]
            t.value.subscribe(this._updateValuesHTMLElHandler.bind(this, e)),
              t.color.subscribe(this._updateValueColorHandler.bind(this, e)),
              t.visible.subscribe(
                this._updateValueVisibleHandler.bind(this, e),
              ),
              t.title.subscribe(
                this._updateValuesTitleHTMLElHandler.bind(this, e),
              )
          }
        }
        _updateShowValues() {
          function e(e) {
            if (!e) return
            const t = Array.from(e.children).every((e) =>
              e.classList.contains(y.blockHidden),
            )
            e.classList.toggle(y.blockHidden, t)
          }
          e(this._valuesAdditionalWrapperEl), e(this._valuesParentEl)
        }
        _addStatusesWidget(e, t, i) {
          ;(this._statusesWrapper = document.createElement('div')),
            this._statusesWrapper.classList.add(S.statusesWrapper),
            e.classList.add(S.statusesWrapper__statuses),
            this._statusesWrapper.appendChild(e),
            (0, o.ensureNotNull)(this._firstBlockWrapper).appendChild(
              this._statusesWrapper,
            ),
            (this._hideInvisibleHover = t.spawn()),
            this._hideInvisibleHover.subscribe(
              this._updateInvisibleHoverMode.bind(this),
              { callWithLast: !0 },
            ),
            (this._hideValues = i.spawn()),
            this._hideValues.subscribe(this._updateHideValuesMode.bind(this), {
              callWithLast: !0,
            }),
            this._updateStatusWidgetVisibility(this._disabled.value()),
            (this._resizeObserver = new m.default(
              this._handlerRestrictTitleWidth.bind(this),
            )),
            null !== this._actionsParentEl &&
              this._resizeObserver.observe(this._actionsParentEl),
            this._resizeObserver.observe(this._statusesWrapper)
        }
        _updateTitleMaxWidth() {
          if (null === this._firstBlockWrapper) return
          const e = this._allButtonsWidth || 0,
            t =
              (this._lastActionsWrapperWidth || 0) +
              (this._lastStatusesWrapperWidth || 0)
          this._isWidthButtonsMode()
            ? (this._firstBlockWrapper.style.maxWidth = `calc(100% - ${Math.max(e, t)}px)`)
            : (this._firstBlockWrapper.style.maxWidth =
                t > 0 ? `calc(100% - ${t}px)` : '')
        }
        _updateAllButtonsWidth() {
          ;(this._allButtonsWidth = this._getButtonsCount() * J + 1),
            this._updateTitleMaxWidth()
        }
        _updateInvisibleHoverMode(e) {
          null !== this._el && this._el.classList.toggle(S.invisibleHover, !e)
        }
        _updateHideValuesMode(e) {
          null !== this._el && this._el.classList.toggle(S.hideValues, e)
        }
        _showActions() {
          if (null === this._el || !this._withActions) return
          this._el.classList.add(S.withAction)
          const e =
            null !== this._valuesParentEl &&
            null !== this._titlesWrapperEl &&
            this._valuesParentEl.offsetTop === this._titlesWrapperEl.offsetTop
          this._el.classList.toggle(S.withTail, e), this._updateTitleMaxWidth()
        }
        _hideActions() {
          null !== this._el &&
            this._withActions &&
            !this._stayInHoveredMode &&
            (this._el.classList.remove(S.withAction),
            null !== this._valuesParentEl &&
              this._valuesParentEl.classList.remove(S.withTail),
            this._updateTitleMaxWidth())
        }
        _handlerRestrictTitleWidth(e) {
          if (
            null === this._actionsParentEl ||
            null === this._firstBlockWrapper
          )
            return
          let t = null,
            i = null
          for (const s of e)
            s.target === this._statusesWrapper && (t = s.contentRect.width),
              s.target === this._actionsParentEl && (i = s.contentRect.width)
          ;(t === this._lastStatusesWrapperWidth &&
            i === this._lastActionsWrapperWidth) ||
            (null !== t && (this._lastStatusesWrapperWidth = t),
            null !== i && (this._lastActionsWrapperWidth = i),
            this._updateTitleMaxWidth())
        }
        _clearDisableState() {
          null !== this._el &&
            (this._el.classList.remove(S.eyeLoading),
            this._el.classList.remove(S.disabled),
            this._updateStatusWidgetVisibility(this._disabled.value()),
            this._updateTitleMaxWidth())
        }
        _updateDisabledOnIntervalState() {
          var e
          null === (e = this._el) ||
            void 0 === e ||
            e.classList.toggle(
              S.disabledOnInterval,
              this._disabledOnInterval.value(),
            )
        }
        _updateSelectedState() {
          null !== this._el &&
            this._withActions &&
            this._el.classList.toggle(S.selected, this._selected.value())
        }
        _updateShowTitles() {
          null !== this._titlesWrapperEl &&
            (this._titlesWrapperEl.classList.toggle(
              y.blockHidden,
              this._isTitleHidden.value(),
            ),
            null !== this._actionsParentEl &&
              this._actionsParentEl.classList.toggle(
                y.blockHidden,
                this._isTitleHidden.value(),
              ))
        }
        _updateValues() {
          this._removeValuesSpawnsSubscriptions(),
            this._createValuesSpawns(),
            null !== this._valuesParentEl &&
              null !== this._valuesAdditionalWrapperEl &&
              ((this._valuesElements = []),
              (this._valuesAdditionalWrapperEl.innerHTML = '')),
            this._renderValues(),
            this._addValuesSpawnsSubscriptions(),
            this._updateShowValues()
        }
        _updateActionVisibilities(e) {
          null !== this._actionsParentEl &&
            this._actionsParentEl
              .querySelectorAll(`.${S.button}`)
              [e].classList.toggle(
                y.blockHidden,
                !this._actionsSpawnArray[e].visible.value(),
              )
        }
        _updateActionTitle(e) {
          const t = this._actionsSpawnArray[e].title
          null !== this._actionsParentEl &&
            null !== t &&
            this._actionsParentEl
              .querySelectorAll(`.${S.button}`)
              [e].setAttribute('title', t.value())
        }
        _updateCustomTextColor() {
          const e = this._customTextColor.value() || ''
          for (const t of this._titleContainers)
            null !== t && (t.style.color = e)
          const t = (0, o.ensureNotNull)(this._valuesParentEl).querySelectorAll(
            `.${S.valueTitle}`,
          )
          for (let i = 0; i < t.length; i++) t[i].style.color = e
          ;(0, o.ensureNotNull)(this._el).classList.toggle(
            S.withCustomTextColor,
            Boolean(e),
          )
        }
        _updateStatusWidgetVisibility(e) {
          null !== this._statusesWrapper &&
            this._statusesWrapper.classList.toggle(y.blockHidden, e)
        }
      }
      var V = i(316230),
        E = i(497754),
        L = i.n(E),
        W = i(41192),
        T = i(439067),
        k = i(626800),
        x = i(741134),
        A = i(636080)
      class H {
        constructor(e, t) {
          ;(this._lastDrawnLogos = []),
            (this._logoWrapper = null),
            (this._pairContainer = null),
            (this._primaryLogo = null),
            (this._secondaryLogo = null),
            (this._logoContainer = null),
            (this._symbolLetterContainer = null),
            (this._updateLogoVisibility = (e) => {
              this._logoWrapper &&
                this._logoWrapper.classList.toggle(S.hidden, !e)
            }),
            (this._updateSymbolLogo = async (e) => {
              var t, i, s, l, o, a, n, r, d
              if (
                (null === this._logoWrapper && this._renderSymbolLogo(),
                0 !== this._lastDrawnLogos.length &&
                  0 !== e.length &&
                  (0, V.default)(this._lastDrawnLogos, e))
              )
                return
              const u = await ((h = e),
              Promise.all(
                h.map((e) =>
                  (0, x.getImage)(`symbol_logo_${e}`, e, P).then((e) =>
                    e.cloneNode(),
                  ),
                ),
              ))
              var h
              switch (u.length) {
                case 0:
                  null === (t = this._pairContainer) ||
                    void 0 === t ||
                    t.classList.add(S.hidden),
                    null === (i = this._logoContainer) ||
                      void 0 === i ||
                      i.classList.add(A.hiddenCircleLogoClass),
                    this._updateSymbolLetter(),
                    null === (s = this._symbolLetterContainer) ||
                      void 0 === s ||
                      s.classList.remove(A.hiddenCircleLogoClass),
                    (this._lastDrawnLogos = e)
                  break
                case 1:
                  B(this._logoContainer, u[0]),
                    null === (l = this._pairContainer) ||
                      void 0 === l ||
                      l.classList.add(S.hidden),
                    null === (o = this._logoContainer) ||
                      void 0 === o ||
                      o.classList.remove(A.hiddenCircleLogoClass),
                    null === (a = this._symbolLetterContainer) ||
                      void 0 === a ||
                      a.classList.add(A.hiddenCircleLogoClass),
                    (this._lastDrawnLogos = e)
                  break
                case 2:
                  B(this._primaryLogo, u[0]),
                    B(this._secondaryLogo, u[1]),
                    null === (n = this._pairContainer) ||
                      void 0 === n ||
                      n.classList.remove(S.hidden),
                    null === (r = this._logoContainer) ||
                      void 0 === r ||
                      r.classList.add(A.hiddenCircleLogoClass),
                    null === (d = this._symbolLetterContainer) ||
                      void 0 === d ||
                      d.classList.add(A.hiddenCircleLogoClass),
                    (this._lastDrawnLogos = e)
              }
            }),
            (this._model = e),
            (this._parentElement = t),
            this._renderSymbolLogo(),
            (this._logoUrls = e.symbolLogoUrls().spawn()),
            this._logoUrls.subscribe(this._updateSymbolLogo, {
              callWithLast: !0,
            }),
            (this._isLogoVisible = e.isSymbolLogoVisible().spawn()),
            this._isLogoVisible.subscribe(this._updateLogoVisibility, {
              callWithLast: !0,
            })
        }
        destroy() {
          var e
          null === (e = this._logoWrapper) || void 0 === e || e.remove(),
            (this._logoWrapper = null),
            (this._pairContainer = null),
            (this._primaryLogo = null),
            (this._secondaryLogo = null),
            (this._logoContainer = null),
            (this._symbolLetterContainer = null),
            this._logoUrls.destroy(),
            this._isLogoVisible.destroy()
        }
        _renderSymbolLogo() {
          if (!this._logoWrapper) {
            const e = (this._logoWrapper = document.createElement('div'))
            e.classList.add(S.logoWrapper)
            const t = (this._pairContainer = e.appendChild(
              document.createElement('span'),
            ))
            t.classList.add(S.pairContainer, S.hidden)
            const i = t.appendChild(document.createElement('span'))
            i.className = (0, W.getBlockStyleClasses)('xxxsmall')
            ;(this._secondaryLogo = i.appendChild(
              document.createElement('span'),
            )).className = L()((0, W.getLogoStyleClasses)('xxxsmall'), S.logo)
            ;(this._primaryLogo = i.appendChild(
              document.createElement('span'),
            )).className = L()((0, W.getLogoStyleClasses)('xxxsmall'), S.logo)
            ;(this._logoContainer = e.appendChild(
              document.createElement('span'),
            )).className = L()(
              (0, T.getStyleClasses)('xxxsmall'),
              S.logo,
              A.hiddenCircleLogoClass,
            )
            ;((this._symbolLetterContainer = e.appendChild(
              document.createElement('span'),
            )).className = L()((0, T.getStyleClasses)('xxxsmall'), S.logo)),
              this._updateSymbolLetter()
          }
          this._parentElement.insertBefore(
            this._logoWrapper,
            this._parentElement.firstChild,
          )
        }
        _updateSymbolLetter() {
          var e
          if (this._symbolLetterContainer) {
            const t = (0, k.safeShortName)(
              null !== (e = this._model.symbol()) && void 0 !== e ? e : '',
            )[0]
            ;(0, c.updateTextNode)(this._symbolLetterContainer, t)
          }
        }
      }
      function B(e, t) {
        e && e.replaceChildren(t)
      }
      function P(e) {
        ;(e.crossOrigin = ''), (e.decoding = 'async')
      }
      class D extends f {
        constructor(e, t, i) {
          super(e, t, i),
            (this._symbolLogoRenderer = null),
            (this._clientHeight = null),
            (this._updateLinkedState = void 0),
            (this._flagged = this._model.flagged().spawn()),
            this._flagged.subscribe(this._updateFlaggedState.bind(this)),
            this._updateStates(),
            i.statusWidgetEl &&
              this._addStatusesWidget(
                i.statusWidgetEl,
                i.hideInvisibleHover,
                i.hideValues,
              ),
            this._selected.subscribe(this._updateTitleMaxWidth.bind(this))
          const s = e.symbolLogoViewModel().value()
          s &&
            (this._symbolLogoRenderer = new H(
              s,
              (0, o.ensureNotNull)(this._titleContainers[0]),
            ))
        }
        destroy() {
          var e, t
          super.destroy(),
            null === (e = this._flagged) || void 0 === e || e.destroy(),
            null === (t = this._symbolLogoRenderer) ||
              void 0 === t ||
              t.destroy()
        }
        getHeight() {
          return null === this._el
            ? null
            : (null === this._clientHeight &&
                ((this._clientHeight = this._el.clientHeight),
                0 === this._clientHeight && (this._clientHeight = null)),
              this._clientHeight)
        }
        _getButtonsCount() {
          return 1 === this._mode ? 1 : 3
        }
        _render() {
          super._render()
          const e = (0, o.ensureNotNull)(this._el)
          e.classList.add(S.item, S.series),
            e.classList.toggle(
              S.onlyOneButtonCanBeStick,
              this._model.isOneButtonCanBeStick(),
            ),
            (e.dataset.name = 'legend-series-item')
        }
        _updateStates() {
          super._updateStates(), this._updateFlaggedState()
        }
        _renderValues() {
          const e = this._initWrappersIfNotInitialized(),
            t = this._values.value()
          for (const i of t) {
            const t = document.createElement('div')
            t.classList.add(S.valueItem),
              t.classList.toggle(y.blockHidden, !i.visible.value()),
              t.classList.toggle(S.unimportant, i.unimportant.value())
            const s = document.createElement('div'),
              l = i.title.value() || ''
            s.classList.add(S.valueTitle),
              s.classList.toggle(y.blockHidden, 0 === l.length),
              s.appendChild(document.createTextNode(l)),
              t.appendChild(s)
            const o = document.createElement('div')
            o.classList.add(S.valueValue),
              (o.style.color = i.color.value() || ''),
              o.appendChild(document.createTextNode(i.value.value())),
              t.appendChild(o),
              this._valuesElements.push({ title: s, value: o }),
              e.appendChild(t)
          }
        }
        _createTitlesSpawns() {
          const e = this._model.titles(),
            t = this._model.titleActions()
          this._titlesSpawns = [
            {
              ...t.title,
              title: e.title.spawn(),
              class: S.mainTitle,
              dataSetName: 'legend-source-title',
            },
            {
              ...t.description,
              title: e.description.spawn(),
              class: S.descTitle,
              dataSetName: 'legend-source-description',
            },
            {
              ...t.interval,
              title: e.interval.spawn(),
              class: S.intervalTitle,
              dataSetName: 'legend-source-interval',
            },
            {
              ...t.provider,
              title: e.provider.spawn(),
              class: S.providerTitle,
              dataSetName: 'legend-source-provider',
            },
            {
              ...t.exchange,
              title: e.exchange.spawn(),
              class: S.exchangeTitle,
              dataSetName: 'legend-source-exchange',
            },
            {
              ...t.chartStyle,
              title: e.chartStyle.spawn(),
              class: S.styleTitle,
              dataSetName: 'legend-source-style',
            },
            {
              ...t.priceSource,
              title: e.priceSource.spawn(),
              class: S.priceSourceTitle,
              dataSetName: 'legend-source-price-source',
            },
          ]
        }
        _updateValuesTitleHTMLElHandler(e, t = '') {
          const i = (0, o.ensure)(this._valuesElements[e].title)
          ;(0, c.updateTextNode)(i, t),
            i.classList.toggle(y.blockHidden, 0 === t.length),
            this._updateShowValues()
        }
        _isWidthButtonsMode() {
          var e
          return (
            null !== this._el &&
            ((void 0 !== this._flagged && Boolean(this._flagged.value())) ||
              (null === (e = this._linked) || void 0 === e
                ? void 0
                : e.value()) ||
              super._isWidthButtonsMode())
          )
        }
        _updateFlaggedState() {
          if (void 0 === this._flagged) return
          ;(0, o.ensureNotNull)(this._el).classList.toggle(
            S.flagged,
            Boolean(this._flagged.value()),
          ),
            this._updateTitleMaxWidth()
        }
      }
      const I = h.isSafari ? 'click' : 'auxclick'
      class z extends f {
        constructor(e, t, i) {
          super(e, t, i),
            (this._wheelClickHandler = null),
            (this._symbolLogoRenderer = null),
            (this._updateSymbolLogoRenderer = (e) => {
              var t
              u.enabled('show_symbol_logo_for_compare_studies') &&
                (null === (t = this._symbolLogoRenderer) ||
                  void 0 === t ||
                  t.destroy(),
                (this._symbolLogoRenderer = e
                  ? new H(e, (0, o.ensureNotNull)(this._titleContainers[0]))
                  : null))
            }),
            (this._canUpdateRowVisibility = !0),
            (this._globalRowVisibility = this._model
              .globalVisibility()
              .spawn()),
            this._globalRowVisibility.subscribe(
              this._updateShowLine.bind(this),
              { callWithLast: !0 },
            ),
            (this._has5Buttons = this._model.isPineScriptDataSource().spawn()),
            this._has5Buttons.subscribe(this._update5ButtonsStyles.bind(this)),
            this._updateStates(!this._disabled.value()),
            i.statusWidgetEl &&
              this._addStatusesWidget(
                i.statusWidgetEl,
                i.hideInvisibleHover,
                i.hideValues,
              ),
            this._selected.subscribe(this._updateTitleMaxWidth.bind(this)),
            i.withActions &&
              ((this._wheelClickHandler = this._onWheelClicked.bind(this)),
              null !== this._titlesWrapperEl &&
                this._titlesWrapperEl.addEventListener(
                  I,
                  this._wheelClickHandler,
                ))
          const s = e.symbolLogoViewModel().value()
          this._updateSymbolLogoRenderer(s),
            e.symbolLogoViewModel().subscribe(this._updateSymbolLogoRenderer)
        }
        destroy() {
          var e
          this._model
            .symbolLogoViewModel()
            .unsubscribe(this._updateSymbolLogoRenderer),
            null === (e = this._symbolLogoRenderer) ||
              void 0 === e ||
              e.destroy(),
            this._has5Buttons.destroy(),
            this._globalRowVisibility && this._globalRowVisibility.destroy(),
            null !== this._wheelClickHandler &&
              null !== this._titlesWrapperEl &&
              this._titlesWrapperEl.removeEventListener(
                I,
                this._wheelClickHandler,
              ),
            super.destroy()
        }
        _updateShowLine() {
          if (null === this._el || !this._canUpdateRowVisibility) return
          const e = !this._globalRowVisibility.value()
          e
            ? this._el.classList.toggle(y.blockHidden, e)
            : super._updateShowLine()
        }
        _getButtonsCount() {
          switch (this._mode) {
            case 4:
              return this._has5Buttons.value() ? 5 : 4
            case 3:
              return 3
            default:
              return 2
          }
        }
        _render() {
          super._render()
          const e = (0, o.ensureNotNull)(this._el)
          e.classList.add(S.item, S.study),
            (e.dataset.name = 'legend-source-item'),
            (e.dataset.entityId = this._model.getSource().id())
        }
        _createTitlesSpawns() {
          const e = this._model.titles(),
            t = this._model.titleActions()
          this._titlesSpawns = [
            {
              ...t.title,
              title: e.title.spawn(),
              class: S.mainTitle,
              dataSetName: 'legend-source-title',
            },
            {
              ...t.args,
              title: e.args.spawn(),
              class: S.descTitle,
              dataSetName: 'legend-source-description',
            },
          ]
        }
        _renderValues() {
          const e = this._initWrappersIfNotInitialized(),
            t = this._values.value()
          for (const i of t) {
            const t = document.createElement('div')
            t.classList.add(S.valueItem),
              t.classList.toggle(y.blockHidden, !i.visible.value())
            const s = document.createElement('div')
            s.classList.add(S.valueValue),
              (s.style.color = i.color.value() || ''),
              s.appendChild(document.createTextNode(i.value.value()))
            const l = i.title.value()
            void 0 !== l &&
              (s.classList.add('apply-common-tooltip'), (s.title = l)),
              t.appendChild(s),
              this._valuesElements.push({ value: s }),
              e.appendChild(t)
          }
        }
        _updateValuesTitleHTMLElHandler(e, t = '') {
          const i = (0, o.ensure)(this._valuesElements[e].value)
          i.classList.toggle('apply-common-tooltip', 0 !== t.length),
            (i.title = t)
        }
        _update5ButtonsStyles(e) {
          null !== this._el &&
            (this._el.classList.toggle(S.has5Buttons, e),
            this._updateAllButtonsWidth())
        }
        _onWheelClicked(e) {
          1 === e.button && this._model.onRemoveSource()
        }
      }
      var N = i(609838),
        O = i(32133)
      function R(e) {
        ;(0, O.trackEvent)('GUI', 'Legend action', e)
      }
      var F = i(947036),
        G = i(662920),
        U = i(65300),
        j = i(736885)
      const $ = N.t(null, void 0, i(721686)),
        X = N.t(null, void 0, i(328705)),
        Z = N.t(null, void 0, i(551072))
      class Q {
        constructor(e, t, i) {
          ;(this._el = null),
            (this._counterEl = null),
            (this._arrowIconEL = null),
            (this._objectTreeEl = null),
            (this._mode = 0),
            (this._parentEl = e),
            (this._themedColor = t.spawn()),
            this._themedColor.subscribe(this._updateThemedColor.bind(this)),
            (this._showCollapserWithOneIndicator =
              i.showCollapserWithOneIndicator.spawn()),
            this._showCollapserWithOneIndicator.subscribe(
              this._updateSourceCount.bind(this),
            ),
            (this._sourceCount = i.visibleDataSourceCount.spawn()),
            this._sourceCount.subscribe(this._updateSourceCount.bind(this)),
            (this._isStateOpen = i.isDataSourcesCollapsed.spawn()),
            this._isStateOpen.subscribe(this._updateState.bind(this)),
            (this._showObjectsTree = i.showObjectsTree.spawn()),
            this._showObjectsTree.subscribe(
              this._updateObjectTreeVisibility.bind(this),
            ),
            this._render(),
            this._updateState(),
            this._updateThemedColor(this._themedColor.value()),
            this._updateObjectTreeVisibility(this._showObjectsTree.value()),
            (this._toggleStateHandler = (0, b.wrapHandlerWithPreventEvent)(
              i.onCollapseDataSources,
            )),
            (this._showObjectTreeHandler = (0, b.wrapHandlerWithPreventEvent)(
              i.onShowObjectsTreeDialog,
            )),
            null !== this._el &&
              (this._el.addEventListener('touchend', this._toggleStateHandler),
              this._el.addEventListener('click', this._toggleStateHandler),
              this._el.addEventListener('contextmenu', (e) => {
                e.preventDefault(), e.stopPropagation()
              })),
            null !== this._objectTreeEl &&
              (this._objectTreeEl.addEventListener(
                'touchend',
                this._showObjectTreeHandler,
              ),
              this._objectTreeEl.addEventListener(
                'click',
                this._showObjectTreeHandler,
              ))
        }
        destroy() {
          this._sourceCount.destroy(),
            this._isStateOpen.destroy(),
            this._showCollapserWithOneIndicator.destroy(),
            null !== this._objectTreeEl &&
              (this._objectTreeEl.removeEventListener(
                'touchend',
                this._showObjectTreeHandler,
              ),
              this._objectTreeEl.removeEventListener(
                'click',
                this._showObjectTreeHandler,
              ),
              (this._objectTreeEl = null)),
            (this._arrowIconEL = null),
            (this._counterEl = null),
            null !== this._el &&
              (this._el.removeEventListener(
                'touchend',
                this._toggleStateHandler,
              ),
              this._el.removeEventListener('click', this._toggleStateHandler),
              (this._el.innerHTML = ''),
              (this._el = null))
        }
        setMode(e) {
          ;(this._mode = e ? 1 : 0), this._updateTooltip()
        }
        _render() {
          ;(this._el = document.createElement('div')),
            (this._el.className = `${S.toggler} apply-common-tooltip`),
            (this._arrowIconEL = document.createElement('div')),
            this._arrowIconEL.classList.add(S.iconArrow),
            (this._arrowIconEL.innerHTML = p.trackingModeIsAvailable ? G : F),
            this._el.appendChild(this._arrowIconEL),
            (this._objectTreeEl = document.createElement('div')),
            this._objectTreeEl.classList.add(S.objectTree),
            (this._objectTreeEl.innerHTML = p.trackingModeIsAvailable ? j : U),
            this._el.appendChild(this._objectTreeEl),
            (this._counterEl = document.createElement('div')),
            this._counterEl.classList.add(S.counter),
            this._counterEl.appendChild(
              document.createTextNode(String(this._sourceCount.value())),
            ),
            this._el.appendChild(this._counterEl),
            this._parentEl.appendChild(this._el)
        }
        _updateThemedColor(e) {
          if (null !== this._el)
            if (e.length > 0) {
              const [t, i, s] = (0, r.parseRgb)(e)
              this._el.style.backgroundColor = (0, r.rgbaToString)([
                t,
                i,
                s,
                (0, r.normalizeAlphaComponent)(0.8),
              ])
            } else this._el.style.removeProperty('background-color')
        }
        _updateSourceCount() {
          const e = this._sourceCount.value(),
            t = (0, o.ensureNotNull)(this._counterEl)
          ;(0, c.updateTextNode)(t, String(e))
          const i = (0, o.ensureNotNull)(this._el),
            s = e < 1
          i.classList.toggle(y.blockHidden, s)
          const l = 1 === e
          i.classList.toggle(
            S.onlyOneSourceShown,
            l && !this._showCollapserWithOneIndicator.value(),
          )
        }
        _updateState() {
          const e = !this._isStateOpen.value()
          this._parentEl.classList.toggle(S.closed, e),
            this._updateTooltip(),
            R((e ? 'Hide' : 'Show') + ' not main sources')
        }
        _tooltip() {
          return 1 === this._mode ? Z : this._isStateOpen.value() ? $ : X
        }
        _updateTooltip() {
          null !== this._el && this._el.setAttribute('title', this._tooltip())
        }
        _updateObjectTreeVisibility(e) {
          ;(0, o.ensureNotNull)(this._el).classList.toggle(
            S.objectsTreeCanBeShown,
            e,
          )
        }
      }
      var q = i(744471)
      const J = p.trackingModeIsAvailable ? 44 : 28,
        K = u.enabled('object_tree_legend_mode')
      class Y {
        constructor(e, t) {
          ;(this._renderToggler = null),
            (this._mainDataSourceRenderer = null),
            (this._dataSourceRenderers = []),
            (this._parentEl = document.createElement('div')),
            (this._mainDataSourceEl = null),
            (this._dataSourcesEl = null),
            (this._dataSourcesAdditionalWrapperEl = null),
            (this._collapsedDataSourcesWrapperEl = null),
            (this._collapsedDataSourcesEl = null),
            (this._outsideEventForCollapsedTooltip = null),
            (this._options = e),
            (this._togglerOptions = t),
            (this._isStudiesLegendHidden = e.isStudiesLegendHidden.spawn()),
            this._isStudiesLegendHidden.subscribe(
              this._updateLegendVisibility.bind(this),
            ),
            (this._isAllLegendHidden = e.isAllLegendHidden.spawn()),
            this._isAllLegendHidden.subscribe(
              this._updateLegendVisibility.bind(this),
            ),
            this._updateLegendVisibility(),
            (this._hideAllExceptFirstLine = e.hideAllExceptFirstLine.spawn()),
            this._hideAllExceptFirstLine.subscribe(
              this._updateAllHiddenExeptFirstLine.bind(this),
            ),
            (this._themedColor = e.themedColor.spawn()),
            this._themedColor.subscribe(this._setCustomBg.bind(this)),
            (this._showBackground = e.showBackground.spawn()),
            this._showBackground.subscribe(this._setCustomBg.bind(this)),
            (this._backgroundTransparency = e.backgroundTransparency.spawn()),
            this._backgroundTransparency.subscribe(
              this._setCustomBg.bind(this),
            ),
            (this._collapsedDataSourcesCountSpawn =
              e.collapsedDataSourcesCount.spawn()),
            this._collapsedDataSourcesCountSpawn.subscribe(
              this._updateCollapsedSourcesCount.bind(this),
            ),
            (this._showCollapsedDataSourcesTooltipHandler =
              this._showCollapsedDataSourcesTooltip.bind(this)),
            this._parentEl.classList.add(S.legend),
            this._parentEl.classList.toggle(
              S.noWrap,
              !p.trackingModeIsAvailable,
            ),
            this._parentEl.classList.toggle(
              S.noActions,
              !this._options.withActions,
            ),
            this._parentEl.classList.toggle(
              S.touchMode,
              p.trackingModeIsAvailable,
            ),
            this._parentEl.classList.toggle(
              S.wrappable,
              !this._hideAllExceptFirstLine.value(),
            ),
            (this._parentEl.dataset.name = 'legend'),
            this._parentEl.style.setProperty(
              '--legend-source-item-button-width',
              `${J}px`,
            ),
            _.PLATFORM_ACCESSIBILITY_ENABLED &&
              this._parentEl.setAttribute('aria-hidden', 'true')
          const i = (t) => {
            t.preventDefault(), e.showLegendWidgetContextMenu(t)
          }
          this._mouseEventHandler = new v.MouseEventHandler(this._parentEl, {
            contextMenuEvent: i,
            touchContextMenuEvent: i,
          })
        }
        destroy() {
          if (
            (this._isStudiesLegendHidden.destroy(),
            this._isAllLegendHidden.destroy(),
            this._hideAllExceptFirstLine.destroy(),
            this._themedColor.destroy(),
            this._showBackground.destroy(),
            this._backgroundTransparency.destroy(),
            this._collapsedDataSourcesCountSpawn.destroy(),
            p.trackingModeIsAvailable &&
              null !== this._collapsedDataSourcesWrapperEl &&
              this._collapsedDataSourcesWrapperEl.removeEventListener(
                'touchend',
                this._showCollapsedDataSourcesTooltipHandler,
              ),
            this._outsideEventForCollapsedTooltip &&
              this._outsideEventForCollapsedTooltip(),
            null !== this._dataSourcesAdditionalWrapperEl &&
              ((this._dataSourcesAdditionalWrapperEl.innerHTML = ''),
              (this._dataSourcesAdditionalWrapperEl = null)),
            null !== this._dataSourcesEl &&
              ((this._dataSourcesEl.innerHTML = ''),
              (this._dataSourcesEl = null)),
            null !== this._renderToggler &&
              (this._renderToggler.destroy(), (this._renderToggler = null)),
            null !== this._mainDataSourceRenderer &&
              (this._mainDataSourceRenderer.destroy(),
              (this._mainDataSourceRenderer = null)),
            0 !== this._dataSourceRenderers.length)
          ) {
            for (const e of this._dataSourceRenderers) e.destroy()
            this._dataSourceRenderers = []
          }
          this._mouseEventHandler.destroy(),
            (this._parentEl.innerHTML = ''),
            delete this._parentEl
        }
        addMainDataSource(e, t) {
          this._renderMainDataSourceEl(),
            (this._mainDataSourceRenderer = new D(
              e,
              (0, o.ensureNotNull)(this._mainDataSourceEl),
              {
                withActions: this._options.withActions,
                customTextColor: this._options.customTextColor,
                statusWidgetEl: t.getElement(),
                hideInvisibleHover: t.visibility(),
                hideValues: t.errorWidgetIsShown,
              },
            )),
            this._updateLegendVisibility(),
            e.onDestroy().subscribe(
              this,
              () => {
                null !== this._mainDataSourceRenderer &&
                  (this._mainDataSourceRenderer.destroy(),
                  (this._mainDataSourceRenderer = null))
              },
              !0,
            )
        }
        addDataSources(e, t) {
          this._renderDataSourcesEl()
          const i = (0, o.ensureNotNull)(this._dataSourcesAdditionalWrapperEl)
          for (let s = 0; s < e.length; s++) {
            const l = e[s],
              o = new z(l, i, {
                withActions: this._options.withActions,
                customTextColor: this._options.customTextColor,
                statusWidgetEl: t[s].getElement(),
                hideInvisibleHover: t[s].visibility(),
                hideValues: t[s].errorWidgetIsShown,
              })
            this._dataSourceRenderers.push(o),
              this._updateLegendVisibility(),
              l.onDestroy().subscribe(
                this,
                () => {
                  const e = this._dataSourceRenderers.indexOf(o)
                  ;-1 !== e &&
                    (this._dataSourceRenderers[e].destroy(),
                    this._dataSourceRenderers.splice(e, 1))
                },
                !0,
              )
          }
        }
        addCustomWidget(e, t) {
          if (0 === t.block) {
            this._renderMainDataSourceEl()
            const i = (0, o.ensureNotNull)(this._mainDataSourceEl)
            1 === t.position && e.renderTo(i, i.firstChild),
              0 === t.position && e.renderTo(i)
          }
          if (1 === t.block) {
            this._renderDataSourcesEl()
            const i = (0, o.ensureNotNull)(this._dataSourcesAdditionalWrapperEl)
            1 === t.position && e.renderTo(i, i.firstChild),
              0 === t.position && e.renderTo(i)
          }
        }
        firstTitle() {
          return this._parentEl.firstElementChild
        }
        getElement() {
          return this._parentEl
        }
        updateMode(e) {
          const t = K && e < 133 ? 1 : e < 205 ? 2 : e < 222 ? 3 : 4
          null !== this._mainDataSourceRenderer &&
            this._mainDataSourceRenderer.updateMode(t)
          for (const e of this._dataSourceRenderers) e.updateMode(t)
          this._parentEl.classList.toggle(S.medium, 3 === t),
            this._parentEl.classList.toggle(S.minimized, 2 === t),
            this._parentEl.classList.toggle(S.micro, 1 === t),
            null !== this._renderToggler && this._renderToggler.setMode(1 === t)
          const i =
            !this._hideAllExceptFirstLine.value() &&
            (p.trackingModeIsAvailable || e < 542)
          this._parentEl.classList.toggle(S.directionColumn, i),
            this._parentEl.classList.toggle(
              S.hideUniportantValueItems,
              !h.CheckMobile.any() && e <= 272,
            )
        }
        getMainSourceHeight() {
          return null === this._mainDataSourceRenderer
            ? 0
            : this._mainDataSourceRenderer.getHeight()
        }
        getDataSourceHeight() {
          return 0 === this._dataSourceRenderers.length
            ? 0
            : this._dataSourceRenderers[0].getHeight()
        }
        _renderMainDataSourceEl() {
          null === this._mainDataSourceEl &&
            ((this._mainDataSourceEl = document.createElement('div')),
            this._mainDataSourceEl.classList.add(S.legendMainSourceWrapper),
            this._parentEl.insertBefore(
              this._mainDataSourceEl,
              this._dataSourcesEl,
            ))
        }
        _renderDataSourcesEl() {
          null === this._dataSourcesEl &&
            ((this._dataSourcesEl = document.createElement('div')),
            this._dataSourcesEl.classList.add(S.sourcesWrapper),
            this._renderToggle(this._dataSourcesEl),
            (this._dataSourcesAdditionalWrapperEl =
              document.createElement('div')),
            this._dataSourcesAdditionalWrapperEl.classList.add(S.sources),
            this._dataSourcesEl.appendChild(
              this._dataSourcesAdditionalWrapperEl,
            ),
            this._renderCollapsedCounter(this._dataSourcesAdditionalWrapperEl),
            this._parentEl.appendChild(this._dataSourcesEl))
        }
        _renderToggle(e) {
          this._options.showToggleButton &&
            (this._renderToggler = new Q(
              e,
              this._options.themedColor,
              this._togglerOptions,
            ))
        }
        _renderCollapsedCounter(e) {
          ;(this._collapsedDataSourcesWrapperEl =
            document.createElement('div')),
            (this._collapsedDataSourcesWrapperEl.className = `${S.item} ${S.last}`),
            (this._collapsedDataSourcesEl = document.createElement('span')),
            (this._collapsedDataSourcesEl.className = `${S.text} apply-common-tooltip`),
            this._collapsedDataSourcesWrapperEl.append(
              this._collapsedDataSourcesEl,
            ),
            e.append(this._collapsedDataSourcesWrapperEl),
            p.trackingModeIsAvailable &&
              this._collapsedDataSourcesWrapperEl.addEventListener(
                'touchend',
                this._showCollapsedDataSourcesTooltipHandler,
              ),
            this._updateCollapsedSourcesCount(
              this._collapsedDataSourcesCountSpawn.value(),
            )
        }
        _showCollapsedDataSourcesTooltip() {
          ;(0, q.showOnElement)(this._collapsedDataSourcesEl, {
            text: this._options.collapsedDataSourcesTitle.value(),
          }),
            this._addOutsideEventForHideTooltip()
        }
        _addOutsideEventForHideTooltip() {
          null !== this._outsideEventForCollapsedTooltip &&
            this._outsideEventForCollapsedTooltip(),
            (this._outsideEventForCollapsedTooltip = (0,
            d.addOutsideEventListener)(
              new CustomEvent('timestamp').timeStamp,
              this._collapsedDataSourcesWrapperEl,
              () => {
                null !== this._outsideEventForCollapsedTooltip &&
                  this._outsideEventForCollapsedTooltip(),
                  (0, q.hide)()
              },
              window.document,
              { touchEnd: !0 },
            ))
        }
        _updateCollapsedSourcesCount(e) {
          if (
            null === this._collapsedDataSourcesWrapperEl ||
            null === this._collapsedDataSourcesEl
          )
            return
          const t = 0 === e
          this._collapsedDataSourcesWrapperEl.classList.toggle(
            y.blockHidden,
            t,
          ),
            t ||
              ((0, c.updateTextNode)(this._collapsedDataSourcesEl, `+${e}`),
              this._collapsedDataSourcesEl.setAttribute(
                'title',
                this._options.collapsedDataSourcesTitle.value(),
              ))
        }
        _updateLegendVisibility() {
          this._parentEl.classList.toggle(
            y.blockHidden,
            this._isAllLegendHidden.value(),
          ),
            null !== this._dataSourcesEl &&
              this._dataSourcesEl.classList.toggle(
                y.blockHidden,
                this._isStudiesLegendHidden.value(),
              )
        }
        _updateAllHiddenExeptFirstLine() {
          this._parentEl.classList.toggle(
            S.wrappable,
            !this._hideAllExceptFirstLine.value(),
          )
        }
        _setCustomBg() {
          const e = this._showBackground.value(),
            t = this._themedColor.value(),
            i = this._backgroundTransparency.value()
          let s = ''
          if (e) {
            const [e, l, o] = (0, r.parseRgb)(t)
            s = (0, r.rgbaToString)([
              e,
              l,
              o,
              (0, r.normalizeAlphaComponent)(1 - i / 100),
            ])
          }
          this._parentEl.style.color = s
        }
      }
      var ee = i(357739),
        te = i(648067),
        ie = i(421871),
        se = i(730388),
        le = i(906247),
        oe = i(32240),
        ae = i(664902),
        ne = i(466052),
        re = i(710263),
        de = i(144273),
        ue = i(562051)
      function he(e) {
        return void 0 !== e ? oe.resetTransparency(e) : e
      }
      const ce = new ae.TranslatedString(
          'show {title}',
          N.t(null, void 0, i(787358)),
        ),
        _e = new ae.TranslatedString(
          'hide {title}',
          N.t(null, void 0, i(470301)),
        ),
        pe = N.t(null, void 0, i(581428)),
        me = N.t(null, void 0, i(831971))
      class ge {
        constructor(e, t, i, s, l) {
          ;(this._values = new a.WatchedValue([])),
            (this._actions = []),
            (this._onDestroy = new ne.Delegate()),
            (this._loading = new a.WatchedValue(!1)),
            (this._symbolLogoViewModel = new a.WatchedValue(null)),
            (this._moreActionCM = null),
            (this._updateLoadingStatus = () => {
              this._loading.setValue(this._source.isLoading())
            }),
            (this._model = e),
            (this._source = t),
            (this._options = i),
            (this._callbacks = s),
            (this._contextMenuOptions = l),
            (this._disabled = new a.WatchedValue(this._getDisabledState())),
            (this._disabledOnInterval = new a.WatchedValue(
              this._getDisabledOnIntervalState(),
            )),
            (this._selected = new a.WatchedValue(!1)),
            (this._isTitleHidden = new a.WatchedValue(
              this._getTitleHiddenValue(),
            )),
            (this._isValuesHidden = new a.WatchedValue(
              this._getValuesHiddenValue(),
            )),
            (this._isRowHidden = new a.WatchedValue(this._getRowHiddenValue())),
            (this._isEditable = new a.WatchedValue(this._getIsEditable())),
            (0, de.combine)(
              () => ({}),
              this._isTitleHidden.weakReference(),
              this._isValuesHidden.weakReference(),
              this._disabled.weakReference(),
            ).subscribe(this._updateRowVisibilities.bind(this)),
            this._values.subscribe(() => {
              this._isValuesHidden.setValue(this._getValuesHiddenValue())
            })
        }
        destroy() {
          var e
          null === (e = this._symbolLogoViewModel.value()) ||
            void 0 === e ||
            e.destroy()
        }
        onDestroy() {
          return this._onDestroy
        }
        titles() {
          return this._titles
        }
        titleActions() {
          return this._titleActions
        }
        values() {
          return this._values.readonly()
        }
        actions() {
          return this._actions
        }
        disabled() {
          return this._disabled.readonly()
        }
        disabledOnInterval() {
          return this._disabledOnInterval.readonly()
        }
        selected() {
          return this._selected.readonly()
        }
        loading() {
          return this._loading.readonly()
        }
        isTitleHidden() {
          return this._isTitleHidden.readonly()
        }
        isValuesHidden() {
          return this._isValuesHidden.readonly()
        }
        isRowHidden() {
          return this._isRowHidden.readonly()
        }
        isEditable() {
          return this._isEditable.readonly()
        }
        symbolLogoViewModel() {
          return this._symbolLogoViewModel
        }
        update() {
          var e, t
          this._updateTitles(),
            this._updateValues(),
            this._updateStates(),
            null ===
              (t =
                null === (e = this.symbolLogoViewModel()) || void 0 === e
                  ? void 0
                  : e.value()) ||
              void 0 === t ||
              t.update()
        }
        updateSource(e) {
          this._source !== e &&
            ((this._source = e),
            this.update(),
            this._isTitleHidden.setValue(this._getTitleHiddenValue()),
            this._isValuesHidden.setValue(this._getValuesHiddenValue()))
        }
        onToggleDisabled() {
          const e = this._source.properties().childs().visible,
            t = !e.value()
          this._model.setProperty(
            e,
            t,
            (t ? ce : _e).format({
              title: new ae.TranslatedString(
                this._source.name(),
                this._source.title(ue.TitleDisplayTarget.StatusLine),
              ),
            }),
          ),
            R((t ? 'Show' : 'Hide') + ' source')
        }
        onShowSettings(e) {
          this._source.userEditEnabled() &&
            (this.setSourceSelected(),
            this._callbacks.showChartPropertiesForSource(this._source, e),
            R('Settings for source'))
        }
        onShowMoreActions(e) {
          return this._options.readOnlyMode
            ? Promise.resolve(null)
            : (this._callbacks.updateActions(),
              R('Show source context menu'),
              this._callbacks.showContextMenuForSources(
                [this._source],
                this._calcNewPosition(e),
                this._contextMenuOptions,
                { origin: 'LegendPropertiesContextMenu' },
              ))
        }
        setSourceSelected() {
          this._model.selectionMacro((e) => {
            e.clearSelection(), e.addSourceToSelection(this._source)
          })
        }
        _moreActionHandler(e) {
          e.preventDefault(),
            null !== this._moreActionCM && this._moreActionCM.isShown()
              ? (this._moreActionCM = null)
              : (this.setSourceSelected(),
                this.onShowMoreActions(e).then((e) => {
                  this._moreActionCM = e
                }))
        }
        _updateStates() {
          this._disabled.setValue(this._getDisabledState()),
            this._disabledOnInterval.setValue(
              this._getDisabledOnIntervalState(),
            ),
            this._selected.setValue(
              this._model.selection().isSelected(this._source),
            ),
            this._isEditable.setValue(this._getIsEditable()),
            this._updateLoadingStatus()
        }
        _hasValues() {
          return this._values.value().length > 0
        }
        _getEyeTitle() {
          return this._disabled.value() ? pe : me
        }
        _getIsEditable() {
          return this._source.userEditEnabled()
        }
        _getDisabledState() {
          return !this._source.properties().visible.value()
        }
        _updateRowVisibilities() {
          this._isRowHidden.setValue(this._getRowHiddenValue())
        }
        _getRowHiddenValue() {
          return (
            (this._options.readOnlyMode && this._disabled.value()) ||
            (this._isTitleHidden.value() &&
              (this._isValuesHidden.value() || this._disabled.value()))
          )
        }
        _calcNewPosition(e) {
          let t = {}
          if (Object.hasOwn(e, 'touches') && e.touches.length > 0)
            t = { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY }
          else if (null !== e.target) {
            const i = e.target.getBoundingClientRect()
            t = {
              clientX: (0, re.isRtl)() ? i.right : i.left,
              clientY: i.top + i.height + 3,
            }
          } else {
            const i = e
            t = { clientX: i.clientX, clientY: i.clientY }
          }
          return t
        }
      }
      var ve = i(118737),
        be = i(868333),
        we = i(334538),
        Se = i(210891)
      const ye =
          u.enabled('show_symbol_logos') &&
          u.enabled('show_symbol_logo_in_legend'),
        Ce = new Se.CircularCacheBuffer(100)
      class Me {
        constructor(e, t) {
          ;(this._symbolLogoUrls = new a.WatchedValue([])),
            (this._quoteDataForLogos = null),
            (this._logoDataUpdated = () => {
              var e
              const t = this.symbol(),
                i = this._logoData.value()
              i && t && Ce.set(t, i)
              const s = Ce.get(t)
              ;(this._quoteDataForLogos = (0, n.merge)(
                null != s ? s : {},
                null !== (e = this._logoData.value()) && void 0 !== e ? e : {},
              )),
                this._symbolLogoUrls.setValue(
                  (0, ve.removeUsdFromCryptoPairLogos)(
                    (0, ve.resolveLogoUrls)(
                      this._quoteDataForLogos,
                      be.LogoSize.Medium,
                    ),
                  ),
                )
            }),
            (this._logoModel = e),
            (this._isLogoVisible = (0, we.createWVFromGetterAndSubscription)(
              () => t.showLogo.value(),
              t.showLogo,
            )),
            (this._logoData = this._logoModel.logoData().spawn()),
            this._logoData.subscribe(this._logoDataUpdated, {
              callWithLast: !0,
            })
        }
        destroy() {
          this._isLogoVisible.destroy(), this._logoModel.destroy()
        }
        isSymbolLogoVisible() {
          return this._isLogoVisible
        }
        symbolLogoUrls() {
          return this._symbolLogoUrls
        }
        symbol() {
          return this._logoModel.symbol()
        }
        update() {
          this._logoModel.update()
        }
      }
      function fe(e, t) {
        return ye ? new Me(e, t) : null
      }
      var Ve = i(642469)
      const Ee = (0, i(147105).getLogger)('Chart.LegendWidget')
      function Le(e) {
        const t = {}
        for (const i of ['logoid', 'currency-logoid', 'base-currency-logoid'])
          if (i in e) {
            const s = i
            t[s] = e[s]
          }
        return t
      }
      class We {
        constructor(e) {
          ;(this._logoData = new a.WatchedValue(null)),
            (this._prevSymbol = ''),
            (this._source = e),
            this._source
              .symbolResolved()
              .subscribe(this, this._onSourceSymbolResolved),
            this.update()
        }
        destroy() {
          this._source.symbolResolved().unsubscribeAll(this)
        }
        symbol() {
          return this._source.symbol()
        }
        logoData() {
          return this._logoData
        }
        update() {
          const e = this.symbol()
          this._prevSymbol !== e &&
            ((this._prevSymbol = e), this._onSourceSymbolResolved())
        }
        _onQuoteSymbolDataUpdated(e, t) {
          const i = t.values
          !this._source.symbolSameAsCurrent(e.values.pro_name) ||
            (void 0 === i.logoid &&
              void 0 === i['currency-logoid'] &&
              void 0 === i['base-currency-logoid']) ||
            this._logoData.setValue(Le(i))
        }
        async _onSourceSymbolChange() {
          const e = this.symbol()
          let t = null
          try {
            this._logoData.setValue(null),
              (t = await this._source.quotesProvider().quotesSnapshot(e))
          } catch (e) {
            Ee.logError(`Quote snapshot error: ${e}`)
          } finally {
            this.symbol() === e &&
              (null === t
                ? this._logoData.setValue(null, !0)
                : this._logoData.setValue(Le(t)))
          }
        }
        _onSourceSymbolResolved() {
          {
            const e = this._source.symbolInfo(),
              t = (null == e ? void 0 : e.logo_urls) || []
            if (1 === t.length)
              return void this._logoData.setValue({ logoid: t[0] })
            if (2 === t.length)
              return void this._logoData.setValue({
                'currency-logoid': t[0],
                'base-currency-logoid': t[1],
              })
            this._logoData.setValue(null, !0)
          }
        }
      }
      var Te = i(754336),
        ke = i(841674),
        xe = i(387258),
        Ae = i(645534)
      const He = N.t(null, void 0, i(141610)),
        Be = N.t(null, void 0, i(593666)),
        Pe = N.t(null, void 0, i(608209)),
        De = N.t(null, void 0, i(423398)),
        Ie = N.t(null, void 0, i(556934)),
        ze = N.t(null, void 0, i(699374)),
        Ne = u.enabled('legend_inplace_edit'),
        Oe = u.enabled('show_hide_button_in_legend'),
        Re = u.enabled('hide_resolution_in_legend')
      class Fe extends ge {
        constructor(e, t, i, s, l) {
          super(e, t, i, s, l),
            (this._titles = {
              title: new a.WatchedValue(''),
              description: new a.WatchedValue(''),
              interval: new a.WatchedValue(''),
              provider: new a.WatchedValue(''),
              exchange: new a.WatchedValue(''),
              chartStyle: new a.WatchedValue(''),
              priceSource: new a.WatchedValue(''),
            }),
            (this._titleActions = {
              title: void 0,
              description: void 0,
              interval: void 0,
              provider: void 0,
              exchange: void 0,
              chartStyle: void 0,
              priceSource: void 0,
            }),
            (this._symbolMarker = null),
            (this._symbolMarkerIcon = null),
            (this._flagged = new a.WatchedValue(null)),
            (this._symbolAction = null),
            (this._symbolForMarker = null),
            (this._isOneButtonCanBeStick = !1),
            (this._layoutChartSyncLegendRenderer = null),
            (this._isChartLinked = new a.WatchedValue(!1).readonly().spawn()),
            this._initializeTitleActions(),
            this._createActions(),
            this._updateSymbolMarker()
          const o = this._model
            .model()
            .properties()
            .childs()
            .paneProperties.childs()
            .legendProperties.childs()
          this._symbolLogoViewModel.setValue(fe(new We(t), o)),
            o.showSeriesTitle.subscribe(this, () => {
              this._isTitleHidden.setValue(this._getTitleHiddenValue())
            }),
            (this._isPriceSourceHidden = (0,
            te.createWVFromGetterAndSubscription)(
              () => !o.showPriceSource.value(),
              o.showPriceSource,
            )),
            (this._valuesVisibleProperty = (0, te.combineProperty)(
              (e, t, i, s) => e || t || i || s,
              o.showSeriesOHLC.weakReference(),
              o.showBarChange.weakReference(),
              o.showVolume.weakReference(),
              o.showLastDayChange.weakReference(),
            )),
            this._valuesVisibleProperty.subscribe(null, () => {
              this._isValuesHidden.setValue(this._getValuesHiddenValue())
            }),
            this.update(),
            this._source
              .onStatusChanged()
              .subscribe(this, this._updateLoadingStatus)
        }
        destroy() {
          super.destroy(),
            this._model
              .model()
              .properties()
              .childs()
              .paneProperties.childs()
              .legendProperties.childs()
              .showSeriesTitle.unsubscribeAll(this),
            this._source.onStatusChanged().unsubscribeAll(this),
            this._valuesVisibleProperty.destroy(),
            this._isPriceSourceHidden.destroy(),
            this._onDestroy.fire()
        }
        flagged() {
          return this._flagged
        }
        linked() {
          return this._isChartLinked
        }
        onShowSettings() {
          this._source.userEditEnabled() &&
            this._callbacks.showGeneralChartProperties(Ve.TabNames.symbol)
        }
        isOneButtonCanBeStick() {
          return this._isOneButtonCanBeStick
        }
        _updateTitles() {
          const e = (0, o.ensureNotNull)(
            this._source.statusView(),
          ).getSplitTitle()
          this._titles.title.setValue((0, ee.clean)(e.title, !0)),
            this._titles.description.setValue((0, ee.clean)(e.description, !0)),
            Re || this._titles.interval.setValue((0, ee.clean)(e.interval, !0)),
            this._titles.provider.setValue((0, ee.clean)(e.provider, !0)),
            this._titles.exchange.setValue((0, ee.clean)(e.exchange, !0)),
            this._titles.chartStyle.setValue((0, ee.clean)(e.chartStyle, !0)),
            this._titles.priceSource.setValue(
              (0, ee.clean)(
                this._isPriceSourceHidden.value() ? '' : e.priceSource,
                !0,
              ),
            )
        }
        _updateValues() {
          const e = this._source.legendView(),
            t = this._values.value(),
            i = e.marketTitle(),
            s = e.marketTitle().length > 0
          if (0 === t.length) {
            const t = {
                value: new a.WatchedValue(''),
                color: new a.WatchedValue(''),
                visible: new a.WatchedValue(s),
                title: new a.WatchedValue(i),
                unimportant: new a.WatchedValue(!1),
              },
              l = e
                .items()
                .map((e) => ({
                  value: new a.WatchedValue(e.value()),
                  color: new a.WatchedValue(he(e.color())),
                  visible: new a.WatchedValue(e.visible()),
                  title: new a.WatchedValue(e.title()),
                  unimportant: new a.WatchedValue(e.unimportant()),
                }))
            this._values.setValue([t].concat(l))
          } else {
            t[0].title.setValue(i), t[0].visible.setValue(s)
            const l = e.items()
            for (let e = 0; e < l.length; e++) {
              const i = l[e]
              t[e + 1].value.setValue(i.value()),
                t[e + 1].color.setValue(he(i.color())),
                t[e + 1].visible.setValue(i.visible()),
                t[e + 1].title.setValue(i.title())
            }
          }
        }
        _updateStates() {
          super._updateStates(), this._updateSymbolMarker()
        }
        _getDisabledOnIntervalState() {
          return !1
        }
        _getTitleHiddenValue() {
          return !this._model
            .model()
            .properties()
            .childs()
            .paneProperties.childs()
            .legendProperties.childs()
            .showSeriesTitle.value()
        }
        _getValuesHiddenValue() {
          return !this._hasValues() || !this._valuesVisibleProperty.value()
        }
        _initializeTitleActions() {
          if (!Ne) return
          const e = () => {
            const e = this._model.mainSeries(),
              t = e.symbol(),
              i = e.properties().childs().shortName.value()
            ;(0, le.showDialog)({
              defaultValue: e.isSpread() ? t : i || t || '',
            })
          }
          ;(this._titleActions.title = { onClick: e, tooltip: De }),
            (this._titleActions.description = { onClick: e, tooltip: Ie }),
            (this._titleActions.interval = {
              onClick: () => {
                ;(0, se.showChangeIntervalDialogAsync)({
                  initVal: this._model.mainSeries().interval(),
                  selectOnInit: !0,
                })
              },
              tooltip: ze,
            })
        }
        _createActions() {
          if (Oe) {
            const e = (0, ie.convertPropertyToWatchedValue)(
                (0, te.combineProperty)(
                  (e) => !e,
                  this._source.properties().childs().visible.weakReference(),
                ),
              ),
              t = {
                iconMap: new Map([
                  ['large', ke],
                  ['small', Te],
                ]),
                action: (0, b.wrapHandlerWithPreventEvent)(
                  this.onToggleDisabled.bind(this),
                ),
                visible: e,
                className: S.eye,
                title: new a.WatchedValue(this._getEyeTitle()),
                dataset: { name: 'legend-show-hide-action' },
              }
            this._actions.push(t),
              this._disabled.subscribe(() => {
                t.title.setValue(this._getEyeTitle())
              })
          }
          this._actions.push({
            iconMap: new Map([
              ['large', Ae],
              ['small', xe],
            ]),
            action: this._moreActionHandler.bind(this),
            visible: new a.WatchedValue(!0),
            title: new a.WatchedValue(He),
            dataset: { name: 'legend-more-action' },
          })
        }
        _getMarkerTitle() {
          return null !== this._symbolMarker
            ? this._symbolMarker.isMarked()
              ? Pe
              : Be
            : ''
        }
        _symbolActionHandler() {
          null !== this._symbolMarker &&
            (this._updateSymbolMarker(), R('Change flag state'))
        }
        _updateSymbolMarker() {
          this._isOneButtonCanBeStick = !0
        }
      }
      var Ge = i(593194),
        Ue = i(153055)
      var je = i(105586),
        $e = i(552746),
        Xe = i(721356),
        Ze = i(647362),
        Qe = i(688324),
        qe = i(265831),
        Je = i(6835),
        Ke = i(583637),
        Ye = i(34882),
        et = i(488658),
        tt = i(252506)
      ;(0, Je.getLogger)('Chart.LegendWidget')
      const it = N.t(null, void 0, i(389517)),
        st = N.t(null, void 0, i(966324)),
        lt = N.t(null, void 0, i(734596)),
        ot = N.t(null, void 0, i(141610)),
        at =
          (N.t(null, void 0, i(482751)),
          N.t(null, void 0, i(189790)),
          N.t(null, void 0, i(337809))),
        nt = N.t(null, void 0, i(423398)),
        rt =
          (u.enabled('study_buttons_in_legend'),
          u.enabled('show_hide_button_in_legend')),
        dt = u.enabled('property_pages'),
        ut = u.enabled('format_button_in_legend'),
        ht = u.enabled('delete_button_in_legend'),
        ct = u.enabled('legend_inplace_edit')
      class _t extends ge {
        constructor(e, t, i, s, l) {
          super(e, t, i, s, l),
            (this._titles = {
              title: new a.WatchedValue(''),
              args: new a.WatchedValue(''),
            }),
            (this._titleActions = { title: void 0, args: void 0 }),
            (this._error = new a.WatchedValue(!1)),
            (this._isPineScriptDataSource = new a.WatchedValue(!1)),
            (this._pineAction = null),
            (this._globalVisibility = new a.WatchedValue(!0)),
            this._updateSymbolLogoModel(),
            this._initializeTitleActions(),
            this._createActions()
          const o = this._model
              .model()
              .properties()
              .childs()
              .paneProperties.childs()
              .legendProperties.childs(),
            n = [o.showSeriesTitle, o.showStudyTitles]
          for (const e of n)
            e.subscribe(this, () => {
              this._isTitleHidden.setValue(this._getTitleHiddenValue())
            })
          const r = [
            o.showSeriesOHLC,
            o.showBarChange,
            o.showStudyValues,
            o.showLastDayChange,
          ]
          for (const e of r)
            e.subscribe(this, () => {
              this._isValuesHidden.setValue(this._getValuesHiddenValue())
            })
          this.update()
        }
        destroy() {
          super.destroy()
          const e = this._model
            .model()
            .properties()
            .childs()
            .paneProperties.childs()
            .legendProperties.childs()
          e.showSeriesTitle.unsubscribeAll(this),
            e.showStudyTitles.unsubscribeAll(this),
            e.showSeriesOHLC.unsubscribeAll(this),
            e.showBarChange.unsubscribeAll(this),
            e.showStudyValues.unsubscribeAll(this),
            e.showLastDayChange.unsubscribeAll(this),
            this._onDestroy.fire()
        }
        error() {
          return this._error.readonly()
        }
        isPineScriptDataSource() {
          return this._isPineScriptDataSource.readonly()
        }
        updateSource(e) {
          this._source !== e &&
            (this._values.setValue([]),
            super.updateSource(e),
            this._updateVisibilityPineAction(!1),
            this._updateAbleShowSourceCode(),
            this._updateSymbolLogoModel())
        }
        onRemoveSource() {
          var e
          this._source.isUserDeletable() &&
            (this._source.hasChildren()
              ? ((e = this._model.removeSource.bind(
                  this._model,
                  this._source,
                  !1,
                )),
                (0, Ue.showConfirm)({
                  title: N.t(null, void 0, i(638154)),
                  text: N.t(null, void 0, i(452003)),
                  onConfirm: ({ dialogClose: t }) => {
                    e(), t()
                  },
                }))
              : this._model.removeSource(this._source, !1),
            R('Remove sources'))
        }
        onShowSourceCode() {
          0
        }
        setGlobalVisibility(e) {
          this._globalVisibility.setValue(e)
        }
        globalVisibility() {
          return this._globalVisibility.readonly()
        }
        getFullTitle() {
          return [this._titles.title, this._titles.args]
            .map((e) => e.value())
            .join(' ')
        }
        getSource() {
          return this._source
        }
        _updateTitles() {
          const e = (0, o.ensureNotNull)(
            this._source.statusView(),
          ).getSplitTitle()
          this._titles.title.setValue((0, ee.clean)(e[0], !0))
          const t = Array.isArray(e[1]) ? e[1].join(' ') : e[1] || ''
          this._titles.args.setValue((0, ee.clean)(t, !0))
        }
        _updateValues() {
          const e = this._source.legendView()
          if (null === e) return
          if (0 === e.items().length) return
          const t = this._values.value()
          if (0 === t.length) {
            const t = e
              .items()
              .map((e) => ({
                value: new a.WatchedValue(e.value()),
                color: new a.WatchedValue(he(e.color())),
                visible: new a.WatchedValue(e.visible()),
                unimportant: new a.WatchedValue(e.unimportant()),
                title: new a.WatchedValue(e.title()),
              }))
            this._values.setValue(t)
          } else {
            const i = e.items()
            for (let e = 0; e < i.length; e++) {
              const s = t[e],
                l = i[e]
              s.value.setValue(l.value()),
                s.color.setValue(he(l.color())),
                s.visible.setValue(l.visible()),
                s.title.setValue(l.title())
            }
          }
        }
        _updateStates() {
          super._updateStates(),
            void 0 !== this._error &&
              this._error.setValue(Boolean(this._source.isFailed()))
        }
        _getTitleHiddenValue() {
          const e = this._model
            .model()
            .properties()
            .childs()
            .paneProperties.childs()
            .legendProperties.childs()
          return this._isSymbolLikeStudy()
            ? !e.showSeriesTitle.value()
            : !e.showStudyTitles.value()
        }
        _getDisabledOnIntervalState() {
          return (
            !(
              !(0, Ge.isStudy)(this._source) &&
              !(0, Ge.isStudyStub)(this._source)
            ) && !this._source.isActualInterval()
          )
        }
        _getValuesHiddenValue() {
          if (!this._hasValues()) return !0
          const e = this._model
            .model()
            .properties()
            .childs()
            .paneProperties.childs()
            .legendProperties.childs()
          return this._isSymbolLikeStudy()
            ? !e.showSeriesOHLC.value() &&
                !e.showBarChange.value() &&
                !e.showLastDayChange.value()
            : !e.showStudyValues.value()
        }
        _initializeTitleActions() {
          const e = this._source
          if (!ct || !(0, Xe.isSymbolSourceWithQuotesProvider)(e)) return
          this._titleActions.title = {
            onClick: () => {
              let t = null
              const i = (t = (0, Qe.loadNewSymbolSearch)().then((s) => {
                var l
                if (i !== t) return
                const o = e.symbol(),
                  a = (0, k.safeShortName)(o),
                  n =
                    'spread' ===
                    (null === (l = e.symbolInfo()) || void 0 === l
                      ? void 0
                      : l.type)
                      ? o
                      : a || o || '',
                  r = (0, qe.getSymbolSearchCompleteOverrideFunction)()
                s.showSymbolSearchItemsDialog({
                  onSearchComplete: (t) => {
                    r(t[0].symbol, t[0].result).then((t) => {
                      this._model.setSymbol(e, t.symbol)
                    })
                  },
                  dialogTitle: nt,
                  defaultValue: n,
                  showSpreadActions:
                    u.enabled('show_spread_operators') &&
                    u.enabled('studies_symbol_search_spread_operators'),
                })
              }))
            },
            tooltip: nt,
          }
        }
        _isSymbolLikeStudy() {
          return (
            this._source instanceof $e.study_Overlay ||
            this._source instanceof Ze.StudyCompare
          )
        }
        _updateAbleShowSourceCode() {}
        _updateVisibilityPineAction(e) {
          null !== this._pineAction &&
            (this._pineAction.visible.setValue(e),
            this._isPineScriptDataSource.setValue(e))
        }
        _createActions() {
          if (this._options.readOnlyMode) return
          if (
            ((this._pineAction = {
              iconMap: new Map([
                ['large', Ye],
                ['small', Ye],
              ]),
              action: (0, b.wrapHandlerWithPreventEvent)(
                this.onShowSourceCode.bind(this),
              ),
              visible: new a.WatchedValue(!1),
              title: new a.WatchedValue(st),
              dataset: { name: 'legend-pine-action' },
            }),
            rt)
          ) {
            const e = {
              iconMap: new Map([
                ['large', ke],
                ['small', Te],
              ]),
              action: (0, b.wrapHandlerWithPreventEvent)(
                this.onToggleDisabled.bind(this),
              ),
              visible: new a.WatchedValue(!this._getDisabledOnIntervalState()),
              className: S.eye,
              title: new a.WatchedValue(this._getEyeTitle()),
              dataset: { name: 'legend-show-hide-action' },
            }
            this._actions.push(e),
              this._disabled.subscribe(() => {
                e.title.setValue(this._getEyeTitle())
              })
            const t = {
              iconMap: new Map([
                ['large', ke],
                ['small', Te],
              ]),
              action: (0, b.wrapHandlerWithPreventEvent)(
                this.onShowSettings.bind(this, Ve.TabNames.visibility),
              ),
              visible: new a.WatchedValue(this._getDisabledOnIntervalState()),
              className: S.intervalEye,
              title: new a.WatchedValue(at),
              dataset: { name: 'legend-interval-show-hide-action' },
            }
            this._actions.push(t),
              this._disabledOnInterval.subscribe((i) => {
                t.visible.setValue(i), e.visible.setValue(!i)
              })
          }
          if (
            dt &&
            ut &&
            (!(0, Ge.isStudy)(this._source) ||
              new je.MetaInfoHelper(
                this._source.metaInfo(),
              ).hasUserEditableOptions())
          ) {
            const e = {
              iconMap: new Map([
                ['large', Ke],
                ['small', Ke],
              ]),
              action: (0, b.wrapHandlerWithPreventEvent)(
                this.onShowSettings.bind(this),
              ),
              visible: new a.WatchedValue(this._getIsEditable()),
              title: new a.WatchedValue(it),
              dataset: { name: 'legend-settings-action' },
            }
            this._actions.push(e),
              this._isEditable.subscribe((t) => {
                e.visible.setValue(t)
              })
          }
          if (ht) {
            const e = {
              iconMap: new Map([
                ['large', tt],
                ['small', et],
              ]),
              action: (0, b.wrapHandlerWithPreventEvent)(
                this.onRemoveSource.bind(this),
              ),
              visible: new a.WatchedValue(this._getIsEditable()),
              title: new a.WatchedValue(lt),
              dataset: { name: 'legend-delete-action' },
            }
            this._actions.push(e),
              this._isEditable.subscribe((t) => {
                e.visible.setValue(t)
              })
          }
          const e = {
            iconMap: new Map([
              ['large', Ae],
              ['small', xe],
            ]),
            action: this._moreActionHandler.bind(this),
            visible: new a.WatchedValue(this._getIsEditable()),
            title: new a.WatchedValue(ot),
            dataset: { name: 'legend-more-action' },
          }
          this._actions.push(e),
            this._isEditable.subscribe((t) => {
              e.visible.setValue(t)
            })
        }
        _updateSymbolLogoModel() {
          var e
          if (
            (null === (e = this._symbolLogoViewModel.value()) ||
              void 0 === e ||
              e.destroy(),
            (0, Xe.isSymbolSourceWithQuotesProvider)(this._source))
          ) {
            const e = this._model
              .model()
              .properties()
              .childs()
              .paneProperties.childs()
              .legendProperties.childs()
            this._symbolLogoViewModel.setValue(fe(new We(this._source), e))
          } else this._symbolLogoViewModel.setValue(null)
        }
      }
      var pt = i(973602),
        mt = i(462056),
        gt = i(681434),
        vt = i(213118),
        bt = i(350299),
        wt = i(212903),
        St = i(758265)
      function yt(e, t, i) {
        e.setProperty(t, !t.value(), i)
      }
      const Ct = new ae.TranslatedString(
          'change symbol description visibility',
          N.t(null, void 0, i(26717)),
        ),
        Mt = new ae.TranslatedString(
          'change open market status visibility',
          N.t(null, void 0, i(118644)),
        ),
        ft = new ae.TranslatedString(
          'change OHLC values visibility',
          N.t(null, void 0, i(457889)),
        ),
        Vt = new ae.TranslatedString(
          'change last day change visibility',
          N.t(null, void 0, i(250058)),
        ),
        Et = new ae.TranslatedString(
          'change bar change visibility',
          N.t(null, void 0, i(845110)),
        ),
        Lt = new ae.TranslatedString(
          'change indicator titles visibility',
          N.t(null, void 0, i(231325)),
        ),
        Wt = new ae.TranslatedString(
          'change indicator arguments visibility',
          N.t(null, void 0, i(96162)),
        ),
        Tt = new ae.TranslatedString(
          'change indicator values visibility',
          N.t(null, void 0, i(399774)),
        ),
        kt = new ae.TranslatedString(
          'change volume values visibility',
          N.t(null, void 0, i(709455)),
        ),
        xt = new ae.TranslatedString(
          'change symbol field visibility',
          N.t(null, void 0, i(606091)),
        ),
        At = N.t(null, void 0, i(739339)),
        Ht = N.t(null, void 0, i(775991)),
        Bt = N.t(null, void 0, i(199487)),
        Pt = N.t(null, void 0, i(37274)),
        Dt = N.t(null, void 0, i(22519)),
        It = N.t(null, void 0, i(101111)),
        zt = N.t(null, void 0, i(126315)),
        Nt = N.t(null, void 0, i(26935)),
        Ot = N.t(null, void 0, i(584098)),
        Rt = N.t(null, void 0, i(246041)),
        Ft = (0, bt.appendEllipsis)(N.t(null, void 0, i(389517))),
        Gt = u.enabled('symbol_info_price_source'),
        Ut = (e, t) =>
          e
            ? e.dataset[t]
              ? e.dataset[t]
              : e.parentElement
                ? Ut(e.parentElement, t)
                : null
            : null
      var jt = i(847709),
        $t = i(473499)
      class Xt {
        constructor(e) {
          ;(this._source = e),
            (this._fullSessionScheduleViewModel =
              new jt.FullSessionScheduleViewModel(e))
        }
        destroy() {
          this._fullSessionScheduleViewModel.destroy()
        }
        renderer(e, t, i) {
          var s, l
          return (
            null ===
              (l =
                null === (s = this._source.marketStatusModel()) || void 0 === s
                  ? void 0
                  : s.futuresContractExpirationTime()) || void 0 === l
              ? void 0
              : l.expired().value()
          )
            ? null
            : (0, $t.FullSessionScheduleRenderer)({
                key: e,
                className: t,
                showAllDays: i,
                sessionDays: this._fullSessionScheduleViewModel.sessionsDays,
                now: this._fullSessionScheduleViewModel.currentTimeValue(),
                timezone: this._fullSessionScheduleViewModel.timezone(),
              })
        }
        updateSource(e) {}
      }
      var Zt = i(149962),
        Qt = i(311757),
        qt = i(364123)
      class Jt {
        constructor(e) {
          ;(this.isBlinkingMode = new a.WatchedValue(!1)),
            (this._status = new a.WatchedValue(null)),
            (this._fullTooltip = new a.WatchedValue(null)),
            (this._iconClassNames = new a.WatchedValue(null)),
            (this._visible = new a.WatchedValue(!1)),
            (this._tooltip = new a.WatchedValue(null)),
            (this._icon = new a.WatchedValue(null)),
            (this._className = new a.WatchedValue(null)),
            (this._customColor = new a.WatchedValue(null)),
            (this._infoMaps = e),
            (this._size = e.size || 'small'),
            this._status.subscribe(this._updateByStatus.bind(this), {
              callWithLast: !0,
            })
        }
        turnOffBlinkingMode() {}
        status() {
          return this._status
        }
        tooltip() {
          return this._tooltip
        }
        icon() {
          return this._icon
        }
        className() {
          return this._className
        }
        visible() {
          return this._visible
        }
        size() {
          return this._size
        }
        fullInfo() {
          return this._fullTooltip
        }
        customColor() {
          return this._customColor
        }
        _getTooltip(e) {
          var t, i
          return null !==
            (i =
              null === (t = this._infoMaps.tooltipMap) || void 0 === t
                ? void 0
                : t.get(e)) && void 0 !== i
            ? i
            : null
        }
        _getIcon(e) {
          let t
          const i = this._infoMaps.iconMap.get(e)
          return void 0 !== i && (t = i.get(this._size)), t || null
        }
        _getClassName(e) {
          return this._infoMaps.classNameMap.get(e) || null
        }
        _getFullTooltipIconClassNames(e) {
          const t = this._getClassName(e)
          return t ? [qt.statusItem, t] : []
        }
        _getTitle(e) {
          var t, i
          return null !==
            (i =
              null === (t = this._infoMaps.titleMap) || void 0 === t
                ? void 0
                : t.get(e)) && void 0 !== i
            ? i
            : null
        }
        _getTitleColor(e) {
          var t, i
          return null !==
            (i =
              null === (t = this._infoMaps.titleColorMap) || void 0 === t
                ? void 0
                : t.get(e)) && void 0 !== i
            ? i
            : null
        }
        _getAction(e) {
          var t, i
          return null !==
            (i =
              null === (t = this._infoMaps.actionMap) || void 0 === t
                ? void 0
                : t.get(e)) && void 0 !== i
            ? i
            : null
        }
        _getHTML(e) {
          var t, i, s
          return null !==
            (s =
              null ===
                (i =
                  null === (t = this._infoMaps.htmlMap) || void 0 === t
                    ? void 0
                    : t.get(e)) || void 0 === i
                ? void 0
                : i.map(Qt.htmlEscape)) && void 0 !== s
            ? s
            : []
        }
        async _updateFullTooltip() {
          const e = this._status.value()
          null !== e
            ? this._fullTooltip.setValue([
                {
                  icon: this._getIcon(e),
                  iconClassName: this._getFullTooltipIconClassNames(e),
                  title: this._getTitle(e),
                  titleColor: this._getTitleColor(e),
                  html: this._getHTML(e),
                  size: this._size,
                  action: this._getAction(e),
                },
              ])
            : this._fullTooltip.setValue(null)
        }
        _updateByStatus(e) {
          if (null === e || this._shouldBeHiddenByStatus(e))
            return (
              this._icon.setValue(null),
              this._tooltip.setValue(null),
              void this._visible.setValue(!1)
            )
          this._icon.setValue(this._getIcon(e)),
            this._className.setValue(this._getClassName(e)),
            this._tooltip.setValue(this._getTooltip(e)),
            this._visible.setValue(!0),
            this._updateFullTooltip()
        }
        _shouldBeHiddenByStatus(e) {
          return !1
        }
      }
      var Kt = i(512646),
        Yt = i(931233),
        ei = i(55593),
        ti = i(469410),
        ii = i(552828),
        si = i(991665),
        li = i(839379),
        oi = i(672844),
        ai = i(323683)
      const ni = new Map([
          ['small', Kt],
          ['medium', Yt],
          ['large', Yt],
        ]),
        ri = new Map([
          ['small', ei],
          ['medium', ti],
          ['large', ti],
        ]),
        di = new Map([
          ['small', ii],
          ['medium', si],
          ['large', si],
        ]),
        ui =
          (new Map([
            ['small', li],
            ['medium', li],
            ['large', li],
          ]),
          new Map([
            ['small', oi],
            ['medium', ai],
            ['large', ai],
          ]),
          new Map([
            ['small', ''],
            ['medium', ''],
            ['large', ''],
          ]),
          Zt.colorsPalette['color-delay-mode']),
        hi = Zt.colorsPalette['color-eod-mode'],
        ci = Zt.colorsPalette['color-notaccurate-mode']
      Zt.colorsPalette['color-primary-symbol'],
        Zt.colorsPalette['color-halal'],
        Zt.colorsPalette['color-continuous']
      var _i = i(958057),
        pi = i(372037),
        mi = i(870122)
      const gi = 'tv.alreadyBlinkedStatuses',
        vi = []
      function bi() {
        return mi.getJSON(gi, vi)
      }
      const wi = new a.WatchedValue(bi())
      function Si(e) {
        const t = mi.getJSON(gi, vi)
        t.includes(e) || (t.push(e), mi.setJSON(gi, t), wi.setValue(bi()))
      }
      mi.onSync.subscribe(null, () => wi.setValue(bi()))
      const yi = wi
      var Ci = i(817680)
      const Mi = (0, Je.getLogger)('Chart.LegendWidget'),
        fi = [
          'TFEXDelayForGuest',
          'MOEXDelayForGuest',
          'CHIXAuDelayForGuest',
          'MILDelayForGuest',
          'NGMDelayForGuest',
          'DEForGuest',
          'ICESGDelayForGuest',
          'TAIFEXDelayForGuest',
          'TURQUOISEDelayForGuest',
          'ADXDelayForGuest',
          'TRADEGATEDelayForGuest',
          'LUXSEDelayForGuest',
          'NSENGDelayForGuest',
        ],
        Vi = new Map([
          ['DelayToRealtime', ni],
          ['DelayNoRealtime', ni],
          ['TFEXDelayForGuest', ni],
          ['MOEXDelayForGuest', ni],
          ['CHIXAuDelayForGuest', ni],
          ['MILDelayForGuest', ni],
          ['NGMDelayForGuest', ni],
          ['ICESGDelayForGuest', ni],
          ['TAIFEXDelayForGuest', ni],
          ['TURQUOISEDelayForGuest', ni],
          ['ADXDelayForGuest', ni],
          ['TRADEGATEDelayForGuest', ni],
          ['LUXSEDelayForGuest', ni],
          ['NSENGDelayForGuest', ni],
          ['DEForGuest', ni],
          ['EOD', ri],
          ['TickByTick', di],
          ['BATSToRealtime', di],
          ['DelayWithoutMarketAgreement', ni],
        ]),
        Ei = new Map([
          ['DelayToRealtime', qt.delay],
          ['DelayNoRealtime', qt.delay],
          ['TFEXDelayForGuest', qt.delay],
          ['MOEXDelayForGuest', qt.delay],
          ['CHIXAuDelayForGuest', qt.delay],
          ['MILDelayForGuest', qt.delay],
          ['NGMDelayForGuest', qt.delay],
          ['ICESGDelayForGuest', qt.delay],
          ['TAIFEXDelayForGuest', qt.delay],
          ['TURQUOISEDelayForGuest', qt.delay],
          ['ADXDelayForGuest', qt.delay],
          ['TRADEGATEDelayForGuest', qt.delay],
          ['LUXSEDelayForGuest', qt.delay],
          ['NSENGDelayForGuest', qt.delay],
          ['DEForGuest', qt.delay],
          ['EOD', qt.eod],
          ['TickByTick', qt.notAccurate],
          ['BATSToRealtime', qt.notAccurate],
          ['DelayWithoutMarketAgreement', qt.delay],
        ]),
        Li = new Map([
          ['DelayToRealtime', ui],
          ['DelayNoRealtime', ui],
          ['TFEXDelayForGuest', ui],
          ['MOEXDelayForGuest', ui],
          ['CHIXAuDelayForGuest', ui],
          ['MILDelayForGuest', ui],
          ['NGMDelayForGuest', ui],
          ['ICESGDelayForGuest', ui],
          ['TAIFEXDelayForGuest', ui],
          ['TURQUOISEDelayForGuest', ui],
          ['ADXDelayForGuest', ui],
          ['TRADEGATEDelayForGuest', ui],
          ['LUXSEDelayForGuest', ui],
          ['NSENGDelayForGuest', ui],
          ['DEForGuest', ui],
          ['EOD', hi],
          ['TickByTick', ci],
          ['BATSToRealtime', ci],
          ['DelayWithoutMarketAgreement', ui],
        ]),
        Wi = (N.t(null, void 0, i(236004)), N.t(null, void 0, i(718429)))
      ;(0, Qt.htmlEscape)(N.t(null, void 0, i(825046)))
      class Ti extends Jt {
        constructor(e, t, i) {
          super({ iconMap: Vi, classNameMap: Ei, titleColorMap: Li, size: t }),
            (this._dataUpdatedInfo = new a.WatchedValue(null).spawn()),
            (this._options = i),
            (this._model = e),
            (this._dataModeBlinkingStatuses = yi.spawn()),
            this._dataModeBlinkingStatuses.subscribe(
              this._updateBlinkingMode.bind(this),
            ),
            (this.turnOffBlinkingMode = this._turnOffBlinking.bind(this)),
            this.setModel(e)
        }
        destroy() {
          this._dataUpdatedInfo.destroy(),
            this._dataModeBlinkingStatuses.destroy()
        }
        setModel(e) {
          if ((this._dataUpdatedInfo.destroy(), null === e))
            return (
              (this._model = e),
              void (this._dataUpdatedInfo = new a.WatchedValue(null).spawn())
            )
          ;(this._dataUpdatedInfo = e.status().spawn()),
            this._dataUpdatedInfo.subscribe(this._updateStatus.bind(this), {
              callWithLast: !0,
            })
        }
        _shouldBeHiddenByStatus(e) {
          var t, i
          return (
            !!(null === (t = this._options.shouldBeHiddenRegardlessOfStatus) ||
            void 0 === t
              ? void 0
              : t.value()) ||
            !(
              'BATSToRealtime' !== e ||
              !(null === (i = this._model) || void 0 === i
                ? void 0
                : i.isSpread())
            ) ||
            super._shouldBeHiddenByStatus(e)
          )
        }
        _getTooltip() {
          const e = this._getShortTexts()
          return null === e ? null : Object.values(e).join(' · ')
        }
        async _updateFullTooltip() {
          var e
          const t = this._dataUpdatedInfo.value(),
            i = this._status.value()
          if (null === t || null === i)
            return void this._fullTooltip.setValue(null)
          const s = this._getShortTexts(),
            [l, o] = await Promise.all([this._getHtmls(), this._getActions()])
          if (t !== this._dataUpdatedInfo.value()) return
          const a = []
          for (const n of t) {
            const t = n.mode
            ;('BATSToRealtime' === t &&
              (null === (e = this._model) || void 0 === e
                ? void 0
                : e.isSpread())) ||
              a.push({
                icon: this._getIcon(t),
                iconClassName: this._getFullTooltipIconClassNames(i),
                title: s && s[t],
                titleColor: this._getTitleColor(t),
                html: l && l[t],
                size: this._size,
                action: o && o[t],
              })
          }
          this._fullTooltip.setValue(a)
        }
        _updateStatus(e) {
          var t
          const i = null !== e ? e[0] : null
          this._status.setValue(
            null !== (t = null == i ? void 0 : i.mode) && void 0 !== t
              ? t
              : null,
            !0,
          ),
            this._updateBlinkingMode()
        }
        async _getHtmls() {
          var e, t
          const s = this._dataUpdatedInfo.value()
          if (null === s || null === this._model) return Promise.resolve(null)
          const l = {},
            o = this._model.symbolName()
          let a = null,
            n = null
          try {
            ;(a = await this._model.description()), (n = this._model.exchange())
          } catch (e) {
            Mi.logError(
              `Can't get exchange description, reason: ${(0, Ci.errorToString)(e)}`,
            )
          }
          for (const r of s) {
            const s = r.mode
            if (
              ((l[s] = []),
              [
                'DelayToRealtime',
                'DelayNoRealtime',
                'DelayWithoutMarketAgreement',
                ...fi,
              ].includes(s) &&
                (l[s].push(
                  _i.delayHtml.format({
                    symbolName: o,
                    time: this._model.time().toString(),
                  }),
                ),
                this._options.subscriptionFullInfo &&
                  null !== a &&
                  'DelayToRealtime' === s &&
                  l[s].push(
                    _i.delayToRealtimeHtml.format({
                      description: `<b>${a}</b>`,
                    }),
                  ),
                'DelayNoRealtime' === s && l[s].push(_i.delayNoRealtimeHtml),
                'DelayWithoutMarketAgreement' === s &&
                  l[s].push(
                    _i.delayWithoutMarketAgreement.format({
                      listedExchange: this._model.listedExchange(),
                    }),
                  ),
                this._options.subscriptionFullInfo &&
                  fi.includes(s) &&
                  l[s].push(
                    _i.tFEXorMOEXorLSEorChixauHtml.format({
                      listedExchange: this._model.listedExchange(),
                    }),
                  )),
              'EOD' === s && (l[s] = [_i.eodHtml]),
              'TickByTick' === s)
            ) {
              const o =
                  void 0 === r.updatePeriod
                    ? _i.tickByTickHtml1FullInfo
                    : (0, Qt.htmlEscape)(
                        N.t(
                          null,
                          {
                            count: r.updatePeriod,
                            replace: {
                              amount: (null !== (e = r.updatePeriod) &&
                              void 0 !== e
                                ? e
                                : 1
                              ).toString(),
                            },
                            plural:
                              'Data on our Basic plan is updated once every {amount} seconds, even if there are more updates on the market.',
                          },
                          i(602121),
                        ),
                      ),
                a =
                  void 0 === r.updatePeriod
                    ? _i.tickByTickHtml1
                    : (0, Qt.htmlEscape)(
                        N.t(
                          null,
                          {
                            count: r.updatePeriod,
                            replace: {
                              amount: (null !== (t = r.updatePeriod) &&
                              void 0 !== t
                                ? t
                                : 1
                              ).toString(),
                            },
                            plural:
                              'Data is updated once every {amount} seconds, even if there are more updates on the market.',
                          },
                          i(888841),
                        ),
                      )
              l[s].push(this._options.subscriptionFullInfo ? o : a),
                this._options.subscriptionFullInfo &&
                  l[s].push(_i.tickByTickHtml2)
            }
            if (null !== n && 'BATSToRealtime' === s) {
              const e = this._model.listedExchange()
              0,
                pi.CRUCIAL_REALTIME_BATS.includes(this._model.listedExchange())
                  ? l[s].push(
                      _i.batsToRealtimeCrucialHtml.format({
                        exchange: e,
                        originalExchange: _i.notAccurateCboeTooltip,
                      }),
                    )
                  : l[s].push(
                      _i.batsToRealtimeHtml1.format({
                        symbolName: o,
                        exchange: n,
                      }),
                      '' !== e
                        ? (0, Qt.htmlEscape)(
                            _i.batsToRealtimeHtml2WithExchange,
                          ).format({ exchange: e })
                        : (0, Qt.htmlEscape)(
                            _i.batsToRealtimeHtml2WithoutExchange,
                          ),
                    )
            }
          }
          return Object.keys(l).length > 0 ? l : null
        }
        async _getActions() {
          if (null === this._dataUpdatedInfo.value() || null === this._model)
            return null
          const e = {}
          return Object.keys(e).length > 0 ? e : null
        }
        _getShortTexts() {
          var e, t
          const s = this._dataUpdatedInfo.value()
          if (null === s || null === this._model) return null
          const l = {}
          for (const o of s) {
            const s = o.mode
            if (
              ([
                'DelayToRealtime',
                'DelayNoRealtime',
                ...fi,
                'DelayWithoutMarketAgreement',
              ].includes(s) && (l[s] = _i.delayTooltip),
              'EOD' === s && (l[s] = _i.eodTooltip),
              'TickByTick' === s)
            ) {
              const t =
                void 0 === o.updatePeriod
                  ? _i.notAccurate1PerSecondTooltip
                  : (0, Qt.htmlEscape)(
                      N.t(
                        null,
                        {
                          plural: 'One update every {amount} seconds',
                          count: o.updatePeriod,
                          replace: {
                            amount: (null !== (e = o.updatePeriod) &&
                            void 0 !== e
                              ? e
                              : 1
                            ).toString(),
                          },
                        },
                        i(705223),
                      ),
                    )
              l[s] = t
            }
            if ('BATSToRealtime' === s) {
              const e =
                null !== (t = this._model.firstReplacedByBatsExchange()) &&
                void 0 !== t
                  ? t
                  : ''
              0,
                (l[s] =
                  '' !== e
                    ? _i.exchangeByOriginalExchangeTooltip.format({
                        exchange: e,
                        originalExchange: _i.notAccurateCboeTooltip,
                      })
                    : _i.notAccurateCboeTooltip)
            }
          }
          return Object.keys(l).length > 0 ? l : null
        }
        _updateBlinkingMode() {
          const e = this._dataUpdatedInfo.value()
          if (null === e) return
          const t = this._dataModeBlinkingStatuses.value()
          for (const i of e)
            if (!t.includes(i.mode))
              return void this.isBlinkingMode.setValue(!0)
          this.isBlinkingMode.setValue(!1)
        }
        _turnOffBlinking() {
          const e = this._dataUpdatedInfo.value()
          if (null !== e) for (const t of e) Si(t.mode)
        }
        _goProDialogAction(e, t = {}) {
          return {
            text: Wi,
            onClick: () => {
              null !== this._model &&
                createGoProDialog({
                  forceUpgradeBtn: !0,
                  goOnMarkets: !0,
                  customParams: t,
                  upgradeMessage: N.t(null, void 0, i(941707)),
                  feature: e,
                }).then(() => {
                  trackEvent('Data Warning', 'Full description visible', e)
                })
            },
          }
        }
      }
      var ki = i(838373),
        xi = i(79304)
      const Ai = N.t(null, void 0, i(539045)),
        Hi = new Map([
          [
            !0,
            new Map([
              ['small', ki],
              ['medium', xi],
              ['large', xi],
            ]),
          ],
          [
            !1,
            new Map([
              ['small', ''],
              ['medium', ''],
              ['large', ''],
            ]),
          ],
        ]),
        Bi = new Map([
          [!0, qt.dataProblemLow],
          [!1, null],
        ]),
        Pi = new Map([
          [!0, Ai],
          [!1, null],
        ]),
        Di = new Map([
          [!0, Ai],
          [!1, null],
        ]),
        Ii = new Map([
          [!0, Zt.colorsPalette['color-data-problem']],
          [!1, null],
        ])
      class zi extends Jt {
        constructor(e, t, i) {
          super({
            iconMap: Hi,
            classNameMap: Bi,
            tooltipMap: Pi,
            titleMap: Di,
            titleColorMap: Ii,
            size: t,
          }),
            (this._dataSourceErrorStatus = new a.WatchedValue(null).spawn()),
            (this._lastError = null),
            (this._options = i),
            this.setSource(e)
        }
        destroy() {
          this._dataSourceErrorStatus.destroy()
        }
        setSource(e) {
          this._dataSourceErrorStatus.destroy(),
            (this._dataSourceErrorStatus = e.errorStatus().spawn()),
            this._dataSourceErrorStatus.subscribe(
              this._updateStatus.bind(this),
              { callWithLast: !0 },
            )
        }
        _getTooltip(e) {
          var t
          return null !==
            (t = e ? this._getDataSourceErrorStatusCustomTitle() : null) &&
            void 0 !== t
            ? t
            : super._getTooltip(e)
        }
        _getTitle(e) {
          var t
          return null !==
            (t = e ? this._getDataSourceErrorStatusCustomTitle() : null) &&
            void 0 !== t
            ? t
            : super._getTitle(e)
        }
        async _updateFullTooltip() {
          const e = this._status.value(),
            t = this._dataSourceErrorStatus.value()
          null !== e && null !== t
            ? this._fullTooltip.setValue([
                {
                  icon: this._getIcon(e),
                  iconClassName: this._getFullTooltipIconClassNames(e),
                  title: this._getTitle(e),
                  titleColor: this._getTitleColor(e),
                  html: [(0, Qt.htmlEscape)(t.error)],
                  size: this._size,
                  action: this._getAction(e),
                },
              ])
            : this._fullTooltip.setValue(null)
        }
        _getAction(e) {
          return null
        }
        _updateStatus(e) {
          const t = this._status.value()
          null !== e
            ? (this._status.setValue(!0),
              t && this._lastError !== e.error && this._updateByStatus(!0),
              (this._lastError = e.error))
            : (this._status.setValue(null), (this._lastError = null))
        }
        _getDataSourceErrorStatusCustomTitle() {
          var e
          return (
            (null === (e = this._dataSourceErrorStatus.value()) || void 0 === e
              ? void 0
              : e.title) || null
          )
        }
      }
      const Ni = N.t(null, void 0, i(597325)),
        Oi = new Map([
          [
            'high',
            new Map([
              ['small', ki],
              ['medium', xi],
              ['large', xi],
            ]),
          ],
          [
            'low',
            new Map([
              ['small', ki],
              ['medium', xi],
              ['large', xi],
            ]),
          ],
        ]),
        Ri = new Map([
          ['high', qt.dataProblemHigh],
          ['low', qt.dataProblemLow],
        ]),
        Fi = new Map([
          ['high', Ni],
          ['low', Ni],
        ]),
        Gi = new Map([
          ['high', Zt.colorsPalette['color-data-problem']],
          ['low', Zt.colorsPalette['color-data-problem']],
        ])
      class Ui extends Jt {
        constructor(e, t) {
          super({
            tooltipMap: Fi,
            iconMap: Oi,
            classNameMap: Ri,
            titleMap: Fi,
            titleColorMap: Gi,
            size: t,
          }),
            (this._dataProblems = new a.WatchedValue([]).spawn()),
            (this._isDataProblemCritical = new a.WatchedValue(!1)),
            this.setModel(e)
        }
        destroy() {
          this._dataProblems.destroy()
        }
        isDataProblemCritical() {
          return this._isDataProblemCritical
        }
        setModel(e) {
          this._dataProblems.destroy(),
            null !== e
              ? ((this._dataProblems = e.dataProblems().spawn()),
                this._dataProblems.subscribe(this._updateStatus.bind(this), {
                  callWithLast: !0,
                }))
              : (this._dataProblems = new a.WatchedValue([]).spawn())
        }
        async _updateFullTooltip() {
          const e = this.status().value(),
            t = this._dataProblems.value()
          if (null === e || 0 === t.length)
            return void this._fullTooltip.setValue(null)
          const i = t.map((t, i) => {
            var s
            return {
              icon: this._getIcon(e),
              iconClassName: this._getFullTooltipIconClassNames(e),
              title:
                null !== (s = t.title) && void 0 !== s
                  ? s
                  : 0 === i
                    ? this._getTitle(e)
                    : null,
              titleColor: this._getTitleColor(e),
              html: [(0, Qt.htmlEscape)(t.text)],
              size: this._size,
              action: this._getAction(e),
            }
          })
          this._fullTooltip.setValue(i)
        }
        _getTooltip(e) {
          var t
          return null !== (t = this._getDataProblemCustomTitle()) &&
            void 0 !== t
            ? t
            : super._getTooltip(e)
        }
        _getTitle(e) {
          var t
          return null !== (t = this._getDataProblemCustomTitle()) &&
            void 0 !== t
            ? t
            : super._getTitle(e)
        }
        _updateStatus(e) {
          var t, i
          const s =
              null !==
                (i =
                  null === (t = e[0]) || void 0 === t ? void 0 : t.severity) &&
              void 0 !== i
                ? i
                : null,
            l = this._status.value() !== s
          this._status.setValue(s),
            this._isDataProblemCritical.setValue(((e) => 'high' === e)(s)),
            l || this._updateFullTooltip()
        }
        _getDataProblemCustomTitle() {
          var e, t
          return (
            (null ===
              (t =
                null === (e = this._dataProblems.value()) || void 0 === e
                  ? void 0
                  : e[0]) || void 0 === t
              ? void 0
              : t.title) || null
          )
        }
      }
      class ji extends Jt {
        constructor(e, t) {
          super(t),
            (this._booleanStatus = new a.WatchedValue(!1).spawn()),
            this.updateStatus(e)
        }
        destroy() {
          this._booleanStatus.destroy()
        }
        updateStatus(e) {
          this._booleanStatus.destroy(),
            (this._booleanStatus = e.spawn()),
            this._booleanStatus.subscribe(this._updateStatus.bind(this), {
              callWithLast: !0,
            })
        }
        _updateStatus(e) {
          e ? this._status.setValue(!0) : this._status.setValue(null)
        }
      }
      var $i = i(73710),
        Xi = i(645503)
      const Zi = N.t(null, void 0, i(814177)),
        Qi = N.t(null, void 0, i(673717)),
        qi = new Map([
          [
            !0,
            new Map([
              ['small', $i],
              ['medium', Xi],
              ['large', Xi],
            ]),
          ],
          [
            !1,
            new Map([
              ['small', ''],
              ['medium', ''],
              ['large', ''],
            ]),
          ],
        ]),
        Ji = new Map([
          [!0, qt.invalidSymbol],
          [!1, null],
        ]),
        Ki = new Map([
          [!0, Zi],
          [!1, null],
        ]),
        Yi = new Map([
          [!0, Zi],
          [!1, null],
        ]),
        es = new Map([
          [!0, Zt.colorsPalette['color-invalid-symbol']],
          [!1, null],
        ]),
        ts = new Map([
          [!0, [Qi]],
          [!1, null],
        ]),
        is = new Map([
          [!0, null],
          [!1, null],
        ])
      class ss {
        constructor(e) {
          ;(this._el = document.createElement('div')),
            (this._prevCustomClass = null),
            (this._prevCustomColor = null),
            (this._customColor = null),
            (this._size = e.size || 'small'),
            (this._icon = e.icon.spawn()),
            (this._className = e.className.spawn()),
            (this._visible = e.visible.spawn()),
            this._el.classList.add(qt.statusItem, qt[this._size]),
            this._icon.subscribe(this._updateIcon.bind(this), {
              callWithLast: !0,
            }),
            this._className.subscribe(this._updateClassName.bind(this), {
              callWithLast: !0,
            }),
            (this._customColor = e.customColor.spawn()),
            this._customColor.subscribe(this._updateCustomColor.bind(this), {
              callWithLast: !0,
            }),
            e.isBlinking &&
              ((this._isBlinking = e.isBlinking.spawn()),
              this._isBlinking.subscribe(this._updateBlinkingMode.bind(this), {
                callWithLast: !0,
              }),
              (this._turnOffBlinking = e.turnOffBlinking))
        }
        destroy() {
          this._visible.destroy(),
            this._icon.destroy(),
            this._isBlinking && this._isBlinking.destroy()
        }
        onClick() {
          this._turnOffBlinking && this._turnOffBlinking()
        }
        visible() {
          return this._visible
        }
        element() {
          return this._el
        }
        _updateIcon(e) {
          this._el.innerHTML = e || ''
        }
        _updateClassName(e) {
          this._prevCustomClass !== e &&
            (null !== this._prevCustomClass &&
              this._el.classList.remove(this._prevCustomClass),
            null !== e && this._el.classList.add(e),
            (this._prevCustomClass = e))
        }
        _updateCustomColor(e) {
          this._prevCustomColor !== e &&
            (this._el.style.setProperty('--custom-status-color', e),
            (this._prevCustomColor = e))
        }
        _updateBlinkingMode(e) {
          this._el.classList.toggle(qt.blinking, e)
        }
      }
      function ls(e, t, i) {
        for (const s of t)
          for (const t of s.split(' ')) e.classList.toggle(t, i)
      }
      class os {
        constructor(e, t, i, s = qt) {
          ;(this.element = document.createElement('div')),
            (this._blinkingSpawns = []),
            (this._iconsRenderers = []),
            (this._updateIcons = () => {
              const [e, t] = this._iconsRenderers.reduce(
                (e, t) => {
                  const i = t.element()
                  return (
                    t.visible().value() && e[0].length < 3
                      ? e[0].push(i)
                      : e[1].push(i),
                    e
                  )
                },
                [[], []],
              )
              t.forEach((e) => {
                this.element.contains(e) && this.element.removeChild(e)
              }),
                e.forEach((e, t) => {
                  this.element.contains(e) ||
                    (t >= this.element.childElementCount
                      ? this.element.appendChild(e)
                      : this.element.insertBefore(
                          e,
                          this.element.childNodes[t],
                        ))
                })
            }),
            (this._theme = s)
          const l = [
            this._theme.statuses,
            'apply-common-tooltip',
            'common-tooltip-wide',
            this._theme[e],
            this._theme.statuses_hidden,
          ]
          ls(this.element, l, !0),
            (this._tooltips = t.spawn()),
            this._tooltips.subscribe(this._updateTooltip.bind(this)),
            (this._onClickCallback = i.onClick),
            (this._onClickHandler = this._onClick.bind(this)),
            this.element.addEventListener('click', this._onClickHandler)
        }
        destroy() {
          for (const e of this._iconsRenderers) e.destroy()
          for (const e of this._blinkingSpawns) e.destroy()
          this._tooltips.destroy(),
            this.element.removeEventListener('click', this._onClickHandler),
            this.element.remove()
        }
        setVisibility(e) {
          ls(this.element, [this._theme.statuses_hidden], e)
        }
        addStatusModel(e) {
          const t = new ss({
            visible: e.visible,
            icon: e.model.icon(),
            className: e.model.className(),
            size: e.model.size(),
            isBlinking: e.model.isBlinkingMode,
            turnOffBlinking: e.model.turnOffBlinkingMode,
            customColor: e.model.customColor(),
          })
          this._iconsRenderers.push(t)
          const i = e.model.isBlinkingMode.spawn()
          i.subscribe(this._updateBlinkingMode.bind(this)),
            t.visible().subscribe(this._updateIcons, { callWithLast: !0 }),
            this._blinkingSpawns.push(i),
            this._updateBlinkingMode()
        }
        _onClick(e) {
          e.preventDefault()
          const t = this._iconsRenderers.filter((e) => e.visible().value())
          for (const e of t) e.onClick()
          let i = 14
          t.length > 1 && (i -= 2)
          const s = this.element.getBoundingClientRect(),
            l = { x: s.left - i, y: s.bottom + 4 }
          this._onClickCallback(l)
        }
        _updateTooltip() {
          this.element.setAttribute('title', this._tooltips.value().join(' · '))
        }
        _updateBlinkingMode() {
          const e = this._blinkingSpawns.some((e) => e.value())
          ls(this.element, [this._theme.blinking], e)
        }
      }
      class as {
        constructor(e, t) {
          ;(this.isBlinkingMode = new a.WatchedValue(!1)),
            (this._status = new a.WatchedValue(null)),
            (this._size = 'small'),
            (this._fullInfo = new a.WatchedValue(null)),
            (this._className = new a.WatchedValue(qt.marketStatusCustom)),
            (this._symbolModel = null),
            (this._symbol = null),
            (this._tooltip = new a.WatchedValue(null)),
            (this._icon = new a.WatchedValue(null)),
            (this._visible = new a.WatchedValue(!1)),
            (this._color = new a.WatchedValue(null)),
            (this._updateVisibleCallback = this._updateVisible.bind(this)),
            (this._updateColorCallback = this._updateColor.bind(this)),
            (this._updateIconCallback = this._updateIcon.bind(this)),
            (this._updateTooltipCallback = this._updateTooltip.bind(this)),
            (this._updateFullInfoCallback = this._updateFullInfo.bind(this)),
            (this._model = e),
            (this._size = t)
        }
        turnOffBlinkingMode() {}
        destroy() {}
        setModel(e) {
          this._model = e
        }
        setSymbol(e) {
          e !== this._symbol &&
            (this._unSyncModel(),
            (this._symbol = e),
            e
              ? ((this._symbolModel = this._model.getSymbolCustomStatus(e)),
                this._syncModel())
              : (this._symbolModel = null))
        }
        status() {
          return this._status.spawn()
        }
        tooltip() {
          return this._tooltip.spawn()
        }
        icon() {
          return this._icon.spawn()
        }
        className() {
          return this._className.spawn()
        }
        visible() {
          return this._visible.spawn()
        }
        size() {
          return this._size
        }
        fullInfo() {
          return this._fullInfo.spawn()
        }
        customColor() {
          return this._color.spawn()
        }
        _updateFullInfo(e) {
          if (null === e) return void this._fullInfo.setValue(null)
          const t = e.map((e) => {
            var t, i
            return {
              icon:
                null !== (t = e.icon) && void 0 !== t ? t : this.icon().value(),
              iconClassName: [qt.marketStatusCustom],
              title: e.title,
              titleColor:
                null !== (i = e.color) && void 0 !== i
                  ? i
                  : this.customColor().value(),
              html: e.content,
              size: this.size(),
              action: this._buildAction(e.action),
            }
          })
          this._fullInfo.setValue(t)
        }
        _buildAction(e) {
          var t
          return e && e.onClick
            ? {
                text: null !== (t = e.text) && void 0 !== t ? t : '',
                tooltip: e.tooltip,
                onClick: e.onClick,
              }
            : null
        }
        _unSyncModel() {
          this._symbolModel &&
            (this._symbolModel
              .visible()
              .unsubscribe(this._updateVisibleCallback),
            this._symbolModel.color().unsubscribe(this._updateColorCallback),
            this._symbolModel.icon().unsubscribe(this._updateIconCallback),
            this._symbolModel
              .tooltip()
              .unsubscribe(this._updateTooltipCallback),
            this._symbolModel
              .tooltipContent()
              .unsubscribe(this._updateFullInfoCallback))
        }
        _syncModel() {
          var e, t, i, s, l, o, a, n, r, d
          this._visible.setValue(
            null !==
              (t =
                null === (e = this._symbolModel) || void 0 === e
                  ? void 0
                  : e.visible().value()) &&
              void 0 !== t &&
              t,
          ),
            this._color.setValue(
              null !==
                (s =
                  null === (i = this._symbolModel) || void 0 === i
                    ? void 0
                    : i.color().value()) && void 0 !== s
                ? s
                : null,
            ),
            this._icon.setValue(
              null !==
                (o =
                  null === (l = this._symbolModel) || void 0 === l
                    ? void 0
                    : l.icon().value()) && void 0 !== o
                ? o
                : null,
            ),
            this._tooltip.setValue(
              null !==
                (n =
                  null === (a = this._symbolModel) || void 0 === a
                    ? void 0
                    : a.tooltip().value()) && void 0 !== n
                ? n
                : null,
            ),
            this._updateFullInfo(
              null !==
                (d =
                  null === (r = this._symbolModel) || void 0 === r
                    ? void 0
                    : r.tooltipContent().value()) && void 0 !== d
                ? d
                : null,
            ),
            this._symbolModel &&
              (this._symbolModel
                .visible()
                .subscribe(this._updateVisibleCallback),
              this._symbolModel.color().subscribe(this._updateColorCallback),
              this._symbolModel.icon().subscribe(this._updateIconCallback),
              this._symbolModel
                .tooltip()
                .subscribe(this._updateTooltipCallback),
              this._symbolModel
                .tooltipContent()
                .subscribe(this._updateFullInfoCallback))
        }
        _updateVisible(e) {
          this._visible.setValue(e)
        }
        _updateColor(e) {
          this._color.setValue(e)
        }
        _updateIcon(e) {
          this._icon.setValue(e)
        }
        _updateTooltip(e) {
          this._tooltip.setValue(e)
        }
      }
      var ns = i(735897),
        rs = i(553218),
        ds = i(732140),
        us = i(262998),
        hs = i(725230),
        cs = i(315507),
        _s = i(643401),
        ps = i(85290),
        ms = i(212462)
      const gs = N.t(null, void 0, i(383949)),
        vs = N.t(null, void 0, i(356042)),
        bs = N.t(null, void 0, i(429985)),
        ws = N.t(null, void 0, i(895814)),
        Ss = N.t(null, void 0, i(988958)),
        ys = N.t(null, void 0, i(269419)),
        Cs = N.t(null, void 0, i(801653)),
        Ms = N.t(null, void 0, i(540519)),
        fs = N.t(null, void 0, i(957048)),
        Vs = N.t(null, void 0, i(987202)),
        Es = N.t(null, void 0, i(539348)),
        Ls = N.t(null, void 0, i(107827)),
        Ws = N.t(null, void 0, i(19830)),
        Ts = N.t(null, void 0, i(735701)),
        ks = N.t(null, void 0, i(298105)),
        xs = N.t(null, void 0, i(950634)),
        As = N.t(null, void 0, i(574537)),
        Hs = new Map([
          [
            'market',
            new Map([
              ['small', ds],
              ['medium', us],
              ['large', us],
            ]),
          ],
          [
            'pre_market',
            new Map([
              ['small', ps],
              ['medium', ms],
              ['large', ms],
            ]),
          ],
          [
            'post_market',
            new Map([
              ['small', cs],
              ['medium', _s],
              ['large', _s],
            ]),
          ],
          [
            'out_of_session',
            new Map([
              ['small', rs],
              ['medium', rs],
              ['large', rs],
            ]),
          ],
          [
            'holiday',
            new Map([
              ['small', hs],
              ['medium', hs],
              ['large', hs],
            ]),
          ],
        ]),
        Bs = new Map([
          ['market', qt.marketStatusOpen],
          ['pre_market', qt.marketStatusPre],
          ['post_market', qt.marketStatusPost],
          ['out_of_session', qt.marketStatusClose],
          ['holiday', qt.marketStatusHoliday],
        ]),
        Ps = new Map([
          ['market', gs],
          ['pre_market', vs],
          ['post_market', bs],
          ['out_of_session', ws],
          ['holiday', Ss],
        ]),
        Ds = new Map([
          ['market', gs],
          ['pre_market', vs],
          ['post_market', bs],
          ['out_of_session', ws],
          ['holiday', Ss],
        ]),
        Is = new Map([
          ['market', Zt.colorsPalette['color-market-open']],
          ['pre_market', Zt.colorsPalette['color-pre-market']],
          ['post_market', Zt.colorsPalette['color-post-market']],
          ['out_of_session', Zt.colorsPalette['color-market-closed']],
          ['holiday', Zt.colorsPalette['color-market-holiday']],
        ]),
        zs = {
          market: ys,
          pre_market: Cs,
          post_market: Ms,
          out_of_session: fs,
          holiday: Vs,
        }
      function Ns(e) {
        return N.t(
          null,
          { plural: '{number} minutes', count: e },
          i(467151),
        ).format({ number: e.toString() })
      }
      function Os(e) {
        return N.t(
          null,
          { plural: '{number} hours', count: e },
          i(224430),
        ).format({ number: e.toString() })
      }
      function Rs(e) {
        const t = Math.floor(e / 86400),
          s = Math.floor((e - 86400 * t) / 3600),
          l = Math.floor((e - 86400 * t - 3600 * s) / 60)
        return 0 === t && 0 === s && 0 === l
          ? Es
          : t > 0
            ? Ls.format({
                days:
                  ((o = t),
                  N.t(
                    null,
                    { plural: '{number} days', count: o },
                    i(458609),
                  ).format({ number: o.toString() })),
                hours: Os(s),
              })
            : s > 0
              ? Ws.format({ hours: Os(s), minutes: Ns(l) })
              : Ns(l)
        var o
      }
      const Fs = {
          market: (e) =>
            ('post_market' === e.status ? xs : ks).format({
              remainingTime: Rs(e.remainingSeconds),
            }),
          pre_market: (e) =>
            Ts.format({ remainingTime: Rs(e.remainingSeconds) }),
          post_market: (e) =>
            ks.format({ remainingTime: Rs(e.remainingSeconds) }),
          out_of_session: (e) =>
            ('pre_market' === e.status ? As : Ts).format({
              remainingTime: Rs(e.remainingSeconds),
            }),
          holiday: (e) =>
            ('pre_market' === e.status ? As : Ts).format({
              remainingTime: Rs(e.remainingSeconds),
            }),
        },
        Gs = new Map([
          ['market', null],
          ['pre_market', null],
          ['post_market', null],
          ['out_of_session', null],
          ['holiday', null],
        ])
      class Us extends Jt {
        constructor(e, t, i = !1) {
          super({
            tooltipMap: Ps,
            iconMap: Hs,
            classNameMap: Bs,
            titleMap: Ds,
            titleColorMap: Is,
            actionMap: Gs,
            size: t,
          }),
            (this._model = null),
            (this._expiredStatus = null),
            (this._marketStatus = new a.WatchedValue(null).spawn()),
            (this._sessionEdge = new a.WatchedValue(null).spawn()),
            (this._ignoreHideStatusSettings = i),
            this.setModel(e),
            vt.showMarketOpenStatusProperty.subscribe(
              this,
              this._showMarketOpenStatusPropertyChanged,
            )
        }
        destroy() {
          this._marketStatus.destroy(),
            this._sessionEdge.destroy(),
            (this._model = null),
            vt.showMarketOpenStatusProperty.unsubscribeAll(this)
        }
        setModel(e) {
          var t
          if (
            (this._marketStatus.destroy(),
            this._sessionEdge.destroy(),
            null === (t = this._expiredStatus) || void 0 === t || t.destroy(),
            null === e)
          )
            return (
              (this._marketStatus = new a.WatchedValue(null).spawn()),
              (this._sessionEdge = new a.WatchedValue(null).spawn()),
              void (this._expiredStatus = null)
            )
          this._model = e
          const i = e.futuresContractExpirationTime()
          i &&
            ((this._expiredStatus = i.expired().spawn()),
            this._expiredStatus.subscribe((e) => {
              e && this._updateByStatus(this._marketStatus.value())
            })),
            (this._marketStatus = e.status().spawn()),
            this._marketStatus.subscribe(this._updateStatus.bind(this), {
              callWithLast: !0,
            }),
            (this._sessionEdge = e.nextSessionEdge().spawn()),
            this._sessionEdge.subscribe(this._updateTooltip.bind(this)),
            this._updateTooltip()
        }
        async _updateFullTooltip() {
          const e = this.status().value()
          if (null === e) return void this._fullTooltip.setValue(null)
          let t
          if (this._isExpiredFutures()) t = [(0, Qt.htmlEscape)(expiredHtml)]
          else {
            t = [(0, Qt.htmlEscape)(zs[e])]
            const i = this._marketStatus.value()
            if (null !== this._model && null !== i) {
              const i = this._model.nextSessionEdge().value()
              null !== i && t.push({ text: Fs[e](i), bold: !0 })
            }
          }
          this._fullTooltip.setValue([
            {
              icon: this._getIcon(e),
              iconClassName: this._getFullTooltipIconClassNames(e),
              title: this._getTitle(e),
              titleColor: this._getTitleColor(e),
              html: t,
              size: this._size,
              action: this._getAction(e),
            },
          ])
        }
        _shouldBeHiddenByStatus(e) {
          return (
            !this._ignoreHideStatusSettings &&
            !vt.showMarketOpenStatusProperty.value() &&
            'market' === e
          )
        }
        _getTooltip(e) {
          return this._isExpiredFutures()
            ? expiredTooltip
            : super._getTooltip(e)
        }
        _getIcon(e) {
          return this._isExpiredFutures()
            ? expiredIconMap.get(this._size) || null
            : super._getIcon(e)
        }
        _getClassName(e) {
          return this._isExpiredFutures()
            ? expiredClassName
            : super._getClassName(e)
        }
        _getTitle(e) {
          return this._isExpiredFutures() ? expiredTitle : super._getTitle(e)
        }
        _getTitleColor(e) {
          return this._isExpiredFutures()
            ? expiredTitleColor
            : super._getTitleColor(e)
        }
        _isExpiredFutures() {
          var e, t, i
          return (
            null !==
              (i =
                null ===
                  (t =
                    null === (e = this._model) || void 0 === e
                      ? void 0
                      : e.futuresContractExpirationTime()) || void 0 === t
                  ? void 0
                  : t.expired().value()) &&
            void 0 !== i &&
            i
          )
        }
        _updateStatus(e) {
          this._status.setValue(e)
        }
        _updateTooltip() {
          this._updateFullTooltip()
        }
        _showMarketOpenStatusPropertyChanged() {
          this._updateByStatus(this._status.value())
        }
      }
      class js {
        constructor(e, t) {
          var i, s
          ;(this.errorWidgetIsShown = new a.WatchedValue(!1)),
            (this._size = p.trackingModeIsAvailable ? 'medium' : 'small'),
            (this._tooltips = new a.WatchedValue([])),
            (this._visibilitySpawns = []),
            (this._tooltipSpawns = []),
            (this._statusWidgetInfos = []),
            (this._visibility = new a.WatchedValue(!1)),
            (this._renderer = new os(this._size, this._tooltips, {
              onClick: this._handleToggleDropdown.bind(this),
            })),
            (this._symbolInvalidViewModel = null),
            (this._dataSourceErrorStatusViewModel = null),
            (this._marketStatusViewModel = null),
            (this._dataUpdatedModeViewModel = null),
            (this._dataProblemViewModel = null),
            (this._customStatusViewModel = null),
            (this._sessionWidget = null),
            (this._dataSourceHasErrorVisible = null),
            (this._dataSourceErrorCanBeShown = new a.WatchedValue(!1)),
            (this._marketStatusCanBeShown = new a.WatchedValue(!1)),
            (this._dataUpdatedModeCanBeShown = new a.WatchedValue(!1)),
            (this._dataProblemCanBeShown = new a.WatchedValue(!1)),
            (this._isDataProblemCritical = null),
            (this._container = document.createElement('div')),
            (this._menuOpened = !1),
            (this._menuPosition = null),
            (this._handleDropdownMenuClose = () => {
              var e
              ;(this._menuOpened = !1),
                null === (e = this._source.symbol()) ||
                  void 0 === e ||
                  e.unsubscribe(this._handleDropdownMenuClose),
                this._updateDropdownMenu()
            }),
            (this._updateVisibility = (e) => {
              this._visibility.setValue(!e), this._renderer.setVisibility(e)
            }),
            (this._source = e),
            (this._symbol =
              null !==
                (s =
                  null === (i = e.symbol()) || void 0 === i
                    ? void 0
                    : i.spawn()) && void 0 !== s
                ? s
                : null),
            (this._options = t),
            (this._statusProviderHidden = e.hidden().spawn()),
            this._statusProviderHidden.subscribe(this._updateVisibility, {
              callWithLast: !0,
            }),
            this._recreateWidgets(),
            this._symbol &&
              this._symbol.subscribe(
                this._recreateAndUpdateWidgetState.bind(this),
              ),
            this._addSubscriptionForSymbolInvalid(),
            null !== this._dataSourceHasErrorVisible &&
              (this._dataSourceHasErrorVisible.subscribe(
                this._updateStatusWidgetsVisibilities.bind(this),
              ),
              this._dataSourceHasErrorVisible.subscribe(
                this._updateErrorWidgetIsShown.bind(this),
              )),
            this._options.dataProblemEnabled &&
              null !== this._isDataProblemCritical &&
              this._isDataProblemCritical.subscribe(
                this._updateStatusWidgetsVisibilities.bind(this),
              )
          for (const e of this._tooltipSpawns)
            e.subscribe(this._updateTooltips.bind(this))
          for (const e of this._visibilitySpawns)
            e.subscribe(this._updateTooltips.bind(this))
          this._updateErrorWidgetIsShown(),
            this._updateStatusWidgetsVisibilities(),
            this._updateTooltips()
        }
        destroy() {
          var e, t
          this._statusProviderHidden.destroy(),
            this._visibility.unsubscribe(),
            null === (e = this._symbol) || void 0 === e || e.destroy(),
            null === (t = this._isDataProblemCritical) ||
              void 0 === t ||
              t.destroy()
          for (const e of this._tooltipSpawns) e.destroy()
          for (const e of this._visibilitySpawns) e.destroy()
          for (const e of this._statusWidgetInfos) e.model.destroy()
          this._renderer.destroy()
        }
        visibility() {
          return this._visibility.readonly()
        }
        getElement() {
          return this._renderer.element
        }
        updateSource(e) {
          var t, i, s
          this._source !== e &&
            (this._statusProviderHidden.destroy(),
            null === (t = this._symbol) || void 0 === t || t.destroy(),
            (this._source = e),
            (this._symbol =
              null !==
                (s =
                  null === (i = e.symbol()) || void 0 === i
                    ? void 0
                    : i.spawn()) && void 0 !== s
                ? s
                : null),
            (this._statusProviderHidden = e.hidden().spawn()),
            this._statusProviderHidden.subscribe(this._updateVisibility, {
              callWithLast: !0,
            }),
            this._recreateAndUpdateWidgetState())
        }
        _updateStatusWidgetsVisibilities() {
          const e = this._isForceStatusActive()
          this._dataSourceErrorCanBeShown.setValue(!e),
            this._marketStatusCanBeShown.setValue(!e),
            this._dataUpdatedModeCanBeShown.setValue(!e),
            this._dataProblemCanBeShown.setValue(!this._isPrimaryWidgetShown())
        }
        _isPrimaryWidgetShown() {
          var e, t
          return (
            null !==
              (t =
                null === (e = this._source.isSymbolInvalid()) || void 0 === e
                  ? void 0
                  : e.value()) &&
            void 0 !== t &&
            t
          )
        }
        _isForceStatusActive() {
          var e, t
          return (
            this._isPrimaryWidgetShown() ||
            (null !==
              (t =
                null === (e = this._isDataProblemCritical) || void 0 === e
                  ? void 0
                  : e.value()) &&
              void 0 !== t &&
              t)
          )
        }
        _recreateWidgets() {
          var e, t, i, s, l, a, n, r
          if (this._options.sourceStatusesEnabled) {
            const e = this._source.isSymbolInvalid()
            if (null !== e)
              if (null === this._symbolInvalidViewModel) {
                this._symbolInvalidViewModel = new ji(e, {
                  tooltipMap: Ki,
                  iconMap: qi,
                  classNameMap: Ji,
                  titleMap: Yi,
                  titleColorMap: es,
                  htmlMap: ts,
                  actionMap: is,
                  size: this._size,
                })
                const t = this._symbolInvalidViewModel.visible().spawn()
                this._visibilitySpawns.push(t),
                  this._tooltipSpawns.push(
                    this._symbolInvalidViewModel.tooltip().spawn(),
                  )
                const i = { visible: t, model: this._symbolInvalidViewModel }
                this._statusWidgetInfos.push(i),
                  this._renderer.addStatusModel(i)
              } else
                this._symbolInvalidViewModel.updateStatus(e),
                  this._addSubscriptionForSymbolInvalid()
            if (null === this._dataSourceErrorStatusViewModel) {
              ;(this._dataSourceErrorStatusViewModel = new zi(
                this._source,
                this._size,
                this._options.sourceStatuses,
              )),
                (this._dataSourceHasErrorVisible = (0, de.combine)(
                  () =>
                    this._dataSourceErrorCanBeShown.value() &&
                    (0, o.ensureNotNull)(this._dataSourceErrorStatusViewModel)
                      .visible()
                      .value(),
                  this._dataSourceErrorCanBeShown.weakReference(),
                  this._dataSourceErrorStatusViewModel
                    .visible()
                    .weakReference(),
                )),
                this._visibilitySpawns.push(this._dataSourceHasErrorVisible),
                this._tooltipSpawns.push(
                  this._dataSourceErrorStatusViewModel.tooltip().spawn(),
                )
              const e = {
                visible: this._dataSourceHasErrorVisible,
                model: this._dataSourceErrorStatusViewModel,
              }
              this._statusWidgetInfos.push(e), this._renderer.addStatusModel(e)
            } else this._dataSourceErrorStatusViewModel.setSource(this._source)
          }
          if (this._options.marketStatusEnabled) {
            const t = this._source.marketStatusModel()
            if (null === this._marketStatusViewModel) {
              this._marketStatusViewModel = new Us(t, this._size)
              const e = (0, de.combine)(
                () =>
                  this._marketStatusCanBeShown.value() &&
                  (0, o.ensureNotNull)(this._marketStatusViewModel)
                    .visible()
                    .value() &&
                  !(0, gt.isEconomicSymbol)(this._source.symbolInfo().value()),
                this._marketStatusCanBeShown.weakReference(),
                this._marketStatusViewModel.visible().weakReference(),
                this._source.symbolInfo().weakReference(),
              )
              this._visibilitySpawns.push(e),
                this._tooltipSpawns.push(
                  this._marketStatusViewModel.tooltip().spawn(),
                )
              const i = { visible: e, model: this._marketStatusViewModel }
              null !== t &&
                ((this._sessionWidget = new Xt(this._source)),
                (i.additionalWidgets = [this._sessionWidget])),
                this._statusWidgetInfos.push(i),
                this._renderer.addStatusModel(i)
            } else
              this._marketStatusViewModel.setModel(t),
                null === (e = this._sessionWidget) ||
                  void 0 === e ||
                  e.updateSource(this._source)
          }
          if (this._options.dataUpdateModeEnabled) {
            const e = this._source.dataUpdatedModeModel()
            if (null === this._dataUpdatedModeViewModel) {
              const s = {
                ...this._options.dataUpdateMode,
                shouldBeHiddenRegardlessOfStatus:
                  null ===
                    (i =
                      null === (t = this._source.marketStatusModel()) ||
                      void 0 === t
                        ? void 0
                        : t.futuresContractExpirationTime()) || void 0 === i
                    ? void 0
                    : i.expired(),
              }
              this._dataUpdatedModeViewModel = new Ti(e, this._size, s)
              const l = (0, de.combine)(
                () =>
                  this._dataUpdatedModeCanBeShown.value() &&
                  (0, o.ensureNotNull)(this._dataUpdatedModeViewModel)
                    .visible()
                    .value() &&
                  !(0, gt.isEconomicSymbol)(this._source.symbolInfo().value()),
                this._dataUpdatedModeCanBeShown.weakReference(),
                this._dataUpdatedModeViewModel.visible().weakReference(),
                this._source.symbolInfo().weakReference(),
              )
              this._visibilitySpawns.push(l),
                this._tooltipSpawns.push(
                  this._dataUpdatedModeViewModel.tooltip().spawn(),
                )
              const a = { visible: l, model: this._dataUpdatedModeViewModel }
              this._statusWidgetInfos.push(a), this._renderer.addStatusModel(a)
            } else this._dataUpdatedModeViewModel.setModel(e)
          }
          if (this._options.dataProblemEnabled) {
            const e = this._source.dataProblemModel()
            if (null === this._dataProblemViewModel) {
              ;(this._dataProblemViewModel = new Ui(e, this._size)),
                (this._isDataProblemCritical = this._dataProblemViewModel
                  .isDataProblemCritical()
                  .spawn())
              const t = (0, de.combine)(
                () =>
                  this._dataProblemCanBeShown.value() &&
                  (0, o.ensureNotNull)(this._dataProblemViewModel)
                    .visible()
                    .value(),
                this._dataProblemCanBeShown.weakReference(),
                this._dataProblemViewModel.visible().weakReference(),
              )
              this._visibilitySpawns.push(t),
                this._tooltipSpawns.push(
                  this._dataProblemViewModel.tooltip().spawn(),
                )
              const i = { visible: t, model: this._dataProblemViewModel }
              this._statusWidgetInfos.push(i), this._renderer.addStatusModel(i)
            } else this._dataProblemViewModel.setModel(e)
          }
          if (
            null !==
              (a =
                null === (l = (s = this._source).isMainSeries) || void 0 === l
                  ? void 0
                  : l.call(s)) &&
            void 0 !== a &&
            a
          ) {
            const e = ns.CustomStatusModel.getInstance(),
              t =
                null !==
                  (r =
                    null === (n = this._symbol) || void 0 === n
                      ? void 0
                      : n.value()) && void 0 !== r
                  ? r
                  : null
            if (null === this._customStatusViewModel) {
              ;(this._customStatusViewModel = new as(e, this._size)),
                this._customStatusViewModel.setSymbol(t)
              const i = this._customStatusViewModel.visible().spawn(),
                s = { visible: i, model: this._customStatusViewModel }
              this._visibilitySpawns.push(i),
                this._tooltipSpawns.push(
                  this._customStatusViewModel.tooltip().spawn(),
                ),
                this._statusWidgetInfos.push(s),
                this._renderer.addStatusModel(s)
            } else
              this._customStatusViewModel.setModel(e),
                this._customStatusViewModel.setSymbol(t)
          }
        }
        _updateTooltips() {
          const e = []
          for (let t = 0; t < this._tooltipSpawns.length; t++) {
            if (!this._visibilitySpawns[t].value()) continue
            const i = this._tooltipSpawns[t].value()
            null !== i && i.length > 0 && e.push(i)
          }
          this._tooltips.setValue(e)
        }
        _addTooltipSpawn(e) {
          e.subscribe(this._updateTooltips.bind(this)),
            this._tooltipSpawns.push(e)
        }
        _addVisibilitySpawn(e) {
          e.subscribe(this._updateTooltips.bind(this)),
            this._visibilitySpawns.push(e)
        }
        _recreateAndUpdateWidgetState() {
          this._recreateWidgets(),
            this._updateStatusWidgetsVisibilities(),
            this._updateErrorWidgetIsShown(),
            this._updateTooltips()
        }
        _addSubscriptionForSymbolInvalid() {
          const e = this._source.isSymbolInvalid()
          this._options.sourceStatusesEnabled &&
            null !== e &&
            (e.subscribe(this._updateStatusWidgetsVisibilities.bind(this)),
            e.subscribe(this._updateErrorWidgetIsShown.bind(this), {
              callWithLast: !0,
            }))
        }
        _updateErrorWidgetIsShown() {
          var e, t, i, s
          const l =
              null !==
                (t =
                  null === (e = this._source.isSymbolInvalid()) || void 0 === e
                    ? void 0
                    : e.value()) &&
              void 0 !== t &&
              t,
            o =
              null !==
                (s =
                  null === (i = this._dataSourceHasErrorVisible) || void 0 === i
                    ? void 0
                    : i.value()) &&
              void 0 !== s &&
              s
          this.errorWidgetIsShown.setValue(l || o)
        }
        _handleToggleDropdown(e) {
          var t, i
          ;(this._menuPosition = e),
            (this._menuOpened = !this._menuOpened),
            this._menuOpened &&
              (null === (t = this._source.symbol()) ||
                void 0 === t ||
                t.subscribe(this._handleDropdownMenuClose),
              (i = `Open full tooltip for statuses: ${this._tooltips.value().join(', ')}`),
              (0, O.trackEvent)('GUI', "Statuses widget's action", i)),
            this._updateDropdownMenu()
        }
        _updateDropdownMenu() {
          Promise.all([i.e(3842), i.e(5649), i.e(2731), i.e(4811), i.e(8643)])
            .then(i.bind(i, 993135))
            .then((e) => {
              e.render({
                opened: this._menuOpened,
                container: this._container,
                rendererButton: this._renderer.element,
                statusWidgetInfos: this._statusWidgetInfos,
                onClose: this._handleDropdownMenuClose,
                position: (0, o.ensureNotNull)(this._menuPosition),
              })
            })
        }
      }
      class $s extends js {
        constructor(e, t, i) {
          super(e, i),
            (this._isInReplay = new a.WatchedValue(!1).readonly().spawn()),
            (this._isInReplayCanBeShown = null),
            (this._inited = !1),
            (this._halalViewModel = null),
            (this._halalCanBeShown = new a.WatchedValue(!1))
        }
        destroy() {
          super.destroy()
        }
        updateSource(e) {
          super.updateSource(e)
        }
        _updateStatusWidgetsVisibilities() {
          super._updateStatusWidgetsVisibilities()
        }
        _isPrimaryWidgetShown() {
          var e, t
          return (
            super._isPrimaryWidgetShown() ||
            (null !==
              (t =
                null === (e = this._isInReplay) || void 0 === e
                  ? void 0
                  : e.value()) &&
              void 0 !== t &&
              t)
          )
        }
        _crateHalalStatus() {}
        _getHalalVisibilitySpawn() {
          return new a.WatchedValue(!1).readonly().spawn()
        }
      }
      var Xs = i(919577)
      class Zs {
        constructor(e, t) {
          ;(this._hidden = new a.WatchedValue(!1)),
            (this._symbol = null),
            (this._isSymbolInvalid = null),
            (this._symbolInfo = new a.WatchedValue(null).spawn()),
            (this._source = e),
            e.properties().hasChild('symbol') &&
              (this._symbol = (0, te.createWVFromGetterAndSubscription)(
                () => e.properties().symbol.value(),
                e.properties().symbol.listeners(),
              ))
          const i = []
          if ((0, Xs.isStudyLineTool)(e)) i.push(e.onStatusChanged())
          else if ((0, Ge.isStudy)(e) || (0, Ge.isStudyStub)(e))
            i.push(e.onStatusChanged(), e.onIsActualIntervalChange()),
              (this._isSymbolInvalid = (0,
              te.createWVFromGetterAndSubscriptions)(
                () => e.isSymbolInvalid() && e.isActualInterval(),
                i,
              ))
          else {
            ;(0, o.assert)(e === t.mainSeries())
            const s = t.mainSeries()
            i.push(s.onStatusChanged()),
              (this._isSymbolInvalid = (0,
              te.createWVFromGetterAndSubscriptions)(
                () => s.isSymbolInvalid(),
                i,
              )),
              (this._symbolInfo = (0, te.createWVFromGetterAndSubscription)(
                s.symbolInfo.bind(s),
                s.dataEvents().symbolResolved(),
              ))
          }
          this._dataSourceErrorStatus = (0,
          te.createWVFromGetterAndSubscriptions)(
            () => this._source.statusProvider({}).errorStatus(),
            i,
          )
        }
        destroy() {
          var e, t
          null === (e = this._symbol) || void 0 === e || e.destroy(),
            null === (t = this._isSymbolInvalid) || void 0 === t || t.destroy(),
            this._dataSourceErrorStatus.destroy(),
            this._symbolInfo.destroy()
        }
        symbol() {
          return this._symbol
        }
        isSymbolInvalid() {
          return this._isSymbolInvalid
        }
        errorStatus() {
          return this._dataSourceErrorStatus
        }
        symbolInfo() {
          return this._symbolInfo
        }
        hidden() {
          return this._hidden.readonly()
        }
        marketStatusModel() {
          return this._source.marketStatusModel()
        }
        dataProblemModel() {
          return this._source.dataProblemModel()
        }
        dataUpdatedModeModel() {
          return this._source.dataUpdatedModeModel()
        }
        isMainSeries() {
          var e, t, i
          return (
            null !==
              (i =
                null === (t = (e = this._source).isMainSeries) || void 0 === t
                  ? void 0
                  : t.call(e)) &&
            void 0 !== i &&
            i
          )
        }
      }
      class Qs extends Zs {
        constructor(e, t) {
          super(e, t),
            (this._quotesData = new a.WatchedValue(null)),
            (this._forceDisableHiddenState = new a.WatchedValue(!0)),
            (this._forceDisableHiddenStateTimeout = null),
            (this._series = e),
            (this._marketStatus = e.marketStatusModel().status().spawn()),
            this._marketStatus.subscribe(
              (e) => {
                null === e &&
                  (null !== this._forceDisableHiddenStateTimeout &&
                    clearTimeout(this._forceDisableHiddenStateTimeout),
                  this._forceDisableHiddenState.setValue(!1),
                  (this._forceDisableHiddenStateTimeout = setTimeout(() => {
                    ;(this._forceDisableHiddenStateTimeout = null),
                      this._forceDisableHiddenState.setValue(!0)
                  }, 3500)))
              },
              { callWithLast: !0 },
            ),
            (this._dataProblems = this._series
              .dataProblemModel()
              .dataProblems()
              .spawn()),
            this._marketStatus.subscribe(this._updateHiddenValue.bind(this)),
            this._dataProblems.subscribe(this._updateHiddenValue.bind(this)),
            this._forceDisableHiddenState.subscribe(
              this._updateHiddenValue.bind(this),
            ),
            e.onStatusChanged().subscribe(this, this._updateHiddenValue),
            this._updateHiddenValue()
        }
        quotesData() {
          return this._quotesData.readonly().spawn()
        }
        destroy() {
          this._marketStatus.destroy(),
            this._dataProblems.destroy(),
            this._series.onStatusChanged().unsubscribeAll(this),
            null !== this._forceDisableHiddenStateTimeout &&
              clearTimeout(this._forceDisableHiddenStateTimeout),
            super.destroy()
        }
        _updateHiddenValue() {
          const e = this._series.status(),
            t =
              this._forceDisableHiddenState.value() ||
              12 === e ||
              4 === e ||
              (null !== this._marketStatus.value() && 2 !== e && 1 !== e) ||
              this._dataProblems.value().some((e) => 'high' === e.severity)
          this._hidden.setValue(!t)
        }
      }
      var qs = i(554267)
      const Js = {
          readOnlyMode: !1,
          contextMenu: {
            settings: !0,
            mainSeries: !0,
            studies: !0,
            showOpenMarketStatus: !1,
          },
          symbolMarkerEnabled: !1,
          showToggleButton: !0,
          canShowSourceCode: !1,
          statusesWidgets: {
            sourceStatusesEnabled: !1,
            sourceStatuses: { errorSolution: !0 },
            marketStatusEnabled: !1,
            marketStatus: { preMarketSolution: !0, postMarketSolution: !0 },
            dataUpdateModeEnabled: !1,
            dataUpdateMode: { subscriptionFullInfo: !0 },
            dataProblemEnabled: !1,
          },
        },
        Ks =
          (u.enabled('hide_legend_by_default'),
          u.enabled('fundamental_widget')),
        Ys = u.enabled('legend_context_menu'),
        el = 2 * Number.parseInt(S.marginlegendhoriz)
      class tl {
        constructor(e, t, i, s, o, r, d, u) {
          ;(this._mainSeriesViewModel = null),
            (this._dataSourceViewModels = []),
            (this._visibleDataSourceCount = new a.WatchedValue(0)),
            (this._themedColor = new a.WatchedValue('')),
            (this._mainSeriesRowHidden = null),
            (this._dataSourceRowsHidden = []),
            (this._customWidgetsVisibilities = []),
            (this._allLegendHidden = new a.WatchedValue(!1)),
            (this._studiesLegendHidden = new a.WatchedValue(!1)),
            (this._showCollapserWithOneIndicator = new a.WatchedValue(!1)),
            (this._customWidgetsHeights = []),
            (this._onLegendVisibilityToggled = null),
            (this._availableHeight = 0),
            (this._collapsedDataSourcesCount = new a.WatchedValue(0)),
            (this._collapsedDataSourcesTitle = new a.WatchedValue('')),
            (this._mainSeriesStatusWidget = null),
            (this._dataSourcesStatusesWidgets = []),
            (this._statusProviders = new Map()),
            (this._size = null),
            (this._customLegendWidgetsFactoriesMap = new Map()),
            (this._customLegendWidgetsMap = new Map()),
            (this._margin = 0),
            (this._model = e),
            (this._paneWidget = t),
            (this._options = (0, n.merge)((0, n.clone)(Js), d)),
            (this._callbacks = u),
            (this._mainSeriesViewModelsOptions = {
              readOnlyMode: this._options.readOnlyMode,
              symbolMarkerEnabled: this._options.symbolMarkerEnabled,
            }),
            (this._dataSourceViewModelsOptions = {
              ...this._mainSeriesViewModelsOptions,
              canShowSourceCode: this._options.canShowSourceCode,
            }),
            (this._backgroundThemeName = i)
          const h = this._showLegendCalculatedProperty()
          ;(this._isDataSourcesCollapsed = new a.WatchedValue(h.value())),
            h.subscribe(this, () => {
              this._isDataSourcesCollapsed.setValue(h.value())
            })
          const c = new a.WatchedValue(this._getCustomTextColorValue()),
            _ = this._model.model().properties().childs()
          _.scalesProperties.childs().textColor.subscribe(this, () => {
            c.setValue(this._getCustomTextColorValue())
          })
          const p = _.paneProperties
              .childs()
              .legendProperties.childs().showBackground,
            m = new a.WatchedValue(p.value())
          p.subscribe(this, () => {
            m.setValue(p.value())
          })
          const g = _.paneProperties
              .childs()
              .legendProperties.childs().backgroundTransparency,
            v = new a.WatchedValue(g.value())
          g.subscribe(this, () => {
            v.setValue(g.value())
          }),
            (this._hideNotMainSources = s),
            this._hideNotMainSources.subscribe(
              this._updateLegendVisibilities.bind(this),
            ),
            (this._hideAllExceptFirstLine = o),
            this._hideAllExceptFirstLine.subscribe(
              this._updateCollapsedSourcesMode.bind(this),
            ),
            (this._hideWholeLegend = r),
            this._hideWholeLegend.subscribe(
              this._updateLegendVisibilities.bind(this),
            ),
            (this._isPaneMain = new a.WatchedValue(this._getIsPaneMainValue())),
            (this._updateCollapsedSourcesModeThrottle = (0, l.default)(
              this._updateCollapsedSourcesMode.bind(this),
              100,
            )),
            this._isPaneMain.subscribe(
              (e) => this._showCollapserWithOneIndicator.setValue(e),
              { callWithLast: !0 },
            ),
            (this._renderer = new Y(
              {
                withActions: !this._options.readOnlyMode,
                showToggleButton: this._options.showToggleButton,
                isStudiesLegendHidden: this._studiesLegendHidden.readonly(),
                isAllLegendHidden: this._allLegendHidden.readonly(),
                customTextColor: c.readonly(),
                themedColor: this._themedColor.readonly(),
                showBackground: m.readonly(),
                backgroundTransparency: v.readonly(),
                collapsedDataSourcesCount:
                  this._collapsedDataSourcesCount.readonly(),
                collapsedDataSourcesTitle:
                  this._collapsedDataSourcesTitle.readonly(),
                showLegendWidgetContextMenu:
                  this.onShowLegendWidgetContextMenu.bind(this),
                hideAllExceptFirstLine: this._hideAllExceptFirstLine,
              },
              {
                showCollapserWithOneIndicator:
                  this._showCollapserWithOneIndicator.readonly(),
                visibleDataSourceCount: this._visibleDataSourceCount.readonly(),
                isDataSourcesCollapsed: this._isDataSourcesCollapsed.readonly(),
                showObjectsTree: this._isPaneMain.readonly(),
                onCollapseDataSources: this.onCollapseDataSources.bind(this),
                onShowObjectsTreeDialog: this._callbacks.showObjectsTreeDialog,
              },
            ))
        }
        destroy() {
          this._backgroundThemeName.release(),
            this._hideNotMainSources.release(),
            this._hideAllExceptFirstLine.release(),
            this._hideWholeLegend.release(),
            null !== this._mainSeriesViewModel && this._destroyMainDataSource()
          for (const [, e] of this._statusProviders) e.destroy()
          for (const e of this._dataSourceViewModels) e.destroy()
          for (const e of this._dataSourcesStatusesWidgets) e.destroy()
          this._clearSubscriptions()
          for (const e of Array.from(this._customLegendWidgetsMap.keys()))
            this._destroyCustomWidgetFromLayerBlock(e)
          this._customLegendWidgetsMap.clear(),
            this._renderer.destroy(),
            delete this._renderer,
            this._showLegendCalculatedProperty().unsubscribeAll(this),
            this._showLegendOriginalProperty().unsubscribeAll(this)
          const e = this._model.model().properties().childs()
          e.scalesProperties.childs().textColor.unsubscribeAll(this),
            e.paneProperties
              .childs()
              .legendProperties.childs()
              .showBackground.unsubscribeAll(this),
            e.paneProperties
              .childs()
              .legendProperties.childs()
              .backgroundTransparency.unsubscribeAll(this)
        }
        addCustomWidgetToLegend(e, t) {
          const i =
              this._customLegendWidgetsFactoriesMap.get(t.block) || new Map(),
            s = i.get(t.position) || []
          s.push(e),
            i.set(t.position, s),
            this._customLegendWidgetsFactoriesMap.set(t.block, i),
            this.updateLayout(),
            this._updateCustomWidgetModeBySize()
        }
        onShowLegendWidgetContextMenu(e, t) {
          if (this._options.readOnlyMode || !Ys) return Promise.resolve()
          R('Show legend context menu')
          const i = new Map()
          for (const e of Array.from(this._customLegendWidgetsMap.keys())) {
            const t = (0, o.ensureDefined)(this._customLegendWidgetsMap.get(e)),
              s = new Map()
            for (const e of Array.from(t.keys())) {
              const i = (0, o.ensureDefined)(t.get(e)),
                l = s.get(e) || []
              for (const e of i) l.push(...e.contextMenuActions())
              s.set(e, l)
            }
            i.set(e, s)
          }
          return ((e, t, i, s, l, o) => {
            const a = [],
              n = s.get(0)
            if (void 0 !== n) {
              const e = n.get(1)
              void 0 !== e &&
                e.length > 0 &&
                (a.push(...e), a.push(new pt.Separator()))
            }
            const r = e
                .model()
                .properties()
                .childs()
                .paneProperties.childs()
                .legendProperties.childs(),
              d =
                Gt &&
                e
                  .model()
                  .symbolSources()
                  .some((e) => {
                    var t
                    return (
                      void 0 !==
                      (null === (t = e.symbolInfo()) || void 0 === t
                        ? void 0
                        : t.price_source_id)
                    )
                  })
            a.push(
              new pt.Action({
                actionId: 'Chart.Legend.ToggleSymbolVisibility',
                options: {
                  checkable: !0,
                  checked: r.showSeriesTitle.value(),
                  label: At,
                  statName: 'Show Symbol',
                  onExecute: () => yt(e, r.showSeriesTitle, Ct),
                },
              }),
            ),
              t.showOpenMarketStatus &&
                'market' ===
                  e.mainSeries().marketStatusModel().status().value() &&
                !(0, gt.isEconomicSymbol)(e.mainSeries().symbolInfo()) &&
                a.push(
                  new pt.Action({
                    actionId: 'Chart.Legend.ToggleOpenMarketStatusVisibility',
                    options: {
                      checkable: !0,
                      checked: vt.showMarketOpenStatusProperty.value(),
                      label: Ht,
                      statName: 'Show Open market status',
                      onExecute: () =>
                        yt(e, vt.showMarketOpenStatusProperty, Mt),
                    },
                  }),
                ),
              a.push(
                new pt.Action({
                  actionId: 'Chart.Legend.ToggleOhlcValuesVisibility',
                  options: {
                    checkable: !0,
                    checked: r.showSeriesOHLC.value(),
                    label: Bt,
                    statName: 'Show OHLC Values',
                    onExecute: () => yt(e, r.showSeriesOHLC, ft),
                  },
                }),
              )
            const u = 12 !== e.mainSeries().style()
            if (
              (u &&
                !wt.alwaysShowLastPriceAndLastDayChange &&
                a.push(
                  new pt.Action({
                    actionId: 'Chart.Legend.ToggleBarChangeValuesVisibility',
                    options: {
                      checkable: !0,
                      checked: r.showBarChange.value(),
                      label: Dt,
                      statName: 'Show Bar Change Values',
                      onExecute: () => yt(e, r.showBarChange, Et),
                    },
                  }),
                ),
              a.push(
                new pt.Action({
                  actionId: 'Chart.Legend.ToggleVolumeVisibility',
                  options: {
                    checkable: !0,
                    checked: r.showVolume.value(),
                    label: It,
                    statName: 'Show Volume',
                    onExecute: () => yt(e, r.showVolume, kt),
                  },
                }),
              ),
              u &&
                (wt.lastDayChangeAvailable ||
                  wt.alwaysShowLastPriceAndLastDayChange))
            ) {
              const t = wt.alwaysShowLastPriceAndLastDayChange
                ? r.showBarChange
                : r.showLastDayChange
              a.push(
                new pt.Action({
                  actionId: 'Chart.Legend.ToggleLastDayChangeValuesVisibility',
                  options: {
                    checkable: !0,
                    checked: t.value(),
                    label: Pt,
                    statName: 'Last day change values',
                    onExecute: () => yt(e, t, Vt),
                  },
                }),
              )
            }
            if (
              (d &&
                a.push(
                  new pt.Action({
                    actionId: 'Chart.Legend.TogglePriceSourceVisibility',
                    options: {
                      checkable: !0,
                      checked: r.showPriceSource.value(),
                      label: Rt,
                      statName: 'Show Price Source',
                      onExecute: () => yt(e, r.showPriceSource, xt),
                    },
                  }),
                ),
              a.push(new pt.Separator()),
              void 0 !== n)
            ) {
              const e = n.get(0)
              void 0 !== e &&
                e.length > 0 &&
                (a.push(...e), a.push(new pt.Separator()))
            }
            const h = s.get(1)
            if (void 0 !== h) {
              const e = h.get(1)
              void 0 !== e &&
                e.length > 0 &&
                (a.push(...e), a.push(new pt.Separator()))
            }
            if (
              (e
                .model()
                .priceDataSources()
                .some(
                  (e) =>
                    !(0, Xe.isActingAsSymbolSource)(e) && e.showInObjectTree(),
                ) &&
                (a.push(
                  new pt.Action({
                    actionId: 'Chart.Legend.ToggleIndicatorTitlesVisibility',
                    options: {
                      checkable: !0,
                      checked: r.showStudyTitles.value(),
                      label: zt,
                      statName: 'Show Indicator Titles',
                      onExecute: () => yt(e, r.showStudyTitles, Lt),
                    },
                  }),
                ),
                a.push(
                  new pt.Action({
                    actionId: 'Chart.Legend.ToggleIndicatorArgumentsVisibility',
                    options: {
                      checkable: !0,
                      checked: r.showStudyArguments.value(),
                      label: Nt,
                      statName: 'Show Indicator Arguments',
                      onExecute: () => yt(e, r.showStudyArguments, Wt),
                    },
                  }),
                ),
                a.push(
                  new pt.Action({
                    actionId: 'Chart.Legend.ToggleIndicatorValuesVisibility',
                    options: {
                      checkable: !0,
                      checked: r.showStudyValues.value(),
                      label: Ot,
                      statName: 'Show Indicator Values',
                      onExecute: () => yt(e, r.showStudyValues, Tt),
                    },
                  }),
                )),
              void 0 !== h)
            ) {
              const e = h.get(0)
              void 0 !== e &&
                e.length > 0 &&
                (a.push(...e), a.push(new pt.Separator()))
            }
            t.settings &&
              (a[a.length - 1] instanceof pt.Separator ||
                a.push(new pt.Separator()),
              a.push(
                new St.ActionWithStandardIcon({
                  actionId: 'Chart.Dialogs.ShowGeneralSettings.LegendTab',
                  options: {
                    label: Ft,
                    iconId: 'Settings',
                    statName: 'Settings...',
                    onExecute: () => i(Ve.TabNames.legend),
                  },
                }),
              ))
            const c = Ut(l.target, 'entityId'),
              _ = {
                menuName: 'LegendPropertiesContextMenu',
                detail: {
                  type: c ? 'study' : 'series',
                  id: null != c ? c : '_seriesId',
                },
              }
            return mt.ContextMenuManager.showMenu(a, l, void 0, _, o)
          })(
            this._model,
            this._options.contextMenu,
            this._callbacks.showGeneralChartProperties,
            i,
            e,
            t,
          )
        }
        onCollapseDataSources() {
          const e = this._showLegendOriginalProperty()
          e.setValue(!e.value())
        }
        updateLayout() {
          const e = this._paneWidget
              .state()
              .sourcesByGroup()
              .legendViewSources()
              .filter(
                (e) => null !== e.statusView() && e.isDisplayedInLegend(),
              ),
            t = Array.from(this._statusProviders.keys()).filter(
              (t) => !e.includes(t),
            )
          for (const e of t) {
            const t = this._statusProviders.get(e)
            t && (t.destroy(), this._statusProviders.delete(e))
          }
          if (0 === e.length) return
          const i = this._model.mainSeries(),
            s = e.indexOf(i)
          s > -1
            ? (e.splice(s, 1),
              Ks ||
                null !== this._mainSeriesViewModel ||
                ((this._mainSeriesViewModel = new Fe(
                  this._model,
                  i,
                  this._mainSeriesViewModelsOptions,
                  this._callbacks,
                  this._options.contextMenu,
                )),
                (this._mainSeriesStatusWidget = new $s(
                  this._statusSourceAdapter(i),
                  this._model.model(),
                  this._options.statusesWidgets,
                )),
                this._renderer.addMainDataSource(
                  this._mainSeriesViewModel,
                  this._mainSeriesStatusWidget,
                )),
              this._addCustomWidgetForLayerBlock(0))
            : null !== this._mainSeriesViewModel &&
              (this._destroyMainDataSource(),
              this._destroyCustomWidgetFromLayerBlock(0))
          const l = [],
            a = [],
            n = this._dataSourceViewModels.length
          if (0 === n)
            for (let t = e.length - 1; t >= 0; t--) {
              const i = e[t]
              l.push(
                new _t(
                  this._model,
                  i,
                  this._dataSourceViewModelsOptions,
                  this._callbacks,
                  this._options.contextMenu,
                ),
              ),
                a.push(
                  new js(
                    this._statusSourceAdapter(i),
                    this._options.statusesWidgets,
                  ),
                )
            }
          else {
            let t = 0
            for (let i = e.length - 1; i >= 0; i--) {
              const s = e[i]
              this._dataSourceViewModels[t]
                ? (this._dataSourceViewModels[t].updateSource(s),
                  this._dataSourcesStatusesWidgets[t].updateSource(
                    this._statusSourceAdapter(s),
                  ))
                : (l.push(
                    new _t(
                      this._model,
                      s,
                      this._dataSourceViewModelsOptions,
                      this._callbacks,
                      this._options.contextMenu,
                    ),
                  ),
                  a.push(
                    new js(
                      this._statusSourceAdapter(s),
                      this._options.statusesWidgets,
                    ),
                  )),
                t++
            }
            while (this._dataSourceViewModels.length > t)
              (0, o.ensureDefined)(this._dataSourceViewModels.pop()).destroy()
            while (this._dataSourcesStatusesWidgets.length > t)
              (0, o.ensureDefined)(
                this._dataSourcesStatusesWidgets.pop(),
              ).destroy()
          }
          0 !== l.length &&
            (this._renderer.addDataSources(l, a),
            this._dataSourceViewModels.push(...l),
            this._dataSourcesStatusesWidgets.push(...a)),
            n !== this._dataSourceViewModels.length &&
              this._updateCollapsedSourcesMode(),
            this._dataSourceViewModels.length > 0
              ? this._addCustomWidgetForLayerBlock(1)
              : this._destroyCustomWidgetFromLayerBlock(1),
            this._recreateSubscriptions(),
            this._isPaneMain.setValue(this._getIsPaneMainValue()),
            this.update(),
            this._updateWidgetModeByWidth()
        }
        update() {
          null !== this._mainSeriesViewModel &&
            this._mainSeriesViewModel.update()
          for (const e of this._dataSourceViewModels) e.update()
        }
        updateThemedColors(e) {
          null === e &&
            (e = (0, qs.getStdThemedValue)(
              'chartProperties.paneProperties.background',
              this._backgroundThemeName.value(),
            )),
            this._themedColor.setValue(e || '')
        }
        firstTitle() {
          return this._renderer.firstTitle()
        }
        getElement() {
          return this._renderer.getElement()
        }
        addMargin(e) {
          if (this._margin === e) return
          this._margin = e
          ;(this._renderer.getElement().style.maxWidth =
            0 === this._margin ? '' : `calc(100% - ${this._margin + el}px)`),
            this._updateWidgetModeBySize()
        }
        updateWidgetModeBySize(e) {
          ;(this._size = e), this._updateWidgetModeBySize()
        }
        _statusSourceAdapter(e) {
          let t = this._statusProviders.get(e)
          return (
            void 0 === t &&
              ((t =
                e !== this._model.mainSeries()
                  ? new Zs(e, this._model.model())
                  : new Qs(this._model.mainSeries(), this._model.model())),
              this._statusProviders.set(e, t)),
            t
          )
        }
        _updateWidgetModeBySize() {
          this._updateWidgetModeByWidth(),
            this._updateWidgetModeByHeight(),
            this._updateCustomWidgetModeBySize()
        }
        _updateWidgetModeByWidth() {
          if (null === this._size) return
          const e = this._availableWidth()
          this._renderer.updateMode(e),
            this._paneWidget.hasState() &&
              this._paneWidget.state().containsMainSeries() &&
              this._model
                .mainSeries()
                .setTextSourceIsAlwaysTickerRestrictionEnabled(e <= 132)
        }
        _updateWidgetModeByHeight() {
          null !== this._size &&
            ((this._availableHeight = 0.8 * this._size.height),
            this._updateCollapsedSourcesModeThrottle())
        }
        _updateCustomWidgetModeBySize() {
          if (null === this._size) return
          const e = (0, s.size)({
            width: this._availableWidth(),
            height: this._size.height,
          })
          for (const t of Array.from(this._customLegendWidgetsMap.values()))
            for (const i of Array.from(t.values()))
              for (const t of i) t.updateWidgetModeBySize(e)
        }
        _destroyMainDataSource() {
          ;(0, o.ensureNotNull)(this._mainSeriesStatusWidget).destroy(),
            (this._mainSeriesStatusWidget = null),
            (0, o.ensureNotNull)(this._mainSeriesViewModel).destroy(),
            (this._mainSeriesViewModel = null)
        }
        _updateCollapsedSourcesMode() {
          const e = this._dataSourceViewModels.length,
            t = this._hideAllExceptFirstLine.value()
          if (this._availableHeight > 0 && e > 2) {
            const i = Number(this._renderer.getMainSourceHeight()),
              s = this._renderer.getDataSourceHeight(),
              l = this._getCustomWidgetsHeight()
            if (null !== s) {
              const o = Math.floor((this._availableHeight - i - l) / s),
                a = Math.max(o, 2) - 1
              if (e > a + 1) {
                let i = ''
                for (let s = 0; s < e; s++) {
                  const e = s < a
                  this._dataSourceViewModels[s].setGlobalVisibility(
                    e && (!t || 0 === s),
                  ),
                    e ||
                      (i += `${0 === i.length ? '' : ', '}${this._dataSourceViewModels[s].getFullTitle()}`)
                }
                return (
                  this._collapsedDataSourcesTitle.setValue(i),
                  void this._collapsedDataSourcesCount.setValue(e - a)
                )
              }
            }
          }
          for (let e = 0; e < this._dataSourceViewModels.length; ++e)
            this._dataSourceViewModels[e].setGlobalVisibility(!t || 0 === e)
          this._collapsedDataSourcesCount.setValue(0),
            this._collapsedDataSourcesTitle.setValue('')
        }
        _getCustomWidgetsHeight() {
          let e = 0
          for (const t of Array.from(this._customLegendWidgetsMap.values()))
            for (const i of Array.from(t.values()))
              for (const t of i) e += t.height().value()
          return e
        }
        _getCustomTextColorValue() {
          const e = this._model
            .model()
            .properties()
            .childs()
            .scalesProperties.childs()
            .textColor.value()
          return (0, qs.isStdThemedDefaultValue)(
            'chartProperties.scalesProperties.textColor',
            e,
            (0, qs.getCurrentTheme)().name,
          )
            ? null
            : e
        }
        _clearSubscriptions() {
          null !== this._mainSeriesRowHidden &&
            (this._mainSeriesRowHidden.destroy(),
            (this._mainSeriesRowHidden = null))
          for (const e of this._dataSourceRowsHidden) e.destroy()
          this._dataSourceRowsHidden = []
          for (const e of this._customWidgetsVisibilities) e.destroy()
          this._customWidgetsVisibilities = []
          for (const e of this._customWidgetsHeights) e.destroy()
          this._customWidgetsHeights = []
        }
        _recreateSubscriptions() {
          this._clearSubscriptions(),
            null !== this._mainSeriesViewModel &&
              ((this._mainSeriesRowHidden = this._mainSeriesViewModel
                .isRowHidden()
                .spawn()),
              this._mainSeriesRowHidden.subscribe(
                this._updateLegendVisibilities.bind(this),
              ))
          for (const e of this._dataSourceViewModels) {
            const t = e.isRowHidden().spawn()
            this._dataSourceRowsHidden.push(t),
              t.subscribe(this._updateVisibleDataSourceCount.bind(this)),
              t.subscribe(this._updateLegendVisibilities.bind(this))
          }
          for (const e of Array.from(this._customLegendWidgetsMap.values()))
            for (const t of Array.from(e.values()))
              for (const e of t) {
                const t = e.visibility().spawn()
                this._customWidgetsVisibilities.push(t),
                  t.subscribe(this._updateLegendVisibilities.bind(this))
                const i = e.height().spawn()
                this._customWidgetsHeights.push(i),
                  i.subscribe(this._updateCollapsedSourcesMode.bind(this))
              }
          this._updateVisibleDataSourceCount(), this._updateLegendVisibilities()
        }
        _updateLegendVisibilities() {
          if (this._hideWholeLegend.value())
            return void this._allLegendHidden.setValue(!0)
          const e = this._dataSourceRowsHidden.every((e) => e.value()),
            t = this._hideNotMainSources.value() || e
          this._studiesLegendHidden.setValue(t)
          const i =
              null === this._mainSeriesRowHidden ||
              this._mainSeriesRowHidden.value(),
            s = this._customWidgetsVisibilities.some((e) => e.value())
          this._allLegendHidden.setValue(e && i && !s)
        }
        _updateVisibleDataSourceCount() {
          const e = this._dataSourceRowsHidden.filter((e) => !e.value()).length
          this._visibleDataSourceCount.setValue(e)
        }
        _setLegendVisibilityToggled() {
          0
        }
        _getIsPaneMainValue() {
          return this._paneWidget.containsMainSeries()
        }
        _showLegendCalculatedProperty() {
          return this._model.model().showLegend()
        }
        _showLegendOriginalProperty() {
          return this._model
            .model()
            .properties()
            .childs()
            .paneProperties.childs()
            .legendProperties.childs().showLegend
        }
        _addCustomWidgetForLayerBlock(e) {
          const t = this._customLegendWidgetsFactoriesMap.get(e)
          if (void 0 === t) return
          const i = this._customLegendWidgetsMap.get(e) || new Map()
          let s = !1
          for (const l of Array.from(t.keys())) {
            const o = i.get(l) || [],
              a = t.get(l) || []
            for (let t = o.length; t < a.length; t++) {
              const i = a[t](
                this._model.model(),
                this._backgroundThemeName.spawnOwnership(),
              )
              0 === e &&
                0 === l &&
                i.setGlobalVisibility(
                  (0, de.combine)(
                    (e, t) => !e && !t,
                    this._hideNotMainSources.weakReference(),
                    this._hideAllExceptFirstLine.weakReference(),
                  ).ownership(),
                ),
                o.push(i),
                this._renderer.addCustomWidget(i, { block: e, position: l }),
                (s = !0)
            }
            s && i.set(l, o)
          }
          s && this._customLegendWidgetsMap.set(e, i)
        }
        _destroyCustomWidgetFromLayerBlock(e) {
          const t = this._customLegendWidgetsMap.get(e)
          if (void 0 !== t) {
            for (const e of Array.from(t.values()))
              for (const t of e) t.destroy()
            t.clear(), this._customLegendWidgetsMap.delete(e)
          }
        }
        _availableWidth() {
          return null === this._size ? 0 : this._size.width - this._margin - el
        }
      }
    },
    851237: (e, t, i) => {
      i.d(t, { reactLoaderRendererCreator: () => a })
      var s = i(265742),
        l = i(50959),
        o = i(707488)
      function a(e, t) {
        return (i, a) =>
          ((e, t, i, a) => {
            const n = document.createElement('span'),
              r = (0, s.createRoot)(n)
            function d(e) {
              n.classList.toggle(o.blockHidden, !e)
            }
            d(!1)
            const { className: u } = null != a ? a : {}
            return (
              u && n.classList.add(u),
              r.render((0, l.createElement)(t, i)),
              e.appendChild(n),
              {
                toggleVisibility: d,
                destroy: () => {
                  r.unmount()
                },
              }
            )
          })(i, e, t, a)
      }
    },
    462892: (e, t, i) => {
      i.d(t, { createPointsLoaderRenderer: () => l })
      var s = i(234404)
      const l = (0, i(851237).reactLoaderRendererCreator)(s.Loader, {
        staticPosition: !0,
        size: 'small',
      })
    },
    576658: (e, t, i) => {
      i.r(t), i.d(t, { PaneControlsWidget: () => J })
      var s = i(972535),
        l = i(32133),
        o = i(609838),
        a = i(180185),
        n = i(337951),
        r = i(593194),
        d = i(650151),
        u = i(724377),
        h = i(521744),
        c = i(714337),
        _ = i(892932),
        p = i(694815),
        m = i(707488)
      class g {
        constructor(e, t, i) {
          ;(this._parentEl = document.createElement('div')),
            (this._listActionsWrapperEl = null),
            (this._listActionsElements = {}),
            (this._actionsSpawns = {}),
            (this._onMouseEnterLeaveEventHandler = null),
            (this._mouseOverWidget = !1),
            (this._wrapEl = e),
            (this._onMouseEnterLeaveEventHandler =
              this._onMouseEnterLeaveEvent.bind(this)),
            this._wrapEl.addEventListener(
              'mouseenter',
              this._onMouseEnterLeaveEventHandler,
            ),
            this._wrapEl.addEventListener(
              'mouseleave',
              this._onMouseEnterLeaveEventHandler,
            ),
            (this._actions = t),
            (this._globalVisibility = i.globalVisibility.spawn()),
            this._globalVisibility.subscribe(
              this._updatePaneControlsWidgetVisibility.bind(this),
            ),
            (this._visibilityType = i.visibilityType.spawn()),
            this._visibilityType.subscribe(
              this._updatePaneControlsWidgetVisibility.bind(this),
            ),
            (this._doNotSwitchToContextMenuMode =
              i.doNotSwitchToContextMenuMode),
            (this._themedColor = i.themedColor.spawn()),
            this._themedColor.subscribe(this._updateThemedColor.bind(this))
          for (const [e, t] of Object.entries(this._actions)) {
            const i = e
            ;(this._actionsSpawns[i] = {
              visible: t.visible.spawn(),
              title: void 0 === t.title ? null : t.title.spawn(),
            }),
              this._actionsSpawns[i].visible.subscribe(
                this._updateActionVisibilities.bind(this, i),
              )
            const s = this._actionsSpawns[i].title
            null !== s && s.subscribe(this._updateActionTitle.bind(this, i))
          }
          this._render(),
            this._updatePaneControlsWidgetVisibility(),
            this._updateThemedColor(this._themedColor.value()),
            this._parentEl.classList.toggle(
              p.touchMode,
              h.trackingModeIsAvailable,
            ),
            this._parentEl.addEventListener('contextmenu', (e) =>
              e.preventDefault(),
            ),
            _.PLATFORM_ACCESSIBILITY_ENABLED &&
              this._parentEl.setAttribute('aria-hidden', 'true')
        }
        destroy() {
          this._visibilityType.destroy(), this._themedColor.destroy()
          for (const e of Object.keys(this._actionsSpawns)) {
            const t = e
            this._actionsSpawns[t].visible.destroy()
            const i = this._actionsSpawns[t].title
            null !== i && i.destroy()
          }
          null !== this._onMouseEnterLeaveEventHandler &&
            (this._wrapEl.removeEventListener(
              'mouseenter',
              this._onMouseEnterLeaveEventHandler,
            ),
            this._wrapEl.removeEventListener(
              'mouseleave',
              this._onMouseEnterLeaveEventHandler,
            ),
            (this._onMouseEnterLeaveEventHandler = null)),
            (this._parentEl.innerHTML = ''),
            delete this._parentEl
        }
        getElement() {
          return this._parentEl
        }
        bottomWithMargin() {
          const e = this._parentEl.classList.contains(p.touchMode)
            ? Number(p.css_value_pane_controls_button_touch_size)
            : Number(p.css_value_pane_controls_button_size)
          return 2 * Number(p.css_value_pane_controls_margin_top) + e
        }
        updateWidgetModeByWidth(e) {
          const t = !this._doNotSwitchToContextMenuMode.value() && e < 356,
            i = !this._doNotSwitchToContextMenuMode.value() && e < 666.65,
            s = (0, d.ensureNotNull)(this._listActionsWrapperEl),
            l = (0, d.ensureNotNull)(this._listActionsElements.more)
          s.classList.toggle(m.blockHidden, t || i),
            l.classList.toggle(
              m.blockHidden,
              t || !i || !this._actions.more.visible.value(),
            )
        }
        _render() {
          this._renderActions(),
            this._parentEl.classList.add(p.paneControls),
            this._wrapEl.append(this._parentEl)
        }
        _renderActions() {
          null === this._listActionsWrapperEl &&
            ((this._listActionsWrapperEl = document.createElement('div')),
            this._listActionsWrapperEl.classList.add(p.buttonsWrapper),
            this._parentEl.append(this._listActionsWrapperEl))
          const e = h.trackingModeIsAvailable ? 'large' : 'small'
          ;(this._listActionsElements.up = (0, c.createActionElement)(
            this._actions.up,
            p.button,
            p.buttonIcon,
            m.blockHidden,
            e,
          )),
            (this._listActionsElements.down = (0, c.createActionElement)(
              this._actions.down,
              p.button,
              p.buttonIcon,
              m.blockHidden,
              e,
            )),
            (this._listActionsElements.collapse = (0, c.createActionElement)(
              this._actions.collapse,
              p.button,
              p.buttonIcon,
              m.blockHidden,
              e,
            )),
            (this._listActionsElements.restore = (0, c.createActionElement)(
              this._actions.restore,
              p.button,
              p.buttonIcon,
              m.blockHidden,
              e,
            )),
            (this._listActionsElements.close = (0, c.createActionElement)(
              this._actions.close,
              p.button,
              p.buttonIcon,
              m.blockHidden,
              e,
            )),
            (this._listActionsElements.maximize = (0, c.createActionElement)(
              this._actions.maximize,
              p.button,
              p.buttonIcon,
              m.blockHidden,
              e,
            )),
            (this._listActionsElements.minimize = (0, c.createActionElement)(
              this._actions.minimize,
              p.button,
              p.buttonIcon,
              m.blockHidden,
              e,
            )),
            this._listActionsWrapperEl.append(
              this._listActionsElements.up,
              this._listActionsElements.down,
              this._listActionsElements.close,
              this._listActionsElements.collapse,
              this._listActionsElements.restore,
              this._listActionsElements.maximize,
              this._listActionsElements.minimize,
            ),
            (this._listActionsElements.more = (0, c.createActionElement)(
              this._actions.more,
              p.button,
              p.buttonIcon,
              m.blockHidden,
              e,
            ))
          for (const e of Object.keys(this._listActionsElements))
            (0, d.ensureNotNull)(this._listActionsElements[e]).classList.add(
              p.newButton,
            )
          this._parentEl.append(this._listActionsElements.more)
        }
        _updateActionVisibilities(e, t) {
          ;(0, d.ensureNotNull)(this._listActionsElements[e]).classList.toggle(
            m.blockHidden,
            !t,
          )
        }
        _updateActionTitle(e, t) {
          ;(0, d.ensureNotNull)(this._listActionsElements[e]).setAttribute(
            'title',
            t,
          )
        }
        _onMouseEnterLeaveEvent(e) {
          ;(this._mouseOverWidget = 'mouseenter' === e.type),
            'visibleOnMouseOver' === this._visibilityType.value() &&
              this._updatePaneControlsWidgetVisibility()
        }
        _updatePaneControlsWidgetVisibility() {
          let e,
            t = !1
          switch (this._visibilityType.value()) {
            case 'alwaysOff':
              ;(e = !1), (t = !0)
              break
            case 'alwaysOn':
              e = this._globalVisibility.value()
              break
            case 'visibleOnMouseOver':
              e = this._globalVisibility.value() && this._mouseOverWidget
          }
          this._parentEl.classList.toggle(p.hidden, !e),
            this._parentEl.classList.toggle(
              p.forceHidden,
              !this._globalVisibility.value() || t,
            )
        }
        _updateThemedColor(e) {
          if (e.length > 0) {
            const [t, i, s] = (0, u.parseRgb)(e)
            this._parentEl.style.color = (0, u.rgbaToString)([
              t,
              i,
              s,
              (0, u.normalizeAlphaComponent)(0.8),
            ])
          } else this._parentEl.style.removeProperty('color')
        }
      }
      var v = i(973602),
        b = i(462056),
        w = i(636016),
        S = i(472899),
        y = i(648344),
        C = i(99539),
        M = i(520465),
        f = i(334763)
      const V = o.t(null, void 0, i(68854)),
        E = V,
        L = (0, a.humanReadableModifiers)(a.Modifiers.Mod) + V
      var W = i(650802),
        T = i(554267),
        k = i(725784),
        x = i(572237),
        A = i(981020),
        H = i(203515),
        B = i(279526),
        P = i(682847),
        D = i(907859),
        I = i(970471),
        z = i(671402),
        N = i(142930)
      const O = s.mobiletouch,
        R = o.t(null, void 0, i(683498)),
        F = o.t(null, void 0, i(370343)),
        G = o.t(null, void 0, i(939899)),
        U = o.t(null, void 0, i(819603)),
        j = o.t(null, void 0, i(491029)),
        $ = o.t(null, void 0, i(39589)),
        X = o.t(null, void 0, i(335732)),
        Z = o.t(null, void 0, i(68854)),
        Q = (0, k.hotKeySerialize)({ keys: [''], text: Z }),
        q = (0, k.hotKeySerialize)({
          keys: [(0, a.humanReadableModifiers)(a.Modifiers.Mod, !1)],
          text: `{0} + ${Z}`,
        })
      class J {
        constructor(e, t, i, s, l) {
          ;(this._actions = {}),
            (this._moreCMShown = !1),
            (this._themedColor = new W.WatchedValue('')),
            (this._model = e),
            (this._paneWidget = t),
            (this._callbacks = s),
            (this._closeButtonVisibility = new W.WatchedValue(
              this._getCloseButtonVisibility(),
            )),
            (this._upButtonVisibility = new W.WatchedValue(
              this._getUpButtonVisibility(),
            )),
            (this._downButtonVisibility = new W.WatchedValue(
              this._getDownButtonVisibility(),
            )),
            (this._maximizeButtonVisibility = new W.WatchedValue(
              this._getMaximizeButtonVisibility(),
            )),
            (this._minimizeButtonVisibility = new W.WatchedValue(
              this._getMinimizeButtonVisibility(),
            )),
            (this._collapseButtonVisibility = new W.WatchedValue(
              this._getCollapseButtonVisibility(),
            )),
            (this._restoreButtonVisibility = new W.WatchedValue(
              this._getRestoreButtonVisibility(),
            )),
            this._createActions(),
            (this._visibilityTypeProperty = (0, n.actualBehavior)()),
            this._visibilityTypeProperty.subscribe(this, (e) => {
              this._visibilityType.setValue(e.value())
            }),
            (this._visibilityType = new W.WatchedValue(
              this._visibilityTypeProperty.value(),
            )),
            (this._isPaneMaximize = new W.WatchedValue(
              this._getIsPaneMaximizeValue(),
            )),
            (this._isWidgetShow = new W.WatchedValue(this._getIsWidgetShow())),
            (this._backgroundThemeName = i.backgroundThemeName),
            (this._renderer = new g(l, this._actions, {
              visibilityType: this._visibilityType.readonly(),
              globalVisibility: this._isWidgetShow.readonly(),
              doNotSwitchToContextMenuMode: this._isPaneMaximize.readonly(),
              themedColor: this._themedColor.readonly(),
            }))
        }
        destroy() {
          this._visibilityTypeProperty.unsubscribeAll(this),
            this._renderer.destroy()
        }
        getElement() {
          return this._renderer.getElement()
        }
        bottomWithMargin() {
          return this._renderer.bottomWithMargin()
        }
        action() {
          return this._actions
        }
        update() {
          this._updateButtonsVisibility(),
            this._isPaneMaximize.setValue(this._getIsPaneMaximizeValue()),
            this._isWidgetShow.setValue(this._getIsWidgetShow())
        }
        updateWidgetModeByWidth(e) {
          this._renderer.updateWidgetModeByWidth(e)
        }
        updateThemedColors(e) {
          null === e &&
            (e = (0, T.getStdThemedValue)(
              'chartProperties.paneProperties.background',
              this._backgroundThemeName.value(),
            )),
            this._themedColor.setValue(e || '')
        }
        _updateButtonsVisibility() {
          this._closeButtonVisibility.setValue(
            this._getCloseButtonVisibility(),
          ),
            this._upButtonVisibility.setValue(this._getUpButtonVisibility()),
            this._downButtonVisibility.setValue(
              this._getDownButtonVisibility(),
            ),
            this._maximizeButtonVisibility.setValue(
              this._getMaximizeButtonVisibility(),
            ),
            this._minimizeButtonVisibility.setValue(
              this._getMinimizeButtonVisibility(),
            ),
            this._collapseButtonVisibility.setValue(
              this._getCollapseButtonVisibility(),
            ),
            this._restoreButtonVisibility.setValue(
              this._getRestoreButtonVisibility(),
            )
        }
        _createActions() {
          ;(this._actions.up = {
            iconMap: new Map([
              ['large', A],
              ['small', A],
            ]),
            action: this._onUpDownButton.bind(this, 'up'),
            visible: this._upButtonVisibility,
            title: new W.WatchedValue(F),
            className: p.up,
            dataset: { name: 'pane-button-up' },
          }),
            (this._actions.down = {
              iconMap: new Map([
                ['large', H],
                ['small', H],
              ]),
              action: this._onUpDownButton.bind(this, 'down'),
              visible: this._downButtonVisibility,
              title: new W.WatchedValue(G),
              className: p.down,
              dataset: { name: 'pane-button-down' },
            }),
            (this._actions.close = {
              iconMap: new Map([
                ['large', x],
                ['small', x],
              ]),
              action: this._onCloseButton.bind(this),
              visible: this._closeButtonVisibility,
              title: new W.WatchedValue(R),
              dataset: { name: 'pane-button-close' },
            }),
            (this._actions.maximize = {
              iconMap: new Map([
                ['large', D],
                ['small', B],
              ]),
              action: this._onToggleMaximizeButton.bind(this, 'Maximize pane'),
              visible: this._maximizeButtonVisibility,
              title: new W.WatchedValue(U),
              hotKeyTitle: Q,
              className: p.maximize,
              dataset: { name: 'pane-button-maximize' },
            }),
            (this._actions.minimize = {
              iconMap: new Map([
                ['large', D],
                ['small', B],
              ]),
              action: this._onToggleMaximizeButton.bind(this, 'Minimize pane'),
              visible: this._minimizeButtonVisibility,
              title: new W.WatchedValue(j),
              hotKeyTitle: Q,
              className: p.minimize,
              dataset: { name: 'pane-button-minimize' },
            }),
            (this._actions.collapse = {
              iconMap: new Map([
                ['large', z],
                ['small', z],
              ]),
              action: this._onToggleCollapseButton.bind(this, 'Collapse pane'),
              visible: this._collapseButtonVisibility,
              title: new W.WatchedValue($),
              hotKeyTitle: q,
              className: p.collapse,
              dataset: { name: 'pane-button-collapse' },
            }),
            (this._actions.restore = {
              iconMap: new Map([
                ['large', N],
                ['small', N],
              ]),
              action: this._onToggleCollapseButton.bind(this, 'Restore pane'),
              visible: this._restoreButtonVisibility,
              title: new W.WatchedValue(j),
              hotKeyTitle: q,
              className: p.restore,
              dataset: { name: 'pane-button-restore' },
            }),
            (this._actions.more = {
              iconMap: new Map([
                ['large', I],
                ['small', P],
              ]),
              action: this._showButtonsInContextMenu.bind(this),
              visible: new W.WatchedValue(!O),
              title: new W.WatchedValue(X),
              dataset: { name: 'pane-button-more' },
            })
        }
        _getCloseButtonVisibility() {
          const e = this._paneWidget.state()
          let t = !1
          return (
            e.containsMainSeries() ||
              e.maximized().value() ||
              O ||
              (t = e.dataSources().some((e) => (0, r.isStudy)(e))),
            t
          )
        }
        _onCloseButton() {
          this._trackEvent('Delete pane')
          const e = this._model
            .model()
            .panes()
            .indexOf(this._paneWidget.state())
          this._model.removePane(e)
        }
        _getUpButtonVisibility() {
          const e = this._paneWidget.state()
          return (
            this._model.model().panes().indexOf(e) > 0 &&
            !e.maximized().value() &&
            !O
          )
        }
        _getDownButtonVisibility() {
          const e = this._paneWidget.state(),
            t = this._model.model().panes()
          return t.indexOf(e) < t.length - 1 && !e.maximized().value() && !O
        }
        _onUpDownButton(e) {
          this._trackEvent(`Move pane ${e}`)
          const t = this._model
            .model()
            .panes()
            .indexOf(this._paneWidget.state())
          this._model.rearrangePanes(t, e)
        }
        _getMaximizeButtonVisibility() {
          const e = this._paneWidget.state()
          return (
            this._model.model().panes().length > 1 &&
            !e.maximized().value() &&
            !O
          )
        }
        _getMinimizeButtonVisibility() {
          const e = this._paneWidget.state()
          return this._model.model().panes().length > 1 && e.maximized().value()
        }
        _getCollapseButtonVisibility() {
          if (O) return !1
          const e = this._paneWidget.state()
          return (
            !e.maximized().value() &&
            !e.collapsed().value() &&
            this._model.model().paneCollapsingAvailable().value()
          )
        }
        _getRestoreButtonVisibility() {
          const e = this._paneWidget.state()
          return !e.maximized().value() && e.collapsed().value()
        }
        _onToggleMaximizeButton(e) {
          this._trackEvent(e),
            this._callbacks.toggleMaximizePane(this._paneWidget)
        }
        _onToggleCollapseButton(e) {
          this._trackEvent(e),
            this._model.toggleCollapsedPane(this._paneWidget.state())
        }
        _showButtonsInContextMenu(e) {
          e.preventDefault(),
            this._moreCMShown ||
              ((e, t, i) => {
                const s = []
                if (e.maximize.visible.value()) {
                  const t = (0, d.ensure)(e.maximize.title),
                    i = (0, d.ensureNotNull)(e.maximize.action)
                  s.push(
                    new v.Action({
                      actionId: 'Chart.PaneControls.MaximizePane',
                      options: {
                        icon: C,
                        label: t.value(),
                        statName: 'Maximize Pane',
                        shortcutHint: E,
                        onExecute: () => i(),
                      },
                    }),
                  )
                } else if (e.minimize.visible.value()) {
                  const t = (0, d.ensure)(e.minimize.title),
                    i = (0, d.ensureNotNull)(e.minimize.action)
                  s.push(
                    new v.Action({
                      actionId: 'Chart.PaneControls.MinimizePane',
                      options: {
                        icon: C,
                        label: t.value(),
                        statName: 'Minimize Pane',
                        shortcutHint: E,
                        onExecute: () => i(),
                      },
                    }),
                  )
                }
                if (e.collapse.visible.value()) {
                  const t = (0, d.ensure)(e.collapse.title),
                    i = (0, d.ensureNotNull)(e.collapse.action)
                  s.push(
                    new v.Action({
                      actionId: 'Chart.PaneControls.CollapsePane',
                      options: {
                        icon: M,
                        label: t.value(),
                        statName: 'Collapse pane',
                        shortcutHint: L,
                        onExecute: () => i(),
                      },
                    }),
                  )
                }
                if (e.restore.visible.value()) {
                  const t = (0, d.ensure)(e.restore.title),
                    i = (0, d.ensureNotNull)(e.restore.action)
                  s.push(
                    new v.Action({
                      actionId: 'Chart.PaneControls.RestorePane',
                      options: {
                        icon: f,
                        label: t.value(),
                        statName: 'Restore pane',
                        shortcutHint: L,
                        onExecute: () => i(),
                      },
                    }),
                  )
                }
                if (e.up.visible.value()) {
                  const t = (0, d.ensure)(e.up.title),
                    i = (0, d.ensureNotNull)(e.up.action)
                  s.push(
                    new v.Action({
                      actionId: 'Chart.PaneControls.MovePaneUp',
                      options: {
                        icon: S,
                        label: t.value(),
                        statName: 'Move pane up',
                        onExecute: () => i(),
                      },
                    }),
                  )
                }
                if (e.down.visible.value()) {
                  const t = (0, d.ensure)(e.down.title),
                    i = (0, d.ensureNotNull)(e.down.action)
                  s.push(
                    new v.Action({
                      actionId: 'Chart.PaneControls.MovePaneDown',
                      options: {
                        icon: y,
                        label: t.value(),
                        statName: 'Move pane down',
                        onExecute: () => i(),
                      },
                    }),
                  )
                }
                if (e.close.visible.value()) {
                  const t = (0, d.ensure)(e.close.title),
                    i = (0, d.ensureNotNull)(e.close.action)
                  s.push(
                    new v.Action({
                      actionId: 'Chart.PaneControls.DeletePane',
                      options: {
                        icon: w,
                        label: t.value(),
                        statName: 'Delete pane',
                        onExecute: () => i(),
                      },
                    }),
                  )
                }
                const l = (0, d.ensureNotNull)(t.target).getBoundingClientRect()
                return b.ContextMenuManager.showMenu(
                  s,
                  {
                    clientX: l.right,
                    clientY: l.top + l.height + 3,
                    attachToXBy: 'right',
                  },
                  void 0,
                  void 0,
                  i,
                )
              })(this._actions, e, () => {
                this._moreCMShown = !1
              }).then(() => {
                this._moreCMShown = !0
              })
        }
        _getIsPaneMaximizeValue() {
          return this._paneWidget.state().maximized().value()
        }
        _getIsWidgetShow() {
          return this._model.model().panes().length > 1
        }
        _trackEvent(e) {
          ;(0, l.trackEvent)('GUI', 'Pane action', e)
        }
      }
    },
    714337: (e, t, i) => {
      i.d(t, { createActionElement: () => l })
      var s = i(372605)
      function l(e, t, i, l, o) {
        const a = document.createElement('div')
        ;(a.className = t),
          a.classList.toggle(l, !e.visible.value()),
          Object.assign(a.dataset, e.dataset),
          void 0 !== e.className && a.classList.add(e.className),
          void 0 !== e.title &&
            (a.classList.add('apply-common-tooltip'),
            a.setAttribute('title', e.title.value()),
            void 0 !== e.hotKeyTitle &&
              (a.dataset.tooltipHotkey = e.hotKeyTitle)),
          a.addEventListener('touchend', e.action),
          a.addEventListener('mousedown', (t) => {
            0 === t.button && e.action(t)
          })
        const n = document.createElement('div')
        n.classList.add(i)
        const r = e.iconMap.get(o) || ''
        return (
          (0, s.isString)(r) ? (n.innerHTML = r) : n.appendChild(r),
          a.appendChild(n),
          a
        )
      }
    },
    521744: (e, t, i) => {
      i.d(t, { trackingModeIsAvailable: () => s })
      const s = i(601227).CheckMobile.any()
    },
    689612: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M7.83 3.92 12.28 9l-4.45 5.08-1.13-1L10.29 9l-3.6-4.09 1.14-.99Z"/></svg>'
    },
    23317: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M14 10H4V8.5h10V10Z"/></svg>'
    },
    577576: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M8.25 13.75v-9.5h1.5v9.5h-1.5Z"/><path fill="currentColor" d="M13.75 9.75h-9.5v-1.5h9.5v1.5Z"/></svg>'
    },
    691986: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M14.5 8V3.5H10V2h6v6h-1.5Zm-11 2v4.5H8V16H2v-6h1.5Z"/></svg>'
    },
    776996: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M11.5 2v4.5H16V8h-6V2h1.5Zm-5 14v-4.5H2V10h6v6H6.5Z"/></svg>'
    },
    678529: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M7.45 3.5 12.48 9l-5.03 5.49 1.1 1.01L14.52 9 8.55 2.49 7.45 3.5Z"/><path fill="currentColor" d="m3.93 5.99 2.58 3-2.58 3.02 1.14.98 3.42-4-3.42-3.98L3.93 6Z"/></svg>'
    },
    593724: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M10 6.38V8L6 5.5 10 3v1.85A5.25 5.25 0 1 1 3.75 10a.75.75 0 0 1 1.5 0A3.75 3.75 0 1 0 10 6.38Z"/></svg>'
    },
    79304: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M9 2.5c-1.06 0-1.88.93-1.75 1.98l.63 5.03a1.13 1.13 0 0 0 2.25 0l.62-5.03A1.77 1.77 0 0 0 9 2.5zm0 10a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>'
    },
    838373: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M9 4c-.79 0-1.38.7-1.25 1.48l.67 4.03a.59.59 0 0 0 1.16 0l.67-4.03A1.27 1.27 0 0 0 9 4zm0 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>'
    },
    645503: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M13.5 4.5l-9 9M4.5 4.5l9 9"/></svg>'
    },
    73710: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path stroke="currentColor" stroke-linecap="round" stroke-width="1.7" d="M12.5 5.5l-7 7m0-7l7 7"/></svg>'
    },
    931233: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M7.57 14.8H5.03V3.36c1.62-.05 2.64-.08 3.06-.08 1.66 0 2.98.49 3.96 1.47a5.23 5.23 0 0 1 1.47 3.88c0 4.11-1.99 6.17-5.95 6.17zm-.5-9.66v7.8c.32.04.67.06 1.05.06 1.03 0 1.83-.38 2.41-1.12.58-.75.88-1.79.88-3.13 0-2.44-1.14-3.67-3.42-3.67-.22 0-.53.02-.93.06z"/></svg>'
    },
    512646: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M7.84 13.7H5.78V4.4l2.48-.06c1.35 0 2.42.4 3.22 1.2.8.78 1.19 1.83 1.19 3.15 0 3.34-1.61 5.01-4.83 5.01zm-.41-7.85v6.35c.26.02.55.03.86.03.83 0 1.48-.3 1.95-.9.48-.6.72-1.46.72-2.54 0-2-.93-2.99-2.78-2.99-.18 0-.43.02-.75.05z"/></svg>'
    },
    469410: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M7.65 5.16v2.68h3.78v1.73H7.65V13h5.19v1.8H5.62V3.35h7.3v1.8H7.65z"/></svg>'
    },
    55593: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M7.9 5.87v2.17h3.07v1.4H7.9v2.8h4.22v1.46H6.25V4.4h5.94v1.47H7.9z"/></svg>'
    },
    323683: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M7.2 7.34c0-1.4.73-2.64 1.82-3.34A5.03 5.03 0 0 0 4 9c0 2.76 2.26 5 5.05 5A5.04 5.04 0 0 0 14 10c-.71.8-1.74 1.29-2.89 1.29A3.93 3.93 0 0 1 7.2 7.34Z"/><path fill="currentColor" d="M11.67 6.33 11 5l-.67 1.33-1.33.2.98 1.03L9.76 9 11 8.34l1.24.66-.22-1.44.98-1.03-1.33-.2Z"/></svg>'
    },
    672844: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M11 11.39c0-2.27 1.19-4.25 3-5.39-4.43.07-8 3.63-8 8 0 4.42 3.64 8 8.13 8A8.1 8.1 0 0 0 22 16a6.55 6.55 0 0 1-11-4.61Z"/><path fill="currentColor" d="m18 10-1-2-1 2-2 .3 1.47 1.54-.32 2.16L17 13l1.85 1-.32-2.16L20 10.29 18 10Z"/></svg>'
    },
    553218: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><rect width="10" height="4" fill="currentColor" rx="2" x="4" y="7"/></svg>'
    },
    262998: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><circle fill="currentColor" cx="9" cy="9" r="5"/></svg>'
    },
    732140: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><circle fill="currentColor" cx="9" cy="9" r="4"/></svg>'
    },
    725230: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M9.3 9l.9-4.53a1.23 1.23 0 1 0-2.4 0L8.7 9l-.9 4.53a1.23 1.23 0 1 0 2.4 0L9.3 9z"/><path fill="currentColor" d="M9.15 9.26l4.38-1.48a1.23 1.23 0 1 0-1.21-2.09L8.85 8.74l-4.38 1.48a1.23 1.23 0 1 0 1.21 2.09l3.47-3.05z"/><path fill="currentColor" d="M9.15 8.74L5.68 5.69a1.23 1.23 0 1 0-1.2 2.09l4.37 1.48 3.47 3.05a1.23 1.23 0 1 0 1.2-2.09L9.16 8.74z"/></svg>'
    },
    643401: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M13.29 4.8h-.09a4.2 4.2 0 1 0 .09 8.4 6 6 0 1 1 0-8.4z"/></svg>'
    },
    315507: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M12.57 5.5h-.07a3.5 3.5 0 1 0 .07 7A4.98 4.98 0 0 1 4 9a5 5 0 0 1 8.57-3.5z"/></svg>'
    },
    212462: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M12.58 12.1A3.86 3.86 0 0 0 9 6.75a3.87 3.87 0 0 0-3.58 5.33 7.74 7.74 0 0 1 7.16 0zM3.64 9.93l-2.3-.62.37-1.38 2.3.62-.37 1.38zM6.1 6.07L5.07 3.92l1.3-.6 1 2.15-1.29.6zM10.62 5.47l1-2.16 1.3.6-1.01 2.16-1.3-.6zM13.99 8.55l2.3-.62.36 1.38-2.3.62L14 8.55z"/></svg>'
    },
    85290: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M12.22 11.78A3.47 3.47 0 0 0 9 6.98a3.48 3.48 0 0 0-3.22 4.8 6.97 6.97 0 0 1 6.44 0zM4.18 9.83L2.1 9.28l.33-1.24 2.07.55-.33 1.24zM6.38 6.36l-.9-1.94 1.16-.54.9 1.94-1.16.54zM10.46 5.82l.9-1.94 1.16.54-.9 1.94-1.16-.54zM13.49 8.6l2.07-.56.33 1.24-2.07.55-.33-1.24z"/></svg>'
    },
    991665: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M14.48 5.1c-.52 2.03-1.46 3.04-2.82 3.04-.64 0-1.55-.19-2.74-.56-1.17-.38-1.99-.57-2.46-.57-.69 0-1.22.37-1.58 1.13H3.55A4.3 4.3 0 0 1 4.5 6c.5-.6 1.08-.9 1.74-.9.7 0 1.65.2 2.84.58 1.2.37 2.04.55 2.52.55.8 0 1.32-.37 1.59-1.13h1.29zm0 4.84c-.52 2.02-1.46 3.03-2.82 3.03-.64 0-1.55-.19-2.74-.56-1.17-.38-1.99-.57-2.46-.57-.69 0-1.22.38-1.58 1.13H3.55a4.3 4.3 0 0 1 .95-2.14c.5-.6 1.08-.9 1.74-.9.7 0 1.65.2 2.84.58 1.2.37 2.04.56 2.52.56.8 0 1.32-.38 1.59-1.13h1.29z"/></svg>'
    },
    552828: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M13.4 5.9c-.41 1.62-1.16 2.43-2.25 2.43-.52 0-1.25-.15-2.2-.45-.93-.3-1.58-.45-1.96-.45-.55 0-.98.3-1.27.9H4.66c.1-.67.36-1.24.76-1.71.4-.48.86-.72 1.4-.72.56 0 1.31.16 2.27.46.95.3 1.62.45 2.01.45.64 0 1.06-.3 1.27-.9h1.03zm0 3.87c-.41 1.62-1.16 2.43-2.25 2.43-.52 0-1.25-.15-2.2-.45-.93-.3-1.58-.46-1.96-.46-.55 0-.98.3-1.27.9H4.66c.1-.67.36-1.24.76-1.7.4-.48.86-.72 1.4-.72.56 0 1.31.15 2.27.46.95.3 1.62.44 2.01.44.64 0 1.06-.3 1.27-.9h1.03z"/></svg>'
    },
    839379: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M4 6.5 6 8l3-3 3 3 2-1.5V10H4V6.5ZM14 13v-2H4v2h10Z"/></svg>'
    },
    252506: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 2 30 24" width="30" height="24" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M15.82 14l5.36-5.36-.82-.82L15 13.18 9.64 7.82l-.82.82L14.18 14l-5.36 5.36.82.82L15 14.82l5.36 5.36.82-.82L15.82 14z"/></svg>'
    },
    488658: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 22" width="24" height="22" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M17.35 6.35l-10 10-.7-.7 10-10 .7.7z"/><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M6.65 6.35l10 10 .7-.7-10-10-.7.7z"/></svg>'
    },
    841674: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 22" width="30" height="24" fill="none"><g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" class="normal-eye"><path d="M18 7.91C16.7 6.5 14.7 5 12 5S7.3 6.49 6 7.91C6 7.91 4 10 4 11s2 3.09 2 3.09C7.3 15.5 9.3 17 12 17s4.7-1.49 6-2.91c0 0 2-2.09 2-3.09s-2-3.09-2-3.09zm-11.26 5.5C7.94 14.74 9.7 16 12 16s4.05-1.26 5.25-2.59c0 0 1.75-1.91 1.75-2.41 0-.5-1.75-2.41-1.75-2.41C16.05 7.26 14.3 6 12 6S7.95 7.26 6.74 8.59C6.74 8.59 5 10.5 5 11c0 .5 1.74 2.41 1.74 2.41z"/><path d="M12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></g><g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" class="crossed-eye"><path d="M8.85 16.27c.92.44 1.97.73 3.15.73 2.7 0 4.7-1.49 6-2.91 0 0 2-2.09 2-3.09s-2-3.09-2-3.09l-.39-.4-.7.7.34.38S19 10.5 19 11c0 .5-1.75 2.41-1.75 2.41C16.05 14.74 14.3 16 12 16c-.88 0-1.68-.18-2.4-.48l-.75.75zM7.1 13.78l-.36-.37S5 11.5 5 11c0-.5 1.74-2.41 1.74-2.41C7.94 7.26 9.7 6 12 6c.88 0 1.68.18 2.4.48l.75-.75A7.17 7.17 0 0 0 12 5C9.3 5 7.3 6.49 6 7.91 6 7.91 4 10 4 11s2 3.09 2 3.09l.39.4.7-.7z"/><path d="M11.22 13.9a3 3 0 0 0 3.68-3.68l-.9.9A2 2 0 0 1 12.13 13l-.9.9zm.66-4.9A2 2 0 0 0 10 10.88l-.9.9a3 3 0 0 1 3.68-3.68l-.9.9zM5.65 16.65l12-12 .7.7-12 12-.7-.7z"/></g><g class="loading-eye"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M18 7.91C16.7 6.5 14.7 5 12 5S7.3 6.49 6 7.91C6 7.91 4 10 4 11s2 3.09 2 3.09C7.3 15.5 9.3 17 12 17s4.7-1.49 6-2.91c0 0 2-2.09 2-3.09s-2-3.09-2-3.09zm-11.26 5.5C7.94 14.74 9.7 16 12 16s4.05-1.26 5.25-2.59c0 0 1.75-1.91 1.75-2.41 0-.5-1.75-2.41-1.75-2.41C16.05 7.26 14.3 6 12 6S7.95 7.26 6.74 8.59C6.74 8.59 5 10.5 5 11c0 .5 1.74 2.41 1.74 2.41z"/></g><g class="animated-loading-eye"><path stroke="currentColor" stroke-linecap="round" d="M14.5 11a2.5 2.5 0 1 0-2.5 2.5"/></g></svg>'
    },
    754336: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 22" width="24" height="22" fill="none"><g class="normal-eye"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M17.9948 7.91366C16.6965 6.48549 14.6975 5 11.9999 5C9.30225 5 7.30322 6.48549 6.00488 7.91366C6.00488 7.91366 4 10 4 11C4 12 6.00488 14.0863 6.00488 14.0863C7.30322 15.5145 9.30225 17 11.9999 17C14.6975 17 16.6965 15.5145 17.9948 14.0863C17.9948 14.0863 20 12 20 11C20 10 17.9948 7.91366 17.9948 7.91366ZM6.74482 13.4137C7.94648 14.7355 9.69746 16 11.9999 16C14.3022 16 16.0532 14.7355 17.2549 13.4137C17.2549 13.4137 19 11.5 19 11C19 10.5 17.2549 8.58634 17.2549 8.58634C16.0532 7.26451 14.3022 6 11.9999 6C9.69746 6 7.94648 7.26451 6.74482 8.58634C6.74482 8.58634 5 10.5 5 11C5 11.5 6.74482 13.4137 6.74482 13.4137Z"/><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13ZM12 14C13.6569 14 15 12.6569 15 11C15 9.34315 13.6569 8 12 8C10.3431 8 9 9.34315 9 11C9 12.6569 10.3431 14 12 14Z"/></g><g class="crossed-eye"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M8.8503 16.2712C9.76531 16.7135 10.8152 17 11.9999 17C14.6975 17 16.6965 15.5145 17.9948 14.0863C17.9948 14.0863 20 12 20 11C20 10 17.9948 7.91366 17.9948 7.91366C17.8729 7.77954 17.7448 7.64491 17.6105 7.51105L16.9035 8.2181C17.0254 8.33968 17.1425 8.46276 17.2549 8.58634C17.2549 8.58634 19 10.5 19 11C19 11.5 17.2549 13.4137 17.2549 13.4137C16.0532 14.7355 14.3022 16 11.9999 16C11.1218 16 10.324 15.8161 9.60627 15.5153L8.8503 16.2712ZM7.09663 13.7823C6.97455 13.6606 6.85728 13.5374 6.74482 13.4137C6.74482 13.4137 5 11.5 5 11C5 10.5 6.74482 8.58634 6.74482 8.58634C7.94648 7.26451 9.69746 6 11.9999 6C12.8781 6 13.6761 6.18398 14.394 6.48495L15.1499 5.729C14.2348 5.28657 13.1847 5 11.9999 5C9.30225 5 7.30322 6.48549 6.00488 7.91366C6.00488 7.91366 4 10 4 11C4 12 6.00488 14.0863 6.00488 14.0863C6.12693 14.2206 6.25516 14.3553 6.38959 14.4893L7.09663 13.7823Z"/><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M11.2231 13.8984C11.4709 13.9647 11.7313 14 12 14C13.6569 14 15 12.6569 15 11C15 10.7313 14.9647 10.4709 14.8984 10.2231L13.9961 11.1254C13.934 12.1301 13.1301 12.934 12.1254 12.9961L11.2231 13.8984ZM11.8751 9.00384C10.87 9.06578 10.0658 9.87001 10.0038 10.8751L9.10166 11.7772C9.03535 11.5294 9 11.2688 9 11C9 9.34315 10.3431 8 12 8C12.2688 8 12.5294 8.03535 12.7772 8.10166L11.8751 9.00384Z"/><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M5.64648 16.6465L17.6465 4.64648L18.3536 5.35359L6.35359 17.3536L5.64648 16.6465Z"/></g><g class="loading-eye"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M17.9948 7.91366C16.6965 6.48549 14.6975 5 11.9999 5C9.30225 5 7.30322 6.48549 6.00488 7.91366C6.00488 7.91366 4 10 4 11C4 12 6.00488 14.0863 6.00488 14.0863C7.30322 15.5145 9.30225 17 11.9999 17C14.6975 17 16.6965 15.5145 17.9948 14.0863C17.9948 14.0863 20 12 20 11C20 10 17.9948 7.91366 17.9948 7.91366ZM6.74482 13.4137C7.94648 14.7355 9.69746 16 11.9999 16C14.3022 16 16.0532 14.7355 17.2549 13.4137C17.2549 13.4137 19 11.5 19 11C19 10.5 17.2549 8.58634 17.2549 8.58634C16.0532 7.26451 14.3022 6 11.9999 6C9.69746 6 7.94648 7.26451 6.74482 8.58634C6.74482 8.58634 5 10.5 5 11C5 11.5 6.74482 13.4137 6.74482 13.4137Z"/></g><g class="animated-loading-eye"><path stroke="currentColor" stroke-linecap="round" d="M14.5 11C14.5 9.61929 13.3807 8.5 12 8.5C10.6193 8.5 9.5 9.61929 9.5 11C9.5 12.3807 10.6193 13.5 12 13.5"/></g></svg>'
    },
    645534: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 2 30 24" width="30" height="24" fill="none"><circle stroke="currentColor" stroke-width="1.15" cx="8.08" cy="14" r="1.73"/><circle stroke="currentColor" stroke-width="1.15" cx="15" cy="14" r="1.73"/><circle stroke="currentColor" stroke-width="1.15" cx="21.92" cy="14" r="1.73"/></svg>'
    },
    387258: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 4" width="16" height="4" fill="none"><circle stroke="currentColor" cx="2" cy="2" r="1.5"/><circle stroke="currentColor" cx="8" cy="2" r="1.5"/><circle stroke="currentColor" cx="14" cy="2" r="1.5"/></svg>'
    },
    736885: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M8.54.84a.8.8 0 0 1 .92 0l7.5 5.25a.8.8 0 0 1 0 1.32l-7.5 5.25a.8.8 0 0 1-.92 0L1.04 7.4a.8.8 0 0 1 0-1.32L8.54.84zM2.9 6.75L9 11.02l6.1-4.27L9 2.48 2.9 6.75z"/><path fill="currentColor" d="M.84 10.8a.8.8 0 0 1 1.12-.2L9 15.51l7.04-4.93a.8.8 0 0 1 .92 1.32l-7.5 5.25a.8.8 0 0 1-.92 0l-7.5-5.25a.8.8 0 0 1-.2-1.12z"/></svg>'
    },
    65300: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" width="15" height="15"><path fill="currentColor" d="M7.23 2.58a.5.5 0 0 1 .54 0l5.5 3.5a.5.5 0 0 1 0 .84l-5.5 3.5a.5.5 0 0 1-.54 0l-5.5-3.5a.5.5 0 0 1 0-.84l5.5-3.5zM2.93 6.5L7.5 9.4l4.57-2.9L7.5 3.6 2.93 6.5z"/><path fill="currentColor" d="M1.58 9.23a.5.5 0 0 1 .69-.15L7.5 12.4l5.23-3.33a.5.5 0 0 1 .54.84l-5.5 3.5a.5.5 0 0 1-.54 0l-5.5-3.5a.5.5 0 0 1-.15-.69z"/></svg>'
    },
    34882: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 22" width="24" height="22" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M6 6.5A2.5 2.5 0 0 1 8.5 4H10v1H8.5C7.67 5 7 5.67 7 6.5v1.15a3.5 3.5 0 0 1-1.93 3.13l-.45.22.45.22A3.5 3.5 0 0 1 7 14.35v1.15c0 .83.67 1.5 1.5 1.5H10v1H8.5A2.5 2.5 0 0 1 6 15.5v-1.15a2.5 2.5 0 0 0-1.38-2.23l-1.34-.67a.5.5 0 0 1 0-.9l1.34-.67A2.5 2.5 0 0 0 6 7.65V6.5zM15.5 5H14V4h1.5A2.5 2.5 0 0 1 18 6.5v1.15c0 .94.54 1.8 1.38 2.23l1.34.67a.5.5 0 0 1 0 .9l-1.34.67A2.5 2.5 0 0 0 18 14.35v1.15a2.5 2.5 0 0 1-2.5 2.5H14v-1h1.5c.83 0 1.5-.67 1.5-1.5v-1.15a3.5 3.5 0 0 1 1.93-3.13l.45-.22-.45-.22A3.5 3.5 0 0 1 17 7.65V6.5c0-.83-.67-1.5-1.5-1.5z"/></svg>'
    },
    583637: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M8.63 1.08a2.04 2.04 0 0 1-3.26 0c-.51.14-1 .35-1.45.6l.01.2A2.05 2.05 0 0 1 1.7 3.93a6.1 6.1 0 0 0-.6 1.45 2.04 2.04 0 0 1 0 3.26c.13.51.34 1 .6 1.45l.2-.01a2.05 2.05 0 0 1 2.03 2.24c.45.26.94.47 1.45.6a2.04 2.04 0 0 1 3.26 0c.51-.13 1-.34 1.45-.6l-.01-.2a2.05 2.05 0 0 1 2.24-2.03c.26-.45.47-.94.6-1.45a2.04 2.04 0 0 1 0-3.26 6.1 6.1 0 0 0-.6-1.45 2.05 2.05 0 0 1-2.23-2.23 6.1 6.1 0 0 0-1.45-.6zM7.84.42c.17-.24.43-.47.72-.4.84.18 1.62.5 2.32.96.23.15.26.48.22.76a1.03 1.03 0 0 0 1.16 1.16c.28-.04.6-.01.76.22.45.7.78 1.48.97 2.32.06.29-.17.55-.41.72a1.02 1.02 0 0 0 0 1.68c.24.17.47.43.4.72a7.12 7.12 0 0 1-.96 2.32c-.15.23-.48.26-.76.22a1.03 1.03 0 0 0-1.17 1.01l.01.15c.04.28.01.6-.22.76-.7.45-1.48.78-2.32.97-.29.06-.55-.17-.72-.41a1.02 1.02 0 0 0-1.68 0c-.17.24-.43.47-.72.4a7.12 7.12 0 0 1-2.32-.96c-.23-.15-.26-.48-.22-.76v-.15a1.02 1.02 0 0 0-1.16-1c-.28.03-.6 0-.76-.23A7.12 7.12 0 0 1 0 8.56c-.06-.29.17-.55.41-.72a1.02 1.02 0 0 0 0-1.68c-.24-.17-.47-.43-.4-.72.18-.84.5-1.62.96-2.32.15-.23.48-.26.76-.22h.15a1.02 1.02 0 0 0 1-1.16c-.03-.28 0-.6.23-.76C3.82.53 4.6.2 5.44 0c.29-.06.55.17.72.41a1.02 1.02 0 0 0 1.68 0zM9 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm1 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/></svg>'
    },
    572237: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" width="15" height="15"><path fill="currentColor" d="M11.65 12.35l-9-9 .7-.7 9 9-.7.7z"/><path fill="currentColor" d="M2.65 11.65l9-9 .7.7-9 9-.7-.7z"/></svg>'
    },
    671402: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" width="15" height="15" fill="none"><path stroke="currentColor" d="M11 2 7.5 5 4 2" class="bracket-up"/><path stroke="currentColor" d="M4 13l3.5-3 3.5 3" class="bracket-down"/></svg>'
    },
    636016: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M7.65 8.35l.7-.7 6.15 6.14 6.15-6.14.7.7-6.14 6.15 6.14 6.15-.7.7-6.15-6.14-6.15 6.14-.7-.7 6.14-6.15-6.14-6.15z"/></svg>'
    },
    520465: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="M20.53 3.73 14 9.33 7.47 3.73M7.47 24.27l6.53 -5.60 6.53 5.60"/></svg>'
    },
    648344: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M14 7v12.93l5.18-4.31.64.76-6.32 5.27-6.32-5.27.64-.76L13 19.93V7h1z"/></svg>'
    },
    99539: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M19.32 6H8.68A2.68 2.68 0 0 0 6 8.68V11h1V8.68C7 7.75 7.75 7 8.68 7h10.64c.93 0 1.68.75 1.68 1.68V11h1V8.68C22 7.2 20.8 6 19.32 6zM7 19.32c0 .93.75 1.68 1.68 1.68h10.64c.93 0 1.68-.75 1.68-1.68V17h1v2.32C22 20.8 20.8 22 19.32 22H8.68A2.68 2.68 0 0 1 6 19.32V17h1v2.32z"/></svg>'
    },
    334763: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="m7.47 9.33 6.53 -5.60L20.53 9.33M20.53 18.67l-6.53 5.60L7.47 18.67"/></svg>'
    },
    472899: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M13.5 6.35l6.32 5.27-.64.76L14 8.07V21h-1V8.07l-5.18 4.31-.64-.76 6.32-5.27z"/></svg>'
    },
    970471: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><circle fill="currentColor" cx="15" cy="9" r="1.5"/><circle fill="currentColor" cx="9" cy="9" r="1.5"/><circle fill="currentColor" cx="3" cy="9" r="1.5"/></svg>'
    },
    682847: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" width="15" height="15"><circle fill="currentColor" cx="12.75" cy="7.5" r="1.25"/><circle fill="currentColor" cx="7.5" cy="7.5" r="1.25"/><circle fill="currentColor" cx="2.25" cy="7.5" r="1.25"/></svg>'
    },
    203515: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" width="15" height="15"><path fill="currentColor" d="M11.83 8.88l-.66-.76L8 10.9V3H7v7.9L3.83 8.12l-.66.76 4.33 3.78 4.33-3.78z"/></svg>'
    },
    907859: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M3.5 2.8a.7.7 0 0 0-.7.7V6H1.2V3.5a2.3 2.3 0 0 1 2.3-2.3h11a2.3 2.3 0 0 1 2.3 2.3V6h-1.6V3.5a.7.7 0 0 0-.7-.7h-11z" class="bracket-up"/><path fill="currentColor" d="M3.5 15.2a.7.7 0 0 1-.7-.7V12H1.2v2.5a2.3 2.3 0 0 0 2.3 2.3h11a2.3 2.3 0 0 0 2.3-2.3V12h-1.6v2.5a.7.7 0 0 1-.7.7h-11z" class="bracket-down"/></svg>'
    },
    279526: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" width="15" height="15" fill="none"><path fill="currentColor" d="M4.5 12A1.5 1.5 0 0 1 3 10.5V9H2v1.5A2.5 2.5 0 0 0 4.5 13h6a2.5 2.5 0 0 0 2.5-2.5V9h-1v1.5c0 .83-.67 1.5-1.5 1.5h-6z" class="bracket-up"/><path fill="currentColor" d="M4.5 3C3.67 3 3 3.67 3 4.5V6H2V4.5A2.5 2.5 0 0 1 4.5 2h6A2.5 2.5 0 0 1 13 4.5V6h-1V4.5c0-.83-.67-1.5-1.5-1.5h-6z" class="bracket-down"/></svg>'
    },
    142930: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" width="15" height="15" fill="none"><path stroke="currentColor" d="m4 5 3.5-3L11 5" class="bracket-up"/><path stroke="currentColor" d="M11 10l-3.5 3L4 10" class="bracket-down"/></svg>'
    },
    981020: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" width="15" height="15"><path fill="currentColor" d="M11.83 6.12l-.66.76L8 4.1V12H7V4.1L3.83 6.88l-.66-.76L7.5 2.34l4.33 3.78z"/></svg>'
    },
    662920: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill="currentColor" d="M2.4 5.46a.8.8 0 0 1 1.14-.05L8 9.42l4.46-4.01a.8.8 0 0 1 1.08 1.18L8 11.58 2.47 6.59a.8.8 0 0 1-.06-1.13z"/></svg>'
    },
    947036: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" width="15" height="15"><path fill="currentColor" d="M3.5 5.58c.24-.28.65-.3.92-.07L7.5 8.14l3.08-2.63a.65.65 0 1 1 .84.98L7.5 9.86 3.58 6.49a.65.65 0 0 1-.07-.91z"/></svg>'
    },
    542205: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7 7" width="7" height="7"><path fill="currentColor" d="M3.5 7L7 4H4V0H3V4H0L3.5 7Z"/></svg>'
    },
    50119: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 7" width="9" height="7"><path fill="currentColor" d="M.5 3.5L4 0v3h5v1H4v3z"/></svg>'
    },
    362884: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 7" width="9" height="7"><path fill="currentColor" d="M8.5 3.5L5 0v3H0v1h5v3z"/></svg>'
    },
    250662: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7 7" width="7" height="7"><path fill="currentColor" d="M3.5 0L0 3h3v4h1V3h3L3.5 0z"/></svg>'
    },
  },
])
