;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7973],
  {
    97754: (e, t) => {
      var n
      !(() => {
        var s = {}.hasOwnProperty
        function r() {
          for (var e = [], t = 0; t < arguments.length; t++) {
            var n = arguments[t]
            if (n) {
              var i = typeof n
              if ('string' === i || 'number' === i) e.push(n)
              else if (Array.isArray(n) && n.length) {
                var a = r.apply(null, n)
                a && e.push(a)
              } else if ('object' === i)
                for (var o in n) s.call(n, o) && n[o] && e.push(o)
            }
          }
          return e.join(' ')
        }
        e.exports
          ? ((r.default = r), (e.exports = r))
          : void 0 === (n = (() => r).apply(t, [])) || (e.exports = n)
      })()
    },
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
        getBlockchainContractLogoUrl(e) {
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
      const r = (e, t = !1, n = []) => {
        const r = 'watchedValue' in e ? e.watchedValue : void 0,
          i = 'defaultValue' in e ? e.defaultValue : e.watchedValue.value(),
          [a, o] = (0, s.useState)(r ? r.value() : i)
        return (
          (t ? s.useLayoutEffect : s.useEffect)(() => {
            if (r) {
              o(r.value())
              const e = (e) => o(e)
              return r.subscribe(e), () => r.unsubscribe(e)
            }
            return () => {}
          }, [r, ...n]),
          a
        )
      }
    },
    4237: (e, t, n) => {
      var s = n(32227)
      ;(t.createRoot = s.createRoot), s.hydrateRoot
    },
    66626: (e) => {
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
    75725: (e, t, n) => {
      n.d(t, { FullSessionScheduleRenderer: () => E })
      var s = n(50959),
        r = n(97754),
        i = n(50151),
        a = n(11542),
        o = n(77975),
        u = n(92184),
        l = n(66626)
      const c = new WeakMap()
      function d(e) {
        return (
          c.has(e) || c.set(e, (0, u.randomHash)()),
          (0, i.ensureDefined)(c.get(e))
        )
      }
      const f = new Map([
          [0, l.green],
          [1, l.orange],
          [2, l.blue],
          [3, l.gray],
        ]),
        v = new Map([
          [0, a.t(null, void 0, n(41410))],
          [1, a.t(null, void 0, n(36018))],
          [2, a.t(null, void 0, n(73897))],
          [3, a.t(null, void 0, n(62464))],
        ]),
        m = a.t(null, void 0, n(63538))
      var y
      function h(e) {
        const { segment: t, forceStart: n, forceEnd: i } = e,
          a = t.end.value - t.start.value,
          o = a < 0.03,
          u = {
            left: 100 * t.start.value + '%',
            width: `calc(${100 * a}% + ${o ? 2 : 0}px)`,
          },
          c = r(
            l.segment,
            f.get(t.type),
            (n || t.start.isFirstOrLastPoint) && l.start,
            (i || t.end.isFirstOrLastPoint) && l.end,
            o && l.small,
            'common-tooltip-html',
            'apply-common-tooltip',
          ),
          d = ((e, t) =>
            `<div class="${l.tooltip}">\n\t\t<span class="${f.get(t)}">${v.get(t)}</span>\n\t\t<span class="${l.time}">${e}</span>\n\t</div>`)(
            t.tooltip,
            t.type,
          )
        return s.createElement('div', {
          className: c,
          style: u,
          'data-tooltip': d,
        })
      }
      function D(e) {
        const { sessionDay: t } = e,
          n = t.entries.map((e, n) =>
            s.createElement(h, {
              key: `${d(e)}Segment`,
              segment: e,
              forceStart: 0 === n && 3 === e.type,
              forceEnd: n === t.entries.length - 1 && 3 === e.type,
            }),
          ),
          i = r(l.sessionDay, t.isActive && l.active)
        return s.createElement(
          'div',
          { className: i },
          s.createElement('div', { className: l.weekDay }, t.title),
          s.createElement('div', { className: l.sessionDaySegments }, n),
        )
      }
      function p(e) {
        const { sessionDays: t, currentTimeMark: n } = e,
          i = [],
          a = Number.parseInt(
            Object.keys(t).filter((e) => t[Number.parseInt(e)].isActive)[0],
          ),
          o = t[a],
          u = o.entries.filter((e) => e.start.value <= n && e.end.value >= n)[0]
        !u.start.isFirstOrLastPoint && u.showStartForLastEntry
          ? i.push(o.entries[o.entries.length - 1].start)
          : i.push(u.start)
        const c =
          !u.end.isFirstOrLastPoint && u.showEndForFirstEntry
            ? o.entries[0].end
            : u.end
        if ((i[0].value !== c.value && i.push(c), 0 === i.length)) return null
        i.sort((e, t) => e.value - t.value)
        const f = i.map((e) =>
            s.createElement(
              'div',
              { key: d(e), className: l.timeMark },
              e.title,
            ),
          ),
          v = 100 * (2 === i.length ? i[1].value - i[0].value : 0),
          m = r(v > 12 && l.timeMarkSegmentAlignByEnds, l.timeMarkSegment)
        return s.createElement(
          'div',
          { className: l.sessionDay },
          s.createElement('div', { className: l.weekDay }),
          s.createElement(
            'div',
            { className: l.timeMarkWrapper },
            s.createElement(
              'div',
              {
                className: m,
                style: { left: 100 * i[0].value + '%', width: `${v}%` },
              },
              f,
            ),
          ),
        )
      }
      function E(e) {
        const {
            className: t,
            timezone: n,
            showAllDays: i,
            timeZoneClassName: a,
          } = e,
          u = (0, o.useWatchedValueReadonly)({ watchedValue: e.sessionDays }),
          c = (0, o.useWatchedValueReadonly)({ watchedValue: e.now }),
          d = Object.values(u).filter((e) => e.isActive)[0],
          f = r(t, l.wrapper)
        return s.createElement(
          'div',
          { className: f },
          s.createElement(
            'div',
            { className: l.sessionDayWrapper },
            i
              ? s.createElement(
                  s.Fragment,
                  null,
                  Object.values(u).map((e, t) =>
                    s.createElement(D, { key: t, sessionDay: e }),
                  ),
                )
              : s.createElement(D, { sessionDay: d }),
            s.createElement(
              'div',
              { className: l.nowWrapper },
              s.createElement('div', {
                className: l.now,
                style: { left: 100 * c + '%' },
              }),
            ),
          ),
          s.createElement(p, { sessionDays: u, currentTimeMark: c }),
          s.createElement(
            'div',
            { className: r(l.timezone, a, i && l.largePadding) },
            `${m}: ${n}`,
          ),
        )
      }
      !((e) => {
        ;(e[(e.MinSegmentWidth = 12)] = 'MinSegmentWidth'),
          (e[(e.SmallWidth = 0.03)] = 'SmallWidth')
      })(y || (y = {}))
    },
    53350: (e, t, n) => {
      n.d(t, { FullSessionScheduleViewModel: () => ie })
      var s = n(63950),
        r = n(37265),
        i = n(2740),
        a = n(64147),
        o = n(68805)
      function u(e) {
        return e / i.minutesPerDay
      }
      function l(e) {
        return Math.round(e * i.minutesPerDay)
      }
      const c = (e) => (e && e.length ? e[0] : void 0)
      var d,
        f,
        v = n(82593),
        m = n(50151),
        y = n(18832)
      !((e) => {
        ;(e[(e.SUNDAY = 1)] = 'SUNDAY'),
          (e[(e.MONDAY = 2)] = 'MONDAY'),
          (e[(e.TUESDAY = 3)] = 'TUESDAY'),
          (e[(e.WEDNESDAY = 4)] = 'WEDNESDAY'),
          (e[(e.THURSDAY = 5)] = 'THURSDAY'),
          (e[(e.FRIDAY = 6)] = 'FRIDAY'),
          (e[(e.SATURDAY = 7)] = 'SATURDAY')
      })(d || (d = {})),
        ((e) => {
          ;(e[(e.JANUARY = 0)] = 'JANUARY'),
            (e[(e.FEBRUARY = 1)] = 'FEBRUARY'),
            (e[(e.MARCH = 2)] = 'MARCH'),
            (e[(e.APRIL = 3)] = 'APRIL'),
            (e[(e.MAY = 4)] = 'MAY'),
            (e[(e.JUNE = 5)] = 'JUNE'),
            (e[(e.JULY = 6)] = 'JULY'),
            (e[(e.AUGUST = 7)] = 'AUGUST'),
            (e[(e.SEPTEMBER = 8)] = 'SEPTEMBER'),
            (e[(e.OCTOBER = 9)] = 'OCTOBER'),
            (e[(e.NOVEMBER = 10)] = 'NOVEMBER'),
            (e[(e.DECEMBER = 11)] = 'DECEMBER')
        })(f || (f = {}))
      const h = [
        d.SUNDAY,
        d.MONDAY,
        d.TUESDAY,
        d.WEDNESDAY,
        d.THURSDAY,
        d.FRIDAY,
        d.SATURDAY,
      ]
      function D(e, t) {
        return ((e + t + 6) % 7) + 1
      }
      function p(e) {
        return (t) => D(t, e)
      }
      const E = p(-1),
        A = p(1)
      var g = n(11542)
      f.JANUARY,
        g.t(null, void 0, n(200)),
        f.FEBRUARY,
        g.t(null, void 0, n(81069)),
        f.MARCH,
        g.t(null, void 0, n(93878)),
        f.APRIL,
        g.t(null, void 0, n(28896)),
        f.MAY,
        g.t(null, void 0, n(25734)),
        f.JUNE,
        g.t(null, void 0, n(61487)),
        f.JULY,
        g.t(null, void 0, n(6608)),
        f.AUGUST,
        g.t(null, void 0, n(11081)),
        f.SEPTEMBER,
        g.t(null, void 0, n(32179)),
        f.OCTOBER,
        g.t(null, void 0, n(37997)),
        f.NOVEMBER,
        g.t(null, void 0, n(4607)),
        f.DECEMBER,
        g.t(null, void 0, n(90082)),
        f.JANUARY,
        g.t(null, void 0, n(62310)),
        f.FEBRUARY,
        g.t(null, void 0, n(2507)),
        f.MARCH,
        g.t(null, void 0, n(92767)),
        f.APRIL,
        g.t(null, void 0, n(27072)),
        f.MAY,
        g.t(null, { context: 'short' }, n(13132)),
        f.JUNE,
        g.t(null, void 0, n(429)),
        f.JULY,
        g.t(null, void 0, n(53786)),
        f.AUGUST,
        g.t(null, void 0, n(46450)),
        f.SEPTEMBER,
        g.t(null, void 0, n(6816)),
        f.OCTOBER,
        g.t(null, void 0, n(12179)),
        f.NOVEMBER,
        g.t(null, void 0, n(26899)),
        f.DECEMBER,
        g.t(null, void 0, n(32084)),
        d.SUNDAY,
        g.t(null, void 0, n(61480)),
        d.MONDAY,
        g.t(null, void 0, n(19573)),
        d.TUESDAY,
        g.t(null, void 0, n(82160)),
        d.WEDNESDAY,
        g.t(null, void 0, n(94226)),
        d.THURSDAY,
        g.t(null, void 0, n(79137)),
        d.FRIDAY,
        g.t(null, void 0, n(3570)),
        d.SATURDAY,
        g.t(null, void 0, n(30348))
      const S = {
        [d.SUNDAY]: g.t(null, void 0, n(77493)),
        [d.MONDAY]: g.t(null, void 0, n(37150)),
        [d.TUESDAY]: g.t(null, void 0, n(11916)),
        [d.WEDNESDAY]: g.t(null, void 0, n(11532)),
        [d.THURSDAY]: g.t(null, void 0, n(71388)),
        [d.FRIDAY]: g.t(null, void 0, n(22928)),
        [d.SATURDAY]: g.t(null, void 0, n(32273)),
      }
      d.SUNDAY,
        g.t(null, { context: 'day_of_week' }, n(75005)),
        d.MONDAY,
        g.t(null, { context: 'day_of_week' }, n(30961)),
        d.TUESDAY,
        g.t(null, { context: 'day_of_week' }, n(9135)),
        d.WEDNESDAY,
        g.t(null, { context: 'day_of_week' }, n(92578)),
        d.THURSDAY,
        g.t(null, { context: 'day_of_week' }, n(8765)),
        d.FRIDAY,
        g.t(null, { context: 'day_of_week' }, n(97349)),
        d.SATURDAY,
        g.t(null, { context: 'day_of_week' }, n(94748))
      var w = n(58683)
      function k(e) {
        for (
          (0, m.assert)(
            Number.isInteger(e),
            'timeMinutes expected to be integer number',
          );
          e > i.minutesPerDay;
        )
          e -= i.minutesPerDay
        const t = e % 60,
          n = (e - t) / 60
        return (
          (0, w.numberToStringWithLeadingZero)(n, 2) +
          ':' +
          (0, w.numberToStringWithLeadingZero)(t, 2)
        )
      }
      function P(e, t) {
        return `${e} — ${t}`
      }
      function R(e, t) {
        return `${S[e]} ${k(t)}`
      }
      function M(e, t, n, s) {
        ;(0, m.assert)(
          t !== i.minutesPerDay,
          'Start time expected to be normalized (24:00 as range start is not allowed)',
        ),
          (0, m.assert)(
            0 !== s,
            'End time expected to be normalized (00:00 as range end is not allowed)',
          )
        const r = ((e, t, n, s) => {
          const r = e * i.minutesPerDay + t
          let a = n * i.minutesPerDay + s
          return a < r && (a += 7 * i.minutesPerDay), a - r
        })(e, t, n, s)
        return r < i.minutesPerDay || (r === i.minutesPerDay && 0 === t)
          ? ((e, t) => P(k(e), k(t)))(t, s)
          : ((e, t, n, s) => P(R(e, t), R(n, s)))(e, t, n, s)
      }
      function Y(e, t, n, s) {
        return {
          start: e,
          end: t,
          type: n,
          tooltip: s,
          showStartForLastEntry: !1,
          showEndForFirstEntry: !1,
        }
      }
      function U(e) {
        return { value: e, title: k(l(e)), isFirstOrLastPoint: !0 }
      }
      function T(e) {
        return 3 !== e.type
      }
      function N(e, t) {
        return { dayIndex: e, entries: t.filter(T) }
      }
      function _(e, t, n, s = t) {
        const r = n(t),
          i = e[r]
        return r !== s && 0 === i.entries.length
          ? _(e, r, n, s)
          : N(r, e[r].entries)
      }
      function L(e) {
        return (t, n) => _(t, n, e)
      }
      const x = L(E),
        I = L(A)
      function b(e, t, n, s) {
        return (r, i, a) =>
          void 0 === r ? [s, a] : r === e ? [t, n(i)] : [r, i]
      }
      const O = b(1, 0, A, 0),
        F = b(0, 1, E, 1)
      function W(e, t, n, s, r) {
        const [i, a] = O(e, t, r),
          [o, u] = F(n, s, r)
        ;(0, m.assert)(
          t !== n || i < o,
          `Days are same (${t}) but prev entry time (${i}) >= next entry time (${o})`,
        )
        const c = l(i),
          d = l(o)
        return Y(U(a !== r ? 0 : i), U(u !== r ? 1 : o), 3, M(a, c, u, d))
      }
      function B(e, t, n, s, r) {
        return W(e?.end?.value, t, n?.start?.value, s, r)
      }
      function C(e) {
        const t = [...e.entries]
        for (let n = 1; n < e.entries.length; n++) {
          const s = e.entries[n - 1],
            r = e.entries[n]
          if (r.start.value !== s.end.value) {
            const n = B(s, e.dayIndex, r, e.dayIndex, e.dayIndex)
            t.push(n)
          }
        }
        return t.sort((e, t) => e.start.value - t.start.value), t
      }
      function V(e, t) {
        const n = (0, v.default)(t.entries),
          s = t.dayIndex,
          r = (0, m.ensureDefined)(c(e.entries))
        return 0 === r.start.value ? [] : [B(n, s, r, e.dayIndex, e.dayIndex)]
      }
      function $(e, t) {
        const n = c(t.entries),
          s = t.dayIndex,
          r = (0, m.ensureDefined)((0, v.default)(e.entries))
        return 1 === r.end.value ? [] : [B(r, e.dayIndex, n, s, e.dayIndex)]
      }
      function z(e, t) {
        const n = {
          thisDay: N(e, t[e].entries),
          prevDay: x(t, e),
          nextDay: I(t, e),
        }
        return (
          (({ thisDay: e, prevDay: t, nextDay: n }) => {
            if (0 === e.entries.length)
              return [
                B(
                  (0, v.default)(t.entries),
                  t.dayIndex,
                  c(n.entries),
                  n.dayIndex,
                  e.dayIndex,
                ),
              ]
          })(n) ??
          (({ thisDay: e, prevDay: t, nextDay: n }) => {
            const s = e.dayIndex
            if (t.dayIndex !== s || n.dayIndex !== s) return
            const i = e.entries,
              a = (0, m.ensureDefined)(c(i)),
              o = (0, m.ensureDefined)((0, v.default)(i))
            return [
              0 !== a.start.value ? W(0, s, a.start.value, s, s) : void 0,
              ...C(e),
              1 !== o.end.value ? W(o.end.value, s, 1, s, s) : void 0,
            ].filter(r.isExistent)
          })(n) ??
          ((e) => [
            ...V(e.thisDay, e.prevDay),
            ...C(e.thisDay),
            ...$(e.thisDay, e.nextDay),
          ])(n)
        )
      }
      function H(e, t, n, s) {
        const [r, i] = e[t],
          a = u(r),
          o = u(i),
          l = U(a),
          c = U(o)
        return (
          0 === t && e.length > 1 && (c.isFirstOrLastPoint = !1),
          1 === t && e.length > 1 && (l.isFirstOrLastPoint = !1),
          Y(l, c, n, s)
        )
      }
      function J(e, t, n, s) {
        const r = e,
          a = t + n,
          o = [],
          l = t,
          d = Math.min(i.minutesPerDay, a),
          f = [[l, d]]
        let y
        if ((o.push(r), a > d)) {
          y = D(r, Math.ceil((a - d) / i.minutesPerDay))
          const e = [0, a % i.minutesPerDay]
          f.push(e), o.push(y)
        }
        const h = ((e, t, n) => {
            const s = (0, m.ensureDefined)(c(e))[0],
              r = (0, m.ensureDefined)((0, v.default)(e))[1]
            if (void 0 === n) {
              const a = e.map((e) => e[1] - e[0]).reduce((e, t) => e + t)
              n = r === i.minutesPerDay ? t : D(t, Math.floor(u(s + a)))
            }
            return M(t, s, n, r)
          })(f, r, y),
          p = []
        for (let e = 0; e < f.length; e++) {
          const t = H(f, e, s, h)
          p.push([t, o[e]])
        }
        return p
      }
      var j = n(17326)
      const Z = ((e) => {
        for (var t = -1, n = null == e ? 0 : e.length, s = {}; ++t < n; ) {
          var r = e[t]
          s[r[0]] = r[1]
        }
        return s
      })(h.map((e) => [e, { title: S[e], isActive: !1, entries: [] }]))
      function G(e) {
        return (t, n) => {
          return (
            (s = (0, m.ensureDefined)(e(t))),
            (r = (0, m.ensureDefined)(e(n))),
            s.start.value === r.start.value && s.end.value === r.end.value
          )
          var s, r
        }
      }
      const q = G(c),
        K = G(v.default)
      function Q(e, t) {
        return J(e.sessionStartDayOfWeek(), e.start(), e.length(), t)
      }
      function X(e, t) {
        t.forEach((t) =>
          ((e, t, n) => {
            const s = e[n].entries
            s.push(t), s.sort((e, t) => e.start.value - t.start.value)
          })(e, t[0], t[1]),
        )
      }
      function ee(e, t, n) {
        for (const s of t) {
          X(e, Q(s, n))
        }
      }
      function te(e, t) {
        return (
          e.type === t.type &&
          (3 === e.type ||
            t.end.value - t.start.value + e.end.value - e.start.value <= 1)
        )
      }
      function ne(e, t) {
        const n = ((e) => {
          if (null === e) return new Map()
          if (void 0 === e.subsessions)
            return new Map([
              [
                0,
                new j.SessionsSpec(
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
                  new j.SessionsSpec(
                    e.timezone,
                    t['session-display'] || t.session,
                    e.session_holidays,
                    t['session-correction'],
                  ),
                )
            }
          }
          return i
        })(e)
        t =
          t ??
          (0, i.utc_to_cal)(
            (0, i.get_timezone)(e?.timezone ?? 'Etc/UTC'),
            Date.now(),
          )
        const s = ((t?.getUTCDay() ?? new Date().getDay()) % 7) + 1
        const r = (0, y.deepCopy)(Z)
        r[s].isActive = !0
        for (const e of Array.from(n.keys())) {
          const s = (0, m.ensureDefined)(n.get(e)),
            i = s.getWeekIndex(t)
          ee(r, s.getEntriesForWeek(i).list(), e)
        }
        return (
          ((e) => {
            const t = new Map()
            for (const n of h) t.set(n, z(n, e))
            for (const n of h) e[n].entries = (0, m.ensureDefined)(t.get(n))
          })(r),
          ((e) => {
            for (const t of h) {
              const n = e[t].entries,
                s = (0, m.ensureDefined)(c(n))
              te(s, (0, m.ensureDefined)((0, v.default)(e[E(t)].entries))) &&
                (s.start.isFirstOrLastPoint = !1)
              const r = (0, m.ensureDefined)((0, v.default)(n))
              te(r, (0, m.ensureDefined)(c(e[A(t)].entries))) &&
                (r.end.isFirstOrLastPoint = !1)
            }
          })(r),
          ((e) => {
            for (const t of h) {
              const n = e[t].entries
              if (1 === n.length) continue
              const s = E(t),
                r = A(t),
                i = (0, m.ensureDefined)((0, v.default)(n)),
                a = (0, m.ensureDefined)(c(n))
              a.start.isFirstOrLastPoint ||
                (a.showStartForLastEntry = K(n, e[s].entries)),
                i.end.isFirstOrLastPoint ||
                  (i.showEndForFirstEntry = q(n, e[r].entries))
            }
          })(r),
          { newSessionsDays: r, newTodaySession: r[s] }
        )
      }
      var se
      function re(e) {
        return (0, i.get_cal_from_unix_timestamp_ms)(
          (0, i.get_timezone)(e.timezone),
          window.ChartApiInstance.serverTime() -
            1e3 * (0, o.getSymbolDelaySeconds)(e),
        )
      }
      !((e) => {
        ;(e[(e.Regular = 0)] = 'Regular'),
          (e[(e.Pre = 1)] = 'Pre'),
          (e[(e.Post = 2)] = 'Post'),
          (e[(e.Close = 3)] = 'Close')
      })(se || (se = {}))
      class ie {
        constructor(e) {
          ;(this.sessionsDays = new a.WatchedValue((0, r.clone)(Z))),
            (this.todaySession = new a.WatchedValue(
              (0, r.clone)({ entries: [] }),
            )),
            (this._currentTime = new a.WatchedValue(-1)),
            (this._symbolInfo = e.symbolInfo().spawn()),
            this._symbolInfo.subscribe(
              this._updateEntriesBySubSessions.bind(this),
              {
                callWithLast: !0,
              },
            ),
            (this._timeIntervalId = setInterval(
              this._updateTodayWithOffsets.bind(this),
              6e4,
            ))
        }
        destroy() {
          this._symbolInfo.destroy(), clearInterval(this._timeIntervalId)
        }
        currentTimeValue() {
          return this._currentTime.readonly()
        }
        timezone() {
          const e = this._symbolInfo.value()
          return null === e ? '' : (0, s.timezoneTitle)(e.timezone)
        }
        _updateEntriesBySubSessions(e) {
          this._updateTodayWithOffsets()
          const { newSessionsDays: t, newTodaySession: n } = ne(
            e,
            null === e ? null : re(e),
          )
          this.sessionsDays.setValue(t), this.todaySession.setValue(n)
        }
        _updateTodayWithOffsets() {
          const e = this._symbolInfo.value()
          if (null === e) return void this._currentTime.setValue(-1)
          const t = this._currentTime.value(),
            n = u((0, i.get_minutes_from_midnight)(re(e)))
          this._currentTime.setValue(n),
            n < t && this._updateEntriesBySubSessions(e)
        }
      }
    },
    92315: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M9 14A5 5 0 1 0 9 4a5 5 0 0 0 0 10Zm3-4H6V8h6v2Z"/></svg>'
    },
  },
])
