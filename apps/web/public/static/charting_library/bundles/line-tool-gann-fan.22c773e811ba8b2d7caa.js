;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [4981],
  {
    15399: (e, t, s) => {
      s.d(t, { LevelsProperty: () => v })
      var r = s(90054),
        n = s(16738),
        i = s(37265),
        a = s(32679),
        l = s(35039)
      const o = {
        prefixes: [''],
        range: [0, 0],
        names: ['coeff', 'color', 'visible', 'linestyle', 'linewidth'],
        typecheck: { pack: () => Object(), unpack: () => [] },
      }
      function c(e, t, s, r) {
        return r.push(s[t]), r
      }
      function u(e, t, s, r) {
        return (r[t] = s[e]), r
      }
      function p() {
        return []
      }
      function h() {
        return {}
      }
      function f(e, t, s) {
        return (
          s.prefixes.forEach((r) => {
            const n = r + 'level'
            for (let r = s.range[0]; r <= s.range[1]; r++)
              if (e[n + r] && (0, i.isSameType)(e[n + r], t.typecheck())) {
                let i = t.tpl()
                s.names.forEach((s, a) => {
                  i = t.fill('' + a, s, e[n + r], i)
                }),
                  (e[n + r] = i)
              }
          }),
          e
        )
      }
      function d(e, t, s) {
        return s(e, { tpl: h, fill: u, typecheck: t.typecheck.unpack }, t)
      }
      class v extends a.DefaultProperty {
        constructor(e) {
          const { levelsIterator: t = f, map: s = {}, ...r } = e,
            n = { ...o, ...s }
          r.state && (r.state = d(r.state, n, t)),
            super(r),
            (this._map = n),
            (this._levelsIterator = t)
        }
        state(e, t, s) {
          const r = super.state(e, t)
          return s
            ? r
            : ((n = r),
              (i = this._map),
              (0, this._levelsIterator)(
                n,
                { tpl: p, fill: c, typecheck: i.typecheck.pack },
                i,
              ))
          var n, i
        }
        preferences() {
          return (0, a.extractState)(
            this.state(this._excludedDefaultsKeys, void 0, !0),
            this._allDefaultsKeys,
          )
        }
        applyTemplate(e, t) {
          this.mergeAndFire(
            (0, a.extractState)(
              (0, n.default)(
                (0, r.default)(t),
                d(e, this._map, this._levelsIterator),
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
          return new v(this._options())
        }
        merge(e, t) {
          return super.merge(
            this._map ? d(e, this._map, this._levelsIterator) : e,
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
    85259: (e, t, s) => {
      s.r(t), s.d(t, { LineToolGannFan: () => h })
      var r,
        n = s(50151),
        i = s(11542),
        a = s(15399),
        l = s(45126),
        o = s(85719),
        c = s(73305),
        u = s(29875)
      !((e) => {
        e[(e.LevelsCount = 9)] = 'LevelsCount'
      })(r || (r = {}))
      const p = new l.TranslatedString(
        'erase level line',
        i.t(null, void 0, s(77114)),
      )
      class h extends u.LineDataSource {
        constructor(e, t, r, n) {
          super(
            e,
            t ?? h.createProperties(e.backgroundTheme().spawnOwnership()),
            r,
            n,
          ),
            Promise.all([s.e(6290), s.e(9116), s.e(1200), s.e(1583)])
              .then(s.bind(s, 79890))
              .then(({ GannFanPaneView: e }) => {
                this._setPaneViews([new e(this, this._model)])
              })
        }
        levelsCount() {
          return 9
        }
        pointsCount() {
          return 2
        }
        name() {
          return 'Gann Fan'
        }
        processErase(e, t) {
          const s = 'level' + t,
            r = (0, n.ensureDefined)(this.properties().child(s)).childs()
              .visible
          e.setProperty(r, !1, p, o.lineToolsDoNotAffectChartInvalidation)
        }
        static createProperties(e, t) {
          const s = new a.LevelsProperty({
            defaultName: 'linetoolgannfan',
            state: t,
            map: { range: [1, 9] },
            theme: e,
          })
          return this._configureProperties(s), s
        }
        async _getPropertyDefinitionsViewModelClass() {
          return (
            await Promise.all([
              s.e(6406),
              s.e(3889),
              s.e(8009),
              s.e(8056),
              s.e(8537),
            ]).then(s.bind(s, 72443))
          ).GannFanDefinitionsViewModel
        }
        static _configureProperties(e) {
          super._configureProperties(e)
          const t = [],
            s = []
          for (let r = 1; r <= 9; r++) {
            const i = (0, n.ensureDefined)(e.child('level' + r))
            t.push((0, n.ensureDefined)(i.child('linewidth'))),
              s.push((0, n.ensureDefined)(i.child('color')))
          }
          e.addChild('linesColors', new c.LineToolColorsProperty(s)),
            e.addChild('linesWidths', new c.LineToolWidthsProperty(t))
        }
      }
    },
  },
])
