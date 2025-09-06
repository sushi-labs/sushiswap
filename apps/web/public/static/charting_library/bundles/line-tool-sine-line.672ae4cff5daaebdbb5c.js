;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1713],
  {
    8066: (e, n, i) => {
      i.r(n), i.d(n, { LineToolSineLine: () => s })
      var t = i(32679),
        r = i(29875)
      class s extends r.LineDataSource {
        constructor(e, n, t, r) {
          super(
            e,
            n ?? s.createProperties(e.backgroundTheme().spawnOwnership()),
            t,
            r,
          ),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 14661))
              .then((e) => {
                this._setPaneViews([new e.SineLinePaneView(this, this._model)])
              })
        }
        pointsCount() {
          return 2
        }
        name() {
          return 'Sine Line'
        }
        static createProperties(e, n) {
          const i = new t.DefaultProperty({
            defaultName: 'linetoolsineline',
            state: n,
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
            ]).then(i.bind(i, 3868))
          ).CyclicAndSineLinesPatternDefinitionsViewModel
        }
      }
    },
  },
])
