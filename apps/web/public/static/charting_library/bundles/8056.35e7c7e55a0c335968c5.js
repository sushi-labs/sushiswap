;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [8056],
  {
    73174: (e, t, i) => {
      i.r(t),
        i.d(t, {
          getCoordinateXMetaInfo: () => _,
          getCoordinateYMetaInfo: () => m,
          getCoordinatesPropertiesDefinitions: () => x,
          getSelectionCoordinatesPropertyDefinition: () => w,
        })
      var n = i(50151),
        r = i(11542),
        o = i(45126),
        l = i(44672),
        s = i(60265)
      class a extends s.UndoCommand {
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
            e.updateAllViews((0, l.sourceChangeEvent)(e.id())),
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
              e.updateAllViews((0, l.sourceChangeEvent)(e.id())),
              e.syncMultichartState(e.endChanging(!0, !1))
          }
        }
      }
      var c = i(32097),
        d = i(64147),
        p = i(12988),
        h = i(91682)
      const u = -5e4,
        f = 15e3,
        y = new o.TranslatedString(
          'change price Y coordinate',
          r.t(null, void 0, i(11737)),
        ),
        v = new o.TranslatedString(
          'change bar X coordinate',
          r.t(null, void 0, i(2066)),
        ),
        g = new o.TranslatedString('move drawings', r.t(null, void 0, i(76261)))
      function m(e, t, i) {
        return {
          property: (0, c.convertToDefinitionProperty)(e, t.price, y),
          info: { typeY: 1, stepY: i },
        }
      }
      function _(e, t) {
        return {
          property: (0, c.convertToDefinitionProperty)(e, t.bar, v),
          info: {
            typeX: 0,
            minX: new d.WatchedValue(u),
            maxX: new d.WatchedValue(f),
            stepX: new d.WatchedValue(1),
          },
        }
      }
      function x(e, t, i, n, r, o) {
        const l = _(e, t),
          s = m(e, t, n)
        return (0, c.createCoordinatesPropertyDefinition)(
          { x: l.property, y: s.property },
          {
            id: (0, h.removeSpaces)(`${o}Coordinates${r}`),
            title: r,
            ...l.info,
            ...s.info,
          },
        )
      }
      const P = /^([+*\-\/]?)((?:\d*)|(?:\d+\.\d*))$/
      function T(e, t, i) {
        const r = new p.Property(''),
          o = (0, c.makeProxyDefinitionProperty)(r.weakReference())
        return (
          (o.setValue = (o) => {
            try {
              const r = o.match(P)
              if (!r) return
              const [, l, s] = r
              if (!s.length) return
              const c = i(Number.parseFloat(s))
              if ('/' === l && (0 === c.price || 0 === c.index)) return
              t.withMacro(g, () => {
                e.filter((e) => !e.isSourceHidden()).forEach((e) => {
                  const i = e.points()
                  let r
                  switch (l) {
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
                      '-' === l && ((e *= -1), (t *= -1)),
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
                    new a({
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
      function w(e, t) {
        const n = T(e, t, (e) => ({ index: e })),
          o = T(e, t, (e) => ({ price: e }))
        return (0, c.createSelectionCoordinatesPropertyDefinition)(
          { x: n, y: o },
          {
            id: 'SourcesCoordinates',
            title: r.t(null, void 0, i(44272)),
            mathOperationsX: '+',
            mathOperationsY: '+/*',
            modeX: 'integer',
            modeY: 'float',
          },
        )
      }
    },
    53749: (e, t, i) => {
      i.d(t, { createLineStyleDefinition: () => m })
      var n = i(11542),
        r = i(45126),
        o = i(32097),
        l = i(91682)
      const s = new r.TranslatedString(
          'change {toolName} line visibility',
          n.t(null, void 0, i(24550)),
        ),
        a = new r.TranslatedString(
          'change {toolName} line width',
          n.t(null, void 0, i(19541)),
        ),
        c = new r.TranslatedString(
          'change {toolName} line style',
          n.t(null, void 0, i(66429)),
        ),
        d = new r.TranslatedString(
          'change {toolName} line color',
          n.t(null, void 0, i(24059)),
        ),
        p = new r.TranslatedString(
          'change {toolName} line extending left',
          n.t(null, void 0, i(18773)),
        ),
        h = new r.TranslatedString(
          'change {toolName} line left end',
          n.t(null, void 0, i(21474)),
        ),
        u = new r.TranslatedString(
          'change {toolName} line extending right',
          n.t(null, void 0, i(43823)),
        ),
        f = new r.TranslatedString(
          'change {toolName} line right end',
          n.t(null, void 0, i(54827)),
        ),
        y = n.t(null, void 0, i(3554)),
        v = n.t(null, void 0, i(61856)),
        g = n.t(null, void 0, i(87430))
      function m(e, t, i, n, r) {
        const m = {},
          _ = {
            id: `${(0, l.removeSpaces)(i.originalText())}${n}`,
            title: (r && r.line) || y,
          }
        return (
          void 0 !== t.showLine &&
            (m.checked = (0, o.convertToDefinitionProperty)(
              e,
              t.showLine,
              s.format({ toolName: i }),
            )),
          void 0 !== t.lineWidth &&
            (m.width = (0, o.convertToDefinitionProperty)(
              e,
              t.lineWidth,
              a.format({ toolName: i }),
            )),
          void 0 !== t.lineStyle &&
            (m.style = (0, o.convertToDefinitionProperty)(
              e,
              t.lineStyle,
              c.format({ toolName: i }),
            )),
          void 0 !== t.lineColor &&
            (m.color = (0, o.getColorDefinitionProperty)(
              e,
              t.lineColor,
              null,
              d.format({ toolName: i }),
            )),
          void 0 !== t.extendLeft &&
            ((m.extendLeft = (0, o.convertToDefinitionProperty)(
              e,
              t.extendLeft,
              p.format({ toolName: i }),
            )),
            (_.extendLeftTitle = (r && r.extendLeftTitle) || v)),
          void 0 !== t.leftEnd &&
            (m.leftEnd = (0, o.convertToDefinitionProperty)(
              e,
              t.leftEnd,
              h.format({ toolName: i }),
            )),
          void 0 !== t.extendRight &&
            ((m.extendRight = (0, o.convertToDefinitionProperty)(
              e,
              t.extendRight,
              u.format({ toolName: i }),
            )),
            (_.extendRightTitle = (r && r.extendRightTitle) || g)),
          void 0 !== t.rightEnd &&
            (m.rightEnd = (0, o.convertToDefinitionProperty)(
              e,
              t.rightEnd,
              f.format({ toolName: i }),
            )),
          (0, o.createLinePropertyDefinition)(m, _)
        )
      }
    },
    56641: (e, t, i) => {
      i.d(t, { PitchBaseDefinitionsViewModel: () => b })
      var n = i(50151),
        r = i(11542),
        o = i(45126),
        l = i(53749),
        s = i(18009),
        a = i(32097),
        c = i(91682),
        d = i(95166)
      const p = new o.TranslatedString(
          'change {title} extend lines',
          r.t(null, void 0, i(76295)),
        ),
        h = new o.TranslatedString(
          'change {title} level {index} line visibility',
          r.t(null, void 0, i(51403)),
        ),
        u = new o.TranslatedString(
          'change {title} level {index} line color',
          r.t(null, void 0, i(664)),
        ),
        f = new o.TranslatedString(
          'change {title} level {index} line width',
          r.t(null, void 0, i(97870)),
        ),
        y = new o.TranslatedString(
          'change {title} level {index} line style',
          r.t(null, void 0, i(64707)),
        ),
        v = new o.TranslatedString(
          'change {title} level {index} line coeff',
          r.t(null, void 0, i(27154)),
        ),
        g = new o.TranslatedString(
          'change {title} all lines color',
          r.t(null, void 0, i(59577)),
        ),
        m = new o.TranslatedString(
          'change {title} background visibility',
          r.t(null, void 0, i(30839)),
        ),
        _ = new o.TranslatedString(
          'change {title} background transparency',
          r.t(null, void 0, i(13783)),
        ),
        x = r.t(null, { context: 'study' }, i(29291)),
        P = r.t(null, void 0, i(28683)),
        T = r.t(null, void 0, i(79468)),
        w = r.t(null, void 0, i(819))
      class b extends s.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties(),
            i = t.childs(),
            r = this._source.name(),
            s = (0, c.removeSpaces)(r),
            b = new o.TranslatedString(r, this._source.translatedType())
          t.hasChild('extendLines') &&
            e.push(
              (0, a.createCheckablePropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.extendLines,
                    p.format({ title: b }),
                  ),
                },
                { id: `${s}ExtendLines`, title: w },
              ),
            )
          const S = i.median.childs(),
            D = (0, l.createLineStyleDefinition)(
              this._propertyApplier,
              {
                lineColor: S.color,
                lineStyle: S.linestyle,
                lineWidth: S.linewidth,
              },
              b,
              'Median',
              { line: x },
            )
          e.push(D)
          const C = this._source.levelsCount()
          for (let t = 0; t <= C; t++) {
            const n = i[`level${t}`].childs(),
              r = (0, a.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.visible,
                    h.format({ title: b, index: t + 1 }),
                  ),
                  color: (0, a.getColorDefinitionProperty)(
                    this._propertyApplier,
                    n.color,
                    null,
                    u.format({ title: b, index: t + 1 }),
                  ),
                  width: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.linewidth,
                    f.format({ title: b, index: t + 1 }),
                  ),
                  style: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.linestyle,
                    y.format({ title: b, index: t + 1 }),
                  ),
                  level: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.coeff,
                    v.format({ title: b, index: t + 1 }),
                  ),
                },
                { id: `${s}LineLevel${t + 1}` },
              )
            e.push(r)
          }
          const k = (0, a.createColorPropertyDefinition)(
            {
              color: (0, a.getColorDefinitionProperty)(
                this._propertyApplier,
                new d.CollectibleColorPropertyUndoWrapper(
                  (0, n.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null,
                ),
                null,
                g.format({ title: b }),
                !0,
              ),
            },
            { id: `${s}AllLineColor`, title: P },
          )
          e.push(k)
          const N = (0, a.createTransparencyPropertyDefinition)(
            {
              checked: (0, a.convertToDefinitionProperty)(
                this._propertyApplier,
                i.fillBackground,
                m.format({ title: b }),
              ),
              transparency: (0, a.convertToDefinitionProperty)(
                this._propertyApplier,
                i.transparency,
                _.format({ title: b }),
              ),
            },
            { id: `${s}Background`, title: T },
          )
          return e.push(N), { definitions: e }
        }
      }
    },
    15399: (e, t, i) => {
      i.d(t, { LevelsProperty: () => y })
      var n = i(90054),
        r = i(16738),
        o = i(37265),
        l = i(32679),
        s = i(35039)
      const a = {
        prefixes: [''],
        range: [0, 0],
        names: ['coeff', 'color', 'visible', 'linestyle', 'linewidth'],
        typecheck: { pack: () => Object(), unpack: () => [] },
      }
      function c(e, t, i, n) {
        return n.push(i[t]), n
      }
      function d(e, t, i, n) {
        return (n[t] = i[e]), n
      }
      function p() {
        return []
      }
      function h() {
        return {}
      }
      function u(e, t, i) {
        return (
          i.prefixes.forEach((n) => {
            const r = n + 'level'
            for (let n = i.range[0]; n <= i.range[1]; n++)
              if (e[r + n] && (0, o.isSameType)(e[r + n], t.typecheck())) {
                let o = t.tpl()
                i.names.forEach((i, l) => {
                  o = t.fill('' + l, i, e[r + n], o)
                }),
                  (e[r + n] = o)
              }
          }),
          e
        )
      }
      function f(e, t, i) {
        return i(e, { tpl: h, fill: d, typecheck: t.typecheck.unpack }, t)
      }
      class y extends l.DefaultProperty {
        constructor(e) {
          const { levelsIterator: t = u, map: i = {}, ...n } = e,
            r = { ...a, ...i }
          n.state && (n.state = f(n.state, r, t)),
            super(n),
            (this._map = r),
            (this._levelsIterator = t)
        }
        state(e, t, i) {
          const n = super.state(e, t)
          return i
            ? n
            : ((r = n),
              (o = this._map),
              (0, this._levelsIterator)(
                r,
                { tpl: p, fill: c, typecheck: o.typecheck.pack },
                o,
              ))
          var r, o
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
                (0, n.default)(t),
                f(e, this._map, this._levelsIterator),
              ),
              this._allStateKeys,
              this._excludedTemplateKeys,
            ),
          )
        }
        saveDefaults() {
          this._useUserPreferences &&
            (0, s.saveDefaults)(this._defaultName, this.preferences())
        }
        clone() {
          return new y(this._options())
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
    95166: (e, t, i) => {
      i.d(t, {
        CollectibleColorPropertyDirectWrapper: () => s,
        CollectibleColorPropertyUndoWrapper: () => l,
      })
      var n = i(50151),
        r = i(12988)
      class o extends r.Property {
        constructor(e) {
          super(),
            (this._listenersMappers = []),
            (this._isProcess = !1),
            (this._baseProperty = e)
        }
        destroy() {
          this._baseProperty.destroy(), super.destroy()
        }
        value() {
          const e = this._baseProperty.value()
          return 'mixed' === e ? '' : e
        }
        visible() {
          return this._baseProperty.visible()
        }
        setValue(e) {
          ;(this._isProcess = !0),
            this._baseProperty.setValue('' === e ? 'mixed' : e, void 0, {
              applyValue: this._applyValue.bind(this),
            }),
            (this._isProcess = !1),
            this._listenersMappers.forEach((e) => {
              e.method.call(e.obj, this, '')
            })
        }
        subscribe(e, t) {
          const i = (i) => {
              this._isProcess || t.call(e, this, '')
            },
            n = { obj: e, method: t, callback: i }
          this._listenersMappers.push(n), this._baseProperty.subscribe(e, i)
        }
        unsubscribe(e, t) {
          const i = (0, n.ensureDefined)(
            this._listenersMappers.find((i) => i.obj === e && i.method === t)
              ?.callback,
          )
          this._baseProperty.unsubscribe(e, i)
        }
        unsubscribeAll(e) {
          this._baseProperty.unsubscribeAll(e)
        }
      }
      class l extends o {
        constructor(e, t, i) {
          super(e), (this._propertyApplier = t), (this._undoText = i)
        }
        _applyValue(e, t) {
          this._propertyApplier.setProperty(e, t, this._undoText)
        }
      }
      class s extends o {
        _applyValue(e, t) {
          e.setValue(t)
        }
      }
    },
  },
])
