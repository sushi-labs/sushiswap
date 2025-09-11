;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1455],
  {
    76607: (e, t, i) => {
      i.d(t, {
        DateAndPriceBaseProperties: () => y,
        allPropertiesStateKeysBase: () => m,
        nonThemedFactoryDefaultsBase: () => c,
        themedFactoryDefaultsBase: () => d,
      })
      var s = i(19625),
        r = i(24633),
        o = i(19063),
        a = i(31229),
        l = i(12988),
        n = i(38039)
      const u = (0, s.getHexColorByName)('color-tv-blue-500'),
        c = {
          linewidth: 2,
          fontsize: 12,
          fillLabelBackground: !0,
          fillBackground: !0,
          backgroundTransparency: 60,
          showVolume: !0,
          intervalsVisibilities: { ...a.intervalsVisibilitiesDefaults },
          customText: { visible: !1, fontsize: 12, bold: !1, italic: !1 },
        },
        d = new Map([
          [
            r.StdTheme.Light,
            {
              textcolor: (0, s.getHexColorByName)('color-black'),
              labelBackgroundColor: (0, s.getHexColorByName)('color-white'),
              linecolor: u,
              backgroundColor: (0, o.generateColor)(u, 85),
              shadow: 'rgba(0, 0, 0, 0.2)',
              customText: { color: u },
            },
          ],
          [
            r.StdTheme.Dark,
            {
              textcolor: (0, s.getHexColorByName)('color-white'),
              labelBackgroundColor: (0, s.getHexColorByName)(
                'color-cold-gray-800',
              ),
              linecolor: u,
              backgroundColor: (0, o.generateColor)(u, 85),
              shadow: 'rgba(0, 0, 0, 0.4)',
              customText: { color: u },
            },
          ],
        ]),
        m = ['customText.text']
      function h(e) {
        const { showVolume: t = !0, ...i } = e
        return { ...i, showVolume: t }
      }
      class y extends n.LineDataSourceProperty {
        constructor({
          nonThemedDefaultsKeys: e,
          themedDefaultsKeys: t,
          state: i,
          ...s
        }) {
          super({
            nonThemedDefaultsKeys: e,
            themedDefaultsKeys: t,
            templateKeys: [...(e ?? []), ...(t ?? []), ...m],
            state: i ? h(i) : void 0,
            ...s,
          })
          const r = i?.customText
          ;(this._textProperty = new l.Property(r?.text ?? '')),
            this.childs().customText?.addChild('text', this._textProperty)
        }
        template() {
          const e = super.template()
          return (e.customText.text = this._textProperty.value()), e
        }
      }
    },
    70791: (e, t, i) => {
      i.r(t), i.d(t, { LineToolDateAndPriceRange: () => T })
      var s = i(50151),
        r = i(29875),
        o = i(61105),
        a = i(19625),
        l = i(24633),
        n = i(32679),
        u = i(11402),
        c = i(6590),
        d = i(76607)
      const m = (0, a.getHexColorByName)('color-tv-blue-500'),
        h = {
          ...d.nonThemedFactoryDefaultsBase,
          drawBorder: !1,
          borderWidth: 1,
        },
        y = new Map([
          [
            l.StdTheme.Light,
            {
              ...d.themedFactoryDefaultsBase.get(l.StdTheme.Light),
              borderColor: m,
            },
          ],
          [
            l.StdTheme.Dark,
            {
              ...d.themedFactoryDefaultsBase.get(l.StdTheme.Dark),
              borderColor: m,
            },
          ],
        ]),
        p = (0, n.extractThemedColors)(
          (0, s.ensureDefined)(y.get(l.StdTheme.Light)),
          (0, s.ensureDefined)(y.get(l.StdTheme.Dark)),
        ),
        f = (0, n.extractAllPropertiesKeys)(
          (0, s.ensureDefined)(y.get(l.StdTheme.Light)),
        ),
        b = (0, n.extractAllPropertiesKeys)(h),
        g = [
          ...new Set([
            ...f,
            ...b,
            ...c.commonLineToolPropertiesStateKeys,
            ...d.allPropertiesStateKeysBase,
          ]),
        ]
      class v extends d.DateAndPriceBaseProperties {
        static create(e, t) {
          return new this({
            defaultName: 'linetooldateandpricerange',
            factoryDefaultsSupplier: () =>
              (0, u.factoryDefaultsForCurrentTheme)(h, y),
            nonThemedDefaultsKeys: b,
            themedDefaultsKeys: f,
            allStateKeys: g,
            themedColors: p,
            replaceThemedColorsOnThemeChange: !0,
            state: t,
            theme: e,
          })
        }
      }
      class T extends r.LineDataSource {
        constructor(e, t, s, r) {
          super(
            e,
            t ?? T.createProperties(e.backgroundTheme().spawnOwnership()),
            s,
            r,
          ),
            (this._volumeCalculator = null),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 93955))
              .then((e) => {
                this._setPaneViews([
                  new e.DateAndPriceRangePaneView(this, this._model),
                ])
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
          return 'Date and Price Range'
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
            ((0, s.assert)(null === this._volumeCalculator),
            (this._volumeCalculator = new o.SeriesTimeRangeVolumeCalculator(
              this._model.mainSeries(),
            ))),
            super.setOwnerSource(e)
        }
        static createProperties(e, t) {
          const i = v.create(e, t)
          return this._configureProperties(i), i
        }
        async _getPropertyDefinitionsViewModelClass() {
          return (
            await Promise.all([
              i.e(6406),
              i.e(3889),
              i.e(8009),
              i.e(8056),
              i.e(8537),
            ]).then(i.bind(i, 14336))
          ).GeneralDatePriceRangeDefinitionsViewModel
        }
      }
    },
    6590: (e, t, i) => {
      i.d(t, { commonLineToolPropertiesStateKeys: () => s })
      const s = [
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
      var r, o, a
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
        })(a || (a = {}))
    },
    38039: (e, t, i) => {
      i.d(t, { LineDataSourceProperty: () => l })
      var s = i(90054),
        r = i(16738),
        o = i(50151),
        a = i(32679)
      class l extends a.DefaultProperty {
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
          return (0, a.extractState)(this.state(), this._templateKeys, [])
        }
        applyTemplate(e) {
          this.mergeAndFire(
            (0, a.extractState)(
              (0, r.default)(
                (0, s.default)(this._factoryDefaultsSupplier()),
                e,
              ),
              this._templateKeys,
            ),
          )
        }
      }
    },
    11402: (e, t, i) => {
      i.d(t, { factoryDefaultsForCurrentTheme: () => n })
      var s = i(16738),
        r = i(90054),
        o = i(50151),
        a = i(45345),
        l = i(24633)
      function n(e, t) {
        const i = a.watchedTheme.value() ?? l.StdTheme.Light,
          n = (0, r.default)(e)
        return (0, s.default)(n, (0, o.ensureDefined)(t.get(i))), n
      }
    },
  },
])
