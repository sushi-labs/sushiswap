;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2077],
  {
    81026: (e) => {
      e.exports = {
        container: 'container-WDZ0PRNh',
        'container-xxsmall': 'container-xxsmall-WDZ0PRNh',
        'container-xsmall': 'container-xsmall-WDZ0PRNh',
        'container-small': 'container-small-WDZ0PRNh',
        'container-medium': 'container-medium-WDZ0PRNh',
        'container-large': 'container-large-WDZ0PRNh',
        'intent-default': 'intent-default-WDZ0PRNh',
        focused: 'focused-WDZ0PRNh',
        readonly: 'readonly-WDZ0PRNh',
        disabled: 'disabled-WDZ0PRNh',
        'with-highlight': 'with-highlight-WDZ0PRNh',
        grouped: 'grouped-WDZ0PRNh',
        'adjust-position': 'adjust-position-WDZ0PRNh',
        'first-row': 'first-row-WDZ0PRNh',
        'first-col': 'first-col-WDZ0PRNh',
        stretch: 'stretch-WDZ0PRNh',
        'font-size-medium': 'font-size-medium-WDZ0PRNh',
        'font-size-large': 'font-size-large-WDZ0PRNh',
        'no-corner-top-left': 'no-corner-top-left-WDZ0PRNh',
        'no-corner-top-right': 'no-corner-top-right-WDZ0PRNh',
        'no-corner-bottom-right': 'no-corner-bottom-right-WDZ0PRNh',
        'no-corner-bottom-left': 'no-corner-bottom-left-WDZ0PRNh',
        'size-xxsmall': 'size-xxsmall-WDZ0PRNh',
        'size-xsmall': 'size-xsmall-WDZ0PRNh',
        'size-small': 'size-small-WDZ0PRNh',
        'size-medium': 'size-medium-WDZ0PRNh',
        'size-large': 'size-large-WDZ0PRNh',
        'intent-success': 'intent-success-WDZ0PRNh',
        'intent-warning': 'intent-warning-WDZ0PRNh',
        'intent-danger': 'intent-danger-WDZ0PRNh',
        'intent-primary': 'intent-primary-WDZ0PRNh',
        'border-none': 'border-none-WDZ0PRNh',
        'border-thin': 'border-thin-WDZ0PRNh',
        'border-thick': 'border-thick-WDZ0PRNh',
        highlight: 'highlight-WDZ0PRNh',
        shown: 'shown-WDZ0PRNh',
      }
    },
    7236: (e) => {
      e.exports = {
        'inner-slot': 'inner-slot-W53jtLjw',
        interactive: 'interactive-W53jtLjw',
        icon: 'icon-W53jtLjw',
        'inner-middle-slot': 'inner-middle-slot-W53jtLjw',
        'before-slot': 'before-slot-W53jtLjw',
        'after-slot': 'after-slot-W53jtLjw',
      }
    },
    30930: (e) => {
      e.exports = {
        input: 'input-RUSovanF',
        'size-xxsmall': 'size-xxsmall-RUSovanF',
        'size-xsmall': 'size-xsmall-RUSovanF',
        'size-small': 'size-small-RUSovanF',
        'size-medium': 'size-medium-RUSovanF',
        'size-large': 'size-large-RUSovanF',
        'with-start-slot': 'with-start-slot-RUSovanF',
        'with-end-slot': 'with-end-slot-RUSovanF',
      }
    },
    86332: (e, t, n) => {
      n.d(t, { ControlGroupContext: () => r })
      const r = n(50959).createContext({
        isGrouped: !1,
        cellState: { isTop: !0, isRight: !0, isBottom: !0, isLeft: !0 },
      })
    },
    95604: (e, t, n) => {
      function r(e) {
        let t = 0
        return (
          (e.isTop && e.isLeft) || (t += 1),
          (e.isTop && e.isRight) || (t += 2),
          (e.isBottom && e.isLeft) || (t += 8),
          (e.isBottom && e.isRight) || (t += 4),
          t
        )
      }
      n.d(t, { getGroupCellRemoveRoundBorders: () => r })
    },
    67029: (e, t, n) => {
      n.d(t, { ControlSkeleton: () => D, InputClasses: () => f })
      var r = n(50959),
        i = n(97754),
        o = n(50151),
        a = n(38528),
        s = n(90186),
        l = n(86332),
        u = n(95604)
      var c = n(81026),
        d = n.n(c)
      function h(e) {
        let t = ''
        return (
          0 !== e &&
            (1 & e && (t = i(t, d()['no-corner-top-left'])),
            2 & e && (t = i(t, d()['no-corner-top-right'])),
            4 & e && (t = i(t, d()['no-corner-bottom-right'])),
            8 & e && (t = i(t, d()['no-corner-bottom-left']))),
          t
        )
      }
      function m(e, t, n, r) {
        const {
            removeRoundBorder: o,
            className: a,
            intent: s = 'default',
            borderStyle: l = 'thin',
            size: c,
            highlight: m,
            disabled: p,
            readonly: f,
            stretch: g,
            noReadonlyStyles: v,
            isFocused: D,
          } = e,
          y = h(null != o ? o : (0, u.getGroupCellRemoveRoundBorders)(n))
        return i(
          d().container,
          d()[`container-${c}`],
          d()[`intent-${s}`],
          d()[`border-${l}`],
          c && d()[`size-${c}`],
          y,
          m && d()['with-highlight'],
          p && d().disabled,
          f && !v && d().readonly,
          D && d().focused,
          g && d().stretch,
          t && d().grouped,
          !r && d()['adjust-position'],
          n.isTop && d()['first-row'],
          n.isLeft && d()['first-col'],
          a,
        )
      }
      function p(e, t, n) {
        const { highlight: r, highlightRemoveRoundBorder: o } = e
        if (!r) return d().highlight
        const a = h(null != o ? o : (0, u.getGroupCellRemoveRoundBorders)(t))
        return i(d().highlight, d().shown, d()[`size-${n}`], a)
      }
      const f = {
          FontSizeMedium: (0, o.ensureDefined)(d()['font-size-medium']),
          FontSizeLarge: (0, o.ensureDefined)(d()['font-size-large']),
        },
        g = { passive: !1 }
      function v(e, t) {
        const {
            style: n,
            id: i,
            role: o,
            onFocus: u,
            onBlur: c,
            onMouseOver: d,
            onMouseOut: h,
            onMouseDown: f,
            onMouseUp: v,
            onKeyDown: D,
            onClick: y,
            tabIndex: b,
            startSlot: H,
            middleSlot: w,
            endSlot: k,
            onWheel: M,
            onWheelNoPassive: S = null,
            size: W,
          } = e,
          {
            isGrouped: C,
            cellState: N,
            disablePositionAdjustment: x = !1,
          } = (0, r.useContext)(l.ControlGroupContext),
          R = ((e, t = null, n) => {
            const i = (0, r.useRef)(null),
              o = (0, r.useRef)(null),
              a = (0, r.useCallback)(() => {
                if (null === i.current || null === o.current) return
                const [e, t, n] = o.current
                null !== t && i.current.addEventListener(e, t, n)
              }, []),
              s = (0, r.useCallback)(() => {
                if (null === i.current || null === o.current) return
                const [e, t, n] = o.current
                null !== t && i.current.removeEventListener(e, t, n)
              }, []),
              l = (0, r.useCallback)((e) => {
                s(), (i.current = e), a()
              }, [])
            return (
              (0, r.useEffect)(
                () => ((o.current = [e, t, n]), a(), s),
                [e, t, n],
              ),
              l
            )
          })('wheel', S, g)
        return r.createElement(
          'span',
          {
            style: n,
            id: i,
            role: o,
            className: m(e, C, N, x),
            tabIndex: b,
            ref: (0, a.useMergedRefs)([t, R]),
            onFocus: u,
            onBlur: c,
            onMouseOver: d,
            onMouseOut: h,
            onMouseDown: f,
            onMouseUp: v,
            onKeyDown: D,
            onClick: y,
            onWheel: M,
            ...(0, s.filterDataProps)(e),
            ...(0, s.filterAriaProps)(e),
          },
          H,
          w,
          k,
          r.createElement('span', { className: p(e, N, W) }),
        )
      }
      v.displayName = 'ControlSkeleton'
      const D = r.forwardRef(v)
    },
    78274: (e, t, n) => {
      n.d(t, {
        AfterSlot: () => c,
        EndSlot: () => u,
        MiddleSlot: () => l,
        StartSlot: () => s,
      })
      var r = n(50959),
        i = n(97754),
        o = n(7236),
        a = n.n(o)
      function s(e) {
        const {
          className: t,
          interactive: n = !0,
          icon: o = !1,
          children: s,
        } = e
        return r.createElement(
          'span',
          {
            className: i(
              a()['inner-slot'],
              n && a().interactive,
              o && a().icon,
              t,
            ),
          },
          s,
        )
      }
      function l(e) {
        const { className: t, children: n } = e
        return r.createElement(
          'span',
          { className: i(a()['inner-slot'], a()['inner-middle-slot'], t) },
          n,
        )
      }
      function u(e) {
        const {
          className: t,
          interactive: n = !0,
          icon: o = !1,
          children: s,
        } = e
        return r.createElement(
          'span',
          {
            className: i(
              a()['inner-slot'],
              n && a().interactive,
              o && a().icon,
              t,
            ),
          },
          s,
        )
      }
      function c(e) {
        const { className: t, children: n } = e
        return r.createElement(
          'span',
          { className: i(a()['after-slot'], t) },
          n,
        )
      }
    },
    31261: (e, t, n) => {
      n.d(t, { InputControl: () => D })
      var r = n(50959),
        i = n(97754),
        o = n(90186),
        a = n(47201),
        s = n(48907),
        l = n(38528),
        u = n(48027),
        c = n(29202),
        d = n(45812),
        h = n(67029),
        m = n(78274),
        p = n(30930),
        f = n.n(p)
      function g(e) {
        return !(0, o.isAriaAttribute)(e) && !(0, o.isDataAttribute)(e)
      }
      function v(e) {
        const {
            id: t,
            title: n,
            role: a,
            tabIndex: s,
            placeholder: l,
            name: u,
            type: c,
            value: d,
            defaultValue: p,
            draggable: v,
            autoComplete: D,
            autoFocus: y,
            maxLength: b,
            min: H,
            max: w,
            step: k,
            pattern: M,
            inputMode: S,
            onSelect: W,
            onFocus: C,
            onBlur: N,
            onKeyDown: x,
            onKeyUp: R,
            onKeyPress: E,
            onChange: _,
            onDragStart: z,
            size: P = 'small',
            className: O,
            inputClassName: I,
            disabled: L,
            readonly: T,
            containerTabIndex: j,
            startSlot: F,
            endSlot: Z,
            reference: U,
            containerReference: B,
            onContainerFocus: A,
            ...G
          } = e,
          V = (0, o.filterProps)(G, g),
          K = {
            ...(0, o.filterAriaProps)(G),
            ...(0, o.filterDataProps)(G),
            id: t,
            title: n,
            role: a,
            tabIndex: s,
            placeholder: l,
            name: u,
            type: c,
            value: d,
            defaultValue: p,
            draggable: v,
            autoComplete: D,
            autoFocus: y,
            maxLength: b,
            min: H,
            max: w,
            step: k,
            pattern: M,
            inputMode: S,
            onSelect: W,
            onFocus: C,
            onBlur: N,
            onKeyDown: x,
            onKeyUp: R,
            onKeyPress: E,
            onChange: _,
            onDragStart: z,
          }
        return r.createElement(h.ControlSkeleton, {
          ...V,
          disabled: L,
          readonly: T,
          tabIndex: j,
          className: i(f().container, O),
          size: P,
          ref: B,
          onFocus: A,
          startSlot: F,
          middleSlot: r.createElement(
            m.MiddleSlot,
            null,
            r.createElement('input', {
              ...K,
              className: i(
                f().input,
                f()[`size-${P}`],
                I,
                F && f()['with-start-slot'],
                Z && f()['with-end-slot'],
              ),
              disabled: L,
              readOnly: T,
              ref: U,
            }),
          ),
          endSlot: Z,
        })
      }
      function D(e) {
        e = (0, u.useControl)(e)
        const {
            disabled: t,
            autoSelectOnFocus: n,
            tabIndex: i = 0,
            onFocus: o,
            onBlur: h,
            reference: m,
            containerReference: p = null,
          } = e,
          f = (0, r.useRef)(null),
          g = (0, r.useRef)(null),
          [D, y] = (0, c.useFocus)(),
          b = t ? void 0 : D ? -1 : i,
          H = t ? void 0 : D ? i : -1,
          {
            isMouseDown: w,
            handleMouseDown: k,
            handleMouseUp: M,
          } = (0, d.useIsMouseDown)(),
          S = (0, a.createSafeMulticastEventHandler)(
            y.onFocus,
            (e) => {
              n && !w.current && (0, s.selectAllContent)(e.currentTarget)
            },
            o,
          ),
          W = (0, a.createSafeMulticastEventHandler)(y.onBlur, h),
          C = (0, r.useCallback)(
            (e) => {
              ;(f.current = e),
                m &&
                  ('function' == typeof m && m(e),
                  'object' == typeof m && (m.current = e))
            },
            [f, m],
          )
        return r.createElement(v, {
          ...e,
          isFocused: D,
          containerTabIndex: b,
          tabIndex: H,
          onContainerFocus: (e) => {
            g.current === e.target && null !== f.current && f.current.focus()
          },
          onFocus: S,
          onBlur: W,
          reference: C,
          containerReference: (0, l.useMergedRefs)([g, p]),
          onMouseDown: k,
          onMouseUp: M,
        })
      }
    },
    48027: (e, t, n) => {
      n.d(t, { useControl: () => o })
      var r = n(47201),
        i = n(29202)
      function o(e) {
        const {
            onFocus: t,
            onBlur: n,
            intent: o,
            highlight: a,
            disabled: s,
          } = e,
          [l, u] = (0, i.useFocus)(void 0, s),
          c = (0, r.createSafeMulticastEventHandler)(s ? void 0 : u.onFocus, t),
          d = (0, r.createSafeMulticastEventHandler)(s ? void 0 : u.onBlur, n)
        return {
          ...e,
          intent: o || (l ? 'primary' : 'default'),
          highlight: null != a ? a : l,
          onFocus: c,
          onBlur: d,
        }
      }
    },
    29202: (e, t, n) => {
      n.d(t, { useFocus: () => i })
      var r = n(50959)
      function i(e, t) {
        const [n, i] = (0, r.useState)(!1)
        ;(0, r.useEffect)(() => {
          t && n && i(!1)
        }, [t, n])
        const o = {
          onFocus: (0, r.useCallback)(
            (t) => {
              ;(void 0 !== e && e.current !== t.target) || i(!0)
            },
            [e],
          ),
          onBlur: (0, r.useCallback)(
            (t) => {
              ;(void 0 !== e && e.current !== t.target) || i(!1)
            },
            [e],
          ),
        }
        return [n, o]
      }
    },
    45812: (e, t, n) => {
      n.d(t, { useIsMouseDown: () => i })
      var r = n(50959)
      function i() {
        const e = (0, r.useRef)(!1),
          t = (0, r.useCallback)(() => {
            e.current = !0
          }, [e]),
          n = (0, r.useCallback)(() => {
            e.current = !1
          }, [e])
        return { isMouseDown: e, handleMouseDown: t, handleMouseUp: n }
      }
    },
    38528: (e, t, n) => {
      n.d(t, {
        useMergedRefs: () => o,
      })
      var r = n(50959),
        i = n(53017)
      function o(e) {
        return (0, r.useCallback)((0, i.mergeRefs)(e), e)
      }
    },
    27267: (e, t, n) => {
      function r(e, t, n, r, i) {
        function o(i) {
          if (e > i.timeStamp) return
          const o = i.target
          void 0 !== n &&
            null !== t &&
            null !== o &&
            o.ownerDocument === r &&
            (t.contains(o) || n(i))
        }
        return (
          i.click && r.addEventListener('click', o, !1),
          i.mouseDown && r.addEventListener('mousedown', o, !1),
          i.touchEnd && r.addEventListener('touchend', o, !1),
          i.touchStart && r.addEventListener('touchstart', o, !1),
          () => {
            r.removeEventListener('click', o, !1),
              r.removeEventListener('mousedown', o, !1),
              r.removeEventListener('touchend', o, !1),
              r.removeEventListener('touchstart', o, !1)
          }
        )
      }
      n.d(t, { addOutsideEventListener: () => r })
    },
    36383: (e, t, n) => {
      n.d(t, { useOutsideEvent: () => o })
      var r = n(50959),
        i = n(27267)
      function o(e) {
        const {
            click: t,
            mouseDown: n,
            touchEnd: o,
            touchStart: a,
            handler: s,
            reference: l,
            ownerDocument: u = document,
          } = e,
          c = (0, r.useRef)(null),
          d = (0, r.useRef)(new CustomEvent('timestamp').timeStamp)
        return (
          (0, r.useLayoutEffect)(() => {
            const e = { click: t, mouseDown: n, touchEnd: o, touchStart: a },
              r = l ? l.current : c.current
            return (0, i.addOutsideEventListener)(d.current, r, s, u, e)
          }, [t, n, o, a, s]),
          l || c
        )
      }
    },
    9745: (e, t, n) => {
      n.d(t, { Icon: () => i })
      var r = n(50959)
      const i = r.forwardRef((e, t) => {
        const { icon: n = '', ...i } = e
        return r.createElement('span', {
          ...i,
          ref: t,
          dangerouslySetInnerHTML: { __html: n },
        })
      })
    },
    99663: (e, t, n) => {
      n.d(t, { Slot: () => i, SlotContext: () => o })
      var r = n(50959)
      class i extends r.Component {
        shouldComponentUpdate() {
          return !1
        }
        render() {
          return r.createElement('div', {
            style: { position: 'fixed', zIndex: 150, left: 0, top: 0 },
            ref: this.props.reference,
          })
        }
      }
      const o = r.createContext(null)
    },
    90186: (e, t, n) => {
      function r(e) {
        return o(e, a)
      }
      function i(e) {
        return o(e, s)
      }
      function o(e, t) {
        const n = Object.entries(e).filter(t),
          r = {}
        for (const [e, t] of n) r[e] = t
        return r
      }
      function a(e) {
        const [t, n] = e
        return 0 === t.indexOf('data-') && 'string' == typeof n
      }
      function s(e) {
        return 0 === e[0].indexOf('aria-')
      }
      n.d(t, {
        filterAriaProps: () => i,
        filterDataProps: () => r,
        filterProps: () => o,
        isAriaAttribute: () => s,
        isDataAttribute: () => a,
      })
    },
    48907: (e, t, n) => {
      function r(e) {
        null !== e && e.setSelectionRange(0, e.value.length)
      }
      n.d(t, { selectAllContent: () => r })
    },
    67961: (e, t, n) => {
      n.d(t, { OverlapManager: () => o, getRootOverlapManager: () => s })
      var r = n(50151)
      class i {
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
      class o {
        constructor(e = document) {
          ;(this._storage = new i()),
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
          const r = this._document.createElement('div')
          if (
            ((r.style.position = t.position),
            (r.style.zIndex = this._index.toString()),
            (r.dataset.id = e),
            void 0 !== t.index)
          ) {
            const e = this._container.childNodes.length
            if (t.index >= e) this._container.appendChild(r)
            else if (t.index <= 0)
              this._container.insertBefore(r, this._container.firstChild)
            else {
              const e = this._container.childNodes[t.index]
              this._container.insertBefore(r, e)
            }
          } else
            'reverse' === t.direction
              ? this._container.insertBefore(r, this._container.firstChild)
              : this._container.appendChild(r)
          return this._windows.set(e, r), ++this._index, r
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
        if (null !== t) return (0, r.ensureDefined)(a.get(t))
        {
          const t = new o(e),
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
    47201: (e, t, n) => {
      function r(...e) {
        return (t) => {
          for (const n of e) void 0 !== n && n(t)
        }
      }
      n.d(t, { createSafeMulticastEventHandler: () => r })
    },
    99054: (e, t, n) => {
      n.d(t, { setFixedBodyState: () => u })
      const r = (() => {
        let e
        return () => {
          var t
          if (void 0 === e) {
            const n = document.createElement('div'),
              r = n.style
            ;(r.visibility = 'hidden'),
              (r.width = '100px'),
              (r.msOverflowStyle = 'scrollbar'),
              document.body.appendChild(n)
            const i = n.offsetWidth
            n.style.overflow = 'scroll'
            const o = document.createElement('div')
            ;(o.style.width = '100%'), n.appendChild(o)
            const a = o.offsetWidth
            null === (t = n.parentNode) || void 0 === t || t.removeChild(n),
              (e = i - a)
          }
          return e
        }
      })()
      function i(e, t, n) {
        null !== e && e.style.setProperty(t, n)
      }
      function o(e, t) {
        return getComputedStyle(e, null).getPropertyValue(t)
      }
      function a(e, t) {
        return Number.parseInt(o(e, t))
      }
      let s = 0,
        l = !1
      function u(e) {
        const { body: t } = document,
          n = t.querySelector('.widgetbar-wrap')
        if (e && 1 == ++s) {
          const e = o(t, 'overflow'),
            s = a(t, 'padding-right')
          'hidden' !== e.toLowerCase() &&
            t.scrollHeight > t.offsetHeight &&
            (i(n, 'right', `${r()}px`),
            (t.style.paddingRight = `${s + r()}px`),
            (l = !0)),
            t.classList.add('i-no-scroll')
        } else if (
          !e &&
          s > 0 &&
          0 == --s &&
          (t.classList.remove('i-no-scroll'), l)
        ) {
          i(n, 'right', '0px')
          let e = 0
          0,
            t.scrollHeight <= t.clientHeight && (e -= r()),
            (t.style.paddingRight = (e < 0 ? 0 : e) + 'px'),
            (l = !1)
        }
      }
    },
    51826: (e, t, n) => {
      n.d(t, { DialogsOpenerManager: () => r, dialogsOpenerManager: () => i })
      class r {
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
      const i = new r()
    },
    42842: (e, t, n) => {
      n.d(t, { Portal: () => l, PortalContext: () => u })
      var r = n(50959),
        i = n(962),
        o = n(25931),
        a = n(67961),
        s = n(99663)
      class l extends r.PureComponent {
        constructor() {
          super(...arguments), (this._uuid = (0, o.nanoid)())
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
            i.createPortal(
              r.createElement(u.Provider, { value: this }, this.props.children),
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
      const u = r.createContext(null)
    },
    76894: (e) => {
      e.exports = {
        dialog: 'dialog-UGdC69sw',
        dialogInner: 'dialogInner-UGdC69sw',
        titleWrapper: 'titleWrapper-UGdC69sw',
        title: 'title-UGdC69sw',
        infoHint: 'infoHint-UGdC69sw',
        form: 'form-UGdC69sw',
        inputWrapper: 'inputWrapper-UGdC69sw',
        input: 'input-UGdC69sw',
        hint: 'hint-UGdC69sw',
        error: 'error-UGdC69sw',
      }
    },
    57163: (e, t, n) => {
      n.r(t), n.d(t, { showChangeIntervalDialog: () => w })
      var r = n(50959),
        i = n(962),
        o = n(97754),
        a = n.n(o),
        s = n(11542),
        l = n(31261),
        u = n(67029),
        c = n(82992),
        d = n(16181),
        h = n(9745),
        m = n(85508)
      const p = s.t(null, void 0, n(52143)),
        f = s.t(null, void 0, n(35668))
      function g(e) {
        const { className: t, isSecondsEnabled: n } = e
        return r.createElement(h.Icon, {
          icon: m,
          className: a()('apply-common-tooltip', t),
          title: n ? f : p,
        })
      }
      var v = n(94025),
        D = n(36274)
      var y = n(76894)
      function b(e) {
        const { initVal: t, selectOnInit: i, onClose: o } = e,
          h = (0, r.useRef)(null),
          [m, p] = (0, r.useState)(t.toUpperCase()),
          f = (0, r.useMemo)(() => (0, v.parseIntervalValue)(m), [m]),
          b = ((e, t) =>
            (0, r.useMemo)(() => {
              if (t.error || !(0, v.intervalIsSupported)(e)) return !1
              const n = D.Interval.normalize(e)
              return null !== n && (0, v.isResolutionMultiplierValid)(n)
            }, [e, t]))(m, f),
          H = (0, r.useMemo)(() => {
            if (!b) return null
            const e = f.qty + (f.unit || '')
            return (0, v.getTranslatedResolutionModel)(e).hint
          }, [b, f])
        return (
          (0, r.useLayoutEffect)(() => {
            var e, t
            i
              ? null === (e = h.current) || void 0 === e || e.select()
              : null === (t = h.current) || void 0 === t || t.focus()
          }, [i]),
          r.createElement(
            d.PopupDialog,
            {
              className: y.dialog,
              'data-dialog-name': 'change-interval-dialog',
              isOpened: !0,
              onClickOutside: o,
              onFocus: () => {
                var e
                null === (e = h.current) || void 0 === e || e.focus()
              },
              onKeyDown: (e) => {
                27 === e.keyCode && (null == o || o())
              },
            },
            r.createElement(
              'div',
              { className: y.dialogInner },
              r.createElement(
                'div',
                { className: y.titleWrapper },
                r.createElement(
                  'div',
                  { className: y.title },
                  s.t(null, void 0, n(99374)),
                ),
                r.createElement(g, {
                  className: y.infoHint,
                  isSecondsEnabled: (0, v.isSecondsEnabled)(),
                }),
              ),
              r.createElement(
                'form',
                {
                  className: y.form,
                  onSubmit: (e) => {
                    e.preventDefault()
                    const t = c.linking.interval.value(),
                      n = D.Interval.normalize(m)
                    n &&
                      t !== n &&
                      b &&
                      ((r = n),
                      (0, v.setLastUsedResolution)(r),
                      c.linking.interval.setValue(r))
                    var r
                    null == o || o()
                  },
                },
                r.createElement(l.InputControl, {
                  className: a()(y.inputWrapper, u.InputClasses.FontSizeLarge),
                  inputClassName: y.input,
                  type: 'text',
                  size: 'large',
                  reference: h,
                  value: m,
                  maxLength: 8,
                  intent: b ? void 0 : 'danger',
                  onChange: (e) => {
                    const { value: t } = e.target
                    p(t.toUpperCase())
                  },
                }),
              ),
              b
                ? r.createElement('div', { className: y.hint }, H)
                : r.createElement(
                    'div',
                    { className: a()(y.hint, y.error) },
                    s.t(null, void 0, n(72572)),
                  ),
            ),
          )
        )
      }
      var H = n(51826)
      function w(e) {
        if (
          H.dialogsOpenerManager.isOpened('ChangeIntervalDialog') ||
          H.dialogsOpenerManager.isOpened('SymbolSearch')
        )
          return
        const t = document.createElement('div'),
          { initVal: n, selectOnInit: o, onClose: a } = e,
          s = r.createElement(b, {
            initVal: n,
            selectOnInit: o,
            onClose: () => {
              i.unmountComponentAtNode(t),
                H.dialogsOpenerManager.setAsClosed('ChangeIntervalDialog'),
                null == a || a()
            },
          })
        i.render(s, t),
          H.dialogsOpenerManager.setAsOpened('ChangeIntervalDialog')
      }
    },
    85508: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M8 8.5h1.5V14"/><circle fill="currentColor" cx="9" cy="5" r="1"/><path stroke="currentColor" d="M16.5 9a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0z"/></svg>'
    },
    25931: (e, t, n) => {
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
    72572: (e) => {
      e.exports = {
        ar: ['لا يمكن تطبيقه'],
        ca_ES: ['No aplicable'],
        cs: ['Nelze použít'],
        de: ['Nicht anwendbar'],
        el: ['Μη εφαρμόσιμο'],
        en: 'Not applicable',
        es: ['No aplicable'],
        fa: ['غیر قابل قبول'],
        fr: ['Non applicable'],
        he_IL: ['בלתי קביל'],
        hu_HU: ['Nem alkalmazható'],
        id_ID: ['Tidak dapat diterapkan'],
        it: ['Non applicabile'],
        ja: ['適用できません'],
        ko: ['쓸 수 없음'],
        ms_MY: ['Tidak berkenaan'],
        nl_NL: ['Niet van toepassingen'],
        pl: ['Nie dotyczy'],
        pt: ['Não aplicável'],
        ro: 'Not applicable',
        ru: ['Не поддерживается'],
        sv: ['Ej applicerbar'],
        th: ['ไม่สามารถใช้ได้'],
        tr: ['Uygun Değil'],
        vi: ['Không áp dụng được'],
        zh: ['不适用'],
        zh_TW: ['不適用'],
      }
    },
    52143: (e) => {
      e.exports = {
        ar: [
          'اكتب رقم الفاصل الزمني للرسم البياني لدقيقة (مثلا أكتب رقم 5 إذا كان الرسم البياني لخمس دقائق). أو أكتب رقم وإضافة حرف بعد ك حرف الـ H (للساعة)، و حرف الـ D (لليوم)، و حرف الـW (للأسبوع)، و حرف الـ M (للشهر) مثلاً (D أو 2H).',
        ],
        ca_ES: [
          "Escriviu el número d'interval per a gràfics de minuts (és a dir, 5 si serà un gràfic de cinc minuts). O número més lletra per a H (per hora), D (diari), S (setmanal), M (mensual) intervals (es a dir, D o 2H).",
        ],
        cs: 'Type the interval number for minute charts (i.e. 5 if it is going to be a five minute chart). Or number plus letter for H (Hourly), D (Daily), W (Weekly), M (Monthly) intervals (i.e. D or 2H)',
        de: [
          'Geben Sie die Intervall-Nummer für Minuten-Charts ein (z.B. 5, wenn es sich um einen Fünf-Minuten-Chart handelt). Oder Zahl plus Buchstabe für H (stündlich), D (täglich), W (wöchentlich), M (monatlich) Intervalle (d.h. D oder 2H)',
        ],
        el: 'Type the interval number for minute charts (i.e. 5 if it is going to be a five minute chart). Or number plus letter for H (Hourly), D (Daily), W (Weekly), M (Monthly) intervals (i.e. D or 2H)',
        en: 'Type the interval number for minute charts (i.e. 5 if it is going to be a five minute chart). Or number plus letter for H (Hourly), D (Daily), W (Weekly), M (Monthly) intervals (i.e. D or 2H)',
        es: [
          'Escriba el número de intervalo para gráficos de minutos (es decir, 5 si va a ser un gráfico de cinco minutos). O número más letra para H (por hora), D (diario), S (semanal), M (mensual) intervalos (es decir, D o 2H)',
        ],
        fa: 'Type the interval number for minute charts (i.e. 5 if it is going to be a five minute chart). Or number plus letter for H (Hourly), D (Daily), W (Weekly), M (Monthly) intervals (i.e. D or 2H)',
        fr: [
          "Tapez le numéro d'intervalle pour les diagrammes de minutes (c'est-à-dire 5 si le graphique doit être de cinq minutes). Ou un nombre plus une lettre pour les intervalles H (horaires), D (journaliers), W (hebdomadaires), M (mensuels) (c'est-à-dire D ou 2H)",
        ],
        he_IL: [
          'הקלד את מספר האינטרוול  לגרף דקה (כלומר, 5 במידה וזה גרף חמש דקות). או מספר פלוס אות H (לשעה), D (יום), W (שבוע) M (חודש) אינטרוולים. (כלומר D ליום או 2H ל2שעות)',
        ],
        hu_HU:
          'Type the interval number for minute charts (i.e. 5 if it is going to be a five minute chart). Or number plus letter for H (Hourly), D (Daily), W (Weekly), M (Monthly) intervals (i.e. D or 2H)',
        id_ID: [
          'Ketik angka interval untuk chart menit (cth: 5 untuk chart lima menit). Atau tanda plus untuk interval H (Jam), D (Harian), W (Mingguan), M (Bulanan) (cth: D atau 2H).',
        ],
        it: [
          "Scrivi il numero di minuti del timeframe desiderato (ad esempio, scrivi 5 se vuoi il grafico a 5 minuti). Altrimenti aggiungi la lettera per gli altri timeframe: 'H' per l'orario, 'D' per il giornaliero, 'W' per il settimanale, 'M' per il mensile (ad esempio, puoi scrivere 'D' o '2H')",
        ],
        ja: [
          '分足チャートの分数を入力します（5分足チャートの場合であれば5）。他の時間足の場合には、時間の数値に続けて文字（H (時間)、D (日)、W (週)、M (月)）を入力して下さい（例．D や 2H）。',
        ],
        ko: [
          '분 차트에 대한 인터벌 숫자를 타이핑하십시오 (보기: 5분 차트는 5). 또는 숫자와 함께 H (시간), D(날), W(주), M(달) 인터벌값을 넣으십시오 (보기: D 또는 2H)',
        ],
        ms_MY: [
          'Masukkan angka selang masa untuk carta minit (contohnya seperti 5 jika anda perlukan carta 5 minit). Atau nombor dengan abjad untuk J (Jam), H (Harian), M (Mingguan), B (Bulanan) (contoh H atau 2j)',
        ],
        nl_NL:
          'Type the interval number for minute charts (i.e. 5 if it is going to be a five minute chart). Or number plus letter for H (Hourly), D (Daily), W (Weekly), M (Monthly) intervals (i.e. D or 2H)',
        pl: [
          'Wprowadź wybraną wartość liczbową interwału dla wykresów minutowych (np. wartość 5 dla wykresu o interwale 5 minutowym) bądź wartość liczbową i/lub jedną z liter: H (interwał godzinny), D (dzienny), W (tygodniowy), M (miesięczny), czyli np. D, 2H, itd.',
        ],
        pt: [
          'Digite o número de intervalo para gráficos de minutos (ou seja, cinco para um gráfico de cinco minutos). Ou número mais a letra para os intervalos H (Por hora), D (Diário), S (Semanal), M (Mensal) (ou seja, D ou 2H)',
        ],
        ro: 'Type the interval number for minute charts (i.e. 5 if it is going to be a five minute chart). Or number plus letter for H (Hourly), D (Daily), W (Weekly), M (Monthly) intervals (i.e. D or 2H)',
        ru: [
          'Введите нужное число для минутных графиков (например, 5 если нужен 5-минутный график), или число и букву для соответствующих интервалов: H (часы), D (дни), W (недели), M (месяцы), например, D или 2H',
        ],
        sv: [
          'Skriv intervallnumret för minutdiagram (dvs 5 om det ska vara ett femminuters diagram). Eller nummer plus bokstav för H (Timmars), D (Dag), W (Vecko), M (Månads) intervaller (dvs D eller 2H)',
        ],
        th: [
          'พิมพ์ช่วงเวลาในหน่วยของชาร์ตนาที (ตัวอย่างเช่น พิมพ์ 5 ก็จะแสดงชาร์ตราย 5 นาที) หรือ ตัวเลขตามด้วยอักษร H สำหรับช่วงเวลา (รายชั่วโมง) D (รายวัน) W (รายสัปดาห์) M (รายเดือน) (เช่น D หรือ 2H)',
        ],
        tr: [
          'Dakika grafikleri için aralık sayısını girin (örn beş dakikalık grafik için 5). Veya sayı artı; saat için H harfi (saatlik), D (günlük), W(haftalık), M (aylık) aralıklarını kullanın(örn D veya 2H gibi)',
        ],
        vi: [
          'Nhập số khoảng thời gian cho biểu đồ phút (ví dụ 5 nếu đó sẽ là biểu đồ năm phút). Hoặc số cộng cho chữ H (Hàng giờ), D (Hàng ngày), W (Hàng tuần), M (Hàng tháng) (ví dụ D hoặc 2H)',
        ],
        zh: [
          '在分钟图表上输入时间周期数值（即5代表5分钟的图表）。或H（小时）、D（日）、W（周）、M（月）时间周期（即D或2H）的数字加字母。',
        ],
        zh_TW: [
          '鍵入分鐘圖表的間隔時間 (如果是五分鐘圖表，則為5)。或數字加字母 H (小時)、D (日)、W (週)、M (月) 的間隔時間 (即D或2H)',
        ],
      }
    },
    35668: (e) => {
      e.exports = {
        ar: [
          'اكتب رقم الإطار الزمني للرسوم البيانية بالدقائق (مثلاً: 5 إذا كان إطار الرسم البياني هو 5 دقائق). أو رقم مع حروف للأطر الزمنية الأخرى: حرف "ث" للرسم البياني بإطار 1 ثانية (15 "ث" للرسم البياني 15 ثانية، إلخ)، و"س" (ساعة)، و"ي" (يوم)، و"أ" (أسبوعي)، و"ش" (شهر) (مثلاً: "ي" أو "2س")',
        ],
        ca_ES: [
          "Introduïu el número de l'interval per als gràfics de minuts (per exemple, 5 si és un gràfic de cinc minuts). També podeu introduir un número més una lletra per aconseguir diferents intervals: S per a un gràfic d'un segon (15S correspon a un gràfic de 15 segons); H (hores), W (setmanes) o M (mesos). A continuació teniu un exemple: 1D o 2H.",
        ],
        cs: "Type the interval number for minute charts (i.e. 5 if it's going to be a five minute chart). Or number plus letter for other intervals: S for 1 second chart (15S for 15 second chart, etc.), H (Hourly), D (Daily), W (Weekly), M (Monthly) intervals (i.e. D or 2H)",
        de: [
          'Geben Sie die Intervallnummer für Minuten-Charts ein (d.h. 5, wenn es sich um ein Fünf-Minuten-Chart handeln soll). Oder Nummer und Buchstabe für andere Intervalle: S für 1-Sekunden-Chart (15S für 15-Sekunden-Chart, etc.), H (stündliche), D (tägliche), W (wöchentliche), M (monatliche) Intervalle (z.B. D oder 2H)',
        ],
        el: "Type the interval number for minute charts (i.e. 5 if it's going to be a five minute chart). Or number plus letter for other intervals: S for 1 second chart (15S for 15 second chart, etc.), H (Hourly), D (Daily), W (Weekly), M (Monthly) intervals (i.e. D or 2H)",
        en: "Type the interval number for minute charts (i.e. 5 if it's going to be a five minute chart). Or number plus letter for other intervals: S for 1 second chart (15S for 15 second chart, etc.), H (Hourly), D (Daily), W (Weekly), M (Monthly) intervals (i.e. D or 2H)",
        es: [
          'Introduzca el número del intervalo para los gráficos de minutos (por ejemplo, 5 si va a ser un gráfico de cinco minutos). También puede introducir un número, más una letra, para conseguir diferentes intervalos: S para un gráfico de 1 segundo (15S corresponde a un gráfico de 15 segundos); H (horas), W (semanas) o M (meses). A continuación se muestra un ejemplo: 1D o 2H.',
        ],
        fa: "Type the interval number for minute charts (i.e. 5 if it's going to be a five minute chart). Or number plus letter for other intervals: S for 1 second chart (15S for 15 second chart, etc.), H (Hourly), D (Daily), W (Weekly), M (Monthly) intervals (i.e. D or 2H)",
        fr: [
          "Tapez le numéro d'intervalle pour les graphiques en minutes (c'est-à-dire 5 s'il s'agit d'un graphique de cinq minutes). Ou un chiffre plus une lettre pour les autres intervalles: S pour 1 seconde (15S pour 15 secondes, etc.), H (horaire), D (quotidien), W (hebdomadaire), M (mensuel) (c.-à-d. D ou 2H)",
        ],
        he_IL: [
          "הקלד את מספר האינטרוול עבור גרפי דקות (כלומר 5 אם זה יהיה גרף של חמש דקות). או מספר אותיות במרווחי זמן אחרים: S בגרף שניה (15S לגרף 15 שניות וכו'), H (שעה), D (יומי), W (שבועי), M (חודשי) באינטרוולים (כלומר D או 2H)",
        ],
        hu_HU:
          "Type the interval number for minute charts (i.e. 5 if it's going to be a five minute chart). Or number plus letter for other intervals: S for 1 second chart (15S for 15 second chart, etc.), H (Hourly), D (Daily), W (Weekly), M (Monthly) intervals (i.e. D or 2H)",
        id_ID: [
          'Ketik angka interval untuk chart menit (cth: 5 untuk chart lima menit). Atau angka dengan huruf untuk interval lainnya: S untuk chart 1 detik (15S untuk chart 15 detik, dsb), H (Jam), D (Harian), W (Mingguan), M (Bulanan) (cth: D atau 2H).',
        ],
        it: [
          "Scrivi il numero di minuti del timeframe desiderato (ad esempio, scrivi 5 se vuoi il grafico a 5 minuti). Altrimenti aggiungi la lettera per gli altri timeframe: 'S' per i secondi, 'H' per l'orario, 'D' per il giornaliero, 'W' per il settimanale, 'M' per il mensile (ad esempio, puoi scrivere '15S', '1D' o '2H')",
        ],
        ja: [
          '分足チャートの分数を入力します（例．5分足チャートの場合であれば5）。他の時間足の場合には、時間の数値に続けて時間足を表す文字を入力して下さい: 秒足チャート (15Sは15秒チャート), H (時間), D (日), W (週), M (月)、（例．D や 2H）。',
        ],
        ko: [
          '분 차트에 대한 인터벌 숫자를 타이핑하십시오 (보기: 5분 차트는 5). 또는 숫자와 함께 S (1초, 15초는 15S 등),  H (시간), D(날), W(주), M(달) 인터벌값을 넣으십시오 (보기: D 또는 2H)',
        ],
        ms_MY: [
          'Taipkan nombor selang masa untuk carta minit (i.e. 5 jika ia merupakan carta lima minit). Atau kombinasi nombor dengan huruf bagi selang lain: selang masa s untuk carta 1 saat (15s untuk carta 15 saat, dll.), j (Jam), H (Harian), M (Mingguan), B (Bulanan) (contohnya H atau 2j)',
        ],
        nl_NL:
          "Type the interval number for minute charts (i.e. 5 if it's going to be a five minute chart). Or number plus letter for other intervals: S for 1 second chart (15S for 15 second chart, etc.), H (Hourly), D (Daily), W (Weekly), M (Monthly) intervals (i.e. D or 2H)",
        pl: [
          'Wpisz numer interwału dla wykresów minutowych (np. 5, jeśli ma to być wykres pięciominutowy). Lub numer plus litera dla innych interwałów: S dla wykresu jednosekundowego (15S dla wykresu 15-sekundowego itd.) H (Godzinowy), D (dzienny), W (tygodniowy), M (miesięczny) (np. D lub 2H)',
        ],
        pt: [
          'Digite o número do tempo gráfico de minutos (ou seja, 5 se for um gráfico de cinco minutos). Ou número mais letra para outros intervalos: S para 1 segundo (15S para 15 segundos, etc.), H (Para Hora), D (Diário), W (Semanal), M (Mensal) intervalos (ou seja, D ou 2H)',
        ],
        ro: "Type the interval number for minute charts (i.e. 5 if it's going to be a five minute chart). Or number plus letter for other intervals: S for 1 second chart (15S for 15 second chart, etc.), H (Hourly), D (Daily), W (Weekly), M (Monthly) intervals (i.e. D or 2H)",
        ru: [
          'Введите нужное число для минутных графиков (например, 5, если нужен 5-минутный график). Или число и букву для других интервалов: S для 1-секундного графика (15S для 15-секундного и т. д.), H (часы), D (дни), W (недели), M (месяцы). Например, D или 2H',
        ],
        sv: [
          'Ange intervallnumret för minutdiagram (t.ex. 5 om det är ett femminutersdiagram). Eller så anger du nummer och bokstav för andra intervall: S för 1-sekundsdiagram (15S för 15-sekundersdiagram osv.), H (varje timme), D (varje dag), W (varje vecka), M (varje månad) intervaller (t.ex. D eller 2H)',
        ],
        th: [
          'พิมพ์ตัวเลขช่วงเวลาสำหรับชาร์ตรายนาที (ตัวอย่าง 5 ถ้าต้องการชาร์ตรายห้านาที) หรือตัวเลขบวกตัวอักษรสำหรับช่วงเวลาอื่นๆ: S สำหรับชาร์ตราย 1 วินาที (15S สำหรับชาร์ตราย 15 วินาที เป็นต้น) H (รายชั่วโมง) D (รายวัน) W (รายสัปดาห์) M (รายเดือน) (ตัวอย่าง D หรือ 2H)',
        ],
        tr: [
          'Dakika grafiği için aralık numarasını yazın (yani, beş dakikalık bir grafik olacaksa 5). Veya diğer aralıklar için sayı ve sayının yanında harf: 1 saniye grafik için s (15 saniye grafik için 15s, vb.), S (Saatlik), G (Günlük), H (Haftalık), A (Aylık) aralıkları (yani G veya 2S)',
        ],
        vi: [
          'Nhập số khoảng cho các biểu đồ phút (tức là 5 nếu nó sẽ là biểu đồ năm phút). Hoặc số cộng chữ cái cho các khoảng thời gian khác: S cho biểu đồ 1 giây (15S cho biểu đồ 15 giây, v.v.), H (Hàng giờ), D (Hàng ngày), W (Hàng tuần), M (Hàng tháng) (tức là D hoặc 2H)',
        ],
        zh: [
          '在分钟图表上输入时间周期数值（即5代表5分钟的图表）。或H（小时）、D（日）、W（周）、M（月）时间周期（即D或2H）的数字加字母。',
        ],
        zh_TW: [
          '鍵入分鐘圖表的間隔時間(如果是五分鐘圖表，則輸入5)。或其他間隔的數字加字母：S為1秒圖表(15S為15秒圖表等)、H(小時)、D(日)、W(週)、M(月)間隔時間(即D或2H)',
        ],
      }
    },
  },
])
