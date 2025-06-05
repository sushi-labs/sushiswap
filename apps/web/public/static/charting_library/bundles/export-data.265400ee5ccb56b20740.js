;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9498],
  {
    138988: (e, t, i) => {
      i.r(t), i.d(t, { exportData: () => h })
      var s = i(609838),
        l = i(650151),
        n = i(562051),
        o = i(683624),
        a = i(848801),
        r = i(602907),
        u = i(710155),
        d = i(44681),
        c = i(958049)
      const f = {
        includeTime: !0,
        includeUserTime: !1,
        includeSeries: !0,
        includeDisplayedValues: !1,
        includedStudies: 'all',
        includeOffsetStudyValues: !1,
      }
      function h(e, t = {}) {
        const i = Object.assign({}, f, t),
          s = { schema: [], data: [], displayedData: [] },
          n = e.timeScale().points(),
          r = e.mainSeries(),
          h = (0, c.getChartWidgetApiTimeConverter)(
            r.interval(),
            (0, l.ensureNotNull)(r.symbolInfo()),
            e,
          ),
          T = ((e, t) => {
            const i = e.allStudies().filter((e) => e.showInObjectTree())
            if ('all' === t) return i
            return i.filter((e) => t.includes(e.id()))
          })(e, i.includedStudies),
          y = []
        for (const e of T) {
          const t = p(e)
          y.push(t)
        }
        const N = T.map((e) => e.data())
        ;(i.includeSeries || 0 === N.length) && N.push(r.bars())
        const x = ((e, t, i, s, n) => {
          const r = (0, l.ensureNotNull)(
              e.range().value(),
              'time scale points range',
            ),
            u = ((e, t, i, s) => {
              var n, r
              const u = s.from,
                c = s.to,
                f = e.range().value(),
                h = (0, l.ensureNotNull)(
                  void 0 !== u
                    ? e.indexOf(u, !0)
                    : (0, l.ensureNotNull)(f).firstIndex,
                ),
                m = (0, l.ensureNotNull)(
                  void 0 !== c
                    ? e.indexOf(c, !0)
                    : (0, l.ensureNotNull)(f).lastIndex,
                )
              let p = m,
                T = h
              for (let e = 0; e < t.length; e++) {
                const l = t[e],
                  o = s.includeOffsetStudyValues
                    ? (0, d.max)(
                        null !==
                          (r =
                            null === (n = i[e]) || void 0 === n
                              ? void 0
                              : n.fieldPlotOffsets) && void 0 !== r
                          ? r
                          : [0],
                      )
                    : 0,
                  u = l.search(h, a.PlotRowSearchMode.NearestRight)
                null !== u && u.index < p && (p = u.index)
                const c = l.search(m, a.PlotRowSearchMode.NearestLeft)
                null !== c && c.index + o > T && (T = c.index + o)
              }
              return (
                (0, l.assert)(
                  p <= T,
                  'Range must contain at least 1 time point',
                ),
                new o.BarsRange(p, T)
              )
            })(e, t, i, n),
            c = u.firstBar(),
            f = u.lastBar(),
            h = []
          for (let e = c; e <= f; e++) {
            const t = {
              index: e,
              time: (0, l.ensureNotNull)(
                s.convertTimePointIndexToInternalTime(e),
              ),
              publicTime: (0, l.ensureNotNull)(
                s.convertTimePointIndexToPublicTime(e),
              ),
            }
            if (!(void 0 !== n.from && t.time < n.from)) {
              if (void 0 !== n.to && t.time > n.to) break
              if (!n.includeOffsetStudyValues && e > r.lastIndex) break
              h.push(t)
            }
          }
          return h.length > 0 ? new m(h) : null
        })(n, N, y, h, i)
        if (null === x) return s
        const P = x.firstBar(),
          I = x.lastBar()
        i.includeTime && s.schema.push({ type: 'time' })
        const S = s.schema.length
        i.includeUserTime && s.schema.push({ type: 'userTime' })
        const b = s.schema.length
        if (i.includeSeries) {
          const e = r.statusProvider({ hideResolution: !0 }).getSplitTitle(),
            t = Object.values(e)
              .filter((e) => '' !== e)
              .join(', ')
          s.schema.push(g('open', t)),
            s.schema.push(g('high', t)),
            s.schema.push(g('low', t)),
            s.schema.push(g('close', t))
        }
        let w = s.schema.length
        for (const e of y) s.schema.push(...e.fields)
        const D = s.schema.length
        if (0 === D) return s
        for (let e = P; e <= I; ++e) {
          const e = new Float64Array(D)
          e.fill(Number.NaN),
            s.data.push(e),
            i.includeDisplayedValues &&
              s.displayedData.push(new Array(D).fill(''))
        }
        if (i.includeTime || i.includeUserTime) {
          const t = e.dateTimeFormatter()
          for (let e = P; e <= I; ++e) {
            const n = x.item(e),
              o = n.time,
              a = n.publicTime,
              r = new Date(1e3 * (0, l.ensureNotNull)(a))
            if (
              (i.includeTime && (s.data[e - P][0] = (0, l.ensureNotNull)(o)),
              i.includeUserTime && (s.data[e - P][S] = r.getTime() / 1e3),
              i.includeDisplayedValues)
            ) {
              const l = t.format(r)
              i.includeTime && (s.displayedData[e - P][0] = l),
                i.includeUserTime && (s.displayedData[e - P][S] = l)
            }
          }
        }
        if (i.includeSeries) {
          const e = r.bars().range(P, I),
            t = (0, u.getPriceValueFormatterForSource)(r)
          e.each((e, l) => {
            const n = s.data[e - P],
              o = v(l[1]),
              a = v(l[2]),
              r = v(l[3]),
              u = v(l[4])
            if (
              ((n[b] = o),
              (n[b + 1] = a),
              (n[b + 2] = r),
              (n[b + 3] = u),
              i.includeDisplayedValues)
            ) {
              const i = s.displayedData[e - P]
              ;(i[b] = t(o)),
                (i[b + 1] = t(a)),
                (i[b + 2] = t(r)),
                (i[b + 3] = t(u))
            }
            return !1
          })
        }
        for (let e = 0; e < T.length; ++e) {
          const t = T[e],
            l = y[e]
          for (let e = 0; e < l.fields.length; ++e) {
            const n = (0, u.getPriceValueFormatterForStudy)(
                t,
                l.fields[e].plotId,
              ),
              o = l.fieldPlotOffsets[e],
              a = l.fieldToPlotIndex[e],
              r = P - o,
              d = I - o,
              c = w + e
            t.data()
              .range(r, d)
              .each((e, t) => {
                const l = s.data[e - r],
                  o = v(t[a])
                return (
                  (l[c] = o),
                  i.includeDisplayedValues &&
                    (s.displayedData[e - r][c] = n(o)),
                  !1
                )
              })
          }
          w += l.fields.length
        }
        return s
      }
      class m {
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
      function p(e) {
        const t = e.metaInfo(),
          o = { fieldToPlotIndex: [], fieldPlotOffsets: [], fields: [] },
          a = e.id(),
          u = e.title(n.TitleDisplayTarget.StatusLine, !1, void 0, !1)
        for (let n = 0; n < t.plots.length; ++n) {
          const d = t.plots[n]
          let c,
            f = ''
          if (
            (0, r.isLinePlot)(d) ||
            (0, r.isShapesPlot)(d) ||
            (0, r.isCharsPlot)(d) ||
            (0, r.isArrowsPlot)(d)
          )
            c = (0, l.ensureDefined)(t.styles)[d.id]
          else if ((0, r.isOhlcPlot)(d))
            switch (((c = t.ohlcPlots && t.ohlcPlots[d.target]), d.type)) {
              case 'ohlc_open':
                f = ` (${s.t(null, void 0, i(539280))})`
                break
              case 'ohlc_high':
                f = ` (${s.t(null, void 0, i(330777))}`
                break
              case 'ohlc_low':
                f = ` (${s.t(null, void 0, i(608136))})`
                break
              case 'ohlc_close':
                f = ` (${s.t(null, void 0, i(931691))})`
            }
          if (void 0 === c || void 0 === c.title) continue
          const h = `${c.title}${f}`
          o.fields.push(T(a, u, h, d.id)),
            o.fieldToPlotIndex.push(n + 1),
            o.fieldPlotOffsets.push(e.offset(d.id))
        }
        return o
      }
      function T(e, t, i, s) {
        return {
          type: 'value',
          sourceType: 'study',
          sourceId: e,
          sourceTitle: t,
          plotTitle: i,
          plotId: s,
        }
      }
      function g(e, t) {
        return {
          type: 'value',
          sourceType: 'series',
          plotTitle: e,
          sourceTitle: t,
        }
      }
      function v(e) {
        return null != e ? e : Number.NaN
      }
    },
  },
])
