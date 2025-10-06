;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3378],
  {
    47267: (e, r, t) => {
      t.r(r), t.d(r, { LineToolHeadAndShoulders: () => s })
      var o = t(32679),
        n = t(29875),
        i = t(73305)
      class s extends n.LineDataSource {
        constructor(e, r, o, n) {
          super(
            e,
            r ?? s.createProperties(e.backgroundTheme().spawnOwnership()),
            o,
            n,
          ),
            Promise.all([t.e(6290), t.e(9116), t.e(1200), t.e(1583)])
              .then(t.bind(t, 29634))
              .then((r) => {
                this._setPaneViews([
                  new r.LineToolHeadAndShouldersPaneView(this, e),
                ])
              })
        }
        pointsCount() {
          return 7
        }
        name() {
          return 'Head and Shoulders'
        }
        static createProperties(e, r) {
          const t = new o.DefaultProperty({
            defaultName: 'linetoolheadandshoulders',
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
            .then(t.bind(t, 35737))
            .then((e) => e.PatternWithBackgroundDefinitionViewModel)
        }
        static _configureProperties(e) {
          super._configureProperties(e),
            e.addChild(
              'linesColors',
              new i.LineToolColorsProperty([e.childs().color]),
            ),
            e.addChild(
              'textsColors',
              new i.LineToolColorsProperty([e.childs().textcolor]),
            )
        }
      }
    },
  },
])
