;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5122],
  {
    28462: (e, r, s) => {
      s.r(r), s.d(r, { LineToolBrush: () => n })
      var t = s(32679),
        i = s(64195),
        o = s(73305)
      class n extends i.LineToolBrushBase {
        constructor(e, r, s, t) {
          super(
            e,
            r ?? n.createProperties(e.backgroundTheme().spawnOwnership()),
            s,
            t,
          ),
            this._loadPaneViews(e)
        }
        smooth() {
          return this.properties().childs().smooth.value()
        }
        name() {
          return 'Brush'
        }
        static createProperties(e, r) {
          const s = new t.DefaultProperty({
            defaultName: 'linetoolbrush',
            state: r,
            theme: e,
          })
          return this._configureProperties(s), s
        }
        _loadPaneViews(e) {
          Promise.all([s.e(6290), s.e(9116), s.e(1200), s.e(1583)])
            .then(s.bind(s, 68716))
            .then((r) => {
              this._setPaneViews([new r.BrushPaneView(this, e)])
            })
        }
        _getPropertyDefinitionsViewModelClass() {
          return Promise.all([
            s.e(6406),
            s.e(3889),
            s.e(8009),
            s.e(8056),
            s.e(8537),
          ])
            .then(s.bind(s, 32364))
            .then((e) => e.BrushDefinitionsViewModel)
        }
        static _configureProperties(e) {
          super._configureProperties(e),
            e.addChild(
              'backgroundsColors',
              new o.LineToolColorsProperty(
                [e.childs().backgroundColor],
                e.childs().fillBackground,
              ),
            ),
            e.hasChild('linestyle') && e.removeProperty('linestyle'),
            e.hasChild('linesStyles') && e.removeProperty('linesStyles')
        }
      }
    },
  },
])
