;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [8820],
  {
    41124: (e, r, o) => {
      o.r(r), o.d(r, { LineToolFlagMark: () => a })
      var t = o(86441),
        n = o(29875),
        i = o(32679),
        s = o(73305)
      class a extends n.LineDataSource {
        constructor(e, r, n, i) {
          super(
            e,
            r ?? a.createProperties(e.backgroundTheme().spawnOwnership()),
            n,
            i,
          ),
            Promise.all([o.e(6290), o.e(9116), o.e(1200), o.e(1583)])
              .then(o.bind(o, 36134))
              .then(({ FlagMarkPaneView: e }) => {
                const r = new e(this, this.model())
                r.setAnchors(new t.Point(0, 0)), this._setPaneViews([r])
              })
        }
        pointsCount() {
          return 1
        }
        name() {
          return 'Flag Mark'
        }
        static createProperties(e, r) {
          r && void 0 === r.flagColor && (r.flagColor = '#318757')
          const o = new i.DefaultProperty({
            defaultName: 'linetoolflagmark',
            state: r,
            theme: e,
          })
          return this._configureProperties(o), o
        }
        _normalizePoint(e, r) {
          return (
            super._normalizePointWithoutOffset(e) ?? super._normalizePoint(e, r)
          )
        }
        _getPropertyDefinitionsViewModelClass() {
          return Promise.all([
            o.e(6406),
            o.e(3889),
            o.e(8009),
            o.e(8056),
            o.e(8537),
          ])
            .then(o.bind(o, 11138))
            .then((e) => e.FlagMarkDefinitionsViewModel)
        }
        static _configureProperties(e) {
          super._configureProperties(e),
            e.addChild(
              'backgroundsColors',
              new s.LineToolColorsProperty([e.childs().flagColor]),
            ),
            e.addExcludedKey('backgroundsColors', 3)
        }
      }
      a.version = 2
    },
  },
])
