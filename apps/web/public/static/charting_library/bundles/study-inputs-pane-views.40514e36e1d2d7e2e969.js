;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2183],
  {
    36036: (e, t, i) => {
      i.d(t, {
        LineAnchorRenderer: () => I,
        lineSourcePaneViewPointToLineAnchorPoint: () => f,
        mapLineSourcePaneViewPointToLineAnchorPoint: () => m,
      })
      var n = i(86441),
        o = i(34026),
        r = i(50151),
        s = i(37743),
        a = i(37265),
        l = i(56468),
        d = i(72791),
        u = i(61993),
        c = i(30125)
      function h(e, t, i, n) {
        const { point: o } = t,
          r = i + n / 2
        ;(0, s.drawRoundRect)(e, o.x - r, o.y - r, 2 * r, 2 * r, (i + n) / 2),
          e.closePath(),
          (e.lineWidth = n)
      }
      function p(e, t, i, n) {
        ;(e.globalAlpha = 0.2), h(e, t, i, n), e.stroke(), (e.globalAlpha = 1)
      }
      function _(e, t, i, n) {
        h(e, t, i - n, n), e.fill(), e.stroke()
      }
      function P(e, t, i, n) {
        const { point: o } = t
        ;(e.globalAlpha = 0.2),
          e.beginPath(),
          e.arc(o.x, o.y, i + n / 2, 0, 2 * Math.PI, !0),
          e.closePath(),
          (e.lineWidth = n),
          e.stroke(),
          (e.globalAlpha = 1)
      }
      function g(e, t, i, n) {
        const { point: o } = t
        e.beginPath(),
          e.arc(o.x, o.y, i - n / 2, 0, 2 * Math.PI, !0),
          e.closePath(),
          (e.lineWidth = n),
          e.fill(),
          e.stroke()
      }
      class I extends c.BitmapCoordinatesPaneRenderer {
        constructor(e) {
          super(), (this._data = e ?? null)
        }
        setData(e) {
          this._data = e
        }
        hitTest(e) {
          if (null === this._data || this._data.disableInteractions) return null
          const { radius: t, points: i } = this._data,
            n = t + (0, u.interactionTolerance)().anchor
          for (const t of i) {
            if (t.point.subtract(e).length() <= n)
              return new l.HitTestResult(
                t.hitTarget ?? l.HitTarget.ChangePoint,
                {
                  areaName: l.AreaName.AnchorPoint,
                  pointIndex: t.pointIndex,
                  cursorType: t.cursorType ?? d.PaneCursorType.Default,
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
            this._data.points.some((t) => (0, o.pointInBox)(t.point, e))
          )
        }
        _drawImpl(e) {
          if (null === this._data || !this._data.visible) return
          const t = [],
            i = [],
            n = [],
            o = []
          for (let e = 0; e < this._data.points.length; ++e) {
            const r = this._data.points[e],
              s = this._data.backgroundColors[e]
            r.square ? (t.push(r), i.push(s)) : (n.push(r), o.push(s))
          }
          t.length && this._drawPoints(e, t, i, _, p),
            n.length && this._drawPoints(e, n, o, g, P)
        }
        _drawPoints(e, t, i, o, s) {
          const {
              context: l,
              horizontalPixelRatio: d,
              verticalPixelRatio: u,
            } = e,
            c = (0, r.ensureNotNull)(this._data),
            h = c.radius
          let p = Math.max(1, Math.floor((c.strokeWidth || 2) * d))
          c.selected && (p += Math.max(1, Math.floor(d / 2)))
          const _ = Math.max(1, Math.floor(d))
          let P = Math.round(h * d * 2)
          P % 2 != _ % 2 && (P += 1)
          const g = (_ % 2) / 2
          l.strokeStyle = c.color
          for (let e = 0; e < t.length; ++e) {
            const r = t[e]
            if (
              !(
                (0, a.isInteger)(r.pointIndex) &&
                c.linePointBeingEdited === r.pointIndex
              )
            ) {
              l.fillStyle = i[e]
              if (
                (o(
                  l,
                  {
                    ...r,
                    point: new n.Point(
                      Math.round(r.point.x * d) + g,
                      Math.round(r.point.y * u) + g,
                    ),
                  },
                  P / 2,
                  p,
                ),
                !c.disableInteractions)
              ) {
                if (
                  null !== c.hoveredPointIndex &&
                  r.pointIndex === c.hoveredPointIndex
                ) {
                  const e = Math.max(1, Math.floor(c.selectedStrokeWidth * d))
                  let t = Math.round(h * d * 2)
                  t % 2 != _ % 2 && (t += 1)
                  s(
                    l,
                    {
                      ...r,
                      point: new n.Point(
                        Math.round(r.point.x * d) + g,
                        Math.round(r.point.y * u) + g,
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
      function f(e, t = e.pointIndex, i, n, o, r, s, a, l, d) {
        return {
          point: e,
          pointIndex: t,
          cursorType: i,
          square: n,
          hitTarget: o,
          snappingPrice: r,
          snappingIndex: s,
          nonDiscreteIndex: a,
          activeItem: l,
          possibleMovingDirections: d,
        }
      }
      function m(e) {
        return f(e)
      }
    },
    63006: (e, t, i) => {
      i.r(t), i.d(t, { StudyInputPriceAxisPaneView: () => r })
      var n = i(57596),
        o = i(98558)
      class r extends o.PriceAxisView {
        constructor(e, t) {
          super(),
            (this._input = e),
            (this._getInputValue = t.getInputValue),
            (this._convertPriceToCoordinate = t.convertPriceToCoordinate),
            (this._formatPrice = t.formatPrice)
        }
        _updateRendererData(e, t, i) {
          e.visible = !1
          const o = this._getInputValue(this._input.id)
          if (null === o) return
          const r = this._convertPriceToCoordinate(o)
          if (null === r) return
          const s = n.axisLabelBackgroundColor.common
          ;(i.background = s),
            (i.textColor = this.generateTextColor(s)),
            (i.coordinate = r),
            (e.text = this._formatPrice(o)),
            (e.visible = !0)
        }
      }
    },
    35581: (e, t, i) => {
      i.r(t), i.d(t, { StudyInputTimeAxisPaneView: () => r })
      var n = i(57596),
        o = i(66156)
      class r extends o.TimeAxisView {
        constructor(e, t, i) {
          super(t), (this._input = e), (this._getInputValue = i)
        }
        _getBgColor() {
          return n.axisLabelBackgroundColor.common
        }
        _getIndex() {
          const e = this._getInputValue(this._input.id)
          return null === e
            ? null
            : this._model.timeScale().timePointToIndex(e / 1e3)
        }
        _isVisible() {
          return !0
        }
      }
    },
    99549: (e, t, i) => {
      i.r(t), i.d(t, { StudyInputsAnchorsPaneView: () => h })
      var n = i(86441),
        o = i(19625),
        r = i(69186),
        s = i(56468),
        a = i(72791),
        l = i(36036),
        d = i(50546)
      const u = o.colorsPalette['color-cold-gray-500'],
        c = o.colorsPalette['color-tv-blue-600']
      class h extends d.StudyInputsPaneView {
        constructor(e, t, i) {
          super(e, t, i),
            (this._editable = !0),
            (this._points = []),
            (this._studyAnchorRenderers = []),
            (this._isSelected = i.isSelected ? i.isSelected : () => !0),
            (this._isHovered = i.isHovered ? i.isHovered : () => !0)
        }
        setEditable(e) {
          this._editable = e
        }
        getEditable() {
          return this._editable
        }
        _fillCompositeRendrer(e, t) {
          this._fillInformationAboutPointsAndCursors(e, t),
            this._renderer.append(
              this._createStudyAnchor({ points: this._points }, e, 0),
            )
        }
        _fillInformationAboutPointsAndCursors(e, t) {
          if (
            ((this._points = []),
            this._inputs.find((e) => Array.isArray(e) || 'price' === e.type))
          ) {
            if (null === this._convertPriceToCoordinate(0)) return
          }
          this._inputs.forEach((i, o) => {
            let r = a.PaneCursorType.Default,
              d = null,
              u = null,
              c = !0
            const h = i
            if (Array.isArray(i)) {
              const e = 'time' === i[0].type ? i[0] : i[1],
                t = 'price' === i[0].type ? i[0] : i[1],
                n = this._getInputValue(e.id),
                o = this._getInputValue(t.id)
              null !== n &&
                null !== o &&
                ((d = this._convertTimeToCoordinate(n)),
                (u = this._convertPriceToCoordinate(o)),
                (c = !1))
            } else {
              const n = this._getInputValue(i.id)
              null !== n &&
                ('time' === i.type
                  ? ((d = this._convertTimeToCoordinate(n)),
                    (u = e / 2),
                    (r = a.PaneCursorType.HorizontalResize))
                  : ((d = t / 2),
                    (u = this._convertPriceToCoordinate(n)),
                    (r = a.PaneCursorType.VerticalResize)))
            }
            null !== d &&
              null !== u &&
              this._points.push(
                (0, l.lineSourcePaneViewPointToLineAnchorPoint)(
                  new n.Point(d, u),
                  o,
                  r,
                  c,
                  s.HitTarget.MovePoint,
                  void 0,
                  void 0,
                  void 0,
                  h,
                  Array.isArray(i) ? 0 : 'price' === i.type ? 2 : 1,
                ),
              )
          })
        }
        _createStudyAnchor(e, t, i) {
          const n = (0, r.lastMouseOrTouchEventInfo)().isTouch,
            o = this._getStudyAnchorRenderer(i),
            s = this._inputs.indexOf(this._model.activeItemBeingMoved()),
            a = this._isHovered(),
            l = (a || this._isSelected()) && !this._model.isSnapshot(),
            d = a ? (this._model.lastHittestData()?.pointIndex ?? null) : null,
            h = {
              ...e,
              color: this._editable ? c : u,
              backgroundColors: this._studyAnchorColors(e.points, t),
              hoveredPointIndex: d,
              linePointBeingEdited: -1 !== s ? s : null,
              radius: n ? 13 : 6,
              strokeWidth: n ? 2 : 1,
              selected: this._isSelected(),
              selectedStrokeWidth: n ? 0 : 3,
              visible: l,
            }
          return this._editable || (h.disableInteractions = !0), o.setData(h), o
        }
        _studyAnchorColors(e, t) {
          return e.map((e) =>
            this._model.backgroundColorAtYPercentFromTop(e.point.y / t),
          )
        }
        _getStudyAnchorRenderer(e) {
          while (this._studyAnchorRenderers.length <= e)
            this._studyAnchorRenderers.push(new l.LineAnchorRenderer())
          return this._studyAnchorRenderers[e]
        }
      }
    },
    98255: (e, t, i) => {
      i.r(t), i.d(t, { StudyInputsLinesPaneView: () => c })
      var n = i(19625),
        o = i(51056),
        r = i(56468),
        s = i(72791),
        a = i(50600),
        l = i(95173),
        d = i(50546)
      const u = {
        color: n.colorsPalette['color-cold-gray-500'],
        linewidth: 1,
        linestyle: o.LINESTYLE_SOLID,
      }
      class c extends d.StudyInputsPaneView {
        constructor() {
          super(...arguments), (this._editable = !0)
        }
        setEditable(e) {
          this._editable = e
        }
        getEditable() {
          return this._editable
        }
        _fillCompositeRendrer(e, t) {
          this._inputs.forEach((e) => {
            if (Array.isArray(e)) {
              const t = e[0],
                i = e[1],
                n = this._getInputValue(t.id),
                o = this._getInputValue(i.id)
              if (null !== n && null !== o) {
                const e = this._createLineRendererForinput(n, t),
                  r = this._createLineRendererForinput(o, i)
                null !== e &&
                  null !== r &&
                  (this._renderer.append(e), this._renderer.append(r))
              }
            } else {
              const t = this._getInputValue(e.id)
              if (null !== t) {
                const i = this._createLineRendererForinput(t, e)
                null !== i && this._renderer.append(i)
              }
            }
          })
        }
        _createLineRendererForinput(e, t) {
          if ('price' === t.type) {
            const i = this._convertPriceToCoordinate(e)
            if (null !== i) {
              const e = new a.HorizontalLineRenderer()
              e.setData({ ...u, y: i })
              const n = this._editable
                ? new r.HitTestResult(r.HitTarget.MovePoint, {
                    cursorType: s.PaneCursorType.VerticalResize,
                    activeItem: t,
                    possibleMovingDirections: 2,
                  })
                : null
              return e.setHitTest(n), e
            }
          } else if ('time' === t.type) {
            const i = this._convertTimeToCoordinate(e)
            if (null !== i) {
              const e = new l.VerticalLineRenderer()
              e.setData({ ...u, x: i })
              const n = this._editable
                ? new r.HitTestResult(r.HitTarget.MovePoint, {
                    cursorType: s.PaneCursorType.HorizontalResize,
                    activeItem: t,
                    possibleMovingDirections: 1,
                  })
                : null
              return e.setHitTest(n), e
            }
          }
          return null
        }
      }
    },
    50546: (e, t, i) => {
      i.d(t, { StudyInputsPaneView: () => r })
      var n = i(50151),
        o = i(95201)
      class r {
        constructor(e, t, i) {
          ;(this._renderer = new o.CompositeRenderer()),
            (this._invalidated = !0),
            (this._inputs = e),
            (this._model = t),
            (this._convertPriceToCoordinate = i.convertPriceToCoordinate),
            (this._getInputValue = i.getInputValue)
        }
        getInputs() {
          return this._inputs
        }
        addInput(e) {
          ;(0, n.assert)(
            -1 === this._inputs.indexOf(e),
            'Pane view already contains specified input',
          ),
            this._inputs.push(e),
            this.update()
        }
        update(e) {
          this._invalidated = !0
        }
        renderer(e) {
          return (
            this._invalidated &&
              (this._updateImpl(e.mediaSize.height, e.mediaSize.width),
              (this._invalidated = !1)),
            this._renderer
          )
        }
        _updateImpl(e, t) {
          this._renderer.clear()
          this._model.timeScale().isEmpty() ||
            0 === this._inputs.length ||
            this._fillCompositeRendrer(e, t)
        }
        _convertTimeToCoordinate(e) {
          const t = this._model.timeScale(),
            i = t.timePointToIndex(e / 1e3)
          return null !== i ? t.indexToCoordinate(i) : null
        }
      }
    },
  },
])
