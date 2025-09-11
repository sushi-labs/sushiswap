;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [607],
  {
    73174: (e, t, i) => {
      i.r(t),
        i.d(t, {
          getCoordinateXMetaInfo: () => P,
          getCoordinateYMetaInfo: () => S,
          getCoordinatesPropertiesDefinitions: () => m,
          getSelectionCoordinatesPropertyDefinition: () => D,
        })
      var n = i(50151),
        o = i(11542),
        r = i(45126),
        s = i(44672),
        l = i(60265)
      class a extends l.UndoCommand {
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
            e.updateAllViews((0, s.sourceChangeEvent)(e.id())),
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
              e.updateAllViews((0, s.sourceChangeEvent)(e.id())),
              e.syncMultichartState(e.endChanging(!0, !1))
          }
        }
      }
      var u = i(32097),
        p = i(64147),
        d = i(12988),
        c = i(91682)
      const y = -5e4,
        h = 15e3,
        f = new r.TranslatedString(
          'change price Y coordinate',
          o.t(null, void 0, i(11737)),
        ),
        v = new r.TranslatedString(
          'change bar X coordinate',
          o.t(null, void 0, i(2066)),
        ),
        _ = new r.TranslatedString('move drawings', o.t(null, void 0, i(76261)))
      function S(e, t, i) {
        return {
          property: (0, u.convertToDefinitionProperty)(e, t.price, f),
          info: { typeY: 1, stepY: i },
        }
      }
      function P(e, t) {
        return {
          property: (0, u.convertToDefinitionProperty)(e, t.bar, v),
          info: {
            typeX: 0,
            minX: new p.WatchedValue(y),
            maxX: new p.WatchedValue(h),
            stepX: new p.WatchedValue(1),
          },
        }
      }
      function m(e, t, i, n, o, r) {
        const s = P(e, t),
          l = S(e, t, n)
        return (0, u.createCoordinatesPropertyDefinition)(
          { x: s.property, y: l.property },
          {
            id: (0, c.removeSpaces)(`${r}Coordinates${o}`),
            title: o,
            ...s.info,
            ...l.info,
          },
        )
      }
      const g = /^([+*\-\/]?)((?:\d*)|(?:\d+\.\d*))$/
      function b(e, t, i) {
        const o = new d.Property(''),
          r = (0, u.makeProxyDefinitionProperty)(o.weakReference())
        return (
          (r.setValue = (r) => {
            try {
              const o = r.match(g)
              if (!o) return
              const [, s, l] = o
              if (!l.length) return
              const u = i(Number.parseFloat(l))
              if ('/' === s && (0 === u.price || 0 === u.index)) return
              t.withMacro(_, () => {
                e.filter((e) => !e.isSourceHidden()).forEach((e) => {
                  const i = e.points()
                  let o
                  switch (s) {
                    case '': {
                      const e = (0, n.ensureDefined)(i[0])
                      let { index: t = e.index, price: r = e.price } = u
                      ;(r -= e.price),
                        (t -= e.index),
                        (o = i.map((e) => ({
                          ...e,
                          index: e.index + t,
                          price: e.price + r,
                        })))
                      break
                    }
                    case '-':
                    case '+': {
                      let { index: e = 0, price: t = 0 } = u
                      '-' === s && ((e *= -1), (t *= -1)),
                        (o = i.map((i) => ({
                          ...i,
                          index: i.index + e,
                          price: i.price + t,
                        })))
                      break
                    }
                    case '*': {
                      const { index: e = 1, price: t = 1 } = u
                      o = i.map((i) => ({
                        ...i,
                        index: i.index * e,
                        price: i.price * t,
                      }))
                      break
                    }
                    case '/': {
                      const { index: e = 1, price: t = 1 } = u
                      o = i.map((i) => ({
                        ...i,
                        index: i.index / e,
                        price: i.price / t,
                      }))
                      break
                    }
                  }
                  t.undoHistory().pushUndoCommand(
                    new a({
                      lineToolId: e.id(),
                      chartModel: t.model(),
                      newPositionPoints: o,
                    }),
                  )
                })
              })
            } finally {
              o.setValue('', !0)
            }
          }),
          r
        )
      }
      function D(e, t) {
        const n = b(e, t, (e) => ({ index: e })),
          r = b(e, t, (e) => ({ price: e }))
        return (0, u.createSelectionCoordinatesPropertyDefinition)(
          { x: n, y: r },
          {
            id: 'SourcesCoordinates',
            title: o.t(null, void 0, i(44272)),
            mathOperationsX: '+',
            mathOperationsY: '+/*',
            modeX: 'integer',
            modeY: 'float',
          },
        )
      }
    },
    42838: (e, t, i) => {
      i.r(t), i.d(t, { RegressionTrendDefinitionsViewModel: () => V })
      var n = i(11542),
        o = i(45126),
        r = (i(21251), i(32097)),
        s = i(31507),
        l = i(91682),
        a = i(1183)
      const u = new o.TranslatedString(
          'change {title} base line visibility',
          n.t(null, void 0, i(96177)),
        ),
        p = new o.TranslatedString(
          'change {title} base line color',
          n.t(null, void 0, i(78509)),
        ),
        d = new o.TranslatedString(
          'change {title} base line width',
          n.t(null, void 0, i(17926)),
        ),
        c = new o.TranslatedString(
          'change {title} base line style',
          n.t(null, void 0, i(27864)),
        ),
        y = new o.TranslatedString(
          'change {title} up line visibility',
          n.t(null, void 0, i(42553)),
        ),
        h = new o.TranslatedString(
          'change {title} up line color',
          n.t(null, void 0, i(89178)),
        ),
        f = new o.TranslatedString(
          'change {title} up line width',
          n.t(null, void 0, i(63824)),
        ),
        v = new o.TranslatedString(
          'change {title} up line style',
          n.t(null, void 0, i(51188)),
        ),
        _ = new o.TranslatedString(
          'change {title} down line visibility',
          n.t(null, void 0, i(46410)),
        ),
        S = new o.TranslatedString(
          'change {title} down line color',
          n.t(null, void 0, i(41638)),
        ),
        P = new o.TranslatedString(
          'change {title} down line width',
          n.t(null, void 0, i(64615)),
        ),
        m = new o.TranslatedString(
          'change {title} down line style',
          n.t(null, void 0, i(51842)),
        ),
        g = new o.TranslatedString(
          'change {title} extend lines',
          n.t(null, void 0, i(76295)),
        ),
        b = new o.TranslatedString(
          "change {title} show pearson's r",
          n.t(null, void 0, i(6207)),
        ),
        D = n.t(null, void 0, i(42398)),
        w = n.t(null, void 0, i(22691)),
        I = n.t(null, void 0, i(71776)),
        T = n.t(null, void 0, i(13350)),
        C = n.t(null, void 0, i(819))
      class V extends s.StudyLineDataSourceDefinitionsViewModel {
        constructor(e, t) {
          super(e, t)
        }
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs().styles.childs(),
            t = this._source.name(),
            i = (0, l.removeSpaces)(t),
            n = new o.TranslatedString(t, this._source.translatedType()),
            s = e.baseLine.childs(),
            V = (0, r.createLinePropertyDefinition)(
              {
                checked: (0, r.convertToDefinitionProperty)(
                  this._propertyApplier,
                  new a.StudyPlotVisibleProperty(s.display),
                  u.format({ title: n }),
                ),
                color: (0, r.getColorDefinitionProperty)(
                  this._propertyApplier,
                  s.color,
                  e.transparency,
                  p.format({ title: n }),
                ),
                width: (0, r.convertToDefinitionProperty)(
                  this._propertyApplier,
                  s.linewidth,
                  d.format({ title: n }),
                ),
                style: (0, r.convertToDefinitionProperty)(
                  this._propertyApplier,
                  s.linestyle,
                  c.format({ title: n }),
                ),
              },
              { id: `${i}BaseLine`, title: D },
            ),
            x = e.upLine.childs(),
            M = (0, r.createLinePropertyDefinition)(
              {
                checked: (0, r.convertToDefinitionProperty)(
                  this._propertyApplier,
                  new a.StudyPlotVisibleProperty(x.display),
                  y.format({ title: n }),
                ),
                color: (0, r.getColorDefinitionProperty)(
                  this._propertyApplier,
                  x.color,
                  e.transparency,
                  h.format({ title: n }),
                ),
                width: (0, r.convertToDefinitionProperty)(
                  this._propertyApplier,
                  x.linewidth,
                  f.format({ title: n }),
                ),
                style: (0, r.convertToDefinitionProperty)(
                  this._propertyApplier,
                  x.linestyle,
                  v.format({ title: n }),
                ),
              },
              { id: `${i}UpLine`, title: w },
            ),
            k = e.downLine.childs()
          return {
            definitions: [
              V,
              M,
              (0, r.createLinePropertyDefinition)(
                {
                  checked: (0, r.convertToDefinitionProperty)(
                    this._propertyApplier,
                    new a.StudyPlotVisibleProperty(k.display),
                    _.format({ title: n }),
                  ),
                  color: (0, r.getColorDefinitionProperty)(
                    this._propertyApplier,
                    k.color,
                    e.transparency,
                    S.format({ title: n }),
                  ),
                  width: (0, r.convertToDefinitionProperty)(
                    this._propertyApplier,
                    k.linewidth,
                    P.format({ title: n }),
                  ),
                  style: (0, r.convertToDefinitionProperty)(
                    this._propertyApplier,
                    k.linestyle,
                    m.format({ title: n }),
                  ),
                },
                { id: `${i}DownLine`, title: I },
              ),
              (0, r.createCheckablePropertyDefinition)(
                {
                  checked: (0, r.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.extendLines,
                    g.format({ title: n }),
                  ),
                },
                { id: `${i}ExtendLines`, title: C },
              ),
              (0, r.createCheckablePropertyDefinition)(
                {
                  checked: (0, r.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.showPearsons,
                    b.format({ title: n }),
                  ),
                },
                { id: `${i}Pearsons`, title: T },
              ),
            ],
          }
        }
      }
    },
    31507: (e, t, i) => {
      i.r(t), i.d(t, { StudyLineDataSourceDefinitionsViewModel: () => p })
      var n = i(11542),
        o = (i(21251), i(52033)),
        r = i(32097),
        s = i(18009),
        l = i(28388),
        a = i(73174),
        u = i(91682)
      class p extends s.LineDataSourceDefinitionsViewModel {
        constructor(e, t) {
          super(e, t)
        }
        _inputsPropertyDefinitions() {
          return {
            definitions: [
              (0, r.createStudyInputsPropertyDefinition)(
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
                    symbolsResolved: () => new o.Delegate(),
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
            o = []
          return (
            e.forEach((e, s) => {
              const l = t[s].childs()
              if (!l) return
              const p = (0, a.getCoordinateXMetaInfo)(this._propertyApplier, l)
              o.push(
                (0, r.createCoordinatesPropertyDefinition)(
                  { x: p.property },
                  {
                    id: (0, u.removeSpaces)(`${this._source.name()}Point${s}`),
                    title: n
                      .t(null, { context: 'linetool point' }, i(13616))
                      .format({ count: (s + 1).toString() }),
                    ...p.info,
                  },
                ),
              )
            }),
            { definitions: o }
          )
        }
      }
    },
    15306: (e, t, i) => {
      i.r(t), i.d(t, { StudyOverlayDefinitionsViewModel: () => J })
      var n = i(11542),
        o = i(45126),
        r = i(56570),
        s = i(50151),
        l = (i(21251), i(32097)),
        a = i(57717),
        u = i(65383),
        p = i(64147),
        d = i(56530),
        c = i(91682)
      const y = new o.TranslatedString(
        'change {inputName} property',
        n.t(null, void 0, i(66110)),
      )
      function h(e, t) {
        const i = e.id
        return (
          i !== u.RangeDependentStudyInputNames.FirstBar &&
          i !== u.RangeDependentStudyInputNames.LastBar &&
          'time' !== e.type && !e.isHidden && !(t && !e.confirm) &&
          void 0 === e.groupId
        )
      }
      function f(e) {
        return e.name || (0, c.capitalizeFirstLetterInWord)(e.id.toLowerCase())
      }
      var v,
        _ = i(68159),
        S = i(10074),
        P = i(19466),
        m = i(26434),
        g = i(74343)
      !((e) => {
        ;(e.Style = 'style'),
          (e.Inputs = 'inputs'),
          (e.Visibility = 'visibility')
      })(v || (v = {}))
      const b = n.t(null, void 0, i(92516)),
        D = n.t(null, void 0, i(21429)),
        w = n.t(null, void 0, i(40091)),
        I = [
          '1',
          '3',
          '5',
          '15',
          '30',
          '45',
          '60',
          '120',
          '180',
          '240',
          '1D',
          '1W',
          '1M',
        ].map((e) => ({
          value: e,
          title: (0, S.getTranslatedResolutionModel)(e).hint,
        }))
      class T {
        constructor(e, t) {
          ;(this._inputSourceItems = null),
            (this._propertyPages = []),
            (this._sourceInput = null),
            (this._source = t),
            (this._undoModel = e)
          const i = this._sortInputs(this._source.metaInfo().inputs)
          for (const e of i) 'source' === e.type && (this._sourceInput = e)
          this._createPropertyRages(),
            null !== this._inputSourceItems &&
              this._undoModel
                .model()
                .dataSourceCollectionChanged()
                .subscribe(this, () => {
                  null !== this._inputSourceItems &&
                    this._inputSourceItems.setValue(this._getInputSourceItems())
                })
        }
        destroy() {
          null !== this._inputSourceItems &&
            this._undoModel
              .model()
              .dataSourceCollectionChanged()
              .unsubscribeAll(this),
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
          null !== t && this._propertyPages.push(t),
            this._propertyPages.push(this._createVisibilitiesPropertyPage())
        }
        _createStylePropertyPage() {
          const e = this._stylePropertyDefinitions()
          return null !== e ? (0, a.createPropertyPage)(e, 'style', b) : null
        }
        _createVisibilitiesPropertyPage() {
          const e = this._source
            .properties()
            .childs()
            .intervalsVisibilities.childs()
          return (0, a.createPropertyPage)(
            (0, m.getIntervalsVisibilitiesPropertiesDefinitions)(
              this._undoModel,
              e,
              new o.TranslatedString(
                this._source.name(!0),
                this._source.title(P.TitleDisplayTarget.StatusLine, !0),
              ),
            ),
            'visibility',
            w,
          )
        }
        _stylePropertyDefinitions() {
          return null
        }
        _createInputsPropertyPage() {
          const e = this._inputsPropertyDefinitions()
          return null !== e ? (0, a.createPropertyPage)(e, 'inputs', D) : null
        }
        _inputsPropertyDefinitions() {
          const e = this._sortInputs(this._source.metaInfo().inputs),
            t = this._source.properties().childs().inputs.childs()
          return (
            null !== this._sourceInput &&
              (this._inputSourceItems = new p.WatchedValue(
                this._getInputSourceItems(),
              )),
            ((e, t, i, n, r) => {
              const a = []
              for (const u of t) {
                if (!h(u, n)) continue
                const t = f(u),
                  c = `StudyInput${u.id}`,
                  v = (0, d.getTranslatedInputTitle)(t),
                  _ = new o.TranslatedString(t, v)
                let S = null
                if ('resolution' === u.type)
                  S = (0, l.createOptionsPropertyDefinition)(
                    {
                      option: (0, l.convertToDefinitionProperty)(
                        e,
                        i[u.id],
                        y.format({ inputName: _ }),
                      ),
                    },
                    {
                      id: c,
                      title: v,
                      options: new p.WatchedValue(r.resolutionItems),
                    },
                  )
                else if ('source' === u.type) {
                  const t = (0, s.ensure)(r.sourcesItems)
                  S = (0, l.createOptionsPropertyDefinition)(
                    {
                      option: (0, l.convertToDefinitionProperty)(
                        e,
                        i[u.id],
                        y.format({ inputName: _ }),
                      ),
                    },
                    { id: c, title: v, options: t },
                  )
                } else if ('options' in u && void 0 !== u.options) {
                  const t = []
                  for (const e of u.options) {
                    const i = (u.optionsTitles && u.optionsTitles[e]) || e,
                      n = (0, d.getTranslatedInputTitle)(i)
                    t.push({ value: e, title: n })
                  }
                  S = (0, l.createOptionsPropertyDefinition)(
                    {
                      option: (0, l.convertToDefinitionProperty)(
                        e,
                        i[u.id],
                        y.format({ inputName: _ }),
                      ),
                    },
                    { id: c, title: v, options: new p.WatchedValue(t) },
                  )
                } else if ('symbol' === u.type) {
                  const t = i[u.id],
                    n = (0, s.ensure)(r.getSymbolInfoBySymbol),
                    o = (0, s.ensure)(r.onSymbolsInfosChanged)
                  S = (0, l.createSymbolPropertyDefinition)(
                    {
                      symbol: (0, l.getSymbolDefinitionProperty)(
                        e,
                        t,
                        n,
                        o,
                        y.format({ inputName: _ }),
                        r.customSymbolInputSetter,
                      ),
                    },
                    { id: c, title: v },
                  )
                } else if ('session' === u.type)
                  S = (0, l.createSessionPropertyDefinition)(
                    {
                      session: (0, l.convertToDefinitionProperty)(
                        e,
                        i[u.id],
                        y.format({ inputName: _ }),
                      ),
                    },
                    { id: c, title: v },
                  )
                else if ('bool' === u.type)
                  S = (0, l.createCheckablePropertyDefinition)(
                    {
                      checked: (0, l.convertToDefinitionProperty)(
                        e,
                        i[u.id],
                        y.format({ inputName: _ }),
                      ),
                    },
                    { id: c, title: v },
                  )
                else if (
                  'integer' === u.type ||
                  'float' === u.type ||
                  'price' === u.type
                ) {
                  const t = {
                    id: c,
                    title: v,
                    type: 'float' === u.type || 'price' === u.type ? 1 : 0,
                    defval: u.defval,
                  }
                  void 0 !== u.min && (t.min = new p.WatchedValue(u.min)),
                    void 0 !== u.max && (t.max = new p.WatchedValue(u.max)),
                    void 0 !== u.step &&
                      isFinite(u.step) &&
                      u.step > 0 &&
                      (t.step = new p.WatchedValue(u.step)),
                    (S = (0, l.createNumberPropertyDefinition)(
                      {
                        value: (0, l.convertToDefinitionProperty)(
                          e,
                          i[u.id],
                          y.format({ inputName: _ }),
                        ),
                      },
                      t,
                    ))
                } else
                  S = (0, l.createTextPropertyDefinition)(
                    {
                      text: (0, l.convertToDefinitionProperty)(
                        e,
                        i[u.id],
                        y.format({ inputName: _ }),
                      ),
                    },
                    { id: c, title: v, isEditable: !0, isMultiLine: !1 },
                  )
                a.push(S)
              }
              return 0 === a.length ? null : { definitions: a }
            })(this._undoModel, e, t, !1, {
              resolutionItems: I,
              customSymbolInputSetter: this._customSymbolInputSetter(),
              getSymbolInfoBySymbol: this._getSymbolInfoBySymbol.bind(this),
              onSymbolsInfosChanged: this._source.symbolsResolved(),
              sourcesItems: this._inputSourceItems,
            })
          )
        }
        _sortInputs(e) {
          return e
        }
        _getInputSourceItems() {
          const e = g.basePriceSources.slice(),
            t = (0, s.ensureNotNull)(this._sourceInput)
          if (this._source && this._source.isChildStudy()) {
            const i = this._source.inputs()[t.id],
              n = (0, s.ensureNotNull)(this._source.parentSourceForInput(i.v)),
              o = n.title(P.TitleDisplayTarget.StatusLine),
              r = _.StudyMetaInfo.getChildSourceInputTitles(t, n.metaInfo(), o)
            for (const t of Object.keys(r))
              e.push({ id: t, value: t, title: r[t] })
          }
          if (
            r.enabled('study_on_study') &&
            this._source &&
            (this._source.isChildStudy() ||
              _.StudyMetaInfo.canBeChild(this._source.metaInfo()))
          ) {
            const t = new Set([this._source, ...this._source.getAllChildren()])
            this._undoModel
              .model()
              .allStudies()
              .filter((e) => e.canHaveChildren() && !t.has(e))
              .forEach((t) => {
                const i = t.title(
                    P.TitleDisplayTarget.StatusLine,
                    !0,
                    void 0,
                    !0,
                  ),
                  n = t.sourceId() || '#' + t.id(),
                  o = t.metaInfo(),
                  r = o.styles,
                  l = o.plots || []
                if (1 === l.length) e.push({ id: n, value: n, title: i })
                else if (l.length > 1) {
                  const t = l.reduce((e, t, o) => {
                    if (!_.StudyMetaInfo.canPlotBeSourceOfChildStudy(t.type))
                      return e
                    let l
                    try {
                      l = (0, s.ensureDefined)(
                        (0, s.ensureDefined)(r)[t.id],
                      ).title
                    } catch (e) {
                      l = t.id
                    }
                    return { ...e, [`${n}$${o}`]: `${i}: ${l}` }
                  }, {})
                  for (const i of Object.keys(t))
                    e.push({ id: i, value: i, title: t[i] })
                }
              })
          }
          return e
        }
        _customSymbolInputSetter() {}
        _getSymbolInfoBySymbol(e) {
          return this._source.resolvedSymbolInfoBySymbol(e.value())
        }
      }
      var C = i(18653),
        V = i(64482),
        x = i(68805)
      const M = new o.TranslatedString(
          'change study overlay style',
          n.t(null, void 0, i(82924)),
        ),
        k = new o.TranslatedString(
          'change price line visibility',
          n.t(null, void 0, i(8662)),
        ),
        L = new o.TranslatedString(
          'change study overlay min tick',
          n.t(null, void 0, i(91109)),
        ),
        A = n.t(null, void 0, i(27377)),
        N = n.t(null, void 0, i(45054)),
        W = n.t(null, void 0, i(13459)),
        $ = n.t(null, void 0, i(55761)),
        B = n.t(null, void 0, i(3554)),
        O = n.t(null, void 0, i(34456)),
        R = n.t(null, void 0, i(99906)),
        E = n.t(null, void 0, i(59213)),
        X = n.t(null, void 0, i(98236)),
        F = n.t(null, void 0, i(9394)),
        Y = n.t(null, void 0, i(69217)),
        H = n.t(null, void 0, i(886)),
        U = n.t(null, void 0, i(92516)),
        G = n.t(null, void 0, i(72926)),
        j = n.t(null, void 0, i(64075)),
        z = [
          { title: A, value: 0 },
          { title: N, value: 1 },
          { title: W, value: 9 },
          { title: $, value: 13 },
          { title: B, value: 2 },
          { title: F, value: 14 },
          { title: Y, value: 15 },
          { title: O, value: 3 },
          { title: R, value: 16 },
          { title: E, value: 10 },
          { title: H, value: 21 },
        ]
      r.enabled('chart_style_hilo') && z.push({ title: X, value: 12 })
      class J extends T {
        constructor(e, t) {
          super(e, t),
            (this._stylesPropertyPage = null),
            this.propertyPages().then((e) => {
              this._stylesPropertyPage = e.filter((e) => 'style' === e.id)[0]
            }),
            this._source
              .properties()
              .childs()
              .style.subscribe(this, (e) => {
                null !== this._stylesPropertyPage &&
                  ((0, l.destroyDefinitions)(
                    this._stylesPropertyPage.definitions.value(),
                  ),
                  this._stylesPropertyPage.definitions.setValue(
                    this._stylePropertyDefinitions().definitions,
                  )),
                  this._availableStylesWV?.setValue(this._availableStyles())
              })
        }
        destroy() {
          this._source.properties().childs().style.unsubscribeAll(this),
            this._source.symbolResolved().unsubscribeAll(this),
            super.destroy()
        }
        _customSymbolInputSetter() {
          return (e) => {
            this._undoModel.setSymbol(this._source, e)
          }
        }
        _stylePropertyDefinitions() {
          void 0 === this._availableStylesWV &&
            ((this._availableStylesWV = new p.WatchedValue(
              this._availableStyles(),
            )),
            this._source.symbolResolved().subscribe(this, () => {
              this._availableStylesWV?.setValue(this._availableStyles())
            }))
          const e = this._source.properties().childs(),
            t = (0, l.createOptionsPropertyDefinition)(
              {
                option: (0, l.convertToDefinitionProperty)(
                  this._undoModel,
                  e.style,
                  M,
                ),
              },
              {
                id: 'StudyOverlayStyle',
                title: U,
                options: this._availableStylesWV,
              },
            ),
            i = (0, l.createCheckablePropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._undoModel,
                  e.showPriceLine,
                  k,
                ),
              },
              { id: 'StudyOverlayPriceLine', title: G },
            ),
            n = (0, l.createOptionsPropertyDefinition)(
              {
                option: (0, l.convertToDefinitionProperty)(
                  this._undoModel,
                  e.minTick,
                  L,
                ),
              },
              {
                id: 'StudyOverlayMinTick',
                title: j,
                options: new p.WatchedValue((0, V.seriesPrecisionValues)()),
              },
            ),
            o = (0, c.removeSpaces)(
              this._source.title(P.TitleDisplayTarget.StatusLine),
            )
          return {
            definitions: [
              (0, l.createPropertyDefinitionsGeneralGroup)(
                [t, ...this._getSeriesStylesDefinitions()],
                `SeriesStyleGroup${o}`,
              ),
              i,
              n,
            ],
          }
        }
        _getSeriesStylesDefinitions() {
          const e = this._source.properties().childs(),
            t = e.style.value()
          return (0, C.getSeriesStylePropertiesDefinitions)(
            this._undoModel,
            e,
            t,
            {
              seriesPriceSources: g.basePriceSources,
              isJapaneseChartsAvailable: !1,
            },
            'mainSeries',
          )
        }
        _availableStyles() {
          const e = this._source.symbolInfo()
          return z.map((t) =>
            t.readonly
              ? t
              : {
                  readonly: !1,
                  value: t.value,
                  title: t.title,
                  disabled:
                    (0, x.isCloseBasedSymbol)(e) &&
                    !(0, x.isSingleValueBasedStyle)(t.value),
                },
          )
        }
      }
    },
    1183: (e, t, i) => {
      i.d(t, { StudyPlotVisibleProperty: () => r })
      var n = i(34776),
        o = i(23073)
      class r extends o.PropertyBase {
        constructor(e) {
          super(),
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
            this._listeners.destroy()
        }
        value() {
          return 0 !== this._displayProperty.value()
        }
        setValue(e, t) {
          this._displayProperty.setValue(e ? 15 : 0)
        }
        setValueSilently(e) {
          this._displayProperty.setValueSilently(e ? 15 : 0)
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
          this.fireChanged()
        }
      }
    },
  },
])
