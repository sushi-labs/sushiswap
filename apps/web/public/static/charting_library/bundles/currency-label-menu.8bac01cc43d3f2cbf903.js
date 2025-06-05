;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2704],
  {
    88803: (e) => {
      e.exports = {
        'tablet-normal-breakpoint': 'screen and (max-width: 768px)',
        'small-height-breakpoint': 'screen and (max-height: 360px)',
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
      }
    },
    40281: (e) => {
      e.exports = {
        container: 'container-qm7Rg5MB',
        inputContainer: 'inputContainer-qm7Rg5MB',
        withCancel: 'withCancel-qm7Rg5MB',
        input: 'input-qm7Rg5MB',
        icon: 'icon-qm7Rg5MB',
        cancel: 'cancel-qm7Rg5MB',
      }
    },
    16734: (e) => {
      e.exports = { scrollWrap: 'scrollWrap-a62DpCum' }
    },
    40211: (e) => {
      e.exports = {
        container: 'container-c8Hkfy8e',
        separator: 'separator-c8Hkfy8e',
        section: 'section-c8Hkfy8e',
      }
    },
    55002: (e) => {
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
    5826: (e) => {
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
    45300: (e) => {
      e.exports = {}
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
    75623: (e) => {
      e.exports = { highlighted: 'highlighted-cwp8YRo6' }
    },
    92910: (e) => {
      e.exports = {
        separator: 'separator-QjUlCDId',
        small: 'small-QjUlCDId',
        normal: 'normal-QjUlCDId',
        large: 'large-QjUlCDId',
      }
    },
    34587: (e) => {
      e.exports = { icon: 'icon-WB2y0EnP', dropped: 'dropped-WB2y0EnP' }
    },
    27267: (e, t, n) => {
      function i(e, t, n, i, o) {
        function r(o) {
          if (e > o.timeStamp) return
          const r = o.target
          void 0 !== n &&
            null !== t &&
            null !== r &&
            r.ownerDocument === i &&
            (t.contains(r) || n(o))
        }
        return (
          o.click && i.addEventListener('click', r, !1),
          o.mouseDown && i.addEventListener('mousedown', r, !1),
          o.touchEnd && i.addEventListener('touchend', r, !1),
          o.touchStart && i.addEventListener('touchstart', r, !1),
          () => {
            i.removeEventListener('click', r, !1),
              i.removeEventListener('mousedown', r, !1),
              i.removeEventListener('touchend', r, !1),
              i.removeEventListener('touchstart', r, !1)
          }
        )
      }
      n.d(t, { addOutsideEventListener: () => i })
    },
    90186: (e, t, n) => {
      function i(e) {
        return r(e, a)
      }
      function o(e) {
        return r(e, s)
      }
      function r(e, t) {
        const n = Object.entries(e).filter(t),
          i = {}
        for (const [e, t] of n) i[e] = t
        return i
      }
      function a(e) {
        const [t, n] = e
        return 0 === t.indexOf('data-') && 'string' == typeof n
      }
      function s(e) {
        return 0 === e[0].indexOf('aria-')
      }
      n.d(t, {
        filterAriaProps: () => o,
        filterDataProps: () => i,
        filterProps: () => r,
        isAriaAttribute: () => s,
        isDataAttribute: () => a,
      })
    },
    24437: (e, t, n) => {
      n.d(t, { DialogBreakpoints: () => o })
      var i = n(88803)
      const o = {
        SmallHeight: i['small-height-breakpoint'],
        TabletSmall: i['tablet-small-breakpoint'],
        TabletNormal: i['tablet-normal-breakpoint'],
      }
    },
    69654: (e, t, n) => {
      n.d(t, { DialogSearch: () => u })
      var i = n(50959),
        o = n(97754),
        r = n.n(o),
        a = n(11542),
        s = n(9745),
        c = n(69859),
        l = n(40281)
      function u(e) {
        const {
          children: t,
          renderInput: o,
          onCancel: u,
          containerClassName: h,
          inputContainerClassName: m,
          iconClassName: v,
          ...p
        } = e
        return i.createElement(
          'div',
          { className: r()(l.container, h) },
          i.createElement(
            'div',
            { className: r()(l.inputContainer, m, u && l.withCancel) },
            o || i.createElement(d, { ...p }),
          ),
          t,
          i.createElement(s.Icon, { className: r()(l.icon, v), icon: c }),
          u &&
            i.createElement(
              'div',
              { className: l.cancel, onClick: u },
              a.t(null, void 0, n(20036)),
            ),
        )
      }
      function d(e) {
        const {
          className: t,
          reference: n,
          value: o,
          onChange: a,
          onFocus: s,
          onBlur: c,
          onKeyDown: u,
          onSelect: d,
          placeholder: h,
          ...m
        } = e
        return i.createElement('input', {
          ...m,
          ref: n,
          type: 'text',
          className: r()(t, l.input),
          autoComplete: 'off',
          'data-role': 'search',
          placeholder: h,
          value: o,
          onChange: a,
          onFocus: s,
          onBlur: c,
          onSelect: d,
          onKeyDown: u,
        })
      }
    },
    41153: (e, t, n) => {
      n.r(t), n.d(t, { UnitConversionRenderer: () => H })
      var i = n(50959),
        o = n(962),
        r = n(79188),
        a = n(90692),
        s = n(19785),
        c = n(63651),
        l = n(98715),
        u = n(32470),
        d = n(24437),
        h = n(12811),
        m = n(97754),
        v = n.n(m),
        p = n(11542),
        f = n(9745),
        g = n(20520),
        C = n(27317),
        E = n(40173),
        y = n(51613),
        x = n(76197),
        k = n(36189),
        w = n(76068),
        A = n(24637),
        b = n(55002)
      const S = i.memo(
        (e) => {
          const {
              label: t,
              icon: n,
              rules: o,
              search: r,
              description: a,
              onClick: s,
              onClose: c,
              isActive: l,
              isSmallSize: u,
              isSelected: d,
              selectedRef: h,
              hasDescriptions: m,
              hasIcons: p,
              isFavorite: f,
              onFavoriteClick: g,
            } = e,
            C = (0, i.useCallback)(() => {
              s(), c && c()
            }, [s, c]),
            E = u && b.small
          return i.createElement(
            'div',
            {
              className: v()(
                b.action,
                l && b.active,
                E,
                m && b.withDescription,
                d && b.selected,
              ),
              onClick: C,
              ref: h,
            },
            p &&
              (void 0 !== n
                ? i.createElement(w.CircleLogo, {
                    logoUrl: n,
                    size: m ? 'xsmall' : 'xxxsmall',
                    className: v()(b.icon, E),
                  })
                : i.createElement('span', { className: v()(b.fakeIcon, E) })),
            i.createElement(
              'div',
              { className: v()(b.labelAndDescription, E) },
              i.createElement('span', { className: v()(b.label, E) }, y(t)),
              m && i.createElement('br', null),
              m &&
                i.createElement(
                  'span',
                  { className: v()(b.description, E) },
                  a ? y(a) : '',
                ),
            ),
            void 0 !== f &&
              i.createElement(
                'div',
                {
                  className: v()(
                    b.action__favoriteIcon,
                    f && b.action__favoriteIcon_active,
                  ),
                },
                i.createElement(k.FavoriteButton, {
                  isActive: l,
                  isFilled: f,
                  onClick: (e) => {
                    e.stopPropagation(), null == g || g()
                  },
                }),
              ),
          )
          function y(e) {
            return i.createElement(A.HighlightedText, {
              text: e,
              rules: o,
              queryString: r,
              className: v()(l && b.highlighted, l && b.active),
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
      var _ = n(51417),
        I = n(69311),
        N = n(5826),
        D = n(16734)
      const L = (0, E.mergeThemes)(C.DEFAULT_MENU_THEME, D)
      function R(e) {
        const {
            title: t,
            sections: o,
            onClose: r,
            selectedId: a,
            selectedRef: s,
            search: c,
            setSearch: l,
            items: u,
            rules: d,
            searchRef: h,
            hasDescriptions: m,
            hasIcons: C,
            ...E
          } = e,
          [k, w] = (0, i.useState)(() =>
            o.reduce((e, t, n) => (t.name && (e[t.id] = !0), e), {}),
          )
        function A(e) {
          const { id: t, ...n } = e
          return i.createElement(S, {
            key: t,
            rules: d,
            search: c,
            onClose: r,
            isSmallSize: !0,
            isSelected: t === a,
            selectedRef: t === a ? s : void 0,
            hasDescriptions: m,
            hasIcons: C,
            ...n,
          })
        }
        return i.createElement(
          g.PopupMenu,
          {
            ...E,
            onClose: r,
            className: v()(N.menu, m && N.withDescriptions),
            theme: L,
            maxHeight: m ? 313 : 280,
            noMomentumBasedScroll: !0,
            isOpened: !0,
            onOpen: () => {
              var e
              null === (e = h.current) || void 0 === e || e.focus()
            },
          },
          i.createElement(
            'div',
            { className: N.header },
            i.createElement('div', { className: N.title }, t),
            i.createElement(
              'div',
              { className: N.container },
              i.createElement(f.Icon, { icon: _, className: N.icon }),
              i.createElement('input', {
                size: 1,
                type: 'text',
                className: N.input,
                placeholder: p.t(null, void 0, n(52298)),
                autoComplete: 'off',
                'data-role': 'search',
                onChange: (e) => {
                  l(e.target.value)
                },
                value: c,
                ref: h,
              }),
              Boolean(c) &&
                i.createElement(f.Icon, {
                  icon: I,
                  className: N.clear,
                  onClick: () => {
                    l('')
                  },
                }),
            ),
          ),
          c
            ? u.map(A)
            : o.map((e, t) =>
                i.createElement(
                  i.Fragment,
                  { key: e.id },
                  Boolean(t) && i.createElement(y.PopupMenuSeparator, null),
                  e.name
                    ? i.createElement(
                        x.CollapsibleSection,
                        {
                          summary: e.name,
                          className: N.section,
                          open: k[e.id],
                          onStateChange: (t) => w({ ...k, [e.id]: t }),
                        },
                        e.actions.map(A),
                      )
                    : e.actions.map(A),
                ),
              ),
        )
      }
      var z = n(35057),
        T = n(69654),
        M = n(40211)
      function F(e) {
        const {
          title: t,
          onClose: o,
          sections: r,
          selectedId: a,
          selectedRef: s,
          search: c,
          setSearch: l,
          items: u,
          rules: d,
          searchRef: h,
          hasIcons: m,
          hasDescriptions: v,
        } = e
        return i.createElement(z.AdaptivePopupDialog, {
          title: t,
          onClose: o,
          render: () =>
            i.createElement(
              i.Fragment,
              null,
              i.createElement(T.DialogSearch, {
                placeholder: p.t(null, void 0, n(52298)),
                onChange: f,
                reference: h,
              }),
              i.createElement(
                'div',
                { className: M.container },
                c
                  ? u.map((e) => {
                      const { id: t, isActive: n, ...r } = e
                      return i.createElement(S, {
                        key: t,
                        isActive: n,
                        onClose: o,
                        rules: d,
                        search: c,
                        isSelected: t === a,
                        selectedRef: t === a ? s : void 0,
                        hasIcons: m,
                        hasDescriptions: v,
                        ...r,
                      })
                    })
                  : r.map((e, t) =>
                      i.createElement(
                        i.Fragment,
                        { key: e.id },
                        e.name &&
                          i.createElement(
                            'div',
                            { className: M.section },
                            e.name,
                          ),
                        e.actions.map((n, l) => {
                          const { id: u, ...h } = n,
                            p = l === e.actions.length - 1,
                            f = t === r.length - 1
                          return i.createElement(
                            i.Fragment,
                            { key: u },
                            i.createElement(S, {
                              rules: d,
                              search: c,
                              onClose: o,
                              isSelected: u === a,
                              selectedRef: u === a ? s : void 0,
                              hasIcons: m,
                              hasDescriptions: v,
                              ...h,
                            }),
                            !f &&
                              p &&
                              i.createElement('div', {
                                className: M.separator,
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
        horizontalAttachEdge: h.HorizontalAttachEdge.Right,
        horizontalDropDirection: h.HorizontalDropDirection.FromRightToLeft,
      }
      function U(e) {
        const { element: t, ...n } = e,
          [o, r] = (0, i.useState)(x()),
          [m, v] = (0, i.useState)(''),
          p = (0, i.useRef)(null),
          f = (0, i.useRef)(null),
          g = (0, i.useMemo)(() => (0, s.createRegExpList)(m), [m]),
          { activeIdx: C, setActiveIdx: E } = (0, c.useKeyboardNavigation)(
            p.current,
            o,
            (e) => {
              e && (e.onClick(), n.onClose())
            },
          )
        ;(0, u.useResetActiveIdx)(E, [o]),
          (0, l.useScrollToRef)(f, C),
          (0, i.useEffect)(() => {
            r(
              m
                ? ((e, t, n) => {
                    const i = e.reduce((e, t) => [...e, ...t.actions], [])
                    return (0, s.rankedSearch)({
                      data: i,
                      rules: n,
                      queryString: t,
                      primaryKey: 'label',
                      secondaryKey: 'description',
                    })
                  })(n.sections, m, g)
                : x(),
            )
          }, [m, n.sections, g])
        const y = (0, i.useMemo)(
          () => ({
            selectedId: Boolean(C >= 0 && o[C]) ? o[C].id : '',
            selectedRef: f,
            search: m,
            setSearch: v,
            searchRef: p,
            items: o,
            rules: g,
            hasIcons: o.some((e) => void 0 !== e.icon),
            hasDescriptions: o.some((e) => void 0 !== e.description),
          }),
          [C, f, m, v, p, o, g],
        )
        return i.createElement(
          a.MatchMedia,
          { rule: d.DialogBreakpoints.TabletSmall },
          (e) =>
            e
              ? i.createElement(F, { ...n, ...y })
              : i.createElement(R, {
                  ...n,
                  ...y,
                  position: (0, h.getPopupPositioner)(t, B),
                  doNotCloseOn: t,
                }),
        )
        function x() {
          return n.sections.reduce((e, t) => (e.push(...t.actions), e), [])
        }
      }
      class H {
        constructor(e, t, n, i) {
          ;(this._rootElem = document.createElement('div')),
            (this.close = () => {
              null !== this._rootElem &&
                (o.unmountComponentAtNode(this._rootElem),
                r.favoriteCurrencyUnitConversionService
                  .getOnChange()
                  .unsubscribe(this, this._render),
                (this._rootElem = null),
                this._menuClosedCallback())
            }),
            (this.isOpened = () => null !== this._rootElem),
            (this._title = e),
            (this._element = t),
            (this._sectionsGetter = n),
            (this._menuClosedCallback = i),
            this._render(),
            r.favoriteCurrencyUnitConversionService
              .getOnChange()
              .subscribe(this, this._render)
        }
        _render() {
          const e = {
            title: this._title,
            sections: this._sectionsGetter(),
            element: this._element,
            onClose: this.close,
          }
          o.render(i.createElement(U, { ...e }), this._rootElem)
        }
      }
    },
    63651: (e, t, n) => {
      n.d(t, { useKeyboardNavigation: () => r })
      var i = n(50959),
        o = n(68335)
      function r(e, t, n, r = 'keydown') {
        const [a, s] = (0, i.useState)(-1)
        return (
          (0, i.useEffect)(() => {
            if (!e) return
            const n = (e) => {
              switch ((0, o.hashFromEvent)(e)) {
                case 40:
                  if (a === t.length - 1) break
                  e.preventDefault(), s(a + 1)
                  break
                case 38:
                  if (a <= 0) break
                  e.preventDefault(), s(a - 1)
                  break
              }
            }
            return (
              e.addEventListener('keydown', n),
              () => {
                e.removeEventListener('keydown', n)
              }
            )
          }, [e, a, t]),
          (0, i.useEffect)(() => {
            if (!e || !n) return
            const i = (e) => {
              var i
              e.repeat ||
                (13 === (0, o.hashFromEvent)(e) &&
                  n(null !== (i = t[a]) && void 0 !== i ? i : null, e))
            }
            return (
              e.addEventListener(r, i),
              () => {
                e.removeEventListener(r, i)
              }
            )
          }, [e, a, t, n, r]),
          { activeIdx: a, setActiveIdx: s }
        )
      }
    },
    32470: (e, t, n) => {
      n.d(t, { useResetActiveIdx: () => o })
      var i = n(50959)
      function o(e, t = []) {
        ;(0, i.useEffect)(() => {
          e(-1)
        }, [...t])
      }
    },
    98715: (e, t, n) => {
      n.d(t, { useScrollToRef: () => o })
      var i = n(50959)
      function o(e, t) {
        ;(0, i.useEffect)(() => {
          var n
          t >= 0 &&
            (null === (n = e.current) ||
              void 0 === n ||
              n.scrollIntoView({ block: 'nearest' }))
        }, [t])
      }
    },
    76068: (e, t, n) => {
      n.d(t, { CircleLogo: () => a, hiddenCircleLogoClass: () => r })
      var i = n(50959),
        o = n(58492)
      n(45300)
      const r = 'tv-circle-logo--visually-hidden'
      function a(e) {
        var t, n
        const r = (0, o.getStyleClasses)(e.size, e.className),
          a =
            null !== (n = null !== (t = e.alt) && void 0 !== t ? t : e.title) &&
            void 0 !== n
              ? n
              : ''
        return (0, o.isCircleLogoWithUrlProps)(e)
          ? i.createElement('img', {
              className: r,
              crossOrigin: '',
              src: e.logoUrl,
              alt: a,
              title: e.title,
              loading: e.loading,
              'aria-label': e['aria-label'],
              'aria-hidden': e['aria-hidden'],
            })
          : i.createElement(
              'span',
              {
                className: r,
                title: e.title,
                'aria-label': e['aria-label'],
                'aria-hidden': e['aria-hidden'],
              },
              e.placeholderLetter,
            )
      }
    },
    58492: (e, t, n) => {
      n.d(t, { getStyleClasses: () => o, isCircleLogoWithUrlProps: () => r })
      var i = n(97754)
      function o(e, t) {
        return i('tv-circle-logo', `tv-circle-logo--${e}`, t)
      }
      function r(e) {
        return 'logoUrl' in e && void 0 !== e.logoUrl && 0 !== e.logoUrl.length
      }
    },
    36189: (e, t, n) => {
      n.d(t, { FavoriteButton: () => d })
      var i = n(11542),
        o = n(50959),
        r = n(97754),
        a = n(9745),
        s = n(39146),
        c = n(48010),
        l = n(14877)
      const u = {
        add: i.t(null, void 0, n(44629)),
        remove: i.t(null, void 0, n(72482)),
      }
      function d(e) {
        const { className: t, isFilled: n, isActive: i, onClick: d, ...h } = e
        return o.createElement(a.Icon, {
          ...h,
          className: r(
            l.favorite,
            'apply-common-tooltip',
            n && l.checked,
            i && l.active,
            t,
          ),
          icon: n ? s : c,
          onClick: d,
          title: n ? u.remove : u.add,
        })
      }
    },
    19785: (e, t, n) => {
      n.d(t, {
        createRegExpList: () => r,
        getHighlightedChars: () => a,
        rankedSearch: () => o,
      })
      var i = n(1722)
      function o(e) {
        const {
          data: t,
          rules: n,
          queryString: o,
          isPreventedFromFiltering: r,
          primaryKey: a,
          secondaryKey: s = a,
          optionalPrimaryKey: c,
          tertiaryKey: l,
        } = e
        return t
          .map((e) => {
            const t = c && e[c] ? e[c] : e[a],
              r = e[s],
              u = l && e[l]
            let d,
              h = 0
            return (
              n.forEach((e) => {
                var n, a, s, c, l
                const { re: m, fullMatch: v } = e
                if (
                  ((m.lastIndex = 0),
                  (0, i.isString)(t) &&
                    t &&
                    t.toLowerCase() === o.toLowerCase())
                )
                  return (
                    (h = 4),
                    void (d =
                      null === (n = t.match(v)) || void 0 === n
                        ? void 0
                        : n.index)
                  )
                if ((0, i.isString)(t) && v.test(t))
                  return (
                    (h = 3),
                    void (d =
                      null === (a = t.match(v)) || void 0 === a
                        ? void 0
                        : a.index)
                  )
                if ((0, i.isString)(r) && v.test(r))
                  return (
                    (h = 2),
                    void (d =
                      null === (s = r.match(v)) || void 0 === s
                        ? void 0
                        : s.index)
                  )
                if ((0, i.isString)(r) && m.test(r))
                  return (
                    (h = 2),
                    void (d =
                      null === (c = r.match(m)) || void 0 === c
                        ? void 0
                        : c.index)
                  )
                if (Array.isArray(u))
                  for (const e of u)
                    if (v.test(e))
                      return (
                        (h = 1),
                        void (d =
                          null === (l = e.match(v)) || void 0 === l
                            ? void 0
                            : l.index)
                      )
              }),
              { matchPriority: h, matchIndex: d, item: e }
            )
          })
          .filter((e) => r || e.matchPriority)
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
      function r(e, t) {
        const n = [],
          i = e.toLowerCase(),
          o =
            e
              .split('')
              .map((e, t) => `(${0 !== t ? `[/\\s-]${s(e)}` : s(e)})`)
              .join('(.*?)') + '(.*)'
        return (
          n.push({
            fullMatch: new RegExp(`(${s(e)})`, 'i'),
            re: new RegExp(`^${o}`, 'i'),
            reserveRe: new RegExp(o, 'i'),
            fuzzyHighlight: !0,
          }),
          t &&
            Object.hasOwn(t, i) &&
            n.push({ fullMatch: t[i], re: t[i], fuzzyHighlight: !1 }),
          n
        )
      }
      function a(e, t, n) {
        const i = []
        return e && n
          ? (n.forEach((e) => {
              const { fullMatch: n, re: o, reserveRe: r } = e
              ;(n.lastIndex = 0), (o.lastIndex = 0)
              const a = n.exec(t),
                s = a || o.exec(t) || (r && r.exec(t))
              if (((e.fuzzyHighlight = !a), s))
                if (e.fuzzyHighlight) {
                  let e = s.index
                  for (let t = 1; t < s.length; t++) {
                    const n = s[t],
                      o = s[t].length
                    if (t % 2) {
                      const t =
                        n.startsWith(' ') ||
                        n.startsWith('/') ||
                        n.startsWith('-')
                      i[t ? e + 1 : e] = !0
                    }
                    e += o
                  }
                } else for (let e = 0; e < s[0].length; e++) i[s.index + e] = !0
            }),
            i)
          : i
      }
      function s(e) {
        return e.replace(/[!-/[-^{-}?]/g, '\\$&')
      }
    },
    24637: (e, t, n) => {
      n.d(t, { HighlightedText: () => s })
      var i = n(50959),
        o = n(97754),
        r = n(19785),
        a = n(75623)
      function s(e) {
        const { queryString: t, rules: n, text: s, className: c } = e,
          l = (0, i.useMemo)(
            () => (0, r.getHighlightedChars)(t, s, n),
            [t, n, s],
          )
        return i.createElement(
          i.Fragment,
          null,
          l.length
            ? s
                .split('')
                .map((e, t) =>
                  i.createElement(
                    i.Fragment,
                    { key: t },
                    l[t]
                      ? i.createElement(
                          'span',
                          { className: o(a.highlighted, c) },
                          e,
                        )
                      : i.createElement('span', null, e),
                  ),
                )
            : s,
        )
      }
    },
    51613: (e, t, n) => {
      n.d(t, { PopupMenuSeparator: () => s })
      var i = n(50959),
        o = n(97754),
        r = n.n(o),
        a = n(92910)
      function s(e) {
        const { size: t = 'normal', className: n, ariaHidden: o = !1 } = e
        return i.createElement('div', {
          className: r()(
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
    },
    20520: (e, t, n) => {
      n.d(t, { PopupMenu: () => h })
      var i = n(50959),
        o = n(962),
        r = n(62942),
        a = n(42842),
        s = n(27317),
        c = n(29197)
      const l = i.createContext(void 0)
      var u = n(36383)
      const d = i.createContext({ setMenuMaxWidth: !1 })
      function h(e) {
        const {
            controller: t,
            children: n,
            isOpened: h,
            closeOnClickOutside: m = !0,
            doNotCloseOn: v,
            onClickOutside: p,
            onClose: f,
            onKeyboardClose: g,
            'data-name': C = 'popup-menu-container',
            ...E
          } = e,
          y = (0, i.useContext)(c.CloseDelegateContext),
          x = i.useContext(d),
          k = (0, i.useContext)(l),
          w = (0, u.useOutsideEvent)({
            handler: (e) => {
              p && p(e)
              if (!m) return
              const t = (0, r.default)(v) ? v() : null == v ? [] : [v]
              if (t.length > 0 && e.target instanceof Node)
                for (const n of t) {
                  const t = o.findDOMNode(n)
                  if (t instanceof Node && t.contains(e.target)) return
                }
              f()
            },
            mouseDown: !0,
            touchStart: !0,
          })
        return h
          ? i.createElement(
              a.Portal,
              {
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                pointerEvents: 'none',
              },
              i.createElement(
                'span',
                { ref: w, style: { pointerEvents: 'auto' } },
                i.createElement(
                  s.Menu,
                  {
                    ...E,
                    onClose: f,
                    onKeyboardClose: g,
                    onScroll: (t) => {
                      const { onScroll: n } = e
                      n && n(t)
                    },
                    customCloseDelegate: y,
                    customRemeasureDelegate: k,
                    ref: t,
                    'data-name': C,
                    limitMaxWidth: x.setMenuMaxWidth,
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
      var i = n(50959),
        o = n(97754),
        r = n(9745),
        a = n(34587),
        s = n(578)
      function c(e) {
        const { dropped: t, className: n } = e
        return i.createElement(r.Icon, {
          className: o(n, a.icon, { [a.dropped]: t }),
          icon: s,
        })
      }
    },
    40173: (e, t, n) => {
      function i(e, t, n = {}) {
        return Object.assign(
          {},
          e,
          ((e, t, n = {}) => {
            const i = Object.assign({}, t)
            for (const o of Object.keys(t)) {
              const r = n[o] || o
              r in e && (i[o] = [e[r], t[o]].join(' '))
            }
            return i
          })(e, t, n),
        )
      }
      n.d(t, { mergeThemes: () => i })
    },
    12989: (e) => {
      e.exports = {
        summary: 'summary-ynHBVe1n',
        hovered: 'hovered-ynHBVe1n',
        caret: 'caret-ynHBVe1n',
      }
    },
    76197: (e, t, n) => {
      n.d(t, { CollapsibleSection: () => c })
      var i = n(50959),
        o = n(97754),
        r = n.n(o),
        a = n(10381),
        s = n(12989)
      const c = (0, i.forwardRef)((e, t) => {
        const {
          open: n,
          summary: o,
          children: c,
          onStateChange: l,
          tabIndex: u,
          className: d,
          ...h
        } = e
        return i.createElement(
          i.Fragment,
          null,
          i.createElement(
            'div',
            {
              ...h,
              className: r()(d, s.summary),
              onClick: () => {
                l && l(!n)
              },
              'data-open': n,
              ref: t,
              tabIndex: u,
            },
            o,
            i.createElement(a.ToolWidgetCaret, {
              className: s.caret,
              dropped: Boolean(n),
            }),
          ),
          n && c,
        )
      })
    },
    12811: (e, t, n) => {
      n.d(t, {
        HorizontalAttachEdge: () => o,
        HorizontalDropDirection: () => a,
        VerticalAttachEdge: () => i,
        VerticalDropDirection: () => r,
        getPopupPositioner: () => l,
      })
      var i,
        o,
        r,
        a,
        s = n(50151)
      !((e) => {
        ;(e[(e.Top = 0)] = 'Top'),
          (e[(e.Bottom = 1)] = 'Bottom'),
          (e[(e.AutoStrict = 2)] = 'AutoStrict')
      })(i || (i = {})),
        ((e) => {
          ;(e[(e.Left = 0)] = 'Left'), (e[(e.Right = 1)] = 'Right')
        })(o || (o = {})),
        ((e) => {
          ;(e[(e.FromTopToBottom = 0)] = 'FromTopToBottom'),
            (e[(e.FromBottomToTop = 1)] = 'FromBottomToTop')
        })(r || (r = {})),
        ((e) => {
          ;(e[(e.FromLeftToRight = 0)] = 'FromLeftToRight'),
            (e[(e.FromRightToLeft = 1)] = 'FromRightToLeft')
        })(a || (a = {}))
      const c = {
        verticalAttachEdge: i.Bottom,
        horizontalAttachEdge: o.Left,
        verticalDropDirection: r.FromTopToBottom,
        horizontalDropDirection: a.FromLeftToRight,
        verticalMargin: 0,
        horizontalMargin: 0,
        matchButtonAndListboxWidths: !1,
      }
      function l(e, t) {
        return (n) => {
          var l, u
          const { contentWidth: d, contentHeight: h, availableHeight: m } = n,
            v = (0, s.ensureNotNull)(e).getBoundingClientRect(),
            {
              horizontalAttachEdge: p = c.horizontalAttachEdge,
              horizontalDropDirection: f = c.horizontalDropDirection,
              horizontalMargin: g = c.horizontalMargin,
              verticalMargin: C = c.verticalMargin,
              matchButtonAndListboxWidths: E = c.matchButtonAndListboxWidths,
            } = t
          let y =
              null !== (l = t.verticalAttachEdge) && void 0 !== l
                ? l
                : c.verticalAttachEdge,
            x =
              null !== (u = t.verticalDropDirection) && void 0 !== u
                ? u
                : c.verticalDropDirection
          y === i.AutoStrict &&
            (m < v.y + v.height + C + h
              ? ((y = i.Top), (x = r.FromBottomToTop))
              : ((y = i.Bottom), (x = r.FromTopToBottom)))
          const k = y === i.Top ? -1 * C : C,
            w = p === o.Right ? v.right : v.left,
            A = y === i.Top ? v.top : v.bottom,
            b = {
              x: w - (f === a.FromRightToLeft ? d : 0) + g,
              y: A - (x === r.FromBottomToTop ? h : 0) + k,
            }
          return E && (b.overrideWidth = v.width), b
        }
      }
    },
    84298: (e, t, n) => {
      n.r(t), n.d(t, { currencyActions: () => s })
      var i = n(50151),
        o = n(11542),
        r = n(89691),
        a = n(79188)
      function s(e, t, s) {
        if (null === t || t.readOnly) return []
        const c = [],
          l = (t) => {
            e.setPriceScaleCurrency(s, t)
          },
          u = t.selectedCurrency,
          d = t.originalCurrencies,
          h = t.baseCurrencies,
          m = t.displayedValues,
          v = a.favoriteCurrencyUnitConversionService.get().currencies,
          p = { id: 'first_section', actions: [] }
        if (d.size > 1) {
          const e = (0, r.createAction)(
            'Mixed',
            o.t(null, void 0, n(95093)),
            void 0,
            void 0,
            null === t.selectedCurrency,
            () => l(null),
          )
          p.actions.push(e)
        }
        const f = e.model().availableCurrencies()
        if (null !== u) {
          const e = (0, i.ensureNotNull)(f.item(u)),
            t = (0, r.createAction)(
              u,
              (0, i.ensureDefined)(m.get(u)),
              e.logoUrl,
              e.description,
              !0,
              () => {},
              v.has(u),
              () =>
                a.favoriteCurrencyUnitConversionService.toggle('currencies', u),
            )
          p.actions.push(t)
        }
        const g = f.filterConvertible(h, (e) => e !== u && d.has(e))
        for (const e of g) {
          const n = (0, i.ensureNotNull)(f.item(e.id))
          p.actions.push(
            (0, r.createAction)(
              e.id,
              e.code,
              n.logoUrl,
              n.description,
              t.selectedCurrency === e.id,
              () => l(e.id),
              v.has(e.id),
              () =>
                a.favoriteCurrencyUnitConversionService.toggle(
                  'currencies',
                  e.id,
                ),
            ),
          )
        }
        p.actions.length > 0 && c.push(p)
        const C = f.filterConvertible(h, (e) => e !== u && !d.has(e)),
          E = [],
          y = []
        for (const e of C) {
          const n = (0, i.ensureNotNull)(f.item(e.id)),
            o = v.has(e.id),
            s = (0, r.createAction)(
              e.id,
              e.code,
              n.logoUrl,
              n.description,
              t.selectedCurrency === e.id,
              () => l(e.id),
              o,
              () =>
                a.favoriteCurrencyUnitConversionService.toggle(
                  'currencies',
                  e.id,
                ),
            )
          o ? E.push(s) : y.push(s)
        }
        return (
          (y.length > 0 || E.length > 0) &&
            c.push({ id: 'second_section', actions: E.concat(y) }),
          c
        )
      }
    },
    79188: (e, t, n) => {
      n.d(t, { favoriteCurrencyUnitConversionService: () => s })
      var i = n(56840),
        o = n(21097),
        r = n(68456)
      class a extends r.AbstractJsonStoreService {
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
      const s = new a(o.TVXWindowEvents, i)
    },
    14818: (e, t, n) => {
      n.r(t), n.d(t, { unitActions: () => s })
      var i = n(50151),
        o = n(11542),
        r = n(89691),
        a = n(79188)
      function s(e, t, s) {
        if (null === t || 0 === t.availableGroups.size) return []
        const c = [],
          l = (t) => {
            e.setPriceScaleUnit(s, t)
          },
          u = t.selectedUnit,
          d = t.originalUnits,
          h = t.names,
          m = t.descriptions,
          v = a.favoriteCurrencyUnitConversionService.get().units,
          p = { actions: [], id: 'first_section' }
        if (d.size > 1) {
          const e = (0, r.createAction)(
            'Mixed',
            o.t(null, void 0, n(95093)),
            void 0,
            void 0,
            null === t.selectedUnit,
            () => l(null),
          )
          p.actions.push(e)
        }
        const f = e.model().availableUnits()
        if (null !== u) {
          const e = (0, r.createAction)(
            u,
            (0, i.ensureDefined)(h.get(u)),
            void 0,
            (0, i.ensureDefined)(m.get(u)),
            !0,
            () => {},
            v.has(u),
            () => a.favoriteCurrencyUnitConversionService.toggle('units', u),
          )
          p.actions.push(e)
        }
        const g = f.unitsByGroups(t.availableGroups),
          C = [],
          E = []
        for (const e of g)
          for (const t of e.units) {
            const e = v.has(t.id)
            if (t.id === u || (!e && !d.has(t.id))) continue
            const n = (0, r.createAction)(
              t.id,
              t.name,
              void 0,
              t.description,
              !1,
              () => l(t.id),
              e,
              () =>
                a.favoriteCurrencyUnitConversionService.toggle('units', t.id),
            )
            e ? E.push(n) : C.push(n)
          }
        ;(C.length > 0 || E.length > 0) &&
          p.actions.push(
            ...E.sort((e, t) =>
              e.label.toLowerCase().localeCompare(t.label.toLowerCase()),
            ),
            ...C,
          ),
          p.actions.length > 0 && c.push(p)
        const y = u && f.unitGroupById(u)
        if (null !== y)
          for (const e of g) {
            if (e.name !== y) continue
            const t = []
            for (const n of e.units)
              n.id === u ||
                d.has(n.id) ||
                v.has(n.id) ||
                t.push(
                  (0, r.createAction)(
                    n.id,
                    n.name,
                    void 0,
                    n.description,
                    !1,
                    () => l(n.id),
                    !1,
                    () =>
                      a.favoriteCurrencyUnitConversionService.toggle(
                        'units',
                        n.id,
                      ),
                  ),
                )
            t.length > 0 && c.push({ id: e.name, name: e.name, actions: t })
          }
        for (const e of g) {
          if (e.name === y) continue
          const t = []
          for (const n of e.units)
            n.id === u ||
              d.has(n.id) ||
              v.has(n.id) ||
              t.push(
                (0, r.createAction)(
                  n.id,
                  n.name,
                  void 0,
                  n.description,
                  !1,
                  () => l(n.id),
                  !1,
                  () =>
                    a.favoriteCurrencyUnitConversionService.toggle(
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
    89691: (e, t, n) => {
      function i(e, t, n, i, o, r, a, s) {
        return {
          id: e,
          label: t,
          icon: n,
          description: i,
          isActive: o,
          onClick: r,
          isFavorite: a,
          onFavoriteClick: s,
        }
      }
      n.d(t, { createAction: () => i })
    },
    51417: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M11.85 11.93A5.48 5.48 0 0 0 8 2.5a5.5 5.5 0 1 0 3.85 9.43zm0 0L16 16"/></svg>'
    },
    578: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8" width="16" height="8"><path fill="currentColor" d="M0 1.475l7.396 6.04.596.485.593-.49L16 1.39 14.807 0 7.393 6.122 8.58 6.12 1.186.08z"/></svg>'
    },
    69311: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M9.7 9l4.65-4.65-.7-.7L9 8.29 4.35 3.65l-.7.7L8.29 9l-4.64 4.65.7.7L9 9.71l4.65 4.64.7-.7L9.71 9z"/></svg>'
    },
    69859: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"><path stroke="currentColor" d="M12.4 12.5a7 7 0 1 0-4.9 2 7 7 0 0 0 4.9-2zm0 0l5.101 5"/></svg>'
    },
    39146: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" d="M9 1l2.35 4.76 5.26.77-3.8 3.7.9 5.24L9 13l-4.7 2.47.9-5.23-3.8-3.71 5.25-.77L9 1z"/></svg>'
    },
    48010: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M9 2.13l1.903 3.855.116.236.26.038 4.255.618-3.079 3.001-.188.184.044.259.727 4.237-3.805-2L9 12.434l-.233.122-3.805 2.001.727-4.237.044-.26-.188-.183-3.079-3.001 4.255-.618.26-.038.116-.236L9 2.13z"/></svg>'
    },
    25931: (e, t, n) => {
      n.d(t, { nanoid: () => i })
      const i = (e = 21) =>
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
    44629: (e) => {
      e.exports = {
        ar: ['اضف إلى القائمة التفضيلات'],
        ca_ES: ['Afegeix a preferits'],
        cs: ['Přidat do oblíbených'],
        de: ['Zu Favoriten hinzufügen'],
        el: ['Προσθήκη στα αγαπημένα'],
        en: 'Add to favorites',
        es: ['Añadir a favoritos'],
        fa: ['افزودن به موارد مورد علاقه'],
        fr: ['Ajouter aux favoris'],
        he_IL: ['הוסף למועדפים'],
        hu_HU: ['Hozzáadás kedvencekhez'],
        id_ID: ['Tambah ke daftar favorit'],
        it: ['Aggiungi ai preferiti'],
        ja: ['お気に入りに追加'],
        ko: ['즐겨찾기에 넣기'],
        ms_MY: ['Tambah kepada kegemaran'],
        nl_NL: ['Voeg toe aan favorieten'],
        pl: ['Dodaj do ulubionych'],
        pt: ['Adicionar aos favoritos'],
        ro: 'Add to favorites',
        ru: ['Добавить в избранное'],
        sv: ['Lägg till som favorit'],
        th: ['เพิ่มลงรายการโปรด'],
        tr: ['Favorilere ekle'],
        vi: ['Thêm vào mục yêu thích'],
        zh: ['添加到收藏'],
        zh_TW: ['加入收藏'],
      }
    },
    52298: (e) => {
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
    72482: (e) => {
      e.exports = {
        ar: ['حذف من القائمة المفضلة'],
        ca_ES: ['Treure de preferits'],
        cs: ['Odebrat z oblíbených'],
        de: ['Aus Favoriten entfernen'],
        el: ['Διαγραφή απο τα αγαπημένα'],
        en: 'Remove from favorites',
        es: ['Quitar de favoritos'],
        fa: ['حذف از موارد مورد علاقه'],
        fr: ['Retirer des favoris'],
        he_IL: ['הסר ממועדפים'],
        hu_HU: ['Eltávolít kedvencek közül'],
        id_ID: ['Hilangkan dari favorit'],
        it: ['Rimuovi dai preferiti'],
        ja: ['お気に入りから削除'],
        ko: ['즐겨찾기지움'],
        ms_MY: ['Buang dari kegemaran'],
        nl_NL: ['Verwijder van favorieten'],
        pl: ['Usuń z ulubionych'],
        pt: ['Remover dos favoritos'],
        ro: 'Remove from favorites',
        ru: ['Удалить из предпочтений'],
        sv: ['Ta bort från favoriter'],
        th: ['ลบออกจากรายการโปรด'],
        tr: ['Favorilerimden çıkar'],
        vi: ['Loại bỏ khỏi mục yêu thích'],
        zh: ['从收藏中移除'],
        zh_TW: ['從收藏移除'],
      }
    },
  },
])
