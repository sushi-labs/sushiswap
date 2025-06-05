;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3202],
  {
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
    9059: (e) => {
      e.exports = {
        'tablet-small-breakpoint': '(max-width: 440px)',
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
    53885: (e, t, n) => {
      n.d(t, { getStyleClasses: () => s, isCircleLogoWithUrlProps: () => a })
      var o = n(97754),
        r = n(52292),
        i = n(56057),
        l = n.n(i)
      function s(e, t = 2, n) {
        return o(
          l().logo,
          l()[e],
          n,
          0 === t || 1 === t
            ? o(r.skeletonTheme.wrapper, l().skeleton)
            : l().letter,
          1 === t && r.skeletonTheme.animated,
        )
      }
      function a(e) {
        return (
          'logoUrl' in e &&
          null !== e.logoUrl &&
          void 0 !== e.logoUrl &&
          0 !== e.logoUrl.length
        )
      }
    },
    86332: (e, t, n) => {
      n.d(t, { ControlGroupContext: () => o })
      const o = n(50959).createContext({
        isGrouped: !1,
        cellState: { isTop: !0, isRight: !0, isBottom: !0, isLeft: !0 },
      })
    },
    17946: (e, t, n) => {
      n.d(t, { CustomBehaviourContext: () => o })
      const o = (0, n(50959).createContext)({ enableActiveStateStyles: !0 })
      o.displayName = 'CustomBehaviourContext'
    },
    95854: (e, t, n) => {
      var o
      n.d(t, { useCollapsible: () => f }),
        ((e) => {
          ;(e.StartFirst = 'start-first'), (e.EndFirst = 'end-first')
        })(o || (o = {}))
      var r = n(50959),
        i = n(67842),
        l = n(56073),
        s = n(78869),
        a = n(43010),
        c = n(53017)
      function u(e) {
        const {
            itemsList: t,
            getItemId: n,
            calcVisibleAndHiddenItems: o,
            shouldKeepItemVisible: u,
            onMeasureCallback: f,
            forceUpdate: h = !1,
          } = e,
          [b, m] = (0, s.useRefsMap)(),
          p = (0, r.useRef)(null),
          g = (0, r.useRef)({
            widthsMap: new Map(),
            containerWidth: 0,
            moreButtonWidth: 0,
          }),
          [v, x] = (0, r.useState)({ visible: t, hidden: [] }),
          C = (0, r.useMemo)(
            () => t.reduce((e, t, n) => (u(t) && e.push(n), e), []),
            [t, u],
          ),
          k = (0, r.useCallback)(() => {
            if (g.current.containerWidth) {
              const e = o(g.current, C)
              ;((e, t) => !d(e.visible, t.visible) || !d(e.hidden, t.hidden))(
                v,
                e,
              ) && x(e)
            }
          }, [g, x, v, C, o]),
          E = (0, r.useCallback)(() => {
            g.current.moreButtonWidth = p.current
              ? (0, l.outerWidth)(p.current, !0)
              : 0
            const e = new Map(g.current.widthsMap)
            for (const o of t) {
              const t = n(o),
                r = b.current.get(t)
              if (r) {
                const n = (0, l.outerWidth)(r, !0)
                e.set(t, n)
              }
            }
            ;(g.current.widthsMap = e), f && f()
          }, [g, t, n, b, f]),
          M = (0, r.useRef)(null),
          w = (0, r.useCallback)(
            ([e]) => {
              e.contentRect.width !== g.current.containerWidth &&
                (M.current && cancelAnimationFrame(M.current),
                (g.current.containerWidth = e.contentRect.width),
                (M.current = requestAnimationFrame(() => {
                  k()
                })))
            },
            [g, k],
          ),
          y = (0, r.useRef)(null),
          R = (0, r.useCallback)(
            ([e]) => {
              y.current && cancelAnimationFrame(y.current),
                E(),
                (y.current = requestAnimationFrame(() => {
                  k()
                }))
            },
            [E, k],
          ),
          S = (0, i.useResizeObserver)(R),
          I = (0, i.useResizeObserver)(w),
          F = (0, r.useRef)(null),
          A = (0, c.mergeRefs)([I, F]),
          O = (0, r.useRef)(t),
          P = (0, r.useRef)(!0),
          T = (0, r.useRef)([])
        return (
          (0, a.useIsomorphicLayoutEffect)(() => {
            ;(!h && !P.current && d(O.current, t) && d(C, T.current)) ||
              (k(), (P.current = !1), (O.current = t), (T.current = C))
          }, [t, k, C, h]),
          {
            containerRefCallback: A,
            moreButtonRef: p,
            innerContainerRefCallback: S,
            itemsRefs: b,
            setItemRef: m,
            hiddenItems: v.hidden,
            visibleItems: v.visible,
            itemsMeasurements: g,
          }
        )
      }
      function d(e, t) {
        return (
          e.length === t.length && e.reduce((e, n, o) => e && n === t[o], !0)
        )
      }
      function f(e, t, n, i = o.EndFirst) {
        const l = (0, r.useCallback)(
          (n, r) => {
            const l = e.map((e) => n.widthsMap.get(t(e)) ?? 0)
            return (({
              items: e,
              containerWidth: t,
              elementsWidths: n,
              menuItemWidth: r,
              keepVisible: i,
              direction: l,
            }) => {
              const s = [...e],
                a = [],
                c = []
              let u = 0
              for (const e of n) u += e
              if (u <= t) return { visible: s, hidden: c }
              const d = [...n]
              if (
                ((u = i.map((e) => d[e]).reduce((e, t) => e + t, 0) + r),
                l === o.EndFirst)
              )
                for (let e = 0; e < s.length; e++)
                  i.includes(e)
                    ? a.push(s[e])
                    : ((u += d[e]), u <= t ? a.push(s[e]) : c.push(s[e]))
              else
                for (let e = s.length - 1; e >= 0; e--)
                  i.includes(e)
                    ? a.unshift(s[e])
                    : ((u += d[e]), u <= t ? a.unshift(s[e]) : c.unshift(s[e]))
              return { visible: a, hidden: c }
            })({
              items: e,
              containerWidth: n.containerWidth,
              elementsWidths: l,
              menuItemWidth: n.moreButtonWidth,
              keepVisible: r,
              direction: i,
            })
          },
          [e],
        )
        return u({
          itemsList: e,
          getItemId: t,
          calcVisibleAndHiddenItems: l,
          shouldKeepItemVisible: n,
        })
      }
    },
    66686: (e, t, n) => {
      n.d(t, {
        useComposedKeyboardActionHandlers: () => s,
        useKeyboardActionHandler: () => l,
        useKeyboardClose: () => u,
        useKeyboardEventHandler: () => a,
        useKeyboardOpen: () => d,
        useKeyboardToggle: () => c,
      })
      var o = n(50959),
        r = n(3343)
      const i = () => !0
      function l(e, t, n = i, r) {
        return (0, o.useCallback)(
          (o) => {
            if (r) {
              if ('horizontal' === r && (40 === o || 38 === o)) return
              if ('vertical' === r && (37 === o || 39 === o)) return
            }
            const i = e.map((e) => ('function' == typeof e ? e() : e))
            return !(!n(o) || !i.includes(o)) && (t(o), !0)
          },
          [...e, t, n],
        )
      }
      function s(...e) {
        return (0, o.useCallback)(
          (t) => {
            for (const n of e) if (n(t)) return !0
            return !1
          },
          [...e],
        )
      }
      function a(e, t = !0, n = !1) {
        const i = s(...e)
        return (0, o.useCallback)(
          (e) => {
            const o = i((0, r.hashFromEvent)(e))
            o && t && e.preventDefault(), o && n && e.stopPropagation()
          },
          [i],
        )
      }
      function c(e, t = !0) {
        return l([13, 32], e, (e) => {
          if (13 === e) return t
          return !0
        })
      }
      function u(e, t) {
        return l(
          [9, (0, o.useCallback)(() => r.Modifiers.Shift + 9, []), 27],
          t,
          (0, o.useCallback)(() => e, [e]),
        )
      }
      function d(e, t) {
        return l(
          [40, 38],
          t,
          (0, o.useCallback)(() => !e, [e]),
        )
      }
    },
    7953: (e, t, n) => {
      n.d(t, { useDisclosure: () => c })
      var o = n(50959),
        r = n(50151),
        i = n(54717),
        l = n(29202),
        s = n(47201),
        a = n(22064)
      function c(e) {
        const {
            id: t,
            listboxId: n,
            disabled: c,
            buttonTabIndex: u = 0,
            onFocus: d,
            onBlur: f,
            onClick: h,
          } = e,
          [b, m] = (0, o.useState)(!1),
          [p, g] = (0, l.useFocus)(),
          v = p || b,
          x = (n ?? void 0 !== t) ? (0, a.createDomId)(t, 'listbox') : void 0,
          C = (0, o.useRef)(null),
          k = (0, o.useCallback)((e) => C.current?.focus(e), [C]),
          E = (0, o.useRef)(null),
          M = (0, o.useCallback)(
            () => (0, r.ensureNotNull)(E.current).focus(),
            [E],
          ),
          w = (0, o.useCallback)(() => m(!0), [m]),
          y = (0, o.useCallback)(
            (e = !1, t = !1) => {
              m(!1)
              const { activeElement: n } = document
              ;(n && (0, i.isTextEditingField)(n)) ||
                t ||
                k({ preventScroll: e })
            },
            [m, k],
          ),
          R = (0, o.useCallback)(() => {
            b ? y() : w()
          }, [b, y, w]),
          S = c ? [] : [d, g.onFocus],
          I = c ? [] : [f, g.onBlur],
          F = c ? [] : [h, R],
          A = (0, s.createSafeMulticastEventHandler)(...S),
          O = (0, s.createSafeMulticastEventHandler)(...I),
          P = (0, s.createSafeMulticastEventHandler)(...F)
        return {
          listboxId: x,
          isOpened: b,
          isFocused: v,
          buttonTabIndex: c ? -1 : u,
          listboxTabIndex: -1,
          open: w,
          close: y,
          toggle: R,
          onOpen: M,
          buttonFocusBindings: { onFocus: A, onBlur: O },
          onButtonClick: P,
          buttonRef: C,
          listboxRef: E,
          buttonAria: {
            'aria-controls': b ? x : void 0,
            'aria-expanded': b,
            'aria-disabled': c,
          },
        }
      }
    },
    29202: (e, t, n) => {
      n.d(t, { useFocus: () => r })
      var o = n(50959)
      function r(e, t) {
        const [n, r] = (0, o.useState)(!1)
        ;(0, o.useEffect)(() => {
          t && n && r(!1)
        }, [t, n])
        const i = {
          onFocus: (0, o.useCallback)(
            (t) => {
              ;(void 0 !== e && e.current !== t.target) || r(!0)
            },
            [e],
          ),
          onBlur: (0, o.useCallback)(
            (t) => {
              ;(void 0 !== e && e.current !== t.target) || r(!1)
            },
            [e],
          ),
        }
        return [n, i]
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
                s.current(e)
              }),
            [],
          ),
          n = (0, o.useRef)(null),
          i = (t) => {
            if (null === t) return l(n.current, t), void (n.current = null)
            n.current !== e && ((n.current = e), l(n.current, t))
          },
          s = (0, o.useRef)(i)
        return (
          (s.current = i),
          (0, r.useIsomorphicLayoutEffect)(() => {
            if (null !== t.current)
              return s.current(t.current), () => s.current(null)
          }, [e]),
          t
        )
      }
      function l(e, t) {
        null !== e && ('function' == typeof e ? e(t) : (e.current = t))
      }
    },
    36762: (e, t, n) => {
      n.d(t, { useItemsKeyboardNavigation: () => a })
      var o,
        r = n(50959),
        i = n(66686)
      function l(e, t) {
        return e >= 0 ? e % t : (t - (Math.abs(e) % t)) % t
      }
      !((e) => {
        ;(e.Next = 'next'),
          (e.Previous = 'previous'),
          (e.First = 'first'),
          (e.Last = 'last')
      })(o || (o = {}))
      const s = (e) => ({
        next: [40, () => (e() ? 37 : 39)],
        previous: [38, () => (e() ? 39 : 37)],
        first: [33, () => (e() ? 35 : 36)],
        last: [34, () => (e() ? 36 : 35)],
      })
      function a(e, t, n, o, a, c, u = {}, d, f) {
        const h = (0, r.useCallback)(
            (e) => {
              const t = n.findIndex(o)
              if (t === n.length - 1 && !c)
                return void (d?.onFailNext && d.onFailNext(e))
              const r = l(t + 1, n.length)
              a && a(n[r], 'next')
            },
            [n, o, a, c],
          ),
          b = (0, r.useCallback)(
            (e) => {
              const t = n.findIndex(o)
              if (0 === t && !c) return void (d?.onFailPrev && d.onFailPrev(e))
              const r = l(t - 1, n.length)
              a && a(n[r], 'previous')
            },
            [n, o, a, c],
          ),
          m = (0, r.useCallback)(() => {
            a && a(n[0], 'first')
          }, [a, n]),
          p = (0, r.useCallback)(() => {
            a && a(n[n.length - 1], 'last')
          }, [a, n]),
          g = (0, r.useMemo)(() => s(t), [t]),
          {
            next: v = g.next,
            previous: x = g.previous,
            first: C = g.first,
            last: k = g.last,
          } = u
        return (0, i.useComposedKeyboardActionHandlers)(
          (0, i.useKeyboardActionHandler)(v, h, f?.next ?? (() => !0), e),
          (0, i.useKeyboardActionHandler)(x, b, f?.previous ?? (() => !0), e),
          (0, i.useKeyboardActionHandler)(C, m, () => !0, e),
          (0, i.useKeyboardActionHandler)(k, p, () => !0, e),
        )
      }
    },
    16921: (e, t, n) => {
      n.d(t, {
        useKeepActiveItemIntoView: () => d,
      })
      var o = n(50959),
        r = n(50151),
        i = n(74991)
      const l = { duration: 200, additionalScroll: 0 },
        s = {
          vertical: {
            scrollSize: 'scrollHeight',
            clientSize: 'clientHeight',
            start: 'top',
            end: 'bottom',
            size: 'height',
          },
          horizontal: {
            scrollSize: 'scrollWidth',
            clientSize: 'clientWidth',
            start: 'left',
            end: 'right',
            size: 'width',
          },
        }
      function a(e, t) {
        const n = s[e]
        return t[n.scrollSize] > t[n.clientSize]
      }
      function c(e, t, n, o, r, l) {
        const a = ((e, t, n, o = 0) => {
          const r = s[e]
          return {
            start: -1 * o,
            middle:
              -1 * (Math.floor(n[r.size] / 2) - Math.floor(t[r.size] / 2)),
            end: -1 * (n[r.size] - t[r.size]) + o,
          }
        })(e, o, r, l.additionalScroll)
        let c = 0
        if (
          l.snapToMiddle ||
          ((e, t, n) => {
            const o = s[e]
            return (
              t[o.start] < n[o.start] - n[o.size] / 2 ||
              t[o.end] > n[o.end] + n[o.size] / 2
            )
          })(e, o, r)
        )
          c = a.middle
        else {
          const t = ((e, t, n, o = 0) => {
              const r = s[e],
                i = t[r.start] + Math.floor(t[r.size] / 2),
                l = n[r.start] + Math.floor(n[r.size] / 2)
              return {
                start: t[r.start] - n[r.start] - o,
                middle: i - l,
                end: t[r.end] - n[r.end] + o,
              }
            })(e, o, r, l.additionalScroll),
            n = ((e) => {
              const { start: t, middle: n, end: o } = e,
                r = new Map([
                  [Math.abs(t), { key: 'start', value: Math.sign(t) }],
                  [Math.abs(n), { key: 'middle', value: Math.sign(n) }],
                  [Math.abs(o), { key: 'end', value: Math.sign(o) }],
                ]),
                i = Math.min(...r.keys())
              return r.get(i)
            })(t)
          c = void 0 !== n ? a[n.key] : 0
        }
        return (
          l.align && (c = a[l.align]),
          ((e) => {
            const {
              additionalScroll: t = 0,
              duration: n = i.dur,
              func: o = i.easingFunc.easeInOutCubic,
              onScrollEnd: r,
              target: l,
              wrap: s,
              direction: a = 'vertical',
            } = e
            let { targetRect: c, wrapRect: u } = e
            ;(c = c ?? l.getBoundingClientRect()),
              (u = u ?? s.getBoundingClientRect())
            const d = ('vertical' === a ? c.top - u.top : c.left - u.left) + t,
              f = 'vertical' === a ? 'scrollTop' : 'scrollLeft',
              h = s ? s[f] : 0
            let b,
              m = 0
            return (
              (m = window.requestAnimationFrame(function e(t) {
                let i
                if ((b ? (i = t - b) : ((i = 0), (b = t)), i >= n))
                  return (s[f] = h + d), void (r && r())
                const l = h + d * o(i / n)
                ;(s[f] = Math.floor(l)), (m = window.requestAnimationFrame(e))
              })),
              () => {
                window.cancelAnimationFrame(m), r && r()
              }
            )
          })({
            ...l,
            target: t,
            targetRect: o,
            wrap: n,
            wrapRect: r,
            additionalScroll: c,
            direction: e,
          })
        )
      }
      class u {
        constructor(e = null) {
          ;(this._container = null),
            (this._lastScrolledElement = null),
            (this._stopVerticalScroll = null),
            (this._stopHorizontalScroll = null),
            (this._container = e)
        }
        scrollTo(e, t = l) {
          if (
            null !== this._container &&
            null !== e &&
            !((e, t, n = 0) => {
              const o = e.getBoundingClientRect(),
                r = t.getBoundingClientRect()
              return (
                o.top - r.top >= 0 &&
                r.bottom - o.bottom >= 0 &&
                o.left - r.left >= n &&
                r.right - o.right >= n
              )
            })(e, this._container, t.visibilityDetectionOffsetInline)
          ) {
            const n = e.getBoundingClientRect(),
              o = this._container.getBoundingClientRect()
            this.stopScroll(),
              a('vertical', this._container) &&
                (this._stopVerticalScroll = c(
                  'vertical',
                  e,
                  this._container,
                  n,
                  o,
                  this._modifyOptions('vertical', t),
                )),
              a('horizontal', this._container) &&
                (this._stopHorizontalScroll = c(
                  'horizontal',
                  e,
                  this._container,
                  n,
                  o,
                  this._modifyOptions('horizontal', t),
                ))
          }
          this._lastScrolledElement = e
        }
        scrollToLastElement(e) {
          this.scrollTo(this._lastScrolledElement, e)
        }
        stopScroll() {
          null !== this._stopVerticalScroll && this._stopVerticalScroll(),
            null !== this._stopHorizontalScroll && this._stopHorizontalScroll()
        }
        getContainer() {
          return this._container
        }
        setContainer(e) {
          ;(this._container = e),
            this._container?.contains(this._lastScrolledElement) ||
              (this._lastScrolledElement = null)
        }
        destroy() {
          this.stopScroll(),
            (this._container = null),
            (this._lastScrolledElement = null)
        }
        _handleScrollEnd(e) {
          'vertical' === e
            ? (this._stopVerticalScroll = null)
            : (this._stopHorizontalScroll = null)
        }
        _modifyOptions(e, t) {
          return Object.assign({}, t, {
            onScrollEnd: () => {
              this._handleScrollEnd(e),
                void 0 !== t.onScrollEnd && t.onScrollEnd()
            },
          })
        }
      }
      function d(e = {}) {
        const { activeItem: t, getKey: n, ...i } = e,
          l = (0, o.useRef)(null),
          s = (0, o.useRef)(new Map()),
          a = ((e) => {
            const t = (0, o.useRef)(null)
            return (
              (0, o.useEffect)(
                () => (
                  (t.current = new u(e)),
                  () => (0, r.ensureNotNull)(t.current).destroy()
                ),
                [],
              ),
              t
            )
          })(l.current),
          c = (0, o.useCallback)(() => {
            null !== a.current &&
              null !== l.current &&
              a.current.getContainer() !== l.current &&
              a.current.setContainer(l.current)
          }, [a, l]),
          d = (0, o.useCallback)(
            (e) => {
              l.current = e
            },
            [l],
          ),
          f = (0, o.useCallback)(
            (e, t) => {
              const o = n ? n(e) : e
              t ? s.current.set(o, t) : s.current.delete(o)
            },
            [s, n],
          ),
          h = (0, o.useCallback)(
            (e, t) => {
              if (!e) return
              const o = n ? n(e) : e,
                i = s.current.get(o)
              i && (c(), (0, r.ensureNotNull)(a.current).scrollTo(i, t))
            },
            [s, a, n],
          )
        return (0, o.useEffect)(() => h(t, i), [h, t]), [d, f, h]
      }
    },
    86781: (e, t, n) => {
      n.d(t, { useMatchMedia: () => i, useSafeMatchMedia: () => r })
      var o = n(50959)
      function r(e, t = !1) {
        const [n, r] = (0, o.useState)(t)
        return (
          (0, o.useEffect)(() => {
            const t = window.matchMedia(e)
            function n() {
              r(t.matches)
            }
            return (
              n(),
              t.addEventListener('change', n),
              () => {
                t.removeEventListener('change', n)
              }
            )
          }, [e]),
          n
        )
      }
      function i(e) {
        const t = (0, o.useMemo)(() => window.matchMedia(e).matches, [])
        return r(e, t)
      }
    },
    38528: (e, t, n) => {
      n.d(t, { useMergedRefs: () => i })
      var o = n(50959),
        r = n(53017)
      function i(e) {
        return (0, o.useCallback)((0, r.mergeRefs)(e), e)
      }
    },
    35020: (e, t, n) => {
      n.d(t, { useMobileTouchState: () => i })
      var o = n(50959),
        r = n(75774)
      function i() {
        const [e, t] = (0, o.useState)(!1)
        return (
          (0, o.useEffect)(() => {
            t(r.mobiletouch)
          }, []),
          e
        )
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
    78869: (e, t, n) => {
      n.d(t, { useRefsMap: () => r })
      var o = n(50959)
      function r() {
        const e = (0, o.useRef)(new Map()),
          t = (0, o.useCallback)(
            (t) => (n) => {
              null !== n ? e.current.set(t, n) : e.current.delete(t)
            },
            [e],
          )
        return [e, t]
      }
    },
    67842: (e, t, n) => {
      n.d(t, { useResizeObserver: () => l })
      var o = n(50959),
        r = n(43010),
        i = n(39416)
      function l(e, t = []) {
        const { callback: n, ref: l = null } = ((e) =>
            'function' == typeof e ? { callback: e } : e)(e),
          s = (0, o.useRef)(null),
          a = (0, o.useRef)(n)
        a.current = n
        const c = (0, i.useFunctionalRefObject)(l),
          u = (0, o.useCallback)(
            (e) => {
              c(e),
                null !== s.current &&
                  (s.current.disconnect(), null !== e && s.current.observe(e))
            },
            [c, s],
          )
        return (
          (0, r.useIsomorphicLayoutEffect)(
            () => (
              (s.current = new ResizeObserver((e, t) => {
                a.current(e, t)
              })),
              c.current && u(c.current),
              () => {
                s.current?.disconnect()
              }
            ),
            [c, ...t],
          ),
          u
        )
      }
    },
    36966: (e, t, n) => {
      n.d(t, { useTabs: () => p })
      var o = n(50959),
        r = n(8304),
        i = n(47201),
        l = n(29202),
        s = n(16921),
        a = n(50151),
        c = n(66686),
        u = n(36762)
      function d() {
        return !1
      }
      function f(e, t) {
        return { next: () => t !== e.length - 1, previous: () => 0 !== t }
      }
      function h(e) {
        const { activationType: t = 'manual' } = e,
          n = (0, o.useMemo)(() => t, [])
        return (
          (0, a.assert)(t === n, 'Activation type must be invariant.'),
          'automatic' === t
            ? ((e) => {
                const {
                    isRtl: t,
                    items: n,
                    preventDefaultIfHandled: r = !0,
                    stopPropagationIfHandled: i = !1,
                    loop: l = !0,
                    isHighlighted: s,
                    onHighlight: a,
                    onActivate: h,
                    isCollapsed: b = d,
                    orientation: m,
                  } = e,
                  p = (0, o.useCallback)(
                    (e) => {
                      a(e), b(e) || h(e)
                    },
                    [a, h, b],
                  ),
                  g = !l && i ? f(n, n.findIndex(s)) : void 0
                return (0, c.useKeyboardEventHandler)(
                  [
                    (0, u.useItemsKeyboardNavigation)(
                      m,
                      t,
                      n,
                      s,
                      p,
                      l,
                      {},
                      void 0,
                      g,
                    ),
                  ],
                  r,
                  i,
                )
              })(e)
            : ((e) => {
                const {
                    isRtl: t,
                    items: n,
                    preventDefaultIfHandled: r = !0,
                    stopPropagationIfHandled: i = !1,
                    loop: l = !0,
                    isHighlighted: s,
                    onHighlight: a,
                    onActivate: d,
                    orientation: h,
                  } = e,
                  b = n.findIndex(s),
                  m = n[b],
                  p = (0, o.useCallback)(() => {
                    void 0 !== m && d(m)
                  }, [m, d]),
                  g = !l && i ? f(n, b) : void 0,
                  v = (0, o.useCallback)((e) => a(e), [a]),
                  x = (0, u.useItemsKeyboardNavigation)(
                    h,
                    t,
                    n,
                    s,
                    v,
                    l,
                    {},
                    void 0,
                    g,
                  ),
                  C = (0, c.useKeyboardActionHandler)([13, 32], p)
                return (0, c.useKeyboardEventHandler)([x, C], r, i)
              })(e)
        )
      }
      var b = n(35020)
      const m = 24
      function p(e) {
        const {
            id: t,
            items: n,
            orientation: a,
            activationType: c = 'manual',
            disabled: u,
            tablistLabelId: d,
            tablistLabel: f,
            focusOnHighlight: p = !0,
            preventDefaultIfKeyboardActionHandled: g = !0,
            stopPropagationIfKeyboardActionHandled: v = !1,
            keyboardNavigationLoop: x = !0,
            scrollIntoViewOptions: C,
            isActive: k,
            onActivate: E,
            isCollapsed: M,
            isRtl: w,
            isDisclosureOpened: y,
            isRadioGroup: R,
            defaultKeyboardFocus: S,
            focusableItemAttributes: I = {},
          } = e,
          F = (0, b.useMobileTouchState)(),
          A = y ? null : a || 'horizontal',
          O = (0, o.useRef)(e.itemsRefs?.current ?? new Map()),
          [P, T] = (0, o.useState)(),
          [H, L] = (0, l.useFocus)(),
          N = n.find(k),
          _ = (0, o.useCallback)((e) => !u && !e.disabled && e === P, [u, P]),
          z = (0, o.useCallback)(
            (e) => {
              const t = O.current.get(e)
              p && void 0 !== t && t !== document.activeElement && t.focus()
            },
            [p],
          ),
          B = (0, o.useRef)(),
          W = (0, o.useCallback)(
            (e, t) => {
              u ||
                e.disabled ||
                (T(e),
                'number' == typeof t
                  ? (clearTimeout(B.current),
                    (B.current = setTimeout(() => z(e), t)))
                  : z(e))
            },
            [u, T, z, y],
          ),
          D = (0, o.useCallback)(
            (e) => {
              u || e.disabled || (E(e), _(e) || W(e))
            },
            [u, E, _, W],
          ),
          K = h({
            isRtl: w,
            items: (0, o.useMemo)(
              () => n.filter((e) => !u && !e.disabled),
              [n, u],
            ),
            activationType: c,
            preventDefaultIfHandled: g,
            stopPropagationIfHandled: v,
            loop: x,
            onActivate: D,
            isHighlighted: _,
            onHighlight: W,
            isCollapsed: M,
            orientation: A,
          }),
          V = (0, o.useCallback)(
            (e) => {
              let t = null
              for (const [n, o] of O.current.entries())
                if (e.target === o) {
                  t = n
                  break
                }
              t && !_(t) && ('automatic' === c && M && !M(t) ? D(t) : W(t))
            },
            [c, _, W, D, M],
          )
        ;(0, o.useEffect)(() => {
          F || (void 0 !== N && T(N))
        }, [N, F]),
          (0, o.useEffect)(() => {
            H || T(void 0)
          }, [H]),
          (0, o.useEffect)(() => () => clearTimeout(B.current), [])
        const Q = C?.additionalScroll ?? 0,
          [j, q] = (0, s.useKeepActiveItemIntoView)({
            ...C,
            visibilityDetectionOffsetInline: Q + m,
            snapToMiddle: !0,
            activeItem: P ?? N,
            getKey: (0, o.useCallback)((e) => e.id, []),
          }),
          J = (0, o.useCallback)(
            (e, t) => {
              q(e, t), null !== t ? O.current.set(e, t) : O.current.delete(e)
            },
            [q],
          ),
          { firstEdgeItemIndex: U, lastEdgeItemIndex: G } = (0, r.findEdgesTab)(
            n,
            M,
          )
        return {
          tabsBindings: n.map((e, t) => {
            const n = _(e),
              o = k(e),
              i = e.disabled ?? u ?? !1,
              l = 1 === S ? (H ? n : t === U || t === G) : !i && (H ? n : o)
            return {
              ...(0, r.getTabAttributes)(e.id, l, o, e.tabpanelId, i, R, '', I),
              highlighted: n,
              active: o,
              handleItemRef: J,
            }
          }),
          tablistBinding: {
            ...(0, r.getTabListAttributes)(t, a, u, d, f, R),
            onBlur: L.onBlur,
            onFocus: (0, i.createSafeMulticastEventHandler)(L.onFocus, V),
            onKeyDown: K,
          },
          scrollWrapBinding: { ref: j },
          onActivate: D,
          onHighlight: W,
          isHighlighted: _,
        }
      }
    },
    52292: (e, t, n) => {
      n.d(t, { skeletonTheme: () => r })
      var o = n(55679)
      const r = o
    },
    8304: (e, t, n) => {
      function o(e, t = 'horizontal', n, o, r, i) {
        return {
          id: e,
          role: i ? 'radiogroup' : 'tablist',
          'aria-orientation': t,
          'aria-label': r,
          'aria-labelledby': o,
          'aria-disabled': n,
        }
      }
      function r(e, t, n, o, r, i, l, s) {
        return {
          id: e,
          role: i ? 'radio' : 'tab',
          tabIndex: t ? (s?.tabIndex ?? 0) : -1,
          disabled: r,
          'aria-selected': i ? void 0 : n,
          'aria-checked': i ? n : void 0,
          'aria-controls': o,
          'aria-disabled': r,
          'aria-label': l,
          'data-focus-manager': void 0 !== s ? s['data-focus-manager'] : void 0,
        }
      }
      function i(e, t) {
        let n, o
        for (let r = 0; r < e.length; r++) {
          const i = e.length - (r + 1),
            l = void 0 !== t && t(e[i])
          if (
            (!e[r].disabled && void 0 === n && (n = r),
            !e[i].disabled && !l && void 0 === o && (o = i),
            void 0 !== n && void 0 !== o)
          )
            break
        }
        return { firstEdgeItemIndex: n, lastEdgeItemIndex: o }
      }
      var l, s, a, c, u
      n.d(t, {
        TabNames: () => u,
        findEdgesTab: () => i,
        getTabAttributes: () => r,
        getTabListAttributes: () => o,
      }),
        ((e) => {
          ;(e[(e.Active = 0)] = 'Active'), (e[(e.Edges = 1)] = 'Edges')
        })(l || (l = {})),
        ((e) => {
          ;(e.Horizontal = 'horizontal'), (e.Vertical = 'vertical')
        })(s || (s = {})),
        ((e) => {
          ;(e.Automatic = 'automatic'), (e.Manual = 'manual')
        })(a || (a = {})),
        ((e) => {
          ;(e.Collapse = 'collapse'),
            (e.Scroll = 'scroll'),
            (e.Wrap = 'wrap'),
            (e.None = 'none')
        })(c || (c = {})),
        ((e) => {
          ;(e.SquareButtonTabs = 'square-button-tabs'),
            (e.UnderlineButtonTabs = 'underline-button-tabs'),
            (e.UnderlineAnchorTabs = 'underline-anchor-tabs'),
            (e.RoundAnchorTabs = 'round-anchor-tabs'),
            (e.RoundButtonTabs = 'round-button-tabs'),
            (e.LightButtonTabs = 'light-button-tabs')
        })(u || (u = {}))
    },
    90186: (e, t, n) => {
      function o(e) {
        return i(e, l)
      }
      function r(e) {
        return i(e, s)
      }
      function i(e, t) {
        const n = Object.entries(e).filter(t),
          o = {}
        for (const [e, t] of n) o[e] = t
        return o
      }
      function l(e) {
        const [t, n] = e
        return 0 === t.indexOf('data-') && 'string' == typeof n
      }
      function s(e) {
        return 0 === e[0].indexOf('aria-')
      }
      n.d(t, {
        filterAriaProps: () => r,
        filterDataProps: () => o,
        filterProps: () => i,
        isAriaAttribute: () => s,
        isDataAttribute: () => l,
      })
    },
    22064: (e, t, n) => {
      n.d(t, { createDomId: () => f, joinDomIds: () => h })
      const o = 'id',
        r = /\s/g,
        i = '-',
        l = '_',
        s = ' '
      function a(e) {
        return 'string' == typeof e
      }
      function c(e) {
        switch (typeof e) {
          case 'string':
            return e
          case 'number':
          case 'bigint':
            return e.toString(10)
          case 'boolean':
          case 'symbol':
            return e.toString()
          default:
            return null
        }
      }
      function u(e) {
        return e.trim().length > 0
      }
      function d(e) {
        return e.replace(r, i)
      }
      function f(...e) {
        const t = e.map(c).filter(a).filter(u).map(d)
        return (t.length > 0 && t[0].startsWith(o + l) ? t : [o, ...t]).join(l)
      }
      function h(...e) {
        return e.map(c).filter(a).filter(u).join(s)
      }
    },
    56073: (e, t, n) => {
      function o(e, t = !1) {
        const n = getComputedStyle(e),
          o = [n.height]
        return (
          'border-box' !== n.boxSizing &&
            o.push(
              n.paddingTop,
              n.paddingBottom,
              n.borderTopWidth,
              n.borderBottomWidth,
            ),
          t && o.push(n.marginTop, n.marginBottom),
          o.reduce((e, t) => e + (Number.parseFloat(t) || 0), 0)
        )
      }
      function r(e, t = !1) {
        const n = getComputedStyle(e),
          o = [n.width]
        return (
          'border-box' !== n.boxSizing &&
            o.push(
              n.paddingLeft,
              n.paddingRight,
              n.borderLeftWidth,
              n.borderRightWidth,
            ),
          t && o.push(n.marginLeft, n.marginRight),
          o.reduce((e, t) => e + (Number.parseFloat(t) || 0), 0)
        )
      }
      n.d(t, { outerHeight: () => o, outerWidth: () => r })
    },
    47201: (e, t, n) => {
      function o(...e) {
        return (t) => {
          for (const n of e) void 0 !== n && n(t)
        }
      }
      n.d(t, { createSafeMulticastEventHandler: () => o })
    },
    87896: (e, t, n) => {
      n.d(t, { createReactRoot: () => d })
      var o = n(50959),
        r = n(32227),
        i = n(4237)
      const l = (0, o.createContext)({
        isOnMobileAppPage: () => !1,
        isRtl: !1,
        locale: 'en',
      })
      var s = n(84015),
        a = n(63273)
      const c = {
        iOs: 'old',
        android: 'new',
        old: 'old',
        new: 'new',
        any: 'any',
      }
      function u(e) {
        const [t] = (0, o.useState)({
          isOnMobileAppPage: (e) => (0, s.isOnMobileAppPage)(c[e]),
          isRtl: (0, a.isRtl)(),
          locale: window.locale,
        })
        return o.createElement(l.Provider, { value: t }, e.children)
      }
      function d(e, t, n = 'legacy') {
        const l = o.createElement(u, null, e)
        if ('modern' === n) {
          const e = (0, i.createRoot)(t)
          return (
            e.render(l),
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
          r.render(l, t),
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
    59695: (e, t, n) => {
      n.d(t, { CircleLogo: () => s, hiddenCircleLogoClass: () => l })
      var o = n(50959),
        r = n(53885),
        i = n(56057)
      const l = n.n(i)().hidden
      function s(e) {
        const t = (0, r.isCircleLogoWithUrlProps)(e),
          [n, i] = (0, o.useState)(0),
          l = (0, o.useRef)(null),
          s = (0, r.getStyleClasses)(e.size, n, e.className),
          a = e.alt ?? e.title ?? '',
          c = t ? a[0] : e.placeholderLetter
        return (
          (0, o.useEffect)(() => i((l.current?.complete ?? !t) ? 2 : 1), [t]),
          t && 3 !== n
            ? o.createElement('img', {
                ref: l,
                className: s,
                crossOrigin: '',
                src: e.logoUrl,
                alt: a,
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
                  className: s,
                  title: e.title,
                  'aria-label': e['aria-label'],
                  'aria-hidden': e['aria-hidden'],
                },
                c,
              )
        )
      }
    },
    4523: (e, t, n) => {
      n.d(t, { PopupMenuDisclosureView: () => u })
      var o = n(50959),
        r = n(20520),
        i = n(50151)
      const l = { x: 0, y: 0 }
      function s(e, t, n) {
        return (0, o.useCallback)(
          () =>
            ((e, t, { x: n = l.x, y: o = l.y } = l) => {
              const r = (0, i.ensureNotNull)(e).getBoundingClientRect(),
                s = {
                  x: r.left + n,
                  y: r.top + r.height + o,
                  indentFromWindow: { top: 4, bottom: 4, left: 4, right: 4 },
                }
              return t && (s.overrideWidth = r.width), s
            })(e.current, t, n),
          [e, t],
        )
      }
      var a = n(86240)
      const c = Number.parseInt(a['size-header-height'])
      function u(e) {
        const {
            button: t,
            popupChildren: n,
            buttonRef: i,
            listboxId: l,
            listboxClassName: a,
            listboxTabIndex: u,
            matchButtonAndListboxWidths: d,
            isOpened: f,
            scrollWrapReference: h,
            listboxReference: b,
            onClose: m,
            onOpen: p,
            onListboxFocus: g,
            onListboxBlur: v,
            onListboxKeyDown: x,
            listboxAria: C,
            repositionOnScroll: k = !0,
            closeOnHeaderOverlap: E = !1,
            popupPositionCorrection: M = { x: 0, y: 0 },
            popupPosition: w,
          } = e,
          y = s(i, d, M),
          R = E ? c : 0
        return o.createElement(
          o.Fragment,
          null,
          t,
          o.createElement(
            r.PopupMenu,
            {
              ...C,
              id: l,
              className: a,
              tabIndex: u,
              isOpened: f,
              position: w || y,
              repositionOnScroll: k,
              onClose: m,
              onOpen: p,
              doNotCloseOn: i.current,
              reference: b,
              scrollWrapReference: h,
              onFocus: g,
              onBlur: v,
              onKeyDown: x,
              closeOnScrollOutsideOffset: R,
            },
            n,
          ),
        )
      }
    },
    16396: (e, t, n) => {
      n.d(t, { DEFAULT_POPUP_MENU_ITEM_THEME: () => u, PopupMenuItem: () => f })
      var o = n(50959),
        r = n(97754),
        i = n(51768),
        l = n(59064),
        s = n(59695),
        a = n(76460),
        c = n(9059)
      const u = c
      function d(e) {
        e.stopPropagation()
      }
      function f(e) {
        const {
            id: t,
            role: n,
            className: u,
            title: f,
            labelRowClassName: h,
            labelClassName: b,
            toolboxClassName: m,
            shortcut: p,
            forceShowShortcuts: g,
            icon: v,
            iconClassname: x,
            isActive: C,
            isDisabled: k,
            isHovered: E,
            appearAsDisabled: M,
            label: w,
            link: y,
            showToolboxOnHover: R,
            showToolboxOnFocus: S,
            target: I,
            rel: F,
            toolbox: A,
            toolboxRole: O,
            reference: P,
            onMouseOut: T,
            onMouseOver: H,
            onKeyDown: L,
            suppressToolboxClick: N = !0,
            theme: _ = c,
            tabIndex: z,
            tagName: B,
            renderComponent: W,
            roundedIcon: D,
            iconAriaProps: K,
            circleLogo: V,
            dontClosePopup: Q,
            onClick: j,
            onClickArg: q,
            trackEventObject: J,
            trackMouseWheelClick: U,
            trackRightClick: G,
            ...$
          } = e,
          Z = (0, o.useRef)(null),
          X = (0, o.useMemo)(
            () =>
              ((e) => {
                function t(t) {
                  const { reference: n, ...r } = t,
                    i = e ?? (r.href ? 'a' : 'div'),
                    l =
                      'a' === i
                        ? r
                        : ((e) => {
                            const {
                              download: t,
                              href: n,
                              hrefLang: o,
                              media: r,
                              ping: i,
                              rel: l,
                              target: s,
                              type: a,
                              referrerPolicy: c,
                              ...u
                            } = e
                            return u
                          })(r)
                  return o.createElement(i, { ...l, ref: n })
                }
                return (t.displayName = `DefaultComponent(${e})`), t
              })(B),
            [B],
          ),
          Y = W ?? X
        return o.createElement(
          Y,
          {
            ...$,
            id: t,
            role: n,
            className: r(u, _.item, v && _.withIcon, {
              [_.isActive]: C,
              [_.isDisabled]: k || M,
              [_.hovered]: E,
            }),
            title: f,
            href: y,
            target: I,
            rel: F,
            reference: (e) => {
              ;(Z.current = e), 'function' == typeof P && P(e)
              'object' == typeof P && (P.current = e)
            },
            onClick: (e) => {
              if (k) return
              J && (0, i.trackEvent)(J.category, J.event, J.label)
              j && j(q, e)
              Q ||
                (e.currentTarget.dispatchEvent(
                  new CustomEvent('popup-menu-close-event', {
                    bubbles: !0,
                    detail: {
                      clickType: (0, a.isKeyboardClick)(e)
                        ? 'keyboard'
                        : 'mouse',
                    },
                  }),
                ),
                (0, l.globalCloseMenu)())
            },
            onContextMenu: (e) => {
              J &&
                G &&
                (0, i.trackEvent)(J.category, J.event, `${J.label}_rightClick`)
            },
            onMouseUp: (e) => {
              if (1 === e.button && y && J) {
                let e = J.label
                U && (e += '_mouseWheelClick'),
                  (0, i.trackEvent)(J.category, J.event, e)
              }
            },
            onMouseOver: H,
            onMouseOut: T,
            onKeyDown: L,
            tabIndex: z,
          },
          V &&
            o.createElement(s.CircleLogo, {
              ...K,
              className: c['disclosure-item-circle-logo'],
              size: 'xxxsmall',
              logoUrl: V.logoUrl,
              placeholderLetter:
                'placeholderLetter' in V ? V.placeholderLetter : void 0,
            }),
          v &&
            o.createElement('span', {
              'aria-label': K && K['aria-label'],
              'aria-hidden': K && Boolean(K['aria-hidden']),
              className: r(_.icon, D && c['round-icon'], x),
              dangerouslySetInnerHTML: { __html: v },
            }),
          o.createElement(
            'span',
            { className: r(_.labelRow, h) },
            o.createElement('span', { className: r(_.label, b) }, w),
          ),
          (void 0 !== p || g) &&
            o.createElement(
              'span',
              { className: _.shortcut },
              (ee = p) && ee.split('+').join(' + '),
            ),
          void 0 !== A &&
            o.createElement(
              'span',
              {
                role: O,
                onClick: N ? d : void 0,
                className: r(m, _.toolbox, {
                  [_.showOnHover]: R,
                  [_.showOnFocus]: S,
                }),
              },
              A,
            ),
        )
        var ee
      }
    },
    20520: (e, t, n) => {
      n.d(t, { PopupMenu: () => f })
      var o = n(50959),
        r = n(32227),
        i = n(88987),
        l = n(42842),
        s = n(27317),
        a = n(29197)
      const c = o.createContext(void 0)
      var u = n(36383)
      const d = o.createContext({ setMenuMaxWidth: !1 })
      function f(e) {
        const {
            controller: t,
            children: n,
            isOpened: f,
            closeOnClickOutside: h = !0,
            doNotCloseOn: b,
            onClickOutside: m,
            onClose: p,
            onKeyboardClose: g,
            'data-name': v = 'popup-menu-container',
            ...x
          } = e,
          C = (0, o.useContext)(a.CloseDelegateContext),
          k = o.useContext(d),
          E = (0, o.useContext)(c),
          M = (0, u.useOutsideEvent)({
            handler: (e) => {
              m && m(e)
              if (!h) return
              const t = (0, i.default)(b) ? b() : null == b ? [] : [b]
              if (t.length > 0 && e.target instanceof Node)
                for (const n of t) {
                  const t = r.findDOMNode(n)
                  if (t instanceof Node && t.contains(e.target)) return
                }
              p()
            },
            mouseDown: !0,
            touchStart: !0,
          })
        return f
          ? o.createElement(
              l.Portal,
              {
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                pointerEvents: 'none',
              },
              o.createElement(
                'span',
                { ref: M, style: { pointerEvents: 'auto' } },
                o.createElement(
                  s.Menu,
                  {
                    ...x,
                    onClose: p,
                    onKeyboardClose: g,
                    onScroll: (t) => {
                      const { onScroll: n } = e
                      n && n(t)
                    },
                    customCloseDelegate: C,
                    customRemeasureDelegate: E,
                    ref: t,
                    'data-name': v,
                    limitMaxWidth: k.setMenuMaxWidth,
                    'data-tooltip-show-on-focus': 'true',
                  },
                  n,
                ),
              ),
            )
          : null
      }
    },
    2948: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M3.92 7.83 9 12.29l5.08-4.46-1-1.13L9 10.29l-4.09-3.6-.99 1.14Z"/></svg>'
    },
    86240: (e) => {
      e.exports = JSON.parse(
        '{"size-header-height":"64px","media-phone-vertical":"all and (max-width: 479px)","media-mf-phone-landscape":"all and (min-width: 568px)"}',
      )
    },
  },
])
