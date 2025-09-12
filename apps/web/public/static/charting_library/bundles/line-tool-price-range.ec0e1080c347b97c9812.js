;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [6477],
  {
    76607: (e, t, i) => {
      i.d(t, {
        DateAndPriceBaseProperties: () => y,
        allPropertiesStateKeysBase: () => h,
        nonThemedFactoryDefaultsBase: () => u,
        themedFactoryDefaultsBase: () => d,
      })
      var s = i(19625),
        r = i(24633),
        o = i(19063),
        a = i(31229),
        l = i(12988),
        n = i(38039)
      const c = (0, s.getHexColorByName)('color-tv-blue-500'),
        u = {
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
              linecolor: c,
              backgroundColor: (0, o.generateColor)(c, 85),
              shadow: 'rgba(0, 0, 0, 0.2)',
              customText: { color: c },
            },
          ],
          [
            r.StdTheme.Dark,
            {
              textcolor: (0, s.getHexColorByName)('color-white'),
              labelBackgroundColor: (0, s.getHexColorByName)(
                'color-cold-gray-800',
              ),
              linecolor: c,
              backgroundColor: (0, o.generateColor)(c, 85),
              shadow: 'rgba(0, 0, 0, 0.4)',
              customText: { color: c },
            },
          ],
        ]),
        h = ['customText.text']
      function m(e) {
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
            templateKeys: [...(e ?? []), ...(t ?? []), ...h],
            state: i ? m(i) : void 0,
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
    23234: (e, t, i) => {
      i.r(t), i.d(t, { LineToolPriceRange: () => b })
      var s = i(29875),
        r = i(50151),
        o = i(24633),
        a = i(32679),
        l = i(11402),
        n = i(76607),
        c = i(6590)
      const u = {
          ...n.nonThemedFactoryDefaultsBase,
          extendLeft: !1,
          extendRight: !1,
        },
        d = n.themedFactoryDefaultsBase,
        h = (0, a.extractThemedColors)(
          (0, r.ensureDefined)(d.get(o.StdTheme.Light)),
          (0, r.ensureDefined)(d.get(o.StdTheme.Dark)),
        ),
        m = (0, a.extractAllPropertiesKeys)(
          (0, r.ensureDefined)(d.get(o.StdTheme.Light)),
        ),
        y = (0, a.extractAllPropertiesKeys)(u),
        f = [
          ...new Set([
            ...m,
            ...y,
            ...c.commonLineToolPropertiesStateKeys,
            ...n.allPropertiesStateKeysBase,
          ]),
        ]
      class p extends n.DateAndPriceBaseProperties {
        static create(e, t) {
          return new this({
            defaultName: 'linetoolpricerange',
            factoryDefaultsSupplier: () =>
              (0, l.factoryDefaultsForCurrentTheme)(u, d),
            nonThemedDefaultsKeys: y,
            themedDefaultsKeys: m,
            allStateKeys: f,
            themedColors: h,
            replaceThemedColorsOnThemeChange: !0,
            state: t,
            theme: e,
          })
        }
      }
      class b extends s.LineDataSource {
        constructor(e, t, s, r) {
          super(
            e,
            t ?? b.createProperties(e.backgroundTheme().spawnOwnership()),
            s,
            r,
          ),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 64661))
              .then((e) => {
                this._setPaneViews([
                  new e.PriceRangePaneView(this, this._model),
                ])
              })
        }
        pointsCount() {
          return 2
        }
        name() {
          return 'Price Range'
        }
        template() {
          return this._properties.template()
        }
        static createProperties(e, t) {
          const i = p.create(e, t)
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
