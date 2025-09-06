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
    97754: (e, t) => {
      var o
      !(() => {
        var n = {}.hasOwnProperty
        function r() {
          for (var e = [], t = 0; t < arguments.length; t++) {
            var o = arguments[t]
            if (o) {
              var l = typeof o
              if ('string' === l || 'number' === l) e.push(o)
              else if (Array.isArray(o) && o.length) {
                var i = r.apply(null, o)
                i && e.push(i)
              } else if ('object' === l)
                for (var a in o) n.call(o, a) && o[a] && e.push(a)
            }
          }
          return e.join(' ')
        }
        e.exports
          ? ((r.default = r), (e.exports = r))
          : void 0 === (o = (() => r).apply(t, [])) || (e.exports = o)
      })()
    },
    88317: (e) => {
      e.exports = {
        pills: 'pills-PVWoXu5j',
        primary: 'primary-PVWoXu5j',
        gray: 'gray-PVWoXu5j',
        selected: 'selected-PVWoXu5j',
        grouped: 'grouped-PVWoXu5j',
        active: 'active-PVWoXu5j',
        disableActiveOnTouch: 'disableActiveOnTouch-PVWoXu5j',
        disableActiveStateStyles: 'disableActiveStateStyles-PVWoXu5j',
        withGrouped: 'withGrouped-PVWoXu5j',
        'quiet-primary': 'quiet-primary-PVWoXu5j',
        green: 'green-PVWoXu5j',
        red: 'red-PVWoXu5j',
        blue: 'blue-PVWoXu5j',
        secondary: 'secondary-PVWoXu5j',
        ghost: 'ghost-PVWoXu5j',
      }
    },
    1538: (e) => {
      e.exports = {
        lightButton: 'lightButton-bYDQcOkp',
        link: 'link-bYDQcOkp',
        ltr: 'ltr-bYDQcOkp',
        rtl: 'rtl-bYDQcOkp',
        'typography-regular16px': 'typography-regular16px-bYDQcOkp',
        'typography-medium16px': 'typography-medium16px-bYDQcOkp',
        'typography-regular14px': 'typography-regular14px-bYDQcOkp',
        'typography-semibold14px': 'typography-semibold14px-bYDQcOkp',
        'typography-semibold16px': 'typography-semibold16px-bYDQcOkp',
        content: 'content-bYDQcOkp',
        visuallyHidden: 'visuallyHidden-bYDQcOkp',
        nowrap: 'nowrap-bYDQcOkp',
        ellipsisContainer: 'ellipsisContainer-bYDQcOkp',
        textWrapContainer: 'textWrapContainer-bYDQcOkp',
        textWrapWithEllipsis: 'textWrapWithEllipsis-bYDQcOkp',
        slot: 'slot-bYDQcOkp',
        caret: 'caret-bYDQcOkp',
        activeCaret: 'activeCaret-bYDQcOkp',
        xsmall: 'xsmall-bYDQcOkp',
        withStartSlot: 'withStartSlot-bYDQcOkp',
        withEndSlot: 'withEndSlot-bYDQcOkp',
        noContent: 'noContent-bYDQcOkp',
        wrap: 'wrap-bYDQcOkp',
        small: 'small-bYDQcOkp',
        medium: 'medium-bYDQcOkp',
      }
    },
    36718: (e) => {
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
    9038: (e, t, o) => {
      o.d(t, { useLightButtonClasses: () => c })
      var n = o(50959),
        r = o(97754),
        l = o(17946),
        i = o(27011),
        a = o(86332)
      const s = n.createContext({ isInButtonGroup: !1, isGroupPrimary: !1 }),
        c = (e, t, o) => {
          const c = (0, n.useContext)(l.CustomBehaviourContext),
            {
              className: u,
              isSelected: p,
              children: d,
              showCaret: m,
              forceDirection: h,
              iconOnly: f,
              color: v = 'gray',
              variant: g = 'primary',
              size: y = 'medium',
              enableActiveStateStyles: b = c.enableActiveStateStyles,
              typography: C,
              isLink: w = !1,
              textWrap: x,
              isPills: E,
              isActive: k,
              startSlot: S,
              endSlot: O,
            } = t,
            T =
              e[
                `typography-${((e, t, o) => {
                  if (o) {
                    const e = o.replace(/^\D+/g, '')
                    return t ? `semibold${e}` : o
                  }
                  switch (e) {
                    case 'xsmall':
                      return t ? 'semibold14px' : 'regular14px'
                    case 'small':
                    case 'medium':
                      return t ? 'semibold16px' : 'regular16px'
                    default:
                      return ''
                  }
                })(y, p || E, C || void 0)}`
              ],
            N = (0, n.useContext)(a.ControlGroupContext),
            { isInButtonGroup: B, isGroupPrimary: D } = (0, n.useContext)(s)
          return r(
            u,
            e.lightButton,
            w && e.link,
            k && e.active,
            p && e.selected,
            (0, i.isIconOnly)(d, f) && e.noContent,
            !!S && e.withStartSlot,
            (m || !!O) && e.withEndSlot,
            o && e.withGrouped,
            h && e[h],
            e[D ? 'primary' : g],
            e[D ? 'gray' : v],
            e[y],
            T,
            !b && e.disableActiveStateStyles,
            N.isGrouped && e.grouped,
            x && e.wrap,
            B && e.disableActiveOnTouch,
            E && e.pills,
          )
        }
    },
    66860: (e, t, o) => {
      o.d(t, { LightButtonContent: () => d })
      var n = o(50959),
        r = o(97754),
        l = o(34094),
        i = o(27011),
        a = o(9745),
        s = o(2948),
        c = o(1538),
        u = o.n(c)
      const p = (e) =>
        n.createElement(a.Icon, {
          className: r(u().caret, e && u().activeCaret),
          icon: s,
        })
      function d(e) {
        const {
          showCaret: t,
          iconOnly: o,
          ellipsis: a = !0,
          textWrap: s,
          tooltipText: c,
          children: d,
          endSlot: m,
          startSlot: h,
          isActiveCaret: f,
        } = e
        ;[m, t].filter((e) => !!e)
        return n.createElement(
          n.Fragment,
          null,
          h &&
            n.createElement(
              'span',
              { className: r(u().slot, u().startSlot) },
              h,
            ),
          !(0, i.isIconOnly)(d, o) &&
            n.createElement(
              'span',
              {
                className: r(
                  u().content,
                  !s && u().nowrap,
                  'apply-overflow-tooltip',
                  'apply-overflow-tooltip--check-children-recursively',
                  'apply-overflow-tooltip--allow-text',
                ),
                'data-overflow-tooltip-text': c ?? (0, l.getTextForTooltip)(d),
              },
              s || a
                ? n.createElement(
                    n.Fragment,
                    null,
                    n.createElement(
                      'span',
                      {
                        className: r(
                          !s && a && u().ellipsisContainer,
                          s && u().textWrapContainer,
                          s && a && u().textWrapWithEllipsis,
                        ),
                      },
                      d,
                    ),
                    n.createElement(
                      'span',
                      { className: u().visuallyHidden, 'aria-hidden': !0 },
                      d,
                    ),
                  )
                : n.createElement(
                    n.Fragment,
                    null,
                    d,
                    n.createElement(
                      'span',
                      { className: u().visuallyHidden, 'aria-hidden': !0 },
                      d,
                    ),
                  ),
            ),
          m &&
            n.createElement('span', { className: r(u().slot, u().endSlot) }, m),
          t && p(f),
        )
      }
    },
    15893: (e, t, o) => {
      o.d(t, { LightButton: () => p })
      var n = o(50959),
        r = o(86332),
        l = o(9038),
        i = o(66860),
        a = o(1538),
        s = o.n(a),
        c = o(88317),
        u = o.n(c)
      function p(e) {
        const { isGrouped: t } = n.useContext(r.ControlGroupContext),
          {
            reference: o,
            className: a,
            isSelected: c,
            children: p,
            iconOnly: d,
            ellipsis: m,
            showCaret: h,
            forceDirection: f,
            endSlot: v,
            startSlot: g,
            color: y,
            variant: b,
            size: C,
            enableActiveStateStyles: w,
            typography: x,
            textWrap: E = !1,
            maxLines: k,
            style: S = {},
            isPills: O,
            isActive: T,
            tooltipText: N,
            role: B,
            ...D
          } = e,
          W = E ? (k ?? 2) : 1,
          Q = W > 0 ? { ...S, '--ui-lib-light-button-content-max-lines': W } : S
        return n.createElement(
          'button',
          {
            ...D,
            className: (0, l.useLightButtonClasses)(
              { ...u(), ...s() },
              {
                className: a,
                isSelected: c,
                children: p,
                iconOnly: d,
                showCaret: h,
                forceDirection: f,
                endSlot: v,
                startSlot: g,
                color: y,
                variant: b,
                size: C,
                enableActiveStateStyles: w,
                typography: x,
                textWrap: E,
                isPills: O,
                isActive: T,
              },
              t,
            ),
            ref: o,
            style: Q,
            role: B,
          },
          n.createElement(
            i.LightButtonContent,
            {
              showCaret: h,
              isActiveCaret: h && (O || T || c),
              iconOnly: d,
              ellipsis: m,
              textWrap: E,
              tooltipText: N,
              endSlot: v,
              startSlot: g,
            },
            p,
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
      o.d(t, { Drawer: () => m })
      var n = o(50959),
        r = o(50151),
        l = o(97754),
        i = o(92184),
        a = o(42842),
        s = o(37558),
        c = o(29197),
        u = o(86656),
        p = o(36718)
      var d
      function m(e) {
        const {
            position: t = 'Bottom',
            onClose: o,
            children: u,
            reference: d,
            className: m,
            theme: f = p,
          } = e,
          v = (0, r.ensureNotNull)((0, n.useContext)(s.DrawerContext)),
          [g] = (0, n.useState)(() => (0, i.randomHash)()),
          y = (0, n.useRef)(null),
          b = (0, n.useContext)(c.CloseDelegateContext)
        return (
          (0, n.useLayoutEffect)(
            () => (
              (0, r.ensureNotNull)(y.current).focus({ preventScroll: !0 }),
              b.subscribe(v, o),
              v.addDrawer(g),
              () => {
                v.removeDrawer(g), b.unsubscribe(v, o)
              }
            ),
            [],
          ),
          n.createElement(
            a.Portal,
            null,
            n.createElement(
              'div',
              { ref: d, className: l(p.wrap, p[`position${t}`]) },
              g === v.currentDrawer &&
                n.createElement('div', { className: p.backdrop, onClick: o }),
              n.createElement(
                h,
                {
                  className: l(f.drawer, p[`position${t}`], m),
                  ref: y,
                  'data-name': e['data-name'],
                },
                u,
              ),
            ),
          )
        )
      }
      !((e) => {
        ;(e.Left = 'Left'), (e.Bottom = 'Bottom')
      })(d || (d = {}))
      const h = (0, n.forwardRef)((e, t) => {
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
        r = o(32227),
        l = o(88987),
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
            onClickOutside: f,
            onClose: v,
            onKeyboardClose: g,
            'data-name': y = 'popup-menu-container',
            ...b
          } = e,
          C = (0, n.useContext)(s.CloseDelegateContext),
          w = n.useContext(p),
          x = (0, n.useContext)(c),
          E = (0, u.useOutsideEvent)({
            handler: (e) => {
              f && f(e)
              if (!m) return
              const t = (0, l.default)(h) ? h() : null == h ? [] : [h]
              if (t.length > 0 && e.target instanceof Node)
                for (const o of t) {
                  const t = r.findDOMNode(o)
                  if (t instanceof Node && t.contains(e.target)) return
                }
              v()
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
                    onClose: v,
                    onKeyboardClose: g,
                    onScroll: (t) => {
                      const { onScroll: o } = e
                      o && o(t)
                    },
                    customCloseDelegate: C,
                    customRemeasureDelegate: x,
                    ref: t,
                    'data-name': y,
                    limitMaxWidth: w.setMenuMaxWidth,
                    'data-tooltip-show-on-focus': 'true',
                  },
                  o,
                ),
              ),
            )
          : null
      }
    },
    86656: (e, t, o) => {
      o.d(t, { TouchScrollContainer: () => c })
      var n = o(50959),
        r = o(59142),
        l = o(50151),
        i = o(49483)
      const a = CSS.supports('overscroll-behavior', 'none')
      let s = 0
      const c = (0, n.forwardRef)((e, t) => {
        const { children: o, ...l } = e,
          c = (0, n.useRef)(null)
        return (
          (0, n.useImperativeHandle)(t, () => c.current),
          (0, n.useLayoutEffect)(() => {
            if (i.CheckMobile.iOS())
              return (
                s++,
                null !== c.current &&
                  (a
                    ? 1 === s &&
                      (document.body.style.overscrollBehavior = 'none')
                    : (0, r.disableBodyScroll)(c.current, {
                        allowTouchMove: u(c),
                      })),
                () => {
                  s--,
                    null !== c.current &&
                      (a
                        ? 0 === s &&
                          (document.body.style.overscrollBehavior = '')
                        : (0, r.enableBodyScroll)(c.current))
                }
              )
          }, []),
          n.createElement('div', { ref: c, ...l }, o)
        )
      })
      function u(e) {
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
    51287: (e) => {
      e.exports = {
        drawer: 'drawer-xBKhVqal',
        drawerItem: 'drawerItem-xBKhVqal',
        menuWrap: 'menuWrap-xBKhVqal',
        scrollWrap: 'scrollWrap-xBKhVqal',
        menuBox: 'menuBox-xBKhVqal',
        card: 'card-xBKhVqal',
        fadeTop: 'fadeTop-xBKhVqal',
        fadeBottom: 'fadeBottom-xBKhVqal',
      }
    },
    40711: (e) => {
      e.exports = {
        lollipopTooltipTitle: 'lollipopTooltipTitle-hkWvPxQc',
        lollipopTooltipTitle_minimal: 'lollipopTooltipTitle_minimal-hkWvPxQc',
        lollipopTooltipTitle__title: 'lollipopTooltipTitle__title-hkWvPxQc',
        lollipopTooltipTitle_mobile: 'lollipopTooltipTitle_mobile-hkWvPxQc',
        lollipopTooltipTitle__icon: 'lollipopTooltipTitle__icon-hkWvPxQc',
      }
    },
    88010: (e) => {
      e.exports = {
        wrap: 'wrap-tm3FiOQl',
        content: 'content-tm3FiOQl',
        subtitle: 'subtitle-tm3FiOQl',
        text: 'text-tm3FiOQl',
        group: 'group-tm3FiOQl',
        groupIcon: 'groupIcon-tm3FiOQl',
        beforeMarketOpen: 'beforeMarketOpen-tm3FiOQl',
        afterMarketClose: 'afterMarketClose-tm3FiOQl',
        groupTitle: 'groupTitle-tm3FiOQl',
        groupRow: 'groupRow-tm3FiOQl',
        groupCell: 'groupCell-tm3FiOQl',
        mob: 'mob-tm3FiOQl',
        mini: 'mini-tm3FiOQl',
        generalContent: 'generalContent-tm3FiOQl',
        keyFactContent: 'keyFactContent-tm3FiOQl',
        keyFactContent__title: 'keyFactContent__title-tm3FiOQl',
        newsContentItem: 'newsContentItem-tm3FiOQl',
      }
    },
    184: (e, t, o) => {
      o.r(t), o.d(t, { showLollipopTooltip: () => I })
      var n = o(50959),
        r = o(32227),
        l = o(50151),
        i = o(97754),
        a = o.n(i),
        s = o(20057)
      function c(e, t, o) {
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
      var u = o(90692),
        p = o(41590),
        d = o(37558),
        m = o(20520),
        h = o(59064),
        f = o(68335),
        v = o(37265)
      const g = (0, n.forwardRef)((e, t) => {
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
            h.globalCloseDelegate.subscribe(null, r),
            () => {
              h.globalCloseDelegate.unsubscribe(null, r)
            }
          ),
          [r],
        )
        const c = (0, n.useCallback)(
            (t) => {
              e.onKeyDown?.(t),
                27 === (0, f.hashFromEvent)(t) && (t.preventDefault(), r())
            },
            [r],
          ),
          u = (0, n.useCallback)(() => {
            s.current && s.current.focus({ preventScroll: !0 })
          }, [])
        return n.createElement(
          m.PopupMenu,
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
      function y(e) {
        ;(0, n.useEffect)(() => {
          return (
            (e = b),
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
              })(e, b)
          }, e)
      }
      function b() {
        ;(0, h.globalCloseMenu)()
      }
      g.displayName = 'TooltipPopup'
      var C = o(40173),
        w = o(27317),
        x = o(9745),
        E = o(40711)
      function k(e) {
        const {
          title: t,
          icon: o,
          iconStyle: r,
          className: l,
          cardType: i,
          informationButtonProps: s,
        } = e
        return n.createElement(
          'div',
          {
            className: a()(
              E.lollipopTooltipTitle,
              [
                'mob' === i && E.lollipopTooltipTitle_mobile,
                'mini' === i && E.lollipopTooltipTitle_minimal,
              ],
              l,
            ),
          },
          o &&
            n.createElement(x.Icon, {
              icon: o,
              className: E.lollipopTooltipTitle__icon,
              style: r,
            }),
          n.createElement(
            'span',
            { className: E.lollipopTooltipTitle__title },
            t,
          ),
          !1,
        )
      }
      var S = o(15893)
      function O(e) {
        const { text: t, onClick: o } = e
        return n.createElement(
          S.LightButton,
          { onClick: o, size: 'xsmall' },
          ' ',
          t,
          ' ',
        )
      }
      o(11542)
      var T,
        N,
        B = o(88010)
      function D(e) {
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
          { className: a()(B.groupRow, c), style: r },
          t &&
            n.createElement(
              'div',
              { className: B.groupCell },
              n.createElement('span', { className: B.text }, t),
            ),
          n.createElement(
            'div',
            { className: B.groupCell },
            n.createElement(
              'span',
              { className: B.text, style: l, onClick: i },
              o,
            ),
            s &&
              n.createElement(x.Icon, {
                icon: s.iconContent,
                className: a()(
                  B.groupIcon,
                  s.iconClass,
                  'apply-common-tooltip',
                ),
                title: s.tooltipText,
              }),
          ),
        )
      }
      function W(e) {
        const { content: t = [], subTitle: o, cardRowClass: r } = e,
          l = t.map((e, t) => {
            const { title: o, content: r } = e
            return n.createElement(
              'div',
              { key: `group${t}`, className: B.group },
              o && n.createElement('span', { className: B.groupTitle }, o),
              r.map((e, t) =>
                n.createElement(D, { key: `contentRow${t}`, ...e }),
              ),
            )
          }),
          i =
            'string' == typeof o
              ? o
              : o.map((e, t) =>
                  n.createElement(D, { key: `subTitle${t}`, ...e }),
                )
        return n.createElement(
          'div',
          { className: r },
          n.createElement('span', { className: B.subtitle }, i),
          l.length > 0 && n.createElement('div', null, l),
        )
      }
      function Q(e) {
        return null
      }
      function F(e) {
        const {
            cardType: t,
            anchor: o,
            title: r,
            tooltipIcon: l,
            tooltipInformationButtonProps: i,
            className: s,
            ...c
          } = e,
          u = t ? a()(B.content, B[t]) : B.content,
          p = (0, n.useMemo)(
            () => (r && l ? { color: e.style?.color } : void 0),
            [!!r, !!l, e.style?.color],
          ),
          d = c.style ? { borderColor: c.style.color } : { borderStyle: 'none' }
        return n.createElement(
          'div',
          { className: a()(B.wrap, s), style: d },
          n.createElement(
            'div',
            { className: u },
            r &&
              n.createElement(k, {
                title: r,
                icon: l,
                informationButtonProps: i,
                iconStyle: p,
                cardType: t,
              }),
            (() => {
              switch (c.type) {
                case 'common':
                  return n.createElement(W, { ...c })
                case 'news':
                  return n.createElement(Q, { ...c, cardType: t })
              }
            })(),
            o &&
              ('mob' !== t || !o.hideInMobileMode) &&
              n.createElement(
                'div',
                { className: B.group },
                n.createElement(O, { ...o }),
              ),
          ),
        )
      }
      !((e) => {
        ;(e[(e.BeforeMarketOpen = B.beforeMarketOpen)] = 'BeforeMarketOpen'),
          (e[(e.AfterMarketClose = B.afterMarketClose)] = 'AfterMarketClose')
      })(T || (T = {})),
        ((e) => {
          ;(e.Mobile = 'mob'), (e.Minimal = 'mini')
        })(N || (N = {}))
      var M = o(51287)
      const P = (0, C.mergeThemes)(w.DEFAULT_MENU_THEME, {
        menuWrap: M.menuWrap,
        menuBox: M.menuBox,
      })
      function _(e) {
        const {
            tooltips: t,
            onClose: o,
            onClickOutside: r,
            onSizeChanged: l,
            position: i,
            customCloseSubscriptions: m = [],
            showScrollFades: h,
            cardType: f,
            className: v,
            reference: b,
          } = e,
          C = (0, n.useRef)(null),
          w = (0, n.useRef)(null),
          x = (0, n.useRef)(null),
          E = (0, n.useRef)(null),
          k = (0, n.useRef)(null),
          [S, O] = (0, n.useState)('100%'),
          T = (e) => {
            null !== e && O(`${e.clientWidth}px`)
          },
          [N, B] = (0, n.useState)(!1)
        c(
          E,
          () => B(!1),
          () => B(!0),
        )
        const D = { display: N ? 'block' : 'none', width: S },
          [W, Q] = (0, n.useState)(!1)
        c(
          k,
          () => Q(!1),
          () => Q(!0),
        )
        const _ = { display: W ? 'block' : 'none', width: S }
        return (
          y(m),
          (0, n.useEffect)(() => o, []),
          (0, n.useEffect)(() => {
            C.current && C.current.update()
          }, [i]),
          (0, n.useEffect)(() => {
            if (l) {
              const e = {}
              return (
                l.subscribe(
                  e,
                  (0, s.default)(() => {
                    C.current && C.current.update()
                  }, 100),
                ),
                () => {
                  l.unsubscribeAll(e)
                }
              )
            }
          }, []),
          n.createElement(
            d.DrawerManager,
            null,
            n.createElement(
              u.MatchMedia,
              { rule: '(max-width: 419px)' },
              (e) =>
                e
                  ? n.createElement(
                      p.Drawer,
                      {
                        className: a()(M.drawer, v),
                        onClose: o,
                        position: 'Bottom',
                        reference: b,
                      },
                      t.map((e, t) =>
                        n.createElement(F, {
                          key: `${t}`,
                          className: M.drawerItem,
                          cardType: 'mob',
                          ...e,
                        }),
                      ),
                    )
                  : n.createElement(
                      g,
                      {
                        ref: b,
                        position: i,
                        theme: P,
                        onClose: o,
                        onForceClose: o,
                        onClickOutside: r,
                        closeOnClickOutside: !1,
                        controller: C,
                      },
                      h &&
                        n.createElement(
                          n.Fragment,
                          null,
                          n.createElement('div', {
                            ref: w,
                            className: M.fadeTop,
                            style: D,
                          }),
                          n.createElement('div', { ref: E }),
                        ),
                      n.createElement(
                        'div',
                        { ref: T },
                        t.map((e, t) =>
                          n.createElement(F, {
                            className: a()(M.card, v, f && M[f]),
                            key: `${t}`,
                            cardType: f,
                            ...e,
                          }),
                        ),
                      ),
                      h &&
                        n.createElement(
                          n.Fragment,
                          null,
                          n.createElement('div', { ref: k }),
                          n.createElement('div', {
                            ref: x,
                            className: M.fadeBottom,
                            style: _,
                          }),
                        ),
                    ),
            ),
          )
        )
      }
      let L = null
      const A = n.createRef()
      function I(e) {
        if (!e.items.length) return null
        const {
            items: t,
            onClose: o,
            onClickOutside: l,
            onSizeChanged: i,
            position: a,
            customCloseSubscriptions: s,
            showScrollFades: c,
            cardType: u,
            className: p,
          } = e,
          d = {
            tooltips: t,
            onClose: o,
            onClickOutside: (e) => l(e),
            onSizeChanged: i,
            position: R.bind(null, a),
            customCloseSubscriptions: s,
            showScrollFades: c,
            cardType: u,
            className: p,
            reference: A,
          }
        return (
          null === L &&
            ((L = document.createElement('div')), document.body.appendChild(L)),
          r.render(n.createElement(_, { ...d }), L),
          {
            hide: V,
            isClickInside: (e) =>
              null !== A.current && A.current.contains(e.target),
          }
        )
      }
      function V() {
        null !== L && (r.unmountComponentAtNode(L), L.remove(), (L = null))
      }
      function R(e, t) {
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
        let f,
          v,
          g = Math.max(h - o, u.left, p.left)
        g + o >= p.right && (g = p.right - o)
        const y = u.bottom - (i.top + e.point.y + s),
          b = u.height - y - e.marginTop
        return (
          b < n
            ? ((v = e.marginTop + u.top), (f = Math.max(b, 0)))
            : (v = u.height + u.top - y - n),
          { x: g, y: v, overrideHeight: f }
        )
      }
    },
    2948: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M3.92 7.83 9 12.29l5.08-4.46-1-1.13L9 10.29l-4.09-3.6-.99 1.14Z"/></svg>'
    },
    55698: (e, t, o) => {
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
