;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [544, 9255],
  {
    159255: (e, t, n) => {
      n.r(t), n.d(t, { default: () => w })
      var o = (() => {
          if ('undefined' != typeof Map) return Map
          function e(e, t) {
            var n = -1
            return e.some((e, o) => e[0] === t && ((n = o), !0)), n
          }
          return (() => {
            function t() {
              this.__entries__ = []
            }
            return (
              Object.defineProperty(t.prototype, 'size', {
                get: function () {
                  return this.__entries__.length
                },
                enumerable: !0,
                configurable: !0,
              }),
              (t.prototype.get = function (t) {
                var n = e(this.__entries__, t),
                  o = this.__entries__[n]
                return o && o[1]
              }),
              (t.prototype.set = function (t, n) {
                var o = e(this.__entries__, t)
                ~o
                  ? (this.__entries__[o][1] = n)
                  : this.__entries__.push([t, n])
              }),
              (t.prototype.delete = function (t) {
                var n = this.__entries__,
                  o = e(n, t)
                ~o && n.splice(o, 1)
              }),
              (t.prototype.has = function (t) {
                return !!~e(this.__entries__, t)
              }),
              (t.prototype.clear = function () {
                this.__entries__.splice(0)
              }),
              (t.prototype.forEach = function (e, t) {
                void 0 === t && (t = null)
                for (var n = 0, o = this.__entries__; n < o.length; n++) {
                  var r = o[n]
                  e.call(t, r[1], r[0])
                }
              }),
              t
            )
          })()
        })(),
        r =
          'undefined' != typeof window &&
          'undefined' != typeof document &&
          window.document === document,
        s =
          void 0 !== n.g && n.g.Math === Math
            ? n.g
            : 'undefined' != typeof self && self.Math === Math
              ? self
              : 'undefined' != typeof window && window.Math === Math
                ? window
                : Function('return this')(),
        i =
          'function' == typeof requestAnimationFrame
            ? requestAnimationFrame.bind(s)
            : (e) => setTimeout(() => e(Date.now()), 1e3 / 60)
      var a = [
          'top',
          'right',
          'bottom',
          'left',
          'width',
          'height',
          'size',
          'weight',
        ],
        l = 'undefined' != typeof MutationObserver,
        c = (() => {
          function e() {
            ;(this.connected_ = !1),
              (this.mutationEventsAdded_ = !1),
              (this.mutationsObserver_ = null),
              (this.observers_ = []),
              (this.onTransitionEnd_ = this.onTransitionEnd_.bind(this)),
              (this.refresh = ((e, t) => {
                var n = !1,
                  o = !1,
                  r = 0
                function s() {
                  n && ((n = !1), e()), o && l()
                }
                function a() {
                  i(s)
                }
                function l() {
                  var e = Date.now()
                  if (n) {
                    if (e - r < 2) return
                    o = !0
                  } else (n = !0), (o = !1), setTimeout(a, t)
                  r = e
                }
                return l
              })(this.refresh.bind(this), 20))
          }
          return (
            (e.prototype.addObserver = function (e) {
              ~this.observers_.indexOf(e) || this.observers_.push(e),
                this.connected_ || this.connect_()
            }),
            (e.prototype.removeObserver = function (e) {
              var t = this.observers_,
                n = t.indexOf(e)
              ~n && t.splice(n, 1),
                !t.length && this.connected_ && this.disconnect_()
            }),
            (e.prototype.refresh = function () {
              this.updateObservers_() && this.refresh()
            }),
            (e.prototype.updateObservers_ = function () {
              var e = this.observers_.filter(
                (e) => (e.gatherActive(), e.hasActive()),
              )
              return e.forEach((e) => e.broadcastActive()), e.length > 0
            }),
            (e.prototype.connect_ = function () {
              r &&
                !this.connected_ &&
                (document.addEventListener(
                  'transitionend',
                  this.onTransitionEnd_,
                ),
                window.addEventListener('resize', this.refresh),
                l
                  ? ((this.mutationsObserver_ = new MutationObserver(
                      this.refresh,
                    )),
                    this.mutationsObserver_.observe(document, {
                      attributes: !0,
                      childList: !0,
                      characterData: !0,
                      subtree: !0,
                    }))
                  : (document.addEventListener(
                      'DOMSubtreeModified',
                      this.refresh,
                    ),
                    (this.mutationEventsAdded_ = !0)),
                (this.connected_ = !0))
            }),
            (e.prototype.disconnect_ = function () {
              r &&
                this.connected_ &&
                (document.removeEventListener(
                  'transitionend',
                  this.onTransitionEnd_,
                ),
                window.removeEventListener('resize', this.refresh),
                this.mutationsObserver_ && this.mutationsObserver_.disconnect(),
                this.mutationEventsAdded_ &&
                  document.removeEventListener(
                    'DOMSubtreeModified',
                    this.refresh,
                  ),
                (this.mutationsObserver_ = null),
                (this.mutationEventsAdded_ = !1),
                (this.connected_ = !1))
            }),
            (e.prototype.onTransitionEnd_ = function (e) {
              var t = e.propertyName,
                n = void 0 === t ? '' : t
              a.some((e) => !!~n.indexOf(e)) && this.refresh()
            }),
            (e.getInstance = function () {
              return (
                this.instance_ || (this.instance_ = new e()), this.instance_
              )
            }),
            (e.instance_ = null),
            e
          )
        })(),
        u = (e, t) => {
          for (var n = 0, o = Object.keys(t); n < o.length; n++) {
            var r = o[n]
            Object.defineProperty(e, r, {
              value: t[r],
              enumerable: !1,
              writable: !1,
              configurable: !0,
            })
          }
          return e
        },
        d = (e) => (e && e.ownerDocument && e.ownerDocument.defaultView) || s,
        p = b(0, 0, 0, 0)
      function h(e) {
        return Number.parseFloat(e) || 0
      }
      function m(e) {
        for (var t = [], n = 1; n < arguments.length; n++)
          t[n - 1] = arguments[n]
        return t.reduce((t, n) => t + h(e['border-' + n + '-width']), 0)
      }
      function f(e) {
        var t = e.clientWidth,
          n = e.clientHeight
        if (!t && !n) return p
        var o = d(e).getComputedStyle(e),
          r = ((e) => {
            for (
              var t = {}, n = 0, o = ['top', 'right', 'bottom', 'left'];
              n < o.length;
              n++
            ) {
              var r = o[n],
                s = e['padding-' + r]
              t[r] = h(s)
            }
            return t
          })(o),
          s = r.left + r.right,
          i = r.top + r.bottom,
          a = h(o.width),
          l = h(o.height)
        if (
          ('border-box' === o.boxSizing &&
            (Math.round(a + s) !== t && (a -= m(o, 'left', 'right') + s),
            Math.round(l + i) !== n && (l -= m(o, 'top', 'bottom') + i)),
          !((e) => e === d(e).document.documentElement)(e))
        ) {
          var c = Math.round(a + s) - t,
            u = Math.round(l + i) - n
          1 !== Math.abs(c) && (a -= c), 1 !== Math.abs(u) && (l -= u)
        }
        return b(r.left, r.top, a, l)
      }
      var g =
        'undefined' != typeof SVGGraphicsElement
          ? (e) => e instanceof d(e).SVGGraphicsElement
          : (e) =>
              e instanceof d(e).SVGElement && 'function' == typeof e.getBBox
      function v(e) {
        return r
          ? g(e)
            ? ((e) => {
                var t = e.getBBox()
                return b(0, 0, t.width, t.height)
              })(e)
            : f(e)
          : p
      }
      function b(e, t, n, o) {
        return { x: e, y: t, width: n, height: o }
      }
      var _ = (() => {
          function e(e) {
            ;(this.broadcastWidth = 0),
              (this.broadcastHeight = 0),
              (this.contentRect_ = b(0, 0, 0, 0)),
              (this.target = e)
          }
          return (
            (e.prototype.isActive = function () {
              var e = v(this.target)
              return (
                (this.contentRect_ = e),
                e.width !== this.broadcastWidth ||
                  e.height !== this.broadcastHeight
              )
            }),
            (e.prototype.broadcastRect = function () {
              var e = this.contentRect_
              return (
                (this.broadcastWidth = e.width),
                (this.broadcastHeight = e.height),
                e
              )
            }),
            e
          )
        })(),
        C = function (e, t) {
          var n,
            o,
            r,
            s,
            i,
            a,
            l,
            c =
              ((o = (n = t).x),
              (r = n.y),
              (s = n.width),
              (i = n.height),
              (a =
                'undefined' != typeof DOMRectReadOnly
                  ? DOMRectReadOnly
                  : Object),
              (l = Object.create(a.prototype)),
              u(l, {
                x: o,
                y: r,
                width: s,
                height: i,
                top: r,
                right: o + s,
                bottom: i + r,
                left: o,
              }),
              l)
          u(this, { target: e, contentRect: c })
        },
        y = (() => {
          function e(e, t, n) {
            if (
              ((this.activeObservations_ = []),
              (this.observations_ = new o()),
              'function' != typeof e)
            )
              throw new TypeError(
                'The callback provided as parameter 1 is not a function.',
              )
            ;(this.callback_ = e),
              (this.controller_ = t),
              (this.callbackCtx_ = n)
          }
          return (
            (e.prototype.observe = function (e) {
              if (!arguments.length)
                throw new TypeError('1 argument required, but only 0 present.')
              if ('undefined' != typeof Element && Element instanceof Object) {
                if (!(e instanceof d(e).Element))
                  throw new TypeError('parameter 1 is not of type "Element".')
                var t = this.observations_
                t.has(e) ||
                  (t.set(e, new _(e)),
                  this.controller_.addObserver(this),
                  this.controller_.refresh())
              }
            }),
            (e.prototype.unobserve = function (e) {
              if (!arguments.length)
                throw new TypeError('1 argument required, but only 0 present.')
              if ('undefined' != typeof Element && Element instanceof Object) {
                if (!(e instanceof d(e).Element))
                  throw new TypeError('parameter 1 is not of type "Element".')
                var t = this.observations_
                t.has(e) &&
                  (t.delete(e), t.size || this.controller_.removeObserver(this))
              }
            }),
            (e.prototype.disconnect = function () {
              this.clearActive(),
                this.observations_.clear(),
                this.controller_.removeObserver(this)
            }),
            (e.prototype.gatherActive = function () {
              this.clearActive(),
                this.observations_.forEach((t) => {
                  t.isActive() && this.activeObservations_.push(t)
                })
            }),
            (e.prototype.broadcastActive = function () {
              if (this.hasActive()) {
                var e = this.callbackCtx_,
                  t = this.activeObservations_.map(
                    (e) => new C(e.target, e.broadcastRect()),
                  )
                this.callback_.call(e, t, e), this.clearActive()
              }
            }),
            (e.prototype.clearActive = function () {
              this.activeObservations_.splice(0)
            }),
            (e.prototype.hasActive = function () {
              return this.activeObservations_.length > 0
            }),
            e
          )
        })(),
        E = 'undefined' != typeof WeakMap ? new WeakMap() : new o(),
        x = function e(t) {
          if (!(this instanceof e))
            throw new TypeError('Cannot call a class as a function.')
          if (!arguments.length)
            throw new TypeError('1 argument required, but only 0 present.')
          var n = c.getInstance(),
            o = new y(t, n, this)
          E.set(this, o)
        }
      ;['observe', 'unobserve', 'disconnect'].forEach((e) => {
        x.prototype[e] = function () {
          var t
          return (t = E.get(this))[e].apply(t, arguments)
        }
      })
      const w = void 0 !== s.ResizeObserver ? s.ResizeObserver : x
    },
    174786: (e, t, n) => {
      n.d(t, { default: () => o })
      const o = () => {}
    },
    323428: (e) => {
      e.exports = {
        button: 'button-PYEOTd6i',
        disabled: 'disabled-PYEOTd6i',
        hidden: 'hidden-PYEOTd6i',
        icon: 'icon-PYEOTd6i',
        dropped: 'dropped-PYEOTd6i',
      }
    },
    869789: (e) => {
      e.exports = {
        checkbox: 'checkbox-vyj6oJxw',
        reverse: 'reverse-vyj6oJxw',
        label: 'label-vyj6oJxw',
        baseline: 'baseline-vyj6oJxw',
      }
    },
    322623: (e) => {
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
    705734: (e) => {
      e.exports = {
        dialog: 'dialog-aRAWUDhF',
        rounded: 'rounded-aRAWUDhF',
        shadowed: 'shadowed-aRAWUDhF',
        fullscreen: 'fullscreen-aRAWUDhF',
        darker: 'darker-aRAWUDhF',
        backdrop: 'backdrop-aRAWUDhF',
      }
    },
    678370: (e) => {
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
    888400: (e) => {
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
    652272: (e) => {
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
    83073: (e) => {
      e.exports = {
        'small-height-breakpoint': 'screen and (max-height: 360px)',
        footer: 'footer-PhMf7PhQ',
        submitButton: 'submitButton-PhMf7PhQ',
        buttons: 'buttons-PhMf7PhQ',
      }
    },
    860015: (e) => {
      e.exports = {
        wrap: 'wrap-ne5qGlZh',
        icon: 'icon-ne5qGlZh',
        text: 'text-ne5qGlZh',
        disabled: 'disabled-ne5qGlZh',
      }
    },
    828685: (e) => {
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
    386536: (e) => {
      e.exports = {
        thicknessContainer: 'thicknessContainer-C05zSid7',
        thicknessTitle: 'thicknessTitle-C05zSid7',
      }
    },
    369006: (e) => {
      e.exports = {
        hasTooltip: 'hasTooltip-DcvaoxPU',
        uppercase: 'uppercase-DcvaoxPU',
      }
    },
    102746: (e) => {
      e.exports = { wrap: 'wrap-Q2NZ0gvI' }
    },
    525679: (e) => {
      e.exports = { checkbox: 'checkbox-FG0u1J5p', title: 'title-FG0u1J5p' }
    },
    941125: (e) => {
      e.exports = { hintButton: 'hintButton-qEI9XsjF' }
    },
    269750: (e) => {
      e.exports = { titleWrap: 'titleWrap-SexRbl__', title: 'title-SexRbl__' }
    },
    963581: (e) => {
      e.exports = {
        button: 'button-HBcDEU4c',
        accessible: 'accessible-HBcDEU4c',
      }
    },
    308326: (e) => {
      e.exports = {
        'tablet-normal-breakpoint': 'screen and (max-width: 768px)',
        'tooltip-offset': '20px',
        dialog: 'dialog-qyCw0PaN',
        dragging: 'dragging-qyCw0PaN',
        dialogAnimatedAppearance: 'dialogAnimatedAppearance-qyCw0PaN',
        dialogAnimation: 'dialogAnimation-qyCw0PaN',
        dialogTooltip: 'dialogTooltip-qyCw0PaN',
      }
    },
    366986: (e) => {
      e.exports = {
        button: 'button-tFul0OhX',
        'button-children': 'button-children-tFul0OhX',
        hiddenArrow: 'hiddenArrow-tFul0OhX',
        invisibleFocusHandler: 'invisibleFocusHandler-tFul0OhX',
      }
    },
    342335: (e) => {
      e.exports = {
        'icon-wrapper': 'icon-wrapper-dikdewwx',
        'with-tooltip': 'with-tooltip-dikdewwx',
        'no-active-state': 'no-active-state-dikdewwx',
      }
    },
    760673: (e) => {
      e.exports = { placeholder: 'placeholder-V6ceS6BN' }
    },
    540191: (e) => {
      e.exports = {
        menuWrap: 'menuWrap-Kq3ruQo8',
        isMeasuring: 'isMeasuring-Kq3ruQo8',
        scrollWrap: 'scrollWrap-Kq3ruQo8',
        momentumBased: 'momentumBased-Kq3ruQo8',
        menuBox: 'menuBox-Kq3ruQo8',
        isHidden: 'isHidden-Kq3ruQo8',
      }
    },
    671986: (e) => {
      e.exports = {
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
        item: 'item-jFqVJoPk',
        hovered: 'hovered-jFqVJoPk',
        isDisabled: 'isDisabled-jFqVJoPk',
        isActive: 'isActive-jFqVJoPk',
        shortcut: 'shortcut-jFqVJoPk',
        toolbox: 'toolbox-jFqVJoPk',
        withIcon: 'withIcon-jFqVJoPk',
        'round-icon': 'round-icon-jFqVJoPk',
        icon: 'icon-jFqVJoPk',
        labelRow: 'labelRow-jFqVJoPk',
        label: 'label-jFqVJoPk',
        showOnHover: 'showOnHover-jFqVJoPk',
        'disclosure-item-circle-logo': 'disclosure-item-circle-logo-jFqVJoPk',
        showOnFocus: 'showOnFocus-jFqVJoPk',
      }
    },
    302946: (e, t, n) => {
      n.d(t, { Checkbox: () => c })
      var o = n(50959),
        r = n(497754),
        s = n(230789),
        i = n(408323),
        a = n(869789),
        l = n.n(a)
      class c extends o.PureComponent {
        render() {
          const { inputClassName: e, labelClassName: t, ...n } = this.props,
            s = r(this.props.className, l().checkbox, {
              [l().reverse]: Boolean(this.props.labelPositionReverse),
              [l().baseline]: Boolean(this.props.labelAlignBaseline),
            }),
            a = r(l().label, t, { [l().disabled]: this.props.disabled })
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
              { className: s },
              o.createElement(i.CheckboxInput, { ...n, className: e }),
              c,
            )
          )
        }
      }
      c.defaultProps = { value: 'on' }
      ;(0, s.makeSwitchGroupItem)(c)
    },
    558213: (e, t, n) => {
      n.d(t, { Textarea: () => _ })
      var o,
        r = n(50959),
        s = n(497754),
        i = n(525388),
        a = n(383836),
        l = n(21778),
        c = n(603548),
        u = n(269842),
        d = n(1811),
        p = n(34735),
        h = n(102691),
        m = n(322623),
        f = n.n(m)
      !((e) => {
        ;(e.None = 'none'),
          (e.Vertical = 'vertical'),
          (e.Horizontal = 'horizontal'),
          (e.Both = 'both')
      })(o || (o = {}))
      const g = r.forwardRef((e, t) => {
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
            disabled: g,
            isFocused: v,
            form: b,
            maxLength: _,
            minLength: C,
            name: y,
            placeholder: E,
            readonly: x,
            required: w,
            rows: S,
            value: T,
            defaultValue: N,
            wrap: k,
            containerReference: M,
            onChange: D,
            onSelect: I,
            onFocus: P,
            onContainerFocus: B,
            onBlur: O,
            onPaste: F,
            'aria-describedby': R,
            'aria-required': A,
            'aria-invalid': L,
            hasIcon: V,
            endSlot: z,
            hasAttachImage: W,
            ...H
          } = e,
          q = {
            id: n,
            title: o,
            tabIndex: i,
            role: l,
            autoComplete: u,
            autoFocus: d,
            cols: m,
            disabled: g,
            form: b,
            maxLength: _,
            minLength: C,
            name: y,
            placeholder: E,
            readOnly: x,
            required: w,
            rows: S,
            value: T,
            defaultValue: N,
            wrap: k,
            onChange: D,
            onSelect: I,
            onFocus: P,
            onBlur: O,
            onPaste: F,
            'aria-describedby': R,
            'aria-required': A,
            'aria-invalid': L,
          }
        return r.createElement(p.ControlSkeleton, {
          ...H,
          tabIndex: a,
          disabled: g,
          readonly: x,
          isFocused: v,
          ref: M,
          onFocus: B,
          middleSlot: r.createElement(
            h.MiddleSlot,
            null,
            r.createElement('textarea', {
              ...q,
              className: s(f().textarea, c, z && f().endslot),
              ref: t,
            }),
          ),
          ...(z && {
            endSlot: r.createElement(
              'span',
              { className: s(!W && f()['with-icon']) },
              z,
            ),
          }),
        })
      })
      g.displayName = 'TextareaView'
      const v = (e, t, n) => (t ? void 0 : e ? -1 : n),
        b = (e, t, n) => (t ? void 0 : e ? n : -1),
        _ = r.forwardRef((e, t) => {
          e = (0, l.useControl)(e)
          const {
              className: n,
              disabled: p,
              autoSelectOnFocus: h,
              tabIndex: m = 0,
              borderStyle: _,
              highlight: C,
              resize: y,
              containerReference: E = null,
              onFocus: x,
              onBlur: w,
              hasIcon: S,
              ...T
            } = e,
            N = (0, r.useRef)(null),
            k = (0, r.useRef)(null),
            {
              isMouseDown: M,
              handleMouseDown: D,
              handleMouseUp: I,
            } = (0, c.useIsMouseDown)(),
            [P, B] = (0, a.useFocus)(),
            O = (0, u.createSafeMulticastEventHandler)(
              B.onFocus,
              (e) => {
                h && !M.current && (0, d.selectAllContent)(e.currentTarget)
              },
              x,
            ),
            F = (0, u.createSafeMulticastEventHandler)(B.onBlur, w),
            R = void 0 !== y && y !== o.None,
            A = null != _ ? _ : R ? (C ? 'thick' : 'thin') : void 0,
            L = null != C ? C : !R && void 0
          return r.createElement(g, {
            ...T,
            className: s(
              f()['textarea-container'],
              R && f()['change-highlight'],
              y && y !== o.None && f()[`resize-${y}`],
              P && f().focused,
              n,
            ),
            disabled: p,
            isFocused: P,
            containerTabIndex: v(P, p, m),
            tabIndex: b(P, p, m),
            borderStyle: A,
            highlight: L,
            onContainerFocus: (e) => {
              k.current === e.target && null !== N.current && N.current.focus()
            },
            onFocus: O,
            onBlur: F,
            onMouseDown: D,
            onMouseUp: I,
            ref: (e) => {
              ;(N.current = e),
                'function' == typeof t ? t(e) : t && (t.current = e)
            },
            containerReference: (0, i.useMergedRefs)([E, k]),
            hasIcon: S,
          })
        })
      _.displayName = 'Textarea'
    },
    80137: (e, t, n) => {
      n.d(t, { Dialog: () => c })
      var o = n(50959),
        r = n(497754),
        s = n(682925),
        i = n(801808),
        a = n(800417),
        l = n(705734)
      class c extends o.PureComponent {
        constructor() {
          super(...arguments),
            (this._manager = new i.OverlapManager()),
            (this._handleSlot = (e) => {
              this._manager.setContainer(e)
            })
        }
        render() {
          const {
              rounded: e = !0,
              shadowed: t = !0,
              fullscreen: n = !1,
              darker: i = !1,
              className: c,
              backdrop: u,
              containerTabIndex: d = -1,
            } = this.props,
            p = r(
              c,
              l.dialog,
              e && l.rounded,
              t && l.shadowed,
              n && l.fullscreen,
              i && l.darker,
            ),
            h = (0, a.filterDataProps)(this.props),
            m = this.props.style
              ? { ...this._createStyles(), ...this.props.style }
              : this._createStyles()
          return o.createElement(
            o.Fragment,
            null,
            o.createElement(
              s.SlotContext.Provider,
              { value: this._manager },
              u &&
                o.createElement('div', {
                  onClick: this.props.onClickBackdrop,
                  className: l.backdrop,
                }),
              o.createElement(
                'div',
                {
                  ...h,
                  className: p,
                  style: m,
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
            o.createElement(s.Slot, { reference: this._handleSlot }),
          )
        }
        _createStyles() {
          const {
            bottom: e,
            left: t,
            width: n,
            right: o,
            top: r,
            zIndex: s,
            height: i,
          } = this.props
          return {
            bottom: e,
            left: t,
            right: o,
            top: r,
            zIndex: s,
            maxWidth: n,
            height: i,
          }
        }
      }
    },
    865968: (e, t, n) => {
      n.d(t, {
        useComposedKeyboardActionHandlers: () => a,
        useKeyboardActionHandler: () => i,
        useKeyboardClose: () => u,
        useKeyboardEventHandler: () => l,
        useKeyboardOpen: () => d,
        useKeyboardToggle: () => c,
      })
      var o = n(50959),
        r = n(930202)
      const s = () => !0
      function i(e, t, n = s, r) {
        return (0, o.useCallback)(
          (o) => {
            if (r) {
              if ('horizontal' === r && (40 === o || 38 === o)) return
              if ('vertical' === r && (37 === o || 39 === o)) return
            }
            const s = e.map((e) => ('function' == typeof e ? e() : e))
            return !(!n(o) || !s.includes(o)) && (t(o), !0)
          },
          [...e, t, n],
        )
      }
      function a(...e) {
        return (0, o.useCallback)(
          (t) => {
            for (const n of e) if (n(t)) return !0
            return !1
          },
          [...e],
        )
      }
      function l(e, t = !0) {
        const n = a(...e)
        return (0, o.useCallback)(
          (e) => {
            n((0, r.hashFromEvent)(e)) && t && e.preventDefault()
          },
          [n],
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
          [9, (0, o.useCallback)(() => r.Modifiers.Shift + 9, []), 27],
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
    942544: (e, t, n) => {
      n.d(t, { useControlDisclosure: () => r })
      var o = n(772069)
      function r(e) {
        const { intent: t, highlight: n, ...r } = e,
          { isFocused: s, ...i } = (0, o.useDisclosure)(r)
        return {
          ...i,
          isFocused: s,
          highlight: null != n ? n : s,
          intent: null != t ? t : s ? 'primary' : 'default',
        }
      }
    },
    772069: (e, t, n) => {
      n.d(t, { useDisclosure: () => c })
      var o = n(50959),
        r = n(650151),
        s = n(954343),
        i = n(383836),
        a = n(269842),
        l = n(414823)
      function c(e) {
        const {
            id: t,
            listboxId: n,
            disabled: c,
            buttonTabIndex: u = 0,
            onFocus: d,
            onBlur: p,
            onClick: h,
          } = e,
          [m, f] = (0, o.useState)(!1),
          [g, v] = (0, i.useFocus)(),
          b = g || m,
          _ = (null != n ? n : void 0 !== t)
            ? (0, l.createDomId)(t, 'listbox')
            : void 0,
          C = (0, o.useRef)(null),
          y = (0, o.useCallback)(
            (e) => {
              var t
              return null === (t = C.current) || void 0 === t
                ? void 0
                : t.focus(e)
            },
            [C],
          ),
          E = (0, o.useRef)(null),
          x = (0, o.useCallback)(
            () => (0, r.ensureNotNull)(E.current).focus(),
            [E],
          ),
          w = (0, o.useCallback)(() => f(!0), [f]),
          S = (0, o.useCallback)(
            (e = !1, t = !1) => {
              f(!1)
              const { activeElement: n } = document
              ;(n && (0, s.isTextEditingField)(n)) ||
                t ||
                y({ preventScroll: e })
            },
            [f, y],
          ),
          T = (0, o.useCallback)(() => {
            m ? S() : w()
          }, [m, S, w]),
          N = c ? [] : [d, v.onFocus],
          k = c ? [] : [p, v.onBlur],
          M = c ? [] : [h, T],
          D = (0, a.createSafeMulticastEventHandler)(...N),
          I = (0, a.createSafeMulticastEventHandler)(...k),
          P = (0, a.createSafeMulticastEventHandler)(...M)
        return {
          listboxId: _,
          isOpened: m,
          isFocused: b,
          buttonTabIndex: c ? -1 : u,
          listboxTabIndex: -1,
          open: w,
          close: S,
          toggle: T,
          onOpen: x,
          buttonFocusBindings: { onFocus: D, onBlur: I },
          onButtonClick: P,
          buttonRef: C,
          listboxRef: E,
          buttonAria: {
            'aria-controls': m ? _ : void 0,
            'aria-expanded': m,
            'aria-disabled': c,
          },
        }
      }
    },
    383836: (e, t, n) => {
      n.d(t, { useFocus: () => r })
      var o = n(50959)
      function r(e, t) {
        const [n, r] = (0, o.useState)(!1)
        ;(0, o.useEffect)(() => {
          t && n && r(!1)
        }, [t, n])
        const s = {
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
        return [n, s]
      }
    },
    975228: (e, t, n) => {
      n.d(t, {
        hoverMouseEventFilter: () => s,
        useAccurateHover: () => i,
        useHover: () => r,
      })
      var o = n(50959)
      function r() {
        const [e, t] = (0, o.useState)(!1)
        return [
          e,
          {
            onMouseOver: (e) => {
              s(e) && t(!0)
            },
            onMouseOut: (e) => {
              s(e) && t(!1)
            },
          },
        ]
      }
      function s(e) {
        return !e.currentTarget.contains(e.relatedTarget)
      }
      function i(e) {
        const [t, n] = (0, o.useState)(!1)
        return (
          (0, o.useEffect)(() => {
            const t = (t) => {
              if (null === e.current) return
              const o = e.current.contains(t.target)
              n(o)
            }
            return (
              document.addEventListener('mouseover', t),
              () => document.removeEventListener('mouseover', t)
            )
          }, []),
          t
        )
      }
    },
    648621: (e, t, n) => {
      n.d(t, { useItemsKeyboardNavigation: () => i })
      var o = n(50959),
        r = n(865968)
      function s(e, t) {
        return e >= 0 ? e % t : (t - (Math.abs(e) % t)) % t
      }
      function i(e, t, n, i, a, l, c = {}, u) {
        const d = (0, o.useCallback)(
            (e) => {
              const t = n.findIndex(i)
              if (t === n.length - 1 && !l)
                return void (
                  (null == u ? void 0 : u.onFailNext) && u.onFailNext(e)
                )
              const o = s(t + 1, n.length)
              a && a(n[o], 'next')
            },
            [n, i, a, l],
          ),
          p = (0, o.useCallback)(
            (e) => {
              const t = n.findIndex(i)
              if (0 === t && !l)
                return void (
                  (null == u ? void 0 : u.onFailPrev) && u.onFailPrev(e)
                )
              const o = s(t - 1, n.length)
              a && a(n[o], 'previous')
            },
            [n, i, a, l],
          ),
          h = (0, o.useCallback)(() => {
            a && a(n[0], 'first')
          }, [a, n]),
          m = (0, o.useCallback)(() => {
            a && a(n[n.length - 1], 'last')
          }, [a, n]),
          f = (0, o.useMemo)(
            () =>
              ((e) => ({
                next: [40, () => (e() ? 37 : 39)],
                previous: [38, () => (e() ? 39 : 37)],
                first: [33, () => (e() ? 35 : 36)],
                last: [34, () => (e() ? 36 : 35)],
              }))(t),
            [t],
          ),
          {
            next: g = f.next,
            previous: v = f.previous,
            first: b = f.first,
            last: _ = f.last,
          } = c
        return (0, r.useComposedKeyboardActionHandlers)(
          (0, r.useKeyboardActionHandler)(g, d, () => !0, e),
          (0, r.useKeyboardActionHandler)(v, p, () => !0, e),
          (0, r.useKeyboardActionHandler)(b, h, () => !0, e),
          (0, r.useKeyboardActionHandler)(_, m, () => !0, e),
        )
      }
    },
    930617: (e, t, n) => {
      n.d(t, { useKeepActiveItemIntoView: () => d })
      var o = n(50959),
        r = n(650151),
        s = n(549423)
      const i = { duration: 200, additionalScroll: 0 },
        a = {
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
      function l(e, t) {
        const n = a[e]
        return t[n.scrollSize] > t[n.clientSize]
      }
      function c(e, t, n, o, r, i) {
        const l = ((e, t, n, o = 0) => {
          const r = a[e]
          return {
            start: -1 * o,
            middle:
              -1 * (Math.floor(n[r.size] / 2) - Math.floor(t[r.size] / 2)),
            end: -1 * (n[r.size] - t[r.size]) + o,
          }
        })(e, o, r, i.additionalScroll)
        let c = 0
        if (
          ((e, t, n) => {
            const o = a[e]
            return (
              t[o.start] < n[o.start] - n[o.size] / 2 ||
              t[o.end] > n[o.end] + n[o.size] / 2
            )
          })(e, o, r)
        )
          c = l.middle
        else {
          const t = ((e, t, n, o = 0) => {
              const r = a[e],
                s = t[r.start] + Math.floor(t[r.size] / 2),
                i = n[r.start] + Math.floor(n[r.size] / 2)
              return {
                start: t[r.start] - n[r.start] - o,
                middle: s - i,
                end: t[r.end] - n[r.end] + o,
              }
            })(e, o, r, i.additionalScroll),
            n = ((e) => {
              const { start: t, middle: n, end: o } = e,
                r = new Map([
                  [Math.abs(t), { key: 'start', value: Math.sign(t) }],
                  [Math.abs(n), { key: 'middle', value: Math.sign(n) }],
                  [Math.abs(o), { key: 'end', value: Math.sign(o) }],
                ]),
                s = Math.min(...r.keys())
              return r.get(s)
            })(t)
          c = void 0 !== n ? l[n.key] : 0
        }
        return ((e) => {
          const {
            additionalScroll: t = 0,
            duration: n = s.dur,
            func: o = s.easingFunc.easeInOutCubic,
            onScrollEnd: r,
            target: i,
            wrap: a,
            direction: l = 'vertical',
          } = e
          let { targetRect: c, wrapRect: u } = e
          ;(c = null != c ? c : i.getBoundingClientRect()),
            (u = null != u ? u : a.getBoundingClientRect())
          const d = ('vertical' === l ? c.top - u.top : c.left - u.left) + t,
            p = 'vertical' === l ? 'scrollTop' : 'scrollLeft',
            h = a ? a[p] : 0
          let m,
            f = 0
          return (
            (f = window.requestAnimationFrame(function e(t) {
              let s
              if ((m ? (s = t - m) : ((s = 0), (m = t)), s >= n))
                return (a[p] = h + d), void (r && r())
              const i = h + d * o(s / n)
              ;(a[p] = Math.floor(i)), (f = window.requestAnimationFrame(e))
            })),
            () => {
              window.cancelAnimationFrame(f), r && r()
            }
          )
        })({
          ...i,
          target: t,
          targetRect: o,
          wrap: n,
          wrapRect: r,
          additionalScroll: c,
          direction: e,
        })
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
            !((e, t) => {
              const n = e.getBoundingClientRect(),
                o = t.getBoundingClientRect()
              return (
                n.top >= o.top &&
                n.bottom <= o.bottom &&
                n.left >= o.left &&
                n.right <= o.right
              )
            })(e, this._container)
          ) {
            const n = e.getBoundingClientRect(),
              o = this._container.getBoundingClientRect()
            this.stopScroll(),
              l('vertical', this._container) &&
                (this._stopVerticalScroll = c(
                  'vertical',
                  e,
                  this._container,
                  n,
                  o,
                  this._modifyOptions('vertical', t),
                )),
              l('horizontal', this._container) &&
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
          var t
          ;(this._container = e),
            (null === (t = this._container) || void 0 === t
              ? void 0
              : t.contains(this._lastScrolledElement)) ||
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
        const { activeItem: t, getKey: n, ...s } = e,
          i = (0, o.useRef)(null),
          a = (0, o.useRef)(new Map()),
          l = ((e) => {
            const t = (0, o.useRef)(null)
            return (
              (0, o.useEffect)(
                () => (
                  (t.current = new u(e)),
                  () => (0, r.ensureNotNull)(t.current).destroy()
                ),
                [],
              ),
              t
            )
          })(i.current),
          c = (0, o.useCallback)(() => {
            null !== l.current &&
              null !== i.current &&
              l.current.getContainer() !== i.current &&
              l.current.setContainer(i.current)
          }, [l, i]),
          d = (0, o.useCallback)(
            (e) => {
              i.current = e
            },
            [i],
          ),
          p = (0, o.useCallback)(
            (e, t) => {
              const o = n ? n(e) : e
              t ? a.current.set(o, t) : a.current.delete(o)
            },
            [a, n],
          ),
          h = (0, o.useCallback)(
            (e, t) => {
              if (!e) return
              const o = n ? n(e) : e,
                s = a.current.get(o)
              s && (c(), (0, r.ensureNotNull)(l.current).scrollTo(s, t))
            },
            [a, l, n],
          )
        return (0, o.useEffect)(() => h(t, s), [h, t]), [d, p, h]
      }
    },
    525388: (e, t, n) => {
      n.d(t, { useMergedRefs: () => s })
      var o = n(50959),
        r = n(273388)
      function s(e) {
        return (0, o.useCallback)((0, r.mergeRefs)(e), e)
      }
    },
    457927: (e, t, n) => {
      n.d(t, { useRefsMap: () => r })
      var o = n(50959)
      function r() {
        const e = (0, o.useRef)(new Map()),
          t = (0, o.useCallback)(
            (t) => (n) => {
              null !== n ? e.current.set(t, n) : e.current.delete(t)
            },
            [e],
          )
        return [e, t]
      }
    },
    823030: (e, t, n) => {
      n.d(t, { SubmenuContext: () => r, SubmenuHandler: () => s })
      var o = n(50959)
      const r = o.createContext(null)
      function s(e) {
        const [t, n] = (0, o.useState)(null),
          s = (0, o.useRef)(null),
          i = (0, o.useRef)(new Map())
        return (
          (0, o.useEffect)(
            () => () => {
              null !== s.current && clearTimeout(s.current)
            },
            [],
          ),
          o.createElement(
            r.Provider,
            {
              value: {
                current: t,
                setCurrent: (e) => {
                  null !== s.current &&
                    (clearTimeout(s.current), (s.current = null))
                  null === t
                    ? n(e)
                    : (s.current = setTimeout(() => {
                        ;(s.current = null), n(e)
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
    230789: (e, t, n) => {
      n.d(t, { SwitchGroup: () => i, makeSwitchGroupItem: () => a })
      var o = n(50959),
        r = n(174786)
      const s = (0, o.createContext)({
        getName: () => '',
        getValues: () => [],
        getOnChange: () => r.default,
        subscribe: r.default,
        unsubscribe: r.default,
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
            s.Provider,
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
          (t.contextType = s),
          t
        )
      }
    },
    414823: (e, t, n) => {
      n.d(t, { createDomId: () => l, joinDomIds: () => c })
      const o = /\s/g
      function r(e) {
        return 'string' == typeof e
      }
      function s(e) {
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
      function i(e) {
        return e.trim().length > 0
      }
      function a(e) {
        return e.replace(o, '-')
      }
      function l(...e) {
        const t = e.map(s).filter(r).filter(i).map(a)
        return (t.length > 0 && t[0].startsWith('id_') ? t : ['id', ...t]).join(
          '_',
        )
      }
      function c(...e) {
        return e.map(s).filter(r).filter(i).join(' ')
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
    976669: (e, t, n) => {
      n.r(t), n.d(t, { AdaptiveConfirmDialog: () => p })
      var o = n(50959),
        r = n(497754),
        s = n.n(r),
        i = n(805184),
        a = n(650151),
        l = n(609838),
        c = n(180185),
        u = n(533408),
        d = n(83073)
      class p extends o.PureComponent {
        constructor() {
          super(...arguments),
            (this._dialogRef = o.createRef()),
            (this._handleClose = () => {
              const {
                defaultActionOnClose: e,
                onSubmit: t,
                onCancel: n,
                onClose: o,
              } = this.props
              switch (e) {
                case 'submit':
                  t()
                  break
                case 'cancel':
                  n()
              }
              o()
            }),
            (this._handleCancel = () => {
              this.props.onCancel(), this.props.onClose()
            }),
            (this._handleKeyDown = (e) => {
              const {
                onSubmit: t,
                submitButtonDisabled: n,
                submitOnEnterKey: o,
              } = this.props
              13 === (0, c.hashFromEvent)(e) &&
                o &&
                (e.preventDefault(), n || t())
            })
        }
        render() {
          const {
            render: e,
            onClose: t,
            onSubmit: n,
            onCancel: r,
            footerLeftRenderer: s,
            submitButtonText: i,
            submitButtonDisabled: a,
            defaultActionOnClose: l,
            submitOnEnterKey: c,
            ...d
          } = this.props
          return o.createElement(u.AdaptivePopupDialog, {
            ...d,
            ref: this._dialogRef,
            onKeyDown: this._handleKeyDown,
            render: this._renderChildren(),
            onClose: this._handleClose,
          })
        }
        focus() {
          ;(0, a.ensureNotNull)(this._dialogRef.current).focus()
        }
        _renderChildren() {
          return (e) => {
            const {
              render: t,
              footerLeftRenderer: r,
              additionalButtons: a,
              submitButtonText: c,
              submitButtonDisabled: u,
              onSubmit: p,
              cancelButtonText: h,
              showCancelButton: m = !0,
              submitButtonClassName: f,
              cancelButtonClassName: g,
              buttonsWrapperClassName: v,
            } = this.props
            return o.createElement(
              o.Fragment,
              null,
              t(e),
              o.createElement(
                'div',
                { className: d.footer },
                r && r(e.isSmallWidth),
                o.createElement(
                  'div',
                  { className: s()(d.buttons, v) },
                  a,
                  m &&
                    o.createElement(
                      i.Button,
                      {
                        className: g,
                        name: 'cancel',
                        appearance: 'stroke',
                        onClick: this._handleCancel,
                      },
                      null != h ? h : l.t(null, void 0, n(620036)),
                    ),
                  o.createElement(
                    'span',
                    { className: d.submitButton },
                    o.createElement(
                      i.Button,
                      {
                        className: f,
                        disabled: u,
                        name: 'submit',
                        onClick: p,
                        'data-name': 'submit-button',
                      },
                      null != c ? c : l.t(null, void 0, n(468988)),
                    ),
                  ),
                ),
              ),
            )
          }
        }
      }
      p.defaultProps = { defaultActionOnClose: 'submit', submitOnEnterKey: !0 }
    },
    27950: (e, t, n) => {
      n.d(t, { EditButton: () => l })
      var o = n(50959),
        r = n(497754),
        s = n(72571),
        i = n(610600),
        a = n(860015)
      function l(e) {
        const {
          value: t,
          onClick: n,
          className: l,
          startSlot: c,
          disabled: u = !1,
        } = e
        return o.createElement(
          'div',
          {
            className: r(a.wrap, u && a.disabled, l),
            onClick: n,
            'data-name': 'edit-button',
          },
          o.createElement(
            'div',
            { className: r(a.text, 'apply-overflow-tooltip') },
            void 0 !== c && c,
            o.createElement('span', null, t),
          ),
          o.createElement(s.Icon, { icon: i, className: a.icon }),
        )
      }
    },
    552315: (e, t, n) => {
      n.d(t, { ColorSelect: () => k })
      var o = n(50959),
        r = n(497754),
        s = n.n(r),
        i = n(650151),
        a = n(180185),
        l = n(624216),
        c = n(383836),
        u = n(972646),
        d = n(230553),
        p = n(892932),
        h = n(27164),
        m = n(963581)
      function f(e) {
        const {
            button: t,
            children: n,
            className: r,
            onPopupClose: f,
            'data-name': g,
            onColorChange: v,
            disabled: b,
            ..._
          } = e,
          [C, y] = (0, o.useState)(!1),
          [E, x] = (0, o.useState)(!1),
          [w, S] = (0, c.useFocus)(),
          T = (0, o.useRef)(null),
          N = (0, o.useRef)(null),
          k = (0, o.useRef)(null)
        return o.createElement(
          'div',
          { className: r, 'data-name': g },
          o.createElement(
            'button',
            {
              className: s()(
                m.button,
                p.PLATFORM_ACCESSIBILITY_ENABLED && m.accessible,
              ),
              tabIndex: p.PLATFORM_ACCESSIBILITY_ENABLED && !b ? 0 : -1,
              ref: k,
              onClick: () => {
                if (e.disabled) return
                x((e) => !e), y(!1)
              },
              onFocus: S.onFocus,
              onBlur: S.onBlur,
              disabled: b,
            },
            'function' == typeof t ? t(E, w) : t,
          ),
          o.createElement(
            l.PopupMenu,
            {
              reference: N,
              controller: T,
              onFocus: (e) => {
                if (
                  !e.target ||
                  !p.PLATFORM_ACCESSIBILITY_ENABLED ||
                  e.target !== e.currentTarget ||
                  C
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
              isOpened: E,
              onClose: M,
              position: () => {
                const e = (0, i.ensureNotNull)(
                  k.current,
                ).getBoundingClientRect()
                return { x: e.left, y: e.top + e.height }
              },
              doNotCloseOn: k.current,
              onKeyDown: (e) => {
                if (27 === (0, a.hashFromEvent)(e))
                  E && (e.preventDefault(), M())
              },
              onOpen: () => {
                var e
                if (!p.PLATFORM_ACCESSIBILITY_ENABLED) return
                null === (e = T.current) || void 0 === e || e.focus()
              },
              tabIndex: p.PLATFORM_ACCESSIBILITY_ENABLED ? -1 : void 0,
            },
            o.createElement(d.MenuContext.Consumer, null, (e) =>
              o.createElement(u.ColorPicker, {
                ..._,
                onColorChange: v,
                onToggleCustom: y,
                menu: e,
              }),
            ),
            !C && n,
          ),
        )
        function M() {
          x(!1), (0, i.ensureNotNull)(k.current).focus(), f && f()
        }
      }
      var g = n(206397),
        v = n(32240),
        b = n(860184),
        _ = n(609838),
        C = n(230789),
        y = n(652272)
      const E = (0, C.makeSwitchGroupItem)(
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
              s = r(y.thicknessItem, {
                [y.checked]: t,
                [y.accessible]: p.PLATFORM_ACCESSIBILITY_ENABLED,
                [y.focusVisible]: this.state.isFocusVisible,
              }),
              i = r(y.bar, { [y.checked]: t }),
              a = { borderTopWidth: Number.parseInt(n) }
            return o.createElement(
              'div',
              { className: s },
              o.createElement('input', {
                type: 'radio',
                className: y.radio,
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
      function x(e) {
        const { name: t, values: n, selectedValues: r, onChange: s } = e,
          i = n.map((e, t) =>
            o.createElement(E, { key: t, value: e.toString() }),
          ),
          a = r.map((e) => e.toString())
        return o.createElement(
          'div',
          { className: y.wrap },
          o.createElement(
            C.SwitchGroup,
            {
              name: t,
              onChange: (e) => {
                s(Number.parseInt(e))
              },
              values: a,
            },
            i,
          ),
        )
      }
      var w = n(386536)
      const S = _.t(null, void 0, n(360142))
      function T(e) {
        const { value: t, items: n, onChange: r } = e
        return o.createElement(
          'div',
          { className: w.thicknessContainer },
          o.createElement('div', { className: w.thicknessTitle }, S),
          o.createElement(x, {
            name: 'color_picker_thickness_select',
            onChange: r,
            values: n,
            selectedValues: 'mixed' === t ? [] : [t],
          }),
        )
      }
      var N = n(828685)
      function k(e) {
        const {
            className: t,
            selectOpacity: n = void 0 !== e.opacity,
            thickness: r,
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
          [v, b, _] = (0, g.useCustomColors)()
        return o.createElement(
          f,
          {
            className: t,
            disabled: a,
            color: 'mixed' !== i ? i : null,
            selectOpacity: n,
            opacity: l,
            selectCustom: !0,
            customColors: v,
            onColorChange: c,
            onOpacityChange: i ? u : void 0,
            onAddColor: b,
            onRemoveCustomColor: _,
            button: (e, t) => {
              const n = e || t,
                c = n ? 'primary' : 'default'
              return o.createElement(
                'div',
                {
                  className: s()(
                    N.colorPickerWrap,
                    N[`intent-${c}`],
                    N['border-thin'],
                    N['size-medium'],
                    n && N.highlight,
                    n && N.focused,
                    a && N.disabled,
                  ),
                  'data-role': 'button',
                  'data-name': r
                    ? 'color-with-thickness-select'
                    : 'color-select',
                },
                o.createElement(
                  'div',
                  { className: s()(N.colorPicker, a && N.disabled) },
                  i && 'mixed' !== i
                    ? (() => {
                        const e = M(i, l),
                          t = l >= 0.95 && D(i)
                        return o.createElement(
                          'div',
                          { className: N.opacitySwatch },
                          o.createElement('div', {
                            style: { backgroundColor: e },
                            className: s()(N.swatch, t && N.white),
                          }),
                        )
                      })()
                    : o.createElement(
                        'div',
                        { className: N.placeholderContainer },
                        o.createElement('div', {
                          className:
                            'mixed' === i ? N.mixedColor : N.placeholder,
                        }),
                      ),
                  r &&
                    (() => {
                      const e = i && 'mixed' !== i ? M(i, l) : void 0
                      if ('mixed' === r)
                        return o.createElement(
                          'div',
                          { className: N.multiWidth },
                          o.createElement('div', {
                            style: { backgroundColor: e },
                            className: N.line,
                          }),
                          o.createElement('div', {
                            style: { backgroundColor: e },
                            className: N.line,
                          }),
                          o.createElement('div', {
                            style: { backgroundColor: e },
                            className: N.line,
                          }),
                        )
                      return o.createElement('span', {
                        className: s()(N.colorLine, D(i) && N.white),
                        style: { height: r, backgroundColor: e },
                      })
                    })(),
                ),
                n && o.createElement('span', { className: N.shadow }),
              )
            },
            onPopupClose: h,
            'data-name': m,
          },
          r &&
            p &&
            o.createElement(T, {
              value: r,
              items: p,
              onChange: (e) => {
                d && d(e)
              },
            }),
        )
      }
      function M(e, t) {
        return e
          ? (0, v.generateColor)(e, (0, v.alphaToTransparency)(t), !0)
          : '#000000'
      }
      function D(e) {
        return !!e && e.toLowerCase() === b.white
      }
    },
    193315: (e, t, n) => {
      n.d(t, { SymbolInputsButton: () => E })
      var o = n(50959),
        r = n(497754),
        s = n.n(r),
        i = n(609838),
        a = n(650151),
        l = n(753327),
        c = n(910549),
        u = n(156963),
        d = n(793702),
        p = n(265831),
        h = n(558323),
        m = n(27950),
        f = n(955261),
        g = n(720911),
        v = n(707002),
        b = n(32012),
        _ = n(626800),
        C = n(369006)
      function y(e) {
        const { symbol: t, onSymbolChanged: r, disabled: a, className: d } = e,
          [f, g] = (0, o.useState)(t),
          y = (0, o.useContext)(l.SlotContext),
          E = (0, o.useContext)(c.PopupContext)
        return o.createElement(m.EditButton, {
          value: f,
          onClick: () => {
            const e = ((e) => {
                const t = (0, v.tokenize)(e)
                return (0, b.isSpread)(t)
              })(f)
                ? f
                : (0, _.safeShortName)(f),
              t = (0, p.getSymbolSearchCompleteOverrideFunction)()
            ;(0, h.showSymbolSearchItemsDialog)({
              onSearchComplete: (e) => {
                t(e[0].symbol, e[0].result).then((e) => {
                  r(e.symbol), g(e.name)
                })
              },
              dialogTitle: i.t(null, void 0, n(423398)),
              defaultValue: e,
              manager: y,
              onClose: () => {
                E && E.focus()
              },
              showSpreadActions:
                u.enabled('show_spread_operators') &&
                u.enabled('studies_symbol_search_spread_operators'),
            })
          },
          disabled: a,
          className: s()(
            d,
            u.enabled('uppercase_instrument_names') && C.uppercase,
          ),
        })
      }
      function E(e) {
        if ('definition' in e) {
          const {
              propType: t,
              properties: n,
              id: r,
              title: s = '',
              solutionId: i,
            } = e.definition,
            l = n[t],
            c = l.value() || '',
            u = (e) => {
              l.setValue(e)
            }
          return o.createElement(
            f.CommonSection,
            { id: r, title: s, solutionId: i },
            o.createElement(
              g.CellWrap,
              null,
              o.createElement(y, {
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
              input: { id: r, name: i },
              onChange: l,
              disabled: c,
              hasTooltip: u,
            } = e,
            p = (e) => {
              const n = (0, d.getInternalSymbolName)(e, t)
              l(n, r, i)
            }
          return o.createElement(y, {
            symbol: (0, a.ensureDefined)(n),
            onSymbolChanged: p,
            disabled: c,
            className: s()(u && C.hasTooltip),
          })
        }
      }
    },
    558323: (e, t, n) => {
      n.d(t, { showSymbolSearchItemsDialog: () => l })
      var o = n(50959),
        r = n(500962),
        s = n(753327),
        i = n(63192),
        a = n(121087)
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
          initialScreen: f,
          wrapper: g,
          dialog: v,
          contentItem: b,
          onClose: _,
          onOpen: C,
          footer: y,
          symbolTypes: E,
          searchInput: x,
          emptyState: w,
          hideMarkedListFlag: S,
          dialogWidth: T = 'auto',
          manager: N,
          shouldReturnFocus: k,
          onSymbolFiltersParamsChange: M,
          onEmptyResults: D,
        } = e
        if (
          i.dialogsOpenerManager.isOpened('SymbolSearch') ||
          i.dialogsOpenerManager.isOpened('ChangeIntervalDialog')
        )
          return
        const I = document.createElement('div'),
          P = o.createElement(
            s.SlotContext.Provider,
            { value: null != N ? N : null },
            o.createElement(a.SymbolSearchItemsDialog, {
              onClose: B,
              initialMode: t,
              defaultValue: l,
              showSpreadActions: c,
              hideMarkedListFlag: S,
              selectSearchOnInit: u,
              onSearchComplete: d,
              dialogTitle: p,
              placeholder: h,
              fullscreen: m,
              initialScreen: f,
              wrapper: g,
              dialog: v,
              contentItem: b,
              footer: y,
              symbolTypes: E,
              searchInput: x,
              emptyState: w,
              autofocus: n,
              dialogWidth: T,
              shouldReturnFocus: k,
              onSymbolFiltersParamsChange: M,
              onEmptyResults: D,
            }),
          )
        function B() {
          r.unmountComponentAtNode(I),
            i.dialogsOpenerManager.setAsClosed('SymbolSearch'),
            _ && _()
        }
        return (
          r.render(P, I),
          i.dialogsOpenerManager.setAsOpened('SymbolSearch'),
          C && C(),
          { close: B }
        )
      }
    },
    39290: (e, t, n) => {
      n.d(t, { createAdapter: () => s })
      var o = n(919577),
        r = n(593194)
      function s(e) {
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
        if ((0, r.isStudy)(e)) return e
        if ('isInputsStudy' in e) return e
        throw new TypeError('Unsupported source type.')
      }
    },
    771586: (e, t, n) => {
      n.d(t, { useDefinitionProperty: () => s })
      var o = n(50959),
        r = n(653898)
      const s = (e) => {
        const t = 'property' in e ? e.property : void 0,
          n = 'defaultValue' in e ? e.defaultValue : e.property.value(),
          [s, i] = (0, o.useState)(t ? t.value() : n)
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
          s,
          (e) => {
            if (void 0 !== t) {
              const n = t.value()
              r.logger.logNormal(
                `Changing property value from "${n}" to "${e}"`,
              ),
                t.setValue(e)
            }
          },
        ]
      }
    },
    720911: (e, t, n) => {
      n.d(t, { CellWrap: () => a })
      var o = n(50959),
        r = n(497754),
        s = n.n(r),
        i = n(102746)
      function a(e) {
        return o.createElement(
          'div',
          { className: s()(i.wrap, e.className) },
          e.children,
        )
      }
    },
    76882: (e, t, n) => {
      n.d(t, { CheckableTitle: () => c })
      var o = n(50959),
        r = n(302946),
        s = n(771586)
      function i(e) {
        const { property: t, ...n } = e,
          [i, a] = (0, s.useDefinitionProperty)({ property: t }),
          l = 'mixed' === i
        return o.createElement(r.Checkbox, {
          ...n,
          name: 'toggle-enabled',
          checked: l || i,
          indeterminate: l,
          onChange: () => {
            a('mixed' === i || !i)
          },
        })
      }
      var a = n(720911),
        l = n(525679)
      function c(e) {
        const { property: t, disabled: n, title: r, className: s, name: c } = e,
          u = o.createElement('span', { className: l.title }, r)
        return o.createElement(
          a.CellWrap,
          { className: s },
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
    955261: (e, t, n) => {
      n.d(t, { CommonSection: () => i })
      var o = n(50959),
        r = n(459837),
        s = n(76882)
      n(941125)
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
          r.PropertyTable.Row,
          null,
          o.createElement(
            r.PropertyTable.Cell,
            {
              placement: 'first',
              verticalAlign: 'adaptive',
              offset: n,
              'data-section-name': t,
              colSpan: Boolean(c) ? void 0 : 2,
              checkableTitle: !0,
            },
            o.createElement(s.CheckableTitle, {
              name: `is-enabled-${t}`,
              title: l,
              disabled: i,
              property: a,
            }),
            u && !Boolean(c) && !1,
          ),
          Boolean(c) &&
            o.createElement(
              r.PropertyTable.Cell,
              { placement: 'last', 'data-section-name': t },
              c,
              u && !1,
            ),
        )
      }
    },
    852830: (e, t, n) => {
      n.d(t, { GroupTitleSection: () => a })
      var o = n(50959),
        r = n(459837),
        s = n(76882),
        i = n(269750)
      function a(e) {
        return o.createElement(
          r.PropertyTable.Row,
          null,
          o.createElement(
            r.PropertyTable.Cell,
            {
              className: i.titleWrap,
              placement: 'first',
              verticalAlign: 'adaptive',
              colSpan: 2,
              'data-section-name': e.name,
              checkableTitle: !0,
            },
            o.createElement(s.CheckableTitle, {
              title: e.title,
              name: `is-enabled-${e.name}`,
              className: i.title,
            }),
          ),
        )
      }
    },
    653898: (e, t, n) => {
      n.d(t, { logger: () => o })
      const o = (0, n(6835).getLogger)('Platform.GUI.PropertyDefinitionTrace')
    },
    886176: (e, t, n) => {
      n.d(t, { getChartTimezoneOffsetMs: () => i, getTimezoneName: () => s })
      var o = n(673317),
        r = n.n(o)
      function s(e) {
        const t = e.model().timezone()
        if ('exchange' !== t) return t
        const n = e.model().mainSeries().symbolInfo()
        return null == n ? void 0 : n.timezone
      }
      function i(e, t) {
        if (void 0 === t) return 0
        return r().get_timezone(t).offset_utc(e)
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
    910549: (e, t, n) => {
      n.d(t, { PopupContext: () => o })
      const o = n(50959).createContext(null)
    },
    40766: (e, t, n) => {
      n.d(t, { PopupDialog: () => E })
      var o = n(50959),
        r = n(497754),
        s = n(650151),
        i = n(80137),
        a = n(874485),
        l = n(738036),
        c = n(44681)
      function u(e, t, n, o) {
        return e + t > o && (e = o - t), e < n && (e = n), e
      }
      function d(e) {
        return {
          x: (0, c.clamp)(e.x, 20, document.documentElement.clientWidth - 20),
          y: (0, c.clamp)(e.y, 20, window.innerHeight - 20),
        }
      }
      function p(e) {
        return { x: e.clientX, y: e.clientY }
      }
      function h(e) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
      class m {
        constructor(e, t, n = { boundByScreen: !0 }) {
          ;(this._drag = null),
            (this._canBeTouchClick = !1),
            (this._frame = null),
            (this._onMouseDragStart = (e) => {
              if (0 !== e.button || this._isTargetNoDraggable(e)) return
              e.preventDefault(),
                document.addEventListener('mousemove', this._onMouseDragMove),
                document.addEventListener('mouseup', this._onMouseDragEnd)
              const t = d(p(e))
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
              const t = d(h(e))
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
              const t = d(p(e))
              this._dragMove(t)
            }),
            (this._onTouchDragMove = (e) => {
              ;(this._canBeTouchClick = !1), e.preventDefault()
              const t = d(h(e))
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
            r = u(e, n.width, o ? 0 : -1 / 0, o ? window.innerWidth : 1 / 0),
            s = u(t, n.height, o ? 0 : -1 / 0, o ? window.innerHeight : 1 / 0)
          this._dialog.style.transform = `translate(${Math.round(r)}px, ${Math.round(s)}px)`
        }
        _isTargetNoDraggable(e) {
          return (
            e.target instanceof Element &&
            null !== e.target.closest('[data-disable-drag]')
          )
        }
      }
      const f = { vertical: 0 }
      class g {
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
            (this._guard = t.guard || f),
            (this._calculateDialogPosition = t.calculateDialogPosition),
            (this._initialHeight = e.style.height),
            window.addEventListener('resize', this._handleResize)
        }
        updateOptions(e) {
          ;(this._guard = e.guard || f),
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
          const { clientHeight: e, clientWidth: t } = document.documentElement,
            n = this._calcDialogHeight(),
            o = t / 2 - this._dialog.clientWidth / 2,
            r = e / 2 - n / 2
          return { x: Math.round(o), y: Math.round(r) }
        }
        recalculateBounds() {
          var e
          const { clientHeight: t, clientWidth: n } = document.documentElement,
            { vertical: o } = this._guard,
            r =
              null === (e = this._calculateDialogPosition) || void 0 === e
                ? void 0
                : e.call(
                    this,
                    this._dialog,
                    { clientWidth: n, clientHeight: t },
                    { vertical: o },
                  )
          if (this._isFullscreen) {
            if (
              ((this._dialog.style.top = '0px'),
              (this._dialog.style.left = '0px'),
              (this._dialog.style.width = '100%'),
              (this._dialog.style.height = '100%'),
              (this._dialog.style.transform = 'none'),
              r)
            ) {
              const { left: e, top: t, width: n, height: o } = r
              ;(this._dialog.style.transform = `translate(${Math.round(e)}px, ${Math.round(t)}px)`),
                n &&
                  ((this._dialog.style.width = `${n}px`),
                  (this._dialog.style.minWidth = 'unset')),
                o &&
                  ((this._dialog.style.height = `${o}px`),
                  (this._dialog.style.minHeight = 'unset'))
            }
          } else if (r) {
            const { left: e, top: t } = r
            this._dialog.style.transform = `translate(${Math.round(e)}px, ${Math.round(t)}px)`
          } else {
            ;(this._dialog.style.width = ''), (this._dialog.style.height = '')
            const e = this._dialog.getBoundingClientRect(),
              r = t - 2 * o,
              s = u(e.left, e.width, 0, n),
              i = u(e.top, e.height, o, t)
            ;(this._dialog.style.top = '0px'),
              (this._dialog.style.left = '0px'),
              (this._dialog.style.transform = `translate(${Math.round(s)}px, ${Math.round(i)}px)`),
              (this._dialog.style.height =
                r < e.height ? r + 'px' : this._initialHeight)
          }
        }
        destroy() {
          window.removeEventListener('resize', this._handleResize),
            null !== this._frame &&
              (cancelAnimationFrame(this._frame), (this._frame = null))
        }
        _calcDialogHeight() {
          const e = this._calcAvailableHeight()
          return e < this._dialog.clientHeight ? e : this._dialog.clientHeight
        }
        _calcAvailableHeight() {
          return (
            document.documentElement.clientHeight - 2 * this._guard.vertical
          )
        }
      }
      var v = n(813113),
        b = n(910549),
        _ = n(285089),
        C = n(308326)
      C['tooltip-offset']
      class y extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._dialog = null),
            (this._cleanUpFunctions = []),
            (this._prevActiveElement = null),
            (this._handleDialogRef = (e) => {
              const { reference: t } = this.props
              ;(this._dialog = e), 'function' == typeof t && t(e)
            }),
            (this._handleFocus = (e) => {
              this._moveToTop()
            }),
            (this._handleMouseDown = (e) => {
              this._moveToTop()
            }),
            (this._handleTouchStart = (e) => {
              this._moveToTop()
            }),
            (this.state = { canFitTooltip: !1 })
        }
        render() {
          return o.createElement(
            b.PopupContext.Provider,
            { value: this },
            o.createElement(
              l.OutsideEvent,
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
                  },
                  o.createElement(
                    i.Dialog,
                    {
                      style: this._applyAnimationCSSVariables(),
                      ...this.props,
                      reference: this._handleDialogRef,
                      className: r(C.dialog, this.props.className),
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
          if (e) {
            const e = o.querySelector('[data-dragg-area]')
            if (e && e instanceof HTMLElement) {
              const r = new m(o, e, {
                boundByScreen: Boolean(t),
                onDragStart: n,
              })
              this._cleanUpFunctions.push(() => r.destroy()), (this._drag = r)
            }
          }
          ;(this._prevActiveElement = document.activeElement),
            this.props.autofocus &&
              !o.contains(document.activeElement) &&
              o.focus(),
            (this._isFullScreen() || this.props.fixedBody) &&
              (0, _.setFixedBodyState)(!0)
          const { guard: r, calculateDialogPosition: i } = this.props
          if (this.props.resizeHandler) this._resize = this.props.resizeHandler
          else {
            const e = new g(o, { guard: r, calculateDialogPosition: i })
            this._cleanUpFunctions.push(() => e.destroy()), (this._resize = e)
          }
          if (
            (this.props.isAnimationEnabled &&
              this.props.growPoint &&
              this._applyAppearanceAnimation(this.props.growPoint),
            this.props.centeredOnMount && this._resize.centerAndFit(),
            this._resize.setFullscreen(this._isFullScreen()),
            this.props.shouldForceFocus)
          ) {
            if (this.props.onForceFocus) return void this.props.onForceFocus(o)
            o.focus()
          }
        }
        componentDidUpdate() {
          if (this._resize) {
            const { guard: e, calculateDialogPosition: t } = this.props
            this._resize.updateOptions({
              guard: e,
              calculateDialogPosition: t,
            }),
              this._resize.setFullscreen(this._isFullScreen())
          }
          this._drag &&
            this._drag.updateOptions({
              boundByScreen: Boolean(this.props.boundByScreen),
              onDragStart: this.props.onDragStart,
            })
        }
        componentWillUnmount() {
          var e
          if (
            this.props.shouldReturnFocus &&
            this._prevActiveElement &&
            document.body.contains(this._prevActiveElement) &&
            (null === document.activeElement ||
              document.activeElement === document.body ||
              (null === (e = this._dialog) || void 0 === e
                ? void 0
                : e.contains(document.activeElement)))
          )
            try {
              this._prevActiveElement.focus({ preventScroll: !0 })
            } catch (e) {}
          for (const e of this._cleanUpFunctions) e()
          ;(this._isFullScreen() || this.props.fixedBody) &&
            (0, _.setFixedBodyState)(!1)
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
          null !== this.context && this.context.moveToTop()
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
              { x: o, y: r } = this._resize.getDialogsTopLeftCoordinates()
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
                `${r}px`,
              ),
              this._dialog.classList.add(C.dialogAnimatedAppearance)
          }
        }
        _handleTooltipFit() {
          0
        }
        _isFullScreen() {
          return Boolean(this.props.fullscreen)
        }
      }
      ;(y.contextType = v.PortalContext),
        (y.defaultProps = {
          boundByScreen: !0,
          draggable: !0,
          centeredOnMount: !0,
          shouldReturnFocus: !0,
        })
      const E = (0, a.makeOverlapable)(y)
    },
    444144: (e, t, n) => {
      n.d(t, { ControlDisclosureView: () => p })
      var o = n(50959),
        r = n(497754),
        s = n.n(r),
        i = n(525388),
        a = n(34735),
        l = n(102691),
        c = n(904925),
        u = n(364228),
        d = n(366986)
      const p = o.forwardRef((e, t) => {
        const {
            listboxId: n,
            className: r,
            listboxClassName: p,
            listboxTabIndex: h,
            hideArrowButton: m,
            matchButtonAndListboxWidths: f,
            popupPosition: g,
            disabled: v,
            isOpened: b,
            scrollWrapReference: _,
            repositionOnScroll: C,
            closeOnHeaderOverlap: y,
            listboxReference: E,
            size: x = 'small',
            onClose: w,
            onOpen: S,
            onListboxFocus: T,
            onListboxBlur: N,
            onListboxKeyDown: k,
            buttonChildren: M,
            children: D,
            caretClassName: I,
            listboxAria: P,
            ...B
          } = e,
          O = (0, o.useRef)(null),
          F =
            !m &&
            o.createElement(
              l.EndSlot,
              null,
              o.createElement(u.Caret, {
                isDropped: b,
                disabled: v,
                className: I,
              }),
            )
        return o.createElement(c.PopupMenuDisclosureView, {
          buttonRef: O,
          listboxId: n,
          listboxClassName: p,
          listboxTabIndex: h,
          isOpened: b,
          onClose: w,
          onOpen: S,
          listboxReference: E,
          scrollWrapReference: _,
          onListboxFocus: T,
          onListboxBlur: N,
          onListboxKeyDown: k,
          listboxAria: P,
          matchButtonAndListboxWidths: f,
          popupPosition: g,
          button: o.createElement(a.ControlSkeleton, {
            ...B,
            'data-role': 'listbox',
            disabled: v,
            className: s()(d.button, r),
            size: x,
            ref: (0, i.useMergedRefs)([O, t]),
            middleSlot: o.createElement(
              l.MiddleSlot,
              null,
              o.createElement(
                'span',
                { className: s()(d['button-children'], m && d.hiddenArrow) },
                M,
              ),
            ),
            endSlot: F,
          }),
          popupChildren: D,
          repositionOnScroll: C,
          closeOnHeaderOverlap: y,
        })
      })
      p.displayName = 'ControlDisclosureView'
    },
    522224: (e, t, n) => {
      n.d(t, {
        hoverMouseEventFilter: () => o.hoverMouseEventFilter,
        useAccurateHover: () => o.useAccurateHover,
        useHover: () => o.useHover,
      })
      var o = n(975228)
    },
    187962: (e, t, n) => {
      n.d(t, { IconQuestionInformation: () => w })
      var o = n(50959),
        r = n(497754),
        s = n(800417),
        i = n(72571),
        a = n(482353),
        l = n(527941),
        c = n(499084),
        u = n(530162),
        d = n(678370),
        p = n.n(d)
      const h = 'small',
        m = { info: l, question: a, check: c, exclamation: u }
      function f(e, t) {
        return t ? m[t] : 'success' === e ? m.check : m.exclamation
      }
      const g = o.forwardRef((e, t) =>
          o.createElement('span', {
            ...e,
            ref: t,
            className: r(e.className, p()['no-active-state']),
          }),
        ),
        v = o.forwardRef((e, t) => {
          const {
            icon: n,
            intent: a = 'default',
            ariaLabel: l,
            tooltip: c,
            className: u,
            renderComponent: d = g,
            tabIndex: m = 0,
            size: v = h,
            onFocus: b,
            onBlur: _,
            onClick: C,
            ...y
          } = e
          return o.createElement(
            d,
            {
              className: r(
                u,
                p()['icon-wrapper'],
                p()[`intent-${a}`],
                p()[`icon-wrapper-size-${v}`],
              ),
              title: c,
              'aria-label': l,
              ref: t,
              tabIndex: m,
              onFocus: b,
              onBlur: _,
              onClick: C,
              ...(0, s.filterDataProps)(y),
            },
            o.createElement(i.Icon, {
              'aria-hidden': !0,
              icon: f(a, n),
              className: p().icon,
            }),
          )
        })
      var b = n(804395)
      var _ = n(718736)
      function C(e, t = null) {
        const {
            showTooltip: n,
            hideTooltip: r,
            onClick: s,
            doNotShowTooltipOnTouch: i = !1,
          } = e,
          a = (0, _.useFunctionalRefObject)(t),
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
              r && r()
            },
            [r],
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
                s && s(e)
            },
            [s, a, l],
          ),
          tooltip: c,
          className: void 0 !== c ? 'apply-common-tooltip' : void 0,
          ref: a,
        }
      }
      var y = n(744471),
        E = n(342335),
        x = n.n(E)
      const w = (0, o.forwardRef)((e, t) => {
        const {
            className: n,
            onClick: s = y.tooltipClickHandler,
            doNotShowTooltipOnTouch: i,
            ...a
          } = e,
          {
            tooltip: l,
            className: c,
            ...u
          } = C(
            {
              tooltip: e.tooltip,
              doNotShowTooltipOnTouch: i,
              showTooltip: y.showOnElement,
              hideTooltip: y.hide,
              onClick: s,
            },
            t,
          )
        return o.createElement(v, {
          className: r(n, x()['icon-wrapper'], l && x()['with-tooltip'], c),
          tooltip: l,
          ...a,
          ...u,
        })
      })
      ;(0, o.forwardRef)((e, t) => {
        const { href: n, rel: r, target: s, ...i } = e,
          a = (0, o.useMemo)(
            () =>
              (0, o.forwardRef)((e, t) =>
                o.createElement('a', {
                  href: n,
                  rel: r,
                  target: s,
                  ref: t,
                  ...e,
                }),
              ),
            [n, r, s],
          )
        return o.createElement(w, {
          ...i,
          renderComponent: a,
          ref: t,
          doNotShowTooltipOnTouch: !0,
        })
      }),
        (0, o.forwardRef)((e, t) => {
          const { className: n, withActiveState: s, ...i } = e,
            a = (0, o.useMemo)(
              () =>
                (0, o.forwardRef)((e, t) =>
                  o.createElement('button', { ...e, ref: t, type: 'button' }),
                ),
              [],
            )
          return o.createElement(w, {
            ...i,
            className: r(n, !s && x()['no-active-state']),
            renderComponent: a,
            ref: t,
          })
        })
    },
    364228: (e, t, n) => {
      n.d(t, { Caret: () => u, CaretButton: () => d })
      var o = n(50959),
        r = n(497754),
        s = n.n(r),
        i = n(72571),
        a = n(602948),
        l = n(323428)
      function c(e) {
        const { isDropped: t } = e
        return o.createElement(i.Icon, {
          className: s()(l.icon, t && l.dropped),
          icon: a,
        })
      }
      function u(e) {
        const { className: t, disabled: n, isDropped: r } = e
        return o.createElement(
          'span',
          { className: s()(l.button, n && l.disabled, t) },
          o.createElement(c, { isDropped: r }),
        )
      }
      function d(e) {
        const {
          className: t,
          tabIndex: n = -1,
          disabled: r,
          isDropped: i,
          ...a
        } = e
        return o.createElement(
          'button',
          {
            ...a,
            type: 'button',
            tabIndex: n,
            disabled: r,
            className: s()(l.button, r && l.disabled, t),
          },
          o.createElement(c, { isDropped: i }),
        )
      }
    },
    529631: (e, t, n) => {
      n.d(t, { Select: () => C })
      var o = n(50959),
        r = n(855393),
        s = n(414823),
        i = n(525388),
        a = n(930617),
        l = n(192063),
        c = n(12481),
        u = n(343370)
      var d = n(648621),
        p = n(953517),
        h = n(444144),
        m = n(942544),
        f = n(710263),
        g = n(760673)
      function v(e) {
        return !e.readonly
      }
      function b(e, t) {
        var n
        return null !== (n = null == t ? void 0 : t.id) && void 0 !== n
          ? n
          : (0, s.createDomId)(e, 'item', null == t ? void 0 : t.value)
      }
      function _(e) {
        var t, n
        const { selectedItem: r, placeholder: s } = e
        if (!r) return o.createElement('span', { className: g.placeholder }, s)
        const i =
          null !==
            (n =
              null !== (t = r.selectedContent) && void 0 !== t
                ? t
                : r.content) && void 0 !== n
            ? n
            : r.value
        return o.createElement('span', null, i)
      }
      const C = o.forwardRef((e, t) => {
        const {
          id: n,
          menuClassName: g,
          menuItemClassName: C,
          tabIndex: y,
          disabled: E,
          highlight: x,
          intent: w,
          hideArrowButton: S,
          placeholder: T,
          addPlaceholderToItems: N = !1,
          value: k,
          'aria-labelledby': M,
          onFocus: D,
          onBlur: I,
          onClick: P,
          onChange: B,
          onKeyDown: O,
          repositionOnScroll: F = !0,
          openMenuOnEnter: R = !0,
          'aria-describedby': A,
          'aria-invalid': L,
          ...V
        } = e
        let { items: z } = e
        if (T && N) {
          z = [
            {
              value: void 0,
              content: T,
              id: (0, s.createDomId)(n, 'placeholder'),
            },
            ...z,
          ]
        }
        const {
            listboxId: W,
            isOpened: H,
            isFocused: q,
            buttonTabIndex: U,
            listboxTabIndex: K,
            highlight: Z,
            intent: $,
            open: G,
            onOpen: Y,
            close: j,
            toggle: Q,
            buttonFocusBindings: J,
            onButtonClick: X,
            buttonRef: ee,
            listboxRef: te,
            buttonAria: ne,
          } = (0, m.useControlDisclosure)({
            id: n,
            disabled: E,
            buttonTabIndex: y,
            intent: w,
            highlight: x,
            onFocus: D,
            onBlur: I,
            onClick: P,
          }),
          oe = z.filter(v),
          re = oe.find((e) => e.value === k),
          [se, ie] = o.useState(
            T && N ? oe[0].value : null == re ? void 0 : re.value,
          ),
          [ae, le, ce] = (0, a.useKeepActiveItemIntoView)({ activeItem: re })
        ;(0, r.useIsomorphicLayoutEffect)(
          () => ie(null == re ? void 0 : re.value),
          [k],
        )
        const ue = (0, s.joinDomIds)(M, n),
          de = ue.length > 0 ? ue : void 0,
          pe = (0, o.useMemo)(
            () => ({
              role: 'listbox',
              'aria-labelledby': M,
              'aria-activedescendant': b(n, re),
            }),
            [M, re],
          ),
          he = (0, o.useCallback)((e) => e.value === se, [se]),
          me = (0, o.useCallback)(() => (j(), B && B(se)), [j, B, se]),
          fe = (0, d.useItemsKeyboardNavigation)(
            'vertical',
            f.isRtl,
            oe,
            he,
            (e) => {
              ie(e.value)
            },
            !1,
            { next: [40], previous: [38] },
          ),
          ge = (0, p.useKeyboardToggle)(Q, H || R),
          ve = (0, p.useKeyboardToggle)(me),
          be = (0, p.useKeyboardClose)(H, we),
          _e = (0, p.useKeyboardOpen)(H, G),
          Ce = (0, p.useKeyboardEventHandler)([ge, be, _e]),
          ye = (0, p.useKeyboardEventHandler)([fe, ve, be]),
          Ee = ((e) => {
            const t = (0, o.useRef)(''),
              n = (0, o.useMemo)(
                () =>
                  (0, c.default)(() => {
                    t.current = ''
                  }, 500),
                [],
              ),
              r = (0, o.useMemo)(() => (0, u.default)(e, 200), [e])
            return (0, o.useCallback)(
              (e) => {
                e.key.length > 0 &&
                  e.key.length < 3 &&
                  ((t.current += e.key), r(t.current, e), n())
              },
              [n, r],
            )
          })((t, n) => {
            const o = ((e, t, n) =>
              e.find((e) => {
                var o
                const r = t.toLowerCase()
                return (
                  !e.readonly &&
                  (n
                    ? n(e).toLowerCase().startsWith(r)
                    : !e.readonly &&
                      (('string' == typeof e.content &&
                        e.content.toLowerCase().startsWith(r)) ||
                        ('string' == typeof e.textContent &&
                          e.textContent.toLowerCase().startsWith(r)) ||
                        String(null !== (o = e.value) && void 0 !== o ? o : '')
                          .toLowerCase()
                          .startsWith(r)))
                )
              }))(oe, t, e.getSearchKey)
            void 0 !== o && B && (n.stopPropagation(), H || G(), B(o.value))
          })
        return o.createElement(
          h.ControlDisclosureView,
          {
            ...V,
            ...ne,
            ...J,
            id: n,
            role: 'button',
            tabIndex: U,
            'aria-owns': ne['aria-controls'],
            'aria-haspopup': 'listbox',
            'aria-labelledby': de,
            disabled: E,
            hideArrowButton: S,
            isFocused: q,
            isOpened: H,
            highlight: Z,
            intent: $,
            ref: (0, i.useMergedRefs)([ee, t]),
            onClick: X,
            onOpen: () => {
              ce(re, { duration: 0 }), Y()
            },
            onClose: we,
            onKeyDown: (e) => {
              Ce(e), O && O(e)
              e.defaultPrevented || Ee(e)
            },
            listboxId: W,
            listboxTabIndex: K,
            listboxClassName: g,
            listboxAria: pe,
            'aria-describedby': A,
            'aria-invalid': L,
            listboxReference: te,
            scrollWrapReference: ae,
            onListboxKeyDown: (e) => {
              ye(e), e.defaultPrevented || Ee(e)
            },
            buttonChildren: o.createElement(_, {
              selectedItem: null != re ? re : null,
              placeholder: T,
            }),
            repositionOnScroll: F,
          },
          z.map((e, t) => {
            var r
            if (e.readonly)
              return o.createElement(
                o.Fragment,
                {
                  key: `readonly_item_${t}`,
                },
                e.content,
              )
            const s = b(n, e)
            return o.createElement(l.PopupMenuItem, {
              key: s,
              id: s,
              className: C,
              role: 'option',
              'aria-selected': k === e.value,
              isActive: se === e.value,
              label: null !== (r = e.content) && void 0 !== r ? r : e.value,
              onClick: xe,
              onClickArg: e.value,
              isDisabled: e.disabled,
              reference: (t) => le(e, t),
            })
          }),
        )
        function xe(e) {
          B && (B(e), ie(e))
        }
        function we() {
          ie(null == re ? void 0 : re.value), j()
        }
      })
      C.displayName = 'Select'
    },
    230553: (e, t, n) => {
      n.d(t, { MenuContext: () => o })
      const o = n(50959).createContext(null)
    },
    510618: (e, t, n) => {
      n.d(t, { DEFAULT_MENU_THEME: () => g, Menu: () => v })
      var o = n(50959),
        r = n(497754),
        s = n.n(r),
        i = n(650151),
        a = n(44681),
        l = n(199663),
        c = n(753327),
        u = n(370981),
        d = n(801808),
        p = n(376202),
        h = n(823030),
        m = n(230553),
        f = n(540191)
      const g = f
      class v extends o.PureComponent {
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
              var n, o, r, s, l, c, u, d, p, h, m, f
              if (this.state.isMeasureValid && !t) return
              const { position: g } = this.props,
                v = (0, i.ensureNotNull)(this._containerRef)
              let b = v.getBoundingClientRect()
              const _ = document.documentElement.clientHeight,
                C = document.documentElement.clientWidth,
                y =
                  null !== (n = this.props.closeOnScrollOutsideOffset) &&
                  void 0 !== n
                    ? n
                    : 0
              let E = _ - 0 - y
              const x = b.height > E
              if (x) {
                ;((0, i.ensureNotNull)(this._scrollWrapRef).style.overflowY =
                  'scroll'),
                  (b = v.getBoundingClientRect())
              }
              const { width: w, height: S } = b,
                T =
                  'function' == typeof g
                    ? g({
                        contentWidth: w,
                        contentHeight: S,
                        availableWidth: C,
                        availableHeight: _,
                      })
                    : g,
                N =
                  null !==
                    (r =
                      null === (o = null == T ? void 0 : T.indentFromWindow) ||
                      void 0 === o
                        ? void 0
                        : o.left) && void 0 !== r
                    ? r
                    : 0,
                k =
                  C -
                  (null !== (s = T.overrideWidth) && void 0 !== s ? s : w) -
                  (null !==
                    (c =
                      null === (l = null == T ? void 0 : T.indentFromWindow) ||
                      void 0 === l
                        ? void 0
                        : l.right) && void 0 !== c
                    ? c
                    : 0),
                M = (0, a.clamp)(T.x, N, Math.max(N, k)),
                D =
                  (null !==
                    (d =
                      null === (u = null == T ? void 0 : T.indentFromWindow) ||
                      void 0 === u
                        ? void 0
                        : u.top) && void 0 !== d
                    ? d
                    : 0) + y,
                I =
                  _ -
                  (null !== (p = T.overrideHeight) && void 0 !== p ? p : S) -
                  (null !==
                    (m =
                      null === (h = null == T ? void 0 : T.indentFromWindow) ||
                      void 0 === h
                        ? void 0
                        : h.bottom) && void 0 !== m
                    ? m
                    : 0)
              let P = (0, a.clamp)(T.y, D, Math.max(D, I))
              if (
                (T.forbidCorrectYCoord &&
                  P < T.y &&
                  ((E -= T.y - P), (P = T.y)),
                t &&
                  void 0 !== this.props.closeOnScrollOutsideOffset &&
                  T.y <= this.props.closeOnScrollOutsideOffset)
              )
                return void this._handleGlobalClose(!0)
              const B =
                null !== (f = T.overrideHeight) && void 0 !== f
                  ? f
                  : x
                    ? E
                    : void 0
              this.setState(
                {
                  appearingMenuHeight: t ? this.state.appearingMenuHeight : B,
                  appearingMenuWidth: t
                    ? this.state.appearingMenuWidth
                    : T.overrideWidth,
                  appearingPosition: { x: M, y: P },
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
              'aria-labelledby': r,
              'aria-activedescendant': i,
              'aria-hidden': a,
              'aria-describedby': u,
              'aria-invalid': d,
              children: p,
              minWidth: g,
              theme: v = f,
              className: _,
              maxHeight: C,
              onMouseOver: y,
              onMouseOut: E,
              onKeyDown: x,
              onFocus: w,
              onBlur: S,
            } = this.props,
            {
              appearingMenuHeight: T,
              appearingMenuWidth: N,
              appearingPosition: k,
              isMeasureValid: M,
            } = this.state,
            D = {
              '--ui-kit-menu-max-width': `${k && k.x}px`,
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
                    'aria-labelledby': r,
                    'aria-activedescendant': i,
                    'aria-hidden': a,
                    'aria-describedby': u,
                    'aria-invalid': d,
                    className: s()(_, v.menuWrap, !M && v.isMeasuring),
                    style: {
                      height: T,
                      left: k && k.x,
                      minWidth: g,
                      position: 'fixed',
                      top: k && k.y,
                      width: N,
                      ...(this.props.limitMaxWidth && D),
                    },
                    'data-name': this.props['data-name'],
                    ref: this._handleContainerRef,
                    onScrollCapture: this.props.onScroll,
                    onContextMenu: l.preventDefaultForContextMenu,
                    tabIndex: this.props.tabIndex,
                    onMouseOver: y,
                    onMouseOut: E,
                    onKeyDown: x,
                    onFocus: w,
                    onBlur: S,
                  },
                  o.createElement(
                    'div',
                    {
                      className: s()(
                        v.scrollWrap,
                        !this.props.noMomentumBasedScroll && v.momentumBased,
                      ),
                      style: {
                        overflowY: void 0 !== T ? 'scroll' : 'auto',
                        maxHeight: C,
                      },
                      onScrollCapture: this._handleScroll,
                      ref: this._handleScrollWrapRef,
                    },
                    o.createElement(b, { className: v.menuBox }, p),
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
                  null === (r = n.current) || void 0 === r
                    ? void 0
                    : r.contains(o))
                )
              )
                return
              var o, r
              t.isSubmenuNode(e.target) || t.setCurrent(null)
            },
            'data-name': 'menu-inner',
          },
          e.children,
        )
      }
      v.contextType = h.SubmenuContext
    },
    192063: (e, t, n) => {
      n.d(t, { DEFAULT_POPUP_MENU_ITEM_THEME: () => c, PopupMenuItem: () => d })
      var o = n(50959),
        r = n(497754),
        s = n(32133),
        i = n(370981),
        a = n(636080),
        l = n(671986)
      const c = l
      function u(e) {
        e.stopPropagation()
      }
      function d(e) {
        const {
            id: t,
            role: n,
            className: c,
            title: d,
            labelRowClassName: p,
            labelClassName: h,
            toolboxClassName: m,
            shortcut: f,
            forceShowShortcuts: g,
            icon: v,
            iconClassname: b,
            isActive: _,
            isDisabled: C,
            isHovered: y,
            appearAsDisabled: E,
            label: x,
            link: w,
            showToolboxOnHover: S,
            showToolboxOnFocus: T,
            target: N,
            rel: k,
            toolbox: M,
            reference: D,
            onMouseOut: I,
            onMouseOver: P,
            onKeyDown: B,
            suppressToolboxClick: O = !0,
            theme: F = l,
            tabIndex: R,
            tagName: A,
            renderComponent: L,
            roundedIcon: V,
            iconAriaProps: z,
            circleLogo: W,
            dontClosePopup: H,
            onClick: q,
            onClickArg: U,
            trackEventObject: K,
            trackMouseWheelClick: Z,
            trackRightClick: $,
            ...G
          } = e,
          Y = (0, o.useRef)(null),
          j = (0, o.useMemo)(
            () =>
              ((e) => {
                function t(t) {
                  const { reference: n, ...r } = t,
                    s = null != e ? e : r.href ? 'a' : 'div',
                    i =
                      'a' === s
                        ? r
                        : ((e) => {
                            const {
                              download: t,
                              href: n,
                              hrefLang: o,
                              media: r,
                              ping: s,
                              rel: i,
                              target: a,
                              type: l,
                              referrerPolicy: c,
                              ...u
                            } = e
                            return u
                          })(r)
                  return o.createElement(s, { ...i, ref: n })
                }
                return (t.displayName = `DefaultComponent(${e})`), t
              })(A),
            [A],
          ),
          Q = null != L ? L : j
        return o.createElement(
          Q,
          {
            ...G,
            id: t,
            role: n,
            className: r(c, F.item, v && F.withIcon, {
              [F.isActive]: _,
              [F.isDisabled]: C || E,
              [F.hovered]: y,
            }),
            title: d,
            href: w,
            target: N,
            rel: k,
            reference: (e) => {
              ;(Y.current = e), 'function' == typeof D && D(e)
              'object' == typeof D && (D.current = e)
            },
            onClick: (e) => {
              if (C) return
              K && (0, s.trackEvent)(K.category, K.event, K.label)
              q && q(U, e)
              H || (0, i.globalCloseMenu)()
            },
            onContextMenu: (e) => {
              K &&
                $ &&
                (0, s.trackEvent)(K.category, K.event, `${K.label}_rightClick`)
            },
            onMouseUp: (e) => {
              if (1 === e.button && w && K) {
                let e = K.label
                Z && (e += '_mouseWheelClick'),
                  (0, s.trackEvent)(K.category, K.event, e)
              }
            },
            onMouseOver: P,
            onMouseOut: I,
            onKeyDown: B,
            tabIndex: R,
          },
          W &&
            o.createElement(a.CircleLogo, {
              ...z,
              className: l['disclosure-item-circle-logo'],
              size: 'xxxsmall',
              logoUrl: W.logoUrl,
              placeholderLetter: W.placeholderLetter,
            }),
          v &&
            o.createElement('span', {
              'aria-label': z && z['aria-label'],
              'aria-hidden': z && Boolean(z['aria-hidden']),
              className: r(F.icon, V && l['round-icon'], b),
              dangerouslySetInnerHTML: { __html: v },
            }),
          o.createElement(
            'span',
            { className: r(F.labelRow, p) },
            o.createElement('span', { className: r(F.label, h) }, x),
          ),
          (void 0 !== f || g) &&
            o.createElement(
              'span',
              { className: F.shortcut },
              (J = f) && J.split('+').join(' + '),
            ),
          void 0 !== M &&
            o.createElement(
              'span',
              {
                onClick: O ? u : void 0,
                className: r(m, F.toolbox, {
                  [F.showOnHover]: S,
                  [F.showOnFocus]: T,
                }),
              },
              M,
            ),
        )
        var J
      }
    },
    28466: (e, t, n) => {
      n.d(t, { CloseDelegateContext: () => s })
      var o = n(50959),
        r = n(370981)
      const s = o.createContext(r.globalCloseDelegate)
    },
    624216: (e, t, n) => {
      n.d(t, { PopupMenu: () => p })
      var o = n(50959),
        r = n(500962),
        s = n(162942),
        i = n(813113),
        a = n(510618),
        l = n(28466)
      const c = o.createContext(void 0)
      var u = n(908783)
      const d = o.createContext({ setMenuMaxWidth: !1 })
      function p(e) {
        const {
            controller: t,
            children: n,
            isOpened: p,
            closeOnClickOutside: h = !0,
            doNotCloseOn: m,
            onClickOutside: f,
            onClose: g,
            onKeyboardClose: v,
            'data-name': b = 'popup-menu-container',
            ..._
          } = e,
          C = (0, o.useContext)(l.CloseDelegateContext),
          y = o.useContext(d),
          E = (0, o.useContext)(c),
          x = (0, u.useOutsideEvent)({
            handler: (e) => {
              f && f(e)
              if (!h) return
              const t = (0, s.default)(m) ? m() : null == m ? [] : [m]
              if (t.length > 0 && e.target instanceof Node)
                for (const n of t) {
                  const t = r.findDOMNode(n)
                  if (t instanceof Node && t.contains(e.target)) return
                }
              g()
            },
            mouseDown: !0,
            touchStart: !0,
          })
        return p
          ? o.createElement(
              i.Portal,
              {
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                pointerEvents: 'none',
              },
              o.createElement(
                'span',
                { ref: x, style: { pointerEvents: 'auto' } },
                o.createElement(
                  a.Menu,
                  {
                    ..._,
                    onClose: g,
                    onKeyboardClose: v,
                    onScroll: (t) => {
                      const { onScroll: n } = e
                      n && n(t)
                    },
                    customCloseDelegate: C,
                    customRemeasureDelegate: E,
                    ref: t,
                    'data-name': b,
                    limitMaxWidth: y.setMenuMaxWidth,
                  },
                  n,
                ),
              ),
            )
          : null
      }
    },
    753327: (e, t, n) => {
      n.d(t, { Slot: () => o.Slot, SlotContext: () => o.SlotContext })
      var o = n(682925)
    },
    742554: (e, t, n) => {
      n.d(t, { TouchScrollContainer: () => a })
      var o = n(50959),
        r = n(259142),
        s = n(650151),
        i = n(601227)
      const a = (0, o.forwardRef)((e, t) => {
        const { children: n, ...s } = e,
          a = (0, o.useRef)(null)
        return (
          (0, o.useImperativeHandle)(t, () => a.current),
          (0, o.useLayoutEffect)(() => {
            if (i.CheckMobile.iOS())
              return (
                null !== a.current &&
                  (0, r.disableBodyScroll)(a.current, { allowTouchMove: l(a) }),
                () => {
                  null !== a.current && (0, r.enableBodyScroll)(a.current)
                }
              )
          }, []),
          o.createElement('div', { ref: a, ...s }, n)
        )
      })
      function l(e) {
        return (t) => {
          const n = (0, s.ensureNotNull)(e.current),
            o = document.activeElement
          return (
            !n.contains(t) || (null !== o && n.contains(o) && o.contains(t))
          )
        }
      }
    },
    326278: (e) => {
      e.exports = {
        titleWrap: 'titleWrap-Izz3hpJc',
        groupFooter: 'groupFooter-Izz3hpJc',
      }
    },
    149934: (e) => {
      e.exports = { wrapper: 'wrapper-JXHzsa7P' }
    },
    717611: (e) => {
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
    727698: (e) => {
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
    924712: (e) => {
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
    280128: (e) => {
      e.exports = {
        wrap: 'wrap-QutFvTLS',
        labelWrap: 'labelWrap-QutFvTLS',
        label: 'label-QutFvTLS',
        hasTooltip: 'hasTooltip-QutFvTLS',
      }
    },
    793361: (e, t, n) => {
      n.d(t, { splitThousands: () => r })
      var o = n(150335)
      function r(e, t = '&nbsp;') {
        let n = e + ''
        ;-1 !== n.indexOf('e') &&
          (n = ((e) =>
            (0, o.fixComputationError)(e)
              .toFixed(10)
              .replace(/\.?0+$/, ''))(Number(e)))
        const r = n.split('.')
        return (
          r[0].replace(/\B(?=(\d{3})+(?!\d))/g, t) + (r[1] ? '.' + r[1] : '')
        )
      }
    },
    112557: (e, t, n) => {
      n.d(t, { bind: () => i, setter: () => a })
      var o = n(50959),
        r = n(549730),
        s = n(886176)
      function i(e) {
        var t
        return (
          (t = class extends o.PureComponent {
            constructor() {
              super(...arguments),
                (this._onChange = (e, t, n) => {
                  const { setValue: o } = this.context,
                    { onChange: r } = this.props
                  a(o, r)(e, t, n)
                })
            }
            render() {
              const { input: t } = this.props,
                { values: n, model: r } = this.context
              return o.createElement(e, {
                ...this.props,
                value: n[t.id],
                tzName: (0, s.getTimezoneName)(r),
                onChange: this._onChange,
              })
            }
          }),
          (t.contextType = r.PropertyContext),
          t
        )
      }
      function a(e, t) {
        return (n, o, r) => {
          e(o, n, r), t && t(n, o, r)
        }
      }
    },
    549730: (e, t, n) => {
      n.d(t, { PropertyContainer: () => u, PropertyContext: () => c })
      var o = n(50959),
        r = n(650151),
        s = n(609838),
        i = n(664902)
      const a = (0, n(6835).getLogger)(
          'Platform.GUI.StudyInputPropertyContainer',
        ),
        l = new i.TranslatedString(
          'change {propertyName} property',
          s.t(null, void 0, n(18567)),
        ),
        c = o.createContext(null)
      class u extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._setValue = (e, t, o) => {
              const { property: c, model: u } = this.props,
                d = (0, r.ensureDefined)(c.child(e))
              a.logNormal(
                `Changing property "${e}" value from "${c.value()}" to "${t}"`,
              )
              const p = new i.TranslatedString(
                o,
                ((e) => s.t(e, { context: 'input' }, n(788601)))(o),
              )
              u.setProperty(d, t, l.format({ propertyName: p }))
            })
          const { property: t } = e,
            o = {}
          t.childNames().forEach((e) => {
            const n = (0, r.ensureDefined)(t.child(e))
            Object.hasOwn(o, e) || (o[e] = n.value())
          }),
            (this.state = o)
        }
        componentDidMount() {
          const { property: e, onStudyInputChange: t } = this.props
          e.childNames().forEach((n) => {
            ;(0, r.ensureDefined)(e.child(n)).subscribe(this, (e) => {
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
            ;(0, r.ensureDefined)(e.child(t)).unsubscribeAll(this)
          })
        }
        render() {
          const { study: e, model: t, children: n } = this.props,
            r = {
              study: e,
              model: t,
              values: this.state,
              setValue: this._setValue,
            }
          return o.createElement(c.Provider, { value: r }, n)
        }
      }
    },
    947901: (e, t, n) => {
      n.d(t, { ModelContext: () => r, bindModel: () => s })
      var o = n(50959)
      const r = o.createContext(null)
      function s(e, t) {
        return o.createElement(r.Consumer, null, (n) =>
          n ? o.createElement(e, { ...Object.assign({ model: n }, t) }) : null,
        )
      }
    },
    82528: (e, t, n) => {
      n.d(t, {
        StylePropertyContainer: () => i,
        StylePropertyContext: () => s,
        bindPropertyContext: () => a,
      })
      var o = n(50959),
        r = n(947901)
      const s = o.createContext(null)
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
          return o.createElement(s.Provider, { value: e }, this.props.children)
        }
      }
      function a(e, t) {
        return (0, r.bindModel)(
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
    620707: (e, t, n) => {
      n.d(t, { IconGroupWrapper: () => s })
      var o = n(50959),
        r = n(149934)
      function s(e) {
        const { children: t } = e
        return o.createElement('div', { className: r.wrapper }, t)
      }
    },
    788887: (e, t, n) => {
      n.d(t, { InputTooltip: () => s })
      var o = n(50959),
        r = n(187962)
      function s(e) {
        const { className: t, title: n } = e
        return o.createElement(r.IconQuestionInformation, {
          icon: 'info',
          className: t,
          ariaLabel: n,
          tooltip: n,
          tabIndex: -1,
        })
      }
    },
    756254: (e, t, n) => {
      n.d(t, {
        getInputGroups: () => i,
        isGroup: () => r,
        isInputInlines: () => s,
      })
      var o = n(650151)
      function r(e) {
        return Object.hasOwn(e, 'groupType')
      }
      function s(e) {
        return r(e) && 'inline' === e.groupType
      }
      function i(e) {
        const t = [],
          n = new Map(),
          r = new Map()
        return (
          r.set(void 0, new Map()),
          e.forEach((e) => {
            const { group: s, inline: i } = e
            if (void 0 !== s || void 0 !== i)
              if (void 0 !== s)
                if (void 0 !== i)
                  if (n.has(s)) {
                    const t = (0, o.ensureDefined)(n.get(s))
                    let l
                    r.has(t)
                      ? (l = (0, o.ensureDefined)(r.get(t)))
                      : ((l = new Map()), r.set(t, l)),
                      a(e, 'inline', i, l, t.children)
                  } else {
                    const o = { id: i, groupType: 'inline', children: [e] },
                      a = { id: s, groupType: 'group', children: [o] },
                      l = new Map()
                    l.set(i, o), r.set(a, l), n.set(s, a), t.push(a)
                  }
                else a(e, 'group', s, n, t)
              else {
                const n = (0, o.ensureDefined)(r.get(void 0))
                a(e, 'inline', (0, o.ensureDefined)(i), n, t)
              }
            else t.push(e)
          }),
          t
        )
      }
      function a(e, t, n, r, s) {
        if (r.has(n)) (0, o.ensureDefined)(r.get(n)).children.push(e)
        else {
          const o = { id: n, groupType: t, children: [e] }
          r.set(n, o), s.push(o)
        }
      }
    },
    966507: (e, t, n) => {
      n.d(t, { InputRow: () => oe })
      var o = n(609838),
        r = n(50959),
        s = n(650151),
        i = n(782425),
        a = n(815300),
        l = n(600052),
        c = n(662949),
        u = n(497754),
        d = n.n(u),
        p = n(654936),
        h = n(112557),
        m = n(659641),
        f = n(727698)
      class g extends r.PureComponent {
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
            onKeyDown: s,
            hasTooltip: i,
          } = this.props
          return r.createElement(p.InputControl, {
            className: d()(f.input, i && f.hasTooltip),
            value: void 0 === t ? e : t,
            onChange: this._onChange,
            onBlur: o,
            onKeyDown: s,
            disabled: n,
            maxLength: 4096,
          })
        }
      }
      const v = (0, m.debounced)(g),
        b = (0, h.bind)(v)
      var _ = n(793702),
        C = n(459837)
      function y(e) {
        const { className: t } = e,
          n = (0, r.useContext)(C.PropertyTable.InlineRowContext)
        return r.createElement(
          'div',
          { className: u(f.inputGroup, n && f.inlineGroup, t) },
          e.children,
        )
      }
      var E = n(44807)
      function x(e = '') {
        const [, t = '', n = '', o = '', r = ''] = Array.from(
          e.match(/^(\d\d)(\d\d)-(\d\d)(\d\d)/) || [],
        )
        return [`${t}:${n}`, `${o}:${r}`]
      }
      class w extends r.PureComponent {
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
                { startTime: o, endTime: r } = this.state
              n(o.replace(':', '') + '-' + r.replace(':', ''), e, t)
            })
          const t = e.value || e.input.defval,
            [n, o] = x(t)
          this.state = { prevValue: t, startTime: n, endTime: o }
        }
        render() {
          const { startTime: e, endTime: t } = this.state,
            { hasTooltip: n, disabled: o } = this.props
          return r.createElement(
            y,
            { className: d()(n && f.hasTooltip) },
            r.createElement(
              'div',
              { className: f.sessionStart },
              r.createElement(E.TimeInput, {
                className: d()(f.input, f.sessionInputContainer),
                name: 'start',
                value: (0, s.ensureDefined)(e),
                onChange: this._onStartPick,
                disabled: o,
              }),
              r.createElement('span', { className: f.sessionDash }, ' — '),
            ),
            r.createElement(
              'div',
              { className: f.sessionEnd },
              r.createElement(E.TimeInput, {
                className: d()(f.input, f.sessionInputContainer),
                name: 'end',
                value: (0, s.ensureDefined)(t),
                onChange: this._onEndPick,
                disabled: o,
              }),
            ),
          )
        }
        static getDerivedStateFromProps(e, t) {
          if (e.value === t.prevValue) return t
          const [n, o] = x(e.value)
          return { prevValue: e.value, startTime: n, endTime: o }
        }
      }
      const S = (0, h.bind)(w)
      var T = n(156963),
        N = n(597399),
        k = n(562051),
        M = n(549730),
        D = n(529631)
      class I extends r.PureComponent {
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
              input: { id: e, defval: t, options: s, optionsTitles: i },
              value: a,
              disabled: l,
              hasTooltip: c,
            } = this.props,
            u = s.map((e) => {
              const t = i && i[e] ? i[e] : e
              return {
                value: e,
                content: o.t(t, { context: 'input' }, n(788601)),
              }
            }),
            p = void 0 !== a && s.includes(a) ? a : t
          return r.createElement(D.Select, {
            id: e,
            className: d()(f.input, c && f.hasTooltip),
            menuClassName: f.dropdownMenu,
            value: p,
            items: u,
            onChange: this._onChange,
            disabled: l,
          })
        }
      }
      const P = (0, h.bind)(I)
      var B = n(39290),
        O = n(593194)
      const F = {
        open: o.t(null, void 0, n(938466)),
        high: o.t(null, void 0, n(441615)),
        low: o.t(null, void 0, n(403919)),
        close: o.t(null, void 0, n(336962)),
        hl2: o.t(null, void 0, n(391815)),
        hlc3: o.t(null, void 0, n(640771)),
        ohlc4: o.t(null, void 0, n(212504)),
        hlcc4: o.t(null, void 0, n(209523)),
      }
      class R extends r.PureComponent {
        render() {
          const { input: e } = this.props,
            { study: t, model: n } = this.context
          let o = { ...F }
          delete o.hlcc4
          const a = (0, B.createAdapter)(t)
          if (t && this._isStudy(t) && t.isChildStudy()) {
            const t = (0, i.getInputValue)(a.inputs()[e.id]),
              n = a.parentSourceForInput(t)
            if ((0, O.isStudy)(n)) {
              const t = n.title(k.TitleDisplayTarget.StatusLine),
                r = N.StudyMetaInfo.getChildSourceInputTitles(
                  e,
                  n.metaInfo(),
                  t,
                )
              o = { ...o, ...r }
            }
          }
          if (
            T.enabled('study_on_study') &&
            t &&
            this._isStudy(t) &&
            (t.isChildStudy() || N.StudyMetaInfo.canBeChild(t.metaInfo()))
          ) {
            const e = [t, ...a.getAllChildren()]
            n.model()
              .allStudies()
              .filter((t) => t.canHaveChildren() && !e.includes(t))
              .forEach((e) => {
                const t = e.title(
                    k.TitleDisplayTarget.StatusLine,
                    !0,
                    void 0,
                    !0,
                  ),
                  n = e.id(),
                  r = e.metaInfo(),
                  i = r.styles,
                  a = r.plots || []
                if (1 === a.length) o[n + '$0'] = t
                else if (a.length > 1) {
                  const e = a.reduce((e, o, r) => {
                    if (!N.StudyMetaInfo.canPlotBeSourceOfChildStudy(o.type))
                      return e
                    let a
                    try {
                      a = (0, s.ensureDefined)(
                        (0, s.ensureDefined)(i)[o.id],
                      ).title
                    } catch (e) {
                      a = o.id
                    }
                    return { ...e, [`${n}$${r}`]: `${t}: ${a}` }
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
          return r.createElement(P, { ...this.props, input: l })
        }
        _isStudy(e) {
          return !Object.hasOwn(e, 'isInputsStudy')
        }
      }
      R.contextType = M.PropertyContext
      var A = n(628589),
        L = n(739343)
      const V = void 0,
        z = [
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
        W = ['1S', '5S', '10S', '15S', '30S'],
        H = ['1T', '10T', '100T', '1000T']
      class q extends r.PureComponent {
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
          const { input: e, value: t, disabled: s, hasTooltip: i } = this.props,
            a = A.Interval.parse(void 0 === t ? e.defval : t),
            l = a.isValid() ? a.value() : t,
            c = V ? V.get().filter((e) => !A.Interval.parse(e).isRange()) : [],
            u = (0, L.mergeResolutions)(
              z,
              (0, L.isSecondsEnabled)() ? W : [],
              (0, L.isTicksEnabled)() ? H : [],
              c,
            )
          return (
            u.unshift(''),
            r.createElement(D.Select, {
              id: e.id,
              className: d()(f.input, f.resolution, i && f.hasTooltip),
              menuClassName: d()(f.dropdownMenu, f.resolution),
              items:
                ((p = u),
                p.map((e) => ({
                  value: e,
                  content:
                    '' === e
                      ? o.t(null, void 0, n(394551))
                      : (0, L.getTranslatedResolutionModel)(e).hint,
                }))),
              value: l,
              onChange: this._onChange,
              disabled: s,
            })
          )
          var p
        }
      }
      const U = (0, h.bind)(q)
      var K = n(14385),
        Z = n(82528)
      class $ extends r.PureComponent {
        render() {
          return r.createElement(M.PropertyContext.Consumer, null, (e) =>
            e ? this._getColorInputWithContext(e) : null,
          )
        }
        _getColorInputWithContext(e) {
          var t
          const {
              input: { id: n },
              disabled: o,
              hasTooltip: s,
            } = this.props,
            { model: i, study: a } = e
          if ('properties' in a || 'tempProperties' in a) {
            const e =
              'properties' in a
                ? a.properties().inputs[n]
                : null === (t = a.tempProperties) || void 0 === t
                  ? void 0
                  : t.inputs.child(n)
            return r.createElement(
              Z.StylePropertyContainer,
              { model: i, property: e },
              r.createElement(K.ColorWithThicknessSelect, {
                className: d()(s && f.hasTooltip),
                color: e,
                disabled: o,
              }),
            )
          }
          return null
        }
      }
      var G = n(614793),
        Y = n(350324),
        j = n(508550),
        Q = n(886176),
        J = n(93071)
      const X = (0, h.bind)((e) => {
        const { value: t, onChange: n, input: o, tzName: s, hasTooltip: i } = e,
          { id: a, name: l, defval: c } = o,
          u = (0, r.useMemo)(() => Number(null != t ? t : c), [t, c]),
          p = (0, r.useMemo)(
            () => (0, Q.getChartTimezoneOffsetMs)(u, s),
            [u, s],
          ),
          h = (0, r.useMemo)(() => {
            const e = new Date(u + p + f(u))
            return e.setSeconds(0), e
          }, [u, p]),
          m = (0, r.useMemo)(
            () =>
              (0, j.twoDigitsFormat)(h.getHours()) +
              ':' +
              (0, j.twoDigitsFormat)(h.getMinutes()),
            [h],
          )
        return r.createElement(
          'div',
          { className: d()(J.container, i && J.hasTooltip) },
          r.createElement(
            'div',
            { className: J.datePickerWrapper },
            r.createElement(G.DatePicker, {
              InputComponent: Y.DateInput,
              initial: h,
              onPick: (e) => {
                if (null === e) return
                const t = new Date(h)
                t.setFullYear(e.getFullYear()),
                  t.setMonth(e.getMonth()),
                  t.setDate(e.getDate()),
                  n(g(t), a, l)
              },
              revertInvalidData: !0,
            }),
          ),
          r.createElement(
            'div',
            { className: J.timePickerWrapper },
            r.createElement(E.TimeInput, {
              value: m,
              onChange: (e) => {
                const [t, o] = e.split(':'),
                  r = new Date(h)
                r.setHours(Number(t)), r.setMinutes(Number(o)), n(g(r), a, l)
              },
            }),
          ),
        )
        function f(e) {
          return 60 * new Date(e).getTimezoneOffset() * 1e3
        }
        function g(e) {
          return e.valueOf() - p - f(u)
        }
      })
      class ee extends r.PureComponent {
        render() {
          const {
            input: e,
            disabled: t,
            onChange: n,
            tzName: o,
            hasTooltip: s,
          } = this.props
          if ((0, i.isStudyInputOptionsInfo)(e))
            return r.createElement(P, {
              input: e,
              disabled: t,
              onChange: n,
              hasTooltip: s,
            })
          switch (e.type) {
            case 'integer':
              return r.createElement(a.IntegerInput, {
                input: e,
                disabled: t,
                onChange: n,
                hasTooltip: s,
              })
            case 'float':
            case 'price':
              return r.createElement(l.FloatInput, {
                input: e,
                disabled: t,
                onChange: n,
                hasTooltip: s,
              })
            case 'bool':
              return r.createElement(c.BoolInput, {
                input: e,
                disabled: t,
                onChange: n,
                hasTooltip: s,
              })
            case 'text':
              return r.createElement(b, {
                input: e,
                disabled: t,
                onChange: n,
                hasTooltip: s,
              })
            case 'symbol':
              return r.createElement(_.SymbolInput, {
                input: e,
                disabled: t,
                onChange: n,
                hasTooltip: s,
              })
            case 'session':
              return r.createElement(S, {
                input: e,
                disabled: t,
                onChange: n,
                hasTooltip: s,
              })
            case 'source':
              return r.createElement(R, {
                input: e,
                disabled: t,
                onChange: n,
                hasTooltip: s,
              })
            case 'resolution':
              return r.createElement(U, {
                input: e,
                disabled: t,
                onChange: n,
                hasTooltip: s,
              })
            case 'time':
              return r.createElement(X, {
                input: e,
                tzName: o,
                onChange: n,
                hasTooltip: s,
              })
            case 'color':
              return r.createElement($, {
                input: e,
                disabled: t,
                onChange: n,
                hasTooltip: s,
              })
            default:
              return null
          }
        }
      }
      var te = n(788887),
        ne = n(620707)
      class oe extends r.PureComponent {
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
          return r.createElement(
            C.PropertyTable.Row,
            null,
            r.createElement(
              C.PropertyTable.Cell,
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
                    (0, s.ensureDefined)(i).name,
                    { context: 'input' },
                    n(788601),
                  ),
            ),
            r.createElement(
              C.PropertyTable.Cell,
              {
                'data-study-input-name':
                  (null == i ? void 0 : i.id) && `${i.id}-input`,
                placement: 'last',
                grouped: u,
              },
              t ||
                r.createElement(ee, {
                  input: (0, s.ensureDefined)(i),
                  onChange: l,
                  disabled: a,
                  hasTooltip: m,
                }),
              m &&
                r.createElement(
                  ne.IconGroupWrapper,
                  null,
                  d && r.createElement(te.InputTooltip, { title: d }),
                  !1,
                ),
            ),
          )
        }
      }
    },
    355217: (e, t, n) => {
      n.d(t, { InputsTabContent: () => z })
      var o,
        r = n(50959),
        s = n(650151),
        i = n(609838),
        a = n(549730),
        l = n(459837),
        c = n(230789),
        u = n(497754),
        d = n.n(u),
        p = n(888400),
        h = n.n(p)
      const m = (0, c.makeSwitchGroupItem)(
        (((o = class extends r.PureComponent {
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
                (o = r.createElement(
                  'span',
                  { className: t },
                  this.props.label,
                )),
              r.createElement(
                'label',
                { className: e },
                r.createElement(
                  'span',
                  { className: h().wrapper, title: this.props.title },
                  r.createElement('input', {
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
                  r.createElement('span', { className: n }),
                ),
                o,
              )
            )
          }
        }).defaultProps = { value: 'on' }),
        o),
      )
      var f = n(793702),
        g = n(112557),
        v = n(788887),
        b = n(620707),
        _ = n(727698)
      function C(e) {
        const {
            children: t,
            input: o,
            disabled: u,
            onChange: d,
            grouped: p,
            tooltip: h,
            solutionId: C,
          } = e,
          y = (0, r.useContext)(a.PropertyContext),
          { values: E, setValue: x } = (0, s.ensureNotNull)(y),
          w = E[o.id],
          [S, T] = (0, r.useState)(w ? 'another-symbol' : 'main-symbol'),
          [N, k] = (0, r.useState)(w),
          M = Boolean(h)
        return (
          (0, r.useEffect)(() => {
            w && k(w)
          }, [w]),
          r.createElement(
            c.SwitchGroup,
            {
              name: `symbol-source-${o.id}`,
              values: [S],
              onChange: (e) => {
                T(e),
                  'main-symbol' === e
                    ? (0, g.setter)(x)('', o.id, o.name)
                    : 'another-symbol' === e &&
                      N &&
                      (0, g.setter)(x, d)(N, o.id, o.name)
              },
            },
            r.createElement(
              l.PropertyTable.Row,
              null,
              r.createElement(
                l.PropertyTable.Cell,
                {
                  colSpan: 2,
                  placement: 'first',
                  grouped: p,
                  'data-study-input-name':
                    (null == o ? void 0 : o.id) && `${o.id}-main-symbol`,
                },
                r.createElement(m, {
                  value: 'main-symbol',
                  className: _.checkbox,
                  disabled: u,
                  label: r.createElement(
                    'span',
                    { className: _.label },
                    i.t(null, { context: 'input' }, n(288046)),
                  ),
                }),
              ),
            ),
            r.createElement(
              l.PropertyTable.Row,
              null,
              r.createElement(
                l.PropertyTable.Cell,
                {
                  placement: 'first',
                  grouped: p,
                  'data-study-input-name':
                    (null == o ? void 0 : o.id) &&
                    `${o.id}-another-symbol-label`,
                },
                r.createElement(m, {
                  value: 'another-symbol',
                  className: _.checkbox,
                  disabled: u,
                  label: r.createElement(
                    'span',
                    { className: _.label },
                    i.t(null, { context: 'input' }, n(373755)),
                  ),
                }),
              ),
              r.createElement(
                l.PropertyTable.Cell,
                {
                  placement: 'last',
                  grouped: p,
                  'data-study-input-name':
                    (null == o ? void 0 : o.id) &&
                    `${o.id}-another-symbol-input`,
                },
                t ||
                  r.createElement(f.SymbolInput, {
                    input: (0, s.ensureDefined)(o),
                    onChange: d,
                    disabled: u || 'main-symbol' === S,
                    hasTooltip: M,
                  }),
                M &&
                  r.createElement(
                    b.IconGroupWrapper,
                    null,
                    h && r.createElement(v.InputTooltip, { title: h }),
                    !1,
                  ),
              ),
            ),
          )
        )
      }
      var y = n(662949)
      class E extends r.PureComponent {
        render() {
          const { label: e, input: t, tooltip: n, solutionId: o } = this.props,
            s = Boolean(n)
          return r.createElement(
            l.PropertyTable.Row,
            null,
            r.createElement(
              l.PropertyTable.Cell,
              {
                placement: 'first',
                colSpan: 2,
                'data-study-input-name':
                  (null == t ? void 0 : t.id) && `${t.id}-checkbox`,
              },
              r.createElement(y.BoolInput, {
                label: e,
                input: t,
                hasTooltip: s,
              }),
              s &&
                r.createElement(
                  b.IconGroupWrapper,
                  null,
                  n && r.createElement(v.InputTooltip, { title: n }),
                  !1,
                ),
            ),
          )
        }
      }
      var x = n(966507),
        w = n(558213),
        S = n(34735),
        T = n(659641)
      class N extends r.PureComponent {
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
            onKeyDown: s,
          } = this.props
          return r.createElement(w.Textarea, {
            className: d()(_.input, _.textarea, S.InputClasses.FontSizeMedium),
            value: void 0 === t ? e : t,
            onChange: this._onChange,
            onBlur: o,
            onKeyDown: s,
            disabled: n,
            maxLength: 4096,
          })
        }
      }
      const k = (0, T.debounced)(N),
        M = (0, g.bind)(k)
      var D = n(280128)
      function I(e) {
        const { input: t, label: n, tooltip: o, solutionId: s } = e,
          i = Boolean(o)
        return r.createElement(
          l.PropertyTable.Row,
          null,
          r.createElement(
            l.PropertyTable.Cell,
            {
              placement: 'first',
              colSpan: 2,
              className: D.wrap,
              'data-study-input-name':
                (null == t ? void 0 : t.id) && `${t.id}-textarea`,
            },
            r.createElement(
              'div',
              { className: D.labelWrap },
              r.createElement(
                'span',
                { className: d()(D.label, i && D.hasTooltip) },
                n,
              ),
              i &&
                r.createElement(
                  b.IconGroupWrapper,
                  null,
                  o && r.createElement(v.InputTooltip, { title: o }),
                  !1,
                ),
            ),
            r.createElement(M, { input: t }),
          ),
        )
      }
      function P(e) {
        const { input: t, tooltip: o, solutionId: s } = e
        return 'symbol' === t.type && t.optional
          ? r.createElement(C, { input: t, tooltip: o, solutionId: s })
          : 'bool' === t.type
            ? r.createElement(E, {
                label: i.t(t.name, { context: 'input' }, n(788601)),
                input: t,
                tooltip: o,
                solutionId: s,
              })
            : 'text_area' === t.type
              ? r.createElement(I, {
                  label: i.t(t.name, { context: 'input' }, n(788601)),
                  input: t,
                  tooltip: o,
                  solutionId: s,
                })
              : r.createElement(x.InputRow, {
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
                  solutionId: s,
                })
      }
      var B = n(852830),
        O = n(717611)
      function F(e) {
        const { content: t } = e
        let n
        return r.createElement(
          l.PropertyTable.InlineRowContext.Provider,
          { value: !0 },
          r.createElement(
            'div',
            { className: O.inlineRow },
            t.children.map(
              (e, o) => (
                void 0 !== e.tooltip && (n = e.tooltip),
                r.createElement(P, {
                  key: e.id,
                  input: e,
                  tooltip: o === t.children.length - 1 ? n : void 0,
                })
              ),
            ),
          ),
        )
      }
      var R = n(756254),
        A = n(326278)
      function L(e) {
        const { content: t } = e
        return (0, R.isGroup)(t)
          ? (0, R.isInputInlines)(t)
            ? r.createElement(F, { content: t })
            : r.createElement(
                r.Fragment,
                null,
                r.createElement(
                  'div',
                  { className: A.titleWrap },
                  r.createElement(B.GroupTitleSection, {
                    title: i.t(t.id, { context: 'input' }, n(788601)),
                    name: t.id,
                  }),
                ),
                t.children.map((e) =>
                  (0, R.isGroup)(e)
                    ? r.createElement(F, { key: e.id, content: e })
                    : r.createElement(P, {
                        key: e.id,
                        input: e,
                        tooltip: e.tooltip,
                        solutionId: e.solutionId,
                      }),
                ),
                r.createElement('div', { className: A.groupFooter }),
              )
          : r.createElement(P, {
              input: t,
              tooltip: t.tooltip,
              solutionId: t.solutionId,
            })
      }
      const V = { offset: i.t(null, void 0, n(889298)) }
      class z extends r.PureComponent {
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
          return r.createElement(
            l.PropertyTable,
            { reference: e, className: u },
            r.createElement(W, {
              study: o,
              model: a,
              property: n.inputs,
              inputs: t,
              onStudyInputChange: c,
            }),
            d && this._createOffsetSection(d, (0, s.ensureDefined)(i.offset)),
            p &&
              p.childNames().map((e) => {
                var t
                const n = p.childs()[e]
                return this._createOffsetSection(
                  n,
                  (0, s.ensureDefined)(
                    null === (t = i.offsets) || void 0 === t ? void 0 : t[e],
                  ),
                )
              }),
          )
        }
        _createOffsetSection(e, t) {
          const n = e.childs()
          return r.createElement(W, {
            key: `offset_${t.title}`,
            study: this.props.study,
            model: this.props.model,
            inputs: [H(n, t)],
            property: e,
          })
        }
      }
      function W(e) {
        const {
            study: t,
            model: n,
            inputs: o,
            property: s,
            onStudyInputChange: i,
          } = e,
          l = o,
          c = (0, r.useMemo)(() => (0, R.getInputGroups)(l), [l])
        return r.createElement(
          a.PropertyContainer,
          { property: s, study: t, model: n, onStudyInputChange: i },
          !1,
          !1,
          c.map((e) =>
            r.createElement(
              r.Fragment,
              { key: e.id },
              r.createElement(L, { content: e }),
              !1,
            ),
          ),
        )
      }
      function H(e, t) {
        return {
          id: 'val',
          name: t.title || V.offset,
          defval: e.val.value(),
          type: 'integer',
          min: t.min,
          max: t.max,
        }
      }
    },
    662949: (e, t, n) => {
      n.d(t, { BoolInput: () => u, BoolInputComponent: () => c })
      var o = n(50959),
        r = n(302946),
        s = n(497754),
        i = n.n(s),
        a = n(112557),
        l = n(727698)
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
              label: s,
              hasTooltip: a,
            } = this.props,
            c = void 0 === t ? e : t
          return o.createElement(r.Checkbox, {
            className: i()(l.checkbox, a && l.hasTooltip),
            disabled: n,
            checked: c,
            onChange: this._onChange,
            label: o.createElement('span', { className: l.label }, s),
            labelAlignBaseline: !0,
          })
        }
      }
      const u = (0, a.bind)(c)
    },
    659641: (e, t, n) => {
      n.d(t, { debounced: () => s })
      var o = n(50959)
      const r = { blur: 0, commit: 0, change: 1 / 0 }
      function s(e, t = r) {
        return class extends o.PureComponent {
          constructor(e) {
            super(e),
              (this._onChange = (e, n, o) => {
                const r = t.change
                r
                  ? (clearTimeout(this._timeout),
                    this.setState({ value: e }, () => {
                      r !== 1 / 0 &&
                        (this._timeout = setTimeout(() => this._flush(), r))
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
              { prevValue: r, value: s } = this.state
            clearTimeout(this._timeout)
            const i = void 0 !== e ? e : s
            void 0 !== i && i !== r && o(i, t, n)
          }
        }
      }
    },
    600052: (e, t, n) => {
      n.d(t, { FloatInput: () => p, FloatInputComponent: () => d })
      var o = n(50959),
        r = n(497754),
        s = n.n(r),
        i = n(134814),
        a = n(112557),
        l = n(659641),
        c = n(727698)
      class u extends o.PureComponent {
        render() {
          const { hasTooltip: e } = this.props
          return o.createElement(i.NumericInput, {
            ...this.props,
            className: s()(c.input, e && c.hasTooltip),
            stretch: !1,
          })
        }
      }
      const d = (0, l.debounced)(u, { change: 1 / 0, commit: 0, blur: 0 }),
        p = (0, a.bind)(d)
    },
    815300: (e, t, n) => {
      n.d(t, { IntegerInput: () => p, IntegerInputComponent: () => d })
      var o = n(50959),
        r = n(497754),
        s = n.n(r),
        i = n(112557),
        a = n(659641),
        l = n(134814),
        c = n(727698)
      class u extends o.PureComponent {
        render() {
          const { hasTooltip: e } = this.props
          return o.createElement(l.NumericInput, {
            ...this.props,
            mode: 'integer',
            className: s()(c.input, e && c.hasTooltip),
            stretch: !1,
          })
        }
      }
      const d = (0, a.debounced)(u, { change: 1 / 0, commit: 0, blur: 0 }),
        p = (0, i.bind)(d)
    },
    134814: (e, t, n) => {
      n.d(t, { NumericInput: () => i })
      var o = n(50959),
        r = n(650151),
        s = n(587125)
      class i extends o.PureComponent {
        constructor() {
          super(...arguments),
            (this._container = null),
            (this._handleContainerRef = (e) => (this._container = e)),
            (this._onChange = (e, t) => {
              const {
                input: { id: n, name: o },
                onChange: r,
                onBlur: s,
              } = this.props
              r(e, n, o), 'step' === t && s && s()
            }),
            (this._onBlur = (e) => {
              const { onBlur: t } = this.props
              if (t) {
                const n = (0, r.ensureNotNull)(this._container)
                n.contains(document.activeElement) ||
                  n.contains(e.relatedTarget) ||
                  t()
              }
            })
        }
        render() {
          const {
            input: { defval: e, min: t, max: n, step: r },
            value: i,
            disabled: a,
            onKeyDown: l,
            className: c,
            mode: u,
            stretch: d,
          } = this.props
          return o.createElement(s.NumberInput, {
            className: c,
            value: Number(void 0 === i ? e : i),
            min: t,
            max: n,
            step: r,
            mode: u,
            onBlur: this._onBlur,
            onValueChange: this._onChange,
            onKeyDown: l,
            disabled: a,
            containerReference: this._handleContainerRef,
            fontSizeStyle: 'medium',
            roundByStep: !1,
            stretch: d,
          })
        }
      }
    },
    793702: (e, t, n) => {
      n.d(t, { SymbolInput: () => d, getInternalSymbolName: () => c })
      var o = n(50959),
        r = n(650151),
        s = n(549730),
        i = n(112557),
        a = n(39290),
        l = n(193315)
      function c(e, t) {
        const n = (0, a.createAdapter)(t).resolvedSymbolInfoBySymbol(e)
        return n && (n.ticker || n.full_name) ? n.ticker || n.full_name : e
      }
      function u(e, t) {
        const n = (0, a.createAdapter)(t).resolvedSymbolInfoBySymbol(e)
        return null === n ? e : n.name
      }
      const d = (0, i.bind)((e) => {
        const t = (0, o.useContext)(s.PropertyContext),
          { study: n } = (0, r.ensureNotNull)(t),
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
    14385: (e, t, n) => {
      n.d(t, { ColorWithThicknessSelect: () => g })
      var o = n(50959),
        r = n(724377),
        s = n(609838),
        i = n(664902),
        a = n(32240),
        l = n(82528),
        c = n(552315),
        u = n(252138),
        d = n(32133)
      const p = new i.TranslatedString(
          'change thickness',
          s.t(null, void 0, n(195657)),
        ),
        h = new i.TranslatedString(
          'change color',
          s.t(null, void 0, n(313066)),
        ),
        m = new i.TranslatedString(
          'change opacity',
          s.t(null, void 0, n(717023)),
        ),
        f = [1, 2, 3, 4]
      class g extends o.PureComponent {
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
                  : (0, r.parseRgba)(t)[3]
            }),
            (this._getColorValueInHex = () => {
              const { color: e } = this.props,
                t = (0, u.getPropertyValue)(e)
              return t
                ? (0, a.isHexColor)(t)
                  ? t
                  : (0, r.rgbToHexString)((0, r.parseRgb)(t))
                : null
            }),
            (this._onThicknessChange = (e) => {
              const { thickness: t } = this.props
              void 0 !== t && this._setProperty(t, e, p)
            }),
            (this._onColorChange = (e) => {
              const { color: t, isPaletteColor: n } = this.props,
                o = (0, u.getPropertyValue)(t)
              let s = 0
              o &&
                (s = (0, a.isHexColor)(o)
                  ? this._getTransparencyValue()
                  : (0, a.alphaToTransparency)((0, r.parseRgba)(o)[3])),
                this._setProperty(t, (0, a.generateColor)(String(e), s, !0), h),
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
            thicknessItems: f,
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
      g.contextType = l.StylePropertyContext
    },
    459837: (e, t, n) => {
      n.d(t, { PropertyTable: () => l })
      var o = n(50959),
        r = n(497754),
        s = n(800417),
        i = n(924712)
      const a = o.createContext(!1)
      class l extends o.PureComponent {
        render() {
          return o.createElement(
            'div',
            {
              ref: this.props.reference,
              className: r(i.content, this.props.className),
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
            n = r(
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
            l = (0, s.filterDataProps)(e)
          return o.createElement(
            'div',
            { ...l, className: n },
            o.createElement(
              'div',
              { className: r(i.inner, e.className) },
              e.children,
            ),
          )
        }),
        (l.Separator = (e) =>
          o.createElement(
            l.Row,
            null,
            o.createElement('div', {
              className: r(i.cell, i.separator, i.fill),
            }),
          )),
        (l.GroupSeparator = (e) => {
          const t = e.size || 0
          return o.createElement(
            l.Row,
            null,
            o.createElement('div', {
              className: r(i.cell, i.groupSeparator, i.fill, 1 === t && i.big),
            }),
          )
        })
    },
    252138: (e, t, n) => {
      function o(e) {
        return Array.isArray(e) ? e[0].value() : e.value()
      }
      n.d(t, { getPropertyValue: () => o })
    },
    476007: (e, t, n) => {
      n.d(t, { SplitThousandsFormatter: () => s })
      var o = n(793361),
        r = n(710263)
      class s {
        constructor(e = ' ') {
          this._divider = e
        }
        format(e) {
          const t = (0, o.splitThousands)(e, this._divider)
          return (0, r.isRtl)() ? (0, r.startWithLTR)(t) : t
        }
        parse(e) {
          const t = (0, r.stripLTRMarks)(e).split(this._divider).join(''),
            n = Number(t)
          return isNaN(n) || /e/i.test(t)
            ? { res: !1 }
            : { res: !0, value: n, suggest: this.format(n) }
        }
      }
    },
    610600: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M13.5 7l1.65-1.65a.5.5 0 0 0 0-.7l-1.8-1.8a.5.5 0 0 0-.7 0L11 4.5M13.5 7L11 4.5M13.5 7l-8.35 8.35a.5.5 0 0 1-.36.15H2.5v-2.3a.5.5 0 0 1 .15-.35L11 4.5"/></svg>'
    },
    499084: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16Zm3.87-12.15c.36.2.49.66.28 1.02l-4 7a.75.75 0 0 1-1.18.16l-3-3a.75.75 0 1 1 1.06-1.06l2.3 2.3 3.52-6.14a.75.75 0 0 1 1.02-.28Z"/></svg>'
    },
    530162: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" fill-rule="evenodd" d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16ZM9 4c-.79 0-1.38.7-1.25 1.48l.67 4.03a.59.59 0 0 0 1.16 0l.67-4.03A1.27 1.27 0 0 0 9 4Zm0 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></svg>'
    },
    527941: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16ZM8 6a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm1 2c.49 0 1 .59 1 1v3.01c0 .42-.51.99-1 .99s-1-.57-1-.99V9c0-.41.51-1 1-1Z"/></svg>'
    },
    482353: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16Zm0-3a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM6 7.5a3 3 0 1 1 6 0c0 .96-.6 1.48-1.17 1.98-.55.48-1.08.95-1.08 1.77h-1.5c0-1.37.7-1.9 1.33-2.38.49-.38.92-.71.92-1.37C10.5 6.67 9.82 6 9 6s-1.5.67-1.5 1.5H6Z"/></svg>'
    },
  },
])
