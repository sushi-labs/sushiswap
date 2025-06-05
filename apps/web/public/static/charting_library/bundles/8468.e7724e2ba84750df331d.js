;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [8468],
  {
    259142: (e, t) => {
      var n, r, o
      ;(r = [t]),
        (n = (e) => {
          function t(e) {
            if (Array.isArray(e)) {
              for (var t = 0, n = Array(e.length); t < e.length; t++)
                n[t] = e[t]
              return n
            }
            return Array.from(e)
          }
          Object.defineProperty(e, '__esModule', { value: !0 })
          var n = !1
          if ('undefined' != typeof window) {
            var r = {
              get passive() {
                n = !0
              },
            }
            window.addEventListener('testPassive', null, r),
              window.removeEventListener('testPassive', null, r)
          }
          var o =
              'undefined' != typeof window &&
              window.navigator &&
              window.navigator.platform &&
              /iP(ad|hone|od)/.test(window.navigator.platform),
            i = [],
            a = !1,
            c = -1,
            l = void 0,
            s = void 0,
            u = (e) =>
              i.some(
                (t) =>
                  !(!t.options.allowTouchMove || !t.options.allowTouchMove(e)),
              ),
            d = (e) => {
              var t = e || window.event
              return (
                !!u(t.target) ||
                1 < t.touches.length ||
                (t.preventDefault && t.preventDefault(), !1)
              )
            },
            m = () => {
              setTimeout(() => {
                void 0 !== s &&
                  ((document.body.style.paddingRight = s), (s = void 0)),
                  void 0 !== l &&
                    ((document.body.style.overflow = l), (l = void 0))
              })
            }
          ;(e.disableBodyScroll = (e, r) => {
            if (o) {
              if (!e)
                return void console.error(
                  'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
                )
              if (e && !i.some((t) => t.targetElement === e)) {
                var m = { targetElement: e, options: r || {} }
                ;(i = [].concat(t(i), [m])),
                  (e.ontouchstart = (e) => {
                    1 === e.targetTouches.length &&
                      (c = e.targetTouches[0].clientY)
                  }),
                  (e.ontouchmove = (t) => {
                    var n, r, o, i
                    1 === t.targetTouches.length &&
                      ((r = e),
                      (i = (n = t).targetTouches[0].clientY - c),
                      !u(n.target) &&
                        ((r && 0 === r.scrollTop && 0 < i) ||
                        ((o = r) &&
                          o.scrollHeight - o.scrollTop <= o.clientHeight &&
                          i < 0)
                          ? d(n)
                          : n.stopPropagation()))
                  }),
                  a ||
                    (document.addEventListener(
                      'touchmove',
                      d,
                      n ? { passive: !1 } : void 0,
                    ),
                    (a = !0))
              }
            } else {
              ;(v = r),
                setTimeout(() => {
                  if (void 0 === s) {
                    var e = !!v && !0 === v.reserveScrollBarGap,
                      t =
                        window.innerWidth - document.documentElement.clientWidth
                    e &&
                      0 < t &&
                      ((s = document.body.style.paddingRight),
                      (document.body.style.paddingRight = t + 'px'))
                  }
                  void 0 === l &&
                    ((l = document.body.style.overflow),
                    (document.body.style.overflow = 'hidden'))
                })
              var f = { targetElement: e, options: r || {} }
              i = [].concat(t(i), [f])
            }
            var v
          }),
            (e.clearAllBodyScrollLocks = () => {
              o
                ? (i.forEach((e) => {
                    ;(e.targetElement.ontouchstart = null),
                      (e.targetElement.ontouchmove = null)
                  }),
                  a &&
                    (document.removeEventListener(
                      'touchmove',
                      d,
                      n ? { passive: !1 } : void 0,
                    ),
                    (a = !1)),
                  (i = []),
                  (c = -1))
                : (m(), (i = []))
            }),
            (e.enableBodyScroll = (e) => {
              if (o) {
                if (!e)
                  return void console.error(
                    'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                  )
                ;(e.ontouchstart = null),
                  (e.ontouchmove = null),
                  (i = i.filter((t) => t.targetElement !== e)),
                  a &&
                    0 === i.length &&
                    (document.removeEventListener(
                      'touchmove',
                      d,
                      n ? { passive: !1 } : void 0,
                    ),
                    (a = !1))
              } else
                1 === i.length && i[0].targetElement === e
                  ? (m(), (i = []))
                  : (i = i.filter((t) => t.targetElement !== e))
            })
        }),
        void 0 === (o = 'function' == typeof n ? n.apply(t, r) : n) ||
          (e.exports = o)
    },
    625650: (e) => {
      e.exports = {
        loader: 'loader-UL6iwcBa',
        static: 'static-UL6iwcBa',
        item: 'item-UL6iwcBa',
        'tv-button-loader': 'tv-button-loader-UL6iwcBa',
        medium: 'medium-UL6iwcBa',
        small: 'small-UL6iwcBa',
        black: 'black-UL6iwcBa',
        white: 'white-UL6iwcBa',
        gray: 'gray-UL6iwcBa',
        primary: 'primary-UL6iwcBa',
      }
    },
    92910: (e) => {
      e.exports = {
        separator: 'separator-QjUlCDId',
        small: 'small-QjUlCDId',
        normal: 'normal-QjUlCDId',
        large: 'large-QjUlCDId',
      }
    },
    718736: (e, t, n) => {
      n.d(t, { useFunctionalRefObject: () => i })
      var r = n(50959),
        o = n(855393)
      function i(e) {
        const t = (0, r.useMemo)(
            () =>
              ((e) => {
                const t = (n) => {
                  e(n), (t.current = n)
                }
                return (t.current = null), t
              })((e) => {
                c.current(e)
              }),
            [],
          ),
          n = (0, r.useRef)(null),
          i = (t) => {
            if (null === t) return a(n.current, t), void (n.current = null)
            n.current !== e && ((n.current = e), a(n.current, t))
          },
          c = (0, r.useRef)(i)
        return (
          (c.current = i),
          (0, o.useIsomorphicLayoutEffect)(() => {
            if (null !== t.current)
              return c.current(t.current), () => c.current(null)
          }, [e]),
          t
        )
      }
      function a(e, t) {
        null !== e && ('function' == typeof e ? e(t) : (e.current = t))
      }
    },
    855393: (e, t, n) => {
      n.d(t, { useIsomorphicLayoutEffect: () => o })
      var r = n(50959)
      function o(e, t) {
        ;('undefined' == typeof window ? r.useEffect : r.useLayoutEffect)(e, t)
      }
    },
    72571: (e, t, n) => {
      n.d(t, { Icon: () => o })
      var r = n(50959)
      const o = r.forwardRef((e, t) => {
        const { icon: n = '', ...o } = e
        return r.createElement('span', {
          ...o,
          ref: t,
          dangerouslySetInnerHTML: { __html: n },
        })
      })
    },
    234404: (e, t, n) => {
      n.d(t, { Loader: () => c })
      var r = n(50959),
        o = n(497754),
        i = n(625650),
        a = n.n(i)
      function c(e) {
        const {
            className: t,
            size: n = 'medium',
            staticPosition: i,
            color: c = 'black',
          } = e,
          l = o(a().item, a()[c], a()[n])
        return r.createElement(
          'span',
          { className: o(a().loader, i && a().static, t) },
          r.createElement('span', { className: l }),
          r.createElement('span', { className: l }),
          r.createElement('span', { className: l }),
        )
      }
    },
    111706: (e, t, n) => {
      function r(e) {
        return 0 === e.detail
      }
      n.d(t, { isKeyboardClick: () => r })
    },
    269842: (e, t, n) => {
      function r(...e) {
        return (t) => {
          for (const n of e) void 0 !== n && n(t)
        }
      }
      n.d(t, { createSafeMulticastEventHandler: () => r })
    },
    865266: (e, t, n) => {
      n.d(t, { useRovingTabindexElement: () => a })
      var r = n(50959),
        o = n(718736),
        i = n(892932)
      function a(e, t = []) {
        const [n, a] = (0, r.useState)(!1),
          c = (0, o.useFunctionalRefObject)(e)
        return (
          (0, r.useLayoutEffect)(() => {
            if (!i.PLATFORM_ACCESSIBILITY_ENABLED) return
            const e = c.current
            if (null === e) return
            const t = (e) => {
              switch (e.type) {
                case 'roving-tabindex:main-element':
                  a(!0)
                  break
                case 'roving-tabindex:secondary-element':
                  a(!1)
              }
            }
            return (
              e.addEventListener('roving-tabindex:main-element', t),
              e.addEventListener('roving-tabindex:secondary-element', t),
              () => {
                e.removeEventListener('roving-tabindex:main-element', t),
                  e.removeEventListener('roving-tabindex:secondary-element', t)
              }
            )
          }, t),
          [c, i.PLATFORM_ACCESSIBILITY_ENABLED ? (n ? 0 : -1) : void 0]
        )
      }
    },
    917850: (e, t, n) => {
      n.d(t, { PopupMenuSeparator: () => c })
      var r = n(50959),
        o = n(497754),
        i = n.n(o),
        a = n(92910)
      function c(e) {
        const { size: t = 'normal', className: n, ariaHidden: o = !1 } = e
        return r.createElement('div', {
          className: i()(
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
    493173: (e, t, n) => {
      function r(e, t, n = {}) {
        return Object.assign(
          {},
          e,
          ((e, t, n = {}) => {
            const r = Object.assign({}, t)
            for (const o of Object.keys(t)) {
              const i = n[o] || o
              i in e && (r[o] = [e[i], t[o]].join(' '))
            }
            return r
          })(e, t, n),
        )
      }
      n.d(t, { mergeThemes: () => r })
    },
    906132: (e, t, n) => {
      var r = n(522134)
      function o() {}
      function i() {}
      ;(i.resetWarningCache = o),
        (e.exports = () => {
          function e(e, t, n, o, i, a) {
            if (a !== r) {
              var c = new Error(
                'Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types',
              )
              throw ((c.name = 'Invariant Violation'), c)
            }
          }
          function t() {
            return e
          }
          e.isRequired = e
          var n = {
            array: e,
            bool: e,
            func: e,
            number: e,
            object: e,
            string: e,
            symbol: e,
            any: e,
            arrayOf: t,
            element: e,
            elementType: e,
            instanceOf: t,
            node: e,
            objectOf: t,
            oneOf: t,
            oneOfType: t,
            shape: t,
            exact: t,
            checkPropTypes: i,
            resetWarningCache: o,
          }
          return (n.PropTypes = n), n
        })
    },
    719036: (e, t, n) => {
      e.exports = n(906132)()
    },
    522134: (e) => {
      e.exports = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED'
    },
    47102: (e) => {
      e.exports = {
        accessible: 'accessible-NQERJsv9',
        active: 'active-NQERJsv9',
      }
    },
    502869: (e) => {
      e.exports = { button: 'button-xNqEcuN2' }
    },
    144242: (e) => {
      e.exports = { title: 'title-u3QJgF_p' }
    },
    179807: (e, t, n) => {
      n.d(t, {
        focusFirstMenuItem: () => s,
        handleAccessibleMenuFocus: () => c,
        handleAccessibleMenuKeyDown: () => l,
        queryMenuElements: () => m,
      })
      var r = n(892932),
        o = n(27164),
        i = n(180185)
      const a = [37, 39, 38, 40]
      function c(e, t) {
        e.target &&
          r.PLATFORM_ACCESSIBILITY_ENABLED &&
          e.relatedTarget === t.current &&
          s(e.target)
      }
      function l(e) {
        var t
        if (!r.PLATFORM_ACCESSIBILITY_ENABLED) return
        if (e.defaultPrevented) return
        const n = (0, i.hashFromEvent)(e)
        if (!a.includes(n)) return
        const c = document.activeElement
        if (!(document.activeElement instanceof HTMLElement)) return
        const l = m(e.currentTarget).sort(r.navigationOrderComparator)
        if (0 === l.length) return
        const s =
          document.activeElement.closest('[data-role="menuitem"]') ||
          (null === (t = document.activeElement.parentElement) || void 0 === t
            ? void 0
            : t.querySelector('[data-role="menuitem"]'))
        if (!(s instanceof HTMLElement)) return
        const v = l.indexOf(s)
        if (-1 === v) return
        const E = f(s),
          p = E.indexOf(document.activeElement),
          g = -1 !== p,
          b = (e) => {
            c && (0, o.becomeSecondaryElement)(c),
              (0, o.becomeMainElement)(e),
              e.focus()
          }
        switch ((0, r.mapKeyCodeToDirection)(n)) {
          case 'inlinePrev':
            if (!E.length) return
            e.preventDefault(),
              b(0 === p ? l[v] : g ? u(E, p, -1) : E[E.length - 1])
            break
          case 'inlineNext':
            if (!E.length) return
            e.preventDefault(),
              p === E.length - 1 ? b(l[v]) : b(g ? u(E, p, 1) : E[0])
            break
          case 'blockPrev': {
            e.preventDefault()
            const t = u(l, v, -1)
            if (g) {
              const e = d(t, p)
              b(e || t)
              break
            }
            b(t)
            break
          }
          case 'blockNext': {
            e.preventDefault()
            const t = u(l, v, 1)
            if (g) {
              const e = d(t, p)
              b(e || t)
              break
            }
            b(t)
          }
        }
      }
      function s(e) {
        const [t] = m(e)
        t && ((0, o.becomeMainElement)(t), t.focus())
      }
      function u(e, t, n) {
        return e[(t + e.length + n) % e.length]
      }
      function d(e, t) {
        const n = f(e)
        return n.length ? n[(t + n.length) % n.length] : null
      }
      function m(e) {
        return Array.from(
          e.querySelectorAll(
            '[data-role="menuitem"]:not([disabled]):not([aria-disabled])',
          ),
        ).filter((0, r.createScopedVisibleElementFilter)(e))
      }
      function f(e) {
        return Array.from(
          e.querySelectorAll('[tabindex]:not([disabled]):not([aria-disabled])'),
        ).filter((0, r.createScopedVisibleElementFilter)(e))
      }
    },
    27164: (e, t, n) => {
      function r(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:main-element'))
      }
      function o(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:secondary-element'))
      }
      n.d(t, { becomeMainElement: () => r, becomeSecondaryElement: () => o })
    },
    869194: (e, t, n) => {
      n.d(t, { useMouseClickAutoBlur: () => a })
      var r = n(50959),
        o = n(111706),
        i = n(892932)
      function a(e, t = !0) {
        ;(0, r.useEffect)(() => {
          if (!i.PLATFORM_ACCESSIBILITY_ENABLED || !t) return
          const n = (t) => {
            const n = e.current
            null !== n &&
              document.activeElement instanceof HTMLElement &&
              ((0, o.isKeyboardClick)(t) ||
                (n.contains(document.activeElement) &&
                  'INPUT' !== document.activeElement.tagName &&
                  document.activeElement.blur()))
          }
          return (
            window.addEventListener('click', n, !0),
            () => window.removeEventListener('click', n, !0)
          )
        }, [t])
      }
    },
    137869: (e, t, n) => {
      n.d(t, { AccessibleMenuItem: () => d })
      var r = n(50959),
        o = n(497754),
        i = n.n(o),
        a = n(930202),
        c = n(865266),
        l = n(892932),
        s = n(192063),
        u = n(47102)
      function d(e) {
        const { className: t, ...n } = e,
          [o, d] = (0, c.useRovingTabindexElement)(null)
        return r.createElement(s.PopupMenuItem, {
          ...n,
          className: i()(
            l.PLATFORM_ACCESSIBILITY_ENABLED && u.accessible,
            e.isActive && u.active,
            t,
          ),
          reference: o,
          tabIndex: d,
          onKeyDown: (e) => {
            if (
              !l.PLATFORM_ACCESSIBILITY_ENABLED ||
              e.target !== e.currentTarget
            )
              return
            const t = (0, a.hashFromEvent)(e)
            ;(13 !== t && 32 !== t) ||
              (e.preventDefault(),
              o.current instanceof HTMLElement && o.current.click())
          },
          'data-role': l.PLATFORM_ACCESSIBILITY_ENABLED ? 'menuitem' : void 0,
          'aria-disabled':
            (l.PLATFORM_ACCESSIBILITY_ENABLED && e.isDisabled) || void 0,
        })
      }
    },
    395907: (e, t, n) => {
      n.d(t, { ToolWidgetIconButton: () => c })
      var r = n(50959),
        o = n(497754),
        i = n(747633),
        a = n(502869)
      const c = r.forwardRef((e, t) => {
        const { className: n, id: c, ...l } = e
        return r.createElement(i.ToolWidgetButton, {
          id: c,
          'data-name': c,
          ...l,
          ref: t,
          className: o(n, a.button),
        })
      })
    },
    163915: (e, t, n) => {
      n.d(t, { ToolWidgetMenuSummary: () => a })
      var r = n(50959),
        o = n(497754),
        i = n(144242)
      function a(e) {
        return r.createElement(
          'div',
          { className: o(e.className, i.title) },
          e.children,
        )
      }
    },
    501836: (e, t, n) => {
      n.d(t, { DEFAULT_TOOLBAR_BUTTON_THEME: () => c, ToolbarButton: () => l })
      var r = n(50959),
        o = n(747633),
        i = n(865266),
        a = n(892932)
      const c = o.DEFAULT_TOOL_WIDGET_BUTTON_THEME,
        l = (0, r.forwardRef)((e, t) => {
          const { tooltip: n, ...c } = e,
            [l, s] = (0, i.useRovingTabindexElement)(t)
          return r.createElement(o.ToolWidgetButton, {
            'aria-label': a.PLATFORM_ACCESSIBILITY_ENABLED ? n : void 0,
            ...c,
            tag: a.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div',
            ref: l,
            tabIndex: s,
            'data-tooltip': n,
          })
        })
    },
    332913: (e, t, n) => {
      n.d(t, { ToolbarIconButton: () => c })
      var r = n(50959),
        o = n(865266),
        i = n(892932),
        a = n(395907)
      const c = (0, r.forwardRef)((e, t) => {
        const { tooltip: n, ...c } = e,
          [l, s] = (0, o.useRovingTabindexElement)(t)
        return r.createElement(a.ToolWidgetIconButton, {
          'aria-label': i.PLATFORM_ACCESSIBILITY_ENABLED ? n : void 0,
          ...c,
          tag: i.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div',
          ref: l,
          tabIndex: s,
          'data-tooltip': n,
        })
      })
    },
    53431: (e, t, n) => {
      n.d(t, { ToolbarMenuButton: () => u })
      var r = n(50959),
        o = n(718736),
        i = n(518799),
        a = n(865266),
        c = n(892932),
        l = n(869194),
        s = n(179807)
      const u = (0, r.forwardRef)((e, t) => {
        const { tooltip: n, menuReference: u = null, ...d } = e,
          [m, f] = (0, a.useRovingTabindexElement)(null),
          v = (0, o.useFunctionalRefObject)(u)
        return (
          (0, l.useMouseClickAutoBlur)(v),
          r.createElement(i.ToolWidgetMenu, {
            'aria-label': c.PLATFORM_ACCESSIBILITY_ENABLED ? n : void 0,
            ...d,
            ref: t,
            tag: c.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div',
            reference: m,
            tabIndex: f,
            'data-tooltip': n,
            menuReference: v,
            onMenuKeyDown: s.handleAccessibleMenuKeyDown,
            onMenuFocus: (e) => (0, s.handleAccessibleMenuFocus)(e, m),
          })
        )
      })
    },
    261401: (e, t, n) => {
      n.d(t, {
        RegistryProvider: () => l,
        registryContextType: () => s,
        validateRegistry: () => c,
      })
      var r = n(50959),
        o = n(719036),
        i = n.n(o)
      const a = r.createContext({})
      function c(e, t) {
        i().checkPropTypes(t, e, 'context', 'RegistryContext')
      }
      function l(e) {
        const { validation: t, value: n } = e
        return c(n, t), r.createElement(a.Provider, { value: n }, e.children)
      }
      function s() {
        return a
      }
    },
    925931: (e, t, n) => {
      n.d(t, { nanoid: () => r })
      const r = (e = 21) =>
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
