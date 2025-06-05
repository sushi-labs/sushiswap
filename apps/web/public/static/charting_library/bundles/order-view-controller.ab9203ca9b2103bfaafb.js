;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [660],
  {
    895318: (e, t, i) => {
      i.d(t, {
        OrderTicketSettingsProvider: () => l,
        SettingsContext: () => a,
        defaultCryptoBracketsSettings: () => n,
        defaultSettings: () => o,
      })
      var s = i(50959),
        r = i(901317)
      const o = {
          showRelativePriceControl: !0,
          showCurrencyRiskInQty: !0,
          showPercentRiskInQty: !0,
          showBracketsInCurrency: !0,
          showBracketsInPercent: !0,
          showOrderPreview: !0,
          showCryptoBracketsInCurrency: !1,
          showCryptoBracketsInPercent: !1,
        },
        n = {
          showCryptoBracketsInCurrency: !1,
          showCryptoBracketsInPercent: !1,
        },
        a = s.createContext(o)
      function l(e) {
        const { children: t, settings: i } = e,
          [o] = (0, r.useWatchedValue)(i)
        return s.createElement(a.Provider, { value: o }, t)
      }
    },
    901317: (e, t, i) => {
      i.d(t, { useWatchedValue: () => r })
      var s = i(50959)
      const r = (e) => {
        const [t, i] = (0, s.useState)(e.value())
        return (
          (0, s.useEffect)(() => {
            const t = (e) => i(e)
            return e.subscribe(t), () => e.unsubscribe(t)
          }, [e]),
          [t, (t) => e.setValue(t)]
        )
      }
    },
    80423: (e, t, i) => {
      i.d(t, { makeObservableFromWatchedValue: () => r })
      var s = i(275734)
      function r(e) {
        return (0, s.fromEventPattern)(
          (t) => e.subscribe(t, { callWithLast: !0 }),
          (t) => e.unsubscribe(t),
        )
      }
    },
    721678: (e, t, i) => {
      i.r(t), i.d(t, { OrderViewController: () => Vt })
      var s = i(870122),
        r = i(650151),
        o = i(6835),
        n = i(156963),
        a = i(650802),
        l = i(637401),
        u = i(609838),
        d = i(46130),
        c = i(914314),
        h = i(312694),
        p = i(757604),
        _ = i(173587),
        b = i(997345),
        y = i(947488),
        g = i(275734),
        v = i(265728),
        P = i(737538),
        m = i(815544),
        k = i(771035)
      var f = { connector: () => new P.Subject(), resetOnDisconnect: !0 }
      function C(e, t) {
        void 0 === t && (t = f)
        var i = null,
          s = t.connector,
          r = t.resetOnDisconnect,
          o = void 0 === r || r,
          n = s(),
          a = new m.Observable((e) => n.subscribe(e))
        return (
          (a.connect = () => {
            var t
            return (
              (i && !i.closed) ||
                ((i = ((t = () => e),
                new m.Observable((e) => {
                  ;(0, k.innerFrom)(t()).subscribe(e)
                })).subscribe(n)),
                o && i.add(() => (n = s()))),
              i
            )
          }),
          a
        )
      }
      var S = i(958261),
        M = i(586639),
        $ = i(656846),
        T = i(363111),
        w = i(481330),
        V = i(232192),
        I = i(996038),
        O = i(189904),
        B = i(466052),
        D = i(918114),
        q = i(372605),
        F = i(807107),
        L = i(529719)
      class E {
        constructor({
          displaySymbolName: e,
          symbol: t,
          brokerName: i,
          mode: s,
          status: r,
          parentType: o,
          isExistingOrder: n,
          isTradable: a,
          quotes$: l,
          data: u,
          formatter: d,
          isBats: c = !1,
          informerMessage$: h,
          headerState: p,
          isCancelButtonAlwaysHidden: _ = !1,
        }) {
          ;(this._pinButtonClicked = new B.Delegate()),
            (this._backButtonClicked = new B.Delegate()),
            (this._cancelButtonClicked = new B.Delegate()),
            (this._closeButtonClicked = new B.Delegate()),
            (this._onStatusChanged = () => {
              this._headerState.setCloseFunction(
                this._hasCloseButton() ? () => this.close() : void 0,
              ),
                this._headerState.setBackFunction(
                  this._hasBackButton() ? () => this.back() : void 0,
                ),
                this._headerState.setCancelFunction(
                  this._hasCancelButton() ? () => this.cancel() : void 0,
                ),
                this._headerState.setTitle(this._title()),
                this._headerState.setDescription(this._text())
            }),
            (this._onQuotes = (e) => {
              this._headerState.setHasDelayedQuotes(Boolean(e.isDelayed))
            }),
            (this._headerState = p),
            (this._data = u),
            (this._displaySymbolName = e),
            (this._formatter = d),
            (this._brokerName = i),
            (this._status = r),
            (this._mode = s),
            (this._parentType = o),
            (this._isExistingOrder = n),
            (this._isCancelButtonAlwaysHidden = _),
            this._status.subscribe(this._onStatusChanged),
            this._mode.subscribe(this._onStatusChanged),
            this._headerState.setTitle(this._title()),
            this._headerState.setDescription(this._text()),
            this._headerState.setBackFunction(
              this._hasBackButton() ? () => this.back() : void 0,
            ),
            this._headerState.setCloseFunction(
              this._hasCloseButton() ? () => this.close() : void 0,
            ),
            this._headerState.setCancelFunction(void 0),
            this._headerState.setSymbol(t),
            this._headerState.setHasDelayedQuotes(!1),
            this._headerState.setHasBatsQuotes(c),
            this._headerState.setIsTradable(a),
            (this._informerMessageSubscription =
              null == h
                ? void 0
                : h.subscribe((e) => this._headerState.setInformerMessage(e))),
            l && (this._quotesSubscription = l.subscribe(this._onQuotes))
        }
        unsubscribe() {
          var e, t
          this._mode.unsubscribe(this._onStatusChanged),
            this._status.unsubscribe(this._onStatusChanged),
            null === (e = this._quotesSubscription) ||
              void 0 === e ||
              e.unsubscribe(),
            null === (t = this._informerMessageSubscription) ||
              void 0 === t ||
              t.unsubscribe()
        }
        showCancelButton() {
          this._isCancelButtonAlwaysHidden ||
            this._headerState.setCancelFunction(() => this.cancel())
        }
        hideCancelButton() {
          this._isCancelButtonAlwaysHidden ||
            this._headerState.setCancelFunction(void 0)
        }
        back() {
          this._backButtonClicked.fire()
        }
        pin() {
          this._pinButtonClicked.fire()
        }
        cancel() {
          this._cancelButtonClicked.fire()
        }
        close() {
          this._closeButtonClicked.fire()
        }
        pinButtonClicked() {
          return this._pinButtonClicked
        }
        backButtonClicked() {
          return this._backButtonClicked
        }
        cancelButtonClicked() {
          return this._cancelButtonClicked
        }
        closeButtonClicked() {
          return this._closeButtonClicked
        }
        _hasBackButton() {
          return (
            this._mode.value() === T.OrderEditorDisplayMode.Panel &&
            (this._isExistingOrder ||
              1 !== this._parentType ||
              this._status.value() === T.OrderPanelStatus.Preview)
          )
        }
        _hasCancelButton() {
          return (
            !this._isCancelButtonAlwaysHidden &&
            this._mode.value() === T.OrderEditorDisplayMode.Panel &&
            this._status.value() === T.OrderPanelStatus.Active &&
            !this._isExistingOrder &&
            1 === this._parentType
          )
        }
        _hasCloseButton() {
          return n.enabled('order_panel_close_button')
        }
        _title() {
          return this._status.value() === T.OrderPanelStatus.Preview
            ? u.t(null, void 0, i(147380))
            : this._displaySymbolName
        }
        _text() {
          if (this._status.value() !== T.OrderPanelStatus.Preview) {
            if (
              !this._isExistingOrder ||
              void 0 === this._data ||
              void 0 === this._formatter
            )
              return this._brokerName || void 0
            if (1 === this._parentType)
              return u.t(null, void 0, i(35387)) + ' ' + this._data.id
            if (2 === this._parentType || 3 === this._parentType) {
              const e = this._data.side,
                t = this._data.qty,
                s = this._formatter.format(
                  this._data.price ||
                    this._data.avgPrice ||
                    this._data.limitPrice,
                )
              return (
                (1 === e
                  ? u.t(null, void 0, i(273064))
                  : u.t(null, void 0, i(777851))) +
                ' ' +
                t +
                ' @ ' +
                s
              )
            }
          }
        }
      }
      var R = i(446685),
        x = ((e) => {
          function t(t, i) {
            return e.call(this) || this
          }
          return (
            (0, R.__extends)(t, e),
            (t.prototype.schedule = function (e, t) {
              return void 0 === t && (t = 0), this
            }),
            t
          )
        })(i(303448).Subscription),
        A = {
          setInterval: () => {
            for (var e = [], t = 0; t < arguments.length; t++)
              e[t] = arguments[t]
            var i = A.delegate
            return ((null == i ? void 0 : i.setInterval) || setInterval).apply(
              void 0,
              (0, R.__spreadArray)([], (0, R.__read)(e), !1),
            )
          },
          clearInterval: (e) => {
            var t = A.delegate
            return ((null == t ? void 0 : t.clearInterval) || clearInterval)(e)
          },
          delegate: void 0,
        },
        N = i(3955),
        Q = ((e) => {
          function t(t, i) {
            var s = e.call(this, t, i) || this
            return (s.scheduler = t), (s.work = i), (s.pending = !1), s
          }
          return (
            (0, R.__extends)(t, e),
            (t.prototype.schedule = function (e, t) {
              if ((void 0 === t && (t = 0), this.closed)) return this
              this.state = e
              var i = this.id,
                s = this.scheduler
              return (
                null != i && (this.id = this.recycleAsyncId(s, i, t)),
                (this.pending = !0),
                (this.delay = t),
                (this.id = this.id || this.requestAsyncId(s, this.id, t)),
                this
              )
            }),
            (t.prototype.requestAsyncId = function (e, t, i) {
              return (
                void 0 === i && (i = 0), A.setInterval(e.flush.bind(e, this), i)
              )
            }),
            (t.prototype.recycleAsyncId = function (e, t, i) {
              if (
                (void 0 === i && (i = 0),
                null != i && this.delay === i && !1 === this.pending)
              )
                return t
              A.clearInterval(t)
            }),
            (t.prototype.execute = function (e, t) {
              if (this.closed) return new Error('executing a cancelled action')
              this.pending = !1
              var i = this._execute(e, t)
              if (i) return i
              !1 === this.pending &&
                null != this.id &&
                (this.id = this.recycleAsyncId(this.scheduler, this.id, null))
            }),
            (t.prototype._execute = function (e, t) {
              var i,
                s = !1
              try {
                this.work(e)
              } catch (e) {
                ;(s = !0),
                  (i = e || new Error('Scheduled action threw falsy error'))
              }
              if (s) return this.unsubscribe(), i
            }),
            (t.prototype.unsubscribe = function () {
              if (!this.closed) {
                var t = this.id,
                  i = this.scheduler,
                  s = i.actions
                ;(this.work = this.state = this.scheduler = null),
                  (this.pending = !1),
                  (0, N.arrRemove)(s, this),
                  null != t && (this.id = this.recycleAsyncId(i, t, null)),
                  (this.delay = null),
                  e.prototype.unsubscribe.call(this)
              }
            }),
            t
          )
        })(x),
        W = i(712813),
        j = (() => {
          function e(t, i) {
            void 0 === i && (i = e.now),
              (this.schedulerActionCtor = t),
              (this.now = i)
          }
          return (
            (e.prototype.schedule = function (e, t, i) {
              return (
                void 0 === t && (t = 0),
                new this.schedulerActionCtor(this, e).schedule(i, t)
              )
            }),
            (e.now = W.dateTimestampProvider.now),
            e
          )
        })(),
        z = new (((e) => {
          function t(t, i) {
            void 0 === i && (i = j.now)
            var s = e.call(this, t, i) || this
            return (
              (s.actions = []), (s._active = !1), (s._scheduled = void 0), s
            )
          }
          return (
            (0, R.__extends)(t, e),
            (t.prototype.flush = function (e) {
              var t = this.actions
              if (this._active) t.push(e)
              else {
                var i
                this._active = !0
                do {
                  if ((i = e.execute(e.state, e.delay))) break
                } while ((e = t.shift()))
                if (((this._active = !1), i)) {
                  while ((e = t.shift())) e.unsubscribe()
                  throw i
                }
              }
            }),
            t
          )
        })(j))(Q),
        U = z,
        H = i(116217),
        G = i(138966),
        K = { leading: !0, trailing: !1 }
      var J = i(337160)
      function Y(e, t, i) {
        void 0 === e && (e = 0), void 0 === i && (i = U)
        var s = -1
        return (
          null != t && ((0, J.isScheduler)(t) ? (i = t) : (s = t)),
          new m.Observable((t) => {
            var r,
              o = (r = e) instanceof Date && !isNaN(r) ? +e - i.now() : e
            o < 0 && (o = 0)
            var n = 0
            return i.schedule(function () {
              t.closed ||
                (t.next(n++), 0 <= s ? this.schedule(void 0, s) : t.complete())
            }, o)
          })
        )
      }
      function X(e, t, i) {
        void 0 === t && (t = z), void 0 === i && (i = K)
        var s,
          r,
          o,
          n,
          a,
          l = Y(e, t)
        return (
          (s = () => l),
          (n = (o = void 0 === (r = i) ? K : r).leading),
          (a = o.trailing),
          (0, H.operate)((e, t) => {
            var i = !1,
              r = null,
              o = null,
              l = !1,
              u = () => {
                null == o || o.unsubscribe(),
                  (o = null),
                  a && (h(), l && t.complete())
              },
              d = () => {
                ;(o = null), l && t.complete()
              },
              c = (e) =>
                (o = (0, k.innerFrom)(s(e)).subscribe(
                  new G.OperatorSubscriber(t, u, d),
                )),
              h = () => {
                if (i) {
                  i = !1
                  var e = r
                  ;(r = null), t.next(e), !l && c(e)
                }
              }
            e.subscribe(
              new G.OperatorSubscriber(
                t,
                (e) => {
                  ;(i = !0), (r = e), (!o || o.closed) && (n ? h() : c(e))
                },
                () => {
                  ;(l = !0), (!(a && i && o) || o.closed) && t.complete()
                },
              ),
            )
          })
        )
      }
      class Z {
        constructor({
          initialSide: e,
          quotes$: t,
          priceFormatter: i,
          spreadFormatter: s,
          status: r,
          baseCurrency: o,
        }) {
          ;(this.baseCurrency = null),
            (this.onControlFocused = new B.Delegate()),
            (this._formattedQuotes$ = new y.BehaviorSubject({
              ask: ' ',
              bid: ' ',
            })),
            (this._restrictionTypes$ = new y.BehaviorSubject([])),
            (this._quotes = { ask: 0, bid: 0 }),
            (this._waitQuotesTimeout = void 0),
            (this._subscriptions = []),
            (this.getValue = () => this._value$.getValue()),
            (this.setValue = (e) => {
              this._value$.next(e)
            }),
            (this.getFormattedQuotes = () => this._formattedQuotes$.getValue()),
            (this.currentQuotes = () => this._quotes),
            (this.getRestrictionTypes = () =>
              this._restrictionTypes$.getValue()),
            (this._value$ = new y.BehaviorSubject(e)),
            (this.value$ = this._value$.asObservable()),
            (this.formattedQuotes$ = this._formattedQuotes$.asObservable()),
            (this.restrictionTypes$ = this._restrictionTypes$.asObservable()),
            (this.baseCurrency = o),
            (this.status = r),
            (this._quotes$ = t),
            (this._priceFormatter = i),
            (this._spreadFormatter = s)
        }
        subscribe() {
          this._waitQuotesTimeout = setTimeout(() => {
            this._formattedQuotes$.next({}), (this._quotes = {})
          }, 5e3)
          const e = this._quotes$.subscribe((e) => {
              this._formattedQuotes$.next(this._generateText(e)),
                (this._quotes = e),
                clearTimeout(this._waitQuotesTimeout)
            }),
            t = this._quotes$
              .pipe(X(2e3, z, { leading: !0, trailing: !0 }))
              .subscribe((e) => {
                this._restrictionTypes$.next(this._generateRestrictionTypes(e))
              })
          return (this._subscriptions = [e, t]), this._subscriptions
        }
        unsubscribe() {
          this._subscriptions.forEach((e) => e.unsubscribe()),
            clearTimeout(this._waitQuotesTimeout)
        }
        _generateText(e) {
          const t = {},
            i = (0, w.getAsk)(e),
            s = (0, w.getBid)(e)
          return (
            (t.ask = this._priceFormatter.format(i)),
            (t.bid = this._priceFormatter.format(s)),
            (t.spread = (0, q.isNumber)(e.spread)
              ? this._spreadFormatter.format(e.spread)
              : this._priceFormatter.format(i - s)),
            t
          )
        }
        _generateRestrictionTypes(e) {
          const t = []
          return (
            e.isHalted && t.push($.RestrictionType.Halted),
            e.isHardToBorrow && t.push($.RestrictionType.HardToBorrow),
            e.isNotShortable && t.push($.RestrictionType.NotShortable),
            t
          )
        }
      }
      var ee = i(960521),
        te = i.n(ee),
        ie = i(346502),
        se = i(218286),
        re = i(472484),
        oe = i(177441),
        ne = i(595940)
      function ae() {
        for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t]
        var i = (0, ne.popResultSelector)(e)
        return (0, H.operate)((t, s) => {
          for (
            var r = e.length,
              o = new Array(r),
              n = e.map(() => !1),
              a = !1,
              l = (t) => {
                ;(0, k.innerFrom)(e[t]).subscribe(
                  new G.OperatorSubscriber(
                    s,
                    (e) => {
                      ;(o[t] = e),
                        a ||
                          n[t] ||
                          ((n[t] = !0),
                          (a = n.every(re.identity)) && (n = null))
                    },
                    oe.noop,
                  ),
                )
              },
              u = 0;
            u < r;
            u++
          )
            l(u)
          t.subscribe(
            new G.OperatorSubscriber(s, (e) => {
              if (a) {
                var t = (0, R.__spreadArray)([e], (0, R.__read)(o), !1)
                s.next(
                  i
                    ? i.apply(
                        void 0,
                        (0, R.__spreadArray)([], (0, R.__read)(t), !1),
                      )
                    : t,
                )
              }
            }),
          )
        })
      }
      var le = i(957877)
      const ue = u.t(null, void 0, i(145088))
      function de(e, t, i, s) {
        const r = new ee.Big(t),
          o = r.mul(e).div(100)
        return r.minus(o.mul(i).mul(s)).toNumber()
      }
      class ce {
        constructor({
          priceType: e,
          quotes$: t,
          side$: s,
          info: r,
          status$: o,
          formatter: n,
          orderType$: a,
          settings: d,
          brokerTitle: c,
          orderWidgetStat: h,
          initialPrice: p,
          orderRules: _,
          forceAbsolutePriceUpdate: g,
          stopPriceControlData$: v,
          supportStopOrdersInBothDirections: P,
          supportStopLimitOrdersInBothDirections: m,
          supportStrictCheckingLimitOrderPrice: k,
        }) {
          var f, C
          ;(this.id = (0, O.randomHashN)(6)),
            (this.onControlFocused = new B.Delegate()),
            (this._focusedControl$ = new y.BehaviorSubject(0)),
            (this._priceControlData$ = new y.BehaviorSubject(null)),
            (this._value$ = new y.BehaviorSubject(null)),
            (this._error$ = new y.BehaviorSubject({ res: !1 })),
            (this._controlError$ = new y.BehaviorSubject({ res: !1 })),
            (this._subscriptions = []),
            (this._symbolType = ''),
            (this._priceRules = []),
            (this._stopLimitPercentPriceRuleCheckers = []),
            (this.getError = () => this._error$.getValue()),
            (this.setControlError = (e, t) => {
              this._controlError$.next({ res: e, severity: 'error', msg: t })
            }),
            (this.setAbsolutePrice = (e) => {
              var t
              let i
              if (
                ((i =
                  void 0 !== this.formatter.parse
                    ? this.formatter.parse(e)
                    : { res: !1, error: 'Formatter does not support parse' }),
                !i.res)
              ) {
                const i =
                  null !== (t = this.getPriceControlData()) && void 0 !== t
                    ? t
                    : {
                        index: 0,
                        value: 0,
                        absolutePrice: '',
                        offset: 0,
                        base: 'ask',
                      }
                return void this._setPrice({ ...i, absolutePrice: e })
              }
              const s = i.value,
                r = this._priceToIndex(s)
              let o = 0
              ;(0, S.combineLatest)({
                focusedControl: this._focusedControl$,
                quotes: this.quotes$,
                stopPriceControlData: this._stopPriceControlData$,
                side: this.side$,
                orderType: this.orderType$,
              })
                .pipe((0, ie.take)(1))
                .subscribe((t) => {
                  const {
                      quotes: i,
                      stopPriceControlData: n,
                      side: a,
                      orderType: l,
                    } = t,
                    u = this._getBase(a, l)
                  switch (u) {
                    case 'stop':
                      null !== n && (o = Math.round(r - n.index))
                      break
                    case 'ask':
                      const e = this._priceToIndex((0, w.getAsk)(i))
                      o = Math.round(r - e)
                      break
                    case 'bid':
                      const t = this._priceToIndex((0, w.getBid)(i))
                      o = Math.round(r - t)
                  }
                  this._setPrice({
                    index: r,
                    value: s,
                    absolutePrice: e,
                    offset: o,
                    base: u,
                  })
                })
            }),
            (this.setPriceValue = (e, t = !1) => {
              ;(0, S.combineLatest)({
                focusedControl: this._focusedControl$,
                quotes: this.quotes$,
                stopPriceControlData: this._stopPriceControlData$,
                side: this.side$,
                orderType: this.orderType$,
              })
                .pipe((0, ie.take)(1))
                .subscribe((i) => {
                  const {
                    quotes: s,
                    stopPriceControlData: r,
                    side: o,
                    orderType: n,
                  } = i
                  ;(this._roundToStepRequired() || t) &&
                    (e = (0, l.roundToStepByPriceTypeAndSide)(
                      e,
                      this.getStep(e),
                      this.priceType,
                      o,
                    ))
                  const a = this._priceToIndex(e),
                    u = this._getBase(o, n)
                  let d = 0
                  switch (u) {
                    case 'stop':
                      null !== r && (d = Math.round(a - r.index))
                      break
                    case 'ask':
                      const e = this._priceToIndex((0, w.getAsk)(s))
                      d = Math.round(a - e)
                      break
                    case 'bid':
                      const t = this._priceToIndex((0, w.getBid)(s))
                      d = Math.round(a - t)
                  }
                  this._setPrice({
                    index: a,
                    value: e,
                    absolutePrice: this.formatter.format(e),
                    offset: d,
                    base: u,
                  })
                })
            }),
            (this.setPriceOffset = (e) => {
              ;(0, S.combineLatest)({
                focusedControl: this._focusedControl$,
                quotes: this.quotes$,
                stopPriceControlData: this._stopPriceControlData$,
                side: this.side$,
                orderType: this.orderType$,
              })
                .pipe((0, ie.take)(1))
                .subscribe((t) => {
                  const {
                    quotes: i,
                    stopPriceControlData: s,
                    side: r,
                    orderType: o,
                  } = t
                  let n = 0
                  const a = this._getBase(r, o)
                  switch (a) {
                    case 'stop':
                      null !== s && (n = Math.round(s.index + e))
                      break
                    case 'ask':
                      const t = this._priceToIndex((0, w.getAsk)(i))
                      n = Math.round(t + e)
                      break
                    case 'bid':
                      const r = this._priceToIndex((0, w.getBid)(i))
                      n = Math.round(r + e)
                  }
                  const l = this.indexToPrice(n)
                  this._setPrice({
                    index: n,
                    value: l,
                    absolutePrice: this.formatter.format(l),
                    offset: e,
                    base: a,
                  })
                })
            }),
            (this.forcePriceUpdate = (e) => {
              null !== e &&
                (this.setControlError(!1),
                this.setFocusedControl(0),
                this.setPriceValue(e, !0))
            }),
            (this.getPriceControlData = () =>
              this._priceControlData$.getValue()),
            (this.getPrice = () => {
              var e, t
              return null !==
                (t =
                  null === (e = this.getPriceControlData()) || void 0 === e
                    ? void 0
                    : e.value) && void 0 !== t
                ? t
                : null
            }),
            (this.getValue = () => this._value$.getValue()),
            (this.getFocusedControl = () => this._focusedControl$.getValue()),
            (this.getStep = (e) =>
              void 0 === e
                ? this._minTick
                : (0, w.getPriceStep)({
                    price: e,
                    priceType: this.priceType,
                    minTick: this._minTick,
                    variableMinTickData: this._variableMinTickData,
                    limitPriceStep: this._instrumentInfo.limitPriceStep,
                    stopPriceStep: this._instrumentInfo.stopPriceStep,
                  })),
            (this.setFocusedControl = (e) => {
              this._focusedControl$.next(e)
            }),
            (this._isPriceRules = (e) =>
              'limitPriceDistance' === e.id || 'stopPriceDistance' === e.id),
            (this._updateFocusIfNeeded = () => {
              1 !== this.getFocusedControl() ||
                (!this.isRelativePriceControlHidden &&
                  this._settings.value().showRelativePriceControl) ||
                this.setFocusedControl(0)
            }),
            (this._setPrice = (e) => {
              this._priceControlData$.next(e)
            }),
            (this._setError = (e) => {
              const {
                priceControlData: t,
                quotes: s,
                side: r,
                orderType: o,
                controlError: n,
                status: a,
              } = e
              if (a === T.OrderPanelStatus.Wait)
                return void this._error$.next({ res: !1 })
              if (n.res) return void this._error$.next(n)
              let l = { res: !1 },
                d = { res: !1 }
              if (null === t)
                l = {
                  res: !0,
                  severity: 'error',
                  msg: u.t(null, void 0, i(347957)),
                }
              else {
                const e = this.getStep(t.value)
                if (
                  ((d = this._checkPriceWarning(t.value, s, r)),
                  null !== o && 2 !== o)
                ) {
                  const i = (0, w.getQuotePrice)(s, r)
                  l = (0, le.validatePrice)({
                    price: t.value,
                    askOrBid: i,
                    orderType: o,
                    side: r,
                    isStopPrice: 2 === this.priceType,
                    isForex: 'forex' === this._symbolType,
                    formatter: this.formatter,
                    supportStopOrdersInBothDirections:
                      this.supportStopOrdersInBothDirections,
                    supportStopLimitOrdersInBothDirections:
                      this.supportStopLimitOrdersInBothDirections,
                    supportStrictCheckingLimitOrderPrice:
                      this.supportStrictCheckingLimitOrderPrice,
                    step: e,
                    roundedToStep: this._roundToStepRequired(),
                  })
                  for (const s of this._stopLimitPercentPriceRuleCheckers)
                    if (
                      ((l = s({
                        orderPrice: t.value,
                        currentPrice: i,
                        side: r,
                        orderType: o,
                        priceStep: e,
                        priceType: this.priceType,
                        isStatusEditing: a === T.OrderPanelStatus.Editing,
                      })),
                      l.res)
                    )
                      break
                }
              }
              l.res
                ? this._error$.next(l)
                : d.res
                  ? this._error$.next(d)
                  : this._error$.next({ res: !1 })
            }),
            (this.quotes$ = t),
            (this.side$ = s),
            (this._instrumentInfo = r),
            (this.status$ = o),
            (this.formatter = n),
            (this.orderType$ = a),
            (this.priceType = e),
            (this._settings = d),
            (this._brokerTitle = c),
            (this.orderWidgetStat = h),
            (this.supportStopOrdersInBothDirections = Boolean(P)),
            (this.supportStopLimitOrdersInBothDirections = Boolean(m)),
            (this.supportStrictCheckingLimitOrderPrice = Boolean(k)),
            (this._symbolType = r.type || ''),
            (this._pipSize = r.pipSize),
            (this._minTick = r.minTick || r.pipSize),
            (this._variableMinTickData = r.variableMinTick
              ? (0, F.makeVariableMinTickData)(this._minTick, r.variableMinTick)
              : void 0)
          const $ = this.getStep()
          ;(this.indexToPrice = (0, F.makePriceIndexToPriceConverter)(
            $,
            this._variableMinTickData,
          )),
            (this._priceToIndex = (0, F.makePriceToPriceIndexConverter)(
              $,
              this._variableMinTickData,
            )),
            (this.priceControlData$ = this._priceControlData$.asObservable()),
            (this.value$ = this._value$.asObservable()),
            (this.focusedControl$ = this._focusedControl$.asObservable()),
            (this.error$ = this._error$.pipe((0, se.distinctUntilChanged)())),
            (this._stopPriceControlData$ = (0, S.combineLatest)({
              stopPriceControlData: null != v ? v : (0, M.of)(null),
              orderType: this.orderType$,
            }).pipe(
              (0, b.map)((t) => {
                const { stopPriceControlData: i, orderType: s } = t
                return 1 === e && 4 === s ? i : null
              }),
              (0, se.distinctUntilChanged)(),
            )),
            (this.isRelativePriceControlHidden = this._roundToStepRequired())
          !g &&
            !this.isRelativePriceControlHidden &&
            this._settings.value().showRelativePriceControl &&
            this.setFocusedControl(1),
            (this.modifiedAbsolutePriceControlStat =
              null !== h
                ? () =>
                    h.setPriceControlModifiedProperty(
                      T.PriceSubControlType.Absolute,
                    )
                : () => {}),
            (this.modifiedRelativePriceControlStat =
              null !== h
                ? () =>
                    h.setPriceControlModifiedProperty(
                      T.PriceSubControlType.Relative,
                    )
                : () => {}),
            void 0 !== p && this.setPriceValue(p, !0)
          const I = null != _ ? _ : []
          this._priceRules =
            null !== (f = I.filter(this._isPriceRules)) && void 0 !== f ? f : []
          const D =
              null !== (C = I.filter(V.isStopLimitPercentValidationRule)) &&
              void 0 !== C
                ? C
                : [],
            q =
              1 === this.priceType
                ? V.isLimitPercentValidationRule
                : V.isStopPercentValidationRule
          D.filter(q).forEach((e) => {
            this._stopLimitPercentPriceRuleCheckers.push(
              ((e, t) => {
                let s
                return (r) => {
                  const {
                      orderPrice: o,
                      currentPrice: n,
                      side: a,
                      orderType: d,
                      priceStep: c,
                      priceType: h,
                      isStatusEditing: p,
                    } = r,
                    _ = -1 === a ? 1 : -1,
                    b = 3 === d ? 1 : -1,
                    y = de(e, n, _, b),
                    g = de(t, n, _, b),
                    v = (0, l.roundToStepByPriceTypeAndSide)(y, c, h, a),
                    P = (0, l.roundToStepByPriceTypeAndSide)(g, c, h, a)
                  let m = Math.min(v, P),
                    k = Math.max(v, P)
                  return (
                    p &&
                      (void 0 === s && (s = o),
                      (m = Math.min(m, s)),
                      (k = Math.max(k, s))),
                    o >= m && o <= k
                      ? { res: !1 }
                      : {
                          res: !0,
                          severity: 'error',
                          msg: u
                            .t(null, void 0, i(445944))
                            .replace('{min}', m.toString())
                            .replace('{max}', k.toString()),
                        }
                  )
                }
              })(e.options.min, e.options.max),
            )
          })
        }
        subscribe() {
          this._settings.subscribe(this._updateFocusIfNeeded)
          const e = (0, S.combineLatest)({
              quotes: this.quotes$,
              side: this.side$,
              focusedControl: this.focusedControl$,
              status: this.status$,
            })
              .pipe(ae(this._priceControlData$))
              .subscribe(([e, t]) => {
                const { quotes: i, side: s, focusedControl: r, status: o } = e
                null !== t && o !== T.OrderPanelStatus.Wait
                  ? 0 === r
                    ? this.setAbsolutePrice(t.absolutePrice)
                    : this.setPriceOffset(t.offset)
                  : this.setPriceValue(
                      1 === s ? (0, w.getAsk)(i) : (0, w.getBid)(i),
                      !1,
                    )
              }),
            t = (0, S.combineLatest)({
              priceControlData: this._priceControlData$,
              quotes: this.quotes$,
              side: this.side$,
              orderType: this.orderType$,
              controlError: this._controlError$,
              status: this.status$,
            }).subscribe(this._setError),
            i = (0, S.combineLatest)({
              priceControlData: this._priceControlData$,
              error: this._error$,
            }).subscribe((e) => {
              const { priceControlData: t, error: i } = e
              this._value$.next(
                (i.res && 'error' === i.severity) || null === t
                  ? null
                  : t.value,
              )
            })
          this._subscriptions = [e, t, i]
        }
        unsubscribe() {
          this._settings.unsubscribe(this._updateFocusIfNeeded),
            this._subscriptions.map((e) => e.unsubscribe())
        }
        resetPrice() {
          this.setControlError(!1),
            this.setFocusedControl(
              this._settings.value().showRelativePriceControl &&
                !this.isRelativePriceControlHidden
                ? 1
                : 0,
            ),
            (0, S.combineLatest)([this.quotes$, this.side$])
              .pipe((0, ie.take)(1))
              .subscribe(([e, t]) => {
                this.setPriceValue(
                  1 === t ? (0, w.getAsk)(e) : (0, w.getBid)(e),
                  !1,
                )
              })
        }
        _checkPriceWarning(e, t, i) {
          const s = this._priceRules.find((s) =>
            this._isDistanceRuleViolated(e, t, s, i),
          )
          return s
            ? {
                res: !0,
                severity: s.severity,
                msg: ue.format({ brokerTitle: this._brokerTitle }),
              }
            : { res: !1, msg: void 0 }
        }
        _isDistanceRuleViolated(e, t, i, s) {
          if (
            ('limitPriceDistance' === i.id && 2 === this.priceType) ||
            ('stopPriceDistance' === i.id && 1 === this.priceType)
          )
            return !1
          const r = 1 === s,
            o = (0, w.getQuotePrice)(t, s)
          let n = null
          if (
            (r &&
              'buyDirectionPips' in i.options &&
              (n = i.options.buyDirectionPips),
            !r &&
              'sellDirectionPips' in i.options &&
              (n = i.options.sellDirectionPips),
            null === n)
          )
            return !1
          return Math.abs(o - e) < n * this._pipSize
        }
        _getBase(e, t) {
          return 1 === this.priceType && 4 === t
            ? 'stop'
            : 1 === e
              ? 'ask'
              : 'bid'
        }
        _roundToStepRequired() {
          return (0, w.roundToStepRequired)({
            priceType: this.priceType,
            minTick: this._minTick,
            limitPriceStep: this._instrumentInfo.limitPriceStep,
            stopPriceStep: this._instrumentInfo.stopPriceStep,
          })
        }
      }
      function he(e, t) {
        return (0, w.getLast)(e) || (0, w.getQuotePrice)(e, t) || 0
      }
      class pe {
        constructor({
          stopPriceModel: e,
          limitPriceModel: t,
          orderType$: i,
          side$: s,
          quotes$: r,
        }) {
          ;(this._subscriptions = []),
            (this._calculateLimitModelPrice = (e) => {
              const t = this._stopPriceModel.getPrice()
              if (null === t) return null
              const i = this._limitPriceModel.getStep(t),
                s = 1 === e ? 1 : -1
              return new (te())(i).mul(s).plus(t).toNumber()
            }),
            (this._orderType$ = i),
            (this._side$ = s),
            (this._stopPriceModel = e),
            (this._limitPriceModel = t),
            (this.price$ = (0, S.combineLatest)({
              orderType: i,
              side: s,
              quotes: r,
              stopPrice: e.value$,
              limitPrice: t.value$,
            }).pipe(
              (0, b.map)((e) => {
                const {
                  orderType: t,
                  side: i,
                  quotes: s,
                  stopPrice: r,
                  limitPrice: o,
                } = e
                switch (t) {
                  case 1:
                  case 4:
                    return o || he(s, i)
                  case 3:
                    return r || he(s, i)
                  default:
                    return (0, w.getQuotePrice)(s, i)
                }
              }),
              (0, se.distinctUntilChanged)(),
            ))
        }
        subscribe() {
          const e = this._orderType$
            .pipe(
              (0, H.operate)((e, t) => {
                var i,
                  s = !1
                e.subscribe(
                  new G.OperatorSubscriber(t, (e) => {
                    var r = i
                    ;(i = e), s && t.next([r, e]), (s = !0)
                  }),
                )
              }),
              ae(this._side$),
              (0, b.map)(([e, t]) => {
                const [i, s] = e,
                  r = this._stopPriceModel.getPrice(),
                  o = this._limitPriceModel.getPrice()
                if (1 === s && null !== i && [3, 4].includes(i))
                  this._limitPriceModel.forcePriceUpdate(r)
                else if (3 !== s || 1 !== i) {
                  if (4 === s) {
                    1 === i && this._stopPriceModel.forcePriceUpdate(o)
                    const e = this._calculateLimitModelPrice(t)
                    this._limitPriceModel.forcePriceUpdate(e)
                  }
                } else this._stopPriceModel.forcePriceUpdate(o)
              }),
            )
            .subscribe()
          this._subscriptions.push(e)
        }
        unsubscribe() {
          this._subscriptions.map((e) => e.unsubscribe())
        }
      }
      var _e = i(316230),
        be = i(233064),
        ye = Array.isArray
      function ge(e) {
        return 1 === e.length && ye(e[0]) ? e[0] : e
      }
      var ve = i(423869)
      function Pe() {
        for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t]
        var i = (0, ne.popResultSelector)(e),
          s = ge(e)
        return s.length
          ? new m.Observable((e) => {
              var t = s.map(() => []),
                r = s.map(() => !1)
              e.add(() => {
                t = r = null
              })
              for (
                var o = (o) => {
                    ;(0, k.innerFrom)(s[o]).subscribe(
                      new G.OperatorSubscriber(
                        e,
                        (s) => {
                          if ((t[o].push(s), t.every((e) => e.length))) {
                            var n = t.map((e) => e.shift())
                            e.next(
                              i
                                ? i.apply(
                                    void 0,
                                    (0, R.__spreadArray)(
                                      [],
                                      (0, R.__read)(n),
                                      !1,
                                    ),
                                  )
                                : n,
                            ),
                              t.some((e, t) => !e.length && r[t]) &&
                                e.complete()
                          }
                        },
                        () => {
                          ;(r[o] = !0), !t[o].length && e.complete()
                        },
                      ),
                    )
                  },
                  n = 0;
                !e.closed && n < s.length;
                n++
              )
                o(n)
              return () => {
                t = r = null
              }
            })
          : ve.EMPTY
      }
      var me = i(476007),
        ke = i(99708)
      function fe(e, t, i, s, r) {
        if (!t) return 0
        return $e(
          (0, ee.Big)(e)
            .div(t)
            .div(i)
            .div(r || 1),
          s,
        ).toNumber()
      }
      function Ce(e, t, i, s, r, o) {
        if (!i) return 0
        return $e(
          (0, ee.Big)(e)
            .mul(t)
            .div(i)
            .div(s)
            .div(o || 1)
            .div(100),
          r,
        ).toNumber()
      }
      function Se(e, t, i, s) {
        return (0, ee.Big)(t)
          .mul(i)
          .mul(e)
          .mul(s || 1)
          .toNumber()
      }
      function Me(e, t, i, s, r) {
        return s && e
          ? (0, ee.Big)(t)
              .mul(i)
              .mul(e)
              .mul(r || 1)
              .mul(100)
              .div(s)
              .toNumber()
          : 0
      }
      function $e(e, t) {
        return e.div(t).round(0, 0).mul(t)
      }
      class Te {
        constructor({
          stopLossAvailable$: e,
          stopLossPips$: t,
          equity$: i,
          pipValue$: s,
          settings: o,
          initialQty: n,
          initialInputType: a,
          info: l,
          currency: u,
          orderWidgetStat: d,
          showRiskControls: c,
        }) {
          var h
          ;(this.formatter = new me.SplitThousandsFormatter()),
            (this.riskInCurrencyFormatter = new D.PriceFormatter(100)),
            (this.riskInPercentFormatter = new D.PriceFormatter(100)),
            (this.riskStep = 0.01),
            (this.onControlFocused = new B.Delegate()),
            (this._subscriptions = []),
            (this._value$ = new y.BehaviorSubject(null)),
            (this._focusedControl$ = new y.BehaviorSubject(0)),
            (this._isRiskAvailable$ = new y.BehaviorSubject(!1)),
            (this._error$ = new y.BehaviorSubject({ res: !1 })),
            (this._controlError$ = new y.BehaviorSubject({ res: !1 })),
            (this._convertedValues$ = new v.ReplaySubject(1)),
            (this.setControlError = (e) => {
              this._controlError$.next({ res: e })
            }),
            (this.getInputType = () => this._inputType$.getValue()),
            (this.setInputType = (e) => this._inputType$.next(e)),
            (this.getError = () => this._error$.getValue()),
            (this.getQuantityMetainfo = () =>
              this._quantityMetainfo$.getValue()),
            (this.setConvertedValues = (e) => {
              this._convertedValues$.next(e)
            }),
            (this._updateFocusIfNeeded = (e) => {
              const t = this._focusedControl$.getValue(),
                i = 1 === t && !e.showCurrencyRiskInQty,
                s = 2 === t && !e.showPercentRiskInQty
              ;(i || s) && this.setFocusedControl(0)
            }),
            (this._setQuantity = (e) => {
              this._quantity$.next((0, w.formatValue)(e, this.formatter))
            }),
            (this._setRiskInCurrency = (e) => {
              ;(0, r.ensureDefined)(this._riskInCurrency$).next(
                (0, w.formatValue)(e, this.riskInCurrencyFormatter),
              )
            }),
            (this._setRiskInPercent = (e) => {
              ;(0, r.ensureDefined)(this._riskInPercent$).next(
                (0, w.formatValue)(e, this.riskInPercentFormatter),
              )
            }),
            (this.qty = l.qty),
            (this.units = l.units),
            (this._lotSize = l.lotSize),
            (this.showRiskControls = c),
            (this.currency = u),
            (this._equity$ = i),
            (this._pipValue$ = s),
            (this._stopLossAvailable$ = e),
            (this._stopLossPips$ = t),
            (this._settings = o),
            (this._quantity$ = new y.BehaviorSubject(
              null !== (h = null != n ? n : this.qty.default) && void 0 !== h
                ? h
                : null,
            )),
            (this._inputType$ = new y.BehaviorSubject(a)),
            (this._quantityMetainfo$ = new y.BehaviorSubject(l.qty)),
            (this.value$ = this._value$.asObservable()),
            (this.inputType$ = this._inputType$.asObservable()),
            (this.focusedControl$ = this._focusedControl$.asObservable()),
            (this.error$ = this._error$.asObservable()),
            (this.isRiskAvailable$ = this._isRiskAvailable$.asObservable()),
            (this.quantityMetainfo$ = this._quantityMetainfo$.asObservable())
          ;(this.quantity = {
            value$: this._quantity$.asObservable(),
            getValue: () => this._quantity$.getValue(),
            setValue: this._setQuantity,
            onModifiedCallback: () => {
              if (null !== d)
                return d.setQtyControlModifiedProperty(
                  T.QuantitySubControlType.Units,
                )
            },
            calculatorUsedStat: () =>
              null !== d ? d.setCalculatorUsedProperty() : () => {},
          }),
            (this._riskInCurrency$ = new y.BehaviorSubject(null)),
            (this._riskInPercent$ = new y.BehaviorSubject(null)),
            (this.riskInCurrency = {
              value$: this._riskInCurrency$.asObservable(),
              getValue: () =>
                (0, r.ensureDefined)(this._riskInCurrency$).getValue(),
              setValue: this._setRiskInCurrency,
              onModifiedCallback: () =>
                null !== d
                  ? d.setQtyControlModifiedProperty(
                      T.QuantitySubControlType.RiskInCurrency,
                    )
                  : () => {},
              calculatorUsedStat: () =>
                null !== d ? d.setCalculatorUsedProperty() : () => {},
            }),
            (this.riskInPercent = {
              value$: this._riskInPercent$.asObservable(),
              getValue: () =>
                (0, r.ensureDefined)(this._riskInPercent$).getValue(),
              setValue: this._setRiskInPercent,
              onModifiedCallback: () =>
                null !== d
                  ? d.setQtyControlModifiedProperty(
                      T.QuantitySubControlType.RiskInPercent,
                    )
                  : () => {},
              calculatorUsedStat: () =>
                null !== d ? d.setCalculatorUsedProperty() : () => {},
            }),
            (this._quantityValuesWithFocusedControl$ =
              this._quantityValuesWithFocusedControlObservable())
        }
        subscribe() {
          const e = []
          {
            this._settings.subscribe(this._updateFocusIfNeeded)
            const t = this._stopLossAvailable$.subscribe((e) => {
                this._isRiskAvailable$.next(e), e || this.setFocusedControl(0)
              }),
              i = (0, S.combineLatest)({
                quantityValuesWithFocusedControl: (0, r.ensureDefined)(
                  this._quantityValuesWithFocusedControl$,
                ),
                pipValue: this._pipValue$,
                stopLossPips: this._stopLossPips$,
                equity: this._equity$,
              }).subscribe(
                ({
                  quantityValuesWithFocusedControl: e,
                  pipValue: t,
                  stopLossPips: i,
                  equity: s,
                }) => {
                  const {
                      focusedControl: r,
                      quantity: o,
                      riskInCurrency: n,
                      riskInPercent: a,
                    } = e,
                    {
                      quantity: l,
                      riskInCurrency: u,
                      riskInPercent: d,
                    } = this._calculateQuantityValues({
                      focusedControl: r,
                      pipValue: t,
                      quantity: o,
                      riskInCurrency: n,
                      riskInPercent: a,
                      stopLossPips: i,
                      equity: s,
                    })
                  ;(o === l && n === u && a === d) ||
                    this._setUnfocusedControlsValues(r, l, u, d)
                },
              )
            e.push(t, i)
          }
          const t =
              void 0 !== this._availableQuantityTypeInfos &&
              Object.keys(this._availableQuantityTypeInfos).length > 1
                ? this._convertedValues$.pipe(pluck('units'))
                : this.quantity.value$,
            i = (0, S.combineLatest)({
              units: t,
              controlError: this._controlError$,
              focus: this._focusedControl$,
              inputType: this.inputType$,
              input: this.quantity.value$,
            })
              .pipe((0, se.distinctUntilChanged)(_e.default))
              .subscribe((e) => {
                var t, i
                const {
                    units: s,
                    controlError: r,
                    focus: o,
                    inputType: n,
                    input: a,
                  } = e,
                  l =
                    null ===
                      (i =
                        null === (t = this._availableQuantityTypeInfos) ||
                        void 0 === t
                          ? void 0
                          : t[n]) || void 0 === i
                      ? void 0
                      : i.quantityMetainfo,
                  u = void 0 !== l ? (0, ke.checkQtyError)(l, a, !0) : void 0,
                  d = (0, ke.checkQtyError)(this.qty, s, !0),
                  c = r.res ? r.msg : (null == u ? void 0 : u.msg) || d.msg
                this._error$.next({
                  res: r.res || (null == u ? void 0 : u.res) || d.res,
                  msg: c,
                }),
                  this._value$.next(
                    r.res || (null == u ? void 0 : u.res) || d.res || null === o
                      ? null
                      : s,
                  )
              })
          e.push(i), (this._subscriptions = e)
        }
        unsubscribe() {
          this._subscriptions.map((e) => e.unsubscribe()),
            this._settings.unsubscribe(this._updateFocusIfNeeded)
        }
        getValue() {
          return this._value$.getValue()
        }
        setAvailableQuantityTypeInfos(e) {
          this._availableQuantityTypeInfos = e
        }
        getAvailableQuantityTypeInfos() {
          return this._availableQuantityTypeInfos
        }
        getFocusedControl() {
          return this._focusedControl$.getValue()
        }
        setFocusedControl(e) {
          this._focusedControl$.next(e)
        }
        isRiskAvailable() {
          return this._isRiskAvailable$.getValue()
        }
        _calculateQuantityValues(e) {
          return {
            quantity: (0, w.formatValue)(
              this._calculateQuantity(e),
              this.formatter,
            ),
            riskInCurrency: (0, w.formatValue)(
              this._calculateRiskInCurrency(e),
              this.riskInCurrencyFormatter,
            ),
            riskInPercent: (0, w.formatValue)(
              this._calculateRiskInPercent(e),
              this.riskInPercentFormatter,
            ),
          }
        }
        _setUnfocusedControlsValues(e, t, i, s) {
          0 !== e && this._setQuantity(t),
            1 !== e && this._setRiskInCurrency(i),
            2 !== e && this._setRiskInPercent(s)
        }
        _quantityValuesWithFocusedControlObservable() {
          return this._focusedControl$.pipe(
            (0, be.switchMap)((e) =>
              1 === e
                ? this._riskInCurrencyObservable(e)
                : 2 === e
                  ? this._riskInPercentObservable(e)
                  : this._quantityObservable(e),
            ),
          )
        }
        _quantityObservable(e) {
          return this._quantity$.pipe(
            (0, be.switchMap)((t) =>
              Pe([
                (0, r.ensureDefined)(this._riskInCurrency$),
                (0, r.ensureDefined)(this._riskInPercent$),
              ]).pipe(
                (0, b.map)((i) => {
                  const [s, r] = i
                  return {
                    focusedControl: e,
                    quantity: t,
                    riskInCurrency: s,
                    riskInPercent: r,
                  }
                }),
              ),
            ),
          )
        }
        _riskInCurrencyObservable(e) {
          return (0, r.ensureDefined)(this._riskInCurrency$).pipe(
            (0, be.switchMap)((t) =>
              Pe([
                this._quantity$,
                (0, r.ensureDefined)(this._riskInPercent$),
              ]).pipe(
                (0, b.map)((i) => {
                  const [s, r] = i
                  return {
                    focusedControl: e,
                    quantity: s,
                    riskInCurrency: t,
                    riskInPercent: r,
                  }
                }),
              ),
            ),
          )
        }
        _riskInPercentObservable(e) {
          return (0, r.ensureDefined)(this._riskInPercent$).pipe(
            (0, be.switchMap)((t) =>
              Pe([
                this._quantity$,
                (0, r.ensureDefined)(this._riskInCurrency$),
              ]).pipe(
                (0, b.map)((i) => {
                  const [s, r] = i
                  return {
                    focusedControl: e,
                    quantity: s,
                    riskInCurrency: r,
                    riskInPercent: t,
                  }
                }),
              ),
            ),
          )
        }
        _calculateQuantity(e) {
          const {
            focusedControl: t,
            pipValue: i,
            quantity: s,
            riskInCurrency: r,
            riskInPercent: o,
            stopLossPips: n,
            equity: a,
          } = e
          switch (t) {
            case 0:
            default:
              return s
            case 1:
              return null === r || null === n
                ? null
                : fe(r, n, i, this.qty.step, this._lotSize)
            case 2:
              return null === o || null === n
                ? null
                : Ce(o, a, n, i, this.qty.step, this._lotSize)
          }
        }
        _calculateRiskInCurrency(e) {
          const {
            focusedControl: t,
            pipValue: i,
            quantity: s,
            riskInCurrency: r,
            riskInPercent: o,
            stopLossPips: n,
            equity: a,
          } = e
          switch (t) {
            case 0:
              return null === s || null === n
                ? null
                : Se(s, n, i, this._lotSize)
            case 1:
              return r
            case 2:
              if (null === o || null === n) return null
              return Se(
                Ce(o, a, n, i, this.qty.step, this._lotSize),
                n,
                i,
                this._lotSize,
              )
            default:
              return null === s || null === n ? null : Se(s, n, i)
          }
        }
        _calculateRiskInPercent(e) {
          const {
              focusedControl: t,
              pipValue: i,
              quantity: s,
              riskInCurrency: r,
              riskInPercent: o,
              stopLossPips: n,
              equity: a,
            } = e,
            l = null === n
          switch (t) {
            case 0:
            default:
              return null === s || l ? null : Me(s, n, i, a, this._lotSize)
            case 1:
              if (null === r || l) return null
              return Me(
                fe(r, n, i, this.qty.step, this._lotSize),
                n,
                i,
                a,
                this._lotSize,
              )
            case 2:
              return o
          }
        }
      }
      var we = i(798165),
        Ve = i(814127),
        Ie = i(391664)
      class Oe {
        constructor({
          info: e,
          price$: t,
          baseCurrencyCryptoBalance$: i,
          quoteCurrencyCryptoBalance$: s,
          initialQty: r,
          side$: o,
          sideGetter: n,
          orderWidgetStat: a,
          isExistingOrder: u,
          orderQty: d,
          orderPrice: c,
        }) {
          ;(this.formatter = new Ve.QuantityFormatter()),
            (this.onControlFocused = new B.Delegate()),
            (this._value$ = new y.BehaviorSubject(null)),
            (this._quoteCurrencyQuantity$ = new y.BehaviorSubject(null)),
            (this._error$ = new y.BehaviorSubject({ res: !1 })),
            (this._focusedControl$ = new y.BehaviorSubject(3)),
            (this._controlError$ = new y.BehaviorSubject({ res: !1 })),
            (this._baseCurrencyCryptoBalanceValue$ = new y.BehaviorSubject(
              null,
            )),
            (this._quoteCurrencyCryptoBalanceValue$ = new y.BehaviorSubject(
              null,
            )),
            (this._subscriptions = []),
            (this.setControlError = (e) => {
              this._controlError$.next({ res: e })
            }),
            (this.getFocusedControl = () => this._focusedControl$.getValue()),
            (this.setFocusedControl = (e) => {
              this._focusedControl$.next(e)
            }),
            (this._setBaseCurrencyQuantity = (e) => {
              this._baseCurrencyQuantity$.next(
                (0, w.formatValue)(e, this.formatter),
              )
            }),
            (this._setQuoteCurrencyQuantity = (e) => {
              this._quoteCurrencyQuantity$.next(
                (0, w.formatValue)(e, this.formatter),
              )
            }),
            (this.info = e),
            (this.side$ = o),
            (this.getSide = n),
            (this._price$ = t),
            (this._orderQty = d),
            (this._orderPrice = c),
            (this._isExistingOrder = u),
            (this._baseCurrencyCryptoBalance$ = i),
            (this._quoteCurrencyCryptoBalance$ = s),
            (this._baseCurrencyQuantity$ = new y.BehaviorSubject(
              null !== r ? r : e.qty.default || e.qty.step,
            )),
            (this.value$ = this._value$.asObservable()),
            (this.focusedControl$ = this._focusedControl$.asObservable()),
            (this.error$ = this._error$.asObservable()),
            (this.baseCurrencyCryptoBalanceValue$ =
              this._baseCurrencyCryptoBalanceValue$.asObservable()),
            (this.quoteCurrencyCryptoBalanceValue$ =
              this._quoteCurrencyCryptoBalanceValue$.asObservable()),
            (this.quoteCurrencyUiParams$ = t.pipe(
              (0, b.map)((t) => {
                const i = (0, ee.Big)(t).mul(e.qty.step).toNumber(),
                  s = (0, l.roundUpToPowerOf10)(i),
                  r = (0, ee.Big)(t).mul(e.qty.min).toNumber()
                return { min: (0, Ie.alignToStep)(r, s), step: s }
              }),
            )),
            (this.quantity = {
              value$: this._baseCurrencyQuantity$.asObservable(),
              getValue: () => this._baseCurrencyQuantity$.getValue(),
              setValue: this._setBaseCurrencyQuantity,
              onModifiedCallback:
                null !== a
                  ? () =>
                      a.setQtyControlModifiedProperty(
                        T.QuantitySubControlType.BaseCurrency,
                      )
                  : () => {},
            }),
            (this.quoteCurrencyQuantity = {
              value$: this._quoteCurrencyQuantity$.asObservable(),
              getValue: () => this._quoteCurrencyQuantity$.getValue(),
              setValue: this._setQuoteCurrencyQuantity,
              onModifiedCallback:
                null !== a
                  ? () =>
                      a.setQtyControlModifiedProperty(
                        T.QuantitySubControlType.QuoteCurrency,
                      )
                  : () => {},
            }),
            (this._quantityValuesWithFocusedControl$ =
              this._quantityValuesWithFocusedControlObservable())
        }
        subscribe() {
          null !== this._baseCurrencyCryptoBalance$ &&
            this._subscriptions.push(
              (0, S.combineLatest)([
                this.side$,
                this._baseCurrencyCryptoBalance$,
              ]).subscribe((e) => {
                const [t, i] = e
                this._baseCurrencyCryptoBalanceValue$.next(
                  (0, w.getCryptoBalanceValue)({
                    side: t,
                    balance: i,
                    isExistingOrder: this._isExistingOrder,
                    qty: this._orderQty,
                    orderPrice: this._orderPrice,
                  }),
                )
              }),
            ),
            null !== this._quoteCurrencyCryptoBalance$ &&
              this._subscriptions.push(
                (0, S.combineLatest)([
                  this.side$,
                  this._quoteCurrencyCryptoBalance$,
                ]).subscribe((e) => {
                  const [t, i] = e
                  this._quoteCurrencyCryptoBalanceValue$.next(
                    (0, w.getCryptoBalanceValue)({
                      side: t,
                      balance: i,
                      isExistingOrder: this._isExistingOrder,
                      qty: this._orderQty,
                      orderPrice: this._orderPrice,
                    }),
                  )
                }),
              )
          const e = (0, S.combineLatest)({
              price: this._price$,
              quantityValuesWithFocusedControl:
                this._quantityValuesWithFocusedControl$,
            }).subscribe((e) => {
              const { price: t, quantityValuesWithFocusedControl: i } = e,
                {
                  focusedControl: s,
                  baseCurrencyQuantity: r,
                  quoteCurrencyQuantity: o,
                } = i,
                { baseCurrencyQuantity: n, quoteCurrencyQuantity: a } =
                  this._calculateQuantityValues({
                    focusedControl: s,
                    price: t,
                    baseCurrencyQuantity: r,
                    quoteCurrencyQuantity: o,
                  })
              ;(r === n && o === a) || this._setUnfocusedControlsValues(s, n, a)
            }),
            t = (0, S.combineLatest)({
              baseValue: this._baseCurrencyQuantity$,
              quoteValue: this._quoteCurrencyQuantity$,
              controlError: this._controlError$,
              focus: this._focusedControl$,
              side: this.side$,
              baseBalanceValue: this._baseCurrencyCryptoBalanceValue$,
              quoteBalanceValue: this._quoteCurrencyCryptoBalanceValue$,
            }).subscribe((e) => {
              const {
                  baseValue: t,
                  quoteValue: i,
                  controlError: s,
                  focus: r,
                  side: o,
                  baseBalanceValue: n,
                  quoteBalanceValue: a,
                } = e,
                l = (0, ke.checkQtyError)(this.info.qty, t),
                u = (0, we.validateBalance)({
                  side: o,
                  baseValue: t,
                  baseBalanceValue: n,
                  quoteValue: i,
                  quoteBalanceValue: a,
                })
              this._error$.next({
                res: l.res || u.res || s.res,
                msg: l.msg || u.msg || s.msg,
              }),
                this._value$.next(
                  l.res || u.res || s.res || null === r ? null : t,
                )
            })
          this._subscriptions.push(e, t)
        }
        getError() {
          return this._error$.getValue()
        }
        unsubscribe() {
          this._subscriptions.forEach((e) => e && e.unsubscribe())
        }
        getValue() {
          return this._value$.getValue()
        }
        _quantityValuesWithFocusedControlObservable() {
          return this._focusedControl$.pipe(
            (0, be.switchMap)((e) => {
              const t = 3 === e,
                i = t
                  ? this._baseCurrencyQuantity$
                  : this._quoteCurrencyQuantity$,
                s = t
                  ? this._quoteCurrencyQuantity$
                  : this._baseCurrencyQuantity$
              return i.pipe(
                (0, be.switchMap)((i) =>
                  s.pipe(
                    (0, b.map)((s) => ({
                      focusedControl: e,
                      baseCurrencyQuantity: t ? i : s,
                      quoteCurrencyQuantity: t ? s : i,
                    })),
                  ),
                ),
              )
            }),
          )
        }
        _setUnfocusedControlsValues(e, t, i) {
          3 !== e && this._setBaseCurrencyQuantity(t),
            4 !== e && this._setQuoteCurrencyQuantity(i)
        }
        _calculateQuantityValues(e) {
          const {
            focusedControl: t,
            price: i,
            baseCurrencyQuantity: s,
            quoteCurrencyQuantity: r,
          } = e
          let o = s,
            n = r
          switch (t) {
            case 3:
              null !== s && (n = (0, ee.Big)(s).mul(i).toNumber())
              break
            case 4:
              null !== r &&
                (o = (0, ee.Big)(r)
                  .div(i)
                  .div(this.info.qty.step)
                  .round(0, 0)
                  .mul(this.info.qty.step)
                  .toNumber())
          }
          return {
            baseCurrencyQuantity: (0, w.formatValue)(o, this.formatter),
            quoteCurrencyQuantity: (0, w.formatValue)(n, this.formatter),
          }
        }
      }
      var Be = i(346849)
      function De(e, t) {
        let i,
          s = 0,
          r = 0,
          o = !1
        return (...n) => {
          if (
            ((i = () => {
              e(...n), (i = void 0), (o = !1)
            }),
            !o)
          )
            return (
              (r = performance.now()),
              (o = !0),
              void (s = ((e, t) => {
                if (window.requestIdleCallback)
                  return window.requestIdleCallback(e, t)
                const i = Date.now()
                return setTimeout(() => {
                  e({
                    didTimeout: !1,
                    timeRemaining: () => Math.max(0, 50 - (Date.now() - i)),
                  })
                }, 1)
              })(() => (null == i ? void 0 : i()), t))
            )
          void 0 !== (null == t ? void 0 : t.timeout) &&
            performance.now() - r >= t.timeout &&
            (!((e) => {
              if (window.cancelIdleCallback) return window.cancelIdleCallback(e)
              clearTimeout(e)
            })(s),
            i())
        }
      }
      var qe = i(943778)
      class Fe {
        constructor({
          initialPrice: e,
          initialEnabled: t,
          initialBracketType: s,
          formatter: r,
          equity$: o,
          quotes$: n,
          info: a,
          pipValue$: l,
          side$: d,
          amount$: c,
          parentPrice$: h,
          orderType$: p,
          currency: _,
          parentType: g,
          savedPips: v,
          settings: P,
          orderWidgetStat: m,
          showRiskControls: k,
          status: f,
          validationRules: C,
          supportModifyBrackets: M,
          supportModifyTrailingStop: V,
          supportCryptoBrackets: I,
          supportAddBracketsToExistingOrder: O,
          hasTrailingStopBracket: q,
        }) {
          if (
            ((this.isValuesInitialized = !1),
            (this.onControlFocused = new B.Delegate()),
            (this.stopLossTypes = [
              $.BracketType.StopLoss,
              $.BracketType.TrailingStop,
            ]),
            (this.roundToStopLimitPriceStepRequired = !1),
            (this._value$ = new y.BehaviorSubject(null)),
            (this._pips$ = new y.BehaviorSubject(null)),
            (this._price$ = new y.BehaviorSubject(null)),
            (this._riskInCurrency$ = new y.BehaviorSubject(null)),
            (this._riskInPercent$ = new y.BehaviorSubject(null)),
            (this._focusedControl$ = new y.BehaviorSubject(1)),
            (this._error$ = new y.BehaviorSubject({ res: !1 })),
            (this._controlError$ = new y.BehaviorSubject({ res: !1 })),
            (this._subscriptions = []),
            (this._bracketPercentPriceRuleCheckers = []),
            (this.getValue = () => this._value$.getValue()),
            (this.getFocusedControl = () => this._focusedControl$.getValue()),
            (this.getEnabled = () => this._enabled$.getValue()),
            (this.getBracketType = () => this._bracketType$.getValue()),
            (this.getError = () => this._error$.getValue()),
            (this.setFocusedControl = (e) => {
              this._focusedControl$.next(e)
            }),
            (this.setEnabled = (e) => {
              this._enabled$.next(e)
            }),
            (this.setBracketType = (e) => {
              this._bracketType$.next(e)
            }),
            (this.setControlError = (e) => {
              this._controlError$.next({ res: e, msg: void 0 })
            }),
            (this._handleBracketsValuesChange = (e) => {
              const {
                  enabled: t,
                  parentPrice: i,
                  sideSign: s,
                  pipValue: r,
                  equity: o,
                  amount: n,
                  bracketValuesWithFocusedControl: a,
                } = e,
                {
                  focusedControl: l,
                  pips: u,
                  price: d,
                  riskInCurrency: c,
                  riskInPercent: h,
                } = a,
                {
                  pips: p,
                  price: _,
                  riskInCurrency: b,
                  riskInPercent: y,
                } = this._calculateBracketValues({
                  sideSign: s,
                  pipValue: r,
                  equity: o,
                  parentPrice: i,
                  amount: n,
                  focusedControl: l,
                  pips: u,
                  price: d,
                  riskInCurrency: c,
                  riskInPercent: h,
                })
              ;(!t && null !== c) ||
                (u === p && d === _ && c === b && h === y) ||
                this._setUnfocusedControlsValues(l, p, _, b, y)
            }),
            (this._bracketValuesWithFocusedControlObservable = () =>
              this._focusedControl$.pipe(
                (0, be.switchMap)((e) =>
                  1 === e
                    ? this._priceObservable(e)
                    : 2 === e
                      ? this._riskInCurrencyObservable(e)
                      : 3 === e
                        ? this._riskInPercentObservable(e)
                        : this._pipsObservable(e),
                ),
              )),
            (this._updateFocusIfNeeded = (e) => {
              const t = this.getFocusedControl(),
                i = this._supportCryptoBrackets
                  ? 'showCryptoBracketsInPercent'
                  : 'showBracketsInPercent',
                s = this._supportCryptoBrackets
                  ? 'showCryptoBracketsInCurrency'
                  : 'showBracketsInCurrency'
              ;((3 === t && !e[i]) || (2 === t && !e[s])) &&
                this.setFocusedControl(0)
            }),
            (this._getPips = () => this._pips$.getValue()),
            (this._getPrice = () => this._price$.getValue()),
            (this._getRiskInCurrency = () => this._riskInCurrency$.getValue()),
            (this._getRiskInPercent = () => this._riskInPercent$.getValue()),
            (this._setPips = (e) => {
              this._pips$.next((0, w.formatValue)(e, this._pipsFormatter))
            }),
            (this._setPrice = (e) => {
              this._price$.next((0, w.formatValue)(e, this._priceFormatter))
            }),
            (this._setRiskInCurrency = (e) => {
              this._riskInCurrency$.next(
                (0, w.formatValue)(e, this._riskInCurrencyFormatter),
              )
            }),
            (this._setRiskInPercent = (e) => {
              this._riskInPercent$.next(
                (0, w.formatValue)(e, this._riskInPercentFormatter),
              )
            }),
            (this._handleBracketsValuesChange = De(
              this._handleBracketsValuesChange,
              { timeout: 100 },
            )),
            (this._enabled$ = new y.BehaviorSubject(t)),
            (this._bracketType$ = new y.BehaviorSubject(s)),
            (this._equity$ = o),
            (this._pipValue$ = l),
            (this._side$ = d),
            (this._sideSign$ = d.pipe(
              (0, b.map)((e) => (s !== $.BracketType.TakeProfit ? -1 : 1) * e),
            )),
            (this._quotes$ = n),
            (this._amount$ = c),
            (this._pipSize = a.pipSize),
            (this._lotSize = a.lotSize),
            (this._settings = P),
            (this._parentType = g),
            (this._priceType = s === $.BracketType.TakeProfit ? 1 : 2),
            (this._supportCryptoBrackets = Boolean(I)),
            (this._isStatusEditing =
              1 !== g || f === T.OrderPanelStatus.Editing),
            (this._pipsFormatter = new D.PriceFormatter(
              a.pipSize !== a.minTick ? 10 : 1,
            )),
            (this._priceFormatter = r),
            (this._riskInCurrencyFormatter = new D.PriceFormatter(100)),
            (this._riskInPercentFormatter = new D.PriceFormatter(100)),
            (this._priceMagnifier = a.priceMagnifier || 1),
            (this._hasTrailingStopBracket = q),
            (this._parentPrice$ = (0, S.combineLatest)({
              parentPrice: h,
              orderType: p,
              bracketType: this._bracketType$,
              quotes: this._quotes$,
              parentSide: this._side$,
            }).pipe(
              (0, b.map)((e) => {
                const {
                  parentPrice: t,
                  orderType: i,
                  bracketType: s,
                  quotes: r,
                  parentSide: o,
                } = e
                if (s === $.BracketType.TrailingStop) {
                  if (2 === i)
                    return 1 === o ? (0, w.getAsk)(r) : (0, w.getBid)(r)
                  if (1 !== this._parentType)
                    return 1 === o ? (0, w.getBid)(r) : (0, w.getAsk)(r)
                }
                return t
              }),
            )),
            void 0 !== C)
          )
            for (const e of C)
              this._bracketPercentPriceRuleCheckers.push(
                (0, Be.makeBracketPercentPriceRuleChecker)(
                  e.options.min,
                  e.options.max,
                ),
              )
          ;(this._priceStep = (0, w.getPriceStep)({
            priceType: this._priceType,
            minTick: a.minTick || a.pipSize,
            limitPriceStep: a.limitPriceStep,
            stopPriceStep: a.stopPriceStep,
          })),
            (this.roundToStopLimitPriceStepRequired = (0,
            w.roundToStepRequired)({
              priceType: this._priceType,
              minTick: a.minTick || a.pipSize,
              limitPriceStep: a.limitPriceStep,
              stopPriceStep: a.stopPriceStep,
            })),
            (0, S.combineLatest)({
              parentPrice: this._parentPrice$,
              sideSign: this._sideSign$,
              pipValue: this._pipValue$,
              equity: this._equity$,
              amount: this._amount$,
            })
              .pipe((0, ie.take)(1))
              .subscribe((t) => {
                const {
                  parentPrice: i,
                  sideSign: r,
                  pipValue: o,
                  equity: n,
                  amount: a,
                } = t
                let l,
                  u,
                  d = 0
                null !== e
                  ? ((d = 1), (l = null), (u = e))
                  : ((l = null !== v ? v : this._getDefaultPips(s)), (u = null))
                const {
                  pips: c,
                  price: h,
                  riskInCurrency: p,
                  riskInPercent: _,
                } = this._calculateBracketValues({
                  sideSign: r,
                  pipValue: o,
                  equity: n,
                  parentPrice: i,
                  amount: a,
                  focusedControl: d,
                  pips: l,
                  price: u,
                  riskInCurrency: null,
                  riskInPercent: null,
                })
                this.setFocusedControl(d),
                  this._setPips(c),
                  this._setPrice(h),
                  this._setRiskInCurrency(p),
                  this._setRiskInPercent(_),
                  (this.isValuesInitialized = !0)
              }),
            (this._bracketValuesWithFocusedControl$ =
              this._bracketValuesWithFocusedControlObservable()),
            (this.pips = {
              value$: this._pips$.asObservable(),
              step: 1,
              formatter: this._pipsFormatter,
              getValue: this._getPips,
              setValue: this._setPips,
              onModifiedCallback:
                null !== m
                  ? () =>
                      m.setBracketControlModifiedProperty(
                        s,
                        T.BracketSubControlType.Pips,
                      )
                  : () => {},
            }),
            (this.price = {
              value$: this._price$.asObservable(),
              step: this._priceStep,
              formatter: this._priceFormatter,
              getValue: this._getPrice,
              setValue: this._setPrice,
              onModifiedCallback:
                null !== m
                  ? () =>
                      m.setBracketControlModifiedProperty(
                        s,
                        T.BracketSubControlType.Price,
                      )
                  : () => {},
            }),
            (this.riskInCurrency = {
              value$: this._riskInCurrency$.asObservable(),
              step: 0.01,
              formatter: this._riskInCurrencyFormatter,
              getValue: this._getRiskInCurrency,
              setValue: this._setRiskInCurrency,
              onModifiedCallback:
                null !== m
                  ? () =>
                      m.setBracketControlModifiedProperty(
                        s,
                        T.BracketSubControlType.Money,
                      )
                  : () => {},
            }),
            (this.riskInPercent = {
              value$: this._riskInPercent$.asObservable(),
              step: 0.01,
              formatter: this._riskInPercentFormatter,
              getValue: this._getRiskInPercent,
              setValue: this._setRiskInPercent,
              onModifiedCallback:
                null !== m
                  ? () =>
                      m.setBracketControlModifiedProperty(
                        s,
                        T.BracketSubControlType.Percent,
                      )
                  : () => {},
            }),
            (this.value$ = this._value$.asObservable()),
            (this.enabled$ = this._enabled$.asObservable()),
            (this.bracketType$ = this._bracketType$.asObservable()),
            (this.focusedControl$ = this._focusedControl$.asObservable()),
            (this.error$ = this._error$.asObservable()),
            (this.controlState = this._computeControlState(g, s, M, V, O)),
            (this.currency = _.length > 0 ? _ : u.t(null, void 0, i(470500))),
            (this.showRiskControls = k)
        }
        subscribe() {
          this._settings.subscribe(this._updateFocusIfNeeded)
          const e = (0, S.combineLatest)({
              enabled: this._enabled$,
              parentPrice: this._parentPrice$,
              sideSign: this._sideSign$,
              pipValue: this._pipValue$,
              equity: this._equity$,
              amount: this._amount$,
              bracketValuesWithFocusedControl:
                this._bracketValuesWithFocusedControl$,
            }).subscribe(this._handleBracketsValuesChange),
            t = (0, S.combineLatest)({
              side: this._side$,
              enabled: this._enabled$,
              controlError: this._controlError$,
              bracketValuesWithFocusedControl:
                this._bracketValuesWithFocusedControl$,
              parentPrice: this._parentPrice$,
              quotes: this._quotes$,
              bracketType: this._bracketType$,
            }).subscribe((e) => {
              const {
                  side: t,
                  enabled: i,
                  controlError: s,
                  bracketValuesWithFocusedControl: r,
                  parentPrice: o,
                  quotes: n,
                  bracketType: a,
                } = e,
                { focusedControl: l, pips: u, price: d } = r
              i &&
                this._setError({
                  side: t,
                  parentPrice: o,
                  quotes: n,
                  bracketType: a,
                  controlError: s,
                  focusedControl: l,
                  pips: u,
                  price: d,
                })
            }),
            i = (0, S.combineLatest)({
              pips: this._pips$,
              error: this._error$,
              enabled: this._enabled$,
            }).subscribe((e) => {
              const { pips: t, error: i, enabled: s } = e
              this._value$.next(
                i.res || !s || null === t
                  ? null
                  : (0, ee.Big)(t).div(this._priceMagnifier).toNumber(),
              )
            })
          return (this._subscriptions = [e, t, i]), this._subscriptions
        }
        unsubscribe() {
          this._subscriptions.forEach((e) => e.unsubscribe()),
            this._settings.unsubscribe(this._updateFocusIfNeeded)
        }
        isValueIncorrect() {
          const e = this.getEnabled(),
            t = this.getValue()
          return e && null === t
        }
        _getDefaultPips(e) {
          return e === $.BracketType.TakeProfit
            ? T.BracketDefaultPips.TakeProfit
            : T.BracketDefaultPips.StopLoss
        }
        _setUnfocusedControlsValues(e, t, i, s, r) {
          0 !== e && this._setPips(t),
            1 !== e && this._setPrice(i),
            2 !== e && this._setRiskInCurrency(s),
            3 !== e && this._setRiskInPercent(r)
        }
        _setError(e) {
          const {
            side: t,
            parentPrice: i,
            quotes: s,
            bracketType: r,
            controlError: o,
            focusedControl: n,
            pips: a,
            price: l,
          } = e
          o.res
            ? this._error$.next(o)
            : this._error$.next(
                (0, Be.checkBracketError)({
                  quotes: s,
                  side: t,
                  price: l,
                  pips: a,
                  priceType: this._priceType,
                  priceStep: this._priceStep,
                  parentPrice: i,
                  parentType: this._parentType,
                  bracketType: r,
                  isStatusEditing: this._isStatusEditing,
                  isEnabled: this.getEnabled(),
                  bracketPercentPriceRuleCheckers:
                    this._bracketPercentPriceRuleCheckers,
                  priceFormatter: this._priceFormatter,
                  isRoundToPriceStep:
                    this.roundToStopLimitPriceStepRequired && 1 === n,
                }),
              )
        }
        _pipsObservable(e) {
          return this._pips$.pipe(
            (0, be.switchMap)((t) =>
              Pe([
                this._price$,
                this._riskInCurrency$,
                this._riskInPercent$,
              ]).pipe(
                (0, b.map)((i) => {
                  const [s, r, o] = i
                  return {
                    focusedControl: e,
                    pips: t,
                    price: s,
                    riskInCurrency: r,
                    riskInPercent: o,
                  }
                }),
              ),
            ),
          )
        }
        _priceObservable(e) {
          return this._price$.pipe(
            (0, be.switchMap)((t) =>
              Pe([
                this._pips$,
                this._riskInCurrency$,
                this._riskInPercent$,
              ]).pipe(
                (0, b.map)((i) => {
                  const [s, r, o] = i
                  return {
                    focusedControl: e,
                    pips: s,
                    price: t,
                    riskInCurrency: r,
                    riskInPercent: o,
                  }
                }),
              ),
            ),
          )
        }
        _riskInCurrencyObservable(e) {
          return this._riskInCurrency$.pipe(
            (0, be.switchMap)((t) =>
              Pe([this._pips$, this._price$, this._riskInPercent$]).pipe(
                (0, b.map)((i) => {
                  const [s, r, o] = i
                  return {
                    focusedControl: e,
                    pips: s,
                    price: r,
                    riskInCurrency: t,
                    riskInPercent: o,
                  }
                }),
              ),
            ),
          )
        }
        _riskInPercentObservable(e) {
          return this._riskInPercent$.pipe(
            (0, be.switchMap)((t) =>
              Pe([this._pips$, this._price$, this._riskInCurrency$]).pipe(
                (0, b.map)((i) => {
                  const [s, r, o] = i
                  return {
                    focusedControl: e,
                    pips: s,
                    price: r,
                    riskInCurrency: o,
                    riskInPercent: t,
                  }
                }),
              ),
            ),
          )
        }
        _calculateBracketValues(e) {
          return {
            pips: (0, w.formatValue)(
              this._calculatePips(e),
              this._pipsFormatter,
            ),
            price: (0, w.formatValue)(
              this._calculatePrice(e),
              this._priceFormatter,
            ),
            riskInCurrency: (0, w.formatValue)(
              this._calculateRiskInCurrency(e),
              this._riskInCurrencyFormatter,
            ),
            riskInPercent: (0, w.formatValue)(
              this._calculateRiskInPercent(e),
              this._riskInPercentFormatter,
            ),
          }
        }
        _calculatePips(e) {
          const {
            sideSign: t,
            pipValue: i,
            equity: s,
            parentPrice: r,
            amount: o,
            focusedControl: n,
            pips: a,
            price: l,
            riskInCurrency: u,
            riskInPercent: d,
          } = e
          switch (n) {
            case 0:
            default:
              return a
            case 1:
              return null === l
                ? null
                : (0, qe.priceToPips)(l, r, t, this._pipSize)
            case 2:
              return null === u || null === o
                ? null
                : (0, qe.riskInCurrencyToPips)(
                    u,
                    o,
                    i,
                    this._priceMagnifier,
                    this._lotSize,
                  )
            case 3:
              return null === d || null === o
                ? null
                : (0, qe.riskInPercentToPips)(
                    d,
                    o,
                    s,
                    i,
                    this._priceMagnifier,
                    this._lotSize,
                  )
          }
        }
        _calculatePrice(e) {
          const {
            sideSign: t,
            pipValue: i,
            equity: s,
            parentPrice: r,
            amount: o,
            focusedControl: n,
            pips: a,
            price: u,
            riskInCurrency: d,
            riskInPercent: c,
          } = e
          let h, p
          switch (n) {
            case 0:
            default:
              if (null === a) return null
              p = (0, qe.pipsToPrice)(a, r, t, this._pipSize)
              break
            case 1:
              return u
            case 2:
              if (null === d || null === o) return null
              ;(h = (0, qe.riskInCurrencyToPips)(
                d,
                o,
                i,
                this._priceMagnifier,
                this._lotSize,
              )),
                (p = (0, qe.pipsToPrice)(h, r, t, this._pipSize))
              break
            case 3:
              if (null === c || null === o) return null
              ;(h = (0, qe.riskInPercentToPips)(
                c,
                o,
                s,
                i,
                this._priceMagnifier,
                this._lotSize,
              )),
                (p = (0, qe.pipsToPrice)(h, r, t, this._pipSize))
          }
          return this.roundToStopLimitPriceStepRequired
            ? (0, l.roundToStepByPriceTypeAndSide)(
                p,
                this._priceStep,
                this._priceType,
                t,
              )
            : p
        }
        _calculateRiskInCurrency(e) {
          const {
            sideSign: t,
            pipValue: i,
            equity: s,
            parentPrice: r,
            amount: o,
            focusedControl: n,
            pips: a,
            price: l,
            riskInCurrency: u,
            riskInPercent: d,
          } = e
          let c
          const h = null === a || null === o
          switch (n) {
            case 0:
            default:
              return h
                ? null
                : (0, qe.pipsToRiskInCurrency)(
                    a,
                    o,
                    i,
                    this._priceMagnifier,
                    this._lotSize,
                  )
            case 1:
              return null === l || h
                ? null
                : ((c = (0, qe.priceToPips)(l, r, t, this._pipSize)),
                  (0, qe.pipsToRiskInCurrency)(
                    c,
                    o,
                    i,
                    this._priceMagnifier,
                    this._lotSize,
                  ))
            case 2:
              return u
            case 3:
              return null === d || h
                ? null
                : ((c = (0, qe.riskInPercentToPips)(
                    d,
                    o,
                    s,
                    i,
                    this._priceMagnifier,
                    this._lotSize,
                  )),
                  (0, qe.pipsToRiskInCurrency)(
                    c,
                    o,
                    i,
                    this._priceMagnifier,
                    this._lotSize,
                  ))
          }
        }
        _calculateRiskInPercent(e) {
          const {
            sideSign: t,
            pipValue: i,
            equity: s,
            parentPrice: r,
            amount: o,
            focusedControl: n,
            pips: a,
            price: l,
            riskInCurrency: u,
            riskInPercent: d,
          } = e
          let c
          const h = null === a || null === o
          switch (n) {
            case 0:
            default:
              return h
                ? null
                : (0, qe.pipsToRiskInPercent)(
                    a,
                    o,
                    s,
                    i,
                    this._priceMagnifier,
                    this._lotSize,
                  )
            case 1:
              return null === l || h
                ? null
                : ((c = (0, qe.priceToPips)(l, r, t, this._pipSize)),
                  (0, qe.pipsToRiskInPercent)(
                    c,
                    o,
                    s,
                    i,
                    this._priceMagnifier,
                    this._lotSize,
                  ))
            case 2:
              return null === u || null === o
                ? null
                : ((c = (0, qe.riskInCurrencyToPips)(
                    u,
                    o,
                    i,
                    this._priceMagnifier,
                    this._lotSize,
                  )),
                  (0, qe.pipsToRiskInPercent)(
                    c,
                    o,
                    s,
                    i,
                    this._priceMagnifier,
                    this._lotSize,
                  ))
            case 3:
              return d
          }
        }
        _computeControlState(e, t, i, s, r) {
          const o =
              this._isStatusEditing &&
              t === $.BracketType.TrailingStop &&
              !s &&
              this._hasTrailingStopBracket,
            n =
              this._isStatusEditing &&
              t !== $.BracketType.TakeProfit &&
              this.getEnabled() &&
              !s &&
              this._hasTrailingStopBracket,
            a = this._isStatusEditing && !i,
            l = Boolean(
              1 === e && this._isStatusEditing && !this.getEnabled() && !r,
            )
          return {
            inputDisabled: o || a || l,
            labelDisabled: n || a || l,
            checkboxDisabled: a || l,
          }
        }
      }
      function Le(e) {
        return (0, H.operate)((t, i) => {
          ;(0, k.innerFrom)(e).subscribe(
            new G.OperatorSubscriber(i, () => i.complete(), oe.noop),
          ),
            !i.closed && t.subscribe(i)
        })
      }
      var Ee = i(409432)
      class Re {
        constructor({
          initialDuration: e,
          orderType$: t,
          orderWidgetStat: i,
          orderDurations: s,
          symbolDurations: r,
          getOrderType: o,
        }) {
          ;(this.onControlFocused = new B.Delegate()),
            (this._hasError$ = new y.BehaviorSubject(!1)),
            (this._stop$ = new P.Subject()),
            (this.setError = (e) => {
              this._hasError$.next(e)
            }),
            (this.hasError$ = this._hasError$.asObservable()),
            (this.getOrderType = o),
            (this.durationMetaInfoList =
              void 0 !== s
                ? (0, w.filterDurationsBySymbolDurations)(s, r)
                : []),
            (this.orderType$ = t)
          const n = this._getDurationByOrderType(e, o())
          ;(this.$value = new y.BehaviorSubject(n)),
            (this.currentDuration = new Ee.WatchedObject(n, L.comparator)),
            (this._currentDurationSubscription = (0,
            L.makeSubjectFromWatchedValue)(this.currentDuration)),
            this._currentDurationSubscription.subject
              .pipe(Le(this._stop$))
              .subscribe((e) => {
                this.$value.next(e)
              }),
            (this._orderTypeSubscription = this.orderType$
              .pipe(Le(this._stop$))
              .subscribe((e) => {
                const t = this._getDurationByOrderType(this.getValue(), e)
                this.currentDuration.setValue(t)
              })),
            (this.onModifiedCallback =
              null !== i
                ? () => i.setDurationControlModifiedProperty()
                : () => {})
        }
        isDurationsAvailable() {
          return (
            null !==
            this._getDurationByOrderType(
              this.currentDuration.value(),
              this.getOrderType(),
            )
          )
        }
        unsubscribe() {
          this._stop$.next(),
            this._stop$.complete(),
            this._currentDurationSubscription.unsubscribe(),
            this._orderTypeSubscription.unsubscribe()
        }
        getValue() {
          const e = this.$value.getValue()
          if (null === e) return null
          const t = this.durationMetaInfoList.find((t) => e.type === t.value)
          if (void 0 === t) return null
          const i = { type: e.type }
          return (
            (t.hasDatePicker || t.hasTimePicker) && (i.datetime = e.datetime), i
          )
        }
        _getDurationByOrderType(e, t) {
          const i = (0, w.filterDurationsByOrderType)(
            this.durationMetaInfoList,
            t,
          )
          if (0 === i.length) return null
          return null !== e && i.some((t) => e.type === t.value)
            ? e
            : (0, w.makeInitialOrderDuration)(t, i)
        }
      }
      function xe(e, t = 100, i) {
        const s = new Map(),
          r = new Map()
        return function (...o) {
          var n
          const a = String(i ? i.apply(null, o) : o),
            l = Date.now()
          if (
            s.has(a) &&
            (null !== (n = r.get(a)) && void 0 !== n ? n : -1 / 0) > l
          )
            return s.get(a)
          const u = e.apply(this, o)
          return s.set(a, u), r.set(a, l + t), u
        }
      }
      var Ae = i(148442)
      const Ne = (0, o.getLogger)('Trading.LeverageViewModel')
      class Qe {
        constructor({
          adapterLeverageInfo: e,
          adapterSetLeverage: t,
          adapterPreviewLeverage: s,
          brokerName: o,
          symbol: n,
          displaySymbol: a,
          orderType$: d,
          getOrderType: c,
          side$: h,
          initialSide: p,
          customFieldsInputValues$: _,
          customFieldsGetter: b,
          blocked$: g,
          isBlockedGetter: v,
          onBlockedClick: P,
        }) {
          ;(this.onControlFocused = new B.Delegate()),
            (this._leverageInfo$ = new y.BehaviorSubject(null)),
            (this._leveragePreviewResult$ = new y.BehaviorSubject(null)),
            (this._subscription = void 0),
            (this._abortController = new AbortController()),
            (this.leverageInfo = () => this._leverageInfo$.getValue()),
            (this.leveragePreviewResult = () =>
              this._leveragePreviewResult$.getValue()),
            (this.setLeverage = async (e) => {
              try {
                const t = await this._adapterSetLeverage(e),
                  i = this.leverageInfo()
                null !== i &&
                  this._leverageInfo$.next({ ...i, leverage: t.leverage })
              } catch (e) {
                throw (
                  (Ne.logError(
                    `Failed to set leverage: ${(0, l.getLoggerMessage)(e)}`,
                  ),
                  new Error(u.t(null, void 0, i(368662))))
                )
              }
            }),
            (this.previewLeverage = async (e) => {
              try {
                const t = await this._adapterPreviewLeverage(e)
                return this._leveragePreviewResult$.next(t), t
              } catch (e) {
                throw (
                  (this._leveragePreviewResult$.next(null),
                  Ne.logError(
                    `Failed to preview leverage: ${(0, l.getLoggerMessage)(e)}`,
                  ),
                  new Error(u.t(null, void 0, i(575681))))
                )
              }
            }),
            (this._updateLeverageInfo = async (e) => {
              const t = await this.getLeverageInfo({
                symbol: this.symbol,
                orderType: this.orderType,
                side: this.side,
                customFields: this.customFields,
              })
              ;(null == e ? void 0 : e.aborted) || this._leverageInfo$.next(t)
            }),
            (this._customFieldsInputValues$ = _),
            (this._adapterLeverageInfo = e),
            (this._updateLeverageInfo = (0, Ae.respectLatest)(
              this._updateLeverageInfo,
            )),
            (this._adapterSetLeverage = t),
            (this._adapterPreviewLeverage = s),
            (this.symbol = n),
            (this.displaySymbol = a),
            (this._orderType$ = d),
            (this._side$ = h),
            (this.brokerName = o),
            (this.leverageInfo$ = this._leverageInfo$.asObservable()),
            (this.orderType = (0, r.ensureNotNull)(c())),
            (this.side = p),
            (this.customFields = b()),
            (this.blocked$ = g),
            (this.getBlocked = v),
            (this.onBlockedClick = P),
            this._subscribe(),
            (this.getLeverageInfo = xe(this.getLeverageInfo))
        }
        unsubscribe() {
          var e
          null === (e = this._subscription) || void 0 === e || e.unsubscribe()
        }
        async getLeverageInfo(e) {
          try {
            return await this._adapterLeverageInfo(e)
          } catch (e) {
            return (
              Ne.logError(
                `Failed to get leverage info: ${(0, l.getLoggerMessage)(e)}`,
              ),
              null
            )
          }
        }
        _subscribe() {
          this._subscription = (0, S.combineLatest)({
            orderType: this._orderType$,
            side: this._side$,
            customFieldsDependencies: Pe(
              this._customFieldsInputValues$,
              this.blocked$,
            ).pipe((0, b.map)(([e, t]) => ({ customFields: e, blocked: t }))),
          }).subscribe(
            ({ orderType: e, side: t, customFieldsDependencies: i }) => {
              if (
                ((this.orderType = (0, r.ensureNotNull)(e)),
                (this.side = t),
                (this.customFields = i.customFields),
                i.blocked)
              )
                return (
                  this._abortController.abort(),
                  (this._abortController = new AbortController()),
                  void this._leverageInfo$.next(null)
                )
              this._updateLeverageInfo(this._abortController.signal)
            },
          )
        }
      }
      i(336379)
      const We = ' ',
        je = (e, t) =>
          u
            .t(null, void 0, i(896582))
            .format({ qty: e, symbol: t, whitespaceNoBreak: We }),
        ze = (e, t, s) =>
          u
            .t(null, void 0, i(111828))
            .format({ qty: e, symbol: t, stopPrice: s, whitespaceNoBreak: We }),
        Ue = (e, t, s) =>
          u
            .t(null, void 0, i(518088))
            .format({
              qty: e,
              symbol: t,
              limitPrice: s,
              whitespaceNoBreak: We,
            }),
        He = (e, t, s, r) =>
          u
            .t(null, void 0, i(828749))
            .format({
              qty: e,
              symbol: t,
              stopPrice: s,
              limitPrice: r,
              whitespaceNoBreak: We,
            }),
        [Ge, Ke] = u.t(null, void 0, i(134569)).split(/{line_break}/)
      class Je {
        constructor(e, t) {
          ;(this.getValue = () => this._value.getValue()),
            (this.subscribe = () => {
              const e = (0, r.ensureDefined)(this._props)
              if (
                e.existingOrder ||
                this._tradingEntityType === $.TradingEntityType.Position
              )
                return
              const t = {
                status: e.status,
                orderType: e.orderType,
                orderPlacingStatus: e.orderPlacingStatus,
                side: e.side,
                quantity: e.quantity,
                stopPrice: e.stopPrice,
                limitPrice: e.limitPrice,
              }
              this._orderSubscription = (0, S.combineLatest)(t).subscribe(
                this._orderSubscriptionValues,
              )
            }),
            (this.unsubscribe = () => {
              this._orderSubscription && this._orderSubscription.unsubscribe()
            }),
            (this._orderSubscriptionValues = (e) => {
              const t = (0, r.ensureDefined)(this._props),
                {
                  status: s,
                  orderType: o,
                  orderPlacingStatus: n,
                  side: a,
                  quantity: l,
                  stopPrice: d,
                  limitPrice: c,
                } = e
              if (s === T.OrderPanelStatus.Preview)
                return this._value.next({
                  primaryText: u.t(null, void 0, i(68160)),
                })
              if (s === T.OrderPanelStatus.Wait)
                return n === T.OrderPlacingStatus.Placed
                  ? this._value.next({
                      primaryText: u.t(null, void 0, i(862349)),
                    })
                  : this._value.next({ primaryText: Ge, secondaryText: Ke })
              const h = null !== d ? t.formatter.format(d) : '',
                p = null !== c ? t.formatter.format(c) : '',
                _ = null !== l ? t.quantityFormatter.format(l) : '',
                b =
                  1 === a
                    ? u.t(null, void 0, i(618156))
                    : u.t(null, void 0, i(392553))
              switch (o) {
                case 2:
                  return this._value.next({
                    primaryText: b,
                    secondaryText: je(_, t.symbol),
                  })
                case 3:
                  return this._value.next({
                    primaryText: b,
                    secondaryText: ze(_, t.symbol, h),
                  })
                case 1:
                  return this._value.next({
                    primaryText: b,
                    secondaryText: Ue(_, t.symbol, p),
                  })
                case 4:
                  return this._value.next({
                    primaryText: b,
                    secondaryText: He(_, t.symbol, h, p),
                  })
              }
            }),
            (this._tradingEntityType = e),
            (this._value = new y.BehaviorSubject({ primaryText: '' })),
            (this.value$ = this._value.asObservable()),
            (this._props = t),
            this._setInitialValue()
        }
        _setInitialValue() {
          var e
          switch (this._tradingEntityType) {
            case $.TradingEntityType.Order:
              const t =
                !0 ===
                (null === (e = this._props) || void 0 === e
                  ? void 0
                  : e.existingOrder)
                  ? u.t(null, void 0, i(305806))
                  : ''
              this._value.next({ primaryText: t })
              break
            case $.TradingEntityType.Position:
              this._value.next({ primaryText: u.t(null, void 0, i(768527)) })
          }
        }
      }
      class Ye {
        constructor({
          marginAvailable$: e,
          qty$: t,
          currency: i,
          pipValue$: s,
          price$: r,
          side$: o,
          showTotalInsteadOfTradeValue: n,
          showRiskControls: a,
          info: l,
          tpInfo: u,
          slInfo: d,
          supportMargin: c,
          pipValueType$: h,
          leverageInfo$: p,
        }) {
          ;(this._infoTableData$ = new y.BehaviorSubject({ rows: [] })),
            (this._availableMargin$ = new y.BehaviorSubject(0)),
            (this._usedMargin$ = new y.BehaviorSubject(0)),
            (this._leverageInfo = null),
            (this._subscriptions = []),
            (this._tpEnabled$ = null),
            (this._tpRiskInCurrency$ = null),
            (this._tpRiskInPercent$ = null),
            (this._slEnabled$ = null),
            (this._slRiskInCurrency$ = null),
            (this._slRiskInPercent$ = null),
            (this._riskFormatter = new D.PriceFormatter(100)),
            (this.infoTableData$ = this._infoTableData$.asObservable()),
            (this.availableMargin$ = this._availableMargin$.asObservable()),
            (this.usedMargin$ = this._usedMargin$.asObservable()),
            (this._marginAvailable$ = e),
            (this._qty$ = t),
            (this._pipValue$ = s),
            (this._side$ = o),
            (this._type = l.type),
            (this._pipValueType$ = h),
            (this._currency = i),
            (this._marginRate = l.marginRate),
            (this._hasMarginMeter =
              c && (void 0 !== p || void 0 !== this._marginRate)),
            (this._price$ = r),
            (this._showTotalInsteadOfTradeValue = n),
            (this._showRiskControls = a),
            (this._bigPointValue = l.bigPointValue || 1),
            (this._instrumentCurrency = l.currency),
            (this._leverageInfo$ = p),
            (this._leverage = l.leverage),
            (this._lotSize = l.lotSize),
            (this._symbolPipSize = l.pipSize),
            (this._pipValueForCurrentQuantity = 0),
            (this._tradeValueInSymbolCurrency = 0),
            (this._tradeValue = 0),
            (this._priceMagnifier = l.priceMagnifier),
            u &&
              d &&
              ((this._tpEnabled$ = u.enabled),
              (this._tpRiskInCurrency$ = u.riskInCurrency),
              (this._tpRiskInPercent$ = u.riskInPercent),
              (this._slEnabled$ = d.enabled),
              (this._slRiskInCurrency$ = d.riskInCurrency),
              (this._slRiskInPercent$ = d.riskInPercent))
        }
        subscribe() {
          ;(this._subscriptions = [
            (0, S.combineLatest)({
              price: this._price$,
              pipValue: this._pipValue$,
              pipValueType: this._pipValueType$,
              side: this._side$,
              qty: this._qty$,
              leverageInfo:
                void 0 !== this._leverageInfo$
                  ? this._leverageInfo$
                  : (0, M.of)(null),
              tpEnabled:
                null !== this._tpEnabled$ ? this._tpEnabled$ : (0, M.of)(null),
              tpRiskInCurrency:
                null !== this._tpRiskInCurrency$
                  ? this._tpRiskInCurrency$
                  : (0, M.of)(null),
              tpRiskInPercent:
                null !== this._tpRiskInPercent$
                  ? this._tpRiskInPercent$
                  : (0, M.of)(null),
              slEnabled:
                null !== this._slEnabled$ ? this._slEnabled$ : (0, M.of)(null),
              slRiskInCurrency:
                null !== this._slRiskInCurrency$
                  ? this._slRiskInCurrency$
                  : (0, M.of)(null),
              slRiskInPercent:
                null !== this._slRiskInPercent$
                  ? this._slRiskInPercent$
                  : (0, M.of)(null),
            })
              .pipe(X(100, void 0, { trailing: !0, leading: !0 }))
              .subscribe((e) => {
                const {
                  price: t,
                  pipValue: i,
                  pipValueType: s,
                  qty: r,
                  leverageInfo: o,
                  tpEnabled: n,
                  tpRiskInCurrency: a,
                  tpRiskInPercent: l,
                  slEnabled: u,
                  slRiskInCurrency: d,
                  slRiskInPercent: c,
                } = e
                if (
                  ((this._leverageInfo = o),
                  (this._pipValueForCurrentQuantity = (0,
                  L.convertToBaseMonetaryUnit)(
                    (0, L.calculatePipValue)(r, i, this._lotSize),
                    this._priceMagnifier,
                  )),
                  null === r)
                )
                  (this._tradeValue = 0), (this._tradeValueInSymbolCurrency = 0)
                else {
                  const e =
                    'crypto' === this._type
                      ? (0, ee.Big)(r).mul(t).toNumber()
                      : (0, L.calculateTradeValue)(
                          r,
                          t,
                          i,
                          this._symbolPipSize,
                          this._lotSize,
                        )
                  this._tradeValue = (0, L.convertToBaseMonetaryUnit)(
                    e,
                    this._priceMagnifier,
                  )
                  const s = (0, L.calculateTradeValueByBigPointValue)(
                    r,
                    t,
                    this._bigPointValue,
                    this._lotSize,
                  )
                  this._tradeValueInSymbolCurrency = (0,
                  L.convertToBaseMonetaryUnit)(s, this._priceMagnifier)
                }
                const h = []
                h.push(
                  ...this._makeLotSizeInfo(),
                  ...this._makePipValueInfo(s),
                  ...this._makeTradeValueInfo(),
                  ...this._makeRewardInfo(n, a, l),
                  ...this._makeRiskInfo(u, d, c),
                )
                const p = this._getMarginRate()
                null === o && h.unshift(...this._makeLeverageInfo()),
                  this._usedMargin$.next(
                    (0, L.calculateUsedMargin)(this._tradeValue, p),
                  ),
                  this._infoTableData$.next({ rows: h })
              }),
          ]),
            this._hasMarginMeter &&
              this._subscriptions.push(
                (0, r.ensureNotNull)(this._marginAvailable$).subscribe((e) =>
                  this._updateAvailableMargin(e),
                ),
              )
        }
        unsubscribe() {
          this._subscriptions.map((e) => e.unsubscribe())
        }
        title() {
          return u.t(null, void 0, i(163003))
        }
        getOrderInfoTableRowsCount() {
          return this._infoTableData$.getValue().rows.length
        }
        hasMarginMeter() {
          return this._hasMarginMeter
        }
        hasTradeValue() {
          const e = this._getMarginRate()
          return Boolean(
            this._showRiskControls &&
              Number.isFinite(this._tradeValue) &&
              (this._isSymbolTypeSupportTradeValue() || void 0 !== e),
          )
        }
        _getTradeValue() {
          var e
          if (this.hasTradeValue())
            return (0, L.formatInfoValue)(
              this._tradeValue *
                (null !== (e = this._getMarginRate()) && void 0 !== e ? e : 1),
            )
        }
        _updateAvailableMargin(e) {
          this._availableMargin$.next(e)
        }
        _makeLeverageInfo() {
          const e = (0, L.displayedLeverage)(this._leverage, this._marginRate)
          return null === e
            ? []
            : [{ title: u.t(null, void 0, i(956220)), value: e }]
        }
        _makeLotSizeInfo() {
          return 'number' == typeof this._lotSize &&
            Number.isFinite(this._lotSize)
            ? [
                {
                  title: u.t(null, void 0, i(127531)),
                  value: String(this._lotSize),
                },
              ]
            : []
        }
        _makePipValueInfo(e) {
          return this._showRiskControls &&
            e !== $.PipValueType.None &&
            Number.isFinite(this._pipValueForCurrentQuantity)
            ? [
                {
                  title:
                    e === $.PipValueType.Pips
                      ? u.t(null, void 0, i(419489))
                      : u.t(null, void 0, i(696709)),
                  value: `${(0, L.formatInfoValue)(this._pipValueForCurrentQuantity)} ${this._currency}`,
                },
              ]
            : []
        }
        _makeTradeValueInfo() {
          const e = this._getTradeValue()
          if (void 0 === e) return []
          const t = this._showTotalInsteadOfTradeValue
              ? u.t(null, void 0, i(613937))
              : u.t(null, void 0, i(207710)),
            s = this._getTradeValueInSymbolCurrency()
          return void 0 === s
            ? [{ title: t, value: `${e} ${this._currency}` }]
            : [
                { title: t },
                {
                  title: u.t(null, void 0, i(278770)),
                  value: `${e} ${this._currency}`,
                  listMarker: !0,
                },
                {
                  title: u.t(null, void 0, i(689544)),
                  value: `${s} ${this._instrumentCurrency}`,
                  listMarker: !0,
                },
              ]
        }
        _getTradeValueInSymbolCurrency() {
          var e
          const t = null !== (e = this._getMarginRate()) && void 0 !== e ? e : 1
          if (
            void 0 !== this._instrumentCurrency &&
            this._instrumentCurrency !== this._currency &&
            Number.isFinite(this._tradeValueInSymbolCurrency)
          )
            return (0, L.formatInfoValue)(this._tradeValueInSymbolCurrency * t)
        }
        _getMarginRate() {
          return null !== this._leverageInfo
            ? 0 !== this._leverageInfo.leverage
              ? (0, ee.Big)(1).div(this._leverageInfo.leverage).toNumber()
              : void 0
            : void 0 !== this._marginRate && this._marginRate > 0
              ? this._marginRate
              : void 0
        }
        _isSymbolTypeSupportTradeValue() {
          return (
            void 0 !== this._type &&
            ['stock', 'dr', 'right', 'bond', 'warrant', 'structured'].includes(
              this._type,
            )
          )
        }
        _makeRewardInfo(e, t, s) {
          return this._showRiskControls && e && null !== t && null !== s
            ? [
                {
                  title: u.t(null, void 0, i(356979)),
                  value: `${this._riskFormatter.format(s)}% (${this._riskFormatter.format(t)} ${this._currency})`,
                },
              ]
            : []
        }
        _makeRiskInfo(e, t, s) {
          return this._showRiskControls && e && null !== t && null !== s
            ? [
                {
                  title: u.t(null, void 0, i(563833)),
                  value: `${this._riskFormatter.format(s)}% (${this._riskFormatter.format(t)} ${this._currency})`,
                },
              ]
            : []
        }
      }
      const Xe = (0, o.getLogger)('PromiseWithDefault')
      function Ze(e, t, i) {
        return e.catch((e) => (Xe.logError(e), i && i(), t))
      }
      const et = {
        symbol: u.t(null, void 0, i(589053)),
        ask: u.t(null, void 0, i(987300)),
        bid: u.t(null, void 0, i(6205)),
        orderType: u.t(null, void 0, i(158416)),
        side: u.t(null, void 0, i(750441)),
        quantity: u.t(null, void 0, i(766596)),
        price: u.t(null, void 0, i(25684)),
        stopPrice: u.t(null, void 0, i(722028)),
        limitPrice: u.t(null, void 0, i(627262)),
        currency: u.t(null, void 0, i(50985)),
        stopLoss: u.t(null, void 0, i(241648)),
        takeProfit: u.t(null, void 0, i(129266)),
        buy: u.t(null, void 0, i(618156)),
        sell: u.t(null, void 0, i(392553)),
        warning: u.t(null, void 0, i(658028)),
      }
      class tt {
        constructor(e, t, i, s, r, o, n, a) {
          ;(this.warnings = []),
            (this.errors = []),
            (this._infoTableQuotesData = new Ee.WatchedObject(
              { rows: [] },
              L.comparator,
            )),
            (this._infoTableOrderData = { rows: [] }),
            (this._infoTableCustomData = []),
            (this.order = e),
            (this.confirmId = t.confirmId),
            (this.onCancelClick = s),
            (this.onPlaceClick = r),
            (this._quotes$ = i),
            (this._currency = a),
            (this._formatter = o),
            (this._quantityFormatter = n),
            (this._infoTableCustomData = t.sections),
            this._fillQuotesInfo(),
            this._fillOrderInfo(),
            (e.takeProfit || e.stopLoss) && this.warnings.push(et.warning),
            t.warnings && this.warnings.push(...t.warnings),
            t.errors && this.errors.push(...t.errors)
        }
        subscribe() {
          return this._quotes$.subscribe((e) => this._fillQuotesInfo(e))
        }
        infoTableQuotesData() {
          return this._infoTableQuotesData
        }
        infoTableOrderData() {
          return this._infoTableOrderData
        }
        infoTableCustomData() {
          return this._infoTableCustomData
        }
        _fillQuotesInfo(e) {
          const t = [
            { title: et.symbol, value: this.order.symbol },
            { title: et.ask, value: e ? this._formatter.format(e.ask) : '' },
            { title: et.bid, value: e ? this._formatter.format(e.bid) : '' },
          ]
          this._infoTableQuotesData.setValue({ rows: t })
        }
        _fillOrderInfo() {
          this._infoTableOrderData.rows.push(
            {
              title: et.orderType,
              value: this.order.type ? T.orderTypes[this.order.type] : '',
            },
            {
              title: et.side,
              value: 1 === this.order.side ? et.buy : et.sell,
              type: 1 === this.order.side ? 0 : 1,
            },
            {
              title: et.quantity,
              value: this._quantityFormatter.format(this.order.qty),
            },
          ),
            (3 !== this.order.type && 1 !== this.order.type) ||
              this._infoTableOrderData.rows.push({
                title: et.price,
                value: this._formatter.format(
                  3 === this.order.type
                    ? this.order.stopPrice
                    : this.order.limitPrice,
                ),
              }),
            4 === this.order.type &&
              this._infoTableOrderData.rows.push(
                {
                  title: et.stopPrice,
                  value: this._formatter.format(this.order.stopPrice),
                },
                {
                  title: et.limitPrice,
                  value: this._formatter.format(this.order.limitPrice),
                },
              ),
            this.order.stopLoss &&
              this._infoTableOrderData.rows.push({
                title: et.stopLoss,
                value: String(this.order.stopLoss),
              }),
            this.order.takeProfit &&
              this._infoTableOrderData.rows.push({
                title: et.takeProfit,
                value: String(this.order.takeProfit),
              }),
            this._currency.length > 0 &&
              this._infoTableOrderData.rows.push({
                title: et.currency,
                value: this._currency,
              })
        }
      }
      var it = i(80423),
        st = i(73359),
        rt = i(350146)
      const ot = n.enabled('order_panel_undock')
      function nt(e) {
        const {
            pin: t,
            mode: s,
            settings: r,
            currency: o,
            showRelativePriceControl: n,
            showRiskControls: a,
            showQuantityInsteadOfAmount: l,
            supportBrackets: d,
            supportPlaceOrderPreview: c,
            supportModifyOrderPreview: h,
            isUndockAllowed: p,
          } = e,
          _ = (e) => () => r.setValue({ ...r.value(), [e]: !r.value()[e] }),
          y = (e) =>
            (0, it.makeObservableFromWatchedValue)(r).pipe(
              (0, b.map)((t) => !!t[e]),
            ),
          g = []
        if (
          (p &&
            ot &&
            g.push({
              settingType: 1,
              onLabel: u.t(null, void 0, i(515632)),
              offLabel: u.t(null, void 0, i(980280)),
              dataName: 'dock-undock-order-panel-button',
              onIcon: st,
              offIcon: rt,
              onClick: () => t(),
              value$: (0, it.makeObservableFromWatchedValue)(s).pipe(
                (0, b.map)((e) => e === T.OrderEditorDisplayMode.Panel),
              ),
            }),
          n &&
            g.push({
              settingType: 0,
              label: u.t(null, void 0, i(9540)),
              onClick: _('showRelativePriceControl'),
              value$: y('showRelativePriceControl'),
            }),
          a)
        ) {
          {
            const e = l
              ? u.t(null, void 0, i(555198))
              : u.t(null, void 0, i(377562))
            g.push(
              {
                settingType: 0,
                label: e.replace('{units}', o || 'Money'),
                onClick: _('showCurrencyRiskInQty'),
                value$: y('showCurrencyRiskInQty'),
              },
              {
                settingType: 0,
                label: e.replace('{units}', '%'),
                onClick: _('showPercentRiskInQty'),
                value$: y('showPercentRiskInQty'),
              },
            )
          }
          if (d) {
            const e = u.t(null, void 0, i(511327))
            g.push(
              {
                settingType: 0,
                label: e.replace('{units}', o || 'Money'),
                onClick: _('showBracketsInCurrency'),
                value$: y('showBracketsInCurrency'),
              },
              {
                settingType: 0,
                label: e.replace('{units}', '%'),
                onClick: _('showBracketsInPercent'),
                value$: y('showBracketsInPercent'),
              },
            )
          }
        }
        return (
          (c || h) &&
            g.push({
              settingType: 0,
              label: u.t(null, void 0, i(878506)),
              onClick: _('showOrderPreview'),
              value$: y('showOrderPreview'),
            }),
          g
        )
      }
      var at = i(323002)
      class lt {
        constructor({
          existingOrder: e,
          tradingDialogOptions: t,
          initialInputState: i,
        }) {
          ;(this._isEmptyRequiredCustomFieldsHighlighted$ =
            new y.BehaviorSubject(!1)),
            (this._isCustomFieldsNotSelected$ = new y.BehaviorSubject(!1)),
            (this._customFieldsInputValues$ = new y.BehaviorSubject({})),
            (this.getCustomFieldsInputValues = () =>
              this._customFieldsInputValues$.getValue()),
            (this.isCustomFieldsNotSelected$ =
              this._isCustomFieldsNotSelected$.asObservable()),
            (this.customFieldsInputValues$ =
              this._customFieldsInputValues$.asObservable()),
            (this._customFieldModels$ = this._createCustomFieldModelsSubject({
              modifyMode: e,
              existedValues: i,
              tradingDialogOptions: t,
            })),
            (this.onControlFocused$ = this._customFieldModels$.pipe(
              (0, be.switchMap)((e) =>
                (0, at.merge)(
                  ...e.map((e) =>
                    (0, g.fromEventPattern)(
                      (t) => e.onControlFocused.subscribe(null, t),
                      (t) => e.onControlFocused.unsubscribe(null, t),
                    ),
                  ),
                ),
              ),
            )),
            this._subscribe()
        }
        destroy() {
          var e
          null === (e = this._valuesChangeSubscription) ||
            void 0 === e ||
            e.unsubscribe(),
            this._customFieldModels$.getValue().forEach((e) => e.destroy())
        }
        setIsEmptyRequiredCustomFieldsHighlighted(e) {
          this._isEmptyRequiredCustomFieldsHighlighted$.next(e)
        }
        getIsCustomFieldsNotSelected() {
          return this._isCustomFieldsNotSelected$.getValue()
        }
        getCustomFieldsModels() {
          return this._customFieldModels$.getValue()
        }
        _subscribe() {
          this._valuesChangeSubscription =
            this._anyCustomFieldValueChangeObservable().subscribe(() => {
              this._calculateCustomFieldsInputValues(),
                this._checkIsCustomFieldsNotSelected()
            })
        }
        _createCustomFieldModelsSubject(e) {
          return new y.BehaviorSubject(
            (0, L.createCustomFieldModels)({
              ...e,
              alwaysShowAttachedErrors$:
                this._isEmptyRequiredCustomFieldsHighlighted$.asObservable(),
            }),
          )
        }
        _checkIsCustomFieldsNotSelected() {
          const e = this._customFieldModels$
            .getValue()
            .flatMap((e) =>
              'ComboBox' === e.type && void 0 === e.getSelectedItem() ? e : [],
            )
          this._isCustomFieldsNotSelected$.next(0 !== e.length)
        }
        _anyCustomFieldValueChangeObservable() {
          return this._customFieldModels$.pipe(
            (0, be.switchMap)((e) =>
              (0, at.merge)(
                ...e.map((e) =>
                  'TextWithCheckBox' === e.type
                    ? (0, at.merge)(e.checked$, e.text$)
                    : 'Checkbox' === e.type
                      ? e.checked$
                      : 'ComboBox' === e.type
                        ? e.selectedItem$
                        : (0, M.of)(void 0),
                ),
              ),
            ),
          )
        }
        _calculateCustomFieldsInputValues() {
          const e = this._customFieldModels$.getValue(),
            t = this._getCustomFieldsInputValues(e)
          this._customFieldsInputValues$.next(t)
        }
        _getCustomFieldsInputValues(e) {
          const t = {}
          return (
            e.forEach((e) => {
              'TextWithCheckBox' === e.type &&
                (t[e.id] = {
                  text: e.getText().replace(/&quote;/g, '"'),
                  checked: e.getChecked(),
                }),
                'Checkbox' === e.type && (t[e.id] = e.getChecked()),
                'ComboBox' === e.type && (t[e.id] = e.getSelectedItem())
            }),
            t
          )
        }
      }
      const ut = (0, o.getLogger)('Trading.OrderViewModel'),
        dt = ['riskInCurrency', 'riskInPercent']
      class ct {
        constructor({
          adapter: e,
          order: t,
          mode: s,
          settings: r,
          isTradable: o,
          isUndockAllowed: n,
          orderWidgetStat: _ = null,
          pipValueType$: b,
          onNeedSelectBroker: P,
          trackEvent: m,
          toggleTradingWidget: k,
          toggleTradingPanelPopup: f,
          showErrorNotification: S,
          sendHandler: M,
          previewHandler: $,
          orderViewInputState: V,
          forceAbsolutePriceUpdate: I,
          qtySuggester: q,
          isVisible: E,
          orderDialogOptions: R,
          informerMessage$: x,
          warningMessage$: A,
          headerState: N,
          isCancelButtonAlwaysHidden: Q,
        }) {
          var W, j, z
          if (
            ((this.orderInfoModel = null),
            (this.orderPreviewModel = null),
            (this.onDoneButtonClicked = (0, d.createDeferredPromise)()),
            (this.status = new a.WatchedValue(T.OrderPanelStatus.Active)),
            (this.rewardRisk = new a.WatchedValue('')),
            (this.disabled = new a.WatchedValue(!0)),
            (this.loading = new a.WatchedValue(!1)),
            (this.needSignIn = !1),
            (this.noBroker = !1),
            (this.isNoQuotes = new a.WatchedValue(!1)),
            (this.symbolHasLotSize = !1),
            (this.id = (0, O.randomHashN)(6)),
            (this.existingOrder = !1),
            (this._onModeChanged = new B.Delegate()),
            (this._onInputStateChanged = new B.Delegate()),
            (this._onCloseButtonClicked = new B.Delegate()),
            (this._onBackButtonClicked = new B.Delegate()),
            (this._onFocusSubscriptions = []),
            (this._subscriptions = []),
            (this._orderType$ = new y.BehaviorSubject(null)),
            (this._stopLossPips$ = new y.BehaviorSubject(null)),
            (this._orderWidgetStat = null),
            (this._existingPlacedOrder = null),
            (this._marginAvailable$ = null),
            (this._baseCurrencyCryptoBalance$ = null),
            (this._quoteCurrencyCryptoBalance$ = null),
            (this._orderPlacingStatus = new y.BehaviorSubject(
              T.OrderPlacingStatus.Creating,
            )),
            (this._destroyed = !1),
            (this._setSolutionAccount = null),
            (this._isBats = !1),
            (this.doneButtonClick = async () => {
              if (!this.loading.value()) {
                this.loading.setValue(!0)
                try {
                  await this._doneButtonClick()
                } finally {
                  this.loading.setValue(!1)
                }
              }
            }),
            (this.getOrderType = () => this._orderType$.value),
            (this.setOrderType = (e) => {
              this._orderType$.next(e)
            }),
            (this.activateOrderTicket = () => {
              var e
              this.status.setValue(
                this.existingOrder
                  ? T.OrderPanelStatus.Editing
                  : T.OrderPanelStatus.Active,
              ),
                null === (e = this._orderTypeSubscription) ||
                  void 0 === e ||
                  e.unsubscribe(),
                this.sideModel &&
                  this.sideModel.onControlFocused.unsubscribe(
                    this,
                    this.activateOrderTicket,
                  ),
                this.limitPriceModel &&
                  this.limitPriceModel.onControlFocused.unsubscribe(
                    this,
                    this.activateOrderTicket,
                  ),
                this.stopPriceModel &&
                  this.stopPriceModel.onControlFocused.unsubscribe(
                    this,
                    this.activateOrderTicket,
                  ),
                this.quantityModel &&
                  this.quantityModel.onControlFocused.unsubscribe(
                    this,
                    this.activateOrderTicket,
                  ),
                this.leverageModel &&
                  this.leverageModel.onControlFocused.unsubscribe(
                    this,
                    this.activateOrderTicket,
                  ),
                this.takeProfitModel &&
                  this.takeProfitModel.onControlFocused.unsubscribe(
                    this,
                    this.activateOrderTicket,
                  ),
                this.stopLossModel &&
                  this.stopLossModel.onControlFocused.unsubscribe(
                    this,
                    this.activateOrderTicket,
                  ),
                this.durationModel &&
                  this.durationModel.onControlFocused.unsubscribe(
                    this,
                    this.activateOrderTicket,
                  ),
                this._onFocusSubscriptions.forEach((e) => e.unsubscribe()),
                this._orderPlacingStatus.next(T.OrderPlacingStatus.Creating)
            }),
            (this._doneButtonClick = async () => {
              const e = this.preOrder()
              if (
                (this.existingOrder
                  ? this.supportModifyOrderPreview
                  : this.supportPlaceOrderPreview) &&
                this._settings.value().showOrderPreview &&
                null === this.orderPreviewModel
              ) {
                const t =
                  this.supportModifyOrderPreview &&
                  null !== this._existingPlacedOrder
                    ? { ...e, id: this._existingPlacedOrder.id }
                    : e
                try {
                  const e = await this._previewHandler(t),
                    i =
                      this.supportCurrencyInOrderPreview &&
                      void 0 !== this._symbolInfo.currency
                        ? this._symbolInfo.currency
                        : ''
                  ;(this.orderPreviewModel = new tt(
                    t,
                    e,
                    this._quotes$,
                    this._back,
                    this.doneButtonClick,
                    this.formatter,
                    this.quantityModel.formatter,
                    i,
                  )),
                    this._subscriptions.push(
                      this.orderPreviewModel.subscribe(),
                    ),
                    this.status.setValue(T.OrderPanelStatus.Preview)
                } catch (e) {
                  this._isFullscreenPopup() && this.headerModel.close(),
                    this._showErrorNotification(
                      u.t(null, void 0, i(455897)),
                      (0, l.getErrorMessage)(e),
                    )
                }
                return
              }
              ;(await this._doneHandler(
                e,
                null !== this.orderPreviewModel
                  ? this.orderPreviewModel.confirmId
                  : void 0,
              ))
                ? (this.onDoneButtonClicked.resolve(!0),
                  this.mode.value() === T.OrderEditorDisplayMode.Popup
                    ? this.headerModel.close()
                    : this._cancel(),
                  this.existingOrder ||
                    this._orderPlacingStatus.next(T.OrderPlacingStatus.Placed))
                : (this._isFullscreenPopup() && this.headerModel.close(),
                  this.mode.value() === T.OrderEditorDisplayMode.Panel &&
                    null !== this.orderPreviewModel &&
                    1 === this._adapter.connectionStatus() &&
                    this._back()),
                (this.orderPreviewModel = null)
            }),
            (this._noQuotesCallback = () => {
              this._trackEvent('Order Ticket', 'No Quotes')
            }),
            (this._updateMode = () => {
              this.mode.value() === T.OrderEditorDisplayMode.Popup &&
                this.status.value() !== T.OrderPanelStatus.Preview &&
                this.activateOrderTicket(),
                this.toggleCancelButton()
            }),
            (this._handleStatusChange = (e) => {
              const t =
                e !== T.OrderPanelStatus.Preview && this._isTradable
                  ? this._makeHeaderSettings()
                  : void 0
              this._headerState.setSettings(t)
            }),
            (this._mergeInputStateDiff = (e) => {
              void 0 !== e.duration &&
                (this._currentInputState.duration = null),
                (0, c.default)(this._currentInputState, e)
            }),
            (this._back = () => {
              this._cleanUp(), this._onBackButtonClicked.fire()
            }),
            (this._onSuggestedQtyChange = (e) => {
              ;(this._suggestedQty = e),
                !this._isOrderSizeCalculatorAvailable() &&
                  this.quantityModel &&
                  this.quantityModel.getValue() !== e &&
                  (this.quantityModel.setFocusedControl(
                    this.supportCryptoExchangeOrderTicket() ? 3 : 0,
                  ),
                  this.quantityModel.quantity.setValue(e))
            }),
            (this._onQtyChange = (e) => {
              this._isOrderSizeCalculatorAvailable() ||
                null === e ||
                this._qtySuggester.setQty(this.symbol, e)
            }),
            (this._isCancelButtonAlwaysHidden = Q),
            (this._isTradable = o.tradable),
            (this._headerState = N),
            (this.headerStateValue = N),
            this._headerState.setSettings(void 0),
            (this._toggleTradingWidget = k),
            (this._toggleTradingPanelPopup = f),
            (this._onNeedSelectBroker = P),
            (this._showErrorNotification = S),
            (this._trackEvent = m),
            (this._orderWidgetStat = _),
            (this._pipValueType$ = b),
            (this._qtySuggester = q),
            (this._informerMessage$ = x),
            (this.mode = s),
            (this._settings = r),
            ((e) => Object.hasOwn(e, 'id'))(t) &&
              ((this.existingOrder = !0), (this._existingPlacedOrder = t)),
            (this.warningMessage$ = A),
            (this.status = new a.WatchedValue(
              this.existingOrder
                ? T.OrderPanelStatus.Editing
                : T.OrderPanelStatus.Active,
            )),
            (this.symbol = t.symbol),
            (this._orderStatusSubscription = (0, L.makeSubjectFromWatchedValue)(
              this.status,
            )),
            (this._loadingSubscription = (0, L.makeSubjectFromWatchedValue)(
              this.loading,
            )),
            (this._status = this._orderStatusSubscription.subject),
            (this._loading = this._loadingSubscription.subject),
            (this._isUndockAllowed = n),
            (this._isVisible = E),
            (this._stopLossAvailable$ = new y.BehaviorSubject(
              Boolean(t.trailingStopPips ? t.trailingStopPips : t.stopLoss),
            )),
            (this.orderType$ = this._orderType$.asObservable()),
            null === e)
          )
            return void (this.onReady = Promise.resolve())
          if (
            ((this._adapter = e),
            (this.brokerName = e.metainfo().title),
            !o.tradable)
          )
            return void (this.onReady = this._prepareTradableSolution(o))
          ;(this._sendHandler = M),
            (this._previewHandler = $),
            (this._orderTemplate = Object.assign({}, t)),
            (this.existingOrder = Object.hasOwn(t, 'id')),
            this.status.setValue(
              this.existingOrder
                ? T.OrderPanelStatus.Editing
                : T.OrderPanelStatus.Active,
            )
          const U = e.metainfo().configFlags
          ;(this.supportModifyOrderPrice = U.supportModifyOrderPrice),
            (this.supportModifyQuantity =
              !this.existingOrder ||
              Boolean(this.existingOrder && U.supportEditAmount)),
            (this.showQuantityInsteadOfAmount = U.showQuantityInsteadOfAmount),
            (this.supportModifyDuration = U.supportModifyDuration),
            (this.supportLeverage = U.supportLeverage),
            (this.supportLeverageButton =
              U.supportLeverage && U.supportLeverageButton),
            (this.supportPlaceOrderPreview = U.supportPlaceOrderPreview),
            (this.supportModifyOrderPreview = U.supportModifyOrderPreview),
            (this.supportBalances = U.supportBalances),
            (this.supportCryptoBrackets = U.supportCryptoBrackets),
            (this.supportStopOrdersInBothDirections =
              U.supportStopOrdersInBothDirections),
            (this.supportStopLimitOrdersInBothDirections =
              U.supportStopLimitOrdersInBothDirections),
            (this.supportStrictCheckingLimitOrderPrice =
              U.supportStrictCheckingLimitOrderPrice),
            (this.supportCurrencyInOrderPreview =
              U.supportCurrencyInOrderPreview),
            (this.supportModifyOrderType = U.supportModifyOrderType),
            this._orderType$.next(
              null !==
                (z =
                  null !==
                    (j =
                      null !== (W = t.type) && void 0 !== W
                        ? W
                        : null == V
                          ? void 0
                          : V.orderType) && void 0 !== j
                    ? j
                    : (0, w.getDefaultOrderType)(U)) && void 0 !== z
                ? z
                : null,
            ),
            (this.onReady = Promise.all([
              e.symbolInfo(t.symbol),
              e.getSymbolSpecificTradingOptions(t.symbol),
              Ze(e.accountMetainfo(), {
                id: e.currentAccount(),
                name: e.metainfo().title,
              }),
              Ze(e.quotesSnapshot(t.symbol), {}, this._noQuotesCallback),
              Ze(e.formatter(t.symbol, !1), new D.PriceFormatter()),
              Ze(e.spreadFormatter(t.symbol), new D.PriceFormatter()),
            ])
              .then(async ([i, s, r, n, a, l]) => {
                if (
                  ((this._isBats = (0, w.isBatsQuotes)(n)),
                  (this._supportCryptoExchangeOrderTicket =
                    U.supportCryptoExchangeOrderTicket ||
                    (U.supportSymbolSpecificCryptoOrderTicket &&
                      'crypto' === i.type)),
                  (this._symbolInfo = i),
                  this._destroyed)
                )
                  return
                ;(this._supportMarketOrders =
                  U.supportMarketOrders &&
                  (0, w.isOrderTypeAllowed)(
                    2,
                    null == s ? void 0 : s.allowedOrderTypes,
                  )),
                  (this._supportLimitOrders =
                    U.supportLimitOrders &&
                    (0, w.isOrderTypeAllowed)(
                      1,
                      null == s ? void 0 : s.allowedOrderTypes,
                    )),
                  (this._supportStopOrders =
                    U.supportStopOrders &&
                    (0, w.isOrderTypeAllowed)(
                      3,
                      null == s ? void 0 : s.allowedOrderTypes,
                    )),
                  (this._supportStopLimitOrders =
                    U.supportStopLimitOrders &&
                    (0, w.isOrderTypeAllowed)(
                      4,
                      null == s ? void 0 : s.allowedOrderTypes,
                    )),
                  (this._supportBrackets =
                    (null == s ? void 0 : s.supportOrderBrackets) &&
                    !(Object.hasOwn(t, 'parentId') && t.parentId)),
                  (this._supportModifyBrackets =
                    this._supportBrackets && U.supportModifyBrackets),
                  (this._supportAddBracketsToExistingOrder =
                    this._supportModifyBrackets &&
                    U.supportAddBracketsToExistingOrder),
                  (this._supportTrailingStop =
                    this._supportBrackets && U.supportTrailingStop),
                  (this._supportMarketBrackets =
                    this._supportBrackets && U.supportMarketBrackets),
                  (this._supportModifyTrailingStop =
                    this._supportTrailingStop &&
                    this._supportModifyBrackets &&
                    U.supportModifyTrailingStop),
                  (this.displaySymbolName =
                    i.brokerSymbol ||
                    ('brokerSymbol' in t && t.brokerSymbol) ||
                    this.symbol),
                  (this.symbolType = i.type),
                  (this.symbolSpecificWarningMessage =
                    null == s ? void 0 : s.warningMessage),
                  (this.currency = (0, w.getCurrency)(r)),
                  (this._currencyName = (0, w.getCurrency)(r, !0)),
                  (this.formatter = a),
                  (this.symbolHasLotSize = Object.hasOwn(i, 'lotSize')),
                  (this.showRiskControls =
                    U.supportRiskControls && 0 !== i.pipValue),
                  (this._suggestedQty = await this._qtySuggester.getQty(
                    this.symbol,
                  )),
                  (this._initialInputState = this._getInitialInputState(
                    t,
                    i,
                    V,
                    s,
                  )),
                  (this._currentInputState = Object.assign(
                    {},
                    this._initialInputState,
                  ))
                const u = i.variableMinTick
                  ? (0, F.makeVariableMinTickData)(i.minTick, i.variableMinTick)
                  : void 0
                ;(this._quotes$ = (0, g.fromEventPattern)(
                  (i) => e.subscribeRealtime(t.symbol, i),
                  (i) => e.unsubscribeRealtime(t.symbol, i),
                  (e, t) => (0, L.alignQuotesToMinTick)(t, i.minTick, u),
                ).pipe(
                  (0, h.share)({ connector: () => new v.ReplaySubject(1) }),
                )),
                  (this._equity$ = (0, g.fromEventPattern)(
                    (t) => e.subscribeEquity(t),
                    (t) => e.unsubscribeEquity(t),
                    (e, t) => t,
                  ).pipe(
                    (0, p.startWith)(Number.NaN),
                    (0, h.share)({ connector: () => new v.ReplaySubject(1) }),
                  )),
                  (this._marginAvailable$ = U.supportMargin
                    ? C(
                        (0, g.fromEventPattern)(
                          (t) => e.subscribeMarginAvailable(t),
                          (t) => e.unsubscribeMarginAvailable(t),
                          (e, t) => t,
                        ),
                      )
                    : null),
                  (this._baseCurrencyCryptoBalance$ = U.supportBalances
                    ? C(
                        (0, g.fromEventPattern)(
                          (t) =>
                            e.subscribeCryptoBalance(i.baseCurrency || '', t),
                          (t) =>
                            e.unsubscribeCryptoBalance(i.baseCurrency || '', t),
                          (e, t) => t,
                        ).pipe(
                          (0, p.startWith)({
                            symbol: i.baseCurrency || '',
                            total: 0,
                            available: 0,
                          }),
                        ),
                      )
                    : null),
                  (this._quoteCurrencyCryptoBalance$ = U.supportBalances
                    ? C(
                        (0, g.fromEventPattern)(
                          (t) =>
                            e.subscribeCryptoBalance(i.quoteCurrency || '', t),
                          (t) =>
                            e.unsubscribeCryptoBalance(
                              i.quoteCurrency || '',
                              t,
                            ),
                          (e, t) => t,
                        ).pipe(
                          (0, p.startWith)({
                            symbol: i.quoteCurrency || '',
                            total: 0,
                            available: 0,
                          }),
                        ),
                      )
                    : null),
                  (this._pipValues$ = C(
                    (0, g.fromEventPattern)(
                      (i) => e.subscribePipValue(t.symbol, i),
                      (i) => e.unsubscribePipValue(t.symbol, i),
                      (e, t) => t,
                    ).pipe(
                      (0, p.startWith)({
                        buyPipValue: i.pipValue,
                        sellPipValue: i.pipValue,
                      }),
                    ),
                  )),
                  void 0 === this._orderTemplate.limitPrice &&
                    !1 === this.existingOrder &&
                    (this._orderTemplate.limitPrice =
                      1 === this._initialInputState.side
                        ? (0, w.getAsk)(n)
                        : (0, w.getBid)(n)),
                  void 0 === this._orderTemplate.stopPrice &&
                    !1 === this.existingOrder &&
                    (this._orderTemplate.stopPrice =
                      1 === this._initialInputState.side
                        ? (0, w.getBid)(n)
                        : (0, w.getAsk)(n)),
                  this._createModels({
                    order: t,
                    info: i,
                    spreadFormatter: l,
                    isTradable: o.tradable,
                    symbolSpecificTradingOptions: s,
                    forceAbsolutePriceUpdate: I,
                    orderDialogOptions: R,
                  }),
                  this._subscribe(),
                  this._onInputStateChanged.fire(this._getCurrentInputState()),
                  this._headerState.setSettings(this._makeHeaderSettings())
              })
              .catch((e) => {
                throw (ut.logError('Failed to create order model: ' + e), e)
              }))
        }
        destroy() {
          var e
          ;(this._destroyed = !0),
            this.onInputStateChanged().unsubscribe(
              this,
              this._mergeInputStateDiff,
            ),
            this._subscriptions.forEach((e) => e && e.unsubscribe()),
            null === (e = this.orderInfoModel) ||
              void 0 === e ||
              e.unsubscribe(),
            this._orderStatusSubscription.unsubscribe(),
            this._loadingSubscription.unsubscribe(),
            this._orderTypeSubscription &&
              this._orderTypeSubscription.unsubscribe(),
            this._onFocusSubscriptions.forEach((e) => e.unsubscribe()),
            this.headerModel &&
              (this.headerModel.unsubscribe(),
              this.headerModel
                .pinButtonClicked()
                .unsubscribe(this, this._toggleMode),
              this.headerModel
                .cancelButtonClicked()
                .unsubscribe(this, this._cancel),
              this.headerModel
                .closeButtonClicked()
                .unsubscribe(this, this._closeWidget),
              this.headerModel
                .backButtonClicked()
                .unsubscribe(this, this._back)),
            this.sideModel &&
              (this.sideModel.unsubscribe(),
              this.sideModel.onControlFocused.unsubscribe(
                this,
                this.activateOrderTicket,
              )),
            this.limitPriceModel &&
              (this.limitPriceModel.unsubscribe(),
              this.limitPriceModel.onControlFocused.unsubscribe(
                this,
                this.activateOrderTicket,
              )),
            this.stopPriceModel &&
              (this.stopPriceModel.unsubscribe(),
              this.stopPriceModel.onControlFocused.unsubscribe(
                this,
                this.activateOrderTicket,
              )),
            this.priceGroupModel && this.priceGroupModel.unsubscribe(),
            this.quantityConverterController &&
              this.quantityConverterController.destroy(),
            this.quantityModel &&
              (this.quantityModel.unsubscribe(),
              this.quantityModel.onControlFocused.unsubscribe(
                this,
                this.activateOrderTicket,
              )),
            this.takeProfitModel &&
              (this.takeProfitModel.unsubscribe(),
              this.takeProfitModel.onControlFocused.unsubscribe(
                this,
                this.activateOrderTicket,
              )),
            this.stopLossModel &&
              (this.stopLossModel.unsubscribe(),
              this.stopLossModel.onControlFocused.unsubscribe(
                this,
                this.activateOrderTicket,
              )),
            this.durationModel &&
              (this.durationModel.unsubscribe(),
              this.durationModel.onControlFocused.unsubscribe(
                this,
                this.activateOrderTicket,
              )),
            void 0 !== this.leverageModel &&
              (this.leverageModel.unsubscribe(),
              this.leverageModel.onControlFocused.unsubscribe(
                this,
                this.activateOrderTicket,
              )),
            void 0 !== this.customFieldsModel &&
              this.customFieldsModel.destroy(),
            void 0 !== this.buttonModel && this.buttonModel.unsubscribe(),
            this._adapter &&
              this._adapter.orderUpdate.unsubscribe(this, this._orderUpdate),
            this.mode.unsubscribe(this._updateMode),
            this.status.unsubscribe(this._handleStatusChange)
        }
        supportCryptoExchangeOrderTicket() {
          return Boolean(this._supportCryptoExchangeOrderTicket)
        }
        supportLimitOrders() {
          return Boolean(this._supportLimitOrders)
        }
        supportMarketOrders() {
          return Boolean(this._supportMarketOrders)
        }
        supportStopOrders() {
          return Boolean(this._supportStopOrders)
        }
        supportStopLimitOrders() {
          return Boolean(this._supportStopLimitOrders)
        }
        supportBrackets() {
          return Boolean(this._supportBrackets)
        }
        supportAddBracketsToExistingOrder() {
          return Boolean(this._supportAddBracketsToExistingOrder)
        }
        supportModifyBrackets() {
          return Boolean(this._supportModifyBrackets)
        }
        supportTrailingStop() {
          return Boolean(this._supportTrailingStop)
        }
        supportMarketBrackets() {
          return Boolean(this._supportMarketBrackets)
        }
        supportModifyTrailingStop() {
          return Boolean(this._supportModifyTrailingStop)
        }
        onModeChanged() {
          return this._onModeChanged
        }
        onInputStateChanged() {
          return this._onInputStateChanged
        }
        onCloseButtonClicked() {
          return this._onCloseButtonClicked
        }
        onBackButtonClicked() {
          return this._onBackButtonClicked
        }
        side() {
          var e
          return null === (e = this.sideModel) || void 0 === e
            ? void 0
            : e.getValue()
        }
        setSolutionAccount() {
          null !== this._setSolutionAccount && this._setSolutionAccount()
        }
        selectBroker() {
          this._toggleTradingWidget().then(() =>
            this._onNeedSelectBroker.fire(),
          )
        }
        orderWidgetStat() {
          return this._orderWidgetStat
        }
        resetOrderPanel() {
          this._cancel()
        }
        deactivateOrderTicket() {
          this.status.value() !== T.OrderPanelStatus.Wait &&
            (this._resetBracketsFocus(),
            this.status.setValue(T.OrderPanelStatus.Wait),
            (this._orderTypeSubscription = this.orderType$
              .pipe((0, _.skip)(1))
              .subscribe(this.activateOrderTicket)),
            this.sideModel &&
              this.sideModel.onControlFocused.subscribe(
                this,
                this.activateOrderTicket,
              ),
            this.limitPriceModel &&
              this.limitPriceModel.onControlFocused.subscribe(
                this,
                this.activateOrderTicket,
              ),
            this.stopPriceModel &&
              this.stopPriceModel.onControlFocused.subscribe(
                this,
                this.activateOrderTicket,
              ),
            this.quantityModel &&
              this.quantityModel.onControlFocused.subscribe(
                this,
                this.activateOrderTicket,
              ),
            void 0 !== this.leverageModel &&
              this.leverageModel.onControlFocused.subscribe(
                this,
                this.activateOrderTicket,
              ),
            this.takeProfitModel &&
              (this.takeProfitModel.setEnabled(!1),
              this.takeProfitModel.onControlFocused.subscribe(
                this,
                this.activateOrderTicket,
              )),
            this.stopLossModel &&
              (this.stopLossModel.setEnabled(!1),
              this.stopLossModel.onControlFocused.subscribe(
                this,
                this.activateOrderTicket,
              )),
            this.durationModel &&
              this.durationModel.onControlFocused.subscribe(
                this,
                this.activateOrderTicket,
              ),
            this._onFocusSubscriptions.push(
              this.customFieldsModel.onControlFocused$.subscribe(
                this.activateOrderTicket,
              ),
            ),
            this._setDisabledIfNeeded({
              status: this._status.getValue(),
              loading: this._loading.getValue(),
              quotes: null,
              side: this.sideModel ? this.sideModel.getValue() : null,
              limitPrice: this.limitPriceModel
                ? this.limitPriceModel.getValue()
                : null,
              stopPrice: this.stopPriceModel
                ? this.stopPriceModel.getValue()
                : null,
              quantity: this.quantityModel
                ? this.quantityModel.getValue()
                : null,
              isTakeProfitIncorrect:
                !!this.takeProfitModel &&
                this.takeProfitModel.isValueIncorrect(),
              isStopLossIncorrect:
                !!this.stopLossModel && this.stopLossModel.isValueIncorrect(),
              customFields: this.customFieldsModel.getCustomFieldsInputValues(),
              hasDurationError: !1,
            }))
        }
        preOrder() {
          var e, t, i, s
          const o = {
            symbol: this.symbol,
            type: (0, r.ensureNotNull)(
              this._orderType$.value,
              'Make pre-order: Order type value',
            ),
            qty: (0, r.ensureNotNull)(
              this.quantityModel.getValue(),
              'Make pre-order: Quantity model value',
            ),
            side: this.sideModel.getValue(),
            seenPrice: this._calculateSeenPrice(),
            currentQuotes: this._getCurrentQuotes(),
          }
          4 === this._orderType$.value
            ? ((o.stopPrice =
                null !== (e = this.stopPriceModel.getValue()) && void 0 !== e
                  ? e
                  : void 0),
              (o.limitPrice =
                null !== (t = this.limitPriceModel.getValue()) && void 0 !== t
                  ? t
                  : void 0))
            : 3 === this._orderType$.value
              ? (o.stopPrice =
                  null !== (i = this.stopPriceModel.getValue()) && void 0 !== i
                    ? i
                    : void 0)
              : 1 === this._orderType$.value &&
                (o.limitPrice =
                  null !== (s = this.limitPriceModel.getValue()) && void 0 !== s
                    ? s
                    : void 0)
          const n = this.durationModel.getValue()
          return (
            null !== n && (o.duration = n),
            this.stopLossModel &&
              (this.stopLossModel.getBracketType() === $.BracketType.StopLoss &&
                ((o.stopLoss = this.stopLossModel.getEnabled()
                  ? (0, r.ensureNotNull)(
                      this.stopLossModel.price.getValue(),
                      'Make pre-order: StopLoss Model price value',
                    )
                  : void 0),
                (o.trailingStopPips = void 0)),
              this.stopLossModel.getBracketType() ===
                $.BracketType.TrailingStop &&
                ((o.trailingStopPips = this.stopLossModel.getEnabled()
                  ? (0, r.ensureNotNull)(
                      this.stopLossModel.getValue(),
                      'Make pre-order: StopLoss Model value',
                    )
                  : void 0),
                (o.stopLoss =
                  void 0 !== o.trailingStopPips ? void 0 : o.stopLoss))),
            this.takeProfitModel &&
              (o.takeProfit = this.takeProfitModel.getEnabled()
                ? (0, r.ensureNotNull)(
                    this.takeProfitModel.price.getValue(),
                    'Make pre-order: Take Profit Model price value',
                  )
                : void 0),
            this.customFieldsModel.getCustomFieldsModels() &&
              (o.customFields =
                this.customFieldsModel.getCustomFieldsInputValues()),
            o
          )
        }
        toggleCancelButton() {
          this.mode.value() === T.OrderEditorDisplayMode.Panel &&
          this.status.value() === T.OrderPanelStatus.Active
            ? this.headerModel.showCancelButton()
            : this.headerModel.hideCancelButton()
        }
        _isFullscreenPopup() {
          return (
            window.matchMedia(I.DialogBreakpoints.TabletSmall).matches &&
            this.mode.value() === T.OrderEditorDisplayMode.Popup
          )
        }
        _createSimpleDialog(e) {
          this._orderType$.next(null),
            this.status.setValue(T.OrderPanelStatus.Wait),
            (this.headerModel = new E({
              displaySymbolName: this.symbol,
              symbol: this.symbol,
              brokerName: e ? e.metainfo().title : '',
              mode: this.mode,
              status: this.status,
              parentType: 1,
              isExistingOrder: !1,
              isTradable: !1,
              quotes$: this._quotes$,
              data: void 0,
              formatter: void 0,
              isBats: this._isBats,
              informerMessage$: this._informerMessage$,
              headerState: this._headerState,
            })),
            this.headerModel
              .closeButtonClicked()
              .subscribe(this, this._closeWidget)
        }
        _createModels(e) {
          var t, i, s, o, n, a, l, u, d
          const {
              order: c,
              info: h,
              spreadFormatter: p,
              isTradable: _,
              symbolSpecificTradingOptions: y,
              forceAbsolutePriceUpdate: g,
              orderDialogOptions: v,
            } = e,
            P = this.supportCryptoExchangeOrderTicket()
          ;(this.sideModel = new Z({
            initialSide: this._initialInputState.side,
            quotes$: this._quotes$,
            priceFormatter: this.formatter,
            spreadFormatter: p,
            status: this.status,
            baseCurrency: (P && 'crypto' === h.type && h.baseCurrency) || null,
          })),
            (this._pipValue$ = (0, S.combineLatest)([
              this._pipValues$,
              this.sideModel.value$,
            ]).pipe(
              (0, b.map)(([e, t]) =>
                1 === t ? e.buyPipValue : e.sellPipValue,
              ),
            ))
          const { orderRules: m = [], title: k } = this._adapter.metainfo()
          let f = [],
            C = []
          if (
            ((this.supportStopOrdersInBothDirections &&
              this.supportStopLimitOrdersInBothDirections) ||
              ((f =
                null !==
                  (t = (0, V.extractLimitValidationRules)(
                    this._adapter,
                    this.symbol,
                  )) && void 0 !== t
                  ? t
                  : []),
              (C =
                null !==
                  (i = (0, V.extractStopValidationRules)(
                    this._adapter,
                    this.symbol,
                  )) && void 0 !== i
                  ? i
                  : [])),
            (this.stopPriceModel = new ce({
              priceType: 2,
              quotes$: this._quotes$,
              side$: this.sideModel.value$,
              info: h,
              status$: this._status,
              formatter: this.formatter,
              orderType$: this.orderType$,
              settings: this._settings,
              brokerTitle: k,
              orderWidgetStat: this._orderWidgetStat,
              initialPrice: this._orderTemplate.stopPrice,
              orderRules: [...m, ...C],
              forceAbsolutePriceUpdate: g,
              supportStopOrdersInBothDirections:
                this.supportStopOrdersInBothDirections,
              supportStopLimitOrdersInBothDirections:
                this.supportStopLimitOrdersInBothDirections,
            })),
            (this.limitPriceModel = new ce({
              priceType: 1,
              quotes$: this._quotes$,
              side$: this.sideModel.value$,
              info: h,
              status$: this._status,
              formatter: this.formatter,
              orderType$: this.orderType$,
              settings: this._settings,
              brokerTitle: k,
              orderWidgetStat: this._orderWidgetStat,
              initialPrice: this._orderTemplate.limitPrice,
              orderRules: [...m, ...f],
              forceAbsolutePriceUpdate: g,
              stopPriceControlData$: this.stopPriceModel.priceControlData$,
              supportStrictCheckingLimitOrderPrice:
                this.supportStrictCheckingLimitOrderPrice,
            })),
            (this.priceGroupModel = new pe({
              stopPriceModel: this.stopPriceModel,
              limitPriceModel: this.limitPriceModel,
              orderType$: this.orderType$,
              side$: this.sideModel.value$,
              quotes$: this._quotes$,
            })),
            P)
          )
            this.quantityModel = new Oe({
              info: h,
              price$: this.priceGroupModel.price$,
              baseCurrencyCryptoBalance$: this._baseCurrencyCryptoBalance$,
              quoteCurrencyCryptoBalance$: this._quoteCurrencyCryptoBalance$,
              initialQty: this._initialInputState.quantity,
              side$: this.sideModel.value$,
              sideGetter: this.sideModel.getValue,
              orderWidgetStat: this._orderWidgetStat,
              isExistingOrder: this.existingOrder,
              orderQty: c.qty,
              orderPrice: 1 === c.type ? c.limitPrice : c.stopPrice,
            })
          else {
            const e =
                null !==
                  (o =
                    null ===
                      (s = this._initialInputState.orderSizeCalculatorState) ||
                    void 0 === s
                      ? void 0
                      : s.calculationType) && void 0 !== o
                  ? o
                  : 'units',
              t = dt.includes(e),
              i = t
                ? this._initialInputState.quantity
                : null !==
                      (a =
                        null ===
                          (n =
                            this._initialInputState.orderSizeCalculatorState) ||
                        void 0 === n
                          ? void 0
                          : n.value) && void 0 !== a
                  ? a
                  : this._initialInputState.quantity,
              r = t ? 'units' : e
            this.quantityModel = new Te({
              stopLossAvailable$: this._stopLossAvailable$,
              stopLossPips$: this._stopLossPips$,
              equity$: this._equity$,
              pipValue$: this._pipValue$,
              info: h,
              currency: null !== (l = this.currency) && void 0 !== l ? l : '',
              initialQty: i,
              initialInputType: r,
              settings: this._settings,
              orderWidgetStat: this._orderWidgetStat,
              showRiskControls: this.showRiskControls,
            })
          }
          const M = this.supportBrackets()
          ;(M || this.supportCryptoBrackets) &&
            this._createBracketsModels(
              c,
              h,
              (0, r.ensureDefined)(this.currency),
            ),
            (this.headerModel = new E({
              displaySymbolName: this.displaySymbolName,
              symbol: this.symbol,
              brokerName: this._adapter.metainfo().title,
              mode: this.mode,
              status: this.status,
              parentType: 1,
              isExistingOrder: this.existingOrder,
              isTradable: _,
              quotes$: this._quotes$,
              data: c,
              formatter: this.formatter,
              isBats: this._isBats,
              informerMessage$: this._informerMessage$,
              headerState: this._headerState,
              isCancelButtonAlwaysHidden: this._isCancelButtonAlwaysHidden,
            })),
            (this.customFieldsModel = new lt({
              existingOrder: this.existingOrder,
              initialInputState:
                null !== (u = this._initialInputState.customFields) &&
                void 0 !== u
                  ? u
                  : void 0,
              tradingDialogOptions: v,
            })),
            this.supportLeverage &&
              (this.leverageModel = new Qe({
                adapterLeverageInfo: this._adapter.leverageInfo,
                adapterSetLeverage: this._adapter.setLeverage,
                adapterPreviewLeverage: this._adapter.previewLeverage,
                brokerName: this._adapter.metainfo().title,
                symbol: this.symbol,
                displaySymbol: this.displaySymbolName,
                orderType$: this.orderType$,
                side$: this.sideModel.value$,
                initialSide: this.sideModel.getValue(),
                customFieldsInputValues$:
                  this.customFieldsModel.customFieldsInputValues$,
                customFieldsGetter:
                  this.customFieldsModel.getCustomFieldsInputValues,
                blocked$: this.customFieldsModel.isCustomFieldsNotSelected$,
                isBlockedGetter: () =>
                  this.customFieldsModel.getIsCustomFieldsNotSelected(),
                onBlockedClick: () =>
                  this.customFieldsModel.setIsEmptyRequiredCustomFieldsHighlighted(
                    !0,
                  ),
                getOrderType: this.getOrderType,
              })),
            P ||
              (this.orderInfoModel = new Ye({
                marginAvailable$: this._marginAvailable$,
                qty$: this.quantityModel.value$,
                currency: (0, r.ensureDefined)(this._currencyName),
                pipValue$: this._pipValue$,
                price$: this.priceGroupModel.price$,
                side$: this.sideModel.value$,
                showTotalInsteadOfTradeValue: (0, L.shouldShowTotal)(v),
                showRiskControls: this.showRiskControls,
                info: h,
                tpInfo:
                  M && this.takeProfitModel
                    ? {
                        enabled: this.takeProfitModel.enabled$,
                        riskInCurrency:
                          this.takeProfitModel.riskInCurrency.value$,
                        riskInPercent:
                          this.takeProfitModel.riskInPercent.value$,
                      }
                    : null,
                slInfo:
                  M && this.stopLossModel
                    ? {
                        enabled: this.stopLossModel.enabled$,
                        riskInCurrency:
                          this.stopLossModel.riskInCurrency.value$,
                        riskInPercent: this.stopLossModel.riskInPercent.value$,
                      }
                    : null,
                supportMargin:
                  this._adapter.metainfo().configFlags.supportMargin || !1,
                pipValueType$: this._pipValueType$,
                leverageInfo$:
                  null === (d = this.leverageModel) || void 0 === d
                    ? void 0
                    : d.leverageInfo$,
              })),
            (this.durationModel = new Re({
              initialDuration: this._initialInputState.duration,
              orderType$: this.orderType$,
              orderWidgetStat: this._orderWidgetStat,
              orderDurations: this._adapter.metainfo().durations,
              symbolDurations: null == y ? void 0 : y.allowedDurations,
              getOrderType: this.getOrderType,
            }))
          const T = {
            orderType: this.orderType$,
            side: this.sideModel.value$,
            quantity: this.quantityModel.value$,
            symbol: this.displaySymbolName,
            stopPrice: this.stopPriceModel.value$,
            limitPrice: this.limitPriceModel.value$,
            formatter: this.formatter,
            quantityFormatter: this.quantityModel.formatter,
            orderPlacingStatus: this._orderPlacingStatus.asObservable(),
            status: (0, L.makeSubjectFromWatchedValue)(
              this.status,
            ).subject.asObservable(),
            existingOrder: this.existingOrder,
          }
          this.buttonModel = new Je($.TradingEntityType.Order, T)
        }
        _getUnitsTitle() {
          return this._symbolInfo.units
            ? this._symbolInfo.units
            : this.symbolHasLotSize
              ? u.t(null, void 0, i(357653))
              : 'stock' === this._symbolInfo.type
                ? u.t(null, void 0, i(866251))
                : u.t(null, void 0, i(125933))
        }
        _getAvailableQuantityTypeInfos() {}
        _createQuantityConverterController() {}
        _createQuantityConverters(e) {
          return {}
        }
        _resetBracketsFocus() {
          var e, t
          null === (e = this.takeProfitModel) ||
            void 0 === e ||
            e.setFocusedControl(0),
            null === (t = this.stopLossModel) ||
              void 0 === t ||
              t.setFocusedControl(0)
        }
        _createBracketsModels(e, t, i) {
          const s = (0, V.extractTakeProfitValidationRules)(
              this._adapter,
              this.symbol,
            ),
            r = (0, V.extractStopLossValidationRules)(
              this._adapter,
              this.symbol,
            ),
            o = this.supportModifyBrackets(),
            n = this.supportModifyTrailingStop(),
            a = this.supportAddBracketsToExistingOrder()
          this.takeProfitModel = new Fe({
            initialPrice: e.takeProfit || null,
            initialEnabled: Boolean(e.takeProfit),
            initialBracketType: $.BracketType.TakeProfit,
            formatter: this.formatter,
            equity$: this._equity$,
            quotes$: this._quotes$,
            info: t,
            pipValue$: this._pipValue$,
            side$: this.sideModel.value$,
            amount$: this.quantityModel.value$,
            parentPrice$: this.priceGroupModel.price$,
            orderType$: this.orderType$,
            currency: i,
            parentType: 1,
            savedPips: this._currentInputState.takeProfitPips,
            settings: this._settings,
            orderWidgetStat: this._orderWidgetStat,
            showRiskControls: this.showRiskControls,
            status: this.status.value(),
            validationRules: s,
            supportCryptoBrackets: this.supportCryptoBrackets,
            supportModifyBrackets: o,
            supportModifyTrailingStop: n,
            supportAddBracketsToExistingOrder: a,
          })
          const l = Boolean(e.trailingStopPips)
          this.stopLossModel = new Fe({
            initialPrice: l ? null : e.stopLoss || null,
            initialEnabled: Boolean(l ? e.trailingStopPips : e.stopLoss),
            initialBracketType: l
              ? $.BracketType.TrailingStop
              : $.BracketType.StopLoss,
            formatter: this.formatter,
            equity$: this._equity$,
            quotes$: this._quotes$,
            info: t,
            pipValue$: this._pipValue$,
            side$: this.sideModel.value$,
            amount$: this.quantityModel.value$,
            parentPrice$: this.priceGroupModel.price$,
            orderType$: this.orderType$,
            currency: i,
            parentType: 1,
            savedPips:
              (l ? e.trailingStopPips : this._currentInputState.stopLossPips) ||
              null,
            settings: this._settings,
            orderWidgetStat: this._orderWidgetStat,
            showRiskControls: this.showRiskControls,
            status: this.status.value(),
            validationRules: r,
            supportCryptoBrackets: this.supportCryptoBrackets,
            hasTrailingStopBracket: e.hasTrailingStopBracket,
            supportModifyBrackets: o,
            supportModifyTrailingStop: n,
            supportAddBracketsToExistingOrder: a,
          })
        }
        _makeHeaderSettings() {
          return nt({
            pin: () => this.headerModel.pin(),
            mode: this.mode,
            settings: this._settings,
            currency: this.currency,
            showRelativePriceControl:
              !this.limitPriceModel.isRelativePriceControlHidden &&
              !this.stopPriceModel.isRelativePriceControlHidden,
            showRiskControls: this.showRiskControls,
            showQuantityInsteadOfAmount: this.showQuantityInsteadOfAmount,
            supportBrackets: this.supportBrackets(),
            supportPlaceOrderPreview: this.supportPlaceOrderPreview,
            supportModifyOrderPreview: this.supportModifyOrderPreview,
            isUndockAllowed: this._isUndockAllowed,
          })
        }
        _subscribe() {
          var e, t, i, s, r, o, n, a, l, u, d, c, h, p, _
          this.mode.subscribe(this._updateMode),
            this.status.subscribe(this._handleStatusChange),
            this.onInputStateChanged().subscribe(
              this,
              this._mergeInputStateDiff,
            ),
            this.headerModel
              .pinButtonClicked()
              .subscribe(this, this._toggleMode),
            this.headerModel
              .cancelButtonClicked()
              .subscribe(this, this._cancel),
            this.headerModel
              .closeButtonClicked()
              .subscribe(this, this._closeWidget),
            this.headerModel.backButtonClicked().subscribe(this, this._back),
            (this._buttonDataSubscription = (0, S.combineLatest)({
              orderType: this.orderType$,
              status: this._status,
              side: this.sideModel.value$,
              loading: this._loading,
              quotes: this._quotes$,
              limitPrice: this.limitPriceModel.value$,
              stopPrice: this.stopPriceModel.value$,
              quantity: this.quantityModel.value$,
              quantityError: this.quantityModel.error$,
              orderSizeCalculatorCalculationType:
                this.quantityModel instanceof Te
                  ? this.quantityModel.inputType$
                  : (0, M.of)('units'),
              orderSizeCalculatorValue:
                null !==
                  (t =
                    null === (e = this.quantityConverterController) ||
                    void 0 === e
                      ? void 0
                      : e.convertedValues$) && void 0 !== t
                  ? t
                  : (0, M.of)(null),
              takeProfitPips:
                null !==
                  (s =
                    null === (i = this.takeProfitModel) || void 0 === i
                      ? void 0
                      : i.value$) && void 0 !== s
                  ? s
                  : (0, M.of)(null),
              takeProfitPrice:
                null !==
                  (o =
                    null === (r = this.takeProfitModel) || void 0 === r
                      ? void 0
                      : r.price.value$) && void 0 !== o
                  ? o
                  : (0, M.of)(null),
              stopLossPips:
                null !==
                  (a =
                    null === (n = this.stopLossModel) || void 0 === n
                      ? void 0
                      : n.value$) && void 0 !== a
                  ? a
                  : (0, M.of)(null),
              stopLossPrice:
                null !==
                  (u =
                    null === (l = this.stopLossModel) || void 0 === l
                      ? void 0
                      : l.price.value$) && void 0 !== u
                  ? u
                  : (0, M.of)(null),
              takeProfitEnabled:
                null !==
                  (c =
                    null === (d = this.takeProfitModel) || void 0 === d
                      ? void 0
                      : d.enabled$) && void 0 !== c
                  ? c
                  : (0, M.of)(!1),
              stopLossEnabled:
                null !==
                  (p =
                    null === (h = this.stopLossModel) || void 0 === h
                      ? void 0
                      : h.enabled$) && void 0 !== p
                  ? p
                  : (0, M.of)(!1),
              duration: this.durationModel.$value,
              customFields: this.customFieldsModel.customFieldsInputValues$,
              hasDurationError: this.durationModel.hasError$,
            }).subscribe((e) => {
              var t
              const {
                orderType: i,
                status: s,
                side: r,
                loading: o,
                quotes: n,
                limitPrice: a,
                stopPrice: l,
                quantity: u,
                quantityError: d,
                orderSizeCalculatorCalculationType: c,
                orderSizeCalculatorValue: h,
                takeProfitPips: p,
                takeProfitPrice: _,
                stopLossPips: b,
                stopLossPrice: y,
                takeProfitEnabled: g,
                stopLossEnabled: v,
                duration: P,
                customFields: m,
                hasDurationError: k,
              } = e
              this._setDisabledIfNeeded({
                status: s,
                loading: o,
                quotes: n,
                side: r,
                limitPrice: a,
                stopPrice: l,
                quantity: u,
                isTakeProfitIncorrect: g && null === p,
                isStopLossIncorrect: v && null === b,
                customFields: m,
                hasDurationError: k,
              }),
                this._compareInputStates({
                  orderType: i,
                  side: r,
                  limitPrice: a,
                  stopPrice: l,
                  quantity: u,
                  orderSizeCalculatorState: d.res
                    ? null
                    : {
                        value:
                          null !== (t = null == h ? void 0 : h[c]) &&
                          void 0 !== t
                            ? t
                            : null,
                        calculationType: c,
                      },
                  takeProfitPips: p,
                  takeProfitPrice: _,
                  stopLossPips: b,
                  stopLossPrice: y,
                  duration: P,
                  customFields: m,
                })
            })),
            (this._waitQuotesTimeout = setTimeout(
              () => this.isNoQuotes.setValue(!0),
              5e3,
            ))
          const b = (0, S.combineLatest)([
              this._quotes$,
              this.sideModel.value$,
            ]).subscribe(([e, t]) => {
              const i = 1 === t ? (0, w.getAsk)(e) : (0, w.getBid)(e)
              ;(this._initialInputState.limitPrice = i),
                (this._initialInputState.stopPrice = i)
            }),
            y = this._quotes$.subscribe((e) => {
              this.isNoQuotes.setValue((0, w.isNoQuotes)(e)),
                clearTimeout(this._waitQuotesTimeout)
            })
          if (
            ((this._subscriptions = [
              ...this.sideModel.subscribe(),
              this._qtySuggester
                .suggestedQtyChanged(this.symbol)
                .subscribe(this._onSuggestedQtyChange),
              this.quantityModel.value$.subscribe(this._onQtyChange),
            ]),
            this.limitPriceModel.subscribe(),
            this.stopPriceModel.subscribe(),
            this.priceGroupModel.subscribe(),
            this.quantityModel.subscribe(),
            null === (_ = this.orderInfoModel) || void 0 === _ || _.subscribe(),
            this.buttonModel && this.buttonModel.subscribe(),
            void 0 !== this.takeProfitModel &&
              this._subscriptions.push(...this.takeProfitModel.subscribe()),
            void 0 !== this.stopLossModel)
          ) {
            if (!this.supportCryptoExchangeOrderTicket()) {
              const e = (0, S.combineLatest)([
                  this.stopLossModel.value$,
                  this.stopLossModel.enabled$,
                ]).subscribe(([e, t]) => {
                  this._stopLossAvailable$.next(t),
                    t && this._stopLossPips$.next(e)
                }),
                t = this.stopLossModel.focusedControl$.subscribe((e) => {
                  ;(2 !== e && 3 !== e) ||
                    this.quantityModel.setFocusedControl(0)
                }),
                i = this.quantityModel.focusedControl$.subscribe((e) => {
                  !this.stopLossModel ||
                    1 === this.stopLossModel.getFocusedControl() ||
                    (1 !== e && 2 !== e) ||
                    this.stopLossModel.setFocusedControl(0)
                })
              this._subscriptions.push(e, t, i)
            }
            this._subscriptions.push(...this.stopLossModel.subscribe())
          }
          if (
            void 0 !== this.takeProfitModel &&
            void 0 !== this.stopLossModel
          ) {
            const e = (0, S.combineLatest)([
              this.takeProfitModel.value$,
              this.stopLossModel.value$,
            ]).subscribe(([e, t]) => {
              this.rewardRisk.setValue((0, L.formatRiskReward)(e, t))
            })
            this._subscriptions.push(e)
          }
          this._subscriptions.push(
            this._buttonDataSubscription,
            b,
            y,
            this._pipValues$.connect(),
          ),
            null !== this._marginAvailable$ &&
              this._subscriptions.push(this._marginAvailable$.connect()),
            null !== this._baseCurrencyCryptoBalance$ &&
              this._subscriptions.push(
                this._baseCurrencyCryptoBalance$.connect(),
              ),
            null !== this._quoteCurrencyCryptoBalance$ &&
              this._subscriptions.push(
                this._quoteCurrencyCryptoBalance$.connect(),
              ),
            this._adapter.orderUpdate.subscribe(this, this._orderUpdate)
        }
        _orderUpdate(e) {
          this._isVisible() &&
            !this.loading.value() &&
            this.existingOrder &&
            e.id === this._orderTemplate.id &&
            6 !== e.status &&
            (this.mode.value() === T.OrderEditorDisplayMode.Popup
              ? this.headerModel.close()
              : this._back())
        }
        async _doneHandler(e, t) {
          await this._getAndSendStatistics(e),
            null !== this._orderWidgetStat && this._orderWidgetStat.clear()
          const i = this._sendHandler
          if (this._isHandlerPlacedOrder(i)) {
            const s = Object.assign({}, this._existingPlacedOrder, e)
            return (
              [2, 1].includes(s.type) && delete s.stopPrice,
              [2, 3].includes(s.type) && delete s.limitPrice,
              i(s, t)
            )
          }
          return i(e, t)
        }
        _isHandlerPlacedOrder(e) {
          return this.existingOrder
        }
        async _getAndSendStatistics(e) {
          var t
          const i = this.stopLossModel && this.stopLossModel.getEnabled(),
            s = this.takeProfitModel && this.takeProfitModel.getEnabled(),
            o = i && this.supportTrailingStop,
            n = 1 === e.side ? 'Buy' : 'Sell',
            a = ['Price', 'Pips'],
            l = [
              'Units',
              'RiskInCurrency',
              'RiskInPercent',
              'BaseCurrencyQuantity',
              'QuoteCurrencyQuantity',
            ],
            u = this.quantityModel.getFocusedControl(),
            d = ['Pips', 'Price', 'RiskInCurrency', 'RiskInPercent'],
            c = ['Limit', 'Market', 'Stop', 'StopLimit'][e.type - 1],
            h = this.durationModel.getValue(),
            p = this.leverageModel ? this.leverageModel.leverageInfo() : null,
            _ = 4 === e.type,
            b = 3 === e.type || _,
            y = 1 === e.type || _,
            g = Object.assign({}, this._settings.value()),
            v =
              (this.limitPriceModel &&
                !this.limitPriceModel.isRelativePriceControlHidden) ||
              (this.stopPriceModel &&
                !this.stopPriceModel.isRelativePriceControlHidden),
            P = Boolean(this.supportBrackets)
          function m(e, t) {
            return t[null !== e ? e : 0]
          }
          ;(g.showRelativePriceControl = g.showRelativePriceControl && v),
            (g.showCurrencyRiskInQty = g.showCurrencyRiskInQty && P),
            (g.showPercentRiskInQty = g.showPercentRiskInQty && P),
            (g.showBracketsInCurrency = g.showBracketsInCurrency && P),
            (g.showBracketsInPercent = g.showBracketsInPercent && P),
            (g.showOrderPreview =
              g.showOrderPreview &&
              Boolean(
                this.supportPlaceOrderPreview || this.supportModifyOrderPreview,
              )),
            null !== this._orderWidgetStat &&
              (this._orderWidgetStat.setStaticSnowplowEventDataProperty({
                userId: window.user.id,
                accountType: this._adapter.currentAccountType(),
                brokerId: this._adapter.metainfo().id,
                orderTicketMode: this.mode.value(),
                side: n,
                orderType: c,
                leverageInfo: p,
                symbolType:
                  void 0 !== this._symbolInfo.type
                    ? this._symbolInfo.type
                    : null,
                operation: this.existingOrder ? 'Modify' : 'Place',
                stopLoss: i
                  ? (0, r.ensureDefined)(this.stopLossModel).getValue()
                  : null,
                takeProfit: s
                  ? (0, r.ensureDefined)(this.takeProfitModel).getValue()
                  : null,
                trailingStop: o
                  ? (0, r.ensureDefined)(this.stopLossModel).getValue()
                  : null,
                guaranteedStop: null,
                focusedTPField: s
                  ? m(
                      (0, r.ensureDefined)(
                        this.takeProfitModel,
                      ).getFocusedControl(),
                      d,
                    )
                  : null,
                focusedSLField: i
                  ? m(
                      (0, r.ensureDefined)(
                        this.stopLossModel,
                      ).getFocusedControl(),
                      d,
                    )
                  : null,
                focusedQtyField:
                  null !== (t = l[null !== u ? u : 0]) && void 0 !== t
                    ? t
                    : null,
                focusedLimitPriceField:
                  y || (_ && this.limitPriceModel)
                    ? m(this.limitPriceModel.getFocusedControl(), a)
                    : null,
                focusedStopPriceField:
                  b && this.stopPriceModel
                    ? a[this.stopPriceModel.getFocusedControl()]
                    : null,
                duration: null !== h ? h.type : null,
                isDefaultDuration:
                  null !== h
                    ? h.type === this._getDefaultDuration().value
                    : null,
                showBracketsInCurrency: g.showBracketsInCurrency,
                showBracketsInPercent: g.showBracketsInPercent,
                showCurrencyRiskInQty: g.showCurrencyRiskInQty,
                showOrderPreview: g.showOrderPreview,
                showPercentRiskInQty: g.showPercentRiskInQty,
                showRelativePriceControl: g.showRelativePriceControl,
              }),
              await this._orderWidgetStat.trackStat())
        }
        _getInitialInputState(e, t, i, s) {
          var r, o, n, a, l, u, d
          const c = void 0 !== e.customFields ? { ...e.customFields } : void 0
          return {
            symbol: this.symbol,
            orderType: this._orderType$.value,
            side:
              null !==
                (o =
                  null !== (r = e.side) && void 0 !== r
                    ? r
                    : null == i
                      ? void 0
                      : i.side) && void 0 !== o
                ? o
                : 1,
            limitPrice: e.limitPrice || e.price || e.stopPrice || null,
            stopPrice: e.stopPrice || e.price || e.limitPrice || null,
            quantity:
              e.qty ||
              (null == i ? void 0 : i.quantity) ||
              this._suggestedQty ||
              t.qty.min,
            orderSizeCalculatorState: e.qty
              ? null
              : null !==
                    (n = null == i ? void 0 : i.orderSizeCalculatorState) &&
                  void 0 !== n
                ? n
                : null,
            takeProfitPips:
              null !== (a = null == i ? void 0 : i.takeProfitPips) &&
              void 0 !== a
                ? a
                : T.BracketDefaultPips.TakeProfit,
            takeProfitPrice: null,
            stopLossPips:
              null !== (l = null == i ? void 0 : i.stopLossPips) && void 0 !== l
                ? l
                : T.BracketDefaultPips.StopLoss,
            stopLossPrice: null,
            customFields:
              null !==
                (u = null != c ? c : null == i ? void 0 : i.customFields) &&
              void 0 !== u
                ? u
                : {},
            duration: (0, w.getOrderDuration)({
              orderDuration: e.duration,
              orderType: this._orderType$.value,
              savedDuration:
                null !== (d = null == i ? void 0 : i.duration) && void 0 !== d
                  ? d
                  : null,
              orderDurations: this._adapter.metainfo().durations,
              symbolDurations: null == s ? void 0 : s.allowedDurations,
            }),
          }
        }
        _compareInputStates(e) {
          var t, i
          const {
              orderType: s,
              side: r,
              limitPrice: o,
              stopPrice: n,
              quantity: a,
              orderSizeCalculatorState: l,
              takeProfitPips: u,
              takeProfitPrice: d,
              stopLossPips: c,
              stopLossPrice: h,
              duration: p,
              customFields: _,
            } = e,
            b = {}
          let y = null === o
          if (null !== o) {
            const e = this.formatter.format(o),
              t =
                null !== this._currentInputState.limitPrice
                  ? this.formatter.format(this._currentInputState.limitPrice)
                  : null
            y = 3 !== s && e !== t
          }
          s !== this._currentInputState.orderType && (b.orderType = s),
            y && (b.limitPrice = o)
          let g = null !== n
          if (null !== n) {
            const e = this.formatter.format(n),
              t =
                null !== this._currentInputState.stopPrice
                  ? this.formatter.format(this._currentInputState.stopPrice)
                  : null
            g = (3 === s || 4 === s) && e !== t
          }
          g && (b.stopPrice = n),
            null !== a &&
              this._currentInputState.quantity !== a &&
              (b.quantity = a),
            (null !== l &&
              (null ===
                (t = this._currentInputState.orderSizeCalculatorState) ||
              void 0 === t
                ? void 0
                : t.calculationType) === l.calculationType &&
              (null ===
                (i = this._currentInputState.orderSizeCalculatorState) ||
              void 0 === i
                ? void 0
                : i.value) === l.value) ||
              (b.orderSizeCalculatorState = l),
            this._currentInputState.takeProfitPips !== u &&
              (b.takeProfitPips = u),
            this._currentInputState.takeProfitPrice !== d &&
              (b.takeProfitPrice = d),
            this._currentInputState.stopLossPips !== c && (b.stopLossPips = c),
            this._currentInputState.stopLossPrice !== h &&
              (b.stopLossPrice = h),
            null === p ||
              null === this._currentInputState.duration ||
              (this._currentInputState.duration.type === p.type &&
                this._currentInputState.duration.datetime === p.datetime) ||
              (b.duration = p),
            null !== r && this._currentInputState.side !== r && (b.side = r),
            null !== s &&
              this._currentInputState.orderType !== s &&
              (b.orderType = s),
            this._currentInputState.symbol !== this.symbol &&
              (b.symbol = this.symbol),
            0 === Object.keys(_).length ||
              (0, q.deepEquals)(this._currentInputState.customFields, _)[0] ||
              (b.customFields = _),
            0 !== Object.keys(b).length && this._onInputStateChanged.fire(b)
        }
        _getCurrentInputState() {
          return {
            symbol: this.symbol,
            orderType: this._orderType$.value,
            side: this.sideModel.getValue(),
            limitPrice: this.limitPriceModel.getValue(),
            stopPrice: this.stopPriceModel.getValue(),
            quantity: this.quantityModel.getValue(),
            orderSizeCalculatorState:
              this.quantityModel instanceof Te
                ? {
                    value: this.quantityModel.quantity.getValue(),
                    calculationType: this.quantityModel.getInputType(),
                  }
                : null,
            takeProfitPips: this.takeProfitModel
              ? this.takeProfitModel.pips.getValue()
              : null,
            takeProfitPrice: this.takeProfitModel
              ? this.takeProfitModel.price.getValue()
              : null,
            stopLossPips: this.stopLossModel
              ? this.stopLossModel.pips.getValue()
              : null,
            stopLossPrice: this.stopLossModel
              ? this.stopLossModel.price.getValue()
              : null,
            duration: this.durationModel.getValue(),
            customFields: this.customFieldsModel.getCustomFieldsInputValues(),
          }
        }
        _setDisabledIfNeeded({
          status: e,
          loading: t,
          quotes: i,
          side: s,
          limitPrice: r,
          stopPrice: o,
          quantity: n,
          isTakeProfitIncorrect: a,
          isStopLossIncorrect: l,
          customFields: u,
          hasDurationError: d,
        }) {
          this.disabled.setValue(
            (this.mode.value() === T.OrderEditorDisplayMode.Panel &&
              e === T.OrderPanelStatus.Wait) ||
              t ||
              (0, w.isNoQuotes)(i) ||
              null === s ||
              (0, L.checkPriceByOrderType)(this._orderType$.value, r, o) ||
              null === n ||
              a ||
              l ||
              d ||
              Object.values(u).some((e) => void 0 === e) ||
              this.customFieldsModel
                .getCustomFieldsModels()
                .some((e) => !e.isValid.value()),
          )
        }
        _toggleMode() {
          this.mode.setValue(
            this.mode.value() === T.OrderEditorDisplayMode.Panel
              ? T.OrderEditorDisplayMode.Popup
              : T.OrderEditorDisplayMode.Panel,
          ),
            this._onModeChanged.fire(this.mode.value())
        }
        _closeWidget() {
          this._cleanUp(), this._onCloseButtonClicked.fire()
        }
        _cancel() {
          this._cleanUp(),
            this.deactivateOrderTicket(),
            (this._currentInputState = Object.assign(
              {},
              this._initialInputState,
            )),
            this.limitPriceModel && this.limitPriceModel.resetPrice(),
            this.stopPriceModel && this.stopPriceModel.resetPrice(),
            this.takeProfitModel && this.takeProfitModel.setEnabled(!1),
            this.stopLossModel && this.stopLossModel.setEnabled(!1),
            this._orderPlacingStatus.next(T.OrderPlacingStatus.Creating),
            this.existingOrder && this._back()
        }
        _cleanUp() {
          ;(this.orderPreviewModel = null), this.onDoneButtonClicked.resolve(!1)
        }
        _getDefaultDuration() {
          const e = (0, r.ensureDefined)(this._adapter.metainfo().durations)
          return e.find((e) => Boolean(e.default)) || e[0]
        }
        async _prepareTradableSolution(e) {
          ;(this.tradableSolution = await (0, L.prepareTradableSolution)(
            e,
            this._adapter,
          )),
            this._createSimpleDialog(this._adapter),
            (this.notTradableText = e.reason)
        }
        _isOrderSizeCalculatorAvailable() {
          return !1
        }
        _calculateSeenPrice() {
          var e
          const t = this.sideModel.currentQuotes()
          return null !==
            (e = 1 === this.sideModel.getValue() ? t.ask : t.bid) &&
            void 0 !== e
            ? e
            : 0
        }
        _getCurrentQuotes() {
          const e = this.sideModel.currentQuotes()
          if (void 0 !== e.ask && void 0 !== e.bid)
            return { ask: e.ask, bid: e.bid }
        }
      }
      class ht {
        constructor({
          qty: e,
          currency: t,
          positionPrice: i,
          showTotalInsteadOfTradeValue: s,
          info: r,
          pipValueType$: o,
          tpInfo: n,
          slInfo: a,
          showRiskControls: l,
        }) {
          ;(this._infoTableData$ = new y.BehaviorSubject({ rows: [] })),
            (this._riskFormatter = new D.PriceFormatter(100)),
            (this._tpEnabled$ = null),
            (this._tpRiskInCurrency$ = null),
            (this._tpRiskInPercent$ = null),
            (this._slEnabled$ = null),
            (this._slRiskInCurrency$ = null),
            (this._slRiskInPercent$ = null),
            (this.infoTableData$ = this._infoTableData$.asObservable()),
            (this._currency = t),
            (this._showTotalInsteadOfTradeValue = s),
            (this._showRiskControls = l),
            (this._type = r.type),
            (this._leverage = r.leverage),
            (this._marginRate = r.marginRate),
            (this._lotSize = r.lotSize),
            (this._pipValue = (0, L.calculatePipValue)(
              e,
              r.pipValue,
              this._lotSize,
            )),
            (this._pipValueType$ = o),
            null === e
              ? (this._tradeValue = 0)
              : 'crypto' === this._type
                ? (this._tradeValue = e * i)
                : (this._tradeValue = (0, L.calculateTradeValue)(
                    e,
                    i,
                    r.pipValue,
                    r.pipSize,
                    this._lotSize,
                  )),
            n &&
              a &&
              ((this._tpEnabled$ = n.enabled),
              (this._tpRiskInCurrency$ = n.riskInCurrency),
              (this._tpRiskInPercent$ = n.riskInPercent),
              (this._slEnabled$ = a.enabled),
              (this._slRiskInCurrency$ = a.riskInCurrency),
              (this._slRiskInPercent$ = a.riskInPercent))
        }
        subscribe() {
          this._subscription = (0, S.combineLatest)({
            tpEnabled:
              null !== this._tpEnabled$ ? this._tpEnabled$ : (0, M.of)(null),
            tpRiskInCurrency:
              null !== this._tpRiskInCurrency$
                ? this._tpRiskInCurrency$
                : (0, M.of)(null),
            tpRiskInPercent:
              null !== this._tpRiskInPercent$
                ? this._tpRiskInPercent$
                : (0, M.of)(null),
            slEnabled:
              null !== this._slEnabled$ ? this._slEnabled$ : (0, M.of)(null),
            slRiskInCurrency:
              null !== this._slRiskInCurrency$
                ? this._slRiskInCurrency$
                : (0, M.of)(null),
            slRiskInPercent:
              null !== this._slRiskInPercent$
                ? this._slRiskInPercent$
                : (0, M.of)(null),
            pipValueType: this._pipValueType$,
          }).subscribe((e) => {
            const {
                tpEnabled: t,
                tpRiskInCurrency: i,
                tpRiskInPercent: s,
                slEnabled: r,
                slRiskInCurrency: o,
                slRiskInPercent: n,
                pipValueType: a,
              } = e,
              l = []
            l.push(
              ...this._makeLeverageInfo(),
              ...this._makeLotSizeInfo(),
              ...this._makePipValueInfo(a),
              ...this._makeTradeValueInfo(),
              ...this._makeRewardInfo(t, i, s),
              ...this._makeRiskInfo(r, o, n),
            ),
              this._infoTableData$.next({ rows: l })
          })
        }
        unsubscribe() {
          var e
          null === (e = this._subscription) || void 0 === e || e.unsubscribe()
        }
        title() {
          return u.t(null, void 0, i(440339))
        }
        infoTableData() {
          return this._infoTableData$.asObservable()
        }
        getOrderInfoTableRowsCount() {
          return this._infoTableData$.getValue().rows.length
        }
        _getTradeValue() {
          const e = this._getMarginRate()
          if (
            this._showRiskControls &&
            Number.isFinite(this._tradeValue) &&
            (this._isSymbolTypeSupportTradeValue() || void 0 !== e)
          )
            return (0, L.formatInfoValue)(
              this._tradeValue * (null != e ? e : 1),
            )
        }
        _makeLeverageInfo() {
          const e = (0, L.displayedLeverage)(this._leverage, this._marginRate)
          return null === e
            ? []
            : [{ title: u.t(null, void 0, i(956220)), value: e }]
        }
        _makeLotSizeInfo() {
          return 'number' == typeof this._lotSize &&
            Number.isFinite(this._lotSize)
            ? [
                {
                  title: u.t(null, void 0, i(127531)),
                  value: String(this._lotSize),
                },
              ]
            : []
        }
        _makePipValueInfo(e) {
          return this._showRiskControls &&
            e !== $.PipValueType.None &&
            Number.isFinite(this._pipValue)
            ? [
                {
                  title:
                    e === $.PipValueType.Pips
                      ? u.t(null, void 0, i(419489))
                      : u.t(null, void 0, i(696709)),
                  value: `${(0, L.formatInfoValue)(this._pipValue)} ${this._currency}`,
                },
              ]
            : []
        }
        _makeTradeValueInfo() {
          const e = this._getTradeValue()
          if (void 0 === e) return []
          return [
            {
              title: this._showTotalInsteadOfTradeValue
                ? u.t(null, void 0, i(613937))
                : u.t(null, void 0, i(207710)),
              value: `${e} ${this._currency}`,
            },
          ]
        }
        _getMarginRate() {
          return void 0 !== this._marginRate && this._marginRate > 0
            ? this._marginRate
            : void 0
        }
        _isSymbolTypeSupportTradeValue() {
          return (
            void 0 !== this._type &&
            ['stock', 'dr', 'right', 'bond', 'warrant', 'structured'].includes(
              this._type,
            )
          )
        }
        _makeRewardInfo(e, t, s) {
          return this._showRiskControls && e && null !== t && null !== s
            ? [
                {
                  title: u.t(null, void 0, i(356979)),
                  value: `${this._riskFormatter.format(s)}% (${this._riskFormatter.format(t)} ${this._currency})`,
                },
              ]
            : []
        }
        _makeRiskInfo(e, t, s) {
          return this._showRiskControls && e && null !== t && null !== s
            ? [
                {
                  title: u.t(null, void 0, i(563833)),
                  value: `${this._riskFormatter.format(s)}% (${this._riskFormatter.format(t)} ${this._currency})`,
                },
              ]
            : []
        }
      }
      var pt
      !((e) => {
        ;(e[(e.Position = 0)] = 'Position'),
          (e[(e.IndividualPosition = 1)] = 'IndividualPosition')
      })(pt || (pt = {}))
      class _t {
        constructor({
          adapter: e,
          position: t,
          brackets: i,
          mode: s,
          settings: r,
          realtimeProvider: o,
          isUndockAllowed: n,
          isVisible: l,
          viewType: u,
          pipValueType$: c,
          handler: h,
          trackEvent: _,
          orderDialogOptions: y,
          headerState: v,
        }) {
          ;(this.positionInfoModel = null),
            (this.onDoneButtonClicked = (0, d.createDeferredPromise)()),
            (this.rewardRisk = new a.WatchedValue('')),
            (this.disabled = new a.WatchedValue(!1)),
            (this.loading = new a.WatchedValue(!1)),
            (this.status = new a.WatchedValue(T.OrderPanelStatus.Active)),
            (this.id = (0, O.randomHashN)(6)),
            (this.warning = new a.WatchedValue(void 0)),
            (this.isEmptyRequiredCustomFieldsHighlighted = new a.WatchedValue(
              !1,
            )),
            (this._onModeChanged = new B.Delegate()),
            (this._onBackButtonClicked = new B.Delegate()),
            (this._onCloseButtonClicked = new B.Delegate()),
            (this._loadingSubscription = (0, L.makeSubjectFromWatchedValue)(
              this.loading,
            )),
            (this._loading = this._loadingSubscription.subject),
            (this._headerState = v),
            (this.headerStateValue = v),
            this._headerState.setSettings(void 0),
            (this.mode = s),
            (this._position = t),
            (this._settings = r),
            (this._adapter = e),
            (this._pipValueType$ = c),
            (this.position = t),
            (this.symbol = t.symbol),
            (this.brackets = i),
            (this._handler = h),
            (this._isUndockAllowed = n),
            (this._isVisible = l)
          const P = this._adapter.metainfo().configFlags
          ;(this.supportPositions = u === pt.Position && P.supportPositions),
            (this.supportIndividualPositions =
              u === pt.IndividualPosition && P.supportPositionNetting),
            (this.supportOnlyPairPositionBrackets =
              P.supportOnlyPairPositionBrackets),
            (this.supportCryptoExchangeOrderTicket =
              P.supportCryptoExchangeOrderTicket),
            this._adapter.orders().then((e) => {
              var i
              const s = e.filter(
                  (e) => 2 === e.parentType && e.parentId === t.id,
                ),
                r =
                  null === (i = s[0]) || void 0 === i ? void 0 : i.customFields,
                o = this._adapter.getPositionDialogOptions()
              ;(this.customFieldsModel = new lt({
                existingOrder: Boolean(s.length),
                tradingDialogOptions: o,
                initialInputState: r,
              })),
                this.supportOnlyPairPositionBrackets && this._updateWarning()
            }),
            (this._trackEvent = _),
            (this.onReady = Promise.all([
              e.symbolInfo(t.symbol),
              e.getSymbolSpecificTradingOptions(t.symbol),
              Ze(e.accountMetainfo(), {
                id: e.metainfo().id,
                name: e.metainfo().title,
              }),
              Ze(e.formatter(t.symbol, !1), new D.PriceFormatter()),
            ]).then(([s, r, n, a]) => {
              ;(this.showRiskControls =
                P.supportRiskControls && 0 !== s.pipValue),
                (this.currency = (0, w.getCurrency)(n)),
                (this.symbolType = s.type),
                (this.brokerSymbol =
                  s.brokerSymbol || t.brokerSymbol || this.symbol),
                (this._supportBrackets =
                  u === pt.IndividualPosition
                    ? null == r
                      ? void 0
                      : r.supportIndividualPositionBrackets
                    : null == r
                      ? void 0
                      : r.supportPositionBrackets),
                (this._supportModifyBrackets =
                  this._supportBrackets && P.supportModifyBrackets),
                (this._supportTrailingStop =
                  this._supportBrackets && P.supportTrailingStop),
                (this._supportModifyTrailingStop =
                  this._supportTrailingStop &&
                  this._supportModifyBrackets &&
                  P.supportModifyTrailingStop),
                (this._quotes$ = C(
                  (0, g.fromEventPattern)(
                    (e) => o.subscribeRealtime(t.symbol, e),
                    (e) => o.unsubscribeRealtime(t.symbol, e),
                    (e, t) => t,
                  ),
                )),
                (this._equity$ = C(
                  (0, g.fromEventPattern)(
                    (t) => e.subscribeEquity(t),
                    (t) => e.unsubscribeEquity(t),
                    (e, t) => t,
                  ),
                )),
                (this._pipValues$ = C(
                  (0, g.fromEventPattern)(
                    (i) => e.subscribePipValue(t.symbol, i),
                    (i) => e.unsubscribePipValue(t.symbol, i),
                    (e, t) => t,
                  ).pipe(
                    (0, p.startWith)({
                      buyPipValue: s.pipValue,
                      sellPipValue: s.pipValue,
                    }),
                  ),
                )),
                (this._pipValue$ = this._pipValues$.pipe(
                  (0, b.map)((e) =>
                    1 === t.side ? e.buyPipValue : e.sellPipValue,
                  ),
                )),
                this._createModels(i, s, n, this.mode, a, y),
                this._subscribe(),
                this._headerState.setSettings(
                  nt({
                    pin: () => this.headerModel.pin(),
                    mode: this.mode,
                    settings: this._settings,
                    currency: this.currency,
                    showRiskControls: !0,
                    supportBrackets: !0,
                    isUndockAllowed: this._isUndockAllowed,
                  }),
                )
            }))
        }
        destroy() {
          this._subscriptions &&
            this._subscriptions.forEach((e) => e.unsubscribe()),
            this.headerModel &&
              (this.headerModel.unsubscribe(),
              this.headerModel
                .pinButtonClicked()
                .unsubscribe(this, this._toggleMode),
              this.headerModel
                .backButtonClicked()
                .unsubscribe(this, this._back),
              this.headerModel
                .closeButtonClicked()
                .unsubscribe(this, this._closeWidget)),
            null !== this.positionInfoModel &&
              this.positionInfoModel.unsubscribe(),
            this.supportPositions &&
              this._adapter.positionUpdate.unsubscribe(
                this,
                this._positionOrIndividualPositionUpdate,
              ),
            this.supportIndividualPositions &&
              this._adapter.individualPositionUpdate.unsubscribe(
                this,
                this._positionOrIndividualPositionUpdate,
              ),
            this.supportOnlyPairPositionBrackets &&
              this._adapter.orderUpdate.unsubscribe(this, this._updateWarning)
        }
        side() {
          return this._position.side
        }
        doneButtonClick() {
          this.loading.setValue(!0),
            this._doneHandler().then((e) => {
              e &&
                (this.onDoneButtonClicked.resolve(!0),
                this.mode.value() === T.OrderEditorDisplayMode.Popup
                  ? this.headerModel.close()
                  : this._back(),
                this._trackEvent(
                  'Position Ticket',
                  'Modify Position',
                  this.mode.value() === T.OrderEditorDisplayMode.Panel
                    ? 'Panel'
                    : 'Popup',
                )),
                this.loading.setValue(!1)
            })
        }
        onModeChanged() {
          return this._onModeChanged
        }
        onBackButtonClicked() {
          return this._onBackButtonClicked
        }
        onCloseButtonClicked() {
          return this._onCloseButtonClicked
        }
        supportBrackets() {
          return Boolean(this._supportBrackets)
        }
        supportTrailingStop() {
          return Boolean(this._supportTrailingStop)
        }
        supportModifyTrailingStop() {
          return Boolean(this._supportModifyTrailingStop)
        }
        _createModels(e, t, i, s, r, o) {
          var n
          const a = (0, V.extractTakeProfitValidationRules)(
              this._adapter,
              this.symbol,
            ),
            l = (0, V.extractStopLossValidationRules)(
              this._adapter,
              this.symbol,
            ),
            u = (0, w.getCurrency)(i) || '$',
            d = new y.BehaviorSubject(this._position.side || -1)
          this.headerModel = new E({
            displaySymbolName: this.brokerSymbol,
            symbol: this.symbol,
            brokerName: ' ',
            mode: s,
            status: this.status,
            parentType: 2,
            isExistingOrder: !0,
            isTradable: !0,
            quotes$: this._quotes$,
            data: this._position,
            formatter: this._position.priceFormatter
              ? this._position.priceFormatter
              : r,
            headerState: this._headerState,
          })
          const c = this.supportModifyTrailingStop()
          this.takeProfitModel = new Fe({
            initialPrice: e.takeProfit || this._position.takeProfit || null,
            initialEnabled: Boolean(e.takeProfit || this._position.takeProfit),
            initialBracketType: $.BracketType.TakeProfit,
            formatter: r,
            equity$: this._equity$,
            quotes$: this._quotes$,
            info: t,
            pipValue$: this._pipValue$,
            side$: d,
            amount$: new y.BehaviorSubject(this._position.qty),
            parentPrice$: new y.BehaviorSubject(
              null !== (n = this._position.avgPrice) && void 0 !== n
                ? n
                : this._position.price,
            ),
            orderType$: new y.BehaviorSubject(null),
            currency: u,
            parentType: 2,
            savedPips: null,
            settings: this._settings,
            orderWidgetStat: null,
            showRiskControls: this.showRiskControls,
            status: this.status.value(),
            validationRules: a,
            supportModifyBrackets: this._supportModifyBrackets,
            supportModifyTrailingStop: c,
          })
          const h = Boolean(this._position.trailingStopPips),
            p = e.trailingStopPips || this._position.trailingStopPips,
            _ = e.stopLoss || this._position.stopLoss,
            b = Boolean(p)
          this.stopLossModel = new Fe({
            initialPrice: b ? null : _ || null,
            initialEnabled: Boolean(b ? p : _),
            initialBracketType: b
              ? $.BracketType.TrailingStop
              : $.BracketType.StopLoss,
            formatter: r,
            equity$: this._equity$,
            quotes$: this._quotes$,
            info: t,
            pipValue$: this._pipValue$,
            side$: d,
            amount$: new y.BehaviorSubject(this._position.qty),
            parentPrice$: new y.BehaviorSubject(this._position.avgPrice),
            orderType$: new y.BehaviorSubject(null),
            currency: u,
            parentType: 2,
            savedPips: p || null,
            settings: this._settings,
            orderWidgetStat: null,
            showRiskControls: this.showRiskControls,
            status: this.status.value(),
            validationRules: l,
            supportModifyBrackets: this._supportModifyBrackets,
            supportModifyTrailingStop: c,
            hasTrailingStopBracket: h,
          })
          const g = (0, L.shouldShowTotal)(o),
            v = this.supportBrackets()
          this.supportCryptoExchangeOrderTicket ||
            (this.positionInfoModel = new ht({
              qty: this._position.qty,
              currency: (0, w.getCurrency)(i),
              positionPrice: this._position.avgPrice,
              showTotalInsteadOfTradeValue: g,
              info: t,
              pipValueType$: this._pipValueType$,
              tpInfo:
                v && this.takeProfitModel
                  ? {
                      enabled: this.takeProfitModel.enabled$,
                      riskInCurrency:
                        this.takeProfitModel.riskInCurrency.value$,
                      riskInPercent: this.takeProfitModel.riskInPercent.value$,
                    }
                  : null,
              slInfo:
                v && this.stopLossModel
                  ? {
                      enabled: this.stopLossModel.enabled$,
                      riskInCurrency: this.stopLossModel.riskInCurrency.value$,
                      riskInPercent: this.stopLossModel.riskInPercent.value$,
                    }
                  : null,
              showRiskControls: this.showRiskControls,
            })),
            (this.buttonModel = new Je($.TradingEntityType.Position))
        }
        _updateWarning() {
          this._adapter.orders().then((e) => {
            const t = e.find(
              (e) =>
                e.symbol === this._position.symbol &&
                e.side !== this._position.side &&
                ((6 === e.status && void 0 === e.parentId) || 3 === e.status),
            )
            this.warning.setValue(t ? u.t(null, void 0, i(698311)) : void 0)
          })
        }
        _subscribe() {
          if (
            (this.headerModel
              .pinButtonClicked()
              .subscribe(this, this._toggleMode),
            this.headerModel.backButtonClicked().subscribe(this, this._back),
            this.headerModel
              .closeButtonClicked()
              .subscribe(this, this._closeWidget),
            (this._buttonDataSubscription = (0, S.combineLatest)({
              loading: this._loading,
              quotes: this._quotes$,
              takeProfit: this.takeProfitModel.value$,
              stopLoss: this.stopLossModel.value$,
              takeProfitEnabled: this.takeProfitModel.enabled$,
              stopLossEnabled: this.stopLossModel.enabled$,
            }).subscribe((e) => {
              const {
                loading: t,
                quotes: i,
                takeProfit: s,
                stopLoss: r,
                takeProfitEnabled: o,
                stopLossEnabled: n,
              } = e
              this.disabled.setValue(
                t ||
                  (0, w.isNoQuotes)(i) ||
                  (o && null === s) ||
                  (n && null === r),
              )
            })),
            (this._rewardRiskSubscription = (0, S.combineLatest)([
              this.takeProfitModel.value$,
              this.stopLossModel.value$,
            ]).subscribe(([e, t]) => {
              this.rewardRisk.setValue((0, L.formatRiskReward)(e, t))
            })),
            (this._subscriptions = [
              ...this.takeProfitModel.subscribe(),
              ...this.stopLossModel.subscribe(),
              this._rewardRiskSubscription,
              this._buttonDataSubscription,
              this._equity$.connect(),
              this._quotes$.connect(),
              this._pipValues$.connect(),
            ]),
            null !== this.positionInfoModel &&
              this.positionInfoModel.subscribe(),
            this.supportPositions &&
              this._adapter.positionUpdate.subscribe(
                this,
                this._positionOrIndividualPositionUpdate,
              ),
            this.supportIndividualPositions &&
              this._adapter.individualPositionUpdate.subscribe(
                this,
                this._positionOrIndividualPositionUpdate,
              ),
            this.supportOnlyPairPositionBrackets)
          ) {
            this._adapter.orderUpdate.subscribe(this, this._updateWarning)
            const e = this.stopLossModel.enabled$
                .pipe(ae(this.takeProfitModel.enabled$))
                .subscribe((e) => {
                  const [t, i] = e
                  i !== t && this.takeProfitModel.setEnabled(t)
                }),
              t = this.takeProfitModel.enabled$
                .pipe(ae(this.stopLossModel.enabled$))
                .subscribe((e) => {
                  const [t, i] = e
                  i !== t && this.stopLossModel.setEnabled(t)
                })
            this._subscriptions.push(t, e)
          }
        }
        _doneHandler() {
          const e =
              null !== this.stopLossModel.getValue()
                ? this.stopLossModel.price.getValue()
                : null,
            t = this.stopLossModel.getValue(),
            i =
              null !== this.takeProfitModel.getValue()
                ? this.takeProfitModel.price.getValue()
                : null,
            s = {}
          if (
            (null !== t &&
              null !== e &&
              (this.stopLossModel.getBracketType() === $.BracketType.StopLoss &&
                (s.stopLoss = e),
              this.stopLossModel.getBracketType() ===
                $.BracketType.TrailingStop && (s.trailingStopPips = t)),
            null !== i && (s.takeProfit = i),
            this.customFieldsModel.getCustomFieldsModels().length > 0)
          ) {
            const e = this.customFieldsModel.getCustomFieldsInputValues()
            return (
              this._getAndSendStatistics(),
              this._handler(this.position.id, s, e)
            )
          }
          return (
            this._getAndSendStatistics(), this._handler(this.position.id, s)
          )
        }
        _getAndSendStatistics() {
          const e = this.stopLossModel.getEnabled(),
            t = this.stopLossModel.getFocusedControl(),
            i = this.takeProfitModel.getEnabled(),
            s = this.takeProfitModel.getFocusedControl(),
            r = this.stopLossModel && this.stopLossModel.getBracketType(),
            o = ['Pips', 'Price', 'RiskInCurrency', 'RiskInPercent'],
            n = [' Disabled', ' Active'],
            a = ['StopLoss', 'TakeProfit', 'TrailingStop'],
            l = {
              SL: { active: n[+e], mode: o[t] },
              TP: { active: n[+i], mode: o[s] },
            }
          this.supportTrailingStop() &&
            (l.SLType = { active: n[+e], mode: a[r] })
          const u = this._settings.value()
          Object.keys(u)
            .filter((e) =>
              ['showBracketsInCurrency', 'showBracketsInPercent'].includes(e),
            )
            .forEach((e) => {
              this._trackEvent('Order Ticket', e, u[e] ? 'on' : 'off')
            }),
            Object.keys(l).forEach((e) => {
              l[e].active && this._trackEvent('Position Ticket', e, l[e].mode)
            })
        }
        _positionOrIndividualPositionUpdate(e) {
          !this._isVisible() ||
            this.loading.value() ||
            e.id !== this.position.id ||
            (0 !== e.qty && this.position.side === e.side) ||
            (this.mode.value() === T.OrderEditorDisplayMode.Popup
              ? this.headerModel.close()
              : this._back())
        }
        _toggleMode() {
          this.mode.setValue(
            this.mode.value() === T.OrderEditorDisplayMode.Panel
              ? T.OrderEditorDisplayMode.Popup
              : T.OrderEditorDisplayMode.Panel,
          ),
            this._onModeChanged.fire(this.mode.value())
        }
        _closeWidget() {
          this.onDoneButtonClicked.resolve(!1),
            this._onCloseButtonClicked.fire()
        }
        _back() {
          this.onDoneButtonClicked.resolve(!1), this._onBackButtonClicked.fire()
        }
      }
      var bt = i(322625)
      class yt {
        constructor(e) {
          ;(this._brokerId = ''), (this._settingsAdapter = e)
        }
        setBrokerId(e) {
          this._brokerId = e
        }
        saveSettings(e) {
          this._settingsAdapter.setValue(
            this._makeKey(bt.settingsKeys.ORDER_PANEL_SETTINGS, this._brokerId),
            JSON.stringify(e),
          )
        }
        getSettings() {
          const e = this._settingsAdapter.getValue(
            this._makeKey(bt.settingsKeys.ORDER_PANEL_SETTINGS, this._brokerId),
          )
          try {
            return JSON.parse(e)
          } catch (e) {
            return null
          }
        }
        setWidgetMode(e) {
          this._settingsAdapter.setValue(bt.settingsKeys.ORDER_WIDGET_MODE, e)
        }
        widgetMode() {
          const e = this._settingsAdapter.getValue(
            bt.settingsKeys.ORDER_WIDGET_MODE,
          )
          return e || null
        }
        _makeKey(e, t, i) {
          return e + t + ('string' == typeof i ? '.' + i : '')
        }
      }
      var gt,
        vt = i(758094),
        Pt = i(895318),
        mt = i(75577),
        kt = i(768819)
      !((e) => {
        let t = 0
        const i = new a.WatchedValue(!1)
        ;(e.value = i.readonly()),
          (e.wrap =
            (e) =>
            async (...s) => {
              i.setValue(!0), t++
              try {
                return await e(...s)
              } finally {
                t--, i.setValue(0 !== t)
              }
            })
      })(gt || (gt = {}))
      var ft = i(864348)
      const Ct = {
          [ft.PlaceOrEditContextType.PlaceOrder]: T.OrderPanelStatus.Active,
          [ft.PlaceOrEditContextType.EditOrder]: T.OrderPanelStatus.Editing,
          [ft.PlaceOrEditContextType.EditPosition]: T.OrderPanelStatus.Editing,
          [ft.PlaceOrEditContextType.EditIndividualPosition]:
            T.OrderPanelStatus.Editing,
        },
        St = (0, o.getLogger)('Trading.OrderViewController')
      function Mt() {
        return Promise.all([
          i.e(6137),
          i.e(580),
          i.e(8194),
          i.e(2639),
          i.e(7845),
          i.e(4474),
          i.e(7194),
          i.e(6747),
          i.e(5295),
          i.e(2486),
          i.e(6260),
          i.e(6209),
          i.e(5896),
          i.e(2567),
          i.e(75),
          i.e(2050),
          i.e(17),
          i.e(9244),
          i.e(8425),
          i.e(7125),
          i.e(4119),
          i.e(3637),
          i.e(5380),
          i.e(9538),
          i.e(9389),
          i.e(7502),
        ]).then(i.bind(i, 618997))
      }
      function $t() {
        return Promise.all([
          i.e(580),
          i.e(8194),
          i.e(7845),
          i.e(4474),
          i.e(7194),
          i.e(6209),
          i.e(75),
          i.e(2050),
          i.e(4420),
          i.e(7125),
          i.e(5380),
          i.e(9538),
          i.e(8751),
        ]).then(i.bind(i, 382799))
      }
      const Tt = 'order-ticket'
      function wt(e) {
        if (0 === e.length) return null
        const t = new Set(e.flatMap((e) => (e.saveToSettings ? e.id : [])))
        return 0 !== t.size ? t : null
      }
      class Vt {
        constructor(e) {
          ;(this._orderViewModel = null),
            (this._positionViewModel = null),
            (this._dialogVisibility = new kt.DialogVisibility()),
            (this._orderWidgetStat = null),
            (this._orderTypeSubscription = null),
            (this._settings = new a.WatchedValue(Pt.defaultSettings)),
            (this._mode = new a.WatchedValue(T.OrderEditorDisplayMode.Panel)),
            (this.openPanel = async () => {
              var e
              try {
                await this._closeOrderDialog(),
                  await this._closePositionDialog(),
                  this._setDisplayMode(T.OrderEditorDisplayMode.Panel),
                  this._openTradingPanelPage(vt.TradingPage.OrderPanel)
                const t =
                  void 0 !== this._tradedContextLinking
                    ? null === (e = this._tradedContextLinking.context()) ||
                      void 0 === e
                      ? void 0
                      : e.data()
                    : void 0
                await this._recreateOrderViewModel(null, t),
                  await this._openOrderPanel()
              } catch (e) {
                St.logWarn(
                  `Failed to open panel: ${(0, l.getLoggerMessage)(e)}`,
                )
              }
            }),
            (this.closePanel = () => {
              null !== this._positionViewModel &&
                (this._positionViewModel.onDoneButtonClicked.reject(),
                this._unmountPositionPanel(),
                this._unsubscribePositionViewModel()),
                null !== this._orderViewModel &&
                  (this._orderViewModel.existingOrder &&
                    this._orderViewModel.onDoneButtonClicked.reject(),
                  this._unmountOrderPanel(),
                  this._unsubscribeOrderViewModel()),
                this._closeTradingPanel()
            }),
            (this._onActiveTradingPanelChanged = (e) => {
              e !== vt.TradingPage.OrderPanel &&
                (null !== this._positionViewModel &&
                  (this._unmountPositionPanel(),
                  this._unsubscribePositionViewModel()),
                null !== this._orderViewModel &&
                  this._mode.value() === T.OrderEditorDisplayMode.Panel &&
                  (this._orderViewModel.existingOrder &&
                    this._orderViewModel.onDoneButtonClicked.reject(),
                  this._unsubscribeOrderViewModel(),
                  this._unmountOrderPanel()))
            }),
            (this._onStatusChanged = async (e) => {
              try {
                const t = this._state,
                  i = this._makeState()
                ;(i.symbol === t.symbol &&
                  i.broker === t.broker &&
                  i.accountId === t.accountId &&
                  i.isAuthenticated === t.isAuthenticated) ||
                  ((this._state = i),
                  this._setSettings(),
                  await this._closeOrderDialog(),
                  await this._closePositionDialog(),
                  !(null == e ? void 0 : e.aborted) &&
                    this._isTradingPanelOpened.value() &&
                    this._mode.value() === T.OrderEditorDisplayMode.Panel &&
                    this._tradingPanelActivePage.value() ===
                      vt.TradingPage.OrderPanel &&
                    (await this._recreateOrderViewModel(e),
                    this._deactivateOrderTicket(),
                    this._openOrderPanel()))
              } catch (e) {
                St.logWarn(
                  `Failed to change status: ${(0, l.getLoggerMessage)(e)}`,
                )
              }
            }),
            (this._saveSettings = (e) => {
              this._orderViewDataStorage.saveSettings(e)
            }),
            (this._recreateOrderViewModel = async (e, t) => {
              var i, s, o, n, a
              null !== this._orderViewModel &&
                (this._orderViewModel.existingOrder &&
                  this._orderViewModel.onDoneButtonClicked.reject(),
                this._unsubscribeOrderViewModel()),
                null !== this._positionViewModel &&
                  (this._positionViewModel.onDoneButtonClicked.reject(),
                  this._unsubscribePositionViewModel()),
                (this._orderStub = null != t ? t : this._createOrderStub())
              const { broker: l, symbol: u, side: d } = this._state
              let c = null
              if (null === l)
                c = new ct({
                  ...this._commonOrderViewModelProps(),
                  adapter: l,
                  isTradable: { tradable: !1 },
                  sendHandler: () => Promise.resolve(!0),
                  previewHandler: async () => ({ sections: [] }),
                })
              else {
                const a = await (0, Ae.respectAbort)(e, l.isTradable(u))
                let h = l.placeOrder.bind(l)
                void 0 !== this._tradedContextLinking &&
                  (h = async (e, t) => {
                    const i = (0, r.ensureDefined)(
                      this._tradedContextLinking,
                      'Recreate order view model: Trade context linking',
                    )
                    return (0, r.ensureNotNull)(
                      i.context(),
                      'Recreate order view model: Place order handler trade context',
                    ).send(t)
                  })
                const p = Object.hasOwn(this._orderStub, 'id')
                    ? l.modifyOrder.bind(l)
                    : h,
                  _ = async (e) => {
                    var t
                    const i =
                      null === (t = this._tradedContextLinking) || void 0 === t
                        ? void 0
                        : t.context()
                    return (null == i ? void 0 : i.type) ===
                      ft.PlaceOrEditContextType.PlaceOrder
                      ? i.preview()
                      : l.previewOrder(e)
                  }
                let b = null
                a.tradable &&
                  (b =
                    null !==
                      (n =
                        null !==
                          (o =
                            null !== (i = null == t ? void 0 : t.type) &&
                            void 0 !== i
                              ? i
                              : null ===
                                    (s = this._getTradingSettingsStorage()) ||
                                  void 0 === s
                                ? void 0
                                : s.orderType(u)) && void 0 !== o
                          ? o
                          : (0, w.getDefaultOrderType)(l.config)) &&
                    void 0 !== n
                      ? n
                      : null)
                const y = await (0, Ae.respectAbort)(
                    e,
                    l.getOrderDialogOptions(u),
                  ),
                  g =
                    void 0 !== (null == y ? void 0 : y.customFields)
                      ? wt(y.customFields)
                      : null
                this._setState({ orderType: b, savableCustomFields: g })
                const v = this._makeOrderViewInputState(u, b, d, g)
                c = new ct({
                  ...this._commonOrderViewModelProps(),
                  adapter: l,
                  isTradable: a,
                  sendHandler: p,
                  previewHandler: _,
                  orderViewInputState: v,
                  forceAbsolutePriceUpdate: !0,
                  orderDialogOptions: y,
                })
              }
              if (
                ((this._orderViewModel = c),
                this._subscribeOrderViewModel(),
                await (0, Ae.respectAbort)(e, c.onReady),
                this._orderViewModel !== c)
              )
                return (
                  this._unsubscribeOrderViewModel(),
                  Promise.reject(
                    'OrderViewModel was recreated during the initialization',
                  )
                )
              null === (a = this._placeOrderAbortController) ||
                void 0 === a ||
                a.abort(),
                (this._placeOrderAbortController = new AbortController()),
                this._updateTradedContextLinking(
                  this._placeOrderAbortController.signal,
                )
            }),
            (this._updateTradedContextLinking = async (e) => {
              if (
                null !== this._state.broker &&
                void 0 !== this._tradedContextLinking &&
                null !== this._orderViewModel &&
                !this._orderViewModel.existingOrder &&
                this._orderViewModel.status.value() !== T.OrderPanelStatus.Wait
              )
                try {
                  const t = await (0, Ae.respectAbort)(
                    e,
                    this._state.broker.createPlaceOrderContext(
                      this._orderViewModel.preOrder(),
                      Tt,
                    ),
                  )
                  if (
                    this._orderViewModel.status.value() ===
                    T.OrderPanelStatus.Wait
                  )
                    return
                  this._tradedContextLinking.setContext(t)
                } catch (e) {
                  ;(0, Ae.skipAbortError)(e)
                }
            }),
            (this._updateOrderValues = (e) => {
              if (null === this._orderViewModel) return
              const {
                duration: t,
                limitPrice: i,
                type: s,
                qty: r,
                side: o,
                stopPrice: n,
                stopLoss: a,
                takeProfit: l,
              } = e
              if (
                (void 0 !== i &&
                  this._orderViewModel.limitPriceModel.setPriceValue(i),
                void 0 !== n &&
                  this._orderViewModel.stopPriceModel.setPriceValue(n),
                this._orderViewModel.sideModel.getValue() !== o &&
                  this._orderViewModel.sideModel.setValue(o),
                this._orderViewModel.getOrderType() !== s &&
                  this._orderViewModel.setOrderType(s),
                this._orderViewModel.quantityModel.quantity.getValue() !== r &&
                  this._orderViewModel.quantityModel.quantity.setValue(r),
                this._orderViewModel.durationModel.currentDuration.setValue(
                  null != t ? t : null,
                ),
                void 0 !== this._orderViewModel.stopLossModel)
              ) {
                const e = void 0 !== a
                this._orderViewModel.stopLossModel.getEnabled() !== e &&
                  this._orderViewModel.stopLossModel.setEnabled(e),
                  e &&
                    1 !==
                      this._orderViewModel.stopLossModel.getFocusedControl() &&
                    this._orderViewModel.stopLossModel.setFocusedControl(1)
                const t = null != a ? a : null
                e &&
                  this._orderViewModel.stopLossModel.price.getValue() !== t &&
                  this._orderViewModel.stopLossModel.price.setValue(t)
              }
              if (void 0 !== this._orderViewModel.takeProfitModel) {
                const e = void 0 !== l
                this._orderViewModel.takeProfitModel.getEnabled() !== e &&
                  this._orderViewModel.takeProfitModel.setEnabled(void 0 !== l),
                  e &&
                    1 !==
                      this._orderViewModel.takeProfitModel.getFocusedControl() &&
                    this._orderViewModel.takeProfitModel.setFocusedControl(1)
                const t = null != l ? l : null
                e &&
                  this._orderViewModel.takeProfitModel.price.getValue() !== t &&
                  this._orderViewModel.takeProfitModel.price.setValue(t)
              }
            }),
            (this._onOrderWidgetModeChanged = async (e) => {
              e === T.OrderEditorDisplayMode.Panel
                ? (await this._closeOrderDialog(), await this._openOrderPanel())
                : (await this._closeOrderPanel(),
                  await this._showOrderDialog()),
                this._setDisplayMode(e)
            }),
            (this._onOrderWidgetInputStateChanged = (e) => {
              var t, i
              this._updateTradedContextLinking(
                null !==
                  (i =
                    null === (t = this._placeOrderAbortController) ||
                    void 0 === t
                      ? void 0
                      : t.signal) && void 0 !== i
                  ? i
                  : null,
              )
              const { symbol: s, orderType: o } = this._state
              if (
                ((0, w.isDefined)(e.side) && this._setState({ side: e.side }),
                !(0, w.isDefined)(o))
              )
                return
              const n = this._getTradingSettingsStorage()
              if (null === n) return
              ;(0, r.ensureNotNull)(this._orderViewModel, 'Order View Model')
                .existingOrder
              if (
                ((0, w.isDefined)(e.quantity) && n.setSymbolQty(s, e.quantity),
                (0, w.isDefined)(e.takeProfitPips) &&
                  n.setTakeProfitPips(
                    s,
                    e.takeProfitPips,
                    T.BracketDefaultPips.TakeProfit,
                  ),
                (0, w.isDefined)(e.stopLossPips) &&
                  n.setStopLossPips(
                    s,
                    e.stopLossPips,
                    T.BracketDefaultPips.StopLoss,
                  ),
                (0, w.isDefined)(e.orderType) && n.setOrderType(s, e.orderType),
                (0, w.isDefined)(e.duration))
              ) {
                const t =
                    this._state.broker &&
                    this._state.broker.metainfo().durations,
                  i = t && (t.find((e) => e.default) || t[0]),
                  s = i && i.name === e.duration.type ? null : e.duration
                n.setDuration(this._state.symbol, o, s)
              }
              if (
                (0, w.isDefined)(e.customFields) &&
                null !== this._state.savableCustomFields
              ) {
                const t = ((e, t) => {
                  const i = { ...e }
                  if (void 0 === t) return i
                  for (const e of Object.keys(i)) t.has(e) || delete i[e]
                  return i
                })(e.customFields, this._state.savableCustomFields)
                n.setCustomFields(s, o, t)
              }
            }),
            (this._onOrderWidgetCloseButtonClicked = () => {
              this._mode.value() === T.OrderEditorDisplayMode.Panel
                ? this.closePanel()
                : this._closeOrderDialog()
            }),
            (this._onOrderWidgetStatusChanged = (e) => {
              var t
              e === T.OrderPanelStatus.Wait &&
                (null === (t = this._tradedContextLinking) ||
                  void 0 === t ||
                  t.setContext(null)),
                e === T.OrderPanelStatus.Active &&
                  void 0 !== this._placeOrderAbortController &&
                  this._updateTradedContextLinking(
                    this._placeOrderAbortController.signal,
                  )
            }),
            (this._onOrderWidgetBackButtonClicked = () => {
              if (
                this._orderViewModel &&
                this._orderViewModel.status.value() ===
                  T.OrderPanelStatus.Preview
              )
                return (
                  this._activateOrderTicket(),
                  void (this._mode.value() === T.OrderEditorDisplayMode.Panel
                    ? this._openOrderPanel()
                    : this._showOrderDialog())
                )
              this.showOrderView({
                order: this._createOrderStub(),
                isDeactivated: !0,
              })
            }),
            (this._onPositionWidgetModeChanged = async (e) => {
              e === T.OrderEditorDisplayMode.Panel
                ? (await this._closePositionDialog(),
                  await this._openPositionPanel())
                : (await this._closePositionPanel(),
                  await this._showPositionDialog()),
                this._setDisplayMode(e)
            }),
            (this._onPositionWidgetBackButtonClicked = () => {
              this._unmountPositionPanel(),
                this._unsubscribePositionViewModel(),
                this.showOrderView({
                  order: this._createOrderStub(),
                  isDeactivated: !0,
                })
            }),
            (this._onPositionWidgetCloseButtonClicked = () => {
              this._mode.value() === T.OrderEditorDisplayMode.Panel
                ? this.closePanel()
                : this._closePositionDialog()
            }),
            (this._isVisible = () =>
              this._mode.value() === T.OrderEditorDisplayMode.Panel
                ? this._isTradingPanelOpened.value()
                : this._dialogVisibility.getValue().isVisible),
            (this._onOrderTypeChanged = (e) => {
              this._setState({ orderType: e })
            }),
            (this._handleSymbolChange = () => {
              this._symbolChangePromise = this._onStatusChanged(null)
            })
          const {
            tradingCommands: t,
            tradingPanelCommands: i,
            qtySuggester: o,
            tradingLinking: u,
            orderViewHeaderState: d,
            tradedContextLinking: c,
          } = e
          if (
            ((this._orderViewHeaderState = d),
            (this._updateOrderValues = De(this._updateOrderValues, {
              timeout: 100,
            })),
            (this._updateTradedContextLinking = (0, Ae.respectLatest)(
              this._updateTradedContextLinking,
            )),
            (this._tradingCommands = t),
            (this._trackEvent = t.trackEvent),
            (this._realtimeProvider = t.realtimeProvider),
            (this._resizerBridge = t.resizerBridge),
            (this._orderViewDataStorage = new yt(s)),
            (this._tradingPanelContainer = i.container),
            (this._isOpeningTradingPanelAvailable = i.isOpeningAvailable),
            (this._isTradingPanelOpened = i.isOpened),
            (this._qtySuggester = o),
            (this._tradingLinking = u),
            (this._tradingPanelActivePage = i.activePage),
            (this._closeTradingPanel = i.close),
            (this._openTradingPanelPage = i.openPage),
            (this._getTradingSettingsStorage = t.getTradingSettingsStorage),
            (this.dialogVisibility = this._dialogVisibility.value$),
            window.matchMedia(mt.TradingLayoutBreakpoint.Mobile).matches)
          )
            this._setDisplayMode(T.OrderEditorDisplayMode.Popup)
          else if (n.enabled('order_panel')) {
            const e = this._orderViewDataStorage.widgetMode()
            this._setDisplayMode(null != e ? e : T.OrderEditorDisplayMode.Panel)
          } else this._setDisplayMode(T.OrderEditorDisplayMode.Popup)
          i.isOpeningAvailable.subscribe((e) => {
            e ||
              this._mode.value() !== T.OrderEditorDisplayMode.Panel ||
              this._setDisplayMode(T.OrderEditorDisplayMode.Popup)
          }),
            (this._state = this._makeState()),
            (this.stateChanging = gt.value),
            (this._onStatusChanged = (0, Ae.respectLatest)(
              this._onStatusChanged,
            )),
            (this._recreateOrderViewModel = gt.wrap(
              (0, Ae.respectLatest)(this._recreateOrderViewModel),
            )),
            (this.openPanel = gt.wrap(this.openPanel)),
            this._realtimeProvider.onStatusChanged.subscribe(null, () =>
              this._onStatusChanged(null),
            ),
            this._tradingLinking
              .valueObservable()
              .subscribe(this._handleSymbolChange),
            window.loginStateChange &&
              window.loginStateChange.subscribe(this, () =>
                this._onStatusChanged(null),
              ),
            i.activePage.subscribe(this._onActiveTradingPanelChanged),
            (this._tradedContextLinking = c)
        }
        async showOrderView(e) {
          try {
            const {
              order: t,
              focus: i,
              forceOrderDialog: s,
              isDeactivated: o = !1,
            } = e
            await this._closeOrderDialog(),
              await this._closePositionDialog(),
              s && this._setDisplayMode(T.OrderEditorDisplayMode.Popup)
            const n = Object.assign(this._createOrderStub(), t)
            return (
              t.symbol !== this._state.symbol &&
                this._setState({ symbol: t.symbol }),
              await this._recreateOrderViewModel(null, n),
              o && this._deactivateOrderTicket(),
              this._mode.value() === T.OrderEditorDisplayMode.Panel
                ? this._openOrderPanel(i)
                : this._showOrderDialog(i),
              (0, r.ensureNotNull)(this._orderViewModel).onDoneButtonClicked
                .promise
            )
          } catch (e) {
            return (
              St.logWarn(
                `Failed to show order view: ${(0, l.getLoggerMessage)(e)}`,
              ),
              !1
            )
          }
        }
        async showPositionView(e, t, i) {
          try {
            return (
              await this._symbolChangePromise,
              this._createAndShowPositionViewModel({
                position: e,
                viewType: pt.Position,
                brackets: t,
                focus: i,
              })
            )
          } catch (e) {
            return (
              St.logWarn(
                `Failed to show position view: ${(0, l.getLoggerMessage)(e)}`,
              ),
              !1
            )
          }
        }
        async showIndividualPositionView(e, t, i) {
          try {
            return (
              await this._symbolChangePromise,
              this._createAndShowPositionViewModel({
                position: e,
                viewType: pt.IndividualPosition,
                brackets: t,
                focus: i,
              })
            )
          } catch (e) {
            return (
              St.logWarn(
                `Failed to show individual position view: ${(0, l.getLoggerMessage)(e)}`,
              ),
              !1
            )
          }
        }
        mode() {
          return this._mode
        }
        _setState(e) {
          this._state = { ...this._state, ...e }
        }
        _setDisplayMode(e) {
          this._mode.setValue(e), this._orderViewDataStorage.setWidgetMode(e)
        }
        _makeState() {
          var e, t, i, s
          const r = window.is_authenticated,
            o = this._tradingLinking.value().symbol || '',
            n = this._realtimeProvider.activeBroker(),
            a = null == n ? void 0 : n.metainfo().configFlags,
            l = void 0 !== a ? (0, w.getDefaultOrderType)(a) : null,
            u =
              null !==
                (i =
                  null !==
                    (t =
                      null === (e = this._orderViewModel) || void 0 === e
                        ? void 0
                        : e.getOrderType()) && void 0 !== t
                    ? t
                    : l) && void 0 !== i
                ? i
                : null,
            d =
              null !== (s = null == n ? void 0 : n.currentAccount()) &&
              void 0 !== s
                ? s
                : null,
            c = n ? n.metainfo().id : ''
          return (
            this._orderViewDataStorage.setBrokerId(c),
            {
              isAuthenticated: r,
              broker: n,
              symbol: o,
              accountId: d,
              side: 1,
              orderType: u,
              savableCustomFields: null,
            }
          )
        }
        async _createAndShowPositionViewModel({
          position: e,
          viewType: t,
          brackets: i,
          focus: s,
        }) {
          await this._closeOrderDialog(),
            await this._closePositionDialog(),
            e.symbol !== this._state.symbol &&
              this._setState({ symbol: e.symbol }),
            null !== this._positionViewModel &&
              (this._positionViewModel.onDoneButtonClicked.reject(),
              this._unsubscribePositionViewModel()),
            null !== this._orderViewModel &&
              (this._orderViewModel.existingOrder &&
                this._orderViewModel.onDoneButtonClicked.reject(),
              this._unsubscribeOrderViewModel())
          const { broker: r, symbol: o } = this._state,
            n = r ? await r.isTradable(o) : null
          if (null === r || null === n || !n.tradable)
            return (
              await this.showOrderView({
                order: this._createOrderStub(),
              }),
              !1
            )
          const a = await r.getOrderDialogOptions(o),
            l =
              void 0 !== (null == a ? void 0 : a.customFields)
                ? wt(a.customFields)
                : void 0
          this._setState({ savableCustomFields: l })
          const u =
              t === pt.Position
                ? r.editPositionBrackets.bind(r)
                : r.editIndividualPositionBrackets.bind(r),
            d = new _t({
              adapter: r,
              position: e,
              brackets: i,
              mode: this._mode,
              settings: this._settings,
              realtimeProvider: this._tradingCommands.realtimeProvider,
              isUndockAllowed: this._isOpeningTradingPanelAvailable.value(),
              isVisible: this._isVisible,
              viewType: t,
              pipValueType$: this._tradingCommands.pipValueType$,
              handler: u,
              trackEvent: this._tradingCommands.trackEvent,
              orderDialogOptions: a,
              headerState: this._orderViewHeaderState,
            })
          return (
            (this._positionViewModel = d),
            await this._positionViewModel.onReady,
            this._positionViewModel !== d
              ? Promise.reject(
                  'PositionViewModel was recreated during the initialization',
                )
              : (this._subscribePositionViewModel(),
                this._mode.value() === T.OrderEditorDisplayMode.Panel
                  ? this._openPositionPanel(s)
                  : this._showPositionDialog(s),
                this._positionViewModel.onDoneButtonClicked.promise)
          )
        }
        _setSettings() {
          if (null === this._state.broker) return
          this._settings.unsubscribe(this._saveSettings)
          const e =
            this._state.broker.metainfo().configFlags.supportCryptoBrackets
          let t = this._orderViewDataStorage.getSettings() || Pt.defaultSettings
          e && (t = Object.assign({}, Pt.defaultCryptoBracketsSettings, t)),
            this._settings.setValue(t),
            this._settings.subscribe(this._saveSettings)
        }
        _createOrderStub() {
          return {
            limitPrice: void 0,
            stopPrice: void 0,
            qty: 0,
            side: void 0,
            symbol: this._state.symbol,
            type: void 0,
            takeProfit: void 0,
            stopLoss: void 0,
          }
        }
        _activateOrderTicket() {
          var e
          null === (e = this._orderViewModel) ||
            void 0 === e ||
            e.activateOrderTicket()
        }
        _deactivateOrderTicket() {
          var e
          null === (e = this._orderViewModel) ||
            void 0 === e ||
            e.deactivateOrderTicket()
        }
        _handleTradedContextChange(e) {
          null !== this._orderViewModel &&
            (null !== e
              ? e.source() !== Tt &&
                (this._orderViewModel.loading.setValue(
                  e.status() === ft.PlaceOrEditContextStatus.Loading,
                ),
                this._orderViewModel.status.setValue(Ct[e.type]),
                this._updateOrderValues(e.data()))
              : this._orderViewModel.resetOrderPanel())
        }
        async _openOrderPanel(e) {
          await this._mountOrderPanel(e),
            this._openTradingPanelPage(vt.TradingPage.OrderPanel)
        }
        async _mountOrderPanel(e) {
          const { mountOrderPanel: t } = await Mt()
          null !== this._orderViewModel &&
            t(
              this._orderViewModel,
              this._settings,
              this._tradingPanelContainer,
              (0, r.ensureNotNull)(this._resizerBridge).width,
              e,
              this._trackEvent,
            )
        }
        async _closeOrderPanel() {
          await this._unmountOrderPanel(), this._closeTradingPanel()
        }
        async _unmountOrderPanel() {
          const { unmountOrderPanel: e } = await Mt()
          e((0, r.ensureNotNull)(this._tradingPanelContainer))
        }
        async _showOrderDialog(e) {
          const { showOrderDialog: t } = await Mt()
          null !== this._orderViewModel &&
            t({
              viewModel: this._orderViewModel,
              settings: this._settings,
              focus: e,
              trackEvent: this._trackEvent,
              onOpen: (e) => {
                this._dialogVisibility.setValue({
                  isVisible: !0,
                  isFullScreen: e,
                })
              },
              onClose: () => {
                this._dialogVisibility.setValue({ isVisible: !1 })
              },
            })
        }
        async _closeOrderDialog() {
          const { closeOrderDialog: e } = await Mt()
          e(() => this._dialogVisibility.setValue({ isVisible: !1 }))
        }
        _subscribeOrderViewModel() {
          var e
          null === (e = this._tradedContextLinking) ||
            void 0 === e ||
            e
              .onContextChanged()
              .subscribe(this, this._handleTradedContextChange),
            (0, r.ensureNotNull)(this._orderViewModel)
              .onModeChanged()
              .subscribe(this, this._onOrderWidgetModeChanged),
            (0, r.ensureNotNull)(this._orderViewModel)
              .onInputStateChanged()
              .subscribe(this, this._onOrderWidgetInputStateChanged),
            (0, r.ensureNotNull)(this._orderViewModel)
              .onCloseButtonClicked()
              .subscribe(this, this._onOrderWidgetCloseButtonClicked),
            (0, r.ensureNotNull)(this._orderViewModel)
              .onBackButtonClicked()
              .subscribe(this, this._onOrderWidgetBackButtonClicked),
            (0, r.ensureNotNull)(this._orderViewModel).status.subscribe(
              this._onOrderWidgetStatusChanged,
            ),
            (this._orderTypeSubscription = (0, r.ensureNotNull)(
              this._orderViewModel,
            ).orderType$.subscribe(this._onOrderTypeChanged))
        }
        _unsubscribeOrderViewModel() {
          var e, t
          null === (e = this._tradedContextLinking) ||
            void 0 === e ||
            e
              .onContextChanged()
              .unsubscribe(this, this._handleTradedContextChange),
            (0, r.ensureNotNull)(this._orderViewModel)
              .onModeChanged()
              .unsubscribe(this, this._onOrderWidgetModeChanged),
            (0, r.ensureNotNull)(this._orderViewModel)
              .onInputStateChanged()
              .unsubscribe(this, this._onOrderWidgetInputStateChanged),
            (0, r.ensureNotNull)(this._orderViewModel)
              .onCloseButtonClicked()
              .unsubscribe(this, this._onOrderWidgetCloseButtonClicked),
            (0, r.ensureNotNull)(this._orderViewModel)
              .onBackButtonClicked()
              .unsubscribe(this, this._onOrderWidgetBackButtonClicked),
            (0, r.ensureNotNull)(this._orderViewModel).status.unsubscribe(
              this._onOrderWidgetStatusChanged,
            ),
            null === (t = this._orderTypeSubscription) ||
              void 0 === t ||
              t.unsubscribe(),
            (0, r.ensureNotNull)(this._orderViewModel).destroy(),
            (this._orderViewModel = null)
        }
        async _openPositionPanel(e) {
          await this._mountPositionPanel(e),
            this._openTradingPanelPage(vt.TradingPage.OrderPanel)
        }
        async _mountPositionPanel(e) {
          const { mountPositionPanel: t } = await $t()
          if (null !== this._positionViewModel)
            return t(
              this._positionViewModel,
              this._settings,
              this._tradingPanelContainer,
              e,
            )
        }
        async _closePositionPanel() {
          await this._unmountPositionPanel(), this._closeTradingPanel()
        }
        async _unmountPositionPanel() {
          const { unmountPositionPanel: e } = await $t()
          e(this._tradingPanelContainer)
        }
        async _showPositionDialog(e) {
          const { showPositionDialog: t } = await $t()
          null !== this._positionViewModel &&
            t({
              viewModel: this._positionViewModel,
              settings: this._settings,
              focus: e,
              onOpen: (e) => {
                this._dialogVisibility.setValue({
                  isVisible: !0,
                  isFullScreen: e,
                })
              },
              onClose: () => {
                this._dialogVisibility.setValue({ isVisible: !1 })
              },
            })
        }
        async _closePositionDialog() {
          const { closePositionDialog: e } = await $t()
          e(() => this._dialogVisibility.setValue({ isVisible: !1 }))
        }
        _subscribePositionViewModel() {
          ;(0, r.ensureNotNull)(this._positionViewModel)
            .onModeChanged()
            .subscribe(this, this._onPositionWidgetModeChanged),
            (0, r.ensureNotNull)(this._positionViewModel)
              .onBackButtonClicked()
              .subscribe(this, this._onPositionWidgetBackButtonClicked),
            (0, r.ensureNotNull)(this._positionViewModel)
              .onCloseButtonClicked()
              .subscribe(this, this._onPositionWidgetCloseButtonClicked)
        }
        _unsubscribePositionViewModel() {
          ;(0, r.ensureNotNull)(this._positionViewModel)
            .onModeChanged()
            .unsubscribe(this, this._onPositionWidgetModeChanged),
            (0, r.ensureNotNull)(this._positionViewModel)
              .onBackButtonClicked()
              .unsubscribe(this, this._onPositionWidgetBackButtonClicked),
            (0, r.ensureNotNull)(this._positionViewModel)
              .onCloseButtonClicked()
              .unsubscribe(this, this._onPositionWidgetCloseButtonClicked),
            (0, r.ensureNotNull)(
              this._positionViewModel,
            ).onDoneButtonClicked.resolve(!1),
            (0, r.ensureNotNull)(this._positionViewModel).destroy(),
            (this._positionViewModel = null)
        }
        _makeOrderViewInputState(e, t, i, s) {
          var r, o, n, a, l
          const u =
              null !== s && null !== t
                ? null === (r = this._getTradingSettingsStorage()) ||
                  void 0 === r
                  ? void 0
                  : r.customFields(e, t, Array.from(s))
                : null,
            d =
              null !== t
                ? null === (o = this._getTradingSettingsStorage()) ||
                  void 0 === o
                  ? void 0
                  : o.duration(e, t)
                : null
          return {
            symbol: e,
            side: i,
            orderType: t,
            limitPrice: null,
            stopPrice: null,
            quantity:
              (null === (n = this._getTradingSettingsStorage()) || void 0 === n
                ? void 0
                : n.symbolQty(e)) || null,
            orderSizeCalculatorState: null,
            takeProfitPips:
              (null === (a = this._getTradingSettingsStorage()) || void 0 === a
                ? void 0
                : a.takeProfitPips(e)) || null,
            takeProfitPrice: null,
            stopLossPips:
              (null === (l = this._getTradingSettingsStorage()) || void 0 === l
                ? void 0
                : l.stopLossPips(e)) || null,
            stopLossPrice: null,
            duration: d || null,
            customFields: u || null,
          }
        }
        _commonOrderViewModelProps() {
          return {
            order: this._orderStub,
            mode: this._mode,
            settings: this._settings,
            orderWidgetStat: this._orderWidgetStat,
            isUndockAllowed: this._isOpeningTradingPanelAvailable.value(),
            pipValueType$: this._tradingCommands.pipValueType$,
            onNeedSelectBroker: this._tradingCommands.onNeedSelectBroker,
            trackEvent: this._tradingCommands.trackEvent,
            toggleTradingWidget: this._tradingCommands.toggleTradingWidget,
            toggleTradingPanelPopup:
              this._tradingCommands.toggleTradingPanelPopup,
            showErrorNotification: this._tradingCommands.showErrorNotification,
            qtySuggester: this._qtySuggester,
            isVisible: this._isVisible,
            headerState: this._orderViewHeaderState,
            isCancelButtonAlwaysHidden: false,
          }
        }
      }
    },
    476007: (e, t, i) => {
      i.d(t, { SplitThousandsFormatter: () => o })
      var s = i(793361),
        r = i(710263)
      class o {
        constructor(e = ' ') {
          this._divider = e
        }
        format(e) {
          const t = (0, s.splitThousands)(e, this._divider)
          return (0, r.isRtl)() ? (0, r.startWithLTR)(t) : t
        }
        parse(e) {
          const t = (0, r.stripLTRMarks)(e).split(this._divider).join(''),
            i = Number(t)
          return isNaN(i) || /e/i.test(t)
            ? { res: !1 }
            : { res: !0, value: i, suggest: this.format(i) }
        }
      }
    },
    73359: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M9 6h11v.5c0 1.115-.442 2.004-1.273 2.593-.7.498-1.637.755-2.727.814v2.267c2.867.677 5 3.252 5 6.326v.5h-6v4h-1v-4H8v-.5a6.502 6.502 0 0 1 5-6.326V9.907c-1.09-.059-2.027-.316-2.727-.814C9.443 8.503 9 7.615 9 6.5V6zm1.043 1c.102.56.383.976.809 1.278.57.405 1.452.642 2.648.642h.5V13.006l-.417.07A5.503 5.503 0 0 0 9.023 18h10.955a5.503 5.503 0 0 0-4.56-4.924l-.418-.07V8.92h.5c1.196 0 2.078-.237 2.648-.642A1.93 1.93 0 0 0 18.958 7h-8.915z"/></svg>'
    },
    350146: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M16.621 4.6l.354.354 7.07 7.071.354.354-.353.353c-.789.789-1.73 1.104-2.734.934-.847-.144-1.691-.624-2.504-1.353l-1.603 1.603a6.502 6.502 0 0 1-.937 8.008l-.354.354-.354-.354-3.889-3.889-2.828 2.829-.707-.707 2.828-2.829-3.889-3.889-.353-.353.353-.354a6.502 6.502 0 0 1 8.009-.937l1.603-1.604c-.73-.812-1.21-1.656-1.353-2.503-.17-1.005.145-1.945.934-2.734l.353-.354zm.03 1.445a1.93 1.93 0 0 0-.331 1.476c.117.689.573 1.48 1.418 2.326l.354.354-.354.353-2.236 2.237-.3.299-.344-.246a5.503 5.503 0 0 0-6.706.258l3.873 3.873 3.873 3.873a5.503 5.503 0 0 0 .257-6.706l-.245-.345.299-.3 2.236-2.236.354-.353.354.353c.845.846 1.637 1.302 2.326 1.419a1.93 1.93 0 0 0 1.476-.332l-6.303-6.303z"/></svg>'
    },
  },
])
