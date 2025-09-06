;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [569],
  {
    27621: (e, r, t) => {
      t.r(r),
        t.d(r, {
          LineToolArrowMark: () => l,
          LineToolArrowMarkDown: () => w,
          LineToolArrowMarkLeft: () => u,
          LineToolArrowMarkRight: () => c,
          LineToolArrowMarkUp: () => p,
        })
      var o = t(30699),
        n = t(32679),
        i = t(29875),
        s = t(12988),
        a = t(73305)
      class l extends i.LineDataSource {
        constructor(e, r, o, n, i) {
          super(
            e,
            r ??
              l.createProperties(e.backgroundTheme().spawnOwnership(), null, o),
            n,
            i,
          ),
            (this._textPaneView = null),
            Promise.all([t.e(6290), t.e(9116), t.e(1200), t.e(1583)])
              .then(t.bind(t, 54176))
              .then(({ ArrowMarkPaneView: r }) => {
                const t = [new r(this, e)]
                this._setPaneViews(t)
              })
        }
        paneViews(e) {
          const r = super.paneViews()
          return (
            null !== r && this._textPaneView && r.push(this._textPaneView), r
          )
        }
        pointsCount() {
          return 1
        }
        template() {
          const e = super.template()
          return (e.text = this.properties().childs().text.value()), e
        }
        static createProperties(e, r, t) {
          const o = new n.DefaultProperty({ defaultName: t, state: r })
          return this._configureProperties(o), o
        }
        _normalizePoint(e, r) {
          return (
            super._normalizePointWithoutOffset(e) ?? super._normalizePoint(e, r)
          )
        }
        _getPropertyDefinitionsViewModelClass() {
          return Promise.all([
            t.e(6406),
            t.e(3889),
            t.e(8009),
            t.e(8056),
            t.e(8537),
          ])
            .then(t.bind(t, 67675))
            .then((e) => e.ArrowMarkDefinitionsViewModel)
        }
        _applyTemplateImpl(e) {
          super._applyTemplateImpl(e),
            this.properties().childs().text.setValue(e.text)
        }
        static _configureProperties(e) {
          super._configureProperties(e),
            e.addChild(
              'linesColors',
              new a.LineToolColorsProperty([e.childs().arrowColor]),
            ),
            e.addChild(
              'textsColors',
              new a.LineToolColorsProperty([e.childs().color]),
            ),
            e.hasChild('text') || e.addChild('text', new s.Property('')),
            e.addExcludedKey('text', 1)
        }
      }
      l.version = 2
      class u extends l {
        constructor(e, r, t, o) {
          super(e, r, 'linetoolarrowmarkleft', t, o)
        }
        direction() {
          return 'left'
        }
        name() {
          return 'Arrow Mark Left'
        }
        textAlignParams() {
          return {
            horzAlign: o.HorizontalAlign.Left,
            vertAlign: o.VerticalAlign.Middle,
            offsetX: 22,
            offsetY: 3,
          }
        }
        static createProperties(e, r) {
          return super.createProperties(e, r, 'linetoolarrowmarkleft')
        }
      }
      class p extends l {
        constructor(e, r, t, o) {
          super(e, r, 'linetoolarrowmarkup', t, o)
        }
        direction() {
          return 'up'
        }
        name() {
          return 'Arrow Mark Up'
        }
        textAlignParams() {
          return {
            horzAlign: o.HorizontalAlign.Center,
            vertAlign: o.VerticalAlign.Top,
            offsetX: 0,
            offsetY: 20,
          }
        }
        static createProperties(e, r) {
          return super.createProperties(e, r, 'linetoolarrowmarkup')
        }
      }
      class c extends l {
        constructor(e, r, t, o) {
          super(e, r, 'linetoolarrowmarkright', t, o)
        }
        direction() {
          return 'right'
        }
        name() {
          return 'Arrow Mark Right'
        }
        textAlignParams() {
          return {
            horzAlign: o.HorizontalAlign.Right,
            vertAlign: o.VerticalAlign.Middle,
            offsetX: 22,
            offsetY: 3,
            forceTextAlign: !0,
          }
        }
        static createProperties(e, r) {
          return super.createProperties(e, r, 'linetoolarrowmarkright')
        }
      }
      class w extends l {
        constructor(e, r, t, o) {
          super(e, r, 'linetoolarrowmarkdown', t, o)
        }
        direction() {
          return 'down'
        }
        name() {
          return 'Arrow Mark Down'
        }
        textAlignParams() {
          return {
            horzAlign: o.HorizontalAlign.Center,
            vertAlign: o.VerticalAlign.Bottom,
            offsetX: 0,
            offsetY: 20,
          }
        }
        static createProperties(e, r) {
          return super.createProperties(e, r, 'linetoolarrowmarkdown')
        }
      }
    },
  },
])
