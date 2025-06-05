;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5516, 9685],
  {
    626574: (e) => {
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
    488803: (e) => {
      e.exports = {
        'tablet-normal-breakpoint': 'screen and (max-width: 768px)',
        'small-height-breakpoint': 'screen and (max-height: 360px)',
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
      }
    },
    517723: (e) => {
      e.exports = { footer: 'footer-dwINHZFL' }
    },
    214877: (e) => {
      e.exports = {
        favorite: 'favorite-_FRQhM5Y',
        hovered: 'hovered-_FRQhM5Y',
        disabled: 'disabled-_FRQhM5Y',
        active: 'active-_FRQhM5Y',
        checked: 'checked-_FRQhM5Y',
      }
    },
    333963: (e) => {
      e.exports = {
        item: 'item-zwyEh4hn',
        label: 'label-zwyEh4hn',
        labelRow: 'labelRow-zwyEh4hn',
        toolbox: 'toolbox-zwyEh4hn',
      }
    },
    927306: (e) => {
      e.exports = {
        button: 'button-iLKiGOdQ',
        hovered: 'hovered-iLKiGOdQ',
        disabled: 'disabled-iLKiGOdQ',
        active: 'active-iLKiGOdQ',
        hidden: 'hidden-iLKiGOdQ',
      }
    },
    234539: (e, t, a) => {
      a.d(t, { CustomBehaviourContext: () => n })
      const n = (0, a(50959).createContext)({ enableActiveStateStyles: !0 })
      n.displayName = 'CustomBehaviourContext'
    },
    813550: (e, t, a) => {
      a.d(t, { useForceUpdate: () => i })
      var n = a(50959)
      const i = () => {
        const [, e] = (0, n.useReducer)((e) => e + 1, 0)
        return e
      }
    },
    975228: (e, t, a) => {
      a.d(t, {
        hoverMouseEventFilter: () => l,
        useAccurateHover: () => o,
        useHover: () => i,
      })
      var n = a(50959)
      function i() {
        const [e, t] = (0, n.useState)(!1)
        return [
          e,
          {
            onMouseOver: (e) => {
              l(e) && t(!0)
            },
            onMouseOut: (e) => {
              l(e) && t(!1)
            },
          },
        ]
      }
      function l(e) {
        return !e.currentTarget.contains(e.relatedTarget)
      }
      function o(e) {
        const [t, a] = (0, n.useState)(!1)
        return (
          (0, n.useEffect)(() => {
            const t = (t) => {
              if (null === e.current) return
              const n = e.current.contains(t.target)
              a(n)
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
    252130: (e, t, a) => {
      a.d(t, { useIsMounted: () => i })
      var n = a(50959)
      const i = () => {
        const e = (0, n.useRef)(!1)
        return (
          (0, n.useEffect)(
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
    996038: (e, t, a) => {
      a.d(t, { DialogBreakpoints: () => i })
      var n = a(488803)
      const i = {
        SmallHeight: n['small-height-breakpoint'],
        TabletSmall: n['tablet-small-breakpoint'],
        TabletNormal: n['tablet-normal-breakpoint'],
      }
    },
    366171: (e, t, a) => {
      a.d(t, { SymbolSearchDialogFooter: () => s })
      var n = a(50959),
        i = a(497754),
        l = a.n(i),
        o = a(517723)
      function s(e) {
        const { className: t, children: a } = e
        return n.createElement('div', { className: l()(o.footer, t) }, a)
      }
    },
    578601: (e, t, a) => {
      a.d(t, { useRowsNavigation: () => h })
      var n = a(50959),
        i = a(650151),
        l = a(892932),
        o = a(180185),
        s = a(27164)
      const r = [37, 39, 38, 40]
      function h(e) {
        const t = (0, n.useRef)(null)
        return (
          (0, n.useLayoutEffect)(() => {
            if (!l.PLATFORM_ACCESSIBILITY_ENABLED) return
            const e = (0, i.ensureNotNull)(t.current),
              a = () => {
                const a = (0, l.queryTabbableElements)(e).sort(
                  l.navigationOrderComparator,
                )
                if (
                  0 === a.length ||
                  (a[0].parentElement &&
                    !d(a[0].parentElement, (0, i.ensureNotNull)(t.current)))
                ) {
                  const n = ((e) => {
                    const a = v(e)
                      .sort(l.navigationOrderComparator)
                      .find((e) => d(e, (0, i.ensureNotNull)(t.current)))
                    if (!a) return null
                    const n = Array.from(a.children)
                    if (!n.length) return null
                    return n[0]
                  })(e)
                  if (null === n) return
                  if (((0, s.becomeMainElement)(n), a.length > 0))
                    for (const e of a) (0, s.becomeSecondaryElement)(e)
                }
              }
            return (
              window.addEventListener('keyboard-navigation-activation', a),
              a(),
              () =>
                window.removeEventListener('keyboard-navigation-activation', a)
            )
          }, []),
          [
            t,
            (t) => {
              if (!l.PLATFORM_ACCESSIBILITY_ENABLED) return
              if (t.defaultPrevented) return
              const a = (0, o.hashFromEvent)(t)
              if (!r.includes(a)) return
              const n = document.activeElement
              if (!(n instanceof HTMLElement)) return
              const i = t.currentTarget
              let s, h
              if (e) {
                const e = n.parentElement
                ;(s = e ? Array.from(e.children) : []), (h = s.indexOf(n))
              } else
                (s = ((d = i),
                Array.from(
                  d.querySelectorAll(
                    'button:not([disabled]):not([aria-disabled])',
                  ),
                ).filter((0, l.createScopedVisibleElementFilter)(d))).sort(
                  l.navigationOrderComparator,
                )),
                  (h = s.indexOf(n))
              var d
              if (0 === s.length || -1 === h) return
              const m = (0, l.mapKeyCodeToDirection)(a)
              switch (m) {
                case 'inlinePrev':
                  if ((t.preventDefault(), !e && 0 === h)) break
                  u(c(s, h, -1))
                  break
                case 'inlineNext':
                  if ((t.preventDefault(), !e && h === s.length - 1)) break
                  u(c(s, h, 1))
                  break
                case 'blockPrev':
                case 'blockNext':
                  ;((a) => {
                    if (!document.activeElement) return
                    const n = v(i),
                      l = document.activeElement.parentElement
                    if (!l) return
                    const o = Array.from(l.children).indexOf(
                      document.activeElement,
                    )
                    if (-1 === o) return
                    const s =
                      n['blockNext' === a ? n.indexOf(l) + 1 : n.indexOf(l) - 1]
                    if (!s) return
                    t.preventDefault()
                    const r = Array.from(s.children)
                    r.length && (!e && o <= r.length - 1 ? u(r[o]) : u(r[0]))
                  })(m)
              }
            },
          ]
        )
      }
      function c(e, t, a) {
        return e[(t + e.length + a) % e.length]
      }
      function v(e) {
        return Array.from(e.querySelectorAll('[data-role="row"]')).filter(
          (0, l.createScopedVisibleElementFilter)(e),
        )
      }
      function d(e, t) {
        const a = (0, i.ensureNotNull)(e.parentElement).offsetTop,
          n = a + (0, i.ensureNotNull)(e.parentElement).clientHeight,
          l = t.scrollTop,
          o = l + t.clientHeight
        return a >= l && n <= o
      }
      function u(e) {
        document.activeElement &&
          (0, s.becomeSecondaryElement)(document.activeElement),
          (0, s.becomeMainElement)(e),
          e.focus()
      }
    },
    577687: (e, t, a) => {
      a.d(t, { FavoriteButton: () => v })
      var n = a(609838),
        i = a(50959),
        l = a(497754),
        o = a(72571),
        s = a(239146),
        r = a(648010),
        h = a(214877)
      const c = {
        add: n.t(null, void 0, a(44629)),
        remove: n.t(null, void 0, a(572482)),
      }
      function v(e) {
        const { className: t, isFilled: a, isActive: n, onClick: v, ...d } = e
        return i.createElement(o.Icon, {
          ...d,
          className: l(
            h.favorite,
            'apply-common-tooltip',
            a && h.checked,
            n && h.active,
            t,
          ),
          icon: a ? s : r,
          onClick: v,
          title: a ? c.remove : c.add,
        })
      }
    },
    585938: (e, t, a) => {
      a.d(t, { useForceUpdate: () => n.useForceUpdate })
      var n = a(813550)
    },
    522224: (e, t, a) => {
      a.d(t, {
        hoverMouseEventFilter: () => n.hoverMouseEventFilter,
        useAccurateHover: () => n.useAccurateHover,
        useHover: () => n.useHover,
      })
      var n = a(975228)
    },
    614417: (e, t, a) => {
      a.d(t, { multilineLabelWithIconAndToolboxTheme: () => o })
      var n = a(493173),
        i = a(671986),
        l = a(333963)
      const o = (0, n.mergeThemes)(i, l)
    },
    72621: (e, t, a) => {
      a.d(t, { RemoveButton: () => h })
      var n = a(609838),
        i = a(50959),
        l = a(497754),
        o = a(72571),
        s = a(333765),
        r = a(927306)
      function h(e) {
        const {
          className: t,
          isActive: h,
          onClick: c,
          onMouseDown: v,
          title: d,
          hidden: u,
          'data-name': m = 'remove-button',
          ...p
        } = e
        return i.createElement(o.Icon, {
          ...p,
          'data-name': m,
          className: l(
            r.button,
            'apply-common-tooltip',
            h && r.active,
            u && r.hidden,
            t,
          ),
          icon: s,
          onClick: c,
          onMouseDown: v,
          title: d || n.t(null, void 0, a(734596)),
        })
      }
    },
    212989: (e) => {
      e.exports = {
        summary: 'summary-ynHBVe1n',
        hovered: 'hovered-ynHBVe1n',
        caret: 'caret-ynHBVe1n',
      }
    },
    290785: (e) => {
      e.exports = { accessible: 'accessible-raQdxQp0' }
    },
    189089: (e) => {
      e.exports = { button: 'button-LkmyTVRc', active: 'active-LkmyTVRc' }
    },
    220461: (e) => {
      e.exports = {
        wrapper: 'wrapper-psOC5oyI',
        labelRow: 'labelRow-psOC5oyI',
        label: 'label-psOC5oyI',
        labelHint: 'labelHint-psOC5oyI',
        labelOn: 'labelOn-psOC5oyI',
      }
    },
    840670: (e) => {
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
    790826: (e) => {
      e.exports = { button: 'button-Y1TCZogJ', active: 'active-Y1TCZogJ' }
    },
    579961: (e) => {
      e.exports = { title: 'title-dYizlxEN' }
    },
    638456: (e) => {
      e.exports = {
        button: 'button-ptpAHg8E',
        withText: 'withText-ptpAHg8E',
        withoutText: 'withoutText-ptpAHg8E',
      }
    },
    567972: (e) => {
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
    739357: (e) => {
      e.exports = { spinnerWrap: 'spinnerWrap-cZT0OZe0' }
    },
    552045: (e) => {
      e.exports = {
        button: 'button-neROVfUe',
        first: 'first-neROVfUe',
        last: 'last-neROVfUe',
      }
    },
    497041: (e) => {
      e.exports = { wrap: 'wrap-n5bmFxyX' }
    },
    664618: (e) => {
      e.exports = { hidden: 'hidden-5MVS18J8' }
    },
    318369: (e) => {
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
    427363: (e) => {
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
    920371: (e) => {
      e.exports = { value: 'value-gwXludjS', selected: 'selected-gwXludjS' }
    },
    700867: (e) => {
      e.exports = {
        smallWidthMenuItem: 'smallWidthMenuItem-RmqZNwwp',
        menuItem: 'menuItem-RmqZNwwp',
        remove: 'remove-RmqZNwwp',
      }
    },
    980022: (e) => {
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
    964603: (e) => {
      e.exports = {
        row: 'row-IFnWgzyS',
        rowInner: 'rowInner-IFnWgzyS',
        smallRow: 'smallRow-IFnWgzyS',
        rowLabel: 'rowLabel-IFnWgzyS',
        smallRowLabel: 'smallRowLabel-IFnWgzyS',
        rowButtons: 'rowButtons-IFnWgzyS',
        layoutButtonWrap: 'layoutButtonWrap-IFnWgzyS',
        accessible: 'accessible-IFnWgzyS',
        smallWidth: 'smallWidth-IFnWgzyS',
        layoutButton: 'layoutButton-IFnWgzyS',
        hovered: 'hovered-IFnWgzyS',
        isActive: 'isActive-IFnWgzyS',
        smallWidthLayoutButton: 'smallWidthLayoutButton-IFnWgzyS',
        layoutButtons: 'layoutButtons-IFnWgzyS',
      }
    },
    209029: (e) => {
      e.exports = {
        toggler: 'toggler-WlD4m0Iu',
        hovered: 'hovered-WlD4m0Iu',
        label: 'label-WlD4m0Iu',
        centered: 'centered-WlD4m0Iu',
        checked: 'checked-WlD4m0Iu',
        switcherLabel: 'switcherLabel-WlD4m0Iu',
      }
    },
    849208: (e) => {
      e.exports = {
        button: 'button-aGeQPIIx',
        dropdown: 'dropdown-aGeQPIIx',
        layoutType: 'layoutType-aGeQPIIx',
        title: 'title-aGeQPIIx',
        syncCharts: 'syncCharts-aGeQPIIx',
        mobile: 'mobile-aGeQPIIx',
        tabletWrapper: 'tabletWrapper-aGeQPIIx',
        icon: 'icon-aGeQPIIx',
        syncListWrapper: 'syncListWrapper-aGeQPIIx',
        switcher: 'switcher-aGeQPIIx',
        switchLabelWrap: 'switchLabelWrap-aGeQPIIx',
        switchLabel: 'switchLabel-aGeQPIIx',
        iconWrap: 'iconWrap-aGeQPIIx',
        infoIcon: 'infoIcon-aGeQPIIx',
        accessibleLabel: 'accessibleLabel-aGeQPIIx',
      }
    },
    423902: (e) => {
      e.exports = { button: 'button-gn9HMufu' }
    },
    692998: (e) => {
      e.exports = {
        button: 'button-ZuDkGGhF',
        isDisabled: 'isDisabled-ZuDkGGhF',
      }
    },
    870152: (e) => {
      e.exports = {
        saveString: 'saveString-XVd1Kfjg',
        hidden: 'hidden-XVd1Kfjg',
        loader: 'loader-XVd1Kfjg',
      }
    },
    663672: (e) => {
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
    425882: (e) => {
      e.exports = {
        button: 'button-cq__ntSC',
        smallLeftPadding: 'smallLeftPadding-cq__ntSC',
        text: 'text-cq__ntSC',
        uppercase: 'uppercase-cq__ntSC',
      }
    },
    292710: (e) => {
      e.exports = { description: 'description-jgoQcEnP' }
    },
    905145: (e) => {
      e.exports = {
        item: 'item-j7oVl2yI',
        accessible: 'accessible-j7oVl2yI',
        round: 'round-j7oVl2yI',
      }
    },
    185013: (e) => {
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
    736001: (e) => {
      e.exports = {
        menu: 'menu-hcofKPms',
        menuSmallTablet: 'menuSmallTablet-hcofKPms',
        menuItemHeaderTabletSmall: 'menuItemHeaderTabletSmall-hcofKPms',
        menuItemHeader: 'menuItemHeader-hcofKPms',
      }
    },
    370760: (e) => {
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
    475747: (e, t, a) => {
      a.d(t, { CollapsibleSection: () => r })
      var n = a(50959),
        i = a(497754),
        l = a.n(i),
        o = a(515783),
        s = a(212989)
      const r = (0, n.forwardRef)((e, t) => {
        const {
          open: a,
          summary: i,
          children: r,
          onStateChange: h,
          tabIndex: c,
          className: v,
          ...d
        } = e
        return n.createElement(
          n.Fragment,
          null,
          n.createElement(
            'div',
            {
              ...d,
              className: l()(v, s.summary),
              onClick: () => {
                h && h(!a)
              },
              'data-open': a,
              ref: t,
              tabIndex: c,
            },
            i,
            n.createElement(o.ToolWidgetCaret, {
              className: s.caret,
              dropped: Boolean(a),
            }),
          ),
          a && r,
        )
      })
    },
    347041: (e, t, a) => {
      a.d(t, { MenuFavoriteButton: () => c })
      var n = a(50959),
        i = a(497754),
        l = a.n(i),
        o = a(865266),
        s = a(892932),
        r = a(577687),
        h = a(189089)
      function c(e) {
        const { tooltip: t, onClick: a, ...i } = e,
          [c, v] = (0, o.useRovingTabindexElement)(null)
        return s.PLATFORM_ACCESSIBILITY_ENABLED
          ? n.createElement(
              'button',
              {
                ref: c,
                tabIndex: v,
                onClick: a,
                className: l()(h.button, i.isActive && h.active),
                type: 'button',
              },
              n.createElement(r.FavoriteButton, {
                'aria-label': t,
                ...i,
                'data-tooltip': t,
              }),
            )
          : n.createElement(r.FavoriteButton, { ...e, 'data-tooltip': t })
      }
    },
    321659: (e, t, a) => {
      a.d(t, {
        DEFAULT_MENU_ITEM_SWITCHER_THEME: () => b,
        MenuItemSwitcher: () => w,
      })
      var n = a(50959),
        i = a(497754),
        l = a.n(i),
        o = a(234539),
        s = a(626574),
        r = a.n(s)
      function h(e) {
        const t = (0, n.useContext)(o.CustomBehaviourContext),
          {
            className: a,
            intent: l = 'default',
            size: s = 'small',
            enableActiveStateStyles: h = t.enableActiveStateStyles,
          } = e
        return i(
          a,
          r().switcher,
          r()[`size-${s}`],
          r()[`intent-${l}`],
          !h && r()['disable-active-state-styles'],
        )
      }
      function c(e) {
        var t
        const {
            reference: a,
            size: i,
            intent: l,
            role: o,
            'aria-checked': s,
            checked: c,
            defaultChecked: v,
            onKeyDown: d,
            ...u
          } = e,
          m = (0, n.useCallback)(
            (e) => {
              13 === e.keyCode && e.target.click(), d && d(e)
            },
            [d],
          )
        return n.createElement(
          'span',
          { className: h(e) },
          n.createElement('input', {
            ...u,
            type: 'checkbox',
            className: r().input,
            ref: a,
            role: null != o ? o : 'switch',
            'aria-checked':
              null !== (t = null != s ? s : c) && void 0 !== t ? t : v,
            checked: c,
            defaultChecked: v,
            onKeyDown: m,
          }),
          n.createElement(
            'span',
            { className: r()['thumb-wrapper'] },
            n.createElement('span', { className: r().track }),
            n.createElement('span', { className: r().thumb }),
          ),
        )
      }
      var v = a(72571),
        d = a(892932),
        u = a(930202),
        m = a(865266),
        p = a(800417),
        g = a(840670)
      const b = g
      function w(e) {
        const {
            className: t,
            checked: a,
            id: i,
            label: o,
            labelDescription: s,
            value: r,
            preventLabelHighlight: h,
            reference: b,
            switchReference: w,
            theme: C = g,
            disabled: S,
            icon: y,
          } = e,
          [f, _] = (0, m.useRovingTabindexElement)(null),
          E = l()(C.label, a && !h && C.labelOn),
          M = l()(
            t,
            C.wrapper,
            a && C.wrapperWithOnLabel,
            s && C.wrapperWithDescription,
          )
        return n.createElement(
          'label',
          {
            className: l()(
              M,
              y && C.withIcon,
              d.PLATFORM_ACCESSIBILITY_ENABLED && g.accessible,
            ),
            htmlFor: i,
            ref: b,
            onKeyDown: (e) => {
              if (
                !d.PLATFORM_ACCESSIBILITY_ENABLED ||
                e.target !== e.currentTarget
              )
                return
              const t = (0, u.hashFromEvent)(e)
              ;(13 !== t && 32 !== t) ||
                (e.preventDefault(),
                f.current instanceof HTMLElement && f.current.click())
            },
            tabIndex: _,
            'data-role': d.PLATFORM_ACCESSIBILITY_ENABLED ? 'menuitem' : void 0,
            'aria-disabled':
              (d.PLATFORM_ACCESSIBILITY_ENABLED && e.disabled) || void 0,
          },
          void 0 !== y &&
            n.createElement(v.Icon, { className: C.icon, icon: y }),
          n.createElement(
            'div',
            { className: C.labelRow },
            n.createElement('div', { className: E }, o),
            s && n.createElement('div', { className: C.labelHint }, s),
          ),
          n.createElement(
            'div',
            { className: g.switchWrap },
            n.createElement(c, {
              disabled: S,
              className: C.switch,
              reference: (e) => {
                f(e), null == w || w(e)
              },
              checked: a,
              onChange: (t) => {
                const a = t.target.checked
                void 0 !== e.onChange && e.onChange(a)
              },
              value: r,
              tabIndex: -1,
              id: i,
              role: e.switchRole,
              'aria-disabled': d.PLATFORM_ACCESSIBILITY_ENABLED,
              ...(0, p.filterDataProps)(e),
            }),
          ),
        )
      }
    },
    774879: (e, t, a) => {
      a.d(t, { MenuRemoveButton: () => c })
      var n = a(50959),
        i = a(497754),
        l = a.n(i),
        o = a(865266),
        s = a(892932),
        r = a(72621),
        h = a(790826)
      function c(e) {
        const { tooltip: t, onClick: a, ...i } = e,
          [c, v] = (0, o.useRovingTabindexElement)(null)
        return s.PLATFORM_ACCESSIBILITY_ENABLED
          ? n.createElement(
              'button',
              {
                ref: c,
                tabIndex: v,
                onClick: a,
                className: l()(h.button, i.isActive && h.active),
                type: 'button',
              },
              n.createElement(r.RemoveButton, {
                'aria-label': t,
                ...i,
                'data-tooltip': t,
              }),
            )
          : n.createElement(r.RemoveButton, { ...e, 'data-tooltip': t })
      }
    },
    479289: (e, t, a) => {
      a.d(t, { INTERVALS: () => i })
      var n = a(609838)
      const i = [
        { name: '', label: n.t(null, { context: 'interval' }, a(537830)) },
        { name: 'H', label: n.t(null, { context: 'interval' }, a(705285)) },
        { name: 'D', label: n.t(null, { context: 'interval' }, a(306174)) },
        { name: 'W', label: n.t(null, { context: 'interval' }, a(725042)) },
        { name: 'M', label: n.t(null, { context: 'interval' }, a(179410)) },
      ]
    },
    879530: (e, t, a) => {
      a.d(t, { ToolWidgetMenuSpinner: () => r })
      var n = a(50959),
        i = a(497754),
        l = a.n(i),
        o = a(234404),
        s = a(739357)
      function r(e) {
        const { className: t } = e
        return n.createElement(
          'div',
          { className: l()(s.spinnerWrap, t) },
          n.createElement(o.Loader, null),
        )
      }
    },
    94299: (e, t, a) => {
      a.r(t), a.d(t, { getRestrictedToolSet: () => Qn })
      var n = a(156963),
        i = a(50959),
        l = a(719036),
        o = a(609838),
        s = a(688401),
        r = a(754771),
        h = a(583798),
        c = a(72571),
        v = a(53431),
        d = a(497754),
        u = a.n(d),
        m = a(497041)
      const p = i.forwardRef((e, t) => {
        const { children: a, className: n, ...l } = e
        return i.createElement(
          'div',
          { className: d(n, m.wrap), ref: t, ...l },
          a,
        )
      })
      var g = a(501836),
        b = a(552045)
      class w extends i.PureComponent {
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
            hint: a,
            text: n,
            isDisabled: l,
            isActive: o,
            isFirst: s,
            isLast: r,
            onClick: h,
            onClickArg: c,
            ...v
          } = this.props
          return i.createElement(g.ToolbarButton, {
            ...v,
            icon: t,
            text: n,
            tooltip: a,
            isDisabled: l,
            isActive: o,
            isGrouped: !0,
            onClick: this._handleClick,
            className: d(e, b.button, { [b.first]: s, [b.last]: r }),
          })
        }
      }
      var C = a(917850),
        S = a(930052),
        y = a(996038),
        f = a(614417),
        _ = a(261401),
        E = a(938867),
        M = a(681434),
        x = a(269842),
        A = a(930202),
        I = a(892932)
      function T(e) {
        const { orientation: t, onKeyDown: a, ...n } = e,
          l = I.PLATFORM_ACCESSIBILITY_ENABLED
            ? { role: 'radiogroup', 'aria-orientation': t }
            : {}
        return i.createElement('div', {
          ...n,
          ...l,
          onKeyDown: (0, x.createSafeMulticastEventHandler)((e) => {
            if (!I.PLATFORM_ACCESSIBILITY_ENABLED) return
            if (e.defaultPrevented) return
            if (!(document.activeElement instanceof HTMLElement)) return
            const a = (0, A.hashFromEvent)(e)
            if ('vertical' !== t && 38 !== a && 40 !== a) return
            if ('vertical' === t && 37 !== a && 39 !== a) return
            const n = ((i = e.currentTarget),
            Array.from(
              i.querySelectorAll(
                '[role="radio"]:not([disabled]):not([aria-disabled])',
              ),
            ).filter((0, I.createScopedVisibleElementFilter)(i))).sort(
              I.navigationOrderComparator,
            )
            var i
            if (0 === n.length) return
            const l = n.indexOf(document.activeElement)
            if (-1 === l) return
            e.preventDefault()
            const o = () => {
                const e = (l + n.length - 1) % n.length
                n[l].dispatchEvent(
                  new CustomEvent('roving-tabindex:secondary-element'),
                ),
                  n[e].dispatchEvent(
                    new CustomEvent('roving-tabindex:main-element'),
                  ),
                  n[e].focus()
              },
              s = () => {
                const e = (l + n.length + 1) % n.length
                n[l].dispatchEvent(
                  new CustomEvent('roving-tabindex:secondary-element'),
                ),
                  n[e].dispatchEvent(
                    new CustomEvent('roving-tabindex:main-element'),
                  ),
                  n[e].focus()
              }
            switch (a) {
              case 38:
                'vertical' !== t && o()
                break
              case 40:
                'vertical' !== t && s()
                break
              case 37:
                'vertical' === t && o()
                break
              case 39:
                'vertical' === t && s()
            }
          }, a),
        })
      }
      var k = a(137869),
        H = a(347041),
        L = a(4549)
      const R = { barsStyle: o.t(null, void 0, a(684232)) },
        N = (0, _.registryContextType)()
      function V(e) {
        var t
        return !(null === (t = s.linking.supportedChartStyles.value()) ||
        void 0 === t
          ? void 0
          : t.includes(e))
      }
      const Z = 'ITEMS_DIVIDER',
        F = [
          [0, 1, 9],
          [2, 14, 15],
          [3, 16, 10],
          [13, 12],
          [8, 4, 7, 5, 6, 17, 11],
        ]
      class O extends i.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._handleChangeStyle = (e) => {
              const {
                favorites: t,
                lastSelectedNotFavorite: a,
                activeStyle: n,
              } = this.state
              this.setState({
                activeStyle: e,
                lastSelectedNotFavorite: t.includes(n) ? a : n,
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
            (0, _.validateRegistry)(t, {
              chartWidgetCollection: l.any.isRequired,
              favoriteChartStylesService: l.any.isRequired,
            })
          const { chartWidgetCollection: a, favoriteChartStylesService: n } = t,
            i = a.activeChartStyle.value(),
            o = n.get(),
            s = new Set((0, E.allChartStyles)())
          this.state = {
            activeStyle: i,
            favorites: o,
            styles: F.reduce((e, t) => {
              const a = t.filter((e) => s.has(e))
              return a.length && (e.length && a.unshift(Z), e.push(...a)), e
            }, []),
          }
        }
        componentDidMount() {
          const { chartWidgetCollection: e, favoriteChartStylesService: t } =
            this.context
          e.activeChartStyle.subscribe(this._handleChangeStyle),
            t.getOnChange().subscribe(this, this._handleChangeSettings),
            s.linking.supportedChartStyles.subscribe(this._boundForceUpdate)
        }
        componentWillUnmount() {
          const { chartWidgetCollection: e, favoriteChartStylesService: t } =
            this.context
          e.activeChartStyle.unsubscribe(this._handleChangeStyle),
            t.getOnChange().unsubscribe(this, this._handleChangeSettings),
            s.linking.supportedChartStyles.unsubscribe(this._boundForceUpdate)
        }
        render() {
          const {
              isShownQuicks: e,
              displayMode: t = 'full',
              id: a,
            } = this.props,
            {
              activeStyle: n,
              favorites: l,
              styles: o,
              lastSelectedNotFavorite: s,
            } = this.state,
            d = 'small' !== t && e && 0 !== l.length,
            u = [...l]
          u.includes(n) ? void 0 !== s && u.push(s) : u.push(n)
          const m = d && u.length > 1
          return i.createElement(
            S.MatchMedia,
            { rule: y.DialogBreakpoints.TabletSmall },
            (e) => {
              const t = o.map((t, a) =>
                t === Z
                  ? i.createElement(C.PopupMenuSeparator, {
                      key: `separator-${a}`,
                    })
                  : this._renderPopupMenuItem(t, t === n, e),
              )
              return i.createElement(
                p,
                { id: a },
                m &&
                  i.createElement(
                    T,
                    { orientation: 'horizontal', className: L.group },
                    u.map((e, t) =>
                      i.createElement(w, {
                        role: 'radio',
                        className: L.button,
                        icon: h.SERIES_ICONS[e],
                        'aria-checked': d && n === e,
                        isActive: d && n === e,
                        isDisabled: V(e),
                        key: t,
                        hint: (0, M.getTranslatedChartStyleName)(e),
                        isFirst: 0 === t,
                        isLast: t === u.length - 1,
                        onClick: d ? this._handleQuickClick : void 0,
                        onClickArg: e,
                        'data-value': r.STYLE_SHORT_NAMES[e],
                      }),
                    ),
                  ),
                i.createElement(
                  v.ToolbarMenuButton,
                  {
                    arrow: Boolean(m),
                    content: m
                      ? void 0
                      : i.createElement(
                          p,
                          null,
                          i.createElement(c.Icon, { icon: h.SERIES_ICONS[n] }),
                        ),
                    tooltip: m
                      ? R.barsStyle
                      : (0, M.getTranslatedChartStyleName)(n),
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
        _renderPopupMenuItem(e, t, a) {
          const { isFavoritingAllowed: n } = this.props,
            l = this._isStyleFavorited(e)
          return i.createElement(k.AccessibleMenuItem, {
            key: `chart-type-${e}`,
            theme: a ? f.multilineLabelWithIconAndToolboxTheme : void 0,
            icon: h.SERIES_ICONS[e],
            isActive: t,
            isDisabled: V(e),
            label: (0, M.getTranslatedChartStyleName)(e) || '',
            onClick: this._handleSelectStyle,
            onClickArg: e,
            showToolboxOnHover: !l,
            showToolboxOnFocus: I.PLATFORM_ACCESSIBILITY_ENABLED,
            toolbox:
              n &&
              i.createElement(H.MenuFavoriteButton, {
                isActive: t,
                isFilled: l,
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
            { favoriteChartStylesService: a } = this.context
          a.set([...t, e])
        }
        _handleRemoveFavorite(e) {
          const { favorites: t } = this.state,
            { favoriteChartStylesService: a } = this.context
          a.set(t.filter((t) => t !== e))
        }
        _trackClick() {
          0
        }
      }
      O.contextType = N
      var B = a(865266),
        D = a(747633),
        W = a(638456)
      const P = ['medium', 'small'],
        z = (0, i.forwardRef)((e, t) => {
          const {
              text: a,
              className: n,
              displayMode: l,
              collapseWhen: o = P,
              ...s
            } = e,
            r = !o.includes(l)
          return i.createElement(D.ToolWidgetButton, {
            ...s,
            ref: t,
            text: r ? a : void 0,
            className: d(n, W.button, r ? W.withText : W.withoutText),
          })
        })
      function U(e) {
        const { tooltip: t, ...a } = e,
          [n, l] = (0, B.useRovingTabindexElement)(null)
        return i.createElement(z, {
          'aria-label': I.PLATFORM_ACCESSIBILITY_ENABLED ? t : void 0,
          ...a,
          tag: I.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div',
          tabIndex: l,
          ref: n,
          'data-tooltip': t,
        })
      }
      var Q = a(32133),
        K = a(111706),
        q = a(301393)
      const G = (0, _.registryContextType)()
      class j extends i.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._updateState = (e) => {
              this.setState({ isActive: e })
            }),
            (this._handleClick = (e) => {
              var t
              ;(0, Q.trackEvent)('GUI', 'Chart Header Toolbar', 'compare'),
                null === (t = this._compareDialogRenderer) ||
                  void 0 === t ||
                  t.show({ shouldReturnFocus: (0, K.isKeyboardClick)(e) })
            }),
            (0, _.validateRegistry)(t, {
              chartWidgetCollection: l.any.isRequired,
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
          return i.createElement(U, {
            ...this.props,
            icon: q,
            isOpened: e,
            onClick: this._handleClick,
            collapseWhen: ['full', 'medium', 'small'],
            tooltip: o.t(null, void 0, a(220229)),
          })
        }
      }
      j.contextType = G
      var Y = a(332913),
        X = a(725784),
        $ = a(180185),
        J = a(597268),
        ee = a(236992)
      const te = (0, X.hotKeySerialize)({
          keys: [(0, $.humanReadableModifiers)($.Modifiers.Shift, !1), 'F'],
          text: '{0} + {1}',
        }),
        ae = (0, _.registryContextType)()
      function ne(e) {
        return e.fullscreen().value() ? ee : J
      }
      class ie extends i.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._updateState = () => {
              this.setState({ icon: ne(this.context.chartWidgetCollection) })
            }),
            (this._handleClick = () => {
              const { chartWidgetCollection: e } = this.context
              e.fullscreen().value() ? e.exitFullscreen() : e.startFullscreen()
            }),
            (0, _.validateRegistry)(t, {
              chartWidgetCollection: l.any.isRequired,
            }),
            (this.state = { icon: ne(this.context.chartWidgetCollection) }),
            this._subscribe()
        }
        render() {
          const { className: e, id: t } = this.props,
            { icon: n } = this.state
          return i.createElement(Y.ToolbarIconButton, {
            id: t,
            icon: n,
            onClick: this._handleClick,
            className: d(e),
            tooltip: o.t(null, void 0, a(811682)),
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
      ie.contextType = ae
      var le = a(650151),
        oe = a(192063),
        se = a(179807),
        re = a(982552)
      const he = (0, a(6835).getLogger)('FavoritesInfo')
      function ce(e) {
        if (0 === e.length) return Promise.resolve([])
        he.logNormal('Requesting favorites info')
        const t = [],
          a = new Map(),
          n = new Map(),
          i = new Map()
        return (
          e.forEach((e) => {
            switch (e.type) {
              case 'java':
                i.set(e.studyId, e)
                break
              case 'pine':
                isPublishedPineId(e.pineId)
                  ? a.set(e.pineId, e)
                  : n.set(e.pineId, e)
                break
              default:
                ;(0, le.assert)(
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
                  for (const a of e)
                    !a.is_hidden_study &&
                      i.has(a.id) &&
                      t.set(a.id, {
                        name: a.description,
                        localizedName: a.description_localized,
                        studyMarketShittyObject: a,
                      })
                  return t
                })
                .then((e) => {
                  const t = ((e, t) => {
                    const a = { items: [], notFoundItems: [] }
                    return (
                      e.forEach((e, n) => {
                        const i = t.get(n)
                        void 0 !== i
                          ? a.items.push({ item: e, info: i })
                          : a.notFoundItems.push(e)
                      }),
                      a
                    )
                  })(i, e)
                  if (0 !== t.notFoundItems.length) {
                    const e = t.notFoundItems.map((e) => e.studyId)
                    he.logWarn(`Cannot find java scripts: ${JSON.stringify(e)}`)
                  }
                  return t.items
                }),
            ),
          Promise.all(t).then(
            (e) => (
              he.logNormal('Requesting favorites info finished'),
              e.reduce((e, t) => e.concat(t), [])
            ),
          )
        )
      }
      var ve = a(919577),
        de = a(683471),
        ue = a(879530),
        me = a(163915),
        pe = a(559410),
        ge = a(139681),
        be = a(75352)
      const we = (0, X.hotKeySerialize)({ keys: ['/'], text: '{0}' }),
        Ce = (0, _.registryContextType)()
      class Se extends i.PureComponent {
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
                  : t.show({ shouldReturnFocus: (0, K.isKeyboardClick)(e) })
              }),
                this._trackClick()
            }),
            (this._handleSelectIndicator = (e) => {
              ;(e = (0, le.ensureDefined)(e)),
                this._trackFavoriteAction('Favorite indicator from toolbar')
              'java' === e.type ? e.studyId : e.pineId
              ;(() => {
                e = (0, le.ensureDefined)(e)
                const { chartWidgetCollection: t } = this.context
                if ('java' === e.type) {
                  const t = (0, ve.tryFindStudyLineToolNameByStudyId)(e.studyId)
                  if (null !== t) return void de.tool.setValue(t)
                }
                t.activeChartWidget.value().insertStudy(e, [])
              })()
            }),
            (this._handleFavoriteIndicatorsChange = () => {
              const { favoriteScriptsModel: e } = this.context,
                t = [...(0, le.ensureDefined)(e).favorites()]
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
            (0, _.validateRegistry)(t, {
              favoriteScriptsModel: l.any,
              chartWidgetCollection: l.any.isRequired,
            })
          const { favoriteScriptsModel: a } = t,
            n = void 0 !== a ? a.favorites() : []
          this.state = {
            isActive: !1,
            isLoading: !1,
            favorites: n,
            favoriteFundamentals: void 0,
            infos: [],
          }
        }
        componentDidMount() {
          const { studyMarket: e } = this.props,
            { favoriteScriptsModel: t, chartWidgetCollection: a } = this.context
          e.visible().subscribe(this._setActiveState),
            void 0 !== t &&
              (t
                .favoritesChanged()
                .subscribe(this, this._handleFavoriteIndicatorsChange),
              a.activeChartWidget.subscribe(this._handleChangeActiveWidget)),
            pe.on('TVScriptRenamed', this._handleScriptRenamed, null)
        }
        componentWillUnmount() {
          const { studyMarket: e } = this.props,
            { favoriteScriptsModel: t, chartWidgetCollection: a } = this.context
          e.visible().unsubscribe(this._setActiveState),
            void 0 !== t &&
              (t
                .favoritesChanged()
                .unsubscribe(this, this._handleFavoriteIndicatorsChange),
              a.activeChartWidget.unsubscribe(this._handleChangeActiveWidget)),
            pe.unsubscribe('TVScriptRenamed', this._handleScriptRenamed, null),
            (this._promise = null)
        }
        render() {
          const {
              isActive: e,
              favorites: t,
              favoriteFundamentals: n,
              isLoading: l,
            } = this.state,
            { className: s, displayMode: r, id: h } = this.props,
            { chartWidgetCollection: c } = this.context
          return i.createElement(
            i.Fragment,
            null,
            i.createElement(
              p,
              {
                id: h,
                onMouseEnter: this._handleMouseEnter,
                onClick: this._handleWrapClick,
              },
              i.createElement(U, {
                displayMode: r,
                className: s,
                icon: ge,
                isOpened: e,
                onClick: this._handleClick,
                text: o.t(null, void 0, a(561142)),
                'data-role': 'button',
                'data-name': 'open-indicators-dialog',
                tooltip: o.t(null, void 0, a(174527)),
                'data-tooltip-hotkey': we,
              }),
              Boolean(t.length > 0 || (null == n ? void 0 : n.size)) &&
                i.createElement(
                  S.MatchMedia,
                  { rule: 'screen and (max-width: 430px)' },
                  (e) =>
                    i.createElement(
                      v.ToolbarMenuButton,
                      {
                        key: c.activeChartWidget.value().id(),
                        arrow: !0,
                        closeOnClickOutside: !0,
                        isDrawer: e,
                        drawerPosition: 'Bottom',
                        ref: this._menu,
                        menuReference: this._menuItemsContainer,
                        onClick: this._handleFavoriteMenuClick,
                        'data-name': 'show-favorite-indicators',
                        tooltip: o.t(null, void 0, a(933959)),
                      },
                      i.createElement(
                        'div',
                        {
                          className: u()(
                            be.dropdown,
                            e && be.smallWidthWrapper,
                          ),
                        },
                        i.createElement(
                          me.ToolWidgetMenuSummary,
                          { className: e && be.smallWidthTitle },
                          o.t(null, void 0, a(783127)),
                        ),
                        l && i.createElement(ue.ToolWidgetMenuSpinner, null),
                        !l &&
                          i.createElement(
                            i.Fragment,
                            null,
                            this.state.infos.length > 0
                              ? this.state.infos.map((t) =>
                                  i.createElement(k.AccessibleMenuItem, {
                                    className: u()(e && be.smallWidthMenuItem),
                                    theme: e
                                      ? f.multilineLabelWithIconAndToolboxTheme
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
                                        className: u()(
                                          !e && be.label,
                                          e && be.smallWidthLabel,
                                          'apply-overflow-tooltip',
                                        ),
                                      },
                                      ye(t),
                                    ),
                                  }),
                                )
                              : null !== this._promise &&
                                  i.createElement(oe.PopupMenuItem, {
                                    isDisabled: !0,
                                    label: o.t(null, void 0, a(223687)),
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
            ce(this.state.favorites),
            void 0,
          ]).then((e) => {
            if (t !== this._promise) return
            const [a, n] = e
            let i = [...a]
            if (n) {
              const e = n
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
            ;(i = [...i].sort((e, t) => ye(e).localeCompare(ye(t)))),
              this.setState({ infos: i, isLoading: !1 }, () => {
                var e
                null === (e = this._menu.current) || void 0 === e || e.update(),
                  this._menuItemsContainer.current &&
                    document.activeElement ===
                      this._menuItemsContainer.current &&
                    (0, se.focusFirstMenuItem)(this._menuItemsContainer.current)
              })
          }))
        }
        _trackClick() {
          0
        }
        _trackFavoriteAction(e) {
          ;(0, Q.trackEvent)('GUI', 'Chart Header Toolbar', e)
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
      function ye(e) {
        return (
          e.info.localizedName ||
          o.t(e.info.name, { context: 'study' }, a(168716))
        )
      }
      Se.contextType = Ce
      var fe = a(739343),
        _e = a(920371)
      function Ee(e) {
        return i.createElement(
          'div',
          { className: d(_e.value, { [_e.selected]: e.isSelected }) },
          e.value,
          e.metric,
        )
      }
      var Me = a(479289),
        xe = a(567972)
      function Ae(e) {
        const { className: t, ...a } = e,
          [n, l] = (0, B.useRovingTabindexElement)(null),
          o = I.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div'
        return i.createElement(o, {
          ...a,
          ref: n,
          tabIndex: l,
          'data-role': I.PLATFORM_ACCESSIBILITY_ENABLED ? 'menuitem' : void 0,
          className: u()(I.PLATFORM_ACCESSIBILITY_ENABLED && xe.accessible, t),
        })
      }
      function Ie(e) {
        const { className: t, ...a } = e,
          [n, l] = (0, B.useRovingTabindexElement)(null)
        return i.createElement('input', {
          ...a,
          ref: n,
          tabIndex: l,
          'data-role': I.PLATFORM_ACCESSIBILITY_ENABLED ? 'menuitem' : void 0,
          className: u()(I.PLATFORM_ACCESSIBILITY_ENABLED && xe.accessible, t),
        })
      }
      class Te extends i.PureComponent {
        constructor(e) {
          super(e),
            (this._menu = i.createRef()),
            (this._handleChangeInput = (e) => {
              const { value: t } = e.currentTarget
              ;/^[0-9]*$/.test(t) && this.setState({ inputValue: t })
            }),
            (this._handleSelectTime = (e) => {
              var t, a, n, i
              this.setState({ selectedIntervalSuffix: e }),
                null === (a = (t = this.props).onSelect) ||
                  void 0 === a ||
                  a.call(t),
                null === (n = this._menu.current) || void 0 === n || n.close(),
                null === (i = this._menu.current) || void 0 === i || i.focus()
            }),
            (this._handleClickAdd = () => {
              const { inputValue: e, selectedIntervalSuffix: t } = this.state
              this.props.onAdd(e, t)
            }),
            (this.state = {
              inputValue: '1',
              selectedIntervalSuffix: Me.INTERVALS[0].name,
            })
        }
        render() {
          const {
            inputValue: e,
            menuWidth: t,
            selectedIntervalSuffix: n,
          } = this.state
          return i.createElement(
            'div',
            { className: xe.form },
            i.createElement(Ie, {
              className: xe.input,
              maxLength: 7,
              onChange: this._handleChangeInput,
              value: e,
            }),
            i.createElement(
              v.ToolbarMenuButton,
              {
                orientation: 'none',
                minWidth: t,
                'data-role': 'menuitem',
                onClose: this.props.onCloseMenu,
                onOpen: this.props.onOpenMenu,
                className: xe.menu,
                ref: this._menu,
                content: i.createElement(
                  'div',
                  { className: xe.menuLabel },
                  Me.INTERVALS.find((e) => e.name === n).label,
                ),
              },
              Me.INTERVALS.map((e) =>
                i.createElement(k.AccessibleMenuItem, {
                  dontClosePopup: !0,
                  key: e.name,
                  label: e.label,
                  onClick: this._handleSelectTime,
                  onClickArg: e.name,
                }),
              ),
            ),
            i.createElement(
              Ae,
              { className: xe.add, onClick: this._handleClickAdd },
              o.t(null, void 0, a(954777)),
            ),
          )
        }
      }
      var ke = a(800417),
        He = a(522224),
        Le = a(972535),
        Re = a(774879),
        Ne = a(700867)
      function Ve(e) {
        const {
            interval: t,
            hint: a,
            isActive: n,
            isDisabled: l,
            isFavorite: o,
            isSignaling: s,
            onClick: r,
            onClickRemove: h,
            onClickFavorite: c,
            isSmallTablet: v,
          } = e,
          d = (0, ke.filterDataProps)(e),
          [m, p] = (0, He.useHover)(),
          g = i.useCallback((e) => h(t, e), [h, t]),
          b = i.useCallback(() => c(t), [c, t]),
          w = (0, i.useRef)(null)
        return (
          (0, i.useEffect)(() => {
            var e
            s &&
              v &&
              (null === (e = w.current) || void 0 === e || e.scrollIntoView())
          }, [s, v]),
          i.createElement(
            'div',
            { ...p, ref: w },
            i.createElement(k.AccessibleMenuItem, {
              ...d,
              className: u()(Ne.menuItem, v && Ne.smallWidthMenuItem),
              theme: v ? f.multilineLabelWithIconAndToolboxTheme : void 0,
              isActive: n,
              isDisabled: l,
              isHovered: s,
              onClick: r,
              onClickArg: t,
              toolbox: (() => {
                const { isRemovable: t, isFavoritingAllowed: a } = e,
                  s = i.createElement(Re.MenuRemoveButton, {
                    key: 'remove',
                    isActive: n,
                    hidden: !Le.touch && !m,
                    onClick: g,
                    className: Ne.remove,
                  }),
                  r = i.createElement(H.MenuFavoriteButton, {
                    key: 'favorite',
                    isActive: n,
                    isFilled: o,
                    onClick: b,
                  })
                return [t && s, !l && a && r]
              })(),
              showToolboxOnHover: !o,
              showToolboxOnFocus: I.PLATFORM_ACCESSIBILITY_ENABLED,
              label: a,
            }),
          )
        )
      }
      var Ze = a(628589)
      const Fe = {
        [Ze.ResolutionKind.Ticks]: o.t(
          null,
          { context: 'interval_group_name' },
          a(130426),
        ),
        [Ze.ResolutionKind.Seconds]: o.t(
          null,
          { context: 'interval_group_name' },
          a(774973),
        ),
        [Ze.ResolutionKind.Minutes]: o.t(
          null,
          { context: 'interval_group_name' },
          a(357470),
        ),
        [Ze.SpecialResolutionKind.Hours]: o.t(
          null,
          { context: 'interval_group_name' },
          a(162346),
        ),
        [Ze.ResolutionKind.Days]: o.t(
          null,
          { context: 'interval_group_name' },
          a(274787),
        ),
        [Ze.ResolutionKind.Weeks]: o.t(
          null,
          { context: 'interval_group_name' },
          a(386614),
        ),
        [Ze.ResolutionKind.Months]: o.t(
          null,
          { context: 'interval_group_name' },
          a(394328),
        ),
        [Ze.ResolutionKind.Range]: o.t(
          null,
          { context: 'interval_group_name' },
          a(348801),
        ),
        [Ze.ResolutionKind.Invalid]: '',
      }
      function Oe(e, t = !1) {
        return { id: e, name: Fe[e], items: [], mayOmitSeparator: t }
      }
      var Be = a(466052),
        De = a(28466),
        We = a(370981),
        Pe = a(475747),
        ze = a(290785)
      function Ue(e) {
        const { className: t, ...a } = e,
          [n, l] = (0, B.useRovingTabindexElement)(null)
        return i.createElement(Pe.CollapsibleSection, {
          ...a,
          ref: n,
          tabIndex: l,
          'data-role': I.PLATFORM_ACCESSIBILITY_ENABLED ? 'menuitem' : void 0,
          className: u()(I.PLATFORM_ACCESSIBILITY_ENABLED && ze.accessible, t),
          onKeyDown: (e) => {
            const t = (0, A.hashFromEvent)(e)
            ;(13 !== t && 32 !== t) ||
              (e.preventDefault(),
              n.current instanceof HTMLElement && n.current.click())
          },
        })
      }
      var Qe = a(980022)
      const Ke = {
          openDialog: o.t(null, void 0, a(979353)),
          timeInterval: o.t(null, void 0, a(132916)),
        },
        qe = (0, X.hotKeySerialize)({
          keys: [','],
          text: o.t(null, void 0, a(814605)),
        }),
        Ge = (0, _.registryContextType)(),
        je = new Be.Delegate(),
        Ye = i.lazy(async () => ({
          default: (
            await Promise.all([
              a.e(2109),
              a.e(2253),
              a.e(580),
              a.e(2108),
              a.e(8194),
              a.e(5145),
              a.e(855),
              a.e(2191),
              a.e(7194),
              a.e(4215),
              a.e(2676),
              a.e(766),
              a.e(2874),
              a.e(4013),
            ]).then(a.bind(a, 494357))
          ).ToolWidgetIntervalsAddDialog,
        }))
      class Xe extends i.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._menu = i.createRef()),
            (this._menuItemsContainerRef = i.createRef()),
            (this._renderChildren = (e, t) => [
              ...this._createMenuItems(e, t),
              ...this._createIntervalForm(t),
            ]),
            (this._handleChangeInterval = (e) => {
              const { activeInterval: t, lastNotQuicked: a } = this.state,
                n = this._getQuicks()
              this.setState({
                activeInterval: (0, fe.normalizeIntervalString)(e),
                lastNotQuicked: void 0 === t || n.includes(t) ? a : t,
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
                e !== s.linking.interval.value() &&
                this.context.chartWidgetCollection.setResolution(e),
                e && (0, Q.trackEvent)('GUI', 'Time Interval', e)
            }),
            (this._handleClickFavorite = (e) => {
              ;(e = (0, le.ensureDefined)(e)),
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
              const { intervalService: a } = this.context,
                n = a.add(e, t)
              n && this.setState({ lastAddedInterval: n })
            }),
            (this._handleRemoveInterval = (e, t) => {
              var a
              const { intervalService: n } = this.context
              if (e) {
                if (
                  I.PLATFORM_ACCESSIBILITY_ENABLED &&
                  t &&
                  (0, K.isKeyboardClick)(t) &&
                  this._menuItemsContainerRef.current
                ) {
                  const t = (0, se.queryMenuElements)(
                      this._menuItemsContainerRef.current,
                    ),
                    n = t.findIndex((t) => t.matches(`[data-value="${e}"]`))
                  if (-1 !== n) {
                    const e =
                      null !== (a = t[n + 1]) && void 0 !== a ? a : t[n - 1]
                    e
                      ? e.focus()
                      : (0, se.focusFirstMenuItem)(
                          this._menuItemsContainerRef.current,
                        )
                  }
                }
                n.remove(e), this._handleRemoveFavorite(e)
              }
            }),
            (this._getHandleSectionStateChange = (e) => (t) => {
              const { menuViewState: a } = this.state,
                { intervalsMenuViewStateService: n } = this.context
              n.set({ ...a, [e]: !t })
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
              e || t || je.fire()
            }),
            (this._handeQuickClick = (e) => {
              this._handleSelectInterval(e), this._trackClick()
            }),
            (this._updateMenuPosition = () => {
              var e
              null === (e = this._menu.current) || void 0 === e || e.update()
            }),
            (0, _.validateRegistry)(t, {
              chartApiInstance: l.any.isRequired,
              favoriteIntervalsService: l.any.isRequired,
              intervalService: l.any.isRequired,
              intervalsMenuViewStateService: l.any.isRequired,
            })
          const {
            chartApiInstance: a,
            favoriteIntervalsService: o,
            intervalService: r,
            intervalsMenuViewStateService: h,
          } = t
          this._customIntervals = n.enabled('custom_resolutions')
          const c = s.linking.interval.value(),
            v = c && (0, fe.normalizeIntervalString)(c),
            d = o.get(),
            u = r.getCustomIntervals(),
            m = h.get()
          ;(this._defaultIntervals = a
            .defaultResolutions()
            .filter(fe.isIntervalEnabled)
            .map(fe.normalizeIntervalString)),
            (this.state = {
              isOpenedFormMenu: !1,
              activeInterval: v,
              favorites: d,
              customs: u,
              menuViewState: m,
              isAddIntervalDialogOpened: !1,
            })
        }
        componentDidMount() {
          const {
            favoriteIntervalsService: e,
            intervalService: t,
            intervalsMenuViewStateService: a,
          } = this.context
          e.getOnChange().subscribe(this, this._handleChangeFavorites),
            a.getOnChange().subscribe(this, this._handleChangeMenuViewState),
            t.getOnChange().subscribe(this, this._handleChangeCustoms),
            s.linking.interval.subscribe(this._handleChangeInterval),
            s.linking.intraday.subscribe(this._bindedForceUpdate),
            s.linking.seconds.subscribe(this._bindedForceUpdate),
            s.linking.ticks.subscribe(this._bindedForceUpdate),
            s.linking.range.subscribe(this._bindedForceUpdate),
            s.linking.supportedResolutions.subscribe(this._bindedForceUpdate),
            s.linking.dataFrequencyResolution.subscribe(
              this._bindedForceUpdate,
            ),
            We.globalCloseDelegate.subscribe(this, this._handleGlobalClose)
        }
        componentWillUnmount() {
          const {
            favoriteIntervalsService: e,
            intervalService: t,
            intervalsMenuViewStateService: a,
          } = this.context
          e.getOnChange().unsubscribe(this, this._handleChangeFavorites),
            a.getOnChange().unsubscribe(this, this._handleChangeMenuViewState),
            t.getOnChange().unsubscribe(this, this._handleChangeCustoms),
            s.linking.interval.unsubscribe(this._handleChangeInterval),
            s.linking.intraday.unsubscribe(this._bindedForceUpdate),
            s.linking.seconds.unsubscribe(this._bindedForceUpdate),
            s.linking.ticks.unsubscribe(this._bindedForceUpdate),
            s.linking.range.unsubscribe(this._bindedForceUpdate),
            s.linking.supportedResolutions.unsubscribe(this._bindedForceUpdate),
            s.linking.dataFrequencyResolution.unsubscribe(
              this._bindedForceUpdate,
            ),
            We.globalCloseDelegate.unsubscribe(this, this._handleGlobalClose)
        }
        componentDidUpdate(e, t) {
          this.state.lastAddedInterval &&
            setTimeout(() => this.setState({ lastAddedInterval: void 0 }), 400)
        }
        render() {
          const { isShownQuicks: e, id: t } = this.props,
            {
              activeInterval: a,
              customs: n,
              lastNotQuicked: l,
              isAddIntervalDialogOpened: o,
            } = this.state,
            s = this._getQuicks(),
            r = (0, fe.sortResolutions)([...s])
          void 0 !== a && r.includes(a)
            ? void 0 !== l && r.push(l)
            : void 0 !== a && r.push(a)
          const h = (!(!e || 0 === s.length) || void 0) && r.length > 1,
            c = {},
            u = (0, fe.mergeResolutions)(this._defaultIntervals, n)
          ;(void 0 !== a ? u.concat(a) : u)
            .filter(fe.isAvailable)
            .forEach((e) => (c[e] = !0))
          const m =
            void 0 !== a ? (0, fe.getTranslatedResolutionModel)(a) : null
          return i.createElement(
            p,
            { id: t },
            h &&
              i.createElement(
                T,
                { className: Qe.group, orientation: 'horizontal' },
                r.map((e, t) => {
                  const n = (0, fe.getTranslatedResolutionModel)(e)
                  return i.createElement(w, {
                    key: t,
                    role: 'radio',
                    className: d(Qe.button, {
                      [Qe.first]: 0 === t,
                      [Qe.last]: t === r.length - 1,
                    }),
                    text: i.createElement(Ee, {
                      value: n.mayOmitMultiplier ? void 0 : n.multiplier,
                      metric: n.shortKind,
                    }),
                    hint: n.hint,
                    'aria-checked': a === e,
                    isActive: a === e,
                    isDisabled: !c[e],
                    onClick: this._handeQuickClick,
                    onClickArg: e,
                    'data-value': e,
                  })
                }),
              ),
            i.createElement(
              S.MatchMedia,
              { rule: y.DialogBreakpoints.TabletSmall },
              (e) =>
                i.createElement(
                  i.Fragment,
                  null,
                  i.createElement(
                    De.CloseDelegateContext.Provider,
                    { value: je },
                    i.createElement(
                      v.ToolbarMenuButton,
                      {
                        arrow: Boolean(h),
                        closeOnClickOutside: !0,
                        content:
                          h || null === m
                            ? void 0
                            : i.createElement(
                                p,
                                { className: Qe.menuContent },
                                i.createElement(Ee, {
                                  value: m.mayOmitMultiplier
                                    ? void 0
                                    : m.multiplier,
                                  metric: m.shortKind,
                                }),
                              ),
                        hotKey: h ? qe : void 0,
                        className: Qe.menu,
                        ref: this._menu,
                        isDrawer: e,
                        onClick: this._trackClick,
                        tooltip: h || null === m ? Ke.timeInterval : m.hint,
                        menuReference: this._menuItemsContainerRef,
                      },
                      i.createElement(
                        'div',
                        { className: Qe.dropdown },
                        this._renderChildren(u, e),
                      ),
                    ),
                  ),
                  e &&
                    o &&
                    i.createElement(
                      i.Suspense,
                      { fallback: null },
                      i.createElement(Ye, {
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
          const a = ((e) => {
            const t = Oe(Ze.ResolutionKind.Ticks),
              a = Oe(Ze.ResolutionKind.Seconds),
              n = Oe(Ze.ResolutionKind.Minutes),
              i = Oe(Ze.SpecialResolutionKind.Hours),
              l = Oe(Ze.ResolutionKind.Days),
              o = Oe(Ze.ResolutionKind.Range)
            return (
              e.forEach((e) => {
                const s = Ze.Interval.parse(e)
                s.isMinuteHours()
                  ? i.items.push(e)
                  : s.isMinutes()
                    ? (0, Ze.isHour)(Number(s.multiplier()))
                      ? i.items.push(e)
                      : n.items.push(e)
                    : s.isSeconds()
                      ? a.items.push(e)
                      : s.isDWM()
                        ? l.items.push(e)
                        : s.isRange()
                          ? o.items.push(e)
                          : s.isTicks() && t.items.push(e)
              }),
              [t, a, n, i, l, o].filter((e) => 0 !== e.items.length)
            )
          })(e).map((e, a, n) =>
            this._renderResolutionsGroup(e, 1 === n.length, t),
          )
          return ((e) => {
            let t = !1
            return e.filter((e, a, n) => {
              let i = !0
              return (
                e.type === C.PopupMenuSeparator &&
                  ((0 !== a && a !== n.length - 1) || (i = !1), t && (i = !1)),
                (t = e.type === C.PopupMenuSeparator),
                i
              )
            })
          })([].concat(...a))
        }
        _createIntervalForm(e) {
          if (this._customIntervals) {
            const t = e
              ? i.createElement($e, {
                  key: 'add-dialog',
                  onClick: this._handleOpenAddIntervalDialog,
                })
              : i.createElement(Te, {
                  key: 'add-form',
                  onAdd: this._handleAddInterval,
                  onCloseMenu: this._handleCloseMenu,
                  onOpenMenu: this._handleOpenMenu,
                  onSelect: this._updateMenuPosition,
                })
            return [
              i.createElement(C.PopupMenuSeparator, {
                key: 'custom-interval-separator',
              }),
              t,
            ]
          }
          return []
        }
        _renderResolutionsGroup(e, t = !1, a) {
          const n = [],
            l = e.items.map((e) => this._renderPopupMenuItem(e, a))
          if (t) n.push(...l)
          else if (a) {
            const t = i.createElement(Je, { key: e.id, title: e.name }, l)
            n.push(t)
          } else {
            const { intervalsMenuViewStateService: t } = this.context,
              { menuViewState: a } = this.state
            if (!t.isAllowed(e.id)) return []
            const o = i.createElement(
              Ue,
              {
                key: e.id,
                className: Qe.section,
                summary: e.name,
                open: !a[e.id],
                onStateChange: this._getHandleSectionStateChange(e.id),
              },
              l,
            )
            n.push(o)
          }
          return (
            (!e.mayOmitSeparator || e.items.length > 1) &&
              (n.unshift(
                i.createElement(C.PopupMenuSeparator, {
                  key: `begin-${e.name}`,
                }),
              ),
              n.push(
                i.createElement(C.PopupMenuSeparator, { key: `end-${e.name}` }),
              )),
            n
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
          const { isFavoritingAllowed: a } = this.props,
            { activeInterval: n, lastAddedInterval: l } = this.state,
            o = e === n,
            s = (0, fe.isAvailable)(e),
            r = this._isIntervalFavorite(e),
            h = this._isIntervalDefault(e),
            c = (0, fe.getTranslatedResolutionModel)(e)
          return i.createElement(Ve, {
            key: e,
            isSmallTablet: t,
            interval: e,
            hint: c.hint,
            isSignaling: l === e,
            isFavoritingAllowed: a,
            isDisabled: !s,
            isFavorite: r,
            isRemovable: !h,
            isActive: o,
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
      function $e(e) {
        const { onClick: t, className: n } = e
        return i.createElement(
          'div',
          {
            key: 'add-dialog',
            className: d(Qe.addCustomInterval, n),
            onClick: t,
          },
          o.t(null, void 0, a(595798)) + '…',
        )
      }
      function Je(e) {
        const { children: t, title: a, className: n } = e
        return i.createElement(
          'div',
          { className: n },
          i.createElement('div', { className: Qe.smallTabletSectionTitle }, a),
          t,
        )
      }
      Xe.contextType = Ge
      var et = a(423902),
        tt = a(282436)
      const at = (0, _.registryContextType)()
      class nt extends i.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._handleClick = () => {
              const {
                  chartWidgetCollection: e,
                  windowMessageService: t,
                  isFundamental: a,
                } = this.context,
                n = e.activeChartWidget.value()
              n.withModel(null, () => {
                t.post(parent, 'openChartInPopup', {
                  symbol: n.model().mainSeries().actualSymbol(),
                  interval: n.model().mainSeries().interval(),
                  fundamental: a,
                })
              })
            }),
            (0, _.validateRegistry)(t, {
              isFundamental: l.any,
              chartWidgetCollection: l.any.isRequired,
              windowMessageService: l.any.isRequired,
            })
        }
        render() {
          const { className: e } = this.props
          return i.createElement(Y.ToolbarIconButton, {
            className: d(e, et.button),
            icon: tt,
            onClick: this._handleClick,
            tooltip: o.t(null, void 0, a(355520)),
          })
        }
      }
      nt.contextType = at
      var it = a(648449)
      const lt = (0, _.registryContextType)()
      class ot extends i.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._updateState = (e) => {
              this.setState({ isOpened: e })
            }),
            (this._handleClick = (e) => {
              const { chartWidgetCollection: t } = this.context,
                a = t.activeChartWidget.value()
              ;(0, Q.trackEvent)(
                'GUI',
                'Chart Header Toolbar',
                'chart properties',
              ),
                a.showGeneralChartProperties(void 0, {
                  shouldReturnFocus: (0, K.isKeyboardClick)(e),
                })
            }),
            (0, _.validateRegistry)(t, {
              chartWidgetCollection: l.any.isRequired,
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
          return i.createElement(Y.ToolbarIconButton, {
            ...this.props,
            icon: it,
            isOpened: e,
            onClick: this._handleClick,
            tooltip: o.t(null, void 0, a(274207)),
          })
        }
      }
      ot.contextType = lt
      var st = a(376202),
        rt = a(976052),
        ht = a(493173),
        ct = a(321659),
        vt = a(220461)
      const dt = (0, ht.mergeThemes)(ct.DEFAULT_MENU_ITEM_SWITCHER_THEME, vt)
      var ut = a(350299),
        mt = a(234404),
        pt = a(870152)
      function gt(e) {
        const { wasChanges: t, isSaving: n, className: l } = e
        return i.createElement(
          'span',
          { className: d(pt.saveString, !t && !n && pt.hidden, l) },
          n
            ? i.createElement(mt.Loader, {
                className: pt.loader,
                size: 'small',
                staticPosition: !0,
              })
            : o.t(null, void 0, a(185520)),
        )
      }
      var bt = a(636296),
        wt = a(663672),
        Ct = a(692998)
      a(840670)
      const St = n.enabled('widget'),
        yt = o.t(null, void 0, a(375789)),
        ft = (0, ht.mergeThemes)(D.DEFAULT_TOOL_WIDGET_BUTTON_THEME, Ct),
        _t = (0, ht.mergeThemes)(oe.DEFAULT_POPUP_MENU_ITEM_THEME, {
          shortcut: wt.shortcut,
          withIcon: wt.withIcon,
        }),
        Et = o.t(null, void 0, a(180959)),
        Mt = o.t(null, void 0, a(11680)),
        xt = [],
        At = (0, X.hotKeySerialize)({
          keys: [(0, $.humanReadableModifiers)($.Modifiers.Mod, !1), 'S'],
          text: '{0} + {1}',
        })
      class It extends i.PureComponent {
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
              displayMode: n,
              isProcessing: l,
              title: s,
              wasChanges: r,
              hideMenu: h,
              isTabletSmall: u,
              onOpenMenu: m,
              dataNameSaveMenu: g,
              isSaveDialogOpened: b,
            } = this.props,
            w = !t && !h,
            C = !(r || !s || this.state.isSaving),
            S = i.createElement(
              'div',
              { className: wt.textWrap },
              i.createElement(
                'span',
                { className: wt.text },
                s || o.t(null, void 0, a(185520)),
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
                  i.createElement(U, {
                    id: e,
                    displayMode: n,
                    icon: i.createElement(c.Icon, { icon: bt }),
                    isDisabled: l,
                    onClick: this._handleCloneClick,
                    text: o.t(null, void 0, a(35216)),
                    collapseWhen: xt,
                    tooltip: Et,
                  }),
                )
              : i.createElement(
                  p,
                  null,
                  i.createElement(U, {
                    id: e,
                    className: d(wt.button, w && wt.buttonSmallPadding),
                    displayMode: n,
                    'aria-disabled': !!C || void 0,
                    isDisabled: l,
                    onClick: C ? void 0 : this._handleSaveClick,
                    text: S,
                    theme: ft,
                    collapseWhen: xt,
                    isOpened: b,
                    tooltip: C
                      ? o.t(null, void 0, a(288368))
                      : o.t(null, void 0, a(587409)),
                    'data-tooltip-hotkey': St || C ? '' : At,
                  }),
                  w &&
                    i.createElement(
                      v.ToolbarMenuButton,
                      {
                        'data-name': g,
                        arrow: !0,
                        isDrawer: u,
                        drawerPosition: 'Bottom',
                        onClick: this._trackClick,
                        onOpen: m,
                        tooltip: o.t(null, void 0, a(658219)),
                      },
                      this._renderMenuItems(Boolean(u)),
                    ),
                ),
          )
        }
        _renderMenuItems(e) {
          const {
              wasChanges: t,
              isProcessing: n,
              chartId: l,
              onSaveChartFromMenu: s,
              onRenameChart: r,
              onLoadChart: h,
              onNewChart: c,
              isAutoSaveEnabled: v,
              autoSaveId: u,
              sharingId: m,
              onAutoSaveChanged: p,
              isSharingEnabled: g,
              onSharingChanged: b,
              layoutItems: w,
              onExportData: S,
              isAuthenticated: y,
            } = this.props,
            _ = e ? f.multilineLabelWithIconAndToolboxTheme : _t,
            E = e ? void 0 : (0, $.humanReadableHash)($.Modifiers.Mod + 83),
            M = e ? void 0 : o.t(null, { context: 'hotkey' }, a(214229)),
            x = []
          return (
            x.push(
              i.createElement(k.AccessibleMenuItem, {
                key: 'save',
                isDisabled: Boolean(n || (!t && l)),
                label: Mt,
                onClick: s,
                shortcut: E,
                labelRowClassName: d(e && wt.popupItemRowTabletSmall),
                theme: _,
                'data-name': 'save-load-menu-item-save',
              }),
            ),
            void 0 !== l &&
              x.push(
                i.createElement(k.AccessibleMenuItem, {
                  key: 'rename',
                  icon: void 0,
                  label: (0, ut.appendEllipsis)(o.t(null, void 0, a(435038))),
                  onClick: r,
                  labelRowClassName: d(e && wt.popupItemRowTabletSmall),
                  theme: _,
                  'data-name': 'save-load-menu-item-rename',
                }),
                i.createElement(k.AccessibleMenuItem, {
                  key: 'save-as',
                  icon: void 0,
                  label: (0, ut.appendEllipsis)(Et),
                  onClick: this._handleSaveAsClick,
                  labelRowClassName: d(e && wt.popupItemRowTabletSmall),
                  theme: _,
                  'data-name': 'save-load-menu-item-clone',
                }),
              ),
            x.push(
              i.createElement(C.PopupMenuSeparator, {
                key: 'all-layouts-separator',
              }),
              i.createElement(k.AccessibleMenuItem, {
                key: 'all-layouts',
                className: 'js-save-load-menu-item-load-chart',
                label: (0, ut.appendEllipsis)(yt),
                onClick: h,
                labelRowClassName: d(e && wt.popupItemRowTabletSmall),
                theme: _,
                shortcut: M,
                'data-name': 'save-load-menu-item-load',
              }),
            ),
            x
          )
        }
        _trackClick() {
          0
        }
      }
      ;(0, i.forwardRef)((e, t) => {
        const { isTabletSmall: n, onClick: l } = e,
          [s, r] = (0, B.useRovingTabindexElement)(t)
        return i.createElement(
          'div',
          {
            ref: s,
            className: d(
              wt.copyLink,
              n && wt.copyLinkMobile,
              I.PLATFORM_ACCESSIBILITY_ENABLED && wt.accessibleLabel,
            ),
            onClick: l,
            tabIndex: r,
            onKeyDown: (e) => {
              if (
                !I.PLATFORM_ACCESSIBILITY_ENABLED ||
                e.target !== e.currentTarget
              )
                return
              const t = (0, $.hashFromEvent)(e)
              ;(13 !== t && 32 !== t) ||
                (e.preventDefault(),
                s.current instanceof HTMLElement && s.current.click())
            },
            'data-role': I.PLATFORM_ACCESSIBILITY_ENABLED ? 'menuitem' : void 0,
          },
          o.t(null, void 0, a(607367)),
        )
      })
      const Tt = (0, _.registryContextType)()
      class kt extends i.PureComponent {
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
            (0, _.validateRegistry)(t, {
              chartWidgetCollection: l.any.isRequired,
              chartChangesWatcher: l.any.isRequired,
              saveChartService: l.any.isRequired,
              sharingChartService: l.any,
              loadChartService: l.any.isRequired,
            })
          const {
            chartWidgetCollection: a,
            chartChangesWatcher: n,
            saveChartService: i,
            sharingChartService: o,
          } = t
          this.state = {
            isAuthenticated: window.is_authenticated,
            isProcessing: !1,
            id: a.metaInfo.id.value(),
            title: a.metaInfo.name.value(),
            wasChanges: n.hasChanges(),
            iconHovered: !1,
            isSaveDialogOpened: !1,
          }
        }
        componentDidMount() {
          const { chartSaver: e, isFake: t, stateSyncEmitter: n } = this.props,
            {
              chartWidgetCollection: i,
              chartChangesWatcher: l,
              saveChartService: s,
              sharingChartService: r,
            } = this.context
          t
            ? n.on('change', this._syncState)
            : (l.getOnChange().subscribe(this, this._onChangeHasChanges),
              i.metaInfo.name.subscribe(this._onChangeTitle),
              i.metaInfo.id.subscribe(this._onChangeId),
              (this._hotkeys = (0, st.createGroup)({ desc: 'Save/Load' })),
              this._hotkeys.add({
                desc: o.t(null, void 0, a(975687)),
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
          const { chartSaver: t, isFake: a, stateSyncEmitter: n } = this.props,
            {
              chartWidgetCollection: i,
              chartChangesWatcher: l,
              saveChartService: o,
              sharingChartService: s,
            } = this.context
          a
            ? n.off('change', this._syncState)
            : (l.getOnChange().unsubscribe(this, this._onChangeHasChanges),
              i.metaInfo.name.unsubscribe(this._onChangeTitle),
              i.metaInfo.id.unsubscribe(this._onChangeId),
              (0, le.ensureDefined)(this._hotkeys).destroy(),
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
              id: a,
              isFake: n,
            } = this.props,
            {
              isProcessing: l,
              isAuthenticated: o,
              title: s,
              id: r,
              wasChanges: h,
              isAutoSaveEnabled: c,
              isSharingEnabled: v,
              recentLayouts: d,
              isSaveDialogOpened: u,
            } = this.state,
            m = {
              displayMode: t,
              isReadOnly: e,
              isAuthenticated: o,
              isProcessing: l,
              wasChanges: h,
              title: s,
              id: a,
              isSaveDialogOpened: u,
              chartId: null !== r ? r : void 0,
              dataNameSaveMenu: n ? void 0 : 'save-load-menu',
              onCloneChart: this._handleClickClone,
              onSaveChart: this._handleClickSave,
              onSaveChartFromMenu: this._handleClickSaveFromMenu,
              onRenameChart: this._handleClickRename,
              onSaveAsChart: this._handleClickSaveAs,
              onLoadChart: this._handleClickLoad,
            }
          return i.createElement(
            S.MatchMedia,
            { rule: y.DialogBreakpoints.TabletSmall },
            (e) => i.createElement(It, { ...m, isTabletSmall: e }),
          )
        }
        _onLoginStateChange() {
          this.setState({ isAuthenticated: window.is_authenticated })
        }
        _trackEvent(e) {
          0
        }
      }
      kt.contextType = Tt
      var Ht = a(979887),
        Lt = a(47680),
        Rt = a(949345)
      const Nt = new Lt.DateTimeFormatter({
          dateTimeSeparator: '_',
          timeFormat: '%h-%m-%s',
        }),
        Vt = { takeSnapshot: o.t(null, void 0, a(588513)) },
        Zt = (0, _.registryContextType)()
      const Ft = o.t(null, void 0, a(390879))
      function Ot(e, t, a) {
        return (async (e, t, a) => {
          const n = URL.createObjectURL(
            new Blob(
              [
                `<!doctype html><html style="background-color:${getComputedStyle(document.documentElement).backgroundColor}"><head><meta charset="utf-8"><title>${Ft}</title></head><body style="background-color:${getComputedStyle(document.body).backgroundColor}"></body></html>`,
              ],
              { type: 'text/html' },
            ),
          )
          try {
            const i = open(n, t, a)
            if (!i) throw new Error('cound not open a new tab')
            const l = await e.catch(() => {})
            void 0 !== l ? i.location.replace(l) : i.close()
          } finally {
            URL.revokeObjectURL(n)
          }
        })(e, t, a)
      }
      var Bt = a(37246),
        Dt = a(972829),
        Wt = a(664618)
      function Pt(e) {
        const t = d(e.isLoading && Wt.hidden),
          a = d(!e.isLoading && Wt.hidden)
        return i.createElement(
          'div',
          null,
          i.createElement('span', { className: t }, e.children),
          i.createElement(
            'span',
            { className: a },
            i.createElement(mt.Loader, null),
          ),
        )
      }
      var zt = a(252130),
        Ut = a(601227),
        Qt = a(167487),
        Kt = a(201457),
        qt = a(323595),
        Gt = a(929414),
        jt = a(899280),
        Yt = a(318369)
      const Xt = (0, ht.mergeThemes)(oe.DEFAULT_POPUP_MENU_ITEM_THEME, Yt)
      function $t(e) {
        const { serverSnapshot: t, clientSnapshot: n, hideShortcuts: l } = e,
          [s, r] = (0, i.useState)(!1),
          [h, c] = (0, i.useState)(!1),
          [v, u] = (0, i.useState)(!1),
          [m, p] = (0, i.useState)(!1),
          g = (0, zt.useIsMounted)(),
          b = (0, i.useCallback)(async () => {
            var e
            const t = n(),
              a = t.then(
                (e) =>
                  new Promise((t) =>
                    e.canvas.toBlob((e) => {
                      null !== e && t(e)
                    }),
                  ),
              )
            try {
              await (0, Bt.writePromiseUsingApi)(a, 'image/png'),
                pe.emit('onClientScreenshotCopiedToClipboard')
            } catch (a) {
              const { canvas: n } = await t
              null === (e = window.open()) ||
                void 0 === e ||
                e.document.write(`<img width="100%" src="${n.toDataURL()}"/>`)
            }
          }, [n]),
          w = (0, i.useCallback)(async () => {
            const e = await n(),
              t = await ((e) =>
                new Promise((t) => {
                  try {
                    e.canvas.toBlob((e) => {
                      if (null === e) throw new Error('Unable to generate blob')
                      t(URL.createObjectURL(e))
                    })
                  } catch (a) {
                    t(e.canvas.toDataURL())
                  }
                }))(e)
            t && (0, Dt.downloadFile)(`${e.name}.png`, t)
          }, [n]),
          C = (e) => Ot(e.then((e) => e.imageUrl)),
          S = (0, i.useCallback)(
            async (e = !1) => {
              const a = t()
              try {
                if (e) await C(a)
                else {
                  const e = a.then(
                    (e) => new Blob([e.imageUrl], { type: 'text/plain' }),
                  )
                  await (0, Bt.writePromiseUsingApi)(e, 'text/plain'),
                    pe.emit('onServerScreenshotCopiedToClipboard')
                }
                return !0
              } catch (e) {
                return C(a), !0
              } finally {
                g.current && (c(!1), r(!1), (0, We.globalCloseMenu)())
              }
            },
            [t],
          ),
          y =
            ((0, i.useCallback)(async () => {
              const e = t()
              try {
                const t = 720,
                  a = e.then(async (e) => {
                    var a, n, i
                    const l = await snapshoter().getSnapshot(
                        e.symbol,
                        new Set(['description']),
                      ),
                      o =
                        'error' !== l.status ? l.values.description : e.symbol,
                      s =
                        null !==
                          (n =
                            null ===
                              (a = e.imageUrl.match(/\/x\/([0-9a-zA-Z]{8})/)) ||
                            void 0 === a
                              ? void 0
                              : a[1]) && void 0 !== n
                          ? n
                          : '',
                      r =
                        null === (i = createSnapshotImageUrls(s)) ||
                        void 0 === i
                          ? void 0
                          : i.url
                    return new Blob(
                      [
                        `<img width="${t}" loading="lazy" src="${r}"/><p><a href="https://www.tradingview.com${getSymbolPagePath({ shortName: e.symbol })}">${o} chart</a> by TradingView</p>`,
                      ],
                      { type: 'text/plain' },
                    )
                  })
                return (
                  await (0, Bt.writePromiseUsingApi)(a, 'text/plain'),
                  pe.emit('onServerScreenshotEmbedCodeCopiedToClipboard'),
                  !0
                )
              } catch (t) {
                return C(e), !0
              } finally {
                g.current && (u(!1), (0, We.globalCloseMenu)())
              }
            }, [t]),
            (0, i.useCallback)(async () => {
              p(!0)
              const [e, n] = await Promise.all([
                a.e(4665).then(a.bind(a, 428888)),
                t(),
              ])
              e.Twitter.shareSnapshotInstantly(n.symbol, n.imageUrl),
                g.current && (p(!1), (0, We.globalCloseMenu)())
            }, [t]))
        return i.createElement(
          i.Fragment,
          null,
          i.createElement(
            me.ToolWidgetMenuSummary,
            null,
            o.t(null, void 0, a(645888)),
          ),
          i.createElement(k.AccessibleMenuItem, {
            'data-name': 'save-chart-image',
            label: o.t(null, void 0, a(539011)),
            icon: qt,
            onClick: w,
            shortcut: l
              ? void 0
              : (0, $.humanReadableHash)(
                  $.Modifiers.Mod + $.Modifiers.Alt + 83,
                ),
            theme: Xt,
          }),
          i.createElement(k.AccessibleMenuItem, {
            'data-name': 'copy-chart-image',
            label: o.t(null, void 0, a(643001)),
            icon: Kt,
            onClick: b,
            shortcut: l
              ? void 0
              : (0, $.humanReadableHash)(
                  $.Modifiers.Mod + $.Modifiers.Shift + 83,
                ),
            theme: Xt,
          }),
          !(0, Ut.onWidget)() &&
            i.createElement(k.AccessibleMenuItem, {
              'data-name': 'copy-link-to-the-chart-image',
              label: i.createElement(
                Pt,
                { isLoading: s },
                o.t(null, void 0, a(607367)),
              ),
              icon: Gt,
              onClick: () => {
                r(!0), S(!1)
              },
              dontClosePopup: !0,
              isDisabled: s,
              shortcut: l
                ? void 0
                : (0, $.humanReadableHash)($.Modifiers.Alt + 83),
              className: d(s && Yt.loading),
              theme: Xt,
            }),
          !1,
          !(0, Ut.onWidget)() &&
            i.createElement(k.AccessibleMenuItem, {
              'data-name': 'open-image-in-new-tab',
              label: i.createElement(
                Pt,
                { isLoading: h },
                o.t(null, void 0, a(938543)),
              ),
              icon: jt,
              onClick: () => {
                c(!0), S(!0)
              },
              dontClosePopup: !0,
              isDisabled: h,
              className: d(h && Yt.loading),
              theme: Xt,
            }),
          !(0, Ut.onWidget)() &&
            i.createElement(k.AccessibleMenuItem, {
              'data-name': 'tweet-chart-image',
              label: i.createElement(
                Pt,
                { isLoading: m },
                o.t(null, void 0, a(99746)),
              ),
              icon: Qt,
              onClick: y,
              dontClosePopup: !0,
              isDisabled: m,
              className: d(m && Yt.loading),
              theme: Xt,
            }),
        )
      }
      var Jt = a(69111)
      function ea(e) {
        const [t, a] = (0, i.useState)(!1),
          n = (0, zt.useIsMounted)(),
          l = (0, i.useCallback)(async () => {
            a(!0), await e.serverSnapshot(), n.current && a(!1)
          }, [e.serverSnapshot])
        return i.createElement(D.ToolWidgetButton, {
          id: e.id,
          className: e.className,
          isDisabled: t,
          onClick: l,
          title: e.tooltip,
          icon: e.icon,
        })
      }
      var ta = a(272644)
      const aa =
        ((na = (e) =>
          (0, Jt.isOnMobileAppPage)('any')
            ? i.createElement(ea, { ...e, icon: ta })
            : i.createElement(
                v.ToolbarMenuButton,
                {
                  content: i.createElement(D.ToolWidgetButton, {
                    tag: 'div',
                    id: e.id,
                    className: e.className,
                    icon: ta,
                  }),
                  drawerPosition: 'Bottom',
                  drawerBreakpoint: y.DialogBreakpoints.TabletSmall,
                  arrow: !1,
                  onClick: () => {},
                  tooltip: e.tooltip,
                },
                i.createElement($t, { ...e }),
              )),
        ((ia = class extends i.PureComponent {
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
                  name: `${(0, Rt.shortName)(e)}_${Nt.formatLocal(new Date())}`,
                }
              }),
              (this._serverSnapshot = async () => {
                const e = this.context.chartWidgetCollection.activeChartWidget
                    .value()
                    .model()
                    .mainSeries()
                    .actualSymbol(),
                  t = await this.context.chartWidgetCollection.takeScreenshot(),
                  a =
                    n.enabled('charting_library_base') &&
                    void 0 !== this.context.snapshotUrl
                      ? t
                      : (0, Ht.convertImageNameToUrl)(t)
                return { symbol: (0, Rt.shortName)(e), imageUrl: a }
              }),
              (0, _.validateRegistry)(t, {
                chartWidgetCollection: l.any.isRequired,
              })
          }
          render() {
            const { className: e, id: t } = this.props
            return i.createElement(na, {
              id: t,
              className: e,
              tooltip: Vt.takeSnapshot,
              serverSnapshot: this._serverSnapshot,
              clientSnapshot: this._clientSnapshot,
            })
          }
        }).contextType = Zt),
        ia)
      var na,
        ia,
        la = a(248166),
        oa = a(366171),
        sa = a(688324)
      class ra {
        async show(e) {
          if (null !== ra._provider) {
            const e = await ra._provider.getSymbol()
            return (
              s.linking.setSymbolAndLogInitiator(e.symbol, 'symbol search UI'),
              e
            )
          }
          if (ra._currentShowingInstance)
            throw new DOMException(
              'SymbolSearchUI is already shown',
              'InvalidStateError',
            )
          try {
            ;(ra._currentShowingInstance = this), ra.preload()
            const t = await ra._implementation
            return (
              (0, le.assert)(null !== t),
              new Promise((a) => {
                t.showDefaultSearchDialog({
                  ...e,
                  onSearchComplete: (e) => {
                    a({ symbol: e })
                  },
                })
              })
            )
          } finally {
            ra._currentShowingInstance = null
          }
        }
        static setProvider(e) {
          this._provider = e
        }
        static preload() {
          null === this._provider &&
            null === this._implementation &&
            (this._implementation = (0, sa.loadNewSymbolSearch)())
        }
      }
      ;(ra._currentShowingInstance = null),
        (ra._provider = null),
        (ra._implementation = null)
      var ha = a(529142),
        ca = a(425882)
      const va = (0, ht.mergeThemes)(g.DEFAULT_TOOLBAR_BUTTON_THEME, ca)
      class da extends i.PureComponent {
        constructor(e) {
          super(e),
            (this._openSymbolSearchDialog = async (e) => {
              if ((0, $.modifiersFromEvent)(e) !== $.Modifiers.Alt) {
                if (!this.state.isOpened)
                  try {
                    ;(0, Q.trackEvent)('GUI', 'SS', 'main search'),
                      await new ra().show({
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
                        shouldReturnFocus: (0, K.isKeyboardClick)(e),
                        defaultValue: this._isSpread(this.state.symbol)
                          ? this.state.symbol
                          : this.state.shortName,
                        showSpreadActions:
                          (0, la.canShowSpreadActions)() &&
                          this.props.isActionsVisible,
                        source: 'searchBar',
                        footer: Le.mobiletouch
                          ? void 0
                          : i.createElement(
                              oa.SymbolSearchDialogFooter,
                              null,
                              o.t(null, void 0, a(520987)),
                            ),
                      })
                  } catch (e) {}
              } else (0, rt.getClipboard)().writeText(this.state.symbol)
            }),
            (this._isSpread = (e) => !1),
            (this._onSymbolChanged = () => {
              const e = s.linking.proSymbol.value()
              this.setState({ symbol: e, shortName: ua() })
            }),
            (this.state = {
              symbol: s.linking.proSymbol.value(),
              shortName: ua(),
              isOpened: !1,
            })
        }
        componentDidMount() {
          s.linking.proSymbol.subscribe(this._onSymbolChanged),
            s.linking.seriesShortSymbol.subscribe(this._onSymbolChanged),
            ra.preload()
        }
        componentWillUnmount() {
          s.linking.proSymbol.unsubscribe(this._onSymbolChanged),
            s.linking.seriesShortSymbol.unsubscribe(this._onSymbolChanged)
        }
        render() {
          const { id: e, className: t } = this.props
          return i.createElement(g.ToolbarButton, {
            id: e,
            className: u()(
              t,
              n.enabled('uppercase_instrument_names') && ca.uppercase,
              ca.smallLeftPadding,
            ),
            theme: va,
            icon: ha,
            isOpened: this.state.isOpened,
            text: this.state.shortName,
            onClick: this._openSymbolSearchDialog,
            tooltip: o.t(null, void 0, a(882719)),
          })
        }
        async _updateQuotes(e) {}
      }
      function ua() {
        return (
          s.linking.seriesShortSymbol.value() ||
          s.linking.proSymbol.value() ||
          ''
        )
      }
      var ma = a(905145)
      function pa(e) {
        var t
        const { className: a, item: n, onApply: l } = e,
          [o, s] = (0, B.useRovingTabindexElement)(null)
        return I.PLATFORM_ACCESSIBILITY_ENABLED
          ? i.createElement(
              'button',
              {
                type: 'button',
                className: d(a, ma.item, ma.accessible, 'apply-common-tooltip'),
                onClick: r,
                'data-tooltip': n.name,
                'aria-label': n.name,
                tabIndex: s,
                ref: o,
              },
              i.createElement(
                'div',
                { className: ma.round },
                null !==
                  (t = ((e) => {
                    var t
                    const a = Intl.Segmenter
                    if (a) {
                      const n = new a(void 0, { granularity: 'grapheme' }),
                        [{ segment: i } = { segment: null }] = n.segment(e)
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
                  })(n.name)) && void 0 !== t
                  ? t
                  : ' ',
              ),
            )
          : i.createElement(
              'div',
              {
                className: d(a, ma.item, 'apply-common-tooltip'),
                onClick: r,
                'data-tooltip': n.name,
              },
              i.createElement(
                'div',
                { className: ma.round },
                n.name.length > 0 ? n.name[0].toUpperCase() : ' ',
              ),
            )
        function r(e) {
          e.stopPropagation(), l(n)
        }
      }
      var ga = a(557487),
        ba = a(292710)
      function wa(e) {
        return i.createElement(
          'div',
          { className: d(ba.description, e.className) },
          e.children,
        )
      }
      var Ca = a(48261)
      const Sa = (0, ht.mergeThemes)(oe.DEFAULT_POPUP_MENU_ITEM_THEME, {
          labelRow: Ca.labelRow,
          toolbox: Ca.toolbox,
          item: Ca.titleItem,
        }),
        ya = (0, ht.mergeThemes)(oe.DEFAULT_POPUP_MENU_ITEM_THEME, {
          labelRow: Ca.labelRow,
          toolbox: Ca.toolbox,
          item: Ca.titleItemTabletSmall,
        }),
        fa = (0, ht.mergeThemes)(oe.DEFAULT_POPUP_MENU_ITEM_THEME, {
          item: Ca.item,
        }),
        _a = (0, ht.mergeThemes)(oe.DEFAULT_POPUP_MENU_ITEM_THEME, {
          item: Ca.itemTabletSmall,
        })
      function Ea(e) {
        const {
            className: t,
            item: a,
            onApply: n,
            onRemove: l,
            onFavor: o,
            favorite: s,
            isFavoritingAllowed: r,
            isTabletSmall: h,
          } = e,
          [c, v] = (0, He.useHover)(),
          d = a.meta_info,
          m = d ? (0, ga.descriptionString)(d.indicators) : void 0,
          p = h ? ya : Sa,
          g = h ? _a : fa,
          b = (0, i.useCallback)(() => n(a), [n, a]),
          w = (0, i.useCallback)((e) => l(a, e), [l, a]),
          C = (0, i.useCallback)(() => {
            o && o(a)
          }, [o, a])
        return i.createElement(
          'div',
          {
            ...v,
            className: u()(t, Ca.wrap),
            'data-name': a.name,
            'data-id': a.id,
            'data-is-default': Boolean(a.is_default),
          },
          i.createElement(k.AccessibleMenuItem, {
            theme: p,
            label: a.name,
            labelRowClassName: u()(h && Ca.itemLabelTabletSmall),
            isHovered: c,
            showToolboxOnHover: !s && !c,
            showToolboxOnFocus: I.PLATFORM_ACCESSIBILITY_ENABLED,
            onClick: b,
            toolbox: i.createElement(
              i.Fragment,
              null,
              !a.is_default &&
                i.createElement(Re.MenuRemoveButton, {
                  key: 'remove',
                  hidden: !Le.touch && !c,
                  onClick: w,
                  className: Ca.remove,
                }),
              Boolean(o) &&
                r &&
                i.createElement(H.MenuFavoriteButton, {
                  key: 'favorite',
                  isFilled: Boolean(s),
                  onClick: C,
                }),
            ),
          }),
          m &&
            i.createElement(oe.PopupMenuItem, {
              theme: g,
              label: i.createElement(
                wa,
                {
                  className: u()(
                    Ca.description,
                    h && Ca.descriptionTabletSmall,
                  ),
                },
                m,
              ),
              onClick: b,
              isHovered: c,
            }),
        )
      }
      var Ma = a(53707),
        xa = a(185013)
      const Aa = (0, ht.mergeThemes)(oe.DEFAULT_POPUP_MENU_ITEM_THEME, xa)
      function Ia(e) {
        const { onClick: t, isTabletSmall: n, className: l } = e
        return i.createElement(k.AccessibleMenuItem, {
          theme: Aa,
          className: u()(l, xa.wrap),
          label: i.createElement(
            'div',
            { className: xa.titleWrap },
            i.createElement(
              'div',
              { className: u()(xa.title, n && xa.titleTabletSmall) },
              i.createElement(c.Icon, { className: xa.icon, icon: Ma }),
              i.createElement(
                'div',
                { className: xa.text },
                (0, ut.appendEllipsis)(o.t(null, void 0, a(92093))),
              ),
            ),
          ),
          onClick: t,
        })
      }
      var Ta = a(585938),
        ka = a(230553)
      const Ha = i.createContext(null)
      var La = a(736001)
      function Ra(e) {
        const {
            templates: t,
            favorites: a,
            onTemplateSave: n,
            onTemplateRemove: l,
            onTemplateSelect: o,
            onTemplateFavorite: s,
            isTabletSmall: r,
            isLoading: h,
          } = e,
          c = (0, i.useMemo)(() => t.filter((e) => e.is_default), [t]),
          v = (0, i.useMemo)(() => t.filter((e) => !e.is_default), [t]),
          d = (0, i.useMemo)(() => new Set(a.map((e) => e.name)), [a]),
          m = (0, i.useContext)(Ha),
          p = (0, i.useContext)(ka.MenuContext),
          g = (0, Ta.useForceUpdate)()
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
          i.createElement(Ea, {
            key: e.name,
            item: e,
            isFavoritingAllowed: Boolean(s),
            favorite: d.has(e.name),
            onApply: o,
            onFavor: s,
            onRemove: l,
            isTabletSmall: r,
          })
        return i.createElement(
          'div',
          { className: u()(La.menu, r && La.menuSmallTablet) },
          i.createElement(Ia, { onClick: n, isTabletSmall: r }),
          h &&
            i.createElement(
              i.Fragment,
              null,
              i.createElement(C.PopupMenuSeparator, null),
              i.createElement(ue.ToolWidgetMenuSpinner, null),
            ),
          !h &&
            (r
              ? i.createElement(Na, { defaults: c, customs: v, render: b })
              : i.createElement(Va, {
                  defaults: c,
                  customs: v,
                  render: b,
                  state: m,
                })),
        )
      }
      function Na(e) {
        const { defaults: t, customs: n, render: l } = e
        return i.createElement(
          i.Fragment,
          null,
          n.length > 0 &&
            i.createElement(
              i.Fragment,
              null,
              i.createElement(C.PopupMenuSeparator, null),
              i.createElement(
                me.ToolWidgetMenuSummary,
                { className: La.menuItemHeaderTabletSmall },
                o.t(null, void 0, a(438554)),
              ),
              n.map(l),
            ),
          t.length > 0 &&
            i.createElement(
              i.Fragment,
              null,
              i.createElement(C.PopupMenuSeparator, null),
              i.createElement(
                me.ToolWidgetMenuSummary,
                { className: La.menuItemHeaderTabletSmall },
                o.t(null, void 0, a(943399)),
              ),
              t.map(l),
            ),
        )
      }
      function Va(e) {
        const { defaults: t, customs: n, render: l, state: s } = e
        return i.createElement(
          i.Fragment,
          null,
          n.length > 0 &&
            i.createElement(
              i.Fragment,
              null,
              i.createElement(C.PopupMenuSeparator, null),
              i.createElement(
                me.ToolWidgetMenuSummary,
                { className: La.menuItemHeader },
                o.t(null, void 0, a(438554)),
              ),
              n.map(l),
            ),
          n.length > 0 &&
            t.length > 0 &&
            s &&
            i.createElement(
              i.Fragment,
              null,
              i.createElement(C.PopupMenuSeparator, null),
              i.createElement(
                Ue,
                {
                  summary: o.t(null, void 0, a(943399)),
                  open: !s.get().defaultsCollapsed,
                  onStateChange: (e) => s.set({ defaultsCollapsed: !e }),
                },
                t.map(l),
              ),
            ),
          0 === n.length &&
            t.length > 0 &&
            i.createElement(
              i.Fragment,
              null,
              i.createElement(C.PopupMenuSeparator, null),
              i.createElement(
                me.ToolWidgetMenuSummary,
                { className: La.menuItemHeader },
                o.t(null, void 0, a(943399)),
              ),
              t.map(l),
            ),
        )
      }
      var Za = a(650802)
      class Fa {
        constructor(e, t) {
          var a, i
          ;(this._isFavoriteEnabled = n.enabled('items_favoriting')),
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
          const l =
              (null === (a = this._favoriteStudyTemplatesService) ||
              void 0 === a
                ? void 0
                : a.get()) || [],
            o = this._studyTemplates.list()
          ;(this._state = new Za.WatchedValue({
            isLoading: !1,
            studyTemplatesList: o,
            favorites: l,
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
          this._state.setValue({
            ...this._state.value(),
            ...e,
          })
        }
        _handleTemplatesChange() {
          this._setState({ studyTemplatesList: this._studyTemplates.list() })
        }
        _handleFavoritesChange(e) {
          this._isFavoriteEnabled && this._setState({ favorites: e })
        }
        _removeFavoriteTemplate(e) {
          var t
          const { favorites: a } = this._state.value()
          null === (t = this._favoriteStudyTemplatesService) ||
            void 0 === t ||
            t.set(a.filter((t) => t !== e))
        }
        _addFavoriteTemplate(e) {
          var t
          const { favorites: a } = this._state.value()
          null === (t = this._favoriteStudyTemplatesService) ||
            void 0 === t ||
            t.set([...a, e])
        }
        _isTemplateFavorite(e) {
          const { favorites: t } = this._state.value()
          return t.includes(e)
        }
      }
      var Oa = a(221233),
        Ba = a(370760)
      const Da = (0, _.registryContextType)()
      class Wa extends i.PureComponent {
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
                a = 'boolean' == typeof e ? e : !t
              this.setState({ isActive: a })
            }),
            (0, _.validateRegistry)(t, {
              favoriteStudyTemplatesService: l.any,
              studyTemplates: l.any.isRequired,
              templatesMenuViewStateService: l.any,
            })
          const { favoriteStudyTemplatesService: a, studyTemplates: n } = t
          ;(this._model = new Fa(n, a)),
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
              isShownQuicks: a,
              className: n,
              displayMode: l,
              id: o,
            } = this.props
          return i.createElement(
            Ha.Provider,
            { value: this.context.templatesMenuViewStateService || null },
            i.createElement(Pa, {
              id: o,
              className: n,
              mode: l,
              templates: e,
              favorites: t,
              onMenuOpen: this._model.handleDropdownOpen,
              onTemplateFavorite: a ? this._model.handleFavorTemplate : void 0,
              onTemplateSelect: this._handleApplyTemplate,
              onTemplateRemove: this._handleRemoveTemplate,
              onTemplateSave: this._model.handleSaveTemplate,
            }),
          )
        }
      }
      function Pa(e) {
        const {
            id: t,
            className: n,
            mode: l,
            favorites: s,
            templates: r,
            isMenuOpen: h,
            onTemplateSelect: c,
            onTemplateSave: d,
            onTemplateFavorite: m,
            onTemplateRemove: g,
          } = e,
          b = (0, i.useRef)(null),
          w = (0, i.useRef)(null),
          C = u()(n, Ba.wrap, {
            [Ba.full]: 'full' === l,
            [Ba.medium]: 'medium' === l,
          }),
          f = r.filter((e) => s.includes(e.name)),
          _ = 'small' !== l && m && f.length > 0
        return i.createElement(
          p,
          { id: t, className: C },
          i.createElement(
            S.MatchMedia,
            { rule: y.DialogBreakpoints.TabletSmall },
            (t) =>
              i.createElement(
                v.ToolbarMenuButton,
                {
                  ref: b,
                  menuReference: w,
                  onOpen: e.onMenuOpen,
                  isDrawer: t,
                  drawerPosition: 'Bottom',
                  arrow: !1,
                  content: i.createElement(z, {
                    tag: 'div',
                    className: u()(_ && Ba.buttonWithFavorites),
                    displayMode: l,
                    isOpened: h,
                    icon: Oa,
                    forceInteractive: !0,
                    collapseWhen: ['full', 'medium', 'small'],
                  }),
                  onClick: M,
                  tooltip: o.t(null, void 0, a(515812)),
                },
                i.createElement(Ra, {
                  onTemplateSave: d,
                  onTemplateSelect: c,
                  onTemplateRemove: E,
                  onTemplateFavorite: m,
                  templates: r,
                  favorites: f,
                  isTabletSmall: t,
                }),
              ),
          ),
          _ &&
            i.createElement(za, {
              favorites: f,
              onTemplateSelect: (e) => {
                c(e), M()
              },
            }),
        )
        function E(e, t) {
          if (
            I.PLATFORM_ACCESSIBILITY_ENABLED &&
            t &&
            (0, K.isKeyboardClick)(t) &&
            w.current
          ) {
            const t = (0, se.queryMenuElements)(w.current),
              a = t.findIndex((t) => null !== t.closest(`[data-id="${e.id}"]`))
            g(e, () => {
              var e, n
              if (-1 !== a && w.current) {
                const i = null !== (e = t[a + 1]) && void 0 !== e ? e : t[a - 1]
                i ? i.focus() : (0, se.focusFirstMenuItem)(w.current),
                  null === (n = b.current) || void 0 === n || n.update()
              }
            })
          } else g(e)
        }
        function M() {
          0
        }
      }
      function za(e) {
        return i.createElement(
          i.Fragment,
          null,
          e.favorites.map((t, a, n) =>
            i.createElement(pa, {
              key: t.name,
              item: t,
              onApply: e.onTemplateSelect,
              className: u()({
                [Ba.first]: 0 === a,
                [Ba.last]: a === n.length - 1,
              }),
            }),
          ),
        )
      }
      Wa.contextType = Da
      a(336379)
      var Ua = a(377665),
        Qa = a(796052),
        Ka = a(57778)
      const qa = {
          undoHotKey: (0, X.hotKeySerialize)({
            keys: [(0, $.humanReadableModifiers)($.Modifiers.Mod, !1), 'Z'],
            text: '{0} + {1}',
          }),
          redoHotKey: (0, X.hotKeySerialize)({
            keys: [(0, $.humanReadableModifiers)($.Modifiers.Mod, !1), 'Y'],
            text: '{0} + {1}',
          }),
        },
        Ga = (0, ht.mergeThemes)(g.DEFAULT_TOOLBAR_BUTTON_THEME, Ka),
        ja = (0, _.registryContextType)()
      class Ya extends i.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._batched = null),
            (this._handleClickUndo = () => {
              ;(0, Q.trackEvent)('GUI', 'Undo')
              const { chartWidgetCollection: e } = this.context
              e.undoHistory.undo()
            }),
            (this._handleClickRedo = () => {
              ;(0, Q.trackEvent)('GUI', 'Redo')
              const { chartWidgetCollection: e } = this.context
              e.undoHistory.redo()
            }),
            (0, _.validateRegistry)(t, {
              chartWidgetCollection: l.any.isRequired,
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
              isEnabledUndo: n,
              redoStack: l,
              undoStack: s,
            } = this.state
          return i.createElement(
            p,
            { id: e },
            i.createElement(g.ToolbarButton, {
              icon: Ua,
              isDisabled: !n,
              onClick: this._handleClickUndo,
              theme: Ga,
              tooltip: n
                ? o.t(null, { replace: { hint: s } }, a(780323))
                : void 0,
              'data-tooltip-hotkey': n ? qa.undoHotKey : void 0,
            }),
            i.createElement(g.ToolbarButton, {
              icon: Qa,
              isDisabled: !t,
              onClick: this._handleClickRedo,
              theme: Ga,
              tooltip: t
                ? o.t(null, { replace: { hint: l } }, a(370728))
                : void 0,
              'data-tooltip-hotkey': t ? qa.redoHotKey : void 0,
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
            a = e.undoHistory.redoStack(),
            n = a.head(),
            i = t.head()
          return {
            isEnabledRedo: !a.isEmpty(),
            isEnabledUndo: !t.isEmpty(),
            redoStack: n ? n.text().translatedText() : '',
            undoStack: i ? i.text().translatedText() : '',
          }
        }
      }
      Ya.contextType = ja
      var Xa = a(579961)
      function $a(e) {
        const { className: t, text: a, id: n, role: l, ariaHidden: o } = e
        return i.createElement(
          'div',
          { className: u()(Xa.title, t), id: n, role: l, 'aria-hidden': o },
          a,
        )
      }
      var Ja = a(964603)
      function en(e) {
        const {
          title: t,
          children: a,
          isSmallWidth: n,
          separator: l,
          className: o,
        } = e
        return i.createElement(
          'div',
          { className: d(o, Ja.row, n && Ja.smallRow) },
          i.createElement(
            'div',
            { className: Ja.rowInner },
            i.createElement(
              'div',
              { className: d(Ja.rowLabel, n && Ja.smallRowLabel) },
              t,
            ),
            i.createElement(
              'div',
              { className: Ja.rowButtons, 'data-role': 'row' },
              a,
            ),
          ),
          l,
        )
      }
      function tn(e) {
        const {
            isActive: t,
            icon: a,
            isSmallWidth: n,
            className: l,
            layout: o,
            onClick: s,
            isFirstItemInRow: r,
          } = e,
          h = I.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div',
          [v, u] = (0, B.useRovingTabindexElement)(null)
        return i.createElement(
          h,
          {
            className: d(
              l,
              Ja.layoutButtonWrap,
              n && Ja.smallWidth,
              I.PLATFORM_ACCESSIBILITY_ENABLED && Ja.accessible,
            ),
            type: I.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : void 0,
            'aria-pressed': I.PLATFORM_ACCESSIBILITY_ENABLED ? t : void 0,
            'aria-label': I.PLATFORM_ACCESSIBILITY_ENABLED ? o : void 0,
            'data-role':
              I.PLATFORM_ACCESSIBILITY_ENABLED && r ? 'menuitem' : void 0,
            ref: v,
            tabIndex: u,
            onClick: () => {
              s(o)
            },
          },
          i.createElement(
            'div',
            {
              className: d(
                Ja.layoutButton,
                t && Ja.isActive,
                n && Ja.smallWidthLayoutButton,
              ),
            },
            i.createElement(c.Icon, { icon: a }),
          ),
        )
      }
      var an = a(841785),
        nn = a(652100),
        ln = a(232217),
        on = a(989959),
        sn = a(112466),
        rn = a(938926),
        hn = a(259806),
        cn = a(272279),
        vn = a(135106),
        dn = a(758180),
        un = a(710757),
        mn = a(910997),
        pn = a(687037),
        gn = a(330273),
        bn = a(49011),
        wn = a(570309),
        Cn = a(502992),
        Sn = a(244570),
        yn = a(750633)
      const fn = {
        s: an,
        '1-2': nn,
        '1-3': ln,
        '1-4': on,
        '2-1': sn,
        '2-2': rn,
        '2-3': hn,
        '2h': cn,
        '2v': vn,
        '3h': dn,
        '3r': un,
        '3s': mn,
        '3v': pn,
        4: gn,
        '4h': bn,
        '4s': a(663962),
        '4v': a(236421),
        '5s': a(978222),
        '5h': wn,
        '6h': Cn,
        '7h': Sn,
        '8h': yn,
        6: a(280088),
        '6c': a(44836),
        8: a(114950),
        '8c': a(605018),
        '10c5': a(994598),
        '12c6': a(686963),
        '12c4': a(535956),
        '14c7': a(904e3),
        '16c8': a(571774),
        '16c4': a(359473),
      }
      var _n = a(209029)
      const En = (0, ht.mergeThemes)(dt, { label: _n.switcherLabel })
      class Mn extends i.PureComponent {
        constructor(e) {
          super(e),
            (this._onChange = () => {
              this.setState({ isChecked: this.props.watchedValue.value() })
            }),
            (this._handleClick = () => {
              const { onClick: e, watchedValue: t } = this.props
              e(t)
            }),
            (this.state = { isChecked: this.props.watchedValue.value() })
        }
        componentDidMount() {
          this.props.watchedValue.subscribe(this._onChange)
        }
        componentWillUnmount() {
          this.props.watchedValue.unsubscribe(this._onChange)
        }
        render() {
          const { label: e, value: t, className: a } = this.props,
            { isChecked: n } = this.state
          return i.createElement(ct.MenuItemSwitcher, {
            theme: En,
            label: e,
            checked: n,
            value: t,
            onChange: this._handleClick,
            className: a,
          })
        }
      }
      var xn = a(578601),
        An = a(527941),
        In = a(849208)
      let Tn = [
        { layouts: ['s'], title: '1' },
        { layouts: ['2h', '2v'], title: '2' },
        { layouts: ['3v', '3h', '3s', '2-1', '1-2', '3r'], title: '3' },
        { layouts: ['4', '4h', '4v', '4s', '1-3', '2-2'], title: '4' },
        { layouts: ['1-4', '5s', '2-3', '5h'], title: '5' },
        { layouts: ['6', '6c', '6h'], title: '6' },
        { layouts: ['7h'], title: '7' },
        { layouts: ['8', '8c', '8h'], title: '8' },
      ]
      n.enabled('additional_multichart_layouts') &&
        (Tn = [
          ...Tn,
          { layouts: ['10c5'], title: '10' },
          { layouts: ['12c6', '12c4'], title: '12' },
          { layouts: ['14c7'], title: '14' },
          { layouts: ['16c8', '16c4'], title: '16' },
        ])
      const kn = {
        layoutType: o.t(null, void 0, a(528024)),
        syncGroupTitle: o.t(null, void 0, a(618008)),
        syncCrosshairLabel: o.t(null, void 0, a(46720)),
        syncCrosshairHint: o.t(null, void 0, a(780362)),
        syncIntervalLabel: o.t(null, void 0, a(469466)),
        syncIntervalHint: o.t(null, void 0, a(620763)),
        syncDateRangeLabel: o.t(null, void 0, a(66174)),
        syncDateRangeHint: o.t(null, void 0, a(156685)),
        syncSymbolLabel: o.t(null, void 0, a(589053)),
        syncSymbolHint: o.t(null, void 0, a(884315)),
        syncTrackLabel: o.t(null, void 0, a(631976)),
        syncTrackHint: o.t(null, void 0, a(212548)),
      }
      function Hn(e) {
        const { chartWidgetCollection: t, isSmallWidth: a } = e,
          [n, l] = (0, i.useState)('s'),
          [o, s] = (0, xn.useRowsNavigation)(!0)
        return (
          (0, i.useEffect)(() => {
            function e(e) {
              l(e || t.layout.value())
            }
            return (
              t.layout.subscribe(e, { callWithLast: !0 }),
              () => t.layout.unsubscribe(e)
            )
          }, [t]),
          i.createElement(
            'div',
            { className: In.dropdown },
            i.createElement(
              'div',
              null,
              i.createElement(
                'div',
                { ref: o, onKeyDown: s, 'data-name': 'layouts-list' },
                a && i.createElement($a, { text: kn.layoutType }),
                Tn.map((e, t) =>
                  i.createElement(
                    en,
                    {
                      key: e.title,
                      isSmallWidth: a,
                      title: e.title,
                      separator:
                        t !== Tn.length - 1 &&
                        i.createElement(C.PopupMenuSeparator, null),
                    },
                    e.layouts.map((e, t) =>
                      i.createElement(tn, {
                        key: e,
                        layout: e,
                        icon: fn[e],
                        onClick: h,
                        isActive: e === n,
                        isSmallWidth: a,
                        isFirstItemInRow: 0 === t,
                      }),
                    ),
                  ),
                ),
              ),
            ),
            i.createElement(
              'div',
              null,
              a && i.createElement(C.PopupMenuSeparator, { size: 'normal' }),
            ),
            i.createElement(
              'div',
              null,
              i.createElement($a, {
                text: kn.syncGroupTitle,
                className: d(In.syncCharts, a && In.mobile),
              }),
              (() => {
                const e = d(In.switcher, a && In.mobile)
                return i.createElement(
                  'div',
                  { className: In.syncListWrapper },
                  i.createElement(Mn, {
                    label: i.createElement(Ln, {
                      title: kn.syncSymbolLabel,
                      hint: kn.syncSymbolHint,
                      isSmallWidth: a,
                    }),
                    onClick: r,
                    value: 'syncSymbolLabel',
                    watchedValue: t.lock.symbol,
                    className: e,
                  }),
                  i.createElement(Mn, {
                    label: i.createElement(Ln, {
                      title: kn.syncIntervalLabel,
                      hint: kn.syncIntervalHint,
                      isSmallWidth: a,
                    }),
                    onClick: r,
                    value: 'syncIntervalLabel',
                    watchedValue: t.lock.interval,
                    className: e,
                  }),
                  i.createElement(Mn, {
                    label: i.createElement(Ln, {
                      title: kn.syncCrosshairLabel,
                      hint: kn.syncCrosshairHint,
                      isSmallWidth: a,
                    }),
                    watchedValue: t.lock.crosshair,
                    value: 'syncCrosshairLabel',
                    onClick: r,
                    className: e,
                  }),
                  i.createElement(Mn, {
                    label: i.createElement(Ln, {
                      title: kn.syncTrackLabel,
                      hint: kn.syncTrackHint,
                      isSmallWidth: a,
                    }),
                    watchedValue: t.lock.trackTime,
                    value: 'syncTrackLabel',
                    onClick: r,
                    className: e,
                  }),
                  i.createElement(Mn, {
                    label: i.createElement(Ln, {
                      title: kn.syncDateRangeLabel,
                      hint: kn.syncDateRangeHint,
                      isSmallWidth: a,
                    }),
                    onClick: r,
                    value: 'syncDateRangeLabel',
                    watchedValue: t.lock.dateRange,
                    className: e,
                  }),
                )
              })(),
            ),
          )
        )
        function r(e) {
          const t = !e.value()
          e.setValue(t)
        }
        function h(e) {
          ;(0, We.globalCloseMenu)(),
            t.layout.value() === e
              ? t.revertToInline()
              : t.setChartLayoutWithUndo(e)
        }
      }
      function Ln(e) {
        const { title: t, hint: a, isSmallWidth: n } = e,
          [l, o] = (0, B.useRovingTabindexElement)(null)
        return i.createElement(
          'div',
          { className: In.switchLabelWrap },
          i.createElement('span', { className: In.switchLabel }, t),
          !n &&
            i.createElement(
              'span',
              {
                className: d(
                  In.iconWrap,
                  'apply-common-tooltip',
                  I.PLATFORM_ACCESSIBILITY_ENABLED && In.accessibleLabel,
                ),
                title: a,
                onFocus: () => showOnElement((0, le.ensureNotNull)(l.current)),
                onBlur: () => hide(),
                tabIndex: o,
                ref: l,
              },
              i.createElement(c.Icon, { className: In.infoIcon, icon: An }),
            ),
        )
      }
      const Rn = (0, _.registryContextType)()
      class Nn extends i.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._onUpdateLayout = (e) => {
              const { chartWidgetCollection: t } = this.context
              this.setState({ currentId: e || t.layout.value() })
            }),
            (this._handleOpenLayout = () => {
              ;(0, Q.trackEvent)('GUI', 'Chart Header Toolbar', 'select layout')
            }),
            (0, _.validateRegistry)(t, {
              chartWidgetCollection: l.any.isRequired,
            }),
            (this.state = { currentId: 's' })
        }
        componentDidMount() {
          const { chartWidgetCollection: e } = this.context
          e.layout.subscribe(this._onUpdateLayout, { callWithLast: !0 })
        }
        componentWillUnmount() {
          const { chartWidgetCollection: e } = this.context
          e.layout.unsubscribe(this._onUpdateLayout)
        }
        render() {
          const { chartWidgetCollection: e } = this.context,
            { className: t, id: n } = this.props,
            { currentId: l } = this.state
          return i.createElement(
            S.MatchMedia,
            { rule: y.DialogBreakpoints.TabletSmall },
            (s) =>
              i.createElement(
                v.ToolbarMenuButton,
                {
                  id: n,
                  arrow: !1,
                  content: i.createElement(c.Icon, {
                    className: In.icon,
                    icon: fn[l],
                  }),
                  className: d(t, In.button),
                  isDrawer: s,
                  drawerPosition: 'Bottom',
                  onOpen: this._handleOpenLayout,
                  tooltip: o.t(null, void 0, a(249211)),
                },
                i.createElement(Hn, {
                  chartWidgetCollection: e,
                  isSmallWidth: s,
                }),
              ),
          )
        }
      }
      Nn.contextType = Rn
      const Vn = (e) => {
        if (
          ((e) =>
            'http://www.w3.org/1999/xhtml' ===
            (null == e ? void 0 : e.namespaceURI))(e) &&
          'true' !== e.dataset.internalAllowKeyboardNavigation
        ) {
          ;(e.tabIndex = -1), (e.ariaDisabled = 'true')
          for (let t = 0; t < e.children.length; t++) Vn(e.children.item(t))
        }
      }
      class Zn extends i.PureComponent {
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
              I.PLATFORM_ACCESSIBILITY_ENABLED &&
                'childList' === e.type &&
                Vn(this.props.element)
            })
        }
        componentDidMount() {
          const { element: e, isFake: t, width: a } = this.props
          !t && this._wrapperElement
            ? ((this._resizeObserver = new ResizeObserver(this._handleMeasure)),
              (this._mutationObserver = new MutationObserver(
                this._handleMutation,
              )),
              this._wrapperElement.appendChild(e),
              this._resizeObserver.observe(this._wrapperElement),
              this._mutationObserver.observe(e, { subtree: !0, childList: !0 }))
            : a.subscribe(this._update)
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
      function Fn(e) {
        const { displayMode: t, params: a } = e
        return i.createElement(
          v.ToolbarMenuButton,
          {
            content: i.createElement(z, {
              collapseWhen: void 0 !== a.icon ? void 0 : [],
              displayMode: t,
              icon: a.icon,
              text: a.title,
              'data-name': 'dropdown',
              'data-is-custom-header-element': !0,
            }),
            drawerPosition: 'Bottom',
            drawerBreakpoint: y.DialogBreakpoints.TabletSmall,
            arrow: !1,
            tooltip: a.tooltip,
          },
          a.items.map((e, t) =>
            i.createElement(oe.PopupMenuItem, {
              key: t,
              label: e.title,
              onClick: () => e.onSelect(),
              'data-name': 'dropdown-item',
            }),
          ),
        )
      }
      var On = a(427363)
      function Bn(e) {
        const { className: t, title: a, ...n } = e
        return i.createElement(U, {
          ...n,
          className: d(t, On.customTradingViewStyleButton, On.withoutIcon),
          collapseWhen: [],
          'data-name': 'custom-tradingview-styled-button',
          tooltip: a,
        })
      }
      var Dn = a(160448)
      const Wn = (0, X.hotKeySerialize)({
          keys: [(0, $.humanReadableModifiers)($.Modifiers.Mod, !1), 'K'],
          text: '{0} + {1}',
        }),
        Pn = (0, _.registryContextType)()
      class zn extends i.PureComponent {
        constructor(e, t) {
          super(e),
            (this._dialog = null),
            (this._updateState = (e) => {
              this.setState({ isOpened: e })
            }),
            (this._handleClick = (e) => {
              const { openGlobalSearch: t } = this.context
              t({ shouldReturnFocus: (0, K.isKeyboardClick)(e) }).then((e) => {
                var t
                null === (t = this._dialog) ||
                  void 0 === t ||
                  t.visible().unsubscribe(this._updateState),
                  (this._dialog = e),
                  e.visible().subscribe(this._updateState)
              })
            }),
            (0, _.validateRegistry)(t, { openGlobalSearch: l.any.isRequired }),
            (this.state = { isOpened: !1 })
        }
        componentWillUnmount() {
          var e
          null === (e = this._dialog) ||
            void 0 === e ||
            e.visible().unsubscribe(this._updateState)
        }
        render() {
          return i.createElement(Y.ToolbarIconButton, {
            ...this.props,
            icon: Dn,
            isOpened: this.state.isOpened,
            onClick: this._handleClick,
            'data-tooltip-hotkey': Wn,
            tooltip: o.t(null, void 0, a(742130)),
          })
        }
      }
      zn.contextType = Pn
      var Un = a(758478)
      function Qn() {
        let e
        return (
          (e = n.enabled('header_layouttoggle') ? Nn : void 0),
          {
            Bars: n.enabled('header_chart_type') ? O : void 0,
            Compare: n.enabled('header_compare') ? j : void 0,
            Custom: Zn,
            CustomTradingViewStyledButton: Bn,
            Fullscreen: n.enabled('header_fullscreen_button') ? ie : void 0,
            Indicators: n.enabled('header_indicators') ? Se : void 0,
            Intervals: n.enabled('header_resolutions') ? Xe : void 0,
            OpenPopup: nt,
            Properties:
              n.enabled('header_settings') &&
              n.enabled('show_chart_property_page')
                ? ot
                : void 0,
            SaveLoad: n.enabled('header_saveload') ? kt : void 0,
            Screenshot: n.enabled('header_screenshot') ? aa : void 0,
            SymbolSearch: n.enabled('header_symbol_search') ? da : void 0,
            Templates: n.enabled('study_templates') ? Wa : void 0,
            Dropdown: Fn,
            UndoRedo: n.enabled('header_undo_redo') ? Ya : void 0,
            Layout: e,
            QuickSearch: (0, Un.shouldShowQuickSearchOnLib)() ? zn : void 0,
          }
        )
      }
    },
    557487: (e, t, a) => {
      a.d(t, {
        createStudyTemplateMetaInfo: () => l,
        descriptionString: () => o,
      })
      var n = a(593194),
        i = a(562051)
      function l(e, t) {
        return {
          indicators: e
            .orderedDataSources(!0)
            .filter((e) => (0, n.isStudy)(e) && !0)
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
      function o(e) {
        const t = new Map()
        return (
          e.forEach((e) => {
            const [a, n] = t.get(e.id) || [e.description, 0]
            t.set(e.id, [a, n + 1])
          }),
          Array.from(t.values())
            .map(([e, t]) => `${e}${t > 1 ? ` x ${t}` : ''}`)
            .join(', ')
        )
      }
    },
    583798: (e, t, a) => {
      a.r(t), a.d(t, { SERIES_ICONS: () => C })
      var n = a(149387),
        i = a(893316),
        l = a(173149),
        o = a(943031),
        s = a(94670),
        r = a(832162),
        h = a(539956),
        c = a(14083),
        v = a(45504),
        d = a(352867),
        u = a(241473),
        m = a(831246),
        p = a(715726),
        g = a(724464),
        b = a(671705),
        w = a(309450)
      const C = {
        3: s,
        16: r,
        0: h,
        1: c,
        8: v,
        9: d,
        2: u,
        14: m,
        15: p,
        10: g,
        12: b,
        13: w,
      }
      ;(C[4] = n), (C[6] = i), (C[7] = l), (C[5] = o)
    },
    979887: (e, t, a) => {
      a.d(t, { convertImageNameToUrl: () => l })
      var n = a(156963),
        i = a(147668)
      function l(e) {
        return n.enabled('charting_library_base') || (0, i.isProd)()
          ? 'https://www.tradingview.com/x/' + e + '/'
          : window.location.protocol +
              '//' +
              window.location.host +
              '/x/' +
              e +
              '/'
      }
    },
    972829: (e, t, a) => {
      function n(e, t) {
        const a = document.createElement('a')
        ;(a.style.display = 'none'), (a.href = t), (a.download = e), a.click()
      }
      a.d(t, { downloadFile: () => n })
    },
    529142: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M3.5 8a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM8 2a6 6 0 1 0 3.65 10.76l3.58 3.58 1.06-1.06-3.57-3.57A6 6 0 0 0 8 2Z"/></svg>'
    },
    527941: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16ZM8 6a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm1 2c.49 0 1 .59 1 1v3.01c0 .42-.51.99-1 .99s-1-.57-1-.99V9c0-.41.51-1 1-1Z"/></svg>'
    },
    597268: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M8.5 6A2.5 2.5 0 0 0 6 8.5V11h1V8.5C7 7.67 7.67 7 8.5 7H11V6H8.5zM6 17v2.5A2.5 2.5 0 0 0 8.5 22H11v-1H8.5A1.5 1.5 0 0 1 7 19.5V17H6zM19.5 7H17V6h2.5A2.5 2.5 0 0 1 22 8.5V11h-1V8.5c0-.83-.67-1.5-1.5-1.5zM22 19.5V17h-1v2.5c0 .83-.67 1.5-1.5 1.5H17v1h2.5a2.5 2.5 0 0 0 2.5-2.5z"/></svg>'
    },
    236992: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M17 6v2.5a2.5 2.5 0 0 0 2.5 2.5H22v-1h-2.5A1.5 1.5 0 0 1 18 8.5V6h-1zm2.5 11a2.5 2.5 0 0 0-2.5 2.5V22h1v-2.5c0-.83.67-1.5 1.5-1.5H22v-1h-2.5zm-11 1H6v-1h2.5a2.5 2.5 0 0 1 2.5 2.5V22h-1v-2.5c0-.83-.67-1.5-1.5-1.5zM11 8.5V6h-1v2.5c0 .83-.67 1.5-1.5 1.5H6v1h2.5A2.5 2.5 0 0 0 11 8.5z"/></svg>'
    },
    899280: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M8.5 6A2.5 2.5 0 0 0 6 8.5v11A2.5 2.5 0 0 0 8.5 22h11a2.5 2.5 0 0 0 2.5-2.5v-3h-1v3c0 .83-.67 1.5-1.5 1.5h-11A1.5 1.5 0 0 1 7 19.5v-11C7 7.67 7.67 7 8.5 7h3V6h-3zm7 1h4.8l-7.49 7.48.71.7L21 7.72v4.79h1V6h-6.5v1z"/></svg>'
    },
    160448: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M15 11v4l1-1.5 2.33-3.5.67-1h-3V4l-1 1.5L12.67 9 12 10h3v1Zm2-7v4h2a1 1 0 0 1 .83 1.55l-4 6A1 1 0 0 1 14 15v-4h-2a1 1 0 0 1-.83-1.56l4-6A1 1 0 0 1 17 4ZM5 13.5a7.5 7.5 0 0 1 6-7.35v1.02A6.5 6.5 0 1 0 18.98 13h1a7.6 7.6 0 0 1-1.83 5.44l4.7 4.7-.7.71-4.71-4.7A7.5 7.5 0 0 1 5 13.5Z"/></svg>'
    },
    221233: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M8 7h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zM6 8c0-1.1.9-2 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8zm11-1h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zm-2 1c0-1.1.9-2 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2V8zm-4 8H8a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1zm-3-1a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h3a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H8zm9 1h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1zm-2 1c0-1.1.9-2 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3z"/></svg>'
    },
    94670: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="m25.35 5.35-9.5 9.5-.35.36-.35-.36-4.65-4.64-8.15 8.14-.7-.7 8.5-8.5.35-.36.35.36 4.65 4.64 9.15-9.14.7.7ZM2 21h1v1H2v-1Zm2-1H3v1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1V9h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v1H9v1H8v1H7v1H6v1H5v1H4v1Zm1 0v1H4v-1h1Zm1 0H5v-1h1v1Zm1 0v1H6v-1h1Zm0-1H6v-1h1v1Zm1 0H7v1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v1H9v1H8v1H7v1h1v1Zm1 0v1H8v-1h1Zm0-1H8v-1h1v1Zm1 0H9v1h1v1h1v-1h1v1h1v-1h1v1h1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v1H9v1h1v1Zm1 0v1h-1v-1h1Zm0-1v-1h-1v1h1Zm0 0v1h1v1h1v-1h-1v-1h-1Zm6 2v-1h1v1h-1Zm2 0v1h-1v-1h1Zm0-1h-1v-1h1v1Zm1 0h-1v1h1v1h1v-1h1v1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v1h-1v1h-1v1h-1v1h1v1Zm1 0h-1v1h1v-1Zm0-1h1v1h-1v-1Zm0-1h1v-1h-1v1Zm0 0v1h-1v-1h1Zm-4 3v1h-1v-1h1Z"/></svg>'
    },
    539956: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="none" stroke="currentColor" stroke-linecap="square"><path d="M10.5 7.5v15M7.5 20.5H10M13.5 11.5H11M19.5 6.5v15M16.5 9.5H19M22.5 16.5H20"/></g></svg>'
    },
    724464: (e) => {
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
    309450: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M12 7v14h5V7h-5Zm4 1h-3v12h3V8ZM19 15v6h5v-6h-5Zm4 1h-3v4h3v-4ZM5 12h5v9H5v-9Zm1 1h3v7H6v-7Z"/></svg>'
    },
    301393: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M13.5 6a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM4 14.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/><path fill="currentColor" d="M9 14h4v-4h1v4h4v1h-4v4h-1v-4H9v-1z"/></svg>'
    },
    45504: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M9 8v12h3V8H9zm-1-.502C8 7.223 8.215 7 8.498 7h4.004c.275 0 .498.22.498.498v13.004a.493.493 0 0 1-.498.498H8.498A.496.496 0 0 1 8 20.502V7.498z"/><path d="M10 4h1v3.5h-1z"/><path d="M17 6v6h3V6h-3zm-1-.5c0-.276.215-.5.498-.5h4.004c.275 0 .498.23.498.5v7c0 .276-.215.5-.498.5h-4.004a.503.503 0 0 1-.498-.5v-7z"/><path d="M18 2h1v3.5h-1z"/></svg>'
    },
    671705: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M7.5 7H7v14h5V7H7.5zM8 20V8h3v12H8zm7.5-11H15v10h5V9h-4.5zm.5 9v-8h3v8h-3z"/></svg>'
    },
    832162: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path fill-rule="evenodd" d="M22 3h1v1h-1V3Zm0 2V4h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1V9h-1V8h-1V7h-1V6h-1V5h-1v1H9v1H8v1H7v1H6v1H5v1H4v1h1v1H4v1h1v-1h1v-1h1v-1h1v-1h1V9h1V8h1v1h1v1h1v1h1v1h1v1h1v-1h1v-1h1v-1h1V9h1V8h1V7h1V6h1V5h-1Zm-1 1V5h1v1h-1Zm-1 1V6h1v1h-1Zm-1 1V7h1v1h-1Zm-1 1V8h1v1h-1Zm-1 1V9h1v1h-1Zm-1 1v-1h1v1h-1Zm-1 0v-1h-1V9h-1V8h-1V7h-1V6h-1v1H9v1H8v1H7v1H6v1H5v1h1v-1h1v-1h1V9h1V8h1V7h1v1h1v1h1v1h1v1h1Zm0 0h1v1h-1v-1Zm.84 6.37 7.5-7-.68-.74-7.15 6.67-4.66-4.65-.33-.34-.36.32-5.5 5 .68.74 5.14-4.68 4.67 4.66.34.35.35-.33ZM6 23H5v1h1v-1Zm0-1H5v-1h1v1Zm1 0v1H6v-1h1Zm0-1H6v-1h1v1Zm1 0v1H7v-1h1Zm0-1H7v-1h1v1Zm1 0v1H8v-1h1Zm0-1H8v-1h1v1Zm1 0v1H9v-1h1Zm0-1H9v-1h1v1Zm1 0h-1v1h1v1h1v1h1v1h1v1h1v1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h-1v-1h1v-1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v1h1v1Zm0 0h1v1h-1v-1Zm2 2v1h1v1h1v1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1Zm0 0v-1h-1v1h1Z"/></svg>'
    },
    352867: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M17 11v6h3v-6h-3zm-.5-1h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5z"/><path d="M18 7h1v3.5h-1zm0 10.5h1V21h-1z"/><path d="M9 8v11h3V8H9zm-.5-1h4a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-12a.5.5 0 0 1 .5-.5z"/><path d="M10 4h1v5h-1zm0 14h1v5h-1zM8.5 9H10v1H8.5zM11 9h1.5v1H11zm-1 1h1v1h-1zm-1.5 1H10v1H8.5zm2.5 0h1.5v1H11zm-1 1h1v1h-1zm-1.5 1H10v1H8.5zm2.5 0h1.5v1H11zm-1 1h1v1h-1zm-1.5 1H10v1H8.5zm2.5 0h1.5v1H11zm-1 1h1v1h-1zm-1.5 1H10v1H8.5zm2.5 0h1.5v1H11z"/></svg>'
    },
    139681: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="M20 17l-5 5M15 17l5 5M9 11.5h7M17.5 8a2.5 2.5 0 0 0-5 0v11a2.5 2.5 0 0 1-5 0"/></svg>'
    },
    943031: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M11 5h3v12h5V8h3v13h1V7h-5v9h-3V4h-5v18H7v-5H6v6h5z"/></svg>'
    },
    652100: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1h14c.83 0 1.5.67 1.5 1.5V8H1V2.5ZM1 9v5.5c0 .83.67 1.5 1.5 1.5H9V9H1Zm9 7h6.5c.83 0 1.5-.67 1.5-1.5V9h-8v7ZM2.5 0A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14Z"/></svg>'
    },
    232217: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1h14c.83 0 1.5.67 1.5 1.5V8H1V2.5ZM1 9v5.5c0 .83.67 1.5 1.5 1.5H6V9H1Zm6 7h5V9H7v7Zm6 0h3.5c.83 0 1.5-.67 1.5-1.5V9h-5v7ZM2.5 0A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14Z"/></svg>'
    },
    989959: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1h14c.83 0 1.5.67 1.5 1.5V8H1V2.5ZM1 9v5.5c0 .83.67 1.5 1.5 1.5H4V9H1Zm4 7h4V9H5v7Zm5 0h4V9h-4v7Zm5 0h1.5c.83 0 1.5-.67 1.5-1.5V9h-3v7ZM2.5 0A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14Z"/></svg>'
    },
    994598: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1H3v7H1V2.5ZM3 9H1v5.5c0 .83.67 1.5 1.5 1.5H3V9Zm1 8H2.5A2.5 2.5 0 0 1 0 14.5v-12A2.5 2.5 0 0 1 2.5 0h14A2.5 2.5 0 0 1 19 2.5v12a2.5 2.5 0 0 1-2.5 2.5H4Zm6-16h5v15h-5v-3H9v3H4V1h5v3h1V1Zm8 8h-2v7h.5c.83 0 1.5-.67 1.5-1.5v-12c0-.83-.67-1.5-1.5-1.5H16v7h2v1ZM6.84 6.86v4.64h1V5.86h-1L5.36 6.9v.94l1.4-.98h.08Zm3.48 4.42c.32.24.7.36 1.15.36.45 0 .83-.12 1.15-.36.33-.24.57-.58.74-1.02.18-.44.26-.97.26-1.58 0-.61-.08-1.13-.26-1.57a2.26 2.26 0 0 0-.73-1.03c-.33-.24-.7-.36-1.16-.36-.45 0-.83.12-1.15.36-.32.24-.56.58-.73 1.03-.18.44-.26.96-.26 1.57 0 .61.08 1.14.26 1.58.17.44.41.78.73 1.02Zm1.77-.71a.83.83 0 0 1-.62.25.83.83 0 0 1-.61-.25c-.17-.18-.3-.42-.39-.74-.09-.32-.13-.7-.13-1.15 0-.45.04-.83.13-1.15.1-.32.22-.56.39-.73a.83.83 0 0 1 .61-.26c.24 0 .45.08.62.26.17.17.3.41.38.73.1.32.14.7.14 1.15 0 .45-.05.83-.14 1.15-.09.32-.21.56-.38.74Z"/></svg>'
    },
    535956: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M5 0H2.5A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0H5Zm9 1h-4v2h4V1Zm1 2V1h1.5c.83 0 1.5.67 1.5 1.5V3h-3Zm-1 1H1v9h17V4h-4Zm-4 10h4v2h1v-2h3v.5c0 .83-.67 1.5-1.5 1.5h-14A1.5 1.5 0 0 1 1 14.5V14h3v2h1v-2h4v2h1v-2ZM9 1H5v2h4V1ZM4 1H2.5C1.67 1 1 1.67 1 2.5V3h3V1Zm2.78 5.86v4.64h1V5.86h-1L5.3 6.9v.94l1.4-.98h.08Zm2.57 3.96v.68h3.9v-.83h-2.54v-.08l1.13-1.1c.34-.33.6-.62.8-.86.2-.24.33-.46.41-.66.08-.2.12-.4.12-.62v-.01c0-.32-.08-.6-.24-.84a1.64 1.64 0 0 0-.67-.57 2.2 2.2 0 0 0-.97-.2c-.4 0-.74.07-1.04.22a1.7 1.7 0 0 0-.96 1.56v.01h.94v-.01c0-.2.05-.37.13-.51.08-.15.2-.26.35-.34.15-.09.33-.13.53-.13s.36.04.5.12a.8.8 0 0 1 .32.31 1 1 0 0 1 .03.88 2 2 0 0 1-.3.45c-.14.17-.34.38-.6.64l-1.84 1.89Z"/></svg>'
    },
    686963: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1H3v7H1V2.5ZM3 9H1v5.5c0 .83.67 1.5 1.5 1.5H3V9Zm1 8H2.5A2.5 2.5 0 0 1 0 14.5v-12A2.5 2.5 0 0 1 2.5 0h14A2.5 2.5 0 0 1 19 2.5v12a2.5 2.5 0 0 1-2.5 2.5H4Zm6-16h5v15h-5v-3H9v3H4V1h5v3h1V1Zm8 8h-2v7h.5c.83 0 1.5-.67 1.5-1.5v-12c0-.83-.67-1.5-1.5-1.5H16v7h2v1ZM6.78 6.86v4.64h1V5.86h-1L5.3 6.9v.94l1.4-.98h.08Zm2.57 3.96v.68h3.9v-.83h-2.54v-.08l1.13-1.1c.34-.33.6-.62.8-.86.2-.24.33-.46.41-.66.08-.2.12-.4.12-.62v-.01c0-.32-.08-.6-.24-.84a1.64 1.64 0 0 0-.67-.57 2.2 2.2 0 0 0-.97-.2c-.4 0-.74.07-1.04.22a1.7 1.7 0 0 0-.96 1.56v.01h.94v-.01c0-.2.05-.37.13-.51.08-.15.2-.26.35-.34.15-.09.33-.13.53-.13s.36.04.5.12a.8.8 0 0 1 .32.31 1 1 0 0 1 .03.88 2 2 0 0 1-.3.45c-.14.17-.34.38-.6.64l-1.84 1.89Z"/></svg>'
    },
    904e3: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1H3v7H1V2.5ZM4 1v15h5v-3h1v3h5V1h-5v3H9V1H4Zm12 7V1h.5c.83 0 1.5.67 1.5 1.5v12c0 .83-.67 1.5-1.5 1.5H16V9h2V8h-2ZM3 9H1v5.5c0 .83.67 1.5 1.5 1.5H3V9Zm-.5-9A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14Zm4.31 6.86v4.64h1V5.86h-1L5.34 6.9v.94l1.4-.98h.07Zm5.17 3.56v1.08h.97v-1.08h.76v-.83h-.76V5.86h-1.42a34.11 34.11 0 0 0-.94 1.46 138.24 138.24 0 0 0-1.36 2.27v.83h2.75ZM12 9.6h-1.84v-.06a27.47 27.47 0 0 1 .7-1.17 44.72 44.72 0 0 1 1.08-1.71H12V9.6Z"/></svg>'
    },
    359473: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M5 0H2.5A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0H5Zm9 1h-4v2h4V1Zm1 2V1h1.5c.83 0 1.5.67 1.5 1.5V3h-3Zm-1 1H1v4h3v1H1v4h17V4h-4Zm-4 10h4v2h1v-2h3v.5c0 .83-.67 1.5-1.5 1.5h-14A1.5 1.5 0 0 1 1 14.5V14h3v2h1v-2h4v2h1v-2ZM9 1H5v2h4V1ZM4 1H2.5C1.67 1 1 1.67 1 2.5V3h3V1Zm11 8V8h3v1h-3ZM6.83 6.86v4.64h1V5.86h-1L5.36 6.9v.94l1.4-.98h.07Zm3.87 4.62c.27.1.55.16.85.16.41 0 .77-.09 1.08-.26a1.93 1.93 0 0 0 1.01-1.72c0-.36-.07-.68-.23-.96-.16-.28-.37-.5-.65-.66-.28-.17-.6-.25-.96-.25-.25 0-.48.04-.68.12-.19.08-.35.18-.49.3-.13.14-.23.27-.3.42h-.08V8.5c.02-.36.08-.69.17-.98.1-.3.23-.53.42-.7.19-.18.43-.27.73-.27.17 0 .32.03.45.08a.97.97 0 0 1 .55.57l.01.04h.99V7.2a1.74 1.74 0 0 0-.37-.77c-.18-.22-.41-.4-.7-.52-.27-.12-.58-.19-.93-.19-.47 0-.87.12-1.21.36-.34.24-.6.59-.79 1.04-.18.45-.27 1-.27 1.63 0 .51.06.95.18 1.32.12.36.28.66.5.9.2.22.44.4.72.5Zm-.27-1.8a1.16 1.16 0 0 0 .55.99c.17.1.36.15.56.15a1.1 1.1 0 0 0 1.12-1.12v-.01c0-.22-.05-.41-.14-.58-.1-.17-.23-.3-.4-.4-.16-.1-.35-.14-.57-.14-.2 0-.4.04-.57.14a1.05 1.05 0 0 0-.55.95v.01Z"/></svg>'
    },
    571774: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1H3v7H1V2.5ZM3 9H1v5.5c0 .83.67 1.5 1.5 1.5H3V9Zm1 7h5v-3h1v3h5V1h-5v3H9V1H4v15Zm12.5 0H16V9h2V8h-2V1h.5c.83 0 1.5.67 1.5 1.5v12c0 .83-.67 1.5-1.5 1.5ZM2.5 0A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14Zm4.33 6.86v4.64h1V5.86h-1L5.36 6.9v.94l1.4-.98h.07Zm3.87 4.62c.27.1.55.16.85.16.41 0 .77-.09 1.08-.26a1.93 1.93 0 0 0 1.01-1.72c0-.36-.07-.68-.23-.96-.16-.28-.37-.5-.65-.66-.28-.17-.6-.25-.96-.25-.25 0-.48.04-.68.12-.19.08-.35.18-.49.3-.13.14-.23.27-.3.42h-.08V8.5c.02-.36.08-.69.17-.98.1-.3.23-.53.42-.7.19-.18.43-.27.73-.27.17 0 .32.03.45.08a.97.97 0 0 1 .55.57l.01.04h.99V7.2a1.74 1.74 0 0 0-.37-.77c-.18-.22-.41-.4-.7-.52-.27-.12-.58-.19-.93-.19-.47 0-.87.12-1.21.36-.34.24-.6.59-.79 1.04-.18.45-.27 1-.27 1.63 0 .51.06.95.18 1.32.12.36.28.66.5.9.2.22.44.4.72.5Zm-.27-1.8a1.16 1.16 0 0 0 .55.99c.17.1.36.15.56.15a1.1 1.1 0 0 0 1.12-1.12v-.01c0-.22-.05-.41-.14-.58-.1-.17-.23-.3-.4-.4-.16-.1-.35-.14-.57-.14-.2 0-.4.04-.57.14a1.05 1.05 0 0 0-.55.95v.01Z"/></svg>'
    },
    112466: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1H9v7H1V2.5ZM1 9v5.5c0 .83.67 1.5 1.5 1.5h14c.83 0 1.5-.67 1.5-1.5V9H1Zm17-1V2.5c0-.83-.67-1.5-1.5-1.5H10v7h8ZM2.5 0A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14Z"/></svg>'
    },
    938926: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1H9v7H1V2.5ZM1 9v3h17V9H1Zm17-1V2.5c0-.83-.67-1.5-1.5-1.5H10v7h8Zm0 5H1v1.5c0 .83.67 1.5 1.5 1.5h14c.83 0 1.5-.67 1.5-1.5V13ZM2.5 0A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14Z"/></svg>'
    },
    259806: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1H9v7H1V2.5ZM1 9v5.5c0 .83.67 1.5 1.5 1.5H6V9H1Zm6 7h5V9H7v7Zm6 0h3.5c.83 0 1.5-.67 1.5-1.5V9h-5v7Zm5-8V2.5c0-.83-.67-1.5-1.5-1.5H10v7h8ZM2.5 0A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14Z"/></svg>'
    },
    272279: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1H9v15H2.5A1.5 1.5 0 0 1 1 14.5v-12ZM10 16h6.5c.83 0 1.5-.67 1.5-1.5v-12c0-.83-.67-1.5-1.5-1.5H10v15ZM2.5 0A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14Z"/></svg>'
    },
    135106: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1h14c.83 0 1.5.67 1.5 1.5V8H1V2.5ZM1 9v5.5c0 .83.67 1.5 1.5 1.5h14c.83 0 1.5-.67 1.5-1.5V9H1Zm1.5-9A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14Z"/></svg>'
    },
    758180: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1H6v15H2.5A1.5 1.5 0 0 1 1 14.5v-12ZM7 16h5V1H7v15Zm6-15v15h3.5c.83 0 1.5-.67 1.5-1.5v-12c0-.83-.67-1.5-1.5-1.5H13ZM2.5 0A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14Z"/></svg>'
    },
    710757: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1H9v7H1V2.5ZM1 9v5.5c0 .83.67 1.5 1.5 1.5H9V9H1Zm9 7h6.5c.83 0 1.5-.67 1.5-1.5v-12c0-.83-.67-1.5-1.5-1.5H10v15ZM2.5 0A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14Z"/></svg>'
    },
    910997: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1H9v15H2.5A1.5 1.5 0 0 1 1 14.5v-12ZM10 16h6.5c.83 0 1.5-.67 1.5-1.5V9h-8v7Zm8-8V2.5c0-.83-.67-1.5-1.5-1.5H10v7h8ZM2.5 0A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14Z"/></svg>'
    },
    687037: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1h14c.83 0 1.5.67 1.5 1.5V5H1V2.5ZM1 6v5h17V6H1Zm17 6H1v2.5c0 .83.67 1.5 1.5 1.5h14c.83 0 1.5-.67 1.5-1.5V12ZM2.5 0A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14Z"/></svg>'
    },
    330273: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1H9v7H1V2.5ZM1 9v5.5c0 .83.67 1.5 1.5 1.5H9V9H1Zm9 7h6.5c.83 0 1.5-.67 1.5-1.5V9h-8v7Zm8-8V2.5c0-.83-.67-1.5-1.5-1.5H10v7h8ZM2.5 0A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14Z"/></svg>'
    },
    49011: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1H4v15H2.5A1.5 1.5 0 0 1 1 14.5v-12ZM5 16h4V1H5v15Zm5-15v15h4V1h-4Zm5 0v15h1.5c.83 0 1.5-.67 1.5-1.5v-12c0-.83-.67-1.5-1.5-1.5H15ZM2.5 0A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14Z"/></svg>'
    },
    663962: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1H9v15H2.5A1.5 1.5 0 0 1 1 14.5v-12ZM10 16h6.5c.83 0 1.5-.67 1.5-1.5V12h-8v4Zm8-5V6h-8v5h8Zm0-6V2.5c0-.83-.67-1.5-1.5-1.5H10v4h8ZM2.5 0A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14Z"/></svg>'
    },
    236421: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1h14c.83 0 1.5.67 1.5 1.5V4H1V2.5ZM1 5v3h17V5H1Zm17 4H1v3h17V9Zm0 4H1v1.5c0 .83.67 1.5 1.5 1.5h14c.83 0 1.5-.67 1.5-1.5V13ZM2.5 0A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14Z"/></svg>'
    },
    570309: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M2.5 1C1.67 1 1 1.67 1 2.5v12c0 .83.67 1.5 1.5 1.5H4V1H2.5ZM9 16H5V1h4v3h1V1h4v15h-4v-3H9v3Zm6 0h1.5c.83 0 1.5-.67 1.5-1.5v-12c0-.83-.67-1.5-1.5-1.5H15v15ZM2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17Zm9.18-7.49c0 1.16-.88 1.96-2.12 1.96-1.17 0-1.97-.7-2.04-1.63v-.05h.94v.02c.08.48.51.84 1.1.84.68 0 1.14-.46 1.14-1.12v-.01c0-.64-.47-1.1-1.13-1.1-.32 0-.6.1-.81.27-.1.09-.2.2-.27.32h-.88l.27-3.28h3.46v.83H8.7l-.16 1.7h.02c.25-.38.71-.6 1.28-.6 1.07 0 1.85.77 1.85 1.84v.01Z"/></svg>'
    },
    978222: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1H9v15H2.5A1.5 1.5 0 0 1 1 14.5v-12ZM10 16h6.5c.83 0 1.5-.67 1.5-1.5V13h-8v3Zm8-4V9h-8v3h8Zm0-4V5h-8v3h8Zm0-4V2.5c0-.83-.67-1.5-1.5-1.5H10v3h8ZM2.5 0A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14Z"/></svg>'
    },
    280088: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1H6v7H1V2.5ZM1 9v5.5c0 .83.67 1.5 1.5 1.5H6V9H1Zm6 7h5V9H7v7Zm6 0h3.5c.83 0 1.5-.67 1.5-1.5V9h-5v7Zm5-8V2.5c0-.83-.67-1.5-1.5-1.5H13v7h5Zm-6-7H7v7h5V1ZM2.5 0A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14Z"/></svg>'
    },
    44836: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1H9v4H1V2.5ZM1 6v5h8V6H1Zm0 6v2.5c0 .83.67 1.5 1.5 1.5H9v-4H1Zm9 4h6.5c.83 0 1.5-.67 1.5-1.5V12h-8v4Zm8-5V6h-8v5h8Zm0-6V2.5c0-.83-.67-1.5-1.5-1.5H10v4h8ZM2.5 0A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14Z"/></svg>'
    },
    502992: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M2.5 1C1.67 1 1 1.67 1 2.5v12c0 .83.67 1.5 1.5 1.5H4V1H2.5ZM9 16H5V1h4v3h1V1h4v15h-4v-3H9v3Zm6 0h1.5c.83 0 1.5-.67 1.5-1.5v-12c0-.83-.67-1.5-1.5-1.5H15v15ZM2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17Zm9.16-7.48c0 1.13-.9 1.95-2.1 1.95-1.26 0-2.29-.87-2.29-2.85 0-1.87.87-2.98 2.3-2.98 1.05 0 1.82.6 2 1.45l.01.04h-1l-.01-.03c-.15-.39-.5-.64-1-.64-.91 0-1.29.87-1.33 1.94v.17h.02c.22-.51.78-.9 1.55-.9 1.08 0 1.85.78 1.85 1.84Zm-3.25 0v.01c0 .63.5 1.12 1.13 1.12a1.1 1.1 0 0 0 1.12-1.1c0-.65-.47-1.1-1.11-1.1-.65 0-1.14.45-1.14 1.08Z"/></svg>'
    },
    244570: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M2.5 1C1.67 1 1 1.67 1 2.5v12c0 .83.67 1.5 1.5 1.5H4V1H2.5ZM9 16H5V1h4v3h1V1h4v15h-4v-3H9v3Zm6 0h1.5c.83 0 1.5-.67 1.5-1.5v-12c0-.83-.67-1.5-1.5-1.5H15v15ZM2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17Zm6.75-5.63H8.2l2.47-4.8v-.01H7.74v-.83h3.92v.84l-2.4 4.8Z"/></svg>'
    },
    114950: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1H4v7H1V2.5ZM1 9v5.5c0 .83.67 1.5 1.5 1.5H4V9H1Zm4 7h4V9H5v7Zm5 0h4V9h-4v7Zm5 0h1.5c.83 0 1.5-.67 1.5-1.5V9h-3v7Zm3-8V2.5c0-.83-.67-1.5-1.5-1.5H15v7h3Zm-4-7h-4v7h4V1ZM9 1H5v7h4V1ZM2.5 0A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14Z"/></svg>'
    },
    605018: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1H9v3H1V2.5ZM1 5v3h8V5H1Zm0 4v3h8V9H1Zm0 4v1.5c0 .83.67 1.5 1.5 1.5H9v-3H1Zm9 3h6.5c.83 0 1.5-.67 1.5-1.5V13h-8v3Zm8-4V9h-8v3h8Zm0-4V5h-8v3h8Zm0-4V2.5c0-.83-.67-1.5-1.5-1.5H10v3h8ZM2.5 0A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14Z"/></svg>'
    },
    750633: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M2.5 1C1.67 1 1 1.67 1 2.5v12c0 .83.67 1.5 1.5 1.5H4V1H2.5ZM9 16H5V1h4v3h1V1h4v15h-4v-3H9v3Zm6 0h1.5c.83 0 1.5-.67 1.5-1.5v-12c0-.83-.67-1.5-1.5-1.5H15v15ZM2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17Zm9.2-7.16c0 .96-.91 1.63-2.2 1.63s-2.19-.67-2.19-1.63v-.01c0-.72.52-1.27 1.27-1.42v-.03c-.64-.17-1.06-.64-1.06-1.24 0-.87.82-1.5 1.98-1.5 1.16 0 1.98.63 1.98 1.5 0 .6-.42 1.07-1.06 1.24v.03c.75.15 1.27.7 1.27 1.42ZM8.5 7.24c0 .48.4.82.99.82s.99-.34.99-.83c0-.5-.4-.83-.99-.83-.58 0-.99.34-.99.83Zm-.16 2.53c0 .54.48.93 1.15.93.68 0 1.15-.39 1.15-.93 0-.55-.47-.94-1.15-.94-.68 0-1.15.4-1.15.94Z"/></svg>'
    },
    841785: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" d="M2.5 1C1.67 1 1 1.67 1 2.5v12c0 .83.67 1.5 1.5 1.5h14c.83 0 1.5-.67 1.5-1.5v-12c0-.83-.67-1.5-1.5-1.5h-14ZM0 2.5A2.5 2.5 0 0 1 2.5 0h14A2.5 2.5 0 0 1 19 2.5v12a2.5 2.5 0 0 1-2.5 2.5h-14A2.5 2.5 0 0 1 0 14.5v-12Z"/></svg>'
    },
    831246: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path fill-rule="evenodd" d="m18.43 15.91 6.96-8.6-.78-.62-6.96 8.6a2.49 2.49 0 0 0-2.63.2l-2.21-2.02A2.5 2.5 0 0 0 10.5 10a2.5 2.5 0 1 0 1.73 4.3l2.12 1.92a2.5 2.5 0 1 0 4.08-.31ZM10.5 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm7.5 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/><path d="M8.37 13.8c.17.3.4.54.68.74l-5.67 6.78-.76-.64 5.75-6.88Z"/></svg>'
    },
    241473: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="m25.39 7.31-8.83 10.92-6.02-5.47-7.16 8.56-.76-.64 7.82-9.36 6 5.45L24.61 6.7l.78.62Z"/></svg>'
    },
    173149: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M18 24h3V12h-3v12zm-1-13h5v14h-5V11zm-4-8v7h3V3h-3zm-1-1h5v9h-5V2zM8 19h3v-7H8v7zm-1-8h5v9H7v-9z"/></svg>'
    },
    282436: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" width="21" height="21"><g fill="none" stroke="currentColor"><path d="M18.5 11v5.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2H9"/><path stroke-linecap="square" d="M18 2l-8.5 8.5m4-9h5v5"/></g></svg>'
    },
    893316: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M14.5 16a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0-1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm0 7a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0-1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm3.293-15.5l4.707 4.707.707-.707L18.5 4.793z"/><path d="M18.5 10.207L23.207 5.5l-.707-.707L17.793 9.5zm-.707 1.293l4.707 4.707.707-.707-4.707-4.707z"/><path d="M18.5 16.207l4.707-4.707-.707-.707-4.707 4.707zM5.793 17.5l4.707 4.707.707-.707L6.5 16.793z"/><path d="M6.5 22.207l4.707-4.707-.707-.707L5.793 21.5zM5.793 5.5l4.707 4.707.707-.707L6.5 4.793z"/><path d="M6.5 10.207L11.207 5.5l-.707-.707L5.793 9.5zM5.793 11.5l4.707 4.707.707-.707L6.5 10.793z"/><path d="M6.5 16.207l4.707-4.707-.707-.707L5.793 15.5z"/></svg>'
    },
    648449: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fill-rule="evenodd"><path fill-rule="nonzero" d="M14 17a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-1a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M5.005 16A1.003 1.003 0 0 1 4 14.992v-1.984A.998.998 0 0 1 5 12h1.252a7.87 7.87 0 0 1 .853-2.06l-.919-.925c-.356-.397-.348-1 .03-1.379l1.42-1.42a1 1 0 0 1 1.416.007l.889.882A7.96 7.96 0 0 1 12 6.253V5c0-.514.46-1 1-1h2c.557 0 1 .44 1 1v1.253a7.96 7.96 0 0 1 2.06.852l.888-.882a1 1 0 0 1 1.416-.006l1.42 1.42a.999.999 0 0 1 .029 1.377s-.4.406-.918.926a7.87 7.87 0 0 1 .853 2.06H23c.557 0 1 .447 1 1.008v1.984A.998.998 0 0 1 23 16h-1.252a7.87 7.87 0 0 1-.853 2.06l.882.888a1 1 0 0 1 .006 1.416l-1.42 1.42a1 1 0 0 1-1.415-.007l-.889-.882a7.96 7.96 0 0 1-2.059.852v1.248c0 .56-.45 1.005-1.008 1.005h-1.984A1.004 1.004 0 0 1 12 22.995v-1.248a7.96 7.96 0 0 1-2.06-.852l-.888.882a1 1 0 0 1-1.416.006l-1.42-1.42a1 1 0 0 1 .007-1.415l.882-.888A7.87 7.87 0 0 1 6.252 16H5.005zm3.378-6.193l-.227.34A6.884 6.884 0 0 0 7.14 12.6l-.082.4H5.005C5.002 13 5 13.664 5 14.992c0 .005.686.008 2.058.008l.082.4c.18.883.52 1.71 1.016 2.453l.227.34-1.45 1.46c-.004.003.466.477 1.41 1.422l1.464-1.458.34.227a6.959 6.959 0 0 0 2.454 1.016l.399.083v2.052c0 .003.664.005 1.992.005.005 0 .008-.686.008-2.057l.399-.083a6.959 6.959 0 0 0 2.454-1.016l.34-.227 1.46 1.45c.003.004.477-.466 1.422-1.41l-1.458-1.464.227-.34A6.884 6.884 0 0 0 20.86 15.4l.082-.4h2.053c.003 0 .005-.664.005-1.992 0-.005-.686-.008-2.058-.008l-.082-.4a6.884 6.884 0 0 0-1.016-2.453l-.227-.34 1.376-1.384.081-.082-1.416-1.416-1.465 1.458-.34-.227a6.959 6.959 0 0 0-2.454-1.016L15 7.057V5c0-.003-.664-.003-1.992 0-.005 0-.008.686-.008 2.057l-.399.083a6.959 6.959 0 0 0-2.454 1.016l-.34.227-1.46-1.45c-.003-.004-.477.466-1.421 1.408l1.457 1.466z"/></g></svg>'
    },
    796052: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M18.293 13l-2.647 2.646.707.708 3.854-3.854-3.854-3.854-.707.708L18.293 12H12.5A5.5 5.5 0 0 0 7 17.5V19h1v-1.5a4.5 4.5 0 0 1 4.5-4.5h5.793z"/></svg>'
    },
    149387: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M18 5v5h3V5h-3zm-1-1h5v7h-5V4zm-4 13h3v-5h-3v5zm-1-6h5v7h-5v-7zM8 24h3v-5H8v5zm-1-6h5v7H7v-7z"/></svg>'
    },
    272644: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.118 6a.5.5 0 0 0-.447.276L9.809 8H5.5A1.5 1.5 0 0 0 4 9.5v10A1.5 1.5 0 0 0 5.5 21h16a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 21.5 8h-4.309l-.862-1.724A.5.5 0 0 0 15.882 6h-4.764zm-1.342-.17A1.5 1.5 0 0 1 11.118 5h4.764a1.5 1.5 0 0 1 1.342.83L17.809 7H21.5A2.5 2.5 0 0 1 24 9.5v10a2.5 2.5 0 0 1-2.5 2.5h-16A2.5 2.5 0 0 1 3 19.5v-10A2.5 2.5 0 0 1 5.5 7h3.691l.585-1.17z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M13.5 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm0 1a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z"/></svg>'
    },
    715726: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M19 5h5v1h-4v13h-6v-7h-4v12H5v-1h4V11h6v7h4V5Z"/></svg>'
    },
    377665: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M8.707 13l2.647 2.646-.707.708L6.792 12.5l3.853-3.854.708.708L8.707 12H14.5a5.5 5.5 0 0 1 5.5 5.5V19h-1v-1.5a4.5 4.5 0 0 0-4.5-4.5H8.707z"/></svg>'
    },
    333765: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="currentColor" d="M9.707 9l4.647-4.646-.707-.708L9 8.293 4.354 3.646l-.708.708L8.293 9l-4.647 4.646.708.708L9 9.707l4.646 4.647.708-.707L9.707 9z"/></svg>'
    },
    636296: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M8 9.5H6.5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V20m-8-1.5h11a1 1 0 0 0 1-1v-11a1 1 0 0 0-1-1h-11a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1z"/></svg>'
    },
    323595: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M6.5 16v4.5a1 1 0 001 1h14a1 1 0 001-1V16M14.5 5V17m-4-3.5l4 4l4-4"/></svg>'
    },
    239146: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" d="M9 1l2.35 4.76 5.26.77-3.8 3.7.9 5.24L9 13l-4.7 2.47.9-5.23-3.8-3.71 5.25-.77L9 1z"/></svg>'
    },
    648010: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M9 2.13l1.903 3.855.116.236.26.038 4.255.618-3.079 3.001-.188.184.044.259.727 4.237-3.805-2L9 12.434l-.233.122-3.805 2.001.727-4.237.044-.26-.188-.183-3.079-3.001 4.255-.618.26-.038.116-.236L9 2.13z"/></svg>'
    },
    929414: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="M19 15l2.5-2.5c1-1 1.5-3.5-.5-5.5s-4.5-1.5-5.5-.5L13 9M10 12l-2.5 2.5c-1 1-1.5 3.5.5 5.5s4.5 1.5 5.5.5L16 18M17 11l-5 5"/></svg>'
    },
    167487: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M19.75 5h3.07l-6.7 7.62L24 23h-6.17l-4.84-6.3L7.46 23H4.4l7.17-8.16L4 5h6.33l4.37 5.75L19.75 5Zm-1.24 16h1.7L9.54 7H7.7l10.8 14Z"/></svg>'
    },
  },
])
