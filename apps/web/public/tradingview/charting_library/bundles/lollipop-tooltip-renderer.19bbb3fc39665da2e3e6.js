;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9039],
  {
    59142: (e, t) => {
      var o, n, r
      ;(n = [t]),
        (o = (e) => {
          function t(e) {
            if (Array.isArray(e)) {
              for (var t = 0, o = Array(e.length); t < e.length; t++)
                o[t] = e[t]
              return o
            }
            return Array.from(e)
          }
          Object.defineProperty(e, '__esModule', { value: !0 })
          var o = !1
          if ('undefined' != typeof window) {
            var n = {
              get passive() {
                o = !0
              },
            }
            window.addEventListener('testPassive', null, n),
              window.removeEventListener('testPassive', null, n)
          }
          var r =
              'undefined' != typeof window &&
              window.navigator &&
              window.navigator.platform &&
              /iP(ad|hone|od)/.test(window.navigator.platform),
            l = [],
            i = !1,
            a = -1,
            s = void 0,
            c = void 0,
            u = (e) =>
              l.some(
                (t) =>
                  !(!t.options.allowTouchMove || !t.options.allowTouchMove(e)),
              ),
            p = (e) => {
              var t = e || window.event
              return (
                !!u(t.target) ||
                1 < t.touches.length ||
                (t.preventDefault && t.preventDefault(), !1)
              )
            },
            d = () => {
              setTimeout(() => {
                void 0 !== c &&
                  ((document.body.style.paddingRight = c), (c = void 0)),
                  void 0 !== s &&
                    ((document.body.style.overflow = s), (s = void 0))
              })
            }
          ;(e.disableBodyScroll = (e, n) => {
            if (r) {
              if (!e)
                return void console.error(
                  'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
                )
              if (e && !l.some((t) => t.targetElement === e)) {
                var d = { targetElement: e, options: n || {} }
                ;(l = [].concat(t(l), [d])),
                  (e.ontouchstart = (e) => {
                    1 === e.targetTouches.length &&
                      (a = e.targetTouches[0].clientY)
                  }),
                  (e.ontouchmove = (t) => {
                    var o, n, r, l
                    1 === t.targetTouches.length &&
                      ((n = e),
                      (l = (o = t).targetTouches[0].clientY - a),
                      !u(o.target) &&
                        ((n && 0 === n.scrollTop && 0 < l) ||
                        ((r = n) &&
                          r.scrollHeight - r.scrollTop <= r.clientHeight &&
                          l < 0)
                          ? p(o)
                          : o.stopPropagation()))
                  }),
                  i ||
                    (document.addEventListener(
                      'touchmove',
                      p,
                      o ? { passive: !1 } : void 0,
                    ),
                    (i = !0))
              }
            } else {
              ;(h = n),
                setTimeout(() => {
                  if (void 0 === c) {
                    var e = !!h && !0 === h.reserveScrollBarGap,
                      t =
                        window.innerWidth - document.documentElement.clientWidth
                    e &&
                      0 < t &&
                      ((c = document.body.style.paddingRight),
                      (document.body.style.paddingRight = t + 'px'))
                  }
                  void 0 === s &&
                    ((s = document.body.style.overflow),
                    (document.body.style.overflow = 'hidden'))
                })
              var m = { targetElement: e, options: n || {} }
              l = [].concat(t(l), [m])
            }
            var h
          }),
            (e.clearAllBodyScrollLocks = () => {
              r
                ? (l.forEach((e) => {
                    ;(e.targetElement.ontouchstart = null),
                      (e.targetElement.ontouchmove = null)
                  }),
                  i &&
                    (document.removeEventListener(
                      'touchmove',
                      p,
                      o ? { passive: !1 } : void 0,
                    ),
                    (i = !1)),
                  (l = []),
                  (a = -1))
                : (d(), (l = []))
            }),
            (e.enableBodyScroll = (e) => {
              if (r) {
                if (!e)
                  return void console.error(
                    'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                  )
                ;(e.ontouchstart = null),
                  (e.ontouchmove = null),
                  (l = l.filter((t) => t.targetElement !== e)),
                  i &&
                    0 === l.length &&
                    (document.removeEventListener(
                      'touchmove',
                      p,
                      o ? { passive: !1 } : void 0,
                    ),
                    (i = !1))
              } else
                1 === l.length && l[0].targetElement === e
                  ? (d(), (l = []))
                  : (l = l.filter((t) => t.targetElement !== e))
            })
        }),
        void 0 === (r = 'function' == typeof o ? o.apply(t, n) : o) ||
          (e.exports = r)
    },
    58222: (e) => {
      e.exports = {
        'light-button': 'light-button-bYDQcOkp',
        link: 'link-bYDQcOkp',
        content: 'content-bYDQcOkp',
        'visually-hidden': 'visually-hidden-bYDQcOkp',
        nowrap: 'nowrap-bYDQcOkp',
        'ellipsis-container': 'ellipsis-container-bYDQcOkp',
        'text-wrap-container': 'text-wrap-container-bYDQcOkp',
        'text-wrap-with-ellipsis': 'text-wrap-with-ellipsis-bYDQcOkp',
        icon: 'icon-bYDQcOkp',
        'force-direction-ltr': 'force-direction-ltr-bYDQcOkp',
        'force-direction-rtl': 'force-direction-rtl-bYDQcOkp',
        'with-grouped': 'with-grouped-bYDQcOkp',
        'variant-quiet-primary': 'variant-quiet-primary-bYDQcOkp',
        selected: 'selected-bYDQcOkp',
        'typography-regular16px': 'typography-regular16px-bYDQcOkp',
        'typography-medium16px': 'typography-medium16px-bYDQcOkp',
        'typography-regular14px': 'typography-regular14px-bYDQcOkp',
        'typography-semibold14px': 'typography-semibold14px-bYDQcOkp',
        'typography-semibold16px': 'typography-semibold16px-bYDQcOkp',
        'size-xsmall': 'size-xsmall-bYDQcOkp',
        'with-start-icon': 'with-start-icon-bYDQcOkp',
        'with-end-icon': 'with-end-icon-bYDQcOkp',
        'no-content': 'no-content-bYDQcOkp',
        wrap: 'wrap-bYDQcOkp',
        'size-small': 'size-small-bYDQcOkp',
        'size-medium': 'size-medium-bYDQcOkp',
        'variant-primary': 'variant-primary-bYDQcOkp',
        'color-gray': 'color-gray-bYDQcOkp',
        caret: 'caret-bYDQcOkp',
        grouped: 'grouped-bYDQcOkp',
        pills: 'pills-bYDQcOkp',
        active: 'active-bYDQcOkp',
        'disable-active-on-touch': 'disable-active-on-touch-bYDQcOkp',
        'disable-active-state-styles': 'disable-active-state-styles-bYDQcOkp',
        'color-green': 'color-green-bYDQcOkp',
        'color-red': 'color-red-bYDQcOkp',
        'variant-secondary': 'variant-secondary-bYDQcOkp',
        'variant-ghost': 'variant-ghost-bYDQcOkp',
      }
    },
    66076: (e) => {
      e.exports = {
        'default-drawer-min-top-distance': '100px',
        wrap: 'wrap-_HnK0UIN',
        positionBottom: 'positionBottom-_HnK0UIN',
        backdrop: 'backdrop-_HnK0UIN',
        drawer: 'drawer-_HnK0UIN',
        positionLeft: 'positionLeft-_HnK0UIN',
      }
    },
    27011: (e, t, o) => {
      function n(e, t) {
        return (
          t ||
          null == e ||
          (('string' == typeof e || Array.isArray(e)) && 0 === e.length)
        )
      }
      o.d(t, { isIconOnly: () => n })
    },
    8025: (e, t, o) => {
      o.d(t, { LightButtonContent: () => v, useLightButtonClasses: () => h })
      var n = o(50959),
        r = o(97754),
        l = o(34094),
        i = o(9745),
        a = o(17946),
        s = o(27011),
        c = o(86332)
      const u = n.createContext({ isInButtonGroup: !1, isGroupPrimary: !1 })
      var p = o(2948),
        d = o(58222),
        m = o.n(d)
      const h = (e, t) => {
        const o = (0, n.useContext)(a.CustomBehaviourContext),
          l = (0, n.useContext)(c.ControlGroupContext),
          { isInButtonGroup: i, isGroupPrimary: p } = (0, n.useContext)(u),
          {
            className: d,
            isSelected: h,
            children: v,
            startIcon: f,
            showCaret: g,
            endIcon: y,
            forceDirection: b,
            iconOnly: w,
            color: x = 'gray',
            variant: C = 'primary',
            size: E = 'medium',
            enableActiveStateStyles: k = o.enableActiveStateStyles,
            typography: O,
            isLink: T = !1,
            textWrap: D,
            isPills: N,
            isActive: S,
          } = e,
          Q =
            m()[
              `typography-${((e, t, o) => {
                if (o) {
                  const e = o.replace(/^\D+/g, '')
                  return t ? `semibold${e}` : o
                }
                return 'xsmall' === e
                  ? t
                    ? 'semibold14px'
                    : 'regular14px'
                  : 'small' === e || 'medium' === e
                    ? t
                      ? 'semibold16px'
                      : 'regular16px'
                    : ''
              })(E, h || N, O || void 0)}`
            ]
        return r(
          d,
          m()['light-button'],
          T && m().link,
          S && m().active,
          h && m().selected,
          (0, s.isIconOnly)(v, w) && m()['no-content'],
          f && m()['with-start-icon'],
          (g || y) && m()['with-end-icon'],
          t && m()['with-grouped'],
          b && m()[`force-direction-${b}`],
          m()[`variant-${p ? 'primary' : C}`],
          m()[`color-${p ? 'gray' : x}`],
          m()[`size-${E}`],
          Q,
          !k && m()['disable-active-state-styles'],
          l.isGrouped && m().grouped,
          D && m().wrap,
          i && m()['disable-active-on-touch'],
          N && m().pills,
        )
      }
      function v(e) {
        const {
          startIcon: t,
          endIcon: o,
          showCaret: a,
          iconOnly: c,
          ellipsis: u = !0,
          textWrap: d,
          tooltipText: h,
          children: v,
        } = e
        return n.createElement(
          n.Fragment,
          null,
          t && n.createElement(i.Icon, { className: m().icon, icon: t }),
          !(0, s.isIconOnly)(v, c) &&
            n.createElement(
              'span',
              {
                className: r(
                  m().content,
                  !d && m().nowrap,
                  'apply-overflow-tooltip',
                  'apply-overflow-tooltip--check-children-recursively',
                  'apply-overflow-tooltip--allow-text',
                ),
                'data-overflow-tooltip-text':
                  null != h ? h : (0, l.getTextForTooltip)(v),
              },
              d || u
                ? n.createElement(
                    n.Fragment,
                    null,
                    n.createElement(
                      'span',
                      {
                        className: r(
                          !d && u && m()['ellipsis-container'],
                          d && m()['text-wrap-container'],
                          d && u && m()['text-wrap-with-ellipsis'],
                        ),
                      },
                      v,
                    ),
                    n.createElement(
                      'span',
                      { className: m()['visually-hidden'], 'aria-hidden': !0 },
                      v,
                    ),
                  )
                : n.createElement(
                    n.Fragment,
                    null,
                    v,
                    n.createElement(
                      'span',
                      { className: m()['visually-hidden'], 'aria-hidden': !0 },
                      v,
                    ),
                  ),
            ),
          (o || a) &&
            ((e) =>
              n.createElement(i.Icon, {
                className: r(m().icon, e.showCaret && m().caret),
                icon: e.showCaret ? p : e.endIcon,
              }))(e),
        )
      }
    },
    15893: (e, t, o) => {
      o.d(t, { LightButton: () => i })
      var n = o(50959),
        r = o(86332),
        l = o(8025)
      function i(e) {
        const { isGrouped: t } = n.useContext(r.ControlGroupContext),
          {
            reference: o,
            className: i,
            isSelected: a,
            children: s,
            startIcon: c,
            iconOnly: u,
            ellipsis: p,
            showCaret: d,
            forceDirection: m,
            endIcon: h,
            color: v,
            variant: f,
            size: g,
            enableActiveStateStyles: y,
            typography: b,
            textWrap: w = !1,
            maxLines: x,
            style: C = {},
            isPills: E,
            isActive: k,
            tooltipText: O,
            ...T
          } = e,
          D = w ? (null != x ? x : 2) : 1,
          N = D > 0 ? { ...C, '--ui-lib-light-button-content-max-lines': D } : C
        return n.createElement(
          'button',
          {
            ...T,
            className: (0, l.useLightButtonClasses)(
              {
                className: i,
                isSelected: a,
                children: s,
                startIcon: c,
                iconOnly: u,
                showCaret: d,
                forceDirection: m,
                endIcon: h,
                color: v,
                variant: f,
                size: g,
                enableActiveStateStyles: y,
                typography: b,
                textWrap: w,
                isPills: E,
                isActive: k,
              },
              t,
            ),
            ref: o,
            style: N,
          },
          n.createElement(
            l.LightButtonContent,
            {
              showCaret: d,
              startIcon: c,
              endIcon: h,
              iconOnly: u,
              ellipsis: p,
              textWrap: w,
              tooltipText: O,
            },
            s,
          ),
        )
      }
    },
    86332: (e, t, o) => {
      o.d(t, { ControlGroupContext: () => n })
      const n = o(50959).createContext({
        isGrouped: !1,
        cellState: { isTop: !0, isRight: !0, isBottom: !0, isLeft: !0 },
      })
    },
    17946: (e, t, o) => {
      o.d(t, { CustomBehaviourContext: () => n })
      const n = (0, o(50959).createContext)({ enableActiveStateStyles: !0 })
      n.displayName = 'CustomBehaviourContext'
    },
    27267: (e, t, o) => {
      function n(e, t, o, n, r) {
        function l(r) {
          if (e > r.timeStamp) return
          const l = r.target
          void 0 !== o &&
            null !== t &&
            null !== l &&
            l.ownerDocument === n &&
            (t.contains(l) || o(r))
        }
        return (
          r.click && n.addEventListener('click', l, !1),
          r.mouseDown && n.addEventListener('mousedown', l, !1),
          r.touchEnd && n.addEventListener('touchend', l, !1),
          r.touchStart && n.addEventListener('touchstart', l, !1),
          () => {
            n.removeEventListener('click', l, !1),
              n.removeEventListener('mousedown', l, !1),
              n.removeEventListener('touchend', l, !1),
              n.removeEventListener('touchstart', l, !1)
          }
        )
      }
      o.d(t, { addOutsideEventListener: () => n })
    },
    34094: (e, t, o) => {
      o.d(t, { getTextForTooltip: () => i })
      var n = o(50959)
      const r = (e) => (0, n.isValidElement)(e) && Boolean(e.props.children),
        l = (e) =>
          null == e || 'boolean' == typeof e || '{}' === JSON.stringify(e)
            ? ''
            : e.toString() + ' ',
        i = (e) =>
          Array.isArray(e) || (0, n.isValidElement)(e)
            ? n.Children.toArray(e)
                .reduce((e, t) => {
                  let o = ''
                  return (
                    (o =
                      (0, n.isValidElement)(t) && r(t)
                        ? i(t.props.children)
                        : (0, n.isValidElement)(t) && !r(t)
                          ? ''
                          : l(t)),
                    e.concat(o)
                  )
                }, '')
                .trim()
            : l(e)
    },
    37558: (e, t, o) => {
      o.d(t, { DrawerContext: () => i, DrawerManager: () => l })
      var n = o(50959),
        r = o(99054)
      class l extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._isBodyFixed = !1),
            (this._addDrawer = (e) => {
              this.setState((t) => ({ stack: [...t.stack, e] }))
            }),
            (this._removeDrawer = (e) => {
              this.setState((t) => ({ stack: t.stack.filter((t) => t !== e) }))
            }),
            (this.state = { stack: [] })
        }
        componentDidUpdate(e, t) {
          !t.stack.length &&
            this.state.stack.length &&
            ((0, r.setFixedBodyState)(!0), (this._isBodyFixed = !0)),
            t.stack.length &&
              !this.state.stack.length &&
              this._isBodyFixed &&
              ((0, r.setFixedBodyState)(!1), (this._isBodyFixed = !1))
        }
        componentWillUnmount() {
          this.state.stack.length &&
            this._isBodyFixed &&
            (0, r.setFixedBodyState)(!1)
        }
        render() {
          return n.createElement(
            i.Provider,
            {
              value: {
                addDrawer: this._addDrawer,
                removeDrawer: this._removeDrawer,
                currentDrawer: this.state.stack.length
                  ? this.state.stack[this.state.stack.length - 1]
                  : null,
              },
            },
            this.props.children,
          )
        }
      }
      const i = n.createContext(null)
    },
    41590: (e, t, o) => {
      o.d(t, { Drawer: () => d })
      var n = o(50959),
        r = o(50151),
        l = o(97754),
        i = o(36174),
        a = o(42842),
        s = o(37558),
        c = o(29197),
        u = o(86656),
        p = o(66076)
      function d(e) {
        const {
            position: t = 'Bottom',
            onClose: o,
            children: u,
            className: d,
            theme: h = p,
          } = e,
          v = (0, r.ensureNotNull)((0, n.useContext)(s.DrawerContext)),
          [f] = (0, n.useState)(() => (0, i.randomHash)()),
          g = (0, n.useRef)(null),
          y = (0, n.useContext)(c.CloseDelegateContext)
        return (
          (0, n.useLayoutEffect)(
            () => (
              (0, r.ensureNotNull)(g.current).focus({ preventScroll: !0 }),
              y.subscribe(v, o),
              v.addDrawer(f),
              () => {
                v.removeDrawer(f), y.unsubscribe(v, o)
              }
            ),
            [],
          ),
          n.createElement(
            a.Portal,
            null,
            n.createElement(
              'div',
              { className: l(p.wrap, p[`position${t}`]) },
              f === v.currentDrawer &&
                n.createElement('div', { className: p.backdrop, onClick: o }),
              n.createElement(
                m,
                {
                  className: l(h.drawer, p[`position${t}`], d),
                  ref: g,
                  'data-name': e['data-name'],
                },
                u,
              ),
            ),
          )
        )
      }
      const m = (0, n.forwardRef)((e, t) => {
        const { className: o, ...r } = e
        return n.createElement(u.TouchScrollContainer, {
          className: l(p.drawer, o),
          tabIndex: -1,
          ref: t,
          ...r,
        })
      })
    },
    20520: (e, t, o) => {
      o.d(t, { PopupMenu: () => d })
      var n = o(50959),
        r = o(962),
        l = o(62942),
        i = o(42842),
        a = o(27317),
        s = o(29197)
      const c = n.createContext(void 0)
      var u = o(36383)
      const p = n.createContext({ setMenuMaxWidth: !1 })
      function d(e) {
        const {
            controller: t,
            children: o,
            isOpened: d,
            closeOnClickOutside: m = !0,
            doNotCloseOn: h,
            onClickOutside: v,
            onClose: f,
            onKeyboardClose: g,
            'data-name': y = 'popup-menu-container',
            ...b
          } = e,
          w = (0, n.useContext)(s.CloseDelegateContext),
          x = n.useContext(p),
          C = (0, n.useContext)(c),
          E = (0, u.useOutsideEvent)({
            handler: (e) => {
              v && v(e)
              if (!m) return
              const t = (0, l.default)(h) ? h() : null == h ? [] : [h]
              if (t.length > 0 && e.target instanceof Node)
                for (const o of t) {
                  const t = r.findDOMNode(o)
                  if (t instanceof Node && t.contains(e.target)) return
                }
              f()
            },
            mouseDown: !0,
            touchStart: !0,
          })
        return d
          ? n.createElement(
              i.Portal,
              {
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                pointerEvents: 'none',
              },
              n.createElement(
                'span',
                { ref: E, style: { pointerEvents: 'auto' } },
                n.createElement(
                  a.Menu,
                  {
                    ...b,
                    onClose: f,
                    onKeyboardClose: g,
                    onScroll: (t) => {
                      const { onScroll: o } = e
                      o && o(t)
                    },
                    customCloseDelegate: w,
                    customRemeasureDelegate: C,
                    ref: t,
                    'data-name': y,
                    limitMaxWidth: x.setMenuMaxWidth,
                  },
                  o,
                ),
              ),
            )
          : null
      }
    },
    86656: (e, t, o) => {
      o.d(t, { TouchScrollContainer: () => a })
      var n = o(50959),
        r = o(59142),
        l = o(50151),
        i = o(49483)
      const a = (0, n.forwardRef)((e, t) => {
        const { children: o, ...l } = e,
          a = (0, n.useRef)(null)
        return (
          (0, n.useImperativeHandle)(t, () => a.current),
          (0, n.useLayoutEffect)(() => {
            if (i.CheckMobile.iOS())
              return (
                null !== a.current &&
                  (0, r.disableBodyScroll)(a.current, { allowTouchMove: s(a) }),
                () => {
                  null !== a.current && (0, r.enableBodyScroll)(a.current)
                }
              )
          }, []),
          n.createElement('div', { ref: a, ...l }, o)
        )
      })
      function s(e) {
        return (t) => {
          const o = (0, l.ensureNotNull)(e.current),
            n = document.activeElement
          return (
            !o.contains(t) || (null !== n && o.contains(n) && n.contains(t))
          )
        }
      }
    },
    40173: (e, t, o) => {
      function n(e, t, o = {}) {
        return Object.assign(
          {},
          e,
          ((e, t, o = {}) => {
            const n = Object.assign({}, t)
            for (const r of Object.keys(t)) {
              const l = o[r] || r
              l in e && (n[r] = [e[l], t[r]].join(' '))
            }
            return n
          })(e, t, o),
        )
      }
      o.d(t, { mergeThemes: () => n })
    },
    25105: (e) => {
      e.exports = {
        drawer: 'drawer-xBKhVqal',
        drawerItem: 'drawerItem-xBKhVqal',
        menuWrap: 'menuWrap-xBKhVqal',
        scrollWrap: 'scrollWrap-xBKhVqal',
        menuBox: 'menuBox-xBKhVqal',
        card: 'card-xBKhVqal',
        cardRow: 'cardRow-xBKhVqal',
        mini: 'mini-xBKhVqal',
        fadeTop: 'fadeTop-xBKhVqal',
        fadeBottom: 'fadeBottom-xBKhVqal',
      }
    },
    95795: (e) => {
      e.exports = {
        lollipopTooltipTitle: 'lollipopTooltipTitle-hkWvPxQc',
        lollipopTooltipTitle_minimal: 'lollipopTooltipTitle_minimal-hkWvPxQc',
        lollipopTooltipTitle__title: 'lollipopTooltipTitle__title-hkWvPxQc',
        lollipopTooltipTitle_mobile: 'lollipopTooltipTitle_mobile-hkWvPxQc',
        lollipopTooltipTitle__icon: 'lollipopTooltipTitle__icon-hkWvPxQc',
      }
    },
    13668: (e) => {
      e.exports = {
        content: 'content-tm3FiOQl',
        contentWithTab: 'contentWithTab-tm3FiOQl',
        group: 'group-tm3FiOQl',
        subtitle: 'subtitle-tm3FiOQl',
        text: 'text-tm3FiOQl',
        tabsWrapper: 'tabsWrapper-tm3FiOQl',
        tabsContentWrapper: 'tabsContentWrapper-tm3FiOQl',
        groupIcon: 'groupIcon-tm3FiOQl',
        beforeMarketOpen: 'beforeMarketOpen-tm3FiOQl',
        afterMarketClose: 'afterMarketClose-tm3FiOQl',
        groupTitle: 'groupTitle-tm3FiOQl',
        groupRow: 'groupRow-tm3FiOQl',
        groupCell: 'groupCell-tm3FiOQl',
        mob: 'mob-tm3FiOQl',
        mini: 'mini-tm3FiOQl',
        generalContent: 'generalContent-tm3FiOQl',
      }
    },
    70434: (e, t, o) => {
      o.r(t), o.d(t, { showLollipopTooltip: () => Y })
      var n = o(50959),
        r = o(962),
        l = o(50151),
        i = o(97754),
        a = o.n(i)
      function s(e, t, o) {
        ;(0, n.useEffect)(() => {
          const n = new IntersectionObserver(
            (e) => {
              e[e.length - 1].intersectionRatio < 0.25 ? o() : t()
            },
            {
              threshold: [0, 0.25, 0.5, 0.75, 1],
              root: null,
              rootMargin: '0px',
            },
          )
          return e.current && n.observe(e.current), () => n.disconnect()
        }, [])
      }
      var c = o(90692),
        u = o(41590),
        p = o(37558),
        d = o(20520),
        m = o(59064),
        h = o(68335),
        v = o(1722)
      const f = (0, n.forwardRef)((e, t) => {
        const {
            onClose: o,
            onForceClose: r,
            onClickOutside: l,
            className: i,
            ...a
          } = e,
          s = (0, n.useRef)(null)
        ;(0, n.useEffect)(
          () => (
            m.globalCloseDelegate.subscribe(null, r),
            () => {
              m.globalCloseDelegate.unsubscribe(null, r)
            }
          ),
          [r],
        )
        const c = (0, n.useCallback)(
            (e) => {
              27 === (0, h.hashFromEvent)(e) && (e.preventDefault(), r())
            },
            [r],
          ),
          u = (0, n.useCallback)(() => {
            s.current && s.current.focus({ preventScroll: !0 })
          }, [])
        return n.createElement(
          d.PopupMenu,
          {
            className: i,
            isOpened: !0,
            tabIndex: -1,
            reference: (e) => {
              'function' == typeof t
                ? t(e)
                : (0, v.isObject)(t) && (t.current = e),
                (s.current = e)
            },
            onClose: o,
            onClickOutside: l,
            onKeyDown: c,
            onOpen: u,
            ...a,
          },
          e.children,
        )
      })
      function g(e) {
        ;(0, n.useEffect)(() => {
          return (
            (e = y),
            window.addEventListener('scroll', e),
            () => window.removeEventListener('scroll', e)
          )
          var e
        }, []),
          (0, n.useEffect)(() => {
            if (e.length)
              return ((e, t) => {
                for (const o of e) o.subscribe(null, t)
                return () => {
                  for (const o of e) o.unsubscribe(null, t)
                }
              })(e, y)
          }, e)
      }
      function y() {
        ;(0, m.globalCloseMenu)()
      }
      f.displayName = 'TooltipPopup'
      var b = o(40173),
        w = o(27317),
        x = o(9745),
        C = o(95795)
      function E(e) {
        const { title: t, icon: o, iconStyle: r, className: l, cardType: i } = e
        return n.createElement(
          'div',
          {
            className: a()(
              C.lollipopTooltipTitle,
              [
                'mob' === i && C.lollipopTooltipTitle_mobile,
                'mini' === i && C.lollipopTooltipTitle_minimal,
              ],
              l,
            ),
          },
          o &&
            n.createElement(x.Icon, {
              icon: o,
              className: C.lollipopTooltipTitle__icon,
              style: r,
            }),
          n.createElement(
            'span',
            { className: C.lollipopTooltipTitle__title },
            t,
          ),
        )
      }
      var k = o(15893)
      function O(e) {
        const { text: t, onClick: o } = e
        return n.createElement(
          k.LightButton,
          { onClick: o, size: 'xsmall' },
          ' ',
          t,
          ' ',
        )
      }
      var T,
        D = o(13668)
      function N(e) {
        const {
          name: t,
          value: o,
          style: r,
          valueStyle: l,
          onValueClick: i,
          valueRightIcon: s,
          className: c,
        } = e
        return n.createElement(
          'div',
          { className: a()(D.groupRow, c), style: r },
          t &&
            n.createElement(
              'div',
              { className: D.groupCell },
              n.createElement('span', { className: D.text }, t),
            ),
          n.createElement(
            'div',
            { className: D.groupCell },
            n.createElement(
              'span',
              { className: D.text, style: l, onClick: i },
              o,
            ),
            s &&
              n.createElement(x.Icon, {
                icon: s.iconContent,
                className: a()(
                  D.groupIcon,
                  s.iconClass,
                  'apply-common-tooltip',
                ),
                title: s.tooltipText,
              }),
          ),
        )
      }
      function S(e) {
        const { content: t = [], subTitle: o, cardRowClass: r } = e,
          l = t.map((e, t) => {
            const { title: o, content: r } = e
            return n.createElement(
              'div',
              { key: `group${t}`, className: D.group },
              o && n.createElement('span', { className: D.groupTitle }, o),
              r.map((e, t) =>
                n.createElement(N, { key: `contentRow${t}`, ...e }),
              ),
            )
          }),
          i =
            'string' == typeof o
              ? o
              : o.map((e, t) =>
                  n.createElement(N, { key: `subTitle${t}`, ...e }),
                )
        return n.createElement(
          'div',
          { className: r },
          n.createElement('span', { className: D.subtitle }, i),
          l.length > 0 && n.createElement('div', null, l),
        )
      }
      !((e) => {
        ;(e[(e.BeforeMarketOpen = D.beforeMarketOpen)] = 'BeforeMarketOpen'),
          (e[(e.AfterMarketClose = D.afterMarketClose)] = 'AfterMarketClose')
      })(T || (T = {}))
      function Q(e) {
        var t
        const { cardType: o, anchor: r, title: l, tooltipIcon: i, ...s } = e,
          c = o ? a()(D.content, D[o]) : D.content,
          u = (0, n.useMemo)(() => {
            var t
            return l && i
              ? {
                  color:
                    null === (t = e.style) || void 0 === t ? void 0 : t.color,
                }
              : void 0
          }, [
            !!l,
            !!i,
            null === (t = e.style) || void 0 === t ? void 0 : t.color,
          ])
        return n.createElement(
          'div',
          { className: c },
          l &&
            n.createElement(E, {
              title: l,
              icon: i,
              iconStyle: u,
              cardType: o,
            }),
          'common' === s.type && n.createElement(S, { ...s }),
          r &&
            ('mob' !== o || !r.hideInMobileMode) &&
            n.createElement(
              'div',
              { className: D.group },
              n.createElement(O, { ...r }),
            ),
        )
      }
      var B = o(25105)
      const F = (0, b.mergeThemes)(w.DEFAULT_MENU_THEME, {
        menuWrap: B.menuWrap,
        menuBox: B.menuBox,
      })
      function I(e) {
        const {
            tooltips: t,
            onClose: o,
            onForceClose: r,
            onClickOutside: l,
            position: i,
            customCloseSubscriptions: d = [],
            showScrollFades: m,
            cardType: h,
            doNotCloseOn: v,
          } = e,
          y = (0, n.useRef)(null),
          b = (0, n.useRef)(null),
          w = (0, n.useRef)(null),
          x = (0, n.useRef)(null),
          [C, E] = (0, n.useState)('100%'),
          k = (e) => {
            null !== e && E(`${e.clientWidth}px`)
          },
          [O, T] = (0, n.useState)(!1)
        s(
          w,
          () => T(!1),
          () => T(!0),
        )
        const D = { display: O ? 'block' : 'none', width: C },
          [N, S] = (0, n.useState)(!1)
        s(
          x,
          () => S(!1),
          () => S(!0),
        )
        const I = { display: N ? 'block' : 'none', width: C }
        g(d)
        const M = h ? a()(B.card, B[h]) : B.card
        return n.createElement(
          p.DrawerManager,
          null,
          n.createElement(
            c.MatchMedia,
            { rule: 'screen and (max-width: 419px)' },
            (e) =>
              e
                ? n.createElement(
                    u.Drawer,
                    {
                      className: B.drawer,
                      onClose: r || o,
                      position: 'Bottom',
                    },
                    t.map((e, t) =>
                      n.createElement(
                        'div',
                        { key: `${t}`, className: B.drawerItem },
                        n.createElement(Q, { cardType: 'mob', ...e }),
                      ),
                    ),
                  )
                : n.createElement(
                    f,
                    {
                      position: i,
                      theme: F,
                      onClose: o,
                      onForceClose: r || o,
                      onClickOutside: l,
                      doNotCloseOn: v,
                    },
                    m &&
                      n.createElement(
                        n.Fragment,
                        null,
                        n.createElement('div', {
                          ref: y,
                          className: B.fadeTop,
                          style: D,
                        }),
                        n.createElement('div', { ref: w }),
                      ),
                    n.createElement(
                      'div',
                      { ref: k },
                      t.map((e, t) => {
                        var o
                        return n.createElement(
                          'div',
                          {
                            key: `${t}`,
                            className: M,
                            style: {
                              borderColor:
                                null === (o = e.style) || void 0 === o
                                  ? void 0
                                  : o.color,
                            },
                          },
                          n.createElement(Q, { cardType: h, ...e }),
                        )
                      }),
                    ),
                    m &&
                      n.createElement(
                        n.Fragment,
                        null,
                        n.createElement('div', { ref: x }),
                        n.createElement('div', {
                          ref: b,
                          className: B.fadeBottom,
                          style: I,
                        }),
                      ),
                  ),
          ),
        )
      }
      let M = null
      function Y(e) {
        if (!e.items.length) return () => {}
        const t = {
          tooltips: e.items,
          onClose: _,
          onForceClose: () => {
            _(), 'function' == typeof e.onCustomClose && e.onCustomClose()
          },
          onClickOutside: e.onClickOutside,
          doNotCloseOn: e.doNotCloseOn,
          position: L.bind(null, e.position),
          customCloseSubscriptions: e.customCloseSubscriptions,
          showScrollFades: e.showScrollFades,
          cardType: e.cardType,
        }
        return (
          null === M &&
            ((M = document.createElement('div')), document.body.appendChild(M)),
          r.render(n.createElement(I, { ...t }), M),
          _
        )
      }
      function _() {
        null !== M && (r.unmountComponentAtNode(M), M.remove(), (M = null))
      }
      function L(e, t) {
        const { contentWidth: o, contentHeight: n } = t,
          r = e.target,
          i = r.getBoundingClientRect(),
          a = i.width - e.targetSize.width,
          s = i.height - e.targetSize.height,
          c = (0, l.ensureNotNull)(r.closest('.chart-container')),
          u = c.getBoundingClientRect(),
          p = (0, l.ensureNotNull)(c.parentElement).getBoundingClientRect(),
          d = i.left + e.point.x + a,
          m = Math.round(d - o / 2),
          h = Math.min(m + o, u.right, p.right)
        let v,
          f,
          g = Math.max(h - o, u.left, p.left)
        g + o >= p.right && (g = p.right - o)
        const y = u.bottom - (i.top + e.point.y + s),
          b = u.height - y - e.marginTop
        return (
          b < n
            ? ((f = e.marginTop + u.top), (v = Math.max(b, 0)))
            : (f = u.height + u.top - y - n),
          { x: g, y: f, overrideHeight: v }
        )
      }
    },
    2948: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M3.92 7.83 9 12.29l5.08-4.46-1-1.13L9 10.29l-4.09-3.6-.99 1.14Z"/></svg>'
    },
    25931: (e, t, o) => {
      o.d(t, { nanoid: () => n })
      const n = (e = 21) =>
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
