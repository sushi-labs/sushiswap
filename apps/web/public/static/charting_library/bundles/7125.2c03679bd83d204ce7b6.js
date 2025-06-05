;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7125],
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
    312863: (e) => {
      e.exports = { innerLabel: 'innerLabel-DjbvBF5Y' }
    },
    321234: (e) => {
      e.exports = {
        controlWrapper: 'controlWrapper-DBTazUk2',
        hidden: 'hidden-DBTazUk2',
        control: 'control-DBTazUk2',
        controlIncrease: 'controlIncrease-DBTazUk2',
        controlDecrease: 'controlDecrease-DBTazUk2',
        controlIcon: 'controlIcon-DBTazUk2',
        title: 'title-DBTazUk2',
      }
    },
    844022: (e) => {
      e.exports = {
        errors: 'errors-bghR31WL',
        show: 'show-bghR31WL',
        error: 'error-bghR31WL',
        'visually-hidden': 'visually-hidden-bghR31WL',
      }
    },
    240461: (e) => {
      e.exports = {
        'error-icon': 'error-icon-UhKAouIg',
        'intent-danger': 'intent-danger-UhKAouIg',
        'intent-warning': 'intent-warning-UhKAouIg',
      }
    },
    927345: (e) => {
      e.exports = {
        'static-messages': 'static-messages-cF4vS9J8',
        errors: 'errors-cF4vS9J8',
        warnings: 'warnings-cF4vS9J8',
        'success-mesages': 'success-mesages-cF4vS9J8',
        'input-description': 'input-description-cF4vS9J8',
        message: 'message-cF4vS9J8',
      }
    },
    34735: (e, t, n) => {
      n.d(t, { ControlSkeleton: () => b, InputClasses: () => g })
      var s = n(50959),
        r = n(497754),
        o = n(650151),
        a = n(525388),
        i = n(800417),
        l = n(380327),
        c = n(331774)
      var h = n(281026),
        u = n.n(h)
      function d(e) {
        let t = ''
        return (
          0 !== e &&
            (1 & e && (t = r(t, u()['no-corner-top-left'])),
            2 & e && (t = r(t, u()['no-corner-top-right'])),
            4 & e && (t = r(t, u()['no-corner-bottom-right'])),
            8 & e && (t = r(t, u()['no-corner-bottom-left']))),
          t
        )
      }
      function p(e, t, n, s) {
        const {
            removeRoundBorder: o,
            className: a,
            intent: i = 'default',
            borderStyle: l = 'thin',
            size: h,
            highlight: p,
            disabled: m,
            readonly: g,
            stretch: f,
            noReadonlyStyles: v,
            isFocused: b,
          } = e,
          S = d(null != o ? o : (0, c.getGroupCellRemoveRoundBorders)(n))
        return r(
          u().container,
          u()[`container-${h}`],
          u()[`intent-${i}`],
          u()[`border-${l}`],
          h && u()[`size-${h}`],
          S,
          p && u()['with-highlight'],
          m && u().disabled,
          g && !v && u().readonly,
          b && u().focused,
          f && u().stretch,
          t && u().grouped,
          !s && u()['adjust-position'],
          n.isTop && u()['first-row'],
          n.isLeft && u()['first-col'],
          a,
        )
      }
      function m(e, t, n) {
        const { highlight: s, highlightRemoveRoundBorder: o } = e
        if (!s) return u().highlight
        const a = d(null != o ? o : (0, c.getGroupCellRemoveRoundBorders)(t))
        return r(u().highlight, u().shown, u()[`size-${n}`], a)
      }
      const g = {
          FontSizeMedium: (0, o.ensureDefined)(u()['font-size-medium']),
          FontSizeLarge: (0, o.ensureDefined)(u()['font-size-large']),
        },
        f = { passive: !1 }
      function v(e, t) {
        const {
            style: n,
            id: r,
            role: o,
            onFocus: c,
            onBlur: h,
            onMouseOver: u,
            onMouseOut: d,
            onMouseDown: g,
            onMouseUp: v,
            onKeyDown: b,
            onClick: S,
            tabIndex: w,
            startSlot: C,
            middleSlot: R,
            endSlot: y,
            onWheel: M,
            onWheelNoPassive: E = null,
            size: D,
          } = e,
          {
            isGrouped: N,
            cellState: F,
            disablePositionAdjustment: W = !1,
          } = (0, s.useContext)(l.ControlGroupContext),
          P = ((e, t = null, n) => {
            const r = (0, s.useRef)(null),
              o = (0, s.useRef)(null),
              a = (0, s.useCallback)(() => {
                if (null === r.current || null === o.current) return
                const [e, t, n] = o.current
                null !== t && r.current.addEventListener(e, t, n)
              }, []),
              i = (0, s.useCallback)(() => {
                if (null === r.current || null === o.current) return
                const [e, t, n] = o.current
                null !== t && r.current.removeEventListener(e, t, n)
              }, []),
              l = (0, s.useCallback)((e) => {
                i(), (r.current = e), a()
              }, [])
            return (
              (0, s.useEffect)(
                () => ((o.current = [e, t, n]), a(), i),
                [e, t, n],
              ),
              l
            )
          })('wheel', E, f)
        return s.createElement(
          'span',
          {
            style: n,
            id: r,
            role: o,
            className: p(e, N, F, W),
            tabIndex: w,
            ref: (0, a.useMergedRefs)([t, P]),
            onFocus: c,
            onBlur: h,
            onMouseOver: u,
            onMouseOut: d,
            onMouseDown: g,
            onMouseUp: v,
            onKeyDown: b,
            onClick: S,
            onWheel: M,
            ...(0, i.filterDataProps)(e),
            ...(0, i.filterAriaProps)(e),
          },
          C,
          R,
          y,
          s.createElement('span', { className: m(e, F, D) }),
        )
      }
      v.displayName = 'ControlSkeleton'
      const b = s.forwardRef(v)
    },
    102691: (e, t, n) => {
      n.d(t, {
        AfterSlot: () => u,
        BeforeSlot: () => i,
        EndSlot: () => h,
        MiddleSlot: () => c,
        StartSlot: () => l,
      })
      var s = n(50959),
        r = n(497754),
        o = n(7236),
        a = n.n(o)
      function i(e) {
        const { className: t, children: n } = e
        return s.createElement(
          'span',
          { className: r(a()['before-slot'], t) },
          n,
        )
      }
      function l(e) {
        const {
          className: t,
          interactive: n = !0,
          icon: o = !1,
          children: i,
        } = e
        return s.createElement(
          'span',
          {
            className: r(
              a()['inner-slot'],
              n && a().interactive,
              o && a().icon,
              t,
            ),
          },
          i,
        )
      }
      function c(e) {
        const { className: t, children: n } = e
        return s.createElement(
          'span',
          { className: r(a()['inner-slot'], a()['inner-middle-slot'], t) },
          n,
        )
      }
      function h(e) {
        const {
          className: t,
          interactive: n = !0,
          icon: o = !1,
          children: i,
        } = e
        return s.createElement(
          'span',
          {
            className: r(
              a()['inner-slot'],
              n && a().interactive,
              o && a().icon,
              t,
            ),
          },
          i,
        )
      }
      function u(e) {
        const { className: t, children: n } = e
        return s.createElement(
          'span',
          { className: r(a()['after-slot'], t) },
          n,
        )
      }
    },
    654936: (e, t, n) => {
      n.d(t, { InputControl: () => b })
      var s = n(50959),
        r = n(497754),
        o = n(800417),
        a = n(269842),
        i = n(1811),
        l = n(525388),
        c = n(21778),
        h = n(383836),
        u = n(603548),
        d = n(34735),
        p = n(102691),
        m = n(330930),
        g = n.n(m)
      function f(e) {
        return !(0, o.isAriaAttribute)(e) && !(0, o.isDataAttribute)(e)
      }
      function v(e) {
        const {
            id: t,
            title: n,
            role: a,
            tabIndex: i,
            placeholder: l,
            name: c,
            type: h,
            value: u,
            defaultValue: m,
            draggable: v,
            autoComplete: b,
            autoFocus: S,
            maxLength: w,
            min: C,
            max: R,
            step: y,
            pattern: M,
            inputMode: E,
            onSelect: D,
            onFocus: N,
            onBlur: F,
            onKeyDown: W,
            onKeyUp: P,
            onKeyPress: x,
            onChange: k,
            onDragStart: A,
            size: B = 'small',
            className: z,
            inputClassName: I,
            disabled: _,
            readonly: V,
            containerTabIndex: Z,
            startSlot: T,
            endSlot: O,
            reference: L,
            containerReference: U,
            onContainerFocus: H,
            ...K
          } = e,
          j = (0, o.filterProps)(K, f),
          Y = {
            ...(0, o.filterAriaProps)(K),
            ...(0, o.filterDataProps)(K),
            id: t,
            title: n,
            role: a,
            tabIndex: i,
            placeholder: l,
            name: c,
            type: h,
            value: u,
            defaultValue: m,
            draggable: v,
            autoComplete: b,
            autoFocus: S,
            maxLength: w,
            min: C,
            max: R,
            step: y,
            pattern: M,
            inputMode: E,
            onSelect: D,
            onFocus: N,
            onBlur: F,
            onKeyDown: W,
            onKeyUp: P,
            onKeyPress: x,
            onChange: k,
            onDragStart: A,
          }
        return s.createElement(d.ControlSkeleton, {
          ...j,
          disabled: _,
          readonly: V,
          tabIndex: Z,
          className: r(g().container, z),
          size: B,
          ref: U,
          onFocus: H,
          startSlot: T,
          middleSlot: s.createElement(
            p.MiddleSlot,
            null,
            s.createElement('input', {
              ...Y,
              className: r(
                g().input,
                g()[`size-${B}`],
                I,
                T && g()['with-start-slot'],
                O && g()['with-end-slot'],
              ),
              disabled: _,
              readOnly: V,
              ref: L,
            }),
          ),
          endSlot: O,
        })
      }
      function b(e) {
        e = (0, c.useControl)(e)
        const {
            disabled: t,
            autoSelectOnFocus: n,
            tabIndex: r = 0,
            onFocus: o,
            onBlur: d,
            reference: p,
            containerReference: m = null,
          } = e,
          g = (0, s.useRef)(null),
          f = (0, s.useRef)(null),
          [b, S] = (0, h.useFocus)(),
          w = t ? void 0 : b ? -1 : r,
          C = t ? void 0 : b ? r : -1,
          {
            isMouseDown: R,
            handleMouseDown: y,
            handleMouseUp: M,
          } = (0, u.useIsMouseDown)(),
          E = (0, a.createSafeMulticastEventHandler)(
            S.onFocus,
            (e) => {
              n && !R.current && (0, i.selectAllContent)(e.currentTarget)
            },
            o,
          ),
          D = (0, a.createSafeMulticastEventHandler)(S.onBlur, d),
          N = (0, s.useCallback)(
            (e) => {
              ;(g.current = e),
                p &&
                  ('function' == typeof p && p(e),
                  'object' == typeof p && (p.current = e))
            },
            [g, p],
          )
        return s.createElement(v, {
          ...e,
          isFocused: b,
          containerTabIndex: w,
          tabIndex: C,
          onContainerFocus: (e) => {
            f.current === e.target && null !== g.current && g.current.focus()
          },
          onFocus: E,
          onBlur: D,
          reference: N,
          containerReference: (0, l.useMergedRefs)([f, m]),
          onMouseDown: y,
          onMouseUp: M,
        })
      }
    },
    21778: (e, t, n) => {
      n.d(t, { useControl: () => o })
      var s = n(269842),
        r = n(383836)
      function o(e) {
        const {
            onFocus: t,
            onBlur: n,
            intent: o,
            highlight: a,
            disabled: i,
          } = e,
          [l, c] = (0, r.useFocus)(void 0, i),
          h = (0, s.createSafeMulticastEventHandler)(i ? void 0 : c.onFocus, t),
          u = (0, s.createSafeMulticastEventHandler)(i ? void 0 : c.onBlur, n)
        return {
          ...e,
          intent: o || (l ? 'primary' : 'default'),
          highlight: null != a ? a : l,
          onFocus: h,
          onBlur: u,
        }
      }
    },
    603548: (e, t, n) => {
      n.d(t, { useIsMouseDown: () => r })
      var s = n(50959)
      function r() {
        const e = (0, s.useRef)(!1),
          t = (0, s.useCallback)(() => {
            e.current = !0
          }, [e]),
          n = (0, s.useCallback)(() => {
            e.current = !1
          }, [e])
        return { isMouseDown: e, handleMouseDown: t, handleMouseUp: n }
      }
    },
    1811: (e, t, n) => {
      function s(e) {
        null !== e && e.setSelectionRange(0, e.value.length)
      }
      n.d(t, { selectAllContent: () => s })
    },
    794087: (e, t, n) => {
      n.d(t, { InputWithError: () => p })
      var s = n(50959),
        r = n(497754),
        o = n(34735),
        a = n(102691),
        i = n(481476),
        l = n(361988),
        c = n(579184),
        h = n(312863)
      const u = {
          large: o.InputClasses.FontSizeLarge,
          medium: o.InputClasses.FontSizeMedium,
        },
        d = {
          attachment: c.anchors.top.attachment,
          targetAttachment: c.anchors.top.targetAttachment,
          attachmentOffsetY: -4,
        }
      function p(e) {
        const {
            className: t,
            inputClassName: n,
            stretch: o = !0,
            errorMessage: c,
            fontSizeStyle: p = 'large',
            endSlot: m,
            button: g,
            error: f,
            warning: v,
            innerLabel: b,
            inputReference: S,
            children: w,
            ...C
          } = e,
          R = f && void 0 !== c ? [c] : void 0,
          y = v && void 0 !== c ? [c] : void 0,
          M = r(h.inputContainer, u[p], t),
          E = b
            ? s.createElement(
                a.StartSlot,
                { className: h.innerLabel, interactive: !1 },
                b,
              )
            : void 0,
          D = m || g || w ? s.createElement(a.EndSlot, null, m, g, w) : void 0
        return s.createElement(i.FormInput, {
          ...C,
          className: M,
          inputClassName: n,
          errors: R,
          warnings: y,
          hasErrors: f,
          hasWarnings: v,
          messagesPosition: l.MessagesPosition.Attached,
          customErrorsAttachment: d,
          messagesRoot: 'document',
          inheritMessagesWidthFromTarget: !0,
          disableMessagesRtlStyles: !0,
          iconHidden: !0,
          stretch: o,
          reference: S,
          startSlot: E,
          endSlot: D,
        })
      }
    },
    576805: (e, t, n) => {
      n.d(t, { NumberInputView: () => w })
      var s = n(50959),
        r = n(972535),
        o = n(794087),
        a = n(525388),
        i = n(497754),
        l = n(609838),
        c = n(72571),
        h = n(199663),
        u = n(602948),
        d = n(321234)
      function p(e) {
        const t = i(d.control, d.controlIncrease),
          r = i(d.control, d.controlDecrease)
        return s.createElement(
          s.Fragment,
          null,
          void 0 !== e.title &&
            s.createElement('div', { className: d.title }, e.title),
          s.createElement(
            'div',
            { className: d.controlWrapper },
            (e.defaultButtonsVisible || e.title) &&
              s.createElement(
                s.Fragment,
                null,
                s.createElement(
                  'button',
                  {
                    type: 'button',
                    tabIndex: -1,
                    'aria-label': l.t(null, void 0, n(146812)),
                    className: t,
                    onClick: e.increaseValue,
                    onMouseDown: h.preventDefault,
                  },
                  s.createElement(c.Icon, {
                    icon: u,
                    className: d.controlIcon,
                  }),
                ),
                s.createElement(
                  'button',
                  {
                    type: 'button',
                    tabIndex: -1,
                    'aria-label': l.t(null, void 0, n(756095)),
                    className: r,
                    onClick: e.decreaseValue,
                    onMouseDown: h.preventDefault,
                  },
                  s.createElement(c.Icon, {
                    icon: u,
                    className: d.controlIcon,
                  }),
                ),
              ),
          ),
        )
      }
      var m = n(522224),
        g = n(383836),
        f = n(269842),
        v = n(180185)
      const b = [38],
        S = [40]
      function w(e) {
        const [t, n] = (0, m.useHover)(),
          [i, l] = (0, g.useFocus)(),
          c = (0, s.useRef)(null),
          h = (0, f.createSafeMulticastEventHandler)(l.onFocus, e.onFocus),
          u = (0, f.createSafeMulticastEventHandler)(l.onBlur, e.onBlur),
          d = (0, s.useCallback)(
            (t) => {
              !e.disabled &&
                i &&
                (t.preventDefault(),
                t.deltaY < 0
                  ? e.onValueByStepChange(1)
                  : e.onValueByStepChange(-1))
            },
            [i, e.disabled, e.onValueByStepChange],
          )
        return s.createElement(o.InputWithError, {
          ...n,
          id: e.id,
          name: e.name,
          pattern: e.pattern,
          borderStyle: e.borderStyle,
          fontSizeStyle: e.fontSizeStyle,
          value: e.value,
          className: e.className,
          inputClassName: e.inputClassName,
          autoComplete: e.autoComplete,
          button: (() => {
            const {
                button: n,
                forceShowControls: o,
                disabled: a,
                title: l,
              } = e,
              c = !a && !r.mobiletouch && (o || i || t)
            return a
              ? void 0
              : s.createElement(
                  s.Fragment,
                  null,
                  null != n
                    ? n
                    : s.createElement(p, {
                        increaseValue: w,
                        decreaseValue: C,
                        defaultButtonsVisible: c,
                        title: l,
                      }),
                )
          })(),
          disabled: e.disabled,
          placeholder: e.placeholder,
          innerLabel: e.innerLabel,
          endSlot: e.endSlot,
          containerReference: (0, a.useMergedRefs)([c, e.containerReference]),
          inputReference: e.inputReference,
          inputMode: e.inputMode,
          type: e.type,
          warning: e.warning,
          error: e.error,
          errorMessage: e.errorMessage,
          onClick: e.onClick,
          onFocus: h,
          onBlur: u,
          onChange: e.onValueChange,
          onKeyDown: (t) => {
            if (e.disabled || 0 !== (0, v.modifiersFromEvent)(t.nativeEvent))
              return
            let n = b,
              s = S
            e.controlDecKeyCodes && (s = s.concat(e.controlDecKeyCodes))
            e.controlIncKeyCodes && (n = n.concat(e.controlIncKeyCodes))
            ;(s.includes(t.keyCode) || n.includes(t.keyCode)) &&
              (t.preventDefault(),
              e.onValueByStepChange(s.includes(t.keyCode) ? -1 : 1))
            e.onKeyDown && e.onKeyDown(t)
          },
          onWheelNoPassive: d,
          stretch: e.stretch,
          intent: e.intent,
          highlight: e.highlight,
          highlightRemoveRoundBorder: e.highlightRemoveRoundBorder,
          autoSelectOnFocus: e.autoSelectOnFocus,
          'data-property-id': e['data-name'],
        })
        function w() {
          var t
          e.disabled ||
            (null === (t = c.current) || void 0 === t || t.focus(),
            e.onValueByStepChange(1))
        }
        function C() {
          var t
          e.disabled ||
            (null === (t = c.current) || void 0 === t || t.focus(),
            e.onValueByStepChange(-1))
        }
      }
    },
    587125: (e, t, n) => {
      n.d(t, { NumberInput: () => m })
      var s = n(50959),
        r = n(609838),
        o = n(960521),
        a = n(601227),
        i = n(576805),
        l = n(476007),
        c = n(424030),
        h = n(44681)
      const u = new l.SplitThousandsFormatter(),
        d = /^-?[0-9]*$/,
        p = 9e15
      class m extends s.PureComponent {
        constructor(e) {
          super(e),
            (this._onFocus = (e) => {
              this.setState({ focused: !0 }),
                this.props.onFocus && this.props.onFocus(e)
            }),
            (this._onBlur = (e) => {
              this.setState({ focused: !1 }),
                !1 !== this.props.shouldApplyValueOnBlur &&
                  (this.setState({
                    displayValue: g(this.props, this.props.value),
                  }),
                  this.props.errorHandler && this.props.errorHandler(!1)),
                this.props.onBlur && this.props.onBlur(e)
            }),
            (this._onValueChange = (e) => {
              const t = e.target.value
              if (
                (void 0 !== this.props.onEmptyString &&
                  '' === t &&
                  this.props.onEmptyString(),
                'integer' === this.props.mode && !d.test(t))
              )
                return
              const n = f(t, this.props.formatter),
                s = n.res
                  ? this._checkValueBoundaries(n.value)
                  : { isPassed: !1, msg: void 0 },
                r = n.res && !s.isPassed,
                o = n.res && n.suggest && !this.state.focused ? n.suggest : t,
                a = r && s.msg ? s.msg : this._errMsg
              this.setState({ displayValue: o, errorMsg: a }),
                n.res &&
                  s.isPassed &&
                  this.props.onValueChange(n.value, 'input'),
                this.props.errorHandler && this.props.errorHandler(!n.res || r)
            }),
            (this._onValueByStepChange = (e) => {
              const {
                  roundByStep: t = !0,
                  step: n = 1,
                  uiStep: s,
                  min: r = n,
                  formatter: a,
                } = this.props,
                i = f(this.state.displayValue, a),
                l = null != s ? s : n
              let c = n
              if (i.res) {
                const s = new o.Big(i.value),
                  a = s.minus(r).mod(n)
                let h = s.plus(e * l)
                !a.eq(0) && t && (h = h.plus((e > 0 ? 0 : 1) * l).minus(a)),
                  (c = h.toNumber())
              }
              const { isPassed: h, clampedValue: u } =
                this._checkValueBoundaries(c)
              ;(c = h ? c : u),
                this.setState({ displayValue: g(this.props, c) }),
                this.props.onValueChange(c, 'step'),
                this.props.errorHandler && this.props.errorHandler(!1)
            })
          const { value: t } = e
          ;(this._errMsg = r.t(null, void 0, n(535563))),
            (this.state = {
              value: t,
              displayValue: g(e, t),
              focused: !1,
              errorMsg: this._errMsg,
            })
        }
        render() {
          var e
          return s.createElement(i.NumberInputView, {
            id: this.props.id,
            inputMode:
              null !== (e = this.props.inputMode) && void 0 !== e
                ? e
                : this.state.inputMode,
            borderStyle: this.props.borderStyle,
            fontSizeStyle: this.props.fontSizeStyle,
            value: this.state.displayValue,
            forceShowControls: this.props.forceShowControls,
            className: this.props.className,
            inputClassName: this.props.inputClassName,
            button: this.props.button,
            placeholder: this.props.placeholder,
            innerLabel: this.props.innerLabel,
            endSlot: this.props.endSlot,
            disabled: this.props.disabled,
            warning: this.props.warning,
            error: this.props.error,
            autoComplete: this.props.autoComplete,
            errorMessage: this.props.errorMessage || this.state.errorMsg,
            onValueChange: this._onValueChange,
            onValueByStepChange: this._onValueByStepChange,
            containerReference: this.props.containerReference,
            inputReference: this.props.inputReference,
            onClick: this.props.onClick,
            onFocus: this._onFocus,
            onBlur: this._onBlur,
            onKeyDown: this.props.onKeyDown,
            controlDecKeyCodes: this.props.controlDecKeyCodes,
            controlIncKeyCodes: this.props.controlIncKeyCodes,
            title: this.props.title,
            intent: this.props.intent,
            highlight: this.props.highlight,
            highlightRemoveRoundBorder: this.props.highlightRemoveRoundBorder,
            stretch: this.props.stretch,
            autoSelectOnFocus: !a.CheckMobile.any(),
            'data-name': this.props['data-name'],
          })
        }
        componentDidMount() {
          this.setState({ inputMode: a.CheckMobile.iOS() ? void 0 : 'numeric' })
        }
        getClampedValue() {
          const { min: e = -1 / 0, max: t = p } = this.props,
            n = f(this.state.displayValue, this.props.formatter)
          return n.res ? (0, h.clamp)(n.value, e, t) : null
        }
        static getDerivedStateFromProps(e, t) {
          const { alwaysUpdateValueFromProps: n, value: s } = e
          return (t.focused && !n) || t.value === s
            ? null
            : { value: s, displayValue: g(e, s) }
        }
        _checkValueBoundaries(e) {
          var t, s, o, a
          const { min: i = -1 / 0, max: l = p } = this.props,
            c = ((e, t, n) => {
              const s = e >= t,
                r = e <= n
              return {
                passMin: s,
                passMax: r,
                pass: s && r,
                clamped: (0, h.clamp)(e, t, n),
              }
            })(e, i, l)
          let u
          return (
            c.passMax ||
              (u =
                null !==
                  (s =
                    null === (t = this.props.boundariesErrorMessages) ||
                    void 0 === t
                      ? void 0
                      : t.greaterThanMax) && void 0 !== s
                  ? s
                  : r.t(null, { replace: { max: String(l) } }, n(602607))),
            c.passMin ||
              (u =
                null !==
                  (a =
                    null === (o = this.props.boundariesErrorMessages) ||
                    void 0 === o
                      ? void 0
                      : o.lessThanMin) && void 0 !== a
                  ? a
                  : r.t(null, { replace: { min: String(i) } }, n(53669))),
            { isPassed: c.pass, msg: u, clampedValue: c.clamped }
          )
        }
      }
      function g(e, t) {
        const { useFormatter: n = !0, formatter: s, mode: r } = e
        return n && 'integer' !== r
          ? ((e, t = u) => (null !== e ? t.format(e) : ''))(t, s)
          : ((e) => {
              if (null === e) return ''
              return c.NumericFormatter.formatNoE(e)
            })(t)
      }
      function f(e, t = u) {
        return t.parse
          ? t.parse(e)
          : { res: !1, error: 'Formatter does not support parse' }
      }
    },
    579184: (e, t, n) => {
      n.d(t, { anchors: () => r, makeAnchorable: () => o })
      var s = n(50959)
      const r = {
        bottom: {
          attachment: { horizontal: 'left', vertical: 'top' },
          targetAttachment: { horizontal: 'left', vertical: 'bottom' },
        },
        top: {
          attachment: { horizontal: 'left', vertical: 'bottom' },
          targetAttachment: { horizontal: 'left', vertical: 'top' },
        },
        topRight: {
          attachment: { horizontal: 'right', vertical: 'bottom' },
          targetAttachment: { horizontal: 'right', vertical: 'top' },
        },
        bottomRight: {
          attachment: { horizontal: 'right', vertical: 'top' },
          targetAttachment: { horizontal: 'right', vertical: 'bottom' },
        },
      }
      function o(e) {
        var t
        return (
          ((t = class extends s.PureComponent {
            render() {
              const { anchor: t = 'bottom' } = this.props
              return s.createElement(e, {
                ...this.props,
                attachment: r[t].attachment,
                targetAttachment: r[t].targetAttachment,
              })
            }
          }).displayName = 'Anchorable Component'),
          t
        )
      }
    },
    841037: (e, t, n) => {
      n.d(t, { makeAttachable: () => o })
      var s = n(50959),
        r = n(500962)
      function o(e) {
        var t
        return (
          ((t = class extends s.PureComponent {
            constructor(e) {
              super(e),
                (this._getComponentInstance = (e) => {
                  this._instance = e
                }),
                (this._throttleCalcProps = () => {
                  requestAnimationFrame(() =>
                    this.setState(this._calcProps(this.props)),
                  )
                }),
                (this.state = this._getStateFromProps())
            }
            componentDidMount() {
              ;(this._instanceElem = r.findDOMNode(this._instance)),
                this.props.attachOnce || this._subscribe(),
                this.setState(this._calcProps(this.props))
            }
            componentDidUpdate(e) {
              ;(e.children === this.props.children &&
                e.top === this.props.top &&
                e.left === this.props.left &&
                e.width === this.props.width) ||
                this.setState(this._getStateFromProps(), () =>
                  this.setState(this._calcProps(this.props)),
                )
            }
            render() {
              return s.createElement(
                'div',
                {
                  style: {
                    position: 'absolute',
                    width: '100%',
                    top: 0,
                    left: 0,
                  },
                },
                s.createElement(
                  e,
                  {
                    ...this.props,
                    ref: this._getComponentInstance,
                    top: this.state.top,
                    bottom:
                      void 0 !== this.state.bottom ? this.state.bottom : 'auto',
                    right:
                      void 0 !== this.state.right ? this.state.right : 'auto',
                    left: this.state.left,
                    width: this.state.width,
                    maxWidth: this.state.maxWidth,
                  },
                  this.props.children,
                ),
              )
            }
            componentWillUnmount() {
              this._unsubsribe()
            }
            _getStateFromProps() {
              return {
                bottom: this.props.bottom,
                left: this.props.left,
                right: this.props.right,
                top: void 0 !== this.props.top ? this.props.top : -1e4,
                width: this.props.inheritWidthFromTarget
                  ? this.props.target &&
                    this.props.target.getBoundingClientRect().width
                  : this.props.width,
                maxWidth:
                  this.props.inheritMaxWidthFromTarget &&
                  this.props.target &&
                  this.props.target.getBoundingClientRect().width,
              }
            }
            _calcProps(e) {
              if (e.target && e.attachment && e.targetAttachment) {
                const t = this._calcTargetProps(
                  e.target,
                  e.attachment,
                  e.targetAttachment,
                )
                if (null === t) return {}
                const {
                    width: n,
                    inheritWidthFromTarget: s = !0,
                    inheritMaxWidthFromTarget: r = !1,
                  } = this.props,
                  o = { width: s ? t.width : n, maxWidth: r ? t.width : void 0 }
                switch (e.attachment.vertical) {
                  case 'bottom':
                  case 'middle':
                    o.top = t.y
                    break
                  default:
                    o[e.attachment.vertical] = t.y
                }
                switch (e.attachment.horizontal) {
                  case 'right':
                  case 'center':
                    o.left = t.x
                    break
                  default:
                    o[e.attachment.horizontal] = t.x
                }
                return o
              }
              return {}
            }
            _calcTargetProps(e, t, n) {
              const s = e.getBoundingClientRect(),
                r = this._instanceElem.getBoundingClientRect(),
                o =
                  'parent' === this.props.root
                    ? this._getCoordsRelToParentEl(e, s)
                    : this._getCoordsRelToDocument(s)
              if (null === o) return null
              const a = this._getDimensions(r),
                i = this._getDimensions(s).width
              let l = 0,
                c = 0
              switch (t.vertical) {
                case 'top':
                  c = o[n.vertical]
                  break
                case 'bottom':
                  c = o[n.vertical] - a.height
                  break
                case 'middle':
                  c = o[n.vertical] - a.height / 2
              }
              switch (t.horizontal) {
                case 'left':
                  l = o[n.horizontal]
                  break
                case 'right':
                  l = o[n.horizontal] - a.width
                  break
                case 'center':
                  l = o[n.horizontal] - a.width / 2
              }
              return (
                'number' == typeof this.props.attachmentOffsetY &&
                  (c += this.props.attachmentOffsetY),
                'number' == typeof this.props.attachmentOffsetX &&
                  (l += this.props.attachmentOffsetX),
                { x: l, y: c, width: i }
              )
            }
            _getCoordsRelToDocument(e) {
              const t = pageYOffset,
                n = pageXOffset,
                s = e.top + t,
                r = e.bottom + t,
                o = e.left + n
              return {
                top: s,
                bottom: r,
                left: o,
                right: e.right + n,
                middle: (s + e.height) / 2,
                center: o + e.width / 2,
              }
            }
            _getCoordsRelToParentEl(e, t) {
              const n = e.offsetParent
              if (null === n) return null
              const s = n.scrollTop,
                r = n.scrollLeft,
                o = e.offsetTop + s,
                a = e.offsetLeft + r,
                i = t.width + a
              return {
                top: o,
                bottom: t.height + o,
                left: a,
                right: i,
                middle: (o + t.height) / 2,
                center: (a + t.width) / 2,
              }
            }
            _getDimensions(e) {
              return { height: e.height, width: e.width }
            }
            _subscribe() {
              'document' === this.props.root &&
                (window.addEventListener('scroll', this._throttleCalcProps, !0),
                window.addEventListener('resize', this._throttleCalcProps))
            }
            _unsubsribe() {
              window.removeEventListener('scroll', this._throttleCalcProps, !0),
                window.removeEventListener('resize', this._throttleCalcProps)
            }
          }).displayName = 'Attachable Component'),
          t
        )
      }
    },
    481476: (e, t, n) => {
      n.d(t, { FormInput: () => c })
      var s = n(50959),
        r = n(654936),
        o = n(361988),
        a = n(102691),
        i = n(269842),
        l = n(525388)
      function c(e) {
        var t
        const {
            intent: n,
            onFocus: c,
            onBlur: h,
            onMouseOver: u,
            onMouseOut: d,
            containerReference: p = null,
            endSlot: m,
            hasErrors: g,
            hasWarnings: f,
            hasSuccessMessages: v,
            errors: b,
            warnings: S,
            successMessages: w,
            alwaysShowAttachedErrors: C,
            iconHidden: R,
            messagesPosition: y,
            messagesAttachment: M,
            customErrorsAttachment: E,
            messagesRoot: D,
            inheritMessagesWidthFromTarget: N,
            disableMessagesRtlStyles: F,
            'aria-required': W,
            'aria-invalid': P,
            'aria-label': x,
            inputDescription: k,
            ...A
          } = e,
          B = (0, o.useControlValidationLayout)({
            hasErrors: g,
            hasWarnings: f,
            hasSuccessMessages: v,
            errors: b,
            warnings: S,
            successMessages: w,
            alwaysShowAttachedErrors: C,
            iconHidden: R,
            messagesPosition: y,
            messagesAttachment: M,
            customErrorsAttachment: E,
            messagesRoot: D,
            inheritMessagesWidthFromTarget: N,
            disableMessagesRtlStyles: F,
            inputDescription: k,
          }),
          z = (0, i.createSafeMulticastEventHandler)(c, B.onFocus),
          I = (0, i.createSafeMulticastEventHandler)(h, B.onBlur),
          _ = (0, i.createSafeMulticastEventHandler)(u, B.onMouseOver),
          V = (0, i.createSafeMulticastEventHandler)(d, B.onMouseOut)
        return s.createElement(
          s.Fragment,
          null,
          s.createElement(r.InputControl, {
            ...A,
            intent: null !== (t = B.intent) && void 0 !== t ? t : n,
            onFocus: z,
            onBlur: I,
            onMouseOver: _,
            onMouseOut: V,
            containerReference: (0, l.useMergedRefs)([p, B.containerReference]),
            endSlot: s.createElement(
              s.Fragment,
              null,
              B.icon && s.createElement(a.EndSlot, { icon: !0 }, B.icon),
              m,
            ),
            'aria-required': W,
            'aria-invalid': P,
            'aria-describedby': B.ariaIds,
            'aria-label': x,
          }),
          B.renderedErrors,
        )
      }
    },
    361988: (e, t, n) => {
      n.d(t, { MessagesPosition: () => R, useControlValidationLayout: () => x })
      var s = n(50959),
        r = n(497754)
      function o(e, t) {
        ;(0, s.useEffect)(
          () => (
            t && t(e),
            () => {
              t && t(e)
            }
          ),
          [],
        )
      }
      var a = n(383836),
        i = n(522224),
        l = n(102691),
        c = n(579184),
        h = n(874485),
        u = n(841037),
        d = n(844022),
        p = n(710263)
      class m extends s.PureComponent {
        render() {
          const {
              children: e = [],
              show: t = !1,
              customErrorClass: n,
              disableRtlStyles: o,
              messageIdCallback: a,
            } = this.props,
            i = r(d.errors, { [d.show]: t }, n),
            l = e.map((e, t) =>
              s.createElement(f, { key: t, messageIdCallback: a }, e),
            )
          let c = {
            position: 'absolute',
            top: this.props.top,
            width: this.props.width,
            height: this.props.height,
            bottom: void 0 !== this.props.bottom ? this.props.bottom : '100%',
            right: void 0 !== this.props.right ? this.props.right : 0,
            left: this.props.left,
            zIndex: this.props.zIndex,
            maxWidth: this.props.maxWidth,
          }
          if ((0, p.isRtl)() && !o) {
            const { left: e, right: t } = c
            c = { ...c, left: t, right: e }
          }
          return s.createElement('div', { style: c, className: i }, l)
        }
      }
      const g = (0, h.makeOverlapable)((0, u.makeAttachable)(m))
      function f(e) {
        const { children: t, messageIdCallback: n, ...r } = e
        return s.createElement('div', { ...r, className: d.error }, t)
      }
      function v(e) {
        const { children: t, messageIdCallback: n, ...r } = e,
          a = s.useId()
        return (
          o(a, n),
          s.createElement(
            'span',
            { ...r, className: d['visually-hidden'], id: a },
            t,
          )
        )
      }
      var b = n(72571),
        S = n(616658),
        w = n(240461)
      function C(e) {
        const { intent: t = 'danger' } = e
        return s.createElement(b.Icon, {
          icon: S,
          className: r(w['error-icon'], w[`intent-${t}`]),
        })
      }
      var R,
        y,
        M = n(927345)
      !((e) => {
        ;(e[(e.Attached = 0)] = 'Attached'),
          (e[(e.Static = 1)] = 'Static'),
          (e[(e.Hidden = 2)] = 'Hidden')
      })(R || (R = {})),
        ((e) => {
          ;(e.Top = 'top'), (e.Bottom = 'bottom')
        })(y || (y = {}))
      const E = {
        top: {
          attachment: c.anchors.topRight.attachment,
          targetAttachment: c.anchors.topRight.targetAttachment,
          attachmentOffsetY: -4,
        },
        bottom: {
          attachment: c.anchors.bottomRight.attachment,
          targetAttachment: c.anchors.bottomRight.targetAttachment,
          attachmentOffsetY: 4,
        },
      }
      function D(e) {
        const {
            isOpened: t,
            target: n,
            errorAttachment: r = y.Top,
            customErrorsAttachment: o,
            root: a = 'parent',
            inheritWidthFromTarget: i = !1,
            disableRtlStyles: l,
            children: c,
            messageIdCallback: h,
          } = e,
          {
            attachment: u,
            targetAttachment: d,
            attachmentOffsetY: p,
          } = null != o ? o : E[r]
        return s.createElement(
          s.Fragment,
          null,
          s.createElement(
            g,
            {
              isOpened: t,
              target: n,
              root: a,
              inheritWidthFromTarget: i,
              attachment: u,
              targetAttachment: d,
              attachmentOffsetY: p,
              disableRtlStyles: l,
              messageIdCallback: h,
              inheritMaxWidthFromTarget: !0,
              show: !0,
            },
            c,
          ),
          s.createElement(v, { messageIdCallback: h }, c),
        )
      }
      function N(e, t) {
        return Boolean(e) && void 0 !== t && t.length > 0
      }
      function F(e, t, n) {
        return e === R.Attached && N(t, n)
      }
      function W(e, t, n) {
        return e === R.Static && N(t, n)
      }
      function P(e, t, n) {
        const {
            hasErrors: s,
            hasWarnings: r,
            hasSuccessMessages: o,
            alwaysShowAttachedErrors: a,
            iconHidden: i,
            errors: l,
            warnings: c,
            successMessages: h,
            messagesPosition: u = R.Static,
          } = e,
          d = F(u, s, l),
          p = F(u, r, c),
          m = d && (t || n || Boolean(a)),
          g = !m && p && (t || n),
          f = W(u, s, l),
          v = !f && W(u, r, c),
          b = !f && !v && W(u, o, h),
          S = !i && Boolean(s),
          w = !i && !S && Boolean(r),
          C = ((e, t, n) =>
            Boolean(n)
              ? 'success'
              : Boolean(e)
                ? 'danger'
                : Boolean(t)
                  ? 'warning'
                  : void 0)(s, r, o)
        return {
          hasAttachedErrorMessages: d,
          hasAttachedWarningMessages: p,
          showAttachedErrorMessages: m,
          showAttachedWarningMessages: g,
          showStaticErrorMessages: f,
          showStaticWarningMessages: v,
          showStaticSuccessMessages: b,
          showErrorIcon: S,
          showWarningIcon: w,
          intent: C,
        }
      }
      function x(e) {
        var t, n, o, c
        const {
            errors: h,
            warnings: u,
            successMessages: d,
            messagesAttachment: p,
            customErrorsAttachment: m,
            messagesRoot: g,
            inheritMessagesWidthFromTarget: f,
            disableMessagesRtlStyles: v,
            inputDescription: b,
          } = e,
          [S, w] = (0, a.useFocus)(),
          [R, y] = (0, i.useHover)(),
          E = (0, s.useRef)(null),
          [N, F] = s.useState(void 0),
          W = (0, s.useRef)(new Map()),
          x = s.useCallback(
            (e) => {
              if (!e) return
              const t = W.current
              t.has(e) ? t.delete(e) : t.set(e, e),
                0 !== t.size ? F(Array.from(t.keys()).join(' ')) : F(void 0)
            },
            [F, W.current],
          ),
          {
            hasAttachedErrorMessages: A,
            hasAttachedWarningMessages: B,
            showAttachedErrorMessages: z,
            showAttachedWarningMessages: I,
            showStaticErrorMessages: _,
            showStaticWarningMessages: V,
            showStaticSuccessMessages: Z,
            showErrorIcon: T,
            showWarningIcon: O,
            intent: L,
          } = P(e, S, R),
          U =
            T || O
              ? s.createElement(C, { intent: T ? 'danger' : 'warning' })
              : void 0,
          H = A
            ? s.createElement(D, {
                errorAttachment: p,
                customErrorsAttachment: m,
                isOpened: z,
                target: E.current,
                root: g,
                inheritWidthFromTarget: f,
                disableRtlStyles: v,
                children: h,
                messageIdCallback: x,
              })
            : void 0,
          K = B
            ? s.createElement(D, {
                errorAttachment: p,
                isOpened: I,
                target: E.current,
                root: g,
                inheritWidthFromTarget: f,
                disableRtlStyles: v,
                children: u,
                messageIdCallback: x,
              })
            : void 0,
          j = _
            ? s.createElement(
                l.AfterSlot,
                { className: r(M['static-messages'], M.errors) },
                null == h
                  ? void 0
                  : h.map((e, t) =>
                      s.createElement(k, { key: t, messageIdCallback: x }, e),
                    ),
              )
            : void 0,
          Y = V
            ? s.createElement(
                l.AfterSlot,
                { className: r(M['static-messages'], M.warnings) },
                null == u
                  ? void 0
                  : u.map((e, t) =>
                      s.createElement(k, { key: t, messageIdCallback: x }, e),
                    ),
              )
            : void 0,
          $ = Z
            ? s.createElement(
                l.AfterSlot,
                { className: r(M['static-messages'], M['success-mesages']) },
                null == d
                  ? void 0
                  : d.map((e, t) =>
                      s.createElement(k, { key: t, messageIdCallback: x }, e),
                    ),
              )
            : void 0,
          J =
            !_ && !V && !Z && b
              ? s.createElement(
                  l.AfterSlot,
                  {
                    className: r(M['static-messages'], M['input-description']),
                  },
                  s.createElement(k, { messageIdCallback: x }, b),
                )
              : void 0
        return {
          ariaIds: N,
          icon: U,
          renderedErrors:
            null !==
              (c =
                null !==
                  (o =
                    null !==
                      (n =
                        null !== (t = null != H ? H : K) && void 0 !== t
                          ? t
                          : j) && void 0 !== n
                      ? n
                      : Y) && void 0 !== o
                  ? o
                  : $) && void 0 !== c
              ? c
              : J,
          containerReference: E,
          intent: L,
          ...w,
          ...y,
        }
      }
      function k(e) {
        const { children: t, messageIdCallback: n, ...r } = e,
          a = s.useId()
        return (
          o(a, n),
          s.createElement('span', { ...r, className: M.message, id: a }, t)
        )
      }
    },
    602948: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M3.92 7.83 9 12.29l5.08-4.46-1-1.13L9 10.29l-4.09-3.6-.99 1.14Z"/></svg>'
    },
    616658: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" fill-rule="evenodd" d="M9 16A7 7 0 1 0 9 2a7 7 0 0 0 0 14Zm0 1A8 8 0 1 0 9 1a8 8 0 0 0 0 16ZM8 5a1 1 0 0 1 2 0v4a1 1 0 1 1-2 0V5Zm1 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></svg>'
    },
  },
])
