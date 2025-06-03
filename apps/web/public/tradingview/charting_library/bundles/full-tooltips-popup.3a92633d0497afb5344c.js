;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [8643],
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
            a = [],
            s = !1,
            i = -1,
            l = void 0,
            c = void 0,
            d = (e) =>
              a.some(
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
            m = () => {
              setTimeout(() => {
                void 0 !== c &&
                  ((document.body.style.paddingRight = c), (c = void 0)),
                  void 0 !== l &&
                    ((document.body.style.overflow = l), (l = void 0))
              })
            }
          ;(e.disableBodyScroll = (e, n) => {
            if (r) {
              if (!e)
                return void console.error(
                  'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
                )
              if (e && !a.some((t) => t.targetElement === e)) {
                var m = { targetElement: e, options: n || {} }
                ;(a = [].concat(t(a), [m])),
                  (e.ontouchstart = (e) => {
                    1 === e.targetTouches.length &&
                      (i = e.targetTouches[0].clientY)
                  }),
                  (e.ontouchmove = (t) => {
                    var o, n, r, a
                    1 === t.targetTouches.length &&
                      ((n = e),
                      (a = (o = t).targetTouches[0].clientY - i),
                      !d(o.target) &&
                        ((n && 0 === n.scrollTop && 0 < a) ||
                        ((r = n) &&
                          r.scrollHeight - r.scrollTop <= r.clientHeight &&
                          a < 0)
                          ? u(o)
                          : o.stopPropagation()))
                  }),
                  s ||
                    (document.addEventListener(
                      'touchmove',
                      u,
                      o ? { passive: !1 } : void 0,
                    ),
                    (s = !0))
              }
            } else {
              ;(v = n),
                setTimeout(() => {
                  if (void 0 === c) {
                    var e = !!v && !0 === v.reserveScrollBarGap,
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
              var p = { targetElement: e, options: n || {} }
              a = [].concat(t(a), [p])
            }
            var v
          }),
            (e.clearAllBodyScrollLocks = () => {
              r
                ? (a.forEach((e) => {
                    ;(e.targetElement.ontouchstart = null),
                      (e.targetElement.ontouchmove = null)
                  }),
                  s &&
                    (document.removeEventListener(
                      'touchmove',
                      u,
                      o ? { passive: !1 } : void 0,
                    ),
                    (s = !1)),
                  (a = []),
                  (i = -1))
                : (m(), (a = []))
            }),
            (e.enableBodyScroll = (e) => {
              if (r) {
                if (!e)
                  return void console.error(
                    'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                  )
                ;(e.ontouchstart = null),
                  (e.ontouchmove = null),
                  (a = a.filter((t) => t.targetElement !== e)),
                  s &&
                    0 === a.length &&
                    (document.removeEventListener(
                      'touchmove',
                      u,
                      o ? { passive: !1 } : void 0,
                    ),
                    (s = !1))
              } else
                1 === a.length && a[0].targetElement === e
                  ? (m(), (a = []))
                  : (a = a.filter((t) => t.targetElement !== e))
            })
        }),
        void 0 === (r = 'function' == typeof o ? o.apply(t, n) : o) ||
          (e.exports = r)
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
    37558: (e, t, o) => {
      o.d(t, { DrawerContext: () => s, DrawerManager: () => a })
      var n = o(50959),
        r = o(99054)
      class a extends n.PureComponent {
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
            s.Provider,
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
      const s = n.createContext(null)
    },
    41590: (e, t, o) => {
      o.d(t, { Drawer: () => m })
      var n = o(50959),
        r = o(50151),
        a = o(97754),
        s = o(36174),
        i = o(42842),
        l = o(37558),
        c = o(29197),
        d = o(86656),
        u = o(66076)
      function m(e) {
        const {
            position: t = 'Bottom',
            onClose: o,
            children: d,
            className: m,
            theme: v = u,
          } = e,
          f = (0, r.ensureNotNull)((0, n.useContext)(l.DrawerContext)),
          [h] = (0, n.useState)(() => (0, s.randomHash)()),
          g = (0, n.useRef)(null),
          w = (0, n.useContext)(c.CloseDelegateContext)
        return (
          (0, n.useLayoutEffect)(
            () => (
              (0, r.ensureNotNull)(g.current).focus({ preventScroll: !0 }),
              w.subscribe(f, o),
              f.addDrawer(h),
              () => {
                f.removeDrawer(h), w.unsubscribe(f, o)
              }
            ),
            [],
          ),
          n.createElement(
            i.Portal,
            null,
            n.createElement(
              'div',
              { className: a(u.wrap, u[`position${t}`]) },
              h === f.currentDrawer &&
                n.createElement('div', { className: u.backdrop, onClick: o }),
              n.createElement(
                p,
                {
                  className: a(v.drawer, u[`position${t}`], m),
                  ref: g,
                  'data-name': e['data-name'],
                },
                d,
              ),
            ),
          )
        )
      }
      const p = (0, n.forwardRef)((e, t) => {
        const { className: o, ...r } = e
        return n.createElement(d.TouchScrollContainer, {
          className: a(u.drawer, o),
          tabIndex: -1,
          ref: t,
          ...r,
        })
      })
    },
    20520: (e, t, o) => {
      o.d(t, { PopupMenu: () => m })
      var n = o(50959),
        r = o(962),
        a = o(62942),
        s = o(42842),
        i = o(27317),
        l = o(29197)
      const c = n.createContext(void 0)
      var d = o(36383)
      const u = n.createContext({ setMenuMaxWidth: !1 })
      function m(e) {
        const {
            controller: t,
            children: o,
            isOpened: m,
            closeOnClickOutside: p = !0,
            doNotCloseOn: v,
            onClickOutside: f,
            onClose: h,
            onKeyboardClose: g,
            'data-name': w = 'popup-menu-container',
            ...E
          } = e,
          y = (0, n.useContext)(l.CloseDelegateContext),
          b = n.useContext(u),
          C = (0, n.useContext)(c),
          x = (0, d.useOutsideEvent)({
            handler: (e) => {
              f && f(e)
              if (!p) return
              const t = (0, a.default)(v) ? v() : null == v ? [] : [v]
              if (t.length > 0 && e.target instanceof Node)
                for (const o of t) {
                  const t = r.findDOMNode(o)
                  if (t instanceof Node && t.contains(e.target)) return
                }
              h()
            },
            mouseDown: !0,
            touchStart: !0,
          })
        return m
          ? n.createElement(
              s.Portal,
              {
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                pointerEvents: 'none',
              },
              n.createElement(
                'span',
                { ref: x, style: { pointerEvents: 'auto' } },
                n.createElement(
                  i.Menu,
                  {
                    ...E,
                    onClose: h,
                    onKeyboardClose: g,
                    onScroll: (t) => {
                      const { onScroll: o } = e
                      o && o(t)
                    },
                    customCloseDelegate: y,
                    customRemeasureDelegate: C,
                    ref: t,
                    'data-name': w,
                    limitMaxWidth: b.setMenuMaxWidth,
                  },
                  o,
                ),
              ),
            )
          : null
      }
    },
    86656: (e, t, o) => {
      o.d(t, { TouchScrollContainer: () => i })
      var n = o(50959),
        r = o(59142),
        a = o(50151),
        s = o(49483)
      const i = (0, n.forwardRef)((e, t) => {
        const { children: o, ...a } = e,
          i = (0, n.useRef)(null)
        return (
          (0, n.useImperativeHandle)(t, () => i.current),
          (0, n.useLayoutEffect)(() => {
            if (s.CheckMobile.iOS())
              return (
                null !== i.current &&
                  (0, r.disableBodyScroll)(i.current, { allowTouchMove: l(i) }),
                () => {
                  null !== i.current && (0, r.enableBodyScroll)(i.current)
                }
              )
          }, []),
          n.createElement('div', { ref: i, ...a }, o)
        )
      })
      function l(e) {
        return (t) => {
          const o = (0, a.ensureNotNull)(e.current),
            n = document.activeElement
          return (
            !o.contains(t) || (null !== n && o.contains(n) && n.contains(t))
          )
        }
      }
    },
    64165: (e) => {
      e.exports = {
        'css-value-small-size': '18px',
        'css-value-medium-size': '22px',
        'css-value-large-size': '28px',
        'css-value-border-radius-small-size': '9px',
        'css-value-border-radius-medium-size': '11px',
        'css-value-border-radius-large-size': '8px',
        'css-value-vertical-padding-size': '12px',
        'css-value-horizontal-padding-size': '16px',
        popupWidget: 'popupWidget-Wu2pIo3E',
        large: 'large-Wu2pIo3E',
        mobile: 'mobile-Wu2pIo3E',
        desc: 'desc-Wu2pIo3E',
        icon: 'icon-Wu2pIo3E',
        small: 'small-Wu2pIo3E',
        medium: 'medium-Wu2pIo3E',
        title: 'title-Wu2pIo3E',
        text: 'text-Wu2pIo3E',
        item: 'item-Wu2pIo3E',
        boldItem: 'boldItem-Wu2pIo3E',
        action: 'action-Wu2pIo3E',
        additionalWidget: 'additionalWidget-Wu2pIo3E',
      }
    },
    52685: (e, t, o) => {
      o.r(t), o.d(t, { render: () => C })
      var n = o(50959),
        r = o(962),
        a = o(20520),
        s = o(90692),
        i = o(41590),
        l = o(37558),
        c = o(36174),
        d = o(97754),
        u = o(50151),
        m = o(9745),
        p = o(77975),
        v = o(1722),
        f = o(64165)
      const h = new WeakMap(),
        g = new WeakMap()
      function w(e) {
        const t = (0, p.useWatchedValueReadonly)({ watchedValue: e.info })
        if (null === t) return null
        const o = t.map((t) => {
          const {
            title: o,
            titleColor: r,
            icon: a,
            iconClassName: s,
            html: i,
            action: l,
            size: p,
          } = t
          h.has(t) || h.set(t, (0, c.randomHash)())
          let w = []
          return (
            void 0 !== e.additionalWidgets &&
              (w = e.additionalWidgets.map(
                (e) => (
                  g.has(e) || g.set(e, (0, c.randomHash)()),
                  e.renderer((0, u.ensureDefined)(g.get(e)), f.additionalWidget)
                ),
              )),
            n.createElement(
              'div',
              {
                key: h.get(t),
                className: d(f.popupWidget, f[p], e.isMobile && f.mobile),
              },
              n.createElement(m.Icon, {
                className: d(f.icon, s, f[p]),
                style: { '--custom-status-color': r || void 0 },
                icon: a || void 0,
              }),
              n.createElement(
                'div',
                { className: f.desc },
                n.createElement(
                  'span',
                  {
                    style: { color: r || void 0 },
                    className: d(f.title, f[p]),
                  },
                  o,
                ),
                i &&
                  n.createElement(
                    'p',
                    { className: d(f.text, f[p]) },
                    i.map((e, t) => {
                      let o, r
                      return (
                        (0, v.isObject)(e)
                          ? ((o = e.text), (r = e.bold))
                          : (o = e),
                        n.createElement('span', {
                          key: `html_item_${t}`,
                          className: d(f.item, r && f.boldItem),
                          dangerouslySetInnerHTML: { __html: o },
                        })
                      )
                    }),
                  ),
                l &&
                  n.createElement(
                    'span',
                    {
                      className: d(
                        l.tooltip && 'apply-common-tooltip',
                        f.action,
                        f[p],
                      ),
                      onClick: () => {
                        e.onClose(), null == l || l.onClick()
                      },
                      title: l.tooltip,
                    },
                    l.text,
                  ),
                w,
              ),
            )
          )
        })
        return n.createElement(n.Fragment, null, o)
      }
      const E = new WeakMap()
      function y(e) {
        const {
          statusWidgetInfos: t,
          matchMediaRule: o = 'screen and (min-width: 431px)',
        } = e
        return n.createElement(
          l.DrawerManager,
          null,
          n.createElement(s.MatchMedia, { rule: o }, (o) =>
            o
              ? n.createElement(
                  a.PopupMenu,
                  {
                    isOpened: !0,
                    onClose: e.onClose,
                    position: e.position,
                    doNotCloseOn: e.rendererButton,
                  },
                  n.createElement(b, {
                    widgetInfo: t,
                    onClose: e.onClose,
                    isMobile: !o,
                  }),
                )
              : n.createElement(
                  i.Drawer,
                  { onClose: e.onClose, position: 'Bottom' },
                  n.createElement(b, {
                    widgetInfo: t,
                    onClose: e.onClose,
                    isMobile: !o,
                  }),
                ),
          ),
        )
      }
      function b(e) {
        return n.createElement(
          n.Fragment,
          null,
          e.widgetInfo
            .filter((e) => e.visible.value())
            .map(
              (t) => (
                E.has(t) || E.set(t, (0, c.randomHash)()),
                n.createElement(w, {
                  key: E.get(t),
                  info: t.model.fullInfo(),
                  onClose: e.onClose,
                  additionalWidgets: t.additionalWidgets,
                  isMobile: e.isMobile,
                })
              ),
            ),
        )
      }
      function C(e) {
        const { opened: t, container: o, ...a } = e
        t
          ? r.render(n.createElement(y, { ...a }), o)
          : r.unmountComponentAtNode(o)
      }
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
