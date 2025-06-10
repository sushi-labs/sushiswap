;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5283],
  {
    30906: (e, t, r) => {
      r.r(t), r.d(t, { LineToolABCD: () => a })
      var n = r(50151),
        i = r(32679),
        o = r(29875),
        s = r(73305)
      class a extends o.LineDataSource {
        constructor(e, t, n, i) {
          super(
            e,
            t ?? a.createProperties(e.backgroundTheme().spawnOwnership()),
            n,
            i,
          ),
            Promise.all([r.e(6290), r.e(9116), r.e(1200), r.e(1583)])
              .then(r.bind(r, 76441))
              .then((t) => {
                this._setPaneViews([new t.ABCDPaneView(this, e)])
              })
        }
        pointsCount() {
          return 4
        }
        name() {
          return 'ABCD Pattern'
        }
        static createProperties(e, t) {
          const r = new i.DefaultProperty({
            defaultName: 'linetoolabcd',
            state: t,
            theme: e,
          })
          return this._configureProperties(r), r
        }
        _getPropertyDefinitionsViewModelClass() {
          return Promise.all([
            r.e(6406),
            r.e(3889),
            r.e(8009),
            r.e(8056),
            r.e(8537),
          ])
            .then(r.bind(r, 66085))
            .then((e) => e.PatternWithoutBackgroundDefinitionsViewModel)
        }
        static _configureProperties(e) {
          super._configureProperties(e),
            e.addChild(
              'linesColors',
              new s.LineToolColorsProperty([
                (0, n.ensureDefined)(e.child('color')),
              ]),
            ),
            e.addChild(
              'textsColors',
              new s.LineToolColorsProperty([
                (0, n.ensureDefined)(e.child('textcolor')),
              ]),
            )
        }
      }
    },
  },
])
