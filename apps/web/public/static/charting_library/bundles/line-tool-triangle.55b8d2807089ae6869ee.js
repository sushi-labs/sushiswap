;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [6432],
  {
    39737: (e, r, i) => {
      i.r(r), i.d(r, { LineToolTriangle: () => o })
      var t = i(32679),
        n = i(29875),
        s = i(73305)
      class o extends n.LineDataSource {
        constructor(e, r, t, n) {
          super(
            e,
            r ?? o.createProperties(e.backgroundTheme().spawnOwnership()),
            t,
            n,
          ),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 86448))
              .then(({ TrianglePaneView: e }) => {
                this._setPaneViews([new e(this, this._model)])
              })
        }
        pointsCount() {
          return 3
        }
        name() {
          return 'Triangle'
        }
        static createProperties(e, r) {
          const i = new t.DefaultProperty({
            defaultName: 'linetooltriangle',
            state: r,
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
            ]).then(i.bind(i, 90490))
          ).GeneralFiguresDefinitionsViewModelBase
        }
        static _configureProperties(e) {
          super._configureProperties(e),
            e.addChild(
              'linesColors',
              new s.LineToolColorsProperty([e.childs().color]),
            )
        }
      }
    },
  },
])
