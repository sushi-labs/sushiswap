;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7260],
  {
    59142: (e, t) => {
      var n, s, i
      ;(s = [t]),
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
            var s = {
              get passive() {
                n = !0
              },
            }
            window.addEventListener('testPassive', null, s),
              window.removeEventListener('testPassive', null, s)
          }
          var i =
              'undefined' != typeof window &&
              window.navigator &&
              window.navigator.platform &&
              /iP(ad|hone|od)/.test(window.navigator.platform),
            o = [],
            a = !1,
            r = -1,
            l = void 0,
            c = void 0,
            u = (e) =>
              o.some(
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
            h = () => {
              setTimeout(() => {
                void 0 !== c &&
                  ((document.body.style.paddingRight = c), (c = void 0)),
                  void 0 !== l &&
                    ((document.body.style.overflow = l), (l = void 0))
              })
            }
          ;(e.disableBodyScroll = (e, s) => {
            if (i) {
              if (!e)
                return void console.error(
                  'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
                )
              if (e && !o.some((t) => t.targetElement === e)) {
                var h = { targetElement: e, options: s || {} }
                ;(o = [].concat(t(o), [h])),
                  (e.ontouchstart = (e) => {
                    1 === e.targetTouches.length &&
                      (r = e.targetTouches[0].clientY)
                  }),
                  (e.ontouchmove = (t) => {
                    var n, s, i, o
                    1 === t.targetTouches.length &&
                      ((s = e),
                      (o = (n = t).targetTouches[0].clientY - r),
                      !u(n.target) &&
                        ((s && 0 === s.scrollTop && 0 < o) ||
                        ((i = s) &&
                          i.scrollHeight - i.scrollTop <= i.clientHeight &&
                          o < 0)
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
              ;(p = s),
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
              var m = { targetElement: e, options: s || {} }
              o = [].concat(t(o), [m])
            }
            var p
          }),
            (e.clearAllBodyScrollLocks = () => {
              i
                ? (o.forEach((e) => {
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
                  (o = []),
                  (r = -1))
                : (h(), (o = []))
            }),
            (e.enableBodyScroll = (e) => {
              if (i) {
                if (!e)
                  return void console.error(
                    'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                  )
                ;(e.ontouchstart = null),
                  (e.ontouchmove = null),
                  (o = o.filter((t) => t.targetElement !== e)),
                  a &&
                    0 === o.length &&
                    (document.removeEventListener(
                      'touchmove',
                      d,
                      n ? { passive: !1 } : void 0,
                    ),
                    (a = !1))
              } else
                1 === o.length && o[0].targetElement === e
                  ? (h(), (o = []))
                  : (o = o.filter((t) => t.targetElement !== e))
            })
        }),
        void 0 === (i = 'function' == typeof n ? n.apply(t, s) : n) ||
          (e.exports = i)
    },
    97754: (e, t) => {
      var n
      !(() => {
        var s = {}.hasOwnProperty
        function i() {
          for (var e = [], t = 0; t < arguments.length; t++) {
            var n = arguments[t]
            if (n) {
              var o = typeof n
              if ('string' === o || 'number' === o) e.push(n)
              else if (Array.isArray(n) && n.length) {
                var a = i.apply(null, n)
                a && e.push(a)
              } else if ('object' === o)
                for (var r in n) s.call(n, r) && n[r] && e.push(r)
            }
          }
          return e.join(' ')
        }
        e.exports
          ? ((i.default = i), (e.exports = i))
          : void 0 === (n = (() => i).apply(t, [])) || (e.exports = n)
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
    31668: (e) => {
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
    70159: (e) => {
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
    36204: (e) => {
      e.exports = { separator: 'separator-Pf4rIzEt' }
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
    72808: (e) => {
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
    53885: (e, t, n) => {
      n.d(t, { getStyleClasses: () => r, isCircleLogoWithUrlProps: () => l })
      var s = n(97754),
        i = n(52292),
        o = n(56057),
        a = n.n(o)
      function r(e, t = 2, n) {
        return s(
          a().logo,
          a()[e],
          n,
          0 === t || 1 === t
            ? s(i.skeletonTheme.wrapper, a().skeleton)
            : a().letter,
          1 === t && i.skeletonTheme.animated,
        )
      }
      function l(e) {
        return (
          'logoUrl' in e &&
          null !== e.logoUrl &&
          void 0 !== e.logoUrl &&
          0 !== e.logoUrl.length
        )
      }
    },
    39416: (e, t, n) => {
      n.d(t, { useFunctionalRefObject: () => o })
      var s = n(50959),
        i = n(43010)
      function o(e) {
        const t = (0, s.useMemo)(
            () =>
              ((e) => {
                const t = (n) => {
                  e(n), (t.current = n)
                }
                return (t.current = null), t
              })((e) => {
                r.current(e)
              }),
            [],
          ),
          n = (0, s.useRef)(null),
          o = (t) => {
            if (null === t) return a(n.current, t), void (n.current = null)
            n.current !== e && ((n.current = e), a(n.current, t))
          },
          r = (0, s.useRef)(o)
        return (
          (r.current = o),
          (0, i.useIsomorphicLayoutEffect)(() => {
            if (null !== t.current)
              return r.current(t.current), () => r.current(null)
          }, [e]),
          t
        )
      }
      function a(e, t) {
        null !== e && ('function' == typeof e ? e(t) : (e.current = t))
      }
    },
    27267: (e, t, n) => {
      function s(e, t, n, s, i) {
        function o(i) {
          if (e > i.timeStamp) return
          const o = i.target
          void 0 !== n &&
            null !== t &&
            null !== o &&
            o.ownerDocument === s &&
            (t.contains(o) || n(i))
        }
        return (
          i.click && s.addEventListener('click', o, !1),
          i.mouseDown && s.addEventListener('mousedown', o, !1),
          i.touchEnd && s.addEventListener('touchend', o, !1),
          i.touchStart && s.addEventListener('touchstart', o, !1),
          () => {
            s.removeEventListener('click', o, !1),
              s.removeEventListener('mousedown', o, !1),
              s.removeEventListener('touchend', o, !1),
              s.removeEventListener('touchstart', o, !1)
          }
        )
      }
      n.d(t, { addOutsideEventListener: () => s })
    },
    52292: (e, t, n) => {
      n.d(t, { skeletonTheme: () => i })
      var s = n(55679)
      const i = s
    },
    90186: (e, t, n) => {
      function s(e) {
        return o(e, a)
      }
      function i(e) {
        return o(e, r)
      }
      function o(e, t) {
        const n = Object.entries(e).filter(t),
          s = {}
        for (const [e, t] of n) s[e] = t
        return s
      }
      function a(e) {
        const [t, n] = e
        return 0 === t.indexOf('data-') && 'string' == typeof n
      }
      function r(e) {
        return 0 === e[0].indexOf('aria-')
      }
      n.d(t, {
        filterAriaProps: () => i,
        filterDataProps: () => s,
        filterProps: () => o,
        isAriaAttribute: () => r,
        isDataAttribute: () => a,
      })
    },
    47201: (e, t, n) => {
      function s(...e) {
        return (t) => {
          for (const n of e) void 0 !== n && n(t)
        }
      }
      n.d(t, { createSafeMulticastEventHandler: () => s })
    },
    42142: (e, t, n) => {
      n.d(t, { FragmentMap: () => i })
      var s = n(50959)
      function i(e) {
        if (e.map) {
          return s.Children.toArray(e.children).map(e.map)
        }
        return e.children
      }
    },
    50238: (e, t, n) => {
      n.d(t, { useRovingTabindexElement: () => o })
      var s = n(50959),
        i = n(39416)
      function o(e, t = []) {
        const [n, o] = (0, s.useState)(!1),
          a = (0, i.useFunctionalRefObject)(e)
        return (
          (0, s.useLayoutEffect)(() => {
            const e = a.current
            if (null === e) return
            const t = (e) => {
              switch (e.type) {
                case 'roving-tabindex:main-element':
                  o(!0)
                  break
                case 'roving-tabindex:secondary-element':
                  o(!1)
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
          [a, n ? 0 : -1]
        )
      }
    },
    59695: (e, t, n) => {
      n.d(t, { CircleLogo: () => r, hiddenCircleLogoClass: () => a })
      var s = n(50959),
        i = n(53885),
        o = n(56057)
      const a = n.n(o)().hidden
      function r(e) {
        const t = (0, i.isCircleLogoWithUrlProps)(e),
          [n, o] = (0, s.useState)(0),
          a = (0, s.useRef)(null),
          r = (0, i.getStyleClasses)(e.size, n, e.className),
          l = e.alt ?? e.title ?? '',
          c = t ? l[0] : e.placeholderLetter
        return (
          (0, s.useEffect)(() => o((a.current?.complete ?? !t) ? 2 : 1), [t]),
          t && 3 !== n
            ? s.createElement('img', {
                ref: a,
                className: r,
                crossOrigin: '',
                src: e.logoUrl,
                alt: l,
                title: e.title,
                loading: e.loading,
                onLoad: () => o(2),
                onError: () => o(3),
                'aria-label': e['aria-label'],
                'aria-hidden': e['aria-hidden'],
              })
            : s.createElement(
                'span',
                {
                  className: r,
                  title: e.title,
                  'aria-label': e['aria-label'],
                  'aria-hidden': e['aria-hidden'],
                },
                c,
              )
        )
      }
    },
    99025: (e, t, n) => {
      n.d(t, { Hint: () => r })
      var s = n(50959),
        i = n(97754),
        o = n.n(i),
        a = n(31668)
      function r(e) {
        const { text: t = '', className: n } = e
        return s.createElement('span', { className: o()(a.shortcut, n) }, t)
      }
    },
    23829: (e, t, n) => {
      n.d(t, { ContextMenuItem: () => p })
      var s = n(50959),
        i = n(97754),
        o = n.n(i),
        a = n(9745),
        r = n(26996),
        l = n(54627),
        c = n(99025),
        u = n(39750),
        d = n(79978),
        h = n(60925),
        m = n(70159)
      function p(e) {
        const {
            className: t,
            isTitle: n,
            isLoading: i,
            isHovered: p,
            active: g,
            checkable: v,
            disabled: b,
            checked: f,
            icon: _,
            iconChecked: C,
            hint: x,
            subItems: y,
            label: E,
            styledLabel: S,
            onClick: M,
            children: k,
            toolbox: w,
            jsxLabel: R,
            size: T = 'normal',
          } = e,
          A = (0, s.useContext)(l.EmptyIconsContext),
          B = !!y.length
        return i
          ? s.createElement(
              'li',
              { className: o()(t, m.item, m.loading, m[T]) },
              s.createElement(r.Loader, null),
            )
          : s.createElement(
              'li',
              {
                className: o()(
                  t,
                  m.item,
                  m.interactive,
                  n && m.title,
                  b && m.disabled,
                  p && m.hovered,
                  g && m.active,
                  A && m.emptyIcons,
                  m[T],
                ),
                onClick: M,
              },
              s.createElement(a.Icon, {
                className: o()(m.icon),
                icon: (() => {
                  if (v && f) return C || _ || u
                  return _
                })(),
              }),
              s.createElement(
                'span',
                { className: o()(m.label) },
                !R && S
                  ? S.map(({ text: e, ...t }, n) =>
                      s.createElement('span', { key: n, style: t }, e),
                    )
                  : (R ?? E),
              ),
              !!w &&
                s.createElement(a.Icon, {
                  onClick: () => {
                    w && w.action()
                  },
                  className: m.remove,
                  icon: h,
                }),
              !B &&
                x &&
                s.createElement(c.Hint, { className: m.shortcut, text: x }),
              B && s.createElement(a.Icon, { className: m.nested, icon: d }),
              k,
            )
      }
    },
    54627: (e, t, n) => {
      n.d(t, { EmptyIconsContext: () => s })
      const s = n(50959).createContext(!1)
    },
    1109: (e, t, n) => {
      n.d(t, { Separator: () => a })
      var s = n(50959),
        i = n(97754),
        o = n(36204)
      function a(e) {
        return s.createElement('div', {
          className: i(o.separator, e.className),
        })
      }
    },
    16396: (e, t, n) => {
      n.d(t, { DEFAULT_POPUP_MENU_ITEM_THEME: () => u, PopupMenuItem: () => h })
      var s = n(50959),
        i = n(97754),
        o = n(51768),
        a = n(59064),
        r = n(59695),
        l = n(76460),
        c = n(9059)
      const u = c
      function d(e) {
        e.stopPropagation()
      }
      function h(e) {
        const {
            id: t,
            role: n,
            className: u,
            title: h,
            labelRowClassName: m,
            labelClassName: p,
            toolboxClassName: g,
            shortcut: v,
            forceShowShortcuts: b,
            icon: f,
            iconClassname: _,
            isActive: C,
            isDisabled: x,
            isHovered: y,
            appearAsDisabled: E,
            label: S,
            link: M,
            showToolboxOnHover: k,
            showToolboxOnFocus: w,
            target: R,
            rel: T,
            toolbox: A,
            toolboxRole: B,
            reference: D,
            onMouseOut: N,
            onMouseOver: W,
            onKeyDown: P,
            suppressToolboxClick: F = !0,
            theme: L = c,
            tabIndex: z,
            tagName: O,
            renderComponent: H,
            roundedIcon: I,
            iconAriaProps: j,
            circleLogo: X,
            dontClosePopup: U,
            onClick: V,
            onClickArg: J,
            trackEventObject: q,
            trackMouseWheelClick: G,
            trackRightClick: Q,
            ...$
          } = e,
          Z = (0, s.useRef)(null),
          K = (0, s.useMemo)(
            () =>
              ((e) => {
                function t(t) {
                  const { reference: n, ...i } = t,
                    o = e ?? (i.href ? 'a' : 'div'),
                    a =
                      'a' === o
                        ? i
                        : ((e) => {
                            const {
                              download: t,
                              href: n,
                              hrefLang: s,
                              media: i,
                              ping: o,
                              rel: a,
                              target: r,
                              type: l,
                              referrerPolicy: c,
                              ...u
                            } = e
                            return u
                          })(i)
                  return s.createElement(o, { ...a, ref: n })
                }
                return (t.displayName = `DefaultComponent(${e})`), t
              })(O),
            [O],
          ),
          Y = H ?? K
        return s.createElement(
          Y,
          {
            ...$,
            id: t,
            role: n,
            className: i(u, L.item, f && L.withIcon, {
              [L.isActive]: C,
              [L.isDisabled]: x || E,
              [L.hovered]: y,
            }),
            title: h,
            href: M,
            target: R,
            rel: T,
            reference: (e) => {
              ;(Z.current = e), 'function' == typeof D && D(e)
              'object' == typeof D && (D.current = e)
            },
            onClick: (e) => {
              if (x) return
              q && (0, o.trackEvent)(q.category, q.event, q.label)
              V && V(J, e)
              U ||
                (e.currentTarget.dispatchEvent(
                  new CustomEvent('popup-menu-close-event', {
                    bubbles: !0,
                    detail: {
                      clickType: (0, l.isKeyboardClick)(e)
                        ? 'keyboard'
                        : 'mouse',
                    },
                  }),
                ),
                (0, a.globalCloseMenu)())
            },
            onContextMenu: (e) => {
              q &&
                Q &&
                (0, o.trackEvent)(q.category, q.event, `${q.label}_rightClick`)
            },
            onMouseUp: (e) => {
              if (1 === e.button && M && q) {
                let e = q.label
                G && (e += '_mouseWheelClick'),
                  (0, o.trackEvent)(q.category, q.event, e)
              }
            },
            onMouseOver: W,
            onMouseOut: N,
            onKeyDown: P,
            tabIndex: z,
          },
          X &&
            s.createElement(r.CircleLogo, {
              ...j,
              className: c['disclosure-item-circle-logo'],
              size: 'xxxsmall',
              logoUrl: X.logoUrl,
              placeholderLetter:
                'placeholderLetter' in X ? X.placeholderLetter : void 0,
            }),
          f &&
            s.createElement('span', {
              'aria-label': j && j['aria-label'],
              'aria-hidden': j && Boolean(j['aria-hidden']),
              className: i(L.icon, I && c['round-icon'], _),
              dangerouslySetInnerHTML: { __html: f },
            }),
          s.createElement(
            'span',
            { className: i(L.labelRow, m) },
            s.createElement('span', { className: i(L.label, p) }, S),
          ),
          (void 0 !== v || b) &&
            s.createElement(
              'span',
              { className: L.shortcut },
              (ee = v) && ee.split('+').join(' + '),
            ),
          void 0 !== A &&
            s.createElement(
              'span',
              {
                role: B,
                onClick: F ? d : void 0,
                className: i(g, L.toolbox, {
                  [L.showOnHover]: k,
                  [L.showOnFocus]: w,
                }),
              },
              A,
            ),
        )
        var ee
      }
    },
    20520: (e, t, n) => {
      n.d(t, { PopupMenu: () => h })
      var s = n(50959),
        i = n(32227),
        o = n(88987),
        a = n(42842),
        r = n(27317),
        l = n(29197)
      const c = s.createContext(void 0)
      var u = n(36383)
      const d = s.createContext({ setMenuMaxWidth: !1 })
      function h(e) {
        const {
            controller: t,
            children: n,
            isOpened: h,
            closeOnClickOutside: m = !0,
            doNotCloseOn: p,
            onClickOutside: g,
            onClose: v,
            onKeyboardClose: b,
            'data-name': f = 'popup-menu-container',
            ..._
          } = e,
          C = (0, s.useContext)(l.CloseDelegateContext),
          x = s.useContext(d),
          y = (0, s.useContext)(c),
          E = (0, u.useOutsideEvent)({
            handler: (e) => {
              g && g(e)
              if (!m) return
              const t = (0, o.default)(p) ? p() : null == p ? [] : [p]
              if (t.length > 0 && e.target instanceof Node)
                for (const n of t) {
                  const t = i.findDOMNode(n)
                  if (t instanceof Node && t.contains(e.target)) return
                }
              v()
            },
            mouseDown: !0,
            touchStart: !0,
          })
        return h
          ? s.createElement(
              a.Portal,
              {
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                pointerEvents: 'none',
              },
              s.createElement(
                'span',
                { ref: E, style: { pointerEvents: 'auto' } },
                s.createElement(
                  r.Menu,
                  {
                    ..._,
                    onClose: v,
                    onKeyboardClose: b,
                    onScroll: (t) => {
                      const { onScroll: n } = e
                      n && n(t)
                    },
                    customCloseDelegate: C,
                    customRemeasureDelegate: y,
                    ref: t,
                    'data-name': f,
                    limitMaxWidth: x.setMenuMaxWidth,
                    'data-tooltip-show-on-focus': 'true',
                  },
                  n,
                ),
              ),
            )
          : null
      }
    },
    6132: (e, t, n) => {
      var s = n(22134)
      function i() {}
      function o() {}
      ;(o.resetWarningCache = i),
        (e.exports = () => {
          function e(e, t, n, i, o, a) {
            if (a !== s) {
              var r = new Error(
                'Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types',
              )
              throw ((r.name = 'Invariant Violation'), r)
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
            checkPropTypes: o,
            resetWarningCache: i,
          }
          return (n.PropTypes = n), n
        })
    },
    19036: (e, t, n) => {
      e.exports = n(6132)()
    },
    22134: (e) => {
      e.exports = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED'
    },
    26448: (e) => {
      e.exports = {
        accessible: 'accessible-NQERJsv9',
        active: 'active-NQERJsv9',
      }
    },
    43119: (e) => {
      e.exports = {
        toolbar: 'toolbar-BXXUwft2',
        dateRangeWrapper: 'dateRangeWrapper-BXXUwft2',
        noranges: 'noranges-BXXUwft2',
        dateRangeExpanded: 'dateRangeExpanded-BXXUwft2',
        separator: 'separator-BXXUwft2',
        seriesControlWrapper: 'seriesControlWrapper-BXXUwft2',
        dateRangeCollapsed: 'dateRangeCollapsed-BXXUwft2',
        item: 'item-BXXUwft2',
        inline: 'inline-BXXUwft2',
        dateRange: 'dateRange-BXXUwft2',
        hidden: 'hidden-BXXUwft2',
        collapsed: 'collapsed-BXXUwft2',
      }
    },
    69873: (e) => {
      e.exports = { button: 'button-Hfju7pW_' }
    },
    74153: (e) => {
      e.exports = { button: 'button-uToIfRbZ' }
    },
    83580: (e) => {
      e.exports = { separator: 'separator-yDfG9Ccu' }
    },
    28580: (e) => {
      e.exports = { headerMenuText: 'headerMenuText-AcJrLng7' }
    },
    47825: (e) => {
      e.exports = {
        button: 'button-x1dCOTP3',
        disabled: 'disabled-x1dCOTP3',
        hover: 'hover-x1dCOTP3',
        clicked: 'clicked-x1dCOTP3',
        accessible: 'accessible-x1dCOTP3',
      }
    },
    40337: (e) => {
      e.exports = { item: 'item-SqYYy1zF' }
    },
    35546: (e) => {
      e.exports = { slider: 'slider-3kCW6DWs', inner: 'inner-3kCW6DWs' }
    },
    38680: (e) => {
      e.exports = { sliderRow: 'sliderRow-k2h4OAz8' }
    },
    20243: (e, t, n) => {
      n.d(t, {
        focusFirstMenuItem: () => u,
        handleAccessibleMenuFocus: () => l,
        handleAccessibleMenuKeyDown: () => c,
        queryMenuElements: () => m,
      })
      var s = n(19291),
        i = n(57177),
        o = n(68335),
        a = n(15754)
      const r = [37, 39, 38, 40]
      function l(e, t) {
        if (!e.target) return
        const n = e.relatedTarget?.getAttribute('aria-activedescendant')
        if (e.relatedTarget !== t.current) {
          const e = n && document.getElementById(n)
          if (!e || e !== t.current) return
        }
        u(e.target)
      }
      function c(e) {
        if (e.defaultPrevented) return
        const t = (0, o.hashFromEvent)(e)
        if (!r.includes(t)) return
        const n = document.activeElement
        if (!(document.activeElement instanceof HTMLElement)) return
        const a = m(e.currentTarget).sort(s.navigationOrderComparator)
        if (0 === a.length) return
        const l =
          document.activeElement.closest('[data-role="menuitem"]') ||
          document.activeElement.parentElement?.querySelector(
            '[data-role="menuitem"]',
          )
        if (!(l instanceof HTMLElement)) return
        const c = a.indexOf(l)
        if (-1 === c) return
        const u = p(l),
          g = u.indexOf(document.activeElement),
          v = -1 !== g,
          b = (e) => {
            n && (0, i.becomeSecondaryElement)(n),
              (0, i.becomeMainElement)(e),
              e.focus()
          }
        switch ((0, s.mapKeyCodeToDirection)(t)) {
          case 'inlinePrev':
            if (!u.length) return
            e.preventDefault(),
              b(0 === g ? a[c] : v ? d(u, g, -1) : u[u.length - 1])
            break
          case 'inlineNext':
            if (!u.length) return
            e.preventDefault(),
              g === u.length - 1 ? b(a[c]) : b(v ? d(u, g, 1) : u[0])
            break
          case 'blockPrev': {
            e.preventDefault()
            const t = d(a, c, -1)
            if (v) {
              const e = h(t, g)
              b(e || t)
              break
            }
            b(t)
            break
          }
          case 'blockNext': {
            e.preventDefault()
            const t = d(a, c, 1)
            if (v) {
              const e = h(t, g)
              b(e || t)
              break
            }
            b(t)
          }
        }
      }
      function u(e) {
        const [t] = m(e)
        t && ((0, i.becomeMainElement)(t), t.focus())
      }
      function d(e, t, n) {
        return e[(t + e.length + n) % e.length]
      }
      function h(e, t) {
        const n = p(e)
        return n.length ? n[(t + n.length) % n.length] : null
      }
      function m(e) {
        return Array.from(
          e.querySelectorAll(
            '[data-role="menuitem"]:not([disabled]):not([aria-disabled])',
          ),
        ).filter((0, a.createScopedVisibleElementFilter)(e))
      }
      function p(e) {
        return Array.from(
          e.querySelectorAll('[tabindex]:not([disabled]):not([aria-disabled])'),
        ).filter((0, a.createScopedVisibleElementFilter)(e))
      }
    },
    57177: (e, t, n) => {
      var s
      function i(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:main-element'))
      }
      function o(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:secondary-element'))
      }
      n.d(t, { becomeMainElement: () => i, becomeSecondaryElement: () => o }),
        ((e) => {
          ;(e.MainElement = 'roving-tabindex:main-element'),
            (e.SecondaryElement = 'roving-tabindex:secondary-element')
        })(s || (s = {}))
    },
    10838: (e, t, n) => {
      n.d(t, { AccessibleMenuItem: () => u })
      var s = n(50959),
        i = n(97754),
        o = n.n(i),
        a = n(3343),
        r = n(50238),
        l = n(16396),
        c = n(26448)
      function u(e) {
        const { className: t, ...n } = e,
          [i, u] = (0, r.useRovingTabindexElement)(null)
        return s.createElement(l.PopupMenuItem, {
          ...n,
          className: o()(c.accessible, e.isActive && c.active, t),
          reference: i,
          tabIndex: u,
          onKeyDown: (e) => {
            if (e.target !== e.currentTarget) return
            const t = (0, a.hashFromEvent)(e)
            ;(13 !== t && 32 !== t) ||
              (e.preventDefault(),
              i.current instanceof HTMLElement && i.current.click())
          },
          'data-role': 'menuitem',
          'aria-disabled': e.isDisabled || void 0,
          toolboxRole: 'toolbar',
        })
      }
    },
    6190: (e, t, n) => {
      n.d(t, { Toolbar: () => d })
      var s = n(50959),
        i = n(50151),
        o = n(47201),
        a = n(3343),
        r = n(19291),
        l = n(57177),
        c = n(39416),
        u = n(7047)
      const d = (0, s.forwardRef)((e, t) => {
        const {
            onKeyDown: n,
            orientation: d,
            blurOnEscKeydown: h = !0,
            blurOnClick: m = !0,
            ...p
          } = e,
          g = (0, c.useFunctionalRefObject)(t)
        return (
          (0, s.useLayoutEffect)(() => {
            const e = (0, i.ensureNotNull)(g.current),
              t = () => {
                const t = (0, r.queryTabbableElements)(e).sort(
                  r.navigationOrderComparator,
                )
                if (0 === t.length) {
                  const [t] = (0, r.queryFocusableElements)(e).sort(
                    r.navigationOrderComparator,
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
          s.createElement('div', {
            ...u.MouseClickAutoBlurHandler.attributes(m),
            ...p,
            role: 'toolbar',
            'aria-orientation': d,
            ref: g,
            onKeyDown: (0, o.createSafeMulticastEventHandler)((e) => {
              if (e.defaultPrevented) return
              if (!(document.activeElement instanceof HTMLElement)) return
              const t = (0, a.hashFromEvent)(e)
              if (h && 27 === t)
                return e.preventDefault(), void document.activeElement.blur()
              if ('vertical' !== d && 37 !== t && 39 !== t) return
              if ('vertical' === d && 38 !== t && 40 !== t) return
              const n = e.currentTarget,
                s = (0, r.queryFocusableElements)(n).sort(
                  r.navigationOrderComparator,
                )
              if (0 === s.length) return
              const i = s.indexOf(document.activeElement)
              if (-1 === i) return
              e.preventDefault()
              const o = () => {
                  const e = (i + s.length - 1) % s.length
                  ;(0, l.becomeSecondaryElement)(s[i]),
                    (0, l.becomeMainElement)(s[e]),
                    s[e].focus()
                },
                c = () => {
                  const e = (i + s.length + 1) % s.length
                  ;(0, l.becomeSecondaryElement)(s[i]),
                    (0, l.becomeMainElement)(s[e]),
                    s[e].focus()
                }
              switch ((0, r.mapKeyCodeToDirection)(t)) {
                case 'inlinePrev':
                  'vertical' !== d && o()
                  break
                case 'inlineNext':
                  'vertical' !== d && c()
                  break
                case 'blockPrev':
                  'vertical' === d && o()
                  break
                case 'blockNext':
                  'vertical' === d && c()
              }
            }, n),
            'data-tooltip-show-on-focus': 'true',
          })
        )
      })
    },
    68426: (e, t, n) => {
      n.r(t), n.d(t, { BottomToolbarRenderer: () => Nt })
      var s = n(50959),
        i = n(32227),
        o = n(11542),
        a = n(19036),
        r = n(97754),
        l = n.n(r),
        c = n(56570),
        u = n(88811),
        d = n(78135),
        h = n(59064),
        m = n(90692),
        p = n(10838),
        g = n(11684),
        v = n(50151),
        b = n(51768),
        f = n(77151),
        _ = n(52033),
        C = n(85049)
      const x = (e) =>
          o.t(
            null,
            { plural: '{str} minutes', count: e, replace: { str: `${e}` } },
            n(5926),
          ),
        y = (e) =>
          o.t(
            null,
            { plural: '{str} hours', count: e, replace: { str: `${e}` } },
            n(64963),
          ),
        E = (e) =>
          o.t(
            null,
            { plural: '{str} months', count: e, replace: { str: `${e}` } },
            n(20062),
          ),
        S = (e) => e,
        M = {
          [S('1')]: { resolution: '1', text: x(1) },
          [S('3')]: { resolution: '3', text: x(3) },
          [S('5')]: { resolution: '5', text: x(5) },
          [S('15')]: { resolution: '15', text: x(15) },
          [S('30')]: { resolution: '30', text: x(30) },
          [S('45')]: { resolution: '45', text: x(45) },
          [S('60')]: { resolution: '60', text: y(1) },
          [S('120')]: { resolution: '120', text: y(2) },
          [S('180')]: { resolution: '180', text: y(3) },
          [S('240')]: { resolution: '240', text: y(4) },
          [S('1D')]: {
            resolution: '1D',
            text:
              ((R = 1),
              o.t(
                null,
                { plural: '{str} days', count: R, replace: { str: `${R}` } },
                n(62368),
              )),
          },
          [S('1W')]: {
            resolution: '1W',
            text:
              ((w = 1),
              o.t(
                null,
                { plural: '{str} weeks', count: w, replace: { str: `${w}` } },
                n(49306),
              )),
          },
          [S('1M')]: { resolution: '1M', text: E(1) },
          [S('3M')]: { resolution: '3M', text: E(3) },
          [S('6M')]: { resolution: '6M', text: E(6) },
          [S('12M')]: {
            resolution: '12M',
            text:
              ((k = 1),
              o.t(
                null,
                { plural: '{str} years', count: k, replace: { str: `${k}` } },
                n(91549),
              )),
          },
        }
      var k, w, R
      function T(e) {
        const t = ((e) => {
            const t = e.value.value,
              s = C.Interval.parse(t)
            if (!s.isValid()) {
              if ('YTD' === t)
                return o.t(null, { context: 'timeframe_title' }, n(19273))
              if ('ALL' === t)
                return o.t(null, { context: 'timeframe_title' }, n(58221))
              if ('LASTSESSION' === t) return D(1)
            }
            if (s.isMinutes()) {
              const e = s.multiplier()
              return e % 60 != 0 ? A(e) : B(e / 60)
            }
            if (s.isDays()) return D(s.multiplier())
            if (s.isWeeks()) return N(s.multiplier())
            if (s.isMonths()) {
              const e = s.multiplier()
              return e % 12 != 0 ? W(e) : P(e / 12)
            }
            return e.description || e.text
          })(e),
          s = ((e) => {
            const t = e.targetResolution,
              n = C.Interval.parse(t)
            if (n.isMinutes()) {
              const e = n.multiplier()
              return e % 60 != 0 ? F(e) : L(e / 60)
            }
            if (n.isDays()) return z(n.multiplier())
            if (n.isWeeks()) return O(n.multiplier())
            if (n.isMonths()) {
              const e = n.multiplier()
              return e % 12 != 0 ? H(e) : I(e / 12)
            }
            return M[t].text
          })(e)
        return o.t(
          null,
          {
            replace: { timePeriod: t, timeInterval: s },
            context: 'timeframe_title',
          },
          n(58426),
        )
      }
      const A = (e) =>
          o.t(
            null,
            {
              plural: '{str} minutes',
              count: e,
              replace: { str: `${e}` },
              context: 'timeframe_title',
            },
            n(95484),
          ),
        B = (e) =>
          o.t(
            null,
            {
              plural: '{str} hours',
              count: e,
              replace: { str: `${e}` },
              context: 'timeframe_title',
            },
            n(72495),
          ),
        D = (e) =>
          o.t(
            null,
            {
              plural: '{str} days',
              count: e,
              replace: { str: `${e}` },
              context: 'timeframe_title',
            },
            n(63808),
          ),
        N = (e) =>
          o.t(
            null,
            {
              plural: '{str} weeks',
              count: e,
              replace: { str: `${e}` },
              context: 'timeframe_title',
            },
            n(6088),
          ),
        W = (e) =>
          o.t(
            null,
            {
              plural: '{str} months',
              count: e,
              replace: { str: `${e}` },
              context: 'timeframe_title',
            },
            n(12752),
          ),
        P = (e) =>
          o.t(
            null,
            {
              plural: '{str} years',
              count: e,
              replace: { str: `${e}` },
              context: 'timeframe_title',
            },
            n(96325),
          ),
        F = (e) =>
          o.t(
            null,
            {
              plural: '{str} minutes intervals',
              count: e,
              replace: { str: `${e}` },
              context: 'timeframe_title',
            },
            n(15489),
          ),
        L = (e) =>
          o.t(
            null,
            {
              plural: '{str} hours intervals',
              count: e,
              replace: { str: `${e}` },
              context: 'timeframe_title',
            },
            n(14887),
          ),
        z = (e) =>
          o.t(
            null,
            {
              plural: '{str} days intervals',
              count: e,
              replace: { str: `${e}` },
              context: 'timeframe_title',
            },
            n(561),
          ),
        O = (e) =>
          o.t(
            null,
            {
              plural: '{str} weeks intervals',
              count: e,
              replace: { str: `${e}` },
              context: 'timeframe_title',
            },
            n(60316),
          ),
        H = (e) =>
          o.t(
            null,
            {
              plural: '{str} months intervals',
              count: e,
              replace: { str: `${e}` },
              context: 'timeframe_title',
            },
            n(48514),
          ),
        I = (e) =>
          o.t(
            null,
            {
              plural: '{str} years intervals',
              count: e,
              replace: { str: `${e}` },
              context: 'timeframe_title',
            },
            n(78971),
          )
      class j {
        constructor(e) {
          ;(this._state = { ranges: [] }),
            (this._change = new _.Delegate()),
            (this._rangeChangedListenerBound = this._onRangeChanged.bind(this)),
            (this._updateAvailableRangesBound =
              this._updateAvailableRanges.bind(this, void 0))
          const { chartWidget: t } = (this._context = e)
          t.withModel(null, () => {
            const e = t.model(),
              n = e.mainSeries()
            n.onStatusChanged().subscribe(this, this._updateAvailableRanges),
              c.enabled('update_timeframes_set_on_symbol_resolve') &&
                n
                  .dataEvents()
                  .symbolResolved()
                  .subscribe(this, this._updateAvailableRangesBound),
              n
                .priceScale()
                .properties()
                .childs()
                .lockScale.subscribe(this, this._updateAvailableRangesBound)
            const s = e.model().appliedTimeFrame()
            s.subscribe(this._rangeChangedListenerBound),
              this._rangeChangedListenerBound(s.value()),
              this._updateAvailableRanges(!0)
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
            n = { val: e.value, res: e.targetResolution }
          t.setTimeFrame(n)
        }
        destroy() {
          const { chartWidget: e } = this._context
          e.withModel(null, () => {
            const t = e.model(),
              n = t.mainSeries()
            n.onStatusChanged().unsubscribe(this, this._updateAvailableRanges),
              c.enabled('update_timeframes_set_on_symbol_resolve') &&
                n
                  .dataEvents()
                  .symbolResolved()
                  .unsubscribe(this, this._updateAvailableRangesBound),
              n
                .priceScale()
                .properties()
                .childs()
                .lockScale.unsubscribe(this, this._updateAvailableRangesBound),
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
        _updateAvailableRanges(e) {
          const { availableTimeFrames: t, chartWidget: n } = this._context
          if (!n.hasModel()) return
          const s = n.model().mainSeries(),
            i = s.symbolInfo(),
            o = s.status()
          if (2 === o || 1 === o || (e && !i)) return
          const a = t(i, o).map((e) => ({
            ...e,
            description: '' === e.description ? T(e) : e.description,
          }))
          this._setState({ ranges: a })
        }
      }
      const X = (0, f.registryContextType)()
      function U(e) {
        var t
        return (
          ((t = class extends s.PureComponent {
            constructor(e, t) {
              super(e, t),
                (this._handleUpdate = (e) => {
                  this.setState(e)
                }),
                (this._handleSelectRange = (e) => {
                  ;(0, b.trackEvent)(
                    'GUI',
                    'Chart Bottom Toolbar',
                    `range ${e.value}`,
                  ),
                    this.props.onSelectRange?.(e),
                    this._binding.selectRange(e)
                }),
                (0, f.validateRegistry)(t, {
                  availableTimeFrames: a.any.isRequired,
                  chartWidgetCollection: a.any.isRequired,
                  chartWidget: a.any.isRequired,
                }),
                V.has(t.chartWidget) || V.set(t.chartWidget, new j(t))
              const n = (this._binding = (0, v.ensureDefined)(
                V.get(t.chartWidget),
              ))
              this.state = n.state()
            }
            componentDidMount() {
              this._binding.onChange().subscribe(this, this._handleUpdate)
            }
            componentWillUnmount() {
              this._binding.onChange().unsubscribe(this, this._handleUpdate)
            }
            render() {
              return s.createElement(e, {
                goToDateButton: this.props.goToDateButton,
                className: this.props.className,
                ranges: this.state.ranges,
                activeRange: this.state.activeRange,
                onSelectRange: this._handleSelectRange,
              })
            }
          }).contextType = X),
          t
        )
      }
      const V = new WeakMap()
      var J = n(62400),
        q = n(23829),
        G = n(1109),
        Q = n(34585),
        $ = n(90752),
        Z = n(69873)
      function K(e) {
        const { ranges: t, activeRange: n, onSelectRange: i } = e
        return s.createElement(
          s.Fragment,
          null,
          t.map((e) =>
            s.createElement(q.ContextMenuItem, {
              key: e.value.value,
              label: e.description || e.text,
              active: n === e.value.value,
              checked: n === e.value.value,
              checkable: !0,
              disabled: !1,
              onClick: o.bind(null, e),
              doNotCloseOnClick: !1,
              subItems: [],
            }),
          ),
        )
        function o(e) {
          e && i && i(e), (0, h.globalCloseMenu)()
        }
      }
      function Y(e) {
        const { onGoToDateClick: t } = e
        return s.createElement(
          s.Fragment,
          null,
          s.createElement(G.Separator, { className: Z.separator }),
          s.createElement(q.ContextMenuItem, {
            icon: $,
            label: (0, Q.appendEllipsis)(o.t(null, void 0, n(42432))),
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
      const ee = {
          title: o.t(null, void 0, n(85444)),
          goToDate: (0, Q.appendEllipsis)(o.t(null, void 0, n(42432))),
        },
        te = (0, f.registryContextType)()
      class ne extends s.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._handleGoToDateClick = () => {
              const { chartWidget: e } = this.context
              ;(0, J.showGoToDateDialog)(e), (0, h.globalCloseMenu)()
            }),
            (this._handleRangeSelect = (e) => {
              e && this.props.onSelectRange && this.props.onSelectRange(e),
                (0, h.globalCloseMenu)()
            }),
            (this._renderChildren = (e) => {
              const {
                ranges: t,
                activeRange: n,
                goToDateButton: i,
              } = this.props
              return e
                ? s.createElement(
                    s.Fragment,
                    null,
                    s.createElement(K, {
                      ranges: t,
                      activeRange: n,
                      onSelectRange: this._handleRangeSelect,
                    }),
                    i &&
                      s.createElement(Y, {
                        onGoToDateClick: this._handleGoToDateClick,
                      }),
                  )
                : s.createElement(
                    s.Fragment,
                    null,
                    t.map((e) =>
                      s.createElement(p.AccessibleMenuItem, {
                        key: e.value.value,
                        label: e.description || e.text,
                        isActive: n === e.value.value,
                        onClick: this._handleRangeSelect,
                        onClickArg: e,
                      }),
                    ),
                    i &&
                      t.length > 0 &&
                      s.createElement(g.PopupMenuSeparator, null),
                    i &&
                      s.createElement(p.AccessibleMenuItem, {
                        label: ee.goToDate,
                        onClick: this._handleGoToDateClick,
                      }),
                  )
            }),
            (0, f.validateRegistry)(t, { chartWidget: a.any.isRequired })
        }
        render() {
          return s.createElement(
            m.MatchMedia,
            { rule: '(max-width: 440px)' },
            (e) =>
              s.createElement(
                u.ToolbarMenuButton,
                {
                  className: l()(Z.button, this.props.className),
                  content: ee.title,
                  arrow: !0,
                  verticalAttachEdge: d.VerticalAttachEdge.Top,
                  verticalDropDirection:
                    d.VerticalDropDirection.FromBottomToTop,
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
      ne.contextType = te
      const se = U(ne)
      var ie = n(72808)
      const oe = ie
      function ae(e) {
        return class extends s.PureComponent {
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
              n = this._generateTabs()
            return s.createElement(
              'div',
              {
                className: r(t, ie.tabs),
                'data-name': this.props['data-name'],
              },
              n,
              s.createElement(e, {
                reference: (e) => {
                  this._slider = e
                },
              }),
            )
          }
          _generateTabs() {
            return (
              (this.activeTab.current = null),
              s.Children.map(this.props.children, (e) => {
                const t = e,
                  n = Boolean(t.props.isActive),
                  i = {
                    reference: (e) => {
                      n && (this.activeTab.current = e),
                        t.props.reference && t.props.reference(e)
                    },
                  }
                return s.cloneElement(t, i)
              })
            )
          }
          _componentDidUpdate() {
            const e = (0, v.ensureNotNull)(this._slider).style
            if (this.activeTab.current) {
              const t = this.activeTab.current.offsetWidth,
                n = this.activeTab.current.offsetLeft
              ;(e.transform = `translateX(${n}px)`),
                (e.width = `${t}px`),
                (e.opacity = '1')
            } else e.opacity = '0'
          }
        }
      }
      ae((e) =>
        s.createElement('div', { className: ie.slider, ref: e.reference }),
      )
      var re = n(40173),
        le = n(20792),
        ce = n(40337)
      ;(0, re.mergeThemes)(le.DEFAULT_TOOLBAR_BUTTON_THEME, ce)
      function ue(e) {
        const {
            reference: t,
            text: n,
            tooltip: i,
            isActive: o,
            className: a,
            onClick: l,
            theme: c = ce,
            ...u
          } = e,
          d = r(a, c.item, { [c.isActive]: o })
        return s.createElement(le.ToolbarButton, {
          ...u,
          ref: t,
          text: n,
          isActive: o,
          tooltip: i,
          className: d,
          onClick: l,
        })
      }
      var de = n(35546)
      const he = (0, re.mergeThemes)(oe, de)
      var me = n(38680)
      const pe = ae((e) =>
        s.createElement(
          'div',
          { className: r(e.className, he.slider), ref: e.reference },
          s.createElement('div', { className: he.inner }),
        ),
      )
      const ge = U((e) => {
        const { className: t, ranges: n, activeRange: i, onSelectRange: o } = e
        return s.createElement(
          pe,
          { className: r(me.sliderRow, t), 'data-name': 'date-ranges-tabs' },
          n.map((e) =>
            s.createElement(ue, {
              key: e.value.value,
              value: e.value.value,
              'data-name': `date-range-tab-${e.value.value}`,
              isActive: i === e.value.value,
              onClick: o && o.bind(null, e),
              text: e.text,
              tooltip: e.description || e.text,
            }),
          ),
        )
      })
      var ve = n(61814),
        be = n(68335),
        fe = n(45827),
        _e = n(92574),
        Ce = n(74153)
      const xe = (0, ve.hotKeySerialize)({
          keys: [(0, be.humanReadableModifiers)(be.Modifiers.Alt, !1), 'G'],
          text: '{0} + {1}',
        }),
        ye = (0, f.registryContextType)()
      class Ee extends s.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._handleClick = () => {
              const { chartWidget: e } = this.context
              ;(0, b.trackEvent)('GUI', 'Chart Bottom Toolbar', 'go to'),
                (0, J.showGoToDateDialog)(e)
            }),
            (0, f.validateRegistry)(t, { chartWidget: a.any.isRequired })
        }
        render() {
          const { className: e } = this.props
          return s.createElement(fe.ToolbarIconButton, {
            icon: _e,
            onClick: this._handleClick,
            'data-tooltip-hotkey': xe,
            tooltip: o.t(null, void 0, n(42432)),
            'data-name': 'go-to-date',
            className: r(Ce.button, e),
          })
        }
      }
      Ee.contextType = ye
      const Se = U(Ee)
      var Me = n(76460),
        ke = n(82112),
        we = n(15344),
        Re = n(29023),
        Te = n(2740),
        Ae = n(63146),
        Be = n(11497),
        De = n(40443),
        Ne = n(47825)
      const We = (0, re.mergeThemes)(le.DEFAULT_TOOLBAR_BUTTON_THEME, {
        isDisabled: Ne.disabled,
        button: Ne.button,
      })
      const Pe = (0, f.registryContextType)()
      class Fe extends s.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._timeFormatter = new we.TimeFormatter(
              (0, Ae.getHourMinuteSecondFormat)(
                Be.timeHoursFormatProperty.value(),
              ),
            )),
            (this._tickInterval = void 0),
            (this._element = null),
            (this._menuShown = !1),
            (this._preventShowingMenu = !1),
            (this._tickClock = () => {
              const { chartApiInstance: e } = this.context
              if (void 0 !== this._timezone) {
                const t = (0, Te.utc_to_cal)(this._timezone, e.serverTime())
                this.setState({ time: this._timeFormatter.format(t) })
              }
            }),
            (this._getActions = () => {
              if (!this.props.withMenu) return []
              const { chartWidget: e } = this.context
              return ((e) => {
                const t = e.actions()
                return t && t.applyTimeZone instanceof Re.Action
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
                return void De.ContextMenuManager.hideAll()
              const t = (0, v.ensureNotNull)(this._element),
                n = this._getActions()
              if (0 === n.length) return
              const s = t.getBoundingClientRect()
              De.ContextMenuManager.showMenu(
                n,
                { clientX: s.left, clientY: s.top, attachToYBy: 'bottom' },
                {
                  returnFocus: !0,
                  takeFocus: !0,
                  isKeyboardEvent: (0, Me.isKeyboardClick)(e),
                },
                { menuName: 'TimezoneMenuContextMenu' },
                () => {
                  this._menuShown = !1
                },
              ).then(() => {
                this._menuShown = !0
              })
            }),
            (0, f.validateRegistry)(t, {
              chartWidget: a.any.isRequired,
              chartApiInstance: a.any.isRequired,
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
                Be.timeHoursFormatProperty.subscribe(
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
                Be.timeHoursFormatProperty.unsubscribe(
                  this,
                  this._timeHoursFormatPropertyChanged,
                )
            })
        }
        render() {
          const { className: e, withMenu: t } = this.props,
            { time: i } = this.state,
            a =
              void 0 !== this._timezone
                ? (0, ke.parseTzOffset)(this._timezone.name()).string
                : null
          return s.createElement(le.ToolbarButton, {
            onMouseDown: this._onMouseDown,
            ref: this._handleRef,
            onClick: this._showMenu,
            isDisabled: !t,
            theme: We,
            'data-name': 'time-zone-menu',
            tooltip: t ? o.t(null, void 0, n(77073)) : void 0,
            className: e,
            text: i && a && `${i} ${a}`,
          })
        }
        updateTimezonesButton() {
          const { chartWidget: e } = this.context
          if (!e.hasModel()) return
          if (null === e.model().mainSeries().symbolInfo()) return
          const t = (0, v.ensureNotNull)(
            e.model().model().timezoneExceptExchange().value(),
          )
          ;(this._timezone = (0, Te.get_timezone)(t)), this._tickClock()
        }
        _timeHoursFormatPropertyChanged() {
          ;(this._timeFormatter = new we.TimeFormatter(
            (0, Ae.getHourMinuteSecondFormat)(
              Be.timeHoursFormatProperty.value(),
            ),
          )),
            this.updateTimezonesButton()
        }
      }
      Fe.contextType = Pe
      var Le = n(83580)
      function ze(e) {
        return s.createElement('span', {
          className: r(Le.separator, e.className),
        })
      }
      var Oe = n(6190),
        He = n(45126),
        Ie = n(49483)
      class je {
        constructor(e, t, n) {
          ;(this._highlighted = !1),
            (this._chartWidget = e),
            (this._priceScaleGetter = t),
            (this._owner = n),
            (this._setHighlight = this._setHighlight.bind(this)),
            (this._removeHighlight = this._removeHighlight.bind(this))
        }
        destroy() {
          this._highlighted && this._removeHighlight()
        }
        handlers() {
          const e = Ie.CheckMobile.any()
          return {
            onMouseEnter: e ? void 0 : this._setHighlight,
            onMouseLeave: e ? void 0 : this._removeHighlight,
          }
        }
        _setHighlight() {
          if (!this._chartWidget.hasModel()) return
          const e = this._chartWidget.model().model(),
            t = e.paneForSource(e.mainSeries()),
            n = this._priceScaleGetter()
          if (null === t || null === n) return
          const s = this._chartWidget.paneByState(t)
          if (null !== s) {
            const t = s.rightPriceAxisesContainer().findAxisWidgetForScale(n)
            let i = null
            null !== t && (i = t.axisInfo())
            const o = s.leftPriceAxisesContainer().findAxisWidgetForScale(n)
            null !== o && (i = o.axisInfo())
            const a = s.highlightedPriceAxis()
            null !== i &&
              a.value().axis !== i &&
              (a.setValue({ owner: this._owner, axis: i }),
              e.lightUpdate(),
              (this._highlighted = !0))
          }
        }
        _removeHighlight() {
          if (!this._chartWidget.hasModel()) return
          const e = this._chartWidget.model().model(),
            t = e.paneForSource(e.mainSeries())
          if (null === t) return
          const n = this._chartWidget.paneByState(t)
          if (null !== n) {
            const t = n.highlightedPriceAxis(),
              s = t.value()
            null !== s.axis &&
              s.owner === this._owner &&
              (t.setValue({ owner: this._owner, axis: null }),
              e.lightUpdate(),
              (this._highlighted = !1))
          }
        }
      }
      const Xe = (0, f.registryContextType)(),
        Ue = new He.TranslatedString(
          'toggle log scale',
          o.t(null, void 0, n(49403)),
        )
      const Ve = (0, f.registryContextType)(),
        Je = new He.TranslatedString(
          'toggle auto scale',
          o.t(null, void 0, n(42240)),
        )
      const qe = (0, f.registryContextType)(),
        Ge = new He.TranslatedString(
          'toggle percentage scale',
          o.t(null, void 0, n(98994)),
        )
      const Qe = (0, f.registryContextType)()
      var $e = n(42142),
        Ze = n(14729),
        Ke = n(3343),
        Ye = n(16829),
        et = n(95700),
        tt = n(28580)
      const nt = new He.TranslatedString(
          'change session',
          o.t(null, void 0, n(87041)),
        ),
        st = {
          hint: o.t(null, void 0, n(94031)),
          headerMenuText: o.t(null, void 0, n(27665)),
        },
        it = (0, ve.hotKeySerialize)({
          keys: [
            (0, Ke.humanReadableModifiers)(Ke.Modifiers.Alt, !1),
            (0, Ke.humanReadableModifiers)(Ke.Modifiers.Shift, !1),
            'E',
          ],
          text: '{0} + {1} + {2}',
        }),
        ot = (0, f.registryContextType)()
      class at extends s.PureComponent {
        constructor(e, t) {
          super(e, t),
            (0, f.validateRegistry)(t, {
              chartWidget: a.any.isRequired,
              chartApiInstance: a.any.isRequired,
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
            { sessionName: n, sessionDescription: i } = this.state
          return s.createElement(
            u.ToolbarMenuButton,
            {
              arrow: !1,
              isDisabled: !t,
              content: n,
              className: e,
              closeOnClickOutside: !0,
              tooltip: t ? i : void 0,
              hotKey: it,
              'data-name': 'session-menu',
              verticalDropDirection: d.VerticalDropDirection.FromBottomToTop,
              verticalAttachEdge: d.VerticalAttachEdge.Top,
              onClick: this._trackClick,
            },
            this._menuItems(),
          )
        }
        updateSessionButton() {
          const { chartWidget: e } = this.context
          if (!e.model()) return
          const t = e.model().mainSeries().symbolInfo()
          if (null === t) return
          const n = t.subsession_id,
            s = t.subsessions?.filter((e) => !e.private) ?? [],
            i = s.find((e) => e.id === n)
          this.setState({
            sessionId: n,
            sessionName: (0, et.translateSessionShortDescription)(
              i?.description || '',
            ),
            sessionDescription: (0, et.translateSessionDescription)(
              i?.description || '',
            ),
            availableSessions: s,
          })
        }
        _menuItems() {
          if (!this.props.withMenu) return []
          const { chartWidget: e } = this.context,
            { availableSessions: t } = this.state
          if (!e.model()) return []
          const n = e.model().mainSeries(),
            i = [
              s.createElement(
                Ye.ToolWidgetMenuSummary,
                { key: 'header_menu_text', className: tt.headerMenuText },
                st.headerMenuText.toUpperCase(),
              ),
            ]
          for (const o of t) {
            const t = { category: 'SetSession', event: o.id },
              a = () => {
                e.model().setProperty(
                  n.properties().childs().sessionId,
                  o.id,
                  nt,
                )
              }
            i.push(
              s.createElement(p.AccessibleMenuItem, {
                key: o.id,
                label: (0, et.translateSessionDescription)(o.description),
                isActive: this.state.sessionId === o.id,
                trackEventObject: t,
                onClick: a,
              }),
            )
          }
          return i
        }
        _trackClick() {
          0
        }
      }
      at.contextType = ot
      var rt,
        lt = n(21868),
        ct = n(72026),
        ut = n(51267),
        dt = n(43119)
      !((e) => {
        e[(e.MinSpace = 0)] = 'MinSpace'
      })(rt || (rt = {}))
      const ht = {
        extLabel: o.t(null, void 0, n(8586)),
        extHint: o.t(null, void 0, n(92966)),
        percentageHint: o.t(null, void 0, n(81649)),
        logLabel: o.t(null, { context: 'scale' }, n(4161)),
        logHint: o.t(null, void 0, n(1e4)),
        autoLabel: o.t(null, { context: 'scale' }, n(22233)),
        autoHint: o.t(null, void 0, n(41888)),
        maximizeChartHint: o.t(null, void 0, n(61206)),
        restoreChartHint: o.t(null, void 0, n(31142)),
        adjLabel: o.t(null, { context: 'adjustments' }, n(94920)),
        adjHint: o.t(null, void 0, n(93020)),
        adjForDividendsOnlyHint: o.t(null, void 0, n(2031)),
        adjForSplitsOnlyHint: o.t(null, void 0, n(95739)),
        backAdjustLabel: o.t(null, { context: 'adjustments' }, n(16755)),
        backAdjustHint: o.t(null, void 0, n(68921)),
        settlementAsCloseLabel: o.t(null, { context: 'adjustments' }, n(82631)),
        settlementAsCloseHint: o.t(null, void 0, n(49545)),
      }
      var mt, pt
      !((e) => {
        ;(e.Separator = 'separator'),
          (e.TimeZones = 'timeZones'),
          (e.SessionId = 'session'),
          (e.Percentage = 'percentage'),
          (e.Logarithm = 'logarithm'),
          (e.Auto = 'auto'),
          (e.Fullscreen = 'fullscreen'),
          (e.Adj = 'adj'),
          (e.BackAdj = 'backAdj'),
          (e.SettlementAsClose = 'settlementAsClose'),
          (e.PreventPhoneLayout = 'preventPhoneLayout')
      })(mt || (mt = {})),
        ((e) => {
          ;(e.Expanded = 'expanded'),
            (e.Collapsed = 'collapsed'),
            (e.Hidden = 'hidden')
        })(pt || (pt = {}))
      const gt =
        ((vt = (e) =>
          s.createElement(le.ToolbarButton, {
            text: ht.logLabel,
            tooltip: ht.logHint,
            className: e.className,
            isActive: e.isLogarithm,
            'aria-pressed': e.isLogarithm,
            onClick: kt(e.onClick, 'log', e.isLogarithm),
            onMouseEnter: e.onMouseEnter,
            onMouseLeave: e.onMouseLeave,
            'data-name': 'logarithm',
          })),
        ((bt = class extends s.PureComponent {
          constructor(e, t) {
            super(e, t),
              (this._priceScale = null),
              (this._handleSelect = () => {
                const e = this.context.chartWidget.model(),
                  t = (0, v.ensureNotNull)(this.state.series),
                  n = t.priceScale(),
                  s = n.mode()
                t.priceScale().isLockScale() ||
                  e.setPriceScaleMode({ log: !s.log }, n, Ue)
              }),
              (0, f.validateRegistry)(t, { chartWidget: a.any.isRequired }),
              (this.state = { isActive: !1, series: null }),
              (this._priceAxisHighlighter = new je(
                this.context.chartWidget,
                () => this._priceScale,
                'logarithm',
              ))
          }
          componentDidMount() {
            const e = this.context.chartWidget
            e.withModel(null, () => {
              const t = e.model().mainSeries(),
                n = t.priceScale()
              this._handleMainSeriesPriceScaleChanged(n),
                t
                  .priceScaleChanged()
                  .subscribe(this, this._handleMainSeriesPriceScaleChanged),
                this._handleModeChanged({}, n.mode()),
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
              { isActive: t, series: n } = this.state
            return s.createElement(vt, {
              ...this._priceAxisHighlighter.handlers(),
              className: e,
              isLogarithm: t,
              isDisabled: null === n,
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
        }).contextType = Xe),
        bt)
      var vt, bt
      const ft = ((e) => {
          var t
          return (
            ((t = class extends s.PureComponent {
              constructor(e, t) {
                super(e, t),
                  (this._priceScale = null),
                  (this._handleSelect = () => {
                    const e = this.context.chartWidget.model(),
                      t = (0, v.ensureNotNull)(this.state.series).priceScale(),
                      n = t.mode()
                    e.setPriceScaleMode({ autoScale: !n.autoScale }, t, Je)
                  }),
                  (0, f.validateRegistry)(t, { chartWidget: a.any.isRequired }),
                  (this.state = { isActive: !1, series: null }),
                  (this._priceAxisHighlighter = new je(
                    this.context.chartWidget,
                    () => this._priceScale,
                    'auto',
                  ))
              }
              componentDidMount() {
                const e = this.context.chartWidget
                e.withModel(null, () => {
                  const t = e.model().mainSeries(),
                    n = t.priceScale()
                  this._handleMainSeriesPriceScaleChanged(n),
                    t
                      .priceScaleChanged()
                      .subscribe(this, this._handleMainSeriesPriceScaleChanged),
                    this._handleModeChanged({}, n.mode()),
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
                  { isActive: n, series: i } = this.state
                return s.createElement(e, {
                  ...this._priceAxisHighlighter.handlers(),
                  className: t,
                  isAuto: n,
                  isDisabled: null === i,
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
            }).contextType = Ve),
            t
          )
        })((e) =>
          s.createElement(le.ToolbarButton, {
            text: ht.autoLabel,
            tooltip: ht.autoHint,
            className: e.className,
            isActive: e.isAuto,
            'aria-pressed': e.isAuto,
            onClick: kt(e.onClick, 'auto', e.isAuto),
            onMouseEnter: e.onMouseEnter,
            onMouseLeave: e.onMouseLeave,
            'data-name': 'auto',
          }),
        ),
        _t = ((e) => {
          var t
          return (
            ((t = class extends s.PureComponent {
              constructor(e, t) {
                super(e, t),
                  (this._priceScale = null),
                  (this._handleSelect = () => {
                    const e = this.context.chartWidget.model(),
                      t = (0, v.ensureNotNull)(this.state.series),
                      n = t.priceScale(),
                      s = n.mode()
                    t.priceScale().isLockScale() ||
                      e.setPriceScaleMode({ percentage: !s.percentage }, n, Ge)
                  }),
                  (0, f.validateRegistry)(t, { chartWidget: a.any.isRequired }),
                  (this.state = { isActive: !1, series: null }),
                  (this._priceAxisHighlighter = new je(
                    this.context.chartWidget,
                    () => this._priceScale,
                    'percentage',
                  ))
              }
              componentDidMount() {
                const e = this.context.chartWidget
                e.withModel(null, () => {
                  const t = e.model().mainSeries(),
                    n = t.priceScale()
                  this._handleMainSeriesPriceScaleChanged(n),
                    t
                      .priceScaleChanged()
                      .subscribe(this, this._handleMainSeriesPriceScaleChanged),
                    this._handleScaleChange({}, n.mode()),
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
                  { isActive: n, series: i } = this.state
                return s.createElement(e, {
                  ...this._priceAxisHighlighter.handlers(),
                  className: t,
                  isPercentage: n,
                  isDisabled: null === i,
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
            }).contextType = qe),
            t
          )
        })((e) =>
          s.createElement(le.ToolbarButton, {
            icon: lt,
            tooltip: ht.percentageHint,
            className: e.className,
            isActive: e.isPercentage,
            'aria-pressed': e.isPercentage,
            isDisabled: e.isDisabled,
            onClick: kt(e.onClick, 'percent', e.isPercentage),
            onMouseEnter: e.onMouseEnter,
            onMouseLeave: e.onMouseLeave,
            'data-name': 'percentage',
          }),
        )
      const Ct = (0, ve.hotKeySerialize)({
          keys: [(0, be.humanReadableModifiers)(be.Modifiers.Alt, !1), 'Enter'],
          text: '{0} + {1}',
        }),
        xt = ((e) => {
          var t
          return (
            ((t = class extends s.PureComponent {
              constructor(e, t) {
                super(e, t),
                  (this._handleClick = (e) => {
                    const { resizerDetacher: t, chartWidgetCollection: n } =
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
                  (0, f.validateRegistry)(t, {
                    chartWidgetCollection: a.any.isRequired,
                    resizerDetacher: a.any.isRequired,
                  })
                const { resizerDetacher: n } = t
                this.state = {
                  isFullscreen: n.fullscreen.value(),
                  isChangeLayoutButton: this._isChangeLayoutButton(),
                }
              }
              componentDidMount() {
                const { resizerDetacher: e, chartWidgetCollection: t } =
                    this.context,
                  { mobileChangeLayoutEnabled: n } = this.props
                e.fullscreen.subscribe(this._handleLayoutChange)
              }
              componentWillUnmount() {
                const { resizerDetacher: e, chartWidgetCollection: t } =
                    this.context,
                  { mobileChangeLayoutEnabled: n } = this.props
                e.fullscreen.unsubscribe(this._handleLayoutChange)
              }
              render() {
                const { className: t } = this.props,
                  { isFullscreen: n, isChangeLayoutButton: i } = this.state
                return s.createElement(e, {
                  className: t,
                  isFullscreen: n,
                  onClick: this._handleClick,
                })
              }
              _isChangeLayoutButton() {
                return !1
              }
            }).contextType = Qe),
            t
          )
        })((e) =>
          s.createElement(le.ToolbarButton, {
            icon: e.isFullscreen ? ut : ct,
            tooltip: e.isFullscreen
              ? ht.restoreChartHint
              : ht.maximizeChartHint,
            className: e.className,
            isActive: e.isFullscreen,
            onClick: kt(e.onClick, 'maximize chart', e.isFullscreen),
            'data-tooltip-hotkey': Ct,
            'data-name': 'fullscreen',
          }),
        ),
        yt = { fullscreen: !0, preventPhoneLayout: !0 },
        Et = {
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
        St = (() => {
          const e = new Map()
          return (
            e.set(gt, 'logarithm'),
            e.set(_t, 'percentage'),
            e.set(ft, 'auto'),
            e.set(at, 'session'),
            e.set(xt, 'fullscreen'),
            e
          )
        })()
      function Mt(e) {
        0
      }
      function kt(e, t, n) {
        return (t) => {
          e(t)
        }
      }
      const wt = {
          dateRangeMode: 'hidden',
          noRanges: !1,
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
        Rt = (0, f.registryContextType)()
      class Tt extends s.PureComponent {
        constructor(e, t) {
          var n, o
          super(e, t),
            (this._timezoneButtonRef = null),
            (this._layout = Object.assign({}, wt)),
            (this._raf = null),
            (this._toolbar = null),
            (this._rangeExpanded = null),
            (this._rangeCollapsed = null),
            (this._seriesComponents = {}),
            (this._resizeObserver = null),
            (this._injector =
              ((n = () => this._layout),
              (o = (e, t) => (this._seriesComponents[t] = e)),
              (e, t, i) => {
                if (s.isValidElement(e) && 'string' != typeof e.type) {
                  const { props: t } = e
                  if ('string' == typeof t.className) {
                    const i = { className: t.className },
                      a = n(),
                      l = (0, v.ensureDefined)(St.get(e.type))
                    return s.createElement(
                      'div',
                      {
                        key: null === e.key ? void 0 : e.key,
                        className: r(dt.inline, a[l] && dt.collapsed),
                        ref: (e) => o(e, l),
                        onClick: () => Mt(),
                      },
                      s.cloneElement(e, i),
                    )
                  }
                }
                return e
              })),
            (this._onSymbolSourceCollectionChanged = () => {
              this._updateButtonsVisibilityImp(!0)
            }),
            (this._updateButtonsVisibility = () => {
              this._updateButtonsVisibilityImp()
            }),
            (this._updateButtonsVisibilityImp = (e) => {
              const { chartWidget: t } = this.context,
                n = t.model().model(),
                s = n.mainSeries(),
                i = s.symbolInfo(),
                o = !s.isDWMProperty().value()
              if (s.symbolResolvingActive().value())
                return void this._setStateWithResize(
                  { intervalAllowsSessionButton: o },
                  e,
                )
              const a =
                (i?.subsessions || []).filter((e) => !e.private).length > 1
              this._setStateWithResize(
                {
                  intervalAllowsSessionButton: o,
                  symbolAllowsSessionButton: a,
                },
                e,
              )
            }),
            (this._resizeByRaf = () => {
              null === this._raf &&
                (this._raf = requestAnimationFrame(() => {
                  this._resizeHandler(), (this._raf = null)
                }))
            }),
            (this._resizeHandler = () => {
              const e = this._layout,
                t = (0, v.ensureNotNull)(this._toolbar),
                n = (0, v.ensureNotNull)(this._rangeExpanded),
                s =
                  ((o = ((e) => {
                    const t = {}
                    return (
                      Object.keys(e).forEach((n) => {
                        const s = e[n]
                        if (null !== s) {
                          const e = i.findDOMNode(s)
                          null !== e && (t[n] = e)
                        }
                      }),
                      t
                    )
                  })(this._seriesComponents)),
                  Object.keys(o)
                    .map((e) => ({ name: e, width: o[e].offsetWidth }))
                    .sort((e, t) => Et[e.name] - Et[t.name]))
              var o
              const a = t.offsetWidth,
                r = s.reduce((e, t) => e + t.width, 0),
                l = n.offsetWidth,
                c = !Boolean(n.textContent),
                u = a - r - l <= 0 ? 'collapsed' : 'expanded'
              if (
                (Object.assign(e, { dateRangeMode: u, noRanges: c }),
                'expanded' !== u)
              ) {
                const t =
                  a - (0, v.ensureNotNull)(this._rangeCollapsed).offsetWidth - 0
                let n = 0,
                  i = 0
                for (const o of s)
                  (n += o.width),
                    o.name in yt
                      ? ((i += o.width), Object.assign(e, { [o.name]: !1 }))
                      : Object.assign(e, { [o.name]: t <= n })
                t <= i && Object.assign(e, { dateRangeMode: 'hidden' })
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
              this._applyResizing()
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
            (0, f.validateRegistry)(t, {
              onContentBoxChanged: a.any.isRequired,
              chartApiInstance: a.any.isRequired,
              chartWidget: a.any.isRequired,
              chartWidgetCollection: a.any.isRequired,
              resizerDetacher: a.any.isRequired,
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
            chartWidgetCollection: n,
            chartWidget: s,
          } = this.context
          e.subscribe(this, this._resizeByRaf),
            t.fullscreenable.subscribe(this._handleFullscreenableChange),
            s.withModel(null, () => {
              const e = s.model(),
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
                  .subscribe(this, this._onSymbolSourceCollectionChanged),
                this._updateButtonsVisibility()
            }),
            this.updateTimezonesButton(),
            this.resizeUI()
        }
        componentWillUnmount() {
          const {
            onContentBoxChanged: e,
            resizerDetacher: t,
            chartWidgetCollection: n,
            chartWidget: s,
          } = this.context
          e.unsubscribe(this, this._resizeByRaf),
            t.fullscreenable.unsubscribe(this._handleFullscreenableChange),
            this._resizeObserver?.disconnect(),
            s.withModel(null, () => {
              const e = s.model(),
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
                  .unsubscribe(this, this._onSymbolSourceCollectionChanged),
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
              timeWidgetEnabled: n,
              percentageScaleButtonEnabled: i,
              logScaleButtonEnabled: o,
              autoScaleButtonEnabled: a,
              fullscreenButtonEnabled: l,
            } = this.props
          return s.createElement(
            Oe.Toolbar,
            {
              className: dt.toolbar,
              onContextMenu: Ze.preventDefault,
              ref: this._handleToolbarRef,
            },
            t &&
              s.createElement(
                $e.FragmentMap,
                null,
                s.createElement(
                  'div',
                  {
                    className: r(
                      dt.dateRangeWrapper,
                      'collapsed' !== e.dateRangeMode && dt.collapsed,
                    ),
                    ref: this._handleRangeCollapsedRef,
                  },
                  s.createElement(
                    'div',
                    { className: r(dt.dateRangeCollapsed) },
                    s.createElement(se, {
                      goToDateButton: this.props.goToDateEnabled,
                      className: dt.dateRange,
                    }),
                  ),
                ),
                s.createElement(
                  'div',
                  {
                    className: r(
                      dt.dateRangeWrapper,
                      'expanded' !== e.dateRangeMode && dt.collapsed,
                      e.noRanges && dt.noranges,
                    ),
                    ref: this._handleRangeExpandedRef,
                  },
                  s.createElement(
                    'div',
                    { className: r(dt.dateRangeExpanded) },
                    s.createElement(ge, {
                      onSelectRange: this._trackRangeButtonClick,
                      className: dt.dateRange,
                    }),
                    this.props.goToDateEnabled &&
                      s.createElement(ze, { className: r(dt.separator) }),
                    this.props.goToDateEnabled && s.createElement(Se, null),
                  ),
                ),
              ),
            s.createElement(
              'div',
              { className: dt.seriesControlWrapper },
              n &&
                s.createElement(
                  'div',
                  {
                    className: r(dt.inline, e.timeZones && dt.collapsed),
                    ref: this._handleTimeZonesRef,
                  },
                  s.createElement(
                    'div',
                    {
                      className: dt.inline,
                      onClick: this._trackTimezonesButtonClick,
                    },
                    s.createElement(Fe, {
                      className: dt.item,
                      withMenu: this.props.timezoneMenuEnabled,
                      ref: this._handleTimezoneButtonRef,
                    }),
                  ),
                ),
              this.props.sessionIdButtonEnabled &&
                this.state.symbolAllowsSessionButton &&
                this.state.intervalAllowsSessionButton &&
                s.createElement(
                  'div',
                  {
                    className: r(dt.inline, e.session && dt.collapsed),
                    ref: this._handleSessionsRef,
                  },
                  s.createElement(
                    'div',
                    { className: dt.inline },
                    s.createElement(at, {
                      className: dt.item,
                      withMenu: this.props.sessionIdButtonEnabled,
                    }),
                  ),
                ),
              s.createElement(
                'div',
                {
                  ref: this._handleSeparatorRef,
                  className: r(dt.inline, e.separator && dt.collapsed),
                },
                s.createElement(ze, null),
              ),
              s.createElement(
                $e.FragmentMap,
                { map: this._injector },
                !1,
                !1,
                !1,
                i &&
                  !c.enabled('fundamental_widget') &&
                  s.createElement(_t, { className: dt.item }),
                o && s.createElement(gt, { className: dt.item }),
                a && s.createElement(ft, { className: dt.item }),
                l &&
                  this.state.isFullscreenable &&
                  s.createElement(xt, {
                    className: dt.item,
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
          this._resizeByRaf()
        }
        _trackRangeButtonClick(e) {
          0
        }
        _trackTimezonesButtonClick() {
          Mt()
        }
        _setStateWithResize(e, t) {
          Object.assign(this._layout, wt),
            this._applyResizing(),
            t
              ? (this.setState(e), this._resizeHandler())
              : this.setState(e, () => this._resizeByRaf())
        }
        _applyResizing() {
          const { dateRangeMode: e, noRanges: t, ...n } = this._layout
          this._rangeExpanded &&
            (this._rangeExpanded.classList.toggle(
              dt.collapsed,
              'expanded' !== e,
            ),
            this._rangeExpanded.classList.toggle(dt.noranges, t)),
            this._rangeCollapsed &&
              this._rangeCollapsed.classList.toggle(
                dt.collapsed,
                'collapsed' !== e,
              )
          let s = !1,
            i = !1
          Object.keys(n).forEach((e) => {
            const t = e
            if ('separator' !== t) {
              const e = this._seriesComponents[t],
                o = !0 === n[t]
              e &&
                ('timeZones' === t || 'session' === t
                  ? (s = s || !o)
                  : (i = i || !o),
                e.classList.toggle(dt.collapsed, o))
            }
          })
          const o = this._seriesComponents.separator
          if (o) {
            const e = !s || !i || !0 === n.separator
            o.classList.toggle(dt.collapsed, e)
          }
        }
        _isPreventPhoneLayoutButton() {
          return !1
        }
      }
      Tt.contextType = Rt
      const At = {
        onContentBoxChanged: a.any,
        computeContentBox: a.any,
        chartWidget: a.any,
        chartApiInstance: a.any,
        chartWidgetCollection: a.any,
        resizerDetacher: a.any,
        availableTimeFrames: a.any,
      }
      class Bt extends s.PureComponent {
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
            n = {
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
          return s.createElement(
            f.RegistryProvider,
            { validation: At, value: this._registry },
            s.createElement(Tt, { key: e.id(), ...n }),
          )
        }
        _defineRegistry(e) {
          const {
              onContentBoxChanged: t,
              computeContentBox: n,
              chartApiInstance: s,
              chartWidgetCollection: i,
              options: { timeFramesWidgetEnabled: o, timeFramesWidget: a },
            } = this.props,
            r = o ? a.availableTimeFrames : void 0
          this._registry = {
            onContentBoxChanged: t,
            computeContentBox: n,
            chartWidget: e,
            availableTimeFrames: r,
            chartApiInstance: s,
            chartWidgetCollection: i,
            resizerDetacher: e.getResizerDetacher(),
          }
        }
      }
      var Dt
      !((e) => {
        e.InitializedAttribute = 'data-initialized'
      })(Dt || (Dt = {}))
      class Nt {
        constructor(e, t, n, o, a, r, l) {
          this._container = e
          const c = s.createElement(Bt, {
            onContentBoxChanged: t,
            computeContentBox: n,
            chartWidgetCollection: o,
            chartApiInstance: a,
            chartWidgetOptions: r,
            options: l,
          })
          i.render(c, e), e.setAttribute('data-initialized', 'true')
        }
        destroy() {
          i.unmountComponentAtNode(this._container),
            this._container.removeAttribute('data-initialized')
        }
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
    60925: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M12 4h3v1h-1.04l-.88 9.64a1.5 1.5 0 0 1-1.5 1.36H6.42a1.5 1.5 0 0 1-1.5-1.36L4.05 5H3V4h3v-.5C6 2.67 6.67 2 7.5 2h3c.83 0 1.5.67 1.5 1.5V4ZM7.5 3a.5.5 0 0 0-.5.5V4h4v-.5a.5.5 0 0 0-.5-.5h-3ZM5.05 5l.87 9.55a.5.5 0 0 0 .5.45h5.17a.5.5 0 0 0 .5-.45L12.94 5h-7.9Z"/></svg>'
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
    90752: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="M5.5 13v-2.5m8.5 11h6.5a2 2 0 0 0 2-2v-9m-17 0v-2c0-1.1.9-2 2-2h13a2 2 0 0 1 2 2v2m-17 0h17"/><path fill="currentColor" d="M10 4h1v4h-1V4zM17 4h1v4h-1V4z"/><path stroke="currentColor" d="M4 18.5h7.5m0 0L8 22m3.5-3.5L8 15"/></svg>'
    },
    55698: (e, t, n) => {
      n.d(t, { nanoid: () => s })
      const s = (e = 21) =>
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
