;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5380],
  {
    323428: (e) => {
      e.exports = {
        button: 'button-PYEOTd6i',
        disabled: 'disabled-PYEOTd6i',
        hidden: 'hidden-PYEOTd6i',
        icon: 'icon-PYEOTd6i',
        dropped: 'dropped-PYEOTd6i',
      }
    },
    348535: (e) => {
      e.exports = {
        container: 'container-TCHLKPuQ',
        'container-danger': 'container-danger-TCHLKPuQ',
        'light-title': 'light-title-TCHLKPuQ',
        'light-icon': 'light-icon-TCHLKPuQ',
        icon: 'icon-TCHLKPuQ',
        header: 'header-TCHLKPuQ',
        'light-container-danger': 'light-container-danger-TCHLKPuQ',
        'container-warning': 'container-warning-TCHLKPuQ',
        'light-container-warning': 'light-container-warning-TCHLKPuQ',
        'container-success': 'container-success-TCHLKPuQ',
        'light-container-success': 'light-container-success-TCHLKPuQ',
        'container-default': 'container-default-TCHLKPuQ',
        'light-container-default': 'light-container-default-TCHLKPuQ',
        'text-wrap': 'text-wrap-TCHLKPuQ',
        'light-text-wrap': 'light-text-wrap-TCHLKPuQ',
        'close-button': 'close-button-TCHLKPuQ',
        'light-close-button': 'light-close-button-TCHLKPuQ',
        informerBody: 'informerBody-TCHLKPuQ',
        mainProblem: 'mainProblem-TCHLKPuQ',
        'header-inline': 'header-inline-TCHLKPuQ',
        'header-new-line': 'header-new-line-TCHLKPuQ',
      }
    },
    794476: (e) => {
      e.exports = { wrapper: 'wrapper-HLS9OacM', help: 'help-HLS9OacM' }
    },
    573113: (e) => {
      e.exports = {
        menuButton: 'menuButton-xw2UKKgr',
        select: 'select-xw2UKKgr',
        selectMenu: 'selectMenu-xw2UKKgr',
        title: 'title-xw2UKKgr',
        titleWithError: 'titleWithError-xw2UKKgr',
      }
    },
    366986: (e) => {
      e.exports = {
        button: 'button-tFul0OhX',
        'button-children': 'button-children-tFul0OhX',
        hiddenArrow: 'hiddenArrow-tFul0OhX',
        invisibleFocusHandler: 'invisibleFocusHandler-tFul0OhX',
      }
    },
    760673: (e) => {
      e.exports = { placeholder: 'placeholder-V6ceS6BN' }
    },
    942544: (e, t, n) => {
      n.d(t, { useControlDisclosure: () => l })
      var o = n(772069)
      function l(e) {
        const { intent: t, highlight: n, ...l } = e,
          { isFocused: a, ...r } = (0, o.useDisclosure)(l)
        return {
          ...r,
          isFocused: a,
          highlight: null != n ? n : a,
          intent: null != t ? t : a ? 'primary' : 'default',
        }
      }
    },
    918460: (e, t, n) => {
      n.d(t, { Informer: () => b })
      var o = n(50959),
        l = n(497754),
        a = n(72571),
        r = n(389986),
        s = n(800417),
        i = n(530162),
        c = n(527941),
        u = n(499084),
        d = n(348535),
        h = n.n(d)
      const m = { danger: i, warning: i, success: u, default: c }
      function b(e) {
        const {
          informerIntent: t,
          content: n,
          className: i,
          header: c,
          isIconShown: u = !0,
          isCloseButtonShown: d,
          icon: b,
          onCloseClick: p,
          closeButtonLabel: v = 'Close',
          headerPlacement: g = 'inline',
          children: f,
          isLight: C,
        } = e
        return o.createElement(
          'div',
          {
            className: l(
              h().container,
              h()[`container-${t}`],
              C && h()[`light-container-${t}`],
              i,
            ),
            ...(0, s.filterDataProps)(e),
            ...(0, s.filterAriaProps)(e),
          },
          o.createElement(
            'div',
            { className: h().informerBody },
            n &&
              o.createElement(
                'div',
                { className: h().mainProblem },
                u &&
                  o.createElement(a.Icon, {
                    className: l(h().icon, C && h()['light-icon']),
                    icon: null != b ? b : m[t],
                  }),
                o.createElement(
                  'div',
                  {
                    className: l(h()['text-wrap'], C && h()['light-text-wrap']),
                  },
                  c &&
                    o.createElement(
                      'span',
                      {
                        className: l(
                          C && h()['light-title'],
                          h().header,
                          h()[`header-${C ? 'new-line' : g}`],
                        ),
                      },
                      c,
                    ),
                  o.createElement('span', null, ' ', n),
                ),
              ),
            f,
          ),
          d &&
            o.createElement(r.CloseButton, {
              'aria-label': v,
              onClick: p,
              className: l(C && h()['light-close-button'], h()['close-button']),
              size: C ? 'xxsmall' : 'xsmall',
              preservePaddings: !C,
            }),
        )
      }
    },
    165962: (e, t, n) => {
      n.d(t, { CheckboxCustomField: () => c })
      var o = n(50959),
        l = n(302946),
        a = (n(500962), n(661851))
      const r = o.lazy(async () => ({
        default: (
          await Promise.all([n.e(4578), n.e(6937), n.e(4010)]).then(
            n.bind(n, 913894),
          )
        ).TradingInformerImpl,
      }))
      function s(e) {
        const { informerMessage: t, className: n } = e
        return o.createElement(
          o.Suspense,
          { fallback: null },
          o.createElement(r, { className: n, informerMessage: t }),
        )
      }
      var i = n(794476)
      function c(e) {
        const {
            title: t,
            help: n,
            disabled: r,
            checked$: c,
            getChecked: u,
            setChecked: d,
            onControlFocused: h,
          } = e,
          m = (0, a.useObservable)(c, u())
        return o.createElement(
          'div',
          {
            className: i.wrapper,
            onFocus: () => {
              null == h || h.fire()
            },
          },
          o.createElement(l.Checkbox, {
            label: t,
            checked: m,
            onChange: () => {
              d(!m)
            },
            disabled: r,
          }),
          void 0 !== n &&
            '' !== n &&
            o.createElement(s, { informerMessage: n, className: i.help }),
        )
      }
    },
    587374: (e, t, n) => {
      n.d(t, { CustomComboboxContainer: () => C })
      var o = n(50959),
        l = n(609838),
        a = n(497754),
        r = n.n(a),
        s = n(529631),
        i = n(361988),
        c = n(269842),
        u = n(525388)
      const d = o.forwardRef((e, t) => {
        var n
        const {
            intent: l,
            onFocus: a,
            onBlur: r,
            onMouseOver: d,
            onMouseOut: h,
            hasErrors: m,
            hasWarnings: b,
            errors: p,
            warnings: v,
            alwaysShowAttachedErrors: g,
            messagesPosition: f,
            messagesAttachment: C,
            inheritMessagesWidthFromTarget: w,
            inputDescription: x,
            ...E
          } = e,
          y = (0, i.useControlValidationLayout)({
            hasErrors: m,
            hasWarnings: b,
            errors: p,
            warnings: v,
            alwaysShowAttachedErrors: g,
            messagesPosition: f,
            messagesAttachment: C,
            iconHidden: !0,
            inheritMessagesWidthFromTarget: w,
          }),
          P = (0, c.createSafeMulticastEventHandler)(a, y.onFocus),
          T = (0, c.createSafeMulticastEventHandler)(r, y.onBlur),
          K = (0, c.createSafeMulticastEventHandler)(d, y.onMouseOver),
          I = (0, c.createSafeMulticastEventHandler)(h, y.onMouseOut)
        return o.createElement(
          o.Fragment,
          null,
          o.createElement(s.Select, {
            ...E,
            intent: null !== (n = y.intent) && void 0 !== n ? n : l,
            onFocus: P,
            onBlur: T,
            onMouseOver: K,
            onMouseOut: I,
            ref: (0, u.useMergedRefs)([y.containerReference, t]),
            'aria-describedby': y.ariaIds,
            'aria-invalid': m,
          }),
          y.renderedErrors,
        )
      })
      d.displayName = 'FormSelect'
      var h = n(192063),
        m = n(518799),
        b = n(930052),
        p = n(996038),
        v = n(661851),
        g = n(573113)
      function f(e) {
        const {
            items: t,
            forceUserToSelectValue: a,
            alwaysShowAttachedErrors$: s,
            selectedItem: c,
            disabled: u,
            title: f,
            onClick: C,
            onItemSelected: w,
            onClose: x,
          } = e,
          E = (0, o.useMemo)(
            () =>
              ((e) => e.map((e) => ({ value: e.value, content: e.text })))(t),
            [t],
          ),
          y = (0, o.useMemo)(
            () =>
              Object.values(E).map((e, t) => {
                var n
                return o.createElement(h.PopupMenuItem, {
                  key: e.value,
                  label: null !== (n = e.content) && void 0 !== n ? n : e.value,
                  onClickArg: t,
                  onClick: S,
                })
              }),
            [E],
          ),
          P = (0, v.useObservable)(s),
          T = void 0 === c && a
        function K(e) {
          return o.createElement(d, {
            value: c,
            items: E,
            className: g.select,
            menuClassName: e ? g.selectMenu : void 0,
            onClick: I,
            onChange: L,
            disabled: u,
            placeholder: void 0 === c ? l.t(null, void 0, n(880280)) : void 0,
            addPlaceholderToItems: !1,
            hasErrors: T,
            messagesPosition: i.MessagesPosition.Static,
            inheritMessagesWidthFromTarget: !0,
            hideArrowButton: E.length <= 1,
            stretch: !0,
            alwaysShowAttachedErrors: Boolean(P) && T,
            matchButtonAndListboxWidths: !0,
          })
        }
        return o.createElement(
          b.MatchMedia,
          {
            rule: p.DialogBreakpoints.TabletSmall,
          },
          (e) =>
            o.createElement(
              o.Fragment,
              null,
              o.createElement(
                'div',
                { className: r()(g.title, T && g.titleWithError) },
                T ? l.t(null, { replace: { fieldTitle: f } }, n(693251)) : f,
              ),
              e
                ? o.createElement(m.ToolWidgetMenu, {
                    className: g.menuButton,
                    content: K(e),
                    children: y,
                    arrow: !1,
                    onClose: M,
                    isDrawer: !0,
                    closeOnClickOutside: !0,
                  })
                : K(e),
            ),
        )
        function I() {
          void 0 !== C && C()
        }
        function L(e) {
          w(e)
        }
        function M() {
          void 0 !== x && x()
        }
        function S(e) {
          w(t[e || 0].value), M()
        }
      }
      function C(e) {
        const {
            title: t,
            items: n,
            selectedItem$: l,
            getSelectedItem: a,
            setSelectedItem: r,
            forceUserToSelectValue: s,
            alwaysShowAttachedErrors$: i,
            disabled: c,
            onControlFocused: u,
            onClose: d,
          } = e,
          h = (0, v.useObservable)(l, a())
        return o.createElement(f, {
          title: t,
          items: n,
          selectedItem: h,
          onItemSelected: (e) => r(e),
          disabled: c,
          onClick: () => (null == u ? void 0 : u.fire()),
          onClose: d,
          forceUserToSelectValue: s,
          alwaysShowAttachedErrors$: i,
        })
      }
    },
    444144: (e, t, n) => {
      n.d(t, { ControlDisclosureView: () => h })
      var o = n(50959),
        l = n(497754),
        a = n.n(l),
        r = n(525388),
        s = n(34735),
        i = n(102691),
        c = n(904925),
        u = n(364228),
        d = n(366986)
      const h = o.forwardRef((e, t) => {
        const {
            listboxId: n,
            className: l,
            listboxClassName: h,
            listboxTabIndex: m,
            hideArrowButton: b,
            matchButtonAndListboxWidths: p,
            popupPosition: v,
            disabled: g,
            isOpened: f,
            scrollWrapReference: C,
            repositionOnScroll: w,
            closeOnHeaderOverlap: x,
            listboxReference: E,
            size: y = 'small',
            onClose: P,
            onOpen: T,
            onListboxFocus: K,
            onListboxBlur: I,
            onListboxKeyDown: L,
            buttonChildren: M,
            children: S,
            caretClassName: O,
            listboxAria: N,
            ...k
          } = e,
          H = (0, o.useRef)(null),
          B =
            !b &&
            o.createElement(
              i.EndSlot,
              null,
              o.createElement(u.Caret, {
                isDropped: f,
                disabled: g,
                className: O,
              }),
            )
        return o.createElement(c.PopupMenuDisclosureView, {
          buttonRef: H,
          listboxId: n,
          listboxClassName: h,
          listboxTabIndex: m,
          isOpened: f,
          onClose: P,
          onOpen: T,
          listboxReference: E,
          scrollWrapReference: C,
          onListboxFocus: K,
          onListboxBlur: I,
          onListboxKeyDown: L,
          listboxAria: N,
          matchButtonAndListboxWidths: p,
          popupPosition: v,
          button: o.createElement(s.ControlSkeleton, {
            ...k,
            'data-role': 'listbox',
            disabled: g,
            className: a()(d.button, l),
            size: y,
            ref: (0, r.useMergedRefs)([H, t]),
            middleSlot: o.createElement(
              i.MiddleSlot,
              null,
              o.createElement(
                'span',
                { className: a()(d['button-children'], b && d.hiddenArrow) },
                M,
              ),
            ),
            endSlot: B,
          }),
          popupChildren: S,
          repositionOnScroll: w,
          closeOnHeaderOverlap: x,
        })
      })
      h.displayName = 'ControlDisclosureView'
    },
    297265: (e, t, n) => {
      n.d(t, { useWatchedValueReadonly: () => l })
      var o = n(50959)
      const l = (e, t = !1) => {
        const n = 'watchedValue' in e ? e.watchedValue : void 0,
          l = 'defaultValue' in e ? e.defaultValue : e.watchedValue.value(),
          [a, r] = (0, o.useState)(n ? n.value() : l)
        return (
          (t ? o.useLayoutEffect : o.useEffect)(() => {
            if (n) {
              r(n.value())
              const e = (e) => r(e)
              return n.subscribe(e), () => n.unsubscribe(e)
            }
            return () => {}
          }, [n]),
          a
        )
      }
    },
    364228: (e, t, n) => {
      n.d(t, { Caret: () => u, CaretButton: () => d })
      var o = n(50959),
        l = n(497754),
        a = n.n(l),
        r = n(72571),
        s = n(602948),
        i = n(323428)
      function c(e) {
        const { isDropped: t } = e
        return o.createElement(r.Icon, {
          className: a()(i.icon, t && i.dropped),
          icon: s,
        })
      }
      function u(e) {
        const { className: t, disabled: n, isDropped: l } = e
        return o.createElement(
          'span',
          { className: a()(i.button, n && i.disabled, t) },
          o.createElement(c, { isDropped: l }),
        )
      }
      function d(e) {
        const {
          className: t,
          tabIndex: n = -1,
          disabled: l,
          isDropped: r,
          ...s
        } = e
        return o.createElement(
          'button',
          {
            ...s,
            type: 'button',
            tabIndex: n,
            disabled: l,
            className: a()(i.button, l && i.disabled, t),
          },
          o.createElement(c, { isDropped: r }),
        )
      }
    },
    529631: (e, t, n) => {
      n.d(t, { Select: () => w })
      var o = n(50959),
        l = n(855393),
        a = n(414823),
        r = n(525388),
        s = n(930617),
        i = n(192063),
        c = n(12481),
        u = n(343370)
      var d = n(648621),
        h = n(953517),
        m = n(444144),
        b = n(942544),
        p = n(710263),
        v = n(760673)
      function g(e) {
        return !e.readonly
      }
      function f(e, t) {
        var n
        return null !== (n = null == t ? void 0 : t.id) && void 0 !== n
          ? n
          : (0, a.createDomId)(e, 'item', null == t ? void 0 : t.value)
      }
      function C(e) {
        var t, n
        const { selectedItem: l, placeholder: a } = e
        if (!l) return o.createElement('span', { className: v.placeholder }, a)
        const r =
          null !==
            (n =
              null !== (t = l.selectedContent) && void 0 !== t
                ? t
                : l.content) && void 0 !== n
            ? n
            : l.value
        return o.createElement('span', null, r)
      }
      const w = o.forwardRef((e, t) => {
        const {
          id: n,
          menuClassName: v,
          menuItemClassName: w,
          tabIndex: x,
          disabled: E,
          highlight: y,
          intent: P,
          hideArrowButton: T,
          placeholder: K,
          addPlaceholderToItems: I = !1,
          value: L,
          'aria-labelledby': M,
          onFocus: S,
          onBlur: O,
          onClick: N,
          onChange: k,
          onKeyDown: H,
          repositionOnScroll: B = !0,
          openMenuOnEnter: A = !0,
          'aria-describedby': F,
          'aria-invalid': D,
          ...Q
        } = e
        let { items: R } = e
        if (K && I) {
          R = [
            {
              value: void 0,
              content: K,
              id: (0, a.createDomId)(n, 'placeholder'),
            },
            ...R,
          ]
        }
        const {
            listboxId: W,
            isOpened: V,
            isFocused: $,
            buttonTabIndex: U,
            listboxTabIndex: Z,
            highlight: Y,
            intent: z,
            open: X,
            onOpen: j,
            close: _,
            toggle: q,
            buttonFocusBindings: G,
            onButtonClick: J,
            buttonRef: ee,
            listboxRef: te,
            buttonAria: ne,
          } = (0, b.useControlDisclosure)({
            id: n,
            disabled: E,
            buttonTabIndex: x,
            intent: P,
            highlight: y,
            onFocus: S,
            onBlur: O,
            onClick: N,
          }),
          oe = R.filter(g),
          le = oe.find((e) => e.value === L),
          [ae, re] = o.useState(
            K && I ? oe[0].value : null == le ? void 0 : le.value,
          ),
          [se, ie, ce] = (0, s.useKeepActiveItemIntoView)({ activeItem: le })
        ;(0, l.useIsomorphicLayoutEffect)(
          () => re(null == le ? void 0 : le.value),
          [L],
        )
        const ue = (0, a.joinDomIds)(M, n),
          de = ue.length > 0 ? ue : void 0,
          he = (0, o.useMemo)(
            () => ({
              role: 'listbox',
              'aria-labelledby': M,
              'aria-activedescendant': f(n, le),
            }),
            [M, le],
          ),
          me = (0, o.useCallback)((e) => e.value === ae, [ae]),
          be = (0, o.useCallback)(() => (_(), k && k(ae)), [_, k, ae]),
          pe = (0, d.useItemsKeyboardNavigation)(
            'vertical',
            p.isRtl,
            oe,
            me,
            (e) => {
              re(e.value)
            },
            !1,
            { next: [40], previous: [38] },
          ),
          ve = (0, h.useKeyboardToggle)(q, V || A),
          ge = (0, h.useKeyboardToggle)(be),
          fe = (0, h.useKeyboardClose)(V, Pe),
          Ce = (0, h.useKeyboardOpen)(V, X),
          we = (0, h.useKeyboardEventHandler)([ve, fe, Ce]),
          xe = (0, h.useKeyboardEventHandler)([pe, ge, fe]),
          Ee = ((e) => {
            const t = (0, o.useRef)(''),
              n = (0, o.useMemo)(
                () =>
                  (0, c.default)(() => {
                    t.current = ''
                  }, 500),
                [],
              ),
              l = (0, o.useMemo)(() => (0, u.default)(e, 200), [e])
            return (0, o.useCallback)(
              (e) => {
                e.key.length > 0 &&
                  e.key.length < 3 &&
                  ((t.current += e.key), l(t.current, e), n())
              },
              [n, l],
            )
          })((t, n) => {
            const o = ((e, t, n) =>
              e.find((e) => {
                var o
                const l = t.toLowerCase()
                return (
                  !e.readonly &&
                  (n
                    ? n(e).toLowerCase().startsWith(l)
                    : !e.readonly &&
                      (('string' == typeof e.content &&
                        e.content.toLowerCase().startsWith(l)) ||
                        ('string' == typeof e.textContent &&
                          e.textContent.toLowerCase().startsWith(l)) ||
                        String(null !== (o = e.value) && void 0 !== o ? o : '')
                          .toLowerCase()
                          .startsWith(l)))
                )
              }))(oe, t, e.getSearchKey)
            void 0 !== o && k && (n.stopPropagation(), V || X(), k(o.value))
          })
        return o.createElement(
          m.ControlDisclosureView,
          {
            ...Q,
            ...ne,
            ...G,
            id: n,
            role: 'button',
            tabIndex: U,
            'aria-owns': ne['aria-controls'],
            'aria-haspopup': 'listbox',
            'aria-labelledby': de,
            disabled: E,
            hideArrowButton: T,
            isFocused: $,
            isOpened: V,
            highlight: Y,
            intent: z,
            ref: (0, r.useMergedRefs)([ee, t]),
            onClick: J,
            onOpen: () => {
              ce(le, { duration: 0 }), j()
            },
            onClose: Pe,
            onKeyDown: (e) => {
              we(e), H && H(e)
              e.defaultPrevented || Ee(e)
            },
            listboxId: W,
            listboxTabIndex: Z,
            listboxClassName: v,
            listboxAria: he,
            'aria-describedby': F,
            'aria-invalid': D,
            listboxReference: te,
            scrollWrapReference: se,
            onListboxKeyDown: (e) => {
              xe(e), e.defaultPrevented || Ee(e)
            },
            buttonChildren: o.createElement(C, {
              selectedItem: null != le ? le : null,
              placeholder: K,
            }),
            repositionOnScroll: B,
          },
          R.map((e, t) => {
            var l
            if (e.readonly)
              return o.createElement(
                o.Fragment,
                { key: `readonly_item_${t}` },
                e.content,
              )
            const a = f(n, e)
            return o.createElement(i.PopupMenuItem, {
              key: a,
              id: a,
              className: w,
              role: 'option',
              'aria-selected': L === e.value,
              isActive: ae === e.value,
              label: null !== (l = e.content) && void 0 !== l ? l : e.value,
              onClick: ye,
              onClickArg: e.value,
              isDisabled: e.disabled,
              reference: (t) => ie(e, t),
            })
          }),
        )
        function ye(e) {
          k && (k(e), re(e))
        }
        function Pe() {
          re(null == le ? void 0 : le.value), _()
        }
      })
      w.displayName = 'Select'
    },
    499084: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16Zm3.87-12.15c.36.2.49.66.28 1.02l-4 7a.75.75 0 0 1-1.18.16l-3-3a.75.75 0 1 1 1.06-1.06l2.3 2.3 3.52-6.14a.75.75 0 0 1 1.02-.28Z"/></svg>'
    },
    530162: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" fill-rule="evenodd" d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16ZM9 4c-.79 0-1.38.7-1.25 1.48l.67 4.03a.59.59 0 0 0 1.16 0l.67-4.03A1.27 1.27 0 0 0 9 4Zm0 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></svg>'
    },
    527941: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16ZM8 6a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm1 2c.49 0 1 .59 1 1v3.01c0 .42-.51.99-1 .99s-1-.57-1-.99V9c0-.41.51-1 1-1Z"/></svg>'
    },
  },
])
