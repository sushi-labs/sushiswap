;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [906],
  {
    73174: (e, t, i) => {
      i.r(t),
        i.d(t, {
          getCoordinateXMetaInfo: () => P,
          getCoordinateYMetaInfo: () => y,
          getCoordinatesPropertiesDefinitions: () => x,
          getSelectionCoordinatesPropertyDefinition: () => b,
        })
      var n = i(50151),
        r = i(11542),
        o = i(45126),
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
      var c = i(32097),
        d = i(64147),
        h = i(12988),
        p = i(91682)
      const u = -5e4,
        f = 15e3,
        _ = new o.TranslatedString(
          'change price Y coordinate',
          r.t(null, void 0, i(11737)),
        ),
        g = new o.TranslatedString(
          'change bar X coordinate',
          r.t(null, void 0, i(2066)),
        ),
        v = new o.TranslatedString('move drawings', r.t(null, void 0, i(76261)))
      function y(e, t, i) {
        return {
          property: (0, c.convertToDefinitionProperty)(e, t.price, _),
          info: { typeY: 1, stepY: i },
        }
      }
      function P(e, t) {
        return {
          property: (0, c.convertToDefinitionProperty)(e, t.bar, g),
          info: {
            typeX: 0,
            minX: new d.WatchedValue(u),
            maxX: new d.WatchedValue(f),
            stepX: new d.WatchedValue(1),
          },
        }
      }
      function x(e, t, i, n, r, o) {
        const s = P(e, t),
          l = y(e, t, n)
        return (0, c.createCoordinatesPropertyDefinition)(
          { x: s.property, y: l.property },
          {
            id: (0, p.removeSpaces)(`${o}Coordinates${r}`),
            title: r,
            ...s.info,
            ...l.info,
          },
        )
      }
      const m = /^([+*\-\/]?)((?:\d*)|(?:\d+\.\d*))$/
      function T(e, t, i) {
        const r = new h.Property(''),
          o = (0, c.makeProxyDefinitionProperty)(r.weakReference())
        return (
          (o.setValue = (o) => {
            try {
              const r = o.match(m)
              if (!r) return
              const [, s, l] = r
              if (!l.length) return
              const c = i(Number.parseFloat(l))
              if ('/' === s && (0 === c.price || 0 === c.index)) return
              t.withMacro(v, () => {
                e.filter((e) => !e.isSourceHidden()).forEach((e) => {
                  const i = e.points()
                  let r
                  switch (s) {
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
                      '-' === s && ((e *= -1), (t *= -1)),
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
      function b(e, t) {
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
    15399: (e, t, i) => {
      i.d(t, { LevelsProperty: () => _ })
      var n = i(90054),
        r = i(16738),
        o = i(37265),
        s = i(32679),
        l = i(35039)
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
      function h() {
        return []
      }
      function p() {
        return {}
      }
      function u(e, t, i) {
        return (
          i.prefixes.forEach((n) => {
            const r = n + 'level'
            for (let n = i.range[0]; n <= i.range[1]; n++)
              if (e[r + n] && (0, o.isSameType)(e[r + n], t.typecheck())) {
                let o = t.tpl()
                i.names.forEach((i, s) => {
                  o = t.fill('' + s, i, e[r + n], o)
                }),
                  (e[r + n] = o)
              }
          }),
          e
        )
      }
      function f(e, t, i) {
        return i(e, { tpl: p, fill: d, typecheck: t.typecheck.unpack }, t)
      }
      class _ extends s.DefaultProperty {
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
                { tpl: h, fill: c, typecheck: o.typecheck.pack },
                o,
              ))
          var r, o
        }
        preferences() {
          return (0, s.extractState)(
            this.state(this._excludedDefaultsKeys, void 0, !0),
            this._allDefaultsKeys,
          )
        }
        applyTemplate(e, t) {
          this.mergeAndFire(
            (0, s.extractState)(
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
            (0, l.saveDefaults)(this._defaultName, this.preferences())
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
    95166: (e, t, i) => {
      i.d(t, {
        CollectibleColorPropertyDirectWrapper: () => l,
        CollectibleColorPropertyUndoWrapper: () => s,
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
      class s extends o {
        constructor(e, t, i) {
          super(e), (this._propertyApplier = t), (this._undoText = i)
        }
        _applyValue(e, t) {
          this._propertyApplier.setProperty(e, t, this._undoText)
        }
      }
      class l extends o {
        _applyValue(e, t) {
          e.setValue(t)
        }
      }
    },
    2662: (e, t, i) => {
      i.r(t), i.d(t, { LineToolFibSpeedResistanceFan: () => ee })
      var n = i(50151),
        r = i(11542),
        o = i(45126),
        s = i(29875),
        l = i(15399),
        a = i(73305),
        c = i(85719),
        d = i(32097),
        h = i(18009),
        p = i(91682),
        u = i(95166)
      const f = new o.TranslatedString(
          'change {title} level {index} line visibility',
          r.t(null, void 0, i(51403)),
        ),
        _ = new o.TranslatedString(
          'change {title} level {index} line color',
          r.t(null, void 0, i(664)),
        ),
        g = new o.TranslatedString(
          'change {title} level {index} line coeff',
          r.t(null, void 0, i(27154)),
        ),
        v = new o.TranslatedString(
          'change {title} all lines color',
          r.t(null, void 0, i(59577)),
        ),
        y = new o.TranslatedString(
          'change {title} background visibility',
          r.t(null, void 0, i(30839)),
        ),
        P = new o.TranslatedString(
          'change {title} background transparency',
          r.t(null, void 0, i(13783)),
        ),
        x = new o.TranslatedString(
          'change {title} left labels visibility',
          r.t(null, void 0, i(63021)),
        ),
        m = new o.TranslatedString(
          'change {title} right labels visibility',
          r.t(null, void 0, i(8390)),
        ),
        T = new o.TranslatedString(
          'change {title} top labels visibility',
          r.t(null, void 0, i(81301)),
        ),
        b = new o.TranslatedString(
          'change {title} bottom labels visibility',
          r.t(null, void 0, i(62130)),
        ),
        w = new o.TranslatedString(
          'change {title} reverse',
          r.t(null, void 0, i(50762)),
        ),
        S = new o.TranslatedString(
          'change {title} grid visibility',
          r.t(null, void 0, i(20664)),
        ),
        L = new o.TranslatedString(
          'change {title} grid line color',
          r.t(null, void 0, i(36467)),
        ),
        A = new o.TranslatedString(
          'change {title} grid line width',
          r.t(null, void 0, i(30127)),
        ),
        R = new o.TranslatedString(
          'change {title} grid line style',
          r.t(null, void 0, i(54244)),
        ),
        C = r.t(null, void 0, i(28683)),
        D = r.t(null, void 0, i(79468)),
        k = r.t(null, void 0, i(58557)),
        I = r.t(null, void 0, i(58476)),
        M = r.t(null, void 0, i(65e3)),
        V = r.t(null, void 0, i(28971)),
        H = r.t(null, void 0, i(74939)),
        E = r.t(null, void 0, i(17129)),
        N = r.t(null, void 0, i(81356)),
        W = r.t(null, void 0, i(64489))
      class B extends h.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            r = (0, p.removeSpaces)(i),
            s = new o.TranslatedString(i, this._source.translatedType()),
            l = [],
            a = this._source.hLevelsCount()
          for (let e = 1; e <= a; e++) {
            const i = t[`hlevel${e}`].childs(),
              n = (0, d.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, d.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.visible,
                    f.format({ title: s, index: e }),
                  ),
                  color: (0, d.getColorDefinitionProperty)(
                    this._propertyApplier,
                    i.color,
                    null,
                    _.format({ title: s, index: e }),
                  ),
                  level: (0, d.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.coeff,
                    g.format({ title: s, index: e }),
                  ),
                },
                { id: `${r}HLineLevel${e}` },
              )
            l.push(n)
          }
          const c = (0, d.createPropertyDefinitionsLeveledLinesGroup)(
              l,
              `${r}HLeveledLinesGroup`,
            ),
            h = (0, d.createCheckablePropertyDefinition)(
              {
                checked: (0, d.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.showLeftLabels,
                  x.format({ title: s }),
                ),
              },
              { id: `${r}LeftLabels`, title: M },
            ),
            B = (0, d.createCheckablePropertyDefinition)(
              {
                checked: (0, d.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.showRightLabels,
                  m.format({ title: s }),
                ),
              },
              { id: `${r}RightLabels`, title: V },
            ),
            $ = (0, d.createPropertyDefinitionsGeneralGroup)(
              [c, h, B],
              `${r}HLevelGroup`,
              k,
            )
          e.push($)
          const z = [],
            F = this._source.vLevelsCount()
          for (let e = 1; e <= F; e++) {
            const i = t[`vlevel${e}`].childs(),
              n = (0, d.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, d.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.visible,
                    f.format({ title: s, index: e }),
                  ),
                  color: (0, d.getColorDefinitionProperty)(
                    this._propertyApplier,
                    i.color,
                    null,
                    _.format({ title: s, index: e }),
                  ),
                  level: (0, d.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.coeff,
                    g.format({ title: s, index: e }),
                  ),
                },
                { id: `${r}VLineLevel${e}` },
              )
            z.push(n)
          }
          const Y = (0, d.createPropertyDefinitionsLeveledLinesGroup)(
              z,
              `${r}VLeveledLinesGroup`,
            ),
            O = (0, d.createCheckablePropertyDefinition)(
              {
                checked: (0, d.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.showTopLabels,
                  T.format({ title: s }),
                ),
              },
              { id: `${r}TopLabels`, title: H },
            ),
            X = (0, d.createCheckablePropertyDefinition)(
              {
                checked: (0, d.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.showBottomLabels,
                  b.format({ title: s }),
                ),
              },
              { id: `${r}BottomLabels`, title: E },
            ),
            G = (0, d.createPropertyDefinitionsGeneralGroup)(
              [Y, O, X],
              `${r}VLevelGroup`,
              I,
            )
          e.push(G)
          const q = (0, d.createColorPropertyDefinition)(
            {
              color: (0, d.getColorDefinitionProperty)(
                this._propertyApplier,
                new u.CollectibleColorPropertyUndoWrapper(
                  (0, n.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null,
                ),
                null,
                v.format({ title: s }),
                !0,
              ),
            },
            { id: `${r}AllLineColor`, title: C },
          )
          e.push(q)
          const K = (0, d.createTransparencyPropertyDefinition)(
            {
              checked: (0, d.convertToDefinitionProperty)(
                this._propertyApplier,
                t.fillBackground,
                y.format({ title: s }),
              ),
              transparency: (0, d.convertToDefinitionProperty)(
                this._propertyApplier,
                t.transparency,
                P.format({ title: s }),
              ),
            },
            { id: `${r}Background`, title: D },
          )
          e.push(K)
          const U = t.grid.childs(),
            j = (0, d.createLinePropertyDefinition)(
              {
                checked: (0, d.convertToDefinitionProperty)(
                  this._propertyApplier,
                  U.visible,
                  S.format({ title: s }),
                ),
                color: (0, d.getColorDefinitionProperty)(
                  this._propertyApplier,
                  U.color,
                  null,
                  L.format({ title: s }),
                ),
                width: (0, d.convertToDefinitionProperty)(
                  this._propertyApplier,
                  U.linewidth,
                  A.format({ title: s }),
                ),
                style: (0, d.convertToDefinitionProperty)(
                  this._propertyApplier,
                  U.linestyle,
                  R.format({ title: s }),
                ),
              },
              { id: `${r}GridLine`, title: N },
            )
          e.push(j)
          const J = (0, d.createCheckablePropertyDefinition)(
            {
              checked: (0, d.convertToDefinitionProperty)(
                this._propertyApplier,
                t.reverse,
                w.format({ title: s }),
              ),
            },
            { id: `${r}Reverse`, title: W },
          )
          return e.push(J), { definitions: e }
        }
      }
      var $ = i(86441),
        z = i(30699),
        F = i(15938),
        Y = i(74079),
        O = i(56468),
        X = i(65395),
        G = i(95201),
        q = i(49857),
        K = i(17330),
        U = i(91046),
        j = i(27916)
      class J extends j.LineSourcePaneView {
        constructor(e, t) {
          super(e, t),
            (this._leftTextRenderers = []),
            (this._rightTextRenderers = []),
            (this._topTextRenderers = []),
            (this._bottomTextRenderers = []),
            (this._renderer = null)
          for (let e = 0; e < this._source.hLevelsCount(); e++)
            this._leftTextRenderers.push(new K.TextRenderer()),
              this._rightTextRenderers.push(new K.TextRenderer())
          for (let e = 0; e < this._source.vLevelsCount(); e++)
            this._topTextRenderers.push(new K.TextRenderer()),
              this._bottomTextRenderers.push(new K.TextRenderer())
        }
        renderer(e) {
          return this._invalidated && this._updateImpl(e), this._renderer
        }
        _updateImpl(e) {
          if (
            (super._updateImpl(e),
            (this._renderer = null),
            this._source.points().length < 2)
          )
            return
          const t = this._source.priceScale(),
            i = (0, n.ensureNotNull)(this._source.ownerSource()).firstValue()
          if (
            null === i ||
            !t ||
            t.isEmpty() ||
            this._model.timeScale().isEmpty()
          )
            return
          if (this._points.length < 2) return
          const r = this._source.points()[0],
            o = this._source.points()[1],
            s = this._source.properties().childs(),
            l = s.reverse.value(),
            a = [],
            c = l ? o.price - r.price : r.price - o.price,
            d = l ? r.price : o.price
          for (let e = 1; e <= this._source.hLevelsCount(); e++) {
            const r = 'hlevel' + e,
              o = (0, n.ensureDefined)(
                this._source.properties().child(r),
              ).childs()
            if (!o.visible.value()) continue
            const s = o.coeff.value(),
              l = o.color.value(),
              h = d + s * c,
              p = t.priceToCoordinate(h, i)
            a.push({ coeff: s, color: l, y: p, index: e })
          }
          const h = [],
            p = l ? o.index - r.index : r.index - o.index,
            u = l ? r.index : o.index
          for (let e = 1; e <= this._source.vLevelsCount(); e++) {
            const t = 'vlevel' + e,
              i = (0, n.ensureDefined)(
                this._source.properties().child(t),
              ).childs()
            if (!i.visible.value()) continue
            const r = i.coeff.value(),
              o = i.color.value(),
              s = Math.round(u + r * p),
              l = this._model.timeScale().indexToCoordinate(s)
            h.push({ coeff: r, color: o, x: l, index: e })
          }
          const f = new G.CompositeRenderer(),
            _ = this._points[0],
            g = this._points[1],
            v = Math.min(_.x, g.x),
            y = Math.min(_.y, g.y),
            P = Math.max(_.x, g.x),
            x = Math.max(_.y, g.y),
            m = s.grid.childs().color.value(),
            T = s.grid.childs().linewidth.value(),
            b = s.grid.childs().linestyle.value(),
            w = (0, Y.getNumericFormatter)()
          for (let e = 0; e < a.length; e++) {
            const t = new $.Point(v, a[e].y),
              i = new $.Point(P, a[e].y)
            if (s.grid.childs().visible.value()) {
              const e = {
                  points: [t, i],
                  color: m,
                  linewidth: T,
                  linestyle: b,
                  extendleft: !1,
                  extendright: !1,
                  leftend: q.LineEnd.Normal,
                  rightend: q.LineEnd.Normal,
                },
                n = new U.TrendLineRenderer()
              n.setData(e), f.append(n)
            }
            if (s.showLeftLabels.value()) {
              const i = {
                points: [t],
                text: w.format(a[e].coeff),
                color: a[e].color,
                vertAlign: z.VerticalAlign.Middle,
                horzAlign: z.HorizontalAlign.Right,
                font: F.CHART_FONT_FAMILY,
                offsetX: 5,
                offsetY: 0,
                fontsize: 12,
                forceTextAlign: !0,
              }
              this._leftTextRenderers[e].setData(i),
                f.append(this._leftTextRenderers[e])
            }
            if (s.showRightLabels.value()) {
              const t = {
                points: [i],
                text: w.format(a[e].coeff),
                color: a[e].color,
                vertAlign: z.VerticalAlign.Middle,
                horzAlign: z.HorizontalAlign.Left,
                font: F.CHART_FONT_FAMILY,
                offsetX: 5,
                offsetY: 0,
                fontsize: 12,
                forceTextAlign: !0,
              }
              this._rightTextRenderers[e].setData(t),
                f.append(this._rightTextRenderers[e])
            }
          }
          for (let e = 0; e < h.length; e++) {
            const t = new $.Point(h[e].x, y),
              i = new $.Point(h[e].x, x)
            if (s.grid.childs().visible.value()) {
              const e = {
                  points: [t, i],
                  color: m,
                  linewidth: T,
                  linestyle: b,
                  extendleft: !1,
                  extendright: !1,
                  leftend: q.LineEnd.Normal,
                  rightend: q.LineEnd.Normal,
                },
                n = new U.TrendLineRenderer()
              n.setData(e), f.append(n)
            }
            if (s.showTopLabels.value()) {
              const i = {
                points: [t],
                text: w.format(h[e].coeff),
                color: h[e].color,
                vertAlign: z.VerticalAlign.Bottom,
                horzAlign: z.HorizontalAlign.Center,
                font: F.CHART_FONT_FAMILY,
                offsetX: 0,
                offsetY: 5,
                fontsize: 12,
              }
              this._topTextRenderers[e].setData(i),
                f.append(this._topTextRenderers[e])
            }
            if (s.showBottomLabels.value()) {
              const t = {
                points: [i],
                text: w.format(h[e].coeff),
                color: h[e].color,
                vertAlign: z.VerticalAlign.Top,
                horzAlign: z.HorizontalAlign.Center,
                font: F.CHART_FONT_FAMILY,
                offsetX: 0,
                offsetY: 5,
                fontsize: 12,
              }
              this._bottomTextRenderers[e].setData(t),
                f.append(this._bottomTextRenderers[e])
            }
          }
          const S = s.fillBackground.value(),
            L = s.transparency.value()
          for (let e = 0; e < a.length; e++) {
            const t = new $.Point(g.x, a[e].y)
            if (e > 0 && S) {
              const i = {
                  p1: _,
                  p2: t,
                  p3: _,
                  p4: new $.Point(g.x, a[e - 1].y),
                  color: a[e].color,
                  transparency: L,
                  hittestOnBackground: !0,
                  extendLeft: !1,
                },
                n = new X.ChannelRenderer()
              n.setData(i), f.append(n)
            }
            {
              const i = {
                  points: [_, t],
                  color: a[e].color,
                  linewidth: s.linewidth.value(),
                  linestyle: s.linestyle.value(),
                  extendleft: !1,
                  extendright: !0,
                  leftend: q.LineEnd.Normal,
                  rightend: q.LineEnd.Normal,
                },
                n = new U.TrendLineRenderer()
              n.setData(i),
                n.setHitTest(
                  new O.HitTestResult(O.HitTarget.MovePoint, void 0, {
                    type: 'h',
                    index: a[e].index,
                  }),
                ),
                f.append(n)
            }
          }
          for (let e = 0; e < h.length; e++) {
            const t = new $.Point(h[e].x, g.y)
            if (e > 0 && S) {
              const i = {
                  p1: _,
                  p2: t,
                  p3: _,
                  p4: new $.Point(h[e - 1].x, g.y),
                  color: h[e].color,
                  transparency: L,
                  hittestOnBackground: !0,
                  extendLeft: !1,
                },
                n = new X.ChannelRenderer()
              n.setData(i), f.append(n)
            }
            {
              const i = {
                  points: [_, t],
                  color: h[e].color,
                  linewidth: s.linewidth.value(),
                  linestyle: s.linestyle.value(),
                  extendleft: !1,
                  extendright: !0,
                  leftend: q.LineEnd.Normal,
                  rightend: q.LineEnd.Normal,
                },
                n = new U.TrendLineRenderer()
              n.setData(i)
              const r = { type: 'v', index: h[e].index }
              n.setHitTest(
                new O.HitTestResult(O.HitTarget.MovePoint, void 0, r),
              ),
                f.append(n)
            }
          }
          this.addAnchors(f), (this._renderer = f)
        }
      }
      const Q = new o.TranslatedString(
        'erase level line',
        r.t(null, void 0, i(77114)),
      )
      var Z
      !((e) => {
        ;(e[(e.HLevelsCount = 7)] = 'HLevelsCount'),
          (e[(e.VLevelsCount = 7)] = 'VLevelsCount')
      })(Z || (Z = {}))
      class ee extends s.LineDataSource {
        constructor(e, t, i, n) {
          super(
            e,
            t ?? ee.createProperties(e.backgroundTheme().spawnOwnership()),
            i,
            n,
          ),
            this._setPaneViews([new J(this, this._model)])
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
          return 'Fib Speed Resistance Fan'
        }
        processErase(e, t) {
          const i = `${t.type}level${t.index}`,
            r = (0, n.ensureDefined)(this.properties().child(i)).childs()
              .visible
          e.setProperty(r, !1, Q, c.lineToolsDoNotAffectChartInvalidation)
        }
        snapTo45DegreesAvailable() {
          return !0
        }
        static createProperties(e, t) {
          t && void 0 === t.reverse && (t.reverse = !0)
          const i = new l.LevelsProperty({
            defaultName: 'linetoolfibspeedresistancefan',
            state: t,
            map: {
              range: [1, 7],
              prefixes: ['h', 'v'],
              names: ['coeff', 'color', 'visible'],
            },
            theme: e,
          })
          return this._configureProperties(i), i
        }
        async _getPropertyDefinitionsViewModelClass() {
          return B
        }
        static _configureProperties(e) {
          super._configureProperties(e)
          const t = [e.childs().grid.childs().color]
          for (let i = 1; i <= 7; i++)
            t.push((0, n.ensureDefined)(e.child(`hlevel${i}`)?.child('color')))
          for (let i = 1; i <= 7; i++)
            t.push((0, n.ensureDefined)(e.child(`vlevel${i}`)?.child('color')))
          e.addChild('linesColors', new a.LineToolColorsProperty(t)),
            e.addExcludedKey('linesColors', 3)
        }
      }
    },
    27916: (e, t, i) => {
      i.d(t, {
        LineSourcePaneView: () => _,
        createLineSourcePaneViewPoint: () => f,
        thirdPointCursorType: () => u,
      })
      var n = i(19625),
        r = i(50151),
        o = i(69186),
        s = i(56468),
        l = i(11064),
        a = i(36036),
        c = i(72791),
        d = i(17330)
      const h = n.colorsPalette['color-tv-blue-600']
      var p
      function u(e, t) {
        const i = t.x - e.x,
          n = t.y - e.y,
          r = Math.abs(Math.atan2(i, n))
        return r > Math.PI / 4 && r < (3 * Math.PI) / 4
          ? c.PaneCursorType.VerticalResize
          : c.PaneCursorType.HorizontalResize
      }
      function f(e, t) {
        return (e.pointIndex = t), e
      }
      !((e) => {
        ;(e[(e.RegularAnchorRadius = 6)] = 'RegularAnchorRadius'),
          (e[(e.TouchAnchorRadius = 13)] = 'TouchAnchorRadius'),
          (e[(e.RegularStrokeWidth = 1)] = 'RegularStrokeWidth'),
          (e[(e.TouchStrokeWidth = 3)] = 'TouchStrokeWidth'),
          (e[(e.RegularSelectedStrokeWidth = 3)] =
            'RegularSelectedStrokeWidth'),
          (e[(e.TouchSelectedStrokeWidth = 0)] = 'TouchSelectedStrokeWidth')
      })(p || (p = {}))
      class _ {
        constructor(e, t) {
          ;(this._invalidated = !0),
            (this._points = []),
            (this._middlePoint = null),
            (this._selectionRenderers = []),
            (this._lineAnchorRenderers = []),
            (this._source = e),
            (this._model = t)
        }
        priceToCoordinate(e) {
          const t = this._source.priceScale()
          if (null === t) return null
          const i = this._source.ownerSource(),
            n = null !== i ? i.firstValue() : null
          return null === n ? null : t.priceToCoordinate(e, n)
        }
        anchorColor() {
          return h
        }
        isHoveredSource() {
          return this._source === this._model.hoveredSource()
        }
        isSelectedSource() {
          return this._model.selection().isSelected(this._source)
        }
        isBeingEdited() {
          return this._model.lineBeingEdited() === this._source
        }
        isEditMode() {
          return !this._model.isSnapshot()
        }
        areAnchorsVisible() {
          return (
            ((this.isHoveredSource() && !this.isLocked()) ||
              this.isSelectedSource()) &&
            this.isEditMode()
          )
        }
        update() {
          this._invalidated = !0
        }
        isLocked() {
          return Boolean(this._source.isLocked && this._source.isLocked())
        }
        addAnchors(e, t = {}) {
          let i = this._getPoints()
          this._model.lineBeingCreated() === this._source &&
            (i = i.slice(0, -1))
          const n = this._source.points(),
            r = i.map((e, t) => {
              const i = n[t],
                r = (0, a.lineSourcePaneViewPointToLineAnchorPoint)(e)
              return (
                i && ((r.snappingPrice = i.price), (r.snappingIndex = i.index)),
                r
              )
            })
          e.append(this.createLineAnchor({ ...t, points: r }, 0))
        }
        createLineAnchor(e, t) {
          const i = e.points.map((e) => e.point)
          if (this.isLocked()) {
            const n = this._getSelectionRenderer(t)
            return (
              n.setData({
                bgColors: this._lineAnchorColors(i),
                points: e.points,
                visible: this.areAnchorsVisible(),
                hittestResult: s.HitTarget.Regular,
                barSpacing: this._model.timeScale().barSpacing(),
              }),
              n
            )
          }
          const n = (0, o.lastMouseOrTouchEventInfo)().isTouch,
            r = this._getLineAnchorRenderer(t),
            l = this.isHoveredSource()
              ? (this._model.lastHittestData()?.pointIndex ?? null)
              : null
          return (
            r.setData({
              ...e,
              color: this.anchorColor(),
              backgroundColors: this._lineAnchorColors(i),
              hoveredPointIndex: l,
              linePointBeingEdited: this.isBeingEdited()
                ? this._model.linePointBeingEdited()
                : null,
              radius: this._anchorRadius(),
              strokeWidth: n ? p.TouchStrokeWidth : p.RegularStrokeWidth,
              selected: this.isSelectedSource(),
              selectedStrokeWidth: n
                ? p.TouchSelectedStrokeWidth
                : p.RegularSelectedStrokeWidth,
              visible: this.areAnchorsVisible(),
              clickHandler: e.clickHandler,
            }),
            r
          )
        }
        _anchorRadius() {
          return (0, o.lastMouseOrTouchEventInfo)().isTouch
            ? p.TouchAnchorRadius
            : p.RegularAnchorRadius
        }
        _lineAnchorColors(e) {
          const t = (0, r.ensureNotNull)(
            this._model.paneForSource(this._source),
          ).height()
          return e.map((e) =>
            this._model.backgroundColorAtYPercentFromTop(e.y / t),
          )
        }
        _updateImpl(e) {
          this._points = []
          this._model.timeScale().isEmpty() ||
            (this._validatePriceScale() &&
              (this._source.points().forEach((e, t) => {
                const i = this._source.pointToScreenPoint(e)
                i && this._points.push(f(i, t))
              }),
              2 === this._points.length &&
                (this._middlePoint = this._source.calcMiddlePoint(
                  this._points[0],
                  this._points[1],
                )),
              (this._invalidated = !1)))
        }
        _validatePriceScale() {
          const e = this._source.priceScale()
          return null !== e && !e.isEmpty()
        }
        _getSource() {
          return this._source
        }
        _getPoints() {
          return this._points
        }
        _getModel() {
          return this._model
        }
        _height() {
          const e = this._source.priceScale()
          return null !== e ? e.height() : 0
        }
        _width() {
          return this._model.timeScale().width()
        }
        _needLabelExclusionPath(e, t) {
          const i = this._source.properties().childs()
          return (
            'middle' === (t ?? i.vertLabelsAlign.value()) &&
            (0, d.needTextExclusionPath)(e)
          )
        }
        _addAlertRenderer(
          e,
          t,
          i = this._source.properties().linecolor.value(),
        ) {}
        _getAlertRenderer(
          e,
          t = this._source.properties().linecolor.value(),
          i,
        ) {
          return null
        }
        _getSelectionRenderer(e) {
          while (this._selectionRenderers.length <= e)
            this._selectionRenderers.push(new l.SelectionRenderer())
          return this._selectionRenderers[e]
        }
        _getLineAnchorRenderer(e) {
          while (this._lineAnchorRenderers.length <= e)
            this._lineAnchorRenderers.push(new a.LineAnchorRenderer())
          return this._lineAnchorRenderers[e]
        }
      }
    },
    65395: (e, t, i) => {
      i.d(t, { ChannelRenderer: () => h })
      var n = i(50151),
        r = i(86441),
        o = i(34026),
        s = i(4652),
        l = i(56468),
        a = i(37743),
        c = i(19063),
        d = i(75919)
      class h extends d.MediaCoordinatesPaneRenderer {
        constructor() {
          super(...arguments), (this._data = null)
        }
        setData(e) {
          this._data = e
        }
        hitTest(e, t) {
          if (null === this._data || !this._data.hittestOnBackground)
            return null
          const i = this._visiblePolygon(t.mediaSize)
          return null !== i && (0, o.pointInPolygon)(e, i)
            ? new l.HitTestResult(l.HitTarget.MovePointBackground)
            : null
        }
        _drawImpl(e) {
          if (null === this._data) return
          const t = e.context,
            i = this._visiblePolygon(e.mediaSize)
          if (null !== i) {
            t.beginPath(), t.moveTo(i[0].x, i[0].y)
            for (let e = 1; e < i.length; e++) t.lineTo(i[e].x, i[e].y)
            ;(t.fillStyle = (0, c.generateColor)(
              this._data.color,
              this._data.transparency,
              !0,
            )),
              t.fill()
          }
        }
        _visiblePolygon(e) {
          const t = (0, n.ensureNotNull)(this._data),
            i = t.p1,
            o = t.p2,
            l = t.p3,
            c = t.p4
          if (
            (0, r.equalPoints)(i, o) ||
            (0, r.equalPoints)(l, c) ||
            ((0, s.distanceToLine)(i, o, l).distance < 1e-6 &&
              (0, s.distanceToLine)(i, o, c).distance < 1e-6)
          )
            return null
          if (e.width <= 0 || e.height <= 0) return null
          let d = [
            new r.Point(0, 0),
            new r.Point(e.width, 0),
            new r.Point(e.width, e.height),
            new r.Point(0, e.height),
          ]
          return (
            (d = (0, a.clipPolygonByEdge)(d, i, o, [c, l])),
            (d = (0, a.clipPolygonByEdge)(d, c, l, [i, o])),
            (0, r.equalPoints)(l, i) ||
              t.extendLeft ||
              (d = (0, a.clipPolygonByEdge)(d, l, i, [o, c])),
            d
          )
        }
      }
    },
    36036: (e, t, i) => {
      i.d(t, {
        LineAnchorRenderer: () => v,
        lineSourcePaneViewPointToLineAnchorPoint: () => y,
        mapLineSourcePaneViewPointToLineAnchorPoint: () => P,
      })
      var n = i(86441),
        r = i(34026),
        o = i(50151),
        s = i(37743),
        l = i(37265),
        a = i(56468),
        c = i(72791),
        d = i(61993),
        h = i(30125)
      function p(e, t, i, n) {
        const { point: r } = t,
          o = i + n / 2
        ;(0, s.drawRoundRect)(e, r.x - o, r.y - o, 2 * o, 2 * o, (i + n) / 2),
          e.closePath(),
          (e.lineWidth = n)
      }
      function u(e, t, i, n) {
        ;(e.globalAlpha = 0.2), p(e, t, i, n), e.stroke(), (e.globalAlpha = 1)
      }
      function f(e, t, i, n) {
        p(e, t, i - n, n), e.fill(), e.stroke()
      }
      function _(e, t, i, n) {
        const { point: r } = t
        ;(e.globalAlpha = 0.2),
          e.beginPath(),
          e.arc(r.x, r.y, i + n / 2, 0, 2 * Math.PI, !0),
          e.closePath(),
          (e.lineWidth = n),
          e.stroke(),
          (e.globalAlpha = 1)
      }
      function g(e, t, i, n) {
        const { point: r } = t
        e.beginPath(),
          e.arc(r.x, r.y, i - n / 2, 0, 2 * Math.PI, !0),
          e.closePath(),
          (e.lineWidth = n),
          e.fill(),
          e.stroke()
      }
      class v extends h.BitmapCoordinatesPaneRenderer {
        constructor(e) {
          super(), (this._data = e ?? null)
        }
        setData(e) {
          this._data = e
        }
        hitTest(e) {
          if (null === this._data || this._data.disableInteractions) return null
          const { radius: t, points: i } = this._data,
            n = t + (0, d.interactionTolerance)().anchor
          for (const t of i) {
            if (t.point.subtract(e).length() <= n)
              return new a.HitTestResult(
                t.hitTarget ?? a.HitTarget.ChangePoint,
                {
                  areaName: a.AreaName.AnchorPoint,
                  pointIndex: t.pointIndex,
                  cursorType: t.cursorType ?? c.PaneCursorType.Default,
                  activeItem: t.activeItem,
                  snappingPrice: t.snappingPrice,
                  snappingIndex: t.snappingIndex,
                  nonDiscreteIndex: t.nonDiscreteIndex,
                  possibleMovingDirections: t.possibleMovingDirections,
                  clickHandler: this._data.clickHandler,
                  tapHandler: this._data.clickHandler,
                },
              )
          }
          return null
        }
        doesIntersectWithBox(e) {
          return (
            null !== this._data &&
            this._data.points.some((t) => (0, r.pointInBox)(t.point, e))
          )
        }
        _drawImpl(e) {
          if (null === this._data || !this._data.visible) return
          const t = [],
            i = [],
            n = [],
            r = []
          for (let e = 0; e < this._data.points.length; ++e) {
            const o = this._data.points[e],
              s = this._data.backgroundColors[e]
            o.square ? (t.push(o), i.push(s)) : (n.push(o), r.push(s))
          }
          t.length && this._drawPoints(e, t, i, f, u),
            n.length && this._drawPoints(e, n, r, g, _)
        }
        _drawPoints(e, t, i, r, s) {
          const {
              context: a,
              horizontalPixelRatio: c,
              verticalPixelRatio: d,
            } = e,
            h = (0, o.ensureNotNull)(this._data),
            p = h.radius
          let u = Math.max(1, Math.floor((h.strokeWidth || 2) * c))
          h.selected && (u += Math.max(1, Math.floor(c / 2)))
          const f = Math.max(1, Math.floor(c))
          let _ = Math.round(p * c * 2)
          _ % 2 != f % 2 && (_ += 1)
          const g = (f % 2) / 2
          a.strokeStyle = h.color
          for (let e = 0; e < t.length; ++e) {
            const o = t[e]
            if (
              !(
                (0, l.isInteger)(o.pointIndex) &&
                h.linePointBeingEdited === o.pointIndex
              )
            ) {
              a.fillStyle = i[e]
              if (
                (r(
                  a,
                  {
                    ...o,
                    point: new n.Point(
                      Math.round(o.point.x * c) + g,
                      Math.round(o.point.y * d) + g,
                    ),
                  },
                  _ / 2,
                  u,
                ),
                !h.disableInteractions)
              ) {
                if (
                  null !== h.hoveredPointIndex &&
                  o.pointIndex === h.hoveredPointIndex
                ) {
                  const e = Math.max(1, Math.floor(h.selectedStrokeWidth * c))
                  let t = Math.round(p * c * 2)
                  t % 2 != f % 2 && (t += 1)
                  s(
                    a,
                    {
                      ...o,
                      point: new n.Point(
                        Math.round(o.point.x * c) + g,
                        Math.round(o.point.y * d) + g,
                      ),
                    },
                    t / 2,
                    e,
                  )
                }
              }
            }
          }
        }
      }
      function y(e, t = e.pointIndex, i, n, r, o, s, l, a, c) {
        return {
          point: e,
          pointIndex: t,
          cursorType: i,
          square: n,
          hitTarget: r,
          snappingPrice: o,
          snappingIndex: s,
          nonDiscreteIndex: l,
          activeItem: a,
          possibleMovingDirections: c,
        }
      }
      function P(e) {
        return y(e)
      }
    },
  },
])
