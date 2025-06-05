;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3637],
  {
    445015: (e) => {
      e.exports = { 'link-item': 'link-item-eIA09f0e' }
    },
    685200: (e) => {
      e.exports = {
        'arrow-icon': 'arrow-icon-NIrWNOPk',
        dropped: 'dropped-NIrWNOPk',
        'size-xsmall': 'size-xsmall-NIrWNOPk',
        'size-small': 'size-small-NIrWNOPk',
        'size-medium': 'size-medium-NIrWNOPk',
        'size-large': 'size-large-NIrWNOPk',
        'size-xlarge': 'size-xlarge-NIrWNOPk',
      }
    },
    125164: (e) => {
      e.exports = {
        'underline-tab': 'underline-tab-cfYYXvwA',
        'disable-focus-outline': 'disable-focus-outline-cfYYXvwA',
        'enable-cursor-pointer': 'enable-cursor-pointer-cfYYXvwA',
        selected: 'selected-cfYYXvwA',
        'disable-active-state-styles': 'disable-active-state-styles-cfYYXvwA',
        'size-xsmall': 'size-xsmall-cfYYXvwA',
        'size-small': 'size-small-cfYYXvwA',
        'size-medium': 'size-medium-cfYYXvwA',
        'size-large': 'size-large-cfYYXvwA',
        'size-xlarge': 'size-xlarge-cfYYXvwA',
        fake: 'fake-cfYYXvwA',
        'margin-xsmall': 'margin-xsmall-cfYYXvwA',
        'margin-small': 'margin-small-cfYYXvwA',
        'margin-medium': 'margin-medium-cfYYXvwA',
        'margin-large': 'margin-large-cfYYXvwA',
        'margin-xlarge': 'margin-xlarge-cfYYXvwA',
        'ellipsis-children': 'ellipsis-children-cfYYXvwA',
      }
    },
    679877: (e) => {
      e.exports = {
        'scroll-wrap': 'scroll-wrap-SmxgjhBJ',
        'size-xlarge': 'size-xlarge-SmxgjhBJ',
        'enable-scroll': 'enable-scroll-SmxgjhBJ',
        'underline-tabs': 'underline-tabs-SmxgjhBJ',
        'size-large': 'size-large-SmxgjhBJ',
        'size-medium': 'size-medium-SmxgjhBJ',
        'size-small': 'size-small-SmxgjhBJ',
        'size-xsmall': 'size-xsmall-SmxgjhBJ',
        'make-grid-column': 'make-grid-column-SmxgjhBJ',
        'stretch-tabs': 'stretch-tabs-SmxgjhBJ',
        'equal-tab-size': 'equal-tab-size-SmxgjhBJ',
      }
    },
    810047: (e) => {
      e.exports = {
        underline: 'underline-Pun8HxCz',
        center: 'center-Pun8HxCz',
        corner: 'corner-Pun8HxCz',
        disabled: 'disabled-Pun8HxCz',
      }
    },
    737402: (e, t, l) => {
      l.d(t, { useSafeMatchMedia: () => a.useSafeMatchMedia })
      var a = l(671129)
    },
    873637: (e, t, l) => {
      l.d(t, { UnderlineButtonTabs: () => q })
      var a = l(50959),
        s = l(497754),
        n = l.n(s),
        i = l(609838),
        r = l(429510),
        o = l(525388),
        c = l(269842),
        u = l(772069),
        d = l(984164),
        m = l(953517)
      const f = (0, a.createContext)('small')
      var b = l(234539),
        v = l(125164)
      function g(e) {
        const {
          size: t = 'xsmall',
          active: l,
          fake: a,
          enableActiveStateStyles: n,
          anchor: i = !1,
          hideFocusOutline: r = !1,
          equalTabSize: o,
          className: c,
        } = e
        return s(
          v['underline-tab'],
          v[`size-${t}`],
          l && v.selected,
          !n && v['disable-active-state-styles'],
          r && v['disable-focus-outline'],
          a && v.fake,
          i && v['enable-cursor-pointer'],
          o && v[`margin-${t}`],
          c,
        )
      }
      const h = (0, a.forwardRef)((e, t) => {
        const l = (0, a.useContext)(f),
          s = (0, a.useContext)(b.CustomBehaviourContext),
          {
            active: i,
            fake: r,
            className: o,
            enableActiveStateStyles: c = s.enableActiveStateStyles,
            hideFocusOutline: u = !1,
            equalTabSize: d,
            children: m,
            ...h
          } = e
        return a.createElement(
          'button',
          {
            ...h,
            ref: t,
            className: g({
              size: l,
              active: i,
              fake: r,
              enableActiveStateStyles: c,
              hideFocusOutline: u,
              equalTabSize: d,
              className: o,
            }),
          },
          d && 'string' == typeof m
            ? a.createElement(
                'span',
                {
                  className: n()(
                    v['ellipsis-children'],
                    'apply-overflow-tooltip',
                  ),
                },
                m,
              )
            : m,
        )
      })
      h.displayName = 'UnderlineTabsBaseButton'
      const p = (0, a.forwardRef)((e, t) => {
        const {
            item: l,
            highlighted: s,
            handleItemRef: n,
            onClick: i,
            'aria-disabled': r,
            ...o
          } = e,
          c = (0, a.useCallback)(() => {
            i && i(l)
          }, [i, l]),
          u = (0, a.useCallback)(
            (e) => {
              n && n(l, e),
                t && 'object' == typeof t
                  ? (t.current = e)
                  : 'function' == typeof t && t(e)
            },
            [l, n, t],
          )
        return a.createElement(
          h,
          { ...o, id: l.id, onClick: c, ref: u },
          l.label,
        )
      })
      p.displayName = 'UnderlineButtonTab'
      var x = l(650151),
        C = l(192063),
        k = l(904925),
        w = l(72571),
        z = l(347531),
        S = l(602948),
        y = l(863509),
        A = l(168874),
        N = l(685200)
      function B(e) {
        switch (e) {
          case 'xsmall':
            return z
          case 'small':
            return S
          case 'medium':
          case 'large':
            return y
          case 'xlarge':
            return A
        }
      }
      function Y(e) {
        const { size: t, isDropped: l = !1 } = e
        return a.createElement(w.Icon, {
          icon: B(t),
          className: s(N['arrow-icon'], N[`size-${t}`], l && N.dropped),
        })
      }
      var E = l(445015)
      function R(e) {
        const {
            size: t,
            disabled: l,
            isOpened: s,
            enableActiveStateStyles: n,
            hideFocusOutline: i,
            fake: r,
            items: c,
            buttonContent: u,
            buttonRef: d,
            isAnchorTabs: m,
            isHighlighted: f,
            onButtonClick: b,
            onItemClick: v,
            onClose: g,
          } = e,
          p = (0, a.useRef)(null),
          w = (0, o.useMergedRefs)([d, p]),
          z = ((e, t) => {
            const l = (0, a.useRef)(X)
            return (
              (0, a.useEffect)(() => {
                const e = getComputedStyle((0, x.ensureNotNull)(t.current))
                l.current = {
                  xsmall: I(e, 'xsmall'),
                  small: I(e, 'small'),
                  medium: I(e, 'medium'),
                  large: I(e, 'large'),
                  xlarge: I(e, 'xlarge'),
                }
              }, [t]),
              (0, a.useCallback)(() => {
                const a = (0, x.ensureNotNull)(
                    t.current,
                  ).getBoundingClientRect(),
                  s = l.current[e]
                return {
                  x: a.left,
                  y: a.top + a.height + s + 4,
                  indentFromWindow: { top: 4, bottom: 4, left: 4, right: 4 },
                }
              }, [t, e])
            )
          })(t, p)
        return a.createElement(k.PopupMenuDisclosureView, {
          buttonRef: p,
          listboxTabIndex: -1,
          isOpened: s,
          onClose: g,
          listboxAria: { 'aria-hidden': !0 },
          popupPosition: z,
          button: a.createElement(
            h,
            {
              'aria-hidden': !0,
              disabled: l,
              active: s,
              onClick: b,
              ref: w,
              tabIndex: -1,
              enableActiveStateStyles: n,
              hideFocusOutline: i,
              fake: r,
            },
            u,
            a.createElement(Y, { size: t, isDropped: s }),
          ),
          popupChildren: c.map((e) =>
            a.createElement(C.PopupMenuItem, {
              key: e.id,
              className: m ? E['link-item'] : void 0,
              onClick: v,
              onClickArg: e,
              isActive: f(e),
              label: e.label,
              isDisabled: e.disabled,
              link: 'href' in e ? e.href : void 0,
              rel: 'rel' in e ? e.rel : void 0,
              target: 'target' in e ? e.target : void 0,
              renderComponent:
                'renderComponent' in e ? e.renderComponent : void 0,
              dontClosePopup: !0,
            }),
          ),
        })
      }
      function I(e, t) {
        return Number.parseInt(
          e.getPropertyValue(`--ui-lib-underline-tabs-tab-margin-bottom-${t}`),
          10,
        )
      }
      const X = { xsmall: 0, small: 0, medium: 0, large: 0, xlarge: 0 }
      var O = l(804395),
        P = l(737402),
        M = l(586240),
        T = l(679877)
      function j(e) {
        const { size: t, overflowBehaviour: l, className: a } = e
        return s(
          T['scroll-wrap'],
          T[`size-${t}`],
          'scroll' === l && T['enable-scroll'],
          a,
        )
      }
      function H() {
        const [e, t] = (0, a.useState)(!1)
        return (
          (0, a.useEffect)(() => {
            t(O.mobiletouch)
          }, []),
          e
        )
      }
      var J = l(12481),
        F = l(710263),
        $ = l(810047),
        D = l.n($)
      function W(e) {
        const { disabled: t, translateX: l } = e,
          n = e.scale / 100
        return a.createElement(
          'div',
          {
            className: s(D().underline, t && D().disabled),
            style: { transform: `translateX(${l}px) scaleX(${n})` },
          },
          a.createElement('div', {
            className: D().corner,
            style: { transform: `scaleX(${1 / n})` },
          }),
          a.createElement('div', {
            className: D().center,
            style: { transform: `scaleX(${1 - 30 / e.scale})` },
          }),
          a.createElement('div', {
            className: D().corner,
            style: { transform: `scaleX(${1 / n})` },
          }),
        )
      }
      function q(e) {
        const {
            id: t,
            items: s,
            activationType: b,
            orientation: v,
            disabled: g,
            moreButtonContent: h = i.t(null, void 0, l(141610)),
            size: x = 'small',
            onActivate: C,
            isActive: k,
            className: w,
            style: z,
            overflowBehaviour: S,
            enableActiveStateStyles: y,
            tablistLabelId: A,
            tablistLabel: N,
            'data-name': B = 'underline-tabs-buttons',
            stretchTabs: Y,
            equalTabSize: E,
          } = e,
          I = H(),
          X = ((e) => {
            const t = (0, P.useSafeMatchMedia)(
                M['media-mf-phone-landscape'],
                !0,
              ),
              l = H()
            return null != e ? e : l || !t ? 'scroll' : 'collapse'
          })(S),
          O = (0, a.useRef)(!1),
          $ = (0, a.useCallback)((e) => e.id, []),
          D = 'none' === X && Y,
          q = 'none' === X && E,
          L = null != y ? y : !I,
          {
            visibleItems: K,
            hiddenItems: U,
            containerRefCallback: Z,
            innerContainerRefCallback: V,
            moreButtonRef: G,
            setItemRef: Q,
          } = (0, r.useCollapsible)(s, $, k),
          _ = 'collapse' === X ? K : s,
          ee = 'collapse' === X ? U : [],
          te = (0, a.useCallback)((e) => ee.includes(e), [ee]),
          le = (0, a.useRef)(new Map()),
          {
            isOpened: ae,
            open: se,
            close: ne,
            onButtonClick: ie,
          } = (0, u.useDisclosure)({ id: t, disabled: g }),
          {
            tabsBindings: re,
            tablistBinding: oe,
            scrollWrapBinding: ce,
            onActivate: ue,
            onHighlight: de,
            isHighlighted: me,
          } = (0, d.useTabs)({
            id: t,
            items: [..._, ...ee],
            activationType: b,
            orientation: v,
            disabled: g,
            tablistLabelId: A,
            tablistLabel: N,
            onActivate: C,
            isActive: k,
            isCollapsed: te,
            isRtl: F.isRtl,
            itemsRefs: le,
            isDisclosureOpened: ae,
          }),
          fe = s.find(k),
          be = ee.find(me),
          ve = (0, a.useCallback)(() => {
            fe && de(fe)
          }, [de, fe]),
          ge = (0, a.useCallback)(
            (e) => {
              var t
              return null !== (t = re.find((t) => t.id === e.id)) &&
                void 0 !== t
                ? t
                : {}
            },
            [re],
          ),
          he = (0, a.useCallback)(() => {
            ne(), ve(), (O.current = !0)
          }, [ne, ve]),
          pe = (0, a.useCallback)(() => {
            be && (ue(be), de(be, 200))
          }, [ue, de, be])
        ;(ce.ref = (0, o.useMergedRefs)([ce.ref, Z])),
          (oe.ref = (0, o.useMergedRefs)([oe.ref, V])),
          (oe.onKeyDown = (0, c.createSafeMulticastEventHandler)(
            (0, m.useKeyboardEventHandler)([
              (0, m.useKeyboardClose)(ae, he),
              (0, m.useKeyboardActionHandler)(
                [13, 32],
                pe,
                (0, a.useCallback)(() => Boolean(be), [be]),
              ),
            ]),
            oe.onKeyDown,
          ))
        const xe = (0, a.useCallback)(
            (e) => {
              ;(O.current = !0), ie(e)
            },
            [O, ie],
          ),
          Ce = (0, a.useCallback)(
            (e) => {
              e && ue(e)
            },
            [ue],
          )
        ;(0, a.useEffect)(() => {
          O.current ? (O.current = !1) : (be && !ae && se(), !be && ae && ne())
        }, [be, ae, se, ne])
        const ke = ((e, t, l) => {
          const [s, n] = (0, a.useState)(),
            i = (0, a.useRef)(),
            r = (e) => {
              var t
              const l =
                null !== (t = e.parentElement) && void 0 !== t ? t : void 0
              if (void 0 === l) return
              const { left: a, right: s, width: i } = e.getBoundingClientRect(),
                { left: r, right: o } = l.getBoundingClientRect(),
                c = (0, F.isRtl)() ? s - o : a - r
              n({ translateX: c, scale: i })
            }
          return (
            (0, a.useEffect)(() => {
              const e = (0, J.default)((e) => {
                const t = e[0].target
                void 0 !== t && r(t)
              }, 50)
              i.current = new ResizeObserver(e)
            }, []),
            (0, a.useEffect)(() => {
              var l
              if (void 0 === t) return
              const a = e.get(t)
              return void 0 !== a
                ? (r(a),
                  null === (l = i.current) || void 0 === l || l.observe(a),
                  () => {
                    var e
                    return null === (e = i.current) || void 0 === e
                      ? void 0
                      : e.disconnect()
                  })
                : void 0
            }, l),
            s
          )
        })(le.current, null != fe ? fe : be, [null != fe ? fe : be, _, x, D, X])
        return a.createElement(
          f.Provider,
          { value: x },
          a.createElement(
            'div',
            {
              ...ce,
              className: j({ size: x, overflowBehaviour: X, className: w }),
              style: z,
              'data-name': B,
            },
            a.createElement(
              'div',
              {
                ...oe,
                className: n()(T['underline-tabs'], {
                  [T['make-grid-column']]: D || q,
                  [T['stretch-tabs']]: D,
                  [T['equal-tab-size']]: q,
                }),
              },
              _.map((e) =>
                a.createElement(p, {
                  ...ge(e),
                  key: e.id,
                  item: e,
                  onClick: ue,
                  enableActiveStateStyles: L,
                  hideFocusOutline: I,
                  ref: Q($(e)),
                  ...(e.dataId && { 'data-id': e.dataId }),
                  equalTabSize: q,
                }),
              ),
              ee.map((e) =>
                a.createElement(p, { ...ge(e), key: e.id, item: e, fake: !0 }),
              ),
              a.createElement(R, {
                size: x,
                disabled: g,
                isOpened: ae,
                items: ee,
                buttonContent: h,
                buttonRef: G,
                isHighlighted: me,
                onButtonClick: xe,
                onItemClick: Ce,
                onClose: ne,
                enableActiveStateStyles: L,
                hideFocusOutline: I,
                fake: 0 === ee.length,
              }),
              ke && a.createElement(W, { ...ke, disabled: g }),
            ),
          ),
        )
      }
      var L = l(409245)
      function K(e) {
        return a.createElement('a', { ...(0, L.renameRef)(e) })
      }
      ;(0, a.forwardRef)((e, t) => {
        var l
        const s = (0, a.useContext)(f),
          n = (0, a.useContext)(b.CustomBehaviourContext),
          {
            item: i,
            highlighted: r,
            handleItemRef: o,
            onClick: c,
            active: u,
            fake: d,
            className: m,
            enableActiveStateStyles: v = n.enableActiveStateStyles,
            hideFocusOutline: h = !1,
            disabled: p,
            'aria-disabled': x,
            ...C
          } = e,
          k = (0, a.useCallback)(
            (e) => {
              x ? e.preventDefault() : c && c(i)
            },
            [c, x, i],
          ),
          w = (0, a.useCallback)(
            (e) => {
              o && o(i, e),
                t && 'object' == typeof t
                  ? (t.current = e)
                  : 'function' == typeof t && t(e)
            },
            [i, o, t],
          ),
          z = null !== (l = i.renderComponent) && void 0 !== l ? l : K
        return a.createElement(
          z,
          {
            ...C,
            id: i.id,
            'aria-disabled': x,
            onClick: k,
            reference: w,
            href: i.href,
            rel: i.rel,
            target: i.target,
            className: g({
              size: s,
              active: u,
              fake: d,
              enableActiveStateStyles: v,
              anchor: !0,
              hideFocusOutline: h,
              className: m,
            }),
          },
          i.label,
        )
      }).displayName = 'UnderlineAnchorTab'
    },
    347531: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="m4.67 7.38.66-.76L9 9.84l3.67-3.22.66.76L9 11.16 4.67 7.38Z"/></svg>'
    },
    863509: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M3.57 7.85 9 12.62l5.43-4.77-1.32-1.5L9 9.95l-4.11-3.6-1.32 1.5Z"/></svg>'
    },
    168874: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M7.3 10.3a1 1 0 0 1 1.4 0l5.3 5.29 5.3-5.3a1 1 0 1 1 1.4 1.42l-6 6a1 1 0 0 1-1.4 0l-6-6a1 1 0 0 1 0-1.42Z"/></svg>'
    },
  },
])
