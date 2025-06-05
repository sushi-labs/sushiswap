;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [8468, 5055],
  {
    15399: (e, t, i) => {
      i.d(t, { LevelsProperty: () => P })
      var r = i(90054),
        s = i(16738),
        n = i(37265),
        o = i(32679),
        l = i(35039)
      const a = {
        prefixes: [''],
        range: [0, 0],
        names: ['coeff', 'color', 'visible', 'linestyle', 'linewidth'],
        typecheck: { pack: () => Object(), unpack: () => [] },
      }
      function c(e, t, i, r) {
        return r.push(i[t]), r
      }
      function h(e, t, i, r) {
        return (r[t] = i[e]), r
      }
      function p() {
        return []
      }
      function d() {
        return {}
      }
      function u(e, t, i) {
        return (
          i.prefixes.forEach((r) => {
            const s = r + 'level'
            for (let r = i.range[0]; r <= i.range[1]; r++)
              if (e[s + r] && (0, n.isSameType)(e[s + r], t.typecheck())) {
                let n = t.tpl()
                i.names.forEach((i, o) => {
                  n = t.fill('' + o, i, e[s + r], n)
                }),
                  (e[s + r] = n)
              }
          }),
          e
        )
      }
      function f(e, t, i) {
        return i(e, { tpl: d, fill: h, typecheck: t.typecheck.unpack }, t)
      }
      class P extends o.DefaultProperty {
        constructor(e) {
          const { levelsIterator: t = u, map: i = {}, ...r } = e,
            s = { ...a, ...i }
          r.state && (r.state = f(r.state, s, t)),
            super(r),
            (this._map = s),
            (this._levelsIterator = t)
        }
        state(e, t, i) {
          const r = super.state(e, t)
          return i
            ? r
            : ((s = r),
              (n = this._map),
              (0, this._levelsIterator)(
                s,
                { tpl: p, fill: c, typecheck: n.typecheck.pack },
                n,
              ))
          var s, n
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
              (0, s.default)(
                (0, r.default)(t),
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
    20690: (e, t, i) => {
      i.r(t), i.d(t, { LineToolInsidePitchfork: () => n })
      var r = i(15399),
        s = i(64002)
      class n extends s.LineToolPitchfork {
        constructor(e, t, i, r) {
          super(
            e,
            t ?? n.createProperties(e.backgroundTheme().spawnOwnership()),
            i,
            r,
          )
        }
        name() {
          return 'Inside Pitchfork'
        }
        static createProperties(e, t) {
          const i = new r.LevelsProperty({
            defaultName: 'linetoolinsidepitchfork',
            state: t,
            map: { range: [0, 8] },
            theme: e,
          })
          return this._configureProperties(i), i
        }
      }
    },
    64002: (e, t, i) => {
      i.r(t), i.d(t, { LineToolPitchfork: () => m })
      var r = i(50151),
        s = i(45126),
        n = i(11542),
        o = i(29023),
        l = i(15399),
        a = i(85719),
        c = i(29875),
        h = i(73305),
        p = i(44672),
        d = i(96333)
      const u = new s.TranslatedString(
          'erase level line',
          n.t(null, void 0, i(77114)),
        ),
        f = new s.TranslatedString(
          'change {title} style',
          n.t(null, void 0, i(98463)),
        )
      var P
      !((e) => {
        e[(e.LevelsCount = 8)] = 'LevelsCount'
      })(P || (P = {}))
      class m extends c.LineDataSource {
        constructor(e, t, i, r) {
          super(
            e,
            t ?? m.createProperties(e.backgroundTheme().spawnOwnership()),
            i,
            r,
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
            r = [
              {
                title: n.t(null, void 0, i(46005)),
                actionId: 'Chart.LineTool.Pitchfork.ChangeTypeToOriginal',
              },
              {
                title: n.t(null, void 0, i(70382)),
                actionId: 'Chart.LineTool.Pitchfork.ChangeTypeToModifiedSchiff',
              },
              {
                title: n.t(null, void 0, i(91612)),
                actionId: 'Chart.LineTool.Pitchfork.ChangeTypeToInside',
              },
              {
                title: n.t(null, void 0, i(69904)),
                actionId: 'Chart.LineTool.Pitchfork.ChangeTypeToSchiff',
              },
            ]
          for (let i = 0; i < 4; i++) {
            const n = new o.Action({
              actionId: r[i].actionId,
              options: {
                checked: this.properties().childs().style.value() === i,
                checkable: !0,
                label: r[i].title,
                onExecute: () => {
                  e.setProperty(
                    this.properties().childs().style,
                    i,
                    f.format({
                      title: new s.TranslatedString(
                        this.name(),
                        this.translatedType(),
                      ),
                    }),
                    a.lineToolsDoNotAffectChartInvalidation,
                  ),
                    this.updateAllViews((0, p.sourceChangeEvent)(this.id())),
                    this._model.updateSource(this)
                },
              },
            })
            t.push(n)
          }
          return {
            actions: [t[0], t[3], t[1], t[2]],
            placement: 'CustomAction',
          }
        }
        processErase(e, t) {
          const i = 'level' + t,
            s = (0, r.ensureDefined)(this.properties().child(i)).childs()
              .visible
          e.setProperty(s, !1, u, a.lineToolsDoNotAffectChartInvalidation)
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
              i === d.LineToolPitchforkStyle.Original
                ? (t = [new e.PitchforkLinePaneView(this, this._model)])
                : i === d.LineToolPitchforkStyle.Schiff
                  ? (t = [new e.SchiffPitchforkLinePaneView(this, this._model)])
                  : i === d.LineToolPitchforkStyle.Schiff2
                    ? (t = [
                        new e.SchiffPitchfork2LinePaneView(this, this._model),
                      ])
                    : i === d.LineToolPitchforkStyle.Inside &&
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
          for (let s = 0; s <= 8; s++) {
            const n = (0, r.ensureDefined)(e.child('level' + s))
            t.push((0, r.ensureDefined)(n.child('linewidth'))),
              i.push((0, r.ensureDefined)(n.child('color')))
          }
          e.addChild('linesColors', new h.LineToolColorsProperty(i)),
            e.addChild('linesWidths', new h.LineToolWidthsProperty(t))
        }
      }
    },
  },
])
