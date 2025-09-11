;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9581],
  {
    57897: (e, t, i) => {
      i.r(t), i.d(t, { LineToolDisjointChannel: () => l })
      var s = i(29875),
        n = i(32679),
        r = i(37265),
        p = i(12988),
        o = i(64147)
      class l extends s.LineDataSource {
        constructor(e, t, s, n) {
          super(
            e,
            t ?? l.createProperties(e.backgroundTheme().spawnOwnership()),
            s,
            n,
          ),
            (this.version = 1),
            (this._hasEditableCoordinates = new o.WatchedValue(!1)),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 41376))
              .then((e) => {
                this._setPaneViews([
                  new e.DisjointChannelPaneView(this, this._model),
                ])
              })
        }
        pointsCount() {
          return 3
        }
        name() {
          return 'Disjoint Channel'
        }
        snapTo45DegreesAvailable() {
          return !0
        }
        addPoint(e, t, i) {
          return (
            this._snapTo45DegreesApplicable(t) &&
              2 === this.points().length &&
              this.snapPoint45Degree(
                e,
                this.points()[this.points().length - 2],
              ),
            super.addPoint(e)
          )
        }
        setLastPoint(e, t) {
          return (
            this._snapTo45DegreesApplicable(t) &&
              2 === this.points().length &&
              this.snapPoint45Degree(
                e,
                this.points()[this.points().length - 2],
              ),
            super.setLastPoint(e)
          )
        }
        setPoint(e, t, i, s) {
          const n = 0.5 * (this._points[1].price + this._points[2].price)
          if (this._snapTo45DegreesApplicable(i) && 1 === e) {
            const e = 0
            this.snapPoint45Degree(t, this.points()[e])
          }
          if ((e < 3 && super.setPoint(e, t), 0 !== e && 2 !== e)) {
            if (1 === e) {
              const e = this._points[1].price - n
              this._points[2].price = this._points[1].price - 2 * e
            } else if (3 === e) {
              const e = t.price - this._points[2].price
              ;(this._points[0].price = this._points[1].price - e),
                (this._points[0].index = t.index),
                (this._points[0].interval = this._model.mainSeries().interval())
            }
            this._normalizePoints()
          }
        }
        getPoint(e) {
          if (e < 3) return super.getPoint(e)
          const t = this._points[0].price - this._points[2].price
          return {
            index: this._points[0].index,
            price: this._points[1].price - t,
          }
        }
        canHasAlert() {
          return !0
        }
        template() {
          const e = super.template()
          return (e.labelText = this.properties().childs().labelText.value()), e
        }
        static createProperties(e, t) {
          const i = new n.DefaultProperty({
            defaultName: 'linetooldisjointangle',
            state: t,
            theme: e,
          })
          return this._configureProperties(i), i
        }
        _applyTemplateImpl(e) {
          super._applyTemplateImpl(e),
            this.properties()
              .childs()
              .labelText.setValue(e.labelText ?? '')
        }
        _getAlertPlots() {
          const e = this._points[0],
            t = this._points[1],
            i = []
          e.index <= t.index ? (i.push(e), i.push(t)) : (i.push(t), i.push(e))
          const s = this._points[2]
          ;(s.time = t.time), (s.index = t.index)
          const n = {
              price: s.price + (t.price - e.price),
              time: e.time,
              index: e.index,
            },
            p = []
          let o, l, a, h
          s.index <= n.index ? (p.push(s), p.push(n)) : (p.push(n), p.push(s)),
            i[0].price > p[0].price
              ? ((o = i), (l = p))
              : p[0].price > i[0].price || p[1].price > i[1].price
                ? ((o = p), (l = i))
                : ((o = i), (l = p))
          const c = this.properties().childs().extendLeft.value(),
            d = this.properties().childs().extendRight.value()
          return (
            e.index <= t.index ? ((a = c), (h = d)) : ((a = d), (h = c)),
            [
              this._linePointsToAlertPlot(o, 'Upper', a, h),
              this._linePointsToAlertPlot(l, 'Lower', a, h),
            ].filter(r.notNull)
          )
        }
        async _getPropertyDefinitionsViewModelClass() {
          return (
            await Promise.all([
              i.e(6406),
              i.e(3889),
              i.e(8009),
              i.e(8056),
              i.e(8537),
            ]).then(i.bind(i, 41585))
          ).GeneralTrendFiguresDefinitionsViewModel
        }
        static _configureProperties(e) {
          super._configureProperties(e),
            e.hasChild('labelText') ||
              e.addChild('labelText', new p.Property('')),
            e.addExcludedKey('labelText', 1)
        }
      }
    },
  },
])
