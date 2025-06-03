;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2183],
  {
    422452: (t, e, i) => {
      i.d(e, { LineAnchorRenderer: () => y })
      var n = i(86441),
        r = i(934026),
        s = i(650151),
        o = i(741253),
        a = i(372605),
        l = i(353795),
        u = i(131616),
        d = i(466093),
        c = i(68717)
      class h extends n.Point {
        constructor(t, e, i, n) {
          super(t, e), (this.data = i), (this.square = n)
        }
      }
      function p(t, e, i, n) {
        const r = i + n / 2
        ;(0, o.drawRoundRect)(t, e.x - r, e.y - r, 2 * r, 2 * r, (i + n) / 2),
          t.closePath(),
          (t.lineWidth = n)
      }
      function _(t, e, i, n) {
        ;(t.globalAlpha = 0.2), p(t, e, i, n), t.stroke(), (t.globalAlpha = 1)
      }
      function P(t, e, i, n) {
        p(t, e, i - n, n), t.fill(), t.stroke()
      }
      function g(t, e, i, n) {
        ;(t.globalAlpha = 0.2),
          t.beginPath(),
          t.arc(e.x, e.y, i + n / 2, 0, 2 * Math.PI, !0),
          t.closePath(),
          (t.lineWidth = n),
          t.stroke(),
          (t.globalAlpha = 1)
      }
      function f(t, e, i, n) {
        t.beginPath(),
          t.arc(e.x, e.y, i - n / 2, 0, 2 * Math.PI, !0),
          t.closePath(),
          (t.lineWidth = n),
          t.fill(),
          t.stroke()
      }
      class y extends c.BitmapCoordinatesPaneRenderer {
        constructor(t) {
          super(), (this._data = null != t ? t : null)
        }
        setData(t) {
          this._data = t
        }
        hitTest(t) {
          var e
          if (null === this._data || this._data.disableInteractions) return null
          const {
              radius: i,
              points: n,
              pointsCursorType: r,
              hittestResult: s,
            } = this._data,
            o = (0, d.interactionTolerance)().anchor
          for (let a = 0; a < n.length; ++a) {
            const d = n[a]
            if (d.subtract(t).length() <= i + o)
              return new l.HitTestResult(Array.isArray(s) ? s[a] : s, {
                pointIndex: d.data,
                cursorType:
                  null !== (e = null == r ? void 0 : r[a]) && void 0 !== e
                    ? e
                    : u.PaneCursorType.Default,
                activeItem: d.activeItem,
                snappingPrice: d.snappingPrice,
                snappingIndex: d.snappingIndex,
                nonDiscreteIndex: d.nonDiscreteIndex,
              })
          }
          return null
        }
        doesIntersectWithBox(t) {
          return (
            null !== this._data &&
            this._data.points.some((e) => (0, r.pointInBox)(e, t))
          )
        }
        _drawImpl(t) {
          if (null === this._data || !this._data.visible) return
          const e = [],
            i = [],
            n = [],
            r = []
          for (let t = 0; t < this._data.points.length; ++t) {
            const s = this._data.points[t],
              o = this._data.backgroundColors[t]
            s.square ? (e.push(s), i.push(o)) : (n.push(s), r.push(o))
          }
          e.length && this._drawPoints(t, e, i, P, _),
            n.length && this._drawPoints(t, n, r, f, g)
        }
        _drawPoints(t, e, i, n, r) {
          const {
              context: o,
              horizontalPixelRatio: l,
              verticalPixelRatio: u,
            } = t,
            c = (0, s.ensureNotNull)(this._data),
            p = c.currentPoint,
            _ = c.radius
          let P = Math.max(1, Math.floor((c.strokeWidth || 2) * l))
          c.selected && (P += Math.max(1, Math.floor(l / 2)))
          const g = Math.max(1, Math.floor(l))
          let f = Math.round(_ * l * 2)
          f % 2 != g % 2 && (f += 1)
          const y = (g % 2) / 2,
            m = (0, d.interactionTolerance)().anchor
          o.strokeStyle = c.color
          for (let t = 0; t < e.length; ++t) {
            const s = e[t]
            o.fillStyle = i[t]
            if (
              !((0, a.isInteger)(s.data) && c.linePointBeingEdited === s.data)
            ) {
              if (
                (n(
                  o,
                  new h(
                    Math.round(s.x * l) + y,
                    Math.round(s.y * u) + y,
                    s.data,
                    s.square,
                  ),
                  f / 2,
                  P,
                ),
                !c.disableInteractions)
              ) {
                if (s.subtract(p).length() <= _ + m) {
                  const t = Math.max(1, Math.floor(c.selectedStrokeWidth * l))
                  let e = Math.round(_ * l * 2)
                  e % 2 != g % 2 && (e += 1)
                  r(
                    o,
                    new h(
                      Math.round(s.x * l) + y,
                      Math.round(s.y * u) + y,
                      s.data,
                      s.square,
                    ),
                    e / 2,
                    t,
                  )
                }
              }
            }
          }
        }
      }
    },
    936051: (t, e, i) => {
      i.r(e), i.d(e, { StudyInputPriceAxisPaneView: () => s })
      var n = i(764063),
        r = i(630432)
      class s extends r.PriceAxisView {
        constructor(t, e) {
          super(),
            (this._input = t),
            (this._getInputValue = e.getInputValue),
            (this._convertPriceToCoordinate = e.convertPriceToCoordinate),
            (this._formatPrice = e.formatPrice)
        }
        _updateRendererData(t, e, i) {
          t.visible = !1
          const r = this._getInputValue(this._input.id)
          if (null === r) return
          const s = this._convertPriceToCoordinate(r)
          if (null === s) return
          const o = n.axisLabelBackgroundColor.common
          ;(i.background = o),
            (i.textColor = this.generateTextColor(o)),
            (i.coordinate = s),
            (t.text = this._formatPrice(r)),
            (t.visible = !0)
        }
      }
    },
    620953: (t, e, i) => {
      i.r(e), i.d(e, { StudyInputTimeAxisPaneView: () => s })
      var n = i(764063),
        r = i(664135)
      class s extends r.TimeAxisView {
        constructor(t, e, i) {
          super(e), (this._input = t), (this._getInputValue = i)
        }
        _getBgColor() {
          return n.axisLabelBackgroundColor.common
        }
        _getIndex() {
          const t = this._getInputValue(this._input.id)
          return null === t
            ? null
            : this._model.timeScale().timePointToIndex(t / 1e3)
        }
        _isVisible() {
          return !0
        }
      }
    },
    791726: (t, e, i) => {
      i.r(e), i.d(e, { StudyInputsAnchorsPaneView: () => h })
      var n = i(86441),
        r = i(149962),
        s = i(596853),
        o = i(353795),
        a = i(131616),
        l = i(422452),
        u = i(151247)
      const d = r.colorsPalette['color-cold-gray-500'],
        c = r.colorsPalette['color-tv-blue-600']
      class h extends u.StudyInputsPaneView {
        constructor(t, e, i) {
          super(t, e, i),
            (this._editable = !0),
            (this._points = []),
            (this._cursors = []),
            (this._studyAnchorRenderers = []),
            (this._isSelected = i.isSelected ? i.isSelected : () => !0),
            (this._isHovered = i.isHovered ? i.isHovered : () => !0)
        }
        setEditable(t) {
          this._editable = t
        }
        getEditable() {
          return this._editable
        }
        _fillCompositeRendrer(t, e) {
          this._fillInformationAboutPointsAndCursors(t, e),
            this._renderer.append(
              this._createStudyAnchor(
                { points: this._points, pointsCursorType: this._cursors },
                t,
                0,
              ),
            )
        }
        _fillInformationAboutPointsAndCursors(t, e) {
          if (
            ((this._points = []),
            (this._cursors = []),
            this._inputs.find((t) => Array.isArray(t) || 'price' === t.type))
          ) {
            if (null === this._convertPriceToCoordinate(0)) return
          }
          this._inputs.forEach((i, r) => {
            let s = a.PaneCursorType.Default,
              o = null,
              l = null,
              u = !0
            const d = i
            if (Array.isArray(i)) {
              const t = 'time' === i[0].type ? i[0] : i[1],
                e = 'price' === i[0].type ? i[0] : i[1],
                n = this._getInputValue(t.id),
                r = this._getInputValue(e.id)
              null !== n &&
                null !== r &&
                ((o = this._convertTimeToCoordinate(n)),
                (l = this._convertPriceToCoordinate(r)),
                (u = !1))
            } else {
              const n = this._getInputValue(i.id)
              null !== n &&
                ('time' === i.type
                  ? ((o = this._convertTimeToCoordinate(n)),
                    (l = t / 2),
                    (s = a.PaneCursorType.HorizontalResize))
                  : ((o = e / 2),
                    (l = this._convertPriceToCoordinate(n)),
                    (s = a.PaneCursorType.VerticalResize)))
            }
            if (null !== o && null !== l) {
              const t = new n.Point(o, l)
              ;(t.activeItem = d),
                (t.square = u),
                (t.data = r),
                this._points.push(t),
                this._cursors.push(s)
            }
          })
        }
        _createStudyAnchor(t, e, i) {
          const n = (0, s.lastMouseOrTouchEventInfo)().isTouch,
            r = this._getStudyAnchorRenderer(i),
            a = this._inputs.indexOf(this._model.activeItemBeingMoved()),
            l = this._model.crossHairSource(),
            u =
              (this._isHovered() || this._isSelected()) &&
              !this._model.isSnapshot(),
            h = {
              ...t,
              color: this._editable ? c : d,
              backgroundColors: this._studyAnchorColors(t.points, e),
              currentPoint: l.currentPoint(),
              linePointBeingEdited: -1 !== a ? a : null,
              hittestResult: o.HitTarget.MovePoint,
              radius: n ? 13 : 6,
              strokeWidth: n ? 2 : 1,
              selected: this._isSelected(),
              selectedStrokeWidth: n ? 0 : 3,
              visible: u,
            }
          return this._editable || (h.disableInteractions = !0), r.setData(h), r
        }
        _studyAnchorColors(t, e) {
          return t.map((t) =>
            this._model.backgroundColorAtYPercentFromTop(t.y / e),
          )
        }
        _getStudyAnchorRenderer(t) {
          while (this._studyAnchorRenderers.length <= t)
            this._studyAnchorRenderers.push(new l.LineAnchorRenderer())
          return this._studyAnchorRenderers[t]
        }
      }
    },
    870526: (t, e, i) => {
      i.r(e), i.d(e, { StudyInputsLinesPaneView: () => c })
      var n = i(149962),
        r = i(549696),
        s = i(353795),
        o = i(131616),
        a = i(591014),
        l = i(820151),
        u = i(151247)
      const d = {
        color: n.colorsPalette['color-cold-gray-500'],
        linewidth: 1,
        linestyle: r.LINESTYLE_SOLID,
      }
      class c extends u.StudyInputsPaneView {
        constructor() {
          super(...arguments), (this._editable = !0)
        }
        setEditable(t) {
          this._editable = t
        }
        getEditable() {
          return this._editable
        }
        _fillCompositeRendrer(t, e) {
          this._inputs.forEach((t) => {
            if (Array.isArray(t)) {
              const e = t[0],
                i = t[1],
                n = this._getInputValue(e.id),
                r = this._getInputValue(i.id)
              if (null !== n && null !== r) {
                const t = this._createLineRendererForinput(n, e),
                  s = this._createLineRendererForinput(r, i)
                null !== t &&
                  null !== s &&
                  (this._renderer.append(t), this._renderer.append(s))
              }
            } else {
              const e = this._getInputValue(t.id)
              if (null !== e) {
                const i = this._createLineRendererForinput(e, t)
                null !== i && this._renderer.append(i)
              }
            }
          })
        }
        _createLineRendererForinput(t, e) {
          if ('price' === e.type) {
            const i = this._convertPriceToCoordinate(t)
            if (null !== i) {
              const t = new a.HorizontalLineRenderer()
              t.setData({ ...d, y: i })
              const n = this._editable
                ? new s.HitTestResult(s.HitTarget.MovePoint, {
                    cursorType: o.PaneCursorType.VerticalResize,
                    activeItem: e,
                  })
                : null
              return t.setHitTest(n), t
            }
          } else if ('time' === e.type) {
            const i = this._convertTimeToCoordinate(t)
            if (null !== i) {
              const t = new l.VerticalLineRenderer()
              t.setData({ ...d, x: i })
              const n = this._editable
                ? new s.HitTestResult(s.HitTarget.MovePoint, {
                    cursorType: o.PaneCursorType.HorizontalResize,
                    activeItem: e,
                  })
                : null
              return t.setHitTest(n), t
            }
          }
          return null
        }
      }
    },
    151247: (t, e, i) => {
      i.d(e, { StudyInputsPaneView: () => s })
      var n = i(650151),
        r = i(734792)
      class s {
        constructor(t, e, i) {
          ;(this._renderer = new r.CompositeRenderer()),
            (this._invalidated = !0),
            (this._inputs = t),
            (this._model = e),
            (this._convertPriceToCoordinate = i.convertPriceToCoordinate),
            (this._getInputValue = i.getInputValue)
        }
        getInputs() {
          return this._inputs
        }
        addInput(t) {
          ;(0, n.assert)(
            -1 === this._inputs.indexOf(t),
            'Pane view already contains specified input',
          ),
            this._inputs.push(t),
            this.update()
        }
        update(t) {
          this._invalidated = !0
        }
        renderer(t, e) {
          return (
            this._invalidated &&
              (this._updateImpl(t, e), (this._invalidated = !1)),
            this._renderer
          )
        }
        _updateImpl(t, e) {
          this._renderer.clear()
          this._model.timeScale().isEmpty() ||
            0 === this._inputs.length ||
            this._fillCompositeRendrer(t, e)
        }
        _convertTimeToCoordinate(t) {
          const e = this._model.timeScale(),
            i = e.timePointToIndex(t / 1e3)
          return null !== i ? e.indexToCoordinate(i) : null
        }
      }
    },
  },
])
