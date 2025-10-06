;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [8334],
  {
    4741: (e, t, i) => {
      i.r(t), i.d(t, { LineToolTimeCycles: () => o })
      var s = i(90054),
        n = i(32679),
        r = i(29875)
      class o extends r.LineDataSource {
        constructor(e, t, s, n) {
          super(
            e,
            t ?? o.createProperties(e.backgroundTheme().spawnOwnership()),
            s,
            n,
          ),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 80485))
              .then((e) => {
                this._setPaneViews([
                  new e.TimeCyclesPaneView(this, this._model),
                ])
              })
        }
        pointsCount() {
          return 2
        }
        name() {
          return 'Time Cycles'
        }
        setPoint(e, t) {
          const i = (0, s.default)(t),
            n = this._points[0],
            r = this._points[1]
          ;(n.price = i.price),
            (r.price = i.price),
            (this._points[e] = {
              ...i,
              interval: this._model.mainSeries().interval(),
            }),
            this._normalizePoints()
        }
        addPoint(e, t, i) {
          const s = super.addPoint(e, t, !0)
          if (s) {
            const e = this._points[0]
            ;(this._points[1].price = e.price),
              i || (this._normalizePoints(), this.createServerPoints())
          }
          return s
        }
        static createProperties(e, t) {
          const i = new n.DefaultProperty({
            defaultName: 'linetooltimecycles',
            state: t,
            theme: e,
          })
          return this._configureProperties(i), i
        }
        async _getPropertyDefinitionsViewModelClass() {
          return (
            await Promise.all([
              i.e(6406),
              i.e(3889),
              i.e(8009),
              i.e(8056),
              i.e(8537),
            ]).then(i.bind(i, 84437))
          ).TimeCyclesPatternDefinitionsViewModel
        }
      }
    },
  },
])
