;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [4291],
  {
    355485: (e, t, s) => {
      s.r(t), s.d(t, { globalToasts: () => o, showToast: () => n })
      s(50959)
      var a = s(529158)
      const i = s(586240)['media-mf-phone-landscape']
      const o = new (class {
        constructor() {
          var e
          ;(this._mediaQuery = window.matchMedia(i)),
            (this._handleMediaQueryChange = () => {
              this._toastsLayer.update({
                suggestedLayout: this._getSuggestedLayout(),
              })
            }),
            (this._handleLoginStateChange = () => {
              this._toastsLayer.update({ location: this._getLocation() })
            }),
            (this._toastsLayer = new a.ToastsLayer(
              this._getSuggestedLayout(),
              void 0,
              void 0,
              this._getLocation(),
            )),
            this._mediaQuery.addListener(this._handleMediaQueryChange),
            null === (e = window.loginStateChange) ||
              void 0 === e ||
              e.subscribe(this, this._handleLoginStateChange)
        }
        destroy() {
          var e
          this._toastsLayer.destroy(),
            this._mediaQuery.removeListener(this._handleMediaQueryChange),
            null === (e = window.loginStateChange) ||
              void 0 === e ||
              e.unsubscribe(this, this._handleLoginStateChange)
        }
        showCustomToast(e) {
          return this._toastsLayer.showToast(e).remove
        }
        reset() {
          this._toastsLayer.reset()
        }
        forceRender() {
          this._toastsLayer.forceRender()
        }
        merge(e) {
          this._toastsLayer.merge(e)
        }
        split(e) {
          this._toastsLayer.split(e)
        }
        update(e) {
          this._toastsLayer.update(e)
        }
        _getSuggestedLayout() {
          return this._mediaQuery.matches ? 'loose' : 'compact'
        }
        _getLocation() {
          return 'bottom-left'
        }
      })()
      function n(e) {
        return o.showCustomToast(e)
      }
    },
    586240: (e) => {
      e.exports = JSON.parse(
        '{"size-header-height":"64px","media-phone-vertical":"screen and (max-width: 479px)","media-mf-phone-landscape":"screen and (min-width: 568px)"}',
      )
    },
  },
])
