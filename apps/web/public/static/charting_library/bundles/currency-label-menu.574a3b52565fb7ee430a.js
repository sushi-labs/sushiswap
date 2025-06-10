;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2704],
  {
    97754: (e, t) => {
      var n
      !(() => {
        var o = {}.hasOwnProperty
        function r() {
          for (var e = [], t = 0; t < arguments.length; t++) {
            var n = arguments[t]
            if (n) {
              var i = typeof n
              if ('string' === i || 'number' === i) e.push(n)
              else if (Array.isArray(n) && n.length) {
                var s = r.apply(null, n)
                s && e.push(s)
              } else if ('object' === i)
                for (var a in n) o.call(n, a) && n[a] && e.push(a)
            }
          }
          return e.join(' ')
        }
        e.exports
          ? ((r.default = r), (e.exports = r))
          : void 0 === (n = (() => r).apply(t, [])) || (e.exports = n)
      })()
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
    55679: (e) => {
      e.exports = {
        wrapper: 'wrapper-TJ9ObuLF',
        animated: 'animated-TJ9ObuLF',
        pulsation: 'pulsation-TJ9ObuLF',
      }
    },
    96108: (e) => {
      e.exports = {
        'tablet-normal-breakpoint': '(max-width: 768px)',
        'small-height-breakpoint': '(max-height: 360px)',
        'tablet-small-breakpoint': '(max-width: 440px)',
      }
    },
    92335: (e) => {
      e.exports = {
        container: 'container-qm7Rg5MB',
        mobile: 'mobile-qm7Rg5MB',
        inputContainer: 'inputContainer-qm7Rg5MB',
        withCancel: 'withCancel-qm7Rg5MB',
        input: 'input-qm7Rg5MB',
        icon: 'icon-qm7Rg5MB',
        cancel: 'cancel-qm7Rg5MB',
      }
    },
    16318: (e) => {
      e.exports = { scrollWrap: 'scrollWrap-a62DpCum' }
    },
    72153: (e) => {
      e.exports = {
        container: 'container-c8Hkfy8e',
        separator: 'separator-c8Hkfy8e',
        section: 'section-c8Hkfy8e',
      }
    },
    57628: (e) => {
      e.exports = {
        action: 'action-peI7w0K1',
        hovered: 'hovered-peI7w0K1',
        active: 'active-peI7w0K1',
        label: 'label-peI7w0K1',
        description: 'description-peI7w0K1',
        selected: 'selected-peI7w0K1',
        small: 'small-peI7w0K1',
        withDescription: 'withDescription-peI7w0K1',
        action__favoriteIcon: 'action__favoriteIcon-peI7w0K1',
        action__favoriteIcon_active: 'action__favoriteIcon_active-peI7w0K1',
        labelAndDescription: 'labelAndDescription-peI7w0K1',
        icon: 'icon-peI7w0K1',
        fakeIcon: 'fakeIcon-peI7w0K1',
        highlighted: 'highlighted-peI7w0K1',
      }
    },
    41161: (e) => {
      e.exports = {
        menu: 'menu-kJ5smAAE',
        withDescriptions: 'withDescriptions-kJ5smAAE',
        header: 'header-kJ5smAAE',
        title: 'title-kJ5smAAE',
        container: 'container-kJ5smAAE',
        icon: 'icon-kJ5smAAE',
        clear: 'clear-kJ5smAAE',
        input: 'input-kJ5smAAE',
        highlighted: 'highlighted-kJ5smAAE',
        active: 'active-kJ5smAAE',
        section: 'section-kJ5smAAE',
      }
    },
    22413: (e) => {
      e.exports = {
        favorite: 'favorite-_FRQhM5Y',
        hovered: 'hovered-_FRQhM5Y',
        disabled: 'disabled-_FRQhM5Y',
        focused: 'focused-_FRQhM5Y',
        active: 'active-_FRQhM5Y',
        checked: 'checked-_FRQhM5Y',
      }
    },
    95059: (e) => {
      e.exports = { highlighted: 'highlighted-cwp8YRo6' }
    },
    238: (e) => {
      e.exports = {
        separator: 'separator-QjUlCDId',
        small: 'small-QjUlCDId',
        normal: 'normal-QjUlCDId',
        large: 'large-QjUlCDId',
      }
    },
    49128: (e) => {
      e.exports = { icon: 'icon-WB2y0EnP', dropped: 'dropped-WB2y0EnP' }
    },
    53885: (e, t, n) => {
      n.d(t, { getStyleClasses: () => a, isCircleLogoWithUrlProps: () => c })
      var o = n(97754),
        r = n(52292),
        i = n(56057),
        s = n.n(i)
      function a(e, t = 2, n) {
        return o(
          s().logo,
          s()[e],
          n,
          0 === t || 1 === t
            ? o(r.skeletonTheme.wrapper, s().skeleton)
            : s().letter,
          1 === t && r.skeletonTheme.animated,
        )
      }
      function c(e) {
        return (
          'logoUrl' in e &&
          null !== e.logoUrl &&
          void 0 !== e.logoUrl &&
          0 !== e.logoUrl.length
        )
      }
    },
    39416: (e, t, n) => {
      n.d(t, { useFunctionalRefObject: () => i })
      var o = n(50959),
        r = n(43010)
      function i(e) {
        const t = (0, o.useMemo)(
            () =>
              ((e) => {
                const t = (n) => {
                  e(n), (t.current = n)
                }
                return (t.current = null), t
              })((e) => {
                a.current(e)
              }),
            [],
          ),
          n = (0, o.useRef)(null),
          i = (t) => {
            if (null === t) return s(n.current, t), void (n.current = null)
            n.current !== e && ((n.current = e), s(n.current, t))
          },
          a = (0, o.useRef)(i)
        return (
          (a.current = i),
          (0, r.useIsomorphicLayoutEffect)(() => {
            if (null !== t.current)
              return a.current(t.current), () => a.current(null)
          }, [e]),
          t
        )
      }
      function s(e, t) {
        null !== e && ('function' == typeof e ? e(t) : (e.current = t))
      }
    },
    27267: (e, t, n) => {
      function o(e, t, n, o, r) {
        function i(r) {
          if (e > r.timeStamp) return
          const i = r.target
          void 0 !== n &&
            null !== t &&
            null !== i &&
            i.ownerDocument === o &&
            (t.contains(i) || n(r))
        }
        return (
          r.click && o.addEventListener('click', i, !1),
          r.mouseDown && o.addEventListener('mousedown', i, !1),
          r.touchEnd && o.addEventListener('touchend', i, !1),
          r.touchStart && o.addEventListener('touchstart', i, !1),
          () => {
            o.removeEventListener('click', i, !1),
              o.removeEventListener('mousedown', i, !1),
              o.removeEventListener('touchend', i, !1),
              o.removeEventListener('touchstart', i, !1)
          }
        )
      }
      n.d(t, { addOutsideEventListener: () => o })
    },
    52292: (e, t, n) => {
      n.d(t, { skeletonTheme: () => r })
      var o = n(55679)
      const r = o
    },
    90186: (e, t, n) => {
      function o(e) {
        return i(e, s)
      }
      function r(e) {
        return i(e, a)
      }
      function i(e, t) {
        const n = Object.entries(e).filter(t),
          o = {}
        for (const [e, t] of n) o[e] = t
        return o
      }
      function s(e) {
        const [t, n] = e
        return 0 === t.indexOf('data-') && 'string' == typeof n
      }
      function a(e) {
        return 0 === e[0].indexOf('aria-')
      }
      n.d(t, {
        filterAriaProps: () => r,
        filterDataProps: () => o,
        filterProps: () => i,
        isAriaAttribute: () => a,
        isDataAttribute: () => s,
      })
    },
    87896: (e, t, n) => {
      n.d(t, { createReactRoot: () => d })
      var o = n(50959),
        r = n(32227),
        i = n(4237)
      const s = (0, o.createContext)({
        isOnMobileAppPage: () => !1,
        isRtl: !1,
        locale: 'en',
      })
      var a = n(84015),
        c = n(63273)
      const l = {
        iOs: 'old',
        android: 'new',
        old: 'old',
        new: 'new',
        any: 'any',
      }
      function u(e) {
        const [t] = (0, o.useState)({
          isOnMobileAppPage: (e) => (0, a.isOnMobileAppPage)(l[e]),
          isRtl: (0, c.isRtl)(),
          locale: window.locale,
        })
        return o.createElement(s.Provider, { value: t }, e.children)
      }
      function d(e, t, n = 'legacy') {
        const s = o.createElement(u, null, e)
        if ('modern' === n) {
          const e = (0, i.createRoot)(t)
          return (
            e.render(s),
            {
              render(t) {
                e.render(o.createElement(u, null, t))
              },
              unmount() {
                e.unmount()
              },
            }
          )
        }
        return (
          r.render(s, t),
          {
            render(e) {
              r.render(o.createElement(u, null, e), t)
            },
            unmount() {
              r.unmountComponentAtNode(t)
            },
          }
        )
      }
    },
    24437: (e, t, n) => {
      n.d(t, { DialogBreakpoints: () => r })
      var o = n(96108)
      const r = {
        SmallHeight: o['small-height-breakpoint'],
        TabletSmall: o['tablet-small-breakpoint'],
        TabletNormal: o['tablet-normal-breakpoint'],
      }
    },
    69654: (e, t, n) => {
      n.d(t, { DialogSearch: () => d })
      var o = n(50959),
        r = n(97754),
        i = n.n(r),
        s = n(11542),
        a = n(9745),
        c = n(6347),
        l = n(54313),
        u = n(92335)
      function d(e) {
        const {
          children: t,
          isMobile: r,
          renderInput: d,
          onCancel: h,
          containerClassName: p,
          inputContainerClassName: v,
          iconClassName: f,
          cancelTitle: g = s.t(null, void 0, n(4543)),
          ...C
        } = e
        return o.createElement(
          'div',
          { className: i()(u.container, r && u.mobile, p) },
          o.createElement(
            'div',
            {
              className: i()(
                u.inputContainer,
                r && u.mobile,
                v,
                h && u.withCancel,
              ),
            },
            d || o.createElement(m, { isMobile: r, ...C }),
          ),
          t,
          o.createElement(a.Icon, {
            className: i()(u.icon, r && u.mobile, f),
            icon: r ? l : c,
          }),
          h &&
            (!r || '' !== C.value) &&
            o.createElement(
              'div',
              { className: i()(u.cancel, r && u.mobile), onClick: h },
              g,
            ),
        )
      }
      function m(e) {
        const {
          className: t,
          reference: n,
          isMobile: r,
          value: s,
          onChange: a,
          onFocus: c,
          onBlur: l,
          onKeyDown: d,
          onSelect: m,
          placeholder: h,
          activeDescendant: p,
          ...v
        } = e
        return o.createElement('input', {
          ...v,
          ref: n,
          type: 'text',
          className: i()(t, u.input, r && u.mobile),
          autoComplete: 'off',
          role: 'searchbox',
          'data-role': 'search',
          placeholder: h,
          value: s,
          onChange: a,
          onFocus: c,
          onBlur: l,
          onSelect: m,
          onKeyDown: d,
          'aria-activedescendant': p,
        })
      }
    },
    28587: (e, t, n) => {
      n.r(t), n.d(t, { UnitConversionRenderer: () => U })
      var o = n(50959),
        r = n(52092),
        i = n(87896),
        s = n(76422),
        a = n(49992),
        c = n(90692),
        l = n(97006),
        u = n(68335)
      var d = n(24437),
        m = n(78135),
        h = n(97754),
        p = n.n(h),
        v = n(11542),
        f = n(9745),
        g = n(20520),
        C = n(27317),
        E = n(40173),
        x = n(11684),
        w = n(39706),
        y = n(36189),
        A = n(59695),
        b = n(24637),
        M = n(57628)
      const S = o.memo(
        (e) => {
          const {
              label: t,
              icon: n,
              rules: r,
              search: i,
              description: s,
              onClick: a,
              onClose: c,
              isActive: l,
              isSmallSize: u,
              isSelected: d,
              selectedRef: m,
              hasDescriptions: h,
              hasIcons: v,
              isFavorite: f,
              onFavoriteClick: g,
            } = e,
            C = (0, o.useCallback)(() => {
              a(), c && c()
            }, [a, c]),
            E = u && M.small
          return o.createElement(
            'div',
            {
              className: p()(
                M.action,
                l && M.active,
                E,
                h && M.withDescription,
                d && M.selected,
              ),
              onClick: C,
              ref: m,
            },
            v &&
              (void 0 !== n
                ? o.createElement(A.CircleLogo, {
                    logoUrl: n,
                    size: h ? 'xsmall' : 'xxxsmall',
                    className: p()(M.icon, E),
                  })
                : o.createElement('span', { className: p()(M.fakeIcon, E) })),
            o.createElement(
              'div',
              { className: p()(M.labelAndDescription, E) },
              o.createElement('span', { className: p()(M.label, E) }, x(t)),
              h && o.createElement('br', null),
              h &&
                o.createElement(
                  'span',
                  { className: p()(M.description, E) },
                  s ? x(s) : '',
                ),
            ),
            void 0 !== f &&
              o.createElement(
                'div',
                {
                  className: p()(
                    M.action__favoriteIcon,
                    f && M.action__favoriteIcon_active,
                  ),
                },
                o.createElement(y.FavoriteButton, {
                  isActive: l,
                  isFilled: f,
                  onClick: (e) => {
                    e.stopPropagation(), g?.()
                  },
                }),
              ),
          )
          function x(e) {
            return o.createElement(b.HighlightedText, {
              text: e,
              rules: r,
              queryString: i,
              className: p()(l && M.highlighted, l && M.active),
            })
          }
        },
        (e, t) =>
          Object.keys(t)
            .filter(
              (e) => !['onClick', 'onClose', 'onFavoriteClick'].includes(e),
            )
            .every((n) => t[n] === e[n]),
      )
      var k = n(51417),
        R = n(69311),
        I = n(41161),
        D = n(16318)
      const L = (0, E.mergeThemes)(C.DEFAULT_MENU_THEME, D)
      function N(e) {
        const {
            title: t,
            sections: r,
            onClose: i,
            selectedId: s,
            selectedRef: a,
            search: c,
            setSearch: l,
            items: u,
            rules: d,
            searchRef: m,
            hasDescriptions: h,
            hasIcons: C,
            ...E
          } = e,
          [y, A] = (0, o.useState)(() =>
            r.reduce((e, t, n) => (t.name && (e[t.id] = !0), e), {}),
          )
        function b(e) {
          const { id: t, ...n } = e
          return o.createElement(S, {
            key: t,
            rules: d,
            search: c,
            onClose: i,
            isSmallSize: !0,
            isSelected: t === s,
            selectedRef: t === s ? a : void 0,
            hasDescriptions: h,
            hasIcons: C,
            ...n,
          })
        }
        return o.createElement(
          g.PopupMenu,
          {
            ...E,
            onClose: i,
            className: p()(I.menu, h && I.withDescriptions),
            theme: L,
            maxHeight: h ? 313 : 280,
            noMomentumBasedScroll: !0,
            isOpened: !0,
            onOpen: () => {
              m.current?.focus()
            },
          },
          o.createElement(
            'div',
            { className: I.header },
            o.createElement('div', { className: I.title }, t),
            o.createElement(
              'div',
              { className: I.container },
              o.createElement(f.Icon, { icon: k, className: I.icon }),
              o.createElement('input', {
                size: 1,
                type: 'text',
                className: I.input,
                placeholder: v.t(null, void 0, n(8573)),
                autoComplete: 'off',
                'data-role': 'search',
                onChange: (e) => {
                  l(e.target.value)
                },
                value: c,
                ref: m,
              }),
              Boolean(c) &&
                o.createElement(f.Icon, {
                  icon: R,
                  className: I.clear,
                  onClick: () => {
                    l('')
                  },
                }),
            ),
          ),
          c
            ? u.map(b)
            : r.map((e, t) =>
                o.createElement(
                  o.Fragment,
                  { key: e.id },
                  Boolean(t) && o.createElement(x.PopupMenuSeparator, null),
                  e.name
                    ? o.createElement(
                        w.CollapsibleSection,
                        {
                          summary: e.name,
                          className: I.section,
                          open: y[e.id],
                          onStateChange: (t) => A({ ...y, [e.id]: t }),
                        },
                        e.actions.map(b),
                      )
                    : e.actions.map(b),
                ),
              ),
        )
      }
      var F = n(79418),
        _ = n(69654),
        T = n(72153)
      function P(e) {
        const {
          title: t,
          onClose: r,
          sections: i,
          selectedId: s,
          selectedRef: a,
          search: c,
          setSearch: l,
          items: u,
          rules: d,
          searchRef: m,
          hasIcons: h,
          hasDescriptions: p,
        } = e
        return o.createElement(F.AdaptivePopupDialog, {
          title: t,
          onClose: r,
          render: () =>
            o.createElement(
              o.Fragment,
              null,
              o.createElement(_.DialogSearch, {
                placeholder: v.t(null, void 0, n(8573)),
                onChange: f,
                reference: m,
              }),
              o.createElement(
                'div',
                { className: T.container },
                c
                  ? u.map((e) => {
                      const { id: t, isActive: n, ...i } = e
                      return o.createElement(S, {
                        key: t,
                        isActive: n,
                        onClose: r,
                        rules: d,
                        search: c,
                        isSelected: t === s,
                        selectedRef: t === s ? a : void 0,
                        hasIcons: h,
                        hasDescriptions: p,
                        ...i,
                      })
                    })
                  : i.map((e, t) =>
                      o.createElement(
                        o.Fragment,
                        { key: e.id },
                        e.name &&
                          o.createElement(
                            'div',
                            { className: T.section },
                            e.name,
                          ),
                        e.actions.map((n, l) => {
                          const { id: u, ...m } = n,
                            v = l === e.actions.length - 1,
                            f = t === i.length - 1
                          return o.createElement(
                            o.Fragment,
                            { key: u },
                            o.createElement(S, {
                              rules: d,
                              search: c,
                              onClose: r,
                              isSelected: u === s,
                              selectedRef: u === s ? a : void 0,
                              hasIcons: h,
                              hasDescriptions: p,
                              ...m,
                            }),
                            !f &&
                              v &&
                              o.createElement('div', {
                                className: T.separator,
                              }),
                          )
                        }),
                      ),
                    ),
              ),
            ),
          dataName: 'unit-conversion-dialog',
          draggable: !1,
          fullScreen: !0,
          isOpened: !0,
        })
        function f(e) {
          l(e.target.value)
        }
      }
      const B = {
        horizontalAttachEdge: m.HorizontalAttachEdge.Right,
        horizontalDropDirection: m.HorizontalDropDirection.FromRightToLeft,
      }
      function O(e) {
        const { element: t, ...n } = e,
          [r, i] = (0, o.useState)(E()),
          [s, a] = (0, o.useState)(''),
          h = (0, o.useRef)(null),
          p = (0, o.useRef)(null),
          v = (0, o.useMemo)(() => (0, l.createRegExpList)(s), [s]),
          { activeIdx: f, setActiveIdx: g } = ((e, t, n, r = 'keydown') => {
            const [i, s] = (0, o.useState)(-1)
            return (
              (0, o.useEffect)(() => {
                if (!e) return
                const n = (e) => {
                  switch ((0, u.hashFromEvent)(e)) {
                    case 40:
                      if (i === t.length - 1) break
                      e.preventDefault(), s(i + 1)
                      break
                    case 38:
                      if (i <= 0) break
                      e.preventDefault(), s(i - 1)
                  }
                }
                return (
                  e.addEventListener('keydown', n),
                  () => {
                    e.removeEventListener('keydown', n)
                  }
                )
              }, [e, i, t]),
              (0, o.useEffect)(() => {
                if (!e || !n) return
                const o = (e) => {
                  e.repeat ||
                    (13 === (0, u.hashFromEvent)(e) && n(t[i] ?? null, e))
                }
                return (
                  e.addEventListener(r, o),
                  () => {
                    e.removeEventListener(r, o)
                  }
                )
              }, [e, i, t, n, r]),
              { activeIdx: i, setActiveIdx: s }
            )
          })(h.current, r, (e) => {
            e && (e.onClick(), n.onClose())
          })
        !((e, t = []) => {
          ;(0, o.useEffect)(() => {
            e(-1)
          }, [...t])
        })(g, [r]),
          ((e, t) => {
            ;(0, o.useEffect)(() => {
              t >= 0 && e.current?.scrollIntoView({ block: 'nearest' })
            }, [t])
          })(p, f),
          (0, o.useEffect)(() => {
            i(
              s
                ? ((e, t, n) => {
                    const o = e.reduce((e, t) => [...e, ...t.actions], [])
                    return (0, l.rankedSearch)({
                      data: o,
                      rules: n,
                      queryString: t,
                      primaryKey: 'label',
                      secondaryKey: 'description',
                    })
                  })(n.sections, s, v)
                : E(),
            )
          }, [s, n.sections, v])
        const C = (0, o.useMemo)(
          () => ({
            selectedId: Boolean(f >= 0 && r[f]) ? r[f].id : '',
            selectedRef: p,
            search: s,
            setSearch: a,
            searchRef: h,
            items: r,
            rules: v,
            hasIcons: r.some((e) => void 0 !== e.icon),
            hasDescriptions: r.some((e) => void 0 !== e.description),
          }),
          [f, p, s, a, h, r, v],
        )
        return o.createElement(
          c.MatchMedia,
          { rule: d.DialogBreakpoints.TabletSmall },
          (e) =>
            e
              ? o.createElement(P, { ...n, ...C })
              : o.createElement(N, {
                  ...n,
                  ...C,
                  position: (0, m.getPopupPositioner)(t, B),
                  doNotCloseOn: t,
                }),
        )
        function E() {
          return n.sections.reduce((e, t) => (e.push(...t.actions), e), [])
        }
      }
      class U {
        constructor(e, t, n, o) {
          ;(this._rootInstance = null),
            (this._close = () => this.destroy()),
            (this._title = e),
            (this._element = t),
            (this._sectionsGetter = n),
            (this._menuClosedCallback = o),
            this._render(),
            a.favoriteCurrencyUnitConversionService
              .getOnChange()
              .subscribe(this, this._render),
            s.subscribe(r.CLOSE_POPUPS_AND_DIALOGS_COMMAND, this._close, this)
        }
        destroy() {
          s.unsubscribe(r.CLOSE_POPUPS_AND_DIALOGS_COMMAND, this._close, this),
            a.favoriteCurrencyUnitConversionService
              .getOnChange()
              .unsubscribeAll(this),
            null !== this._rootInstance &&
              (this._rootInstance.unmount(),
              (this._rootInstance = null),
              this._menuClosedCallback())
        }
        _render() {
          const e = o.createElement(O, {
            title: this._title,
            sections: this._sectionsGetter(),
            element: this._element,
            onClose: this._close,
          })
          null !== this._rootInstance
            ? this._rootInstance.render(e)
            : (this._rootInstance = (0, i.createReactRoot)(
                e,
                document.createElement('div'),
                'modern',
              ))
        }
      }
    },
    74670: (e, t, n) => {
      n.d(t, { useActiveDescendant: () => i })
      var o = n(50959),
        r = n(39416)
      function i(e, t = []) {
        const [n, i] = (0, o.useState)(!1),
          s = (0, r.useFunctionalRefObject)(e)
        return (
          (0, o.useLayoutEffect)(() => {
            const e = s.current
            if (null === e) return
            const t = (e) => {
              switch (e.type) {
                case 'active-descendant-focus':
                  i(!0)
                  break
                case 'active-descendant-blur':
                  i(!1)
              }
            }
            return (
              e.addEventListener('active-descendant-focus', t),
              e.addEventListener('active-descendant-blur', t),
              () => {
                e.removeEventListener('active-descendant-focus', t),
                  e.removeEventListener('active-descendant-blur', t)
              }
            )
          }, t),
          [s, n]
        )
      }
    },
    59695: (e, t, n) => {
      n.d(t, { CircleLogo: () => a, hiddenCircleLogoClass: () => s })
      var o = n(50959),
        r = n(53885),
        i = n(56057)
      const s = n.n(i)().hidden
      function a(e) {
        const t = (0, r.isCircleLogoWithUrlProps)(e),
          [n, i] = (0, o.useState)(0),
          s = (0, o.useRef)(null),
          a = (0, r.getStyleClasses)(e.size, n, e.className),
          c = e.alt ?? e.title ?? '',
          l = t ? c[0] : e.placeholderLetter
        return (
          (0, o.useEffect)(() => i((s.current?.complete ?? !t) ? 2 : 1), [t]),
          t && 3 !== n
            ? o.createElement('img', {
                ref: s,
                className: a,
                crossOrigin: '',
                src: e.logoUrl,
                alt: c,
                title: e.title,
                loading: e.loading,
                onLoad: () => i(2),
                onError: () => i(3),
                'aria-label': e['aria-label'],
                'aria-hidden': e['aria-hidden'],
              })
            : o.createElement(
                'span',
                {
                  className: a,
                  title: e.title,
                  'aria-label': e['aria-label'],
                  'aria-hidden': e['aria-hidden'],
                },
                l,
              )
        )
      }
    },
    71402: (e, t, n) => {
      n.d(t, { RemoveTitleType: () => o, removeTitlesMap: () => i })
      var o,
        r = n(11542)
      !((e) => {
        ;(e.Add = 'add'), (e.Remove = 'remove')
      })(o || (o = {}))
      const i = {
        [o.Add]: r.t(null, void 0, n(69207)),
        [o.Remove]: r.t(null, void 0, n(85106)),
      }
    },
    36189: (e, t, n) => {
      n.d(t, { FavoriteButton: () => m })
      var o = n(50959),
        r = n(97754),
        i = n.n(r),
        s = n(9745),
        a = n(71402),
        c = n(74670),
        l = n(39146),
        u = n(48010),
        d = n(22413)
      function m(e) {
        const {
            className: t,
            isFilled: n,
            isActive: r,
            onClick: m,
            title: h,
            ...p
          } = e,
          [v, f] = (0, c.useActiveDescendant)(null),
          g =
            h ??
            (n
              ? a.removeTitlesMap[a.RemoveTitleType.Remove]
              : a.removeTitlesMap[a.RemoveTitleType.Add])
        return (
          (0, o.useLayoutEffect)(() => {
            const e = v.current
            e instanceof HTMLElement &&
              g &&
              e.dispatchEvent(new CustomEvent('common-tooltip-update'))
          }, [g, v]),
          o.createElement(s.Icon, {
            ...p,
            className: i()(
              d.favorite,
              'apply-common-tooltip',
              n && d.checked,
              r && d.active,
              f && d.focused,
              t,
            ),
            onClick: m,
            icon: n ? l : u,
            title: g,
            ariaLabel: g,
            ref: v,
          })
        )
      }
    },
    97006: (e, t, n) => {
      n.d(t, {
        createRegExpList: () => a,
        getHighlightedChars: () => c,
        rankedSearch: () => s,
      })
      var o = n(37265)
      function r(e) {
        return e.replace(/[!-/[-^{-}?]/g, '\\$&')
      }
      var i
      function s(e) {
        const {
          data: t,
          rules: n,
          queryString: r,
          isPreventedFromFiltering: i,
          primaryKey: s,
          secondaryKey: a = s,
          optionalPrimaryKey: c,
          tertiaryKey: l,
        } = e
        return t
          .map((e) => {
            const t = c && e[c] ? e[c] : e[s],
              i = e[a],
              u = l && e[l]
            let d,
              m = 0
            return (
              n.forEach((e) => {
                const { re: n, fullMatch: s } = e
                if (
                  ((n.lastIndex = 0),
                  (0, o.isString)(t) &&
                    t &&
                    t.toLowerCase() === r.toLowerCase())
                )
                  return (m = 4), void (d = t.match(s)?.index)
                if ((0, o.isString)(t) && s.test(t))
                  return (m = 3), void (d = t.match(s)?.index)
                if ((0, o.isString)(i) && s.test(i))
                  return (m = 2), void (d = i.match(s)?.index)
                if ((0, o.isString)(i) && n.test(i))
                  return (m = 2), void (d = i.match(n)?.index)
                if (Array.isArray(u))
                  for (const e of u)
                    if (s.test(e)) return (m = 1), void (d = e.match(s)?.index)
              }),
              { matchPriority: m, matchIndex: d, item: e }
            )
          })
          .filter((e) => i || e.matchPriority)
          .sort((e, t) => {
            if (e.matchPriority < t.matchPriority) return 1
            if (e.matchPriority > t.matchPriority) return -1
            if (e.matchPriority === t.matchPriority) {
              if (void 0 === e.matchIndex || void 0 === t.matchIndex) return 0
              if (e.matchIndex > t.matchIndex) return 1
              if (e.matchIndex < t.matchIndex) return -1
            }
            return 0
          })
          .map(({ item: e }) => e)
      }
      function a(e, t) {
        const n = [],
          o = e.toLowerCase(),
          i =
            e
              .split('')
              .map((e, t) => `(${0 !== t ? `[/\\s-]${r(e)}` : r(e)})`)
              .join('(.*?)') + '(.*)'
        return (
          n.push({
            fullMatch: new RegExp(`(${r(e)})`, 'i'),
            re: new RegExp(`^${i}`, 'i'),
            reserveRe: new RegExp(i, 'i'),
            fuzzyHighlight: !0,
          }),
          t &&
            Object.hasOwn(t, o) &&
            n.push({ fullMatch: t[o], re: t[o], fuzzyHighlight: !1 }),
          n
        )
      }
      function c(e, t, n) {
        const o = []
        return e && n
          ? (n.forEach((e) => {
              const { fullMatch: n, re: r, reserveRe: i } = e
              ;(n.lastIndex = 0), (r.lastIndex = 0)
              const s = n.exec(t),
                a = s || r.exec(t) || (i && i.exec(t))
              if (((e.fuzzyHighlight = !s), a))
                if (e.fuzzyHighlight) {
                  let e = a.index
                  for (let t = 1; t < a.length; t++) {
                    const n = a[t],
                      r = a[t].length
                    if (t % 2) {
                      const t =
                        n.startsWith(' ') ||
                        n.startsWith('/') ||
                        n.startsWith('-')
                      o[t ? e + 1 : e] = !0
                    }
                    e += r
                  }
                } else for (let e = 0; e < a[0].length; e++) o[a.index + e] = !0
            }),
            o)
          : o
      }
      !((e) => {
        ;(e[(e.Low = 0)] = 'Low'),
          (e[(e.MediumLow = 1)] = 'MediumLow'),
          (e[(e.Medium = 2)] = 'Medium'),
          (e[(e.High = 3)] = 'High'),
          (e[(e.Highest = 4)] = 'Highest')
      })(i || (i = {}))
    },
    24637: (e, t, n) => {
      n.d(t, { HighlightedText: () => a })
      var o = n(50959),
        r = n(97754),
        i = n(97006),
        s = n(95059)
      function a(e) {
        const { queryString: t, rules: n, text: a, className: c } = e,
          l = (0, o.useMemo)(
            () => (0, i.getHighlightedChars)(t, a, n),
            [t, n, a],
          )
        return o.createElement(
          o.Fragment,
          null,
          l.length
            ? a
                .split('')
                .map((e, t) =>
                  o.createElement(
                    o.Fragment,
                    { key: t },
                    l[t]
                      ? o.createElement(
                          'span',
                          { className: r(s.highlighted, c) },
                          e,
                        )
                      : o.createElement('span', null, e),
                  ),
                )
            : a,
        )
      }
    },
    11684: (e, t, n) => {
      n.d(t, { PopupMenuSeparator: () => c })
      var o,
        r = n(50959),
        i = n(97754),
        s = n.n(i),
        a = n(238)
      function c(e) {
        const { size: t = 'normal', className: n, ariaHidden: o = !1 } = e
        return r.createElement('div', {
          className: s()(
            a.separator,
            'small' === t && a.small,
            'normal' === t && a.normal,
            'large' === t && a.large,
            n,
          ),
          role: 'separator',
          'aria-hidden': o,
        })
      }
      !((e) => {
        ;(e.Small = 'small'), (e.Large = 'large'), (e.Normal = 'normal')
      })(o || (o = {}))
    },
    20520: (e, t, n) => {
      n.d(t, { PopupMenu: () => m })
      var o = n(50959),
        r = n(32227),
        i = n(88987),
        s = n(42842),
        a = n(27317),
        c = n(29197)
      const l = o.createContext(void 0)
      var u = n(36383)
      const d = o.createContext({ setMenuMaxWidth: !1 })
      function m(e) {
        const {
            controller: t,
            children: n,
            isOpened: m,
            closeOnClickOutside: h = !0,
            doNotCloseOn: p,
            onClickOutside: v,
            onClose: f,
            onKeyboardClose: g,
            'data-name': C = 'popup-menu-container',
            ...E
          } = e,
          x = (0, o.useContext)(c.CloseDelegateContext),
          w = o.useContext(d),
          y = (0, o.useContext)(l),
          A = (0, u.useOutsideEvent)({
            handler: (e) => {
              v && v(e)
              if (!h) return
              const t = (0, i.default)(p) ? p() : null == p ? [] : [p]
              if (t.length > 0 && e.target instanceof Node)
                for (const n of t) {
                  const t = r.findDOMNode(n)
                  if (t instanceof Node && t.contains(e.target)) return
                }
              f()
            },
            mouseDown: !0,
            touchStart: !0,
          })
        return m
          ? o.createElement(
              s.Portal,
              {
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                pointerEvents: 'none',
              },
              o.createElement(
                'span',
                { ref: A, style: { pointerEvents: 'auto' } },
                o.createElement(
                  a.Menu,
                  {
                    ...E,
                    onClose: f,
                    onKeyboardClose: g,
                    onScroll: (t) => {
                      const { onScroll: n } = e
                      n && n(t)
                    },
                    customCloseDelegate: x,
                    customRemeasureDelegate: y,
                    ref: t,
                    'data-name': C,
                    limitMaxWidth: w.setMenuMaxWidth,
                    'data-tooltip-show-on-focus': 'true',
                  },
                  n,
                ),
              ),
            )
          : null
      }
    },
    10381: (e, t, n) => {
      n.d(t, { ToolWidgetCaret: () => c })
      var o = n(50959),
        r = n(97754),
        i = n(9745),
        s = n(49128),
        a = n(578)
      function c(e) {
        const { dropped: t, className: n } = e
        return o.createElement(i.Icon, {
          className: r(n, s.icon, { [s.dropped]: t }),
          icon: a,
        })
      }
    },
    40173: (e, t, n) => {
      function o(e, t, n = {}) {
        return Object.assign(
          {},
          e,
          ((e, t, n = {}) => {
            const o = Object.assign({}, t)
            for (const r of Object.keys(t)) {
              const i = n[r] || r
              i in e && (o[r] = [e[i], t[r]].join(' '))
            }
            return o
          })(e, t, n),
        )
      }
      n.d(t, { mergeThemes: () => o })
    },
    4237: (e, t, n) => {
      var o = n(32227)
      ;(t.createRoot = o.createRoot), o.hydrateRoot
    },
    91836: (e) => {
      e.exports = {
        summary: 'summary-ynHBVe1n',
        hovered: 'hovered-ynHBVe1n',
        caret: 'caret-ynHBVe1n',
      }
    },
    39706: (e, t, n) => {
      n.d(t, { CollapsibleSection: () => c })
      var o = n(50959),
        r = n(97754),
        i = n.n(r),
        s = n(10381),
        a = n(91836)
      const c = (0, o.forwardRef)((e, t) => {
        const {
          open: n,
          summary: r,
          children: c,
          onStateChange: l,
          tabIndex: u,
          className: d,
          ...m
        } = e
        return o.createElement(
          o.Fragment,
          null,
          o.createElement(
            'div',
            {
              ...m,
              className: i()(d, a.summary),
              onClick: () => {
                l && l(!n)
              },
              'data-open': n,
              'aria-expanded': n,
              ref: t,
              tabIndex: u,
            },
            r,
            o.createElement(s.ToolWidgetCaret, {
              className: a.caret,
              dropped: Boolean(n),
            }),
          ),
          n && c,
        )
      })
    },
    78135: (e, t, n) => {
      n.d(t, {
        HorizontalAttachEdge: () => r,
        HorizontalDropDirection: () => s,
        VerticalAttachEdge: () => o,
        VerticalDropDirection: () => i,
        getPopupPositioner: () => l,
      })
      var o,
        r,
        i,
        s,
        a = n(50151)
      !((e) => {
        ;(e[(e.Top = 0)] = 'Top'),
          (e[(e.Bottom = 1)] = 'Bottom'),
          (e[(e.AutoStrict = 2)] = 'AutoStrict')
      })(o || (o = {})),
        ((e) => {
          ;(e[(e.Left = 0)] = 'Left'), (e[(e.Right = 1)] = 'Right')
        })(r || (r = {})),
        ((e) => {
          ;(e[(e.FromTopToBottom = 0)] = 'FromTopToBottom'),
            (e[(e.FromBottomToTop = 1)] = 'FromBottomToTop')
        })(i || (i = {})),
        ((e) => {
          ;(e[(e.FromLeftToRight = 0)] = 'FromLeftToRight'),
            (e[(e.FromRightToLeft = 1)] = 'FromRightToLeft')
        })(s || (s = {}))
      const c = {
        verticalAttachEdge: o.Bottom,
        horizontalAttachEdge: r.Left,
        verticalDropDirection: i.FromTopToBottom,
        horizontalDropDirection: s.FromLeftToRight,
        verticalMargin: 0,
        horizontalMargin: 0,
        matchButtonAndListboxWidths: !1,
      }
      function l(e, t) {
        return (n) => {
          const { contentWidth: l, contentHeight: u, availableHeight: d } = n,
            m = (0, a.ensureNotNull)(e).getBoundingClientRect(),
            {
              horizontalAttachEdge: h = c.horizontalAttachEdge,
              horizontalDropDirection: p = c.horizontalDropDirection,
              horizontalMargin: v = c.horizontalMargin,
              verticalMargin: f = c.verticalMargin,
              matchButtonAndListboxWidths: g = c.matchButtonAndListboxWidths,
            } = t
          let C = t.verticalAttachEdge ?? c.verticalAttachEdge,
            E = t.verticalDropDirection ?? c.verticalDropDirection
          C === o.AutoStrict &&
            (d < m.y + m.height + f + u
              ? ((C = o.Top), (E = i.FromBottomToTop))
              : ((C = o.Bottom), (E = i.FromTopToBottom)))
          const x = C === o.Top ? -1 * f : f,
            w = h === r.Right ? m.right : m.left,
            y = C === o.Top ? m.top : m.bottom,
            A = {
              x: w - (p === s.FromRightToLeft ? l : 0) + v,
              y: y - (E === i.FromBottomToTop ? u : 0) + x,
            }
          return g && (A.overrideWidth = m.width), A
        }
      }
    },
    75556: (e, t, n) => {
      n.r(t), n.d(t, { currencyActions: () => a })
      var o = n(50151),
        r = n(11542),
        i = n(8481),
        s = n(49992)
      function a(e, t, a) {
        if (null === t || t.readOnly) return []
        const c = [],
          l = (t) => {
            e.setPriceScaleCurrency(a, t)
          },
          u = t.selectedCurrency,
          d = t.originalCurrencies,
          m = t.baseCurrencies,
          h = t.displayedValues,
          p = s.favoriteCurrencyUnitConversionService.get().currencies,
          v = { id: 'first_section', actions: [] }
        if (d.size > 1) {
          const e = (0, i.createAction)(
            'Mixed',
            r.t(null, void 0, n(54215)),
            void 0,
            void 0,
            null === t.selectedCurrency,
            () => l(null),
          )
          v.actions.push(e)
        }
        const f = e.model().availableCurrencies()
        if (null !== u) {
          const e = (0, o.ensureNotNull)(f.item(u)),
            t = (0, i.createAction)(
              u,
              (0, o.ensureDefined)(h.get(u)),
              e.logoUrl,
              e.description,
              !0,
              () => {},
              p.has(u),
              () =>
                s.favoriteCurrencyUnitConversionService.toggle('currencies', u),
            )
          v.actions.push(t)
        }
        const g = f.filterConvertible(m, (e) => e !== u && d.has(e))
        for (const e of g) {
          const n = (0, o.ensureNotNull)(f.item(e.id))
          v.actions.push(
            (0, i.createAction)(
              e.id,
              e.code,
              n.logoUrl,
              n.description,
              t.selectedCurrency === e.id,
              () => l(e.id),
              p.has(e.id),
              () =>
                s.favoriteCurrencyUnitConversionService.toggle(
                  'currencies',
                  e.id,
                ),
            ),
          )
        }
        v.actions.length > 0 && c.push(v)
        const C = f.filterConvertible(m, (e) => e !== u && !d.has(e)),
          E = [],
          x = []
        for (const e of C) {
          const n = (0, o.ensureNotNull)(f.item(e.id)),
            r = p.has(e.id),
            a = (0, i.createAction)(
              e.id,
              e.code,
              n.logoUrl,
              n.description,
              t.selectedCurrency === e.id,
              () => l(e.id),
              r,
              () =>
                s.favoriteCurrencyUnitConversionService.toggle(
                  'currencies',
                  e.id,
                ),
            )
          r ? E.push(a) : x.push(a)
        }
        return (
          (x.length > 0 || E.length > 0) &&
            c.push({ id: 'second_section', actions: E.concat(x) }),
          c
        )
      }
    },
    49992: (e, t, n) => {
      n.d(t, { favoriteCurrencyUnitConversionService: () => a })
      var o = n(56840),
        r = n(21097),
        i = n(59063)
      class s extends i.AbstractJsonStoreService {
        constructor(e, t) {
          super(
            e,
            t,
            'FAVORITE_CURRENCY_UNIT_CONVERSION_CHANGED',
            'currencyUnitConversion.favorites',
            { currencies: new Set(), units: new Set() },
          )
        }
        add(e, t) {
          const n = this.get()
          n[e].add(t), this.set(n)
        }
        remove(e, t) {
          const n = this.get()
          n[e].delete(t) && this.set(n)
        }
        toggle(e, t) {
          this.get()[e].has(t) ? this.remove(e, t) : this.add(e, t)
        }
        _serialize(e) {
          return [[...e.currencies], [...e.units]]
        }
        _deserialize(e) {
          return { currencies: new Set(e[0]), units: new Set(e[1]) }
        }
      }
      const a = new s(r.TVXWindowEvents, o)
    },
    59363: (e, t, n) => {
      n.r(t), n.d(t, { unitActions: () => a })
      var o = n(50151),
        r = n(11542),
        i = n(8481),
        s = n(49992)
      function a(e, t, a) {
        if (null === t || 0 === t.availableGroups.size) return []
        const c = [],
          l = (t) => {
            e.setPriceScaleUnit(a, t)
          },
          u = t.selectedUnit,
          d = t.originalUnits,
          m = t.names,
          h = t.descriptions,
          p = s.favoriteCurrencyUnitConversionService.get().units,
          v = { actions: [], id: 'first_section' }
        if (d.size > 1) {
          const e = (0, i.createAction)(
            'Mixed',
            r.t(null, void 0, n(54215)),
            void 0,
            void 0,
            null === t.selectedUnit,
            () => l(null),
          )
          v.actions.push(e)
        }
        const f = e.model().availableUnits()
        if (null !== u) {
          const e = (0, i.createAction)(
            u,
            (0, o.ensureDefined)(m.get(u)),
            void 0,
            (0, o.ensureDefined)(h.get(u)),
            !0,
            () => {},
            p.has(u),
            () => s.favoriteCurrencyUnitConversionService.toggle('units', u),
          )
          v.actions.push(e)
        }
        const g = f.unitsByGroups(t.availableGroups),
          C = [],
          E = []
        for (const e of g)
          for (const t of e.units) {
            const e = p.has(t.id)
            if (t.id === u || (!e && !d.has(t.id))) continue
            const n = (0, i.createAction)(
              t.id,
              t.name,
              void 0,
              t.description,
              !1,
              () => l(t.id),
              e,
              () =>
                s.favoriteCurrencyUnitConversionService.toggle('units', t.id),
            )
            e ? E.push(n) : C.push(n)
          }
        ;(C.length > 0 || E.length > 0) &&
          v.actions.push(
            ...E.sort((e, t) =>
              e.label.toLowerCase().localeCompare(t.label.toLowerCase()),
            ),
            ...C,
          ),
          v.actions.length > 0 && c.push(v)
        const x = u && f.unitGroupById(u)
        if (null !== x)
          for (const e of g) {
            if (e.name !== x) continue
            const t = []
            for (const n of e.units)
              n.id === u ||
                d.has(n.id) ||
                p.has(n.id) ||
                t.push(
                  (0, i.createAction)(
                    n.id,
                    n.name,
                    void 0,
                    n.description,
                    !1,
                    () => l(n.id),
                    !1,
                    () =>
                      s.favoriteCurrencyUnitConversionService.toggle(
                        'units',
                        n.id,
                      ),
                  ),
                )
            t.length > 0 && c.push({ id: e.name, name: e.name, actions: t })
          }
        for (const e of g) {
          if (e.name === x) continue
          const t = []
          for (const n of e.units)
            n.id === u ||
              d.has(n.id) ||
              p.has(n.id) ||
              t.push(
                (0, i.createAction)(
                  n.id,
                  n.name,
                  void 0,
                  n.description,
                  !1,
                  () => l(n.id),
                  !1,
                  () =>
                    s.favoriteCurrencyUnitConversionService.toggle(
                      'units',
                      n.id,
                    ),
                ),
              )
          t.length > 0 && c.push({ id: e.name, name: e.name, actions: t })
        }
        return c
      }
    },
    8481: (e, t, n) => {
      function o(e, t, n, o, r, i, s, a) {
        return {
          id: e,
          label: t,
          icon: n,
          description: o,
          isActive: r,
          onClick: i,
          isFavorite: s,
          onFavoriteClick: a,
        }
      }
      n.d(t, { createAction: () => o })
    },
    51417: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="currentColor"><path fill-rule="evenodd" d="M11.87 12.58a6 6 0 1 1 .71-.7L16 15.29l-.7.71zM13 8A5 5 0 1 1 3 8a5 5 0 0 1 10 0"/></svg>'
    },
    578: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8" width="16" height="8"><path fill="currentColor" d="M0 1.475l7.396 6.04.596.485.593-.49L16 1.39 14.807 0 7.393 6.122 8.58 6.12 1.186.08z"/></svg>'
    },
    69311: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M9.7 9l4.65-4.65-.7-.7L9 8.29 4.35 3.65l-.7.7L8.29 9l-4.64 4.65.7.7L9 9.71l4.65 4.64.7-.7L9.71 9z"/></svg>'
    },
    39146: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" d="M9 1l2.35 4.76 5.26.77-3.8 3.7.9 5.24L9 13l-4.7 2.47.9-5.23-3.8-3.71 5.25-.77L9 1z"/></svg>'
    },
    48010: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M9 2.13l1.903 3.855.116.236.26.038 4.255.618-3.079 3.001-.188.184.044.259.727 4.237-3.805-2L9 12.434l-.233.122-3.805 2.001.727-4.237.044-.26-.188-.183-3.079-3.001 4.255-.618.26-.038.116-.236L9 2.13z"/></svg>'
    },
    54313: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M18.5 12.5a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm-1.25 5.8a7.5 7.5 0 1 1 1.06-1.06l4.22 4.23.53.53L22 23.06l-.53-.53-4.22-4.22Z"/></svg>'
    },
    6347: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="M17.4 17.5a7 7 0 1 0-4.9 2c1.9 0 3.64-.76 4.9-2zm0 0l5.1 5"/></svg>'
    },
    55698: (e, t, n) => {
      n.d(t, { nanoid: () => o })
      const o = (e = 21) =>
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
