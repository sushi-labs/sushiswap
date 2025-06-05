;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5009],
  {
    46188: (e) => {
      e.exports = {
        container: 'container-AhaeiE0y',
        list: 'list-AhaeiE0y',
        overlayScrollWrap: 'overlayScrollWrap-AhaeiE0y',
        scroll: 'scroll-AhaeiE0y',
      }
    },
    12961: (e) => {
      e.exports = { container: 'container-huGG8x61', title: 'title-huGG8x61' }
    },
    12228: (e) => {
      e.exports = {
        itemRow: 'itemRow-BadjY5sX',
        favoriteButton: 'favoriteButton-BadjY5sX',
        active: 'active-BadjY5sX',
        selected: 'selected-BadjY5sX',
        mobile: 'mobile-BadjY5sX',
        itemInfo: 'itemInfo-BadjY5sX',
        title: 'title-BadjY5sX',
        details: 'details-BadjY5sX',
        itemInfoWithPadding: 'itemInfoWithPadding-BadjY5sX',
        favorite: 'favorite-BadjY5sX',
        removeButton: 'removeButton-BadjY5sX',
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
    64409: (e) => {
      e.exports = {
        container: 'container-RZoAcQrm',
        labelWrap: 'labelWrap-RZoAcQrm',
        icon: 'icon-RZoAcQrm',
        text: 'text-RZoAcQrm',
      }
    },
    33476: (e) => {
      e.exports = { sortButton: 'sortButton-mMR_mxxG', icon: 'icon-mMR_mxxG' }
    },
    45300: (e) => {
      e.exports = {}
    },
    75623: (e) => {
      e.exports = { highlighted: 'highlighted-cwp8YRo6' }
    },
    71986: (e) => {
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
    39416: (e, t, n) => {
      n.d(t, { useFunctionalRefObject: () => i })
      var a = n(50959),
        o = n(43010)
      function i(e) {
        const t = (0, a.useMemo)(
            () =>
              ((e) => {
                const t = (n) => {
                  e(n), (t.current = n)
                }
                return (t.current = null), t
              })((e) => {
                l.current(e)
              }),
            [],
          ),
          n = (0, a.useRef)(null),
          i = (t) => {
            if (null === t) return r(n.current, t), void (n.current = null)
            n.current !== e && ((n.current = e), r(n.current, t))
          },
          l = (0, a.useRef)(i)
        return (
          (l.current = i),
          (0, o.useIsomorphicLayoutEffect)(() => {
            if (null !== t.current)
              return l.current(t.current), () => l.current(null)
          }, [e]),
          t
        )
      }
      function r(e, t) {
        null !== e && ('function' == typeof e ? e(t) : (e.current = t))
      }
    },
    43010: (e, t, n) => {
      n.d(t, { useIsomorphicLayoutEffect: () => o })
      var a = n(50959)
      function o(e, t) {
        ;('undefined' == typeof window ? a.useEffect : a.useLayoutEffect)(e, t)
      }
    },
    27267: (e, t, n) => {
      function a(e, t, n, a, o) {
        function i(o) {
          if (e > o.timeStamp) return
          const i = o.target
          void 0 !== n &&
            null !== t &&
            null !== i &&
            i.ownerDocument === a &&
            (t.contains(i) || n(o))
        }
        return (
          o.click && a.addEventListener('click', i, !1),
          o.mouseDown && a.addEventListener('mousedown', i, !1),
          o.touchEnd && a.addEventListener('touchend', i, !1),
          o.touchStart && a.addEventListener('touchstart', i, !1),
          () => {
            a.removeEventListener('click', i, !1),
              a.removeEventListener('mousedown', i, !1),
              a.removeEventListener('touchend', i, !1),
              a.removeEventListener('touchstart', i, !1)
          }
        )
      }
      n.d(t, { addOutsideEventListener: () => a })
    },
    90186: (e, t, n) => {
      function a(e) {
        return i(e, r)
      }
      function o(e) {
        return i(e, l)
      }
      function i(e, t) {
        const n = Object.entries(e).filter(t),
          a = {}
        for (const [e, t] of n) a[e] = t
        return a
      }
      function r(e) {
        const [t, n] = e
        return 0 === t.indexOf('data-') && 'string' == typeof n
      }
      function l(e) {
        return 0 === e[0].indexOf('aria-')
      }
      n.d(t, {
        filterAriaProps: () => o,
        filterDataProps: () => a,
        filterProps: () => i,
        isAriaAttribute: () => l,
        isDataAttribute: () => r,
      })
    },
    64530: (e, t, n) => {
      n.d(t, { DialogContentItem: () => m })
      var a = n(50959),
        o = n(97754),
        i = n.n(o),
        r = n(49483),
        l = n(36189),
        s = n(96040)
      function c(e) {
        const { url: t, ...n } = e
        return t
          ? a.createElement('a', { ...n, href: t })
          : a.createElement('div', { ...n })
      }
      var u = n(12228)
      function m(e) {
        const {
          title: t,
          subtitle: n,
          removeBtnLabel: o,
          onClick: m,
          onClickFavorite: h,
          onClickRemove: f,
          isActive: g,
          isSelected: y,
          isFavorite: v,
          isMobile: p = !1,
          showFavorite: _ = !0,
          ...b
        } = e
        return a.createElement(
          c,
          {
            ...b,
            className: i()(
              u.itemRow,
              g && !y && u.active,
              p && u.mobile,
              y && u.selected,
            ),
            onClick: d.bind(null, m),
            'data-role': 'list-item',
            'data-active': g,
          },
          _ &&
            h &&
            a.createElement(l.FavoriteButton, {
              className: i()(
                u.favoriteButton,
                v && u.favorite,
                r.CheckMobile.any() && u.mobile,
              ),
              isActive: g && !y,
              isFilled: v,
              onClick: d.bind(null, h),
              'data-name': 'list-item-favorite-button',
              'data-favorite': v,
            }),
          a.createElement(
            'div',
            { className: i()(u.itemInfo, !_ && u.itemInfoWithPadding) },
            a.createElement(
              'div',
              {
                className: i()(u.title, g && !y && u.active, p && u.mobile),
                'data-name': 'list-item-title',
              },
              t,
            ),
            a.createElement(
              'div',
              { className: i()(u.details, g && !y && u.active, p && u.mobile) },
              n,
            ),
          ),
          a.createElement(s.RemoveButton, {
            className: u.removeButton,
            isActive: g && !y,
            onClick: d.bind(null, f),
            'data-name': 'list-item-remove-button',
            title: o,
          }),
        )
      }
      function d(e, t) {
        t.defaultPrevented || (t.preventDefault(), e(t))
      }
    },
    69654: (e, t, n) => {
      n.d(t, { DialogSearch: () => u })
      var a = n(50959),
        o = n(97754),
        i = n.n(o),
        r = n(11542),
        l = n(9745),
        s = n(69859),
        c = n(40281)
      function u(e) {
        const {
          children: t,
          renderInput: o,
          onCancel: u,
          containerClassName: d,
          inputContainerClassName: h,
          iconClassName: f,
          ...g
        } = e
        return a.createElement(
          'div',
          { className: i()(c.container, d) },
          a.createElement(
            'div',
            { className: i()(c.inputContainer, h, u && c.withCancel) },
            o || a.createElement(m, { ...g }),
          ),
          t,
          a.createElement(l.Icon, { className: i()(c.icon, f), icon: s }),
          u &&
            a.createElement(
              'div',
              { className: c.cancel, onClick: u },
              r.t(null, void 0, n(20036)),
            ),
        )
      }
      function m(e) {
        const {
          className: t,
          reference: n,
          value: o,
          onChange: r,
          onFocus: l,
          onBlur: s,
          onKeyDown: u,
          onSelect: m,
          placeholder: d,
          ...h
        } = e
        return a.createElement('input', {
          ...h,
          ref: n,
          type: 'text',
          className: i()(t, c.input),
          autoComplete: 'off',
          'data-role': 'search',
          placeholder: d,
          value: o,
          onChange: r,
          onFocus: l,
          onBlur: s,
          onSelect: m,
          onKeyDown: u,
        })
      }
    },
    76068: (e, t, n) => {
      n.d(t, { CircleLogo: () => r, hiddenCircleLogoClass: () => i })
      var a = n(50959),
        o = n(58492)
      n(45300)
      const i = 'tv-circle-logo--visually-hidden'
      function r(e) {
        var t, n
        const i = (0, o.getStyleClasses)(e.size, e.className),
          r =
            null !== (n = null !== (t = e.alt) && void 0 !== t ? t : e.title) &&
            void 0 !== n
              ? n
              : ''
        return (0, o.isCircleLogoWithUrlProps)(e)
          ? a.createElement('img', {
              className: i,
              crossOrigin: '',
              src: e.logoUrl,
              alt: r,
              title: e.title,
              loading: e.loading,
              'aria-label': e['aria-label'],
              'aria-hidden': e['aria-hidden'],
            })
          : a.createElement(
              'span',
              {
                className: i,
                title: e.title,
                'aria-label': e['aria-label'],
                'aria-hidden': e['aria-hidden'],
              },
              e.placeholderLetter,
            )
      }
    },
    58492: (e, t, n) => {
      n.d(t, { getStyleClasses: () => o, isCircleLogoWithUrlProps: () => i })
      var a = n(97754)
      function o(e, t) {
        return a('tv-circle-logo', `tv-circle-logo--${e}`, t)
      }
      function i(e) {
        return 'logoUrl' in e && void 0 !== e.logoUrl && 0 !== e.logoUrl.length
      }
    },
    19785: (e, t, n) => {
      n.d(t, {
        createRegExpList: () => i,
        getHighlightedChars: () => r,
        rankedSearch: () => o,
      })
      var a = n(1722)
      function o(e) {
        const {
          data: t,
          rules: n,
          queryString: o,
          isPreventedFromFiltering: i,
          primaryKey: r,
          secondaryKey: l = r,
          optionalPrimaryKey: s,
          tertiaryKey: c,
        } = e
        return t
          .map((e) => {
            const t = s && e[s] ? e[s] : e[r],
              i = e[l],
              u = c && e[c]
            let m,
              d = 0
            return (
              n.forEach((e) => {
                var n, r, l, s, c
                const { re: h, fullMatch: f } = e
                if (
                  ((h.lastIndex = 0),
                  (0, a.isString)(t) &&
                    t &&
                    t.toLowerCase() === o.toLowerCase())
                )
                  return (
                    (d = 4),
                    void (m =
                      null === (n = t.match(f)) || void 0 === n
                        ? void 0
                        : n.index)
                  )
                if ((0, a.isString)(t) && f.test(t))
                  return (
                    (d = 3),
                    void (m =
                      null === (r = t.match(f)) || void 0 === r
                        ? void 0
                        : r.index)
                  )
                if ((0, a.isString)(i) && f.test(i))
                  return (
                    (d = 2),
                    void (m =
                      null === (l = i.match(f)) || void 0 === l
                        ? void 0
                        : l.index)
                  )
                if ((0, a.isString)(i) && h.test(i))
                  return (
                    (d = 2),
                    void (m =
                      null === (s = i.match(h)) || void 0 === s
                        ? void 0
                        : s.index)
                  )
                if (Array.isArray(u))
                  for (const e of u)
                    if (f.test(e))
                      return (
                        (d = 1),
                        void (m =
                          null === (c = e.match(f)) || void 0 === c
                            ? void 0
                            : c.index)
                      )
              }),
              { matchPriority: d, matchIndex: m, item: e }
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
      function i(e, t) {
        const n = [],
          a = e.toLowerCase(),
          o =
            e
              .split('')
              .map((e, t) => `(${0 !== t ? `[/\\s-]${l(e)}` : l(e)})`)
              .join('(.*?)') + '(.*)'
        return (
          n.push({
            fullMatch: new RegExp(`(${l(e)})`, 'i'),
            re: new RegExp(`^${o}`, 'i'),
            reserveRe: new RegExp(o, 'i'),
            fuzzyHighlight: !0,
          }),
          t &&
            Object.hasOwn(t, a) &&
            n.push({ fullMatch: t[a], re: t[a], fuzzyHighlight: !1 }),
          n
        )
      }
      function r(e, t, n) {
        const a = []
        return e && n
          ? (n.forEach((e) => {
              const { fullMatch: n, re: o, reserveRe: i } = e
              ;(n.lastIndex = 0), (o.lastIndex = 0)
              const r = n.exec(t),
                l = r || o.exec(t) || (i && i.exec(t))
              if (((e.fuzzyHighlight = !r), l))
                if (e.fuzzyHighlight) {
                  let e = l.index
                  for (let t = 1; t < l.length; t++) {
                    const n = l[t],
                      o = l[t].length
                    if (t % 2) {
                      const t =
                        n.startsWith(' ') ||
                        n.startsWith('/') ||
                        n.startsWith('-')
                      a[t ? e + 1 : e] = !0
                    }
                    e += o
                  }
                } else for (let e = 0; e < l[0].length; e++) a[l.index + e] = !0
            }),
            a)
          : a
      }
      function l(e) {
        return e.replace(/[!-/[-^{-}?]/g, '\\$&')
      }
    },
    24637: (e, t, n) => {
      n.d(t, { HighlightedText: () => l })
      var a = n(50959),
        o = n(97754),
        i = n(19785),
        r = n(75623)
      function l(e) {
        const { queryString: t, rules: n, text: l, className: s } = e,
          c = (0, a.useMemo)(
            () => (0, i.getHighlightedChars)(t, l, n),
            [t, n, l],
          )
        return a.createElement(
          a.Fragment,
          null,
          c.length
            ? l
                .split('')
                .map((e, t) =>
                  a.createElement(
                    a.Fragment,
                    { key: t },
                    c[t]
                      ? a.createElement(
                          'span',
                          { className: o(r.highlighted, s) },
                          e,
                        )
                      : a.createElement('span', null, e),
                  ),
                )
            : l,
        )
      }
    },
    16396: (e, t, n) => {
      n.d(t, { DEFAULT_POPUP_MENU_ITEM_THEME: () => c, PopupMenuItem: () => m })
      var a = n(50959),
        o = n(97754),
        i = n(51768),
        r = n(59064),
        l = n(76068),
        s = n(71986)
      const c = s
      function u(e) {
        e.stopPropagation()
      }
      function m(e) {
        const {
            id: t,
            role: n,
            className: c,
            title: m,
            labelRowClassName: d,
            labelClassName: h,
            toolboxClassName: f,
            shortcut: g,
            forceShowShortcuts: y,
            icon: v,
            iconClassname: p,
            isActive: _,
            isDisabled: b,
            isHovered: C,
            appearAsDisabled: w,
            label: k,
            link: E,
            showToolboxOnHover: L,
            showToolboxOnFocus: D,
            target: S,
            rel: A,
            toolbox: x,
            reference: N,
            onMouseOut: M,
            onMouseOver: F,
            onKeyDown: z,
            suppressToolboxClick: T = !0,
            theme: I = s,
            tabIndex: B,
            tagName: R,
            renderComponent: Z,
            roundedIcon: j,
            iconAriaProps: P,
            circleLogo: O,
            dontClosePopup: W,
            onClick: H,
            onClickArg: q,
            trackEventObject: Y,
            trackMouseWheelClick: U,
            trackRightClick: V,
            ...J
          } = e,
          K = (0, a.useRef)(null),
          $ = (0, a.useMemo)(
            () =>
              ((e) => {
                function t(t) {
                  const { reference: n, ...o } = t,
                    i = null != e ? e : o.href ? 'a' : 'div',
                    r =
                      'a' === i
                        ? o
                        : ((e) => {
                            const {
                              download: t,
                              href: n,
                              hrefLang: a,
                              media: o,
                              ping: i,
                              rel: r,
                              target: l,
                              type: s,
                              referrerPolicy: c,
                              ...u
                            } = e
                            return u
                          })(o)
                  return a.createElement(i, { ...r, ref: n })
                }
                return (t.displayName = `DefaultComponent(${e})`), t
              })(R),
            [R],
          ),
          X = null != Z ? Z : $
        return a.createElement(
          X,
          {
            ...J,
            id: t,
            role: n,
            className: o(c, I.item, v && I.withIcon, {
              [I.isActive]: _,
              [I.isDisabled]: b || w,
              [I.hovered]: C,
            }),
            title: m,
            href: E,
            target: S,
            rel: A,
            reference: (e) => {
              ;(K.current = e), 'function' == typeof N && N(e)
              'object' == typeof N && (N.current = e)
            },
            onClick: (e) => {
              if (b) return
              Y && (0, i.trackEvent)(Y.category, Y.event, Y.label)
              H && H(q, e)
              W || (0, r.globalCloseMenu)()
            },
            onContextMenu: (e) => {
              Y &&
                V &&
                (0, i.trackEvent)(Y.category, Y.event, `${Y.label}_rightClick`)
            },
            onMouseUp: (e) => {
              if (1 === e.button && E && Y) {
                let e = Y.label
                U && (e += '_mouseWheelClick'),
                  (0, i.trackEvent)(Y.category, Y.event, e)
              }
            },
            onMouseOver: F,
            onMouseOut: M,
            onKeyDown: z,
            tabIndex: B,
          },
          O &&
            a.createElement(l.CircleLogo, {
              ...P,
              className: s['disclosure-item-circle-logo'],
              size: 'xxxsmall',
              logoUrl: O.logoUrl,
              placeholderLetter: O.placeholderLetter,
            }),
          v &&
            a.createElement('span', {
              'aria-label': P && P['aria-label'],
              'aria-hidden': P && Boolean(P['aria-hidden']),
              className: o(I.icon, j && s['round-icon'], p),
              dangerouslySetInnerHTML: { __html: v },
            }),
          a.createElement(
            'span',
            { className: o(I.labelRow, d) },
            a.createElement('span', { className: o(I.label, h) }, k),
          ),
          (void 0 !== g || y) &&
            a.createElement(
              'span',
              { className: I.shortcut },
              (G = g) && G.split('+').join(' + '),
            ),
          void 0 !== x &&
            a.createElement(
              'span',
              {
                onClick: T ? u : void 0,
                className: o(f, I.toolbox, {
                  [I.showOnHover]: L,
                  [I.showOnFocus]: D,
                }),
              },
              x,
            ),
        )
        var G
      }
    },
    20520: (e, t, n) => {
      n.d(t, { PopupMenu: () => d })
      var a = n(50959),
        o = n(962),
        i = n(62942),
        r = n(42842),
        l = n(27317),
        s = n(29197)
      const c = a.createContext(void 0)
      var u = n(36383)
      const m = a.createContext({ setMenuMaxWidth: !1 })
      function d(e) {
        const {
            controller: t,
            children: n,
            isOpened: d,
            closeOnClickOutside: h = !0,
            doNotCloseOn: f,
            onClickOutside: g,
            onClose: y,
            onKeyboardClose: v,
            'data-name': p = 'popup-menu-container',
            ..._
          } = e,
          b = (0, a.useContext)(s.CloseDelegateContext),
          C = a.useContext(m),
          w = (0, a.useContext)(c),
          k = (0, u.useOutsideEvent)({
            handler: (e) => {
              g && g(e)
              if (!h) return
              const t = (0, i.default)(f) ? f() : null == f ? [] : [f]
              if (t.length > 0 && e.target instanceof Node)
                for (const n of t) {
                  const t = o.findDOMNode(n)
                  if (t instanceof Node && t.contains(e.target)) return
                }
              y()
            },
            mouseDown: !0,
            touchStart: !0,
          })
        return d
          ? a.createElement(
              r.Portal,
              {
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                pointerEvents: 'none',
              },
              a.createElement(
                'span',
                { ref: k, style: { pointerEvents: 'auto' } },
                a.createElement(
                  l.Menu,
                  {
                    ..._,
                    onClose: y,
                    onKeyboardClose: v,
                    onScroll: (t) => {
                      const { onScroll: n } = e
                      n && n(t)
                    },
                    customCloseDelegate: b,
                    customRemeasureDelegate: w,
                    ref: t,
                    'data-name': p,
                    limitMaxWidth: C.setMenuMaxWidth,
                  },
                  n,
                ),
              ),
            )
          : null
      }
    },
    29276: (e) => {
      e.exports = { highlight: 'highlight-6tu1aYjZ', active: 'active-6tu1aYjZ' }
    },
    47541: (e) => {
      e.exports = {
        dialog: 'dialog-T4Q8BJPb',
        contentList: 'contentList-T4Q8BJPb',
        contentHeader: 'contentHeader-T4Q8BJPb',
      }
    },
    12811: (e, t, n) => {
      n.d(t, {
        HorizontalAttachEdge: () => o,
        HorizontalDropDirection: () => r,
        VerticalAttachEdge: () => a,
        VerticalDropDirection: () => i,
        getPopupPositioner: () => c,
      })
      var a,
        o,
        i,
        r,
        l = n(50151)
      !((e) => {
        ;(e[(e.Top = 0)] = 'Top'),
          (e[(e.Bottom = 1)] = 'Bottom'),
          (e[(e.AutoStrict = 2)] = 'AutoStrict')
      })(a || (a = {})),
        ((e) => {
          ;(e[(e.Left = 0)] = 'Left'), (e[(e.Right = 1)] = 'Right')
        })(o || (o = {})),
        ((e) => {
          ;(e[(e.FromTopToBottom = 0)] = 'FromTopToBottom'),
            (e[(e.FromBottomToTop = 1)] = 'FromBottomToTop')
        })(i || (i = {})),
        ((e) => {
          ;(e[(e.FromLeftToRight = 0)] = 'FromLeftToRight'),
            (e[(e.FromRightToLeft = 1)] = 'FromRightToLeft')
        })(r || (r = {}))
      const s = {
        verticalAttachEdge: a.Bottom,
        horizontalAttachEdge: o.Left,
        verticalDropDirection: i.FromTopToBottom,
        horizontalDropDirection: r.FromLeftToRight,
        verticalMargin: 0,
        horizontalMargin: 0,
        matchButtonAndListboxWidths: !1,
      }
      function c(e, t) {
        return (n) => {
          var c, u
          const { contentWidth: m, contentHeight: d, availableHeight: h } = n,
            f = (0, l.ensureNotNull)(e).getBoundingClientRect(),
            {
              horizontalAttachEdge: g = s.horizontalAttachEdge,
              horizontalDropDirection: y = s.horizontalDropDirection,
              horizontalMargin: v = s.horizontalMargin,
              verticalMargin: p = s.verticalMargin,
              matchButtonAndListboxWidths: _ = s.matchButtonAndListboxWidths,
            } = t
          let b =
              null !== (c = t.verticalAttachEdge) && void 0 !== c
                ? c
                : s.verticalAttachEdge,
            C =
              null !== (u = t.verticalDropDirection) && void 0 !== u
                ? u
                : s.verticalDropDirection
          b === a.AutoStrict &&
            (h < f.y + f.height + p + d
              ? ((b = a.Top), (C = i.FromBottomToTop))
              : ((b = a.Bottom), (C = i.FromTopToBottom)))
          const w = b === a.Top ? -1 * p : p,
            k = g === o.Right ? f.right : f.left,
            E = b === a.Top ? f.top : f.bottom,
            L = {
              x: k - (y === r.FromRightToLeft ? m : 0) + v,
              y: E - (C === i.FromBottomToTop ? d : 0) + w,
            }
          return _ && (L.overrideWidth = f.width), L
        }
      }
    },
    34557: (e, t, n) => {
      n.r(t), n.d(t, { LoadChartDialogRenderer: () => ie })
      var a = n(50959),
        o = n(962),
        i = n(97754),
        r = n.n(i),
        l = n(50151),
        s = n(11542),
        c = n(56840),
        u = n(49483),
        m = n(35057),
        d = n(20520),
        h = n(12811),
        f = n(9745),
        g = n(44563),
        y = n(645),
        v = n(33476)
      function p(e) {
        const { sortDirection: t, children: n, ...o } = e,
          r = (0, a.useRef)(null),
          [l, s] = (0, a.useState)(!1)
        return a.createElement(
          'div',
          {
            ...o,
            ref: r,
            className: i(
              v.sortButton,
              'apply-common-tooltip',
              'common-tooltip-vertical',
            ),
            onClick: () => {
              s(!l)
            },
          },
          a.createElement(f.Icon, { className: v.icon, icon: 0 === t ? g : y }),
          a.createElement(
            d.PopupMenu,
            {
              doNotCloseOn: r.current,
              isOpened: l,
              onClose: () => {
                s(!1)
              },
              position: (0, h.getPopupPositioner)(r.current, {
                verticalMargin: -35,
                verticalAttachEdge: 0,
              }),
            },
            n,
          ),
        )
      }
      var _ = n(16396),
        b = n(64409)
      function C(e) {
        const {
            label: t,
            listSortField: n,
            itemSortField: o,
            listSortDirection: r,
            itemSortDirection: l,
            onClick: s,
            className: c,
            ...u
          } = e,
          m = o === n && l === r
        return a.createElement(_.PopupMenuItem, {
          ...u,
          className: i(b.container, c),
          label: a.createElement(
            'div',
            { className: b.labelWrap },
            a.createElement(f.Icon, {
              className: b.icon,
              icon: 0 === l ? g : y,
            }),
            a.createElement('span', { className: b.text }, t),
          ),
          isActive: m,
          onClick: () => {
            s(o, l)
          },
          'data-active': m.toString(),
          'data-sort-field': o,
          'data-sort-direction': 0 === l ? 'asc' : 'desc',
        })
      }
      var w = n(69654),
        k = n(12961)
      function E(e) {
        const { children: t, className: n } = e
        return a.createElement('div', { className: r()(k.container, n) }, t)
      }
      function L(e) {
        const { title: t } = e
        return a.createElement('div', { className: k.title }, t)
      }
      var D = n(50335)
      var S = n(20037),
        A = n(38223),
        x = n(898),
        N = n(33127)
      var M = n(3085),
        F = n(46188)
      function z(e) {
        const {
            className: t,
            onScroll: n,
            onTouchStart: o,
            reference: i,
            children: l,
            scrollbar: s,
            ...c
          } = e,
          [m, d] = (0, x.useDimensions)(),
          [h, f, g, y] = (0, N.useOverlayScroll)()
        return (
          (0, a.useEffect)(() => {
            const e = () => {}
            return u.isFF
              ? (document.addEventListener('wheel', () => e),
                () => {
                  document.removeEventListener('wheel', e)
                })
              : e
          }, []),
          a.createElement(
            'div',
            {
              ...('overlay' === s && f),
              className: r()(F.container, t),
              onTouchStart: o,
              onScrollCapture: n,
              ref: m,
            },
            'overlay' === s &&
              a.createElement(M.OverlayScrollContainer, {
                ...h,
                className: F.overlayScrollWrap,
              }),
            a.createElement(S.FixedSizeList, {
              ref: i,
              className: r()('native' === s ? F.scroll : F.list),
              outerRef: 'overlay' === s ? g : void 0,
              onItemsRendered: y,
              layout: 'vertical',
              width: '100%',
              height: (null == d ? void 0 : d.height) || 0,
              children: l,
              direction: (0, A.isRtl)() ? 'rtl' : 'ltr',
              ...c,
            }),
          )
        )
      }
      var T = n(84015)
      var I = n(14483),
        B = n(64530),
        R = n(94025),
        Z = n(50655),
        j = n(3615)
      var P = n(53741),
        O = n(79206),
        W = n(24637),
        H = n(19785),
        q = n(29276)
      const Y = new P.DateFormatter('dd-MM-yyyy'),
        U = new O.TimeFormatter(O.hourMinuteFormat),
        V = I.enabled('items_favoriting')
      function J(e) {
        const {
            chart: t,
            chartWidgetCollection: o,
            trackEvent: i,
            localFavorites: l,
            setLocalFavorites: c,
            onClose: u,
            searchString: m,
            onClickRemove: d,
            onRemoveCanceled: h,
            isSelected: f,
          } = e,
          [g, y] = (0, a.useState)(() => t.active()),
          [v, p] = (0, a.useState)(!1),
          _ = t.url
            ? ((e) => {
                const t = e.chartId ? `/chart/${e.chartId}/` : '/chart/',
                  n = new URL(t, location.href)
                return (
                  e.symbol && n.searchParams.append('symbol', e.symbol),
                  e.interval && n.searchParams.append('interval', e.interval),
                  e.style && n.searchParams.append('style', e.style),
                  (0, T.urlWithMobileAppParams)(n.href)
                )
              })({ chartId: t.url })
            : void 0,
          b = (0, a.useContext)(Z.SlotContext),
          C = (0, a.useMemo)(() => new Date(1e3 * t.modified), [t]),
          w = (0, a.useMemo)(() => (0, H.createRegExpList)(m), [m]),
          k = r()(q.highlight, g && q.active)
        return (
          (0, a.useEffect)(
            () => (
              o && o.metaInfo.id.subscribe(L),
              () => {
                o && o.metaInfo.id.unsubscribe(L)
              }
            ),
            [],
          ),
          a.createElement(B.DialogContentItem, {
            url: _,
            title: a.createElement(W.HighlightedText, {
              className: k,
              queryString: m,
              rules: w,
              text: t.title,
            }),
            subtitle: a.createElement(
              a.Fragment,
              null,
              a.createElement(W.HighlightedText, {
                className: k,
                queryString: m,
                rules: w,
                text: t.description,
              }),
              ' ',
              '(',
              Y.format(C).replace(/-/g, '.'),
              ' ',
              U.formatLocal(C),
              ')',
            ),
            onClick: (e) => {
              0
              t.openAction(), !1
            },
            onClickFavorite: () => {
              0
              const e = { ...l }
              e[t.id] ? delete e[t.id] : (e[t.id] = !0)
              t.favoriteAction(e).then(() => {
                0
              })
            },
            showFavorite: V,
            onClickRemove: async () => {
              if (v) return
              p(!0)
              const e = await (async (e) =>
                s.t(null, { replace: { name: e.title } }, n(69368)))(t)
              p(!1),
                ((e, t, n, a) => {
                  ;(0, j.showConfirm)(
                    {
                      text: e,
                      onConfirm: ({ dialogClose: e }) => {
                        t(), e()
                      },
                      onClose: () => {
                        n()
                      },
                    },
                    a,
                  )
                })(e, E, h, b)
            },
            isFavorite: Boolean(l[t.id]),
            isActive: g,
            isSelected: f,
            'data-name': 'load-chart-dialog-item',
          })
        )
        function E() {
          t.deleteAction().then(() => d(t.id))
        }
        function L(e) {
          y(t.id === e)
        }
      }
      var K = n(59064),
        $ = n(68335)
      var X = n(47541)
      const G = { sortField: 'modified', sortDirection: 1 },
        Q = ((e) => {
          const { paddingTop: t = 0, paddingBottom: n = 0 } = e
          return (0, a.forwardRef)(({ style: e, ...o }, i) => {
            const { height: r = 0 } = e
            return a.createElement('div', {
              ref: i,
              style: {
                ...e,
                height: `${((0, D.isNumber)(r) ? r : Number.parseFloat(r)) + t + n}px`,
              },
              ...o,
            })
          })
        })({ paddingBottom: 6 })
      function ee(e) {
        let t
        try {
          t = (0, R.getTranslatedResolution)(e)
        } catch (n) {
          t = e
        }
        return t
      }
      const te = I.enabled('items_favoriting'),
        ne = s.t(null, void 0, n(75789))
      function ae(e) {
        const {
            charts: t,
            onClose: o,
            favoriteChartsService: i,
            chartWidgetCollection: d,
          } = e,
          [h, f] = (0, a.useState)(''),
          [g, y] = (0, a.useState)(h),
          [v, _] = (0, a.useState)([]),
          b = (0, a.useRef)(null),
          [k, D] = (0, a.useState)(() => {
            if (i) return i.get()
            const e = {}
            return (
              t
                .filter((e) => e.favorite)
                .forEach((t) => {
                  e[t.id] = !0
                }),
              e
            )
          }),
          [S, A] = (0, a.useState)(() =>
            c.getJSON('loadChartDialog.viewState', G),
          ),
          x = (0, a.useRef)(null),
          N = (0, a.useRef)(null),
          M = (0, a.useMemo)(
            () =>
              t.map((e) => ({
                ...e,
                description: `${e.symbol}, ${ee(e.interval)}`,
              })),
            [t],
          )
        ;(0, a.useEffect)(() => {
          u.CheckMobile.any() || (0, l.ensureNotNull)(x.current).focus()
        }, [])
        const F = (0, a.useRef)()
        ;(0, a.useEffect)(
          () => (
            (F.current = setTimeout(() => {
              f(g)
            }, 300)),
            () => {
              clearTimeout(F.current)
            }
          ),
          [g],
        ),
          (0, a.useEffect)(
            () => (
              null == i || i.getOnChange().subscribe(null, q),
              () => {
                null == i || i.getOnChange().unsubscribe(null, q)
              }
            ),
            [],
          )
        const T = (0, a.useCallback)(() => !0, []),
          I = (0, a.useMemo)(() => {
            return (0, H.rankedSearch)({
              data: M.filter((e) => !v.includes(e.id)).sort(
                ((e = S.sortDirection),
                (t, n) => {
                  if (k[t.id] && !k[n.id]) return -1
                  if (!k[t.id] && k[n.id]) return 1
                  const a = 0 === e ? 1 : -1
                  return 'modified' === S.sortField
                    ? a * (t.modified - n.modified)
                    : a * t.title.localeCompare(n.title)
                }),
              ),
              rules: (0, H.createRegExpList)(h),
              queryString: h,
              primaryKey: 'title',
              secondaryKey: 'description',
            })
            var e
          }, [h, S, v, k]),
          {
            selectedItemIndex: B,
            setSelectedItemIndex: R,
            handleKeyboardSelection: Z,
          } = ((e, t, n) => {
            const [o, i] = (0, a.useState)(-1)
            return (
              (0, a.useEffect)(() => {
                var e
                ;-1 !== o &&
                  (null === (e = n.current) ||
                    void 0 === e ||
                    e.scrollToItem(o))
              }, [o]),
              {
                selectedItemIndex: o,
                setSelectedItemIndex: i,
                handleKeyboardSelection: (n) => {
                  switch ((0, $.hashFromEvent)(n)) {
                    case 40:
                      if (o === e - 1) return
                      i(o + 1)
                      break
                    case 38:
                      if (0 === o) return
                      if (-1 === o) return void i(o + 1)
                      i(o - 1)
                      break
                    case 13:
                      t(n)
                  }
                },
              }
            )
          })(
            I.length,
            (e) => {
              const t = I[B]
              if (-1 === B || !t) return
              0
              t.openAction(), !1
            },
            N,
          )
        return a.createElement(m.AdaptivePopupDialog, {
          ref: b,
          onClose: o,
          onClickOutside: o,
          onKeyDown: Z,
          isOpened: !0,
          className: X.dialog,
          title: ne,
          dataName: 'load-layout-dialog',
          render: () =>
            a.createElement(
              a.Fragment,
              null,
              a.createElement(w.DialogSearch, {
                reference: x,
                onChange: P,
                placeholder: s.t(null, void 0, n(52298)),
              }),
              a.createElement(
                E,
                { className: r()(!te && X.contentHeader) },
                a.createElement(L, { title: s.t(null, void 0, n(25653)) }),
                a.createElement(
                  p,
                  {
                    sortDirection: S.sortDirection,
                    title: s.t(null, void 0, n(41583)),
                    'data-name': 'load-chart-dialog-sort-button',
                  },
                  a.createElement(C, {
                    label: s.t(null, void 0, n(63479)),
                    listSortField: S.sortField,
                    itemSortField: 'title',
                    listSortDirection: S.sortDirection,
                    itemSortDirection: 0,
                    onClick: U,
                    'data-name': 'load-chart-dialog-sort-menu-item',
                  }),
                  a.createElement(C, {
                    label: s.t(null, void 0, n(96189)),
                    listSortField: S.sortField,
                    itemSortField: 'title',
                    listSortDirection: S.sortDirection,
                    itemSortDirection: 1,
                    onClick: U,
                    'data-name': 'load-chart-dialog-sort-menu-item',
                  }),
                  a.createElement(C, {
                    label: s.t(null, void 0, n(38212)),
                    listSortField: S.sortField,
                    itemSortField: 'modified',
                    listSortDirection: S.sortDirection,
                    itemSortDirection: 0,
                    onClick: U,
                    'data-name': 'load-chart-dialog-sort-menu-item',
                  }),
                  a.createElement(C, {
                    label: s.t(null, void 0, n(63037)),
                    listSortField: S.sortField,
                    itemSortField: 'modified',
                    listSortDirection: S.sortDirection,
                    itemSortDirection: 1,
                    onClick: U,
                    'data-name': 'load-chart-dialog-sort-menu-item',
                  }),
                ),
              ),
              a.createElement(z, {
                scrollbar: 'native',
                reference: N,
                itemCount: I.length,
                itemSize: 52,
                className: X.contentList,
                onScroll: j,
                innerElementType: Q,
                itemKey: (e) => (k[I[e].id] ? 'f_' : '') + I[e].id,
                children: ({ style: e, index: t }) =>
                  a.createElement(
                    'div',
                    { style: e },
                    a.createElement(J, {
                      chart: I[t],
                      onClose: o,
                      chartWidgetCollection: d,
                      trackEvent: O,
                      onRemoveCanceled: Y,
                      localFavorites: k,
                      setLocalFavorites: D,
                      searchString: h,
                      onClickRemove: W,
                      isSelected: t === B,
                    }),
                  ),
              }),
            ),
          forceCloseOnEsc: T,
        })
        function j() {
          K.globalCloseDelegate.fire()
        }
        function P(e) {
          const t = e.currentTarget.value
          y(t), R(-1)
        }
        function O(e) {
          0
        }
        function W(e) {
          _([e, ...v])
        }
        function q(e) {
          D(e)
        }
        function Y() {
          ;(0, l.ensureNotNull)(b.current).focus()
        }
        function U(e, t) {
          const n = { sortField: e, sortDirection: t }
          A(n),
            c.setValue('loadChartDialog.viewState', JSON.stringify(n), {
              forceFlush: !0,
            }),
            O()
        }
      }
      var oe = n(85067)
      class ie extends oe.DialogRenderer {
        constructor(e) {
          super(), (this._options = e)
        }
        show() {
          o.render(
            a.createElement(ae, {
              ...this._options,
              onClose: () => this.hide(),
            }),
            this._container,
          ),
            this._setVisibility(!0)
        }
        hide() {
          o.unmountComponentAtNode(this._container), this._setVisibility(!1)
        }
      }
    },
    645: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M19.5 18.5h-3M21.5 13.5h-5M23.5 8.5h-7M8.5 7v13.5M4.5 16.5l4 4 4-4"/></svg>'
    },
    44563: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M19.5 18.5h-3M21.5 13.5h-5M23.5 8.5h-7M8.5 20.5V7M12.5 11l-4-4-4 4"/></svg>'
    },
    69859: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"><path stroke="currentColor" d="M12.4 12.5a7 7 0 1 0-4.9 2 7 7 0 0 0 4.9-2zm0 0l5.101 5"/></svg>'
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
    15795: (e) => {
      e.exports = {
        ar: ['جميع تنسيقاتي'],
        ca_ES: 'All my layouts',
        cs: 'All my layouts',
        de: ['Alle meine Layouts'],
        el: 'All my layouts',
        en: 'All my layouts',
        es: ['Todos mis diseños'],
        fa: 'All my layouts',
        fr: ['Toutes mes mises en page'],
        he_IL: ['כל הפריסות שלי'],
        hu_HU: 'All my layouts',
        id_ID: ['Seluruh layout saya'],
        it: ['Tutti i miei layout'],
        ja: ['すべてのレイアウト'],
        ko: ['내 모든 레이아웃'],
        ms_MY: ['Semua susun atur saya'],
        nl_NL: 'All my layouts',
        pl: ['Wszystkie moje układy'],
        pt: ['Todos meus layouts'],
        ro: 'All my layouts',
        ru: ['Все мои графики'],
        sv: ['Alla mina layouter'],
        th: ['เค้าโครงทั้งหมดของฉัน'],
        tr: ['Tüm yerleşimlerim'],
        vi: ['Tất cả bố cục của tôi'],
        zh: ['所有我的布局'],
        zh_TW: ['我的所有版面'],
      }
    },
    69368: (e) => {
      e.exports = {
        ar: ['هل تريد فعلا مسح تصميم مخطط الرسم البيانى‎ ‎{name}‎؟'],
        ca_ES: ["De debò que voleu eliminar el disseny del gràfic '{name}'?"],
        cs: "Do you really want to delete Chart Layout '{name}' ?",
        de: ["Möchten Sie das Chartlayout '{name}' wirklich löschen?"],
        el: "Do you really want to delete Chart Layout '{name}' ?",
        en: "Do you really want to delete Chart Layout '{name}' ?",
        es: [
          "¿Está seguro de que desea eliminar el Diseño del gráfico '{name}'?",
        ],
        fa: "Do you really want to delete Chart Layout '{name}' ?",
        fr: [
          "Voulez-vous vraiment supprimer la configuration du graphique '{name}' ?",
        ],
        he_IL: ["האם אתה באמת רוצה למחוק פריסת גרף '{name}'?"],
        hu_HU: ['Biztos, hogy törölni akarod ezt a chart elrendezést: {name}?'],
        id_ID: ["Apakah benar anda ingin menghapus Layout Chart '{name}' ?"],
        it: ["Cancellare la configurazione '{name}' ?"],
        ja: ["本当にチャートレイアウト '{name}' を削除しますか？"],
        ko: ["정말로 차트 레이아웃 '{name}' 을 지우시겠습니까?"],
        ms_MY: ["Anda benar-benar ingin memadam Susunatur Carta '{name}' ?"],
        nl_NL: "Do you really want to delete Chart Layout '{name}' ?",
        pl: ["Czy na pewno chcesz usunąć układ graficzny '{name}'?"],
        pt: ["Você quer realmente deletar o leiaute do gráfico '{name}'?"],
        ro: "Do you really want to delete Chart Layout '{name}' ?",
        ru: ['Вы действительно хотите удалить сохранённый график "{name}"?'],
        sv: ["Vill du verkligen ta bort diagramlayout '{name}' ?"],
        th: ["คุณต้องการลบชาทส์ '{name}' จริง ๆ หรือไม?"],
        tr: [
          "'{name}' isimli Grafik Yerleşimini silmek istediğinizden emin misiniz?",
        ],
        vi: ['Bạn có thực sự muốn xóa Bố cục Biểu đồ {name}?'],
        zh: ["确定删除图表布局'{name}' ?"],
        zh_TW: ['確定刪除圖表版面「{name}」？'],
      }
    },
    58013: (e) => {
      e.exports = {
        ar: [
          'هل تريد حقًا حذف تنسيق ارسم البياني "{name}" الذي يحتوي على ‎{n_drawings_on_n_symbols}‎؟',
        ],
        ca_ES: [
          "De debò que voleu eliminar el disseny del gràfic '{name}' que conté {n_drawings_on_n_symbols}?",
        ],
        cs: "Do you really want to delete Chart Layout '{name}' that contains {n_drawings_on_n_symbols}?",
        de: [
          "Möchten Sie wirklich das Chart-Layout '{name}' löschen, das {n_drawings_on_n_symbols} enthält?",
        ],
        el: "Do you really want to delete Chart Layout '{name}' that contains {n_drawings_on_n_symbols}?",
        en: "Do you really want to delete Chart Layout '{name}' that contains {n_drawings_on_n_symbols}?",
        es: [
          "¿Realmente quiere eliminar el diseño del gráfico '{name}' que contiene {n_drawings_on_n_symbols}?",
        ],
        fa: "Do you really want to delete Chart Layout '{name}' that contains {n_drawings_on_n_symbols}?",
        fr: [
          'Voulez-vous vraiment supprimer le modèle de graphique " {name} " qui contient {n_drawings_on_n_symbols}?',
        ],
        he_IL: [
          "האם אתה באמת רוצה למחוק את פריסת הגרף '{name}' שמכילה {n_drawings_on_n_symbols}?",
        ],
        hu_HU:
          "Do you really want to delete Chart Layout '{name}' that contains {n_drawings_on_n_symbols}?",
        id_ID: [
          "Apakah Anda benar-benar ingin menghapus Layout Chart '{name}' yang berisi {n_drawings_on_n_symbols}?",
        ],
        it: [
          "Vuoi davvero eliminare il salvataggio '{name}' che contiene {n_drawings_on_n_symbols}?",
        ],
        ja: [
          '本当に{n_drawings_on_n_symbols}を含むチャートレイアウト「{name}」を削除しますか？',
        ],
        ko: [
          "{n_drawings_on_n_symbols}이 포함된 차트 레이아웃 '{name}'을 삭제하시겠습니까?",
        ],
        ms_MY: [
          "Adakah anda pasti untuk padamkan Susun Atur Carta '{name}' yang mengandungi {n_drawings_on_n_symbols}?",
        ],
        nl_NL:
          "Do you really want to delete Chart Layout '{name}' that contains {n_drawings_on_n_symbols}?",
        pl: [
          "Czy na pewno chcesz usunąć układ wykresu '{name}', który zawiera {n_drawings_on_n_symbols}?",
        ],
        pt: [
          "Você realmente quer deletar o Layout do Gráfico '{name}' que contém {n_drawings_on_n_symbols}?",
        ],
        ro: "Do you really want to delete Chart Layout '{name}' that contains {n_drawings_on_n_symbols}?",
        ru: [
          'Вы действительно хотите удалить график "{name}", который содержит {n_drawings_on_n_symbols}?',
        ],
        sv: [
          "Ska du verkligen radera diagramlayout '{name}' som innehåller {n_drawings_on_n_symbols}?",
        ],
        th: [
          "คุณต้องการลบเลยเอาต์ชาร์ต '{name}' ที่มี {n_drawings_on_n_symbols} หรือไม่?",
        ],
        tr: [
          "{n_drawings_on_n_symbols} içeren Grafik Düzenini '{name}' gerçekten silmek istiyor musunuz?",
        ],
        vi: [
          "Bạn có thực sự muốn xóa Bố cục Biểu đồ '{name}' có chứa {n_drawings_on_n_symbols} không?",
        ],
        zh: ['您真的要删除包含{n_drawings_on_n_symbols}的图表布局“{name}”吗？'],
        zh_TW: [
          '您真的要刪除包含{n_drawings_on_n_symbols}的圖表版面“{name}”嗎？',
        ],
      }
    },
    38212: (e) => {
      e.exports = {
        ar: ['تاريخ التعديل (الأقدم أولاً)'],
        ca_ES: ['Data de modificació (la més antiga primer)'],
        cs: 'Date modified (oldest first)',
        de: ['Bearbeitungs-Datum (ältestes zuerst)'],
        el: 'Date modified (oldest first)',
        en: 'Date modified (oldest first)',
        es: ['Fecha de modificación (la más antigua primero)'],
        fa: 'Date modified (oldest first)',
        fr: ["Date de modification (la plus ancienne d'abord)"],
        he_IL: ['התאריך שונה (הישן ראשון)'],
        hu_HU: 'Date modified (oldest first)',
        id_ID: ['Tanggal modifikasi (dari yang terlama)'],
        it: ['Data ultima modifica (vecchi prima)'],
        ja: ['変更日 (古い順)'],
        ko: ['바뀐 날짜 (옛것부터)'],
        ms_MY: ['Tarikh diubah (lama dahulu)'],
        nl_NL: 'Date modified (oldest first)',
        pl: ['Data modyfikacji (od najstarszych)'],
        pt: ['Data da modificação (mais antiga primeiro)'],
        ro: 'Date modified (oldest first)',
        ru: ['Дата изменения (сначала старые)'],
        sv: ['Ändringsdatum (äldst först)'],
        th: ['วันที่แก้ไข (เก่าก่อน)'],
        tr: ['Değişim tarihine göre sırala (önce en eski)'],
        vi: ['Ngày chỉnh sửa (cũ lên trước)'],
        zh: ['修改日期(由旧到新)'],
        zh_TW: ['修改日期(舊到新)'],
      }
    },
    63037: (e) => {
      e.exports = {
        ar: ['تاريخ التعديل (الأحدث أولاً)'],
        ca_ES: ['Data de modificació (la més nova primer)'],
        cs: 'Date modified (newest first)',
        de: ['Bearbeitungs-Datum (neuestes zuerst)'],
        el: 'Date modified (newest first)',
        en: 'Date modified (newest first)',
        es: ['Fecha de modificación (la más reciente primero)'],
        fa: 'Date modified (newest first)',
        fr: ["Date de modification (la plus récente d'abord)"],
        he_IL: ['התאריך שונה (החדש ראשון)'],
        hu_HU: 'Date modified (newest first)',
        id_ID: ['Tanggal modifikasi (dari yang terbaru)'],
        it: ['Data ultima modifica (recenti prima)'],
        ja: ['変更日 (新しい順)'],
        ko: ['바뀐 날짜 (새것부터)'],
        ms_MY: ['Tarikh diubah (terbaru dahulu)'],
        nl_NL: 'Date modified (newest first)',
        pl: ['Data modyfikacji (od najnowszych)'],
        pt: ['Data da modificação (mais recente 1°)'],
        ro: 'Date modified (newest first)',
        ru: ['Дата изменения (сначала новые)'],
        sv: ['Ändringsdatum (nyast först)'],
        th: ['วันที่แก้ไข (ใหม่ก่อน)'],
        tr: ['Değişim tarihine göre sırala (önce en yeni)'],
        vi: ['Ngày chỉnh sửa (mới lên trước)'],
        zh: ['修改日期(由新到旧)'],
        zh_TW: ['修改日期(新到舊)'],
      }
    },
    75789: (e) => {
      e.exports = {
        ar: ['تحميل التنسيق'],
        ca_ES: ['Carrega disseny'],
        cs: 'Load layout',
        de: ['Layout öffnen'],
        el: 'Load layout',
        en: 'Load layout',
        es: ['Cargar diseño'],
        fa: 'Load layout',
        fr: ['Charger la mise en page'],
        he_IL: ['טען גרף'],
        hu_HU: 'Load layout',
        id_ID: ['Muat layout'],
        it: ['Carica layout'],
        ja: ['レイアウトの読み込み'],
        ko: ['레이아웃 불러오기'],
        ms_MY: ['Memuatkan susun atur'],
        nl_NL: 'Load layout',
        pl: ['Załaduj układ'],
        pt: ['Carregar layout'],
        ro: 'Load layout',
        ru: ['Загрузить график'],
        sv: ['Ladda layout'],
        th: ['โหลดเลย์เอาท์'],
        tr: ['Yerleşimi yükle'],
        vi: ['Tải bố cục'],
        zh: ['加载布局'],
        zh_TW: ['加載版面'],
      }
    },
    25653: (e) => {
      e.exports = {
        ar: ['اسم التنسيق'],
        ca_ES: ['Nom del disseny del gràfic'],
        cs: 'Layout name',
        de: ['Layout Name'],
        el: 'Layout name',
        en: 'Layout name',
        es: ['Nombre del diseño del gráfico'],
        fa: 'Layout name',
        fr: ['Nom de la mise en page'],
        he_IL: ['שם פריסת גרף'],
        hu_HU: 'Layout name',
        id_ID: ['Nama Layout'],
        it: ['Nome layout'],
        ja: ['レイアウト名'],
        ko: ['레이아웃 네임'],
        ms_MY: ['Aturan nama'],
        nl_NL: 'Layout name',
        pl: ['Nazwa układu'],
        pt: ['Nome do layout'],
        ro: 'Layout name',
        ru: ['Имя графика'],
        sv: ['Layoutnamn'],
        th: ['ชื่อเลย์เอาท์'],
        tr: ['Yerleşim adı'],
        vi: ['Tên bố cục'],
        zh: ['布局名称'],
        zh_TW: ['版面名稱'],
      }
    },
    63479: (e) => {
      e.exports = {
        ar: ['اسم التنسيق (A إلى Z)'],
        ca_ES: ['Nom de disseny (de la A a la Z)'],
        cs: 'Layout name (A to Z)',
        de: ['Layout Name (A bis Z)'],
        el: 'Layout name (A to Z)',
        en: 'Layout name (A to Z)',
        es: ['Nombre de diseño (de la A a la Z)'],
        fa: 'Layout name (A to Z)',
        fr: ['Nom de la mise en page (A à Z)'],
        he_IL: ["שם הפריסה (א' עד ת')"],
        hu_HU: 'Layout name (A to Z)',
        id_ID: ['Nama layout (A ke Z)'],
        it: ['Nome layout (A-Z)'],
        ja: ['レイアウト名 (AからZ)'],
        ko: ['레이아웃 이름 (A - Z)'],
        ms_MY: ['Nama susun atur (A hingga Z)'],
        nl_NL: 'Layout name (A to Z)',
        pl: ['Nazwa układu (A do Z)'],
        pt: ['Nome do layout (A a Z)'],
        ro: 'Layout name (A to Z)',
        ru: ['Название графиков (А → Я)'],
        sv: ['Layoutnamn (A till Z)'],
        th: ['ชื่อเลย์เอาท์ (A ไปยัง Z)'],
        tr: ["Yerleşim adı (A'dan Z'ye)"],
        vi: ['Tên bố cục (A đến Z)'],
        zh: ['布局名称(A到Z)'],
        zh_TW: ['版面名稱(A到Z)'],
      }
    },
    96189: (e) => {
      e.exports = {
        ar: ['اسم التنسيق (Z إلى A)'],
        ca_ES: ['Nom de disseny (de la Z a la A)'],
        cs: 'Layout name (Z to A)',
        de: ['Layout Name (Z-A)'],
        el: 'Layout name (Z to A)',
        en: 'Layout name (Z to A)',
        es: ['Nombre de diseño (de la Z a la A)'],
        fa: 'Layout name (Z to A)',
        fr: ['Nom de la mise en page (Z à A)'],
        he_IL: ["שם הפריסה (ת' עד א')"],
        hu_HU: 'Layout name (Z to A)',
        id_ID: ['Nama layout (Z ke A)'],
        it: ['Nome layout (Z-A)'],
        ja: ['レイアウト名 (ZからA)'],
        ko: ['레이아웃 이름 (Z - A)'],
        ms_MY: ['Nama susun atur (Z hingga A)'],
        nl_NL: 'Layout name (Z to A)',
        pl: ['Nazwa układu (Z do A)'],
        pt: ['Nome do layout (Z a A)'],
        ro: 'Layout name (Z to A)',
        ru: ['Название графиков (Я → А)'],
        sv: ['Layoutnamn (Z till A)'],
        th: ['ชื่อเลย์เอาท์ (Z ไปยัง A)'],
        tr: ["Yerleşim adı (Z'den A'ya)"],
        vi: ['Tên bố cục (Z đến A)'],
        zh: ['布局名称(Z到A)'],
        zh_TW: ['版面名稱(Z到A)'],
      }
    },
    41583: (e) => {
      e.exports = {
        ar: ['تصنيف حسب اسم التنسيق، وتاريخ التعديل'],
        ca_ES: ['Ordena per nom de disseny del gràfic, data de modificació'],
        cs: 'Sort by layout name, date changed',
        de: ['Nach Layout-Name sortieren, Änderungsdatum'],
        el: 'Sort by layout name, date changed',
        en: 'Sort by layout name, date changed',
        es: ['Ordenar por nombre de diseño del gráfico, fecha de modificación'],
        fa: 'Sort by layout name, date changed',
        fr: ['Trier par nom de mise en page, date modifiée'],
        he_IL: ['מיין לפי שם הפריסה layout , התאריך השתנה'],
        hu_HU: 'Sort by layout name, date changed',
        id_ID: ['Urut berdasarkan nama layout, tanggal perubahan'],
        it: ['Ordina in base a nome, data'],
        ja: ['レイアウト名や変更日で並び替え'],
        ko: ['레이아웃 네임, 바뀐 날짜로 소팅'],
        ms_MY: ['Susun mengikut aturan nama, perubahan tarikh'],
        nl_NL: 'Sort by layout name, date changed',
        pl: ['Sortuj według nazwy układu, data zmiany'],
        pt: ['Ordenar por nome do layout, data de alteração'],
        ro: 'Sort by layout name, date changed',
        ru: ['Сортировать по имени, дате изменения'],
        sv: ['Sortera med layoutnamn, datum ändrat'],
        th: ['เรียงตามชื่อเลย์เอาท์, วันที่เปลี่ยนแปลง'],
        tr: ['Yerleşim adına, tarih değişikliğine göre sırala'],
        vi: ['Sắp xếp theo tên bố cục, ngày thay đổi'],
        zh: ['排序依布局名称、修改日期'],
        zh_TW: ['排序按版面名稱、修改日期'],
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
    39966: (e) => {
      e.exports = {
        ar: [
          'على {amount} من الرموز',
          'على {amount} من الرموز',
          'على {amount} من الرموز',
          'على {amount} من الرموز',
          'على {amount} من الرموز',
          'على {amount} من الرموز',
        ],
        ca_ES: ['en {amount} símbol', 'en {amount} símbols'],
        cs: 'on {amount} symbol',
        de: ['auf {amount} Symbol', 'auf {amount} Symbolen'],
        el: 'on {amount} symbol',
        en: 'on {amount} symbol',
        es: ['en {amount} símbolo', 'en {amount} símbolos'],
        fa: ['on {amount} symbols'],
        fr: ['sur {amount} symbole', 'sur {amount} symbols'],
        he_IL: [
          'על סימול {amount}',
          'על סימולים {amount}',
          'על סימולים {amount}',
          'על סימולים {amount}',
        ],
        hu_HU: ['on {amount} symbols'],
        id_ID: ['pada {amount} simbol'],
        it: ['su {amount} simbolo', 'su {amount} simboli'],
        ja: ['（{amount}個のシンボル上に）'],
        ko: ['on {amount} 심볼'],
        ms_MY: ['pada simbol {amount}'],
        nl_NL: 'on {amount} symbol',
        pl: [
          'na {amount} symbolu',
          'na {amount} symbolach',
          'na {amount} symbolach',
          'na {amount} symbolach',
        ],
        pt: ['em {amount} símbolo', 'em {amount} símbolos'],
        ro: 'on {amount} symbol',
        ru: [
          'на {amount} инструменте',
          'на {amount} инструментах',
          'на {amount} инструментах',
          'на {amount} инструментах',
        ],
        sv: ['på {amount} symbol', 'på {amount} symboler'],
        th: ['บน {amount} สัญลักษณ์'],
        tr: ['{amount} sembolünde', '{amount} sembolünde'],
        vi: ['trên {amount} mã giao dịch'],
        zh: ['在{amount}个商品'],
        zh_TW: ['在{amount}商品'],
      }
    },
    93030: (e) => {
      e.exports = {
        ar: [
          '{amount} من الرسوم ',
          '{amount} من الرسوم ',
          '{amount} من الرسوم ',
          '{amount} من الرسوم ',
          '{amount} من الرسوم ',
          '{amount} من الرسوم ',
        ],
        ca_ES: ['{amount} dibuix', '{amount} dibuixos'],
        cs: '{amount} drawing',
        de: ['{amount} Zeichnung', '{amount} Zeichnungen'],
        el: '{amount} drawing',
        en: '{amount} drawing',
        es: ['{amount} dibujo', '{amount} dibujos'],
        fa: ['{amount} drawings'],
        fr: ['{amount} dessin', '{amount} dessins'],
        he_IL: [
          'שרטוט {amount}',
          'שרטוטים {amount}',
          'שרטוטים {amount}',
          'שרטוטים {amount}',
        ],
        hu_HU: ['{amount} drawings'],
        id_ID: ['{amount} gambar'],
        it: ['{amount} disegno', '{amount} disegni'],
        ja: ['{amount}個の描画'],
        ko: ['{amount} 드로잉'],
        ms_MY: ['{amount} lukisan'],
        nl_NL: '{amount} drawing',
        pl: [
          '{amount} rysunek',
          '{amount} rysunki',
          '{amount} rysunków',
          '{amount} rysunków',
        ],
        pt: ['{amount} desenho', '{amount} desenhos'],
        ro: '{amount} drawing',
        ru: [
          '{amount} объект рисования',
          '{amount} объекта рисования',
          '{amount} объектов рисования',
          '{amount} объектов рисования',
        ],
        sv: ['{amount} ritning', '{amount} ritningar'],
        th: ['{amount} การวาด'],
        tr: ['{amount} çizim', '{amount} çizim'],
        vi: ['{amount} bản vẽ'],
        zh: ['{amount}个绘图'],
        zh_TW: ['{amount}繪圖'],
      }
    },
  },
])
