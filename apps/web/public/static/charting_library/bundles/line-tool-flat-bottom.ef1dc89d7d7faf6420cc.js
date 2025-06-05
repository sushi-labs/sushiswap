;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9310],
  {
    90921: (e, t, i) => {
      i.r(t), i.d(t, { LineToolFlatBottom: () => l })
      var s = i(29875),
        n = i(32679),
        r = i(37265),
        o = i(12988),
        p = i(64147)
      class l extends s.LineDataSource {
        constructor(e, t, s, n) {
          super(
            e,
            t ?? l.createProperties(e.backgroundTheme().spawnOwnership()),
            s,
            n,
          ),
            (this.version = 1),
            (this._hasEditableCoordinates = new p.WatchedValue(!1)),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 73050))
              .then((e) => {
                this._setPaneViews([
                  new e.FlatBottomPaneView(this, this._model),
                ])
              })
        }
        pointsCount() {
          return 3
        }
        name() {
          return 'Flat Bottom'
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
          if (this._snapTo45DegreesApplicable(i) && 1 === e) {
            const e = 0
            this.snapPoint45Degree(t, this.points()[e])
          }
          const n = this._model.mainSeries().interval()
          if (2 === e)
            (this._points[1].index = t.index), (this._points[1].interval = n)
          else if (3 === e)
            return (
              (this._points[0].index = t.index),
              (this._points[0].interval = n),
              (this._points[2].price = t.price),
              void this._normalizePoints()
            )
          super.setPoint(e, t)
        }
        getPoint(e) {
          return e < 3
            ? super.getPoint(e)
            : 3 === e
              ? { index: this._points[0].index, price: this._points[2].price }
              : null
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
            defaultName: 'linetoolflatbottom',
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
          const n = { price: s.price, time: e.time, index: e.index },
            o = []
          let p, l, a, h
          s.index <= n.index ? (o.push(s), o.push(n)) : (o.push(n), o.push(s)),
            i[0].price > o[0].price
              ? ((p = i), (l = o))
              : o[0].price > i[0].price || o[1].price > i[1].price
                ? ((p = o), (l = i))
                : ((p = i), (l = o))
          const d = this.properties().childs().extendLeft.value(),
            u = this.properties().childs().extendRight.value()
          return (
            e.index <= t.index ? ((a = d), (h = u)) : ((a = u), (h = d)),
            [
              this._linePointsToAlertPlot(p, 'Upper', a, h),
              this._linePointsToAlertPlot(l, 'Lower', d, h),
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
              e.addChild('labelText', new o.Property('')),
            e.addExcludedKey('labelText', 1)
        }
      }
    },
  },
])
