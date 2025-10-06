;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1506],
  {
    15399: (e, t, s) => {
      s.d(t, { LevelsProperty: () => v })
      var r = s(90054),
        i = s(16738),
        l = s(37265),
        n = s(32679),
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
      function h() {
        return []
      }
      function p() {
        return {}
      }
      function d(e, t, s) {
        return (
          s.prefixes.forEach((r) => {
            const i = r + 'level'
            for (let r = s.range[0]; r <= s.range[1]; r++)
              if (e[i + r] && (0, l.isSameType)(e[i + r], t.typecheck())) {
                let l = t.tpl()
                s.names.forEach((s, n) => {
                  l = t.fill('' + n, s, e[i + r], l)
                }),
                  (e[i + r] = l)
              }
          }),
          e
        )
      }
      function f(e, t, s) {
        return s(e, { tpl: p, fill: u, typecheck: t.typecheck.unpack }, t)
      }
      class v extends n.DefaultProperty {
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
              (l = this._map),
              (0, this._levelsIterator)(
                i,
                { tpl: h, fill: c, typecheck: l.typecheck.pack },
                l,
              ))
          var i, l
        }
        preferences() {
          return (0, n.extractState)(
            this.state(this._excludedDefaultsKeys, void 0, !0),
            this._allDefaultsKeys,
          )
        }
        applyTemplate(e, t) {
          this.mergeAndFire(
            (0, n.extractState)(
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
          return new v(this._options())
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
    8532: (e, t, s) => {
      s.r(t),
        s.d(t, {
          LineToolFibTimeZone: () => d,
          NumConsts: () => h,
          StringConsts: () => p,
          Versions: () => u,
        })
      var r = s(11542),
        i = s(45126),
        l = s(73305),
        n = s(15399),
        o = s(85719),
        a = s(29875)
      const c = new i.TranslatedString(
        'erase level line',
        r.t(null, void 0, s(77114)),
      )
      var u, h, p
      !((e) => {
        ;(e[(e.InitVersion = 1)] = 'InitVersion'),
          (e[(e.SecondVersion = 2)] = 'SecondVersion'),
          (e[(e.CurrentVersion = 2)] = 'CurrentVersion')
      })(u || (u = {})),
        ((e) => {
          ;(e[(e.LevelsCount = 11)] = 'LevelsCount'),
            (e[(e.PointsCount = 2)] = 'PointsCount')
        })(h || (h = {})),
        ((e) => {
          e.Name = 'Fib Time Zone'
        })(p || (p = {}))
      class d extends a.LineDataSource {
        constructor(e, t, r, i) {
          super(
            e,
            t ?? d.createProperties(e.backgroundTheme().spawnOwnership()),
            r,
            i,
          ),
            (this.version = 2),
            Promise.all([s.e(6290), s.e(9116), s.e(1200), s.e(1583)])
              .then(s.bind(s, 18449))
              .then(({ FibTimeZonePaneView: e }) => {
                this._setPaneViews([new e(this, this._model)])
              })
        }
        levelsCount() {
          return 11
        }
        migrateVersion(e, t, s) {
          if (1 === e) {
            const e = s.properties.childs(),
              t = s.properties,
              r = t.baselinecolor.value(),
              i = t.linecolor.value(),
              l = t.linewidth.value(),
              n = t.linestyle.value()
            e.level1.childs().color.setValue(r)
            for (let t = 2; t <= 11; t++)
              e['level' + t].childs().color.setValue(i)
            for (let t = 1; t <= 11; t++)
              e['level' + t].childs().linewidth.setValue(l),
                e['level' + t].childs().linestyle.setValue(n)
          }
        }
        pointsCount() {
          return 2
        }
        name() {
          return 'Fib Time Zone'
        }
        processErase(e, t) {
          const s = 'level' + t,
            r = this.properties().childs()[s].childs().visible
          e.setProperty(r, !1, c, o.lineToolsDoNotAffectChartInvalidation)
        }
        static createProperties(e, t) {
          const s = new n.LevelsProperty({
            defaultName: 'linetoolfibtimezone',
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
            ]).then(s.bind(s, 23720))
          ).FibTimezoneDefinitionsViewModel
        }
        static _configureProperties(e) {
          super._configureProperties(e)
          const t = [],
            s = [],
            r = []
          for (let i = 1; i <= 11; i++) {
            const l = e.childs()['level' + i].childs()
            t.push(l.linewidth), s.push(l.color), r.push(l.linestyle)
          }
          e.addChild('linesColors', new l.LineToolColorsProperty(s)),
            e.addChild('linesWidths', new l.LineToolWidthsProperty(t)),
            e.addChild('linesStyles', new l.LineToolCollectedProperty(r)),
            e.hasChild('baselinecolor') && e.removeProperty('baselinecolor'),
            e.hasChild('linecolor') && e.removeProperty('linecolor'),
            e.hasChild('linewidth') && e.removeProperty('linewidth'),
            e.hasChild('linestyle') && e.removeProperty('linestyle')
        }
      }
    },
  },
])
