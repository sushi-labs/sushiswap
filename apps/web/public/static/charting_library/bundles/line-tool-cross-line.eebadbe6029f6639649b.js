;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7203],
  {
    92007: (e, i, r) => {
      r.r(i), r.d(i, { LineToolCrossLine: () => l })
      var t = r(32679),
        s = r(36590),
        n = r(52690),
        o = r(29875)
      class l extends o.LineDataSource {
        constructor(e, i, t, o) {
          super(
            e,
            i ?? l.createProperties(e.backgroundTheme().spawnOwnership()),
            t,
            o,
          ),
            (this._priceAxisView = new s.LineToolHorzLinePriceAxisView(this)),
            (this._timeAxisView = new n.LineToolVertLineTimeAxisView(this)),
            Promise.all([r.e(6290), r.e(9116), r.e(1200), r.e(1583)])
              .then(r.bind(r, 17551))
              .then(({ CrossLinePaneView: e }) => {
                this._setPaneViews([new e(this, this._model)])
              })
        }
        pointsCount() {
          return 1
        }
        name() {
          return 'Cross Line'
        }
        priceAxisViews(e, i) {
          return this.isSourceHidden()
            ? null
            : i === this.priceScale() &&
                this.properties().childs().showPrice.value() &&
                this._model.paneForSource(this) === e
              ? [this._priceAxisView]
              : null
        }
        timeAxisViews() {
          return this.isSourceHidden()
            ? null
            : this.properties().childs().showTime.value()
              ? [this._timeAxisView]
              : null
        }
        updateAllViews(e) {
          super.updateAllViews(e),
            this._priceAxisView.update(e),
            this._timeAxisView.update()
        }
        canHasAlert() {
          return !1
        }
        lineColor() {
          return this.properties().childs().linecolor.value()
        }
        lineWidth() {
          return this.properties().childs().linewidth.value()
        }
        lineStyle() {
          return this.properties().childs().linestyle.value()
        }
        static createProperties(e, i) {
          const r = new t.DefaultProperty({
            defaultName: 'linetoolcrossline',
            state: i,
            theme: e,
          })
          return this._configureProperties(r), r
        }
        _normalizePoint(e, i) {
          return (
            super._normalizePointWithoutOffset(e) ?? super._normalizePoint(e, i)
          )
        }
        _getPropertyDefinitionsViewModelClass() {
          return Promise.all([
            r.e(6406),
            r.e(3889),
            r.e(8009),
            r.e(8056),
            r.e(8537),
          ])
            .then(r.bind(r, 9805))
            .then((e) => e.CrossLineDefinitionsViewModel)
        }
      }
    },
    36590: (e, i, r) => {
      r.d(i, { LineToolHorzLinePriceAxisView: () => n })
      var t = r(98558),
        s = r(19063)
      class n extends t.PriceAxisView {
        constructor(e) {
          super(), (this._source = e)
        }
        _updateRendererData(e, i, r) {
          e.visible = !1
          const t = this._source.points(),
            n = this._source.priceScale()
          if (0 === t.length || null === n || n.isEmpty()) return
          const o = t[0]
          if (!isFinite(o.price)) return
          const l = this._source.ownerSource(),
            u = null !== l ? l.firstValue() : null
          if (null === u) return
          const c = (0, s.resetTransparency)(
            this._source.properties().linecolor.value(),
          )
          ;(r.background = c),
            (r.textColor = this.generateTextColor(c)),
            (r.coordinate = n.priceToCoordinate(o.price, u)),
            (e.text = n.formatPrice(o.price, u)),
            (e.visible = !0)
        }
      }
    },
    52690: (e, i, r) => {
      r.d(i, { LineToolVertLineTimeAxisView: () => s })
      var t = r(14169)
      class s extends t.LineDataSourceTimeAxisView {
        constructor(e) {
          super(e, 0)
        }
        _getBgColor() {
          return this._source.properties().linecolor.value()
        }
        _getAlwaysInViewPort() {
          return !1
        }
        _getIndex() {
          const e = this._source.points()
          return 0 === e.length ? null : e[0].index
        }
      }
    },
  },
])
