;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [574],
  {
    36590: (e, t, i) => {
      i.d(t, { LineToolHorzLinePriceAxisView: () => n })
      var r = i(98558),
        s = i(19063)
      class n extends r.PriceAxisView {
        constructor(e) {
          super(), (this._source = e)
        }
        _updateRendererData(e, t, i) {
          e.visible = !1
          const r = this._source.points(),
            n = this._source.priceScale()
          if (0 === r.length || null === n || n.isEmpty()) return
          const o = r[0]
          if (!isFinite(o.price)) return
          const l = this._source.ownerSource(),
            a = null !== l ? l.firstValue() : null
          if (null === a) return
          const c = (0, s.resetTransparency)(
            this._source.properties().linecolor.value(),
          )
          ;(i.background = c),
            (i.textColor = this.generateTextColor(c)),
            (i.coordinate = n.priceToCoordinate(o.price, a)),
            (e.text = n.formatPrice(o.price, a)),
            (e.visible = !0)
        }
      }
    },
    47845: (e, t, i) => {
      i.r(t), i.d(t, { LineToolHorzRay: () => l })
      var r = i(32679),
        s = i(12988),
        n = i(36590),
        o = i(29875)
      class l extends o.LineDataSource {
        constructor(e, t, r, s) {
          super(
            e,
            t ?? l.createProperties(e.backgroundTheme().spawnOwnership()),
            r,
            s,
          ),
            (this._priceAxisView = new n.LineToolHorzLinePriceAxisView(this)),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 66451))
              .then(({ HorzRayPaneView: e }) => {
                this._setPaneViews([new e(this, this._model)])
              })
        }
        pointsCount() {
          return 1
        }
        name() {
          return 'Horizontal Ray'
        }
        priceAxisViews(e, t) {
          return this.isSourceHidden() ||
            t !== this.priceScale() ||
            (!this._model.selection().isSelected(this) &&
              !this.properties().childs().showPrice.value()) ||
            e !== this._model.paneForSource(this)
            ? null
            : [this._priceAxisView]
        }
        updateAllViews(e) {
          super.updateAllViews(e), this._priceAxisView.update(e)
        }
        template() {
          const e = super.template()
          return (e.text = this.properties().childs().text.value()), e
        }
        canHasAlert() {
          return !0
        }
        static createProperties(e, t) {
          const i = new r.DefaultProperty({
            defaultName: 'linetoolhorzray',
            state: t,
            theme: e,
          })
          return this._configureProperties(i), i
        }
        _getAlertPlots() {
          const e = this._points[0],
            t = { index: e.index + 1, price: e.price },
            i = this._linePointsToAlertPlot([e, t], null, !1, !0)
          return null !== i ? [i] : []
        }
        async _getPropertyDefinitionsViewModelClass() {
          return (
            await Promise.all([
              i.e(6406),
              i.e(3889),
              i.e(8009),
              i.e(8056),
              i.e(8537),
            ]).then(i.bind(i, 22707))
          ).HorizontalRayDefinitionsViewModel
        }
        _applyTemplateImpl(e) {
          super._applyTemplateImpl(e),
            this.properties()
              .childs()
              .text.setValue(e.text || '')
        }
        static _configureProperties(e) {
          super._configureProperties(e),
            e.hasChild('text') || e.addChild('text', new s.Property('')),
            e.addExcludedKey('text', 1)
        }
      }
    },
  },
])
