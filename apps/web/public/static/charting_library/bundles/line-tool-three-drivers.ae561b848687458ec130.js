;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [4602],
  {
    46660: (e, r, t) => {
      t.r(r), t.d(r, { LineToolThreeDrivers: () => n })
      var o = t(32679),
        i = t(29875),
        s = t(73305)
      class n extends i.LineDataSource {
        constructor(e, r, o, i) {
          super(
            e,
            r ?? n.createProperties(e.backgroundTheme().spawnOwnership()),
            o,
            i,
          ),
            Promise.all([t.e(6290), t.e(9116), t.e(1200), t.e(1583)])
              .then(t.bind(t, 6822))
              .then((r) => {
                this._setPaneViews([new r.LineToolThreeDrivesPaneView(this, e)])
              })
        }
        pointsCount() {
          return 7
        }
        name() {
          return 'Three Drives Pattern'
        }
        static createProperties(e, r) {
          const t = new o.DefaultProperty({
            defaultName: 'linetoolthreedrivers',
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
            .then(t.bind(t, 66085))
            .then((e) => e.PatternWithoutBackgroundDefinitionsViewModel)
        }
        static _configureProperties(e) {
          super._configureProperties(e),
            e.addChild(
              'linesColors',
              new s.LineToolColorsProperty([e.childs().color]),
            ),
            e.addChild(
              'textsColors',
              new s.LineToolColorsProperty([e.childs().textcolor]),
            ),
            e.addChild(
              'linesWidths',
              new s.LineToolWidthsProperty([e.childs().linewidth]),
            ),
            e.hasChild('backgroundsColors') &&
              e.removeProperty('backgroundsColors')
        }
      }
    },
  },
])
