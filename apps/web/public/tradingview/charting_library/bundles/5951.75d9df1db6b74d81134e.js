;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5951],
  {
    429510: (e, t, n) => {
      var i
      n.d(t, { useCollapsible: () => s }),
        ((e) => {
          ;(e.StartFirst = 'start-first'), (e.EndFirst = 'end-first')
        })(i || (i = {}))
      var r = n(50959),
        u = n(708886)
      function s(e, t, n, s = i.EndFirst) {
        const o = (0, r.useCallback)(
          (n, r) => {
            const u = e.map((e) => {
              var i
              return null !== (i = n.widthsMap.get(t(e))) && void 0 !== i
                ? i
                : 0
            })
            return (({
              items: e,
              containerWidth: t,
              elementsWidths: n,
              menuItemWidth: r,
              keepVisible: u,
              direction: s,
            }) => {
              const o = [...e],
                a = [],
                l = []
              let c = 0
              for (const e of n) c += e
              if (c <= t) return { visible: o, hidden: l }
              const d = [...n]
              if (
                ((c = u.map((e) => d[e]).reduce((e, t) => e + t, 0) + r),
                s === i.EndFirst)
              )
                for (let e = 0; e < o.length; e++)
                  u.includes(e)
                    ? a.push(o[e])
                    : ((c += d[e]), c <= t ? a.push(o[e]) : l.push(o[e]))
              else
                for (let e = o.length - 1; e >= 0; e--)
                  u.includes(e)
                    ? a.unshift(o[e])
                    : ((c += d[e]), c <= t ? a.unshift(o[e]) : l.unshift(o[e]))
              return { visible: a, hidden: l }
            })({
              items: e,
              containerWidth: n.containerWidth,
              elementsWidths: u,
              menuItemWidth: n.moreButtonWidth,
              keepVisible: r,
              direction: s,
            })
          },
          [e],
        )
        return (0, u.useCollapsibleCommon)({
          itemsList: e,
          getItemId: t,
          calcVisibleAndHiddenItems: o,
          shouldKeepItemVisible: n,
        })
      }
    },
    708886: (e, t, n) => {
      n.d(t, { useCollapsibleCommon: () => l })
      var i = n(50959),
        r = n(664332),
        u = n(65160),
        s = n(457927),
        o = n(855393),
        a = n(273388)
      function l(e) {
        const {
            itemsList: t,
            getItemId: n,
            calcVisibleAndHiddenItems: l,
            shouldKeepItemVisible: d,
            onMeasureCallback: b,
            forceUpdate: f = !1,
          } = e,
          [h, m] = (0, s.useRefsMap)(),
          v = (0, i.useRef)(null),
          g = (0, i.useRef)({
            widthsMap: new Map(),
            containerWidth: 0,
            moreButtonWidth: 0,
          }),
          [p, R] = (0, i.useState)({ visible: t, hidden: [] }),
          C = (0, i.useMemo)(
            () => t.reduce((e, t, n) => (d(t) && e.push(n), e), []),
            [t, d],
          ),
          I = (0, i.useCallback)(() => {
            if (g.current.containerWidth) {
              const e = l(g.current, C)
              ;((e, t) => !c(e.visible, t.visible) || !c(e.hidden, t.hidden))(
                p,
                e,
              ) && R(e)
            }
          }, [g, R, p, C, l]),
          H = (0, i.useCallback)(() => {
            g.current.moreButtonWidth = v.current
              ? (0, u.outerWidth)(v.current, !0)
              : 0
            const e = new Map(g.current.widthsMap)
            for (const i of t) {
              const t = n(i),
                r = h.current.get(t)
              if (r) {
                const n = (0, u.outerWidth)(r, !0)
                e.set(t, n)
              }
            }
            ;(g.current.widthsMap = e), b && b()
          }, [g, t, n, h, b]),
          T = (0, i.useRef)(null),
          k = (0, i.useCallback)(
            ([e]) => {
              e.contentRect.width !== g.current.containerWidth &&
                (T.current && cancelAnimationFrame(T.current),
                (g.current.containerWidth = e.contentRect.width),
                (T.current = requestAnimationFrame(() => {
                  I()
                })))
            },
            [g, I],
          ),
          A = (0, i.useRef)(null),
          M = (0, i.useCallback)(
            ([e]) => {
              A.current && cancelAnimationFrame(A.current),
                H(),
                (A.current = requestAnimationFrame(() => {
                  I()
                }))
            },
            [H, I],
          ),
          W = (0, r.useResizeObserver)(M),
          w = (0, r.useResizeObserver)(k),
          E = (0, i.useRef)(null),
          y = (0, a.mergeRefs)([w, E]),
          B = (0, i.useRef)(t),
          F = (0, i.useRef)(!0),
          S = (0, i.useRef)([])
        return (
          (0, o.useIsomorphicLayoutEffect)(() => {
            ;(!f && !F.current && c(B.current, t) && c(C, S.current)) ||
              (I(), (F.current = !1), (B.current = t), (S.current = C))
          }, [t, I, C, f]),
          {
            containerRefCallback: y,
            moreButtonRef: v,
            innerContainerRefCallback: W,
            itemsRefs: h,
            setItemRef: m,
            hiddenItems: p.hidden,
            visibleItems: p.visible,
            itemsMeasurements: g,
          }
        )
      }
      function c(e, t) {
        return (
          e.length === t.length && e.reduce((e, n, i) => e && n === t[i], !0)
        )
      }
    },
    975228: (e, t, n) => {
      n.d(t, {
        hoverMouseEventFilter: () => u,
        useAccurateHover: () => s,
        useHover: () => r,
      })
      var i = n(50959)
      function r() {
        const [e, t] = (0, i.useState)(!1)
        return [
          e,
          {
            onMouseOver: (e) => {
              u(e) && t(!0)
            },
            onMouseOut: (e) => {
              u(e) && t(!1)
            },
          },
        ]
      }
      function u(e) {
        return !e.currentTarget.contains(e.relatedTarget)
      }
      function s(e) {
        const [t, n] = (0, i.useState)(!1)
        return (
          (0, i.useEffect)(() => {
            const t = (t) => {
              if (null === e.current) return
              const i = e.current.contains(t.target)
              n(i)
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
    118965: (e, t, n) => {
      n.d(t, { useMobileTouchState: () => u })
      var i = n(50959),
        r = n(804395)
      function u() {
        const [e, t] = (0, i.useState)(!1)
        return (
          (0, i.useEffect)(() => {
            t(r.mobiletouch)
          }, []),
          e
        )
      }
    },
    457927: (e, t, n) => {
      n.d(t, { useRefsMap: () => r })
      var i = n(50959)
      function r() {
        const e = (0, i.useRef)(new Map()),
          t = (0, i.useCallback)(
            (t) => (n) => {
              null !== n ? e.current.set(t, n) : e.current.delete(t)
            },
            [e],
          )
        return [e, t]
      }
    },
    984164: (e, t, n) => {
      n.d(t, { useTabs: () => h })
      var i = n(50959),
        r = n(897107),
        u = n(269842),
        s = n(383836),
        o = n(930617),
        a = n(650151),
        l = n(865968),
        c = n(648621)
      function d() {
        return !1
      }
      function b(e) {
        const { activationType: t = 'manual' } = e,
          n = (0, i.useMemo)(() => t, [])
        return (
          (0, a.assert)(t === n, 'Activation type must be invariant.'),
          'automatic' === t
            ? ((e) => {
                const {
                    isRtl: t,
                    items: n,
                    preventDefaultIfHandled: r = !0,
                    isHighlighted: u,
                    onHighlight: s,
                    onActivate: o,
                    isCollapsed: a = d,
                    orientation: b,
                  } = e,
                  f = (0, i.useCallback)(
                    (e) => {
                      s(e), a(e) || o(e)
                    },
                    [s, o, a],
                  )
                return (0, l.useKeyboardEventHandler)(
                  [(0, c.useItemsKeyboardNavigation)(b, t, n, u, f, !0)],
                  r,
                )
              })(e)
            : ((e) => {
                const {
                    isRtl: t,
                    items: n,
                    preventDefaultIfHandled: r = !0,
                    isHighlighted: u,
                    onHighlight: s,
                    onActivate: o,
                    orientation: a,
                  } = e,
                  d = n.find(u),
                  b = (0, i.useCallback)(() => {
                    void 0 !== d && o(d)
                  }, [d, o]),
                  f = (0, i.useCallback)((e) => s(e), [s]),
                  h = (0, c.useItemsKeyboardNavigation)(a, t, n, u, f, !0),
                  m = (0, l.useKeyboardActionHandler)([13, 32], b)
                return (0, l.useKeyboardEventHandler)([h, m], r)
              })(e)
        )
      }
      var f = n(118965)
      function h(e) {
        var t, n
        const {
            id: a,
            items: l,
            orientation: c,
            activationType: d = 'manual',
            disabled: h,
            tablistLabelId: m,
            tablistLabel: v,
            focusOnHighlight: g = !0,
            preventDefaultIfKeyboardActionHandled: p = !0,
            scrollIntoViewOptions: R,
            isActive: C,
            onActivate: I,
            isCollapsed: H,
            isRtl: T,
            isDisclosureOpened: k,
          } = e,
          A = (0, f.useMobileTouchState)(),
          M = k ? null : c || 'horizontal',
          W = (0, i.useRef)(
            null !==
              (n =
                null === (t = e.itemsRefs) || void 0 === t
                  ? void 0
                  : t.current) && void 0 !== n
              ? n
              : new Map(),
          ),
          [w, E] = (0, i.useState)(),
          [y, B] = (0, s.useFocus)(),
          F = l.find(C),
          S = (0, i.useCallback)((e) => !h && !e.disabled && e === w, [h, w]),
          L = (0, i.useCallback)(
            (e) => {
              const t = W.current.get(e)
              g && void 0 !== t && t !== document.activeElement && t.focus()
            },
            [g],
          ),
          K = (0, i.useRef)(),
          V = (0, i.useCallback)(
            (e, t) => {
              h ||
                e.disabled ||
                (E(e),
                'number' == typeof t
                  ? (clearTimeout(K.current),
                    (K.current = setTimeout(() => L(e), t)))
                  : L(e))
            },
            [h, E, L],
          ),
          D = (0, i.useCallback)(
            (e) => {
              h || e.disabled || (I(e), S(e) || V(e))
            },
            [h, I, S, V],
          ),
          O = b({
            isRtl: T,
            items: (0, i.useMemo)(
              () => l.filter((e) => !h && !e.disabled),
              [l, h],
            ),
            activationType: d,
            preventDefaultIfHandled: p,
            onActivate: D,
            isHighlighted: S,
            onHighlight: V,
            isCollapsed: H,
            orientation: M,
          }),
          x = (0, i.useCallback)(
            (e) => {
              let t = null
              for (const [n, i] of W.current.entries())
                if (e.target === i) {
                  t = n
                  break
                }
              t && !S(t) && ('automatic' === d && H && !H(t) ? D(t) : V(t))
            },
            [d, S, V, D, H],
          )
        ;(0, i.useEffect)(() => {
          A || (void 0 !== F && E(F))
        }, [F, A]),
          (0, i.useEffect)(() => {
            y || E(void 0)
          }, [y]),
          (0, i.useEffect)(() => () => clearTimeout(K.current), [])
        const [z, q] = (0, o.useKeepActiveItemIntoView)({
            ...R,
            activeItem: null != w ? w : F,
            getKey: (0, i.useCallback)((e) => e.id, []),
          }),
          N = (0, i.useCallback)(
            (e, t) => {
              q(e, t), null !== t ? W.current.set(e, t) : W.current.delete(e)
            },
            [q],
          ),
          U = l.map((e) => {
            var t, n
            const i = S(e),
              u = C(e),
              s =
                null !==
                  (n = null !== (t = e.disabled) && void 0 !== t ? t : h) &&
                void 0 !== n &&
                n,
              o = !s && (y ? i : u)
            return {
              ...(0, r.getTabAttributes)(e.id, o, u, e.tabpanelId, s),
              highlighted: i,
              active: u,
              handleItemRef: N,
            }
          })
        return {
          tabsBindings: U,
          tablistBinding: {
            ...(0, r.getTabListAttributes)((0, r.getTablistId)(a), c, h, m, v),
            onBlur: B.onBlur,
            onFocus: (0, u.createSafeMulticastEventHandler)(B.onFocus, x),
            onKeyDown: O,
          },
          scrollWrapBinding: { ref: z },
          onActivate: D,
          onHighlight: V,
          isHighlighted: S,
        }
      }
    },
    897107: (e, t, n) => {
      n.d(t, {
        TabNames: () => i,
        getTabAttributes: () => o,
        getTabListAttributes: () => s,
        getTablistId: () => u,
      })
      var i,
        r = n(414823)
      function u(e) {
        return (0, r.createDomId)(e, 'tablist')
      }
      function s(e, t = 'horizontal', n, i, r) {
        return {
          id: e,
          role: 'tablist',
          'aria-orientation': t,
          'aria-label': r,
          'aria-labelledby': i,
          'aria-disabled': n,
        }
      }
      function o(e, t, n, i, r) {
        return {
          id: e,
          role: 'tab',
          tabIndex: t ? 0 : -1,
          disabled: r,
          'aria-selected': n,
          'aria-controls': i,
          'aria-disabled': r,
        }
      }
      !((e) => {
        ;(e.SquareButtonTabs = 'square-button-tabs'),
          (e.UnderlineButtonTabs = 'underline-button-tabs'),
          (e.UnderlineAnchorTabs = 'underline-anchor-tabs'),
          (e.RoundAnchorTabs = 'round-anchor-tabs'),
          (e.RoundButtonTabs = 'round-button-tabs'),
          (e.LightButtonTabs = 'light-button-tabs')
      })(i || (i = {}))
    },
    65160: (e, t, n) => {
      function i(e) {
        const { paddingTop: t, paddingBottom: n } = window.getComputedStyle(e)
        return [t, n].reduce(
          (e, t) => e - Number((t || '').replace('px', '')),
          e.clientHeight,
        )
      }
      function r(e, t = !1) {
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
      function u(e, t = !1) {
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
      n.d(t, {
        contentHeight: () => i,
        outerHeight: () => r,
        outerWidth: () => u,
      })
    },
    269842: (e, t, n) => {
      function i(...e) {
        return (t) => {
          for (const n of e) void 0 !== n && n(t)
        }
      }
      n.d(t, { createSafeMulticastEventHandler: () => i })
    },
    522224: (e, t, n) => {
      n.d(t, {
        hoverMouseEventFilter: () => i.hoverMouseEventFilter,
        useAccurateHover: () => i.useAccurateHover,
        useHover: () => i.useHover,
      })
      var i = n(975228)
    },
  },
])
