;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7223],
  {
    51669: (e) => {
      e.exports = {
        calendar: 'calendar-N6r5jhbE',
        popupStyle: 'popupStyle-N6r5jhbE',
        header: 'header-N6r5jhbE',
        'flip-horizontal': 'flip-horizontal-N6r5jhbE',
        'sub-header': 'sub-header-N6r5jhbE',
        'view-month': 'view-month-N6r5jhbE',
        'view-year': 'view-year-N6r5jhbE',
        'view-decades': 'view-decades-N6r5jhbE',
        weeks: 'weeks-N6r5jhbE',
        week: 'week-N6r5jhbE',
        day: 'day-N6r5jhbE',
        hover: 'hover-N6r5jhbE',
        'accent-color': 'accent-color-N6r5jhbE',
        'another-month': 'another-month-N6r5jhbE',
        'current-day': 'current-day-N6r5jhbE',
        'slot-wrapper': 'slot-wrapper-N6r5jhbE',
        'hide-focus-ring': 'hide-focus-ring-N6r5jhbE',
        'decade-button': 'decade-button-N6r5jhbE',
        'visually-hidden': 'visually-hidden-N6r5jhbE',
        'grid-row': 'grid-row-N6r5jhbE',
      }
    },
    38721: (e) => {
      e.exports = {
        container: 'container-PNiXwSz6',
        icon: 'icon-PNiXwSz6',
        tooltip: 'tooltip-PNiXwSz6',
        date: 'date-PNiXwSz6',
        time: 'time-PNiXwSz6',
      }
    },
    62860: (e) => {
      e.exports = {
        pickerInput: 'pickerInput-P2cJzZdH',
        icon: 'icon-P2cJzZdH',
        disabled: 'disabled-P2cJzZdH',
        picker: 'picker-P2cJzZdH',
        fixed: 'fixed-P2cJzZdH',
        absolute: 'absolute-P2cJzZdH',
        nativePicker: 'nativePicker-P2cJzZdH',
      }
    },
    64373: (e) => {
      e.exports = { tooltip: 'tooltip-RU08GcsY' }
    },
    70757: (e) => {
      e.exports = { wrap: 'wrap-NsE0FV0Z', input: 'input-NsE0FV0Z' }
    },
    3693: (e) => {
      e.exports = { icon: 'icon-Rubz29lH' }
    },
    27365: (e, t, n) => {
      n.d(t, { getChartTimezoneOffsetMs: () => a, getTimezoneName: () => r })
      var s = n(2740)
      function r(e) {
        const t = e.model().timezone()
        if ('exchange' !== t) return t
        const n = e.model().mainSeries().symbolInfo()
        return n?.timezone
      }
      function a(e, t) {
        if (void 0 === t) return 0
        return (0, s.get_timezone)(t).offset_utc(e)
      }
    },
    51826: (e, t, n) => {
      n.d(t, { DialogsOpenerManager: () => s, dialogsOpenerManager: () => r })
      class s {
        constructor() {
          this._storage = new Map()
        }
        setAsOpened(e, t) {
          this._storage.set(e, t)
        }
        setAsClosed(e) {
          this._storage.delete(e)
        }
        isOpened(e) {
          return this._storage.has(e)
        }
        getDialogPayload(e) {
          return this._storage.get(e)
        }
      }
      const r = new s()
    },
    15499: (e, t, n) => {
      n.d(t, {
        CalendarViewType: () => c,
        DECADES_YEARS_AMOUNT: () => p,
        getCurrentAriaLabel: () => v,
        getCurrentVisibleTitle: () => D,
        getDayAriaLabel: () => g,
        getMonths: () => o,
        getMonthsShort: () => i,
        getNextAriaLabel: () => m,
        getNextLiveRegionConfirmation: () => w,
        getNextMonth: () => C,
        getPrevAriaLabel: () => f,
        getPrevLiveRegionConfirmation: () => y,
        getSubHeaderDecades: () => d,
        getSubHeaderYear: () => h,
        getViewTypeLiveRegionConfirmation: () => b,
        getWeekDaysMin: () => r,
      })
      var s = n(11542)
      const r = () => [
          s.t(null, { context: 'day_of_week' }, n(30961)),
          s.t(null, { context: 'day_of_week' }, n(9135)),
          s.t(null, { context: 'day_of_week' }, n(92578)),
          s.t(null, { context: 'day_of_week' }, n(8765)),
          s.t(null, { context: 'day_of_week' }, n(97349)),
          s.t(null, { context: 'day_of_week' }, n(94748)),
          s.t(null, { context: 'day_of_week' }, n(75005)),
        ],
        a = () => [
          s.t(null, void 0, n(61480)),
          s.t(null, void 0, n(19573)),
          s.t(null, void 0, n(82160)),
          s.t(null, void 0, n(94226)),
          s.t(null, void 0, n(79137)),
          s.t(null, void 0, n(3570)),
          s.t(null, void 0, n(30348)),
        ],
        o = () => [
          s.t(null, void 0, n(200)),
          s.t(null, void 0, n(81069)),
          s.t(null, void 0, n(93878)),
          s.t(null, void 0, n(28896)),
          s.t(null, void 0, n(25734)),
          s.t(null, void 0, n(61487)),
          s.t(null, void 0, n(6608)),
          s.t(null, void 0, n(11081)),
          s.t(null, void 0, n(32179)),
          s.t(null, void 0, n(37997)),
          s.t(null, void 0, n(4607)),
          s.t(null, void 0, n(90082)),
        ],
        i = () => [
          s.t(null, void 0, n(62310)),
          s.t(null, void 0, n(2507)),
          s.t(null, void 0, n(92767)),
          s.t(null, void 0, n(27072)),
          s.t(null, void 0, n(25734)),
          s.t(null, void 0, n(429)),
          s.t(null, void 0, n(53786)),
          s.t(null, void 0, n(46450)),
          s.t(null, void 0, n(6816)),
          s.t(null, void 0, n(12179)),
          s.t(null, void 0, n(26899)),
          s.t(null, void 0, n(32084)),
        ],
        l = {
          get prevMonth() {
            return s.t(null, void 0, n(93984))
          },
          get nextMonth() {
            return s.t(null, void 0, n(92790))
          },
          get prevYear() {
            return s.t(null, void 0, n(75776))
          },
          get nextYear() {
            return s.t(null, void 0, n(69102))
          },
          get prevDecades() {
            return s.t(null, void 0, n(44701))
          },
          get nextDecades() {
            return s.t(null, void 0, n(17538))
          },
          get selectMonth() {
            return s.t(null, void 0, n(70235))
          },
          get selectYear() {
            return s.t(null, void 0, n(71961))
          },
          get selectDate() {
            return s.t(null, void 0, n(91245))
          },
        },
        u = {
          get setMonth() {
            return s.t(null, void 0, n(99470))
          },
          get setYear() {
            return s.t(null, void 0, n(7861))
          },
          get setDecades() {
            return s.t(null, void 0, n(65728))
          },
        }
      var c
      !((e) => {
        ;(e.Month = 'month'), (e.Year = 'year'), (e.Decades = 'decades')
      })(c || (c = {}))
      const d = () => s.t(null, void 0, n(66181)),
        h = () => s.t(null, void 0, n(43154)),
        p = 20
      function g(e) {
        return `${a()[e.getDay()]} ${e.getDate()} ${o()[e.getMonth()]} ${e.getFullYear()}`
      }
      function f(e, t) {
        switch (e) {
          case c.Month: {
            const e = new Date(t)
            return (
              e.setMonth(e.getMonth() - 1),
              `${l.prevMonth}, ${o()[e.getMonth()]} ${e.getFullYear()}`
            )
          }
          case c.Year:
            return `${l.prevYear}, ${t.getFullYear() - 1}`
          case c.Decades:
            return `${l.prevDecades}, ${t.getFullYear() - p} - ${t.getFullYear() - 1}`
        }
      }
      function m(e, t) {
        switch (e) {
          case c.Month: {
            const e = new Date(t)
            return (
              e.setMonth(e.getMonth() + 1),
              `${l.nextMonth}, ${o()[e.getMonth()]} ${e.getFullYear()}`
            )
          }
          case c.Year:
            return `${l.nextYear}, ${t.getFullYear() + 1}`
          case c.Decades:
            return `${l.nextDecades}, ${t.getFullYear() + p} - ${t.getFullYear() + 2 * p - 1}`
        }
      }
      function v(e, t) {
        switch (e) {
          case c.Month:
            return `${l.selectMonth}, ${t.getFullYear()}`
          case c.Year:
            return `${l.selectYear}, ${t.getFullYear()} - ${t.getFullYear() + p - 1}`
          case c.Decades:
            return `${l.selectDate}, ${o()[t.getMonth()]} ${t.getFullYear()}`
        }
      }
      function D(e, t) {
        switch (e) {
          case c.Month:
            return `${o()[t.getMonth()]} ${t.getFullYear()}`
          case c.Year:
            return `${t.getFullYear()}`
          case c.Decades:
            return `${t.getFullYear()} - ${t.getFullYear() + p - 1}`
        }
      }
      function y(e, t) {
        switch (e) {
          case c.Month: {
            const e = new Date(t)
            return (
              e.setMonth(e.getMonth() - 1),
              u.setMonth.format({ month: o()[e.getMonth()] })
            )
          }
          case c.Year:
            return u.setYear.format({ year: '' + (t.getFullYear() - 1) })
          case c.Decades:
            return u.setDecades.format({
              year_start: '' + (t.getFullYear() - p),
              year_end: '' + (t.getFullYear() - 1),
            })
        }
      }
      function w(e, t) {
        switch (e) {
          case c.Month: {
            const e = C(t)
            return u.setMonth.format({ month: o()[e.getMonth()] })
          }
          case c.Year:
            return u.setYear.format({ year: `${t.getFullYear() + 1}` })
          case c.Decades:
            return u.setDecades.format({
              year_start: `${t.getFullYear() + p}`,
              year_end: '' + (t.getFullYear() + 2 * p - 1),
            })
        }
      }
      function b(e, t) {
        switch (e) {
          case c.Month:
            return u.setYear.format({ year: `${t.getFullYear()}` })
          case c.Year:
            return u.setDecades.format({
              year_start: `${t.getFullYear()}`,
              year_end: '' + (t.getFullYear() + p - 1),
            })
          case c.Decades:
            return u.setMonth.format({ month: o()[t.getMonth()] })
        }
      }
      function C(e) {
        return 11 === e.getMonth()
          ? new Date(e.getFullYear() + 1, 0, 1)
          : new Date(e.getFullYear(), e.getMonth() + 1, 1)
      }
    },
    44313: (e, t, n) => {
      n.d(t, { Calendar: () => R })
      var s = n(50959),
        r = n(97754),
        a = n.n(r),
        o = n(14543),
        i = n(9745),
        l = n(17140),
        u = n(51669)
      function c(e) {
        const {
          prevAriaLabel: t,
          nextAriaLabel: n,
          currentAriaLabel: r,
          currentVisibleTitle: a,
          isNextDisabled: c,
          isPrevDisabled: d,
          isViewModeDisabled: h,
          prevRef: p,
          middleRef: g,
          onPrevClick: f,
          onNextClick: m,
          onCurrentClick: v,
          onPrevKeyDown: D,
          onMiddleKeyDown: y,
          onHeaderKeyDown: w,
        } = e
        return s.createElement(
          'div',
          { className: u.header, onKeyDown: w },
          s.createElement(o.LightButton, {
            startSlot: s.createElement(i.Icon, { icon: l }),
            onClick: f,
            size: 'small',
            variant: 'ghost',
            'aria-label': t,
            disabled: d,
            onKeyDown: D,
            reference: p,
          }),
          s.createElement(
            o.LightButton,
            {
              size: 'small',
              variant: 'ghost',
              'aria-label': r,
              onClick: v,
              disabled: h,
              onKeyDown: y,
              reference: g,
            },
            a,
          ),
          s.createElement(o.LightButton, {
            startSlot: s.createElement(i.Icon, { icon: l }),
            onClick: m,
            size: 'small',
            variant: 'ghost',
            'aria-label': n,
            disabled: c,
            className: u['flip-horizontal'],
          }),
        )
      }
      var d = n(23935),
        h = n(82826),
        p = n(15499)
      class g extends s.PureComponent {
        constructor() {
          super(...arguments),
            (this._dateFormatter = new h.DateFormatter()),
            (this._getVariant = () => {
              let e = 'ghost'
              return (
                this._withinSelectedRange() &&
                  (e = this.props.isDisabled ? 'secondary' : 'quiet-primary'),
                this._isOnHighlightedEdge() &&
                  this.props.isDisabled &&
                  (e = 'quiet-primary'),
                e
              )
            }),
            (this._onClick = () => {
              this.props.onClick &&
                !this.props.isDisabled &&
                this.props.onClick(new Date(this.props.day))
            }),
            (this._onPointerOver = () => {
              this.props.onHover &&
                !this.props.isDisabled &&
                this.props.onHover(new Date(this.props.day))
            }),
            (this._onPointerOut = () => {
              this.props.onHover &&
                !this.props.isDisabled &&
                this.props.onHover(null)
            })
        }
        render() {
          const e = r(
              u.day,
              this.props.isDisabled && u.disabled,
              !this.props.isDisabled &&
                (this.props.isSelected || this._isOnHighlightedEdge()) &&
                u['accent-color'],
              this._withinSelectedRange() && u['within-selected-range'],
              this._isCurrentDay() && u['current-day'],
              !this.props.showFocusRing && u['hide-focus-ring'],
              this.props.isAnotherMonth && u['another-month'],
            ),
            t =
              this.props.isSelected ||
              this._isOnHighlightedEdge() ||
              this._withinSelectedRange(),
            n = t || this._isCurrentDay()
          return s.createElement(
            o.LightButton,
            {
              role: 'cell',
              onClick: this._onClick,
              onPointerOver: this._onPointerOver,
              onPointerOut: this._onPointerOut,
              onFocus: this.props.onFocus,
              size: 'small',
              variant: this._getVariant(),
              isSelected: n,
              'data-day': this._dateFormatter.formatLocal(this.props.day),
              className: r(e, this.props.forceHover && u.hover),
              disabled: this.props.isDisabled,
              reference: this.props.reference,
              tabIndex: this.props.tabIndex,
              'aria-label': (0, p.getDayAriaLabel)(this.props.day),
              'aria-selected': t,
              'aria-current': this._isCurrentDay() ? 'date' : void 0,
              'aria-colindex': this.props.ariaColIndex,
            },
            this.props.day.getDate(),
          )
        }
        _isOnHighlightedEdge() {
          const { day: e, highlightedFrom: t, highlightedTo: n } = this.props
          return (
            !(!t || !n) && ((0, d.isSameDay)(e, t) || (0, d.isSameDay)(e, n))
          )
        }
        _withinSelectedRange() {
          const { day: e, highlightedFrom: t, highlightedTo: n } = this.props
          return !(!t || !n) && this._isBetweenByDay(t, e, n)
        }
        _isCurrentDay() {
          return (0, d.isSameDay)(
            this.props.todayDate ?? new Date(),
            this.props.day,
          )
        }
        _isBetweenByDay(e, t, n) {
          const s = (0, d.resetToDayStart)(e),
            r = (0, d.resetToDayStart)(t),
            a = (0, d.resetToDayStart)(n)
          return s < r && r < a
        }
      }
      const f = 7
      function m(e) {
        const {
          rowIndex: t,
          days: n,
          showFocusRing: r,
          dateInTabOrder: a,
          isDisabledDate: o,
          highlightedFrom: i,
          highlightedTo: l,
          setCurrentlyFocused: c,
          setItemRef: h,
          selectedDate: p,
          viewDate: m,
          onClickDay: v,
          onDayHover: D,
          onDayFocus: y,
          todayDate: w,
          forceHoverTo: b,
          forceHoverFrom: C,
        } = e
        return s.createElement(
          'div',
          { role: 'row', className: u.week },
          n.map((e, u) =>
            s.createElement(g, {
              key: e.toDateString(),
              day: e,
              isDisabled: o(e),
              isSelected: (0, d.isSameDay)(e, p),
              onClick: v,
              onHover: D,
              highlightedFrom: i,
              highlightedTo: l,
              forceHover: C && b && e >= C && e <= b,
              reference: h(e),
              tabIndex: (0, d.isSameDay)(e, a) ? 0 : -1,
              onFocus: () =>
                ((e) => {
                  y?.(e), (0, d.isSameDay)(e, a) && c(e)
                })(e),
              showFocusRing: r,
              todayDate: w,
              isAnotherMonth: !(0, d.isSameMonth)(e, m),
              ariaColIndex: 0 === t ? f - n.length + u + 1 : void 0,
            }),
          ),
        )
      }
      var v = n(78869),
        D = n(68335)
      function y({
        isDisabledDate: e,
        findDate: t,
        getFirstDate: n,
        getLastDate: r,
        setNext: a,
        setPrev: o,
        dateToFocus: i,
        verticalOffset: l,
        dateLevel: u,
      }) {
        const [c, h] = (0, v.useRefsMap)(),
          p = (0, s.useCallback)((t) => (t ? (e(t) ? null : t) : null), [e]),
          g = (0, s.useCallback)(
            (n, s) => {
              if (!n) return null
              const r = (0, d.getCloneDateWithOffset)({
                dateFrom: n,
                offset: s,
                isDisabledDate: e,
                level: u,
              })
              return p(t(r))
            },
            [t, p],
          ),
          f = (0, s.useCallback)(() => {
            const e = n()
            return p(e) || g(e, 1)
          }, [p, g]),
          m = (0, s.useCallback)(() => {
            const e = r()
            return p(e) || g(e, -1)
          }, [p, g]),
          y = (0, s.useCallback)(
            (t, n) => {
              if (!t) return
              const s = (0, d.getCloneDateWithOffset)({
                dateFrom: t,
                offset: n,
                isDisabledDate: e,
                level: u,
              })
              s && (n > 0 ? a(s) : o(s))
            },
            [e, a, o],
          ),
          {
            currentlyFocused: w,
            setCurrentlyFocused: b,
            focusItem: C,
            bindings: F,
          } = (({
            refsMap: e,
            verticalOffset: t,
            getNextKeyToFocus: n,
            getFirstKey: r,
            getLastKey: a,
            onGridEnd: o,
          }) => {
            const [i, l] = (0, s.useState)(null),
              u = (0, s.useCallback)(
                (t) => {
                  if (!t) return
                  const n = e.current.get(t)
                  n && (n.focus(), l(t))
                },
                [e],
              ),
              c = (0, s.useCallback)(
                (e) => {
                  const t = n(i, e)
                  t ? u(t) : o(i, e)
                },
                [i, n],
              ),
              d = (0, s.useCallback)(
                (e) => {
                  const n = (0, D.hashFromEvent)(e)
                  if (
                    (40 === n && (e.preventDefault(), c(t)),
                    38 === n && (e.preventDefault(), c(-1 * t)),
                    39 === n && (e.preventDefault(), c(1)),
                    37 === n && (e.preventDefault(), c(-1)),
                    36 === n)
                  ) {
                    e.preventDefault()
                    const t = r()
                    u(t)
                  }
                  if (35 === n) {
                    e.preventDefault()
                    const t = a()
                    u(t)
                  }
                },
                [i, n],
              )
            return {
              currentlyFocused: i,
              setCurrentlyFocused: l,
              focusItem: u,
              bindings: { onKeyDown: d },
            }
          })({
            refsMap: c,
            verticalOffset: l,
            getNextKeyToFocus: g,
            getFirstKey: f,
            getLastKey: m,
            onGridEnd: y,
          })
        return (
          (0, s.useEffect)(() => C(p(t(i))), [i]),
          {
            itemsRefs: c,
            setItemRef: h,
            ensureNotDisabledDate: p,
            currentlyFocused: w,
            setCurrentlyFocused: b,
            focusItem: C,
            bindings: F,
          }
        )
      }
      function w(e) {
        const {
            selectedDate: t,
            viewDate: n,
            dateToFocus: r,
            weeks: a,
            onClickDay: o,
            setPrevMonth: i,
            setNextMonth: l,
            maxDate: c,
            minDate: h,
            disableWeekends: g,
            showFocusRing: f,
            highlightedFrom: v,
            highlightedTo: D,
            isDisabled: w,
            focusableDateRef: b,
            onDayHover: C,
            onDayFocus: F,
            todayDate: _,
            forceHoverFrom: E,
            forceHoverTo: k,
          } = e,
          M = (0, s.useCallback)(
            (e) => {
              if (!e) return null
              let t = null
              return (
                a.find(
                  ({ days: n }) => (
                    (t = n.find((t) => (0, d.isSameDay)(t, e))), t
                  ),
                ),
                t
              )
            },
            [a],
          ),
          S = (0, s.useCallback)(() => a[0].days[0], [a]),
          N = (0, s.useCallback)(() => {
            const e = a[a.length - 1].days
            return e[e.length - 1]
          }, [a]),
          x = (0, s.useCallback)(
            (e) =>
              w ||
              (0, d.isDayDisabled)({
                day: e,
                minDate: h,
                maxDate: c,
                disableWeekends: g,
              }),
            [h, c, g, w],
          ),
          {
            itemsRefs: T,
            setItemRef: R,
            currentlyFocused: I,
            setCurrentlyFocused: P,
            bindings: Y,
          } = y({
            isDisabledDate: x,
            findDate: M,
            getFirstDate: S,
            getLastDate: N,
            setPrev: i,
            setNext: l,
            dateToFocus: r,
            verticalOffset: 7,
            dateLevel: 'day',
          }),
          V = (0, d.getDateInTabOrder)({
            selectedDate: t,
            dateToFocus: r,
            currentlyFocused: I,
            firstEnabledDate: (0, d.getFirstEnabledDay)(a, x),
            getFirstDate: S,
            getLastDate: N,
            isDisabledDate: x,
          })
        return (
          (0, s.useEffect)(() => {
            b.current = (V && T.current.get(V)) || null
          }, [V, b]),
          s.createElement(
            s.Fragment,
            null,
            s.createElement(
              'div',
              { className: u['sub-header'], 'aria-hidden': !0 },
              (0, p.getWeekDaysMin)().map((e) =>
                s.createElement('span', { key: e }, e),
              ),
            ),
            s.createElement(
              'div',
              { className: u['view-month'], tabIndex: -1, ...Y },
              s.createElement(
                'div',
                { role: 'grid', className: u.weeks },
                a.map((e, r) =>
                  s.createElement(m, {
                    key: e.week,
                    rowIndex: r,
                    setCurrentlyFocused: P,
                    setItemRef: R,
                    dateInTabOrder: V,
                    days: e.days,
                    onDayFocus: F,
                    onDayHover: C,
                    isDisabledDate: x,
                    selectedDate: t,
                    viewDate: n,
                    onClickDay: o,
                    highlightedFrom: v,
                    highlightedTo: D,
                    showFocusRing: f,
                    todayDate: _,
                    forceHoverFrom: E,
                    forceHoverTo: k,
                  }),
                ),
              ),
            ),
          )
        )
      }
      var b = n(82665)
      const C = 3
      function F(e) {
        const {
            months: t,
            selectedDate: n,
            maxDate: r,
            minDate: a,
            showFocusRing: i,
            dateToFocus: l,
            isDisabled: c,
            focusableDateRef: h,
            onSelect: g,
            setPrevYear: f,
            setNextYear: m,
          } = e,
          v = (0, s.useCallback)(
            (e) => c || !(0, d.isInRange)(e, a, r, 'month'),
            [a, r, c],
          ),
          D = (0, s.useCallback)(
            (e) => {
              if (!e) return null
              let n = null
              return (
                t.find(
                  ({ date: t }) => (
                    (n = (0, d.isSameMonth)(e, t) ? t : null), n
                  ),
                ),
                n
              )
            },
            [t],
          ),
          w = (0, s.useCallback)(() => t[0].date, [t]),
          F = (0, s.useCallback)(() => t[t.length - 1].date, [t]),
          {
            itemsRefs: _,
            setItemRef: E,
            currentlyFocused: k,
            setCurrentlyFocused: M,
            bindings: S,
          } = y({
            isDisabledDate: v,
            findDate: D,
            getFirstDate: w,
            getLastDate: F,
            setPrev: f,
            setNext: m,
            verticalOffset: C,
            dateToFocus: l,
            dateLevel: 'month',
          }),
          N = (0, d.getDateInTabOrder)({
            selectedDate: n,
            dateToFocus: l,
            currentlyFocused: k,
            firstEnabledDate: (0, d.getFirstEnabledMonth)(t, v),
            getFirstDate: w,
            getLastDate: F,
            isDisabledDate: v,
          })
        ;(0, s.useEffect)(() => {
          h.current = (N && _.current.get(N)) || null
        }, [N, h])
        const x = (0, s.useMemo)(() => (0, b.default)(t, C), [t])
        return s.createElement(
          s.Fragment,
          null,
          s.createElement(
            'div',
            { className: u['sub-header'], 'aria-hidden': !0 },
            s.createElement('span', null, (0, p.getSubHeaderYear)()),
          ),
          s.createElement(
            'div',
            { role: 'grid', className: u['view-year'], ...S },
            x.map((e, t) =>
              s.createElement(
                'div',
                { key: t, role: 'row', className: u['grid-row'] },
                e.map(({ title: e, ariaLabel: t, date: r }) => {
                  const a = (0, d.isSameMonth)(r, n),
                    l = v(r),
                    c = a ? 'quiet-primary' : 'ghost'
                  return s.createElement(
                    o.LightButton,
                    {
                      key: r.toDateString(),
                      role: 'cell',
                      size: 'small',
                      variant: c,
                      disabled: l,
                      isSelected: a,
                      className: !i && u['hide-focus-ring'],
                      onClick: () => g(r),
                      reference: E(r),
                      tabIndex: (0, d.isSameMonth)(r, N) ? 0 : -1,
                      onFocus: (0, d.isSameMonth)(r, N) ? () => M(r) : void 0,
                      'aria-label': `${t} ${r.getFullYear()}`,
                      'aria-selected': a,
                    },
                    e,
                  )
                }),
              ),
            ),
          ),
        )
      }
      const _ = 4
      function E(e) {
        const {
            years: t,
            selectedDate: n,
            dateToFocus: r,
            maxDate: i,
            minDate: l,
            showFocusRing: c,
            isDisabled: h,
            focusableDateRef: g,
            onSelect: f,
            setPrevDecades: m,
            setNextDecades: v,
          } = e,
          D = (0, s.useCallback)(
            (e) => h || !(0, d.isInRange)(e, l, i, 'year'),
            [l, i, h],
          ),
          w = (0, s.useCallback)(
            (e) => (e && t.find((t) => (0, d.isSameYear)(e, t))) || null,
            [t],
          ),
          C = (0, s.useCallback)(() => t[0], [t]),
          F = (0, s.useCallback)(() => t[t.length - 1], [t]),
          {
            itemsRefs: E,
            setItemRef: k,
            currentlyFocused: M,
            setCurrentlyFocused: S,
            bindings: N,
          } = y({
            isDisabledDate: D,
            findDate: w,
            getFirstDate: C,
            getLastDate: F,
            setPrev: m,
            setNext: v,
            dateToFocus: r,
            verticalOffset: _,
            dateLevel: 'year',
          }),
          x = (0, d.getDateInTabOrder)({
            selectedDate: n,
            dateToFocus: r,
            currentlyFocused: M,
            firstEnabledDate: (0, d.getFirstEnabledYear)(t, D),
            getFirstDate: C,
            getLastDate: F,
            isDisabledDate: D,
          })
        ;(0, s.useEffect)(() => {
          g.current = (x && E.current.get(x)) || null
        }, [x, g])
        const T = (0, s.useMemo)(() => (0, b.default)(t, _), [t])
        return s.createElement(
          s.Fragment,
          null,
          s.createElement(
            'div',
            { className: u['sub-header'], 'aria-hidden': !0 },
            s.createElement('span', null, (0, p.getSubHeaderDecades)()),
          ),
          s.createElement(
            'div',
            { role: 'grid', className: u['view-decades'], ...N },
            T.map((e, t) =>
              s.createElement(
                'div',
                { key: t, role: 'row', className: u['grid-row'] },
                e.map((e) => {
                  const t = e.getFullYear(),
                    r = (0, d.isSameYear)(e, n),
                    i = D(e),
                    l = r ? 'quiet-primary' : 'ghost'
                  return s.createElement(
                    o.LightButton,
                    {
                      key: e.toDateString(),
                      role: 'cell',
                      size: 'small',
                      variant: l,
                      disabled: i,
                      isSelected: r,
                      className: a()(
                        u['decade-button'],
                        !c && u['hide-focus-ring'],
                      ),
                      onClick: () => f(e),
                      reference: k(e),
                      tabIndex: (0, d.isSameYear)(e, x) ? 0 : -1,
                      onFocus: (0, d.isSameYear)(e, x) ? () => S(e) : void 0,
                      'aria-selected': r,
                    },
                    t,
                  )
                }),
              ),
            ),
          ),
        )
      }
      function k({
        selectedDate: e,
        autoFocus: t,
        showFocusRing: n,
        minDate: r,
        maxDate: a,
        onSelect: o,
        onMonthSwitch: i,
        onYearSwitch: l,
        onDecadesSwitch: u,
        onViewTypeChange: c,
        fullSixWeeks: h,
      }) {
        const [g, f] = (0, s.useState)(e),
          [m, v] = (0, s.useState)(p.CalendarViewType.Month),
          [D, y] = (0, s.useState)(t ? e : null),
          w = (0, s.useMemo)(() => (0, d.getDecadesStart)(g), [g]),
          b = (0, s.useCallback)(
            (e) => {
              const t = new Date(g),
                n = (0, p.getNextMonth)(g),
                s = new Date(n.getFullYear(), n.getMonth() + e, 0).getDate(),
                r = g.getDate() > s ? s : g.getDate()
              t.setMonth(t.getMonth() + e, r), f(t), i && i(t)
            },
            [g, i],
          ),
          C = (0, s.useCallback)(
            (e) => {
              const t = new Date(g)
              t.setFullYear(t.getFullYear() + e), f(t), l && l(t)
            },
            [g, l],
          ),
          F = (0, s.useCallback)(
            (e) => {
              const t = new Date(w)
              t.setFullYear(t.getFullYear() + e), f(t), u && u(t)
            },
            [w, g, u],
          ),
          _ = (0, s.useCallback)(
            (e, t) => {
              switch ((t && y(t), m)) {
                case p.CalendarViewType.Month:
                  return b(1 * e)
                case p.CalendarViewType.Year:
                  return C(1 * e)
                case p.CalendarViewType.Decades:
                  return F(e * p.DECADES_YEARS_AMOUNT)
              }
            },
            [m, b, C, F],
          ),
          E = (0, s.useCallback)((e) => _(-1, e), [_]),
          k = (0, s.useCallback)((e) => _(1, e), [_]),
          M = (0, s.useCallback)(() => {
            const e = Object.values(p.CalendarViewType)
            let t = e.indexOf(m) + 1
            t >= e.length && (t = 0), v(e[t]), c && c(e[t])
          }, [m]),
          S = (0, s.useCallback)(
            (e) => {
              f(new Date(e)), o && o(new Date(e))
            },
            [o],
          ),
          N = (0, s.useCallback)(
            (e) => {
              const t = new Date(g)
              t.setMonth(e.getMonth()),
                (0, d.isSameMonth)(t, e) || t.setMonth(e.getMonth(), 1),
                f(t)
              const n = new Date(D || g)
              n.setMonth(e.getMonth()),
                (0, d.isSameMonth)(n, e) || n.setMonth(e.getMonth(), 1),
                y(n),
                v(p.CalendarViewType.Month)
            },
            [g, o, M],
          ),
          x = (0, s.useCallback)(
            (e) => {
              const t = new Date(g)
              t.setFullYear(e.getFullYear()), f(t)
              const n = new Date(D || g)
              n.setFullYear(e.getFullYear()), y(n), v(p.CalendarViewType.Year)
            },
            [g, o, M],
          ),
          T = (0, s.useMemo)(() => (0, d.getWeeks)(g, h), [g, h]),
          R = (0, s.useMemo)(
            () =>
              ((e) =>
                (0, p.getMonthsShort)().map((t, n) => {
                  const s = (0, d.resetToMonthStart)(e)
                  return (
                    s.setMonth(n),
                    { title: t, ariaLabel: (0, p.getMonths)()[n], date: s }
                  )
                }))(g),
            [g],
          ),
          I = (0, s.useMemo)(
            () =>
              ((e) => {
                const t = []
                for (let n = 0; n < p.DECADES_YEARS_AMOUNT; n++) {
                  const s = new Date(e)
                  s.setFullYear(e.getFullYear() + n), t.push(s)
                }
                return t
              })(w),
            [w],
          ),
          P = (0, s.useMemo)(() => {
            switch (m) {
              case p.CalendarViewType.Month: {
                const e = T[T.length - 1].days,
                  t = new Date(e[e.length - 1])
                return t.setDate(t.getDate() + 1), !(0, d.isInRange)(t, r, a)
              }
              case p.CalendarViewType.Year: {
                const e = new Date(R[R.length - 1].date)
                return (
                  e.setMonth(e.getMonth() + 1),
                  !(0, d.isInRange)(e, r, a, 'month')
                )
              }
              case p.CalendarViewType.Decades: {
                const e = new Date(I[I.length - 1])
                return (
                  e.setFullYear(e.getFullYear() + 1),
                  !(0, d.isInRange)(e, r, a, 'year')
                )
              }
            }
          }, [m, r, a, T, R, I]),
          Y = (0, s.useMemo)(() => {
            switch (m) {
              case p.CalendarViewType.Month: {
                const e = new Date(T[0].days[0])
                return e.setDate(e.getDate() - 1), !(0, d.isInRange)(e, r, a)
              }
              case p.CalendarViewType.Year: {
                const e = new Date(R[0].date)
                return (
                  e.setMonth(e.getMonth() - 1),
                  !(0, d.isInRange)(e, r, a, 'month')
                )
              }
              case p.CalendarViewType.Decades: {
                const e = new Date(I[0])
                return (
                  e.setFullYear(e.getFullYear() - 1),
                  !(0, d.isInRange)(e, r, a, 'year')
                )
              }
            }
          }, [m, r, a, T, R, I])
        return (
          (0, s.useEffect)(() => {
            !D && n && t && y(e), n || y(null)
          }, [t, e, D, n]),
          {
            viewDate: g,
            setViewDate: f,
            viewType: m,
            setViewType: v,
            dateToFocus: D,
            weeks: T,
            months: R,
            years: I,
            isNextDisabled: P,
            isPrevDisabled: Y,
            setPrev: E,
            setNext: k,
            switchViewType: M,
            onClickDay: S,
            onClickMonth: N,
            onClickYear: x,
          }
        )
      }
      class M {
        constructor(e, t = []) {
          ;(this._messagesQueue = []),
            (this._alternate = !1),
            (this._renderedMessage = null),
            (this._idCounter = 0),
            (this._containers = [...t]),
            (this._type = e)
        }
        setContainers(e) {
          this._containers = [...e]
        }
        addMessage(e, t = 0) {
          const n = this._generateId(),
            s = {
              id: n,
              message: e,
              destroyTimeout: this._calculateDestroyTimeout(e, t),
            }
          return (
            this._messagesQueue.push(s),
            this._renderedMessage || this._renderMessage(),
            {
              ...s,
              type: this._type,
              destroy: this._getDestroyMessageCallback(n),
            }
          )
        }
        destroyAll() {
          ;(this._messagesQueue = []),
            clearTimeout(this._renderedMessage?.destroyTimer),
            this._containers.forEach((e) => {
              e.innerText = ''
            }),
            (this._renderedMessage = null),
            (this._alternate = !1)
        }
        _generateId() {
          return `live-region-${this._type}-${this._idCounter++}`
        }
        _calculateDestroyTimeout(e, t = 0) {
          const n = 50 * e.trim().length + 200,
            s = 250 * e.trim().length
          return Math.min(Math.max(n, t), s)
        }
        _findById(e) {
          return this._renderedMessage?.id === e
            ? this._renderedMessage
            : this._messagesQueue.find((t) => t.id === e)
        }
        _getDestroyMessageCallback(e) {
          return async (t) => {
            const n = this._findById(e)
            return (
              !!n &&
              (n.renderedTo
                ? !!t &&
                  (this._removeRenderedMessage(), this._renderMessage(), !0)
                : (this._removeFromQueue(n), !0))
            )
          }
        }
        _removeRenderedMessage() {
          const e = this._renderedMessage?.renderedTo
          e && (e.innerText = ''), (this._renderedMessage = null)
        }
        _removeFromQueue(e) {
          this._messagesQueue = this._messagesQueue.filter((t) => t !== e)
        }
        async _renderMessage() {
          if (!this._containers.length || !this._messagesQueue.length) return
          const e = this._alternate ? this._containers[0] : this._containers[1],
            t = this._messagesQueue.shift()
          let n
          e.innerText = t.message
          const s = new Promise((e, s) => {
            n = setTimeout(() => {
              if (this._renderedMessage?.id === t.id)
                return (
                  this._removeRenderedMessage(),
                  void this._renderMessage().then(e)
                )
              s(
                "Currently rendered message is not the one that you 're trying to destroy",
              )
            }, t.destroyTimeout)
          })
          ;(this._renderedMessage = {
            ...t,
            renderedTo: e,
            destroyTimer: n,
            destroyPromise: s,
          }),
            (this._alternate = !this._alternate)
        }
      }
      class S extends M {}
      const N = new (class {
        constructor() {
          ;(this.isInited = !1),
            (this._politeQueue = new S('polite')),
            (this._assertiveQueue = new S('assertive'))
        }
        renderTo(e, t = !1) {
          return t && this.destroy(), this._init(e)
        }
        destroy() {
          this._politeQueue.destroyAll(),
            this._assertiveQueue.destroyAll(),
            (this.isInited = !1)
        }
        sayPolitely(e, t) {
          return this.isInited ? this._politeQueue.addMessage(e, t) : null
        }
        interrupt(e, t) {
          return this.isInited ? this._assertiveQueue.addMessage(e, t) : null
        }
        _init(e) {
          if (!e) return !1
          if (this.isInited) return !1
          return !!this._setContainers(e) && ((this.isInited = !0), !0)
        }
        _setContainers(e) {
          const t = document.getElementById(e)
          if (!t) return !1
          const n = t.querySelectorAll('[aria-live="polite"]'),
            s = t.querySelectorAll('[aria-live="assertive"]')
          return (
            !(!n || 2 !== n.length || !s || 2 !== s.length) &&
            (this._politeQueue.setContainers([n[0], n[1]]),
            this._assertiveQueue.setContainers([s[0], s[1]]),
            !0)
          )
        }
      })()
      var x
      function T({
        viewType: e,
        decadesStartYear: t,
        viewDate: n,
        setPrev: r,
        setNext: a,
        switchViewType: o,
      }) {
        const [i, l] = (0, s.useState)(null),
          u = (0, s.useCallback)(
            (e) => {
              i && i.destroy(), l(N.sayPolitely(e))
            },
            [i, l],
          )
        return {
          onPrevClick: (0, s.useCallback)(() => {
            u(
              (0, p.getPrevLiveRegionConfirmation)(
                e,
                e === p.CalendarViewType.Decades ? t : n,
              ),
            ),
              r(null)
          }, [r, u]),
          onNextClick: (0, s.useCallback)(() => {
            u(
              (0, p.getNextLiveRegionConfirmation)(
                e,
                e === p.CalendarViewType.Decades ? t : n,
              ),
            ),
              a(null)
          }, [a, u]),
          onSwitchViewType: (0, s.useCallback)(
            (s) => {
              u(
                (0, p.getViewTypeLiveRegionConfirmation)(
                  e,
                  e === p.CalendarViewType.Year ? t : n,
                ),
              ),
                o(s)
            },
            [o, u],
          ),
        }
      }
      function R(e) {
        const {
            selectedDate: t,
            maxDate: n,
            minDate: a,
            className: o,
            disableWeekends: i,
            highlightedFrom: l,
            highlightedTo: d,
            todayDate: h,
            popupStyle: g = !0,
            showFocusRing: f = !1,
            autoFocus: m = !1,
            isDisabled: v = !1,
            withFocusTrap: y = !1,
            endSlot: b,
            onSelect: C,
            onMonthSwitch: _,
            onYearSwitch: M,
            onDecadesSwitch: S,
            onViewTypeChange: N,
            focusTriggerElement: x,
            fullSixWeeks: R,
            onDayHover: I,
            onDayFocus: P,
            forceHoverTo: Y,
            forceHoverFrom: V,
            calendarRef: H,
          } = e,
          [z, L] = (0, s.useState)(f),
          O = (0, s.useCallback)(() => L(!0), [L])
        ;(0, s.useEffect)(() => {
          f && L(!0)
        }, [f])
        const $ = (0, s.useCallback)(
            (e) => {
              x &&
                38 === (0, D.hashFromEvent)(e) &&
                (e.preventDefault(), e.stopPropagation(), L(!1), x())
            },
            [x],
          ),
          {
            viewDate: A,
            setViewDate: K,
            viewType: B,
            setViewType: j,
            dateToFocus: Q,
            weeks: W,
            months: Z,
            years: J,
            isNextDisabled: U,
            isPrevDisabled: q,
            setPrev: X,
            setNext: G,
            switchViewType: ee,
            onClickDay: te,
            onClickMonth: ne,
            onClickYear: se,
          } = k({
            selectedDate: t,
            minDate: a,
            maxDate: n,
            autoFocus: m,
            showFocusRing: z,
            onMonthSwitch: _,
            onYearSwitch: M,
            onDecadesSwitch: S,
            onViewTypeChange: N,
            onSelect: C,
            fullSixWeeks: R,
          }),
          {
            focusableDateRef: re,
            prevRef: ae,
            middleRef: oe,
            onPrevKeyDown: ie,
            onMiddleKeyDown: le,
            forwardFocusToStart: ue,
          } = (({ withFocusTrap: e, isPrevDisabled: t }) => {
            const n = (0, s.useRef)(null),
              r = (0, s.useCallback)(
                (t) => {
                  e &&
                    D.Modifiers.Shift + 9 === (0, D.hashFromEvent)(t) &&
                    (t.preventDefault(), n.current?.focus())
                },
                [e],
              ),
              a = (0, s.useCallback)(
                (e) => {
                  t || r(e)
                },
                [t, r],
              ),
              o = (0, s.useCallback)(
                (e) => {
                  t && r(e)
                },
                [t, r],
              ),
              i = (0, s.useRef)(null),
              l = (0, s.useRef)(null),
              u = (0, s.useCallback)(
                (e) => {
                  e.preventDefault(),
                    e.stopPropagation(),
                    t ? l.current?.focus() : i.current?.focus()
                },
                [t],
              )
            return {
              focusableDateRef: n,
              prevRef: i,
              middleRef: l,
              onPrevKeyDown: a,
              onMiddleKeyDown: o,
              forwardFocusToStart: u,
            }
          })({ withFocusTrap: y, isPrevDisabled: q }),
          ce = (0, s.useMemo)(() => J[0], [J]),
          {
            onPrevClick: de,
            onNextClick: he,
            onSwitchViewType: pe,
          } = T({
            viewType: B,
            decadesStartYear: ce,
            viewDate: A,
            setPrev: X,
            setNext: G,
            switchViewType: ee,
          })
        return (
          (0, s.useImperativeHandle)(
            H,
            () => ({
              focus() {
                q ? oe.current?.focus() : ae.current?.focus()
              },
              setViewDate: K,
              setViewType: j,
            }),
            [q],
          ),
          s.createElement(
            'div',
            {
              className: r(u.calendar, g && u.popupStyle, o),
              tabIndex: -1,
              onKeyDown: O,
            },
            s.createElement(c, {
              prevAriaLabel: (0, p.getPrevAriaLabel)(
                B,
                B === p.CalendarViewType.Decades ? ce : A,
              ),
              nextAriaLabel: (0, p.getNextAriaLabel)(
                B,
                B === p.CalendarViewType.Decades ? ce : A,
              ),
              currentAriaLabel: (0, p.getCurrentAriaLabel)(
                B,
                B === p.CalendarViewType.Year ? ce : A,
              ),
              currentVisibleTitle: (0, p.getCurrentVisibleTitle)(
                B,
                B === p.CalendarViewType.Decades ? ce : A,
              ),
              onPrevClick: de,
              onNextClick: he,
              onPrevKeyDown: ie,
              onMiddleKeyDown: le,
              onHeaderKeyDown: $,
              onCurrentClick: pe,
              isNextDisabled: v || U,
              isPrevDisabled: v || q,
              isViewModeDisabled: v,
              prevRef: ae,
              middleRef: oe,
            }),
            B === p.CalendarViewType.Month &&
              s.createElement(w, {
                weeks: W,
                selectedDate: t,
                viewDate: A,
                dateToFocus: Q,
                maxDate: n,
                minDate: a,
                onClickDay: te,
                disableWeekends: i,
                highlightedFrom: l,
                highlightedTo: d,
                setPrevMonth: X,
                setNextMonth: G,
                showFocusRing: z,
                isDisabled: v,
                focusableDateRef: re,
                todayDate: h,
                onDayHover: I,
                onDayFocus: P,
                forceHoverFrom: V,
                forceHoverTo: Y,
              }),
            B === p.CalendarViewType.Year &&
              s.createElement(F, {
                months: Z,
                selectedDate: t,
                dateToFocus: Q,
                maxDate: n,
                minDate: a,
                onSelect: ne,
                setPrevYear: X,
                setNextYear: G,
                showFocusRing: z,
                isDisabled: v,
                focusableDateRef: re,
              }),
            B === p.CalendarViewType.Decades &&
              s.createElement(E, {
                years: J,
                selectedDate: t,
                dateToFocus: Q,
                maxDate: n,
                minDate: a,
                onSelect: se,
                setPrevDecades: X,
                setNextDecades: G,
                showFocusRing: z,
                isDisabled: v,
                focusableDateRef: re,
              }),
            s.createElement('div', { className: u['slot-wrapper'] }, b),
            y && s.createElement('div', { tabIndex: 0, onFocus: ue }),
          )
        )
      }
      !((e) => {
        ;(e.Assertive = 'assertive'), (e.Polite = 'polite')
      })(x || (x = {}))
    },
    85528: (e, t, n) => {
      n.d(t, { DatePicker: () => E })
      var s = n(11542),
        r = n(50959),
        a = n(97754),
        o = n(75774),
        i = n(32563),
        l = n(82826),
        u = n(44313),
        c = n(50151),
        d = n(9745),
        h = n(86623),
        p = n(1140),
        g = n(78274),
        f = n(52778),
        m = n(42842),
        v = n(68335),
        D = n(62860)
      class y extends r.PureComponent {
        constructor(e) {
          super(e),
            (this._input = null),
            (this._inputContainer = null),
            (this._handleFocus = (e) => {
              this.props.showOnFocus && this.props.onShowPicker(),
                this.props.onFocus?.(e)
            }),
            (this._handleInputRef = (e) => {
              ;(this._input = e),
                this.props.inputReference &&
                  this.props.inputReference(this._input)
            }),
            (this._handleContainerRef = (e) => {
              this._inputContainer = e
            }),
            (this._onShowPicker = (e) => {
              if (e && this._inputContainer) {
                const t = e.getBoundingClientRect(),
                  n = this._inputContainer.getBoundingClientRect()
                t.width && t.width > window.innerWidth - n.left
                  ? ((e.style.right = '0'), (e.style.left = 'auto'))
                  : ((e.style.right = 'auto'), (e.style.left = `${n.left}px`))
                const s = window.innerHeight - n.bottom,
                  r = n.top
                if (s >= t.height) return void (e.style.top = `${n.bottom}px`)
                ;(e.style.top = 'auto'),
                  (e.style.bottom = r < t.height ? '0' : `${s + n.height}px`)
              }
            }),
            (this._onChange = () => {
              const e = (0, c.ensureNotNull)(this._input).value
              this.setState({ value: e }), this.props.onType(e)
            }),
            (this._onKeyDown = (e) => {
              this.props.hideOnKeyDown && this.props.onHidePicker(),
                this.props.onKeyDown && this.props.onKeyDown(e)
            }),
            (this._onKeyPress = (e) => {
              if (e.charCode) {
                const t = String.fromCharCode(e.charCode)
                this.props.inputRegex.test(t) || e.preventDefault()
              }
            }),
            (this._onKeyUp = (e) => {
              if (8 !== e.keyCode) {
                const e = (0, c.ensureNotNull)(this._input).value,
                  t = this.props.fixValue(e)
                t !== e && this.setState({ value: t })
              }
            }),
            (this._handleDropdownKeydown = (e) => {
              27 === (0, v.hashFromEvent)(e) &&
                (this._input?.focus(), this.props.onHidePicker())
            }),
            (this.state = { value: e.value, valueFromProps: e.value })
        }
        render() {
          const {
            position: e = 'fixed',
            className: t,
            size: n,
            disabled: s,
            readonly: o,
            errors: i,
            icon: l,
            InputComponent: u = h.FormInput,
          } = this.props
          return r.createElement(
            'div',
            { className: D.pickerInput, ref: this._handleContainerRef },
            r.createElement(u, {
              value: this.state.value,
              onBlur: this.props.onBlur,
              onKeyDown: this._onKeyDown,
              onKeyPress: this._onKeyPress,
              onKeyUp: this._onKeyUp,
              onChange: this._onChange,
              onFocus: this._handleFocus,
              onClick: this.props.onShowPicker,
              reference: this._handleInputRef,
              className: t,
              size: n,
              disabled: s,
              errors: i,
              messagesPosition: p.MessagesPosition.Attached,
              hasErrors: this.props.showErrorMessages && i && i.length > 0,
              name: this.props.name,
              readonly: o,
              endSlot:
                i && i.length
                  ? void 0
                  : r.createElement(
                      g.EndSlot,
                      null,
                      r.createElement(d.Icon, {
                        icon: l,
                        className: a(D.icon, s && D.disabled),
                        onClick: s || o ? void 0 : this.props.onShowPicker,
                      }),
                    ),
              'data-name': this.props.name,
            }),
            this.props.showPicker && !o
              ? r.createElement(
                  m.Portal,
                  {
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    pointerEvents: 'none',
                  },
                  r.createElement(
                    f.OutsideEvent,
                    { mouseDown: !0, handler: this.props.onHidePicker },
                    (t) =>
                      r.createElement(
                        'span',
                        { ref: t, style: { pointerEvents: 'auto' } },
                        r.createElement(
                          'div',
                          {
                            className: a(D.picker, D[e]),
                            key: '0',
                            ref: this._onShowPicker,
                            onKeyDown: this._handleDropdownKeydown,
                          },
                          this.props.children,
                        ),
                      ),
                  ),
                )
              : null,
          )
        }
        static getDerivedStateFromProps(e, t) {
          return e.value !== t.valueFromProps
            ? { value: e.value, valueFromProps: e.value }
            : null
        }
      }
      y.defaultProps = { showOnFocus: !0 }
      class w extends r.PureComponent {
        constructor(e) {
          super(e),
            (this._input = null),
            (this._nativeInputRef = r.createRef()),
            (this._handleInputRef = (e) => {
              ;(this._input = e),
                this.props.inputReference &&
                  this.props.inputReference(this._input)
            }),
            (this._onFocus = () => {
              this.setState({ isFocused: !0 })
            }),
            (this._onBlur = () => {
              this._nativeInputRef.current &&
                (this._nativeInputRef.current.defaultValue = this.props.value),
                this.setState({ isFocused: !1 })
            }),
            (this._onChange = (e) => {
              const { value: t } = e.target
              t && (this.setState({ value: t }), this.props.onChange(t))
            }),
            (this.state = { value: e.value, isFocused: !1 })
        }
        componentDidMount() {
          this._nativeInputRef.current &&
            (this._nativeInputRef.current.defaultValue = this.props.value)
        }
        render() {
          const {
              className: e,
              containerClassName: t,
              disabled: n,
              errors: s,
              InputComponent: o = h.FormInput,
            } = this.props,
            i = !this.props.readonly && !n,
            l = this.props.showErrorMessages && s && s.length > 0
          return r.createElement(
            'div',
            { className: a(D.pickerInput, t) },
            r.createElement(o, {
              value: this.props.value,
              readonly: !0,
              noReadonlyStyles: !0,
              endSlot:
                s && s.length
                  ? void 0
                  : r.createElement(
                      g.EndSlot,
                      null,
                      r.createElement(d.Icon, {
                        icon: this.props.icon,
                        className: a(D.icon, n && D.disabled),
                      }),
                    ),
              className: e,
              inputClassName: D.textInput,
              size: this.props.size,
              disabled: n,
              hasErrors: l,
              errors: s,
              alwaysShowAttachedErrors: !0,
              messagesPosition: p.MessagesPosition.Attached,
              name: i ? void 0 : this.props.name,
              reference: this._handleInputRef,
              highlight: this.state.isFocused,
              intent: !l && this.state.isFocused ? 'primary' : void 0,
            }),
            i &&
              r.createElement('input', {
                ref: this._nativeInputRef,
                type: this.props.type,
                className: D.nativePicker,
                onChange: this._onChange,
                onInput: this._onChange,
                min: this.props.min,
                max: this.props.max,
                name: this.props.name,
                onFocus: this._onFocus,
                onBlur: this._onBlur,
              }),
          )
        }
      }
      var b = n(23935),
        C = n(67029),
        F = n(53017),
        _ = n(1401)
      class E extends r.PureComponent {
        constructor(e) {
          super(e),
            (this._pickerInputContainerRef = r.createRef()),
            (this._pickerInpuRef = r.createRef()),
            (this._dateFormatter = new l.DateFormatter()),
            (this._onPickerInputKeyDown = (e) => {
              const t = (0, v.hashFromEvent)(e)
              if ([v.Modifiers.Shift + 9, 9].includes(t)) this._hideCalendar()
              else {
                if (40 === t || 38 === t)
                  return (
                    e.preventDefault(),
                    this._showCalendar(),
                    void this.setState({ autofocusCalendar: !0 })
                  )
                13 === t && this.props.onEnter && this.props.onEnter(e),
                  this._hideCalendar()
              }
            }),
            (this._returnFocusToInput = (e) => {
              this.setState({ autofocusCalendar: !1 }),
                this._pickerInpuRef.current?.focus(),
                e && this._hideCalendar()
            }),
            (this._fixValue = (e) => (
              (e = (e = e.substring(0, 10)).replace(/-+/g, '-')),
              (/^\d{4}$/.test(e) || /^\d{4}-\d{2}$/.test(e)) && (e += '-'),
              e
            )),
            (this._isValid = (e) => {
              const t = this._dateFormatter.parse(e)
              if (t.res && /^[0-9]{4}(-[0-9]{2}){2}$/.test(t.value)) {
                const e = new Date(t.value)
                return (
                  !(0, b.isInvalidDateObj)(e) &&
                  (!!(
                    this.props.noRangeValidation ||
                    (i.mobiletouch && o.isIOS)
                  ) ||
                    (0, b.isInRange)(e, this.props.minDate, this.props.maxDate))
                )
              }
              return !1
            }),
            (this._onBlur = (e) => {
              if (
                !this.props.revertInvalidData ||
                this._pickerInputContainerRef.current?.contains(e.relatedTarget)
              )
                return
              const { value: t } = e.target
              if (!this._isValid(t)) {
                const t = new Date(this.state.date)
                this.setState({
                  pickerInputKey: e.timeStamp,
                  date: t,
                  isInvalid: !1,
                }),
                  this.props.onPick(t)
              }
            }),
            (this._onType = (e) => {
              let t = this._isValid(e) ? new Date(e.concat('T00:00')) : null
              t && isNaN(t.valueOf()) && (t = null),
                t
                  ? this.setState({ date: t, isInvalid: !1 })
                  : this.setState({ isInvalid: !0 }),
                this.props.onPick(t)
            }),
            (this._onSelect = (e) => {
              this.setState({ date: e, showCalendar: !1, isInvalid: !1 }),
                this._returnFocusToInput(!0),
                this.props.onPick(e)
            }),
            (this._showCalendar = () => {
              this.setState({ showCalendar: !0 })
            }),
            (this._hideCalendar = () => {
              this.setState({ showCalendar: !1, autofocusCalendar: !1 })
            }),
            (this._getErrors = () => {
              const e = this.props.errors ? [...this.props.errors] : []
              return (
                this.state.isInvalid && e.push(s.t(null, void 0, n(46420))), e
              )
            }),
            (this.state = {
              pickerInputKey: 0,
              date: e.initial,
              showCalendar: !1,
              isInvalid: !this._isValid(
                this._dateFormatter.formatLocal(e.initial),
              ),
              autofocusCalendar: !1,
              initial: e.initial,
            })
        }
        render() {
          const e = this.props.endSlotComponent,
            t = (0, F.mergeRefs)([
              this._pickerInpuRef,
              this.props.inputReference,
            ])
          return i.mobiletouch
            ? r.createElement(w, {
                value: this._dateFormatter.formatLocal(this.state.date),
                type: 'date',
                onChange: this._onType,
                icon: _,
                disabled: this.props.disabled,
                size: this.props.size,
                min:
                  this.props.minDate &&
                  this._dateFormatter.formatLocal(this.props.minDate),
                max:
                  this.props.maxDate &&
                  this._dateFormatter.formatLocal(this.props.maxDate),
                errors: this._getErrors(),
                showErrorMessages: this.props.showErrorMessages,
                name: this.props.name,
                readonly: this.props.readonly,
                className: a(
                  this._getFontSizeClassName(this.props.size),
                  this.props.className,
                ),
                containerClassName: this.props.containerClassName,
                inputReference: this.props.inputReference,
                InputComponent: this.props.InputComponent,
              })
            : r.createElement(
                'div',
                {
                  className: this.props.containerClassName,
                  ref: this._pickerInputContainerRef,
                },
                r.createElement(
                  y,
                  {
                    key: this.state.pickerInputKey,
                    value: this._dateFormatter.formatLocal(this.state.date),
                    inputRegex: /[0-9.]/,
                    fixValue: this._fixValue,
                    onType: this._onType,
                    onBlur: this._onBlur,
                    onShowPicker: this._showCalendar,
                    onHidePicker: this._hideCalendar,
                    showPicker:
                      this.state.showCalendar && this.props.withCalendar,
                    showOnFocus: this.props.showOnFocus,
                    icon: _,
                    disabled: this.props.disabled,
                    size: this.props.size,
                    errors: this._getErrors(),
                    showErrorMessages: this.props.showErrorMessages,
                    name: this.props.name,
                    readonly: this.props.readonly,
                    position: this.props.position,
                    className: a(
                      this._getFontSizeClassName(this.props.size),
                      this.props.className,
                    ),
                    inputReference: t,
                    InputComponent: this.props.InputComponent,
                    onKeyDown: this._onPickerInputKeyDown,
                    onFocus: this.props.onFocus,
                  },
                  r.createElement(u.Calendar, {
                    selectedDate: this.state.date,
                    maxDate: this.props.maxDate,
                    minDate: this.props.minDate,
                    onSelect: this._onSelect,
                    endSlot:
                      e && r.createElement(e, { onSelectDate: this._onSelect }),
                    autoFocus: this.state.autofocusCalendar,
                    showFocusRing: this.state.autofocusCalendar,
                    focusTriggerElement: this._returnFocusToInput,
                    withFocusTrap: !0,
                  }),
                ),
              )
        }
        static getDerivedStateFromProps(e, t) {
          return t.initial !== e.initial
            ? { ...t, date: e.initial, initial: e.initial }
            : null
        }
        _getFontSizeClassName(e) {
          return e
            ? 'large' === e
              ? C.InputClasses.FontSizeLarge
              : C.InputClasses.FontSizeMedium
            : void 0
        }
      }
      E.defaultProps = { position: 'fixed', withCalendar: !0 }
    },
    76056: (e, t, n) => {
      n.d(t, { DateInput: () => g })
      var s = n(50959),
        r = n(11542),
        a = n(9745),
        o = n(78274),
        i = n(86623),
        l = n(97754),
        u = n.n(l),
        c = n(64373)
      function d(e) {
        const { className: t, text: n } = e
        return s.createElement('span', { className: u()(c.tooltip, t) }, n)
      }
      var h = n(98475)
      const p = n(38721)
      function g(e) {
        const {
          hasErrors: t,
          onClick: l,
          errors: u,
          className: c,
          theme: g = p,
          ...f
        } = e
        return s.createElement(
          'div',
          { className: g.container, onClick: l },
          s.createElement(i.FormInput, {
            ...f,
            className: g.date,
            hasErrors: t,
            errors: [],
            endSlot:
              !t &&
              s.createElement(
                o.EndSlot,
                { icon: !0, interactive: !1 },
                s.createElement(a.Icon, { icon: h, className: g.icon }),
              ),
          }),
          t &&
            s.createElement(d, {
              text: r.t(null, void 0, n(27254)),
              className: g.tooltip,
            }),
        )
      }
    },
    23935: (e, t, n) => {
      function s(e) {
        return ('0' + e).slice(-2)
      }
      function r(e) {
        const t = new Date(e)
        return (
          t.setMilliseconds(0),
          t.setSeconds(0),
          t.setMinutes(0),
          t.setHours(0),
          t
        )
      }
      function a(e) {
        const t = new Date(e)
        return (
          t.setMilliseconds(999),
          t.setSeconds(59),
          t.setMinutes(59),
          t.setHours(23),
          t
        )
      }
      function o(e, t = !1) {
        const n = r(e),
          s = t
            ? ((e) => {
                if (e > 6) throw new Error('Invalid day is provided')
                return 0 === e ? 6 : e - 1
              })(n.getDay())
            : n.getDay()
        return n.setDate(n.getDate() - s), n
      }
      function i(e) {
        const t = r(e)
        return t.setDate(1), t
      }
      function l(e) {
        const t = i(e)
        return t.setMonth(0), t
      }
      function u(e, t) {
        return !!t && Number(r(e)) === Number(r(t))
      }
      function c(e, t) {
        return !!t && Number(i(e)) === Number(i(t))
      }
      function d(e, t) {
        return !!t && Number(l(e)) === Number(l(t))
      }
      function h(e) {
        const t = new Date(e.getFullYear(), 0, 1),
          n = (Number(e) - Number(t)) / 864e5
        return Math.ceil((n + t.getDay() + 1) / 7)
      }
      function p(e) {
        const t = new Date(e)
        return t.setDate(t.getDate() + 7), t
      }
      var g
      n.d(t, {
        addLocalTime: () => w,
        getCloneDateWithOffset: () => M,
        getDateInTabOrder: () => S,
        getDecadesStart: () => b,
        getFirstEnabledDay: () => _,
        getFirstEnabledMonth: () => E,
        getFirstEnabledYear: () => k,
        getWeeks: () => C,
        isDayDisabled: () => F,
        isInRange: () => m,
        isInvalidDateObj: () => v,
        isSameDay: () => u,
        isSameMonth: () => c,
        isSameYear: () => d,
        resetToDayEnd: () => a,
        resetToDayStart: () => r,
        resetToMonthStart: () => i,
        subtractLocalTime: () => y,
        twoDigitsFormat: () => s,
      }),
        ((e) => {
          ;(e.Day = 'day'), (e.Month = 'month'), (e.Year = 'year')
        })(g || (g = {}))
      const f = { day: r, month: i, year: l }
      function m(e, t, n, s = 'day') {
        const r = f[s],
          a = !t || Number(r(t)) - Number(r(e)) <= 0
        return (!n || Number(r(n)) - Number(r(e)) >= 0) && a
      }
      function v(e) {
        return Number.isNaN(Number(e))
      }
      function D(e) {
        return new Date(e).getTimezoneOffset() / 60
      }
      function y(e) {
        const t = new Date(e)
        return t.setHours(t.getHours() + D(t)), t
      }
      function w(e) {
        const t = new Date(e)
        return t.setHours(t.getHours() - D(t)), t
      }
      function b(e) {
        const t = (e.getFullYear() % 10) * -1,
          n = new Date(e)
        return n.setFullYear(e.getFullYear() + t), n
      }
      function C(e, t) {
        const n = []
        let s = o(i(e), !0)
        for (let r = 0; r < 6; r++) {
          const r = []
          for (let n = 0; n < 7; n++) {
            const a = new Date(s)
            a.setDate(a.getDate() + n), (c(a, e) || t) && r.push(a)
          }
          r.length && n.push({ week: h(s), days: r }), (s = new Date(p(s)))
        }
        return n
      }
      function F({ day: e, minDate: t, maxDate: n, disableWeekends: s = !1 }) {
        if (!m(e, t, n)) return !0
        const r = [6, 0].includes(e.getDay())
        return !!s && r
      }
      function _(e, t) {
        return (function n(s = 0, r = 0) {
          if (!e[s] || !e[s].days[r]) return
          const a = e[s].days,
            o = a[r]
          return t(o) ? (r + 1 < a.length ? n(s, r + 1) : n(s + 1, 0)) : o
        })()
      }
      function E(e, t) {
        return (function n(s = 0) {
          if (!e[s]) return
          const r = e[s].date
          return t(r) ? n(s + 1) : r
        })()
      }
      function k(e, t) {
        return (function n(s = 0) {
          if (!e[s]) return
          const r = e[s]
          return t(r) ? n(s + 1) : r
        })()
      }
      function M({
        dateFrom: e,
        offset: t,
        level: n = 'day',
        maxIterations: s = 6,
        isDisabledDate: r = () => !1,
      }) {
        return (function e(a, o = 0) {
          const i = new Date(a)
          switch (n) {
            case 'day':
              i.setDate(i.getDate() + t)
              break
            case 'month':
              i.setMonth(i.getMonth() + t)
              break
            case 'year':
              i.setFullYear(i.getFullYear() + t)
          }
          const l = r(i)
          return o > s || !l ? (l ? null : i) : e(i, o + 1)
        })(e)
      }
      function S({
        selectedDate: e,
        dateToFocus: t,
        currentlyFocused: n,
        firstEnabledDate: s,
        getFirstDate: r,
        getLastDate: a,
        isDisabledDate: o,
      }) {
        const i = m(e, r(), a(), 'day') && !o(e) ? e : null,
          l = t && m(t, r(), a(), 'day') && !o(t) ? t : null
        return (n && m(n, r(), a(), 'day') && !o(n) ? n : null) || i || l || s
      }
    },
    70412: (e, t, n) => {
      n.d(t, {
        hoverMouseEventFilter: () => a,
        useAccurateHover: () => o,
        useHover: () => r,
      })
      var s = n(50959)
      function r() {
        const [e, t] = (0, s.useState)(!1)
        return [
          e,
          {
            onMouseOver: (e) => {
              a(e) && t(!0)
            },
            onMouseOut: (e) => {
              a(e) && t(!1)
            },
          },
        ]
      }
      function a(e) {
        return !e.currentTarget.contains(e.relatedTarget)
      }
      function o(e) {
        const [t, n] = (0, s.useState)(!1)
        return (
          (0, s.useEffect)(() => {
            const t = (t) => {
              if (null === e.current) return
              const s = e.current.contains(t.target)
              n(s)
            }
            return (
              document.addEventListener('mouseover', t),
              () => document.removeEventListener('mouseover', t)
            )
          }, []),
          t
        )
      }
    },
    36565: (e, t, n) => {
      n.d(t, { TimeInput: () => H })
      var s = n(49483),
        r = n(50959),
        a = n(97754),
        o = n.n(a),
        i = n(50151),
        l = n(47201),
        u = n(78274),
        c = n(31261),
        d = n(9745),
        h = n(3693),
        p = n(95096)
      function g(e) {
        return r.createElement(d.Icon, { className: h.icon, icon: p })
      }
      var f = n(29202),
        m = n(70757)
      var v = n(36383),
        D = n(9859)
      const y = {
        0: { pattern: /\d/ },
        9: { pattern: /\d/, optional: !0 },
        '#': { pattern: /\d/, recursive: !0 },
        A: { pattern: /[a-zA-Z0-9]/ },
        S: { pattern: /[a-zA-Z]/ },
      }
      function w(e, t, n) {
        const s = [],
          r = n
        let a = 0,
          o = 0
        const i = e.length,
          l = r.length
        let u = -1,
          c = 0
        const d = [],
          h = i - 1,
          p = []
        let g
        while (a < i && o < l) {
          const n = e.charAt(a),
            i = r.charAt(o),
            l = y[n]
          l
            ? (i.match(l.pattern)
                ? (s.push(i),
                  l.recursive &&
                    (-1 === u ? (u = a) : a === h && a !== u && (a = u - 1),
                    h === u && (a -= 1)),
                  (a += 1))
                : i === g
                  ? (c--, (g = void 0))
                  : l.optional
                    ? ((a += 1), (o -= 1))
                    : l.fallback
                      ? (s.push(l.fallback), (a += 1), (o -= 1))
                      : p.push({ p: o, v: i, e: l.pattern }),
              (o += 1))
            : (t || s.push(n),
              i === n ? (d.push(o), (o += 1)) : ((g = n), d.push(o + c), c++),
              (a += 1))
        }
        const f = e.charAt(h)
        i !== l + 1 || y[f] || s.push(f)
        const m = s.join(''),
          v = ((e, t) => {
            const n = 0,
              s = {}
            for (let e = 0; e < t.length; e++) s[t[e] + n] = 1
            return s
          })(0, d)
        return [m, v, p]
      }
      function b(e, t, n) {
        const s = ((e) => {
            let t = !0
            for (let n = 0; n < e.length; n++) {
              const s = y[e.charAt(n)]
              if (s && s.recursive) {
                t = !1
                break
              }
            }
            return t ? e.length : void 0
          })(e),
          [a, o] = w(e, !1, t),
          [l, u] = (0, r.useState)(a),
          [c, d] = (0, r.useState)(0),
          [h, p] = (0, r.useState)(!1),
          g = (0, r.useRef)(o),
          f = (0, r.useRef)(l)
        return (
          (0, r.useEffect)(() => {
            const [n, s] = w(e, !1, t)
            u(n), m(s)
          }, [t, e]),
          (0, r.useLayoutEffect)(() => {
            const e = (0, i.ensureNotNull)(n.current)
            h && (e.setSelectionRange(c, c), p(!1)), d(C(e))
          }, [h]),
          [
            t,
            f,
            {
              onChange: () => {
                const t = (0, i.ensureNotNull)(n.current),
                  s = t.value,
                  [r, a] = w(e, !1, s)
                u(r), (f.current = r)
                const o = m(a),
                  h = ((e, t, n, s, r, a) => {
                    if (e !== t) {
                      const o = t.length,
                        i = e.length
                      let l = 0,
                        u = 0,
                        c = 0,
                        d = 0,
                        h = 0
                      for (h = s; h < o && r[h]; h++) u++
                      for (h = s - 1; h >= 0 && r[h]; h--) l++
                      for (h = s - 1; h >= 0; h--) r[h] && c++
                      for (h = n - 1; h >= 0; h--) a[h] && d++
                      if (s > i) s = 10 * o
                      else if (n >= s && n !== i) {
                        if (a[s]) {
                          const e = s
                          ;(s -= d - c), r[(s -= l)] && (s = e)
                        }
                      } else s > n && ((s += c - d), (s += u))
                    }
                    return s
                  })(l, r, c, C(t), a, o)
                d(h), p(!0)
              },
              onSelect: () => {
                const e = (0, i.ensureNotNull)(n.current)
                d(C(e))
              },
              maxLength: s,
            },
          ]
        )
        function m(e) {
          const t = g.current
          return (g.current = e), t
        }
      }
      function C(e) {
        return e.selectionStart || 0
      }
      function F(e) {
        const { value: t, mask: n, onChange: s, ...a } = e,
          o = (0, r.useRef)(null),
          [i, l, u] = b(n, t, o)
        return (
          (0, r.useLayoutEffect)(() => {
            void 0 !== e.reference && (e.reference.current = o.current)
          }, [e.reference]),
          r.createElement(c.InputControl, {
            ...a,
            maxLength: u.maxLength,
            value: i,
            autoComplete: 'off',
            reference: (e) => {
              o.current = e
            },
            onChange: () => {
              u.onChange(), s(l.current)
            },
            onSelect: u.onSelect,
          })
        )
      }
      var _ = n(68335),
        E = n(20520),
        k = n(16396),
        M = n(29981)
      const S = (() => {
        const e = []
        for (let t = 0; t < 24; ++t)
          for (let n = 0; n < 60; n += 15) {
            const [s, r] = [Y(t.toString()), Y(n.toString())],
              a = `${s}:${r}`,
              o = I(a) ? a : P(a)
            e.push(o)
          }
        return e
      })()
      function N(e) {
        let t = !1
        const n = (0, r.useRef)(null),
          s = (0, r.useRef)(null),
          a = (0, r.useRef)(null),
          l = (0, r.useRef)(null),
          [c, d] = (0, f.useFocus)(),
          [h, p] = (0, r.useState)(e.value),
          m = R(h),
          y = I(m) ? m : P(m),
          [w, b] = (0, r.useState)(y),
          C =
            c ||
            $().some((e) => null !== e && e.contains(document.activeElement))
        ;(0, r.useLayoutEffect)(() => p(e.value), [e.value]),
          (0, r.useLayoutEffect)(() => b(y), [h, C]),
          (0, r.useEffect)(() => A(w === y ? 'auto' : 'smooth'), [w])
        const N = (0, M.lowerbound)(S, y, (e, t) => e < t)
        let x = S
        S[N] !== y && ((x = [...S]), x.splice(N, 0, y))
        const Y = (0, v.useOutsideEvent)({
          mouseDown: !0,
          touchStart: !0,
          handler: (e) => {
            null !== s.current &&
              C &&
              e.target instanceof Node &&
              null !== a.current &&
              !a.current.contains(e.target) &&
              s.current.blur()
          },
        })
        return r.createElement(
          'div',
          {
            className: o()(e.className),
            onKeyDown: (e) => {
              if (e.defaultPrevented) return
              const t = (0, _.hashFromEvent)(e.nativeEvent)
              if (38 === t) {
                e.preventDefault()
                const t = (x.indexOf(w) + x.length - 1) % x.length
                b(x[t])
              }
              if (40 === t) {
                e.preventDefault()
                const t = (x.indexOf(w) + x.length + 1) % x.length
                b(x[t])
              }
            },
            onFocus: (e) => {
              L(e) || d.onFocus(e)
            },
            onBlur: (e) => {
              L(e) || d.onBlur(e)
            },
            ref: Y,
          },
          r.createElement(F, {
            role: 'combobox',
            disabled: e.disabled,
            name: e.name,
            endSlot: r.createElement(
              u.EndSlot,
              { icon: !0 },
              r.createElement(g, null),
            ),
            reference: s,
            containerReference: n,
            mask: '09:00',
            value: h,
            onFocus: (t) => {
              setTimeout(K, 0), e.onFocus?.(t)
            },
            onBlur: (e) => {
              L(e) || V(h)
            },
            onChange: (t) => {
              p(t), e.onInput && e.onInput(t)
            },
            onKeyDown: (t) => {
              if (t.defaultPrevented) return
              const n = (0, _.hashFromEvent)(t.nativeEvent)
              13 === n &&
                (t.preventDefault(),
                V(w),
                e.keepFocusOnKeyBoardNavigation ||
                  (0, i.ensureNotNull)(s.current).blur())
              27 === n &&
                (t.preventDefault(),
                e.keepFocusOnKeyBoardNavigation ||
                  (0, i.ensureNotNull)(s.current).blur())
            },
            'aria-activedescendant': T(w),
          }),
          r.createElement(
            E.PopupMenu,
            {
              role: 'listbox',
              onOpen: () => {
                A()
              },
              onClose: () => {},
              position: () => {
                const e = (0, i.ensureNotNull)(
                    n.current,
                  ).getBoundingClientRect(),
                  t = window.innerHeight - e.bottom,
                  s = e.top
                let r = 231,
                  a = e.bottom
                if (r > s && r > t) {
                  const n = (0, D.clamp)(r, 0, s),
                    o = (0, D.clamp)(r, 0, t)
                  ;(r = Math.max(n, o)), (a = n > o ? e.top - n : e.bottom)
                } else r > t && (a = e.top - r)
                return {
                  x: e.left,
                  y: a,
                  overrideWidth: e.width,
                  overrideHeight: r,
                }
              },
              closeOnClickOutside: !1,
              isOpened: C,
              tabIndex: -1,
              reference: a,
            },
            x.map((e) =>
              r.createElement(k.PopupMenuItem, {
                key: e,
                id: T(e),
                role: 'option',
                label: e,
                isActive: e === y,
                'aria-selected': e === y,
                isHovered: e === w,
                reference: e === w ? H : void 0,
                onClick: z,
                onClickArg: e,
              }),
            ),
          ),
        )
        function V(n) {
          const s = R(n),
            r = I(s) ? s : P(s)
          p(r), t || ((t = !0), e.onChange(r))
        }
        function H(e) {
          l.current = e
        }
        function z(e) {
          V((0, i.ensureDefined)(e)), (0, i.ensureNotNull)(a.current).blur()
        }
        function L(e) {
          return (
            c &&
            (null !== O(document.activeElement) || null !== O(e.relatedTarget))
          )
        }
        function O(e) {
          return (
            (e instanceof Node &&
              $().find((t) => null !== t && t.contains(e))) ||
            null
          )
        }
        function $() {
          return [a.current, s.current]
        }
        function A(e = 'auto') {
          if (null !== l.current) {
            const t = (0, i.ensureNotNull)(a.current).getBoundingClientRect(),
              n = l.current.getBoundingClientRect()
            ;(t.top > n.top || t.bottom < n.bottom) &&
              l.current.scrollIntoView({ behavior: e })
          }
        }
        function K() {
          const e = s.current
          if (null !== e) {
            const t = e.value || ''
            e.setSelectionRange(0, t.length)
          }
        }
      }
      const x = 'desktop_time_input_item'
      function T(e) {
        if (void 0 !== e) return `${x}_${e}`
      }
      function R(e) {
        const [t = '', n = ''] = e.split(':'),
          [s, r] = [Y(t), V(n)]
        return `${s}:${r}`
      }
      function I(e) {
        return /^(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/g.test(e)
      }
      function P(e) {
        const [t, n] = e.split(':'),
          [s, r] = [
            (0, D.clamp)(Number.parseInt(t), 0, 23),
            (0, D.clamp)(Number.parseInt(n), 0, 59),
          ],
          [a, o] = [Y(s.toString()), V(r.toString())]
        return `${a}:${o}`
      }
      function Y(e) {
        return e.slice(0, 2).padStart(2, '0')
      }
      function V(e) {
        return e.slice(0, 2).padEnd(2, '0')
      }
      const H = s.CheckMobile.any()
        ? (e) => {
            const { onChange: t, onFocus: n, value: s, className: a, ...d } = e,
              h = (0, r.useRef)(null),
              [p, v] = (0, f.useFocus)(),
              D = (0, l.createSafeMulticastEventHandler)(v.onBlur, () => {
                h.current && s && (h.current.defaultValue = s)
              })
            return (
              (0, r.useLayoutEffect)(() => {
                h.current && s && (h.current.defaultValue = s)
              }, []),
              (0, r.useLayoutEffect)(() => {
                h.current && s && (h.current.value = s)
              }, [s]),
              r.createElement(
                'div',
                { className: o()(m.wrap, a) },
                r.createElement(c.InputControl, {
                  ...d,
                  type: 'text',
                  endSlot: r.createElement(
                    u.EndSlot,
                    { icon: !0 },
                    r.createElement(g, null),
                  ),
                  value: s,
                  highlight: p,
                  intent: p ? 'primary' : void 0,
                  onFocus: (e) => {
                    ;(0, i.ensureNotNull)(h.current).focus(), n && n(e)
                  },
                  onChange: () => {},
                }),
                r.createElement('input', {
                  ...v,
                  disabled: e.disabled,
                  className: m.input,
                  type: 'time',
                  onBlur: D,
                  onChange: (e) => {
                    const { value: n } = e.currentTarget
                    t && n && t(n)
                  },
                  ref: h,
                }),
              )
            )
          }
        : N
    },
    17140: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="m16.47 7.47 1.06 1.06L12.06 14l5.47 5.47-1.06 1.06L9.94 14l6.53-6.53Z"/></svg>'
    },
    98475: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M10 4h1v2h6V4h1v2h2.5A2.5 2.5 0 0 1 23 8.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 5 19.5v-11A2.5 2.5 0 0 1 7.5 6H10V4zm8 3H7.5C6.67 7 6 7.67 6 8.5v11c0 .83.67 1.5 1.5 1.5h13c.83 0 1.5-.67 1.5-1.5v-11c0-.83-.67-1.5-1.5-1.5H18zm-3 2h-2v2h2V9zm-7 4h2v2H8v-2zm12-4h-2v2h2V9zm-7 4h2v2h-2v-2zm-3 4H8v2h2v-2zm3 0h2v2h-2v-2zm7-4h-2v2h2v-2z"/></svg>'
    },
    1401: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M4 0c-.6 0-1 .4-1 1v1H1c-.6 0-1 .4-1 1v12c0 .6.4 1 1 1h14c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1h-2V1c0-.6-.4-1-1-1h-1c-.6 0-1 .4-1 1v1H6V1c0-.6-.4-1-1-1H4zM2 5h12v9H2V5zm5 2v2h2V7H7zm3 0v2h2V7h-2zm-6 3v2h2v-2H4zm3 0v2h2v-2H7zm3 0v2h2v-2h-2z"/></svg>'
    },
    95096: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" width="17" height="17"><path fill="currentColor" d="M1 8.5a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0zM8.5 0a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM9 9V3H8v5H5v1h4z"/></svg>'
    },
    82665: (e, t, n) => {
      n.d(t, { default: () => l })
      var s = n(38459),
        r = n(61833),
        a = n(56882),
        o = Math.ceil,
        i = Math.max
      const l = (e, t, n) => {
        t = (n ? (0, r.default)(e, t, n) : void 0 === t)
          ? 1
          : i((0, a.default)(t), 0)
        var l = null == e ? 0 : e.length
        if (!l || t < 1) return []
        for (var u = 0, c = 0, d = Array(o(l / t)); u < l; )
          d[c++] = (0, s.default)(e, u, (u += t))
        return d
      }
    },
  },
])
