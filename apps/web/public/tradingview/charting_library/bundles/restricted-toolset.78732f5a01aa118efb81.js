;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5516, 9685],
  {
    59142: (e, t) => {
      var n, a, i
      ;(a = [t]),
        (n = (e) => {
          function t(e) {
            if (Array.isArray(e)) {
              for (var t = 0, n = Array(e.length); t < e.length; t++)
                n[t] = e[t]
              return n
            }
            return Array.from(e)
          }
          Object.defineProperty(e, '__esModule', { value: !0 })
          var n = !1
          if ('undefined' != typeof window) {
            var a = {
              get passive() {
                n = !0
              },
            }
            window.addEventListener('testPassive', null, a),
              window.removeEventListener('testPassive', null, a)
          }
          var i =
              'undefined' != typeof window &&
              window.navigator &&
              window.navigator.platform &&
              /iP(ad|hone|od)/.test(window.navigator.platform),
            o = [],
            s = !1,
            l = -1,
            r = void 0,
            c = void 0,
            h = (e) =>
              o.some(
                (t) =>
                  !(!t.options.allowTouchMove || !t.options.allowTouchMove(e)),
              ),
            d = (e) => {
              var t = e || window.event
              return (
                !!h(t.target) ||
                1 < t.touches.length ||
                (t.preventDefault && t.preventDefault(), !1)
              )
            },
            u = () => {
              setTimeout(() => {
                void 0 !== c &&
                  ((document.body.style.paddingRight = c), (c = void 0)),
                  void 0 !== r &&
                    ((document.body.style.overflow = r), (r = void 0))
              })
            }
          ;(e.disableBodyScroll = (e, a) => {
            if (i) {
              if (!e)
                return void console.error(
                  'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
                )
              if (e && !o.some((t) => t.targetElement === e)) {
                var u = { targetElement: e, options: a || {} }
                ;(o = [].concat(t(o), [u])),
                  (e.ontouchstart = (e) => {
                    1 === e.targetTouches.length &&
                      (l = e.targetTouches[0].clientY)
                  }),
                  (e.ontouchmove = (t) => {
                    var n, a, i, o
                    1 === t.targetTouches.length &&
                      ((a = e),
                      (o = (n = t).targetTouches[0].clientY - l),
                      !h(n.target) &&
                        ((a && 0 === a.scrollTop && 0 < o) ||
                        ((i = a) &&
                          i.scrollHeight - i.scrollTop <= i.clientHeight &&
                          o < 0)
                          ? d(n)
                          : n.stopPropagation()))
                  }),
                  s ||
                    (document.addEventListener(
                      'touchmove',
                      d,
                      n ? { passive: !1 } : void 0,
                    ),
                    (s = !0))
              }
            } else {
              ;(m = a),
                setTimeout(() => {
                  if (void 0 === c) {
                    var e = !!m && !0 === m.reserveScrollBarGap,
                      t =
                        window.innerWidth - document.documentElement.clientWidth
                    e &&
                      0 < t &&
                      ((c = document.body.style.paddingRight),
                      (document.body.style.paddingRight = t + 'px'))
                  }
                  void 0 === r &&
                    ((r = document.body.style.overflow),
                    (document.body.style.overflow = 'hidden'))
                })
              var v = { targetElement: e, options: a || {} }
              o = [].concat(t(o), [v])
            }
            var m
          }),
            (e.clearAllBodyScrollLocks = () => {
              i
                ? (o.forEach((e) => {
                    ;(e.targetElement.ontouchstart = null),
                      (e.targetElement.ontouchmove = null)
                  }),
                  s &&
                    (document.removeEventListener(
                      'touchmove',
                      d,
                      n ? { passive: !1 } : void 0,
                    ),
                    (s = !1)),
                  (o = []),
                  (l = -1))
                : (u(), (o = []))
            }),
            (e.enableBodyScroll = (e) => {
              if (i) {
                if (!e)
                  return void console.error(
                    'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                  )
                ;(e.ontouchstart = null),
                  (e.ontouchmove = null),
                  (o = o.filter((t) => t.targetElement !== e)),
                  s &&
                    0 === o.length &&
                    (document.removeEventListener(
                      'touchmove',
                      d,
                      n ? { passive: !1 } : void 0,
                    ),
                    (s = !1))
              } else
                1 === o.length && o[0].targetElement === e
                  ? (u(), (o = []))
                  : (o = o.filter((t) => t.targetElement !== e))
            })
        }),
        void 0 === (i = 'function' == typeof n ? n.apply(t, a) : n) ||
          (e.exports = i)
    },
    25650: (e) => {
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
    26574: (e) => {
      e.exports = {
        switcher: 'switcher-fwE97QDf',
        'thumb-wrapper': 'thumb-wrapper-fwE97QDf',
        'size-small': 'size-small-fwE97QDf',
        'size-medium': 'size-medium-fwE97QDf',
        'size-large': 'size-large-fwE97QDf',
        input: 'input-fwE97QDf',
        'intent-default': 'intent-default-fwE97QDf',
        'disable-active-state-styles': 'disable-active-state-styles-fwE97QDf',
        'intent-select': 'intent-select-fwE97QDf',
        'intent-all-blue': 'intent-all-blue-fwE97QDf',
        track: 'track-fwE97QDf',
        thumb: 'thumb-fwE97QDf',
      }
    },
    88803: (e) => {
      e.exports = {
        'tablet-normal-breakpoint': 'screen and (max-width: 768px)',
        'small-height-breakpoint': 'screen and (max-height: 360px)',
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
      }
    },
    17723: (e) => {
      e.exports = { footer: 'footer-dwINHZFL' }
    },
    14877: (e) => {
      e.exports = {
        favorite: 'favorite-_FRQhM5Y',
        hovered: 'hovered-_FRQhM5Y',
        disabled: 'disabled-_FRQhM5Y',
        active: 'active-_FRQhM5Y',
        checked: 'checked-_FRQhM5Y',
      }
    },
    33963: (e) => {
      e.exports = {
        item: 'item-zwyEh4hn',
        label: 'label-zwyEh4hn',
        labelRow: 'labelRow-zwyEh4hn',
        toolbox: 'toolbox-zwyEh4hn',
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
    27306: (e) => {
      e.exports = {
        button: 'button-iLKiGOdQ',
        hovered: 'hovered-iLKiGOdQ',
        disabled: 'disabled-iLKiGOdQ',
        active: 'active-iLKiGOdQ',
        hidden: 'hidden-iLKiGOdQ',
      }
    },
    17946: (e, t, n) => {
      n.d(t, { CustomBehaviourContext: () => a })
      const a = (0, n(50959).createContext)({ enableActiveStateStyles: !0 })
      a.displayName = 'CustomBehaviourContext'
    },
    125: (e, t, n) => {
      n.d(t, { useForceUpdate: () => i })
      var a = n(50959)
      const i = () => {
        const [, e] = (0, a.useReducer)((e) => e + 1, 0)
        return e
      }
    },
    76974: (e, t, n) => {
      n.d(t, { useIsMounted: () => i })
      var a = n(50959)
      const i = () => {
        const e = (0, a.useRef)(!1)
        return (
          (0, a.useEffect)(
            () => (
              (e.current = !0),
              () => {
                e.current = !1
              }
            ),
            [],
          ),
          e
        )
      }
    },
    26996: (e, t, n) => {
      n.d(t, { Loader: () => l })
      var a = n(50959),
        i = n(97754),
        o = n(25650),
        s = n.n(o)
      function l(e) {
        const {
            className: t,
            size: n = 'medium',
            staticPosition: o,
            color: l = 'black',
          } = e,
          r = i(s().item, s()[l], s()[n])
        return a.createElement(
          'span',
          { className: i(s().loader, o && s().static, t) },
          a.createElement('span', { className: r }),
          a.createElement('span', { className: r }),
          a.createElement('span', { className: r }),
        )
      }
    },
    47201: (e, t, n) => {
      function a(...e) {
        return (t) => {
          for (const n of e) void 0 !== n && n(t)
        }
      }
      n.d(t, { createSafeMulticastEventHandler: () => a })
    },
    24437: (e, t, n) => {
      n.d(t, { DialogBreakpoints: () => i })
      var a = n(88803)
      const i = {
        SmallHeight: a['small-height-breakpoint'],
        TabletSmall: a['tablet-small-breakpoint'],
        TabletNormal: a['tablet-normal-breakpoint'],
      }
    },
    39362: (e, t, n) => {
      n.d(t, { SymbolSearchDialogFooter: () => l })
      var a = n(50959),
        i = n(97754),
        o = n.n(i),
        s = n(17723)
      function l(e) {
        const { className: t, children: n } = e
        return a.createElement('div', { className: o()(s.footer, t) }, n)
      }
    },
    36189: (e, t, n) => {
      n.d(t, { FavoriteButton: () => d })
      var a = n(11542),
        i = n(50959),
        o = n(97754),
        s = n(9745),
        l = n(39146),
        r = n(48010),
        c = n(14877)
      const h = {
        add: a.t(null, void 0, n(44629)),
        remove: a.t(null, void 0, n(72482)),
      }
      function d(e) {
        const { className: t, isFilled: n, isActive: a, onClick: d, ...u } = e
        return i.createElement(s.Icon, {
          ...u,
          className: o(
            c.favorite,
            'apply-common-tooltip',
            n && c.checked,
            a && c.active,
            t,
          ),
          icon: n ? l : r,
          onClick: d,
          title: n ? h.remove : h.add,
        })
      }
    },
    36947: (e, t, n) => {
      n.d(t, { useForceUpdate: () => a.useForceUpdate })
      var a = n(125)
    },
    70412: (e, t, n) => {
      n.d(t, {
        hoverMouseEventFilter: () => o,
        useAccurateHover: () => s,
        useHover: () => i,
      })
      var a = n(50959)
      function i() {
        const [e, t] = (0, a.useState)(!1)
        return [
          e,
          {
            onMouseOver: (e) => {
              o(e) && t(!0)
            },
            onMouseOut: (e) => {
              o(e) && t(!1)
            },
          },
        ]
      }
      function o(e) {
        return !e.currentTarget.contains(e.relatedTarget)
      }
      function s(e) {
        const [t, n] = (0, a.useState)(!1)
        return (
          (0, a.useEffect)(() => {
            const t = (t) => {
              if (null === e.current) return
              const a = e.current.contains(t.target)
              n(a)
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
    81332: (e, t, n) => {
      n.d(t, { multilineLabelWithIconAndToolboxTheme: () => s })
      var a = n(40173),
        i = n(71986),
        o = n(33963)
      const s = (0, a.mergeThemes)(i, o)
    },
    51613: (e, t, n) => {
      n.d(t, { PopupMenuSeparator: () => l })
      var a = n(50959),
        i = n(97754),
        o = n.n(i),
        s = n(92910)
      function l(e) {
        const { size: t = 'normal', className: n, ariaHidden: i = !1 } = e
        return a.createElement('div', {
          className: o()(
            s.separator,
            'small' === t && s.small,
            'normal' === t && s.normal,
            'large' === t && s.large,
            n,
          ),
          role: 'separator',
          'aria-hidden': i,
        })
      }
    },
    96040: (e, t, n) => {
      n.d(t, { RemoveButton: () => c })
      var a = n(11542),
        i = n(50959),
        o = n(97754),
        s = n(9745),
        l = n(33765),
        r = n(27306)
      function c(e) {
        const {
          className: t,
          isActive: c,
          onClick: h,
          onMouseDown: d,
          title: u,
          hidden: v,
          'data-name': m = 'remove-button',
          ...p
        } = e
        return i.createElement(s.Icon, {
          ...p,
          'data-name': m,
          className: o(
            r.button,
            'apply-common-tooltip',
            c && r.active,
            v && r.hidden,
            t,
          ),
          icon: l,
          onClick: h,
          onMouseDown: d,
          title: u || a.t(null, void 0, n(34596)),
        })
      }
    },
    40173: (e, t, n) => {
      function a(e, t, n = {}) {
        return Object.assign(
          {},
          e,
          ((e, t, n = {}) => {
            const a = Object.assign({}, t)
            for (const i of Object.keys(t)) {
              const o = n[i] || i
              o in e && (a[i] = [e[o], t[i]].join(' '))
            }
            return a
          })(e, t, n),
        )
      }
      n.d(t, { mergeThemes: () => a })
    },
    6132: (e, t, n) => {
      var a = n(22134)
      function i() {}
      function o() {}
      ;(o.resetWarningCache = i),
        (e.exports = () => {
          function e(e, t, n, i, o, s) {
            if (s !== a) {
              var l = new Error(
                'Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types',
              )
              throw ((l.name = 'Invariant Violation'), l)
            }
          }
          function t() {
            return e
          }
          e.isRequired = e
          var n = {
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
            checkPropTypes: o,
            resetWarningCache: i,
          }
          return (n.PropTypes = n), n
        })
    },
    19036: (e, t, n) => {
      e.exports = n(6132)()
    },
    22134: (e) => {
      e.exports = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED'
    },
    47102: (e) => {
      e.exports = {
        accessible: 'accessible-NQERJsv9',
        active: 'active-NQERJsv9',
      }
    },
    12989: (e) => {
      e.exports = {
        summary: 'summary-ynHBVe1n',
        hovered: 'hovered-ynHBVe1n',
        caret: 'caret-ynHBVe1n',
      }
    },
    90785: (e) => {
      e.exports = { accessible: 'accessible-raQdxQp0' }
    },
    89089: (e) => {
      e.exports = { button: 'button-LkmyTVRc', active: 'active-LkmyTVRc' }
    },
    20461: (e) => {
      e.exports = {
        wrapper: 'wrapper-psOC5oyI',
        labelRow: 'labelRow-psOC5oyI',
        label: 'label-psOC5oyI',
        labelHint: 'labelHint-psOC5oyI',
        labelOn: 'labelOn-psOC5oyI',
      }
    },
    40670: (e) => {
      e.exports = {
        wrapper: 'wrapper-bl9AR3Gv',
        hovered: 'hovered-bl9AR3Gv',
        withIcon: 'withIcon-bl9AR3Gv',
        labelRow: 'labelRow-bl9AR3Gv',
        label: 'label-bl9AR3Gv',
        switchWrap: 'switchWrap-bl9AR3Gv',
        icon: 'icon-bl9AR3Gv',
        labelHint: 'labelHint-bl9AR3Gv',
        labelOn: 'labelOn-bl9AR3Gv',
        accessible: 'accessible-bl9AR3Gv',
      }
    },
    90826: (e) => {
      e.exports = { button: 'button-Y1TCZogJ', active: 'active-Y1TCZogJ' }
    },
    38456: (e) => {
      e.exports = {
        button: 'button-ptpAHg8E',
        withText: 'withText-ptpAHg8E',
        withoutText: 'withoutText-ptpAHg8E',
      }
    },
    67972: (e) => {
      e.exports = {
        form: 'form-MgR0zejo',
        input: 'input-MgR0zejo',
        menu: 'menu-MgR0zejo',
        add: 'add-MgR0zejo',
        hovered: 'hovered-MgR0zejo',
        wrap: 'wrap-MgR0zejo',
        accessible: 'accessible-MgR0zejo',
        menuLabel: 'menuLabel-MgR0zejo',
        hover: 'hover-MgR0zejo',
        clicked: 'clicked-MgR0zejo',
      }
    },
    39357: (e) => {
      e.exports = { spinnerWrap: 'spinnerWrap-cZT0OZe0' }
    },
    44242: (e) => {
      e.exports = { title: 'title-u3QJgF_p' }
    },
    52045: (e) => {
      e.exports = {
        button: 'button-neROVfUe',
        first: 'first-neROVfUe',
        last: 'last-neROVfUe',
      }
    },
    97041: (e) => {
      e.exports = { wrap: 'wrap-n5bmFxyX' }
    },
    64618: (e) => {
      e.exports = { hidden: 'hidden-5MVS18J8' }
    },
    18369: (e) => {
      e.exports = {
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
        item: 'item-o5a0MQMm',
        withIcon: 'withIcon-o5a0MQMm',
        shortcut: 'shortcut-o5a0MQMm',
        loading: 'loading-o5a0MQMm',
        icon: 'icon-o5a0MQMm',
      }
    },
    4549: (e) => {
      e.exports = {
        button: 'button-b3Cgff6l',
        group: 'group-b3Cgff6l',
        menu: 'menu-b3Cgff6l',
      }
    },
    27363: (e) => {
      e.exports = {
        customTradingViewStyleButton: 'customTradingViewStyleButton-zigjK1n2',
        withoutIcon: 'withoutIcon-zigjK1n2',
      }
    },
    75352: (e) => {
      e.exports = {
        dropdown: 'dropdown-l0nf43ai',
        label: 'label-l0nf43ai',
        smallWidthTitle: 'smallWidthTitle-l0nf43ai',
        smallWidthMenuItem: 'smallWidthMenuItem-l0nf43ai',
        smallWidthWrapper: 'smallWidthWrapper-l0nf43ai',
      }
    },
    20371: (e) => {
      e.exports = { value: 'value-gwXludjS', selected: 'selected-gwXludjS' }
    },
    867: (e) => {
      e.exports = {
        smallWidthMenuItem: 'smallWidthMenuItem-RmqZNwwp',
        menuItem: 'menuItem-RmqZNwwp',
        remove: 'remove-RmqZNwwp',
      }
    },
    80022: (e) => {
      e.exports = {
        button: 'button-S_1OCXUK',
        first: 'first-S_1OCXUK',
        last: 'last-S_1OCXUK',
        menu: 'menu-S_1OCXUK',
        dropdown: 'dropdown-S_1OCXUK',
        menuContent: 'menuContent-S_1OCXUK',
        section: 'section-S_1OCXUK',
        smallTabletSectionTitle: 'smallTabletSectionTitle-S_1OCXUK',
        addCustomInterval: 'addCustomInterval-S_1OCXUK',
        hovered: 'hovered-S_1OCXUK',
        group: 'group-S_1OCXUK',
      }
    },
    23902: (e) => {
      e.exports = { button: 'button-gn9HMufu' }
    },
    92998: (e) => {
      e.exports = {
        button: 'button-ZuDkGGhF',
        isDisabled: 'isDisabled-ZuDkGGhF',
      }
    },
    70152: (e) => {
      e.exports = {
        saveString: 'saveString-XVd1Kfjg',
        hidden: 'hidden-XVd1Kfjg',
        loader: 'loader-XVd1Kfjg',
      }
    },
    63672: (e) => {
      e.exports = {
        opened: 'opened-yyMUOAN9',
        hover: 'hover-yyMUOAN9',
        clicked: 'clicked-yyMUOAN9',
        autoSaveWrapper: 'autoSaveWrapper-yyMUOAN9',
        sharingWrapper: 'sharingWrapper-yyMUOAN9',
        button: 'button-yyMUOAN9',
        buttonSmallPadding: 'buttonSmallPadding-yyMUOAN9',
        hintPlaceHolder: 'hintPlaceHolder-yyMUOAN9',
        smallHintPlaceHolder: 'smallHintPlaceHolder-yyMUOAN9',
        popupItemRowTabletSmall: 'popupItemRowTabletSmall-yyMUOAN9',
        shortcut: 'shortcut-yyMUOAN9',
        toolTitle: 'toolTitle-yyMUOAN9',
        toolTitleMobile: 'toolTitleMobile-yyMUOAN9',
        layoutItem: 'layoutItem-yyMUOAN9',
        layoutMeta: 'layoutMeta-yyMUOAN9',
        labelRow: 'labelRow-yyMUOAN9',
        layoutTitle: 'layoutTitle-yyMUOAN9',
        layoutItemWrap: 'layoutItemWrap-yyMUOAN9',
        layoutTitleMobile: 'layoutTitleMobile-yyMUOAN9',
        active: 'active-yyMUOAN9',
        textWrap: 'textWrap-yyMUOAN9',
        text: 'text-yyMUOAN9',
        withIcon: 'withIcon-yyMUOAN9',
        sharingLabelWrap: 'sharingLabelWrap-yyMUOAN9',
        titleSharingLabel: 'titleSharingLabel-yyMUOAN9',
        switcherLabel: 'switcherLabel-yyMUOAN9',
        iconWrap: 'iconWrap-yyMUOAN9',
        infoIcon: 'infoIcon-yyMUOAN9',
        copyLink: 'copyLink-yyMUOAN9',
        copyLinkMobile: 'copyLinkMobile-yyMUOAN9',
        accessibleLabel: 'accessibleLabel-yyMUOAN9',
      }
    },
    25882: (e) => {
      e.exports = {
        button: 'button-cq__ntSC',
        smallLeftPadding: 'smallLeftPadding-cq__ntSC',
        text: 'text-cq__ntSC',
        uppercase: 'uppercase-cq__ntSC',
      }
    },
    92710: (e) => {
      e.exports = { description: 'description-jgoQcEnP' }
    },
    5145: (e) => {
      e.exports = {
        item: 'item-j7oVl2yI',
        accessible: 'accessible-j7oVl2yI',
        round: 'round-j7oVl2yI',
      }
    },
    85013: (e) => {
      e.exports = {
        wrap: 'wrap-HXSqojvq',
        titleWrap: 'titleWrap-HXSqojvq',
        indicators: 'indicators-HXSqojvq',
        title: 'title-HXSqojvq',
        icon: 'icon-HXSqojvq',
        text: 'text-HXSqojvq',
        titleTabletSmall: 'titleTabletSmall-HXSqojvq',
        labelRow: 'labelRow-HXSqojvq',
        label: 'label-HXSqojvq',
      }
    },
    48261: (e) => {
      e.exports = {
        labelRow: 'labelRow-JeQoCpvi',
        toolbox: 'toolbox-JeQoCpvi',
        description: 'description-JeQoCpvi',
        descriptionTabletSmall: 'descriptionTabletSmall-JeQoCpvi',
        item: 'item-JeQoCpvi',
        titleItem: 'titleItem-JeQoCpvi',
        remove: 'remove-JeQoCpvi',
        titleItemTabletSmall: 'titleItemTabletSmall-JeQoCpvi',
        itemTabletSmall: 'itemTabletSmall-JeQoCpvi',
        itemLabelTabletSmall: 'itemLabelTabletSmall-JeQoCpvi',
        wrap: 'wrap-JeQoCpvi',
        hovered: 'hovered-JeQoCpvi',
      }
    },
    36001: (e) => {
      e.exports = {
        menu: 'menu-hcofKPms',
        menuSmallTablet: 'menuSmallTablet-hcofKPms',
        menuItemHeaderTabletSmall: 'menuItemHeaderTabletSmall-hcofKPms',
        menuItemHeader: 'menuItemHeader-hcofKPms',
      }
    },
    70760: (e) => {
      e.exports = {
        wrap: 'wrap-jiC5bgmi',
        full: 'full-jiC5bgmi',
        first: 'first-jiC5bgmi',
        last: 'last-jiC5bgmi',
        medium: 'medium-jiC5bgmi',
        buttonWithFavorites: 'buttonWithFavorites-jiC5bgmi',
      }
    },
    57778: (e) => {
      e.exports = { icon: 'icon-uMfL97K2' }
    },
    36898: (e, t, n) => {
      n.d(t, { useMouseClickAutoBlur: () => s })
      var a = n(50959),
        i = n(76460),
        o = n(16838)
      function s(e, t = !0) {
        ;(0, a.useEffect)(() => {
          if (!o.PLATFORM_ACCESSIBILITY_ENABLED || !t) return
          const n = (t) => {
            const n = e.current
            null !== n &&
              document.activeElement instanceof HTMLElement &&
              ((0, i.isKeyboardClick)(t) ||
                (n.contains(document.activeElement) &&
                  'INPUT' !== document.activeElement.tagName &&
                  document.activeElement.blur()))
          }
          return (
            window.addEventListener('click', n, !0),
            () => window.removeEventListener('click', n, !0)
          )
        }, [t])
      }
    },
    81351: (e, t, n) => {
      n.d(t, { AccessibleMenuItem: () => d })
      var a = n(50959),
        i = n(97754),
        o = n.n(i),
        s = n(3343),
        l = n(50238),
        r = n(16838),
        c = n(16396),
        h = n(47102)
      function d(e) {
        const { className: t, ...n } = e,
          [i, d] = (0, l.useRovingTabindexElement)(null)
        return a.createElement(c.PopupMenuItem, {
          ...n,
          className: o()(
            r.PLATFORM_ACCESSIBILITY_ENABLED && h.accessible,
            e.isActive && h.active,
            t,
          ),
          reference: i,
          tabIndex: d,
          onKeyDown: (e) => {
            if (
              !r.PLATFORM_ACCESSIBILITY_ENABLED ||
              e.target !== e.currentTarget
            )
              return
            const t = (0, s.hashFromEvent)(e)
            ;(13 !== t && 32 !== t) ||
              (e.preventDefault(),
              i.current instanceof HTMLElement && i.current.click())
          },
          'data-role': r.PLATFORM_ACCESSIBILITY_ENABLED ? 'menuitem' : void 0,
          'aria-disabled':
            (r.PLATFORM_ACCESSIBILITY_ENABLED && e.isDisabled) || void 0,
        })
      }
    },
    76197: (e, t, n) => {
      n.d(t, { CollapsibleSection: () => r })
      var a = n(50959),
        i = n(97754),
        o = n.n(i),
        s = n(10381),
        l = n(12989)
      const r = (0, a.forwardRef)((e, t) => {
        const {
          open: n,
          summary: i,
          children: r,
          onStateChange: c,
          tabIndex: h,
          className: d,
          ...u
        } = e
        return a.createElement(
          a.Fragment,
          null,
          a.createElement(
            'div',
            {
              ...u,
              className: o()(d, l.summary),
              onClick: () => {
                c && c(!n)
              },
              'data-open': n,
              ref: t,
              tabIndex: h,
            },
            i,
            a.createElement(s.ToolWidgetCaret, {
              className: l.caret,
              dropped: Boolean(n),
            }),
          ),
          n && r,
        )
      })
    },
    12165: (e, t, n) => {
      n.d(t, { MenuFavoriteButton: () => h })
      var a = n(50959),
        i = n(97754),
        o = n.n(i),
        s = n(50238),
        l = n(16838),
        r = n(36189),
        c = n(89089)
      function h(e) {
        const { tooltip: t, onClick: n, ...i } = e,
          [h, d] = (0, s.useRovingTabindexElement)(null)
        return l.PLATFORM_ACCESSIBILITY_ENABLED
          ? a.createElement(
              'button',
              {
                ref: h,
                tabIndex: d,
                onClick: n,
                className: o()(c.button, i.isActive && c.active),
                type: 'button',
              },
              a.createElement(r.FavoriteButton, {
                'aria-label': t,
                ...i,
                'data-tooltip': t,
              }),
            )
          : a.createElement(r.FavoriteButton, { ...e, 'data-tooltip': t })
      }
    },
    69297: (e, t, n) => {
      n.d(t, {
        DEFAULT_MENU_ITEM_SWITCHER_THEME: () => b,
        MenuItemSwitcher: () => C,
      })
      var a = n(50959),
        i = n(97754),
        o = n.n(i),
        s = n(17946),
        l = n(26574),
        r = n.n(l)
      function c(e) {
        const t = (0, a.useContext)(s.CustomBehaviourContext),
          {
            className: n,
            intent: o = 'default',
            size: l = 'small',
            enableActiveStateStyles: c = t.enableActiveStateStyles,
          } = e
        return i(
          n,
          r().switcher,
          r()[`size-${l}`],
          r()[`intent-${o}`],
          !c && r()['disable-active-state-styles'],
        )
      }
      function h(e) {
        var t
        const {
            reference: n,
            size: i,
            intent: o,
            role: s,
            'aria-checked': l,
            checked: h,
            defaultChecked: d,
            onKeyDown: u,
            ...v
          } = e,
          m = (0, a.useCallback)(
            (e) => {
              13 === e.keyCode && e.target.click(), u && u(e)
            },
            [u],
          )
        return a.createElement(
          'span',
          { className: c(e) },
          a.createElement('input', {
            ...v,
            type: 'checkbox',
            className: r().input,
            ref: n,
            role: null != s ? s : 'switch',
            'aria-checked':
              null !== (t = null != l ? l : h) && void 0 !== t ? t : d,
            checked: h,
            defaultChecked: d,
            onKeyDown: m,
          }),
          a.createElement(
            'span',
            { className: r()['thumb-wrapper'] },
            a.createElement('span', { className: r().track }),
            a.createElement('span', { className: r().thumb }),
          ),
        )
      }
      var d = n(9745),
        u = n(16838),
        v = n(3343),
        m = n(50238),
        p = n(90186),
        g = n(40670)
      const b = g
      function C(e) {
        const {
            className: t,
            checked: n,
            id: i,
            label: s,
            labelDescription: l,
            value: r,
            preventLabelHighlight: c,
            reference: b,
            switchReference: C,
            theme: S = g,
            disabled: _,
            icon: f,
          } = e,
          [y, w] = (0, m.useRovingTabindexElement)(null),
          E = o()(S.label, n && !c && S.labelOn),
          T = o()(
            t,
            S.wrapper,
            n && S.wrapperWithOnLabel,
            l && S.wrapperWithDescription,
          )
        return a.createElement(
          'label',
          {
            className: o()(
              T,
              f && S.withIcon,
              u.PLATFORM_ACCESSIBILITY_ENABLED && g.accessible,
            ),
            htmlFor: i,
            ref: b,
            onKeyDown: (e) => {
              if (
                !u.PLATFORM_ACCESSIBILITY_ENABLED ||
                e.target !== e.currentTarget
              )
                return
              const t = (0, v.hashFromEvent)(e)
              ;(13 !== t && 32 !== t) ||
                (e.preventDefault(),
                y.current instanceof HTMLElement && y.current.click())
            },
            tabIndex: w,
            'data-role': u.PLATFORM_ACCESSIBILITY_ENABLED ? 'menuitem' : void 0,
            'aria-disabled':
              (u.PLATFORM_ACCESSIBILITY_ENABLED && e.disabled) || void 0,
          },
          void 0 !== f &&
            a.createElement(d.Icon, { className: S.icon, icon: f }),
          a.createElement(
            'div',
            { className: S.labelRow },
            a.createElement('div', { className: E }, s),
            l && a.createElement('div', { className: S.labelHint }, l),
          ),
          a.createElement(
            'div',
            { className: g.switchWrap },
            a.createElement(h, {
              disabled: _,
              className: S.switch,
              reference: (e) => {
                y(e), null == C || C(e)
              },
              checked: n,
              onChange: (t) => {
                const n = t.target.checked
                void 0 !== e.onChange && e.onChange(n)
              },
              value: r,
              tabIndex: -1,
              id: i,
              role: e.switchRole,
              'aria-disabled': u.PLATFORM_ACCESSIBILITY_ENABLED,
              ...(0, p.filterDataProps)(e),
            }),
          ),
        )
      }
    },
    74628: (e, t, n) => {
      n.d(t, { MenuRemoveButton: () => h })
      var a = n(50959),
        i = n(97754),
        o = n.n(i),
        s = n(50238),
        l = n(16838),
        r = n(96040),
        c = n(90826)
      function h(e) {
        const { tooltip: t, onClick: n, ...i } = e,
          [h, d] = (0, s.useRovingTabindexElement)(null)
        return l.PLATFORM_ACCESSIBILITY_ENABLED
          ? a.createElement(
              'button',
              {
                ref: h,
                tabIndex: d,
                onClick: n,
                className: o()(c.button, i.isActive && c.active),
                type: 'button',
              },
              a.createElement(r.RemoveButton, {
                'aria-label': t,
                ...i,
                'data-tooltip': t,
              }),
            )
          : a.createElement(r.RemoveButton, { ...e, 'data-tooltip': t })
      }
    },
    65817: (e, t, n) => {
      n.d(t, { INTERVALS: () => i })
      var a = n(11542)
      const i = [
        { name: '', label: a.t(null, { context: 'interval' }, n(37830)) },
        { name: 'H', label: a.t(null, { context: 'interval' }, n(5285)) },
        { name: 'D', label: a.t(null, { context: 'interval' }, n(6174)) },
        { name: 'W', label: a.t(null, { context: 'interval' }, n(25042)) },
        { name: 'M', label: a.t(null, { context: 'interval' }, n(79410)) },
      ]
    },
    82962: (e, t, n) => {
      n.d(t, { ToolWidgetMenuSummary: () => s })
      var a = n(50959),
        i = n(97754),
        o = n(44242)
      function s(e) {
        return a.createElement(
          'div',
          { className: i(e.className, o.title) },
          e.children,
        )
      }
    },
    88066: (e, t, n) => {
      n.d(t, { DEFAULT_TOOLBAR_BUTTON_THEME: () => l, ToolbarButton: () => r })
      var a = n(50959),
        i = n(31409),
        o = n(50238),
        s = n(16838)
      const l = i.DEFAULT_TOOL_WIDGET_BUTTON_THEME,
        r = (0, a.forwardRef)((e, t) => {
          const { tooltip: n, ...l } = e,
            [r, c] = (0, o.useRovingTabindexElement)(t)
          return a.createElement(i.ToolWidgetButton, {
            'aria-label': s.PLATFORM_ACCESSIBILITY_ENABLED ? n : void 0,
            ...l,
            tag: s.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div',
            ref: r,
            tabIndex: c,
            'data-tooltip': n,
          })
        })
    },
    48889: (e, t, n) => {
      n.d(t, { ToolbarIconButton: () => l })
      var a = n(50959),
        i = n(50238),
        o = n(16838),
        s = n(50813)
      const l = (0, a.forwardRef)((e, t) => {
        const { tooltip: n, ...l } = e,
          [r, c] = (0, i.useRovingTabindexElement)(t)
        return a.createElement(s.ToolWidgetIconButton, {
          'aria-label': o.PLATFORM_ACCESSIBILITY_ENABLED ? n : void 0,
          ...l,
          tag: o.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div',
          ref: r,
          tabIndex: c,
          'data-tooltip': n,
        })
      })
    },
    50298: (e, t, n) => {
      n.d(t, { ToolbarMenuButton: () => h })
      var a = n(50959),
        i = n(39416),
        o = n(8087),
        s = n(50238),
        l = n(16838),
        r = n(36898),
        c = n(81261)
      const h = (0, a.forwardRef)((e, t) => {
        const { tooltip: n, menuReference: h = null, ...d } = e,
          [u, v] = (0, s.useRovingTabindexElement)(null),
          m = (0, i.useFunctionalRefObject)(h)
        return (
          (0, r.useMouseClickAutoBlur)(m),
          a.createElement(o.ToolWidgetMenu, {
            'aria-label': l.PLATFORM_ACCESSIBILITY_ENABLED ? n : void 0,
            ...d,
            ref: t,
            tag: l.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div',
            reference: u,
            tabIndex: v,
            'data-tooltip': n,
            menuReference: m,
            onMenuKeyDown: c.handleAccessibleMenuKeyDown,
            onMenuFocus: (e) => (0, c.handleAccessibleMenuFocus)(e, u),
          })
        )
      })
    },
    2464: (e, t, n) => {
      n.r(t), n.d(t, { getRestrictedToolSet: () => ra })
      var a = n(14483),
        i = n(50959),
        o = n(19036),
        s = n(11542),
        l = n(82992),
        r = n(88732),
        c = n(45876),
        h = n(9745),
        d = n(50298),
        u = n(97754),
        v = n.n(u),
        m = n(97041)
      const p = i.forwardRef((e, t) => {
        const { children: n, className: a, ...o } = e
        return i.createElement(
          'div',
          { className: u(a, m.wrap), ref: t, ...o },
          n,
        )
      })
      var g = n(88066),
        b = n(52045)
      class C extends i.PureComponent {
        constructor() {
          super(...arguments),
            (this._handleClick = () => {
              const { onClick: e, onClickArg: t } = this.props
              e && e(t)
            })
        }
        render() {
          const {
            className: e,
            icon: t,
            hint: n,
            text: a,
            isDisabled: o,
            isActive: s,
            isFirst: l,
            isLast: r,
            onClick: c,
            onClickArg: h,
            ...d
          } = this.props
          return i.createElement(g.ToolbarButton, {
            ...d,
            icon: t,
            text: a,
            tooltip: n,
            isDisabled: o,
            isActive: s,
            isGrouped: !0,
            onClick: this._handleClick,
            className: u(e, b.button, { [b.first]: l, [b.last]: r }),
          })
        }
      }
      var S = n(51613),
        _ = n(90692),
        f = n(24437),
        y = n(81332),
        w = n(95366),
        E = n(16410),
        T = n(42960),
        M = n(47201),
        I = n(3343),
        k = n(16838)
      function x(e) {
        const { orientation: t, onKeyDown: n, ...a } = e,
          o = k.PLATFORM_ACCESSIBILITY_ENABLED
            ? { role: 'radiogroup', 'aria-orientation': t }
            : {}
        return i.createElement('div', {
          ...a,
          ...o,
          onKeyDown: (0, M.createSafeMulticastEventHandler)((e) => {
            if (!k.PLATFORM_ACCESSIBILITY_ENABLED) return
            if (e.defaultPrevented) return
            if (!(document.activeElement instanceof HTMLElement)) return
            const n = (0, I.hashFromEvent)(e)
            if ('vertical' !== t && 38 !== n && 40 !== n) return
            if ('vertical' === t && 37 !== n && 39 !== n) return
            const a = ((i = e.currentTarget),
            Array.from(
              i.querySelectorAll(
                '[role="radio"]:not([disabled]):not([aria-disabled])',
              ),
            ).filter((0, k.createScopedVisibleElementFilter)(i))).sort(
              k.navigationOrderComparator,
            )
            var i
            if (0 === a.length) return
            const o = a.indexOf(document.activeElement)
            if (-1 === o) return
            e.preventDefault()
            const s = () => {
                const e = (o + a.length - 1) % a.length
                a[o].dispatchEvent(
                  new CustomEvent('roving-tabindex:secondary-element'),
                ),
                  a[e].dispatchEvent(
                    new CustomEvent('roving-tabindex:main-element'),
                  ),
                  a[e].focus()
              },
              l = () => {
                const e = (o + a.length + 1) % a.length
                a[o].dispatchEvent(
                  new CustomEvent('roving-tabindex:secondary-element'),
                ),
                  a[e].dispatchEvent(
                    new CustomEvent('roving-tabindex:main-element'),
                  ),
                  a[e].focus()
              }
            switch (n) {
              case 38:
                'vertical' !== t && s()
                break
              case 40:
                'vertical' !== t && l()
                break
              case 37:
                'vertical' === t && s()
                break
              case 39:
                'vertical' === t && l()
            }
          }, n),
        })
      }
      var A = n(81351),
        R = n(12165),
        L = n(4549)
      const N = { barsStyle: s.t(null, void 0, n(84232)) },
        F = (0, w.registryContextType)()
      function O(e) {
        var t
        return !(null === (t = l.linking.supportedChartStyles.value()) ||
        void 0 === t
          ? void 0
          : t.includes(e))
      }
      const H = 'ITEMS_DIVIDER',
        B = [
          [0, 1, 9],
          [2, 14, 15],
          [3, 16, 10],
          [13, 12],
          [8, 4, 7, 5, 6, 17, 11],
        ]
      class D extends i.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._handleChangeStyle = (e) => {
              const {
                favorites: t,
                lastSelectedNotFavorite: n,
                activeStyle: a,
              } = this.state
              this.setState({
                activeStyle: e,
                lastSelectedNotFavorite: t.includes(a) ? n : a,
              })
            }),
            (this._handleSelectStyle = (e) => {
              const { chartWidgetCollection: t } = this.context
              e !== t.activeChartStyle.value() && t.setChartStyleToWidget(e)
            }),
            (this._handleClickFavorite = (e) => {
              this._isStyleFavorited(e)
                ? this._handleRemoveFavorite(e)
                : this._handleAddFavorite(e)
            }),
            (this._boundForceUpdate = () => {
              this.forceUpdate()
            }),
            (this._handleQuickClick = (e) => {
              this._handleSelectStyle(e), this._trackClick()
            }),
            (0, w.validateRegistry)(t, {
              chartWidgetCollection: o.any.isRequired,
              favoriteChartStylesService: o.any.isRequired,
            })
          const { chartWidgetCollection: n, favoriteChartStylesService: a } = t,
            i = n.activeChartStyle.value(),
            s = a.get(),
            l = new Set((0, E.allChartStyles)())
          this.state = {
            activeStyle: i,
            favorites: s,
            styles: B.reduce((e, t) => {
              const n = t.filter((e) => l.has(e))
              return n.length && (e.length && n.unshift(H), e.push(...n)), e
            }, []),
          }
        }
        componentDidMount() {
          const { chartWidgetCollection: e, favoriteChartStylesService: t } =
            this.context
          e.activeChartStyle.subscribe(this._handleChangeStyle),
            t.getOnChange().subscribe(this, this._handleChangeSettings),
            l.linking.supportedChartStyles.subscribe(this._boundForceUpdate)
        }
        componentWillUnmount() {
          const { chartWidgetCollection: e, favoriteChartStylesService: t } =
            this.context
          e.activeChartStyle.unsubscribe(this._handleChangeStyle),
            t.getOnChange().unsubscribe(this, this._handleChangeSettings),
            l.linking.supportedChartStyles.unsubscribe(this._boundForceUpdate)
        }
        render() {
          const {
              isShownQuicks: e,
              displayMode: t = 'full',
              id: n,
            } = this.props,
            {
              activeStyle: a,
              favorites: o,
              styles: s,
              lastSelectedNotFavorite: l,
            } = this.state,
            u = 'small' !== t && e && 0 !== o.length,
            v = [...o]
          v.includes(a) ? void 0 !== l && v.push(l) : v.push(a)
          const m = u && v.length > 1
          return i.createElement(
            _.MatchMedia,
            { rule: f.DialogBreakpoints.TabletSmall },
            (e) => {
              const t = s.map((t, n) =>
                t === H
                  ? i.createElement(S.PopupMenuSeparator, {
                      key: `separator-${n}`,
                    })
                  : this._renderPopupMenuItem(t, t === a, e),
              )
              return i.createElement(
                p,
                { id: n },
                m &&
                  i.createElement(
                    x,
                    { orientation: 'horizontal', className: L.group },
                    v.map((e, t) =>
                      i.createElement(C, {
                        role: 'radio',
                        className: L.button,
                        icon: c.SERIES_ICONS[e],
                        'aria-checked': u && a === e,
                        isActive: u && a === e,
                        isDisabled: O(e),
                        key: t,
                        hint: (0, T.getTranslatedChartStyleName)(e),
                        isFirst: 0 === t,
                        isLast: t === v.length - 1,
                        onClick: u ? this._handleQuickClick : void 0,
                        onClickArg: e,
                        'data-value': r.STYLE_SHORT_NAMES[e],
                      }),
                    ),
                  ),
                i.createElement(
                  d.ToolbarMenuButton,
                  {
                    arrow: Boolean(m),
                    content: m
                      ? void 0
                      : i.createElement(
                          p,
                          null,
                          i.createElement(h.Icon, { icon: c.SERIES_ICONS[a] }),
                        ),
                    tooltip: m
                      ? N.barsStyle
                      : (0, T.getTranslatedChartStyleName)(a),
                    className: L.menu,
                    isDrawer: e,
                    onClick: this._trackClick,
                  },
                  t,
                ),
              )
            },
          )
        }
        _renderPopupMenuItem(e, t, n) {
          const { isFavoritingAllowed: a } = this.props,
            o = this._isStyleFavorited(e)
          return i.createElement(A.AccessibleMenuItem, {
            key: `chart-type-${e}`,
            theme: n ? y.multilineLabelWithIconAndToolboxTheme : void 0,
            icon: c.SERIES_ICONS[e],
            isActive: t,
            isDisabled: O(e),
            label: (0, T.getTranslatedChartStyleName)(e) || '',
            onClick: this._handleSelectStyle,
            onClickArg: e,
            showToolboxOnHover: !o,
            showToolboxOnFocus: k.PLATFORM_ACCESSIBILITY_ENABLED,
            toolbox:
              a &&
              i.createElement(R.MenuFavoriteButton, {
                isActive: t,
                isFilled: o,
                onClick: () => this._handleClickFavorite(e),
              }),
            'data-value': r.STYLE_SHORT_NAMES[e],
          })
        }
        _handleChangeSettings(e) {
          this.setState({ lastSelectedNotFavorite: void 0, favorites: e })
        }
        _isStyleFavorited(e) {
          return -1 !== this.state.favorites.indexOf(e)
        }
        _handleAddFavorite(e) {
          const { favorites: t } = this.state,
            { favoriteChartStylesService: n } = this.context
          n.set([...t, e])
        }
        _handleRemoveFavorite(e) {
          const { favorites: t } = this.state,
            { favoriteChartStylesService: n } = this.context
          n.set(t.filter((t) => t !== e))
        }
        _trackClick() {
          0
        }
      }
      D.contextType = F
      var P = n(50238),
        U = n(31409),
        W = n(38456)
      const z = ['medium', 'small'],
        V = (0, i.forwardRef)((e, t) => {
          const {
              text: n,
              className: a,
              displayMode: o,
              collapseWhen: s = z,
              ...l
            } = e,
            r = !s.includes(o)
          return i.createElement(U.ToolWidgetButton, {
            ...l,
            ref: t,
            text: r ? n : void 0,
            className: u(a, W.button, r ? W.withText : W.withoutText),
          })
        })
      function Z(e) {
        const { tooltip: t, ...n } = e,
          [a, o] = (0, P.useRovingTabindexElement)(null)
        return i.createElement(V, {
          'aria-label': k.PLATFORM_ACCESSIBILITY_ENABLED ? t : void 0,
          ...n,
          tag: k.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div',
          tabIndex: o,
          ref: a,
          'data-tooltip': t,
        })
      }
      var K = n(51768),
        Q = n(76460),
        j = n(1393)
      const q = (0, w.registryContextType)()
      class Y extends i.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._updateState = (e) => {
              this.setState({ isActive: e })
            }),
            (this._handleClick = (e) => {
              var t
              ;(0, K.trackEvent)('GUI', 'Chart Header Toolbar', 'compare'),
                null === (t = this._compareDialogRenderer) ||
                  void 0 === t ||
                  t.show({ shouldReturnFocus: (0, Q.isKeyboardClick)(e) })
            }),
            (0, w.validateRegistry)(t, {
              chartWidgetCollection: o.any.isRequired,
            }),
            (this.state = { isActive: !1 }),
            (this._compareDialogRenderer =
              this.context.chartWidgetCollection.getCompareDialogRenderer())
        }
        componentDidMount() {
          var e
          null === (e = this._compareDialogRenderer) ||
            void 0 === e ||
            e.visible().subscribe(this._updateState)
        }
        componentWillUnmount() {
          var e
          null === (e = this._compareDialogRenderer) ||
            void 0 === e ||
            e.visible().unsubscribe(this._updateState)
        }
        render() {
          const { isActive: e } = this.state
          return i.createElement(Z, {
            ...this.props,
            icon: j,
            isOpened: e,
            onClick: this._handleClick,
            collapseWhen: ['full', 'medium', 'small'],
            tooltip: s.t(null, void 0, n(20229)),
          })
        }
      }
      Y.contextType = q
      var G = n(48889),
        X = n(61814),
        $ = n(68335),
        J = n(97268),
        ee = n(57047)
      const te = (0, X.hotKeySerialize)({
          keys: [(0, $.humanReadableModifiers)($.Modifiers.Shift, !1), 'F'],
          text: '{0} + {1}',
        }),
        ne = (0, w.registryContextType)()
      function ae(e) {
        return e.fullscreen().value() ? ee : J
      }
      class ie extends i.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._updateState = () => {
              this.setState({ icon: ae(this.context.chartWidgetCollection) })
            }),
            (this._handleClick = () => {
              const { chartWidgetCollection: e } = this.context
              e.fullscreen().value() ? e.exitFullscreen() : e.startFullscreen()
            }),
            (0, w.validateRegistry)(t, {
              chartWidgetCollection: o.any.isRequired,
            }),
            (this.state = { icon: ae(this.context.chartWidgetCollection) }),
            this._subscribe()
        }
        render() {
          const { className: e, id: t } = this.props,
            { icon: a } = this.state
          return i.createElement(G.ToolbarIconButton, {
            id: t,
            icon: a,
            onClick: this._handleClick,
            className: u(e),
            tooltip: s.t(null, void 0, n(11682)),
            'data-tooltip-hotkey': te,
          })
        }
        componentWillUnmount() {
          this._unsubscribe()
        }
        _subscribe() {
          this.context.chartWidgetCollection
            .fullscreen()
            .subscribe(this._updateState)
        }
        _unsubscribe() {
          this.context.chartWidgetCollection
            .fullscreen()
            .unsubscribe(this._updateState)
        }
      }
      ie.contextType = ne
      var oe = n(50151),
        se = n(16396),
        le = n(81261),
        re = n(74970)
      const ce = (0, n(59224).getLogger)('FavoritesInfo')
      function he(e) {
        if (0 === e.length) return Promise.resolve([])
        ce.logNormal('Requesting favorites info')
        const t = [],
          n = new Map(),
          a = new Map(),
          i = new Map()
        return (
          e.forEach((e) => {
            switch (e.type) {
              case 'java':
                i.set(e.studyId, e)
                break
              case 'pine':
                isPublishedPineId(e.pineId)
                  ? n.set(e.pineId, e)
                  : a.set(e.pineId, e)
                break
              default:
                ;(0, oe.assert)(
                  !1,
                  `unknown favorite type ${JSON.stringify(e)}`,
                )
            }
          }),
          0 !== i.size &&
            t.push(
              (0, re.studyMetaInfoRepository)()
                .findAllJavaStudies()
                .then((e) => {
                  const t = new Map()
                  for (const n of e)
                    !n.is_hidden_study &&
                      i.has(n.id) &&
                      t.set(n.id, {
                        name: n.description,
                        localizedName: n.description_localized,
                        studyMarketShittyObject: n,
                      })
                  return t
                })
                .then((e) => {
                  const t = ((e, t) => {
                    const n = { items: [], notFoundItems: [] }
                    return (
                      e.forEach((e, a) => {
                        const i = t.get(a)
                        void 0 !== i
                          ? n.items.push({ item: e, info: i })
                          : n.notFoundItems.push(e)
                      }),
                      n
                    )
                  })(i, e)
                  if (0 !== t.notFoundItems.length) {
                    const e = t.notFoundItems.map((e) => e.studyId)
                    ce.logWarn(`Cannot find java scripts: ${JSON.stringify(e)}`)
                  }
                  return t.items
                }),
            ),
          Promise.all(t).then(
            (e) => (
              ce.logNormal('Requesting favorites info finished'),
              e.reduce((e, t) => e.concat(t), [])
            ),
          )
        )
      }
      var de = n(92249),
        ue = n(88348),
        ve = n(26996),
        me = n(39357)
      function pe(e) {
        const { className: t } = e
        return i.createElement(
          'div',
          { className: v()(me.spinnerWrap, t) },
          i.createElement(ve.Loader, null),
        )
      }
      var ge = n(82962),
        be = n(76422),
        Ce = n(39681),
        Se = n(75352)
      const _e = (0, X.hotKeySerialize)({ keys: ['/'], text: '{0}' }),
        fe = (0, w.registryContextType)()
      class ye extends i.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._promise = null),
            (this._menu = i.createRef()),
            (this._menuItemsContainer = i.createRef()),
            (this._favoriteFundamentalsModel = null),
            (this._setActiveState = (e) => {
              this.setState({ isActive: e })
            }),
            (this._handleClick = (e) => {
              const { studyMarket: t } = this.props
              this.setState({ isActive: !0 }, () => {
                t.visible().value()
                  ? t.hide()
                  : t.show({ shouldReturnFocus: (0, Q.isKeyboardClick)(e) })
              }),
                this._trackClick()
            }),
            (this._handleSelectIndicator = (e) => {
              ;(e = (0, oe.ensureDefined)(e)),
                this._trackFavoriteAction('Favorite indicator from toolbar')
              'java' === e.type ? e.studyId : e.pineId
              ;(() => {
                e = (0, oe.ensureDefined)(e)
                const { chartWidgetCollection: t } = this.context
                if ('java' === e.type) {
                  const t = (0, de.tryFindStudyLineToolNameByStudyId)(e.studyId)
                  if (null !== t) return void ue.tool.setValue(t)
                }
                t.activeChartWidget.value().insertStudy(e, [])
              })()
            }),
            (this._handleFavoriteIndicatorsChange = () => {
              const { favoriteScriptsModel: e } = this.context,
                t = [...(0, oe.ensureDefined)(e).favorites()]
              this.setState({ favorites: t }), this._clearCache()
            }),
            (this._handleFavoriteFundamentalsChange = () => {
              var e
              const t = new Set(
                (null === (e = this._favoriteFundamentalsModel) || void 0 === e
                  ? void 0
                  : e.favorites()) || [],
              )
              this.setState({ favoriteFundamentals: t }), this._clearCache()
            }),
            (this._handleMouseEnter = () => {
              this._prefetchFavorites()
            }),
            (this._handleWrapClick = () => {
              this._prefetchFavorites()
            }),
            (this._handleChangeActiveWidget = () => {
              this._clearCache()
            }),
            (this._clearCache = () => {
              ;(this._promise = null), this.setState({ infos: [] })
            }),
            (this._handleScriptRenamed = (e) => {
              const { favoriteScriptsModel: t } = this.context
              void 0 !== t && t.isFav(e.scriptIdPart) && this._clearCache()
            }),
            (this._handleFavoriteMenuClick = () => {
              this._trackClick(),
                this._trackFavoriteAction('Select favorite indicators dropdown')
            }),
            (0, w.validateRegistry)(t, {
              favoriteScriptsModel: o.any,
              chartWidgetCollection: o.any.isRequired,
            })
          const { favoriteScriptsModel: n } = t,
            a = void 0 !== n ? n.favorites() : []
          this.state = {
            isActive: !1,
            isLoading: !1,
            favorites: a,
            favoriteFundamentals: void 0,
            infos: [],
          }
        }
        componentDidMount() {
          const { studyMarket: e } = this.props,
            { favoriteScriptsModel: t, chartWidgetCollection: n } = this.context
          e.visible().subscribe(this._setActiveState),
            void 0 !== t &&
              (t
                .favoritesChanged()
                .subscribe(this, this._handleFavoriteIndicatorsChange),
              n.activeChartWidget.subscribe(this._handleChangeActiveWidget)),
            be.on('TVScriptRenamed', this._handleScriptRenamed, null)
        }
        componentWillUnmount() {
          const { studyMarket: e } = this.props,
            { favoriteScriptsModel: t, chartWidgetCollection: n } = this.context
          e.visible().unsubscribe(this._setActiveState),
            void 0 !== t &&
              (t
                .favoritesChanged()
                .unsubscribe(this, this._handleFavoriteIndicatorsChange),
              n.activeChartWidget.unsubscribe(this._handleChangeActiveWidget)),
            be.unsubscribe('TVScriptRenamed', this._handleScriptRenamed, null),
            (this._promise = null)
        }
        render() {
          const {
              isActive: e,
              favorites: t,
              favoriteFundamentals: a,
              isLoading: o,
            } = this.state,
            { className: l, displayMode: r, id: c } = this.props,
            { chartWidgetCollection: h } = this.context
          return i.createElement(
            i.Fragment,
            null,
            i.createElement(
              p,
              {
                id: c,
                onMouseEnter: this._handleMouseEnter,
                onClick: this._handleWrapClick,
              },
              i.createElement(Z, {
                displayMode: r,
                className: l,
                icon: Ce,
                isOpened: e,
                onClick: this._handleClick,
                text: s.t(null, void 0, n(61142)),
                'data-role': 'button',
                'data-name': 'open-indicators-dialog',
                tooltip: s.t(null, void 0, n(74527)),
                'data-tooltip-hotkey': _e,
              }),
              Boolean(t.length > 0 || (null == a ? void 0 : a.size)) &&
                i.createElement(
                  _.MatchMedia,
                  { rule: 'screen and (max-width: 430px)' },
                  (e) =>
                    i.createElement(
                      d.ToolbarMenuButton,
                      {
                        key: h.activeChartWidget.value().id(),
                        arrow: !0,
                        closeOnClickOutside: !0,
                        isDrawer: e,
                        drawerPosition: 'Bottom',
                        ref: this._menu,
                        menuReference: this._menuItemsContainer,
                        onClick: this._handleFavoriteMenuClick,
                        'data-name': 'show-favorite-indicators',
                        tooltip: s.t(null, void 0, n(33959)),
                      },
                      i.createElement(
                        'div',
                        {
                          className: v()(
                            Se.dropdown,
                            e && Se.smallWidthWrapper,
                          ),
                        },
                        i.createElement(
                          ge.ToolWidgetMenuSummary,
                          { className: e && Se.smallWidthTitle },
                          s.t(null, void 0, n(83127)),
                        ),
                        o && i.createElement(pe, null),
                        !o &&
                          i.createElement(
                            i.Fragment,
                            null,
                            this.state.infos.length > 0
                              ? this.state.infos.map((t) =>
                                  i.createElement(A.AccessibleMenuItem, {
                                    className: v()(e && Se.smallWidthMenuItem),
                                    theme: e
                                      ? y.multilineLabelWithIconAndToolboxTheme
                                      : void 0,
                                    key:
                                      'java' === t.item.type
                                        ? t.item.studyId
                                        : t.item.pineId,
                                    onClick: this._handleSelectIndicator,
                                    onClickArg: t.item,
                                    label: i.createElement(
                                      'span',
                                      {
                                        className: v()(
                                          !e && Se.label,
                                          e && Se.smallWidthLabel,
                                          'apply-overflow-tooltip',
                                        ),
                                      },
                                      we(t),
                                    ),
                                  }),
                                )
                              : null !== this._promise &&
                                  i.createElement(se.PopupMenuItem, {
                                    isDisabled: !0,
                                    label: s.t(null, void 0, n(23687)),
                                  }),
                          ),
                      ),
                    ),
                ),
            ),
          )
        }
        _prefetchFavorites() {
          const { chartWidgetCollection: e } = this.context
          if (null !== this._promise || !window.is_authenticated) return
          if (!e.activeChartWidget.value().hasModel()) return
          this.setState({ isLoading: !0 })
          const t = (this._promise = Promise.all([
            he(this.state.favorites),
            void 0,
          ]).then((e) => {
            if (t !== this._promise) return
            const [n, a] = e
            let i = [...n]
            if (a) {
              const e = a
                .filter((e) => {
                  var t
                  return null === (t = this.state.favoriteFundamentals) ||
                    void 0 === t
                    ? void 0
                    : t.has(e.scriptIdPart)
                })
                .map(this._mapFundamentalToFavoriteItemInfo)
              i.push(...e)
            }
            ;(i = [...i].sort((e, t) => we(e).localeCompare(we(t)))),
              this.setState({ infos: i, isLoading: !1 }, () => {
                var e
                null === (e = this._menu.current) || void 0 === e || e.update(),
                  this._menuItemsContainer.current &&
                    document.activeElement ===
                      this._menuItemsContainer.current &&
                    (0, le.focusFirstMenuItem)(this._menuItemsContainer.current)
              })
          }))
        }
        _trackClick() {
          0
        }
        _trackFavoriteAction(e) {
          ;(0, K.trackEvent)('GUI', 'Chart Header Toolbar', e)
        }
        _mapFundamentalToFavoriteItemInfo(e) {
          return {
            item: { type: 'pine', pineId: e.scriptIdPart },
            info: {
              name: e.scriptName,
              localizedName: getLocalizedFundamentalsName(e),
              studyMarketShittyObject: void 0,
            },
          }
        }
      }
      function we(e) {
        return (
          e.info.localizedName ||
          s.t(e.info.name, { context: 'study' }, n(68716))
        )
      }
      ye.contextType = fe
      var Ee = n(94025),
        Te = n(20371)
      function Me(e) {
        return i.createElement(
          'div',
          { className: u(Te.value, { [Te.selected]: e.isSelected }) },
          e.value,
          e.metric,
        )
      }
      var Ie = n(65817),
        ke = n(67972)
      function xe(e) {
        const { className: t, ...n } = e,
          [a, o] = (0, P.useRovingTabindexElement)(null),
          s = k.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div'
        return i.createElement(s, {
          ...n,
          ref: a,
          tabIndex: o,
          'data-role': k.PLATFORM_ACCESSIBILITY_ENABLED ? 'menuitem' : void 0,
          className: v()(k.PLATFORM_ACCESSIBILITY_ENABLED && ke.accessible, t),
        })
      }
      function Ae(e) {
        const { className: t, ...n } = e,
          [a, o] = (0, P.useRovingTabindexElement)(null)
        return i.createElement('input', {
          ...n,
          ref: a,
          tabIndex: o,
          'data-role': k.PLATFORM_ACCESSIBILITY_ENABLED ? 'menuitem' : void 0,
          className: v()(k.PLATFORM_ACCESSIBILITY_ENABLED && ke.accessible, t),
        })
      }
      class Re extends i.PureComponent {
        constructor(e) {
          super(e),
            (this._menu = i.createRef()),
            (this._handleChangeInput = (e) => {
              const { value: t } = e.currentTarget
              ;/^[0-9]*$/.test(t) && this.setState({ inputValue: t })
            }),
            (this._handleSelectTime = (e) => {
              var t, n, a, i
              this.setState({ selectedIntervalSuffix: e }),
                null === (n = (t = this.props).onSelect) ||
                  void 0 === n ||
                  n.call(t),
                null === (a = this._menu.current) || void 0 === a || a.close(),
                null === (i = this._menu.current) || void 0 === i || i.focus()
            }),
            (this._handleClickAdd = () => {
              const { inputValue: e, selectedIntervalSuffix: t } = this.state
              this.props.onAdd(e, t)
            }),
            (this.state = {
              inputValue: '1',
              selectedIntervalSuffix: Ie.INTERVALS[0].name,
            })
        }
        render() {
          const {
            inputValue: e,
            menuWidth: t,
            selectedIntervalSuffix: a,
          } = this.state
          return i.createElement(
            'div',
            { className: ke.form },
            i.createElement(Ae, {
              className: ke.input,
              maxLength: 7,
              onChange: this._handleChangeInput,
              value: e,
            }),
            i.createElement(
              d.ToolbarMenuButton,
              {
                orientation: 'none',
                minWidth: t,
                'data-role': 'menuitem',
                onClose: this.props.onCloseMenu,
                onOpen: this.props.onOpenMenu,
                className: ke.menu,
                ref: this._menu,
                content: i.createElement(
                  'div',
                  { className: ke.menuLabel },
                  Ie.INTERVALS.find((e) => e.name === a).label,
                ),
              },
              Ie.INTERVALS.map((e) =>
                i.createElement(A.AccessibleMenuItem, {
                  dontClosePopup: !0,
                  key: e.name,
                  label: e.label,
                  onClick: this._handleSelectTime,
                  onClickArg: e.name,
                }),
              ),
            ),
            i.createElement(
              xe,
              { className: ke.add, onClick: this._handleClickAdd },
              s.t(null, void 0, n(54777)),
            ),
          )
        }
      }
      var Le = n(90186),
        Ne = n(70412),
        Fe = n(32563),
        Oe = n(74628),
        He = n(867)
      function Be(e) {
        const {
            interval: t,
            hint: n,
            isActive: a,
            isDisabled: o,
            isFavorite: s,
            isSignaling: l,
            onClick: r,
            onClickRemove: c,
            onClickFavorite: h,
            isSmallTablet: d,
          } = e,
          u = (0, Le.filterDataProps)(e),
          [m, p] = (0, Ne.useHover)(),
          g = i.useCallback((e) => c(t, e), [c, t]),
          b = i.useCallback(() => h(t), [h, t]),
          C = (0, i.useRef)(null)
        return (
          (0, i.useEffect)(() => {
            var e
            l &&
              d &&
              (null === (e = C.current) || void 0 === e || e.scrollIntoView())
          }, [l, d]),
          i.createElement(
            'div',
            { ...p, ref: C },
            i.createElement(A.AccessibleMenuItem, {
              ...u,
              className: v()(He.menuItem, d && He.smallWidthMenuItem),
              theme: d ? y.multilineLabelWithIconAndToolboxTheme : void 0,
              isActive: a,
              isDisabled: o,
              isHovered: l,
              onClick: r,
              onClickArg: t,
              toolbox: (() => {
                const { isRemovable: t, isFavoritingAllowed: n } = e,
                  l = i.createElement(Oe.MenuRemoveButton, {
                    key: 'remove',
                    isActive: a,
                    hidden: !Fe.touch && !m,
                    onClick: g,
                    className: He.remove,
                  }),
                  r = i.createElement(R.MenuFavoriteButton, {
                    key: 'favorite',
                    isActive: a,
                    isFilled: s,
                    onClick: b,
                  })
                return [t && l, !o && n && r]
              })(),
              showToolboxOnHover: !s,
              showToolboxOnFocus: k.PLATFORM_ACCESSIBILITY_ENABLED,
              label: n,
            }),
          )
        )
      }
      var De = n(36274)
      const Pe = {
        [De.ResolutionKind.Ticks]: s.t(
          null,
          { context: 'interval_group_name' },
          n(30426),
        ),
        [De.ResolutionKind.Seconds]: s.t(
          null,
          { context: 'interval_group_name' },
          n(74973),
        ),
        [De.ResolutionKind.Minutes]: s.t(
          null,
          { context: 'interval_group_name' },
          n(57470),
        ),
        [De.SpecialResolutionKind.Hours]: s.t(
          null,
          { context: 'interval_group_name' },
          n(62346),
        ),
        [De.ResolutionKind.Days]: s.t(
          null,
          { context: 'interval_group_name' },
          n(74787),
        ),
        [De.ResolutionKind.Weeks]: s.t(
          null,
          { context: 'interval_group_name' },
          n(86614),
        ),
        [De.ResolutionKind.Months]: s.t(
          null,
          { context: 'interval_group_name' },
          n(94328),
        ),
        [De.ResolutionKind.Range]: s.t(
          null,
          { context: 'interval_group_name' },
          n(48801),
        ),
        [De.ResolutionKind.Invalid]: '',
      }
      function Ue(e, t = !1) {
        return { id: e, name: Pe[e], items: [], mayOmitSeparator: t }
      }
      var We = n(57898),
        ze = n(29197),
        Ve = n(59064),
        Ze = n(76197),
        Ke = n(90785)
      function Qe(e) {
        const { className: t, ...n } = e,
          [a, o] = (0, P.useRovingTabindexElement)(null)
        return i.createElement(Ze.CollapsibleSection, {
          ...n,
          ref: a,
          tabIndex: o,
          'data-role': k.PLATFORM_ACCESSIBILITY_ENABLED ? 'menuitem' : void 0,
          className: v()(k.PLATFORM_ACCESSIBILITY_ENABLED && Ke.accessible, t),
          onKeyDown: (e) => {
            const t = (0, I.hashFromEvent)(e)
            ;(13 !== t && 32 !== t) ||
              (e.preventDefault(),
              a.current instanceof HTMLElement && a.current.click())
          },
        })
      }
      var je = n(80022)
      const qe = {
          openDialog: s.t(null, void 0, n(79353)),
          timeInterval: s.t(null, void 0, n(32916)),
        },
        Ye = (0, X.hotKeySerialize)({
          keys: [','],
          text: s.t(null, void 0, n(14605)),
        }),
        Ge = (0, w.registryContextType)(),
        Xe = new We.Delegate(),
        $e = i.lazy(async () => ({
          default: (
            await Promise.all([
              n.e(956),
              n.e(2109),
              n.e(5145),
              n.e(855),
              n.e(2191),
              n.e(6221),
              n.e(4215),
              n.e(7194),
              n.e(2676),
              n.e(6408),
              n.e(5057),
              n.e(4403),
              n.e(4013),
            ]).then(n.bind(n, 44762))
          ).ToolWidgetIntervalsAddDialog,
        }))
      class Je extends i.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._menu = i.createRef()),
            (this._menuItemsContainerRef = i.createRef()),
            (this._renderChildren = (e, t) => [
              ...this._createMenuItems(e, t),
              ...this._createIntervalForm(t),
            ]),
            (this._handleChangeInterval = (e) => {
              const { activeInterval: t, lastNotQuicked: n } = this.state,
                a = this._getQuicks()
              this.setState({
                activeInterval: (0, Ee.normalizeIntervalString)(e),
                lastNotQuicked: void 0 === t || a.includes(t) ? n : t,
              })
            }),
            (this._bindedForceUpdate = () => {
              this.forceUpdate()
            }),
            (this._handleCloseMenu = () => {
              this.setState({ isOpenedFormMenu: !1 })
            }),
            (this._handleOpenMenu = () => {
              this.setState({ isOpenedFormMenu: !0 })
            }),
            (this._handleSelectInterval = (e) => {
              void 0 !== e &&
                e !== l.linking.interval.value() &&
                this.context.chartWidgetCollection.setResolution(e),
                e && (0, K.trackEvent)('GUI', 'Time Interval', e)
            }),
            (this._handleClickFavorite = (e) => {
              ;(e = (0, oe.ensureDefined)(e)),
                this._isIntervalFavorite(e)
                  ? this._handleRemoveFavorite(e)
                  : this._handleAddFavorite(e)
            }),
            (this._handleAddFavorite = (e) => {
              const { favorites: t } = this.state
              this.context.favoriteIntervalsService.set([...t, e])
            }),
            (this._handleRemoveFavorite = (e) => {
              const { favorites: t } = this.state
              this.context.favoriteIntervalsService.set(
                t.filter((t) => t !== e),
              )
            }),
            (this._handleAddInterval = (e, t) => {
              const { intervalService: n } = this.context,
                a = n.add(e, t)
              a && this.setState({ lastAddedInterval: a })
            }),
            (this._handleRemoveInterval = (e, t) => {
              var n
              const { intervalService: a } = this.context
              if (e) {
                if (
                  k.PLATFORM_ACCESSIBILITY_ENABLED &&
                  t &&
                  (0, Q.isKeyboardClick)(t) &&
                  this._menuItemsContainerRef.current
                ) {
                  const t = (0, le.queryMenuElements)(
                      this._menuItemsContainerRef.current,
                    ),
                    a = t.findIndex((t) => t.matches(`[data-value="${e}"]`))
                  if (-1 !== a) {
                    const e =
                      null !== (n = t[a + 1]) && void 0 !== n ? n : t[a - 1]
                    e
                      ? e.focus()
                      : (0, le.focusFirstMenuItem)(
                          this._menuItemsContainerRef.current,
                        )
                  }
                }
                a.remove(e), this._handleRemoveFavorite(e)
              }
            }),
            (this._getHandleSectionStateChange = (e) => (t) => {
              const { menuViewState: n } = this.state,
                { intervalsMenuViewStateService: a } = this.context
              a.set({ ...n, [e]: !t })
            }),
            (this._handleOpenAddIntervalDialog = () => {
              this.setState({ isAddIntervalDialogOpened: !0 })
            }),
            (this._handleCloseAddIntervalDialog = () => {
              this.setState({ isAddIntervalDialogOpened: !1 })
            }),
            (this._handleGlobalClose = () => {
              const { isFake: e } = this.props,
                { isAddIntervalDialogOpened: t } = this.state
              e || t || Xe.fire()
            }),
            (this._handeQuickClick = (e) => {
              this._handleSelectInterval(e), this._trackClick()
            }),
            (this._updateMenuPosition = () => {
              var e
              null === (e = this._menu.current) || void 0 === e || e.update()
            }),
            (0, w.validateRegistry)(t, {
              chartApiInstance: o.any.isRequired,
              favoriteIntervalsService: o.any.isRequired,
              intervalService: o.any.isRequired,
              intervalsMenuViewStateService: o.any.isRequired,
            })
          const {
            chartApiInstance: n,
            favoriteIntervalsService: s,
            intervalService: r,
            intervalsMenuViewStateService: c,
          } = t
          this._customIntervals = a.enabled('custom_resolutions')
          const h = l.linking.interval.value(),
            d = h && (0, Ee.normalizeIntervalString)(h),
            u = s.get(),
            v = r.getCustomIntervals(),
            m = c.get()
          ;(this._defaultIntervals = n
            .defaultResolutions()
            .filter(Ee.isIntervalEnabled)
            .map(Ee.normalizeIntervalString)),
            (this.state = {
              isOpenedFormMenu: !1,
              activeInterval: d,
              favorites: u,
              customs: v,
              menuViewState: m,
              isAddIntervalDialogOpened: !1,
            })
        }
        componentDidMount() {
          const {
            favoriteIntervalsService: e,
            intervalService: t,
            intervalsMenuViewStateService: n,
          } = this.context
          e.getOnChange().subscribe(this, this._handleChangeFavorites),
            n.getOnChange().subscribe(this, this._handleChangeMenuViewState),
            t.getOnChange().subscribe(this, this._handleChangeCustoms),
            l.linking.interval.subscribe(this._handleChangeInterval),
            l.linking.intraday.subscribe(this._bindedForceUpdate),
            l.linking.seconds.subscribe(this._bindedForceUpdate),
            l.linking.ticks.subscribe(this._bindedForceUpdate),
            l.linking.range.subscribe(this._bindedForceUpdate),
            l.linking.supportedResolutions.subscribe(this._bindedForceUpdate),
            l.linking.dataFrequencyResolution.subscribe(
              this._bindedForceUpdate,
            ),
            Ve.globalCloseDelegate.subscribe(this, this._handleGlobalClose)
        }
        componentWillUnmount() {
          const {
            favoriteIntervalsService: e,
            intervalService: t,
            intervalsMenuViewStateService: n,
          } = this.context
          e.getOnChange().unsubscribe(this, this._handleChangeFavorites),
            n.getOnChange().unsubscribe(this, this._handleChangeMenuViewState),
            t.getOnChange().unsubscribe(this, this._handleChangeCustoms),
            l.linking.interval.unsubscribe(this._handleChangeInterval),
            l.linking.intraday.unsubscribe(this._bindedForceUpdate),
            l.linking.seconds.unsubscribe(this._bindedForceUpdate),
            l.linking.ticks.unsubscribe(this._bindedForceUpdate),
            l.linking.range.unsubscribe(this._bindedForceUpdate),
            l.linking.supportedResolutions.unsubscribe(this._bindedForceUpdate),
            l.linking.dataFrequencyResolution.unsubscribe(
              this._bindedForceUpdate,
            ),
            Ve.globalCloseDelegate.unsubscribe(this, this._handleGlobalClose)
        }
        componentDidUpdate(e, t) {
          this.state.lastAddedInterval &&
            setTimeout(() => this.setState({ lastAddedInterval: void 0 }), 400)
        }
        render() {
          const { isShownQuicks: e, id: t } = this.props,
            {
              activeInterval: n,
              customs: a,
              lastNotQuicked: o,
              isAddIntervalDialogOpened: s,
            } = this.state,
            l = this._getQuicks(),
            r = (0, Ee.sortResolutions)([...l])
          void 0 !== n && r.includes(n)
            ? void 0 !== o && r.push(o)
            : void 0 !== n && r.push(n)
          const c = (!(!e || 0 === l.length) || void 0) && r.length > 1,
            h = {},
            v = (0, Ee.mergeResolutions)(this._defaultIntervals, a)
          ;(void 0 !== n ? v.concat(n) : v)
            .filter(Ee.isAvailable)
            .forEach((e) => (h[e] = !0))
          const m =
            void 0 !== n ? (0, Ee.getTranslatedResolutionModel)(n) : null
          return i.createElement(
            p,
            { id: t },
            c &&
              i.createElement(
                x,
                { className: je.group, orientation: 'horizontal' },
                r.map((e, t) => {
                  const a = (0, Ee.getTranslatedResolutionModel)(e)
                  return i.createElement(C, {
                    key: t,
                    role: 'radio',
                    className: u(je.button, {
                      [je.first]: 0 === t,
                      [je.last]: t === r.length - 1,
                    }),
                    text: i.createElement(Me, {
                      value: a.mayOmitMultiplier ? void 0 : a.multiplier,
                      metric: a.shortKind,
                    }),
                    hint: a.hint,
                    'aria-checked': n === e,
                    isActive: n === e,
                    isDisabled: !h[e],
                    onClick: this._handeQuickClick,
                    onClickArg: e,
                    'data-value': e,
                  })
                }),
              ),
            i.createElement(
              _.MatchMedia,
              { rule: f.DialogBreakpoints.TabletSmall },
              (e) =>
                i.createElement(
                  i.Fragment,
                  null,
                  i.createElement(
                    ze.CloseDelegateContext.Provider,
                    { value: Xe },
                    i.createElement(
                      d.ToolbarMenuButton,
                      {
                        arrow: Boolean(c),
                        closeOnClickOutside: !0,
                        content:
                          c || null === m
                            ? void 0
                            : i.createElement(
                                p,
                                { className: je.menuContent },
                                i.createElement(Me, {
                                  value: m.mayOmitMultiplier
                                    ? void 0
                                    : m.multiplier,
                                  metric: m.shortKind,
                                }),
                              ),
                        hotKey: c ? Ye : void 0,
                        className: je.menu,
                        ref: this._menu,
                        isDrawer: e,
                        onClick: this._trackClick,
                        tooltip: c || null === m ? qe.timeInterval : m.hint,
                        menuReference: this._menuItemsContainerRef,
                      },
                      i.createElement(
                        'div',
                        { className: je.dropdown },
                        this._renderChildren(v, e),
                      ),
                    ),
                  ),
                  e &&
                    s &&
                    i.createElement(
                      i.Suspense,
                      { fallback: null },
                      i.createElement($e, {
                        onAdd: this._handleAddInterval,
                        onClose: this._handleCloseAddIntervalDialog,
                        onUnmount: this._handleCloseAddIntervalDialog,
                      }),
                    ),
                ),
            ),
          )
        }
        _createMenuItems(e, t) {
          const n = ((e) => {
            const t = Ue(De.ResolutionKind.Ticks),
              n = Ue(De.ResolutionKind.Seconds),
              a = Ue(De.ResolutionKind.Minutes),
              i = Ue(De.SpecialResolutionKind.Hours),
              o = Ue(De.ResolutionKind.Days),
              s = Ue(De.ResolutionKind.Range)
            return (
              e.forEach((e) => {
                const l = De.Interval.parse(e)
                l.isMinuteHours()
                  ? i.items.push(e)
                  : l.isMinutes()
                    ? (0, De.isHour)(Number(l.multiplier()))
                      ? i.items.push(e)
                      : a.items.push(e)
                    : l.isSeconds()
                      ? n.items.push(e)
                      : l.isDWM()
                        ? o.items.push(e)
                        : l.isRange()
                          ? s.items.push(e)
                          : l.isTicks() && t.items.push(e)
              }),
              [t, n, a, i, o, s].filter((e) => 0 !== e.items.length)
            )
          })(e).map((e, n, a) =>
            this._renderResolutionsGroup(e, 1 === a.length, t),
          )
          return ((e) => {
            let t = !1
            return e.filter((e, n, a) => {
              let i = !0
              return (
                e.type === S.PopupMenuSeparator &&
                  ((0 !== n && n !== a.length - 1) || (i = !1), t && (i = !1)),
                (t = e.type === S.PopupMenuSeparator),
                i
              )
            })
          })([].concat(...n))
        }
        _createIntervalForm(e) {
          if (this._customIntervals) {
            const t = e
              ? i.createElement(et, {
                  key: 'add-dialog',
                  onClick: this._handleOpenAddIntervalDialog,
                })
              : i.createElement(Re, {
                  key: 'add-form',
                  onAdd: this._handleAddInterval,
                  onCloseMenu: this._handleCloseMenu,
                  onOpenMenu: this._handleOpenMenu,
                  onSelect: this._updateMenuPosition,
                })
            return [
              i.createElement(S.PopupMenuSeparator, {
                key: 'custom-interval-separator',
              }),
              t,
            ]
          }
          return []
        }
        _renderResolutionsGroup(e, t = !1, n) {
          const a = [],
            o = e.items.map((e) => this._renderPopupMenuItem(e, n))
          if (t) a.push(...o)
          else if (n) {
            const t = i.createElement(tt, { key: e.id, title: e.name }, o)
            a.push(t)
          } else {
            const { intervalsMenuViewStateService: t } = this.context,
              { menuViewState: n } = this.state
            if (!t.isAllowed(e.id)) return []
            const s = i.createElement(
              Qe,
              {
                key: e.id,
                className: je.section,
                summary: e.name,
                open: !n[e.id],
                onStateChange: this._getHandleSectionStateChange(e.id),
              },
              o,
            )
            a.push(s)
          }
          return (
            (!e.mayOmitSeparator || e.items.length > 1) &&
              (a.unshift(
                i.createElement(S.PopupMenuSeparator, {
                  key: `begin-${e.name}`,
                }),
              ),
              a.push(
                i.createElement(S.PopupMenuSeparator, { key: `end-${e.name}` }),
              )),
            a
          )
        }
        _handleChangeFavorites(e) {
          this.setState({ lastNotQuicked: void 0, favorites: e })
        }
        _handleChangeCustoms(e) {
          this.setState({ customs: e })
        }
        _handleChangeMenuViewState(e) {
          this.setState({ menuViewState: e }, () => {
            this._menu.current && this._menu.current.update()
          })
        }
        _renderPopupMenuItem(e, t) {
          const { isFavoritingAllowed: n } = this.props,
            { activeInterval: a, lastAddedInterval: o } = this.state,
            s = e === a,
            l = (0, Ee.isAvailable)(e),
            r = this._isIntervalFavorite(e),
            c = this._isIntervalDefault(e),
            h = (0, Ee.getTranslatedResolutionModel)(e)
          return i.createElement(Be, {
            key: e,
            isSmallTablet: t,
            interval: e,
            hint: h.hint,
            isSignaling: o === e,
            isFavoritingAllowed: n,
            isDisabled: !l,
            isFavorite: r,
            isRemovable: !c,
            isActive: s,
            onClick: this._handleSelectInterval,
            onClickRemove: this._handleRemoveInterval,
            onClickFavorite: this._handleClickFavorite,
            'data-value': e,
          })
        }
        _isIntervalDefault(e) {
          return this._defaultIntervals.includes(e)
        }
        _isIntervalFavorite(e) {
          return this.state.favorites.includes(e)
        }
        _getQuicks(e) {
          return this.props.isShownQuicks && 'small' !== this.props.displayMode
            ? void 0 === e
              ? this.state.favorites
              : e
            : []
        }
        _trackClick() {
          0
        }
      }
      function et(e) {
        const { onClick: t, className: a } = e
        return i.createElement(
          'div',
          {
            key: 'add-dialog',
            className: u(je.addCustomInterval, a),
            onClick: t,
          },
          s.t(null, void 0, n(95798)) + '…',
        )
      }
      function tt(e) {
        const { children: t, title: n, className: a } = e
        return i.createElement(
          'div',
          { className: a },
          i.createElement('div', { className: je.smallTabletSectionTitle }, n),
          t,
        )
      }
      Je.contextType = Ge
      var nt = n(23902),
        at = n(82436)
      const it = (0, w.registryContextType)()
      class ot extends i.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._handleClick = () => {
              const {
                  chartWidgetCollection: e,
                  windowMessageService: t,
                  isFundamental: n,
                } = this.context,
                a = e.activeChartWidget.value()
              a.withModel(null, () => {
                t.post(parent, 'openChartInPopup', {
                  symbol: a.model().mainSeries().actualSymbol(),
                  interval: a.model().mainSeries().interval(),
                  fundamental: n,
                })
              })
            }),
            (0, w.validateRegistry)(t, {
              isFundamental: o.any,
              chartWidgetCollection: o.any.isRequired,
              windowMessageService: o.any.isRequired,
            })
        }
        render() {
          const { className: e } = this.props
          return i.createElement(G.ToolbarIconButton, {
            className: u(e, nt.button),
            icon: at,
            onClick: this._handleClick,
            tooltip: s.t(null, void 0, n(55520)),
          })
        }
      }
      ot.contextType = it
      var st = n(48449)
      const lt = (0, w.registryContextType)()
      class rt extends i.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._updateState = (e) => {
              this.setState({ isOpened: e })
            }),
            (this._handleClick = (e) => {
              const { chartWidgetCollection: t } = this.context,
                n = t.activeChartWidget.value()
              ;(0, K.trackEvent)(
                'GUI',
                'Chart Header Toolbar',
                'chart properties',
              ),
                n.showGeneralChartProperties(void 0, {
                  shouldReturnFocus: (0, Q.isKeyboardClick)(e),
                })
            }),
            (0, w.validateRegistry)(t, {
              chartWidgetCollection: o.any.isRequired,
            }),
            (this.state = { isOpened: !1 }),
            (this._propertiesDialogRenderer =
              this.context.chartWidgetCollection.getChartPropertiesDialogRenderer())
        }
        componentDidMount() {
          var e
          null === (e = this._propertiesDialogRenderer) ||
            void 0 === e ||
            e.visible().subscribe(this._updateState)
        }
        componentWillUnmount() {
          var e
          null === (e = this._propertiesDialogRenderer) ||
            void 0 === e ||
            e.visible().unsubscribe(this._updateState)
        }
        render() {
          const { isOpened: e } = this.state
          return i.createElement(G.ToolbarIconButton, {
            ...this.props,
            icon: st,
            isOpened: e,
            onClick: this._handleClick,
            tooltip: s.t(null, void 0, n(74207)),
          })
        }
      }
      rt.contextType = lt
      var ct = n(4741),
        ht = n(93352),
        dt = n(40173),
        ut = n(69297),
        vt = n(20461)
      ;(0, dt.mergeThemes)(ut.DEFAULT_MENU_ITEM_SWITCHER_THEME, vt)
      var mt = n(53180),
        pt = n(70152)
      function gt(e) {
        const { wasChanges: t, isSaving: a, className: o } = e
        return i.createElement(
          'span',
          { className: u(pt.saveString, !t && !a && pt.hidden, o) },
          a
            ? i.createElement(ve.Loader, {
                className: pt.loader,
                size: 'small',
                staticPosition: !0,
              })
            : s.t(null, void 0, n(85520)),
        )
      }
      var bt = n(36296),
        Ct = n(63672),
        St = n(92998)
      n(40670)
      const _t = a.enabled('widget'),
        ft = s.t(null, void 0, n(75789)),
        yt = (0, dt.mergeThemes)(U.DEFAULT_TOOL_WIDGET_BUTTON_THEME, St),
        wt = (0, dt.mergeThemes)(se.DEFAULT_POPUP_MENU_ITEM_THEME, {
          shortcut: Ct.shortcut,
          withIcon: Ct.withIcon,
        }),
        Et = s.t(null, void 0, n(80959)),
        Tt = s.t(null, void 0, n(11680)),
        Mt = [],
        It = (0, X.hotKeySerialize)({
          keys: [(0, $.humanReadableModifiers)($.Modifiers.Mod, !1), 'S'],
          text: '{0} + {1}',
        })
      class kt extends i.PureComponent {
        constructor(e) {
          super(e),
            (this._copyElRef = i.createRef()),
            (this._handleCopyLinkClick = () => Promise.resolve()),
            (this._handleCloneClick = () => {
              var e, t
              null === (t = (e = this.props).onCloneChart) ||
                void 0 === t ||
                t.call(e)
            }),
            (this._handleSaveClick = () => {
              var e, t
              null === (t = (e = this.props).onSaveChart) ||
                void 0 === t ||
                t.call(e),
                this._trackClick()
            }),
            (this._handleSaveAsClick = () => {
              var e, t
              null === (t = (e = this.props).onSaveAsChart) ||
                void 0 === t ||
                t.call(e)
            }),
            (this.state = { isSaving: !1 })
        }
        componentDidUpdate(e, t) {
          e.isProcessing &&
            !this.props.isProcessing &&
            (clearTimeout(this._timeout),
            (this._timeout = void 0),
            this.setState({ isSaving: !1 })),
            !e.isProcessing &&
              this.props.isProcessing &&
              (this._timeout = setTimeout(() => {
                this.setState({ isSaving: !0 })
              }, 1e3))
        }
        componentWillUnmount() {
          this._timeout && clearTimeout(this._timeout)
        }
        render() {
          const {
              id: e,
              isReadOnly: t,
              displayMode: a,
              isProcessing: o,
              title: l,
              wasChanges: r,
              hideMenu: c,
              isTabletSmall: v,
              onOpenMenu: m,
              dataNameSaveMenu: g,
              isSaveDialogOpened: b,
            } = this.props,
            C = !t && !c,
            S = !(r || !l || this.state.isSaving),
            _ = i.createElement(
              'div',
              { className: Ct.textWrap },
              i.createElement(
                'span',
                { className: Ct.text },
                l || s.t(null, void 0, n(85520)),
              ),
              i.createElement(gt, {
                isSaving: this.state.isSaving,
                wasChanges: r,
              }),
            )
          return i.createElement(
            p,
            null,
            t
              ? i.createElement(
                  p,
                  null,
                  i.createElement(Z, {
                    id: e,
                    displayMode: a,
                    icon: i.createElement(h.Icon, { icon: bt }),
                    isDisabled: o,
                    onClick: this._handleCloneClick,
                    text: s.t(null, void 0, n(35216)),
                    collapseWhen: Mt,
                    tooltip: Et,
                  }),
                )
              : i.createElement(
                  p,
                  null,
                  i.createElement(Z, {
                    id: e,
                    className: u(Ct.button, C && Ct.buttonSmallPadding),
                    displayMode: a,
                    'aria-disabled': !!S || void 0,
                    isDisabled: o,
                    onClick: S ? void 0 : this._handleSaveClick,
                    text: _,
                    theme: yt,
                    collapseWhen: Mt,
                    isOpened: b,
                    tooltip: S
                      ? s.t(null, void 0, n(88368))
                      : s.t(null, void 0, n(87409)),
                    'data-tooltip-hotkey': _t || S ? '' : It,
                  }),
                  C &&
                    i.createElement(
                      d.ToolbarMenuButton,
                      {
                        'data-name': g,
                        arrow: !0,
                        isDrawer: v,
                        drawerPosition: 'Bottom',
                        onClick: this._trackClick,
                        onOpen: m,
                        tooltip: s.t(null, void 0, n(58219)),
                      },
                      this._renderMenuItems(Boolean(v)),
                    ),
                ),
          )
        }
        _renderMenuItems(e) {
          const {
              wasChanges: t,
              isProcessing: a,
              chartId: o,
              onSaveChartFromMenu: l,
              onRenameChart: r,
              onLoadChart: c,
              onNewChart: h,
              isAutoSaveEnabled: d,
              autoSaveId: v,
              sharingId: m,
              onAutoSaveChanged: p,
              isSharingEnabled: g,
              onSharingChanged: b,
              layoutItems: C,
              onExportData: _,
              isAuthenticated: f,
            } = this.props,
            w = e ? y.multilineLabelWithIconAndToolboxTheme : wt,
            E = e ? void 0 : (0, $.humanReadableHash)($.Modifiers.Mod + 83),
            T = e ? void 0 : s.t(null, { context: 'hotkey' }, n(14229)),
            M = []
          return (
            M.push(
              i.createElement(A.AccessibleMenuItem, {
                key: 'save',
                isDisabled: Boolean(a || (!t && o)),
                label: Tt,
                onClick: l,
                shortcut: E,
                labelRowClassName: u(e && Ct.popupItemRowTabletSmall),
                theme: w,
                'data-name': 'save-load-menu-item-save',
              }),
            ),
            void 0 !== o &&
              M.push(
                i.createElement(A.AccessibleMenuItem, {
                  key: 'rename',
                  icon: void 0,
                  label: (0, mt.appendEllipsis)(s.t(null, void 0, n(35038))),
                  onClick: r,
                  labelRowClassName: u(e && Ct.popupItemRowTabletSmall),
                  theme: w,
                  'data-name': 'save-load-menu-item-rename',
                }),
                i.createElement(A.AccessibleMenuItem, {
                  key: 'save-as',
                  icon: void 0,
                  label: (0, mt.appendEllipsis)(Et),
                  onClick: this._handleSaveAsClick,
                  labelRowClassName: u(e && Ct.popupItemRowTabletSmall),
                  theme: w,
                  'data-name': 'save-load-menu-item-clone',
                }),
              ),
            M.push(
              i.createElement(S.PopupMenuSeparator, {
                key: 'all-layouts-separator',
              }),
              i.createElement(A.AccessibleMenuItem, {
                key: 'all-layouts',
                className: 'js-save-load-menu-item-load-chart',
                label: (0, mt.appendEllipsis)(ft),
                onClick: c,
                labelRowClassName: u(e && Ct.popupItemRowTabletSmall),
                theme: w,
                shortcut: T,
                'data-name': 'save-load-menu-item-load',
              }),
            ),
            M
          )
        }
        _trackClick() {
          0
        }
      }
      ;(0, i.forwardRef)((e, t) => {
        const { isTabletSmall: a, onClick: o } = e,
          [l, r] = (0, P.useRovingTabindexElement)(t)
        return i.createElement(
          'div',
          {
            ref: l,
            className: u(
              Ct.copyLink,
              a && Ct.copyLinkMobile,
              k.PLATFORM_ACCESSIBILITY_ENABLED && Ct.accessibleLabel,
            ),
            onClick: o,
            tabIndex: r,
            onKeyDown: (e) => {
              if (
                !k.PLATFORM_ACCESSIBILITY_ENABLED ||
                e.target !== e.currentTarget
              )
                return
              const t = (0, $.hashFromEvent)(e)
              ;(13 !== t && 32 !== t) ||
                (e.preventDefault(),
                l.current instanceof HTMLElement && l.current.click())
            },
            'data-role': k.PLATFORM_ACCESSIBILITY_ENABLED ? 'menuitem' : void 0,
          },
          s.t(null, void 0, n(7367)),
        )
      })
      const xt = (0, w.registryContextType)()
      class At extends i.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._exportDialogPromise = null),
            (this._layoutsAbortController = null),
            (this._requestRecentLayouts = () => {}),
            (this._handleExportData = () => {
              0
            }),
            (this._onSaveDialogVisibleChange = (e) => {
              this.setState({ isSaveDialogOpened: e })
            }),
            (this._syncState = (e) => {
              this.setState(e)
            }),
            (this._onChangeHasChanges = (e) => {
              this.state.wasChanges !== e && this.setState({ wasChanges: e })
            }),
            (this._onChangeAutoSaveEnabled = (e) => {
              0
            }),
            (this._onChangeSharingEnabled = (e) => {
              this.setState({ isSharingEnabled: e })
            }),
            (this._onChangeTitle = (e) => {
              this.setState({ title: e })
            }),
            (this._onChangeId = (e) => {
              this.setState({ id: e })
            }),
            (this._onChartAboutToBeSaved = () => {
              this.setState({ isProcessing: !0 })
            }),
            (this._onChartSaved = () => {
              this.setState({ isProcessing: !1 })
            }),
            (this._handleAutoSaveEnabled = (e) => {
              0
            }),
            (this._handleSharingEnabled = (e) => {
              0
            }),
            (this._handleClickSave = () => {
              this.context.saveChartService.saveChartOrShowTitleDialog(),
                this._trackEvent('Save click')
            }),
            (this._handleOpenMenu = () => {
              this._requestRecentLayouts()
            }),
            (this._handleClickSaveFromMenu = () => {
              this.context.saveChartService.saveChartOrShowTitleDialog(),
                this._trackEvent('Save From Menu')
            }),
            (this._handleClickClone = () => {
              this.context.saveChartService.cloneChart()
            }),
            (this._handleClickSaveAs = () => {
              this.context.saveChartService.saveChartAs(),
                this._trackEvent('Make a copy')
            }),
            (this._handleClickNew = () => {
              this._trackEvent('New chart layout')
            }),
            (this._handleClickLoad = () => {
              this.context.loadChartService.showLoadDialog()
              this._trackEvent('Load chart layout')
            }),
            (this._handleHotkey = () => {
              this.context.loadChartService.showLoadDialog()
            }),
            (this._handleClickRename = () => {
              this.context.saveChartService.renameChart(),
                this._trackEvent('Rename')
            }),
            (0, w.validateRegistry)(t, {
              chartWidgetCollection: o.any.isRequired,
              chartChangesWatcher: o.any.isRequired,
              saveChartService: o.any.isRequired,
              sharingChartService: o.any,
              loadChartService: o.any.isRequired,
            })
          const {
            chartWidgetCollection: n,
            chartChangesWatcher: a,
            saveChartService: i,
            sharingChartService: s,
          } = t
          this.state = {
            isAuthenticated: window.is_authenticated,
            isProcessing: !1,
            id: n.metaInfo.id.value(),
            title: n.metaInfo.name.value(),
            wasChanges: a.hasChanges(),
            iconHovered: !1,
            isSaveDialogOpened: !1,
          }
        }
        componentDidMount() {
          const { chartSaver: e, isFake: t, stateSyncEmitter: a } = this.props,
            {
              chartWidgetCollection: i,
              chartChangesWatcher: o,
              saveChartService: l,
              sharingChartService: r,
            } = this.context
          t
            ? a.on('change', this._syncState)
            : (o.getOnChange().subscribe(this, this._onChangeHasChanges),
              i.metaInfo.name.subscribe(this._onChangeTitle),
              i.metaInfo.id.subscribe(this._onChangeId),
              (this._hotkeys = (0, ct.createGroup)({ desc: 'Save/Load' })),
              this._hotkeys.add({
                desc: s.t(null, void 0, n(75687)),
                handler: this._handleHotkey,
                hotkey: 190,
              }),
              e.chartSaved().subscribe(this, this._onChartSaved),
              e
                .chartAboutToBeSaved()
                .subscribe(this, this._onChartAboutToBeSaved),
              window.loginStateChange.subscribe(this, this._onLoginStateChange),
              this.context.saveChartService
                .getCreateController()
                .visible()
                .subscribe(this._onSaveDialogVisibleChange))
        }
        componentDidUpdate(e, t) {
          this.props.isFake ||
            (t !== this.state &&
              this.props.stateSyncEmitter.emit('change', this.state))
        }
        componentWillUnmount() {
          var e
          const { chartSaver: t, isFake: n, stateSyncEmitter: a } = this.props,
            {
              chartWidgetCollection: i,
              chartChangesWatcher: o,
              saveChartService: s,
              sharingChartService: l,
            } = this.context
          n
            ? a.off('change', this._syncState)
            : (o.getOnChange().unsubscribe(this, this._onChangeHasChanges),
              i.metaInfo.name.unsubscribe(this._onChangeTitle),
              i.metaInfo.id.unsubscribe(this._onChangeId),
              (0, oe.ensureDefined)(this._hotkeys).destroy(),
              t.chartSaved().unsubscribe(this, this._onChartSaved),
              t
                .chartAboutToBeSaved()
                .unsubscribe(this, this._onChartAboutToBeSaved),
              window.loginStateChange.unsubscribe(
                this,
                this._onLoginStateChange,
              ),
              null === (e = this._layoutsAbortController) ||
                void 0 === e ||
                e.abort(),
              this.context.saveChartService
                .getCreateController()
                .visible()
                .unsubscribe(this._onSaveDialogVisibleChange))
        }
        render() {
          const {
              isReadOnly: e,
              displayMode: t,
              id: n,
              isFake: a,
            } = this.props,
            {
              isProcessing: o,
              isAuthenticated: s,
              title: l,
              id: r,
              wasChanges: c,
              isAutoSaveEnabled: h,
              isSharingEnabled: d,
              recentLayouts: u,
              isSaveDialogOpened: v,
            } = this.state,
            m = {
              displayMode: t,
              isReadOnly: e,
              isAuthenticated: s,
              isProcessing: o,
              wasChanges: c,
              title: l,
              id: n,
              isSaveDialogOpened: v,
              chartId: null !== r ? r : void 0,
              dataNameSaveMenu: a ? void 0 : 'save-load-menu',
              onCloneChart: this._handleClickClone,
              onSaveChart: this._handleClickSave,
              onSaveChartFromMenu: this._handleClickSaveFromMenu,
              onRenameChart: this._handleClickRename,
              onSaveAsChart: this._handleClickSaveAs,
              onLoadChart: this._handleClickLoad,
            }
          return i.createElement(
            _.MatchMedia,
            { rule: f.DialogBreakpoints.TabletSmall },
            (e) => i.createElement(kt, { ...m, isTabletSmall: e }),
          )
        }
        _onLoginStateChange() {
          this.setState({
            isAuthenticated: window.is_authenticated,
          })
        }
        _trackEvent(e) {
          0
        }
      }
      At.contextType = xt
      var Rt = n(53166),
        Lt = n(34928),
        Nt = n(79982)
      const Ft = new Lt.DateTimeFormatter({
          dateTimeSeparator: '_',
          timeFormat: '%h-%m-%s',
        }),
        Ot = { takeSnapshot: s.t(null, void 0, n(88513)) },
        Ht = (0, w.registryContextType)()
      const Bt = s.t(null, void 0, n(90879))
      function Dt(e, t, n) {
        return (async (e, t, n) => {
          const a = URL.createObjectURL(
            new Blob(
              [
                `<!doctype html><html style="background-color:${getComputedStyle(document.documentElement).backgroundColor}"><head><meta charset="utf-8"><title>${Bt}</title></head><body style="background-color:${getComputedStyle(document.body).backgroundColor}"></body></html>`,
              ],
              { type: 'text/html' },
            ),
          )
          try {
            const i = open(a, t, n)
            if (!i) throw new Error('cound not open a new tab')
            const o = await e.catch(() => {})
            void 0 !== o ? i.location.replace(o) : i.close()
          } finally {
            URL.revokeObjectURL(a)
          }
        })(e, t, n)
      }
      var Pt = n(65446),
        Ut = n(65939),
        Wt = n(64618)
      function zt(e) {
        const t = u(e.isLoading && Wt.hidden),
          n = u(!e.isLoading && Wt.hidden)
        return i.createElement(
          'div',
          null,
          i.createElement('span', { className: t }, e.children),
          i.createElement(
            'span',
            { className: n },
            i.createElement(ve.Loader, null),
          ),
        )
      }
      var Vt = n(76974),
        Zt = n(49483),
        Kt = n(67487),
        Qt = n(1457),
        jt = n(23595),
        qt = n(29414),
        Yt = n(99280),
        Gt = n(18369)
      const Xt = (0, dt.mergeThemes)(se.DEFAULT_POPUP_MENU_ITEM_THEME, Gt)
      function $t(e) {
        const { serverSnapshot: t, clientSnapshot: a, hideShortcuts: o } = e,
          [l, r] = (0, i.useState)(!1),
          [c, h] = (0, i.useState)(!1),
          [d, v] = (0, i.useState)(!1),
          [m, p] = (0, i.useState)(!1),
          g = (0, Vt.useIsMounted)(),
          b = (0, i.useCallback)(async () => {
            var e
            const t = a(),
              n = t.then(
                (e) =>
                  new Promise((t) =>
                    e.canvas.toBlob((e) => {
                      null !== e && t(e)
                    }),
                  ),
              )
            try {
              await (0, Pt.writePromiseUsingApi)(n, 'image/png'),
                be.emit('onClientScreenshotCopiedToClipboard')
            } catch (n) {
              const { canvas: a } = await t
              null === (e = window.open()) ||
                void 0 === e ||
                e.document.write(`<img width="100%" src="${a.toDataURL()}"/>`)
            }
          }, [a]),
          C = (0, i.useCallback)(async () => {
            const e = await a(),
              t = await ((e) =>
                new Promise((t) => {
                  try {
                    e.canvas.toBlob((e) => {
                      if (null === e) throw new Error('Unable to generate blob')
                      t(URL.createObjectURL(e))
                    })
                  } catch (n) {
                    t(e.canvas.toDataURL())
                  }
                }))(e)
            t && (0, Ut.downloadFile)(`${e.name}.png`, t)
          }, [a]),
          S = (e) => Dt(e.then((e) => e.imageUrl)),
          _ = (0, i.useCallback)(
            async (e = !1) => {
              const n = t()
              try {
                if (e) await S(n)
                else {
                  const e = n.then(
                    (e) => new Blob([e.imageUrl], { type: 'text/plain' }),
                  )
                  await (0, Pt.writePromiseUsingApi)(e, 'text/plain'),
                    be.emit('onServerScreenshotCopiedToClipboard')
                }
                return !0
              } catch (e) {
                return S(n), !0
              } finally {
                g.current && (h(!1), r(!1), (0, Ve.globalCloseMenu)())
              }
            },
            [t],
          ),
          f =
            ((0, i.useCallback)(async () => {
              const e = t()
              try {
                const t = 720,
                  n = e.then(async (e) => {
                    var n, a, i
                    const o = await snapshoter().getSnapshot(
                        e.symbol,
                        new Set(['description']),
                      ),
                      s =
                        'error' !== o.status ? o.values.description : e.symbol,
                      l =
                        null !==
                          (a =
                            null ===
                              (n = e.imageUrl.match(/\/x\/([0-9a-zA-Z]{8})/)) ||
                            void 0 === n
                              ? void 0
                              : n[1]) && void 0 !== a
                          ? a
                          : '',
                      r =
                        null === (i = createSnapshotImageUrls(l)) ||
                        void 0 === i
                          ? void 0
                          : i.url
                    return new Blob(
                      [
                        `<img width="${t}" loading="lazy" src="${r}"/><p><a href="https://www.tradingview.com${getSymbolPagePath(
                          { shortName: e.symbol },
                        )}">${s} chart</a> by TradingView</p>`,
                      ],
                      { type: 'text/plain' },
                    )
                  })
                return (
                  await (0, Pt.writePromiseUsingApi)(n, 'text/plain'),
                  be.emit('onServerScreenshotEmbedCodeCopiedToClipboard'),
                  !0
                )
              } catch (t) {
                return S(e), !0
              } finally {
                g.current && (v(!1), (0, Ve.globalCloseMenu)())
              }
            }, [t]),
            (0, i.useCallback)(async () => {
              p(!0)
              const [e, a] = await Promise.all([
                n.e(4665).then(n.bind(n, 65692)),
                t(),
              ])
              e.Twitter.shareSnapshotInstantly(a.symbol, a.imageUrl),
                g.current && (p(!1), (0, Ve.globalCloseMenu)())
            }, [t]))
        return i.createElement(
          i.Fragment,
          null,
          i.createElement(
            ge.ToolWidgetMenuSummary,
            null,
            s.t(null, void 0, n(45888)),
          ),
          i.createElement(A.AccessibleMenuItem, {
            'data-name': 'save-chart-image',
            label: s.t(null, void 0, n(39011)),
            icon: jt,
            onClick: C,
            shortcut: o
              ? void 0
              : (0, $.humanReadableHash)(
                  $.Modifiers.Mod + $.Modifiers.Alt + 83,
                ),
            theme: Xt,
          }),
          i.createElement(A.AccessibleMenuItem, {
            'data-name': 'copy-chart-image',
            label: s.t(null, void 0, n(43001)),
            icon: Qt,
            onClick: b,
            shortcut: o
              ? void 0
              : (0, $.humanReadableHash)(
                  $.Modifiers.Mod + $.Modifiers.Shift + 83,
                ),
            theme: Xt,
          }),
          !(0, Zt.onWidget)() &&
            i.createElement(A.AccessibleMenuItem, {
              'data-name': 'copy-link-to-the-chart-image',
              label: i.createElement(
                zt,
                { isLoading: l },
                s.t(null, void 0, n(7367)),
              ),
              icon: qt,
              onClick: () => {
                r(!0), _(!1)
              },
              dontClosePopup: !0,
              isDisabled: l,
              shortcut: o
                ? void 0
                : (0, $.humanReadableHash)($.Modifiers.Alt + 83),
              className: u(l && Gt.loading),
              theme: Xt,
            }),
          !1,
          !(0, Zt.onWidget)() &&
            i.createElement(A.AccessibleMenuItem, {
              'data-name': 'open-image-in-new-tab',
              label: i.createElement(
                zt,
                { isLoading: c },
                s.t(null, void 0, n(38543)),
              ),
              icon: Yt,
              onClick: () => {
                h(!0), _(!0)
              },
              dontClosePopup: !0,
              isDisabled: c,
              className: u(c && Gt.loading),
              theme: Xt,
            }),
          !(0, Zt.onWidget)() &&
            i.createElement(A.AccessibleMenuItem, {
              'data-name': 'tweet-chart-image',
              label: i.createElement(
                zt,
                { isLoading: m },
                s.t(null, void 0, n(99746)),
              ),
              icon: Kt,
              onClick: f,
              dontClosePopup: !0,
              isDisabled: m,
              className: u(m && Gt.loading),
              theme: Xt,
            }),
        )
      }
      var Jt = n(84015)
      function en(e) {
        const [t, n] = (0, i.useState)(!1),
          a = (0, Vt.useIsMounted)(),
          o = (0, i.useCallback)(async () => {
            n(!0), await e.serverSnapshot(), a.current && n(!1)
          }, [e.serverSnapshot])
        return i.createElement(U.ToolWidgetButton, {
          id: e.id,
          className: e.className,
          isDisabled: t,
          onClick: o,
          title: e.tooltip,
          icon: e.icon,
        })
      }
      var tn = n(72644)
      const nn =
        ((an = (e) =>
          (0, Jt.isOnMobileAppPage)('any')
            ? i.createElement(en, { ...e, icon: tn })
            : i.createElement(
                d.ToolbarMenuButton,
                {
                  content: i.createElement(U.ToolWidgetButton, {
                    tag: 'div',
                    id: e.id,
                    className: e.className,
                    icon: tn,
                  }),
                  drawerPosition: 'Bottom',
                  drawerBreakpoint: f.DialogBreakpoints.TabletSmall,
                  arrow: !1,
                  onClick: () => {},
                  tooltip: e.tooltip,
                },
                i.createElement($t, { ...e }),
              )),
        ((on = class extends i.PureComponent {
          constructor(e, t) {
            super(e, t),
              (this._clientSnapshot = async () => {
                const e = this.context.chartWidgetCollection.activeChartWidget
                  .value()
                  .model()
                  .mainSeries()
                  .actualSymbol()
                return {
                  canvas:
                    await this.context.chartWidgetCollection.clientSnapshot(),
                  name: `${(0, Nt.shortName)(e)}_${Ft.formatLocal(new Date())}`,
                }
              }),
              (this._serverSnapshot = async () => {
                const e = this.context.chartWidgetCollection.activeChartWidget
                    .value()
                    .model()
                    .mainSeries()
                    .actualSymbol(),
                  t = await this.context.chartWidgetCollection.takeScreenshot(),
                  n =
                    a.enabled('charting_library_base') &&
                    void 0 !== this.context.snapshotUrl
                      ? t
                      : (0, Rt.convertImageNameToUrl)(t)
                return { symbol: (0, Nt.shortName)(e), imageUrl: n }
              }),
              (0, w.validateRegistry)(t, {
                chartWidgetCollection: o.any.isRequired,
              })
          }
          render() {
            const { className: e, id: t } = this.props
            return i.createElement(an, {
              id: t,
              className: e,
              tooltip: Ot.takeSnapshot,
              serverSnapshot: this._serverSnapshot,
              clientSnapshot: this._clientSnapshot,
            })
          }
        }).contextType = Ht),
        on)
      var an,
        on,
        sn = n(31330),
        ln = n(39362),
        rn = n(13702)
      class cn {
        async show(e) {
          if (null !== cn._provider) {
            const e = await cn._provider.getSymbol()
            return (
              l.linking.setSymbolAndLogInitiator(e.symbol, 'symbol search UI'),
              e
            )
          }
          if (cn._currentShowingInstance)
            throw new DOMException(
              'SymbolSearchUI is already shown',
              'InvalidStateError',
            )
          try {
            ;(cn._currentShowingInstance = this), cn.preload()
            const t = await cn._implementation
            return (
              (0, oe.assert)(null !== t),
              new Promise((n) => {
                t.showDefaultSearchDialog({
                  ...e,
                  onSearchComplete: (e) => {
                    n({ symbol: e })
                  },
                })
              })
            )
          } finally {
            cn._currentShowingInstance = null
          }
        }
        static setProvider(e) {
          this._provider = e
        }
        static preload() {
          null === this._provider &&
            null === this._implementation &&
            (this._implementation = (0, rn.loadNewSymbolSearch)())
        }
      }
      ;(cn._currentShowingInstance = null),
        (cn._provider = null),
        (cn._implementation = null)
      var hn = n(29142),
        dn = n(25882)
      const un = (0, dt.mergeThemes)(g.DEFAULT_TOOLBAR_BUTTON_THEME, dn)
      class vn extends i.PureComponent {
        constructor(e) {
          super(e),
            (this._openSymbolSearchDialog = async (e) => {
              if ((0, $.modifiersFromEvent)(e) !== $.Modifiers.Alt) {
                if (!this.state.isOpened)
                  try {
                    ;(0, K.trackEvent)('GUI', 'SS', 'main search'),
                      await new cn().show({
                        trackResultsOptions: {
                          trackResults: !1,
                          emptySearchType: 'empty_result__supercharts',
                        },
                        onClose: () => {
                          this.setState({ isOpened: !1 })
                        },
                        onOpen: () => {
                          this.setState({ isOpened: !0 })
                        },
                        shouldReturnFocus: (0, Q.isKeyboardClick)(e),
                        defaultValue: this._isSpread(this.state.symbol)
                          ? this.state.symbol
                          : this.state.shortName,
                        showSpreadActions:
                          (0, sn.canShowSpreadActions)() &&
                          this.props.isActionsVisible,
                        source: 'searchBar',
                        footer: Fe.mobiletouch
                          ? void 0
                          : i.createElement(
                              ln.SymbolSearchDialogFooter,
                              null,
                              s.t(null, void 0, n(20987)),
                            ),
                      })
                  } catch (e) {}
              } else (0, ht.getClipboard)().writeText(this.state.symbol)
            }),
            (this._isSpread = (e) => !1),
            (this._onSymbolChanged = () => {
              const e = l.linking.proSymbol.value()
              this.setState({ symbol: e, shortName: mn() })
            }),
            (this.state = {
              symbol: l.linking.proSymbol.value(),
              shortName: mn(),
              isOpened: !1,
            })
        }
        componentDidMount() {
          l.linking.proSymbol.subscribe(this._onSymbolChanged),
            l.linking.seriesShortSymbol.subscribe(this._onSymbolChanged),
            cn.preload()
        }
        componentWillUnmount() {
          l.linking.proSymbol.unsubscribe(this._onSymbolChanged),
            l.linking.seriesShortSymbol.unsubscribe(this._onSymbolChanged)
        }
        render() {
          const { id: e, className: t } = this.props
          return i.createElement(g.ToolbarButton, {
            id: e,
            className: v()(
              t,
              a.enabled('uppercase_instrument_names') && dn.uppercase,
              dn.smallLeftPadding,
            ),
            theme: un,
            icon: hn,
            isOpened: this.state.isOpened,
            text: this.state.shortName,
            onClick: this._openSymbolSearchDialog,
            tooltip: s.t(null, void 0, n(99983)),
          })
        }
        async _updateQuotes(e) {}
      }
      function mn() {
        return (
          l.linking.seriesShortSymbol.value() ||
          l.linking.proSymbol.value() ||
          ''
        )
      }
      var pn = n(5145)
      function gn(e) {
        var t
        const { className: n, item: a, onApply: o } = e,
          [s, l] = (0, P.useRovingTabindexElement)(null)
        return k.PLATFORM_ACCESSIBILITY_ENABLED
          ? i.createElement(
              'button',
              {
                type: 'button',
                className: u(n, pn.item, pn.accessible, 'apply-common-tooltip'),
                onClick: r,
                'data-tooltip': a.name,
                'aria-label': a.name,
                tabIndex: l,
                ref: s,
              },
              i.createElement(
                'div',
                { className: pn.round },
                null !==
                  (t = ((e) => {
                    var t
                    const n = Intl.Segmenter
                    if (n) {
                      const a = new n(void 0, { granularity: 'grapheme' }),
                        [{ segment: i } = { segment: null }] = a.segment(e)
                      return null !==
                        (t = null == i ? void 0 : i.toUpperCase()) &&
                        void 0 !== t
                        ? t
                        : null
                    }
                    {
                      const t = e.codePointAt(0)
                      return t ? String.fromCodePoint(t).toUpperCase() : null
                    }
                  })(a.name)) && void 0 !== t
                  ? t
                  : ' ',
              ),
            )
          : i.createElement(
              'div',
              {
                className: u(n, pn.item, 'apply-common-tooltip'),
                onClick: r,
                'data-tooltip': a.name,
              },
              i.createElement(
                'div',
                { className: pn.round },
                a.name.length > 0 ? a.name[0].toUpperCase() : ' ',
              ),
            )
        function r(e) {
          e.stopPropagation(), o(a)
        }
      }
      var bn = n(39344),
        Cn = n(92710)
      function Sn(e) {
        return i.createElement(
          'div',
          { className: u(Cn.description, e.className) },
          e.children,
        )
      }
      var _n = n(48261)
      const fn = (0, dt.mergeThemes)(se.DEFAULT_POPUP_MENU_ITEM_THEME, {
          labelRow: _n.labelRow,
          toolbox: _n.toolbox,
          item: _n.titleItem,
        }),
        yn = (0, dt.mergeThemes)(se.DEFAULT_POPUP_MENU_ITEM_THEME, {
          labelRow: _n.labelRow,
          toolbox: _n.toolbox,
          item: _n.titleItemTabletSmall,
        }),
        wn = (0, dt.mergeThemes)(se.DEFAULT_POPUP_MENU_ITEM_THEME, {
          item: _n.item,
        }),
        En = (0, dt.mergeThemes)(se.DEFAULT_POPUP_MENU_ITEM_THEME, {
          item: _n.itemTabletSmall,
        })
      function Tn(e) {
        const {
            className: t,
            item: n,
            onApply: a,
            onRemove: o,
            onFavor: s,
            favorite: l,
            isFavoritingAllowed: r,
            isTabletSmall: c,
          } = e,
          [h, d] = (0, Ne.useHover)(),
          u = n.meta_info,
          m = u ? (0, bn.descriptionString)(u.indicators) : void 0,
          p = c ? yn : fn,
          g = c ? En : wn,
          b = (0, i.useCallback)(() => a(n), [a, n]),
          C = (0, i.useCallback)((e) => o(n, e), [o, n]),
          S = (0, i.useCallback)(() => {
            s && s(n)
          }, [s, n])
        return i.createElement(
          'div',
          {
            ...d,
            className: v()(t, _n.wrap),
            'data-name': n.name,
            'data-id': n.id,
            'data-is-default': Boolean(n.is_default),
          },
          i.createElement(A.AccessibleMenuItem, {
            theme: p,
            label: n.name,
            labelRowClassName: v()(c && _n.itemLabelTabletSmall),
            isHovered: h,
            showToolboxOnHover: !l && !h,
            showToolboxOnFocus: k.PLATFORM_ACCESSIBILITY_ENABLED,
            onClick: b,
            toolbox: i.createElement(
              i.Fragment,
              null,
              !n.is_default &&
                i.createElement(Oe.MenuRemoveButton, {
                  key: 'remove',
                  hidden: !Fe.touch && !h,
                  onClick: C,
                  className: _n.remove,
                }),
              Boolean(s) &&
                r &&
                i.createElement(R.MenuFavoriteButton, {
                  key: 'favorite',
                  isFilled: Boolean(l),
                  onClick: S,
                }),
            ),
          }),
          m &&
            i.createElement(se.PopupMenuItem, {
              theme: g,
              label: i.createElement(
                Sn,
                {
                  className: v()(
                    _n.description,
                    c && _n.descriptionTabletSmall,
                  ),
                },
                m,
              ),
              onClick: b,
              isHovered: h,
            }),
        )
      }
      var Mn = n(53707),
        In = n(85013)
      const kn = (0, dt.mergeThemes)(se.DEFAULT_POPUP_MENU_ITEM_THEME, In)
      function xn(e) {
        const { onClick: t, isTabletSmall: a, className: o } = e
        return i.createElement(A.AccessibleMenuItem, {
          theme: kn,
          className: v()(o, In.wrap),
          label: i.createElement(
            'div',
            { className: In.titleWrap },
            i.createElement(
              'div',
              {
                className: v()(In.title, a && In.titleTabletSmall),
              },
              i.createElement(h.Icon, { className: In.icon, icon: Mn }),
              i.createElement(
                'div',
                { className: In.text },
                (0, mt.appendEllipsis)(s.t(null, void 0, n(92093))),
              ),
            ),
          ),
          onClick: t,
        })
      }
      var An = n(36947),
        Rn = n(64706)
      const Ln = i.createContext(null)
      var Nn = n(36001)
      function Fn(e) {
        const {
            templates: t,
            favorites: n,
            onTemplateSave: a,
            onTemplateRemove: o,
            onTemplateSelect: s,
            onTemplateFavorite: l,
            isTabletSmall: r,
            isLoading: c,
          } = e,
          h = (0, i.useMemo)(() => t.filter((e) => e.is_default), [t]),
          d = (0, i.useMemo)(() => t.filter((e) => !e.is_default), [t]),
          u = (0, i.useMemo)(() => new Set(n.map((e) => e.name)), [n]),
          m = (0, i.useContext)(Ln),
          p = (0, i.useContext)(Rn.MenuContext),
          g = (0, An.useForceUpdate)()
        ;(0, i.useEffect)(() => {
          if (null !== m) {
            const e = {}
            return (
              m.getOnChange().subscribe(e, () => {
                g(), p && p.update()
              }),
              () => m.getOnChange().unsubscribeAll(e)
            )
          }
          return () => {}
        }, [])
        const b = (e) =>
          i.createElement(Tn, {
            key: e.name,
            item: e,
            isFavoritingAllowed: Boolean(l),
            favorite: u.has(e.name),
            onApply: s,
            onFavor: l,
            onRemove: o,
            isTabletSmall: r,
          })
        return i.createElement(
          'div',
          { className: v()(Nn.menu, r && Nn.menuSmallTablet) },
          i.createElement(xn, { onClick: a, isTabletSmall: r }),
          c &&
            i.createElement(
              i.Fragment,
              null,
              i.createElement(S.PopupMenuSeparator, null),
              i.createElement(pe, null),
            ),
          !c &&
            (r
              ? i.createElement(On, { defaults: h, customs: d, render: b })
              : i.createElement(Hn, {
                  defaults: h,
                  customs: d,
                  render: b,
                  state: m,
                })),
        )
      }
      function On(e) {
        const { defaults: t, customs: a, render: o } = e
        return i.createElement(
          i.Fragment,
          null,
          a.length > 0 &&
            i.createElement(
              i.Fragment,
              null,
              i.createElement(S.PopupMenuSeparator, null),
              i.createElement(
                ge.ToolWidgetMenuSummary,
                { className: Nn.menuItemHeaderTabletSmall },
                s.t(null, void 0, n(38554)),
              ),
              a.map(o),
            ),
          t.length > 0 &&
            i.createElement(
              i.Fragment,
              null,
              i.createElement(S.PopupMenuSeparator, null),
              i.createElement(
                ge.ToolWidgetMenuSummary,
                { className: Nn.menuItemHeaderTabletSmall },
                s.t(null, void 0, n(43399)),
              ),
              t.map(o),
            ),
        )
      }
      function Hn(e) {
        const { defaults: t, customs: a, render: o, state: l } = e
        return i.createElement(
          i.Fragment,
          null,
          a.length > 0 &&
            i.createElement(
              i.Fragment,
              null,
              i.createElement(S.PopupMenuSeparator, null),
              i.createElement(
                ge.ToolWidgetMenuSummary,
                { className: Nn.menuItemHeader },
                s.t(null, void 0, n(38554)),
              ),
              a.map(o),
            ),
          a.length > 0 &&
            t.length > 0 &&
            l &&
            i.createElement(
              i.Fragment,
              null,
              i.createElement(S.PopupMenuSeparator, null),
              i.createElement(
                Qe,
                {
                  summary: s.t(null, void 0, n(43399)),
                  open: !l.get().defaultsCollapsed,
                  onStateChange: (e) => l.set({ defaultsCollapsed: !e }),
                },
                t.map(o),
              ),
            ),
          0 === a.length &&
            t.length > 0 &&
            i.createElement(
              i.Fragment,
              null,
              i.createElement(S.PopupMenuSeparator, null),
              i.createElement(
                ge.ToolWidgetMenuSummary,
                { className: Nn.menuItemHeader },
                s.t(null, void 0, n(43399)),
              ),
              t.map(o),
            ),
        )
      }
      var Bn = n(97145)
      class Dn {
        constructor(e, t) {
          var n, i
          ;(this._isFavoriteEnabled = a.enabled('items_favoriting')),
            (this.handleFavorTemplate = (e) => {
              if (!this._isFavoriteEnabled) return
              const { name: t } = e
              this._isTemplateFavorite(t)
                ? this._removeFavoriteTemplate(t)
                : this._addFavoriteTemplate(t)
            }),
            (this.handleDropdownOpen = () => {
              this._setState({ isLoading: !0 }),
                this._studyTemplates.invalidate(),
                this._studyTemplates.refreshStudyTemplateList(() =>
                  this._setState({ isLoading: !1 }),
                )
            }),
            (this.handleApplyTemplate = (e) => {
              this._studyTemplates.applyTemplate(e.name)
            }),
            (this.handleRemoveTemplate = (e, t) => {
              this._studyTemplates.deleteStudyTemplate(e.name, t)
            }),
            (this.handleSaveTemplate = () => {
              this._studyTemplates.showSaveAsDialog()
            }),
            (this._studyTemplates = e),
            (this._favoriteStudyTemplatesService = t)
          const o =
              (null === (n = this._favoriteStudyTemplatesService) ||
              void 0 === n
                ? void 0
                : n.get()) || [],
            s = this._studyTemplates.list()
          ;(this._state = new Bn.WatchedValue({
            isLoading: !1,
            studyTemplatesList: s,
            favorites: o,
          })),
            this._studyTemplates
              .getOnChange()
              .subscribe(this, this._handleTemplatesChange),
            this._studyTemplates.refreshStudyTemplateList(),
            this._isFavoriteEnabled &&
              (null === (i = this._favoriteStudyTemplatesService) ||
                void 0 === i ||
                i.getOnChange().subscribe(this, this._handleFavoritesChange))
        }
        destroy() {
          var e
          this._studyTemplates
            .getOnChange()
            .unsubscribe(this, this._handleTemplatesChange),
            this._isFavoriteEnabled &&
              (null === (e = this._favoriteStudyTemplatesService) ||
                void 0 === e ||
                e.getOnChange().unsubscribe(this, this._handleFavoritesChange))
        }
        state() {
          return this._state.readonly()
        }
        _setState(e) {
          this._state.setValue({ ...this._state.value(), ...e })
        }
        _handleTemplatesChange() {
          this._setState({ studyTemplatesList: this._studyTemplates.list() })
        }
        _handleFavoritesChange(e) {
          this._isFavoriteEnabled && this._setState({ favorites: e })
        }
        _removeFavoriteTemplate(e) {
          var t
          const { favorites: n } = this._state.value()
          null === (t = this._favoriteStudyTemplatesService) ||
            void 0 === t ||
            t.set(n.filter((t) => t !== e))
        }
        _addFavoriteTemplate(e) {
          var t
          const { favorites: n } = this._state.value()
          null === (t = this._favoriteStudyTemplatesService) ||
            void 0 === t ||
            t.set([...n, e])
        }
        _isTemplateFavorite(e) {
          const { favorites: t } = this._state.value()
          return t.includes(e)
        }
      }
      var Pn = n(21233),
        Un = n(70760)
      const Wn = (0, w.registryContextType)()
      class zn extends i.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._updateState = (e) => {
              this.setState({ ...e, isActive: this.state.isActive })
            }),
            (this._handleApplyTemplate = (e) => {
              this._handleClose(), this._model.handleApplyTemplate(e)
            }),
            (this._handleRemoveTemplate = (e, t) => {
              this._handleClose(), this._model.handleRemoveTemplate(e, t)
            }),
            (this._handleClose = () => {
              this._handleToggleDropdown(!1)
            }),
            (this._handleToggleDropdown = (e) => {
              const { isActive: t } = this.state,
                n = 'boolean' == typeof e ? e : !t
              this.setState({ isActive: n })
            }),
            (0, w.validateRegistry)(t, {
              favoriteStudyTemplatesService: o.any,
              studyTemplates: o.any.isRequired,
              templatesMenuViewStateService: o.any,
            })
          const { favoriteStudyTemplatesService: n, studyTemplates: a } = t
          ;(this._model = new Dn(a, n)),
            (this.state = { ...this._model.state().value(), isActive: !1 })
        }
        componentDidMount() {
          this._model.state().subscribe(this._updateState)
        }
        componentWillUnmount() {
          this._model.state().unsubscribe(this._updateState),
            this._model.destroy()
        }
        render() {
          const { studyTemplatesList: e, favorites: t } = this.state,
            {
              isShownQuicks: n,
              className: a,
              displayMode: o,
              id: s,
            } = this.props
          return i.createElement(
            Ln.Provider,
            { value: this.context.templatesMenuViewStateService || null },
            i.createElement(Vn, {
              id: s,
              className: a,
              mode: o,
              templates: e,
              favorites: t,
              onMenuOpen: this._model.handleDropdownOpen,
              onTemplateFavorite: n ? this._model.handleFavorTemplate : void 0,
              onTemplateSelect: this._handleApplyTemplate,
              onTemplateRemove: this._handleRemoveTemplate,
              onTemplateSave: this._model.handleSaveTemplate,
            }),
          )
        }
      }
      function Vn(e) {
        const {
            id: t,
            className: a,
            mode: o,
            favorites: l,
            templates: r,
            isMenuOpen: c,
            onTemplateSelect: h,
            onTemplateSave: u,
            onTemplateFavorite: m,
            onTemplateRemove: g,
          } = e,
          b = (0, i.useRef)(null),
          C = (0, i.useRef)(null),
          S = v()(a, Un.wrap, {
            [Un.full]: 'full' === o,
            [Un.medium]: 'medium' === o,
          }),
          y = r.filter((e) => l.includes(e.name)),
          w = 'small' !== o && m && y.length > 0
        return i.createElement(
          p,
          { id: t, className: S },
          i.createElement(
            _.MatchMedia,
            { rule: f.DialogBreakpoints.TabletSmall },
            (t) =>
              i.createElement(
                d.ToolbarMenuButton,
                {
                  ref: b,
                  menuReference: C,
                  onOpen: e.onMenuOpen,
                  isDrawer: t,
                  drawerPosition: 'Bottom',
                  arrow: !1,
                  content: i.createElement(V, {
                    tag: 'div',
                    className: v()(w && Un.buttonWithFavorites),
                    displayMode: o,
                    isOpened: c,
                    icon: Pn,
                    forceInteractive: !0,
                    collapseWhen: ['full', 'medium', 'small'],
                  }),
                  onClick: T,
                  tooltip: s.t(null, void 0, n(15812)),
                },
                i.createElement(Fn, {
                  onTemplateSave: u,
                  onTemplateSelect: h,
                  onTemplateRemove: E,
                  onTemplateFavorite: m,
                  templates: r,
                  favorites: y,
                  isTabletSmall: t,
                }),
              ),
          ),
          w &&
            i.createElement(Zn, {
              favorites: y,
              onTemplateSelect: (e) => {
                h(e), T()
              },
            }),
        )
        function E(e, t) {
          if (
            k.PLATFORM_ACCESSIBILITY_ENABLED &&
            t &&
            (0, Q.isKeyboardClick)(t) &&
            C.current
          ) {
            const t = (0, le.queryMenuElements)(C.current),
              n = t.findIndex((t) => null !== t.closest(`[data-id="${e.id}"]`))
            g(e, () => {
              var e, a
              if (-1 !== n && C.current) {
                const i = null !== (e = t[n + 1]) && void 0 !== e ? e : t[n - 1]
                i ? i.focus() : (0, le.focusFirstMenuItem)(C.current),
                  null === (a = b.current) || void 0 === a || a.update()
              }
            })
          } else g(e)
        }
        function T() {
          0
        }
      }
      function Zn(e) {
        return i.createElement(
          i.Fragment,
          null,
          e.favorites.map((t, n, a) =>
            i.createElement(gn, {
              key: t.name,
              item: t,
              onApply: e.onTemplateSelect,
              className: v()({
                [Un.first]: 0 === n,
                [Un.last]: n === a.length - 1,
              }),
            }),
          ),
        )
      }
      zn.contextType = Wn
      n(42053)
      var Kn = n(77665),
        Qn = n(96052),
        jn = n(57778)
      const qn = {
          undoHotKey: (0, X.hotKeySerialize)({
            keys: [(0, $.humanReadableModifiers)($.Modifiers.Mod, !1), 'Z'],
            text: '{0} + {1}',
          }),
          redoHotKey: (0, X.hotKeySerialize)({
            keys: [(0, $.humanReadableModifiers)($.Modifiers.Mod, !1), 'Y'],
            text: '{0} + {1}',
          }),
        },
        Yn = (0, dt.mergeThemes)(g.DEFAULT_TOOLBAR_BUTTON_THEME, jn),
        Gn = (0, w.registryContextType)()
      class Xn extends i.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._batched = null),
            (this._handleClickUndo = () => {
              ;(0, K.trackEvent)('GUI', 'Undo')
              const { chartWidgetCollection: e } = this.context
              e.undoHistory.undo()
            }),
            (this._handleClickRedo = () => {
              ;(0, K.trackEvent)('GUI', 'Redo')
              const { chartWidgetCollection: e } = this.context
              e.undoHistory.redo()
            }),
            (0, w.validateRegistry)(t, {
              chartWidgetCollection: o.any.isRequired,
            }),
            (this.state = this._getStateFromUndoHistory())
        }
        componentDidMount() {
          const { chartWidgetCollection: e } = this.context
          e.undoHistory
            .redoStack()
            .onChange()
            .subscribe(this, this._onChangeStack),
            e.undoHistory
              .undoStack()
              .onChange()
              .subscribe(this, this._onChangeStack)
        }
        componentWillUnmount() {
          const { chartWidgetCollection: e } = this.context
          e.undoHistory
            .redoStack()
            .onChange()
            .unsubscribe(this, this._onChangeStack),
            e.undoHistory
              .undoStack()
              .onChange()
              .unsubscribe(this, this._onChangeStack),
            (this._batched = null)
        }
        render() {
          const { id: e } = this.props,
            {
              isEnabledRedo: t,
              isEnabledUndo: a,
              redoStack: o,
              undoStack: l,
            } = this.state
          return i.createElement(
            p,
            { id: e },
            i.createElement(g.ToolbarButton, {
              icon: Kn,
              isDisabled: !a,
              onClick: this._handleClickUndo,
              theme: Yn,
              tooltip: a
                ? s.t(null, { replace: { hint: l } }, n(80323))
                : void 0,
              'data-tooltip-hotkey': a ? qn.undoHotKey : void 0,
            }),
            i.createElement(g.ToolbarButton, {
              icon: Qn,
              isDisabled: !t,
              onClick: this._handleClickRedo,
              theme: Yn,
              tooltip: t
                ? s.t(null, { replace: { hint: o } }, n(70728))
                : void 0,
              'data-tooltip-hotkey': t ? qn.redoHotKey : void 0,
            }),
          )
        }
        _onChangeStack() {
          null === this._batched &&
            (this._batched = Promise.resolve().then(() => {
              if (null === this._batched) return
              this._batched = null
              const e = this._getStateFromUndoHistory()
              this.setState(e)
            }))
        }
        _getStateFromUndoHistory() {
          const { chartWidgetCollection: e } = this.context,
            t = e.undoHistory.undoStack(),
            n = e.undoHistory.redoStack(),
            a = n.head(),
            i = t.head()
          return {
            isEnabledRedo: !n.isEmpty(),
            isEnabledUndo: !t.isEmpty(),
            redoStack: a ? a.text().translatedText() : '',
            undoStack: i ? i.text().translatedText() : '',
          }
        }
      }
      Xn.contextType = Gn
      const $n = (e) => {
        if (
          ((e) =>
            'http://www.w3.org/1999/xhtml' ===
            (null == e ? void 0 : e.namespaceURI))(e) &&
          'true' !== e.dataset.internalAllowKeyboardNavigation
        ) {
          ;(e.tabIndex = -1), (e.ariaDisabled = 'true')
          for (let t = 0; t < e.children.length; t++) $n(e.children.item(t))
        }
      }
      class Jn extends i.PureComponent {
        constructor() {
          super(...arguments),
            (this._wrapperElement = null),
            (this._resizeObserver = null),
            (this._mutationObserver = null),
            (this._update = () => {
              this.forceUpdate()
            }),
            (this._setRef = (e) => {
              this._wrapperElement = e
            }),
            (this._handleMeasure = ([e]) => {
              this.props.width.setValue(e.contentRect.width)
            }),
            (this._handleMutation = ([e]) => {
              k.PLATFORM_ACCESSIBILITY_ENABLED &&
                'childList' === e.type &&
                $n(this.props.element)
            })
        }
        componentDidMount() {
          const { element: e, isFake: t, width: n } = this.props
          !t && this._wrapperElement
            ? ((this._resizeObserver = new ResizeObserver(this._handleMeasure)),
              (this._mutationObserver = new MutationObserver(
                this._handleMutation,
              )),
              this._wrapperElement.appendChild(e),
              this._resizeObserver.observe(this._wrapperElement),
              this._mutationObserver.observe(e, { subtree: !0, childList: !0 }))
            : n.subscribe(this._update)
        }
        componentWillUnmount() {
          const { width: e, isFake: t } = this.props
          t && e.unsubscribe(this._update),
            this._resizeObserver &&
              this._wrapperElement &&
              this._resizeObserver.unobserve(this._wrapperElement),
            this._mutationObserver &&
              (this._mutationObserver.disconnect(),
              (this._mutationObserver = null))
        }
        render() {
          const { isFake: e = !1, width: t } = this.props
          return i.createElement(p, {
            ref: this._setRef,
            style: e ? { width: t.value() } : void 0,
            'data-is-custom-header-element': !0,
          })
        }
      }
      function ea(e) {
        const { displayMode: t, params: n } = e
        return i.createElement(
          d.ToolbarMenuButton,
          {
            content: i.createElement(V, {
              collapseWhen: void 0 !== n.icon ? void 0 : [],
              displayMode: t,
              icon: n.icon,
              text: n.title,
              'data-name': 'dropdown',
              'data-is-custom-header-element': !0,
            }),
            drawerPosition: 'Bottom',
            drawerBreakpoint: f.DialogBreakpoints.TabletSmall,
            arrow: !1,
            tooltip: n.tooltip,
          },
          n.items.map((e, t) =>
            i.createElement(se.PopupMenuItem, {
              key: t,
              label: e.title,
              onClick: () => e.onSelect(),
              'data-name': 'dropdown-item',
            }),
          ),
        )
      }
      var ta = n(27363)
      function na(e) {
        const { className: t, title: n, ...a } = e
        return i.createElement(Z, {
          ...a,
          className: u(t, ta.customTradingViewStyleButton, ta.withoutIcon),
          collapseWhen: [],
          'data-name': 'custom-tradingview-styled-button',
          tooltip: n,
        })
      }
      var aa = n(60448)
      const ia = (0, X.hotKeySerialize)({
          keys: [(0, $.humanReadableModifiers)($.Modifiers.Mod, !1), 'K'],
          text: '{0} + {1}',
        }),
        oa = (0, w.registryContextType)()
      class sa extends i.PureComponent {
        constructor(e, t) {
          super(e),
            (this._dialog = null),
            (this._updateState = (e) => {
              this.setState({ isOpened: e })
            }),
            (this._handleClick = (e) => {
              const { openGlobalSearch: t } = this.context
              t({ shouldReturnFocus: (0, Q.isKeyboardClick)(e) }).then((e) => {
                var t
                null === (t = this._dialog) ||
                  void 0 === t ||
                  t.visible().unsubscribe(this._updateState),
                  (this._dialog = e),
                  e.visible().subscribe(this._updateState)
              })
            }),
            (0, w.validateRegistry)(t, { openGlobalSearch: o.any.isRequired }),
            (this.state = { isOpened: !1 })
        }
        componentWillUnmount() {
          var e
          null === (e = this._dialog) ||
            void 0 === e ||
            e.visible().unsubscribe(this._updateState)
        }
        render() {
          return i.createElement(G.ToolbarIconButton, {
            ...this.props,
            icon: aa,
            isOpened: this.state.isOpened,
            onClick: this._handleClick,
            'data-tooltip-hotkey': ia,
            tooltip: s.t(null, void 0, n(43959)),
          })
        }
      }
      sa.contextType = oa
      var la = n(98731)
      function ra() {
        return {
          Bars: a.enabled('header_chart_type') ? D : void 0,
          Compare: a.enabled('header_compare') ? Y : void 0,
          Custom: Jn,
          CustomTradingViewStyledButton: na,
          Fullscreen: a.enabled('header_fullscreen_button') ? ie : void 0,
          Indicators: a.enabled('header_indicators') ? ye : void 0,
          Intervals: a.enabled('header_resolutions') ? Je : void 0,
          OpenPopup: ot,
          Properties:
            a.enabled('header_settings') &&
            a.enabled('show_chart_property_page')
              ? rt
              : void 0,
          SaveLoad: a.enabled('header_saveload') ? At : void 0,
          Screenshot: a.enabled('header_screenshot') ? nn : void 0,
          SymbolSearch: a.enabled('header_symbol_search') ? vn : void 0,
          Templates: a.enabled('study_templates') ? zn : void 0,
          Dropdown: ea,
          UndoRedo: a.enabled('header_undo_redo') ? Xn : void 0,
          Layout: undefined,
          QuickSearch: (0, la.shouldShowQuickSearchOnLib)() ? sa : void 0,
        }
      }
    },
    39344: (e, t, n) => {
      n.d(t, {
        createStudyTemplateMetaInfo: () => o,
        descriptionString: () => s,
      })
      var a = n(28853),
        i = n(37591)
      function o(e, t) {
        return {
          indicators: e
            .orderedDataSources(!0)
            .filter((e) => (0, a.isStudy)(e) && !0)
            .map((e) => ({
              id: e.metaInfo().id,
              description: e.title(
                i.TitleDisplayTarget.StatusLine,
                !0,
                void 0,
                !0,
              ),
            })),
          interval: t,
        }
      }
      function s(e) {
        const t = new Map()
        return (
          e.forEach((e) => {
            const [n, a] = t.get(e.id) || [e.description, 0]
            t.set(e.id, [n, a + 1])
          }),
          Array.from(t.values())
            .map(([e, t]) => `${e}${t > 1 ? ` x ${t}` : ''}`)
            .join(', ')
        )
      }
    },
    95366: (e, t, n) => {
      n.d(t, {
        RegistryProvider: () => r,
        registryContextType: () => c,
        validateRegistry: () => l,
      })
      var a = n(50959),
        i = n(19036),
        o = n.n(i)
      const s = a.createContext({})
      function l(e, t) {
        o().checkPropTypes(t, e, 'context', 'RegistryContext')
      }
      function r(e) {
        const { validation: t, value: n } = e
        return l(n, t), a.createElement(s.Provider, { value: n }, e.children)
      }
      function c() {
        return s
      }
    },
    45876: (e, t, n) => {
      n.r(t), n.d(t, { SERIES_ICONS: () => p })
      var a = n(94670),
        i = n(32162),
        o = n(39956),
        s = n(14083),
        l = n(45504),
        r = n(52867),
        c = n(41473),
        h = n(31246),
        d = n(15726),
        u = n(24464),
        v = n(3904),
        m = n(9450)
      const p = {
        3: a,
        16: i,
        0: o,
        1: s,
        8: l,
        9: r,
        2: c,
        14: h,
        15: d,
        10: u,
        12: v,
        13: m,
      }
    },
    53166: (e, t, n) => {
      n.d(t, { convertImageNameToUrl: () => o })
      var a = n(14483),
        i = n(76861)
      function o(e) {
        return a.enabled('charting_library_base') || (0, i.isProd)()
          ? 'https://www.tradingview.com/x/' + e + '/'
          : window.location.protocol +
              '//' +
              window.location.host +
              '/x/' +
              e +
              '/'
      }
    },
    65939: (e, t, n) => {
      function a(e, t) {
        const n = document.createElement('a')
        ;(n.style.display = 'none'), (n.href = t), (n.download = e), n.click()
      }
      n.d(t, { downloadFile: () => a })
    },
    29142: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M3.5 8a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM8 2a6 6 0 1 0 3.65 10.76l3.58 3.58 1.06-1.06-3.57-3.57A6 6 0 0 0 8 2Z"/></svg>'
    },
    97268: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M8.5 6A2.5 2.5 0 0 0 6 8.5V11h1V8.5C7 7.67 7.67 7 8.5 7H11V6H8.5zM6 17v2.5A2.5 2.5 0 0 0 8.5 22H11v-1H8.5A1.5 1.5 0 0 1 7 19.5V17H6zM19.5 7H17V6h2.5A2.5 2.5 0 0 1 22 8.5V11h-1V8.5c0-.83-.67-1.5-1.5-1.5zM22 19.5V17h-1v2.5c0 .83-.67 1.5-1.5 1.5H17v1h2.5a2.5 2.5 0 0 0 2.5-2.5z"/></svg>'
    },
    57047: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M17 6v2.5a2.5 2.5 0 0 0 2.5 2.5H22v-1h-2.5A1.5 1.5 0 0 1 18 8.5V6h-1zm2.5 11a2.5 2.5 0 0 0-2.5 2.5V22h1v-2.5c0-.83.67-1.5 1.5-1.5H22v-1h-2.5zm-11 1H6v-1h2.5a2.5 2.5 0 0 1 2.5 2.5V22h-1v-2.5c0-.83-.67-1.5-1.5-1.5zM11 8.5V6h-1v2.5c0 .83-.67 1.5-1.5 1.5H6v1h2.5A2.5 2.5 0 0 0 11 8.5z"/></svg>'
    },
    99280: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M8.5 6A2.5 2.5 0 0 0 6 8.5v11A2.5 2.5 0 0 0 8.5 22h11a2.5 2.5 0 0 0 2.5-2.5v-3h-1v3c0 .83-.67 1.5-1.5 1.5h-11A1.5 1.5 0 0 1 7 19.5v-11C7 7.67 7.67 7 8.5 7h3V6h-3zm7 1h4.8l-7.49 7.48.71.7L21 7.72v4.79h1V6h-6.5v1z"/></svg>'
    },
    60448: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M15 11v4l1-1.5 2.33-3.5.67-1h-3V4l-1 1.5L12.67 9 12 10h3v1Zm2-7v4h2a1 1 0 0 1 .83 1.55l-4 6A1 1 0 0 1 14 15v-4h-2a1 1 0 0 1-.83-1.56l4-6A1 1 0 0 1 17 4ZM5 13.5a7.5 7.5 0 0 1 6-7.35v1.02A6.5 6.5 0 1 0 18.98 13h1a7.6 7.6 0 0 1-1.83 5.44l4.7 4.7-.7.71-4.71-4.7A7.5 7.5 0 0 1 5 13.5Z"/></svg>'
    },
    21233: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M8 7h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zM6 8c0-1.1.9-2 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8zm11-1h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zm-2 1c0-1.1.9-2 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2V8zm-4 8H8a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1zm-3-1a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h3a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H8zm9 1h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1zm-2 1c0-1.1.9-2 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3z"/></svg>'
    },
    94670: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="m25.35 5.35-9.5 9.5-.35.36-.35-.36-4.65-4.64-8.15 8.14-.7-.7 8.5-8.5.35-.36.35.36 4.65 4.64 9.15-9.14.7.7ZM2 21h1v1H2v-1Zm2-1H3v1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1V9h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v1H9v1H8v1H7v1H6v1H5v1H4v1Zm1 0v1H4v-1h1Zm1 0H5v-1h1v1Zm1 0v1H6v-1h1Zm0-1H6v-1h1v1Zm1 0H7v1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v1H9v1H8v1H7v1h1v1Zm1 0v1H8v-1h1Zm0-1H8v-1h1v1Zm1 0H9v1h1v1h1v-1h1v1h1v-1h1v1h1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v1H9v1h1v1Zm1 0v1h-1v-1h1Zm0-1v-1h-1v1h1Zm0 0v1h1v1h1v-1h-1v-1h-1Zm6 2v-1h1v1h-1Zm2 0v1h-1v-1h1Zm0-1h-1v-1h1v1Zm1 0h-1v1h1v1h1v-1h1v1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v1h-1v1h-1v1h-1v1h1v1Zm1 0h-1v1h1v-1Zm0-1h1v1h-1v-1Zm0-1h1v-1h-1v1Zm0 0v1h-1v-1h1Zm-4 3v1h-1v-1h1Z"/></svg>'
    },
    39956: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="none" stroke="currentColor" stroke-linecap="square"><path d="M10.5 7.5v15M7.5 20.5H10M13.5 11.5H11M19.5 6.5v15M16.5 9.5H19M22.5 16.5H20"/></g></svg>'
    },
    24464: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="m10.49 7.55-.42.7-2.1 3.5.86.5 1.68-2.8 1.8 2.82.84-.54-2.23-3.5-.43-.68Zm12.32 4.72-.84-.54 2.61-4 .84.54-2.61 4Zm-5.3 6.3 1.2-1.84.84.54-1.63 2.5-.43.65-.41-.65-1.6-2.5.85-.54 1.17 1.85ZM4.96 16.75l.86.52-2.4 4-.86-.52 2.4-4ZM3 14v1h1v-1H3Zm2 0h1v1H5v-1Zm2 0v1h1v-1H7Zm2 0h1v1H9v-1Zm2 0v1h1v-1h-1Zm2 0h1v1h-1v-1Zm2 0v1h1v-1h-1Zm2 0h1v1h-1v-1Zm2 0v1h1v-1h-1Zm2 0h1v1h-1v-1Zm2 0v1h1v-1h-1Zm2 0h1v1h-1v-1Z"/></svg>'
    },
    14083: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M17 11v6h3v-6h-3zm-.5-1h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5z"/><path d="M18 7h1v3.5h-1zm0 10.5h1V21h-1z"/><path d="M9 8v12h3V8H9zm-.5-1h4a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5z"/><path d="M10 4h1v3.5h-1zm0 16.5h1V24h-1z"/></svg>'
    },
    53707: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><g fill="none"><path stroke="currentColor" d="M11 20.5H7.5a5 5 0 1 1 .42-9.98 7.5 7.5 0 0 1 14.57 2.1 4 4 0 0 1-1 7.877H18"/><path stroke="currentColor" d="M14.5 24V12.5M11 16l3.5-3.5L18 16"/></g></svg>'
    },
    9450: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M12 7v14h5V7h-5Zm4 1h-3v12h3V8ZM19 15v6h5v-6h-5Zm4 1h-3v4h3v-4ZM5 12h5v9H5v-9Zm1 1h3v7H6v-7Z"/></svg>'
    },
    1393: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M13.5 6a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM4 14.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/><path fill="currentColor" d="M9 14h4v-4h1v4h4v1h-4v4h-1v-4H9v-1z"/></svg>'
    },
    45504: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M9 8v12h3V8H9zm-1-.502C8 7.223 8.215 7 8.498 7h4.004c.275 0 .498.22.498.498v13.004a.493.493 0 0 1-.498.498H8.498A.496.496 0 0 1 8 20.502V7.498z"/><path d="M10 4h1v3.5h-1z"/><path d="M17 6v6h3V6h-3zm-1-.5c0-.276.215-.5.498-.5h4.004c.275 0 .498.23.498.5v7c0 .276-.215.5-.498.5h-4.004a.503.503 0 0 1-.498-.5v-7z"/><path d="M18 2h1v3.5h-1z"/></svg>'
    },
    3904: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M7.5 7H7v14h5V7H7.5zM8 20V8h3v12H8zm7.5-11H15v10h5V9h-4.5zm.5 9v-8h3v8h-3z"/></svg>'
    },
    32162: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path fill-rule="evenodd" d="M22 3h1v1h-1V3Zm0 2V4h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1V9h-1V8h-1V7h-1V6h-1V5h-1v1H9v1H8v1H7v1H6v1H5v1H4v1h1v1H4v1h1v-1h1v-1h1v-1h1v-1h1V9h1V8h1v1h1v1h1v1h1v1h1v1h1v-1h1v-1h1v-1h1V9h1V8h1V7h1V6h1V5h-1Zm-1 1V5h1v1h-1Zm-1 1V6h1v1h-1Zm-1 1V7h1v1h-1Zm-1 1V8h1v1h-1Zm-1 1V9h1v1h-1Zm-1 1v-1h1v1h-1Zm-1 0v-1h-1V9h-1V8h-1V7h-1V6h-1v1H9v1H8v1H7v1H6v1H5v1h1v-1h1v-1h1V9h1V8h1V7h1v1h1v1h1v1h1v1h1Zm0 0h1v1h-1v-1Zm.84 6.37 7.5-7-.68-.74-7.15 6.67-4.66-4.65-.33-.34-.36.32-5.5 5 .68.74 5.14-4.68 4.67 4.66.34.35.35-.33ZM6 23H5v1h1v-1Zm0-1H5v-1h1v1Zm1 0v1H6v-1h1Zm0-1H6v-1h1v1Zm1 0v1H7v-1h1Zm0-1H7v-1h1v1Zm1 0v1H8v-1h1Zm0-1H8v-1h1v1Zm1 0v1H9v-1h1Zm0-1H9v-1h1v1Zm1 0h-1v1h1v1h1v1h1v1h1v1h1v1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h-1v-1h1v-1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v1h1v1Zm0 0h1v1h-1v-1Zm2 2v1h1v1h1v1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1Zm0 0v-1h-1v1h1Z"/></svg>'
    },
    52867: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M17 11v6h3v-6h-3zm-.5-1h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5z"/><path d="M18 7h1v3.5h-1zm0 10.5h1V21h-1z"/><path d="M9 8v11h3V8H9zm-.5-1h4a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-12a.5.5 0 0 1 .5-.5z"/><path d="M10 4h1v5h-1zm0 14h1v5h-1zM8.5 9H10v1H8.5zM11 9h1.5v1H11zm-1 1h1v1h-1zm-1.5 1H10v1H8.5zm2.5 0h1.5v1H11zm-1 1h1v1h-1zm-1.5 1H10v1H8.5zm2.5 0h1.5v1H11zm-1 1h1v1h-1zm-1.5 1H10v1H8.5zm2.5 0h1.5v1H11zm-1 1h1v1h-1zm-1.5 1H10v1H8.5zm2.5 0h1.5v1H11z"/></svg>'
    },
    39681: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="M20 17l-5 5M15 17l5 5M9 11.5h7M17.5 8a2.5 2.5 0 0 0-5 0v11a2.5 2.5 0 0 1-5 0"/></svg>'
    },
    31246: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path fill-rule="evenodd" d="m18.43 15.91 6.96-8.6-.78-.62-6.96 8.6a2.49 2.49 0 0 0-2.63.2l-2.21-2.02A2.5 2.5 0 0 0 10.5 10a2.5 2.5 0 1 0 1.73 4.3l2.12 1.92a2.5 2.5 0 1 0 4.08-.31ZM10.5 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm7.5 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/><path d="M8.37 13.8c.17.3.4.54.68.74l-5.67 6.78-.76-.64 5.75-6.88Z"/></svg>'
    },
    41473: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="m25.39 7.31-8.83 10.92-6.02-5.47-7.16 8.56-.76-.64 7.82-9.36 6 5.45L24.61 6.7l.78.62Z"/></svg>'
    },
    82436: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" width="21" height="21"><g fill="none" stroke="currentColor"><path d="M18.5 11v5.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2H9"/><path stroke-linecap="square" d="M18 2l-8.5 8.5m4-9h5v5"/></g></svg>'
    },
    48449: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fill-rule="evenodd"><path fill-rule="nonzero" d="M14 17a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-1a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M5.005 16A1.003 1.003 0 0 1 4 14.992v-1.984A.998.998 0 0 1 5 12h1.252a7.87 7.87 0 0 1 .853-2.06l-.919-.925c-.356-.397-.348-1 .03-1.379l1.42-1.42a1 1 0 0 1 1.416.007l.889.882A7.96 7.96 0 0 1 12 6.253V5c0-.514.46-1 1-1h2c.557 0 1 .44 1 1v1.253a7.96 7.96 0 0 1 2.06.852l.888-.882a1 1 0 0 1 1.416-.006l1.42 1.42a.999.999 0 0 1 .029 1.377s-.4.406-.918.926a7.87 7.87 0 0 1 .853 2.06H23c.557 0 1 .447 1 1.008v1.984A.998.998 0 0 1 23 16h-1.252a7.87 7.87 0 0 1-.853 2.06l.882.888a1 1 0 0 1 .006 1.416l-1.42 1.42a1 1 0 0 1-1.415-.007l-.889-.882a7.96 7.96 0 0 1-2.059.852v1.248c0 .56-.45 1.005-1.008 1.005h-1.984A1.004 1.004 0 0 1 12 22.995v-1.248a7.96 7.96 0 0 1-2.06-.852l-.888.882a1 1 0 0 1-1.416.006l-1.42-1.42a1 1 0 0 1 .007-1.415l.882-.888A7.87 7.87 0 0 1 6.252 16H5.005zm3.378-6.193l-.227.34A6.884 6.884 0 0 0 7.14 12.6l-.082.4H5.005C5.002 13 5 13.664 5 14.992c0 .005.686.008 2.058.008l.082.4c.18.883.52 1.71 1.016 2.453l.227.34-1.45 1.46c-.004.003.466.477 1.41 1.422l1.464-1.458.34.227a6.959 6.959 0 0 0 2.454 1.016l.399.083v2.052c0 .003.664.005 1.992.005.005 0 .008-.686.008-2.057l.399-.083a6.959 6.959 0 0 0 2.454-1.016l.34-.227 1.46 1.45c.003.004.477-.466 1.422-1.41l-1.458-1.464.227-.34A6.884 6.884 0 0 0 20.86 15.4l.082-.4h2.053c.003 0 .005-.664.005-1.992 0-.005-.686-.008-2.058-.008l-.082-.4a6.884 6.884 0 0 0-1.016-2.453l-.227-.34 1.376-1.384.081-.082-1.416-1.416-1.465 1.458-.34-.227a6.959 6.959 0 0 0-2.454-1.016L15 7.057V5c0-.003-.664-.003-1.992 0-.005 0-.008.686-.008 2.057l-.399.083a6.959 6.959 0 0 0-2.454 1.016l-.34.227-1.46-1.45c-.003-.004-.477.466-1.421 1.408l1.457 1.466z"/></g></svg>'
    },
    96052: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M18.293 13l-2.647 2.646.707.708 3.854-3.854-3.854-3.854-.707.708L18.293 12H12.5A5.5 5.5 0 0 0 7 17.5V19h1v-1.5a4.5 4.5 0 0 1 4.5-4.5h5.793z"/></svg>'
    },
    72644: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.118 6a.5.5 0 0 0-.447.276L9.809 8H5.5A1.5 1.5 0 0 0 4 9.5v10A1.5 1.5 0 0 0 5.5 21h16a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 21.5 8h-4.309l-.862-1.724A.5.5 0 0 0 15.882 6h-4.764zm-1.342-.17A1.5 1.5 0 0 1 11.118 5h4.764a1.5 1.5 0 0 1 1.342.83L17.809 7H21.5A2.5 2.5 0 0 1 24 9.5v10a2.5 2.5 0 0 1-2.5 2.5h-16A2.5 2.5 0 0 1 3 19.5v-10A2.5 2.5 0 0 1 5.5 7h3.691l.585-1.17z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M13.5 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm0 1a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z"/></svg>'
    },
    15726: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M19 5h5v1h-4v13h-6v-7h-4v12H5v-1h4V11h6v7h4V5Z"/></svg>'
    },
    77665: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M8.707 13l2.647 2.646-.707.708L6.792 12.5l3.853-3.854.708.708L8.707 12H14.5a5.5 5.5 0 0 1 5.5 5.5V19h-1v-1.5a4.5 4.5 0 0 0-4.5-4.5H8.707z"/></svg>'
    },
    33765: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="currentColor" d="M9.707 9l4.647-4.646-.707-.708L9 8.293 4.354 3.646l-.708.708L8.293 9l-4.647 4.646.708.708L9 9.707l4.646 4.647.708-.707L9.707 9z"/></svg>'
    },
    36296: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M8 9.5H6.5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V20m-8-1.5h11a1 1 0 0 0 1-1v-11a1 1 0 0 0-1-1h-11a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1z"/></svg>'
    },
    23595: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M6.5 16v4.5a1 1 0 001 1h14a1 1 0 001-1V16M14.5 5V17m-4-3.5l4 4l4-4"/></svg>'
    },
    39146: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" d="M9 1l2.35 4.76 5.26.77-3.8 3.7.9 5.24L9 13l-4.7 2.47.9-5.23-3.8-3.71 5.25-.77L9 1z"/></svg>'
    },
    48010: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M9 2.13l1.903 3.855.116.236.26.038 4.255.618-3.079 3.001-.188.184.044.259.727 4.237-3.805-2L9 12.434l-.233.122-3.805 2.001.727-4.237.044-.26-.188-.183-3.079-3.001 4.255-.618.26-.038.116-.236L9 2.13z"/></svg>'
    },
    29414: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="M19 15l2.5-2.5c1-1 1.5-3.5-.5-5.5s-4.5-1.5-5.5-.5L13 9M10 12l-2.5 2.5c-1 1-1.5 3.5.5 5.5s4.5 1.5 5.5.5L16 18M17 11l-5 5"/></svg>'
    },
    67487: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M19.75 5h3.07l-6.7 7.62L24 23h-6.17l-4.84-6.3L7.46 23H4.4l7.17-8.16L4 5h6.33l4.37 5.75L19.75 5Zm-1.24 16h1.7L9.54 7H7.7l10.8 14Z"/></svg>'
    },
    25931: (e, t, n) => {
      n.d(t, { nanoid: () => a })
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
  },
])
