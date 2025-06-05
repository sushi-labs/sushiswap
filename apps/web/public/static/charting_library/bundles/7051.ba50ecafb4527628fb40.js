;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7051, 2544, 5057],
  {
    59142: (e, t) => {
      var n, o, s
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
          var s =
              'undefined' != typeof window &&
              window.navigator &&
              window.navigator.platform &&
              /iP(ad|hone|od)/.test(window.navigator.platform),
            r = [],
            i = !1,
            a = -1,
            l = void 0,
            c = void 0,
            u = (e) =>
              r.some(
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
            p = () => {
              setTimeout(() => {
                void 0 !== c &&
                  ((document.body.style.paddingRight = c), (c = void 0)),
                  void 0 !== l &&
                    ((document.body.style.overflow = l), (l = void 0))
              })
            }
          ;(e.disableBodyScroll = (e, o) => {
            if (s) {
              if (!e)
                return void console.error(
                  'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
                )
              if (e && !r.some((t) => t.targetElement === e)) {
                var p = { targetElement: e, options: o || {} }
                ;(r = [].concat(t(r), [p])),
                  (e.ontouchstart = (e) => {
                    1 === e.targetTouches.length &&
                      (a = e.targetTouches[0].clientY)
                  }),
                  (e.ontouchmove = (t) => {
                    var n, o, s, r
                    1 === t.targetTouches.length &&
                      ((o = e),
                      (r = (n = t).targetTouches[0].clientY - a),
                      !u(n.target) &&
                        ((o && 0 === o.scrollTop && 0 < r) ||
                        ((s = o) &&
                          s.scrollHeight - s.scrollTop <= s.clientHeight &&
                          r < 0)
                          ? d(n)
                          : n.stopPropagation()))
                  }),
                  i ||
                    (document.addEventListener(
                      'touchmove',
                      d,
                      n ? { passive: !1 } : void 0,
                    ),
                    (i = !0))
              }
            } else {
              ;(m = o),
                setTimeout(() => {
                  if (void 0 === c) {
                    var e = !!m && !0 === m.reserveScrollBarGap,
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
              var h = { targetElement: e, options: o || {} }
              r = [].concat(t(r), [h])
            }
            var m
          }),
            (e.clearAllBodyScrollLocks = () => {
              s
                ? (r.forEach((e) => {
                    ;(e.targetElement.ontouchstart = null),
                      (e.targetElement.ontouchmove = null)
                  }),
                  i &&
                    (document.removeEventListener(
                      'touchmove',
                      d,
                      n ? { passive: !1 } : void 0,
                    ),
                    (i = !1)),
                  (r = []),
                  (a = -1))
                : (p(), (r = []))
            }),
            (e.enableBodyScroll = (e) => {
              if (s) {
                if (!e)
                  return void console.error(
                    'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                  )
                ;(e.ontouchstart = null),
                  (e.ontouchmove = null),
                  (r = r.filter((t) => t.targetElement !== e)),
                  i &&
                    0 === r.length &&
                    (document.removeEventListener(
                      'touchmove',
                      d,
                      n ? { passive: !1 } : void 0,
                    ),
                    (i = !1))
              } else
                1 === r.length && r[0].targetElement === e
                  ? (p(), (r = []))
                  : (r = r.filter((t) => t.targetElement !== e))
            })
        }),
        void 0 === (s = 'function' == typeof n ? n.apply(t, o) : n) ||
          (e.exports = s)
    },
    74786: (e, t, n) => {
      n.d(t, { default: () => o })
      const o = () => {}
    },
    23428: (e) => {
      e.exports = {
        button: 'button-PYEOTd6i',
        disabled: 'disabled-PYEOTd6i',
        hidden: 'hidden-PYEOTd6i',
        icon: 'icon-PYEOTd6i',
        dropped: 'dropped-PYEOTd6i',
      }
    },
    45350: (e) => {
      e.exports = {
        'nav-button': 'nav-button-znwuaSC1',
        link: 'link-znwuaSC1',
        background: 'background-znwuaSC1',
        icon: 'icon-znwuaSC1',
        'flip-icon': 'flip-icon-znwuaSC1',
        'size-large': 'size-large-znwuaSC1',
        'preserve-paddings': 'preserve-paddings-znwuaSC1',
        'size-medium': 'size-medium-znwuaSC1',
        'size-small': 'size-small-znwuaSC1',
        'size-xsmall': 'size-xsmall-znwuaSC1',
        'size-xxsmall': 'size-xxsmall-znwuaSC1',
        'visually-hidden': 'visually-hidden-znwuaSC1',
      }
    },
    70048: (e) => {
      e.exports = {
        wrapper: 'wrapper-GZajBGIm',
        input: 'input-GZajBGIm',
        box: 'box-GZajBGIm',
        icon: 'icon-GZajBGIm',
        noOutline: 'noOutline-GZajBGIm',
        'intent-danger': 'intent-danger-GZajBGIm',
        check: 'check-GZajBGIm',
        dot: 'dot-GZajBGIm',
      }
    },
    69789: (e) => {
      e.exports = {
        checkbox: 'checkbox-vyj6oJxw',
        reverse: 'reverse-vyj6oJxw',
        label: 'label-vyj6oJxw',
        baseline: 'baseline-vyj6oJxw',
      }
    },
    22623: (e) => {
      e.exports = {
        'textarea-container': 'textarea-container-x5KHDULU',
        'change-highlight': 'change-highlight-x5KHDULU',
        focused: 'focused-x5KHDULU',
        'resize-vertical': 'resize-vertical-x5KHDULU',
        'resize-horizontal': 'resize-horizontal-x5KHDULU',
        'resize-both': 'resize-both-x5KHDULU',
        textarea: 'textarea-x5KHDULU',
        'with-icon': 'with-icon-x5KHDULU',
        endslot: 'endslot-x5KHDULU',
      }
    },
    78370: (e) => {
      e.exports = {
        'intent-default': 'intent-default-EZuD3gZZ',
        'intent-danger': 'intent-danger-EZuD3gZZ',
        'intent-warning': 'intent-warning-EZuD3gZZ',
        'intent-success': 'intent-success-EZuD3gZZ',
        'icon-wrapper-size-small': 'icon-wrapper-size-small-EZuD3gZZ',
        'icon-wrapper-size-medium': 'icon-wrapper-size-medium-EZuD3gZZ',
        'icon-wrapper-size-large': 'icon-wrapper-size-large-EZuD3gZZ',
        'icon-wrapper': 'icon-wrapper-EZuD3gZZ',
        icon: 'icon-EZuD3gZZ',
      }
    },
    88400: (e) => {
      e.exports = {
        radio: 'radio-ALqkCUvs',
        input: 'input-ALqkCUvs',
        box: 'box-ALqkCUvs',
        reverse: 'reverse-ALqkCUvs',
        label: 'label-ALqkCUvs',
        wrapper: 'wrapper-ALqkCUvs',
        noOutline: 'noOutline-ALqkCUvs',
      }
    },
    52272: (e) => {
      e.exports = {
        wrap: 'wrap-QStmZL8l',
        thicknessItem: 'thicknessItem-QStmZL8l',
        checked: 'checked-QStmZL8l',
        accessible: 'accessible-QStmZL8l',
        focusVisible: 'focusVisible-QStmZL8l',
        radio: 'radio-QStmZL8l',
        bar: 'bar-QStmZL8l',
      }
    },
    12863: (e) => {
      e.exports = { innerLabel: 'innerLabel-DjbvBF5Y' }
    },
    21234: (e) => {
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
    55596: (e) => {
      e.exports = {
        dialog: 'dialog-b8SxMnzX',
        wrapper: 'wrapper-b8SxMnzX',
        separator: 'separator-b8SxMnzX',
        bounded: 'bounded-b8SxMnzX',
      }
    },
    69827: (e) => {
      e.exports = {
        'small-height-breakpoint': 'screen and (max-height: 360px)',
        container: 'container-BZKENkhT',
        unsetAlign: 'unsetAlign-BZKENkhT',
        title: 'title-BZKENkhT',
        subtitle: 'subtitle-BZKENkhT',
        textWrap: 'textWrap-BZKENkhT',
        ellipsis: 'ellipsis-BZKENkhT',
        close: 'close-BZKENkhT',
        icon: 'icon-BZKENkhT',
      }
    },
    60015: (e) => {
      e.exports = {
        wrap: 'wrap-ne5qGlZh',
        icon: 'icon-ne5qGlZh',
        text: 'text-ne5qGlZh',
        disabled: 'disabled-ne5qGlZh',
      }
    },
    28685: (e) => {
      e.exports = {
        colorPickerWrap: 'colorPickerWrap-Sw_a4qpB',
        focused: 'focused-Sw_a4qpB',
        readonly: 'readonly-Sw_a4qpB',
        disabled: 'disabled-Sw_a4qpB',
        'size-small': 'size-small-Sw_a4qpB',
        'size-medium': 'size-medium-Sw_a4qpB',
        'size-large': 'size-large-Sw_a4qpB',
        'font-size-small': 'font-size-small-Sw_a4qpB',
        'font-size-medium': 'font-size-medium-Sw_a4qpB',
        'font-size-large': 'font-size-large-Sw_a4qpB',
        'border-none': 'border-none-Sw_a4qpB',
        shadow: 'shadow-Sw_a4qpB',
        'border-thin': 'border-thin-Sw_a4qpB',
        'border-thick': 'border-thick-Sw_a4qpB',
        'intent-default': 'intent-default-Sw_a4qpB',
        'intent-success': 'intent-success-Sw_a4qpB',
        'intent-warning': 'intent-warning-Sw_a4qpB',
        'intent-danger': 'intent-danger-Sw_a4qpB',
        'intent-primary': 'intent-primary-Sw_a4qpB',
        'corner-top-left': 'corner-top-left-Sw_a4qpB',
        'corner-top-right': 'corner-top-right-Sw_a4qpB',
        'corner-bottom-right': 'corner-bottom-right-Sw_a4qpB',
        'corner-bottom-left': 'corner-bottom-left-Sw_a4qpB',
        colorPicker: 'colorPicker-Sw_a4qpB',
        swatch: 'swatch-Sw_a4qpB',
        placeholderContainer: 'placeholderContainer-Sw_a4qpB',
        placeholder: 'placeholder-Sw_a4qpB',
        mixedColor: 'mixedColor-Sw_a4qpB',
        white: 'white-Sw_a4qpB',
        opacitySwatch: 'opacitySwatch-Sw_a4qpB',
        colorLine: 'colorLine-Sw_a4qpB',
        multiWidth: 'multiWidth-Sw_a4qpB',
        line: 'line-Sw_a4qpB',
        thicknessContainer: 'thicknessContainer-Sw_a4qpB',
        thicknessTitle: 'thicknessTitle-Sw_a4qpB',
      }
    },
    86536: (e) => {
      e.exports = {
        thicknessContainer: 'thicknessContainer-C05zSid7',
        thicknessTitle: 'thicknessTitle-C05zSid7',
      }
    },
    69006: (e) => {
      e.exports = {
        hasTooltip: 'hasTooltip-DcvaoxPU',
        uppercase: 'uppercase-DcvaoxPU',
      }
    },
    2746: (e) => {
      e.exports = { wrap: 'wrap-Q2NZ0gvI' }
    },
    25679: (e) => {
      e.exports = { checkbox: 'checkbox-FG0u1J5p', title: 'title-FG0u1J5p' }
    },
    41125: (e) => {
      e.exports = { hintButton: 'hintButton-qEI9XsjF' }
    },
    69750: (e) => {
      e.exports = { titleWrap: 'titleWrap-SexRbl__', title: 'title-SexRbl__' }
    },
    63581: (e) => {
      e.exports = {
        button: 'button-HBcDEU4c',
        accessible: 'accessible-HBcDEU4c',
      }
    },
    93402: (e) => {
      e.exports = {
        container: 'container-mdcOkvbj',
        sectionTitle: 'sectionTitle-mdcOkvbj',
        separator: 'separator-mdcOkvbj',
        customButton: 'customButton-mdcOkvbj',
        accessible: 'accessible-mdcOkvbj',
      }
    },
    80679: (e) => {
      e.exports = {
        container: 'container-iiEYaqPD',
        form: 'form-iiEYaqPD',
        swatch: 'swatch-iiEYaqPD',
        inputWrap: 'inputWrap-iiEYaqPD',
        inputHash: 'inputHash-iiEYaqPD',
        input: 'input-iiEYaqPD',
        buttonWrap: 'buttonWrap-iiEYaqPD',
        hueSaturationWrap: 'hueSaturationWrap-iiEYaqPD',
        saturation: 'saturation-iiEYaqPD',
        hue: 'hue-iiEYaqPD',
      }
    },
    1369: (e) => {
      e.exports = {
        hue: 'hue-r4uo5Wn6',
        pointer: 'pointer-r4uo5Wn6',
        accessible: 'accessible-r4uo5Wn6',
        pointerContainer: 'pointerContainer-r4uo5Wn6',
      }
    },
    30099: (e) => {
      e.exports = {
        opacity: 'opacity-EnWts7Xu',
        opacitySlider: 'opacitySlider-EnWts7Xu',
        opacitySliderGradient: 'opacitySliderGradient-EnWts7Xu',
        pointer: 'pointer-EnWts7Xu',
        dragged: 'dragged-EnWts7Xu',
        opacityPointerWrap: 'opacityPointerWrap-EnWts7Xu',
        opacityInputWrap: 'opacityInputWrap-EnWts7Xu',
        opacityInput: 'opacityInput-EnWts7Xu',
        opacityInputPercent: 'opacityInputPercent-EnWts7Xu',
        accessible: 'accessible-EnWts7Xu',
      }
    },
    35257: (e) => {
      e.exports = {
        saturation: 'saturation-NFNfqP2w',
        pointer: 'pointer-NFNfqP2w',
        accessible: 'accessible-NFNfqP2w',
      }
    },
    87466: (e) => {
      e.exports = {
        swatches: 'swatches-sfn7Lezv',
        swatch: 'swatch-sfn7Lezv',
        hover: 'hover-sfn7Lezv',
        empty: 'empty-sfn7Lezv',
        white: 'white-sfn7Lezv',
        selected: 'selected-sfn7Lezv',
        contextItem: 'contextItem-sfn7Lezv',
        row: 'row-sfn7Lezv',
      }
    },
    66986: (e) => {
      e.exports = {
        button: 'button-tFul0OhX',
        'button-children': 'button-children-tFul0OhX',
        hiddenArrow: 'hiddenArrow-tFul0OhX',
        invisibleFocusHandler: 'invisibleFocusHandler-tFul0OhX',
      }
    },
    42335: (e) => {
      e.exports = {
        'icon-wrapper': 'icon-wrapper-dikdewwx',
        'with-tooltip': 'with-tooltip-dikdewwx',
        'no-active-state': 'no-active-state-dikdewwx',
      }
    },
    60673: (e) => {
      e.exports = { placeholder: 'placeholder-V6ceS6BN' }
    },
    40191: (e) => {
      e.exports = {
        menuWrap: 'menuWrap-Kq3ruQo8',
        isMeasuring: 'isMeasuring-Kq3ruQo8',
        scrollWrap: 'scrollWrap-Kq3ruQo8',
        momentumBased: 'momentumBased-Kq3ruQo8',
        menuBox: 'menuBox-Kq3ruQo8',
        isHidden: 'isHidden-Kq3ruQo8',
      }
    },
    45719: (e) => {
      e.exports = { separator: 'separator-Pf4rIzEt' }
    },
    57340: (e, t, n) => {
      n.d(t, { CloseButton: () => d })
      var o = n(50959),
        s = n(64388),
        r = n(17105),
        i = n(15130),
        a = n(38822),
        l = n(63346),
        c = n(34983)
      function u(e = 'large') {
        switch (e) {
          case 'large':
            return r
          case 'medium':
          default:
            return i
          case 'small':
            return a
          case 'xsmall':
            return l
          case 'xxsmall':
            return c
        }
      }
      const d = o.forwardRef((e, t) =>
        o.createElement(s.NavButton, { ...e, ref: t, icon: u(e.size) }),
      )
    },
    64388: (e, t, n) => {
      n.d(t, { NavButton: () => c })
      var o = n(50959),
        s = n(97754),
        r = n(9745),
        i = n(45350)
      function a(e) {
        const {
          size: t = 'large',
          preservePaddings: n,
          isLink: o,
          flipIconOnRtl: r,
          className: a,
        } = e
        return s(
          i['nav-button'],
          i[`size-${t}`],
          n && i['preserve-paddings'],
          r && i['flip-icon'],
          o && i.link,
          a,
        )
      }
      function l(e) {
        const { children: t, icon: n } = e
        return o.createElement(
          o.Fragment,
          null,
          o.createElement('span', { className: i.background }),
          o.createElement(r.Icon, {
            icon: n,
            className: i.icon,
            'aria-hidden': !0,
          }),
          t && o.createElement('span', { className: i['visually-hidden'] }, t),
        )
      }
      const c = (0, o.forwardRef)((e, t) => {
        const {
          icon: n,
          type: s = 'button',
          preservePaddings: r,
          flipIconOnRtl: i,
          size: c,
          'aria-label': u,
          ...d
        } = e
        return o.createElement(
          'button',
          { ...d, className: a({ ...e, children: u }), ref: t, type: s },
          o.createElement(l, { icon: n }, u),
        )
      })
      c.displayName = 'NavButton'
      var u = n(21593),
        d = n(53017)
      ;(0, o.forwardRef)((e, t) => {
        const { icon: n, renderComponent: s, 'aria-label': r, ...i } = e,
          c = null != s ? s : u.CustomComponentDefaultLink
        return o.createElement(
          c,
          {
            ...i,
            className: a({ ...e, children: r, isLink: !0 }),
            reference: (0, d.isomorphicRef)(t),
          },
          o.createElement(l, { icon: n }, r),
        )
      }).displayName = 'NavAnchorButton'
    },
    70673: (e, t, n) => {
      n.d(t, { CheckboxInput: () => u })
      var o = n(50959),
        s = n(97754),
        r = n(90186),
        i = n(9745),
        a = n(65890),
        l = n(70048),
        c = n.n(l)
      function u(e) {
        const t = s(c().box, c()[`intent-${e.intent}`], {
            [c().check]: !Boolean(e.indeterminate),
            [c().dot]: Boolean(e.indeterminate),
            [c().noOutline]: -1 === e.tabIndex,
          }),
          n = s(c().wrapper, e.className)
        return o.createElement(
          'span',
          { className: n, title: e.title, style: e.style },
          o.createElement('input', {
            id: e.id,
            tabIndex: e.tabIndex,
            className: c().input,
            type: 'checkbox',
            name: e.name,
            checked: e.checked,
            disabled: e.disabled,
            value: e.value,
            autoFocus: e.autoFocus,
            role: e.role,
            onChange: () => {
              e.onChange && e.onChange(e.value)
            },
            ref: e.reference,
            'aria-required': e['aria-required'],
            'aria-describedby': e['aria-describedby'],
            'aria-invalid': e['aria-invalid'],
            ...(0, r.filterDataProps)(e),
          }),
          o.createElement(
            'span',
            { className: t },
            o.createElement(i.Icon, { icon: a, className: c().icon }),
          ),
        )
      }
    },
    15294: (e, t, n) => {
      n.d(t, { Checkbox: () => c })
      var o = n(50959),
        s = n(97754),
        r = n(59416),
        i = n(70673),
        a = n(69789),
        l = n.n(a)
      class c extends o.PureComponent {
        render() {
          const { inputClassName: e, labelClassName: t, ...n } = this.props,
            r = s(this.props.className, l().checkbox, {
              [l().reverse]: Boolean(this.props.labelPositionReverse),
              [l().baseline]: Boolean(this.props.labelAlignBaseline),
            }),
            a = s(l().label, t, { [l().disabled]: this.props.disabled })
          let c = null
          return (
            this.props.label &&
              (c = o.createElement(
                'span',
                { className: a, title: this.props.title },
                this.props.label,
              )),
            o.createElement(
              'label',
              { className: r },
              o.createElement(i.CheckboxInput, { ...n, className: e }),
              c,
            )
          )
        }
      }
      c.defaultProps = { value: 'on' }
      ;(0, r.makeSwitchGroupItem)(c)
    },
    2568: (e, t, n) => {
      n.d(t, { Textarea: () => C })
      var o,
        s = n(50959),
        r = n(97754),
        i = n(38528),
        a = n(29202),
        l = n(48027),
        c = n(45812),
        u = n(47201),
        d = n(48907),
        p = n(67029),
        h = n(78274),
        m = n(22623),
        v = n.n(m)
      !((e) => {
        ;(e.None = 'none'),
          (e.Vertical = 'vertical'),
          (e.Horizontal = 'horizontal'),
          (e.Both = 'both')
      })(o || (o = {}))
      const f = s.forwardRef((e, t) => {
        const {
            id: n,
            title: o,
            tabIndex: i,
            containerTabIndex: a,
            role: l,
            inputClassName: c,
            autoComplete: u,
            autoFocus: d,
            cols: m,
            disabled: f,
            isFocused: g,
            form: b,
            maxLength: C,
            minLength: y,
            name: E,
            placeholder: w,
            readonly: _,
            required: S,
            rows: x,
            value: N,
            defaultValue: T,
            wrap: I,
            containerReference: k,
            onChange: B,
            onSelect: P,
            onFocus: D,
            onContainerFocus: M,
            onBlur: O,
            onPaste: R,
            'aria-describedby': L,
            'aria-required': A,
            'aria-invalid': F,
            hasIcon: W,
            endSlot: V,
            hasAttachImage: z,
            ...q
          } = e,
          K = {
            id: n,
            title: o,
            tabIndex: i,
            role: l,
            autoComplete: u,
            autoFocus: d,
            cols: m,
            disabled: f,
            form: b,
            maxLength: C,
            minLength: y,
            name: E,
            placeholder: w,
            readOnly: _,
            required: S,
            rows: x,
            value: N,
            defaultValue: T,
            wrap: I,
            onChange: B,
            onSelect: P,
            onFocus: D,
            onBlur: O,
            onPaste: R,
            'aria-describedby': L,
            'aria-required': A,
            'aria-invalid': F,
          }
        return s.createElement(p.ControlSkeleton, {
          ...q,
          tabIndex: a,
          disabled: f,
          readonly: _,
          isFocused: g,
          ref: k,
          onFocus: M,
          middleSlot: s.createElement(
            h.MiddleSlot,
            null,
            s.createElement('textarea', {
              ...K,
              className: r(v().textarea, c, V && v().endslot),
              ref: t,
            }),
          ),
          ...(V && {
            endSlot: s.createElement(
              'span',
              { className: r(!z && v()['with-icon']) },
              V,
            ),
          }),
        })
      })
      f.displayName = 'TextareaView'
      const g = (e, t, n) => (t ? void 0 : e ? -1 : n),
        b = (e, t, n) => (t ? void 0 : e ? n : -1),
        C = s.forwardRef((e, t) => {
          e = (0, l.useControl)(e)
          const {
              className: n,
              disabled: p,
              autoSelectOnFocus: h,
              tabIndex: m = 0,
              borderStyle: C,
              highlight: y,
              resize: E,
              containerReference: w = null,
              onFocus: _,
              onBlur: S,
              hasIcon: x,
              ...N
            } = e,
            T = (0, s.useRef)(null),
            I = (0, s.useRef)(null),
            {
              isMouseDown: k,
              handleMouseDown: B,
              handleMouseUp: P,
            } = (0, c.useIsMouseDown)(),
            [D, M] = (0, a.useFocus)(),
            O = (0, u.createSafeMulticastEventHandler)(
              M.onFocus,
              (e) => {
                h && !k.current && (0, d.selectAllContent)(e.currentTarget)
              },
              _,
            ),
            R = (0, u.createSafeMulticastEventHandler)(M.onBlur, S),
            L = void 0 !== E && E !== o.None,
            A = null != C ? C : L ? (y ? 'thick' : 'thin') : void 0,
            F = null != y ? y : !L && void 0
          return s.createElement(f, {
            ...N,
            className: r(
              v()['textarea-container'],
              L && v()['change-highlight'],
              E && E !== o.None && v()[`resize-${E}`],
              D && v().focused,
              n,
            ),
            disabled: p,
            isFocused: D,
            containerTabIndex: g(D, p, m),
            tabIndex: b(D, p, m),
            borderStyle: A,
            highlight: F,
            onContainerFocus: (e) => {
              I.current === e.target && null !== T.current && T.current.focus()
            },
            onFocus: O,
            onBlur: R,
            onMouseDown: B,
            onMouseUp: P,
            ref: (e) => {
              ;(T.current = e),
                'function' == typeof t ? t(e) : t && (t.current = e)
            },
            containerReference: (0, i.useMergedRefs)([w, I]),
            hasIcon: x,
          })
        })
      C.displayName = 'Textarea'
    },
    38952: (e, t, n) => {
      function o(e) {
        const { reference: t, ...n } = e
        return { ...n, ref: t }
      }
      n.d(t, { renameRef: () => o })
    },
    21593: (e, t, n) => {
      n.d(t, { CustomComponentDefaultLink: () => r })
      var o = n(50959),
        s = n(38952)
      function r(e) {
        return o.createElement('a', { ...(0, s.renameRef)(e) })
      }
      o.PureComponent
    },
    36104: (e, t, n) => {
      n.d(t, { useControlDisclosure: () => s })
      var o = n(7953)
      function s(e) {
        const { intent: t, highlight: n, ...s } = e,
          { isFocused: r, ...i } = (0, o.useDisclosure)(s)
        return {
          ...i,
          isFocused: r,
          highlight: null != n ? n : r,
          intent: null != t ? t : r ? 'primary' : 'default',
        }
      }
    },
    36383: (e, t, n) => {
      n.d(t, { useOutsideEvent: () => r })
      var o = n(50959),
        s = n(27267)
      function r(e) {
        const {
            click: t,
            mouseDown: n,
            touchEnd: r,
            touchStart: i,
            handler: a,
            reference: l,
            ownerDocument: c = document,
          } = e,
          u = (0, o.useRef)(null),
          d = (0, o.useRef)(new CustomEvent('timestamp').timeStamp)
        return (
          (0, o.useLayoutEffect)(() => {
            const e = { click: t, mouseDown: n, touchEnd: r, touchStart: i },
              o = l ? l.current : u.current
            return (0, s.addOutsideEventListener)(d.current, o, a, c, e)
          }, [t, n, r, i, a]),
          l || u
        )
      }
    },
    9745: (e, t, n) => {
      n.d(t, { Icon: () => s })
      var o = n(50959)
      const s = o.forwardRef((e, t) => {
        const { icon: n = '', ...s } = e
        return o.createElement('span', {
          ...s,
          ref: t,
          dangerouslySetInnerHTML: { __html: n },
        })
      })
    },
    83021: (e, t, n) => {
      n.d(t, { SubmenuContext: () => s, SubmenuHandler: () => r })
      var o = n(50959)
      const s = o.createContext(null)
      function r(e) {
        const [t, n] = (0, o.useState)(null),
          r = (0, o.useRef)(null),
          i = (0, o.useRef)(new Map())
        return (
          (0, o.useEffect)(
            () => () => {
              null !== r.current && clearTimeout(r.current)
            },
            [],
          ),
          o.createElement(
            s.Provider,
            {
              value: {
                current: t,
                setCurrent: (e) => {
                  null !== r.current &&
                    (clearTimeout(r.current), (r.current = null))
                  null === t
                    ? n(e)
                    : (r.current = setTimeout(() => {
                        ;(r.current = null), n(e)
                      }, 100))
                },
                registerSubmenu: (e, t) => (
                  i.current.set(e, t),
                  () => {
                    i.current.delete(e)
                  }
                ),
                isSubmenuNode: (e) =>
                  Array.from(i.current.values()).some((t) => t(e)),
              },
            },
            e.children,
          )
        )
      }
    },
    99663: (e, t, n) => {
      n.d(t, { Slot: () => s, SlotContext: () => r })
      var o = n(50959)
      class s extends o.Component {
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
      const r = o.createContext(null)
    },
    59416: (e, t, n) => {
      n.d(t, { SwitchGroup: () => i, makeSwitchGroupItem: () => a })
      var o = n(50959),
        s = n(74786)
      const r = (0, o.createContext)({
        getName: () => '',
        getValues: () => [],
        getOnChange: () => s.default,
        subscribe: s.default,
        unsubscribe: s.default,
      })
      class i extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._subscriptions = new Set()),
            (this._getName = () => this.props.name),
            (this._getValues = () => this.props.values),
            (this._getOnChange = () => this.props.onChange),
            (this._subscribe = (e) => {
              this._subscriptions.add(e)
            }),
            (this._unsubscribe = (e) => {
              this._subscriptions.delete(e)
            }),
            (this.state = {
              switchGroupContext: {
                getName: this._getName,
                getValues: this._getValues,
                getOnChange: this._getOnChange,
                subscribe: this._subscribe,
                unsubscribe: this._unsubscribe,
              },
            })
        }
        render() {
          return o.createElement(
            r.Provider,
            { value: this.state.switchGroupContext },
            this.props.children,
          )
        }
        componentDidUpdate(e) {
          this._notify(this._getUpdates(this.props.values, e.values))
        }
        _notify(e) {
          this._subscriptions.forEach((t) => t(e))
        }
        _getUpdates(e, t) {
          return [...t, ...e].filter((n) =>
            t.includes(n) ? !e.includes(n) : e.includes(n),
          )
        }
      }
      function a(e) {
        var t
        return (
          (t = class extends o.PureComponent {
            constructor() {
              super(...arguments),
                (this._onChange = (e) => {
                  this.context.getOnChange()(e)
                }),
                (this._onUpdate = (e) => {
                  e.includes(this.props.value) && this.forceUpdate()
                })
            }
            componentDidMount() {
              this.context.subscribe(this._onUpdate)
            }
            render() {
              return o.createElement(e, {
                ...this.props,
                name: this._getName(),
                onChange: this._onChange,
                checked: this._isChecked(),
              })
            }
            componentWillUnmount() {
              this.context.unsubscribe(this._onUpdate)
            }
            _getName() {
              return this.context.getName()
            }
            _isChecked() {
              return this.context.getValues().includes(this.props.value)
            }
          }),
          (t.contextType = r),
          t
        )
      }
    },
    67961: (e, t, n) => {
      n.d(t, { OverlapManager: () => r, getRootOverlapManager: () => a })
      var o = n(50151)
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
        moveToTop(e) {
          if (this.getZindex(e) !== this._index) {
            this.ensureWindow(e).style.zIndex = (++this._index).toString()
          }
        }
        removeWindow(e) {
          this.unregisterWindow(e)
        }
      }
      const i = new WeakMap()
      function a(e = document) {
        const t = e.getElementById('overlap-manager-root')
        if (null !== t) return (0, o.ensureDefined)(i.get(t))
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
          return i.set(n, t), t.setContainer(n), e.body.appendChild(n), t
        }
      }
    },
    92399: (e, t, n) => {
      n.d(t, { NumberInputView: () => I })
      var o = n(50959),
        s = n(32563),
        r = n(97754),
        i = n(67029),
        a = n(78274),
        l = n(86623),
        c = n(95263),
        u = n(1405),
        d = n(12863)
      const p = {
          large: i.InputClasses.FontSizeLarge,
          medium: i.InputClasses.FontSizeMedium,
        },
        h = {
          attachment: u.anchors.top.attachment,
          targetAttachment: u.anchors.top.targetAttachment,
          attachmentOffsetY: -4,
        }
      function m(e) {
        const {
            className: t,
            inputClassName: n,
            stretch: s = !0,
            errorMessage: i,
            fontSizeStyle: u = 'large',
            endSlot: m,
            button: v,
            error: f,
            warning: g,
            innerLabel: b,
            inputReference: C,
            children: y,
            ...E
          } = e,
          w = f && void 0 !== i ? [i] : void 0,
          _ = g && void 0 !== i ? [i] : void 0,
          S = r(d.inputContainer, p[u], t),
          x = b
            ? o.createElement(
                a.StartSlot,
                { className: d.innerLabel, interactive: !1 },
                b,
              )
            : void 0,
          N = m || v || y ? o.createElement(a.EndSlot, null, m, v, y) : void 0
        return o.createElement(l.FormInput, {
          ...E,
          className: S,
          inputClassName: n,
          errors: w,
          warnings: _,
          hasErrors: f,
          hasWarnings: g,
          messagesPosition: c.MessagesPosition.Attached,
          customErrorsAttachment: h,
          messagesRoot: 'document',
          inheritMessagesWidthFromTarget: !0,
          disableMessagesRtlStyles: !0,
          iconHidden: !0,
          stretch: s,
          reference: C,
          startSlot: x,
          endSlot: N,
        })
      }
      var v = n(38528),
        f = n(11542),
        g = n(9745),
        b = n(21861),
        C = n(2948),
        y = n(21234)
      function E(e) {
        const t = r(y.control, y.controlIncrease),
          s = r(y.control, y.controlDecrease)
        return o.createElement(
          o.Fragment,
          null,
          void 0 !== e.title &&
            o.createElement('div', { className: y.title }, e.title),
          o.createElement(
            'div',
            { className: y.controlWrapper },
            (e.defaultButtonsVisible || e.title) &&
              o.createElement(
                o.Fragment,
                null,
                o.createElement(
                  'button',
                  {
                    type: 'button',
                    tabIndex: -1,
                    'aria-label': f.t(null, void 0, n(46812)),
                    className: t,
                    onClick: e.increaseValue,
                    onMouseDown: b.preventDefault,
                  },
                  o.createElement(g.Icon, {
                    icon: C,
                    className: y.controlIcon,
                  }),
                ),
                o.createElement(
                  'button',
                  {
                    type: 'button',
                    tabIndex: -1,
                    'aria-label': f.t(null, void 0, n(56095)),
                    className: s,
                    onClick: e.decreaseValue,
                    onMouseDown: b.preventDefault,
                  },
                  o.createElement(g.Icon, {
                    icon: C,
                    className: y.controlIcon,
                  }),
                ),
              ),
          ),
        )
      }
      var w = n(70412),
        _ = n(29202),
        S = n(47201),
        x = n(68335)
      const N = [38],
        T = [40]
      function I(e) {
        const [t, n] = (0, w.useHover)(),
          [r, i] = (0, _.useFocus)(),
          a = (0, o.useRef)(null),
          l = (0, S.createSafeMulticastEventHandler)(i.onFocus, e.onFocus),
          c = (0, S.createSafeMulticastEventHandler)(i.onBlur, e.onBlur),
          u = (0, o.useCallback)(
            (t) => {
              !e.disabled &&
                r &&
                (t.preventDefault(),
                t.deltaY < 0
                  ? e.onValueByStepChange(1)
                  : e.onValueByStepChange(-1))
            },
            [r, e.disabled, e.onValueByStepChange],
          )
        return o.createElement(m, {
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
                forceShowControls: i,
                disabled: a,
                title: l,
              } = e,
              c = !a && !s.mobiletouch && (i || r || t)
            return a
              ? void 0
              : o.createElement(
                  o.Fragment,
                  null,
                  null != n
                    ? n
                    : o.createElement(E, {
                        increaseValue: d,
                        decreaseValue: p,
                        defaultButtonsVisible: c,
                        title: l,
                      }),
                )
          })(),
          disabled: e.disabled,
          placeholder: e.placeholder,
          innerLabel: e.innerLabel,
          endSlot: e.endSlot,
          containerReference: (0, v.useMergedRefs)([a, e.containerReference]),
          inputReference: e.inputReference,
          inputMode: e.inputMode,
          type: e.type,
          warning: e.warning,
          error: e.error,
          errorMessage: e.errorMessage,
          onClick: e.onClick,
          onFocus: l,
          onBlur: c,
          onChange: e.onValueChange,
          onKeyDown: (t) => {
            if (e.disabled || 0 !== (0, x.modifiersFromEvent)(t.nativeEvent))
              return
            let n = N,
              o = T
            e.controlDecKeyCodes && (o = o.concat(e.controlDecKeyCodes))
            e.controlIncKeyCodes && (n = n.concat(e.controlIncKeyCodes))
            ;(o.includes(t.keyCode) || n.includes(t.keyCode)) &&
              (t.preventDefault(),
              e.onValueByStepChange(o.includes(t.keyCode) ? -1 : 1))
            e.onKeyDown && e.onKeyDown(t)
          },
          onWheelNoPassive: u,
          stretch: e.stretch,
          intent: e.intent,
          highlight: e.highlight,
          highlightRemoveRoundBorder: e.highlightRemoveRoundBorder,
          autoSelectOnFocus: e.autoSelectOnFocus,
          'data-property-id': e['data-name'],
        })
        function d() {
          var t
          e.disabled ||
            (null === (t = a.current) || void 0 === t || t.focus(),
            e.onValueByStepChange(1))
        }
        function p() {
          var t
          e.disabled ||
            (null === (t = a.current) || void 0 === t || t.focus(),
            e.onValueByStepChange(-1))
        }
      }
    },
    99054: (e, t, n) => {
      n.d(t, { setFixedBodyState: () => c })
      const o = (() => {
        let e
        return () => {
          var t
          if (void 0 === e) {
            const n = document.createElement('div'),
              o = n.style
            ;(o.visibility = 'hidden'),
              (o.width = '100px'),
              (o.msOverflowStyle = 'scrollbar'),
              document.body.appendChild(n)
            const s = n.offsetWidth
            n.style.overflow = 'scroll'
            const r = document.createElement('div')
            ;(r.style.width = '100%'), n.appendChild(r)
            const i = r.offsetWidth
            null === (t = n.parentNode) || void 0 === t || t.removeChild(n),
              (e = s - i)
          }
          return e
        }
      })()
      function s(e, t, n) {
        null !== e && e.style.setProperty(t, n)
      }
      function r(e, t) {
        return getComputedStyle(e, null).getPropertyValue(t)
      }
      function i(e, t) {
        return Number.parseInt(r(e, t))
      }
      let a = 0,
        l = !1
      function c(e) {
        const { body: t } = document,
          n = t.querySelector('.widgetbar-wrap')
        if (e && 1 == ++a) {
          const e = r(t, 'overflow'),
            a = i(t, 'padding-right')
          'hidden' !== e.toLowerCase() &&
            t.scrollHeight > t.offsetHeight &&
            (s(n, 'right', `${o()}px`),
            (t.style.paddingRight = `${a + o()}px`),
            (l = !0)),
            t.classList.add('i-no-scroll')
        } else if (
          !e &&
          a > 0 &&
          0 == --a &&
          (t.classList.remove('i-no-scroll'), l)
        ) {
          s(n, 'right', '0px')
          let e = 0
          0,
            t.scrollHeight <= t.clientHeight && (e -= o()),
            (t.style.paddingRight = (e < 0 ? 0 : e) + 'px'),
            (l = !1)
        }
      }
    },
    35057: (e, t, n) => {
      n.d(t, { AdaptivePopupDialog: () => T })
      var o = n(50959),
        s = n(50151)
      var r = n(97754),
        i = n.n(r),
        a = n(68335),
        l = n(38223),
        c = n(35749),
        u = n(16181),
        d = n(1109),
        p = n(24437),
        h = n(90692),
        m = n(95711)
      var v = n(52092),
        f = n(76422),
        g = n(11542),
        b = n(57340)
      const C = o.createContext({ setHideClose: () => {} })
      var y = n(69827)
      function E(e) {
        const {
            title: t,
            titleTextWrap: s = !1,
            subtitle: r,
            showCloseIcon: a = !0,
            onClose: l,
            onCloseButtonKeyDown: c,
            renderBefore: u,
            renderAfter: d,
            draggable: p,
            className: h,
            unsetAlign: m,
            closeAriaLabel: v = g.t(null, void 0, n(80395)),
            closeButtonReference: f,
          } = e,
          [E, w] = (0, o.useState)(!1)
        return o.createElement(
          C.Provider,
          { value: { setHideClose: w } },
          o.createElement(
            'div',
            { className: i()(y.container, h, (r || m) && y.unsetAlign) },
            u,
            o.createElement(
              'div',
              { 'data-dragg-area': p, className: y.title },
              o.createElement(
                'div',
                { className: i()(s ? y.textWrap : y.ellipsis) },
                t,
              ),
              r &&
                o.createElement(
                  'div',
                  { className: i()(y.ellipsis, y.subtitle) },
                  r,
                ),
            ),
            d,
            a &&
              !E &&
              o.createElement(b.CloseButton, {
                className: y.close,
                'data-name': 'close',
                'aria-label': v,
                onClick: l,
                onKeyDown: c,
                ref: f,
                size: 'medium',
                preservePaddings: !0,
              }),
          ),
        )
      }
      var w = n(53017),
        _ = n(90186),
        S = n(55596)
      const x = { vertical: 20 },
        N = { vertical: 0 }
      class T extends o.PureComponent {
        constructor() {
          super(...arguments),
            (this._controller = null),
            (this._reference = null),
            (this._orientationMediaQuery = null),
            (this._renderChildren = (e, t) => (
              (this._controller = e),
              this.props.render({
                requestResize: this._requestResize,
                centerAndFit: this._centerAndFit,
                isSmallWidth: t,
              })
            )),
            (this._handleReference = (e) => (this._reference = e)),
            (this._handleCloseBtnClick = () => {
              this.props.onKeyboardClose && this.props.onKeyboardClose(),
                this._handleClose()
            }),
            (this._handleClose = () => {
              this.props.onClose()
            }),
            (this._handleOpen = () => {
              void 0 !== this.props.onOpen &&
                this.props.isOpened &&
                this.props.onOpen(
                  this.props.fullScreen ||
                    window.matchMedia(p.DialogBreakpoints.TabletSmall).matches,
                )
            }),
            (this._handleKeyDown = (e) => {
              if (!e.defaultPrevented) {
                if (
                  (this.props.onKeyDown && this.props.onKeyDown(e),
                  27 === (0, a.hashFromEvent)(e))
                ) {
                  if (e.defaultPrevented) return
                  if (
                    this.props.forceCloseOnEsc &&
                    this.props.forceCloseOnEsc()
                  )
                    return (
                      this.props.onKeyboardClose &&
                        this.props.onKeyboardClose(),
                      void this._handleClose()
                    )
                  const { activeElement: n } = document,
                    o = (0, s.ensureNotNull)(this._reference)
                  if (null !== n) {
                    if (
                      (e.preventDefault(),
                      'true' === (t = n).getAttribute('data-haspopup') &&
                        'true' !== t.getAttribute('data-expanded'))
                    )
                      return void this._handleClose()
                    if ((0, c.isTextEditingField)(n)) return void o.focus()
                    if (o.contains(n))
                      return (
                        this.props.onKeyboardClose &&
                          this.props.onKeyboardClose(),
                        void this._handleClose()
                      )
                  }
                }
                var t, n
                ;((e) => {
                  if ('function' == typeof e) return e()
                  return Boolean(e)
                })(this.props.disableTabNavigationContainment) ||
                  ((n = e),
                  [9, a.Modifiers.Shift + 9].includes(
                    (0, a.hashFromEvent)(n),
                  ) && n.stopPropagation())
              }
            }),
            (this._requestResize = () => {
              null !== this._controller && this._controller.recalculateBounds()
            }),
            (this._centerAndFit = () => {
              null !== this._controller && this._controller.centerAndFit()
            }),
            (this._calculatePositionWithOffsets = (e, t) => {
              const n = (0, s.ensureDefined)(
                this.props.fullScreenViewOffsets,
              ).value()
              return {
                top: n.top,
                left: (0, l.isRtl)() ? -n.right : n.left,
                width: t.clientWidth - n.left - n.right,
                height: t.clientHeight - n.top - n.bottom,
              }
            })
        }
        componentDidMount() {
          var e, t
          this.props.ignoreClosePopupsAndDialog ||
            f.subscribe(
              v.CLOSE_POPUPS_AND_DIALOGS_COMMAND,
              this._handleClose,
              null,
            ),
            this._handleOpen(),
            void 0 !== this.props.onOpen &&
              ((this._orientationMediaQuery = window.matchMedia(
                '(orientation: portrait)',
              )),
              (e = this._orientationMediaQuery),
              (t = this._handleOpen),
              (null == e ? void 0 : e.addEventListener)
                ? e.addEventListener('change', t)
                : e.addListener(t)),
            this.props.fullScreenViewOffsets &&
              this.props.fullScreen &&
              this.props.fullScreenViewOffsets.subscribe(this._requestResize)
        }
        componentWillUnmount() {
          var e, t
          this.props.ignoreClosePopupsAndDialog ||
            f.unsubscribe(
              v.CLOSE_POPUPS_AND_DIALOGS_COMMAND,
              this._handleClose,
              null,
            ),
            null !== this._orientationMediaQuery &&
              ((e = this._orientationMediaQuery),
              (t = this._handleOpen),
              (null == e ? void 0 : e.removeEventListener)
                ? e.removeEventListener('change', t)
                : e.removeListener(t)),
            this.props.fullScreenViewOffsets &&
              this.props.fullScreen &&
              this.props.fullScreenViewOffsets.unsubscribe(this._requestResize)
        }
        focus() {
          ;(0, s.ensureNotNull)(this._reference).focus()
        }
        getElement() {
          return this._reference
        }
        contains(e) {
          var t, n
          return (
            null !==
              (n =
                null === (t = this._reference) || void 0 === t
                  ? void 0
                  : t.contains(e)) &&
            void 0 !== n &&
            n
          )
        }
        render() {
          const {
              className: e,
              wrapperClassName: t,
              headerClassName: n,
              isOpened: s,
              title: r,
              titleTextWrap: a,
              dataName: l,
              onClickOutside: c,
              additionalElementPos: v,
              additionalHeaderElement: f,
              backdrop: g,
              shouldForceFocus: b = !0,
              shouldReturnFocus: C,
              onForceFocus: y,
              showSeparator: T,
              subtitle: I,
              draggable: k = !0,
              fullScreen: B = !1,
              showCloseIcon: P = !0,
              rounded: D = !0,
              isAnimationEnabled: M,
              growPoint: O,
              dialogTooltip: R,
              unsetHeaderAlign: L,
              onDragStart: A,
              dataDialogName: F,
              closeAriaLabel: W,
              containerAriaLabel: V,
              reference: z,
              containerTabIndex: q,
              closeButtonReference: K,
              onCloseButtonKeyDown: H,
              shadowed: U,
              fullScreenViewOffsets: Z,
              fixedBody: G,
            } = this.props,
            Y = 'after' !== v ? f : void 0,
            $ = 'after' === v ? f : void 0,
            j = 'string' == typeof r ? r : F || '',
            Q = (0, _.filterDataProps)(this.props),
            X = (0, w.mergeRefs)([this._handleReference, z])
          return o.createElement(
            h.MatchMedia,
            { rule: p.DialogBreakpoints.SmallHeight },
            (v) =>
              o.createElement(
                h.MatchMedia,
                { rule: p.DialogBreakpoints.TabletSmall },
                (p) =>
                  o.createElement(
                    u.PopupDialog,
                    {
                      rounded: !(p || B) && D,
                      className: i()(S.dialog, B && Z && S.bounded, e),
                      isOpened: s,
                      reference: X,
                      onKeyDown: this._handleKeyDown,
                      onClickOutside: c,
                      onClickBackdrop: c,
                      fullscreen: p || B,
                      guard: v ? N : x,
                      boundByScreen: p || B,
                      shouldForceFocus: b,
                      onForceFocus: y,
                      shouldReturnFocus: C,
                      backdrop: g,
                      draggable: k,
                      isAnimationEnabled: M,
                      growPoint: O,
                      name: this.props.dataName,
                      dialogTooltip: R,
                      onDragStart: A,
                      containerAriaLabel: V,
                      containerTabIndex: q,
                      calculateDialogPosition:
                        B && Z ? this._calculatePositionWithOffsets : void 0,
                      shadowed: U,
                      fixedBody: G,
                      ...Q,
                    },
                    o.createElement(
                      'div',
                      {
                        className: i()(S.wrapper, t),
                        'data-name': l,
                        'data-dialog-name': j,
                      },
                      void 0 !== r &&
                        o.createElement(E, {
                          draggable: k && !(p || B),
                          onClose: this._handleCloseBtnClick,
                          renderAfter: $,
                          renderBefore: Y,
                          subtitle: I,
                          title: r,
                          titleTextWrap: a,
                          showCloseIcon: P,
                          className: n,
                          unsetAlign: L,
                          closeAriaLabel: W,
                          closeButtonReference: K,
                          onCloseButtonKeyDown: H,
                        }),
                      T &&
                        o.createElement(d.Separator, {
                          className: S.separator,
                        }),
                      o.createElement(m.PopupContext.Consumer, null, (e) =>
                        this._renderChildren(e, p || B),
                      ),
                    ),
                  ),
              ),
          )
        }
      }
    },
    58593: (e, t, n) => {
      n.d(t, { ColorSelect: () => I })
      var o = n(50959),
        s = n(97754),
        r = n.n(s),
        i = n(50151),
        a = n(68335),
        l = n(20520),
        c = n(29202),
        u = n(35789),
        d = n(64706),
        p = n(16838),
        h = n(71468),
        m = n(63581)
      function v(e) {
        const {
            button: t,
            children: n,
            className: s,
            onPopupClose: v,
            'data-name': f,
            onColorChange: g,
            disabled: b,
            ...C
          } = e,
          [y, E] = (0, o.useState)(!1),
          [w, _] = (0, o.useState)(!1),
          [S, x] = (0, c.useFocus)(),
          N = (0, o.useRef)(null),
          T = (0, o.useRef)(null),
          I = (0, o.useRef)(null)
        return o.createElement(
          'div',
          { className: s, 'data-name': f },
          o.createElement(
            'button',
            {
              className: r()(
                m.button,
                p.PLATFORM_ACCESSIBILITY_ENABLED && m.accessible,
              ),
              tabIndex: p.PLATFORM_ACCESSIBILITY_ENABLED && !b ? 0 : -1,
              ref: I,
              onClick: () => {
                if (e.disabled) return
                _((e) => !e), E(!1)
              },
              onFocus: x.onFocus,
              onBlur: x.onBlur,
              disabled: b,
            },
            'function' == typeof t ? t(w, S) : t,
          ),
          o.createElement(
            l.PopupMenu,
            {
              reference: T,
              controller: N,
              onFocus: (e) => {
                if (
                  !e.target ||
                  !p.PLATFORM_ACCESSIBILITY_ENABLED ||
                  e.target !== e.currentTarget ||
                  y
                )
                  return
                const t = e.currentTarget,
                  n = (0, i.ensureNotNull)(
                    ((o = e.target),
                    o.querySelector(
                      '[data-role="swatch"]:not([disabled]):not([aria-disabled])',
                    )),
                  )
                var o
                ;(0, h.becomeMainElement)(n),
                  setTimeout(() => {
                    if (
                      document.activeElement !== t ||
                      !e.target.matches(':focus-visible')
                    )
                      return
                    const [n] = (0, p.queryTabbableElements)(t).sort(
                      p.navigationOrderComparator,
                    )
                    n && n.focus()
                  })
              },
              isOpened: w,
              onClose: k,
              position: () => {
                const e = (0, i.ensureNotNull)(
                  I.current,
                ).getBoundingClientRect()
                return { x: e.left, y: e.top + e.height }
              },
              doNotCloseOn: I.current,
              onKeyDown: (e) => {
                if (27 === (0, a.hashFromEvent)(e))
                  w && (e.preventDefault(), k())
              },
              onOpen: () => {
                var e
                if (!p.PLATFORM_ACCESSIBILITY_ENABLED) return
                null === (e = N.current) || void 0 === e || e.focus()
              },
              tabIndex: p.PLATFORM_ACCESSIBILITY_ENABLED ? -1 : void 0,
            },
            o.createElement(d.MenuContext.Consumer, null, (e) =>
              o.createElement(u.ColorPicker, {
                ...C,
                onColorChange: g,
                onToggleCustom: E,
                menu: e,
              }),
            ),
            !y && n,
          ),
        )
        function k() {
          _(!1), (0, i.ensureNotNull)(I.current).focus(), v && v()
        }
      }
      var f = n(56512),
        g = n(87095),
        b = n(6914),
        C = n(11542),
        y = n(59416),
        E = n(52272)
      const w = (0, y.makeSwitchGroupItem)(
        class extends o.PureComponent {
          constructor(e) {
            super(e),
              (this._onChange = () => {
                this.props.onChange && this.props.onChange(this.props.value)
              }),
              (this._handleFocus = (e) => {
                p.PLATFORM_ACCESSIBILITY_ENABLED &&
                  e.target.matches(':focus-visible') &&
                  this.setState({ isFocusVisible: !0 })
              }),
              (this._handleBlur = () => {
                this.state.isFocusVisible &&
                  this.setState({ isFocusVisible: !1 })
              }),
              (this.state = { isFocusVisible: !1 })
          }
          render() {
            const { name: e, checked: t, value: n } = this.props,
              r = s(E.thicknessItem, {
                [E.checked]: t,
                [E.accessible]: p.PLATFORM_ACCESSIBILITY_ENABLED,
                [E.focusVisible]: this.state.isFocusVisible,
              }),
              i = s(E.bar, { [E.checked]: t }),
              a = { borderTopWidth: Number.parseInt(n) }
            return o.createElement(
              'div',
              { className: r },
              o.createElement('input', {
                type: 'radio',
                className: E.radio,
                name: e,
                value: n,
                onChange: this._onChange,
                onFocus: this._handleFocus,
                onBlur: this._handleBlur,
                checked: t,
                tabIndex: p.PLATFORM_ACCESSIBILITY_ENABLED ? 0 : -1,
              }),
              o.createElement('div', { className: i, style: a }, ' '),
            )
          }
        },
      )
      function _(e) {
        const { name: t, values: n, selectedValues: s, onChange: r } = e,
          i = n.map((e, t) =>
            o.createElement(w, { key: t, value: e.toString() }),
          ),
          a = s.map((e) => e.toString())
        return o.createElement(
          'div',
          { className: E.wrap },
          o.createElement(
            y.SwitchGroup,
            {
              name: t,
              onChange: (e) => {
                r(Number.parseInt(e))
              },
              values: a,
            },
            i,
          ),
        )
      }
      var S = n(86536)
      const x = C.t(null, void 0, n(60142))
      function N(e) {
        const { value: t, items: n, onChange: s } = e
        return o.createElement(
          'div',
          { className: S.thicknessContainer },
          o.createElement('div', { className: S.thicknessTitle }, x),
          o.createElement(_, {
            name: 'color_picker_thickness_select',
            onChange: s,
            values: n,
            selectedValues: 'mixed' === t ? [] : [t],
          }),
        )
      }
      var T = n(28685)
      function I(e) {
        const {
            className: t,
            selectOpacity: n = void 0 !== e.opacity,
            thickness: s,
            color: i,
            disabled: a,
            opacity: l = 1,
            onColorChange: c,
            onOpacityChange: u,
            onThicknessChange: d,
            thicknessItems: p,
            onPopupClose: h,
            'data-name': m,
          } = e,
          [g, b, C] = (0, f.useCustomColors)()
        return o.createElement(
          v,
          {
            className: t,
            disabled: a,
            color: 'mixed' !== i ? i : null,
            selectOpacity: n,
            opacity: l,
            selectCustom: !0,
            customColors: g,
            onColorChange: c,
            onOpacityChange: i ? u : void 0,
            onAddColor: b,
            onRemoveCustomColor: C,
            button: (e, t) => {
              const n = e || t,
                c = n ? 'primary' : 'default'
              return o.createElement(
                'div',
                {
                  className: r()(
                    T.colorPickerWrap,
                    T[`intent-${c}`],
                    T['border-thin'],
                    T['size-medium'],
                    n && T.highlight,
                    n && T.focused,
                    a && T.disabled,
                  ),
                  'data-role': 'button',
                  'data-name': s
                    ? 'color-with-thickness-select'
                    : 'color-select',
                },
                o.createElement(
                  'div',
                  { className: r()(T.colorPicker, a && T.disabled) },
                  i && 'mixed' !== i
                    ? (() => {
                        const e = k(i, l),
                          t = l >= 0.95 && B(i)
                        return o.createElement(
                          'div',
                          { className: T.opacitySwatch },
                          o.createElement('div', {
                            style: { backgroundColor: e },
                            className: r()(T.swatch, t && T.white),
                          }),
                        )
                      })()
                    : o.createElement(
                        'div',
                        { className: T.placeholderContainer },
                        o.createElement('div', {
                          className:
                            'mixed' === i ? T.mixedColor : T.placeholder,
                        }),
                      ),
                  s &&
                    (() => {
                      const e = i && 'mixed' !== i ? k(i, l) : void 0
                      if ('mixed' === s)
                        return o.createElement(
                          'div',
                          { className: T.multiWidth },
                          o.createElement('div', {
                            style: { backgroundColor: e },
                            className: T.line,
                          }),
                          o.createElement('div', {
                            style: { backgroundColor: e },
                            className: T.line,
                          }),
                          o.createElement('div', {
                            style: { backgroundColor: e },
                            className: T.line,
                          }),
                        )
                      return o.createElement('span', {
                        className: r()(T.colorLine, B(i) && T.white),
                        style: { height: s, backgroundColor: e },
                      })
                    })(),
                ),
                n && o.createElement('span', { className: T.shadow }),
              )
            },
            onPopupClose: h,
            'data-name': m,
          },
          s &&
            p &&
            o.createElement(N, {
              value: s,
              items: p,
              onChange: (e) => {
                d && d(e)
              },
            }),
        )
      }
      function k(e, t) {
        return e
          ? (0, g.generateColor)(e, (0, g.alphaToTransparency)(t), !0)
          : '#000000'
      }
      function B(e) {
        return !!e && e.toLowerCase() === b.white
      }
    },
    48897: (e, t, n) => {
      n.d(t, { SymbolInputsButton: () => x })
      var o = n(50959),
        s = n(97754),
        r = n.n(s),
        i = n(11542),
        a = n(50151),
        l = n(50655),
        c = n(95711),
        u = n(14483),
        d = n(55141),
        p = n(65106),
        h = n(1861),
        m = n(9745),
        v = n(10600),
        f = n(60015)
      function g(e) {
        const {
          value: t,
          onClick: n,
          className: r,
          startSlot: i,
          disabled: a = !1,
        } = e
        return o.createElement(
          'div',
          {
            className: s(f.wrap, a && f.disabled, r),
            onClick: n,
            'data-name': 'edit-button',
          },
          o.createElement(
            'div',
            { className: s(f.text, 'apply-overflow-tooltip') },
            void 0 !== i && i,
            o.createElement('span', null, t),
          ),
          o.createElement(m.Icon, { icon: v, className: f.icon }),
        )
      }
      var b = n(31356),
        C = n(78260),
        y = n(44254),
        E = n(15983),
        w = n(82708),
        _ = n(69006)
      function S(e) {
        const { symbol: t, onSymbolChanged: s, disabled: a, className: d } = e,
          [m, v] = (0, o.useState)(t),
          f = (0, o.useContext)(l.SlotContext),
          b = (0, o.useContext)(c.PopupContext)
        return o.createElement(g, {
          value: m,
          onClick: () => {
            const e = ((e) => {
                const t = (0, y.tokenize)(e)
                return (0, E.isSpread)(t)
              })(m)
                ? m
                : (0, w.safeShortName)(m),
              t = (0, p.getSymbolSearchCompleteOverrideFunction)()
            ;(0, h.showSymbolSearchItemsDialog)({
              onSearchComplete: (e) => {
                t(e[0].symbol, e[0].result).then((e) => {
                  s(e.symbol), v(e.name)
                })
              },
              dialogTitle: i.t(null, void 0, n(23398)),
              defaultValue: e,
              manager: f,
              onClose: () => {
                b && b.focus()
              },
              showSpreadActions:
                u.enabled('show_spread_operators') &&
                u.enabled('studies_symbol_search_spread_operators'),
            })
          },
          disabled: a,
          className: r()(
            d,
            u.enabled('uppercase_instrument_names') && _.uppercase,
          ),
        })
      }
      function x(e) {
        if ('definition' in e) {
          const {
              propType: t,
              properties: n,
              id: s,
              title: r = '',
              solutionId: i,
            } = e.definition,
            l = n[t],
            c = l.value() || '',
            u = (e) => {
              l.setValue(e)
            }
          return o.createElement(
            b.CommonSection,
            { id: s, title: r, solutionId: i },
            o.createElement(
              C.CellWrap,
              null,
              o.createElement(S, {
                symbol: (0, a.ensureDefined)(c),
                onSymbolChanged: u,
              }),
            ),
          )
        }
        {
          const {
              study: t,
              value: n,
              input: { id: s, name: i },
              onChange: l,
              disabled: c,
              hasTooltip: u,
            } = e,
            p = (e) => {
              const n = (0, d.getInternalSymbolName)(e, t)
              l(n, s, i)
            }
          return o.createElement(S, {
            symbol: (0, a.ensureDefined)(n),
            onSymbolChanged: p,
            disabled: c,
            className: r()(u && _.hasTooltip),
          })
        }
      }
    },
    1861: (e, t, n) => {
      n.d(t, { showSymbolSearchItemsDialog: () => l })
      var o = n(50959),
        s = n(962),
        r = n(50655),
        i = n(51826),
        a = n(22350)
      function l(e) {
        const {
          initialMode: t = 'symbolSearch',
          autofocus: n = !0,
          defaultValue: l,
          showSpreadActions: c,
          selectSearchOnInit: u,
          onSearchComplete: d,
          dialogTitle: p,
          placeholder: h,
          fullscreen: m,
          initialScreen: v,
          wrapper: f,
          dialog: g,
          contentItem: b,
          onClose: C,
          onOpen: y,
          footer: E,
          symbolTypes: w,
          searchInput: _,
          emptyState: S,
          hideMarkedListFlag: x,
          dialogWidth: N = 'auto',
          manager: T,
          shouldReturnFocus: I,
          onSymbolFiltersParamsChange: k,
          onEmptyResults: B,
        } = e
        if (
          i.dialogsOpenerManager.isOpened('SymbolSearch') ||
          i.dialogsOpenerManager.isOpened('ChangeIntervalDialog')
        )
          return
        const P = document.createElement('div'),
          D = o.createElement(
            r.SlotContext.Provider,
            { value: null != T ? T : null },
            o.createElement(a.SymbolSearchItemsDialog, {
              onClose: M,
              initialMode: t,
              defaultValue: l,
              showSpreadActions: c,
              hideMarkedListFlag: x,
              selectSearchOnInit: u,
              onSearchComplete: d,
              dialogTitle: p,
              placeholder: h,
              fullscreen: m,
              initialScreen: v,
              wrapper: f,
              dialog: g,
              contentItem: b,
              footer: E,
              symbolTypes: w,
              searchInput: _,
              emptyState: S,
              autofocus: n,
              dialogWidth: N,
              shouldReturnFocus: I,
              onSymbolFiltersParamsChange: k,
              onEmptyResults: B,
            }),
          )
        function M() {
          s.unmountComponentAtNode(P),
            i.dialogsOpenerManager.setAsClosed('SymbolSearch'),
            C && C()
        }
        return (
          s.render(D, P),
          i.dialogsOpenerManager.setAsOpened('SymbolSearch'),
          y && y(),
          { close: M }
        )
      }
    },
    50238: (e, t, n) => {
      n.d(t, { useRovingTabindexElement: () => i })
      var o = n(50959),
        s = n(39416),
        r = n(16838)
      function i(e, t = []) {
        const [n, i] = (0, o.useState)(!1),
          a = (0, s.useFunctionalRefObject)(e)
        return (
          (0, o.useLayoutEffect)(() => {
            if (!r.PLATFORM_ACCESSIBILITY_ENABLED) return
            const e = a.current
            if (null === e) return
            const t = (e) => {
              switch (e.type) {
                case 'roving-tabindex:main-element':
                  i(!0)
                  break
                case 'roving-tabindex:secondary-element':
                  i(!1)
              }
            }
            return (
              e.addEventListener('roving-tabindex:main-element', t),
              e.addEventListener('roving-tabindex:secondary-element', t),
              () => {
                e.removeEventListener('roving-tabindex:main-element', t),
                  e.removeEventListener('roving-tabindex:secondary-element', t)
              }
            )
          }, t),
          [a, r.PLATFORM_ACCESSIBILITY_ENABLED ? (n ? 0 : -1) : void 0]
        )
      }
    },
    59369: (e, t, n) => {
      n.d(t, { useRowsNavigation: () => c })
      var o = n(50959),
        s = n(50151),
        r = n(16838),
        i = n(68335),
        a = n(71468)
      const l = [37, 39, 38, 40]
      function c(e) {
        const t = (0, o.useRef)(null)
        return (
          (0, o.useLayoutEffect)(() => {
            if (!r.PLATFORM_ACCESSIBILITY_ENABLED) return
            const e = (0, s.ensureNotNull)(t.current),
              n = () => {
                const n = (0, r.queryTabbableElements)(e).sort(
                  r.navigationOrderComparator,
                )
                if (
                  0 === n.length ||
                  (n[0].parentElement &&
                    !p(n[0].parentElement, (0, s.ensureNotNull)(t.current)))
                ) {
                  const o = ((e) => {
                    const n = d(e)
                      .sort(r.navigationOrderComparator)
                      .find((e) => p(e, (0, s.ensureNotNull)(t.current)))
                    if (!n) return null
                    const o = Array.from(n.children)
                    if (!o.length) return null
                    return o[0]
                  })(e)
                  if (null === o) return
                  if (((0, a.becomeMainElement)(o), n.length > 0))
                    for (const e of n) (0, a.becomeSecondaryElement)(e)
                }
              }
            return (
              window.addEventListener('keyboard-navigation-activation', n),
              n(),
              () =>
                window.removeEventListener('keyboard-navigation-activation', n)
            )
          }, []),
          [
            t,
            (t) => {
              if (!r.PLATFORM_ACCESSIBILITY_ENABLED) return
              if (t.defaultPrevented) return
              const n = (0, i.hashFromEvent)(t)
              if (!l.includes(n)) return
              const o = document.activeElement
              if (!(o instanceof HTMLElement)) return
              const s = t.currentTarget
              let a, c
              if (e) {
                const e = o.parentElement
                ;(a = e ? Array.from(e.children) : []), (c = a.indexOf(o))
              } else
                (a = ((p = s),
                Array.from(
                  p.querySelectorAll(
                    'button:not([disabled]):not([aria-disabled])',
                  ),
                ).filter((0, r.createScopedVisibleElementFilter)(p))).sort(
                  r.navigationOrderComparator,
                )),
                  (c = a.indexOf(o))
              var p
              if (0 === a.length || -1 === c) return
              const m = (0, r.mapKeyCodeToDirection)(n)
              switch (m) {
                case 'inlinePrev':
                  if ((t.preventDefault(), !e && 0 === c)) break
                  h(u(a, c, -1))
                  break
                case 'inlineNext':
                  if ((t.preventDefault(), !e && c === a.length - 1)) break
                  h(u(a, c, 1))
                  break
                case 'blockPrev':
                case 'blockNext':
                  ;((n) => {
                    if (!document.activeElement) return
                    const o = d(s),
                      r = document.activeElement.parentElement
                    if (!r) return
                    const i = Array.from(r.children).indexOf(
                      document.activeElement,
                    )
                    if (-1 === i) return
                    const a =
                      o['blockNext' === n ? o.indexOf(r) + 1 : o.indexOf(r) - 1]
                    if (!a) return
                    t.preventDefault()
                    const l = Array.from(a.children)
                    l.length && (!e && i <= l.length - 1 ? h(l[i]) : h(l[0]))
                  })(m)
              }
            },
          ]
        )
      }
      function u(e, t, n) {
        return e[(t + e.length + n) % e.length]
      }
      function d(e) {
        return Array.from(e.querySelectorAll('[data-role="row"]')).filter(
          (0, r.createScopedVisibleElementFilter)(e),
        )
      }
      function p(e, t) {
        const n = (0, s.ensureNotNull)(e.parentElement).offsetTop,
          o = n + (0, s.ensureNotNull)(e.parentElement).clientHeight,
          r = t.scrollTop,
          i = r + t.clientHeight
        return n >= r && o <= i
      }
      function h(e) {
        document.activeElement &&
          (0, a.becomeSecondaryElement)(document.activeElement),
          (0, a.becomeMainElement)(e),
          e.focus()
      }
    },
    73146: (e, t, n) => {
      n.d(t, { createAdapter: () => r })
      var o = n(92249),
        s = n(28853)
      function r(e) {
        if ((0, o.isLineTool)(e))
          return {
            isPine: () => !1,
            isStandardPine: () => !1,
            canOverrideMinTick: () => !1,
            resolvedSymbolInfoBySymbol: () => {
              throw new TypeError('Only study is supported.')
            },
            symbolsResolved: () => {
              throw new TypeError('Only study is supported.')
            },
            parentSources: () => {
              throw new TypeError('Only study is supported.')
            },
            getAllChildren: () => [],
            sourceId: () => {
              throw new TypeError('Only study is supported.')
            },
            inputs: () => ({}),
            parentSourceForInput: () => {
              throw new TypeError('Only study is supported.')
            },
          }
        if ((0, s.isStudy)(e)) return e
        if ('isInputsStudy' in e) return e
        throw new TypeError('Unsupported source type.')
      }
    },
    45560: (e, t, n) => {
      n.d(t, { useDefinitionProperty: () => r })
      var o = n(50959),
        s = n(71953)
      const r = (e) => {
        const t = 'property' in e ? e.property : void 0,
          n = 'defaultValue' in e ? e.defaultValue : e.property.value(),
          [r, i] = (0, o.useState)(t ? t.value() : n)
        ;(0, o.useEffect)(() => {
          if (t) {
            const n = {}
            return (
              i(t.value()),
              t.subscribe(n, (t) => {
                const n = t.value()
                e.handler && e.handler(n), i(n)
              }),
              () => {
                t.unsubscribeAll(n)
              }
            )
          }
          return () => {}
        }, [t])
        return [
          r,
          (e) => {
            if (void 0 !== t) {
              const n = t.value()
              s.logger.logNormal(
                `Changing property value from "${n}" to "${e}"`,
              ),
                t.setValue(e)
            }
          },
        ]
      }
    },
    78260: (e, t, n) => {
      n.d(t, { CellWrap: () => a })
      var o = n(50959),
        s = n(97754),
        r = n.n(s),
        i = n(2746)
      function a(e) {
        return o.createElement(
          'div',
          { className: r()(i.wrap, e.className) },
          e.children,
        )
      }
    },
    53424: (e, t, n) => {
      n.d(t, { CheckableTitle: () => c })
      var o = n(50959),
        s = n(15294),
        r = n(45560)
      function i(e) {
        const { property: t, ...n } = e,
          [i, a] = (0, r.useDefinitionProperty)({ property: t }),
          l = 'mixed' === i
        return o.createElement(s.Checkbox, {
          ...n,
          name: 'toggle-enabled',
          checked: l || i,
          indeterminate: l,
          onChange: () => {
            a('mixed' === i || !i)
          },
        })
      }
      var a = n(78260),
        l = n(25679)
      function c(e) {
        const { property: t, disabled: n, title: s, className: r, name: c } = e,
          u = o.createElement('span', { className: l.title }, s)
        return o.createElement(
          a.CellWrap,
          { className: r },
          t
            ? o.createElement(i, {
                name: c,
                className: l.checkbox,
                property: t,
                disabled: n,
                label: u,
                labelAlignBaseline: !0,
              })
            : u,
        )
      }
    },
    31356: (e, t, n) => {
      n.d(t, { CommonSection: () => i })
      var o = n(50959),
        s = n(11062),
        r = n(53424)
      n(41125)
      function i(e) {
        const {
          id: t,
          offset: n,
          disabled: i,
          checked: a,
          title: l,
          children: c,
          solutionId: u,
        } = e
        return o.createElement(
          s.PropertyTable.Row,
          null,
          o.createElement(
            s.PropertyTable.Cell,
            {
              placement: 'first',
              verticalAlign: 'adaptive',
              offset: n,
              'data-section-name': t,
              colSpan: Boolean(c) ? void 0 : 2,
              checkableTitle: !0,
            },
            o.createElement(r.CheckableTitle, {
              name: `is-enabled-${t}`,
              title: l,
              disabled: i,
              property: a,
            }),
            u && !Boolean(c) && !1,
          ),
          Boolean(c) &&
            o.createElement(
              s.PropertyTable.Cell,
              { placement: 'last', 'data-section-name': t },
              c,
              u && !1,
            ),
        )
      }
    },
    86067: (e, t, n) => {
      n.d(t, { GroupTitleSection: () => a })
      var o = n(50959),
        s = n(11062),
        r = n(53424),
        i = n(69750)
      function a(e) {
        return o.createElement(
          s.PropertyTable.Row,
          null,
          o.createElement(
            s.PropertyTable.Cell,
            {
              className: i.titleWrap,
              placement: 'first',
              verticalAlign: 'adaptive',
              colSpan: 2,
              'data-section-name': e.name,
              checkableTitle: !0,
            },
            o.createElement(r.CheckableTitle, {
              title: e.title,
              name: `is-enabled-${e.name}`,
              className: i.title,
            }),
          ),
        )
      }
    },
    71953: (e, t, n) => {
      n.d(t, { logger: () => o })
      const o = (0, n(59224).getLogger)('Platform.GUI.PropertyDefinitionTrace')
    },
    35789: (e, t, n) => {
      n.d(t, { ColorPicker: () => U })
      var o = n(50959),
        s = n(97754),
        r = n.n(s),
        i = n(11542),
        a = n(16838),
        l = n(59369),
        c = n(43688),
        u = n(93532),
        d = n(45582),
        p = Math.ceil,
        h = Math.max
      const m = (e, t, n) => {
        t = (n ? (0, u.default)(e, t, n) : void 0 === t)
          ? 1
          : h((0, d.default)(t), 0)
        var o = null == e ? 0 : e.length
        if (!o || t < 1) return []
        for (var s = 0, r = 0, i = Array(p(o / t)); s < o; )
          i[r++] = (0, c.default)(e, s, (s += t))
        return i
      }
      var v = n(24377),
        f = n(50151),
        g = n(49483),
        b = n(20520),
        C = n(16396),
        y = n(6914),
        E = n(50238),
        w = n(35149),
        _ = n(87466)
      function S(e) {
        const { color: t, selected: r, onSelect: l, onSwatchRemove: c } = e,
          [u, d] = (0, o.useState)(!1),
          [p, h] = (0, E.useRovingTabindexElement)(null),
          m = Boolean(c) && !g.CheckMobile.any()
        return o.createElement(
          o.Fragment,
          null,
          o.createElement('button', {
            ref: p,
            style: t ? { color: t } : void 0,
            className: s(
              _.swatch,
              a.PLATFORM_ACCESSIBILITY_ENABLED && _.accessible,
              u && _.hover,
              r && _.selected,
              !t && _.empty,
              String(t).toLowerCase() === y.white && _.white,
            ),
            onClick: () => {
              l(t)
            },
            onContextMenu: m ? v : void 0,
            tabIndex: h,
            'data-role': 'swatch',
          }),
          m &&
            o.createElement(
              b.PopupMenu,
              {
                isOpened: u,
                onClose: v,
                position: () => {
                  const e = (0, f.ensureNotNull)(
                    p.current,
                  ).getBoundingClientRect()
                  return { x: e.left, y: e.top + e.height + 4 }
                },
                onClickOutside: v,
              },
              o.createElement(C.PopupMenuItem, {
                className: _.contextItem,
                label: i.t(null, void 0, n(54336)),
                icon: w,
                onClick: () => {
                  v(), (0, f.ensureDefined)(c)()
                },
                dontClosePopup: !0,
              }),
            ),
        )
        function v() {
          d(!u)
        }
      }
      function x(e) {
        const {
          colors: t,
          color: n,
          children: s,
          onSelect: r,
          onRemoveCustomColor: i,
        } = e
        if (!t) return null
        const a = n ? (0, v.parseRgb)(String(n)) : void 0,
          l = m(t, 10)
        return o.createElement(
          'div',
          { className: _.swatches },
          l.map((e, t) =>
            o.createElement(
              'div',
              { className: _.row, 'data-role': 'row', key: t },
              e.map((e, n) =>
                o.createElement(S, {
                  key: String(e) + n,
                  color: e,
                  selected:
                    a && (0, v.areEqualRgb)(a, (0, v.parseRgb)(String(e))),
                  onSelect: c,
                  onSwatchRemove: i
                    ? () =>
                        ((e, t) => {
                          const n = 10 * e + t
                          null == i || i(n)
                        })(t, n)
                    : void 0,
                }),
              ),
            ),
          ),
          s,
        )
        function c(e) {
          r && r(e)
        }
      }
      var N = n(54368),
        T = n(94720)
      function I(e) {
        const t = `Invalid RGB color: ${e}`
        if (null === e) throw new Error(t)
        const n = e.match(/^#?([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i)
        if (null === n) throw new Error(t)
        const [, o, s, r] = n
        if (!o || !s || !r) throw new Error(t)
        const i = Number.parseInt(o, 16) / 255,
          a = Number.parseInt(s, 16) / 255,
          l = Number.parseInt(r, 16) / 255,
          c = Math.max(i, a, l),
          u = Math.min(i, a, l)
        let d
        const p = c,
          h = c - u,
          m = 0 === c ? 0 : h / c
        if (c === u) d = 0
        else {
          switch (c) {
            case i:
              d = (a - l) / h + (a < l ? 6 : 0)
              break
            case a:
              d = (l - i) / h + 2
              break
            case l:
              d = (i - a) / h + 4
              break
            default:
              d = 0
          }
          d /= 6
        }
        return { h: d, s: m, v: p }
      }
      var k = n(43370),
        B = n(68335),
        P = n(37160),
        D = n(35257)
      const M = [37, 39, 38, 40],
        O = 0.01
      class R extends o.PureComponent {
        constructor() {
          super(...arguments),
            (this._container = null),
            (this._refContainer = (e) => {
              this._container = e
            }),
            (this._handlePosition = (e) => {
              const {
                hsv: { h: t },
                onChange: n,
              } = this.props
              if (!n) return
              const o = (0, f.ensureNotNull)(
                  this._container,
                ).getBoundingClientRect(),
                s = e.clientX - o.left,
                r = e.clientY - o.top
              n({
                h: t,
                s: (0, P.clamp)(s / o.width, 0, 1),
                v: (0, P.clamp)(1 - r / o.height, 0, 1),
              })
            }),
            (this._handleKeyDown = (e) => {
              const {
                  hsv: { h: t, s: n, v: o },
                  onChange: s,
                } = this.props,
                r = (0, B.hashFromEvent)(e)
              if (!s || !M.includes(r)) return
              if (37 === r || 39 === r) {
                return void s({
                  h: t,
                  s: (0, P.clamp)(37 === r ? n - O : n + O, 0, 1),
                  v: o,
                })
              }
              s({ h: t, s: n, v: (0, P.clamp)(40 === r ? o - O : o + O, 0, 1) })
            }),
            (this._mouseDown = (e) => {
              window.addEventListener('mouseup', this._mouseUp),
                window.addEventListener('mousemove', this._mouseMove)
            }),
            (this._mouseUp = (e) => {
              window.removeEventListener('mousemove', this._mouseMove),
                window.removeEventListener('mouseup', this._mouseUp),
                this._handlePosition(e)
            }),
            (this._mouseMove = (0, k.default)(this._handlePosition, 100)),
            (this._handleTouch = (e) => {
              this._handlePosition(e.nativeEvent.touches[0])
            })
        }
        render() {
          const {
              className: e,
              hsv: { h: t, s: n, v: s },
            } = this.props,
            i = `hsl(${360 * t}, 100%, 50%)`
          return o.createElement(
            'div',
            {
              tabIndex: a.PLATFORM_ACCESSIBILITY_ENABLED ? 0 : -1,
              className: r()(
                a.PLATFORM_ACCESSIBILITY_ENABLED && D.accessible,
                e,
              ),
              onKeyDown: this._handleKeyDown,
            },
            o.createElement(
              'div',
              {
                className: D.saturation,
                style: { backgroundColor: i },
                ref: this._refContainer,
                onMouseDown: this._mouseDown,
                onTouchStart: this._handleTouch,
                onTouchMove: this._handleTouch,
              },
              o.createElement('div', {
                className: D.pointer,
                style: { left: 100 * n + '%', top: 100 * (1 - s) + '%' },
              }),
            ),
          )
        }
      }
      var L = n(1369)
      class A extends o.PureComponent {
        constructor() {
          super(...arguments),
            (this._container = null),
            (this._refContainer = (e) => {
              this._container = e
            }),
            (this._handlePosition = (e) => {
              const {
                hsv: { s: t, v: n },
                onChange: o,
              } = this.props
              if (!o) return
              const s = (0, f.ensureNotNull)(
                  this._container,
                ).getBoundingClientRect(),
                r = e.clientY - s.top
              o({ h: (0, P.clamp)(r / s.height, 0, 1), s: t, v: n })
            }),
            (this._handleKeyDown = (e) => {
              const {
                  hsv: { h: t, s: n, v: o },
                  onChange: s,
                } = this.props,
                r = (0, B.hashFromEvent)(e)
              if (!s || (38 !== r && 40 !== r)) return
              s({
                h: (0, P.clamp)(38 === r ? t - 0.01 : t + 0.01, 0, 1),
                s: n,
                v: o,
              })
            }),
            (this._mouseDown = (e) => {
              window.addEventListener('mouseup', this._mouseUp),
                window.addEventListener('mousemove', this._mouseMove)
            }),
            (this._mouseUp = (e) => {
              window.removeEventListener('mousemove', this._mouseMove),
                window.removeEventListener('mouseup', this._mouseUp),
                this._handlePosition(e)
            }),
            (this._mouseMove = (0, k.default)(this._handlePosition, 100)),
            (this._handleTouch = (e) => {
              this._handlePosition(e.nativeEvent.touches[0])
            })
        }
        render() {
          const {
            className: e,
            hsv: { h: t },
          } = this.props
          return o.createElement(
            'div',
            {
              className: r()(
                L.hue,
                a.PLATFORM_ACCESSIBILITY_ENABLED && L.accessible,
                e,
              ),
              tabIndex: a.PLATFORM_ACCESSIBILITY_ENABLED ? 0 : -1,
              onKeyDown: this._handleKeyDown,
            },
            o.createElement(
              'div',
              {
                className: L.pointerContainer,
                ref: this._refContainer,
                onMouseDown: this._mouseDown,
                onTouchStart: this._handleTouch,
                onTouchMove: this._handleTouch,
              },
              o.createElement('div', {
                className: L.pointer,
                style: { top: 100 * t + '%' },
              }),
            ),
          )
        }
      }
      var F = n(80679)
      const W = '#000000',
        V = i.t(null, { context: 'Color Picker' }, n(40276))
      class z extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._inputRef = o.createRef()),
            (this._handleHSV = (e) => {
              const t =
                ((e) => {
                  const { h: t, s: n, v: o } = e
                  let s, r, i
                  const a = Math.floor(6 * t),
                    l = 6 * t - a,
                    c = o * (1 - n),
                    u = o * (1 - l * n),
                    d = o * (1 - (1 - l) * n)
                  switch (a % 6) {
                    case 0:
                      ;(s = o), (r = d), (i = c)
                      break
                    case 1:
                      ;(s = u), (r = o), (i = c)
                      break
                    case 2:
                      ;(s = c), (r = o), (i = d)
                      break
                    case 3:
                      ;(s = c), (r = u), (i = o)
                      break
                    case 4:
                      ;(s = d), (r = c), (i = o)
                      break
                    case 5:
                      ;(s = o), (r = c), (i = u)
                      break
                    default:
                      ;(s = 0), (r = 0), (i = 0)
                  }
                  return (
                    '#' +
                    [255 * s, 255 * r, 255 * i]
                      .map((e) =>
                        ('0' + Math.round(e).toString(16)).replace(
                          /.+?([a-f0-9]{2})$/i,
                          '$1',
                        ),
                      )
                      .join('')
                  )
                })(e) || W
              this.setState({
                color: t,
                inputColor: t.replace(/^#/, ''),
                hsv: e,
              }),
                this.props.onSelect(t)
            }),
            (this._handleInput = (e) => {
              const t = e.currentTarget.value
              try {
                const e = I(t),
                  n = `#${t}`
                this.setState({ color: n, inputColor: t, hsv: e }),
                  this.props.onSelect(n)
              } catch (e) {
                this.setState({ inputColor: t })
              }
            }),
            (this._handleAddColor = () => this.props.onAdd(this.state.color))
          const t = e.color || W
          this.state = { color: t, inputColor: t.replace(/^#/, ''), hsv: I(t) }
        }
        componentDidMount() {
          var e
          a.PLATFORM_ACCESSIBILITY_ENABLED &&
            !g.CheckMobile.any() &&
            (null === (e = this._inputRef.current) || void 0 === e || e.focus())
        }
        render() {
          const { color: e, hsv: t, inputColor: n } = this.state
          return o.createElement(
            'div',
            { className: F.container },
            o.createElement(
              'div',
              { className: F.form },
              o.createElement('div', {
                className: F.swatch,
                style: { backgroundColor: e },
              }),
              o.createElement(
                'div',
                { className: F.inputWrap },
                o.createElement('span', { className: F.inputHash }, '#'),
                o.createElement('input', {
                  ref: this._inputRef,
                  type: 'text',
                  className: F.input,
                  value: n,
                  onChange: this._handleInput,
                }),
              ),
              o.createElement(
                'div',
                { className: F.buttonWrap },
                o.createElement(
                  T.Button,
                  { size: 's', onClick: this._handleAddColor },
                  V,
                ),
              ),
            ),
            o.createElement(
              'div',
              { className: F.hueSaturationWrap },
              o.createElement(R, {
                className: F.saturation,
                hsv: t,
                onChange: this._handleHSV,
              }),
              o.createElement(A, {
                className: F.hue,
                hsv: t,
                onChange: this._handleHSV,
              }),
            ),
          )
        }
      }
      var q = n(93402)
      const K = i.t(null, { context: 'Color Picker' }, n(53585)),
        H = i.t(null, { context: 'Color Picker' }, n(81865))
      function U(e) {
        const {
            color: t,
            opacity: n,
            selectCustom: s,
            selectOpacity: i,
            customColors: c,
            onRemoveCustomColor: u,
            onToggleCustom: d,
            onOpacityChange: p,
            menu: h,
          } = e,
          [m, v] = (0, o.useState)(!1),
          f = 'number' == typeof n ? n : 1,
          [g, b] = (0, l.useRowsNavigation)()
        return (
          (0, o.useLayoutEffect)(() => {
            h && h.update()
          }, [i, h]),
          m
            ? o.createElement(z, {
                color: t,
                onSelect: C,
                onAdd: (t) => {
                  v(!1), null == d || d(!1)
                  const { onAddColor: n } = e
                  n && n(t)
                },
              })
            : o.createElement(
                'div',
                { className: q.container },
                o.createElement(
                  'div',
                  { ref: g, onKeyDown: b },
                  o.createElement(x, {
                    colors: y.basic,
                    color: t,
                    onSelect: C,
                  }),
                  o.createElement(x, {
                    colors: y.extended,
                    color: t,
                    onSelect: C,
                  }),
                  o.createElement('div', { className: q.separator }),
                  o.createElement(
                    x,
                    {
                      colors: c,
                      color: t,
                      onSelect: C,
                      onRemoveCustomColor: u,
                    },
                    s &&
                      o.createElement(
                        o.Fragment,
                        null,
                        a.PLATFORM_ACCESSIBILITY_ENABLED
                          ? (null == c ? void 0 : c.length)
                            ? o.createElement('button', {
                                title: K,
                                onClick: E,
                                className: r()(
                                  q.customButton,
                                  q.accessible,
                                  'apply-common-tooltip',
                                ),
                                tabIndex: -1,
                              })
                            : o.createElement(
                                'div',
                                { 'data-role': 'row' },
                                o.createElement('button', {
                                  title: K,
                                  onClick: E,
                                  className: r()(
                                    q.customButton,
                                    q.accessible,
                                    'apply-common-tooltip',
                                  ),
                                  tabIndex: -1,
                                }),
                              )
                          : o.createElement('div', {
                              className: r()(
                                q.customButton,
                                'apply-common-tooltip',
                              ),
                              onClick: E,
                              title: K,
                              tabIndex: -1,
                            }),
                      ),
                  ),
                ),
                i &&
                  o.createElement(
                    o.Fragment,
                    null,
                    o.createElement('div', { className: q.sectionTitle }, H),
                    o.createElement(N.Opacity, {
                      color: t,
                      opacity: f,
                      onChange: (e) => {
                        p && p(e)
                      },
                    }),
                  ),
              )
        )
        function C(t) {
          const { onColorChange: n } = e
          n && n(t, m)
        }
        function E(e) {
          v(!0), null == d || d(!0)
        }
      }
    },
    54368: (e, t, n) => {
      n.d(t, { Opacity: () => u })
      var o = n(50959),
        s = n(97754),
        r = n(50151),
        i = n(37160),
        a = n(68335),
        l = n(16838),
        c = n(30099)
      class u extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._container = null),
            (this._pointer = null),
            (this._raf = null),
            (this._refContainer = (e) => {
              this._container = e
            }),
            (this._refPointer = (e) => {
              this._pointer = e
            }),
            (this._handlePosition = (e) => {
              null === this._raf &&
                (this._raf = requestAnimationFrame(() => {
                  const t = (0, r.ensureNotNull)(this._container),
                    n = (0, r.ensureNotNull)(this._pointer),
                    o = t.getBoundingClientRect(),
                    s = n.offsetWidth,
                    a = e.clientX - s / 2 - o.left,
                    l = (0, i.clamp)(a / (o.width - s), 0, 1)
                  this.setState({
                    inputOpacity: Math.round(100 * l).toString(),
                  }),
                    this.props.onChange(l),
                    (this._raf = null)
                }))
            }),
            (this._onSliderClick = (e) => {
              this._handlePosition(e.nativeEvent), this._dragSubscribe()
            }),
            (this._mouseUp = (e) => {
              this.setState({ isPointerDragged: !1 }),
                this._dragUnsubscribe(),
                this._handlePosition(e)
            }),
            (this._mouseMove = (e) => {
              this.setState({ isPointerDragged: !0 }), this._handlePosition(e)
            }),
            (this._onTouchStart = (e) => {
              this._handlePosition(e.nativeEvent.touches[0])
            }),
            (this._handleTouch = (e) => {
              this.setState({ isPointerDragged: !0 }),
                this._handlePosition(e.nativeEvent.touches[0])
            }),
            (this._handleTouchEnd = () => {
              this.setState({ isPointerDragged: !1 })
            }),
            (this._handleInput = (e) => {
              const t = e.currentTarget.value,
                n = Number(t) / 100
              this.setState({ inputOpacity: t }),
                Number.isNaN(n) || n > 1 || this.props.onChange(n)
            }),
            (this._handleKeyDown = (e) => {
              const t = (0, a.hashFromEvent)(e)
              if (37 !== t && 39 !== t) return
              e.preventDefault()
              const n = Number(this.state.inputOpacity)
              37 === t && 0 !== n && this._changeOpacity(n - 1),
                39 === t && 100 !== n && this._changeOpacity(n + 1)
            }),
            (this.state = {
              inputOpacity: Math.round(100 * e.opacity).toString(),
              isPointerDragged: !1,
            })
        }
        componentWillUnmount() {
          null !== this._raf &&
            (cancelAnimationFrame(this._raf), (this._raf = null)),
            this._dragUnsubscribe()
        }
        render() {
          const {
              color: e,
              opacity: t,
              hideInput: n,
              disabled: r,
            } = this.props,
            { inputOpacity: i, isPointerDragged: a } = this.state,
            u = { color: e || void 0 }
          return o.createElement(
            'div',
            { className: c.opacity },
            o.createElement(
              'div',
              {
                className: s(
                  c.opacitySlider,
                  l.PLATFORM_ACCESSIBILITY_ENABLED && c.accessible,
                ),
                style: u,
                tabIndex: l.PLATFORM_ACCESSIBILITY_ENABLED && !r ? 0 : -1,
                ref: this._refContainer,
                onMouseDown: this._onSliderClick,
                onTouchStart: this._onTouchStart,
                onTouchMove: this._handleTouch,
                onTouchEnd: this._handleTouchEnd,
                onKeyDown: this._handleKeyDown,
                'aria-disabled': r,
              },
              o.createElement('div', {
                className: c.opacitySliderGradient,
                style: {
                  backgroundImage: `linear-gradient(90deg, transparent, ${e})`,
                },
              }),
              o.createElement(
                'div',
                { className: c.opacityPointerWrap },
                o.createElement('div', {
                  className: s(c.pointer, a && c.dragged),
                  style: { left: 100 * t + '%' },
                  ref: this._refPointer,
                }),
              ),
            ),
            !n &&
              o.createElement(
                'div',
                { className: c.opacityInputWrap },
                o.createElement('input', {
                  type: 'text',
                  className: c.opacityInput,
                  value: i,
                  onChange: this._handleInput,
                }),
                o.createElement(
                  'span',
                  { className: c.opacityInputPercent },
                  '%',
                ),
              ),
          )
        }
        _dragSubscribe() {
          const e = (0, r.ensureNotNull)(this._container).ownerDocument
          e &&
            (e.addEventListener('mouseup', this._mouseUp),
            e.addEventListener('mousemove', this._mouseMove))
        }
        _dragUnsubscribe() {
          const e = (0, r.ensureNotNull)(this._container).ownerDocument
          e &&
            (e.removeEventListener('mousemove', this._mouseMove),
            e.removeEventListener('mouseup', this._mouseUp))
        }
        _changeOpacity(e) {
          this.setState({ inputOpacity: e.toString() }),
            this.props.onChange(e / 100)
        }
      }
    },
    6914: (e, t, n) => {
      n.d(t, { basic: () => a, extended: () => c, white: () => s })
      var o = n(33013)
      const s = o.colorsPalette['color-white'],
        r = [
          'ripe-red',
          'tan-orange',
          'banana-yellow',
          'iguana-green',
          'minty-green',
          'sky-blue',
          'tv-blue',
          'deep-blue',
          'grapes-purple',
          'berry-pink',
        ],
        i = [200, 300, 400, 500, 600, 700, 800, 900].map(
          (e) => `color-cold-gray-${e}`,
        )
      i.unshift('color-white'),
        i.push('color-black'),
        r.forEach((e) => {
          i.push(`color-${e}-500`)
        })
      const a = i.map((e) => o.colorsPalette[e]),
        l = []
      ;[100, 200, 300, 400, 700, 900].forEach((e) => {
        r.forEach((t) => {
          l.push(`color-${t}-${e}`)
        })
      })
      const c = l.map((e) => o.colorsPalette[e])
    },
    59054: (e, t, n) => {
      n.d(t, { ControlDisclosureView: () => f })
      var o = n(50959),
        s = n(97754),
        r = n.n(s),
        i = n(38528),
        a = n(67029),
        l = n(78274),
        c = n(4523),
        u = n(9745),
        d = n(2948),
        p = n(23428)
      function h(e) {
        const { isDropped: t } = e
        return o.createElement(u.Icon, {
          className: r()(p.icon, t && p.dropped),
          icon: d,
        })
      }
      function m(e) {
        const { className: t, disabled: n, isDropped: s } = e
        return o.createElement(
          'span',
          { className: r()(p.button, n && p.disabled, t) },
          o.createElement(h, { isDropped: s }),
        )
      }
      var v = n(66986)
      const f = o.forwardRef((e, t) => {
        const {
            listboxId: n,
            className: s,
            listboxClassName: u,
            listboxTabIndex: d,
            hideArrowButton: p,
            matchButtonAndListboxWidths: h,
            popupPosition: f,
            disabled: g,
            isOpened: b,
            scrollWrapReference: C,
            repositionOnScroll: y,
            closeOnHeaderOverlap: E,
            listboxReference: w,
            size: _ = 'small',
            onClose: S,
            onOpen: x,
            onListboxFocus: N,
            onListboxBlur: T,
            onListboxKeyDown: I,
            buttonChildren: k,
            children: B,
            caretClassName: P,
            listboxAria: D,
            ...M
          } = e,
          O = (0, o.useRef)(null),
          R =
            !p &&
            o.createElement(
              l.EndSlot,
              null,
              o.createElement(m, { isDropped: b, disabled: g, className: P }),
            )
        return o.createElement(c.PopupMenuDisclosureView, {
          buttonRef: O,
          listboxId: n,
          listboxClassName: u,
          listboxTabIndex: d,
          isOpened: b,
          onClose: S,
          onOpen: x,
          listboxReference: w,
          scrollWrapReference: C,
          onListboxFocus: N,
          onListboxBlur: T,
          onListboxKeyDown: I,
          listboxAria: D,
          matchButtonAndListboxWidths: h,
          popupPosition: f,
          button: o.createElement(a.ControlSkeleton, {
            ...M,
            'data-role': 'listbox',
            disabled: g,
            className: r()(v.button, s),
            size: _,
            ref: (0, i.useMergedRefs)([O, t]),
            middleSlot: o.createElement(
              l.MiddleSlot,
              null,
              o.createElement(
                'span',
                { className: r()(v['button-children'], p && v.hiddenArrow) },
                k,
              ),
            ),
            endSlot: R,
          }),
          popupChildren: B,
          repositionOnScroll: y,
          closeOnHeaderOverlap: E,
        })
      })
      f.displayName = 'ControlDisclosureView'
    },
    56512: (e, t, n) => {
      n.d(t, { useCustomColors: () => l })
      var o = n(50959),
        s = n(56840),
        r = n(76422)
      function i(e, t) {
        ;(0, o.useEffect)(
          () => (
            r.subscribe(e, t, null),
            () => {
              r.unsubscribe(e, t, null)
            }
          ),
          [e, t],
        )
      }
      var a = n(24377)
      function l() {
        const [e, t] = (0, o.useState)((0, s.getJSON)('pickerCustomColors', []))
        i('add_new_custom_color', (n) => t(c(n, e))),
          i('remove_custom_color', (n) => t(u(n, e)))
        const n = (0, o.useCallback)(
            (t) => {
              const n = t ? (0, a.parseRgb)(t) : null
              e.some(
                (e) =>
                  null !== e &&
                  null !== n &&
                  (0, a.areEqualRgb)((0, a.parseRgb)(e), n),
              ) ||
                (r.emit('add_new_custom_color', t),
                (0, s.setJSON)('pickerCustomColors', c(t, e)))
            },
            [e],
          ),
          l = (0, o.useCallback)(
            (t) => {
              ;(t >= 0 || t < e.length) &&
                (r.emit('remove_custom_color', t),
                (0, s.setJSON)('pickerCustomColors', u(t, e)))
            },
            [e],
          )
        return [e, n, l]
      }
      function c(e, t) {
        const n = t.slice()
        return n.push(e), n.length > 29 && n.shift(), n
      }
      function u(e, t) {
        return t.filter((t, n) => e !== n)
      }
    },
    90405: (e, t, n) => {
      n.d(t, { Select: () => y })
      var o = n(50959),
        s = n(43010),
        r = n(22064),
        i = n(38528),
        a = n(16921),
        l = n(16396),
        c = n(12481),
        u = n(43370)
      var d = n(36762),
        p = n(26597),
        h = n(59054),
        m = n(36104),
        v = n(38223),
        f = n(60673)
      function g(e) {
        return !e.readonly
      }
      function b(e, t) {
        var n
        return null !== (n = null == t ? void 0 : t.id) && void 0 !== n
          ? n
          : (0, r.createDomId)(e, 'item', null == t ? void 0 : t.value)
      }
      function C(e) {
        var t, n
        const { selectedItem: s, placeholder: r } = e
        if (!s) return o.createElement('span', { className: f.placeholder }, r)
        const i =
          null !==
            (n =
              null !== (t = s.selectedContent) && void 0 !== t
                ? t
                : s.content) && void 0 !== n
            ? n
            : s.value
        return o.createElement('span', null, i)
      }
      const y = o.forwardRef((e, t) => {
        const {
          id: n,
          menuClassName: f,
          menuItemClassName: y,
          tabIndex: E,
          disabled: w,
          highlight: _,
          intent: S,
          hideArrowButton: x,
          placeholder: N,
          addPlaceholderToItems: T = !1,
          value: I,
          'aria-labelledby': k,
          onFocus: B,
          onBlur: P,
          onClick: D,
          onChange: M,
          onKeyDown: O,
          repositionOnScroll: R = !0,
          openMenuOnEnter: L = !0,
          'aria-describedby': A,
          'aria-invalid': F,
          ...W
        } = e
        let { items: V } = e
        if (N && T) {
          V = [
            {
              value: void 0,
              content: N,
              id: (0, r.createDomId)(n, 'placeholder'),
            },
            ...V,
          ]
        }
        const {
            listboxId: z,
            isOpened: q,
            isFocused: K,
            buttonTabIndex: H,
            listboxTabIndex: U,
            highlight: Z,
            intent: G,
            open: Y,
            onOpen: $,
            close: j,
            toggle: Q,
            buttonFocusBindings: X,
            onButtonClick: J,
            buttonRef: ee,
            listboxRef: te,
            buttonAria: ne,
          } = (0, m.useControlDisclosure)({
            id: n,
            disabled: w,
            buttonTabIndex: E,
            intent: S,
            highlight: _,
            onFocus: B,
            onBlur: P,
            onClick: D,
          }),
          oe = V.filter(g),
          se = oe.find((e) => e.value === I),
          [re, ie] = o.useState(
            N && T ? oe[0].value : null == se ? void 0 : se.value,
          ),
          [ae, le, ce] = (0, a.useKeepActiveItemIntoView)({ activeItem: se })
        ;(0, s.useIsomorphicLayoutEffect)(
          () => ie(null == se ? void 0 : se.value),
          [I],
        )
        const ue = (0, r.joinDomIds)(k, n),
          de = ue.length > 0 ? ue : void 0,
          pe = (0, o.useMemo)(
            () => ({
              role: 'listbox',
              'aria-labelledby': k,
              'aria-activedescendant': b(n, se),
            }),
            [k, se],
          ),
          he = (0, o.useCallback)((e) => e.value === re, [re]),
          me = (0, o.useCallback)(() => (j(), M && M(re)), [j, M, re]),
          ve = (0, d.useItemsKeyboardNavigation)(
            'vertical',
            v.isRtl,
            oe,
            he,
            (e) => {
              ie(e.value)
            },
            !1,
            { next: [40], previous: [38] },
          ),
          fe = (0, p.useKeyboardToggle)(Q, q || L),
          ge = (0, p.useKeyboardToggle)(me),
          be = (0, p.useKeyboardClose)(q, Se),
          Ce = (0, p.useKeyboardOpen)(q, Y),
          ye = (0, p.useKeyboardEventHandler)([fe, be, Ce]),
          Ee = (0, p.useKeyboardEventHandler)([ve, ge, be]),
          we = ((e) => {
            const t = (0, o.useRef)(''),
              n = (0, o.useMemo)(
                () =>
                  (0, c.default)(() => {
                    t.current = ''
                  }, 500),
                [],
              ),
              s = (0, o.useMemo)(() => (0, u.default)(e, 200), [e])
            return (0, o.useCallback)(
              (e) => {
                e.key.length > 0 &&
                  e.key.length < 3 &&
                  ((t.current += e.key), s(t.current, e), n())
              },
              [n, s],
            )
          })((t, n) => {
            const o = ((e, t, n) =>
              e.find((e) => {
                var o
                const s = t.toLowerCase()
                return (
                  !e.readonly &&
                  (n
                    ? n(e).toLowerCase().startsWith(s)
                    : !e.readonly &&
                      (('string' == typeof e.content &&
                        e.content.toLowerCase().startsWith(s)) ||
                        ('string' == typeof e.textContent &&
                          e.textContent.toLowerCase().startsWith(s)) ||
                        String(null !== (o = e.value) && void 0 !== o ? o : '')
                          .toLowerCase()
                          .startsWith(s)))
                )
              }))(oe, t, e.getSearchKey)
            void 0 !== o && M && (n.stopPropagation(), q || Y(), M(o.value))
          })
        return o.createElement(
          h.ControlDisclosureView,
          {
            ...W,
            ...ne,
            ...X,
            id: n,
            role: 'button',
            tabIndex: H,
            'aria-owns': ne['aria-controls'],
            'aria-haspopup': 'listbox',
            'aria-labelledby': de,
            disabled: w,
            hideArrowButton: x,
            isFocused: K,
            isOpened: q,
            highlight: Z,
            intent: G,
            ref: (0, i.useMergedRefs)([ee, t]),
            onClick: J,
            onOpen: () => {
              ce(se, { duration: 0 }), $()
            },
            onClose: Se,
            onKeyDown: (e) => {
              ye(e), O && O(e)
              e.defaultPrevented || we(e)
            },
            listboxId: z,
            listboxTabIndex: U,
            listboxClassName: f,
            listboxAria: pe,
            'aria-describedby': A,
            'aria-invalid': F,
            listboxReference: te,
            scrollWrapReference: ae,
            onListboxKeyDown: (e) => {
              Ee(e), e.defaultPrevented || we(e)
            },
            buttonChildren: o.createElement(C, {
              selectedItem: null != se ? se : null,
              placeholder: N,
            }),
            repositionOnScroll: R,
          },
          V.map((e, t) => {
            var s
            if (e.readonly)
              return o.createElement(
                o.Fragment,
                { key: `readonly_item_${t}` },
                e.content,
              )
            const r = b(n, e)
            return o.createElement(l.PopupMenuItem, {
              key: r,
              id: r,
              className: y,
              role: 'option',
              'aria-selected': I === e.value,
              isActive: re === e.value,
              label: null !== (s = e.content) && void 0 !== s ? s : e.value,
              onClick: _e,
              onClickArg: e.value,
              isDisabled: e.disabled,
              reference: (t) => le(e, t),
            })
          }),
        )
        function _e(e) {
          M && (M(e), ie(e))
        }
        function Se() {
          ie(null == se ? void 0 : se.value), j()
        }
      })
      y.displayName = 'Select'
    },
    90692: (e, t, n) => {
      n.d(t, { MatchMedia: () => s })
      var o = n(50959)
      class s extends o.PureComponent {
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
    64706: (e, t, n) => {
      n.d(t, { MenuContext: () => o })
      const o = n(50959).createContext(null)
    },
    27317: (e, t, n) => {
      n.d(t, { DEFAULT_MENU_THEME: () => f, Menu: () => g })
      var o = n(50959),
        s = n(97754),
        r = n.n(s),
        i = n(50151),
        a = n(37160),
        l = n(21861),
        c = n(50655),
        u = n(59064),
        d = n(67961),
        p = n(4741),
        h = n(83021),
        m = n(64706),
        v = n(40191)
      const f = v
      class g extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._containerRef = null),
            (this._scrollWrapRef = null),
            (this._raf = null),
            (this._scrollRaf = null),
            (this._scrollTimeout = void 0),
            (this._manager = new d.OverlapManager()),
            (this._hotkeys = null),
            (this._scroll = 0),
            (this._handleContainerRef = (e) => {
              ;(this._containerRef = e),
                this.props.reference &&
                  ('function' == typeof this.props.reference &&
                    this.props.reference(e),
                  'object' == typeof this.props.reference &&
                    (this.props.reference.current = e))
            }),
            (this._handleScrollWrapRef = (e) => {
              ;(this._scrollWrapRef = e),
                'function' == typeof this.props.scrollWrapReference &&
                  this.props.scrollWrapReference(e),
                'object' == typeof this.props.scrollWrapReference &&
                  (this.props.scrollWrapReference.current = e)
            }),
            (this._handleCustomRemeasureDelegate = () => {
              this._resizeForced(), this._handleMeasure()
            }),
            (this._handleMeasure = ({
              callback: e,
              forceRecalcPosition: t,
            } = {}) => {
              var n, o, s, r, l, c, u, d, p, h, m, v
              if (this.state.isMeasureValid && !t) return
              const { position: f } = this.props,
                g = (0, i.ensureNotNull)(this._containerRef)
              let b = g.getBoundingClientRect()
              const C = document.documentElement.clientHeight,
                y = document.documentElement.clientWidth,
                E =
                  null !== (n = this.props.closeOnScrollOutsideOffset) &&
                  void 0 !== n
                    ? n
                    : 0
              let w = C - 0 - E
              const _ = b.height > w
              if (_) {
                ;((0, i.ensureNotNull)(this._scrollWrapRef).style.overflowY =
                  'scroll'),
                  (b = g.getBoundingClientRect())
              }
              const { width: S, height: x } = b,
                N =
                  'function' == typeof f
                    ? f({
                        contentWidth: S,
                        contentHeight: x,
                        availableWidth: y,
                        availableHeight: C,
                      })
                    : f,
                T =
                  null !==
                    (s =
                      null === (o = null == N ? void 0 : N.indentFromWindow) ||
                      void 0 === o
                        ? void 0
                        : o.left) && void 0 !== s
                    ? s
                    : 0,
                I =
                  y -
                  (null !== (r = N.overrideWidth) && void 0 !== r ? r : S) -
                  (null !==
                    (c =
                      null === (l = null == N ? void 0 : N.indentFromWindow) ||
                      void 0 === l
                        ? void 0
                        : l.right) && void 0 !== c
                    ? c
                    : 0),
                k = (0, a.clamp)(N.x, T, Math.max(T, I)),
                B =
                  (null !==
                    (d =
                      null === (u = null == N ? void 0 : N.indentFromWindow) ||
                      void 0 === u
                        ? void 0
                        : u.top) && void 0 !== d
                    ? d
                    : 0) + E,
                P =
                  C -
                  (null !== (p = N.overrideHeight) && void 0 !== p ? p : x) -
                  (null !==
                    (m =
                      null === (h = null == N ? void 0 : N.indentFromWindow) ||
                      void 0 === h
                        ? void 0
                        : h.bottom) && void 0 !== m
                    ? m
                    : 0)
              let D = (0, a.clamp)(N.y, B, Math.max(B, P))
              if (
                (N.forbidCorrectYCoord &&
                  D < N.y &&
                  ((w -= N.y - D), (D = N.y)),
                t &&
                  void 0 !== this.props.closeOnScrollOutsideOffset &&
                  N.y <= this.props.closeOnScrollOutsideOffset)
              )
                return void this._handleGlobalClose(!0)
              const M =
                null !== (v = N.overrideHeight) && void 0 !== v
                  ? v
                  : _
                    ? w
                    : void 0
              this.setState(
                {
                  appearingMenuHeight: t ? this.state.appearingMenuHeight : M,
                  appearingMenuWidth: t
                    ? this.state.appearingMenuWidth
                    : N.overrideWidth,
                  appearingPosition: { x: k, y: D },
                  isMeasureValid: !0,
                },
                () => {
                  this._restoreScrollPosition(), e && e()
                },
              )
            }),
            (this._restoreScrollPosition = () => {
              const e = document.activeElement,
                t = (0, i.ensureNotNull)(this._containerRef)
              if (null !== e && t.contains(e))
                try {
                  e.scrollIntoView()
                } catch (e) {}
              else
                (0, i.ensureNotNull)(this._scrollWrapRef).scrollTop =
                  this._scroll
            }),
            (this._resizeForced = () => {
              this.setState({
                appearingMenuHeight: void 0,
                appearingMenuWidth: void 0,
                appearingPosition: void 0,
                isMeasureValid: void 0,
              })
            }),
            (this._resize = () => {
              null === this._raf &&
                (this._raf = requestAnimationFrame(() => {
                  this.setState({
                    appearingMenuHeight: void 0,
                    appearingMenuWidth: void 0,
                    appearingPosition: void 0,
                    isMeasureValid: void 0,
                  }),
                    (this._raf = null)
                }))
            }),
            (this._handleGlobalClose = (e) => {
              this.props.onClose(e)
            }),
            (this._handleSlot = (e) => {
              this._manager.setContainer(e)
            }),
            (this._handleScroll = () => {
              this._scroll = (0, i.ensureNotNull)(this._scrollWrapRef).scrollTop
            }),
            (this._handleScrollOutsideEnd = () => {
              clearTimeout(this._scrollTimeout),
                (this._scrollTimeout = setTimeout(() => {
                  this._handleMeasure({ forceRecalcPosition: !0 })
                }, 80))
            }),
            (this._handleScrollOutside = (e) => {
              e.target !== this._scrollWrapRef &&
                (this._handleScrollOutsideEnd(),
                null === this._scrollRaf &&
                  (this._scrollRaf = requestAnimationFrame(() => {
                    this._handleMeasure({ forceRecalcPosition: !0 }),
                      (this._scrollRaf = null)
                  })))
            }),
            (this.state = {})
        }
        componentDidMount() {
          this._handleMeasure({ callback: this.props.onOpen })
          const {
            customCloseDelegate: e = u.globalCloseDelegate,
            customRemeasureDelegate: t,
          } = this.props
          e.subscribe(this, this._handleGlobalClose),
            null == t || t.subscribe(null, this._handleCustomRemeasureDelegate),
            window.addEventListener('resize', this._resize)
          const n = null !== this.context
          this._hotkeys ||
            n ||
            ((this._hotkeys = p.createGroup({ desc: 'Popup menu' })),
            this._hotkeys.add({
              desc: 'Close',
              hotkey: 27,
              handler: () => {
                this.props.onKeyboardClose && this.props.onKeyboardClose(),
                  this._handleGlobalClose()
              },
            })),
            this.props.repositionOnScroll &&
              window.addEventListener('scroll', this._handleScrollOutside, {
                capture: !0,
              })
        }
        componentDidUpdate() {
          this._handleMeasure()
        }
        componentWillUnmount() {
          const {
            customCloseDelegate: e = u.globalCloseDelegate,
            customRemeasureDelegate: t,
          } = this.props
          e.unsubscribe(this, this._handleGlobalClose),
            null == t ||
              t.unsubscribe(null, this._handleCustomRemeasureDelegate),
            window.removeEventListener('resize', this._resize),
            window.removeEventListener('scroll', this._handleScrollOutside, {
              capture: !0,
            }),
            this._hotkeys && (this._hotkeys.destroy(), (this._hotkeys = null)),
            null !== this._raf &&
              (cancelAnimationFrame(this._raf), (this._raf = null)),
            null !== this._scrollRaf &&
              (cancelAnimationFrame(this._scrollRaf), (this._scrollRaf = null)),
            this._scrollTimeout && clearTimeout(this._scrollTimeout)
        }
        render() {
          const {
              id: e,
              role: t,
              'aria-label': n,
              'aria-labelledby': s,
              'aria-activedescendant': i,
              'aria-hidden': a,
              'aria-describedby': u,
              'aria-invalid': d,
              children: p,
              minWidth: f,
              theme: g = v,
              className: C,
              maxHeight: y,
              onMouseOver: E,
              onMouseOut: w,
              onKeyDown: _,
              onFocus: S,
              onBlur: x,
            } = this.props,
            {
              appearingMenuHeight: N,
              appearingMenuWidth: T,
              appearingPosition: I,
              isMeasureValid: k,
            } = this.state,
            B = {
              '--ui-kit-menu-max-width': `${I && I.x}px`,
              maxWidth: 'calc(100vw - var(--ui-kit-menu-max-width) - 6px)',
            }
          return o.createElement(
            m.MenuContext.Provider,
            { value: this },
            o.createElement(
              h.SubmenuHandler,
              null,
              o.createElement(
                c.SlotContext.Provider,
                { value: this._manager },
                o.createElement(
                  'div',
                  {
                    id: e,
                    role: t,
                    'aria-label': n,
                    'aria-labelledby': s,
                    'aria-activedescendant': i,
                    'aria-hidden': a,
                    'aria-describedby': u,
                    'aria-invalid': d,
                    className: r()(C, g.menuWrap, !k && g.isMeasuring),
                    style: {
                      height: N,
                      left: I && I.x,
                      minWidth: f,
                      position: 'fixed',
                      top: I && I.y,
                      width: T,
                      ...(this.props.limitMaxWidth && B),
                    },
                    'data-name': this.props['data-name'],
                    ref: this._handleContainerRef,
                    onScrollCapture: this.props.onScroll,
                    onContextMenu: l.preventDefaultForContextMenu,
                    tabIndex: this.props.tabIndex,
                    onMouseOver: E,
                    onMouseOut: w,
                    onKeyDown: _,
                    onFocus: S,
                    onBlur: x,
                  },
                  o.createElement(
                    'div',
                    {
                      className: r()(
                        g.scrollWrap,
                        !this.props.noMomentumBasedScroll && g.momentumBased,
                      ),
                      style: {
                        overflowY: void 0 !== N ? 'scroll' : 'auto',
                        maxHeight: y,
                      },
                      onScrollCapture: this._handleScroll,
                      ref: this._handleScrollWrapRef,
                    },
                    o.createElement(b, { className: g.menuBox }, p),
                  ),
                ),
              ),
              o.createElement(c.Slot, { reference: this._handleSlot }),
            ),
          )
        }
        update(e) {
          e ? this._resizeForced() : this._resize()
        }
        focus(e) {
          var t
          null === (t = this._containerRef) || void 0 === t || t.focus(e)
        }
        blur() {
          var e
          null === (e = this._containerRef) || void 0 === e || e.blur()
        }
      }
      function b(e) {
        const t = (0, i.ensureNotNull)((0, o.useContext)(h.SubmenuContext)),
          n = o.useRef(null)
        return o.createElement(
          'div',
          {
            ref: n,
            className: e.className,
            onMouseOver: (e) => {
              if (
                !(
                  null !== t.current &&
                  e.target instanceof Node &&
                  ((o = e.target),
                  null === (s = n.current) || void 0 === s
                    ? void 0
                    : s.contains(o))
                )
              )
                return
              var o, s
              t.isSubmenuNode(e.target) || t.setCurrent(null)
            },
            'data-name': 'menu-inner',
          },
          e.children,
        )
      }
      g.contextType = h.SubmenuContext
    },
    1109: (e, t, n) => {
      n.d(t, { Separator: () => i })
      var o = n(50959),
        s = n(97754),
        r = n(45719)
      function i(e) {
        return o.createElement('div', {
          className: s(r.separator, e.className),
        })
      }
    },
    29197: (e, t, n) => {
      n.d(t, { CloseDelegateContext: () => r })
      var o = n(50959),
        s = n(59064)
      const r = o.createContext(s.globalCloseDelegate)
    },
    42842: (e, t, n) => {
      n.d(t, { Portal: () => l, PortalContext: () => c })
      var o = n(50959),
        s = n(962),
        r = n(25931),
        i = n(67961),
        a = n(99663)
      class l extends o.PureComponent {
        constructor() {
          super(...arguments), (this._uuid = (0, r.nanoid)())
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
            s.createPortal(
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
            ? (0, i.getRootOverlapManager)()
            : this.context
        }
      }
      l.contextType = a.SlotContext
      const c = o.createContext(null)
    },
    50655: (e, t, n) => {
      n.d(t, { Slot: () => o.Slot, SlotContext: () => o.SlotContext })
      var o = n(99663)
    },
    86656: (e, t, n) => {
      n.d(t, { TouchScrollContainer: () => a })
      var o = n(50959),
        s = n(59142),
        r = n(50151),
        i = n(49483)
      const a = (0, o.forwardRef)((e, t) => {
        const { children: n, ...r } = e,
          a = (0, o.useRef)(null)
        return (
          (0, o.useImperativeHandle)(t, () => a.current),
          (0, o.useLayoutEffect)(() => {
            if (i.CheckMobile.iOS())
              return (
                null !== a.current &&
                  (0, s.disableBodyScroll)(a.current, { allowTouchMove: l(a) }),
                () => {
                  null !== a.current && (0, s.enableBodyScroll)(a.current)
                }
              )
          }, []),
          o.createElement('div', { ref: a, ...r }, n)
        )
      })
      function l(e) {
        return (t) => {
          const n = (0, r.ensureNotNull)(e.current),
            o = document.activeElement
          return (
            !n.contains(t) || (null !== o && n.contains(o) && o.contains(t))
          )
        }
      }
    },
    26278: (e) => {
      e.exports = {
        titleWrap: 'titleWrap-Izz3hpJc',
        groupFooter: 'groupFooter-Izz3hpJc',
      }
    },
    49934: (e) => {
      e.exports = { wrapper: 'wrapper-JXHzsa7P' }
    },
    17611: (e) => {
      e.exports = { inlineRow: 'inlineRow-D8g11qqA' }
    },
    93071: (e) => {
      e.exports = {
        container: 'container-QyF09i7Y',
        hasTooltip: 'hasTooltip-QyF09i7Y',
        datePickerWrapper: 'datePickerWrapper-QyF09i7Y',
        timePickerWrapper: 'timePickerWrapper-QyF09i7Y',
      }
    },
    27698: (e) => {
      e.exports = {
        input: 'input-ZOx_CVY3',
        symbol: 'symbol-ZOx_CVY3',
        checkbox: 'checkbox-ZOx_CVY3',
        label: 'label-ZOx_CVY3',
        dropdownMenu: 'dropdownMenu-ZOx_CVY3',
        sessionStart: 'sessionStart-ZOx_CVY3',
        sessionEnd: 'sessionEnd-ZOx_CVY3',
        sessionInputContainer: 'sessionInputContainer-ZOx_CVY3',
        sessionDash: 'sessionDash-ZOx_CVY3',
        inputGroup: 'inputGroup-ZOx_CVY3',
        textarea: 'textarea-ZOx_CVY3',
        inlineGroup: 'inlineGroup-ZOx_CVY3',
        hasTooltip: 'hasTooltip-ZOx_CVY3',
      }
    },
    24712: (e) => {
      e.exports = {
        content: 'content-tBgV1m0B',
        cell: 'cell-tBgV1m0B',
        inner: 'inner-tBgV1m0B',
        first: 'first-tBgV1m0B',
        inlineCell: 'inlineCell-tBgV1m0B',
        fill: 'fill-tBgV1m0B',
        top: 'top-tBgV1m0B',
        topCenter: 'topCenter-tBgV1m0B',
        offset: 'offset-tBgV1m0B',
        inlineRow: 'inlineRow-tBgV1m0B',
        grouped: 'grouped-tBgV1m0B',
        separator: 'separator-tBgV1m0B',
        groupSeparator: 'groupSeparator-tBgV1m0B',
        big: 'big-tBgV1m0B',
        adaptive: 'adaptive-tBgV1m0B',
        checkableTitle: 'checkableTitle-tBgV1m0B',
      }
    },
    80128: (e) => {
      e.exports = {
        wrap: 'wrap-QutFvTLS',
        labelWrap: 'labelWrap-QutFvTLS',
        label: 'label-QutFvTLS',
        hasTooltip: 'hasTooltip-QutFvTLS',
      }
    },
    82161: (e, t, n) => {
      n.d(t, { splitThousands: () => s })
      var o = n(50335)
      function s(e, t = '&nbsp;') {
        let n = e + ''
        ;-1 !== n.indexOf('e') &&
          (n = ((e) =>
            (0, o.fixComputationError)(e)
              .toFixed(10)
              .replace(/\.?0+$/, ''))(Number(e)))
        const s = n.split('.')
        return (
          s[0].replace(/\B(?=(\d{3})+(?!\d))/g, t) + (s[1] ? '.' + s[1] : '')
        )
      }
    },
    71468: (e, t, n) => {
      function o(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:main-element'))
      }
      function s(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:secondary-element'))
      }
      n.d(t, { becomeMainElement: () => o, becomeSecondaryElement: () => s })
    },
    83207: (e, t, n) => {
      n.d(t, { bind: () => i, setter: () => a })
      var o = n(50959),
        s = n(76917),
        r = n(27365)
      function i(e) {
        var t
        return (
          (t = class extends o.PureComponent {
            constructor() {
              super(...arguments),
                (this._onChange = (e, t, n) => {
                  const { setValue: o } = this.context,
                    { onChange: s } = this.props
                  a(o, s)(e, t, n)
                })
            }
            render() {
              const { input: t } = this.props,
                { values: n, model: s } = this.context
              return o.createElement(e, {
                ...this.props,
                value: n[t.id],
                tzName: (0, r.getTimezoneName)(s),
                onChange: this._onChange,
              })
            }
          }),
          (t.contextType = s.PropertyContext),
          t
        )
      }
      function a(e, t) {
        return (n, o, s) => {
          e(o, n, s), t && t(n, o, s)
        }
      }
    },
    76917: (e, t, n) => {
      n.d(t, { PropertyContainer: () => u, PropertyContext: () => c })
      var o = n(50959),
        s = n(50151),
        r = n(11542),
        i = n(36298)
      const a = (0, n(59224).getLogger)(
          'Platform.GUI.StudyInputPropertyContainer',
        ),
        l = new i.TranslatedString(
          'change {propertyName} property',
          r.t(null, void 0, n(18567)),
        ),
        c = o.createContext(null)
      class u extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._setValue = (e, t, o) => {
              const { property: c, model: u } = this.props,
                d = (0, s.ensureDefined)(c.child(e))
              a.logNormal(
                `Changing property "${e}" value from "${c.value()}" to "${t}"`,
              )
              const p = new i.TranslatedString(
                o,
                ((e) => r.t(e, { context: 'input' }, n(88601)))(o),
              )
              u.setProperty(d, t, l.format({ propertyName: p }))
            })
          const { property: t } = e,
            o = {}
          t.childNames().forEach((e) => {
            const n = (0, s.ensureDefined)(t.child(e))
            Object.hasOwn(o, e) || (o[e] = n.value())
          }),
            (this.state = o)
        }
        componentDidMount() {
          const { property: e, onStudyInputChange: t } = this.props
          e.childNames().forEach((n) => {
            ;(0, s.ensureDefined)(e.child(n)).subscribe(this, (e) => {
              const o = e.value()
              a.logNormal(`Property "${n}" updated to value "${o}"`),
                this.setState({ [n]: o }),
                null == t || t(o, n)
            })
          })
        }
        componentWillUnmount() {
          const { property: e } = this.props
          e.childNames().forEach((t) => {
            ;(0, s.ensureDefined)(e.child(t)).unsubscribeAll(this)
          })
        }
        render() {
          const { study: e, model: t, children: n } = this.props,
            s = {
              study: e,
              model: t,
              values: this.state,
              setValue: this._setValue,
            }
          return o.createElement(c.Provider, { value: s }, n)
        }
      }
    },
    51717: (e, t, n) => {
      n.d(t, { ModelContext: () => s, bindModel: () => r })
      var o = n(50959)
      const s = o.createContext(null)
      function r(e, t) {
        return o.createElement(s.Consumer, null, (n) =>
          n ? o.createElement(e, { ...Object.assign({ model: n }, t) }) : null,
        )
      }
    },
    41594: (e, t, n) => {
      n.d(t, {
        StylePropertyContainer: () => i,
        StylePropertyContext: () => r,
        bindPropertyContext: () => a,
      })
      var o = n(50959),
        s = n(51717)
      const r = o.createContext(null)
      class i extends o.PureComponent {
        constructor() {
          super(...arguments),
            (this._setValue = (e, t, n) => {
              const { model: o } = this.props
              Array.isArray(e)
                ? o.setProperties(
                    e,
                    e.map(() => t),
                    n,
                  )
                : o.setProperty(e, t, n)
            })
        }
        componentDidMount() {
          const { property: e } = this.props
          e.subscribe(this, () => this.forceUpdate())
        }
        componentWillUnmount() {
          const { property: e } = this.props
          e.unsubscribeAll(this)
        }
        render() {
          const e = { setValue: this._setValue }
          return o.createElement(r.Provider, { value: e }, this.props.children)
        }
      }
      function a(e, t) {
        return (0, s.bindModel)(
          ({ model: n }) =>
            o.createElement(
              i,
              { model: n, property: t.property },
              o.createElement(e, { ...t }),
            ),
          t,
        )
      }
    },
    76694: (e, t, n) => {
      n.d(t, { IconGroupWrapper: () => r })
      var o = n(50959),
        s = n(49934)
      function r(e) {
        const { children: t } = e
        return o.createElement('div', { className: s.wrapper }, t)
      }
    },
    24150: (e, t, n) => {
      n.d(t, { InputTooltip: () => x })
      var o = n(50959),
        s = n(97754),
        r = n(90186),
        i = n(9745),
        a = n(82353),
        l = n(27941),
        c = n(99084),
        u = n(30162),
        d = n(78370),
        p = n.n(d)
      const h = 'small',
        m = { info: l, question: a, check: c, exclamation: u }
      function v(e, t) {
        return t ? m[t] : 'success' === e ? m.check : m.exclamation
      }
      const f = o.forwardRef((e, t) =>
          o.createElement('span', {
            ...e,
            ref: t,
            className: s(e.className, p()['no-active-state']),
          }),
        ),
        g = o.forwardRef((e, t) => {
          const {
            icon: n,
            intent: a = 'default',
            ariaLabel: l,
            tooltip: c,
            className: u,
            renderComponent: d = f,
            tabIndex: m = 0,
            size: g = h,
            onFocus: b,
            onBlur: C,
            onClick: y,
            ...E
          } = e
          return o.createElement(
            d,
            {
              className: s(
                u,
                p()['icon-wrapper'],
                p()[`intent-${a}`],
                p()[`icon-wrapper-size-${g}`],
              ),
              title: c,
              'aria-label': l,
              ref: t,
              tabIndex: m,
              onFocus: b,
              onBlur: C,
              onClick: y,
              ...(0, r.filterDataProps)(E),
            },
            o.createElement(i.Icon, {
              'aria-hidden': !0,
              icon: v(a, n),
              className: p().icon,
            }),
          )
        })
      var b = n(5325)
      var C = n(39416)
      function y(e, t = null) {
        const {
            showTooltip: n,
            hideTooltip: s,
            onClick: r,
            doNotShowTooltipOnTouch: i = !1,
          } = e,
          a = (0, C.useFunctionalRefObject)(t),
          l = (() => {
            const [e, t] = (0, o.useState)(!1)
            return (
              (0, o.useEffect)(() => {
                t(b.mobiletouch)
              }, []),
              e
            )
          })(),
          c = l && i ? void 0 : e.tooltip
        ;(0, o.useEffect)(() => {
          const e = () => {
            var e
            null === (e = null == a ? void 0 : a.current) ||
              void 0 === e ||
              e.blur()
          }
          return (
            document.addEventListener('scroll', e, !0),
            () => document.removeEventListener('scroll', e, !0)
          )
        }, [a])
        return {
          onBlur: (0, o.useCallback)(
            (e) => {
              s && s()
            },
            [s],
          ),
          onFocus: (0, o.useCallback)(
            (e) => {
              !e.target.matches(':hover') &&
                n &&
                e.target.matches(':focus-visible') &&
                n(e.currentTarget, { tooltipDelay: 200 })
            },
            [n],
          ),
          onClick: (0, o.useCallback)(
            (e) => {
              var t
              l &&
                (null === (t = null == a ? void 0 : a.current) ||
                  void 0 === t ||
                  t.focus()),
                r && r(e)
            },
            [r, a, l],
          ),
          tooltip: c,
          className: void 0 !== c ? 'apply-common-tooltip' : void 0,
          ref: a,
        }
      }
      var E = n(38780),
        w = n(42335),
        _ = n.n(w)
      const S = (0, o.forwardRef)((e, t) => {
        const {
            className: n,
            onClick: r = E.tooltipClickHandler,
            doNotShowTooltipOnTouch: i,
            ...a
          } = e,
          {
            tooltip: l,
            className: c,
            ...u
          } = y(
            {
              tooltip: e.tooltip,
              doNotShowTooltipOnTouch: i,
              showTooltip: E.showOnElement,
              hideTooltip: E.hide,
              onClick: r,
            },
            t,
          )
        return o.createElement(g, {
          className: s(n, _()['icon-wrapper'], l && _()['with-tooltip'], c),
          tooltip: l,
          ...a,
          ...u,
        })
      })
      ;(0, o.forwardRef)((e, t) => {
        const { href: n, rel: s, target: r, ...i } = e,
          a = (0, o.useMemo)(
            () =>
              (0, o.forwardRef)((e, t) =>
                o.createElement('a', {
                  href: n,
                  rel: s,
                  target: r,
                  ref: t,
                  ...e,
                }),
              ),
            [n, s, r],
          )
        return o.createElement(S, {
          ...i,
          renderComponent: a,
          ref: t,
          doNotShowTooltipOnTouch: !0,
        })
      }),
        (0, o.forwardRef)((e, t) => {
          const { className: n, withActiveState: r, ...i } = e,
            a = (0, o.useMemo)(
              () =>
                (0, o.forwardRef)((e, t) =>
                  o.createElement('button', { ...e, ref: t, type: 'button' }),
                ),
              [],
            )
          return o.createElement(S, {
            ...i,
            className: s(n, !r && _()['no-active-state']),
            renderComponent: a,
            ref: t,
          })
        })
      function x(e) {
        const { className: t, title: n } = e
        return o.createElement(S, {
          icon: 'info',
          className: t,
          ariaLabel: n,
          tooltip: n,
          tabIndex: -1,
        })
      }
    },
    64420: (e, t, n) => {
      n.d(t, {
        getInputGroups: () => i,
        isGroup: () => s,
        isInputInlines: () => r,
      })
      var o = n(50151)
      function s(e) {
        return Object.hasOwn(e, 'groupType')
      }
      function r(e) {
        return s(e) && 'inline' === e.groupType
      }
      function i(e) {
        const t = [],
          n = new Map(),
          s = new Map()
        return (
          s.set(void 0, new Map()),
          e.forEach((e) => {
            const { group: r, inline: i } = e
            if (void 0 !== r || void 0 !== i)
              if (void 0 !== r)
                if (void 0 !== i)
                  if (n.has(r)) {
                    const t = (0, o.ensureDefined)(n.get(r))
                    let l
                    s.has(t)
                      ? (l = (0, o.ensureDefined)(s.get(t)))
                      : ((l = new Map()), s.set(t, l)),
                      a(e, 'inline', i, l, t.children)
                  } else {
                    const o = { id: i, groupType: 'inline', children: [e] },
                      a = { id: r, groupType: 'group', children: [o] },
                      l = new Map()
                    l.set(i, o), s.set(a, l), n.set(r, a), t.push(a)
                  }
                else a(e, 'group', r, n, t)
              else {
                const n = (0, o.ensureDefined)(s.get(void 0))
                a(e, 'inline', (0, o.ensureDefined)(i), n, t)
              }
            else t.push(e)
          }),
          t
        )
      }
      function a(e, t, n, s, r) {
        if (s.has(n)) (0, o.ensureDefined)(s.get(n)).children.push(e)
        else {
          const o = { id: n, groupType: t, children: [e] }
          s.set(n, o), r.push(o)
        }
      }
    },
    12949: (e, t, n) => {
      n.d(t, { InputRow: () => oe })
      var o = n(11542),
        s = n(50959),
        r = n(50151),
        i = n(33703),
        a = n(96438),
        l = n(47510),
        c = n(4781),
        u = n(97754),
        d = n.n(u),
        p = n(31261),
        h = n(83207),
        m = n(90009),
        v = n(27698)
      class f extends s.PureComponent {
        constructor() {
          super(...arguments),
            (this._onChange = (e) => {
              const {
                input: { id: t, name: n },
                onChange: o,
              } = this.props
              o(e.currentTarget.value, t, n)
            })
        }
        render() {
          const {
            input: { defval: e },
            value: t,
            disabled: n,
            onBlur: o,
            onKeyDown: r,
            hasTooltip: i,
          } = this.props
          return s.createElement(p.InputControl, {
            className: d()(v.input, i && v.hasTooltip),
            value: void 0 === t ? e : t,
            onChange: this._onChange,
            onBlur: o,
            onKeyDown: r,
            disabled: n,
            maxLength: 4096,
          })
        }
      }
      const g = (0, m.debounced)(f),
        b = (0, h.bind)(g)
      var C = n(55141),
        y = n(11062)
      function E(e) {
        const { className: t } = e,
          n = (0, s.useContext)(y.PropertyTable.InlineRowContext)
        return s.createElement(
          'div',
          { className: u(v.inputGroup, n && v.inlineGroup, t) },
          e.children,
        )
      }
      var w = n(36565)
      function _(e = '') {
        const [, t = '', n = '', o = '', s = ''] = Array.from(
          e.match(/^(\d\d)(\d\d)-(\d\d)(\d\d)/) || [],
        )
        return [`${t}:${n}`, `${o}:${s}`]
      }
      class S extends s.PureComponent {
        constructor(e) {
          super(e),
            (this._onStartPick = (e) => {
              this.setState({ startTime: e }, this._onChange)
            }),
            (this._onEndPick = (e) => {
              this.setState({ endTime: e }, this._onChange)
            }),
            (this._onChange = () => {
              const {
                  input: { id: e, name: t },
                  onChange: n,
                } = this.props,
                { startTime: o, endTime: s } = this.state
              n(o.replace(':', '') + '-' + s.replace(':', ''), e, t)
            })
          const t = e.value || e.input.defval,
            [n, o] = _(t)
          this.state = { prevValue: t, startTime: n, endTime: o }
        }
        render() {
          const { startTime: e, endTime: t } = this.state,
            { hasTooltip: n, disabled: o } = this.props
          return s.createElement(
            E,
            { className: d()(n && v.hasTooltip) },
            s.createElement(
              'div',
              { className: v.sessionStart },
              s.createElement(w.TimeInput, {
                className: d()(v.input, v.sessionInputContainer),
                name: 'start',
                value: (0, r.ensureDefined)(e),
                onChange: this._onStartPick,
                disabled: o,
              }),
              s.createElement('span', { className: v.sessionDash }, ' — '),
            ),
            s.createElement(
              'div',
              { className: v.sessionEnd },
              s.createElement(w.TimeInput, {
                className: d()(v.input, v.sessionInputContainer),
                name: 'end',
                value: (0, r.ensureDefined)(t),
                onChange: this._onEndPick,
                disabled: o,
              }),
            ),
          )
        }
        static getDerivedStateFromProps(e, t) {
          if (e.value === t.prevValue) return t
          const [n, o] = _(e.value)
          return { prevValue: e.value, startTime: n, endTime: o }
        }
      }
      const x = (0, h.bind)(S)
      var N = n(14483),
        T = n(42856),
        I = n(37591),
        k = n(76917),
        B = n(90405)
      class P extends s.PureComponent {
        constructor() {
          super(...arguments),
            (this._onChange = (e) => {
              const {
                input: { id: t, name: n },
                onChange: o,
              } = this.props
              o(e, t, n)
            })
        }
        render() {
          const {
              input: { id: e, defval: t, options: r, optionsTitles: i },
              value: a,
              disabled: l,
              hasTooltip: c,
            } = this.props,
            u = r.map((e) => {
              const t = i && i[e] ? i[e] : e
              return {
                value: e,
                content: o.t(t, { context: 'input' }, n(88601)),
              }
            }),
            p = void 0 !== a && r.includes(a) ? a : t
          return s.createElement(B.Select, {
            id: e,
            className: d()(v.input, c && v.hasTooltip),
            menuClassName: v.dropdownMenu,
            value: p,
            items: u,
            onChange: this._onChange,
            disabled: l,
          })
        }
      }
      const D = (0, h.bind)(P)
      var M = n(73146),
        O = n(28853)
      const R = {
        open: o.t(null, void 0, n(38466)),
        high: o.t(null, void 0, n(39337)),
        low: o.t(null, void 0, n(3919)),
        close: o.t(null, void 0, n(36962)),
        hl2: o.t(null, void 0, n(91815)),
        hlc3: o.t(null, void 0, n(40771)),
        ohlc4: o.t(null, void 0, n(12504)),
        hlcc4: o.t(null, void 0, n(9523)),
      }
      class L extends s.PureComponent {
        render() {
          const { input: e } = this.props,
            { study: t, model: n } = this.context
          let o = { ...R }
          delete o.hlcc4
          const a = (0, M.createAdapter)(t)
          if (t && this._isStudy(t) && t.isChildStudy()) {
            const t = (0, i.getInputValue)(a.inputs()[e.id]),
              n = a.parentSourceForInput(t)
            if ((0, O.isStudy)(n)) {
              const t = n.title(I.TitleDisplayTarget.StatusLine),
                s = T.StudyMetaInfo.getChildSourceInputTitles(
                  e,
                  n.metaInfo(),
                  t,
                )
              o = { ...o, ...s }
            }
          }
          if (
            N.enabled('study_on_study') &&
            t &&
            this._isStudy(t) &&
            (t.isChildStudy() || T.StudyMetaInfo.canBeChild(t.metaInfo()))
          ) {
            const e = [t, ...a.getAllChildren()]
            n.model()
              .allStudies()
              .filter((t) => t.canHaveChildren() && !e.includes(t))
              .forEach((e) => {
                const t = e.title(
                    I.TitleDisplayTarget.StatusLine,
                    !0,
                    void 0,
                    !0,
                  ),
                  n = e.id(),
                  s = e.metaInfo(),
                  i = s.styles,
                  a = s.plots || []
                if (1 === a.length) o[n + '$0'] = t
                else if (a.length > 1) {
                  const e = a.reduce((e, o, s) => {
                    if (!T.StudyMetaInfo.canPlotBeSourceOfChildStudy(o.type))
                      return e
                    let a
                    try {
                      a = (0, r.ensureDefined)(
                        (0, r.ensureDefined)(i)[o.id],
                      ).title
                    } catch (e) {
                      a = o.id
                    }
                    return { ...e, [`${n}$${s}`]: `${t}: ${a}` }
                  }, {})
                  o = { ...o, ...e }
                }
              })
          }
          const l = {
            ...e,
            type: 'text',
            options: Object.keys(o),
            optionsTitles: o,
          }
          return s.createElement(D, { ...this.props, input: l })
        }
        _isStudy(e) {
          return !Object.hasOwn(e, 'isInputsStudy')
        }
      }
      L.contextType = k.PropertyContext
      var A = n(36274),
        F = n(94025)
      const W = void 0,
        V = [
          '1',
          '3',
          '5',
          '15',
          '30',
          '45',
          '60',
          '120',
          '180',
          '240',
          '1D',
          '1W',
          '1M',
          '3M',
          '6M',
          '12M',
        ],
        z = ['1S', '5S', '10S', '15S', '30S'],
        q = ['1T', '10T', '100T', '1000T']
      class K extends s.PureComponent {
        constructor() {
          super(...arguments),
            (this._onChange = (e) => {
              const {
                input: { id: t, name: n },
                onChange: o,
              } = this.props
              o(e, t, n)
            })
        }
        render() {
          const { input: e, value: t, disabled: r, hasTooltip: i } = this.props,
            a = A.Interval.parse(void 0 === t ? e.defval : t),
            l = a.isValid() ? a.value() : t,
            c = W ? W.get().filter((e) => !A.Interval.parse(e).isRange()) : [],
            u = (0, F.mergeResolutions)(
              V,
              (0, F.isSecondsEnabled)() ? z : [],
              (0, F.isTicksEnabled)() ? q : [],
              c,
            )
          return (
            u.unshift(''),
            s.createElement(B.Select, {
              id: e.id,
              className: d()(v.input, v.resolution, i && v.hasTooltip),
              menuClassName: d()(v.dropdownMenu, v.resolution),
              items:
                ((p = u),
                p.map((e) => ({
                  value: e,
                  content:
                    '' === e
                      ? o.t(null, void 0, n(94551))
                      : (0, F.getTranslatedResolutionModel)(e).hint,
                }))),
              value: l,
              onChange: this._onChange,
              disabled: r,
            })
          )
          var p
        }
      }
      const H = (0, h.bind)(K)
      var U = n(41552),
        Z = n(41594)
      class G extends s.PureComponent {
        render() {
          return s.createElement(k.PropertyContext.Consumer, null, (e) =>
            e ? this._getColorInputWithContext(e) : null,
          )
        }
        _getColorInputWithContext(e) {
          var t
          const {
              input: { id: n },
              disabled: o,
              hasTooltip: r,
            } = this.props,
            { model: i, study: a } = e
          if ('properties' in a || 'tempProperties' in a) {
            const e =
              'properties' in a
                ? a.properties().inputs[n]
                : null === (t = a.tempProperties) || void 0 === t
                  ? void 0
                  : t.inputs.child(n)
            return s.createElement(
              Z.StylePropertyContainer,
              { model: i, property: e },
              s.createElement(U.ColorWithThicknessSelect, {
                className: d()(r && v.hasTooltip),
                color: e,
                disabled: o,
              }),
            )
          }
          return null
        }
      }
      var Y = n(85528),
        $ = n(76056),
        j = n(23935),
        Q = n(27365),
        X = n(93071)
      const J = (0, h.bind)((e) => {
        const { value: t, onChange: n, input: o, tzName: r, hasTooltip: i } = e,
          { id: a, name: l, defval: c } = o,
          u = (0, s.useMemo)(() => Number(null != t ? t : c), [t, c]),
          p = (0, s.useMemo)(
            () => (0, Q.getChartTimezoneOffsetMs)(u, r),
            [u, r],
          ),
          h = (0, s.useMemo)(() => {
            const e = new Date(u + p + v(u))
            return e.setSeconds(0), e
          }, [u, p]),
          m = (0, s.useMemo)(
            () =>
              (0, j.twoDigitsFormat)(h.getHours()) +
              ':' +
              (0, j.twoDigitsFormat)(h.getMinutes()),
            [h],
          )
        return s.createElement(
          'div',
          { className: d()(X.container, i && X.hasTooltip) },
          s.createElement(
            'div',
            { className: X.datePickerWrapper },
            s.createElement(Y.DatePicker, {
              InputComponent: $.DateInput,
              initial: h,
              onPick: (e) => {
                if (null === e) return
                const t = new Date(h)
                t.setFullYear(e.getFullYear()),
                  t.setMonth(e.getMonth()),
                  t.setDate(e.getDate()),
                  n(f(t), a, l)
              },
              revertInvalidData: !0,
            }),
          ),
          s.createElement(
            'div',
            { className: X.timePickerWrapper },
            s.createElement(w.TimeInput, {
              value: m,
              onChange: (e) => {
                const [t, o] = e.split(':'),
                  s = new Date(h)
                s.setHours(Number(t)), s.setMinutes(Number(o)), n(f(s), a, l)
              },
            }),
          ),
        )
        function v(e) {
          return 60 * new Date(e).getTimezoneOffset() * 1e3
        }
        function f(e) {
          return e.valueOf() - p - v(u)
        }
      })
      class ee extends s.PureComponent {
        render() {
          const {
            input: e,
            disabled: t,
            onChange: n,
            tzName: o,
            hasTooltip: r,
          } = this.props
          if ((0, i.isStudyInputOptionsInfo)(e))
            return s.createElement(D, {
              input: e,
              disabled: t,
              onChange: n,
              hasTooltip: r,
            })
          switch (e.type) {
            case 'integer':
              return s.createElement(a.IntegerInput, {
                input: e,
                disabled: t,
                onChange: n,
                hasTooltip: r,
              })
            case 'float':
            case 'price':
              return s.createElement(l.FloatInput, {
                input: e,
                disabled: t,
                onChange: n,
                hasTooltip: r,
              })
            case 'bool':
              return s.createElement(c.BoolInput, {
                input: e,
                disabled: t,
                onChange: n,
                hasTooltip: r,
              })
            case 'text':
              return s.createElement(b, {
                input: e,
                disabled: t,
                onChange: n,
                hasTooltip: r,
              })
            case 'symbol':
              return s.createElement(C.SymbolInput, {
                input: e,
                disabled: t,
                onChange: n,
                hasTooltip: r,
              })
            case 'session':
              return s.createElement(x, {
                input: e,
                disabled: t,
                onChange: n,
                hasTooltip: r,
              })
            case 'source':
              return s.createElement(L, {
                input: e,
                disabled: t,
                onChange: n,
                hasTooltip: r,
              })
            case 'resolution':
              return s.createElement(H, {
                input: e,
                disabled: t,
                onChange: n,
                hasTooltip: r,
              })
            case 'time':
              return s.createElement(J, {
                input: e,
                tzName: o,
                onChange: n,
                hasTooltip: r,
              })
            case 'color':
              return s.createElement(G, {
                input: e,
                disabled: t,
                onChange: n,
                hasTooltip: r,
              })
            default:
              return null
          }
        }
      }
      var te = n(24150),
        ne = n(76694)
      class oe extends s.PureComponent {
        render() {
          const {
              label: e,
              children: t,
              input: i,
              disabled: a,
              onChange: l,
              labelAlign: c,
              grouped: u,
              tooltip: d,
              solutionId: p,
              offset: h,
            } = this.props,
            m = Boolean(d)
          return s.createElement(
            y.PropertyTable.Row,
            null,
            s.createElement(
              y.PropertyTable.Cell,
              {
                'data-study-input-name':
                  (null == i ? void 0 : i.id) && `${i.id}-label`,
                placement: 'first',
                verticalAlign: c,
                grouped: u,
                offset: h,
              },
              void 0 !== e
                ? e
                : o.t(
                    (0, r.ensureDefined)(i).name,
                    { context: 'input' },
                    n(88601),
                  ),
            ),
            s.createElement(
              y.PropertyTable.Cell,
              {
                'data-study-input-name':
                  (null == i ? void 0 : i.id) && `${i.id}-input`,
                placement: 'last',
                grouped: u,
              },
              t ||
                s.createElement(ee, {
                  input: (0, r.ensureDefined)(i),
                  onChange: l,
                  disabled: a,
                  hasTooltip: m,
                }),
              m &&
                s.createElement(
                  ne.IconGroupWrapper,
                  null,
                  d && s.createElement(te.InputTooltip, { title: d }),
                  !1,
                ),
            ),
          )
        }
      }
    },
    39828: (e, t, n) => {
      n.d(t, { InputsTabContent: () => V })
      var o,
        s = n(50959),
        r = n(50151),
        i = n(11542),
        a = n(76917),
        l = n(11062),
        c = n(59416),
        u = n(97754),
        d = n.n(u),
        p = n(88400),
        h = n.n(p)
      const m = (0, c.makeSwitchGroupItem)(
        (((o = class extends s.PureComponent {
          constructor() {
            super(...arguments),
              (this._onChange = () => {
                this.props.onChange && this.props.onChange(this.props.value)
              })
          }
          render() {
            const e = u(this.props.className, h().radio, {
                [h().reverse]: Boolean(this.props.labelPositionReverse),
              }),
              t = u(h().label, { [h().disabled]: this.props.disabled }),
              n = u(h().box, { [h().noOutline]: -1 === this.props.tabIndex })
            let o = null
            return (
              this.props.label &&
                (o = s.createElement(
                  'span',
                  { className: t },
                  this.props.label,
                )),
              s.createElement(
                'label',
                { className: e },
                s.createElement(
                  'span',
                  { className: h().wrapper, title: this.props.title },
                  s.createElement('input', {
                    id: this.props.id,
                    tabIndex: this.props.tabIndex,
                    autoFocus: this.props.autoFocus,
                    role: this.props.role,
                    className: h().input,
                    type: 'radio',
                    name: this.props.name,
                    checked: this.props.checked,
                    disabled: this.props.disabled,
                    value: this.props.value,
                    onChange: this._onChange,
                    ref: this.props.reference,
                    'aria-describedby': this.props['aria-describedby'],
                    'aria-invalid': this.props['aria-invalid'],
                  }),
                  s.createElement('span', { className: n }),
                ),
                o,
              )
            )
          }
        }).defaultProps = { value: 'on' }),
        o),
      )
      var v = n(55141),
        f = n(83207),
        g = n(24150),
        b = n(76694),
        C = n(27698)
      function y(e) {
        const {
            children: t,
            input: o,
            disabled: u,
            onChange: d,
            grouped: p,
            tooltip: h,
            solutionId: y,
          } = e,
          E = (0, s.useContext)(a.PropertyContext),
          { values: w, setValue: _ } = (0, r.ensureNotNull)(E),
          S = w[o.id],
          [x, N] = (0, s.useState)(S ? 'another-symbol' : 'main-symbol'),
          [T, I] = (0, s.useState)(S),
          k = Boolean(h)
        return (
          (0, s.useEffect)(() => {
            S && I(S)
          }, [S]),
          s.createElement(
            c.SwitchGroup,
            {
              name: `symbol-source-${o.id}`,
              values: [x],
              onChange: (e) => {
                N(e),
                  'main-symbol' === e
                    ? (0, f.setter)(_)('', o.id, o.name)
                    : 'another-symbol' === e &&
                      T &&
                      (0, f.setter)(_, d)(T, o.id, o.name)
              },
            },
            s.createElement(
              l.PropertyTable.Row,
              null,
              s.createElement(
                l.PropertyTable.Cell,
                {
                  colSpan: 2,
                  placement: 'first',
                  grouped: p,
                  'data-study-input-name':
                    (null == o ? void 0 : o.id) && `${o.id}-main-symbol`,
                },
                s.createElement(m, {
                  value: 'main-symbol',
                  className: C.checkbox,
                  disabled: u,
                  label: s.createElement(
                    'span',
                    { className: C.label },
                    i.t(null, { context: 'input' }, n(88046)),
                  ),
                }),
              ),
            ),
            s.createElement(
              l.PropertyTable.Row,
              null,
              s.createElement(
                l.PropertyTable.Cell,
                {
                  placement: 'first',
                  grouped: p,
                  'data-study-input-name':
                    (null == o ? void 0 : o.id) &&
                    `${o.id}-another-symbol-label`,
                },
                s.createElement(m, {
                  value: 'another-symbol',
                  className: C.checkbox,
                  disabled: u,
                  label: s.createElement(
                    'span',
                    { className: C.label },
                    i.t(null, { context: 'input' }, n(73755)),
                  ),
                }),
              ),
              s.createElement(
                l.PropertyTable.Cell,
                {
                  placement: 'last',
                  grouped: p,
                  'data-study-input-name':
                    (null == o ? void 0 : o.id) &&
                    `${o.id}-another-symbol-input`,
                },
                t ||
                  s.createElement(v.SymbolInput, {
                    input: (0, r.ensureDefined)(o),
                    onChange: d,
                    disabled: u || 'main-symbol' === x,
                    hasTooltip: k,
                  }),
                k &&
                  s.createElement(
                    b.IconGroupWrapper,
                    null,
                    h && s.createElement(g.InputTooltip, { title: h }),
                    !1,
                  ),
              ),
            ),
          )
        )
      }
      var E = n(4781)
      class w extends s.PureComponent {
        render() {
          const { label: e, input: t, tooltip: n, solutionId: o } = this.props,
            r = Boolean(n)
          return s.createElement(
            l.PropertyTable.Row,
            null,
            s.createElement(
              l.PropertyTable.Cell,
              {
                placement: 'first',
                colSpan: 2,
                'data-study-input-name':
                  (null == t ? void 0 : t.id) && `${t.id}-checkbox`,
              },
              s.createElement(E.BoolInput, {
                label: e,
                input: t,
                hasTooltip: r,
              }),
              r &&
                s.createElement(
                  b.IconGroupWrapper,
                  null,
                  n && s.createElement(g.InputTooltip, { title: n }),
                  !1,
                ),
            ),
          )
        }
      }
      var _ = n(12949),
        S = n(2568),
        x = n(67029),
        N = n(90009)
      class T extends s.PureComponent {
        constructor() {
          super(...arguments),
            (this._onChange = (e) => {
              const {
                input: { id: t, name: n },
                onChange: o,
              } = this.props
              o(e.currentTarget.value, t, n)
            })
        }
        render() {
          const {
            input: { defval: e },
            value: t,
            disabled: n,
            onBlur: o,
            onKeyDown: r,
          } = this.props
          return s.createElement(S.Textarea, {
            className: d()(C.input, C.textarea, x.InputClasses.FontSizeMedium),
            value: void 0 === t ? e : t,
            onChange: this._onChange,
            onBlur: o,
            onKeyDown: r,
            disabled: n,
            maxLength: 4096,
          })
        }
      }
      const I = (0, N.debounced)(T),
        k = (0, f.bind)(I)
      var B = n(80128)
      function P(e) {
        const { input: t, label: n, tooltip: o, solutionId: r } = e,
          i = Boolean(o)
        return s.createElement(
          l.PropertyTable.Row,
          null,
          s.createElement(
            l.PropertyTable.Cell,
            {
              placement: 'first',
              colSpan: 2,
              className: B.wrap,
              'data-study-input-name':
                (null == t ? void 0 : t.id) && `${t.id}-textarea`,
            },
            s.createElement(
              'div',
              { className: B.labelWrap },
              s.createElement(
                'span',
                { className: d()(B.label, i && B.hasTooltip) },
                n,
              ),
              i &&
                s.createElement(
                  b.IconGroupWrapper,
                  null,
                  o && s.createElement(g.InputTooltip, { title: o }),
                  !1,
                ),
            ),
            s.createElement(k, { input: t }),
          ),
        )
      }
      function D(e) {
        const { input: t, tooltip: o, solutionId: r } = e
        return 'symbol' === t.type && t.optional
          ? s.createElement(y, { input: t, tooltip: o, solutionId: r })
          : 'bool' === t.type
            ? s.createElement(w, {
                label: i.t(t.name, { context: 'input' }, n(88601)),
                input: t,
                tooltip: o,
                solutionId: r,
              })
            : 'text_area' === t.type
              ? s.createElement(P, {
                  label: i.t(t.name, { context: 'input' }, n(88601)),
                  input: t,
                  tooltip: o,
                  solutionId: r,
                })
              : s.createElement(_.InputRow, {
                  labelAlign: ((e) => {
                    switch (e) {
                      case 'session':
                        return 'adaptive'
                      case 'time':
                        return 'topCenter'
                      default:
                        return
                    }
                  })(t.type),
                  input: t,
                  tooltip: o,
                  solutionId: r,
                })
      }
      var M = n(86067),
        O = n(17611)
      function R(e) {
        const { content: t } = e
        let n
        return s.createElement(
          l.PropertyTable.InlineRowContext.Provider,
          { value: !0 },
          s.createElement(
            'div',
            { className: O.inlineRow },
            t.children.map(
              (e, o) => (
                void 0 !== e.tooltip && (n = e.tooltip),
                s.createElement(D, {
                  key: e.id,
                  input: e,
                  tooltip: o === t.children.length - 1 ? n : void 0,
                })
              ),
            ),
          ),
        )
      }
      var L = n(64420),
        A = n(26278)
      function F(e) {
        const { content: t } = e
        return (0, L.isGroup)(t)
          ? (0, L.isInputInlines)(t)
            ? s.createElement(R, { content: t })
            : s.createElement(
                s.Fragment,
                null,
                s.createElement(
                  'div',
                  { className: A.titleWrap },
                  s.createElement(M.GroupTitleSection, {
                    title: i.t(t.id, { context: 'input' }, n(88601)),
                    name: t.id,
                  }),
                ),
                t.children.map((e) =>
                  (0, L.isGroup)(e)
                    ? s.createElement(R, { key: e.id, content: e })
                    : s.createElement(D, {
                        key: e.id,
                        input: e,
                        tooltip: e.tooltip,
                        solutionId: e.solutionId,
                      }),
                ),
                s.createElement('div', { className: A.groupFooter }),
              )
          : s.createElement(D, {
              input: t,
              tooltip: t.tooltip,
              solutionId: t.solutionId,
            })
      }
      const W = { offset: i.t(null, void 0, n(89298)) }
      class V extends s.PureComponent {
        render() {
          const {
              reference: e,
              inputs: t,
              property: n,
              study: o,
              studyMetaInfo: i,
              model: a,
              onStudyInputChange: c,
              className: u,
            } = this.props,
            { offset: d, offsets: p } = n
          return s.createElement(
            l.PropertyTable,
            { reference: e, className: u },
            s.createElement(z, {
              study: o,
              model: a,
              property: n.inputs,
              inputs: t,
              onStudyInputChange: c,
            }),
            d && this._createOffsetSection(d, (0, r.ensureDefined)(i.offset)),
            p &&
              p.childNames().map((e) => {
                var t
                const n = p.childs()[e]
                return this._createOffsetSection(
                  n,
                  (0, r.ensureDefined)(
                    null === (t = i.offsets) || void 0 === t ? void 0 : t[e],
                  ),
                )
              }),
          )
        }
        _createOffsetSection(e, t) {
          const n = e.childs()
          return s.createElement(z, {
            key: `offset_${t.title}`,
            study: this.props.study,
            model: this.props.model,
            inputs: [q(n, t)],
            property: e,
          })
        }
      }
      function z(e) {
        const {
            study: t,
            model: n,
            inputs: o,
            property: r,
            onStudyInputChange: i,
          } = e,
          l = o,
          c = (0, s.useMemo)(() => (0, L.getInputGroups)(l), [l])
        return s.createElement(
          a.PropertyContainer,
          { property: r, study: t, model: n, onStudyInputChange: i },
          !1,
          !1,
          c.map((e) =>
            s.createElement(
              s.Fragment,
              { key: e.id },
              s.createElement(F, { content: e }),
              !1,
            ),
          ),
        )
      }
      function q(e, t) {
        return {
          id: 'val',
          name: t.title || W.offset,
          defval: e.val.value(),
          type: 'integer',
          min: t.min,
          max: t.max,
        }
      }
    },
    4781: (e, t, n) => {
      n.d(t, { BoolInput: () => u, BoolInputComponent: () => c })
      var o = n(50959),
        s = n(15294),
        r = n(97754),
        i = n.n(r),
        a = n(83207),
        l = n(27698)
      class c extends o.PureComponent {
        constructor() {
          super(...arguments),
            (this._onChange = () => {
              const {
                input: { id: e, name: t },
                value: n,
                onChange: o,
              } = this.props
              o(!n, e, t)
            })
        }
        render() {
          const {
              input: { defval: e },
              value: t,
              disabled: n,
              label: r,
              hasTooltip: a,
            } = this.props,
            c = void 0 === t ? e : t
          return o.createElement(s.Checkbox, {
            className: i()(l.checkbox, a && l.hasTooltip),
            disabled: n,
            checked: c,
            onChange: this._onChange,
            label: o.createElement('span', { className: l.label }, r),
            labelAlignBaseline: !0,
          })
        }
      }
      const u = (0, a.bind)(c)
    },
    90009: (e, t, n) => {
      n.d(t, { debounced: () => r })
      var o = n(50959)
      const s = { blur: 0, commit: 0, change: 1 / 0 }
      function r(e, t = s) {
        return class extends o.PureComponent {
          constructor(e) {
            super(e),
              (this._onChange = (e, n, o) => {
                const s = t.change
                s
                  ? (clearTimeout(this._timeout),
                    this.setState({ value: e }, () => {
                      s !== 1 / 0 &&
                        (this._timeout = setTimeout(() => this._flush(), s))
                    }))
                  : this._flush(e)
              }),
              (this._onBlur = () => {
                this._debounce(t.blur)
                const { onBlur: e } = this.props
                e && e()
              }),
              (this._onKeyDown = (e) => {
                13 === e.keyCode && this._debounce(t.commit)
              }),
              (this.state = { prevValue: e.value, value: e.value })
          }
          componentWillUnmount() {
            this._flush()
          }
          render() {
            const { value: t } = this.state
            return o.createElement(e, {
              ...this.props,
              value: t,
              onChange: this._onChange,
              onBlur: this._onBlur,
              onKeyDown: this._onKeyDown,
            })
          }
          static getDerivedStateFromProps(e, t) {
            return e.value === t.prevValue
              ? t
              : { prevValue: e.value, value: e.value }
          }
          _debounce(e) {
            e
              ? (clearTimeout(this._timeout),
                e !== 1 / 0 &&
                  (this._timeout = setTimeout(() => this._flush(), e)))
              : this.setState((e) => {
                  this._flush(e.value)
                })
          }
          _flush(e) {
            const {
                input: { id: t, name: n },
                onChange: o,
              } = this.props,
              { prevValue: s, value: r } = this.state
            clearTimeout(this._timeout)
            const i = void 0 !== e ? e : r
            void 0 !== i && i !== s && o(i, t, n)
          }
        }
      }
    },
    47510: (e, t, n) => {
      n.d(t, { FloatInput: () => p, FloatInputComponent: () => d })
      var o = n(50959),
        s = n(97754),
        r = n.n(s),
        i = n(95052),
        a = n(83207),
        l = n(90009),
        c = n(27698)
      class u extends o.PureComponent {
        render() {
          const { hasTooltip: e } = this.props
          return o.createElement(i.NumericInput, {
            ...this.props,
            className: r()(c.input, e && c.hasTooltip),
            stretch: !1,
          })
        }
      }
      const d = (0, l.debounced)(u, { change: 1 / 0, commit: 0, blur: 0 }),
        p = (0, a.bind)(d)
    },
    96438: (e, t, n) => {
      n.d(t, { IntegerInput: () => p, IntegerInputComponent: () => d })
      var o = n(50959),
        s = n(97754),
        r = n.n(s),
        i = n(83207),
        a = n(90009),
        l = n(95052),
        c = n(27698)
      class u extends o.PureComponent {
        render() {
          const { hasTooltip: e } = this.props
          return o.createElement(l.NumericInput, {
            ...this.props,
            mode: 'integer',
            className: r()(c.input, e && c.hasTooltip),
            stretch: !1,
          })
        }
      }
      const d = (0, a.debounced)(u, { change: 1 / 0, commit: 0, blur: 0 }),
        p = (0, i.bind)(d)
    },
    95052: (e, t, n) => {
      n.d(t, { NumericInput: () => C })
      var o = n(50959),
        s = n(50151),
        r = n(11542),
        i = n(60521),
        a = n(49483),
        l = n(92399),
        c = n(82161),
        u = n(38223)
      var d = n(87663),
        p = n(37160)
      const h = new (class {
          constructor(e = ' ') {
            this._divider = e
          }
          format(e) {
            const t = (0, c.splitThousands)(e, this._divider)
            return (0, u.isRtl)() ? (0, u.startWithLTR)(t) : t
          }
          parse(e) {
            const t = (0, u.stripLTRMarks)(e).split(this._divider).join(''),
              n = Number(t)
            return isNaN(n) || /e/i.test(t)
              ? { res: !1 }
              : { res: !0, value: n, suggest: this.format(n) }
          }
        })(),
        m = /^-?[0-9]*$/,
        v = 9e15
      class f extends o.PureComponent {
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
                'integer' === this.props.mode && !m.test(t))
              )
                return
              const n = b(t, this.props.formatter),
                o = n.res
                  ? this._checkValueBoundaries(n.value)
                  : { isPassed: !1, msg: void 0 },
                s = n.res && !o.isPassed,
                r = n.res && n.suggest && !this.state.focused ? n.suggest : t,
                i = s && o.msg ? o.msg : this._errMsg
              this.setState({ displayValue: r, errorMsg: i }),
                n.res &&
                  o.isPassed &&
                  this.props.onValueChange(n.value, 'input'),
                this.props.errorHandler && this.props.errorHandler(!n.res || s)
            }),
            (this._onValueByStepChange = (e) => {
              const {
                  roundByStep: t = !0,
                  step: n = 1,
                  uiStep: o,
                  min: s = n,
                  formatter: r,
                } = this.props,
                a = b(this.state.displayValue, r),
                l = null != o ? o : n
              let c = n
              if (a.res) {
                const o = new i.Big(a.value),
                  r = o.minus(s).mod(n)
                let u = o.plus(e * l)
                !r.eq(0) && t && (u = u.plus((e > 0 ? 0 : 1) * l).minus(r)),
                  (c = u.toNumber())
              }
              const { isPassed: u, clampedValue: d } =
                this._checkValueBoundaries(c)
              ;(c = u ? c : d),
                this.setState({ displayValue: g(this.props, c) }),
                this.props.onValueChange(c, 'step'),
                this.props.errorHandler && this.props.errorHandler(!1)
            })
          const { value: t } = e
          ;(this._errMsg = r.t(null, void 0, n(35563))),
            (this.state = {
              value: t,
              displayValue: g(e, t),
              focused: !1,
              errorMsg: this._errMsg,
            })
        }
        render() {
          var e
          return o.createElement(l.NumberInputView, {
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
          const { min: e = -1 / 0, max: t = v } = this.props,
            n = b(this.state.displayValue, this.props.formatter)
          return n.res ? (0, p.clamp)(n.value, e, t) : null
        }
        static getDerivedStateFromProps(e, t) {
          const { alwaysUpdateValueFromProps: n, value: o } = e
          return (t.focused && !n) || t.value === o
            ? null
            : { value: o, displayValue: g(e, o) }
        }
        _checkValueBoundaries(e) {
          var t, o, s, i
          const { min: a = -1 / 0, max: l = v } = this.props,
            c = ((e, t, n) => {
              const o = e >= t,
                s = e <= n
              return {
                passMin: o,
                passMax: s,
                pass: o && s,
                clamped: (0, p.clamp)(e, t, n),
              }
            })(e, a, l)
          let u
          return (
            c.passMax ||
              (u =
                null !==
                  (o =
                    null === (t = this.props.boundariesErrorMessages) ||
                    void 0 === t
                      ? void 0
                      : t.greaterThanMax) && void 0 !== o
                  ? o
                  : r.t(null, { replace: { max: String(l) } }, n(2607))),
            c.passMin ||
              (u =
                null !==
                  (i =
                    null === (s = this.props.boundariesErrorMessages) ||
                    void 0 === s
                      ? void 0
                      : s.lessThanMin) && void 0 !== i
                  ? i
                  : r.t(
                      null,
                      {
                        replace: {
                          min: String(a),
                        },
                      },
                      n(53669),
                    )),
            { isPassed: c.pass, msg: u, clampedValue: c.clamped }
          )
        }
      }
      function g(e, t) {
        const { useFormatter: n = !0, formatter: o, mode: s } = e
        return n && 'integer' !== s
          ? ((e, t = h) => (null !== e ? t.format(e) : ''))(t, o)
          : ((e) => {
              if (null === e) return ''
              return d.NumericFormatter.formatNoE(e)
            })(t)
      }
      function b(e, t = h) {
        return t.parse
          ? t.parse(e)
          : { res: !1, error: 'Formatter does not support parse' }
      }
      class C extends o.PureComponent {
        constructor() {
          super(...arguments),
            (this._container = null),
            (this._handleContainerRef = (e) => (this._container = e)),
            (this._onChange = (e, t) => {
              const {
                input: { id: n, name: o },
                onChange: s,
                onBlur: r,
              } = this.props
              s(e, n, o), 'step' === t && r && r()
            }),
            (this._onBlur = (e) => {
              const { onBlur: t } = this.props
              if (t) {
                const n = (0, s.ensureNotNull)(this._container)
                n.contains(document.activeElement) ||
                  n.contains(e.relatedTarget) ||
                  t()
              }
            })
        }
        render() {
          const {
            input: { defval: e, min: t, max: n, step: s },
            value: r,
            disabled: i,
            onKeyDown: a,
            className: l,
            mode: c,
            stretch: u,
          } = this.props
          return o.createElement(f, {
            className: l,
            value: Number(void 0 === r ? e : r),
            min: t,
            max: n,
            step: s,
            mode: c,
            onBlur: this._onBlur,
            onValueChange: this._onChange,
            onKeyDown: a,
            disabled: i,
            containerReference: this._handleContainerRef,
            fontSizeStyle: 'medium',
            roundByStep: !1,
            stretch: u,
          })
        }
      }
    },
    55141: (e, t, n) => {
      n.d(t, { SymbolInput: () => d, getInternalSymbolName: () => c })
      var o = n(50959),
        s = n(50151),
        r = n(76917),
        i = n(83207),
        a = n(73146),
        l = n(48897)
      function c(e, t) {
        const n = (0, a.createAdapter)(t).resolvedSymbolInfoBySymbol(e)
        return n && (n.ticker || n.full_name) ? n.ticker || n.full_name : e
      }
      function u(e, t) {
        const n = (0, a.createAdapter)(t).resolvedSymbolInfoBySymbol(e)
        return null === n ? e : n.name
      }
      const d = (0, i.bind)((e) => {
        const t = (0, o.useContext)(r.PropertyContext),
          { study: n } = (0, s.ensureNotNull)(t),
          {
            input: { defval: i },
            value: a,
          } = e
        return o.createElement(l.SymbolInputsButton, {
          ...e,
          value: u(a || i || '', n),
          study: n,
        })
      })
    },
    41552: (e, t, n) => {
      n.d(t, { ColorWithThicknessSelect: () => f })
      var o = n(50959),
        s = n(24377),
        r = n(11542),
        i = n(36298),
        a = n(87095),
        l = n(41594),
        c = n(58593),
        u = n(17948),
        d = n(51768)
      const p = new i.TranslatedString(
          'change thickness',
          r.t(null, void 0, n(95657)),
        ),
        h = new i.TranslatedString('change color', r.t(null, void 0, n(13066))),
        m = new i.TranslatedString(
          'change opacity',
          r.t(null, void 0, n(17023)),
        ),
        v = [1, 2, 3, 4]
      class f extends o.PureComponent {
        constructor() {
          super(...arguments),
            (this._trackEventLabel = null),
            (this._getTransparencyValue = () => {
              const { transparency: e } = this.props
              return e ? e.value() : 0
            }),
            (this._getOpacityValue = () => {
              const { color: e } = this.props,
                t = (0, u.getPropertyValue)(e)
              if (t)
                return (0, a.isHexColor)(t)
                  ? (0, a.transparencyToAlpha)(this._getTransparencyValue())
                  : (0, s.parseRgba)(t)[3]
            }),
            (this._getColorValueInHex = () => {
              const { color: e } = this.props,
                t = (0, u.getPropertyValue)(e)
              return t
                ? (0, a.isHexColor)(t)
                  ? t
                  : (0, s.rgbToHexString)((0, s.parseRgb)(t))
                : null
            }),
            (this._onThicknessChange = (e) => {
              const { thickness: t } = this.props
              void 0 !== t && this._setProperty(t, e, p)
            }),
            (this._onColorChange = (e) => {
              const { color: t, isPaletteColor: n } = this.props,
                o = (0, u.getPropertyValue)(t)
              let r = 0
              o &&
                (r = (0, a.isHexColor)(o)
                  ? this._getTransparencyValue()
                  : (0, a.alphaToTransparency)((0, s.parseRgba)(o)[3])),
                this._setProperty(t, (0, a.generateColor)(String(e), r, !0), h),
                (this._trackEventLabel =
                  'Plot color > ' + (n ? 'Palette' : 'Single'))
            }),
            (this._onOpacityChange = (e) => {
              const { color: t } = this.props,
                n = (0, u.getPropertyValue)(t)
              this._setProperty(
                t,
                (0, a.generateColor)(n, (0, a.alphaToTransparency)(e), !0),
                m,
              )
            }),
            (this._onPopupClose = () => {
              this._trackEventLabel &&
                ((0, d.trackEvent)(
                  'GUI',
                  'Study settings',
                  this._trackEventLabel,
                ),
                (this._trackEventLabel = null))
            })
        }
        componentWillUnmount() {
          this._onPopupClose()
        }
        render() {
          const {
            selectOpacity: e = !0,
            disabled: t,
            className: n,
          } = this.props
          return o.createElement(c.ColorSelect, {
            className: n,
            disabled: t,
            color: this._getColorValueInHex(),
            selectOpacity: e,
            opacity: this._getOpacityValue(),
            thickness: this._getThicknessValue(),
            thicknessItems: v,
            onColorChange: this._onColorChange,
            onOpacityChange: this._onOpacityChange,
            onThicknessChange: this._onThicknessChange,
            onPopupClose: this._onPopupClose,
          })
        }
        _getThicknessValue() {
          const { thickness: e } = this.props
          return e ? (0, u.getPropertyValue)(e) : void 0
        }
        _setProperty(e, t, n) {
          const { setValue: o } = this.context
          o(e, t, n)
        }
      }
      f.contextType = l.StylePropertyContext
    },
    11062: (e, t, n) => {
      n.d(t, { PropertyTable: () => l })
      var o = n(50959),
        s = n(97754),
        r = n(90186),
        i = n(24712)
      const a = o.createContext(!1)
      class l extends o.PureComponent {
        render() {
          return o.createElement(
            'div',
            {
              ref: this.props.reference,
              className: s(i.content, this.props.className),
            },
            this.props.children,
          )
        }
      }
      ;(l.InlineRowContext = a),
        (l.Row = (e) => {
          const { children: t } = e
          return (0, o.useContext)(a)
            ? o.createElement('span', { className: i.inlineRow }, t)
            : o.createElement(o.Fragment, null, t)
        }),
        (l.Cell = (e) => {
          const t = (0, o.useContext)(a),
            n = s(
              i.cell,
              e.offset && i.offset,
              e.grouped && i.grouped,
              t && i.inlineCell,
              'top' === e.verticalAlign && i.top,
              'topCenter' === e.verticalAlign && i.topCenter,
              'adaptive' === e.verticalAlign && i.adaptive,
              e.checkableTitle && i.checkableTitle,
              2 === e.colSpan && i.fill,
              'first' === e.placement && 2 !== e.colSpan && i.first,
              'last' === e.placement && 2 !== e.colSpan && i.last,
            ),
            l = (0, r.filterDataProps)(e)
          return o.createElement(
            'div',
            { ...l, className: n },
            o.createElement(
              'div',
              { className: s(i.inner, e.className) },
              e.children,
            ),
          )
        }),
        (l.Separator = (e) =>
          o.createElement(
            l.Row,
            null,
            o.createElement('div', {
              className: s(i.cell, i.separator, i.fill),
            }),
          )),
        (l.GroupSeparator = (e) => {
          const t = e.size || 0
          return o.createElement(
            l.Row,
            null,
            o.createElement('div', {
              className: s(i.cell, i.groupSeparator, i.fill, 1 === t && i.big),
            }),
          )
        })
    },
    17948: (e, t, n) => {
      function o(e) {
        return Array.isArray(e) ? e[0].value() : e.value()
      }
      n.d(t, { getPropertyValue: () => o })
    },
    10600: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M13.5 7l1.65-1.65a.5.5 0 0 0 0-.7l-1.8-1.8a.5.5 0 0 0-.7 0L11 4.5M13.5 7L11 4.5M13.5 7l-8.35 8.35a.5.5 0 0 1-.36.15H2.5v-2.3a.5.5 0 0 1 .15-.35L11 4.5"/></svg>'
    },
    99084: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16Zm3.87-12.15c.36.2.49.66.28 1.02l-4 7a.75.75 0 0 1-1.18.16l-3-3a.75.75 0 1 1 1.06-1.06l2.3 2.3 3.52-6.14a.75.75 0 0 1 1.02-.28Z"/></svg>'
    },
    30162: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" fill-rule="evenodd" d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16ZM9 4c-.79 0-1.38.7-1.25 1.48l.67 4.03a.59.59 0 0 0 1.16 0l.67-4.03A1.27 1.27 0 0 0 9 4Zm0 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></svg>'
    },
    27941: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16ZM8 6a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm1 2c.49 0 1 .59 1 1v3.01c0 .42-.51.99-1 .99s-1-.57-1-.99V9c0-.41.51-1 1-1Z"/></svg>'
    },
    82353: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16Zm0-3a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM6 7.5a3 3 0 1 1 6 0c0 .96-.6 1.48-1.17 1.98-.55.48-1.08.95-1.08 1.77h-1.5c0-1.37.7-1.9 1.33-2.38.49-.38.92-.71.92-1.37C10.5 6.67 9.82 6 9 6s-1.5.67-1.5 1.5H6Z"/></svg>'
    },
    65890: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 9" width="11" height="9" fill="none"><path stroke-width="2" d="M0.999878 4L3.99988 7L9.99988 1"/></svg>'
    },
    17105: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 21 21m0-21-21 21"/></svg>'
    },
    15130: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 15 15m0-15-15 15"/></svg>'
    },
    38822: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 11 11m0-11-11 11"/></svg>'
    },
    63346: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 9 9m0-9-9 9"/></svg>'
    },
    34983: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" width="10" height="10"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 7 7m0-7-7 7"/></svg>'
    },
  },
])
