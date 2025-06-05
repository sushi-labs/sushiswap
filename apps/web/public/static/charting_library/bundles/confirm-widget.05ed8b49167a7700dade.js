;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3989],
  {
    297265: (e, t, a) => {
      a.d(t, { useWatchedValueReadonly: () => s })
      var n = a(50959)
      const s = (e, t = !1) => {
        const a = 'watchedValue' in e ? e.watchedValue : void 0,
          s = 'defaultValue' in e ? e.defaultValue : e.watchedValue.value(),
          [i, r] = (0, n.useState)(a ? a.value() : s)
        return (
          (t ? n.useLayoutEffect : n.useEffect)(() => {
            if (a) {
              r(a.value())
              const e = (e) => r(e)
              return a.subscribe(e), () => a.unsubscribe(e)
            }
            return () => {}
          }, [a]),
          i
        )
      }
    },
    336189: (e) => {
      e.exports = {
        confirmWidget: 'confirmWidget-TnX6oDTV',
        disabledButton: 'disabledButton-TnX6oDTV',
        button: 'button-TnX6oDTV',
      }
    },
    722131: (e, t, a) => {
      a.r(t), a.d(t, { ConfirmWidgetRenderer: () => c })
      var n = a(50959),
        s = a(500962),
        i = a(650151),
        r = a(497754),
        d = a(171529),
        u = a(297265),
        o = a(336189)
      function l(e) {
        const {
            onClick: t,
            disabled: a,
            hasError: s,
            buttonText: i,
            side: l,
          } = e,
          c = (0, u.useWatchedValueReadonly)({ watchedValue: l }),
          h = (0, u.useWatchedValueReadonly)({ watchedValue: a }),
          b = (0, u.useWatchedValueReadonly)({ watchedValue: s }),
          _ = (0, u.useWatchedValueReadonly)({ watchedValue: i }),
          m = r(o.button, h && o.disabledButton)
        return n.createElement(
          'div',
          { className: o.confirmWidget },
          n.createElement(
            d.SquareButton,
            {
              color: 1 === c ? 'brand' : 'red',
              onClick: t,
              disabled: b || h,
              stretch: !0,
              variant: 'primary',
              size: 'xsmall',
              className: m,
              animated: !0,
            },
            _,
          ),
        )
      }
      class c {
        constructor(e, t, a, i, r) {
          ;(this._container = null),
            (this._container = document.createElement('div')),
            document.body.appendChild(this._container),
            (this._buttonText = e),
            (this._side = t),
            (this._disabled = a),
            (this._hasError = i)
          const d = {
            side: this._side.spawn(),
            buttonText: this._buttonText.spawn(),
            disabled: this._disabled.spawn(),
            hasError: this._hasError.spawn(),
            onClick: r,
          }
          s.render(n.createElement(l, { ...d }), this._container)
        }
        destroy() {
          this._hide(),
            this._buttonText.release(),
            this._side.release(),
            this._disabled.release(),
            this._hasError.release()
        }
        _hide() {
          var e
          null !== this._container &&
            (s.unmountComponentAtNode((0, i.ensureNotNull)(this._container)),
            null === (e = this._container) || void 0 === e || e.remove(),
            (this._container = null))
        }
      }
    },
  },
])
