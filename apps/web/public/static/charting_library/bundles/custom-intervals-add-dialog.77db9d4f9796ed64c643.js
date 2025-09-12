;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [4013],
  {
    61442: (e) => {
      e.exports = {
        button: 'button-PYEOTd6i',
        disabled: 'disabled-PYEOTd6i',
        hidden: 'hidden-PYEOTd6i',
        icon: 'icon-PYEOTd6i',
        dropped: 'dropped-PYEOTd6i',
      }
    },
    99505: (e) => {
      e.exports = {
        button: 'button-tFul0OhX',
        'button-children': 'button-children-tFul0OhX',
        hiddenArrow: 'hiddenArrow-tFul0OhX',
        invisibleFocusHandler: 'invisibleFocusHandler-tFul0OhX',
      }
    },
    65630: (e) => {
      e.exports = { placeholder: 'placeholder-V6ceS6BN' }
    },
    86332: (e, t, n) => {
      n.d(t, { ControlGroupContext: () => o })
      const o = n(50959).createContext({
        isGrouped: !1,
        cellState: { isTop: !0, isRight: !0, isBottom: !0, isLeft: !0 },
      })
    },
    66686: (e, t, n) => {
      n.d(t, {
        useComposedKeyboardActionHandlers: () => s,
        useKeyboardActionHandler: () => i,
        useKeyboardClose: () => u,
        useKeyboardEventHandler: () => a,
        useKeyboardOpen: () => d,
        useKeyboardToggle: () => c,
      })
      var o = n(50959),
        l = n(3343)
      const r = () => !0
      function i(e, t, n = r, l) {
        return (0, o.useCallback)(
          (o) => {
            if (l) {
              if ('horizontal' === l && (40 === o || 38 === o)) return
              if ('vertical' === l && (37 === o || 39 === o)) return
            }
            const r = e.map((e) => ('function' == typeof e ? e() : e))
            return !(!n(o) || !r.includes(o)) && (t(o), !0)
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
        const r = s(...e)
        return (0, o.useCallback)(
          (e) => {
            const o = r((0, l.hashFromEvent)(e))
            o && t && e.preventDefault(), o && n && e.stopPropagation()
          },
          [r],
        )
      }
      function c(e, t = !0) {
        return i([13, 32], e, (e) => {
          if (13 === e) return t
          return !0
        })
      }
      function u(e, t) {
        return i(
          [9, (0, o.useCallback)(() => l.Modifiers.Shift + 9, []), 27],
          t,
          (0, o.useCallback)(() => e, [e]),
        )
      }
      function d(e, t) {
        return i(
          [40, 38],
          t,
          (0, o.useCallback)(() => !e, [e]),
        )
      }
    },
    36104: (e, t, n) => {
      n.d(t, { useControlDisclosure: () => l })
      var o = n(7953)
      function l(e) {
        const { intent: t, highlight: n, ...l } = e,
          { isFocused: r, ...i } = (0, o.useDisclosure)(l)
        return {
          ...i,
          isFocused: r,
          highlight: n ?? r,
          intent: t ?? (r ? 'primary' : 'default'),
        }
      }
    },
    7953: (e, t, n) => {
      n.d(t, { useDisclosure: () => c })
      var o = n(50959),
        l = n(50151),
        r = n(54717),
        i = n(29202),
        s = n(47201),
        a = n(22064)
      function c(e) {
        const {
            id: t,
            listboxId: n,
            disabled: c,
            buttonTabIndex: u = 0,
            onFocus: d,
            onBlur: p,
            onClick: b,
          } = e,
          [f, h] = (0, o.useState)(!1),
          [m, v] = (0, i.useFocus)(),
          g = m || f,
          C = (n ?? void 0 !== t) ? (0, a.createDomId)(t, 'listbox') : void 0,
          x = (0, o.useRef)(null),
          S = (0, o.useCallback)((e) => x.current?.focus(e), [x]),
          y = (0, o.useRef)(null),
          E = (0, o.useCallback)(
            () => (0, l.ensureNotNull)(y.current).focus(),
            [y],
          ),
          w = (0, o.useCallback)(() => h(!0), [h]),
          I = (0, o.useCallback)(
            (e = !1, t = !1) => {
              h(!1)
              const { activeElement: n } = document
              ;(n && (0, r.isTextEditingField)(n)) ||
                t ||
                S({ preventScroll: e })
            },
            [h, S],
          ),
          k = (0, o.useCallback)(() => {
            f ? I() : w()
          }, [f, I, w]),
          O = c ? [] : [d, v.onFocus],
          N = c ? [] : [p, v.onBlur],
          R = c ? [] : [b, k],
          F = (0, s.createSafeMulticastEventHandler)(...O),
          D = (0, s.createSafeMulticastEventHandler)(...N),
          A = (0, s.createSafeMulticastEventHandler)(...R)
        return {
          listboxId: C,
          isOpened: f,
          isFocused: g,
          buttonTabIndex: c ? -1 : u,
          listboxTabIndex: -1,
          open: w,
          close: I,
          toggle: k,
          onOpen: E,
          buttonFocusBindings: { onFocus: F, onBlur: D },
          onButtonClick: A,
          buttonRef: x,
          listboxRef: y,
          buttonAria: {
            'aria-controls': f ? C : void 0,
            'aria-expanded': f,
            'aria-disabled': c,
          },
        }
      }
    },
    29202: (e, t, n) => {
      n.d(t, { useFocus: () => l })
      var o = n(50959)
      function l(e, t) {
        const [n, l] = (0, o.useState)(!1)
        ;(0, o.useEffect)(() => {
          t && n && l(!1)
        }, [t, n])
        const r = {
          onFocus: (0, o.useCallback)(
            (t) => {
              ;(void 0 !== e && e.current !== t.target) || l(!0)
            },
            [e],
          ),
          onBlur: (0, o.useCallback)(
            (t) => {
              ;(void 0 !== e && e.current !== t.target) || l(!1)
            },
            [e],
          ),
        }
        return [n, r]
      }
    },
    36762: (e, t, n) => {
      n.d(t, { useItemsKeyboardNavigation: () => a })
      var o,
        l = n(50959),
        r = n(66686)
      function i(e, t) {
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
      function a(e, t, n, o, a, c, u = {}, d, p) {
        const b = (0, l.useCallback)(
            (e) => {
              const t = n.findIndex(o)
              if (t === n.length - 1 && !c)
                return void (d?.onFailNext && d.onFailNext(e))
              const l = i(t + 1, n.length)
              a && a(n[l], 'next')
            },
            [n, o, a, c],
          ),
          f = (0, l.useCallback)(
            (e) => {
              const t = n.findIndex(o)
              if (0 === t && !c) return void (d?.onFailPrev && d.onFailPrev(e))
              const l = i(t - 1, n.length)
              a && a(n[l], 'previous')
            },
            [n, o, a, c],
          ),
          h = (0, l.useCallback)(() => {
            a && a(n[0], 'first')
          }, [a, n]),
          m = (0, l.useCallback)(() => {
            a && a(n[n.length - 1], 'last')
          }, [a, n]),
          v = (0, l.useMemo)(() => s(t), [t]),
          {
            next: g = v.next,
            previous: C = v.previous,
            first: x = v.first,
            last: S = v.last,
          } = u
        return (0, r.useComposedKeyboardActionHandlers)(
          (0, r.useKeyboardActionHandler)(g, b, p?.next ?? (() => !0), e),
          (0, r.useKeyboardActionHandler)(C, f, p?.previous ?? (() => !0), e),
          (0, r.useKeyboardActionHandler)(x, h, () => !0, e),
          (0, r.useKeyboardActionHandler)(S, m, () => !0, e),
        )
      }
    },
    16921: (e, t, n) => {
      n.d(t, { useKeepActiveItemIntoView: () => d })
      var o = n(50959),
        l = n(50151),
        r = n(74991)
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
      function a(e, t) {
        const n = s[e]
        return t[n.scrollSize] > t[n.clientSize]
      }
      function c(e, t, n, o, l, i) {
        const a = ((e, t, n, o = 0) => {
          const l = s[e]
          return {
            start: -1 * o,
            middle:
              -1 * (Math.floor(n[l.size] / 2) - Math.floor(t[l.size] / 2)),
            end: -1 * (n[l.size] - t[l.size]) + o,
          }
        })(e, o, l, i.additionalScroll)
        let c = 0
        if (
          i.snapToMiddle ||
          ((e, t, n) => {
            const o = s[e]
            return (
              t[o.start] < n[o.start] - n[o.size] / 2 ||
              t[o.end] > n[o.end] + n[o.size] / 2
            )
          })(e, o, l)
        )
          c = a.middle
        else {
          const t = ((e, t, n, o = 0) => {
              const l = s[e],
                r = t[l.start] + Math.floor(t[l.size] / 2),
                i = n[l.start] + Math.floor(n[l.size] / 2)
              return {
                start: t[l.start] - n[l.start] - o,
                middle: r - i,
                end: t[l.end] - n[l.end] + o,
              }
            })(e, o, l, i.additionalScroll),
            n = ((e) => {
              const { start: t, middle: n, end: o } = e,
                l = new Map([
                  [Math.abs(t), { key: 'start', value: Math.sign(t) }],
                  [Math.abs(n), { key: 'middle', value: Math.sign(n) }],
                  [Math.abs(o), { key: 'end', value: Math.sign(o) }],
                ]),
                r = Math.min(...l.keys())
              return l.get(r)
            })(t)
          c = void 0 !== n ? a[n.key] : 0
        }
        return (
          i.align && (c = a[i.align]),
          ((e) => {
            const {
              additionalScroll: t = 0,
              duration: n = r.dur,
              func: o = r.easingFunc.easeInOutCubic,
              onScrollEnd: l,
              target: i,
              wrap: s,
              direction: a = 'vertical',
            } = e
            let { targetRect: c, wrapRect: u } = e
            ;(c = c ?? i.getBoundingClientRect()),
              (u = u ?? s.getBoundingClientRect())
            const d = ('vertical' === a ? c.top - u.top : c.left - u.left) + t,
              p = 'vertical' === a ? 'scrollTop' : 'scrollLeft',
              b = s ? s[p] : 0
            let f,
              h = 0
            return (
              (h = window.requestAnimationFrame(function e(t) {
                let r
                if ((f ? (r = t - f) : ((r = 0), (f = t)), r >= n))
                  return (s[p] = b + d), void (l && l())
                const i = b + d * o(r / n)
                ;(s[p] = Math.floor(i)), (h = window.requestAnimationFrame(e))
              })),
              () => {
                window.cancelAnimationFrame(h), l && l()
              }
            )
          })({
            ...i,
            target: t,
            targetRect: o,
            wrap: n,
            wrapRect: l,
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
        scrollTo(e, t = i) {
          if (
            null !== this._container &&
            null !== e &&
            !((e, t, n = 0) => {
              const o = e.getBoundingClientRect(),
                l = t.getBoundingClientRect()
              return (
                o.top - l.top >= 0 &&
                l.bottom - o.bottom >= 0 &&
                o.left - l.left >= n &&
                l.right - o.right >= n
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
        const { activeItem: t, getKey: n, ...r } = e,
          i = (0, o.useRef)(null),
          s = (0, o.useRef)(new Map()),
          a = ((e) => {
            const t = (0, o.useRef)(null)
            return (
              (0, o.useEffect)(
                () => (
                  (t.current = new u(e)),
                  () => (0, l.ensureNotNull)(t.current).destroy()
                ),
                [],
              ),
              t
            )
          })(i.current),
          c = (0, o.useCallback)(() => {
            null !== a.current &&
              null !== i.current &&
              a.current.getContainer() !== i.current &&
              a.current.setContainer(i.current)
          }, [a, i]),
          d = (0, o.useCallback)(
            (e) => {
              i.current = e
            },
            [i],
          ),
          p = (0, o.useCallback)(
            (e, t) => {
              const o = n ? n(e) : e
              t ? s.current.set(o, t) : s.current.delete(o)
            },
            [s, n],
          ),
          b = (0, o.useCallback)(
            (e, t) => {
              if (!e) return
              const o = n ? n(e) : e,
                r = s.current.get(o)
              r && (c(), (0, l.ensureNotNull)(a.current).scrollTo(r, t))
            },
            [s, a, n],
          )
        return (0, o.useEffect)(() => b(t, r), [b, t]), [d, p, b]
      }
    },
    38528: (e, t, n) => {
      n.d(t, { useMergedRefs: () => r })
      var o = n(50959),
        l = n(53017)
      function r(e) {
        return (0, o.useCallback)((0, l.mergeRefs)(e), e)
      }
    },
    22064: (e, t, n) => {
      n.d(t, { createDomId: () => p, joinDomIds: () => b })
      const o = 'id',
        l = /\s/g,
        r = '-',
        i = '_',
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
        return e.replace(l, r)
      }
      function p(...e) {
        const t = e.map(c).filter(a).filter(u).map(d)
        return (t.length > 0 && t[0].startsWith(o + i) ? t : [o, ...t]).join(i)
      }
      function b(...e) {
        return e.map(c).filter(a).filter(u).join(s)
      }
    },
    34094: (e, t, n) => {
      n.d(t, { getTextForTooltip: () => i })
      var o = n(50959)
      const l = (e) => (0, o.isValidElement)(e) && Boolean(e.props.children),
        r = (e) =>
          null == e || 'boolean' == typeof e || '{}' === JSON.stringify(e)
            ? ''
            : e.toString() + ' ',
        i = (e) =>
          Array.isArray(e) || (0, o.isValidElement)(e)
            ? o.Children.toArray(e)
                .reduce((e, t) => {
                  let n = ''
                  return (
                    (n =
                      (0, o.isValidElement)(t) && l(t)
                        ? i(t.props.children)
                        : (0, o.isValidElement)(t) && !l(t)
                          ? ''
                          : r(t)),
                    e.concat(n)
                  )
                }, '')
                .trim()
            : r(e)
    },
    59054: (e, t, n) => {
      n.d(t, { ControlDisclosureView: () => m })
      var o = n(50959),
        l = n(97754),
        r = n.n(l),
        i = n(38528),
        s = n(67029),
        a = n(78274),
        c = n(4523),
        u = n(9745),
        d = n(2948),
        p = n(61442)
      function b(e) {
        const { isDropped: t } = e
        return o.createElement(u.Icon, {
          className: r()(p.icon, t && p.dropped),
          icon: d,
        })
      }
      function f(e) {
        const { className: t, disabled: n, isDropped: l } = e
        return o.createElement(
          'span',
          { className: r()(p.button, n && p.disabled, t) },
          o.createElement(b, { isDropped: l }),
        )
      }
      var h = n(99505)
      const m = o.forwardRef((e, t) => {
        const {
            listboxId: n,
            className: l,
            listboxClassName: u,
            listboxTabIndex: d,
            hideArrowButton: p,
            matchButtonAndListboxWidths: b,
            popupPosition: m,
            disabled: v,
            isOpened: g,
            scrollWrapReference: C,
            repositionOnScroll: x,
            closeOnHeaderOverlap: S,
            listboxReference: y,
            size: E = 'small',
            onClose: w,
            onOpen: I,
            onListboxFocus: k,
            onListboxBlur: O,
            onListboxKeyDown: N,
            buttonChildren: R,
            children: F,
            caretClassName: D,
            buttonContainerClassName: A,
            listboxAria: _,
            ...T
          } = e,
          M = (0, o.useRef)(null),
          P =
            !p &&
            o.createElement(
              a.EndSlot,
              null,
              o.createElement(f, { isDropped: g, disabled: v, className: D }),
            )
        return o.createElement(c.PopupMenuDisclosureView, {
          buttonRef: M,
          listboxId: n,
          listboxClassName: u,
          listboxTabIndex: d,
          isOpened: g,
          onClose: w,
          onOpen: I,
          listboxReference: y,
          scrollWrapReference: C,
          onListboxFocus: k,
          onListboxBlur: O,
          onListboxKeyDown: N,
          listboxAria: _,
          matchButtonAndListboxWidths: b,
          popupPosition: m,
          button: o.createElement(s.ControlSkeleton, {
            ...T,
            'data-role': 'listbox',
            disabled: v,
            className: r()(h.button, l),
            size: E,
            ref: (0, i.useMergedRefs)([M, t]),
            middleSlot: o.createElement(
              a.MiddleSlot,
              null,
              o.createElement(
                'span',
                { className: r()(h['button-children'], p && h.hiddenArrow, A) },
                R,
              ),
            ),
            endSlot: P,
          }),
          popupChildren: F,
          repositionOnScroll: x,
          closeOnHeaderOverlap: S,
        })
      })
      m.displayName = 'ControlDisclosureView'
    },
    4523: (e, t, n) => {
      n.d(t, { PopupMenuDisclosureView: () => u })
      var o = n(50959),
        l = n(20520),
        r = n(50151)
      const i = { x: 0, y: 0 }
      function s(e, t, n) {
        return (0, o.useCallback)(
          () =>
            ((e, t, { x: n = i.x, y: o = i.y } = i) => {
              const l = (0, r.ensureNotNull)(e).getBoundingClientRect(),
                s = {
                  x: l.left + n,
                  y: l.top + l.height + o,
                  indentFromWindow: { top: 4, bottom: 4, left: 4, right: 4 },
                }
              return t && (s.overrideWidth = l.width), s
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
            buttonRef: r,
            listboxId: i,
            listboxClassName: a,
            listboxTabIndex: u,
            matchButtonAndListboxWidths: d,
            isOpened: p,
            scrollWrapReference: b,
            listboxReference: f,
            onClose: h,
            onOpen: m,
            onListboxFocus: v,
            onListboxBlur: g,
            onListboxKeyDown: C,
            listboxAria: x,
            repositionOnScroll: S = !0,
            closeOnHeaderOverlap: y = !1,
            popupPositionCorrection: E = { x: 0, y: 0 },
            popupPosition: w,
          } = e,
          I = s(r, d, E),
          k = y ? c : 0
        return o.createElement(
          o.Fragment,
          null,
          t,
          o.createElement(
            l.PopupMenu,
            {
              ...x,
              id: i,
              className: a,
              tabIndex: u,
              isOpened: p,
              position: w || I,
              repositionOnScroll: S,
              onClose: h,
              onOpen: m,
              doNotCloseOn: r.current,
              reference: f,
              scrollWrapReference: b,
              onFocus: v,
              onBlur: g,
              onKeyDown: C,
              closeOnScrollOutsideOffset: k,
            },
            n,
          ),
        )
      }
    },
    90405: (e, t, n) => {
      n.d(t, { Select: () => x })
      var o = n(50959),
        l = n(43010),
        r = n(22064),
        i = n(38528),
        s = n(16921),
        a = n(16396),
        c = n(90484),
        u = n(20057)
      var d = n(36762),
        p = n(26597),
        b = n(59054),
        f = n(36104),
        h = n(63273),
        m = n(65630)
      function v(e) {
        return !e.readonly
      }
      function g(e, t) {
        return t?.id ?? (0, r.createDomId)(e, 'item', t?.value)
      }
      function C(e) {
        const { selectedItem: t, placeholder: n } = e
        if (!t) return o.createElement('span', { className: m.placeholder }, n)
        const l = t.selectedContent ?? t.content ?? t.value
        return o.createElement('span', null, l)
      }
      const x = o.forwardRef((e, t) => {
        const {
          id: n,
          menuClassName: m,
          menuItemClassName: x,
          tabIndex: S,
          disabled: y,
          highlight: E,
          intent: w,
          hideArrowButton: I,
          placeholder: k,
          addPlaceholderToItems: O = !1,
          value: N,
          'aria-labelledby': R,
          onFocus: F,
          onBlur: D,
          onClick: A,
          onChange: _,
          onKeyDown: T,
          repositionOnScroll: M = !0,
          openMenuOnEnter: P = !0,
          'aria-describedby': B,
          'aria-invalid': z,
          ...K
        } = e
        let { items: L } = e
        if (k && O) {
          L = [
            {
              value: void 0,
              content: k,
              id: (0, r.createDomId)(n, 'placeholder'),
            },
            ...L,
          ]
        }
        const {
            listboxId: H,
            isOpened: W,
            isFocused: V,
            buttonTabIndex: j,
            listboxTabIndex: Y,
            highlight: X,
            intent: $,
            open: q,
            onOpen: G,
            close: J,
            toggle: U,
            buttonFocusBindings: Z,
            onButtonClick: Q,
            buttonRef: ee,
            listboxRef: te,
            buttonAria: ne,
          } = (0, f.useControlDisclosure)({
            id: n,
            disabled: y,
            buttonTabIndex: S,
            intent: w,
            highlight: E,
            onFocus: F,
            onBlur: D,
            onClick: A,
          }),
          oe = L.filter(v),
          le = oe.find((e) => e.value === N),
          [re, ie] = o.useState(k && O ? oe[0].value : le?.value),
          [se, ae, ce] = (0, s.useKeepActiveItemIntoView)({ activeItem: le })
        ;(0, l.useIsomorphicLayoutEffect)(() => ie(le?.value), [N])
        const ue = (0, r.joinDomIds)(R, n),
          de = ue.length > 0 ? ue : void 0,
          pe = (0, o.useMemo)(
            () => ({
              role: 'listbox',
              'aria-labelledby': R,
              'aria-activedescendant': g(n, le),
            }),
            [R, le],
          ),
          be = (0, o.useCallback)((e) => e.value === re, [re]),
          fe = (0, o.useCallback)(() => (J(), _ && _(re)), [J, _, re]),
          he = (0, d.useItemsKeyboardNavigation)(
            'vertical',
            h.isRtl,
            oe,
            be,
            (e) => {
              ie(e.value)
            },
            !1,
            { next: [40], previous: [38] },
          ),
          me = (0, p.useKeyboardToggle)(U, W || P),
          ve = (0, p.useKeyboardToggle)(fe),
          ge = (0, p.useKeyboardClose)(W, we),
          Ce = (0, p.useKeyboardOpen)(W, q),
          xe = (0, p.useKeyboardEventHandler)([me, ge, Ce]),
          Se = (0, p.useKeyboardEventHandler)([he, ve, ge]),
          ye = ((e) => {
            const t = (0, o.useRef)(''),
              n = (0, o.useMemo)(
                () =>
                  (0, c.default)(() => {
                    t.current = ''
                  }, 500),
                [],
              ),
              l = (0, o.useMemo)(() => (0, u.default)(e, 200), [e])
            return (0, o.useCallback)(
              (e) => {
                e.key.length > 0 &&
                  e.key.length < 3 &&
                  ((t.current += e.key), l(t.current, e), n())
              },
              [n, l],
            )
          })((t, n) => {
            const o = ((e, t, n) =>
              e.find((e) => {
                const o = t.toLowerCase()
                return (
                  !e.readonly &&
                  (n
                    ? n(e).toLowerCase().startsWith(o)
                    : !e.readonly &&
                      (('string' == typeof e.content &&
                        e.content.toLowerCase().startsWith(o)) ||
                        ('string' == typeof e.textContent &&
                          e.textContent.toLowerCase().startsWith(o)) ||
                        String(e.value ?? '')
                          .toLowerCase()
                          .startsWith(o)))
                )
              }))(oe, t, e.getSearchKey)
            void 0 !== o && _ && (n.stopPropagation(), W || q(), _(o.value))
          })
        return o.createElement(
          b.ControlDisclosureView,
          {
            ...K,
            ...ne,
            ...Z,
            id: n,
            role: 'button',
            tabIndex: j,
            'aria-owns': ne['aria-controls'],
            'aria-haspopup': 'listbox',
            'aria-labelledby': de,
            disabled: y,
            hideArrowButton: I,
            isFocused: V,
            isOpened: W,
            highlight: X,
            intent: $,
            ref: (0, i.useMergedRefs)([ee, t]),
            onClick: Q,
            onOpen: () => {
              ce(le, { duration: 0 }), G()
            },
            onClose: we,
            onKeyDown: (e) => {
              xe(e), T && T(e)
              e.defaultPrevented || ye(e)
            },
            listboxId: H,
            listboxTabIndex: Y,
            listboxClassName: m,
            listboxAria: pe,
            'aria-describedby': B,
            'aria-invalid': z,
            listboxReference: te,
            scrollWrapReference: se,
            onListboxKeyDown: (e) => {
              Se(e), e.defaultPrevented || ye(e)
            },
            buttonChildren: o.createElement(C, {
              selectedItem: le ?? null,
              placeholder: k,
            }),
            repositionOnScroll: M,
          },
          L.map((e, t) => {
            if (e.readonly)
              return o.createElement(
                o.Fragment,
                { key: `readonly_item_${t}` },
                e.content,
              )
            const l = g(n, e)
            return o.createElement(a.PopupMenuItem, {
              key: l,
              id: l,
              className: x,
              role: 'option',
              'aria-selected': N === e.value,
              isActive: re === e.value,
              label: e.content ?? e.value,
              onClick: Ee,
              onClickArg: e.value,
              isDisabled: e.disabled,
              reference: (t) => ae(e, t),
            })
          }),
        )
        function Ee(e) {
          _ && (_(e), ie(e))
        }
        function we() {
          ie(le?.value), J()
        }
      })
      x.displayName = 'Select'
    },
    82576: (e) => {
      e.exports = {
        scrollable: 'scrollable-P78dPRF5',
        content: 'content-P78dPRF5',
        row: 'row-P78dPRF5',
        title: 'title-P78dPRF5',
        control: 'control-P78dPRF5',
        inputWrap: 'inputWrap-P78dPRF5',
        intervalsDesktopDialog: 'intervalsDesktopDialog-P78dPRF5',
      }
    },
    42014: (e, t, n) => {
      n.d(t, { INTERVALS: () => l })
      var o = n(11542)
      const l = [
        { name: '', label: o.t(null, { context: 'interval' }, n(79930)) },
        { name: 'H', label: o.t(null, { context: 'interval' }, n(35157)) },
        { name: 'D', label: o.t(null, { context: 'interval' }, n(23970)) },
        { name: 'W', label: o.t(null, { context: 'interval' }, n(7938)) },
        { name: 'M', label: o.t(null, { context: 'interval' }, n(18193)) },
      ]
    },
    17891: (e, t, n) => {
      n.r(t), n.d(t, { ToolWidgetIntervalsAddDialog: () => v })
      var o = n(50959),
        l = n(32563),
        r = n(11542),
        i = n(50182),
        s = n(90405),
        a = n(86623),
        c = n(59064),
        u = n(86656),
        d = n(42014),
        p = n(10074),
        b = n(82576)
      const f = d.INTERVALS.map((e) => ({ value: e.name, content: e.label }))
      var h
      !((e) => {
        ;(e.Invalid = 'invalid'), (e.AlreadyExists = 'already_exists')
      })(h || (h = {}))
      const m = {
        invalid: r.t(null, void 0, n(23323)),
        already_exists: r.t(null, void 0, n(17889)),
      }
      function v(e) {
        const {
            onAdd: t,
            onClose: h,
            onUnmount: v,
            intervalService: g,
            isSmallTablet: C,
          } = e,
          [x, S] = (0, o.useState)(d.INTERVALS[0].name),
          [y, E] = (0, o.useState)(''),
          [w, I] = (0, o.useState)(null),
          k = (0, o.useRef)(null)
        ;(0, o.useEffect)(
          () => (
            l.touch || k.current?.focus(),
            () => {
              v && v()
            }
          ),
          [],
        )
        const O = (0, o.useCallback)(() => !0, [])
        return o.createElement(i.AdaptiveConfirmDialog, {
          dataName: 'add-custom-interval-dialog',
          title: r.t(null, void 0, n(80335)),
          className: C ? void 0 : b.intervalsDesktopDialog,
          isOpened: !0,
          onSubmit: () => {
            if (!D(x, y)) return
            t(y, x), h()
          },
          onCancel: h,
          onClickOutside: h,
          onClose: h,
          render: () =>
            o.createElement(
              u.TouchScrollContainer,
              { className: b.scrollable, onScroll: R },
              o.createElement(
                'div',
                { className: b.content },
                o.createElement(
                  'div',
                  { className: b.row },
                  o.createElement(
                    'div',
                    { className: b.title },
                    r.t(null, void 0, n(98413)),
                  ),
                  o.createElement(s.Select, {
                    id: 'metric-items',
                    className: b.control,
                    value: x,
                    items: f,
                    onChange: F,
                  }),
                ),
                o.createElement(
                  'div',
                  { className: b.row },
                  o.createElement(
                    'div',
                    { className: b.title },
                    r.t(null, void 0, n(17854)),
                  ),
                  o.createElement(
                    'div',
                    { className: b.inputWrap },
                    o.createElement(a.FormInput, {
                      className: b.control,
                      inputMode: 'numeric',
                      maxLength: 6,
                      reference: k,
                      value: y,
                      onChange: N,
                      hasErrors: null !== w,
                      errors: null === w ? void 0 : [m[w]],
                      iconHidden: !0,
                    }),
                  ),
                ),
              ),
            ),
          defaultActionOnClose: 'none',
          submitButtonText: r.t(null, void 0, n(42790)),
          submitOnEnterKey: !0,
          forceCloseOnEsc: O,
          submitButtonDisabled: !Number(y) || null !== w,
          backdrop: !0,
        })
        function N(e) {
          const { value: t } = e.currentTarget
          ;/^[0-9]*$/.test(t) && (E(t), D(x, t))
        }
        function R() {
          c.globalCloseDelegate.fire()
        }
        function F(e) {
          S(e), D(e, y)
        }
        function D(e, t) {
          if (!Number(t)) return I(null), !0
          if (!g.isValidInterval(t, e)) return I('invalid'), !1
          const n = (0, p.normalizeIntervalString)(`${t}${e}`),
            o = g.getCustomIntervals()
          return g.getDefaultIntervals().includes(n) || o.includes(n)
            ? (I('already_exists'), !1)
            : (I(null), !0)
        }
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
