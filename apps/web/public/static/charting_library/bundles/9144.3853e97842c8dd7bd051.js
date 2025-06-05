;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9144],
  {
    281026: (e) => {
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
    330930: (e) => {
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
    982434: (e) => {
      e.exports = { scrollWrap: 'scrollWrap-FaOvTD2r' }
    },
    977253: (e) => {
      e.exports = {
        wrap: 'wrap-vSb6C0Bj',
        'wrap--horizontal': 'wrap--horizontal-vSb6C0Bj',
        bar: 'bar-vSb6C0Bj',
        barInner: 'barInner-vSb6C0Bj',
        'barInner--horizontal': 'barInner--horizontal-vSb6C0Bj',
        'bar--horizontal': 'bar--horizontal-vSb6C0Bj',
      }
    },
    723490: (e) => {
      e.exports = {
        dropTargetInside: 'dropTargetInside-e_nPSSdZ',
        dropTarget: 'dropTarget-e_nPSSdZ',
        before: 'before-e_nPSSdZ',
        after: 'after-e_nPSSdZ',
      }
    },
    875564: (e) => {
      e.exports = {
        wrap: 'wrap-IEe5qpW4',
        selected: 'selected-IEe5qpW4',
        childOfSelected: 'childOfSelected-IEe5qpW4',
        disabled: 'disabled-IEe5qpW4',
        expandHandle: 'expandHandle-IEe5qpW4',
        expanded: 'expanded-IEe5qpW4',
      }
    },
    376106: (e) => {
      e.exports = {
        separator: 'separator-MgF6KBas',
        tree: 'tree-MgF6KBas',
        overlayScrollWrap: 'overlayScrollWrap-MgF6KBas',
        listContainer: 'listContainer-MgF6KBas',
      }
    },
    186928: (e) => {
      e.exports = {
        button: 'button-w6lVe_oI',
        hovered: 'hovered-w6lVe_oI',
        disabled: 'disabled-w6lVe_oI',
      }
    },
    380327: (e, t, n) => {
      n.d(t, { ControlGroupContext: () => r })
      const r = n(50959).createContext({
        isGrouped: !1,
        cellState: { isTop: !0, isRight: !0, isBottom: !0, isLeft: !0 },
      })
    },
    331774: (e, t, n) => {
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
    34735: (e, t, n) => {
      n.d(t, { ControlSkeleton: () => m, InputClasses: () => E })
      var r = n(50959),
        o = n(497754),
        s = n(650151),
        l = n(525388),
        i = n(800417),
        c = n(380327),
        d = n(331774)
      var a = n(281026),
        u = n.n(a)
      function f(e) {
        let t = ''
        return (
          0 !== e &&
            (1 & e && (t = o(t, u()['no-corner-top-left'])),
            2 & e && (t = o(t, u()['no-corner-top-right'])),
            4 & e && (t = o(t, u()['no-corner-bottom-right'])),
            8 & e && (t = o(t, u()['no-corner-bottom-left']))),
          t
        )
      }
      function p(e, t, n, r) {
        const {
            removeRoundBorder: s,
            className: l,
            intent: i = 'default',
            borderStyle: c = 'thin',
            size: a,
            highlight: p,
            disabled: h,
            readonly: E,
            stretch: S,
            noReadonlyStyles: g,
            isFocused: m,
          } = e,
          v = f(null != s ? s : (0, d.getGroupCellRemoveRoundBorders)(n))
        return o(
          u().container,
          u()[`container-${a}`],
          u()[`intent-${i}`],
          u()[`border-${c}`],
          a && u()[`size-${a}`],
          v,
          p && u()['with-highlight'],
          h && u().disabled,
          E && !g && u().readonly,
          m && u().focused,
          S && u().stretch,
          t && u().grouped,
          !r && u()['adjust-position'],
          n.isTop && u()['first-row'],
          n.isLeft && u()['first-col'],
          l,
        )
      }
      function h(e, t, n) {
        const { highlight: r, highlightRemoveRoundBorder: s } = e
        if (!r) return u().highlight
        const l = f(null != s ? s : (0, d.getGroupCellRemoveRoundBorders)(t))
        return o(u().highlight, u().shown, u()[`size-${n}`], l)
      }
      const E = {
          FontSizeMedium: (0, s.ensureDefined)(u()['font-size-medium']),
          FontSizeLarge: (0, s.ensureDefined)(u()['font-size-large']),
        },
        S = { passive: !1 }
      function g(e, t) {
        const {
            style: n,
            id: o,
            role: s,
            onFocus: d,
            onBlur: a,
            onMouseOver: u,
            onMouseOut: f,
            onMouseDown: E,
            onMouseUp: g,
            onKeyDown: m,
            onClick: v,
            tabIndex: T,
            startSlot: D,
            middleSlot: N,
            endSlot: I,
            onWheel: y,
            onWheelNoPassive: R = null,
            size: C,
          } = e,
          {
            isGrouped: _,
            cellState: b,
            disablePositionAdjustment: P = !1,
          } = (0, r.useContext)(c.ControlGroupContext),
          L = ((e, t = null, n) => {
            const o = (0, r.useRef)(null),
              s = (0, r.useRef)(null),
              l = (0, r.useCallback)(() => {
                if (null === o.current || null === s.current) return
                const [e, t, n] = s.current
                null !== t && o.current.addEventListener(e, t, n)
              }, []),
              i = (0, r.useCallback)(() => {
                if (null === o.current || null === s.current) return
                const [e, t, n] = s.current
                null !== t && o.current.removeEventListener(e, t, n)
              }, []),
              c = (0, r.useCallback)((e) => {
                i(), (o.current = e), l()
              }, [])
            return (
              (0, r.useEffect)(
                () => ((s.current = [e, t, n]), l(), i),
                [e, t, n],
              ),
              c
            )
          })('wheel', R, S)
        return r.createElement(
          'span',
          {
            style: n,
            id: o,
            role: s,
            className: p(e, _, b, P),
            tabIndex: T,
            ref: (0, l.useMergedRefs)([t, L]),
            onFocus: d,
            onBlur: a,
            onMouseOver: u,
            onMouseOut: f,
            onMouseDown: E,
            onMouseUp: g,
            onKeyDown: m,
            onClick: v,
            onWheel: y,
            ...(0, i.filterDataProps)(e),
            ...(0, i.filterAriaProps)(e),
          },
          D,
          N,
          I,
          r.createElement('span', { className: h(e, b, C) }),
        )
      }
      g.displayName = 'ControlSkeleton'
      const m = r.forwardRef(g)
    },
    102691: (e, t, n) => {
      n.d(t, {
        AfterSlot: () => u,
        BeforeSlot: () => i,
        EndSlot: () => a,
        MiddleSlot: () => d,
        StartSlot: () => c,
      })
      var r = n(50959),
        o = n(497754),
        s = n(7236),
        l = n.n(s)
      function i(e) {
        const { className: t, children: n } = e
        return r.createElement(
          'span',
          {
            className: o(l()['before-slot'], t),
          },
          n,
        )
      }
      function c(e) {
        const {
          className: t,
          interactive: n = !0,
          icon: s = !1,
          children: i,
        } = e
        return r.createElement(
          'span',
          {
            className: o(
              l()['inner-slot'],
              n && l().interactive,
              s && l().icon,
              t,
            ),
          },
          i,
        )
      }
      function d(e) {
        const { className: t, children: n } = e
        return r.createElement(
          'span',
          { className: o(l()['inner-slot'], l()['inner-middle-slot'], t) },
          n,
        )
      }
      function a(e) {
        const {
          className: t,
          interactive: n = !0,
          icon: s = !1,
          children: i,
        } = e
        return r.createElement(
          'span',
          {
            className: o(
              l()['inner-slot'],
              n && l().interactive,
              s && l().icon,
              t,
            ),
          },
          i,
        )
      }
      function u(e) {
        const { className: t, children: n } = e
        return r.createElement(
          'span',
          { className: o(l()['after-slot'], t) },
          n,
        )
      }
    },
    654936: (e, t, n) => {
      n.d(t, { InputControl: () => m })
      var r = n(50959),
        o = n(497754),
        s = n(800417),
        l = n(269842),
        i = n(1811),
        c = n(525388),
        d = n(21778),
        a = n(383836),
        u = n(603548),
        f = n(34735),
        p = n(102691),
        h = n(330930),
        E = n.n(h)
      function S(e) {
        return !(0, s.isAriaAttribute)(e) && !(0, s.isDataAttribute)(e)
      }
      function g(e) {
        const {
            id: t,
            title: n,
            role: l,
            tabIndex: i,
            placeholder: c,
            name: d,
            type: a,
            value: u,
            defaultValue: h,
            draggable: g,
            autoComplete: m,
            autoFocus: v,
            maxLength: T,
            min: D,
            max: N,
            step: I,
            pattern: y,
            inputMode: R,
            onSelect: C,
            onFocus: _,
            onBlur: b,
            onKeyDown: P,
            onKeyUp: L,
            onKeyPress: x,
            onChange: M,
            onDragStart: O,
            size: w = 'small',
            className: F,
            inputClassName: z,
            disabled: A,
            readonly: k,
            containerTabIndex: W,
            startSlot: B,
            endSlot: U,
            reference: H,
            containerReference: Z,
            onContainerFocus: V,
            ...j
          } = e,
          G = (0, s.filterProps)(j, S),
          X = {
            ...(0, s.filterAriaProps)(j),
            ...(0, s.filterDataProps)(j),
            id: t,
            title: n,
            role: l,
            tabIndex: i,
            placeholder: c,
            name: d,
            type: a,
            value: u,
            defaultValue: h,
            draggable: g,
            autoComplete: m,
            autoFocus: v,
            maxLength: T,
            min: D,
            max: N,
            step: I,
            pattern: y,
            inputMode: R,
            onSelect: C,
            onFocus: _,
            onBlur: b,
            onKeyDown: P,
            onKeyUp: L,
            onKeyPress: x,
            onChange: M,
            onDragStart: O,
          }
        return r.createElement(f.ControlSkeleton, {
          ...G,
          disabled: A,
          readonly: k,
          tabIndex: W,
          className: o(E().container, F),
          size: w,
          ref: Z,
          onFocus: V,
          startSlot: B,
          middleSlot: r.createElement(
            p.MiddleSlot,
            null,
            r.createElement('input', {
              ...X,
              className: o(
                E().input,
                E()[`size-${w}`],
                z,
                B && E()['with-start-slot'],
                U && E()['with-end-slot'],
              ),
              disabled: A,
              readOnly: k,
              ref: H,
            }),
          ),
          endSlot: U,
        })
      }
      function m(e) {
        e = (0, d.useControl)(e)
        const {
            disabled: t,
            autoSelectOnFocus: n,
            tabIndex: o = 0,
            onFocus: s,
            onBlur: f,
            reference: p,
            containerReference: h = null,
          } = e,
          E = (0, r.useRef)(null),
          S = (0, r.useRef)(null),
          [m, v] = (0, a.useFocus)(),
          T = t ? void 0 : m ? -1 : o,
          D = t ? void 0 : m ? o : -1,
          {
            isMouseDown: N,
            handleMouseDown: I,
            handleMouseUp: y,
          } = (0, u.useIsMouseDown)(),
          R = (0, l.createSafeMulticastEventHandler)(
            v.onFocus,
            (e) => {
              n && !N.current && (0, i.selectAllContent)(e.currentTarget)
            },
            s,
          ),
          C = (0, l.createSafeMulticastEventHandler)(v.onBlur, f),
          _ = (0, r.useCallback)(
            (e) => {
              ;(E.current = e),
                p &&
                  ('function' == typeof p && p(e),
                  'object' == typeof p && (p.current = e))
            },
            [E, p],
          )
        return r.createElement(g, {
          ...e,
          isFocused: m,
          containerTabIndex: T,
          tabIndex: D,
          onContainerFocus: (e) => {
            S.current === e.target && null !== E.current && E.current.focus()
          },
          onFocus: R,
          onBlur: C,
          reference: _,
          containerReference: (0, c.useMergedRefs)([S, h]),
          onMouseDown: I,
          onMouseUp: y,
        })
      }
    },
    21778: (e, t, n) => {
      n.d(t, { useControl: () => s })
      var r = n(269842),
        o = n(383836)
      function s(e) {
        const {
            onFocus: t,
            onBlur: n,
            intent: s,
            highlight: l,
            disabled: i,
          } = e,
          [c, d] = (0, o.useFocus)(void 0, i),
          a = (0, r.createSafeMulticastEventHandler)(i ? void 0 : d.onFocus, t),
          u = (0, r.createSafeMulticastEventHandler)(i ? void 0 : d.onBlur, n)
        return {
          ...e,
          intent: s || (c ? 'primary' : 'default'),
          highlight: null != l ? l : c,
          onFocus: a,
          onBlur: u,
        }
      }
    },
    383836: (e, t, n) => {
      n.d(t, { useFocus: () => o })
      var r = n(50959)
      function o(e, t) {
        const [n, o] = (0, r.useState)(!1)
        ;(0, r.useEffect)(() => {
          t && n && o(!1)
        }, [t, n])
        const s = {
          onFocus: (0, r.useCallback)(
            (t) => {
              ;(void 0 !== e && e.current !== t.target) || o(!0)
            },
            [e],
          ),
          onBlur: (0, r.useCallback)(
            (t) => {
              ;(void 0 !== e && e.current !== t.target) || o(!1)
            },
            [e],
          ),
        }
        return [n, s]
      }
    },
    603548: (e, t, n) => {
      n.d(t, { useIsMouseDown: () => o })
      var r = n(50959)
      function o() {
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
    525388: (e, t, n) => {
      n.d(t, { useMergedRefs: () => s })
      var r = n(50959),
        o = n(273388)
      function s(e) {
        return (0, r.useCallback)((0, o.mergeRefs)(e), e)
      }
    },
    1811: (e, t, n) => {
      function r(e) {
        null !== e && e.setSelectionRange(0, e.value.length)
      }
      n.d(t, { selectAllContent: () => r })
    },
    73288: (e, t, n) => {
      n.d(t, { OverlayScrollContainer: () => E })
      var r = n(50959),
        o = n(497754),
        s = n.n(o),
        l = n(710263),
        i = n(650151),
        c = n(44681)
      const d = n(977253),
        a = {
          0: {
            isHorizontal: !1,
            isNegative: !1,
            sizePropName: 'height',
            minSizePropName: 'minHeight',
            startPointPropName: 'top',
            currentMousePointPropName: 'clientY',
            progressBarTransform: 'translateY',
          },
          1: {
            isHorizontal: !0,
            isNegative: !1,
            sizePropName: 'width',
            minSizePropName: 'minWidth',
            startPointPropName: 'left',
            currentMousePointPropName: 'clientX',
            progressBarTransform: 'translateX',
          },
          2: {
            isHorizontal: !0,
            isNegative: !0,
            sizePropName: 'width',
            minSizePropName: 'minWidth',
            startPointPropName: 'right',
            currentMousePointPropName: 'clientX',
            progressBarTransform: 'translateX',
          },
        },
        u = 40
      function f(e) {
        const {
            size: t,
            scrollSize: n,
            clientSize: o,
            scrollProgress: l,
            onScrollProgressChange: f,
            scrollMode: p,
            theme: h = d,
            onDragStart: E,
            onDragEnd: S,
            minBarSize: g = u,
          } = e,
          m = (0, r.useRef)(null),
          v = (0, r.useRef)(null),
          [T, D] = (0, r.useState)(!1),
          N = (0, r.useRef)(0),
          {
            isHorizontal: I,
            isNegative: y,
            sizePropName: R,
            minSizePropName: C,
            startPointPropName: _,
            currentMousePointPropName: b,
            progressBarTransform: P,
          } = a[p]
        ;(0, r.useEffect)(() => {
          const e = (0, i.ensureNotNull)(m.current).ownerDocument
          return (
            T
              ? (E && E(),
                e &&
                  (e.addEventListener('mousemove', k),
                  e.addEventListener('mouseup', W)))
              : S && S(),
            () => {
              e &&
                (e.removeEventListener('mousemove', k),
                e.removeEventListener('mouseup', W))
            }
          )
        }, [T])
        const L = t / n || 0,
          x = o * L || 0,
          M = Math.max(x, g),
          O = (t - M) / (t - x),
          w = n - t,
          F = y ? -w : 0,
          z = y ? 0 : w,
          A = U((0, c.clamp)(l, F, z)) || 0
        return r.createElement(
          'div',
          {
            ref: m,
            className: s()(h.wrap, I && h['wrap--horizontal']),
            style: { [R]: t },
            onMouseDown: (e) => {
              if (e.isDefaultPrevented()) return
              e.preventDefault()
              const t = B(e.nativeEvent, (0, i.ensureNotNull)(m.current)),
                n = Math.sign(t),
                r = (0, i.ensureNotNull)(v.current).getBoundingClientRect()
              N.current = (n * r[R]) / 2
              let o = Math.abs(t) - Math.abs(N.current)
              const s = U(w)
              o < 0
                ? ((o = 0), (N.current = t))
                : o > s && ((o = s), (N.current = t - n * s))
              f(H(n * o)), D(!0)
            },
          },
          r.createElement(
            'div',
            {
              ref: v,
              className: s()(h.bar, I && h['bar--horizontal']),
              style: { [C]: g, [R]: M, transform: `${P}(${A}px)` },
              onMouseDown: (e) => {
                e.preventDefault(),
                  (N.current = B(
                    e.nativeEvent,
                    (0, i.ensureNotNull)(v.current),
                  )),
                  D(!0)
              },
            },
            r.createElement('div', {
              className: s()(h.barInner, I && h['barInner--horizontal']),
            }),
          ),
        )
        function k(e) {
          const t = B(e, (0, i.ensureNotNull)(m.current)) - N.current
          f(H(t))
        }
        function W() {
          D(!1)
        }
        function B(e, t) {
          const n = t.getBoundingClientRect()[_]
          return e[b] - n
        }
        function U(e) {
          return e * L * O
        }
        function H(e) {
          return e / L / O
        }
      }
      var p = n(522224),
        h = n(982434)
      function E(e) {
        const {
            reference: t,
            className: n,
            containerHeight: s = 0,
            containerWidth: i = 0,
            contentHeight: c = 0,
            contentWidth: d = 0,
            scrollPosTop: a = 0,
            scrollPosLeft: u = 0,
            onVerticalChange: E,
            onHorizontalChange: S,
            visible: g,
          } = e,
          [m, v] = (0, p.useHover)(),
          [T, D] = (0, r.useState)(!1),
          N = s < c,
          I = i < d,
          y = N && I ? 8 : 0
        return r.createElement(
          'div',
          {
            ...v,
            ref: t,
            className: o(n, h.scrollWrap),
            style: { visibility: g || m || T ? 'visible' : 'hidden' },
          },
          N &&
            r.createElement(f, {
              size: s - y,
              scrollSize: c - y,
              clientSize: s - y,
              scrollProgress: a,
              onScrollProgressChange: (e) => {
                E && E(e)
              },
              onDragStart: R,
              onDragEnd: C,
              scrollMode: 0,
            }),
          I &&
            r.createElement(f, {
              size: i - y,
              scrollSize: d - y,
              clientSize: i - y,
              scrollProgress: u,
              onScrollProgressChange: (e) => {
                S && S(e)
              },
              onDragStart: R,
              onDragEnd: C,
              scrollMode: (0, l.isRtl)() ? 2 : 1,
            }),
        )
        function R() {
          D(!0)
        }
        function C() {
          D(!1)
        }
      }
    },
    535842: (e, t, n) => {
      n.d(t, { SizeContext: () => r })
      const r = n(50959).createContext({ size: 0, smallSizeTreeNodeAction: 1 })
    },
    849392: (e, t, n) => {
      n.d(t, {
        dropSelection: () => f,
        endDrag: () => y,
        hideDropTarget: () => h,
        moveNodes: () => S,
        multiSelectNext: () => a,
        multiSelectPrevious: () => d,
        processDropTarget: () => u,
        resetTree: () => o,
        scrollToId: () => T,
        selectNext: () => c,
        selectPrevious: () => i,
        setDisabledNodes: () => I,
        setFocusedNode: () => v,
        setIsExpanded: () => N,
        setIsSelected: () => D,
        setNodes: () => l,
        setSelectedIds: () => E,
        startMultiSelect: () => g,
        stopMultiSelect: () => m,
        syncNodes: () => s,
        updateDropTarget: () => p,
      })
      var r = n(471505)
      const o = () => ({ type: r.RESET_TREE }),
        s = (e) => ({ type: r.SYNC_NODES, nodes: e }),
        l = (e) => ({ type: r.SET_NODES, nodes: e }),
        i = () => ({ type: r.SELECT_PREVIOUS }),
        c = () => ({ type: r.SELECT_NEXT }),
        d = () => ({ type: r.MULTI_SELECT_PREVIOUS }),
        a = () => ({ type: r.MULTI_SELECT_NEXT }),
        u = (e, t, n, o, s) => ({
          type: r.PROCESS_DROP_TARGET,
          dropTarget: e,
          dropType: t,
          isHoveredLeft: n,
          boundBox: o,
          isLastChild: s,
        }),
        f = () => ({ type: r.DROP_SELECTION }),
        p = (e, t, n) => ({
          type: r.UPDATE_DROP_TARGET,
          node: e,
          dropType: t,
          boundBox: n,
        }),
        h = () => ({ type: r.HIDE_DROP_TARGET }),
        E = (e) => ({ type: r.SET_SELECTED_IDS, ids: e }),
        S = (e, t, n) => ({
          type: r.MOVE_NODES,
          ids: e,
          targetId: t,
          dropType: n,
        }),
        g = () => ({ type: r.START_MULTI_SELECT }),
        m = () => ({ type: r.STOP_MULTI_SELECT }),
        v = (e) => ({ type: r.SET_FOCUSED_NODE, nodeId: e }),
        T = (e) => ({ type: r.SCROLL_TO_ID, nodeId: e }),
        D = (e, t, n = 0) => ({
          type: r.SET_IS_SELECTED,
          nodeId: e,
          isSelected: t,
          mode: n,
        }),
        N = (e, t) => ({ type: r.SET_IS_EXPANDED, nodeId: e, isExpanded: t }),
        I = (e) => ({ type: r.SET_DISABLED_NODES, ids: e }),
        y = () => ({ type: r.END_DRAG })
    },
    471505: (e, t, n) => {
      n.d(t, {
        DROP_SELECTION: () => a,
        END_DRAG: () => C,
        HIDE_DROP_TARGET: () => g,
        MOVE_NODES: () => R,
        MULTI_SELECT_NEXT: () => h,
        MULTI_SELECT_PREVIOUS: () => p,
        PROCESS_DROP_TARGET: () => E,
        RESET_TREE: () => c,
        SCROLL_TO_ID: () => D,
        SELECT_NEXT: () => f,
        SELECT_PREVIOUS: () => u,
        SET_DISABLED_NODES: () => y,
        SET_FOCUSED_NODE: () => T,
        SET_IS_EXPANDED: () => I,
        SET_IS_SELECTED: () => N,
        SET_NODES: () => o,
        SET_SELECTED_IDS: () => d,
        START_MULTI_SELECT: () => m,
        STOP_MULTI_SELECT: () => v,
        SYNC_NODES: () => s,
        UPDATE_DROP_TARGET: () => S,
        UPDATE_NODE: () => l,
        UPDATE_NODES: () => i,
      })
      const r = (0, n(215078).createActionTypeFactory)('OBJECT_TREE'),
        o = r('SET_NODES'),
        s = r('SYNC_NODES'),
        l = r('UPDATE_NODE'),
        i = r('UPDATE_NODES'),
        c = r('RESET_TREE'),
        d = r('SET_SELECTED_IDS'),
        a = r('DROP_SELECTION'),
        u = r('SELECT_PREVIOUS'),
        f = r('SELECT_NEXT'),
        p = r('MULTI_SELECT_PREVIOUS'),
        h = r('MULTI_SELECT_NEXT'),
        E = r('PROCESS_DROP_TARGET'),
        S = r('UPDATE_DROP_TARGET'),
        g = r('HIDE_DROP_TARGET'),
        m = r('START_MULTI_SELECT'),
        v = r('STOP_MULTI_SELECT'),
        T = (r('REMOVE_NODE'), r('SET_FOCUSED_NODE')),
        D = r('SCROLL_TO_ID'),
        N = r('SET_IS_SELECTED'),
        I = r('SET_IS_EXPANDED'),
        y = r('SET_DISABLED_NODES'),
        R = r('MOVE_NODES'),
        C = (r('START_DRAG'), r('END_DRAG'))
    },
    129881: (e, t, n) => {
      n.d(t, {
        dropTargetSelector: () => i,
        isDisabledSelector: () => h,
        isExpandedSelector: () => p,
        isMultiSelectingSelector: () => m,
        isSelectedSelector: () => f,
        lastFocusedNodeIdSelector: () => g,
        nodeIdsSelector: () => E,
        nodeSelector: () => u,
        nodesSelector: () => s,
        orderedNodesSelector: () => D,
        renderDragListSelector: () => y,
        renderListSelector: () => I,
        scrollToIdSelector: () => d,
        selectedIdsSelector: () => S,
        selectedNodesSelector: () => v,
      })
      var r = n(377145),
        o = n(650151)
      const s = (e) => e.nodes,
        l = (e) => e.selection,
        i = (e) => e.dropTarget,
        c = (e) => e.expanded,
        d = (e) => e.scrollToId,
        a = (e, t) => t,
        u = (0, r.createSelector)([s, a], (e, t) => e[t]),
        f = (0, r.createSelector)([l, a], (e, t) => e.ids.includes(t)),
        p = (0, r.createSelector)([c, a], (e, t) => e.includes(t)),
        h = (0, r.createSelector)(
          [(e) => e.disabled, l, a],
          (e, t, n) => !t.ids.includes(n) && e.includes(n),
        ),
        E = (0, r.createSelector)(s, (e) => Object.keys(e)),
        S = (0, r.createSelector)(l, ({ ids: e }) => e),
        g = (0, r.createSelector)(l, ({ lastFocusedNodeId: e }) => e),
        m = (0, r.createSelector)(l, ({ isMultiSelecting: e }) => e),
        v = (0, r.createSelector)([s, S], (e, t) => t.map((t) => e[t])),
        T = (0, r.createSelector)(s, (e) =>
          Object.values(e).filter((e) => 0 === e.level),
        ),
        D = (0, r.createSelector)([s, T], (e, t) =>
          t.reduce((t, n) => [...t, ...N(e, (0, o.ensureDefined)(n))], []),
        )
      function N(e, t) {
        const n = []
        for (const r of t.children) n.push(e[r]), n.push(...N(e, e[r]))
        return n
      }
      const I = (0, r.createSelector)([s, T, c], (e, t, n) => {
          const r = new Set(n)
          return t.reduce(
            (t, n) => [...t, ...R(e, (0, o.ensureDefined)(n), r)],
            [],
          )
        }),
        y = (0, r.createSelector)([s, S, c], (e, t, n) => {
          const r = new Set(n)
          return [{ id: 'drag-list', level: -1, children: t }].reduce(
            (t, n) => [...t, ...R(e, (0, o.ensureDefined)(n), r)],
            [],
          )
        })
      function R(e, t, n) {
        const r = []
        for (const o of t.children) {
          const t = e[o]
          void 0 !== t && (r.push(t), n.has(o) && r.push(...R(e, t, n)))
        }
        return r
      }
    },
    451539: (e, t, n) => {
      n.d(t, { getInsertIndex: () => l, logger: () => s })
      var r = n(6835),
        o = n(650151)
      const s = (0, r.getLogger)('Platform.GUI.ObjectTree.CallApi'),
        l = (e, t, n) => {
          switch (n) {
            case 'before':
              return e.indexOf((0, o.ensureDefined)(t))
            case 'inside':
              return e.length
            case 'after':
              return e.indexOf((0, o.ensureDefined)(t)) + 1
            default:
              return 0
          }
        }
    },
    317447: (e, t, n) => {
      n.d(t, { Tree: () => Pe })
      var r = n(50959),
        o = n(254773),
        s = n(386942),
        l = n(10170),
        i = n(207809),
        c = n(23642),
        d = n(336349),
        a = n(471505),
        u = n(849392),
        f = n(129881)
      function* p(e) {
        const { selectedIds: t, nodes: n } = yield (0, d.call)(e),
          r = {}
        for (let e = 0; e < n.length; ++e) {
          const t = n[e]
          r[t.id] = t
        }
        yield (0, d.put)((0, u.setNodes)(r)),
          yield (0, d.put)((0, u.setSelectedIds)(t))
        !(0, f.lastFocusedNodeIdSelector)(yield (0, d.select)()) &&
          t.length > 0 &&
          (yield (0, d.put)((0, u.setFocusedNode)(t[0])),
          yield (0, d.put)((0, u.scrollToId)(t[0])))
      }
      var h = n(650151)
      function* E(e) {
        for (;;) {
          if (
            (yield (0, d.take)([a.START_MULTI_SELECT, a.STOP_MULTI_SELECT]))
              .type === a.START_MULTI_SELECT
          ) {
            const t = (0, f.nodeIdsSelector)(yield (0, d.select)()).filter(
              (t) => !e(t),
            )
            yield (0, d.put)((0, u.setDisabledNodes)(t))
          } else yield (0, d.put)((0, u.setDisabledNodes)([]))
        }
      }
      function* S() {
        for (;;) {
          const { type: e } = yield (0, d.take)([
              a.MULTI_SELECT_NEXT,
              a.MULTI_SELECT_PREVIOUS,
            ]),
            t = yield (0, d.select)(),
            n = (0, f.orderedNodesSelector)(t),
            r = n.length,
            o = (0, f.lastFocusedNodeIdSelector)(t),
            s = [...(0, f.selectedIdsSelector)(t)],
            l = 1 === s.length && s[0] !== o,
            i = n.findIndex((e) => e.id === (l ? s[0] : o))
          if (
            (e === a.MULTI_SELECT_PREVIOUS && 0 === i) ||
            (e === a.MULTI_SELECT_NEXT && i === r - 1)
          )
            continue
          const c = I(t, e === a.MULTI_SELECT_NEXT ? 'next' : 'previous', n, i),
            { id: p } = c
          s.includes(p) && o
            ? (yield (0, d.put)((0, u.setIsSelected)(o, !1, 1)),
              yield (0, d.put)((0, u.setFocusedNode)(p)))
            : yield (0, d.put)((0, u.setIsSelected)(p, !0, 1)),
            yield (0, d.put)((0, u.scrollToId)(p))
        }
      }
      function* g(e, t) {
        for (;;) {
          const { type: n } = yield (0, d.take)([
              a.SELECT_NEXT,
              a.SELECT_PREVIOUS,
            ]),
            r = yield (0, d.select)(),
            o = (0, f.orderedNodesSelector)(r),
            s = (0, f.selectedNodesSelector)(r),
            l = (0, f.lastFocusedNodeIdSelector)(r)
          if (1 === s.length && s[0].id !== l && !l) {
            if (n === a.SELECT_NEXT) {
              yield (0, d.put)((0, u.setFocusedNode)(s[0].id))
              continue
            }
            if (n === a.SELECT_PREVIOUS) {
              const e = o.findIndex((e) => e.id === s[0].id),
                t = I(r, 'previous', o, e)
              yield (0, d.put)((0, u.setFocusedNode)(t.id))
              continue
            }
          }
          const i = o.findIndex((e) => e.id === l),
            c = n === a.SELECT_NEXT ? 'next' : 'previous',
            p = I(r, c, o, i),
            { id: h } = p
          e ? e([h], c) : yield (0, d.put)((0, u.setSelectedIds)([h])),
            t && t(h),
            yield (0, d.put)((0, u.setFocusedNode)(h))
        }
      }
      function* m(e, t = () => !0) {
        for (;;) {
          const {
            mode: n,
            nodeId: r,
            isSelected: o,
          } = yield (0, d.take)(a.SET_IS_SELECTED)
          let s = [...(0, f.selectedIdsSelector)(yield (0, d.select)())]
          const l = (0, f.orderedNodesSelector)(yield (0, d.select)())
          if (1 === n) o ? s.push(r) : s.splice(s.indexOf(r), 1)
          else if (2 === n && s.length > 0) {
            const e = (0, f.lastFocusedNodeIdSelector)(yield (0, d.select)())
            let n = l.findIndex((t) => t.id === e)
            ;-1 === n &&
              (n = l.reduce((e, t, n) => (s.includes(t.id) ? n : e), -1))
            const o = l.findIndex((e) => e.id === r)
            if (n !== o)
              for (let e = Math.min(n, o); e <= Math.max(n, o); e++) {
                const n = l[e].id
                !s.includes(n) && t(n) && s.push(n)
              }
          } else s = r ? [r] : []
          const i = new Set(s)
          ;(s = l.reduce((e, t) => (i.has(t.id) && e.push(t.id), e), [])),
            e ? e(s) : yield (0, d.put)((0, u.setSelectedIds)(s)),
            yield (0, d.put)((0, u.setFocusedNode)(r))
        }
      }
      function* v(e = () => !0, t) {
        const {
            dropTarget: n,
            dropType: r,
            isHoveredLeft: o,
            boundBox: s,
            isLastChild: l,
          } = t,
          i = (0, f.dropTargetSelector)(yield (0, d.select)()),
          c = (0, f.nodeSelector)(
            yield (0, d.select)(),
            (0, h.ensureDefined)(n.parentId),
          ),
          a = l && 'after' === r,
          p = (0, f.selectedNodesSelector)(yield (0, d.select)()),
          E = !a || (!o && e(p, n, r)) ? n : c,
          S = (i.node && i.node.id !== E.id) || i.dropType !== r
        p.map((e) => e.id).includes(E.id)
          ? yield (0, d.put)((0, u.hideDropTarget)())
          : S &&
            e(p, E, r) &&
            (yield (0, d.put)((0, u.updateDropTarget)(E, r, s)))
      }
      function* T(e) {
        yield (0, d.throttle)(0, a.PROCESS_DROP_TARGET, v, e)
      }
      function* D(e) {
        for (;;) {
          yield (0, d.take)(a.DROP_SELECTION)
          const t = (0, f.selectedNodesSelector)(yield (0, d.select)()),
            { node: n, dropType: r } = (0, f.dropTargetSelector)(
              yield (0, d.select)(),
            )
          if (n && r) {
            const o = new CustomEvent('tree-node-drop', {
              detail: { nodes: t, target: n.id, type: r },
            })
            if ((e && e(o), !o.defaultPrevented)) {
              const e = (0, f.selectedIdsSelector)(yield (0, d.select)())
              yield (0, d.put)((0, u.moveNodes)(e, n.id, r))
            }
          }
        }
      }
      function* N(e) {
        for (;;) {
          yield (0, d.take)(a.MOVE_NODES)
          e((0, f.nodesSelector)(yield (0, d.select)()))
        }
      }
      function I(e, t, n, r) {
        const o = n.length
        let s
        ;-1 === r && 'previous' === t && (r = o)
        let l = 0
        while (
          !s ||
          (Math.abs(l) < o &&
            (i = s).level > 1 &&
            !(0, f.isExpandedSelector)(e, (0, h.ensureDefined)(i.parentId)))
        )
          (l += 'next' === t ? 1 : -1), (s = n[(r + l + o) % o])
        var i
        return s
      }
      function* y(e = {}) {
        const {
            saga: t,
            onDrop: n,
            canMove: r,
            onMove: o,
            onSelect: s,
            onKeyboardSelect: l,
            initState: i,
            canBeAddedToSelection: c,
          } = e,
          u = [
            (0, d.fork)(T, r),
            (0, d.fork)(D, n),
            (0, d.fork)(m, s, c),
            (0, d.fork)(g, s, l),
            (0, d.fork)(S),
          ]
        for (
          t && u.push((0, d.fork)(t)),
            o && u.push((0, d.fork)(N, o)),
            c && u.push((0, d.fork)(E, c));
          ;
        ) {
          i && (yield (0, d.call)(p, i))
          const e = yield (0, d.all)(u)
          yield (0, d.take)(a.RESET_TREE)
          for (const t of e) yield (0, d.cancel)(t)
        }
      }
      var R = n(691622),
        C = n(372605),
        _ = n(451539)
      const b = { ids: [], lastFocusedNodeId: void 0, isMultiSelecting: !1 }
      const P = { node: void 0, dropType: void 0, boundBox: void 0 }
      const L = (0, R.combineReducers)({
        nodes: (e = {}, t) => {
          switch (t.type) {
            case a.SET_NODES:
              return t.nodes
            case a.SYNC_NODES: {
              const { nodes: n } = t,
                r = n.map((e) => e.id),
                o = { ...e }
              for (const t of Object.keys(e))
                if (!r.includes(t)) {
                  const { parentId: e } = o[t]
                  e &&
                    (o[e] = {
                      ...o[e],
                      children: o[e].children.filter((e) => e !== t),
                    }),
                    delete o[t]
                }
              for (const e of n) {
                const t = e.id
                if (Object.hasOwn(o, t)) {
                  !(0, C.deepEquals)(o[t].children, e.children)[0] &&
                    (o[t] = { ...o[t], children: [...e.children] })
                } else {
                  o[t] = e
                  const { parentId: n } = e
                  if (n && !o[n].children.includes(t))
                    throw new Error('Not implemented')
                }
              }
              return o
            }
            case a.UPDATE_NODE: {
              const { type: n, nodeId: r, ...o } = t
              return { ...e, [r]: { ...e[r], ...o } }
            }
            case a.UPDATE_NODES: {
              const { nodes: n } = t,
                r = { ...e }
              return (
                Object.keys(n).forEach((e) => {
                  r[e] = { ...r[e], ...n[e] }
                }),
                { ...e, ...r }
              )
            }
            case a.MOVE_NODES: {
              const { ids: n, targetId: r, dropType: o } = t,
                s = (0, h.ensureDefined)(e[r].parentId),
                l = e[s],
                i = {}
              for (const t of n) {
                const n = e[t]
                if (n.parentId) {
                  const r = i[n.parentId] || e[n.parentId]
                  i[n.parentId] = {
                    ...r,
                    children: r.children.filter((e) => e !== t),
                  }
                }
                i[t] = { ...n, parentId: s, level: l.level + 1 }
              }
              const c = l.children.filter((e) => !n.includes(e))
              return (
                c.splice((0, _.getInsertIndex)(c, r, o), 0, ...n),
                (i[s] = { ...e[s], children: c, isExpanded: !0 }),
                { ...e, ...i }
              )
            }
            default:
              return e
          }
        },
        selection: (e = b, t) => {
          switch (t.type) {
            case a.SET_SELECTED_IDS: {
              const { ids: n } = t
              return {
                ...e,
                ids: n,
                lastFocusedNodeId: n.length > 0 ? e.lastFocusedNodeId : void 0,
              }
            }
            case a.START_MULTI_SELECT:
              return { ...e, isMultiSelecting: !0 }
            case a.STOP_MULTI_SELECT:
              return { ...e, isMultiSelecting: !1 }
            case a.SET_FOCUSED_NODE:
              return { ...e, lastFocusedNodeId: t.nodeId }
            case a.SYNC_NODES: {
              const n = new Set(t.nodes.map((e) => e.id))
              return (
                e.lastFocusedNodeId &&
                  !n.has(e.lastFocusedNodeId) &&
                  delete e.lastFocusedNodeId,
                { ...e, ids: e.ids.filter((e) => n.has(e)) }
              )
            }
            default:
              return e
          }
        },
        dropTarget: (e = P, t) => {
          switch (t.type) {
            case a.UPDATE_DROP_TARGET: {
              const { node: n, dropType: r, boundBox: o } = t
              return { ...e, node: n, dropType: r, boundBox: o }
            }
            case a.HIDE_DROP_TARGET:
            case a.END_DRAG:
            case a.RESET_TREE:
              return { ...P }
            default:
              return e
          }
        },
        expanded: (e = [], t) => {
          if (t.type === a.SET_IS_EXPANDED) {
            const { nodeId: n, isExpanded: r } = t
            if (r) return [...e, n]
            const o = [...e]
            return o.splice(e.indexOf(n), 1), o
          }
          return e
        },
        disabled: (e = [], t) =>
          t.type === a.SET_DISABLED_NODES ? [...t.ids] : e,
        scrollToId: (e = null, t) =>
          t.type === a.SCROLL_TO_ID
            ? null === t.nodeId
              ? null
              : { id: t.nodeId }
            : e,
      })
      var x = n(497754),
        M = n.n(x),
        O = n(240933),
        w = n(220037),
        F = n(601227)
      var z = n(42357),
        A = n(298314),
        k = n(72571),
        W = n(180185),
        B = n(269842),
        U = n(522224),
        H = n(535842)
      const Z = { [W.Modifiers.Mod]: 1, [W.Modifiers.Shift]: 2 }
      var V = n(569533),
        j = n(875564)
      const G = () => {}
      class X extends r.PureComponent {
        constructor() {
          super(...arguments),
            (this._ref = null),
            (this._handleRef = (e) => {
              this._ref = e
              const {
                connectDragSource: t,
                connectDropTarget: n,
                connectDragPreview: r,
              } = this.props
              ;(0, h.ensureDefined)(n)(this._ref),
                (0, h.ensureDefined)(t)(this._ref),
                (0, h.ensureDefined)(r)((0, A.getEmptyImage)(), {
                  captureDraggingState: !0,
                })
            }),
            (this._handleTouchStart = (e) => {
              const t = (e, t) => {
                  const n = ((e, t) => {
                    try {
                      const n = document.createEvent('TouchEvent')
                      return (
                        n.initTouchEvent(
                          e,
                          !0,
                          void 0,
                          void 0,
                          void 0,
                          void 0,
                          void 0,
                          void 0,
                          void 0,
                          void 0,
                          void 0,
                          void 0,
                          void 0,
                          t.touches,
                          t.targetTouches,
                          t.changedTouches,
                        ),
                        n
                      )
                    } catch (e) {
                      return null
                    }
                  })(e, t)
                  if (n) return n
                  const r = Array.from(t.changedTouches),
                    o = Array.from(t.touches),
                    s = Array.from(t.targetTouches)
                  return new TouchEvent(e, {
                    bubbles: !0,
                    changedTouches: r,
                    touches: o,
                    targetTouches: s,
                  })
                },
                n = e.target
              if (n instanceof Element) {
                const e = (e) => {
                    const r = e
                    if (!n.isConnected) {
                      r.preventDefault()
                      const e = t('touchmove', r)
                      document.body.dispatchEvent(e)
                    }
                  },
                  r = (o) => {
                    const s = o
                    if (!n.isConnected) {
                      s.preventDefault()
                      const e = t('touchend', s)
                      document.body.dispatchEvent(e)
                    }
                    n.removeEventListener('touchend', r),
                      n.removeEventListener('touchmove', e)
                  }
                n.addEventListener('touchend', r),
                  n.addEventListener('touchmove', e)
              }
            })
        }
        componentDidMount() {
          var e
          null === (e = this._ref) ||
            void 0 === e ||
            e.addEventListener('touchstart', this._handleTouchStart)
        }
        componentWillUnmount() {
          var e
          null === (e = this._ref) ||
            void 0 === e ||
            e.removeEventListener('touchstart', this._handleTouchStart)
        }
        render() {
          return r.createElement(K, {
            ...this.props,
            reference: this._handleRef,
          })
        }
        getNode() {
          return (0, h.ensureNotNull)(this._ref)
        }
      }
      const K = (e) => {
          const {
              id: t,
              isSelected: n,
              isOffset: o,
              isExpandable: s,
              setIsSelected: l,
              isDisabled: i,
              isExpanded: c,
              onClick: d,
              parentId: a,
              setIsExpanded: u,
              reference: f,
              isFirstListItem: p,
              isLastListItem: h,
              nodeRenderer: E,
              isChildOfSelected: S = !1,
            } = e,
            { size: g, smallSizeTreeNodeAction: m } = (0, r.useContext)(
              H.SizeContext,
            ),
            v = (0, r.useRef)(null),
            T = (0, B.createSafeMulticastEventHandler)(
              (e) => (v.current = e),
              f,
            )
          let [D, N] = (0, U.useHover)()
          return (
            (F.CheckMobile.any() || F.CheckMobile.isIPad()) &&
              ((D = n), (N = { onMouseOut: G, onMouseOver: G })),
            r.createElement(
              'div',
              {
                className: x(
                  j.wrap,
                  n && j.selected,
                  S && j.childOfSelected,
                  i && j.disabled,
                  s && j.expandable,
                ),
                onClick:
                  1 === g && 0 === m
                    ? I
                    : (e) => {
                        if (e.defaultPrevented) return
                        const r = Z[(0, W.modifiersFromEvent)(e)] || 0
                        !i && l && l(t, !n, r)
                        d && 0 === r && d(e, t)
                      },
                onContextMenu: I,
                ref: T,
                ...N,
              },
              s &&
                r.createElement(k.Icon, {
                  icon: V,
                  className: x(j.expandHandle, c && j.expanded),
                  onClick: (e) => {
                    e.preventDefault(), s && u(t, !c)
                  },
                  onMouseDown: (e) => {
                    e.preventDefault()
                  },
                }),
              E({
                id: t,
                isOffset: o,
                parentId: a,
                isDisabled: i,
                isSelected: n,
                isChildOfSelected: S,
                isHovered: D,
                isExpanded: c,
                isFirstListItem: p,
                isLastListItem: h,
              }),
            )
          )
          function I() {
            i || n || !l || l(t, !0)
          }
        },
        $ = r.createContext({})
      function q(e, t) {
        const { id: n } = t,
          r = (0, f.nodeSelector)(e, n),
          o = (0, f.isSelectedSelector)(e, n)
        let s = !1,
          l = r.parentId
        while (l && !s)
          (s = (0, f.isSelectedSelector)(e, l)),
            (l = (0, f.nodeSelector)(e, l).parentId)
        return {
          ...r,
          isSelected: o,
          isChildOfSelected: s,
          isExpanded: r.children.length > 0 && (0, f.isExpandedSelector)(e, n),
          isExpandable: r.children.length > 0,
          isDisabled: (0, f.isDisabledSelector)(e, n),
        }
      }
      function Y(e) {
        return (0, R.bindActionCreators)(
          {
            setIsExpanded: u.setIsExpanded,
            processDropTarget: u.processDropTarget,
            dropSelection: u.dropSelection,
            selectNext: u.selectNext,
            selectPrevious: u.selectPrevious,
            setIsSelected: u.setIsSelected,
            endDrag: u.endDrag,
          },
          e,
        )
      }
      const J = (0, s.connect)(q, Y, null, { context: $ })((e) => {
          const t = (0, r.useRef)(null),
            [, n, o] = (0, z.useDrag)({
              type: 'node',
              item: (t) => {
                const { id: n, isDisabled: r, isSelected: o } = e
                return r || o || e.setIsSelected(n, !0), e
              },
              end: (e) => {
                e.endDrag()
              },
            }),
            [, s] = (0, O.useDrop)({
              accept: 'node',
              hover: (n, r) => {
                const o = t.current
                if (!o) return
                const s = o.getNode(),
                  l = s.getBoundingClientRect(),
                  i = l.bottom - l.top,
                  c = r.getClientOffset()
                if (c) {
                  const t = c.y - l.top
                  let n, r
                  if (
                    ((n =
                      0 === e.children.length
                        ? t < i / 2
                          ? 'before'
                          : 'after'
                        : t < i / 3
                          ? 'before'
                          : e.isExpanded || (t >= i / 3 && t < (2 * i) / 3)
                            ? 'inside'
                            : 'after'),
                    void 0 !== e.getContainerElement)
                  ) {
                    const t = e.getContainerElement().getBoundingClientRect()
                    r = {
                      top: l.top - t.top,
                      left: l.left - t.left,
                      bottom: l.top - t.top + l.height,
                      right: l.left - t.left + l.width,
                      height: l.height,
                      width: l.width,
                    }
                  } else
                    r = {
                      top: s.offsetTop,
                      left: s.offsetLeft,
                      bottom: s.offsetTop + s.offsetHeight,
                      right: s.offsetLeft + s.offsetWidth,
                      height: s.offsetHeight,
                      width: s.offsetWidth,
                    }
                  e.processDropTarget(e, n, c.x - l.left < 48, r, e.isLastChild)
                }
              },
            })
          return r.createElement(X, {
            ...e,
            connectDragSource: n,
            connectDropTarget: s,
            connectDragPreview: o,
            ref: t,
          })
        }),
        Q = (0, s.connect)(q, Y, null, { context: $ })(K)
      var ee = n(698043),
        te = n(85783),
        ne = n(813113)
      function re(e) {
        const t = e(),
          n = (0, r.useRef)(t)
        n.current = t
        const [o, s] = (0, r.useState)(n.current),
          l = (0, r.useRef)(null)
        return (
          (0, r.useEffect)(() => {
            null === l.current &&
              (l.current = requestAnimationFrame(() => {
                ;(l.current = null), s(n.current)
              }))
          }),
          (0, r.useEffect)(
            () => () => {
              l.current && cancelAnimationFrame(l.current)
            },
            [],
          ),
          o
        )
      }
      function oe(e) {
        const { dropTargetOffset: t, mousePosition: n } = e
        if (!t) return { display: 'none' }
        const { x: r, y: o } = t,
          s = n && t ? n.y - t.y : 0,
          l = `translate(${r + (n && t ? n.x - t.x : 0)}px, ${o + s}px)`
        return { transform: l, WebkitTransform: l }
      }
      const se = {
        top: 0,
        left: 0,
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 100,
        opacity: 0.5,
        width: 300,
        backgroundColor: 'red',
      }
      function le(e) {
        return {
          isDragging: e.isDragging() && 'node' === e.getItemType(),
          mousePosition: e.getClientOffset(),
          dropTargetOffset: e.getSourceClientOffset(),
        }
      }
      const ie = (0, s.connect)(
        (e) => ({ items: (0, f.renderDragListSelector)(e) }),
        null,
        null,
        { context: $ },
      )((e) => {
        const {
          items: t,
          isDragging: n,
          nodeRenderer: o,
          dragPreviewRenderer: s,
        } = e
        return re(() =>
          n
            ? r.createElement(
                ne.Portal,
                null,
                r.createElement(
                  'div',
                  { style: { ...se, ...oe(e) } },
                  t.map((e) => {
                    if (s) {
                      const t = s
                      return r.createElement(t, { key: e.id, ...e })
                    }
                    return r.createElement(Q, {
                      id: e.id,
                      key: e.id,
                      nodeRenderer: o,
                      isDragPreview: !0,
                      isOffset: e.level > 1,
                    })
                  }),
                ),
              )
            : null,
        )
      })
      function ce(e) {
        return r.createElement(ie, { ...e, ...(0, te.useDragLayer)(le) })
      }
      var de = n(693838),
        ae = n(73288),
        ue = n(139043)
      const fe = r.forwardRef((e, t) => {
        const n = (0, r.useRef)(null)
        return (
          e.connectDropTarget(n),
          (0, r.useImperativeHandle)(
            t,
            () => ({ getNode: () => (0, h.ensureNotNull)(n.current) }),
            [],
          ),
          r.createElement('div', {
            ref: n,
            style: { height: '100%', width: '100%' },
          })
        )
      })
      function pe(e) {
        const t = (0, r.useRef)(null),
          [, n] = (0, O.useDrop)({
            accept: 'node',
            hover: (n, r) => {
              if (!t.current) return
              const o = r.getClientOffset()
              if (null === o) return
              const s = e.getOrderedNodes()
              if (0 === s.length) return
              const l = t.current.getNode().getBoundingClientRect(),
                i = e.getContainerElement().getBoundingClientRect()
              if ('first' === e.type) {
                const t = {
                  top: l.top - i.top + l.height,
                  left: l.left - i.left,
                  bottom: l.top - i.top + l.height,
                  right: l.left - i.left + l.width,
                  height: 0,
                  width: l.width,
                }
                e.processDropTarget(s[0], 'before', !1, t, !1)
              }
              if ('last' === e.type) {
                const t = o.x - l.left < 48,
                  n = s[s.length - 1],
                  r =
                    t && 2 === n.level
                      ? (0, h.ensureDefined)(s.find((e) => e.id === n.parentId))
                      : n,
                  c = {
                    top: l.top - i.top,
                    left: l.left - i.left,
                    bottom: l.top - i.top,
                    right: l.left - i.left + l.width,
                    height: l.height,
                    width: l.width,
                  }
                e.processDropTarget(r, 'after', t, c, !1)
              }
            },
          })
        return r.createElement(fe, { ...e, connectDropTarget: n, ref: t })
      }
      const he = r.createContext({ isOver: !1, transform: void 0 })
      var Ee = n(723490)
      function Se(e) {
        const { dropType: t, boundBox: n } = e,
          { top: r, bottom: o, left: s } = (0, h.ensureDefined)(n)
        return [s, 'before' === t || 'inside' === t ? r : o]
      }
      function ge(e) {
        return { isDragging: e.isDragging() }
      }
      const me = (0, s.connect)(
        (e) => {
          const {
            boundBox: t,
            dropType: n,
            node: r,
          } = (0, f.dropTargetSelector)(e)
          return { boundBox: t, dropType: n, level: r ? r.level : void 0 }
        },
        null,
        null,
        { context: $ },
      )((e) => {
        const {
          dropType: t,
          boundBox: n,
          isDragging: o,
          level: s,
          transform: l = Se,
        } = e
        return re(() => {
          if (!o || !t || !n) return null
          const i = {
              [Ee.dropTarget]: 'inside' !== t,
              [Ee.dropTargetInside]: 'inside' === t,
            },
            { width: c, height: d } = n,
            [a, u] = l(e),
            f = `translate(${a}px, ${u}px)`
          return r.createElement('div', {
            className: x(i),
            style: {
              position: 'absolute',
              transform: f,
              WebkitTransform: f,
              top: 0,
              left: 2 === s ? '46px' : 0,
              width: 2 === s ? c - 46 + 'px' : c,
              height: 'inside' === t ? d : '2px',
            },
          })
        })
      })
      function ve(e) {
        const { isDragging: t } = (0, te.useDragLayer)(ge)
        return r.createElement(me, { ...e, isDragging: t })
      }
      const Te = r.forwardRef((e, t) => {
        const n = (0, r.useContext)(he)
        return r.createElement(
          'div',
          { ...e, ref: t },
          e.children,
          n.isOver && r.createElement(ve, { transform: n.transform }),
        )
      })
      var De = n(710263),
        Ne = n(892932),
        Ie = n(376106)
      const ye = 38 + W.Modifiers.Shift,
        Re = 40 + W.Modifiers.Shift
      const Ce = r.forwardRef((e, t) => {
        const {
            navigationKeys: n,
            renderList: o,
            stopMultiSelect: s,
            startMultiSelect: l,
            isMultiSelecting: i,
            nodeRenderer: c,
            dragPreviewRenderer: d,
            className: a,
            connectDropTarget: u,
            readOnly: f,
            onClick: p,
            dropLayerTransform: E,
            setFocusedNode: S,
            scrollToId: g,
            rowHeight: m,
            onMultiSelectPrevious: v,
            onMultiSelectNext: T,
            onMoveCursorToNext: D,
            onMoveCursorToPrevious: N,
            onKeyDown: I,
            outerRef: y,
            width: R,
            height: C,
            isOver: _,
            processDropTarget: b,
            autofocus: P,
          } = e,
          L = (0, r.useContext)(de.ObjectTreeContext),
          x = (0, r.useRef)(null)
        ;(0, r.useEffect)(() => {
          var e
          P && (null === (e = x.current) || void 0 === e || e.focus())
        }, []),
          (0, r.useEffect)(() => {
            const e = (e) => {
                ;[W.Modifiers.Mod, W.Modifiers.Shift].includes(
                  (0, W.modifiersFromEvent)(e),
                ) && l()
              },
              t = (e) => {
                i &&
                  ![W.Modifiers.Mod, W.Modifiers.Shift].includes(
                    (0, W.modifiersFromEvent)(e),
                  ) &&
                  s()
              }
            return (
              document.addEventListener('keydown', e),
              document.addEventListener('keyup', t),
              document.addEventListener('mousemove', t),
              () => {
                document.removeEventListener('keydown', e),
                  document.removeEventListener('keyup', t),
                  document.removeEventListener('mousemove', t)
              }
            )
          }, [i]),
          ((e) => {
            ;(0, r.useEffect)(() => {
              if (F.isEdge) {
                let t = null
                const n = (0, h.ensureNotNull)(e.current),
                  r = (e) => {
                    if (e.target instanceof Element) {
                      const n = (0, h.ensureNotNull)(
                        e.target.closest('[draggable]'),
                      )
                      n instanceof HTMLElement &&
                        ((n.style.opacity = '0'),
                        (t = requestAnimationFrame(
                          () => (n.style.opacity = '1'),
                        )))
                    }
                  }
                return (
                  n.addEventListener('dragstart', r),
                  () => {
                    n.removeEventListener('dragstart', r),
                      null !== t && cancelAnimationFrame(t)
                  }
                )
              }
              return () => {}
            }, [])
          })(x)
        const O = (0, r.useCallback)(() => (0, h.ensureNotNull)($.current), []),
          z = (0, r.useCallback)(() => o, [o]),
          A = (0, r.useMemo)(() => {
            const e = f ? Q : J,
              t = []
            let n
            t.push({
              type: 'padding',
              node: r.createElement(pe, {
                type: 'first',
                key: 'padding-top',
                getContainerElement: O,
                getOrderedNodes: z,
                processDropTarget: b,
              }),
            })
            for (let s = 0; s < o.length; s++) {
              const l = o[s]
              1 === l.level &&
                (void 0 !== n &&
                  n !== l.parentId &&
                  t.push({
                    type: 'separator',
                    node: r.createElement('div', {
                      key: n + '_separator',
                      className: Ie.separator,
                    }),
                  }),
                (n = l.parentId)),
                t.push({
                  type: 'node',
                  node: r.createElement(e, {
                    id: l.id,
                    key: l.id,
                    isFirstListItem: 0 === s,
                    isLastListItem: s === o.length - 1,
                    isExpandable: l.children.length > 0,
                    nodeRenderer: c,
                    readOnly: f,
                    onClick: p,
                    isOffset: l.level > 1,
                    getContainerElement: O,
                  }),
                })
            }
            return (
              t.push({
                type: 'padding',
                node: r.createElement(pe, {
                  type: 'last',
                  key: 'padding-bottom',
                  getContainerElement: O,
                  getOrderedNodes: z,
                  processDropTarget: b,
                }),
              }),
              t
            )
          }, [o]),
          k = (0, r.useRef)([])
        k.current = A
        const B = (0, r.useCallback)((e) => {
            let { style: t } = e
            const { index: n } = e
            return (
              n === k.current.length - 1 &&
                ((t = { ...t, bottom: 0, minHeight: t.height }),
                delete t.height),
              r.createElement('div', { style: t }, k.current[n].node)
            )
          }, []),
          U = (0, r.useCallback)(
            (e) => {
              const t = k.current[e]
              return 'padding' === t.type
                ? 6
                : 'function' == typeof m
                  ? m(e, t)
                  : m
            },
            [m],
          ),
          H = (0, r.useCallback)(
            (e) => (0, h.ensure)(k.current[e].node.key),
            [],
          ),
          Z = (0, r.useMemo)(
            () =>
              null === g
                ? { index: -1 }
                : { index: k.current.findIndex((e) => e.node.key === g.id) },
            [g],
          )
        u(x)
        const [V, j, G, X] = (0, ue.useOverlayScroll)(),
          K = (0, r.useRef)(null)
        ;(0, r.useEffect)(
          () => (0, h.ensureNotNull)(K.current).resetAfterIndex(0, !0),
          [A],
        ),
          (0, r.useEffect)(
            () => (0, h.ensureNotNull)(K.current).scrollToItem(Z.index),
            [Z],
          )
        const $ = (0, r.useRef)(null),
          q = (0, r.useMemo)(() => ({ isOver: _, transform: E }), [_, E]),
          Y = (0, r.useRef)(null),
          te = (0, r.useRef)({
            startScroll(e) {
              const t = () => {
                null !== G.current &&
                  ((Y.current = requestAnimationFrame(t)),
                  G.current.scrollBy({ top: e }))
              }
              this.stopScroll(), t()
            },
            stopScroll() {
              null !== Y.current &&
                (cancelAnimationFrame(Y.current), (Y.current = null))
            },
            getListElement: () => G.current,
          })
        return (
          (0, r.useImperativeHandle)(t, () => te.current, []),
          (0, r.useEffect)(() => () => te.current.stopScroll(), [_]),
          (0, r.useEffect)(() => {
            if (!x.current || !Ne.PLATFORM_ACCESSIBILITY_ENABLED) return
            function e(e) {
              if (!t.matches(':focus-visible')) return
              if (!L) return
              const { viewModel: n } = L,
                r = n.selection()
              e.defaultPrevented ||
                e.currentTarget !== e.target ||
                r.selected().length ||
                D()
            }
            const t = x.current
            return (
              t.addEventListener('focus', e),
              () => {
                t.removeEventListener('focus', e)
              }
            )
          }, [x, D, L]),
          r.createElement(
            he.Provider,
            { value: q },
            r.createElement(
              'div',
              {
                ...j,
                className: M()(Ie.tree, a),
                ref: x,
                'data-name': 'tree',
                tabIndex: Ne.PLATFORM_ACCESSIBILITY_ENABLED ? 0 : -1,
                onKeyDown: (e) => {
                  const t = (0, W.hashFromEvent)(e)
                  if (
                    e.defaultPrevented ||
                    (0, ee.isNativeUIInteraction)(t, e.target)
                  )
                    return
                  const r = (0, h.ensureDefined)(V.scrollPosTop),
                    o = (0, h.ensureDefined)(V.contentHeight),
                    s = (0, h.ensureDefined)(V.containerHeight)
                  if (s) {
                    const n = 0.875 * s,
                      l = r + s === o
                    switch (t) {
                      case 35:
                        l || (e.preventDefault(), ne(o))
                        break
                      case 36:
                        0 !== r && (e.preventDefault(), ne(0))
                        break
                      case 33:
                        0 !== r && (e.preventDefault(), ne(Math.max(0, r - n)))
                        break
                      case 34:
                        l || (e.preventDefault(), ne(Math.min(r + n, o)))
                    }
                  }
                  L || t !== ye || (e.preventDefault(), v())
                  L || t !== Re || (e.preventDefault(), T())
                  ;(38 === t || (void 0 !== n && 'previous' === n[t])) &&
                    (e.preventDefault(), N())
                  ;(40 === t || (void 0 !== n && 'next' === n[t])) &&
                    (e.preventDefault(), D())
                  if ((8 === t || 46 === t) && L) {
                    const { viewModel: e } = L,
                      t = e.selection(),
                      n = t.selected()
                    if (1 !== n.length) return
                    const r = e.getNextNodeIdAfterRemove(n[0])
                    if (null === r) return
                    e.onChange().subscribe(
                      null,
                      () => {
                        if (t.selected().length) return
                        const n = e.entity(r)
                        n && (t.set([n]), S(r))
                      },
                      !0,
                    )
                  }
                  null == I || I(e)
                },
              },
              r.createElement(ae.OverlayScrollContainer, {
                ...V,
                className: Ie.overlayScrollWrap,
              }),
              r.createElement(w.VariableSizeList, {
                ref: (e) => {
                  K.current = e
                },
                className: Ie.listContainer,
                width: R,
                height: C,
                itemCount: A.length,
                itemSize: U,
                children: B,
                itemKey: H,
                outerRef: (e) => {
                  ;(G.current = e), y && y(e)
                },
                innerRef: (e) => {
                  $.current = e
                },
                innerElementType: Te,
                onItemsRendered: () => {
                  X()
                },
                overscanCount: 20,
                direction: (0, De.isRtl)() ? 'rtl' : 'ltr',
              }),
              r.createElement(ce, { dragPreviewRenderer: d, nodeRenderer: c }),
            ),
          )
        )
        function ne(e) {
          var t
          null === (t = G.current) ||
            void 0 === t ||
            t.scrollTo({ left: 0, top: e })
        }
      })
      const _e = (0, s.connect)(
          (e) => ({
            renderList: (0, f.renderListSelector)(e),
            orderedNodes: (0, f.orderedNodesSelector)(e),
            isMultiSelecting: (0, f.isMultiSelectingSelector)(e),
            selectedIds: (0, f.selectedIdsSelector)(e),
            scrollToId: (0, f.scrollToIdSelector)(e),
          }),
          (e) =>
            (0, R.bindActionCreators)(
              {
                startMultiSelect: u.startMultiSelect,
                stopMultiSelect: u.stopMultiSelect,
                setFocusedNode: u.setFocusedNode,
                processDropTarget: u.processDropTarget,
                onMoveCursorToNext: u.selectNext,
                onMoveCursorToPrevious: u.selectPrevious,
                onMultiSelectPrevious: u.multiSelectPrevious,
                onMultiSelectNext: u.multiSelectNext,
              },
              e,
            ),
          null,
          { context: $ },
        )((e) => {
          const t = (0, r.useRef)(null),
            [{ isOver: n }, o] = (0, O.useDrop)({
              accept: 'node',
              drop: (n, r) => {
                var o
                ;('touch' === e.drag || F.isFF) &&
                  (null === (o = t.current) || void 0 === o || o.stopScroll()),
                  r.getItem().dropSelection()
              },
              hover: (n, r) => {
                var o, s
                if ('touch' !== e.drag && !F.isFF) return
                const l = r.getClientOffset()
                if (null === l) return
                const i =
                  null !==
                    (s =
                      null === (o = t.current) || void 0 === o
                        ? void 0
                        : o.getListElement()) && void 0 !== s
                    ? s
                    : null
                if (null === i) return
                const c = i.getBoundingClientRect()
                ;((n, r, o) => {
                  var s
                  const l = Math.abs(n - o),
                    i = Math.abs(n - r)
                  if ((i > 40 && l > 40) || (l <= 40 && i <= 40))
                    return void (
                      null === (s = t.current) ||
                      void 0 === s ||
                      s.stopScroll()
                    )
                  ;((n, r, o, s) => {
                    var l, i, c, d
                    r || n
                      ? 'touch' === e.drag
                        ? null === (l = t.current) ||
                          void 0 === l ||
                          l.startScroll(r ? -5 : 5)
                        : null === (i = t.current) ||
                          void 0 === i ||
                          i.startScroll(r ? -2 : 2)
                      : (o || s) &&
                        ('touch' === e.drag
                          ? null === (c = t.current) ||
                            void 0 === c ||
                            c.startScroll(o ? -10 : 10)
                          : null === (d = t.current) ||
                            void 0 === d ||
                            d.startScroll(o ? -5 : 5))
                  })(i > 20 && i <= 40, l > 20 && l <= 40, l <= 20, i <= 20)
                })(l.y, c.bottom, c.top)
              },
              collect: (e) => ({ isOver: e.isOver() }),
            })
          return r.createElement(Ce, {
            ...e,
            isOver: n,
            connectDropTarget: o,
            ref: t,
          })
        }),
        be = { delayTouchStart: 100 }
      function Pe(e) {
        const {
            canBeAddedToSelection: t,
            initState: n,
            onSelect: s,
            canMove: l,
            onDrop: i,
            onMove: c,
            nodes: d,
            selectedIds: a,
            onKeyboardSelect: f,
            saga: p,
            lastFocusedNodeObject: h,
            lastSyncTimestampRef: E,
            scrollToId: S,
            ...g
          } = e,
          [m, v] = (0, r.useState)(null)
        return (
          (0, r.useEffect)(() => {
            const e = (0, o.default)()
            v(
              ((e) => {
                const t = (0, R.applyMiddleware)(e)
                return (0, R.createStore)(L, t)
              })(e),
            )
            const r = e.run(y, {
              initState: n,
              onKeyboardSelect: f,
              saga: p,
              canMove: l,
              onMove: c,
              onDrop: i,
              onSelect: s,
              canBeAddedToSelection: t,
            })
            return () => r.cancel()
          }, []),
          (0, r.useEffect)(
            () => (
              null !== m &&
                d &&
                (E && (E.current = performance.now()),
                m.dispatch((0, u.syncNodes)(d))),
              () => {}
            ),
            [m, d],
          ),
          (0, r.useEffect)(() => {
            null !== m && a && m.dispatch((0, u.setSelectedIds)(a))
          }, [m, a]),
          (0, r.useEffect)(() => {
            null !== m &&
              (null == h ? void 0 : h.id) &&
              m.dispatch((0, u.setFocusedNode)(h.id))
          }, [m, h]),
          null === m
            ? null
            : r.createElement(Le, { store: m, scrollToId: S, ...g })
        )
      }
      const Le = r.memo((e) => {
        const { store: t, scrollToId: n, ...o } = e,
          d = 'touch' === e.drag ? i.TouchBackend : l.HTML5Backend
        return (
          (0, r.useEffect)(() => {
            var e
            t.dispatch(
              (0, u.scrollToId)(
                null !== (e = null == n ? void 0 : n.id) && void 0 !== e
                  ? e
                  : null,
              ),
            )
          }, [n]),
          r.createElement(
            c.DndProvider,
            { backend: d, options: be },
            r.createElement(
              s.Provider,
              { store: t, context: $ },
              r.createElement(_e, { ...o }),
            ),
          )
        )
      })
    },
    693838: (e, t, n) => {
      n.d(t, { ObjectTreeContext: () => r })
      const r = n(50959).createContext(null)
    },
    215078: (e, t, n) => {
      function r(e) {
        return (t) => e + '__' + t
      }
      n.d(t, { createActionTypeFactory: () => r })
    },
    139043: (e, t, n) => {
      n.d(t, { useOverlayScroll: () => c })
      var r = n(50959),
        o = n(650151),
        s = n(522224),
        l = n(601227)
      const i = { onMouseOver: () => {}, onMouseOut: () => {} }
      function c(e, t = l.CheckMobile.any()) {
        const n = (0, r.useRef)(null),
          c = e || (0, r.useRef)(null),
          [d, a] = (0, s.useHover)(),
          [u, f] = (0, r.useState)({
            reference: n,
            containerHeight: 0,
            containerWidth: 0,
            contentHeight: 0,
            contentWidth: 0,
            scrollPosTop: 0,
            scrollPosLeft: 0,
            onVerticalChange: (e) => {
              f((t) => ({ ...t, scrollPosTop: e })),
                ((0, o.ensureNotNull)(c.current).scrollTop = e)
            },
            onHorizontalChange: (e) => {
              f((t) => ({ ...t, scrollPosLeft: e })),
                ((0, o.ensureNotNull)(c.current).scrollLeft = e)
            },
            visible: d,
          }),
          p = (0, r.useCallback)(() => {
            if (!c.current) return
            const {
                clientHeight: e,
                scrollHeight: t,
                scrollTop: r,
                clientWidth: o,
                scrollWidth: s,
                scrollLeft: l,
              } = c.current,
              i = n.current ? n.current.offsetTop : 0
            f((n) => ({
              ...n,
              containerHeight: e - i,
              contentHeight: t - i,
              scrollPosTop: r,
              containerWidth: o,
              contentWidth: s,
              scrollPosLeft: l,
            }))
          }, [])
        function h() {
          f((e) => ({
            ...e,
            scrollPosTop: (0, o.ensureNotNull)(c.current).scrollTop,
            scrollPosLeft: (0, o.ensureNotNull)(c.current).scrollLeft,
          }))
        }
        return (
          (0, r.useEffect)(() => {
            d && p(), f((e) => ({ ...e, visible: d }))
          }, [d]),
          (0, r.useEffect)(() => {
            const e = c.current
            return (
              e && e.addEventListener('scroll', h),
              () => {
                e && e.removeEventListener('scroll', h)
              }
            )
          }, [c]),
          [u, t ? i : a, c, p]
        )
      }
    },
    297265: (e, t, n) => {
      n.d(t, { useWatchedValueReadonly: () => o })
      var r = n(50959)
      const o = (e, t = !1) => {
        const n = 'watchedValue' in e ? e.watchedValue : void 0,
          o = 'defaultValue' in e ? e.defaultValue : e.watchedValue.value(),
          [s, l] = (0, r.useState)(n ? n.value() : o)
        return (
          (t ? r.useLayoutEffect : r.useEffect)(() => {
            if (n) {
              l(n.value())
              const e = (e) => l(e)
              return n.subscribe(e), () => n.unsubscribe(e)
            }
            return () => {}
          }, [n]),
          s
        )
      }
    },
    800296: (e, t, n) => {
      n.d(t, { ListItemButton: () => c })
      var r = n(50959),
        o = n(497754),
        s = n.n(o),
        l = n(72571),
        i = n(186928)
      function c(e) {
        const { className: t, disabled: n, ...o } = e
        return r.createElement(l.Icon, {
          className: s()(i.button, n && i.disabled, t),
          ...o,
        })
      }
    },
    502869: (e) => {
      e.exports = { button: 'button-xNqEcuN2' }
    },
    395907: (e, t, n) => {
      n.d(t, { ToolWidgetIconButton: () => i })
      var r = n(50959),
        o = n(497754),
        s = n(747633),
        l = n(502869)
      const i = r.forwardRef((e, t) => {
        const { className: n, id: i, ...c } = e
        return r.createElement(s.ToolWidgetButton, {
          id: i,
          'data-name': i,
          ...c,
          ref: t,
          className: o(n, l.button),
        })
      })
    },
    333765: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="currentColor" d="M9.707 9l4.647-4.646-.707-.708L9 8.293 4.354 3.646l-.708.708L8.293 9l-4.647 4.646.708.708L9 9.707l4.646 4.647.708-.707L9.707 9z"/></svg>'
    },
    636296: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M8 9.5H6.5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V20m-8-1.5h11a1 1 0 0 0 1-1v-11a1 1 0 0 0-1-1h-11a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1z"/></svg>'
    },
    133055: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M17.086 6.207a2 2 0 0 1 2.828 0l1.879 1.879a2 2 0 0 1 0 2.828l-.94.94-9 9-1 1-.146.146H6v-4.707l.146-.146 1-1 9-9 .94-.94zm2.121.707a1 1 0 0 0-1.414 0l-.586.586 1.647 1.646 1.646 1.647.586-.586a1 1 0 0 0 0-1.414l-1.879-1.879zm.586 4.586L18.5 10.207 10.207 18.5l1.293 1.293 8.293-8.293zm-9 9l-1.647-1.646L7.5 17.207l-.5.5V21h3.293l.5-.5zm-2.586-4L9.5 17.793 17.793 9.5 16.5 8.207 8.207 16.5z"/></svg>'
    },
    569533: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"><path stroke="currentColor" d="M8 5l3.5 3.5L8 12"/></svg>'
    },
  },
])
