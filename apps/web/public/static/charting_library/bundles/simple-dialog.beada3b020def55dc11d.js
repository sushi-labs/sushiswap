;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [8890],
  {
    259142: (e, t) => {
      var n, o, r
      ;(o = [t]),
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
            var o = {
              get passive() {
                n = !0
              },
            }
            window.addEventListener('testPassive', null, o),
              window.removeEventListener('testPassive', null, o)
          }
          var r =
              'undefined' != typeof window &&
              window.navigator &&
              window.navigator.platform &&
              /iP(ad|hone|od)/.test(window.navigator.platform),
            i = [],
            a = !1,
            s = -1,
            l = void 0,
            c = void 0,
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
                void 0 !== c &&
                  ((document.body.style.paddingRight = c), (c = void 0)),
                  void 0 !== l &&
                    ((document.body.style.overflow = l), (l = void 0))
              })
            }
          ;(e.disableBodyScroll = (e, o) => {
            if (r) {
              if (!e)
                return void console.error(
                  'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
                )
              if (e && !i.some((t) => t.targetElement === e)) {
                var m = { targetElement: e, options: o || {} }
                ;(i = [].concat(t(i), [m])),
                  (e.ontouchstart = (e) => {
                    1 === e.targetTouches.length &&
                      (s = e.targetTouches[0].clientY)
                  }),
                  (e.ontouchmove = (t) => {
                    var n, o, r, i
                    1 === t.targetTouches.length &&
                      ((o = e),
                      (i = (n = t).targetTouches[0].clientY - s),
                      !u(n.target) &&
                        ((o && 0 === o.scrollTop && 0 < i) ||
                        ((r = o) &&
                          r.scrollHeight - r.scrollTop <= r.clientHeight &&
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
              ;(h = o),
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
                  void 0 === l &&
                    ((l = document.body.style.overflow),
                    (document.body.style.overflow = 'hidden'))
                })
              var p = { targetElement: e, options: o || {} }
              i = [].concat(t(i), [p])
            }
            var h
          }),
            (e.clearAllBodyScrollLocks = () => {
              r
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
                  (s = -1))
                : (m(), (i = []))
            }),
            (e.enableBodyScroll = (e) => {
              if (r) {
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
        void 0 === (r = 'function' == typeof n ? n.apply(t, o) : n) ||
          (e.exports = r)
    },
    101414: (e) => {
      e.exports = {
        button: 'button-D4RPB3ZC',
        content: 'content-D4RPB3ZC',
        'icon-only': 'icon-only-D4RPB3ZC',
        link: 'link-D4RPB3ZC',
        'color-brand': 'color-brand-D4RPB3ZC',
        'variant-primary': 'variant-primary-D4RPB3ZC',
        'variant-secondary': 'variant-secondary-D4RPB3ZC',
        'color-gray': 'color-gray-D4RPB3ZC',
        'color-green': 'color-green-D4RPB3ZC',
        'color-red': 'color-red-D4RPB3ZC',
        'color-black': 'color-black-D4RPB3ZC',
        'color-black-friday': 'color-black-friday-D4RPB3ZC',
        'color-cyber-monday': 'color-cyber-monday-D4RPB3ZC',
        'size-xsmall': 'size-xsmall-D4RPB3ZC',
        'start-icon-wrap': 'start-icon-wrap-D4RPB3ZC',
        'end-icon-wrap': 'end-icon-wrap-D4RPB3ZC',
        'with-start-icon': 'with-start-icon-D4RPB3ZC',
        'with-end-icon': 'with-end-icon-D4RPB3ZC',
        'size-small': 'size-small-D4RPB3ZC',
        'size-medium': 'size-medium-D4RPB3ZC',
        'size-large': 'size-large-D4RPB3ZC',
        'size-xlarge': 'size-xlarge-D4RPB3ZC',
        animated: 'animated-D4RPB3ZC',
        stretch: 'stretch-D4RPB3ZC',
        grouped: 'grouped-D4RPB3ZC',
        'adjust-position': 'adjust-position-D4RPB3ZC',
        'first-row': 'first-row-D4RPB3ZC',
        'first-col': 'first-col-D4RPB3ZC',
        'no-corner-top-left': 'no-corner-top-left-D4RPB3ZC',
        'no-corner-top-right': 'no-corner-top-right-D4RPB3ZC',
        'no-corner-bottom-right': 'no-corner-bottom-right-D4RPB3ZC',
        'no-corner-bottom-left': 'no-corner-bottom-left-D4RPB3ZC',
        'text-wrap': 'text-wrap-D4RPB3ZC',
        'multiline-content': 'multiline-content-D4RPB3ZC',
        'secondary-text': 'secondary-text-D4RPB3ZC',
        'primary-text': 'primary-text-D4RPB3ZC',
      }
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
    488803: (e) => {
      e.exports = {
        'tablet-normal-breakpoint': 'screen and (max-width: 768px)',
        'small-height-breakpoint': 'screen and (max-height: 360px)',
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
      }
    },
    30507: (e) => {
      e.exports = {
        actionButton: 'actionButton-k53vexPa',
        small: 'small-k53vexPa',
        hiddenTitle: 'hiddenTitle-k53vexPa',
      }
    },
    955021: (e) => {
      e.exports = { label: 'label-nb7ji1l2' }
    },
    854936: (e) => {
      e.exports = {
        popupDialog: 'popupDialog-B02UUUN3',
        wrap: 'wrap-B02UUUN3',
        main: 'main-B02UUUN3',
        small: 'small-B02UUUN3',
        title: 'title-B02UUUN3',
        content: 'content-B02UUUN3',
        html: 'html-B02UUUN3',
        footer: 'footer-B02UUUN3',
        close: 'close-B02UUUN3',
        marginWithoutCloseButton: 'marginWithoutCloseButton-B02UUUN3',
      }
    },
    934587: (e) => {
      e.exports = { icon: 'icon-WB2y0EnP', dropped: 'dropped-WB2y0EnP' }
    },
    171529: (e, t, n) => {
      n.d(t, { SquareButton: () => g })
      var o = n(50959),
        r = n(497754),
        i = n(331774),
        a = n(72571),
        s = n(101414),
        l = n.n(s)
      const c =
        'apply-overflow-tooltip apply-overflow-tooltip--check-children-recursively apply-overflow-tooltip--allow-text'
      function u(e) {
        const {
            color: t = 'brand',
            size: n = 'medium',
            variant: o = 'primary',
            stretch: a = !1,
            icon: s,
            startIcon: u,
            endIcon: d,
            iconOnly: m = !1,
            className: p,
            isGrouped: h,
            cellState: f,
            disablePositionAdjustment: g = !1,
            primaryText: v,
            secondaryText: y,
            isAnchor: C = !1,
          } = e,
          w = ((e) => {
            let t = ''
            return (
              0 !== e &&
                (1 & e && (t = r(t, l()['no-corner-top-left'])),
                2 & e && (t = r(t, l()['no-corner-top-right'])),
                4 & e && (t = r(t, l()['no-corner-bottom-right'])),
                8 & e && (t = r(t, l()['no-corner-bottom-left']))),
              t
            )
          })((0, i.getGroupCellRemoveRoundBorders)(f))
        return r(
          p,
          l().button,
          l()[`size-${n}`],
          l()[`color-${t}`],
          l()[`variant-${o}`],
          a && l().stretch,
          (s || u) && l()['with-start-icon'],
          d && l()['with-end-icon'],
          m && l()['icon-only'],
          w,
          h && l().grouped,
          h && !g && l()['adjust-position'],
          h && f.isTop && l()['first-row'],
          h && f.isLeft && l()['first-col'],
          v && y && l()['multiline-content'],
          C && l().link,
          c,
        )
      }
      function d(e) {
        const {
            startIcon: t,
            icon: n,
            iconOnly: i,
            children: s,
            endIcon: u,
            primaryText: d,
            secondaryText: m,
          } = e,
          p = null != t ? t : n,
          h = !(t || n || u || i) && !s && d && m
        return o.createElement(
          o.Fragment,
          null,
          p &&
            o.createElement(a.Icon, {
              icon: p,
              className: l()['start-icon-wrap'],
            }),
          s && o.createElement('span', { className: l().content }, s),
          u &&
            !i &&
            o.createElement(a.Icon, {
              icon: u,
              className: l()['end-icon-wrap'],
            }),
          h &&
            ((e) =>
              e.primaryText &&
              e.secondaryText &&
              o.createElement(
                'div',
                { className: r(l()['text-wrap'], c) },
                o.createElement(
                  'span',
                  { className: l()['primary-text'] },
                  ' ',
                  e.primaryText,
                  ' ',
                ),
                'string' == typeof e.secondaryText
                  ? o.createElement(
                      'span',
                      { className: l()['secondary-text'] },
                      ' ',
                      e.secondaryText,
                      ' ',
                    )
                  : o.createElement(
                      'span',
                      { className: l()['secondary-text'] },
                      o.createElement('span', null, e.secondaryText.firstLine),
                      o.createElement('span', null, e.secondaryText.secondLine),
                    ),
              ))(e),
        )
      }
      var m = n(601198),
        p = n(380327),
        h = n(800417)
      function f(e) {
        const {
          className: t,
          color: n,
          variant: o,
          size: r,
          stretch: i,
          animated: a,
          icon: s,
          iconOnly: l,
          startIcon: c,
          endIcon: u,
          primaryText: d,
          secondaryText: m,
          ...p
        } = e
        return {
          ...p,
          ...(0, h.filterDataProps)(e),
          ...(0, h.filterAriaProps)(e),
        }
      }
      function g(e) {
        const { reference: t, tooltipText: n, ...r } = e,
          {
            isGrouped: i,
            cellState: a,
            disablePositionAdjustment: s,
          } = (0, o.useContext)(p.ControlGroupContext),
          l = u({
            ...r,
            isGrouped: i,
            cellState: a,
            disablePositionAdjustment: s,
          })
        return o.createElement(
          'button',
          {
            ...f(r),
            className: l,
            ref: t,
            'data-overflow-tooltip-text':
              null != n
                ? n
                : e.primaryText
                  ? [e.primaryText, e.secondaryText].join(' ')
                  : (0, m.getTextForTooltip)(e.children),
          },
          o.createElement(d, { ...r }),
        )
      }
    },
    380327: (e, t, n) => {
      n.d(t, { ControlGroupContext: () => o })
      const o = n(50959).createContext({
        isGrouped: !1,
        cellState: { isTop: !0, isRight: !0, isBottom: !0, isLeft: !0 },
      })
    },
    331774: (e, t, n) => {
      function o(e) {
        let t = 0
        return (
          (e.isTop && e.isLeft) || (t += 1),
          (e.isTop && e.isRight) || (t += 2),
          (e.isBottom && e.isLeft) || (t += 8),
          (e.isBottom && e.isRight) || (t += 4),
          t
        )
      }
      n.d(t, { getGroupCellRemoveRoundBorders: () => o })
    },
    383836: (e, t, n) => {
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
    252130: (e, t, n) => {
      n.d(t, { useIsMounted: () => r })
      var o = n(50959)
      const r = () => {
        const e = (0, o.useRef)(!1)
        return (
          (0, o.useEffect)(
            () => (
              (e.current = !0),
              () => {
                e.current = !1
              }
            ),
            [],
          ),
          e
        )
      }
    },
    525388: (e, t, n) => {
      n.d(t, { useMergedRefs: () => i })
      var o = n(50959),
        r = n(273388)
      function i(e) {
        return (0, o.useCallback)((0, r.mergeRefs)(e), e)
      }
    },
    778199: (e, t, n) => {
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
    908783: (e, t, n) => {
      n.d(t, { useOutsideEvent: () => i })
      var o = n(50959),
        r = n(778199)
      function i(e) {
        const {
            click: t,
            mouseDown: n,
            touchEnd: i,
            touchStart: a,
            handler: s,
            reference: l,
            ownerDocument: c = document,
          } = e,
          u = (0, o.useRef)(null),
          d = (0, o.useRef)(new CustomEvent('timestamp').timeStamp)
        return (
          (0, o.useLayoutEffect)(() => {
            const e = { click: t, mouseDown: n, touchEnd: i, touchStart: a },
              o = l ? l.current : u.current
            return (0, r.addOutsideEventListener)(d.current, o, s, c, e)
          }, [t, n, i, a, s]),
          l || u
        )
      }
    },
    72571: (e, t, n) => {
      n.d(t, { Icon: () => r })
      var o = n(50959)
      const r = o.forwardRef((e, t) => {
        const { icon: n = '', ...r } = e
        return o.createElement('span', {
          ...r,
          ref: t,
          dangerouslySetInnerHTML: { __html: n },
        })
      })
    },
    234404: (e, t, n) => {
      n.d(t, { Loader: () => s })
      var o = n(50959),
        r = n(497754),
        i = n(625650),
        a = n.n(i)
      function s(e) {
        const {
            className: t,
            size: n = 'medium',
            staticPosition: i,
            color: s = 'black',
          } = e,
          l = r(a().item, a()[s], a()[n])
        return o.createElement(
          'span',
          { className: r(a().loader, i && a().static, t) },
          o.createElement('span', { className: l }),
          o.createElement('span', { className: l }),
          o.createElement('span', { className: l }),
        )
      }
    },
    682925: (e, t, n) => {
      n.d(t, { Slot: () => r, SlotContext: () => i })
      var o = n(50959)
      class r extends o.Component {
        shouldComponentUpdate() {
          return !1
        }
        render() {
          return o.createElement('div', {
            style: { position: 'fixed', zIndex: 150, left: 0, top: 0 },
            ref: this.props.reference,
          })
        }
      }
      const i = o.createContext(null)
    },
    800417: (e, t, n) => {
      function o(e) {
        return i(e, a)
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
      function a(e) {
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
        isDataAttribute: () => a,
      })
    },
    601198: (e, t, n) => {
      n.d(t, { getTextForTooltip: () => a })
      var o = n(50959)
      const r = (e) => (0, o.isValidElement)(e) && Boolean(e.props.children),
        i = (e) =>
          null == e || 'boolean' == typeof e || '{}' === JSON.stringify(e)
            ? ''
            : e.toString() + ' ',
        a = (e) =>
          Array.isArray(e) || (0, o.isValidElement)(e)
            ? o.Children.toArray(e)
                .reduce((e, t) => {
                  let n = ''
                  return (
                    (n =
                      (0, o.isValidElement)(t) && r(t)
                        ? a(t.props.children)
                        : (0, o.isValidElement)(t) && !r(t)
                          ? ''
                          : i(t)),
                    e.concat(n)
                  )
                }, '')
                .trim()
            : i(e)
    },
    273388: (e, t, n) => {
      function o(e) {
        return (t) => {
          e.forEach((e) => {
            'function' == typeof e ? e(t) : null != e && (e.current = t)
          })
        }
      }
      function r(e) {
        return o([e])
      }
      n.d(t, { isomorphicRef: () => r, mergeRefs: () => o })
    },
    801808: (e, t, n) => {
      n.d(t, { OverlapManager: () => i, getRootOverlapManager: () => s })
      var o = n(650151)
      class r {
        constructor() {
          this._storage = []
        }
        add(e) {
          this._storage.push(e)
        }
        remove(e) {
          this._storage = this._storage.filter((t) => e !== t)
        }
        has(e) {
          return this._storage.includes(e)
        }
        getItems() {
          return this._storage
        }
      }
      class i {
        constructor(e = document) {
          ;(this._storage = new r()),
            (this._windows = new Map()),
            (this._index = 0),
            (this._document = e),
            (this._container = e.createDocumentFragment())
        }
        setContainer(e) {
          const t = this._container,
            n = null === e ? this._document.createDocumentFragment() : e
          !((e, t) => {
            Array.from(e.childNodes).forEach((e) => {
              e.nodeType === Node.ELEMENT_NODE && t.appendChild(e)
            })
          })(t, n),
            (this._container = n)
        }
        registerWindow(e) {
          this._storage.has(e) || this._storage.add(e)
        }
        ensureWindow(e, t = { position: 'fixed', direction: 'normal' }) {
          const n = this._windows.get(e)
          if (void 0 !== n) return n
          this.registerWindow(e)
          const o = this._document.createElement('div')
          if (
            ((o.style.position = t.position),
            (o.style.zIndex = this._index.toString()),
            (o.dataset.id = e),
            void 0 !== t.index)
          ) {
            const e = this._container.childNodes.length
            if (t.index >= e) this._container.appendChild(o)
            else if (t.index <= 0)
              this._container.insertBefore(o, this._container.firstChild)
            else {
              const e = this._container.childNodes[t.index]
              this._container.insertBefore(o, e)
            }
          } else
            'reverse' === t.direction
              ? this._container.insertBefore(o, this._container.firstChild)
              : this._container.appendChild(o)
          return this._windows.set(e, o), ++this._index, o
        }
        unregisterWindow(e) {
          this._storage.remove(e)
          const t = this._windows.get(e)
          void 0 !== t &&
            (null !== t.parentElement && t.parentElement.removeChild(t),
            this._windows.delete(e))
        }
        getZindex(e) {
          const t = this.ensureWindow(e)
          return Number.parseInt(t.style.zIndex || '0')
        }
        moveToTop(e) {
          if (this.getZindex(e) !== this._index) {
            this.ensureWindow(e).style.zIndex = (++this._index).toString()
          }
        }
        removeWindow(e) {
          this.unregisterWindow(e)
        }
      }
      const a = new WeakMap()
      function s(e = document) {
        const t = e.getElementById('overlap-manager-root')
        if (null !== t) return (0, o.ensureDefined)(a.get(t))
        {
          const t = new i(e),
            n = ((e) => {
              const t = e.createElement('div')
              return (
                (t.style.position = 'absolute'),
                (t.style.zIndex = (150).toString()),
                (t.style.top = '0px'),
                (t.style.left = '0px'),
                (t.id = 'overlap-manager-root'),
                t
              )
            })(e)
          return a.set(n, t), t.setContainer(n), e.body.appendChild(n), t
        }
      }
    },
    269842: (e, t, n) => {
      function o(...e) {
        return (t) => {
          for (const n of e) void 0 !== n && n(t)
        }
      }
      n.d(t, { createSafeMulticastEventHandler: () => o })
    },
    285089: (e, t, n) => {
      n.d(t, { setFixedBodyState: () => l })
      var o = n(735922)
      const r = () =>
          !window.matchMedia('screen and (min-width: 768px)').matches,
        i = () => !window.matchMedia('screen and (min-width: 1280px)').matches
      let a = 0,
        s = !1
      function l(e) {
        const { body: t } = document,
          n = t.querySelector('.widgetbar-wrap')
        if (e && 1 == ++a) {
          const e = (0, o.getCSSProperty)(t, 'overflow'),
            r = (0, o.getCSSPropertyNumericValue)(t, 'padding-right')
          'hidden' !== e.toLowerCase() &&
            t.scrollHeight > t.offsetHeight &&
            ((0, o.setStyle)(n, 'right', `${(0, o.getScrollbarWidth)()}px`),
            (t.style.paddingRight = `${r + ((0, o.getScrollbarWidth))()}px`),
            (s = !0)),
            t.classList.add('i-no-scroll')
        } else if (
          !e &&
          a > 0 &&
          0 == --a &&
          (t.classList.remove('i-no-scroll'), s)
        ) {
          ;(0, o.setStyle)(n, 'right', '0px')
          let e = 0
          ;(e = n
            ? ((l = (0, o.getContentWidth)(n)),
              r() ? 0 : i() ? 45 : Math.min(Math.max(l, 45), 450))
            : 0),
            t.scrollHeight <= t.clientHeight &&
              (e -= (0, o.getScrollbarWidth)()),
            (t.style.paddingRight = (e < 0 ? 0 : e) + 'px'),
            (s = !1)
        }
        var l
      }
    },
    996038: (e, t, n) => {
      n.d(t, { DialogBreakpoints: () => r })
      var o = n(488803)
      const r = {
        SmallHeight: o['small-height-breakpoint'],
        TabletSmall: o['tablet-small-breakpoint'],
        TabletNormal: o['tablet-normal-breakpoint'],
      }
    },
    531275: (e, t, n) => {
      n.d(t, { SimpleDialogContext: () => o })
      const o = n(50959).createContext({
        isSmallTablet: !1,
        dialogCloseHandler: () => {},
      })
    },
    480994: (e, t, n) => {
      n.r(t),
        n.d(t, {
          confirmModule: () => v,
          renameModule: () => y,
          showSimpleDialog: () => w,
          warningModule: () => C,
        })
      var o = n(50959),
        r = n(609838),
        i = n(859878)
      function a(e) {
        return 'html' in e
          ? { html: e.html }
          : 'text' in e
            ? { content: e.text }
            : { content: e.content }
      }
      var s = n(531275),
        l = n(73007),
        c = n(955021)
      function u(e) {
        const {
            maxLength: t,
            value: n,
            placeholder: r,
            onValueChange: i,
            nameInputRef: a,
            source: u = [],
            autocompleteFilter: d,
          } = e,
          { isSmallTablet: m } = (0, o.useContext)(s.SimpleDialogContext),
          p = o.useRef(null)
        return (
          (0, o.useLayoutEffect)(() => {
            p.current && p.current.select()
          }, []),
          o.createElement(
            o.Fragment,
            null,
            (() => {
              if ('content' in e)
                return o.createElement('div', { className: c.label }, e.content)
              if ('html' in e)
                return o.createElement('div', {
                  className: c.label,
                  dangerouslySetInnerHTML: { __html: e.html },
                })
              return null
            })(),
            o.createElement(l.Autocomplete, {
              maxLength: t,
              value: n,
              onChange: (e) => {
                i(e)
              },
              allowUserDefinedValues: !0,
              preventOnFocusOpen: !0,
              noEmptyText: !0,
              source: u,
              preventSearchOnEmptyQuery: !0,
              filter: d,
              setupHTMLInput: (e) => {
                ;(p.current = e), a && (a.current = e)
              },
              size: m ? 'large' : void 0,
              placeholder: r,
              suggestionsInPortal: !0,
            }),
          )
        )
      }
      function d(e) {
        return Boolean(e.trim())
      }
      function m(e) {
        const { buttonText: t, intentButton: o, actions: i } = e,
          a = [
            {
              name: 'ok',
              title: t || r.t(null, void 0, n(468988)),
              intent: o,
              handler: ({ dialogClose: e }) => {
                e()
              },
            },
          ]
        return i && i.forEach((e) => a.push(e)), a
      }
      var p = n(500962),
        h = n(650151),
        f = n(753327)
      const g = new (n(63192).DialogsOpenerManager)()
      const v = (e) => {
          const {
              title: t,
              onClose: s = () => {},
              mainButtonText: l,
              mainButtonIntent: c,
              cancelButtonText: u,
              closeOnOutsideClick: d,
              onConfirm: m,
              onCancel: p,
            } = e,
            h = a(e)
          return o.createElement(i.SimpleDialog, {
            ...h,
            title: t || r.t(null, void 0, n(994443)),
            onClose: s,
            actions: [
              {
                name: 'yes',
                title: l || r.t(null, void 0, n(879831)),
                intent: c || 'success',
                handler: m,
              },
              {
                name: 'no',
                type: 'button',
                title: u || r.t(null, void 0, n(606255)),
                appearance: 'stroke',
                intent: 'default',
                handler: (e) => {
                  p ? p(e) : e.dialogClose()
                },
              },
            ],
            dataName: 'confirm-dialog',
            closeOnOutsideClick: d,
          })
        },
        y = (e) => {
          const {
              title: t,
              maxLength: s,
              initValue: l,
              placeholder: c,
              onClose: m = () => {},
              mainButtonText: p,
              mainButtonIntent: h,
              cancelButtonText: f,
              validator: g = d,
              onRename: v,
              source: y,
              autocompleteFilter: C,
              onCancel: w,
            } = e,
            x = (0, o.useRef)(null),
            [E, b] = (0, o.useState)(l || ''),
            [_, B] = (0, o.useState)(() => g(E)),
            S = a(e)
          return o.createElement(i.SimpleDialog, {
            title: t || r.t(null, void 0, n(435038)),
            content: o.createElement(u, {
              ...S,
              nameInputRef: x,
              maxLength: s,
              placeholder: c,
              value: E,
              onValueChange: (e) => {
                b(e), B(g(e))
              },
              source: y,
              autocompleteFilter: C,
            }),
            onClose: m,
            actions: [
              {
                disabled: !_,
                name: 'save',
                title: p || r.t(null, void 0, n(185520)),
                intent: h || 'primary',
                handler: ({ dialogClose: e, innerManager: t }) =>
                  v({
                    newValue: E,
                    focusInput: D,
                    dialogClose: e,
                    innerManager: t,
                  }),
              },
              {
                name: 'cancel',
                type: 'button',
                title: f || r.t(null, void 0, n(620036)),
                appearance: 'stroke',
                intent: 'default',
                handler: (e) => {
                  w ? w(e) : e.dialogClose()
                },
              },
            ],
            dataName: 'rename-dialog',
          })
          function D() {
            x.current && x.current.focus()
          }
        },
        C = (e) => {
          const { title: t, closeOnOutsideClick: s, onClose: l = () => {} } = e,
            c = a(e)
          return o.createElement(i.SimpleDialog, {
            ...c,
            title: t || r.t(null, void 0, n(533603)),
            onClose: l,
            actions: m(e),
            dataName: 'warning-dialog',
            closeOnOutsideClick: s,
          })
        },
        w = (e, t, n) => {
          const { title: r } = e
          let i = `${r}_`
          if (
            ((i += 'text' in e ? e.text : 'html' in e ? e.html : e.id),
            g.isOpened(i))
          )
            return (0, h.ensureDefined)(g.getDialogPayload(i)).closeHandler
          const a = document.createElement('div'),
            s = () => {
              var t
              null === (t = e.onClose) || void 0 === t || t.call(e),
                p.unmountComponentAtNode(a),
                g.setAsClosed(i)
            }
          return (
            p.render(
              o.createElement(
                f.SlotContext.Provider,
                { value: n || null },
                o.createElement(t, { ...e, onClose: s }),
              ),
              a,
            ),
            g.setAsOpened(i, { closeHandler: s }),
            s
          )
        }
    },
    859878: (e, t, n) => {
      n.d(t, { SimpleDialog: () => b })
      var o = n(50959),
        r = n(497754),
        i = n(72571),
        a = n(559410),
        s = n(40766),
        l = n(180185),
        c = n(930052),
        u = n(206594),
        d = n(996038),
        m = n(742554),
        p = n(805184),
        h = n(234404),
        f = n(650151),
        g = n(252130),
        v = n(753327),
        y = n(531275),
        C = n(30507)
      function w(e) {
        const {
            disabled: t,
            name: n,
            title: i,
            appearance: a,
            intent: s,
            handler: l,
            reference: c,
            type: u,
          } = e,
          { isSmallTablet: d, dialogCloseHandler: m } = (0, o.useContext)(
            y.SimpleDialogContext,
          ),
          w = (0, f.ensureNotNull)((0, o.useContext)(v.SlotContext)),
          x = (0, g.useIsMounted)(),
          [E, b] = (0, o.useState)(!1)
        return o.createElement(
          p.Button,
          {
            type: u,
            disabled: t,
            reference: c,
            className: r(C.actionButton, d && C.small),
            name: n,
            size: d ? 'l' : void 0,
            appearance: a,
            intent: s,
            onClick: () => {
              if (E) return
              const e = l({ dialogClose: m, innerManager: w })
              e &&
                (b(!0),
                e.then(() => {
                  x.current && b(!1)
                }))
            },
          },
          o.createElement('span', { className: r(E && C.hiddenTitle) }, i),
          E && o.createElement(h.Loader, { color: 'white' }),
        )
      }
      var x = n(507720),
        E = n(854936)
      function b(e) {
        const {
          title: t,
          onClose: n,
          actions: p,
          dataName: h,
          popupDialogClassName: f,
          contentClassName: g,
          wrapperClassName: v,
          backdrop: C,
          closeOnOutsideClick: b = !0,
          showCloseButton: _ = !0,
          closeOnEscapePress: B = !0,
          events: S = !0,
        } = e
        ;(0, o.useEffect)(
          () => (
            a.subscribe(u.CLOSE_POPUPS_AND_DIALOGS_COMMAND, n, null),
            () => {
              a.unsubscribe(u.CLOSE_POPUPS_AND_DIALOGS_COMMAND, n, null)
            }
          ),
          [n],
        )
        const [D, N] = (0, o.useState)(!0),
          P = (0, o.useRef)(null)
        return o.createElement(
          c.MatchMedia,
          { rule: d.DialogBreakpoints.TabletSmall },
          (a) =>
            o.createElement(
              y.SimpleDialogContext.Provider,
              { value: { isSmallTablet: a, dialogCloseHandler: n } },
              o.createElement(
                s.PopupDialog,
                {
                  className: r(E.popupDialog, f),
                  isOpened: D,
                  backdrop: C,
                  onClickBackdrop: S ? k : void 0,
                  onClickOutside: b ? k : void 0,
                  onKeyDown: T,
                  autofocus: !0,
                  fixedBody: !0,
                },
                o.createElement(
                  'div',
                  { className: r(E.wrap, v), 'data-name': h },
                  o.createElement(
                    'div',
                    {
                      className: r(
                        E.main,
                        !_ && E.marginWithoutCloseButton,
                        a && E.small,
                      ),
                    },
                    t &&
                      o.createElement(
                        'div',
                        { className: r(E.title, a && E.small) },
                        t,
                      ),
                    ((t) => {
                      if ('html' in e)
                        return o.createElement(m.TouchScrollContainer, {
                          className: r(E.content, t && E.small, E.html, g),
                          dangerouslySetInnerHTML: { __html: e.html },
                        })
                      if ('content' in e)
                        return o.createElement(
                          m.TouchScrollContainer,
                          {
                            className: r(E.content, t && E.small, g),
                          },
                          e.content,
                        )
                      return null
                    })(a),
                    p &&
                      p.length > 0 &&
                      o.createElement(
                        'div',
                        { className: r(E.footer, a && E.small) },
                        p.map((e, t) =>
                          o.createElement(w, {
                            ...e,
                            key: e.name,
                            reference: 0 === t ? P : void 0,
                          }),
                        ),
                      ),
                  ),
                  _ &&
                    o.createElement(i.Icon, {
                      className: r(E.close, a && E.small),
                      icon: x,
                      onClick: k,
                      'data-name': 'close',
                      'data-role': 'button',
                    }),
                ),
              ),
            ),
        )
        function T(e) {
          switch ((0, l.hashFromEvent)(e)) {
            case 27:
              D && B && (e.preventDefault(), n())
              break
            case 13:
              const t = document.activeElement
              if (
                e.defaultPrevented ||
                (t instanceof HTMLButtonElement && 'submit' !== t.type)
              )
                return
              if (D && p && p.length) {
                e.preventDefault()
                const t = P.current
                t && t.click()
              }
          }
        }
        function k() {
          N(!1), n()
        }
      }
    },
    63192: (e, t, n) => {
      n.d(t, { DialogsOpenerManager: () => o, dialogsOpenerManager: () => r })
      class o {
        constructor() {
          this._storage = new Map()
        }
        setAsOpened(e, t) {
          this._storage.set(e, t)
        }
        setAsClosed(e) {
          this._storage.delete(e)
        }
        isOpened(e) {
          return this._storage.has(e)
        }
        getDialogPayload(e) {
          return this._storage.get(e)
        }
      }
      const r = new o()
    },
    930052: (e, t, n) => {
      n.d(t, { MatchMedia: () => r })
      var o = n(50959)
      class r extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._handleChange = () => {
              this.forceUpdate()
            }),
            (this.state = { query: window.matchMedia(this.props.rule) })
        }
        componentDidMount() {
          this._subscribe(this.state.query)
        }
        componentDidUpdate(e, t) {
          this.state.query !== t.query &&
            (this._unsubscribe(t.query), this._subscribe(this.state.query))
        }
        componentWillUnmount() {
          this._unsubscribe(this.state.query)
        }
        render() {
          return this.props.children(this.state.query.matches)
        }
        static getDerivedStateFromProps(e, t) {
          return e.rule !== t.query.media
            ? { query: window.matchMedia(e.rule) }
            : null
        }
        _subscribe(e) {
          e.addListener(this._handleChange)
        }
        _unsubscribe(e) {
          e.removeListener(this._handleChange)
        }
      }
    },
    813113: (e, t, n) => {
      n.d(t, { Portal: () => l, PortalContext: () => c })
      var o = n(50959),
        r = n(500962),
        i = n(925931),
        a = n(801808),
        s = n(682925)
      class l extends o.PureComponent {
        constructor() {
          super(...arguments), (this._uuid = (0, i.nanoid)())
        }
        componentWillUnmount() {
          this._manager().removeWindow(this._uuid)
        }
        render() {
          const e = this._manager().ensureWindow(
            this._uuid,
            this.props.layerOptions,
          )
          return (
            (e.style.top = this.props.top || ''),
            (e.style.bottom = this.props.bottom || ''),
            (e.style.left = this.props.left || ''),
            (e.style.right = this.props.right || ''),
            (e.style.pointerEvents = this.props.pointerEvents || ''),
            this.props.className && e.classList.add(this.props.className),
            this.props['aria-hidden'] && e.setAttribute('aria-hidden', 'true'),
            r.createPortal(
              o.createElement(c.Provider, { value: this }, this.props.children),
              e,
            )
          )
        }
        moveToTop() {
          this._manager().moveToTop(this._uuid)
        }
        _manager() {
          return null === this.context
            ? (0, a.getRootOverlapManager)()
            : this.context
        }
      }
      l.contextType = s.SlotContext
      const c = o.createContext(null)
    },
    753327: (e, t, n) => {
      n.d(t, { Slot: () => o.Slot, SlotContext: () => o.SlotContext })
      var o = n(682925)
    },
    515783: (e, t, n) => {
      n.d(t, { ToolWidgetCaret: () => l })
      var o = n(50959),
        r = n(497754),
        i = n(72571),
        a = n(934587),
        s = n(100578)
      function l(e) {
        const { dropped: t, className: n } = e
        return o.createElement(i.Icon, {
          className: r(n, a.icon, { [a.dropped]: t }),
          icon: s,
        })
      }
    },
    742554: (e, t, n) => {
      n.d(t, { TouchScrollContainer: () => s })
      var o = n(50959),
        r = n(259142),
        i = n(650151),
        a = n(601227)
      const s = (0, o.forwardRef)((e, t) => {
        const { children: n, ...i } = e,
          s = (0, o.useRef)(null)
        return (
          (0, o.useImperativeHandle)(t, () => s.current),
          (0, o.useLayoutEffect)(() => {
            if (a.CheckMobile.iOS())
              return (
                null !== s.current &&
                  (0, r.disableBodyScroll)(s.current, { allowTouchMove: l(s) }),
                () => {
                  null !== s.current && (0, r.enableBodyScroll)(s.current)
                }
              )
          }, []),
          o.createElement('div', { ref: s, ...i }, n)
        )
      })
      function l(e) {
        return (t) => {
          const n = (0, i.ensureNotNull)(e.current),
            o = document.activeElement
          return (
            !n.contains(t) || (null !== o && n.contains(o) && o.contains(t))
          )
        }
      }
    },
    100578: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8" width="16" height="8"><path fill="currentColor" d="M0 1.475l7.396 6.04.596.485.593-.49L16 1.39 14.807 0 7.393 6.122 8.58 6.12 1.186.08z"/></svg>'
    },
    507720: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" width="17" height="17" fill="currentColor"><path d="m.58 1.42.82-.82 15 15-.82.82z"/><path d="m.58 15.58 15-15 .82.82-15 15z"/></svg>'
    },
    925931: (e, t, n) => {
      n.d(t, { nanoid: () => o })
      const o = (e = 21) =>
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
    994443: (e) => {
      e.exports = {
        ar: ['تأكيد'],
        ca_ES: ['Confirmació'],
        cs: ['Potvrzení'],
        de: ['Bestätigung'],
        el: ['Επιβεβαίωση'],
        en: 'Confirmation',
        es: ['Confirmación'],
        fa: ['تاییدیه'],
        fr: 'Confirmation',
        he_IL: ['אישור'],
        hu_HU: ['Megerősítés'],
        id_ID: ['Konfirmasi'],
        it: ['Conferma'],
        ja: ['確認'],
        ko: ['확인'],
        ms_MY: ['Pengesahan'],
        nl_NL: ['Bevestig'],
        pl: ['Potwierdzenie'],
        pt: ['Confirmação'],
        ro: 'Confirmation',
        ru: ['Подтвердите действие'],
        sv: ['Bekräftelse'],
        th: ['การยืนยัน'],
        tr: ['Onaylama'],
        vi: ['Xác nhận'],
        zh: ['确认'],
        zh_TW: ['確認'],
      }
    },
    620036: (e) => {
      e.exports = {
        ar: ['إلغاء'],
        ca_ES: ['Cancel·la'],
        cs: ['Zrušit'],
        de: ['Abbrechen'],
        el: ['Άκυρο'],
        en: 'Cancel',
        es: ['Cancelar'],
        fa: ['لغو'],
        fr: ['Annuler'],
        he_IL: ['ביטול'],
        hu_HU: ['Törlés'],
        id_ID: ['Batal'],
        it: ['Annulla'],
        ja: ['キャンセル'],
        ko: ['취소'],
        ms_MY: ['Batal'],
        nl_NL: ['Annuleren'],
        pl: ['Anuluj'],
        pt: ['Cancelar'],
        ro: 'Cancel',
        ru: ['Отмена'],
        sv: ['Avbryt'],
        th: ['ยกเลิก'],
        tr: ['İptal'],
        vi: ['Hủy bỏ'],
        zh: ['取消'],
        zh_TW: ['取消'],
      }
    },
    468988: (e) => {
      e.exports = {
        ar: ['موافق'],
        ca_ES: ['Acceptar'],
        cs: 'Ok',
        de: 'Ok',
        el: 'Ok',
        en: 'Ok',
        es: ['Aceptar'],
        fa: 'Ok',
        fr: ["D'accord"],
        he_IL: ['אוקיי'],
        hu_HU: ['Oké'],
        id_ID: 'Ok',
        it: 'Ok',
        ja: ['OK'],
        ko: ['확인'],
        ms_MY: 'Ok',
        nl_NL: 'Ok',
        pl: 'Ok',
        pt: 'Ok',
        ro: 'Ok',
        ru: ['Ок'],
        sv: ['OK'],
        th: ['ตกลง'],
        tr: ['Tamam'],
        vi: 'Ok',
        zh: ['确认'],
        zh_TW: ['確認'],
      }
    },
    606255: (e) => {
      e.exports = {
        ar: ['لا'],
        ca_ES: 'No',
        cs: ['Ne'],
        de: ['Nein'],
        el: 'No',
        en: 'No',
        es: 'No',
        fa: 'No',
        fr: ['Non'],
        he_IL: ['לא'],
        hu_HU: ['Nem'],
        id_ID: ['Tidak'],
        it: 'No',
        ja: ['いいえ'],
        ko: ['아니오'],
        ms_MY: ['Tidak'],
        nl_NL: 'No',
        pl: ['Nie'],
        pt: ['Não'],
        ro: 'No',
        ru: ['Нет'],
        sv: ['Nej'],
        th: ['ไม่'],
        tr: ['Hayır'],
        vi: ['Không'],
        zh: ['否'],
        zh_TW: ['否'],
      }
    },
    435038: (e) => {
      e.exports = {
        ar: ['تغيير الأسم'],
        ca_ES: ['Reanomenar'],
        cs: 'Rename',
        de: ['Umbenennen'],
        el: 'Rename',
        en: 'Rename',
        es: ['Renombrar.'],
        fa: 'Rename',
        fr: ['Renommer'],
        he_IL: ['שנה שם'],
        hu_HU: ['Átnevezés'],
        id_ID: ['Mengganti Nama'],
        it: ['Rinomina'],
        ja: ['名前の変更'],
        ko: ['이름 바꾸기'],
        ms_MY: ['Namakan semula'],
        nl_NL: 'Rename',
        pl: ['Zmień nazwę'],
        pt: ['Renomear'],
        ro: 'Rename',
        ru: ['Переименовать'],
        sv: ['Döp om'],
        th: ['เปลี่ยนชื่อ'],
        tr: ['Yeni Ad Ver'],
        vi: ['Đổi tên'],
        zh: ['重命名'],
        zh_TW: ['重新命名'],
      }
    },
    879831: (e) => {
      e.exports = {
        ar: ['نعم'],
        ca_ES: ['Sí'],
        cs: ['Ano'],
        de: ['Ja'],
        el: 'Yes',
        en: 'Yes',
        es: ['Sí'],
        fa: 'Yes',
        fr: ['Oui'],
        he_IL: ['כן'],
        hu_HU: ['Igen'],
        id_ID: ['Ya'],
        it: ['Sì'],
        ja: ['はい'],
        ko: ['예'],
        ms_MY: ['Ya'],
        nl_NL: 'Yes',
        pl: ['Tak'],
        pt: ['Sim'],
        ro: 'Yes',
        ru: ['Да'],
        sv: ['Ja'],
        th: ['ใช่'],
        tr: ['Evet'],
        vi: ['Có'],
        zh: ['是'],
        zh_TW: ['是'],
      }
    },
  },
])
