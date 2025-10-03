;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3555],
  {
    97754: (t, e) => {
      var o
      !(() => {
        var r = {}.hasOwnProperty
        function n() {
          for (var t = [], e = 0; e < arguments.length; e++) {
            var o = arguments[e]
            if (o) {
              var a = typeof o
              if ('string' === a || 'number' === a) t.push(o)
              else if (Array.isArray(o) && o.length) {
                var i = n.apply(null, o)
                i && t.push(i)
              } else if ('object' === a)
                for (var c in o) r.call(o, c) && o[c] && t.push(c)
            }
          }
          return t.join(' ')
        }
        t.exports
          ? ((n.default = n), (t.exports = n))
          : void 0 === (o = (() => n).apply(e, [])) || (t.exports = o)
      })()
    },
    32262: (t) => {
      t.exports = {
        priceScaleModeButton: 'priceScaleModeButton-okRV4Kjm',
        priceScaleModeButton_activated:
          'priceScaleModeButton_activated-okRV4Kjm',
      }
    },
    87896: (t, e, o) => {
      o.d(e, { createReactRoot: () => u })
      var r = o(50959),
        n = o(32227),
        a = o(4237)
      const i = (0, r.createContext)({
        isOnMobileAppPage: () => !1,
        isRtl: !1,
        locale: 'en',
      })
      var c = o(84015),
        l = o(63273)
      const s = {
        iOs: 'old',
        android: 'new',
        old: 'old',
        new: 'new',
        any: 'any',
      }
      function d(t) {
        const [e] = (0, r.useState)({
          isOnMobileAppPage: (t) => (0, c.isOnMobileAppPage)(s[t]),
          isRtl: (0, l.isRtl)(),
          locale: window.locale,
        })
        return r.createElement(i.Provider, { value: e }, t.children)
      }
      function u(t, e, o = 'legacy') {
        const i = r.createElement(d, null, t)
        if ('modern' === o) {
          const t = (0, a.createRoot)(e)
          return (
            t.render(i),
            {
              render(e) {
                t.render(r.createElement(d, null, e))
              },
              unmount() {
                t.unmount()
              },
            }
          )
        }
        return (
          n.render(i, e),
          {
            render(t) {
              n.render(r.createElement(d, null, t), e)
            },
            unmount() {
              n.unmountComponentAtNode(e)
            },
          }
        )
      }
    },
    4237: (t, e, o) => {
      var r = o(32227)
      ;(e.createRoot = r.createRoot), r.hydrateRoot
    },
    87615: (t) => {
      t.exports = {
        priceScaleModeButtons: 'priceScaleModeButtons-PEm49B2T',
        priceScaleModeButtons__buttonWrapper:
          'priceScaleModeButtons__buttonWrapper-PEm49B2T',
        priceScaleModeButtons__button: 'priceScaleModeButtons__button-PEm49B2T',
      }
    },
    49976: (t, e, o) => {
      o.r(e), o.d(e, { PriceScaleModeButtonsRenderer: () => p })
      var r = o(50959),
        n = o(11542),
        a = o(49483),
        i = o(87896),
        c = o(97754),
        l = o.n(c),
        s = o(32262)
      function d(t) {
        const {
          activated: e,
          onClick: o,
          content: n,
          tooltip: a,
          ariaLabel: i,
          className: c,
        } = t
        return r.createElement(
          'button',
          {
            className: l()(
              s.priceScaleModeButton,
              e && s.priceScaleModeButton_activated,
              c,
              a && 'apply-common-tooltip',
            ),
            onClick: o,
            'data-tooltip': a,
            'aria-label': i,
          },
          n,
        )
      }
      var u = o(87615)
      class p {
        constructor({ setMode: t, getMode: e, className: o = '' }) {
          ;(this._reactRoot = null),
            (this._setAutoMode = () => this._setModeFunction('auto')),
            (this._setLogarithmMode = () => this._setModeFunction('log')),
            (this._setModeFunction = t),
            (this._getModeFunction = e)
          const r = (this._wrapper = document.createElement('div'))
          r.classList.add(o),
            r.addEventListener('dblclick', this._stopPropagation, {
              capture: !0,
            }),
            r.addEventListener('touchstart', this._stopPropagation, {
              capture: !0,
            }),
            this._render()
        }
        destroy() {
          this._reactRoot?.unmount(),
            this._wrapper.removeEventListener(
              'dblclick',
              this._stopPropagation,
            ),
            this._wrapper.removeEventListener(
              'touchstart',
              this._stopPropagation,
            ),
            this._wrapper.remove()
        }
        element() {
          return this._wrapper
        }
        width() {
          return 52
        }
        update() {
          this._render()
        }
        _render() {
          const t = a.CheckMobile.any(),
            { autoScale: e = !1, log: c = !1 } = this._getModeFunction() || {},
            l = r.createElement(
              'div',
              {
                className: u.priceScaleModeButtons,
              },
              r.createElement(
                'div',
                {
                  className: u.priceScaleModeButtons__buttonWrapper,
                  onClick: t ? this._setAutoMode : void 0,
                  'aria-label': t ? n.t(null, void 0, o(94465)) : void 0,
                },
                r.createElement(d, {
                  activated: e,
                  content: n.t(
                    null,
                    { context: 'The first letter of the "auto" word' },
                    o(94073),
                  ),
                  tooltip: n.t(null, void 0, o(24157)),
                  onClick: t ? void 0 : this._setAutoMode,
                  ariaLabel: t ? void 0 : n.t(null, void 0, o(94465)),
                  className: u.priceScaleModeButtons__button,
                }),
              ),
              r.createElement(
                'div',
                {
                  className: u.priceScaleModeButtons__buttonWrapper,
                  onClick: t ? this._setLogarithmMode : void 0,
                  'aria-label': t ? n.t(null, void 0, o(46992)) : void 0,
                },
                r.createElement(d, {
                  activated: c,
                  content: n.t(
                    null,
                    { context: 'The first letter of the "logarithmic" word' },
                    o(66384),
                  ),
                  tooltip: n.t(null, void 0, o(16170)),
                  onClick: t ? void 0 : this._setLogarithmMode,
                  ariaLabel: t ? void 0 : n.t(null, void 0, o(46992)),
                  className: u.priceScaleModeButtons__button,
                }),
              ),
            )
          this._reactRoot
            ? this._reactRoot.render(l)
            : (this._reactRoot = (0, i.createReactRoot)(
                l,
                this._wrapper,
                'modern',
              ))
        }
        _stopPropagation(t) {
          t.stopPropagation()
        }
      }
    },
  },
])
