;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9498],
  {
    99992: (e, l, t) => {
      t.r(l), t.d(l, { exportData: () => m })
      var s = t(11542),
        i = t(50151),
        n = t(19466),
        o = t(79036),
        u = t(91988),
        a = t(8025),
        d = t(68805),
        r = t(94113),
        c = t(41991),
        f = t(9859),
        h = t(17730)
      const p = {
        includeTime: !0,
        includeUserTime: !1,
        includeSeries: !0,
        includeDisplayedValues: !1,
        includedStudies: 'all',
        includeOffsetStudyValues: !1,
        includeOHLCValuesForSingleValuePlots: !1,
        includeHiddenStudies: !1,
      }
      async function m(e, l = {}) {
        const t = Object.assign({}, p, l),
          s = { schema: [], data: [], displayedData: [], indexes: [] },
          n = e.timeScale().points(),
          r = e.mainSeries(),
          m = r.style(),
          S =
            !l.includeOHLCValuesForSingleValuePlots &&
            (0, d.isSingleValueBasedStyle)(m),
          N = (0, i.ensureNotNull)(r.symbolInfo()),
          v = (0, h.getChartWidgetApiTimeConverter)(r.interval(), N, e),
          V =
            !l.includeOHLCValuesForSingleValuePlots &&
            (0, d.isCloseBasedSymbol)(N),
          I = ((e, l, t) => {
            const s = e
              .allStudies()
              .filter((e) => e.showInObjectTree() && (t || e.isVisible()))
            if ('all' === l) return s
            return s.filter((e) => l.includes(e.id()))
          })(e, t.includedStudies, t.includeHiddenStudies),
          O = [],
          b = []
        if (t.includeHiddenStudies) {
          for (const e of I)
            e.isVisible() || (O.push(e), b.push(e.start(!0, !0)))
          b.length > 0 &&
            (await Promise.all(b),
            await new Promise((e) => {
              setTimeout(() => e())
            }))
        }
        try {
          const h = []
          for (const e of I) {
            const t = (0, o.isOverlayStudy)(e) ? T(e, l) : y(e)
            h.push(t)
          }
          const p = I.map((e) => e.data())
          ;(t.includeSeries || 0 === p.length) && p.push(r.bars())
          const N = ((e, l, t, s, n) => {
            const o = (0, i.ensureNotNull)(
                e.range().value(),
                'time scale points range',
              ),
              d = ((e, l, t, s) => {
                const n = s.from,
                  o = s.to,
                  d = e.range().value(),
                  r = (0, i.ensureNotNull)(
                    void 0 !== n
                      ? e.indexOf(n, !0)
                      : (0, i.ensureNotNull)(d).firstIndex,
                  ),
                  c = (0, i.ensureNotNull)(
                    void 0 !== o
                      ? e.indexOf(o, !0)
                      : (0, i.ensureNotNull)(d).lastIndex,
                  )
                let h = c,
                  p = r
                for (let e = 0; e < l.length; e++) {
                  const i = l[e],
                    n = s.includeOffsetStudyValues
                      ? (0, f.max)(t[e]?.fieldPlotOffsets ?? [0])
                      : 0,
                    o = i.search(r, a.PlotRowSearchMode.NearestRight)
                  null !== o && o.index < h && (h = o.index)
                  const u = i.search(c, a.PlotRowSearchMode.NearestLeft)
                  null !== u && u.index + n > p && (p = u.index + n)
                }
                return (
                  (0, i.assert)(
                    h <= p,
                    'Range must contain at least 1 time point',
                  ),
                  new u.BarsRange(h, p)
                )
              })(e, l, t, n),
              r = d.firstBar(),
              c = d.lastBar(),
              h = []
            for (let e = r; e <= c; e++) {
              const l = {
                index: e,
                time: (0, i.ensureNotNull)(
                  s.convertTimePointIndexToInternalTime(e),
                ),
                publicTime: (0, i.ensureNotNull)(
                  s.convertTimePointIndexToPublicTime(e),
                ),
              }
              if (!(void 0 !== n.from && l.time < n.from)) {
                if (void 0 !== n.to && l.time > n.to) break
                if (!n.includeOffsetStudyValues && e > o.lastIndex) break
                h.push(l)
              }
            }
            return h.length > 0 ? new g(h) : null
          })(n, p, h, v, t)
          if (null === N) return s
          const O = N.firstBar(),
            b = N.lastBar()
          t.includeTime && s.schema.push({ type: 'time' })
          const w = s.schema.length
          t.includeUserTime && s.schema.push({ type: 'userTime' })
          const D = s.schema.length
          if (t.includeSeries) {
            const e = r.statusProvider({ hideResolution: !0 }).getSplitTitle(),
              l = Object.values(e)
                .filter((e) => '' !== e)
                .join(', ')
            s.schema.push(
              ...((e, l, t, s, n) => {
                const o = []
                t
                  ? o.push(P('close', e))
                  : s
                    ? o.push(P((0, i.ensureNotNull)(n), e))
                    : 12 === l
                      ? o.push(P('high', e), P('low', e))
                      : 16 === l || 21 === l
                        ? o.push(P('high', e), P('low', e), P('close', e))
                        : o.push(
                            P('open', e),
                            P('high', e),
                            P('low', e),
                            P('close', e),
                          )
                return o
              })(l, m, V, S, r.priceSource()),
            )
          }
          let F = s.schema.length
          for (const e of h) s.schema.push(...e.fields)
          const C = s.schema.length
          if (0 === C) return s
          for (let e = O; e <= b; ++e) {
            const l = new Float64Array(C)
            l.fill(Number.NaN),
              s.data.push(l),
              s.indexes.push(e),
              t.includeDisplayedValues &&
                s.displayedData.push(new Array(C).fill(''))
          }
          if (t.includeTime || t.includeUserTime) {
            const l = e.dateTimeFormatter()
            for (let e = O; e <= b; ++e) {
              const n = N.item(e),
                o = n.time,
                u = n.publicTime,
                a = new Date(1e3 * (0, i.ensureNotNull)(u))
              if (
                (t.includeTime && (s.data[e - O][0] = (0, i.ensureNotNull)(o)),
                t.includeUserTime && (s.data[e - O][w] = a.getTime() / 1e3),
                t.includeDisplayedValues)
              ) {
                const i = l.format(a)
                t.includeTime && (s.displayedData[e - O][0] = i),
                  t.includeUserTime && (s.displayedData[e - O][w] = i)
              }
            }
          }
          if (t.includeSeries) {
            const e = r.bars().range(O, b),
              l = (0, c.getPriceValueFormatterForSource)(r),
              i = (e) => l(e, { ignoreLocaleNumberFormat: !0 }),
              n = r.barFunction()
            e.each((e, l) => {
              const o = s.data[e - O],
                u = x(l[4])
              if (V) {
                if (((o[D] = u), t.includeDisplayedValues)) {
                  s.displayedData[e - O][D] = i(u)
                }
              } else if (S) {
                const u = n(l)
                if (((o[D] = u), t.includeDisplayedValues)) {
                  s.displayedData[e - O][D] = i(u)
                }
              } else {
                const n = x(l[1]),
                  a = x(l[2]),
                  d = x(l[3])
                if (
                  (12 === m
                    ? ((o[D] = a), (o[D + 1] = d))
                    : 16 === m || 21 === m
                      ? ((o[D] = a), (o[D + 1] = d), (o[D + 2] = u))
                      : ((o[D] = n),
                        (o[D + 1] = a),
                        (o[D + 2] = d),
                        (o[D + 3] = u)),
                  t.includeDisplayedValues)
                ) {
                  const l = s.displayedData[e - O]
                  12 === m
                    ? ((l[D] = i(a)), (l[D + 1] = i(d)))
                    : 16 === m || 21 === m
                      ? ((l[D] = i(a)), (l[D + 1] = i(d)), (l[D + 2] = i(u)))
                      : ((l[D] = i(n)),
                        (l[D + 1] = i(a)),
                        (l[D + 2] = i(d)),
                        (l[D + 3] = i(u)))
                }
              }
              return !1
            })
          }
          for (let e = 0; e < I.length; ++e) {
            const n = I[e],
              u = h[e]
            let a,
              r = !1,
              f = !1
            ;(0, o.isOverlayStudy)(n) &&
              ((a = n.barFunction()),
              (r =
                !l.includeOHLCValuesForSingleValuePlots &&
                (0, d.isCloseBasedSymbol)(n.symbolInfo())),
              (f =
                !l.includeOHLCValuesForSingleValuePlots &&
                (0, d.isSingleValueBasedStyle)(n.style())))
            for (let e = 0; e < u.fields.length; ++e) {
              const l = (0, c.getPriceValueFormatterForStudy)(
                  n,
                  u.fields[e].plotId,
                ),
                o = (e) => l(e, { ignoreLocaleNumberFormat: !0 }),
                d = u.fieldPlotOffsets[e],
                h = u.fieldToPlotIndex[e],
                p = O - d,
                m = b - d,
                g = F + e
              n.data()
                .range(p, m)
                .each((e, l) => {
                  const n = s.data[e - p]
                  let u
                  return (
                    (u = r
                      ? x(l[4])
                      : f
                        ? (0, i.ensureDefined)(a)(l)
                        : x(l[h])),
                    (n[g] = u),
                    t.includeDisplayedValues &&
                      (s.displayedData[e - p][g] = o(u)),
                    !1
                  )
                })
            }
            F += u.fields.length
          }
          return s
        } catch (e) {
          throw e
        } finally {
          for (const e of O) e.stop()
        }
      }
      class g {
        constructor(e) {
          ;(this._items = e),
            (this._firstIndex = this._items[0].index),
            (this._lastIndex = this._items[this._items.length - 1].index)
        }
        firstBar() {
          return this._firstIndex
        }
        lastBar() {
          return this._lastIndex
        }
        item(e) {
          return this._items[e - this._firstIndex]
        }
      }
      function y(e) {
        const l = e.metaInfo(),
          o = { fieldToPlotIndex: [], fieldPlotOffsets: [], fields: [] },
          u = e.id(),
          a = e.properties().childs(),
          d = e.title(n.TitleDisplayTarget.StatusLine, !1, void 0, !1)
        for (let n = 0; n < l.plots.length; ++n) {
          const c = l.plots[n]
          let f,
            h = ''
          if ((0, r.isPlotSupportDisplay)(c)) {
            const e = a.styles.childs()[c.id]
            if (void 0 !== e && 0 === e.childs().display.value()) continue
            f = (0, i.ensureDefined)(l.styles)[c.id]
          } else if ((0, r.isOhlcPlot)(c)) {
            const e = a.ohlcPlots.childs()[c.target]
            if (void 0 !== e && 0 === e.childs().display.value()) continue
            switch (((f = l.ohlcPlots && l.ohlcPlots[c.target]), c.type)) {
              case 'ohlc_open':
                h = ` (${s.t(null, void 0, t(16610))})`
                break
              case 'ohlc_high':
                h = ` (${s.t(null, void 0, t(78254))}`
                break
              case 'ohlc_low':
                h = ` (${s.t(null, void 0, t(65318))})`
                break
              case 'ohlc_close':
                h = ` (${s.t(null, void 0, t(62578))})`
            }
          }
          if (void 0 === f || void 0 === f.title) continue
          const p = `${f.title}${h}`
          o.fields.push(S(u, d, p, c.id)),
            o.fieldToPlotIndex.push(n + 1),
            o.fieldPlotOffsets.push(e.offset(c.id))
        }
        return o
      }
      function T(e, l) {
        const t = { fieldToPlotIndex: [], fieldPlotOffsets: [], fields: [] },
          s = e.id(),
          o = e.title(n.TitleDisplayTarget.StatusLine, !1, void 0, !1),
          u = e.style(),
          a =
            !l.includeOHLCValuesForSingleValuePlots &&
            (0, d.isCloseBasedSymbol)(e.symbolInfo()),
          r =
            !l.includeOHLCValuesForSingleValuePlots &&
            (0, d.isSingleValueBasedStyle)(u)
        if (a)
          t.fields.push(S(s, o, 'close', 'close')),
            t.fieldToPlotIndex.push(4),
            t.fieldPlotOffsets.push(0)
        else if (r) {
          const l = (0, i.ensureNotNull)(e.priceSource())
          t.fields.push(S(s, o, l, l)),
            t.fieldToPlotIndex.push(1),
            t.fieldPlotOffsets.push(0)
        } else
          12 === u
            ? (t.fields.push(S(s, o, 'high', 'high'), S(s, o, 'low', 'low')),
              t.fieldToPlotIndex.push(3, 2),
              t.fieldPlotOffsets.push(0, 0))
            : 16 === u || 21 === u
              ? (t.fields.push(
                  S(s, o, 'high', 'high'),
                  S(s, o, 'low', 'low'),
                  S(s, o, 'close', 'close'),
                ),
                t.fieldToPlotIndex.push(2, 3, 4),
                t.fieldPlotOffsets.push(0, 0, 0))
              : (t.fields.push(
                  S(s, o, 'open', 'open'),
                  S(s, o, 'high', 'high'),
                  S(s, o, 'low', 'low'),
                  S(s, o, 'close', 'close'),
                ),
                t.fieldToPlotIndex.push(1, 2, 3, 4),
                t.fieldPlotOffsets.push(0, 0, 0, 0))
        return t
      }
      function S(e, l, t, s) {
        return {
          type: 'value',
          sourceType: 'study',
          sourceId: e,
          sourceTitle: l,
          plotTitle: t,
          plotId: s,
        }
      }
      function P(e, l) {
        return {
          type: 'value',
          sourceType: 'series',
          plotTitle: e,
          sourceTitle: l,
        }
      }
      function x(e) {
        return null != e ? e : Number.NaN
      }
    },
  },
])
