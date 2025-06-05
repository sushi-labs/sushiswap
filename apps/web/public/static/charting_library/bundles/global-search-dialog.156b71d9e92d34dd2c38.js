;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9754, 9685, 9255, 766],
  {
    159255: (e, t, n) => {
      n.r(t), n.d(t, { default: () => E })
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
                  var i = o[n]
                  e.call(t, i[1], i[0])
                }
              }),
              t
            )
          })()
        })(),
        i =
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
        a =
          'function' == typeof requestAnimationFrame
            ? requestAnimationFrame.bind(s)
            : (e) => setTimeout(() => e(Date.now()), 1e3 / 60)
      var l = [
          'top',
          'right',
          'bottom',
          'left',
          'width',
          'height',
          'size',
          'weight',
        ],
        r = 'undefined' != typeof MutationObserver,
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
                  i = 0
                function s() {
                  n && ((n = !1), e()), o && r()
                }
                function l() {
                  a(s)
                }
                function r() {
                  var e = Date.now()
                  if (n) {
                    if (e - i < 2) return
                    o = !0
                  } else (n = !0), (o = !1), setTimeout(l, t)
                  i = e
                }
                return r
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
              i &&
                !this.connected_ &&
                (document.addEventListener(
                  'transitionend',
                  this.onTransitionEnd_,
                ),
                window.addEventListener('resize', this.refresh),
                r
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
              i &&
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
              l.some((e) => !!~n.indexOf(e)) && this.refresh()
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
        h = (e, t) => {
          for (var n = 0, o = Object.keys(t); n < o.length; n++) {
            var i = o[n]
            Object.defineProperty(e, i, {
              value: t[i],
              enumerable: !1,
              writable: !1,
              configurable: !0,
            })
          }
          return e
        },
        d = (e) => (e && e.ownerDocument && e.ownerDocument.defaultView) || s,
        u = f(0, 0, 0, 0)
      function v(e) {
        return Number.parseFloat(e) || 0
      }
      function p(e) {
        for (var t = [], n = 1; n < arguments.length; n++)
          t[n - 1] = arguments[n]
        return t.reduce((t, n) => t + v(e['border-' + n + '-width']), 0)
      }
      function m(e) {
        var t = e.clientWidth,
          n = e.clientHeight
        if (!t && !n) return u
        var o = d(e).getComputedStyle(e),
          i = ((e) => {
            for (
              var t = {}, n = 0, o = ['top', 'right', 'bottom', 'left'];
              n < o.length;
              n++
            ) {
              var i = o[n],
                s = e['padding-' + i]
              t[i] = v(s)
            }
            return t
          })(o),
          s = i.left + i.right,
          a = i.top + i.bottom,
          l = v(o.width),
          r = v(o.height)
        if (
          ('border-box' === o.boxSizing &&
            (Math.round(l + s) !== t && (l -= p(o, 'left', 'right') + s),
            Math.round(r + a) !== n && (r -= p(o, 'top', 'bottom') + a)),
          !((e) => e === d(e).document.documentElement)(e))
        ) {
          var c = Math.round(l + s) - t,
            h = Math.round(r + a) - n
          1 !== Math.abs(c) && (l -= c), 1 !== Math.abs(h) && (r -= h)
        }
        return f(i.left, i.top, l, r)
      }
      var g =
        'undefined' != typeof SVGGraphicsElement
          ? (e) => e instanceof d(e).SVGGraphicsElement
          : (e) =>
              e instanceof d(e).SVGElement && 'function' == typeof e.getBBox
      function b(e) {
        return i
          ? g(e)
            ? ((e) => {
                var t = e.getBBox()
                return f(0, 0, t.width, t.height)
              })(e)
            : m(e)
          : u
      }
      function f(e, t, n, o) {
        return { x: e, y: t, width: n, height: o }
      }
      var w = (() => {
          function e(e) {
            ;(this.broadcastWidth = 0),
              (this.broadcastHeight = 0),
              (this.contentRect_ = f(0, 0, 0, 0)),
              (this.target = e)
          }
          return (
            (e.prototype.isActive = function () {
              var e = b(this.target)
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
        _ = function (e, t) {
          var n,
            o,
            i,
            s,
            a,
            l,
            r,
            c =
              ((o = (n = t).x),
              (i = n.y),
              (s = n.width),
              (a = n.height),
              (l =
                'undefined' != typeof DOMRectReadOnly
                  ? DOMRectReadOnly
                  : Object),
              (r = Object.create(l.prototype)),
              h(r, {
                x: o,
                y: i,
                width: s,
                height: a,
                top: i,
                right: o + s,
                bottom: a + i,
                left: o,
              }),
              r)
          h(this, { target: e, contentRect: c })
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
                  (t.set(e, new w(e)),
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
                    (e) => new _(e.target, e.broadcastRect()),
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
        S = 'undefined' != typeof WeakMap ? new WeakMap() : new o(),
        x = function e(t) {
          if (!(this instanceof e))
            throw new TypeError('Cannot call a class as a function.')
          if (!arguments.length)
            throw new TypeError('1 argument required, but only 0 present.')
          var n = c.getInstance(),
            o = new y(t, n, this)
          S.set(this, o)
        }
      ;['observe', 'unobserve', 'disconnect'].forEach((e) => {
        x.prototype[e] = function () {
          var t
          return (t = S.get(this))[e].apply(t, arguments)
        }
      })
      const E = void 0 !== s.ResizeObserver ? s.ResizeObserver : x
    },
    174786: (e, t, n) => {
      n.d(t, { default: () => o })
      const o = () => {}
    },
    470048: (e) => {
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
    829718: (e) => {
      e.exports = {
        wrap: 'wrap-HAxAr6QG',
        image: 'image-HAxAr6QG',
        text: 'text-HAxAr6QG',
      }
    },
    995390: (e) => {
      e.exports = { section: 'section-Og4Rg_SK', heading: 'heading-Og4Rg_SK' }
    },
    232108: (e) => {
      e.exports = {
        item: 'item-nuuDM7vP',
        normal: 'normal-nuuDM7vP',
        big: 'big-nuuDM7vP',
        selected: 'selected-nuuDM7vP',
        contentCell: 'contentCell-nuuDM7vP',
        content: 'content-nuuDM7vP',
        favourite: 'favourite-nuuDM7vP',
        iconCell: 'iconCell-nuuDM7vP',
        icon: 'icon-nuuDM7vP',
        checkboxInput: 'checkboxInput-nuuDM7vP',
        label: 'label-nuuDM7vP',
      }
    },
    461213: (e) => {
      e.exports = {
        dialog: 'dialog-UAy2ZKyS',
        wrap: 'wrap-UAy2ZKyS',
        empty: 'empty-UAy2ZKyS',
        image: 'image-UAy2ZKyS',
        emptyState: 'emptyState-UAy2ZKyS',
      }
    },
    897646: (e) => {
      e.exports = {
        dialog: 'dialog-LfNchNNG',
        tabletDialog: 'tabletDialog-LfNchNNG',
        desktopDialog: 'desktopDialog-LfNchNNG',
      }
    },
    844445: (e) => {
      e.exports = { accessible: 'accessible-rm8yeqY4' }
    },
    351331: (e) => {
      e.exports = {
        loaderWrap: 'loaderWrap-jGEARQlM',
        big: 'big-jGEARQlM',
        loader: 'loader-jGEARQlM',
      }
    },
    522436: (e) => {
      e.exports = {
        item: 'item-GJX1EXhk',
        interactive: 'interactive-GJX1EXhk',
        hovered: 'hovered-GJX1EXhk',
        disabled: 'disabled-GJX1EXhk',
        active: 'active-GJX1EXhk',
        shortcut: 'shortcut-GJX1EXhk',
        normal: 'normal-GJX1EXhk',
        big: 'big-GJX1EXhk',
        iconCell: 'iconCell-GJX1EXhk',
        icon: 'icon-GJX1EXhk',
        checkmark: 'checkmark-GJX1EXhk',
        content: 'content-GJX1EXhk',
        label: 'label-GJX1EXhk',
        checked: 'checked-GJX1EXhk',
        toolbox: 'toolbox-GJX1EXhk',
        showToolboxOnHover: 'showToolboxOnHover-GJX1EXhk',
        arrowIcon: 'arrowIcon-GJX1EXhk',
        subMenu: 'subMenu-GJX1EXhk',
        invisibleHotkey: 'invisibleHotkey-GJX1EXhk',
      }
    },
    886838: (e) => {
      e.exports = {
        row: 'row-DFIg7eOh',
        line: 'line-DFIg7eOh',
        hint: 'hint-DFIg7eOh',
      }
    },
    36002: (e) => {
      e.exports = { menu: 'menu-Tx5xMZww' }
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
    829122: (e) => {
      e.exports = {
        item: 'item-WJDah4zD',
        emptyIcons: 'emptyIcons-WJDah4zD',
        loading: 'loading-WJDah4zD',
        disabled: 'disabled-WJDah4zD',
        interactive: 'interactive-WJDah4zD',
        hovered: 'hovered-WJDah4zD',
        normal: 'normal-WJDah4zD',
        big: 'big-WJDah4zD',
        icon: 'icon-WJDah4zD',
        label: 'label-WJDah4zD',
        title: 'title-WJDah4zD',
        nested: 'nested-WJDah4zD',
        shortcut: 'shortcut-WJDah4zD',
        remove: 'remove-WJDah4zD',
      }
    },
    333927: (e) => {
      e.exports = { separator: 'separator-Ymxd0dt_' }
    },
    966076: (e) => {
      e.exports = {
        'default-drawer-min-top-distance': '100px',
        wrap: 'wrap-_HnK0UIN',
        positionBottom: 'positionBottom-_HnK0UIN',
        backdrop: 'backdrop-_HnK0UIN',
        drawer: 'drawer-_HnK0UIN',
        positionLeft: 'positionLeft-_HnK0UIN',
      }
    },
    186928: (e) => {
      e.exports = {
        button: 'button-w6lVe_oI',
        hovered: 'hovered-w6lVe_oI',
        disabled: 'disabled-w6lVe_oI',
      }
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
    927306: (e) => {
      e.exports = {
        button: 'button-iLKiGOdQ',
        hovered: 'hovered-iLKiGOdQ',
        disabled: 'disabled-iLKiGOdQ',
        active: 'active-iLKiGOdQ',
        hidden: 'hidden-iLKiGOdQ',
      }
    },
    408323: (e, t, n) => {
      n.d(t, { CheckboxInput: () => h })
      var o = n(50959),
        i = n(497754),
        s = n(800417),
        a = n(72571),
        l = n(465890),
        r = n(470048),
        c = n.n(r)
      function h(e) {
        const t = i(c().box, c()[`intent-${e.intent}`], {
            [c().check]: !Boolean(e.indeterminate),
            [c().dot]: Boolean(e.indeterminate),
            [c().noOutline]: -1 === e.tabIndex,
          }),
          n = i(c().wrapper, e.className)
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
            ...(0, s.filterDataProps)(e),
          }),
          o.createElement(
            'span',
            { className: t },
            o.createElement(a.Icon, { icon: l, className: c().icon }),
          ),
        )
      }
    },
    80137: (e, t, n) => {
      n.d(t, { Dialog: () => c })
      var o = n(50959),
        i = n(497754),
        s = n(682925),
        a = n(801808),
        l = n(800417),
        r = n(705734)
      class c extends o.PureComponent {
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
              darker: a = !1,
              className: c,
              backdrop: h,
              containerTabIndex: d = -1,
            } = this.props,
            u = i(
              c,
              r.dialog,
              e && r.rounded,
              t && r.shadowed,
              n && r.fullscreen,
              a && r.darker,
            ),
            v = (0, l.filterDataProps)(this.props),
            p = this.props.style
              ? { ...this._createStyles(), ...this.props.style }
              : this._createStyles()
          return o.createElement(
            o.Fragment,
            null,
            o.createElement(
              s.SlotContext.Provider,
              { value: this._manager },
              h &&
                o.createElement('div', {
                  onClick: this.props.onClickBackdrop,
                  className: r.backdrop,
                }),
              o.createElement(
                'div',
                {
                  ...v,
                  className: u,
                  style: p,
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
            top: i,
            zIndex: s,
            height: a,
          } = this.props
          return {
            bottom: e,
            left: t,
            right: o,
            top: i,
            zIndex: s,
            maxWidth: n,
            height: a,
          }
        }
      }
    },
    234404: (e, t, n) => {
      n.d(t, { Loader: () => l })
      var o = n(50959),
        i = n(497754),
        s = n(625650),
        a = n.n(s)
      function l(e) {
        const {
            className: t,
            size: n = 'medium',
            staticPosition: s,
            color: l = 'black',
          } = e,
          r = i(a().item, a()[l], a()[n])
        return o.createElement(
          'span',
          { className: i(a().loader, s && a().static, t) },
          o.createElement('span', { className: r }),
          o.createElement('span', { className: r }),
          o.createElement('span', { className: r }),
        )
      }
    },
    823030: (e, t, n) => {
      n.d(t, { SubmenuContext: () => i, SubmenuHandler: () => s })
      var o = n(50959)
      const i = o.createContext(null)
      function s(e) {
        const [t, n] = (0, o.useState)(null),
          s = (0, o.useRef)(null),
          a = (0, o.useRef)(new Map())
        return (
          (0, o.useEffect)(
            () => () => {
              null !== s.current && clearTimeout(s.current)
            },
            [],
          ),
          o.createElement(
            i.Provider,
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
                  a.current.set(e, t),
                  () => {
                    a.current.delete(e)
                  }
                ),
                isSubmenuNode: (e) =>
                  Array.from(a.current.values()).some((t) => t(e)),
              },
            },
            e.children,
          )
        )
      }
    },
    738036: (e, t, n) => {
      n.d(t, { OutsideEvent: () => i })
      var o = n(908783)
      function i(e) {
        const { children: t, ...n } = e
        return t((0, o.useOutsideEvent)(n))
      }
    },
    912015: (e, t, n) => {
      n.d(t, { isPlatformMobile: () => i })
      var o = n(69111)
      n(156963), n(601227)
      function i() {
        return (
          !(0, o.isOnMobileAppPage)('any') &&
          (window.matchMedia('(min-width: 602px) and (min-height: 445px)')
            .matches,
          !1)
        )
      }
    },
    723698: (e, t, n) => {
      n.r(t),
        n.d(t, {
          Components: () => H,
          showDefaultSearchDialog: () => T,
          showSymbolSearchItemsDialog: () => l.showSymbolSearchItemsDialog,
        })
      var o = n(688401),
        i = n(972535),
        s = n(248166),
        a = n(265831),
        l = n(558323),
        r = n(650802),
        c = n(50959),
        h = n(650151),
        d = n(56871),
        u = n(113060),
        v = n(944080),
        p = n(497754),
        m = n.n(p),
        g = n(609838),
        b = n(800296),
        f = n(581384),
        w = n(398120),
        _ = n(177042),
        y = n(339339)
      function S(e) {
        const {
            isSelected: t,
            existInWatchlist: o,
            findInWatchlist: i,
            addToWatchlist: s,
            removeFromWatchlist: a,
          } = e,
          { selectedAction: l } = (0, h.ensureNotNull)(
            (0, c.useContext)(u.SymbolSearchWatchlistContext),
          )
        return c.createElement(
          c.Fragment,
          null,
          o
            ? c.createElement(
                c.Fragment,
                null,
                c.createElement(b.ListItemButton, {
                  className: m()(
                    y.action,
                    y.removeAction,
                    t && 2 === l && y.selected,
                    'apply-common-tooltip',
                  ),
                  onClick: a,
                  icon: f,
                  title: g.t(null, void 0, n(366702)),
                }),
                c.createElement(b.ListItemButton, {
                  className: m()(
                    y.action,
                    y.targetAction,
                    t && 1 === l && y.selected,
                    'apply-common-tooltip',
                  ),
                  onClick: i,
                  icon: _,
                  title: g.t(null, void 0, n(708682)),
                }),
              )
            : c.createElement(b.ListItemButton, {
                className: m()(
                  y.action,
                  y.addAction,
                  t && 0 === l && y.selected,
                  'apply-common-tooltip',
                ),
                onClick: s,
                icon: w,
                title: g.t(null, void 0, n(445976)),
              }),
        )
      }
      var x = n(180185),
        E = n(32133),
        C = n(979359),
        M = n(190266)
      var k = n(533408),
        A = n(892932),
        D = n(897646)
      ;(0, n(912015).isPlatformMobile)()
      function T(e) {
        new r.WatchedValue({})
        const t = (0, a.getSymbolSearchCompleteOverrideFunction)(),
          {
            defaultValue: n,
            showSpreadActions: i,
            source: c,
            onSearchComplete: h,
            trackResultsOptions: d,
            ...u
          } = e,
          v = {
            ...u,
            showSpreadActions: null != i ? i : (0, s.canShowSpreadActions)(),
            onSymbolFiltersParamsChange: void 0,
            onSearchComplete: (e, n) => {
              null == n || n.symbolType
              t(e[0].symbol, e[0].result).then((e) => {
                o.linking.setSymbolAndLogInitiator(e.symbol, 'symbol search'),
                  null == h || h(e.symbol)
              })
            },
            onEmptyResults: void 0,
          }
        ;(0, l.showSymbolSearchItemsDialog)({ ...v, defaultValue: n })
      }
      const H = {
        SymbolSearchWatchlistDialogContentItem: (e) => {
          const {
              addToWatchlist: t,
              removeFromWatchlist: n,
              findInWatchlist: o,
              existInWatchlist: s,
              isSelected: a,
              fullSymbolName: l,
              ...r
            } = e,
            {
              onClose: p,
              searchRef: m,
              searchSpreads: g,
            } = (0, h.ensureNotNull)(
              (0, c.useContext)(v.SymbolSearchItemsDialogContext),
            ),
            {
              setSelectedAction: b,
              isSpreadOrMultipleMode: f,
              addAfter: w,
              clearTargetSymbol: _,
              highlighted: y,
              highlight: k,
            } = (0, h.ensureNotNull)(
              (0, c.useContext)(u.SymbolSearchWatchlistContext),
            ),
            A = f(g, m)
          return (
            (0, c.useLayoutEffect)(() => {
              a && b(void 0 !== s ? (s ? 2 : 0) : null)
            }, [a, s]),
            c.createElement(d.SymbolSearchDialogContentItem, {
              ...r,
              fullSymbolName: l,
              onClick: A
                ? e.onClick
                : (o) => {
                    if (void 0 === l) return
                    if (void 0 === s)
                      return void (0, h.ensureDefined)(e.onClick)(o)
                    s
                      ? (n(C.WATCHLIST_WIDGET_ID, l),
                        T('watchlist remove click', o),
                        w === l && _())
                      : ((0, M.runOrSignInWithPromo)(
                          'watchList',
                          { source: 'add symbol to watchlist' },
                          () => {
                            t(C.WATCHLIST_WIDGET_ID, [l], w), e.id && k(e.id)
                          },
                        ),
                        T('watchlist add click', o))
                    D(o)
                  },
              isHighlighted: y === e.id,
              isSelected: a,
              actions:
                void 0 === s || A
                  ? void 0
                  : c.createElement(S, {
                      isSelected: a,
                      existInWatchlist: s,
                      addToWatchlist: (n) => {
                        if ((n.stopPropagation(), void 0 === l)) return
                        ;(0, M.runOrSignInWithPromo)(
                          'watchList',
                          { source: 'add symbol to watchlist' },
                          () => {
                            t(C.WATCHLIST_WIDGET_ID, [l], w), e.id && k(e.id)
                          },
                        ),
                          D(n),
                          T('watchlist add button', n)
                      },
                      removeFromWatchlist: (e) => {
                        if ((e.stopPropagation(), void 0 === l)) return
                        n(C.WATCHLIST_WIDGET_ID, l),
                          D(e),
                          T('watchlist remove button', e),
                          w === l && _()
                      },
                      findInWatchlist: (e) => {
                        if ((e.stopPropagation(), void 0 === l)) return
                        o(C.WATCHLIST_WIDGET_ID, l),
                          p(),
                          T('watchlist goto button')
                      },
                    }),
            })
          )
          function D(e) {
            var t
            e && (0, x.modifiersFromEvent)(e) === x.Modifiers.Shift
              ? p()
              : i.mobiletouch ||
                null === (t = m.current) ||
                void 0 === t ||
                t.select()
          }
          function T(e, t) {
            let n = e
            t &&
              (0, x.modifiersFromEvent)(t) === x.Modifiers.Shift &&
              (n += ' shift'),
              (0, E.trackEvent)('GUI', 'SS', n)
          }
        },
        SymbolSearchWatchlistDialog: (e) => {
          const {
              addToWatchlist: t,
              removeFromWatchlist: n,
              findInWatchlist: o,
              ...i
            } = e,
            {
              feedItems: s,
              searchRef: a,
              searchSpreads: l,
              selectedIndex: r,
              onSubmit: d,
              setSelectedIndex: p,
              onClose: g,
              isMobile: b,
              isTablet: f,
              mode: w,
              setMode: _,
              symbolSearchState: y,
            } = (0, h.ensureNotNull)(
              (0, c.useContext)(v.SymbolSearchItemsDialogContext),
            ),
            {
              selectedAction: S,
              setSelectedAction: E,
              isSpreadOrMultipleMode: T,
              addAfter: H,
              clearTargetSymbol: I,
              highlight: L,
            } = (0, h.ensureNotNull)(
              (0, c.useContext)(u.SymbolSearchWatchlistContext),
            ),
            O = s[r],
            N = 'exchange' === w
          return c.createElement(k.AdaptivePopupDialog, {
            ...i,
            className: m()(
              D.dialog,
              !b && (f ? D.tabletDialog : D.desktopDialog),
            ),
            dataName: 'watchlist-symbol-search-dialog',
            onKeyDown: (e) => {
              var t
              const n = (0, x.hashFromEvent)(e)
              switch (n) {
                case 13:
                  return T(l, a)
                    ? void d(!0)
                    : (O ? P(!1) : d(!1),
                      void (
                        null === (t = a.current) ||
                        void 0 === t ||
                        t.select()
                      ))
                case 13 + x.Modifiers.Shift:
                  return T(l, a) ? void d(!0) : void (O ? P(!0) : d(!0))
                case 27:
                  return (
                    e.preventDefault(), N ? void _('symbolSearch') : void g()
                  )
              }
              switch ((0, A.mapKeyCodeToDirection)(n)) {
                case 'blockPrev':
                  if ((e.preventDefault(), 0 === r || 'good' !== y)) return
                  if (-1 === r) return void p(0)
                  p(r - 1)
                  break
                case 'blockNext':
                  if ((e.preventDefault(), r === s.length - 1 || 'good' !== y))
                    return
                  p(r + 1)
                  break
                case 'inlinePrev':
                  if (!O) return
                  1 === S && (e.preventDefault(), E(2))
                  break
                case 'inlineNext':
                  if (!O) return
                  2 === S && (e.preventDefault(), E(1))
              }
            },
            backdrop: !0,
            draggable: !1,
          })
          function P(e) {
            if (!O || void 0 === O.fullSymbolName) return
            const { fullSymbolName: i } = O
            switch (S) {
              case 0:
                ;(0, M.runOrSignInWithPromo)(
                  'watchList',
                  { source: 'add symbol to watchlist' },
                  () => {
                    t(C.WATCHLIST_WIDGET_ID, [i], H), O.id && L(O.id)
                  },
                )
                break
              case 1:
                return o(C.WATCHLIST_WIDGET_ID, i), void g()
              case 2:
                n(C.WATCHLIST_WIDGET_ID, i), H === i && I()
            }
            e && g()
          }
        },
      }
    },
    558323: (e, t, n) => {
      n.d(t, { showSymbolSearchItemsDialog: () => r })
      var o = n(50959),
        i = n(500962),
        s = n(753327),
        a = n(63192),
        l = n(121087)
      function r(e) {
        const {
          initialMode: t = 'symbolSearch',
          autofocus: n = !0,
          defaultValue: r,
          showSpreadActions: c,
          selectSearchOnInit: h,
          onSearchComplete: d,
          dialogTitle: u,
          placeholder: v,
          fullscreen: p,
          initialScreen: m,
          wrapper: g,
          dialog: b,
          contentItem: f,
          onClose: w,
          onOpen: _,
          footer: y,
          symbolTypes: S,
          searchInput: x,
          emptyState: E,
          hideMarkedListFlag: C,
          dialogWidth: M = 'auto',
          manager: k,
          shouldReturnFocus: A,
          onSymbolFiltersParamsChange: D,
          onEmptyResults: T,
        } = e
        if (
          a.dialogsOpenerManager.isOpened('SymbolSearch') ||
          a.dialogsOpenerManager.isOpened('ChangeIntervalDialog')
        )
          return
        const H = document.createElement('div'),
          I = o.createElement(
            s.SlotContext.Provider,
            { value: null != k ? k : null },
            o.createElement(l.SymbolSearchItemsDialog, {
              onClose: L,
              initialMode: t,
              defaultValue: r,
              showSpreadActions: c,
              hideMarkedListFlag: C,
              selectSearchOnInit: h,
              onSearchComplete: d,
              dialogTitle: u,
              placeholder: v,
              fullscreen: p,
              initialScreen: m,
              wrapper: g,
              dialog: b,
              contentItem: f,
              footer: y,
              symbolTypes: S,
              searchInput: x,
              emptyState: E,
              autofocus: n,
              dialogWidth: M,
              shouldReturnFocus: A,
              onSymbolFiltersParamsChange: D,
              onEmptyResults: T,
            }),
          )
        function L() {
          i.unmountComponentAtNode(H),
            a.dialogsOpenerManager.setAsClosed('SymbolSearch'),
            w && w()
        }
        return (
          i.render(I, H),
          a.dialogsOpenerManager.setAsOpened('SymbolSearch'),
          _ && _(),
          { close: L }
        )
      }
    },
    417505: (e, t, n) => {
      n.r(t), n.d(t, { GlobalSearchDialogRenderer: () => lt })
      var o = n(50959),
        i = n(500962),
        s = n(557883),
        a = n(19406),
        l = n(12481),
        r = n(609838),
        c = n(870122),
        h = n(180185),
        d = n(372605),
        u = n(231862),
        v = n(497754),
        p = n(72571),
        m = n(651049),
        g = n(702054),
        b = n(267562),
        f = n(366619),
        w = n(829718)
      function _(e) {
        const { text: t, showIcon: n = !0, className: i } = e,
          s = g.watchedTheme.value() === m.StdTheme.Dark ? f : b
        return o.createElement(
          'div',
          { className: v(w.wrap, i) },
          n && o.createElement(p.Icon, { icon: s, className: w.image }),
          o.createElement('span', { className: w.text }, t),
        )
      }
      var y = n(533408),
        S = n(26845),
        x = n(855417),
        E = n(116491),
        C = n(174786),
        M = n(493173),
        k = n(194646),
        A = n(879091),
        D = n(232108)
      const T = (0, M.mergeThemes)(k.DEFAUL_CONTEXT_MENU_ITEM_THEME, D)
      function H(e) {
        const { action: t, isSelected: n, activeElRef: i, onExecute: s } = e
        return o.createElement(A.ContextMenuAction, {
          theme: T,
          onShowSubMenu: C.default,
          isSubMenuOpened: !1,
          checkboxInput: !0,
          reference: i,
          selected: n,
          action: t,
          onExecute: s,
        })
      }
      var I = n(995390)
      function L(e) {
        const {
          heading: t,
          selectedId: n,
          items: i,
          activeElRef: s,
          onExecute: a,
        } = e
        return o.createElement(
          'table',
          { className: I.section },
          o.createElement(
            'tbody',
            null,
            o.createElement(
              'tr',
              null,
              o.createElement('td', { className: I.heading }, t),
            ),
            i.map((e) =>
              o.createElement(H, {
                key: e.id,
                action: e,
                isSelected: e.id === n,
                activeElRef: e.id === n ? s : void 0,
                onExecute: a,
              }),
            ),
          ),
        )
      }
      var O = n(461213)
      const N = [
        { name: 'drawingsActions', label: r.t(null, void 0, n(222772)) },
        { name: 'functionActions', label: r.t(null, void 0, n(15327)) },
        { name: 'settingsActions', label: r.t(null, void 0, n(389517)) },
      ]
      function P(e) {
        const { dialogId: t, items: i, onClose: s, shouldReturnFocus: a } = e,
          [v, p] = (0, o.useState)(''),
          [m, g] = (0, o.useState)([]),
          b = (0, o.useRef)(null),
          f = (0, o.useRef)(null),
          { activeIdx: w, setActiveIdx: C } = (0, S.useKeyboardNavigation)(
            b.current,
            m,
            (e, t) => {
              t.preventDefault()
              const n = m[w]
              n && !n.isDisabled() && (n.execute(), n.isCheckable() ? k() : s())
            },
            'keyup',
          )
        ;(0, E.useResetActiveIdx)(C, [v, i]),
          (0, x.useScrollToRef)(f, w),
          (0, o.useEffect)(() => {
            var e
            null === (e = b.current) || void 0 === e || e.focus()
          }, []),
          (0, o.useEffect)(() => {
            const e = b.current
            if (e)
              return (
                e.addEventListener('input', H),
                H(),
                () => {
                  e && e.removeEventListener('input', H)
                }
              )
          }, [])
        const M = (0, o.useCallback)(
            (0, l.default)((e) => {}, 1e3),
            [],
          ),
          k = (0, o.useCallback)((0, l.default)(s, 200), [])
        ;(0, o.useEffect)(
          () => () => {
            M.flush(), k.cancel()
          },
          [],
        )
        const A = (0, o.useMemo)(() => {
            const e = new Set(c.getJSON('GlobalSearchDialog.recent', [])),
              t = []
            for (const n of e) {
              const e = i.find((e) => e.getState().id === n)
              e && t.push(e)
            }
            return t.reverse(), t
          }, []),
          D = (0, o.useMemo)(
            () =>
              N.reduce(
                (e, t) => (
                  e.set(
                    t.name,
                    m.filter((e) => e.getState().category === t.name),
                  ),
                  e
                ),
                new Map(),
              ),
            [m],
          )
        return o.createElement(y.AdaptivePopupDialog, {
          dataName: t,
          title: r.t(null, void 0, n(678842)),
          onClose: s,
          onClickOutside: s,
          shouldReturnFocus: a,
          render: () =>
            o.createElement(
              o.Fragment,
              null,
              o.createElement(u.DialogSearch, { reference: b }),
              o.createElement(
                'div',
                { className: O.wrap },
                v
                  ? o.createElement(
                      o.Fragment,
                      null,
                      m.length
                        ? N.map((e) => {
                            const t = D.get(e.name)
                            return t && t.length
                              ? o.createElement(L, {
                                  key: e.name,
                                  heading: e.label,
                                  items: t,
                                  selectedId: I(),
                                  activeElRef: f,
                                  onExecute: T,
                                })
                              : null
                          })
                        : o.createElement(_, {
                            text: r.t(null, void 0, n(945850)),
                            className: O.emptyState,
                          }),
                    )
                  : o.createElement(
                      o.Fragment,
                      null,
                      Boolean(m.length)
                        ? o.createElement(L, {
                            heading: r.t(null, void 0, n(990612)),
                            selectedId: I(),
                            activeElRef: f,
                            items: m,
                            onExecute: T,
                          })
                        : o.createElement(_, {
                            text: r.t(null, void 0, n(464185)),
                            showIcon: !1,
                            className: O.emptyState,
                          }),
                    ),
              ),
            ),
          className: O.dialog,
          onKeyDown: (e) => {
            27 === (0, h.hashFromEvent)(e) && (e.preventDefault(), s())
          },
          isOpened: !0,
        })
        function T(e) {
          e.getState().checkable ? k() : s()
        }
        function H() {
          const e = b.current ? b.current.value.toLocaleLowerCase().trim() : ''
          if ((p(e), e)) {
            const t = i
              .filter(
                (t) =>
                  P(t).includes(e) ||
                  ((e, t) => {
                    const { aliases: n } = t.getState()
                    if (n) return n.some((t) => t.toLowerCase().includes(e))
                    return !1
                  })(e, t),
              )
              .sort((t) => (P(t) === e ? -1 : 0))
            g(t), t.length || M(e)
          } else g(A)
        }
        function I() {
          return -1 !== w ? m[w].id : null
        }
        function P(e) {
          const { label: t } = e.getState()
          return (0, d.isString)(t) ? t.toLocaleLowerCase() : ''
        }
      }
      var R = n(688401),
        z = n(730388),
        F = n(350299),
        B = n(584037),
        W = n(837210),
        V = n(149123),
        Z = n(650151),
        G = n(973602)
      function U() {
        var e
        if (!window.widgetbar) return
        const t =
          null ===
            (e = (0, Z.ensureNotNull)(window.widgetbar.setPage('base')).widget(
              'watchlist',
            )) || void 0 === e
            ? void 0
            : e.widgetObject
        return t || void 0
      }
      function X(e) {
        return e instanceof G.Action
      }
      function K(e, t) {
        const n = e.getState().category,
          o = t.getState().category
        return n === o
          ? 0
          : 'drawingsActions' === o
            ? 1
            : 'drawingsActions' === n || 'functionActions' === n
              ? -1
              : 1
      }
      class q extends G.Action {
        constructor({
          id: e,
          category: t,
          favourite: n,
          onFavouriteClick: o,
          hotkeyGroup: i,
          hotkeyHash: s,
          aliases: a,
          ...l
        }) {
          super({
            actionId: 'UnknownAction',
            options: { ...l, doNotCloseOnClick: !0 },
            id: e,
          }),
            (this.execute = () => {
              super.execute()
              const e = new Set(c.getJSON('GlobalSearchDialog.recent', [])),
                t = this._searchOptions.id
              e.has(t) && e.delete(t),
                e.add(t),
                c.setJSON('GlobalSearchDialog.recent', Array.from(e).slice(-10))
            }),
            (this.getState = () => ({
              ...super.getState(),
              id: this._searchOptions.id,
              category: this._searchOptions.category,
              favourite: this._searchOptions.favourite,
              onFavouriteClick: this._onFavouriteClick,
              aliases: this._searchOptions.aliases,
            })),
            (this.update = (e) => {
              ;(this._searchOptions = Object.assign(this._searchOptions, e)),
                super.update(e)
            }),
            (this._onFavouriteClick = (e) => {
              this._searchOptions.onFavouriteClick &&
                (this.update({ favourite: !this._searchOptions.favourite }),
                this._searchOptions.onFavouriteClick(e))
            }),
            (this._searchOptions = {
              id: e,
              category: t,
              favourite: n,
              onFavouriteClick: o,
              aliases: a,
            })
        }
      }
      var J = n(743717)
      class j extends q {
        constructor(e) {
          super(e), (this._controller = new AbortController())
        }
        destroy() {
          super.destroy(), this._controller.abort()
        }
        async _load() {
          const e = await (0, J.initSymbolListService)()
          if (this._controller.signal.aborted) return
          const { activeSymbolList: t } = e.store.getState()
          this.update({ disabled: isDeletedSymbolsList(t) })
        }
      }
      var $,
        Y = n(619130),
        Q = n(156963),
        ee = (n(919577), n(593194), n(664902)),
        te = n(122217)
      !((e) => {
        ;(e.None = 'all'), (e.Following = 'following'), (e.Private = 'private')
      })($ || ($ = {}))
      var ne = n(648067),
        oe = n(938867),
        ie = n(583798),
        se = n(382280),
        ae = n(852923)
      const le = async (e) => {
        const t = (0, se.tradingService)()
        if (null === t || 0 === (await t.brokersMetainfo()).length) return []
        const o = []
        Q.enabled('buy_sell_buttons') &&
          o.push(
            new q({
              id: 'ShowBuySellButtons',
              category: 'settingsActions',
              label: r.t(null, void 0, n(73953)),
              checkable: !0,
              checked: t.showSellBuyButtons.value(),
              onExecute: () => {
                const e = !t.showSellBuyButtons.value()
                t.showSellBuyButtons.setValue(e)
              },
            }),
          ),
          Q.enabled('right_toolbar') &&
            Q.enabled('dom_widget') &&
            o.push(
              new q({
                label: r.t(null, void 0, n(778082)),
                icon: n(528009),
                id: 'OpenDOMWidget',
                category: 'functionActions',
                disabled: !t.tradingPanel.isOpeningAvailable.value(),
                shortcutHint: (0, h.humanReadableHash)(h.Modifiers.Shift + 68),
                onExecute: () => {
                  t.setDOMPanelVisibility(!0)
                },
              }),
            )
        const i = e.model().mainSeries()
        return (0, ae.createTradeContext)(i)
          .then((e) => {
            try {
              return t.chartContextMenuActions(e)
            } catch (e) {
              return []
            }
          })
          .then(
            (e) => (
              o.push(
                ...e
                  .filter(X)
                  .map(
                    (e) =>
                      new q({
                        ...e.options(),
                        id: e.getState().name || e.getLabel(),
                        category: 'functionActions',
                        aliases:
                          'trade-new-order' === e.getState().name
                            ? [
                                r.t(null, void 0, n(618156)),
                                r.t(null, void 0, n(392553)),
                              ]
                            : void 0,
                        disabled:
                          e.options().disabled ||
                          ('trade-new-order' === e.getState().name &&
                            (!Q.enabled('right_toolbar') ||
                              !Q.enabled('order_panel'))),
                      }),
                  ),
              ),
              o
            ),
          )
      }
      var re = n(554267),
        ce = n(601227)
      function he(e) {
        const t = e.match(/^(\d+).(\d+).(\d+)/)
        if (!t) return null
        const [, n, o, i] = t
        return [Number.parseInt(n), Number.parseInt(o), Number.parseInt(i)]
      }
      function de(e) {
        const t = (0, ce.desktopAppVersion)()
        return (
          !!t &&
          ((e, t) => {
            const n = he(e),
              o = he(t)
            if (!n || !o) return !1
            const [i, s, a] = n,
              [l, r, c] = o
            return i !== l ? i < l : s !== r ? s < r : a !== c && a < c
          })(t, e)
        )
      }
      const ue = (e) => {
        const t = (t) => {
          const o = []
          if (
            (t &&
              t.length &&
              window.is_authenticated &&
              t.forEach((t) => {
                o.push(
                  new q({
                    id: t,
                    category: 'settingsActions',
                    label: `${r.t(null, void 0, n(132409))} ${re.translateStdThemeName(t)}`,
                    onExecute: () => {
                      re.loadTheme(e.chartWidgetCollection(), {
                        themeName: t,
                        standardTheme: !1,
                      }).then(() => {
                        e.readOnly() || window.saver.saveChartSilently()
                      })
                    },
                  }),
                )
              }),
            !(0, ce.isDesktopApp)() || de('1.0.10'))
          ) {
            const [t, i] = re.getStdThemeNames()
            o.push(
              new q({
                id: 'DarkColorTheme',
                category: 'settingsActions',
                label: r.t(null, void 0, n(866365)),
                checkable: !0,
                checked: re.getCurrentTheme().name === i,
                onExecute: () => {
                  const n = re.getCurrentTheme().name === i ? t : i
                  re.loadTheme(e.chartWidgetCollection(), {
                    themeName: n,
                    standardTheme: !0,
                  }).then(() => {
                    e.readOnly() || window.saver.saveChartSilently()
                  })
                },
              }),
            )
          }
          return o
        }
        return window.is_authenticated
          ? re.getThemeNames().then(t)
          : Promise.resolve(t())
      }
      var ve = n(683471),
        pe = n(980363)
      n(602164)
      var me = n(175421),
        ge = n(679112),
        be = n(812297)
      const { DrawingSyncMode: fe } = ve,
        we = {
          drawings: 'ToggleHideAllDrawingTools',
          indicators: 'ToggleHideAllIndicators',
          positions: 'ToggleHideAllPositions',
          all: 'ToggleHideAll',
        },
        _e = new ee.TranslatedString(
          'stay in drawing mode',
          r.t(null, void 0, n(52010)),
        ),
        ye = new ee.TranslatedString(
          'sync drawings',
          r.t(null, void 0, n(695612)),
        ),
        Se = r.t(null, void 0, n(749421)),
        xe = r.t(null, void 0, n(735888)),
        Ee =
          (r.t(null, void 0, n(477989)),
          r.t(null, void 0, n(319407)),
          r.t(null, void 0, n(537057))),
        Ce = r.t(null, void 0, n(245265)),
        Me = r.t(null, void 0, n(685422))
      var ke = n(794966),
        Ae = n(582860),
        De = n(723698)
      class Te extends q {
        constructor(e) {
          super({
            label: r.t(null, void 0, n(482785)),
            id: 'InvertScale',
            category: 'settingsActions',
            checkable: !0,
            onExecute: () => {
              this._model.invertPriceScale(
                this._model.mainSeries().priceScale(),
              )
            },
            shortcutHint: (0, h.humanReadableHash)(h.Modifiers.Alt + 73),
          }),
            (this._model = e)
          ;(this._props = this._model
            .mainSeries()
            .priceScale()
            .properties()
            .childs().isInverted).subscribe(this, () => {
            this._onUpdate.fire(this)
          })
        }
        destroy() {
          super.destroy(), this._props.unsubscribeAll(this)
        }
        isChecked() {
          return this._model.mainSeries().priceScale().isInverted()
        }
      }
      class He extends q {
        constructor(e) {
          super({
            label: r.t(null, void 0, n(351102)),
            checkable: !0,
            id: 'TogglePercantage',
            category: 'settingsActions',
            onExecute: () => {
              this.isChecked()
                ? this._model.setPriceScaleRegularScaleMode(
                    this._model.mainSeries().priceScale(),
                  )
                : this._model.togglePriceScalePercentageScaleMode(
                    this._model.mainSeries().priceScale(),
                  )
            },
            shortcutHint: (0, h.humanReadableHash)(h.Modifiers.Alt + 80),
            disabled:
              e.mainSeries().priceScale().isLockScale() ||
              6 === e.mainSeries().properties().childs().style.value(),
            checked: e.mainSeries().priceScale().isPercentage(),
          }),
            (this._model = e)
          ;(this._props = this._model
            .mainSeries()
            .priceScale()
            .properties()
            .childs().percentage).subscribe(this, () => {
            this._onUpdate.fire(this)
          })
        }
        destroy() {
          super.destroy(), this._props.unsubscribeAll(this)
        }
        isChecked() {
          return this._model.mainSeries().priceScale().isPercentage()
        }
      }
      class Ie extends q {
        constructor(e) {
          super({
            label: r.t(null, void 0, n(512285)),
            id: 'ToggleLogScale',
            category: 'settingsActions',
            checkable: !0,
            onExecute: () => {
              this.isChecked()
                ? this._model.setPriceScaleRegularScaleMode(
                    this._model.mainSeries().priceScale(),
                  )
                : this._model.togglePriceScaleLogScaleMode(
                    this._model.mainSeries().priceScale(),
                  )
            },
            shortcutHint: (0, h.humanReadableHash)(h.Modifiers.Alt + 76),
            disabled:
              e.mainSeries().priceScale().isLockScale() ||
              6 === e.mainSeries().properties().childs().style.value(),
            checked: e.mainSeries().priceScale().isLog(),
          }),
            (this._model = e)
          ;(this._props = this._model
            .mainSeries()
            .priceScale()
            .properties()
            .childs().log).subscribe(this, () => {
            this._onUpdate.fire(this)
          })
        }
        destroy() {
          super.destroy(), this._props.unsubscribeAll(this)
        }
        isChecked() {
          return this._model.mainSeries().priceScale().isLog()
        }
      }
      const Le = Q.enabled('show_average_close_price_line_and_label'),
        Oe = new ee.TranslatedString(
          'change session',
          r.t(null, void 0, n(765303)),
        ),
        Ne = new ee.TranslatedString(
          'change plus button visibility',
          r.t(null, void 0, n(450190)),
        ),
        Pe = new ee.TranslatedString(
          'change countdown to bar close visibility',
          r.t(null, void 0, n(58108)),
        ),
        Re = new ee.TranslatedString(
          'scale price chart only',
          r.t(null, void 0, n(599042)),
        ),
        ze = new ee.TranslatedString(
          'change symbol last value visibility',
          r.t(null, void 0, n(253150)),
        ),
        Fe = new ee.TranslatedString(
          'change high and low price labels visibility',
          r.t(null, void 0, n(466805)),
        ),
        Be = new ee.TranslatedString(
          'change average close price label visibility',
          r.t(null, void 0, n(739402)),
        ),
        We = new ee.TranslatedString(
          'change indicators and financials value labels visibility',
          r.t(null, void 0, n(90512)),
        ),
        Ve = new ee.TranslatedString(
          'change indicators and financials name labels visibility',
          r.t(null, void 0, n(559820)),
        ),
        Ze = new ee.TranslatedString(
          'change high and low price lines visibility',
          r.t(null, void 0, n(992556)),
        ),
        Ge = new ee.TranslatedString(
          'change average close price line visibility',
          r.t(null, void 0, n(498866)),
        ),
        Ue = new ee.TranslatedString(
          'change symbol labels visibility',
          r.t(null, void 0, n(109402)),
        ),
        Xe =
          (new ee.TranslatedString(
            'change pre/post market price label visibility',
            r.t(null, void 0, n(549889)),
          ),
          new ee.TranslatedString(
            'change symbol previous close value visibility',
            r.t(null, void 0, n(112707)),
          )),
        Ke = new ee.TranslatedString(
          'change previous close price line visibility',
          r.t(null, void 0, n(259883)),
        ),
        qe = new ee.TranslatedString(
          'change bid and ask labels visibility',
          r.t(null, void 0, n(805100)),
        ),
        Je = new ee.TranslatedString(
          'change bid and ask lines visibility',
          r.t(null, void 0, n(432311)),
        ),
        je =
          (new ee.TranslatedString(
            'change pre/post market price lines visibility',
            r.t(null, void 0, n(350393)),
          ),
          new ee.TranslatedString(
            'change price line visibility',
            r.t(null, void 0, n(867761)),
          )),
        $e = new ee.TranslatedString(
          'change session breaks visibility',
          r.t(null, void 0, n(115403)),
        ),
        Ye =
          (new ee.TranslatedString(
            'change ideas visibility on chart',
            r.t(null, void 0, n(565558)),
          ),
          new ee.TranslatedString(
            'show all ideas',
            r.t(null, void 0, n(813622)),
          ),
          new ee.TranslatedString(
            'show ideas of followed users',
            r.t(null, void 0, n(826267)),
          ),
          new ee.TranslatedString(
            'show my ideas only',
            r.t(null, void 0, n(740061)),
          ),
          new ee.TranslatedString(
            'change events visibility on chart',
            r.t(null, void 0, n(979574)),
          ),
          new ee.TranslatedString(
            'change earnings visibility',
            r.t(null, void 0, n(88217)),
          ),
          new ee.TranslatedString(
            'change dividends visibility',
            r.t(null, void 0, n(184944)),
          ),
          new ee.TranslatedString(
            'change splits visibility',
            r.t(null, void 0, n(374488)),
          ),
          {
            0: r.t(null, void 0, n(397559)),
            1: r.t(null, void 0, n(86771)),
            9: r.t(null, void 0, n(651383)),
            2: r.t(null, void 0, n(887691)),
            14: r.t(null, void 0, n(514956)),
            15: r.t(null, void 0, n(459393)),
            3: r.t(null, void 0, n(45290)),
            16: r.t(null, void 0, n(241412)),
            4: r.t(null, void 0, n(591664)),
            7: r.t(null, void 0, n(470)),
            5: r.t(null, void 0, n(890599)),
            6: r.t(null, void 0, n(459491)),
            8: r.t(null, void 0, n(620424)),
            10: r.t(null, void 0, n(18779)),
            11: r.t(null, void 0, n(538385)),
            12: r.t(null, void 0, n(928381)),
            13: r.t(null, void 0, n(520788)),
            17: r.t(null, void 0, n(882838)),
          })
      async function Qe(e) {
        var t, o, i, s, a, l, c, d
        const u = [],
          [v, p] = await Promise.all([ue(e), le(e)]),
          m = ((e) => {
            const t = [],
              {
                stayInDrawingMode: n,
                drawOnAllCharts: o,
                drawOnAllChartsMode: i,
              } = ve.properties().childs()
            t.push(
              new q({
                label: Se,
                checkable: !0,
                checked: n.value(),
                id: 'ToggleStayInDrawingMode',
                category: 'settingsActions',
                onExecute: () => {
                  e.model().setProperty(n, !n.value(), _e)
                },
              }),
            ),
              t.push(
                new q({
                  label: xe,
                  checkable: !0,
                  id: 'ToggleSyncDrawings',
                  category: 'settingsActions',
                  checked: o.value(),
                  disabled: !e.isMultipleLayout().value(),
                  onExecute: () => {
                    e.model().setProperty(o, !o.value(), ye)
                  },
                }),
              )
            const s = ve.lockDrawings()
            t.push(
              new q({
                label: Ee,
                checkable: !0,
                id: 'ToggleLockDrawings',
                category: 'settingsActions',
                checked: s.value(),
                onExecute: () => {
                  ve.lockDrawings().setValue(!ve.lockDrawings().value())
                },
              }),
            )
            const a = (0, be.getSavedHideMode)()
            t.push(
              ...Array.from((0, be.getHideOptions)()).map(
                ([e, t]) =>
                  new q({
                    label: t.tooltip.inactive,
                    checkable: !0,
                    id: we[e],
                    category: 'settingsActions',
                    checked: a === e && (0, be.getHideModeStateValue)(e),
                    onExecute: () => (0, be.toggleHideMode)(e),
                  }),
              ),
            )
            const { magnet: l, magnetMode: r } = ve.properties().childs()
            return (
              t.push(
                new q({
                  label: Ce,
                  checkable: !0,
                  id: 'WeakMagnet',
                  category: 'functionActions',
                  checked: l.value() && r.value() === me.MagnetMode.WeakMagnet,
                  icon: ge.drawingToolsIcons.magnet,
                  onExecute: () => {
                    l.value() && r.value() === me.MagnetMode.WeakMagnet
                      ? (0, pe.setIsMagnetEnabled)(!1)
                      : (0, pe.setMagnetMode)(me.MagnetMode.WeakMagnet)
                  },
                }),
              ),
              t.push(
                new q({
                  label: Me,
                  checkable: !0,
                  id: 'StrongMagnet',
                  category: 'functionActions',
                  checked:
                    l.value() && r.value() === me.MagnetMode.StrongMagnet,
                  icon: ge.drawingToolsIcons.strongMagnet,
                  onExecute: () => {
                    l.value() && r.value() === me.MagnetMode.StrongMagnet
                      ? (0, pe.setIsMagnetEnabled)(!1)
                      : (0, pe.setMagnetMode)(me.MagnetMode.StrongMagnet)
                  },
                }),
              ),
              t
            )
          })(e),
          g = ((e) => {
            const t = []
            return (
              Q.enabled('header_widget') &&
                Q.enabled('header_compare') &&
                t.push(
                  new q({
                    icon: n(301393),
                    label: (0, F.appendEllipsis)(r.t(null, void 0, n(190069))),
                    id: 'Compare',
                    category: 'functionActions',
                    onExecute: () => e.toggleCompareOrAdd(),
                  }),
                ),
              Q.enabled('header_widget') &&
                Q.enabled('header_indicators') &&
                t.push(
                  new q({
                    icon: n(139681),
                    label: (0, F.appendEllipsis)(r.t(null, void 0, n(864642))),
                    id: 'InsertIndicator',
                    category: 'functionActions',
                    onExecute: () => {
                      e.showIndicators([])
                    },
                    shortcutHint: e.options().indicatorsDialogShortcutEnabled
                      ? (0, h.humanReadableHash)(47)
                      : void 0,
                  }),
                ),
              Q.enabled('show_object_tree') &&
                t.push(
                  new q({
                    icon: n(430192),
                    label: r.t(null, void 0, n(755149)),
                    id: 'OpenObjectsTreeInRightPanel',
                    category: 'functionActions',
                    onExecute: () => e.showObjectsTreePanelOrDialog(),
                  }),
                ),
              Q.enabled('header_widget') &&
                Q.enabled('header_settings') &&
                t.push(
                  new q({
                    label: (0, F.appendEllipsis)(r.t(null, void 0, n(389517))),
                    icon: n(951983),
                    id: 'ChartProperties',
                    category: 'functionActions',
                    onExecute: () => {
                      e.showGeneralChartProperties()
                    },
                  }),
                ),
              Q.enabled('header_widget') &&
                Q.enabled('header_symbol_search') &&
                t.push(
                  new q({
                    icon: n(969859),
                    label: (0, F.appendEllipsis)(r.t(null, void 0, n(128089))),
                    id: 'ChangeSymbol',
                    category: 'functionActions',
                    onExecute: () => {
                      ;(0, De.showDefaultSearchDialog)({
                        defaultValue: '',
                        trackResultsOptions: void 0,
                      })
                    },
                  }),
                ),
              Q.enabled('symbol_info') &&
                t.push(
                  new q({
                    label: (0, F.appendEllipsis)(r.t(null, void 0, n(112014))),
                    icon: n(437924),
                    id: 'SymbolInfo',
                    category: 'functionActions',
                    onExecute: () => {
                      {
                        const t = e.model().model(),
                          n = t.mainSeries().symbolInfo(),
                          o = t.availableUnits(),
                          i = {
                            symbolInfo: n,
                            showUnit: t.unitConversionEnabled(),
                            unitDescription: (e) => (e ? o.description(e) : ''),
                            dateFormatter: t.dateFormatter(),
                          }
                        return void (0, ke.showSymbolInfoDialog)(i)
                      }
                    },
                  }),
                ),
              e.options().goToDateEnabled &&
                t.push(
                  new q({
                    label: (0, F.appendEllipsis)(r.t(null, void 0, n(40803))),
                    icon: n(290752),
                    id: 'GoToDate',
                    category: 'functionActions',
                    onExecute: () => {
                      ;(0, Ae.showGoToDateDialog)(e)
                    },
                    shortcutHint: (0, h.humanReadableHash)(
                      h.Modifiers.Alt + 71,
                    ),
                  }),
                ),
              t
            )
          })(e)
        u.push(...v, ...m, ...g), p && u.push(...p)
        const b = e.model().mainSeries(),
          f = b.priceScale(),
          w = b.properties().childs(),
          _ =
            null === (o = (t = e.model()).paneForSource) || void 0 === o
              ? void 0
              : o.call(t, b)
        u.push(
          new q({
            id: 'ResetPriceScale',
            category: 'functionActions',
            label: r.t(null, void 0, n(445417)),
            icon: n(139267),
            onExecute: () => {
              _ && e.model().resetPriceScale(_, f)
            },
            shortcutHint: (0, h.humanReadableHash)(h.Modifiers.Alt + 82),
          }),
        ),
          u.push(new Te(e.model())),
          u.push(new He(e.model())),
          u.push(new Ie(e.model()))
        const y = f.isLockScale(),
          S = 6 === w.style.value()
        u.push(
          new q({
            label: r.t(null, void 0, n(131273)),
            checkable: !0,
            id: 'SetRegularSessionId',
            category: 'functionActions',
            disabled: Boolean(
              'regular' ===
                (null === (i = b.symbolInfo()) || void 0 === i
                  ? void 0
                  : i.subsession_id),
            ),
            onExecute: () => {
              e.model().setProperty(w.sessionId, 'regular', Oe)
            },
            checked: Boolean(
              'regular' ===
                (null === (s = b.symbolInfo()) || void 0 === s
                  ? void 0
                  : s.subsession_id),
            ),
          }),
        ),
          u.push(
            new q({
              label: r.t(null, void 0, n(488318)),
              checkable: !0,
              id: 'SetExtendedSessionId',
              category: 'functionActions',
              disabled: !(null ===
                (l =
                  null === (a = b.symbolInfo()) || void 0 === a
                    ? void 0
                    : a.subsessions) || void 0 === l
                ? void 0
                : l.some((e) => !e.private && 'extended' === e.id)),
              onExecute: () => {
                var t
                const n =
                  'extended' ===
                  (null === (t = b.symbolInfo()) || void 0 === t
                    ? void 0
                    : t.subsession_id)
                    ? 'regular'
                    : 'extended'
                e.model().setProperty(w.sessionId, n, Oe)
              },
              checked: Boolean(
                'extended' ===
                  (null === (c = b.symbolInfo()) || void 0 === c
                    ? void 0
                    : c.subsession_id),
              ),
            }),
          ),
          u.push(
            new q({
              label: r.t(null, void 0, n(495667)),
              checkable: !0,
              id: 'ToggleLockScale',
              category: 'settingsActions',
              onExecute: () => {
                e.model().togglePriceScaleLockScaleMode(
                  e.model().mainSeries().priceScale(),
                )
              },
              checked: f.isLockScale(),
            }),
          ),
          u.push(
            new q({
              label: r.t(null, void 0, n(520062)),
              checkable: !0,
              id: 'ToggleIndexedTo100',
              category: 'settingsActions',
              onExecute: () => {
                f.isIndexedTo100()
                  ? e
                      .model()
                      .setPriceScaleRegularScaleMode(
                        e.model().mainSeries().priceScale(),
                      )
                  : e
                      .model()
                      .togglePriceScaleIndexedTo100ScaleMode(
                        e.model().mainSeries().priceScale(),
                      )
              },
              disabled: y || S,
              checked: f.isIndexedTo100(),
            }),
          ),
          u.push(
            new q({
              id: 'AutoFitsToScreen',
              category: 'settingsActions',
              label: r.t(null, void 0, n(328020)),
              checkable: !0,
              onExecute: () => {
                e.model().togglePriceScaleAutoScaleMode(f)
              },
              checked: f.isAutoScale(),
              disabled: f.properties().childs().autoScaleDisabled.value(),
            }),
          ),
          u.push(
            new q({
              label: r.t(null, { context: 'scale_menu' }, n(172116)),
              checkable: !0,
              id: 'ToggleRegularScale',
              category: 'settingsActions',
              onExecute: () => {
                e.model().setPriceScaleRegularScaleMode(f)
              },
              disabled: y || S || f.isRegular(),
              checked: f.isRegular(),
            }),
          )
        const x = e.model().model().priceScaleSlotsCount(),
          E = 0 === x.left
        u.push(
          new q({
            label: E
              ? r.t(null, void 0, n(19567))
              : r.t(null, void 0, n(576300)),
            id: 'MoveScaleToSide',
            category: 'functionActions',
            disabled: x.left + x.right !== 1,
            onExecute: () => {
              e.model().mergeAllScales(E ? 'left' : 'right')
            },
          }),
        ),
          u.push(
            new q({
              label: r.t(null, void 0, n(678633)),
              id: 'MergeAllScalesToLeft',
              category: 'functionActions',
              disabled: x.left + x.right === 1,
              onExecute: () => {
                e.model().mergeAllScales('left')
              },
            }),
          ),
          u.push(
            new q({
              label: r.t(null, void 0, n(300308)),
              id: 'MergeAllScalesToRight',
              category: 'functionActions',
              disabled: x.left + x.right === 1,
              onExecute: () => {
                e.model().mergeAllScales('right')
              },
            }),
          ),
          u.push(
            new q({
              label: r.t(null, void 0, n(204037)),
              checkable: !0,
              checked: te.addPlusButtonProperty.value(),
              id: 'ToggleAddOrderPlusButton',
              category: 'settingsActions',
              onExecute: () => {
                e.model().setProperty(
                  te.addPlusButtonProperty,
                  !te.addPlusButtonProperty.value(),
                  Ne,
                )
              },
            }),
          )
        const C = e.properties().childs().scalesProperties.childs(),
          M = w.showCountdown
        u.push(
          new q({
            label: r.t(null, void 0, n(418511)),
            checkable: !0,
            id: 'ToggleCountdown',
            category: 'settingsActions',
            checked: M.value(),
            onExecute: () => {
              e.model().setProperty(M, !M.value(), Pe)
            },
          }),
        )
        const k = C.scaleSeriesOnly
        u.push(
          new q({
            label: r.t(null, void 0, n(535264)),
            checkable: !0,
            id: 'ScalePriceChartOnly',
            category: 'settingsActions',
            checked: k.value(),
            onExecute: () => {
              e.model().setProperty(k, !k.value(), Re)
            },
          }),
        )
        const A = C.showSeriesLastValue
        u.push(
          new q({
            label: r.t(null, void 0, n(678001)),
            checkable: !0,
            id: 'ToggleSymbolLastValue',
            category: 'settingsActions',
            checked: A.value(),
            onExecute: () => {
              e.model().setProperty(A, !A.value(), ze)
            },
          }),
        )
        const D = w.highLowAvgPrice.childs()
        u.push(
          new q({
            label: r.t(null, void 0, n(953150)),
            checkable: !0,
            id: 'ToggleHighLowPriceLabels',
            category: 'settingsActions',
            checked: D.highLowPriceLabelsVisible.value(),
            onExecute: () => {
              e.model().setProperty(
                D.highLowPriceLabelsVisible,
                !D.highLowPriceLabelsVisible.value(),
                Fe,
              )
            },
          }),
        ),
          Le &&
            u.push(
              new q({
                label: r.t(null, void 0, n(8975)),
                checkable: !0,
                id: 'ToggleAverageClosePriceLabel',
                category: 'settingsActions',
                checked: D.averageClosePriceLabelVisible.value(),
                onExecute: () => {
                  const t = !D.averageClosePriceLabelVisible.value()
                  e.model().setProperty(D.averageClosePriceLabelVisible, t, Be)
                },
              }),
            )
        const T = C.showSymbolLabels
        u.push(
          new q({
            label: r.t(null, void 0, n(679791)),
            checkable: !0,
            id: 'ToggleSymbolLabels',
            category: 'settingsActions',
            checked: T.value(),
            onExecute: () => {
              e.model().setProperty(T, !T.value(), Ue)
            },
          }),
        )
        const H = (0, ne.combineProperty)(
          (e, t) => e || t,
          C.showStudyLastValue.weakReference(),
          C.showFundamentalLastValue.weakReference(),
        )
        u.push(
          new q({
            label: r.t(null, void 0, n(581584)),
            checkable: !0,
            id: 'ToggleStudyLastValue',
            category: 'settingsActions',
            checked: H.value(),
            onExecute: () => {
              const t = !H.value()
              e.model().beginUndoMacro(We),
                e.model().setProperty(C.showStudyLastValue, t, null),
                e.model().setProperty(C.showFundamentalLastValue, t, null),
                e.model().endUndoMacro()
            },
            onDestroy: () => {
              H.destroy()
            },
          }),
        )
        const I = (0, ne.combineProperty)(
          (e, t) => e || t,
          C.showStudyPlotLabels.weakReference(),
          C.showFundamentalNameLabel.weakReference(),
        )
        u.push(
          new q({
            label: r.t(null, void 0, n(531485)),
            checkable: !0,
            id: 'ToggleIndicatorsLabels',
            category: 'settingsActions',
            checked: I.value(),
            onExecute: () => {
              e.model().beginUndoMacro(Ve)
              const t = !I.value()
              e.model().setProperty(C.showStudyPlotLabels, t, null),
                e.model().setProperty(C.showFundamentalNameLabel, t, null),
                e.model().endUndoMacro()
            },
            onDestroy: () => {
              I.destroy()
            },
          }),
        )
        {
          const t = C.showSeriesPrevCloseValue
          u.push(
            new q({
              label: r.t(null, void 0, n(324558)),
              checkable: !0,
              id: 'ToggleSymbolPrevCloseValue',
              category: 'settingsActions',
              checked: t.value(),
              disabled: e.model().mainSeries().isDWM(),
              onExecute: () => {
                e.model().setProperty(t, !t.value(), Xe)
              },
            }),
          )
          const o = C.showBidAskLabels
          u.push(
            new q({
              label: r.t(null, void 0, n(661617)),
              checkable: !0,
              id: 'ToggleBidAskLabels',
              category: 'settingsActions',
              checked: o.value(),
              onExecute: () => {
                e.model().setProperty(o, !o.value(), qe)
              },
            }),
          )
          const i = w.bidAsk.childs().visible
          u.push(
            new q({
              label: r.t(null, void 0, n(785466)),
              checkable: !0,
              id: 'ToggleBidAskLines',
              category: 'settingsActions',
              checked: i.value(),
              onExecute: () => {
                e.model().setProperty(i, !i.value(), Je)
              },
            }),
          )
        }
        u.push(
          new q({
            label: r.t(null, void 0, n(321803)),
            checkable: !0,
            id: 'ToggleHighLowPriceLines',
            category: 'settingsActions',
            checked: D.highLowPriceLinesVisible.value(),
            onExecute: () => {
              e.model().setProperty(
                D.highLowPriceLinesVisible,
                !D.highLowPriceLinesVisible.value(),
                Ze,
              )
            },
          }),
        ),
          Le &&
            u.push(
              new q({
                label: r.t(null, void 0, n(187899)),
                checkable: !0,
                id: 'ToggleAverageClosePriceLine',
                category: 'settingsActions',
                checked: D.averageClosePriceLineVisible.value(),
                onExecute: () => {
                  const t = !D.averageClosePriceLineVisible.value()
                  e.model().setProperty(D.averageClosePriceLineVisible, t, Ge)
                },
              }),
            )
        const L = w.showPriceLine
        u.push(
          new q({
            label: r.t(null, void 0, n(999530)),
            checkable: !0,
            id: 'TogglePriceLine',
            category: 'settingsActions',
            checked: L.value(),
            onExecute: () => {
              e.model().setProperty(L, !L.value(), je)
            },
          }),
        )
        const O = w.showPrevClosePriceLine
        u.push(
          new q({
            label: r.t(null, void 0, n(796032)),
            checkable: !0,
            id: 'ToggleSymbolPrevCloseLine',
            disabled: e.model().mainSeries().isDWM(),
            category: 'settingsActions',
            checked: O.value(),
            onExecute: () => {
              e.model().setProperty(O, !O.value(), Ke)
            },
          }),
        ),
          u.push(
            new q({
              label: r.t(null, void 0, n(275521)),
              icon: n(139267),
              id: 'ResetTimeScale',
              category: 'functionActions',
              onExecute: () => {
                e.model().resetTimeScale()
              },
              shortcutHint: (0, h.humanReadableHash)(
                h.Modifiers.Mod + h.Modifiers.Alt + 81,
              ),
            }),
          )
        const N = e
          .model()
          .model()
          .sessions()
          .properties()
          .childs()
          .graphics.childs()
          .vertlines.childs()
          .sessBreaks.childs().visible
        if (
          (u.push(
            new q({
              label: r.t(null, void 0, n(890417)),
              checkable: !0,
              id: 'ToggleSessionBreaks',
              category: 'settingsActions',
              disabled: e.model().mainSeries().isDWM(),
              checked: N.value(),
              onExecute: () => {
                e.model().setProperty(N, !N.value(), $e)
              },
            }),
          ),
          u.push(
            new q({
              label: r.t(null, void 0, n(634465)),
              icon: n(139267),
              id: 'ResetChart',
              category: 'functionActions',
              onExecute: () => e.GUIResetScales(),
              shortcutHint: (0, h.humanReadableHash)(h.Modifiers.Alt + 82),
            }),
          ),
          u.push(
            new q({
              icon: n(535149),
              label: r.t(null, void 0, n(420378)),
              id: 'RemoveAllIndicators',
              category: 'functionActions',
              onExecute: () => e.removeAllStudies(),
            }),
          ),
          u.push(
            new q({
              icon: n(535149),
              label: r.t(null, void 0, n(376091)),
              id: 'RemoveAllDrawingTools',
              category: 'functionActions',
              onExecute: () => e.removeAllDrawingTools(),
            }),
          ),
          u.push(
            new q({
              icon: n(535149),
              label: r.t(null, void 0, n(457869)),
              id: 'RemoveAllIndicatorsAndDrawingTools',
              category: 'functionActions',
              onExecute: () => e.removeAllStudiesDrawingTools(),
            }),
          ),
          u.push(
            new q({
              label: r.t(null, void 0, n(595480)),
              id: 'ApplyIndicatorsToAllCharts',
              category: 'functionActions',
              disabled: !e.applyIndicatorsToAllChartsAvailable(),
              onExecute: () => {
                e.chartWidgetCollection().applyIndicatorsToAllCharts(e)
              },
            }),
          ),
          Q.enabled('header_widget') &&
            Q.enabled('header_undo_redo') &&
            (u.push(
              new q({
                id: 'Undo',
                category: 'functionActions',
                icon: n(377665),
                label: r.t(null, void 0, n(881320)),
                onExecute: () => {
                  e.model().undoHistory().undo()
                },
                disabled: e.model().undoHistory().undoStack().isEmpty(),
                shortcutHint: (0, h.humanReadableHash)(h.Modifiers.Mod + 90),
              }),
            ),
            u.push(
              new q({
                id: 'Redo',
                category: 'functionActions',
                icon: n(796052),
                label: r.t(null, void 0, n(641615)),
                onExecute: () => {
                  e.model().undoHistory().redo()
                },
                disabled: e.model().undoHistory().redoStack().isEmpty(),
                shortcutHint: (0, h.humanReadableHash)(h.Modifiers.Mod + 89),
              }),
            )),
          u.push(
            new q({
              label: r.t(null, void 0, n(622221)),
              id: 'MoveChartRight',
              category: 'functionActions',
              disabled: !e.chartWidgetCollection().activeChartCanBeMoved(),
              onExecute: () => {
                e.chartWidgetCollection().moveActiveChartWithUndo(!1)
              },
            }),
          ),
          u.push(
            new q({
              label: r.t(null, void 0, n(56854)),
              id: 'MoveChartLeft',
              category: 'functionActions',
              disabled: !e.chartWidgetCollection().activeChartCanBeMoved(),
              onExecute: () => {
                e.chartWidgetCollection().moveActiveChartWithUndo(!0)
              },
            }),
          ),
          Q.enabled('header_widget') && Q.enabled('header_chart_type'))
        ) {
          const t = (0, oe.allChartStyles)()
          for (const n of t)
            u.push(
              new q({
                id: `ChartStyle_${n}`,
                category: 'functionActions',
                disabled: !(null ===
                  (d = R.linking.supportedChartStyles.value()) || void 0 === d
                  ? void 0
                  : d.includes(n)),
                onExecute: () => {
                  e.chartWidgetCollection().setChartStyleToWidget(n)
                },
                icon: ie.SERIES_ICONS[n],
                label: Ye[n],
              }),
            )
        }
        return (
          Q.enabled('header_widget') &&
            Q.enabled('header_fullscreen_button') &&
            u.push(
              new q({
                label: r.t(null, void 0, n(811682)),
                id: 'Fullscreen mode',
                icon: n(849697),
                category: 'functionActions',
                checkable: !0,
                checked: e.chartWidgetCollection().fullscreen().value(),
                disabled: !e.chartWidgetCollection().fullscreenable().value(),
                onExecute: () => {
                  const t = e.chartWidgetCollection()
                  t.fullscreen().value()
                    ? t.exitFullscreen()
                    : t.startFullscreen()
                },
                shortcutHint: (0, h.humanReadableHash)(h.Modifiers.Shift + 70),
              }),
            ),
          u
        )
      }
      var et = n(110495),
        tt = n(526122),
        nt = n(907815)
      function ot() {
        return nt.lineToolsFlat.map((e) =>
          ((e) => {
            var t
            const o = tt.lineToolsInfo[e],
              i =
                null === (t = o.selectHotkey) || void 0 === t ? void 0 : t.hash,
              s = {
                id: e,
                category: 'drawingsActions',
                label: o.localizedName,
                icon: o.icon,
                shortcutHint: i ? (0, h.humanReadableHash)(i) : void 0,
                payload: e,
                onExecute: () => ve.tool.setValue(e),
                favourite: et.LinetoolsFavoritesStore.isFavorite(e),
                onFavouriteClick: (t) => {
                  t.preventDefault(),
                    et.LinetoolsFavoritesStore.isFavorite(e)
                      ? et.LinetoolsFavoritesStore.removeFavorite(e)
                      : et.LinetoolsFavoritesStore.addFavorite(e)
                },
              }
            return (
              e.toLowerCase().includes('fib') &&
                (s.aliases = [r.t(null, void 0, n(922305))]),
              new q(s)
            )
          })(e.name),
        )
      }
      var it = n(344955)
      n(930202)
      const st = () => {
        const e = new q({
            id: 'ManageLayoutDrawings',
            category: 'functionActions',
            icon: n(881111),
            label: (0, F.appendEllipsis)(r.t(null, void 0, n(72357))),
            onExecute: () => (0, it.showManageDrawingsDialog)(),
          }),
          t =
            Q.enabled('right_toolbar') && Q.enabled('multiple_watchlists')
              ? new q({
                  id: 'CreateNewWatchlist',
                  category: 'functionActions',
                  label: (0, F.appendEllipsis)(r.t(null, void 0, n(772248))),
                  icon: n(845437),
                  onExecute: () => {
                    Q.enabled('multiple_watchlists') &&
                      (() => {
                        const e = U()
                        e && e.createNewList()
                      })()
                  },
                })
              : null,
          o = Q.enabled('left_toolbar') ? [...ot(), e] : []
        return (
          Q.enabled('right_toolbar') &&
            Q.enabled('multiple_watchlists') &&
            o.push((0, Z.ensureNotNull)(t)),
          o
        )
      }
      var at = n(33290)
      class lt extends a.DialogRenderer {
        constructor() {
          super(),
            (this._actions = []),
            (this.show = (e) => {
              ;(async (e) => {
                var t
                const o = [],
                  [i, s, a, l, c] = await Promise.all([
                    Qe(e),
                    Q.enabled('items_favoriting')
                      ? (0, V.getFavoriteDrawingToolbarPromise)()
                      : Promise.resolve(null),
                    Promise.resolve(null),
                    Promise.resolve(null),
                    Promise.resolve(null),
                  ])
                o.push(...i),
                  s &&
                    o.push(
                      new q({
                        id: 'ToggleFavoriteDrawingsToolbar',
                        category: 'settingsActions',
                        checkable: !0,
                        disabled: !s.canBeShown().value(),
                        checked: s.isVisible(),
                        label: r.t(null, void 0, n(149616)),
                        onExecute: () => {
                          s.isVisible() ? s.hide() : s.show()
                        },
                      }),
                    )
                const d = e.chartWidgetCollection()
                if (
                  Q.enabled('header_widget') &&
                  Q.enabled('header_resolutions')
                ) {
                  const t = {
                    label: (0, F.appendEllipsis)(r.t(null, void 0, n(508353))),
                    id: 'ChangeInterval',
                    category: 'functionActions',
                    onExecute: () => {
                      ;(0, z.showChangeIntervalDialogAsync)({
                        initVal: R.linking.interval.value(),
                        selectOnInit: !0,
                      })
                    },
                  }
                  !Q.enabled('show_interval_dialog_on_key_press') ||
                    e.readOnly() ||
                    e.options().hideSymbolSearch ||
                    (t.shortcutHint = (0, h.humanReadableHash)(188)),
                    o.push(new q(t))
                }
                if (
                  Q.enabled('header_widget') &&
                  Q.enabled('header_saveload')
                ) {
                  const t = new B.LoadChartService(d)
                  o.push(
                    new q({
                      id: 'LoadChartLayout',
                      category: 'functionActions',
                      label: (0, F.appendEllipsis)(
                        r.t(null, void 0, n(975687)),
                      ),
                      onExecute: () => {
                        t.showLoadDialog()
                      },
                      shortcutHint: r.t(null, { context: 'hotkey' }, n(214229)),
                    }),
                  )
                  const i = e.getSaveChartService()
                  i &&
                    (o.push(
                      new q({
                        id: 'RenameChartLayout',
                        category: 'functionActions',
                        label: (0, F.appendEllipsis)(
                          r.t(null, void 0, n(204142)),
                        ),
                        onExecute: () => {
                          i.renameChart()
                        },
                      }),
                    ),
                    o.push(
                      new q({
                        id: 'SaveChartLayout',
                        category: 'functionActions',
                        icon: n(53707),
                        label: (0, F.appendEllipsis)(
                          r.t(null, void 0, n(162571)),
                        ),
                        disabled: !i.hasChanges(),
                        onExecute: () => {
                          i.saveChartOrShowTitleDialog()
                        },
                        shortcutHint: (0, h.humanReadableHash)(
                          h.Modifiers.Mod + 83,
                        ),
                      }),
                    ))
                }
                return (
                  o.push(
                    new q({
                      id: 'TakeSnapshot',
                      category: 'functionActions',
                      icon: n(272644),
                      label: r.t(null, void 0, n(715803)),
                      onExecute: () => d.takeServerScreenshot(),
                      shortcutHint: (0, h.humanReadableHash)(
                        h.Modifiers.Alt + 83,
                      ),
                    }),
                  ),
                  Q.enabled('right_toolbar') &&
                    o.push(
                      new q({
                        label: r.t(null, void 0, n(669707)),
                        icon: n(152493),
                        id: 'OpenWatchlistInRightPanel',
                        category: 'functionActions',
                        onExecute: () => {
                          window.widgetbar &&
                            window.widgetbar.isVisible() &&
                            window.widgetbar.setPage('base')
                        },
                      }),
                    ),
                  Q.enabled('right_toolbar') &&
                    Q.enabled('add_to_watchlist') &&
                    o.push(
                      new j({
                        label: r
                          .t(null, void 0, n(617591))
                          .format({ symbol: e.getSymbol(!0) }),
                        icon: n(833366),
                        id: 'AddToWatchlist',
                        category: 'functionActions',
                        onExecute: () => {
                          ;(0, W.runOrSigninWithFeature)(
                            () => {
                              const t = U()
                              t && t.addSymbols([e.symbolWV().value()])
                            },
                            {
                              feature: 'watchList',
                              source: 'add symbol to watchlist',
                            },
                          )
                        },
                        shortcutHint: (0, h.humanReadableHash)(
                          h.Modifiers.Alt + 87,
                        ),
                        disabled: !1,
                      }),
                    ),
                  o.push(
                    new q({
                      icon: n(709210),
                      label: r.t(null, void 0, n(646445)),
                      shortcutHint: (0, h.humanReadableHash)(
                        h.Modifiers.Alt + 68,
                      ),
                      id: 'OpenDataWindowInRightPanel',
                      category: 'functionActions',
                      disabled: !(null === (t = window.widgetbar) ||
                      void 0 === t
                        ? void 0
                        : t.isVisible()),
                      onExecute: Y.showChartObjectsWidget,
                    }),
                  ),
                  o
                )
              })(this._activeChartWidget).then((t) => {
                ;(this._actions = t.concat(st()).sort(K)),
                  i.render(
                    o.createElement(P, {
                      shouldReturnFocus:
                        null == e ? void 0 : e.shouldReturnFocus,
                      dialogId: 'globalSearch',
                      items: this._actions,
                      onClose: this.hide,
                    }),
                    this._container,
                  ),
                  this._setVisibility(!0)
              })
            }),
            (this.hide = () => {
              i.unmountComponentAtNode(this._container), this._setVisibility(!1)
              for (const e of this._actions) e.destroy()
            })
          const e = (0, at.service)(s.CHART_WIDGET_COLLECTION_SERVICE)
          this._activeChartWidget = e.activeChartWidget.value()
        }
      }
    },
    26845: (e, t, n) => {
      n.d(t, { useKeyboardNavigation: () => s })
      var o = n(50959),
        i = n(180185)
      function s(e, t, n, s = 'keydown') {
        const [a, l] = (0, o.useState)(-1)
        return (
          (0, o.useEffect)(() => {
            if (!e) return
            const n = (e) => {
              switch ((0, i.hashFromEvent)(e)) {
                case 40:
                  if (a === t.length - 1) break
                  e.preventDefault(), l(a + 1)
                  break
                case 38:
                  if (a <= 0) break
                  e.preventDefault(), l(a - 1)
                  break
              }
            }
            return (
              e.addEventListener('keydown', n),
              () => {
                e.removeEventListener('keydown', n)
              }
            )
          }, [e, a, t]),
          (0, o.useEffect)(() => {
            if (!e || !n) return
            const o = (e) => {
              var o
              e.repeat ||
                (13 === (0, i.hashFromEvent)(e) &&
                  n(null !== (o = t[a]) && void 0 !== o ? o : null, e))
            }
            return (
              e.addEventListener(s, o),
              () => {
                e.removeEventListener(s, o)
              }
            )
          }, [e, a, t, n, s]),
          { activeIdx: a, setActiveIdx: l }
        )
      }
    },
    116491: (e, t, n) => {
      n.d(t, { useResetActiveIdx: () => i })
      var o = n(50959)
      function i(e, t = []) {
        ;(0, o.useEffect)(() => {
          e(-1)
        }, [...t])
      }
    },
    855417: (e, t, n) => {
      n.d(t, { useScrollToRef: () => i })
      var o = n(50959)
      function i(e, t) {
        ;(0, o.useEffect)(() => {
          var n
          t >= 0 &&
            (null === (n = e.current) ||
              void 0 === n ||
              n.scrollIntoView({ block: 'nearest' }))
        }, [t])
      }
    },
    344955: (e, t, n) => {
      n.d(t, { showManageDrawingsDialog: () => i })
      let o = null
      function i(e) {
        return Promise.all([n.e(4781), n.e(9465), n.e(7413), n.e(1702)])
          .then(n.bind(n, 305624))
          .then((t) => {
            const n = new (0, t.ManageDrawingsDialogRenderer)(e)
            return null !== o && o.hide(), n.show(), (o = n), n
          })
      }
    },
    113060: (e, t, n) => {
      n.d(t, { SymbolSearchWatchlistContext: () => o })
      const o = n(50959).createContext(null)
    },
    63192: (e, t, n) => {
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
    190266: (e, t, n) => {
      n.d(t, { runOrSignIn: () => o, runOrSignInWithPromo: () => i })
      function o(e, t) {
        e()
      }
      function i(e, t, n) {
        n()
      }
    },
    879091: (e, t, n) => {
      n.d(t, { ContextMenuAction: () => y })
      var o = n(50959),
        i = n(650151),
        s = n(820883),
        a = n(370981),
        l = n(32133),
        r = n(730743),
        c = n(823030),
        h = n(497754),
        d = n.n(h),
        u = n(234404),
        v = n(194646),
        p = n(351331)
      function m(e) {
        const { size: t = 'normal' } = e
        return o.createElement(v.ContextMenuItem, {
          size: t,
          jsxLabel: o.createElement(
            'div',
            { className: d()(p.loaderWrap, p[t]) },
            o.createElement(u.Loader, { className: p.loader }),
          ),
          noInteractive: !0,
          onMouseOver: e.onMouseOver,
        })
      }
      var g = n(930202),
        b = n(865266),
        f = n(892932),
        w = n(844445)
      const _ = (0, o.forwardRef)((e, t) => {
        const { className: n, ...i } = e,
          [s, a] = (0, b.useRovingTabindexElement)(t)
        return o.createElement(v.ContextMenuItem, {
          ...i,
          className: d()(f.PLATFORM_ACCESSIBILITY_ENABLED && w.accessible, n),
          reference: s,
          tabIndex: a,
          onKeyDown: (e) => {
            if (
              !f.PLATFORM_ACCESSIBILITY_ENABLED ||
              e.target !== e.currentTarget
            )
              return
            const t = (0, g.hashFromEvent)(e)
            ;(13 !== t && 32 !== t) ||
              (e.preventDefault(),
              s.current instanceof HTMLElement && s.current.click())
          },
          'data-role': f.PLATFORM_ACCESSIBILITY_ENABLED ? 'menuitem' : void 0,
          'aria-disabled':
            (f.PLATFORM_ACCESSIBILITY_ENABLED && e.disabled) || void 0,
        })
      })
      class y extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._itemRef = null),
            (this._menuElementRef = o.createRef()),
            (this._menuRef = null),
            (this._handleClick = (e) => {
              e.isDefaultPrevented() ||
                this.state.disabled ||
                (this._hasSubItems()
                  ? this._showSubMenu()
                  : (this.state.doNotCloseOnClick || (0, a.globalCloseMenu)(),
                    this.props.action.execute(),
                    this._trackEvent(),
                    this.props.onExecute &&
                      this.props.onExecute(this.props.action)))
            }),
            (this._handleClickToolbox = () => {
              ;(0, a.globalCloseMenu)()
            }),
            (this._handleItemMouseOver = () => {
              this._showSubMenu(), this._setCurrentContextValue()
            }),
            (this._handleMenuMouseOver = () => {
              this._setCurrentContextValue()
            }),
            (this._showSubMenu = () => {
              this.props.onShowSubMenu(this.props.action)
            }),
            (this._calcSubMenuPos = (e) =>
              (0, r.calcSubMenuPos)(e.contentWidth, this._itemRef)),
            (this._updateState = (e) => {
              this.setState(e.getState())
            }),
            (this._setItemRef = (e) => {
              this._itemRef = e
            }),
            (this._handleMenuRef = (e) => {
              this._menuRef = e
            }),
            (this._registerSubmenu = () => {
              var e
              return null === (e = this.context) || void 0 === e
                ? void 0
                : e.registerSubmenu(
                    this.props.action.id,
                    (e) =>
                      (0, i.ensureNotNull)(this._itemRef).contains(e) ||
                      (null !== this._menuElementRef.current &&
                        this._menuElementRef.current.contains(e)),
                  )
            }),
            (this.state = { ...this.props.action.getState() })
        }
        componentDidMount() {
          this.props.action.onUpdate().subscribe(this, this._updateState),
            this.state.subItems.length &&
              (this._unsubscribe = this._registerSubmenu()),
            this.props.reference &&
              (this._itemRef = this.props.reference.current)
        }
        componentDidUpdate(e, t) {
          var n, o, i
          t.loading !== this.state.loading &&
            (null === (o = (n = this.props).onRequestUpdate) ||
              void 0 === o ||
              o.call(n)),
            0 === t.subItems.length &&
              this.state.subItems.length > 0 &&
              (this._unsubscribe = this._registerSubmenu()),
            t.subItems.length > 0 &&
              0 === this.state.subItems.length &&
              (null === (i = this._unsubscribe) ||
                void 0 === i ||
                i.call(this)),
            t.subItems !== this.state.subItems &&
              null !== this._menuRef &&
              this._menuRef.update()
        }
        componentWillUnmount() {
          this.props.action.onUpdate().unsubscribe(this, this._updateState),
            this._unsubscribe && this._unsubscribe()
        }
        render() {
          var e, t
          const n = (
            null === (e = this.context) || void 0 === e
              ? void 0
              : e.current
          )
            ? this.context.current === this.props.action.id
            : this.props.isSubMenuOpened
          return this.state.loading
            ? o.createElement(m, { size: this.state.size })
            : o.createElement(
                _,
                {
                  theme: this.props.theme,
                  ref:
                    null !== (t = this.props.reference) && void 0 !== t
                      ? t
                      : this._setItemRef,
                  onClick: this._handleClick,
                  onClickToolbox: this._handleClickToolbox,
                  onMouseOver: this._handleItemMouseOver,
                  hovered: n,
                  hasSubItems: this._hasSubItems(),
                  actionName: this.state.name,
                  checkboxInput: this.props.checkboxInput,
                  selected: this.props.selected,
                  ...this.state,
                },
                o.createElement(s.ContextMenu, {
                  isOpened: n,
                  items: this.state.subItems,
                  position: this._calcSubMenuPos,
                  menuStatName: this.props.menuStatName,
                  parentStatName: this._getStatName(),
                  menuElementReference: this._menuElementRef,
                  onMouseOver: this.state.subItems.length
                    ? this._handleMenuMouseOver
                    : void 0,
                  ref: this._handleMenuRef,
                }),
              )
        }
        _setCurrentContextValue() {
          var e
          this.state.subItems.length &&
            (null === (e = this.context) ||
              void 0 === e ||
              e.setCurrent(this.props.action.id))
        }
        _hasSubItems() {
          return this.state.subItems.length > 0
        }
        _trackEvent() {
          const e = this._getStatName()
          ;(0, l.trackEvent)(
            'ContextMenuClick',
            this.props.menuStatName || '',
            e,
          )
        }
        _getStatName() {
          return [this.props.parentStatName, this.state.statName]
            .filter((e) => Boolean(e))
            .join('.')
        }
      }
      y.contextType = c.SubmenuContext
    },
    194646: (e, t, n) => {
      n.d(t, {
        ContextMenuItem: () => w,
        DEFAUL_CONTEXT_MENU_ITEM_THEME: () => b,
      })
      var o = n(50959),
        i = n(497754),
        s = n(408323),
        a = n(601227),
        l = n(972535)
      var r = n(72621),
        c = n(577687),
        h = n(68620),
        d = n(76821),
        u = n(156963),
        v = n(800417),
        p = n(80802),
        m = n(214665),
        g = n(522436)
      const b = g,
        f = u.enabled('items_favoriting')
      class w extends o.PureComponent {
        constructor() {
          super(...arguments),
            (this._handleMouseOver = (e) => {
              ;((e) => {
                const t = e.sourceCapabilities
                let n = t && t.firesTouchEvents
                return void 0 === n && (n = l.touch), n
              })(e.nativeEvent) ||
                (this.props.onMouseOver && this.props.onMouseOver())
            }),
            (this._handleClickToolbox = (e) => {
              e.stopPropagation(),
                this.props.onClickToolbox && this.props.onClickToolbox()
            })
        }
        render() {
          const {
              hasSubItems: e,
              shortcutHint: t,
              hint: n,
              invisibleHotkey: s,
              favourite: l,
              theme: r = g,
              size: d = 'normal',
              onKeyDown: u,
              label: p,
              jsxLabel: b,
              styledLabel: w,
            } = this.props,
            _ =
              this.props.checkable && this.props.checkboxInput ? 'label' : 'div'
          return o.createElement(
            o.Fragment,
            null,
            o.createElement(
              'tr',
              {
                ...(0, v.filterDataProps)(this.props),
                ...(0, v.filterAriaProps)(this.props),
                className: i(
                  this.props.className,
                  r.item,
                  !this.props.noInteractive && r.interactive,
                  this.props.hovered && r.hovered,
                  this.props.disabled && r.disabled,
                  this.props.active && r.active,
                  this.props.selected && r.selected,
                  r[d],
                ),
                onClick: this.props.onClick,
                onMouseOver: this._handleMouseOver,
                ref: this.props.reference,
                'data-action-name': this.props.actionName,
                tabIndex: this.props.tabIndex,
                onKeyDown: u,
              },
              f &&
                void 0 !== l &&
                o.createElement(
                  'td',
                  null,
                  o.createElement(c.FavoriteButton, {
                    className: r.favourite,
                    isFilled: l,
                    onClick: this.props.onFavouriteClick,
                  }),
                ),
              o.createElement(
                'td',
                { className: i(r.iconCell), 'data-icon-cell': !0 },
                this._icon(r),
              ),
              o.createElement(
                'td',
                { className: r.contentCell },
                o.createElement(
                  _,
                  { className: r.content },
                  o.createElement(
                    'span',
                    {
                      className: i(r.label, this.props.checked && r.checked),
                      'data-label': !0,
                    },
                    !b && w
                      ? w.map(({ text: e, ...t }, n) =>
                          o.createElement('span', { key: n, style: t }, e),
                        )
                      : null != b
                        ? b
                        : p,
                  ),
                  this._toolbox(r),
                  e &&
                    o.createElement('span', {
                      className: r.arrowIcon,
                      dangerouslySetInnerHTML: { __html: m },
                      'data-submenu-arrow': !0,
                    }),
                  !e &&
                    t &&
                    !a.CheckMobile.any() &&
                    o.createElement(h.Hint, {
                      className: i(s && r.invisibleHotkey),
                      text: t,
                    }),
                  !e && !t && n && o.createElement(h.Hint, { text: n }),
                ),
              ),
            ),
            o.createElement(
              'tr',
              { className: r.subMenu },
              o.createElement('td', null, this.props.children),
            ),
          )
        }
        _icon(e) {
          if (this.props.checkable) {
            if (this.props.checkboxInput)
              return o.createElement(s.CheckboxInput, {
                className: i(e.icon, e.checkboxInput),
                checked: this.props.checked,
              })
            if (this.props.checked) {
              const t = !this.props.icon && !this.props.iconChecked,
                n = this.props.iconChecked || this.props.icon || p
              return o.createElement('span', {
                className: i(e.icon, t && e.checkmark),
                dangerouslySetInnerHTML: { __html: n },
                'data-icon-checkmark': t,
              })
            }
            return this.props.icon
              ? o.createElement('span', {
                  className: e.icon,
                  dangerouslySetInnerHTML: { __html: this.props.icon },
                })
              : o.createElement('span', { className: e.icon })
          }
          return this.props.icon
            ? o.createElement('span', {
                className: e.icon,
                dangerouslySetInnerHTML: { __html: this.props.icon },
              })
            : null
        }
        _toolbox(e) {
          return this.props.toolbox
            ? o.createElement(
                'span',
                {
                  className: i(
                    e.toolbox,
                    this.props.showToolboxOnHover && e.showToolboxOnHover,
                  ),
                  onClick: this._handleClickToolbox,
                  'data-toolbox': !0,
                },
                this._renderToolboxContent(),
              )
            : null
        }
        _renderToolboxContent() {
          return this.props.toolbox &&
            this.props.toolbox.type === d.ToolboxType.Delete
            ? o.createElement(r.RemoveButton, {
                onClick: this.props.toolbox.action,
              })
            : null
        }
      }
    },
    820883: (e, t, n) => {
      n.d(t, { ContextMenu: () => M, OverlapContextMenu: () => k })
      var o = n(50959),
        i = n(497754),
        s = n.n(i),
        a = n(874485),
        l = n(510618),
        r = n(738036),
        c = n(249161),
        h = n(800553),
        d = n(163694),
        u = n(930052),
        v = n(333927)
      function p(e) {
        return o.createElement('li', { className: v.separator })
      }
      var m = n(729624),
        g = n(759339),
        b = n(370981)
      function f(e) {
        var t
        const n =
            null !== (t = e.action.custom()) && void 0 !== t ? t : e.action,
          [i, s] = (0, o.useState)(() => n.getState()),
          [a, l] = (0, o.useState)(!1),
          r = !!i.subItems.length,
          c = r && a
        return (
          (0, o.useEffect)(() => {
            const e = () => s(n.getState())
            return (
              n.onUpdate().subscribe(null, e),
              () => {
                n.onUpdate().unsubscribe(null, e)
              }
            )
          }, []),
          o.createElement(
            m.ContextMenuItem,
            {
              ...i,
              onClick: (e) => {
                if (i.disabled || e.defaultPrevented) return
                if (r) return void l(!0)
                i.doNotCloseOnClick || (0, b.globalCloseMenu)()
                n.execute()
              },
              isLoading: i.loading,
              isHovered: c,
            },
            c &&
              o.createElement(
                g.Drawer,
                { onClose: h },
                o.createElement(y, {
                  items: i.subItems,
                  parentAction: n,
                  closeNested: h,
                }),
              ),
          )
        )
        function h(e) {
          e && e.preventDefault(), l(!1)
        }
      }
      var w = n(134064),
        _ = n(366493)
      function y(e) {
        const { items: t, parentAction: n, closeNested: i } = e,
          s =
            !Boolean(n) &&
            t.every(
              (e) =>
                !Boolean(
                  'separator' !== e.type &&
                    (e.getState().icon || e.getState().checkable),
                ),
            )
        return o.createElement(
          w.EmptyIconsContext.Provider,
          { value: s },
          o.createElement(
            'ul',
            null,
            n &&
              o.createElement(
                o.Fragment,
                null,
                o.createElement(m.ContextMenuItem, {
                  label: n.getState().label,
                  isTitle: !0,
                  active: !1,
                  disabled: !1,
                  subItems: [],
                  checkable: !1,
                  checked: !1,
                  doNotCloseOnClick: !1,
                  icon: _,
                  onClick: i,
                }),
                o.createElement(p, null),
              ),
            t.map((e) => {
              switch (e.type) {
                case 'action':
                  return o.createElement(f, { key: e.id, action: e })
                case 'separator':
                  return o.createElement(p, { key: e.id })
              }
            }),
          ),
        )
      }
      const S = o.createContext(null)
      var x = n(179807),
        E = n(892932),
        C = n(36002)
      class M extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._menuRef = o.createRef()),
            (this._handleRequestUpdate = () => {
              this.update()
            }),
            (this._handleClose = () => {
              this.props.onClose && this.props.onClose()
            }),
            (this._handleOutsideClickClose = (e) => {
              const { doNotCloseOn: t, onClose: n } = this.props
              !n || (void 0 !== t && t.contains(e.target)) || n()
            }),
            (this._handleFocusOnOpen = () => {
              var e, t
              ;(null === (e = this.props.menuElementReference) || void 0 === e
                ? void 0
                : e.current) &&
                this.props.takeFocus &&
                (null === (t = this.props.menuElementReference) ||
                  void 0 === t ||
                  t.current.focus({ preventScroll: !0 }))
            }),
            (this._handleFocus = (e) => {
              this.props.isKeyboardEvent &&
                e.target &&
                E.PLATFORM_ACCESSIBILITY_ENABLED &&
                (0, x.focusFirstMenuItem)(e.target)
            }),
            (this.state = {})
        }
        render() {
          const {
            isOpened: e,
            onClose: t,
            items: n,
            doNotCloseOn: i,
            menuStatName: a,
            parentStatName: v,
            takeFocus: p,
            ...m
          } = this.props
          return e
            ? o.createElement(
                d.DrawerManager,
                null,
                o.createElement(c.KeyboardDocumentListener, {
                  keyCode: 27,
                  eventType: 'keyup',
                  handler: this._handleClose,
                }),
                o.createElement(
                  u.MatchMedia,
                  { rule: 'screen and (max-width: 430px)' },
                  (t) =>
                    this._isDrawer(t)
                      ? o.createElement(
                          S.Provider,
                          { value: { type: 'drawer' } },
                          o.createElement(
                            g.Drawer,
                            {
                              onClose: this._handleClose,
                              position: 'Bottom',
                              'data-name': m['data-name'],
                            },
                            o.createElement(y, { items: n }),
                          ),
                        )
                      : o.createElement(
                          S.Provider,
                          { value: { type: 'menu' } },
                          o.createElement(
                            r.OutsideEvent,
                            {
                              handler: this._handleOutsideClickClose,
                              mouseDown: !0,
                              touchStart: !0,
                              reference: this.props.menuElementReference,
                            },
                            (t) =>
                              o.createElement(
                                l.Menu,
                                {
                                  ...m,
                                  reference: t,
                                  className: s()(C.menu, 'context-menu'),
                                  onClose: this._handleClose,
                                  noMomentumBasedScroll: !0,
                                  ref: this._menuRef,
                                  tabIndex: p ? -1 : void 0,
                                  onOpen: this._handleFocusOnOpen,
                                  onFocus: this._handleFocus,
                                  onKeyDown: x.handleAccessibleMenuKeyDown,
                                },
                                o.createElement(h.ActionsTable, {
                                  items: n,
                                  menuStatName: a,
                                  parentStatName: v,
                                  parentIsOpened: e,
                                  onRequestUpdate: this._handleRequestUpdate,
                                }),
                              ),
                          ),
                        ),
                ),
              )
            : null
        }
        update() {
          var e
          this._menuRef.current && this._menuRef.current.update(),
            this.props.isKeyboardEvent &&
              (null === (e = this.props.menuElementReference) || void 0 === e
                ? void 0
                : e.current) &&
              document.activeElement ===
                this.props.menuElementReference.current &&
              (0, x.focusFirstMenuItem)(this.props.menuElementReference.current)
        }
        _isDrawer(e) {
          return void 0 === this.props.mode ? e : 'drawer' === this.props.mode
        }
      }
      const k = (0, a.makeOverlapable)(M)
    },
    910549: (e, t, n) => {
      n.d(t, { PopupContext: () => o })
      const o = n(50959).createContext(null)
    },
    40766: (e, t, n) => {
      n.d(t, { PopupDialog: () => S })
      var o = n(50959),
        i = n(497754),
        s = n(650151),
        a = n(80137),
        l = n(874485),
        r = n(738036),
        c = n(44681)
      function h(e, t, n, o) {
        return e + t > o && (e = o - t), e < n && (e = n), e
      }
      function d(e) {
        return {
          x: (0, c.clamp)(e.x, 20, document.documentElement.clientWidth - 20),
          y: (0, c.clamp)(e.y, 20, window.innerHeight - 20),
        }
      }
      function u(e) {
        return { x: e.clientX, y: e.clientY }
      }
      function v(e) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
      class p {
        constructor(e, t, n = { boundByScreen: !0 }) {
          ;(this._drag = null),
            (this._canBeTouchClick = !1),
            (this._frame = null),
            (this._onMouseDragStart = (e) => {
              if (0 !== e.button || this._isTargetNoDraggable(e)) return
              e.preventDefault(),
                document.addEventListener('mousemove', this._onMouseDragMove),
                document.addEventListener('mouseup', this._onMouseDragEnd)
              const t = d(u(e))
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
              const t = d(v(e))
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
              const t = d(u(e))
              this._dragMove(t)
            }),
            (this._onTouchDragMove = (e) => {
              ;(this._canBeTouchClick = !1), e.preventDefault()
              const t = d(v(e))
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
            i = h(e, n.width, o ? 0 : -1 / 0, o ? window.innerWidth : 1 / 0),
            s = h(t, n.height, o ? 0 : -1 / 0, o ? window.innerHeight : 1 / 0)
          this._dialog.style.transform = `translate(${Math.round(i)}px, ${Math.round(s)}px)`
        }
        _isTargetNoDraggable(e) {
          return (
            e.target instanceof Element &&
            null !== e.target.closest('[data-disable-drag]')
          )
        }
      }
      const m = { vertical: 0 }
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
            (this._guard = t.guard || m),
            (this._calculateDialogPosition = t.calculateDialogPosition),
            (this._initialHeight = e.style.height),
            window.addEventListener('resize', this._handleResize)
        }
        updateOptions(e) {
          ;(this._guard = e.guard || m),
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
            i = e / 2 - n / 2
          return { x: Math.round(o), y: Math.round(i) }
        }
        recalculateBounds() {
          var e
          const { clientHeight: t, clientWidth: n } = document.documentElement,
            { vertical: o } = this._guard,
            i =
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
              i)
            ) {
              const { left: e, top: t, width: n, height: o } = i
              ;(this._dialog.style.transform = `translate(${Math.round(e)}px, ${Math.round(t)}px)`),
                n &&
                  ((this._dialog.style.width = `${n}px`),
                  (this._dialog.style.minWidth = 'unset')),
                o &&
                  ((this._dialog.style.height = `${o}px`),
                  (this._dialog.style.minHeight = 'unset'))
            }
          } else if (i) {
            const { left: e, top: t } = i
            this._dialog.style.transform = `translate(${Math.round(e)}px, ${Math.round(t)}px)`
          } else {
            ;(this._dialog.style.width = ''), (this._dialog.style.height = '')
            const e = this._dialog.getBoundingClientRect(),
              i = t - 2 * o,
              s = h(e.left, e.width, 0, n),
              a = h(e.top, e.height, o, t)
            ;(this._dialog.style.top = '0px'),
              (this._dialog.style.left = '0px'),
              (this._dialog.style.transform = `translate(${Math.round(s)}px, ${Math.round(a)}px)`),
              (this._dialog.style.height =
                i < e.height ? i + 'px' : this._initialHeight)
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
      var b = n(813113),
        f = n(910549),
        w = n(285089),
        _ = n(308326)
      _['tooltip-offset']
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
            f.PopupContext.Provider,
            { value: this },
            o.createElement(
              r.OutsideEvent,
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
                    a.Dialog,
                    {
                      style: this._applyAnimationCSSVariables(),
                      ...this.props,
                      reference: this._handleDialogRef,
                      className: i(_.dialog, this.props.className),
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
              const i = new p(o, e, {
                boundByScreen: Boolean(t),
                onDragStart: n,
              })
              this._cleanUpFunctions.push(() => i.destroy()), (this._drag = i)
            }
          }
          ;(this._prevActiveElement = document.activeElement),
            this.props.autofocus &&
              !o.contains(document.activeElement) &&
              o.focus(),
            (this._isFullScreen() || this.props.fixedBody) &&
              (0, w.setFixedBodyState)(!0)
          const { guard: i, calculateDialogPosition: a } = this.props
          if (this.props.resizeHandler) this._resize = this.props.resizeHandler
          else {
            const e = new g(o, { guard: i, calculateDialogPosition: a })
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
            (0, w.setFixedBodyState)(!1)
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
              this._dialog.classList.add(_.dialogAnimatedAppearance)
          }
        }
        _handleTooltipFit() {
          0
        }
        _isFullScreen() {
          return Boolean(this.props.fullscreen)
        }
      }
      ;(y.contextType = b.PortalContext),
        (y.defaultProps = {
          boundByScreen: !0,
          draggable: !0,
          centeredOnMount: !0,
          shouldReturnFocus: !0,
        })
      const S = (0, l.makeOverlapable)(y)
    },
    68620: (e, t, n) => {
      n.d(t, { Hint: () => l })
      var o = n(50959),
        i = n(497754),
        s = n.n(i),
        a = n(522436)
      function l(e) {
        const { text: t = '', className: n } = e
        return o.createElement('span', { className: s()(a.shortcut, n) }, t)
      }
    },
    729624: (e, t, n) => {
      n.d(t, { ContextMenuItem: () => p })
      var o = n(50959),
        i = n(497754),
        s = n.n(i),
        a = n(72571),
        l = n(234404),
        r = n(134064),
        c = n(68620),
        h = n(339750),
        d = n(379978),
        u = n(69311),
        v = n(829122)
      function p(e) {
        const {
            className: t,
            isTitle: n,
            isLoading: i,
            isHovered: p,
            active: m,
            checkable: g,
            disabled: b,
            checked: f,
            icon: w,
            iconChecked: _,
            hint: y,
            subItems: S,
            label: x,
            styledLabel: E,
            onClick: C,
            children: M,
            toolbox: k,
            jsxLabel: A,
            size: D = 'normal',
          } = e,
          T = (0, o.useContext)(r.EmptyIconsContext),
          H = !!S.length
        return i
          ? o.createElement(
              'li',
              { className: s()(t, v.item, v.loading, v[D]) },
              o.createElement(l.Loader, null),
            )
          : o.createElement(
              'li',
              {
                className: s()(
                  t,
                  v.item,
                  v.interactive,
                  n && v.title,
                  b && v.disabled,
                  p && v.hovered,
                  m && v.active,
                  T && v.emptyIcons,
                  v[D],
                ),
                onClick: C,
              },
              o.createElement(a.Icon, {
                className: s()(v.icon),
                icon: (() => {
                  if (g && f) return _ || w || h
                  return w
                })(),
              }),
              o.createElement(
                'span',
                { className: s()(v.label) },
                !A && E
                  ? E.map(({ text: e, ...t }, n) =>
                      o.createElement('span', { key: n, style: t }, e),
                    )
                  : null != A
                    ? A
                    : x,
              ),
              !!k &&
                o.createElement(a.Icon, {
                  onClick: () => {
                    k && k.action()
                  },
                  className: v.remove,
                  icon: u,
                }),
              !H &&
                y &&
                o.createElement(c.Hint, { className: v.shortcut, text: y }),
              H && o.createElement(a.Icon, { className: v.nested, icon: d }),
              M,
            )
      }
    },
    134064: (e, t, n) => {
      n.d(t, { EmptyIconsContext: () => o })
      const o = n(50959).createContext(!1)
    },
    163694: (e, t, n) => {
      n.d(t, { DrawerContext: () => a, DrawerManager: () => s })
      var o = n(50959),
        i = n(285089)
      class s extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._isBodyFixed = !1),
            (this._addDrawer = (e) => {
              this.setState((t) => ({ stack: [...t.stack, e] }))
            }),
            (this._removeDrawer = (e) => {
              this.setState((t) => ({ stack: t.stack.filter((t) => t !== e) }))
            }),
            (this.state = { stack: [] })
        }
        componentDidUpdate(e, t) {
          !t.stack.length &&
            this.state.stack.length &&
            ((0, i.setFixedBodyState)(!0), (this._isBodyFixed = !0)),
            t.stack.length &&
              !this.state.stack.length &&
              this._isBodyFixed &&
              ((0, i.setFixedBodyState)(!1), (this._isBodyFixed = !1))
        }
        componentWillUnmount() {
          this.state.stack.length &&
            this._isBodyFixed &&
            (0, i.setFixedBodyState)(!1)
        }
        render() {
          return o.createElement(
            a.Provider,
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
      const a = o.createContext(null)
    },
    759339: (e, t, n) => {
      n.d(t, { Drawer: () => u })
      var o = n(50959),
        i = n(650151),
        s = n(497754),
        a = n(189904),
        l = n(813113),
        r = n(163694),
        c = n(28466),
        h = n(742554),
        d = n(966076)
      function u(e) {
        const {
            position: t = 'Bottom',
            onClose: n,
            children: h,
            className: u,
            theme: p = d,
          } = e,
          m = (0, i.ensureNotNull)((0, o.useContext)(r.DrawerContext)),
          [g] = (0, o.useState)(() => (0, a.randomHash)()),
          b = (0, o.useRef)(null),
          f = (0, o.useContext)(c.CloseDelegateContext)
        return (
          (0, o.useLayoutEffect)(
            () => (
              (0, i.ensureNotNull)(b.current).focus({ preventScroll: !0 }),
              f.subscribe(m, n),
              m.addDrawer(g),
              () => {
                m.removeDrawer(g), f.unsubscribe(m, n)
              }
            ),
            [],
          ),
          o.createElement(
            l.Portal,
            null,
            o.createElement(
              'div',
              { className: s(d.wrap, d[`position${t}`]) },
              g === m.currentDrawer &&
                o.createElement('div', { className: d.backdrop, onClick: n }),
              o.createElement(
                v,
                {
                  className: s(p.drawer, d[`position${t}`], u),
                  ref: b,
                  'data-name': e['data-name'],
                },
                h,
              ),
            ),
          )
        )
      }
      const v = (0, o.forwardRef)((e, t) => {
        const { className: n, ...i } = e
        return o.createElement(h.TouchScrollContainer, {
          className: s(d.drawer, n),
          tabIndex: -1,
          ref: t,
          ...i,
        })
      })
    },
    249161: (e, t, n) => {
      n.d(t, { KeyboardDocumentListener: () => i })
      var o = n(50959)
      class i extends o.PureComponent {
        constructor() {
          super(...arguments),
            (this._handleKeyDown = (e) => {
              e.keyCode === this.props.keyCode && this.props.handler(e)
            })
        }
        componentDidMount() {
          document.addEventListener(
            this.props.eventType || 'keydown',
            this._handleKeyDown,
            !1,
          )
        }
        componentWillUnmount() {
          document.removeEventListener(
            this.props.eventType || 'keydown',
            this._handleKeyDown,
            !1,
          )
        }
        render() {
          return null
        }
      }
    },
    800296: (e, t, n) => {
      n.d(t, { ListItemButton: () => r })
      var o = n(50959),
        i = n(497754),
        s = n.n(i),
        a = n(72571),
        l = n(186928)
      function r(e) {
        const { className: t, disabled: n, ...i } = e
        return o.createElement(a.Icon, {
          className: s()(l.button, n && l.disabled, t),
          ...i,
        })
      }
    },
    230553: (e, t, n) => {
      n.d(t, { MenuContext: () => o })
      const o = n(50959).createContext(null)
    },
    510618: (e, t, n) => {
      n.d(t, { DEFAULT_MENU_THEME: () => g, Menu: () => b })
      var o = n(50959),
        i = n(497754),
        s = n.n(i),
        a = n(650151),
        l = n(44681),
        r = n(199663),
        c = n(753327),
        h = n(370981),
        d = n(801808),
        u = n(376202),
        v = n(823030),
        p = n(230553),
        m = n(540191)
      const g = m
      class b extends o.PureComponent {
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
              var n, o, i, s, r, c, h, d, u, v, p, m
              if (this.state.isMeasureValid && !t) return
              const { position: g } = this.props,
                b = (0, a.ensureNotNull)(this._containerRef)
              let f = b.getBoundingClientRect()
              const w = document.documentElement.clientHeight,
                _ = document.documentElement.clientWidth,
                y =
                  null !== (n = this.props.closeOnScrollOutsideOffset) &&
                  void 0 !== n
                    ? n
                    : 0
              let S = w - 0 - y
              const x = f.height > S
              if (x) {
                ;((0, a.ensureNotNull)(this._scrollWrapRef).style.overflowY =
                  'scroll'),
                  (f = b.getBoundingClientRect())
              }
              const { width: E, height: C } = f,
                M =
                  'function' == typeof g
                    ? g({
                        contentWidth: E,
                        contentHeight: C,
                        availableWidth: _,
                        availableHeight: w,
                      })
                    : g,
                k =
                  null !==
                    (i =
                      null === (o = null == M ? void 0 : M.indentFromWindow) ||
                      void 0 === o
                        ? void 0
                        : o.left) && void 0 !== i
                    ? i
                    : 0,
                A =
                  _ -
                  (null !== (s = M.overrideWidth) && void 0 !== s ? s : E) -
                  (null !==
                    (c =
                      null === (r = null == M ? void 0 : M.indentFromWindow) ||
                      void 0 === r
                        ? void 0
                        : r.right) && void 0 !== c
                    ? c
                    : 0),
                D = (0, l.clamp)(M.x, k, Math.max(k, A)),
                T =
                  (null !==
                    (d =
                      null === (h = null == M ? void 0 : M.indentFromWindow) ||
                      void 0 === h
                        ? void 0
                        : h.top) && void 0 !== d
                    ? d
                    : 0) + y,
                H =
                  w -
                  (null !== (u = M.overrideHeight) && void 0 !== u ? u : C) -
                  (null !==
                    (p =
                      null === (v = null == M ? void 0 : M.indentFromWindow) ||
                      void 0 === v
                        ? void 0
                        : v.bottom) && void 0 !== p
                    ? p
                    : 0)
              let I = (0, l.clamp)(M.y, T, Math.max(T, H))
              if (
                (M.forbidCorrectYCoord &&
                  I < M.y &&
                  ((S -= M.y - I), (I = M.y)),
                t &&
                  void 0 !== this.props.closeOnScrollOutsideOffset &&
                  M.y <= this.props.closeOnScrollOutsideOffset)
              )
                return void this._handleGlobalClose(!0)
              const L =
                null !== (m = M.overrideHeight) && void 0 !== m
                  ? m
                  : x
                    ? S
                    : void 0
              this.setState(
                {
                  appearingMenuHeight: t ? this.state.appearingMenuHeight : L,
                  appearingMenuWidth: t
                    ? this.state.appearingMenuWidth
                    : M.overrideWidth,
                  appearingPosition: { x: D, y: I },
                  isMeasureValid: !0,
                },
                () => {
                  this._restoreScrollPosition(), e && e()
                },
              )
            }),
            (this._restoreScrollPosition = () => {
              const e = document.activeElement,
                t = (0, a.ensureNotNull)(this._containerRef)
              if (null !== e && t.contains(e))
                try {
                  e.scrollIntoView()
                } catch (e) {}
              else
                (0, a.ensureNotNull)(this._scrollWrapRef).scrollTop =
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
              this._scroll = (0, a.ensureNotNull)(this._scrollWrapRef).scrollTop
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
            customCloseDelegate: e = h.globalCloseDelegate,
            customRemeasureDelegate: t,
          } = this.props
          e.subscribe(this, this._handleGlobalClose),
            null == t || t.subscribe(null, this._handleCustomRemeasureDelegate),
            window.addEventListener('resize', this._resize)
          const n = null !== this.context
          this._hotkeys ||
            n ||
            ((this._hotkeys = u.createGroup({ desc: 'Popup menu' })),
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
            customCloseDelegate: e = h.globalCloseDelegate,
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
              'aria-labelledby': i,
              'aria-activedescendant': a,
              'aria-hidden': l,
              'aria-describedby': h,
              'aria-invalid': d,
              children: u,
              minWidth: g,
              theme: b = m,
              className: w,
              maxHeight: _,
              onMouseOver: y,
              onMouseOut: S,
              onKeyDown: x,
              onFocus: E,
              onBlur: C,
            } = this.props,
            {
              appearingMenuHeight: M,
              appearingMenuWidth: k,
              appearingPosition: A,
              isMeasureValid: D,
            } = this.state,
            T = {
              '--ui-kit-menu-max-width': `${A && A.x}px`,
              maxWidth: 'calc(100vw - var(--ui-kit-menu-max-width) - 6px)',
            }
          return o.createElement(
            p.MenuContext.Provider,
            { value: this },
            o.createElement(
              v.SubmenuHandler,
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
                    'aria-labelledby': i,
                    'aria-activedescendant': a,
                    'aria-hidden': l,
                    'aria-describedby': h,
                    'aria-invalid': d,
                    className: s()(w, b.menuWrap, !D && b.isMeasuring),
                    style: {
                      height: M,
                      left: A && A.x,
                      minWidth: g,
                      position: 'fixed',
                      top: A && A.y,
                      width: k,
                      ...(this.props.limitMaxWidth && T),
                    },
                    'data-name': this.props['data-name'],
                    ref: this._handleContainerRef,
                    onScrollCapture: this.props.onScroll,
                    onContextMenu: r.preventDefaultForContextMenu,
                    tabIndex: this.props.tabIndex,
                    onMouseOver: y,
                    onMouseOut: S,
                    onKeyDown: x,
                    onFocus: E,
                    onBlur: C,
                  },
                  o.createElement(
                    'div',
                    {
                      className: s()(
                        b.scrollWrap,
                        !this.props.noMomentumBasedScroll && b.momentumBased,
                      ),
                      style: {
                        overflowY: void 0 !== M ? 'scroll' : 'auto',
                        maxHeight: _,
                      },
                      onScrollCapture: this._handleScroll,
                      ref: this._handleScrollWrapRef,
                    },
                    o.createElement(f, { className: b.menuBox }, u),
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
      function f(e) {
        const t = (0, a.ensureNotNull)((0, o.useContext)(v.SubmenuContext)),
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
                  null === (i = n.current) || void 0 === i
                    ? void 0
                    : i.contains(o))
                )
              )
                return
              var o, i
              t.isSubmenuNode(e.target) || t.setCurrent(null)
            },
            'data-name': 'menu-inner',
          },
          e.children,
        )
      }
      b.contextType = v.SubmenuContext
    },
    874485: (e, t, n) => {
      n.d(t, { makeOverlapable: () => s })
      var o = n(50959),
        i = n(813113)
      function s(e) {
        return class extends o.PureComponent {
          render() {
            const { isOpened: t, root: n } = this.props
            if (!t) return null
            const s = o.createElement(e, { ...this.props, zIndex: 150 })
            return 'parent' === n ? s : o.createElement(i.Portal, null, s)
          }
        }
      }
    },
    730743: (e, t, n) => {
      n.d(t, { calcSubMenuPos: () => i })
      var o = n(710263)
      function i(e, t, n = { x: 0, y: 10 }) {
        if (t) {
          const { left: n, right: i, top: s } = t.getBoundingClientRect(),
            a = document.documentElement.clientWidth,
            l = { x: n - e, y: s },
            r = { x: i, y: s }
          return (0, o.isRtl)() ? (n <= e ? r : l) : a - i >= e ? r : l
        }
        return n
      }
    },
    28466: (e, t, n) => {
      n.d(t, { CloseDelegateContext: () => s })
      var o = n(50959),
        i = n(370981)
      const s = o.createContext(i.globalCloseDelegate)
    },
    72621: (e, t, n) => {
      n.d(t, { RemoveButton: () => c })
      var o = n(609838),
        i = n(50959),
        s = n(497754),
        a = n(72571),
        l = n(333765),
        r = n(927306)
      function c(e) {
        const {
          className: t,
          isActive: c,
          onClick: h,
          onMouseDown: d,
          title: u,
          hidden: v,
          'data-name': p = 'remove-button',
          ...m
        } = e
        return i.createElement(a.Icon, {
          ...m,
          'data-name': p,
          className: s(
            r.button,
            'apply-common-tooltip',
            c && r.active,
            v && r.hidden,
            t,
          ),
          icon: l,
          onClick: h,
          onMouseDown: d,
          title: u || o.t(null, void 0, n(734596)),
        })
      }
    },
    753327: (e, t, n) => {
      n.d(t, { Slot: () => o.Slot, SlotContext: () => o.SlotContext })
      var o = n(682925)
    },
    493173: (e, t, n) => {
      function o(e, t, n = {}) {
        return Object.assign(
          {},
          e,
          ((e, t, n = {}) => {
            const o = Object.assign({}, t)
            for (const i of Object.keys(t)) {
              const s = n[i] || i
              s in e && (o[i] = [e[s], t[i]].join(' '))
            }
            return o
          })(e, t, n),
        )
      }
      n.d(t, { mergeThemes: () => o })
    },
    179807: (e, t, n) => {
      n.d(t, {
        focusFirstMenuItem: () => c,
        handleAccessibleMenuFocus: () => l,
        handleAccessibleMenuKeyDown: () => r,
        queryMenuElements: () => u,
      })
      var o = n(892932),
        i = n(27164),
        s = n(180185)
      const a = [37, 39, 38, 40]
      function l(e, t) {
        e.target &&
          o.PLATFORM_ACCESSIBILITY_ENABLED &&
          e.relatedTarget === t.current &&
          c(e.target)
      }
      function r(e) {
        var t
        if (!o.PLATFORM_ACCESSIBILITY_ENABLED) return
        if (e.defaultPrevented) return
        const n = (0, s.hashFromEvent)(e)
        if (!a.includes(n)) return
        const l = document.activeElement
        if (!(document.activeElement instanceof HTMLElement)) return
        const r = u(e.currentTarget).sort(o.navigationOrderComparator)
        if (0 === r.length) return
        const c =
          document.activeElement.closest('[data-role="menuitem"]') ||
          (null === (t = document.activeElement.parentElement) || void 0 === t
            ? void 0
            : t.querySelector('[data-role="menuitem"]'))
        if (!(c instanceof HTMLElement)) return
        const p = r.indexOf(c)
        if (-1 === p) return
        const m = v(c),
          g = m.indexOf(document.activeElement),
          b = -1 !== g,
          f = (e) => {
            l && (0, i.becomeSecondaryElement)(l),
              (0, i.becomeMainElement)(e),
              e.focus()
          }
        switch ((0, o.mapKeyCodeToDirection)(n)) {
          case 'inlinePrev':
            if (!m.length) return
            e.preventDefault(),
              f(0 === g ? r[p] : b ? h(m, g, -1) : m[m.length - 1])
            break
          case 'inlineNext':
            if (!m.length) return
            e.preventDefault(),
              g === m.length - 1 ? f(r[p]) : f(b ? h(m, g, 1) : m[0])
            break
          case 'blockPrev': {
            e.preventDefault()
            const t = h(r, p, -1)
            if (b) {
              const e = d(t, g)
              f(e || t)
              break
            }
            f(t)
            break
          }
          case 'blockNext': {
            e.preventDefault()
            const t = h(r, p, 1)
            if (b) {
              const e = d(t, g)
              f(e || t)
              break
            }
            f(t)
          }
        }
      }
      function c(e) {
        const [t] = u(e)
        t && ((0, i.becomeMainElement)(t), t.focus())
      }
      function h(e, t, n) {
        return e[(t + e.length + n) % e.length]
      }
      function d(e, t) {
        const n = v(e)
        return n.length ? n[(t + n.length) % n.length] : null
      }
      function u(e) {
        return Array.from(
          e.querySelectorAll(
            '[data-role="menuitem"]:not([disabled]):not([aria-disabled])',
          ),
        ).filter((0, o.createScopedVisibleElementFilter)(e))
      }
      function v(e) {
        return Array.from(
          e.querySelectorAll('[tabindex]:not([disabled]):not([aria-disabled])'),
        ).filter((0, o.createScopedVisibleElementFilter)(e))
      }
    },
    800553: (e, t, n) => {
      n.d(t, { ActionsTable: () => l })
      var o = n(50959),
        i = n(886838)
      function s(e) {
        return o.createElement(
          'tr',
          { className: i.row },
          o.createElement(
            'td',
            null,
            o.createElement('div', { className: i.line }),
          ),
          o.createElement(
            'td',
            null,
            o.createElement('div', { className: i.line }),
            e.hint
              ? o.createElement('div', { className: i.hint }, e.hint)
              : null,
          ),
        )
      }
      var a = n(879091)
      class l extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._handleShowSubMenu = (e) => {
              const t = e.getState()
              this.setState({ showSubMenuOf: t.subItems.length ? e : void 0 })
            }),
            (this.state = {})
        }
        render() {
          return o.createElement(
            'table',
            null,
            o.createElement(
              'tbody',
              null,
              this.props.items.map((e) => this._item(e)),
            ),
          )
        }
        static getDerivedStateFromProps(e, t) {
          return !e.parentIsOpened && t.showSubMenuOf
            ? { showSubMenuOf: void 0 }
            : null
        }
        _item(e) {
          var t
          switch (e.type) {
            case 'separator':
              return o.createElement(s, { key: e.id, hint: e.getHint() })
            case 'action':
              const n = null !== (t = e.custom()) && void 0 !== t ? t : e
              return o.createElement(a.ContextMenuAction, {
                key: n.id,
                action: n,
                onShowSubMenu: this._handleShowSubMenu,
                isSubMenuOpened: this.state.showSubMenuOf === n,
                menuStatName: this.props.menuStatName,
                parentStatName: this.props.parentStatName,
                onRequestUpdate: this.props.onRequestUpdate,
              })
          }
        }
      }
    },
    583798: (e, t, n) => {
      n.r(t), n.d(t, { SERIES_ICONS: () => w })
      var o = n(149387),
        i = n(893316),
        s = n(173149),
        a = n(943031),
        l = n(94670),
        r = n(832162),
        c = n(539956),
        h = n(14083),
        d = n(45504),
        u = n(352867),
        v = n(241473),
        p = n(831246),
        m = n(715726),
        g = n(724464),
        b = n(671705),
        f = n(309450)
      const w = {
        3: l,
        16: r,
        0: c,
        1: h,
        8: d,
        9: u,
        2: v,
        14: p,
        15: m,
        10: g,
        12: b,
        13: f,
      }
      ;(w[4] = o), (w[6] = i), (w[7] = s), (w[5] = a)
    },
    602948: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M3.92 7.83 9 12.29l5.08-4.46-1-1.13L9 10.29l-4.09-3.6-.99 1.14Z"/></svg>'
    },
    709210: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M5 2H4v3H1v1h3v3h1V6h3V5H5V2Z"/><path fill="currentColor" fill-rule="evenodd" d="M17.5 11h-7a1.5 1.5 0 0 0 0 3h7a1.5 1.5 0 0 0 0-3Zm-7-1a2.5 2.5 0 0 0 0 5h7a2.5 2.5 0 0 0 0-5h-7Z"/><path fill="currentColor" d="M8 18h12v1H8v-1Z"/><path fill="currentColor" d="M21.5 6H10V5h11.5A2.5 2.5 0 0 1 24 7.5v14a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 4 21.5V11h1v10.5c0 .83.67 1.5 1.5 1.5h15c.83 0 1.5-.67 1.5-1.5v-14c0-.83-.67-1.5-1.5-1.5Z"/></svg>'
    },
    528009: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M14 13C15.1046 13 16 12.1046 16 11C16 9.89543 15.1046 9 14 9C12.8954 9 12 9.89543 12 11C12 12.1046 12.8954 13 14 13ZM15 11C15 11.5523 14.5523 12 14 12C13.4477 12 13 11.5523 13 11C13 10.4477 13.4477 10 14 10C14.5523 10 15 10.4477 15 11ZM14 19C15.1046 19 16 18.1046 16 17C16 15.8954 15.1046 15 14 15C12.8954 15 12 15.8954 12 17C12 18.1046 12.8954 19 14 19ZM15 17C15 17.5523 14.5523 18 14 18C13.4477 18 13 17.5523 13 17C13 16.4477 13.4477 16 14 16C14.5523 16 15 16.4477 15 17ZM24 10H20C19.4477 10 19 10.4477 19 11C19 11.5523 19.4477 12 20 12H24C24.5523 12 25 11.5523 25 11C25 10.4477 24.5523 10 24 10ZM20 9C18.8954 9 18 9.89543 18 11C18 12.1046 18.8954 13 20 13H24C25.1046 13 26 12.1046 26 11C26 9.89543 25.1046 9 24 9H20ZM4 16H8C8.55228 16 9 16.4477 9 17C9 17.5523 8.55228 18 8 18H4C3.44772 18 3 17.5523 3 17C3 16.4477 3.44772 16 4 16ZM2 17C2 15.8954 2.89543 15 4 15H8C9.10457 15 10 15.8954 10 17C10 18.1046 9.10457 19 8 19H4C2.89543 19 2 18.1046 2 17Z"/></svg>'
    },
    465890: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 9" width="11" height="9" fill="none"><path stroke-width="2" d="M0.999878 4L3.99988 7L9.99988 1"/></svg>'
    },
    366493: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.5 20L11 14.5 16.5 9"/></svg>'
    },
    379978: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M8 5l3.5 3.5L8 12"/></svg>'
    },
    845437: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><g fill="none" fill-rule="evenodd"><path stroke="currentColor" d="M13 22.5H5.5a2 2 0 0 1-2-2v-14a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2V14"/><path stroke="currentColor" stroke-linecap="square" d="M18.5 15.5v8m-4-4h8"/><path fill="currentColor" d="M7 8h11v1H7zm0 4h11v1H7zm0 4h5v1H7z"/></g></svg>'
    },
    94670: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="m25.35 5.35-9.5 9.5-.35.36-.35-.36-4.65-4.64-8.15 8.14-.7-.7 8.5-8.5.35-.36.35.36 4.65 4.64 9.15-9.14.7.7ZM2 21h1v1H2v-1Zm2-1H3v1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1V9h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v1H9v1H8v1H7v1H6v1H5v1H4v1Zm1 0v1H4v-1h1Zm1 0H5v-1h1v1Zm1 0v1H6v-1h1Zm0-1H6v-1h1v1Zm1 0H7v1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v1H9v1H8v1H7v1h1v1Zm1 0v1H8v-1h1Zm0-1H8v-1h1v1Zm1 0H9v1h1v1h1v-1h1v1h1v-1h1v1h1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v1H9v1h1v1Zm1 0v1h-1v-1h1Zm0-1v-1h-1v1h1Zm0 0v1h1v1h1v-1h-1v-1h-1Zm6 2v-1h1v1h-1Zm2 0v1h-1v-1h1Zm0-1h-1v-1h1v1Zm1 0h-1v1h1v1h1v-1h1v1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v1h-1v1h-1v1h-1v1h1v1Zm1 0h-1v1h1v-1Zm0-1h1v1h-1v-1Zm0-1h1v-1h-1v1Zm0 0v1h-1v-1h1Zm-4 3v1h-1v-1h1Z"/></svg>'
    },
    539956: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="none" stroke="currentColor" stroke-linecap="square"><path d="M10.5 7.5v15M7.5 20.5H10M13.5 11.5H11M19.5 6.5v15M16.5 9.5H19M22.5 16.5H20"/></g></svg>'
    },
    724464: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="m10.49 7.55-.42.7-2.1 3.5.86.5 1.68-2.8 1.8 2.82.84-.54-2.23-3.5-.43-.68Zm12.32 4.72-.84-.54 2.61-4 .84.54-2.61 4Zm-5.3 6.3 1.2-1.84.84.54-1.63 2.5-.43.65-.41-.65-1.6-2.5.85-.54 1.17 1.85ZM4.96 16.75l.86.52-2.4 4-.86-.52 2.4-4ZM3 14v1h1v-1H3Zm2 0h1v1H5v-1Zm2 0v1h1v-1H7Zm2 0h1v1H9v-1Zm2 0v1h1v-1h-1Zm2 0h1v1h-1v-1Zm2 0v1h1v-1h-1Zm2 0h1v1h-1v-1Zm2 0v1h1v-1h-1Zm2 0h1v1h-1v-1Zm2 0v1h1v-1h-1Zm2 0h1v1h-1v-1Z"/></svg>'
    },
    14083: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M17 11v6h3v-6h-3zm-.5-1h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5z"/><path d="M18 7h1v3.5h-1zm0 10.5h1V21h-1z"/><path d="M9 8v12h3V8H9zm-.5-1h4a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5z"/><path d="M10 4h1v3.5h-1zm0 16.5h1V24h-1z"/></svg>'
    },
    53707: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><g fill="none"><path stroke="currentColor" d="M11 20.5H7.5a5 5 0 1 1 .42-9.98 7.5 7.5 0 0 1 14.57 2.1 4 4 0 0 1-1 7.877H18"/><path stroke="currentColor" d="M14.5 24V12.5M11 16l3.5-3.5L18 16"/></g></svg>'
    },
    309450: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M12 7v14h5V7h-5Zm4 1h-3v12h3V8ZM19 15v6h5v-6h-5Zm4 1h-3v4h3v-4ZM5 12h5v9H5v-9Zm1 1h3v7H6v-7Z"/></svg>'
    },
    301393: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M13.5 6a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM4 14.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/><path fill="currentColor" d="M9 14h4v-4h1v4h4v1h-4v4h-1v-4H9v-1z"/></svg>'
    },
    849697: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor"><path d="M21 7v4h1V6h-5v1z"/><path d="M16.854 11.854l5-5-.708-.708-5 5zM7 7v4H6V6h5v1z"/><path d="M11.146 11.854l-5-5 .708-.708 5 5zM21 21v-4h1v5h-5v-1z"/><path d="M16.854 16.146l5 5-.708.708-5-5z"/><g><path d="M7 21v-4H6v5h5v-1z"/><path d="M11.146 16.146l-5 5 .708.708 5-5z"/></g></g></svg>'
    },
    45504: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M9 8v12h3V8H9zm-1-.502C8 7.223 8.215 7 8.498 7h4.004c.275 0 .498.22.498.498v13.004a.493.493 0 0 1-.498.498H8.498A.496.496 0 0 1 8 20.502V7.498z"/><path d="M10 4h1v3.5h-1z"/><path d="M17 6v6h3V6h-3zm-1-.5c0-.276.215-.5.498-.5h4.004c.275 0 .498.23.498.5v7c0 .276-.215.5-.498.5h-4.004a.503.503 0 0 1-.498-.5v-7z"/><path d="M18 2h1v3.5h-1z"/></svg>'
    },
    671705: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M7.5 7H7v14h5V7H7.5zM8 20V8h3v12H8zm7.5-11H15v10h5V9h-4.5zm.5 9v-8h3v8h-3z"/></svg>'
    },
    832162: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path fill-rule="evenodd" d="M22 3h1v1h-1V3Zm0 2V4h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1V9h-1V8h-1V7h-1V6h-1V5h-1v1H9v1H8v1H7v1H6v1H5v1H4v1h1v1H4v1h1v-1h1v-1h1v-1h1v-1h1V9h1V8h1v1h1v1h1v1h1v1h1v1h1v-1h1v-1h1v-1h1V9h1V8h1V7h1V6h1V5h-1Zm-1 1V5h1v1h-1Zm-1 1V6h1v1h-1Zm-1 1V7h1v1h-1Zm-1 1V8h1v1h-1Zm-1 1V9h1v1h-1Zm-1 1v-1h1v1h-1Zm-1 0v-1h-1V9h-1V8h-1V7h-1V6h-1v1H9v1H8v1H7v1H6v1H5v1h1v-1h1v-1h1V9h1V8h1V7h1v1h1v1h1v1h1v1h1Zm0 0h1v1h-1v-1Zm.84 6.37 7.5-7-.68-.74-7.15 6.67-4.66-4.65-.33-.34-.36.32-5.5 5 .68.74 5.14-4.68 4.67 4.66.34.35.35-.33ZM6 23H5v1h1v-1Zm0-1H5v-1h1v1Zm1 0v1H6v-1h1Zm0-1H6v-1h1v1Zm1 0v1H7v-1h1Zm0-1H7v-1h1v1Zm1 0v1H8v-1h1Zm0-1H8v-1h1v1Zm1 0v1H9v-1h1Zm0-1H9v-1h1v1Zm1 0h-1v1h1v1h1v1h1v1h1v1h1v1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h-1v-1h1v-1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v1h1v1Zm0 0h1v1h-1v-1Zm2 2v1h1v1h1v1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1Zm0 0v-1h-1v1h1Z"/></svg>'
    },
    352867: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M17 11v6h3v-6h-3zm-.5-1h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5z"/><path d="M18 7h1v3.5h-1zm0 10.5h1V21h-1z"/><path d="M9 8v11h3V8H9zm-.5-1h4a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-12a.5.5 0 0 1 .5-.5z"/><path d="M10 4h1v5h-1zm0 14h1v5h-1zM8.5 9H10v1H8.5zM11 9h1.5v1H11zm-1 1h1v1h-1zm-1.5 1H10v1H8.5zm2.5 0h1.5v1H11zm-1 1h1v1h-1zm-1.5 1H10v1H8.5zm2.5 0h1.5v1H11zm-1 1h1v1h-1zm-1.5 1H10v1H8.5zm2.5 0h1.5v1H11zm-1 1h1v1h-1zm-1.5 1H10v1H8.5zm2.5 0h1.5v1H11z"/></svg>'
    },
    139681: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="M20 17l-5 5M15 17l5 5M9 11.5h7M17.5 8a2.5 2.5 0 0 0-5 0v11a2.5 2.5 0 0 1-5 0"/></svg>'
    },
    943031: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M11 5h3v12h5V8h3v13h1V7h-5v9h-3V4h-5v18H7v-5H6v6h5z"/></svg>'
    },
    831246: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path fill-rule="evenodd" d="m18.43 15.91 6.96-8.6-.78-.62-6.96 8.6a2.49 2.49 0 0 0-2.63.2l-2.21-2.02A2.5 2.5 0 0 0 10.5 10a2.5 2.5 0 1 0 1.73 4.3l2.12 1.92a2.5 2.5 0 1 0 4.08-.31ZM10.5 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm7.5 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/><path d="M8.37 13.8c.17.3.4.54.68.74l-5.67 6.78-.76-.64 5.75-6.88Z"/></svg>'
    },
    241473: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="m25.39 7.31-8.83 10.92-6.02-5.47-7.16 8.56-.76-.64 7.82-9.36 6 5.45L24.61 6.7l.78.62Z"/></svg>'
    },
    173149: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M18 24h3V12h-3v12zm-1-13h5v14h-5V11zm-4-8v7h3V3h-3zm-1-1h5v9h-5V2zM8 19h3v-7H8v7zm-1-8h5v9H7v-9z"/></svg>'
    },
    893316: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M14.5 16a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0-1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm0 7a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0-1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm3.293-15.5l4.707 4.707.707-.707L18.5 4.793z"/><path d="M18.5 10.207L23.207 5.5l-.707-.707L17.793 9.5zm-.707 1.293l4.707 4.707.707-.707-4.707-4.707z"/><path d="M18.5 16.207l4.707-4.707-.707-.707-4.707 4.707zM5.793 17.5l4.707 4.707.707-.707L6.5 16.793z"/><path d="M6.5 22.207l4.707-4.707-.707-.707L5.793 21.5zM5.793 5.5l4.707 4.707.707-.707L6.5 4.793z"/><path d="M6.5 10.207L11.207 5.5l-.707-.707L5.793 9.5zM5.793 11.5l4.707 4.707.707-.707L6.5 10.793z"/><path d="M6.5 16.207l4.707-4.707-.707-.707L5.793 15.5z"/></svg>'
    },
    796052: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M18.293 13l-2.647 2.646.707.708 3.854-3.854-3.854-3.854-.707.708L18.293 12H12.5A5.5 5.5 0 0 0 7 17.5V19h1v-1.5a4.5 4.5 0 0 1 4.5-4.5h5.793z"/></svg>'
    },
    149387: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M18 5v5h3V5h-3zm-1-1h5v7h-5V4zm-4 13h3v-5h-3v5zm-1-6h5v7h-5v-7zM8 24h3v-5H8v5zm-1-6h5v7H7v-7z"/></svg>'
    },
    272644: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.118 6a.5.5 0 0 0-.447.276L9.809 8H5.5A1.5 1.5 0 0 0 4 9.5v10A1.5 1.5 0 0 0 5.5 21h16a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 21.5 8h-4.309l-.862-1.724A.5.5 0 0 0 15.882 6h-4.764zm-1.342-.17A1.5 1.5 0 0 1 11.118 5h4.764a1.5 1.5 0 0 1 1.342.83L17.809 7H21.5A2.5 2.5 0 0 1 24 9.5v10a2.5 2.5 0 0 1-2.5 2.5h-16A2.5 2.5 0 0 1 3 19.5v-10A2.5 2.5 0 0 1 5.5 7h3.691l.585-1.17z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M13.5 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm0 1a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z"/></svg>'
    },
    715726: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M19 5h5v1h-4v13h-6v-7h-4v12H5v-1h4V11h6v7h4V5Z"/></svg>'
    },
    377665: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M8.707 13l2.647 2.646-.707.708L6.792 12.5l3.853-3.854.708.708L8.707 12H14.5a5.5 5.5 0 0 1 5.5 5.5V19h-1v-1.5a4.5 4.5 0 0 0-4.5-4.5H8.707z"/></svg>'
    },
    80802: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 14" width="18" height="14"><path fill="currentColor" d="M6 11.17l-4.17-4.17-1.42 1.41 5.59 5.59 12-12-1.41-1.41-10.59 10.58z"/></svg>'
    },
    339750: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M7 15l5 5L23 9"/></svg>'
    },
    333765: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="currentColor" d="M9.707 9l4.647-4.646-.707-.708L9 8.293 4.354 3.646l-.708.708L8.293 9l-4.647 4.646.708.708L9 9.707l4.646 4.647.708-.707L9.707 9z"/></svg>'
    },
    69311: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M9.7 9l4.65-4.65-.7-.7L9 8.29 4.35 3.65l-.7.7L8.29 9l-4.64 4.65.7.7L9 9.71l4.65 4.64.7-.7L9.71 9z"/></svg>'
    },
    581384: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" stroke-width="1.2" d="M8 8l13 13m0-13L8 21"/></svg>'
    },
    833366: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path fill="currentColor" d="M7 13h7V6h1v7h7v1h-7v7h-1v-7H7v-1z"/></svg>'
    },
    290752: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="M5.5 13v-2.5m8.5 11h6.5a2 2 0 0 0 2-2v-9m-17 0v-2c0-1.1.9-2 2-2h13a2 2 0 0 1 2 2v2m-17 0h17"/><path fill="currentColor" d="M10 4h1v4h-1V4zM17 4h1v4h-1V4z"/><path stroke="currentColor" d="M4 18.5h7.5m0 0L8 22m3.5-3.5L8 15"/></svg>'
    },
    881111: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M4 6.5C4 5.67 4.67 5 5.5 5h4.2l.15.15L11.71 7h8.79c.83 0 1.5.67 1.5 1.5V11H5V20.5c0 .28.22.5.5.5H9v1H5.5A1.5 1.5 0 0 1 4 20.5V6.5zM5 10h16V8.5a.5.5 0 0 0-.5-.5h-9.2l-.15-.15L9.29 6H5.5a.5.5 0 0 0-.5.5V10z"/><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M14.85 16.85l3.5-3.5-.7-.7-3.5 3.5a1.5 1.5 0 1 0 0 2.7l1.64 1.65-1.64 1.65a1.5 1.5 0 1 0 .7.7l1.65-1.64 1.65 1.64a1.5 1.5 0 1 0 2.7 0l3.5-3.5-.7-.7-3.5 3.5a1.5 1.5 0 0 0-1.3 0l-1.64-1.65 4.14-4.15-.7-.7-4.15 4.14-1.65-1.64a1.5 1.5 0 0 0 0-1.3zm-.85.65a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm6 6a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm-6.5.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/></svg>'
    },
    430192: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M13.39 3.84a1 1 0 0 1 1.22 0l8.19 6.37a1 1 0 0 1 0 1.58l-8.19 6.37a1 1 0 0 1-1.22 0L5.2 11.79a1 1 0 0 1 0-1.58l8.19-6.37zm.61.8L5.81 11 14 17.37 22.19 11 14 4.63zM5.3 13.6l8.7 6.76 8.7-6.76.6.78-8.69 6.77a1 1 0 0 1-1.22 0l-8.7-6.77.62-.78zm8.09 10.55l-8.7-6.77.62-.78L14 23.37l8.7-6.76.6.78-8.69 6.77a1 1 0 0 1-1.22 0z"/></svg>'
    },
    398120: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M13.9 14.1V22h1.2v-7.9H23v-1.2h-7.9V5h-1.2v7.9H6v1.2h7.9z"/></svg>'
    },
    177042: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M14 9.5a.5.5 0 0 0 1 0V7.02A6.5 6.5 0 0 1 20.98 13H18.5a.5.5 0 0 0 0 1h2.48A6.5 6.5 0 0 1 15 19.98V17.5a.5.5 0 0 0-1 0v2.48A6.5 6.5 0 0 1 8.02 14h2.48a.5.5 0 0 0 0-1H8.02A6.5 6.5 0 0 1 14 7.02V9.5zm1-3.48V4.5a.5.5 0 0 0-1 0v1.52A7.5 7.5 0 0 0 7.02 13H5.5a.5.5 0 0 0 0 1h1.52A7.5 7.5 0 0 0 14 20.98v1.52a.5.5 0 0 0 1 0v-1.52A7.5 7.5 0 0 0 21.98 14h1.52a.5.5 0 0 0 0-1h-1.52A7.5 7.5 0 0 0 15 6.02z"/></svg>'
    },
    152493: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="M7.5 4.5h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-14a2 2 0 0 1-2-2v-14c0-1.1.9-2 2-2zM9 9.5h11M9 13.5h11M9 17.5h11"/></svg>'
    },
  },
])
