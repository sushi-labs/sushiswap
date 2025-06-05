;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9389],
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
    693676: (e) => {
      e.exports = {
        wrapper: 'wrapper-RoaZjf69',
        select: 'select-RoaZjf69',
        selectMenu: 'selectMenu-RoaZjf69',
        title: 'title-RoaZjf69',
      }
    },
    972404: (e) => {
      e.exports = {
        dateTimeWrapper: 'dateTimeWrapper-Dg2Jb5Mv',
        containerDatePicker: 'containerDatePicker-Dg2Jb5Mv',
        dateInputContainer: 'dateInputContainer-Dg2Jb5Mv',
        dateInput: 'dateInput-Dg2Jb5Mv',
        dateInputIcon: 'dateInputIcon-Dg2Jb5Mv',
      }
    },
    203674: (e) => {
      e.exports = { informer: 'informer-iBPUmjfh' }
    },
    482782: (e) => {
      e.exports = { wrapper: 'wrapper-eYAfVbpw' }
    },
    782430: (e) => {
      e.exports = {
        container: 'container-yrIMi47q',
        title: 'title-yrIMi47q',
        title_normal: 'title_normal-yrIMi47q',
        icon: 'icon-yrIMi47q',
        text: 'text-yrIMi47q',
        text_large: 'text_large-yrIMi47q',
        action: 'action-yrIMi47q',
      }
    },
    959189: (e, t, n) => {
      function a(e, t) {
        return (
          t ||
          null == e ||
          (('string' == typeof e || Array.isArray(e)) && 0 === e.length)
        )
      }
      n.d(t, { isIconOnly: () => a })
    },
    898237: (e, t, n) => {
      n.d(t, { LightAnchorButton: () => s, LightButton: () => r.LightButton })
      var a = n(418920),
        r = n(943158),
        i = n(50959),
        o = n(591365),
        c = n(273388)
      function s(e) {
        const {
            className: t,
            isSelected: n,
            children: r,
            startIcon: s,
            iconOnly: l,
            ellipsis: u,
            showCaret: p,
            forceDirection: m,
            endIcon: d,
            color: h,
            variant: g,
            reference: v,
            size: y,
            enableActiveStateStyles: b,
            renderComponent: D = o.CustomComponentDefaultLink,
            typography: k,
            textWrap: f = !1,
            maxLines: C,
            style: w = {},
            ...x
          } = e,
          I = f ? (null != C ? C : 2) : 1,
          O = I > 0 ? { ...w, '--ui-lib-light-button-content-max-lines': I } : w
        return i.createElement(
          D,
          {
            ...x,
            className: (0, a.useLightButtonClasses)({
              className: t,
              isSelected: n,
              children: r,
              startIcon: s,
              iconOnly: l,
              showCaret: p,
              forceDirection: m,
              endIcon: d,
              color: h,
              variant: g,
              size: y,
              enableActiveStateStyles: b,
              typography: k,
              textWrap: f,
              isLink: !0,
            }),
            reference: (0, c.isomorphicRef)(v),
            style: O,
          },
          i.createElement(
            a.LightButtonContent,
            {
              showCaret: p,
              startIcon: s,
              endIcon: d,
              iconOnly: l,
              ellipsis: u,
              textWrap: f,
            },
            r,
          ),
        )
      }
    },
    418920: (e, t, n) => {
      n.d(t, { LightButtonContent: () => g, useLightButtonClasses: () => h })
      var a = n(50959),
        r = n(497754),
        i = n(601198),
        o = n(72571),
        c = n(234539),
        s = n(959189),
        l = n(380327)
      const u = a.createContext({ isInButtonGroup: !1, isGroupPrimary: !1 })
      var p = n(602948),
        m = n(758222),
        d = n.n(m)
      const h = (e, t) => {
        const n = (0, a.useContext)(c.CustomBehaviourContext),
          i = (0, a.useContext)(l.ControlGroupContext),
          { isInButtonGroup: o, isGroupPrimary: p } = (0, a.useContext)(u),
          {
            className: m,
            isSelected: h,
            children: g,
            startIcon: v,
            showCaret: y,
            endIcon: b,
            forceDirection: D,
            iconOnly: k,
            color: f = 'gray',
            variant: C = 'primary',
            size: w = 'medium',
            enableActiveStateStyles: x = n.enableActiveStateStyles,
            typography: I,
            isLink: O = !1,
            textWrap: E,
            isPills: Y,
            isActive: Q,
          } = e,
          S =
            d()[
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
              })(w, h || Y, I || void 0)}`
            ]
        return r(
          m,
          d()['light-button'],
          O && d().link,
          Q && d().active,
          h && d().selected,
          (0, s.isIconOnly)(g, k) && d()['no-content'],
          v && d()['with-start-icon'],
          (y || b) && d()['with-end-icon'],
          t && d()['with-grouped'],
          D && d()[`force-direction-${D}`],
          d()[`variant-${p ? 'primary' : C}`],
          d()[`color-${p ? 'gray' : f}`],
          d()[`size-${w}`],
          S,
          !x && d()['disable-active-state-styles'],
          i.isGrouped && d().grouped,
          E && d().wrap,
          o && d()['disable-active-on-touch'],
          Y && d().pills,
        )
      }
      function g(e) {
        const {
          startIcon: t,
          endIcon: n,
          showCaret: c,
          iconOnly: l,
          ellipsis: u = !0,
          textWrap: m,
          tooltipText: h,
          children: g,
        } = e
        return a.createElement(
          a.Fragment,
          null,
          t && a.createElement(o.Icon, { className: d().icon, icon: t }),
          !(0, s.isIconOnly)(g, l) &&
            a.createElement(
              'span',
              {
                className: r(
                  d().content,
                  !m && d().nowrap,
                  'apply-overflow-tooltip',
                  'apply-overflow-tooltip--check-children-recursively',
                  'apply-overflow-tooltip--allow-text',
                ),
                'data-overflow-tooltip-text':
                  null != h ? h : (0, i.getTextForTooltip)(g),
              },
              m || u
                ? a.createElement(
                    a.Fragment,
                    null,
                    a.createElement(
                      'span',
                      {
                        className: r(
                          !m && u && d()['ellipsis-container'],
                          m && d()['text-wrap-container'],
                          m && u && d()['text-wrap-with-ellipsis'],
                        ),
                      },
                      g,
                    ),
                    a.createElement(
                      'span',
                      { className: d()['visually-hidden'], 'aria-hidden': !0 },
                      g,
                    ),
                  )
                : a.createElement(
                    a.Fragment,
                    null,
                    g,
                    a.createElement(
                      'span',
                      { className: d()['visually-hidden'], 'aria-hidden': !0 },
                      g,
                    ),
                  ),
            ),
          (n || c) &&
            ((e) =>
              a.createElement(o.Icon, {
                className: r(d().icon, e.showCaret && d().caret),
                icon: e.showCaret ? p : e.endIcon,
              }))(e),
        )
      }
    },
    943158: (e, t, n) => {
      n.d(t, { LightButton: () => o })
      var a = n(50959),
        r = n(380327),
        i = n(418920)
      function o(e) {
        const { isGrouped: t } = a.useContext(r.ControlGroupContext),
          {
            reference: n,
            className: o,
            isSelected: c,
            children: s,
            startIcon: l,
            iconOnly: u,
            ellipsis: p,
            showCaret: m,
            forceDirection: d,
            endIcon: h,
            color: g,
            variant: v,
            size: y,
            enableActiveStateStyles: b,
            typography: D,
            textWrap: k = !1,
            maxLines: f,
            style: C = {},
            isPills: w,
            isActive: x,
            tooltipText: I,
            ...O
          } = e,
          E = k ? (null != f ? f : 2) : 1,
          Y = E > 0 ? { ...C, '--ui-lib-light-button-content-max-lines': E } : C
        return a.createElement(
          'button',
          {
            ...O,
            className: (0, i.useLightButtonClasses)(
              {
                className: o,
                isSelected: c,
                children: s,
                startIcon: l,
                iconOnly: u,
                showCaret: m,
                forceDirection: d,
                endIcon: h,
                color: g,
                variant: v,
                size: y,
                enableActiveStateStyles: b,
                typography: D,
                textWrap: k,
                isPills: w,
                isActive: x,
              },
              t,
            ),
            ref: n,
            style: Y,
          },
          a.createElement(
            i.LightButtonContent,
            {
              showCaret: m,
              startIcon: l,
              endIcon: h,
              iconOnly: u,
              ellipsis: p,
              textWrap: k,
              tooltipText: I,
            },
            s,
          ),
        )
      }
    },
    234539: (e, t, n) => {
      n.d(t, { CustomBehaviourContext: () => a })
      const a = (0, n(50959).createContext)({ enableActiveStateStyles: !0 })
      a.displayName = 'CustomBehaviourContext'
    },
    657947: (e, t, n) => {
      n.d(t, { DurationControl: () => I })
      var a = n(609838),
        r = n(50959),
        i = n(481330),
        o = n(466052),
        c = n(529631),
        s = n(192063),
        l = n(518799),
        u = n(930052),
        p = n(996038),
        m = n(350324),
        d = n(493173),
        h = n(44807),
        g = n(508550),
        v = n(614793),
        y = n(972404)
      const b = new Date(new Date().setHours(0, 0, 0, 0))
      const D = (0, d.mergeThemes)(m.DEFAULT_INPUT_DATE_THEME, {
        container: y.dateInputContainer,
        date: y.dateInput,
        icon: y.dateInputIcon,
      })
      function k(e) {
        return r.createElement(m.DateInput, { ...e, theme: D })
      }
      function f(e) {
        const {
          initDateTime: t,
          onDateSelect: n,
          onTimeSelect: a,
          onControlFocused: i,
          hasDatePicker: o,
          hasTimePicker: c,
          showErrorMessages: s,
          onError: l,
          revertInvalidData: u,
        } = e
        if (
          ((0, r.useEffect)(() => () => (null == l ? void 0 : l(!1)), []),
          !o && !c)
        )
          return r.createElement(r.Fragment, null)
        const p = () => {
          null == i || i()
        }
        return r.createElement(
          'div',
          { className: y.dateTimeWrapper },
          o &&
            r.createElement(v.DatePicker, {
              containerClassName: y.containerDatePicker,
              minDate: b,
              initial: t,
              onPick: (e) => {
                if (null === e) return null == l ? void 0 : l(!0)
                n(e), null == l || l(!1)
              },
              onFocus: p,
              InputComponent: k,
              showErrorMessages: s,
              revertInvalidData: u,
            }),
          c &&
            r.createElement(h.TimeInput, {
              value:
                ((m = t),
                (0, g.twoDigitsFormat)(m.getHours()) +
                  ':' +
                  (0, g.twoDigitsFormat)(m.getMinutes())),
              onChange: (e) => {
                a(
                  ((e) => {
                    const [t, n] = e.split(':'),
                      a = new Date()
                    return a.setHours(Number(t), Number(n)), a
                  })(e),
                )
              },
              onFocus: p,
            }),
        )
        var m
      }
      var C = n(693676)
      const w = new o.Delegate()
      function x(e, t) {
        return Date.UTC(
          e.getFullYear(),
          e.getMonth(),
          e.getDate(),
          t.getUTCHours(),
          t.getUTCMinutes(),
        )
      }
      function I(e) {
        const {
            currentDuration: t,
            durationMetaInfoList: o,
            onDurationChanged: s,
            onControlFocused: m,
            showErrorMessages: d,
            revertInvalidData: h,
            onError: g,
          } = e,
          v = (0, i.findDurationMetaInfo)(o, t.type)
        if (void 0 === v) return null
        const y = (0, r.useMemo)(
            () =>
              void 0 !== t.datetime
                ? new Date(t.datetime)
                : ['GTT', 'GTD'].includes(t.type)
                  ? (0, i.makeDatePlus24UTCHours)()
                  : new Date(),
            [t.datetime, t.type],
          ),
          b = (0, r.useMemo)(
            () => o.map((e) => ({ content: e.name, value: e.value })),
            [o],
          ),
          D = b.length < 2
        function k(e) {
          return r.createElement(c.Select, {
            onClick: m,
            className: C.select,
            menuClassName: e ? C.selectMenu : void 0,
            value: null == v ? void 0 : v.value,
            items: b,
            'data-name': 'duration-type-selector',
            disabled: D,
            hideArrowButton: D,
            onChange: I,
            stretch: !0,
            matchButtonAndListboxWidths: !0,
          })
        }
        return r.createElement(
          u.MatchMedia,
          { rule: p.DialogBreakpoints.TabletSmall },
          (e) =>
            r.createElement(
              'div',
              { className: C.wrapper },
              r.createElement(
                'span',
                { className: C.title },
                a.t(null, void 0, n(768877)),
              ),
              e
                ? r.createElement(l.ToolWidgetMenu, {
                    className: C.menuButton,
                    content: k(e),
                    arrow: !1,
                    children: r.createElement(O, {
                      menuItems: b,
                      onTypeSelect: I,
                    }),
                    isDrawer: !0,
                    isDisabled: D,
                    closeOnClickOutside: !0,
                  })
                : k(e),
              r.createElement(f, {
                initDateTime: y,
                hasDatePicker: v.hasDatePicker,
                hasTimePicker: v.hasTimePicker,
                onControlFocused: m,
                onDateSelect: Y,
                onTimeSelect: E,
                revertInvalidData: h,
                showErrorMessages: d,
                onError: g,
              }),
            ),
        )
        function I(n) {
          const a = { type: n },
            r = (0, i.findDurationMetaInfo)(o, n)
          void 0 !== r &&
            (r.hasDatePicker || r.hasTimePicker) &&
            (a.datetime =
              t.datetime ||
              (0, i.getTimestamp)((0, i.makeDatePlus24UTCHours)())),
            s(a),
            (() => {
              void 0 !== e.onClose && e.onClose()
              w.fire()
            })()
        }
        function E(t) {
          const n = x(y, t)
          e.onDurationChanged({ type: e.currentDuration.type, datetime: n })
        }
        function Y(t) {
          const n = x(t, y)
          e.onDurationChanged({ type: e.currentDuration.type, datetime: n })
        }
      }
      function O(e) {
        const { menuItems: t, onTypeSelect: n } = e
        return r.createElement(
          r.Fragment,
          null,
          Object.values(t).map((e) => {
            var t
            return r.createElement(s.PopupMenuItem, {
              key: e.value,
              label: null !== (t = e.content) && void 0 !== t ? t : e.value,
              onClick: n,
              onClickArg: e.value,
            })
          }),
        )
      }
    },
    853177: (e, t, n) => {
      n.d(t, { TradingPanelWarningInformersContainer: () => d })
      var a = n(50959),
        r = n(815544),
        i = n(38323)
      var o = n(586639),
        c = n(609838),
        s = n(918460)
      var l = n(661851),
        u = n(203674)
      function p(e) {
        const { warningMessageSource: t, isCloseButtonShown: p = !0 } = e,
          [m, d] = (0, a.useState)(),
          [h, g, v] = ((e) => {
            const [t, n] = (0, a.useState)(e)
            return [
              t,
              (0, a.useCallback)(() => n(!1), []),
              (0, a.useCallback)(() => n(!0), []),
            ]
          })(!0),
          y = (0, a.useCallback)((e) => {
            d(e), v()
          }, []),
          b = (0, a.useMemo)(() => {
            return (e = t) &&
              (e instanceof r.Observable ||
                ((0, i.isFunction)(e.lift) && (0, i.isFunction)(e.subscribe)))
              ? t
              : (0, o.of)(t)
            var e
          }, [t])
        return (
          (0, l.useObservableSubscription)(b, y),
          h && void 0 !== m && '' !== m
            ? a.createElement(s.Informer, {
                content: m,
                header: c.t(null, void 0, n(697174)),
                informerIntent: 'warning',
                isCloseButtonShown: p,
                className: u.informer,
                onCloseClick: g,
              })
            : a.createElement(a.Fragment, null)
        )
      }
      var m = n(482782)
      function d(e) {
        const { warningInformersItems: t } = e
        return 0 === t.length
          ? a.createElement(a.Fragment, null)
          : a.createElement(
              'div',
              { className: m.wrapper },
              t.map((e) => a.createElement(p, { key: e.id, ...e })),
            )
      }
    },
    662941: (e, t, n) => {
      n.d(t, { EmptyStateBlock: () => s })
      var a = n(50959),
        r = n(497754),
        i = n.n(r),
        o = n(782430)
      function c(e) {
        const { title: t, tagName: n, titleSize: r } = e,
          c = n || 'strong'
        return a.createElement(
          c,
          { className: i()(o.title, o[`title_${r}`]) },
          t,
        )
      }
      function s(e) {
        return a.createElement(
          'div',
          { className: r(o.container, e.className) },
          a.createElement('div', { className: r(o.icon, e.iconClass) }),
          e.title &&
            a.createElement(c, {
              title: e.title,
              titleSize: e.titleSize,
              tagName: e.titleTagName,
            }),
          e.text &&
            a.createElement(
              'div',
              { className: r(o.text, 'large' === e.textSize && o.text_large) },
              e.text,
            ),
          e.action &&
            a.createElement(
              'div',
              {
                className: o.action,
              },
              e.action,
            ),
        )
      }
    },
    493173: (e, t, n) => {
      function a(e, t, n = {}) {
        return Object.assign(
          {},
          e,
          ((e, t, n = {}) => {
            const a = Object.assign({}, t)
            for (const r of Object.keys(t)) {
              const i = n[r] || r
              i in e && (a[r] = [e[i], t[r]].join(' '))
            }
            return a
          })(e, t, n),
        )
      }
      n.d(t, { mergeThemes: () => a })
    },
  },
])
