;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [769],
  {
    59142: (d, e) => {
      var u, t, n
      ;(t = [e]),
        (u = (d) => {
          function e(d) {
            if (Array.isArray(d)) {
              for (var e = 0, u = Array(d.length); e < d.length; e++)
                u[e] = d[e]
              return u
            }
            return Array.from(d)
          }
          Object.defineProperty(d, '__esModule', { value: !0 })
          var u = !1
          if ('undefined' != typeof window) {
            var t = {
              get passive() {
                u = !0
              },
            }
            window.addEventListener('testPassive', null, t),
              window.removeEventListener('testPassive', null, t)
          }
          var n =
              'undefined' != typeof window &&
              window.navigator &&
              window.navigator.platform &&
              /iP(ad|hone|od)/.test(window.navigator.platform),
            c = [],
            o = !1,
            r = -1,
            a = void 0,
            f = void 0,
            i = (d) =>
              c.some(
                (e) =>
                  !(!e.options.allowTouchMove || !e.options.allowTouchMove(d)),
              ),
            l = (d) => {
              var e = d || window.event
              return (
                !!i(e.target) ||
                1 < e.touches.length ||
                (e.preventDefault && e.preventDefault(), !1)
              )
            },
            s = () => {
              setTimeout(() => {
                void 0 !== f &&
                  ((document.body.style.paddingRight = f), (f = void 0)),
                  void 0 !== a &&
                    ((document.body.style.overflow = a), (a = void 0))
              })
            }
          ;(d.disableBodyScroll = (d, t) => {
            if (n) {
              if (!d)
                return void console.error(
                  'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
                )
              if (d && !c.some((e) => e.targetElement === d)) {
                var s = { targetElement: d, options: t || {} }
                ;(c = [].concat(e(c), [s])),
                  (d.ontouchstart = (d) => {
                    1 === d.targetTouches.length &&
                      (r = d.targetTouches[0].clientY)
                  }),
                  (d.ontouchmove = (e) => {
                    var u, t, n, c
                    1 === e.targetTouches.length &&
                      ((t = d),
                      (c = (u = e).targetTouches[0].clientY - r),
                      !i(u.target) &&
                        ((t && 0 === t.scrollTop && 0 < c) ||
                        ((n = t) &&
                          n.scrollHeight - n.scrollTop <= n.clientHeight &&
                          c < 0)
                          ? l(u)
                          : u.stopPropagation()))
                  }),
                  o ||
                    (document.addEventListener(
                      'touchmove',
                      l,
                      u ? { passive: !1 } : void 0,
                    ),
                    (o = !0))
              }
            } else {
              ;(v = t),
                setTimeout(() => {
                  if (void 0 === f) {
                    var d = !!v && !0 === v.reserveScrollBarGap,
                      e =
                        window.innerWidth - document.documentElement.clientWidth
                    d &&
                      0 < e &&
                      ((f = document.body.style.paddingRight),
                      (document.body.style.paddingRight = e + 'px'))
                  }
                  void 0 === a &&
                    ((a = document.body.style.overflow),
                    (document.body.style.overflow = 'hidden'))
                })
              var m = { targetElement: d, options: t || {} }
              c = [].concat(e(c), [m])
            }
            var v
          }),
            (d.clearAllBodyScrollLocks = () => {
              n
                ? (c.forEach((d) => {
                    ;(d.targetElement.ontouchstart = null),
                      (d.targetElement.ontouchmove = null)
                  }),
                  o &&
                    (document.removeEventListener(
                      'touchmove',
                      l,
                      u ? { passive: !1 } : void 0,
                    ),
                    (o = !1)),
                  (c = []),
                  (r = -1))
                : (s(), (c = []))
            }),
            (d.enableBodyScroll = (d) => {
              if (n) {
                if (!d)
                  return void console.error(
                    'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                  )
                ;(d.ontouchstart = null),
                  (d.ontouchmove = null),
                  (c = c.filter((e) => e.targetElement !== d)),
                  o &&
                    0 === c.length &&
                    (document.removeEventListener(
                      'touchmove',
                      l,
                      u ? { passive: !1 } : void 0,
                    ),
                    (o = !1))
              } else
                1 === c.length && c[0].targetElement === d
                  ? (s(), (c = []))
                  : (c = c.filter((e) => e.targetElement !== d))
            })
        }),
        void 0 === (n = 'function' == typeof u ? u.apply(e, t) : u) ||
          (d.exports = n)
    },
    36718: (d) => {
      d.exports = {
        'default-drawer-min-top-distance': '100px',
        wrap: 'wrap-_HnK0UIN',
        positionBottom: 'positionBottom-_HnK0UIN',
        backdrop: 'backdrop-_HnK0UIN',
        drawer: 'drawer-_HnK0UIN',
        positionLeft: 'positionLeft-_HnK0UIN',
      }
    },
    13996: (d) => {
      d.exports = {
        emoji: 'emoji-BsERGcZ1',
        clearButton: 'clearButton-BsERGcZ1',
      }
    },
    84660: (d) => {
      d.exports = { list: 'list-JPoFARaG' }
    },
    59984: (d) => {
      d.exports = { wrapper: 'wrapper-VmCoyMWF' }
    },
    34314: (d) => {
      d.exports = {
        wrapper: 'wrapper-M14KUVdG',
        emojiItem: 'emojiItem-M14KUVdG',
        hovered: 'hovered-M14KUVdG',
      }
    },
    25474: (d) => {
      d.exports = {
        wrapper: 'wrapper-hoWtpNyh',
        isActive: 'isActive-hoWtpNyh',
        button: 'button-hoWtpNyh',
      }
    },
    7110: (d) => {
      d.exports = { wrapper: 'wrapper-RXEt_NWz' }
    },
    84670: (d) => {
      d.exports = { wrapper: 'wrapper-QWmdCZSA' }
    },
    80859: (d) => {
      d.exports = { wrapper: 'wrapper-mz0866M2', hovered: 'hovered-mz0866M2' }
    },
    62337: (d) => {
      d.exports = { wrapper: 'wrapper-MeQD3kFA', button: 'button-MeQD3kFA' }
    },
    50238: (d, e, u) => {
      u.d(e, { useRovingTabindexElement: () => c })
      var t = u(50959),
        n = u(39416)
      function c(d, e = []) {
        const [u, c] = (0, t.useState)(!1),
          o = (0, n.useFunctionalRefObject)(d)
        return (
          (0, t.useLayoutEffect)(() => {
            const d = o.current
            if (null === d) return
            const e = (d) => {
              switch (d.type) {
                case 'roving-tabindex:main-element':
                  c(!0)
                  break
                case 'roving-tabindex:secondary-element':
                  c(!1)
              }
            }
            return (
              d.addEventListener('roving-tabindex:main-element', e),
              d.addEventListener('roving-tabindex:secondary-element', e),
              () => {
                d.removeEventListener('roving-tabindex:main-element', e),
                  d.removeEventListener('roving-tabindex:secondary-element', e)
              }
            )
          }, e),
          [o, u ? 0 : -1]
        )
      }
    },
    59369: (d, e, u) => {
      u.d(e, { useRowsNavigation: () => i })
      var t = u(50959),
        n = u(50151),
        c = u(19291),
        o = u(68335),
        r = u(57177),
        a = u(15754)
      const f = [37, 39, 38, 40]
      function i(d) {
        const e = (0, t.useRef)(null)
        return (
          (0, t.useLayoutEffect)(() => {
            const d = (0, n.ensureNotNull)(e.current),
              u = () => {
                const u = (0, c.queryTabbableElements)(d).sort(
                  c.navigationOrderComparator,
                )
                if (
                  0 === u.length ||
                  (u[0].parentElement &&
                    !m(u[0].parentElement, (0, n.ensureNotNull)(e.current)))
                ) {
                  const t = ((d) => {
                    const u = s(d).sort(c.navigationOrderComparator),
                      t = u.find((d) => m(d, (0, n.ensureNotNull)(e.current)))
                    if (!t) return null
                    const o = Array.from(t.children)
                    if (!o.length) return null
                    return o[0]
                  })(d)
                  if (null === t) return
                  if (((0, r.becomeMainElement)(t), u.length > 0))
                    for (const d of u) (0, r.becomeSecondaryElement)(d)
                }
              }
            return (
              window.addEventListener('keyboard-navigation-activation', u),
              u(),
              () =>
                window.removeEventListener('keyboard-navigation-activation', u)
            )
          }, []),
          [
            e,
            (e) => {
              if (e.defaultPrevented) return
              const u = (0, o.hashFromEvent)(e)
              if (!f.includes(u)) return
              const t = document.activeElement
              if (!(t instanceof HTMLElement)) return
              const n = e.currentTarget
              let r, i
              if (d) {
                const d = t.parentElement
                ;(r = d ? Array.from(d.children) : []), (i = r.indexOf(t))
              } else
                (r = ((m = n),
                Array.from(
                  m.querySelectorAll(
                    'button:not([disabled]):not([aria-disabled])',
                  ),
                ).filter((0, a.createScopedVisibleElementFilter)(m))).sort(
                  c.navigationOrderComparator,
                )),
                  (i = r.indexOf(t))
              var m
              if (0 === r.length || -1 === i) return
              const h = (0, c.mapKeyCodeToDirection)(u)
              switch (h) {
                case 'inlinePrev':
                  if ((e.preventDefault(), !d && 0 === i)) break
                  v(l(r, i, -1))
                  break
                case 'inlineNext':
                  if ((e.preventDefault(), !d && i === r.length - 1)) break
                  v(l(r, i, 1))
                  break
                case 'blockPrev':
                case 'blockNext':
                  ;((u) => {
                    if (!document.activeElement) return
                    const t = s(n),
                      c = document.activeElement.parentElement
                    if (!c) return
                    const o = Array.from(c.children).indexOf(
                      document.activeElement,
                    )
                    if (-1 === o) return
                    const r =
                      t['blockNext' === u ? t.indexOf(c) + 1 : t.indexOf(c) - 1]
                    if (!r) return
                    e.preventDefault()
                    const a = Array.from(r.children)
                    a.length && (!d && o <= a.length - 1 ? v(a[o]) : v(a[0]))
                  })(h)
              }
            },
          ]
        )
      }
      function l(d, e, u) {
        return d[(e + d.length + u) % d.length]
      }
      function s(d) {
        return Array.from(d.querySelectorAll('[data-role="row"]')).filter(
          (0, a.createScopedVisibleElementFilter)(d),
        )
      }
      function m(d, e) {
        const u = (0, n.ensureNotNull)(d.parentElement).offsetTop,
          t = u + (0, n.ensureNotNull)(d.parentElement).clientHeight,
          c = e.scrollTop,
          o = c + e.clientHeight
        return u >= c && t <= o
      }
      function v(d) {
        document.activeElement &&
          (0, r.becomeSecondaryElement)(document.activeElement),
          (0, r.becomeMainElement)(d),
          d.focus()
      }
    },
    37558: (d, e, u) => {
      u.d(e, { DrawerContext: () => o, DrawerManager: () => c })
      var t = u(50959),
        n = u(99054)
      class c extends t.PureComponent {
        constructor(d) {
          super(d),
            (this._isBodyFixed = !1),
            (this._addDrawer = (d) => {
              this.setState((e) => ({ stack: [...e.stack, d] }))
            }),
            (this._removeDrawer = (d) => {
              this.setState((e) => ({ stack: e.stack.filter((e) => e !== d) }))
            }),
            (this.state = { stack: [] })
        }
        componentDidUpdate(d, e) {
          !e.stack.length &&
            this.state.stack.length &&
            ((0, n.setFixedBodyState)(!0), (this._isBodyFixed = !0)),
            e.stack.length &&
              !this.state.stack.length &&
              this._isBodyFixed &&
              ((0, n.setFixedBodyState)(!1), (this._isBodyFixed = !1))
        }
        componentWillUnmount() {
          this.state.stack.length &&
            this._isBodyFixed &&
            (0, n.setFixedBodyState)(!1)
        }
        render() {
          return t.createElement(
            o.Provider,
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
      const o = t.createContext(null)
    },
    41590: (d, e, u) => {
      u.d(e, { Drawer: () => m })
      var t = u(50959),
        n = u(50151),
        c = u(97754),
        o = u(92184),
        r = u(42842),
        a = u(37558),
        f = u(29197),
        i = u(86656),
        l = u(36718)
      var s
      function m(d) {
        const {
            position: e = 'Bottom',
            onClose: u,
            children: i,
            reference: s,
            className: m,
            theme: h = l,
          } = d,
          b = (0, n.ensureNotNull)((0, t.useContext)(a.DrawerContext)),
          [p] = (0, t.useState)(() => (0, o.randomHash)()),
          g = (0, t.useRef)(null),
          w = (0, t.useContext)(f.CloseDelegateContext)
        return (
          (0, t.useLayoutEffect)(
            () => (
              (0, n.ensureNotNull)(g.current).focus({ preventScroll: !0 }),
              w.subscribe(b, u),
              b.addDrawer(p),
              () => {
                b.removeDrawer(p), w.unsubscribe(b, u)
              }
            ),
            [],
          ),
          t.createElement(
            r.Portal,
            null,
            t.createElement(
              'div',
              { ref: s, className: c(l.wrap, l[`position${e}`]) },
              p === b.currentDrawer &&
                t.createElement('div', { className: l.backdrop, onClick: u }),
              t.createElement(
                v,
                {
                  className: c(h.drawer, l[`position${e}`], m),
                  ref: g,
                  'data-name': d['data-name'],
                },
                i,
              ),
            ),
          )
        )
      }
      !((d) => {
        ;(d.Left = 'Left'), (d.Bottom = 'Bottom')
      })(s || (s = {}))
      const v = (0, t.forwardRef)((d, e) => {
        const { className: u, ...n } = d
        return t.createElement(i.TouchScrollContainer, {
          className: c(l.drawer, u),
          tabIndex: -1,
          ref: e,
          ...n,
        })
      })
    },
    88160: (d, e, u) => {
      u.d(e, { EMPTY_EMOJI: () => t })
      const t = ''
    },
    173: (d, e, u) => {
      u.d(e, {
        emojiGroups: () => A,
        isSupportedEmoji: () => M,
        localeCompareEmojiTitles: () => I,
        removeUnavailableEmoji: () => S,
        separateEmoji: () => k,
      })
      var t = u(50959),
        n = u(11542),
        c = u(91682),
        o = u(50151),
        r = u(99616),
        a = u(37603),
        f = u(32386),
        i = u(1759),
        l = u(5474),
        s = u(92177),
        m = u(83137),
        v = u(86209),
        h = u(14082),
        b = u(93826)
      const p = [
          '😀',
          '😃',
          '😄',
          '😁',
          '😆',
          '😅',
          '😂',
          '🤣',
          '☺️',
          '😊',
          '😇',
          '🙂',
          '🙃',
          '😉',
          '😌',
          '😍',
          '🥰',
          '😘',
          '😗',
          '😙',
          '😚',
          '😋',
          '😛',
          '😝',
          '😜',
          '🤪',
          '🤨',
          '🧐',
          '🤓',
          '😎',
          '🤩',
          '🥳',
          '😏',
          '😒',
          '😞',
          '😔',
          '😟',
          '😕',
          '🙁',
          '☹️',
          '😣',
          '😖',
          '😫',
          '😩',
          '🥺',
          '😢',
          '😭',
          '😤',
          '😠',
          '😡',
          '🤬',
          '🤯',
          '😳',
          '🥵',
          '🥶',
          '😱',
          '😨',
          '😰',
          '😥',
          '😓',
          '🤗',
          '🤔',
          '🤭',
          '🤫',
          '🤥',
          '😶',
          '😐',
          '😑',
          '😬',
          '🙄',
          '😯',
          '😦',
          '😧',
          '😮',
          '😲',
          '🥱',
          '😴',
          '🤤',
          '😪',
          '😵',
          '🤐',
          '🥴',
          '🤢',
          '🤮',
          '🤧',
          '😷',
          '🤒',
          '🤕',
          '🤑',
          '🤠',
          '😈',
          '👿',
          '👹',
          '👺',
          '🤡',
          '💩',
          '👻',
          '💀',
          '☠️',
          '👽',
          '👾',
          '🤖',
          '🎃',
          '😺',
          '😸',
          '😹',
          '😻',
          '😼',
          '😽',
          '🙀',
          '😿',
          '😾',
          '👋',
          '🤚',
          '🖐',
          '✋',
          '🖖',
          '👌',
          '🤏',
          '✌️',
          '🤞',
          '🤟',
          '🤘',
          '🤙',
          '👈',
          '👉',
          '👆',
          '🖕',
          '👇',
          '☝️',
          '👍',
          '👎',
          '✊',
          '👊',
          '🤛',
          '🤜',
          '👏',
          '🙌',
          '👐',
          '🤲',
          '🤝',
          '🙏',
          '✍️',
          '💅',
          '🤳',
          '💪',
          '🦾',
          '🦵',
          '🦿',
          '🦶',
          '👂',
          '🦻',
          '👃',
          '🧠',
          '🦷',
          '🦴',
          '👀',
          '👁',
          '👅',
          '👄',
          '💋',
          '🩸',
          '👶',
          '🧒',
          '👦',
          '👧',
          '🧑',
          '👱',
          '👨',
          '🧔',
          '👨‍🦰',
          '👨‍🦱',
          '👨‍🦳',
          '👨‍🦲',
          '👩',
          '👩‍🦰',
          '🧑‍🦰',
          '👩‍🦱',
          '🧑‍🦱',
          '👩‍🦳',
          '🧑‍🦳',
          '👩‍🦲',
          '🧑‍🦲',
          '👱‍♀️',
          '👱‍♂️',
          '🧓',
          '👴',
          '👵',
          '🙍',
          '🙍‍♂️',
          '🙍‍♀️',
          '🙎',
          '🙎‍♂️',
          '🙎‍♀️',
          '🙅',
          '🙅‍♂️',
          '🙅‍♀️',
          '🙆',
          '🙆‍♂️',
          '🙆‍♀️',
          '💁',
          '💁‍♂️',
          '💁‍♀️',
          '🙋',
          '🙋‍♂️',
          '🙋‍♀️',
          '🧏',
          '🧏‍♂️',
          '🧏‍♀️',
          '🙇',
          '🙇‍♂️',
          '🙇‍♀️',
          '🤦',
          '🤦‍♂️',
          '🤦‍♀️',
          '🤷',
          '🤷‍♂️',
          '🤷‍♀️',
          '🧑‍⚕️',
          '👨‍⚕️',
          '👩‍⚕️',
          '🧑‍🎓',
          '👨‍🎓',
          '👩‍🎓',
          '🧑‍🏫',
          '👨‍🏫',
          '👩‍🏫',
          '🧑‍⚖️',
          '👨‍⚖️',
          '👩‍⚖️',
          '🧑‍🌾',
          '👨‍🌾',
          '👩‍🌾',
          '🧑‍🍳',
          '👨‍🍳',
          '👩‍🍳',
          '🧑‍🔧',
          '👨‍🔧',
          '👩‍🔧',
          '🧑‍🏭',
          '👨‍🏭',
          '👩‍🏭',
          '🧑‍💼',
          '👨‍💼',
          '👩‍💼',
          '🧑‍🔬',
          '👨‍🔬',
          '👩‍🔬',
          '🧑‍💻',
          '👨‍💻',
          '👩‍💻',
          '🧑‍🎤',
          '👨‍🎤',
          '👩‍🎤',
          '🧑‍🎨',
          '👨‍🎨',
          '👩‍🎨',
          '🧑‍✈️',
          '👨‍✈️',
          '👩‍✈️',
          '🧑‍🚀',
          '👨‍🚀',
          '👩‍🚀',
          '🧑‍🚒',
          '👨‍🚒',
          '👩‍🚒',
          '👮',
          '👮‍♂️',
          '👮‍♀️',
          '🕵',
          '🕵️‍♂️',
          '🕵️‍♀️',
          '💂',
          '💂‍♂️',
          '💂‍♀️',
          '👷',
          '👷‍♂️',
          '👷‍♀️',
          '🤴',
          '👸',
          '👳',
          '👳‍♂️',
          '👳‍♀️',
          '👲',
          '🧕',
          '🤵',
          '👰',
          '🤰',
          '🤱',
          '👼',
          '🎅',
          '🤶',
          '🦸',
          '🦸‍♂️',
          '🦸‍♀️',
          '🦹',
          '🦹‍♂️',
          '🦹‍♀️',
          '🧙',
          '🧙‍♂️',
          '🧙‍♀️',
          '🧚',
          '🧚‍♂️',
          '🧚‍♀️',
          '🧛',
          '🧛‍♂️',
          '🧛‍♀️',
          '🧜',
          '🧜‍♂️',
          '🧜‍♀️',
          '🧝',
          '🧝‍♂️',
          '🧝‍♀️',
          '🧞',
          '🧞‍♂️',
          '🧞‍♀️',
          '🧟',
          '🧟‍♂️',
          '🧟‍♀️',
          '💆',
          '💆‍♂️',
          '💆‍♀️',
          '💇',
          '💇‍♂️',
          '💇‍♀️',
          '🚶',
          '🚶‍♂️',
          '🚶‍♀️',
          '🧍',
          '🧍‍♂️',
          '🧍‍♀️',
          '🧎',
          '🧎‍♂️',
          '🧎‍♀️',
          '🧑‍🦯',
          '👨‍🦯',
          '👩‍🦯',
          '🧑‍🦼',
          '👨‍🦼',
          '👩‍🦼',
          '🧑‍🦽',
          '👨‍🦽',
          '👩‍🦽',
          '🏃',
          '🏃‍♂️',
          '🏃‍♀️',
          '💃',
          '🕺',
          '🕴',
          '👯',
          '👯‍♂️',
          '👯‍♀️',
          '🧖',
          '🧖‍♂️',
          '🧖‍♀️',
          '🧑‍🤝‍🧑',
          '👭',
          '👫',
          '👬',
          '💏',
          '👨‍❤️‍💋‍👨',
          '👩‍❤️‍💋‍👩',
          '💑',
          '👨‍❤️‍👨',
          '👩‍❤️‍👩',
          '👪',
          '👨‍👩‍👦',
          '👨‍👩‍👧',
          '👨‍👩‍👧‍👦',
          '👨‍👩‍👦‍👦',
          '👨‍👩‍👧‍👧',
          '👨‍👨‍👦',
          '👨‍👨‍👧',
          '👨‍👨‍👧‍👦',
          '👨‍👨‍👦‍👦',
          '👨‍👨‍👧‍👧',
          '👩‍👩‍👦',
          '👩‍👩‍👧',
          '👩‍👩‍👧‍👦',
          '👩‍👩‍👦‍👦',
          '👩‍👩‍👧‍👧',
          '👨‍👦',
          '👨‍👦‍👦',
          '👨‍👧',
          '👨‍👧‍👦',
          '👨‍👧‍👧',
          '👩‍👦',
          '👩‍👦‍👦',
          '👩‍👧',
          '👩‍👧‍👦',
          '👩‍👧‍👧',
          '🗣',
          '👤',
          '👥',
          '👣',
        ],
        g = [
          '🐶',
          '🐱',
          '🐭',
          '🐹',
          '🐰',
          '🦊',
          '🐻',
          '🐼',
          '🐨',
          '🐯',
          '🦁',
          '🐮',
          '🐷',
          '🐽',
          '🐸',
          '🐵',
          '🙈',
          '🙉',
          '🙊',
          '🐒',
          '🐔',
          '🐧',
          '🐦',
          '🐤',
          '🐣',
          '🐥',
          '🦆',
          '🦅',
          '🦉',
          '🦇',
          '🐺',
          '🐗',
          '🐴',
          '🦄',
          '🐝',
          '🐛',
          '🦋',
          '🐌',
          '🐞',
          '🐜',
          '🦟',
          '🦗',
          '🕷',
          '🕸',
          '🦂',
          '🐢',
          '🐍',
          '🦎',
          '🦖',
          '🦕',
          '🐙',
          '🦑',
          '🦐',
          '🦞',
          '🦀',
          '🐡',
          '🐠',
          '🐟',
          '🐬',
          '🐳',
          '🐋',
          '🦈',
          '🐊',
          '🐅',
          '🐆',
          '🦓',
          '🦍',
          '🦧',
          '🐘',
          '🦛',
          '🦏',
          '🐪',
          '🐫',
          '🦒',
          '🦘',
          '🐃',
          '🐂',
          '🐄',
          '🐎',
          '🐖',
          '🐏',
          '🐑',
          '🦙',
          '🐐',
          '🦌',
          '🐕',
          '🐩',
          '🦮',
          '🐕‍🦺',
          '🐈',
          '🐓',
          '🦃',
          '🦚',
          '🦜',
          '🦢',
          '🦩',
          '🕊',
          '🐇',
          '🦝',
          '🦨',
          '🦡',
          '🦦',
          '🦥',
          '🐁',
          '🐀',
          '🐿',
          '🦔',
          '🐾',
          '🐉',
          '🐲',
          '🌵',
          '🎄',
          '🌲',
          '🌳',
          '🌴',
          '🌱',
          '🌿',
          '☘️',
          '🍀',
          '🎍',
          '🎋',
          '🍃',
          '🍂',
          '🍁',
          '🍄',
          '🐚',
          '🌾',
          '💐',
          '🌷',
          '🌹',
          '🥀',
          '🌺',
          '🌸',
          '🌼',
          '🌻',
          '🌞',
          '🌝',
          '🌛',
          '🌜',
          '🌚',
          '🌕',
          '🌖',
          '🌗',
          '🌘',
          '🌑',
          '🌒',
          '🌓',
          '🌔',
          '🌙',
          '🌎',
          '🌍',
          '🌏',
          '🪐',
          '💫',
          '⭐️',
          '🌟',
          '✨',
          '⚡️',
          '☄️',
          '💥',
          '🔥',
          '🌪',
          '🌈',
          '☀️',
          '🌤',
          '⛅️',
          '🌥',
          '☁️',
          '🌦',
          '🌧',
          '⛈',
          '🌩',
          '🌨',
          '❄️',
          '☃️',
          '⛄️',
          '🌬',
          '💨',
          '💧',
          '💦',
          '☔️',
          '🌊',
          '🌫',
        ],
        w = [
          '🍏',
          '🍎',
          '🍐',
          '🍊',
          '🍋',
          '🍌',
          '🍉',
          '🍇',
          '🍓',
          '🍈',
          '🍒',
          '🍑',
          '🥭',
          '🍍',
          '🥥',
          '🥝',
          '🍅',
          '🍆',
          '🥑',
          '🥦',
          '🥬',
          '🥒',
          '🌶',
          '🌽',
          '🥕',
          '🧄',
          '🧅',
          '🥔',
          '🍠',
          '🥐',
          '🥯',
          '🍞',
          '🥖',
          '🥨',
          '🧀',
          '🥚',
          '🍳',
          '🧈',
          '🥞',
          '🧇',
          '🥓',
          '🥩',
          '🍗',
          '🍖',
          '🌭',
          '🍔',
          '🍟',
          '🍕',
          '🥪',
          '🥙',
          '🧆',
          '🌮',
          '🌯',
          '🥗',
          '🥘',
          '🥫',
          '🍝',
          '🍜',
          '🍲',
          '🍛',
          '🍣',
          '🍱',
          '🥟',
          '🦪',
          '🍤',
          '🍙',
          '🍚',
          '🍘',
          '🍥',
          '🥠',
          '🥮',
          '🍢',
          '🍡',
          '🍧',
          '🍨',
          '🍦',
          '🥧',
          '🧁',
          '🍰',
          '🎂',
          '🍮',
          '🍭',
          '🍬',
          '🍫',
          '🍿',
          '🍩',
          '🍪',
          '🌰',
          '🥜',
          '🍯',
          '🥛',
          '🍼',
          '☕️',
          '🍵',
          '🧃',
          '🥤',
          '🍶',
          '🍺',
          '🍻',
          '🥂',
          '🍷',
          '🥃',
          '🍸',
          '🍹',
          '🧉',
          '🍾',
          '🧊',
          '🥄',
          '🍴',
          '🍽',
          '🥣',
          '🥡',
          '🥢',
          '🧂',
        ],
        E = [
          '⚽️',
          '🏀',
          '🏈',
          '⚾️',
          '🥎',
          '🎾',
          '🏐',
          '🏉',
          '🥏',
          '🎱',
          '🪀',
          '🏓',
          '🏸',
          '🏒',
          '🏑',
          '🥍',
          '🏏',
          '🥅',
          '⛳️',
          '🪁',
          '🏹',
          '🎣',
          '🤿',
          '🥊',
          '🥋',
          '🎽',
          '🛹',
          '🛷',
          '⛸',
          '🥌',
          '🎿',
          '⛷',
          '🏂',
          '🪂',
          '🏋️',
          '🏋️‍♂️',
          '🏋️‍♀️',
          '🤼',
          '🤼‍♂️',
          '🤼‍♀️',
          '🤸‍♀️',
          '🤸',
          '🤸‍♂️',
          '⛹️',
          '⛹️‍♂️',
          '⛹️‍♀️',
          '🤺',
          '🤾',
          '🤾‍♂️',
          '🤾‍♀️',
          '🏌️',
          '🏌️‍♂️',
          '🏌️‍♀️',
          '🏇',
          '🧘',
          '🧘‍♂️',
          '🧘‍♀️',
          '🏄',
          '🏄‍♂️',
          '🏄‍♀️',
          '🏊',
          '🏊‍♂️',
          '🏊‍♀️',
          '🤽',
          '🤽‍♂️',
          '🤽‍♀️',
          '🚣',
          '🚣‍♂️',
          '🚣‍♀️',
          '🧗',
          '🧗‍♂️',
          '🧗‍♀️',
          '🚵',
          '🚵‍♂️',
          '🚵‍♀️',
          '🚴',
          '🚴‍♂️',
          '🚴‍♀️',
          '🏆',
          '🥇',
          '🥈',
          '🥉',
          '🏅',
          '🎖',
          '🏵',
          '🎗',
          '🎫',
          '🎟',
          '🎪',
          '🤹',
          '🤹‍♂️',
          '🤹‍♀️',
          '🎭',
          '🎨',
          '🎬',
          '🎤',
          '🎧',
          '🎼',
          '🎹',
          '🥁',
          '🎷',
          '🎺',
          '🎸',
          '🪕',
          '🎻',
          '🎲',
          '🎯',
          '🎳',
          '🎮',
          '🎰',
          '🧩',
        ],
        x = [
          '🚗',
          '🚕',
          '🚙',
          '🚌',
          '🚎',
          '🏎',
          '🚓',
          '🚑',
          '🚒',
          '🚐',
          '🚚',
          '🚛',
          '🚜',
          '🦯',
          '🦽',
          '🦼',
          '🛴',
          '🚲',
          '🛵',
          '🏍',
          '🛺',
          '🚨',
          '🚔',
          '🚍',
          '🚘',
          '🚖',
          '🚡',
          '🚠',
          '🚟',
          '🚃',
          '🚋',
          '🚞',
          '🚝',
          '🚄',
          '🚅',
          '🚈',
          '🚂',
          '🚆',
          '🚇',
          '🚊',
          '🚉',
          '✈️',
          '🛫',
          '🛬',
          '🛩',
          '💺',
          '🛰',
          '🚀',
          '🛸',
          '🚁',
          '🛶',
          '⛵️',
          '🚤',
          '🛥',
          '🛳',
          '⛴',
          '🚢',
          '⚓️',
          '⛽️',
          '🚧',
          '🚦',
          '🚥',
          '🚏',
          '🗺',
          '🗿',
          '🗽',
          '🗼',
          '🏰',
          '🏯',
          '🏟',
          '🎡',
          '🎢',
          '🎠',
          '⛲️',
          '⛱',
          '🏖',
          '🏝',
          '🏜',
          '🌋',
          '⛰',
          '🏔',
          '🗻',
          '🏕',
          '⛺️',
          '🏠',
          '🏡',
          '🏘',
          '🏚',
          '🏗',
          '🏭',
          '🏢',
          '🏬',
          '🏣',
          '🏤',
          '🏥',
          '🏦',
          '🏨',
          '🏪',
          '🏫',
          '🏩',
          '💒',
          '🏛',
          '⛪️',
          '🕌',
          '🕍',
          '🛕',
          '🕋',
          '⛩',
          '🛤',
          '🛣',
          '🗾',
          '🎑',
          '🏞',
          '🌅',
          '🌄',
          '🌠',
          '🎇',
          '🎆',
          '🌇',
          '🌆',
          '🏙',
          '🌃',
          '🌌',
          '🌉',
          '🌁',
        ],
        y = [
          '⌚️',
          '📱',
          '📲',
          '💻',
          '⌨️',
          '🖥',
          '🖨',
          '🖱',
          '🖲',
          '🕹',
          '🗜',
          '💽',
          '💾',
          '💿',
          '📀',
          '📼',
          '📷',
          '📸',
          '📹',
          '🎥',
          '📽',
          '🎞',
          '📞',
          '☎️',
          '📟',
          '📠',
          '📺',
          '📻',
          '🎙',
          '🎚',
          '🎛',
          '🧭',
          '⏱',
          '⏲',
          '⏰',
          '🕰',
          '⌛️',
          '⏳',
          '📡',
          '🔋',
          '🔌',
          '💡',
          '🔦',
          '🕯',
          '🪔',
          '🧯',
          '🛢',
          '💸',
          '💵',
          '💴',
          '💶',
          '💷',
          '💰',
          '💳',
          '💎',
          '⚖️',
          '🧰',
          '🔧',
          '🔨',
          '⚒',
          '🛠',
          '⛏',
          '🔩',
          '⚙️',
          '🧱',
          '⛓',
          '🧲',
          '🔫',
          '💣',
          '🧨',
          '🪓',
          '🔪',
          '🗡',
          '⚔️',
          '🛡',
          '🚬',
          '⚰️',
          '⚱️',
          '🏺',
          '🔮',
          '📿',
          '🧿',
          '💈',
          '⚗️',
          '🔭',
          '🔬',
          '🕳',
          '🩹',
          '🩺',
          '💊',
          '💉',
          '🧬',
          '🦠',
          '🧫',
          '🧪',
          '🌡',
          '🧹',
          '🧺',
          '🧻',
          '🚽',
          '🚰',
          '🚿',
          '🛁',
          '🛀',
          '🧼',
          '🪒',
          '🧽',
          '🧴',
          '🛎',
          '🔑',
          '🗝',
          '🚪',
          '🪑',
          '🛋',
          '🛏',
          '🛌',
          '🧸',
          '🖼',
          '🛍',
          '🛒',
          '🎁',
          '🎈',
          '🎏',
          '🎀',
          '🎊',
          '🎉',
          '🎎',
          '🏮',
          '🎐',
          '🧧',
          '✉️',
          '📩',
          '📨',
          '📧',
          '💌',
          '📥',
          '📤',
          '📦',
          '🏷',
          '📪',
          '📫',
          '📬',
          '📭',
          '📮',
          '📯',
          '📜',
          '📃',
          '📄',
          '📑',
          '🧾',
          '📊',
          '📈',
          '📉',
          '🗒',
          '🗓',
          '📆',
          '📅',
          '🗑',
          '📇',
          '🗃',
          '🗳',
          '🗄',
          '📋',
          '📁',
          '📂',
          '🗂',
          '🗞',
          '📰',
          '📓',
          '📔',
          '📒',
          '📕',
          '📗',
          '📘',
          '📙',
          '📚',
          '📖',
          '🔖',
          '🧷',
          '🔗',
          '📎',
          '🖇',
          '📐',
          '📏',
          '🧮',
          '📌',
          '📍',
          '✂️',
          '🖊',
          '🖋',
          '✒️',
          '🖌',
          '🖍',
          '📝',
          '✏️',
          '🔍',
          '🔎',
          '🔏',
          '🔐',
          '🔒',
          '🔓',
          '🧳',
          '🌂',
          '☂️',
          '🧵',
          '🧶',
          '👓',
          '🕶',
          '🥽',
          '🥼',
          '🦺',
          '👔',
          '👕',
          '👖',
          '🧣',
          '🧤',
          '🧥',
          '🧦',
          '👗',
          '👘',
          '🥻',
          '🩱',
          '🩲',
          '🩳',
          '👙',
          '👚',
          '👛',
          '👜',
          '👝',
          '🎒',
          '👞',
          '👟',
          '🥾',
          '🥿',
          '👠',
          '👡',
          '🩰',
          '👢',
          '👑',
          '👒',
          '🎩',
          '🎓',
          '🧢',
          '⛑',
          '💄',
          '💍',
          '💼',
        ],
        C = [
          '❤️',
          '🧡',
          '💛',
          '💚',
          '💙',
          '💜',
          '🖤',
          '🤍',
          '🤎',
          '💔',
          '❣️',
          '💕',
          '💞',
          '💓',
          '💗',
          '💖',
          '💘',
          '💝',
          '💟',
          '☮️',
          '✝️',
          '☪️',
          '🕉',
          '☸️',
          '✡️',
          '🔯',
          '🕎',
          '☯️',
          '☦️',
          '🛐',
          '⛎',
          '♈️',
          '♉️',
          '♊️',
          '♋️',
          '♌️',
          '♍️',
          '♎️',
          '♏️',
          '♐️',
          '♑️',
          '♒️',
          '♓️',
          '🆔',
          '⚛️',
          '🉑',
          '☢️',
          '☣️',
          '📴',
          '📳',
          '🈶',
          '🈚️',
          '🈸',
          '🈺',
          '🈷️',
          '✴️',
          '🆚',
          '💮',
          '🉐',
          '㊙️',
          '㊗️',
          '🈴',
          '🈵',
          '🈹',
          '🈲',
          '🅰️',
          '🅱️',
          '🆎',
          '🆑',
          '🅾️',
          '🆘',
          '❌',
          '⭕️',
          '🛑',
          '⛔️',
          '📛',
          '🚫',
          '💯',
          '💢',
          '♨️',
          '🚷',
          '🚯',
          '🚳',
          '🚱',
          '🔞',
          '📵',
          '🚭',
          '❗️',
          '❕',
          '❓',
          '❔',
          '‼️',
          '⁉️',
          '🔅',
          '🔆',
          '〽️',
          '⚠️',
          '🚸',
          '🔱',
          '⚜️',
          '🔰',
          '♻️',
          '✅',
          '🈯️',
          '💹',
          '❇️',
          '✳️',
          '❎',
          '🌐',
          '💠',
          'Ⓜ️',
          '🌀',
          '💤',
          '🏧',
          '🚾',
          '♿️',
          '🅿️',
          '🈳',
          '🈂️',
          '🛂',
          '🛃',
          '🛄',
          '🛅',
          '🚹',
          '🚺',
          '🚼',
          '🚻',
          '🚮',
          '🎦',
          '📶',
          '🈁',
          '🔣',
          'ℹ️',
          '🔤',
          '🔡',
          '🔠',
          '🆖',
          '🆗',
          '🆙',
          '🆒',
          '🆕',
          '🆓',
          '0️⃣',
          '1️⃣',
          '2️⃣',
          '3️⃣',
          '4️⃣',
          '5️⃣',
          '6️⃣',
          '7️⃣',
          '8️⃣',
          '9️⃣',
          '🔟',
          '🔢',
          '#️⃣',
          '*️⃣',
          '⏏️',
          '▶️',
          '⏸',
          '⏯',
          '⏹',
          '⏺',
          '⏭',
          '⏮',
          '⏩',
          '⏪',
          '⏫',
          '⏬',
          '◀️',
          '🔼',
          '🔽',
          '➡️',
          '⬅️',
          '⬆️',
          '⬇️',
          '↗️',
          '↘️',
          '↙️',
          '↖️',
          '↕️',
          '↔️',
          '↪️',
          '↩️',
          '⤴️',
          '⤵️',
          '🔀',
          '🔁',
          '🔂',
          '🔄',
          '🔃',
          '🎵',
          '🎶',
          '➕',
          '➖',
          '➗',
          '✖️',
          '♾',
          '💲',
          '💱',
          '™️',
          '©️',
          '®️',
          '〰️',
          '➰',
          '➿',
          '🔚',
          '🔙',
          '🔛',
          '🔝',
          '🔜',
          '✔️',
          '☑️',
          '🔘',
          '🔴',
          '🟠',
          '🟡',
          '🟢',
          '🔵',
          '🟣',
          '⚫️',
          '⚪️',
          '🟤',
          '🔺',
          '🔻',
          '🔸',
          '🔹',
          '🔶',
          '🔷',
          '🔳',
          '🔲',
          '▪️',
          '▫️',
          '◾️',
          '◽️',
          '◼️',
          '◻️',
          '🟥',
          '🟧',
          '🟨',
          '🟩',
          '🟦',
          '🟪',
          '⬛️',
          '⬜️',
          '🟫',
          '🔈',
          '🔇',
          '🔉',
          '🔊',
          '🔔',
          '🔕',
          '📣',
          '📢',
          '👁‍🗨',
          '💬',
          '💭',
          '🗯',
          '♠️',
          '♣️',
          '♥️',
          '♦️',
          '🃏',
          '🎴',
          '🀄️',
          '🕐',
          '🕑',
          '🕒',
          '🕓',
          '🕔',
          '🕕',
          '🕖',
          '🕗',
          '🕘',
          '🕙',
          '🕚',
          '🕛',
          '🕜',
          '🕝',
          '🕞',
          '🕟',
          '🕠',
          '🕡',
          '🕢',
          '🕣',
          '🕤',
          '🕥',
          '🕦',
          '🕧',
        ],
        z = [
          '🏳️',
          '🏴',
          '🏁',
          '🚩',
          '🏳️‍🌈',
          '🏴‍☠️',
          '🇦🇫',
          '🇦🇽',
          '🇦🇱',
          '🇩🇿',
          '🇦🇸',
          '🇦🇩',
          '🇦🇴',
          '🇦🇮',
          '🇦🇶',
          '🇦🇬',
          '🇦🇷',
          '🇦🇲',
          '🇦🇼',
          '🇦🇺',
          '🇦🇹',
          '🇦🇿',
          '🇧🇸',
          '🇧🇭',
          '🇧🇩',
          '🇧🇧',
          '🇧🇾',
          '🇧🇪',
          '🇧🇿',
          '🇧🇯',
          '🇧🇲',
          '🇧🇹',
          '🇧🇴',
          '🇧🇦',
          '🇧🇼',
          '🇧🇷',
          '🇮🇴',
          '🇻🇬',
          '🇧🇳',
          '🇧🇬',
          '🇧🇫',
          '🇧🇮',
          '🇰🇭',
          '🇨🇲',
          '🇨🇦',
          '🇮🇨',
          '🇨🇻',
          '🇧🇶',
          '🇰🇾',
          '🇨🇫',
          '🇹🇩',
          '🇨🇱',
          '🇨🇳',
          '🇨🇽',
          '🇨🇨',
          '🇨🇴',
          '🇰🇲',
          '🇨🇬',
          '🇨🇩',
          '🇨🇰',
          '🇨🇷',
          '🇨🇮',
          '🇭🇷',
          '🇨🇺',
          '🇨🇼',
          '🇨🇾',
          '🇨🇿',
          '🇩🇰',
          '🇩🇯',
          '🇩🇲',
          '🇩🇴',
          '🇪🇨',
          '🇪🇬',
          '🇸🇻',
          '🇬🇶',
          '🇪🇷',
          '🇪🇪',
          '🇪🇹',
          '🇪🇺',
          '🇫🇰',
          '🇫🇴',
          '🇫🇯',
          '🇫🇮',
          '🇫🇷',
          '🇬🇫',
          '🇵🇫',
          '🇹🇫',
          '🇬🇦',
          '🇬🇲',
          '🇬🇪',
          '🇩🇪',
          '🇬🇭',
          '🇬🇮',
          '🇬🇷',
          '🇬🇱',
          '🇬🇩',
          '🇬🇵',
          '🇬🇺',
          '🇬🇹',
          '🇬🇬',
          '🇬🇳',
          '🇬🇼',
          '🇬🇾',
          '🇭🇹',
          '🇭🇳',
          '🇭🇰',
          '🇭🇺',
          '🇮🇸',
          '🇮🇳',
          '🇮🇩',
          '🇮🇷',
          '🇮🇶',
          '🇮🇪',
          '🇮🇲',
          '🇮🇱',
          '🇮🇹',
          '🇯🇲',
          '🇯🇵',
          '🎌',
          '🇯🇪',
          '🇯🇴',
          '🇰🇿',
          '🇰🇪',
          '🇰🇮',
          '🇽🇰',
          '🇰🇼',
          '🇰🇬',
          '🇱🇦',
          '🇱🇻',
          '🇱🇧',
          '🇱🇸',
          '🇱🇷',
          '🇱🇾',
          '🇱🇮',
          '🇱🇹',
          '🇱🇺',
          '🇲🇴',
          '🇲🇰',
          '🇲🇬',
          '🇲🇼',
          '🇲🇾',
          '🇲🇻',
          '🇲🇱',
          '🇲🇹',
          '🇲🇭',
          '🇲🇶',
          '🇲🇷',
          '🇲🇺',
          '🇾🇹',
          '🇲🇽',
          '🇫🇲',
          '🇲🇩',
          '🇲🇨',
          '🇲🇳',
          '🇲🇪',
          '🇲🇸',
          '🇲🇦',
          '🇲🇿',
          '🇲🇲',
          '🇳🇦',
          '🇳🇷',
          '🇳🇵',
          '🇳🇱',
          '🇳🇨',
          '🇳🇿',
          '🇳🇮',
          '🇳🇪',
          '🇳🇬',
          '🇳🇺',
          '🇳🇫',
          '🇰🇵',
          '🇲🇵',
          '🇳🇴',
          '🇴🇲',
          '🇵🇰',
          '🇵🇼',
          '🇵🇸',
          '🇵🇦',
          '🇵🇬',
          '🇵🇾',
          '🇵🇪',
          '🇵🇭',
          '🇵🇳',
          '🇵🇱',
          '🇵🇹',
          '🇵🇷',
          '🇶🇦',
          '🇷🇪',
          '🇷🇴',
          '🇷🇺',
          '🇷🇼',
          '🇼🇸',
          '🇸🇲',
          '🇸🇦',
          '🇸🇳',
          '🇷🇸',
          '🇸🇨',
          '🇸🇱',
          '🇸🇬',
          '🇸🇽',
          '🇸🇰',
          '🇸🇮',
          '🇬🇸',
          '🇸🇧',
          '🇸🇴',
          '🇿🇦',
          '🇰🇷',
          '🇸🇸',
          '🇪🇸',
          '🇱🇰',
          '🇧🇱',
          '🇸🇭',
          '🇰🇳',
          '🇱🇨',
          '🇵🇲',
          '🇻🇨',
          '🇸🇩',
          '🇸🇷',
          '🇸🇿',
          '🇸🇪',
          '🇨🇭',
          '🇸🇾',
          '🇹🇼',
          '🇹🇯',
          '🇹🇿',
          '🇹🇭',
          '🇹🇱',
          '🇹🇬',
          '🇹🇰',
          '🇹🇴',
          '🇹🇹',
          '🇹🇳',
          '🇹🇷',
          '🇹🇲',
          '🇹🇨',
          '🇹🇻',
          '🇻🇮',
          '🇺🇬',
          '🇺🇦',
          '🇦🇪',
          '🇬🇧',
          '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
          '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
          '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
          '🇺🇳',
          '🇺🇸',
          '🇺🇾',
          '🇺🇿',
          '🇻🇺',
          '🇻🇦',
          '🇻🇪',
          '🇻🇳',
          '🇼🇫',
          '🇪🇭',
          '🇾🇪',
          '🇿🇲',
          '🇿🇼',
        ],
        N = [...p, ...g, ...w, ...E, ...x, ...y, ...C, ...z],
        j = new Set(N)
      function S(d) {
        return d.filter((d) => j.has(d))
      }
      function M(d) {
        return j.has(d)
      }
      function k(d) {
        const e = (0, c.getFirstSegmentOrCodePointString)(d),
          u = null !== e && M(e) ? e : ''
        return { emoji: u, emojiLessString: d.replace(u, '') }
      }
      function I(d, e, ...u) {
        const t = k((0, o.ensureNotNull)(d)).emojiLessString.trim(),
          n = k((0, o.ensureNotNull)(e)).emojiLessString.trim()
        return t.localeCompare(n, ...u) || d.localeCompare(e, ...u)
      }
      const A = () => [
        {
          title: n.t(null, { context: 'emoji_group' }, u(88906)),
          emojis: [],
          content: t.createElement(r.IconItem, { icon: a }),
        },
        {
          title: n.t(null, { context: 'emoji_group' }, u(43438)),
          emojis: p,
          content: t.createElement(r.IconItem, { icon: f }),
        },
        {
          title: n.t(null, { context: 'emoji_group' }, u(53288)),
          emojis: g,
          content: t.createElement(r.IconItem, { icon: i }),
        },
        {
          title: n.t(null, { context: 'emoji_group' }, u(90678)),
          emojis: w,
          content: t.createElement(r.IconItem, { icon: l }),
        },
        {
          title: n.t(null, { context: 'emoji_group' }, u(21311)),
          emojis: E,
          content: t.createElement(r.IconItem, { icon: s }),
        },
        {
          title: n.t(null, { context: 'emoji_group' }, u(28562)),
          emojis: x,
          content: t.createElement(r.IconItem, { icon: m }),
        },
        {
          title: n.t(null, { context: 'emoji_group' }, u(98355)),
          emojis: y,
          content: t.createElement(r.IconItem, { icon: v }),
        },
        {
          title: n.t(null, { context: 'emoji_group' }, u(40457)),
          emojis: C,
          content: t.createElement(r.IconItem, { icon: h }),
        },
        {
          title: n.t(null, { context: 'emoji_group' }, u(6715)),
          emojis: z,
          content: t.createElement(r.IconItem, { icon: b }),
        },
      ]
    },
    37285: (d, e, u) => {
      u.d(e, { EmojiItem: () => s })
      var t = u(50959),
        n = u(97754),
        c = u.n(n),
        o = u(9745),
        r = u(11542),
        a = u(19365),
        f = u(88160),
        i = u(13996),
        l = u(6138)
      function s(d) {
        const { emoji: e, className: n } = d
        if (e === f.EMPTY_EMOJI)
          return t.createElement(o.Icon, {
            className: c()(n, i.clearButton, 'apply-common-tooltip'),
            icon: l,
            title: r.t(null, void 0, u(47550)),
          })
        const s = (0, a.getTwemojiUrl)(e, 'png')
        return t.createElement('img', {
          className: c()(n, i.emoji),
          src: s,
          decoding: 'async',
          width: '24',
          height: '24',
          alt: '',
          draggable: !1,
          onContextMenu: (d) => {
            d.preventDefault()
          },
        })
      }
    },
    47291: (d, e, u) => {
      u.d(e, { EmojiListContent: () => b, EmojiListContentContext: () => h })
      var t = u(50959),
        n = u(84952),
        c = u(97754),
        o = u.n(c),
        r = u(84670)
      function a(d) {
        const { title: e, className: u } = d
        return t.createElement('div', { className: o()(r.wrapper, u) }, e)
      }
      var f = u(26601),
        i = u(78036),
        l = u(63273),
        s = u(84660)
      const m = 102,
        v = 30,
        h = t.createContext(null)
      function b(d) {
        const {
          listRef: e,
          outerRef: u,
          emojiGroups: c,
          emojiSize: o,
          onSelect: r,
          onContentRendered: a,
          ItemComponent: f,
          RowComponent: i,
          height: b,
        } = d
        ;(0, t.useEffect)(() => e.current?.resetAfterIndex(0, !0), [c])
        const g = (0, t.useCallback)(
            (d) => ('title' === c[d].type ? v : o),
            [c, o],
          ),
          w = (0, t.useCallback)(
            ({ visibleStartIndex: d }) => {
              const { relatedTitle: e } = c[d]
              a(e)
            },
            [c, a],
          ),
          E = Math.min(b - m, window.innerHeight - m)
        return t.createElement(
          h.Provider,
          {
            value: (0, t.useMemo)(
              () => ({
                size: o,
                onSelect: r,
                ItemComponent: f,
                RowComponent: i,
              }),
              [o, r, f, i],
            ),
          },
          t.createElement(n.VariableSizeList, {
            direction: (0, l.isRtl)() ? 'rtl' : 'ltr',
            className: s.list,
            ref: e,
            outerRef: u,
            width: '100%',
            height: E,
            itemData: c,
            itemCount: c.length,
            children: p,
            onItemsRendered: w,
            itemSize: g,
          }),
        )
      }
      const p = t.memo((d) => {
        const { style: e, index: u, data: n } = d,
          c = n[u],
          {
            size: o,
            onSelect: r,
            ItemComponent: l,
            RowComponent: s = f.EmojisRow,
          } = (0, i.useEnsuredContext)(h)
        return 'title' === c.type
          ? t.createElement(
              'div',
              { style: e },
              t.createElement(a, { title: c.relatedTitle }),
            )
          : t.createElement(
              'div',
              { style: e },
              t.createElement(s, {
                emojis: c.content,
                itemSize: o,
                onEmojiClick: r,
                ItemComponent: l,
              }),
            )
      })
    },
    38297: (d, e, u) => {
      u.d(e, { EmojiList: () => v })
      var t = u(50959),
        n = u(97754),
        c = u.n(n),
        o = u(29006),
        r = u(85034),
        a = u(47291)
      var f = u(49483),
        i = u(59369),
        l = u(59984)
      const s = 12,
        m = 38
      function v(d) {
        const {
            className: e,
            emojis: u,
            onSelect: n,
            ItemComponent: v,
            RowComponent: h,
            height: b,
            category: p,
            emojiSize: g = m,
          } = d,
          w = (0, t.useRef)(null),
          E = (0, t.useRef)(!1),
          [x, y] = (0, i.useRowsNavigation)(),
          [C, z] = (0, t.useState)(0),
          N = (0, t.useMemo)(
            () =>
              ((d, e) => {
                if (0 === e) return []
                const u = []
                return (
                  d.forEach(({ title: d, emojis: t }) => {
                    u.push({ type: 'title', relatedTitle: d, content: [d] })
                    let n = []
                    for (const c of t)
                      n.length < e
                        ? n.push(c)
                        : (u.push({
                            type: 'emojiRow',
                            relatedTitle: d,
                            content: n,
                          }),
                          (n = [c]))
                    n.length &&
                      u.push({ type: 'emojiRow', relatedTitle: d, content: n })
                  }),
                  u
                )
              })(u, C),
            [u, C],
          ),
          j = (0, o.useResizeObserver)(
            (d) => {
              const [e] = d,
                { width: u } = e.contentRect,
                t = Math.floor((u - s) / g)
              z(t)
            },
            [g],
          )
        ;(0, t.useEffect)(() => {
          N.length && I(0)
        }, [p])
        const [S, M] = (0, t.useState)(N[0]?.relatedTitle || ''),
          k = (0, t.useCallback)((d) => {
            E.current || M(d)
          }, [])
        return t.createElement(
          'div',
          { className: c()(l.wrapper, e) },
          t.createElement(r.GroupTabs, {
            tabs: u,
            activeTab: S,
            onTabClick: (d) => {
              M(d)
              I(
                ((d) =>
                  N.findIndex(
                    ({ relatedTitle: e, type: u }) => 'title' === u && e === d,
                  ))(d),
              )
            },
          }),
          t.createElement(
            'div',
            { ref: j, onKeyDown: y },
            t.createElement(a.EmojiListContent, {
              listRef: w,
              outerRef: x,
              emojiGroups: N,
              emojiSize: g,
              onSelect: n,
              onContentRendered: k,
              ItemComponent: v,
              RowComponent: h,
              height: b,
            }),
          ),
        )
        function I(d) {
          f.CheckMobile.iOS() &&
            x.current &&
            (x.current.style.overflow = 'hidden'),
            (E.current = !0),
            w.current?.scrollToItem(d, 'start'),
            requestAnimationFrame(() => {
              w.current?.scrollToItem(d, 'start'),
                f.CheckMobile.iOS() &&
                  x.current &&
                  (x.current.style.overflow = 'auto'),
                (E.current = !1)
            })
        }
      }
    },
    26601: (d, e, u) => {
      u.d(e, { EmojisRow: () => a })
      var t = u(50959),
        n = u(97754),
        c = u.n(n),
        o = u(43790),
        r = u(34314)
      const a = t.memo((d) => {
        const {
          emojis: e,
          itemSize: u,
          onEmojiClick: n,
          ItemComponent: a,
          className: f,
        } = d
        return t.createElement(
          'div',
          { 'data-role': 'row', className: c()(r.wrapper, f) },
          e.map((d) =>
            t.createElement(o.EmojiWrap, {
              key: d,
              className: r.emojiItem,
              emoji: d,
              size: u,
              onClick: n,
              ItemComponent: a,
            }),
          ),
        )
      })
    },
    85034: (d, e, u) => {
      u.d(e, { GroupTabs: () => l })
      var t = u(50959),
        n = u(97754),
        c = u.n(n),
        o = u(6190),
        r = u(50238),
        a = u(25474)
      function f(d) {
        const {
            tab: e,
            isActive: u,
            onTabClick: n,
            children: o,
            className: f,
          } = d,
          [i, l] = (0, r.useRovingTabindexElement)(null)
        return t.createElement(
          'button',
          {
            ref: i,
            tabIndex: l,
            onClick: () => {
              n(e)
            },
            className: c()(a.wrapper, u && a.isActive, a.button, f),
            type: 'button',
            'aria-pressed': u,
          },
          o,
        )
      }
      var i = u(7110)
      function l(d) {
        const {
          activeTab: e,
          tabs: u,
          onTabClick: n,
          className: r,
          tabClassName: a,
        } = d
        return t.createElement(
          o.Toolbar,
          {
            orientation: 'horizontal',
            className: c()(i.wrapper, r),
            blurOnEscKeydown: !1,
          },
          u.map(({ title: d, content: u }) =>
            t.createElement(
              f,
              {
                key: d,
                tab: d,
                className: a,
                isActive: e === d,
                onTabClick: n,
              },
              u,
            ),
          ),
        )
      }
    },
    99616: (d, e, u) => {
      u.d(e, { IconItem: () => a })
      var t = u(50959),
        n = u(97754),
        c = u.n(n),
        o = u(9745),
        r = u(80859)
      function a(d) {
        return t.createElement(
          'div',
          { className: c()(r.wrapper, d.className) },
          t.createElement(o.Icon, { icon: d.icon }),
        )
      }
    },
    43790: (d, e, u) => {
      u.d(e, { EmojiWrap: () => i })
      var t = u(50959),
        n = u(97754),
        c = u.n(n),
        o = u(37285),
        r = u(50238),
        a = u(62337)
      const f = 34
      function i(d) {
        const {
            className: e,
            emoji: u,
            size: n = f,
            onClick: i,
            ItemComponent: l = o.EmojiItem,
          } = d,
          [s, m] = (0, r.useRovingTabindexElement)(null)
        return t.createElement(
          'button',
          {
            ref: s,
            tabIndex: m,
            onClick: () => {
              i(u)
            },
            style: { width: n, height: n },
            className: c()(a.button, a.wrapper, e),
            type: 'button',
          },
          t.createElement(l, { emoji: u }),
        )
      }
    },
    86656: (d, e, u) => {
      u.d(e, { TouchScrollContainer: () => f })
      var t = u(50959),
        n = u(59142),
        c = u(50151),
        o = u(49483)
      const r = CSS.supports('overscroll-behavior', 'none')
      let a = 0
      const f = (0, t.forwardRef)((d, e) => {
        const { children: u, ...c } = d,
          f = (0, t.useRef)(null)
        return (
          (0, t.useImperativeHandle)(e, () => f.current),
          (0, t.useLayoutEffect)(() => {
            if (o.CheckMobile.iOS())
              return (
                a++,
                null !== f.current &&
                  (r
                    ? 1 === a &&
                      (document.body.style.overscrollBehavior = 'none')
                    : (0, n.disableBodyScroll)(f.current, {
                        allowTouchMove: i(f),
                      })),
                () => {
                  a--,
                    null !== f.current &&
                      (r
                        ? 0 === a &&
                          (document.body.style.overscrollBehavior = '')
                        : (0, n.enableBodyScroll)(f.current))
                }
              )
          }, []),
          t.createElement('div', { ref: f, ...c }, u)
        )
      })
      function i(d) {
        return (e) => {
          const u = (0, c.ensureNotNull)(d.current),
            t = document.activeElement
          return (
            !u.contains(e) || (null !== t && u.contains(t) && t.contains(e))
          )
        }
      }
    },
    40173: (d, e, u) => {
      function t(d, e, u = {}) {
        return Object.assign(
          {},
          d,
          ((d, e, u = {}) => {
            const t = Object.assign({}, e)
            for (const n of Object.keys(e)) {
              const c = u[n] || n
              c in d && (t[n] = [d[c], e[n]].join(' '))
            }
            return t
          })(d, e, u),
        )
      }
      u.d(e, { mergeThemes: () => t })
    },
    57177: (d, e, u) => {
      var t
      function n(d) {
        d.dispatchEvent(new CustomEvent('roving-tabindex:main-element'))
      }
      function c(d) {
        d.dispatchEvent(new CustomEvent('roving-tabindex:secondary-element'))
      }
      u.d(e, { becomeMainElement: () => n, becomeSecondaryElement: () => c }),
        ((d) => {
          ;(d.MainElement = 'roving-tabindex:main-element'),
            (d.SecondaryElement = 'roving-tabindex:secondary-element')
        })(t || (t = {}))
    },
    6190: (d, e, u) => {
      u.d(e, { Toolbar: () => l })
      var t = u(50959),
        n = u(50151),
        c = u(47201),
        o = u(3343),
        r = u(19291),
        a = u(57177),
        f = u(39416),
        i = u(7047)
      const l = (0, t.forwardRef)((d, e) => {
        const {
            onKeyDown: u,
            orientation: l,
            blurOnEscKeydown: s = !0,
            blurOnClick: m = !0,
            ...v
          } = d,
          h = (0, f.useFunctionalRefObject)(e)
        return (
          (0, t.useLayoutEffect)(() => {
            const d = (0, n.ensureNotNull)(h.current),
              e = () => {
                const e = (0, r.queryTabbableElements)(d).sort(
                  r.navigationOrderComparator,
                )
                if (0 === e.length) {
                  const [e] = (0, r.queryFocusableElements)(d).sort(
                    r.navigationOrderComparator,
                  )
                  if (void 0 === e) return
                  ;(0, a.becomeMainElement)(e)
                }
                if (e.length > 1) {
                  const [, ...d] = e
                  for (const e of d) (0, a.becomeSecondaryElement)(e)
                }
              }
            return (
              window.addEventListener('keyboard-navigation-activation', e),
              () =>
                window.removeEventListener('keyboard-navigation-activation', e)
            )
          }, []),
          t.createElement('div', {
            ...i.MouseClickAutoBlurHandler.attributes(m),
            ...v,
            role: 'toolbar',
            'aria-orientation': l,
            ref: h,
            onKeyDown: (0, c.createSafeMulticastEventHandler)((d) => {
              if (d.defaultPrevented) return
              if (!(document.activeElement instanceof HTMLElement)) return
              const e = (0, o.hashFromEvent)(d)
              if (s && 27 === e)
                return d.preventDefault(), void document.activeElement.blur()
              if ('vertical' !== l && 37 !== e && 39 !== e) return
              if ('vertical' === l && 38 !== e && 40 !== e) return
              const u = d.currentTarget,
                t = (0, r.queryFocusableElements)(u).sort(
                  r.navigationOrderComparator,
                )
              if (0 === t.length) return
              const n = t.indexOf(document.activeElement)
              if (-1 === n) return
              d.preventDefault()
              const c = () => {
                  const d = (n + t.length - 1) % t.length
                  ;(0, a.becomeSecondaryElement)(t[n]),
                    (0, a.becomeMainElement)(t[d]),
                    t[d].focus()
                },
                f = () => {
                  const d = (n + t.length + 1) % t.length
                  ;(0, a.becomeSecondaryElement)(t[n]),
                    (0, a.becomeMainElement)(t[d]),
                    t[d].focus()
                }
              switch ((0, r.mapKeyCodeToDirection)(e)) {
                case 'inlinePrev':
                  'vertical' !== l && c()
                  break
                case 'inlineNext':
                  'vertical' !== l && f()
                  break
                case 'blockPrev':
                  'vertical' === l && c()
                  break
                case 'blockNext':
                  'vertical' === l && f()
              }
            }, u),
            'data-tooltip-show-on-focus': 'true',
          })
        )
      })
    },
    19365: (d, e, u) => {
      u.d(e, { getTwemojiUrl: () => n })
      var t = u(18438)
      function n(d, e) {
        let u = ''
        return (
          t.default.parse(
            d,
            (d) => (
              (u =
                t.default.base +
                ('svg' === e ? `svg/${d}.svg` : `72x72/${d}.png`)),
              !1
            ),
          ),
          u
        )
      }
      t.default.base = 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/13.0.1/'
    },
    6138: (d) => {
      d.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M7.332 6.548 21.42 20.704A9.962 9.962 0 0 0 24 14c0-5.523-4.477-10-10-10a9.961 9.961 0 0 0-6.668 2.548Zm13.381 14.864L6.621 7.252A9.962 9.962 0 0 0 4 14c0 5.523 4.477 10 10 10 2.584 0 4.938-.98 6.713-2.588ZM6.263 6.181A10.967 10.967 0 0 1 14 3c6.075 0 11 4.925 11 11 0 3.036-1.23 5.785-3.218 7.775A10.967 10.967 0 0 1 14 25C7.925 25 3 20.075 3 14c0-3.058 1.249-5.826 3.263-7.82Z"/></svg>'
    },
    92177: (d) => {
      d.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M13.98 6.02L14.5 6c2.18 0 4.16.8 5.66 2.14l-5.66 5.65-2.31-2.3a8.43 8.43 0 0 0 1.55-3.64 14.01 14.01 0 0 0 .24-1.83zm-1.01.12a8.45 8.45 0 0 0-4.13 2l2.64 2.63a7.59 7.59 0 0 0 1.28-3.12c.12-.59.18-1.12.2-1.51zm-4.83 2.7a8.45 8.45 0 0 0-2 4.13c.39-.03.92-.1 1.51-.21a7.59 7.59 0 0 0 3.12-1.28L8.14 8.84zm-2.12 5.14a8.48 8.48 0 0 0 2.12 6.18l5.65-5.66-2.3-2.31a8.43 8.43 0 0 1-3.64 1.55 14.03 14.03 0 0 1-1.83.24zm2.82 6.88a8.46 8.46 0 0 0 5.13 2.12v-.07A8.95 8.95 0 0 1 16.3 17l-1.8-1.8-5.66 5.65zM14.97 23c2-.1 3.8-.9 5.19-2.13L17 17.72a7.94 7.94 0 0 0-2.04 5.27zm5.9-2.83a8.46 8.46 0 0 0 2.11-5.13h-.02a10.62 10.62 0 0 0-5.2 2l3.1 3.13zm2.12-6.13c-.1-2-.9-3.8-2.13-5.19l-5.65 5.66 1.83 1.83a11.6 11.6 0 0 1 5.95-2.3zM14.5 5A9.46 9.46 0 0 0 5 14.5c0 5.28 4.22 9.5 9.5 9.5s9.5-4.22 9.5-9.5S19.78 5 14.5 5z"/></svg>'
    },
    1759: (d) => {
      d.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M4.54 3.2l.78-.59 5.49 4.5 1.43 1.07a5.28 5.28 0 0 1 2.19-2.3 9.19 9.19 0 0 1 1.88-.85h.04l.01-.01.14.48.42-.28v.01l.01.02a3.14 3.14 0 0 1 .16.26l.37.72c.2.45.4 1.02.5 1.64a2.13 2.13 0 0 1 1.89.46l.18.16.03.02.18.16c.22.16.42.27.81.25a5.9 5.9 0 0 0 2.2-.86l.66-.36.09.75a5.98 5.98 0 0 1-1.7 5.1 6.87 6.87 0 0 1-1.7 1.23 19.97 19.97 0 0 1 .48 2.48c.25 1.73.42 4.08.06 6.5A1.46 1.46 0 0 1 19.68 25h-7.71a1.5 1.5 0 0 1-1.4-2.06l1-2.47c-.18.02-.37.03-.58.03a3 3 0 0 1-1.53-.4 6.84 6.84 0 0 1-1.6.64c-1.08.27-2.55.29-3.72-.89a4.06 4.06 0 0 1-.96-3 5.1 5.1 0 0 1 2-3.74 98.5 98.5 0 0 0 2.7-2.24L4.55 3.2zM16.5 5.5l-.14-.48.35-.1.2.3-.41.28zm-7.87 6.06a57.48 57.48 0 0 1-2.19 1.82l.49.26c.65.37 1.48.9 1.97 1.56a5.78 5.78 0 0 1 1.14 4.07l.06.03c.19.1.49.2.9.2.68 0 .95-.11 1.03-.16v-.03l.97.19h-.5.5v.03a.75.75 0 0 1-.01.1.74.74 0 0 1-.09.21l-1.39 3.47a.5.5 0 0 0 .47.69h7.71c.24 0 .43-.17.47-.38a22 22 0 0 0-.06-6.22 24.4 24.4 0 0 0-.56-2.71 11.35 11.35 0 0 0-.94-1.52 7.1 7.1 0 0 0-2.31-2.22l-.62-.31.49-.5A3.03 3.03 0 0 0 17 8.6a1.2 1.2 0 0 0 .01-.1c0-.65-.22-1.33-.46-1.86-.1-.21-.18-.4-.26-.54a8.07 8.07 0 0 0-1.34.64c-.9.54-1.74 1.32-1.95 2.36v.03l-.02.03L12.5 9l.47.16v.02a2.97 2.97 0 0 1-.1.26 5.9 5.9 0 0 1-.31.62c-.27.46-.7 1.07-1.34 1.39-.63.31-1.38.3-1.9.23a5.83 5.83 0 0 1-.7-.12zm3.26-2.39L10.2 7.9l-.02-.01L6.3 4.7l2.57 5.88h.01c.14.04.34.08.57.11.47.06.97.05 1.34-.14.36-.18.68-.57.91-.99.08-.14.15-.27.2-.39zm8.32 4.68a5.47 5.47 0 0 0 1.37-1.02 4.88 4.88 0 0 0 1.46-3.53c-.8.39-1.41.58-1.92.61-.7.05-1.14-.18-1.49-.45a5.6 5.6 0 0 1-.22-.19l-.03-.03-.17-.13a1.4 1.4 0 0 0-.33-.22c-.18-.07-.44-.12-.93 0l-.1.4c-.1.3-.28.69-.58 1.09.87.59 1.6 1.46 2.14 2.2a14.92 14.92 0 0 1 .8 1.27zM9.05 19.19v-.09a4.78 4.78 0 0 0-.96-3.3 5.56 5.56 0 0 0-1.65-1.29c-.3-.17-.6-.3-.8-.4l-.05-.03a4.05 4.05 0 0 0-1.4 2.82 3.1 3.1 0 0 0 .66 2.25c.83.82 1.86.84 2.78.62a5.71 5.71 0 0 0 1.42-.58zm4.26-5.87c-.3.24-.74.54-1.18.66-.37.1-.81.1-1.12.08a6.95 6.95 0 0 1-.54-.06h-.05l.08-.5.08-.5.03.01a5.02 5.02 0 0 0 1.26 0c.24-.06.54-.25.83-.47a6.1 6.1 0 0 0 .42-.37l.02-.02.36.35.35.36h-.01l-.03.04a6.09 6.09 0 0 1-.5.42zM6 17h1v-1H6v1z"/></svg>'
    },
    93826: (d) => {
      d.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="M7.5 24v-5.5m0 0s2.7-1.1 4.5-1c2.1.12 2.9 1.88 5 2 1.8.1 4.5-1 4.5-1v-6m-14 6v-6m0 0v-6s2.7-1.1 4.5-1c2.1.12 2.9 1.88 5 2 1.8.1 4.5-1 4.5-1v6m-14 0s2.7-1.1 4.5-1c2.1.12 2.9 1.88 5 2 1.8.1 4.5-1 4.5-1"/></svg>'
    },
    5474: (d) => {
      d.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M12.5 8h1.36l-.85-3.38.98-.24.9 3.62h7.64a1.34 1.34 0 0 1 .2.02c.13.02.31.07.5.16.18.09.38.24.53.46.15.24.24.52.24.86 0 .34-.09.62-.24.86a1.38 1.38 0 0 1-.79.56L22 24.54l-.03.46H6.5c-1 0-1.64-.68-1.99-1.23a4.4 4.4 0 0 1-.38-.78l-.01-.04c-.1-.03-.22-.07-.34-.13a1.36 1.36 0 0 1-.54-.46A1.51 1.51 0 0 1 3 21.5c0-.34.09-.62.24-.86.15-.22.35-.37.54-.46.1-.05.2-.09.28-.11a6.6 6.6 0 0 1 .96-2.34C5.92 16.35 7.56 15 10.5 15c.72 0 1.36.08 1.93.22l-.4-4.3a1.38 1.38 0 0 1-.8-.57A1.51 1.51 0 0 1 11 9.5c0-.34.09-.62.24-.86.15-.22.35-.37.54-.46a1.73 1.73 0 0 1 .7-.18h.02v.5V8zm.96 7.57a5.73 5.73 0 0 1 2.52 2.16 6.86 6.86 0 0 1 .95 2.34 1.38 1.38 0 0 1 .82.58c.16.23.25.51.25.85 0 .34-.09.62-.24.86-.15.22-.35.37-.54.46-.12.06-.24.1-.34.13l-.01.04a4.4 4.4 0 0 1-.54 1.01h4.7l.93-13h-8.91l.41 4.57zM14.5 9h8a.73.73 0 0 1 .28.07c.06.04.11.08.15.13.03.05.07.14.07.3 0 .16-.04.25-.07.3a.38.38 0 0 1-.15.13.73.73 0 0 1-.27.07H12.5a.73.73 0 0 1-.28-.07.38.38 0 0 1-.15-.13.52.52 0 0 1-.07-.3c0-.16.04-.25.07-.3.04-.05.09-.1.15-.13A.73.73 0 0 1 12.5 9h2.01zm1.4 11a5.8 5.8 0 0 0-.76-1.73C14.41 17.15 13.06 16 10.5 16c-2.56 0-3.91 1.15-4.64 2.27A5.86 5.86 0 0 0 5.1 20h10.78zM4.5 21a.72.72 0 0 0-.28.07.38.38 0 0 0-.15.13.52.52 0 0 0-.07.3c0 .16.04.25.07.3.04.05.09.1.15.13a.73.73 0 0 0 .27.07H16.5a.72.72 0 0 0 .28-.07.38.38 0 0 0 .15-.13.52.52 0 0 0 .07-.3.52.52 0 0 0-.07-.3.38.38 0 0 0-.15-.13.73.73 0 0 0-.27-.07H4.5zm.73 2l.13.23c.28.45.65.77 1.14.77h8c.5 0 .86-.32 1.14-.77.05-.07.1-.15.13-.23H5.23zM11 17v1h-1v-1h1zm-3 1h1v1H8v-1zm4 1v-1h1v1h-1z"/></svg>'
    },
    86209: (d) => {
      d.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M9.5 21H9h.5zm8 0H17h.5zm-6-10H11v1h.5v-1zm4 1h.5v-1h-.5v1zm2 7.5h.5-.5zm.29-1.59A7.97 7.97 0 0 0 21 11.5h-1a6.97 6.97 0 0 1-2.79 5.59l.58.82zM21 11.5A7.5 7.5 0 0 0 13.5 4v1a6.5 6.5 0 0 1 6.5 6.5h1zM13.5 4A7.5 7.5 0 0 0 6 11.5h1A6.5 6.5 0 0 1 13.5 5V4zM6 11.5a7.98 7.98 0 0 0 3.21 6.41l.57-.82A6.98 6.98 0 0 1 7 11.5H6zM9 21a1 1 0 0 0 1 1v-1H9zm8 1a1 1 0 0 0 1-1h-1v1zm-6-.5V23h1v-1.5h-1zm0 1.5a1 1 0 0 0 1 1v-1h-1zm1 1h3v-1h-3v1zm3 0a1 1 0 0 0 1-1h-1v1zm1-1v-1.5h-1V23h1zm-3-11.5v6h1v-6h-1zM9.5 20h8v-1h-8v1zM9 17.5v2h1v-2H9zm0 2V21h1v-1.5H9zm9 1.5v-1.5h-1V21h1zm0-1.5v-2h-1v2h1zM9.5 18h4v-1h-4v1zm4 0h4v-1h-4v1zm-2-6h2v-1h-2v1zm2 0h2v-1h-2v1zM10 22h1.5v-1H10v1zm1.5 0h4v-1h-4v1zm4 0H17v-1h-1.5v1z"/></svg>'
    },
    37603: (d) => {
      d.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M6 14.5C6 9.78 9.78 6 14.5 6c4.72 0 8.5 3.78 8.5 8.5 0 4.72-3.78 8.5-8.5 8.5A8.46 8.46 0 0 1 6 14.5zM14.5 5A9.46 9.46 0 0 0 5 14.5c0 5.28 4.22 9.5 9.5 9.5s9.5-4.22 9.5-9.5S19.78 5 14.5 5zM14 16V9h1v6h4v1h-5z"/></svg>'
    },
    32386: (d) => {
      d.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M6 14.5C6 9.78 9.78 6 14.5 6c4.72 0 8.5 3.78 8.5 8.5 0 4.72-3.78 8.5-8.5 8.5A8.46 8.46 0 0 1 6 14.5zM14.5 5A9.46 9.46 0 0 0 5 14.5c0 5.28 4.22 9.5 9.5 9.5s9.5-4.22 9.5-9.5S19.78 5 14.5 5zM12 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm4 1a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-6 4l-.43.26v.01l.03.03a3.55 3.55 0 0 0 .3.4 5.7 5.7 0 0 0 9.22 0 5.42 5.42 0 0 0 .28-.4l.02-.03v-.01L19 17l-.43-.26v.02a2.45 2.45 0 0 1-.24.32c-.17.21-.43.5-.78.79a4.71 4.71 0 0 1-6.88-.8 4.32 4.32 0 0 1-.23-.31l-.01-.02L10 17z"/></svg>'
    },
    14082: (d) => {
      d.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M5.6 15.43A6.19 6.19 0 0 1 14 6.36a6.19 6.19 0 0 1 8.4 9.08l-.03.02-7.3 7.31a1.5 1.5 0 0 1-2.13 0l-7.3-7.3-.03-.03m.71-.7v-.01a5.19 5.19 0 0 1 7.33-7.34v.01c.2.2.51.19.7 0a5.19 5.19 0 0 1 7.34 7.33l-.03.02-7.3 7.31a.5.5 0 0 1-.71 0l-7.3-7.3-.03-.02z"/></svg>'
    },
    83137: (d) => {
      d.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M22.87 6.44c.09-.78-.53-1.4-1.3-1.31-1.43.15-3.43.48-5.42 1.2a11.8 11.8 0 0 0-5.23 3.44L9.86 11.9l6.24 6.24 2.13-1.06a11.8 11.8 0 0 0 3.44-5.23c.72-1.99 1.05-4 1.2-5.41zm-4.93 11.9l-1.72.86-.04.02h-.04l-2.2.67v.01a19.68 19.68 0 0 0-.13 3.33c.01.14.08.22.17.26.08.04.2.05.32-.03a18.83 18.83 0 0 0 2.79-2.26 8.18 8.18 0 0 0 .44-1.1c.16-.51.33-1.12.41-1.76zm-.44 3.16l.35.35-.01.02-.05.05a16.85 16.85 0 0 1-.83.76c-.54.47-1.3 1.08-2.1 1.61a1.3 1.3 0 0 1-2.05-.98 16.46 16.46 0 0 1 .09-3.08l-.16.05a1.5 1.5 0 0 1-1.53-.36l-3.13-3.13c-.4-.4-.54-1-.36-1.53l.05-.16-.36.04c-.7.06-1.62.11-2.54.06a1.3 1.3 0 0 1-1.13-.8c-.18-.42-.13-.94.17-1.35a87.55 87.55 0 0 1 2.15-2.8l.04-.04v-.02l.4.31-.22-.45.03-.01a5.93 5.93 0 0 1 .34-.16c.23-.1.55-.22.94-.35A9.77 9.77 0 0 1 10.26 9a12.9 12.9 0 0 1 5.55-3.61c2.09-.76 4.18-1.1 5.65-1.26 1.41-.15 2.56 1 2.4 2.41a24.04 24.04 0 0 1-1.25 5.65A12.9 12.9 0 0 1 19 17.74a9.77 9.77 0 0 1-.88 3.61 9.18 9.18 0 0 1-.16.34v.03h-.01l-.45-.22zm0 0l.45.22-.04.08-.06.05-.35-.35zm-11-11l-.4-.31.08-.09.1-.05.22.45zm3.16-.44a9.61 9.61 0 0 0-2.84.84l-.13.16a109.83 109.83 0 0 0-1.97 2.58.4.4 0 0 0-.06.38c.04.1.12.17.27.18a16.05 16.05 0 0 0 3.18-.15l.66-2.2.01-.03.02-.04.86-1.72zm5.4 8.45l-5.57-5.56-.51 1.7-.31.92a.5.5 0 0 0 .12.51l3.13 3.13a.5.5 0 0 0 .5.12l.92-.3h.02l1.7-.52zm-10.91.64l2-2 .7.7-2 2-.7-.7zm0 4l4-4 .7.7-4 4-.7-.7zm4 0l2-2 .7.7-2 2-.7-.7zM16 10.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zM17.5 8a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/></svg>'
    },
    18438: (d, e, u) => {
      u.d(e, { default: () => t })
      const t = (() => {
        var d = {
            base: 'https://twemoji.maxcdn.com/v/13.0.1/',
            ext: '.png',
            size: '72x72',
            className: 'emoji',
            convert: {
              fromCodePoint: (d) => {
                var e = 'string' == typeof d ? Number.parseInt(d, 16) : d
                if (e < 65536) return r(e)
                return r(55296 + ((e -= 65536) >> 10), 56320 + (1023 & e))
              },
              toCodePoint: g,
            },
            onerror: function () {
              this.parentNode &&
                this.parentNode.replaceChild(a(this.alt, !1), this)
            },
            parse: (e, u) => {
              ;(u && 'function' != typeof u) || (u = { callback: u })
              return ('string' == typeof e ? v : m)(e, {
                callback: u.callback || i,
                attributes:
                  'function' == typeof u.attributes ? u.attributes : b,
                base: 'string' == typeof u.base ? u.base : d.base,
                ext: u.ext || d.ext,
                size:
                  u.folder ||
                  ((t = u.size || d.size),
                  'number' == typeof t ? t + 'x' + t : t),
                className: u.className || d.className,
                onerror: u.onerror || d.onerror,
              })
              var t
            },
            replace: p,
            test: (d) => {
              u.lastIndex = 0
              var e = u.test(d)
              return (u.lastIndex = 0), e
            },
          },
          e = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;',
          },
          u =
            /(?:\ud83d\udc68\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc68\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc68\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\u200d\ud83e\udd1d\u200d\ud83e\uddd1|\ud83d\udc6b\ud83c[\udffb-\udfff]|\ud83d\udc6c\ud83c[\udffb-\udfff]|\ud83d\udc6d\ud83c[\udffb-\udfff]|\ud83d[\udc6b-\udc6d])|(?:\ud83d[\udc68\udc69]|\ud83e\uddd1)(?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf7c\udf84\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92]|\ud83e[\uddaf-\uddb3\uddbc\uddbd])|(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75]|\u26f9)((?:\ud83c[\udffb-\udfff]|\ufe0f)\u200d[\u2640\u2642]\ufe0f)|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc70\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd35\udd37-\udd39\udd3d\udd3e\uddb8\uddb9\uddcd-\uddcf\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f|(?:\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\u26a7\ufe0f|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc15\u200d\ud83e\uddba|\ud83d\udc3b\u200d\u2744\ufe0f|\ud83d\udc41\u200d\ud83d\udde8|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f|\ud83d\udc08\u200d\u2b1b)|[#*0-9]\ufe0f?\u20e3|(?:[©®\u2122\u265f]\ufe0f)|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcd\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u203c\u2049\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2697\u2699\u269b\u269c\u26a0\u26a1\u26a7\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))|(?:(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75\udd90]|[\u261d\u26f7\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|(?:\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0\udecc]|\ud83e[\udd0c\udd0f\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\udd77\uddb5\uddb6\uddb8\uddb9\uddbb\uddcd-\uddcf\uddd1-\udddd]|[\u270a\u270b]))(?:\ud83c[\udffb-\udfff])?|(?:\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\uded0-\uded2\uded5-\uded7\udeeb\udeec\udef4-\udefc\udfe0-\udfeb]|\ud83e[\udd0d\udd0e\udd10-\udd17\udd1d\udd20-\udd25\udd27-\udd2f\udd3a\udd3c\udd3f-\udd45\udd47-\udd76\udd78\udd7a-\uddb4\uddb7\uddba\uddbc-\uddcb\uddd0\uddde-\uddff\ude70-\ude74\ude78-\ude7a\ude80-\ude86\ude90-\udea8\udeb0-\udeb6\udec0-\udec2\uded0-\uded6]|[\u23e9-\u23ec\u23f0\u23f3\u267e\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a])|\ufe0f/g,
          t = /\uFE0F/g,
          n = String.fromCharCode(8205),
          c = /[&<>'"]/g,
          o = /^(?:iframe|noframes|noscript|script|select|style|textarea)$/,
          r = String.fromCharCode
        return d
        function a(d, e) {
          return document.createTextNode(e ? d.replace(t, '') : d)
        }
        function f(d) {
          return d.replace(c, h)
        }
        function i(d, e) {
          return ''.concat(e.base, e.size, '/', d, e.ext)
        }
        function l(d, e) {
          for (var u, t, n = d.childNodes, c = n.length; c--; )
            3 === (t = (u = n[c]).nodeType)
              ? e.push(u)
              : 1 !== t ||
                'ownerSVGElement' in u ||
                o.test(u.nodeName.toLowerCase()) ||
                l(u, e)
          return e
        }
        function s(d) {
          return g(d.indexOf(n) < 0 ? d.replace(t, '') : d)
        }
        function m(d, e) {
          for (
            var t,
              n,
              c,
              o,
              r,
              f,
              i,
              m,
              v,
              h,
              b,
              p,
              g,
              w = l(d, []),
              E = w.length;
            E--;
          ) {
            for (
              c = !1,
                o = document.createDocumentFragment(),
                f = (r = w[E]).nodeValue,
                m = 0;
              (i = u.exec(f));
            ) {
              if (
                ((v = i.index) !== m && o.appendChild(a(f.slice(m, v), !0)),
                (p = s((b = i[0]))),
                (m = v + b.length),
                (g = e.callback(p, e)),
                p && g)
              ) {
                for (n in (((h = new Image()).onerror = e.onerror),
                h.setAttribute('draggable', 'false'),
                (t = e.attributes(b, p))))
                  Object.hasOwn(t, n) &&
                    0 !== n.indexOf('on') &&
                    !h.hasAttribute(n) &&
                    h.setAttribute(n, t[n])
                ;(h.className = e.className),
                  (h.alt = b),
                  (h.src = g),
                  (c = !0),
                  o.appendChild(h)
              }
              h || o.appendChild(a(b, !1)), (h = null)
            }
            c &&
              (m < f.length && o.appendChild(a(f.slice(m), !0)),
              r.parentNode.replaceChild(o, r))
          }
          return d
        }
        function v(d, e) {
          return p(d, (d) => {
            var u,
              t,
              n = d,
              c = s(d),
              o = e.callback(c, e)
            if (c && o) {
              for (t in ((n = '<img '.concat(
                'class="',
                e.className,
                '" ',
                'draggable="false" ',
                'alt="',
                d,
                '"',
                ' src="',
                o,
                '"',
              )),
              (u = e.attributes(d, c))))
                Object.hasOwn(u, t) &&
                  0 !== t.indexOf('on') &&
                  -1 === n.indexOf(' ' + t + '=') &&
                  (n = n.concat(' ', t, '="', f(u[t]), '"'))
              n = n.concat('/>')
            }
            return n
          })
        }
        function h(d) {
          return e[d]
        }
        function b() {
          return null
        }
        function p(d, e) {
          return String(d).replace(u, e)
        }
        function g(d, e) {
          for (var u = [], t = 0, n = 0, c = 0; c < d.length; )
            (t = d.charCodeAt(c++)),
              n
                ? (u.push(
                    (65536 + ((n - 55296) << 10) + (t - 56320)).toString(16),
                  ),
                  (n = 0))
                : 55296 <= t && t <= 56319
                  ? (n = t)
                  : u.push(t.toString(16))
          return u.join(e || '-')
        }
      })()
    },
  },
])
