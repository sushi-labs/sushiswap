;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5639],
  {
    27267: (e, t, s) => {
      function n(e, t, s, n, i) {
        function o(i) {
          if (e > i.timeStamp) return
          const o = i.target
          void 0 !== s &&
            null !== t &&
            null !== o &&
            o.ownerDocument === n &&
            (t.contains(o) || s(i))
        }
        return (
          i.click && n.addEventListener('click', o, !1),
          i.mouseDown && n.addEventListener('mousedown', o, !1),
          i.touchEnd && n.addEventListener('touchend', o, !1),
          i.touchStart && n.addEventListener('touchstart', o, !1),
          () => {
            n.removeEventListener('click', o, !1),
              n.removeEventListener('mousedown', o, !1),
              n.removeEventListener('touchend', o, !1),
              n.removeEventListener('touchstart', o, !1)
          }
        )
      }
      s.d(t, { addOutsideEventListener: () => n })
    },
    19550: (e, t, s) => {
      s.r(t), s.d(t, { CurrencyMenuResultEvents: () => r })
      var n = s(27267),
        i = s(76422),
        o = s(52092)
      class r {
        constructor(e, t, s) {
          ;(this._close = () => this.destroy()),
            (this._el = e),
            (this._eventParams = t),
            (this._closeCallback = s),
            i.subscribe(o.CLOSE_POPUPS_AND_DIALOGS_COMMAND, this._close, this),
            this._emitGlobalEvent(!1),
            (this._handlerOutsideClickDestroy = (0, n.addOutsideEventListener)(
              new CustomEvent('timestamp').timeStamp,
              this._el,
              this._close,
              this._el.ownerDocument,
              { touchEnd: !0, click: !0 },
            ))
        }
        destroy() {
          this._handlerOutsideClickDestroy(),
            this._emitGlobalEvent(!0),
            i.unsubscribe(
              o.CLOSE_POPUPS_AND_DIALOGS_COMMAND,
              this._close,
              this,
            ),
            this._closeCallback?.()
        }
        _emitGlobalEvent(e) {
          const [t, ...s] = this._eventParams
          i.emit(t, e, ...s)
        }
      }
    },
  },
])
