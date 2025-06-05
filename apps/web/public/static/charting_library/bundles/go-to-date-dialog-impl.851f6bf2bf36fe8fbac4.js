;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1859],
  {
    58222: (e) => {
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
    88803: (e) => {
      e.exports = {
        'tablet-normal-breakpoint': 'screen and (max-width: 768px)',
        'small-height-breakpoint': 'screen and (max-height: 360px)',
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
      }
    },
    45300: (e) => {
      e.exports = {}
    },
    27011: (e, t, a) => {
      function r(e, t) {
        return (
          t ||
          null == e ||
          (('string' == typeof e || Array.isArray(e)) && 0 === e.length)
        )
      }
      a.d(t, { isIconOnly: () => r })
    },
    14543: (e, t, a) => {
      a.d(t, { LightButton: () => r.LightButton })
      a(8025)
      var r = a(15893)
      a(50959), a(21593)
    },
    8025: (e, t, a) => {
      a.d(t, { LightButtonContent: () => y, useLightButtonClasses: () => p })
      var r = a(50959),
        n = a(97754),
        o = a(34094),
        s = a(9745),
        i = a(17946),
        l = a(27011),
        u = a(86332)
      const c = r.createContext({ isInButtonGroup: !1, isGroupPrimary: !1 })
      var d = a(2948),
        h = a(58222),
        m = a.n(h)
      const p = (e, t) => {
        const a = (0, r.useContext)(i.CustomBehaviourContext),
          o = (0, r.useContext)(u.ControlGroupContext),
          { isInButtonGroup: s, isGroupPrimary: d } = (0, r.useContext)(c),
          {
            className: h,
            isSelected: p,
            children: y,
            startIcon: _,
            showCaret: v,
            endIcon: f,
            forceDirection: g,
            iconOnly: b,
            color: S = 'gray',
            variant: D = 'primary',
            size: k = 'medium',
            enableActiveStateStyles: M = a.enableActiveStateStyles,
            typography: T,
            isLink: x = !1,
            textWrap: z,
            isPills: L,
            isActive: I,
          } = e,
          N =
            m()[
              `typography-${((e, t, a) => {
                if (a) {
                  const e = a.replace(/^\D+/g, '')
                  return t ? `semibold${e}` : a
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
              })(k, p || L, T || void 0)}`
            ]
        return n(
          h,
          m()['light-button'],
          x && m().link,
          I && m().active,
          p && m().selected,
          (0, l.isIconOnly)(y, b) && m()['no-content'],
          _ && m()['with-start-icon'],
          (v || f) && m()['with-end-icon'],
          t && m()['with-grouped'],
          g && m()[`force-direction-${g}`],
          m()[`variant-${d ? 'primary' : D}`],
          m()[`color-${d ? 'gray' : S}`],
          m()[`size-${k}`],
          N,
          !M && m()['disable-active-state-styles'],
          o.isGrouped && m().grouped,
          z && m().wrap,
          s && m()['disable-active-on-touch'],
          L && m().pills,
        )
      }
      function y(e) {
        const {
          startIcon: t,
          endIcon: a,
          showCaret: i,
          iconOnly: u,
          ellipsis: c = !0,
          textWrap: h,
          tooltipText: p,
          children: y,
        } = e
        return r.createElement(
          r.Fragment,
          null,
          t && r.createElement(s.Icon, { className: m().icon, icon: t }),
          !(0, l.isIconOnly)(y, u) &&
            r.createElement(
              'span',
              {
                className: n(
                  m().content,
                  !h && m().nowrap,
                  'apply-overflow-tooltip',
                  'apply-overflow-tooltip--check-children-recursively',
                  'apply-overflow-tooltip--allow-text',
                ),
                'data-overflow-tooltip-text':
                  null != p ? p : (0, o.getTextForTooltip)(y),
              },
              h || c
                ? r.createElement(
                    r.Fragment,
                    null,
                    r.createElement(
                      'span',
                      {
                        className: n(
                          !h && c && m()['ellipsis-container'],
                          h && m()['text-wrap-container'],
                          h && c && m()['text-wrap-with-ellipsis'],
                        ),
                      },
                      y,
                    ),
                    r.createElement(
                      'span',
                      { className: m()['visually-hidden'], 'aria-hidden': !0 },
                      y,
                    ),
                  )
                : r.createElement(
                    r.Fragment,
                    null,
                    y,
                    r.createElement(
                      'span',
                      { className: m()['visually-hidden'], 'aria-hidden': !0 },
                      y,
                    ),
                  ),
            ),
          (a || i) &&
            ((e) =>
              r.createElement(s.Icon, {
                className: n(m().icon, e.showCaret && m().caret),
                icon: e.showCaret ? d : e.endIcon,
              }))(e),
        )
      }
    },
    15893: (e, t, a) => {
      a.d(t, { LightButton: () => s })
      var r = a(50959),
        n = a(86332),
        o = a(8025)
      function s(e) {
        const { isGrouped: t } = r.useContext(n.ControlGroupContext),
          {
            reference: a,
            className: s,
            isSelected: i,
            children: l,
            startIcon: u,
            iconOnly: c,
            ellipsis: d,
            showCaret: h,
            forceDirection: m,
            endIcon: p,
            color: y,
            variant: _,
            size: v,
            enableActiveStateStyles: f,
            typography: g,
            textWrap: b = !1,
            maxLines: S,
            style: D = {},
            isPills: k,
            isActive: M,
            tooltipText: T,
            ...x
          } = e,
          z = b ? (null != S ? S : 2) : 1,
          L = z > 0 ? { ...D, '--ui-lib-light-button-content-max-lines': z } : D
        return r.createElement(
          'button',
          {
            ...x,
            className: (0, o.useLightButtonClasses)(
              {
                className: s,
                isSelected: i,
                children: l,
                startIcon: u,
                iconOnly: c,
                showCaret: h,
                forceDirection: m,
                endIcon: p,
                color: y,
                variant: _,
                size: v,
                enableActiveStateStyles: f,
                typography: g,
                textWrap: b,
                isPills: k,
                isActive: M,
              },
              t,
            ),
            ref: a,
            style: L,
          },
          r.createElement(
            o.LightButtonContent,
            {
              showCaret: h,
              startIcon: u,
              endIcon: p,
              iconOnly: c,
              ellipsis: d,
              textWrap: b,
              tooltipText: T,
            },
            l,
          ),
        )
      }
    },
    86332: (e, t, a) => {
      a.d(t, { ControlGroupContext: () => r })
      const r = a(50959).createContext({
        isGrouped: !1,
        cellState: { isTop: !0, isRight: !0, isBottom: !0, isLeft: !0 },
      })
    },
    17946: (e, t, a) => {
      a.d(t, { CustomBehaviourContext: () => r })
      const r = (0, a(50959).createContext)({ enableActiveStateStyles: !0 })
      r.displayName = 'CustomBehaviourContext'
    },
    39416: (e, t, a) => {
      a.d(t, { useFunctionalRefObject: () => o })
      var r = a(50959),
        n = a(43010)
      function o(e) {
        const t = (0, r.useMemo)(
            () =>
              ((e) => {
                const t = (a) => {
                  e(a), (t.current = a)
                }
                return (t.current = null), t
              })((e) => {
                i.current(e)
              }),
            [],
          ),
          a = (0, r.useRef)(null),
          o = (t) => {
            if (null === t) return s(a.current, t), void (a.current = null)
            a.current !== e && ((a.current = e), s(a.current, t))
          },
          i = (0, r.useRef)(o)
        return (
          (i.current = o),
          (0, n.useIsomorphicLayoutEffect)(() => {
            if (null !== t.current)
              return i.current(t.current), () => i.current(null)
          }, [e]),
          t
        )
      }
      function s(e, t) {
        null !== e && ('function' == typeof e ? e(t) : (e.current = t))
      }
    },
    43010: (e, t, a) => {
      a.d(t, { useIsomorphicLayoutEffect: () => n })
      var r = a(50959)
      function n(e, t) {
        ;('undefined' == typeof window ? r.useEffect : r.useLayoutEffect)(e, t)
      }
    },
    86781: (e, t, a) => {
      a.d(t, { useMatchMedia: () => o, useSafeMatchMedia: () => n })
      var r = a(50959)
      function n(e, t = !1) {
        const [a, n] = (0, r.useState)(t)
        return (
          (0, r.useEffect)(() => {
            const t = window.matchMedia(e)
            function a() {
              n(t.matches)
            }
            return (
              a(),
              t.addListener(a),
              () => {
                t.removeListener(a)
              }
            )
          }, [e]),
          a
        )
      }
      function o(e) {
        const t = (0, r.useMemo)(() => window.matchMedia(e).matches, [])
        return n(e, t)
      }
    },
    27267: (e, t, a) => {
      function r(e, t, a, r, n) {
        function o(n) {
          if (e > n.timeStamp) return
          const o = n.target
          void 0 !== a &&
            null !== t &&
            null !== o &&
            o.ownerDocument === r &&
            (t.contains(o) || a(n))
        }
        return (
          n.click && r.addEventListener('click', o, !1),
          n.mouseDown && r.addEventListener('mousedown', o, !1),
          n.touchEnd && r.addEventListener('touchend', o, !1),
          n.touchStart && r.addEventListener('touchstart', o, !1),
          () => {
            r.removeEventListener('click', o, !1),
              r.removeEventListener('mousedown', o, !1),
              r.removeEventListener('touchend', o, !1),
              r.removeEventListener('touchstart', o, !1)
          }
        )
      }
      a.d(t, { addOutsideEventListener: () => r })
    },
    67842: (e, t, a) => {
      a.d(t, { useResizeObserver: () => i })
      var r = a(50959),
        n = a(59255),
        o = a(43010),
        s = a(39416)
      function i(e, t = []) {
        const { callback: a, ref: i = null } = ((e) =>
            'function' == typeof e ? { callback: e } : e)(e),
          l = (0, r.useRef)(null),
          u = (0, r.useRef)(a)
        u.current = a
        const c = (0, s.useFunctionalRefObject)(i),
          d = (0, r.useCallback)(
            (e) => {
              c(e),
                null !== l.current &&
                  (l.current.disconnect(), null !== e && l.current.observe(e))
            },
            [c, l],
          )
        return (
          (0, o.useIsomorphicLayoutEffect)(
            () => (
              (l.current = new n.default((e, t) => {
                u.current(e, t)
              })),
              c.current && d(c.current),
              () => {
                var e
                null === (e = l.current) || void 0 === e || e.disconnect()
              }
            ),
            [c, ...t],
          ),
          d
        )
      }
    },
    90186: (e, t, a) => {
      function r(e) {
        return o(e, s)
      }
      function n(e) {
        return o(e, i)
      }
      function o(e, t) {
        const a = Object.entries(e).filter(t),
          r = {}
        for (const [e, t] of a) r[e] = t
        return r
      }
      function s(e) {
        const [t, a] = e
        return 0 === t.indexOf('data-') && 'string' == typeof a
      }
      function i(e) {
        return 0 === e[0].indexOf('aria-')
      }
      a.d(t, {
        filterAriaProps: () => n,
        filterDataProps: () => r,
        filterProps: () => o,
        isAriaAttribute: () => i,
        isDataAttribute: () => s,
      })
    },
    34094: (e, t, a) => {
      a.d(t, { getTextForTooltip: () => s })
      var r = a(50959)
      const n = (e) => (0, r.isValidElement)(e) && Boolean(e.props.children),
        o = (e) =>
          null == e || 'boolean' == typeof e || '{}' === JSON.stringify(e)
            ? ''
            : e.toString() + ' ',
        s = (e) =>
          Array.isArray(e) || (0, r.isValidElement)(e)
            ? r.Children.toArray(e)
                .reduce((e, t) => {
                  let a = ''
                  return (
                    (a =
                      (0, r.isValidElement)(t) && n(t)
                        ? s(t.props.children)
                        : (0, r.isValidElement)(t) && !n(t)
                          ? ''
                          : o(t)),
                    e.concat(a)
                  )
                }, '')
                .trim()
            : o(e)
    },
    24437: (e, t, a) => {
      a.d(t, { DialogBreakpoints: () => n })
      var r = a(88803)
      const n = {
        SmallHeight: r['small-height-breakpoint'],
        TabletSmall: r['tablet-small-breakpoint'],
        TabletNormal: r['tablet-normal-breakpoint'],
      }
    },
    76068: (e, t, a) => {
      a.d(t, { CircleLogo: () => s, hiddenCircleLogoClass: () => o })
      var r = a(50959),
        n = a(58492)
      a(45300)
      const o = 'tv-circle-logo--visually-hidden'
      function s(e) {
        var t, a
        const o = (0, n.getStyleClasses)(e.size, e.className),
          s =
            null !== (a = null !== (t = e.alt) && void 0 !== t ? t : e.title) &&
            void 0 !== a
              ? a
              : ''
        return (0, n.isCircleLogoWithUrlProps)(e)
          ? r.createElement('img', {
              className: o,
              crossOrigin: '',
              src: e.logoUrl,
              alt: s,
              title: e.title,
              loading: e.loading,
              'aria-label': e['aria-label'],
              'aria-hidden': e['aria-hidden'],
            })
          : r.createElement(
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
    58492: (e, t, a) => {
      a.d(t, { getStyleClasses: () => n, isCircleLogoWithUrlProps: () => o })
      var r = a(97754)
      function n(e, t) {
        return r('tv-circle-logo', `tv-circle-logo--${e}`, t)
      }
      function o(e) {
        return 'logoUrl' in e && void 0 !== e.logoUrl && 0 !== e.logoUrl.length
      }
    },
    30586: (e) => {
      e.exports = { calendar: 'calendar-PM3TZruR' }
    },
    60207: (e) => {
      e.exports = { row: 'row-Sj9z7O1v', mobileRow: 'mobileRow-Sj9z7O1v' }
    },
    13930: (e) => {
      e.exports = {
        dialogWrapper: 'dialogWrapper-P_IVoUsZ',
        dialogWrapperSmall: 'dialogWrapperSmall-P_IVoUsZ',
        tabs: 'tabs-P_IVoUsZ',
        content: 'content-P_IVoUsZ',
        contentMobile: 'contentMobile-P_IVoUsZ',
        bodyWrapper: 'bodyWrapper-P_IVoUsZ',
      }
    },
    91952: (e, t, a) => {
      a.r(t), a.d(t, { showGoToDateDialog: () => ae })
      var r = a(50959),
        n = a(962),
        o = a(50151),
        s = a(82992),
        i = a(23935),
        l = a(51826),
        u = a(41249),
        c = a.n(u)
      const d = r.createContext(null)
      function h(e) {
        const { initialGoToDate: t, children: a } = e,
          [n, o] = (0, r.useState)(t),
          s = n.valueOf() <= (0, i.resetToDayEnd)(new Date()).valueOf(),
          l = (0, r.useMemo)(
            () => ({ date: n, setDate: o, isValid: s }),
            [n, s],
          )
        return r.createElement(d.Provider, { value: l }, a)
      }
      const m = r.createContext(null)
      function p(e) {
        const { initialRanges: t, children: a } = e,
          [n, o] = (0, r.useState)(t.from),
          [s, i] = (0, r.useState)(t.to),
          l = n.valueOf() <= s.valueOf(),
          u = (0, r.useMemo)(
            () => ({
              dateFrom: n,
              dateTo: s,
              setDateFrom: o,
              setDateTo: i,
              isValid: l,
            }),
            [n, s, l],
          )
        return r.createElement(m.Provider, { value: u }, a)
      }
      var y = a(11542),
        _ = a(97754),
        v = a.n(_),
        f = a(76422),
        g = a(56840),
        b = a.n(g),
        S = a(52092),
        D = a(24437),
        k = a(50182),
        M = a(60207)
      function T(e) {
        const { children: t } = e
        return r.createElement(
          'div',
          { className: v()(M.row, B && M.mobileRow) },
          t,
        )
      }
      var x = a(85528),
        z = a(76056)
      const L = r.createContext({ isActive: !1, isFocused: !1 })
      function I(e) {
        const {
            value: t,
            reference: a,
            isActive: n,
            onPick: o,
            onFocus: s,
            isDisabled: i,
            minValue: l,
            maxValue: u,
          } = e,
          [c, d] = (0, r.useState)(!1)
        return r.createElement(
          L.Provider,
          { value: { isActive: n, isFocused: c } },
          r.createElement(
            'div',
            {
              onFocus: () => {
                d(!0), s && s()
              },
              onBlur: () => {
                d(!1)
              },
            },
            r.createElement(x.DatePicker, {
              initial: t,
              minDate: l,
              maxDate: u,
              inputReference: a,
              InputComponent: N,
              withCalendar: !1,
              onPick: (e) => {
                if (!e) return
                o(new Date(e))
              },
              revertInvalidData: !0,
              name: e.name,
              disabled: i,
            }),
          ),
        )
      }
      function N(e) {
        const { isActive: t, isFocused: a } = (0, r.useContext)(L)
        return r.createElement(z.DateInput, { ...e, highlight: t || a })
      }
      var C = a(36565)
      function w(e) {
        const { value: t, isDisabled: a, onPick: n, className: o } = e
        return r.createElement(C.TimeInput, {
          value:
            ((s = t),
            (0, i.twoDigitsFormat)(s.getHours()) +
              ':' +
              (0, i.twoDigitsFormat)(s.getMinutes())),
          onChange: n,
          disabled: a,
          className: o,
        })
        var s
      }
      var E = a(28746),
        O = a(30586)
      function P(e) {
        const { className: t, ...a } = e
        return r.createElement(E.Calendar, {
          ...a,
          className: v()(O.calendar, t),
          popupStyle: !1,
        })
      }
      function A(e, t) {
        const a = new Date(t)
        return (
          a.setFullYear(e.getFullYear()),
          a.setMonth(e.getMonth(), 1),
          a.setDate(e.getDate()),
          a
        )
      }
      function Y(e, t) {
        const a = new Date(t)
        return a.setHours(e.getHours()), a.setMinutes(e.getMinutes()), a
      }
      function W(e) {
        const { dateOnly: t, onCalendarMonthSwitch: a, hideTimePick: n } = e,
          { date: s, setDate: i } = (0, o.ensureNotNull)((0, r.useContext)(d)),
          l = (0, r.useRef)(null),
          u = (0, r.useRef)(null)
        return (
          (0, r.useEffect)(() => {
            B || null === u.current || u.current.focus()
          }, []),
          r.createElement(
            'div',
            { ref: l, tabIndex: -1 },
            r.createElement(
              T,
              null,
              r.createElement(I, {
                reference: (e) => {
                  u.current = e
                },
                value: new Date(s),
                onPick: (e) => {
                  const t = A(e, s)
                  i(t)
                },
                isActive: !B,
              }),
              !n &&
                r.createElement(w, {
                  value: new Date(s),
                  isDisabled: t,
                  onPick: (e) => {
                    var t
                    const [a, r] = e.split(':'),
                      n = new Date()
                    n.setHours(Number(a)), n.setMinutes(Number(r))
                    const o = Y(n, s)
                    i(o),
                      B ||
                        null === (t = l.current) ||
                        void 0 === t ||
                        t.focus({ preventScroll: !0 })
                  },
                }),
            ),
            !B &&
              r.createElement(P, {
                key: `${s.getFullYear()}-${s.getMonth()}-${s.getDate()}`,
                selectedDate: new Date(s),
                onSelect: (e) => {
                  var t
                  const a = A(e, s)
                  i(a),
                    null === (t = l.current) ||
                      void 0 === t ||
                      t.focus({ preventScroll: !0 })
                },
                onMonthSwitch: a,
                maxDate: new Date(),
              }),
          )
        )
      }
      function F(e) {
        const {
            dateOnly: t,
            onCalendarMonthSwitch: a,
            onDateInputFocus: n,
          } = e,
          {
            dateFrom: s,
            dateTo: i,
            setDateFrom: l,
            setDateTo: u,
          } = (0, o.ensureNotNull)((0, r.useContext)(m)),
          [c, d] = (0, r.useState)('from'),
          h = (0, r.useRef)(null),
          p = (0, r.useRef)(null),
          y = (0, r.useRef)(null),
          _ = (0, r.useMemo)(
            () => ('from' === c ? new Date(s) : new Date(i)),
            [c, i, s],
          )
        return (
          (0, r.useEffect)(() => {
            B || null === p.current || p.current.focus()
          }, []),
          r.createElement(
            'div',
            { ref: h, tabIndex: -1 },
            r.createElement(
              T,
              null,
              r.createElement(I, {
                value: s,
                reference: (e) => {
                  p.current = e
                },
                isActive: !B && 'from' === c,
                onPick: (e) => {
                  const t = A(e, s)
                  l(t)
                },
                onFocus: () => {
                  d('from'), n()
                },
                name: 'start-date-range',
              }),
              r.createElement(w, {
                value: s,
                isDisabled: t,
                onPick: (e) => {
                  v(e, s, l)
                },
              }),
            ),
            r.createElement(
              T,
              null,
              r.createElement(I, {
                value: i,
                reference: (e) => {
                  y.current = e
                },
                isActive: !B && 'to' === c,
                onPick: (e) => {
                  const t = A(e, i)
                  u(t)
                },
                onFocus: () => {
                  d('to'), n()
                },
                name: 'end-date-range',
              }),
              r.createElement(w, {
                value: i,
                isDisabled: t,
                onPick: (e) => {
                  v(e, i, u)
                },
              }),
            ),
            !B &&
              r.createElement(P, {
                key: `${_.getFullYear()}-${_.getMonth()}-${_.getDate()}`,
                selectedDate: new Date(_),
                onSelect: (e) => {
                  const t = A(e, 'from' === c ? s : i)
                  ;({
                    from: () => {
                      var e
                      l(t),
                        null === (e = y.current) ||
                          void 0 === e ||
                          e.focus({ preventScroll: !0 })
                    },
                    to: () => {
                      var e
                      u(t),
                        null === (e = h.current) ||
                          void 0 === e ||
                          e.focus({ preventScroll: !0 })
                    },
                  })[c]()
                },
                onMonthSwitch: a,
                highlightedFrom: new Date(s),
                highlightedTo: new Date(i),
                maxDate: 'from' === c ? new Date(i) : void 0,
                minDate: 'to' === c ? new Date(s) : void 0,
              }),
          )
        )
        function v(e, t, a) {
          var r
          const [n, o] = e.split(':'),
            s = new Date()
          s.setHours(Number(n)), s.setMinutes(Number(o))
          a(Y(s, t)),
            B ||
              null === (r = h.current) ||
              void 0 === r ||
              r.focus({ preventScroll: !0 })
        }
      }
      var j = a(75983),
        U = a(90692),
        H = a(32563),
        J = a(13930)
      const B = H.mobiletouch,
        R = () => !0,
        G = [
          {
            label: y.t(null, void 0, a(76912)),
            id: 'Date',
            dataId: 'tab-item-date',
          },
          {
            label: y.t(null, void 0, a(74615)),
            id: 'CustomRange',
            dataId: 'tab-item-customrange',
          },
        ]
      function Q(e) {
        const { dateOnly: t, onClose: n, onGoToDate: s, onGoToRange: i } = e,
          l = (0, r.useRef)(null),
          [u, c] = (0, r.useState)(
            b().getValue('GoToDialog.activeTab', 'Date'),
          ),
          [h, p] = (0, r.useState)(0),
          { date: _, isValid: g } = (0, o.ensureNotNull)((0, r.useContext)(d)),
          {
            dateFrom: M,
            dateTo: T,
            isValid: x,
          } = (0, o.ensureNotNull)((0, r.useContext)(m))
        return (
          (0, r.useEffect)(
            () => (
              f.subscribe(S.CLOSE_POPUPS_AND_DIALOGS_COMMAND, N, null),
              () => {
                f.unsubscribe(S.CLOSE_POPUPS_AND_DIALOGS_COMMAND, N, null)
              }
            ),
            [n],
          ),
          (0, r.useEffect)(() => {
            null !== l.current && l.current()
          }, [h, u, _, M, T]),
          r.createElement(
            U.MatchMedia,
            { rule: D.DialogBreakpoints.TabletSmall },
            (e) =>
              r.createElement(k.AdaptiveConfirmDialog, {
                className: v()(J.dialogWrapper, e && J.dialogWrapperSmall),
                title: y.t(null, void 0, a(369)),
                dataName: 'go-to-date-dialog',
                render: z,
                defaultActionOnClose: 'cancel',
                onClose: N,
                onClickOutside: N,
                onCancel: N,
                onSubmit: I,
                submitButtonDisabled: L(),
                submitButtonText: y.t(null, void 0, a(369)),
                forceCloseOnEsc: R,
                shouldForceFocus: !1,
                fullScreen: e,
                isOpened: !0,
              }),
          )
        )
        function z({ requestResize: e }) {
          return (
            (l.current = e),
            r.createElement(
              r.Fragment,
              null,
              r.createElement(
                'div',
                { className: J.tabs },
                r.createElement(j.UnderlineButtonTabs, {
                  id: 'go-to-date-tabs',
                  isActive: (e) => e.id === u,
                  items: G,
                  onActivate: C,
                  overflowBehaviour: 'scroll',
                }),
              ),
              r.createElement(
                'div',
                { className: v()(J.content, B && J.contentMobile) },
                r.createElement(
                  'div',
                  { className: J.bodyWrapper },
                  r.createElement(V, {
                    onCalendarMonthSwitch: w,
                    onDateInputFocus: w,
                    activeTab: u,
                    dateOnly: t,
                  }),
                ),
              ),
            )
          )
        }
        function L() {
          return { CustomRange: !x, Date: !g }[u]
        }
        function I() {
          switch (u) {
            case 'Date':
              s(_)
              break
            case 'CustomRange':
              i(M, T)
          }
        }
        function N() {
          n()
        }
        function C(e) {
          c(e.id), b().setValue('GoToDialog.activeTab', e.id)
        }
        function w() {
          p(h + 1)
        }
      }
      function V(e) {
        const {
          activeTab: t,
          dateOnly: a,
          onCalendarMonthSwitch: n,
          onDateInputFocus: o,
        } = e
        switch (t) {
          case 'Date':
            return r.createElement(W, { dateOnly: a, onCalendarMonthSwitch: n })
          case 'CustomRange':
            return r.createElement(F, {
              dateOnly: a,
              onCalendarMonthSwitch: n,
              onDateInputFocus: o,
            })
        }
      }
      function K(e) {
        const {
          dateOnly: t,
          onClose: a,
          onGoToDate: n,
          onGoToRange: o,
          initialGoToDate: s,
          initialRanges: i,
        } = e
        return r.createElement(
          h,
          { initialGoToDate: s },
          r.createElement(
            p,
            { initialRanges: i },
            r.createElement(Q, {
              dateOnly: t,
              onClose: a,
              onGoToDate: n,
              onGoToRange: o,
            }),
          ),
        )
      }
      var Z = a(94025),
        $ = a(86094)
      const q = new (class {
        constructor() {
          this._hasError = !1
        }
        getItemOrDefault(e, t) {
          return !sessionStorage || this._hasError
            ? t
            : sessionStorage.getItem(e)
        }
        setItem(e, t = 'true') {
          try {
            sessionStorage.setItem(e, t), (this._hasError = !1)
          } catch (e) {
            this._hasError = !0
          }
        }
      })()
      var X = a(27365)
      const ee = 'goTo',
        te = new l.DialogsOpenerManager()
      function ae(e) {
        if (te.isOpened(ee)) return
        if (!e.hasModel()) return
        const t = e.model(),
          a = document.createElement('div'),
          o = r.createElement(K, {
            onClose: l,
            dateOnly: t.model().mainSeries().isDWM(),
            initialGoToDate: re(),
            initialRanges: ne(e),
            onGoToDate: (e) => {
              !((e, t) => {
                q.setItem('goToDateTabLastPickedDate', String(t.valueOf()))
                if (void 0 === e.model().timeScale().tickMarks().minIndex)
                  return
                const a = (0, i.addLocalTime)(t).valueOf()
                e.model()
                  .gotoTime(a)
                  .then((t) => {
                    const a = e.model().mainSeries()
                    void 0 === t
                      ? a.clearGotoDateResult()
                      : a.setGotoDateResult(t)
                  })
              })(t, e),
                l()
            },
            onGoToRange: (t, a) => {
              !((e, t, a) => {
                const r = (0, X.getTimezoneName)(e.model())
                if (!r) return
                const n = s.linking.interval.value(),
                  o = n && (0, Z.normalizeIntervalString)(n),
                  l = c().get_timezone(r),
                  d = (e) => (0, u.cal_to_utc)(l, new Date(e)),
                  h = (0, i.addLocalTime)(t).valueOf(),
                  m = (0, i.addLocalTime)(a).valueOf(),
                  p = {
                    val: {
                      type: 'time-range',
                      from: d(h) / 1e3,
                      to: d(m) / 1e3,
                    },
                    res: o,
                  }
                e.chartWidgetCollection().setTimeFrame(p)
              })(e, t, a),
                l()
            },
          })
        function l() {
          n.unmountComponentAtNode(a), te.setAsClosed(ee)
        }
        n.render(o, a), te.setAsOpened(ee)
      }
      function re() {
        const e = q.getItemOrDefault('goToDateTabLastPickedDate', null)
        return null === e
          ? (0, i.resetToDayStart)(new Date())
          : new Date(Number(e))
      }
      function ne(e) {
        const t = ((e) => {
          const t = e.model().timeScale(),
            a = t.visibleBarsStrictRange()
          if (null === a) return
          const r = e.model().mainSeries(),
            n = r.nearestIndex(a.firstBar(), $.PlotRowSearchMode.NearestRight),
            s = r.nearestIndex(a.lastBar(), $.PlotRowSearchMode.NearestLeft)
          if (void 0 === n || void 0 === s) return
          return {
            from: (0, o.ensureNotNull)(t.indexToUserTime(n)),
            to: (0, o.ensureNotNull)(t.indexToUserTime(s)),
          }
        })(e)
        return t
          ? {
              from: (0, i.subtractLocalTime)(t.from),
              to: (0, i.subtractLocalTime)(t.to),
            }
          : {
              from: (0, i.subtractLocalTime)(new Date()),
              to: (0, i.subtractLocalTime)(new Date()),
            }
      }
    },
    2948: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M3.92 7.83 9 12.29l5.08-4.46-1-1.13L9 10.29l-4.09-3.6-.99 1.14Z"/></svg>'
    },
    86240: (e) => {
      e.exports = JSON.parse(
        '{"size-header-height":"64px","media-phone-vertical":"screen and (max-width: 479px)","media-mf-phone-landscape":"screen and (min-width: 568px)"}',
      )
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
    52051: (e) => {
      e.exports = {
        ar: ['الأجندة حاليًا في عام {year}'],
        ca_ES: 'Calendar is currently on year {year}',
        cs: 'Calendar is currently on year {year}',
        de: ['Kalender steht derzeit auf Jahr {year}'],
        el: 'Calendar is currently on year {year}',
        en: 'Calendar is currently on year {year}',
        es: ['En este momento el calendario muestra el año {year}'],
        fa: 'Calendar is currently on year {year}',
        fr: ["Le calendrier est actuellement sur l'année {year}"],
        he_IL: ['לוח השנה הוא כרגע בשנה {year}'],
        hu_HU: 'Calendar is currently on year {year}',
        id_ID: ['Kalender saat ini berada pada tahun {year}'],
        it: ["Il calendario è attualmente all'anno {year}"],
        ja: ['カレンダーは現在{year}年です'],
        ko: ['캘린더는 현재 {year} 년입니다.'],
        ms_MY: ['Kalendar sekarang pada tahun {year}'],
        nl_NL: 'Calendar is currently on year {year}',
        pl: ['Kalendarz jest obecnie na roku {year}'],
        pt: ['O calendário está atualmente no ano de {year}'],
        ro: 'Calendar is currently on year {year}',
        ru: ['Сейчас на календаре {year} год'],
        sv: ['Kalendern är för närvarande inställd på år {year}'],
        th: ['ขณะนี้ปฏิทินอยู่ในปี{year}'],
        tr: ['Takvimde şu anda {year} açık'],
        vi: ['Lịch hiện đang ở năm {year}'],
        zh: ['日历目前在{year}年'],
        zh_TW: ['日曆目前在{year}年'],
      }
    },
    99990: (e) => {
      e.exports = {
        ar: ['الأجندة حاليًا في السنوات من {year_start} إلى {year_end}'],
        ca_ES: 'Calendar is currently on years from {year_start} to {year_end}',
        cs: 'Calendar is currently on years from {year_start} to {year_end}',
        de: [
          'Kalender steht derzeit auf den Jahren von {year_start} bis {year_end}',
        ],
        el: 'Calendar is currently on years from {year_start} to {year_end}',
        en: 'Calendar is currently on years from {year_start} to {year_end}',
        es: [
          'En este momento el calendario comprende los años entre {year_start} y {year_end}',
        ],
        fa: 'Calendar is currently on years from {year_start} to {year_end}',
        fr: [
          'Le calendrier est actuellement sur les années de {year_start} à {year_end}',
        ],
        he_IL: ['היומן פועל כעת על שנים מ-{year_start} עד {year_end}'],
        hu_HU: 'Calendar is currently on years from {year_start} to {year_end}',
        id_ID: [
          'Kalender saat ini berada pada tahun dari {year_start} hingga {year_end}',
        ],
        it: [
          'Il calendario è attualmente sugli anni da {year_start} a {year_end}',
        ],
        ja: ['カレンダーは現在{year_start}年から{year_end}年までです'],
        ko: ['캘린더는 현재 {year_start}부터 {year_end}까지 연도입니다.'],
        ms_MY: ['Kalendar sekarang pada tahun dari {year_start} ke {year_end}'],
        nl_NL: 'Calendar is currently on years from {year_start} to {year_end}',
        pl: ['Kalendarz obejmuje obecnie lata od {year_start} do {year_end}'],
        pt: [
          'O calendário está atualmente entre os anos de {year_start} até {year_end}',
        ],
        ro: 'Calendar is currently on years from {year_start} to {year_end}',
        ru: [
          'Сейчас на календаре выбран период с {year_start} до {year_end} года',
        ],
        sv: [
          'Kalendern är för närvarande inställd på år, från {year_start} till {year_end}',
        ],
        th: ['ขณะนี้ปฏิทินเป็นปีตั้งแต่ {year_start} ถึง {year_end}'],
        tr: [
          'Takvim şu anda {year_start} ile {year_end} arasındaki yılları göstermektedir',
        ],
        vi: ['Lịch hiện tại ở các năm từ {year_start} đến {year_end}'],
        zh: ['日历当前是从{year_start}到{year_end}年'],
        zh_TW: ['日曆當前是從{year_start}年到{year_end}年'],
      }
    },
    92702: (e) => {
      e.exports = {
        ar: ['الأجندة حاليًا في شهر {month}'],
        ca_ES: 'Calendar is currently on {month}',
        cs: 'Calendar is currently on {month}',
        de: ['Kalender steht derzeit auf {month}'],
        el: 'Calendar is currently on {month}',
        en: 'Calendar is currently on {month}',
        es: ['En este momento el calendario muestra el mes de {month}'],
        fa: 'Calendar is currently on {month}',
        fr: ['Le calendrier est actuellement sur {month}'],
        he_IL: ['היומן נמצא כרגע ב-{month}'],
        hu_HU: 'Calendar is currently on {month}',
        id_ID: ['Kalender saat ini berada pada bulan {month}'],
        it: ['Il calendario è attualmente su {month}'],
        ja: ['カレンダーは現在{month}月です'],
        ko: ['캘린더는 현재 {month} 입니다.'],
        ms_MY: ['Kalendar sekarang pada {month}'],
        nl_NL: 'Calendar is currently on {month}',
        pl: ['Kalendarz jest obecnie na {month}'],
        pt: ['O calendário está atualmente em {month}'],
        ro: 'Calendar is currently on {month}',
        ru: ['Сейчас на календаре {month}'],
        sv: ['Kalender är för närvarande på {month}'],
        th: ['ขณะนี้ปฏิทินอยู่ที่{month}'],
        tr: ['Takvimde şu an {month} açık'],
        vi: ['Lịch hiện đang ở tháng {month}'],
        zh: ['日历目前在{month}月'],
        zh_TW: ['日曆目前在{month}月'],
      }
    },
    20036: (e) => {
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
    74615: (e) => {
      e.exports = {
        ar: ['نطاق مخصّص'],
        ca_ES: ['Rang personalitzat'],
        cs: 'Custom range',
        de: ['Benutzerdefinierter Bereich'],
        el: 'Custom range',
        en: 'Custom range',
        es: ['Rango personalizado'],
        fa: 'Custom range',
        fr: ['Plage personnalisée'],
        he_IL: ['טווח בהתאמה אישית'],
        hu_HU: 'Custom range',
        id_ID: ['Rentang khusus'],
        it: ['Range personalizzato'],
        ja: ['カスタム範囲'],
        ko: ['커스텀 레인지'],
        ms_MY: ['Julat tersuai'],
        nl_NL: 'Custom range',
        pl: ['Zakres niestandardowy'],
        pt: ['Intervalo personalizado'],
        ro: 'Custom range',
        ru: ['Задать диапазон'],
        sv: ['Välj period'],
        th: ['ระยะบาร์แบบกำหนดเอง'],
        tr: ['Özel aralık'],
        vi: ['Phạm vi tùy chỉnh'],
        zh: ['自定义范围'],
        zh_TW: ['自訂範圍'],
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
    369: (e) => {
      e.exports = {
        ar: ['الذهاب إلى'],
        ca_ES: ['Anar a'],
        cs: 'Go to',
        de: ['Gehe zu'],
        el: 'Go to',
        en: 'Go to',
        es: ['Ir a'],
        fa: ['برو به'],
        fr: ['Aller à'],
        he_IL: ['עבור ל'],
        hu_HU: ['Ugrás ide:'],
        id_ID: ['Menuju ke'],
        it: ['Vai a'],
        ja: ['移動'],
        ko: ['가기'],
        ms_MY: ['Pergi ke'],
        nl_NL: 'Go to',
        pl: ['Idź do...'],
        pt: ['Ir para'],
        ro: 'Go to',
        ru: ['Перейти к дате'],
        sv: ['Gå till'],
        th: ['ไปที่'],
        tr: ['Tarihe git'],
        vi: ['Đến'],
        zh: ['前往到'],
        zh_TW: ['前往到'],
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
    68988: (e) => {
      e.exports = {
        ar: ['موافق'],
        ca_ES: ['Acceptar'],
        cs: 'Ok',
        de: 'Ok',
        el: 'Ok',
        en: 'Ok',
        es: ['Aceptar'],
        fa: 'Ok',
        fr: ["D'accord"],
        he_IL: ['אוקיי'],
        hu_HU: ['Oké'],
        id_ID: 'Ok',
        it: 'Ok',
        ja: ['OK'],
        ko: ['확인'],
        ms_MY: 'Ok',
        nl_NL: 'Ok',
        pl: 'Ok',
        pt: 'Ok',
        ro: 'Ok',
        ru: ['Ок'],
        sv: ['OK'],
        th: ['ตกลง'],
        tr: ['Tamam'],
        vi: 'Ok',
        zh: ['确认'],
        zh_TW: ['確認'],
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
    95543: (e) => {
      e.exports = {
        ar: ['الشهور'],
        ca_ES: ['Mesos'],
        cs: 'Months',
        de: ['Monate'],
        el: 'Months',
        en: 'Months',
        es: ['Meses'],
        fa: 'Months',
        fr: ['Mois'],
        he_IL: ['חודשים'],
        hu_HU: ['Hónapok'],
        id_ID: ['Bulan'],
        it: ['Mesi'],
        ja: ['月'],
        ko: ['달'],
        ms_MY: ['Bulan'],
        nl_NL: 'Months',
        pl: ['Miesiące'],
        pt: ['Meses'],
        ro: 'Months',
        ru: ['Месяцы'],
        sv: ['Månader'],
        th: ['เดือน'],
        tr: ['Aylar'],
        vi: ['Tháng'],
        zh: ['个月'],
        zh_TW: ['個月'],
      }
    },
    41610: (e) => {
      e.exports = {
        ar: ['المزيد'],
        ca_ES: ['Més'],
        cs: ['Více'],
        de: ['Mehr'],
        el: 'More',
        en: 'More',
        es: ['Más'],
        fa: ['بیشتر'],
        fr: ['Plus'],
        he_IL: ['עוד'],
        hu_HU: ['Több'],
        id_ID: ['Lebih lanjut'],
        it: ['Altro'],
        ja: ['詳細'],
        ko: ['더보기'],
        ms_MY: ['Lebih'],
        nl_NL: ['Meer'],
        pl: ['Więcej'],
        pt: ['Mais'],
        ro: 'More',
        ru: ['Ещё'],
        sv: ['Mer'],
        th: ['เพิ่มเติม'],
        tr: ['Daha Fazla'],
        vi: ['Thêm nữa'],
        zh: ['更多'],
        zh_TW: ['更多'],
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
    83771: (e) => {
      e.exports = {
        ar: ['العام القادم'],
        ca_ES: ['Pròxim any'],
        cs: 'Next year',
        de: ['Nächstes Jahr'],
        el: 'Next year',
        en: 'Next year',
        es: ['Próximo año'],
        fa: 'Next year',
        fr: ['Année suivante'],
        he_IL: ['שנה הבאה'],
        hu_HU: 'Next year',
        id_ID: ['Tahun depan'],
        it: ['Anno prossimo'],
        ja: ['翌年'],
        ko: ['다음 해'],
        ms_MY: ['Tahun hadapan'],
        nl_NL: 'Next year',
        pl: ['Następny rok'],
        pt: ['Próximo ano'],
        ro: 'Next year',
        ru: ['Следующий год'],
        sv: ['Nästa år'],
        th: ['ปีถัดไป'],
        tr: ['Sonraki yıl'],
        vi: ['Năm sau'],
        zh: ['下一年'],
        zh_TW: ['明年'],
      }
    },
    75385: (e) => {
      e.exports = {
        ar: ['السنوات القادمة'],
        ca_ES: ['Pròxims anys'],
        cs: 'Next years',
        de: ['Nächste Jahre'],
        el: 'Next years',
        en: 'Next years',
        es: ['Próximos años'],
        fa: 'Next years',
        fr: ['Années suivantes'],
        he_IL: ['שנים הבאות'],
        hu_HU: 'Next years',
        id_ID: ['Tahun mendatang'],
        it: ['Anni prossimi'],
        ja: ['次の年'],
        ko: ['다음 해들'],
        ms_MY: ['Tahun-tahun hadapan'],
        nl_NL: 'Next years',
        pl: ['Następne lata'],
        pt: ['Próximos anos'],
        ro: 'Next years',
        ru: ['Следующие годы'],
        sv: ['Kommande år'],
        th: ['ปีถัดไป'],
        tr: ['Sonraki yıllar'],
        vi: ['Năm sau'],
        zh: ['未来几年'],
        zh_TW: ['未來幾年'],
      }
    },
    39752: (e) => {
      e.exports = {
        ar: ['الشهر القادم'],
        ca_ES: ['Pròxim mes'],
        cs: 'Next month',
        de: ['Nächster Monat'],
        el: 'Next month',
        en: 'Next month',
        es: ['Próximo mes'],
        fa: 'Next month',
        fr: ['Mois suivant'],
        he_IL: ['חודש הבא'],
        hu_HU: 'Next month',
        id_ID: ['Bulan depan'],
        it: ['Mese prossimo'],
        ja: ['翌月'],
        ko: ['다음 달'],
        ms_MY: ['Bulan hadapan'],
        nl_NL: 'Next month',
        pl: ['Następny miesiąc'],
        pt: ['Próximo mês'],
        ro: 'Next month',
        ru: ['Следующий месяц'],
        sv: ['Nästa månad'],
        th: ['เดือนถัดไป'],
        tr: ['Sonraki ay'],
        vi: ['Tháng sau'],
        zh: ['下一个月'],
        zh_TW: ['下個月'],
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
    83583: (e) => {
      e.exports = {
        ar: ['قم بالتبديل إلى الأشهر'],
        ca_ES: ['Canvieu a mesos'],
        cs: 'Switch to months',
        de: ['Zu Monaten wechseln'],
        el: 'Switch to months',
        en: 'Switch to months',
        es: ['Cambie a meses'],
        fa: 'Switch to months',
        fr: ['Passer en mois'],
        he_IL: ['עבור לחודשים'],
        hu_HU: 'Switch to months',
        id_ID: ['Beralih ke bulan'],
        it: ['Passa ai mesi'],
        ja: ['月に切り替え'],
        ko: ['달로 바꾸기'],
        ms_MY: ['Tukar ke bulan'],
        nl_NL: 'Switch to months',
        pl: ['Przełącz na miesiące'],
        pt: ['Mudar para meses'],
        ro: 'Switch to months',
        ru: ['Переключиться на месяцы'],
        sv: ['Byt till månader'],
        th: ['เปลี่ยนเป็นเดือน'],
        tr: ['Ay düzenine geç'],
        vi: ['Chuyển sang tháng'],
        zh: ['切换到月'],
        zh_TW: ['切換到月份'],
      }
    },
    6244: (e) => {
      e.exports = {
        ar: ['التبديل إلى التواريخ'],
        ca_ES: ['Canvieu a dates'],
        cs: 'Switch to dates',
        de: ['Zu Daten wechseln'],
        el: 'Switch to dates',
        en: 'Switch to dates',
        es: ['Cambie a fechas'],
        fa: 'Switch to dates',
        fr: ['Passer en dates'],
        he_IL: ['עבור לתאריכים'],
        hu_HU: 'Switch to dates',
        id_ID: ['Beralih ke tanggal'],
        it: ['Passa alle date'],
        ja: ['日に切り替え'],
        ko: ['날짜로 바꾸기'],
        ms_MY: ['Tukar ke tarikh'],
        nl_NL: 'Switch to dates',
        pl: ['Przełącz na daty'],
        pt: ['Mudar para datas'],
        ro: 'Switch to dates',
        ru: ['Переключиться на даты'],
        sv: ['Byt till datum'],
        th: ['เปลี่ยนเป็นวัน'],
        tr: ['Tarih düzenine geç'],
        vi: ['Chuyển sang ngày tháng'],
        zh: ['切换到日期'],
        zh_TW: ['切換到日期'],
      }
    },
    80879: (e) => {
      e.exports = {
        ar: ['التحول إلى السنوات'],
        ca_ES: ['Canvieu a anys'],
        cs: 'Switch to years',
        de: ['Zu Jahren wechseln'],
        el: 'Switch to years',
        en: 'Switch to years',
        es: ['Cambie a años'],
        fa: 'Switch to years',
        fr: ['Passer en années'],
        he_IL: ['עבור לשנים'],
        hu_HU: 'Switch to years',
        id_ID: ['Beralih ke tahun'],
        it: ['Passa agli anni'],
        ja: ['年に切り替え'],
        ko: ['해로 바꾸기'],
        ms_MY: ['Tukar ke tahun'],
        nl_NL: 'Switch to years',
        pl: ['Przełącz na lata'],
        pt: ['Mudar para anos'],
        ro: 'Switch to years',
        ru: ['Переключиться на годы'],
        sv: ['Byt till år'],
        th: ['เปลี่ยนเป็นปี'],
        tr: ['Yıl düzenine geç'],
        vi: ['Chuyển sang năm'],
        zh: ['切换到年'],
        zh_TW: ['切換到年'],
      }
    },
    32457: (e) => {
      e.exports = {
        ar: ['الرجاء إدخال التاريخ بالشكل الصحيح'],
        ca_ES: ['Intoduïu la data correcta'],
        cs: 'Please enter the right date',
        de: ['Bitte geben Sie das richtige Datum ein'],
        el: 'Please enter the right date',
        en: 'Please enter the right date',
        es: ['Introduzca la fecha correcta'],
        fa: 'Please enter the right date',
        fr: ['Veuillez saisir la bonne date'],
        he_IL: ['אנא הזן את התאריך הנכון'],
        hu_HU: 'Please enter the right date',
        id_ID: ['Harap masukkan tanggal yang tepat'],
        it: ['Inserisci la data corretta'],
        ja: ['適切な日付を入力して下さい'],
        ko: ['올바른 날짜를 넣으십시오'],
        ms_MY: ['Sila masukkan tarikh yang betul'],
        nl_NL: 'Please enter the right date',
        pl: ['Wprowadź prawidłową datę'],
        pt: ['Por favor, insira a data correta'],
        ro: 'Please enter the right date',
        ru: ['Введите правильную дату'],
        sv: ['Vänligen ange rätt datum'],
        th: ['กรุณาใส่วันที่ที่ถูกต้อง'],
        tr: ['Lütfen doğru tarihi girin'],
        vi: ['Vui lòng nhập đúng ngày'],
        zh: ['请输入正确的日期'],
        zh_TW: ['請輸入正確的日期'],
      }
    },
    5122: (e) => {
      e.exports = {
        ar: ['الرجاء إدخال التاريخ بالشكل الصحيح يوم- شهر- سنة'],
        ca_ES: ['Escriviu el format de data correcte: aaaa-mm-dd'],
        cs: 'Please enter the right date format yyyy-mm-dd',
        de: ['Bitte geben Sie das korrekte Datumsformat ein yyyy-mm-dd'],
        el: 'Please enter the right date format yyyy-mm-dd',
        en: 'Please enter the right date format yyyy-mm-dd',
        es: ['Escriba el formato de fecha correcto aaaa-mm-dd'],
        fa: 'Please enter the right date format yyyy-mm-dd',
        fr: ['Veuillez entrer le bon format de date aaaa-mm-jj'],
        he_IL: ['נא הזן את פורמט התאריך הנכון yyyy-mm-dd'],
        hu_HU: 'Please enter the right date format yyyy-mm-dd',
        id_ID: ['Harap masukkan format tanggal yang benar yyyy-mm-dd'],
        it: ['Inserisci la data nel formato corretto: aaaa-mm-gg'],
        ja: ['正しい日付の形式 (yyyy-mm-dd) を入力してください'],
        ko: ['올바른 날짜 포맷인 yyyy-mm-dd 으로 넣으십시오'],
        ms_MY: ['Sila masukkan format tarikh yang betul yyyy-mm-dd'],
        nl_NL: 'Please enter the right date format yyyy-mm-dd',
        pl: ['Wprowadź datę w formacie rrrr-mm-dd'],
        pt: ['Por favor, insira o formato de data correto aaaa-mm-dd'],
        ro: 'Please enter the right date format yyyy-mm-dd',
        ru: ['Укажите правильный формат даты — гггг-мм-дд'],
        sv: ['Vänligen ange rätt datumformat yyyy-mm-dd'],
        th: ['กรุณาใส่วันที่ถูกตัองในรูปแบบ ปี-เดือน-วัน'],
        tr: ['Lütfen doğru formatta tarih girin yyyy-aa-gg'],
        vi: ['Vui lòng hãy nhập đúng định dạng ngày tháng năm-tháng-ngày'],
        zh: ['请输入正确的日期格式 yyyy-mm-dd'],
        zh_TW: ['請輸入正確的日期格式 yyyy-mm-dd'],
      }
    },
    2587: (e) => {
      e.exports = {
        ar: ['الشهر السابق'],
        ca_ES: ['Mes anterior'],
        cs: 'Previous month',
        de: ['Vorheriger Monat'],
        el: 'Previous month',
        en: 'Previous month',
        es: ['Mes anterior'],
        fa: 'Previous month',
        fr: ['Mois précédent'],
        he_IL: ['חודש שעבר'],
        hu_HU: 'Previous month',
        id_ID: ['Bulan sebelumnya'],
        it: ['Mese passato'],
        ja: ['前月'],
        ko: ['앞 달'],
        ms_MY: ['Bulan sebelumnya'],
        nl_NL: 'Previous month',
        pl: ['Poprzedni miesiąc'],
        pt: ['Mês anterior'],
        ro: 'Previous month',
        ru: ['Предыдущий месяц'],
        sv: ['Förra månaden'],
        th: ['เดือนก่อนหน้านี้'],
        tr: ['Önceki ay'],
        vi: ['Tháng trước'],
        zh: ['上一个月'],
        zh_TW: ['上個月'],
      }
    },
    39329: (e) => {
      e.exports = {
        ar: ['السنة الماضية'],
        ca_ES: ['Any anterior'],
        cs: 'Previous year',
        de: ['Vorheriges Jahr'],
        el: 'Previous year',
        en: 'Previous year',
        es: ['Año anterior'],
        fa: 'Previous year',
        fr: ['Année précédente'],
        he_IL: ['שנה קודמת'],
        hu_HU: 'Previous year',
        id_ID: ['Tahun sebelumnya'],
        it: ['Anno passato'],
        ja: ['前年'],
        ko: ['앞 해'],
        ms_MY: ['Tahun sebelumnya'],
        nl_NL: 'Previous year',
        pl: ['Poprzedni rok'],
        pt: ['Ano anterior'],
        ro: 'Previous year',
        ru: ['Предыдущий год'],
        sv: ['Förra året'],
        th: ['ปีก่อนหน้า'],
        tr: ['Önceki yıl'],
        vi: ['Năm trước'],
        zh: ['上一年'],
        zh_TW: ['去年'],
      }
    },
    27004: (e) => {
      e.exports = {
        ar: ['السنوات السابقة'],
        ca_ES: ['Anys anteriors'],
        cs: 'Previous years',
        de: ['Frühere Jahre'],
        el: 'Previous years',
        en: 'Previous years',
        es: ['Años anteriores'],
        fa: 'Previous years',
        fr: ['Années précédentes'],
        he_IL: ['שנים קודמות'],
        hu_HU: 'Previous years',
        id_ID: ['Tahun-tahun sebelumnya'],
        it: ['Anni passati'],
        ja: ['前の年'],
        ko: ['앞선 해들'],
        ms_MY: ['Tahun-tahun sebelumnya'],
        nl_NL: 'Previous years',
        pl: ['Poprzedni rok'],
        pt: ['Anos anteriores'],
        ro: 'Previous years',
        ru: ['Предыдущие годы'],
        sv: ['Föregående år'],
        th: ['ปีก่อนหน้านี้'],
        tr: ['Önceki yıllar'],
        vi: ['Năm trước'],
        zh: ['往年'],
        zh_TW: ['昔年'],
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
    69325: (e) => {
      e.exports = {
        ar: ['الأعوام'],
        ca_ES: ['Anys'],
        cs: 'Years',
        de: ['Jahre'],
        el: 'Years',
        en: 'Years',
        es: ['Años'],
        fa: 'Years',
        fr: ['Années'],
        he_IL: ['שנים'],
        hu_HU: 'Years',
        id_ID: ['Tahun'],
        it: ['Anni'],
        ja: ['年'],
        ko: ['해'],
        ms_MY: ['Tahun'],
        nl_NL: 'Years',
        pl: ['Lata'],
        pt: ['Anos'],
        ro: 'Years',
        ru: ['Годы'],
        sv: ['År'],
        th: ['ปี'],
        tr: ['Yıllar'],
        vi: ['Năm'],
        zh: ['年'],
        zh_TW: ['年'],
      }
    },
  },
])
