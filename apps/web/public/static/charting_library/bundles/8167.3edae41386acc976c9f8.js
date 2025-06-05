;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [8167],
  {
    41339: (e, t, i) => {
      i.r(t),
        i.d(t, {
          getCoordinateXMetaInfo: () => f,
          getCoordinateYMetaInfo: () => P,
          getCoordinatesPropertiesDefinitions: () => g,
          getSelectionCoordinatesPropertyDefinition: () => _,
        })
      var n = i(50151),
        r = i(11542),
        o = i(36298),
        s = i(62591)
      class l extends s.UndoCommand {
        constructor({ lineToolId: e, chartModel: t, newPositionPoints: i }) {
          super(null),
            (this._pointState = null),
            (this._lineToolId = e),
            (this._model = t),
            (this._newPositionPoints = i)
        }
        redo() {
          const e = (0, n.ensureNotNull)(
            this._model.dataSourceForId(this._lineToolId),
          )
          ;(this._pointState = [e.normalizedPoints(), e.points()]),
            e.startChanging(),
            e.moveLineTool(this._newPositionPoints),
            this._model.updateSource(e),
            e.syncMultichartState(e.endChanging(!0, !1))
        }
        undo() {
          if (this._pointState) {
            const e = (0, n.ensureNotNull)(
              this._model.dataSourceForId(this._lineToolId),
            )
            e.startChanging(),
              e.restorePoints(...this._pointState),
              this._model.updateSource(e),
              e.syncMultichartState(e.endChanging(!0, !1))
          }
        }
      }
      var a = i(295),
        d = i(97145),
        c = i(88640),
        p = i(94474)
      const u = new o.TranslatedString(
          'change price Y coordinate',
          r.t(null, void 0, i(66266)),
        ),
        h = new o.TranslatedString(
          'change bar X coordinate',
          r.t(null, void 0, i(23723)),
        ),
        y = new o.TranslatedString('move drawings', r.t(null, void 0, i(72223)))
      function P(e, t, i) {
        return {
          property: (0, a.convertToDefinitionProperty)(e, t.price, u),
          info: { typeY: 1, stepY: i },
        }
      }
      function f(e, t) {
        return {
          property: (0, a.convertToDefinitionProperty)(e, t.bar, h),
          info: {
            typeX: 0,
            minX: new d.WatchedValue(-5e4),
            maxX: new d.WatchedValue(15e3),
            stepX: new d.WatchedValue(1),
          },
        }
      }
      function g(e, t, i, n, r, o) {
        const s = f(e, t),
          l = P(e, t, n)
        return (0, a.createCoordinatesPropertyDefinition)(
          { x: s.property, y: l.property },
          {
            id: (0, p.removeSpaces)(`${o}Coordinates${r}`),
            title: r,
            ...s.info,
            ...l.info,
          },
        )
      }
      const w = /^([+*\-\/]?)((?:\d*)|(?:\d+\.\d*))$/
      function m(e, t, i) {
        const r = new c.default(''),
          o = (0, a.makeProxyDefinitionProperty)(r.weakReference())
        return (
          (o.setValue = (o) => {
            try {
              const s = o.match(w)
              if (!s) return
              const [, a, d] = s
              if (!d.length) return
              const c = i(Number.parseFloat(d))
              if ('/' === a && (0 === c.price || 0 === c.index)) return
              t.withMacro(y, () => {
                e.forEach((e) => {
                  const i = e.points()
                  let r
                  switch (a) {
                    case '': {
                      const e = (0, n.ensureDefined)(i[0])
                      let { index: t = e.index, price: o = e.price } = c
                      ;(o -= e.price),
                        (t -= e.index),
                        (r = i.map((e) => ({
                          ...e,
                          index: e.index + t,
                          price: e.price + o,
                        })))
                      break
                    }
                    case '-':
                    case '+': {
                      let { index: e = 0, price: t = 0 } = c
                      '-' === a && ((e *= -1), (t *= -1)),
                        (r = i.map((i) => ({
                          ...i,
                          index: i.index + e,
                          price: i.price + t,
                        })))
                      break
                    }
                    case '*': {
                      const { index: e = 1, price: t = 1 } = c
                      r = i.map((i) => ({
                        ...i,
                        index: i.index * e,
                        price: i.price * t,
                      }))
                      break
                    }
                    case '/': {
                      const { index: e = 1, price: t = 1 } = c
                      r = i.map((i) => ({
                        ...i,
                        index: i.index / e,
                        price: i.price / t,
                      }))
                      break
                    }
                  }
                  t.undoHistory().pushUndoCommand(
                    new l({
                      lineToolId: e.id(),
                      chartModel: t.model(),
                      newPositionPoints: r,
                    }),
                  )
                })
              })
            } finally {
              r.setValue('', !0)
            }
          }),
          o
        )
      }
      function _(e, t) {
        const n = m(e, t, (e) => ({ index: e })),
          o = m(e, t, (e) => ({ price: e }))
        return (0, a.createSelectionCoordinatesPropertyDefinition)(
          { x: n, y: o },
          {
            id: 'SourcesCoordinates',
            title: r.t(null, void 0, i(37067)),
            mathOperationsX: '+',
            mathOperationsY: '+/*',
            modeX: 'integer',
            modeY: 'float',
          },
        )
      }
    },
    97456: (e, t, i) => {
      i.r(t),
        i.d(t, {
          getIntervalsVisibilitiesPropertiesDefinitions: () => ae,
          getSelectionIntervalsVisibilitiesPropertiesDefinition: () => de,
        })
      var n = i(11542),
        r = i(36298),
        o = i(14483),
        s = i(295),
        l = i(97145),
        a = i(94025),
        d = i(68806),
        c = i(62513)
      const p = new r.TranslatedString(
          'change {title} visibility on ticks',
          n.t(null, void 0, i(30810)),
        ),
        u = new r.TranslatedString(
          'change {title} visibility on seconds',
          n.t(null, void 0, i(46948)),
        ),
        h = new r.TranslatedString(
          'change {title} seconds from',
          n.t(null, void 0, i(2822)),
        ),
        y = new r.TranslatedString(
          'change {title} seconds to',
          n.t(null, void 0, i(66161)),
        ),
        P = new r.TranslatedString(
          'change {title} visibility on minutes',
          n.t(null, void 0, i(64370)),
        ),
        f = new r.TranslatedString(
          'change {title} minutes from',
          n.t(null, void 0, i(15106)),
        ),
        g = new r.TranslatedString(
          'change {title} minutes to',
          n.t(null, void 0, i(91633)),
        ),
        w = new r.TranslatedString(
          'change {title} visibility on hours',
          n.t(null, void 0, i(68971)),
        ),
        m = new r.TranslatedString(
          'change {title} hours from',
          n.t(null, void 0, i(35388)),
        ),
        _ = new r.TranslatedString(
          'change {title} hours to',
          n.t(null, void 0, i(78586)),
        ),
        b = new r.TranslatedString(
          'change {title} visibility on days',
          n.t(null, void 0, i(29088)),
        ),
        v = new r.TranslatedString(
          'change {title} days from',
          n.t(null, void 0, i(41377)),
        ),
        S = new r.TranslatedString(
          'change {title} days to',
          n.t(null, void 0, i(13355)),
        ),
        T = new r.TranslatedString(
          'change {title} visibility on weeks',
          n.t(null, void 0, i(24941)),
        ),
        C = new r.TranslatedString(
          'change {title} weeks from',
          n.t(null, void 0, i(21339)),
        ),
        V = new r.TranslatedString(
          'change {title} weeks to',
          n.t(null, void 0, i(68643)),
        ),
        D = new r.TranslatedString(
          'change {title} visibility on months',
          n.t(null, void 0, i(6659)),
        ),
        W = new r.TranslatedString(
          'change {title} months from',
          n.t(null, void 0, i(59635)),
        ),
        k = new r.TranslatedString(
          'change {title} months to',
          n.t(null, void 0, i(74266)),
        ),
        x =
          (new r.TranslatedString(
            'change {title} visibility on ranges',
            n.t(null, { replace: { ranges: 'ranges' } }, i(8917)),
          ),
          n.t(null, void 0, i(30973))),
        I = n.t(null, void 0, i(71129)),
        M = n.t(null, void 0, i(28134)),
        U = n.t(null, void 0, i(63099)),
        A = n.t(null, void 0, i(22192)),
        L = n.t(null, void 0, i(21594)),
        R = n.t(null, void 0, i(95543)),
        F = new r.TranslatedString('ticks', n.t(null, void 0, i(59523))),
        N = new r.TranslatedString('seconds', n.t(null, void 0, i(32925))),
        Y = new r.TranslatedString('seconds from', n.t(null, void 0, i(6049))),
        E = new r.TranslatedString('seconds to', n.t(null, void 0, i(39017))),
        X = new r.TranslatedString('minutes', n.t(null, void 0, i(16465))),
        H = new r.TranslatedString('minutes from', n.t(null, void 0, i(25586))),
        $ = new r.TranslatedString('minutes to', n.t(null, void 0, i(72317))),
        j = new r.TranslatedString('hours', n.t(null, void 0, i(3143))),
        K = new r.TranslatedString('hours from', n.t(null, void 0, i(84775))),
        O = new r.TranslatedString('hours to', n.t(null, void 0, i(11255))),
        z = new r.TranslatedString('days', n.t(null, void 0, i(82211))),
        B = new r.TranslatedString('days from', n.t(null, void 0, i(14077))),
        q = new r.TranslatedString('days to', n.t(null, void 0, i(33486))),
        G = new r.TranslatedString('weeks', n.t(null, void 0, i(93016))),
        J = new r.TranslatedString('weeks from', n.t(null, void 0, i(32002))),
        Q = new r.TranslatedString('weeks to', n.t(null, void 0, i(28091))),
        Z = new r.TranslatedString('months', n.t(null, void 0, i(58964))),
        ee = new r.TranslatedString('months from', n.t(null, void 0, i(71770))),
        te = new r.TranslatedString('months to', n.t(null, void 0, i(37179))),
        ie = (new r.TranslatedString('ranges', 'ranges'), [1, 59]),
        ne = [1, 59],
        re = [1, 24],
        oe = [1, 366],
        se = [1, 52],
        le = [1, 12]
      function ae(e, t, i) {
        const n = []
        if (o.enabled('tick_resolution')) {
          const r = (0, s.createCheckablePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                e,
                t.ticks,
                p.format({ title: i }),
              ),
            },
            { id: 'IntervalsVisibilitiesTicks', title: x },
          )
          n.push(r)
        }
        if ((0, a.isSecondsEnabled)()) {
          const r = (0, s.createRangePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                e,
                t.seconds,
                u.format({ title: i }),
              ),
              from: (0, s.convertToDefinitionProperty)(
                e,
                t.secondsFrom,
                h.format({ title: i }),
              ),
              to: (0, s.convertToDefinitionProperty)(
                e,
                t.secondsTo,
                y.format({ title: i }),
              ),
            },
            {
              id: 'IntervalsVisibilitiesSecond',
              title: I,
              min: new l.WatchedValue(ie[0]),
              max: new l.WatchedValue(ie[1]),
            },
          )
          n.push(r)
        }
        const r = (0, s.createRangePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                e,
                t.minutes,
                P.format({ title: i }),
              ),
              from: (0, s.convertToDefinitionProperty)(
                e,
                t.minutesFrom,
                f.format({ title: i }),
              ),
              to: (0, s.convertToDefinitionProperty)(
                e,
                t.minutesTo,
                g.format({ title: i }),
              ),
            },
            {
              id: 'IntervalsVisibilitiesMinutes',
              title: M,
              min: new l.WatchedValue(ne[0]),
              max: new l.WatchedValue(ne[1]),
            },
          ),
          d = (0, s.createRangePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                e,
                t.hours,
                w.format({ title: i }),
              ),
              from: (0, s.convertToDefinitionProperty)(
                e,
                t.hoursFrom,
                m.format({ title: i }),
              ),
              to: (0, s.convertToDefinitionProperty)(
                e,
                t.hoursTo,
                _.format({ title: i }),
              ),
            },
            {
              id: 'IntervalsVisibilitiesHours',
              title: U,
              min: new l.WatchedValue(re[0]),
              max: new l.WatchedValue(re[1]),
            },
          ),
          c = (0, s.createRangePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                e,
                t.days,
                b.format({ title: i }),
              ),
              from: (0, s.convertToDefinitionProperty)(
                e,
                t.daysFrom,
                v.format({ title: i }),
              ),
              to: (0, s.convertToDefinitionProperty)(
                e,
                t.daysTo,
                S.format({ title: i }),
              ),
            },
            {
              id: 'IntervalsVisibilitiesDays',
              title: A,
              min: new l.WatchedValue(oe[0]),
              max: new l.WatchedValue(oe[1]),
            },
          )
        n.push(r, d, c)
        const F = (0, s.createRangePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                e,
                t.weeks,
                T.format({ title: i }),
              ),
              from: (0, s.convertToDefinitionProperty)(
                e,
                t.weeksFrom,
                C.format({ title: i }),
              ),
              to: (0, s.convertToDefinitionProperty)(
                e,
                t.weeksTo,
                V.format({ title: i }),
              ),
            },
            {
              id: 'IntervalsVisibilitiesWeeks',
              title: L,
              min: new l.WatchedValue(se[0]),
              max: new l.WatchedValue(se[1]),
            },
          ),
          N = (0, s.createRangePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                e,
                t.months,
                D.format({ title: i }),
              ),
              from: (0, s.convertToDefinitionProperty)(
                e,
                t.monthsFrom,
                W.format({ title: i }),
              ),
              to: (0, s.convertToDefinitionProperty)(
                e,
                t.monthsTo,
                k.format({ title: i }),
              ),
            },
            {
              id: 'IntervalsVisibilitiesMonths',
              title: R,
              min: new l.WatchedValue(le[0]),
              max: new l.WatchedValue(le[1]),
            },
          )
        return n.push(F, N), { definitions: n }
      }
      function de(e, t) {
        const i = []
        if (o.enabled('tick_resolution')) {
          const n = (0, s.createCheckablePropertyDefinition)(
            {
              checked: new c.CollectiblePropertyUndoWrapper(
                new d.LineToolCollectedProperty(e.ticks),
                F,
                t,
              ),
            },
            { id: 'IntervalsVisibilitiesTicks', title: x },
          )
          i.push(n)
        }
        if ((0, a.isSecondsEnabled)()) {
          const n = (0, s.createRangePropertyDefinition)(
            {
              checked: new c.CollectiblePropertyUndoWrapper(
                new d.LineToolCollectedProperty(e.seconds),
                N,
                t,
              ),
              from: new c.CollectiblePropertyUndoWrapper(
                new d.LineToolCollectedProperty(e.secondsFrom),
                Y,
                t,
              ),
              to: new c.CollectiblePropertyUndoWrapper(
                new d.LineToolCollectedProperty(e.secondsTo),
                E,
                t,
              ),
            },
            {
              id: 'IntervalsVisibilitiesSecond',
              title: I,
              min: new l.WatchedValue(ie[0]),
              max: new l.WatchedValue(ie[1]),
            },
          )
          i.push(n)
        }
        const n = (0, s.createRangePropertyDefinition)(
            {
              checked: new c.CollectiblePropertyUndoWrapper(
                new d.LineToolCollectedProperty(e.minutes),
                X,
                t,
              ),
              from: new c.CollectiblePropertyUndoWrapper(
                new d.LineToolCollectedProperty(e.minutesFrom),
                H,
                t,
              ),
              to: new c.CollectiblePropertyUndoWrapper(
                new d.LineToolCollectedProperty(e.minutesTo),
                $,
                t,
              ),
            },
            {
              id: 'IntervalsVisibilitiesMinutes',
              title: M,
              min: new l.WatchedValue(ne[0]),
              max: new l.WatchedValue(ne[1]),
            },
          ),
          r = (0, s.createRangePropertyDefinition)(
            {
              checked: new c.CollectiblePropertyUndoWrapper(
                new d.LineToolCollectedProperty(e.hours),
                j,
                t,
              ),
              from: new c.CollectiblePropertyUndoWrapper(
                new d.LineToolCollectedProperty(e.hoursFrom),
                K,
                t,
              ),
              to: new c.CollectiblePropertyUndoWrapper(
                new d.LineToolCollectedProperty(e.hoursTo),
                O,
                t,
              ),
            },
            {
              id: 'IntervalsVisibilitiesHours',
              title: U,
              min: new l.WatchedValue(re[0]),
              max: new l.WatchedValue(re[1]),
            },
          ),
          p = (0, s.createRangePropertyDefinition)(
            {
              checked: new c.CollectiblePropertyUndoWrapper(
                new d.LineToolCollectedProperty(e.days),
                z,
                t,
              ),
              from: new c.CollectiblePropertyUndoWrapper(
                new d.LineToolCollectedProperty(e.daysFrom),
                B,
                t,
              ),
              to: new c.CollectiblePropertyUndoWrapper(
                new d.LineToolCollectedProperty(e.daysTo),
                q,
                t,
              ),
            },
            {
              id: 'IntervalsVisibilitiesDays',
              title: A,
              min: new l.WatchedValue(oe[0]),
              max: new l.WatchedValue(oe[1]),
            },
          )
        i.push(n, r, p)
        const u = (0, s.createRangePropertyDefinition)(
            {
              checked: new c.CollectiblePropertyUndoWrapper(
                new d.LineToolCollectedProperty(e.weeks),
                G,
                t,
              ),
              from: new c.CollectiblePropertyUndoWrapper(
                new d.LineToolCollectedProperty(e.weeksFrom),
                J,
                t,
              ),
              to: new c.CollectiblePropertyUndoWrapper(
                new d.LineToolCollectedProperty(e.weeksTo),
                Q,
                t,
              ),
            },
            {
              id: 'IntervalsVisibilitiesWeeks',
              title: L,
              min: new l.WatchedValue(se[0]),
              max: new l.WatchedValue(se[1]),
            },
          ),
          h = (0, s.createRangePropertyDefinition)(
            {
              checked: new c.CollectiblePropertyUndoWrapper(
                new d.LineToolCollectedProperty(e.months),
                Z,
                t,
              ),
              from: new c.CollectiblePropertyUndoWrapper(
                new d.LineToolCollectedProperty(e.monthsFrom),
                ee,
                t,
              ),
              to: new c.CollectiblePropertyUndoWrapper(
                new d.LineToolCollectedProperty(e.monthsTo),
                te,
                t,
              ),
            },
            {
              id: 'IntervalsVisibilitiesMonths',
              title: R,
              min: new l.WatchedValue(le[0]),
              max: new l.WatchedValue(le[1]),
            },
          )
        return i.push(u, h), { definitions: i }
      }
    },
    85766: (e, t, i) => {
      i.r(t), i.d(t, { LineDataSourceDefinitionsViewModel: () => m })
      var n = i(50151),
        r = i(11542),
        o = i(36298),
        s = (i(42053), i(295)),
        l = i(73955),
        a = i(97145),
        d = i(97456),
        c = i(41339),
        p = i(87919),
        u = i(37591)
      const h = r.t(null, void 0, i(21852)),
        y = r.t(null, void 0, i(4639)),
        P = r.t(null, void 0, i(32733)),
        f = r.t(null, void 0, i(37229)),
        g = r.t(null, void 0, i(66304)),
        w = r.t(null, { context: 'linetool point' }, i(9671))
      class m {
        constructor(e, t) {
          ;(this._yCoordinateStepWV = null),
            (this._propertyPages = []),
            (this._source = t),
            (this._undoModel = e),
            (this._ownerSource = (0, n.ensureNotNull)(
              this._source.ownerSource(),
            )),
            (this._propertyApplier = new p.PropertyApplierWithoutSavingChart(
              () => e,
              new a.WatchedValue(false),
            )),
            this._createPropertyRages()
        }
        destroy() {
          null !== this._yCoordinateStepWV &&
            (this._source.ownerSourceChanged().unsubscribeAll(this),
            this._ownerSource.priceStepChanged().unsubscribeAll(this)),
            this._source.pointAdded().unsubscribeAll(this),
            this._propertyPages.forEach((e) => {
              ;(0, s.destroyDefinitions)(e.definitions.value())
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
          if (
            (null !== i && this._propertyPages.push(i),
            this._source.hasEditableCoordinates())
          ) {
            const e = this._createCoordinatesPropertyPage()
            null !== e && this._propertyPages.push(e)
          }
          const n = this._createVisibilitiesPropertyPage()
          this._propertyPages.push(n)
        }
        _createVisibilitiesPropertyPage() {
          const e = this._source
            .properties()
            .childs()
            .intervalsVisibilities.childs()
          return (0, l.createPropertyPage)(
            (0, d.getIntervalsVisibilitiesPropertiesDefinitions)(
              this._undoModel,
              e,
              new o.TranslatedString(
                this._source.name(),
                this._source.title(u.TitleDisplayTarget.StatusLine, !0),
              ),
            ),
            'visibility',
            h,
          )
        }
        _createCoordinatesPropertyPage() {
          const e = this._coordinatesPropertyDefinitions()
          return null !== e
            ? (e.definitions.length < this._source.pointsCount() &&
                this._source
                  .pointAdded()
                  .subscribe(this, this._updateCoordinatesPropertyDefinitons),
              (0, l.createPropertyPage)(e, 'coordinates', y))
            : null
        }
        _getYCoordinateStepWV() {
          return (
            null === this._yCoordinateStepWV &&
              ((this._yCoordinateStepWV = new a.WatchedValue(
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
            n = this._getYCoordinateStepWV()
          return (
            e.forEach((e, r) => {
              const o = t[r].childs()
              o &&
                i.push(
                  (0, c.getCoordinatesPropertiesDefinitions)(
                    this._propertyApplier,
                    o,
                    e,
                    n,
                    w.format({ count: (r + 1).toString() }),
                    this._source.name(),
                  ),
                )
            }),
            { definitions: i }
          )
        }
        _createStylePropertyPage() {
          const e = this._stylePropertyDefinitions()
          return null !== e ? (0, l.createPropertyPage)(e, 'style', P) : null
        }
        _stylePropertyDefinitions() {
          return null
        }
        _createTextPropertyPage() {
          const e = this._textPropertyDefinitions()
          return null !== e ? (0, l.createPropertyPage)(e, 'text', f) : null
        }
        _textPropertyDefinitions() {
          return null
        }
        _createInputsPropertyPage() {
          const e = this._inputsPropertyDefinitions()
          return null !== e ? (0, l.createPropertyPage)(e, 'inputs', g) : null
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
    56059: (e, t, i) => {
      i.r(t), i.d(t, { StudyLineDataSourceDefinitionsViewModel: () => c })
      var n = i(11542),
        r = (i(42053), i(57898)),
        o = i(295),
        s = i(85766),
        l = i(96362),
        a = i(41339),
        d = i(94474)
      class c extends s.LineDataSourceDefinitionsViewModel {
        constructor(e, t) {
          super(e, t)
        }
        _inputsPropertyDefinitions() {
          return {
            definitions: [
              (0, o.createStudyInputsPropertyDefinition)(
                {},
                {
                  id: 'StudyInputs',
                  inputs: new l.MetaInfoHelper(
                    this._source.metaInfo(),
                  ).getUserEditableInputs(),
                  inputsTabProperty: this._source.properties(),
                  model: this._undoModel,
                  studyMetaInfo: this._source.metaInfo(),
                  source: {
                    isInputsStudy: !0,
                    symbolsResolved: () => new r.Delegate(),
                    resolvedSymbolInfoBySymbol: (e) => null,
                  },
                },
              ),
            ],
          }
        }
        _coordinatesPropertyDefinitions() {
          const e = this._source.points(),
            t = this._source.pointsProperty().childs().points,
            r = []
          return (
            e.forEach((e, s) => {
              const l = t[s].childs()
              if (!l) return
              const c = (0, a.getCoordinateXMetaInfo)(this._propertyApplier, l)
              r.push(
                (0, o.createCoordinatesPropertyDefinition)(
                  { x: c.property },
                  {
                    id: (0, d.removeSpaces)(`${this._source.name()}Point${s}`),
                    title: n
                      .t(null, { context: 'linetool point' }, i(63227))
                      .format({ count: (s + 1).toString() }),
                    ...c.info,
                  },
                ),
              )
            }),
            { definitions: r }
          )
        }
      }
    },
    62513: (e, t, i) => {
      i.d(t, { CollectiblePropertyUndoWrapper: () => a })
      var n = i(50151),
        r = i(11542),
        o = i(36298),
        s = i(88640)
      const l = new o.TranslatedString(
        'change {propertyName} property',
        r.t(null, void 0, i(18567)),
      )
      class a extends s.default {
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
          var i
          const r = (0, n.ensureDefined)(
            null ===
              (i = this._listenersMappers.find(
                (i) => i.obj === e && i.method === t,
              )) || void 0 === i
              ? void 0
              : i.callback,
          )
          this._baseProperty.unsubscribe(e, r)
        }
        unsubscribeAll(e) {
          this._baseProperty.unsubscribeAll(e)
        }
      }
    },
    87919: (e, t, i) => {
      i.d(t, { PropertyApplierWithoutSavingChart: () => n })
      class n {
        constructor(e, t) {
          ;(this._undoModelSupplier = e), (this._featureToggle = t)
        }
        setProperty(e, t, i) {
          this._undoModelSupplier().setProperty(
            e,
            t,
            i,
            this._featureToggle.value(),
          )
        }
        beginUndoMacro(e) {
          return this._undoModelSupplier().beginUndoMacro(
            e,
            this._shouldWeKeepChartValidated(),
          )
        }
        endUndoMacro() {
          this._undoModelSupplier().endUndoMacro()
        }
        setWatchedValue(e, t, i) {
          this._undoModelSupplier().undoHistory().setWatchedValue(e, t, i, !0)
        }
        _shouldWeKeepChartValidated() {
          const e = this._undoModelSupplier()
            .model()
            .isAutoSaveEnabled()
            .value()
          return this._featureToggle.value() && e
        }
      }
    },
    99970: (e, t, i) => {
      i.d(t, { StudyPlotVisibleProperty: () => o })
      var n = i(19782),
        r = i(57898)
      class o {
        constructor(e) {
          ;(this._subscribers = new r.Delegate()),
            (this._displayProperty = e),
            this._displayProperty.subscribe(
              this,
              this._displayPropertyValueChanged,
            )
        }
        destroy() {
          this._displayProperty.unsubscribe(
            this,
            this._displayPropertyValueChanged,
          ),
            this._subscribers.destroy()
        }
        value() {
          return 0 !== this._displayProperty.value()
        }
        setValue(e, t) {
          this._displayProperty.setValue(e ? 15 : 0)
        }
        subscribe(e, t) {
          this._subscribers.subscribe(e, t, !1)
        }
        unsubscribe(e, t) {
          this._subscribers.unsubscribe(e, t)
        }
        unsubscribeAll(e) {
          this._subscribers.unsubscribeAll(e)
        }
        storeStateIfUndefined() {
          return !1
        }
        weakReference() {
          return (0, n.weakReference)(this)
        }
        ownership() {
          return (0, n.ownership)(this)
        }
        _displayPropertyValueChanged() {
          this._subscribers.fire(this)
        }
      }
    },
  },
])
