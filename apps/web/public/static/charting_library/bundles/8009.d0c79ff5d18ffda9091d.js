;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [8009],
  {
    26434: (e, t, i) => {
      i.r(t),
        i.d(t, {
          getIntervalsVisibilitiesPropertiesDefinitions: () => ae,
          getSelectionIntervalsVisibilitiesPropertiesDefinition: () => ce,
        })
      var r = i(11542),
        n = i(45126),
        o = i(32097),
        s = i(64147),
        l = i(10074),
        a = i(1819),
        c = i(73305),
        d = i(46112)
      const p = new n.TranslatedString(
          'change {title} visibility on ticks',
          r.t(null, void 0, i(98596)),
        ),
        u = new n.TranslatedString(
          'change {title} visibility on seconds',
          r.t(null, void 0, i(41315)),
        ),
        h = new n.TranslatedString(
          'change {title} seconds from',
          r.t(null, void 0, i(86780)),
        ),
        y = new n.TranslatedString(
          'change {title} seconds to',
          r.t(null, void 0, i(6573)),
        ),
        P = new n.TranslatedString(
          'change {title} visibility on minutes',
          r.t(null, void 0, i(78219)),
        ),
        w = new n.TranslatedString(
          'change {title} minutes from',
          r.t(null, void 0, i(59820)),
        ),
        g = new n.TranslatedString(
          'change {title} minutes to',
          r.t(null, void 0, i(38011)),
        ),
        f = new n.TranslatedString(
          'change {title} visibility on hours',
          r.t(null, void 0, i(68715)),
        ),
        v = new n.TranslatedString(
          'change {title} hours from',
          r.t(null, void 0, i(8306)),
        ),
        m = new n.TranslatedString(
          'change {title} hours to',
          r.t(null, void 0, i(67233)),
        ),
        b = new n.TranslatedString(
          'change {title} visibility on days',
          r.t(null, void 0, i(56402)),
        ),
        T = new n.TranslatedString(
          'change {title} days from',
          r.t(null, void 0, i(91201)),
        ),
        _ = new n.TranslatedString(
          'change {title} days to',
          r.t(null, void 0, i(96135)),
        ),
        S = new n.TranslatedString(
          'change {title} visibility on weeks',
          r.t(null, void 0, i(71084)),
        ),
        C = new n.TranslatedString(
          'change {title} weeks from',
          r.t(null, void 0, i(32481)),
        ),
        V = new n.TranslatedString(
          'change {title} weeks to',
          r.t(null, void 0, i(18678)),
        ),
        D = new n.TranslatedString(
          'change {title} visibility on months',
          r.t(null, void 0, i(67583)),
        ),
        W = new n.TranslatedString(
          'change {title} months from',
          r.t(null, void 0, i(99122)),
        ),
        k = new n.TranslatedString(
          'change {title} months to',
          r.t(null, void 0, i(10518)),
        ),
        U =
          (new n.TranslatedString(
            'change {title} visibility on ranges',
            r.t(null, { replace: { ranges: 'ranges' } }, i(55616)),
          ),
          r.t(null, void 0, i(24821))),
        A = r.t(null, void 0, i(65188)),
        I = r.t(null, void 0, i(42562)),
        L = r.t(null, void 0, i(56796)),
        x = r.t(null, void 0, i(72942)),
        M = r.t(null, void 0, i(835)),
        R = r.t(null, void 0, i(43154)),
        F = new n.TranslatedString('ticks', r.t(null, void 0, i(3539))),
        N = new n.TranslatedString('seconds', r.t(null, void 0, i(751))),
        E = new n.TranslatedString('seconds from', r.t(null, void 0, i(35801))),
        Y = new n.TranslatedString('seconds to', r.t(null, void 0, i(73419))),
        j = new n.TranslatedString('minutes', r.t(null, void 0, i(18726))),
        H = new n.TranslatedString('minutes from', r.t(null, void 0, i(22476))),
        B = new n.TranslatedString('minutes to', r.t(null, void 0, i(67649))),
        q = new n.TranslatedString('hours', r.t(null, void 0, i(2359))),
        z = new n.TranslatedString('hours from', r.t(null, void 0, i(82267))),
        G = new n.TranslatedString('hours to', r.t(null, void 0, i(15600))),
        J = new n.TranslatedString('days', r.t(null, void 0, i(35813))),
        K = new n.TranslatedString('days from', r.t(null, void 0, i(59215))),
        O = new n.TranslatedString('days to', r.t(null, void 0, i(89919))),
        Q = new n.TranslatedString('weeks', r.t(null, void 0, i(45537))),
        X = new n.TranslatedString('weeks from', r.t(null, void 0, i(92859))),
        Z = new n.TranslatedString('weeks to', r.t(null, void 0, i(44127))),
        $ = new n.TranslatedString('months', r.t(null, void 0, i(95300))),
        ee = new n.TranslatedString('months from', r.t(null, void 0, i(17250))),
        te = new n.TranslatedString('months to', r.t(null, void 0, i(2828))),
        ie = (new n.TranslatedString('ranges', 'ranges'), [1, 59]),
        re = [1, 59],
        ne = [1, 24],
        oe = [1, 366],
        se = [1, 52],
        le = [1, 12]
      function ae(e, t, i) {
        const r = []
        if ((0, a.isTicksEnabled)()) {
          const n = (0, o.createCheckablePropertyDefinition)(
            {
              checked: (0, o.convertToDefinitionProperty)(
                e,
                t.ticks,
                p.format({ title: i }),
              ),
            },
            { id: 'IntervalsVisibilitiesTicks', title: U },
          )
          r.push(n)
        }
        if ((0, l.isSecondsEnabled)()) {
          const n = (0, o.createRangePropertyDefinition)(
            {
              checked: (0, o.convertToDefinitionProperty)(
                e,
                t.seconds,
                u.format({ title: i }),
              ),
              from: (0, o.convertToDefinitionProperty)(
                e,
                t.secondsFrom,
                h.format({ title: i }),
              ),
              to: (0, o.convertToDefinitionProperty)(
                e,
                t.secondsTo,
                y.format({ title: i }),
              ),
            },
            {
              id: 'IntervalsVisibilitiesSecond',
              title: A,
              min: new s.WatchedValue(ie[0]),
              max: new s.WatchedValue(ie[1]),
            },
          )
          r.push(n)
        }
        const n = (0, o.createRangePropertyDefinition)(
            {
              checked: (0, o.convertToDefinitionProperty)(
                e,
                t.minutes,
                P.format({ title: i }),
              ),
              from: (0, o.convertToDefinitionProperty)(
                e,
                t.minutesFrom,
                w.format({ title: i }),
              ),
              to: (0, o.convertToDefinitionProperty)(
                e,
                t.minutesTo,
                g.format({ title: i }),
              ),
            },
            {
              id: 'IntervalsVisibilitiesMinutes',
              title: I,
              min: new s.WatchedValue(re[0]),
              max: new s.WatchedValue(re[1]),
            },
          ),
          c = (0, o.createRangePropertyDefinition)(
            {
              checked: (0, o.convertToDefinitionProperty)(
                e,
                t.hours,
                f.format({ title: i }),
              ),
              from: (0, o.convertToDefinitionProperty)(
                e,
                t.hoursFrom,
                v.format({ title: i }),
              ),
              to: (0, o.convertToDefinitionProperty)(
                e,
                t.hoursTo,
                m.format({ title: i }),
              ),
            },
            {
              id: 'IntervalsVisibilitiesHours',
              title: L,
              min: new s.WatchedValue(ne[0]),
              max: new s.WatchedValue(ne[1]),
            },
          ),
          d = (0, o.createRangePropertyDefinition)(
            {
              checked: (0, o.convertToDefinitionProperty)(
                e,
                t.days,
                b.format({ title: i }),
              ),
              from: (0, o.convertToDefinitionProperty)(
                e,
                t.daysFrom,
                T.format({ title: i }),
              ),
              to: (0, o.convertToDefinitionProperty)(
                e,
                t.daysTo,
                _.format({ title: i }),
              ),
            },
            {
              id: 'IntervalsVisibilitiesDays',
              title: x,
              min: new s.WatchedValue(oe[0]),
              max: new s.WatchedValue(oe[1]),
            },
          )
        r.push(n, c, d)
        const F = (0, o.createRangePropertyDefinition)(
            {
              checked: (0, o.convertToDefinitionProperty)(
                e,
                t.weeks,
                S.format({ title: i }),
              ),
              from: (0, o.convertToDefinitionProperty)(
                e,
                t.weeksFrom,
                C.format({ title: i }),
              ),
              to: (0, o.convertToDefinitionProperty)(
                e,
                t.weeksTo,
                V.format({ title: i }),
              ),
            },
            {
              id: 'IntervalsVisibilitiesWeeks',
              title: M,
              min: new s.WatchedValue(se[0]),
              max: new s.WatchedValue(se[1]),
            },
          ),
          N = (0, o.createRangePropertyDefinition)(
            {
              checked: (0, o.convertToDefinitionProperty)(
                e,
                t.months,
                D.format({ title: i }),
              ),
              from: (0, o.convertToDefinitionProperty)(
                e,
                t.monthsFrom,
                W.format({ title: i }),
              ),
              to: (0, o.convertToDefinitionProperty)(
                e,
                t.monthsTo,
                k.format({ title: i }),
              ),
            },
            {
              id: 'IntervalsVisibilitiesMonths',
              title: R,
              min: new s.WatchedValue(le[0]),
              max: new s.WatchedValue(le[1]),
            },
          )
        return r.push(F, N), { definitions: r }
      }
      function ce(e, t) {
        const i = []
        if ((0, a.isTicksEnabled)()) {
          const r = (0, o.createCheckablePropertyDefinition)(
            {
              checked: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.ticks),
                F,
                t,
              ),
            },
            { id: 'IntervalsVisibilitiesTicks', title: U },
          )
          i.push(r)
        }
        if ((0, l.isSecondsEnabled)()) {
          const r = (0, o.createRangePropertyDefinition)(
            {
              checked: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.seconds),
                N,
                t,
              ),
              from: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.secondsFrom),
                E,
                t,
              ),
              to: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.secondsTo),
                Y,
                t,
              ),
            },
            {
              id: 'IntervalsVisibilitiesSecond',
              title: A,
              min: new s.WatchedValue(ie[0]),
              max: new s.WatchedValue(ie[1]),
            },
          )
          i.push(r)
        }
        const r = (0, o.createRangePropertyDefinition)(
            {
              checked: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.minutes),
                j,
                t,
              ),
              from: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.minutesFrom),
                H,
                t,
              ),
              to: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.minutesTo),
                B,
                t,
              ),
            },
            {
              id: 'IntervalsVisibilitiesMinutes',
              title: I,
              min: new s.WatchedValue(re[0]),
              max: new s.WatchedValue(re[1]),
            },
          ),
          n = (0, o.createRangePropertyDefinition)(
            {
              checked: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.hours),
                q,
                t,
              ),
              from: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.hoursFrom),
                z,
                t,
              ),
              to: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.hoursTo),
                G,
                t,
              ),
            },
            {
              id: 'IntervalsVisibilitiesHours',
              title: L,
              min: new s.WatchedValue(ne[0]),
              max: new s.WatchedValue(ne[1]),
            },
          ),
          p = (0, o.createRangePropertyDefinition)(
            {
              checked: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.days),
                J,
                t,
              ),
              from: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.daysFrom),
                K,
                t,
              ),
              to: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.daysTo),
                O,
                t,
              ),
            },
            {
              id: 'IntervalsVisibilitiesDays',
              title: x,
              min: new s.WatchedValue(oe[0]),
              max: new s.WatchedValue(oe[1]),
            },
          )
        i.push(r, n, p)
        const u = (0, o.createRangePropertyDefinition)(
            {
              checked: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.weeks),
                Q,
                t,
              ),
              from: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.weeksFrom),
                X,
                t,
              ),
              to: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.weeksTo),
                Z,
                t,
              ),
            },
            {
              id: 'IntervalsVisibilitiesWeeks',
              title: M,
              min: new s.WatchedValue(se[0]),
              max: new s.WatchedValue(se[1]),
            },
          ),
          h = (0, o.createRangePropertyDefinition)(
            {
              checked: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.months),
                $,
                t,
              ),
              from: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.monthsFrom),
                ee,
                t,
              ),
              to: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.monthsTo),
                te,
                t,
              ),
            },
            {
              id: 'IntervalsVisibilitiesMonths',
              title: R,
              min: new s.WatchedValue(le[0]),
              max: new s.WatchedValue(le[1]),
            },
          )
        return i.push(u, h), { definitions: i }
      }
    },
    18009: (e, t, i) => {
      i.r(t),
        i.d(t, {
          LineDataSourceDefinitionsViewModel: () => m,
          LineDataSourceTabTypes: () => r,
          pointPriceBarTitle: () => v,
        })
      var r,
        n = i(50151),
        o = i(11542),
        s = i(45126),
        l = (i(21251), i(32097)),
        a = i(57717),
        c = i(64147),
        d = i(26434),
        p = i(73174),
        u = i(35923),
        h = i(19466)
      !((e) => {
        ;(e.Visibility = 'visibility'),
          (e.Coordinates = 'coordinates'),
          (e.Style = 'style'),
          (e.Text = 'text'),
          (e.Inputs = 'inputs')
      })(r || (r = {}))
      const y = o.t(null, void 0, i(40091)),
        P = o.t(null, void 0, i(78930)),
        w = o.t(null, void 0, i(92516)),
        g = o.t(null, void 0, i(70320)),
        f = o.t(null, void 0, i(21429)),
        v = o.t(null, { context: 'linetool point' }, i(80166))
      class m {
        constructor(e, t) {
          ;(this._yCoordinateStepWV = null),
            (this._propertyPages = []),
            (this._source = t),
            (this._undoModel = e),
            (this._ownerSource = (0, n.ensureNotNull)(
              this._source.ownerSource(),
            )),
            (this._propertyApplier = new u.PropertyApplierWithoutSavingChart(
              () => e,
            )),
            this._createPropertyRages()
        }
        destroy() {
          null !== this._yCoordinateStepWV &&
            (this._source.ownerSourceChanged().unsubscribeAll(this),
            this._ownerSource.priceStepChanged().unsubscribeAll(this)),
            this._source.pointAdded().unsubscribeAll(this),
            this._propertyPages.forEach((e) => {
              ;(0, l.destroyDefinitions)(e.definitions.value())
            })
        }
        propertyPages() {
          return Promise.resolve(this._propertyPages)
        }
        _createPropertyRages() {
          this._propertyPages = []
          const e = this._createInputsPropertyPage()
          null !== e && this._propertyPages.push(e)
          const t = this._createStylePropertyPage()
          null !== t && this._propertyPages.push(t)
          const i = this._createTextPropertyPage()
          null !== i && this._propertyPages.push(i)
          const r = this._createCoordinatesPropertyPage()
          null !== r &&
            ((r.visible = this._source.hasEditableCoordinates()),
            this._propertyPages.push(r))
          const n = this._createVisibilitiesPropertyPage()
          this._propertyPages.push(n)
        }
        _createVisibilitiesPropertyPage() {
          const e = this._source
            .properties()
            .childs()
            .intervalsVisibilities.childs()
          return (0, a.createPropertyPage)(
            (0, d.getIntervalsVisibilitiesPropertiesDefinitions)(
              this._propertyApplier,
              e,
              new s.TranslatedString(
                this._source.name(),
                this._source.title(h.TitleDisplayTarget.StatusLine, !0),
              ),
            ),
            'visibility',
            y,
          )
        }
        _createCoordinatesPropertyPage() {
          const e = this._coordinatesPropertyDefinitions()
          return null !== e
            ? (e.definitions.length < this._source.pointsCount() &&
                this._source
                  .pointAdded()
                  .subscribe(this, this._updateCoordinatesPropertyDefinitons),
              (0, a.createPropertyPage)(e, 'coordinates', P))
            : null
        }
        _getYCoordinateStepWV() {
          return (
            null === this._yCoordinateStepWV &&
              ((this._yCoordinateStepWV = new c.WatchedValue(
                ((e) => {
                  if (null !== e) {
                    const t = e.priceStep()
                    if (null !== t) return t
                  }
                  return 1
                })(this._source.ownerSource()),
              )),
              this._ownerSource
                .priceStepChanged()
                .subscribe(this, () => this._updateYCoordinateStep()),
              this._source.ownerSourceChanged().subscribe(this, () => {
                this._ownerSource.priceStepChanged().unsubscribeAll(this),
                  (this._ownerSource = (0, n.ensureNotNull)(
                    this._source.ownerSource(),
                  )),
                  this._ownerSource
                    .priceStepChanged()
                    .subscribe(this, () => this._updateYCoordinateStep())
              })),
            this._yCoordinateStepWV
          )
        }
        _coordinatesPropertyDefinitions() {
          const e = this._source.points(),
            t = this._source.pointsProperty().childs().points,
            i = [],
            r = this._getYCoordinateStepWV()
          return (
            e.forEach((e, n) => {
              const o = t[n].childs()
              o &&
                i.push(
                  (0, p.getCoordinatesPropertiesDefinitions)(
                    this._propertyApplier,
                    o,
                    e,
                    r,
                    v.format({ count: (n + 1).toString() }),
                    this._source.name(),
                  ),
                )
            }),
            { definitions: i }
          )
        }
        _createStylePropertyPage() {
          const e = this._stylePropertyDefinitions()
          return null !== e ? (0, a.createPropertyPage)(e, 'style', w) : null
        }
        _stylePropertyDefinitions() {
          return null
        }
        _createTextPropertyPage() {
          const e = this._textPropertyDefinitions()
          return null !== e ? (0, a.createPropertyPage)(e, 'text', g) : null
        }
        _textPropertyDefinitions() {
          return null
        }
        _createInputsPropertyPage() {
          const e = this._inputsPropertyDefinitions()
          return null !== e ? (0, a.createPropertyPage)(e, 'inputs', f) : null
        }
        _inputsPropertyDefinitions() {
          return null
        }
        _updateYCoordinateStep() {
          const e = this._ownerSource.priceStep()
          this._getYCoordinateStepWV().setValue(e || 1)
        }
        _updateCoordinatesPropertyDefinitons() {
          const e = this._coordinatesPropertyDefinitions()
          if (null !== e) {
            ;(0, n.ensureDefined)(
              this._propertyPages.find((e) => 'coordinates' === e.id),
            ).definitions.setValue(e.definitions),
              this._source.points().length === this._source.pointsCount() &&
                this._source.pointAdded().unsubscribeAll(this)
          }
        }
      }
    },
    46112: (e, t, i) => {
      i.d(t, { CollectiblePropertyUndoWrapper: () => a })
      var r = i(50151),
        n = i(11542),
        o = i(45126),
        s = i(12988)
      const l = new o.TranslatedString(
        'change {propertyName} property',
        n.t(null, void 0, i(25167)),
      )
      class a extends s.Property {
        constructor(e, t, i) {
          super(),
            (this._isProcess = !1),
            (this._listenersMappers = []),
            (this._valueApplier = {
              applyValue: (e, t) => {
                this._propertyApplier.setProperty(e, t, l)
              },
            }),
            (this._baseProperty = e),
            (this._propertyApplier = i),
            (this._propertyName = t)
        }
        destroy() {
          this._baseProperty.destroy(), super.destroy()
        }
        value() {
          return this._baseProperty.value()
        }
        setValue(e, t) {
          this._propertyApplier.beginUndoMacro(
            l.format({ propertyName: this._propertyName }),
          ),
            (this._isProcess = !0),
            this._baseProperty.setValue(e, void 0, this._valueApplier),
            (this._isProcess = !1),
            this._propertyApplier.endUndoMacro(),
            this._listenersMappers.forEach((e) => {
              e.method.call(e.obj, this, '')
            })
        }
        subscribe(e, t) {
          const i = () => {
            this._isProcess || t.call(e, this, '')
          }
          this._listenersMappers.push({ obj: e, method: t, callback: i }),
            this._baseProperty.subscribe(e, i)
        }
        unsubscribe(e, t) {
          const i = (0, r.ensureDefined)(
            this._listenersMappers.find((i) => i.obj === e && i.method === t)
              ?.callback,
          )
          this._baseProperty.unsubscribe(e, i)
        }
        unsubscribeAll(e) {
          this._baseProperty.unsubscribeAll(e)
        }
      }
    },
    35923: (e, t, i) => {
      i.d(t, { PropertyApplierWithoutSavingChart: () => n })
      var r = i(85719)
      class n {
        constructor(e) {
          this._undoModelSupplier = e
        }
        setProperty(e, t, i) {
          this._undoModelSupplier().setProperty(
            e,
            t,
            i,
            r.lineToolsDoNotAffectChartInvalidation,
          )
        }
        beginUndoMacro(e) {
          return this._undoModelSupplier().beginUndoMacro(e)
        }
        endUndoMacro() {
          this._undoModelSupplier().endUndoMacro()
        }
        setWatchedValue(e, t, i) {
          this._undoModelSupplier()
            .undoHistory()
            .setWatchedValue(e, t, i, r.lineToolsDoNotAffectChartInvalidation)
        }
      }
    },
  },
])
