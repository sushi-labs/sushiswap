;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7260],
  {
    59142: (e, t) => {
      var s, r, a
      ;(r = [t]),
        (s = (e) => {
          function t(e) {
            if (Array.isArray(e)) {
              for (var t = 0, s = Array(e.length); t < e.length; t++)
                s[t] = e[t]
              return s
            }
            return Array.from(e)
          }
          Object.defineProperty(e, '__esModule', { value: !0 })
          var s = !1
          if ('undefined' != typeof window) {
            var r = {
              get passive() {
                s = !0
              },
            }
            window.addEventListener('testPassive', null, r),
              window.removeEventListener('testPassive', null, r)
          }
          var a =
              'undefined' != typeof window &&
              window.navigator &&
              window.navigator.platform &&
              /iP(ad|hone|od)/.test(window.navigator.platform),
            n = [],
            i = !1,
            o = -1,
            l = void 0,
            c = void 0,
            d = (e) =>
              n.some(
                (t) =>
                  !(!t.options.allowTouchMove || !t.options.allowTouchMove(e)),
              ),
            u = (e) => {
              var t = e || window.event
              return (
                !!d(t.target) ||
                1 < t.touches.length ||
                (t.preventDefault && t.preventDefault(), !1)
              )
            },
            h = () => {
              setTimeout(() => {
                void 0 !== c &&
                  ((document.body.style.paddingRight = c), (c = void 0)),
                  void 0 !== l &&
                    ((document.body.style.overflow = l), (l = void 0))
              })
            }
          ;(e.disableBodyScroll = (e, r) => {
            if (a) {
              if (!e)
                return void console.error(
                  'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
                )
              if (e && !n.some((t) => t.targetElement === e)) {
                var h = { targetElement: e, options: r || {} }
                ;(n = [].concat(t(n), [h])),
                  (e.ontouchstart = (e) => {
                    1 === e.targetTouches.length &&
                      (o = e.targetTouches[0].clientY)
                  }),
                  (e.ontouchmove = (t) => {
                    var s, r, a, n
                    1 === t.targetTouches.length &&
                      ((r = e),
                      (n = (s = t).targetTouches[0].clientY - o),
                      !d(s.target) &&
                        ((r && 0 === r.scrollTop && 0 < n) ||
                        ((a = r) &&
                          a.scrollHeight - a.scrollTop <= a.clientHeight &&
                          n < 0)
                          ? u(s)
                          : s.stopPropagation()))
                  }),
                  i ||
                    (document.addEventListener(
                      'touchmove',
                      u,
                      s ? { passive: !1 } : void 0,
                    ),
                    (i = !0))
              }
            } else {
              ;(p = r),
                setTimeout(() => {
                  if (void 0 === c) {
                    var e = !!p && !0 === p.reserveScrollBarGap,
                      t =
                        window.innerWidth - document.documentElement.clientWidth
                    e &&
                      0 < t &&
                      ((c = document.body.style.paddingRight),
                      (document.body.style.paddingRight = t + 'px'))
                  }
                  void 0 === l &&
                    ((l = document.body.style.overflow),
                    (document.body.style.overflow = 'hidden'))
                })
              var m = { targetElement: e, options: r || {} }
              n = [].concat(t(n), [m])
            }
            var p
          }),
            (e.clearAllBodyScrollLocks = () => {
              a
                ? (n.forEach((e) => {
                    ;(e.targetElement.ontouchstart = null),
                      (e.targetElement.ontouchmove = null)
                  }),
                  i &&
                    (document.removeEventListener(
                      'touchmove',
                      u,
                      s ? { passive: !1 } : void 0,
                    ),
                    (i = !1)),
                  (n = []),
                  (o = -1))
                : (h(), (n = []))
            }),
            (e.enableBodyScroll = (e) => {
              if (a) {
                if (!e)
                  return void console.error(
                    'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                  )
                ;(e.ontouchstart = null),
                  (e.ontouchmove = null),
                  (n = n.filter((t) => t.targetElement !== e)),
                  i &&
                    0 === n.length &&
                    (document.removeEventListener(
                      'touchmove',
                      u,
                      s ? { passive: !1 } : void 0,
                    ),
                    (i = !1))
              } else
                1 === n.length && n[0].targetElement === e
                  ? (h(), (n = []))
                  : (n = n.filter((t) => t.targetElement !== e))
            })
        }),
        void 0 === (a = 'function' == typeof s ? s.apply(t, r) : s) ||
          (e.exports = a)
    },
    25650: (e) => {
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
    22436: (e) => {
      e.exports = {
        item: 'item-GJX1EXhk',
        interactive: 'interactive-GJX1EXhk',
        hovered: 'hovered-GJX1EXhk',
        disabled: 'disabled-GJX1EXhk',
        active: 'active-GJX1EXhk',
        shortcut: 'shortcut-GJX1EXhk',
        normal: 'normal-GJX1EXhk',
        big: 'big-GJX1EXhk',
        iconCell: 'iconCell-GJX1EXhk',
        icon: 'icon-GJX1EXhk',
        checkmark: 'checkmark-GJX1EXhk',
        content: 'content-GJX1EXhk',
        label: 'label-GJX1EXhk',
        checked: 'checked-GJX1EXhk',
        toolbox: 'toolbox-GJX1EXhk',
        showToolboxOnHover: 'showToolboxOnHover-GJX1EXhk',
        arrowIcon: 'arrowIcon-GJX1EXhk',
        subMenu: 'subMenu-GJX1EXhk',
        invisibleHotkey: 'invisibleHotkey-GJX1EXhk',
      }
    },
    29122: (e) => {
      e.exports = {
        item: 'item-WJDah4zD',
        emptyIcons: 'emptyIcons-WJDah4zD',
        loading: 'loading-WJDah4zD',
        disabled: 'disabled-WJDah4zD',
        interactive: 'interactive-WJDah4zD',
        hovered: 'hovered-WJDah4zD',
        normal: 'normal-WJDah4zD',
        big: 'big-WJDah4zD',
        icon: 'icon-WJDah4zD',
        label: 'label-WJDah4zD',
        title: 'title-WJDah4zD',
        nested: 'nested-WJDah4zD',
        shortcut: 'shortcut-WJDah4zD',
        remove: 'remove-WJDah4zD',
      }
    },
    45719: (e) => {
      e.exports = { separator: 'separator-Pf4rIzEt' }
    },
    92910: (e) => {
      e.exports = {
        separator: 'separator-QjUlCDId',
        small: 'small-QjUlCDId',
        normal: 'normal-QjUlCDId',
        large: 'large-QjUlCDId',
      }
    },
    4618: (e) => {
      e.exports = {
        tabs: 'tabs-NGf0gcnH',
        tab: 'tab-NGf0gcnH',
        noBorder: 'noBorder-NGf0gcnH',
        disabled: 'disabled-NGf0gcnH',
        active: 'active-NGf0gcnH',
        defaultCursor: 'defaultCursor-NGf0gcnH',
        slider: 'slider-NGf0gcnH',
        content: 'content-NGf0gcnH',
      }
    },
    26996: (e, t, s) => {
      s.d(t, { Loader: () => o })
      var r = s(50959),
        a = s(97754),
        n = s(25650),
        i = s.n(n)
      function o(e) {
        const {
            className: t,
            size: s = 'medium',
            staticPosition: n,
            color: o = 'black',
          } = e,
          l = a(i().item, i()[o], i()[s])
        return r.createElement(
          'span',
          { className: a(i().loader, n && i().static, t) },
          r.createElement('span', { className: l }),
          r.createElement('span', { className: l }),
          r.createElement('span', { className: l }),
        )
      }
    },
    47201: (e, t, s) => {
      function r(...e) {
        return (t) => {
          for (const s of e) void 0 !== s && s(t)
        }
      }
      s.d(t, { createSafeMulticastEventHandler: () => r })
    },
    42142: (e, t, s) => {
      s.d(t, { FragmentMap: () => a })
      var r = s(50959)
      function a(e) {
        if (e.map) {
          return r.Children.toArray(e.children).map(e.map)
        }
        return e.children
      }
    },
    99025: (e, t, s) => {
      s.d(t, { Hint: () => o })
      var r = s(50959),
        a = s(97754),
        n = s.n(a),
        i = s(22436)
      function o(e) {
        const { text: t = '', className: s } = e
        return r.createElement('span', { className: n()(i.shortcut, s) }, t)
      }
    },
    23829: (e, t, s) => {
      s.d(t, { ContextMenuItem: () => p })
      var r = s(50959),
        a = s(97754),
        n = s.n(a),
        i = s(9745),
        o = s(26996),
        l = s(54627),
        c = s(99025),
        d = s(39750),
        u = s(79978),
        h = s(69311),
        m = s(29122)
      function p(e) {
        const {
            className: t,
            isTitle: s,
            isLoading: a,
            isHovered: p,
            active: g,
            checkable: v,
            disabled: _,
            checked: b,
            icon: f,
            iconChecked: y,
            hint: S,
            subItems: E,
            label: k,
            styledLabel: C,
            onClick: x,
            children: T,
            toolbox: w,
            jsxLabel: M,
            size: A = 'normal',
          } = e,
          z = (0, r.useContext)(l.EmptyIconsContext),
          I = !!E.length
        return a
          ? r.createElement(
              'li',
              { className: n()(t, m.item, m.loading, m[A]) },
              r.createElement(o.Loader, null),
            )
          : r.createElement(
              'li',
              {
                className: n()(
                  t,
                  m.item,
                  m.interactive,
                  s && m.title,
                  _ && m.disabled,
                  p && m.hovered,
                  g && m.active,
                  z && m.emptyIcons,
                  m[A],
                ),
                onClick: x,
              },
              r.createElement(i.Icon, {
                className: n()(m.icon),
                icon: (() => {
                  if (v && b) return y || f || d
                  return f
                })(),
              }),
              r.createElement(
                'span',
                { className: n()(m.label) },
                !M && C
                  ? C.map(({ text: e, ...t }, s) =>
                      r.createElement('span', { key: s, style: t }, e),
                    )
                  : null != M
                    ? M
                    : k,
              ),
              !!w &&
                r.createElement(i.Icon, {
                  onClick: () => {
                    w && w.action()
                  },
                  className: m.remove,
                  icon: h,
                }),
              !I &&
                S &&
                r.createElement(c.Hint, { className: m.shortcut, text: S }),
              I && r.createElement(i.Icon, { className: m.nested, icon: u }),
              T,
            )
      }
    },
    54627: (e, t, s) => {
      s.d(t, { EmptyIconsContext: () => r })
      const r = s(50959).createContext(!1)
    },
    1109: (e, t, s) => {
      s.d(t, { Separator: () => i })
      var r = s(50959),
        a = s(97754),
        n = s(45719)
      function i(e) {
        return r.createElement('div', {
          className: a(n.separator, e.className),
        })
      }
    },
    51613: (e, t, s) => {
      s.d(t, { PopupMenuSeparator: () => o })
      var r = s(50959),
        a = s(97754),
        n = s.n(a),
        i = s(92910)
      function o(e) {
        const { size: t = 'normal', className: s, ariaHidden: a = !1 } = e
        return r.createElement('div', {
          className: n()(
            i.separator,
            'small' === t && i.small,
            'normal' === t && i.normal,
            'large' === t && i.large,
            s,
          ),
          role: 'separator',
          'aria-hidden': a,
        })
      }
    },
    40173: (e, t, s) => {
      function r(e, t, s = {}) {
        return Object.assign(
          {},
          e,
          ((e, t, s = {}) => {
            const r = Object.assign({}, t)
            for (const a of Object.keys(t)) {
              const n = s[a] || a
              n in e && (r[a] = [e[n], t[a]].join(' '))
            }
            return r
          })(e, t, s),
        )
      }
      s.d(t, { mergeThemes: () => r })
    },
    6132: (e, t, s) => {
      var r = s(22134)
      function a() {}
      function n() {}
      ;(n.resetWarningCache = a),
        (e.exports = () => {
          function e(e, t, s, a, n, i) {
            if (i !== r) {
              var o = new Error(
                'Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types',
              )
              throw ((o.name = 'Invariant Violation'), o)
            }
          }
          function t() {
            return e
          }
          e.isRequired = e
          var s = {
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
            checkPropTypes: n,
            resetWarningCache: a,
          }
          return (s.PropTypes = s), s
        })
    },
    19036: (e, t, s) => {
      e.exports = s(6132)()
    },
    22134: (e) => {
      e.exports = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED'
    },
    47102: (e) => {
      e.exports = {
        accessible: 'accessible-NQERJsv9',
        active: 'active-NQERJsv9',
      }
    },
    44242: (e) => {
      e.exports = { title: 'title-u3QJgF_p' }
    },
    64264: (e) => {
      e.exports = {
        toolbar: 'toolbar-BXXUwft2',
        dateRangeWrapper: 'dateRangeWrapper-BXXUwft2',
        seriesControlWrapper: 'seriesControlWrapper-BXXUwft2',
        dateRangeExpanded: 'dateRangeExpanded-BXXUwft2',
        dateRangeCollapsed: 'dateRangeCollapsed-BXXUwft2',
        item: 'item-BXXUwft2',
        last: 'last-BXXUwft2',
        inline: 'inline-BXXUwft2',
        dateRange: 'dateRange-BXXUwft2',
        hidden: 'hidden-BXXUwft2',
        collapsed: 'collapsed-BXXUwft2',
      }
    },
    7458: (e) => {
      e.exports = { button: 'button-Hfju7pW_' }
    },
    50242: (e) => {
      e.exports = { button: 'button-uToIfRbZ' }
    },
    56812: (e) => {
      e.exports = { separator: 'separator-yDfG9Ccu' }
    },
    97086: (e) => {
      e.exports = { headerMenuText: 'headerMenuText-AcJrLng7' }
    },
    85616: (e) => {
      e.exports = {
        button: 'button-x1dCOTP3',
        disabled: 'disabled-x1dCOTP3',
        hover: 'hover-x1dCOTP3',
        clicked: 'clicked-x1dCOTP3',
        accessible: 'accessible-x1dCOTP3',
      }
    },
    91348: (e) => {
      e.exports = { item: 'item-SqYYy1zF' }
    },
    22586: (e) => {
      e.exports = { slider: 'slider-3kCW6DWs', inner: 'inner-3kCW6DWs' }
    },
    31071: (e) => {
      e.exports = { sliderRow: 'sliderRow-k2h4OAz8' }
    },
    36898: (e, t, s) => {
      s.d(t, { useMouseClickAutoBlur: () => i })
      var r = s(50959),
        a = s(76460),
        n = s(16838)
      function i(e, t = !0) {
        ;(0, r.useEffect)(() => {
          if (!n.PLATFORM_ACCESSIBILITY_ENABLED || !t) return
          const s = (t) => {
            const s = e.current
            null !== s &&
              document.activeElement instanceof HTMLElement &&
              ((0, a.isKeyboardClick)(t) ||
                (s.contains(document.activeElement) &&
                  'INPUT' !== document.activeElement.tagName &&
                  document.activeElement.blur()))
          }
          return (
            window.addEventListener('click', s, !0),
            () => window.removeEventListener('click', s, !0)
          )
        }, [t])
      }
    },
    81351: (e, t, s) => {
      s.d(t, { AccessibleMenuItem: () => u })
      var r = s(50959),
        a = s(97754),
        n = s.n(a),
        i = s(3343),
        o = s(50238),
        l = s(16838),
        c = s(16396),
        d = s(47102)
      function u(e) {
        const { className: t, ...s } = e,
          [a, u] = (0, o.useRovingTabindexElement)(null)
        return r.createElement(c.PopupMenuItem, {
          ...s,
          className: n()(
            l.PLATFORM_ACCESSIBILITY_ENABLED && d.accessible,
            e.isActive && d.active,
            t,
          ),
          reference: a,
          tabIndex: u,
          onKeyDown: (e) => {
            if (
              !l.PLATFORM_ACCESSIBILITY_ENABLED ||
              e.target !== e.currentTarget
            )
              return
            const t = (0, i.hashFromEvent)(e)
            ;(13 !== t && 32 !== t) ||
              (e.preventDefault(),
              a.current instanceof HTMLElement && a.current.click())
          },
          'data-role': l.PLATFORM_ACCESSIBILITY_ENABLED ? 'menuitem' : void 0,
          'aria-disabled':
            (l.PLATFORM_ACCESSIBILITY_ENABLED && e.isDisabled) || void 0,
        })
      }
    },
    82962: (e, t, s) => {
      s.d(t, { ToolWidgetMenuSummary: () => i })
      var r = s(50959),
        a = s(97754),
        n = s(44242)
      function i(e) {
        return r.createElement(
          'div',
          { className: a(e.className, n.title) },
          e.children,
        )
      }
    },
    88066: (e, t, s) => {
      s.d(t, { DEFAULT_TOOLBAR_BUTTON_THEME: () => o, ToolbarButton: () => l })
      var r = s(50959),
        a = s(31409),
        n = s(50238),
        i = s(16838)
      const o = a.DEFAULT_TOOL_WIDGET_BUTTON_THEME,
        l = (0, r.forwardRef)((e, t) => {
          const { tooltip: s, ...o } = e,
            [l, c] = (0, n.useRovingTabindexElement)(t)
          return r.createElement(a.ToolWidgetButton, {
            'aria-label': i.PLATFORM_ACCESSIBILITY_ENABLED ? s : void 0,
            ...o,
            tag: i.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div',
            ref: l,
            tabIndex: c,
            'data-tooltip': s,
          })
        })
    },
    48889: (e, t, s) => {
      s.d(t, { ToolbarIconButton: () => o })
      var r = s(50959),
        a = s(50238),
        n = s(16838),
        i = s(50813)
      const o = (0, r.forwardRef)((e, t) => {
        const { tooltip: s, ...o } = e,
          [l, c] = (0, a.useRovingTabindexElement)(t)
        return r.createElement(i.ToolWidgetIconButton, {
          'aria-label': n.PLATFORM_ACCESSIBILITY_ENABLED ? s : void 0,
          ...o,
          tag: n.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div',
          ref: l,
          tabIndex: c,
          'data-tooltip': s,
        })
      })
    },
    50298: (e, t, s) => {
      s.d(t, { ToolbarMenuButton: () => d })
      var r = s(50959),
        a = s(39416),
        n = s(8087),
        i = s(50238),
        o = s(16838),
        l = s(36898),
        c = s(81261)
      const d = (0, r.forwardRef)((e, t) => {
        const { tooltip: s, menuReference: d = null, ...u } = e,
          [h, m] = (0, i.useRovingTabindexElement)(null),
          p = (0, a.useFunctionalRefObject)(d)
        return (
          (0, l.useMouseClickAutoBlur)(p),
          r.createElement(n.ToolWidgetMenu, {
            'aria-label': o.PLATFORM_ACCESSIBILITY_ENABLED ? s : void 0,
            ...u,
            ref: t,
            tag: o.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div',
            reference: h,
            tabIndex: m,
            'data-tooltip': s,
            menuReference: p,
            onMenuKeyDown: c.handleAccessibleMenuKeyDown,
            onMenuFocus: (e) => (0, c.handleAccessibleMenuFocus)(e, h),
          })
        )
      })
    },
    54079: (e, t, s) => {
      s.d(t, { Toolbar: () => u })
      var r = s(50959),
        a = s(50151),
        n = s(47201),
        i = s(3343),
        o = s(16838),
        l = s(71468),
        c = s(39416),
        d = s(36898)
      const u = (0, r.forwardRef)((e, t) => {
        const {
            onKeyDown: s,
            orientation: u,
            blurOnEscKeydown: h = !0,
            blurOnClick: m = !0,
            ...p
          } = e,
          g = o.PLATFORM_ACCESSIBILITY_ENABLED
            ? { role: 'toolbar', 'aria-orientation': u }
            : {},
          v = (0, c.useFunctionalRefObject)(t)
        return (
          (0, r.useLayoutEffect)(() => {
            if (!o.PLATFORM_ACCESSIBILITY_ENABLED) return
            const e = (0, a.ensureNotNull)(v.current),
              t = () => {
                const t = (0, o.queryTabbableElements)(e).sort(
                  o.navigationOrderComparator,
                )
                if (0 === t.length) {
                  const [t] = (0, o.queryFocusableElements)(e).sort(
                    o.navigationOrderComparator,
                  )
                  if (void 0 === t) return
                  ;(0, l.becomeMainElement)(t)
                }
                if (t.length > 1) {
                  const [, ...e] = t
                  for (const t of e) (0, l.becomeSecondaryElement)(t)
                }
              }
            return (
              window.addEventListener('keyboard-navigation-activation', t),
              () =>
                window.removeEventListener('keyboard-navigation-activation', t)
            )
          }, []),
          (0, d.useMouseClickAutoBlur)(v, m),
          r.createElement('div', {
            ...p,
            ...g,
            ref: v,
            onKeyDown: (0, n.createSafeMulticastEventHandler)((e) => {
              if (!o.PLATFORM_ACCESSIBILITY_ENABLED) return
              if (e.defaultPrevented) return
              if (!(document.activeElement instanceof HTMLElement)) return
              const t = (0, i.hashFromEvent)(e)
              if (h && 27 === t)
                return e.preventDefault(), void document.activeElement.blur()
              if ('vertical' !== u && 37 !== t && 39 !== t) return
              if ('vertical' === u && 38 !== t && 40 !== t) return
              const s = e.currentTarget,
                r = (0, o.queryFocusableElements)(s).sort(
                  o.navigationOrderComparator,
                )
              if (0 === r.length) return
              const a = r.indexOf(document.activeElement)
              if (-1 === a) return
              e.preventDefault()
              const n = () => {
                  const e = (a + r.length - 1) % r.length
                  ;(0, l.becomeSecondaryElement)(r[a]),
                    (0, l.becomeMainElement)(r[e]),
                    r[e].focus()
                },
                c = () => {
                  const e = (a + r.length + 1) % r.length
                  ;(0, l.becomeSecondaryElement)(r[a]),
                    (0, l.becomeMainElement)(r[e]),
                    r[e].focus()
                }
              switch ((0, o.mapKeyCodeToDirection)(t)) {
                case 'inlinePrev':
                  'vertical' !== u && n()
                  break
                case 'inlineNext':
                  'vertical' !== u && c()
                  break
                case 'blockPrev':
                  'vertical' === u && n()
                  break
                case 'blockNext':
                  'vertical' === u && c()
              }
            }, s),
          })
        )
      })
    },
    33279: (e, t, s) => {
      s.r(t), s.d(t, { BottomToolbarRenderer: () => gt })
      var r = s(50959),
        a = s(962),
        n = s(11542),
        i = s(19036),
        o = s(97754),
        l = s.n(o),
        c = s(14483),
        d = s(50298),
        u = s(12811),
        h = s(59064),
        m = s(90692),
        p = s(81351),
        g = s(51613),
        v = s(50151),
        _ = s(51768),
        b = s(95366),
        f = s(57898),
        y = s(36274)
      const S = (e) =>
          n.t(
            null,
            { plural: '{str} minutes', count: e, replace: { str: `${e}` } },
            s(60144),
          ),
        E = (e) =>
          n.t(
            null,
            { plural: '{str} hours', count: e, replace: { str: `${e}` } },
            s(17174),
          ),
        k = (e) =>
          n.t(
            null,
            { plural: '{str} months', count: e, replace: { str: `${e}` } },
            s(28039),
          ),
        C = {
          1: { resolution: '1', text: S(1) },
          3: { resolution: '3', text: S(3) },
          5: { resolution: '5', text: S(5) },
          15: { resolution: '15', text: S(15) },
          30: { resolution: '30', text: S(30) },
          45: { resolution: '45', text: S(45) },
          60: { resolution: '60', text: E(1) },
          120: { resolution: '120', text: E(2) },
          180: { resolution: '180', text: E(3) },
          240: { resolution: '240', text: E(4) },
          '1D': {
            resolution: '1D',
            text:
              ((w = 1),
              n.t(
                null,
                { plural: '{str} days', count: w, replace: { str: `${w}` } },
                s(74262),
              )),
          },
          '1W': {
            resolution: '1W',
            text:
              ((T = 1),
              n.t(
                null,
                { plural: '{str} weeks', count: T, replace: { str: `${T}` } },
                s(14074),
              )),
          },
          '1M': {
            resolution: '1M',
            text: k(1),
          },
          '3M': { resolution: '3M', text: k(3) },
          '6M': { resolution: '6M', text: k(6) },
          '12M': {
            resolution: '12M',
            text:
              ((x = 1),
              n.t(
                null,
                { plural: '{str} years', count: x, replace: { str: `${x}` } },
                s(8222),
              )),
          },
        }
      var x, T, w
      function M(e) {
        const t = ((e) => {
            const t = e.value.value,
              r = y.Interval.parse(t)
            if (!r.isValid()) {
              if ('YTD' === t)
                return n.t(null, { context: 'timeframe_title' }, s(87556))
              if ('ALL' === t)
                return n.t(null, { context: 'timeframe_title' }, s(74944))
              if ('LASTSESSION' === t) return A(1)
            }
            if (r.isMinutes()) {
              const e = r.multiplier()
              return e % 60 != 0
                ? ((i = e),
                  n.t(
                    null,
                    {
                      plural: '{str} minutes',
                      count: i,
                      replace: { str: `${i}` },
                      context: 'timeframe_title',
                    },
                    s(44795),
                  ))
                : ((a = e / 60),
                  n.t(
                    null,
                    {
                      plural: '{str} hours',
                      count: a,
                      replace: { str: `${a}` },
                      context: 'timeframe_title',
                    },
                    s(89020),
                  ))
            }
            var a
            var i
            if (r.isDays()) return A(r.multiplier())
            if (r.isWeeks())
              return ((e) =>
                n.t(
                  null,
                  {
                    plural: '{str} weeks',
                    count: e,
                    replace: { str: `${e}` },
                    context: 'timeframe_title',
                  },
                  s(67518),
                ))(r.multiplier())
            if (r.isMonths()) {
              const e = r.multiplier()
              return e % 12 != 0
                ? ((o = e),
                  n.t(
                    null,
                    {
                      plural: '{str} months',
                      count: o,
                      replace: { str: `${o}` },
                      context: 'timeframe_title',
                    },
                    s(3189),
                  ))
                : ((e) =>
                    n.t(
                      null,
                      {
                        plural: '{str} years',
                        count: e,
                        replace: { str: `${e}` },
                        context: 'timeframe_title',
                      },
                      s(6598),
                    ))(e / 12)
            }
            var o
            return e.description || e.text
          })(e),
          r = ((e) => {
            const t = e.targetResolution,
              r = y.Interval.parse(t)
            if (r.isMinutes()) {
              const e = r.multiplier()
              return e % 60 != 0
                ? ((i = e),
                  n.t(
                    null,
                    {
                      plural: '{str} minutes intervals',
                      count: i,
                      replace: { str: `${i}` },
                      context: 'timeframe_title',
                    },
                    s(56347),
                  ))
                : ((a = e / 60),
                  n.t(
                    null,
                    {
                      plural: '{str} hours intervals',
                      count: a,
                      replace: { str: `${a}` },
                      context: 'timeframe_title',
                    },
                    s(54028),
                  ))
            }
            var a
            var i
            if (r.isDays())
              return ((e) =>
                n.t(
                  null,
                  {
                    plural: '{str} days intervals',
                    count: e,
                    replace: { str: `${e}` },
                    context: 'timeframe_title',
                  },
                  s(81693),
                ))(r.multiplier())
            if (r.isWeeks())
              return ((e) =>
                n.t(
                  null,
                  {
                    plural: '{str} weeks intervals',
                    count: e,
                    replace: { str: `${e}` },
                    context: 'timeframe_title',
                  },
                  s(58667),
                ))(r.multiplier())
            if (r.isMonths()) {
              const e = r.multiplier()
              return e % 12 != 0
                ? ((o = e),
                  n.t(
                    null,
                    {
                      plural: '{str} months intervals',
                      count: o,
                      replace: { str: `${o}` },
                      context: 'timeframe_title',
                    },
                    s(99773),
                  ))
                : ((e) =>
                    n.t(
                      null,
                      {
                        plural: '{str} years intervals',
                        count: e,
                        replace: { str: `${e}` },
                        context: 'timeframe_title',
                      },
                      s(57849),
                    ))(e / 12)
            }
            var o
            return C[t].text
          })(e)
        return n.t(
          null,
          {
            replace: { timePeriod: t, timeInterval: r },
            context: 'timeframe_title',
          },
          s(29505),
        )
      }
      const A = (e) =>
        n.t(
          null,
          {
            plural: '{str} days',
            count: e,
            replace: { str: `${e}` },
            context: 'timeframe_title',
          },
          s(42908),
        )
      class z {
        constructor(e) {
          ;(this._state = { ranges: [] }),
            (this._change = new f.Delegate()),
            (this._rangeChangedListenerBound = this._onRangeChanged.bind(this))
          const { chartWidget: t } = (this._context = e)
          t.withModel(null, () => {
            const e = t.model(),
              s = e.mainSeries()
            s.onStatusChanged().subscribe(this, this._updateAvailableRanges),
              c.enabled('update_timeframes_set_on_symbol_resolve') &&
                s
                  .dataEvents()
                  .symbolResolved()
                  .subscribe(this, this._updateAvailableRanges),
              s
                .priceScale()
                .properties()
                .childs()
                .lockScale.subscribe(this, this._updateAvailableRanges)
            const r = e.model().appliedTimeFrame()
            r.subscribe(this._rangeChangedListenerBound),
              this._rangeChangedListenerBound(r.value()),
              this._updateAvailableRanges()
          })
        }
        state() {
          return this._state
        }
        onChange() {
          return this._change
        }
        selectRange(e) {
          this._setState({ activeRange: e.value.value })
          const { chartWidgetCollection: t } = this._context,
            s = { val: e.value, res: e.targetResolution }
          t.setTimeFrame(s)
        }
        destroy() {
          const { chartWidget: e } = this._context
          e.withModel(null, () => {
            const t = e.model(),
              s = t.mainSeries()
            s.onStatusChanged().unsubscribe(this, this._updateAvailableRanges),
              c.enabled('update_timeframes_set_on_symbol_resolve') &&
                s
                  .dataEvents()
                  .symbolResolved()
                  .unsubscribe(this, this._updateAvailableRanges),
              s
                .priceScale()
                .properties()
                .childs()
                .lockScale.unsubscribe(this, this._updateAvailableRanges),
              t
                .model()
                .appliedTimeFrame()
                .unsubscribe(this._rangeChangedListenerBound)
          }),
            this._change.destroy()
        }
        _setState(e) {
          ;(this._state = Object.assign({}, this._state, e)),
            this._change.fire(this._state)
        }
        _onRangeChanged(e) {
          let t
          null !== e && 'period-back' === e.val.type && (t = e.val.value),
            this._setState({ activeRange: t })
        }
        _updateAvailableRanges() {
          const { availableTimeFrames: e, chartWidget: t } = this._context
          if (!t.hasModel()) return
          const s = t.model().mainSeries(),
            r = s.status()
          if (2 === r || 1 === r) return
          const a = e(s.symbolInfo(), s.status()).map((e) => ({
            ...e,
            description: '' === e.description ? M(e) : e.description,
          }))
          0 !== a.length && this._setState({ ranges: a })
        }
      }
      const I = (0, b.registryContextType)()
      function L(e) {
        var t
        return (
          ((t = class extends r.PureComponent {
            constructor(e, t) {
              super(e, t),
                (this._handleUpdate = (e) => {
                  this.setState(e)
                }),
                (this._handleSelectRange = (e) => {
                  var t, s
                  ;(0, _.trackEvent)(
                    'GUI',
                    'Chart Bottom Toolbar',
                    `range ${e.value}`,
                  ),
                    null === (s = (t = this.props).onSelectRange) ||
                      void 0 === s ||
                      s.call(t, e),
                    this._binding.selectRange(e)
                }),
                (0, b.validateRegistry)(t, {
                  availableTimeFrames: i.any.isRequired,
                  chartWidgetCollection: i.any.isRequired,
                  chartWidget: i.any.isRequired,
                }),
                D.has(t.chartWidget) || D.set(t.chartWidget, new z(t))
              const s = (this._binding = (0, v.ensureDefined)(
                D.get(t.chartWidget),
              ))
              this.state = s.state()
            }
            componentDidMount() {
              this._binding.onChange().subscribe(this, this._handleUpdate)
            }
            componentWillUnmount() {
              this._binding.onChange().unsubscribe(this, this._handleUpdate)
            }
            render() {
              return r.createElement(e, {
                goToDateButton: this.props.goToDateButton,
                className: this.props.className,
                ranges: this.state.ranges,
                activeRange: this.state.activeRange,
                onSelectRange: this._handleSelectRange,
              })
            }
          }).contextType = I),
          t
        )
      }
      const D = new WeakMap()
      var B = s(64358),
        N = s(23829),
        R = s(1109),
        W = s(53180),
        j = s(90752),
        P = s(7458)
      function H(e) {
        const { ranges: t, activeRange: s, onSelectRange: a } = e
        return r.createElement(
          r.Fragment,
          null,
          t.map((e) =>
            r.createElement(N.ContextMenuItem, {
              key: e.value.value,
              label: e.description || e.text,
              active: s === e.value.value,
              checked: s === e.value.value,
              checkable: !0,
              disabled: !1,
              onClick: n.bind(null, e),
              doNotCloseOnClick: !1,
              subItems: [],
            }),
          ),
        )
        function n(e) {
          e && a && a(e), (0, h.globalCloseMenu)()
        }
      }
      function U(e) {
        const { onGoToDateClick: t } = e
        return r.createElement(
          r.Fragment,
          null,
          r.createElement(R.Separator, { className: P.separator }),
          r.createElement(N.ContextMenuItem, {
            icon: j,
            label: (0, W.appendEllipsis)(n.t(null, void 0, s(369))),
            onClick: t,
            active: !1,
            checked: !1,
            checkable: !1,
            disabled: !1,
            doNotCloseOnClick: !1,
            subItems: [],
          }),
        )
      }
      const F = {
          title: n.t(null, void 0, s(60222)),
          goToDate: (0, W.appendEllipsis)(n.t(null, void 0, s(369))),
        },
        O = (0, b.registryContextType)()
      class Y extends r.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._handleGoToDateClick = () => {
              const { chartWidget: e } = this.context
              ;(0, B.showGoToDateDialog)(e), (0, h.globalCloseMenu)()
            }),
            (this._handleRangeSelect = (e) => {
              e && this.props.onSelectRange && this.props.onSelectRange(e),
                (0, h.globalCloseMenu)()
            }),
            (this._renderChildren = (e) => {
              const {
                ranges: t,
                activeRange: s,
                goToDateButton: a,
              } = this.props
              return e
                ? r.createElement(
                    r.Fragment,
                    null,
                    r.createElement(H, {
                      ranges: t,
                      activeRange: s,
                      onSelectRange: this._handleRangeSelect,
                    }),
                    a &&
                      r.createElement(U, {
                        onGoToDateClick: this._handleGoToDateClick,
                      }),
                  )
                : r.createElement(
                    r.Fragment,
                    null,
                    t.map((e) =>
                      r.createElement(p.AccessibleMenuItem, {
                        key: e.value.value,
                        label: e.description || e.text,
                        isActive: s === e.value.value,
                        onClick: this._handleRangeSelect,
                        onClickArg: e,
                      }),
                    ),
                    a && r.createElement(g.PopupMenuSeparator, null),
                    a &&
                      r.createElement(p.AccessibleMenuItem, {
                        label: F.goToDate,
                        onClick: this._handleGoToDateClick,
                      }),
                  )
            }),
            (0, b.validateRegistry)(t, { chartWidget: i.any.isRequired })
        }
        render() {
          return r.createElement(
            m.MatchMedia,
            { rule: 'screen and (max-width: 430px)' },
            (e) =>
              r.createElement(
                d.ToolbarMenuButton,
                {
                  className: l()(P.button, this.props.className),
                  content: F.title,
                  arrow: !0,
                  verticalAttachEdge: u.VerticalAttachEdge.Top,
                  verticalDropDirection:
                    u.VerticalDropDirection.FromBottomToTop,
                  horizontalMargin: 4,
                  'data-name': 'date-ranges-menu',
                  isDrawer: e,
                  onClick: this._trackClick,
                },
                this._renderChildren(e),
              ),
          )
        }
        _trackClick() {
          0
        }
      }
      Y.contextType = O
      const J = L(Y)
      var X = s(4618)
      const G = X
      function V(e) {
        return class extends r.PureComponent {
          constructor() {
            super(...arguments), (this.activeTab = { current: null })
          }
          componentDidUpdate() {
            ;((0, v.ensureNotNull)(this._slider).style.transition =
              'transform 350ms'),
              this._componentDidUpdate()
          }
          componentDidMount() {
            this._componentDidUpdate()
          }
          render() {
            const { className: t } = this.props,
              s = this._generateTabs()
            return r.createElement(
              'div',
              { className: o(t, X.tabs), 'data-name': this.props['data-name'] },
              s,
              r.createElement(e, {
                reference: (e) => {
                  this._slider = e
                },
              }),
            )
          }
          _generateTabs() {
            return (
              (this.activeTab.current = null),
              r.Children.map(this.props.children, (e) => {
                const t = e,
                  s = Boolean(t.props.isActive),
                  a = {
                    reference: (e) => {
                      s && (this.activeTab.current = e),
                        t.props.reference && t.props.reference(e)
                    },
                  }
                return r.cloneElement(t, a)
              })
            )
          }
          _componentDidUpdate() {
            const e = (0, v.ensureNotNull)(this._slider).style
            if (this.activeTab.current) {
              const t = this.activeTab.current.offsetWidth,
                s = this.activeTab.current.offsetLeft
              ;(e.transform = `translateX(${s}px)`),
                (e.width = `${t}px`),
                (e.opacity = '1')
            } else e.opacity = '0'
          }
        }
      }
      V((e) =>
        r.createElement('div', { className: X.slider, ref: e.reference }),
      )
      var q = s(40173),
        Z = s(88066),
        $ = s(91348)
      ;(0, q.mergeThemes)(Z.DEFAULT_TOOLBAR_BUTTON_THEME, $)
      function K(e) {
        const {
            reference: t,
            text: s,
            tooltip: a,
            isActive: n,
            className: i,
            onClick: l,
            theme: c = $,
            ...d
          } = e,
          u = o(i, c.item, { [c.isActive]: n })
        return r.createElement(Z.ToolbarButton, {
          ...d,
          ref: t,
          text: s,
          isActive: n,
          tooltip: a,
          className: u,
          onClick: l,
        })
      }
      var Q = s(22586)
      const ee = (0, q.mergeThemes)(G, Q)
      var te = s(31071)
      const se = V((e) =>
        r.createElement(
          'div',
          { className: o(e.className, ee.slider), ref: e.reference },
          r.createElement('div', { className: ee.inner }),
        ),
      )
      const re = L((e) => {
        const { className: t, ranges: s, activeRange: a, onSelectRange: n } = e
        return r.createElement(
          se,
          { className: o(te.sliderRow, t), 'data-name': 'date-ranges-tabs' },
          s.map((e) =>
            r.createElement(K, {
              key: e.value.value,
              value: e.value.value,
              'data-name': `date-range-tab-${e.value.value}`,
              isActive: a === e.value.value,
              onClick: n && n.bind(null, e),
              text: e.text,
              tooltip: e.description || e.text,
            }),
          ),
        )
      })
      var ae = s(61814),
        ne = s(68335),
        ie = s(48889),
        oe = s(92574),
        le = s(50242)
      const ce = (0, ae.hotKeySerialize)({
          keys: [(0, ne.humanReadableModifiers)(ne.Modifiers.Alt, !1), 'G'],
          text: '{0} + {1}',
        }),
        de = (0, b.registryContextType)()
      class ue extends r.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._handleClick = () => {
              const { chartWidget: e } = this.context
              ;(0, _.trackEvent)('GUI', 'Chart Bottom Toolbar', 'go to'),
                (0, B.showGoToDateDialog)(e)
            }),
            (0, b.validateRegistry)(t, { chartWidget: i.any.isRequired })
        }
        render() {
          const { className: e, ranges: t } = this.props
          return (
            t.length > 0 &&
            r.createElement(ie.ToolbarIconButton, {
              icon: oe,
              onClick: this._handleClick,
              'data-tooltip-hotkey': ce,
              tooltip: n.t(null, void 0, s(369)),
              'data-name': 'go-to-date',
              className: o(le.button, e),
            })
          )
        }
      }
      ue.contextType = de
      const he = L(ue)
      var me = s(76460),
        pe = s(88270),
        ge = s(79206),
        ve = s(39347),
        _e = s(41249),
        be = s(92216),
        fe = s(16164),
        ye = s(10643),
        Se = s(85616)
      const Ee = (0, q.mergeThemes)(Z.DEFAULT_TOOLBAR_BUTTON_THEME, {
        isDisabled: Se.disabled,
        button: Se.button,
      })
      const ke = (0, b.registryContextType)()
      class Ce extends r.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._timeFormatter = new ge.TimeFormatter(
              (0, be.getHourMinuteSecondFormat)(
                fe.timeHoursFormatProperty.value(),
              ),
            )),
            (this._tickInterval = void 0),
            (this._element = null),
            (this._menuShown = !1),
            (this._preventShowingMenu = !1),
            (this._tickClock = () => {
              const { chartApiInstance: e } = this.context
              if (void 0 !== this._timezone) {
                const t = (0, _e.utc_to_cal)(this._timezone, e.serverTime())
                this.setState({ time: this._timeFormatter.format(t) })
              }
            }),
            (this._getActions = () => {
              if (!this.props.withMenu) return []
              const { chartWidget: e } = this.context
              return ((e) => {
                e.updateActions()
                const t = e.actions()
                return t && t.applyTimeZone instanceof ve.Action
                  ? t.applyTimeZone.getSubItems()
                  : []
              })(e)
            }),
            (this._handleRef = (e) => {
              this._element = e
            }),
            (this._onMouseDown = () => {
              this._preventShowingMenu = this._menuShown
            }),
            (this._showMenu = (e) => {
              if (this._preventShowingMenu)
                return void ye.ContextMenuManager.hideAll()
              const t = (0, v.ensureNotNull)(this._element),
                s = this._getActions()
              if (0 === s.length) return
              const r = t.getBoundingClientRect()
              ye.ContextMenuManager.showMenu(
                s,
                { clientX: r.left, clientY: r.top, attachToYBy: 'bottom' },
                {
                  returnFocus: !0,
                  takeFocus: !0,
                  isKeyboardEvent: (0, me.isKeyboardClick)(e),
                },
                { menuName: 'TimezoneMenuContextMenu' },
                () => {
                  this._menuShown = !1
                },
              ).then(() => {
                this._menuShown = !0
              })
            }),
            (0, b.validateRegistry)(t, {
              chartWidget: i.any.isRequired,
              chartApiInstance: i.any.isRequired,
            }),
            (this.state = { time: '' })
        }
        componentDidMount() {
          const { chartWidget: e } = this.context
          ;(this._tickInterval = setInterval(this._tickClock, 1e3)),
            e.withModel(null, () => {
              const t = e.model()
              t
                .model()
                .mainSeries()
                .dataEvents()
                .symbolResolved()
                .subscribe(this, this.updateTimezonesButton),
                t
                  .model()
                  .properties()
                  .childs()
                  .timezone.subscribe(this, this.updateTimezonesButton),
                fe.timeHoursFormatProperty.subscribe(
                  this,
                  this._timeHoursFormatPropertyChanged,
                )
            })
        }
        componentWillUnmount() {
          const { chartWidget: e } = this.context
          clearInterval(this._tickInterval),
            e.withModel(null, () => {
              const t = e.model()
              t
                .model()
                .mainSeries()
                .dataEvents()
                .symbolResolved()
                .unsubscribe(this, this.updateTimezonesButton),
                t
                  .model()
                  .properties()
                  .childs()
                  .timezone.unsubscribe(this, this.updateTimezonesButton),
                fe.timeHoursFormatProperty.unsubscribe(
                  this,
                  this._timeHoursFormatPropertyChanged,
                )
            })
        }
        render() {
          const { className: e, withMenu: t } = this.props,
            { time: a } = this.state,
            i =
              void 0 !== this._timezone
                ? (0, pe.parseTzOffset)(this._timezone.name()).string
                : null
          return r.createElement(Z.ToolbarButton, {
            onMouseDown: this._onMouseDown,
            ref: this._handleRef,
            onClick: this._showMenu,
            isDisabled: !t,
            theme: Ee,
            'data-name': 'time-zone-menu',
            tooltip: t ? n.t(null, void 0, s(87492)) : void 0,
            className: e,
            text: a && i && `${a} (${i})`,
          })
        }
        updateTimezonesButton() {
          const { chartWidget: e } = this.context
          if (!e.hasModel()) return
          if (null === e.model().mainSeries().symbolInfo()) return
          let t = e.model().model().timezone()
          if ('exchange' === t) {
            const s = (0, v.ensureNotNull)(
              e.model().mainSeries().symbolInfo(),
            ).timezone
            s && (t = s)
          }
          ;(this._timezone = (0, _e.get_timezone)(t)), this._tickClock()
        }
        _timeHoursFormatPropertyChanged() {
          ;(this._timeFormatter = new ge.TimeFormatter(
            (0, be.getHourMinuteSecondFormat)(
              fe.timeHoursFormatProperty.value(),
            ),
          )),
            this.updateTimezonesButton()
        }
      }
      Ce.contextType = ke
      var xe = s(56812)
      function Te(e) {
        return r.createElement('span', {
          className: o(xe.separator, e.className),
        })
      }
      var we = s(54079),
        Me = s(36298),
        Ae = s(49483)
      class ze {
        constructor(e, t, s) {
          ;(this._highlighted = !1),
            (this._chartWidget = e),
            (this._priceScaleGetter = t),
            (this._owner = s),
            (this._setHighlight = this._setHighlight.bind(this)),
            (this._removeHighlight = this._removeHighlight.bind(this))
        }
        destroy() {
          this._highlighted && this._removeHighlight()
        }
        handlers() {
          const e = Ae.CheckMobile.any()
          return {
            onMouseEnter: e ? void 0 : this._setHighlight,
            onMouseLeave: e ? void 0 : this._removeHighlight,
          }
        }
        _setHighlight() {
          if (!this._chartWidget.hasModel()) return
          const e = this._chartWidget.model().model(),
            t = e.paneForSource(e.mainSeries()),
            s = this._priceScaleGetter()
          if (null === t || null === s) return
          const r = this._chartWidget.paneByState(t)
          if (null !== r) {
            const t = r.rightPriceAxisesContainer().findAxisWidgetForScale(s)
            let a = null
            null !== t && (a = t.axisInfo())
            const n = r.leftPriceAxisesContainer().findAxisWidgetForScale(s)
            null !== n && (a = n.axisInfo())
            const i = r.highlightedPriceAxis()
            null !== a &&
              i.value().axis !== a &&
              (i.setValue({ owner: this._owner, axis: a }),
              e.lightUpdate(),
              (this._highlighted = !0))
          }
        }
        _removeHighlight() {
          if (!this._chartWidget.hasModel()) return
          const e = this._chartWidget.model().model(),
            t = e.paneForSource(e.mainSeries())
          if (null === t) return
          const s = this._chartWidget.paneByState(t)
          if (null !== s) {
            const t = s.highlightedPriceAxis(),
              r = t.value()
            null !== r.axis &&
              r.owner === this._owner &&
              (t.setValue({ owner: this._owner, axis: null }),
              e.lightUpdate(),
              (this._highlighted = !1))
          }
        }
      }
      const Ie = (0, b.registryContextType)(),
        Le = new Me.TranslatedString(
          'toggle log scale',
          n.t(null, void 0, s(60166)),
        )
      const De = (0, b.registryContextType)(),
        Be = new Me.TranslatedString(
          'toggle auto scale',
          n.t(null, void 0, s(63060)),
        )
      const Ne = (0, b.registryContextType)(),
        Re = new Me.TranslatedString(
          'toggle percentage scale',
          n.t(null, void 0, s(68642)),
        )
      const We = (0, b.registryContextType)()
      var je = s(42142),
        Pe = s(21861),
        He = s(82962),
        Ue = s(11678),
        Fe = s(97086)
      const Oe = new Me.TranslatedString(
          'change session',
          n.t(null, void 0, s(65303)),
        ),
        Ye = {
          hint: n.t(null, void 0, s(25866)),
          headerMenuText: n.t(null, void 0, s(44794)),
        },
        Je = (0, b.registryContextType)()
      class Xe extends r.PureComponent {
        constructor(e, t) {
          super(e, t),
            (0, b.validateRegistry)(t, {
              chartWidget: i.any.isRequired,
              chartApiInstance: i.any.isRequired,
            }),
            (this.state = { availableSessions: [] })
        }
        componentDidMount() {
          const { chartWidget: e } = this.context
          e.withModel(null, () => {
            const t = e.model()
            t
              .model()
              .mainSeries()
              .dataEvents()
              .symbolResolved()
              .subscribe(this, this.updateSessionButton),
              t
                .model()
                .mainSeries()
                .properties()
                .childs()
                .sessionId.subscribe(this, this.updateSessionButton),
              this.updateSessionButton()
          })
        }
        componentWillUnmount() {
          const { chartWidget: e } = this.context
          e.withModel(null, () => {
            const t = e.model()
            t
              .model()
              .mainSeries()
              .dataEvents()
              .symbolResolved()
              .unsubscribe(this, this.updateSessionButton),
              t
                .model()
                .mainSeries()
                .properties()
                .childs()
                .sessionId.unsubscribe(this, this.updateSessionButton)
          })
        }
        render() {
          const { className: e, withMenu: t } = this.props,
            { sessionName: s, sessionDescription: a } = this.state
          return r.createElement(
            d.ToolbarMenuButton,
            {
              arrow: !1,
              isDisabled: !t,
              content: s,
              className: e,
              closeOnClickOutside: !0,
              tooltip: t ? a : void 0,
              'data-name': 'session-menu',
              verticalDropDirection: u.VerticalDropDirection.FromBottomToTop,
              verticalAttachEdge: u.VerticalAttachEdge.Top,
              onClick: this._trackClick,
            },
            this._menuItems(),
          )
        }
        updateSessionButton() {
          var e, t
          const { chartWidget: s } = this.context
          if (!s.model()) return
          const r = s.model().mainSeries().symbolInfo()
          if (null === r) return
          const a = r.subsession_id,
            n =
              null !==
                (t =
                  null === (e = r.subsessions) || void 0 === e
                    ? void 0
                    : e.filter((e) => !e.private)) && void 0 !== t
                ? t
                : [],
            i = n.find((e) => e.id === a)
          this.setState({
            sessionId: a,
            sessionName: (0, Ue.translateSessionShortDescription)(
              (null == i ? void 0 : i.description) || '',
            ),
            sessionDescription: (0, Ue.translateSessionDescription)(
              (null == i ? void 0 : i.description) || '',
            ),
            availableSessions: n,
          })
        }
        _menuItems() {
          if (!this.props.withMenu) return []
          const { chartWidget: e } = this.context,
            { availableSessions: t } = this.state
          if (!e.model()) return []
          const s = e.model().mainSeries(),
            a = [
              r.createElement(
                He.ToolWidgetMenuSummary,
                { key: 'header_menu_text', className: Fe.headerMenuText },
                Ye.headerMenuText.toUpperCase(),
              ),
            ]
          for (const n of t) {
            const t = { category: 'SetSession', event: n.id },
              i = () => {
                e.model().setProperty(
                  s.properties().childs().sessionId,
                  n.id,
                  Oe,
                )
              }
            a.push(
              r.createElement(p.AccessibleMenuItem, {
                key: n.id,
                label: (0, Ue.translateSessionDescription)(n.description),
                isActive: this.state.sessionId === n.id,
                trackEventObject: t,
                onClick: i,
              }),
            )
          }
          return a
        }
        _trackClick() {
          0
        }
      }
      Xe.contextType = Je
      var Ge = s(21868),
        Ve = s(72026),
        qe = s(51267),
        Ze = s(64264)
      const $e = {
          extLabel: n.t(null, void 0, s(8877)),
          extHint: n.t(null, void 0, s(41421)),
          percentageHint: n.t(null, void 0, s(43737)),
          logLabel: n.t(null, { context: 'scale' }, s(885)),
          logHint: n.t(null, void 0, s(21329)),
          autoLabel: n.t(null, { context: 'scale' }, s(99247)),
          autoHint: n.t(null, void 0, s(60879)),
          fullscreenHint: n.t(null, void 0, s(98948)),
          adjLabel: n.t(null, { context: 'adjustments' }, s(25988)),
          adjHint: n.t(null, void 0, s(9994)),
          adjForDividendsOnlyHint: n.t(null, void 0, s(1217)),
          adjForSplitsOnlyHint: n.t(null, void 0, s(27662)),
          backAdjustLabel: n.t(null, { context: 'adjustments' }, s(24717)),
          backAdjustHint: n.t(null, void 0, s(10989)),
          settlementAsCloseLabel: n.t(
            null,
            { context: 'adjustments' },
            s(11987),
          ),
          settlementAsCloseHint: n.t(null, void 0, s(23500)),
        },
        Ke =
          ((Qe = (e) =>
            r.createElement(Z.ToolbarButton, {
              text: $e.logLabel,
              tooltip: $e.logHint,
              className: e.className,
              isActive: e.isLogarithm,
              'aria-pressed': e.isLogarithm,
              onClick: ct(e.onClick, 'log', e.isLogarithm),
              onMouseEnter: e.onMouseEnter,
              onMouseLeave: e.onMouseLeave,
              'data-name': 'logarithm',
            })),
          ((et = class extends r.PureComponent {
            constructor(e, t) {
              super(e, t),
                (this._priceScale = null),
                (this._handleSelect = () => {
                  const e = this.context.chartWidget.model(),
                    t = (0, v.ensureNotNull)(this.state.series),
                    s = t.priceScale(),
                    r = s.mode()
                  t.priceScale().isLockScale() ||
                    e.setPriceScaleMode({ log: !r.log }, s, Le)
                }),
                (0, b.validateRegistry)(t, { chartWidget: i.any.isRequired }),
                (this.state = { isActive: !1, series: null }),
                (this._priceAxisHighlighter = new ze(
                  this.context.chartWidget,
                  () => this._priceScale,
                  'logarithm',
                ))
            }
            componentDidMount() {
              const e = this.context.chartWidget
              e.withModel(null, () => {
                const t = e.model().mainSeries(),
                  s = t.priceScale()
                this._handleMainSeriesPriceScaleChanged(s),
                  t
                    .priceScaleChanged()
                    .subscribe(this, this._handleMainSeriesPriceScaleChanged),
                  this._handleModeChanged({}, s.mode()),
                  this.setState({ isActive: t.priceScale().isLog(), series: t })
              })
            }
            componentWillUnmount() {
              const e = this.context.chartWidget
              e.withModel(null, () => {
                e.model()
                  .mainSeries()
                  .priceScaleChanged()
                  .unsubscribe(this, this._handleMainSeriesPriceScaleChanged)
              }),
                null !== this._priceScale &&
                  (this._priceScale.modeChanged().unsubscribeAll(this),
                  (this._priceScale = null)),
                this._priceAxisHighlighter.destroy()
            }
            render() {
              const { className: e } = this.props,
                { isActive: t, series: s } = this.state
              return r.createElement(Qe, {
                ...this._priceAxisHighlighter.handlers(),
                className: e,
                isLogarithm: t,
                isDisabled: null === s,
                onClick: this._handleSelect,
              })
            }
            _handleMainSeriesPriceScaleChanged(e) {
              null !== this._priceScale &&
                this._priceScale
                  .modeChanged()
                  .unsubscribe(this, this._handleModeChanged),
                (this._priceScale = e),
                this._priceScale
                  .modeChanged()
                  .subscribe(this, this._handleModeChanged),
                this._handleModeChanged({}, e.mode())
            }
            _handleModeChanged(e, t) {
              Boolean(t.log) !== this.state.isActive &&
                this.setState({ isActive: Boolean(t.log) })
            }
          }).contextType = Ie),
          et)
      var Qe, et
      const tt = ((e) => {
          var t
          return (
            ((t = class extends r.PureComponent {
              constructor(e, t) {
                super(e, t),
                  (this._priceScale = null),
                  (this._handleSelect = () => {
                    const e = this.context.chartWidget.model(),
                      t = (0, v.ensureNotNull)(this.state.series).priceScale(),
                      s = t.mode()
                    e.setPriceScaleMode({ autoScale: !s.autoScale }, t, Be)
                  }),
                  (0, b.validateRegistry)(t, {
                    chartWidget: i.any.isRequired,
                  }),
                  (this.state = { isActive: !1, series: null }),
                  (this._priceAxisHighlighter = new ze(
                    this.context.chartWidget,
                    () => this._priceScale,
                    'auto',
                  ))
              }
              componentDidMount() {
                const e = this.context.chartWidget
                e.withModel(null, () => {
                  const t = e.model().mainSeries(),
                    s = t.priceScale()
                  this._handleMainSeriesPriceScaleChanged(s),
                    t
                      .priceScaleChanged()
                      .subscribe(this, this._handleMainSeriesPriceScaleChanged),
                    this._handleModeChanged({}, s.mode()),
                    this.setState({
                      isActive: t.priceScale().isAutoScale(),
                      series: t,
                    })
                })
              }
              componentWillUnmount() {
                const e = this.context.chartWidget
                e.withModel(null, () => {
                  e.model()
                    .mainSeries()
                    .priceScaleChanged()
                    .unsubscribe(this, this._handleMainSeriesPriceScaleChanged)
                }),
                  null !== this._priceScale &&
                    (this._priceScale.modeChanged().unsubscribeAll(this),
                    (this._priceScale = null)),
                  this._priceAxisHighlighter.destroy()
              }
              render() {
                const { className: t } = this.props,
                  { isActive: s, series: a } = this.state
                return r.createElement(e, {
                  ...this._priceAxisHighlighter.handlers(),
                  className: t,
                  isAuto: s,
                  isDisabled: null === a,
                  onClick: this._handleSelect,
                })
              }
              _handleMainSeriesPriceScaleChanged(e) {
                null !== this._priceScale &&
                  this._priceScale
                    .modeChanged()
                    .unsubscribe(this, this._handleModeChanged),
                  (this._priceScale = e),
                  this._priceScale
                    .modeChanged()
                    .subscribe(this, this._handleModeChanged),
                  this._handleModeChanged({}, e.mode())
              }
              _handleModeChanged(e, t) {
                Boolean(t.autoScale) !== this.state.isActive &&
                  this.setState({ isActive: Boolean(t.autoScale) })
              }
            }).contextType = De),
            t
          )
        })((e) =>
          r.createElement(Z.ToolbarButton, {
            text: $e.autoLabel,
            tooltip: $e.autoHint,
            className: e.className,
            isActive: e.isAuto,
            'aria-pressed': e.isAuto,
            onClick: ct(e.onClick, 'auto', e.isAuto),
            onMouseEnter: e.onMouseEnter,
            onMouseLeave: e.onMouseLeave,
            'data-name': 'auto',
          }),
        ),
        st = ((e) => {
          var t
          return (
            ((t = class extends r.PureComponent {
              constructor(e, t) {
                super(e, t),
                  (this._priceScale = null),
                  (this._handleSelect = () => {
                    const e = this.context.chartWidget.model(),
                      t = (0, v.ensureNotNull)(this.state.series),
                      s = t.priceScale(),
                      r = s.mode()
                    t.priceScale().isLockScale() ||
                      e.setPriceScaleMode({ percentage: !r.percentage }, s, Re)
                  }),
                  (0, b.validateRegistry)(t, { chartWidget: i.any.isRequired }),
                  (this.state = { isActive: !1, series: null }),
                  (this._priceAxisHighlighter = new ze(
                    this.context.chartWidget,
                    () => this._priceScale,
                    'percentage',
                  ))
              }
              componentDidMount() {
                const e = this.context.chartWidget
                e.withModel(null, () => {
                  const t = e.model().mainSeries(),
                    s = t.priceScale()
                  this._handleMainSeriesPriceScaleChanged(s),
                    t
                      .priceScaleChanged()
                      .subscribe(this, this._handleMainSeriesPriceScaleChanged),
                    this._handleScaleChange({}, s.mode()),
                    this.setState({
                      isActive: t.priceScale().isPercentage(),
                      series: t,
                    })
                })
              }
              componentWillUnmount() {
                const e = this.context.chartWidget
                e.withModel(null, () => {
                  e.model()
                    .mainSeries()
                    .priceScaleChanged()
                    .unsubscribe(this, this._handleMainSeriesPriceScaleChanged)
                }),
                  null !== this._priceScale &&
                    (this._priceScale.modeChanged().unsubscribeAll(this),
                    (this._priceScale = null)),
                  this._priceAxisHighlighter.destroy()
              }
              render() {
                const { className: t } = this.props,
                  { isActive: s, series: a } = this.state
                return r.createElement(e, {
                  ...this._priceAxisHighlighter.handlers(),
                  className: t,
                  isPercentage: s,
                  isDisabled: null === a,
                  onClick: this._handleSelect,
                })
              }
              _handleMainSeriesPriceScaleChanged(e) {
                null !== this._priceScale &&
                  this._priceScale
                    .modeChanged()
                    .unsubscribe(this, this._handleScaleChange),
                  (this._priceScale = e),
                  this._priceScale
                    .modeChanged()
                    .subscribe(this, this._handleScaleChange),
                  this._handleScaleChange({}, e.mode())
              }
              _handleScaleChange(e, t) {
                Boolean(t.percentage) !== this.state.isActive &&
                  this.setState({ isActive: Boolean(t.percentage) })
              }
            }).contextType = Ne),
            t
          )
        })((e) =>
          r.createElement(Z.ToolbarButton, {
            icon: Ge,
            tooltip: $e.percentageHint,
            className: e.className,
            isActive: e.isPercentage,
            'aria-pressed': e.isPercentage,
            isDisabled: e.isDisabled,
            onClick: ct(e.onClick, 'percent', e.isPercentage),
            onMouseEnter: e.onMouseEnter,
            onMouseLeave: e.onMouseLeave,
            'data-name': 'percentage',
          }),
        )
      const rt = (0, ae.hotKeySerialize)({
          keys: [(0, ne.humanReadableModifiers)(ne.Modifiers.Alt, !1), 'Enter'],
          text: '{0} + {1}',
        }),
        at = ((e) => {
          var t
          return (
            ((t = class extends r.PureComponent {
              constructor(e, t) {
                super(e, t),
                  (this._handleClick = (e) => {
                    const { resizerDetacher: t, chartWidgetCollection: s } =
                      this.context
                    e.shiftKey && t.detachable.value()
                      ? t.detach()
                      : this.state.isFullscreen
                        ? t.exitFullscreen()
                        : t.requestFullscreen()
                  }),
                  (this._handleLayoutChange = (e) => {
                    this.setState({ isFullscreen: e })
                  }),
                  (this._handlePhoneSize = () => {
                    0
                  }),
                  (0, b.validateRegistry)(t, {
                    chartWidgetCollection: i.any.isRequired,
                    resizerDetacher: i.any.isRequired,
                  })
                const { resizerDetacher: s } = t
                this.state = {
                  isFullscreen: s.fullscreen.value(),
                  isChangeLayoutButton: this._isChangeLayoutButton(),
                }
              }
              componentDidMount() {
                const { resizerDetacher: e, chartWidgetCollection: t } =
                    this.context,
                  { mobileChangeLayoutEnabled: s } = this.props
                e.fullscreen.subscribe(this._handleLayoutChange)
              }
              componentWillUnmount() {
                const { resizerDetacher: e, chartWidgetCollection: t } =
                    this.context,
                  { mobileChangeLayoutEnabled: s } = this.props
                e.fullscreen.unsubscribe(this._handleLayoutChange)
              }
              render() {
                const { className: t } = this.props,
                  { isFullscreen: s, isChangeLayoutButton: a } = this.state
                return r.createElement(e, {
                  className: t,
                  isFullscreen: s,
                  onClick: this._handleClick,
                })
              }
              _isChangeLayoutButton() {
                return !1
              }
            }).contextType = We),
            t
          )
        })((e) =>
          r.createElement(Z.ToolbarButton, {
            icon: e.isFullscreen ? qe : Ve,
            tooltip: $e.fullscreenHint,
            className: e.className,
            isActive: e.isFullscreen,
            onClick: ct(e.onClick, 'maximize chart', e.isFullscreen),
            'data-tooltip-hotkey': rt,
            'data-name': 'fullscreen',
          }),
        ),
        nt = { fullscreen: !0, preventPhoneLayout: !0 },
        it = {
          fullscreen: Number.MIN_SAFE_INTEGER,
          preventPhoneLayout: Number.MIN_SAFE_INTEGER,
          separator: -2,
          timeZones: -1,
          auto: 0,
          logarithm: 1,
          percentage: 2,
          session: 3,
          adj: 4,
          backAdj: 5,
          settlementAsClose: 6,
        },
        ot = (() => {
          const e = new Map()
          return (
            e.set(Ke, 'logarithm'),
            e.set(st, 'percentage'),
            e.set(tt, 'auto'),
            e.set(Xe, 'session'),
            e.set(at, 'fullscreen'),
            e
          )
        })()
      function lt(e) {
        0
      }
      function ct(e, t, s) {
        return (t) => {
          e(t)
        }
      }
      const dt = {
          dateRangeMode: 'hidden',
          separator: !0,
          timeZones: !0,
          fullscreen: !0,
          preventPhoneLayout: !0,
          auto: !0,
          logarithm: !0,
          percentage: !0,
          session: !0,
          adj: !0,
          backAdj: !0,
          settlementAsClose: !0,
        },
        ut = (0, b.registryContextType)()
      class ht extends r.PureComponent {
        constructor(e, t) {
          var s, n
          super(e, t),
            (this._timezoneButtonRef = null),
            (this._layout = Object.assign({}, dt)),
            (this._raf = null),
            (this._toolbar = null),
            (this._rangeExpanded = null),
            (this._rangeCollapsed = null),
            (this._seriesComponents = {}),
            (this._resizeObserver = null),
            (this._injector =
              ((s = () => this._layout),
              (n = (e, t) => (this._seriesComponents[t] = e)),
              (e, t, a) => {
                if (r.isValidElement(e) && 'string' != typeof e.type) {
                  const { props: i } = e
                  if ('string' == typeof i.className) {
                    const l = {
                        className: o(
                          i.className,
                          t === a.length - 1 && Ze.last,
                        ),
                      },
                      c = s(),
                      d = (0, v.ensureDefined)(ot.get(e.type))
                    return r.createElement(
                      'div',
                      {
                        key: null === e.key ? void 0 : e.key,
                        className: o(Ze.inline, c[d] && Ze.collapsed),
                        ref: (e) => n(e, d),
                        onClick: () => lt(),
                      },
                      r.cloneElement(e, l),
                    )
                  }
                }
                return e
              })),
            (this._updateButtonsVisibility = () => {
              const { chartWidget: e } = this.context,
                t = e.model().model(),
                s = t.mainSeries(),
                r = s.symbolInfo(),
                a = !s.isDWMProperty().value()
              if (s.symbolResolvingActive().value())
                return void this._setStateWithResize({
                  intervalAllowsSessionButton: a,
                })
              const n =
                ((null == r ? void 0 : r.subsessions) || []).filter(
                  (e) => !e.private,
                ).length > 1
              this._setStateWithResize({
                intervalAllowsSessionButton: a,
                symbolAllowsSessionButton: n,
              })
            }),
            (this._handleResize = () => {
              null === this._raf &&
                (this._raf = requestAnimationFrame(() => {
                  const e = this._layout,
                    t = (0, v.ensureNotNull)(this._toolbar),
                    s = (0, v.ensureNotNull)(this._rangeExpanded),
                    r =
                      ((n = ((e) => {
                        const t = {}
                        return (
                          Object.keys(e).forEach((s) => {
                            const r = e[s]
                            if (null !== r) {
                              const e = a.findDOMNode(r)
                              null !== e && (t[s] = e)
                            }
                          }),
                          t
                        )
                      })(this._seriesComponents)),
                      Object.keys(n)
                        .map((e) => ({ name: e, width: n[e].offsetWidth }))
                        .sort((e, t) => it[e.name] - it[t.name]))
                  var n
                  const i = t.offsetWidth,
                    o = r.reduce((e, t) => e + t.width, 0),
                    l = s.offsetWidth,
                    c =
                      !Boolean(s.textContent) || i - o - l <= 0
                        ? 'collapsed'
                        : 'expanded'
                  if (
                    (Object.assign(e, { dateRangeMode: c }), 'expanded' !== c)
                  ) {
                    const t =
                      i -
                      (0, v.ensureNotNull)(this._rangeCollapsed).offsetWidth -
                      0
                    let s = 0,
                      a = 0
                    for (const n of r)
                      (s += n.width),
                        n.name in nt
                          ? ((a += n.width), Object.assign(e, { [n.name]: !1 }))
                          : Object.assign(e, { [n.name]: t <= s })
                    t <= a && Object.assign(e, { dateRangeMode: 'hidden' })
                  } else
                    Object.assign(e, {
                      separator: !1,
                      timeZones: !1,
                      fullscreen: !1,
                      preventPhoneLayout: !1,
                      auto: !1,
                      logarithm: !1,
                      percentage: !1,
                      session: !1,
                      adj: !1,
                      settlementAsClose: !1,
                      backAdj: !1,
                    })
                  this._applyResizing(), (this._raf = null)
                }))
            }),
            (this._handleTimezoneButtonRef = (e) => {
              this._timezoneButtonRef = e
            }),
            (this._handleMeasure = () => {
              null !== this._toolbar && this.resizeUI()
            }),
            (this._handleFullscreenableChange = (e) => {
              this._setStateWithResize({ isFullscreenable: e })
            }),
            (this._handlePreventPhoneLayoutButtonVisibility = () => {
              0
            }),
            (this._handleToolbarRef = (e) => (this._toolbar = e)),
            (this._handleRangeCollapsedRef = (e) => (this._rangeCollapsed = e)),
            (this._handleRangeExpandedRef = (e) => {
              this._updateResizeObserver(this._rangeExpanded, e),
                (this._rangeExpanded = e)
            }),
            (this._handleTimeZonesRef = (e) => {
              this._updateResizeObserver(this._seriesComponents.timeZones, e),
                (this._seriesComponents.timeZones = e)
            }),
            (this._handleSessionsRef = (e) => {
              this._updateResizeObserver(this._seriesComponents.session, e),
                (this._seriesComponents.session = e)
            }),
            (this._handleSeparatorRef = (e) => {
              this._seriesComponents.separator = e
            }),
            (this._updateResizeObserver = (e, t) => {
              this._resizeObserver &&
                e !== t &&
                (e && this._resizeObserver.unobserve(e),
                t && this._resizeObserver.observe(t))
            }),
            (0, b.validateRegistry)(t, {
              onContentBoxChanged: i.any.isRequired,
              chartApiInstance: i.any.isRequired,
              chartWidget: i.any.isRequired,
              chartWidgetCollection: i.any.isRequired,
              resizerDetacher: i.any.isRequired,
            })
          const { resizerDetacher: l } = this.context
          ;(this.state = {
            isFullscreenable: l.fullscreenable.value(),
            isPreventPhoneLayoutButton: this._isPreventPhoneLayoutButton(),
          }),
            (this._resizeObserver = new ResizeObserver(this._handleMeasure))
        }
        componentDidMount() {
          const {
            onContentBoxChanged: e,
            resizerDetacher: t,
            chartWidgetCollection: s,
            chartWidget: r,
          } = this.context
          e.subscribe(this, this._handleResize),
            t.fullscreenable.subscribe(this._handleFullscreenableChange),
            r.withModel(null, () => {
              const e = r.model(),
                t = e.model()
              e
                .mainSeries()
                .isDWMProperty()
                .subscribe(this, this._updateButtonsVisibility),
                t
                  .symbolSourceResolvingActive()
                  .subscribe(this._updateButtonsVisibility),
                t
                  .symbolSourceCollectionChanged()
                  .subscribe(this, this._updateButtonsVisibility),
                this._updateButtonsVisibility()
            }),
            this.updateTimezonesButton(),
            this.resizeUI()
        }
        componentWillUnmount() {
          var e
          const {
            onContentBoxChanged: t,
            resizerDetacher: s,
            chartWidgetCollection: r,
            chartWidget: a,
          } = this.context
          t.unsubscribe(this, this._handleResize),
            s.fullscreenable.unsubscribe(this._handleFullscreenableChange),
            null === (e = this._resizeObserver) ||
              void 0 === e ||
              e.disconnect(),
            a.withModel(null, () => {
              const e = a.model(),
                t = e.model()
              e
                .mainSeries()
                .isDWMProperty()
                .unsubscribe(this, this._updateButtonsVisibility),
                e
                  .mainSeries()
                  .isBackAdjustmentForbiddenProperty()
                  .unsubscribe(this, this._updateButtonsVisibility),
                e
                  .mainSeries()
                  .isSettlementAsCloseForbiddenProperty()
                  .unsubscribe(this, this._updateButtonsVisibility),
                t
                  .symbolSourceCollectionChanged()
                  .unsubscribe(this, this._updateButtonsVisibility),
                t
                  .symbolSourceResolvingActive()
                  .unsubscribe(this._updateButtonsVisibility)
            }),
            null !== this._raf &&
              (cancelAnimationFrame(this._raf), (this._raf = null))
        }
        render() {
          const e = this._layout,
            {
              timeFramesWidgetEnabled: t,
              timeWidgetEnabled: s,
              percentageScaleButtonEnabled: a,
              logScaleButtonEnabled: n,
              autoScaleButtonEnabled: i,
              fullscreenButtonEnabled: l,
            } = this.props
          return r.createElement(
            we.Toolbar,
            {
              className: Ze.toolbar,
              onContextMenu: Pe.preventDefault,
              ref: this._handleToolbarRef,
            },
            t &&
              r.createElement(
                je.FragmentMap,
                null,
                r.createElement(
                  'div',
                  {
                    className: o(
                      Ze.dateRangeWrapper,
                      'collapsed' !== e.dateRangeMode && Ze.collapsed,
                    ),
                    ref: this._handleRangeCollapsedRef,
                  },
                  r.createElement(
                    'div',
                    { className: o(Ze.dateRangeCollapsed) },
                    r.createElement(J, {
                      goToDateButton: this.props.goToDateEnabled,
                      className: Ze.dateRange,
                    }),
                  ),
                ),
                r.createElement(
                  'div',
                  {
                    className: o(
                      Ze.dateRangeWrapper,
                      'expanded' !== e.dateRangeMode && Ze.collapsed,
                    ),
                    ref: this._handleRangeExpandedRef,
                  },
                  r.createElement(
                    'div',
                    { className: o(Ze.dateRangeExpanded) },
                    r.createElement(re, {
                      onSelectRange: this._trackRangeButtonClick,
                      className: Ze.dateRange,
                    }),
                    this.props.goToDateEnabled && r.createElement(Te, null),
                    this.props.goToDateEnabled && r.createElement(he, null),
                  ),
                ),
              ),
            r.createElement(
              'div',
              { className: Ze.seriesControlWrapper },
              s &&
                r.createElement(
                  'div',
                  {
                    className: o(Ze.inline, e.timeZones && Ze.collapsed),
                    ref: this._handleTimeZonesRef,
                  },
                  r.createElement(
                    'div',
                    {
                      className: Ze.inline,
                      onClick: this._trackTimezonesButtonClick,
                    },
                    r.createElement(Ce, {
                      className: Ze.item,
                      withMenu: this.props.timezoneMenuEnabled,
                      ref: this._handleTimezoneButtonRef,
                    }),
                  ),
                ),
              this.props.sessionIdButtonEnabled &&
                this.state.symbolAllowsSessionButton &&
                this.state.intervalAllowsSessionButton &&
                r.createElement(
                  'div',
                  {
                    className: o(Ze.inline, e.session && Ze.collapsed),
                    ref: this._handleSessionsRef,
                  },
                  r.createElement(
                    'div',
                    { className: Ze.inline },
                    r.createElement(Xe, {
                      className: Ze.item,
                      withMenu: this.props.sessionIdButtonEnabled,
                    }),
                  ),
                ),
              r.createElement(
                'div',
                {
                  ref: this._handleSeparatorRef,
                  className: o(Ze.inline, e.separator && Ze.collapsed),
                },
                r.createElement(Te, null),
              ),
              r.createElement(
                je.FragmentMap,
                { map: this._injector },
                !1,
                !1,
                !1,
                a &&
                  !c.enabled('fundamental_widget') &&
                  r.createElement(st, { className: Ze.item }),
                n && r.createElement(Ke, { className: Ze.item }),
                i && r.createElement(tt, { className: Ze.item }),
                l &&
                  this.state.isFullscreenable &&
                  r.createElement(at, {
                    className: Ze.item,
                    mobileChangeLayoutEnabled:
                      this.props.mobileChangeLayoutEnabled,
                  }),
                !1,
              ),
            ),
          )
        }
        updateTimezonesButton() {
          null !== this._timezoneButtonRef &&
            this._timezoneButtonRef.updateTimezonesButton()
        }
        resizeUI() {
          this._handleResize()
        }
        _trackRangeButtonClick(e) {
          0
        }
        _trackTimezonesButtonClick() {
          lt()
        }
        _setStateWithResize(e) {
          Object.assign(this._layout, dt),
            this._applyResizing(),
            this.setState(e, () => this._handleResize())
        }
        _applyResizing() {
          const { dateRangeMode: e, ...t } = this._layout
          this._rangeExpanded &&
            this._rangeExpanded.classList.toggle(
              Ze.collapsed,
              'expanded' !== e,
            ),
            this._rangeCollapsed &&
              this._rangeCollapsed.classList.toggle(
                Ze.collapsed,
                'collapsed' !== e,
              )
          let s = !1,
            r = !1
          Object.keys(t).forEach((e) => {
            const a = e
            if ('separator' !== a) {
              const e = this._seriesComponents[a],
                n = !0 === t[a]
              e &&
                ('timeZones' === a || 'session' === a
                  ? (s = s || !n)
                  : (r = r || !n),
                e.classList.toggle(Ze.collapsed, n))
            }
          })
          const a = this._seriesComponents.separator
          if (a) {
            const e = !s || !r || !0 === t.separator
            a.classList.toggle(Ze.collapsed, e)
          }
        }
        _isPreventPhoneLayoutButton() {
          return !1
        }
      }
      ht.contextType = ut
      const mt = {
        onContentBoxChanged: i.any,
        computeContentBox: i.any,
        chartWidget: i.any,
        chartApiInstance: i.any,
        chartWidgetCollection: i.any,
        resizerDetacher: i.any,
        availableTimeFrames: i.any,
      }
      class pt extends r.PureComponent {
        constructor(e) {
          super(e),
            (this._setActiveChart = (e) => {
              this._defineRegistry(e), this.setState({ chartWidget: e })
            })
          const t = this.props.chartWidgetCollection.activeChartWidget.value()
          ;(this.state = { chartWidget: t }), this._defineRegistry(t)
        }
        componentDidMount() {
          this.props.chartWidgetCollection.activeChartWidget.subscribe(
            this._setActiveChart,
          )
        }
        componentWillUnmount() {
          this.props.chartWidgetCollection.activeChartWidget.unsubscribe(
            this._setActiveChart,
          )
        }
        render() {
          const { chartWidget: e } = this.state
          if (!e) return null
          const { options: t } = this.props,
            s = {
              timeFramesWidgetEnabled: t.timeFramesWidgetEnabled,
              goToDateEnabled: t.timeFramesWidget.goToDateEnabled,
              timeWidgetEnabled: t.timeWidgetEnabled,
              timezoneMenuEnabled:
                t.timeWidget && t.timeWidget.timezoneMenuEnabled,
              sessionIdButtonEnabled: t.sessionIdButtonEnabled,
              backAdjustmentButtonEnabled: t.backAdjustmentButtonEnabled,
              settlementAsCloseButtonEnabled: t.settlementAsCloseButtonEnabled,
              adjustForDividendsButtonEnabled:
                t.adjustForDividendsButtonEnabled,
              logScaleButtonEnabled: t.logScaleButtonEnabled,
              percentageScaleButtonEnabled: t.percentageScaleButtonEnabled,
              autoScaleButtonEnabled: t.autoScaleButtonEnabled,
              fullscreenButtonEnabled: t.fullscreenButtonEnabled,
              mobileChangeLayoutEnabled: t.mobileChangeLayoutEnabled,
            }
          return r.createElement(
            b.RegistryProvider,
            { validation: mt, value: this._registry },
            r.createElement(ht, { key: e.id(), ...s }),
          )
        }
        _defineRegistry(e) {
          const {
              onContentBoxChanged: t,
              computeContentBox: s,
              chartApiInstance: r,
              chartWidgetCollection: a,
              options: { timeFramesWidgetEnabled: n, timeFramesWidget: i },
            } = this.props,
            o = n ? i.availableTimeFrames : void 0
          this._registry = {
            onContentBoxChanged: t,
            computeContentBox: s,
            chartWidget: e,
            availableTimeFrames: o,
            chartApiInstance: r,
            chartWidgetCollection: a,
            resizerDetacher: e.getResizerDetacher(),
          }
        }
      }
      class gt {
        constructor(e, t, s, n, i, o, l) {
          this._container = e
          const c = r.createElement(pt, {
            onContentBoxChanged: t,
            computeContentBox: s,
            chartWidgetCollection: n,
            chartApiInstance: i,
            chartWidgetOptions: o,
            options: l,
          })
          a.render(c, e), e.setAttribute('data-initialized', 'true')
        }
        destroy() {
          a.unmountComponentAtNode(this._container),
            this._container.removeAttribute('data-initialized')
        }
      }
    },
    95366: (e, t, s) => {
      s.d(t, {
        RegistryProvider: () => l,
        registryContextType: () => c,
        validateRegistry: () => o,
      })
      var r = s(50959),
        a = s(19036),
        n = s.n(a)
      const i = r.createContext({})
      function o(e, t) {
        n().checkPropTypes(t, e, 'context', 'RegistryContext')
      }
      function l(e) {
        const { validation: t, value: s } = e
        return o(s, t), r.createElement(i.Provider, { value: s }, e.children)
      }
      function c() {
        return i
      }
    },
    72026: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M15 8V3h-5V2h6v6h-1ZM3 10v5h5v1H2v-6h1Z"/></svg>'
    },
    51267: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M11 2v5h5v1h-6V2h1ZM7 16v-5H2v-1h6v6H7Z"/></svg>'
    },
    92574: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M11 4h-1v2H7.5A2.5 2.5 0 0 0 5 8.5V13h1v-2h16v8.5c0 .83-.67 1.5-1.5 1.5H14v1h6.5a2.5 2.5 0 0 0 2.5-2.5v-11A2.5 2.5 0 0 0 20.5 6H18V4h-1v2h-6V4Zm6 4V7h-6v1h-1V7H7.5C6.67 7 6 7.67 6 8.5V10h16V8.5c0-.83-.67-1.5-1.5-1.5H18v1h-1Zm-5.15 10.15-3.5-3.5-.7.7L10.29 18H4v1h6.3l-2.65 2.65.7.7 3.5-3.5.36-.35-.36-.35Z"/></svg>'
    },
    79978: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M8 5l3.5 3.5L8 12"/></svg>'
    },
    21868: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"><g fill="none" stroke="currentColor"><circle cx="3.5" cy="3.5" r="2"/><circle cx="10.5" cy="10.5" r="2"/><path stroke-linecap="square" d="M9.5 1.5l-5 11"/></g></svg>'
    },
    39750: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M7 15l5 5L23 9"/></svg>'
    },
    69311: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M9.7 9l4.65-4.65-.7-.7L9 8.29 4.35 3.65l-.7.7L8.29 9l-4.64 4.65.7.7L9 9.71l4.65 4.64.7-.7L9.71 9z"/></svg>'
    },
    90752: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="M5.5 13v-2.5m8.5 11h6.5a2 2 0 0 0 2-2v-9m-17 0v-2c0-1.1.9-2 2-2h13a2 2 0 0 1 2 2v2m-17 0h17"/><path fill="currentColor" d="M10 4h1v4h-1V4zM17 4h1v4h-1V4z"/><path stroke="currentColor" d="M4 18.5h7.5m0 0L8 22m3.5-3.5L8 15"/></svg>'
    },
    25931: (e, t, s) => {
      s.d(t, { nanoid: () => r })
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
    25988: (e) => {
      e.exports = {
        ar: ['تعديل'],
        ca_ES: ['aj'],
        cs: ['adj'],
        de: ['Anp.'],
        el: ['adj'],
        en: 'ADJ',
        es: 'ADJ',
        fa: ['adj'],
        fr: 'ADJ',
        he_IL: ['התאם'],
        hu_HU: ['adj'],
        id_ID: ['penyesuaian'],
        it: ['adg'],
        ja: ['配当調整'],
        ko: 'ADJ',
        ms_MY: ['laras'],
        nl_NL: ['adj'],
        pl: ['adj'],
        pt: ['AJUSTES'],
        ro: ['adj'],
        ru: ['коррект.'],
        sv: ['adj'],
        th: ['adj'],
        tr: 'ADJ',
        vi: ['đ.chỉnh'],
        zh: 'ADJ',
        zh_TW: 'ADJ',
      }
    },
    24717: (e) => {
      e.exports = {
        ar: ['b-adj'],
        ca_ES: ['b-adj'],
        cs: 'B-ADJ',
        de: ['b-adj'],
        el: 'B-ADJ',
        en: 'B-ADJ',
        es: 'B-ADJ',
        fa: 'B-ADJ',
        fr: 'B-ADJ',
        he_IL: ['b-adj'],
        hu_HU: 'B-ADJ',
        id_ID: ['b-adj'],
        it: ['b-adg'],
        ja: ['限月調整'],
        ko: 'B-ADJ',
        ms_MY: ['b-adj'],
        nl_NL: 'B-ADJ',
        pl: ['b-adj'],
        pt: 'B-ADJ',
        ro: 'B-ADJ',
        ru: ['корр'],
        sv: ['b-adj'],
        th: ['b-adj'],
        tr: 'B-ADJ',
        vi: ['b-adj'],
        zh: 'B-ADJ',
        zh_TW: 'B-ADJ',
      }
    },
    11987: (e) => {
      e.exports = {
        ar: ['ضبط'],
        ca_ES: ['set'],
        cs: 'SET',
        de: ['setzen'],
        el: 'SET',
        en: 'SET',
        es: 'SET',
        fa: 'SET',
        fr: 'SET',
        he_IL: ['הגדר'],
        hu_HU: 'SET',
        id_ID: 'SET',
        it: ['set'],
        ja: ['清算価格'],
        ko: 'SET',
        ms_MY: ['set'],
        nl_NL: 'SET',
        pl: ['ustaw'],
        pt: ['DEFINIR'],
        ro: 'SET',
        ru: ['расч.цена'],
        sv: ['ställ in'],
        th: ['set'],
        tr: ['AYARLA'],
        vi: ['set'],
        zh: 'SET',
        zh_TW: 'SET',
      }
    },
    99247: (e) => {
      e.exports = {
        ar: ['تلقائي'],
        ca_ES: 'auto',
        cs: ['automatické'],
        de: 'auto',
        el: ['αυτοματο'],
        en: 'auto',
        es: 'auto',
        fa: ['خودکار'],
        fr: ['automatique'],
        he_IL: ['אוטומטי'],
        hu_HU: 'auto',
        id_ID: 'auto',
        it: 'auto',
        ja: ['自動'],
        ko: ['자동'],
        ms_MY: 'auto',
        nl_NL: 'auto',
        pl: 'auto',
        pt: 'auto',
        ro: 'auto',
        ru: ['авто'],
        sv: 'auto',
        th: ['อัตโนมัติ'],
        tr: ['otomatik'],
        vi: ['tự động'],
        zh: ['自动'],
        zh_TW: ['自動'],
      }
    },
    885: (e) => {
      e.exports = {
        ar: ['لوغاريتمي'],
        ca_ES: 'log',
        cs: 'log',
        de: 'log',
        el: 'log',
        en: 'log',
        es: 'log',
        fa: 'log',
        fr: 'log',
        he_IL: ['לוג'],
        hu_HU: 'log',
        id_ID: 'log',
        it: 'log',
        ja: ['ログスケール'],
        ko: ['로그'],
        ms_MY: 'log',
        nl_NL: 'log',
        pl: 'log',
        pt: 'log',
        ro: 'log',
        ru: ['лог'],
        sv: ['logg'],
        th: ['ล็อก'],
        tr: 'log',
        vi: 'log',
        zh: 'log',
        zh_TW: 'log',
      }
    },
    74944: (e) => {
      e.exports = {
        ar: ['كافة البيانات'],
        ca_ES: 'All data',
        cs: 'All data',
        de: ['Alle Daten'],
        el: 'All data',
        en: 'All data',
        es: ['Todos los datos'],
        fa: 'All data',
        fr: ['Toutes les données'],
        he_IL: ['כל הנתונים'],
        hu_HU: 'All data',
        id_ID: ['Seluruh data'],
        it: ['Tutti i dati'],
        ja: ['すべてのデータ'],
        ko: ['모든 데이터'],
        ms_MY: ['Semua data'],
        nl_NL: 'All data',
        pl: ['Wszystkie dane'],
        pt: ['Todos os dados'],
        ro: 'All data',
        ru: ['Все данные'],
        sv: 'All data',
        th: 'All data',
        tr: ['Tüm veri'],
        vi: ['Tất cả dữ liệu'],
        zh: ['所有数据'],
        zh_TW: ['所有數據'],
      }
    },
    87556: (e) => {
      e.exports = {
        ar: ['من عام إلى يوم'],
        ca_ES: 'Year to day',
        cs: 'Year to day',
        de: ['Jahr zu Tag'],
        el: 'Year to day',
        en: 'Year to day',
        es: ['Año hasta la fecha'],
        fa: 'Year to day',
        fr: ['Année à ce jour'],
        he_IL: ['שנה ליום'],
        hu_HU: 'Year to day',
        id_ID: ['Tahun ke hari'],
        it: ['Anno in corso'],
        ja: ['年初来'],
        ko: ['연도별'],
        ms_MY: ['Tahun ke hari'],
        nl_NL: 'Year to day',
        pl: ['Rok do danego dnia'],
        pt: ['De ano para dia'],
        ro: 'Year to day',
        ru: ['Данные с начала года'],
        sv: 'Year to day',
        th: 'Year to day',
        tr: ['Güncel yıl'],
        vi: ['Từ đầu năm đến nay'],
        zh: ['年初至今'],
        zh_TW: ['年初至今'],
      }
    },
    29505: (e) => {
      e.exports = {
        ar: ['{timePeriod} في {timeInterval}'],
        ca_ES: '{timePeriod} in {timeInterval}',
        cs: '{timePeriod} in {timeInterval}',
        de: '{timePeriod} in {timeInterval}',
        el: '{timePeriod} in {timeInterval}',
        en: '{timePeriod} in {timeInterval}',
        es: ['{timePeriod} en {timeInterval}'],
        fa: '{timePeriod} in {timeInterval}',
        fr: ['{timePeriod} dans {timeInterval}'],
        he_IL: ['‎{timePeriod}‎ ב-‎{timeInterval}‎'],
        hu_HU: '{timePeriod} in {timeInterval}',
        id_ID: ['{timePeriod} pada {timeInterval}'],
        it: ['{timeInterval} a {timePeriod}'],
        ja: ['{timeInterval} で {timePeriod}'],
        ko: ['{timeInterval} 의 {timePeriod}₩'],
        ms_MY: ['{timePeriod} dalam {timeInterval}'],
        nl_NL: '{timePeriod} in {timeInterval}',
        pl: ['{timePeriod} w {timeInterval}'],
        pt: ['{timePeriod} em {timeInterval}'],
        ro: '{timePeriod} in {timeInterval}',
        ru: ['{timePeriod} в {timeInterval}'],
        sv: '{timePeriod} in {timeInterval}',
        th: '{timePeriod} in {timeInterval}',
        tr: ['{timeInterval} içinde {timePeriod}'],
        vi: ['{timePeriod} trong {timeInterval}'],
        zh: ['{timeInterval}内的{timePeriod}'],
        zh_TW: ['{timeInterval}內的{timePeriod}'],
      }
    },
    9994: (e) => {
      e.exports = {
        ar: ['تعديل البيانات لأرباح الأسهم'],
        ca_ES: ['Ajusta dades dels dividends'],
        cs: 'Adjust data for dividends',
        de: ['Daten für Dividenden anpassen'],
        el: 'Adjust data for dividends',
        en: 'Adjust data for dividends',
        es: ['Ajustar datos de los dividendos'],
        fa: 'Adjust data for dividends',
        fr: ['Ajuster les données pour les dividendes'],
        he_IL: ['התאם נתונים לדיבידנדים'],
        hu_HU: 'Adjust data for dividends',
        id_ID: ['Sesuaikan data untuk dividen'],
        it: ['Adegua i dati a seconda dei dividendi'],
        ja: ['配当でデータを調整'],
        ko: ['배당에 따른 데이터 조정'],
        ms_MY: ['Laras data untuk dividen'],
        nl_NL: 'Adjust data for dividends',
        pl: ['Dopasuj dane według dywidend'],
        pt: ['Ajustar dados de dividendos'],
        ro: 'Adjust data for dividends',
        ru: ['Корректировать данные на дивиденды'],
        sv: ['Justera data för utdelning'],
        th: ['ปรับเปลี่ยนข้อมูลเนื่องจากเงินปันผล'],
        tr: ['Verileri temettülere göre düzelt'],
        vi: ['Điều chỉnh dữ liệu cho Cổ tức'],
        zh: ['调整股息数据'],
        zh_TW: ['調整股息數據'],
      }
    },
    10989: (e) => {
      e.exports = {
        ar: ['ضبط لتغييرات العقود'],
        ca_ES: ['Ajusta els canvis dels contractes'],
        cs: 'Adjust for contract changes',
        de: ['Veränderungen der Kontraktgrößen und Verfalltage'],
        el: 'Adjust for contract changes',
        en: 'Adjust for contract changes',
        es: ['Ajustar para cambios de contrato'],
        fa: 'Adjust for contract changes',
        fr: ['Ajustement pour les changements de contrat'],
        he_IL: ['התאם לשינויים בחוזה'],
        hu_HU: 'Adjust for contract changes',
        id_ID: ['Penyesuaian untuk perubahan kontrak'],
        it: ['Incorpora variazioni dovute al cambio di contratto'],
        ja: ['限月の切り替えの調整'],
        ko: ['컨트랙트 변경 조절'],
        ms_MY: ['Laraskan untuk perubahan kontrak'],
        nl_NL: 'Adjust for contract changes',
        pl: ['Dostosuj do zmian w kontrakcie'],
        pt: ['Ajustes para mudanças no contrato'],
        ro: 'Adjust for contract changes',
        ru: ['Корректировать с учётом изменений контрактов'],
        sv: ['Förändringar i avtalens storlek och datum för upphörande'],
        th: ['ปรับตามการเปลี่ยนแปลงสัญญา'],
        tr: ['Sözleşme değişiklikleri için ayarlama'],
        vi: ['Điều chỉnh để thay đổi hợp đồng'],
        zh: ['根据合约变更调整'],
        zh_TW: ['調整合約變更'],
      }
    },
    369: (e) => {
      e.exports = {
        ar: ['الذهاب إلى'],
        ca_ES: ['Anar a'],
        cs: 'Go to',
        de: ['Gehe zu'],
        el: 'Go to',
        en: 'Go to',
        es: ['Ir a'],
        fa: ['برو به'],
        fr: ['Aller à'],
        he_IL: ['עבור ל'],
        hu_HU: ['Ugrás ide:'],
        id_ID: ['Menuju ke'],
        it: ['Vai a'],
        ja: ['移動'],
        ko: ['가기'],
        ms_MY: ['Pergi ke'],
        nl_NL: 'Go to',
        pl: ['Idź do...'],
        pt: ['Ir para'],
        ro: 'Go to',
        ru: ['Перейти к дате'],
        sv: ['Gå till'],
        th: ['ไปที่'],
        tr: ['Tarihe git'],
        vi: ['Đến'],
        zh: ['前往到'],
        zh_TW: ['前往到'],
      }
    },
    41421: (e) => {
      e.exports = {
        ar: [
          'ساعات التداول المُمددة متاحة فقط على النطاقات الصغرى خلال اليوم للرسوم البيانية',
        ],
        ca_ES: [
          "L'horari ampliat només està disponible per a gràfics intradia",
        ],
        cs: 'Extended Hours is available only for intraday charts',
        de: [
          'Verlängerte Handelszeiten sind nur für Intraday-Charts verfügbar',
        ],
        el: 'Extended Hours is available only for intraday charts',
        en: 'Extended Hours is available only for intraday charts',
        es: [
          'El horario ampliado solo se encuentra disponible para gráficos intradía',
        ],
        fa: 'Extended Hours is available only for intraday charts',
        fr: [
          "L'option Horaires étendus est disponible uniquement pour les graphiques intrajournaliers",
        ],
        he_IL: ['שעות מורחבות זמינות רק עבור גרפים תוך-יומיים'],
        hu_HU: 'Extended Hours is available only for intraday charts',
        id_ID: ['Jam Perpanjangan hanya tersedia bagi chart intrahari'],
        it: [
          'Gli orari di negoziazione estesi sono disponibili solo per i grafici intraday',
        ],
        ja: ['時間外取引の機能は、イントラデイのチャートでのみ利用できます'],
        ko: ['확장시간은 인트라데이 차트에서만 가능합니다'],
        ms_MY: ['Waktu Dilanjutkan hanya tersedia untuk carta intra hari'],
        nl_NL: 'Extended Hours is available only for intraday charts',
        pl: ['Sesja rozszerzona dostępna jest wyłącznie dla wykresów intraday'],
        pt: [
          'O Horário Estendido está disponível apenas para gráficos intradiário',
        ],
        ro: 'Extended Hours is available only for intraday charts',
        ru: [
          'Функция расширенных торговых часов доступна только для внутридневных графиков',
        ],
        sv: ['Utökade timmar är endast tillgänglig för intradagsdiagram'],
        th: ['ชั่วโมงที่เพิ่มเติมขึ้นมาใช้ได้สำหรับกราฟแบบระหว่างวันเท่านั้น'],
        tr: ['Uzatılmış saatler sadece gün içi grafiklerde kullanılabilir'],
        vi: [
          'Tính năng Thời gian Giao dịch Ngoài giờ chỉ có sẵn cho các biểu đồ trong ngày',
        ],
        zh: ['延长时段仅适用于日内图表'],
        zh_TW: ['延長時段僅適用於日內圖表'],
      }
    },
    1217: (e) => {
      e.exports = {
        ar: ['يتم ضبط بيانات الرمز الرئيسي لتوزيعات الأرباح فقط'],
        ca_ES: ["Les dades del símbol principal s'ajusten només als dividends"],
        cs: 'Main symbol data is adjusted for dividends only',
        de: [
          'Die Daten des Hauptsymbols sind nur für die Dividenden angepasst',
        ],
        el: 'Main symbol data is adjusted for dividends only',
        en: 'Main symbol data is adjusted for dividends only',
        es: [
          'Los datos del símbolo principal se ajustan solo a los dividendos',
        ],
        fa: 'Main symbol data is adjusted for dividends only',
        fr: [
          'Les données du symbole principal sont ajustées pour les dividendes uniquement',
        ],
        he_IL: ['הנתונים של הסימול הראשי מותאמים לדיבידנדים בלבד'],
        hu_HU: 'Main symbol data is adjusted for dividends only',
        id_ID: ['Data simbol utama disesuaikan hanya untuk deviden'],
        it: [
          'I dati del simbolo principale sono adeguati solo per lo stacco dei dividendi',
        ],
        ja: ['メインシンボルのデータは配当のみで調整されています'],
        ko: ['주요 심볼 데이터는 배당금에 대해서만 조정됩니다.'],
        ms_MY: ['Data utama simbol adalah diselaraskan untuk dividend sahaja'],
        nl_NL: 'Main symbol data is adjusted for dividends only',
        pl: ['Dane głównego symbolu są dostosowywane tylko do dywidend'],
        pt: ['Os dados do símbolo são ajustados apenas para dividendos'],
        ro: 'Main symbol data is adjusted for dividends only',
        ru: [
          'Данные по основному инструменту корректируются только для дивидендов',
        ],
        sv: ['Uppgifterna om huvudsymbolen justeras endast för utdelningar.'],
        th: ['ข้อมูลสัญลักษณ์หลักถูกปรับเป็นเงินปันผลเท่านั้น'],
        tr: ['Ana sembol verileri yalnızca temettüler için ayarlanır'],
        vi: ['Dữ liệu của mã chính chỉ được điều chỉnh cho cổ tức'],
        zh: ['主要商品数据仅针对股息进行调整'],
        zh_TW: ['主要商品數據僅針對股息進行調整'],
      }
    },
    27662: (e) => {
      e.exports = {
        ar: ['يتم ضبط بيانات الرمز الرئيسي للتقسيمات فقط'],
        ca_ES: ["Les dades del símbol principal s'ajusten només als splits"],
        cs: 'Main symbol data is adjusted for splits only',
        de: ['Die Daten des Hauptsymbols werden nur für Splits angepasst'],
        el: 'Main symbol data is adjusted for splits only',
        en: 'Main symbol data is adjusted for splits only',
        es: ['Los datos del símbolo principal se ajustan solo a los splits'],
        fa: 'Main symbol data is adjusted for splits only',
        fr: [
          'Les données du symbole principal sont ajustées pour les fractions uniquement',
        ],
        he_IL: ['הנתונים של הסימול הראשי מותאמים לספליטים בלבד'],
        hu_HU: 'Main symbol data is adjusted for splits only',
        id_ID: ['Data simbol utama disesuaikan hanya untuk pecahan.'],
        it: [
          'I dati del simbolo principale sono adeguati solo per i frazionamenti',
        ],
        ja: ['メインシンボルのデータは株式分割でのみ調整されています'],
        ko: ['메인 심볼 데이터는 스플릿에 대해서만 조정됩니다'],
        ms_MY: [
          'Data utama simbol adalah diselaraskan untuk pembahagian sahaja',
        ],
        nl_NL: 'Main symbol data is adjusted for splits only',
        pl: ['Dane głównego symbolu są dostosowywane tylko do podziałów'],
        pt: [
          'Os dados do símbolo principal são ajustados apenas para desdobramentos',
        ],
        ro: 'Main symbol data is adjusted for splits only',
        ru: [
          'Данные по основному инструменту корректируются только для сплитов',
        ],
        sv: ['Uppgifter om huvudsymbolen justeras endast för splits.'],
        th: ['ข้อมูลสัญลักษณ์หลักถูกปรับสำหรับการแยกเท่านั้น'],
        tr: ['Ana sembol verileri yalnızca bölmeler için ayarlanır'],
        vi: ['Dữ liệu của mã chính chỉ được điều chỉnh để tách'],
        zh: ['主要商品数据仅针对拆分进行调整'],
        zh_TW: ['主要商品數據僅針對拆分進行調整'],
      }
    },
    44794: (e) => {
      e.exports = {
        ar: ['الجلسات'],
        ca_ES: 'Sessions',
        cs: 'Sessions',
        de: 'Sessions',
        el: 'Sessions',
        en: 'Sessions',
        es: ['Sesiones'],
        fa: 'Sessions',
        fr: 'Sessions',
        he_IL: ['סשנים'],
        hu_HU: 'Sessions',
        id_ID: ['Sesi'],
        it: ['Sessioni'],
        ja: ['セッション'],
        ko: ['세션'],
        ms_MY: ['Sesi-sesi'],
        nl_NL: 'Sessions',
        pl: ['Sesje'],
        pt: ['Sessões'],
        ro: 'Sessions',
        ru: ['Сессии'],
        sv: ['Sessioner'],
        th: ['เซสชั่น'],
        tr: ['Oturum'],
        vi: ['Phiên'],
        zh: ['交易时段'],
        zh_TW: ['交易時段'],
      }
    },
    98948: (e) => {
      e.exports = {
        ar: ['تبديل تكبير الرسم البياني'],
        ca_ES: ['Alterna maximitzar gràfic'],
        cs: 'Toggle Maximize Chart',
        de: ['Auf maximierten Chart umschalten'],
        el: 'Toggle Maximize Chart',
        en: 'Toggle Maximize Chart',
        es: ['Alternar maximizar gráfico'],
        fa: 'Toggle Maximize Chart',
        fr: ['Agrandir le graphique'],
        he_IL: ['החלף לגרף מקסימלי'],
        hu_HU: ['Maximális Chat Kiterjesztése'],
        id_ID: ['Toggle Memperbesar Chart'],
        it: ['Espandi/riduci grafico'],
        ja: ['チャート最大化切り替え'],
        ko: ['차트최대화토글'],
        ms_MY: ['Carta Memaksimumkan Togol'],
        nl_NL: 'Toggle Maximize Chart',
        pl: ['Maksymalizuj wykres'],
        pt: ['Alternar para gráfico maximizado'],
        ro: 'Toggle Maximize Chart',
        ru: ['Развернуть/свернуть график'],
        sv: ['Slå på/av maximering av diagram'],
        th: ['สลับเป็นชาร์ตขนาดใหญ่ที่สุด'],
        tr: ['Grafik Maksimize Değiştir'],
        vi: ['Chuyển đổi Tối đa hoá Biểu đồ'],
        zh: ['切换为最大化图表'],
        zh_TW: ['切換最大化圖表'],
      }
    },
    60879: (e) => {
      e.exports = {
        ar: ['نطاق قياس تلقائي'],
        ca_ES: ["Alterna l'escala automàtica"],
        cs: ['Přepnout na Auto Stupnici'],
        de: ['Auf automatische Skalierung umschalten'],
        el: ['Αυτόματη κλίμακα'],
        en: 'Toggle Auto Scale',
        es: ['Alternar escala automática'],
        fa: 'Toggle Auto Scale',
        fr: ["Mise à l'échelle automatique"],
        he_IL: ['הפעל/כבה קנה מידה אוטומטיות'],
        hu_HU: ['Váltás Automata Méretezés'],
        id_ID: ['Toggle Skala Otomatis'],
        it: ['Seleziona/deseleziona scala automatica'],
        ja: ['自動スケール切り替え'],
        ko: ['자동눈금토글'],
        ms_MY: ['Skala Auto Togol'],
        nl_NL: ['Schakel autoschaal'],
        pl: ['Włącz skalę automatyczną'],
        pt: ['Alternar Para Escala Automática'],
        ro: 'Toggle Auto Scale',
        ru: ['Автоматический масштаб вкл/выкл'],
        sv: ['Växla skala automatiskt'],
        th: ['สลับเป็นสเกลอัตโนมัติ'],
        tr: ['Otomatik Ölçeklendirmeyi Aç/Kapat'],
        vi: ['Chuyển đổi Tỷ lệ tự động'],
        zh: ['切换为自动坐标'],
        zh_TW: ['切換為自動刻度'],
      }
    },
    21329: (e) => {
      e.exports = {
        ar: ['نطاق قياس لوغاريتمي'],
        ca_ES: ["Alterna l'escala logarítmica"],
        cs: ['Přepnout Log Měřítko'],
        de: ['Auf logarithmische Skalierung umschalten'],
        el: ['Λογαριθμική κλίμακα'],
        en: 'Toggle Log Scale',
        es: ['Alternar escala logarítmica'],
        fa: 'Toggle Log Scale',
        fr: ["Mise à l'échelle logarithmique"],
        he_IL: ['הפעל/כבה סקאלה לוגריתמית'],
        hu_HU: ['Váltás Log Skála'],
        id_ID: ['Toggle Skala Log'],
        it: ['Seleziona/Deseleziona scala logaritmica'],
        ja: ['ログスケール切り替え'],
        ko: ['로그눈금토글'],
        ms_MY: ['Skala Log Togol'],
        nl_NL: ['Schakel log schaal'],
        pl: ['Przełącz na skalę logarytmiczną'],
        pt: ['Alternar Para Escala Logarítmica'],
        ro: 'Toggle Log Scale',
        ru: ['Логарифмическая шкала вкл/выкл'],
        sv: ['Slå på/av Log-skala'],
        th: ['สลับเป็นมาตราแบบล๊อก'],
        tr: ['Logaritmik Ölçeklendirmeyi Aç/Kapat'],
        vi: ['Chuyển đổi Quy mô Đăng nhập'],
        zh: ['切换为对数坐标'],
        zh_TW: ['切換為對數刻度'],
      }
    },
    43737: (e) => {
      e.exports = {
        ar: ['نطاق قياس النسبة المئوية'],
        ca_ES: ['Altarna percentatge'],
        cs: ['Přepnout na Procenta'],
        de: ['Auf Prozent umschalten'],
        el: ['Ποσοστιαία κλίμακα'],
        en: 'Toggle Percentage',
        es: ['Alternar porcentaje'],
        fa: 'Toggle Percentage',
        fr: ['Echelle en pourcentage'],
        he_IL: ['החלף אחוזים'],
        hu_HU: ['Váltás Százalék'],
        id_ID: ['Toggle Persentase'],
        it: ['Seleziona/Deseleziona percentuale'],
        ja: ['％スケール切り替え'],
        ko: ['백분율토글'],
        ms_MY: ['Peratusan Togol'],
        nl_NL: ['Schakel percentage'],
        pl: ['Włącz skalę procentową'],
        pt: ['Alternar Para Percentagem'],
        ro: 'Toggle Percentage',
        ru: ['Процентная шкала вкл/выкл'],
        sv: ['Slå på/av procentsats'],
        th: ['สลับเป็นเปอร์เซ็นต์'],
        tr: ['Yüzde Olarak Değiştir'],
        vi: ['Chuyển đồi Phần trăm'],
        zh: ['切换为百分比坐标'],
        zh_TW: ['切換為百分比'],
      }
    },
    87492: (e) => {
      e.exports = {
        ar: ['توقيت'],
        ca_ES: ['Zona horària'],
        cs: ['Časové pásmo'],
        de: ['Zeitzone'],
        el: 'Timezone',
        en: 'Timezone',
        es: ['Zona horaria'],
        fa: 'Timezone',
        fr: ['Fuseau horaire'],
        he_IL: ['אזור זמן'],
        hu_HU: ['Időzóna'],
        id_ID: ['Zona waktu'],
        it: ['Fuso orario'],
        ja: ['タイムゾーン'],
        ko: ['타임존'],
        ms_MY: ['Zon Waktu'],
        nl_NL: 'Timezone',
        pl: ['Strefa czasowa'],
        pt: ['Fuso Horário'],
        ro: 'Timezone',
        ru: ['Часовой пояс'],
        sv: ['Tidszon'],
        th: ['เขตเวลา'],
        tr: ['Saat Dilimi'],
        vi: ['Múi giờ'],
        zh: ['时区'],
        zh_TW: ['時區'],
      }
    },
    23500: (e) => {
      e.exports = {
        ar: ['استخدم التسوية في أقرب وقت على الفاصل الزمني اليومي'],
        ca_ES: ['Fer servir la liquidació com a tancament en intervals diaris'],
        cs: 'Use settlement as close on daily interval',
        de: ['Settlement als Schlusskurs im Tagesintervall verwenden'],
        el: 'Use settlement as close on daily interval',
        en: 'Use settlement as close on daily interval',
        es: ['Utilizar la liquidación como cierre en intervalos diarios'],
        fa: 'Use settlement as close on daily interval',
        fr: ["Utiliser le règlement comme proche de l'intervalle quotidien"],
        he_IL: ['השתמש בסליקה כסגירה באינטרוול יומי'],
        hu_HU: 'Use settlement as close on daily interval',
        id_ID: ['Gunakan penyelesaian sebagai penutupan pada interval harian'],
        it: ['Usa il settlement come chiusura nel giornaliero'],
        ja: ['日足で清算価格を終値として利用'],
        ko: ['데일리 클로즈를 청산가로 쓰기'],
        ms_MY: ['Gunakan penyelesaian sebagai penutup pada selang masa harian'],
        nl_NL: 'Use settlement as close on daily interval',
        pl: ['Użyj ceny rozliczenia jako dziennej ceny zamknięcia'],
        pt: ['Usar a liquidação como fechamento no intervalo diário'],
        ro: 'Use settlement as close on daily interval',
        ru: [
          'Использовать расчетную цену для цены закрытия на дневном интервале',
        ],
        sv: ['Använd avräkning så nära daglig intervallängd'],
        th: ['ใช้การชำระราคาที่ใกล้เคียงกันในแต่ละวัน'],
        tr: ['Ödemeyi günlük aralıklarla yakın olarak kullanma'],
        vi: ['Sử dụng giải quyết càng gần vào khoảng thời gian hàng ngày'],
        zh: ['使用结算价作为日图收盘价'],
        zh_TW: ['使用結算價做為日圖的收盤價'],
      }
    },
    8877: (e) => {
      e.exports = {
        ar: 'ext',
        ca_ES: 'ext',
        cs: 'ext',
        de: ['verl.'],
        el: 'ext',
        en: 'ext',
        es: 'ext',
        fa: 'ext',
        fr: 'ext',
        he_IL: ['הרחב'],
        hu_HU: 'ext',
        id_ID: ['perp'],
        it: ['est'],
        ja: ['時間外'],
        ko: ['확장'],
        ms_MY: ['dilanjutkan'],
        nl_NL: 'ext',
        pl: ['rozsz'],
        pt: ['est'],
        ro: 'ext',
        ru: ['расш'],
        sv: ['utökad'],
        th: ['ต่อ'],
        tr: ['ek'],
        vi: ['mở rộng'],
        zh: ['延时'],
        zh_TW: ['延時'],
      }
    },
    42908: (e) => {
      e.exports = {
        ar: [
          '{str} يوم',
          '{str} يوم',
          '{str} يوم',
          '{str} يوم',
          '{str} يوم',
          '{str} يوم',
        ],
        ca_ES: '{str} day',
        cs: '{str} day',
        de: ['{str} Tag', '{str} Tage'],
        el: '{str} day',
        en: '{str} day',
        es: ['{str} día', '{str} días'],
        fa: ['{str} days'],
        fr: ['{str} jour', '{str} jours'],
        he_IL: ['{str} יום', '{str} ימים', '{str} ימים', '{str} ימים'],
        hu_HU: ['{str} days'],
        id_ID: ['{str} hari'],
        it: ['{str} giorno', '{str} giorni'],
        ja: ['{str}日'],
        ko: ['{str} 일'],
        ms_MY: ['{str} hari'],
        nl_NL: '{str} day',
        pl: ['{str} dzień', '{str} dni', '{str} dni', '{str} dni'],
        pt: ['{str} dia', '{str} dias'],
        ro: '{str} day',
        ru: ['{str} день', '{str} дня', '{str} дней', '{str} дней'],
        sv: '{str} day',
        th: ['{str} days'],
        tr: ['{str} gün', '{str} gün'],
        vi: ['{str} ngày'],
        zh: ['{str}天'],
        zh_TW: ['{str}天'],
      }
    },
    74262: (e) => {
      e.exports = {
        ar: [
          '‎‎{str}‎ يوم',
          '‎‎{str}‎ يوم',
          '‎‎{str}‎ يوم',
          '‎‎{str}‎ يوم',
          '‎‎{str}‎ يوم',
          '‎‎{str}‎ يوم',
        ],
        ca_ES: '{str} day',
        cs: '{str} day',
        de: ['{str} Tag', '{str} Tage'],
        el: '{str} day',
        en: '{str} day',
        es: ['{str} día', '{str} días'],
        fa: ['{str} days'],
        fr: ['{str} jour', '{str} jours'],
        he_IL: ['יום ‎{str}‎', '‎{str}‎ ימים', '‎{str}‎ ימים', '‎{str}‎ ימים'],
        hu_HU: ['{str} days'],
        id_ID: ['{str} hari'],
        it: ['{str} giorno', '{str} giorni'],
        ja: ['{str}日'],
        ko: ['{str} 날'],
        ms_MY: ['{str} hari'],
        nl_NL: '{str} day',
        pl: ['{str} dzień', '{str} dni', '{str} dni', '{str} dni'],
        pt: ['{str} dia', '{str} dias'],
        ro: '{str} day',
        ru: ['{str} день', '{str} дня', '{str} дней', '{str} дней'],
        sv: ['{str} dag', '{str} dagar'],
        th: ['{str} days'],
        tr: ['{str} gün', '{str} gün'],
        vi: ['{str} ngày'],
        zh: ['{str}天'],
        zh_TW: ['{str}天'],
      }
    },
    81693: (e) => {
      e.exports = {
        ar: [
          'فترات {str} يوم',
          'فترات {str} يوم',
          'فترات {str} يوم',
          'فترات {str} يوم',
          'فترات {str} يوم',
          'فترات {str} يوم',
        ],
        ca_ES: '{str} day intervals',
        cs: '{str} day intervals',
        de: ['{str}-tägige Intervalle', '{str}-tägige Intervalle'],
        el: '{str} day intervals',
        en: '{str} day intervals',
        es: ['intervalos de {str} día', 'intervalos de {str} días'],
        fa: ['{str} days intervals'],
        fr: ['{str} intervalles de jour', '{str} intervalles de jours'],
        he_IL: [
          '{str} אינטרוולי יום',
          '{str} אינטרוולי ימים',
          '{str} אינטרוולי ימים',
          '{str} אינטרוולי ימים',
        ],
        hu_HU: ['{str} days intervals'],
        id_ID: ['{str} interval hari'],
        it: ['Timeframe {str} giorno', 'Timeframe {str} giorni'],
        ja: ['{str}日足'],
        ko: ['{str} 날 인터벌'],
        ms_MY: ['{str} selang hari'],
        nl_NL: '{str} day intervals',
        pl: [
          '{str} dniowe interwały',
          '{str} dniowe interwały',
          '{str} dniowe interwały',
          '{str} dniowe interwały',
        ],
        pt: ['intervalos de {str} dia', 'intervalos de {str} dias'],
        ro: '{str} day intervals',
        ru: [
          '{str}-дневных интервалах',
          '{str}-дневных интервалах',
          '{str}-дневных интервалах',
          '{str}-дневных интервалах',
        ],
        sv: '{str} day intervals',
        th: ['{str} days intervals'],
        tr: ['{str} gün aralıkları', '{str} gün aralıkları'],
        vi: ['các khoảng thời gian {str} ngày'],
        zh: ['{str}天时间周期'],
        zh_TW: ['{str}天時間週期'],
      }
    },
    89020: (e) => {
      e.exports = {
        ar: [
          '{str} ساعة',
          '{str} ساعة',
          '{str} ساعة',
          '{str} ساعة',
          '{str} ساعة',
          '{str} ساعة',
        ],
        ca_ES: '{str} hour',
        cs: '{str} hour',
        de: ['{str} Stunde', '{str} Stunden'],
        el: '{str} hour',
        en: '{str} hour',
        es: ['{str} hora', '{str} horas'],
        fa: ['{str} hours'],
        fr: ['{str} heure', '{str} heures'],
        he_IL: ['{str} שעה', '{str} שעות', '{str} שעות', '{str} שעות'],
        hu_HU: ['{str} hours'],
        id_ID: ['{str} jam'],
        it: ['{str} ora', '{str} ore'],
        ja: ['{str}時間'],
        ko: ['{str} 시'],
        ms_MY: ['{str} jam'],
        nl_NL: '{str} hour',
        pl: ['{str} godzina', '{str} godziny', '{str} godzin', '{str} godzin'],
        pt: ['{str} hora', '{str} horas'],
        ro: '{str} hour',
        ru: ['{str} час', '{str} часа', '{str} часов', '{str} часов'],
        sv: '{str} hour',
        th: ['{str} hours'],
        tr: ['{str} saat', '{str} saat'],
        vi: ['{str} giờ'],
        zh: ['{str}小时'],
        zh_TW: ['{str}小時'],
      }
    },
    17174: (e) => {
      e.exports = {
        ar: [
          '{str} ساعة',
          '{str} ساعة',
          '{str} ساعة',
          '{str} ساعة',
          '{str} ساعة',
          '{str} ساعة',
        ],
        ca_ES: '{str} hour',
        cs: '{str} hour',
        de: ['{str} Stunde', '{str} Stunden'],
        el: '{str} hour',
        en: '{str} hour',
        es: ['{str} hora', '{str} horas'],
        fa: ['{str} hours'],
        fr: ['{str} heure', '{str} heures'],
        he_IL: ['שעה ‎{str}‎', '‎{str}‎ שעות', '‎{str}‎ שעות', '‎{str}‎ שעות'],
        hu_HU: ['{str} hours'],
        id_ID: ['{str} jam'],
        it: ['{str} ora', '{str} ore'],
        ja: ['{str}時間'],
        ko: ['{str} 시간'],
        ms_MY: ['{str} jam'],
        nl_NL: '{str} hour',
        pl: ['{str} godzina', '{str} godziny', '{str} godzin', '{str} godzin'],
        pt: ['{str} hora', '{str} horas'],
        ro: '{str} hour',
        ru: ['{str} час', '{str} часа', '{str} часов', '{str} часов'],
        sv: ['{str} timme', '{str} timmar'],
        th: ['{str} hours'],
        tr: ['{str} saat', '{str} saat'],
        vi: ['{str} giờ'],
        zh: ['{str}小时'],
        zh_TW: ['{str}小時'],
      }
    },
    54028: (e) => {
      e.exports = {
        ar: [
          'فترات {str} ساعة',
          'فترات {str} ساعة',
          'فترات {str} ساعة',
          'فترات {str} ساعة',
          'فترات {str} ساعة',
          'فترات {str} ساعة',
        ],
        ca_ES: '{str} hour intervals',
        cs: '{str} hour intervals',
        de: ['{str}-stündige Intervalle', '{str}-stündige Intervalle'],
        el: '{str} hour intervals',
        en: '{str} hour intervals',
        es: ['intervalos de {str} hora', 'intervalos de {str} horas'],
        fa: ['{str} hours intervals'],
        fr: ["{str} intervalles d'heure", "{str} intervalles d'heures"],
        he_IL: [
          '{str} אינטרוולי שעה',
          '{str} אינטרוולי שעות',
          '{str} אינטרוולי שעות',
          '{str} אינטרוולי שעות',
        ],
        hu_HU: ['{str} hours intervals'],
        id_ID: ['{str} interval jam'],
        it: ['Timeframe {str} ora', 'Timeframe {str} ore'],
        ja: ['{str}時間足'],
        ko: ['{str} 시간 인터벌'],
        ms_MY: ['{str} selang jam'],
        nl_NL: '{str} hour intervals',
        pl: [
          '{str} godzinne interwały',
          '{str} godzinne interwały',
          '{str} godzinne interwały',
          '{str} godzinne interwały',
        ],
        pt: ['intervalos de {str} hora', 'intervalos de {str} horas'],
        ro: '{str} hour intervals',
        ru: [
          '{str}-часовых интервалах',
          '{str}-часовых интервалах',
          '{str}-часовых интервалах',
          '{str}-часовых интервалах',
        ],
        sv: '{str} hour intervals',
        th: ['{str} hours intervals'],
        tr: ['{str} saat aralıkları', '{str} saat aralıkları'],
        vi: ['{str} khoảng thời gian bằng giờ'],
        zh: ['{str}小时时间周期'],
        zh_TW: ['{str}小時時間週期'],
      }
    },
    3189: (e) => {
      e.exports = {
        ar: [
          '{str} شهر',
          '{str} شهر',
          '{str} شهر',
          '{str} شهر',
          '{str} شهر',
          '{str} شهر',
        ],
        ca_ES: '{str} month',
        cs: '{str} month',
        de: ['{str} Monat', '{str} Monate'],
        el: '{str} month',
        en: '{str} month',
        es: ['{str} mes', '{str} meses'],
        fa: ['{str} months'],
        fr: ['{str} mois', '{str} mois'],
        he_IL: ['{str} חודש', '{str} חודשים', '{str} חודשים', '{str} חודשים'],
        hu_HU: ['{str} months'],
        id_ID: ['{str} bulan'],
        it: ['{str} mese', '{str} mesi'],
        ja: ['{str}ヶ月'],
        ko: ['{str}달'],
        ms_MY: ['{str} bulan'],
        nl_NL: '{str} month',
        pl: [
          '{str} miesiąc',
          '{str} miesiące',
          '{str} miesięcy',
          '{str} miesięcy',
        ],
        pt: ['{str} mês', '{str} meses'],
        ro: '{str} month',
        ru: ['{str} месяц', '{str} месяца', '{str} месяцев', '{str} месяцев'],
        sv: '{str} month',
        th: ['{str} months'],
        tr: ['{str} ay', '{str} ay'],
        vi: ['{str} tháng'],
        zh: ['{str}个月'],
        zh_TW: ['{str}月'],
      }
    },
    28039: (e) => {
      e.exports = {
        ar: [
          '‎{str}‎ شهر',
          '‎{str}‎ شهر',
          '‎{str}‎ شهر',
          '‎{str}‎ شهر',
          '‎{str}‎ شهر',
          '‎{str}‎ شهر',
        ],
        ca_ES: '{str} month',
        cs: '{str} month',
        de: ['{str} Monat', '{str} Monate'],
        el: '{str} month',
        en: '{str} month',
        es: ['{str} mes', '{str} meses'],
        fa: ['{str} months'],
        fr: ['{str} mois', '{str} mois'],
        he_IL: ['חודש ‎{str}‎', '‎{str}‎ חודשים', '‎{str}‎ חודשים', '‎{str}‎ חודשים'],
        hu_HU: ['{str} months'],
        id_ID: ['{str} bulan'],
        it: ['{str} mese', '{str} mesi'],
        ja: ['{str}ヶ月'],
        ko: ['{str}달'],
        ms_MY: ['{str} bulan'],
        nl_NL: '{str} month',
        pl: [
          '{str} miesiąc',
          '{str} miesiące',
          '{str} miesięcy',
          '{str} miesięcy',
        ],
        pt: ['{str} mês', '{str} meses'],
        ro: '{str} month',
        ru: ['{str} месяц', '{str} месяца', '{str} месяцев', '{str} месяцев'],
        sv: ['{str} månad', '{str} månader'],
        th: ['{str} months'],
        tr: ['{str} ay', '{str} ay'],
        vi: ['{str} tháng'],
        zh: ['{str}个月'],
        zh_TW: ['{str}月'],
      }
    },
    99773: (e) => {
      e.exports = {
        ar: [
          'فترات {str} شهر',
          'فترات {str} شهر',
          'فترات {str} شهر',
          'فترات {str} شهر',
          'فترات {str} شهر',
          'فترات {str} شهر',
        ],
        ca_ES: '{str} month intervals',
        cs: '{str} month intervals',
        de: ['{str}-monatige Intervalle', '{str}-monatige Intervalle'],
        el: '{str} month intervals',
        en: '{str} month intervals',
        es: ['intervalos de {str} mes', 'intervalos de {str} meses'],
        fa: ['{str} months intervals'],
        fr: ['{str} intervalles de mois', '{str} intervalles de mois'],
        he_IL: [
          '{str} אינטרוולי חודש',
          '{str} אינטרוולי חודשים',
          '{str} אינטרוולי חודשים',
          '{str} אינטרוולי חודשים',
        ],
        hu_HU: ['{str} months intervals'],
        id_ID: ['{str} interval bulan'],
        it: ['Timeframe {str} mese', 'Timeframe {str} mesi'],
        ja: ['{str}ヶ月足'],
        ko: ['{str}달 인터벌'],
        ms_MY: ['{str} selang bulan'],
        nl_NL: '{str} month intervals',
        pl: [
          '{str} miesięczne interwały',
          '{str} miesięczne interwały',
          '{str} miesięczne interwały',
          '{str} miesięczne interwały',
        ],
        pt: ['intervalos de {str} mês', 'intervalos de {str} meses'],
        ro: '{str} month intervals',
        ru: [
          '{str}-месячных интервалах',
          '{str}-месячных интервалах',
          '{str}-месячных интервалах',
          '{str}-месячных интервалах',
        ],
        sv: '{str} month intervals',
        th: ['{str} months intervals'],
        tr: ['{str} ay aralıkları', '{str} ay aralıkları'],
        vi: ['các khoảng thời gian {str} tháng'],
        zh: ['{str}个月时间周期'],
        zh_TW: ['{str}月時間週期'],
      }
    },
    44795: (e) => {
      e.exports = {
        ar: [
          '{str} دقيقة',
          '{str} دقيقة',
          '{str} دقيقة',
          '{str} دقيقة',
          '{str} دقيقة',
          '{str} دقيقة',
        ],
        ca_ES: '{str} minute',
        cs: '{str} minute',
        de: ['{str} Minute', '{str} Minuten'],
        el: '{str} minute',
        en: '{str} minute',
        es: ['{str} minuto', '{str} minutos'],
        fa: ['{str} minutes'],
        fr: '{str} minute',
        he_IL: ['דקה {str}', 'דקות {str}', 'דקות {str}', 'דקות {str}'],
        hu_HU: ['{str} minutes'],
        id_ID: ['{str} menit'],
        it: ['{str} minuto', '{str} minuti'],
        ja: ['{str}分'],
        ko: ['{str} 분'],
        ms_MY: ['{str} minit'],
        nl_NL: '{str} minute',
        pl: ['{str} minuta', '{str} minuty', '{str} minut', '{str} minut'],
        pt: ['{str} minuto', '{str} minutos'],
        ro: '{str} minute',
        ru: ['{str} минута', '{str} минуты', '{str} минут', '{str} минут'],
        sv: '{str} minute',
        th: ['{str} minutes'],
        tr: ['{str} dakika', '{str} dakika'],
        vi: ['{str} phút'],
        zh: ['{str}分钟'],
        zh_TW: ['{str}分鐘'],
      }
    },
    60144: (e) => {
      e.exports = {
        ar: [
          '{str} دقيقة',
          '{str} دقيقة',
          '{str} دقيقة',
          '{str} دقيقة',
          '{str} دقيقة',
          '{str} دقيقة',
        ],
        ca_ES: '{str} minute',
        cs: '{str} minute',
        de: ['{str} Minute', '{str} Minuten'],
        el: '{str} minute',
        en: '{str} minute',
        es: ['{str} minuto', '{str} minutos'],
        fa: ['{str} minutes'],
        fr: '{str} minute',
        he_IL: ['דקה {str}', '{str} דקות', '{str} דקות', '{str} דקות'],
        hu_HU: ['{str} minutes'],
        id_ID: ['{str} menit'],
        it: ['{str} minuto', '{str} minuti'],
        ja: ['{str}分'],
        ko: ['{str} 분'],
        ms_MY: ['{str} minit'],
        nl_NL: '{str} minute',
        pl: ['{str} minuta', '{str} minuty', '{str} minut', '{str} minut'],
        pt: ['{str} minuto', '{str} minutos'],
        ro: '{str} minute',
        ru: ['{str} минута', '{str} минуты', '{str} минут', '{str} минут'],
        sv: '{str} minute',
        th: ['{str} minutes'],
        tr: ['{str} dakika', '{str} dakika'],
        vi: ['{str} phút'],
        zh: ['{str}分钟'],
        zh_TW: ['{str}分'],
      }
    },
    56347: (e) => {
      e.exports = {
        ar: [
          'فترات {str} دقيقة',
          'فترات {str} دقيقة',
          'فترات {str} دقيقة',
          'فترات {str} دقيقة',
          'فترات {str} دقيقة',
          'فترات {str} دقيقة',
        ],
        ca_ES: '{str} minute intervals',
        cs: '{str} minute intervals',
        de: ['{str}-minütige Intervalle', '{str}-minütige Intervalle'],
        el: '{str} minute intervals',
        en: '{str} minute intervals',
        es: ['intervalos de {str} minuto', 'intervalos de {str} minutos'],
        fa: ['{str} minutes intervals'],
        fr: ['{str} intervalles de minute', '{str} intervalles de minutes'],
        he_IL: [
          '{str} אינטרוולי דקה',
          '{str} אינטרוולי דקות',
          '{str} אינטרוולי דקות',
          '{str} אינטרוולי דקות',
        ],
        hu_HU: ['{str} minutes intervals'],
        id_ID: ['{str} interval menit'],
        it: ['Timeframe {str} minuto', 'Timeframe {str} minuti'],
        ja: ['{str}分足'],
        ko: ['{str} 분 인터벌'],
        ms_MY: ['{str} selang minit'],
        nl_NL: '{str} minute intervals',
        pl: [
          '{str} minutowe interwały',
          '{str} minutowe interwały',
          '{str} minutowe interwały',
          '{str} minutowe interwały',
        ],
        pt: ['intervalos de {str} minuto', 'intervalos de {str} minutos'],
        ro: '{str} minute intervals',
        ru: [
          '{str}-минутных интервалах',
          '{str}-минутных интервалах',
          '{str}-минутных интервалах',
          '{str}-минутных интервалах',
        ],
        sv: '{str} minute intervals',
        th: ['{str} minutes intervals'],
        tr: ['{str} dakika aralıkları', '{str} dakika aralıkları'],
        vi: ['{str} khoảng thời gian bằng phút'],
        zh: ['{str}分钟时间周期'],
        zh_TW: ['{str}分鐘時間週期'],
      }
    },
    67518: (e) => {
      e.exports = {
        ar: [
          '{str} أسبوع',
          '{str} أسبوع',
          '{str} أسبوع',
          '{str} أسبوع',
          '{str} أسبوع',
          '{str} أسبوع',
        ],
        ca_ES: '{str} week',
        cs: '{str} week',
        de: ['{str} Woche', '{str} Wochen'],
        el: '{str} week',
        en: '{str} week',
        es: ['{str} semana', '{str} semanas'],
        fa: ['{str} weeks'],
        fr: ['{str} semaine', '{str} semaines'],
        he_IL: ['{str} שבוע', '{str} שבועות', '{str} שבועות', '{str} שבועות'],
        hu_HU: ['{str} weeks'],
        id_ID: ['{str} minggu'],
        it: ['{str} settimana', '{str} settimane'],
        ja: ['{str}週'],
        ko: ['{str} 주'],
        ms_MY: ['{str} minggu'],
        nl_NL: '{str} week',
        pl: [
          '{str} tydzień',
          '{str} tygodnie',
          '{str} tygodni',
          '{str} tygodni',
        ],
        pt: ['{str} semana', '{str} semanas'],
        ro: '{str} week',
        ru: ['{str} неделя', '{str} недели', '{str} недель', '{str} недель'],
        sv: '{str} week',
        th: ['{str} weeks'],
        tr: ['{str} hafta', '{str} hafta'],
        vi: ['{str} tuần'],
        zh: ['{str}周'],
        zh_TW: ['{str}週'],
      }
    },
    14074: (e) => {
      e.exports = {
        ar: [
          '‎{str}‎ أسبوع',
          '‎{str}‎ أسبوع',
          '‎{str}‎ أسبوع',
          '‎{str}‎ أسبوع',
          '‎{str}‎ أسبوع',
          '‎{str}‎ أسبوع',
        ],
        ca_ES: '{str} week',
        cs: '{str} week',
        de: ['{str} Woche', '{str} Wochen'],
        el: '{str} week',
        en: '{str} week',
        es: ['{str} semana', '{str} semanas'],
        fa: ['{str} weeks'],
        fr: ['{str} semaine', '{str} semaines'],
        he_IL: ['שבוע ‎{str}‎', '‎{str}‎ שבועות', '‎{str}‎ שבועות', '‎{str}‎ שבועות'],
        hu_HU: ['{str} weeks'],
        id_ID: ['{str} minggu'],
        it: ['{str} settimana', '{str} settimane'],
        ja: ['{str}週'],
        ko: ['{str} 주'],
        ms_MY: ['{str} minggu'],
        nl_NL: '{str} week',
        pl: [
          '{str} tydzień',
          '{str} tygodnie',
          '{str} tygodni',
          '{str} tygodni',
        ],
        pt: ['{str} semana', '{str} semanas'],
        ro: '{str} week',
        ru: ['{str} неделя', '{str} недели', '{str} недель', '{str} недель'],
        sv: ['{str} vecka', '{str} veckor'],
        th: ['{str} weeks'],
        tr: ['{str} hafta', '{str} hafta'],
        vi: ['{str} tuần'],
        zh: ['{str}周'],
        zh_TW: ['{str}週'],
      }
    },
    58667: (e) => {
      e.exports = {
        ar: [
          'فترات ‎{str}‎ أسبوع',
          'فترات ‎{str}‎ أسبوع',
          'فترات ‎{str}‎ أسبوع',
          'فترات ‎{str}‎ أسبوع',
          'فترات ‎{str}‎ أسبوع',
          'فترات ‎{str}‎ أسبوع',
        ],
        ca_ES: '{str} week intervals',
        cs: '{str} week intervals',
        de: ['{str}-wöchige Intervalle', '{str}-wöchige Intervalle'],
        el: '{str} week intervals',
        en: '{str} week intervals',
        es: ['intervalos de {str} semana', 'intervalos de {str} semanas'],
        fa: ['{str} weeks intervals'],
        fr: ['{str} intervalles de semaine', '{str} intervalles de semaines'],
        he_IL: [
          '{str} אינטרוולי שבוע',
          '{str} אינטרוולי שבועות',
          '{str} אינטרוולי שבועות',
          '{str} אינטרוולי שבועות',
        ],
        hu_HU: ['{str} weeks intervals'],
        id_ID: ['{str} interval minggu'],
        it: ['Timeframe {str} settimana', 'Timeframe {str} settimane'],
        ja: ['{str}週足'],
        ko: ['{str} 주 인터벌'],
        ms_MY: ['{str} selang minggu'],
        nl_NL: '{str} week intervals',
        pl: [
          '{str} tygodniowe interwały',
          '{str} tygodniowe interwały',
          '{str} tygodniowe interwały',
          '{str} tygodniowe interwały',
        ],
        pt: ['intervalos de {str} semana', 'intervalos de {str} semanas'],
        ro: '{str} week intervals',
        ru: [
          '{str}-недельных интервалах',
          '{str}-недельных интервалах',
          '{str}-недельных интервалах',
          '{str}-недельных интервалах',
        ],
        sv: '{str} week intervals',
        th: ['{str} weeks intervals'],
        tr: ['{str} hafta aralıkları', '{str} hafta aralıkları'],
        vi: ['các khoảng thời gian {str} tuần'],
        zh: ['{str}周时间周期'],
        zh_TW: ['{str}週時間週期'],
      }
    },
    6598: (e) => {
      e.exports = {
        ar: [
          '{str} عام',
          '{str} عام',
          '{str} عام',
          '{str} عام',
          '{str} عام',
          '{str} عام',
        ],
        ca_ES: '{str} year',
        cs: '{str} year',
        de: ['{str} Jahr', '{str} Jahre'],
        el: '{str} year',
        en: '{str} year',
        es: ['{str} año', '{str} años'],
        fa: ['{str} years'],
        fr: ['{str} an', '{str} ans'],
        he_IL: ['{str} שנה', '{str} שנים', '{str} שנים', '{str} שנים'],
        hu_HU: ['{str} years'],
        id_ID: ['{str} tahun'],
        it: ['{str} anno', '{str} anni'],
        ja: ['{str}年'],
        ko: ['{str} 년'],
        ms_MY: ['{str} tahun'],
        nl_NL: '{str} year',
        pl: ['{str} rok', '{str} lata', '{str} lat', '{str} lat'],
        pt: ['{str} ano', '{str} anos'],
        ro: '{str} year',
        ru: ['{str} год', '{str} года', '{str} лет', '{str} лет'],
        sv: '{str} year',
        th: ['{str} years'],
        tr: ['{str} yıl', '{str} yıl'],
        vi: ['{str} năm'],
        zh: ['{str}年'],
        zh_TW: ['{str}年'],
      }
    },
    8222: (e) => {
      e.exports = {
        ar: [
          '‎{str}‎ سنة',
          '‎{str}‎ سنة',
          '‎{str}‎ سنة',
          '‎{str}‎ سنة',
          '‎{str}‎ سنة',
          '‎{str}‎ سنة',
        ],
        ca_ES: '{str} year',
        cs: '{str} year',
        de: ['{str} Jahr', '{str} Jahre'],
        el: '{str} year',
        en: '{str} year',
        es: ['{str} año', '{str} años'],
        fa: ['{str} years'],
        fr: ['{str} année', '{str} années'],
        he_IL: ['שנה ‎{str}‎', '‎{str}‎ שנים', '‎{str}‎ שנים', '‎{str}‎ שנים'],
        hu_HU: ['{str} years'],
        id_ID: ['{str} tahun'],
        it: ['{str} anno', '{str} anni'],
        ja: ['{str}年'],
        ko: ['{str} 해'],
        ms_MY: ['{str} tahun'],
        nl_NL: '{str} year',
        pl: ['{str} rok', '{str} lata', '{str} lat', '{str} lat'],
        pt: ['{str} ano', '{str} anos'],
        ro: '{str} year',
        ru: ['{str} год', '{str} года', '{str} лет', '{str} лет'],
        sv: ['{str} år', '{str} år'],
        th: ['{str} years'],
        tr: ['{str} yıl', '{str} yıl'],
        vi: ['{str} năm'],
        zh: ['{str}年'],
        zh_TW: ['{str}年'],
      }
    },
    57849: (e) => {
      e.exports = {
        ar: [
          'فترات ‎{str}‎ سنة',
          'فترات ‎{str}‎ سنة',
          'فترات ‎{str}‎ سنة',
          'فترات ‎{str}‎ سنة',
          'فترات ‎{str}‎ سنة',
          'فترات ‎{str}‎ سنة',
        ],
        ca_ES: '{str} year intervals',
        cs: '{str} year intervals',
        de: ['{str}-jährige Intervalle', '{str}-jährige Intervalle'],
        el: '{str} year intervals',
        en: '{str} year intervals',
        es: ['intervalos de {str} año', 'intervalos de {str} años'],
        fa: ['{str} years intervals'],
        fr: ["{str} intervalles d'année", "{str} intervalles d'années"],
        he_IL: [
          '{str} אינטרוולי שעה',
          '{str} אינטרוולי שעות',
          '{str} אינטרוולי שעות',
          '{str} אינטרוולי שעות',
        ],
        hu_HU: ['{str} years intervals'],
        id_ID: ['{str} interval tahun'],
        it: ['Timeframe {str} anno', 'Timeframe {str} anni'],
        ja: ['{str}年足'],
        ko: ['{str} 해 인터벌'],
        ms_MY: ['{str} selang tahun'],
        nl_NL: '{str} year intervals',
        pl: [
          '{str} roczne interwały',
          '{str} roczne interwały',
          '{str} roczne interwały',
          '{str} roczne interwały',
        ],
        pt: ['intervalos de {str} ano', 'intervalos de {str} anos'],
        ro: '{str} year intervals',
        ru: [
          '{str}-летних интервалах',
          '{str}-летних интервалах',
          '{str}-летних интервалах',
          '{str}-летних интервалах',
        ],
        sv: '{str} year intervals',
        th: ['{str} years intervals'],
        tr: ['{str} yıl aralıkları', '{str} yıl aralıkları'],
        vi: ['các khoảng thời gian {str} năm'],
        zh: ['{str}年时间周期'],
        zh_TW: ['{str}年時間週期'],
      }
    },
  },
])
