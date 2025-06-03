;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [4713],
  {
    37287: (e) => {
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
        'accent-color': 'accent-color-N6r5jhbE',
        'current-day': 'current-day-N6r5jhbE',
        'slot-wrapper': 'slot-wrapper-N6r5jhbE',
        'hide-focus-ring': 'hide-focus-ring-N6r5jhbE',
        'decade-button': 'decade-button-N6r5jhbE',
        'visually-hidden': 'visually-hidden-N6r5jhbE',
      }
    },
    53209: (e) => {
      e.exports = {
        container: 'container-PNiXwSz6',
        icon: 'icon-PNiXwSz6',
        tooltip: 'tooltip-PNiXwSz6',
        date: 'date-PNiXwSz6',
        time: 'time-PNiXwSz6',
      }
    },
    20111: (e) => {
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
    30247: (e) => {
      e.exports = { tooltip: 'tooltip-RU08GcsY' }
    },
    44022: (e) => {
      e.exports = {
        errors: 'errors-bghR31WL',
        show: 'show-bghR31WL',
        error: 'error-bghR31WL',
        'visually-hidden': 'visually-hidden-bghR31WL',
      }
    },
    40461: (e) => {
      e.exports = {
        'error-icon': 'error-icon-UhKAouIg',
        'intent-danger': 'intent-danger-UhKAouIg',
        'intent-warning': 'intent-warning-UhKAouIg',
      }
    },
    78634: (e) => {
      e.exports = { wrap: 'wrap-NsE0FV0Z', input: 'input-NsE0FV0Z' }
    },
    43832: (e) => {
      e.exports = { icon: 'icon-Rubz29lH' }
    },
    27345: (e) => {
      e.exports = {
        'static-messages': 'static-messages-cF4vS9J8',
        errors: 'errors-cF4vS9J8',
        warnings: 'warnings-cF4vS9J8',
        'success-mesages': 'success-mesages-cF4vS9J8',
        'input-description': 'input-description-cF4vS9J8',
        message: 'message-cF4vS9J8',
      }
    },
    71986: (e) => {
      e.exports = {
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
        item: 'item-jFqVJoPk',
        hovered: 'hovered-jFqVJoPk',
        isDisabled: 'isDisabled-jFqVJoPk',
        isActive: 'isActive-jFqVJoPk',
        shortcut: 'shortcut-jFqVJoPk',
        toolbox: 'toolbox-jFqVJoPk',
        withIcon: 'withIcon-jFqVJoPk',
        'round-icon': 'round-icon-jFqVJoPk',
        icon: 'icon-jFqVJoPk',
        labelRow: 'labelRow-jFqVJoPk',
        label: 'label-jFqVJoPk',
        showOnHover: 'showOnHover-jFqVJoPk',
        'disclosure-item-circle-logo': 'disclosure-item-circle-logo-jFqVJoPk',
        showOnFocus: 'showOnFocus-jFqVJoPk',
      }
    },
    78869: (e, t, n) => {
      n.d(t, { useRefsMap: () => r })
      var s = n(50959)
      function r() {
        const e = (0, s.useRef)(new Map()),
          t = (0, s.useCallback)(
            (t) => (n) => {
              null !== n ? e.current.set(t, n) : e.current.delete(t)
            },
            [e],
          )
        return [e, t]
      }
    },
    47201: (e, t, n) => {
      function s(...e) {
        return (t) => {
          for (const n of e) void 0 !== n && n(t)
        }
      }
      n.d(t, { createSafeMulticastEventHandler: () => s })
    },
    27365: (e, t, n) => {
      n.d(t, { getChartTimezoneOffsetMs: () => o, getTimezoneName: () => a })
      var s = n(41249),
        r = n.n(s)
      function a(e) {
        const t = e.model().timezone()
        if ('exchange' !== t) return t
        const n = e.model().mainSeries().symbolInfo()
        return null == n ? void 0 : n.timezone
      }
      function o(e, t) {
        if (void 0 === t) return 0
        return r().get_timezone(t).offset_utc(e)
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
    1405: (e, t, n) => {
      n.d(t, { anchors: () => s })
      n(50959)
      const s = {
        bottom: {
          attachment: { horizontal: 'left', vertical: 'top' },
          targetAttachment: { horizontal: 'left', vertical: 'bottom' },
        },
        top: {
          attachment: { horizontal: 'left', vertical: 'bottom' },
          targetAttachment: { horizontal: 'left', vertical: 'top' },
        },
        topRight: {
          attachment: { horizontal: 'right', vertical: 'bottom' },
          targetAttachment: { horizontal: 'right', vertical: 'top' },
        },
        bottomRight: {
          attachment: { horizontal: 'right', vertical: 'top' },
          targetAttachment: { horizontal: 'right', vertical: 'bottom' },
        },
      }
    },
    15499: (e, t, n) => {
      n.d(t, {
        CalendarViewType: () => w,
        DECADES_YEARS_AMOUNT: () => y,
        MONTHS: () => o,
        MONTHS_SHORT: () => i,
        SUB_HEADER_DECADES: () => D,
        SUB_HEADER_YEAR: () => b,
        WEEKDAYS_MIN: () => r,
        getCurrentAriaLabel: () => F,
        getCurrentVisibleTitle: () => M,
        getDayAriaLabel: () => C,
        getNextAriaLabel: () => _,
        getNextLiveRegionConfirmation: () => k,
        getNextMonth: () => R,
        getPrevAriaLabel: () => E,
        getPrevLiveRegionConfirmation: () => S,
        getViewTypeLiveRegionConfirmation: () => N,
      })
      var s = n(11542)
      const r = [
          s.t(null, { context: 'day_of_week' }, n(11268)),
          s.t(null, { context: 'day_of_week' }, n(31533)),
          s.t(null, { context: 'day_of_week' }, n(26230)),
          s.t(null, { context: 'day_of_week' }, n(24793)),
          s.t(null, { context: 'day_of_week' }, n(19801)),
          s.t(null, { context: 'day_of_week' }, n(63331)),
          s.t(null, { context: 'day_of_week' }, n(85954)),
        ],
        a = [
          s.t(null, void 0, n(72149)),
          s.t(null, void 0, n(61199)),
          s.t(null, void 0, n(44979)),
          s.t(null, void 0, n(7147)),
          s.t(null, void 0, n(7951)),
          s.t(null, void 0, n(72970)),
          s.t(null, void 0, n(1144)),
        ],
        o = [
          s.t(null, void 0, n(26910)),
          s.t(null, void 0, n(16467)),
          s.t(null, void 0, n(84675)),
          s.t(null, void 0, n(97637)),
          s.t(null, void 0, n(68327)),
          s.t(null, void 0, n(49385)),
          s.t(null, void 0, n(23230)),
          s.t(null, void 0, n(86797)),
          s.t(null, void 0, n(61132)),
          s.t(null, void 0, n(90784)),
          s.t(null, void 0, n(71194)),
          s.t(null, void 0, n(55669)),
        ],
        i = [
          s.t(null, void 0, n(95425)),
          s.t(null, void 0, n(35050)),
          s.t(null, void 0, n(51369)),
          s.t(null, void 0, n(42762)),
          s.t(null, void 0, n(68327)),
          s.t(null, void 0, n(15224)),
          s.t(null, void 0, n(6215)),
          s.t(null, void 0, n(38465)),
          s.t(null, void 0, n(57902)),
          s.t(null, void 0, n(73546)),
          s.t(null, void 0, n(71230)),
          s.t(null, void 0, n(92203)),
        ],
        l = s.t(null, void 0, n(2587)),
        c = s.t(null, void 0, n(39752)),
        u = s.t(null, void 0, n(39329)),
        h = s.t(null, void 0, n(83771)),
        d = s.t(null, void 0, n(27004)),
        p = s.t(null, void 0, n(75385)),
        m = s.t(null, void 0, n(83583)),
        g = s.t(null, void 0, n(80879)),
        f = s.t(null, void 0, n(6244)),
        v = {
          setMonth: s.t(null, void 0, n(92702)),
          setYear: s.t(null, void 0, n(52051)),
          setDecades: s.t(null, void 0, n(99990)),
        }
      var w
      !((e) => {
        ;(e.Month = 'month'), (e.Year = 'year'), (e.Decades = 'decades')
      })(w || (w = {}))
      const D = s.t(null, void 0, n(69325)),
        b = s.t(null, void 0, n(95543)),
        y = 20
      function C(e) {
        return `${a[e.getDay()]} ${e.getDate()} ${o[e.getMonth()]} ${e.getFullYear()}`
      }
      function E(e, t) {
        switch (e) {
          case w.Month: {
            const e = new Date(t)
            return (
              e.setMonth(e.getMonth() - 1),
              `${l}, ${o[e.getMonth()]} ${e.getFullYear()}`
            )
          }
          case w.Year:
            return `${u}, ${t.getFullYear() - 1}`
          case w.Decades:
            return `${d}, ${t.getFullYear() - y} - ${t.getFullYear() - 1}`
        }
      }
      function _(e, t) {
        switch (e) {
          case w.Month: {
            const e = new Date(t)
            return (
              e.setMonth(e.getMonth() + 1),
              `${c}, ${o[e.getMonth()]} ${e.getFullYear()}`
            )
          }
          case w.Year:
            return `${h}, ${t.getFullYear() + 1}`
          case w.Decades:
            return `${p}, ${t.getFullYear() + y} - ${t.getFullYear() + 2 * y - 1}`
        }
      }
      function F(e, t) {
        switch (e) {
          case w.Month:
            return `${m}, ${t.getFullYear()}`
          case w.Year:
            return `${g}, ${t.getFullYear()} - ${t.getFullYear() + y - 1}`
          case w.Decades:
            return `${f}, ${o[t.getMonth()]} ${t.getFullYear()}`
        }
      }
      function M(e, t) {
        switch (e) {
          case w.Month:
            return `${o[t.getMonth()]} ${t.getFullYear()}`
          case w.Year:
            return `${t.getFullYear()}`
          case w.Decades:
            return `${t.getFullYear()} - ${t.getFullYear() + y - 1}`
        }
      }
      function S(e, t) {
        switch (e) {
          case w.Month: {
            const e = new Date(t)
            return (
              e.setMonth(e.getMonth() - 1),
              v.setMonth.format({ month: o[e.getMonth()] })
            )
          }
          case w.Year:
            return v.setYear.format({ year: '' + (t.getFullYear() - 1) })
          case w.Decades:
            return v.setDecades.format({
              year_start: '' + (t.getFullYear() - y),
              year_end: '' + (t.getFullYear() - 1),
            })
        }
      }
      function k(e, t) {
        switch (e) {
          case w.Month: {
            const e = R(t)
            return v.setMonth.format({ month: o[e.getMonth()] })
          }
          case w.Year:
            return v.setYear.format({ year: `${t.getFullYear() + 1}` })
          case w.Decades:
            return v.setDecades.format({
              year_start: `${t.getFullYear() + y}`,
              year_end: '' + (t.getFullYear() + 2 * y - 1),
            })
        }
      }
      function N(e, t) {
        switch (e) {
          case w.Month:
            return v.setYear.format({ year: `${t.getFullYear()}` })
          case w.Year:
            return v.setDecades.format({
              year_start: `${t.getFullYear()}`,
              year_end: '' + (t.getFullYear() + y - 1),
            })
          case w.Decades:
            return v.setMonth.format({ month: o[t.getMonth()] })
        }
      }
      function R(e) {
        return 11 === e.getMonth()
          ? new Date(e.getFullYear() + 1, 0, 1)
          : new Date(e.getFullYear(), e.getMonth() + 1, 1)
      }
    },
    28746: (e, t, n) => {
      n.d(t, { Calendar: () => E })
      var s = n(50959),
        r = n(97754),
        a = n(14543),
        o = n(17140),
        i = n(37287)
      function l(e) {
        const {
          prevAriaLabel: t,
          nextAriaLabel: n,
          currentAriaLabel: r,
          currentVisibleTitle: l,
          isNextDisabled: c,
          isPrevDisabled: u,
          isViewModeDisabled: h,
          prevRef: d,
          middleRef: p,
          onPrevClick: m,
          onNextClick: g,
          onCurrentClick: f,
          onPrevKeyDown: v,
          onMiddleKeyDown: w,
          onHeaderKeyDown: D,
        } = e
        return s.createElement(
          'div',
          { className: i.header, onKeyDown: D },
          s.createElement(a.LightButton, {
            startIcon: o,
            onClick: m,
            size: 'small',
            variant: 'ghost',
            'aria-label': t,
            disabled: u,
            onKeyDown: v,
            reference: d,
          }),
          s.createElement(
            a.LightButton,
            {
              size: 'small',
              variant: 'ghost',
              'aria-label': r,
              onClick: f,
              disabled: h,
              onKeyDown: w,
              reference: p,
            },
            l,
          ),
          s.createElement(a.LightButton, {
            startIcon: o,
            onClick: g,
            size: 'small',
            variant: 'ghost',
            'aria-label': n,
            disabled: c,
            className: i['flip-horizontal'],
          }),
        )
      }
      var c = n(23935),
        u = n(15499),
        h = n(53741)
      class d extends s.PureComponent {
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
            })
        }
        render() {
          const e = r(
              i.day,
              this.props.isDisabled && i.disabled,
              !this.props.isDisabled &&
                (this.props.isSelected || this._isOnHighlightedEdge()) &&
                i['accent-color'],
              this._withinSelectedRange() && i['within-selected-range'],
              this._isCurrentDay() && i['current-day'],
              !this.props.showFocusRing && i['hide-focus-ring'],
            ),
            t =
              this.props.isSelected ||
              this._isOnHighlightedEdge() ||
              this._withinSelectedRange(),
            n = t || this._isCurrentDay()
          return s.createElement(
            a.LightButton,
            {
              onClick: this._onClick,
              onFocus: this.props.onFocus,
              size: 'small',
              variant: this._getVariant(),
              isSelected: n,
              'data-day': this._dateFormatter.formatLocal(this.props.day),
              className: e,
              disabled: this.props.isDisabled,
              reference: this.props.reference,
              tabIndex: this.props.tabIndex,
              'aria-label': (0, u.getDayAriaLabel)(this.props.day),
              'aria-selected': t,
              'aria-current': this._isCurrentDay() ? 'date' : void 0,
            },
            this.props.day.getDate(),
          )
        }
        _isOnHighlightedEdge() {
          const { day: e, highlightedFrom: t, highlightedTo: n } = this.props
          return (
            !(!t || !n) && ((0, c.isSameDay)(e, t) || (0, c.isSameDay)(e, n))
          )
        }
        _withinSelectedRange() {
          const { day: e, highlightedFrom: t, highlightedTo: n } = this.props
          return !(!t || !n) && this._isBetweenByDay(t, e, n)
        }
        _isCurrentDay() {
          return (0, c.isSameDay)(new Date(), this.props.day)
        }
        _isBetweenByDay(e, t, n) {
          const s = (0, c.resetToDayStart)(e),
            r = (0, c.resetToDayStart)(t),
            a = (0, c.resetToDayStart)(n)
          return s < r && r < a
        }
      }
      var p = n(78869),
        m = n(68335)
      function g({
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
        const [h, d] = (0, p.useRefsMap)(),
          g = (0, s.useCallback)((t) => (t ? (e(t) ? null : t) : null), [e]),
          f = (0, s.useCallback)(
            (n, s) => {
              if (!n) return null
              const r = (0, c.getCloneDateWithOffset)({
                dateFrom: n,
                offset: s,
                isDisabledDate: e,
                level: u,
              })
              return g(t(r))
            },
            [t, g],
          ),
          v = (0, s.useCallback)(() => {
            const e = n()
            return g(e) || f(e, 1)
          }, [g, f]),
          w = (0, s.useCallback)(() => {
            const e = r()
            return g(e) || f(e, -1)
          }, [g, f]),
          D = (0, s.useCallback)(
            (t, n) => {
              if (!t) return
              const s = (0, c.getCloneDateWithOffset)({
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
            currentlyFocused: b,
            setCurrentlyFocused: y,
            focusItem: C,
            bindings: E,
          } = (({
            refsMap: e,
            verticalOffset: t,
            getNextKeyToFocus: n,
            getFirstKey: r,
            getLastKey: a,
            onGridEnd: o,
          }) => {
            const [i, l] = (0, s.useState)(null),
              c = (0, s.useCallback)(
                (t) => {
                  if (!t) return
                  const n = e.current.get(t)
                  n && (n.focus(), l(t))
                },
                [e],
              ),
              u = (0, s.useCallback)(
                (e) => {
                  const t = n(i, e)
                  t ? c(t) : o(i, e)
                },
                [i, n],
              ),
              h = (0, s.useCallback)(
                (e) => {
                  const n = (0, m.hashFromEvent)(e)
                  if (
                    (40 === n && (e.preventDefault(), u(t)),
                    38 === n && (e.preventDefault(), u(-1 * t)),
                    39 === n && (e.preventDefault(), u(1)),
                    37 === n && (e.preventDefault(), u(-1)),
                    36 === n)
                  ) {
                    e.preventDefault()
                    const t = r()
                    c(t)
                  }
                  if (35 === n) {
                    e.preventDefault()
                    const t = a()
                    c(t)
                  }
                },
                [i, n],
              )
            return {
              currentlyFocused: i,
              setCurrentlyFocused: l,
              focusItem: c,
              bindings: { onKeyDown: h },
            }
          })({
            refsMap: h,
            verticalOffset: l,
            getNextKeyToFocus: f,
            getFirstKey: v,
            getLastKey: w,
            onGridEnd: D,
          })
        return (
          (0, s.useEffect)(() => C(g(t(i))), [i]),
          {
            itemsRefs: h,
            setItemRef: d,
            ensureNotDisabledDate: g,
            currentlyFocused: b,
            setCurrentlyFocused: y,
            focusItem: C,
            bindings: E,
          }
        )
      }
      function f(e) {
        const {
            selectedDate: t,
            dateToFocus: n,
            weeks: r,
            onClickDay: a,
            setPrevMonth: o,
            setNextMonth: l,
            maxDate: h,
            minDate: p,
            disableWeekends: m,
            showFocusRing: f,
            highlightedFrom: v,
            highlightedTo: w,
            isDisabled: D,
            focusableDateRef: b,
          } = e,
          y = (0, s.useCallback)(
            (e) => {
              if (!e) return null
              let t = null
              return (
                r.find(
                  ({ days: n }) => (
                    (t = n.find((t) => (0, c.isSameDay)(t, e))), t
                  ),
                ),
                t
              )
            },
            [r],
          ),
          C = (0, s.useCallback)(() => r[0].days[0], [r]),
          E = (0, s.useCallback)(() => {
            const e = r[r.length - 1].days
            return e[e.length - 1]
          }, [r]),
          _ = (0, s.useCallback)(
            (e) =>
              D ||
              (0, c.isDayDisabled)({
                day: e,
                minDate: p,
                maxDate: h,
                disableWeekends: m,
              }),
            [p, h, m, D],
          ),
          {
            itemsRefs: F,
            setItemRef: M,
            currentlyFocused: S,
            setCurrentlyFocused: k,
            bindings: N,
          } = g({
            isDisabledDate: _,
            findDate: y,
            getFirstDate: C,
            getLastDate: E,
            setPrev: o,
            setNext: l,
            dateToFocus: n,
            verticalOffset: 7,
            dateLevel: 'day',
          }),
          R = (0, c.getDateInTabOrder)({
            selectedDate: t,
            dateToFocus: n,
            currentlyFocused: S,
            firstEnabledDate: (0, c.getFirstEnabledDay)(r, _),
            getFirstDate: C,
            getLastDate: E,
            isDisabledDate: _,
          })
        return (
          (0, s.useEffect)(() => {
            b.current = (R && F.current.get(R)) || null
          }, [R, b]),
          s.createElement(
            s.Fragment,
            null,
            s.createElement(
              'div',
              { className: i['sub-header'], 'aria-hidden': !0 },
              u.WEEKDAYS_MIN.map((e) => s.createElement('span', { key: e }, e)),
            ),
            s.createElement(
              'div',
              { className: i['view-month'], tabIndex: -1, ...N },
              s.createElement(
                'div',
                { className: i.weeks },
                r.map(({ week: e, days: n }) =>
                  s.createElement(
                    'div',
                    { className: i.week, key: e },
                    n.map((e) =>
                      s.createElement(d, {
                        key: e.toDateString(),
                        day: e,
                        isDisabled: _(e),
                        isSelected: (0, c.isSameDay)(e, t),
                        onClick: a,
                        highlightedFrom: v,
                        highlightedTo: w,
                        reference: M(e),
                        tabIndex: (0, c.isSameDay)(e, R) ? 0 : -1,
                        onFocus: (0, c.isSameDay)(e, R) ? () => k(e) : void 0,
                        showFocusRing: f,
                      }),
                    ),
                  ),
                ),
              ),
            ),
          )
        )
      }
      function v(e) {
        const {
            months: t,
            selectedDate: n,
            maxDate: r,
            minDate: o,
            showFocusRing: l,
            dateToFocus: h,
            isDisabled: d,
            focusableDateRef: p,
            onSelect: m,
            setPrevYear: f,
            setNextYear: v,
          } = e,
          w = (0, s.useCallback)(
            (e) => d || !(0, c.isInRange)(e, o, r, 'month'),
            [o, r, d],
          ),
          D = (0, s.useCallback)(
            (e) => {
              if (!e) return null
              let n = null
              return (
                t.find(
                  ({ date: t }) => (
                    (n = (0, c.isSameMonth)(e, t) ? t : null), n
                  ),
                ),
                n
              )
            },
            [t],
          ),
          b = (0, s.useCallback)(() => t[0].date, [t]),
          y = (0, s.useCallback)(() => t[t.length - 1].date, [t]),
          {
            itemsRefs: C,
            setItemRef: E,
            currentlyFocused: _,
            setCurrentlyFocused: F,
            bindings: M,
          } = g({
            isDisabledDate: w,
            findDate: D,
            getFirstDate: b,
            getLastDate: y,
            setPrev: f,
            setNext: v,
            verticalOffset: 3,
            dateToFocus: h,
            dateLevel: 'month',
          }),
          S = (0, c.getDateInTabOrder)({
            selectedDate: n,
            dateToFocus: h,
            currentlyFocused: _,
            firstEnabledDate: (0, c.getFirstEnabledMonth)(t, w),
            getFirstDate: b,
            getLastDate: y,
            isDisabledDate: w,
          })
        return (
          (0, s.useEffect)(() => {
            p.current = (S && C.current.get(S)) || null
          }, [S, p]),
          s.createElement(
            s.Fragment,
            null,
            s.createElement(
              'div',
              { className: i['sub-header'], 'aria-hidden': !0 },
              s.createElement('span', null, u.SUB_HEADER_YEAR),
            ),
            s.createElement(
              'div',
              { className: i['view-year'], ...M },
              t.map(({ title: e, ariaLabel: t, date: r }) => {
                const o = (0, c.isSameMonth)(r, n),
                  u = w(r),
                  h = o ? 'quiet-primary' : 'ghost'
                return s.createElement(
                  a.LightButton,
                  {
                    key: r.toDateString(),
                    size: 'small',
                    variant: h,
                    disabled: u,
                    isSelected: o,
                    className: !l && i['hide-focus-ring'],
                    onClick: () => m(r),
                    reference: E(r),
                    tabIndex: (0, c.isSameMonth)(r, S) ? 0 : -1,
                    onFocus: (0, c.isSameMonth)(r, S) ? () => F(r) : void 0,
                    'aria-label': `${t} ${r.getFullYear()}`,
                    'aria-selected': o,
                  },
                  e,
                )
              }),
            ),
          )
        )
      }
      function w(e) {
        const {
            years: t,
            selectedDate: n,
            dateToFocus: o,
            maxDate: l,
            minDate: h,
            showFocusRing: d,
            isDisabled: p,
            focusableDateRef: m,
            onSelect: f,
            setPrevDecades: v,
            setNextDecades: w,
          } = e,
          D = (0, s.useCallback)(
            (e) => p || !(0, c.isInRange)(e, h, l, 'year'),
            [h, l, p],
          ),
          b = (0, s.useCallback)(
            (e) => (e && t.find((t) => (0, c.isSameYear)(e, t))) || null,
            [t],
          ),
          y = (0, s.useCallback)(() => t[0], [t]),
          C = (0, s.useCallback)(() => t[t.length - 1], [t]),
          {
            itemsRefs: E,
            setItemRef: _,
            currentlyFocused: F,
            setCurrentlyFocused: M,
            bindings: S,
          } = g({
            isDisabledDate: D,
            findDate: b,
            getFirstDate: y,
            getLastDate: C,
            setPrev: v,
            setNext: w,
            dateToFocus: o,
            verticalOffset: 4,
            dateLevel: 'year',
          }),
          k = (0, c.getDateInTabOrder)({
            selectedDate: n,
            dateToFocus: o,
            currentlyFocused: F,
            firstEnabledDate: (0, c.getFirstEnabledYear)(t, D),
            getFirstDate: y,
            getLastDate: C,
            isDisabledDate: D,
          })
        return (
          (0, s.useEffect)(() => {
            m.current = (k && E.current.get(k)) || null
          }, [k, m]),
          s.createElement(
            s.Fragment,
            null,
            s.createElement(
              'div',
              { className: i['sub-header'], 'aria-hidden': !0 },
              s.createElement('span', null, u.SUB_HEADER_DECADES),
            ),
            s.createElement(
              'div',
              { className: i['view-decades'], ...S },
              t.map((e) => {
                const t = e.getFullYear(),
                  o = (0, c.isSameYear)(e, n),
                  l = D(e),
                  u = o ? 'quiet-primary' : 'ghost'
                return s.createElement(
                  a.LightButton,
                  {
                    key: e.toDateString(),
                    size: 'small',
                    variant: u,
                    disabled: l,
                    isSelected: o,
                    className: r(
                      i['decade-button'],
                      !d && i['hide-focus-ring'],
                    ),
                    onClick: () => f(e),
                    reference: _(e),
                    tabIndex: (0, c.isSameYear)(e, k) ? 0 : -1,
                    onFocus: (0, c.isSameYear)(e, k) ? () => M(e) : void 0,
                    'aria-selected': o,
                  },
                  t,
                )
              }),
            ),
          )
        )
      }
      class D {
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
          var e
          ;(this._messagesQueue = []),
            clearTimeout(
              null === (e = this._renderedMessage) || void 0 === e
                ? void 0
                : e.destroyTimer,
            ),
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
          var t
          return (null === (t = this._renderedMessage) || void 0 === t
            ? void 0
            : t.id) === e
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
          var e
          const t =
            null === (e = this._renderedMessage) || void 0 === e
              ? void 0
              : e.renderedTo
          t && (t.innerText = ''), (this._renderedMessage = null)
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
              var n
              if (
                (null === (n = this._renderedMessage) || void 0 === n
                  ? void 0
                  : n.id) === t.id
              )
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
      class b extends D {}
      const y = new (class {
        constructor() {
          ;(this.isInited = !1),
            (this._politeQueue = new b('polite')),
            (this._assertiveQueue = new b('assertive'))
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
      function C({
        viewType: e,
        decadesStartYear: t,
        viewDate: n,
        setPrev: r,
        setNext: a,
        switchViewType: o,
      }) {
        const [i, l] = (0, s.useState)(null),
          c = (0, s.useCallback)(
            (e) => {
              i && i.destroy(), l(y.sayPolitely(e))
            },
            [i, l],
          )
        return {
          onPrevClick: (0, s.useCallback)(() => {
            c(
              (0, u.getPrevLiveRegionConfirmation)(
                e,
                e === u.CalendarViewType.Decades ? t : n,
              ),
            ),
              r(null)
          }, [r, c]),
          onNextClick: (0, s.useCallback)(() => {
            c(
              (0, u.getNextLiveRegionConfirmation)(
                e,
                e === u.CalendarViewType.Decades ? t : n,
              ),
            ),
              a(null)
          }, [a, c]),
          onSwitchViewType: (0, s.useCallback)(
            (s) => {
              c(
                (0, u.getViewTypeLiveRegionConfirmation)(
                  e,
                  e === u.CalendarViewType.Year ? t : n,
                ),
              ),
                o(s)
            },
            [o, c],
          ),
        }
      }
      function E(e) {
        const {
            selectedDate: t,
            maxDate: n,
            minDate: a,
            className: o,
            disableWeekends: h,
            highlightedFrom: d,
            highlightedTo: p,
            popupStyle: g = !0,
            showFocusRing: D = !1,
            autoFocus: b = !1,
            isDisabled: y = !1,
            withFocusTrap: E = !1,
            endSlot: _,
            onSelect: F,
            onMonthSwitch: M,
            onYearSwitch: S,
            onDecadesSwitch: k,
            onViewTypeChange: N,
            focusTriggerElement: R,
          } = e,
          [x, T] = (0, s.useState)(D),
          I = (0, s.useCallback)(() => T(!0), [T])
        ;(0, s.useEffect)(() => {
          D && T(!0)
        }, [D])
        const P = (0, s.useCallback)(
            (e) => {
              R &&
                38 === (0, m.hashFromEvent)(e) &&
                (e.preventDefault(), e.stopPropagation(), T(!1), R())
            },
            [R],
          ),
          {
            viewDate: A,
            viewType: Y,
            dateToFocus: O,
            weeks: V,
            months: z,
            years: L,
            isNextDisabled: H,
            isPrevDisabled: B,
            setPrev: $,
            setNext: K,
            switchViewType: W,
            onClickDay: j,
            onClickMonth: J,
            onClickYear: q,
          } = (({
            selectedDate: e,
            autoFocus: t,
            showFocusRing: n,
            minDate: r,
            maxDate: a,
            onSelect: o,
            onMonthSwitch: i,
            onYearSwitch: l,
            onDecadesSwitch: h,
            onViewTypeChange: d,
          }) => {
            const [p, m] = (0, s.useState)(e),
              [g, f] = (0, s.useState)(u.CalendarViewType.Month),
              [v, w] = (0, s.useState)(t ? e : null),
              D = (0, s.useMemo)(() => (0, c.getDecadesStart)(p), [p]),
              b = (0, s.useCallback)(
                (e) => {
                  const t = new Date(p),
                    n = (0, u.getNextMonth)(p),
                    s = new Date(
                      n.getFullYear(),
                      n.getMonth() + e,
                      0,
                    ).getDate(),
                    r = p.getDate() > s ? s : p.getDate()
                  t.setMonth(t.getMonth() + e, r), m(t), i && i(t)
                },
                [p, i],
              ),
              y = (0, s.useCallback)(
                (e) => {
                  const t = new Date(p)
                  t.setFullYear(t.getFullYear() + e), m(t), l && l(t)
                },
                [p, l],
              ),
              C = (0, s.useCallback)(
                (e) => {
                  const t = new Date(D)
                  t.setFullYear(t.getFullYear() + e), m(t), h && h(t)
                },
                [D, p, h],
              ),
              E = (0, s.useCallback)(
                (e, t) => {
                  switch ((t && w(t), g)) {
                    case u.CalendarViewType.Month:
                      return b(1 * e)
                    case u.CalendarViewType.Year:
                      return y(1 * e)
                    case u.CalendarViewType.Decades:
                      return C(e * u.DECADES_YEARS_AMOUNT)
                  }
                },
                [g, b, y, C],
              ),
              _ = (0, s.useCallback)((e) => E(-1, e), [E]),
              F = (0, s.useCallback)((e) => E(1, e), [E]),
              M = (0, s.useCallback)(() => {
                const e = Object.values(u.CalendarViewType)
                let t = e.indexOf(g) + 1
                t >= e.length && (t = 0), f(e[t]), d && d(e[t])
              }, [g]),
              S = (0, s.useCallback)(
                (e) => {
                  m(new Date(e)), o && o(new Date(e))
                },
                [o],
              ),
              k = (0, s.useCallback)(
                (e) => {
                  const t = new Date(p)
                  t.setMonth(e.getMonth()),
                    (0, c.isSameMonth)(t, e) || t.setMonth(e.getMonth(), 1),
                    m(t)
                  const n = new Date(v || p)
                  n.setMonth(e.getMonth()),
                    (0, c.isSameMonth)(n, e) || n.setMonth(e.getMonth(), 1),
                    w(n),
                    f(u.CalendarViewType.Month)
                },
                [p, o, M],
              ),
              N = (0, s.useCallback)(
                (e) => {
                  const t = new Date(p)
                  t.setFullYear(e.getFullYear()), m(t)
                  const n = new Date(v || p)
                  n.setFullYear(e.getFullYear()),
                    w(n),
                    f(u.CalendarViewType.Year)
                },
                [p, o, M],
              ),
              R = (0, s.useMemo)(() => (0, c.getWeeks)(p), [p]),
              x = (0, s.useMemo)(() => (0, c.getMonths)(p), [p]),
              T = (0, s.useMemo)(() => (0, c.getDecades)(D), [D]),
              I = (0, s.useMemo)(() => {
                switch (g) {
                  case u.CalendarViewType.Month: {
                    const e = R[R.length - 1].days,
                      t = new Date(e[e.length - 1])
                    return (
                      t.setDate(t.getDate() + 1), !(0, c.isInRange)(t, r, a)
                    )
                  }
                  case u.CalendarViewType.Year: {
                    const e = new Date(x[x.length - 1].date)
                    return (
                      e.setMonth(e.getMonth() + 1),
                      !(0, c.isInRange)(e, r, a, 'month')
                    )
                  }
                  case u.CalendarViewType.Decades: {
                    const e = new Date(T[T.length - 1])
                    return (
                      e.setFullYear(e.getFullYear() + 1),
                      !(0, c.isInRange)(e, r, a, 'year')
                    )
                  }
                }
              }, [g, r, a, R, x, T]),
              P = (0, s.useMemo)(() => {
                switch (g) {
                  case u.CalendarViewType.Month: {
                    const e = new Date(R[0].days[0])
                    return (
                      e.setDate(e.getDate() - 1), !(0, c.isInRange)(e, r, a)
                    )
                  }
                  case u.CalendarViewType.Year: {
                    const e = new Date(x[0].date)
                    return (
                      e.setMonth(e.getMonth() - 1),
                      !(0, c.isInRange)(e, r, a, 'month')
                    )
                  }
                  case u.CalendarViewType.Decades: {
                    const e = new Date(T[0])
                    return (
                      e.setFullYear(e.getFullYear() - 1),
                      !(0, c.isInRange)(e, r, a, 'year')
                    )
                  }
                }
              }, [g, r, a, R, x, T])
            return (
              (0, s.useEffect)(() => {
                !v && n && t && w(e), n || w(null)
              }, [t, e, v, n]),
              {
                viewDate: p,
                viewType: g,
                dateToFocus: v,
                weeks: R,
                months: x,
                years: T,
                isNextDisabled: I,
                isPrevDisabled: P,
                setPrev: _,
                setNext: F,
                switchViewType: M,
                onClickDay: S,
                onClickMonth: k,
                onClickYear: N,
              }
            )
          })({
            selectedDate: t,
            minDate: a,
            maxDate: n,
            autoFocus: b,
            showFocusRing: x,
            onMonthSwitch: M,
            onYearSwitch: S,
            onDecadesSwitch: k,
            onViewTypeChange: N,
            onSelect: F,
          }),
          {
            focusableDateRef: U,
            prevRef: Q,
            middleRef: Z,
            onPrevKeyDown: X,
            onMiddleKeyDown: G,
            forwardFocusToStart: ee,
          } = (({ withFocusTrap: e, isPrevDisabled: t }) => {
            const n = (0, s.useRef)(null),
              r = (0, s.useCallback)(
                (t) => {
                  var s
                  e &&
                    m.Modifiers.Shift + 9 === (0, m.hashFromEvent)(t) &&
                    (t.preventDefault(),
                    null === (s = n.current) || void 0 === s || s.focus())
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
              c = (0, s.useCallback)(
                (e) => {
                  var n, s
                  e.preventDefault(),
                    e.stopPropagation(),
                    t
                      ? null === (s = l.current) || void 0 === s || s.focus()
                      : null === (n = i.current) || void 0 === n || n.focus()
                },
                [t],
              )
            return {
              focusableDateRef: n,
              prevRef: i,
              middleRef: l,
              onPrevKeyDown: a,
              onMiddleKeyDown: o,
              forwardFocusToStart: c,
            }
          })({ withFocusTrap: E, isPrevDisabled: B }),
          te = (0, s.useMemo)(() => L[0], [L]),
          {
            onPrevClick: ne,
            onNextClick: se,
            onSwitchViewType: re,
          } = C({
            viewType: Y,
            decadesStartYear: te,
            viewDate: A,
            setPrev: $,
            setNext: K,
            switchViewType: W,
          })
        return s.createElement(
          'div',
          {
            className: r(i.calendar, g && i.popupStyle, o),
            tabIndex: -1,
            onKeyDown: I,
          },
          s.createElement(l, {
            prevAriaLabel: (0, u.getPrevAriaLabel)(
              Y,
              Y === u.CalendarViewType.Decades ? te : A,
            ),
            nextAriaLabel: (0, u.getNextAriaLabel)(
              Y,
              Y === u.CalendarViewType.Decades ? te : A,
            ),
            currentAriaLabel: (0, u.getCurrentAriaLabel)(
              Y,
              Y === u.CalendarViewType.Year ? te : A,
            ),
            currentVisibleTitle: (0, u.getCurrentVisibleTitle)(
              Y,
              Y === u.CalendarViewType.Decades ? te : A,
            ),
            onPrevClick: ne,
            onNextClick: se,
            onPrevKeyDown: X,
            onMiddleKeyDown: G,
            onHeaderKeyDown: P,
            onCurrentClick: re,
            isNextDisabled: y || H,
            isPrevDisabled: y || B,
            isViewModeDisabled: y,
            prevRef: Q,
            middleRef: Z,
          }),
          Y === u.CalendarViewType.Month &&
            s.createElement(f, {
              weeks: V,
              selectedDate: t,
              dateToFocus: O,
              maxDate: n,
              minDate: a,
              onClickDay: j,
              disableWeekends: h,
              highlightedFrom: d,
              highlightedTo: p,
              setPrevMonth: $,
              setNextMonth: K,
              showFocusRing: x,
              isDisabled: y,
              focusableDateRef: U,
            }),
          Y === u.CalendarViewType.Year &&
            s.createElement(v, {
              months: z,
              selectedDate: t,
              dateToFocus: O,
              maxDate: n,
              minDate: a,
              onSelect: J,
              setPrevYear: $,
              setNextYear: K,
              showFocusRing: x,
              isDisabled: y,
              focusableDateRef: U,
            }),
          Y === u.CalendarViewType.Decades &&
            s.createElement(w, {
              years: L,
              selectedDate: t,
              dateToFocus: O,
              maxDate: n,
              minDate: a,
              onSelect: q,
              setPrevDecades: $,
              setNextDecades: K,
              showFocusRing: x,
              isDisabled: y,
              focusableDateRef: U,
            }),
          s.createElement('div', { className: i['slot-wrapper'] }, _),
          E && s.createElement('div', { tabIndex: 0, onFocus: ee }),
        )
      }
    },
    85528: (e, t, n) => {
      n.d(t, { DatePicker: () => F })
      var s = n(11542),
        r = n(50959),
        a = n(97754),
        o = n(5325),
        i = n(32563),
        l = n(53741),
        c = n(28746),
        u = n(50151),
        h = n(9745),
        d = n(86623),
        p = n(95263),
        m = n(78274),
        g = n(52778),
        f = n(42842),
        v = n(68335),
        w = n(20111)
      class D extends r.PureComponent {
        constructor(e) {
          super(e),
            (this._input = null),
            (this._inputContainer = null),
            (this._handleFocus = (e) => {
              var t, n
              this.props.showOnFocus && this.props.onShowPicker(),
                null === (n = (t = this.props).onFocus) ||
                  void 0 === n ||
                  n.call(t, e)
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
              const e = (0, u.ensureNotNull)(this._input).value
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
                const e = (0, u.ensureNotNull)(this._input).value,
                  t = this.props.fixValue(e)
                t !== e && this.setState({ value: t })
              }
            }),
            (this._handleDropdownKeydown = (e) => {
              var t
              27 === (0, v.hashFromEvent)(e) &&
                (null === (t = this._input) || void 0 === t || t.focus(),
                this.props.onHidePicker())
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
            InputComponent: c = d.FormInput,
          } = this.props
          return r.createElement(
            'div',
            { className: w.pickerInput, ref: this._handleContainerRef },
            r.createElement(c, {
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
                      m.EndSlot,
                      null,
                      r.createElement(h.Icon, {
                        icon: l,
                        className: a(w.icon, s && w.disabled),
                        onClick: s || o ? void 0 : this.props.onShowPicker,
                      }),
                    ),
              'data-name': this.props.name,
            }),
            this.props.showPicker && !o
              ? r.createElement(
                  f.Portal,
                  {
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    pointerEvents: 'none',
                  },
                  r.createElement(
                    g.OutsideEvent,
                    { mouseDown: !0, handler: this.props.onHidePicker },
                    (t) =>
                      r.createElement(
                        'span',
                        { ref: t, style: { pointerEvents: 'auto' } },
                        r.createElement(
                          'div',
                          {
                            className: a(w.picker, w[e]),
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
      D.defaultProps = { showOnFocus: !0 }
      class b extends r.PureComponent {
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
              InputComponent: o = d.FormInput,
            } = this.props,
            i = !this.props.readonly && !n,
            l = this.props.showErrorMessages && s && s.length > 0
          return r.createElement(
            'div',
            { className: a(w.pickerInput, t) },
            r.createElement(o, {
              value: this.props.value,
              readonly: !0,
              noReadonlyStyles: !0,
              endSlot:
                s && s.length
                  ? void 0
                  : r.createElement(
                      m.EndSlot,
                      null,
                      r.createElement(h.Icon, {
                        icon: this.props.icon,
                        className: a(w.icon, n && w.disabled),
                      }),
                    ),
              className: e,
              inputClassName: w.textInput,
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
                className: w.nativePicker,
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
      var y = n(23935),
        C = n(67029),
        E = n(53017),
        _ = n(1401)
      class F extends r.PureComponent {
        constructor(e) {
          super(e),
            (this._pickerInputContainerRef = r.createRef()),
            (this._pickerInpuRef = r.createRef()),
            (this._dateFormatter = new l.DateFormatter()),
            (this._onPickerInputKeyDown = (e) => {
              const t = (0, v.hashFromEvent)(e)
              if ([v.Modifiers.Shift + 9, 9].includes(t)) this._hideCalendar()
              else {
                if (40 === t)
                  return (
                    e.preventDefault(),
                    this._showCalendar(),
                    void this.setState({ autofocusCalendar: !0 })
                  )
                13 === t && this.props.onEnter && this.props.onEnter(e),
                  this._hideCalendar()
              }
            }),
            (this._returnFocusToInput = () => {
              var e
              this.setState({ autofocusCalendar: !1 }),
                null === (e = this._pickerInpuRef.current) ||
                  void 0 === e ||
                  e.focus()
            }),
            (this._fixValue = (e) => (
              (e = (e = e.substring(0, 10)).replace(/-+/g, '-')),
              (/^\d{4}$/.test(e) || /^\d{4}-\d{2}$/.test(e)) && (e += '-'),
              e
            )),
            (this._isValid = (e) => {
              const t = this._dateFormatter.parse(e)
              if (t.res && /^[0-9]{4}(-[0-9]{2}){2}/.test(t.value)) {
                const e = new Date(t.value)
                return (
                  !(0, y.isInvalidDateObj)(e) &&
                  (!!(
                    this.props.noRangeValidation ||
                    (i.mobiletouch && o.isIOS)
                  ) ||
                    (0, y.isInRange)(e, this.props.minDate, this.props.maxDate))
                )
              }
              return !1
            }),
            (this._onBlur = (e) => {
              var t
              if (
                !this.props.revertInvalidData ||
                (null === (t = this._pickerInputContainerRef.current) ||
                void 0 === t
                  ? void 0
                  : t.contains(e.relatedTarget))
              )
                return
              const { value: n } = e.target
              if (!this._isValid(n)) {
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
              const t = this._isValid(e) ? new Date(e.concat('T00:00')) : null
              t
                ? this.setState({ date: t, isInvalid: !1 })
                : this.setState({ isInvalid: !0 }),
                this.props.onPick(t)
            }),
            (this._onSelect = (e) => {
              this.setState({ date: e, showCalendar: !1, isInvalid: !1 }),
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
                this.state.isInvalid && e.push(s.t(null, void 0, n(5122))), e
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
            t = (0, E.mergeRefs)([
              this._pickerInpuRef,
              this.props.inputReference,
            ])
          return i.mobiletouch
            ? r.createElement(b, {
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
                  D,
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
                  r.createElement(c.Calendar, {
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
      F.defaultProps = { position: 'fixed', withCalendar: !0 }
    },
    76056: (e, t, n) => {
      n.d(t, { DateInput: () => m })
      var s = n(50959),
        r = n(11542),
        a = n(9745),
        o = n(78274),
        i = n(86623),
        l = n(97754),
        c = n.n(l),
        u = n(30247)
      function h(e) {
        const { className: t, text: n } = e
        return s.createElement('span', { className: c()(u.tooltip, t) }, n)
      }
      var d = n(98475)
      const p = n(53209)
      function m(e) {
        const {
          hasErrors: t,
          onClick: l,
          errors: c,
          className: u,
          theme: m = p,
          ...g
        } = e
        return s.createElement(
          'div',
          { className: m.container, onClick: l },
          s.createElement(i.FormInput, {
            ...g,
            className: m.date,
            hasErrors: t,
            errors: [],
            endSlot:
              !t &&
              s.createElement(
                o.EndSlot,
                { icon: !0, interactive: !1 },
                s.createElement(a.Icon, { icon: d, className: m.icon }),
              ),
          }),
          t &&
            s.createElement(h, {
              text: r.t(null, void 0, n(32457)),
              className: m.tooltip,
            }),
        )
      }
    },
    23935: (e, t, n) => {
      n.d(t, {
        addLocalTime: () => b,
        getCloneDateWithOffset: () => N,
        getDateInTabOrder: () => R,
        getDecades: () => _,
        getDecadesStart: () => y,
        getFirstEnabledDay: () => M,
        getFirstEnabledMonth: () => S,
        getFirstEnabledYear: () => k,
        getMonths: () => E,
        getWeeks: () => C,
        isDayDisabled: () => F,
        isInRange: () => f,
        isInvalidDateObj: () => v,
        isSameDay: () => u,
        isSameMonth: () => h,
        isSameYear: () => d,
        resetToDayEnd: () => o,
        resetToDayStart: () => a,
        subtractLocalTime: () => D,
        twoDigitsFormat: () => r,
      })
      var s = n(15499)
      function r(e) {
        return ('0' + e).slice(-2)
      }
      function a(e) {
        const t = new Date(e)
        return (
          t.setMilliseconds(0),
          t.setSeconds(0),
          t.setMinutes(0),
          t.setHours(0),
          t
        )
      }
      function o(e) {
        const t = new Date(e)
        return (
          t.setMilliseconds(999),
          t.setSeconds(59),
          t.setMinutes(59),
          t.setHours(23),
          t
        )
      }
      function i(e, t = !1) {
        const n = a(e),
          s = t
            ? ((e) => {
                if (e > 6) throw new Error('Invalid day is provided')
                return 0 === e ? 6 : e - 1
              })(n.getDay())
            : n.getDay()
        return n.setDate(n.getDate() - s), n
      }
      function l(e) {
        const t = a(e)
        return t.setDate(1), t
      }
      function c(e) {
        const t = l(e)
        return t.setMonth(1), t
      }
      function u(e, t) {
        return !!t && Number(a(e)) === Number(a(t))
      }
      function h(e, t) {
        return !!t && Number(l(e)) === Number(l(t))
      }
      function d(e, t) {
        return !!t && Number(c(e)) === Number(c(t))
      }
      function p(e) {
        const t = new Date(e.getFullYear(), 0, 1),
          n = (Number(e) - Number(t)) / 864e5
        return Math.ceil((n + t.getDay() + 1) / 7)
      }
      function m(e) {
        const t = new Date(e)
        return t.setDate(t.getDate() + 7), t
      }
      const g = { day: a, month: l, year: c }
      function f(e, t, n, s = 'day') {
        const r = g[s],
          a = !t || Number(r(t)) - Number(r(e)) <= 0
        return (!n || Number(r(n)) - Number(r(e)) >= 0) && a
      }
      function v(e) {
        return Number.isNaN(Number(e))
      }
      function w(e) {
        return new Date(e).getTimezoneOffset() / 60
      }
      function D(e) {
        const t = new Date(e)
        return t.setHours(t.getHours() + w(t)), t
      }
      function b(e) {
        const t = new Date(e)
        return t.setHours(t.getHours() - w(t)), t
      }
      function y(e) {
        const t = (e.getFullYear() % 10) * -1,
          n = new Date(e)
        return n.setFullYear(e.getFullYear() + t), n
      }
      function C(e) {
        const t = []
        let n = i(l(e), !0)
        for (let s = 0; s < 6; s++) {
          const s = []
          for (let t = 0; t < 7; t++) {
            const r = new Date(n)
            r.setDate(r.getDate() + t), h(r, e) && s.push(r)
          }
          s.length && t.push({ week: p(n), days: s }), (n = new Date(m(n)))
        }
        return t
      }
      function E(e) {
        return s.MONTHS_SHORT.map((t, n) => {
          const r = l(e)
          return r.setMonth(n), { title: t, ariaLabel: s.MONTHS[n], date: r }
        })
      }
      function _(e) {
        const t = []
        for (let n = 0; n < s.DECADES_YEARS_AMOUNT; n++) {
          const s = new Date(e)
          s.setFullYear(e.getFullYear() + n), t.push(s)
        }
        return t
      }
      function F({ day: e, minDate: t, maxDate: n, disableWeekends: s = !1 }) {
        if (!f(e, t, n)) return !0
        const r = [6, 0].includes(e.getDay())
        return !!s && r
      }
      function M(e, t) {
        return (function n(s = 0, r = 0) {
          if (!e[s] || !e[s].days[r]) return
          const a = e[s].days,
            o = a[r]
          return t(o) ? (r + 1 < a.length ? n(s, r + 1) : n(s + 1, 0)) : o
        })()
      }
      function S(e, t) {
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
      function N({
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
      function R({
        selectedDate: e,
        dateToFocus: t,
        currentlyFocused: n,
        firstEnabledDate: s,
        getFirstDate: r,
        getLastDate: a,
        isDisabledDate: o,
      }) {
        const i = f(e, r(), a(), 'day') && !o(e) ? e : null,
          l = t && f(t, r(), a(), 'day') && !o(t) ? t : null
        return (n && f(n, r(), a(), 'day') && !o(n) ? n : null) || i || l || s
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
    86623: (e, t, n) => {
      n.d(t, { FormInput: () => c })
      var s = n(50959),
        r = n(31261),
        a = n(95263),
        o = n(78274),
        i = n(47201),
        l = n(38528)
      function c(e) {
        var t
        const {
            intent: n,
            onFocus: c,
            onBlur: u,
            onMouseOver: h,
            onMouseOut: d,
            containerReference: p = null,
            endSlot: m,
            hasErrors: g,
            hasWarnings: f,
            hasSuccessMessages: v,
            errors: w,
            warnings: D,
            successMessages: b,
            alwaysShowAttachedErrors: y,
            iconHidden: C,
            messagesPosition: E,
            messagesAttachment: _,
            customErrorsAttachment: F,
            messagesRoot: M,
            inheritMessagesWidthFromTarget: S,
            disableMessagesRtlStyles: k,
            'aria-required': N,
            'aria-invalid': R,
            'aria-label': x,
            inputDescription: T,
            ...I
          } = e,
          P = (0, a.useControlValidationLayout)({
            hasErrors: g,
            hasWarnings: f,
            hasSuccessMessages: v,
            errors: w,
            warnings: D,
            successMessages: b,
            alwaysShowAttachedErrors: y,
            iconHidden: C,
            messagesPosition: E,
            messagesAttachment: _,
            customErrorsAttachment: F,
            messagesRoot: M,
            inheritMessagesWidthFromTarget: S,
            disableMessagesRtlStyles: k,
            inputDescription: T,
          }),
          A = (0, i.createSafeMulticastEventHandler)(c, P.onFocus),
          Y = (0, i.createSafeMulticastEventHandler)(u, P.onBlur),
          O = (0, i.createSafeMulticastEventHandler)(h, P.onMouseOver),
          V = (0, i.createSafeMulticastEventHandler)(d, P.onMouseOut)
        return s.createElement(
          s.Fragment,
          null,
          s.createElement(r.InputControl, {
            ...I,
            intent: null !== (t = P.intent) && void 0 !== t ? t : n,
            onFocus: A,
            onBlur: Y,
            onMouseOver: O,
            onMouseOut: V,
            containerReference: (0, l.useMergedRefs)([p, P.containerReference]),
            endSlot: s.createElement(
              s.Fragment,
              null,
              P.icon && s.createElement(o.EndSlot, { icon: !0 }, P.icon),
              m,
            ),
            'aria-required': N,
            'aria-invalid': R,
            'aria-describedby': P.ariaIds,
            'aria-label': x,
          }),
          P.renderedErrors,
        )
      }
    },
    36565: (e, t, n) => {
      n.d(t, { TimeInput: () => A })
      var s = n(49483),
        r = n(50959),
        a = n(97754),
        o = n.n(a),
        i = n(50151),
        l = n(47201),
        c = n(78274),
        u = n(31261),
        h = n(9745),
        d = n(43832),
        p = n(95096)
      function m(e) {
        return r.createElement(h.Icon, { className: d.icon, icon: p })
      }
      var g = n(29202),
        f = n(78634)
      var v = n(36383),
        w = n(37160)
      const D = {
        0: { pattern: /\d/ },
        9: { pattern: /\d/, optional: !0 },
        '#': { pattern: /\d/, recursive: !0 },
        A: { pattern: /[a-zA-Z0-9]/ },
        S: { pattern: /[a-zA-Z]/ },
      }
      function b(e, t, n) {
        const s = [],
          r = n
        let a = 0,
          o = 0
        const i = e.length,
          l = r.length
        let c = -1,
          u = 0
        const h = [],
          d = i - 1,
          p = []
        let m
        while (a < i && o < l) {
          const n = e.charAt(a),
            i = r.charAt(o),
            l = D[n]
          l
            ? (i.match(l.pattern)
                ? (s.push(i),
                  l.recursive &&
                    (-1 === c ? (c = a) : a === d && a !== c && (a = c - 1),
                    d === c && (a -= 1)),
                  (a += 1))
                : i === m
                  ? (u--, (m = void 0))
                  : l.optional
                    ? ((a += 1), (o -= 1))
                    : l.fallback
                      ? (s.push(l.fallback), (a += 1), (o -= 1))
                      : p.push({ p: o, v: i, e: l.pattern }),
              (o += 1))
            : (t || s.push(n),
              i === n ? (h.push(o), (o += 1)) : ((m = n), h.push(o + u), u++),
              (a += 1))
        }
        const g = e.charAt(d)
        i !== l + 1 || D[g] || s.push(g)
        const f = s.join(''),
          v = ((e, t) => {
            const n = 0,
              s = {}
            for (let e = 0; e < t.length; e++) s[t[e] + n] = 1
            return s
          })(0, h)
        return [f, v, p]
      }
      function y(e, t, n) {
        const s = ((e) => {
            let t = !0
            for (let n = 0; n < e.length; n++) {
              const s = D[e.charAt(n)]
              if (s && s.recursive) {
                t = !1
                break
              }
            }
            return t ? e.length : void 0
          })(e),
          [a, o] = b(e, !1, t),
          [l, c] = (0, r.useState)(a),
          [u, h] = (0, r.useState)(0),
          [d, p] = (0, r.useState)(!1),
          m = (0, r.useRef)(o),
          g = (0, r.useRef)(l)
        return (
          (0, r.useEffect)(() => {
            const [n, s] = b(e, !1, t)
            c(n), f(s)
          }, [t, e]),
          (0, r.useLayoutEffect)(() => {
            const e = (0, i.ensureNotNull)(n.current)
            d && (e.setSelectionRange(u, u), p(!1)), h(C(e))
          }, [d]),
          [
            t,
            g,
            {
              onChange: () => {
                const t = (0, i.ensureNotNull)(n.current),
                  s = t.value,
                  [r, a] = b(e, !1, s)
                c(r), (g.current = r)
                const o = f(a),
                  d = ((e, t, n, s, r, a) => {
                    if (e !== t) {
                      const o = t.length,
                        i = e.length
                      let l = 0,
                        c = 0,
                        u = 0,
                        h = 0,
                        d = 0
                      for (d = s; d < o && r[d]; d++) c++
                      for (d = s - 1; d >= 0 && r[d]; d--) l++
                      for (d = s - 1; d >= 0; d--) r[d] && u++
                      for (d = n - 1; d >= 0; d--) a[d] && h++
                      if (s > i) s = 10 * o
                      else if (n >= s && n !== i) {
                        if (a[s]) {
                          const e = s
                          ;(s -= h - u), r[(s -= l)] && (s = e)
                        }
                      } else s > n && ((s += u - h), (s += c))
                    }
                    return s
                  })(l, r, u, C(t), a, o)
                h(d), p(!0)
              },
              onSelect: () => {
                const e = (0, i.ensureNotNull)(n.current)
                h(C(e))
              },
              maxLength: s,
            },
          ]
        )
        function f(e) {
          const t = m.current
          return (m.current = e), t
        }
      }
      function C(e) {
        return e.selectionStart || 0
      }
      function E(e) {
        const { value: t, mask: n, onChange: s, ...a } = e,
          o = (0, r.useRef)(null),
          [i, l, c] = y(n, t, o)
        return (
          (0, r.useLayoutEffect)(() => {
            void 0 !== e.reference && (e.reference.current = o.current)
          }, [e.reference]),
          r.createElement(u.InputControl, {
            ...a,
            maxLength: c.maxLength,
            value: i,
            autoComplete: 'off',
            reference: (e) => {
              o.current = e
            },
            onChange: () => {
              c.onChange(), s(l.current)
            },
            onSelect: c.onSelect,
          })
        )
      }
      var _ = n(68335),
        F = n(20520),
        M = n(16396),
        S = n(78071)
      const k = (() => {
        const e = []
        for (let t = 0; t < 24; ++t)
          for (let n = 0; n < 60; n += 15) {
            const [s, r] = [I(t.toString()), I(n.toString())],
              a = `${s}:${r}`,
              o = x(a) ? a : T(a)
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
          [u, h] = (0, g.useFocus)(),
          [d, p] = (0, r.useState)(e.value),
          f = R(d),
          D = x(f) ? f : T(f),
          [b, y] = (0, r.useState)(D),
          C =
            u ||
            L().some((e) => null !== e && e.contains(document.activeElement))
        ;(0, r.useLayoutEffect)(() => p(e.value), [e.value]),
          (0, r.useLayoutEffect)(() => y(D), [d, C]),
          (0, r.useEffect)(() => H(b === D ? 'auto' : 'smooth'), [b])
        const N = (0, S.lowerbound)(k, D, (e, t) => e < t)
        let I = k
        k[N] !== D && ((I = [...k]), I.splice(N, 0, D))
        const P = (0, v.useOutsideEvent)({
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
                const t = (I.indexOf(b) + I.length - 1) % I.length
                y(I[t])
              }
              if (40 === t) {
                e.preventDefault()
                const t = (I.indexOf(b) + I.length + 1) % I.length
                y(I[t])
              }
            },
            onFocus: (e) => {
              V(e) || h.onFocus(e)
            },
            onBlur: (e) => {
              V(e) || h.onBlur(e)
            },
            ref: P,
          },
          r.createElement(E, {
            disabled: e.disabled,
            name: e.name,
            endSlot: r.createElement(
              c.EndSlot,
              { icon: !0 },
              r.createElement(m, null),
            ),
            reference: s,
            containerReference: n,
            mask: '09:00',
            value: d,
            onFocus: (t) => {
              var n
              setTimeout(B, 0),
                null === (n = e.onFocus) || void 0 === n || n.call(e, t)
            },
            onBlur: (e) => {
              V(e) || A(d)
            },
            onChange: (t) => {
              p(t), e.onInput && e.onInput(t)
            },
            onKeyDown: (e) => {
              if (e.defaultPrevented) return
              const t = (0, _.hashFromEvent)(e.nativeEvent)
              13 === t &&
                (e.preventDefault(),
                A(b),
                (0, i.ensureNotNull)(s.current).blur())
              27 === t &&
                (e.preventDefault(), (0, i.ensureNotNull)(s.current).blur())
            },
          }),
          r.createElement(
            F.PopupMenu,
            {
              onOpen: () => {
                H()
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
                  const n = (0, w.clamp)(r, 0, s),
                    o = (0, w.clamp)(r, 0, t)
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
            I.map((e) =>
              r.createElement(M.PopupMenuItem, {
                key: e,
                label: e,
                isActive: e === D,
                isHovered: e === b,
                reference: e === b ? Y : void 0,
                onClick: O,
                onClickArg: e,
              }),
            ),
          ),
        )
        function A(n) {
          const s = R(n),
            r = x(s) ? s : T(s)
          p(r), t || ((t = !0), e.onChange(r))
        }
        function Y(e) {
          l.current = e
        }
        function O(e) {
          A((0, i.ensureDefined)(e)), (0, i.ensureNotNull)(a.current).blur()
        }
        function V(e) {
          return (
            u &&
            (null !== z(document.activeElement) || null !== z(e.relatedTarget))
          )
        }
        function z(e) {
          return (
            (e instanceof Node &&
              L().find((t) => null !== t && t.contains(e))) ||
            null
          )
        }
        function L() {
          return [a.current, s.current]
        }
        function H(e = 'auto') {
          if (null !== l.current) {
            const t = (0, i.ensureNotNull)(a.current).getBoundingClientRect(),
              n = l.current.getBoundingClientRect()
            ;(t.top > n.top || t.bottom < n.bottom) &&
              l.current.scrollIntoView({ behavior: e })
          }
        }
        function B() {
          const e = s.current
          if (null !== e) {
            const t = e.value || ''
            e.setSelectionRange(0, t.length)
          }
        }
      }
      function R(e) {
        const [t = '', n = ''] = e.split(':'),
          [s, r] = [I(t), P(n)]
        return `${s}:${r}`
      }
      function x(e) {
        return /^(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/g.test(e)
      }
      function T(e) {
        const [t, n] = e.split(':'),
          [s, r] = [
            (0, w.clamp)(Number.parseInt(t), 0, 23),
            (0, w.clamp)(Number.parseInt(n), 0, 59),
          ],
          [a, o] = [I(s.toString()), P(r.toString())]
        return `${a}:${o}`
      }
      function I(e) {
        return e.slice(0, 2).padStart(2, '0')
      }
      function P(e) {
        return e.slice(0, 2).padEnd(2, '0')
      }
      const A = s.CheckMobile.any()
        ? (e) => {
            const { onChange: t, onFocus: n, value: s, className: a, ...h } = e,
              d = (0, r.useRef)(null),
              [p, v] = (0, g.useFocus)(),
              w = (0, l.createSafeMulticastEventHandler)(v.onBlur, () => {
                d.current && s && (d.current.defaultValue = s)
              })
            return (
              (0, r.useLayoutEffect)(() => {
                d.current && s && (d.current.defaultValue = s)
              }, []),
              (0, r.useLayoutEffect)(() => {
                d.current && s && (d.current.value = s)
              }, [s]),
              r.createElement(
                'div',
                { className: o()(f.wrap, a) },
                r.createElement(u.InputControl, {
                  ...h,
                  type: 'text',
                  endSlot: r.createElement(
                    c.EndSlot,
                    { icon: !0 },
                    r.createElement(m, null),
                  ),
                  value: s,
                  highlight: p,
                  intent: p ? 'primary' : void 0,
                  onFocus: (e) => {
                    ;(0, i.ensureNotNull)(d.current).focus(), n && n(e)
                  },
                  onChange: () => {},
                }),
                r.createElement('input', {
                  ...v,
                  disabled: e.disabled,
                  className: f.input,
                  type: 'time',
                  onBlur: w,
                  onChange: (e) => {
                    const { value: n } = e.currentTarget
                    t && n && t(n)
                  },
                  ref: d,
                }),
              )
            )
          }
        : N
    },
    95263: (e, t, n) => {
      n.d(t, { MessagesPosition: () => _, useControlValidationLayout: () => I })
      var s = n(50959),
        r = n(97754)
      function a(e, t) {
        ;(0, s.useEffect)(
          () => (
            t && t(e),
            () => {
              t && t(e)
            }
          ),
          [],
        )
      }
      var o = n(29202),
        i = n(70412),
        l = n(78274),
        c = n(1405),
        u = n(86431),
        h = n(962)
      var d = n(44022),
        p = n(38223)
      class m extends s.PureComponent {
        render() {
          const {
              children: e = [],
              show: t = !1,
              customErrorClass: n,
              disableRtlStyles: a,
              messageIdCallback: o,
            } = this.props,
            i = r(d.errors, { [d.show]: t }, n),
            l = e.map((e, t) =>
              s.createElement(w, { key: t, messageIdCallback: o }, e),
            )
          let c = {
            position: 'absolute',
            top: this.props.top,
            width: this.props.width,
            height: this.props.height,
            bottom: void 0 !== this.props.bottom ? this.props.bottom : '100%',
            right: void 0 !== this.props.right ? this.props.right : 0,
            left: this.props.left,
            zIndex: this.props.zIndex,
            maxWidth: this.props.maxWidth,
          }
          if ((0, p.isRtl)() && !a) {
            const { left: e, right: t } = c
            c = { ...c, left: t, right: e }
          }
          return s.createElement('div', { style: c, className: i }, l)
        }
      }
      const g = (0, u.makeOverlapable)(
        ((f = m),
        ((v = class extends s.PureComponent {
          constructor(e) {
            super(e),
              (this._getComponentInstance = (e) => {
                this._instance = e
              }),
              (this._throttleCalcProps = () => {
                requestAnimationFrame(() =>
                  this.setState(this._calcProps(this.props)),
                )
              }),
              (this.state = this._getStateFromProps())
          }
          componentDidMount() {
            ;(this._instanceElem = h.findDOMNode(this._instance)),
              this.props.attachOnce || this._subscribe(),
              this.setState(this._calcProps(this.props))
          }
          componentDidUpdate(e) {
            ;(e.children === this.props.children &&
              e.top === this.props.top &&
              e.left === this.props.left &&
              e.width === this.props.width) ||
              this.setState(this._getStateFromProps(), () =>
                this.setState(this._calcProps(this.props)),
              )
          }
          render() {
            return s.createElement(
              'div',
              {
                style: { position: 'absolute', width: '100%', top: 0, left: 0 },
              },
              s.createElement(
                f,
                {
                  ...this.props,
                  ref: this._getComponentInstance,
                  top: this.state.top,
                  bottom:
                    void 0 !== this.state.bottom ? this.state.bottom : 'auto',
                  right:
                    void 0 !== this.state.right ? this.state.right : 'auto',
                  left: this.state.left,
                  width: this.state.width,
                  maxWidth: this.state.maxWidth,
                },
                this.props.children,
              ),
            )
          }
          componentWillUnmount() {
            this._unsubsribe()
          }
          _getStateFromProps() {
            return {
              bottom: this.props.bottom,
              left: this.props.left,
              right: this.props.right,
              top: void 0 !== this.props.top ? this.props.top : -1e4,
              width: this.props.inheritWidthFromTarget
                ? this.props.target &&
                  this.props.target.getBoundingClientRect().width
                : this.props.width,
              maxWidth:
                this.props.inheritMaxWidthFromTarget &&
                this.props.target &&
                this.props.target.getBoundingClientRect().width,
            }
          }
          _calcProps(e) {
            if (e.target && e.attachment && e.targetAttachment) {
              const t = this._calcTargetProps(
                e.target,
                e.attachment,
                e.targetAttachment,
              )
              if (null === t) return {}
              const {
                  width: n,
                  inheritWidthFromTarget: s = !0,
                  inheritMaxWidthFromTarget: r = !1,
                } = this.props,
                a = { width: s ? t.width : n, maxWidth: r ? t.width : void 0 }
              switch (e.attachment.vertical) {
                case 'bottom':
                case 'middle':
                  a.top = t.y
                  break
                default:
                  a[e.attachment.vertical] = t.y
              }
              switch (e.attachment.horizontal) {
                case 'right':
                case 'center':
                  a.left = t.x
                  break
                default:
                  a[e.attachment.horizontal] = t.x
              }
              return a
            }
            return {}
          }
          _calcTargetProps(e, t, n) {
            const s = e.getBoundingClientRect(),
              r = this._instanceElem.getBoundingClientRect(),
              a =
                'parent' === this.props.root
                  ? this._getCoordsRelToParentEl(e, s)
                  : this._getCoordsRelToDocument(s)
            if (null === a) return null
            const o = this._getDimensions(r),
              i = this._getDimensions(s).width
            let l = 0,
              c = 0
            switch (t.vertical) {
              case 'top':
                c = a[n.vertical]
                break
              case 'bottom':
                c = a[n.vertical] - o.height
                break
              case 'middle':
                c = a[n.vertical] - o.height / 2
            }
            switch (t.horizontal) {
              case 'left':
                l = a[n.horizontal]
                break
              case 'right':
                l = a[n.horizontal] - o.width
                break
              case 'center':
                l = a[n.horizontal] - o.width / 2
            }
            return (
              'number' == typeof this.props.attachmentOffsetY &&
                (c += this.props.attachmentOffsetY),
              'number' == typeof this.props.attachmentOffsetX &&
                (l += this.props.attachmentOffsetX),
              { x: l, y: c, width: i }
            )
          }
          _getCoordsRelToDocument(e) {
            const t = pageYOffset,
              n = pageXOffset,
              s = e.top + t,
              r = e.bottom + t,
              a = e.left + n
            return {
              top: s,
              bottom: r,
              left: a,
              right: e.right + n,
              middle: (s + e.height) / 2,
              center: a + e.width / 2,
            }
          }
          _getCoordsRelToParentEl(e, t) {
            const n = e.offsetParent
            if (null === n) return null
            const s = n.scrollTop,
              r = n.scrollLeft,
              a = e.offsetTop + s,
              o = e.offsetLeft + r,
              i = t.width + o
            return {
              top: a,
              bottom: t.height + a,
              left: o,
              right: i,
              middle: (a + t.height) / 2,
              center: (o + t.width) / 2,
            }
          }
          _getDimensions(e) {
            return { height: e.height, width: e.width }
          }
          _subscribe() {
            'document' === this.props.root &&
              (window.addEventListener('scroll', this._throttleCalcProps, !0),
              window.addEventListener('resize', this._throttleCalcProps))
          }
          _unsubsribe() {
            window.removeEventListener('scroll', this._throttleCalcProps, !0),
              window.removeEventListener('resize', this._throttleCalcProps)
          }
        }).displayName = 'Attachable Component'),
        v),
      )
      var f, v
      function w(e) {
        const { children: t, messageIdCallback: n, ...r } = e
        return s.createElement('div', { ...r, className: d.error }, t)
      }
      function D(e) {
        const { children: t, messageIdCallback: n, ...r } = e,
          o = s.useId()
        return (
          a(o, n),
          s.createElement(
            'span',
            { ...r, className: d['visually-hidden'], id: o },
            t,
          )
        )
      }
      var b = n(9745),
        y = n(16658),
        C = n(40461)
      function E(e) {
        const { intent: t = 'danger' } = e
        return s.createElement(b.Icon, {
          icon: y,
          className: r(C['error-icon'], C[`intent-${t}`]),
        })
      }
      var _,
        F,
        M = n(27345)
      !((e) => {
        ;(e[(e.Attached = 0)] = 'Attached'),
          (e[(e.Static = 1)] = 'Static'),
          (e[(e.Hidden = 2)] = 'Hidden')
      })(_ || (_ = {})),
        ((e) => {
          ;(e.Top = 'top'), (e.Bottom = 'bottom')
        })(F || (F = {}))
      const S = {
        top: {
          attachment: c.anchors.topRight.attachment,
          targetAttachment: c.anchors.topRight.targetAttachment,
          attachmentOffsetY: -4,
        },
        bottom: {
          attachment: c.anchors.bottomRight.attachment,
          targetAttachment: c.anchors.bottomRight.targetAttachment,
          attachmentOffsetY: 4,
        },
      }
      function k(e) {
        const {
            isOpened: t,
            target: n,
            errorAttachment: r = F.Top,
            customErrorsAttachment: a,
            root: o = 'parent',
            inheritWidthFromTarget: i = !1,
            disableRtlStyles: l,
            children: c,
            messageIdCallback: u,
          } = e,
          {
            attachment: h,
            targetAttachment: d,
            attachmentOffsetY: p,
          } = null != a ? a : S[r]
        return s.createElement(
          s.Fragment,
          null,
          s.createElement(
            g,
            {
              isOpened: t,
              target: n,
              root: o,
              inheritWidthFromTarget: i,
              attachment: h,
              targetAttachment: d,
              attachmentOffsetY: p,
              disableRtlStyles: l,
              messageIdCallback: u,
              inheritMaxWidthFromTarget: !0,
              show: !0,
            },
            c,
          ),
          s.createElement(D, { messageIdCallback: u }, c),
        )
      }
      function N(e, t) {
        return Boolean(e) && void 0 !== t && t.length > 0
      }
      function R(e, t, n) {
        return e === _.Attached && N(t, n)
      }
      function x(e, t, n) {
        return e === _.Static && N(t, n)
      }
      function T(e, t, n) {
        const {
            hasErrors: s,
            hasWarnings: r,
            hasSuccessMessages: a,
            alwaysShowAttachedErrors: o,
            iconHidden: i,
            errors: l,
            warnings: c,
            successMessages: u,
            messagesPosition: h = _.Static,
          } = e,
          d = R(h, s, l),
          p = R(h, r, c),
          m = d && (t || n || Boolean(o)),
          g = !m && p && (t || n),
          f = x(h, s, l),
          v = !f && x(h, r, c),
          w = !f && !v && x(h, a, u),
          D = !i && Boolean(s),
          b = !i && !D && Boolean(r),
          y = ((e, t, n) =>
            Boolean(n)
              ? 'success'
              : Boolean(e)
                ? 'danger'
                : Boolean(t)
                  ? 'warning'
                  : void 0)(s, r, a)
        return {
          hasAttachedErrorMessages: d,
          hasAttachedWarningMessages: p,
          showAttachedErrorMessages: m,
          showAttachedWarningMessages: g,
          showStaticErrorMessages: f,
          showStaticWarningMessages: v,
          showStaticSuccessMessages: w,
          showErrorIcon: D,
          showWarningIcon: b,
          intent: y,
        }
      }
      function I(e) {
        var t, n, a, c
        const {
            errors: u,
            warnings: h,
            successMessages: d,
            messagesAttachment: p,
            customErrorsAttachment: m,
            messagesRoot: g,
            inheritMessagesWidthFromTarget: f,
            disableMessagesRtlStyles: v,
            inputDescription: w,
          } = e,
          [D, b] = (0, o.useFocus)(),
          [y, C] = (0, i.useHover)(),
          _ = (0, s.useRef)(null),
          [F, S] = s.useState(void 0),
          N = (0, s.useRef)(new Map()),
          R = s.useCallback(
            (e) => {
              if (!e) return
              const t = N.current
              t.has(e) ? t.delete(e) : t.set(e, e),
                0 !== t.size ? S(Array.from(t.keys()).join(' ')) : S(void 0)
            },
            [S, N.current],
          ),
          {
            hasAttachedErrorMessages: x,
            hasAttachedWarningMessages: I,
            showAttachedErrorMessages: A,
            showAttachedWarningMessages: Y,
            showStaticErrorMessages: O,
            showStaticWarningMessages: V,
            showStaticSuccessMessages: z,
            showErrorIcon: L,
            showWarningIcon: H,
            intent: B,
          } = T(e, D, y),
          $ =
            L || H
              ? s.createElement(E, { intent: L ? 'danger' : 'warning' })
              : void 0,
          K = x
            ? s.createElement(k, {
                errorAttachment: p,
                customErrorsAttachment: m,
                isOpened: A,
                target: _.current,
                root: g,
                inheritWidthFromTarget: f,
                disableRtlStyles: v,
                children: u,
                messageIdCallback: R,
              })
            : void 0,
          W = I
            ? s.createElement(k, {
                errorAttachment: p,
                isOpened: Y,
                target: _.current,
                root: g,
                inheritWidthFromTarget: f,
                disableRtlStyles: v,
                children: h,
                messageIdCallback: R,
              })
            : void 0,
          j = O
            ? s.createElement(
                l.AfterSlot,
                { className: r(M['static-messages'], M.errors) },
                null == u
                  ? void 0
                  : u.map((e, t) =>
                      s.createElement(P, { key: t, messageIdCallback: R }, e),
                    ),
              )
            : void 0,
          J = V
            ? s.createElement(
                l.AfterSlot,
                { className: r(M['static-messages'], M.warnings) },
                null == h
                  ? void 0
                  : h.map((e, t) =>
                      s.createElement(P, { key: t, messageIdCallback: R }, e),
                    ),
              )
            : void 0,
          q = z
            ? s.createElement(
                l.AfterSlot,
                { className: r(M['static-messages'], M['success-mesages']) },
                null == d
                  ? void 0
                  : d.map((e, t) =>
                      s.createElement(P, { key: t, messageIdCallback: R }, e),
                    ),
              )
            : void 0,
          U =
            !O && !V && !z && w
              ? s.createElement(
                  l.AfterSlot,
                  {
                    className: r(M['static-messages'], M['input-description']),
                  },
                  s.createElement(P, { messageIdCallback: R }, w),
                )
              : void 0
        return {
          ariaIds: F,
          icon: $,
          renderedErrors:
            null !==
              (c =
                null !==
                  (a =
                    null !==
                      (n =
                        null !== (t = null != K ? K : W) && void 0 !== t
                          ? t
                          : j) && void 0 !== n
                      ? n
                      : J) && void 0 !== a
                  ? a
                  : q) && void 0 !== c
              ? c
              : U,
          containerReference: _,
          intent: B,
          ...b,
          ...C,
        }
      }
      function P(e) {
        const { children: t, messageIdCallback: n, ...r } = e,
          o = s.useId()
        return (
          a(o, n),
          s.createElement('span', { ...r, className: M.message, id: o }, t)
        )
      }
    },
    16396: (e, t, n) => {
      n.d(t, { DEFAULT_POPUP_MENU_ITEM_THEME: () => c, PopupMenuItem: () => h })
      var s = n(50959),
        r = n(97754),
        a = n(51768),
        o = n(59064),
        i = n(76068),
        l = n(71986)
      const c = l
      function u(e) {
        e.stopPropagation()
      }
      function h(e) {
        const {
            id: t,
            role: n,
            className: c,
            title: h,
            labelRowClassName: d,
            labelClassName: p,
            toolboxClassName: m,
            shortcut: g,
            forceShowShortcuts: f,
            icon: v,
            iconClassname: w,
            isActive: D,
            isDisabled: b,
            isHovered: y,
            appearAsDisabled: C,
            label: E,
            link: _,
            showToolboxOnHover: F,
            showToolboxOnFocus: M,
            target: S,
            rel: k,
            toolbox: N,
            reference: R,
            onMouseOut: x,
            onMouseOver: T,
            onKeyDown: I,
            suppressToolboxClick: P = !0,
            theme: A = l,
            tabIndex: Y,
            tagName: O,
            renderComponent: V,
            roundedIcon: z,
            iconAriaProps: L,
            circleLogo: H,
            dontClosePopup: B,
            onClick: $,
            onClickArg: K,
            trackEventObject: W,
            trackMouseWheelClick: j,
            trackRightClick: J,
            ...q
          } = e,
          U = (0, s.useRef)(null),
          Q = (0, s.useMemo)(
            () =>
              ((e) => {
                function t(t) {
                  const { reference: n, ...r } = t,
                    a = null != e ? e : r.href ? 'a' : 'div',
                    o =
                      'a' === a
                        ? r
                        : ((e) => {
                            const {
                              download: t,
                              href: n,
                              hrefLang: s,
                              media: r,
                              ping: a,
                              rel: o,
                              target: i,
                              type: l,
                              referrerPolicy: c,
                              ...u
                            } = e
                            return u
                          })(r)
                  return s.createElement(a, { ...o, ref: n })
                }
                return (t.displayName = `DefaultComponent(${e})`), t
              })(O),
            [O],
          ),
          Z = null != V ? V : Q
        return s.createElement(
          Z,
          {
            ...q,
            id: t,
            role: n,
            className: r(c, A.item, v && A.withIcon, {
              [A.isActive]: D,
              [A.isDisabled]: b || C,
              [A.hovered]: y,
            }),
            title: h,
            href: _,
            target: S,
            rel: k,
            reference: (e) => {
              ;(U.current = e), 'function' == typeof R && R(e)
              'object' == typeof R && (R.current = e)
            },
            onClick: (e) => {
              if (b) return
              W && (0, a.trackEvent)(W.category, W.event, W.label)
              $ && $(K, e)
              B || (0, o.globalCloseMenu)()
            },
            onContextMenu: (e) => {
              W &&
                J &&
                (0, a.trackEvent)(W.category, W.event, `${W.label}_rightClick`)
            },
            onMouseUp: (e) => {
              if (1 === e.button && _ && W) {
                let e = W.label
                j && (e += '_mouseWheelClick'),
                  (0, a.trackEvent)(W.category, W.event, e)
              }
            },
            onMouseOver: T,
            onMouseOut: x,
            onKeyDown: I,
            tabIndex: Y,
          },
          H &&
            s.createElement(i.CircleLogo, {
              ...L,
              className: l['disclosure-item-circle-logo'],
              size: 'xxxsmall',
              logoUrl: H.logoUrl,
              placeholderLetter: H.placeholderLetter,
            }),
          v &&
            s.createElement('span', {
              'aria-label': L && L['aria-label'],
              'aria-hidden': L && Boolean(L['aria-hidden']),
              className: r(A.icon, z && l['round-icon'], w),
              dangerouslySetInnerHTML: { __html: v },
            }),
          s.createElement(
            'span',
            { className: r(A.labelRow, d) },
            s.createElement('span', { className: r(A.label, p) }, E),
          ),
          (void 0 !== g || f) &&
            s.createElement(
              'span',
              { className: A.shortcut },
              (X = g) && X.split('+').join(' + '),
            ),
          void 0 !== N &&
            s.createElement(
              'span',
              {
                onClick: P ? u : void 0,
                className: r(m, A.toolbox, {
                  [A.showOnHover]: F,
                  [A.showOnFocus]: M,
                }),
              },
              N,
            ),
        )
        var X
      }
    },
    20520: (e, t, n) => {
      n.d(t, { PopupMenu: () => d })
      var s = n(50959),
        r = n(962),
        a = n(62942),
        o = n(42842),
        i = n(27317),
        l = n(29197)
      const c = s.createContext(void 0)
      var u = n(36383)
      const h = s.createContext({ setMenuMaxWidth: !1 })
      function d(e) {
        const {
            controller: t,
            children: n,
            isOpened: d,
            closeOnClickOutside: p = !0,
            doNotCloseOn: m,
            onClickOutside: g,
            onClose: f,
            onKeyboardClose: v,
            'data-name': w = 'popup-menu-container',
            ...D
          } = e,
          b = (0, s.useContext)(l.CloseDelegateContext),
          y = s.useContext(h),
          C = (0, s.useContext)(c),
          E = (0, u.useOutsideEvent)({
            handler: (e) => {
              g && g(e)
              if (!p) return
              const t = (0, a.default)(m) ? m() : null == m ? [] : [m]
              if (t.length > 0 && e.target instanceof Node)
                for (const n of t) {
                  const t = r.findDOMNode(n)
                  if (t instanceof Node && t.contains(e.target)) return
                }
              f()
            },
            mouseDown: !0,
            touchStart: !0,
          })
        return d
          ? s.createElement(
              o.Portal,
              {
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                pointerEvents: 'none',
              },
              s.createElement(
                'span',
                { ref: E, style: { pointerEvents: 'auto' } },
                s.createElement(
                  i.Menu,
                  {
                    ...D,
                    onClose: f,
                    onKeyboardClose: v,
                    onScroll: (t) => {
                      const { onScroll: n } = e
                      n && n(t)
                    },
                    customCloseDelegate: b,
                    customRemeasureDelegate: C,
                    ref: t,
                    'data-name': w,
                    limitMaxWidth: y.setMenuMaxWidth,
                  },
                  n,
                ),
              ),
            )
          : null
      }
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
    16658: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" fill-rule="evenodd" d="M9 16A7 7 0 1 0 9 2a7 7 0 0 0 0 14Zm0 1A8 8 0 1 0 9 1a8 8 0 0 0 0 16ZM8 5a1 1 0 0 1 2 0v4a1 1 0 1 1-2 0V5Zm1 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></svg>'
    },
    95096: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" width="17" height="17"><path fill="currentColor" d="M1 8.5a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0zM8.5 0a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM9 9V3H8v5H5v1h4z"/></svg>'
    },
  },
])
