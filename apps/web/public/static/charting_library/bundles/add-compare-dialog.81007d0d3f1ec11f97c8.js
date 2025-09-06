;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [731],
  {
    59142: (e, t) => {
      var o, n, a
      ;(n = [t]),
        (o = (e) => {
          function t(e) {
            if (Array.isArray(e)) {
              for (var t = 0, o = Array(e.length); t < e.length; t++)
                o[t] = e[t]
              return o
            }
            return Array.from(e)
          }
          Object.defineProperty(e, '__esModule', { value: !0 })
          var o = !1
          if ('undefined' != typeof window) {
            var n = {
              get passive() {
                o = !0
              },
            }
            window.addEventListener('testPassive', null, n),
              window.removeEventListener('testPassive', null, n)
          }
          var a =
              'undefined' != typeof window &&
              window.navigator &&
              window.navigator.platform &&
              /iP(ad|hone|od)/.test(window.navigator.platform),
            r = [],
            l = !1,
            i = -1,
            s = void 0,
            c = void 0,
            d = (e) =>
              r.some(
                (t) =>
                  !(!t.options.allowTouchMove || !t.options.allowTouchMove(e)),
              ),
            u = (e) => {
              var t = e || window.event
              return (
                !!d(t.target) ||
                1 < t.touches.length ||
                (t.preventDefault && t.preventDefault(), !1)
              )
            },
            m = () => {
              setTimeout(() => {
                void 0 !== c &&
                  ((document.body.style.paddingRight = c), (c = void 0)),
                  void 0 !== s &&
                    ((document.body.style.overflow = s), (s = void 0))
              })
            }
          ;(e.disableBodyScroll = (e, n) => {
            if (a) {
              if (!e)
                return void console.error(
                  'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
                )
              if (e && !r.some((t) => t.targetElement === e)) {
                var m = { targetElement: e, options: n || {} }
                ;(r = [].concat(t(r), [m])),
                  (e.ontouchstart = (e) => {
                    1 === e.targetTouches.length &&
                      (i = e.targetTouches[0].clientY)
                  }),
                  (e.ontouchmove = (t) => {
                    var o, n, a, r
                    1 === t.targetTouches.length &&
                      ((n = e),
                      (r = (o = t).targetTouches[0].clientY - i),
                      !d(o.target) &&
                        ((n && 0 === n.scrollTop && 0 < r) ||
                        ((a = n) &&
                          a.scrollHeight - a.scrollTop <= a.clientHeight &&
                          r < 0)
                          ? u(o)
                          : o.stopPropagation()))
                  }),
                  l ||
                    (document.addEventListener(
                      'touchmove',
                      u,
                      o ? { passive: !1 } : void 0,
                    ),
                    (l = !0))
              }
            } else {
              ;(h = n),
                setTimeout(() => {
                  if (void 0 === c) {
                    var e = !!h && !0 === h.reserveScrollBarGap,
                      t =
                        window.innerWidth - document.documentElement.clientWidth
                    e &&
                      0 < t &&
                      ((c = document.body.style.paddingRight),
                      (document.body.style.paddingRight = t + 'px'))
                  }
                  void 0 === s &&
                    ((s = document.body.style.overflow),
                    (document.body.style.overflow = 'hidden'))
                })
              var p = { targetElement: e, options: n || {} }
              r = [].concat(t(r), [p])
            }
            var h
          }),
            (e.clearAllBodyScrollLocks = () => {
              a
                ? (r.forEach((e) => {
                    ;(e.targetElement.ontouchstart = null),
                      (e.targetElement.ontouchmove = null)
                  }),
                  l &&
                    (document.removeEventListener(
                      'touchmove',
                      u,
                      o ? { passive: !1 } : void 0,
                    ),
                    (l = !1)),
                  (r = []),
                  (i = -1))
                : (m(), (r = []))
            }),
            (e.enableBodyScroll = (e) => {
              if (a) {
                if (!e)
                  return void console.error(
                    'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                  )
                ;(e.ontouchstart = null),
                  (e.ontouchmove = null),
                  (r = r.filter((t) => t.targetElement !== e)),
                  l &&
                    0 === r.length &&
                    (document.removeEventListener(
                      'touchmove',
                      u,
                      o ? { passive: !1 } : void 0,
                    ),
                    (l = !1))
              } else
                1 === r.length && r[0].targetElement === e
                  ? (m(), (r = []))
                  : (r = r.filter((t) => t.targetElement !== e))
            })
        }),
        void 0 === (a = 'function' == typeof o ? o.apply(t, n) : o) ||
          (e.exports = a)
    },
    11362: (e) => {
      e.exports = {
        wrapper: 'wrapper-GZajBGIm',
        input: 'input-GZajBGIm',
        view: 'view-GZajBGIm',
        danger: 'danger-GZajBGIm',
      }
    },
    4052: (e) => {
      e.exports = {
        box: 'box-ywH2tsV_',
        noOutline: 'noOutline-ywH2tsV_',
        disabled: 'disabled-ywH2tsV_',
        'intent-danger': 'intent-danger-ywH2tsV_',
        checked: 'checked-ywH2tsV_',
        check: 'check-ywH2tsV_',
        icon: 'icon-ywH2tsV_',
        dot: 'dot-ywH2tsV_',
        disableActiveStyles: 'disableActiveStyles-ywH2tsV_',
      }
    },
    77897: (e) => {
      e.exports = {
        button: 'button-Rc93kXa8',
        bordersVisible: 'bordersVisible-Rc93kXa8',
        selected: 'selected-Rc93kXa8',
      }
    },
    34625: (e) => {
      e.exports = { footer: 'footer-dwINHZFL' }
    },
    13079: (e) => {
      e.exports = {
        wrap: 'wrap-oc7l8ZQg',
        header: 'header-oc7l8ZQg',
        item: 'item-oc7l8ZQg',
      }
    },
    69849: (e) => {
      e.exports = { label: 'label-lVJKBKVk' }
    },
    60883: (e) => {
      e.exports = {
        scrollable: 'scrollable-sXALjK1u',
        spinnerWrap: 'spinnerWrap-sXALjK1u',
        item: 'item-sXALjK1u',
        heading: 'heading-sXALjK1u',
        checkboxWrap: 'checkboxWrap-sXALjK1u',
        checkbox: 'checkbox-sXALjK1u',
        emptyState: 'emptyState-sXALjK1u',
        image: 'image-sXALjK1u',
        text: 'text-sXALjK1u',
      }
    },
    29e3: (e) => {
      e.exports = {
        dialog: 'dialog-IKuIIugL',
        tabletDialog: 'tabletDialog-IKuIIugL',
        desktopDialog: 'desktopDialog-IKuIIugL',
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
    70673: (e, t, o) => {
      o.d(t, { CheckboxInput: () => c })
      var n = o(50959),
        a = o(97754),
        r = o(90186),
        l = o(5811),
        i = o(11362),
        s = o.n(i)
      function c(e) {
        const t = a(s().wrapper, e.className)
        return n.createElement(
          'span',
          { className: t, title: e.title, style: e.style },
          n.createElement('input', {
            id: e.id,
            tabIndex: e.tabIndex,
            className: a(e.intent && s()[e.intent], s().input),
            type: 'checkbox',
            name: e.name,
            checked: e.checked,
            disabled: e.disabled,
            value: e.value,
            autoFocus: e.autoFocus,
            role: e.role,
            onChange: () => {
              e.onChange?.(e.value)
            },
            ref: e.reference,
            'aria-required': e['aria-required'],
            'aria-describedby': e['aria-describedby'],
            'aria-invalid': e['aria-invalid'],
            ...(0, r.filterDataProps)(e),
          }),
          n.createElement(l.CheckboxView, {
            className: s().view,
            indeterminate: e.indeterminate,
            checked: e.checked,
            disabled: e.disabled,
            intent: e.intent,
            tabIndex: e.tabIndex,
          }),
        )
      }
    },
    5811: (e, t, o) => {
      o.d(t, { CheckboxView: () => c })
      var n = o(50959),
        a = o(97754),
        r = o(9745),
        l = o(65890),
        i = o(4052),
        s = o.n(i)
      function c(e) {
        const {
            indeterminate: t,
            checked: o,
            tabIndex: i,
            className: c,
            disabled: d,
            disableActiveStyles: u,
            intent: m,
            hideIcon: p,
            ...h
          } = e,
          v = t || !o || p ? '' : l,
          f = a(
            s().box,
            s()[`intent-${m}`],
            !t && s().check,
            !!t && s().dot,
            -1 === i && s().noOutline,
            c,
            o && s().checked,
            d && s().disabled,
            u && s().disableActiveStyles,
          )
        return n.createElement(
          'span',
          { className: f, ...h },
          n.createElement(r.Icon, { icon: v, className: s().icon }),
        )
      }
    },
    45601: (e, t, o) => {
      o.d(t, { Measure: () => a })
      var n = o(67842)
      function a(e) {
        const { children: t, onResize: o } = e
        return t((0, n.useResizeObserver)(o || (() => {}), [null === o]))
      }
    },
    39362: (e, t, o) => {
      o.d(t, { SymbolSearchDialogFooter: () => i })
      var n = o(50959),
        a = o(97754),
        r = o.n(a),
        l = o(34625)
      function i(e) {
        const { className: t, children: o } = e
        return n.createElement('div', { className: r()(l.footer, t) }, o)
      }
    },
    14283: (e, t, o) => {
      o.r(t), o.d(t, { getCompareDialogRenderer: () => le })
      var n = o(50959),
        a = o(11542),
        r = o(32563),
        l = o(56570),
        i = o(94664),
        s = o(97754),
        c = o.n(s),
        d = o(50151),
        u = o(9745),
        m = o(86656),
        p = o(77975),
        h = o(63932),
        v = o(24633),
        f = o(45345),
        g = o(45601),
        b = o(84524),
        S = o(96967)
      const y = n.createContext(null)
      var x = o(70412),
        w = o(78036)
      const I = n.createContext(null)
      var C = o(16396),
        E = o(41590),
        k = o(37558),
        D = o(77897)
      function M(e) {
        const {
          theme: t = D,
          children: o,
          onClick: a,
          isSelected: r,
          areBordersVisible: l,
          isItemSelected: i,
          className: s,
          value: d,
          name: u,
        } = e
        return n.createElement(
          'button',
          {
            type: 'button',
            className: c()(
              s,
              t.button,
              r && t.selected,
              l && !r && !i && t.bordersVisible,
            ),
            name: u,
            value: d,
            onClick: a,
          },
          o,
        )
      }
      function N(e) {
        const { value: t, onClick: o, ...a } = e,
          r = (0, n.useCallback)((e) => o(t, e), [t, o])
        return n.createElement(M, { ...a, value: String(t), onClick: r })
      }
      var _ = o(46148)
      function B(e) {
        const { compareModel: t, selectedCompareOptionIndex: r } = (0,
          w.useEnsuredContext)(y),
          l = t.comparableOnSameScale({ isYield: e }),
          i = (0, n.useMemo)(
            () =>
              ((e) => [
                {
                  label: e
                    ? a.t(null, void 0, o(38137))
                    : a.t(null, void 0, o(56136)),
                  compareOption: e
                    ? _.CompareOption.SameScale
                    : _.CompareOption.SamePctScale,
                },
                {
                  label: a.t(null, void 0, o(60126)),
                  compareOption: _.CompareOption.NewPriceScale,
                },
                {
                  label: a.t(null, void 0, o(63456)),
                  compareOption: _.CompareOption.NewPane,
                },
              ])(l),
            [l],
          )
        return [
          (0, n.useMemo)(
            () => i[r]?.compareOption ?? i[0].compareOption,
            [i, r],
          ),
          i,
        ]
      }
      var L = o(13079)
      function O(e) {
        const {
            fullSymbolName: t,
            isSelected: r,
            className: l,
            isYield: s,
          } = e,
          {
            isMobile: d,
            searchRef: u,
            setMode: m,
          } = (0, w.useEnsuredContext)(b.SymbolSearchItemsDialogContext),
          {
            compareModel: p,
            setHoveredItemId: h,
            clearInput: v,
            allowExtendTimeScale: f,
          } = (0, w.useEnsuredContext)(y),
          { callback: g } = (0, w.useEnsuredContext)(I),
          [S, x] = B(s)
        return d
          ? n.createElement(
              k.DrawerManager,
              null,
              n.createElement(
                E.Drawer,
                { position: 'Bottom', onClose: D.bind(null, !1) },
                n.createElement(
                  'div',
                  { className: L.header },
                  a.t(null, void 0, o(60085)),
                ),
                x.map(({ label: e, compareOption: t }) =>
                  n.createElement(C.PopupMenuItem, {
                    key: t,
                    className: L.item,
                    onClick: M,
                    onClickArg: t,
                    label: e,
                  }),
                ),
              ),
            )
          : n.createElement(
              'div',
              {
                className: c()(L.wrap, l),
                'data-name': 'compare-buttons-group',
              },
              x.map(({ label: e, compareOption: t }) =>
                n.createElement(
                  N,
                  {
                    key: t,
                    onClick: M,
                    value: t,
                    isItemSelected: Boolean(r),
                    isSelected: r && S === t,
                  },
                  e,
                ),
              ),
            )
        function D(e) {
          d && g && g(), v && e && v(u, m)
        }
        function M(e, o) {
          if ((o.preventDefault(), p && t && void 0 !== e)) {
            ;(0, i.getSymbolSearchCompleteOverrideFunction)()(t).then((t) => {
              p.applyStudy(t.symbol, e, f), h(''), D(!0)
            })
          }
        }
      }
      function T(e) {
        const {
            isSelected: t,
            fullSymbolName: o,
            onExpandClick: a,
            actions: l,
            id: s,
            isOffset: c,
            isYield: d,
          } = e,
          {
            isMobile: u,
            toggleExpand: m,
            searchSpreads: p,
            searchRef: h,
            setMode: v,
            mode: f,
          } = (0, w.useEnsuredContext)(b.SymbolSearchItemsDialogContext),
          {
            compareModel: g,
            hoveredItemId: C,
            setHoveredItemId: E,
            clearInput: k,
            allowExtendTimeScale: D,
          } = (0, w.useEnsuredContext)(y),
          [M, N] = (0, n.useState)(!1),
          B = (0, n.useRef)(null),
          L = (0, x.useAccurateHover)(B),
          T = (0, n.useMemo)(() => ({ callback: z }), [z]),
          A = !Boolean(a) && !Boolean(l),
          R = s === C
        return n.createElement(
          I.Provider,
          { value: T },
          n.createElement(S.SymbolSearchDialogContentItem, {
            hideMarkedListFlag: 'compare' === f,
            ...e,
            reference: B,
            onClick: (t) => {
              if (Boolean(a) && s && !c) return t?.preventDefault(), void m(s)
              if (!M && u) return void N(!0)
              if (p && e.onClick) return void e.onClick(t)
              if ((r.mobiletouch ? R : !M) && o) {
                ;(0, i.getSymbolSearchCompleteOverrideFunction)()(o).then(
                  (e) => {
                    const t = g.comparableOnSameScale({ isYield: d })
                      ? _.CompareOption.SameScale
                      : _.CompareOption.SamePctScale
                    g.applyStudy(e.symbol, t, D)
                  },
                ),
                  E(''),
                  k && k(h, v)
              }
              r.mobiletouch && !u && !R && s && E(s)
            },
            hoverComponent: (() => {
              if (!A) return !1
              if (u) return M
              if (r.mobiletouch) return R
              return Boolean(L || t)
            })()
              ? O
              : void 0,
          }),
        )
        function z() {
          N(!1)
        }
      }
      var A = o(15550),
        R = o(93986),
        z = o(39750),
        H = o(60883)
      function V(e) {
        const { handleListWidth: t } = (0, d.ensureNotNull)(
            (0, n.useContext)(b.SymbolSearchItemsDialogContext),
          ),
          {
            compareModel: r,
            selectedCompareIndex: l,
            selectedItemRef: i,
          } = (0, d.ensureNotNull)((0, n.useContext)(y)),
          s = (0, p.useWatchedValueReadonly)({ watchedValue: r.isDataReady() }),
          x = (0, p.useWatchedValueReadonly)({ watchedValue: r.studies() }),
          w = (0, p.useWatchedValueReadonly)({
            watchedValue: r.highlightedSymbol(),
          }),
          I = (0, n.useMemo)(() => x.filter((e) => e.checked), [x]),
          C = (0, n.useMemo)(() => x.filter((e) => !e.checked), [x])
        return (
          (0, n.useEffect)(
            () => (
              r
                .chartModel()
                .dataSourceCollectionChanged()
                .subscribe(r, r.handleSourcesChange),
              () =>
                r
                  .chartModel()
                  .dataSourceCollectionChanged()
                  .unsubscribe(r, r.handleSourcesChange)
            ),
            [r],
          ),
          n.createElement(
            g.Measure,
            {
              onResize: ([e]) => {
                t(e.contentRect.width)
              },
            },
            (e) =>
              n.createElement(
                m.TouchScrollContainer,
                { className: H.scrollable, ref: e },
                (() => {
                  if (!s)
                    return n.createElement(
                      'div',
                      { className: H.spinnerWrap },
                      n.createElement(h.Spinner, null),
                    )
                  if (!Boolean(I.length) && !Boolean(C.length)) {
                    const e = f.watchedTheme.value() === v.StdTheme.Dark ? R : A
                    return n.createElement(
                      'div',
                      { className: H.emptyState },
                      n.createElement(u.Icon, { className: H.image, icon: e }),
                      n.createElement(
                        'div',
                        { className: H.text },
                        a.t(null, void 0, o(37094)),
                      ),
                    )
                  }
                  return n.createElement(
                    n.Fragment,
                    null,
                    Boolean(I.length) &&
                      n.createElement(
                        n.Fragment,
                        null,
                        n.createElement(
                          'div',
                          { className: H.heading },
                          a.t(null, void 0, o(46622)),
                        ),
                        I.map((e, t) =>
                          n.createElement(S.SymbolSearchDialogContentItem, {
                            'data-role': 'added-symbol-item',
                            className: H.item,
                            key: e.id,
                            id: e.id,
                            shortName: e.title,
                            title: e.title,
                            logoId: e.logoId,
                            currencyLogoId: e.currencyLogoId,
                            baseCurrencyLogoId: e.baseCurrencyLogoId,
                            dangerousDescriptionHTML: e.description,
                            exchangeName: e.exchangeName,
                            marketType: e.marketType,
                            country: e.country,
                            providerId: e.providerId,
                            onClick: E.bind(null, e),
                            isHighlighted: e.id === w,
                            isSelected: k(e),
                            itemRef: k(e) ? i : void 0,
                            isYield: e.isYield,
                            actions: n.createElement(
                              'div',
                              { className: H.checkboxWrap },
                              n.createElement(
                                M,
                                {
                                  className: H.checkbox,
                                  onClick: E.bind(null, e),
                                  isSelected: k(e),
                                },
                                n.createElement(u.Icon, { icon: z }),
                              ),
                            ),
                          }),
                        ),
                      ),
                    Boolean(C.length) &&
                      n.createElement(
                        n.Fragment,
                        null,
                        n.createElement(
                          'div',
                          { className: H.heading },
                          a.t(null, void 0, o(8926)),
                        ),
                        C.map((e) =>
                          n.createElement(T, {
                            'data-role': 'recent-symbol-item',
                            className: c()(H.item, e.id === w && H.highlighted),
                            key: e.id,
                            id: e.id,
                            shortName: e.title,
                            logoId: e.logoId,
                            currencyLogoId: e.currencyLogoId,
                            baseCurrencyLogoId: e.baseCurrencyLogoId,
                            title: e.title,
                            dangerousDescriptionHTML: e.description,
                            exchangeName: e.exchangeName,
                            marketType: e.marketType,
                            country: e.country,
                            providerId: e.providerId,
                            fullSymbolName: e.symbol,
                            isSelected: k(e),
                            itemRef: k(e) ? i : void 0,
                            isYield: e.isYield,
                          }),
                        ),
                      ),
                  )
                })(),
              ),
          )
        )
        function E(e, t) {
          t?.preventDefault(), r.removeStudy(e)
        }
        function k(e) {
          return x.indexOf(e) === l
        }
      }
      var P = o(56840)
      class F extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._selectedItemRef = n.createRef()),
            (this._getContextValue = () => {
              const { compareModel: e } = this.props,
                {
                  selectedCompareOptionIndex: t,
                  selectedCompareIndex: o,
                  hoveredItemId: n,
                  allowExtendTimeScale: a,
                } = this.state
              return {
                compareModel: e,
                selectedCompareOptionIndex: t,
                setSelectedCompareOptionIndex:
                  this._setSelectedCompareOptionIndex,
                hoveredItemId: n,
                setHoveredItemId: this._setHoveredItemId,
                selectedCompareIndex: o,
                setSelectedCompareIndex: this._setSelectedCompareIndex,
                selectedItemRef: this._selectedItemRef,
                clearInput: this._clearInput,
                allowExtendTimeScale: a,
                toggleAllowExtendTimeScale: this._toggleAllowExtendTimeScale,
              }
            }),
            (this._clearInput = (e, t) => {
              e && e.current && ((e.current.value = ''), t('compare'))
            }),
            (this._setSelectedCompareOptionIndex = (e) => {
              this.setState({ selectedCompareOptionIndex: e })
            }),
            (this._setHoveredItemId = (e) => {
              this.setState({ hoveredItemId: e })
            }),
            (this._setSelectedCompareIndex = (e, t) => {
              this.setState({ selectedCompareIndex: e }, t)
            }),
            (this._toggleAllowExtendTimeScale = () => {
              const e = !this.state.allowExtendTimeScale
              P.setValue('showAddSymbolDialog.extendCheckboxState', e),
                this.setState({ allowExtendTimeScale: e })
            }),
            (this.state = {
              selectedCompareOptionIndex: 0,
              selectedCompareIndex: -1,
              hoveredItemId: void 0,
              allowExtendTimeScale: Boolean(
                P.getBool('showAddSymbolDialog.extendCheckboxState'),
              ),
            })
        }
        render() {
          const { children: e } = this.props
          return n.createElement(
            y.Provider,
            { value: this._getContextValue() },
            e,
          )
        }
      }
      var K = o(68335),
        W = o(79418),
        j = o(19291),
        X = o(29e3)
      function Y(e) {
        const {
            openedItems: t,
            searchRef: o,
            feedItems: a,
            selectedIndex: r,
            toggleExpand: i,
            onSearchComplete: c,
            mode: d,
            setMode: u,
            setSelectedIndex: m,
            isMobile: h,
            isTablet: v,
            onClose: f,
            upperCaseEnabled: g,
            symbolSearchState: S,
          } = (0, w.useEnsuredContext)(b.SymbolSearchItemsDialogContext),
          {
            compareModel: x,
            hoveredItemId: I,
            setHoveredItemId: C,
            selectedCompareOptionIndex: E,
            setSelectedCompareOptionIndex: k,
            selectedCompareIndex: D,
            setSelectedCompareIndex: M,
            selectedItemRef: N,
            clearInput: _,
            allowExtendTimeScale: L,
          } = (0, w.useEnsuredContext)(y),
          O = (0, p.useWatchedValueReadonly)({ watchedValue: x.studies() }),
          T = a[r],
          A = 'compare' === d,
          R = 'exchange' === d,
          z = A ? D : r,
          H = A ? O : a,
          V = H[z],
          [P, F] = B(V?.isYield)
        return (
          (0, n.useEffect)(() => {
            I && C(''), D && M(-1)
          }, [d]),
          n.createElement(W.AdaptivePopupDialog, {
            ...e,
            className: s(
              X.dialog,
              !h && (v ? X.tabletDialog : X.desktopDialog),
            ),
            onKeyDown: (e) => {
              if (e.target && e.target !== o.current) return
              const n = (0, K.hashFromEvent)(e)
              switch (n) {
                case 13: {
                  if (A)
                    return void (() => {
                      if (-1 === D) return
                      const e = O[D]
                      e.checked
                        ? x.removeStudy(e)
                        : x.applyStudy(e.symbol, P, L)
                      M(-1)
                    })()
                  const t = U()
                  if (t) return e.preventDefault(), void i(t)
                  e.preventDefault()
                  const n = (() => {
                    0
                    const e = (e) =>
                        'string' == typeof e?.fullSymbolName
                          ? e.fullSymbolName
                          : e?.symbol,
                      t = -1 !== r
                    if (t) return e(V)
                    const n = l.enabled('allow_arbitrary_symbol_search_input'),
                      a = 'empty' !== S
                    if (n)
                      return a && H.length ? e(H[0]) : o?.current?.value.trim()
                    if (!a && !t && !n) return
                    if (H.length) return e(H[0])
                  })()
                  return void (
                    n &&
                    (c([
                      {
                        symbol: g ? n.toString().toUpperCase() : n.toString(),
                        resolved: !1,
                        compareOption: P,
                        allowExtendTimeScale: L,
                      },
                    ]),
                    _ && _(o, u))
                  )
                }
                case 27:
                  return (
                    e.preventDefault(), R ? void u('symbolSearch') : void f()
                  )
              }
              if (!A && 'good' !== S) return
              switch ((0, j.mapKeyCodeToDirection)(n)) {
                case 'blockPrev':
                  if ((e.preventDefault(), 0 === z)) return
                  if (-1 === z) return void Y(0)
                  Y(z - 1)
                  break
                case 'blockNext':
                  if ((e.preventDefault(), z === H.length - 1)) return
                  Y(z + 1)
                  break
                case 'inlinePrev': {
                  const o = U()
                  if (o && t.has(o)) return e.preventDefault(), void i(o)
                  if (!E || o) return
                  e.preventDefault(), k(E - 1)
                  break
                }
                case 'inlineNext': {
                  const o = U()
                  if (o && !t.has(o)) return e.preventDefault(), void i(o)
                  if (E === F.length - 1 || o) return
                  e.preventDefault(), k(E + 1)
                  break
                }
              }
            },
            dataName: 'compare-dialog',
            draggable: !0,
          })
        )
        function Y(e) {
          A ? M(e, G) : m(e)
        }
        function G() {
          N.current?.scrollIntoView({ block: 'nearest' })
        }
        function U() {
          if (!T) return
          const { id: e, isOffset: t, onExpandClick: o } = T
          return !t && Boolean(o) && e ? e : void 0
        }
      }
      var G = o(73280),
        U = o(29280),
        Z = o(87896)
      class Q extends U.DialogRenderer {
        constructor(e) {
          super(), (this._props = e)
        }
        show(e) {
          if (this.visible().value()) return
          const t = n.createElement(G.SymbolSearchItemsDialog, {
            ...this._props,
            shouldReturnFocus: e?.shouldReturnFocus,
            initialMode: this._props.initialMode || 'symbolSearch',
            onClose: () => this.hide(),
          })
          ;(this._rootInstance = (0, Z.createReactRoot)(t, this._container)),
            this._setVisibility(!0)
        }
        hide() {
          this._rootInstance?.unmount(),
            this._visibility.setValue(!1),
            this._props.onClose?.()
        }
      }
      var $ = o(81319),
        q = o(69654),
        J = o(70613)
      function ee(e) {
        const { searchRef: t, setMode: o } = (0, w.useEnsuredContext)(
            b.SymbolSearchItemsDialogContext,
          ),
          { currentMode: a } = (0, w.useEnsuredContext)(
            J.SymbolSearchDialogBodyContext,
          )
        return (
          (0, n.useEffect)(() => {
            const e = t.current
            if (e)
              return (
                e.addEventListener('input', r),
                () => {
                  e && e.removeEventListener('input', r)
                }
              )
          }, []),
          n.createElement(q.DialogSearch, { ...e })
        )
        function r() {
          t.current &&
            a &&
            ('compare' !== a.current || '' === t?.current?.value?.trim()
              ? 'symbolSearch' === a.current &&
                '' === t?.current?.value?.trim() &&
                o('compare')
              : o('symbolSearch'))
        }
      }
      var te = o(70673),
        oe = o(39362),
        ne = o(69849)
      function ae(e) {
        const { allowExtendTimeScale: t, toggleAllowExtendTimeScale: r } = (0,
        d.ensureNotNull)((0, n.useContext)(y))
        return n.createElement(
          oe.SymbolSearchDialogFooter,
          null,
          n.createElement(
            'label',
            { 'data-name': 'allow-extend-time-scale-checkbox' },
            n.createElement(te.CheckboxInput, {
              checked: t,
              value: t ? 'on' : 'off',
              onChange: r,
            }),
            n.createElement(
              'span',
              { className: ne.label },
              a.t(null, void 0, o(1048)),
            ),
          ),
        )
      }
      const re = l.enabled('secondary_series_extend_time_scale')
      function le(e) {
        return new Q({
          wrapper:
            ((t = e), (e) => n.createElement(F, { ...e, compareModel: t })),
          dialog: Y,
          contentItem: T,
          initialScreen: V,
          searchInput: ee,
          footer: re ? n.createElement(ae) : void 0,
          initialMode: 'compare',
          dialogTitle: a.t(null, void 0, o(93193)),
          autofocus: !r.mobiletouch,
          dialogWidth: 'fixed',
          onSearchComplete: (t) => {
            const { compareOption: o, allowExtendTimeScale: n } = t[0]
            if (void 0 !== o) {
              ;(0, i.getSymbolSearchCompleteOverrideFunction)()(
                t[0].symbol,
                t[0].result,
              ).then((t) => {
                e.applyStudy(t.symbol, o, n)
              })
            }
          },
          symbolTypes: (0, $.getAvailableSymbolTypes)(),
          showSpreadActions:
            l.enabled('show_spread_operators') &&
            l.enabled('compare_symbol_search_spread_operators'),
        })
        var t
      }
    },
    46148: (e, t, o) => {
      var n
      o.d(t, { CompareOption: () => n }),
        ((e) => {
          ;(e[(e.SamePctScale = 0)] = 'SamePctScale'),
            (e[(e.NewPriceScale = 1)] = 'NewPriceScale'),
            (e[(e.NewPane = 2)] = 'NewPane'),
            (e[(e.SameScale = 3)] = 'SameScale')
        })(n || (n = {}))
    },
    37558: (e, t, o) => {
      o.d(t, { DrawerContext: () => l, DrawerManager: () => r })
      var n = o(50959),
        a = o(99054)
      class r extends n.PureComponent {
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
            ((0, a.setFixedBodyState)(!0), (this._isBodyFixed = !0)),
            t.stack.length &&
              !this.state.stack.length &&
              this._isBodyFixed &&
              ((0, a.setFixedBodyState)(!1), (this._isBodyFixed = !1))
        }
        componentWillUnmount() {
          this.state.stack.length &&
            this._isBodyFixed &&
            (0, a.setFixedBodyState)(!1)
        }
        render() {
          return n.createElement(
            l.Provider,
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
      const l = n.createContext(null)
    },
    41590: (e, t, o) => {
      o.d(t, { Drawer: () => p })
      var n = o(50959),
        a = o(50151),
        r = o(97754),
        l = o(92184),
        i = o(42842),
        s = o(37558),
        c = o(29197),
        d = o(86656),
        u = o(36718)
      var m
      function p(e) {
        const {
            position: t = 'Bottom',
            onClose: o,
            children: d,
            reference: m,
            className: p,
            theme: v = u,
          } = e,
          f = (0, a.ensureNotNull)((0, n.useContext)(s.DrawerContext)),
          [g] = (0, n.useState)(() => (0, l.randomHash)()),
          b = (0, n.useRef)(null),
          S = (0, n.useContext)(c.CloseDelegateContext)
        return (
          (0, n.useLayoutEffect)(
            () => (
              (0, a.ensureNotNull)(b.current).focus({ preventScroll: !0 }),
              S.subscribe(f, o),
              f.addDrawer(g),
              () => {
                f.removeDrawer(g), S.unsubscribe(f, o)
              }
            ),
            [],
          ),
          n.createElement(
            i.Portal,
            null,
            n.createElement(
              'div',
              { ref: m, className: r(u.wrap, u[`position${t}`]) },
              g === f.currentDrawer &&
                n.createElement('div', { className: u.backdrop, onClick: o }),
              n.createElement(
                h,
                {
                  className: r(v.drawer, u[`position${t}`], p),
                  ref: b,
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
      })(m || (m = {}))
      const h = (0, n.forwardRef)((e, t) => {
        const { className: o, ...a } = e
        return n.createElement(d.TouchScrollContainer, {
          className: r(u.drawer, o),
          tabIndex: -1,
          ref: t,
          ...a,
        })
      })
    },
    70412: (e, t, o) => {
      o.d(t, {
        hoverMouseEventFilter: () => r,
        useAccurateHover: () => l,
        useHover: () => a,
      })
      var n = o(50959)
      function a() {
        const [e, t] = (0, n.useState)(!1)
        return [
          e,
          {
            onMouseOver: (e) => {
              r(e) && t(!0)
            },
            onMouseOut: (e) => {
              r(e) && t(!1)
            },
          },
        ]
      }
      function r(e) {
        return !e.currentTarget.contains(e.relatedTarget)
      }
      function l(e) {
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
    86656: (e, t, o) => {
      o.d(t, { TouchScrollContainer: () => c })
      var n = o(50959),
        a = o(59142),
        r = o(50151),
        l = o(49483)
      const i = CSS.supports('overscroll-behavior', 'none')
      let s = 0
      const c = (0, n.forwardRef)((e, t) => {
        const { children: o, ...r } = e,
          c = (0, n.useRef)(null)
        return (
          (0, n.useImperativeHandle)(t, () => c.current),
          (0, n.useLayoutEffect)(() => {
            if (l.CheckMobile.iOS())
              return (
                s++,
                null !== c.current &&
                  (i
                    ? 1 === s &&
                      (document.body.style.overscrollBehavior = 'none')
                    : (0, a.disableBodyScroll)(c.current, {
                        allowTouchMove: d(c),
                      })),
                () => {
                  s--,
                    null !== c.current &&
                      (i
                        ? 0 === s &&
                          (document.body.style.overscrollBehavior = '')
                        : (0, a.enableBodyScroll)(c.current))
                }
              )
          }, []),
          n.createElement('div', { ref: c, ...r }, o)
        )
      })
      function d(e) {
        return (t) => {
          const o = (0, r.ensureNotNull)(e.current),
            n = document.activeElement
          return (
            !o.contains(t) || (null !== n && o.contains(n) && n.contains(t))
          )
        }
      }
    },
    65890: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 9" width="11" height="9" fill="none"><path stroke="currentColor" stroke-width="2" d="M0.999878 4L3.99988 7L9.99988 1"/></svg>'
    },
    39750: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M7 15l5 5L23 9"/></svg>'
    },
    93986: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 121 120" width="121" height="120"><path fill="#D1D4DC" d="M53.88 18.36a43.4 43.4 0 0 1 11.24 0 1 1 0 0 0 .26-1.98 45.42 45.42 0 0 0-11.76 0 1 1 0 1 0 .26 1.98zM43.04 21.26a1 1 0 0 0-.77-1.85A44.95 44.95 0 0 0 32.1 25.3a1 1 0 0 0 1.22 1.58 42.95 42.95 0 0 1 9.72-5.62zM75.42 19.96a1 1 0 0 1 1.3-.55A44.95 44.95 0 0 1 86.9 25.3a1 1 0 0 1-1.22 1.58 42.95 42.95 0 0 0-9.72-5.62 1 1 0 0 1-.54-1.3zM25.38 34.82a1 1 0 1 0-1.58-1.22 44.95 44.95 0 0 0-5.89 10.17 1 1 0 0 0 1.85.77 42.95 42.95 0 0 1 5.62-9.72zM16.86 55.38a1 1 0 0 0-1.98-.26 45.42 45.42 0 0 0 0 11.76 1 1 0 1 0 1.98-.26 43.4 43.4 0 0 1 0-11.24zM103 54.26a1 1 0 0 1 1.12.86 45.4 45.4 0 0 1 0 11.76 1 1 0 0 1-1.98-.26 43.37 43.37 0 0 0 0-11.24 1 1 0 0 1 .86-1.12zM19.76 77.46a1 1 0 0 0-1.85.77A44.95 44.95 0 0 0 23.8 88.4a1 1 0 0 0 1.58-1.22 42.95 42.95 0 0 1-5.62-9.72zM100.54 76.92a1 1 0 0 1 .54 1.3A44.95 44.95 0 0 1 95.2 88.4a1 1 0 0 1-1.58-1.22 42.95 42.95 0 0 0 5.62-9.72 1 1 0 0 1 1.3-.54zM33.32 95.12a1 1 0 1 0-1.22 1.58 44.94 44.94 0 0 0 10.17 5.88 1 1 0 0 0 .77-1.84 42.97 42.97 0 0 1-9.72-5.62zM87.08 95.3a1 1 0 0 1-.18 1.4 44.94 44.94 0 0 1-10.17 5.88 1 1 0 0 1-.77-1.84 42.98 42.98 0 0 0 9.72-5.62 1 1 0 0 1 1.4.18zM53.88 103.64a1 1 0 0 0-.26 1.98 45.4 45.4 0 0 0 11.76 0 1 1 0 0 0-.26-1.98 43.37 43.37 0 0 1-11.24 0zM62.81 53.17a1 1 0 0 0-.78 1.84 6.62 6.62 0 0 1 3.49 3.5 1 1 0 1 0 1.84-.78 8.62 8.62 0 0 0-4.55-4.56z"/><path fill="#D1D4DC" d="M45.5 61a14 14 0 1 1 24.28 9.5l7.92 7.92a1 1 0 0 1-1.42 1.42l-7.96-7.97A14 14 0 0 1 45.5 61zm14-12a12 12 0 1 0 0 24 12 12 0 0 0 0-24z"/><circle fill="#1976D2" cx="97.5" cy="39" r="13"/><path fill="#D1D4DC" d="M98.5 34a1 1 0 1 0-2 0v4h-4a1 1 0 1 0 0 2h4v4a1 1 0 1 0 2 0v-4h4a1 1 0 0 0 0-2h-4v-4z"/></svg>'
    },
    15550: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 121 120" width="121" height="120"><path fill="#1E222D" d="M53.88 18.36a43.4 43.4 0 0 1 11.24 0 1 1 0 0 0 .26-1.98 45.42 45.42 0 0 0-11.76 0 1 1 0 1 0 .26 1.98zM43.04 21.26a1 1 0 0 0-.77-1.85A44.95 44.95 0 0 0 32.1 25.3a1 1 0 0 0 1.22 1.58 42.95 42.95 0 0 1 9.72-5.62zM75.42 19.96a1 1 0 0 1 1.3-.55A44.95 44.95 0 0 1 86.9 25.3a1 1 0 0 1-1.22 1.58 42.95 42.95 0 0 0-9.72-5.62 1 1 0 0 1-.54-1.3zM25.38 34.82a1 1 0 1 0-1.58-1.22 44.95 44.95 0 0 0-5.89 10.17 1 1 0 0 0 1.85.77 42.95 42.95 0 0 1 5.62-9.72zM16.86 55.38a1 1 0 0 0-1.98-.26 45.42 45.42 0 0 0 0 11.76 1 1 0 1 0 1.98-.26 43.4 43.4 0 0 1 0-11.24zM103 54.26a1 1 0 0 1 1.12.86 45.4 45.4 0 0 1 0 11.76 1 1 0 0 1-1.98-.26 43.37 43.37 0 0 0 0-11.24 1 1 0 0 1 .86-1.12zM19.76 77.46a1 1 0 0 0-1.85.77A44.95 44.95 0 0 0 23.8 88.4a1 1 0 0 0 1.58-1.22 42.95 42.95 0 0 1-5.62-9.72zM100.54 76.92a1 1 0 0 1 .54 1.3A44.95 44.95 0 0 1 95.2 88.4a1 1 0 0 1-1.58-1.22 42.95 42.95 0 0 0 5.62-9.72 1 1 0 0 1 1.3-.54zM33.32 95.12a1 1 0 1 0-1.22 1.58 44.94 44.94 0 0 0 10.17 5.88 1 1 0 0 0 .77-1.84 42.97 42.97 0 0 1-9.72-5.62zM87.08 95.3a1 1 0 0 1-.18 1.4 44.94 44.94 0 0 1-10.17 5.88 1 1 0 0 1-.77-1.84 42.98 42.98 0 0 0 9.72-5.62 1 1 0 0 1 1.4.18zM53.88 103.64a1 1 0 0 0-.26 1.98 45.4 45.4 0 0 0 11.76 0 1 1 0 0 0-.26-1.98 43.37 43.37 0 0 1-11.24 0zM62.81 53.17a1 1 0 0 0-.78 1.84 6.62 6.62 0 0 1 3.49 3.5 1 1 0 1 0 1.84-.78 8.62 8.62 0 0 0-4.55-4.56z"/><path fill="#1E222D" d="M45.5 61a14 14 0 1 1 24.28 9.5l7.92 7.92a1 1 0 0 1-1.42 1.42l-7.96-7.97A14 14 0 0 1 45.5 61zm14-12a12 12 0 1 0 0 24 12 12 0 0 0 0-24z"/><circle fill="#2196F3" cx="97.5" cy="39" r="13"/><path fill="#fff" d="M98.5 34a1 1 0 1 0-2 0v4h-4a1 1 0 1 0 0 2h4v4a1 1 0 1 0 2 0v-4h4a1 1 0 0 0 0-2h-4v-4z"/></svg>'
    },
  },
])
