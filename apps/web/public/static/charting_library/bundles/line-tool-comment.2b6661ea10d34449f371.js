;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3966],
  {
    84738: (e, t, r) => {
      r.r(t), r.d(t, { LineToolComment: () => w })
      var n,
        i = r(94784),
        o = r(88960),
        s = r(42752),
        a = r(32679),
        l = r(69113),
        d = r(19063),
        h = r(30699),
        c = r(15938),
        u = r(56468),
        p = r(32211),
        _ = r(36036),
        g = r(62689),
        T = r(95201),
        m = r(86441),
        x = r(34026),
        f = r(75919),
        b = r(37743)
      class C extends f.MediaCoordinatesPaneRenderer {
        constructor() {
          super(...arguments), (this._data = null)
        }
        setData(e) {
          this._data = e
        }
        hitTest(e) {
          if (null === this._data || 0 === this._data.points.length) return null
          const {
              points: [t],
              innerWidth: r,
              innerHeight: n,
            } = this._data,
            i = t.x,
            o = t.y - n,
            s = (0, m.box)(new m.Point(i, o), new m.Point(i + r, o + n))
          return (0, x.pointInBox)(e, s)
            ? new u.HitTestResult(u.HitTarget.MovePoint, {
                areaName: u.AreaName.Text,
              })
            : null
        }
        _drawImpl(e) {
          if (null === this._data || 0 === this._data.points.length) return
          const t = e.context,
            {
              points: [r],
              innerWidth: n,
              innerHeight: i,
              backgroundColor: o,
              borderColor: s,
              borderRadius: a,
            } = this._data,
            l = r.x,
            d = r.y - i
          t.translate(l, d),
            (0, b.drawRoundRect)(t, 0, 0, n, i, [a, a, a, 2]),
            (t.fillStyle = o),
            t.fill(),
            (t.strokeStyle = s),
            (t.lineWidth = 2),
            t.stroke(),
            t.closePath()
        }
      }
      !((e) => {
        e[(e.CommentTextLeft = 12)] = 'CommentTextLeft'
      })(n || (n = {}))
      class R extends p.InplaceTextLineSourcePaneView {
        constructor(e, t, r, n, i) {
          super(e, t, r, n, i),
            (this._commentRenderer = new C()),
            (this._labelRenderer = new g.LineToolTextRenderer(
              void 0,
              new u.HitTestResult(
                u.HitTarget.MovePoint,
                (0, p.inplaceEditHandlers)(
                  this._tryActivateEditMode.bind(this, null),
                ),
              ),
            )),
            (this._renderer = new T.CompositeRenderer()),
            this._source.setAdditionalCursorData(
              () => ({
                color: this._source.editableTextStyle().cursorColor,
                ...this._labelRenderer.getTextInfo(),
              }),
              this._labelRenderer.positionToCoordinate.bind(
                this._labelRenderer,
              ),
            )
        }
        renderer(e) {
          return this._invalidated && this._updateImpl(e), this._renderer
        }
        _updateImpl(e) {
          super._updateImpl(e), this._renderer.clear()
          const t = this._source.properties().childs(),
            r = {
              ...this._inplaceTextHighlight(),
              text: this._textData(),
              fontSize: t.fontsize.value(),
              offsetX: 0,
              offsetY: 0,
              points: this._points,
              vertAlign: h.VerticalAlign.Bottom,
              horzAlign: h.HorizontalAlign.Left,
              horzTextAlign: h.HorizontalAlign.Left,
              font: c.CHART_FONT_FAMILY,
              color: this._textColor(),
              boxPaddingVert: Math.round(t.fontsize.value() / 1.3),
              boxPaddingHorz: 12,
            }
          this._labelRenderer.setData(r),
            this._labelRenderer.setCursorType(this._textCursorType())
          const { height: n, width: i } = e.mediaSize
          this._labelRenderer.isOutOfScreen(i, n)
            ? this.closeTextEditor()
            : this._updateInplaceText(this._labelRenderer.getTextInfo())
          const o = this._labelRenderer.measure(),
            s = {
              points: this._points,
              borderColor: t.borderColor.value(),
              backgroundColor: (0, d.generateColor)(
                t.backgroundColor.value(),
                t.transparency.value(),
              ),
              innerWidth: o.width,
              innerHeight: o.height,
              borderRadius:
                Math.min(
                  o.width,
                  this._labelRenderer.lineHeight() +
                    2 * Math.round(t.fontsize.value() / 1.3),
                ) / 2,
            }
          this._commentRenderer.setData(s),
            this._renderer.append(this._commentRenderer),
            1 === s.points.length &&
              this._renderer.append(
                this.createLineAnchor(
                  {
                    points: s.points.map(
                      _.mapLineSourcePaneViewPointToLineAnchorPoint,
                    ),
                  },
                  0,
                ),
              ),
            this._renderer.append(this._labelRenderer)
        }
      }
      class w extends l.LineToolBalloon {
        constructor(e, t, r, n) {
          super(
            e,
            t ?? w.createProperties(e.backgroundTheme().spawnOwnership()),
            r,
            n,
          )
        }
        name() {
          return 'Comment'
        }
        activateEditingOnCreation() {
          return !0
        }
        editableTextProperties() {
          return {
            text: this.properties().childs().text,
            textColor: this.properties().childs().color,
          }
        }
        static createProperties(e, t) {
          const r = new a.DefaultProperty({
            defaultName: 'linetoolcomment',
            state: t,
            theme: e,
          })
          return w._configureProperties(r), r
        }
        _normalizePoint(e, t) {
          return (
            super._normalizePointWithoutOffset(e) ?? super._normalizePoint(e, t)
          )
        }
        _createPaneView() {
          this._setPaneViews([
            new R(
              this,
              this._model,
              this._openTextEditor.bind(this),
              this._closeTextEditor.bind(this),
            ),
          ])
        }
        _createDataSourceBackgroundColorWV() {
          const e = (0, i.generateColorCached)(),
            { backgroundColor: t, transparency: r } = this.properties().childs()
          return (0, o.combine)(
            () => e(t.value(), r.value()),
            (0, s.convertPropertyToWatchedValue)(t).ownership(),
            (0, s.convertPropertyToWatchedValue)(r).ownership(),
          ).ownership()
        }
      }
      w._defaultText = ''
    },
    62689: (e, t, r) => {
      r.d(t, { LineToolTextRenderer: () => i })
      var n = r(17330)
      class i extends n.TextRenderer {
        getTextInfo() {
          const e = this._getInternalData(),
            t = this.fontStyle(),
            r = this._getFontInfo()
          return {
            ...e,
            lineHeight: this.lineHeight(),
            lineSpacing: this.lineSpacing(),
            font: t,
            fontSize: r.fontSize,
            centerRotation: this.centerTextRotation() ?? void 0,
          }
        }
        setCursorType(e) {
          this._hitTest.data()?.cursorType !== e &&
            this._hitTest.mergeData({ cursorType: e })
        }
      }
    },
  },
])
