;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [6336],
  {
    15399: (e, t, s) => {
      s.d(t, { LevelsProperty: () => v })
      var r = s(90054),
        i = s(16738),
        n = s(37265),
        l = s(32679),
        o = s(35039)
      const c = {
        prefixes: [''],
        range: [0, 0],
        names: ['coeff', 'color', 'visible', 'linestyle', 'linewidth'],
        typecheck: { pack: () => Object(), unpack: () => [] },
      }
      function a(e, t, s, r) {
        return r.push(s[t]), r
      }
      function h(e, t, s, r) {
        return (r[t] = s[e]), r
      }
      function u() {
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
        return s(e, { tpl: p, fill: h, typecheck: t.typecheck.unpack }, t)
      }
      class v extends l.DefaultProperty {
        constructor(e) {
          const { levelsIterator: t = d, map: s = {}, ...r } = e,
            i = { ...c, ...s }
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
                { tpl: u, fill: a, typecheck: n.typecheck.pack },
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
    12121: (e, t, s) => {
      s.d(t, { createPropertiesObject: () => o })
      var r = s(37265),
        i = s(15399)
      function n(e, t, s) {
        for (const i of Object.keys(e.levels ?? {}))
          if (e.levels[i] && (0, r.isSameType)(e.levels[i], t.typecheck())) {
            let r = t.tpl()
            s.names.forEach((s, n) => {
              r = t.fill('' + n, s, e.levels[i], r)
            }),
              (e.levels[i] = r)
          }
        return e
      }
      class l extends i.LevelsProperty {
        constructor(e, t, s) {
          super({
            defaultName: e,
            state: s,
            map: { names: ['width', 'color', 'visible'] },
            levelsIterator: n,
            theme: t,
          })
        }
      }
      function o(e, t, s) {
        return new l(e, t, s)
      }
    },
    8308: (e, t, s) => {
      s.r(t), s.d(t, { LineToolGannFixed: () => c })
      var r = s(86441),
        i = s(50151),
        n = s(29875),
        l = s(73305),
        o = s(12121)
      class c extends n.LineDataSource {
        constructor(e, t, r, i) {
          super(
            e,
            t ?? c.createProperties(e.backgroundTheme().spawnOwnership()),
            r,
            i,
          ),
            (this._constructor = 'LineToolGannFixed'),
            Promise.all([s.e(6290), s.e(9116), s.e(1200), s.e(1583)])
              .then(s.bind(s, 57736))
              .then(({ GannFixedPaneView: e }) => {
                this._setPaneViews([new e(this, this.model())])
              }),
            this.properties()
              .childs()
              .reverse.subscribe(this, this._reversePoints)
        }
        pointsCount() {
          return 2
        }
        name() {
          return 'Gann Square Fixed'
        }
        axisPoints() {
          const e = this.points(),
            t = this.getScreenPoints()
          return e.length < 2 || t.length < 2
            ? []
            : [e[0], (0, i.ensureNotNull)(this.screenPointToPoint(t[1]))]
        }
        getScreenPoints() {
          const e = this.points()
          if (e.length < 2) return []
          const t = this._calcAngle()
          if (null === t) return []
          const [s, n] = e,
            l = (0, i.ensureNotNull)(this.pointToScreenPoint(s)),
            o = (0, i.ensureNotNull)(this.pointToScreenPoint(n)),
            c = Math.sqrt(Math.pow(l.x - o.x, 2) + Math.pow(l.y - o.y, 2)),
            a = new r.Point(Math.cos(t), -Math.sin(t)),
            h = a.normalized(),
            u = h.x < 0 ? -1 : 1,
            p = h.y < 0 ? -1 : 1
          return [l.addScaled(a, c), l.add(new r.Point(5 * c * u, 5 * c * p))]
        }
        levelsCount() {
          return this.properties().childs().levels.childCount()
        }
        levels() {
          const e = [],
            t = this.properties().childs(),
            s = t.levels.childCount()
          for (let r = 0; r < s; r++) {
            const s = t.levels.childs()[r].childs()
            e.push({
              index: r,
              visible: s.visible.value(),
              color: s.color.value(),
              width: s.width.value(),
            })
          }
          return e
        }
        fanLinesCount() {
          return this.properties().childs().fanlines.childCount()
        }
        fanLines() {
          const e = [],
            t = this.properties().childs(),
            s = t.fanlines.childCount()
          for (let r = 0; r < s; r++) {
            const s = t.fanlines.childs()[r].childs()
            e.push({
              index: r,
              visible: s.visible.value(),
              x: s.x.value(),
              y: s.y.value(),
              color: s.color.value(),
              width: s.width.value(),
            })
          }
          return e
        }
        arcsCount() {
          return this.properties().childs().arcs.childCount()
        }
        arcs() {
          const e = [],
            t = this.properties().childs(),
            s = t.arcs.childCount()
          for (let r = 0; r < s; r++) {
            const s = t.arcs.childs()[r].childs()
            e.push({
              index: r,
              visible: s.visible.value(),
              x: s.x.value(),
              y: s.y.value(),
              color: s.color.value(),
              width: s.width.value(),
            })
          }
          return e
        }
        arcsBackgroundTransparency() {
          return this.properties()
            .childs()
            .arcsBackground.childs()
            .transparency.value()
        }
        isArcsBackgroundFilled() {
          return this.properties()
            .childs()
            .arcsBackground.childs()
            .fillBackground.value()
        }
        static createProperties(e, t) {
          const s = (0, o.createPropertiesObject)('linetoolgannfixed', e, t)
          return this._configureProperties(s), s
        }
        _getPropertyDefinitionsViewModelClass() {
          return Promise.all([
            s.e(6406),
            s.e(3889),
            s.e(8009),
            s.e(8056),
            s.e(8537),
          ])
            .then(s.bind(s, 53894))
            .then((e) => e.GannComplexAndFixedDefinitionsViewModel)
        }
        static _configureProperties(e) {
          super._configureProperties(e)
          const t = [],
            s = [],
            r = e.childs()
          {
            const e = r.levels.childCount()
            for (let i = 0; i < e; i++) {
              const e = r.levels.childs()[i].childs()
              t.push(e.width), s.push(e.color)
            }
          }
          {
            const e = r.fanlines.childCount()
            for (let i = 0; i < e; i++) {
              const e = r.fanlines.childs()[i].childs()
              t.push(e.width), s.push(e.color)
            }
          }
          {
            const e = r.arcs.childCount()
            for (let i = 0; i < e; i++) {
              const e = r.arcs.childs()[i].childs()
              t.push(e.width), s.push(e.color)
            }
          }
          e.addChild('linesColors', new l.LineToolColorsProperty(s)),
            e.addChild('linesWidths', new l.LineToolWidthsProperty(t))
        }
        _calcAngle() {
          const e = this.points()
          if (e.length < 2) return null
          const [t, s] = e,
            r = this.pointToScreenPoint(t),
            i = this.pointToScreenPoint(s)
          if (null === r || null === i) return null
          let n = i.subtract(r)
          if (n.length() <= 0) return null
          n = n.normalized()
          let l = Math.acos(n.x)
          return n.y > 0 && (l = -l), l
        }
        _reversePoints() {
          const [e, t] = this._points
          ;(this._points[0] = t),
            (this._points[1] = e),
            this._normalizePoints(),
            this.restart()
        }
      }
    },
  },
])
