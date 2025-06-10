;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9478],
  {
    15399: (e, t, n) => {
      n.d(t, { LevelsProperty: () => _ })
      var s = n(90054),
        i = n(16738),
        r = n(37265),
        o = n(32679),
        l = n(35039)
      const a = {
        prefixes: [''],
        range: [0, 0],
        names: ['coeff', 'color', 'visible', 'linestyle', 'linewidth'],
        typecheck: { pack: () => Object(), unpack: () => [] },
      }
      function c(e, t, n, s) {
        return s.push(n[t]), s
      }
      function p(e, t, n, s) {
        return (s[t] = n[e]), s
      }
      function h() {
        return []
      }
      function u() {
        return {}
      }
      function f(e, t, n) {
        return (
          n.prefixes.forEach((s) => {
            const i = s + 'level'
            for (let s = n.range[0]; s <= n.range[1]; s++)
              if (e[i + s] && (0, r.isSameType)(e[i + s], t.typecheck())) {
                let r = t.tpl()
                n.names.forEach((n, o) => {
                  r = t.fill('' + o, n, e[i + s], r)
                }),
                  (e[i + s] = r)
              }
          }),
          e
        )
      }
      function d(e, t, n) {
        return n(e, { tpl: u, fill: p, typecheck: t.typecheck.unpack }, t)
      }
      class _ extends o.DefaultProperty {
        constructor(e) {
          const { levelsIterator: t = f, map: n = {}, ...s } = e,
            i = { ...a, ...n }
          s.state && (s.state = d(s.state, i, t)),
            super(s),
            (this._map = i),
            (this._levelsIterator = t)
        }
        state(e, t, n) {
          const s = super.state(e, t)
          return n
            ? s
            : ((i = s),
              (r = this._map),
              (0, this._levelsIterator)(
                i,
                { tpl: h, fill: c, typecheck: r.typecheck.pack },
                r,
              ))
          var i, r
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
              (0, i.default)(
                (0, s.default)(t),
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
          return new _(this._options())
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
    9770: (e, t, n) => {
      n.r(t), n.d(t, { LineToolGannSquare: () => p })
      var s,
        i = n(50151),
        r = n(29875),
        o = n(73305),
        l = n(15399)
      !((e) => {
        ;(e[(e.HLevelsCount = 7)] = 'HLevelsCount'),
          (e[(e.VLevelsCount = 7)] = 'VLevelsCount')
      })(s || (s = {}))
      const a = [4.5, 9, 11.25, 18, 22.5, 36, 45],
        c = (() => {
          const e = [],
            t = a.length - 1
          let n = 1,
            s = 0,
            i = 0
          while (i < 1e10)
            (i = a[s] * n),
              e.push(Math.round(i)),
              e.push(Math.ceil(-i)),
              s === t - 1 && (n *= 10),
              (s = (s + 1) % t)
          return e.sort((e, t) => e - t)
        })()
      class p extends r.LineDataSource {
        constructor(e, t, s, i) {
          super(
            e,
            t ?? p.createProperties(e.backgroundTheme().spawnOwnership()),
            s,
            i,
          ),
            Promise.all([n.e(6290), n.e(9116), n.e(1200), n.e(1583)])
              .then(n.bind(n, 10349))
              .then(({ GannSquarePaneView: e }) => {
                this._setPaneViews([new e(this, this._model)])
              })
        }
        hLevelsCount() {
          return 7
        }
        vLevelsCount() {
          return 7
        }
        pointsCount() {
          return 2
        }
        name() {
          return 'Gann Box'
        }
        getPoint(e) {
          if (e < 2) return super.getPoint(e)
          let t = null
          switch (e) {
            case 2:
            case 3:
              const n = this.points()
              if (n.length === this.pointsCount()) {
                let s = n[0].index,
                  i = n[1].price
                3 === e && ((s = n[1].index), (i = n[0].price)),
                  (t = { index: s, price: i })
              }
          }
          return t
        }
        setPoint(e, t, n, s) {
          if (n && n.shift()) {
            const n = e % 2 == 0 ? this._points[1] : this._points[0]
            this._alignPointsFixedIncrement(t, n)
          }
          const i = this._model.mainSeries().interval()
          switch (e) {
            case 2:
              ;(this._points[0].index = t.index),
                (this._points[0].interval = i),
                (this._points[1].price = t.price)
              break
            case 3:
              ;(this._points[1].index = t.index),
                (this._points[1].interval = i),
                (this._points[0].price = t.price)
              break
            default:
              super.setPoint(e, t, n)
          }
        }
        static createProperties(e, t) {
          const n = new l.LevelsProperty({
            defaultName: 'linetoolgannsquare',
            state: t,
            map: {
              range: [1, 7],
              prefixes: ['h', 'v'],
              names: ['coeff', 'color', 'visible'],
            },
            theme: e,
          })
          return this._configureProperties(n), n
        }
        _alignPriceOnPattern(e, t) {
          const n = Math.round(1e6 * (e.price - t.price)) / 1e6
          if (0 === n) return
          const s = a[0],
            i = a[a.length - 1]
          let r = 1
          const o = Math.abs(n)
          while (o < s * r || i * r < o)
            o < s * r ? (r *= 0.1) : i * r < o && (r *= 10)
          let l = i * r
          for (let e = a.length - 2; e >= 0 && !(a[e] * r < o); --e)
            l = a[e] * r
          e.price = t.price + (n >= 0 ? l : -l)
        }
        _alignTimeOnPattern(e, t) {
          const n = e.index - t.index
          if (0 === n) return
          let s = c.length - 2
          for (; s >= 0 && !(c[s] < n); --s);
          ;(s += n > 0 ? 1 : 0), (e.index = t.index + c[s])
        }
        _alignPointsFixedIncrement(e, t) {
          return (
            this._alignTimeOnPattern(e, t), this._alignPriceOnPattern(e, t), e
          )
        }
        _preparePoint(e, t) {
          return (
            t &&
              t.shift() &&
              0 !== this._points.length &&
              this._alignPointsFixedIncrement(e, this._points[0]),
            super._preparePoint(e, t)
          )
        }
        async _getPropertyDefinitionsViewModelClass() {
          return (
            await Promise.all([
              n.e(6406),
              n.e(3889),
              n.e(8009),
              n.e(8056),
              n.e(8537),
            ]).then(n.bind(n, 27340))
          ).GannSquareDefinitionsViewModel
        }
        static _configureProperties(e) {
          super._configureProperties(e)
          const t = [e.childs().color, e.childs().fans.childs().color]
          for (let n = 1; n <= 7; n++)
            t.push((0, i.ensureDefined)(e.child(`hlevel${n}`)?.child('color')))
          for (let n = 1; n <= 7; n++)
            t.push((0, i.ensureDefined)(e.child(`vlevel${n}`)?.child('color')))
          e.addChild('linesColors', new o.LineToolColorsProperty(t)),
            e.addExcludedKey('linesColors', 3)
        }
      }
    },
  },
])
