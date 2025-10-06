;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3314],
  {
    73174: (e, t, i) => {
      i.r(t),
        i.d(t, {
          getCoordinateXMetaInfo: () => P,
          getCoordinateYMetaInfo: () => y,
          getCoordinatesPropertiesDefinitions: () => m,
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
      var d = i(32097),
        c = i(64147),
        h = i(12988),
        u = i(91682)
      const p = -5e4,
        _ = 15e3,
        f = new o.TranslatedString(
          'change price Y coordinate',
          r.t(null, void 0, i(11737)),
        ),
        v = new o.TranslatedString(
          'change bar X coordinate',
          r.t(null, void 0, i(2066)),
        ),
        g = new o.TranslatedString('move drawings', r.t(null, void 0, i(76261)))
      function y(e, t, i) {
        return {
          property: (0, d.convertToDefinitionProperty)(e, t.price, f),
          info: { typeY: 1, stepY: i },
        }
      }
      function P(e, t) {
        return {
          property: (0, d.convertToDefinitionProperty)(e, t.bar, v),
          info: {
            typeX: 0,
            minX: new c.WatchedValue(p),
            maxX: new c.WatchedValue(_),
            stepX: new c.WatchedValue(1),
          },
        }
      }
      function m(e, t, i, n, r, o) {
        const s = P(e, t),
          l = y(e, t, n)
        return (0, d.createCoordinatesPropertyDefinition)(
          { x: s.property, y: l.property },
          {
            id: (0, u.removeSpaces)(`${o}Coordinates${r}`),
            title: r,
            ...s.info,
            ...l.info,
          },
        )
      }
      const T = /^([+*\-\/]?)((?:\d*)|(?:\d+\.\d*))$/
      function x(e, t, i) {
        const r = new h.Property(''),
          o = (0, d.makeProxyDefinitionProperty)(r.weakReference())
        return (
          (o.setValue = (o) => {
            try {
              const r = o.match(T)
              if (!r) return
              const [, s, l] = r
              if (!l.length) return
              const d = i(Number.parseFloat(l))
              if ('/' === s && (0 === d.price || 0 === d.index)) return
              t.withMacro(g, () => {
                e.filter((e) => !e.isSourceHidden()).forEach((e) => {
                  const i = e.points()
                  let r
                  switch (s) {
                    case '': {
                      const e = (0, n.ensureDefined)(i[0])
                      let { index: t = e.index, price: o = e.price } = d
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
                      let { index: e = 0, price: t = 0 } = d
                      '-' === s && ((e *= -1), (t *= -1)),
                        (r = i.map((i) => ({
                          ...i,
                          index: i.index + e,
                          price: i.price + t,
                        })))
                      break
                    }
                    case '*': {
                      const { index: e = 1, price: t = 1 } = d
                      r = i.map((i) => ({
                        ...i,
                        index: i.index * e,
                        price: i.price * t,
                      }))
                      break
                    }
                    case '/': {
                      const { index: e = 1, price: t = 1 } = d
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
        const n = x(e, t, (e) => ({ index: e })),
          o = x(e, t, (e) => ({ price: e }))
        return (0, d.createSelectionCoordinatesPropertyDefinition)(
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
      i.d(t, { createLineStyleDefinition: () => y })
      var n = i(11542),
        r = i(45126),
        o = i(32097),
        s = i(91682)
      const l = new r.TranslatedString(
          'change {toolName} line visibility',
          n.t(null, void 0, i(24550)),
        ),
        a = new r.TranslatedString(
          'change {toolName} line width',
          n.t(null, void 0, i(19541)),
        ),
        d = new r.TranslatedString(
          'change {toolName} line style',
          n.t(null, void 0, i(66429)),
        ),
        c = new r.TranslatedString(
          'change {toolName} line color',
          n.t(null, void 0, i(24059)),
        ),
        h = new r.TranslatedString(
          'change {toolName} line extending left',
          n.t(null, void 0, i(18773)),
        ),
        u = new r.TranslatedString(
          'change {toolName} line left end',
          n.t(null, void 0, i(21474)),
        ),
        p = new r.TranslatedString(
          'change {toolName} line extending right',
          n.t(null, void 0, i(43823)),
        ),
        _ = new r.TranslatedString(
          'change {toolName} line right end',
          n.t(null, void 0, i(54827)),
        ),
        f = n.t(null, void 0, i(3554)),
        v = n.t(null, void 0, i(61856)),
        g = n.t(null, void 0, i(87430))
      function y(e, t, i, n, r) {
        const y = {},
          P = {
            id: `${(0, s.removeSpaces)(i.originalText())}${n}`,
            title: (r && r.line) || f,
          }
        return (
          void 0 !== t.showLine &&
            (y.checked = (0, o.convertToDefinitionProperty)(
              e,
              t.showLine,
              l.format({ toolName: i }),
            )),
          void 0 !== t.lineWidth &&
            (y.width = (0, o.convertToDefinitionProperty)(
              e,
              t.lineWidth,
              a.format({ toolName: i }),
            )),
          void 0 !== t.lineStyle &&
            (y.style = (0, o.convertToDefinitionProperty)(
              e,
              t.lineStyle,
              d.format({ toolName: i }),
            )),
          void 0 !== t.lineColor &&
            (y.color = (0, o.getColorDefinitionProperty)(
              e,
              t.lineColor,
              null,
              c.format({ toolName: i }),
            )),
          void 0 !== t.extendLeft &&
            ((y.extendLeft = (0, o.convertToDefinitionProperty)(
              e,
              t.extendLeft,
              h.format({ toolName: i }),
            )),
            (P.extendLeftTitle = (r && r.extendLeftTitle) || v)),
          void 0 !== t.leftEnd &&
            (y.leftEnd = (0, o.convertToDefinitionProperty)(
              e,
              t.leftEnd,
              u.format({ toolName: i }),
            )),
          void 0 !== t.extendRight &&
            ((y.extendRight = (0, o.convertToDefinitionProperty)(
              e,
              t.extendRight,
              p.format({ toolName: i }),
            )),
            (P.extendRightTitle = (r && r.extendRightTitle) || g)),
          void 0 !== t.rightEnd &&
            (y.rightEnd = (0, o.convertToDefinitionProperty)(
              e,
              t.rightEnd,
              _.format({ toolName: i }),
            )),
          (0, o.createLinePropertyDefinition)(y, P)
        )
      }
    },
    15399: (e, t, i) => {
      i.d(t, { LevelsProperty: () => f })
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
      function d(e, t, i, n) {
        return n.push(i[t]), n
      }
      function c(e, t, i, n) {
        return (n[t] = i[e]), n
      }
      function h() {
        return []
      }
      function u() {
        return {}
      }
      function p(e, t, i) {
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
      function _(e, t, i) {
        return i(e, { tpl: u, fill: c, typecheck: t.typecheck.unpack }, t)
      }
      class f extends s.DefaultProperty {
        constructor(e) {
          const { levelsIterator: t = p, map: i = {}, ...n } = e,
            r = { ...a, ...i }
          n.state && (n.state = _(n.state, r, t)),
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
                { tpl: h, fill: d, typecheck: o.typecheck.pack },
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
                _(e, this._map, this._levelsIterator),
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
          return new f(this._options())
        }
        merge(e, t) {
          return super.merge(
            this._map ? _(e, this._map, this._levelsIterator) : e,
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
    72609: (e, t, i) => {
      i.d(t, {
        LineToolPaneViewFibWithLabels: () => h,
        labelEdgeOffset: () => c,
      })
      var n = i(50151),
        r = i(17330),
        o = i(56468),
        s = i(74079),
        l = i(15938),
        a = i(32211),
        d = i(62689)
      const c = 4
      class h extends a.InplaceTextLineSourcePaneView {
        constructor(e, t, i, l, c) {
          super(e, t, i, l, c),
            (this._labelsRenderers = {}),
            (this._numericFormatter = (0, s.getNumericFormatter)()),
            (this._percentageFormatter = (0, s.getPercentageFormatter)()),
            (this._textRenderers = {}),
            (this._inplaceEditLevelIndex = 1)
          for (let t = 1; t <= e.levelsCount(); t++)
            this._labelsRenderers[t] = new r.TextRenderer(
              void 0,
              new o.HitTestResult(o.HitTarget.MovePoint, { activeItem: t }),
            )
          if (i && l && c) {
            for (let t = 1; t <= e.levelsCount(); t++) {
              const e = new o.HitTestResult(o.HitTarget.MovePoint, {
                ...(0, a.inplaceEditHandlers)(
                  this._tryActivateEditMode.bind(this, t),
                ),
                activeItem: t,
              })
              this._textRenderers[t] = new d.LineToolTextRenderer(void 0, e)
            }
            this._source.setAdditionalCursorData(
              () => {
                const e = (0, n.ensureDefined)(
                  this._textRenderers[this._inplaceEditLevelIndex],
                )
                return {
                  color: this._source.editableTextStyle().cursorColor,
                  ...e.getTextInfo(),
                }
              },
              (e) =>
                (0, n.ensureDefined)(
                  this._textRenderers[this._inplaceEditLevelIndex],
                ).positionToCoordinate(e),
            )
          }
        }
        _tryActivateEditMode(e, t) {
          ;(this._inplaceEditLevelIndex = e), super._tryActivateEditMode(e, t)
        }
        _activateEditMode(e) {
          const t = (0, n.ensureDefined)(
            this._textRenderers[this._inplaceEditLevelIndex],
          )
          this._updateInplaceText(t.getTextInfo()), super._activateEditMode(e)
        }
        _updateLabelForLevel(e) {
          const t = this._labelsRenderers[e.levelIndex]
          if (void 0 === t) return null
          const i = this._source.priceScale()
          if (!i) return null
          const n = this._source.ownerSource()?.firstValue()
          if (null == n) return null
          const r = this._source.properties(),
            o = Boolean(r.showCoeffs?.value()),
            s = Boolean(r.showPrices?.value())
          if (!o && !s) return null
          const l = r['level' + e.levelIndex].coeff.value()
          let a = ''
          if (o) {
            a +=
              (r.coeffsAsPercents?.value() ?? !1)
                ? this._percentageFormatter.format(100 * l, {
                    signPositive: !1,
                    tailSize: 2,
                  })
                : this._numericFormatter.format(l)
          }
          return (
            s && (a += ' (' + i.formatPrice(e.price, n) + ')'),
            this._updateRendererLabel(e, t, a),
            t
          )
        }
        _updateRendererLabel(e, t, i) {
          if (!i && void 0 === e.decorator) return null
          const {
              leftPoint: n,
              rightPoint: o,
              horzAlign: s,
              extendLeft: a,
              extendRight: d,
              ...h
            } = e,
            u = this._source.properties(),
            [p, _] = (0, r.getTextAlignInBox)({
              horzAlign: s,
              extendLeft: a,
              extendRight: d,
              width: this._model.timeScale().width(),
              leftPoint: n,
              rightPoint: o,
            })
          return (
            t.setData({
              points: [p],
              text: i,
              horzAlign: _,
              offsetX: c,
              offsetY: 0,
              font: l.CHART_FONT_FAMILY,
              fontSize: u.labelFontSize?.value() ?? 12,
              ...h,
            }),
            t
          )
        }
      }
    },
    90882: (e, t, i) => {
      i.d(t, { LineToolFibWedgeBase: () => l })
      var n = i(50151),
        r = i(86441),
        o = i(24362),
        s = i(64147)
      class l extends o.InplaceTextLineDataSource {
        constructor() {
          super(...arguments),
            (this._hasEditableCoordinates = new s.WatchedValue(!1))
        }
        pointsCount() {
          return 3
        }
        setPoint(e, t) {
          if ((super.setPoint(e, t), !this._recursiveGuard))
            try {
              if (((this._recursiveGuard = !0), 2 === e)) {
                const e = (0, n.ensureNotNull)(
                  this.pointToScreenPoint(this._points[0]),
                )
                let t = (0, n.ensureNotNull)(
                  this.pointToScreenPoint(this._points[1]),
                )
                const i = (0, n.ensureNotNull)(
                  this.pointToScreenPoint(this._points[2]),
                )
                  .subtract(e)
                  .length()
                let o = t.subtract(e)
                o.length() <= 0 && (o = new r.Point(1, 0)),
                  (t = e.add(o.normalized().scaled(i)))
                const s = (0, n.ensureNotNull)(this.screenPointToPoint(t)),
                  l = this._pointsProperty.childs().points[1]
                l.childs().price.setValue(s.price),
                  l.childs().bar.setValue(s.index)
              } else {
                const e = (0, n.ensureNotNull)(
                    this.pointToScreenPoint(this._points[0]),
                  ),
                  t = (0, n.ensureNotNull)(
                    this.pointToScreenPoint(this._points[1]),
                  )
                let i = (0, n.ensureNotNull)(
                  this.pointToScreenPoint(this._points[2]),
                )
                const o = t.subtract(e).length()
                let s = i.subtract(e)
                s.length() <= 0 && (s = new r.Point(1, 0)),
                  (i = e.add(s.normalized().scaled(o)))
                const l = (0, n.ensureNotNull)(this.screenPointToPoint(i)),
                  a = this._pointsProperty.childs().points[2]
                a.childs().price.setValue(l.price),
                  a.childs().bar.setValue(l.index)
              }
            } finally {
              this._recursiveGuard = !1
            }
        }
        addPoint(e) {
          if (2 === this._points.length) {
            const t = (0, n.ensureNotNull)(
                this.pointToScreenPoint(this._points[0]),
              ),
              i = (0, n.ensureNotNull)(this.pointToScreenPoint(this._points[1]))
            let r = (0, n.ensureNotNull)(this.pointToScreenPoint(e))
            const o = i.subtract(t).length(),
              s = r.subtract(t).normalized()
            r = t.add(s.scaled(o))
            const l = (0, n.ensureNotNull)(this.ownerSource()),
              a = (0, n.ensureNotNull)(l.firstValue()),
              d = (0, n.ensureNotNull)(this.priceScale()).coordinateToPrice(
                r.y,
                a,
              )
            e = {
              index: Math.round(this._model.timeScale().coordinateToIndex(r.x)),
              price: d,
            }
          }
          return super.addPoint(e)
        }
        editableTextProperties() {
          ;(0, n.assert)(!1, 'unexpected method call')
        }
      }
    },
    84417: (e, t, i) => {
      i.d(t, { FibWedgePaneView: () => p })
      var n = i(50151),
        r = i(86441),
        o = i(30699),
        s = i(72609),
        l = i(91046),
        a = i(56468),
        d = i(95201),
        c = i(55053),
        h = i(49857),
        u = i(36036)
      class p extends s.LineToolPaneViewFibWithLabels {
        constructor() {
          super(...arguments),
            (this._renderer = null),
            (this._levels = []),
            (this._baseTrendRenderer = new l.TrendLineRenderer()),
            (this._edgeTrendRenderer = new l.TrendLineRenderer())
        }
        renderer(e) {
          return this._invalidated && this._updateImpl(e), this._renderer
        }
        _updateImpl(e) {
          if (
            (super._updateImpl(e),
            (this._renderer = null),
            (this._levels = []),
            this._points.length < 3)
          )
            return void this._updateRenderer()
          const [t, i, o] = this._points,
            s = i.subtract(t).normalized(),
            l = o.subtract(t).normalized(),
            a = new r.Point(1, 0),
            d = new r.Point(0, 1)
          let c = Math.acos(s.dotProduct(a))
          s.dotProduct(d) < 0 && (c = 2 * Math.PI - c)
          let h = Math.acos(l.dotProduct(a))
          if (
            (l.dotProduct(d) < 0 && (h = 2 * Math.PI - h),
            h < c && ([c, h] = [h, c]),
            Math.abs(c - h) > Math.PI)
          ) {
            const e = Math.min(c, h)
            ;(c = Math.max(c, h)), (h = e + 2 * Math.PI)
          }
          const u = this._source.properties()
          for (let e = 1; e <= this._source.levelsCount(); e++) {
            const r = 'level' + e,
              o = (0, n.ensureDefined)(u.child(r))
            if (!o.childs().visible.value()) continue
            const a = o.childs().coeff.value(),
              d = o.childs().color.value(),
              c = Math.abs(i.subtract(t).length() * a),
              h = s.add(l).scaled(0.5).normalized().scaled(c),
              p = t.add(h)
            this._levels.push({
              coeff: a,
              color: d,
              radius: c,
              labelPoint: p,
              p1: t.add(s.scaled(c)),
              p2: t.add(l.scaled(c)),
              linewidth: o.childs().linewidth.value(),
              linestyle: o.childs().linestyle.value(),
              index: e,
            })
          }
          this._points.length < 2 || this._updateRenderer(c, h)
        }
        _updateRenderer(e = Number.NaN, t = Number.NaN) {
          if (this._points.length < 2) return
          const i = new d.CompositeRenderer(),
            n = this._source.properties().childs(),
            [r, s] = this._points,
            l = n.trendline.childs().visible.value()
              ? n.trendline.childs().linewidth.value()
              : 0,
            p = n.trendline.childs().linestyle.value()
          if (
            (this._baseTrendRenderer.setData({
              points: [r, s],
              color: n.trendline.childs().color.value(),
              linewidth: l,
              linestyle: p,
              extendleft: !1,
              extendright: !1,
              leftend: h.LineEnd.Normal,
              rightend: h.LineEnd.Normal,
            }),
            i.append(this._baseTrendRenderer),
            this._points.length < 3)
          )
            return this.addAnchors(i), void (this._renderer = i)
          let _ = this._points[2]
          const f = _.pointIndex,
            v = s.subtract(r).length(),
            g = _.subtract(r).normalized()
          ;(_ = r.add(g.scaled(v))),
            (_.pointIndex = f),
            this._edgeTrendRenderer.setData({
              points: [r, _],
              color: n.trendline.childs().color.value(),
              linewidth: l,
              linestyle: p,
              extendleft: !1,
              extendright: !1,
              leftend: h.LineEnd.Normal,
              rightend: h.LineEnd.Normal,
            }),
            i.append(this._edgeTrendRenderer)
          for (let r = this._levels.length - 1; r >= 0; r--) {
            const s = this._levels[r],
              l = new c.ArcWedgeRenderer()
            l.setData({
              center: this._points[0],
              radius: s.radius,
              prevRadius: r > 0 ? this._levels[r - 1].radius : 0,
              color: s.color,
              linewidth: s.linewidth,
              angle1: e,
              angle2: t,
              p1: s.p1,
              p2: s.p2,
              fillBackground: n.fillBackground.value(),
              transparency: n.transparency.value(),
              color1: '',
              color2: '',
            }),
              l.setHitTest(
                new a.HitTestResult(a.HitTarget.MovePoint, void 0, s.index),
              ),
              i.append(l)
            const d = this._updateLabelForLevel({
              levelIndex: s.index,
              color: s.color,
              leftPoint: s.labelPoint,
              rightPoint: s.labelPoint,
              price: 0,
              horzAlign: o.HorizontalAlign.Left,
              vertAlign: o.VerticalAlign.Middle,
            })
            null !== d && i.append(d)
          }
          const y = [r, s]
          this._model.lineBeingCreated() !== this._source && y.push(_),
            i.append(
              this.createLineAnchor(
                {
                  points: y.map(u.mapLineSourcePaneViewPointToLineAnchorPoint),
                },
                0,
              ),
            ),
            (this._renderer = i)
        }
      }
    },
    30051: (e, t, i) => {
      i.r(t), i.d(t, { LineToolFibWedge: () => I })
      var n = i(50151),
        r = i(11542),
        o = i(45126),
        s = i(90882),
        l = i(15399),
        a = i(73305),
        d = i(85719),
        c = i(53749),
        h = i(32097),
        u = i(18009),
        p = i(91682),
        _ = i(95166)
      const f = new o.TranslatedString(
          'change {title} level {index} line visibility',
          r.t(null, void 0, i(51403)),
        ),
        v = new o.TranslatedString(
          'change {title} levels visibility',
          r.t(null, void 0, i(54517)),
        ),
        g = new o.TranslatedString(
          'change {title} level {index} line color',
          r.t(null, void 0, i(664)),
        ),
        y = new o.TranslatedString(
          'change {title} level {index} line width',
          r.t(null, void 0, i(97870)),
        ),
        P = new o.TranslatedString(
          'change {title} level {index} line coeff',
          r.t(null, void 0, i(27154)),
        ),
        m = new o.TranslatedString(
          'change {title} all lines color',
          r.t(null, void 0, i(59577)),
        ),
        T = new o.TranslatedString(
          'change {title} background visibility',
          r.t(null, void 0, i(30839)),
        ),
        x = new o.TranslatedString(
          'change {title} background transparency',
          r.t(null, void 0, i(13783)),
        ),
        b = r.t(null, void 0, i(51574)),
        w = r.t(null, void 0, i(28683)),
        S = r.t(null, void 0, i(79468)),
        C = r.t(null, void 0, i(79650))
      class N extends u.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            r = (0, p.removeSpaces)(i),
            s = new o.TranslatedString(i, this._source.translatedType()),
            l = t.trendline.childs(),
            a = (0, c.createLineStyleDefinition)(
              this._propertyApplier,
              {
                showLine: l.visible,
                lineColor: l.color,
                lineWidth: l.linewidth,
              },
              s,
              'TrendLine',
              { line: b },
            )
          e.push(a)
          const d = this._source.levelsCount()
          for (let i = 1; i <= d; i++) {
            const n = t[`level${i}`].childs(),
              o = (0, h.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, h.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.visible,
                    f.format({ title: s, index: i }),
                  ),
                  color: (0, h.getColorDefinitionProperty)(
                    this._propertyApplier,
                    n.color,
                    null,
                    g.format({ title: s, index: i }),
                  ),
                  width: (0, h.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.linewidth,
                    y.format({ title: s, index: i }),
                  ),
                  level: (0, h.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.coeff,
                    P.format({ title: s, index: i }),
                  ),
                },
                { id: `${r}LineLevel${i}` },
              )
            e.push(o)
          }
          const u = (0, h.createColorPropertyDefinition)(
            {
              color: (0, h.getColorDefinitionProperty)(
                this._propertyApplier,
                new _.CollectibleColorPropertyUndoWrapper(
                  (0, n.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null,
                ),
                null,
                m.format({ title: s }),
                !0,
              ),
            },
            { id: `${r}AllLineColor`, title: w },
          )
          e.push(u)
          const N = (0, h.createTransparencyPropertyDefinition)(
            {
              checked: (0, h.convertToDefinitionProperty)(
                this._propertyApplier,
                t.fillBackground,
                T.format({ title: s }),
              ),
              transparency: (0, h.convertToDefinitionProperty)(
                this._propertyApplier,
                t.transparency,
                x.format({
                  title: s,
                }),
              ),
            },
            { id: `${r}Background`, title: S },
          )
          e.push(N)
          const L = (0, h.createCheckablePropertyDefinition)(
            {
              checked: (0, h.convertToDefinitionProperty)(
                this._propertyApplier,
                t.showCoeffs,
                v.format({ title: s }),
              ),
            },
            { id: `${r}Levels`, title: C },
          )
          return e.push(L), { definitions: e }
        }
      }
      var L = i(84417)
      const D = new o.TranslatedString(
        'erase level line',
        r.t(null, void 0, i(77114)),
      )
      var R
      !((e) => {
        e[(e.LevelsCount = 11)] = 'LevelsCount'
      })(R || (R = {}))
      class I extends s.LineToolFibWedgeBase {
        constructor(e, t, i, n) {
          super(
            e,
            t ?? I.createProperties(e.backgroundTheme().spawnOwnership()),
            i,
            n,
          ),
            this._setPaneViews([new L.FibWedgePaneView(this, this._model)])
        }
        levelsCount() {
          return 11
        }
        isSynchronizable() {
          return !1
        }
        name() {
          return 'Fib Wedge'
        }
        processErase(e, t) {
          const i = (0, n.ensureDefined)(this.properties().child(`level${t}`))
          e.setProperty(
            i.childs().visible,
            !1,
            D,
            d.lineToolsDoNotAffectChartInvalidation,
          )
        }
        static createProperties(e, t) {
          const i = new l.LevelsProperty({
            defaultName: 'linetoolfibwedge',
            state: t,
            map: { range: [1, 11] },
            theme: e,
          })
          return this._configureProperties(i), i
        }
        async _getPropertyDefinitionsViewModelClass() {
          return N
        }
        static _configureProperties(e) {
          super._configureProperties(e)
          const t = [e.childs().trendline.childs().linewidth],
            i = [e.childs().trendline.childs().color]
          for (let r = 1; r <= 11; r++) {
            const o = (0, n.ensureDefined)(e.child(`level${r}`))
            t.push(o.childs().linewidth), i.push(o.childs().color)
          }
          e.addChild('linesColors', new a.LineToolColorsProperty(i)),
            e.addChild('linesWidths', new a.LineToolWidthsProperty(t))
        }
      }
    },
    62689: (e, t, i) => {
      i.d(t, { LineToolTextRenderer: () => r })
      var n = i(17330)
      class r extends n.TextRenderer {
        getTextInfo() {
          const e = this._getInternalData(),
            t = this.fontStyle(),
            i = this._getFontInfo()
          return {
            ...e,
            lineHeight: this.lineHeight(),
            lineSpacing: this.lineSpacing(),
            font: t,
            fontSize: i.fontSize,
            centerRotation: this.centerTextRotation() ?? void 0,
          }
        }
        setCursorType(e) {
          this._hitTest.data()?.cursorType !== e &&
            this._hitTest.mergeData({ cursorType: e })
        }
      }
    },
    55053: (e, t, i) => {
      i.d(t, { ArcWedgeRenderer: () => l })
      var n,
        r = i(56468),
        o = i(19063),
        s = i(75919)
      !((e) => {
        e[(e.HitTestTolerance = 4)] = 'HitTestTolerance'
      })(n || (n = {}))
      class l extends s.MediaCoordinatesPaneRenderer {
        constructor() {
          super(...arguments),
            (this._data = null),
            (this._hitTest = new r.HitTestResult(r.HitTarget.MovePoint)),
            (this._backHitTest = new r.HitTestResult(
              r.HitTarget.MovePointBackground,
            ))
        }
        setData(e) {
          this._data = e
        }
        setHitTest(e) {
          this._hitTest = e
        }
        hitTest(e) {
          if (null === this._data) return null
          const t = e.subtract(this._data.center),
            i = t.length()
          if (Math.abs(i - this._data.radius) <= 4) {
            const t = e.subtract(this._data.p1).length(),
              i = e.subtract(this._data.p2).length()
            if (
              Math.max(t, i) <= this._data.p1.subtract(this._data.p2).length()
            )
              return this._hitTest
          }
          if (this._data.fillBackground && i <= this._data.radius) {
            const e = this._data.p1.subtract(this._data.center).normalized(),
              i = this._data.p2.subtract(this._data.center).normalized(),
              n = t.normalized(),
              r = e.dotProduct(i),
              o = n.dotProduct(e),
              s = n.dotProduct(i)
            if (o >= r && s >= r) return this._backHitTest
          }
          return null
        }
        _drawImpl(e) {
          if (null === this._data) return
          const t = e.context
          if (
            ((t.strokeStyle = this._data.color),
            (t.lineWidth = this._data.linewidth),
            t.beginPath(),
            t.arc(
              this._data.center.x,
              this._data.center.y,
              this._data.radius,
              this._data.angle1,
              this._data.angle2,
            ),
            t.stroke(),
            this._data.fillBackground)
          ) {
            if (
              (t.arc(
                this._data.center.x,
                this._data.center.y,
                this._data.prevRadius,
                this._data.angle2,
                this._data.angle1,
                !0,
              ),
              this._data.gradient)
            ) {
              const e = t.createRadialGradient(
                this._data.center.x,
                this._data.center.y,
                this._data.prevRadius,
                this._data.center.x,
                this._data.center.y,
                this._data.radius,
              )
              e.addColorStop(
                0,
                (0, o.generateColor)(
                  this._data.color1,
                  this._data.transparency,
                ),
              ),
                e.addColorStop(
                  1,
                  (0, o.generateColor)(
                    this._data.color2,
                    this._data.transparency,
                  ),
                ),
                (t.fillStyle = e)
            } else
              t.fillStyle = (0, o.generateColor)(
                this._data.color,
                this._data.transparency,
                !0,
              )
            t.fill()
          }
        }
      }
    },
  },
])
