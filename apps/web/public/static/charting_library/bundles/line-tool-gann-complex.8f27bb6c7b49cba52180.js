;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1963],
  {
    15399: (e, t, s) => {
      s.d(t, { LevelsProperty: () => _ })
      var i = s(90054),
        r = s(16738),
        n = s(37265),
        l = s(32679),
        o = s(35039)
      const c = {
        prefixes: [''],
        range: [0, 0],
        names: ['coeff', 'color', 'visible', 'linestyle', 'linewidth'],
        typecheck: { pack: () => Object(), unpack: () => [] },
      }
      function a(e, t, s, i) {
        return i.push(s[t]), i
      }
      function h(e, t, s, i) {
        return (i[t] = s[e]), i
      }
      function u() {
        return []
      }
      function p() {
        return {}
      }
      function d(e, t, s) {
        return (
          s.prefixes.forEach((i) => {
            const r = i + 'level'
            for (let i = s.range[0]; i <= s.range[1]; i++)
              if (e[r + i] && (0, n.isSameType)(e[r + i], t.typecheck())) {
                let n = t.tpl()
                s.names.forEach((s, l) => {
                  n = t.fill('' + l, s, e[r + i], n)
                }),
                  (e[r + i] = n)
              }
          }),
          e
        )
      }
      function f(e, t, s) {
        return s(e, { tpl: p, fill: h, typecheck: t.typecheck.unpack }, t)
      }
      class _ extends l.DefaultProperty {
        constructor(e) {
          const { levelsIterator: t = d, map: s = {}, ...i } = e,
            r = { ...c, ...s }
          i.state && (i.state = f(i.state, r, t)),
            super(i),
            (this._map = r),
            (this._levelsIterator = t)
        }
        state(e, t, s) {
          const i = super.state(e, t)
          return s
            ? i
            : ((r = i),
              (n = this._map),
              (0, this._levelsIterator)(
                r,
                { tpl: u, fill: a, typecheck: n.typecheck.pack },
                n,
              ))
          var r, n
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
              (0, r.default)(
                (0, i.default)(t),
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
          return new _(this._options())
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
      var i = s(37265),
        r = s(15399)
      function n(e, t, s) {
        for (const r of Object.keys(e.levels ?? {}))
          if (e.levels[r] && (0, i.isSameType)(e.levels[r], t.typecheck())) {
            let i = t.tpl()
            s.names.forEach((s, n) => {
              i = t.fill('' + n, s, e.levels[r], i)
            }),
              (e.levels[r] = i)
          }
        return e
      }
      class l extends r.LevelsProperty {
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
    99083: (e, t, s) => {
      s.r(t), s.d(t, { LineToolGannComplex: () => p })
      var i,
        r = s(86441),
        n = s(50151),
        l = s(73866),
        o = s(29875),
        c = s(59769),
        a = s(12121),
        h = s(73305),
        u = s(15938)
      !((e) => {
        ;(e[(e.ScaleRatioStep = 1e-7)] = 'ScaleRatioStep'),
          (e[(e.ScaleRatioPrecision = 7)] = 'ScaleRatioPrecision'),
          (e.ScaleRatioInitialValue = '')
      })(i || (i = {}))
      class p extends o.LineDataSource {
        constructor(e, t, i, r) {
          super(
            e,
            t ?? p.createProperties(e.backgroundTheme().spawnOwnership()),
            i,
            r,
          ),
            (this.version = 2),
            (this._scaleRatioFormatter = new l.LimitedPrecisionNumericFormatter(
              7,
            )),
            (this.version = 2),
            Promise.all([s.e(6290), s.e(9116), s.e(1200), s.e(1583)])
              .then(s.bind(s, 73017))
              .then(({ GannComplexPaneView: e }) => {
                this._setPaneViews([new e(this, this.model())])
              })
          const n = this.properties()
          this._adjustScaleRatio(n),
            n.subscribe(this, this._adjustScaleRatio),
            n.childs().scaleRatio.subscribe(this, this._correctFirstPoint),
            this._syncStateExclusions.push('scaleRatio'),
            n
              .onRestoreFactoryDefaults()
              .subscribe(this, this._handleRestoringFactoryDefaults),
            this._onTemplateApplying.subscribe(
              this,
              this._handleTemplateApplying,
            ),
            this._onTemplateApplied.subscribe(this, this._correctFirstPoint)
        }
        migrateVersion(e, t, s) {
          1 === e &&
            (this._points.length >= this.pointsCount()
              ? setTimeout(() => this._migratePoint())
              : this._timePoint.length >= this.pointsCount() &&
                this._pointAdded.subscribe(this, this._migratePoint))
        }
        destroy() {
          const e = this.properties()
          e.unsubscribe(this, this._adjustScaleRatio),
            e.childs().scaleRatio.unsubscribe(this, this._correctFirstPoint),
            e
              .onRestoreFactoryDefaults()
              .unsubscribe(this, this._handleRestoringFactoryDefaults),
            this._onTemplateApplying.unsubscribe(
              this,
              this._handleTemplateApplying,
            ),
            this._onTemplateApplied.unsubscribe(this, this._correctFirstPoint),
            super.destroy()
        }
        pointsCount() {
          return 2
        }
        name() {
          return 'Gann Square'
        }
        addPoint(e, t, s) {
          this._points.length > 1 && this._points.pop()
          const i = super.addPoint(e, t, s),
            r = this.priceScale()
          return (
            !(0, n.ensureNotNull)(r).isLog() && i && this._correctFirstPoint(),
            i
          )
        }
        setPoint(e, t, s) {
          super.setPoint(e, t, s),
            void 0 !== s && s.shift()
              ? this._correctPoint(e)
              : this._correctScaleRatio()
        }
        setLastPoint(e, t) {
          const s = this.priceScale()
          return (
            (0, n.ensureNotNull)(s).isLog() ||
              ((this._points[1] = {
                ...e,
                interval: this._model.mainSeries().interval(),
              }),
              this._correctPoint(1)),
            super.setLastPoint(e, t)
          )
        }
        isReversed() {
          return this.properties().childs().reverse.value()
        }
        levelsCount() {
          return this.properties().childs().levels.childCount()
        }
        levels() {
          const e = [],
            t = this.properties().childs(),
            s = t.levels.childCount()
          for (let i = 0; i < s; i++) {
            const s = t.levels.childs()[i].childs()
            e.push({
              index: i,
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
          for (let i = 0; i < s; i++) {
            const s = t.fanlines.childs()[i].childs()
            e.push({
              index: i,
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
          for (let i = 0; i < s; i++) {
            const s = t.arcs.childs()[i].childs()
            e.push({
              index: i,
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
        isLabelsVisible() {
          return this.properties().childs().showLabels.value()
        }
        getLabelsStyle() {
          const e = this.properties().childs(),
            { fontSize: t, bold: s, italic: i } = e.labelsStyle.childs(),
            r = e.levels.childCount()
          return {
            textColor: e.levels.childs()[r - 1].childs().color.value(),
            font: u.CHART_FONT_FAMILY,
            fontSize: t.value(),
            bold: s.value(),
            italic: i.value(),
          }
        }
        getScaleRatioStep() {
          return 1e-7
        }
        getScaleRatioFormatter() {
          return this._scaleRatioFormatter
        }
        getPriceDiff() {
          const e = this.points()
          if (e.length < 2) return null
          const [t, s] = e
          return s.price - t.price
        }
        getIndexDiff() {
          const e = this.points()
          if (e.length < 2) return null
          const [t, s] = e
          return s.index - t.index
        }
        getScaleRatio() {
          const e = this.getPriceDiff(),
            t = this.getIndexDiff()
          return null !== e && null !== t && 0 !== t ? Math.abs(e / t) : null
        }
        static createProperties(e, t) {
          const s = (0, a.createPropertiesObject)('linetoolganncomplex', e, t)
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
          super._configureProperties(e), e.addExcludedKey('scaleRatio', 1)
          const t = [],
            s = [],
            i = e.childs()
          {
            const e = i.levels.childCount()
            for (let r = 0; r < e; r++) {
              const e = i.levels.childs()[r].childs()
              t.push(e.width), s.push(e.color)
            }
          }
          {
            const e = i.fanlines.childCount()
            for (let r = 0; r < e; r++) {
              const e = i.fanlines.childs()[r].childs()
              t.push(e.width), s.push(e.color)
            }
          }
          {
            const e = i.arcs.childCount()
            for (let r = 0; r < e; r++) {
              const e = i.arcs.childs()[r].childs()
              t.push(e.width), s.push(e.color)
            }
          }
          e.addChild('linesColors', new h.LineToolColorsProperty(s)),
            e.addChild('linesWidths', new h.LineToolWidthsProperty(t))
        }
        _correctScaleRatio() {
          const e = this.properties().childs(),
            t = this.getScaleRatio()
          e.scaleRatio.setValue(t)
        }
        _getAdjustedScaleRatio() {
          const e = this.model().mainSeries().priceScale(),
            t = this.model().timeScale()
          return (0, c.scaleRatio)(t, e)
        }
        _adjustScaleRatio(e) {
          const t = e.scaleRatio.value()
          ;('' !== t && null !== t) ||
            e.scaleRatio.setValue(this._getAdjustedScaleRatio())
        }
        _correctPoint(e) {
          if (this._points.length < 2) return
          const t = this.getIndexDiff()
          if (null === t) return
          const s = this.properties().childs().scaleRatio.value()
          if (null !== s) {
            const i = this._points[e],
              r = 0 === e ? this._points[1] : this._points[0],
              n = i.price - r.price > 0,
              l = i.index - r.index > 0
            let o = (n && !l) || (!n && l) ? -1 : 1
            0 === e && (o = -o),
              (i.price = r.price + o * t * s),
              this._pointChanged.fire(e)
          }
          this._normalizePoints()
        }
        _correctFirstPoint() {
          this._correctPoint(this.isReversed() ? 0 : 1)
        }
        _handleRestoringFactoryDefaults() {
          this.properties()
            .childs()
            .scaleRatio.setValue(this._getAdjustedScaleRatio())
        }
        _handleTemplateApplying(e) {
          '' === e.scaleRatio && (e.scaleRatio = this._getAdjustedScaleRatio())
        }
        _migratePoint() {
          if (this.points().length < this.pointsCount()) return
          const e = this._getScreenPoints()
          if (null === e) return
          const t = (0, n.ensureNotNull)(this.screenPointToPoint(e[1]))
          this.setPoint(1, t),
            this._pointAdded.unsubscribe(this, this._migratePoint)
        }
        _getScreenPoints() {
          const e = this._calcAngle()
          if (null === e) return null
          let [t, s] = this.points()
          this.isReversed() && ([t, s] = [s, t])
          const i = (0, n.ensureNotNull)(this.pointToScreenPoint(t)),
            l = (0, n.ensureNotNull)(this.pointToScreenPoint(s)),
            o = Math.sqrt(Math.pow(i.x - l.x, 2) + Math.pow(i.y - l.y, 2)),
            c = new r.Point(Math.cos(e), -Math.sin(e)),
            a = c.normalized(),
            h = a.x < 0 ? -1 : 1,
            u = a.y < 0 ? -1 : 1
          return [i.addScaled(c, o), i.add(new r.Point(5 * o * h, 5 * o * u))]
        }
        _calcAngle() {
          const [e, t] = this.points(),
            s = (0, n.ensureNotNull)(this.pointToScreenPoint(e))
          let i = (0, n.ensureNotNull)(this.pointToScreenPoint(t)).subtract(s)
          if (i.length() > 0) {
            i = i.normalized()
            let e = Math.acos(i.x)
            return i.y > 0 && (e = -e), e
          }
          return null
        }
      }
    },
  },
])
