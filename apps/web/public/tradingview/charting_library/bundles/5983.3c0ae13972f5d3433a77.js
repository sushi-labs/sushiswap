;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5983],
  {
    45015: (e) => {
      e.exports = { 'link-item': 'link-item-eIA09f0e' }
    },
    85200: (e) => {
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
    25164: (e) => {
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
    79877: (e) => {
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
    10047: (e) => {
      e.exports = {
        underline: 'underline-Pun8HxCz',
        center: 'center-Pun8HxCz',
        corner: 'corner-Pun8HxCz',
        disabled: 'disabled-Pun8HxCz',
      }
    },
    56073: (e, t, n) => {
      function i(e, t = !1) {
        const n = getComputedStyle(e),
          i = [n.height]
        return (
          'border-box' !== n.boxSizing &&
            i.push(
              n.paddingTop,
              n.paddingBottom,
              n.borderTopWidth,
              n.borderBottomWidth,
            ),
          t && i.push(n.marginTop, n.marginBottom),
          i.reduce((e, t) => e + (Number.parseFloat(t) || 0), 0)
        )
      }
      function a(e, t = !1) {
        const n = getComputedStyle(e),
          i = [n.width]
        return (
          'border-box' !== n.boxSizing &&
            i.push(
              n.paddingLeft,
              n.paddingRight,
              n.borderLeftWidth,
              n.borderRightWidth,
            ),
          t && i.push(n.marginLeft, n.marginRight),
          i.reduce((e, t) => e + (Number.parseFloat(t) || 0), 0)
        )
      }
      n.d(t, { outerHeight: () => i, outerWidth: () => a })
    },
    75983: (e, t, n) => {
      n.d(t, { UnderlineButtonTabs: () => ce })
      var i,
        a = n(50959),
        l = n(97754),
        s = n.n(l),
        r = n(11542)
      !((e) => {
        ;(e.StartFirst = 'start-first'), (e.EndFirst = 'end-first')
      })(i || (i = {}))
      var o = n(67842),
        c = n(56073),
        u = n(78869),
        d = n(43010),
        m = n(53017)
      function b(e) {
        const {
            itemsList: t,
            getItemId: n,
            calcVisibleAndHiddenItems: i,
            shouldKeepItemVisible: l,
            onMeasureCallback: s,
            forceUpdate: r = !1,
          } = e,
          [b, h] = (0, u.useRefsMap)(),
          v = (0, a.useRef)(null),
          g = (0, a.useRef)({
            widthsMap: new Map(),
            containerWidth: 0,
            moreButtonWidth: 0,
          }),
          [p, C] = (0, a.useState)({ visible: t, hidden: [] }),
          k = (0, a.useMemo)(
            () => t.reduce((e, t, n) => (l(t) && e.push(n), e), []),
            [t, l],
          ),
          w = (0, a.useCallback)(() => {
            if (g.current.containerWidth) {
              const e = i(g.current, k)
              ;((e, t) => !f(e.visible, t.visible) || !f(e.hidden, t.hidden))(
                p,
                e,
              ) && C(e)
            }
          }, [g, C, p, k, i]),
          x = (0, a.useCallback)(() => {
            g.current.moreButtonWidth = v.current
              ? (0, c.outerWidth)(v.current, !0)
              : 0
            const e = new Map(g.current.widthsMap)
            for (const i of t) {
              const t = n(i),
                a = b.current.get(t)
              if (a) {
                const n = (0, c.outerWidth)(a, !0)
                e.set(t, n)
              }
            }
            ;(g.current.widthsMap = e), s && s()
          }, [g, t, n, b, s]),
          z = (0, a.useRef)(null),
          R = (0, a.useCallback)(
            ([e]) => {
              e.contentRect.width !== g.current.containerWidth &&
                (z.current && cancelAnimationFrame(z.current),
                (g.current.containerWidth = e.contentRect.width),
                (z.current = requestAnimationFrame(() => {
                  w()
                })))
            },
            [g, w],
          ),
          y = (0, a.useRef)(null),
          A = (0, a.useCallback)(
            ([e]) => {
              y.current && cancelAnimationFrame(y.current),
                x(),
                (y.current = requestAnimationFrame(() => {
                  w()
                }))
            },
            [x, w],
          ),
          S = (0, o.useResizeObserver)(A),
          I = (0, o.useResizeObserver)(R),
          B = (0, a.useRef)(null),
          N = (0, m.mergeRefs)([I, B]),
          E = (0, a.useRef)(t),
          Y = (0, a.useRef)(!0),
          H = (0, a.useRef)([])
        return (
          (0, d.useIsomorphicLayoutEffect)(() => {
            ;(!r && !Y.current && f(E.current, t) && f(k, H.current)) ||
              (w(), (Y.current = !1), (E.current = t), (H.current = k))
          }, [t, w, k, r]),
          {
            containerRefCallback: N,
            moreButtonRef: v,
            innerContainerRefCallback: S,
            itemsRefs: b,
            setItemRef: h,
            hiddenItems: p.hidden,
            visibleItems: p.visible,
            itemsMeasurements: g,
          }
        )
      }
      function f(e, t) {
        return (
          e.length === t.length && e.reduce((e, n, i) => e && n === t[i], !0)
        )
      }
      function h(e, t, n, l = i.EndFirst) {
        const s = (0, a.useCallback)(
          (n, a) => {
            const s = e.map((e) => {
              var i
              return null !== (i = n.widthsMap.get(t(e))) && void 0 !== i
                ? i
                : 0
            })
            return (({
              items: e,
              containerWidth: t,
              elementsWidths: n,
              menuItemWidth: a,
              keepVisible: l,
              direction: s,
            }) => {
              const r = [...e],
                o = [],
                c = []
              let u = 0
              for (const e of n) u += e
              if (u <= t) return { visible: r, hidden: c }
              const d = [...n]
              if (
                ((u = l.map((e) => d[e]).reduce((e, t) => e + t, 0) + a),
                s === i.EndFirst)
              )
                for (let e = 0; e < r.length; e++)
                  l.includes(e)
                    ? o.push(r[e])
                    : ((u += d[e]), u <= t ? o.push(r[e]) : c.push(r[e]))
              else
                for (let e = r.length - 1; e >= 0; e--)
                  l.includes(e)
                    ? o.unshift(r[e])
                    : ((u += d[e]), u <= t ? o.unshift(r[e]) : c.unshift(r[e]))
              return { visible: o, hidden: c }
            })({
              items: e,
              containerWidth: n.containerWidth,
              elementsWidths: s,
              menuItemWidth: n.moreButtonWidth,
              keepVisible: a,
              direction: l,
            })
          },
          [e],
        )
        return b({
          itemsList: e,
          getItemId: t,
          calcVisibleAndHiddenItems: s,
          shouldKeepItemVisible: n,
        })
      }
      var v,
        g = n(38528),
        p = n(47201),
        C = n(7953),
        k = n(22064)
      function w(e, t = 'horizontal', n, i, a) {
        return {
          id: e,
          role: 'tablist',
          'aria-orientation': t,
          'aria-label': a,
          'aria-labelledby': i,
          'aria-disabled': n,
        }
      }
      function x(e, t, n, i, a) {
        return {
          id: e,
          role: 'tab',
          tabIndex: t ? 0 : -1,
          disabled: a,
          'aria-selected': n,
          'aria-controls': i,
          'aria-disabled': a,
        }
      }
      !((e) => {
        ;(e.SquareButtonTabs = 'square-button-tabs'),
          (e.UnderlineButtonTabs = 'underline-button-tabs'),
          (e.UnderlineAnchorTabs = 'underline-anchor-tabs'),
          (e.RoundAnchorTabs = 'round-anchor-tabs'),
          (e.RoundButtonTabs = 'round-button-tabs'),
          (e.LightButtonTabs = 'light-button-tabs')
      })(v || (v = {}))
      var z = n(29202),
        R = n(16921),
        y = n(50151),
        A = n(66686),
        S = n(36762)
      function I() {
        return !1
      }
      function B(e) {
        const { activationType: t = 'manual' } = e,
          n = (0, a.useMemo)(() => t, [])
        return (
          (0, y.assert)(t === n, 'Activation type must be invariant.'),
          'automatic' === t
            ? ((e) => {
                const {
                    isRtl: t,
                    items: n,
                    preventDefaultIfHandled: i = !0,
                    isHighlighted: l,
                    onHighlight: s,
                    onActivate: r,
                    isCollapsed: o = I,
                    orientation: c,
                  } = e,
                  u = (0, a.useCallback)(
                    (e) => {
                      s(e), o(e) || r(e)
                    },
                    [s, r, o],
                  )
                return (0, A.useKeyboardEventHandler)(
                  [(0, S.useItemsKeyboardNavigation)(c, t, n, l, u, !0)],
                  i,
                )
              })(e)
            : ((e) => {
                const {
                    isRtl: t,
                    items: n,
                    preventDefaultIfHandled: i = !0,
                    isHighlighted: l,
                    onHighlight: s,
                    onActivate: r,
                    orientation: o,
                  } = e,
                  c = n.find(l),
                  u = (0, a.useCallback)(() => {
                    void 0 !== c && r(c)
                  }, [c, r]),
                  d = (0, a.useCallback)((e) => s(e), [s]),
                  m = (0, S.useItemsKeyboardNavigation)(o, t, n, l, d, !0),
                  b = (0, A.useKeyboardActionHandler)([13, 32], u)
                return (0, A.useKeyboardEventHandler)([m, b], i)
              })(e)
        )
      }
      var N = n(5325)
      function E(e) {
        var t, n
        const {
            id: i,
            items: l,
            orientation: s,
            activationType: r = 'manual',
            disabled: o,
            tablistLabelId: c,
            tablistLabel: u,
            focusOnHighlight: d = !0,
            preventDefaultIfKeyboardActionHandled: m = !0,
            scrollIntoViewOptions: b,
            isActive: f,
            onActivate: h,
            isCollapsed: v,
            isRtl: g,
            isDisclosureOpened: C,
          } = e,
          y = (() => {
            const [e, t] = (0, a.useState)(!1)
            return (
              (0, a.useEffect)(() => {
                t(N.mobiletouch)
              }, []),
              e
            )
          })(),
          A = C ? null : s || 'horizontal',
          S = (0, a.useRef)(
            null !==
              (n =
                null === (t = e.itemsRefs) || void 0 === t
                  ? void 0
                  : t.current) && void 0 !== n
              ? n
              : new Map(),
          ),
          [I, E] = (0, a.useState)(),
          [Y, H] = (0, z.useFocus)(),
          W = l.find(f),
          T = (0, a.useCallback)((e) => !o && !e.disabled && e === I, [o, I]),
          O = (0, a.useCallback)(
            (e) => {
              const t = S.current.get(e)
              d && void 0 !== t && t !== document.activeElement && t.focus()
            },
            [d],
          ),
          M = (0, a.useRef)(),
          X = (0, a.useCallback)(
            (e, t) => {
              o ||
                e.disabled ||
                (E(e),
                'number' == typeof t
                  ? (clearTimeout(M.current),
                    (M.current = setTimeout(() => O(e), t)))
                  : O(e))
            },
            [o, E, O],
          ),
          F = (0, a.useCallback)(
            (e) => {
              o || e.disabled || (h(e), T(e) || X(e))
            },
            [o, h, T, X],
          ),
          P = B({
            isRtl: g,
            items: (0, a.useMemo)(
              () => l.filter((e) => !o && !e.disabled),
              [l, o],
            ),
            activationType: r,
            preventDefaultIfHandled: m,
            onActivate: F,
            isHighlighted: T,
            onHighlight: X,
            isCollapsed: v,
            orientation: A,
          }),
          D = (0, a.useCallback)(
            (e) => {
              let t = null
              for (const [n, i] of S.current.entries())
                if (e.target === i) {
                  t = n
                  break
                }
              t && !T(t) && ('automatic' === r && v && !v(t) ? F(t) : X(t))
            },
            [r, T, X, F, v],
          )
        ;(0, a.useEffect)(() => {
          y || (void 0 !== W && E(W))
        }, [W, y]),
          (0, a.useEffect)(() => {
            Y || E(void 0)
          }, [Y]),
          (0, a.useEffect)(() => () => clearTimeout(M.current), [])
        const [K, L] = (0, R.useKeepActiveItemIntoView)({
            ...b,
            activeItem: null != I ? I : W,
            getKey: (0, a.useCallback)((e) => e.id, []),
          }),
          j = (0, a.useCallback)(
            (e, t) => {
              L(e, t), null !== t ? S.current.set(e, t) : S.current.delete(e)
            },
            [L],
          ),
          q = l.map((e) => {
            var t, n
            const i = T(e),
              a = f(e),
              l =
                null !==
                  (n = null !== (t = e.disabled) && void 0 !== t ? t : o) &&
                void 0 !== n &&
                n,
              s = !l && (Y ? i : a)
            return {
              ...x(e.id, s, a, e.tabpanelId, l),
              highlighted: i,
              active: a,
              handleItemRef: j,
            }
          })
        var J
        return {
          tabsBindings: q,
          tablistBinding: {
            ...w(((J = i), (0, k.createDomId)(J, 'tablist')), s, o, c, u),
            onBlur: H.onBlur,
            onFocus: (0, p.createSafeMulticastEventHandler)(H.onFocus, D),
            onKeyDown: P,
          },
          scrollWrapBinding: { ref: K },
          onActivate: F,
          onHighlight: X,
          isHighlighted: T,
        }
      }
      var Y = n(26597)
      const H = (0, a.createContext)('small')
      var W = n(17946),
        T = n(25164)
      function O(e) {
        const {
          size: t = 'xsmall',
          active: n,
          fake: i,
          enableActiveStateStyles: a,
          anchor: s = !1,
          hideFocusOutline: r = !1,
          equalTabSize: o,
          className: c,
        } = e
        return l(
          T['underline-tab'],
          T[`size-${t}`],
          n && T.selected,
          !a && T['disable-active-state-styles'],
          r && T['disable-focus-outline'],
          i && T.fake,
          s && T['enable-cursor-pointer'],
          o && T[`margin-${t}`],
          c,
        )
      }
      const M = (0, a.forwardRef)((e, t) => {
        const n = (0, a.useContext)(H),
          i = (0, a.useContext)(W.CustomBehaviourContext),
          {
            active: l,
            fake: r,
            className: o,
            enableActiveStateStyles: c = i.enableActiveStateStyles,
            hideFocusOutline: u = !1,
            equalTabSize: d,
            children: m,
            ...b
          } = e
        return a.createElement(
          'button',
          {
            ...b,
            ref: t,
            className: O({
              size: n,
              active: l,
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
                  className: s()(
                    T['ellipsis-children'],
                    'apply-overflow-tooltip',
                  ),
                },
                m,
              )
            : m,
        )
      })
      M.displayName = 'UnderlineTabsBaseButton'
      const X = (0, a.forwardRef)((e, t) => {
        const {
            item: n,
            highlighted: i,
            handleItemRef: l,
            onClick: s,
            'aria-disabled': r,
            ...o
          } = e,
          c = (0, a.useCallback)(() => {
            s && s(n)
          }, [s, n]),
          u = (0, a.useCallback)(
            (e) => {
              l && l(n, e),
                t && 'object' == typeof t
                  ? (t.current = e)
                  : 'function' == typeof t && t(e)
            },
            [n, l, t],
          )
        return a.createElement(
          M,
          { ...o, id: n.id, onClick: c, ref: u },
          n.label,
        )
      })
      X.displayName = 'UnderlineButtonTab'
      var F = n(16396),
        P = n(4523),
        D = n(9745),
        K = n(47531),
        L = n(2948),
        j = n(63509),
        q = n(68874),
        J = n(85200)
      function V(e) {
        switch (e) {
          case 'xsmall':
            return K
          case 'small':
            return L
          case 'medium':
          case 'large':
            return j
          case 'xlarge':
            return q
        }
      }
      function $(e) {
        const { size: t, isDropped: n = !1 } = e
        return a.createElement(D.Icon, {
          icon: V(t),
          className: l(J['arrow-icon'], J[`size-${t}`], n && J.dropped),
        })
      }
      var U = n(45015)
      function Z(e) {
        const {
            size: t,
            disabled: n,
            isOpened: i,
            enableActiveStateStyles: l,
            hideFocusOutline: s,
            fake: r,
            items: o,
            buttonContent: c,
            buttonRef: u,
            isAnchorTabs: d,
            isHighlighted: m,
            onButtonClick: b,
            onItemClick: f,
            onClose: h,
          } = e,
          v = (0, a.useRef)(null),
          p = (0, g.useMergedRefs)([u, v]),
          C = ((e, t) => {
            const n = (0, a.useRef)(Q)
            return (
              (0, a.useEffect)(() => {
                const e = getComputedStyle((0, y.ensureNotNull)(t.current))
                n.current = {
                  xsmall: G(e, 'xsmall'),
                  small: G(e, 'small'),
                  medium: G(e, 'medium'),
                  large: G(e, 'large'),
                  xlarge: G(e, 'xlarge'),
                }
              }, [t]),
              (0, a.useCallback)(() => {
                const i = (0, y.ensureNotNull)(
                    t.current,
                  ).getBoundingClientRect(),
                  a = n.current[e]
                return {
                  x: i.left,
                  y: i.top + i.height + a + 4,
                  indentFromWindow: { top: 4, bottom: 4, left: 4, right: 4 },
                }
              }, [t, e])
            )
          })(t, v)
        return a.createElement(P.PopupMenuDisclosureView, {
          buttonRef: v,
          listboxTabIndex: -1,
          isOpened: i,
          onClose: h,
          listboxAria: { 'aria-hidden': !0 },
          popupPosition: C,
          button: a.createElement(
            M,
            {
              'aria-hidden': !0,
              disabled: n,
              active: i,
              onClick: b,
              ref: p,
              tabIndex: -1,
              enableActiveStateStyles: l,
              hideFocusOutline: s,
              fake: r,
            },
            c,
            a.createElement($, { size: t, isDropped: i }),
          ),
          popupChildren: o.map((e) =>
            a.createElement(F.PopupMenuItem, {
              key: e.id,
              className: d ? U['link-item'] : void 0,
              onClick: f,
              onClickArg: e,
              isActive: m(e),
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
      function G(e, t) {
        return Number.parseInt(
          e.getPropertyValue(`--ui-lib-underline-tabs-tab-margin-bottom-${t}`),
          10,
        )
      }
      const Q = { xsmall: 0, small: 0, medium: 0, large: 0, xlarge: 0 }
      var _ = n(86781),
        ee = n(86240),
        te = n(79877)
      function ne(e) {
        const { size: t, overflowBehaviour: n, className: i } = e
        return l(
          te['scroll-wrap'],
          te[`size-${t}`],
          'scroll' === n && te['enable-scroll'],
          i,
        )
      }
      function ie() {
        const [e, t] = (0, a.useState)(!1)
        return (
          (0, a.useEffect)(() => {
            t(N.mobiletouch)
          }, []),
          e
        )
      }
      var ae = n(12481),
        le = n(38223),
        se = n(10047),
        re = n.n(se)
      function oe(e) {
        const { disabled: t, translateX: n } = e,
          i = e.scale / 100
        return a.createElement(
          'div',
          {
            className: l(re().underline, t && re().disabled),
            style: { transform: `translateX(${n}px) scaleX(${i})` },
          },
          a.createElement('div', {
            className: re().corner,
            style: { transform: `scaleX(${1 / i})` },
          }),
          a.createElement('div', {
            className: re().center,
            style: { transform: `scaleX(${1 - 30 / e.scale})` },
          }),
          a.createElement('div', {
            className: re().corner,
            style: { transform: `scaleX(${1 / i})` },
          }),
        )
      }
      function ce(e) {
        const {
            id: t,
            items: i,
            activationType: l,
            orientation: o,
            disabled: c,
            moreButtonContent: u = r.t(null, void 0, n(41610)),
            size: d = 'small',
            onActivate: m,
            isActive: b,
            className: f,
            style: v,
            overflowBehaviour: k,
            enableActiveStateStyles: w,
            tablistLabelId: x,
            tablistLabel: z,
            'data-name': R = 'underline-tabs-buttons',
            stretchTabs: y,
            equalTabSize: A,
          } = e,
          S = ie(),
          I = ((e) => {
            const t = (0, _.useSafeMatchMedia)(
                ee['media-mf-phone-landscape'],
                !0,
              ),
              n = ie()
            return null != e ? e : n || !t ? 'scroll' : 'collapse'
          })(k),
          B = (0, a.useRef)(!1),
          N = (0, a.useCallback)((e) => e.id, []),
          W = 'none' === I && y,
          T = 'none' === I && A,
          O = null != w ? w : !S,
          {
            visibleItems: M,
            hiddenItems: F,
            containerRefCallback: P,
            innerContainerRefCallback: D,
            moreButtonRef: K,
            setItemRef: L,
          } = h(i, N, b),
          j = 'collapse' === I ? M : i,
          q = 'collapse' === I ? F : [],
          J = (0, a.useCallback)((e) => q.includes(e), [q]),
          V = (0, a.useRef)(new Map()),
          {
            isOpened: $,
            open: U,
            close: G,
            onButtonClick: Q,
          } = (0, C.useDisclosure)({ id: t, disabled: c }),
          {
            tabsBindings: se,
            tablistBinding: re,
            scrollWrapBinding: ce,
            onActivate: ue,
            onHighlight: de,
            isHighlighted: me,
          } = E({
            id: t,
            items: [...j, ...q],
            activationType: l,
            orientation: o,
            disabled: c,
            tablistLabelId: x,
            tablistLabel: z,
            onActivate: m,
            isActive: b,
            isCollapsed: J,
            isRtl: le.isRtl,
            itemsRefs: V,
            isDisclosureOpened: $,
          }),
          be = i.find(b),
          fe = q.find(me),
          he = (0, a.useCallback)(() => {
            be && de(be)
          }, [de, be]),
          ve = (0, a.useCallback)(
            (e) => {
              var t
              return null !== (t = se.find((t) => t.id === e.id)) &&
                void 0 !== t
                ? t
                : {}
            },
            [se],
          ),
          ge = (0, a.useCallback)(() => {
            G(), he(), (B.current = !0)
          }, [G, he]),
          pe = (0, a.useCallback)(() => {
            fe && (ue(fe), de(fe, 200))
          }, [ue, de, fe])
        ;(ce.ref = (0, g.useMergedRefs)([ce.ref, P])),
          (re.ref = (0, g.useMergedRefs)([re.ref, D])),
          (re.onKeyDown = (0, p.createSafeMulticastEventHandler)(
            (0, Y.useKeyboardEventHandler)([
              (0, Y.useKeyboardClose)($, ge),
              (0, Y.useKeyboardActionHandler)(
                [13, 32],
                pe,
                (0, a.useCallback)(() => Boolean(fe), [fe]),
              ),
            ]),
            re.onKeyDown,
          ))
        const Ce = (0, a.useCallback)(
            (e) => {
              ;(B.current = !0), Q(e)
            },
            [B, Q],
          ),
          ke = (0, a.useCallback)(
            (e) => {
              e && ue(e)
            },
            [ue],
          )
        ;(0, a.useEffect)(() => {
          B.current ? (B.current = !1) : (fe && !$ && U(), !fe && $ && G())
        }, [fe, $, U, G])
        const we = ((e, t, n) => {
          const [i, l] = (0, a.useState)(),
            s = (0, a.useRef)(),
            r = (e) => {
              var t
              const n =
                null !== (t = e.parentElement) && void 0 !== t ? t : void 0
              if (void 0 === n) return
              const { left: i, right: a, width: s } = e.getBoundingClientRect(),
                { left: r, right: o } = n.getBoundingClientRect(),
                c = (0, le.isRtl)() ? a - o : i - r
              l({ translateX: c, scale: s })
            }
          return (
            (0, a.useEffect)(() => {
              const e = (0, ae.default)((e) => {
                const t = e[0].target
                void 0 !== t && r(t)
              }, 50)
              s.current = new ResizeObserver(e)
            }, []),
            (0, a.useEffect)(() => {
              var n
              if (void 0 === t) return
              const i = e.get(t)
              return void 0 !== i
                ? (r(i),
                  null === (n = s.current) || void 0 === n || n.observe(i),
                  () => {
                    var e
                    return null === (e = s.current) || void 0 === e
                      ? void 0
                      : e.disconnect()
                  })
                : void 0
            }, n),
            i
          )
        })(V.current, null != be ? be : fe, [null != be ? be : fe, j, d, W, I])
        return a.createElement(
          H.Provider,
          { value: d },
          a.createElement(
            'div',
            {
              ...ce,
              className: ne({ size: d, overflowBehaviour: I, className: f }),
              style: v,
              'data-name': R,
            },
            a.createElement(
              'div',
              {
                ...re,
                className: s()(te['underline-tabs'], {
                  [te['make-grid-column']]: W || T,
                  [te['stretch-tabs']]: W,
                  [te['equal-tab-size']]: T,
                }),
              },
              j.map((e) =>
                a.createElement(X, {
                  ...ve(e),
                  key: e.id,
                  item: e,
                  onClick: ue,
                  enableActiveStateStyles: O,
                  hideFocusOutline: S,
                  ref: L(N(e)),
                  ...(e.dataId && { 'data-id': e.dataId }),
                  equalTabSize: T,
                }),
              ),
              q.map((e) =>
                a.createElement(X, { ...ve(e), key: e.id, item: e, fake: !0 }),
              ),
              a.createElement(Z, {
                size: d,
                disabled: c,
                isOpened: $,
                items: q,
                buttonContent: u,
                buttonRef: K,
                isHighlighted: me,
                onButtonClick: Ce,
                onItemClick: ke,
                onClose: G,
                enableActiveStateStyles: O,
                hideFocusOutline: S,
                fake: 0 === q.length,
              }),
              we && a.createElement(oe, { ...we, disabled: c }),
            ),
          ),
        )
      }
      var ue = n(38952)
      function de(e) {
        return a.createElement('a', { ...(0, ue.renameRef)(e) })
      }
      ;(0, a.forwardRef)((e, t) => {
        var n
        const i = (0, a.useContext)(H),
          l = (0, a.useContext)(W.CustomBehaviourContext),
          {
            item: s,
            highlighted: r,
            handleItemRef: o,
            onClick: c,
            active: u,
            fake: d,
            className: m,
            enableActiveStateStyles: b = l.enableActiveStateStyles,
            hideFocusOutline: f = !1,
            disabled: h,
            'aria-disabled': v,
            ...g
          } = e,
          p = (0, a.useCallback)(
            (e) => {
              v ? e.preventDefault() : c && c(s)
            },
            [c, v, s],
          ),
          C = (0, a.useCallback)(
            (e) => {
              o && o(s, e),
                t && 'object' == typeof t
                  ? (t.current = e)
                  : 'function' == typeof t && t(e)
            },
            [s, o, t],
          ),
          k = null !== (n = s.renderComponent) && void 0 !== n ? n : de
        return a.createElement(
          k,
          {
            ...g,
            id: s.id,
            'aria-disabled': v,
            onClick: p,
            reference: C,
            href: s.href,
            rel: s.rel,
            target: s.target,
            className: O({
              size: i,
              active: u,
              fake: d,
              enableActiveStateStyles: b,
              anchor: !0,
              hideFocusOutline: f,
              className: m,
            }),
          },
          s.label,
        )
      }).displayName = 'UnderlineAnchorTab'
    },
    47531: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="m4.67 7.38.66-.76L9 9.84l3.67-3.22.66.76L9 11.16 4.67 7.38Z"/></svg>'
    },
    63509: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M3.57 7.85 9 12.62l5.43-4.77-1.32-1.5L9 9.95l-4.11-3.6-1.32 1.5Z"/></svg>'
    },
    68874: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M7.3 10.3a1 1 0 0 1 1.4 0l5.3 5.29 5.3-5.3a1 1 0 1 1 1.4 1.42l-6 6a1 1 0 0 1-1.4 0l-6-6a1 1 0 0 1 0-1.42Z"/></svg>'
    },
  },
])
