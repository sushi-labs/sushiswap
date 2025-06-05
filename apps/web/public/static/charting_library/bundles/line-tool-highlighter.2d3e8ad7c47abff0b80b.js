;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2087],
  {
    65539: (e, i, t) => {
      t.r(i), t.d(i, { LineToolHighlighter: () => h })
      var r = t(32679),
        s = t(64195),
        n = t(73305)
      class h extends s.LineToolBrushBase {
        constructor(e, i, t, r) {
          super(
            e,
            i ?? h.createProperties(e.backgroundTheme().spawnOwnership()),
            t,
            r,
          ),
            this._loadPaneViews(e)
        }
        smooth() {
          return this.properties().childs().smooth.value()
        }
        name() {
          return 'Highlighter'
        }
        static createProperties(e, i) {
          const t = new r.DefaultProperty({
            defaultName: 'linetoolhighlighter',
            state: i,
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
            .then(t.bind(t, 14542))
            .then((e) => e.HighlighterDefinitionsViewModel)
        }
        _loadPaneViews(e) {
          Promise.all([t.e(6290), t.e(9116), t.e(1200), t.e(1583)])
            .then(t.bind(t, 64332))
            .then((i) => {
              this._setPaneViews([new i.HighlighterPaneView(this, e)])
            })
        }
        static _configureProperties(e) {
          super._configureProperties(e),
            e.addChild(
              'widths',
              new n.LineToolWidthsProperty([e.childs().width]),
            ),
            e.addExcludedKey('widths', 3)
        }
      }
    },
  },
])
