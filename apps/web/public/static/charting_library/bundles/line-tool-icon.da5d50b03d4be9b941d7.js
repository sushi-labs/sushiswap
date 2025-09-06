;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7806],
  {
    25422: (e, t, i) => {
      t.transformPoint =
        t.translationMatrix =
        t.scalingMatrix =
        t.rotationMatrix =
          void 0
      var n = i(86441)
      ;(t.rotationMatrix = (e) => {
        var t = Math.cos(e),
          i = Math.sin(e)
        return [
          [t, -i, 0],
          [i, t, 0],
          [0, 0, 1],
        ]
      }),
        (t.scalingMatrix = (e, t) => [
          [e, 0, 0],
          [0, t, 0],
          [0, 0, 1],
        ]),
        (t.translationMatrix = (e, t) => [
          [1, 0, e],
          [0, 1, t],
          [0, 0, 1],
        ]),
        (t.transformPoint = (e, t) => {
          for (var i = [t.x, t.y, 1], s = [0, 0, 0], o = 0; o < 3; o++)
            for (var r = 0; r < 3; r++) s[o] += i[r] * e[o][r]
          return new n.Point(s[0], s[1])
        })
    },
    15510: (e, t, i) => {
      i.r(t), i.d(t, { LineToolIcon: () => _ })
      var n = i(928),
        s = i(12027),
        o = i(22329),
        r = i(9343),
        a = i(90054),
        l = i(16738),
        c = i(19625),
        u = i(38039),
        h = i(31229),
        d = i(32679),
        g = i(6590),
        v = i(73305)
      const p = (0, c.getHexColorByName)('color-tv-blue-500'),
        f = {
          intervalsVisibilities: { ...h.intervalsVisibilitiesDefaults },
          color: p,
          size: 40,
        },
        m = { icon: 61720, angle: 0.5 * Math.PI },
        b = (0, d.extractAllPropertiesKeys)(f),
        y = (0, d.extractAllPropertiesKeys)(m),
        P = [...new Set([...y, ...b, ...g.commonLineToolPropertiesStateKeys])]
      class V extends u.LineDataSourceProperty {
        constructor(e) {
          super(e),
            this.addChild(
              'backgroundsColors',
              new v.LineToolColorsProperty([this.childs().color]),
            )
        }
        static create(e, t, i) {
          return new this({
            defaultName: 'linetoolicon',
            factoryDefaultsSupplier: () => (0, a.default)(f),
            nonThemedDefaultsKeys: b,
            themedDefaultsKeys: [],
            state: (0, l.default)({}, m, { icon: i }, t ?? {}),
            allStateKeys: P,
            theme: e,
          })
        }
      }
      const S = (0, r.getLogger)('Chart.LineToolIcon')
      var C
      !((e) => {
        e[(e.Version = 1)] = 'Version'
      })(C || (C = {}))
      class _ extends o.LineToolSvgIconBase {
        constructor(e, t, i, n) {
          super(
            e,
            t ?? _.createProperties(e.backgroundTheme().spawnOwnership()),
            i,
            n,
          ),
            (this.version = 1),
            this._loadViews()
        }
        name() {
          return 'Icon'
        }
        template() {
          return this._properties.template()
        }
        static createProperties(e, t) {
          const i = V.create(e, t, n.iconTool.value())
          return this._configureProperties(i), i
        }
        _getPropertyDefinitionsViewModelClass() {
          return Promise.all([
            i.e(6406),
            i.e(3889),
            i.e(8009),
            i.e(8056),
            i.e(8537),
          ])
            .then(i.bind(i, 19532))
            .then((e) => e.IconsDefinitionsViewModel)
        }
        async _loadViews() {
          const [
            { getSvgContentForCharCode: e, getSvgRenderer: t },
            { IconPaneView: n },
          ] = await Promise.all([
            i.e(7987).then(i.bind(i, 25482)),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)]).then(
              i.bind(i, 11735),
            ),
          ])
          if (!this._isDestroyed) {
            const i = this._properties.childs().icon.value()
            ;(this._svgContent = e(i)), this._onIconChanged.fire()
            const o = t(s.svgRenderer, i)
            null === o &&
              S.logWarn(`Couldn't create svg renderer for icon ${i}`),
              this._setPaneViews([new n(this, this._model, o)])
          }
        }
      }
    },
    6590: (e, t, i) => {
      i.d(t, { commonLineToolPropertiesStateKeys: () => n })
      const n = [
        'symbolStateVersion',
        'zOrderVersion',
        'frozen',
        'title',
        'interval',
        'symbol',
        'currencyId',
        'unitId',
        'visible',
        'intervalsVisibilities.ticks',
        'intervalsVisibilities.seconds',
        'intervalsVisibilities.secondsFrom',
        'intervalsVisibilities.secondsTo',
        'intervalsVisibilities.minutes',
        'intervalsVisibilities.minutesFrom',
        'intervalsVisibilities.minutesTo',
        'intervalsVisibilities.hours',
        'intervalsVisibilities.hoursFrom',
        'intervalsVisibilities.hoursTo',
        'intervalsVisibilities.days',
        'intervalsVisibilities.daysFrom',
        'intervalsVisibilities.daysTo',
        'intervalsVisibilities.weeks',
        'intervalsVisibilities.weeksFrom',
        'intervalsVisibilities.weeksTo',
        'intervalsVisibilities.months',
        'intervalsVisibilities.monthsFrom',
        'intervalsVisibilities.monthsTo',
        'intervalsVisibilities.ranges',
      ]
      var s, o, r
      !((e) => {
        ;(e[(e.NotShared = 0)] = 'NotShared'),
          (e[(e.SharedInLayout = 1)] = 'SharedInLayout'),
          (e[(e.GloballyShared = 2)] = 'GloballyShared')
      })(s || (s = {})),
        ((e) => {
          ;(e.BeforeAllAction = 'BeforeAll'), (e.CustomAction = 'CustomAction')
        })(o || (o = {})),
        ((e) => {
          ;(e.FloatingToolbarButton = 'FloatingToolbarButton'),
            (e.Default = 'Default')
        })(r || (r = {}))
    },
    38039: (e, t, i) => {
      i.d(t, { LineDataSourceProperty: () => a })
      var n = i(90054),
        s = i(16738),
        o = i(50151),
        r = i(32679)
      class a extends r.DefaultProperty {
        constructor({ templateKeys: e, ...t }) {
          super({
            ignoreAllowSavingDefaults: !0,
            saveNonDefaultUserPreferencesOnly: !0,
            ...t,
          }),
            (this._templateKeys = (0, o.ensureDefined)(
              e || this._allDefaultsKeys,
            ))
        }
        template() {
          return (0, r.extractState)(this.state(), this._templateKeys, [])
        }
        applyTemplate(e) {
          this.mergeAndFire(
            (0, r.extractState)(
              (0, s.default)(
                (0, n.default)(this._factoryDefaultsSupplier()),
                e,
              ),
              this._templateKeys,
            ),
          )
        }
      }
    },
    22329: (e, t, i) => {
      i.d(t, { LineToolSvgIconBase: () => u })
      var n,
        s = i(50151),
        o = i(86441),
        r = i(25422),
        a = i(52033),
        l = i(29875),
        c = i(64147)
      !((e) => {
        e[(e.AnchorLimit = 80)] = 'AnchorLimit'
      })(n || (n = {}))
      class u extends l.LineDataSource {
        constructor(e, t, i, n) {
          super(e, t, i, n),
            (this._onIconChanged = new a.Delegate()),
            (this._svgContent = null),
            (this._hasEditableCoordinates = new c.WatchedValue(!1)),
            (this._changePointData = null),
            this._loadViews()
        }
        pointsCount() {
          return 1
        }
        getAnchorLimit() {
          return 80
        }
        getChangePointForSync(e) {
          return null
        }
        startChanging(e, t) {
          const i = (0, s.ensureNotNull)(
              this.pointToScreenPoint(this._points[0]),
            ),
            n = this.properties().childs(),
            a = n.size.value()
          let l
          if (t) l = (0, s.ensureNotNull)(this.pointToScreenPoint(t))
          else {
            let e = new o.Point(0, Math.max(80, a) / 2)
            const t = (0, r.rotationMatrix)(n.angle.value())
            ;(e = (0, r.transformPoint)(t, e)), (l = i.add(e))
          }
          const c = i.subtract(l).length()
          ;(this._changePointData = {
            centerPoint: i,
            initialLength: c,
            initialSize: a,
          }),
            super.startChanging(e, t)
        }
        setPoint(e, t, i) {
          const {
              centerPoint: n,
              initialLength: o,
              initialSize: r,
            } = (0, s.ensureNotNull)(this._changePointData),
            a = (0, s.ensureNotNull)(this.pointToScreenPoint(t)),
            l = this.properties().childs()
          if (0 === e || 1 === e) {
            const t = a.subtract(n).normalized()
            let i = Math.acos(-t.x)
            Math.asin(t.y) > 0 && (i = 2 * Math.PI - i),
              0 === e && (i += Math.PI),
              l.angle.setValue(i)
          } else {
            const e = r * (n.subtract(a).length() / o)
            l.size.setValue(e)
          }
        }
        getSourceIcon() {
          const e = this.svgContent()
          return null === e ? null : { type: 'svgContent', content: e }
        }
        onSourceIconChanged() {
          return this._onIconChanged
        }
        svgContent() {
          return this._svgContent
        }
        static _configureProperties(e) {
          super._configureProperties(e), e.addExcludedKey('angle', 1)
        }
      }
    },
  },
])
