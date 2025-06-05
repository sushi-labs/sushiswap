;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7663],
  {
    27267: (e, t, n) => {
      function s(e, t, n, s, r) {
        function i(r) {
          if (e > r.timeStamp) return
          const i = r.target
          void 0 !== n &&
            null !== t &&
            null !== i &&
            i.ownerDocument === s &&
            (t.contains(i) || n(r))
        }
        return (
          r.click && s.addEventListener('click', i, !1),
          r.mouseDown && s.addEventListener('mousedown', i, !1),
          r.touchEnd && s.addEventListener('touchend', i, !1),
          r.touchStart && s.addEventListener('touchstart', i, !1),
          () => {
            s.removeEventListener('click', i, !1),
              s.removeEventListener('mousedown', i, !1),
              s.removeEventListener('touchend', i, !1),
              s.removeEventListener('touchstart', i, !1)
          }
        )
      }
      n.d(t, { addOutsideEventListener: () => s })
    },
    36279: (e, t, n) => {
      var s
      n.d(t, { LogoSize: () => s, getLogoUrlResolver: () => a }),
        ((e) => {
          ;(e[(e.Medium = 0)] = 'Medium'), (e[(e.Large = 1)] = 'Large')
        })(s || (s = {}))
      class r {
        getSymbolLogoUrl(e) {
          return e
        }
        getCountryFlagUrl() {
          return ''
        }
        getCryptoLogoUrl(e) {
          return e
        }
        getProviderLogoUrl(e) {
          return e
        }
        getSourceLogoUrl(e) {
          return e
        }
      }
      let i
      function a() {
        return i || (i = new r()), i
      }
    },
    77975: (e, t, n) => {
      n.d(t, { useWatchedValueReadonly: () => r })
      var s = n(50959)
      const r = (e, t = !1) => {
        const n = 'watchedValue' in e ? e.watchedValue : void 0,
          r = 'defaultValue' in e ? e.defaultValue : e.watchedValue.value(),
          [i, a] = (0, s.useState)(n ? n.value() : r)
        return (
          (t ? s.useLayoutEffect : s.useEffect)(() => {
            if (n) {
              a(n.value())
              const e = (e) => a(e)
              return n.subscribe(e), () => n.unsubscribe(e)
            }
            return () => {}
          }, [n]),
          i
        )
      }
    },
    83314: (e) => {
      e.exports = {
        wrapper: 'wrapper-hPiAkrn3',
        timezone: 'timezone-hPiAkrn3',
        largePadding: 'largePadding-hPiAkrn3',
        sessionDayWrapper: 'sessionDayWrapper-hPiAkrn3',
        nowWrapper: 'nowWrapper-hPiAkrn3',
        now: 'now-hPiAkrn3',
        sessionDay: 'sessionDay-hPiAkrn3',
        weekDay: 'weekDay-hPiAkrn3',
        sessionDaySegments: 'sessionDaySegments-hPiAkrn3',
        timeMarkWrapper: 'timeMarkWrapper-hPiAkrn3',
        timeMarkSegment: 'timeMarkSegment-hPiAkrn3',
        timeMark: 'timeMark-hPiAkrn3',
        timeMarkSegmentAlignByEnds: 'timeMarkSegmentAlignByEnds-hPiAkrn3',
        segment: 'segment-hPiAkrn3',
        small: 'small-hPiAkrn3',
        start: 'start-hPiAkrn3',
        end: 'end-hPiAkrn3',
        active: 'active-hPiAkrn3',
        green: 'green-hPiAkrn3',
        orange: 'orange-hPiAkrn3',
        blue: 'blue-hPiAkrn3',
        gray: 'gray-hPiAkrn3',
        tooltip: 'tooltip-hPiAkrn3',
        time: 'time-hPiAkrn3',
      }
    },
    34392: (e, t, n) => {
      n.d(t, { FullSessionScheduleRenderer: () => k })
      var s = n(50959),
        r = n(97754),
        i = n(50151),
        a = n(11542),
        o = n(77975),
        l = n(36174),
        u = n(83314)
      const d = new WeakMap()
      function c(e) {
        return (
          d.has(e) || d.set(e, (0, l.randomHash)()),
          (0, i.ensureDefined)(d.get(e))
        )
      }
      const y = new Map([
          [0, u.green],
          [1, u.orange],
          [2, u.blue],
          [3, u.gray],
        ]),
        v = new Map([
          [0, a.t(null, void 0, n(83949))],
          [1, a.t(null, void 0, n(56042))],
          [2, a.t(null, void 0, n(29985))],
          [3, a.t(null, void 0, n(95814))],
        ]),
        f = a.t(null, void 0, n(80227))
      function m(e) {
        const { segment: t, forceStart: n, forceEnd: i } = e,
          a = t.end.value - t.start.value,
          o = a < 0.03,
          l = {
            left: 100 * t.start.value + '%',
            width: `calc(${100 * a}% + ${o ? 2 : 0}px)`,
          },
          d = r(
            u.segment,
            y.get(t.type),
            (n || t.start.isFirstOrLastPoint) && u.start,
            (i || t.end.isFirstOrLastPoint) && u.end,
            o && u.small,
            'common-tooltip-html',
            'apply-common-tooltip',
          ),
          c = ((e, t) =>
            `<div class="${u.tooltip}">\n\t\t<span class="${y.get(t)}">${v.get(t)}</span>\n\t\t<span class="${u.time}">${e}</span>\n\t</div>`)(
            t.tooltip,
            t.type,
          )
        return s.createElement('div', {
          className: d,
          style: l,
          'data-tooltip': c,
        })
      }
      function D(e) {
        const { sessionDay: t } = e,
          n = t.entries.map((e, n) =>
            s.createElement(m, {
              key: `${c(e)}Segment`,
              segment: e,
              forceStart: 0 === n && 3 === e.type,
              forceEnd: n === t.entries.length - 1 && 3 === e.type,
            }),
          ),
          i = r(u.sessionDay, t.isActive && u.active)
        return s.createElement(
          'div',
          { className: i },
          s.createElement('div', { className: u.weekDay }, t.title),
          s.createElement('div', { className: u.sessionDaySegments }, n),
        )
      }
      function h(e) {
        const { sessionDays: t, currentTimeMark: n } = e,
          i = [],
          a = Number.parseInt(
            Object.keys(t).filter((e) => t[Number.parseInt(e)].isActive)[0],
          ),
          o = t[a],
          l = o.entries.filter((e) => e.start.value <= n && e.end.value >= n)[0]
        !l.start.isFirstOrLastPoint && l.showStartForLastEntry
          ? i.push(o.entries[o.entries.length - 1].start)
          : i.push(l.start)
        const d =
          !l.end.isFirstOrLastPoint && l.showEndForFirstEntry
            ? o.entries[0].end
            : l.end
        if ((i[0].value !== d.value && i.push(d), 0 === i.length)) return null
        i.sort((e, t) => e.value - t.value)
        const y = i.map((e) =>
            s.createElement(
              'div',
              { key: c(e), className: u.timeMark },
              e.title,
            ),
          ),
          v = 100 * (2 === i.length ? i[1].value - i[0].value : 0),
          f = r(v > 12 && u.timeMarkSegmentAlignByEnds, u.timeMarkSegment)
        return s.createElement(
          'div',
          { className: u.sessionDay },
          s.createElement('div', { className: u.weekDay }),
          s.createElement(
            'div',
            { className: u.timeMarkWrapper },
            s.createElement(
              'div',
              {
                className: f,
                style: { left: 100 * i[0].value + '%', width: `${v}%` },
              },
              y,
            ),
          ),
        )
      }
      function k(e) {
        const {
            key: t,
            className: n,
            now: i,
            timezone: a,
            showAllDays: l,
            timeZoneClassName: d,
          } = e,
          c = (0, o.useWatchedValueReadonly)({ watchedValue: e.sessionDays }),
          y = Object.values(c).filter((e) => e.isActive)[0],
          v = r(n, u.wrapper)
        return s.createElement(
          'div',
          { key: t, className: v },
          s.createElement(
            'div',
            { className: u.sessionDayWrapper },
            l
              ? s.createElement(
                  s.Fragment,
                  null,
                  Object.values(c).map((e, t) =>
                    s.createElement(D, { key: t, sessionDay: e }),
                  ),
                )
              : s.createElement(D, { sessionDay: y }),
            s.createElement(
              'div',
              { className: u.nowWrapper },
              s.createElement('div', {
                className: u.now,
                style: { left: 100 * i + '%' },
              }),
            ),
          ),
          s.createElement(h, { sessionDays: c, currentTimeMark: i }),
          s.createElement(
            'div',
            { className: r(u.timezone, d, l && u.largePadding) },
            `${f}: ${a}`,
          ),
        )
      }
    },
    76413: (e, t, n) => {
      n.d(t, { FullSessionScheduleViewModel: () => te })
      var s = n(38618),
        r = n(1722),
        i = n(41249),
        a = n(97145)
      function o(e) {
        return e / i.minutesPerDay
      }
      function l(e) {
        return Math.round(e * i.minutesPerDay)
      }
      var u = n(81702),
        d = n(62900),
        c = n(50151),
        y = n(22767),
        v = n(84917)
      const f = [
        v.WeekDays.SUNDAY,
        v.WeekDays.MONDAY,
        v.WeekDays.TUESDAY,
        v.WeekDays.WEDNESDAY,
        v.WeekDays.THURSDAY,
        v.WeekDays.FRIDAY,
        v.WeekDays.SATURDAY,
      ]
      function m(e, t) {
        return ((e + t + 6) % 7) + 1
      }
      function D(e) {
        return (t) => m(t, e)
      }
      const h = D(-1),
        k = D(1)
      var p = n(11542)
      v.Months.JANUARY,
        p.t(null, void 0, n(26910)),
        v.Months.FEBRUARY,
        p.t(null, void 0, n(16467)),
        v.Months.MARCH,
        p.t(null, void 0, n(84675)),
        v.Months.APRIL,
        p.t(null, void 0, n(97637)),
        v.Months.MAY,
        p.t(null, void 0, n(68327)),
        v.Months.JUNE,
        p.t(null, void 0, n(49385)),
        v.Months.JULY,
        p.t(null, void 0, n(23230)),
        v.Months.AUGUST,
        p.t(null, void 0, n(86797)),
        v.Months.SEPTEMBER,
        p.t(null, void 0, n(61132)),
        v.Months.OCTOBER,
        p.t(null, void 0, n(90784)),
        v.Months.NOVEMBER,
        p.t(null, void 0, n(71194)),
        v.Months.DECEMBER,
        p.t(null, void 0, n(55669)),
        v.Months.JANUARY,
        p.t(null, void 0, n(95425)),
        v.Months.FEBRUARY,
        p.t(null, void 0, n(35050)),
        v.Months.MARCH,
        p.t(null, void 0, n(51369)),
        v.Months.APRIL,
        p.t(null, void 0, n(42762)),
        v.Months.MAY,
        p.t(null, { context: 'short' }, n(27991)),
        v.Months.JUNE,
        p.t(null, void 0, n(15224)),
        v.Months.JULY,
        p.t(null, void 0, n(6215)),
        v.Months.AUGUST,
        p.t(null, void 0, n(38465)),
        v.Months.SEPTEMBER,
        p.t(null, void 0, n(57902)),
        v.Months.OCTOBER,
        p.t(null, void 0, n(73546)),
        v.Months.NOVEMBER,
        p.t(null, void 0, n(71230)),
        v.Months.DECEMBER,
        p.t(null, void 0, n(92203)),
        v.WeekDays.SUNDAY,
        p.t(null, void 0, n(72149)),
        v.WeekDays.MONDAY,
        p.t(null, void 0, n(61199)),
        v.WeekDays.TUESDAY,
        p.t(null, void 0, n(44979)),
        v.WeekDays.WEDNESDAY,
        p.t(null, void 0, n(7147)),
        v.WeekDays.THURSDAY,
        p.t(null, void 0, n(7951)),
        v.WeekDays.FRIDAY,
        p.t(null, void 0, n(72970)),
        v.WeekDays.SATURDAY,
        p.t(null, void 0, n(1144))
      const E = {
        [v.WeekDays.SUNDAY]: p.t(null, void 0, n(86577)),
        [v.WeekDays.MONDAY]: p.t(null, void 0, n(83085)),
        [v.WeekDays.TUESDAY]: p.t(null, void 0, n(94316)),
        [v.WeekDays.WEDNESDAY]: p.t(null, void 0, n(75094)),
        [v.WeekDays.THURSDAY]: p.t(null, void 0, n(9787)),
        [v.WeekDays.FRIDAY]: p.t(null, void 0, n(564)),
        [v.WeekDays.SATURDAY]: p.t(null, void 0, n(36835)),
      }
      v.WeekDays.SUNDAY,
        p.t(null, { context: 'day_of_week' }, n(85954)),
        v.WeekDays.MONDAY,
        p.t(null, { context: 'day_of_week' }, n(11268)),
        v.WeekDays.TUESDAY,
        p.t(null, { context: 'day_of_week' }, n(31533)),
        v.WeekDays.WEDNESDAY,
        p.t(null, { context: 'day_of_week' }, n(26230)),
        v.WeekDays.THURSDAY,
        p.t(null, { context: 'day_of_week' }, n(24793)),
        v.WeekDays.FRIDAY,
        p.t(null, { context: 'day_of_week' }, n(19801)),
        v.WeekDays.SATURDAY,
        p.t(null, { context: 'day_of_week' }, n(63331))
      var g = n(83854)
      function A(e) {
        for (
          (0, c.assert)(
            Number.isInteger(e),
            'timeMinutes expected to be integer number',
          );
          e > i.minutesPerDay;
        )
          e -= i.minutesPerDay
        const t = e % 60,
          n = (e - t) / 60
        return (
          (0, g.numberToStringWithLeadingZero)(n, 2) +
          ':' +
          (0, g.numberToStringWithLeadingZero)(t, 2)
        )
      }
      function S(e, t) {
        return `${e} — ${t}`
      }
      function w(e, t) {
        return `${E[e]} ${A(t)}`
      }
      function M(e, t, n, s) {
        ;(0, c.assert)(
          t !== i.minutesPerDay,
          'Start time expected to be normalized (24:00 as range start is not allowed)',
        ),
          (0, c.assert)(
            0 !== s,
            'End time expected to be normalized (00:00 as range end is not allowed)',
          )
        const r = ((e, t, n, s) => {
          const r = e * i.minutesPerDay + t
          let a = n * i.minutesPerDay + s
          return a < r && (a += 7 * i.minutesPerDay), a - r
        })(e, t, n, s)
        return r < i.minutesPerDay || (r === i.minutesPerDay && 0 === t)
          ? ((e, t) => S(A(e), A(t)))(t, s)
          : ((e, t, n, s) => S(w(e, t), w(n, s)))(e, t, n, s)
      }
      function P(e, t, n, s) {
        return {
          start: e,
          end: t,
          type: n,
          tooltip: s,
          showStartForLastEntry: !1,
          showEndForFirstEntry: !1,
        }
      }
      function W(e) {
        return { value: e, title: A(l(e)), isFirstOrLastPoint: !0 }
      }
      function x(e) {
        return 3 !== e.type
      }
      function _(e, t) {
        return { dayIndex: e, entries: t.filter(x) }
      }
      function L(e, t, n, s = t) {
        const r = n(t),
          i = e[r]
        return r !== s && 0 === i.entries.length
          ? L(e, r, n, s)
          : _(r, e[r].entries)
      }
      function N(e) {
        return (t, n) => L(t, n, e)
      }
      const I = N(h),
        Y = N(k)
      function b(e, t, n, s) {
        return (r, i, a) =>
          void 0 === r ? [s, a] : r === e ? [t, n(i)] : [r, i]
      }
      const T = b(1, 0, k, 0),
        U = b(0, 1, h, 1)
      function R(e, t, n, s, r) {
        const [i, a] = T(e, t, r),
          [o, u] = U(n, s, r)
        ;(0, c.assert)(
          t !== n || i < o,
          `Days are same (${t}) but prev entry time (${i}) >= next entry time (${o})`,
        )
        const d = l(i),
          y = l(o)
        return P(W(a !== r ? 0 : i), W(u !== r ? 1 : o), 3, M(a, d, u, y))
      }
      function F(e, t, n, s, r) {
        var i, a
        return R(
          null === (i = null == e ? void 0 : e.end) || void 0 === i
            ? void 0
            : i.value,
          t,
          null === (a = null == n ? void 0 : n.start) || void 0 === a
            ? void 0
            : a.value,
          s,
          r,
        )
      }
      function O(e) {
        const t = [...e.entries]
        for (let n = 1; n < e.entries.length; n++) {
          const s = e.entries[n - 1],
            r = e.entries[n]
          if (r.start.value !== s.end.value) {
            const n = F(s, e.dayIndex, r, e.dayIndex, e.dayIndex)
            t.push(n)
          }
        }
        return t.sort((e, t) => e.start.value - t.start.value), t
      }
      function $(e, t) {
        const n = (0, d.default)(t.entries),
          s = t.dayIndex,
          r = (0, c.ensureDefined)((0, u.default)(e.entries))
        return 0 === r.start.value ? [] : [F(n, s, r, e.dayIndex, e.dayIndex)]
      }
      function B(e, t) {
        const n = (0, u.default)(t.entries),
          s = t.dayIndex,
          r = (0, c.ensureDefined)((0, d.default)(e.entries))
        return 1 === r.end.value ? [] : [F(r, e.dayIndex, n, s, e.dayIndex)]
      }
      function V(e, t) {
        var n, s
        const i = {
          thisDay: _(e, t[e].entries),
          prevDay: I(t, e),
          nextDay: Y(t, e),
        }
        return null !==
          (s =
            null !==
              (n = (({ thisDay: e, prevDay: t, nextDay: n }) => {
                if (0 === e.entries.length)
                  return [
                    F(
                      (0, d.default)(t.entries),
                      t.dayIndex,
                      (0, u.default)(n.entries),
                      n.dayIndex,
                      e.dayIndex,
                    ),
                  ]
              })(i)) && void 0 !== n
              ? n
              : (({ thisDay: e, prevDay: t, nextDay: n }) => {
                  const s = e.dayIndex
                  if (t.dayIndex !== s || n.dayIndex !== s) return
                  const i = e.entries,
                    a = (0, c.ensureDefined)((0, u.default)(i)),
                    o = (0, c.ensureDefined)((0, d.default)(i))
                  return [
                    0 !== a.start.value ? R(0, s, a.start.value, s, s) : void 0,
                    ...O(e),
                    1 !== o.end.value ? R(o.end.value, s, 1, s, s) : void 0,
                  ].filter(r.isExistent)
                })(i)) && void 0 !== s
          ? s
          : ((e) => [
              ...$(e.thisDay, e.prevDay),
              ...O(e.thisDay),
              ...B(e.thisDay, e.nextDay),
            ])(i)
      }
      function C(e, t, n, s) {
        const [r, i] = e[t],
          a = o(r),
          l = o(i)
        return P(W(a), W(l), n, s)
      }
      function z(e, t, n, s) {
        let r = e
        const a = t + n
        let l
        if (a <= i.minutesPerDay) l = [[t, a]]
        else {
          const e = Math.min(i.minutesPerDay - t, n)
          l = [
            [t, t + e],
            [0, n - e],
          ]
        }
        const y = ((e, t) => {
            const n = (0, c.ensureDefined)((0, u.default)(e))[0],
              s = (0, c.ensureDefined)((0, d.default)(e))[1],
              r = e.map((e) => e[1] - e[0]).reduce((e, t) => e + t)
            return M(
              t,
              n,
              s === i.minutesPerDay ? t : m(t, Math.floor(o(n + r))),
              s,
            )
          })(l, r),
          v = []
        for (let e = 0; e < l.length; e++) {
          const t = C(l, e, s, y)
          v.push([t, r]), (r = k(r))
        }
        return v
      }
      var H = n(57333)
      const J = (0, n(5849).default)(
        f.map((e) => [e, { title: E[e], isActive: !1, entries: [] }]),
      )
      function j(e) {
        return (t, n) => {
          return (
            (s = (0, c.ensureDefined)(e(t))),
            (r = (0, c.ensureDefined)(e(n))),
            s.start.value === r.start.value && s.end.value === r.end.value
          )
          var s, r
        }
      }
      const Z = j(u.default),
        G = j(d.default)
      function q(e, t) {
        return z(e.sessionStartDayOfWeek(), e.start(), e.length(), t)
      }
      function K(e, t) {
        t.forEach((t) =>
          ((e, t, n) => {
            const s = e[n].entries
            s.push(t), s.sort((e, t) => e.start.value - t.start.value)
          })(e, t[0], t[1]),
        )
      }
      function Q(e, t, n) {
        for (const s of t) {
          K(e, q(s, n))
        }
      }
      function X(e, t) {
        return (
          e.type === t.type &&
          (3 === e.type ||
            t.end.value - t.start.value + e.end.value - e.start.value <= 1)
        )
      }
      function ee(e, t) {
        var n
        const s =
          ((null !== (n = null == t ? void 0 : t.getUTCDay()) && void 0 !== n
            ? n
            : new Date().getDay()) %
            7) +
          1
        const r = ((e) => {
            if (null === e) return new Map()
            if (void 0 === e.subsessions)
              return new Map([
                [
                  0,
                  new H.SessionSpec(
                    e.timezone,
                    e.session,
                    e.session_holidays,
                    e.corrections,
                  ),
                ],
              ])
            const t = 'regular',
              n = 'premarket',
              s = 'postmarket',
              r = [t, n, s],
              i = new Map()
            for (const a of r) {
              let r = null
              switch (a) {
                case t:
                  r = 0
                  break
                case n:
                  r = 1
                  break
                case s:
                  r = 2
              }
              if (null !== r) {
                const t = e.subsessions.find((e) => e.id === a)
                void 0 !== t &&
                  i.set(
                    r,
                    new H.SessionSpec(
                      e.timezone,
                      t['session-display'] || t.session,
                      e.session_holidays,
                      t['session-correction'],
                    ),
                  )
              }
            }
            return i
          })(e),
          i = (0, y.deepCopy)(J)
        i[s].isActive = !0
        for (const e of Array.from(r.keys())) {
          Q(
            i,
            (0, c.ensureDefined)(r.get(e)).getEntriesForWeekByCalendar(
              (0, c.ensureNotNull)(t),
            ),
            e,
          )
        }
        return (
          ((e) => {
            const t = new Map()
            for (const n of f) t.set(n, V(n, e))
            for (const n of f) e[n].entries = (0, c.ensureDefined)(t.get(n))
          })(i),
          ((e) => {
            for (const t of f) {
              const n = e[t].entries,
                s = (0, c.ensureDefined)((0, u.default)(n))
              X(s, (0, c.ensureDefined)((0, d.default)(e[h(t)].entries))) &&
                (s.start.isFirstOrLastPoint = !1)
              const r = (0, c.ensureDefined)((0, d.default)(n))
              X(r, (0, c.ensureDefined)((0, u.default)(e[k(t)].entries))) &&
                (r.end.isFirstOrLastPoint = !1)
            }
          })(i),
          ((e) => {
            for (const t of f) {
              const n = e[t].entries
              if (1 === n.length) continue
              const s = h(t),
                r = k(t),
                i = (0, c.ensureDefined)((0, d.default)(n)),
                a = (0, c.ensureDefined)((0, u.default)(n))
              a.start.isFirstOrLastPoint ||
                (a.showStartForLastEntry = G(n, e[s].entries)),
                i.end.isFirstOrLastPoint ||
                  (i.showEndForFirstEntry = Z(n, e[r].entries))
            }
          })(i),
          { newSessionsDays: i, newTodaySession: i[s] }
        )
      }
      class te {
        constructor(e) {
          ;(this.sessionsDays = new a.WatchedValue((0, r.clone)(J))),
            (this.todaySession = new a.WatchedValue(
              (0, r.clone)({ entries: [] }),
            )),
            (this._todayInExchangeTime = null),
            (this._symbolInfo = e.symbolInfo().spawn()),
            this._symbolInfo.subscribe(
              this._updateEntriesBySubSessions.bind(this),
              { callWithLast: !0 },
            )
        }
        destroy() {
          this._symbolInfo.destroy()
        }
        currentTimeValue() {
          return null === this._todayInExchangeTime
            ? -1
            : o(i.get_minutes_from_midnight(this._todayInExchangeTime))
        }
        timezone() {
          const e = this._symbolInfo.value()
          return null === e ? '' : (0, s.timezoneTitle)(e.timezone)
        }
        _updateEntriesBySubSessions(e) {
          this._updateTodayWithOffsets(e)
          const { newSessionsDays: t, newTodaySession: n } = ee(
            e,
            this._todayInExchangeTime,
          )
          this.sessionsDays.setValue(t), this.todaySession.setValue(n)
        }
        _updateTodayWithOffsets(e) {
          this._todayInExchangeTime =
            null !== e
              ? i.get_cal_from_unix_timestamp_ms(
                  i.get_timezone(e.timezone),
                  window.ChartApiInstance.serverTime(),
                )
              : null
        }
      }
    },
  },
])
