;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5055],
  {
    15399: (e, t, i) => {
      i.d(t, { LevelsProperty: () => P })
      var s = i(90054),
        n = i(16738),
        r = i(37265),
        o = i(32679),
        l = i(35039)
      const a = {
        prefixes: [''],
        range: [0, 0],
        names: ['coeff', 'color', 'visible', 'linestyle', 'linewidth'],
        typecheck: { pack: () => Object(), unpack: () => [] },
      }
      function c(e, t, i, s) {
        return s.push(i[t]), s
      }
      function h(e, t, i, s) {
        return (s[t] = i[e]), s
      }
      function d() {
        return []
      }
      function p() {
        return {}
      }
      function u(e, t, i) {
        return (
          i.prefixes.forEach((s) => {
            const n = s + 'level'
            for (let s = i.range[0]; s <= i.range[1]; s++)
              if (e[n + s] && (0, r.isSameType)(e[n + s], t.typecheck())) {
                let r = t.tpl()
                i.names.forEach((i, o) => {
                  r = t.fill('' + o, i, e[n + s], r)
                }),
                  (e[n + s] = r)
              }
          }),
          e
        )
      }
      function f(e, t, i) {
        return i(e, { tpl: p, fill: h, typecheck: t.typecheck.unpack }, t)
      }
      class P extends o.DefaultProperty {
        constructor(e) {
          const { levelsIterator: t = u, map: i = {}, ...s } = e,
            n = { ...a, ...i }
          s.state && (s.state = f(s.state, n, t)),
            super(s),
            (this._map = n),
            (this._levelsIterator = t)
        }
        state(e, t, i) {
          const s = super.state(e, t)
          return i
            ? s
            : ((n = s),
              (r = this._map),
              (0, this._levelsIterator)(
                n,
                { tpl: d, fill: c, typecheck: r.typecheck.pack },
                r,
              ))
          var n, r
        }
        preferences() {
          return (0, o.extractState)(
            this.state(this._excludedDefaultsKeys, void 0, !0),
            this._allDefaultsKeys,
          )
        }
        applyTemplate(e, t) {
          this.mergeAndFire(
            (0, o.extractState)(
              (0, n.default)(
                (0, s.default)(t),
                f(e, this._map, this._levelsIterator),
              ),
              this._allStateKeys,
              this._excludedTemplateKeys,
            ),
          )
        }
        saveDefaults() {
          this._useUserPreferences &&
            (0, l.saveDefaults)(this._defaultName, this.preferences())
        }
        clone() {
          return new P(this._options())
        }
        merge(e, t) {
          return super.merge(
            this._map ? f(e, this._map, this._levelsIterator) : e,
            t,
          )
        }
        _options() {
          return {
            ...super._options(),
            map: { ...this._map },
            levelsIterator: this._levelsIterator,
          }
        }
      }
    },
    64002: (e, t, i) => {
      i.r(t), i.d(t, { LineToolPitchfork: () => v })
      var s = i(50151),
        n = i(45126),
        r = i(11542),
        o = i(29023),
        l = i(15399),
        a = i(85719),
        c = i(29875),
        h = i(73305),
        d = i(44672),
        p = i(96333)
      const u = new n.TranslatedString(
          'erase level line',
          r.t(null, void 0, i(77114)),
        ),
        f = new n.TranslatedString(
          'change {title} style',
          r.t(null, void 0, i(98463)),
        )
      var P
      !((e) => {
        e[(e.LevelsCount = 8)] = 'LevelsCount'
      })(P || (P = {}))
      class v extends c.LineDataSource {
        constructor(e, t, i, s) {
          super(
            e,
            t ?? v.createProperties(e.backgroundTheme().spawnOwnership()),
            i,
            s,
          ),
            this._properties
              .childs()
              .style.subscribe(this, this._recreatePaneView),
            this._recreatePaneView()
        }
        pointsCount() {
          return 3
        }
        name() {
          return 'Pitchfork'
        }
        levelsCount() {
          return 8
        }
        async additionalActions(e) {
          const t = [],
            s = [
              {
                title: r.t(null, void 0, i(46005)),
                actionId: 'Chart.LineTool.Pitchfork.ChangeTypeToOriginal',
              },
              {
                title: r.t(null, void 0, i(70382)),
                actionId: 'Chart.LineTool.Pitchfork.ChangeTypeToModifiedSchiff',
              },
              {
                title: r.t(null, void 0, i(91612)),
                actionId: 'Chart.LineTool.Pitchfork.ChangeTypeToInside',
              },
              {
                title: r.t(null, void 0, i(69904)),
                actionId: 'Chart.LineTool.Pitchfork.ChangeTypeToSchiff',
              },
            ]
          for (let i = 0; i < 4; i++) {
            const r = new o.Action({
              actionId: s[i].actionId,
              options: {
                checked: this.properties().childs().style.value() === i,
                checkable: !0,
                label: s[i].title,
                onExecute: () => {
                  e.setProperty(
                    this.properties().childs().style,
                    i,
                    f.format({
                      title: new n.TranslatedString(
                        this.name(),
                        this.translatedType(),
                      ),
                    }),
                    a.lineToolsDoNotAffectChartInvalidation,
                  ),
                    this.updateAllViews((0, d.sourceChangeEvent)(this.id())),
                    this._model.updateSource(this)
                },
              },
            })
            t.push(r)
          }
          return {
            actions: [t[0], t[3], t[1], t[2]],
            placement: 'CustomAction',
          }
        }
        processErase(e, t) {
          const i = 'level' + t,
            n = (0, s.ensureDefined)(this.properties().child(i)).childs()
              .visible
          e.setProperty(n, !1, u, a.lineToolsDoNotAffectChartInvalidation)
        }
        static createProperties(e, t) {
          const i = new l.LevelsProperty({
            defaultName: 'linetoolpitchfork',
            state: t,
            map: { range: [0, 8] },
            theme: e,
          })
          return this._configureProperties(i), i
        }
        async _recreatePaneView() {
          Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
            .then(i.bind(i, 68470))
            .then((e) => {
              let t = []
              const i = this._properties.childs().style.value()
              i === p.LineToolPitchforkStyle.Original
                ? (t = [new e.PitchforkLinePaneView(this, this._model)])
                : i === p.LineToolPitchforkStyle.Schiff
                  ? (t = [new e.SchiffPitchforkLinePaneView(this, this._model)])
                  : i === p.LineToolPitchforkStyle.Schiff2
                    ? (t = [
                        new e.SchiffPitchfork2LinePaneView(this, this._model),
                      ])
                    : i === p.LineToolPitchforkStyle.Inside &&
                      (t = [
                        new e.InsidePitchforkLinePaneView(this, this._model),
                      ]),
                this._setPaneViews(t)
            })
        }
        async _getPropertyDefinitionsViewModelClass() {
          return (
            await Promise.all([
              i.e(6406),
              i.e(3889),
              i.e(8009),
              i.e(8056),
              i.e(8537),
            ]).then(i.bind(i, 10258))
          ).PitchForkDefinitionsViewModel
        }
        static _configureProperties(e) {
          super._configureProperties(e)
          const t = [e.childs().median.childs().linewidth],
            i = [e.childs().median.childs().color]
          for (let n = 0; n <= 8; n++) {
            const r = (0, s.ensureDefined)(e.child('level' + n))
            t.push((0, s.ensureDefined)(r.child('linewidth'))),
              i.push((0, s.ensureDefined)(r.child('color')))
          }
          e.addChild('linesColors', new h.LineToolColorsProperty(i)),
            e.addChild('linesWidths', new h.LineToolWidthsProperty(t))
        }
      }
    },
  },
])
