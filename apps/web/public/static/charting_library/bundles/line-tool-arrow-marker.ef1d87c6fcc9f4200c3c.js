;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1470],
  {
    66403: (e, r, t) => {
      t.r(r), t.d(r, { LineToolArrowMarker: () => a })
      var i = t(29875),
        n = t(32679),
        s = t(12988)
      class a extends i.LineDataSource {
        constructor(e, r, i, n) {
          super(
            e,
            r ?? a.createProperties(e.backgroundTheme().spawnOwnership()),
            i,
            n,
          ),
            Promise.all([t.e(6290), t.e(9116), t.e(1200), t.e(1583)])
              .then(t.bind(t, 34823))
              .then(({ ArrowMarkerPaneView: e }) => {
                this._setPaneViews([new e(this, this.model())])
              })
        }
        pointsCount() {
          return 2
        }
        name() {
          return 'Arrow Marker'
        }
        snapTo45DegreesAvailable() {
          return !0
        }
        static createProperties(e, r) {
          const t = new n.DefaultProperty({
            defaultName: 'linetoolarrowmarker',
            state: r,
            theme: e,
          })
          return this._configureProperties(t), t
        }
        _getPropertyDefinitionsViewModelClass() {
          return Promise.all([
            t.e(6406),
            t.e(3889),
            t.e(8009),
            t.e(8056),
            t.e(8537),
          ])
            .then(t.bind(t, 86658))
            .then((e) => e.ArrowMarkerDefinitionsViewModel)
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
