;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2077],
  {
    97754: (e, t) => {
      var n
      !(() => {
        var o = {}.hasOwnProperty
        function i() {
          for (var e = [], t = 0; t < arguments.length; t++) {
            var n = arguments[t]
            if (n) {
              var s = typeof n
              if ('string' === s || 'number' === s) e.push(n)
              else if (Array.isArray(n) && n.length) {
                var r = i.apply(null, n)
                r && e.push(r)
              } else if ('object' === s)
                for (var a in n) o.call(n, a) && n[a] && e.push(a)
            }
          }
          return e.join(' ')
        }
        e.exports
          ? ((i.default = i), (e.exports = i))
          : void 0 === (n = (() => i).apply(t, [])) || (e.exports = n)
      })()
    },
    88276: (e) => {
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
    73405: (e) => {
      e.exports = {
        'inner-slot': 'inner-slot-W53jtLjw',
        interactive: 'interactive-W53jtLjw',
        icon: 'icon-W53jtLjw',
        'inner-middle-slot': 'inner-middle-slot-W53jtLjw',
        'before-slot': 'before-slot-W53jtLjw',
        'after-slot': 'after-slot-W53jtLjw',
      }
    },
    25549: (e) => {
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
    84928: (e) => {
      e.exports = {
        dialog: 'dialog-aRAWUDhF',
        rounded: 'rounded-aRAWUDhF',
        shadowed: 'shadowed-aRAWUDhF',
        fullscreen: 'fullscreen-aRAWUDhF',
        darker: 'darker-aRAWUDhF',
        backdrop: 'backdrop-aRAWUDhF',
      }
    },
    13100: (e) => {
      e.exports = {
        'tablet-normal-breakpoint': '(max-width: 768px)',
        'tooltip-offset': '20px',
        dialog: 'dialog-qyCw0PaN',
        dragging: 'dragging-qyCw0PaN',
        mobile: 'mobile-qyCw0PaN',
        fullscreen: 'fullscreen-qyCw0PaN',
        dialogAnimatedAppearance: 'dialogAnimatedAppearance-qyCw0PaN',
        dialogAnimation: 'dialogAnimation-qyCw0PaN',
        dialogTooltip: 'dialogTooltip-qyCw0PaN',
      }
    },
    86332: (e, t, n) => {
      n.d(t, { ControlGroupContext: () => o })
      const o = n(50959).createContext({
        isGrouped: !1,
        cellState: { isTop: !0, isRight: !0, isBottom: !0, isLeft: !0 },
      })
    },
    95604: (e, t, n) => {
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
    67029: (e, t, n) => {
      n.d(t, { ControlSkeleton: () => v, InputClasses: () => m })
      var o = n(50959),
        i = n(97754),
        s = n(50151),
        r = n(38528),
        a = n(90186),
        l = n(86332),
        c = n(95604)
      var u = n(88276),
        d = n.n(u)
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
      function p(e, t, n, o) {
        const {
            removeRoundBorder: s,
            className: r,
            intent: a = 'default',
            borderStyle: l = 'thin',
            size: u,
            highlight: p,
            disabled: g,
            readonly: m,
            stretch: f,
            noReadonlyStyles: _,
            isFocused: v,
          } = e,
          y = h(s ?? (0, c.getGroupCellRemoveRoundBorders)(n))
        return i(
          d().container,
          d()[`container-${u}`],
          d()[`intent-${a}`],
          d()[`border-${l}`],
          u && d()[`size-${u}`],
          y,
          p && d()['with-highlight'],
          g && d().disabled,
          m && !_ && d().readonly,
          v && d().focused,
          f && d().stretch,
          t && d().grouped,
          !o && d()['adjust-position'],
          n.isTop && d()['first-row'],
          n.isLeft && d()['first-col'],
          r,
        )
      }
      function g(e, t, n) {
        const { highlight: o, highlightRemoveRoundBorder: s } = e
        if (!o) return d().highlight
        const r = h(s ?? (0, c.getGroupCellRemoveRoundBorders)(t))
        return i(d().highlight, d().shown, d()[`size-${n}`], r)
      }
      const m = {
          FontSizeMedium: (0, s.ensureDefined)(d()['font-size-medium']),
          FontSizeLarge: (0, s.ensureDefined)(d()['font-size-large']),
        },
        f = { passive: !1 }
      function _(e, t) {
        const {
            style: n,
            id: i,
            role: s,
            onFocus: c,
            onBlur: u,
            onMouseOver: d,
            onMouseOut: h,
            onMouseDown: m,
            onMouseUp: _,
            onKeyDown: v,
            onClick: y,
            tabIndex: D,
            startSlot: w,
            middleSlot: E,
            endSlot: x,
            onWheel: S,
            onWheelNoPassive: C = null,
            size: b,
            tag: R = 'span',
            type: M,
          } = e,
          {
            isGrouped: P,
            cellState: T,
            disablePositionAdjustment: F = !1,
          } = (0, o.useContext)(l.ControlGroupContext),
          N = ((e, t = null, n) => {
            const i = (0, o.useRef)(null),
              s = (0, o.useRef)(null),
              r = (0, o.useCallback)(() => {
                if (null === i.current || null === s.current) return
                const [e, t, n] = s.current
                null !== t && i.current.addEventListener(e, t, n)
              }, []),
              a = (0, o.useCallback)(() => {
                if (null === i.current || null === s.current) return
                const [e, t, n] = s.current
                null !== t && i.current.removeEventListener(e, t, n)
              }, []),
              l = (0, o.useCallback)((e) => {
                a(), (i.current = e), r()
              }, [])
            return (
              (0, o.useEffect)(
                () => ((s.current = [e, t, n]), r(), a),
                [e, t, n],
              ),
              l
            )
          })('wheel', C, f),
          A = R
        return o.createElement(
          A,
          {
            type: M,
            style: n,
            id: i,
            role: s,
            className: p(e, P, T, F),
            tabIndex: D,
            ref: (0, r.useMergedRefs)([t, N]),
            onFocus: c,
            onBlur: u,
            onMouseOver: d,
            onMouseOut: h,
            onMouseDown: m,
            onMouseUp: _,
            onKeyDown: v,
            onClick: y,
            onWheel: S,
            ...(0, a.filterDataProps)(e),
            ...(0, a.filterAriaProps)(e),
          },
          w,
          E,
          x,
          o.createElement('span', { className: g(e, T, b) }),
        )
      }
      _.displayName = 'ControlSkeleton'
      const v = o.forwardRef(_)
    },
    78274: (e, t, n) => {
      n.d(t, {
        AfterSlot: () => u,
        EndSlot: () => c,
        MiddleSlot: () => l,
        StartSlot: () => a,
      })
      var o = n(50959),
        i = n(97754),
        s = n(73405),
        r = n.n(s)
      function a(e) {
        const {
          className: t,
          interactive: n = !0,
          icon: s = !1,
          children: a,
        } = e
        return o.createElement(
          'span',
          {
            className: i(
              r()['inner-slot'],
              n && r().interactive,
              s && r().icon,
              t,
            ),
          },
          a,
        )
      }
      function l(e) {
        const { className: t, children: n } = e
        return o.createElement(
          'span',
          { className: i(r()['inner-slot'], r()['inner-middle-slot'], t) },
          n,
        )
      }
      function c(e) {
        const {
          className: t,
          interactive: n = !0,
          icon: s = !1,
          children: a,
        } = e
        return o.createElement(
          'span',
          {
            className: i(
              r()['inner-slot'],
              n && r().interactive,
              s && r().icon,
              t,
            ),
          },
          a,
        )
      }
      function u(e) {
        const { className: t, children: n } = e
        return o.createElement(
          'span',
          { className: i(r()['after-slot'], t) },
          n,
        )
      }
    },
    31261: (e, t, n) => {
      n.d(t, { InputControl: () => v })
      var o = n(50959),
        i = n(97754),
        s = n(90186),
        r = n(47201),
        a = n(48907),
        l = n(38528),
        c = n(48027),
        u = n(29202),
        d = n(45812),
        h = n(67029),
        p = n(78274),
        g = n(25549),
        m = n.n(g)
      function f(e) {
        return !(0, s.isAriaAttribute)(e) && !(0, s.isDataAttribute)(e)
      }
      function _(e) {
        const {
            id: t,
            title: n,
            role: r,
            tabIndex: a,
            placeholder: l,
            name: c,
            type: u,
            value: d,
            defaultValue: g,
            draggable: _,
            autoComplete: v,
            autoFocus: y,
            autoCapitalize: D,
            autoCorrect: w,
            maxLength: E,
            min: x,
            max: S,
            step: C,
            pattern: b,
            inputMode: R,
            onSelect: M,
            onFocus: P,
            onBlur: T,
            onKeyDown: F,
            onKeyUp: N,
            onKeyPress: A,
            onChange: W,
            onDragStart: z,
            size: L = 'small',
            className: I,
            inputClassName: O,
            disabled: B,
            readonly: k,
            containerTabIndex: U,
            startSlot: Z,
            endSlot: H,
            reference: $,
            containerReference: G,
            onContainerFocus: j,
            ...V
          } = e,
          q = (0, s.filterProps)(V, f),
          Y = {
            ...(0, s.filterAriaProps)(V),
            ...(0, s.filterDataProps)(V),
            id: t,
            title: n,
            role: r,
            tabIndex: a,
            placeholder: l,
            name: c,
            type: u,
            value: d,
            defaultValue: g,
            draggable: _,
            autoComplete: v,
            autoFocus: y,
            autoCapitalize: D,
            autoCorrect: w,
            maxLength: E,
            min: x,
            max: S,
            step: C,
            pattern: b,
            inputMode: R,
            onSelect: M,
            onFocus: P,
            onBlur: T,
            onKeyDown: F,
            onKeyUp: N,
            onKeyPress: A,
            onChange: W,
            onDragStart: z,
          }
        return o.createElement(h.ControlSkeleton, {
          ...q,
          disabled: B,
          readonly: k,
          tabIndex: U,
          className: i(m().container, I),
          size: L,
          ref: G,
          onFocus: j,
          startSlot: Z,
          middleSlot: o.createElement(
            p.MiddleSlot,
            null,
            o.createElement('input', {
              ...Y,
              className: i(
                m().input,
                m()[`size-${L}`],
                O,
                Z && m()['with-start-slot'],
                H && m()['with-end-slot'],
              ),
              disabled: B,
              readOnly: k,
              ref: $,
            }),
          ),
          endSlot: H,
        })
      }
      function v(e) {
        e = (0, c.useControl)(e)
        const {
            disabled: t,
            autoSelectOnFocus: n,
            tabIndex: i = 0,
            onFocus: s,
            onBlur: h,
            reference: p,
            containerReference: g = null,
          } = e,
          m = (0, o.useRef)(null),
          f = (0, o.useRef)(null),
          [v, y] = (0, u.useFocus)(),
          D = t ? void 0 : v ? -1 : i,
          w = t ? void 0 : v ? i : -1,
          {
            isMouseDown: E,
            handleMouseDown: x,
            handleMouseUp: S,
          } = (0, d.useIsMouseDown)(),
          C = (0, r.createSafeMulticastEventHandler)(
            y.onFocus,
            (e) => {
              n && !E.current && (0, a.selectAllContent)(e.currentTarget)
            },
            s,
          ),
          b = (0, r.createSafeMulticastEventHandler)(y.onBlur, h),
          R = (0, o.useCallback)(
            (e) => {
              ;(m.current = e),
                p &&
                  ('function' == typeof p && p(e),
                  'object' == typeof p && (p.current = e))
            },
            [m, p],
          )
        return o.createElement(_, {
          ...e,
          isFocused: v,
          containerTabIndex: D,
          tabIndex: w,
          onContainerFocus: (e) => {
            f.current === e.target && null !== m.current && m.current.focus()
          },
          onFocus: C,
          onBlur: b,
          reference: R,
          containerReference: (0, l.useMergedRefs)([f, g]),
          onMouseDown: x,
          onMouseUp: S,
        })
      }
    },
    48027: (e, t, n) => {
      n.d(t, { useControl: () => s })
      var o = n(47201),
        i = n(29202)
      function s(e) {
        const {
            onFocus: t,
            onBlur: n,
            intent: s,
            highlight: r,
            disabled: a,
          } = e,
          [l, c] = (0, i.useFocus)(void 0, a),
          u = (0, o.createSafeMulticastEventHandler)(a ? void 0 : c.onFocus, t),
          d = (0, o.createSafeMulticastEventHandler)(a ? void 0 : c.onBlur, n)
        return {
          ...e,
          intent: s || (l ? 'primary' : 'default'),
          highlight: r ?? l,
          onFocus: u,
          onBlur: d,
        }
      }
    },
    29202: (e, t, n) => {
      n.d(t, { useFocus: () => i })
      var o = n(50959)
      function i(e, t) {
        const [n, i] = (0, o.useState)(!1)
        ;(0, o.useEffect)(() => {
          t && n && i(!1)
        }, [t, n])
        const s = {
          onFocus: (0, o.useCallback)(
            (t) => {
              ;(void 0 !== e && e.current !== t.target) || i(!0)
            },
            [e],
          ),
          onBlur: (0, o.useCallback)(
            (t) => {
              ;(void 0 !== e && e.current !== t.target) || i(!1)
            },
            [e],
          ),
        }
        return [n, s]
      }
    },
    45812: (e, t, n) => {
      n.d(t, { useIsMouseDown: () => i })
      var o = n(50959)
      function i() {
        const e = (0, o.useRef)(!1),
          t = (0, o.useCallback)(() => {
            e.current = !0
          }, [e]),
          n = (0, o.useCallback)(() => {
            e.current = !1
          }, [e])
        return { isMouseDown: e, handleMouseDown: t, handleMouseUp: n }
      }
    },
    43010: (e, t, n) => {
      n.d(t, { useIsomorphicLayoutEffect: () => i })
      var o = n(50959)
      function i(e, t) {
        ;('undefined' == typeof window ? o.useEffect : o.useLayoutEffect)(e, t)
      }
    },
    38528: (e, t, n) => {
      n.d(t, { useMergedRefs: () => s })
      var o = n(50959),
        i = n(53017)
      function s(e) {
        return (0, o.useCallback)((0, i.mergeRefs)(e), e)
      }
    },
    27267: (e, t, n) => {
      function o(e, t, n, o, i) {
        function s(i) {
          if (e > i.timeStamp) return
          const s = i.target
          void 0 !== n &&
            null !== t &&
            null !== s &&
            s.ownerDocument === o &&
            (t.contains(s) || n(i))
        }
        return (
          i.click && o.addEventListener('click', s, !1),
          i.mouseDown && o.addEventListener('mousedown', s, !1),
          i.touchEnd && o.addEventListener('touchend', s, !1),
          i.touchStart && o.addEventListener('touchstart', s, !1),
          () => {
            o.removeEventListener('click', s, !1),
              o.removeEventListener('mousedown', s, !1),
              o.removeEventListener('touchend', s, !1),
              o.removeEventListener('touchstart', s, !1)
          }
        )
      }
      n.d(t, { addOutsideEventListener: () => o })
    },
    36383: (e, t, n) => {
      n.d(t, { useOutsideEvent: () => r })
      var o = n(50959),
        i = n(43010),
        s = n(27267)
      function r(e) {
        const {
            click: t,
            mouseDown: n,
            touchEnd: r,
            touchStart: a,
            handler: l,
            reference: c,
          } = e,
          u = (0, o.useRef)(null),
          d = (0, o.useRef)(
            'undefined' == typeof window
              ? 0
              : new window.CustomEvent('timestamp').timeStamp,
          )
        return (
          (0, i.useIsomorphicLayoutEffect)(() => {
            const e = { click: t, mouseDown: n, touchEnd: r, touchStart: a },
              o = c ? c.current : u.current
            return (0, s.addOutsideEventListener)(d.current, o, l, document, e)
          }, [t, n, r, a, l]),
          c || u
        )
      }
    },
    9745: (e, t, n) => {
      n.d(t, { Icon: () => i })
      var o = n(50959)
      const i = o.forwardRef((e, t) => {
        const {
            icon: n = '',
            title: i,
            ariaLabel: s,
            ariaLabelledby: r,
            ariaHidden: a,
            ...l
          } = e,
          c = !!(i || s || r)
        return o.createElement('span', {
          role: 'img',
          ...l,
          ref: t,
          'aria-label': s,
          'aria-labelledby': r,
          'aria-hidden': a || !c,
          title: i,
          dangerouslySetInnerHTML: { __html: n },
        })
      })
    },
    99663: (e, t, n) => {
      n.d(t, { Slot: () => i, SlotContext: () => s })
      var o = n(50959)
      class i extends o.Component {
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
      const s = o.createContext(null)
    },
    90186: (e, t, n) => {
      function o(e) {
        return s(e, r)
      }
      function i(e) {
        return s(e, a)
      }
      function s(e, t) {
        const n = Object.entries(e).filter(t),
          o = {}
        for (const [e, t] of n) o[e] = t
        return o
      }
      function r(e) {
        const [t, n] = e
        return 0 === t.indexOf('data-') && 'string' == typeof n
      }
      function a(e) {
        return 0 === e[0].indexOf('aria-')
      }
      n.d(t, {
        filterAriaProps: () => i,
        filterDataProps: () => o,
        filterProps: () => s,
        isAriaAttribute: () => a,
        isDataAttribute: () => r,
      })
    },
    48907: (e, t, n) => {
      function o(e) {
        null !== e && e.setSelectionRange(0, e.value.length)
      }
      n.d(t, { selectAllContent: () => o })
    },
    53017: (e, t, n) => {
      function o(e) {
        return (t) => {
          e.forEach((e) => {
            'function' == typeof e ? e(t) : null != e && (e.current = t)
          })
        }
      }
      function i(e) {
        return o([e])
      }
      n.d(t, { isomorphicRef: () => i, mergeRefs: () => o })
    },
    52778: (e, t, n) => {
      n.d(t, { OutsideEvent: () => i })
      var o = n(36383)
      function i(e) {
        const { children: t, ...n } = e
        return t((0, o.useOutsideEvent)(n))
      }
    },
    67961: (e, t, n) => {
      n.d(t, { OverlapManager: () => r, getRootOverlapManager: () => l })
      var o = n(50151),
        i = n(34811)
      class s {
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
      class r {
        constructor(e = document) {
          ;(this._storage = new s()),
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
        moveLastWindowToTop() {
          const e = this._storage.getItems(),
            t = e[e.length - 1]
          t && this.moveToTop(t)
        }
        moveToTop(e) {
          if (this.getZindex(e) !== this._index) {
            const t = this.ensureWindow(e)
            this._windows.forEach((e, n) => {
              e.hasAttribute(i.FOCUS_TRAP_DATA_ATTRIBUTE) &&
                e.setAttribute(
                  i.FOCUS_TRAP_DATA_ATTRIBUTE,
                  e === t ? 'true' : 'false',
                )
            }),
              (t.style.zIndex = (++this._index).toString())
          }
        }
        removeWindow(e) {
          this.unregisterWindow(e)
        }
      }
      const a = new WeakMap()
      function l(e = document) {
        const t = e.getElementById('overlap-manager-root')
        if (null !== t) return (0, o.ensureDefined)(a.get(t))
        {
          const t = new r(e),
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
      var c
      !((e) => {
        e[(e.BaseZindex = 150)] = 'BaseZindex'
      })(c || (c = {}))
    },
    47201: (e, t, n) => {
      function o(...e) {
        return (t) => {
          for (const n of e) void 0 !== n && n(t)
        }
      }
      n.d(t, { createSafeMulticastEventHandler: () => o })
    },
    99054: (e, t, n) => {
      n.d(t, { setFixedBodyState: () => c })
      const o = (() => {
        let e
        return () => {
          if (void 0 === e) {
            const t = document.createElement('div'),
              n = t.style
            ;(n.visibility = 'hidden'),
              (n.width = '100px'),
              (n.msOverflowStyle = 'scrollbar'),
              document.body.appendChild(t)
            const o = t.offsetWidth
            t.style.overflow = 'scroll'
            const i = document.createElement('div')
            ;(i.style.width = '100%'), t.appendChild(i)
            const s = i.offsetWidth
            t.parentNode?.removeChild(t), (e = o - s)
          }
          return e
        }
      })()
      function i(e, t, n) {
        null !== e && e.style.setProperty(t, n)
      }
      function s(e, t) {
        return getComputedStyle(e, null).getPropertyValue(t)
      }
      function r(e, t) {
        return Number.parseInt(s(e, t))
      }
      let a = 0,
        l = !1
      function c(e) {
        const { body: t } = document,
          n = t.querySelector('.widgetbar-wrap')
        if (e && 1 == ++a) {
          const e = s(t, 'overflow'),
            a = r(t, 'padding-right')
          'hidden' !== e.toLowerCase() &&
            t.scrollHeight > t.offsetHeight &&
            (i(n, 'right', `${o()}px`),
            (t.style.paddingRight = `${a + o()}px`),
            (l = !0)),
            t.classList.add('i-no-scroll')
        } else if (
          !e &&
          a > 0 &&
          0 == --a &&
          (t.classList.remove('i-no-scroll'), l)
        ) {
          i(n, 'right', '0px')
          let e = 0
          0,
            t.scrollHeight <= t.clientHeight && (e -= o()),
            (t.style.paddingRight = (e < 0 ? 0 : e) + 'px'),
            (l = !1)
        }
      }
    },
    87896: (e, t, n) => {
      n.d(t, { createReactRoot: () => d })
      var o = n(50959),
        i = n(32227),
        s = n(4237)
      const r = (0, o.createContext)({
        isOnMobileAppPage: () => !1,
        isRtl: !1,
        locale: 'en',
      })
      var a = n(84015),
        l = n(63273)
      const c = {
        iOs: 'old',
        android: 'new',
        old: 'old',
        new: 'new',
        any: 'any',
      }
      function u(e) {
        const [t] = (0, o.useState)({
          isOnMobileAppPage: (e) => (0, a.isOnMobileAppPage)(c[e]),
          isRtl: (0, l.isRtl)(),
          locale: window.locale,
        })
        return o.createElement(r.Provider, { value: t }, e.children)
      }
      function d(e, t, n = 'legacy') {
        const r = o.createElement(u, null, e)
        if ('modern' === n) {
          const e = (0, s.createRoot)(t)
          return (
            e.render(r),
            {
              render(t) {
                e.render(o.createElement(u, null, t))
              },
              unmount() {
                e.unmount()
              },
            }
          )
        }
        return (
          i.render(r, t),
          {
            render(e) {
              i.render(o.createElement(u, null, e), t)
            },
            unmount() {
              i.unmountComponentAtNode(t)
            },
          }
        )
      }
    },
    51826: (e, t, n) => {
      n.d(t, { DialogsOpenerManager: () => o, dialogsOpenerManager: () => i })
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
      const i = new o()
    },
    95711: (e, t, n) => {
      n.d(t, { PopupContext: () => o })
      const o = n(50959).createContext(null)
    },
    82206: (e, t, n) => {
      n.d(t, { PopupDialog: () => W })
      var o = n(50959),
        i = n(97754),
        s = n(50151),
        r = n(99663),
        a = n(67961),
        l = n(90186),
        c = n(84928)
      class u extends o.PureComponent {
        constructor() {
          super(...arguments),
            (this._manager = new a.OverlapManager()),
            (this._handleSlot = (e) => {
              this._manager.setContainer(e)
            })
        }
        render() {
          const {
              rounded: e = !0,
              shadowed: t = !0,
              fullscreen: n = !1,
              darker: s = !1,
              className: a,
              backdrop: u,
              containerTabIndex: d = -1,
            } = this.props,
            h = i(
              a,
              c.dialog,
              e && c.rounded,
              t && c.shadowed,
              n && c.fullscreen,
              s && c.darker,
            ),
            p = (0, l.filterDataProps)(this.props),
            g = this.props.style
              ? { ...this._createStyles(), ...this.props.style }
              : this._createStyles()
          return o.createElement(
            o.Fragment,
            null,
            o.createElement(
              r.SlotContext.Provider,
              { value: this._manager },
              u &&
                o.createElement('div', {
                  onClick: this.props.onClickBackdrop,
                  className: c.backdrop,
                }),
              o.createElement(
                'div',
                {
                  ...p,
                  className: h,
                  style: g,
                  ref: this.props.reference,
                  onFocus: this.props.onFocus,
                  onMouseDown: this.props.onMouseDown,
                  onMouseUp: this.props.onMouseUp,
                  onClick: this.props.onClick,
                  onKeyDown: this.props.onKeyDown,
                  tabIndex: d,
                  'aria-label': this.props.containerAriaLabel,
                },
                this.props.children,
              ),
            ),
            o.createElement(r.Slot, { reference: this._handleSlot }),
          )
        }
        _createStyles() {
          const {
            bottom: e,
            left: t,
            width: n,
            right: o,
            top: i,
            zIndex: s,
            height: r,
          } = this.props
          return {
            bottom: e,
            left: t,
            right: o,
            top: i,
            zIndex: s,
            maxWidth: n,
            height: r,
          }
        }
      }
      var d,
        h = n(86431),
        p = n(52778),
        g = n(9859),
        m = n(15754)
      function f(e, t, n, o) {
        return e + t > o && (e = o - t), e < n && (e = n), e
      }
      function _(e) {
        return {
          x: (0, g.clamp)(e.x, 20, document.documentElement.clientWidth - 20),
          y: (0, g.clamp)(e.y, 20, window.innerHeight - 20),
        }
      }
      function v(e) {
        return { x: e.clientX, y: e.clientY }
      }
      function y(e) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
      !((e) => {
        e[(e.MouseGuardZone = 20)] = 'MouseGuardZone'
      })(d || (d = {}))
      class D {
        constructor(e, t, n = { boundByScreen: !0 }) {
          ;(this._drag = null),
            (this._canBeTouchClick = !1),
            (this._frame = null),
            (this._onMouseDragStart = (e) => {
              if (0 !== e.button || this._isTargetNoDraggable(e)) return
              e.preventDefault(),
                document.addEventListener('mousemove', this._onMouseDragMove),
                document.addEventListener('mouseup', this._onMouseDragEnd)
              const t = _(v(e))
              this._dragStart(t)
            }),
            (this._onTouchDragStart = (e) => {
              if (this._isTargetNoDraggable(e)) return
              ;(this._canBeTouchClick = !0),
                e.preventDefault(),
                this._header.addEventListener(
                  'touchmove',
                  this._onTouchDragMove,
                  { passive: !1 },
                )
              const t = _(y(e))
              this._dragStart(t)
            }),
            (this._onMouseDragEnd = (e) => {
              e.target instanceof Node &&
                this._header.contains(e.target) &&
                e.preventDefault(),
                document.removeEventListener(
                  'mousemove',
                  this._onMouseDragMove,
                ),
                document.removeEventListener('mouseup', this._onMouseDragEnd),
                this._onDragStop()
            }),
            (this._onTouchDragEnd = (e) => {
              this._header.removeEventListener(
                'touchmove',
                this._onTouchDragMove,
              ),
                this._onDragStop(),
                this._canBeTouchClick &&
                  ((this._canBeTouchClick = !1),
                  ((e) => {
                    if (e instanceof SVGElement) {
                      const t = document.createEvent('SVGEvents')
                      t.initEvent('click', !0, !0), e.dispatchEvent(t)
                    }
                    e instanceof HTMLElement && e.click()
                  })(e.target))
            }),
            (this._onMouseDragMove = (e) => {
              const t = _(v(e))
              this._dragMove(t)
            }),
            (this._onTouchDragMove = (e) => {
              ;(this._canBeTouchClick = !1), e.preventDefault()
              const t = _(y(e))
              this._dragMove(t)
            }),
            (this._onDragStop = () => {
              ;(this._drag = null),
                this._header.classList.remove('dragging'),
                this._options.onDragEnd && this._options.onDragEnd()
            }),
            (this._dialog = e),
            (this._header = t),
            (this._options = n),
            this._header.addEventListener('mousedown', this._onMouseDragStart),
            this._header.addEventListener('touchstart', this._onTouchDragStart),
            this._header.addEventListener('touchend', this._onTouchDragEnd)
        }
        destroy() {
          null !== this._frame && cancelAnimationFrame(this._frame),
            this._header.removeEventListener(
              'mousedown',
              this._onMouseDragStart,
            ),
            document.removeEventListener('mouseup', this._onMouseDragEnd),
            this._header.removeEventListener(
              'touchstart',
              this._onTouchDragStart,
            ),
            this._header.removeEventListener('touchend', this._onTouchDragEnd),
            document.removeEventListener('mouseleave', this._onMouseDragEnd)
        }
        updateOptions(e) {
          this._options = e
        }
        _dragStart(e) {
          const t = this._dialog.getBoundingClientRect()
          this._drag = {
            startX: e.x,
            startY: e.y,
            finishX: e.x,
            finishY: e.y,
            dialogX: t.left,
            dialogY: t.top,
          }
          const n = Math.round(t.left),
            o = Math.round(t.top)
          ;(this._dialog.style.transform = `translate(${n}px, ${o}px)`),
            this._header.classList.add('dragging'),
            this._options.onDragStart && this._options.onDragStart()
        }
        _dragMove(e) {
          if (this._drag) {
            if (
              ((this._drag.finishX = e.x),
              (this._drag.finishY = e.y),
              null !== this._frame)
            )
              return
            this._frame = requestAnimationFrame(() => {
              if (this._drag) {
                const t = e.x - this._drag.startX,
                  n = e.y - this._drag.startY
                this._moveDialog(this._drag.dialogX + t, this._drag.dialogY + n)
              }
              this._frame = null
            })
          }
        }
        _moveDialog(e, t) {
          const n = this._dialog.getBoundingClientRect(),
            { boundByScreen: o } = this._options,
            i = f(e, n.width, o ? 0 : -1 / 0, o ? window.innerWidth : 1 / 0),
            s = f(t, n.height, o ? 0 : -1 / 0, o ? window.innerHeight : 1 / 0)
          this._dialog.style.transform = `translate(${Math.round(i)}px, ${Math.round(s)}px)`
        }
        _isTargetNoDraggable(e) {
          return (
            e.target instanceof Element &&
            null !== e.target.closest('[data-disable-drag]')
          )
        }
      }
      const w = { vertical: 0 }
      var E,
        x = n(42842),
        S = n(95711),
        C = n(99054),
        b = n(9343),
        R = n(92184)
      !((e) => {
        ;(e.Open = 'dialog-open'),
          (e.Close = 'dialog-close'),
          (e.FullscreenOn = 'dialog-fullscreen-on'),
          (e.FullscreenOff = 'dialog-fullscreen-off')
      })(E || (E = {}))
      const M = (0, b.getLogger)('DialogEventDispatcher')
      class P {
        constructor() {
          this._openSessionId = null
        }
        dispatch(e) {
          if ('dialog-open' === e) {
            if (null !== this._openSessionId)
              return void M.logError('Multiple calls to open dialog')
            this._openSessionId = (0, R.randomHash)()
          }
          null !== this._openSessionId
            ? (window.dispatchEvent(
                new CustomEvent(e, {
                  bubbles: !0,
                  detail: { dialogSessionId: this._openSessionId },
                }),
              ),
              'dialog-close' === e && (this._openSessionId = null))
            : M.logError('Empty open dialog session id')
        }
      }
      var T = n(84015),
        F = (n(56570), n(13100))
      F['tooltip-offset']
      const N = class {
        constructor(e, t) {
          ;(this._frame = null),
            (this._isFullscreen = !1),
            (this._handleResize = () => {
              null === this._frame &&
                (this._frame = requestAnimationFrame(() => {
                  this.recalculateBounds(), (this._frame = null)
                }))
            }),
            (this._dialog = e),
            (this._guard = t.guard || w),
            (this._calculateDialogPosition = t.calculateDialogPosition),
            (this._initialHeight = e.style.height),
            window.addEventListener('resize', this._handleResize)
        }
        updateOptions(e) {
          ;(this._guard = e.guard || w),
            (this._calculateDialogPosition = e.calculateDialogPosition)
        }
        setFullscreen(e) {
          this._isFullscreen !== e &&
            ((this._isFullscreen = e), this.recalculateBounds())
        }
        centerAndFit() {
          const { x: e, y: t } = this.getDialogsTopLeftCoordinates(),
            n = this._calcAvailableHeight(),
            o = this._calcDialogHeight()
          if (n === o)
            if (this._calculateDialogPosition) {
              const { left: e, top: t } = this._calculateDialogPosition(
                this._dialog,
                document.documentElement,
                this._guard,
              )
              this._dialog.style.transform = `translate(${Math.round(e)}px, ${Math.round(t)}px)`
            } else this._dialog.style.height = o + 'px'
          ;(this._dialog.style.top = '0px'),
            (this._dialog.style.left = '0px'),
            (this._dialog.style.transform = `translate(${e}px, ${t}px)`)
        }
        getDialogsTopLeftCoordinates() {
          const { clientWidth: e, clientHeight: t } =
              this._getClientDimensions(),
            n = this._calcDialogHeight(),
            o = e / 2 - this._dialog.clientWidth / 2,
            i = t / 2 - n / 2 + this._getTopOffset()
          return { x: Math.round(o), y: Math.round(i) }
        }
        recalculateBounds() {
          const { clientWidth: e, clientHeight: t } =
              this._getClientDimensions(),
            { vertical: n } = this._guard,
            o = this._calculateDialogPosition?.(
              this._dialog,
              { clientWidth: e, clientHeight: t },
              { vertical: n },
            )
          if (this._isFullscreen) {
            if (
              ((this._dialog.style.top = '0px'),
              (this._dialog.style.left = '0px'),
              (this._dialog.style.width = '100%'),
              (this._dialog.style.height = '100%'),
              (this._dialog.style.transform = 'none'),
              o)
            ) {
              const { left: e, top: t, width: n, height: i } = o
              ;(this._dialog.style.transform = `translate(${Math.round(e)}px, ${Math.round(t)}px)`),
                n &&
                  ((this._dialog.style.width = `${n}px`),
                  (this._dialog.style.minWidth = 'unset')),
                i &&
                  ((this._dialog.style.height = `${i}px`),
                  (this._dialog.style.minHeight = 'unset'))
            }
          } else if (o) {
            const { left: e, top: t } = o
            this._dialog.style.transform = `translate(${Math.round(e)}px, ${Math.round(t)}px)`
          } else {
            ;(this._dialog.style.width = ''), (this._dialog.style.height = '')
            const o = this._dialog.getBoundingClientRect(),
              i = t - 2 * n,
              s = f(o.left, o.width, 0, e),
              r = f(o.top, o.height, n, t)
            ;(this._dialog.style.top = '0px'),
              (this._dialog.style.left = '0px'),
              (this._dialog.style.transform = `translate(${Math.round(s)}px, ${Math.round(r)}px)`),
              (this._dialog.style.height =
                i < o.height ? i + 'px' : this._initialHeight)
          }
        }
        destroy() {
          window.removeEventListener('resize', this._handleResize),
            null !== this._frame &&
              (cancelAnimationFrame(this._frame), (this._frame = null))
        }
        _getClientDimensions() {
          return {
            clientHeight: document.documentElement.clientHeight,
            clientWidth: document.documentElement.clientWidth,
          }
        }
        _getTopOffset() {
          return 0
        }
        _calcDialogHeight() {
          const e = this._calcAvailableHeight()
          return e < this._dialog.clientHeight ? e : this._dialog.clientHeight
        }
        _calcAvailableHeight() {
          return (
            this._getClientDimensions().clientHeight - 2 * this._guard.vertical
          )
        }
      }
      class A extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._dialog = null),
            (this._cleanUpFunctions = []),
            (this._prevActiveElement = null),
            (this._eventDispatcher = new P()),
            (this._handleDialogRef = (e) => {
              const { reference: t } = this.props
              ;(this._dialog = e), 'function' == typeof t && t(e)
            }),
            (this._handleFocus = () => {
              this._moveToTop()
            }),
            (this._handleMouseDown = (e) => {
              this._moveToTop()
            }),
            (this._handleTouchStart = (e) => {
              this._moveToTop()
            }),
            (this.state = { canFitTooltip: !1 }),
            (this._prevActiveElement = document.activeElement)
        }
        render() {
          return o.createElement(
            S.PopupContext.Provider,
            { value: this },
            o.createElement(
              p.OutsideEvent,
              {
                mouseDown: !0,
                touchStart: !0,
                handler: this.props.onClickOutside,
              },
              (e) =>
                o.createElement(
                  'div',
                  {
                    ref: e,
                    'data-outside-boundary-for': this.props.name,
                    onFocus: this._handleFocus,
                    onMouseDown: this._handleMouseDown,
                    onTouchStart: this._handleTouchStart,
                    'data-dialog-name': this.props['data-dialog-name'],
                    'data-tooltip-show-on-focus': 'true',
                  },
                  o.createElement(
                    u,
                    {
                      style: this._applyAnimationCSSVariables(),
                      ...this.props,
                      reference: this._handleDialogRef,
                      className: i(
                        F.dialog,
                        (0, T.isOnMobileAppPage)('any') &&
                          !this.props.noMobileAppShadows &&
                          F.mobile,
                        this.props.fullscreen && F.fullscreen,
                        this.props.className,
                      ),
                    },
                    !1,
                    this.props.children,
                  ),
                ),
            ),
          )
        }
        componentDidMount() {
          const { draggable: e, boundByScreen: t, onDragStart: n } = this.props,
            o = (0, s.ensureNotNull)(this._dialog)
          if ((this._eventDispatcher.dispatch('dialog-open'), e)) {
            const e = o.querySelector('[data-dragg-area]')
            if (e && e instanceof HTMLElement) {
              const i = new D(o, e, {
                boundByScreen: Boolean(t),
                onDragStart: n,
              })
              this._cleanUpFunctions.push(() => i.destroy()), (this._drag = i)
            }
          }
          this.props.autofocus &&
            !o.contains(document.activeElement) &&
            o.focus(),
            (this._isFullScreen() || this.props.fixedBody) &&
              (0, C.setFixedBodyState)(!0)
          const { guard: i, calculateDialogPosition: r } = this.props
          if (this.props.resizeHandler) this._resize = this.props.resizeHandler
          else {
            const e = new N(o, { guard: i, calculateDialogPosition: r })
            this._cleanUpFunctions.push(() => e.destroy()), (this._resize = e)
          }
          if (
            (this._isFullScreen() &&
              this._eventDispatcher.dispatch('dialog-fullscreen-on'),
            this.props.isAnimationEnabled &&
              this.props.growPoint &&
              this._applyAppearanceAnimation(this.props.growPoint),
            this.props.centeredOnMount && this._resize.centerAndFit(),
            this._resize.setFullscreen(this._isFullScreen()),
            this.props.shouldForceFocus)
          ) {
            if (this.props.onForceFocus) return void this.props.onForceFocus(o)
            o.focus()
          }
          if (!o.contains(document.activeElement)) {
            const e = ((e) => {
              const t = e.querySelector('[autofocus]:not([disabled])')
              if (t) return t
              if (e.tabIndex >= 0) return e
              const n = (0, m.getActiveElementSelectors)(),
                o = Array.from(e.querySelectorAll(n)).filter(
                  (0, m.createScopedVisibleElementFilter)(e),
                )
              let i = Number.NEGATIVE_INFINITY,
                s = null
              for (let e = 0; e < o.length; e++) {
                const t = o[e],
                  n = t.getAttribute('tabindex')
                if (null !== n) {
                  const e = Number.parseInt(n, 10)
                  !isNaN(e) && e > i && ((i = e), (s = t))
                }
              }
              return s
            })(o)
            e instanceof HTMLElement && e.focus()
          }
        }
        componentDidUpdate(e) {
          const t = e.fullscreen
          if (this._resize) {
            const { guard: e, calculateDialogPosition: t } = this.props
            this._resize.updateOptions({
              guard: e,
              calculateDialogPosition: t,
            }),
              this._resize.setFullscreen(this._isFullScreen())
          }
          if (
            (this._drag &&
              this._drag.updateOptions({
                boundByScreen: Boolean(this.props.boundByScreen),
                onDragStart: this.props.onDragStart,
              }),
            e.fullscreen !== this.props.fullscreen)
          ) {
            const e = this.props.fullscreen
            e && !t
              ? this._eventDispatcher.dispatch('dialog-fullscreen-on')
              : !e &&
                t &&
                this._eventDispatcher.dispatch('dialog-fullscreen-off')
          }
        }
        componentWillUnmount() {
          if (
            this.props.shouldReturnFocus &&
            this._prevActiveElement &&
            document.body.contains(this._prevActiveElement) &&
            (null === document.activeElement ||
              document.activeElement === document.body ||
              this._dialog?.contains(document.activeElement))
          )
            try {
              setTimeout(() => {
                this._prevActiveElement.focus({ preventScroll: !0 })
              })
            } catch {}
          for (const e of this._cleanUpFunctions) e()
          ;(this._isFullScreen() || this.props.fixedBody) &&
            (0, C.setFixedBodyState)(!1),
            this._isFullScreen() &&
              this._eventDispatcher.dispatch('dialog-fullscreen-off'),
            this._eventDispatcher.dispatch('dialog-close')
        }
        focus() {
          this._dialog && this._dialog.focus()
        }
        centerAndFit() {
          this._resize && this._resize.centerAndFit()
        }
        recalculateBounds() {
          this._resize && this._resize.recalculateBounds()
        }
        _moveToTop() {
          this.props.isZIndexFixed ||
            (null !== this.context && this.context.moveToTop())
        }
        _applyAnimationCSSVariables() {
          return {
            '--animationTranslateStartX': null,
            '--animationTranslateStartY': null,
            '--animationTranslateEndX': null,
            '--animationTranslateEndY': null,
          }
        }
        _applyAppearanceAnimation(e) {
          if (this._resize && this._dialog) {
            const { x: t, y: n } = e,
              { x: o, y: i } = this._resize.getDialogsTopLeftCoordinates()
            this._dialog.style.setProperty(
              '--animationTranslateStartX',
              `${t}px`,
            ),
              this._dialog.style.setProperty(
                '--animationTranslateStartY',
                `${n}px`,
              ),
              this._dialog.style.setProperty(
                '--animationTranslateEndX',
                `${o}px`,
              ),
              this._dialog.style.setProperty(
                '--animationTranslateEndY',
                `${i}px`,
              ),
              this._dialog.classList.add(F.dialogAnimatedAppearance)
          }
        }
        _handleTooltipFit() {
          0
        }
        _isFullScreen() {
          return Boolean(this.props.fullscreen)
        }
      }
      ;(A.contextType = x.PortalContext),
        (A.defaultProps = {
          boundByScreen: !0,
          draggable: !0,
          centeredOnMount: !0,
          shouldReturnFocus: !0,
        })
      const W = (0, h.makeOverlapable)(A, !0)
    },
    86431: (e, t, n) => {
      n.d(t, { makeOverlapable: () => s })
      var o = n(50959),
        i = n(42842)
      function s(e, t) {
        return class extends o.PureComponent {
          render() {
            const { isOpened: n, root: s } = this.props
            if (!n) return null
            const r = o.createElement(e, {
              ...this.props,
              ref: this.props.componentRef,
              zIndex: 150,
            })
            return 'parent' === s
              ? r
              : o.createElement(i.Portal, { shouldTrapFocus: t }, r)
          }
        }
      }
    },
    42842: (e, t, n) => {
      n.d(t, { Portal: () => c, PortalContext: () => u })
      var o = n(50959),
        i = n(32227),
        s = n(55698),
        r = n(67961),
        a = n(34811),
        l = n(99663)
      class c extends o.PureComponent {
        constructor() {
          super(...arguments), (this._uuid = (0, s.nanoid)())
        }
        componentWillUnmount() {
          this._manager().removeWindow(this._uuid)
        }
        render() {
          const e = this._manager().ensureWindow(
            this._uuid,
            this.props.layerOptions,
          )
          ;(e.style.top = this.props.top || ''),
            (e.style.bottom = this.props.bottom || ''),
            (e.style.left = this.props.left || ''),
            (e.style.right = this.props.right || ''),
            (e.style.pointerEvents = this.props.pointerEvents || '')
          const t = this.props.className
          return (
            t &&
              ('string' == typeof t
                ? e.classList.add(t)
                : e.classList.add(...t)),
            this.props.shouldTrapFocus &&
              !e.hasAttribute(a.FOCUS_TRAP_DATA_ATTRIBUTE) &&
              e.setAttribute(a.FOCUS_TRAP_DATA_ATTRIBUTE, 'true'),
            this.props['aria-hidden'] && e.setAttribute('aria-hidden', 'true'),
            i.createPortal(
              o.createElement(u.Provider, { value: this }, this.props.children),
              e,
            )
          )
        }
        moveToTop() {
          this._manager().moveToTop(this._uuid)
        }
        _manager() {
          return null === this.context
            ? (0, r.getRootOverlapManager)()
            : this.context
        }
      }
      c.contextType = l.SlotContext
      const u = o.createContext(null)
    },
    4237: (e, t, n) => {
      var o = n(32227)
      ;(t.createRoot = o.createRoot), o.hydrateRoot
    },
    44610: (e) => {
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
    71090: (e, t, n) => {
      n.r(t),
        n.d(t, {
          showChangeIntervalDialog: () => x,
        })
      var o = n(50959),
        i = n(97754),
        s = n.n(i),
        r = n(11542),
        a = n(31261),
        l = n(67029),
        c = n(82992),
        u = n(82206),
        d = n(9745),
        h = n(85508)
      const p = r.t(null, void 0, n(51998)),
        g = r.t(null, void 0, n(96941))
      function m(e) {
        const { className: t, isSecondsEnabled: n } = e
        return o.createElement(d.Icon, {
          icon: h,
          className: s()('apply-common-tooltip', t),
          title: n ? g : p,
        })
      }
      var f = n(10074),
        _ = n(85049)
      var v = n(44610)
      const y = 8
      function D(e) {
        const { initVal: t, selectOnInit: i, onClose: d } = e,
          h = (0, o.useRef)(null),
          [p, g] = (0, o.useState)(t.toUpperCase()),
          D = (0, o.useMemo)(() => _.Interval.parse(p), [p]),
          w = ((e, t) =>
            (0, o.useMemo)(() => {
              if (!t.isValid() || !(0, f.intervalIsSupported)(e)) return !1
              const n = _.Interval.normalize(e)
              return null !== n && (0, f.isResolutionMultiplierValid)(n)
            }, [e, t]))(p, D),
          E = (0, o.useMemo)(() => {
            if (!w) return null
            return (0, f.getTranslatedResolutionModel)(D.value()).hint
          }, [w, D])
        return (
          (0, o.useLayoutEffect)(() => {
            i ? h.current?.select() : h.current?.focus()
          }, [i]),
          o.createElement(
            u.PopupDialog,
            {
              className: v.dialog,
              'data-dialog-name': 'change-interval-dialog',
              isOpened: !0,
              onClickOutside: d,
              onFocus: () => {
                h.current?.focus()
              },
              onKeyDown: (e) => {
                27 === e.keyCode && d?.()
              },
            },
            o.createElement(
              'div',
              { className: v.dialogInner },
              o.createElement(
                'div',
                { className: v.titleWrapper },
                o.createElement(
                  'div',
                  { className: v.title },
                  r.t(null, void 0, n(2569)),
                ),
                o.createElement(m, {
                  className: v.infoHint,
                  isSecondsEnabled: (0, f.isSecondsEnabled)(),
                }),
              ),
              o.createElement(
                'form',
                {
                  className: v.form,
                  onSubmit: (e) => {
                    e.preventDefault()
                    const t = c.linking.interval.value(),
                      n = _.Interval.normalize(p)
                    n && t !== n && w && c.linking.interval.setValue(n)
                    d?.()
                  },
                },
                o.createElement(a.InputControl, {
                  className: s()(v.inputWrapper, l.InputClasses.FontSizeLarge),
                  inputClassName: v.input,
                  type: 'text',
                  size: 'large',
                  reference: h,
                  value: p,
                  maxLength: y,
                  intent: w ? void 0 : 'danger',
                  onChange: (e) => {
                    const { value: t } = e.target
                    g(t.toUpperCase())
                  },
                }),
              ),
              w
                ? o.createElement('div', { className: v.hint }, E)
                : o.createElement(
                    'div',
                    { className: s()(v.hint, v.error) },
                    r.t(null, void 0, n(87859)),
                  ),
            ),
          )
        )
      }
      var w = n(51826),
        E = n(87896)
      function x(e) {
        if (
          w.dialogsOpenerManager.isOpened('ChangeIntervalDialog') ||
          w.dialogsOpenerManager.isOpened('SymbolSearch')
        )
          return
        const t = document.createElement('div'),
          { initVal: n, selectOnInit: i, onClose: s } = e,
          r = o.createElement(D, {
            initVal: n,
            selectOnInit: i,
            onClose: () => {
              a.unmount(),
                w.dialogsOpenerManager.setAsClosed('ChangeIntervalDialog'),
                s?.()
            },
          }),
          a = (0, E.createReactRoot)(r, t)
        w.dialogsOpenerManager.setAsOpened('ChangeIntervalDialog')
      }
    },
    85508: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M8 8.5h1.5V14"/><circle fill="currentColor" cx="9" cy="5" r="1"/><path stroke="currentColor" d="M16.5 9a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0z"/></svg>'
    },
    55698: (e, t, n) => {
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
  },
])
