;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [6484],
  {
    83710: (e, r, i) => {
      i.r(r), i.d(r, { LineToolPriceLabel: () => s })
      var t = i(32679),
        o = i(29875),
        n = i(73305)
      class s extends o.LineDataSource {
        constructor(e, r, t, o) {
          super(
            e,
            r ?? s.createProperties(e.backgroundTheme().spawnOwnership()),
            t,
            o,
          ),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 4465))
              .then((e) => {
                this._setPaneViews([
                  new e.PriceLabelPaneView(this, this._model),
                ])
              })
        }
        pointsCount() {
          return 1
        }
        name() {
          return 'Price Label'
        }
        static createProperties(e, r) {
          const i = new t.DefaultProperty({
            defaultName: 'linetoolpricelabel',
            state: r,
            theme: e,
          })
          return this._configureProperties(i), i
        }
        _normalizePoint(e, r) {
          return (
            super._normalizePointWithoutOffset(e) ?? super._normalizePoint(e, r)
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
            ]).then(i.bind(i, 89785))
          ).PriceLabelDefinitionsViewModel
        }
        static _configureProperties(e) {
          super._configureProperties(e),
            e.addChild(
              'linesColors',
              new n.LineToolColorsProperty([e.childs().borderColor]),
            ),
            e.addChild(
              'textsColors',
              new n.LineToolColorsProperty([e.childs().color]),
            )
        }
      }
    },
  },
])
