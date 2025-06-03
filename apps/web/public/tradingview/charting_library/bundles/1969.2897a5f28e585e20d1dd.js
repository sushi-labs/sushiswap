;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1969],
  {
    316167: (t, e, o) => {
      o.d(e, { blendColors: () => l, generateBlendColors: () => a })
      var r = o(827147),
        i = o(822914),
        s = o(724377)
      const l = (t, e) =>
        (0, s.rgbaToString)(
          (0, s.blendRgba)((0, s.parseRgba)(t), (0, s.parseRgba)(e)),
        )
      function a(t, e) {
        const o = (0, i.default)(t),
          s = Object.keys(o)
        for (const i of s) {
          const s = t[i]
          ;(0, r.default)(s) ? (o[i] = l(s, e)) : (o[i] = a(s, e))
        }
        return o
      }
    },
    734602: (t, e, o) => {
      o.d(e, { useGlobalCloseOnScrollAndCustomEvents: () => s })
      var r = o(50959),
        i = o(370981)
      function s(t) {
        ;(0, r.useEffect)(() => {
          return (
            (t = l),
            window.addEventListener('scroll', t),
            () => window.removeEventListener('scroll', t)
          )
          var t
        }, []),
          (0, r.useEffect)(() => {
            if (t.length)
              return ((t, e) => {
                for (const o of t) o.subscribe(null, e)
                return () => {
                  for (const o of t) o.unsubscribe(null, e)
                }
              })(t, l)
          }, t)
      }
      function l() {
        ;(0, i.globalCloseMenu)()
      }
    },
    914090: (t, e, o) => {
      o.d(e, { TooltipPopup: () => n })
      var r = o(50959),
        i = o(624216),
        s = o(370981),
        l = o(180185),
        a = o(372605)
      const n = (0, r.forwardRef)((t, e) => {
        const {
            onClose: o,
            onForceClose: n,
            onClickOutside: d,
            className: c,
            ...h
          } = t,
          u = (0, r.useRef)(null)
        ;(0, r.useEffect)(
          () => (
            s.globalCloseDelegate.subscribe(null, n),
            () => {
              s.globalCloseDelegate.unsubscribe(null, n)
            }
          ),
          [n],
        )
        const p = (0, r.useCallback)(
            (t) => {
              27 === (0, l.hashFromEvent)(t) && (t.preventDefault(), n())
            },
            [n],
          ),
          _ = (0, r.useCallback)(() => {
            u.current && u.current.focus({ preventScroll: !0 })
          }, [])
        return r.createElement(
          i.PopupMenu,
          {
            className: c,
            isOpened: !0,
            tabIndex: -1,
            reference: (t) => {
              'function' == typeof e
                ? e(t)
                : (0, a.isObject)(e) && (e.current = t),
                (u.current = t)
            },
            onClose: o,
            onClickOutside: d,
            onKeyDown: p,
            onOpen: _,
            ...h,
          },
          t.children,
        )
      })
      n.displayName = 'TooltipPopup'
    },
    144242: (t) => {
      t.exports = { title: 'title-u3QJgF_p' }
    },
    163915: (t, e, o) => {
      o.d(e, { ToolWidgetMenuSummary: () => l })
      var r = o(50959),
        i = o(497754),
        s = o(144242)
      function l(t) {
        return r.createElement(
          'div',
          { className: i(t.className, s.title) },
          t.children,
        )
      }
    },
    27938: (t, e, o) => {
      var r
      o.d(e, { TradedItemType: () => r }),
        ((t) => {
          ;(t[(t.Position = 0)] = 'Position'), (t[(t.Order = 1)] = 'Order')
        })(r || (r = {}))
    },
    281969: (t, e, o) => {
      o.d(e, { TradedGroupBase: () => vt, isTradedGroupCustomSource: () => ut })
      var r,
        i = o(822914),
        s = o(650151),
        l = o(609838),
        a = o(938351),
        n = o(364124),
        d = o(656846),
        c = o(282729),
        h = o(27938),
        u = o(829244),
        p = o(206318),
        _ = o(566884),
        y = o(156963),
        v = o(694454),
        m = o(998952),
        f = o(423757),
        b = o(526019),
        C = o(384341),
        g = o(353795),
        P = o(741253),
        k = o(247905),
        T = o(945298),
        x = o(86441),
        M = o(131616),
        S = o(601227),
        w = o(645254)
      function L(t, e, o, r, i, s) {
        t.save(), (t.fillStyle = s), t.fillRect(e, o, r, i), t.restore()
      }
      !((t) => {
        ;(t[(t.Position = 0)] = 'Position'),
          (t[(t.WithBracketButtons = 1)] = 'WithBracketButtons'),
          (t[(t.Projection = 2)] = 'Projection'),
          (t[(t.Default = 3)] = 'Default')
      })(r || (r = {}))
      const D = S.CheckMobile.any()
      function B(t) {
        return {
          activeItem: t,
          equals: (e) =>
            !!e.activeItem &&
            e.activeItem.id === t.id &&
            e.activeItem.part === t.part,
        }
      }
      class I {
        constructor(t, e, o, r) {
          ;(this._height = D ? 23 : 19),
            (this._bodyBorderRadius = 4),
            (this._font = null),
            (this._offsets = null),
            (this._alignedTop = null),
            (this._wasSourceMoved = !1),
            (this._cache = null),
            (this._cacheWithOffset = null),
            (this._textWidthCache = e),
            (this._minMainTextWidthGetter = r),
            (this._data = t),
            (this._font = o),
            this._initCtx()
        }
        data() {
          return this._data
        }
        clearCache() {
          ;(this._cache = null), (this._cacheWithOffset = null)
        }
        applyOffset(t) {
          this._offsets = t
        }
        setAlignedTopCoordinate(t) {
          this._alignedTop = t
        }
        hitTest(t, e) {
          var o
          const r = this.rectWithOffsets(e),
            i = e.pixelRatio,
            l = Math.round(t.x * i),
            a = Math.round(t.y * i),
            n = l >= r.body.left,
            d = l <= r.body.right,
            c = n && d
          if (!(a >= r.top && a <= r.bottom) || !c) return null
          const h = {
            cursorType: M.PaneCursorType.Default,
            hideCrosshairLinesOnHover: !0,
            ...B({ id: this._data.id, part: 8 }),
          }
          if (this._data.disabled)
            return new g.HitTestResult(g.HitTarget.Custom, h)
          let u = {}
          if (void 0 !== this._data.callbacks.onMove) {
            const t = (t) => {
                this._data.callbacks.onMove && this._data.callbacks.onMove(t),
                  (this._wasSourceMoved = !0)
              },
              e = () => {
                this._wasSourceMoved &&
                  this._data.callbacks.onFinishMove &&
                  this._data.callbacks.onFinishMove(),
                  (this._wasSourceMoved = !1)
              }
            u = {
              cursorType: M.PaneCursorType.Pointer,
              pressedMouseMoveHandler: t,
              touchMoveHandler: t,
              mouseUpHandler: e,
              touchEndHandler: e,
              cancelMoveHandler: this._data.callbacks.onCancelMove,
            }
          }
          const p = this._data.callbacks.onContextMenu,
            _ = this._data.callbacks.onContextMenu,
            y = {
              ...h,
              ...u,
              hasOwnShortcutsBehaviourFor: { shiftKey: !0 },
              contextMenuHandler: p,
              touchContextMenuHandler: _,
            },
            v = Math.round(r.body.left / i),
            m = Math.round(r.top / i)
          if (
            l >= r.close.left &&
            d &&
            void 0 !== this._data.callbacks.onClose
          ) {
            const t = Math.round(r.body.right / i),
              e = Math.round(r.close.left / i)
            return new g.HitTestResult(g.HitTarget.Custom, {
              ...y,
              ...B({ id: this._data.id, part: 3 }),
              cursorType: M.PaneCursorType.Default,
              clickHandler: this._data.callbacks.onClose,
              tapHandler: this._data.callbacks.onClose,
              tooltip: {
                extendMargin: !0,
                text: (0, s.ensureDefined)(this._data.close).title,
                rect: { x: e, y: m, w: t - e, h: this._height },
              },
            })
          }
          if (
            null === (o = this._data.callbacks) || void 0 === o
              ? void 0
              : o.allInteractionsHandler
          )
            return new g.HitTestResult(g.HitTarget.Custom, {
              ...h,
              clickHandler: this._data.callbacks.allInteractionsHandler,
              tapHandler: this._data.callbacks.allInteractionsHandler,
              contextMenuHandler: this._data.callbacks.allInteractionsHandler,
              touchContextMenuHandler:
                this._data.callbacks.allInteractionsHandler,
            })
          if (l >= r.text.left && l < r.close.left) {
            const t = Math.round(r.text.left / i),
              e = Math.round(r.bottom / i),
              o = Math.round(r.text.width / i),
              s = this._data.callbacks.onText
            if (void 0 !== s) {
              const r = (r) => {
                  const i = r.clientX - r.localX,
                    l = r.clientY - r.localY,
                    a = new x.Point(t + i, e + l)
                  s((r) => r.x > t && r.x <= t + o && r.y > m && r.y <= e, a)
                },
                i = r,
                l = (t) => {
                  t.preventDefault(), r(t)
                }
              return new g.HitTestResult(g.HitTarget.Custom, {
                ...y,
                ...B({ id: this._data.id, part: 2 }),
                cursorType: M.PaneCursorType.Default,
                clickHandler: i,
                tapHandler: l,
                tooltip: {
                  extendMargin: !0,
                  text: this._data.text.title,
                  rect: { x: t, y: m, w: o, h: this._height },
                },
              })
            }
            const l = Math.round(r.close.left / i)
            return new g.HitTestResult(g.HitTarget.Custom, {
              ...y,
              ...B({ id: this._data.id, part: 2 }),
              tooltip: {
                extendMargin: !0,
                text: this._data.text.title,
                rect: { x: t, y: m, w: l - t, h: this._height },
              },
            })
          }
          const f = this._data.callbacks.onQtyModify
          if (l > r.qty.left && l < r.text.left && void 0 !== f) {
            const t = Math.round(r.qty.left / i),
              e = Math.round(r.bottom / i),
              o = Math.round(r.qty.width / i),
              l = (r) => {
                const i = r.clientX - r.localX,
                  s = r.clientY - r.localY,
                  l = new x.Point(t + o + i, e + s)
                f((r) => r.x > t && r.x <= t + o && r.y > m && r.y <= e, l)
              },
              a = l,
              n = (t) => {
                t.preventDefault(), l(t)
              },
              d = Math.round(r.text.left / i)
            return new g.HitTestResult(g.HitTarget.Custom, {
              ...h,
              ...u,
              ...B({ id: this._data.id, part: 1 }),
              cursorType: M.PaneCursorType.Default,
              clickHandler: a,
              tapHandler: n,
              tooltip: {
                extendMargin: !0,
                text: (0, s.ensureDefined)(this._data.qty).title,
                rect: { x: t, y: m, w: d - t, h: this._height },
              },
            })
          }
          if (
            n &&
            l < r.text.left &&
            void 0 !== this._data.callbacks.onModify
          ) {
            const t = Math.round(r.text.left / i)
            return new g.HitTestResult(g.HitTarget.Custom, {
              ...y,
              ...B({ id: this._data.id, part: 1 }),
              cursorType: M.PaneCursorType.Default,
              clickHandler: this._data.callbacks.onModify,
              tapHandler: this._data.callbacks.onModify,
              tooltip: {
                extendMargin: !0,
                text: (0, s.ensureDefined)(this._data.qty).title,
                rect: { x: v, y: m, w: t - v, h: this._height },
              },
            })
          }
          return new g.HitTestResult(g.HitTarget.Custom, y)
        }
        drawBackground(t, e) {
          !this._data.line.drawOnTop &&
            this._data.visible &&
            this._drawLine(t, e)
        }
        drawLine(t, e) {
          this._isDataVisibleInViewport(e) &&
            this._data.line.drawOnTop &&
            this._data.visible &&
            this._drawLine(t, e)
        }
        drawPointOnLine(t, e, o) {
          if (
            !this._isDataVisibleInViewport(e) ||
            !this._data.point.visible ||
            !this._data.visible
          )
            return
          const r = this.rectWithOffsets(e),
            i = Math.round(3 * e.pixelRatio),
            s = Math.max(1, Math.floor(1 * e.pixelRatio)),
            l = s / 2,
            a = 2.5 * e.pixelRatio + l,
            n = o + (l % 1 == 0 ? 0 : 0.5),
            d = r.yMid + (l % 1 == 0 ? 0 : 0.5)
          this._data.line.extend ||
            this._data.bodyAlignment !==
              k.TradedGroupHorizontalAlignment.Left ||
            (t.save(),
            (t.strokeStyle = this._data.line.color),
            (t.lineWidth = Math.max(
              1,
              Math.floor(this._data.line.thickness * e.pixelRatio),
            )),
            (0, P.setLineStyle)(t, this._data.line.style),
            (0, P.drawHorizontalLine)(t, r.yMid, n, r.left),
            t.restore()),
            t.save(),
            (t.lineWidth = s),
            (0, P.setLineStyle)(t, this._data.point.borderStyle),
            this._data.point.shadowColor &&
              !this._data.disabled &&
              ((t.fillStyle = this._data.point.shadowColor),
              (0, P.createCircle)(t, n, d, a + i),
              t.fill()),
            (t.strokeStyle = this._data.point.borderColor),
            (t.fillStyle = this._data.point.backgroundColor),
            (0, P.createCircle)(t, n, d, a),
            t.fill(),
            t.stroke(),
            t.restore()
        }
        draw(t, e) {
          if (!this._data.visible) return
          const o = e.pixelRatio,
            r = this.rectWithOffsets(e)
          if (!this._isDataVisibleInViewport(e)) return
          const i = 0 !== r.qty.width,
            l = 0 !== r.text.width,
            a = 0 !== r.close.width,
            n = r.body.right - r.body.left,
            d = r.bottom - r.top,
            c = r.top + r.borderWidth,
            h = d - 2 * r.borderWidth,
            u = r.borderRadius - r.borderWidth
          ;(0, P.drawRoundRectWithInnerBorder)(
            t,
            r.body.left,
            r.top,
            n,
            d,
            this._data.borderBackgroundColor,
            r.borderRadius,
            r.borderWidth,
            this._data.borderColor,
            this._data.borderStyle,
          )
          let p = r.body.left + r.borderWidth
          if (i) {
            const e = (0, s.ensureDefined)(this._data.qty)
            this._drawQtyWithBackground(t, o, r, !0, !a && !l),
              (p += r.qty.width),
              r.qty.rightDividerWidth &&
                (L(t, p, c, r.qty.rightDividerWidth, h, e.dividerColor),
                (p += r.qty.rightDividerWidth))
          }
          if (
            (l &&
              (this._drawTextWithBackground(t, o, r, !i, !a),
              (p += r.text.width),
              r.text.rightDividerWidth &&
                (L(
                  t,
                  p,
                  c,
                  r.text.rightDividerWidth,
                  h,
                  this._data.text.dividerColor,
                ),
                (p += r.text.rightDividerWidth))),
            a)
          ) {
            const e = (0, s.ensureDefined)(this._data.close),
              i = r.body.right - p - r.borderWidth
            ;(0, P.drawRoundRectWithInnerBorder)(
              t,
              p,
              c,
              i,
              h,
              e.backgroundColor,
              [0, u, u, 0],
            ),
              e.active.visible &&
                (0, P.drawRoundRectWithInnerBorder)(
                  t,
                  p,
                  c,
                  i,
                  h,
                  e.active.backgroundColor,
                  [0, u, u, 0],
                ),
              this._drawCloseButton(
                t,
                o,
                p,
                r.top,
                r.close.width,
                d,
                r.borderWidth,
              )
          }
        }
        rect(t) {
          return (
            null === this._cache && (this._cache = this._calculateCacheRect(t)),
            this._cache
          )
        }
        rectWithOffsets(t) {
          return (
            null === this._cacheWithOffset &&
              (this._cacheWithOffset = this._calculateCacheRectWithOffsets(t)),
            this._cacheWithOffset
          )
        }
        _calculateCacheRect(t) {
          var e
          const o = t.pixelRatio,
            r = Math.round(t.cssWidth * o),
            i = Math.max(1, Math.floor(1 * o)),
            s = this._bodyBorderRadius,
            l = Math.max(s, Math.floor(s * o)),
            a = this._quantityWidth(this._ctxInternal),
            n = Math.round(a * o),
            d = this._mainTextWidth(this._ctxInternal),
            c = Math.round(d * o),
            h = this._data.callbacks.onClose ? this._closeWidth() : 0,
            u = Math.round(h * o)
          let p = 0
          const _ = a && (d || h),
            y = d && h
          ;(p += _ && 1), (p += y && 1)
          const v = n + c + u + i * p + 2 * i
          let m = Math.round(this._height * o)
          const f = Math.max(1, Math.floor(o))
          m % 2 != f % 2 && (m += 1)
          const b = Math.round(this._data.y * o),
            C = Math.floor(b + f / 2 - m / 2) - Math.floor(0.5 * o),
            g =
              this._data.bodyAlignment ===
              k.TradedGroupHorizontalAlignment.Center
                ? Math.round((40 * r) / 100)
                : Math.round(this._data.rightPadding * o)
          let P = g
          this._data.bodyAlignment === k.TradedGroupHorizontalAlignment.Left &&
            (P = r - g - v)
          const T = r - P,
            x = T - v,
            M = x + n + (n && i) + (n && i),
            S = M + c + (c && i)
          return {
            borderWidth: i,
            borderRadius: l,
            yMid: b,
            top: C,
            bottom: C + m,
            left: x,
            right: T,
            body: { left: x, right: T },
            qty: {
              width: n,
              left: x + (n && i),
              rightDividerWidth:
                _ &&
                (null === (e = this._data.qty) || void 0 === e
                  ? void 0
                  : e.isDividerVisible)
                  ? i
                  : 0,
            },
            text: { width: c, left: M, rightDividerWidth: y ? i : 0 },
            close: { width: u, left: S },
          }
        }
        _calculateCacheRectWithOffsets(t) {
          const e = this.rect(t),
            { left: o, right: r } = this._calcCoordinateWithOffset(
              e.left,
              e.right,
            ),
            { left: i, right: s } = this._calcCoordinateWithOffset(
              e.body.left,
              e.body.right,
            )
          return {
            ...e,
            left: o,
            right: r,
            top: this._alignedTop ? this._alignedTop : e.top,
            bottom: this._alignedTop
              ? this._alignedTop + (e.bottom - e.top)
              : e.bottom,
            body: { ...e.body, left: i, right: s },
            qty: {
              ...e.qty,
              left: this._calcCoordinateWithOffset(
                e.qty.left,
                e.qty.left + e.qty.width,
              ).left,
            },
            text: {
              ...e.text,
              left: this._calcCoordinateWithOffset(
                e.text.left,
                e.text.left + e.text.width,
              ).left,
            },
            close: {
              ...e.close,
              left: this._calcCoordinateWithOffset(
                e.close.left,
                e.close.left + e.close.width,
              ).left,
            },
          }
        }
        _calcCoordinateWithOffset(t, e) {
          var o, r, i, s
          if (null !== this._cache) {
            const l =
              null !==
                (r =
                  null === (o = this._offsets) || void 0 === o
                    ? void 0
                    : o.leftmostForItemOffset) && void 0 !== r
                ? r
                : null
            if (null !== l) {
              const o = t - (this._cache.left - l)
              return { left: o, right: o + (e - t) }
            }
            const a =
              null !==
                (s =
                  null === (i = this._offsets) || void 0 === i
                    ? void 0
                    : i.rightmostForItemOffset) && void 0 !== s
                ? s
                : null
            if (null !== a) {
              const o = e + (a - this._cache.right)
              return { left: o - (e - t), right: o }
            }
          }
          return { left: t, right: e }
        }
        _calcAllWidth(t, e, o, r, i, s) {
          return e + o + r + i + 2 * s
        }
        _isDataVisibleInViewport(t) {
          const e = Math.ceil(this._height / 2)
          return this._data.y >= -e && this._data.y <= t.cssHeight + e
        }
        _mainTextWidth(t) {
          return this._data.text.text
            ? this._minMainTextWidthGetter(this._data, t) + 14
            : 0
        }
        _closeWidth() {
          return 23
        }
        _measureTextWidth(t, e) {
          if (!e) return 0
          const o = t.font
          t.font = (0, s.ensureNotNull)(this._font)
          const r = Math.ceil(this._textWidthCache.measureText(t, e))
          return (t.font = o), r
        }
        _textWidth(t, e) {
          const o = this._measureTextWidth(t, e)
          return o ? Math.round(14 + o) : 0
        }
        _quantityWidth(t) {
          var e, o, r
          const i = this._measureTextWidth(
            t,
            null === (e = this._data.qty) || void 0 === e ? void 0 : e.text,
          )
          return Math.round(
            Math.max(
              this._height,
              14 + i,
              null !==
                (r =
                  null === (o = this._data.qty) || void 0 === o
                    ? void 0
                    : o.minTextWidth) && void 0 !== r
                ? r
                : 0,
            ),
          )
        }
        _drawLine(t, e) {
          const o = e.pixelRatio,
            r = this.rectWithOffsets(e),
            i = Math.round(e.physicalWidth)
          t.save(),
            (t.strokeStyle = this._data.line.color),
            (t.lineWidth = Math.max(
              1,
              Math.floor(this._data.line.thickness * o),
            )),
            (0, P.setLineStyle)(t, this._data.line.style),
            (0, P.drawHorizontalLine)(t, r.yMid, r.body.right, i),
            this._data.line.extend &&
              (0, P.drawHorizontalLine)(t, r.yMid, 0, r.body.right),
            t.restore()
        }
        _drawQtyBackground(t, e, o, r, i) {
          const l = (0, s.ensureDefined)(this._data.qty),
            a = o.bottom - o.top,
            n = o.top + o.borderWidth,
            d = a - 2 * o.borderWidth,
            c = o.borderRadius - o.borderWidth
          let h = 0
          i ? (h = r ? c : [0, c, c, 0]) : r && (h = [c, 0, 0, c]),
            (0, P.drawRoundRectWithInnerBorder)(
              t,
              o.qty.left,
              n,
              o.qty.width,
              d,
              l.backgroundColor,
              h,
            ),
            l.active.visible &&
              (0, P.drawRoundRectWithInnerBorder)(
                t,
                o.qty.left,
                n,
                o.qty.width,
                d,
                l.active.backgroundColor,
                h,
              )
        }
        _drawQtyWithBackground(t, e, o, r, i) {
          const l = (0, s.ensureDefined)(this._data.qty)
          this._drawQtyBackground(t, e, o, r, i)
          const a = (o.top + o.bottom) / 2,
            n = o.qty.left + o.qty.width / 2
          this._drawText(t, e, l.text, l.textColor, n, a)
        }
        _drawTextWithBackground(t, e, o, r, i) {
          const l = o.bottom - o.top,
            a = o.top + o.borderWidth,
            n = l - 2 * o.borderWidth,
            d = o.borderRadius - o.borderWidth
          let c = 0
          i ? (c = r ? d : [0, d, d, 0]) : r && (c = [d, 0, 0, d]),
            (0, P.drawRoundRectWithInnerBorder)(
              t,
              o.text.left,
              a,
              o.text.width,
              n,
              this._data.text.backgroundColor,
              c,
            ),
            this._data.text.active.visible &&
              (0, P.drawRoundRectWithInnerBorder)(
                t,
                o.text.left,
                a,
                o.text.width,
                n,
                this._data.text.active.backgroundColor,
                c,
              )
          const h = o.top + l / 2,
            u = o.text.left + o.text.width / 2,
            p = (this._data.qty || this._data.text).text,
            _ = this._getTextYMidCorrection(t, p) * e
          ;(0, w.drawText)(
            t,
            e,
            this._data.text.text,
            u,
            h,
            _,
            this._data.text.textColor,
            (0, s.ensureNotNull)(this._font),
          )
        }
        _drawText(t, e, o, r, i, l, a) {
          const n = o.split('@').join('').toUpperCase(),
            d = this._getTextYMidCorrection(t, n) * e
          ;(0, w.drawText)(
            t,
            e,
            o,
            i,
            l,
            d,
            r,
            (0, s.ensureNotNull)(this._font),
            a,
          )
        }
        _drawUnderlinedText(t, e, o, r, i, l) {
          const a = this._getTextYMidCorrection(t, o) * e,
            n = this._getTextMetrics(t, o)
          ;(0, w.drawUnderlinedText)(
            t,
            e,
            o,
            i,
            l,
            a,
            r,
            (0, s.ensureNotNull)(this._font),
            n,
          )
        }
        _getTextYMidCorrection(t, e) {
          const o = t.font
          t.font = (0, s.ensureNotNull)(this._font)
          const r = this._textWidthCache.yMidCorrection(t, e)
          return (t.font = o), r
        }
        _getTextMetrics(t, e) {
          const o = t.font
          t.font = (0, s.ensureNotNull)(this._font)
          const r = this._textWidthCache.getMetrics(t, e)
          return (t.font = o), r
        }
        _drawCloseButton(t, e, o, r, i, l, a) {
          const n = (0, s.ensureDefined)(this._data.close)
          t.save(), (t.lineWidth = a), (t.strokeStyle = n.iconColor)
          const d = r + l,
            c = Math.max(1, Math.ceil(7 * e)),
            h = Math.round((i - c) / 2),
            u = Math.round((l - c) / 2)
          ;(0, P.drawPoly)(
            t,
            [new x.Point(o + h, r + u), new x.Point(o + h + c, d - u)],
            !0,
          ),
            (0, P.drawPoly)(
              t,
              [new x.Point(o + h + c, r + u), new x.Point(o + h, d - u)],
              !0,
            ),
            t.restore()
        }
        _initCtx() {
          const t = document.createElement('canvas')
          ;(t.width = 0),
            (t.height = 0),
            (this._ctxInternal = (0, s.ensureNotNull)(t.getContext('2d')))
        }
      }
      function O(t) {
        return Object.hasOwn(t, 'tp') && Object.hasOwn(t, 'sl')
      }
      class W extends I {
        constructor() {
          super(...arguments), (this._wasTPMoved = !1), (this._wasSLMoved = !1)
        }
        hitTest(t, e) {
          var o, r
          const i = e.pixelRatio,
            l = this.rectWithOffsets(e),
            a = Math.round(t.x * i),
            n = Math.round(t.y * i),
            d = a >= l.left,
            c = a <= l.right,
            h = d && c
          if (!(n >= l.top && n <= l.bottom) || !h) return null
          const u = {
            cursorType: M.PaneCursorType.Default,
            hideCrosshairLinesOnHover: !0,
            ...B({ id: this._data.id, part: 8 }),
            contextMenuHandler: this._data.callbacks.onContextMenu,
            touchContextMenuHandler: this._data.callbacks.onContextMenu,
          }
          if (this._data.disabled)
            return new g.HitTestResult(g.HitTarget.Custom, u)
          const p = Math.round(l.top / i),
            _ =
              void 0 !== this._data.callbacks.onMoveProjectionTP &&
              1 ===
                (null === (o = this._data.tp) || void 0 === o
                  ? void 0
                  : o.visibility)
          if (_ && a >= l.tp.left && a < l.tp.left + l.tp.width) {
            const t = Math.round(l.tp.left / i),
              e = Math.round(l.tp.width / i),
              o = (t) => {
                this._data.callbacks.onMoveProjectionTP &&
                  this._data.callbacks.onMoveProjectionTP(t),
                  (this._wasTPMoved = !0)
              },
              r = () => {
                this._wasTPMoved &&
                  this._data.callbacks.onFinishMoveTP &&
                  this._data.callbacks.onFinishMoveTP(),
                  (this._wasTPMoved = !1)
              }
            return new g.HitTestResult(g.HitTarget.Custom, {
              ...u,
              cursorType: M.PaneCursorType.Pointer,
              ...B({ id: (0, s.ensureDefined)(this._data.tp).id, part: 5 }),
              pressedMouseMoveHandler: o,
              touchMoveHandler: o,
              mouseUpHandler: r,
              touchEndHandler: r,
              cancelMoveHandler: this._data.callbacks.onCancelMove,
              tooltip: {
                extendMargin: !0,
                text: (0, s.ensureDefined)(this._data.tp).title,
                rect: { x: t, y: p, w: e, h: this._height },
              },
            })
          }
          const y = l.sl.left + l.sl.width,
            v =
              void 0 !== this._data.callbacks.onMoveProjectionSL &&
              1 ===
                (null === (r = this._data.sl) || void 0 === r
                  ? void 0
                  : r.visibility)
          if (v && a >= l.sl.left && a < y) {
            const t = Math.round(l.sl.width / i),
              e = Math.round(l.sl.left / i),
              o = Math.round(l.bottom / i),
              r = (t) => {
                this._data.callbacks.onMoveProjectionSL &&
                  this._data.callbacks.onMoveProjectionSL(t),
                  (this._wasSLMoved = !0)
              },
              a = () => {
                this._wasSLMoved &&
                  this._data.callbacks.onFinishMoveSL &&
                  this._data.callbacks.onFinishMoveSL(),
                  (this._wasSLMoved = !1)
              }
            let n, d
            const c = this._data.callbacks.onClickSL
            if (void 0 !== c) {
              const r = (r) => {
                const i = r.clientX - r.localX,
                  s = r.clientY - r.localY,
                  l = new x.Point(e + i, o + s)
                c((r) => r.x > e && r.x <= e + t && r.y > p && r.y <= o, l)
              }
              ;(n = r),
                (d = (t) => {
                  t.preventDefault(), r(t)
                })
            }
            return new g.HitTestResult(g.HitTarget.Custom, {
              ...u,
              cursorType: c
                ? M.PaneCursorType.Default
                : M.PaneCursorType.Pointer,
              ...B({ id: (0, s.ensureDefined)(this._data.sl).id, part: 6 }),
              pressedMouseMoveHandler: r,
              touchMoveHandler: r,
              mouseUpHandler: a,
              touchEndHandler: a,
              clickHandler: n,
              tapHandler: d,
              cancelMoveHandler: this._data.callbacks.onCancelMove,
              tooltip: {
                extendMargin: !0,
                text: (0, s.ensureDefined)(this._data.sl).title,
                rect: { x: e, y: p, w: t, h: this._height },
              },
            })
          }
          const m =
            y - l.body.left < 0
              ? a >= y && a < l.body.left
              : a >= l.body.right && a < l.tp.left
          if ((_ || v) && m) return new g.HitTestResult(g.HitTarget.Custom, u)
          if (
            this._hasConfirmButton() &&
            (0, s.ensureDefined)(this._data.confirm)
          ) {
            const t = l.confirm.left + l.confirm.width
            if (a >= l.confirm.left && a < t) {
              let t = {}
              if (void 0 !== this._data.callbacks.onMove) {
                const e = (t) => {
                    this._data.callbacks.onMove &&
                      this._data.callbacks.onMove(t),
                      (this._wasSourceMoved = !0)
                  },
                  o = () => {
                    this._wasSourceMoved &&
                      this._data.callbacks.onFinishMove &&
                      this._data.callbacks.onFinishMove(),
                      (this._wasSourceMoved = !1)
                  }
                t = {
                  pressedMouseMoveHandler: e,
                  touchMoveHandler: e,
                  mouseUpHandler: o,
                  touchEndHandler: o,
                  cancelMoveHandler: this._data.callbacks.onCancelMove,
                }
              }
              return new g.HitTestResult(g.HitTarget.Custom, {
                ...u,
                ...t,
                ...B({ id: this._data.id, part: 7 }),
                clickHandler: this._data.callbacks.onConfirm,
                tapHandler: this._data.callbacks.onConfirm,
              })
            }
            const o = this._calcConfirmRect(e.pixelRatio, l.borderWidth).offset
            if (
              t - l.body.left < 0
                ? a >= t && a < l.tp.left
                : a >= l.confirm.left - o && a < l.confirm.left
            )
              return new g.HitTestResult(g.HitTarget.Custom, u)
          }
          return super.hitTest(t, e)
        }
        draw(t, e) {
          if (
            (super.draw(t, e),
            !this._isDataVisibleInViewport(e) || !this._data.visible)
          )
            return
          const o = this.rectWithOffsets(e),
            r = o.bottom - o.top,
            i = o.yMid
          this._isTPSLVisible() &&
            (0 !== o.tp.width &&
              1 === (0, s.ensureDefined)(this._data.tp).visibility &&
              this._drawButton(t, e, r, o.borderRadius, i, o.tp, this._data.tp),
            0 !== o.sl.width &&
              1 === (0, s.ensureDefined)(this._data.sl).visibility &&
              this._drawButton(
                t,
                e,
                r,
                o.borderRadius,
                i,
                o.sl,
                this._data.sl,
              )),
            this._hasConfirmButton() &&
              this._drawButton(
                t,
                e,
                r,
                o.borderRadius,
                i,
                o.confirm,
                this._data.confirm,
              )
        }
        rect(t) {
          return super.rect(t)
        }
        rectWithOffsets(t) {
          return super.rectWithOffsets(t)
        }
        _calculateCacheRectWithOffsets(t) {
          let e = super._calculateCacheRectWithOffsets(t)
          return (
            (e = {
              ...e,
              tp: {
                ...e.tp,
                left: this._calcCoordinateWithOffset(
                  e.tp.left,
                  e.tp.left + e.tp.width,
                ).left,
              },
              sl: {
                ...e.sl,
                left: this._calcCoordinateWithOffset(
                  e.sl.left,
                  e.sl.left + e.sl.width,
                ).left,
              },
            }),
            void 0 !== e.confirm &&
              (e.confirm = {
                ...e.confirm,
                left: this._calcCoordinateWithOffset(
                  e.confirm.left,
                  e.confirm.left + e.confirm.width,
                ).left,
              }),
            e
          )
        }
        _calculateCacheRect(t) {
          const e = super._calculateCacheRect(t),
            o = this._calcTPSLRect(t.pixelRatio, e.borderWidth),
            r = this._calcConfirmRect(t.pixelRatio, e.borderWidth)
          let i = 0,
            s = 0
          const l =
            this._data.bodyAlignment === k.TradedGroupHorizontalAlignment.Left
          l
            ? ((s = e.body.right + o.offset),
              (i = s + o.tp - (o.tp > 0 ? e.borderWidth : 0)))
            : ((i = e.body.left - o.offset - o.sl),
              (s = i - (o.tp > 0 ? o.tp - e.borderWidth : 0)))
          let a = 0
          r.confirm > 0 &&
            (a = l
              ? i + o.sl + r.offset
              : s - r.confirm - r.offset - e.borderWidth)
          let n = a || s,
            d = e.right
          return (
            l && ((n = e.left), (d = a > 0 ? a + r.confirm : i + o.sl)),
            {
              ...e,
              left: n,
              right: d,
              tp: { width: o.tp, left: s },
              sl: { width: o.sl, left: i },
              confirm: { width: r.confirm, left: a },
            }
          )
        }
        _drawLine(t, e) {
          var o, r
          if (
            !this._data.callbacks.onFinishMoveSL &&
            !this._data.callbacks.onFinishMoveTP
          )
            return void super._drawLine(t, e)
          const i = e.pixelRatio,
            s = this.rectWithOffsets(e),
            l = Math.round(e.physicalWidth)
          if (
            (t.save(),
            (t.strokeStyle = this._data.line.color),
            (t.lineWidth = Math.max(
              1,
              Math.floor(this._data.line.thickness * i),
            )),
            (0, P.setLineStyle)(t, this._data.line.style),
            (0, P.drawHorizontalLine)(t, s.yMid, s.body.right, l),
            this._data.line.extend)
          )
            (0, P.drawHorizontalLine)(t, s.yMid, 0, s.body.left)
          else {
            const e =
                1 ===
                (null === (o = this._data.tp) || void 0 === o
                  ? void 0
                  : o.visibility),
              i =
                1 ===
                (null === (r = this._data.sl) || void 0 === r
                  ? void 0
                  : r.visibility)
            if (e || i) {
              const e = i ? s.sl.left + s.sl.width : s.tp.left + s.tp.width
              ;(0, P.drawHorizontalLine)(t, s.yMid, e, s.body.left)
            }
            if (this._hasConfirmButton()) {
              const e = s.confirm.left + s.confirm.width
              ;(0, P.drawHorizontalLine)(t, s.yMid, e, s.body.left)
            }
          }
          t.restore()
        }
        _calcAllWidth(t, e, o, r, i, s) {
          const l = super._calcAllWidth(t, e, o, r, i, s)
          if (!this._data.tp && !this._data.sl && !this._hasConfirmButton())
            return l
          const a = this._calcTPSLRect(t, s),
            n = this._calcConfirmRect(t, s)
          return l + a.tp + a.sl + a.offset + n.confirm + n.offset
        }
        _calcConfirmRect(t, e) {
          if (!this._hasConfirmButton()) return { confirm: 0, offset: 0 }
          const o = 2 * e,
            r = Math.round(11 * t),
            i = this._textWidth(
              this._ctxInternal,
              (0, s.ensureDefined)(this._data.confirm).text,
            )
          return {
            confirm: Math.round(i * t) + (i && o) + (i && r),
            offset: Math.round(10 * t),
          }
        }
        _calcTPSLRect(t, e) {
          const o = 2 * e,
            r = this._textWidth(
              this._ctxInternal,
              void 0 !== this._data.tp ? this._data.tp.text : '',
            ),
            i = Math.round(r * t) + (r && o),
            s = this._textWidth(
              this._ctxInternal,
              void 0 !== this._data.sl ? this._data.sl.text : '',
            ),
            l = Math.round(s * t) + (s && o)
          return {
            tp: i,
            sl: l,
            offset: l > 0 || i > 0 ? Math.round(10 * t) : 0,
          }
        }
        _drawButton(t, e, o, r, i, s, l) {
          if (void 0 === l) return
          const a = this.rectWithOffsets(e)
          ;(0, P.drawRoundRectWithInnerBorder)(
            t,
            s.left,
            a.top,
            s.width,
            o,
            l.backgroundColor,
            r,
          ),
            l.active.visible &&
              (0, P.drawRoundRectWithInnerBorder)(
                t,
                s.left,
                a.top,
                s.width,
                o,
                l.active.backgroundColor,
                r,
              )
          const n =
            l.active.visible && void 0 !== l.active.borderColor
              ? l.active.borderColor
              : l.borderColor
          ;(0, P.drawRoundRectWithInnerBorder)(
            t,
            s.left,
            a.top,
            s.width,
            o,
            'transparent',
            r,
            a.borderWidth,
            n,
            l.borderStyle,
          )
          const d = s.left + s.width / 2
          l.underlineText
            ? this._drawUnderlinedText(
                t,
                e.pixelRatio,
                l.text,
                l.textColor,
                d,
                i,
              )
            : this._drawText(t, e.pixelRatio, l.text, l.textColor, d, i)
        }
        _isTPSLVisible() {
          return Boolean(this._data.tp) || Boolean(this._data.sl)
        }
        _hasConfirmButton() {
          return Boolean(this._data.callbacks.onConfirm && this._data.confirm)
        }
      }
      class R extends I {
        constructor() {
          super(...arguments), (this._left = 0)
        }
        hitTest(t, e) {
          const o = e.pixelRatio,
            r = this.rectWithOffsets(e),
            i = Math.round(t.x * o),
            s = Math.round(t.y * o),
            l = i >= r.left,
            a = i <= r.right,
            n = l && a
          if (!(s >= r.top && s <= r.bottom) || !n) return null
          const d = {
            cursorType: M.PaneCursorType.Default,
            hideCrosshairLinesOnHover: !0,
            ...B({ id: this._data.id }),
          }
          return this._data.disabled
            ? new g.HitTestResult(g.HitTarget.Custom, d)
            : new g.HitTestResult(g.HitTarget.Custom, {
                ...d,
                ...B({ id: this._data.id, part: 8 }),
              })
        }
        applyOffset(t) {
          const e = (0, s.ensureDefined)(
            this._data.drawWithTPOffset
              ? t.projItemTpLeft
              : this._data.drawWithSLOffset
                ? t.projItemSlLeft
                : 0,
          )
          this._left !== e && ((this._left = e), this.clearCache())
        }
        _drawQtyWithBackground(t, e, o, r, i) {
          const l = (0, s.ensureDefined)(this._data.qty),
            a = o.top + (o.bottom - o.top) / 2,
            n = o.qty.left + o.qty.width / 2
          this._drawText(t, e, l.text, l.textColor, n, a)
        }
        _drawTextWithBackground(t, e, o, r, i) {
          const s = o.top + (o.bottom - o.top) / 2,
            l = o.text.left + o.text.width / 2
          this._drawText(
            t,
            e,
            this._data.text.text,
            this._data.text.textColor,
            l,
            s,
          )
        }
        _calculateCacheRect(t) {
          const e = t.pixelRatio
          let o = super._calculateCacheRect(t)
          const r = 2 * o.borderWidth,
            i = this._mainTextWidth(this._ctxInternal),
            s = this._quantityWidth(this._ctxInternal),
            l = Math.round(i * e + s * e) + (i && r) + (s && o.borderWidth),
            a = this._left + l
          return (
            (o = {
              ...o,
              left: this._left,
              right: a,
              body: { ...o.body, left: this._left, right: a },
              text: {
                left: this._left + o.qty.width + o.borderWidth,
                width: o.text.width,
                rightDividerWidth: 0,
              },
              qty: {
                left: this._left,
                width: o.qty.width,
                rightDividerWidth: o.qty.rightDividerWidth,
              },
            }),
            this._data.bodyAlignment !== k.TradedGroupHorizontalAlignment.Left
              ? o
              : {
                  ...o,
                  top: o.top,
                  bottom: o.bottom,
                  body: {
                    left:
                      o.body.left -
                      o.text.width -
                      Number(o.qty.rightDividerWidth) -
                      o.borderWidth,
                    right: o.qty.left + o.qty.width + o.borderWidth,
                  },
                  text: {
                    left:
                      o.body.left -
                      o.text.width -
                      Number(o.qty.rightDividerWidth),
                    width: o.text.width + Number(o.qty.rightDividerWidth),
                    rightDividerWidth: o.qty.rightDividerWidth,
                  },
                  qty: {
                    left: o.qty.left,
                    width: o.qty.width - Number(o.qty.rightDividerWidth),
                    rightDividerWidth: 0,
                  },
                }
          )
        }
        _calcAllWidth(t, e, o, r, i, s) {
          const l = 2 * s
          return Math.round(o * t) + (o && l)
        }
      }
      class H extends W {
        constructor() {
          super(...arguments), (this._bodyBorderRadius = 4)
        }
        hitTest(t, e) {
          const o = e.pixelRatio,
            r = this.rectWithOffsets(e),
            i = Math.round(t.x * o),
            l = Math.round(t.y * o),
            a = i >= r.left,
            n = i <= r.right,
            d = a && n,
            c = l >= r.top && l <= r.bottom,
            h = Math.round(r.top / o)
          if (!c || !d) return null
          const u = {
            cursorType: M.PaneCursorType.Default,
            hideCrosshairLinesOnHover: !0,
            ...B({ id: this._data.id, part: 8 }),
          }
          if (this._data.disabled)
            return new g.HitTestResult(g.HitTarget.Custom, u)
          const p =
            this._hasReverseButton() && (0, s.ensureDefined)(this._data.reverse)
          if (p && 1 === p.visibility) {
            const t = r.reverse.left + r.reverse.width
            if (i >= r.reverse.left && i < t) {
              const t = Math.round(r.reverse.left / o),
                e = Math.round(r.reverse.width / o)
              return new g.HitTestResult(g.HitTarget.Custom, {
                ...B({ id: this._data.id, part: 4 }),
                cursorType: M.PaneCursorType.Default,
                hideCrosshairLinesOnHover: !0,
                contextMenuHandler: this._data.callbacks.onContextMenu,
                touchContextMenuHandler: this._data.callbacks.onContextMenu,
                clickHandler: this._data.callbacks.onReverse,
                tapHandler: this._data.callbacks.onReverse,
                tooltip: {
                  text: p.title,
                  rect: { x: t, y: h, w: e, h: this._height },
                },
              })
            }
            const s = this._calcReverseRect(e.pixelRatio).offset
            if (
              t - r.body.left < 0
                ? i >= t && i < r.tp.left
                : i >= r.reverse.left - s && i < r.reverse.left
            )
              return new g.HitTestResult(g.HitTarget.Custom, u)
          }
          return super.hitTest(t, e)
        }
        draw(t, e) {
          if (
            (super.draw(t, e),
            !this._isReverseVisible() ||
              !this._isDataVisibleInViewport(e) ||
              !this._data.visible)
          )
            return
          const o = this.rectWithOffsets(e)
          this._drawReverseButton(
            t,
            e.pixelRatio,
            o.reverse.left,
            o.top,
            o.reverse.width,
            o.bottom - o.top,
            o.borderWidth,
            o.borderRadius,
          )
        }
        rect(t) {
          return super.rect(t)
        }
        rectWithOffsets(t) {
          return super.rectWithOffsets(t)
        }
        _calculateCacheRectWithOffsets(t) {
          const e = super._calculateCacheRectWithOffsets(t)
          return {
            ...e,
            reverse: {
              ...e.reverse,
              left: this._calcCoordinateWithOffset(
                e.reverse.left,
                e.reverse.left + e.reverse.width,
              ).left,
            },
          }
        }
        _calculateCacheRect(t) {
          var e
          const o = super._calculateCacheRect(t)
          if (
            !(null === (e = this._data) || void 0 === e
              ? void 0
              : e.callbacks.onReverse) ||
            !this._hasReverseButton()
          )
            return { ...o, reverse: { width: 0, left: 0 } }
          const r = this._calcReverseRect(t.pixelRatio),
            i =
              this._data.bodyAlignment ===
              k.TradedGroupHorizontalAlignment.Left,
            s = i ? o.right + r.offset : o.left - r.width - r.offset,
            l = i ? o.left : s,
            a = i ? s + r.width : o.right
          return {
            ...o,
            left: l,
            right: a,
            reverse: { width: r.width, left: s },
          }
        }
        _calcAllWidth(t, e, o, r, i, s) {
          var l
          const a = super._calcAllWidth(t, e, o, r, i, s)
          if (
            !(null === (l = this._data) || void 0 === l
              ? void 0
              : l.callbacks.onReverse) ||
            !this._hasReverseButton()
          )
            return a
          const n = this._calcReverseRect(t)
          return a + n.width + n.offset
        }
        _drawLine(t, e) {
          var o
          if (
            !(null === (o = this._data) || void 0 === o
              ? void 0
              : o.callbacks.onReverse)
          )
            return void super._drawLine(t, e)
          const r = e.pixelRatio,
            i = this.rectWithOffsets(e),
            s = Math.round(e.physicalWidth),
            l = i.reverse.left + i.reverse.width
          if (
            (t.save(),
            (t.strokeStyle = this._data.line.color),
            (t.lineWidth = Math.max(
              1,
              Math.floor(this._data.line.thickness * r),
            )),
            (0, P.setLineStyle)(t, this._data.line.style),
            (0, P.drawHorizontalLine)(t, i.yMid, i.body.right, s),
            this._isReverseVisible() &&
              (0, P.drawHorizontalLine)(t, i.yMid, l, i.body.left),
            this._data.line.extend)
          ) {
            const e = this._isReverseVisible() ? i.reverse.left : i.body.left
            ;(0, P.drawHorizontalLine)(t, i.yMid, 0, e)
          }
          t.restore()
        }
        _calcReverseRect(t) {
          return { width: Math.round(29 * t), offset: Math.round(10 * t) }
        }
        _drawReverseButton(t, e, o, r, i, l, a, n) {
          const d = (0, s.ensureDefined)(this._data.reverse),
            c = d.active
          t.save(),
            (0, P.drawRoundRectWithInnerBorder)(
              t,
              o,
              r,
              i,
              l,
              d.backgroundColor,
              n,
              a,
              this._data.borderColor,
            ),
            c.visible &&
              (0, P.drawRoundRectWithInnerBorder)(
                t,
                o,
                r,
                i,
                l,
                c.backgroundColor,
                n,
                a,
                'transparent',
              )
          const h = Math.round(3 * e),
            u = Math.round(3 * e),
            p = Math.round(9 * e),
            _ = Math.round(o + (i - h) / 2),
            y = Math.round(_ + h),
            v = r + a + Math.round((l - p) / 2 - a),
            m = v + p,
            f = d.iconColor
          ;(t.lineWidth = a),
            (0, w.drawHalfArrow)(t, _, v, f, !1, p, u),
            (0, w.drawHalfArrow)(t, y, m, f, !0, p, u),
            t.restore()
        }
        _isReverseVisible() {
          return (
            this._hasReverseButton() &&
            1 === (0, s.ensureDefined)(this._data.reverse).visibility
          )
        }
        _hasReverseButton() {
          return Boolean(this._data.callbacks.onReverse && this._data.reverse)
        }
      }
      class A {
        constructor(t, e) {
          ;(this._textWidthCache = new T.TextWidthCache()),
            (this._items = []),
            (this._minMainTextWidthCache = new Map()),
            (this._itemsRectsInfoCache = null),
            (this._font = (0, C.makeFont)(
              t,
              b.CHART_FONT_FAMILY,
              '',
              'normal',
            )),
            (this._tradedGroupRenderersController = e)
        }
        itemRenderers() {
          return this._items
        }
        clearCache() {
          ;(this._itemsRectsInfoCache = null),
            this._items.forEach((t) => t.clearCache())
        }
        clearTextCache() {
          this._textWidthCache.reset()
        }
        setData(t) {
          this._data = t
        }
        clearItems() {
          this._items = []
        }
        addItem(t) {
          const e = ((t, e, o, i) => {
            if (t.type === r.Position) return new H(t, e, o, i)
            if (t.type === r.WithBracketButtons) return new W(t, e, o, i)
            if (t.type === r.Projection) return new R(t, e, o, i)
            if (t.type === r.Default) return new I(t, e, o, i)
            throw new Error("Unknown traded item renderer's type")
          })(
            t,
            this._textWidthCache,
            (0, s.ensureNotNull)(this._font),
            this._minTextWidth.bind(this),
          )
          this._items.push(e)
        }
        applyHorizontalOffset(t, e) {
          if (null !== this._itemsRectsInfoCache) return
          const o = this._items
            .filter((t) => t.data().visible)
            .map((t) => t.rect(e))
          if (0 === o.length) return
          let r,
            i,
            s = 1 / 0,
            l = -1 / 0
          for (const t of o) {
            ;(s = Math.min(s, t.yMid)), (l = Math.max(l, t.yMid))
            O(t) && ((r = t.tp.left), (i = t.sl.left))
          }
          let a,
            n,
            d = t.rightmostBorder,
            c = t.leftmostBorder
          const h = d - c
          if (
            this._data.horizontalAlignment ===
            k.TradedGroupHorizontalAlignment.Left
          )
            d > e.physicalWidth &&
              (n = Math.max(e.physicalWidth - h, Math.round(12 * e.pixelRatio)))
          else if (c < 0) {
            const t = Math.round(12 * e.pixelRatio)
            a = e.physicalWidth - h > t ? h : e.physicalWidth - t
          }
          if (void 0 !== r && void 0 !== i) {
            if (void 0 !== n) {
              const t = c - n
              ;(r -= t), (i -= t)
            }
            if (void 0 !== a) {
              const t = a - d
              ;(r += t), (i += t)
            }
          }
          void 0 !== n && (c = n),
            void 0 !== a && (d = a),
            (this._itemsRectsInfoCache = {
              rightmostBorder: d,
              leftmostBorder: c,
              leftmostForItemOffset: n,
              rightmostForItemOffset: a,
              yMin: s,
              yMax: l,
              projItemTpLeft: r,
              projItemSlLeft: i,
            })
          for (const t of this._items) t.applyOffset(this._itemsRectsInfoCache)
        }
        hitTest(t, e) {
          var o
          if (!this._paneHasVisibleItems()) return null
          this._tradedGroupRenderersController.alignItems(e)
          for (let o = this._items.length - 1; o >= 0; o--) {
            const r = this._items[o].hitTest(t, e)
            if (null !== r) return r
          }
          return (
            null === (o = this._data) || void 0 === o
              ? void 0
              : o.disableNoOverlap
          )
            ? new g.HitTestResult(g.HitTarget.MovePointBackground, {
                clickHandler: this._data.disableNoOverlap,
                tapHandler: this._data.disableNoOverlap,
                contextMenuHandler: this._data.disableNoOverlap,
                touchContextMenuHandler: this._data.disableNoOverlap,
              })
            : null
        }
        drawBackground(t, e) {
          if (this._paneHasVisibleItems()) {
            this._tradedGroupRenderersController.alignItems(e)
            for (const o of this._items) o.drawBackground(t, e)
          }
        }
        draw(t, e) {
          var o, r, i, s
          if (!this._paneHasVisibleItems()) return
          this._tradedGroupRenderersController.alignItems(e)
          for (const o of this._items) o.drawLine(t, e)
          const l =
              null !==
                (r =
                  null === (o = this._itemsRectsInfoCache) || void 0 === o
                    ? void 0
                    : o.rightmostBorder) && void 0 !== r
                ? r
                : null,
            a =
              null !==
                (s =
                  null === (i = this._itemsRectsInfoCache) || void 0 === i
                    ? void 0
                    : i.leftmostBorder) && void 0 !== s
                ? s
                : null,
            n = Math.round(e.cssWidth * e.pixelRatio),
            d = Math.round(12 * e.pixelRatio),
            c =
              this._data.horizontalAlignment ===
              k.TradedGroupHorizontalAlignment.Left,
            h = c ? a : l,
            u = c ? -1 : 1
          if (null !== h && h + u * d <= n) {
            const o = c ? 0 : n,
              r = Math.round(this._data.rightPadding * e.pixelRatio),
              i = h + u * (Math.min(r, o - u * h) / 2)
            this._drawVertLine(t, e, i)
            for (const o of this._items) o.drawPointOnLine(t, e, i)
          }
          for (const o of this._items) o.draw(t, e)
        }
        clearMinTextWidthByItemId(t) {
          this._minMainTextWidthCache.has(t) &&
            this._minMainTextWidthCache.delete(t)
        }
        clearMinTextWidthCache() {
          this._minMainTextWidthCache.clear()
        }
        _minTextWidth(t, e) {
          var o
          if (!t.text.text) return 0
          e.save(), (e.font = (0, s.ensureNotNull)(this._font))
          const r = Math.ceil(this._textWidthCache.measureText(e, t.text.text)),
            i = this._minMainTextWidthCache.get(t.id)
          if (void 0 === i || r > i) {
            const o = Math.ceil(this._textWidthCache.measureText(e, '0'))
            this._minMainTextWidthCache.set(t.id, r + o)
          }
          return (
            e.restore(),
            null !== (o = this._minMainTextWidthCache.get(t.id)) && void 0 !== o
              ? o
              : 0
          )
        }
        _drawVertLine(t, e, o) {
          const r = this._data.vertLine
          if (
            null === r ||
            null === this._itemsRectsInfoCache ||
            this._itemsRectsInfoCache.yMax === this._itemsRectsInfoCache.yMin
          )
            return
          const i = e.pixelRatio
          ;(t.strokeStyle = r.color),
            (t.lineWidth = Math.max(1, Math.floor(r.thickness * i))),
            (0, P.setLineStyle)(t, r.style),
            (0, P.drawVerticalLine)(
              t,
              o,
              this._itemsRectsInfoCache.yMin,
              this._itemsRectsInfoCache.yMax,
            )
        }
        _paneHasVisibleItems() {
          return this._items.filter((t) => t.data().visible).length > 0
        }
      }
      var V = o(350299),
        j = o(150335),
        E = o(32240),
        N = o(710263),
        q = o(793361),
        F = o(74516)
      class G {
        constructor(t, e, o, r, i, s) {
          ;(this._item = t),
            (this._source = e),
            (this._chartModel = o),
            (this._mainItemStyle = r),
            (this._isNoOverlapMode = i.isNoOverlapMode),
            (this._displayMode = i.displayMode),
            (this._rightPadding = i.rightPadding),
            (this._groupLineColor = i.groupLineColor),
            (this._y = i.y),
            (this._externalCallbacks = s)
        }
        _isProfitLossHidden() {
          return 0 === this._displayMode
        }
        _isProfitLossShorten() {
          return 2 !== this._displayMode
        }
        _isCloseVisible() {
          return 0 !== this._displayMode
        }
        _minQtyWidth() {
          return 0 === this._displayMode ? 30 : 0
        }
        _isHoveredItem(t) {
          var e
          return (
            (null === (e = this._source.hoveredItem()) || void 0 === e
              ? void 0
              : e.id) === t.id()
          )
        }
        _isHoveredItemPart(t, e) {
          var o
          return (
            this._isHoveredItem(t) &&
            (null === (o = this._source.hoveredItem()) || void 0 === o
              ? void 0
              : o.part) === e
          )
        }
        _isSelectedItem(t) {
          var e
          return (
            (null === (e = this._source.selectedItem()) || void 0 === e
              ? void 0
              : e.id) === t.id()
          )
        }
        _isHoveredItemWithButtons(t) {
          if (!t) return !1
          const {
            takeProfit: e,
            stopLoss: o,
            trailingStop: r,
          } = (0, F.bracketsByType)(this._source.items().projectionBrackets)
          return (
            this._isHoveredItem(t) ||
            Boolean(e && this._isHoveredItem(e)) ||
            Boolean(o && this._isHoveredItem(o)) ||
            Boolean(r && this._isHoveredItem(r))
          )
        }
        _isHoveredStopItemStopLimit() {
          const t = this._source.items().main,
            e = this._source.items().stopLimit
          return (
            !!(t && e && (0, p.isLimitPartStopLimitOrderItem)(e)) &&
            this._isHoveredItem(t)
          )
        }
        _isActiveSource() {
          return this._source.isHovered() || this._source.isSelected()
        }
        _itemWithButtons() {
          if (!this._isNoOverlapMode) return this._source.baseItem()
        }
        _projectionBracketsForItem(t) {
          return t !== this._itemWithButtons()
            ? []
            : this._source.items().projectionBrackets
        }
        _renderDataForTPSLButtons(t) {
          if (t !== this._itemWithButtons()) return {}
          const e = {
              borderStyle: this._source.isPlaced()
                ? t.lineStyle()
                : (0, s.ensureDefined)(this._source.mainItem()).lineStyle(),
            },
            o = {},
            {
              takeProfit: r,
              stopLoss: i,
              trailingStop: l,
            } = (0, F.bracketsByType)(this._source.items().projectionBrackets)
          if (r) {
            const t = null === r.price(),
              i = this._isHoveredItemPart(r, 5),
              s = (0, m.getDefaultStyleForOrderItem)(
                r,
                this._source,
                () => this._chartModel.dark().value(),
                e,
              )
            o.tp = {
              id: r.id(),
              visibility: t && this._isMainButtonsVisible() ? 1 : 0,
              text: r.qtyText(),
              title: r.tooltip(),
              underlineText: !1,
              textColor: t ? s.text.buttonTextColor : s.text.textColor,
              backgroundColor: s.text.backgroundColor,
              borderColor: s.borderColor,
              borderStyle: s.borderStyle,
              active: { visible: i, backgroundColor: s.text.backgroundColor },
            }
          }
          const a = i || l
          if (a) {
            const t = null === a.price(),
              r = this._isHoveredItemPart(a, 6),
              i = (0, m.getDefaultStyleForOrderItem)(
                a,
                this._source,
                () => this._chartModel.dark().value(),
                e,
              ),
              s = (0, E.generateColor)(i.borderColor, 85)
            o.sl = {
              id: a.id(),
              visibility: t && this._isMainButtonsVisible() ? 1 : 0,
              text: a.qtyText(),
              title: a.tooltip(),
              underlineText: this._source.isTrailingStopSupported(),
              textColor: t ? i.text.buttonTextColor : i.text.textColor,
              backgroundColor: i.text.backgroundColor,
              borderColor: i.borderColor,
              borderStyle: i.borderStyle,
              active: {
                visible: r,
                backgroundColor: this._source.isTrailingStopSupported()
                  ? s
                  : i.text.backgroundColor,
              },
            }
          }
          return o
        }
        _renderDataForLine(t) {
          return {
            drawOnTop: this._isActiveSource() && !this._isNoOverlapMode,
            thickness: this._source.lineWidth(),
            style: t.lineStyle,
            color: t.lineColor,
            extend: this._source.isLineExtended(),
          }
        }
        _renderDataForQty(t, e) {
          return {
            text:
              ((o = this._item.qtyText()),
              null === o
                ? '0'
                : ((0, j.isNumber)(o) && o < 0 && (o = `− ${Math.abs(o)}`),
                  (0, N.forceLTRStr)((0, q.splitThousands)(o, ' ')))),
            minTextWidth: this._minQtyWidth(),
            textColor: t.textColor,
            backgroundColor: t.backgroundColor,
            dividerColor: t.dividerColor,
            isDividerVisible: !0,
            active: {
              visible: this._isHoveredItemPart(this._item, 1),
              backgroundColor: e,
            },
          }
          var o
        }
        _renderDataForText(t, e) {
          return {
            text: this._isProfitLossHidden()
              ? ''
              : this._item.profitLossText(this._isProfitLossShorten()),
            textColor: t.textColor,
            backgroundColor: t.backgroundColor,
            dividerColor: t.dividerColor,
            active: {
              visible: this._isHoveredItemPart(this._item, 2),
              backgroundColor: e,
            },
          }
        }
        _renderDataForPoint() {
          const {
              takeProfit: t,
              stopLoss: e,
              trailingStop: o,
            } = (0, F.bracketsByType)(this._source.items().projectionBrackets),
            r = e || o,
            i = this._item === this._itemWithButtons(),
            s = i && t && null === t.price() && this._isHoveredItem(t),
            l = i && r && null === r.price() && this._isHoveredItem(r),
            a =
              this._isHoveredItem(this._item) || s || l
                ? this._mainItemStyle.pointShadowColor
                : void 0
          return {
            visible: this._isActiveSource(),
            backgroundColor: this._isSelectedItem(this._item)
              ? this._groupLineColor
              : this._mainItemStyle.pointBackgroundColor,
            borderStyle: ot,
            borderColor: this._groupLineColor,
            shadowColor: a,
          }
        }
        _renderDataForClose(t, e) {
          if (this._item.supportClose() && this._isCloseVisible())
            return {
              backgroundColor: t.backgroundColor,
              iconColor: t.iconColor,
              active: {
                visible: this._isHoveredItemPart(this._item, 3),
                backgroundColor: e,
              },
            }
        }
        _renderDataForConfirm() {
          if (
            this._item !== this._itemWithConfirmButton() ||
            !this._isMainButtonsVisible()
          )
            return
          ;(0, s.assert)((0, u.isOrderLikeItem)(this._item))
          const t = (0, m.getDefaultStyleForOrderItem)(
              this._item,
              this._source,
              () => this._chartModel.dark().value(),
            ),
            e = (0, s.ensureDefined)(t.confirm),
            o = this._isHoveredItemPart(this._item, 7),
            r = !this._source.hasError(),
            i = r ? e.backgroundColor : e.disableBackgroundColor,
            l = r
              ? (0, s.ensureDefined)(e.borderColor)
              : e.disableBackgroundColor,
            a = r ? e.textColor : e.disableTextColor
          return {
            text: this._confirmButtonText(),
            textColor: a,
            backgroundColor: i,
            borderColor: l,
            borderStyle: v.LineStyle.Solid,
            active: {
              visible: o && r,
              backgroundColor: e.activeColor,
              borderColor: e.activeColor,
            },
          }
        }
        _renderDataGeneral(t) {
          let e = 0
          const o = this._item.price()
          if (null !== o) {
            e =
              (this._chartModel.mainSeries().priceScale().isInverted()
                ? -1
                : 1) * o
          }
          return {
            y: this._y,
            visible: this._item.isVisible(),
            sortingIndex: e,
            id: this._item.id(),
            disabled: this._source.disabled(),
            borderBackgroundColor: this._borderBackgroundColor(t),
            borderColor: t.borderColor,
            borderStyle: t.borderStyle,
            bodyAlignment: this._source.horizontalAlignment(),
            rightPadding: this._rightPadding,
          }
        }
        _callbacks(t = []) {
          const e = {},
            o = { label: `[${this._modeGaLabel()}]` }
          this._item.hasContextMenu() &&
            (e.onContextMenu = (t) => this._item.onContextMenu(t, o))
          const {
              takeProfit: r,
              stopLoss: i,
              trailingStop: s,
            } = (0, F.bracketsByType)(t),
            l = i || s
          return (
            (e.onCancelMove = () => {
              var t, e, o
              return (
                null !==
                  (o =
                    null === (e = (t = this._source).cancelMove) || void 0 === e
                      ? void 0
                      : e.call(t)) &&
                void 0 !== o &&
                o
              )
            }),
            r &&
              ((e.onMoveProjectionTP = (t) => this._source.onMove(r.id(), t)),
              (e.onFinishMoveTP = () =>
                this._source.onFinishMoveProjectionBracket(r.id(), {
                  ...o,
                  event: 'Add bracket from button',
                }))),
            l &&
              ((e.onMoveProjectionSL = (t) => this._source.onMove(l.id(), t)),
              (e.onFinishMoveSL = () =>
                this._source.onFinishMoveProjectionBracket(l.id(), {
                  ...o,
                  event: 'Add bracket from button',
                })),
              this._source.isTrailingStopSupported() &&
                (e.onClickSL = (t, e) => l.toggleType(t, e, o))),
            this._isNoOverlapMode &&
              (e.allInteractionsHandler = () =>
                this._externalCallbacks.setNoOverlapMode(!1)),
            this._isMainButtonsVisible() &&
              (e.onConfirm = () => this._source.onConfirm(this._item.id(), o)),
            e
          )
        }
        _isMainButtonsVisible() {
          return (
            (!this._source.isPlaced() && this._source.isActiveSource()) ||
            this._isHoveredItemWithButtons(this._item) ||
            this._isHoveredStopItemStopLimit() ||
            this._source.isSelected()
          )
        }
        _borderBackgroundColor(t) {
          return t.borderStyle === v.LineStyle.Solid
            ? 'transparent'
            : t.borderBackgroundColor
        }
        _modeGaLabel() {
          switch (this._displayMode) {
            case 2:
              return 'Standard view'
            case 1:
              return 'Medium view'
            case 0:
              return 'Minimal view'
          }
        }
        _confirmButtonText() {
          return this._item.confirmText(2 !== this._displayMode)
        }
        _itemWithConfirmButton() {
          if (
            !this._source.isPlaced() &&
            !this._source.isConfirmButtonOnDomWidget()
          )
            return this._itemWithButtons()
        }
      }
      const z = (0, V.appendEllipsis)(l.t(null, void 0, o(911810))),
        Q = l.t(null, void 0, o(419780)),
        $ = l.t(null, void 0, o(437431))
      class U extends G {
        rendererData() {
          const t = (0, f.getDefaultStyleForPositionItem)(
            this._item.isBuyDirection(),
            this._source.isBlocked(),
            () => this._chartModel.dark().value(),
            this._item.lineStyle(),
          )
          let e
          const o = this._renderDataForClose(t.close, t.close.activeColor)
          return (
            void 0 !== o && (e = { ...o, title: $ }),
            {
              type: r.Position,
              ...this._renderDataGeneral(t),
              ...this._renderDataForTPSLButtons(this._item),
              callbacks: this._callbacks(
                this._projectionBracketsForItem(this._item),
              ),
              line: this._renderDataForLine(t),
              qty: {
                ...this._renderDataForQty(t.qty, t.qty.activeColor),
                title: z,
              },
              text: {
                ...this._renderDataForText(t.text, t.qty.activeColor),
                title: '',
                textColor: this._item.profitLossTextColor(),
                active: { visible: !1, backgroundColor: t.qty.activeColor },
              },
              point: this._renderDataForPoint(),
              close: e,
              reverse: this._renderDataForReverse(t.reverse),
            }
          )
        }
        _callbacks(t = []) {
          const e = super._callbacks(t),
            o = { label: `[${this._modeGaLabel()}]` }
          return (
            this._item.supportClose() &&
              this._isCloseVisible() &&
              (e.onClose = () => this._item.onClose(o)),
            this._shouldReverseShown() &&
              (e.onReverse = () => this._item.onReverse(o)),
            this._item.supportModify() &&
              (e.onModify = () => this._item.onModify(o)),
            e
          )
        }
        _renderDataForReverse(t) {
          if (!this._shouldReverseShown()) return
          const e =
            this._isHoveredItemWithButtons(this._item) ||
            this._source.isSelected()
          return {
            title: Q,
            visibility: e ? 1 : 0,
            backgroundColor: t.backgroundColor,
            iconColor: t.iconColor,
            active: {
              visible: this._isHoveredItemPart(this._item, 4),
              backgroundColor: t.activeColor,
            },
          }
        }
        _shouldReverseShown() {
          return (
            this._item.supportReverse() &&
            this._source.isReverseVisible() &&
            this._isReverseVisible()
          )
        }
        _isReverseVisible() {
          return 2 === this._displayMode && !this._isNoOverlapMode
        }
      }
      const Y = l.t(null, void 0, o(137172)),
        K = l.t(null, void 0, o(316075))
      class X extends G {
        rendererData() {
          const t = this._item === this._itemWithButtons(),
            e = (0, m.getDefaultStyleForOrderItem)(
              this._item,
              this._source,
              () => this._chartModel.dark().value(),
            ),
            o = (0, E.generateColor)(e.borderColor, 85)
          let i
          const s = this._renderDataForClose(e.close, o)
          return (
            void 0 !== s && (i = { ...s, title: K }),
            {
              type: t ? r.WithBracketButtons : r.Default,
              ...this._renderDataGeneral(e),
              ...this._renderDataForTPSLButtons(this._item),
              callbacks: this._callbacks(
                this._projectionBracketsForItem(this._item),
              ),
              line: this._renderDataForLine(e),
              qty: { ...this._renderDataForQty(e.qty, o), title: Y },
              text: {
                ...this._renderDataForText(e.text, o),
                title: this._item.profitLossTooltip(),
              },
              point: this._renderDataForPoint(),
              close: i,
              confirm: this._renderDataForConfirm(),
            }
          )
        }
        _callbacks(t = []) {
          const e = this._source,
            o = super._callbacks(t),
            r = { label: `[${this._modeGaLabel()}]` }
          return (
            this._item.isMovingEnabled() &&
              !this._isNoOverlapMode &&
              ((o.onMove = (t) => e.onMove(this._item.id(), t)),
              (o.onFinishMove = () => e.onFinishMove(this._item.id(), r))),
            this._item.supportModify() &&
              (o.onModify = () => this._item.onModify(r)),
            this._item.supportClose() &&
              this._isCloseVisible() &&
              (o.onClose = () => this._item.onClose(r)),
            this._item.canQtyCalcModify() &&
              (o.onQtyModify = (t, e) => this._item.toggleQtyModify(t, e, r)),
            o
          )
        }
      }
      class Z extends X {
        constructor(t, e, o, r, i, s) {
          super(t, e, o, r, i, s), (this._source = e)
        }
        _callbacks(t = []) {
          const e = super._callbacks(t),
            o = { label: `[${this._modeGaLabel()}]` }
          return (
            this._item.supportClose() &&
              this._isCloseVisible() &&
              (e.onClose = async () => this._source.onClose(o)),
            this._isNoOverlapMode ||
              (this._item.isMovingEnabled() &&
                ((e.onMove = (t) => this._source.onMove(this._item.id(), t)),
                (e.onFinishMove = () =>
                  this._source.onFinishMove(this._item.id(), o))),
              this._item.canSwitchType() &&
                (e.onText = (t, e) => this._item.toggleType(t, e, o))),
            e
          )
        }
      }
      class J extends G {
        rendererData() {
          const t = (0, m.getDefaultStyleForOrderItem)(
              this._item,
              this._source,
              () => this._chartModel.dark().value(),
            ),
            e = (0, E.generateColor)(t.borderColor, 85)
          return {
            type: r.Projection,
            ...this._renderDataGeneral(t),
            drawWithTPOffset:
              this._item.bracketType() === d.BracketType.TakeProfit,
            drawWithSLOffset:
              this._item.bracketType() === d.BracketType.StopLoss ||
              this._item.bracketType() === d.BracketType.TrailingStop,
            callbacks: this._callbacks(),
            line: this._renderDataForLine(t),
            qty: this._renderDataForQty(t.qty, e),
            text: {
              ...this._renderDataForText(t.text, e),
              title: this._item.profitLossText(),
              active: { visible: !1, backgroundColor: t.qty.activeColor },
            },
            point: this._renderDataForPoint(),
            close: this._renderDataForClose(t.close, t.close.activeColor),
          }
        }
      }
      function tt(t, e, o, r, i, s) {
        if ((0, p.isPositionItem)(t)) return new U(t, e, o, r, i, s)
        if ((0, p.isPreOrderItem)(t)) return new Z(t, e, o, r, i, s)
        if ((0, p.isProjectionBracketItem)(t)) return new J(t, e, o, r, i, s)
        if ((0, u.isOrderLikeItem)(t)) return new X(t, e, o, r, i, s)
        throw new Error('Unknown traded item type')
      }
      var et
      !((t) => {
        ;(t[(t.Large = 380)] = 'Large'), (t[(t.Small = 280)] = 'Small')
      })(et || (et = {}))
      const ot = v.LineStyle.Solid
      class rt {
        constructor(t, e, o) {
          ;(this._prevItemTokens = new Map()),
            (this._displayMode = 2),
            (this._invalidated = !0),
            (this._chartModel = t),
            (this._source = e),
            (this._tradedGroupRenderersController = o),
            (this._showOrderProperty = e.showOrderProperty()),
            (this._showPositionProperty = e.showPositionProperty()),
            (this._renderer = new A(13, this._tradedGroupRenderersController)),
            this._tradedGroupRenderersController.registerRenderer(
              this._renderer,
            ),
            this._source
              .positionDisplayMode()
              .subscribe(this._renderer, this._renderer.clearMinTextWidthCache),
            this._source
              .bracketsDisplayMode()
              .subscribe(this._renderer, this._renderer.clearMinTextWidthCache)
        }
        destroy() {
          this._tradedGroupRenderersController.removeRenderer(this._renderer),
            this._source
              .positionDisplayMode()
              .unsubscribe(
                this._renderer,
                this._renderer.clearMinTextWidthCache,
              ),
            this._source
              .bracketsDisplayMode()
              .unsubscribe(
                this._renderer,
                this._renderer.clearMinTextWidthCache,
              )
        }
        update() {
          this._invalidated = !0
        }
        makeSureIsUpdated(t, e) {
          if (this._invalidated) {
            const t = this._displayMode
            this._calculateMode(e),
              t !== this._displayMode &&
                this._renderer.clearMinTextWidthCache(),
              this._tradedGroupRenderersController.invalidateCache(),
              this._updateImpl(),
              (this._invalidated = !1)
          }
        }
        renderer(t, e) {
          return this._renderer
        }
        priceToCoordinate(t) {
          if (null === t) return null
          const e = this._chartModel.mainSeries(),
            o = e.firstValue()
          return null === o ? null : e.priceScale().priceToCoordinate(t, o)
        }
        _calculateMode(t) {
          if (!y.enabled('adaptive_trading_sources')) return
          const e = t < et.Large ? (t < et.Small ? 0 : 1) : 2
          this._displayMode = e
        }
        _mainItemStyle() {
          const t = this._source.mainItem()
          return void 0 === t
            ? (0, m.getStyleForOppositeDirection)(
                this._source.items().brackets[0],
                this._source,
                () => this._chartModel.dark().value(),
              )
            : (0, u.isPositionLikeItem)(t)
              ? (0, f.getDefaultStyleForPositionItem)(
                  t.isBuyDirection(),
                  this._source.isBlocked(),
                  () => this._chartModel.dark().value(),
                  t.lineStyle(),
                )
              : ((0, s.assert)(
                  (0, u.isOrderLikeItem)(t),
                  'Unexpected traded item type',
                ),
                (0, m.getDefaultStyleForOrderItem)(t, this._source, () =>
                  this._chartModel.dark().value(),
                ))
        }
        _rightPadding() {
          return 2 !== this._displayMode ? 40 : 64
        }
        _sortedItems() {
          var t, e, o
          const r = [],
            i = this._source.items()
          let s = null,
            l = null,
            a = null
          const n = i.brackets.slice()
          if (
            (n.push(...i.projectionBrackets),
            void 0 !== i.stopLimit && n.push(i.stopLimit),
            void 0 !== i.main && n.push(i.main),
            this._tradedGroupRenderersController.isNoOverlapMode())
          )
            return n
          for (const i of n)
            (null === (t = this._source.movingItem()) || void 0 === t
              ? void 0
              : t.id) === i.id()
              ? (a = i)
              : (null === (e = this._source.hoveredItem()) || void 0 === e
                    ? void 0
                    : e.id) === i.id()
                ? (l = i)
                : (null === (o = this._source.selectedItem()) || void 0 === o
                      ? void 0
                      : o.id) === i.id()
                  ? (s = i)
                  : r.push(i)
          return (
            null !== s && r.push(s),
            null !== l && r.push(l),
            null !== a && r.push(a),
            r
          )
        }
        _updateImpl() {
          if (
            (this._renderer.clearItems(),
            (!this._showOrderProperty.value() &&
              !this._showPositionProperty.value()) ||
              this._isNoData())
          )
            return
          const t = this._mainItemStyle(),
            e = this._source.isSelected(),
            o =
              e && this._source.isHoveredOtherTradedGroup()
                ? (0, s.ensureDefined)(t.disabledLineColor)
                : t.lineColor,
            r = this._rightPadding(),
            i = {
              vertLine: null,
              horizontalAlignment: this._source.horizontalAlignment(),
              rightPadding: r,
            }
          ;(this._source.isHovered() || e) &&
            (i.vertLine = {
              thickness: this._source.lineWidth(),
              style: ot,
              color: o,
            }),
            this._tradedGroupRenderersController.isNoOverlapMode() &&
              (i.disableNoOverlap = () =>
                this._tradedGroupRenderersController.setNoOverlapMode(!1)),
            this._renderer.setData(i)
          const l = new Map()
          for (const e of this._sortedItems()) {
            const i = this.priceToCoordinate(e.price())
            if (null === i) continue
            const s = tt(
              e,
              this._source,
              this._chartModel,
              t,
              {
                isNoOverlapMode:
                  this._tradedGroupRenderersController.isNoOverlapMode(),
                displayMode: this._displayMode,
                rightPadding: r,
                groupLineColor: o,
                y: i,
              },
              {
                setNoOverlapMode: (t) =>
                  this._tradedGroupRenderersController.setNoOverlapMode(t),
              },
            ).rendererData()
            this._renderer.addItem(s),
              l.set(`${s.id} ${e.isBuyDirection()}`, s.id)
          }
          this._prevItemTokens.forEach((t, e) => {
            l.has(e) || this._renderer.clearMinTextWidthByItemId(t)
          }),
            (this._prevItemTokens = l)
        }
        _isNoData() {
          const t = this._source.items()
          return (
            void 0 === t.main &&
            void 0 === t.stopLimit &&
            0 === t.brackets.length
          )
        }
      }
      var it = o(630432)
      class st extends it.PriceAxisView {
        constructor(t, e, o, r) {
          super(),
            (this._model = t),
            (this._data = e),
            (this._priceScaleFormatter = o),
            (this._styleGetter = r)
        }
        itemId() {
          return this._data.id()
        }
        _updateRendererData(t, e, o) {
          if (((t.visible = !1), !this._data.isVisible())) return
          const r = this._model.mainSeries(),
            i = r.priceScale(),
            s = r.firstValue()
          if (null === s) return
          const l = this._data.price()
          if (null === l) return
          const a = this._styleGetter()
          ;(o.background = a.qty.backgroundColor),
            (o.borderColor = a.labelBorderVisible ? a.borderColor : void 0),
            (o.borderStyle = a.labelBorderVisible ? a.borderStyle : void 0),
            (o.textColor = a.qty.textColor),
            (o.coordinate = i.priceToCoordinate(l, s)),
            (t.borderVisible = a.labelBorderVisible),
            (t.text = this._formatPrice(l)),
            (t.tickColor = a.labelTickColor),
            (t.visible = !0)
        }
        _formatPrice(t) {
          return this._priceScaleFormatter().format(
            t,
            void 0,
            void 0,
            void 0,
            void 0,
            false,
          )
        }
      }
      var lt = o(377884)
      class at extends lt.PriceLineAxisView {
        constructor(t, e, o, r, i, s, l) {
          super(),
            (this._chartModel = t),
            (this._data = e),
            (this._source = o),
            (this._showProperty = s),
            (this._height = r),
            (this._verticalPadding = i),
            (this._styleGetter = l)
        }
        itemId() {
          return this._data.id()
        }
        _value() {
          const t = this._chartModel.mainSeries(),
            e = t.firstValue(),
            o = this._data.price()
          if (null === o || null === e) return { noData: !0 }
          const r = t.priceScale().priceToCoordinate(o, e)
          return {
            noData: !1,
            floatCoordinate: r,
            coordinate: r,
            color: '',
            formattedPricePercentage: '',
            formattedPriceAbsolute: '',
            formattedPriceIndexedTo100: '',
            text: '',
            index: 0,
          }
        }
        _updateRendererData(t, e, o) {
          const r = this._styleGetter()
          ;(t.linestyle = r.lineStyle),
            (o.additionalPaddingTop = this._verticalPadding),
            (o.additionalPaddingBottom = this._verticalPadding),
            super._updateRendererData(t, e, o)
        }
        _priceLineColor(t) {
          return this._styleGetter().lineColor
        }
        _lineWidth() {
          return this._source.lineWidth()
        }
        _lineStyle() {
          return this._styleGetter().lineStyle
        }
        _backgroundAreaHeight() {
          return this._height
        }
        _isVisible() {
          return this._showProperty.value()
        }
      }
      function nt(t, e, o) {
        if ((0, p.isPositionItem)(o)) {
          const r = () =>
            (0, f.getDefaultStyleForPositionItem)(
              o.isBuyDirection(),
              e.isBlocked(),
              () => t.dark().value(),
              o.lineStyle(),
            )
          return {
            priceAxisView: new st(t, o, () => e.priceScaleFormatter(), r),
            priceLineAxisView: new at(
              t,
              o,
              e,
              19,
              0,
              e.showPositionProperty(),
              r,
            ),
          }
        }
        ;(0, s.assert)((0, u.isOrderLikeItem)(o), 'Unexpected traded item type')
        const r = () =>
          (0, m.getDefaultStyleForOrderItem)(o, e, () => t.dark().value())
        return {
          priceAxisView: new st(t, o, () => e.priceScaleFormatter(), r),
          priceLineAxisView: new at(t, o, e, 17, 1, e.showOrderProperty(), r),
        }
      }
      class dt {
        constructor(t, e) {
          ;(this._model = t), (this._source = e)
        }
        updateAllViews(t) {
          void 0 !== this._views.main &&
            (this._views.main.priceAxisView.update(t),
            this._views.main.priceLineAxisView.update(t)),
            void 0 !== this._views.stopLimit &&
              (this._views.stopLimit.priceAxisView.update(t),
              this._views.stopLimit.priceLineAxisView.update(t))
          for (const e of this._views.brackets)
            e.priceAxisView.update(t), e.priceLineAxisView.update(t)
          for (const e of this._views.project.brackets)
            e.priceAxisView.update(t), e.priceLineAxisView.update(t)
        }
        views(t, e) {
          const o = this._source.movingItem() || null,
            r = this._source.hoveredItem() || null,
            i = this._source.selectedItem() || null,
            s = null !== o ? o.id : null,
            l = null !== r ? r.id : null,
            a = null !== i ? i.id : null,
            n = [],
            d = []
          let c = null,
            h = null,
            u = null,
            p = null,
            _ = null,
            y = null
          const v = this._views.brackets.slice()
          v.push(...this._views.project.brackets),
            this._views.main && v.push(this._views.main),
            this._views.stopLimit && v.push(this._views.stopLimit)
          for (const t of v)
            t.priceAxisView.itemId() === s
              ? ((c = t.priceAxisView), (h = t.priceLineAxisView))
              : t.priceAxisView.itemId() === l
                ? ((u = t.priceAxisView), (p = t.priceLineAxisView))
                : t.priceAxisView.itemId() === a
                  ? ((_ = t.priceAxisView), (y = t.priceLineAxisView))
                  : (n.push(t.priceAxisView), d.push(t.priceLineAxisView))
          return (
            null !== _ && null !== y && (n.push(_), d.push(y)),
            null !== u && null !== p && (n.push(u), d.push(p)),
            null !== c && null !== h && (n.push(c), d.push(h)),
            [n, d]
          )
        }
        recreateViews() {
          const t = this._source.items(),
            e = t.projectionBrackets
              .filter((t) => null !== t.price())
              .map((t) => nt(this._model, this._source, t))
          ;(this._views = {
            brackets: t.brackets.map((t) => nt(this._model, this._source, t)),
            project: { brackets: e },
          }),
            void 0 !== t.main &&
              (this._views.main = nt(this._model, this._source, t.main)),
            void 0 !== t.stopLimit &&
              (this._views.stopLimit = nt(
                this._model,
                this._source,
                t.stopLimit,
              ))
        }
      }
      var ct = o(764533),
        ht = o(966949)
      function ut(t) {
        return t instanceof vt
      }
      const pt = l.t(null, void 0, o(619397)),
        _t = l.t(null, void 0, o(360538))
      function yt(t) {
        return (
          void 0 !== t &&
          ((0, u.isOrderItemRawData)(t) || (0, u.isPreOrderItemRawData)(t)) &&
          4 === t.type
        )
      }
      class vt extends a.CustomSourceBase {
        constructor(t, e, o, r, i, s, l, a, n) {
          super(t, e),
            (this._hadBeenModifiedAllItems = !1),
            (this._isDestroyed = !1),
            (this._bracketStopType = c.StopType.StopLoss),
            (this._items = { brackets: [], projectionBrackets: [] }),
            (this._blockedData = null),
            (this._isBlocked = !1),
            (this._mainSeries = e.mainSeries()),
            (this._properties = o),
            (this._globalVisibility = r),
            this._globalVisibility.subscribe(this.redraw.bind(this)),
            (this._callbacks = s),
            (this._symbolDataProvider = l),
            this._symbolDataProvider.onUpdate().subscribe(this, () => {
              this._updateProjectionBracketsItems(),
                this.items(!0).forEach((t) => {
                  t.fireProfitLossChange()
                }),
                this.redraw()
            }),
            (this._qtySuggester = a),
            (this._paneView = new rt(this._model, this, n)),
            (this._tradedGroupRenderersController = n),
            (this._priceViewsGroup = new dt(this._model, this)),
            (this._rawDataSpawn = i.spawn()),
            this._rawDataSpawn.subscribe(this._setData.bind(this)),
            this._properties.positionPL.visibility.subscribe(this, this.redraw),
            this._properties.bracketsPL.visibility.subscribe(this, this.redraw),
            this._properties.positionPL.display.subscribe(this, () => {
              this.redraw()
            }),
            this._properties.bracketsPL.display.subscribe(this, () => {
              this.redraw()
            }),
            this._tradedGroupRenderersController
              .noOverlapModeChanged()
              .subscribe(this.redraw.bind(this)),
            this._properties.showPositions.subscribe(this, () => {
              this._tradedGroupRenderersController.setNoOverlapMode(!1)
            }),
            this._properties.showOrders.subscribe(this, () => {
              this._tradedGroupRenderersController.setNoOverlapMode(!1)
            }),
            this._model
              .mainSeries()
              .dataEvents()
              .symbolResolved()
              .subscribe(this, () => {
                this._tradedGroupRenderersController.setNoOverlapMode(!1)
              }),
            this._model.onSelectedSourceChanged().subscribe(this, () => {
              this._model
                .selection()
                .allSources()
                .filter((t) => !ut(t)).length > 0 &&
                this._tradedGroupRenderersController.setNoOverlapMode(!1)
            }),
            this._model.hoveredSourceChanged().subscribe(this, () => {
              if (!this._symbolDataProvider.isActualSymbol()) return
              const t = this._model.hoveredSource()
              ;(null === t || (t !== this && ut(t))) && this.redraw()
            })
        }
        destroy() {
          var t, e
          this._properties.showOrders.destroy(),
            this._properties.showPositions.destroy(),
            this._properties.positionPL.visibility.unsubscribeAll(this),
            this._properties.positionPL.display.unsubscribeAll(this),
            this._properties.bracketsPL.visibility.unsubscribeAll(this),
            this._properties.bracketsPL.display.unsubscribeAll(this),
            this._model
              .mainSeries()
              .dataEvents()
              .symbolResolved()
              .unsubscribeAll(this),
            this._rawDataSpawn.destroy(),
            null === (t = this._items.main) || void 0 === t || t.destroy(),
            null === (e = this._items.stopLimit) || void 0 === e || e.destroy(),
            this._items.brackets.forEach((t) => t.destroy()),
            this._items.projectionBrackets.forEach((t) => t.destroy()),
            this._globalVisibility.unsubscribe(),
            this._paneView.destroy(),
            this._symbolDataProvider.onUpdate().unsubscribeAll(this),
            this._symbolDataProvider.destroy(),
            (this._isDestroyed = !0)
        }
        isSelectionEnabled() {
          return !0
        }
        priceScaleFormatter() {
          return this._mainSeries.formatter()
        }
        showPositionProperty() {
          return this._properties.showPositions
        }
        showOrderProperty() {
          return this._properties.showOrders
        }
        bracketStopType() {
          return this._bracketStopType
        }
        setBracketStopType(t) {
          ;(this._bracketStopType = t),
            this._updateProjectionBracketsItems(!0),
            this.redraw()
        }
        isTrailingStopSupported() {
          const t = this.items().main
          return (
            void 0 !== t &&
            Boolean(t.data().supportTrailingStop) &&
            ((0, p.isPositionItem)(t)
              ? this._symbolDataProvider.supportPositionBrackets()
              : this._symbolDataProvider.supportOrderBrackets())
          )
        }
        isReverseVisible() {
          return this._properties.showReverse.value()
        }
        lineWidth() {
          return this._properties.lineProperties.width.value()
        }
        lineStyle() {
          return this._properties.lineProperties.style.value()
        }
        isLineExtended() {
          return this._properties.lineProperties.extend.value()
        }
        isPositionPLVisible() {
          return this._properties.positionPL.visibility
        }
        positionDisplayMode() {
          return this._properties.positionPL.display
        }
        isBracketsPLVisible() {
          return this._properties.bracketsPL.visibility
        }
        bracketsDisplayMode() {
          return this._properties.bracketsPL.display
        }
        horizontalAlignment() {
          return this._properties.horizontalAlignment.value()
        }
        isBlocked() {
          return this._isBlocked
        }
        disabled() {
          return this.isBlocked()
        }
        hasError() {
          return !1
        }
        isConfirmButtonOnDomWidget() {
          return !1
        }
        setIsBlocked(t) {
          ;(this._isBlocked = t), this.redraw()
        }
        isHovered() {
          return this._model.hoveredSource() === this
        }
        isHoveredOtherTradedGroup() {
          return !this.isHovered() && ut(this._model.hoveredSource())
        }
        isSelected() {
          return this._model.selection().isSelected(this)
        }
        items(t, e) {
          if (t) {
            const t = []
            return (
              this._items.stopLimit &&
                !(null == e ? void 0 : e.exceptStopLimit) &&
                t.push(this._items.stopLimit),
              this._items.main &&
                !(null == e ? void 0 : e.exceptMain) &&
                t.push(this._items.main),
              (null == e ? void 0 : e.exceptBrackets) ||
                t.push(...this._items.brackets),
              (null == e ? void 0 : e.exceptProjection) ||
                t.push(...this._items.projectionBrackets),
              t
            )
          }
          return this._items
        }
        baseItem() {
          var t
          return null !== (t = this._items.stopLimit) && void 0 !== t
            ? t
            : this._items.main
        }
        findItem(t) {
          const e = this.items(!0).find((e) => e.id() === t)
          return (
            (0, s.assert)(
              void 0 !== e,
              `Traded item with id ${t} is not found`,
            ),
            e
          )
        }
        findItemWithType(t, e) {
          const o =
            e === h.TradedItemType.Position
              ? p.isPositionItem
              : u.isOrderLikeItem
          return this.items(!0, { exceptStopLimit: !0 }).find(
            (e) => o(e) && e.data().id === t,
          )
        }
        movingItem() {
          const t =
            (this._model.customSourceBeingMoved() === this &&
              this._model.customSourceMovingHitTestData()) ||
            null
          return null === t || void 0 === t.activeItem ? null : t.activeItem
        }
        hoveredItem() {
          const t =
            (this._model.hoveredSource() === this &&
              this._model.lastHittestData()) ||
            null
          return null === t || void 0 === t.activeItem ? null : t.activeItem
        }
        selectedItem() {
          const t =
            (this._model.selection().isSelected(this) &&
              this._model.lastSelectedHittestData()) ||
            null
          return null === t || void 0 === t.activeItem ? null : t.activeItem
        }
        priceScale() {
          return this._mainSeries.priceScale()
        }
        updateAllViews() {
          this._paneView.update(),
            this._priceViewsGroup.updateAllViews(
              (0, n.sourceChangeEvent)(this.id()),
            )
        }
        updateViewsForPane(t) {
          this._isSourceShouldBeShownOnPane(t) && this.updateAllViews()
        }
        paneViews(t) {
          return this._isSourceShouldBeShownOnPane(t) ? [this._paneView] : []
        }
        priceAxisViews(t, e) {
          if (!this._isSourceShouldBeShownOnPane(t)) return []
          const [o, r] = this._priceViewsGroup.views(t, e)
          return t.findTargetPriceAxisViews(this, e, o, r)
        }
        redraw() {
          this.updateAllViews(),
            this._isSourceShouldBeShown() && this._model.updateSource(this)
        }
        syncData() {
          this._isDestroyed ||
            (null !== this._blockedData
              ? (this._setData(this._blockedData), (this._blockedData = null))
              : this._setData(this._rawDataSpawn.value()))
        }
        allItemsSupportMove(t) {
          if (void 0 === this._items.main) return !1
          for (const t of this._items.projectionBrackets)
            if (null !== t.price()) return !1
          return (
            !(t.length < 2) &&
            t.every((t) => (0, u.isOrderLikeItem)(t) && t.isMovingEnabled())
          )
        }
        onMove(t, e, o = !1) {
          const r = this.findItem(t),
            i = r.price(),
            l = this.items(!0)
          if (
            (o && this.setIsBlocked(!0),
            e.shiftKey && null !== r.price() && this.allItemsSupportMove(l))
          ) {
            this._hadBeenModifiedAllItems = !0
            const t = (0, s.ensureNotNull)(r.calcPriceDiff(e))
            l.forEach((e) => {
              ;(0, p.isProjectionBracketItem)(e) || e.applyPriceDiff(t)
            }),
              this._callbacks.hideChartHint()
          } else r.onMove(e), this._moveOtherProjectionBracketIfNeeded(r)
          null === i &&
            null !== r.price() &&
            this._priceViewsGroup.recreateViews(),
            this.redraw()
        }
        _updateStopLimit(t) {
          const e = this._items.main,
            o = this._items.stopLimit
          yt(t.main) && void 0 === o
            ? (this._items.stopLimit = this._createStopLimitItem(t, e))
            : yt(t.main) && void 0 !== o
              ? o.setData(this._dataForStopLimitOrder(t.main))
              : void 0 !== o &&
                (this._convertStopLimitOrderToMainItem(t.main, o),
                this._deleteStopLimitItem())
        }
        _positionVisibilityGetter() {
          return (
            this._isSourceShouldBeShown() && this.showPositionProperty().value()
          )
        }
        _orderVisibilityGetter() {
          return (
            this._isSourceShouldBeShown() && this.showOrderProperty().value()
          )
        }
        _setData(t, e = !0) {
          var o, r, l, a
          if (this.isBlocked())
            (this._blockedData = t),
              (0, p.isPositionItem)(this._items.main) &&
                void 0 !== t.main &&
                ((0, s.assert)((0, u.isPositionItemRawData)(t.main)),
                this._items.main.setData(t.main))
          else {
            const s =
              null !==
                (a =
                  null !==
                    (r =
                      null === (o = t.main) || void 0 === o
                        ? void 0
                        : o.symbol) && void 0 !== r
                    ? r
                    : null === (l = t.brackets[0]) || void 0 === l
                      ? void 0
                      : l.symbol) && void 0 !== a
                ? a
                : null
            ;(t = (0, i.default)(t)),
              e ? this._updateItems(t) : this._createItems(t),
              this._updateProjectionBracketsItems(),
              this._priceViewsGroup.recreateViews(),
              this._symbolDataProvider.start(s)
          }
          this.redraw()
        }
        _processedBracketData(t) {
          return t
        }
        _createStopLimitItem(t, e) {
          let o
          if (
            void 0 !== t.main &&
            ((0, u.isOrderItemRawData)(t.main) ||
              (0, u.isPreOrderItemRawData)(t.main)) &&
            ((0, p.isOrderItem)(e) || (0, p.isPreOrderItem)(e)) &&
            4 === e.type()
          ) {
            const e = this._dataForStopLimitOrder(t.main)
            o = (0, _.createItem)(
              _.TradedGroupItemType.LimitPartStopLimitOrder,
              e,
              this,
              this._model,
              {
                itemExternalServices: {
                  symbolDataProvider: this._symbolDataProvider,
                  qtySuggester: this._qtySuggester,
                  tradedGroupRenderersController:
                    this._tradedGroupRenderersController,
                },
                visibilityGetters: {
                  order: this._orderVisibilityGetter.bind(this),
                  position: this._positionVisibilityGetter.bind(this),
                },
                sourceCallbacks: this._callbacks,
              },
            )
          }
          return o
        }
        _deleteStopLimitItem() {
          var t
          null === (t = this._items.stopLimit) || void 0 === t || t.destroy(),
            delete this._items.stopLimit
        }
        _isSourceShouldBeShown() {
          return (
            !!this._globalVisibility.value() &&
            !!this._symbolDataProvider.isActualSymbol() &&
            !(
              window.TradingView.printing &&
              !(0, ht.isTradingObjVisibleOnScreenshot)()
            )
          )
        }
        _getToggleStopTypeMenuHandler() {
          const t = [{ title: pt, value: c.StopType.StopLoss }]
          return (
            this.isTrailingStopSupported() &&
              t.push({ title: _t, value: c.StopType.TrailingStop }),
            (e, o, r, i, s) => {
              var l
              const a = this.mainItem()
              if (e) {
                const t =
                  a && (0, p.isPositionItem)(a)
                    ? 'Chart Position'
                    : 'Chart Order'
                this._callbacks.trackEvent(
                  t,
                  'Stop loss type menu opening',
                  null !== (l = r.label) && void 0 !== l ? l : '',
                )
              }
              if (t.length > 1) {
                const r = this._model.timeScale(),
                  l = [
                    r.onScroll(),
                    r.barSpacingChanged(),
                    this._mainSeries.onSymbolIntervalChanged(),
                  ]
                ;(0, ct.updateDropdownMenu)(
                  e,
                  o,
                  t,
                  this._bracketStopType,
                  'Stop bracket type',
                  l,
                  (t) => this.setBracketStopType(t),
                  i,
                  s,
                )
              }
            }
          )
        }
        _moveOtherProjectionBracketIfNeeded(t) {
          const e = this._items.main
          if (
            !(0, p.isProjectionBracketItem)(t) ||
            void 0 === e ||
            !e.supportOnlyPairBrackets() ||
            this._items.projectionBrackets.length < 2
          )
            return
          const o = (0, s.ensureNotNull)(e.price()),
            r = (0, s.ensureNotNull)(t.price()) - o,
            i = this._items.projectionBrackets.find((e) => e !== t)
          ;(0, s.ensureDefined)(i).setPrice(o - r)
        }
        _createItems(t) {
          const e = this._createMainItem(t),
            o = this._createStopLimitItem(t, e)
          this._items = {
            main: e,
            stopLimit: o,
            brackets: t.brackets.map((t) => this._createBracketItem(t)),
            projectionBrackets: [],
          }
        }
        _updateItems(t) {
          void 0 === this._items.main && void 0 !== t.main
            ? (this._items.main = this._createMainItem(t))
            : void 0 !== this._items.main && void 0 !== t.main
              ? this._updateMainItem(t.main)
              : void 0 !== this._items.main &&
                void 0 === t.main &&
                this._deleteMainItem(),
            this._updateStopLimit(t),
            this._updateBrackets(t.brackets)
        }
        _updateBrackets(t) {
          const e = []
          this._items.brackets.forEach((o) => {
            const r = t.findIndex((t) => t.id === o.data().id)
            ;-1 !== r
              ? (o.setData(this._processedBracketData(t[r])), t.splice(r, 1))
              : e.push(o)
          }),
            e.forEach((t) => {
              const e = this._items.brackets.findIndex(
                (e) => e.data().id === t.data().id,
              )
              ;-1 !== e &&
                (this._items.brackets[e].destroy(),
                this._items.brackets.splice(e, 1))
            }),
            t.forEach((t) => {
              const e = this._createBracketItem(t)
              this._items.brackets.push(e)
            })
        }
        _updateProjectionBracketsItems(t = !1) {
          const e = this._items.main
          if (void 0 === e || !e.supportBrackets()) return
          const {
              takeProfit: o,
              stopLoss: r,
              trailingStop: i,
            } = (0, F.bracketsByType)(this._items.brackets),
            s = null != r ? r : i,
            {
              takeProfit: l,
              stopLoss: a,
              trailingStop: n,
            } = (0, F.bracketsByType)(this._items.projectionBrackets),
            h = null != a ? a : n
          ;[
            [o, l],
            [s, h],
          ].forEach(([t, e]) => {
            if (t && e) {
              const t = this._items.projectionBrackets.indexOf(e)
              this._items.projectionBrackets[t].destroy(),
                this._items.projectionBrackets.splice(t, 1)
            }
          })
          const u = e.data()
          if (!o && !l) {
            const t = (0, F.buildProjectionBracketData)(
                'ProjectionBracket',
                d.BracketType.TakeProfit,
                u,
              ),
              e = (0, _.createItem)(
                _.TradedGroupItemType.ProjectionBracket,
                t,
                this,
                this._model,
                {
                  itemExternalServices: {
                    symbolDataProvider: this._symbolDataProvider,
                    qtySuggester: this._qtySuggester,
                    tradedGroupRenderersController:
                      this._tradedGroupRenderersController,
                  },
                  visibilityGetters: {
                    order: this._orderVisibilityGetter.bind(this),
                    position: this._positionVisibilityGetter.bind(this),
                  },
                  sourceCallbacks: this._callbacks,
                },
              )
            this._items.projectionBrackets.push(e)
          }
          if ((!s && !h) || t) {
            const t =
                this._bracketStopType === c.StopType.StopLoss
                  ? d.BracketType.StopLoss
                  : d.BracketType.TrailingStop,
              e = (0, F.buildProjectionBracketData)('ProjectionBracket', t, u)
            if (h) h.setData(e)
            else {
              const t = {
                itemExternalServices: {
                  symbolDataProvider: this._symbolDataProvider,
                  qtySuggester: this._qtySuggester,
                  tradedGroupRenderersController:
                    this._tradedGroupRenderersController,
                },
                visibilityGetters: {
                  order: this._orderVisibilityGetter.bind(this),
                  position: this._positionVisibilityGetter.bind(this),
                },
                sourceCallbacks: this._callbacks,
              }
              0
              const o = (0, _.createItem)(
                _.TradedGroupItemType.ProjectionBracket,
                e,
                this,
                this._model,
                t,
              )
              this._items.projectionBrackets.push(o)
            }
          }
        }
        _deleteMainItem() {
          ;(0, s.ensureDefined)(this._items.main).destroy(),
            delete this._items.main,
            this._deleteStopLimitItem()
        }
        _isSourceShouldBeShownOnPane(t) {
          return t.containsMainSeries()
        }
      }
    },
    735415: (t, e, o) => {
      o.d(e, { BaseItem: () => b, plSign: () => y })
      var r = o(650151),
        i = o(609838),
        s = o(793361),
        l = o(372605),
        a = o(466052),
        n = o(648067),
        d = o(247905),
        c = o(424030),
        h = o(710263),
        u = o(694454),
        p = o(656846),
        _ = o(943778)
      function y(t, e) {
        return `${t > 0 ? '+' : t < 0 ? '−' : ''}${e ? ' ' : ''}`
      }
      const v = {
          integerFormatter: new c.NumericFormatter(0),
          oneDecimalFormatter: new c.NumericFormatter(1),
          twoDecimalFormatter: new c.NumericFormatter(2),
        },
        m = i.t(null, void 0, o(618156)),
        f = i.t(null, void 0, o(392553))
      class b {
        constructor(t, e, o, r, i, s, l) {
          ;(this._contextMenu = null),
            (this._profitLossChanged = new a.Delegate()),
            (this._mainSeries = o),
            (this._source = e),
            (this._symbolDataProvider = r),
            (this._gaOrigin = i),
            (this._infoGetters = s),
            (this._itemCommands = l),
            this.setData(t)
        }
        destroy() {
          var t, e, o
          null === (t = this._formatPlWV) || void 0 === t || t.destroy(),
            null === (e = this._plColorWV) || void 0 === e || e.destroy(),
            this._profitLossChanged.destroy(),
            null === (o = this._contextMenu) || void 0 === o || o.hide()
        }
        data() {
          return this._data
        }
        price() {
          return this._data.price
        }
        setData(t) {
          this._data = (0, l.clone)(t)
        }
        priceText() {
          return (0, r.ensureNotNull)(
            this._symbolDataProvider.symbolData(),
          ).priceFormatter.format((0, r.ensureNotNull)(this.price()))
        }
        supportOnlyPairBrackets() {
          return !1
        }
        plColorWV() {
          return (
            void 0 === this._plColorWV &&
              (this._plColorWV = (0, n.createWVFromGetterAndSubscription)(
                () => this.profitLossTextColor(),
                this._profitLossChanged,
              )),
            this._plColorWV
          )
        }
        formatPlWV() {
          return (
            void 0 === this._formatPlWV &&
              (this._formatPlWV = (0, n.createWVFromGetterAndSubscription)(
                () => this.profitLossText(),
                this._profitLossChanged,
              )),
            this._formatPlWV
          )
        }
        hasContextMenu() {
          return this.supportModify() || this.supportClose()
        }
        useMinTickFormatter() {
          return !0
        }
        isBuyDirection() {
          return 1 === this._data.side
        }
        isVisible() {
          return this._infoGetters.visibility()
        }
        fireProfitLossChange() {
          this._profitLossChanged.fire()
        }
        profitLossText(t) {
          if (!this._data) return ''
          const e = this._potentialProfitLoss()
          if (null === e) return ''
          let o
          switch (this._infoGetters.displayMode.value()) {
            case d.PlDisplay.Money:
              o = this.moneyText(e, !0)
              break
            case d.PlDisplay.Pips:
              o = this.pipsText(e, !0)
              break
            case d.PlDisplay.Percentage:
              o = this.percentageText(e, !0)
          }
          return (0, h.startWithLTR)(o)
        }
        percentageText(t, e) {
          var o
          const r = y(t, e),
            i = this._source.baseItem(),
            l =
              null !== (o = null == i ? void 0 : i.price()) && void 0 !== o
                ? o
                : null
          if (null === l) return ''
          const a = ((100 * t) / l) * this._data.side
          return `${r}${(0, s.splitThousands)(v.twoDecimalFormatter.format(Math.abs(a)), ' ')}%`
        }
        moneyText(t, e) {
          const o = this._symbolDataProvider.pipValue()
          if (
            null === o ||
            (0, l.isNaN)(o.sellPipValue) ||
            (0, l.isNaN)(o.buyPipValue)
          )
            return ''
          const i = y(t, e),
            s = (0, r.ensureNotNull)(this._symbolDataProvider.symbolData()),
            a = (t / (s.pipSize || s.minTick)) * this._data.side,
            n = this.isBuyDirection() ? o.buyPipValue : o.sellPipValue,
            d = Math.abs(
              (0, _.pipsToRiskInCurrency)(
                a,
                this._data.qty,
                n,
                s.priceMagnifier,
                s.lotSize,
              ),
            )
          return `${i}${v.twoDecimalFormatter.format(d)} ${this.currency()}`
        }
        pipsText(t, e) {
          const l = y(t, e),
            a = (0, r.ensureNotNull)(this._symbolDataProvider.symbolData()),
            n =
              isFinite(a.pipSize) && a.pipSize !== a.minTick
                ? v.oneDecimalFormatter
                : v.integerFormatter,
            d =
              Number.parseFloat(n.format(t / (a.pipSize || a.minTick))) *
              this._data.side
          switch (this._symbolDataProvider.pipValueType()) {
            case p.PipValueType.Pips:
              return `${l}${i.t(null, { plural: '{pips} pips', count: Math.abs(d) }, o(777772)).replace('{pips}', (0, s.splitThousands)(Math.abs(d).toFixed(1), ' '))}`
            case p.PipValueType.Ticks:
              return `${l}${i.t(null, { plural: '{ticks} ticks', count: Math.abs(d) }, o(564225)).replace('{ticks}', (0, s.splitThousands)(Math.abs(d).toFixed(0), ' '))}`
          }
          return ''
        }
        tryBasePlOnLast() {
          return !1
        }
        lineStyle() {
          return u.LineStyle.Solid
        }
        confirmText(t) {
          const e = 1 === this._data.side ? m : f
          return t ? e : `${e} ${this.qtyText()} @ ${this.priceText()}`
        }
        _trackEventGA(t) {
          const { origin: e = this._gaOrigin, event: o, label: i } = t
          ;(0, r.assert)(!!o, "GA Event shouldn' be empty"),
            this._itemCommands.trackEvent(e, o, i)
        }
        _quantityText(t) {
          return (0, r.ensureNotNull)(
            this._symbolDataProvider.symbolData(),
          ).quantityFormatter.format(t)
        }
      }
    },
    182665: (t, e, o) => {
      o.d(e, { OrderBaseItem: () => S })
      var r = o(609838),
        i = o(350299),
        s = o(650151),
        l = o(150335),
        a = o(86441),
        n = o(372605),
        d = o(973602),
        c = o(694454),
        h = o(807107),
        u = o(247905),
        p = o(397728),
        _ = o(656846),
        y = o(282729),
        v = o(637401),
        m = o(113211),
        f = o(781585)
      var b = o(690839),
        C = o(11933),
        g = o(74516),
        P = o(735415)
      const k = (0, i.appendEllipsis)(r.t(null, void 0, o(305806))),
        T = r.t(null, void 0, o(709498)),
        x = r.t(null, void 0, o(555937)),
        M = r.t(null, void 0, o(937385))
      class S extends P.BaseItem {
        constructor(t, e, o, r, i, l, a, n = 'Chart Order') {
          super(t, e, o, r, n, i, l),
            (this._inEdit = !1),
            (this._isQtyModifyOpened = !1),
            (this._handleQtyModifyClose = (t, e) => {
              t(e)
                ? this.applyQty(this.data().qty)
                : this._handleQtyModifyDestroy()
            }),
            (this._handleQtyModifyDestroy = () => {
              this.applyQty(this.data().qty),
                (this._isQtyModifyOpened = !1),
                this._closeQtyCalc()
            }),
            this._isBracket() &&
              this._source
                .bracketsDisplayMode()
                .subscribe(this, this.fireProfitLossChange),
            a &&
              ((this._qtyModifyCallbacks = {
                onQtyApplyHandler: a.onQtyApplyHandler,
                onToggleQtyCalcHandler: a.onToggleQtyCalcHandler,
                qtyInfoGetter: a.qtyInfoGetter,
              }),
              (this._qtyProvider = a.qtyProvider),
              (this._suggestedQty = this._qtyProvider.suggestedQty().spawn()),
              this._suggestedQty.subscribe(
                (0, s.ensureDefined)(
                  this._qtyModifyCallbacks.onQtyApplyHandler,
                ),
              ))
        }
        destroy() {
          var t, e
          ;(this._isQtyModifyOpened = !1),
            this._closeQtyCalc(),
            this._source
              .bracketsDisplayMode()
              .unsubscribe(this, this.fireProfitLossChange),
            null === (t = this._contextMenu) || void 0 === t || t.hide(),
            null === (e = this._suggestedQty) || void 0 === e || e.destroy(),
            super.destroy()
        }
        supportBrackets() {
          return (
            !this._isBracket() &&
            this._symbolDataProvider.supportOrderBrackets()
          )
        }
        canQtyCalcModify() {
          return Boolean(this._qtyProvider)
        }
        toggleQtyModify(t, e, o = {}) {
          this.canQtyCalcModify() &&
            ((this._isQtyModifyOpened = !this._isQtyModifyOpened),
            this._toggleQtyCalc(t, e, o))
        }
        modifyQty(t) {
          this.canQtyCalcModify() &&
            (0, s.ensureDefined)(this._qtyModifyCallbacks).onQtyApplyHandler(t)
        }
        applyQty(t) {
          var e
          this.modifyQty(t),
            null === (e = this._qtyProvider) ||
              void 0 === e ||
              e.applySuggestedQty(this._data.qty)
        }
        currency() {
          var t
          return null !== (t = this._symbolDataProvider.orderCurrency()) &&
            void 0 !== t
            ? t
            : ''
        }
        canSwitchType() {
          return !1
        }
        id() {
          return this._id
        }
        setData(t) {
          this._inEdit ||
            (super.setData(t),
            this.fireProfitLossChange(),
            (this._id = this._calcId()))
        }
        setInEdit(t) {
          this._inEdit = t
        }
        type() {
          return this._data.type
        }
        bracketType() {
          return this._isBracket() ? (0, g.getBracketType)(this._data) : null
        }
        qty() {
          return this._data.qty
        }
        profitLossText(t) {
          var e
          return this._data &&
            this._isBracket() &&
            (null === (e = this._source.isBracketsPLVisible()) || void 0 === e
              ? void 0
              : e.value()) &&
            this.bracketType() !== _.BracketType.TrailingStop
            ? super.profitLossText(t)
            : this._bracketTypeText(t)
        }
        profitLossTextColor() {
          if (!this._data) return ''
          const t = this.style()
          if (!this._isBracket()) return t.text.textColor
          const e = this._potentialProfitLoss()
          return null === e
            ? t.text.textColor
            : (0, p.profitLossTextColor)(t, e, !1)
        }
        profitLossTooltip() {
          var t
          const e = this._source.mainItem(),
            o = null == e ? void 0 : e.price()
          if (null == o || !this._isBracket()) return ''
          const r = this._potentialProfitLoss()
          if (null === r) return `${this._bracketTypeText()}`
          if (
            !(null === (t = this._source.isBracketsPLVisible()) || void 0 === t
              ? void 0
              : t.value()) ||
            this.bracketType() === _.BracketType.TrailingStop
          )
            return ''
          switch (this._infoGetters.displayMode.value()) {
            case u.PlDisplay.Money:
              return `${this._bracketTypeText()} ${this.percentageText(r)} ${this.pipsText(r)}`
            case u.PlDisplay.Percentage:
              return `${this._bracketTypeText()} ${this.moneyText(r)} ${this.pipsText(r)}`
            case u.PlDisplay.Pips:
              return `${this._bracketTypeText()} ${this.moneyText(r)} ${this.percentageText(r)}`
            default:
              return `${this._bracketTypeText()} ${this.pipsText(r)} ${this.percentageText(r)} ${this.moneyText(r)}`
          }
        }
        lineStyle() {
          return this.isWorking() ? c.LineStyle.Solid : c.LineStyle.Dotted
        }
        calcPriceDiff(t) {
          const e = new a.Point(t.localX, t.localY),
            o = this._mainSeries.priceScale(),
            r = this._mainSeries.firstValue()
          if (null === r) return null
          const i = (0, s.ensureNotNull)(this.price())
          return o.coordinateToPrice(e.y, r) - i
        }
        applyPriceDiff(t) {
          ;(this._inEdit = !0), (this._data.price = this._calcPriceByDiff(t))
        }
        onMove(t) {
          const e = this.calcPriceDiff(t)
          null !== e &&
            (this.applyPriceDiff(e),
            t.isTouch &&
              (0, s.ensureDefined)(this._itemCommands.exitTrackingMode)())
        }
        async onFinishMove(t = {}, e = {}, o = !0, r, i = !0) {
          var l, a, d
          o && this._source.setIsBlocked(!0)
          const c = (0, n.clone)(this._data),
            h = (0, s.ensureNotNull)(this.price())
          ;(c.limitPrice =
            null !== (l = e.limitPrice) && void 0 !== l ? l : c.limitPrice),
            (c.takeProfit =
              null !== (a = e.takeProfit) && void 0 !== a ? a : c.takeProfit),
            (c.stopLoss =
              null !== (d = e.stopLoss) && void 0 !== d ? d : c.stopLoss),
            c.stopPrice
              ? (c.stopPrice = h)
              : c.limitPrice && (c.limitPrice = h),
            this._addTrailingStopPipsData(c, e.trailingStop),
            this._trackEventGA(t)
          const u = await this._onFinishMoveOrder(c, r, i)
          return (this._inEdit = !1), u
        }
        hasContextMenu() {
          return super.hasContextMenu() || this.isMovingEnabled()
        }
        async onContextMenu(t, e) {
          this.fireProfitLossChange(),
            (e = (0, C.mergeGaParams)(e, {
              origin: 'Chart Order Context Menu',
            }))
          const o = this._composeContextMenuActions(e),
            r = {
              side: (0, v.sideToText)(this._data.side),
              qty: this.qtyText(),
              price: this.priceText(),
              orderType: (0, v.orderTypeToText)({ orderType: this._data.type }),
              formatPlWV: this._isBracket() ? this.formatPlWV() : void 0,
            },
            i = await (async (t, e) => {
              const o = [],
                r = await (0, f.createContextMenuTitle)('Trading.OrderTitle', e)
              r && o.push(r)
              for (const { actionId: e, label: r, onExecute: i } of t)
                o.push(
                  new d.Action({
                    actionId: e,
                    options: { label: r, onExecute: i },
                  }),
                )
              return o
            })(o, r),
            s = this._infoGetters.noOverlapAction(e, (t) =>
              this._trackEventGA(t),
            )
          s && (i.push(new d.Separator()), i.push(s)),
            (this._contextMenu = await (0, f.showContextMenu)(
              i,
              t,
              () => {
                this._contextMenu = null
              },
              { detail: { type: 'order', id: this.id().toString() } },
            ))
        }
        _composeContextMenuActions(t) {
          const e = []
          return (
            this.supportModify() &&
              e.push({
                actionId: 'Trading.EditOrder',
                label: this._source.isPlaced() ? k : M,
                onExecute: () => this.onModify(t),
              }),
            this.supportClose() &&
              e.push({
                actionId: 'Trading.CancelOrder',
                label: this._source.isPlaced() ? T : x,
                onExecute: () => this.onClose(t),
              }),
            e
          )
        }
        _calcPriceByDiff(t) {
          const { minTick: e, variableMinTickData: o } = (0, s.ensureNotNull)(
              this._symbolDataProvider.symbolData(),
            ),
            r = t + (0, s.ensureNotNull)(this.price()),
            i = (0, h.getMinTick)({
              minTick: e,
              price: r,
              variableMinTickData: o,
            })
          return (0, l.fixComputationError)(i * Math.round(r / i))
        }
        _addTrailingStopPipsData(t, e) {
          const o = this._source.mainItem()
          if (o) {
            const { side: r, stopPrice: i, limitPrice: l } = o.data(),
              { pipSize: a } = (0, s.ensureNotNull)(
                this._symbolDataProvider.symbolData(),
              )
            if (void 0 !== e) {
              const o = (0, s.ensureDefined)(t.stopPrice || t.limitPrice)
              t.trailingStopPips = (0, m.calcPipsByPrice)(e, o, r, a)
            } else if (
              (0, b.isBracketOrderRawData)(t) &&
              t.parentId &&
              t.stopType === y.StopType.TrailingStop
            ) {
              const { bid: e, ask: n } = (0, s.ensureNotNull)(
                this._symbolDataProvider.lastData(),
              )
              let d
              if (isPositionLikeItem(o)) d = 1 === r ? e : n
              else {
                d = 3 === o.data().type ? i : l
              }
              t.trailingStopPips = (0, m.calcPipsByPrice)(
                (0, s.ensureDefined)(t.stopPrice || t.limitPrice),
                (0, s.ensureDefined)(d),
                r,
                a,
              )
            }
          }
          return t
        }
        _bracketTypeText(t) {
          if (!this._data) return ''
          if (this._isBracket()) {
            const e = (0, g.getBracketTypeToText)(
              this._data.type,
              this._data.stopType,
              t,
            )
            if (null !== e) return e
          }
          return t
            ? (0, v.orderTypeToText)({
                orderType: this._data.type,
                uppercase: !0,
                shorten: !0,
              })
            : `${(0, v.sideToText)(this._data.side)} ${(0, v.orderTypeToText)({ orderType: this._data.type, uppercase: !1 })}`
        }
        _potentialProfitLoss() {
          const t = this._source.baseItem()
          if (!this._data || !t) return null
          const e = this.price(),
            { ask: o, bid: r } = this._symbolDataProvider.lastData() || {},
            i =
              t.tryBasePlOnLast() &&
              3 === this._data.type &&
              this._data.stopType === y.StopType.TrailingStop
          if (!(0, n.isNumber)(e)) return null
          const s = i ? (this.isBuyDirection() ? o : r) : t.price()
          return (0, n.isNumber)(s) ? (s - e) * this._data.side : null
        }
        _isBracket() {
          const t = this.data()
          if (!(0, b.isBracketOrderRawData)(t)) return !1
          const e = this._source.mainItem()
          return (
            1 !== t.parentType ||
            (void 0 !== e && e.data().side !== this._data.side)
          )
        }
        _closeQtyCalc() {
          this._toggleQtyCalc(() => !1, new a.Point(0, 0))
        }
        _toggleQtyCalc(t, e = new a.Point(0, 0), o = {}) {
          if (!this.canQtyCalcModify()) return
          const { onToggleQtyCalcHandler: r, qtyInfoGetter: i } = (0,
          s.ensureDefined)(this._qtyModifyCallbacks)
          r(
            this._isQtyModifyOpened,
            e,
            i,
            () => this.data().qty,
            (t) => this.modifyQty(t),
            (e) => this._handleQtyModifyClose(t, e),
            this._handleQtyModifyDestroy,
          )
        }
      }
    },
    279460: (t, e, o) => {
      o.d(e, { OrderWithMenuItem: () => l })
      var r = o(650151),
        i = o(86441),
        s = o(182665)
      class l extends s.OrderBaseItem {
        constructor(t, e, o, r, i, s, l, a) {
          super(t, e, o, r, i, s, a),
            (this._isTypeMenuOpened = !1),
            (this._handleTypeMenuClose = (t, e) => {
              t(e) || this._handleTypeMenuDestroy()
            }),
            (this._handleTypeMenuDestroy = () => {
              this._isTypeMenuOpened = !1
            }),
            (this._typeMenuCallbacks = l)
        }
        destroy() {
          var t
          null === (t = this._typeMenuCallbacks) ||
            void 0 === t ||
            t.closeDropdownMenuHandler(),
            super.destroy()
        }
        isMovingEnabled() {
          return !0
        }
        toggleType(t, e, o = {}) {
          this._typeMenuCallbacks &&
            ((this._isTypeMenuOpened = !this._isTypeMenuOpened),
            this._toggleTypeMenu(t, e, o))
        }
        async onClose(t) {}
        async onModify(t) {
          return !1
        }
        async _onFinishMoveOrder(t, e, o = !0) {
          return !0
        }
        _toggleTypeMenu(t, e = new i.Point(0, 0), o = {}) {
          ;(0, r.ensureDefined)(
            this._typeMenuCallbacks,
          ).onToggleTypeMenuHandler(
            this._isTypeMenuOpened,
            e,
            o,
            (e) => this._handleTypeMenuClose(t, e),
            this._handleTypeMenuDestroy,
          )
        }
      }
    },
    829244: (t, e, o) => {
      function r(t) {
        return 'onReverse' in t
      }
      function i(t) {
        return (
          ((t) =>
            'isMovingEnabled' in t && 'onMove' in t && 'onFinishMove' in t)(
            t,
          ) &&
          'bracketType' in t &&
          'isWorking' in t
        )
      }
      function s(t) {
        return 'Position' === t.dataType
      }
      function l(t) {
        return 'PreOrder' === t.dataType
      }
      function a(t) {
        return 'Order' === t.dataType
      }
      o.d(e, {
        isOrderItemRawData: () => a,
        isOrderLikeItem: () => i,
        isPositionItemRawData: () => s,
        isPositionLikeItem: () => r,
        isPreOrderItemRawData: () => l,
      })
    },
    566884: (t, e, o) => {
      o.d(e, { TradedGroupItemType: () => r, createItem: () => m })
      var r,
        i = o(650151),
        s = o(822914),
        l = o(781585),
        a = o(829244),
        n = o(483186),
        d = o(400872),
        c = o(962881),
        h = o(423757),
        u = o(998952),
        p = o(25412),
        _ = o(874833),
        y = o(650802)
      class v {
        constructor(t, e, o) {
          ;(this._onSuggestedQtyChange = (t) => {
            ;(this._lastSuggestedQty = t), this._suggestedQty.setValue(t)
          }),
            (this._symbol = t),
            (this._suggestedQty = new y.WatchedValue(e)),
            (this._lastSuggestedQty = e),
            (this._qtySuggester = o)
        }
        destroy() {
          var t
          null === (t = this._qtySuggesterSubscription) ||
            void 0 === t ||
            t.unsubscribe()
        }
        suggestedQty() {
          return this._suggestedQty
        }
        async applySuggestedQty(t) {
          void 0 === this._qtySuggesterSubscription &&
            (await this._subscribeQtySuggester()),
            this._qtySuggester.setQty(this._symbol, t),
            this._lastSuggestedQty !== t &&
              this._suggestedQty.setValue(this._lastSuggestedQty, !0)
        }
        async _subscribeQtySuggester() {
          const t = await this._qtySuggester.getQty(this._symbol)
          this._suggestedQty.setValue(t),
            (this._qtySuggesterSubscription = this._qtySuggester
              .suggestedQtyChanged(this._symbol)
              .subscribe(this._onSuggestedQtyChange))
        }
      }
      function m(t, e, o, y, m) {
        const f = y.mainSeries(),
          b = (t, e) =>
            (0, l.createNoOverlapMenuAction)(
              m.itemExternalServices.tradedGroupRenderersController,
              t,
              e,
            )
        if (t === r.Order && (0, a.isOrderItemRawData)(e)) {
          const { dataType: t, ...r } = e,
            i = (t) =>
              (0, u.getDefaultStyleForOrderItem)(t, o, () => y.dark().value())
          return new c.OrderItem(
            r,
            o,
            f,
            m.itemExternalServices.symbolDataProvider,
            {
              displayMode: o.bracketsDisplayMode(),
              style: i,
              visibility: m.visibilityGetters.order,
              noOverlapAction: b,
            },
            {
              trackEvent: m.sourceCallbacks.trackEvent,
              exitTrackingMode: m.sourceCallbacks.exitTrackingMode,
            },
            void 0,
            m.gaOrigin,
          )
        }
        if (t === r.Position && (0, a.isPositionItemRawData)(e)) {
          const t = (t) =>
              (0, h.getDefaultStyleForPositionItem)(
                t.isBuyDirection(),
                o.isBlocked(),
                () => y.dark().value(),
                t.lineStyle(),
              ),
            { dataType: r, ...i } = e
          return new p.PositionItem(
            i,
            o,
            f,
            m.itemExternalServices.symbolDataProvider,
            {
              displayMode: o.positionDisplayMode(),
              style: t,
              visibility: m.visibilityGetters.position,
              noOverlapAction: b,
            },
            { trackEvent: m.sourceCallbacks.trackEvent },
          )
        }
        if (t === r.LimitPartStopLimitOrder && (0, a.isOrderItemRawData)(e)) {
          const t = (t) =>
              (0, u.getDefaultStyleForOrderItem)(t, o, () => y.dark().value()),
            r = {
              ...(0, s.default)(e),
              price: (0, i.ensureDefined)(e.limitPrice),
              considerFilledQty: !1,
            },
            { dataType: l, ...a } = r
          let n
          if (m.qtyModifyCallbacks) {
            n = {
              qtyProvider: new v(
                a.symbol,
                a.qty,
                m.itemExternalServices.qtySuggester,
              ),
              ...(0, i.ensureDefined)(m.qtyModifyCallbacks),
            }
          }
          return new d.LimitPartStopLimitOrderItem(
            a,
            o,
            f,
            m.itemExternalServices.symbolDataProvider,
            {
              displayMode: o.bracketsDisplayMode(),
              style: t,
              visibility: m.visibilityGetters.order,
              noOverlapAction: b,
            },
            {
              trackEvent: m.sourceCallbacks.trackEvent,
              exitTrackingMode: m.sourceCallbacks.exitTrackingMode,
            },
            n,
          )
        }
        if (t === r.ProjectionBracket && (0, a.isOrderItemRawData)(e)) {
          const { dataType: t, ...r } = e,
            i = (t) =>
              (0, u.getDefaultStyleForOrderItem)(t, o, () => y.dark().value())
          return new n.ProjectionBracketItem(
            r,
            o,
            f,
            m.itemExternalServices.symbolDataProvider,
            {
              displayMode: o.bracketsDisplayMode(),
              style: i,
              visibility: m.visibilityGetters.order,
              noOverlapAction: b,
            },
            {
              trackEvent: m.sourceCallbacks.trackEvent,
              exitTrackingMode: m.sourceCallbacks.exitTrackingMode,
            },
            m.menuCallbacks,
          )
        }
        if (t === r.PreOrder && (0, a.isPreOrderItemRawData)(e)) {
          const t = (t) =>
              (0, u.getDefaultStyleForOrderItem)(t, o, () => y.dark().value()),
            { dataType: r, ...s } = e,
            l = new v(s.symbol, s.qty, m.itemExternalServices.qtySuggester)
          return new _.PreOrderItem(
            s,
            o,
            f,
            m.itemExternalServices.symbolDataProvider,
            {
              displayMode: o.bracketsDisplayMode(),
              style: t,
              visibility: m.visibilityGetters.order,
              noOverlapAction: b,
            },
            {
              trackEvent: m.sourceCallbacks.trackEvent,
              exitTrackingMode: m.sourceCallbacks.exitTrackingMode,
            },
            m.menuCallbacks,
            { qtyProvider: l, ...(0, i.ensureDefined)(m.qtyModifyCallbacks) },
          )
        }
        throw new Error('Unknown traded item type')
      }
      !((t) => {
        ;(t[(t.Position = 0)] = 'Position'),
          (t[(t.Order = 1)] = 'Order'),
          (t[(t.LimitPartStopLimitOrder = 2)] = 'LimitPartStopLimitOrder'),
          (t[(t.ProjectionBracket = 3)] = 'ProjectionBracket'),
          (t[(t.PreOrder = 4)] = 'PreOrder')
      })(r || (r = {}))
    },
    206318: (t, e, o) => {
      o.d(e, {
        isLimitPartStopLimitOrderItem: () => h,
        isOrderItem: () => d,
        isPositionItem: () => n,
        isPreOrderItem: () => c,
        isProjectionBracketItem: () => u,
      })
      var r = o(483186),
        i = o(400872),
        s = o(962881),
        l = o(25412),
        a = o(874833)
      function n(t) {
        return t instanceof l.PositionItem
      }
      function d(t) {
        return t instanceof s.OrderItem
      }
      function c(t) {
        return t instanceof a.PreOrderItem
      }
      function h(t) {
        return t instanceof i.LimitPartStopLimitOrderItem
      }
      function u(t) {
        return t instanceof r.ProjectionBracketItem
      }
    },
    400872: (t, e, o) => {
      o.d(e, { LimitPartStopLimitOrderItem: () => a })
      var r = o(650151),
        i = o(372605),
        s = o(637401),
        l = o(962881)
      class a extends l.OrderItem {
        isWorking() {
          return !1
        }
        async onFinishMove(t, e = {}, o = !0, s) {
          this._source.setIsBlocked(o)
          const l = (0, i.clone)(this.data()),
            a = (0, r.ensureNotNull)(l.price)
          ;(l.limitPrice = a),
            (l.takeProfit = e.takeProfit || l.takeProfit),
            (l.stopLoss = e.stopLoss || l.stopLoss),
            await this._addTrailingStopPipsData(l),
            void 0 === s && (s = 1),
            this._trackEventGA(t)
          const n = await (0, r.ensureDefined)(this._data.callbacks.moveOrder)(
            l.id,
            l,
            s,
          )
          return (
            (this._inEdit = !1),
            this._source.setIsBlocked(!1),
            this._source.syncData(),
            n
          )
        }
        profitLossText(t) {
          return this._source.isPlaced()
            ? this._bracketTypeText(t)
            : (0, s.orderTypeToText)({
                orderType: this.data().type,
                uppercase: t,
                shorten: t,
              })
        }
        supportClose() {
          return !1
        }
        _calcId() {
          return this.data().type
        }
      }
    },
    962881: (t, e, o) => {
      o.d(e, { OrderItem: () => h })
      var r = o(650151),
        i = o(372605),
        s = o(156963),
        l = o(656846),
        a = o(11933),
        n = o(182665),
        d = o(74516)
      const c = s.enabled('chart_hide_close_order_button')
      class h extends n.OrderBaseItem {
        style() {
          return this._infoGetters.style(this)
        }
        isMovingEnabled() {
          return this._data.supportMove
        }
        supportClose() {
          return !c && Boolean(this._data.callbacks.cancelOrder)
        }
        supportModify() {
          return Boolean(this._data.callbacks.modifyOrder)
        }
        isWorking() {
          return 6 === this._data.status
        }
        qtyText() {
          return super._quantityText(
            this._data.considerFilledQty
              ? this._data.qty - (this._data.filledQty || 0)
              : this._data.qty,
          )
        }
        profitLossText(t) {
          var e
          return this._data &&
            this._isBracket() &&
            (null === (e = this._source.isBracketsPLVisible()) || void 0 === e
              ? void 0
              : e.value()) &&
            this.bracketType() !== l.BracketType.TrailingStop
            ? super.profitLossText(t)
            : this._bracketTypeText(t)
        }
        async onModify(t = {}, e, o) {
          this._source.setIsBlocked(!0)
          const s = (0, i.clone)(this._data)
          await this._addTrailingStopPipsData(s),
            this._trackEventGA((0, a.mergeGaParams)(t, { event: 'Edit Order' }))
          const l = await (0, r.ensureDefined)(
            this._data.callbacks.modifyOrder,
          )(s.id, s, e, o)
          return this._source.setIsBlocked(!1), this._source.syncData(), l
        }
        async onClose(t = {}) {
          this._source.isBlocked() ||
            (this._source.setIsBlocked(!0),
            this._trackEventGA(
              (0, a.mergeGaParams)(t, { event: 'Cancel Order' }),
            ),
            await (0, r.ensureDefined)(this._data.callbacks.cancelOrder)(
              this._data.id,
            ),
            this._source.setIsBlocked(!1),
            this._source.syncData())
        }
        _onFinishMoveOrder(t, e, o = !0) {
          return this._data.callbacks.moveOrder ||
            this._data.supportModifyOrderPrice
            ? (0, r.ensureDefined)(this._data.callbacks.moveOrder)(t.id, t, e)
            : (0, r.ensureDefined)(this._data.callbacks.modifyOrder)(
                t.id,
                t,
                e,
                o,
              )
        }
        _calcId() {
          return void 0 !== this._data.parentId
            ? (0, r.ensureNotNull)((0, d.getBracketType)(this._data))
            : this._data.id
        }
      }
    },
    531979: (t, e, o) => {
      o.d(e, {
        buyActiveColor: () => l,
        buyPointShadowColor: () => c,
        darkTheme: () => b,
        overlayColor: () => _,
        sellActiveColor: () => a,
        sellPointShadowColor: () => h,
        stopLossActiveColor: () => d,
        takeProfitActiveColor: () => n,
      })
      var r = o(149962),
        i = o(32240),
        s = o(316167)
      const l = (0, i.generateColor)(r.colorsPalette['color-tv-blue-500'], 85),
        a =
          ((0, i.generateColor)(r.colorsPalette['color-tv-blue-500'], 80),
          (0, i.generateColor)(r.colorsPalette['color-ripe-red-500'], 85)),
        n =
          ((0, i.generateColor)(r.colorsPalette['color-ripe-red-500'], 80),
          (0, i.generateColor)(r.colorsPalette['color-minty-green-500'], 85)),
        d =
          ((0, i.generateColor)(r.colorsPalette['color-minty-green-500'], 80),
          (0, i.generateColor)(r.colorsPalette['color-tan-orange-500'], 85)),
        c =
          ((0, i.generateColor)(r.colorsPalette['color-tan-orange-500'], 80),
          (0, i.generateColor)(r.colorsPalette['color-tv-blue-500'], 70)),
        h = (0, i.generateColor)(r.colorsPalette['color-ripe-red-500'], 70),
        u = (0, i.generateColor)(r.colorsPalette['color-minty-green-500'], 70),
        p = (0, i.generateColor)(r.colorsPalette['color-tan-orange-500'], 70),
        _ = (0, i.generateColor)(r.colorsPalette['color-cold-gray-900'], 50),
        y = {
          pointShadowColor: c,
          labelTickColor: r.colorsPalette['color-tv-blue-500'],
          lineColor: r.colorsPalette['color-tv-blue-500'],
          borderBackgroundColor: r.colorsPalette['color-cold-gray-900'],
          borderColor: r.colorsPalette['color-tv-blue-500'],
          pointBackgroundColor: r.colorsPalette['color-cold-gray-900'],
          disabledLineColor: r.colorsPalette['color-tv-blue-a700'],
          positivePlColor: r.colorsPalette['color-minty-green-500'],
          negativePlColor: r.colorsPalette['color-ripe-red-500'],
          qty: {
            backgroundColor: r.colorsPalette['color-cold-gray-900'],
            textColor: r.colorsPalette['color-tv-blue-500'],
            dividerColor: r.colorsPalette['color-tv-blue-a800'],
            activeColor: l,
          },
          text: {
            backgroundColor: r.colorsPalette['color-cold-gray-900'],
            textColor: r.colorsPalette['color-tv-blue-500'],
            dividerColor: r.colorsPalette['color-tv-blue-a800'],
            buttonTextColor: r.colorsPalette['color-tv-blue-500'],
          },
          close: {
            backgroundColor: r.colorsPalette['color-cold-gray-900'],
            iconColor: r.colorsPalette['color-tv-blue-500'],
            activeColor: l,
          },
          confirm: {
            disableBackgroundColor: r.colorsPalette['color-cold-gray-750'],
            backgroundColor: r.colorsPalette['color-tv-blue-500'],
            borderColor: r.colorsPalette['color-tv-blue-500'],
            textColor: r.colorsPalette['color-white'],
            disableTextColor: r.colorsPalette['color-cold-gray-600'],
            activeColor: r.colorsPalette['color-tv-blue-600'],
          },
        },
        v = {
          pointShadowColor: h,
          labelTickColor: r.colorsPalette['color-ripe-red-500'],
          lineColor: r.colorsPalette['color-ripe-red-500'],
          borderBackgroundColor: r.colorsPalette['color-cold-gray-900'],
          borderColor: r.colorsPalette['color-ripe-red-500'],
          pointBackgroundColor: r.colorsPalette['color-cold-gray-900'],
          disabledLineColor: r.colorsPalette['color-ripe-red-a800'],
          positivePlColor: r.colorsPalette['color-minty-green-500'],
          negativePlColor: r.colorsPalette['color-ripe-red-500'],
          qty: {
            backgroundColor: r.colorsPalette['color-cold-gray-900'],
            textColor: r.colorsPalette['color-ripe-red-500'],
            dividerColor: r.colorsPalette['color-ripe-red-a800'],
            activeColor: a,
          },
          text: {
            backgroundColor: r.colorsPalette['color-cold-gray-900'],
            textColor: r.colorsPalette['color-ripe-red-500'],
            dividerColor: r.colorsPalette['color-ripe-red-a800'],
            buttonTextColor: r.colorsPalette['color-ripe-red-500'],
          },
          close: {
            backgroundColor: r.colorsPalette['color-cold-gray-900'],
            iconColor: r.colorsPalette['color-ripe-red-500'],
            activeColor: a,
          },
          confirm: {
            disableBackgroundColor: r.colorsPalette['color-cold-gray-750'],
            backgroundColor: r.colorsPalette['color-ripe-red-500'],
            borderColor: r.colorsPalette['color-ripe-red-500'],
            textColor: r.colorsPalette['color-white'],
            disableTextColor: r.colorsPalette['color-cold-gray-600'],
            activeColor: r.colorsPalette['color-ripe-red-600'],
          },
        },
        m = {
          pointShadowColor: u,
          labelTickColor: r.colorsPalette['color-minty-green-500'],
          lineColor: r.colorsPalette['color-minty-green-500'],
          borderBackgroundColor: r.colorsPalette['color-cold-gray-900'],
          borderColor: r.colorsPalette['color-minty-green-500'],
          pointBackgroundColor: r.colorsPalette['color-cold-gray-900'],
          positivePlColor: r.colorsPalette['color-minty-green-500'],
          negativePlColor: r.colorsPalette['color-ripe-red-500'],
          qty: {
            backgroundColor: r.colorsPalette['color-cold-gray-900'],
            textColor: r.colorsPalette['color-minty-green-500'],
            dividerColor: '#0D3D41',
            activeColor: n,
          },
          text: {
            backgroundColor: r.colorsPalette['color-cold-gray-900'],
            textColor: r.colorsPalette['color-minty-green-500'],
            dividerColor: '#0D3D41',
            buttonTextColor: r.colorsPalette['color-minty-green-500'],
          },
          close: {
            backgroundColor: r.colorsPalette['color-cold-gray-900'],
            iconColor: r.colorsPalette['color-minty-green-500'],
            activeColor: n,
          },
        },
        f = {
          pointShadowColor: p,
          labelTickColor: r.colorsPalette['color-tan-orange-500'],
          lineColor: r.colorsPalette['color-tan-orange-500'],
          borderBackgroundColor: r.colorsPalette['color-cold-gray-900'],
          borderColor: r.colorsPalette['color-tan-orange-500'],
          pointBackgroundColor: r.colorsPalette['color-cold-gray-900'],
          positivePlColor: r.colorsPalette['color-minty-green-500'],
          negativePlColor: r.colorsPalette['color-ripe-red-500'],
          qty: {
            backgroundColor: r.colorsPalette['color-cold-gray-900'],
            textColor: r.colorsPalette['color-tan-orange-500'],
            dividerColor: '#453826',
            activeColor: d,
          },
          text: {
            backgroundColor: r.colorsPalette['color-cold-gray-900'],
            textColor: r.colorsPalette['color-tan-orange-500'],
            dividerColor: '#453826',
            buttonTextColor: r.colorsPalette['color-tan-orange-500'],
          },
          close: {
            backgroundColor: r.colorsPalette['color-cold-gray-900'],
            iconColor: r.colorsPalette['color-tan-orange-500'],
            activeColor: d,
          },
        },
        b = {
          buy: { normal: y, disabled: (0, s.generateBlendColors)(y, _) },
          sell: { normal: v, disabled: (0, s.generateBlendColors)(v, _) },
          takeProfit: { normal: m, disabled: (0, s.generateBlendColors)(m, _) },
          stopLoss: { normal: f, disabled: (0, s.generateBlendColors)(f, _) },
        }
    },
    310328: (t, e, o) => {
      o.d(e, {
        buyPointShadowColor: () => a,
        lightTheme: () => v,
        overlayColor: () => h,
        sellPointShadowColor: () => n,
      })
      var r = o(149962),
        i = o(32240),
        s = o(316167),
        l = o(531979)
      const a = (0, i.generateColor)(r.colorsPalette['color-tv-blue-500'], 80),
        n = (0, i.generateColor)(r.colorsPalette['color-ripe-red-500'], 80),
        d = (0, i.generateColor)(r.colorsPalette['color-minty-green-500'], 80),
        c = (0, i.generateColor)(r.colorsPalette['color-tan-orange-500'], 80),
        h = (0, i.generateColor)(r.colorsPalette['color-white'], 50),
        u = {
          pointShadowColor: a,
          labelTickColor: r.colorsPalette['color-tv-blue-500'],
          lineColor: r.colorsPalette['color-tv-blue-500'],
          borderBackgroundColor: r.colorsPalette['color-white'],
          borderColor: r.colorsPalette['color-tv-blue-500'],
          pointBackgroundColor: r.colorsPalette['color-white'],
          disabledLineColor: r.colorsPalette['color-tv-blue-100'],
          positivePlColor: r.colorsPalette['color-minty-green-500'],
          negativePlColor: r.colorsPalette['color-ripe-red-500'],
          qty: {
            backgroundColor: r.colorsPalette['color-white'],
            textColor: r.colorsPalette['color-tv-blue-500'],
            dividerColor: r.colorsPalette['color-tv-blue-50'],
            activeColor: l.buyActiveColor,
          },
          text: {
            backgroundColor: r.colorsPalette['color-white'],
            textColor: r.colorsPalette['color-tv-blue-500'],
            dividerColor: r.colorsPalette['color-tv-blue-50'],
            buttonTextColor: r.colorsPalette['color-tv-blue-500'],
          },
          close: {
            backgroundColor: r.colorsPalette['color-white'],
            iconColor: r.colorsPalette['color-tv-blue-500'],
            activeColor: l.buyActiveColor,
          },
          confirm: {
            disableBackgroundColor: r.colorsPalette['color-cold-gray-150'],
            backgroundColor: r.colorsPalette['color-tv-blue-500'],
            borderColor: r.colorsPalette['color-tv-blue-500'],
            textColor: r.colorsPalette['color-white'],
            disableTextColor: r.colorsPalette['color-cold-gray-300'],
            activeColor: r.colorsPalette['color-tv-blue-600'],
          },
        },
        p = {
          pointShadowColor: n,
          labelTickColor: r.colorsPalette['color-ripe-red-500'],
          lineColor: r.colorsPalette['color-ripe-red-500'],
          borderBackgroundColor: r.colorsPalette['color-white'],
          borderColor: r.colorsPalette['color-ripe-red-500'],
          pointBackgroundColor: r.colorsPalette['color-white'],
          disabledLineColor: r.colorsPalette['color-ripe-red-100'],
          positivePlColor: r.colorsPalette['color-minty-green-500'],
          negativePlColor: r.colorsPalette['color-ripe-red-500'],
          qty: {
            backgroundColor: r.colorsPalette['color-white'],
            textColor: r.colorsPalette['color-ripe-red-500'],
            dividerColor: r.colorsPalette['color-ripe-red-50'],
            activeColor: l.sellActiveColor,
          },
          text: {
            backgroundColor: r.colorsPalette['color-white'],
            textColor: r.colorsPalette['color-ripe-red-500'],
            dividerColor: r.colorsPalette['color-ripe-red-50'],
            buttonTextColor: r.colorsPalette['color-ripe-red-500'],
          },
          close: {
            backgroundColor: r.colorsPalette['color-white'],
            iconColor: r.colorsPalette['color-ripe-red-500'],
            activeColor: l.sellActiveColor,
          },
          confirm: {
            disableBackgroundColor: r.colorsPalette['color-cold-gray-150'],
            backgroundColor: r.colorsPalette['color-ripe-red-500'],
            borderColor: r.colorsPalette['color-ripe-red-500'],
            textColor: r.colorsPalette['color-white'],
            disableTextColor: r.colorsPalette['color-cold-gray-300'],
            activeColor: r.colorsPalette['color-ripe-red-600'],
          },
        },
        _ = {
          pointShadowColor: d,
          labelTickColor: r.colorsPalette['color-minty-green-500'],
          lineColor: r.colorsPalette['color-minty-green-500'],
          borderBackgroundColor: r.colorsPalette['color-white'],
          borderColor: r.colorsPalette['color-minty-green-500'],
          pointBackgroundColor: r.colorsPalette['color-white'],
          positivePlColor: r.colorsPalette['color-minty-green-500'],
          negativePlColor: r.colorsPalette['color-ripe-red-500'],
          qty: {
            backgroundColor: r.colorsPalette['color-white'],
            textColor: r.colorsPalette['color-minty-green-500'],
            dividerColor: r.colorsPalette['color-minty-green-50'],
            activeColor: l.takeProfitActiveColor,
          },
          text: {
            backgroundColor: r.colorsPalette['color-white'],
            textColor: r.colorsPalette['color-minty-green-500'],
            dividerColor: r.colorsPalette['color-minty-green-50'],
            buttonTextColor: r.colorsPalette['color-minty-green-500'],
          },
          close: {
            backgroundColor: r.colorsPalette['color-white'],
            iconColor: r.colorsPalette['color-minty-green-500'],
            activeColor: l.takeProfitActiveColor,
          },
        },
        y = {
          pointShadowColor: c,
          labelTickColor: r.colorsPalette['color-tan-orange-500'],
          lineColor: r.colorsPalette['color-tan-orange-500'],
          borderBackgroundColor: r.colorsPalette['color-white'],
          borderColor: r.colorsPalette['color-tan-orange-500'],
          pointBackgroundColor: r.colorsPalette['color-white'],
          positivePlColor: r.colorsPalette['color-minty-green-500'],
          negativePlColor: r.colorsPalette['color-ripe-red-500'],
          qty: {
            backgroundColor: r.colorsPalette['color-white'],
            textColor: r.colorsPalette['color-tan-orange-500'],
            dividerColor: r.colorsPalette['color-tan-orange-50'],
            activeColor: l.stopLossActiveColor,
          },
          text: {
            backgroundColor: r.colorsPalette['color-white'],
            textColor: r.colorsPalette['color-tan-orange-500'],
            dividerColor: r.colorsPalette['color-tan-orange-50'],
            buttonTextColor: r.colorsPalette['color-tan-orange-500'],
          },
          close: {
            backgroundColor: r.colorsPalette['color-white'],
            iconColor: r.colorsPalette['color-tan-orange-500'],
            activeColor: l.stopLossActiveColor,
          },
        },
        v = {
          buy: { normal: u, disabled: (0, s.generateBlendColors)(u, h) },
          sell: { normal: p, disabled: (0, s.generateBlendColors)(p, h) },
          takeProfit: { normal: _, disabled: (0, s.generateBlendColors)(_, h) },
          stopLoss: { normal: y, disabled: (0, s.generateBlendColors)(y, h) },
        }
    },
    998952: (t, e, o) => {
      o.d(e, {
        getDefaultStyleForOrderItem: () => a,
        getStyleForOppositeDirection: () => n,
      })
      var r = o(694454),
        i = o(656846),
        s = o(310328),
        l = o(531979)
      function a(t, e, o, a = {}) {
        const n = o() ? l.darkTheme : s.lightTheme
        let d
        const c = t.bracketType()
        d =
          null !== c
            ? c === i.BracketType.TakeProfit
              ? n.takeProfit
              : n.stopLoss
            : t.isBuyDirection()
              ? n.buy
              : n.sell
        const h = e.disabled() ? d.disabled : d.normal,
          u = e.isPlaced() ? t.lineStyle() : r.LineStyle.Dashed
        return {
          ...h,
          lineStyle: u,
          borderStyle: u,
          labelBorderVisible: !0,
          ...a,
        }
      }
      function n(t, e, o) {
        const i = o() ? l.darkTheme : s.lightTheme,
          a = t.isBuyDirection() ? i.sell : i.buy
        return {
          ...(e.disabled() ? a.disabled : a.normal),
          lineStyle: t.isWorking() ? e.lineStyle() : r.LineStyle.Dotted,
          borderStyle: t.isWorking() ? r.LineStyle.Solid : r.LineStyle.Dotted,
          labelBorderVisible: !0,
        }
      }
    },
    25412: (t, e, o) => {
      o.d(e, { PositionItem: () => P })
      var r = o(650151),
        i = o(247905),
        s = o(973602),
        l = o(156963),
        a = o(372605),
        n = o(817680),
        d = o(6835),
        c = o(637401),
        h = o(781585),
        u = o(113211),
        p = o(11933),
        _ = o(735415),
        y = o(609838)
      const v = (0, o(350299).appendEllipsis)(y.t(null, void 0, o(888310))),
        m = y.t(null, void 0, o(424356)),
        f = y.t(null, void 0, o(920848))
      var b = o(397728)
      const C = (0, d.getLogger)('Trading.Positions'),
        g = l.enabled('chart_hide_close_position_button')
      class P extends _.BaseItem {
        constructor(t, e, o, r, i, s) {
          super(t, e, o, r, 'Chart Position', i, s),
            this._source
              .positionDisplayMode()
              .subscribe(this, this.fireProfitLossChange)
        }
        destroy() {
          this._source
            .positionDisplayMode()
            .unsubscribe(this, this.fireProfitLossChange),
            super.destroy()
        }
        supportBrackets() {
          return this._symbolDataProvider.supportPositionBrackets()
        }
        currency() {
          var t
          return null !== (t = this._symbolDataProvider.positionCurrency()) &&
            void 0 !== t
            ? t
            : ''
        }
        profitLossTextColor() {
          if (!this._data) return ''
          const t = this._potentialProfitLoss()
          return null === t
            ? ''
            : (0, b.profitLossTextColor)(
                this._infoGetters.style(this),
                t,
                this._infoGetters.displayMode.value() === i.PlDisplay.Money,
              )
        }
        id() {
          return this._data.id
        }
        setData(t) {
          var e
          const o = null === (e = this.data()) || void 0 === e ? void 0 : e.pl
          super.setData(t), this.data().pl !== o && this.fireProfitLossChange()
        }
        qtyText() {
          return super._quantityText(this._data.qtyBySide)
        }
        qty() {
          return this._data.qtyBySide
        }
        supportOnlyPairBrackets() {
          return this._data.supportOnlyPairBrackets
        }
        supportReverse() {
          return this._symbolDataProvider.supportPositionReverse()
        }
        async onReverse(t = {}) {
          ;(t = (0, p.mergeGaParams)(t, { event: 'Reverse Position' })),
            await this._doActionWithBlock('reversePosition', !0, t)
        }
        supportClose() {
          return !g && this._data.supportClose
        }
        async onClose(t = {}) {
          ;(t = (0, p.mergeGaParams)(t, { event: 'Close Position' })),
            await this._doActionWithBlock('closePosition', !0, t)
        }
        supportModify() {
          return this.supportBrackets()
        }
        async onModify(t = {}) {
          return (
            (t = (0, p.mergeGaParams)(t, { event: 'Edit Position' })),
            this._doActionWithBlock('modifyPosition', !0, t, void 0, void 0, !1)
          )
        }
        useMinTickFormatter() {
          return !1
        }
        async onModifyWithBracket(t = {}, e = {}, o = !0, i, s = !0) {
          var l, a
          const n = this._symbolDataProvider.lastData(),
            d =
              null !== (l = null == n ? void 0 : n.bid) && void 0 !== l
                ? l
                : null,
            c =
              null !== (a = null == n ? void 0 : n.ask) && void 0 !== a
                ? a
                : null
          if (void 0 !== e.trailingStop && d && c) {
            const t = 1 === this._data.side ? d : c,
              { pipSize: o } = (0, r.ensureNotNull)(
                this._symbolDataProvider.symbolData(),
              )
            ;(e.trailingStopPips = (0, u.calcPipsByPrice)(
              e.trailingStop,
              t,
              this._data.side,
              o,
            )),
              (e.trailingStop = void 0)
          }
          return this._doActionWithBlock('modifyPosition', o, t, e, i, s)
        }
        hasContextMenu() {
          return super.hasContextMenu() || this.supportReverse()
        }
        moneyText(t, e) {
          return `${(0, _.plSign)(t, e)}${Math.abs(t).toFixed(2)} ${this.currency()}`
        }
        async onContextMenu(t, e) {
          this.fireProfitLossChange()
          const o = {}
          ;(e = (0, p.mergeGaParams)(e, {
            origin: 'Chart Position Context Menu',
          })),
            this.supportClose() &&
              (o.closePosition = this.onClose.bind(this, e)),
            this.supportReverse() &&
              (o.reversePosition = this.onReverse.bind(this, e)),
            this.supportModify() &&
              (o.modifyPosition = this.onModify.bind(this, e))
          const r = {
              side: (0, c.sideToText)(this._data.side),
              qty: this.qtyText(),
              price: this.priceText(),
              formatPlWV: this.formatPlWV(),
              plColorWV: this.plColorWV(),
            },
            i = await (async (t, e) => {
              const o = [],
                r = await (0, h.createContextMenuTitle)(
                  'Trading.PositionTitle',
                  e,
                )
              return (
                r && o.push(r),
                void 0 !== t.modifyPosition &&
                  o.push(
                    new s.Action({
                      actionId: 'Trading.ModifyPosition',
                      options: { label: v, onExecute: t.modifyPosition },
                    }),
                  ),
                void 0 !== t.closePosition &&
                  o.push(
                    new s.Action({
                      actionId: 'Trading.ClosePosition',
                      options: { label: m, onExecute: t.closePosition },
                    }),
                  ),
                void 0 !== t.reversePosition &&
                  o.push(
                    new s.Action({
                      actionId: 'Trading.ReversePosition',
                      options: { label: f, onExecute: t.reversePosition },
                    }),
                  ),
                o
              )
            })(o, r),
            l = this._infoGetters.noOverlapAction(e, (t) =>
              this._trackEventGA(t),
            )
          l && (i.push(new s.Separator()), i.push(l)),
            (this._contextMenu = await (0, h.showContextMenu)(
              i,
              t,
              () => {
                this._contextMenu = null
              },
              { detail: { type: 'position', id: this.id() } },
            ))
        }
        tryBasePlOnLast() {
          return !0
        }
        _potentialProfitLoss() {
          var t
          if (!this._source.isPositionPLVisible().value() || !this._data)
            return null
          const { pl: e, side: o, price: r } = this._data
          if (null === e) return null
          if (this._infoGetters.displayMode.value() === i.PlDisplay.Money)
            return e
          const {
              trade: s,
              ask: l,
              bid: n,
            } = this._symbolDataProvider.lastData() || {},
            d =
              null !==
                (t = this._data.plBasedOnLast
                  ? s
                  : this.isBuyDirection()
                    ? n
                    : l) && void 0 !== t
                ? t
                : r
          return (0, a.isNumber)(d) ? (d - r) * o : null
        }
        async _doActionWithBlock(t, e, o = {}, i = {}, s, l) {
          if (void 0 === this._data.callbacks[t]) return !1
          e && this._source.setIsBlocked(!0), this._trackEventGA(o)
          let a = !1
          try {
            a =
              'modifyPosition' === t
                ? await (0, r.ensureDefined)(
                    this._data.callbacks.modifyPosition,
                  )(this._data.id, i, s, l)
                : await (0, r.ensureDefined)(this._data.callbacks[t])(
                    this._data.id,
                  )
          } catch (e) {
            C.logWarn(`Try to ${t}, but got error: ${(0, n.errorToString)(e)}`)
          } finally {
            e && (this._source.setIsBlocked(!1), this._source.syncData())
          }
          return a
        }
      }
    },
    423757: (t, e, o) => {
      o.d(e, { getDefaultStyleForPositionItem: () => _ })
      var r = o(694454),
        i = o(149962),
        s = o(531979),
        l = o(316167)
      const a = {
          pointShadowColor: s.buyPointShadowColor,
          lineColor: i.colorsPalette['color-tv-blue-500'],
          borderBackgroundColor: i.colorsPalette['color-cold-gray-900'],
          borderColor: i.colorsPalette['color-tv-blue-500'],
          pointBackgroundColor: i.colorsPalette['color-cold-gray-900'],
          disabledLineColor: i.colorsPalette['color-tv-blue-a700'],
          positivePlColor: i.colorsPalette['color-minty-green-500'],
          negativePlColor: i.colorsPalette['color-ripe-red-500'],
          qty: {
            backgroundColor: i.colorsPalette['color-tv-blue-500'],
            textColor: i.colorsPalette['color-white'],
            dividerColor: i.colorsPalette['color-tv-blue-500'],
            activeColor: i.colorsPalette['color-tv-blue-600'],
          },
          text: {
            backgroundColor: i.colorsPalette['color-cold-gray-900'],
            textColor: i.colorsPalette['color-cold-gray-600'],
            dividerColor: i.colorsPalette['color-tv-blue-a800'],
          },
          close: {
            backgroundColor: i.colorsPalette['color-cold-gray-900'],
            iconColor: i.colorsPalette['color-tv-blue-500'],
            activeColor: s.buyActiveColor,
          },
          reverse: {
            backgroundColor: i.colorsPalette['color-cold-gray-900'],
            borderColor: i.colorsPalette['color-tv-blue-500'],
            iconColor: i.colorsPalette['color-tv-blue-500'],
            activeColor: s.buyActiveColor,
          },
          confirm: {
            disableBackgroundColor: i.colorsPalette['color-cold-gray-750'],
            backgroundColor: i.colorsPalette['color-tv-blue-500'],
            borderColor: i.colorsPalette['color-tv-blue-500'],
            textColor: i.colorsPalette['color-white'],
            disableTextColor: i.colorsPalette['color-cold-gray-600'],
            activeColor: i.colorsPalette['color-tv-blue-600'],
          },
        },
        n = {
          pointShadowColor: s.sellPointShadowColor,
          lineColor: i.colorsPalette['color-ripe-red-500'],
          borderBackgroundColor: i.colorsPalette['color-cold-gray-900'],
          borderColor: i.colorsPalette['color-ripe-red-500'],
          pointBackgroundColor: i.colorsPalette['color-cold-gray-900'],
          disabledLineColor: i.colorsPalette['color-ripe-red-a800'],
          positivePlColor: i.colorsPalette['color-minty-green-500'],
          negativePlColor: i.colorsPalette['color-ripe-red-500'],
          qty: {
            backgroundColor: i.colorsPalette['color-ripe-red-500'],
            textColor: i.colorsPalette['color-white'],
            dividerColor: i.colorsPalette['color-ripe-red-500'],
            activeColor: i.colorsPalette['color-ripe-red-600'],
          },
          text: {
            backgroundColor: i.colorsPalette['color-cold-gray-900'],
            textColor: i.colorsPalette['color-cold-gray-600'],
            dividerColor: i.colorsPalette['color-ripe-red-a800'],
          },
          close: {
            backgroundColor: i.colorsPalette['color-cold-gray-900'],
            iconColor: i.colorsPalette['color-ripe-red-500'],
            activeColor: s.sellActiveColor,
          },
          reverse: {
            backgroundColor: i.colorsPalette['color-cold-gray-900'],
            borderColor: i.colorsPalette['color-ripe-red-500'],
            iconColor: i.colorsPalette['color-ripe-red-500'],
            activeColor: s.sellActiveColor,
          },
          confirm: {
            disableBackgroundColor: i.colorsPalette['color-cold-gray-750'],
            backgroundColor: i.colorsPalette['color-ripe-red-500'],
            borderColor: i.colorsPalette['color-ripe-red-500'],
            textColor: i.colorsPalette['color-white'],
            disableTextColor: i.colorsPalette['color-cold-gray-600'],
            activeColor: i.colorsPalette['color-ripe-red-600'],
          },
        },
        d = {
          buy: {
            normal: a,
            disabled: (0, l.generateBlendColors)(a, s.overlayColor),
          },
          sell: {
            normal: n,
            disabled: (0, l.generateBlendColors)(n, s.overlayColor),
          },
        }
      var c = o(310328)
      const h = {
          pointShadowColor: c.buyPointShadowColor,
          lineColor: i.colorsPalette['color-tv-blue-500'],
          borderBackgroundColor: i.colorsPalette['color-white'],
          borderColor: i.colorsPalette['color-tv-blue-500'],
          pointBackgroundColor: i.colorsPalette['color-white'],
          disabledLineColor: i.colorsPalette['color-tv-blue-100'],
          positivePlColor: i.colorsPalette['color-minty-green-500'],
          negativePlColor: i.colorsPalette['color-ripe-red-500'],
          qty: {
            backgroundColor: i.colorsPalette['color-tv-blue-500'],
            textColor: i.colorsPalette['color-white'],
            dividerColor: i.colorsPalette['color-tv-blue-500'],
            activeColor: i.colorsPalette['color-tv-blue-600'],
          },
          text: {
            backgroundColor: i.colorsPalette['color-white'],
            textColor: i.colorsPalette['color-cold-gray-300'],
            dividerColor: i.colorsPalette['color-tv-blue-50'],
          },
          close: {
            backgroundColor: i.colorsPalette['color-white'],
            iconColor: i.colorsPalette['color-tv-blue-500'],
            activeColor: s.buyActiveColor,
          },
          reverse: {
            backgroundColor: i.colorsPalette['color-white'],
            borderColor: i.colorsPalette['color-tv-blue-500'],
            iconColor: i.colorsPalette['color-tv-blue-500'],
            activeColor: s.buyActiveColor,
          },
          confirm: {
            disableBackgroundColor: i.colorsPalette['color-cold-gray-150'],
            backgroundColor: i.colorsPalette['color-tv-blue-500'],
            borderColor: i.colorsPalette['color-tv-blue-500'],
            textColor: i.colorsPalette['color-white'],
            disableTextColor: i.colorsPalette['color-cold-gray-300'],
            activeColor: i.colorsPalette['color-tv-blue-600'],
          },
        },
        u = {
          pointShadowColor: c.sellPointShadowColor,
          lineColor: i.colorsPalette['color-ripe-red-500'],
          borderBackgroundColor: i.colorsPalette['color-white'],
          borderColor: i.colorsPalette['color-ripe-red-500'],
          pointBackgroundColor: i.colorsPalette['color-white'],
          disabledLineColor: i.colorsPalette['color-ripe-red-100'],
          positivePlColor: i.colorsPalette['color-minty-green-500'],
          negativePlColor: i.colorsPalette['color-ripe-red-500'],
          qty: {
            backgroundColor: i.colorsPalette['color-ripe-red-500'],
            textColor: i.colorsPalette['color-white'],
            dividerColor: i.colorsPalette['color-ripe-red-500'],
            activeColor: i.colorsPalette['color-ripe-red-600'],
          },
          text: {
            backgroundColor: i.colorsPalette['color-white'],
            textColor: i.colorsPalette['color-cold-gray-300'],
            dividerColor: i.colorsPalette['color-ripe-red-50'],
          },
          close: {
            backgroundColor: i.colorsPalette['color-white'],
            iconColor: i.colorsPalette['color-ripe-red-500'],
            activeColor: s.sellActiveColor,
          },
          reverse: {
            backgroundColor: i.colorsPalette['color-white'],
            borderColor: i.colorsPalette['color-ripe-red-500'],
            iconColor: i.colorsPalette['color-ripe-red-500'],
            activeColor: s.sellActiveColor,
          },
          confirm: {
            disableBackgroundColor: i.colorsPalette['color-cold-gray-150'],
            backgroundColor: i.colorsPalette['color-ripe-red-500'],
            borderColor: i.colorsPalette['color-ripe-red-500'],
            textColor: i.colorsPalette['color-white'],
            disableTextColor: i.colorsPalette['color-cold-gray-300'],
            activeColor: i.colorsPalette['color-ripe-red-600'],
          },
        },
        p = {
          buy: {
            normal: h,
            disabled: (0, l.generateBlendColors)(h, c.overlayColor),
          },
          sell: {
            normal: u,
            disabled: (0, l.generateBlendColors)(u, c.overlayColor),
          },
        }
      function _(t, e, o, i = r.LineStyle.Solid) {
        const s = o() ? d : p,
          l = t ? s.buy : s.sell
        return {
          ...(e ? l.disabled : l.normal),
          lineStyle: i,
          borderStyle: i,
          labelBorderVisible: !1,
        }
      }
    },
    874833: (t, e, o) => {
      o.d(e, { PreOrderItem: () => n })
      var r = o(609838),
        i = o(694454),
        s = o(637401),
        l = o(279460)
      const a = r.t(null, void 0, o(502861))
      class n extends l.OrderWithMenuItem {
        constructor() {
          super(...arguments), (this._supportedOrderTypes = [])
        }
        qtyText() {
          return super._quantityText(this._data.qty)
        }
        style() {
          return this._infoGetters.style(this)
        }
        setSupportOrderType(t) {
          this._supportedOrderTypes = t
        }
        canSwitchType() {
          return this._supportedOrderTypes.length > 1
        }
        orderTypesItems() {
          return this._supportedOrderTypes.map((t) => ({
            type: t,
            typeText: (0, s.orderTypeToText)({ orderType: t }),
          }))
        }
        isWorking() {
          return !0
        }
        profitLossText(t) {
          return (0, s.orderTypeToText)({
            orderType: this.data().type,
            uppercase: t,
            shorten: t,
          })
        }
        profitLossTooltip() {
          return a
        }
        lineStyle() {
          return i.LineStyle.Dashed
        }
        supportClose() {
          return !0
        }
        supportModify() {
          return this._data.supportModify
        }
        async onClose(t) {
          var e, o
          null === (o = (e = this._source).onClose) ||
            void 0 === o ||
            o.call(e, t)
        }
        async onModify(t) {
          var e, o
          return (
            null === (o = (e = this._source).onModify) ||
              void 0 === o ||
              o.call(e, t),
            !0
          )
        }
        _calcId() {
          return 'preOrder'
        }
      }
    },
    483186: (t, e, o) => {
      o.d(e, { ProjectionBracketItem: () => f })
      var r = o(650151),
        i = o(150335),
        s = o(86441),
        l = o(609838),
        a = o(372605),
        n = o(694454),
        d = o(656846),
        c = o(282729),
        h = o(279460)
      const u = l.t(null, { context: 'Stop loss' }, o(653315)),
        p = l.t(null, { context: 'Trailing stop' }, o(668694)),
        _ = l.t(null, { context: 'Take profit' }, o(645560)),
        y = l.t(null, void 0, o(223754)),
        v = l.t(null, void 0, o(46742)),
        m = l.t(null, void 0, o(416976))
      class f extends h.OrderWithMenuItem {
        style() {
          return this._infoGetters.style(this)
        }
        setPrice(t) {
          const { minTick: e } = (0, r.ensureNotNull)(
            this._symbolDataProvider.symbolData(),
          )
          null !== t && (t = (0, i.fixComputationError)(e * Math.round(t / e))),
            this.setData({ ...(0, a.clone)(this.data()), price: t })
        }
        data() {
          return super.data()
        }
        qtyText() {
          return this._bracketTypeText(!0)
        }
        tooltip() {
          switch (this.bracketType()) {
            case d.BracketType.TakeProfit:
              return y
            case d.BracketType.StopLoss:
              return v
            case d.BracketType.TrailingStop:
              return m
            default:
              throw new Error('Unknown bracket type')
          }
        }
        isWorking() {
          return !0
        }
        supportClose() {
          return !1
        }
        supportModify() {
          return !0
        }
        profitLossText(t) {
          var e
          return (null === (e = this._source.isBracketsPLVisible()) ||
          void 0 === e
            ? void 0
            : e.value()) && this.bracketType() !== d.BracketType.TrailingStop
            ? super.profitLossText(t)
            : ''
        }
        isMinifyMode() {
          return null === this.price()
        }
        bracketType() {
          return this.data().bracketType
        }
        async onMove(t) {
          const e = new s.Point(t.localX, t.localY),
            o = this._mainSeries.priceScale(),
            i = this._mainSeries.firstValue()
          if (null === i) return
          const l = o.coordinateToPrice(e.y, i)
          this.setPrice(l),
            t.isTouch &&
              (0, r.ensureDefined)(this._itemCommands.exitTrackingMode)()
        }
        lineStyle() {
          return n.LineStyle.Dashed
        }
        _isBracket() {
          return !0
        }
        _calcId() {
          return this._data.id
        }
        _bracketTypeText(t) {
          return this._data
            ? this.bracketType() === d.BracketType.TakeProfit
              ? _
              : this._source.bracketStopType() === c.StopType.TrailingStop
                ? p
                : u
            : ''
        }
      }
    },
    113211: (t, e, o) => {
      o.d(e, { calcPipsByPrice: () => i })
      var r = o(960521)
      function i(t, e, o, i) {
        return (0, r.Big)(t)
          .minus(e)
          .div(i)
          .mul(1 === o ? -1 : 1)
          .toNumber()
      }
    },
    11933: (t, e, o) => {
      o.d(e, { mergeGaParams: () => i })
      var r = o(650151)
      function i(t, e) {
        ;(0, r.assert)(
          !(
            (t.origin && e.origin && t.origin !== e.origin) ||
            (t.event && e.event && t.event !== e.event)
          ),
          'origin and event should be only in one params object',
        )
        const o = { ...t, ...e }
        return t.label && e.label && (o.label = `${t.label} ${e.label}`), o
      }
    },
    74516: (t, e, o) => {
      o.d(e, {
        bracketsByType: () => v,
        buildProjectionBracketData: () => m,
        getBracketType: () => _,
        getBracketTypeToText: () => y,
        getOrderPriceByType: () => f,
      })
      var r = o(650151),
        i = o(609838),
        s = o(656846),
        l = o(282729),
        a = o(829244)
      const n = i.t(null, void 0, o(86430)),
        d = i.t(null, void 0, o(241648)),
        c = i.t(null, void 0, o(129266)),
        h = i.t(null, { context: 'Trailing stop' }, o(668694)),
        u = i.t(null, { context: 'Stop loss' }, o(653315)),
        p = i.t(null, { context: 'Take profit' }, o(645560))
      function _(t) {
        return 3 === t.type
          ? t.stopType === l.StopType.TrailingStop
            ? s.BracketType.TrailingStop
            : s.BracketType.StopLoss
          : 1 === t.type
            ? s.BracketType.TakeProfit
            : null
      }
      function y(t, e, o) {
        return 3 === t
          ? e === l.StopType.TrailingStop
            ? o
              ? h
              : n
            : o
              ? u
              : d
          : 1 === t
            ? o
              ? p
              : c
            : null
      }
      function v(t) {
        let e, o, r
        return (
          t.forEach((t) => {
            switch ((0, a.isOrderLikeItem)(t) ? t.bracketType() : _(t)) {
              case s.BracketType.TakeProfit:
                e = t
                break
              case s.BracketType.TrailingStop:
                r = t
                break
              case s.BracketType.StopLoss:
                o = t
            }
          }),
          { takeProfit: e, trailingStop: r, stopLoss: o }
        )
      }
      function m(t, e, o) {
        const r =
            e === s.BracketType.TrailingStop ? l.StopType.TrailingStop : void 0,
          i = e === s.BracketType.TakeProfit ? 1 : 3,
          a = -1 === o.side ? 1 : -1
        return {
          dataType: 'Order',
          id:
            e === s.BracketType.TakeProfit
              ? `${t}TakeProfit`
              : e === s.BracketType.StopLoss
                ? `${t}StopLoss`
                : `${t}TrailingStop`,
          price: null,
          type: i,
          stopType: r,
          side: a,
          bracketType: e,
          qty: o.qty,
          status: 6,
          symbol: o.symbol,
          plBasedOnLast: 'plBasedOnLast' in o && o.plBasedOnLast,
          considerFilledQty: !1,
          supportModify: !1,
          supportModifyOrderPrice: !1,
          supportMove: !0,
          supportCancel: !1,
          supportTrailingStop: !1,
          callbacks: {},
        }
      }
      function f(t) {
        return 1 === t.type
          ? (0, r.ensureDefined)(t.limitPrice, 'limit price for order')
          : (0, r.ensureDefined)(t.stopPrice, 'stop price for order')
      }
    },
    781585: (t, e, o) => {
      o.d(e, {
        createContextMenuTitle: () => c,
        createNoOverlapMenuAction: () => n,
        showContextMenu: () => d,
      })
      var r = o(609838),
        i = o(973602),
        s = o(462056),
        l = o(11933)
      const a = r.t(null, void 0, o(376303))
      function n(t, e, o) {
        const r = (0, l.mergeGaParams)(e, {
          event: 'No overlap orders and positions',
        })
        return new i.Action({
          actionId: 'Trading.NoOverlapMode',
          options: {
            label: a,
            onExecute: () => {
              o(r), t.setNoOverlapMode(!0)
            },
            disabled: !t.isItemsOverlap(),
          },
        })
      }
      async function d(t, e, o, r) {
        return s.ContextMenuManager.createMenu(
          t,
          {},
          { ...r, menuName: 'TradingOrderContextMenu' },
          o,
        ).then((t) => (t.show(e), t))
      }
      async function c(t, e) {
        return null
      }
    },
    764533: (t, e, o) => {
      o.d(e, { closeDropdownMenu: () => f, updateDropdownMenu: () => b })
      var r = o(50959),
        i = o(500962),
        s = o(86441),
        l = o(650151),
        a = o(914090),
        n = o(734602),
        d = o(930052),
        c = o(759339),
        h = o(163694),
        u = o(189904),
        p = o(192063),
        _ = o(163915)
      const y = new WeakMap()
      function v(t) {
        const {
          position: e,
          activeItemValue: o,
          title: i,
          onClose: s,
          onDestroy: l,
          onSelect: v,
          customCloseSubscriptions: m = [],
        } = t
        ;(0, n.useGlobalCloseOnScrollAndCustomEvents)(m)
        const f = t.items.map(
          (t) => (
            y.has(t) || y.set(t, (0, u.randomHash)()),
            r.createElement(p.PopupMenuItem, {
              key: y.get(t),
              onClick: () => {
                return (e = t.value), v(e), void l()
                var e
              },
              label: t.title,
              isActive: t.value === o,
            })
          ),
        )
        return r.createElement(
          h.DrawerManager,
          null,
          r.createElement(
            d.MatchMedia,
            { rule: 'screen and (max-width: 430px)' },
            (t) =>
              t
                ? r.createElement(
                    c.Drawer,
                    { onClose: s, position: 'Bottom' },
                    r.createElement(_.ToolWidgetMenuSummary, null, i),
                    f,
                  )
                : r.createElement(
                    a.TooltipPopup,
                    {
                      position: e,
                      onClose: s,
                      onClickOutside: b,
                      onForceClose: l,
                    },
                    f,
                  ),
          ),
        )
        function b(t) {
          s(t)
        }
      }
      const m = document.createElement('div')
      function f() {
        i.unmountComponentAtNode((0, l.ensureNotNull)(m))
      }
      function b(t, e, o, a, n, d, c, h, u) {
        if (!t) return
        const p = {
          items: o,
          activeItemValue: a,
          title: n,
          onClose: (t) => {
            if (t) {
              const e = t.target.getBoundingClientRect() || { left: 0, top: 0 }
              h(new s.Point(t.clientX - e.left, t.clientY - e.top))
            }
            i.unmountComponentAtNode((0, l.ensureNotNull)(m))
          },
          onDestroy: u,
          onSelect: c,
          customCloseSubscriptions: d,
          position: e,
        }
        i.render(r.createElement(v, { ...p }), m)
      }
    },
    645254: (t, e, o) => {
      o.d(e, {
        drawArrow: () => l,
        drawHalfArrow: () => n,
        drawOutlinedArrowHead: () => a,
        drawOutlinedText: () => h,
        drawText: () => d,
        drawUnderlinedText: () => c,
      })
      var r = o(694454),
        i = o(741253),
        s = o(620218)
      function l(t, e, o, r, i, s, l, a, n) {
        t.save()
        const d = t.lineWidth,
          c = t.lineWidth % 2 ? 0.5 : 0
        t.translate(e + c, o + c), s && t.scale(1, -1)
        const h = Math.round(a / 2),
          u = h,
          p = h
        n &&
          ((t.strokeStyle = i),
          (t.lineWidth = 2 * t.lineWidth),
          (t.lineCap = 'square'),
          t.beginPath(),
          t.moveTo(0, h),
          t.lineTo(u, 0),
          t.lineTo(a, h),
          t.stroke(),
          (t.lineCap = 'butt'),
          t.beginPath(),
          t.moveTo(p, l + (t.lineWidth - d) / 2),
          t.lineTo(u, 0),
          t.stroke()),
          (t.lineWidth = d),
          (t.strokeStyle = r),
          (t.lineCap = 'square'),
          t.beginPath(),
          t.moveTo(0, h),
          t.lineTo(u, 0),
          t.lineTo(a, h),
          t.stroke(),
          (t.lineCap = 'butt'),
          t.beginPath(),
          t.moveTo(p, l),
          t.lineTo(u, 0),
          t.stroke(),
          t.restore()
      }
      function a(t, e, o, r, i, s, l, a = 90) {
        t.save()
        const n = t.lineWidth,
          d = 2 * t.lineWidth,
          c = t.lineWidth % 2 ? 0.5 : 0
        t.translate(e + c + l / 2 - n, o + c), t.rotate((a * Math.PI) / 180)
        const h = Math.round(l / 2)
        ;(t.lineCap = 'square'),
          (t.lineWidth = d),
          (t.strokeStyle = i),
          t.beginPath(),
          t.moveTo(0, h),
          t.lineTo(h, 0),
          t.lineTo(l, h),
          t.stroke(),
          (t.lineCap = 'square'),
          (t.lineWidth = n),
          (t.strokeStyle = r),
          t.beginPath(),
          t.moveTo(0, h),
          t.lineTo(h, 0),
          t.lineTo(l, h),
          t.stroke(),
          t.restore()
      }
      function n(t, e, o, r, i, s, l) {
        t.save(), (t.strokeStyle = r), (t.lineJoin = 'miter')
        const a = t.lineWidth % 2 ? 0.5 : 0,
          n = Math.round(s / 3)
        t.translate(e + a, o + a),
          i && t.scale(-1, -1),
          t.beginPath(),
          t.moveTo(0, s),
          t.lineTo(0, 0),
          t.lineTo(-l, n),
          t.stroke(),
          t.restore()
      }
      function d(t, e, o, r, i, l, a, n, d = 'center') {
        t.save(),
          (t.textAlign = d),
          (t.textBaseline = 'middle'),
          (t.fillStyle = a),
          (t.font = n),
          t.translate(r, i + l),
          (0, s.drawScaled)(t, e, e, () => {
            t.fillText(o, 0, 0)
          }),
          t.restore()
      }
      function c(t, e, o, l, a, n, d, c, h) {
        t.save(),
          (t.textAlign = 'center'),
          (t.textBaseline = 'middle'),
          (t.fillStyle = d),
          (t.font = c)
        const u = 1,
          p = 1,
          _ = (r.LineStyle.Dashed, Math.round(10 * e) / 2),
          y = Math.max(1, Math.floor(p * e)),
          v = h.width * e,
          m = Math.max(1, Math.floor(u * e)),
          f = Math.round(l - v / 2),
          b = Math.round(a + _ + m)
        ;(t.strokeStyle = d), (t.lineWidth = y)
        const C = Math.round(3 * t.lineWidth),
          g = Math.round((3 * t.lineWidth) / 2),
          P = Math.round(2 * t.lineWidth)
        let k = Math.trunc(v / (C + P))
        const T = Math.trunc((v % (C + P)) / 2),
          x = []
        for (x.push(g + T); k > 1; ) x.push(P, C), k--
        x.push(P, g + T),
          t.setLineDash(x),
          (0, i.drawHorizontalLine)(t, b, f, f + Math.round(v)),
          t.translate(l, a + n),
          (0, s.drawScaled)(t, e, e, () => {
            t.fillText(o, 0, 0)
          }),
          t.restore()
      }
      function h(t, e, o, r, i, l, a, n, d) {
        t.save(),
          (t.textAlign = 'center'),
          (t.textBaseline = 'middle'),
          (t.fillStyle = a),
          (t.font = n),
          (t.lineJoin = 'round'),
          t.translate(r, i + l),
          (0, s.drawScaled)(t, e, e, () => {
            ;(t.strokeStyle = d), t.strokeText(o, 0, 0), t.fillText(o, 0, 0)
          }),
          t.restore()
      }
    },
    966949: (t, e, o) => {
      o.d(e, { isTradingObjVisibleOnScreenshot: () => i })
      var r = o(156963)
      function i() {
        return r.enabled('snapshot_trading_drawings')
      }
    },
    653315: (t) => {
      t.exports = {
        ar: ['إيقاف الخسارة'],
        ca_ES: 'SL',
        cs: 'SL',
        de: 'SL',
        el: 'SL',
        en: 'SL',
        es: 'SL',
        fa: 'SL',
        fr: 'SL',
        he_IL: 'SL',
        hu_HU: 'SL',
        id_ID: 'SL',
        it: 'SL',
        ja: 'SL',
        ko: ['스탑로스'],
        ms_MY: 'SL',
        nl_NL: 'SL',
        pl: 'SL',
        pt: 'SL',
        ro: 'SL',
        ru: ['СЛ'],
        sv: 'SL',
        th: 'SL',
        tr: 'SL',
        vi: 'SL',
        zh: 'SL',
        zh_TW: 'SL',
      }
    },
    645560: (t) => {
      t.exports = {
        ar: ['جني الأرباح'],
        ca_ES: 'TP',
        cs: 'TP',
        de: 'TP',
        el: 'TP',
        en: 'TP',
        es: 'TP',
        fa: 'TP',
        fr: 'TP',
        he_IL: 'TP',
        hu_HU: 'TP',
        id_ID: 'TP',
        it: 'TP',
        ja: 'TP',
        ko: ['테이크프라핏'],
        ms_MY: 'TP',
        nl_NL: 'TP',
        pl: 'TP',
        pt: 'TP',
        ro: 'TP',
        ru: ['ТП'],
        sv: 'TP',
        th: 'TP',
        tr: ['KA'],
        vi: 'TP',
        zh: 'TP',
        zh_TW: 'TP',
      }
    },
    668694: (t) => {
      t.exports = {
        ar: 'TS',
        ca_ES: 'TS',
        cs: 'TS',
        de: 'TS',
        el: 'TS',
        en: 'TS',
        es: 'TS',
        fa: 'TS',
        fr: 'TS',
        he_IL: 'TS',
        hu_HU: 'TS',
        id_ID: 'TS',
        it: 'TS',
        ja: 'TS',
        ko: ['트레일링 스탑'],
        ms_MY: 'TS',
        nl_NL: 'TS',
        pl: 'TS',
        pt: 'TS',
        ro: 'TS',
        ru: ['ТС'],
        sv: 'TS',
        th: ['เทรลลิ่งสต๊อป'],
        tr: 'TS',
        vi: 'TS',
        zh: ['跟踪止损'],
        zh_TW: ['跟踪止損'],
      }
    },
    316075: (t) => {
      t.exports = {
        ar: ['إلغاء أمر'],
        ca_ES: ['Cancel·lar ordre'],
        cs: 'Cancel Order',
        de: ['Auftrag abbrechen'],
        el: 'Cancel Order',
        en: 'Cancel Order',
        es: ['Cancelar orden'],
        fa: 'Cancel Order',
        fr: ['Annuler Ordre'],
        he_IL: ['בטל פקודה'],
        hu_HU: ['Megbízás Törlése'],
        id_ID: ['Batalkan Order'],
        it: ['Annulla ordine'],
        ja: ['注文をキャンセル'],
        ko: ['주문 취소'],
        ms_MY: ['Batalkan Pesanan'],
        nl_NL: 'Cancel Order',
        pl: ['Anuluj zlecenie'],
        pt: ['Cancelar ordem'],
        ro: 'Cancel Order',
        ru: ['Отменить заявку'],
        sv: ['Avbryt order'],
        th: ['ยกเลิกคำสั่ง'],
        tr: ['Emir İptal'],
        vi: ['Hủy Lệnh'],
        zh: ['取消订单'],
        zh_TW: ['取消報單'],
      }
    },
    555937: (t) => {
      t.exports = {
        ar: ['إلغاء أمر المشروع'],
        ca_ES: 'Cancel project order',
        cs: 'Cancel project order',
        de: ['Projekt-Order stornieren'],
        el: 'Cancel project order',
        en: 'Cancel project order',
        es: ['Cancelar orden de proyecto'],
        fa: 'Cancel project order',
        fr: ["Annuler le projet d'ordre"],
        he_IL: ['בטל פקודת פרויקט'],
        hu_HU: 'Cancel project order',
        id_ID: ['Batalkan order proyek'],
        it: ['Annulla ordine del progetto'],
        ja: ['プロジェクトオーダーのキャンセル'],
        ko: ['프로젝트 주문 취소'],
        ms_MY: ['Batal pesanan projek'],
        nl_NL: 'Cancel project order',
        pl: ['Anuluj projekt zlecenia'],
        pt: ['Cancelar a ordem do projeto'],
        ro: 'Cancel project order',
        ru: ['Отменить проектную заявку'],
        sv: ['Avbryt projektorder'],
        th: ['ยกเลิกคำสั่งโปรเจค'],
        tr: ['Proje emrini iptal et'],
        vi: ['Huỷ lệnh dự án'],
        zh: ['取消项目订单'],
        zh_TW: ['取消項目訂單'],
      }
    },
    502861: (t) => {
      t.exports = {
        ar: ['تغيير نوع الأمر'],
        ca_ES: 'Change order type',
        cs: 'Change order type',
        de: ['Order-Typ ändern'],
        el: 'Change order type',
        en: 'Change order type',
        es: ['Cambiar tipo de orden'],
        fa: 'Change order type',
        fr: ["Changer le type d'ordre"],
        he_IL: ['שנה סוג הוראה'],
        hu_HU: 'Change order type',
        id_ID: ['Ubah tipe order'],
        it: ['Cambia tipo di ordine'],
        ja: ['注文タイプの変更'],
        ko: ['주문 유형 변경'],
        ms_MY: ['Tukar jenis pesanan'],
        nl_NL: 'Change order type',
        pl: ['Zmień typ zlecenia'],
        pt: ['Alterar tipo da ordem'],
        ro: 'Change order type',
        ru: ['Изменить тип заявки'],
        sv: ['Ändra ordertyp'],
        th: ['เปลี่ยนประเภทของ Stop Order'],
        tr: ['Değişiklik emri türü'],
        vi: ['Thay đổi loại lệnh'],
        zh: ['更改订单类型'],
        zh_TW: ['更改訂單類型'],
      }
    },
    437431: (t) => {
      t.exports = {
        ar: ['إغلاق صفقة'],
        ca_ES: 'Close Position',
        cs: 'Close Position',
        de: ['Position Schließen'],
        el: 'Close Position',
        en: 'Close Position',
        es: ['Cerrar posición'],
        fa: 'Close Position',
        fr: ['Fermer la Position'],
        he_IL: ['סגור פוזיציה'],
        hu_HU: ['Záró Pozíció'],
        id_ID: ['Tutup Posisi'],
        it: ['Chiudi posizione'],
        ja: ['ポジションを決済'],
        ko: ['포지션 닫기'],
        ms_MY: ['Kedudukan Penutup'],
        nl_NL: 'Close Position',
        pl: ['Zamknij pozycję'],
        pt: ['Fechar Posição'],
        ro: 'Close Position',
        ru: ['Закрыть позицию'],
        sv: ['Stäng position'],
        th: ['ปิดสถานะ'],
        tr: ['Pozisyonu Kapat'],
        vi: ['Đóng Trạng thái'],
        zh: ['平仓'],
        zh_TW: ['平倉'],
      }
    },
    46742: (t) => {
      t.exports = {
        ar: ['إضافة أمر إيقاف الخسارة'],
        ca_ES: 'Add Stop Loss',
        cs: 'Add Stop Loss',
        de: ['Stop Loss hinzufügen'],
        el: 'Add Stop Loss',
        en: 'Add Stop Loss',
        es: ['Añadir Stop Loss'],
        fa: 'Add Stop Loss',
        fr: ['Ajouter Stop Loss'],
        he_IL: ['הוסף סטופ לוס'],
        hu_HU: 'Add Stop Loss',
        id_ID: ['Dan Stop Loss'],
        it: ['Aggiungi stop loss'],
        ja: ['損切りを追加'],
        ko: ['스탑 로스 추가'],
        ms_MY: ['Tambah Renti Rugi'],
        nl_NL: 'Add Stop Loss',
        pl: ['Dodaj Stop Loss'],
        pt: ['Adcionar Stop Loss'],
        ro: 'Add Stop Loss',
        ru: ['Добавить Стоп-лосс'],
        sv: ['Lägg till en stoppförlust'],
        th: ['เพิ่ม Stop Loss'],
        tr: ["Zarar Durdur'u Ekle"],
        vi: ['Thêm Cắt Lỗ'],
        zh: ['添加止损'],
        zh_TW: ['加停損單'],
      }
    },
    223754: (t) => {
      t.exports = {
        ar: ['إضافة أمر جني الأرباح'],
        ca_ES: 'Add Take Profit',
        cs: 'Add Take Profit',
        de: ['Take Profit hinzufügen'],
        el: 'Add Take Profit',
        en: 'Add Take Profit',
        es: ['Añadir Take Profit'],
        fa: 'Add Take Profit',
        fr: ['Ajouter Take Profit'],
        he_IL: ['הוסף Take Profit'],
        hu_HU: 'Add Take Profit',
        id_ID: ['Dan Take Profit'],
        it: ['Aggiungi take profit'],
        ja: ['利益確定を追加'],
        ko: ['이익 실현 추가'],
        ms_MY: ['Tambah Ambil Untung'],
        nl_NL: 'Add Take Profit',
        pl: ['Dodaj Take Profit'],
        pt: ['Adicionar Take Profit'],
        ro: 'Add Take Profit',
        ru: ['Добавить Тейк-профит'],
        sv: ['Lägg till vinstuttag'],
        th: ['เพิ่ม Take Profit'],
        tr: ["Kar Al'ı Ekle"],
        vi: ['Thêm Chốt Lời'],
        zh: ['添加止盈'],
        zh_TW: ['增加停利單'],
      }
    },
    416976: (t) => {
      t.exports = {
        ar: ['أضف أمر الوقف المتحرك'],
        ca_ES: 'Add Trailing Stop',
        cs: 'Add Trailing Stop',
        de: ['Trailing Stop hinzufügen'],
        el: 'Add Trailing Stop',
        en: 'Add Trailing Stop',
        es: ['Añadir tope de pérdida dinámico (Trailing Stop)'],
        fa: 'Add Trailing Stop',
        fr: ['Ajouter un Trailing stop'],
        he_IL: ['הוסף סטופ נגרר'],
        hu_HU: 'Add Trailing Stop',
        id_ID: ['Tambahkan Trailing Stop'],
        it: ['Aggiungi trailing stop'],
        ja: ['トレーリングストップの追加'],
        ko: ['트레이링 스탑 넣기'],
        ms_MY: ['Tambah Hentian Jejak'],
        nl_NL: 'Add Trailing Stop',
        pl: ['Dodaj Trailing Stop'],
        pt: ['Adicionar Trailing Stop'],
        ro: 'Add Trailing Stop',
        ru: ['Добавить Трейлинг-стоп'],
        sv: ['Lägg till Trailing Stop'],
        th: ['เพิ่มเทลลิ่งสต็อป'],
        tr: ['Takipli Durdurma Ekle'],
        vi: ['Thêm điểm dừng'],
        zh: ['添加追踪止损'],
        zh_TW: ['增加追蹤停損'],
      }
    },
    618156: (t) => {
      t.exports = {
        ar: ['شراء'],
        ca_ES: 'Buy',
        cs: 'Buy',
        de: ['Kauf'],
        el: 'Buy',
        en: 'Buy',
        es: ['Comprar'],
        fa: 'Buy',
        fr: 'Buy',
        he_IL: ['קניה'],
        hu_HU: ['Vétel'],
        id_ID: ['Pembelian'],
        it: ['Compra'],
        ja: ['買い'],
        ko: ['바이'],
        ms_MY: ['Beli'],
        nl_NL: 'Buy',
        pl: ['Kup'],
        pt: ['Compra'],
        ro: 'Buy',
        ru: ['Купить'],
        sv: ['Köp'],
        th: ['ซื้อ'],
        tr: ['Al'],
        vi: ['Mua'],
        zh: ['买入'],
        zh_TW: ['買入'],
      }
    },
    937385: (t) => {
      t.exports = {
        ar: ['تعديل مشروع الأمر'],
        ca_ES: 'Edit project order',
        cs: 'Edit project order',
        de: ['Projekt-Order bearbeiten'],
        el: 'Edit project order',
        en: 'Edit project order',
        es: ['Editar orden de proyecto'],
        fa: 'Edit project order',
        fr: ["Modifier le projet d'ordre"],
        he_IL: ['ערוך פקודת פרויקט'],
        hu_HU: 'Edit project order',
        id_ID: ['Edit order proyek'],
        it: ['Modifica ordine del progetto'],
        ja: ['プロジェクトオーダーの編集'],
        ko: ['프로젝트 주문 수정'],
        ms_MY: ['Edit pesanan projek'],
        nl_NL: 'Edit project order',
        pl: ['Edytuj projekt zlecenia'],
        pt: ['Editar a ordem do projeto'],
        ro: 'Edit project order',
        ru: ['Редактировать проектную заявку'],
        sv: ['Redigera projektorder'],
        th: ['แก้ไขคำสั่งโปรเจค'],
        tr: ['Proje emrini değiştir'],
        vi: ['Chỉnh sửa lệnh dự án'],
        zh: ['编辑项目订单'],
        zh_TW: ['編輯項目訂單'],
      }
    },
    137172: (t) => {
      t.exports = {
        ar: ['تعديل الأمر...'],
        ca_ES: 'Modify Order...',
        cs: 'Modify Order...',
        de: ['Order modifizieren...'],
        el: 'Modify Order...',
        en: 'Modify Order...',
        es: ['Modificar orden...'],
        fa: 'Modify Order...',
        fr: ["Modifier l'ordre..."],
        he_IL: ['שנה הוראה...'],
        hu_HU: 'Modify Order...',
        id_ID: ['Memodifikasi Order...'],
        it: ['Modifica ordine...'],
        ja: ['注文の変更...'],
        ko: ['오더 고치기...'],
        ms_MY: ['Ubah Suai Pesanan...'],
        nl_NL: 'Modify Order...',
        pl: ['Modyfikuj zlecenie...'],
        pt: ['Modificar ordem...'],
        ro: 'Modify Order...',
        ru: ['Изменить заявку...'],
        sv: ['Ändra order...'],
        th: ['แก้ไขออเดอร์...'],
        tr: ['Emir Değiştir...'],
        vi: ['Chỉnh Lệnh...'],
        zh: ['调整订单...'],
        zh_TW: ['修改訂單...'],
      }
    },
    305806: (t) => {
      t.exports = {
        ar: ['تعديل الأمر'],
        ca_ES: 'Modify order',
        cs: 'Modify order',
        de: ['Order bearbeiten'],
        el: 'Modify order',
        en: 'Modify order',
        es: ['Modificar orden'],
        fa: 'Modify order',
        fr: ["Modifier l'ordre"],
        he_IL: ['שנה פקודה'],
        hu_HU: 'Modify order',
        id_ID: ['Ubah order'],
        it: ['Modifica ordine'],
        ja: ['注文を変更する'],
        ko: ['모디파이 오더'],
        ms_MY: ['Ubah suai pesanan'],
        nl_NL: 'Modify order',
        pl: ['Modyfikuj zlecenie'],
        pt: ['Modificar ordem'],
        ro: 'Modify order',
        ru: ['Изменить заявку'],
        sv: ['Ändra order'],
        th: ['เปลี่ยนแปลงออร์เดอร์'],
        tr: ['Emri değiştir'],
        vi: ['Điều chỉnh lệnh'],
        zh: ['修改订单'],
        zh_TW: ['修改訂單'],
      }
    },
    376303: (t) => {
      t.exports = {
        ar: ['لا توجد أوامر ومراكز متداخلة'],
        ca_ES: 'No overlap orders and positions',
        cs: 'No overlap orders and positions',
        de: ['Keine Überschneidungen von Aufträgen und Positionen'],
        el: 'No overlap orders and positions',
        en: 'No overlap orders and positions',
        es: ['No hay solapamiento de órdenes y posiciones'],
        fa: 'No overlap orders and positions',
        fr: ['Pas de chevauchement des ordres et des positions'],
        he_IL: ['אין פקודות ותפקידים חופפים'],
        hu_HU: 'No overlap orders and positions',
        id_ID: ['Tidak ada order dan posisi yang tumpang tindih'],
        it: ['No ordini sovrapposti'],
        ja: ['注文やポジションを重ねない'],
        ko: ['겹치는 주문 및 포지션이 없습니다.'],
        ms_MY: ['Tiada pesanan dan posisi bertindan'],
        nl_NL: 'No overlap orders and positions',
        pl: ['Brak nakładających się zleceń i pozycji'],
        pt: ['Sem sobreposição de ordens e posições'],
        ro: 'No overlap orders and positions',
        ru: ['Не перекрывать заявки и позиции'],
        sv: ['Inga överlappande ordrar eller positioner'],
        th: ['ไม่มีออร์เดอร์และโพสิชั่นที่ทับซ้อนกัน'],
        tr: ['Çakışan emir ve pozisyon yok'],
        vi: ['Không có lệnh và vị thế trùng lặp'],
        zh: ['无重叠订单和仓位'],
        zh_TW: ['無重疊訂單和部位'],
      }
    },
    392553: (t) => {
      t.exports = {
        ar: ['بيع'],
        ca_ES: 'Sell',
        cs: 'Sell',
        de: ['Verkauf'],
        el: 'Sell',
        en: 'Sell',
        es: ['Vender'],
        fa: 'Sell',
        fr: ['Vendre'],
        he_IL: ['מכירה'],
        hu_HU: ['Eladás'],
        id_ID: ['Penjualan'],
        it: ['Vendi'],
        ja: ['売り'],
        ko: ['셀'],
        ms_MY: ['Jual'],
        nl_NL: 'Sell',
        pl: ['Sprzedaj'],
        pt: ['Venda'],
        ro: 'Sell',
        ru: ['Продать'],
        sv: ['Sälj'],
        th: ['ขาย'],
        tr: ['Sat'],
        vi: ['Bán'],
        zh: ['卖出'],
        zh_TW: ['賣出'],
      }
    },
    619397: (t) => {
      t.exports = {
        ar: ['وقف الخسارة'],
        ca_ES: 'Stop loss',
        cs: 'Stop loss',
        de: ['Stop-Loss'],
        el: 'Stop loss',
        en: 'Stop loss',
        es: ['Stop Loss'],
        fa: 'Stop loss',
        fr: ['Stop Loss'],
        he_IL: ['סטופ לוס'],
        hu_HU: 'Stop loss',
        id_ID: ['Stop Loss'],
        it: 'Stop loss',
        ja: ['損切り'],
        ko: ['스탑로스'],
        ms_MY: ['Renti Rugi'],
        nl_NL: ['Stop-loss'],
        pl: ['Stop Loss'],
        pt: ['Stop Loss'],
        ro: ['Stop Loss'],
        ru: ['Стоп-лосс'],
        sv: ['Stop Loss'],
        th: ['ตัดขาดทุน'],
        tr: ['Zarar Durdur'],
        vi: ['Cắt lỗ'],
        zh: ['止损'],
        zh_TW: ['停損'],
      }
    },
    911810: (t) => {
      t.exports = {
        ar: ['حماية المركز'],
        ca_ES: 'Protect Position',
        cs: 'Protect Position',
        de: ['Position absichern'],
        el: 'Protect Position',
        en: 'Protect Position',
        es: ['Proteger posición'],
        fa: 'Protect Position',
        fr: ['Protéger la position'],
        he_IL: ['הגן על הפוזיציה.'],
        hu_HU: 'Protect Position',
        id_ID: ['Lindungi Posisi'],
        it: ['Proteggi posizione'],
        ja: ['ポジション保護'],
        ko: ['프로텍트 포지션'],
        ms_MY: ['Melindungi Kedudukan'],
        nl_NL: 'Protect Position',
        pl: ['Zabezpiecz pozycję'],
        pt: ['Proteger a posição'],
        ro: 'Protect Position',
        ru: ['Защитить позицию'],
        sv: ['Skydda position'],
        th: ['ป้องกันโพซิชั่น'],
        tr: ['Pozisyonu Koru'],
        vi: ['Bảo vệ Vị thế'],
        zh: ['保护持仓'],
        zh_TW: ['保護倉位'],
      }
    },
    888310: (t) => {
      t.exports = {
        ar: ['حماية المركز'],
        ca_ES: 'Protect position',
        cs: 'Protect position',
        de: ['Position absichern'],
        el: 'Protect position',
        en: 'Protect position',
        es: ['Proteger posición'],
        fa: 'Protect position',
        fr: ['Protéger la position'],
        he_IL: ['הגן על הפוזיציה.'],
        hu_HU: 'Protect position',
        id_ID: ['Lindungi posisi'],
        it: ['Proteggi posizione'],
        ja: ['ポジション保護'],
        ko: ['포지션 보호'],
        ms_MY: ['Lindungi kedudukan'],
        nl_NL: 'Protect position',
        pl: ['Zabezpiecz pozycję'],
        pt: ['Posição do projeto'],
        ro: 'Protect position',
        ru: ['Защитить позицию'],
        sv: ['Skydda position'],
        th: ['ป้องกันโพซิชั่น'],
        tr: ['Pozisyonu koru'],
        vi: ['Bảo vị vị thế'],
        zh: ['保护仓位'],
        zh_TW: ['保護部位'],
      }
    },
    419780: (t) => {
      t.exports = {
        ar: ['عكس الصفقة'],
        ca_ES: 'Reverse Position',
        cs: 'Reverse Position',
        de: ['Position Umkehren'],
        el: 'Reverse Position',
        en: 'Reverse Position',
        es: ['Revertir posición'],
        fa: 'Reverse Position',
        fr: ['Inverser la Position'],
        he_IL: ['הפוך פוזיציה'],
        hu_HU: ['Fordított Pozíció'],
        id_ID: ['Membalik Posisi'],
        it: ['Inverti posizione'],
        ja: ['ポジションを反転'],
        ko: ['리버스 포지션'],
        ms_MY: ['Kedudukan Terbalik'],
        nl_NL: 'Reverse Position',
        pl: ['Odwróć pozycje'],
        pt: ['Reverter Posição'],
        ro: 'Reverse Position',
        ru: ['Перевернуть позицию'],
        sv: ['Omvänd position'],
        th: ['ตำแหน่งการย้อนกลับ'],
        tr: ['Karşıt Pozisyon'],
        vi: ['Vị thế Đảo ngược'],
        zh: ['平仓反手'],
        zh_TW: ['平倉反手'],
      }
    },
    360538: (t) => {
      t.exports = {
        ar: ['وقف الخسارة المتحرك'],
        ca_ES: 'Trailing stop',
        cs: ['Trailing Stop'],
        de: ['Trailing Stop'],
        el: ['Trailing Stop'],
        en: 'Trailing stop',
        es: ['Tope de pérdida dinámico'],
        fa: ['Trailing Stop'],
        fr: ['Trailing Stop'],
        he_IL: ['טריילינג-סטופ'],
        hu_HU: ['Trailing Stop'],
        id_ID: ['Trailing Stop'],
        it: ['Trailing Stop'],
        ja: ['トレーリングストップ'],
        ko: ['트레일링 스탑'],
        ms_MY: ['Jejakan Renti'],
        nl_NL: ['Trailing Stop'],
        pl: ['Zlecenie Trailing Stop'],
        pt: ['Trailing Stop'],
        ro: ['Trailing Stop'],
        ru: ['Трейлинг-стоп'],
        sv: ['Efterföljande stopp'],
        th: ['การเลื่อนจุดตัดขาดทุน'],
        tr: ['İz süren Stop'],
        vi: ['Lệnh cắt lỗ dưới'],
        zh: ['跟踪止损'],
        zh_TW: ['移動停損'],
      }
    },
    777772: (t) => {
      t.exports = {
        ar: [
          '‎{pips}‎ نقطة',
          '‎{pips}‎ نقطة',
          '‎{pips}‎ نقطة',
          '‎{pips}‎ نقاط',
          '‎{pips}‎ نقطة',
          '‎{pips}‎ نقطة',
        ],
        ca_ES: '{pips} pip',
        cs: '{pips} pip',
        de: ['{pips} Pip', '{pips} Pips'],
        el: '{pips} pip',
        en: '{pips} pip',
        es: '{pips} pip',
        fa: ['{pips} pips'],
        fr: '{pips} pip',
        he_IL: ['פיפ {pips}', 'פיפס {pips}', 'פיפס {pips}', 'פיפס {pips}'],
        hu_HU: ['{pips} pips'],
        id_ID: '{pips} pip',
        it: '{pips} pip',
        ja: ['{pips}pips'],
        ko: ['{pips} 핍'],
        ms_MY: '{pips} pip',
        nl_NL: '{pips} pip',
        pl: '{pips} pip',
        pt: '{pips} pip',
        ro: '{pips} pip',
        ru: ['{pips} пипс', '{pips} пипса', '{pips} пипсов', '{pips} пипсов'],
        sv: '{pips} pip',
        th: '{pips} pip',
        tr: '{pips} pip',
        vi: '{pips} pip',
        zh: ['{pips}点'],
        zh_TW: ['{pips}點'],
      }
    },
    564225: (t) => {
      t.exports = {
        ar: [
          '‎{ticks}‎ تيك',
          '‎{ticks}‎ تيك',
          '‎{ticks}‎ تيك',
          '‎{ticks}‎ تيك',
          '‎{ticks}‎ تيك‏',
          '‎{ticks}‎ تيك',
        ],
        ca_ES: '{ticks} tick',
        cs: '{ticks} tick',
        de: ['{ticks} Tick', '{ticks} Ticks'],
        el: '{ticks} tick',
        en: '{ticks} tick',
        es: '{ticks} tick',
        fa: ['{ticks} ticks'],
        fr: '{ticks} tick',
        he_IL: [
          'טיק‎{ticks}‎',
          'טיקים ‎{ticks}‎',
          'טיקים ‎{ticks}‎',
          'טיקים ‎{ticks}‎',
        ],
        hu_HU: ['{ticks} ticks'],
        id_ID: '{ticks} tick',
        it: '{ticks} tick',
        ja: ['{ticks}ティック'],
        ko: ['{ticks} 틱'],
        ms_MY: '{ticks} tick',
        nl_NL: '{ticks} tick',
        pl: '{ticks} tick',
        pt: '{ticks} tick',
        ro: '{ticks} tick',
        ru: ['{ticks} тик', '{ticks} тика', '{ticks} тиков', '{ticks} тиков'],
        sv: '{ticks} tick',
        th: '{ticks} tick',
        tr: ['{ticks} çubuk', '{ticks} çubuk'],
        vi: '{ticks} tick',
        zh: ['{ticks}ticks'],
        zh_TW: ['{ticks}ticks'],
      }
    },
  },
])
