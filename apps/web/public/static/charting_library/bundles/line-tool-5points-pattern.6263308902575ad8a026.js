;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1155],
  {
    17658: (e, t, r) => {
      r.r(t), r.d(t, { LineTool5PointsPattern: () => a })
      var n = r(50151),
        i = r(32679),
        o = r(29875),
        s = r(73305)
      class a extends o.LineDataSource {
        constructor(e, t, r, n) {
          super(
            e,
            t ?? a.createProperties(e.backgroundTheme().spawnOwnership()),
            r,
            n,
          ),
            this._loadPaneViews(e)
        }
        pointsCount() {
          return 5
        }
        name() {
          return 'XABCD Pattern'
        }
        static createProperties(e, t) {
          const r = new i.DefaultProperty({
            defaultName: 'linetool5pointspattern',
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
            .then(r.bind(r, 35737))
            .then((e) => e.PatternWithBackgroundDefinitionViewModel)
        }
        _loadPaneViews(e) {
          Promise.all([r.e(6290), r.e(9116), r.e(1200), r.e(1583)])
            .then(r.bind(r, 77142))
            .then((t) => {
              this._setPaneViews([new t.Pattern5pointsPaneView(this, e)])
            })
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
