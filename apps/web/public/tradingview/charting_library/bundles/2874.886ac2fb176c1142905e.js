;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2874],
  {
    865968: (t, e, n) => {
      n.d(e, {
        useComposedKeyboardActionHandlers: () => s,
        useKeyboardActionHandler: () => i,
        useKeyboardClose: () => u,
        useKeyboardEventHandler: () => a,
        useKeyboardOpen: () => d,
        useKeyboardToggle: () => c,
      })
      var r = n(50959),
        l = n(930202)
      const o = () => !0
      function i(t, e, n = o, l) {
        return (0, r.useCallback)(
          (r) => {
            if (l) {
              if ('horizontal' === l && (40 === r || 38 === r)) return
              if ('vertical' === l && (37 === r || 39 === r)) return
            }
            const o = t.map((t) => ('function' == typeof t ? t() : t))
            return !(!n(r) || !o.includes(r)) && (e(r), !0)
          },
          [...t, e, n],
        )
      }
      function s(...t) {
        return (0, r.useCallback)(
          (e) => {
            for (const n of t) if (n(e)) return !0
            return !1
          },
          [...t],
        )
      }
      function a(t, e = !0) {
        const n = s(...t)
        return (0, r.useCallback)(
          (t) => {
            n((0, l.hashFromEvent)(t)) && e && t.preventDefault()
          },
          [n],
        )
      }
      function c(t, e = !0) {
        return i([13, 32], t, (t) => {
          if (13 === t) return e
          return !0
        })
      }
      function u(t, e) {
        return i(
          [9, (0, r.useCallback)(() => l.Modifiers.Shift + 9, []), 27],
          e,
          (0, r.useCallback)(() => t, [t]),
        )
      }
      function d(t, e) {
        return i(
          [40, 38],
          e,
          (0, r.useCallback)(() => !t, [t]),
        )
      }
    },
    772069: (t, e, n) => {
      n.d(e, { useDisclosure: () => c })
      var r = n(50959),
        l = n(650151),
        o = n(954343),
        i = n(383836),
        s = n(269842),
        a = n(414823)
      function c(t) {
        const {
            id: e,
            listboxId: n,
            disabled: c,
            buttonTabIndex: u = 0,
            onFocus: d,
            onBlur: f,
            onClick: h,
          } = t,
          [b, p] = (0, r.useState)(!1),
          [g, v] = (0, i.useFocus)(),
          m = g || b,
          S = (null != n ? n : void 0 !== e)
            ? (0, a.createDomId)(e, 'listbox')
            : void 0,
          C = (0, r.useRef)(null),
          _ = (0, r.useCallback)(
            (t) => {
              var e
              return null === (e = C.current) || void 0 === e
                ? void 0
                : e.focus(t)
            },
            [C],
          ),
          k = (0, r.useRef)(null),
          y = (0, r.useCallback)(
            () => (0, l.ensureNotNull)(k.current).focus(),
            [k],
          ),
          z = (0, r.useCallback)(() => p(!0), [p]),
          x = (0, r.useCallback)(
            (t = !1, e = !1) => {
              p(!1)
              const { activeElement: n } = document
              ;(n && (0, o.isTextEditingField)(n)) ||
                e ||
                _({ preventScroll: t })
            },
            [p, _],
          ),
          E = (0, r.useCallback)(() => {
            b ? x() : z()
          }, [b, x, z]),
          w = c ? [] : [d, v.onFocus],
          M = c ? [] : [f, v.onBlur],
          R = c ? [] : [h, E],
          F = (0, s.createSafeMulticastEventHandler)(...w),
          H = (0, s.createSafeMulticastEventHandler)(...M),
          I = (0, s.createSafeMulticastEventHandler)(...R)
        return {
          listboxId: S,
          isOpened: b,
          isFocused: m,
          buttonTabIndex: c ? -1 : u,
          listboxTabIndex: -1,
          open: z,
          close: x,
          toggle: E,
          onOpen: y,
          buttonFocusBindings: { onFocus: F, onBlur: H },
          onButtonClick: I,
          buttonRef: C,
          listboxRef: k,
          buttonAria: {
            'aria-controls': b ? S : void 0,
            'aria-expanded': b,
            'aria-disabled': c,
          },
        }
      }
    },
    383836: (t, e, n) => {
      n.d(e, { useFocus: () => l })
      var r = n(50959)
      function l(t, e) {
        const [n, l] = (0, r.useState)(!1)
        ;(0, r.useEffect)(() => {
          e && n && l(!1)
        }, [e, n])
        const o = {
          onFocus: (0, r.useCallback)(
            (e) => {
              ;(void 0 !== t && t.current !== e.target) || l(!0)
            },
            [t],
          ),
          onBlur: (0, r.useCallback)(
            (e) => {
              ;(void 0 !== t && t.current !== e.target) || l(!1)
            },
            [t],
          ),
        }
        return [n, o]
      }
    },
    648621: (t, e, n) => {
      n.d(e, { useItemsKeyboardNavigation: () => i })
      var r = n(50959),
        l = n(865968)
      function o(t, e) {
        return t >= 0 ? t % e : (e - (Math.abs(t) % e)) % e
      }
      function i(t, e, n, i, s, a, c = {}, u) {
        const d = (0, r.useCallback)(
            (t) => {
              const e = n.findIndex(i)
              if (e === n.length - 1 && !a)
                return void (
                  (null == u ? void 0 : u.onFailNext) && u.onFailNext(t)
                )
              const r = o(e + 1, n.length)
              s && s(n[r], 'next')
            },
            [n, i, s, a],
          ),
          f = (0, r.useCallback)(
            (t) => {
              const e = n.findIndex(i)
              if (0 === e && !a)
                return void (
                  (null == u ? void 0 : u.onFailPrev) && u.onFailPrev(t)
                )
              const r = o(e - 1, n.length)
              s && s(n[r], 'previous')
            },
            [n, i, s, a],
          ),
          h = (0, r.useCallback)(() => {
            s && s(n[0], 'first')
          }, [s, n]),
          b = (0, r.useCallback)(() => {
            s && s(n[n.length - 1], 'last')
          }, [s, n]),
          p = (0, r.useMemo)(
            () =>
              ((t) => ({
                next: [40, () => (t() ? 37 : 39)],
                previous: [38, () => (t() ? 39 : 37)],
                first: [33, () => (t() ? 35 : 36)],
                last: [34, () => (t() ? 36 : 35)],
              }))(e),
            [e],
          ),
          {
            next: g = p.next,
            previous: v = p.previous,
            first: m = p.first,
            last: S = p.last,
          } = c
        return (0, l.useComposedKeyboardActionHandlers)(
          (0, l.useKeyboardActionHandler)(g, d, () => !0, t),
          (0, l.useKeyboardActionHandler)(v, f, () => !0, t),
          (0, l.useKeyboardActionHandler)(m, h, () => !0, t),
          (0, l.useKeyboardActionHandler)(S, b, () => !0, t),
        )
      }
    },
    930617: (t, e, n) => {
      n.d(e, { useKeepActiveItemIntoView: () => d })
      var r = n(50959),
        l = n(650151),
        o = n(549423)
      const i = { duration: 200, additionalScroll: 0 },
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
      function a(t, e) {
        const n = s[t]
        return e[n.scrollSize] > e[n.clientSize]
      }
      function c(t, e, n, r, l, i) {
        const a = ((t, e, n, r = 0) => {
          const l = s[t]
          return {
            start: -1 * r,
            middle:
              -1 * (Math.floor(n[l.size] / 2) - Math.floor(e[l.size] / 2)),
            end: -1 * (n[l.size] - e[l.size]) + r,
          }
        })(t, r, l, i.additionalScroll)
        let c = 0
        if (
          ((t, e, n) => {
            const r = s[t]
            return (
              e[r.start] < n[r.start] - n[r.size] / 2 ||
              e[r.end] > n[r.end] + n[r.size] / 2
            )
          })(t, r, l)
        )
          c = a.middle
        else {
          const e = ((t, e, n, r = 0) => {
              const l = s[t],
                o = e[l.start] + Math.floor(e[l.size] / 2),
                i = n[l.start] + Math.floor(n[l.size] / 2)
              return {
                start: e[l.start] - n[l.start] - r,
                middle: o - i,
                end: e[l.end] - n[l.end] + r,
              }
            })(t, r, l, i.additionalScroll),
            n = ((t) => {
              const { start: e, middle: n, end: r } = t,
                l = new Map([
                  [Math.abs(e), { key: 'start', value: Math.sign(e) }],
                  [Math.abs(n), { key: 'middle', value: Math.sign(n) }],
                  [Math.abs(r), { key: 'end', value: Math.sign(r) }],
                ]),
                o = Math.min(...l.keys())
              return l.get(o)
            })(e)
          c = void 0 !== n ? a[n.key] : 0
        }
        return ((t) => {
          const {
            additionalScroll: e = 0,
            duration: n = o.dur,
            func: r = o.easingFunc.easeInOutCubic,
            onScrollEnd: l,
            target: i,
            wrap: s,
            direction: a = 'vertical',
          } = t
          let { targetRect: c, wrapRect: u } = t
          ;(c = null != c ? c : i.getBoundingClientRect()),
            (u = null != u ? u : s.getBoundingClientRect())
          const d = ('vertical' === a ? c.top - u.top : c.left - u.left) + e,
            f = 'vertical' === a ? 'scrollTop' : 'scrollLeft',
            h = s ? s[f] : 0
          let b,
            p = 0
          return (
            (p = window.requestAnimationFrame(function t(e) {
              let o
              if ((b ? (o = e - b) : ((o = 0), (b = e)), o >= n))
                return (s[f] = h + d), void (l && l())
              const i = h + d * r(o / n)
              ;(s[f] = Math.floor(i)), (p = window.requestAnimationFrame(t))
            })),
            () => {
              window.cancelAnimationFrame(p), l && l()
            }
          )
        })({
          ...i,
          target: e,
          targetRect: r,
          wrap: n,
          wrapRect: l,
          additionalScroll: c,
          direction: t,
        })
      }
      class u {
        constructor(t = null) {
          ;(this._container = null),
            (this._lastScrolledElement = null),
            (this._stopVerticalScroll = null),
            (this._stopHorizontalScroll = null),
            (this._container = t)
        }
        scrollTo(t, e = i) {
          if (
            null !== this._container &&
            null !== t &&
            !((t, e) => {
              const n = t.getBoundingClientRect(),
                r = e.getBoundingClientRect()
              return (
                n.top >= r.top &&
                n.bottom <= r.bottom &&
                n.left >= r.left &&
                n.right <= r.right
              )
            })(t, this._container)
          ) {
            const n = t.getBoundingClientRect(),
              r = this._container.getBoundingClientRect()
            this.stopScroll(),
              a('vertical', this._container) &&
                (this._stopVerticalScroll = c(
                  'vertical',
                  t,
                  this._container,
                  n,
                  r,
                  this._modifyOptions('vertical', e),
                )),
              a('horizontal', this._container) &&
                (this._stopHorizontalScroll = c(
                  'horizontal',
                  t,
                  this._container,
                  n,
                  r,
                  this._modifyOptions('horizontal', e),
                ))
          }
          this._lastScrolledElement = t
        }
        scrollToLastElement(t) {
          this.scrollTo(this._lastScrolledElement, t)
        }
        stopScroll() {
          null !== this._stopVerticalScroll && this._stopVerticalScroll(),
            null !== this._stopHorizontalScroll && this._stopHorizontalScroll()
        }
        getContainer() {
          return this._container
        }
        setContainer(t) {
          var e
          ;(this._container = t),
            (null === (e = this._container) || void 0 === e
              ? void 0
              : e.contains(this._lastScrolledElement)) ||
              (this._lastScrolledElement = null)
        }
        destroy() {
          this.stopScroll(),
            (this._container = null),
            (this._lastScrolledElement = null)
        }
        _handleScrollEnd(t) {
          'vertical' === t
            ? (this._stopVerticalScroll = null)
            : (this._stopHorizontalScroll = null)
        }
        _modifyOptions(t, e) {
          return Object.assign({}, e, {
            onScrollEnd: () => {
              this._handleScrollEnd(t),
                void 0 !== e.onScrollEnd && e.onScrollEnd()
            },
          })
        }
      }
      function d(t = {}) {
        const { activeItem: e, getKey: n, ...o } = t,
          i = (0, r.useRef)(null),
          s = (0, r.useRef)(new Map()),
          a = ((t) => {
            const e = (0, r.useRef)(null)
            return (
              (0, r.useEffect)(
                () => (
                  (e.current = new u(t)),
                  () => (0, l.ensureNotNull)(e.current).destroy()
                ),
                [],
              ),
              e
            )
          })(i.current),
          c = (0, r.useCallback)(() => {
            null !== a.current &&
              null !== i.current &&
              a.current.getContainer() !== i.current &&
              a.current.setContainer(i.current)
          }, [a, i]),
          d = (0, r.useCallback)(
            (t) => {
              i.current = t
            },
            [i],
          ),
          f = (0, r.useCallback)(
            (t, e) => {
              const r = n ? n(t) : t
              e ? s.current.set(r, e) : s.current.delete(r)
            },
            [s, n],
          ),
          h = (0, r.useCallback)(
            (t, e) => {
              if (!t) return
              const r = n ? n(t) : t,
                o = s.current.get(r)
              o && (c(), (0, l.ensureNotNull)(a.current).scrollTo(o, e))
            },
            [s, a, n],
          )
        return (0, r.useEffect)(() => h(e, o), [h, e]), [d, f, h]
      }
    },
    525388: (t, e, n) => {
      n.d(e, { useMergedRefs: () => o })
      var r = n(50959),
        l = n(273388)
      function o(t) {
        return (0, r.useCallback)((0, l.mergeRefs)(t), t)
      }
    },
    414823: (t, e, n) => {
      n.d(e, { createDomId: () => a, joinDomIds: () => c })
      const r = /\s/g
      function l(t) {
        return 'string' == typeof t
      }
      function o(t) {
        switch (typeof t) {
          case 'string':
            return t
          case 'number':
          case 'bigint':
            return t.toString(10)
          case 'boolean':
          case 'symbol':
            return t.toString()
          default:
            return null
        }
      }
      function i(t) {
        return t.trim().length > 0
      }
      function s(t) {
        return t.replace(r, '-')
      }
      function a(...t) {
        const e = t.map(o).filter(l).filter(i).map(s)
        return (e.length > 0 && e[0].startsWith('id_') ? e : ['id', ...e]).join(
          '_',
        )
      }
      function c(...t) {
        return t.map(o).filter(l).filter(i).join(' ')
      }
    },
    586240: (t) => {
      t.exports = JSON.parse(
        '{"size-header-height":"64px","media-phone-vertical":"screen and (max-width: 479px)","media-mf-phone-landscape":"screen and (min-width: 568px)"}',
      )
    },
  },
])
