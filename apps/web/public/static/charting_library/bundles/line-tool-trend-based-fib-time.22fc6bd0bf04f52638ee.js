;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7127],
  {
    15399: (e, t, s) => {
      s.d(t, { LevelsProperty: () => m })
      var r = s(90054),
        i = s(16738),
        n = s(37265),
        l = s(32679),
        o = s(35039)
      const a = {
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
      function d(e, t, s) {
        return (
          s.prefixes.forEach((r) => {
            const i = r + 'level'
            for (let r = s.range[0]; r <= s.range[1]; r++)
              if (e[i + r] && (0, n.isSameType)(e[i + r], t.typecheck())) {
                let n = t.tpl()
                s.names.forEach((s, l) => {
                  n = t.fill('' + l, s, e[i + r], n)
                }),
                  (e[i + r] = n)
              }
          }),
          e
        )
      }
      function f(e, t, s) {
        return s(e, { tpl: h, fill: u, typecheck: t.typecheck.unpack }, t)
      }
      class m extends l.DefaultProperty {
        constructor(e) {
          const { levelsIterator: t = d, map: s = {}, ...r } = e,
            i = { ...a, ...s }
          r.state && (r.state = f(r.state, i, t)),
            super(r),
            (this._map = i),
            (this._levelsIterator = t)
        }
        state(e, t, s) {
          const r = super.state(e, t)
          return s
            ? r
            : ((i = r),
              (n = this._map),
              (0, this._levelsIterator)(
                i,
                { tpl: p, fill: c, typecheck: n.typecheck.pack },
                n,
              ))
          var i, n
        }
        preferences() {
          return (0, l.extractState)(
            this.state(this._excludedDefaultsKeys, void 0, !0),
            this._allDefaultsKeys,
          )
        }
        applyTemplate(e, t) {
          this.mergeAndFire(
            (0, l.extractState)(
              (0, i.default)(
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
            (0, o.saveDefaults)(this._defaultName, this.preferences())
        }
        clone() {
          return new m(this._options())
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
    27172: (e, t, s) => {
      s.r(t),
        s.d(t, {
          LineToolTrendBasedFibTime: () => d,
          NumConsts: () => p,
          StringConsts: () => h,
          Versions: () => u,
        })
      var r = s(11542),
        i = s(45126),
        n = s(29875),
        l = s(15399),
        o = s(73305),
        a = s(85719)
      const c = new i.TranslatedString(
        'erase level line',
        r.t(null, void 0, s(77114)),
      )
      var u, p, h
      !((e) => {
        ;(e[(e.InitVersion = 1)] = 'InitVersion'),
          (e[(e.CurrentVersion = 1)] = 'CurrentVersion')
      })(u || (u = {})),
        ((e) => {
          ;(e[(e.LevelsCount = 11)] = 'LevelsCount'),
            (e[(e.PointsCount = 3)] = 'PointsCount')
        })(p || (p = {})),
        ((e) => {
          e.Name = 'Trend-Based Fib Time'
        })(h || (h = {}))
      class d extends n.LineDataSource {
        constructor(e, t, r, i) {
          super(
            e,
            t ?? d.createProperties(e.backgroundTheme().spawnOwnership()),
            r,
            i,
          ),
            (this.version = 1),
            Promise.all([s.e(6290), s.e(9116), s.e(1200), s.e(1583)])
              .then(s.bind(s, 57175))
              .then(({ TrendBasedFibTimePaneView: e }) => {
                this._setPaneViews([new e(this, this._model)])
              })
        }
        levelsCount() {
          return 11
        }
        pointsCount() {
          return 3
        }
        name() {
          return 'Trend-Based Fib Time'
        }
        processErase(e, t) {
          const s = 'level' + t,
            r = this.properties().childs()[s].childs().visible
          e.setProperty(r, !1, c, a.lineToolsDoNotAffectChartInvalidation)
        }
        static createProperties(e, t) {
          const s = new l.LevelsProperty({
            defaultName: 'linetooltrendbasedfibtime',
            state: t,
            map: { range: [1, 11] },
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
            ]).then(s.bind(s, 46662))
          ).TrendBasedFibTimeDefinitionsViewModel
        }
        static _configureProperties(e) {
          super._configureProperties(e)
          const t = e.childs(),
            s = [t.trendline.childs().linewidth],
            r = [t.trendline.childs().color]
          for (let e = 1; e <= 11; e++)
            s.push(t['level' + e].childs().linewidth),
              r.push(t['level' + e].childs().color)
          e.addChild('linesColors', new o.LineToolColorsProperty(r)),
            e.addChild('linesWidths', new o.LineToolWidthsProperty(s))
        }
      }
    },
  },
])
