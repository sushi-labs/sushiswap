;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5093],
  {
    78217: (e) => {
      e.exports = {
        pair: 'pair-ocURKVwI',
        xxceptionallysmalldonotusebrv1023:
          'xxceptionallysmalldonotusebrv1023-ocURKVwI',
        xxxxsmall: 'xxxxsmall-ocURKVwI',
        xxxsmall: 'xxxsmall-ocURKVwI',
        xxsmall: 'xxsmall-ocURKVwI',
        xsmall: 'xsmall-ocURKVwI',
        small: 'small-ocURKVwI',
        medium: 'medium-ocURKVwI',
        large: 'large-ocURKVwI',
        xlarge: 'xlarge-ocURKVwI',
        xxlarge: 'xxlarge-ocURKVwI',
        xxxlarge: 'xxxlarge-ocURKVwI',
        logo: 'logo-ocURKVwI',
        skeleton: 'skeleton-ocURKVwI',
        empty: 'empty-ocURKVwI',
      }
    },
    56057: (e) => {
      e.exports = {
        logo: 'logo-PsAlMQQF',
        hidden: 'hidden-PsAlMQQF',
        xxceptionallysmalldonotusebrv1023:
          'xxceptionallysmalldonotusebrv1023-PsAlMQQF',
        xxxsmall: 'xxxsmall-PsAlMQQF',
        xxsmall: 'xxsmall-PsAlMQQF',
        xsmall: 'xsmall-PsAlMQQF',
        small: 'small-PsAlMQQF',
        medium: 'medium-PsAlMQQF',
        large: 'large-PsAlMQQF',
        xlarge: 'xlarge-PsAlMQQF',
        xxlarge: 'xxlarge-PsAlMQQF',
        xxxlarge: 'xxxlarge-PsAlMQQF',
        skeleton: 'skeleton-PsAlMQQF',
        letter: 'letter-PsAlMQQF',
      }
    },
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
    55679: (e) => {
      e.exports = {
        wrapper: 'wrapper-TJ9ObuLF',
        animated: 'animated-TJ9ObuLF',
        pulsation: 'pulsation-TJ9ObuLF',
      }
    },
    53885: (e, t, s) => {
      s.d(t, { getStyleClasses: () => n, isCircleLogoWithUrlProps: () => r })
      var i = s(97754),
        l = s(52292),
        o = s(56057),
        a = s.n(o)
      function n(e, t = 2, s) {
        return i(
          a().logo,
          a()[e],
          s,
          0 === t || 1 === t
            ? i(l.skeletonTheme.wrapper, a().skeleton)
            : a().letter,
          1 === t && l.skeletonTheme.animated,
        )
      }
      function r(e) {
        return (
          'logoUrl' in e &&
          null !== e.logoUrl &&
          void 0 !== e.logoUrl &&
          0 !== e.logoUrl.length
        )
      }
    },
    26996: (e, t, s) => {
      s.d(t, { Loader: () => r })
      var i,
        l = s(50959),
        o = s(97754),
        a = s(4665),
        n = s.n(a)
      function r(e) {
        const {
            className: t,
            size: s = 'medium',
            staticPosition: i,
            color: a = 'black',
          } = e,
          r = o(n().item, n()[a], n()[s])
        return l.createElement(
          'span',
          { className: o(n().loader, i && n().static, t) },
          l.createElement('span', { className: r }),
          l.createElement('span', { className: r }),
          l.createElement('span', { className: r }),
        )
      }
      !((e) => {
        ;(e.Medium = 'medium'), (e.Small = 'small')
      })(i || (i = {}))
    },
    52292: (e, t, s) => {
      s.d(t, { skeletonTheme: () => l })
      var i = s(55679)
      const l = i
    },
    82708: (e, t, s) => {
      s.d(t, { safeShortName: () => l })
      var i = s(13665)
      function l(e) {
        try {
          return (0, i.shortName)(e)
        } catch (t) {
          return e
        }
      }
    },
    618: (e, t, s) => {
      s.d(t, {
        removeUsdFromCryptoPairLogos: () => a,
        resolveLogoUrls: () => o,
      })
      var i = s(36279)
      const l = (0, i.getLogoUrlResolver)()
      function o(e, t = i.LogoSize.Medium) {
        const s = e.logoid,
          o = e['base-currency-logoid'],
          a = e['currency-logoid'],
          n = s && l.getSymbolLogoUrl(s, t)
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
    39330: (e, t, s) => {
      s.d(t, { getBlockStyleClasses: () => n, getLogoStyleClasses: () => r })
      var i = s(97754),
        l = s(52292),
        o = s(78217),
        a = s.n(o)
      function n(e, t) {
        return i(a().pair, a()[e], t)
      }
      function r(e, t = 2, s = !0) {
        return i(
          a().logo,
          a()[e],
          a().skeleton,
          l.skeletonTheme.wrapper,
          !s && a().empty,
          1 === t && i(l.skeletonTheme.animated),
        )
      }
    },
    59695: (e, t, s) => {
      s.d(t, { CircleLogo: () => n, hiddenCircleLogoClass: () => a })
      var i = s(50959),
        l = s(53885),
        o = s(56057)
      const a = s.n(o)().hidden
      function n(e) {
        const t = (0, l.isCircleLogoWithUrlProps)(e),
          [s, o] = (0, i.useState)(0),
          a = (0, i.useRef)(null),
          n = (0, l.getStyleClasses)(e.size, s, e.className),
          r = e.alt ?? e.title ?? '',
          d = t ? r[0] : e.placeholderLetter
        return (
          (0, i.useEffect)(() => o((a.current?.complete ?? !t) ? 2 : 1), [t]),
          t && 3 !== s
            ? i.createElement('img', {
                ref: a,
                className: n,
                crossOrigin: '',
                src: e.logoUrl,
                alt: r,
                title: e.title,
                loading: e.loading,
                onLoad: () => o(2),
                onError: () => o(3),
                'aria-label': e['aria-label'],
                'aria-hidden': e['aria-hidden'],
              })
            : i.createElement(
                'span',
                {
                  className: n,
                  title: e.title,
                  'aria-label': e['aria-label'],
                  'aria-hidden': e['aria-hidden'],
                },
                d,
              )
        )
      }
    },
    58492: (e, t, s) => {
      s.d(t, { getStyleClasses: () => i.getStyleClasses })
      var i = s(53885)
    },
    54212: (e) => {
      e.exports = {}
    },
    37850: (e) => {
      e.exports = {
        marginlegendhoriz: '4px',
        legend: 'legend-l31H9iuA',
        legend_withHiddenActions: 'legend_withHiddenActions-l31H9iuA',
        item: 'item-l31H9iuA',
        hideInvisibleHover: 'hideInvisibleHover-l31H9iuA',
        button: 'button-l31H9iuA',
        buttons: 'buttons-l31H9iuA',
        withAction: 'withAction-l31H9iuA',
        selected: 'selected-l31H9iuA',
        last: 'last-l31H9iuA',
        statusesWrapper: 'statusesWrapper-l31H9iuA',
        statusesWrapper__statuses: 'statusesWrapper__statuses-l31H9iuA',
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
        logoWrapper: 'logoWrapper-l31H9iuA',
        buttonsWrapper: 'buttonsWrapper-l31H9iuA',
        statusesWrapper__statusesWithToggle:
          'statusesWrapper__statusesWithToggle-l31H9iuA',
        pairContainer: 'pairContainer-l31H9iuA',
        logo: 'logo-l31H9iuA',
        hidden: 'hidden-l31H9iuA',
        noActions: 'noActions-l31H9iuA',
        titleWrapper: 'titleWrapper-l31H9iuA',
        title: 'title-l31H9iuA',
        intervalTitle: 'intervalTitle-l31H9iuA',
        withDot: 'withDot-l31H9iuA',
        accessible: 'accessible-l31H9iuA',
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
        flagged: 'flagged-l31H9iuA',
        medium: 'medium-l31H9iuA',
        minimized: 'minimized-l31H9iuA',
        micro: 'micro-l31H9iuA',
        linked: 'linked-l31H9iuA',
        onlyOneButtonCanBeStick: 'onlyOneButtonCanBeStick-l31H9iuA',
        touchMode: 'touchMode-l31H9iuA',
        buttonIcon: 'buttonIcon-l31H9iuA',
        flag: 'flag-l31H9iuA',
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
        togglerWrapper: 'togglerWrapper-l31H9iuA',
        toggler: 'toggler-l31H9iuA pane-button-e6PF69Df',
        onlyOneSourceShown: 'onlyOneSourceShown-l31H9iuA',
        counter: 'counter-l31H9iuA',
        iconArrow: 'iconArrow-l31H9iuA',
        objectTree: 'objectTree-l31H9iuA',
        closed: 'closed-l31H9iuA',
        saveArrowWidth: 'saveArrowWidth-l31H9iuA',
        objectsTreeCanBeShown: 'objectsTreeCanBeShown-l31H9iuA',
      }
    },
    67173: (e) => {
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
    45319: (e) => {
      e.exports = {
        blockHidden: 'blockHidden-e6PF69Df',
        'pane-button': 'pane-button-e6PF69Df',
      }
    },
    58994: (e) => {
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
        marketStatusDelisted: 'marketStatusDelisted-Lgtz1OtS',
        marketStatusExpired: 'marketStatusExpired-Lgtz1OtS',
        marketStatusCustom: 'marketStatusCustom-Lgtz1OtS',
        invalidSymbol: 'invalidSymbol-Lgtz1OtS',
        replayModeAutoPlay: 'replayModeAutoPlay-Lgtz1OtS',
        replayModePause: 'replayModePause-Lgtz1OtS',
        replayModePointSelect: 'replayModePointSelect-Lgtz1OtS',
        'blinking-animation-custom': 'blinking-animation-custom-Lgtz1OtS',
        notAccurate: 'notAccurate-Lgtz1OtS',
        openedInPineEditor: 'openedInPineEditor-Lgtz1OtS',
        openedInDetachedPineEditor: 'openedInDetachedPineEditor-Lgtz1OtS',
        delay: 'delay-Lgtz1OtS',
        eod: 'eod-Lgtz1OtS',
        dataProblemHigh: 'dataProblemHigh-Lgtz1OtS',
        dataProblemLow: 'dataProblemLow-Lgtz1OtS',
        hasError: 'hasError-Lgtz1OtS',
        updateAvailable: 'updateAvailable-Lgtz1OtS',
      }
    },
    57177: (e, t, s) => {
      var i
      function l(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:main-element'))
      }
      function o(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:secondary-element'))
      }
      s.d(t, { becomeMainElement: () => l, becomeSecondaryElement: () => o }),
        ((e) => {
          ;(e.MainElement = 'roving-tabindex:main-element'),
            (e.SecondaryElement = 'roving-tabindex:secondary-element')
        })(i || (i = {}))
    },
    22136: (e, t, s) => {
      s.r(t), s.d(t, { ControlBarNavigation: () => X })
      var i = s(50151),
        l = s(11542),
        o = s(32563),
        a = s(56570),
        n = s(88960),
        r = s(60859),
        d = s(63273),
        u = s(49481),
        h = s(42752),
        c = s(61814),
        _ = s(49483),
        p = s(68335),
        m = s(68805),
        g = (s(51768), s(23317)),
        b = s(89612),
        v = s(77576),
        w = s(93724),
        S = s(91986),
        y = s(76996),
        M = s(78529),
        f = s(50119),
        C = s(62884),
        E = s(50662),
        V = s(42205)
      s(54212)
      const L = (0, p.humanReadableModifiers)(p.Modifiers.Alt, !1),
        W = (0, p.humanReadableModifiers)(p.Modifiers.Shift, !1),
        A = (0, p.humanReadableModifiers)(p.Modifiers.Mod, !1),
        x = (0, c.hotKeySerialize)({ keys: [L, 'R'], text: '{0} + {1}' }),
        k = (0, c.hotKeySerialize)({
          keys: [L, 'Click', L, 'Enter'],
          text: '{0} + {1}, {2} + {3}',
        }),
        T = (0, c.hotKeySerialize)({ keys: [f], text: '{0}' }),
        H = (0, c.hotKeySerialize)({ keys: [C], text: '{0}' }),
        B = (0, c.hotKeySerialize)({ keys: [A, E], text: '{0} + {1}' }),
        I = (0, c.hotKeySerialize)({ keys: [A, V], text: '{0} + {1}' }),
        D = (0, c.hotKeySerialize)({
          keys: [L, W, C],
          text: '{0} + {1} + {2}',
        }),
        P = l.t(null, void 0, s(88710)),
        z = l.t(null, void 0, s(97038)),
        N = l.t(null, void 0, s(61206)),
        R = l.t(null, void 0, s(31142)),
        O = l.t(null, void 0, s(90761)),
        F = l.t(null, void 0, s(25131)),
        U = l.t(null, void 0, s(75246)),
        G = l.t(null, void 0, s(83040))
      var Z, j
      !((e) => {
        ;(e[(e.BarVisibleDistance = 100)] = 'BarVisibleDistance'),
          (e[(e.BackButtonRightMargin = 14)] = 'BackButtonRightMargin'),
          (e[(e.SingleButtonWidth = 36)] = 'SingleButtonWidth'),
          (e[(e.GroupMargins = 14)] = 'GroupMargins'),
          (e[(e.GoToRealtimeButtonWidth = 50)] = 'GoToRealtimeButtonWidth'),
          (e[(e.LeftMargin = 50)] = 'LeftMargin'),
          (e[(e.TimeAxisMainPaneMargin = 27)] = 'TimeAxisMainPaneMargin'),
          (e[(e.PaneControlsHeight = 28)] = 'PaneControlsHeight')
      })(Z || (Z = {})),
        ((e) => {
          ;(e.ScrollLeftRight = 'js-btn-group-scroll'),
            (e.ZoomInZoomOut = 'js-btn-group-zoom'),
            (e.Maximize = 'js-btn-group-maximize'),
            (e.ResetScale = 'js-btn-group-reset-scale')
        })(j || (j = {}))
      const $ = `<div class="control-bar-wrapper">\n\t<div class="control-bar control-bar--hidden">\n\t\t<div class="control-bar__group js-btn-group js-btn-group-zoom">\n\t\t\t<div class="control-bar__btn control-bar__btn--zoom-out apply-common-tooltip" title="${P}" data-tooltip-hotkey="${I}">\n\t\t\t\t${g}\n\t\t\t</div>\n\t\t\t<div class="control-bar__btn control-bar__btn--zoom-in apply-common-tooltip" title="${z}" data-tooltip-hotkey="${B}">\n\t\t\t\t${v}\n\t\t\t</div>\n\t\t</div>\n\t\t<div class="control-bar__group js-btn-group js-btn-group-maximize">\n\t\t\t<div class="control-bar__btn control-bar__btn--maximize apply-common-tooltip" title="${N}" data-tooltip-hotkey="${k}">\n\t\t\t\t${S}\n\t\t\t</div>\n\t\t\t<div class="control-bar__btn control-bar__btn--minimize js-hidden apply-common-tooltip" title="${R}" data-tooltip-hotkey="${k}">\n\t\t\t\t${y}\n\t\t\t</div>\n\t\t</div>\n\t\t<div class="control-bar__group js-btn-group js-btn-group-scroll">\n\t\t\t<div class="control-bar__btn control-bar__btn--move-left apply-common-tooltip" title="${O}" data-tooltip-hotkey="${T}">\n\t\t\t\t${b}\n\t\t\t</div>\n\t\t\t<div class="control-bar__btn control-bar__btn--move-right apply-common-tooltip" title="${F}" data-tooltip-hotkey="${H}">\n\t\t\t\t${b}\n\t\t\t</div>\n\t\t</div>\n\t\t<div class="control-bar__group js-btn-group js-btn-group-reset-scale">\n\t\t\t<div class="control-bar__btn control-bar__btn--turn-button control-bar__btn--btn-hidden apply-common-tooltip js-btn-reset" title="${U}" data-tooltip-hotkey="${x}">\n\t\t\t\t${w}\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>`,
        Q = `<div class="control-bar-wrapper control-bar-wrapper--back-present">\n\t<div class="control-bar control-bar__btn control-bar__btn--btn-hidden apply-common-tooltip" title="${G}" data-tooltip-hotkey="${D}">\n\t\t${M}\n\t</div>\n</div>`,
        K = _.CheckMobile.any(),
        q = 'control-bar__btn--btn-hidden',
        J = {
          zoomInOut: !0,
          maximize: !0,
          scrollLeftRight: !0,
          resetScale: !0,
          goToRealtime: !0,
        }
      class X {
        constructor(e, t, s) {
          ;(this._widget = (0, i.ensureNotNull)(
            (0, u.parseHtml)($).querySelector('.control-bar-wrapper'),
          )),
            (this._controlBar = (0, i.ensureNotNull)(
              this._widget.querySelector('.control-bar'),
            )),
            (this._back = (0, i.ensureNotNull)(
              (0, u.parseHtml)(Q).querySelector('.control-bar-wrapper'),
            )),
            (this._btnGroups = Array.from(
              this._controlBar.querySelectorAll('.js-btn-group'),
            )),
            (this._targetPaneWidget = null),
            (this._backButtonVisible = !1),
            (this._backButtonCanBeVisible = !1),
            (this._boundMouseHandler = null),
            (this._chartModel = null),
            (this._controlBarVisible = !1),
            (this._priceAxisChanged = null),
            (this._resetScalesAvailable = null),
            (this._priceAxisName = 'right'),
            (this._rafId = null),
            (this._visibilityTypeProperty = null),
            (this._boundUpdateMaximizeButtonsVisibility =
              this._updateMaximizeButtonsVisibility.bind(this)),
            (this._boundToggleFullscreenButtons =
              this._toggleFullscreenButtons.bind(this)),
            (this._paneWidth = 0),
            (this._leftPriceScaleWidth = 0),
            (this._rightPriceScaleWidth = 0),
            (this._onVisibilityTypeChange = (e) => {
              'alwaysOn' === e || 'alwaysOff' === e
                ? ((this._controlBarVisible = 'alwaysOn' === e),
                  this._parent.removeEventListener(
                    'mousemove',
                    this._controlsBarVisibilityHandler,
                    !1,
                  ),
                  this._parent.removeEventListener(
                    'mouseleave',
                    this._controlsBarVisibilityHandler,
                    !1,
                  ))
                : ((this._controlBarVisible = !1),
                  this._parent.addEventListener(
                    'mousemove',
                    this._controlsBarVisibilityHandler,
                  ),
                  this._parent.addEventListener(
                    'mouseleave',
                    this._controlsBarVisibilityHandler,
                  )),
                this._configureBackButtonVisibility(e),
                this._updateControlBarVisibility()
            }),
            (this._visibilityBackButtonHandler = (e) => {
              const t = this._checkIsPointerNearBox(
                e,
                this._back.getBoundingClientRect(),
              )
              void 0 !== t &&
                this._backButtonCanBeVisible !== t &&
                ((this._backButtonCanBeVisible = t), this._setRAF())
            }),
            (this._controlsBarVisibilityHandler = (e) => {
              const t = this._checkIsPointerNearBox(
                e,
                this._controlBar.getBoundingClientRect(),
              )
              void 0 !== t &&
                this._controlBarVisible !== t &&
                ((this._controlBarVisible = t), this._setRAF())
            }),
            (this._updateControlBarVisibility = () => {
              this._controlBar.classList.toggle(
                'control-bar--hidden',
                !this._controlBarVisible,
              )
            }),
            (this._chart = e),
            (this._parent = t),
            (this._options = Object.assign({}, J, s)),
            (this._visibilityPrioritizedGroups = this._initGroupDescriptions()),
            this._init(),
            this._initHandlers(),
            this.updatePosition()
        }
        destroy() {
          null !== this._visibilityTypeProperty &&
            (this._visibilityTypeProperty.destroy(),
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
            this._resetScalesAvailable?.destroy()
          const e = this._chart.getResizerDetacher()
          e.fullscreenable.unsubscribe(
            this._boundUpdateMaximizeButtonsVisibility,
          ),
            e.fullscreen.unsubscribe(this._boundToggleFullscreenButtons),
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
          const s =
            this._parent.getBoundingClientRect().bottom -
            t.getBoundingClientRect().bottom +
            this._bottomMargin(e)
          ;(this._widget.style.bottom = `${s}px`),
            (this._back.style.bottom = `${s}px`),
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
          if (_.CheckMobile.any())
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
            this._parent.appendChild(this._widget),
            this._parent.appendChild(this._back),
            (this._priceAxisName = (0, d.isRtl)() ? 'left' : 'right'),
            this._chart.withModel(this, () => {
              ;(this._chartModel = this._chart.model()),
                this._initVisibility(),
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
              const e = this._chart.getResizerDetacher()
              e.fullscreenable.subscribe(
                this._boundUpdateMaximizeButtonsVisibility,
              ),
                e.fullscreen.subscribe(this._boundToggleFullscreenButtons),
                this._updateMaximizeButtonsVisibility(),
                this._updateBackBtnPosition(),
                this._back
                  .querySelector('.control-bar__btn')
                  ?.addEventListener('click', () => {
                    null !== this._chartModel &&
                      this._chartModel
                        .timeScale()
                        .scrollToRealtime(!0, () =>
                          this._checkBackButtonVisibility(),
                        )
                  })
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
          const s = (e) =>
            e.addEventListener('contextmenu', (e) => e.preventDefault())
          s(this._buttons.moveLeft),
            s(this._buttons.moveRight),
            s(this._buttons.turn),
            s(this._buttons.zoomOut),
            s(this._buttons.zoomIn),
            s(this._buttons.minimize),
            s(this._buttons.maximize)
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
        _checkBackButtonVisibility() {
          if (null === this._chartModel || !this._options.goToRealtime) return
          const e =
            this._backButtonCanBeVisible &&
            this._chartModel.timeScale().rightOffset() < 0
          e !== this._backButtonVisible &&
            ((this._backButtonVisible = e),
            this._back
              .querySelector('.control-bar__btn')
              ?.classList.toggle(q, !this._backButtonVisible))
        }
        _initVisibility() {
          ;(this._visibilityTypeProperty = (0, n.combine)(
            (e, t) => (null !== t ? 'alwaysOff' : e),
            (0, h.convertPropertyToWatchedValue)(
              (0, r.actualBehavior)(),
            ).ownership(),
            (0, m.getSeriesDisplayErrorWV)(
              (0, i.ensureNotNull)(this._chartModel).mainSeries(),
            ).ownership(),
          )),
            this._visibilityTypeProperty.subscribe(
              this._onVisibilityTypeChange,
              { callWithLast: !0 },
            )
        }
        _configureBackButtonVisibility(e) {
          'alwaysOff' === e
            ? (clearInterval(this._checkIntervalId),
              (this._checkIntervalId = void 0))
            : (this._checkIntervalId =
                this._checkIntervalId ??
                setInterval(() => this._checkBackButtonVisibility(), 1e3)),
            _.CheckMobile.any()
              ? (this._backButtonCanBeVisible = 'alwaysOff' !== e)
              : 'alwaysOn' === e || 'alwaysOff' === e
                ? ((this._backButtonCanBeVisible = 'alwaysOn' === e),
                  this._parent.removeEventListener(
                    'mousemove',
                    this._visibilityBackButtonHandler,
                    !1,
                  ),
                  this._parent.removeEventListener(
                    'mouseleave',
                    this._visibilityBackButtonHandler,
                    !1,
                  ))
                : ((this._backButtonCanBeVisible = !1),
                  this._parent.addEventListener(
                    'mousemove',
                    this._visibilityBackButtonHandler,
                  ),
                  this._parent.addEventListener(
                    'mouseleave',
                    this._visibilityBackButtonHandler,
                  )),
            this._checkBackButtonVisibility()
        }
        _checkIsPointerNearBox(e, t) {
          if (
            !(
              e.buttons ||
              (null !== this._chartModel && this._chartModel.lineBeingCreated())
            )
          ) {
            if ('mousemove' === e.type) {
              const s =
                100 -
                (this._targetPaneWidget
                  ? this._bottomMargin(this._targetPaneWidget)
                  : 0)
              return (
                e.clientX >= t.left - 100 &&
                e.clientX <= t.right + 100 &&
                e.clientY >= t.top - s &&
                e.clientY <= t.bottom + 100
              )
            }
            return !1
          }
        }
        _setRAF() {
          null === this._rafId &&
            (this._rafId =
              this._widget.ownerDocument.defaultView.requestAnimationFrame(
                () => {
                  this._checkBackButtonVisibility(),
                    this._updateControlBarVisibility(),
                    (this._rafId = null)
                },
              ))
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
          let s = 2 * Math.min(e - t, t - this._leftPriceScaleWidth) - 50 - 50,
            i = !1
          for (const e of this._visibilityPrioritizedGroups) {
            e.enoughSpaceForGroup = !1
            e.available() &&
              (!K || !e.shouldBeHiddenOnMobile) &&
              ((s -= e.totalWidth),
              (e.enoughSpaceForGroup = s >= 0 && !i),
              (i = i || !e.enoughSpaceForGroup)),
              !e.enoughSpaceForGroup !==
                e.element.classList.contains('js-hidden') &&
                e.element.classList.toggle('js-hidden', !e.enoughSpaceForGroup)
          }
          this._updateControlBarPosition()
        }
        _getBtnGroup(e) {
          return (0, i.ensureDefined)(
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
          this._buttons.turn.classList.toggle(q, !e)
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
          return this._options.maximize, !1
        }
        _trackEvent(e) {
          0
        }
      }
    },
    60786: (e, t, s) => {
      s.r(t), s.d(t, { LegendWidget: () => no })
      var i = s(27714),
        l = s(20057),
        o = s(50151),
        a = s(52033),
        n = s(64147),
        r = s(37265),
        d = s(24377),
        u = s(3343),
        h = s(27267),
        c = s(56570),
        _ = s(49483)
      function p(e, t) {
        null === e.firstChild
          ? (e.textContent = t)
          : (e.firstChild.nodeValue = t)
      }
      var m = s(57177),
        g = s(19291),
        b = s(40281),
        v = s(38780),
        w = s(88960),
        S = s(35236)
      const y = b.trackingModeIsAvailable ? 44 : 28
      var M = s(63276),
        f = s(80007),
        C = s(26996),
        E = s(4237),
        V = s(50959),
        L = s(45319)
      const W =
        ((A = C.Loader),
        (x = { staticPosition: !0, size: 'small' }),
        (e, t) =>
          ((e, t, s, i) => {
            const l = document.createElement('span'),
              o = (0, E.createRoot)(l)
            function a(e) {
              l.classList.toggle(L.blockHidden, !e)
            }
            a(!1)
            const { className: n } = i ?? {}
            return (
              n && l.classList.add(n),
              o.render((0, V.createElement)(t, s)),
              e.appendChild(l),
              {
                toggleVisibility: a,
                destroy: () => {
                  o.unmount()
                },
              }
            )
          })(e, A, x, t))
      var A,
        x,
        k = s(37850)
      const T = _.CheckMobile.any()
      var H, B
      !((e) => {
        ;(e[(e.Tiny = 1)] = 'Tiny'),
          (e[(e.Small = 2)] = 'Small'),
          (e[(e.Medium = 3)] = 'Medium'),
          (e[(e.Large = 4)] = 'Large')
      })(H || (H = {})),
        ((e) => {
          ;(e[(e.NoIntervalForMultiChart = 1)] = 'NoIntervalForMultiChart'),
            (e[(e.NoExchangeProviderAndInterval = 2)] =
              'NoExchangeProviderAndInterval'),
            (e[(e.AllVisible = 3)] = 'AllVisible')
        })(B || (B = {}))
      function I(e, t) {
        e.dataset.status = t ? 'loading' : void 0
      }
      class D {
        constructor(e, t, s) {
          ;(this._el = null),
            (this._firstBlockWrapper = null),
            (this._titlesWrapperEl = null),
            (this._titleContainers = []),
            (this._titleElements = []),
            (this._valuesElements = []),
            (this._actionsParentEl = null),
            (this._actionAdditionalWrapperEl = null),
            (this._actionElements = []),
            (this._accessibleButtons = []),
            (this._rowMode = 4),
            (this._titlesMode = 3),
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
            (this._toggleHiddenActions = null),
            (this._updateDisabledState = (e = this._disabled.value()) => {
              null !== this._el &&
                (this._el.classList.toggle(k.disabled, e),
                this._updateLoadingState(),
                this._updateStatusWidgetVisibility(e),
                this._updateTitleMaxWidth())
            }),
            (this._updateLoadingState = (e = this._loading.value()) => {
              if (null !== this._el) {
                this._el.classList.toggle(
                  k.eyeLoading,
                  e && !this._disabled.value(),
                ),
                  I(this._el, e)
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
                let s = 0
                return (i) => {
                  clearTimeout(s), i ? e() : (s = setTimeout(e, t))
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
          ;(this._withActions = s.withActions),
            (this._isMultipleLayout = s.isMultipleLayout.spawn()),
            this._render(),
            this._updateStates(),
            this._updateShowTitles(),
            this._updateShowValues(),
            this._updateShowLine(),
            (this._loader = W((0, o.ensureNotNull)(this._valuesParentEl), {
              className: k.loader,
            })),
            (this._customTextColor = s.customTextColor.spawn()),
            this._customTextColor.subscribe(
              this._updateCustomTextColor.bind(this),
            ),
            this._updateCustomTextColor(),
            this._withActions &&
              ((this._toggleHiddenActions = s.toggleHiddenActions),
              (this._showActionsHandler = (0, f.wrapHandlerWithPreventEvent)(
                this._showActions.bind(this),
              )),
              (this._hideActionsHandler = (0, f.wrapHandlerWithPreventEvent)(
                this._hideActions.bind(this),
              )),
              (this._selectedSourceHandler = (0, S.defaultPreventedHandler)(
                this._model.setSourceSelected.bind(this._model),
              )),
              null !== this._titlesWrapperEl &&
                (T ||
                  (this._titlesWrapperEl.addEventListener(
                    'mouseenter',
                    this._showActionsHandler,
                  ),
                  this._titlesWrapperEl.addEventListener(
                    'mouseleave',
                    this._hideActionsHandler,
                  )),
                this._mouseEventHandlers.push(
                  new S.MouseEventHandler(this._titlesWrapperEl, {
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
                T ||
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
          ;(this._toggleHiddenActions = null),
            this._disabled.destroy(),
            this._disabledOnInterval.destroy(),
            this._selected.destroy(),
            this._loading.destroy(),
            this._isTitleHidden.destroy(),
            this._isRowHidden.destroy(),
            this._customTextColor.destroy(),
            this._loader?.destroy(),
            this._isMultipleLayout.destroy(),
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
                (T ||
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
            ((this._actionElements = []),
            null !== this._actionAdditionalWrapperEl &&
              (this._withActions &&
                null !== this._showActionsHandler &&
                null !== this._hideActionsHandler &&
                !T &&
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
            this._hideInvisibleHover?.destroy(),
            this._hideValues?.destroy(),
            null !== this._resizeObserver &&
              (this._resizeObserver.disconnect(),
              (this._resizeObserver = null)),
            null !== this._el)
          ) {
            const e = this._el.parentNode
            e?.removeChild(this._el), (this._el = null)
          }
        }
        getElement() {
          return this._el
        }
        getHeight() {
          return null === this._el ? null : 24
        }
        updateMode(e, t) {
          ;(this._rowMode === e &&
            this._titlesMode === t &&
            null !== this._allButtonsWidth) ||
            (this._rowMode !== e &&
              ((this._rowMode = e), this._updateActionsVisibilitiesByMode()),
            this._titlesMode !== t &&
              ((this._titlesMode = t), this._updateTitlesVisibilitiesByMode()),
            this._updateAllButtonsWidth())
        }
        accessibleButtons() {
          return this._isRowHidden.value()
            ? []
            : this._accessibleButtons.filter(
                (e) => !e.classList.contains(L.blockHidden),
              )
        }
        showActions() {
          null === this._el ||
            this._el.classList.contains(k.withAction) ||
            this._showActions()
        }
        hideActions() {
          null !== this._el &&
            this._el.classList.contains(k.withAction) &&
            this._hideActions()
        }
        _updateActionsVisibilitiesByMode() {}
        _updateTitlesVisibilitiesByMode() {}
        _render() {
          this._renderTitles(),
            this._renderActions(),
            this._renderValues(),
            (this._el = document.createElement('div')),
            I(this._el, this._loading.value()),
            (this._firstBlockWrapper = document.createElement('div')),
            this._firstBlockWrapper.classList.add(k.noWrapWrapper),
            this._firstBlockWrapper.appendChild(
              (0, o.ensureNotNull)(this._titlesWrapperEl),
            ),
            null !== this._actionsParentEl &&
              this._firstBlockWrapper.appendChild(this._actionsParentEl),
            this._el.appendChild(this._firstBlockWrapper),
            this._el.appendChild((0, o.ensureNotNull)(this._valuesParentEl)),
            this._parentEl.append(this._el)
        }
        _renderTitles() {
          null === this._titlesWrapperEl &&
            ((this._titlesWrapperEl = document.createElement('div')),
            this._titlesWrapperEl.classList.add(k.titlesWrapper))
          for (let e = 0; e < this._titlesSpawns.length; e++) {
            const { wrapper: t, title: s } = this._renderTitle(
              this._titlesSpawns[e],
            )
            this._titlesWrapperEl.appendChild(t),
              this._titleContainers.push(t),
              this._titleElements.push(s)
          }
        }
        _renderTitle(e) {
          const { class: t, title: s, titleId: i, tooltip: l, onClick: o } = e,
            a = o,
            n = s.value() ?? '',
            r = document.createElement('div')
          r.classList.add(k.titleWrapper, t, k.withDot),
            (r.dataset.name = i),
            void 0 !== l &&
              (r.classList.add('apply-common-tooltip'),
              r.setAttribute('title', l))
          const d = document.createElement(a ? 'button' : 'div')
          if ((d.classList.add(k.title), void 0 !== o)) {
            r.classList.add(k.withAction)
            const e = (e) => {
              this._selectedSourceHandler?.(e), o(), a && d.blur()
            }
            this._mouseEventHandlers.push(
              new S.MouseEventHandler(
                r,
                {
                  mouseClickEvent: e,
                  tapEvent: _.CheckMobile.any() ? void 0 : e,
                },
                { ignoreClickAndTapOnDblClickOrDblTap: !0 },
              ),
            )
          }
          if (a) {
            const e = d
            this._makeItemAccessible(e, o, l ?? '')
          }
          return (
            n.length > 0
              ? d.appendChild(document.createTextNode(n))
              : (r.classList.add(L.blockHidden),
                d.classList.add(L.blockHidden)),
            r.appendChild(d),
            { wrapper: r, title: d }
          )
        }
        _makeItemAccessible(e, t, s) {
          '' !== s && e.setAttribute('aria-label', s),
            (e.type = 'button'),
            e.classList.add(k.accessible),
            (e.tabIndex = -1)
          const i = (t) => {
            switch (t.type) {
              case 'roving-tabindex:main-element':
                e.tabIndex = 0
                break
              case 'roving-tabindex:secondary-element':
                e.tabIndex = -1
            }
          }
          e.addEventListener('roving-tabindex:main-element', i),
            e.addEventListener('roving-tabindex:secondary-element', i),
            e.addEventListener('keydown', (e) => {
              const s = (0, u.hashFromEvent)(e)
              ;(13 !== s && 32 !== s) || (e.preventDefault(), t(e))
            }),
            this._accessibleButtons.push(e)
        }
        _renderActions() {
          if (!this._withActions) return
          null === this._actionsParentEl &&
            ((this._actionsParentEl = document.createElement('div')),
            this._actionsParentEl.classList.add(k.buttonsWrapper),
            (this._actionsParentEl.dataset.name = 'actions'),
            this._parentEl.append(this._actionsParentEl),
            (this._actionAdditionalWrapperEl = document.createElement('div')),
            this._actionAdditionalWrapperEl.classList.add(k.buttons),
            this._actionsParentEl.appendChild(this._actionAdditionalWrapperEl))
          const e = (0, o.ensureNotNull)(this._actionAdditionalWrapperEl)
          this._model.actions().forEach((t) => {
            const s = void 0 === t.disableAccessibility,
              i = {
                iconSize: b.trackingModeIsAvailable ? 'large' : 'small',
                tag: s ? 'button' : 'div',
                buttonClassName: k.button,
                wrapIconClassName: k.buttonIcon,
                hiddenClassName: L.blockHidden,
                blurOnClick: !!s || void 0,
              },
              l = (0, M.createActionElement)(t, i)
            s &&
              this._makeItemAccessible(
                l,
                (e) => {
                  t.action(e)
                },
                t.title?.value() ?? '',
              ),
              this._actionElements.push(l),
              e.appendChild(l)
          })
        }
        _initWrappersIfNotInitialized() {
          return (
            null === this._valuesParentEl &&
              ((this._valuesParentEl = document.createElement('div')),
              this._valuesParentEl.classList.add(k.valuesWrapper),
              (this._valuesAdditionalWrapperEl = document.createElement('div')),
              this._valuesAdditionalWrapperEl.classList.add(
                k.valuesAdditionalWrapper,
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
            (this._el.classList.contains(k.withAction) ||
              this._disabled.value() ||
              this._selected.value())
          )
        }
        _updateTitlesHandler(e, t) {
          const s = (0, o.ensureNotNull)(this._titleContainers[e]),
            i = (0, o.ensureNotNull)(this._titleElements[e]),
            l =
              0 === t.length || this._isTitleHiddenByMode(this._titlesSpawns[e])
          i.classList.toggle(L.blockHidden, l),
            s.classList.toggle(L.blockHidden, l),
            p(i, t),
            i.dispatchEvent(new CustomEvent('common-tooltip-update'))
        }
        _isTitleHiddenByMode(e) {
          return !1
        }
        _updateStates(e) {
          this._updateDisabledState(),
            this._updateDisabledOnIntervalState(),
            this._updateSelectedState(),
            this._updateLoadingState(),
            e && this._clearDisableState()
        }
        _updateValuesHTMLElHandler(e, t) {
          p((0, o.ensure)(this._valuesElements[e].value), t),
            this._updateShowValues()
        }
        _updateValueColorHandler(e, t = '') {
          ;(0, o.ensure)(this._valuesElements[e].value).style.color = t
        }
        _updateValueVisibleHandler(e, t) {
          const s = (0, o.ensure)(this._valuesElements[e].value).closest(
            `.${k.valueItem}`,
          )
          null !== s && s.classList.toggle(L.blockHidden, !t),
            this._updateShowValues()
        }
        _updateShowLine() {
          null !== this._el &&
            this._el.classList.toggle(L.blockHidden, this._isRowHidden.value())
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
              e.classList.contains(L.blockHidden),
            )
            e.classList.toggle(L.blockHidden, t)
          }
          e(this._valuesAdditionalWrapperEl), e(this._valuesParentEl)
        }
        _addStatusesWidget(e, t, s) {
          ;(this._statusesWrapper = document.createElement('div')),
            this._statusesWrapper.classList.add(k.statusesWrapper),
            e.classList.add(k.statusesWrapper__statuses),
            this._statusesWrapper.appendChild(e),
            (0, o.ensureNotNull)(this._firstBlockWrapper).appendChild(
              this._statusesWrapper,
            ),
            (this._hideInvisibleHover = t),
            this._hideInvisibleHover.subscribe(
              this._updateHideInvisibleHoverMode.bind(this),
              { callWithLast: !0 },
            ),
            (this._hideValues = s),
            this._hideValues.subscribe(this._updateHideValuesMode.bind(this), {
              callWithLast: !0,
            }),
            this._updateStatusWidgetVisibility(this._disabled.value()),
            (this._resizeObserver = new ResizeObserver(
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
          ;(this._allButtonsWidth = this._getButtonsCount() * y + 1),
            this._updateTitleMaxWidth()
        }
        _updateHideInvisibleHoverMode(e) {
          null !== this._el &&
            this._el.classList.toggle(k.hideInvisibleHover, e)
        }
        _updateHideValuesMode(e) {
          null !== this._el && this._el.classList.toggle(k.hideValues, e)
        }
        _showActions() {
          if (null === this._el || !this._withActions) return
          this._el.classList.add(k.withAction), this._toggleHiddenActions?.(!0)
          const e =
            this._valuesParentEl?.offsetTop === this._titlesWrapperEl?.offsetTop
          this._el.classList.toggle(k.withTail, e), this._updateTitleMaxWidth()
        }
        _hideActions() {
          null !== this._el &&
            this._withActions &&
            (this._el.classList.remove(k.withAction),
            this._toggleHiddenActions?.(!1),
            null !== this._valuesParentEl &&
              this._valuesParentEl.classList.remove(k.withTail),
            this._updateTitleMaxWidth())
        }
        _handlerRestrictTitleWidth(e) {
          if (
            null === this._actionsParentEl ||
            null === this._firstBlockWrapper
          )
            return
          let t = null,
            s = null
          for (const i of e)
            i.target === this._statusesWrapper && (t = i.contentRect.width),
              i.target === this._actionsParentEl && (s = i.contentRect.width)
          ;(t === this._lastStatusesWrapperWidth &&
            s === this._lastActionsWrapperWidth) ||
            (null !== t && (this._lastStatusesWrapperWidth = t),
            null !== s && (this._lastActionsWrapperWidth = s),
            this._updateTitleMaxWidth())
        }
        _clearDisableState() {
          null !== this._el &&
            (this._el.classList.remove(k.eyeLoading),
            this._el.classList.remove(k.disabled),
            this._updateStatusWidgetVisibility(this._disabled.value()),
            this._updateTitleMaxWidth())
        }
        _updateDisabledOnIntervalState() {
          this._el?.classList.toggle(
            k.disabledOnInterval,
            this._disabledOnInterval.value(),
          )
        }
        _updateSelectedState() {
          null !== this._el &&
            this._withActions &&
            this._el.classList.toggle(k.selected, this._selected.value())
        }
        _updateShowTitles() {
          null !== this._titlesWrapperEl &&
            (this._titlesWrapperEl.classList.toggle(
              L.blockHidden,
              this._isTitleHidden.value(),
            ),
            null !== this._actionsParentEl &&
              this._actionsParentEl.classList.toggle(
                L.blockHidden,
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
              .querySelectorAll(`.${k.button}`)
              [e].classList.toggle(
                L.blockHidden,
                !this._actionsSpawnArray[e].visible.value(),
              )
        }
        _updateActionTitle(e) {
          const t = this._actionsSpawnArray[e].title
          if (null === this._actionsParentEl || null === t) return
          const s = this._actionsParentEl.querySelectorAll(`.${k.button}`)[e]
          s.setAttribute('title', t.value()),
            s.hasAttribute('aria-label') &&
              s.setAttribute('aria-label', t.value()),
            s.dispatchEvent(new CustomEvent('common-tooltip-update'))
        }
        _updateCustomTextColor() {
          const e = this._customTextColor.value() || ''
          for (const t of this._titleContainers)
            null !== t && (t.style.color = e)
          const t = (0, o.ensureNotNull)(this._valuesParentEl).querySelectorAll(
            `.${k.valueTitle}`,
          )
          for (let s = 0; s < t.length; s++) t[s].style.color = e
          ;(0, o.ensureNotNull)(this._el).classList.toggle(
            k.withCustomTextColor,
            Boolean(e),
          )
        }
        _updateStatusWidgetVisibility(e) {
          null !== this._statusesWrapper &&
            this._statusesWrapper.classList.toggle(L.blockHidden, e)
        }
      }
      var P = s(50279),
        z = s(97754),
        N = s.n(z),
        R = s(39330),
        O = s(58492),
        F = s(82708),
        U = s(19938),
        G = s(59695)
      class Z {
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
                this._logoWrapper.classList.toggle(k.hidden, !e)
            }),
            (this._updateSymbolLogo = async (e) => {
              if (
                (null === this._logoWrapper && this._renderSymbolLogo(),
                0 !== this._lastDrawnLogos.length &&
                  0 !== e.length &&
                  (0, P.default)(this._lastDrawnLogos, e))
              )
                return
              const t = await ((s = e),
              Promise.all(
                s.map((e) =>
                  (0, U.getImage)(`symbol_logo_${e}`, e, $).then((e) =>
                    e.cloneNode(),
                  ),
                ),
              )).catch(() => [])
              var s
              switch (t.length) {
                case 0:
                  this._pairContainer?.classList.add(k.hidden),
                    this._logoContainer?.classList.add(G.hiddenCircleLogoClass),
                    this._updateSymbolLetter(),
                    this._symbolLetterContainer?.classList.remove(
                      G.hiddenCircleLogoClass,
                    ),
                    (this._lastDrawnLogos = e)
                  break
                case 1:
                  j(this._logoContainer, t[0]),
                    this._pairContainer?.classList.add(k.hidden),
                    this._logoContainer?.classList.remove(
                      G.hiddenCircleLogoClass,
                    ),
                    this._symbolLetterContainer?.classList.add(
                      G.hiddenCircleLogoClass,
                    ),
                    (this._lastDrawnLogos = e)
                  break
                case 2:
                  j(this._primaryLogo, t[0]),
                    j(this._secondaryLogo, t[1]),
                    this._pairContainer?.classList.remove(k.hidden),
                    this._logoContainer?.classList.add(G.hiddenCircleLogoClass),
                    this._symbolLetterContainer?.classList.add(
                      G.hiddenCircleLogoClass,
                    ),
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
          this._logoWrapper?.remove(),
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
            e.classList.add(k.logoWrapper)
            const t = (this._pairContainer = e.appendChild(
              document.createElement('span'),
            ))
            t.classList.add(k.pairContainer, k.hidden)
            const s = t.appendChild(document.createElement('span'))
            s.className = (0, R.getBlockStyleClasses)('xxxsmall')
            ;(this._secondaryLogo = s.appendChild(
              document.createElement('span'),
            )).className = N()((0, R.getLogoStyleClasses)('xxxsmall'), k.logo)
            ;(this._primaryLogo = s.appendChild(
              document.createElement('span'),
            )).className = N()((0, R.getLogoStyleClasses)('xxxsmall'), k.logo)
            ;(this._logoContainer = e.appendChild(
              document.createElement('span'),
            )).className = N()(
              (0, O.getStyleClasses)('xxxsmall'),
              k.logo,
              G.hiddenCircleLogoClass,
            )
            ;((this._symbolLetterContainer = e.appendChild(
              document.createElement('span'),
            )).className = N()((0, O.getStyleClasses)('xxxsmall'), k.logo)),
              this._updateSymbolLetter()
          }
          this._parentElement.insertBefore(
            this._logoWrapper,
            this._parentElement.firstChild,
          )
        }
        _updateSymbolLetter() {
          if (this._symbolLetterContainer) {
            const e = (0, F.safeShortName)(this._model.symbol() ?? '')[0]
            p(this._symbolLetterContainer, e)
          }
        }
      }
      function j(e, t) {
        e && e.replaceChildren(t)
      }
      function $(e) {
        ;(e.crossOrigin = ''), (e.decoding = 'async')
      }
      const Q = _.isSafari ? 'click' : 'auxclick'
      class K extends D {
        constructor(e, t, s) {
          super(e, t, s),
            (this._wheelClickHandler = null),
            (this._symbolLogoRenderer = null),
            (this._updateSymbolLogoRenderer = (e) => {
              c.enabled('show_symbol_logo_for_compare_studies') &&
                (this._symbolLogoRenderer?.destroy(),
                (this._symbolLogoRenderer = e
                  ? new Z(e, (0, o.ensureNotNull)(this._titleContainers[0]))
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
            (this._has5Buttons = this._model.isAbleShowSourceCode().spawn()),
            this._has5Buttons.subscribe(this._update5ButtonsStyles.bind(this), {
              callWithLast: !0,
            }),
            this._updateStates(!this._disabled.value()),
            s.statusWidgetEl &&
              this._addStatusesWidget(
                s.statusWidgetEl,
                s.hideInvisibleHover,
                s.hideValues,
              ),
            this._selected.subscribe(this._updateTitleMaxWidth.bind(this)),
            s.withActions &&
              ((this._wheelClickHandler = this._onWheelClicked.bind(this)),
              null !== this._titlesWrapperEl &&
                this._titlesWrapperEl.addEventListener(
                  Q,
                  this._wheelClickHandler,
                ))
          const i = e.symbolLogoViewModel().value()
          this._updateSymbolLogoRenderer(i),
            e.symbolLogoViewModel().subscribe(this._updateSymbolLogoRenderer)
        }
        destroy() {
          this._model
            .symbolLogoViewModel()
            .unsubscribe(this._updateSymbolLogoRenderer),
            this._symbolLogoRenderer?.destroy(),
            this._has5Buttons.destroy(),
            this._globalRowVisibility && this._globalRowVisibility.destroy(),
            null !== this._wheelClickHandler &&
              null !== this._titlesWrapperEl &&
              this._titlesWrapperEl.removeEventListener(
                Q,
                this._wheelClickHandler,
              ),
            super.destroy()
        }
        accessibleButtons() {
          return this._globalRowVisibility.value()
            ? super.accessibleButtons()
            : []
        }
        _updateActionsVisibilitiesByMode() {
          if (!this._withActions) return
          const e = this._model.actions(),
            t = []
          let s = []
          if (2 === this._rowMode || 1 === this._rowMode)
            e[0].visible.value() && t.push(this._actionElements[0]),
              e[this._actionElements.length - 1].visible.value() &&
                t.push(this._actionElements[this._actionElements.length - 1]),
              (s = this._actionElements.slice(
                1,
                this._actionElements.length - 1,
              ))
          else
            for (let s = 0; s < this._actionElements.length - 1; s++)
              e[s].visible.value() && t.push(this._actionElements[s])
          s.forEach((e) => e.classList.toggle(L.blockHidden, !0)),
            t.forEach((e) => e.classList.toggle(L.blockHidden, !1))
        }
        _updateShowLine() {
          if (null === this._el || !this._canUpdateRowVisibility) return
          const e = !this._globalRowVisibility.value()
          e
            ? this._el.classList.toggle(L.blockHidden, e)
            : super._updateShowLine()
        }
        _getButtonsCount() {
          switch (this._rowMode) {
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
          e.classList.add(k.item, k.study),
            (e.dataset.name = 'legend-source-item'),
            (e.dataset.entityId = this._model.getSource().id()),
            e.setAttribute('role', 'toolbar')
        }
        _createTitlesSpawns() {
          const e = this._model.titles(),
            t = this._model.titleActions()
          this._titlesSpawns = [
            {
              ...t.title,
              title: e.title.spawn(),
              class: k.mainTitle,
              titleId: 'legend-source-title',
            },
            {
              ...t.args,
              title: e.args.spawn(),
              class: k.descTitle,
              titleId: 'legend-source-description',
            },
          ]
        }
        _renderValues() {
          const e = this._initWrappersIfNotInitialized(),
            t = this._values.value()
          for (const s of t) {
            const t = document.createElement('div')
            ;(t.dataset.testIdValueTitle = s.title.value()),
              t.classList.add(k.valueItem),
              t.classList.toggle(L.blockHidden, !s.visible.value())
            const i = document.createElement('div')
            i.classList.add(k.valueValue),
              (i.style.color = s.color.value() || ''),
              i.appendChild(document.createTextNode(s.value.value()))
            const l = s.title.value()
            void 0 !== l &&
              (i.classList.add('apply-common-tooltip'), (i.title = l)),
              t.appendChild(i),
              this._valuesElements.push({ value: i }),
              e.appendChild(t)
          }
        }
        _updateValuesTitleHTMLElHandler(e, t = '') {
          const s = (0, o.ensure)(this._valuesElements[e].value)
          s.classList.toggle('apply-common-tooltip', 0 !== t.length),
            (s.title = t)
        }
        _update5ButtonsStyles(e) {
          null !== this._el &&
            (this._el.classList.toggle(k.has5Buttons, e),
            this._updateAllButtonsWidth())
        }
        _onWheelClicked(e) {
          1 === e.button && this._model.onRemoveSource()
        }
      }
      class q extends D {
        constructor(e, t, s) {
          super(e, t, s),
            (this._symbolLogoRenderer = null),
            (this._clientHeight = null),
            (this._updateLinkedState = void 0),
            (this._flagged = this._model.flagged().spawn()),
            this._flagged.subscribe(this._updateFlaggedState.bind(this)),
            this._updateStates(),
            s.statusWidgetEl &&
              this._addStatusesWidget(
                s.statusWidgetEl,
                s.hideInvisibleHover,
                s.hideValues,
              ),
            this._selected.subscribe(this._updateTitleMaxWidth.bind(this))
          const i = e.symbolLogoViewModel().value()
          i &&
            (this._symbolLogoRenderer = new Z(
              i,
              (0, o.ensureNotNull)(this._titleContainers[0]),
            ))
        }
        destroy() {
          super.destroy(),
            this._flagged?.destroy(),
            this._symbolLogoRenderer?.destroy()
        }
        getHeight() {
          return null === this._el
            ? null
            : (null === this._clientHeight &&
                ((this._clientHeight = this._el.clientHeight),
                0 === this._clientHeight && (this._clientHeight = null)),
              this._clientHeight)
        }
        _updateActionsVisibilitiesByMode() {
          if (!this._withActions) return
          const e = []
          let t = []
          const s = this._model.actions()
          if (1 === this._rowMode)
            s[this._actionElements.length - 1].visible.value() &&
              e.push(this._actionElements[this._actionElements.length - 1]),
              (t = this._actionElements.slice(
                0,
                this._actionElements.length - 1,
              ))
          else
            for (let t = 0; t < this._actionElements.length; t++)
              s[t].visible.value() && e.push(this._actionElements[t])
          t.forEach((e) => e.classList.toggle(L.blockHidden, !0)),
            e.forEach((e) => e.classList.toggle(L.blockHidden, !1))
        }
        _updateTitlesVisibilitiesByMode() {}
        _isTitleHiddenByMode(e) {
          const t = e.titleId
          return 'legend-source-interval' !== t &&
            'legend-source-provider' !== t &&
            'legend-source-exchange' !== t
            ? super._isTitleHiddenByMode(e)
            : 'legend-source-interval' === t && this._isMultipleLayout.value()
              ? 1 === this._titlesMode
              : 3 !== this._titlesMode
        }
        _hideTitleAndItsContainerIfRequired(e) {
          const t = this._getTitleIndexByDataName(e)
          if (-1 === t) return
          const s = this._titlesSpawns[t],
            i = this._titleContainers[t],
            l = this._titleElements[t],
            o = 0 === s.title.value().length || this._isTitleHiddenByMode(s)
          i?.classList.toggle(L.blockHidden, o),
            l?.classList.toggle(L.blockHidden, o)
        }
        _getButtonsCount() {
          return 1 === this._rowMode ? 1 : 3
        }
        _render() {
          super._render()
          const e = (0, o.ensureNotNull)(this._el)
          e.classList.add(k.item, k.series),
            e.classList.toggle(
              k.onlyOneButtonCanBeStick,
              this._model.isOneButtonCanBeStick(),
            ),
            (e.dataset.name = 'legend-series-item'),
            e.setAttribute('role', 'toolbar')
        }
        _updateStates() {
          super._updateStates(), this._updateFlaggedState()
        }
        _renderValues() {
          const e = this._initWrappersIfNotInitialized(),
            t = this._values.value()
          for (const s of t) {
            const t = document.createElement('div')
            ;(t.dataset.testIdValueTitle = s.title.value()),
              t.classList.add(k.valueItem),
              t.classList.toggle(L.blockHidden, !s.visible.value()),
              t.classList.toggle(k.unimportant, s.unimportant.value())
            const i = document.createElement('div'),
              l = s.title.value() || ''
            i.classList.add(k.valueTitle),
              i.classList.toggle(L.blockHidden, 0 === l.length),
              i.appendChild(document.createTextNode(l)),
              t.appendChild(i)
            const o = document.createElement('div')
            o.classList.add(k.valueValue),
              (o.style.color = s.color.value() || ''),
              o.appendChild(document.createTextNode(s.value.value())),
              t.appendChild(o),
              this._valuesElements.push({ title: i, value: o }),
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
              class: k.mainTitle,
              titleId: 'legend-source-title',
            },
            {
              ...t.description,
              title: e.description.spawn(),
              class: k.descTitle,
              titleId: 'legend-source-description',
            },
            {
              ...t.interval,
              title: e.interval.spawn(),
              class: k.intervalTitle,
              titleId: 'legend-source-interval',
            },
            {
              ...t.provider,
              title: e.provider.spawn(),
              class: k.providerTitle,
              titleId: 'legend-source-provider',
            },
            {
              ...t.exchange,
              title: e.exchange.spawn(),
              class: k.exchangeTitle,
              titleId: 'legend-source-exchange',
            },
            {
              ...t.chartStyle,
              title: e.chartStyle.spawn(),
              class: k.styleTitle,
              titleId: 'legend-source-style',
            },
            {
              ...t.priceSource,
              title: e.priceSource.spawn(),
              class: k.priceSourceTitle,
              titleId: 'legend-source-price-source',
            },
          ]
        }
        _updateValuesTitleHTMLElHandler(e, t = '') {
          const s = (0, o.ensure)(this._valuesElements[e].title)
          p(s, t),
            s.classList.toggle(L.blockHidden, 0 === t.length),
            this._updateShowValues()
        }
        _isWidthButtonsMode() {
          return (
            null !== this._el &&
            ((void 0 !== this._flagged && Boolean(this._flagged.value())) ||
              this._linked?.value() ||
              super._isWidthButtonsMode())
          )
        }
        _updateFlaggedState() {
          if (void 0 === this._flagged) return
          ;(0, o.ensureNotNull)(this._el).classList.toggle(
            k.flagged,
            Boolean(this._flagged.value()),
          ),
            this._updateTitleMaxWidth()
        }
        _getTitleIndexByDataName(e) {
          return this._titlesSpawns.findIndex((t) => t.titleId === e)
        }
      }
      var J = s(11542),
        X = s(51768)
      function Y(e) {
        ;(0, X.trackEvent)('GUI', 'Legend action', e)
      }
      var ee,
        te,
        se = s(47036),
        ie = s(62920),
        le = s(65300),
        oe = s(36885)
      !((e) => {
        ;(e[(e.Default = 0)] = 'Default'), (e[(e.Micro = 1)] = 'Micro')
      })(ee || (ee = {}))
      class ae {
        constructor(e, t, s) {
          ;(this._wrapperTogger = null),
            (this._el = null),
            (this._counterEl = null),
            (this._arrowIconEL = null),
            (this._objectTreeEl = null),
            (this._mode = 0),
            (this._accessibleButtons = []),
            (this._parentEl = e),
            (this._themedColor = t.spawn()),
            this._themedColor.subscribe(this._updateThemedColor.bind(this)),
            (this._showCollapserWithOneIndicator =
              s.showCollapserWithOneIndicator.spawn()),
            this._showCollapserWithOneIndicator.subscribe(
              this._updateVisibility.bind(this),
            ),
            (this._sourceCount = s.visibleDataSourceCount.spawn()),
            this._sourceCount.subscribe(() => {
              this._updateSourceCount(), this._updateVisibility()
            }),
            (this._isStateOpen = s.isDataSourcesCollapsed.spawn()),
            this._isStateOpen.subscribe(() => {
              this._updateState(), this._updateVisibility()
            }),
            (this._isMainPane = s.isMainPane.spawn()),
            this._isMainPane.subscribe(
              this._updateObjectTreeVisibility.bind(this),
            ),
            (this._isPaneCollapsed = s.isPaneCollapsed.spawn()),
            this._isPaneCollapsed.subscribe(this._updateVisibility.bind(this)),
            (this._combinedStatusWidgetEl =
              s.combinedStatusWidget.getElement()),
            (this._combinedStatusWidgetVisibility = s.combinedStatusWidget
              .visibility()
              .spawn()),
            this._combinedStatusWidgetVisibility.subscribe(
              this._updateVisibility.bind(this),
            ),
            this._render(),
            this._updateState(),
            this._updateVisibility(),
            this._updateThemedColor(this._themedColor.value()),
            this._updateObjectTreeVisibility(this._isMainPane.value()),
            (this._toggleStateHandler = (e) => {
              null !== this._el &&
                (e.cancelable && e.preventDefault(),
                e instanceof KeyboardEvent || this._el?.blur(),
                1 !== this._mode
                  ? s.onCollapseDataSources()
                  : s.onShowObjectsTreeDialog())
            }),
            null !== this._el &&
              (this._el.addEventListener('touchend', this._toggleStateHandler),
              this._el.addEventListener('click', this._toggleStateHandler),
              this._el.addEventListener('contextmenu', (e) => {
                e.preventDefault(), e.stopPropagation()
              })),
            this._updateSourceCount()
        }
        destroy() {
          this._isPaneCollapsed.destroy(),
            this._sourceCount.destroy(),
            this._isStateOpen.destroy(),
            this._showCollapserWithOneIndicator.destroy(),
            this._combinedStatusWidgetVisibility.destroy(),
            null !== this._objectTreeEl && (this._objectTreeEl = null),
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
        accessibleButtons() {
          return null === this._el ||
            (this._el.classList.contains(k.onlyOneSourceShown) &&
              1 !== this._mode)
            ? []
            : this._accessibleButtons
        }
        setMode(e) {
          ;(this._mode = e ? 1 : 0), this._updateTooltip()
        }
        _render() {
          ;(this._wrapperTogger = document.createElement('div')),
            this._wrapperTogger.classList.add(k.togglerWrapper),
            (this._el = document.createElement('button')),
            (this._el.className = `${k.toggler} apply-common-tooltip`)
          const e = this._el
          ;(e.type = 'button'), e.classList.add(k.accessible), (e.tabIndex = -1)
          const t = (t) => {
            if (null !== e)
              switch (t.type) {
                case 'roving-tabindex:main-element':
                  e.tabIndex = 0
                  break
                case 'roving-tabindex:secondary-element':
                  e.tabIndex = -1
              }
          }
          e.addEventListener('roving-tabindex:main-element', t),
            e.addEventListener('roving-tabindex:secondary-element', t),
            e.addEventListener('keydown', (e) => {
              const t = (0, u.hashFromEvent)(e)
              ;(13 !== t && 32 !== t) ||
                (e.preventDefault(), this._toggleStateHandler(e))
            }),
            this._accessibleButtons.push(e),
            (this._arrowIconEL = document.createElement('div')),
            this._arrowIconEL.classList.add(k.iconArrow),
            (this._arrowIconEL.innerHTML = b.trackingModeIsAvailable ? ie : se),
            this._el.appendChild(this._arrowIconEL),
            (this._objectTreeEl = document.createElement('div')),
            this._objectTreeEl.classList.add(k.objectTree),
            (this._objectTreeEl.innerHTML = b.trackingModeIsAvailable
              ? oe
              : le),
            this._el.appendChild(this._objectTreeEl),
            (this._counterEl = document.createElement('div')),
            this._counterEl.classList.add(k.counter),
            this._counterEl.appendChild(
              document.createTextNode(String(this._sourceCount.value())),
            ),
            this._el.appendChild(this._counterEl),
            this._wrapperTogger.appendChild(this._el)
          const s = document.createElement('div')
          s.classList.add(k.statusesWrapper),
            this._combinedStatusWidgetEl.classList.add(
              k.statusesWrapper__statusesWithToggle,
            ),
            s.appendChild(this._combinedStatusWidgetEl),
            this._wrapperTogger.appendChild(s),
            this._parentEl.appendChild(this._wrapperTogger)
        }
        _updateThemedColor(e) {
          if (null !== this._el)
            if (e.length > 0) {
              const [t, s, i] = (0, d.parseRgb)(e)
              this._el.style.backgroundColor = (0, d.rgbaToString)([
                t,
                s,
                i,
                (0, d.normalizeAlphaComponent)(0.8),
              ])
            } else this._el.style.removeProperty('background-color')
        }
        _updateSourceCount() {
          const e = this._sourceCount.value(),
            t = (0, o.ensureNotNull)(this._counterEl)
          p(t, String(e)),
            t.classList.toggle(L.blockHidden, e <= 1),
            this._parentEl.classList.toggle(k.saveArrowWidth, e <= 1)
        }
        _updateVisibility() {
          const e = this._sourceCount.value(),
            t = (0, o.ensureNotNull)(this._el),
            s =
              1 === e &&
              !this._showCollapserWithOneIndicator.value() &&
              (this._isStateOpen.value() ||
                !this._combinedStatusWidgetVisibility.value()),
            i =
              e < 1 ||
              (this._isPaneCollapsed.value() &&
                (this._isMainPane.value() || this._isStateOpen.value()))
          t.classList.toggle(L.blockHidden, !!i),
            t.classList.toggle(k.onlyOneSourceShown, s),
            (0, o.ensureNotNull)(this._wrapperTogger).classList.toggle(
              L.blockHidden,
              s,
            ),
            (0, o.ensureNotNull)(this._combinedStatusWidgetEl).classList.toggle(
              L.blockHidden,
              this._isStateOpen.value(),
            )
        }
        _updateState() {
          const e = !this._isStateOpen.value()
          this._parentEl.classList.toggle(k.closed, e),
            this._updateTooltip(),
            Y((e ? 'Hide' : 'Show') + ' not main sources')
        }
        _tooltip() {
          if (1 === this._mode) return J.t(null, void 0, s(85786))
          const e = this._sourceCount.value(),
            t = J.t(
              null,
              { plural: 'Hide indicators legend', count: e },
              s(46960),
            ),
            i = J.t(
              null,
              { plural: 'Show indicators legend', count: e },
              s(36553),
            )
          return this._isStateOpen.value() ? t : i
        }
        _updateTooltip() {
          if (null !== this._el) {
            const e = this._tooltip()
            this._el.setAttribute('title', e),
              this._el.setAttribute('aria-label', e),
              this._el.dispatchEvent(new CustomEvent('common-tooltip-update'))
          }
        }
        _updateObjectTreeVisibility(e) {
          ;(0, o.ensureNotNull)(this._el).classList.toggle(
            k.objectsTreeCanBeShown,
            e,
          )
        }
      }
      !((e) => {
        ;(e[(e.Medium = 222)] = 'Medium'),
          (e[(e.Small = 205)] = 'Small'),
          (e[(e.Tiny = 133)] = 'Tiny'),
          (e[(e.HideUnimportantValues = 272)] = 'HideUnimportantValues'),
          (e[(e.SeriesDirectionColumn = 542)] = 'SeriesDirectionColumn'),
          (e[(e.HideExchangeIntevalProvider = 442)] =
            'HideExchangeIntevalProvider'),
          (e[(e.HideIntervalMultiChart = 192)] = 'HideIntervalMultiChart')
      })(te || (te = {}))
      const ne = c.enabled('object_tree_legend_mode'),
        re = [27, 9, 37, 39, 38, 40]
      class de {
        constructor(e, t) {
          ;(this._mode = 4),
            (this._renderToggler = null),
            (this._mainDataSourceRenderer = null),
            (this._dataSourceRenderers = []),
            (this._parentEl = document.createElement('div')),
            (this._mainDataSourceEl = null),
            (this._dataSourcesEl = null),
            (this._dataSourcesAdditionalWrapperEl = null),
            (this._collapsedDataSourcesWrapperEl = null),
            (this._collapsedDataSourcesEl = null),
            (this._outsideEventForCollapsedTooltip = null),
            (this._onKeyboardNavigationActivationBound =
              this._onKeyboardNavigationActivation.bind(this)),
            (this._onIsDataSourcesCollapsedBound =
              this._onIsDataSourcesCollapsed.bind(this)),
            (this._focusEventAbortController = null),
            (this._toggleHiddenActionsTimoutID = null),
            (this._toggleHiddenActions = (e) => {
              this._toggleHiddenActionsTimoutID &&
                (clearTimeout(this._toggleHiddenActionsTimoutID),
                (this._toggleHiddenActionsTimoutID = null)),
                e
                  ? this._parentEl.classList.toggle(
                      k.legend_withHiddenActions,
                      e,
                    )
                  : (this._toggleHiddenActionsTimoutID = setTimeout(
                      () =>
                        this._parentEl.classList.toggle(
                          k.legend_withHiddenActions,
                          e,
                        ),
                      100,
                    ))
            }),
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
            (this._collapsedDataSourcesStatusWidgetElement =
              e.combinedStatusWidget.getElement()),
            (this._showCollapsedDataSourcesTooltipHandler =
              this._showCollapsedDataSourcesTooltip.bind(this)),
            this._parentEl.classList.add(k.legend),
            this._parentEl.classList.toggle(
              k.noWrap,
              !b.trackingModeIsAvailable,
            ),
            this._parentEl.classList.toggle(
              k.noActions,
              !this._options.withActions,
            ),
            this._parentEl.classList.toggle(
              k.touchMode,
              b.trackingModeIsAvailable,
            ),
            this._parentEl.classList.toggle(
              k.wrappable,
              !this._hideAllExceptFirstLine.value(),
            ),
            (this._parentEl.dataset.name = 'legend'),
            this._parentEl.setAttribute('data-tooltip-show-on-focus', 'true'),
            this._parentEl.style.setProperty(
              '--legend-source-item-button-width',
              `${y}px`,
            )
          const s = (t) => {
            t.preventDefault(), e.showLegendWidgetContextMenu(t)
          }
          ;(this._mouseEventHandler = new S.MouseEventHandler(this._parentEl, {
            contextMenuEvent: s,
            touchContextMenuEvent: s,
          })),
            window.addEventListener(
              'keyboard-navigation-activation',
              this._onKeyboardNavigationActivationBound,
            ),
            this._parentEl.addEventListener(
              'keydown',
              this._handleKeyDown.bind(this),
            ),
            this._options.onLayoutChanged.subscribe(this, this._onLayoutChanged)
        }
        destroy() {
          this._focusEventAbortController?.abort()
          const e = document.activeElement
          let t = -1
          if (
            de._wasKeyboardNavigationActivated &&
            e instanceof HTMLButtonElement
          ) {
            null !== this._getRowRendererByChild(e) &&
              (t = (0, g.queryTabbableElements)(document.body).indexOf(e))
          }
          if (
            (this._isStudiesLegendHidden.destroy(),
            this._isAllLegendHidden.destroy(),
            this._hideAllExceptFirstLine.destroy(),
            this._themedColor.destroy(),
            this._showBackground.destroy(),
            this._backgroundTransparency.destroy(),
            this._collapsedDataSourcesCountSpawn.destroy(),
            b.trackingModeIsAvailable &&
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
            this._togglerOptions.isDataSourcesCollapsed.unsubscribe(
              this._onIsDataSourcesCollapsedBound,
            ),
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
          if (
            (this._mouseEventHandler.destroy(),
            (this._parentEl.innerHTML = ''),
            delete this._parentEl,
            window.removeEventListener(
              'keyboard-navigation-activation',
              this._onKeyboardNavigationActivationBound,
            ),
            -1 !== t)
          ) {
            let e
            window.dispatchEvent(
              new CustomEvent('keyboard-navigation-activation', {
                bubbles: !0,
              }),
            )
            const s = (0, g.queryTabbableElements)(document.body)
            ;(e = t === s.length ? s[0] : s[t]), e && e.focus()
          }
        }
        addCustomWidget(e, t) {
          if (0 === t.block) {
            this._renderMainDataSourceEl()
            const s = (0, o.ensureNotNull)(this._mainDataSourceEl)
            1 === t.position && e.renderTo(s, s.firstChild),
              0 === t.position && e.renderTo(s)
          }
          if (1 === t.block) {
            this._renderDataSourcesEl()
            const s = (0, o.ensureNotNull)(this._dataSourcesAdditionalWrapperEl)
            1 === t.position && e.renderTo(s, s.firstChild),
              0 === t.position && e.renderTo(s)
          }
        }
        firstTitle() {
          return this._parentEl.firstElementChild
        }
        getElement() {
          return this._parentEl
        }
        updateMode(e) {
          const t = ne && e < 133 ? 1 : e < 205 ? 2 : e < 222 ? 3 : 4,
            s = e < 192 ? 1 : e < 442 ? 2 : 3
          ;(this._mode = t),
            null !== this._mainDataSourceRenderer &&
              this._mainDataSourceRenderer.updateMode(t, s)
          for (const e of this._dataSourceRenderers) e.updateMode(t, s)
          this._parentEl.classList.toggle(k.medium, 3 === t),
            this._parentEl.classList.toggle(k.minimized, 2 === t),
            this._parentEl.classList.toggle(k.micro, 1 === t),
            null !== this._renderToggler && this._renderToggler.setMode(1 === t)
          const i =
            !this._hideAllExceptFirstLine.value() &&
            (b.trackingModeIsAvailable || e < 542)
          this._parentEl.classList.toggle(k.directionColumn, i),
            this._parentEl.classList.toggle(
              k.hideUniportantValueItems,
              !_.CheckMobile.any() && e <= 272,
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
            this._mainDataSourceEl.classList.add(k.legendMainSourceWrapper),
            this._parentEl.insertBefore(
              this._mainDataSourceEl,
              this._dataSourcesEl,
            ))
        }
        _renderDataSourcesEl() {
          null === this._dataSourcesEl &&
            ((this._dataSourcesEl = document.createElement('div')),
            this._dataSourcesEl.classList.add(k.sourcesWrapper),
            this._renderToggle(this._dataSourcesEl),
            (this._dataSourcesAdditionalWrapperEl =
              document.createElement('div')),
            this._dataSourcesAdditionalWrapperEl.classList.add(k.sources),
            this._dataSourcesEl.appendChild(
              this._dataSourcesAdditionalWrapperEl,
            ),
            this._renderCollapsedCounter(this._dataSourcesAdditionalWrapperEl),
            this._parentEl.appendChild(this._dataSourcesEl))
        }
        _renderToggle(e) {
          this._options.showToggleButton &&
            (this._renderToggler = new ae(
              e,
              this._options.themedColor,
              this._togglerOptions,
            ))
        }
        _onIsDataSourcesCollapsed(e) {
          if (e) {
            const e = this._getAllAccessibleButtons()
            if (0 === e.filter((e) => e.tabIndex >= 0).length) {
              const t = this._getRowRendererByChild(e[0])
              t && this._makeRowElementTheMainOne(e[0], t)
            }
            return
          }
          if (
            0 !==
            (this._mainDataSourceRenderer?.accessibleButtons() || []).filter(
              (e) => e.tabIndex >= 0,
            ).length
          )
            return
          const t = []
          this._dataSourceRenderers.forEach((e) =>
            t.push(...e.accessibleButtons()),
          )
          const s = t.filter((e) => e.tabIndex >= 0)
          if (0 !== s.length) {
            this._focusEventAbortController &&
              this._focusEventAbortController.abort(),
              s.forEach((e) => (0, m.becomeSecondaryElement)(e))
            let e = null,
              t = null
            if (this._mainDataSourceRenderer) {
              const s = this._mainDataSourceRenderer.accessibleButtons()
              s.length > 0 && ((e = s[0]), (t = this._mainDataSourceRenderer))
            }
            null === e &&
              this._renderToggler &&
              ((e = this._renderToggler.accessibleButtons()[0]),
              (t = this._renderToggler)),
              e && t && this._makeRowElementTheMainOne(e, t)
          }
        }
        _renderCollapsedCounter(e) {
          ;(this._collapsedDataSourcesWrapperEl =
            document.createElement('div')),
            (this._collapsedDataSourcesWrapperEl.className = `${k.item} ${k.last}`),
            (this._collapsedDataSourcesEl = document.createElement('span')),
            (this._collapsedDataSourcesEl.className = `${k.text} apply-common-tooltip`),
            this._collapsedDataSourcesWrapperEl.append(
              this._collapsedDataSourcesEl,
            )
          const t = document.createElement('div')
          t.classList.add(k.statusesWrapper),
            this._collapsedDataSourcesStatusWidgetElement.classList.add(
              k.statusesWrapper__statuses,
            ),
            t.appendChild(this._collapsedDataSourcesStatusWidgetElement),
            this._collapsedDataSourcesWrapperEl.appendChild(t),
            e.append(this._collapsedDataSourcesWrapperEl),
            b.trackingModeIsAvailable &&
              this._collapsedDataSourcesWrapperEl.addEventListener(
                'touchend',
                this._showCollapsedDataSourcesTooltipHandler,
              ),
            this._updateCollapsedSourcesCount(
              this._collapsedDataSourcesCountSpawn.value(),
            )
        }
        _showCollapsedDataSourcesTooltip() {
          ;(0, v.showOnElement)(this._collapsedDataSourcesEl, {
            text: this._options.collapsedDataSourcesTitle.value(),
          }),
            this._addOutsideEventForHideTooltip()
        }
        _addOutsideEventForHideTooltip() {
          null !== this._outsideEventForCollapsedTooltip &&
            this._outsideEventForCollapsedTooltip(),
            (this._outsideEventForCollapsedTooltip = (0,
            h.addOutsideEventListener)(
              new CustomEvent('timestamp').timeStamp,
              this._collapsedDataSourcesWrapperEl,
              () => {
                null !== this._outsideEventForCollapsedTooltip &&
                  this._outsideEventForCollapsedTooltip(),
                  (0, v.hide)()
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
            L.blockHidden,
            t,
          ),
            t ||
              (p(this._collapsedDataSourcesEl, `+${e}`),
              this._collapsedDataSourcesEl.setAttribute(
                'title',
                this._options.collapsedDataSourcesTitle.value(),
              ))
        }
        _updateLegendVisibility() {
          let e
          const t =
            de._wasKeyboardNavigationActivated &&
            (this._isAllLegendHidden.value() ||
              this._isStudiesLegendHidden.value())
          if (t) {
            e = this._getAllAccessibleButtons().filter(
              (e) => e.tabIndex >= 0,
            )[0]
          }
          if (
            (this._parentEl.classList.toggle(
              L.blockHidden,
              this._isAllLegendHidden.value(),
            ),
            null !== this._dataSourcesEl &&
              this._dataSourcesEl.classList.toggle(
                L.blockHidden,
                this._isStudiesLegendHidden.value(),
              ),
            t)
          ) {
            const t = this._getAllAccessibleButtons()
            if (e && t.includes(e)) return
            if ((e && (0, m.becomeSecondaryElement)(e), 0 !== t.length)) {
              const e = this._getRowRendererByChild(t[0])
              e && this._makeRowElementTheMainOne(t[0], e)
            }
          }
        }
        _updateAllHiddenExeptFirstLine() {
          this._parentEl.classList.toggle(
            k.wrappable,
            !this._hideAllExceptFirstLine.value(),
          )
        }
        _setCustomBg() {
          const e = this._showBackground.value(),
            t = this._themedColor.value(),
            s = this._backgroundTransparency.value()
          let i = ''
          if (e) {
            const [e, l, o] = (0, d.parseRgb)(t)
            i = (0, d.rgbaToString)([
              e,
              l,
              o,
              (0, d.normalizeAlphaComponent)(1 - s / 100),
            ])
          }
          this._parentEl.style.color = i
        }
        _onLayoutChanged(e) {
          const {
              newMainSource: t,
              removedDataSources: s,
              addedDataSources: i,
              movedDataSources: l,
            } = e,
            o = document.activeElement
          let a = -1,
            n = -1
          const r =
            null === this._mainDataSourceRenderer &&
            0 === this._dataSourceRenderers.length
          if (
            de._wasKeyboardNavigationActivated &&
            o instanceof HTMLButtonElement
          ) {
            const e = this._getRowRenderers(),
              l = e.find((e) => e.accessibleButtons().includes(o))
            if (void 0 !== l) {
              const r = l === this._mainDataSourceRenderer && null === t,
                d =
                  l instanceof K &&
                  s.includes(this._dataSourceRenderers.indexOf(l))
              if (r || d) {
                a = e.indexOf(l)
                const r = (0, g.queryTabbableElements)(document.body).indexOf(o)
                n =
                  0 !== i.length ||
                  ((void 0 !== t || null !== this._mainDataSourceRenderer) &&
                    null !== t) ||
                  (s.length !== this._dataSourceRenderers.length &&
                    0 !== this._dataSourceRenderers.length)
                    ? r + 1
                    : r
              }
            }
          }
          void 0 !== t &&
            (null !== t
              ? this._addMainDataSource(t.model, t.statusWidget)
              : (this._mainDataSourceRenderer?.destroy(),
                (this._mainDataSourceRenderer = null)))
          const d = []
          if (
            (l.forEach((e) => {
              d.push({
                renderer: this._dataSourceRenderers[e.oldIndex],
                newIndex: e.newIndex,
              })
            }),
            d.sort((e, t) => e.newIndex - t.newIndex),
            s.forEach((e) => {
              this._dataSourceRenderers.splice(e, 1)[0].destroy()
            }),
            0 !== i.length &&
              (this._renderDataSourcesEl(),
              i.forEach((e) => {
                this._addDataSource(e.model, e.statusWidget, e.index)
              })),
            0 !== d.length &&
              (this._renderDataSourcesEl(),
              d.forEach((e) => {
                this._moveDataSource(e.renderer, e.newIndex)
              })),
            de._wasKeyboardNavigationActivated &&
              r &&
              (null !== this._mainDataSourceRenderer ||
                this._dataSourceRenderers.length) &&
              window.dispatchEvent(
                new CustomEvent('keyboard-navigation-activation', {
                  bubbles: !0,
                }),
              ),
            -1 !== a)
          ) {
            let e, t
            const s = this._getRowRenderers()
            while (a < s.length) {
              const i = s[a],
                l = i.accessibleButtons()
              if (l.length > 0) {
                ;(e = l[0]), (t = i)
                break
              }
              a++
            }
            if (e && t) this._changeFocusElement(e, t)
            else if (-1 !== n) {
              window.dispatchEvent(
                new CustomEvent('keyboard-navigation-activation', {
                  bubbles: !0,
                }),
              )
              const t = (0, g.queryTabbableElements)(document.body)
              ;(e = n === t.length ? t[0] : t[n]),
                e && (o && (0, m.becomeSecondaryElement)(o), e.focus())
            }
          }
        }
        _addMainDataSource(e, t) {
          this._renderMainDataSourceEl(),
            (this._mainDataSourceRenderer = new q(
              e,
              (0, o.ensureNotNull)(this._mainDataSourceEl),
              {
                withActions: this._options.withActions,
                customTextColor: this._options.customTextColor,
                statusWidgetEl: t.getElement(),
                hideInvisibleHover: t.dataSourceErrorStatusShown.spawn(),
                hideValues: (0, w.combine)(
                  (e, t) => e || t,
                  t.dataSourceErrorStatusShown.weakReference(),
                  t.isSymbolInvalidStatusShown.weakReference(),
                ),
                isMultipleLayout: this._options.isMultipleLayout,
                toggleHiddenActions: this._toggleHiddenActions,
              },
            )),
            this._updateLegendVisibility()
        }
        _addDataSource(e, t, s) {
          const i = (0, o.ensureNotNull)(this._dataSourcesAdditionalWrapperEl),
            l = new K(e, i, {
              withActions: this._options.withActions,
              customTextColor: this._options.customTextColor,
              statusWidgetEl: t.getElement(),
              hideInvisibleHover: (0, w.combine)(
                (e, t) => e || t,
                t.dataSourceErrorStatusShown.weakReference(),
                t.dataUpdatedModeShown.weakReference(),
              ),
              hideValues: (0, w.combine)(
                (e, t) => e || t,
                t.dataSourceErrorStatusShown.weakReference(),
                t.isSymbolInvalidStatusShown.weakReference(),
              ),
              isMultipleLayout: this._options.isMultipleLayout,
              toggleHiddenActions: this._toggleHiddenActions,
            }),
            a = (0, o.ensureNotNull)(l.getElement())
          if (null !== a) {
            let e = this._dataSourceRenderers[s]
            void 0 !== e
              ? i.insertBefore(a, e.getElement())
              : ((e = this._dataSourceRenderers[s - 1]),
                void 0 !== e &&
                  i.insertBefore(
                    a,
                    (0, o.ensureNotNull)(e.getElement()).nextSibling,
                  ))
          }
          this._dataSourceRenderers.splice(s, 0, l),
            this._updateLegendVisibility()
        }
        _moveDataSource(e, t) {
          const s = this._dataSourceRenderers.indexOf(e)
          if (-1 === s || t === s) return
          const i = (0, o.ensureNotNull)(this._dataSourcesAdditionalWrapperEl),
            l = (0, o.ensureNotNull)(e.getElement())
          let a = this._dataSourceRenderers[t]
          void 0 !== a
            ? i.insertBefore(l, a.getElement())
            : ((a = this._dataSourceRenderers[t - 1]),
              void 0 !== a &&
                i.insertBefore(
                  l,
                  (0, o.ensureNotNull)(a.getElement()).nextSibling,
                )),
            this._dataSourceRenderers.splice(s, 1),
            this._dataSourceRenderers.splice(t, 0, e)
        }
        _onKeyboardNavigationActivation() {
          ;(de._wasKeyboardNavigationActivated = !0),
            this._togglerOptions.isDataSourcesCollapsed.unsubscribe(
              this._onIsDataSourcesCollapsedBound,
            ),
            this._togglerOptions.isDataSourcesCollapsed.subscribe(
              this._onIsDataSourcesCollapsedBound,
            )
          const e = this._getAllAccessibleButtons(),
            t = e.filter((e) => e.tabIndex >= 0)
          if (0 === t.length) {
            const [t] = e.filter((e) => e.hasAttribute('tabIndex'))
            if (void 0 === t) return
            const s = this._getRowRendererByChild(t)
            if (null === s) return
            this._makeRowElementTheMainOne(t, s)
          }
          if (t.length > 1) {
            const [, ...e] = t
            for (const t of e) (0, m.becomeSecondaryElement)(t)
          }
        }
        _handleKeyDown(e) {
          if (e.defaultPrevented) return
          const t = (0, u.hashFromEvent)(e)
          if (!re.includes(t)) return
          const s = document.activeElement
          if (!(s instanceof HTMLButtonElement)) return
          const i = this._getRowRendererByChild(s)
          if (null === i) return
          if (27 === t) return void s.blur()
          const l = i.accessibleButtons(),
            o = l.indexOf(s)
          if (0 === l.length || -1 === o) return
          const a = (t) => {
              e.preventDefault()
              const s = this._getRowRenderers(),
                l = s.indexOf(i)
              let o,
                a,
                n = 'blockNext' === t ? l + 1 : l - 1
              while (n >= 0 && n < s.length) {
                const e = s[n],
                  i = e.accessibleButtons()
                if (0 !== i.length) {
                  ;(o = e), (a = i)
                  break
                }
                n = 'blockNext' === t ? n + 1 : n - 1
              }
              o && a && this._changeFocusElement(a[0], o)
            },
            n = (0, g.mapKeyCodeToDirection)(t)
          switch (n) {
            case 'inlinePrev':
              e.preventDefault(),
                this._changeFocusElement(
                  0 !== o ? l[o - 1] : l[l.length - 1],
                  i,
                )
              break
            case 'inlineNext':
              e.preventDefault(),
                this._changeFocusElement(
                  o !== l.length - 1 ? l[o + 1] : l[0],
                  i,
                )
              break
            case 'blockPrev':
            case 'blockNext':
              a(n)
          }
        }
        _subscribeElementToFocusEvents(e, t) {
          ;(this._focusEventAbortController = new AbortController()),
            e.addEventListener(
              'focusin',
              () => {
                ;(this._focusEventAbortController = new AbortController()),
                  e.addEventListener(
                    'focusout',
                    (s) => {
                      const i = s.relatedTarget
                      ;(null !== i &&
                        i instanceof HTMLButtonElement &&
                        t.accessibleButtons().includes(i)) ||
                        (this._subscribeElementToFocusEvents(e, t),
                        t instanceof ae || t.hideActions())
                    },
                    {
                      once: !0,
                      signal: this._focusEventAbortController.signal,
                    },
                  ),
                  this._options.onLegendRowFocused(),
                  t instanceof ae || t.showActions()
              },
              { once: !0, signal: this._focusEventAbortController.signal },
            )
        }
        _makeRowElementTheMainOne(e, t) {
          this._subscribeElementToFocusEvents(e, t), (0, m.becomeMainElement)(e)
        }
        _changeFocusElement(e, t) {
          document.activeElement &&
            (0, m.becomeSecondaryElement)(document.activeElement),
            this._makeRowElementTheMainOne(e, t),
            e.focus()
        }
        _getRowRenderers() {
          let e = []
          return (
            this._mainDataSourceRenderer &&
              e.push(this._mainDataSourceRenderer),
            this._dataSourcesEl &&
              !this._dataSourcesEl.classList.contains(L.blockHidden) &&
              (this._togglerOptions.isDataSourcesCollapsed.value() &&
                1 !== this._mode &&
                (e = e.concat(this._dataSourceRenderers)),
              this._renderToggler &&
                0 !== this._dataSourceRenderers.length &&
                e.push(this._renderToggler)),
            e
          )
        }
        _getAllAccessibleButtons() {
          const e = []
          return (
            this._getRowRenderers().forEach((t) => {
              e.push(...t.accessibleButtons())
            }),
            e
          )
        }
        _getRowRendererByChild(e) {
          return (
            this._getRowRenderers().find((t) =>
              t.accessibleButtons().includes(e),
            ) ?? null
          )
        }
      }
      de._wasKeyboardNavigationActivated = !1
      var ue,
        he = s(86129),
        ce = s(84425),
        _e = s(42752),
        pe = s(86235),
        me = s(58473),
        ge = s(76460),
        be = s(19063),
        ve = s(45126),
        we = s(63273),
        Se = s(19466)
      function ye(e) {
        return void 0 !== e ? be.resetTransparency(e) : e
      }
      function Me(e) {
        return Object.hasOwn(e, 'touches')
      }
      !((e) => {
        ;(e.Small = 'small'), (e.Large = 'large')
      })(ue || (ue = {}))
      const fe = new ve.TranslatedString(
          'show {title}',
          J.t(null, void 0, s(51382)),
        ),
        Ce = new ve.TranslatedString(
          'hide {title}',
          J.t(null, void 0, s(13017)),
        ),
        Ee = J.t(null, void 0, s(98334)),
        Ve = J.t(null, void 0, s(27298))
      class Le {
        constructor(e, t, s, i, l) {
          ;(this._values = new n.WatchedValue([])),
            (this._actions = []),
            (this._loading = new n.WatchedValue(!1)),
            (this._symbolLogoViewModel = new n.WatchedValue(null)),
            (this._destroyed = !1),
            (this._moreActionCM = null),
            (this._updateLoadingStatus = () => {
              this._loading.setValue(this._source.isLoading())
            }),
            (this._model = e),
            (this._source = t),
            (this._options = s),
            (this._callbacks = i),
            (this._contextMenuOptions = l),
            (this._disabled = new n.WatchedValue(this._getDisabledState())),
            (this._disabledOnInterval = new n.WatchedValue(
              this._getDisabledOnIntervalState(),
            )),
            (this._selected = new n.WatchedValue(!1)),
            (this._isTitleHidden = new n.WatchedValue(
              this._getTitleHiddenValue(),
            )),
            (this._isValuesHidden = new n.WatchedValue(
              this._getValuesHiddenValue(),
            )),
            (this._isRowHidden = new n.WatchedValue(this._getRowHiddenValue())),
            (this._isEditable = new n.WatchedValue(this._getIsEditable())),
            (0, w.combine)(
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
          this._symbolLogoViewModel.value()?.destroy(), (this._destroyed = !0)
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
          this._updateTitles(),
            this._updateValues(),
            this._updateStates(),
            this.symbolLogoViewModel()?.value()?.update()
        }
        onToggleDisabled() {
          const e = this._source.properties().childs().visible,
            t = !e.value()
          this._model.setProperty(
            e,
            t,
            (t ? fe : Ce).format({
              title: new ve.TranslatedString(
                this._source.name(),
                this._source.title(Se.TitleDisplayTarget.StatusLine),
              ),
            }),
          ),
            Y((t ? 'Show' : 'Hide') + ' source')
        }
        onShowSettings(e) {
          this._source.userEditEnabled() &&
            (this.setSourceSelected(),
            this._callbacks.showChartPropertiesForSource(this._source, e),
            Y('Settings for source'))
        }
        onShowMoreActions(e) {
          return this._options.readOnlyMode
            ? Promise.resolve(null)
            : (Y('Show source context menu'),
              this._callbacks.showContextMenuForSources(
                [this._source],
                this._calcNewPosition(e),
                {
                  ...this._contextMenuOptions,
                  isKeyboardEvent: !Me(e) && (0, ge.isKeyboardClick)(e),
                },
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
          return this._disabled.value() ? Ee : Ve
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
          if (Me(e) && e.touches.length > 0)
            t = { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY }
          else if (null !== e.target) {
            const s = e.target.getBoundingClientRect()
            t = {
              clientX: (0, we.isRtl)() ? s.right : s.left,
              clientY: s.top + s.height + 3,
            }
          } else {
            const s = e
            t = { clientX: s.clientX, clientY: s.clientY }
          }
          return t
        }
      }
      var We = s(618),
        Ae = s(36279),
        xe = s(12184),
        ke = s(5201)
      const Te =
          c.enabled('show_symbol_logos') &&
          c.enabled('show_symbol_logo_in_legend'),
        He = new ke.CircularCacheBuffer(100)
      class Be {
        constructor(e, t) {
          ;(this._symbolLogoUrls = new n.WatchedValue([])),
            (this._quoteDataForLogos = null),
            (this._logoDataUpdated = () => {
              const e = this.symbol(),
                t = this._logoData.value()
              t && e && He.set(e, t)
              const s = He.get(e)
              ;(this._quoteDataForLogos = (0, r.merge)(
                s ?? {},
                this._logoData.value() ?? {},
              )),
                this._symbolLogoUrls.setValue(
                  (0, We.removeUsdFromCryptoPairLogos)(
                    (0, We.resolveLogoUrls)(
                      this._quoteDataForLogos,
                      Ae.LogoSize.Medium,
                    ),
                  ),
                )
            }),
            (this._logoModel = e),
            (this._isLogoVisible = (0, xe.createWVFromGetterAndSubscription)(
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
      function Ie(e, t) {
        return Te ? new Be(e, t) : null
      }
      var De = s(26023),
        Pe = s(9343)
      const ze = (0, Pe.getLogger)('Chart.LegendWidget')
      function Ne(e) {
        const t = {}
        for (const s of ['logoid', 'currency-logoid', 'base-currency-logoid'])
          if (s in e) {
            const i = s
            t[i] = e[i]
          }
        return t
      }
      class Re {
        constructor(e) {
          ;(this._logoData = new n.WatchedValue(null)),
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
          const s = t.values
          !this._source.symbolSameAsCurrent(e.values.pro_name) ||
            (void 0 === s.logoid &&
              void 0 === s['currency-logoid'] &&
              void 0 === s['base-currency-logoid']) ||
            this._logoData.setValue(Ne(s))
        }
        async _onSourceSymbolChange() {
          const e = this.symbol()
          let t = null
          try {
            this._logoData.setValue(null),
              (t = await this._source.quotesProvider().quotesSnapshot(e))
          } catch (e) {
            ze.logError(`Quote snapshot error: ${e}`)
          } finally {
            this.symbol() === e &&
              (null === t
                ? this._logoData.setValue(null, !0)
                : this._logoData.setValue(Ne(t)))
          }
        }
        _onSourceSymbolResolved() {
          {
            const e = this._source.symbolInfo(),
              t = e?.logo_urls || []
            if (1 === t.length)
              return void this._logoData.setValue({ logoid: t[0] })
            if (2 === t.length)
              return void this._logoData.setValue({
                'base-currency-logoid': t[0],
                'currency-logoid': t[1],
              })
            this._logoData.setValue(null, !0)
          }
        }
      }
      var Oe = s(54336),
        Fe = s(41674),
        Ue = s(87258),
        Ge = s(45534)
      const Ze = J.t(null, void 0, s(37117)),
        je = J.t(null, void 0, s(44454)),
        $e = J.t(null, void 0, s(13865)),
        Qe = J.t(null, void 0, s(63245)),
        Ke = J.t(null, void 0, s(2569)),
        qe = c.enabled('legend_inplace_edit'),
        Je = c.enabled('show_hide_button_in_legend'),
        Xe = c.enabled('hide_resolution_in_legend')
      class Ye extends Le {
        constructor(e, t, s, i, l) {
          super(e, t, s, i, l),
            (this._titles = {
              title: new n.WatchedValue(''),
              description: new n.WatchedValue(''),
              interval: new n.WatchedValue(''),
              provider: new n.WatchedValue(''),
              exchange: new n.WatchedValue(''),
              chartStyle: new n.WatchedValue(''),
              priceSource: new n.WatchedValue(''),
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
            (this._flagged = new n.WatchedValue(null)),
            (this._symbolAction = null),
            (this._symbolForMarker = null),
            (this._isOneButtonCanBeStick = !1),
            (this._layoutChartSyncLegendRenderer = null),
            (this._isChartLinked = new n.WatchedValue(!1).readonly().spawn()),
            this._initializeTitleActions(),
            this._createActions(),
            this._updateSymbolMarker()
          const o = this._model
            .model()
            .properties()
            .childs()
            .paneProperties.childs()
            .legendProperties.childs()
          this._symbolLogoViewModel.setValue(Ie(new Re(t), o)),
            o.showSeriesTitle.subscribe(this, () => {
              this._isTitleHidden.setValue(this._getTitleHiddenValue())
            }),
            (this._isPriceSourceHidden = (0,
            ce.createWVFromGetterAndSubscription)(
              () => !o.showPriceSource.value(),
              o.showPriceSource,
            )),
            (this._valuesVisibleProperty = (0, ce.combineProperty)(
              (e, t, s, i) => `${e}:${t}:${s}:${i}`,
              o.showSeriesOHLC.weakReference(),
              o.showBarChange.weakReference(),
              o.showVolume.weakReference(),
              o.showLastDayChange.weakReference(),
            )),
            this._valuesVisibleProperty.subscribe(null, () => {
              this.update(),
                this._isValuesHidden.setValue(this._getValuesHiddenValue())
            }),
            this.update(),
            this._source.statusWV().subscribe(this._updateLoadingStatus)
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
            this._source.statusWV().unsubscribe(this._updateLoadingStatus),
            this._valuesVisibleProperty.destroy(),
            this._isPriceSourceHidden.destroy(),
            this._symbolMarker?.destroy()
        }
        flagged() {
          return this._flagged
        }
        linked() {
          return this._isChartLinked
        }
        onShowSettings() {
          this._source.userEditEnabled() &&
            this._callbacks.showGeneralChartProperties(De.TabNames.symbol)
        }
        isOneButtonCanBeStick() {
          return this._isOneButtonCanBeStick
        }
        _updateTitles() {
          const e = (0, o.ensureNotNull)(
            this._source.statusView(),
          ).getSplitTitle()
          this._titles.title.setValue((0, he.clean)(e.title, !0)),
            this._titles.description.setValue((0, he.clean)(e.description, !0)),
            Xe || this._titles.interval.setValue((0, he.clean)(e.interval, !0)),
            this._titles.provider.setValue((0, he.clean)(e.provider, !0)),
            this._titles.exchange.setValue((0, he.clean)(e.exchange, !0)),
            this._titles.chartStyle.setValue((0, he.clean)(e.chartStyle, !0)),
            this._titles.priceSource.setValue(
              (0, he.clean)(
                this._isPriceSourceHidden.value() ? '' : e.priceSource,
                !0,
              ),
            )
        }
        _updateValues() {
          const e = this._source.legendView(),
            t = this._values.value(),
            s = e.marketTitle(),
            i = e.marketTitle().length > 0,
            l = e.items()
          if (0 === t.length || t.length !== l.length + 1) {
            const e = {
                value: new n.WatchedValue(''),
                color: new n.WatchedValue(''),
                visible: new n.WatchedValue(i),
                title: new n.WatchedValue(s),
                unimportant: new n.WatchedValue(!1),
              },
              t = l.map((e) => ({
                value: new n.WatchedValue(e.value()),
                color: new n.WatchedValue(ye(e.color())),
                visible: new n.WatchedValue(e.visible()),
                title: new n.WatchedValue(e.title()),
                unimportant: new n.WatchedValue(e.unimportant()),
              }))
            this._values.setValue([e].concat(t))
          } else {
            t[0].title.setValue(s), t[0].visible.setValue(i)
            for (let e = 0; e < l.length; e++) {
              const s = l[e]
              t[e + 1].value.setValue(s.value()),
                t[e + 1].color.setValue(ye(s.color())),
                t[e + 1].visible.setValue(s.visible()),
                t[e + 1].title.setValue(s.title())
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
          return (
            !this._hasValues() ||
            !this._valuesVisibleProperty
              .value()
              .split(':')
              .some((e) => 'true' === e)
          )
        }
        _initializeTitleActions() {
          if (!qe) return
          const e = async () => {
            const e = this._model.mainSeries(),
              t = e.symbol(),
              s = e.properties().childs().shortName.value(),
              i = 'option' === e.symbolInfo()?.type,
              l = e.symbolInfo()?.pro_name
            let o = e.isSpread() ? t : s || t || ''
            if (c.enabled('symbol_search_option_chain_selector') && i && l) {
              const e = await resolveUnderlyingSymbol(l)
              e && (o = { type: 'option', value: l, underlying: e })
            }
            ;(0, me.showDialog)({
              defaultValue: o,
              enableOptionsChain: c.enabled(
                'symbol_search_option_chain_selector',
              ),
            })
          }
          c.enabled('disable_legend_inplace_symbol_change') ||
            ((this._titleActions.title = { onClick: e, tooltip: Qe }),
            (this._titleActions.description = { onClick: e, tooltip: Qe })),
            (this._titleActions.interval = {
              onClick: () => {
                ;(0, pe.showChangeIntervalDialogAsync)({
                  initVal: this._model.mainSeries().interval(),
                  selectOnInit: !0,
                })
              },
              tooltip: Ke,
            })
        }
        _createActions() {
          if (Je) {
            const e = (0, _e.convertPropertyToWatchedValue)(
                (0, ce.combineProperty)(
                  (e) => !e,
                  this._source.properties().childs().visible.weakReference(),
                ),
              ),
              t = {
                icon: new Map([
                  ['large', Fe],
                  ['small', Oe],
                ]),
                action: (0, f.wrapHandlerWithPreventEvent)(
                  this.onToggleDisabled.bind(this),
                ),
                visible: e,
                className: k.eye,
                title: new n.WatchedValue(this._getEyeTitle()),
                dataset: { name: 'legend-show-hide-action' },
              }
            this._actions.push(t),
              this._disabled.subscribe(() => {
                t.title?.setValue(this._getEyeTitle())
              })
          }
          this._actions.push({
            icon: new Map([
              ['large', Ge],
              ['small', Ue],
            ]),
            action: this._moreActionHandler.bind(this),
            visible: new n.WatchedValue(!0),
            title: new n.WatchedValue(Ze),
            dataset: { name: 'legend-more-action' },
          })
        }
        _getMarkerTitle() {
          return null !== this._symbolMarker
            ? this._symbolMarker.isMarked()
              ? $e
              : je
            : ''
        }
        _symbolActionHandler(e) {
          ;(0, f.preventDefault)(e),
            null !== this._symbolMarker &&
              (this._updateSymbolMarker(),
              e instanceof KeyboardEvent && this._symbolMarker.toggle(e),
              Y('Change flag state'))
        }
        _updateSymbolMarker() {
          this._isOneButtonCanBeStick = !0
        }
      }
      var et = s(79036),
        tt = s(48341),
        st = s(28388),
        it = s(60074),
        lt = s(50340),
        ot = s(94664),
        at = s(83637),
        nt = s(36791),
        rt = s(34882),
        dt = s(37073),
        ut = s(30556),
        ht = s(91104)
      ;(0, Pe.getLogger)('Chart.LegendWidget')
      const ct = J.t(null, void 0, s(32514)),
        _t = J.t(null, void 0, s(87142)),
        pt = J.t(null, void 0, s(67410)),
        mt = J.t(null, void 0, s(37117)),
        gt =
          (J.t(null, void 0, s(57335)),
          J.t(null, void 0, s(43206)),
          J.t(null, void 0, s(74759))),
        bt = J.t(null, void 0, s(63245)),
        vt =
          (c.enabled('study_buttons_in_legend'),
          c.enabled('show_hide_button_in_legend')),
        wt = c.enabled('property_pages'),
        St = c.enabled('format_button_in_legend'),
        yt = c.enabled('delete_button_in_legend'),
        Mt = c.enabled('legend_inplace_edit')
      class ft extends Le {
        constructor(e, t, s, i, l) {
          super(e, t, s, i, l),
            (this._titles = {
              title: new n.WatchedValue(''),
              args: new n.WatchedValue(''),
            }),
            (this._titleActions = { title: void 0, args: void 0 }),
            (this._error = new n.WatchedValue(!1)),
            (this._isAbleShowSourceCode = new n.WatchedValue(!1)),
            (this._isAbleShowSourceCodeInner = new n.WatchedValue(!1).spawn()),
            (this._pineAction = null),
            (this._pineActionVisible = null),
            (this._globalVisibility = new n.WatchedValue(!0)),
            this._updateSymbolLogoModel(),
            this._initializeTitleActions(),
            this._createActions()
          const o = this._model
              .model()
              .properties()
              .childs()
              .paneProperties.childs()
              .legendProperties.childs(),
            a = [o.showSeriesTitle, o.showStudyTitles]
          for (const e of a)
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
            this._isAbleShowSourceCodeInner.destroy()
        }
        error() {
          return this._error.readonly()
        }
        isAbleShowSourceCode() {
          return this._isAbleShowSourceCode
        }
        onRemoveSource() {
          this._source.isUserDeletable() &&
            (this._source.hasChildren()
              ? (0, tt.showDeleteStudyTreeConfirm)(
                  this._model.removeSource.bind(this._model, this._source, !1),
                )
              : this._model.removeSource(this._source, !1),
            Y('Remove sources'))
        }
        async onShowSourceCode() {
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
          this._titles.title.setValue((0, he.clean)(e[0], !0))
          const t = Array.isArray(e[1]) ? e[1].join(' ') : e[1] || ''
          this._titles.args.setValue((0, he.clean)(t, !0))
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
                value: new n.WatchedValue(e.value()),
                color: new n.WatchedValue(ye(e.color())),
                visible: new n.WatchedValue(e.visible()),
                unimportant: new n.WatchedValue(e.unimportant()),
                title: new n.WatchedValue(e.title()),
              }))
            this._values.setValue(t)
          } else {
            const s = e.items()
            for (let e = 0; e < s.length; e++) {
              const i = t[e],
                l = s[e]
              i.value.setValue(l.value()),
                i.color.setValue(ye(l.color())),
                i.visible.setValue(l.visible()),
                i.title.setValue(l.title())
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
              !(0, et.isStudy)(this._source) &&
              !(0, et.isStudyStub)(this._source)
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
          if (!Mt || !(0, it.isSymbolSourceWithQuotesProvider)(e)) return
          this._titleActions.title = {
            onClick: () => {
              let t = null
              const s = (t = (0, lt.loadNewSymbolSearch)().then(async (i) => {
                if (s !== t) return
                const l = e.symbol(),
                  o = (0, F.safeShortName)(l),
                  a = 'spread' === e.symbolInfo()?.type,
                  n = 'option' === e.symbolInfo()?.type,
                  r = e.symbolInfo()?.pro_name
                let d = a ? l : o || l || ''
                if (
                  c.enabled('symbol_search_option_chain_selector') &&
                  n &&
                  r
                ) {
                  const e = await resolveUnderlyingSymbol(r)
                  e && (d = { type: 'option', value: r, underlying: e })
                }
                const u = (0, ot.getSymbolSearchCompleteOverrideFunction)()
                i.showSymbolSearchItemsDialog({
                  onSearchComplete: (t) => {
                    u(t[0].symbol, t[0].result).then((t) => {
                      this._model.setSymbol(e, t.symbol)
                    })
                  },
                  dialogTitle: bt,
                  defaultValue: d,
                  enableOptionsChain: c.enabled(
                    'symbol_search_option_chain_selector',
                  ),
                  showSpreadActions:
                    c.enabled('show_spread_operators') &&
                    c.enabled('studies_symbol_search_spread_operators'),
                })
              }))
            },
            tooltip: bt,
          }
        }
        _isSymbolLikeStudy() {
          return (0, et.isCompareOrOverlayStudy)(this._source)
        }
        async _updateAbleShowSourceCode() {
          0
        }
        _updateVisibilityPineAction(e) {
          null !== this._pineActionVisible &&
            (this._pineActionVisible.setValue(e),
            this._isAbleShowSourceCode.setValue(e))
        }
        _createActions() {
          if (!this._options.readOnlyMode) {
            if (
              ((this._pineActionVisible = new n.WatchedValue(!1)),
              (this._pineAction = {
                icon: new Map([
                  ['large', dt],
                  ['small', rt],
                ]),
                action: (0, f.wrapHandlerWithPreventEvent)(
                  this.onShowSourceCode.bind(this),
                ),
                disableAccessibility: !0,
                visible: this._pineActionVisible.readonly(),
                title: new n.WatchedValue(_t),
                dataset: { name: 'legend-pine-action' },
              }),
              vt)
            ) {
              const e = new n.WatchedValue(!this._getDisabledOnIntervalState()),
                t = {
                  icon: new Map([
                    ['large', Fe],
                    ['small', Oe],
                  ]),
                  action: (0, f.wrapHandlerWithPreventEvent)(
                    this.onToggleDisabled.bind(this),
                  ),
                  visible: e.readonly(),
                  className: k.eye,
                  title: new n.WatchedValue(this._getEyeTitle()),
                  dataset: { name: 'legend-show-hide-action' },
                }
              this._actions.push(t),
                this._disabled.subscribe(() => {
                  t.title?.setValue(this._getEyeTitle())
                })
              const s = new n.WatchedValue(this._getDisabledOnIntervalState()),
                i = {
                  icon: new Map([
                    ['large', Fe],
                    ['small', Oe],
                  ]),
                  action: (0, f.wrapHandlerWithPreventEvent)(
                    this.onShowSettings.bind(this, De.TabNames.visibility),
                  ),
                  visible: s.readonly(),
                  className: k.intervalEye,
                  title: new n.WatchedValue(gt),
                  dataset: { name: 'legend-interval-show-hide-action' },
                }
              this._actions.push(i),
                this._disabledOnInterval.subscribe((t) => {
                  s.setValue(t), e.setValue(!t)
                })
            }
            if (
              wt &&
              St &&
              (!(0, et.isStudy)(this._source) ||
                new st.MetaInfoHelper(
                  this._source.metaInfo(),
                ).hasUserEditableOptions())
            ) {
              const e = new n.WatchedValue(this._getIsEditable()),
                t = {
                  icon: new Map([
                    ['large', nt],
                    ['small', at],
                  ]),
                  action: (0, f.wrapHandlerWithPreventEvent)(() =>
                    this.onShowSettings(),
                  ),
                  visible: e.readonly(),
                  title: new n.WatchedValue(ct),
                  dataset: { name: 'legend-settings-action' },
                }
              this._actions.push(t),
                this._isEditable.subscribe((t) => {
                  e.setValue(t)
                })
            }
            if (yt) {
              const e = new n.WatchedValue(this._getIsEditable()),
                t = {
                  icon: new Map([
                    ['large', ht],
                    ['small', ut],
                  ]),
                  action: (0, f.wrapHandlerWithPreventEvent)(
                    this.onRemoveSource.bind(this),
                  ),
                  visible: e.readonly(),
                  title: new n.WatchedValue(pt),
                  dataset: { name: 'legend-delete-action' },
                }
              this._actions.push(t),
                this._isEditable.subscribe((t) => {
                  e.setValue(t)
                })
            }
            this._actions.push({
              icon: new Map([
                ['large', Ge],
                ['small', Ue],
              ]),
              action: this._moreActionHandler.bind(this),
              visible: this._isEditable.spawn(),
              title: new n.WatchedValue(mt),
              dataset: { name: 'legend-more-action' },
            })
          }
        }
        _updateSymbolLogoModel() {
          if (
            (this._symbolLogoViewModel.value()?.destroy(),
            (0, it.isSymbolSourceWithQuotesProvider)(this._source))
          ) {
            const e = this._model
              .model()
              .properties()
              .childs()
              .paneProperties.childs()
              .legendProperties.childs()
            this._symbolLogoViewModel.setValue(Ie(new Re(this._source), e))
          } else this._symbolLogoViewModel.setValue(null)
        }
      }
      var Ct = s(29023),
        Et = s(40443),
        Vt = s(68805),
        Lt = s(30141),
        Wt = s(34585),
        At = s(23486),
        xt = s(81199)
      function kt(e, t, s) {
        e.setProperty(t, !t.value(), s)
      }
      const Tt = new ve.TranslatedString(
          'change symbol description visibility',
          J.t(null, void 0, s(88167)),
        ),
        Ht = new ve.TranslatedString(
          'change open market status visibility',
          J.t(null, void 0, s(96227)),
        ),
        Bt = new ve.TranslatedString(
          'change chart values visibility',
          J.t(null, void 0, s(79637)),
        ),
        It = new ve.TranslatedString(
          'change last day change visibility',
          J.t(null, void 0, s(66307)),
        ),
        Dt = new ve.TranslatedString(
          'change bar change visibility',
          J.t(null, void 0, s(27426)),
        ),
        Pt = new ve.TranslatedString(
          'change indicator titles visibility',
          J.t(null, void 0, s(63050)),
        ),
        zt = new ve.TranslatedString(
          'change indicator arguments visibility',
          J.t(null, void 0, s(78310)),
        ),
        Nt = new ve.TranslatedString(
          'change indicator values visibility',
          J.t(null, void 0, s(49583)),
        ),
        Rt = new ve.TranslatedString(
          'change volume values visibility',
          J.t(null, void 0, s(96201)),
        ),
        Ot = new ve.TranslatedString(
          'change symbol field visibility',
          J.t(null, void 0, s(12050)),
        ),
        Ft = J.t(null, void 0, s(14771)),
        Ut = J.t(null, void 0, s(25765)),
        Gt = J.t(null, void 0, s(45639)),
        Zt = J.t(null, void 0, s(72423)),
        jt = J.t(null, void 0, s(10842)),
        $t = J.t(null, void 0, s(37644)),
        Qt = J.t(null, void 0, s(7511)),
        Kt = J.t(null, void 0, s(44036)),
        qt = J.t(null, void 0, s(51353)),
        Jt = J.t(null, void 0, s(23079)),
        Xt = (0, Wt.appendEllipsis)(J.t(null, void 0, s(32514))),
        Yt = c.enabled('symbol_info_price_source'),
        es = (e, t) =>
          e
            ? e.dataset[t]
              ? e.dataset[t]
              : e.parentElement
                ? es(e.parentElement, t)
                : null
            : null
      s(88145)
      var ts = s(53350),
        ss = s(75725)
      class is {
        constructor(e) {
          ;(this._source = e),
            (this._fullSessionScheduleViewModel =
              new ts.FullSessionScheduleViewModel(e))
        }
        destroy() {
          this._fullSessionScheduleViewModel.destroy()
        }
        renderer(e, t) {
          const s = this._source.marketStatusModel()?.status().value()
          return 'expired' === s || 'delisted' === s
            ? null
            : (0, V.createElement)(ss.FullSessionScheduleRenderer, {
                key: e,
                className: t,
                showAllDays: void 0,
                sessionDays: this._fullSessionScheduleViewModel.sessionsDays,
                now: this._fullSessionScheduleViewModel.currentTimeValue(),
                timezone: this._fullSessionScheduleViewModel.timezone(),
              })
        }
        updateSource(e) {
          ;(this._source = e),
            this._fullSessionScheduleViewModel.destroy(),
            (this._fullSessionScheduleViewModel =
              new ts.FullSessionScheduleViewModel(e))
        }
      }
      var ls = s(19625),
        os = s(91682),
        as = s(82236),
        ns = s(58994)
      class rs {
        constructor(e) {
          ;(this.isBlinkingMode = new n.WatchedValue(!1)),
            (this._status = new n.WatchedValue(null)),
            (this._fullTooltip = new n.WatchedValue(null)),
            (this._iconClassNames = new n.WatchedValue(null)),
            (this._visible = new n.WatchedValue(!1)),
            (this._destroyed = !1),
            (this._tooltip = new n.WatchedValue(null)),
            (this._icon = new n.WatchedValue(null)),
            (this._className = new n.WatchedValue(null)),
            (this._customColor = new n.WatchedValue(null)),
            (this._infoMaps = e),
            (this._size = e.size || 'small'),
            this._status.subscribe(this._updateByStatus.bind(this), {
              callWithLast: !0,
            })
        }
        destroy() {
          this._destroyed = !0
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
          return this._infoMaps.tooltipMap?.get(e) ?? null
        }
        _getIcon(e) {
          let t
          const s = this._infoMaps.iconMap.get(e)
          return void 0 !== s && (t = s.get(this._size)), t || null
        }
        _getClassName(e) {
          return this._infoMaps.classNameMap.get(e) || null
        }
        _getFullTooltipIconClassNames(e) {
          const t = this._getClassName(e)
          return t ? [ns.statusItem, t] : []
        }
        _getTitle(e) {
          return this._infoMaps.titleMap?.get(e) ?? null
        }
        _getTitleColor(e) {
          return this._infoMaps.titleColorMap?.get(e) ?? null
        }
        _getAction(e) {
          return this._infoMaps.actionMap?.get(e) ?? null
        }
        _getHTML(e) {
          return this._infoMaps.htmlMap?.get(e)?.map(os.htmlEscape) ?? []
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
      var ds = s(12646),
        us = s(31233),
        hs = s(55593),
        cs = s(69410),
        _s = s(52828),
        ps = s(91665),
        ms = s(39379),
        gs = s(38373),
        bs = s(79304),
        vs = s(21672),
        ws = s(92315)
      const Ss = new Map([
          ['small', ds],
          ['medium', us],
          ['large', us],
        ]),
        ys = new Map([
          ['small', hs],
          ['medium', cs],
          ['large', cs],
        ]),
        Ms = new Map([
          ['small', _s],
          ['medium', ps],
          ['large', ps],
        ]),
        fs =
          (new Map([
            ['small', ms],
            ['medium', ms],
            ['large', ms],
          ]),
          new Map([
            ['small', ''],
            ['medium', ''],
            ['large', ''],
          ]),
          new Map([
            ['small', ''],
            ['medium', ''],
            ['large', ''],
          ]),
          new Map([
            ['small', gs],
            ['medium', bs],
            ['large', bs],
          ]),
          new Map([
            ['small', ''],
            ['medium', ''],
            ['large', ''],
          ]),
          new Map([
            ['small', vs],
            ['medium', ws],
            ['large', ws],
          ]),
          new Map([
            ['small', ''],
            ['medium', ''],
            ['large', ''],
          ]),
          new Map([
            ['small', ''],
            ['medium', ''],
            ['large', ''],
          ]),
          ls.colorsPalette['color-delay-mode']),
        Cs = ls.colorsPalette['color-eod-mode'],
        Es = ls.colorsPalette['color-notaccurate-mode'],
        Vs =
          (ls.colorsPalette['color-primary-symbol'],
          ls.colorsPalette['color-halal'],
          ls.colorsPalette['color-continuous'],
          ls.colorsPalette['color-data-problem'],
          ls.colorsPalette['color-data-problem'],
          ls.colorsPalette['color-market-expired'],
          ls.colorsPalette['color-grapes-purple-400'],
          ls.colorsPalette['color-ripe-red-600'],
          J.t(null, void 0, s(43348))),
        Ls = J.t(null, void 0, s(5805)),
        Ws = J.t(null, void 0, s(91006)),
        As = J.t(null, void 0, s(58796)),
        xs = J.t(null, void 0, s(55154)),
        ks =
          (J.t(null, void 0, s(44138)),
          J.t(null, void 0, s(94972)),
          J.t(null, void 0, s(95246)),
          J.t(null, void 0, s(50035)),
          J.t(null, void 0, s(19481)),
          J.t(null, void 0, s(75119)),
          J.t(null, void 0, s(67607)),
          J.t(null, void 0, s(84484)),
          (e, t) =>
            (0, os.htmlEscape)(
              J.t(
                null,
                {
                  plural:
                    '{symbolName} data is delayed by {time} minutes because of exchange requirements.',
                  count: t,
                  replace: { symbolName: e, time: t.toString() },
                },
                s(81227),
              ),
            )),
        Ts = (0, os.htmlEscape)(J.t(null, void 0, s(51211))),
        Hs = (0, os.htmlEscape)(J.t(null, void 0, s(7281))),
        Bs = (0, os.htmlEscape)(J.t(null, void 0, s(20987))),
        Is = (0, os.htmlEscape)(J.t(null, void 0, s(32925))),
        Ds = (0, os.htmlEscape)(J.t(null, void 0, s(38368))),
        Ps = (0, os.htmlEscape)(J.t(null, void 0, s(33039))),
        zs = (0, os.htmlEscape)(J.t(null, void 0, s(85996))),
        Ns = (0, os.htmlEscape)(J.t(null, void 0, s(95400))),
        Rs = J.t(null, void 0, s(31539)),
        Os =
          (J.t(
            null,
            {
              context:
                'Part of: "Real-time data for {symbolName} is provided by {exchange} exchange."',
            },
            s(48473),
          ),
          J.t(
            null,
            {
              context:
                'Part of: "Real-time data for {symbolName} is provided by {exchange} exchange."',
            },
            s(84455),
          ),
          J.t(null, void 0, s(24669))),
        Fs = J.t(null, void 0, s(52668)),
        Us = J.t(null, void 0, s(44492))
      J.t(null, void 0, s(40225)),
        J.t(null, void 0, s(71847)),
        J.t(null, void 0, s(39664)),
        J.t(null, void 0, s(72723)),
        J.t(null, void 0, s(25608)),
        J.t(null, void 0, s(33161)),
        J.t(null, void 0, s(99452)),
        J.t(null, void 0, s(90589)),
        J.t(null, void 0, s(43383)),
        J.t(null, void 0, s(14181)),
        J.t(null, void 0, s(19679)),
        J.t(null, void 0, s(84937)),
        J.t(null, void 0, s(34987)),
        J.t(null, void 0, s(59269)),
        J.t(null, void 0, s(1356)),
        J.t(null, void 0, s(96341))
      var Gs = s(22118),
        Zs = s(56840)
      const js = 'tv.alreadyBlinkedStatuses',
        $s = []
      function Qs() {
        return Zs.getJSON(js, $s)
      }
      const Ks = new n.WatchedValue(Qs())
      function qs(e) {
        const t = Zs.getJSON(js, $s)
        t.includes(e) || (t.push(e), Zs.setJSON(js, t), Ks.setValue(Qs()))
      }
      Zs.onSync.subscribe(null, () => Ks.setValue(Qs()))
      const Js = Ks
      var Xs = s(14712)
      const Ys = (0, Pe.getLogger)('Chart.LegendWidget'),
        ei = [
          'TFEXDelayForGuest',
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
          'FINRADelayForGuest',
        ],
        ti = new Map([
          ['DelayToRealtime', Ss],
          ['DelayNoRealtime', Ss],
          ['TFEXDelayForGuest', Ss],
          ['MILDelayForGuest', Ss],
          ['NGMDelayForGuest', Ss],
          ['ICESGDelayForGuest', Ss],
          ['TAIFEXDelayForGuest', Ss],
          ['TURQUOISEDelayForGuest', Ss],
          ['ADXDelayForGuest', Ss],
          ['TRADEGATEDelayForGuest', Ss],
          ['LUXSEDelayForGuest', Ss],
          ['NSENGDelayForGuest', Ss],
          ['FINRADelayForGuest', Ss],
          ['DEForGuest', Ss],
          ['EOD', ys],
          ['TickByTick', Ms],
          ['BATSToRealtime', Ms],
          ['DelayWithoutMarketAgreement', Ss],
        ]),
        si = new Map([
          ['DelayToRealtime', ns.delay],
          ['DelayNoRealtime', ns.delay],
          ['TFEXDelayForGuest', ns.delay],
          ['MILDelayForGuest', ns.delay],
          ['NGMDelayForGuest', ns.delay],
          ['ICESGDelayForGuest', ns.delay],
          ['TAIFEXDelayForGuest', ns.delay],
          ['TURQUOISEDelayForGuest', ns.delay],
          ['ADXDelayForGuest', ns.delay],
          ['TRADEGATEDelayForGuest', ns.delay],
          ['LUXSEDelayForGuest', ns.delay],
          ['NSENGDelayForGuest', ns.delay],
          ['FINRADelayForGuest', ns.delay],
          ['DEForGuest', ns.delay],
          ['EOD', ns.eod],
          ['TickByTick', ns.notAccurate],
          ['BATSToRealtime', ns.notAccurate],
          ['DelayWithoutMarketAgreement', ns.delay],
        ]),
        ii = new Map([
          ['DelayToRealtime', fs],
          ['DelayNoRealtime', fs],
          ['TFEXDelayForGuest', fs],
          ['MILDelayForGuest', fs],
          ['NGMDelayForGuest', fs],
          ['ICESGDelayForGuest', fs],
          ['TAIFEXDelayForGuest', fs],
          ['TURQUOISEDelayForGuest', fs],
          ['ADXDelayForGuest', fs],
          ['TRADEGATEDelayForGuest', fs],
          ['LUXSEDelayForGuest', fs],
          ['NSENGDelayForGuest', fs],
          ['FINRADelayForGuest', fs],
          ['DEForGuest', fs],
          ['EOD', Cs],
          ['TickByTick', Es],
          ['BATSToRealtime', Es],
          ['DelayWithoutMarketAgreement', fs],
        ]),
        li = (J.t(null, void 0, s(28214)), J.t(null, void 0, s(27741)))
      ;(0, os.htmlEscape)(J.t(null, void 0, s(5447)))
      class oi extends rs {
        constructor(e, t, s) {
          super({ iconMap: ti, classNameMap: si, titleColorMap: ii, size: t }),
            (this._dataUpdatedInfo = new n.WatchedValue(null).spawn()),
            (this._onMarketStatusChanged = () => {
              this._updateByStatus(this.status().value())
            }),
            (this._options = s),
            (this._model = e),
            (this._dataModeBlinkingStatuses = Js.spawn()),
            this._dataModeBlinkingStatuses.subscribe(
              this._updateBlinkingMode.bind(this),
            ),
            this._options.marketStatus?.subscribe(this._onMarketStatusChanged),
            (this.turnOffBlinkingMode = this._turnOffBlinking.bind(this)),
            this.setModel(e)
        }
        destroy() {
          this._dataUpdatedInfo.destroy(),
            this._dataModeBlinkingStatuses.destroy(),
            this._options.marketStatus?.unsubscribe(
              this._onMarketStatusChanged,
            ),
            this._options.marketStatus?.release(),
            super.destroy()
        }
        setModel(e) {
          if ((this._dataUpdatedInfo.destroy(), null === e))
            return (
              (this._model = e),
              void (this._dataUpdatedInfo = new n.WatchedValue(null).spawn())
            )
          ;(this._dataUpdatedInfo = e.status().spawn()),
            this._dataUpdatedInfo.subscribe(this._updateStatus.bind(this), {
              callWithLast: !0,
            })
        }
        _shouldBeHiddenByStatus(e) {
          const t = this._options.marketStatus?.value()
          return (
            'expired' === t ||
            'delisted' === t ||
            !('BATSToRealtime' !== e || !this._model?.isSpread()) ||
            super._shouldBeHiddenByStatus(e)
          )
        }
        _getTooltip() {
          const e = this._getShortTexts()
          return null === e ? null : Object.values(e).join(' · ')
        }
        async _updateFullTooltip() {
          const e = this._dataUpdatedInfo.value(),
            t = this._status.value()
          if (null === e || null === t)
            return void this._fullTooltip.setValue(null)
          const s = this._getShortTexts(),
            [i, l] = await Promise.all([this._getHtmls(), this._getActions()])
          if (e !== this._dataUpdatedInfo.value()) return
          const o = []
          for (const t of e) {
            const e = t.mode
            ;('BATSToRealtime' === e && this._model?.isSpread()) ||
              o.push({
                icon: this._getIcon(e),
                iconClassName: this._getFullTooltipIconClassNames(e),
                title: s && s[e],
                titleColor: this._getTitleColor(e),
                html: i && i[e],
                size: this._size,
                action: l && l[e],
              })
          }
          this._fullTooltip.setValue(o)
        }
        _updateStatus(e) {
          const t = null !== e ? e[0].mode : null
          this._status.setValue(t ?? null, !0), this._updateBlinkingMode()
        }
        async _getHtmls() {
          const e = this._dataUpdatedInfo.value()
          if (null === e || null === this._model) return Promise.resolve(null)
          const t = {},
            i = this._model.symbolName()
          let l = null,
            o = null
          try {
            ;(l = await this._model.description()), (o = this._model.exchange())
          } catch (e) {
            Ys.logError(
              `Can't get exchange description, reason: ${(0, Xs.errorToString)(e)}`,
            )
          }
          for (const a of e) {
            const e = a.mode
            if (
              ((t[e] = []),
              [
                'DelayToRealtime',
                'DelayNoRealtime',
                'DelayWithoutMarketAgreement',
                ...ei,
              ].includes(e) &&
                (t[e].push(ks(i, this._model.time())),
                this._options.subscriptionFullInfo &&
                  null !== l &&
                  'DelayToRealtime' === e &&
                  t[e].push(Hs.format({ description: `<b>${l}</b>` })),
                'DelayNoRealtime' === e && t[e].push(Bs),
                'DelayWithoutMarketAgreement' === e &&
                  t[e].push(
                    Ns.format({ listedExchange: this._model.listedExchange() }),
                  ),
                this._options.subscriptionFullInfo &&
                  ei.includes(e) &&
                  t[e].push(
                    Ts.format({ listedExchange: this._model.listedExchange() }),
                  )),
              'EOD' === e && (t[e] = [Is]),
              'TickByTick' === e)
            ) {
              const i =
                  void 0 === a.updatePeriod
                    ? Ds
                    : (0, os.htmlEscape)(
                        J.t(
                          null,
                          {
                            count: a.updatePeriod,
                            replace: {
                              amount: (a.updatePeriod ?? 1).toString(),
                            },
                            plural:
                              'Data on our Basic plan is updated once every {amount} seconds, even if there are more updates on the market.',
                          },
                          s(83978),
                        ),
                      ),
                l =
                  void 0 === a.updatePeriod
                    ? Ps
                    : (0, os.htmlEscape)(
                        J.t(
                          null,
                          {
                            count: a.updatePeriod,
                            replace: {
                              amount: (a.updatePeriod ?? 1).toString(),
                            },
                            plural:
                              'Data is updated once every {amount} seconds, even if there are more updates on the market.',
                          },
                          s(51931),
                        ),
                      )
              t[e].push(this._options.subscriptionFullInfo ? i : l),
                this._options.subscriptionFullInfo && t[e].push(zs)
            }
            if (null !== o && 'BATSToRealtime' === e) {
              const s = this._model.listedExchange()
              const l = (0, Gs.isAmexToCboeMigratedSymbol)(
                s,
                this._model.proPerm(),
              )
              0,
                Gs.CRUCIAL_REALTIME_BATS.includes(
                  this._model.listedExchange(),
                ) || l
                  ? t[e].push(Us.format({ exchange: s, originalExchange: As }))
                  : t[e].push(
                      Rs.format({ symbolName: i, exchange: o }),
                      '' !== s
                        ? (0, os.htmlEscape)(Fs).format({ exchange: s })
                        : (0, os.htmlEscape)(Os),
                    )
            }
          }
          return Object.keys(t).length > 0 ? t : null
        }
        async _getActions() {
          if (null === this._dataUpdatedInfo.value() || null === this._model)
            return null
          const e = {}
          return Object.keys(e).length > 0 ? e : null
        }
        _showSupportDialogForUpdateMode(e) {}
        _getShortTexts() {
          const e = this._dataUpdatedInfo.value()
          if (null === e || null === this._model) return null
          const t = {}
          for (const i of e) {
            const e = i.mode
            if (
              ([
                'DelayToRealtime',
                'DelayNoRealtime',
                ...ei,
                'DelayWithoutMarketAgreement',
              ].includes(e) && (t[e] = Vs),
              'EOD' === e && (t[e] = Ls),
              'TickByTick' === e)
            ) {
              const l =
                void 0 === i.updatePeriod
                  ? Ws
                  : (0, os.htmlEscape)(
                      J.t(
                        null,
                        {
                          plural: 'One update every {amount} seconds',
                          count: i.updatePeriod,
                          replace: { amount: (i.updatePeriod ?? 1).toString() },
                        },
                        s(36050),
                      ),
                    )
              t[e] = l
            }
            if ('BATSToRealtime' === e) {
              const s = this._model.firstReplacedByBatsExchange() ?? ''
              0,
                (t[e] =
                  '' !== s
                    ? xs.format({ exchange: s, originalExchange: As })
                    : As)
            }
          }
          return Object.keys(t).length > 0 ? t : null
        }
        _updateBlinkingMode() {
          const e = this._dataUpdatedInfo.value()
          if (null === e) return
          const t = this._dataModeBlinkingStatuses.value()
          for (const s of e)
            if (!t.includes(s.mode))
              return void this.isBlinkingMode.setValue(!0)
          this.isBlinkingMode.setValue(!1)
        }
        _turnOffBlinking() {
          const e = this._dataUpdatedInfo.value()
          if (null !== e) for (const t of e) qs(t.mode)
        }
        _goProDialogAction(e, t = {}) {
          return {
            text: li,
            onClick: () => {
              null !== this._model &&
                createGoProDialog({
                  forceUpgradeBtn: !0,
                  goOnMarkets: !0,
                  customParams: t,
                  upgradeMessage: J.t(null, void 0, s(70032)),
                  feature: e,
                }).then(() => {
                  trackEvent('Data Warning', 'Full description visible', e)
                })
            },
          }
        }
      }
      const ai = J.t(null, void 0, s(86158)),
        ni = new Map([
          [
            !0,
            new Map([
              ['small', gs],
              ['medium', bs],
              ['large', bs],
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
        ri = new Map([
          [!0, ns.dataProblemLow],
          [!1, null],
        ]),
        di = new Map([
          [!0, ai],
          [!1, null],
        ]),
        ui = new Map([
          [!0, ai],
          [!1, null],
        ]),
        hi = new Map([
          [!0, ls.colorsPalette['color-data-problem']],
          [!1, null],
        ])
      class ci extends rs {
        constructor(e, t, s) {
          super({
            iconMap: ni,
            classNameMap: ri,
            tooltipMap: di,
            titleMap: ui,
            titleColorMap: hi,
            size: t,
          }),
            (this._dataSourceErrorStatus = new n.WatchedValue(null).spawn()),
            (this._lastError = null),
            (this._options = s),
            this.setSource(e)
        }
        destroy() {
          this._dataSourceErrorStatus.destroy(), super.destroy()
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
          return (
            (e ? this._getDataSourceErrorStatusCustomTitle() : null) ??
            super._getTooltip(e)
          )
        }
        _getTitle(e) {
          return (
            (e ? this._getDataSourceErrorStatusCustomTitle() : null) ??
            super._getTitle(e)
          )
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
                  html:
                    void 0 === t.stackTrace
                      ? [(0, as.formatStudyError)((0, os.htmlEscape)(t.error))]
                      : null,
                  size: this._size,
                  action: this._getAction(e),
                  solutionId: this._options.errorSolution
                    ? this._dataSourceErrorStatus.value()?.solutionId
                    : void 0,
                  dataTestId: 'data-source-error-status',
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
          return this._dataSourceErrorStatus.value()?.title || null
        }
      }
      const _i = J.t(null, void 0, s(78992)),
        pi = new Map([
          [
            'high',
            new Map([
              ['small', gs],
              ['medium', bs],
              ['large', bs],
            ]),
          ],
          [
            'low',
            new Map([
              ['small', gs],
              ['medium', bs],
              ['large', bs],
            ]),
          ],
        ]),
        mi = new Map([
          ['high', ns.dataProblemHigh],
          ['low', ns.dataProblemLow],
        ]),
        gi = new Map([
          ['high', _i],
          ['low', _i],
        ]),
        bi = new Map([
          ['high', ls.colorsPalette['color-data-problem']],
          ['low', ls.colorsPalette['color-data-problem']],
        ])
      class vi extends rs {
        constructor(e, t) {
          super({
            tooltipMap: gi,
            iconMap: pi,
            classNameMap: mi,
            titleMap: gi,
            titleColorMap: bi,
            size: t,
          }),
            (this._dataProblems = new n.WatchedValue([]).spawn()),
            (this._isDataProblemCritical = new n.WatchedValue(!1)),
            this.setModel(e)
        }
        destroy() {
          this._dataProblems.destroy(), super.destroy()
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
              : (this._dataProblems = new n.WatchedValue([]).spawn())
        }
        async _updateFullTooltip() {
          const e = this.status().value(),
            t = this._dataProblems.value()
          if (null === e || 0 === t.length)
            return void this._fullTooltip.setValue(null)
          const s = t.map((t, s) => ({
            icon: this._getIcon(e),
            iconClassName: this._getFullTooltipIconClassNames(e),
            title: t.title ?? (0 === s ? this._getTitle(e) : null),
            titleColor: this._getTitleColor(e),
            html: [(0, os.htmlEscape)(t.text)],
            size: this._size,
            action: this._getAction(e),
          }))
          this._fullTooltip.setValue(s)
        }
        _getTooltip(e) {
          return this._getDataProblemCustomTitle() ?? super._getTooltip(e)
        }
        _getTitle(e) {
          return this._getDataProblemCustomTitle() ?? super._getTitle(e)
        }
        _updateStatus(e) {
          const t = e[0]?.severity ?? null,
            s = this._status.value() !== t
          this._status.setValue(t),
            this._isDataProblemCritical.setValue(((e) => 'high' === e)(t)),
            s || this._updateFullTooltip()
        }
        _getDataProblemCustomTitle() {
          return this._dataProblems.value()?.[0]?.title || null
        }
      }
      class wi extends rs {
        constructor(e, t) {
          super(t),
            (this._booleanStatus = new n.WatchedValue(!1).spawn()),
            this.updateStatus(e)
        }
        destroy() {
          this._booleanStatus.destroy(), super.destroy()
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
      const Si = J.t(null, void 0, s(14285)),
        yi = J.t(null, void 0, s(53272)),
        Mi = new Map([
          [
            !0,
            new Map([
              ['small', gs],
              ['medium', bs],
              ['large', bs],
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
        fi = new Map([
          [!0, ns.invalidSymbol],
          [!1, null],
        ]),
        Ci = new Map([
          [!0, Si],
          [!1, null],
        ]),
        Ei = new Map([
          [!0, Si],
          [!1, null],
        ]),
        Vi = new Map([
          [!0, ls.colorsPalette['color-invalid-symbol']],
          [!1, null],
        ]),
        Li = new Map([
          [!0, [yi]],
          [!1, null],
        ]),
        Wi = new Map([
          [!0, null],
          [!1, null],
        ])
      class Ai {
        constructor(e, t) {
          ;(this.isBlinkingMode = new n.WatchedValue(!1)),
            (this._status = new n.WatchedValue(null)),
            (this._size = 'small'),
            (this._fullInfo = new n.WatchedValue(null)),
            (this._className = new n.WatchedValue(ns.marketStatusCustom)),
            (this._symbolModel = null),
            (this._symbol = null),
            (this._tooltip = new n.WatchedValue(null)),
            (this._icon = new n.WatchedValue(null)),
            (this._visible = new n.WatchedValue(!1)),
            (this._color = new n.WatchedValue(null)),
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
          const t = e.map((e) => ({
            icon: e.icon ?? this.icon().value(),
            iconClassName: [ns.marketStatusCustom],
            title: e.title,
            titleColor: e.color ?? this.customColor().value(),
            html: e.content,
            size: this.size(),
            action: this._buildAction(e.action),
          }))
          this._fullInfo.setValue(t)
        }
        _buildAction(e) {
          return e && e.onClick
            ? { text: e.text ?? '', tooltip: e.tooltip, onClick: e.onClick }
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
          this._visible.setValue(this._symbolModel?.visible().value() ?? !1),
            this._color.setValue(this._symbolModel?.color().value() ?? null),
            this._icon.setValue(this._symbolModel?.icon().value() ?? null),
            this._tooltip.setValue(
              this._symbolModel?.tooltip().value() ?? null,
            ),
            this._updateFullInfo(
              this._symbolModel?.tooltipContent().value() ?? null,
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
      var xi = s(38119),
        ki = s(53218),
        Ti = s(32140),
        Hi = s(62998),
        Bi = s(25230),
        Ii = s(15507),
        Di = s(43401),
        Pi = s(85290),
        zi = s(12462)
      const Ni = J.t(null, void 0, s(41410)),
        Ri = J.t(null, void 0, s(36018)),
        Oi = J.t(null, void 0, s(73897)),
        Fi = J.t(null, void 0, s(62464)),
        Ui = J.t(null, void 0, s(87845)),
        Gi = J.t(null, void 0, s(29938)),
        Zi = J.t(null, void 0, s(65420)),
        ji = J.t(null, void 0, s(23302)),
        $i = J.t(null, void 0, s(52176)),
        Qi = J.t(null, void 0, s(41392)),
        Ki = J.t(null, void 0, s(59938)),
        qi = J.t(null, void 0, s(99822)),
        Ji = J.t(null, void 0, s(66595)),
        Xi = J.t(null, void 0, s(43094)),
        Yi = J.t(null, void 0, s(81509)),
        el = J.t(null, void 0, s(58470)),
        tl = new Map([
          [
            'market',
            new Map([
              ['small', Ti],
              ['medium', Hi],
              ['large', Hi],
            ]),
          ],
          [
            'pre_market',
            new Map([
              ['small', Pi],
              ['medium', zi],
              ['large', zi],
            ]),
          ],
          [
            'post_market',
            new Map([
              ['small', Ii],
              ['medium', Di],
              ['large', Di],
            ]),
          ],
          [
            'out_of_session',
            new Map([
              ['small', ki],
              ['medium', ki],
              ['large', ki],
            ]),
          ],
          [
            'holiday',
            new Map([
              ['small', Bi],
              ['medium', Bi],
              ['large', Bi],
            ]),
          ],
        ]),
        sl = new Map([
          ['market', ns.marketStatusOpen],
          ['pre_market', ns.marketStatusPre],
          ['post_market', ns.marketStatusPost],
          ['out_of_session', ns.marketStatusClose],
          ['holiday', ns.marketStatusHoliday],
        ]),
        il = new Map([
          ['market', Ni],
          ['pre_market', Ri],
          ['post_market', Oi],
          ['out_of_session', Fi],
          ['holiday', Ui],
        ]),
        ll = new Map([
          ['market', Ni],
          ['pre_market', Ri],
          ['post_market', Oi],
          ['out_of_session', Fi],
          ['holiday', Ui],
        ]),
        ol = new Map([
          ['market', ls.colorsPalette['color-market-open']],
          ['pre_market', ls.colorsPalette['color-pre-market']],
          ['post_market', ls.colorsPalette['color-post-market']],
          ['out_of_session', ls.colorsPalette['color-market-closed']],
          ['holiday', ls.colorsPalette['color-market-holiday']],
        ]),
        al = new Map([
          ['market', Gi],
          ['pre_market', Zi],
          ['post_market', ji],
          ['out_of_session', $i],
          ['holiday', Qi],
        ])
      const nl = tl,
        rl = sl,
        dl = il,
        ul = ll,
        hl = ol,
        cl = al
      function _l(e) {
        const t = Math.floor(e / 86400),
          i = Math.floor((e - 86400 * t) / 3600),
          l = Math.floor((e - 86400 * t - 3600 * i) / 60)
        if (0 === t && 0 === i && 0 === l) return Ki
        if (t > 0) {
          const e = J.t(
              null,
              {
                plural: '{number} days',
                count: t,
                replace: { number: `${t}` },
                context: 'Market opens in n days and n hours',
              },
              s(62218),
            ),
            l = J.t(
              null,
              {
                plural: '{number} hours',
                count: i,
                replace: { number: `${i}` },
                context: 'Market opens in n days and n hours',
              },
              s(65463),
            )
          return J.t(null, { replace: { days: e, hours: l } }, s(51320))
        }
        if (i > 0) {
          const e = J.t(
              null,
              {
                plural: '{number} hours',
                count: i,
                replace: { number: `${i}` },
                context: 'Market opens in n hours and n minutes',
              },
              s(21730),
            ),
            t = J.t(
              null,
              {
                plural: '{number} minutes',
                count: l,
                replace: { number: `${l}` },
                context: 'Market opens in n hours and n minutes',
              },
              s(82796),
            )
          return J.t(null, { replace: { hours: e, minutes: t } }, s(90549))
        }
        return J.t(
          null,
          {
            plural: '{number} minutes',
            count: l,
            replace: { number: `${l}`, context: 'Market opens in n minutes' },
          },
          s(32547),
        )
      }
      const pl = {
          market: (e) =>
            ('post_market' === e.status ? Yi : Xi).format({
              remainingTime: _l(e.remainingSeconds),
            }),
          pre_market: (e) =>
            Ji.format({ remainingTime: _l(e.remainingSeconds) }),
          post_market: (e) =>
            Xi.format({ remainingTime: _l(e.remainingSeconds) }),
          out_of_session: (e) =>
            ('pre_market' === e.status ? el : qi).format({
              remainingTime: _l(e.remainingSeconds),
            }),
          holiday: (e) =>
            ('pre_market' === e.status ? el : qi).format({
              remainingTime: _l(e.remainingSeconds),
            }),
          delisted: (e) => '',
          expired: (e) => '',
        },
        ml = new Map([
          ['market', null],
          ['pre_market', null],
          ['post_market', null],
          ['out_of_session', null],
          ['holiday', null],
          ['delisted', null],
        ])
      class gl extends rs {
        constructor(e, t, s = !1) {
          super({
            tooltipMap: dl,
            iconMap: nl,
            classNameMap: rl,
            titleMap: ul,
            titleColorMap: hl,
            actionMap: ml,
            size: t,
          }),
            (this._model = null),
            (this._expiredStatus = null),
            (this._marketStatus = new n.WatchedValue(null).spawn()),
            (this._sessionEdge = new n.WatchedValue(null).spawn()),
            (this._ignoreHideStatusSettings = s),
            this.setModel(e),
            Lt.showMarketOpenStatusProperty.subscribe(
              this,
              this._showMarketOpenStatusPropertyChanged,
            )
        }
        destroy() {
          this._marketStatus.destroy(),
            this._sessionEdge.destroy(),
            (this._model = null),
            Lt.showMarketOpenStatusProperty.unsubscribeAll(this),
            super.destroy()
        }
        setModel(e) {
          if (
            (this._marketStatus.destroy(),
            this._sessionEdge.destroy(),
            this._expiredStatus?.destroy(),
            null === e)
          )
            return (
              (this._marketStatus = new n.WatchedValue(null).spawn()),
              (this._sessionEdge = new n.WatchedValue(null).spawn()),
              void (this._expiredStatus = null)
            )
          this._model = e
          const t = e.futuresContractExpirationTime()
          t &&
            ((this._expiredStatus = t.expired().spawn()),
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
          const t = [],
            s = cl.get(e)
          s && t.push((0, os.htmlEscape)(s))
          const i = this._marketStatus.value()
          if (
            null !== this._model &&
            null !== i &&
            'expired' !== i &&
            'delisted' !== i
          ) {
            const s = this._model.nextSessionEdge().value()
            null !== s && t.push({ text: pl[e](s), bold: !0 })
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
            !Lt.showMarketOpenStatusProperty.value() &&
            'market' === e
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
      var bl
      !((e) => {
        ;(e.Small = 'small'), (e.Medium = 'medium'), (e.Large = 'large')
      })(bl || (bl = {}))
      class vl {
        constructor(e) {
          ;(this._el = document.createElement('div')),
            (this._prevCustomClass = null),
            (this._prevCustomColor = null),
            (this._customColor = null),
            (this._size = e.size || 'small'),
            (this._icon = e.icon.spawn()),
            (this._className = e.className.spawn()),
            (this._visible = (0, w.combine)(
              (e, t) => e && !!t,
              e.visible.spawnOwnership(),
              e.icon.spawnOwnership(),
            )),
            this._el.classList.add(ns.statusItem, ns[this._size]),
            e.datasetName && (this._el.dataset.name = e.datasetName),
            e.datasetEntityId &&
              ((this._entityId = e.datasetEntityId.spawn()),
              this._entityId.subscribe(
                (e) => {
                  this._el.dataset.entityId = e
                },
                { callWithLast: !0 },
              )),
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
          this._entityId?.destroy(),
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
          this._el.classList.toggle(ns.blinking, e)
        }
      }
      var wl
      function Sl(e, t, s) {
        for (const i of t)
          for (const t of i.split(' ')) e.classList.toggle(t, s)
      }
      !((e) => {
        e.TooltipSeparator = ' · '
      })(wl || (wl = {}))
      class yl {
        constructor(e, t, s, i = ns) {
          ;(this.element = document.createElement('div')),
            (this._blinkingSpawns = []),
            (this._iconsRenderers = []),
            (this._updateIcons = () => {
              const [e, t] = this._iconsRenderers.reduce(
                (e, t) => {
                  const s = t.element()
                  return (
                    t.visible().value() && e[0].length < 3
                      ? e[0].push(s)
                      : e[1].push(s),
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
            (this._theme = i)
          const l = [
            this._theme.statuses,
            'apply-common-tooltip',
            'common-tooltip-wide',
            this._theme[e],
            this._theme.statuses_hidden,
          ]
          Sl(this.element, l, !0),
            (this._tooltips = t.spawn()),
            this._tooltips.subscribe(this._updateTooltip.bind(this)),
            (this._onClickCallback = s.onClick),
            (this._onClickHandler = this._onClick.bind(this)),
            this.element.addEventListener('click', this._onClickHandler),
            (this.element.dataset.name = 'legend-source-item-status')
        }
        destroy() {
          for (const e of this._iconsRenderers) e.destroy()
          for (const e of this._blinkingSpawns) e.destroy()
          this._tooltips.destroy(),
            this.element.removeEventListener('click', this._onClickHandler),
            this.element.remove()
        }
        setVisibility(e) {
          Sl(this.element, [this._theme.statuses_hidden], e)
        }
        addStatusModel(e) {
          const t = new vl({
            visible: e.visible,
            icon: e.model.icon(),
            className: e.model.className(),
            size: e.model.size(),
            isBlinking: e.model.isBlinkingMode,
            turnOffBlinking: e.model.turnOffBlinkingMode,
            customColor: e.model.customColor(),
            datasetName: e.iconDatasetName,
            datasetEntityId: e.iconDatasetEntityId,
          })
          this._iconsRenderers.push(t)
          const s = e.model.isBlinkingMode.spawn()
          s.subscribe(this._updateBlinkingMode.bind(this)),
            t.visible().subscribe(this._updateIcons, { callWithLast: !0 }),
            this._blinkingSpawns.push(s),
            this._updateBlinkingMode()
        }
        _onClick(e) {
          e.preventDefault()
          const t = this._iconsRenderers.filter((e) => e.visible().value())
          for (const e of t) e.onClick()
          let s = 14
          t.length > 1 && (s -= 2)
          const i = this.element.getBoundingClientRect(),
            l = { x: i.left - s, y: i.bottom + 4 }
          this._onClickCallback(l)
        }
        _updateTooltip() {
          this.element.setAttribute('title', this._tooltips.value().join(' · '))
        }
        _updateBlinkingMode() {
          const e = this._blinkingSpawns.some((e) => e.value())
          Sl(this.element, [this._theme.blinking], e)
        }
      }
      class Ml {
        constructor(e) {
          ;(this._size = b.trackingModeIsAvailable ? 'medium' : 'small'),
            (this._statusWidgetInfos = []),
            (this._tooltips = new n.WatchedValue([])),
            (this._visibilitySpawns = []),
            (this._tooltipSpawns = []),
            (this._visibility = new n.WatchedValue(!1)),
            (this._renderer = new yl(this._size, this._tooltips, {
              onClick: this._handleToggleDropdown.bind(this),
            })),
            (this._container = document.createElement('div')),
            (this._menuOpened = !1),
            (this._menuPosition = null),
            (this._handleDropdownMenuClose = () => {
              ;(this._menuOpened = !1), this._updateDropdownMenu()
            }),
            (this._options = e)
        }
        destroy() {
          this._visibility.unsubscribe()
          for (const e of this._tooltipSpawns) e.destroy()
          for (const e of this._visibilitySpawns) e.destroy()
          for (const e of this._statusWidgetInfos) {
            if (e.additionalWidgets)
              for (const t of e.additionalWidgets) t.destroy()
            e.model.destroy()
          }
          this._renderer.destroy()
        }
        visibility() {
          return this._visibility.readonly()
        }
        getElement() {
          return this._renderer.element
        }
        _updateTooltipsAndVisibilitiesAfterRecreate() {
          for (const e of this._tooltipSpawns)
            e.subscribe(this._updateTooltips.bind(this))
          for (const e of this._visibilitySpawns)
            e.subscribe(this._updateTooltips.bind(this))
          this._updateTooltips()
        }
        _updateTooltips() {
          const e = []
          for (let t = 0; t < this._tooltipSpawns.length; t++) {
            if (!this._visibilitySpawns[t].value()) continue
            const s = this._tooltipSpawns[t].value()
            null !== s && s.length > 0 && e.push(s)
          }
          this._tooltips.setValue(e)
        }
        _addStatusWidgetInfos(e) {
          this._statusWidgetInfos.push(e),
            this._renderer.addStatusModel(e),
            e.visible.subscribe(this._updateTooltips.bind(this)),
            this._visibilitySpawns.push(e.visible.spawn())
        }
        _addTooltipSpawn(e) {
          e.subscribe(this._updateTooltips.bind(this)),
            this._tooltipSpawns.push(e)
        }
        _addVisibilitySpawn(e) {
          e.subscribe(this._updateTooltips.bind(this)),
            this._visibilitySpawns.push(e)
        }
        _handleToggleDropdown(e) {
          var t
          ;(this._menuPosition = e),
            (this._menuOpened = !this._menuOpened),
            this._menuOpened &&
              ((t = `Open full tooltip for statuses: ${this._tooltips.value().join(', ')}`),
              (0, X.trackEvent)('GUI', "Statuses widget's action", t)),
            this._updateDropdownMenu()
        }
        async _updateDropdownMenu() {
          const e = Promise.all([
            s.e(3953),
            s.e(5826),
            s.e(2564),
            s.e(7204),
            s.e(2544),
            s.e(8643),
          ]).then(s.bind(s, 12048))
          await Promise.all([
            ...this._statusWidgetInfos.map((e) => e.preliminaryJob),
            e,
          ]),
            e.then((e) => {
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
      class fl extends Ml {
        constructor(e, t, s) {
          super(s),
            (this.dataSourceErrorStatusShown = new n.WatchedValue(!1)),
            (this.dataUpdatedModeShown = new n.WatchedValue(!1)),
            (this.isSymbolInvalidStatusShown = new n.WatchedValue(!1)),
            (this._symbolInvalidViewModel = null),
            (this._dataSourceErrorStatusViewModel = null),
            (this._marketStatusViewModel = null),
            (this._dataUpdatedModeViewModel = null),
            (this._dataProblemViewModel = null),
            (this._updateAvailableViewModel = null),
            (this._pineEditorStateViewModel = null),
            (this._customStatusViewModel = null),
            (this._sessionWidget = null),
            (this._errorWidget = null),
            (this._updateAvailableWidget = null),
            (this._dataSourceHasErrorVisible = null),
            (this._dataSourceErrorCanBeShown = new n.WatchedValue(!1)),
            (this._marketStatusCanBeShown = new n.WatchedValue(!1)),
            (this._dataUpdatedAvailableVisible = null),
            (this._dataUpdatedModeCanBeShown = new n.WatchedValue(!1)),
            (this._dataProblemCanBeShown = new n.WatchedValue(!1)),
            (this._updateAvailableCanBeShown = new n.WatchedValue(!1)),
            (this._isDataProblemCritical = null),
            (this._updateVisibility = (e) => {
              this._visibility.setValue(!e), this._renderer.setVisibility(e)
            }),
            (this._source = e),
            (this._symbol = e.symbol()?.spawn() ?? null),
            (this._options = s),
            (this._undoModel = t),
            (this._statusProviderHidden = e.hidden().spawn()),
            this._statusProviderHidden.subscribe(this._updateVisibility, {
              callWithLast: !0,
            })
          const i = new AbortController()
          ;(this._lastRecreateWidgetAbortController = i),
            this._recreateWidgets().then(() => {
              i.signal.aborted ||
                (this._symbol &&
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
                null !== this._dataUpdatedAvailableVisible &&
                  this._dataUpdatedAvailableVisible.subscribe(
                    this._updateDataUpdatedWidgetIsShown.bind(this),
                  ),
                this._options.dataProblemEnabled &&
                  null !== this._isDataProblemCritical &&
                  this._isDataProblemCritical.subscribe(
                    this._updateStatusWidgetsVisibilities.bind(this),
                  ),
                this._updateErrorWidgetIsShown(),
                this._updateIsSymbolInvalidStatusShown(),
                this._updateStatusWidgetsVisibilities(),
                this._updateTooltipsAndVisibilitiesAfterRecreate())
            })
        }
        destroy() {
          this._lastRecreateWidgetAbortController.abort(),
            this._statusProviderHidden.destroy(),
            this._visibility.unsubscribe(),
            this._symbol?.destroy(),
            this._isDataProblemCritical?.destroy(),
            super.destroy()
        }
        _updateStatusWidgetsVisibilities() {
          const e = this._isForceStatusActive()
          this._dataSourceErrorCanBeShown.setValue(!e),
            this._marketStatusCanBeShown.setValue(!e),
            this._dataUpdatedModeCanBeShown.setValue(!e),
            this._updateAvailableCanBeShown.setValue(!e),
            this._dataProblemCanBeShown.setValue(!this._isPrimaryWidgetShown())
        }
        _isPrimaryWidgetShown() {
          return this._source.isSymbolInvalid()?.value() ?? !1
        }
        _isForceStatusActive() {
          return (
            this._isPrimaryWidgetShown() ||
            (this._isDataProblemCritical?.value() ?? !1)
          )
        }
        async _recreateWidgets() {
          if (this._options.sourceStatusesEnabled) {
            const e = this._source.isSymbolInvalid()
            if (null !== e)
              if (null === this._symbolInvalidViewModel) {
                this._symbolInvalidViewModel = new wi(e, {
                  tooltipMap: Ci,
                  iconMap: Mi,
                  classNameMap: fi,
                  titleMap: Ei,
                  titleColorMap: Vi,
                  htmlMap: Li,
                  actionMap: Wi,
                  size: this._size,
                })
                const t = this._symbolInvalidViewModel.visible().spawn()
                this._visibilitySpawns.push(t),
                  this._tooltipSpawns.push(
                    this._symbolInvalidViewModel.tooltip().spawn(),
                  ),
                  this._addStatusWidgetInfos({
                    visible: t,
                    model: this._symbolInvalidViewModel,
                  })
              } else
                this._symbolInvalidViewModel.updateStatus(e),
                  this._addSubscriptionForSymbolInvalid()
            if (null === this._dataSourceErrorStatusViewModel) {
              ;(this._dataSourceErrorStatusViewModel = new ci(
                this._source,
                this._size,
                this._options.sourceStatuses,
              )),
                (this._dataSourceHasErrorVisible = (0, w.combine)(
                  (e, t) => e && t,
                  this._dataSourceErrorCanBeShown.weakReference(),
                  this._dataSourceErrorStatusViewModel
                    .visible()
                    .weakReference(),
                )),
                this._visibilitySpawns.push(this._dataSourceHasErrorVisible),
                this._tooltipSpawns.push(
                  this._dataSourceErrorStatusViewModel.tooltip().spawn(),
                )
              const e = []
              0,
                this._addStatusWidgetInfos({
                  visible: this._dataSourceHasErrorVisible,
                  model: this._dataSourceErrorStatusViewModel,
                  additionalWidgets: e,
                })
            } else
              this._dataSourceErrorStatusViewModel.setSource(this._source),
                this._errorWidget?.updateSource(this._source)
          }
          if (this._options.marketStatusEnabled) {
            const e = this._source.marketStatusModel()
            if (null === this._marketStatusViewModel) {
              this._marketStatusViewModel = new gl(e, this._size)
              const t = (0, w.combine)(
                (e, t, s) => e && t && !(0, Vt.isEconomicSymbol)(s),
                this._marketStatusCanBeShown.weakReference(),
                this._marketStatusViewModel.visible().weakReference(),
                this._source.symbolInfo().weakReference(),
              )
              this._visibilitySpawns.push(t),
                this._tooltipSpawns.push(
                  this._marketStatusViewModel.tooltip().spawn(),
                )
              const s = { visible: t, model: this._marketStatusViewModel }
              null !== e &&
                ((this._sessionWidget = new is(this._source)),
                (s.additionalWidgets = [this._sessionWidget])),
                this._addStatusWidgetInfos(s)
            } else
              this._marketStatusViewModel.setModel(e),
                this._sessionWidget?.updateSource(this._source)
          }
          if (this._options.dataUpdateModeEnabled) {
            const e = this._source.dataUpdatedModeModel()
            if (null === this._dataUpdatedModeViewModel) {
              const t = {
                ...this._options.dataUpdateMode,
                marketStatus: this._source
                  .marketStatusModel()
                  ?.status()
                  .spawnOwnership(),
              }
              this._dataUpdatedModeViewModel = new oi(e, this._size, t)
              const s = (0, w.combine)(
                (e, t, s) => e && t && !(0, Vt.isEconomicSymbol)(s),
                this._dataUpdatedModeCanBeShown.weakReference(),
                this._dataUpdatedModeViewModel.visible().weakReference(),
                this._source.symbolInfo().weakReference(),
              )
              this._visibilitySpawns.push(s),
                this._tooltipSpawns.push(
                  this._dataUpdatedModeViewModel.tooltip().spawn(),
                ),
                this._addStatusWidgetInfos({
                  visible: s,
                  model: this._dataUpdatedModeViewModel,
                })
            } else this._dataUpdatedModeViewModel.setModel(e)
          }
          if (this._options.dataProblemEnabled) {
            const e = this._source.dataProblemModel()
            if (null === this._dataProblemViewModel) {
              ;(this._dataProblemViewModel = new vi(e, this._size)),
                (this._isDataProblemCritical = this._dataProblemViewModel
                  .isDataProblemCritical()
                  .spawn())
              const t = (0, w.combine)(
                (e, t) => e && t,
                this._dataProblemCanBeShown.weakReference(),
                this._dataProblemViewModel.visible().weakReference(),
              )
              this._visibilitySpawns.push(t),
                this._tooltipSpawns.push(
                  this._dataProblemViewModel.tooltip().spawn(),
                ),
                this._addStatusWidgetInfos({
                  visible: t,
                  model: this._dataProblemViewModel,
                })
            }
          }
          if (this._source.isMainSeries?.() ?? !1) {
            const e = xi.CustomStatusModel.getInstance(),
              t = this._symbol?.value() ?? null
            if (null === this._customStatusViewModel) {
              ;(this._customStatusViewModel = new Ai(e, this._size)),
                this._customStatusViewModel.setSymbol(t)
              const s = this._customStatusViewModel.visible().spawn()
              this._visibilitySpawns.push(s),
                this._tooltipSpawns.push(
                  this._customStatusViewModel.tooltip().spawn(),
                ),
                this._addStatusWidgetInfos({
                  visible: s,
                  model: this._customStatusViewModel,
                })
            } else
              this._customStatusViewModel.setModel(e),
                this._customStatusViewModel.setSymbol(t)
          }
        }
        async _recreateAndUpdateWidgetState() {
          this._lastRecreateWidgetAbortController?.abort()
          const e = new AbortController()
          ;(this._lastRecreateWidgetAbortController = e),
            await this._recreateWidgets(),
            e.signal.aborted ||
              (this._updateStatusWidgetsVisibilities(),
              this._updateErrorWidgetIsShown(),
              this._updateIsSymbolInvalidStatusShown(),
              this._updateTooltips())
        }
        _addSubscriptionForSymbolInvalid() {
          const e = this._source.isSymbolInvalid()
          this._options.sourceStatusesEnabled &&
            null !== e &&
            (e.subscribe(this._updateStatusWidgetsVisibilities.bind(this)),
            e.subscribe(this._updateIsSymbolInvalidStatusShown.bind(this), {
              callWithLast: !0,
            }))
        }
        _updateErrorWidgetIsShown() {
          const e = this._dataSourceHasErrorVisible?.value() ?? !1
          this.dataSourceErrorStatusShown.setValue(e)
        }
        _updateDataUpdatedWidgetIsShown() {
          const e = this._dataUpdatedAvailableVisible?.value() ?? !1
          this.dataUpdatedModeShown.setValue(e)
        }
        _updateIsSymbolInvalidStatusShown() {
          const e = this._source.isSymbolInvalid()?.value() ?? !1
          this.isSymbolInvalidStatusShown.setValue(e)
        }
      }
      class Cl extends fl {
        constructor(e, t, s) {
          super(e, t, s),
            (this._isInReplay = new n.WatchedValue(!1).readonly().spawn()),
            (this._isInReplayCanBeShown = null),
            (this._inited = !1),
            (this._halalCanBeShown = new n.WatchedValue(!1)),
            (this._tvCalculatedPairCanBeShown = new n.WatchedValue(!1)),
            (this._hkexCommentCanBeShown = new n.WatchedValue(!1)),
            (this._defaultedBondCanBeShown = new n.WatchedValue(!1))
          t.model()
        }
        destroy() {
          super.destroy()
        }
        _updateStatusWidgetsVisibilities() {
          super._updateStatusWidgetsVisibilities()
        }
        _isPrimaryWidgetShown() {
          return super._isPrimaryWidgetShown() || this._isInReplay.value()
        }
        _crateHalalStatus() {}
        _createDefaultedBondStatus() {}
        _createTVCalculatedPairStatus() {}
        _createHKEXCommentStatus() {}
        _createLetItSnowStatus() {}
        _getHalalTypeSpawn() {
          return new n.WatchedValue(null).readonly().spawn()
        }
        _getDefaultedBondSpawn() {
          return new n.WatchedValue(null).readonly().spawn()
        }
        _getTvCalculatedPairSpawn() {
          return new n.WatchedValue(null).readonly().spawn()
        }
        _getHkexCommentSpawn() {
          return new n.WatchedValue(null).readonly().spawn()
        }
      }
      var El,
        Vl = s(32755)
      !((e) => {
        e[(e.ForceDisableHiddenStateTimeoutMs = 3500)] =
          'ForceDisableHiddenStateTimeoutMs'
      })(El || (El = {}))
      class Ll {
        constructor(e, t) {
          ;(this._hidden = new n.WatchedValue(!1)),
            (this._symbol = null),
            (this._isSymbolInvalid = null),
            (this._isIntervalActual = null),
            (this._symbolInfo = new n.WatchedValue(null).spawn()),
            (this._source = e),
            e.properties().hasChild('symbol') &&
              (this._symbol = (0, ce.createWVFromGetterAndSubscription)(
                () => e.properties().symbol.value(),
                e.properties().symbol.listeners(),
              ))
          const s = []
          if ((0, Vl.isStudyLineTool)(e)) s.push(e.onStatusChanged())
          else if ((0, et.isStudy)(e) || (0, et.isStudyStub)(e))
            s.push(e.onStatusChanged(), e.onIsActualIntervalChange()),
              (this._isSymbolInvalid = (0,
              ce.createWVFromGetterAndSubscriptions)(
                () => e.isSymbolInvalid() && e.isActualInterval(),
                s,
              )),
              this._hidden.setValue(!e.isVisible() || !e.isActualInterval()),
              (0, et.isStudy)(e) &&
                ((this._isIntervalActual = (0,
                ce.createWVFromGetterAndSubscription)(
                  () => e.isActualInterval(),
                  e.onIsActualIntervalChange(),
                )),
                this._isIntervalActual.subscribe(() => {
                  this._hidden.setValue(!e.isVisible() || !e.isActualInterval())
                }))
          else {
            ;(0, o.assert)(e === t.mainSeries())
            const i = t.mainSeries()
            s.push(i.onStatusChanged()),
              (this._isSymbolInvalid = (0,
              ce.createWVFromGetterAndSubscriptions)(
                () => i.isSymbolInvalid(),
                s,
              )),
              (this._symbolInfo = (0, ce.createWVFromGetterAndSubscription)(
                i.symbolInfo.bind(i),
                i.dataEvents().symbolResolved(),
              ))
          }
          this._dataSourceErrorStatus = (0,
          ce.createWVFromGetterAndSubscriptions)(
            () => this._source.statusProvider({}).errorStatus(),
            s,
          )
        }
        destroy() {
          this._symbol?.destroy(),
            this._isSymbolInvalid?.destroy(),
            this._dataSourceErrorStatus.destroy(),
            this._symbolInfo.destroy(),
            this._isIntervalActual?.destroy()
        }
        entityId() {
          return this._source.id()
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
        async pineSourceCodeModel() {
          return null
        }
        isMainSeries() {
          return this._source.isMainSeries?.() ?? !1
        }
      }
      class Wl extends Ll {
        constructor(e, t) {
          super(e, t),
            (this._quotesData = new n.WatchedValue(null)),
            (this._forceDisableHiddenState = new n.WatchedValue(!0)),
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
      const Al = J.t(null, void 0, s(10319)),
        xl = J.t(null, void 0, s(79744)),
        kl = J.t(null, void 0, s(64730)),
        Tl = new Map([
          [
            !0,
            new Map([
              ['small', gs],
              ['medium', bs],
              ['large', bs],
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
        Hl = new Map([
          [!0, ns.hasError],
          [!1, null],
        ]),
        Bl = new Map([
          [!0, Al],
          [!1, null],
        ]),
        Il = new Map([
          [!0, Al],
          [!1, null],
        ]),
        Dl = new Map([
          [!0, ls.colorsPalette['color-invalid-symbol']],
          [!1, null],
        ]),
        Pl = new Map([
          [!0, [xl]],
          [!1, null],
        ]),
        zl = new Map([
          [!0, [kl]],
          [!1, null],
        ])
      function Nl(e) {
        switch (e) {
          case 0:
            return Pl
          case 1:
            return zl
          default:
            throw new Error('Unknown CombinedStatusWidgetType')
        }
      }
      var Rl = s(2588),
        Ol = s(57979)
      const Fl = J.t(null, void 0, s(48758)),
        Ul = J.t(null, void 0, s(58744)),
        Gl = J.t(null, void 0, s(92663)),
        Zl = new Map([
          [
            !0,
            new Map([
              ['small', Rl],
              ['medium', Ol],
              ['large', Ol],
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
        jl = new Map([
          [!0, ns.updateAvailable],
          [!1, null],
        ]),
        $l = new Map([
          [!0, Fl],
          [!1, null],
        ]),
        Ql = new Map([
          [!0, Fl],
          [!1, null],
        ]),
        Kl = new Map([
          [!0, ls.colorsPalette['color-deep-blue-a400']],
          [!1, null],
        ]),
        ql = new Map([
          [!0, [Ul]],
          [!1, null],
        ]),
        Jl = new Map([
          [!0, [Gl]],
          [!1, null],
        ])
      function Xl(e) {
        switch (e) {
          case 0:
            return ql
          case 1:
            return Jl
          default:
            throw new Error('Unknown CombinedStatusWidgetType')
        }
      }
      var Yl
      !((e) => {
        ;(e[(e.Legend = 0)] = 'Legend'), (e[(e.Items = 1)] = 'Items')
      })(Yl || (Yl = {}))
      class eo extends Ml {
        constructor(e, t) {
          super(t),
            (this._dataSourceStatusWidgets = []),
            (this._hasErrorStatus = null),
            (this._hasUpdateStatus = null),
            (this._hasErrorViewModel = null),
            (this._hasUpdateViewModel = null),
            (this._updateVisibility = () => {
              const e = this._visibilitySpawns.every((e) => !e.value())
              this._visibility.setValue(!e), this._renderer.setVisibility(e)
            }),
            (this._type = e)
        }
        destroy() {
          this._hasErrorViewModel?.destroy(),
            this._hasUpdateViewModel?.destroy(),
            super.destroy()
        }
        addStatusWidget(e) {
          this._dataSourceStatusWidgets.push(e),
            this._recreateHasErrorStatus(),
            this._recreateHasUpdateStatus(),
            this._recreateWidgets()
        }
        clear() {
          ;(this._dataSourceStatusWidgets = []),
            this._hasErrorStatus?.destroy(),
            (this._hasErrorStatus = null),
            this._hasUpdateStatus?.destroy(),
            (this._hasUpdateStatus = null)
        }
        async _recreateWidgets() {
          const e = this._hasErrorStatus
          if (null !== e)
            if (null === this._hasErrorViewModel) {
              ;(this._hasErrorViewModel = new wi(e, {
                classNameMap: Hl,
                htmlMap: Nl(this._type),
                iconMap: Tl,
                size: this._size,
                titleColorMap: Dl,
                titleMap: Il,
                tooltipMap: Bl,
              })),
                this._addTooltipSpawn(this._hasErrorViewModel.tooltip().spawn())
              const t = this._hasErrorViewModel.visible().spawn()
              t.subscribe(this._updateVisibility),
                this._addStatusWidgetInfos({
                  visible: t,
                  model: this._hasErrorViewModel,
                })
            } else this._hasErrorViewModel.updateStatus(e)
          const t = this._hasUpdateStatus
          if (null !== t)
            if (null === this._hasUpdateViewModel) {
              ;(this._hasUpdateViewModel = new wi(t, {
                classNameMap: jl,
                htmlMap: Xl(this._type),
                iconMap: Zl,
                size: this._size,
                titleColorMap: Kl,
                titleMap: Ql,
                tooltipMap: $l,
              })),
                this._addTooltipSpawn(
                  this._hasUpdateViewModel.tooltip().spawn(),
                )
              const e = this._hasUpdateViewModel.visible().spawn()
              e.subscribe(this._updateVisibility),
                this._addStatusWidgetInfos({
                  visible: e,
                  model: this._hasUpdateViewModel,
                })
            } else this._hasUpdateViewModel.updateStatus(t)
        }
        _recreateHasErrorStatus() {
          this._hasErrorStatus?.destroy()
          const e = (0, w.combine)(
            (e) =>
              this._dataSourceStatusWidgets.map((e) =>
                e.dataSourceErrorStatusShown.weakReference(),
              ),
            new n.WatchedValue(this._dataSourceStatusWidgets).weakReference(),
          )
          this._hasErrorStatus = (0, w.accumulate)(
            (e) => e.some((e) => e),
            e.ownership(),
          )
        }
        _recreateHasUpdateStatus() {
          this._hasUpdateStatus?.destroy()
          const e = (0, w.combine)(
            (e) =>
              this._dataSourceStatusWidgets.map((e) =>
                e.dataUpdatedModeShown.weakReference(),
              ),
            new n.WatchedValue(this._dataSourceStatusWidgets).weakReference(),
          )
          this._hasUpdateStatus = (0, w.accumulate)(
            (e) => e.some((e) => e),
            e.ownership(),
          )
        }
      }
      var to = s(85662)
      const so = {
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
      }
      var io
      !((e) => {
        ;(e.TogglerStateSettingsKey = 'legend.isVisibilityToggled'),
          (e[(e.TextSourceIsAlwaysTickerMaxSize = 132)] =
            'TextSourceIsAlwaysTickerMaxSize')
      })(io || (io = {}))
      c.enabled('hide_legend_by_default')
      const lo = c.enabled('fundamental_widget'),
        oo = c.enabled('legend_context_menu'),
        ao = 2 * Number.parseInt(k.marginlegendhoriz)
      class no {
        constructor(e, t, s, i, o, d, u, h) {
          ;(this._mainSeriesViewModel = null),
            (this._dataSourceViewModels = []),
            (this._sourcesIds = []),
            (this._visibleDataSourceCount = new n.WatchedValue(0)),
            (this._themedColor = new n.WatchedValue('')),
            (this._mainSeriesRowHidden = null),
            (this._dataSourceRowsHidden = []),
            (this._customWidgetsVisibilities = []),
            (this._allLegendHidden = new n.WatchedValue(!1)),
            (this._studiesLegendHidden = new n.WatchedValue(!1)),
            (this._showCollapserWithOneIndicator = new n.WatchedValue(!1)),
            (this._customWidgetsHeights = []),
            (this._onLegendVisibilityToggled = null),
            (this._availableHeight = 0),
            (this._collapsedDataSourcesCount = new n.WatchedValue(0)),
            (this._collapsedDataSourcesTitle = new n.WatchedValue('')),
            (this._mainSeriesStatusWidget = null),
            (this._dataSourcesStatusesWidgets = []),
            (this._statusProviders = new Map()),
            (this._size = null),
            (this._customLegendWidgetsFactoriesMap = new Map()),
            (this._customLegendWidgetsMap = new Map()),
            (this._margin = 0),
            (this._layoutChanged = new a.Delegate()),
            (this._model = e),
            (this._paneWidget = t),
            (this._options = (0, r.merge)((0, r.clone)(so), u)),
            (this._callbacks = h),
            (this._mainSeriesViewModelsOptions = {
              readOnlyMode: this._options.readOnlyMode,
              symbolMarkerEnabled: this._options.symbolMarkerEnabled,
            }),
            (this._dataSourceViewModelsOptions = {
              ...this._mainSeriesViewModelsOptions,
              canShowSourceCode: this._options.canShowSourceCode,
            }),
            (this._backgroundThemeName = s)
          const c = this._showLegendCalculatedProperty()
          ;(this._isDataSourcesCollapsed = new n.WatchedValue(c.value())),
            c.subscribe(this, () => {
              this._isDataSourcesCollapsed.setValue(c.value())
            })
          const _ = new n.WatchedValue(this._getCustomTextColorValue()),
            p = this._model.model().properties().childs()
          p.scalesProperties.childs().textColor.subscribe(this, () => {
            _.setValue(this._getCustomTextColorValue())
          })
          const m = p.paneProperties
              .childs()
              .legendProperties.childs().showBackground,
            g = new n.WatchedValue(m.value())
          m.subscribe(this, () => {
            g.setValue(m.value())
          })
          const b = p.paneProperties
              .childs()
              .legendProperties.childs().backgroundTransparency,
            v = new n.WatchedValue(b.value())
          b.subscribe(this, () => {
            v.setValue(b.value())
          }),
            (this._hideNotMainSources = i),
            this._hideNotMainSources.subscribe(
              this._updateLegendVisibilities.bind(this),
            ),
            (this._hideAllExceptFirstLine = o),
            this._hideAllExceptFirstLine.subscribe(
              this._updateCollapsedSourcesMode.bind(this),
            ),
            (this._hideWholeLegend = d),
            this._hideWholeLegend.subscribe(
              this._updateLegendVisibilities.bind(this),
            ),
            (this._isPaneMain = new n.WatchedValue(this._getIsPaneMainValue())),
            (this._updateCollapsedSourcesModeThrottle = (0, l.default)(
              this._updateCollapsedSourcesMode.bind(this),
              100,
            )),
            this._isPaneMain.subscribe(
              (e) => this._showCollapserWithOneIndicator.setValue(e),
              { callWithLast: !0 },
            ),
            (this._collapsedDataSourcesStatusWidget = new eo(
              1,
              this._options.statusesWidgets,
            )),
            (this._toggledDataSourcesStatusWidget = new eo(
              0,
              this._options.statusesWidgets,
            )),
            (this._renderer = new de(
              {
                isMultipleLayout: this._model.isMultipleLayout(),
                withActions: !this._options.readOnlyMode,
                showToggleButton: this._options.showToggleButton,
                isStudiesLegendHidden: this._studiesLegendHidden.readonly(),
                isAllLegendHidden: this._allLegendHidden.readonly(),
                customTextColor: _.readonly(),
                themedColor: this._themedColor.readonly(),
                showBackground: g.readonly(),
                backgroundTransparency: v.readonly(),
                collapsedDataSourcesCount:
                  this._collapsedDataSourcesCount.readonly(),
                collapsedDataSourcesTitle:
                  this._collapsedDataSourcesTitle.readonly(),
                combinedStatusWidget: this._collapsedDataSourcesStatusWidget,
                showLegendWidgetContextMenu:
                  this.onShowLegendWidgetContextMenu.bind(this),
                hideAllExceptFirstLine: this._hideAllExceptFirstLine,
                onLegendRowFocused: this._callbacks.onLegendRowFocused,
                onLayoutChanged: this._layoutChanged,
              },
              {
                showCollapserWithOneIndicator:
                  this._showCollapserWithOneIndicator.readonly(),
                visibleDataSourceCount: this._visibleDataSourceCount.readonly(),
                isDataSourcesCollapsed: this._isDataSourcesCollapsed.readonly(),
                isMainPane: this._isPaneMain.readonly(),
                onCollapseDataSources: this.onCollapseDataSources.bind(this),
                onShowObjectsTreeDialog: this._callbacks.showObjectsTreeDialog,
                isPaneCollapsed: this._paneWidget.visuallyCollapsed(),
                combinedStatusWidget: this._toggledDataSourcesStatusWidget,
              },
            ))
        }
        destroy() {
          this._backgroundThemeName.release(),
            this._hideNotMainSources.release(),
            this._hideAllExceptFirstLine.release(),
            this._hideWholeLegend.release(),
            (this._sourcesIds = []),
            null !== this._mainSeriesViewModel && this._destroyMainDataSource()
          for (const [, e] of this._statusProviders) e.destroy()
          for (const e of this._dataSourceViewModels) e.destroy()
          ;(this._dataSourceViewModels = []),
            this._collapsedDataSourcesStatusWidget.clear(),
            this._toggledDataSourcesStatusWidget.clear()
          for (const e of this._dataSourcesStatusesWidgets) e.destroy()
          ;(this._dataSourcesStatusesWidgets = []), this._clearSubscriptions()
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
          const s =
              this._customLegendWidgetsFactoriesMap.get(t.block) || new Map(),
            i = s.get(t.position) || []
          i.push(e),
            s.set(t.position, i),
            this._customLegendWidgetsFactoriesMap.set(t.block, s),
            this.updateLayout(),
            this._updateCustomWidgetModeBySize()
        }
        onShowLegendWidgetContextMenu(e, t) {
          if (this._options.readOnlyMode || !oo) return Promise.resolve()
          Y('Show legend context menu')
          const s = new Map()
          for (const e of Array.from(this._customLegendWidgetsMap.keys())) {
            const t = (0, o.ensureDefined)(this._customLegendWidgetsMap.get(e)),
              i = new Map()
            for (const e of Array.from(t.keys())) {
              const s = (0, o.ensureDefined)(t.get(e)),
                l = i.get(e) || []
              for (const e of s) l.push(...e.contextMenuActions())
              i.set(e, l)
            }
            s.set(e, i)
          }
          return ((e, t, s, i, l, o) => {
            const a = [],
              n = i.get(0)
            if (void 0 !== n) {
              const e = n.get(1)
              void 0 !== e &&
                e.length > 0 &&
                (a.push(...e), a.push(new Ct.Separator()))
            }
            const r = e
                .model()
                .properties()
                .childs()
                .paneProperties.childs()
                .legendProperties.childs(),
              d =
                Yt &&
                e
                  .model()
                  .symbolSources()
                  .some((e) => void 0 !== e.symbolInfo()?.price_source_id)
            a.push(
              new Ct.Action({
                actionId: 'Chart.Legend.ToggleSymbolVisibility',
                options: {
                  checkable: !0,
                  checked: r.showSeriesTitle.value(),
                  label: Ft,
                  statName: 'Show Symbol',
                  onExecute: () => kt(e, r.showSeriesTitle, Tt),
                },
              }),
            ),
              t.showOpenMarketStatus &&
                'market' ===
                  e.mainSeries().marketStatusModel().status().value() &&
                !(0, Vt.isEconomicSymbol)(e.mainSeries().symbolInfo()) &&
                a.push(
                  new Ct.Action({
                    actionId: 'Chart.Legend.ToggleOpenMarketStatusVisibility',
                    options: {
                      checkable: !0,
                      checked: Lt.showMarketOpenStatusProperty.value(),
                      label: Ut,
                      statName: 'Show Open market status',
                      onExecute: () =>
                        kt(e, Lt.showMarketOpenStatusProperty, Ht),
                    },
                  }),
                ),
              a.push(
                new Ct.Action({
                  actionId: 'Chart.Legend.ToggleOhlcValuesVisibility',
                  options: {
                    checkable: !0,
                    checked: r.showSeriesOHLC.value(),
                    label: Gt,
                    statName: 'Show chart values',
                    onExecute: () => kt(e, r.showSeriesOHLC, Bt),
                  },
                }),
              )
            const u = e.mainSeries().style(),
              h = 12 !== u && 20 !== u
            if (
              (h &&
                !At.alwaysShowLastPriceAndLastDayChange &&
                a.push(
                  new Ct.Action({
                    actionId: 'Chart.Legend.ToggleBarChangeValuesVisibility',
                    options: {
                      checkable: !0,
                      checked: r.showBarChange.value(),
                      label: jt,
                      statName: 'Show Bar Change Values',
                      onExecute: () => kt(e, r.showBarChange, Dt),
                    },
                  }),
                ),
              20 !== u &&
                a.push(
                  new Ct.Action({
                    actionId: 'Chart.Legend.ToggleVolumeVisibility',
                    options: {
                      checkable: !0,
                      checked: r.showVolume.value(),
                      label: $t,
                      statName: 'Show Volume',
                      onExecute: () => kt(e, r.showVolume, Rt),
                    },
                  }),
                ),
              h &&
                (At.lastDayChangeAvailable ||
                  At.alwaysShowLastPriceAndLastDayChange))
            ) {
              const t = At.alwaysShowLastPriceAndLastDayChange
                ? r.showBarChange
                : r.showLastDayChange
              a.push(
                new Ct.Action({
                  actionId: 'Chart.Legend.ToggleLastDayChangeValuesVisibility',
                  options: {
                    checkable: !0,
                    checked: t.value(),
                    label: Zt,
                    statName: 'Last day change values',
                    onExecute: () => kt(e, t, It),
                  },
                }),
              )
            }
            if (
              (d &&
                a.push(
                  new Ct.Action({
                    actionId: 'Chart.Legend.TogglePriceSourceVisibility',
                    options: {
                      checkable: !0,
                      checked: r.showPriceSource.value(),
                      label: Jt,
                      statName: 'Show Price Source',
                      onExecute: () => kt(e, r.showPriceSource, Ot),
                    },
                  }),
                ),
              a.push(new Ct.Separator()),
              void 0 !== n)
            ) {
              const e = n.get(0)
              void 0 !== e &&
                e.length > 0 &&
                (a.push(...e), a.push(new Ct.Separator()))
            }
            const c = i.get(1)
            if (void 0 !== c) {
              const e = c.get(1)
              void 0 !== e &&
                e.length > 0 &&
                (a.push(...e), a.push(new Ct.Separator()))
            }
            if (
              (e
                .model()
                .priceDataSources()
                .some(
                  (e) =>
                    !(0, it.isActingAsSymbolSource)(e) && e.showInObjectTree(),
                ) &&
                (a.push(
                  new Ct.Action({
                    actionId: 'Chart.Legend.ToggleIndicatorTitlesVisibility',
                    options: {
                      checkable: !0,
                      checked: r.showStudyTitles.value(),
                      label: Qt,
                      statName: 'Show Indicator Titles',
                      onExecute: () => kt(e, r.showStudyTitles, Pt),
                    },
                  }),
                ),
                a.push(
                  new Ct.Action({
                    actionId: 'Chart.Legend.ToggleIndicatorArgumentsVisibility',
                    options: {
                      checkable: !0,
                      checked: r.showStudyArguments.value(),
                      label: Kt,
                      statName: 'Show Indicator Arguments',
                      onExecute: () => kt(e, r.showStudyArguments, zt),
                    },
                  }),
                ),
                a.push(
                  new Ct.Action({
                    actionId: 'Chart.Legend.ToggleIndicatorValuesVisibility',
                    options: {
                      checkable: !0,
                      checked: r.showStudyValues.value(),
                      label: qt,
                      statName: 'Show Indicator Values',
                      onExecute: () => kt(e, r.showStudyValues, Nt),
                    },
                  }),
                )),
              void 0 !== c)
            ) {
              const e = c.get(0)
              void 0 !== e &&
                e.length > 0 &&
                (a.push(...e), a.push(new Ct.Separator()))
            }
            t.settings &&
              (a[a.length - 1] instanceof Ct.Separator ||
                a.push(new Ct.Separator()),
              a.push(
                new xt.ActionWithStandardIcon({
                  actionId: 'Chart.Dialogs.ShowGeneralSettings.LegendTab',
                  options: {
                    label: Xt,
                    iconId: 'Settings',
                    statName: 'Settings...',
                    onExecute: () => s(De.TabNames.legend),
                  },
                }),
              ))
            const _ = es(l.target, 'entityId'),
              p = {
                menuName: 'LegendPropertiesContextMenu',
                detail: { type: _ ? 'study' : 'series', id: _ ?? '_seriesId' },
              }
            return Et.ContextMenuManager.showMenu(a, l, void 0, p, o)
          })(
            this._model,
            this._options.contextMenu,
            this._callbacks.showGeneralChartProperties,
            s,
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
              .filter((e) => null !== e.statusView() && e.isDisplayedInLegend())
              .reverse(),
            t = this._sourcesIds,
            s = this._model.mainSeries(),
            i = e.indexOf(s)
          let l
          if (-1 !== i) {
            if ((e.splice(i, 1), !lo && null === this._mainSeriesViewModel)) {
              const e = new Ye(
                this._model,
                s,
                this._mainSeriesViewModelsOptions,
                this._callbacks,
                this._options.contextMenu,
              )
              this._mainSeriesViewModel = e
              const t = new Cl(
                this._statusSourceAdapter(s),
                this._model,
                this._options.statusesWidgets,
              )
              ;(this._mainSeriesStatusWidget = t),
                (l = { model: e, statusWidget: t })
            }
          } else
            null !== this._mainSeriesViewModel &&
              ((l = null),
              this._destroyMainDataSource(),
              this._destroyCustomWidgetFromLayerBlock(0))
          const a = e.map((e) => e.instanceId())
          this._sourcesIds = a
          const n = [],
            r = new Map(),
            d = [],
            u = [],
            h = this._dataSourceViewModels,
            c = this._dataSourcesStatusesWidgets
          let _ = t.length - 1
          while (_ >= 0) {
            const e = t[_],
              s = a.indexOf(e)
            if (-1 === s) {
              n.push(_), h[_].destroy(), c[_].destroy()
              const t = this._statusProviders.get(e)
              t && (t.destroy(), this._statusProviders.delete(e))
            } else
              _ !== s &&
                (r.set(e, { model: h[_], statusWidget: c[_] }),
                d.push({ oldIndex: _, newIndex: s }))
            _--
          }
          const p = [],
            m = []
          for (let s = 0; s < a.length; s++) {
            const i = a[s]
            let l, n
            if (r.has(i)) {
              const e = (0, o.ensureDefined)(r.get(i))
              ;(l = e.model), (n = e.statusWidget)
            } else if (t[s] === i) (l = h[s]), (n = c[s])
            else {
              const t = e[s]
              ;(l = new ft(
                this._model,
                t,
                this._dataSourceViewModelsOptions,
                this._callbacks,
                this._options.contextMenu,
              )),
                (n = new fl(
                  this._statusSourceAdapter(t),
                  this._model,
                  this._options.statusesWidgets,
                )),
                u.push({ model: l, statusWidget: n, index: s })
            }
            p.push(l), m.push(n)
          }
          ;(this._dataSourceViewModels = p),
            (this._dataSourcesStatusesWidgets = m),
            0 === this._dataSourceViewModels.length &&
              this._destroyCustomWidgetFromLayerBlock(1),
            this._recreateSubscriptions(),
            this._isPaneMain.setValue(this._getIsPaneMainValue()),
            this.update()
          const g = n.length || u.length || d.length
          if (
            ((void 0 !== l || g) &&
              this._layoutChanged.fire({
                newMainSource: l,
                removedDataSources: n,
                addedDataSources: u,
                movedDataSources: d,
              }),
            -1 !== i && this._addCustomWidgetForLayerBlock(0),
            this._dataSourceViewModels.length > 0 &&
              this._addCustomWidgetForLayerBlock(1),
            this._updateWidgetModeBySize(),
            g)
          ) {
            this._updateCollapsedSourcesMode(),
              this._toggledDataSourcesStatusWidget.clear()
            for (const e of this._dataSourcesStatusesWidgets)
              this._toggledDataSourcesStatusWidget.addStatusWidget(e)
          }
        }
        update() {
          null !== this._mainSeriesViewModel &&
            this._mainSeriesViewModel.update()
          for (const e of this._dataSourceViewModels) e.update()
        }
        updateThemedColors(e) {
          null === e &&
            (e = (0, to.getStdThemedValue)(
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
            0 === this._margin ? '' : `calc(100% - ${this._margin + ao}px)`),
            this._updateWidgetModeBySize()
        }
        updateWidgetModeBySize(e) {
          ;(this._size = e), this._updateWidgetModeBySize()
        }
        _statusSourceAdapter(e) {
          const t = e.instanceId()
          let s = this._statusProviders.get(t)
          return (
            void 0 === s &&
              ((s =
                e !== this._model.mainSeries()
                  ? new Ll(e, this._model.model())
                  : new Wl(this._model.mainSeries(), this._model.model())),
              this._statusProviders.set(t, s)),
            s
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
          const e = (0, i.size)({
            width: this._availableWidth(),
            height: this._size.height,
          })
          for (const t of Array.from(this._customLegendWidgetsMap.values()))
            for (const s of Array.from(t.values()))
              for (const t of s) t.updateWidgetModeBySize(e)
        }
        _destroyMainDataSource() {
          ;(0, o.ensureNotNull)(this._mainSeriesStatusWidget).destroy(),
            (this._mainSeriesStatusWidget = null)
          ;(0, o.ensureNotNull)(this._mainSeriesViewModel).destroy(),
            (this._mainSeriesViewModel = null)
        }
        _updateCollapsedSourcesMode() {
          const e = this._dataSourceViewModels.length,
            t = this._hideAllExceptFirstLine.value(),
            s = null !== this._mainSeriesViewModel
          if (
            (this._collapsedDataSourcesStatusWidget.clear(),
            this._availableHeight > 0 && e > 2)
          ) {
            const i = Number(this._renderer.getMainSourceHeight()),
              l = this._renderer.getDataSourceHeight(),
              o = this._getCustomWidgetsHeight()
            if (null !== l) {
              const a = Math.floor((this._availableHeight - i - o) / l),
                n = Math.max(a, 2) - 1
              if (e > n + 1) {
                let i = ''
                for (let l = 0; l < e; l++) {
                  const e = l < n
                  this._dataSourceViewModels[l].setGlobalVisibility(
                    e && (!t || (0 === l && !s)),
                  ),
                    e ||
                      ((i += `${0 === i.length ? '' : ', '}${this._dataSourceViewModels[l].getFullTitle()}`),
                      this._collapsedDataSourcesStatusWidget.addStatusWidget(
                        this._dataSourcesStatusesWidgets[l],
                      ))
                }
                return (
                  this._collapsedDataSourcesTitle.setValue(i),
                  void this._collapsedDataSourcesCount.setValue(e - n)
                )
              }
            }
          }
          for (let e = 0; e < this._dataSourceViewModels.length; ++e)
            this._dataSourceViewModels[e].setGlobalVisibility(
              !t || (0 === e && !s),
            )
          this._collapsedDataSourcesCount.setValue(0),
            this._collapsedDataSourcesTitle.setValue('')
        }
        _getCustomWidgetsHeight() {
          let e = 0
          for (const t of Array.from(this._customLegendWidgetsMap.values()))
            for (const s of Array.from(t.values()))
              for (const t of s) e += t.height().value()
          return e
        }
        _getCustomTextColorValue() {
          const e = this._model
            .model()
            .properties()
            .childs()
            .scalesProperties.childs()
            .textColor.value()
          for (const t of (0, to.getStdThemeNames)())
            if (
              (0, to.isStdThemedDefaultValue)(
                'chartProperties.scalesProperties.textColor',
                e,
                t,
              )
            )
              return null
          return e
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
                const s = e.height().spawn()
                this._customWidgetsHeights.push(s),
                  s.subscribe(this._updateCollapsedSourcesMode.bind(this))
              }
          this._updateVisibleDataSourceCount(), this._updateLegendVisibilities()
        }
        _updateLegendVisibilities() {
          if (this._hideWholeLegend.value())
            return void this._allLegendHidden.setValue(!0)
          const e =
              0 !== this._dataSourceRowsHidden.length &&
              this._dataSourceRowsHidden.every((e) => e.value()),
            t = this._hideNotMainSources.value() || e
          this._studiesLegendHidden.setValue(t)
          const s =
              null === this._mainSeriesRowHidden ||
              this._mainSeriesRowHidden.value(),
            i = this._customWidgetsVisibilities.some((e) => e.value())
          this._allLegendHidden.setValue(e && s && !i)
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
          const s = this._customLegendWidgetsMap.get(e) || new Map()
          let i = !1
          for (const l of Array.from(t.keys())) {
            const o = s.get(l) || [],
              a = t.get(l) || []
            for (let t = o.length; t < a.length; t++) {
              const s = a[t](
                this._model.model(),
                this._backgroundThemeName.spawnOwnership(),
                this._hideAllExceptFirstLine.weakReference(),
              )
              o.push(s),
                this._renderer.addCustomWidget(s, { block: e, position: l }),
                (i = !0)
            }
            i && s.set(l, o)
          }
          i && this._customLegendWidgetsMap.set(e, s)
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
          return null === this._size
            ? 0
            : Math.max(0, this._size.width - this._margin - ao)
        }
      }
    },
    61560: (e, t, s) => {
      s.r(t), s.d(t, { PaneControlsWidget: () => J })
      var i,
        l = s(32563),
        o = s(51768),
        a = s(11542),
        n = s(68335),
        r = s(88960),
        d = s(51613),
        u = s(79036),
        h = s(50151),
        c = s(24377),
        _ = s(63276),
        p = s(40281),
        m = s(67173),
        g = s(45319)
      !((e) => {
        ;(e[(e.ContextMenuModeWidthPt = 666.65)] = 'ContextMenuModeWidthPt'),
          (e[(e.VisibleModeMinWidth = 356)] = 'VisibleModeMinWidth')
      })(i || (i = {}))
      class b {
        constructor(e, t, s) {
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
            (this._globalVisibility = s.globalVisibility.spawn()),
            this._globalVisibility.subscribe(
              this._updatePaneControlsWidgetVisibility.bind(this),
            ),
            (this._visibilityType = s.visibilityType.spawn()),
            this._visibilityType.subscribe(
              this._updatePaneControlsWidgetVisibility.bind(this),
            ),
            (this._separatorSelected = s.separatorSelected.spawn()),
            this._separatorSelected.subscribe(
              this._updatePaneControlsWidgetVisibility.bind(this),
            ),
            (this._maximized = s.maximized.spawn()),
            this._maximized.subscribe(
              this._updatePaneControlsWidgetVisibility.bind(this),
            ),
            (this._doNotSwitchToContextMenuMode =
              s.doNotSwitchToContextMenuMode),
            (this._themedColor = s.themedColor.spawn()),
            this._themedColor.subscribe(this._updateThemedColor.bind(this))
          for (const [e, t] of Object.entries(this._actions)) {
            const s = e
            ;(this._actionsSpawns[s] = {
              visible: t.visible.spawn(),
              title: void 0 === t.title ? null : t.title.spawn(),
            }),
              this._actionsSpawns[s].visible.subscribe(
                this._updateActionVisibilities.bind(this, s),
              )
            const i = this._actionsSpawns[s].title
            null !== i && i.subscribe(this._updateActionTitle.bind(this, s))
          }
          this._render(),
            this._updatePaneControlsWidgetVisibility(),
            this._updateThemedColor(this._themedColor.value()),
            this._parentEl.classList.toggle(
              m.touchMode,
              p.trackingModeIsAvailable,
            ),
            this._parentEl.addEventListener('contextmenu', (e) =>
              e.preventDefault(),
            ),
            this._parentEl.setAttribute('aria-hidden', 'true'),
            this._wrapEl.matches(':hover') &&
              this._onMouseEnterLeaveEvent({ type: 'mouseenter' })
        }
        destroy() {
          this._visibilityType.destroy(),
            this._themedColor.destroy(),
            this._separatorSelected.destroy()
          for (const e of Object.keys(this._actionsSpawns)) {
            const t = e
            this._actionsSpawns[t].visible.destroy()
            const s = this._actionsSpawns[t].title
            null !== s && s.destroy()
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
            this._parentEl.remove(),
            (this._parentEl.innerHTML = ''),
            delete this._parentEl
        }
        getElement() {
          return this._parentEl
        }
        bottomWithMargin() {
          const e = this._parentEl.classList.contains(m.touchMode)
            ? Number(m.css_value_pane_controls_button_touch_size)
            : Number(m.css_value_pane_controls_button_size)
          return 2 * Number(m.css_value_pane_controls_margin_top) + e
        }
        updateWidgetModeByWidth(e) {
          const t = !this._doNotSwitchToContextMenuMode.value() && e < 356,
            s = !this._doNotSwitchToContextMenuMode.value() && e < 666.65,
            i = (0, h.ensureNotNull)(this._listActionsWrapperEl),
            l = (0, h.ensureNotNull)(this._listActionsElements.more)
          i.classList.toggle(g.blockHidden, t || s),
            l.classList.toggle(
              g.blockHidden,
              t || !s || !this._actions.more.visible.value(),
            )
        }
        _render() {
          this._renderActions(),
            this._parentEl.classList.add(m.paneControls),
            this._wrapEl.append(this._parentEl)
        }
        _renderActions() {
          null === this._listActionsWrapperEl &&
            ((this._listActionsWrapperEl = document.createElement('div')),
            this._listActionsWrapperEl.classList.add(m.buttonsWrapper),
            this._parentEl.append(this._listActionsWrapperEl))
          const e = {
            tag: 'div',
            buttonClassName: m.button,
            wrapIconClassName: m.buttonIcon,
            hiddenClassName: g.blockHidden,
          }
          ;(this._listActionsElements.up = (0, _.createActionElement)(
            this._actions.up,
            e,
          )),
            (this._listActionsElements.down = (0, _.createActionElement)(
              this._actions.down,
              e,
            )),
            (this._listActionsElements.collapse = (0, _.createActionElement)(
              this._actions.collapse,
              e,
            )),
            (this._listActionsElements.restore = (0, _.createActionElement)(
              this._actions.restore,
              e,
            )),
            (this._listActionsElements.close = (0, _.createActionElement)(
              this._actions.close,
              e,
            )),
            (this._listActionsElements.maximize = (0, _.createActionElement)(
              this._actions.maximize,
              e,
            )),
            (this._listActionsElements.minimize = (0, _.createActionElement)(
              this._actions.minimize,
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
            (this._listActionsElements.more = (0, _.createActionElement)(
              this._actions.more,
              e,
            ))
          for (const e of Object.keys(this._listActionsElements))
            (0, h.ensureNotNull)(this._listActionsElements[e]).classList.add(
              m.newButton,
            )
          this._parentEl.append(this._listActionsElements.more)
        }
        _updateActionVisibilities(e, t) {
          ;(0, h.ensureNotNull)(this._listActionsElements[e]).classList.toggle(
            g.blockHidden,
            !t,
          )
        }
        _updateActionTitle(e, t) {
          ;(0, h.ensureNotNull)(this._listActionsElements[e]).setAttribute(
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
            case 'visibleOnTapSelection':
              e = this._globalVisibility.value() && this._mouseOverWidget
          }
          this._separatorSelected.value() && this._visibilityType.value(),
            this._maximized.value() && l.mobiletouch,
            this._parentEl.classList.toggle(m.hidden, !e),
            this._parentEl.classList.toggle(
              m.forceHidden,
              !this._globalVisibility.value() || t,
            )
        }
        _updateThemedColor(e) {
          if (e.length > 0) {
            const [t, s, i] = (0, c.parseRgb)(e)
            this._parentEl.style.color = (0, c.rgbaToString)([
              t,
              s,
              i,
              (0, c.normalizeAlphaComponent)(0.8),
            ])
          } else this._parentEl.style.removeProperty('color')
        }
      }
      var v = s(29023),
        w = s(40443),
        S = s(30426),
        y = s(72899),
        M = s(48344),
        f = s(99539),
        C = s(20465),
        E = s(34763)
      const V = a.t(null, void 0, s(13930)),
        L = V,
        W = (0, n.humanReadableModifiers)(n.Modifiers.Mod) + V
      var A = s(64147),
        x = s(85662),
        k = s(61814),
        T = s(37896),
        H = s(81020),
        B = s(3515),
        I = s(79526),
        D = s(82847),
        P = s(14604),
        z = s(42930)
      const N = l.mobiletouch && !0,
        R = a.t(null, void 0, s(66260)),
        O = a.t(null, void 0, s(7310)),
        F = a.t(null, void 0, s(12948)),
        U = a.t(null, void 0, s(90165)),
        G = a.t(null, void 0, s(12486)),
        Z = a.t(null, void 0, s(65495)),
        j = a.t(null, void 0, s(75018)),
        $ = a.t(null, void 0, s(13930))
      var Q
      !((e) => {
        ;(e.PaneCloseButton = 'pane-button-close'),
          (e.PaneUpButton = 'pane-button-up'),
          (e.PaneDownButton = 'pane-button-down'),
          (e.PaneMaximizeButton = 'pane-button-maximize'),
          (e.PaneMinimizeButton = 'pane-button-minimize'),
          (e.PaneCollapseButton = 'pane-button-collapse'),
          (e.PaneRestoreButton = 'pane-button-restore'),
          (e.PaneMoreButton = 'pane-button-more')
      })(Q || (Q = {}))
      const K = (0, k.hotKeySerialize)({ keys: [''], text: $ }),
        q = (0, k.hotKeySerialize)({
          keys: [(0, n.humanReadableModifiers)(n.Modifiers.Mod, !1)],
          text: `{0} + ${$}`,
        })
      class J {
        constructor(e, t, s, i) {
          ;(this._actions = {}),
            (this._moreCMShown = !1),
            (this._themedColor = new A.WatchedValue('')),
            (this._model = e),
            (this._pane = t),
            (this._closeButtonVisibility = new A.WatchedValue(
              this._getCloseButtonVisibility(),
            )),
            (this._upButtonVisibility = new A.WatchedValue(
              this._getUpButtonVisibility(),
            )),
            (this._downButtonVisibility = new A.WatchedValue(
              this._getDownButtonVisibility(),
            )),
            (this._maximizeButtonVisibility = new A.WatchedValue(
              this._getMaximizeButtonVisibility(),
            )),
            (this._minimizeButtonVisibility = new A.WatchedValue(
              this._getMinimizeButtonVisibility(),
            )),
            (this._collapseButtonVisibility = (0, r.combine)(
              (e, t, s) => !N && !e && !t && s,
              t.maximized().weakReference(),
              t.collapsed().weakReference(),
              t.collapsingAvailable().weakReference(),
            )),
            (this._restoreButtonVisibility = (0, r.combine)(
              (e, t) => !e && t,
              t.maximized().weakReference(),
              t.collapsed().weakReference(),
            )),
            this._createActions(),
            (this._visibilityTypeProperty = (0, d.actualBehavior)()),
            this._visibilityTypeProperty.subscribe(this, (e) => {
              this._visibilityType.setValue(e.value())
            }),
            (this._visibilityType = new A.WatchedValue(
              this._visibilityTypeProperty.value(),
            )),
            (this._isPaneMaximize = new A.WatchedValue(
              this._getIsPaneMaximizeValue(),
            )),
            (this._isWidgetShow = new A.WatchedValue(this._getIsWidgetShow())),
            (this._backgroundThemeName = s.backgroundThemeName),
            (this._renderer = new b(i, this._actions, {
              visibilityType: this._visibilityType.readonly(),
              globalVisibility: this._isWidgetShow.readonly(),
              doNotSwitchToContextMenuMode: this._isPaneMaximize.readonly(),
              themedColor: this._themedColor.readonly(),
              separatorSelected: s.anySeparatorSelected,
              maximized: this._isPaneMaximize.readonly(),
            }))
        }
        destroy() {
          this._visibilityTypeProperty.unsubscribeAll(this),
            this._collapseButtonVisibility.destroy(),
            this._restoreButtonVisibility.destroy(),
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
            (e = (0, x.getStdThemedValue)(
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
            )
        }
        _createActions() {
          ;(this._actions.up = {
            icon: H,
            action: this._onUpDownButton.bind(this, 'up'),
            visible: this._upButtonVisibility,
            title: new A.WatchedValue(O),
            className: m.up,
            dataset: { name: 'pane-button-up' },
          }),
            (this._actions.down = {
              icon: B,
              action: this._onUpDownButton.bind(this, 'down'),
              visible: this._downButtonVisibility,
              title: new A.WatchedValue(F),
              className: m.down,
              dataset: { name: 'pane-button-down' },
            }),
            (this._actions.close = {
              icon: T,
              action: this._onCloseButton.bind(this),
              visible: this._closeButtonVisibility,
              title: new A.WatchedValue(R),
              dataset: { name: 'pane-button-close' },
            }),
            (this._actions.maximize = {
              icon: I,
              action: this._onToggleMaximizeButton.bind(this, 'Maximize pane'),
              visible: this._maximizeButtonVisibility,
              title: new A.WatchedValue(U),
              hotKeyTitle: K,
              className: m.maximize,
              dataset: { name: 'pane-button-maximize' },
            }),
            (this._actions.minimize = {
              icon: I,
              action: this._onToggleMaximizeButton.bind(this, 'Minimize pane'),
              visible: this._minimizeButtonVisibility,
              title: new A.WatchedValue(G),
              hotKeyTitle: K,
              className: m.minimize,
              dataset: { name: 'pane-button-minimize' },
            }),
            (this._actions.collapse = {
              icon: P,
              action: this._onToggleCollapseButton.bind(this, 'Collapse pane'),
              visible: this._collapseButtonVisibility,
              title: new A.WatchedValue(Z),
              hotKeyTitle: q,
              className: m.collapse,
              dataset: { name: 'pane-button-collapse' },
            }),
            (this._actions.restore = {
              icon: z,
              action: this._onToggleCollapseButton.bind(this, 'Restore pane'),
              visible: this._restoreButtonVisibility,
              title: new A.WatchedValue(G),
              hotKeyTitle: q,
              className: m.restore,
              dataset: { name: 'pane-button-restore' },
            }),
            (this._actions.more = {
              icon: D,
              action: this._showButtonsInContextMenu.bind(this),
              visible: new A.WatchedValue(!N),
              title: new A.WatchedValue(j),
              dataset: { name: 'pane-button-more' },
            })
        }
        _getCloseButtonVisibility() {
          let e = !1
          return (
            this._pane.containsMainSeries() ||
              this._pane.maximized().value() ||
              N ||
              (e = this._pane.dataSources().some((e) => (0, u.isStudy)(e))),
            e
          )
        }
        _onCloseButton() {
          this._trackEvent('Delete pane')
          const e = this._model.model().panes().indexOf(this._pane)
          this._model.removePane(e)
        }
        _getUpButtonVisibility() {
          const e = this._pane
          return (
            this._model.model().panes().indexOf(e) > 0 &&
            !e.maximized().value() &&
            !N
          )
        }
        _getDownButtonVisibility() {
          const e = this._model.model().panes()
          return (
            e.indexOf(this._pane) < e.length - 1 &&
            !this._pane.maximized().value() &&
            !N
          )
        }
        _onUpDownButton(e) {
          this._trackEvent(`Move pane ${e}`)
          const t = this._model.model().panes().indexOf(this._pane)
          this._model.rearrangePanes(t, e)
        }
        _getMaximizeButtonVisibility() {
          return (
            this._model.model().panes().length > 1 &&
            !this._pane.maximized().value() &&
            !N
          )
        }
        _getMinimizeButtonVisibility() {
          return (
            this._model.model().panes().length > 1 &&
            this._pane.maximized().value()
          )
        }
        _onToggleMaximizeButton(e) {
          this._trackEvent(e), this._model.toggleMaximizedPane(this._pane)
        }
        _onToggleCollapseButton(e) {
          this._trackEvent(e), this._model.toggleCollapsedPane(this._pane)
        }
        _showButtonsInContextMenu(e) {
          e.preventDefault(),
            this._moreCMShown ||
              ((e, t, s) => {
                const i = []
                if (e.maximize.visible.value()) {
                  const t = (0, h.ensure)(e.maximize.title),
                    s = (0, h.ensureNotNull)(e.maximize.action)
                  i.push(
                    new v.Action({
                      actionId: 'Chart.PaneControls.MaximizePane',
                      options: {
                        icon: f,
                        label: t.value(),
                        statName: 'Maximize Pane',
                        shortcutHint: L,
                        onExecute: () => s(),
                      },
                    }),
                  )
                } else if (e.minimize.visible.value()) {
                  const t = (0, h.ensure)(e.minimize.title),
                    s = (0, h.ensureNotNull)(e.minimize.action)
                  i.push(
                    new v.Action({
                      actionId: 'Chart.PaneControls.MinimizePane',
                      options: {
                        icon: f,
                        label: t.value(),
                        statName: 'Minimize Pane',
                        shortcutHint: L,
                        onExecute: () => s(),
                      },
                    }),
                  )
                }
                if (e.collapse.visible.value()) {
                  const t = (0, h.ensure)(e.collapse.title),
                    s = (0, h.ensureNotNull)(e.collapse.action)
                  i.push(
                    new v.Action({
                      actionId: 'Chart.PaneControls.CollapsePane',
                      options: {
                        icon: C,
                        label: t.value(),
                        statName: 'Collapse pane',
                        shortcutHint: W,
                        onExecute: () => s(),
                      },
                    }),
                  )
                }
                if (e.restore.visible.value()) {
                  const t = (0, h.ensure)(e.restore.title),
                    s = (0, h.ensureNotNull)(e.restore.action)
                  i.push(
                    new v.Action({
                      actionId: 'Chart.PaneControls.RestorePane',
                      options: {
                        icon: E,
                        label: t.value(),
                        statName: 'Restore pane',
                        shortcutHint: W,
                        onExecute: () => s(),
                      },
                    }),
                  )
                }
                if (e.up.visible.value()) {
                  const t = (0, h.ensure)(e.up.title),
                    s = (0, h.ensureNotNull)(e.up.action)
                  i.push(
                    new v.Action({
                      actionId: 'Chart.PaneControls.MovePaneUp',
                      options: {
                        icon: y,
                        label: t.value(),
                        statName: 'Move pane up',
                        onExecute: () => s(),
                      },
                    }),
                  )
                }
                if (e.down.visible.value()) {
                  const t = (0, h.ensure)(e.down.title),
                    s = (0, h.ensureNotNull)(e.down.action)
                  i.push(
                    new v.Action({
                      actionId: 'Chart.PaneControls.MovePaneDown',
                      options: {
                        icon: M,
                        label: t.value(),
                        statName: 'Move pane down',
                        onExecute: () => s(),
                      },
                    }),
                  )
                }
                if (e.close.visible.value()) {
                  const t = (0, h.ensure)(e.close.title),
                    s = (0, h.ensureNotNull)(e.close.action)
                  i.push(
                    new v.Action({
                      actionId: 'Chart.PaneControls.DeletePane',
                      options: {
                        icon: S,
                        label: t.value(),
                        statName: 'Delete pane',
                        onExecute: () => s(),
                      },
                    }),
                  )
                }
                const l = (0, h.ensureNotNull)(t.target).getBoundingClientRect()
                return w.ContextMenuManager.showMenu(
                  i,
                  {
                    clientX: l.right,
                    clientY: l.top + l.height + 3,
                    attachToXBy: 'right',
                  },
                  void 0,
                  void 0,
                  s,
                )
              })(this._actions, e, () => {
                this._moreCMShown = !1
              }).then(() => {
                this._moreCMShown = !0
              })
        }
        _getIsPaneMaximizeValue() {
          return this._pane.maximized().value()
        }
        _getIsWidgetShow() {
          return this._model.model().panes().length > 1
        }
        _trackEvent(e) {
          ;(0, o.trackEvent)('GUI', 'Pane action', e)
        }
      }
    },
    63276: (e, t, s) => {
      s.d(t, { createActionElement: () => n })
      var i = s(43888),
        l = s(50151),
        o = s(37265),
        a = s(80007)
      function n(e, t) {
        const {
            buttonClassName: s,
            wrapIconClassName: n,
            hiddenClassName: r,
            iconSize: d,
            blurOnClick: u,
          } = t,
          h = document.createElement(t.tag)
        ;(h.className = s),
          h.classList.toggle(r, !e.visible.value()),
          Object.assign(h.dataset, e.dataset),
          void 0 !== e.className && h.classList.add(e.className),
          void 0 !== e.title &&
            (h.classList.add('apply-common-tooltip'),
            h.setAttribute('title', e.title.value()),
            void 0 !== e.hotKeyTitle &&
              (h.dataset.tooltipHotkey = e.hotKeyTitle)),
          h.addEventListener(
            'touchend',
            (0, a.wrapHandlerWithPreventEvent)(e.action),
          ),
          h.addEventListener('mousedown', (t) => {
            0 === t.button && (e.action(t), u && h.blur())
          })
        const c = document.createElement('div')
        let _
        return (
          c.classList.add(n),
          (_ = (0, i.default)(e.icon)
            ? e.icon.get((0, l.ensureDefined)(d)) || ''
            : e.icon),
          (0, o.isString)(_) ? (c.innerHTML = _) : c.appendChild(_),
          h.appendChild(c),
          h
        )
      }
    },
    40281: (e, t, s) => {
      s.d(t, { trackingModeIsAvailable: () => i })
      const i = s(49483).CheckMobile.any()
    },
    89612: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M7.83 3.92 12.28 9l-4.45 5.08-1.13-1L10.29 9l-3.6-4.09 1.14-.99Z"/></svg>'
    },
    23317: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M14 10H4V8.5h10V10Z"/></svg>'
    },
    77576: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M8.25 13.75v-9.5h1.5v9.5h-1.5Z"/><path fill="currentColor" d="M13.75 9.75h-9.5v-1.5h9.5v1.5Z"/></svg>'
    },
    91986: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M14.5 8V3.5H10V2h6v6h-1.5Zm-11 2v4.5H8V16H2v-6h1.5Z"/></svg>'
    },
    76996: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M11.5 2v4.5H16V8h-6V2h1.5Zm-5 14v-4.5H2V10h6v6H6.5Z"/></svg>'
    },
    78529: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M7.45 3.5 12.48 9l-5.03 5.49 1.1 1.01L14.52 9 8.55 2.49 7.45 3.5Z"/><path fill="currentColor" d="m3.93 5.99 2.58 3-2.58 3.02 1.14.98 3.42-4-3.42-3.98L3.93 6Z"/></svg>'
    },
    93724: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M10 6.38V8L6 5.5 10 3v1.85A5.25 5.25 0 1 1 3.75 10a.75.75 0 0 1 1.5 0A3.75 3.75 0 1 0 10 6.38Z"/></svg>'
    },
    79304: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M9 2.5c-1.06 0-1.88.93-1.75 1.98l.63 5.03a1.13 1.13 0 0 0 2.25 0l.62-5.03A1.77 1.77 0 0 0 9 2.5zm0 10a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>'
    },
    38373: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M9 4c-.79 0-1.38.7-1.25 1.48l.67 4.03a.59.59 0 0 0 1.16 0l.67-4.03A1.27 1.27 0 0 0 9 4zm0 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>'
    },
    31233: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M7.57 14.8H5.03V3.36c1.62-.05 2.64-.08 3.06-.08 1.66 0 2.98.49 3.96 1.47a5.23 5.23 0 0 1 1.47 3.88c0 4.11-1.99 6.17-5.95 6.17zm-.5-9.66v7.8c.32.04.67.06 1.05.06 1.03 0 1.83-.38 2.41-1.12.58-.75.88-1.79.88-3.13 0-2.44-1.14-3.67-3.42-3.67-.22 0-.53.02-.93.06z"/></svg>'
    },
    12646: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M7.84 13.7H5.78V4.4l2.48-.06c1.35 0 2.42.4 3.22 1.2.8.78 1.19 1.83 1.19 3.15 0 3.34-1.61 5.01-4.83 5.01zm-.41-7.85v6.35c.26.02.55.03.86.03.83 0 1.48-.3 1.95-.9.48-.6.72-1.46.72-2.54 0-2-.93-2.99-2.78-2.99-.18 0-.43.02-.75.05z"/></svg>'
    },
    21672: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M14 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm5-9H9v2h10v-2Z"/></svg>'
    },
    69410: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M7.65 5.16v2.68h3.78v1.73H7.65V13h5.19v1.8H5.62V3.35h7.3v1.8H7.65z"/></svg>'
    },
    55593: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M7.9 5.87v2.17h3.07v1.4H7.9v2.8h4.22v1.46H6.25V4.4h5.94v1.47H7.9z"/></svg>'
    },
    53218: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><rect width="10" height="4" fill="currentColor" rx="2" x="4" y="7"/></svg>'
    },
    62998: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><circle fill="currentColor" cx="9" cy="9" r="5"/></svg>'
    },
    32140: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><circle fill="currentColor" cx="9" cy="9" r="4"/></svg>'
    },
    25230: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M9.3 9l.9-4.53a1.23 1.23 0 1 0-2.4 0L8.7 9l-.9 4.53a1.23 1.23 0 1 0 2.4 0L9.3 9z"/><path fill="currentColor" d="M9.15 9.26l4.38-1.48a1.23 1.23 0 1 0-1.21-2.09L8.85 8.74l-4.38 1.48a1.23 1.23 0 1 0 1.21 2.09l3.47-3.05z"/><path fill="currentColor" d="M9.15 8.74L5.68 5.69a1.23 1.23 0 1 0-1.2 2.09l4.37 1.48 3.47 3.05a1.23 1.23 0 1 0 1.2-2.09L9.16 8.74z"/></svg>'
    },
    43401: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M13.29 4.8h-.09a4.2 4.2 0 1 0 .09 8.4 6 6 0 1 1 0-8.4z"/></svg>'
    },
    15507: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M12.57 5.5h-.07a3.5 3.5 0 1 0 .07 7A4.98 4.98 0 0 1 4 9a5 5 0 0 1 8.57-3.5z"/></svg>'
    },
    12462: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M12.58 12.1A3.86 3.86 0 0 0 9 6.75a3.87 3.87 0 0 0-3.58 5.33 7.74 7.74 0 0 1 7.16 0zM3.64 9.93l-2.3-.62.37-1.38 2.3.62-.37 1.38zM6.1 6.07L5.07 3.92l1.3-.6 1 2.15-1.29.6zM10.62 5.47l1-2.16 1.3.6-1.01 2.16-1.3-.6zM13.99 8.55l2.3-.62.36 1.38-2.3.62L14 8.55z"/></svg>'
    },
    85290: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M12.22 11.78A3.47 3.47 0 0 0 9 6.98a3.48 3.48 0 0 0-3.22 4.8 6.97 6.97 0 0 1 6.44 0zM4.18 9.83L2.1 9.28l.33-1.24 2.07.55-.33 1.24zM6.38 6.36l-.9-1.94 1.16-.54.9 1.94-1.16.54zM10.46 5.82l.9-1.94 1.16.54-.9 1.94-1.16-.54zM13.49 8.6l2.07-.56.33 1.24-2.07.55-.33-1.24z"/></svg>'
    },
    91665: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M14.48 5.1c-.52 2.03-1.46 3.04-2.82 3.04-.64 0-1.55-.19-2.74-.56-1.17-.38-1.99-.57-2.46-.57-.69 0-1.22.37-1.58 1.13H3.55A4.3 4.3 0 0 1 4.5 6c.5-.6 1.08-.9 1.74-.9.7 0 1.65.2 2.84.58 1.2.37 2.04.55 2.52.55.8 0 1.32-.37 1.59-1.13h1.29zm0 4.84c-.52 2.02-1.46 3.03-2.82 3.03-.64 0-1.55-.19-2.74-.56-1.17-.38-1.99-.57-2.46-.57-.69 0-1.22.38-1.58 1.13H3.55a4.3 4.3 0 0 1 .95-2.14c.5-.6 1.08-.9 1.74-.9.7 0 1.65.2 2.84.58 1.2.37 2.04.56 2.52.56.8 0 1.32-.38 1.59-1.13h1.29z"/></svg>'
    },
    52828: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M13.4 5.9c-.41 1.62-1.16 2.43-2.25 2.43-.52 0-1.25-.15-2.2-.45-.93-.3-1.58-.45-1.96-.45-.55 0-.98.3-1.27.9H4.66c.1-.67.36-1.24.76-1.71.4-.48.86-.72 1.4-.72.56 0 1.31.16 2.27.46.95.3 1.62.45 2.01.45.64 0 1.06-.3 1.27-.9h1.03zm0 3.87c-.41 1.62-1.16 2.43-2.25 2.43-.52 0-1.25-.15-2.2-.45-.93-.3-1.58-.46-1.96-.46-.55 0-.98.3-1.27.9H4.66c.1-.67.36-1.24.76-1.7.4-.48.86-.72 1.4-.72.56 0 1.31.15 2.27.46.95.3 1.62.44 2.01.44.64 0 1.06-.3 1.27-.9h1.03z"/></svg>'
    },
    39379: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M4 6.5 6 8l3-3 3 3 2-1.5V10H4V6.5ZM14 13v-2H4v2h10Z"/></svg>'
    },
    57979: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M9 3.9a5.13 5.13 0 0 0-4.89 3.63l-1.33-.41A6.53 6.53 0 0 1 9 2.5a6.52 6.52 0 0 1 6.18 4.47l.77-.99 1.1.87-1.7 2.17-.34.43-.5-.21-2.57-1.11.55-1.29 1.36.59A5.13 5.13 0 0 0 9 3.9ZM2.93 8.66l.46.13 2.58.7-.37 1.35-1.52-.41a5.12 5.12 0 0 0 9.8.1l1.35.4a6.52 6.52 0 0 1-12.4.2l-.77 1.06-1.13-.83 1.71-2.31.29-.39Z"/></svg>'
    },
    2588: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M9 4.6c-1.94 0-3.6 1.3-4.14 3.08l-1.34-.41a5.75 5.75 0 0 1 10.87-.3l.56-.72 1.1.87L14.58 9l-.34.42-.5-.21-2.23-.96.55-1.29.99.42A4.35 4.35 0 0 0 9 4.6ZM3.7 8.53l.46.12 2.24.61-.37 1.35-1.15-.31a4.34 4.34 0 0 0 8.27-.08l1.34.41a5.74 5.74 0 0 1-10.86.35l-.57.76-1.12-.83 1.48-2 .28-.38Z"/></svg>'
    },
    41674: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><g class="normal-eye"><path fill="currentColor" fill-rule="evenodd" d="M12 18c-3.07 0-6.21-1.95-7.92-6C5.78 7.95 8.93 6 12 6c3.08 0 6.22 1.95 7.92 6-1.7 4.05-4.84 6-7.92 6Zm8.93-6.19C19.1 7.31 15.59 5 12 5S4.9 7.32 3.08 11.8L3 12l.08.19C4.89 16.68 8.4 19 12 19c3.6 0 7.11-2.32 8.93-6.81l.07-.2-.07-.18ZM14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm1 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></g><g class="crossed-eye"><path fill="currentColor" d="M12 19a8.47 8.47 0 0 1-3.87-.95l.75-.75c1 .47 2.07.7 3.12.7 3.08 0 6.22-1.95 7.92-6a11.18 11.18 0 0 0-2.25-3.49l.7-.7a12.28 12.28 0 0 1 2.56 4L21 12l-.07.19C19.1 16.68 15.59 19 12 19Zm-7.92-7c.6 1.42 1.37 2.58 2.26 3.49l-.7.7a12.28 12.28 0 0 1-2.56-4l-.08-.2.08-.18C4.89 7.31 8.4 5 12 5c1.33 0 2.65.32 3.88.94l-.75.75A7.45 7.45 0 0 0 12 6C8.93 6 5.8 7.96 4.08 12ZM12 15a3 3 0 0 1-.73-.09l.92-.92a2 2 0 0 0 1.8-1.8l.92-.92A3 3 0 0 1 12 15Zm-2.91-2.27.92-.91A2 2 0 0 1 11.8 10l.92-.92a3 3 0 0 0-3.64 3.64Zm9.08-7.66-13.1 13.1.77.76 13.09-13.1-.76-.76Z"/></g><g fill="none" class="loading-eye"><path stroke="currentColor" d="M20.46 12c-3.5 8.67-13.42 8.67-16.92 0 3.5-8.67 13.42-8.67 16.92 0Z"/></g><g fill="none" class="animated-loading-eye"><path stroke="currentColor" d="M14.5 12a2.5 2.5 0 1 0-2.5 2.5"/></g></svg>'
    },
    54336: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><g class="normal-eye"><path fill="currentColor" fill-rule="evenodd" d="M12 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-1 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/><path fill="currentColor" d="M16.91 8.8C15.31 4.99 12.18 3 9 3 5.82 3 2.7 4.98 1.08 8.8L1 9l.08.2C2.7 13.02 5.82 15 9 15c3.18 0 6.3-1.97 7.91-5.8L17 9l-.09-.2ZM9 14c-2.69 0-5.42-1.63-6.91-5 1.49-3.37 4.22-5 6.9-5 2.7 0 5.43 1.63 6.92 5-1.5 3.37-4.23 5-6.91 5Z"/></g><g class="crossed-eye"><path fill="currentColor" d="M3.7 15 15 3.7l-.7-.7L3 14.3l.7.7ZM9 3c1.09 0 2.17.23 3.19.7l-.77.76C10.64 4.16 9.82 4 9 4 6.31 4 3.58 5.63 2.08 9a9.35 9.35 0 0 0 1.93 2.87l-.7.7A10.44 10.44 0 0 1 1.08 9.2L1 9l.08-.2C2.69 4.99 5.82 3 9 3Z"/><path fill="currentColor" d="M9 6a3 3 0 0 1 .78.1l-.9.9A2 2 0 0 0 7 8.87l-.9.9A3 3 0 0 1 9 6ZM11.9 8.22l-.9.9A2 2 0 0 1 9.13 11l-.9.9a3 3 0 0 0 3.67-3.68Z"/><path fill="currentColor" d="M9 14c-.82 0-1.64-.15-2.43-.45l-.76.76c1.02.46 2.1.7 3.19.7 3.18 0 6.31-1.98 7.92-5.81L17 9l-.08-.2a10.44 10.44 0 0 0-2.23-3.37l-.7.7c.75.76 1.41 1.71 1.93 2.87-1.5 3.37-4.23 5-6.92 5Z"/></g><g fill="none" class="loading-eye"><path stroke="currentColor" d="M16.45 9c-3.08 7.33-11.82 7.33-14.9 0 3.08-7.33 11.82-7.33 14.9 0Z"/></g><g fill="none" class="animated-loading-eye"><path stroke="currentColor" d="M11.5 9A2.5 2.5 0 1 0 9 11.5"/></g></svg>'
    },
    45534: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M5.5 11a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM3 12.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0Zm9.5-1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM10 12.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0Zm9.5-1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM17 12.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0Z"/></svg>'
    },
    87258: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" fill-rule="evenodd" d="M3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm0 1a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6-1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm0 1a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm7-2a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm1 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/></svg>'
    },
    36885: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M8.54.84a.8.8 0 0 1 .92 0l7.5 5.25a.8.8 0 0 1 0 1.32l-7.5 5.25a.8.8 0 0 1-.92 0L1.04 7.4a.8.8 0 0 1 0-1.32L8.54.84zM2.9 6.75L9 11.02l6.1-4.27L9 2.48 2.9 6.75z"/><path fill="currentColor" d="M.84 10.8a.8.8 0 0 1 1.12-.2L9 15.51l7.04-4.93a.8.8 0 0 1 .92 1.32l-7.5 5.25a.8.8 0 0 1-.92 0l-7.5-5.25a.8.8 0 0 1-.2-1.12z"/></svg>'
    },
    65300: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" width="15" height="15"><path fill="currentColor" d="M7.23 2.58a.5.5 0 0 1 .54 0l5.5 3.5a.5.5 0 0 1 0 .84l-5.5 3.5a.5.5 0 0 1-.54 0l-5.5-3.5a.5.5 0 0 1 0-.84l5.5-3.5zM2.93 6.5L7.5 9.4l4.57-2.9L7.5 3.6 2.93 6.5z"/><path fill="currentColor" d="M1.58 9.23a.5.5 0 0 1 .69-.15L7.5 12.4l5.23-3.33a.5.5 0 0 1 .54.84l-5.5 3.5a.5.5 0 0 1-.54 0l-5.5-3.5a.5.5 0 0 1-.15-.69z"/></svg>'
    },
    37073: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M6 7.5A2.5 2.5 0 0 1 8.5 5H10v1H8.5C7.67 6 7 6.67 7 7.5v1.15a3.5 3.5 0 0 1-1.93 3.13l-.45.22.45.22A3.5 3.5 0 0 1 7 15.35v1.15c0 .83.67 1.5 1.5 1.5H10v1H8.5A2.5 2.5 0 0 1 6 16.5v-1.15a2.5 2.5 0 0 0-1.38-2.23l-1.34-.67a.5.5 0 0 1 0-.9l1.34-.67A2.5 2.5 0 0 0 6 8.65V7.5ZM15.5 6H14V5h1.5A2.5 2.5 0 0 1 18 7.5v1.15c0 .94.54 1.8 1.38 2.23l1.34.67a.5.5 0 0 1 0 .9l-1.34.67A2.5 2.5 0 0 0 18 15.35v1.15a2.5 2.5 0 0 1-2.5 2.5H14v-1h1.5c.83 0 1.5-.67 1.5-1.5v-1.15a3.5 3.5 0 0 1 1.93-3.13l.45-.22-.45-.22A3.5 3.5 0 0 1 17 8.65V7.5c0-.83-.67-1.5-1.5-1.5Z"/></svg>'
    },
    34882: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M7 14H5.5A1.5 1.5 0 0 1 4 12.5v-1A2.9 2.9 0 0 0 2.66 9l.18-.13A2.9 2.9 0 0 0 4 6.5V5.5C4 4.67 4.67 4 5.5 4H7V3H5.5A2.5 2.5 0 0 0 3 5.5V6.5a1.9 1.9 0 0 1-.77 1.58c-.42.32-.84.43-.85.44C1.3 8.54 1 8.65 1 9s.3.46.38.48c0 0 .43.12.85.44.4.3.77.8.77 1.58v1A2.5 2.5 0 0 0 5.5 15H7v-1Zm4-10h1.5c.83 0 1.5.67 1.5 1.5v1A2.9 2.9 0 0 0 15.34 9l-.18.13A2.9 2.9 0 0 0 14 11.5V12.5c0 .83-.67 1.5-1.5 1.5H11v1h1.5a2.5 2.5 0 0 0 2.5-2.5V11.5c0-.79.38-1.27.77-1.58.42-.32.84-.43.85-.44.08-.02.38-.13.38-.48s-.3-.46-.38-.48c0 0-.43-.12-.85-.44-.4-.3-.77-.8-.77-1.58v-1A2.5 2.5 0 0 0 12.5 3H11v1Z"/></svg>'
    },
    36791: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" fill-rule="evenodd" d="m5.12 12 3-6h7.76l3 6-3 6H8.12l-3-6ZM7.5 5h9l3.5 7-3.5 7h-9L4 12l3.5-7Zm6.5 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm1 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>'
    },
    83637: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" fill-rule="evenodd" d="m3.1 9 2.28-5h7.24l2.28 5-2.28 5H5.38L3.1 9Zm1.63-6h8.54L16 9l-2.73 6H4.73L2 9l2.73-6Zm5.77 6a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm1 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/></svg>'
    },
    91104: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M10.5 6a.5.5 0 0 0-.5.5V7h4v-.5a.5.5 0 0 0-.5-.5h-3ZM15 7h3v1h-1.04l-.88 9.64a1.5 1.5 0 0 1-1.5 1.36H9.42a1.5 1.5 0 0 1-1.5-1.36L7.05 8H6V7h3v-.5c0-.83.67-1.5 1.5-1.5h3c.83 0 1.5.67 1.5 1.5V7ZM8.05 8l.87 9.55a.5.5 0 0 0 .5.45h5.17a.5.5 0 0 0 .5-.45L15.94 8h-7.9Z"/></svg>'
    },
    30556: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M7.5 4a.5.5 0 0 0-.5.5V5h4v-.5a.5.5 0 0 0-.5-.5h-3ZM12 5h3v1h-1.05l-.85 7.67A1.5 1.5 0 0 1 11.6 15H6.4a1.5 1.5 0 0 1-1.5-1.33L4.05 6H3V5h3v-.5C6 3.67 6.67 3 7.5 3h3c.83 0 1.5.67 1.5 1.5V5ZM5.06 6l.84 7.56a.5.5 0 0 0 .5.44h5.2a.5.5 0 0 0 .5-.44L12.94 6H5.06Z"/></svg>'
    },
    14604: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" width="15" height="15" fill="none"><path stroke="currentColor" d="M11 2 7.5 5 4 2" class="bracket-up"/><path stroke="currentColor" d="M4 13l3.5-3 3.5 3" class="bracket-down"/></svg>'
    },
    20465: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="M20.53 3.73 14 9.33 7.47 3.73M7.47 24.27l6.53 -5.60 6.53 5.60"/></svg>'
    },
    48344: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M14 7v12.93l5.18-4.31.64.76-6.32 5.27-6.32-5.27.64-.76L13 19.93V7h1z"/></svg>'
    },
    99539: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M19.32 6H8.68A2.68 2.68 0 0 0 6 8.68V11h1V8.68C7 7.75 7.75 7 8.68 7h10.64c.93 0 1.68.75 1.68 1.68V11h1V8.68C22 7.2 20.8 6 19.32 6zM7 19.32c0 .93.75 1.68 1.68 1.68h10.64c.93 0 1.68-.75 1.68-1.68V17h1v2.32C22 20.8 20.8 22 19.32 22H8.68A2.68 2.68 0 0 1 6 19.32V17h1v2.32z"/></svg>'
    },
    34763: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="m7.47 9.33 6.53 -5.60L20.53 9.33M20.53 18.67l-6.53 5.60L7.47 18.67"/></svg>'
    },
    30426: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M18 7h5v1h-2.01l-1.33 14.64a1.5 1.5 0 0 1-1.5 1.36H9.84a1.5 1.5 0 0 1-1.49-1.36L7.01 8H5V7h5V6c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v1Zm-6-2a1 1 0 0 0-1 1v1h6V6a1 1 0 0 0-1-1h-4ZM8.02 8l1.32 14.54a.5.5 0 0 0 .5.46h8.33a.5.5 0 0 0 .5-.46L19.99 8H8.02Z"/></svg>'
    },
    72899: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M13.5 6.35l6.32 5.27-.64.76L14 8.07V21h-1V8.07l-5.18 4.31-.64-.76 6.32-5.27z"/></svg>'
    },
    82847: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" width="15" height="15"><circle fill="currentColor" cx="12.75" cy="7.5" r="1.25"/><circle fill="currentColor" cx="7.5" cy="7.5" r="1.25"/><circle fill="currentColor" cx="2.25" cy="7.5" r="1.25"/></svg>'
    },
    3515: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" width="15" height="15"><path fill="currentColor" d="M11.83 8.88l-.66-.76L8 10.9V3H7v7.9L3.83 8.12l-.66.76 4.33 3.78 4.33-3.78z"/></svg>'
    },
    79526: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" width="15" height="15" fill="none"><path fill="currentColor" d="M4.5 12A1.5 1.5 0 0 1 3 10.5V9H2v1.5A2.5 2.5 0 0 0 4.5 13h6a2.5 2.5 0 0 0 2.5-2.5V9h-1v1.5c0 .83-.67 1.5-1.5 1.5h-6z" class="bracket-up"/><path fill="currentColor" d="M4.5 3C3.67 3 3 3.67 3 4.5V6H2V4.5A2.5 2.5 0 0 1 4.5 2h6A2.5 2.5 0 0 1 13 4.5V6h-1V4.5c0-.83-.67-1.5-1.5-1.5h-6z" class="bracket-down"/></svg>'
    },
    42930: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" width="15" height="15" fill="none"><path stroke="currentColor" d="m4 5 3.5-3L11 5" class="bracket-up"/><path stroke="currentColor" d="M11 10l-3.5 3L4 10" class="bracket-down"/></svg>'
    },
    37896: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" width="15" height="15"><path fill="currentColor" d="M6.5 2a.5.5 0 0 0-.5.5V3h3v-.5a.5.5 0 0 0-.5-.5h-2ZM10 3h3v1h-1.05l-.86 8.65A1.5 1.5 0 0 1 9.59 14H5.4a1.5 1.5 0 0 1-1.49-1.35L3.05 4H2V3h3v-.5C5 1.67 5.67 1 6.5 1h2c.83 0 1.5.67 1.5 1.5V3ZM4.05 4l.86 8.55a.5.5 0 0 0 .5.45H9.6a.5.5 0 0 0 .5-.45L10.94 4h-6.9Z"/></svg>'
    },
    81020: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" width="15" height="15"><path fill="currentColor" d="M11.83 6.12l-.66.76L8 4.1V12H7V4.1L3.83 6.88l-.66-.76L7.5 2.34l4.33 3.78z"/></svg>'
    },
    62920: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill="currentColor" d="M2.4 5.46a.8.8 0 0 1 1.14-.05L8 9.42l4.46-4.01a.8.8 0 0 1 1.08 1.18L8 11.58 2.47 6.59a.8.8 0 0 1-.06-1.13z"/></svg>'
    },
    47036: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" width="15" height="15"><path fill="currentColor" d="M3.5 5.58c.24-.28.65-.3.92-.07L7.5 8.14l3.08-2.63a.65.65 0 1 1 .84.98L7.5 9.86 3.58 6.49a.65.65 0 0 1-.07-.91z"/></svg>'
    },
    42205: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7 7" width="7" height="7"><path fill="currentColor" d="M3.5 7L7 4H4V0H3V4H0L3.5 7Z"/></svg>'
    },
    50119: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 7" width="9" height="7"><path fill="currentColor" d="M.5 3.5L4 0v3h5v1H4v3z"/></svg>'
    },
    62884: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 7" width="9" height="7"><path fill="currentColor" d="M8.5 3.5L5 0v3H0v1h5v3z"/></svg>'
    },
    50662: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7 7" width="7" height="7"><path fill="currentColor" d="M3.5 0L0 3h3v4h1V3h3L3.5 0z"/></svg>'
    },
  },
])
