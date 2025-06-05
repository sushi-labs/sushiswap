;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [731],
  {
    259142: (e, t) => {
      var o, a, r
      ;(a = [t]),
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
            var a = {
              get passive() {
                o = !0
              },
            }
            window.addEventListener('testPassive', null, a),
              window.removeEventListener('testPassive', null, a)
          }
          var r =
              'undefined' != typeof window &&
              window.navigator &&
              window.navigator.platform &&
              /iP(ad|hone|od)/.test(window.navigator.platform),
            n = [],
            l = !1,
            s = -1,
            i = void 0,
            c = void 0,
            d = (e) =>
              n.some(
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
                  void 0 !== i &&
                    ((document.body.style.overflow = i), (i = void 0))
              })
            }
          ;(e.disableBodyScroll = (e, a) => {
            if (r) {
              if (!e)
                return void console.error(
                  'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
                )
              if (e && !n.some((t) => t.targetElement === e)) {
                var m = { targetElement: e, options: a || {} }
                ;(n = [].concat(t(n), [m])),
                  (e.ontouchstart = (e) => {
                    1 === e.targetTouches.length &&
                      (s = e.targetTouches[0].clientY)
                  }),
                  (e.ontouchmove = (t) => {
                    var o, a, r, n
                    1 === t.targetTouches.length &&
                      ((a = e),
                      (n = (o = t).targetTouches[0].clientY - s),
                      !d(o.target) &&
                        ((a && 0 === a.scrollTop && 0 < n) ||
                        ((r = a) &&
                          r.scrollHeight - r.scrollTop <= r.clientHeight &&
                          n < 0)
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
              ;(p = a),
                setTimeout(() => {
                  if (void 0 === c) {
                    var e = !!p && !0 === p.reserveScrollBarGap,
                      t =
                        window.innerWidth - document.documentElement.clientWidth
                    e &&
                      0 < t &&
                      ((c = document.body.style.paddingRight),
                      (document.body.style.paddingRight = t + 'px'))
                  }
                  void 0 === i &&
                    ((i = document.body.style.overflow),
                    (document.body.style.overflow = 'hidden'))
                })
              var h = { targetElement: e, options: a || {} }
              n = [].concat(t(n), [h])
            }
            var p
          }),
            (e.clearAllBodyScrollLocks = () => {
              r
                ? (n.forEach((e) => {
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
                  (n = []),
                  (s = -1))
                : (m(), (n = []))
            }),
            (e.enableBodyScroll = (e) => {
              if (r) {
                if (!e)
                  return void console.error(
                    'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                  )
                ;(e.ontouchstart = null),
                  (e.ontouchmove = null),
                  (n = n.filter((t) => t.targetElement !== e)),
                  l &&
                    0 === n.length &&
                    (document.removeEventListener(
                      'touchmove',
                      u,
                      o ? { passive: !1 } : void 0,
                    ),
                    (l = !1))
              } else
                1 === n.length && n[0].targetElement === e
                  ? (m(), (n = []))
                  : (n = n.filter((t) => t.targetElement !== e))
            })
        }),
        void 0 === (r = 'function' == typeof o ? o.apply(t, a) : o) ||
          (e.exports = r)
    },
    470048: (e) => {
      e.exports = {
        wrapper: 'wrapper-GZajBGIm',
        input: 'input-GZajBGIm',
        box: 'box-GZajBGIm',
        icon: 'icon-GZajBGIm',
        noOutline: 'noOutline-GZajBGIm',
        'intent-danger': 'intent-danger-GZajBGIm',
        check: 'check-GZajBGIm',
        dot: 'dot-GZajBGIm',
      }
    },
    357222: (e) => {
      e.exports = {
        button: 'button-Rc93kXa8',
        bordersVisible: 'bordersVisible-Rc93kXa8',
        selected: 'selected-Rc93kXa8',
      }
    },
    517723: (e) => {
      e.exports = { footer: 'footer-dwINHZFL' }
    },
    785286: (e) => {
      e.exports = {
        wrap: 'wrap-oc7l8ZQg',
        header: 'header-oc7l8ZQg',
        item: 'item-oc7l8ZQg',
      }
    },
    344467: (e) => {
      e.exports = { label: 'label-lVJKBKVk' }
    },
    678724: (e) => {
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
    610341: (e) => {
      e.exports = {
        dialog: 'dialog-IKuIIugL',
        tabletDialog: 'tabletDialog-IKuIIugL',
        desktopDialog: 'desktopDialog-IKuIIugL',
      }
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
    408323: (e, t, o) => {
      o.d(t, { CheckboxInput: () => d })
      var a = o(50959),
        r = o(497754),
        n = o(800417),
        l = o(72571),
        s = o(465890),
        i = o(470048),
        c = o.n(i)
      function d(e) {
        const t = r(c().box, c()[`intent-${e.intent}`], {
            [c().check]: !Boolean(e.indeterminate),
            [c().dot]: Boolean(e.indeterminate),
            [c().noOutline]: -1 === e.tabIndex,
          }),
          o = r(c().wrapper, e.className)
        return a.createElement(
          'span',
          { className: o, title: e.title, style: e.style },
          a.createElement('input', {
            id: e.id,
            tabIndex: e.tabIndex,
            className: c().input,
            type: 'checkbox',
            name: e.name,
            checked: e.checked,
            disabled: e.disabled,
            value: e.value,
            autoFocus: e.autoFocus,
            role: e.role,
            onChange: () => {
              e.onChange && e.onChange(e.value)
            },
            ref: e.reference,
            'aria-required': e['aria-required'],
            'aria-describedby': e['aria-describedby'],
            'aria-invalid': e['aria-invalid'],
            ...(0, n.filterDataProps)(e),
          }),
          a.createElement(
            'span',
            { className: t },
            a.createElement(l.Icon, { icon: s, className: c().icon }),
          ),
        )
      }
    },
    975228: (e, t, o) => {
      o.d(t, {
        hoverMouseEventFilter: () => n,
        useAccurateHover: () => l,
        useHover: () => r,
      })
      var a = o(50959)
      function r() {
        const [e, t] = (0, a.useState)(!1)
        return [
          e,
          {
            onMouseOver: (e) => {
              n(e) && t(!0)
            },
            onMouseOut: (e) => {
              n(e) && t(!1)
            },
          },
        ]
      }
      function n(e) {
        return !e.currentTarget.contains(e.relatedTarget)
      }
      function l(e) {
        const [t, o] = (0, a.useState)(!1)
        return (
          (0, a.useEffect)(() => {
            const t = (t) => {
              if (null === e.current) return
              const a = e.current.contains(t.target)
              o(a)
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
    438980: (e, t, o) => {
      o.d(t, { Measure: () => r })
      var a = o(664332)
      function r(e) {
        const { children: t, onResize: o } = e
        return t((0, a.useResizeObserver)(o || (() => {}), [null === o]))
      }
    },
    366171: (e, t, o) => {
      o.d(t, { SymbolSearchDialogFooter: () => s })
      var a = o(50959),
        r = o(497754),
        n = o.n(r),
        l = o(517723)
      function s(e) {
        const { className: t, children: o } = e
        return a.createElement('div', { className: n()(l.footer, t) }, o)
      }
    },
    384989: (e, t, o) => {
      o.r(t), o.d(t, { getCompareDialogRenderer: () => le })
      var a = o(50959),
        r = o(609838),
        n = o(972535),
        l = o(156963),
        s = o(265831),
        i = o(497754),
        c = o.n(i),
        d = o(650151),
        u = o(72571),
        m = o(742554),
        h = o(297265),
        p = o(132455),
        v = o(651049),
        b = o(702054),
        f = o(438980),
        y = o(944080),
        g = o(56871)
      const S = a.createContext(null)
      var _ = o(522224),
        k = o(840976)
      const x = a.createContext(null)
      var I = o(192063),
        w = o(759339),
        C = o(163694),
        N = o(357222)
      function E(e) {
        const {
          theme: t = N,
          children: o,
          onClick: r,
          isSelected: n,
          areBordersVisible: l,
          isItemSelected: s,
          className: i,
          value: d,
          name: u,
        } = e
        return a.createElement(
          'button',
          {
            type: 'button',
            className: c()(
              i,
              t.button,
              n && t.selected,
              l && !n && !s && t.bordersVisible,
            ),
            name: u,
            value: d,
            onClick: r,
          },
          o,
        )
      }
      function z(e) {
        const { value: t, onClick: o, ...r } = e,
          n = (0, a.useCallback)((e) => o(t, e), [t, o])
        return a.createElement(E, { ...r, value: String(t), onClick: n })
      }
      var M = o(6519)
      function D(e) {
        const { compareModel: t, selectedCompareOptionIndex: n } = (0,
          k.useEnsuredContext)(S),
          l = t.comparableOnSameScale({ isYield: e }),
          s = (0, a.useMemo)(
            () =>
              ((e) => [
                {
                  label: e
                    ? r.t(null, void 0, o(17547))
                    : r.t(null, void 0, o(882642)),
                  compareOption: e
                    ? M.CompareOption.SameScale
                    : M.CompareOption.SamePctScale,
                },
                {
                  label: r.t(null, void 0, o(534420)),
                  compareOption: M.CompareOption.NewPriceScale,
                },
                {
                  label: r.t(null, void 0, o(167242)),
                  compareOption: M.CompareOption.NewPane,
                },
              ])(l),
            [l],
          )
        return [
          (0, a.useMemo)(() => {
            var e, t
            return null !==
              (t =
                null === (e = s[n]) || void 0 === e
                  ? void 0
                  : e.compareOption) && void 0 !== t
              ? t
              : s[0].compareOption
          }, [s, n]),
          s,
        ]
      }
      var L = o(785286)
      function T(e) {
        const {
            fullSymbolName: t,
            isSelected: n,
            className: l,
            isYield: i,
          } = e,
          {
            isMobile: d,
            searchRef: u,
            setMode: m,
          } = (0, k.useEnsuredContext)(y.SymbolSearchItemsDialogContext),
          {
            compareModel: h,
            setHoveredItemId: p,
            clearInput: v,
            allowExtendTimeScale: b,
          } = (0, k.useEnsuredContext)(S),
          { callback: f } = (0, k.useEnsuredContext)(x),
          [g, _] = D(i)
        return d
          ? a.createElement(
              C.DrawerManager,
              null,
              a.createElement(
                w.Drawer,
                { position: 'Bottom', onClose: N.bind(null, !1) },
                a.createElement(
                  'div',
                  { className: L.header },
                  r.t(null, void 0, o(279589)),
                ),
                _.map(({ label: e, compareOption: t }) =>
                  a.createElement(I.PopupMenuItem, {
                    key: t,
                    className: L.item,
                    onClick: E,
                    onClickArg: t,
                    label: e,
                  }),
                ),
              ),
            )
          : a.createElement(
              'div',
              {
                className: c()(L.wrap, l),
                'data-name': 'compare-buttons-group',
              },
              _.map(({ label: e, compareOption: t }) =>
                a.createElement(
                  z,
                  {
                    key: t,
                    onClick: E,
                    value: t,
                    isItemSelected: Boolean(n),
                    isSelected: n && g === t,
                  },
                  e,
                ),
              ),
            )
        function N(e) {
          d && f && f(), v && e && v(u, m)
        }
        function E(e, o) {
          if ((o.preventDefault(), h && t && void 0 !== e)) {
            ;(0, s.getSymbolSearchCompleteOverrideFunction)()(t).then((t) => {
              h.applyStudy(t.symbol, e, b), p(''), N(!0)
            })
          }
        }
      }
      function A(e) {
        const {
            isSelected: t,
            fullSymbolName: o,
            onExpandClick: r,
            actions: l,
            id: i,
            isOffset: c,
            isYield: d,
          } = e,
          {
            isMobile: u,
            toggleExpand: m,
            searchSpreads: h,
            searchRef: p,
            setMode: v,
            mode: b,
          } = (0, k.useEnsuredContext)(y.SymbolSearchItemsDialogContext),
          {
            compareModel: f,
            hoveredItemId: I,
            setHoveredItemId: w,
            clearInput: C,
            allowExtendTimeScale: N,
          } = (0, k.useEnsuredContext)(S),
          [E, z] = (0, a.useState)(!1),
          D = (0, a.useRef)(null),
          L = (0, _.useAccurateHover)(D),
          A = (0, a.useMemo)(() => ({ callback: H }), [H]),
          j = !Boolean(r) && !Boolean(l),
          B = i === I
        return a.createElement(
          x.Provider,
          { value: A },
          a.createElement(g.SymbolSearchDialogContentItem, {
            hideMarkedListFlag: 'compare' === b,
            ...e,
            reference: D,
            onClick: (t) => {
              if (Boolean(r) && i && !c)
                return null == t || t.preventDefault(), void m(i)
              if (!E && u) return void z(!0)
              if (h && e.onClick) return void e.onClick(t)
              if ((n.mobiletouch ? B : !E) && o) {
                ;(0, s.getSymbolSearchCompleteOverrideFunction)()(o).then(
                  (e) => {
                    const t = f.comparableOnSameScale({ isYield: d })
                      ? M.CompareOption.SameScale
                      : M.CompareOption.SamePctScale
                    f.applyStudy(e.symbol, t, N)
                  },
                ),
                  w(''),
                  C && C(p, v)
              }
              n.mobiletouch && !u && !B && i && w(i)
            },
            hoverComponent: (() => {
              if (!j) return !1
              if (u) return E
              if (n.mobiletouch) return B
              return Boolean(L || t)
            })()
              ? T
              : void 0,
          }),
        )
        function H() {
          z(!1)
        }
      }
      var j = o(915550),
        B = o(193986),
        H = o(339750),
        P = o(678724)
      function R(e) {
        const { handleListWidth: t } = (0, d.ensureNotNull)(
            (0, a.useContext)(y.SymbolSearchItemsDialogContext),
          ),
          {
            compareModel: n,
            selectedCompareIndex: l,
            selectedItemRef: s,
          } = (0, d.ensureNotNull)((0, a.useContext)(S)),
          i = (0, h.useWatchedValueReadonly)({ watchedValue: n.isDataReady() }),
          _ = (0, h.useWatchedValueReadonly)({ watchedValue: n.studies() }),
          k = (0, h.useWatchedValueReadonly)({
            watchedValue: n.highlightedSymbol(),
          }),
          x = (0, a.useMemo)(() => _.filter((e) => e.checked), [_]),
          I = (0, a.useMemo)(() => _.filter((e) => !e.checked), [_])
        return (
          (0, a.useEffect)(
            () => (
              n
                .chartModel()
                .dataSourceCollectionChanged()
                .subscribe(n, n.handleSourcesChange),
              () =>
                n
                  .chartModel()
                  .dataSourceCollectionChanged()
                  .unsubscribe(n, n.handleSourcesChange)
            ),
            [n],
          ),
          a.createElement(
            f.Measure,
            {
              onResize: ([e]) => {
                t(e.contentRect.width)
              },
            },
            (e) =>
              a.createElement(
                m.TouchScrollContainer,
                { className: P.scrollable, ref: e },
                (() => {
                  if (!i)
                    return a.createElement(
                      'div',
                      { className: P.spinnerWrap },
                      a.createElement(p.Spinner, null),
                    )
                  if (!Boolean(x.length) && !Boolean(I.length)) {
                    const e = b.watchedTheme.value() === v.StdTheme.Dark ? B : j
                    return a.createElement(
                      'div',
                      { className: P.emptyState },
                      a.createElement(u.Icon, { className: P.image, icon: e }),
                      a.createElement(
                        'div',
                        { className: P.text },
                        r.t(null, void 0, o(542078)),
                      ),
                    )
                  }
                  return a.createElement(
                    a.Fragment,
                    null,
                    Boolean(x.length) &&
                      a.createElement(
                        a.Fragment,
                        null,
                        a.createElement(
                          'div',
                          { className: P.heading },
                          r.t(null, void 0, o(646580)),
                        ),
                        x.map((e, t) =>
                          a.createElement(g.SymbolSearchDialogContentItem, {
                            'data-role': 'added-symbol-item',
                            className: P.item,
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
                            onClick: w.bind(null, e),
                            isHighlighted: e.id === k,
                            isSelected: C(e),
                            itemRef: C(e) ? s : void 0,
                            isYield: e.isYield,
                            actions: a.createElement(
                              'div',
                              { className: P.checkboxWrap },
                              a.createElement(
                                E,
                                {
                                  className: P.checkbox,
                                  onClick: w.bind(null, e),
                                  isSelected: C(e),
                                },
                                a.createElement(u.Icon, { icon: H }),
                              ),
                            ),
                          }),
                        ),
                      ),
                    Boolean(I.length) &&
                      a.createElement(
                        a.Fragment,
                        null,
                        a.createElement(
                          'div',
                          { className: P.heading },
                          r.t(null, void 0, o(957570)),
                        ),
                        I.map((e) =>
                          a.createElement(A, {
                            'data-role': 'recent-symbol-item',
                            className: c()(P.item, e.id === k && P.highlighted),
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
                            isSelected: C(e),
                            itemRef: C(e) ? s : void 0,
                            isYield: e.isYield,
                          }),
                        ),
                      ),
                  )
                })(),
              ),
          )
        )
        function w(e, t) {
          null == t || t.preventDefault(), n.removeStudy(e)
        }
        function C(e) {
          return _.indexOf(e) === l
        }
      }
      var O = o(870122)
      class F extends a.PureComponent {
        constructor(e) {
          super(e),
            (this._selectedItemRef = a.createRef()),
            (this._getContextValue = () => {
              const { compareModel: e } = this.props,
                {
                  selectedCompareOptionIndex: t,
                  selectedCompareIndex: o,
                  hoveredItemId: a,
                  allowExtendTimeScale: r,
                } = this.state
              return {
                compareModel: e,
                selectedCompareOptionIndex: t,
                setSelectedCompareOptionIndex:
                  this._setSelectedCompareOptionIndex,
                hoveredItemId: a,
                setHoveredItemId: this._setHoveredItemId,
                selectedCompareIndex: o,
                setSelectedCompareIndex: this._setSelectedCompareIndex,
                selectedItemRef: this._selectedItemRef,
                clearInput: this._clearInput,
                allowExtendTimeScale: r,
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
              O.setValue('showAddSymbolDialog.extendCheckboxState', e),
                this.setState({ allowExtendTimeScale: e })
            }),
            (this.state = {
              selectedCompareOptionIndex: 0,
              selectedCompareIndex: -1,
              hoveredItemId: void 0,
              allowExtendTimeScale: Boolean(
                O.getBool('showAddSymbolDialog.extendCheckboxState'),
              ),
            })
        }
        render() {
          const { children: e } = this.props
          return a.createElement(
            S.Provider,
            { value: this._getContextValue() },
            e,
          )
        }
      }
      var W = o(180185),
        U = o(533408),
        Y = o(892932),
        K = o(610341)
      function V(e) {
        const {
            openedItems: t,
            searchRef: o,
            feedItems: r,
            selectedIndex: n,
            toggleExpand: l,
            onSearchComplete: s,
            mode: c,
            setMode: d,
            setSelectedIndex: u,
            isMobile: m,
            isTablet: p,
            onClose: v,
            upperCaseEnabled: b,
            symbolSearchState: f,
          } = (0, k.useEnsuredContext)(y.SymbolSearchItemsDialogContext),
          {
            compareModel: g,
            hoveredItemId: _,
            setHoveredItemId: x,
            selectedCompareOptionIndex: I,
            setSelectedCompareOptionIndex: w,
            selectedCompareIndex: C,
            setSelectedCompareIndex: N,
            selectedItemRef: E,
            clearInput: z,
            allowExtendTimeScale: M,
          } = (0, k.useEnsuredContext)(S),
          L = (0, h.useWatchedValueReadonly)({ watchedValue: g.studies() }),
          T = r[n],
          A = 'compare' === c,
          j = 'exchange' === c,
          B = A ? C : n,
          H = A ? L : r,
          P = H[B],
          [R, O] = D(null == P ? void 0 : P.isYield)
        return (
          (0, a.useEffect)(() => {
            _ && x(''), C && N(-1)
          }, [c]),
          a.createElement(U.AdaptivePopupDialog, {
            ...e,
            className: i(
              K.dialog,
              !m && (p ? K.tabletDialog : K.desktopDialog),
            ),
            onKeyDown: (e) => {
              var a
              const r = (0, W.hashFromEvent)(e)
              switch (r) {
                case 13: {
                  if (A)
                    return void (() => {
                      if (-1 === C) return
                      const e = L[C]
                      e.checked
                        ? g.removeStudy(e)
                        : g.applyStudy(e.symbol, R, M)
                      N(-1)
                    })()
                  const t = q()
                  if (t) return e.preventDefault(), void l(t)
                  e.preventDefault()
                  const r =
                    null === (a = null == o ? void 0 : o.current) ||
                    void 0 === a
                      ? void 0
                      : a.value.trim()
                  return void (
                    r &&
                    z &&
                    (s([
                      {
                        symbol: b ? r.toUpperCase() : r,
                        resolved: !1,
                        compareOption: R,
                        allowExtendTimeScale: M,
                      },
                    ]),
                    z(o, d))
                  )
                }
                case 27:
                  return (
                    e.preventDefault(), j ? void d('symbolSearch') : void v()
                  )
              }
              if (!A && 'good' !== f) return
              switch ((0, Y.mapKeyCodeToDirection)(r)) {
                case 'blockPrev':
                  if ((e.preventDefault(), 0 === B)) return
                  if (-1 === B) return void F(0)
                  F(B - 1)
                  break
                case 'blockNext':
                  if ((e.preventDefault(), B === H.length - 1)) return
                  F(B + 1)
                  break
                case 'inlinePrev': {
                  const o = q()
                  if (o && t.has(o)) return e.preventDefault(), void l(o)
                  if (!I || o) return
                  e.preventDefault(), w(I - 1)
                  break
                }
                case 'inlineNext': {
                  const o = q()
                  if (o && !t.has(o)) return e.preventDefault(), void l(o)
                  if (I === O.length - 1 || o) return
                  e.preventDefault(), w(I + 1)
                  break
                }
              }
            },
            dataName: 'compare-dialog',
            draggable: !0,
          })
        )
        function F(e) {
          A ? N(e, V) : u(e)
        }
        function V() {
          var e
          null === (e = E.current) ||
            void 0 === e ||
            e.scrollIntoView({ block: 'nearest' })
        }
        function q() {
          if (!T) return
          const { id: e, isOffset: t, onExpandClick: o } = T
          return !t && Boolean(o) && e ? e : void 0
        }
      }
      var q = o(500962),
        Z = o(121087),
        G = o(19406)
      class J extends G.DialogRenderer {
        constructor(e) {
          super(), (this._props = e)
        }
        show(e) {
          if (this.visible().value()) return
          const t = a.createElement(Z.SymbolSearchItemsDialog, {
            ...this._props,
            shouldReturnFocus: null == e ? void 0 : e.shouldReturnFocus,
            initialMode: this._props.initialMode || 'symbolSearch',
            onClose: () => this.hide(),
          })
          q.render(t, this._container), this._setVisibility(!0)
        }
        hide() {
          var e, t
          q.unmountComponentAtNode(this._container),
            this._visibility.setValue(!1),
            null === (t = (e = this._props).onClose) ||
              void 0 === t ||
              t.call(e)
        }
      }
      var X = o(721167),
        Q = o(231862),
        $ = o(159223)
      function ee(e) {
        const { searchRef: t, setMode: o } = (0, k.useEnsuredContext)(
            y.SymbolSearchItemsDialogContext,
          ),
          { currentMode: r } = (0, k.useEnsuredContext)(
            $.SymbolSearchDialogBodyContext,
          )
        return (
          (0, a.useEffect)(() => {
            const e = t.current
            if (e)
              return (
                e.addEventListener('input', n),
                () => {
                  e && e.removeEventListener('input', n)
                }
              )
          }, []),
          a.createElement(Q.DialogSearch, { ...e })
        )
        function n() {
          var e, a, n, l
          t.current &&
            r &&
            ('compare' !== r.current ||
            '' ===
              (null ===
                (a =
                  null === (e = null == t ? void 0 : t.current) || void 0 === e
                    ? void 0
                    : e.value) || void 0 === a
                ? void 0
                : a.trim())
              ? 'symbolSearch' === r.current &&
                '' ===
                  (null ===
                    (l =
                      null === (n = null == t ? void 0 : t.current) ||
                      void 0 === n
                        ? void 0
                        : n.value) || void 0 === l
                    ? void 0
                    : l.trim()) &&
                o('compare')
              : o('symbolSearch'))
        }
      }
      var te = o(408323),
        oe = o(366171),
        ae = o(344467)
      function re(e) {
        const { allowExtendTimeScale: t, toggleAllowExtendTimeScale: n } = (0,
        d.ensureNotNull)((0, a.useContext)(S))
        return a.createElement(
          oe.SymbolSearchDialogFooter,
          null,
          a.createElement(
            'label',
            { 'data-name': 'allow-extend-time-scale-checkbox' },
            a.createElement(te.CheckboxInput, {
              checked: t,
              value: t ? 'on' : 'off',
              onChange: n,
            }),
            a.createElement(
              'span',
              { className: ae.label },
              r.t(null, void 0, o(471046)),
            ),
          ),
        )
      }
      const ne = l.enabled('secondary_series_extend_time_scale')
      function le(e) {
        return new J({
          wrapper:
            ((t = e), (e) => a.createElement(F, { ...e, compareModel: t })),
          dialog: V,
          contentItem: A,
          initialScreen: R,
          searchInput: ee,
          footer: ne ? a.createElement(re) : void 0,
          initialMode: 'compare',
          dialogTitle: r.t(null, void 0, o(822320)),
          autofocus: !n.mobiletouch,
          dialogWidth: 'fixed',
          onSearchComplete: (t) => {
            const { compareOption: o, allowExtendTimeScale: a } = t[0]
            if (void 0 !== o) {
              ;(0, s.getSymbolSearchCompleteOverrideFunction)()(
                t[0].symbol,
                t[0].result,
              ).then((t) => {
                e.applyStudy(t.symbol, o, a)
              })
            }
          },
          symbolTypes: (0, X.getAvailableSymbolTypes)(),
          showSpreadActions:
            l.enabled('show_spread_operators') &&
            l.enabled('compare_symbol_search_spread_operators'),
        })
        var t
      }
    },
    6519: (e, t, o) => {
      var a
      o.d(t, { CompareOption: () => a }),
        ((e) => {
          ;(e[(e.SamePctScale = 0)] = 'SamePctScale'),
            (e[(e.NewPriceScale = 1)] = 'NewPriceScale'),
            (e[(e.NewPane = 2)] = 'NewPane'),
            (e[(e.SameScale = 3)] = 'SameScale')
        })(a || (a = {}))
    },
    163694: (e, t, o) => {
      o.d(t, { DrawerContext: () => l, DrawerManager: () => n })
      var a = o(50959),
        r = o(285089)
      class n extends a.PureComponent {
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
          return a.createElement(
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
      const l = a.createContext(null)
    },
    759339: (e, t, o) => {
      o.d(t, { Drawer: () => m })
      var a = o(50959),
        r = o(650151),
        n = o(497754),
        l = o(189904),
        s = o(813113),
        i = o(163694),
        c = o(28466),
        d = o(742554),
        u = o(966076)
      function m(e) {
        const {
            position: t = 'Bottom',
            onClose: o,
            children: d,
            className: m,
            theme: p = u,
          } = e,
          v = (0, r.ensureNotNull)((0, a.useContext)(i.DrawerContext)),
          [b] = (0, a.useState)(() => (0, l.randomHash)()),
          f = (0, a.useRef)(null),
          y = (0, a.useContext)(c.CloseDelegateContext)
        return (
          (0, a.useLayoutEffect)(
            () => (
              (0, r.ensureNotNull)(f.current).focus({ preventScroll: !0 }),
              y.subscribe(v, o),
              v.addDrawer(b),
              () => {
                v.removeDrawer(b), y.unsubscribe(v, o)
              }
            ),
            [],
          ),
          a.createElement(
            s.Portal,
            null,
            a.createElement(
              'div',
              { className: n(u.wrap, u[`position${t}`]) },
              b === v.currentDrawer &&
                a.createElement('div', { className: u.backdrop, onClick: o }),
              a.createElement(
                h,
                {
                  className: n(p.drawer, u[`position${t}`], m),
                  ref: f,
                  'data-name': e['data-name'],
                },
                d,
              ),
            ),
          )
        )
      }
      const h = (0, a.forwardRef)((e, t) => {
        const { className: o, ...r } = e
        return a.createElement(d.TouchScrollContainer, {
          className: n(u.drawer, o),
          tabIndex: -1,
          ref: t,
          ...r,
        })
      })
    },
    522224: (e, t, o) => {
      o.d(t, {
        hoverMouseEventFilter: () => a.hoverMouseEventFilter,
        useAccurateHover: () => a.useAccurateHover,
        useHover: () => a.useHover,
      })
      var a = o(975228)
    },
    192063: (e, t, o) => {
      o.d(t, {
        DEFAULT_POPUP_MENU_ITEM_THEME: () => c,
        PopupMenuItem: () => u,
      })
      var a = o(50959),
        r = o(497754),
        n = o(32133),
        l = o(370981),
        s = o(636080),
        i = o(671986)
      const c = i
      function d(e) {
        e.stopPropagation()
      }
      function u(e) {
        const {
            id: t,
            role: o,
            className: c,
            title: u,
            labelRowClassName: m,
            labelClassName: h,
            toolboxClassName: p,
            shortcut: v,
            forceShowShortcuts: b,
            icon: f,
            iconClassname: y,
            isActive: g,
            isDisabled: S,
            isHovered: _,
            appearAsDisabled: k,
            label: x,
            link: I,
            showToolboxOnHover: w,
            showToolboxOnFocus: C,
            target: N,
            rel: E,
            toolbox: z,
            reference: M,
            onMouseOut: D,
            onMouseOver: L,
            onKeyDown: T,
            suppressToolboxClick: A = !0,
            theme: j = i,
            tabIndex: B,
            tagName: H,
            renderComponent: P,
            roundedIcon: R,
            iconAriaProps: O,
            circleLogo: F,
            dontClosePopup: W,
            onClick: U,
            onClickArg: Y,
            trackEventObject: K,
            trackMouseWheelClick: V,
            trackRightClick: q,
            ...Z
          } = e,
          G = (0, a.useRef)(null),
          J = (0, a.useMemo)(
            () =>
              ((e) => {
                function t(t) {
                  const { reference: o, ...r } = t,
                    n = null != e ? e : r.href ? 'a' : 'div',
                    l =
                      'a' === n
                        ? r
                        : ((e) => {
                            const {
                              download: t,
                              href: o,
                              hrefLang: a,
                              media: r,
                              ping: n,
                              rel: l,
                              target: s,
                              type: i,
                              referrerPolicy: c,
                              ...d
                            } = e
                            return d
                          })(r)
                  return a.createElement(n, { ...l, ref: o })
                }
                return (t.displayName = `DefaultComponent(${e})`), t
              })(H),
            [H],
          ),
          X = null != P ? P : J
        return a.createElement(
          X,
          {
            ...Z,
            id: t,
            role: o,
            className: r(c, j.item, f && j.withIcon, {
              [j.isActive]: g,
              [j.isDisabled]: S || k,
              [j.hovered]: _,
            }),
            title: u,
            href: I,
            target: N,
            rel: E,
            reference: (e) => {
              ;(G.current = e), 'function' == typeof M && M(e)
              'object' == typeof M && (M.current = e)
            },
            onClick: (e) => {
              if (S) return
              K && (0, n.trackEvent)(K.category, K.event, K.label)
              U && U(Y, e)
              W || (0, l.globalCloseMenu)()
            },
            onContextMenu: (e) => {
              K &&
                q &&
                (0, n.trackEvent)(K.category, K.event, `${K.label}_rightClick`)
            },
            onMouseUp: (e) => {
              if (1 === e.button && I && K) {
                let e = K.label
                V && (e += '_mouseWheelClick'),
                  (0, n.trackEvent)(K.category, K.event, e)
              }
            },
            onMouseOver: L,
            onMouseOut: D,
            onKeyDown: T,
            tabIndex: B,
          },
          F &&
            a.createElement(s.CircleLogo, {
              ...O,
              className: i['disclosure-item-circle-logo'],
              size: 'xxxsmall',
              logoUrl: F.logoUrl,
              placeholderLetter: F.placeholderLetter,
            }),
          f &&
            a.createElement('span', {
              'aria-label': O && O['aria-label'],
              'aria-hidden': O && Boolean(O['aria-hidden']),
              className: r(j.icon, R && i['round-icon'], y),
              dangerouslySetInnerHTML: { __html: f },
            }),
          a.createElement(
            'span',
            { className: r(j.labelRow, m) },
            a.createElement('span', { className: r(j.label, h) }, x),
          ),
          (void 0 !== v || b) &&
            a.createElement(
              'span',
              { className: j.shortcut },
              (Q = v) && Q.split('+').join(' + '),
            ),
          void 0 !== z &&
            a.createElement(
              'span',
              {
                onClick: A ? d : void 0,
                className: r(p, j.toolbox, {
                  [j.showOnHover]: w,
                  [j.showOnFocus]: C,
                }),
              },
              z,
            ),
        )
        var Q
      }
    },
    28466: (e, t, o) => {
      o.d(t, { CloseDelegateContext: () => n })
      var a = o(50959),
        r = o(370981)
      const n = a.createContext(r.globalCloseDelegate)
    },
    742554: (e, t, o) => {
      o.d(t, { TouchScrollContainer: () => s })
      var a = o(50959),
        r = o(259142),
        n = o(650151),
        l = o(601227)
      const s = (0, a.forwardRef)((e, t) => {
        const { children: o, ...n } = e,
          s = (0, a.useRef)(null)
        return (
          (0, a.useImperativeHandle)(t, () => s.current),
          (0, a.useLayoutEffect)(() => {
            if (l.CheckMobile.iOS())
              return (
                null !== s.current &&
                  (0, r.disableBodyScroll)(s.current, { allowTouchMove: i(s) }),
                () => {
                  null !== s.current && (0, r.enableBodyScroll)(s.current)
                }
              )
          }, []),
          a.createElement('div', { ref: s, ...n }, o)
        )
      })
      function i(e) {
        return (t) => {
          const o = (0, n.ensureNotNull)(e.current),
            a = document.activeElement
          return (
            !o.contains(t) || (null !== a && o.contains(a) && a.contains(t))
          )
        }
      }
    },
    602948: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M3.92 7.83 9 12.29l5.08-4.46-1-1.13L9 10.29l-4.09-3.6-.99 1.14Z"/></svg>'
    },
    465890: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 9" width="11" height="9" fill="none"><path stroke-width="2" d="M0.999878 4L3.99988 7L9.99988 1"/></svg>'
    },
    339750: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M7 15l5 5L23 9"/></svg>'
    },
    193986: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 121 120" width="121" height="120"><path fill="#D1D4DC" d="M53.88 18.36a43.4 43.4 0 0 1 11.24 0 1 1 0 0 0 .26-1.98 45.42 45.42 0 0 0-11.76 0 1 1 0 1 0 .26 1.98zM43.04 21.26a1 1 0 0 0-.77-1.85A44.95 44.95 0 0 0 32.1 25.3a1 1 0 0 0 1.22 1.58 42.95 42.95 0 0 1 9.72-5.62zM75.42 19.96a1 1 0 0 1 1.3-.55A44.95 44.95 0 0 1 86.9 25.3a1 1 0 0 1-1.22 1.58 42.95 42.95 0 0 0-9.72-5.62 1 1 0 0 1-.54-1.3zM25.38 34.82a1 1 0 1 0-1.58-1.22 44.95 44.95 0 0 0-5.89 10.17 1 1 0 0 0 1.85.77 42.95 42.95 0 0 1 5.62-9.72zM16.86 55.38a1 1 0 0 0-1.98-.26 45.42 45.42 0 0 0 0 11.76 1 1 0 1 0 1.98-.26 43.4 43.4 0 0 1 0-11.24zM103 54.26a1 1 0 0 1 1.12.86 45.4 45.4 0 0 1 0 11.76 1 1 0 0 1-1.98-.26 43.37 43.37 0 0 0 0-11.24 1 1 0 0 1 .86-1.12zM19.76 77.46a1 1 0 0 0-1.85.77A44.95 44.95 0 0 0 23.8 88.4a1 1 0 0 0 1.58-1.22 42.95 42.95 0 0 1-5.62-9.72zM100.54 76.92a1 1 0 0 1 .54 1.3A44.95 44.95 0 0 1 95.2 88.4a1 1 0 0 1-1.58-1.22 42.95 42.95 0 0 0 5.62-9.72 1 1 0 0 1 1.3-.54zM33.32 95.12a1 1 0 1 0-1.22 1.58 44.94 44.94 0 0 0 10.17 5.88 1 1 0 0 0 .77-1.84 42.97 42.97 0 0 1-9.72-5.62zM87.08 95.3a1 1 0 0 1-.18 1.4 44.94 44.94 0 0 1-10.17 5.88 1 1 0 0 1-.77-1.84 42.98 42.98 0 0 0 9.72-5.62 1 1 0 0 1 1.4.18zM53.88 103.64a1 1 0 0 0-.26 1.98 45.4 45.4 0 0 0 11.76 0 1 1 0 0 0-.26-1.98 43.37 43.37 0 0 1-11.24 0zM62.81 53.17a1 1 0 0 0-.78 1.84 6.62 6.62 0 0 1 3.49 3.5 1 1 0 1 0 1.84-.78 8.62 8.62 0 0 0-4.55-4.56z"/><path fill="#D1D4DC" d="M45.5 61a14 14 0 1 1 24.28 9.5l7.92 7.92a1 1 0 0 1-1.42 1.42l-7.96-7.97A14 14 0 0 1 45.5 61zm14-12a12 12 0 1 0 0 24 12 12 0 0 0 0-24z"/><circle fill="#1976D2" cx="97.5" cy="39" r="13"/><path fill="#D1D4DC" d="M98.5 34a1 1 0 1 0-2 0v4h-4a1 1 0 1 0 0 2h4v4a1 1 0 1 0 2 0v-4h4a1 1 0 0 0 0-2h-4v-4z"/></svg>'
    },
    915550: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 121 120" width="121" height="120"><path fill="#1E222D" d="M53.88 18.36a43.4 43.4 0 0 1 11.24 0 1 1 0 0 0 .26-1.98 45.42 45.42 0 0 0-11.76 0 1 1 0 1 0 .26 1.98zM43.04 21.26a1 1 0 0 0-.77-1.85A44.95 44.95 0 0 0 32.1 25.3a1 1 0 0 0 1.22 1.58 42.95 42.95 0 0 1 9.72-5.62zM75.42 19.96a1 1 0 0 1 1.3-.55A44.95 44.95 0 0 1 86.9 25.3a1 1 0 0 1-1.22 1.58 42.95 42.95 0 0 0-9.72-5.62 1 1 0 0 1-.54-1.3zM25.38 34.82a1 1 0 1 0-1.58-1.22 44.95 44.95 0 0 0-5.89 10.17 1 1 0 0 0 1.85.77 42.95 42.95 0 0 1 5.62-9.72zM16.86 55.38a1 1 0 0 0-1.98-.26 45.42 45.42 0 0 0 0 11.76 1 1 0 1 0 1.98-.26 43.4 43.4 0 0 1 0-11.24zM103 54.26a1 1 0 0 1 1.12.86 45.4 45.4 0 0 1 0 11.76 1 1 0 0 1-1.98-.26 43.37 43.37 0 0 0 0-11.24 1 1 0 0 1 .86-1.12zM19.76 77.46a1 1 0 0 0-1.85.77A44.95 44.95 0 0 0 23.8 88.4a1 1 0 0 0 1.58-1.22 42.95 42.95 0 0 1-5.62-9.72zM100.54 76.92a1 1 0 0 1 .54 1.3A44.95 44.95 0 0 1 95.2 88.4a1 1 0 0 1-1.58-1.22 42.95 42.95 0 0 0 5.62-9.72 1 1 0 0 1 1.3-.54zM33.32 95.12a1 1 0 1 0-1.22 1.58 44.94 44.94 0 0 0 10.17 5.88 1 1 0 0 0 .77-1.84 42.97 42.97 0 0 1-9.72-5.62zM87.08 95.3a1 1 0 0 1-.18 1.4 44.94 44.94 0 0 1-10.17 5.88 1 1 0 0 1-.77-1.84 42.98 42.98 0 0 0 9.72-5.62 1 1 0 0 1 1.4.18zM53.88 103.64a1 1 0 0 0-.26 1.98 45.4 45.4 0 0 0 11.76 0 1 1 0 0 0-.26-1.98 43.37 43.37 0 0 1-11.24 0zM62.81 53.17a1 1 0 0 0-.78 1.84 6.62 6.62 0 0 1 3.49 3.5 1 1 0 1 0 1.84-.78 8.62 8.62 0 0 0-4.55-4.56z"/><path fill="#1E222D" d="M45.5 61a14 14 0 1 1 24.28 9.5l7.92 7.92a1 1 0 0 1-1.42 1.42l-7.96-7.97A14 14 0 0 1 45.5 61zm14-12a12 12 0 1 0 0 24 12 12 0 0 0 0-24z"/><circle fill="#2196F3" cx="97.5" cy="39" r="13"/><path fill="#fff" d="M98.5 34a1 1 0 1 0-2 0v4h-4a1 1 0 1 0 0 2h4v4a1 1 0 1 0 2 0v-4h4a1 1 0 0 0 0-2h-4v-4z"/></svg>'
    },
    716936: (e) => {
      e.exports = {
        ar: ['عودة'],
        ca_ES: ['Enrere'],
        cs: 'Back',
        de: ['Zurück'],
        el: 'Back',
        en: 'Back',
        es: ['Atrás'],
        fa: 'Back',
        fr: ['Retour'],
        he_IL: ['חזור'],
        hu_HU: 'Back',
        id_ID: ['Kembali'],
        it: ['Indietro'],
        ja: ['戻る'],
        ko: ['뒤로'],
        ms_MY: ['Kembali'],
        nl_NL: 'Back',
        pl: ['Cofnij'],
        pt: ['Voltar'],
        ro: 'Back',
        ru: ['Назад'],
        sv: ['Tillbaka'],
        th: ['กลับไป'],
        tr: ['Geri'],
        vi: ['Quay lại'],
        zh: ['返回'],
        zh_TW: ['返回'],
      }
    },
    709898: (e) => {
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
    822320: (e) => {
      e.exports = {
        ar: ['مقارنة الرمز'],
        ca_ES: ['Compara el símbol'],
        cs: 'Compare symbol',
        de: ['Symbol vergleichen'],
        el: 'Compare symbol',
        en: 'Compare symbol',
        es: ['Comparar el símbolo'],
        fa: 'Compare symbol',
        fr: ['Comparer le symbole'],
        he_IL: ['השווה סימול'],
        hu_HU: 'Compare symbol',
        id_ID: ['Bandingkan simbol'],
        it: ['Confronta simbolo'],
        ja: ['シンボルを比較'],
        ko: ['심볼 견주기'],
        ms_MY: ['Bandingkan simbol'],
        nl_NL: 'Compare symbol',
        pl: ['Porównaj symbol'],
        pt: ['Comparar símbolos'],
        ro: 'Compare symbol',
        ru: ['Сравнить символ'],
        sv: ['Jämför symbol'],
        th: ['เปรียบเทียบสัญลักษณ์'],
        tr: ['Sembolü karşılaştır'],
        vi: ['So sánh mã'],
        zh: ['比较商品'],
        zh_TW: ['比較商品'],
      }
    },
    620036: (e) => {
      e.exports = {
        ar: ['إلغاء'],
        ca_ES: ['Cancel·la'],
        cs: ['Zrušit'],
        de: ['Abbrechen'],
        el: ['Άκυρο'],
        en: 'Cancel',
        es: ['Cancelar'],
        fa: ['لغو'],
        fr: ['Annuler'],
        he_IL: ['ביטול'],
        hu_HU: ['Törlés'],
        id_ID: ['Batal'],
        it: ['Annulla'],
        ja: ['キャンセル'],
        ko: ['취소'],
        ms_MY: ['Batal'],
        nl_NL: ['Annuleren'],
        pl: ['Anuluj'],
        pt: ['Cancelar'],
        ro: 'Cancel',
        ru: ['Отмена'],
        sv: ['Avbryt'],
        th: ['ยกเลิก'],
        tr: ['İptal'],
        vi: ['Hủy bỏ'],
        zh: ['取消'],
        zh_TW: ['取消'],
      }
    },
    680395: (e) => {
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
    279589: (e) => {
      e.exports = {
        ar: ['إضافة إلى'],
        ca_ES: ['Afegeix a'],
        cs: 'Add to',
        de: ['hinzufügen zu'],
        el: 'Add to',
        en: 'Add to',
        es: ['Añadir a'],
        fa: 'Add to',
        fr: ['Ajouter à'],
        he_IL: ['הוסף ל'],
        hu_HU: 'Add to',
        id_ID: ['Tambahkan ke'],
        it: ['Aggiungi a'],
        ja: ['追加先'],
        ko: ['~에 넣기:'],
        ms_MY: ['Tambah kepada'],
        nl_NL: 'Add to',
        pl: ['Dodaj do'],
        pt: ['Adicionar'],
        ro: 'Add to',
        ru: ['Добавить'],
        sv: ['Lägg till'],
        th: ['เพิ่มไปที่'],
        tr: ['Buna ekle:'],
        vi: ['Thêm vào'],
        zh: ['添加到'],
        zh_TW: ['增加到'],
      }
    },
    646580: (e) => {
      e.exports = {
        ar: ['الرموز المضافة'],
        ca_ES: ['Símbols afegits'],
        cs: 'Added symbols',
        de: ['Hinzugefügte Symbole'],
        el: 'Added symbols',
        en: 'Added symbols',
        es: ['Símbolos añadidos'],
        fa: 'Added symbols',
        fr: ['Symboles ajoutés'],
        he_IL: ['נוספו סימולים'],
        hu_HU: 'Added symbols',
        id_ID: ['Simbol yang ditambahkan'],
        it: ['Simboli aggiunti'],
        ja: ['追加されているシンボル'],
        ko: ['더해진 심볼들'],
        ms_MY: ['Tambah simbol-simbol'],
        nl_NL: 'Added symbols',
        pl: ['Dodane symbole'],
        pt: ['Símbolos adicionados'],
        ro: 'Added symbols',
        ru: ['Добавленные инструменты'],
        sv: ['Tillagda symboler'],
        th: ['สัญลักษณ์ที่ถูกเพิ่มมา'],
        tr: ['Semboller eklendi'],
        vi: ['Các mã đã thêm'],
        zh: ['添加商品'],
        zh_TW: ['增加商品'],
      }
    },
    64498: (e) => {
      e.exports = {
        ar: ['كل المصادر'],
        ca_ES: ['Totes les fonts'],
        cs: 'All sources',
        de: ['Alle Quellen'],
        el: 'All sources',
        en: 'All sources',
        es: ['Todas las fuentes'],
        fa: 'All sources',
        fr: ['Toutes les sources'],
        he_IL: ['כל המקורות'],
        hu_HU: 'All sources',
        id_ID: ['Seluruh sumber'],
        it: ['Tutte le fonti'],
        ja: ['すべての提供元'],
        ko: ['모든 자료'],
        ms_MY: ['Kesemua sumber'],
        nl_NL: 'All sources',
        pl: ['Wszystkie źródła'],
        pt: ['Todas as fontes'],
        ro: 'All sources',
        ru: ['Все источники'],
        sv: ['Samtliga källor'],
        th: ['แหล่งที่มาทั้งหมด'],
        tr: ['Tüm kaynaklar'],
        vi: ['Tất cả các nguồn'],
        zh: ['全部来源'],
        zh_TW: ['全部來源'],
      }
    },
    471046: (e) => {
      e.exports = {
        ar: ['السماح بتمديد النطاق الزمني'],
        ca_ES: ["Permet ampliar l'escala de temps"],
        cs: 'Allow extend time scale',
        de: ['Zeitskala verlängern lassen'],
        el: 'Allow extend time scale',
        en: 'Allow extend time scale',
        es: ['Permitir ampliar la escala de tiempo'],
        fa: 'Allow extend time scale',
        fr: ["Permettre d'étendre l'échelle de temps"],
        he_IL: ['אפשר להאריך את סולם הזמן'],
        hu_HU: 'Allow extend time scale',
        id_ID: ['Izinkan ekstensi skala waktu'],
        it: ['Permetti estensione scala temporale'],
        ja: ['時間軸の延長を許可'],
        ko: ['타임 스케일 확장을 허용합니다'],
        ms_MY: ['Benarkan pemanjangan skala masa'],
        nl_NL: 'Allow extend time scale',
        pl: ['Zezwól na rozszerzenie osi czasu'],
        pt: ['Prolongar a escala de tempo'],
        ro: 'Allow extend time scale',
        ru: ['Разрешить продолжение временной шкалы'],
        sv: ['Tillåt att förlängd tidsskala'],
        th: ['อนุญาตให้ขยายมาตราส่วนเวลา'],
        tr: ['Zaman ölçeğini uzatmaya izin ver'],
        vi: ['Cho phép mở rộng quy mô thời gian'],
        zh: ['允许延长时间坐标'],
        zh_TW: ['允許延長時間刻度'],
      }
    },
    879852: (e) => {
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
    629601: (e) => {
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
    929673: (e) => {
      e.exports = {
        ar: ['لا توجد أسواق تطابق المعايير التي عينتها'],
        ca_ES: [
          'No hi ha mercats de valors que coincideixin amb els vostres criteris.',
        ],
        cs: 'No exchanges match your criteria',
        de: ['Keine Börsen entsprechen Ihren Kriterien'],
        el: 'No exchanges match your criteria',
        en: 'No exchanges match your criteria',
        es: ['No hay mercados de valores que coincidan con sus criterios.'],
        fa: 'No exchanges match your criteria',
        fr: ['Aucun échange ne correspond à vos critères'],
        he_IL: ['אין בורסות התואמות את הקריטריונים שלך'],
        hu_HU: 'No exchanges match your criteria',
        id_ID: ['Tidak ada bursa yang sesuai dengan kriteria anda'],
        it: ['Nessuna borsa corrisponde ai tuoi criteri'],
        ja: ['条件に合致する取引所はありません'],
        ko: ['조건에 맞는 익스체인지가 없음'],
        ms_MY: ['Tiada bursa saham yang memenuhi kriteria anda.'],
        nl_NL: 'No exchanges match your criteria',
        pl: ['Brak giełd spełniających Twoje kryteria'],
        pt: ['Nenhuma exchange corresponde ao seu critério'],
        ro: 'No exchanges match your criteria',
        ru: ['Нет подходящих бирж'],
        sv: ['Inga börser matchar dina kriterier'],
        th: ['ไม่มีตลาดแลกเปลี่ยนใดๆ ตรงตามเงื่อนไขของคุณ'],
        tr: ['Kriterlerinize uygun borsa yok'],
        vi: ['Không có sàn giao dịch nào khớp với yêu cầu của bạn'],
        zh: ['没有交易所符合您的条件'],
        zh_TW: ['沒有交易所符合您的條件'],
      }
    },
    542078: (e) => {
      e.exports = {
        ar: ['لا توجد رموز هنا حالياً — قم بإضافة الرموز'],
        ca_ES: ['Encara no hi ha símbols aquí, en voleu afegir algun?'],
        cs: 'No symbols here yet — why not add some?',
        de: [
          'Hier gibt es noch keine Symbole - warum nicht welche hinzufügen?',
        ],
        el: 'No symbols here yet — why not add some?',
        en: 'No symbols here yet — why not add some?',
        es: ['Todavía no hay símbolos aquí, ¿por qué no añadir algunos?'],
        fa: 'No symbols here yet — why not add some?',
        fr: ['Pas encore de symboles ici - pourquoi ne pas en ajouter ?'],
        he_IL: ['עדיין אין כאן סימולים - למה לא להוסיף כמה?'],
        hu_HU: 'No symbols here yet — why not add some?',
        id_ID: [
          'Belum ada simbol di sini — mengapa tidak menambahkan beberapa?',
        ],
        it: ['Non ci sono simboli qui. Perchè non aggiungerne alcuni?'],
        ja: ['まだシンボルがありません — 追加してみませんか？'],
        ko: ['아직 종목이 없습니다. 종목을 추가하시겠습니까?'],
        ms_MY: ['Belum ada simbol di sini - mengapa tidak menambahkannya?'],
        nl_NL: 'No symbols here yet — why not add some?',
        pl: ['Nie ma tu jeszcze żadnych symboli — chcesz coś dodać?'],
        pt: ['Não há símbolos aqui - por que não acrescentar alguns?'],
        ro: 'No symbols here yet — why not add some?',
        ru: ['Здесь еще нет инструментов — почему бы их не добавить?'],
        sv: ['Inga symboler här — ska du ta och lägga till några?'],
        th: ['ยังไม่มีสัญลักษณ์ - ทำไมไม่เพิ่มมันบ้างล่ะ?'],
        tr: ['Burada henüz sembol yok - neden biraz eklemiyorsunuz?'],
        vi: ['Không có mã giao dịch nào ở đây - tại sao không thêm một số?'],
        zh: ['这里还没有商品 — 为什么不添加一些呢？'],
        zh_TW: ['這裡還沒有商品 — 為什麼不增加一些呢？'],
      }
    },
    641379: (e) => {
      e.exports = {
        ar: ['لا توجد رموز تطابق معاييرك'],
        ca_ES: ['Cap símbol coincideix amb els vostres criteris'],
        cs: 'No symbols match your criteria',
        de: ['Für Ihre Kriterien gibt es keine übereinstimmenden Symbole'],
        el: 'No symbols match your criteria',
        en: 'No symbols match your criteria',
        es: ['Ningún símbolo coincide con sus criterios'],
        fa: 'No symbols match your criteria',
        fr: ['Aucun symbole ne correspond à vos critères'],
        he_IL: ['אין סימולים תואמים את הקריטריונים שלך'],
        hu_HU: 'No symbols match your criteria',
        id_ID: ['Tidak ada Simbol yang sesuai dengan kriteria anda'],
        it: ['Nessun simbolo corrisponde ai criteri'],
        ja: ['条件に合致するシンボルはありません'],
        ko: ['조건에 맞는 심볼이 없음'],
        ms_MY: ['Tiada Simbol yang menepati kriteria anda'],
        nl_NL: 'No symbols match your criteria',
        pl: ['Brak symboli spełniających Twoje kryteria'],
        pt: ['Nenhum símbolo compatível com seu critério'],
        ro: 'No symbols match your criteria',
        ru: ['Нет подходящих символов'],
        sv: ['Inga symboler matchar dina kriterier'],
        th: ['ไม่มีสัญลักษณ์ที่ตรงกับการค้นหาของคุณ'],
        tr: ['Kriterlerinize uygun sembol yok'],
        vi: ['Không có mã giao dịch nào khớp với tiêu chí của bạn'],
        zh: ['没有代码符合您的条件'],
        zh_TW: ['沒有商品符合您的條件'],
      }
    },
    167242: (e) => {
      e.exports = {
        ar: ['جزء جديد'],
        ca_ES: ['Nou quadre'],
        cs: 'New pane',
        de: ['Neuer Bereich'],
        el: 'New pane',
        en: 'New pane',
        es: ['Nuevo panel'],
        fa: 'New pane',
        fr: ['Nouveau volet'],
        he_IL: ['חלונית חדשה'],
        hu_HU: 'New pane',
        id_ID: ['Panel baru'],
        it: ['Nuovo pannello'],
        ja: ['新規ペイン'],
        ko: ['새 페인'],
        ms_MY: ['Panel baru'],
        nl_NL: 'New pane',
        pl: ['Nowy panel'],
        pt: ['Novo Painel'],
        ro: 'New pane',
        ru: ['Новая панель'],
        sv: ['Ny ruta'],
        th: ['หน้าต่างใหม่'],
        tr: ['Yeni bölme'],
        vi: ['Ngăn mới'],
        zh: ['新窗格'],
        zh_TW: ['新窗格'],
      }
    },
    534420: (e) => {
      e.exports = {
        ar: ['مقياس سعر جديد'],
        ca_ES: ['Nova escala de preus'],
        cs: 'New price scale',
        de: ['Neue Preisskala'],
        el: 'New price scale',
        en: 'New price scale',
        es: ['Nueva escala de precios'],
        fa: 'New price scale',
        fr: ['Nouvelle échelle de prix'],
        he_IL: ['סולם מחירים חדש'],
        hu_HU: 'New price scale',
        id_ID: ['Skala harga baru'],
        it: ['Nuova scala di prezzo'],
        ja: ['新しい価格スケール'],
        ko: ['새 프라이스 스케일'],
        ms_MY: ['Skala harga baru'],
        nl_NL: 'New price scale',
        pl: ['Nowa skala cen'],
        pt: ['Nova escala de preço'],
        ro: 'New price scale',
        ru: ['Новая ценовая шкала'],
        sv: ['Ny prisskala'],
        th: ['สเกลราคาใหม่'],
        tr: ['Yeni fiyat ölçeği'],
        vi: ['Khung giá mới'],
        zh: ['新价格坐标'],
        zh_TW: ['新的價格刻度'],
      }
    },
    719724: (e) => {
      e.exports = {
        ar: ['مصادر'],
        ca_ES: ['Fonts'],
        cs: 'Sources',
        de: ['Quellen'],
        el: 'Sources',
        en: 'Sources',
        es: ['Fuentes'],
        fa: 'Sources',
        fr: 'Sources',
        he_IL: ['מקורות'],
        hu_HU: 'Sources',
        id_ID: ['Sumber'],
        it: ['Fonti'],
        ja: ['情報源'],
        ko: ['자료'],
        ms_MY: ['Sumber-sumber'],
        nl_NL: 'Sources',
        pl: ['Źródła'],
        pt: ['Fontes'],
        ro: 'Sources',
        ru: ['Источники'],
        sv: ['Källor'],
        th: ['แหล่งที่มา'],
        tr: ['Kaynak'],
        vi: ['Nguồn'],
        zh: ['来源'],
        zh_TW: ['來源'],
      }
    },
    882642: (e) => {
      e.exports = {
        ar: ['نفس مقياس %'],
        ca_ES: ['Mateixa escala de %'],
        cs: 'Same % scale',
        de: ['Selbe % Skala'],
        el: 'Same % scale',
        en: 'Same % scale',
        es: ['Misma escala de %'],
        fa: 'Same % scale',
        fr: ['Même échelle %'],
        he_IL: ['אותו סולם%'],
        hu_HU: 'Same % scale',
        id_ID: ['% skala yang sama'],
        it: ['Stessa scala %'],
        ja: ['同じ％スケール'],
        ko: ['같은 % 스케일'],
        ms_MY: ['Skala % yang sama'],
        nl_NL: 'Same % scale',
        pl: ['Ta sama skala %'],
        pt: ['Mesma escala %'],
        ro: 'Same % scale',
        ru: ['Та же % шкала'],
        sv: ['Samma %-skala'],
        th: ['เหมือน % สเกล'],
        tr: ['Aynı % ölçek'],
        vi: ['Cùng % quy mô'],
        zh: ['相同%坐标'],
        zh_TW: ['相同%刻度'],
      }
    },
    17547: (e) => {
      e.exports = {
        ar: ['نفس المقياس'],
        ca_ES: ['Mateixa escala'],
        cs: 'Same scale',
        de: ['Selbe Skala'],
        el: 'Same scale',
        en: 'Same scale',
        es: ['Misma escala'],
        fa: 'Same scale',
        fr: ['Même échelle'],
        he_IL: ['אותו קנה מידה'],
        hu_HU: 'Same scale',
        id_ID: ['Skala yang sama'],
        it: ['Stessa scala'],
        ja: ['同じスケール'],
        ko: ['같은 스케일'],
        ms_MY: ['Skala sama'],
        nl_NL: 'Same scale',
        pl: ['Ta sama skala'],
        pt: ['Mesma escala'],
        ro: 'Same scale',
        ru: ['Та же шкала'],
        sv: ['Samma skala'],
        th: ['เหมือน % สเกล'],
        tr: ['Aynı ölçek'],
        vi: ['Thang tương tự'],
        zh: ['相同坐标'],
        zh_TW: ['相同的刻度'],
      }
    },
    252298: (e) => {
      e.exports = {
        ar: ['بحث'],
        ca_ES: ['Cercar'],
        cs: ['Hledat'],
        de: ['Suche'],
        el: ['Αναζήτησή'],
        en: 'Search',
        es: ['Buscar'],
        fa: ['جستجو'],
        fr: ['Chercher'],
        he_IL: ['חפש'],
        hu_HU: ['Keresés'],
        id_ID: ['Cari'],
        it: ['Cerca'],
        ja: ['検索'],
        ko: ['찾기'],
        ms_MY: ['Cari'],
        nl_NL: ['Zoeken'],
        pl: ['Szukaj'],
        pt: ['Pesquisar'],
        ro: 'Search',
        ru: ['Поиск'],
        sv: ['Sök'],
        th: ['ค้นหา'],
        tr: ['Ara'],
        vi: ['Tìm kiếm'],
        zh: ['搜索'],
        zh_TW: ['搜尋'],
      }
    },
    313269: (e) => {
      e.exports = {
        ar: ['اختر مصدراً'],
        ca_ES: ['Selecciona font'],
        cs: 'Select source',
        de: ['Quelle wählen'],
        el: 'Select source',
        en: 'Select source',
        es: ['Seleccionar fuente'],
        fa: 'Select source',
        fr: ['Sélectionner la source'],
        he_IL: ['בחר מקור'],
        hu_HU: 'Select source',
        id_ID: ['Pilih sumber'],
        it: ['Seleziona fonte'],
        ja: ['情報源を選択'],
        ko: ['자료 선택'],
        ms_MY: ['Pilih sumber'],
        nl_NL: 'Select source',
        pl: ['Wybierz źródło'],
        pt: ['Selecionar fonte'],
        ro: 'Select source',
        ru: ['Выбрать источник'],
        sv: ['Välj källa'],
        th: ['เลือกแหล่งที่มา'],
        tr: ['Kaynak seç'],
        vi: ['Chọn nguồn'],
        zh: ['选择来源'],
        zh_TW: ['選擇來源'],
      }
    },
    589053: (e) => {
      e.exports = {
        ar: ['رمز'],
        ca_ES: ['Símbol'],
        cs: 'Symbol',
        de: 'Symbol',
        el: ['Σύμβολο'],
        en: 'Symbol',
        es: ['Símbolo'],
        fa: ['نماد'],
        fr: ['Symbole'],
        he_IL: ['סימול'],
        hu_HU: ['Szimbólum'],
        id_ID: ['Simbol'],
        it: ['Simbolo'],
        ja: ['シンボル'],
        ko: ['심볼'],
        ms_MY: ['Simbol'],
        nl_NL: ['Symbool'],
        pl: 'Symbol',
        pt: ['Símbolo'],
        ro: 'Symbol',
        ru: ['Инструмент'],
        sv: 'Symbol',
        th: ['สัญลักษณ์'],
        tr: ['Sembol'],
        vi: ['Mã'],
        zh: ['商品代码'],
        zh_TW: ['商品代碼'],
      }
    },
    948490: (e) => {
      e.exports = {
        ar: ['الرمز والوصف'],
        ca_ES: ['Símbol i descripció'],
        cs: 'Symbol & description',
        de: ['Symbol & Beschreibung'],
        el: 'Symbol & description',
        en: 'Symbol & description',
        es: ['Símbolo y descripción'],
        fa: 'Symbol & description',
        fr: ['Symbole & description'],
        he_IL: ['סימול ותיאור'],
        hu_HU: 'Symbol & description',
        id_ID: ['Simbol & deskripsi'],
        it: ['Simbolo e descrizione'],
        ja: ['シンボル & 詳細'],
        ko: ['심볼 & 설명'],
        ms_MY: ['Simbol & penjelasan'],
        nl_NL: 'Symbol & description',
        pl: ['Symbol i opis'],
        pt: ['Símbolo & descrição'],
        ro: 'Symbol & description',
        ru: ['Инструмент и описание'],
        sv: ['Symbol & beskrivning'],
        th: ['สัญลักษณ์และคำอธิบาย'],
        tr: ['Sembol ve açıklama'],
        vi: ['Mã giao dịch & mô tả'],
        zh: ['商品和描述'],
        zh_TW: ['商品&描述'],
      }
    },
    882719: (e) => {
      e.exports = {
        ar: ['بحث عن الرموز'],
        ca_ES: ['Cerca de símbols'],
        cs: 'Symbol Search',
        de: ['Symbol Suche'],
        el: 'Symbol Search',
        en: 'Symbol Search',
        es: ['Búsqueda de símbolos'],
        fa: 'Symbol Search',
        fr: ['Recherche de symbole'],
        he_IL: ['חיפוש סימולים'],
        hu_HU: 'Symbol Search',
        id_ID: ['Pencarian Simbol'],
        it: ['Ricerca simbolo'],
        ja: ['シンボル検索'],
        ko: ['심볼 찾기'],
        ms_MY: ['Cari simbol'],
        nl_NL: 'Symbol Search',
        pl: ['Wyszukiwanie symboli'],
        pt: ['Pesquisa de Símbolo'],
        ro: 'Symbol Search',
        ru: ['Поиск инструментов'],
        sv: ['Symbolsök'],
        th: ['ค้นหาตัวย่อ'],
        tr: ['Sembol Arama'],
        vi: ['Tìm kiếm Mã giao dịch'],
        zh: ['商品代码搜索'],
        zh_TW: ['商品搜尋'],
      }
    },
    957570: (e) => {
      e.exports = {
        ar: ['الرموز الحديثة'],
        ca_ES: ['Símbols recents'],
        cs: 'Recent symbols',
        de: ['Letzte Symbole'],
        el: 'Recent symbols',
        en: 'Recent symbols',
        es: ['Símbolos recientes'],
        fa: 'Recent symbols',
        fr: ['Symboles récents'],
        he_IL: ['סימולים אחרונים'],
        hu_HU: 'Recent symbols',
        id_ID: ['Simbol terbaru'],
        it: ['Simboli recenti'],
        ja: ['最近のシンボル'],
        ko: ['최근 심볼들'],
        ms_MY: ['Simbol-simbol terbaru'],
        nl_NL: 'Recent symbols',
        pl: ['Niedawne symbole'],
        pt: ['Símbolos recentes'],
        ro: 'Recent symbols',
        ru: ['Недавние инструменты'],
        sv: ['Senaste symboler'],
        th: ['สัญลักษณ์ล่าสุด'],
        tr: ['Son semboller'],
        vi: ['Các mã gần đây'],
        zh: ['最近的商品'],
        zh_TW: ['最近的商品'],
      }
    },
    812629: (e) => {
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
    487592: (e) => {
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
    308448: (e) => {
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
    667245: (e) => {
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
    488720: (e) => {
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
    739512: (e) => {
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
    781859: (e) => {
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
    612754: (e) => {
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
    138071: (e) => {
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
    636931: (e) => {
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
