;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [4273],
  {
    76607: (e, t, s) => {
      s.d(t, {
        DateAndPriceBaseProperties: () => y,
        allPropertiesStateKeysBase: () => d,
        nonThemedFactoryDefaultsBase: () => c,
        themedFactoryDefaultsBase: () => m,
      })
      var i = s(19625),
        r = s(24633),
        o = s(19063),
        l = s(31229),
        a = s(12988),
        n = s(38039)
      const u = (0, i.getHexColorByName)('color-tv-blue-500'),
        c = {
          linewidth: 2,
          fontsize: 12,
          fillLabelBackground: !0,
          fillBackground: !0,
          backgroundTransparency: 60,
          showVolume: !0,
          intervalsVisibilities: { ...l.intervalsVisibilitiesDefaults },
          customText: { visible: !1, fontsize: 12, bold: !1, italic: !1 },
        },
        m = new Map([
          [
            r.StdTheme.Light,
            {
              textcolor: (0, i.getHexColorByName)('color-black'),
              labelBackgroundColor: (0, i.getHexColorByName)('color-white'),
              linecolor: u,
              backgroundColor: (0, o.generateColor)(u, 85),
              shadow: 'rgba(0, 0, 0, 0.2)',
              customText: { color: u },
            },
          ],
          [
            r.StdTheme.Dark,
            {
              textcolor: (0, i.getHexColorByName)('color-white'),
              labelBackgroundColor: (0, i.getHexColorByName)(
                'color-cold-gray-800',
              ),
              linecolor: u,
              backgroundColor: (0, o.generateColor)(u, 85),
              shadow: 'rgba(0, 0, 0, 0.4)',
              customText: { color: u },
            },
          ],
        ]),
        d = ['customText.text']
      function h(e) {
        const { showVolume: t = !0, ...s } = e
        return { ...s, showVolume: t }
      }
      class y extends n.LineDataSourceProperty {
        constructor({
          nonThemedDefaultsKeys: e,
          themedDefaultsKeys: t,
          state: s,
          ...i
        }) {
          super({
            nonThemedDefaultsKeys: e,
            themedDefaultsKeys: t,
            templateKeys: [...(e ?? []), ...(t ?? []), ...d],
            state: s ? h(s) : void 0,
            ...i,
          })
          const r = s?.customText
          ;(this._textProperty = new a.Property(r?.text ?? '')),
            this.childs().customText?.addChild('text', this._textProperty)
        }
        template() {
          const e = super.template()
          return (e.customText.text = this._textProperty.value()), e
        }
      }
    },
    42214: (e, t, s) => {
      s.r(t), s.d(t, { LineToolDateRange: () => b })
      var i = s(50151),
        r = s(29875),
        o = s(61105),
        l = s(24633),
        a = s(32679),
        n = s(11402),
        u = s(76607),
        c = s(6590)
      const m = {
          ...u.nonThemedFactoryDefaultsBase,
          extendTop: !1,
          extendBottom: !1,
        },
        d = u.themedFactoryDefaultsBase,
        h = (0, a.extractThemedColors)(
          (0, i.ensureDefined)(d.get(l.StdTheme.Light)),
          (0, i.ensureDefined)(d.get(l.StdTheme.Dark)),
        ),
        y = (0, a.extractAllPropertiesKeys)(
          (0, i.ensureDefined)(d.get(l.StdTheme.Light)),
        ),
        p = (0, a.extractAllPropertiesKeys)(m),
        f = [
          ...new Set([
            ...y,
            ...p,
            ...c.commonLineToolPropertiesStateKeys,
            ...u.allPropertiesStateKeysBase,
          ]),
        ]
      class v extends u.DateAndPriceBaseProperties {
        static create(e, t) {
          return new this({
            defaultName: 'linetooldaterange',
            factoryDefaultsSupplier: () =>
              (0, n.factoryDefaultsForCurrentTheme)(m, d),
            nonThemedDefaultsKeys: p,
            themedDefaultsKeys: y,
            allStateKeys: f,
            themedColors: h,
            replaceThemedColorsOnThemeChange: !0,
            state: t,
            theme: e,
          })
        }
      }
      class b extends r.LineDataSource {
        constructor(e, t, i, r) {
          super(
            e,
            t ?? b.createProperties(e.backgroundTheme().spawnOwnership()),
            i,
            r,
          ),
            (this._volumeCalculator = null),
            Promise.all([s.e(6290), s.e(9116), s.e(1200), s.e(1583)])
              .then(s.bind(s, 33406))
              .then((e) => {
                this._setPaneViews([new e.DateRangePaneView(this, this._model)])
              })
        }
        destroy() {
          super.destroy(),
            null !== this._volumeCalculator && this._volumeCalculator.destroy()
        }
        pointsCount() {
          return 2
        }
        name() {
          return 'Date Range'
        }
        template() {
          return this._properties.template()
        }
        volume() {
          if (null === this._volumeCalculator) return Number.NaN
          const e = this.points()
          return this._volumeCalculator.volume(e[0].index, e[1].index)
        }
        setOwnerSource(e) {
          e === this._model.mainSeries() &&
            ((0, i.assert)(null === this._volumeCalculator),
            (this._volumeCalculator = new o.SeriesTimeRangeVolumeCalculator(
              this._model.mainSeries(),
            ))),
            super.setOwnerSource(e)
        }
        static createProperties(e, t) {
          const s = v.create(e, t)
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
            ]).then(s.bind(s, 14336))
          ).GeneralDatePriceRangeDefinitionsViewModel
        }
      }
    },
    6590: (e, t, s) => {
      s.d(t, { commonLineToolPropertiesStateKeys: () => i })
      const i = [
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
      var r, o, l
      !((e) => {
        ;(e[(e.NotShared = 0)] = 'NotShared'),
          (e[(e.SharedInLayout = 1)] = 'SharedInLayout'),
          (e[(e.GloballyShared = 2)] = 'GloballyShared')
      })(r || (r = {})),
        ((e) => {
          ;(e.BeforeAllAction = 'BeforeAll'), (e.CustomAction = 'CustomAction')
        })(o || (o = {})),
        ((e) => {
          ;(e.FloatingToolbarButton = 'FloatingToolbarButton'),
            (e.Default = 'Default')
        })(l || (l = {}))
    },
    38039: (e, t, s) => {
      s.d(t, { LineDataSourceProperty: () => a })
      var i = s(90054),
        r = s(16738),
        o = s(50151),
        l = s(32679)
      class a extends l.DefaultProperty {
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
          return (0, l.extractState)(this.state(), this._templateKeys, [])
        }
        applyTemplate(e) {
          this.mergeAndFire(
            (0, l.extractState)(
              (0, r.default)(
                (0, i.default)(this._factoryDefaultsSupplier()),
                e,
              ),
              this._templateKeys,
            ),
          )
        }
      }
    },
    11402: (e, t, s) => {
      s.d(t, { factoryDefaultsForCurrentTheme: () => n })
      var i = s(16738),
        r = s(90054),
        o = s(50151),
        l = s(45345),
        a = s(24633)
      function n(e, t) {
        const s = l.watchedTheme.value() ?? a.StdTheme.Light,
          n = (0, r.default)(e)
        return (0, i.default)(n, (0, o.ensureDefined)(t.get(s))), n
      }
    },
  },
])
