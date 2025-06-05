;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7898],
  {
    244e3: (t, e, s) => {
      s.d(e, {
        changeDescription: () => f,
        create: () => p,
        exact: () => m,
        exclude: () => S,
        getListById: () => g,
        getListIds: () => L,
        getListsMap: () => T,
        insert: () => u,
        put: () => h,
        reducer: () => I,
        remove: () => y,
        rename: () => b,
        replace: () => d,
        setup: () => c,
      })
      var o = s(64482)
      function r(t, e) {
        if (t.length !== e.length) return !1
        for (let s = 0; s < t.length; ++s) if (t[s] !== e[s]) return !1
        return !0
      }
      const n = Symbol()
      const i = { lists: { ids: [], byId: {} }, timestamp: null }
      function l(t, e) {
        t.lists.ids.push(e.id),
          (t.lists.byId[e.id] = {
            id: e.id,
            name: e.name,
            description: e.description,
            symbols: [...e.symbols],
            shared: e.shared,
            timestamp: e.timestamp,
            collapsedSeparators: e.collapsedSeparators,
          })
      }
      const a = (0, o.createSlice)({
          name: 'custom-lists',
          initialState: i,
          reducers: {
            setup: (t, e) => {
              const { lists: s, timestamp: o } = e.payload,
                r = { lists: { ids: [], byId: {} }, timestamp: null }
              for (const t of s) l(r, t)
              return (r.timestamp = o), r
            },
            insert: (t, e) => {
              const { id: s, symbols: o, before: i } = e.payload,
                { lists: l } = t,
                a = l.byId[s]
              if (void 0 === a) return
              const c = new Set(o)
              let u
              if (void 0 !== i && c.has(i)) {
                u = n
                for (let t = a.symbols.indexOf(i); t >= 0; --t)
                  if (!c.has(a.symbols[t])) {
                    u = a.symbols[t]
                    break
                  }
              }
              const d = a.symbols.filter((t) => !c.has(t)),
                m = ((t, e, s) => {
                  const o =
                    void 0 === s
                      ? void 0 !== e
                        ? t.indexOf(e)
                        : void 0
                      : s === n
                        ? 0
                        : t.indexOf(s) + 1
                  return -1 !== o ? o : void 0
                })(d, i, u)
              void 0 === m ? d.push(...c) : d.splice(m, 0, ...c),
                r(d, a.symbols) || (a.symbols = d)
            },
            replace: (t, e) => {
              const { id: s, current: o, next: r } = e.payload,
                { lists: n } = t,
                i = n.byId[s]
              if (void 0 === i) return
              if (o === r) return
              let l = !1,
                a = !1
              const c = []
              for (const t of i.symbols) {
                if (t === r) {
                  a = !0
                  break
                }
                t === o ? (c.push(r), (l = !0)) : c.push(t)
              }
              l && !a && (i.symbols = c)
            },
            exact: (t, e) => {
              const { id: s, symbols: o } = e.payload,
                { lists: n } = t,
                i = n.byId[s]
              if (void 0 === i) return
              const l = [...new Set(o)]
              r(l, i.symbols) || (i.symbols = l)
            },
            exclude: (t, e) => {
              const { id: s, symbols: o } = e.payload,
                { lists: n } = t,
                i = n.byId[s]
              if (void 0 === i) return
              const l = new Set(o),
                a = i.symbols.filter((t) => !l.has(t))
              r(a, i.symbols) || (i.symbols = a)
            },
            remove: (t, e) => {
              const { id: s } = e.payload,
                { lists: o } = t
              if (void 0 === o.byId[s]) return
              const r = o.ids.filter((t) => t !== s)
              ;(o.ids = r), delete o.byId[s]
            },
            create: (t, e) => {
              const { id: s, name: o, symbols: r } = e.payload,
                { lists: n } = t
              void 0 === n.byId[s] &&
                l(t, {
                  id: s,
                  name: o,
                  symbols: r,
                  shared: !1,
                  description: null,
                  timestamp: null,
                })
            },
            put: (t, e) => {
              const {
                  id: s,
                  name: o,
                  description: r,
                  symbols: n,
                  shared: i,
                  timestamp: a,
                  collapsedSeparators: c,
                } = e.payload,
                { lists: u } = t
              void 0 === u.byId[s]
                ? l(t, {
                    id: s,
                    name: o,
                    description: r,
                    symbols: n,
                    shared: i,
                    timestamp: null != a ? a : null,
                  })
                : (u.byId[s] = {
                    id: s,
                    name: o,
                    description: r,
                    shared: i,
                    timestamp: null != a ? a : null,
                    symbols: [...n],
                    collapsedSeparators: c,
                  })
            },
            rename: (t, e) => {
              const { id: s, name: o } = e.payload,
                { lists: r } = t,
                n = r.byId[s]
              void 0 !== n && n.name !== o && (n.name = o)
            },
            changeDescription: (t, e) => {
              const { id: s, description: o } = e.payload,
                { lists: r } = t,
                n = r.byId[s]
              void 0 !== n && n.description !== o && (n.description = o)
            },
            share: (t, e) => {
              const { id: s, shared: o } = e.payload,
                { lists: r } = t,
                n = r.byId[s]
              void 0 !== n && n.shared !== o && (n.shared = o)
            },
          },
        }),
        {
          setup: c,
          insert: u,
          replace: d,
          exact: m,
          exclude: S,
          remove: y,
          create: p,
          put: h,
          rename: b,
          changeDescription: f,
          share: _,
        } = a.actions,
        { reducer: I } = a
      function T(t) {
        return t.lists.byId
      }
      function g(t, e) {
        var s
        return null !== (s = T(t)[e]) && void 0 !== s ? s : null
      }
      function L(t) {
        return t.lists.ids
      }
    },
    173850: (t, e, s) => {
      s.d(e, { SEPARATOR_PREFIX: () => o, isSeparatorItem: () => r })
      const o = '###'
      function r(t) {
        return t.startsWith(o)
      }
    },
    37914: (t, e, s) => {
      s.d(e, { quoteSessionAdapters: () => l })
      var o = s(650151),
        r = s(382563),
        n = s(398171)
      class i {
        constructor(t, e, s = 'watchlist') {
          ;(this._symbolDataHandlers = new Map()),
            (this._fastSymbols = new Set()),
            (this._subscribedSymbols = new Set()),
            (this._subscriptionSet = new Set()),
            (this._cancelSubscriptionSet = new Set()),
            (this._quoteSessionDataHandler = (t) => {
              const e = (0, o.ensureDefined)(t.symbolname),
                { filtered: s, keepSubscription: r } = this._applyDataFilters(t)
              r || this._unsubscribeSymbols([e]), this._setSymbolDataCache(e, s)
              const n = this._symbolDataHandlers.get(e)
              n && n(s)
            }),
            (this._clientId = t),
            (this._quoteSession = (0, r.getQuoteSessionInstance)(s)),
            (this._lastSymbolData = e || new Map())
        }
        destroy() {
          const t = Array.from(this._subscribedSymbols)
          this._unsubscribeSymbols(t)
        }
        addFastSymbol(t) {
          this._fastSymbols.has(t) ||
            !this._subscribedSymbols.has(t) ||
            (0, n.isSeparatorItem)(t) ||
            (this._fastSymbols.add(t),
            this._quoteSession.setFastSymbols(
              this._clientId,
              Array.from(this._fastSymbols),
            ))
        }
        removeFastSymbol(t) {
          this._fastSymbols.has(t) &&
            (this._fastSymbols.delete(t),
            this._quoteSession.setFastSymbols(
              this._clientId,
              Array.from(this._fastSymbols),
            ))
        }
        addSymbolDataHandler(t, e) {
          ;(0, n.isSeparatorItem)(t) || this._symbolDataHandlers.set(t, e)
        }
        removeSymbolDataHandler(t) {
          this._symbolDataHandlers.delete(t)
        }
        addToSubscriptionSet(t) {
          t.forEach((t) => {
            ;(0, n.isSeparatorItem)(t) || this._subscriptionSet.add(t)
          })
        }
        clearSubscriptionSet() {
          this._subscriptionSet.clear()
        }
        addToCancelSubscriptionSet(t) {
          t.forEach((t) => {
            ;(0, n.isSeparatorItem)(t) || this._cancelSubscriptionSet.add(t)
          })
        }
        commitSubscriptionChanges() {
          Array.from(this._subscriptionSet).forEach((t) => {
            this._cancelSubscriptionSet.has(t) &&
              (this._subscriptionSet.delete(t),
              this._cancelSubscriptionSet.delete(t))
          }),
            this._subscribeSymbols(Array.from(this._subscriptionSet)),
            this._subscriptionSet.clear(),
            this._unsubscribeSymbols(Array.from(this._cancelSubscriptionSet)),
            this._cancelSubscriptionSet.clear(),
            this._quoteSession.setFastSymbols(
              this._clientId,
              Array.from(this._fastSymbols),
            )
        }
        getLastSymbolData(t) {
          return this._lastSymbolData.get(t)
        }
        _subscribeSymbols(t) {
          this._quoteSession.subscribe(
            this._clientId,
            t,
            this._quoteSessionDataHandler,
          ),
            t.forEach((t) => this._subscribedSymbols.add(t))
        }
        _unsubscribeSymbols(t) {
          this._quoteSession.unsubscribe(
            this._clientId,
            t,
            this._quoteSessionDataHandler,
          ),
            t.forEach((t) => {
              this._subscribedSymbols.delete(t)
            })
        }
        _setSymbolDataCache(t, e) {
          var s
          const o =
            (null === (s = this._lastSymbolData.get(t)) || void 0 === s
              ? void 0
              : s.values) || {}
          this._lastSymbolData.set(t, { ...e, values: { ...o, ...e.values } })
        }
        _applyDataFilters(t) {
          return { filtered: t, keepSubscription: !0 }
        }
      }
      const l = new (class {
        constructor() {
          ;(this._adaptersMap = new Map()), (this._lastSymbolData = new Map())
        }
        destroy() {
          this._adaptersMap.forEach((t) => {
            t.forEach((t) => t.destroy())
          }),
            this._lastSymbolData.clear()
        }
        get(t, e = 'watchlist') {
          let s
          const o = this._adaptersMap.get(t)
          if (o) {
            const r = o.get(e)
            r ? (s = r) : ((s = new i(t, this._lastSymbolData, e)), o.set(e, s))
          } else {
            s = new i(t, this._lastSymbolData, e)
            const o = new Map()
            o.set(e, s), this._adaptersMap.set(t, o)
          }
          return s
        }
      })()
    },
    219769: (t, e, s) => {
      s.r(e),
        s.d(e, {
          addOrUpdateSymbolList: () => u,
          initWidget: () => i,
          removeSymbolList: () => d,
          selectAllSymbols: () => c,
          selectHotlist: () => S,
          selectNextAvailableSymbol: () => r,
          setSymbolLists: () => m,
          showContextMenu: () => n,
          updateActiveList: () => h,
          updateBulkPositions: () => p,
          updatePosition: () => y,
          updateWidget: () => l,
          updateWidgetOptions: () => a,
        })
      var o = s(70644)
      const r = (t, e, s, r) => ({
          type: o.SELECT_NEXT_AVAILABLE_SYMBOL,
          widgetId: t,
          currentSymbol: e,
          keyboardAction: s,
          cancelSetOnChart: r,
        }),
        n = (t, e, s, r) => ({
          type: o.SHOW_CONTEXT_MENU,
          symbol: e,
          position: b(s),
          widgetId: t,
          size: r,
        }),
        i = (t, e, s, r) => ({
          type: o.INIT_WIDGET,
          options: r,
          id: t,
          columns: s,
          tickerType: e,
        }),
        l = (t, e) => ({ type: o.UPDATE_WIDGET, widgetId: t, widget: e }),
        a = (t, e) => ({
          type: o.UPDATE_WIDGET_OPTIONS,
          widgetId: t,
          options: e,
        }),
        c = (t) => ({ type: o.SELECT_ALL_SYMBOLS, widgetId: t }),
        u = (t) => ({ type: o.ADD_OR_UPDATE_SYMBOL_LIST, symbolList: t }),
        d = (t) => ({ type: o.REMOVE_SYMBOL_LIST, id: t }),
        m = (t) => ({ type: o.SET_SYMBOL_LISTS, symbolLists: t }),
        S = (t, e, s) => ({
          type: o.SELECT_HOTLIST,
          widgetId: t,
          exchange: e,
          group: s,
        }),
        y = (t, e) => ({ type: o.UPDATE_POSITIONS, symbol: t, position: e }),
        p = (t) => ({ type: o.UPDATE_BULK_POSITIONS, map: t }),
        h = (t) => ({ type: o.UPDATE_ACTIVE_LIST, id: t })
      function b(t) {
        var e
        const s =
          null === (e = t.touches) || void 0 === e
            ? void 0
            : e.map((t) => ({ clientX: t.clientX, clientY: t.clientY }))
        return {
          clientX: t.clientX,
          clientY: t.clientY,
          touches: s,
          attachToXBy: t.attachToXBy,
          attachToYBy: t.attachToYBy,
          box: t.box,
        }
      }
    },
    356752: (t, e, s) => {
      s.d(e, {
        separatorIsCollapsedByListIdSelector: () => d,
        separatorIsCollapsedSelector: () => u,
      })
      var o = s(377145),
        r = s(650151),
        n = s(601373),
        i = s(706474)
      const l = (t, e, s) => s
      function a(t) {
        return t.collapsedSeparators
      }
      const c = (0, o.createSelector)(
          [a, n.getCurrentViewableWatchListByWidgetId],
          (t, e) => (e ? { ...t[e.id] } : {}),
        ),
        u = (0, o.createSelector)([c, l], (t, e) => S(t, e)),
        d = (0, o.createSelector)([a, (t, e) => e, l], (t, e, s) =>
          S({ ...t[e] }, s),
        )
      ;(0, o.createSelector)([a, n.getGlobalActiveSymbolList], (t, e) =>
        e ? m(e, { ...t[e.id] }) : [],
      ),
        (0, o.createSelector)([n.getCurrentViewableWatchListByWidgetId, c], m),
        (0, o.createSelector)(
          [n.getCurrentViewableWatchListByWidgetId, c, l],
          (t, e, s) => {
            if (!t) return []
            const { symbols: o } = t,
              n = ((t) => {
                const e = new Map()
                let s = ''
                return (
                  t.forEach((t) => {
                    ;(0, i.isValidSeparatorItem)(t)
                      ? ((s = t), e.set(s, []))
                      : s && (0, r.ensureDefined)(e.get(s)).push(t)
                  }),
                  e
                )
              })(o),
              l = []
            return (
              s.forEach((t) => {
                l.push(t)
                const s = n.get(t),
                  o = S(e, t)
                s && o && l.push(...s)
              }),
              l
            )
          },
        )
      function m(t, e) {
        if (!t) return []
        const { symbols: s } = t,
          o = []
        let r = !0
        return (
          s.forEach((t) => {
            const s = (0, i.isValidSeparatorItem)(t)
            ;(r || s) && o.push(t), s && (r = !S(e, t))
          }),
          o
        )
      }
      function S(t, e) {
        return !!Object.hasOwn(t, e) && t[e]
      }
    },
    70644: (t, e, s) => {
      s.d(e, {
        ADD_OR_UPDATE_SYMBOL_LIST: () => m,
        INIT_WIDGET: () => l,
        REMOVE_SYMBOL_LIST: () => y,
        SELECT_ALL_SYMBOLS: () => d,
        SELECT_HOTLIST: () => p,
        SELECT_NEXT_AVAILABLE_SYMBOL: () => r,
        SET_SYMBOL_LISTS: () => S,
        SHOW_CONTEXT_MENU: () => a,
        UPDATE_ACTIVE_LIST: () => h,
        UPDATE_BULK_POSITIONS: () => i,
        UPDATE_POSITIONS: () => n,
        UPDATE_WIDGET: () => c,
        UPDATE_WIDGET_OPTIONS: () => u,
      })
      const o = (0, s(215078).createActionTypeFactory)('WATCHLISTS'),
        r = o('SELECT_NEXT_AVAILABLE_SYMBOL'),
        n = o('UPDATE_POSITIONS'),
        i = o('UPDATE_BULK_POSITIONS'),
        l = o('INIT_WIDGET'),
        a = o('SHOW_CONTEXT_MENU'),
        c = o('UPDATE_WIDGET'),
        u = o('UPDATE_WIDGET_OPTIONS'),
        d = o('SELECT_ALL_SYMBOLS'),
        m = o('ADD_OR_UPDATE_SYMBOL_LIST'),
        S = o('SET_SYMBOL_LISTS'),
        y = o('REMOVE_SYMBOL_LIST'),
        p = o('SELECT_HOTLIST'),
        h = o('UPDATE_ACTIVE_LIST')
    },
    363940: (t, e, s) => {
      s.r(e),
        s.d(e, {
          addWatchlistSymbolsThunk: () => C,
          createWatchlistThunk: () => g,
          getActiveWatchlistThunk: () => k,
          getCustomWatchlistsThunk: () => L,
          putCustomWatchlistsThunk: () => E,
          removeWatchlistSymbolsThunk: () => D,
          removeWatchlistThunk: () => O,
          renameSeparatorThunk: () => B,
          renameWatchlistThunk: () => v,
          replaceWatchlistSymbolsThunk: () => A,
          setActiveWatchlistThunk: () => W,
          symbolListRepositorySaga: () => _,
          validateWatchListSymbols: () => I,
        })
      var o = s(336349),
        r = s(244e3),
        n = s(609838),
        i = s(33290),
        l = s(131148),
        a = s(219769),
        c = s(6835),
        u = s(153055),
        d = s(148442),
        m = s(601373),
        S = s(979359),
        y = s(697169)
      function* p() {
        for (yield (0, o.put)((0, y.asAction)(k(null))); ; ) {
          yield (0, o.take)([r.remove, r.setup])
          const t = yield (0, o.select)()
          null ===
            (0, m.getCurrentViewableListByWidgetId)(t, S.WATCHLIST_WIDGET_ID) &&
            (yield (0, o.put)((0, y.asAction)(k(null))))
        }
      }
      var h = s(156963),
        b = s(356752)
      const f = (0, c.getLogger)('Platform.Model.SymbolLists')
      function* _() {
        h.enabled('widget') || (yield (0, o.fork)(p))
      }
      function I(t) {
        return new Promise((e) => {
          resolveSymbolNameForAllDistinct(t).then((t) => {
            e(t)
          })
        })
      }
      function T(t, e, o) {
        ;(0, u.showWarning)(
          { title: e || n.t(null, void 0, s(33115)), text: t },
          o,
        )
      }
      function g(t) {
        const e = (0, i.service)(l.SYMBOL_LIST_REPOSITORY_BACKEND_SERVICE)
        return async (s, o) => {
          try {
            const o = await e.createWatchList(t)
            return null === o
              ? null
              : (s(
                  (0, r.create)({ id: o.id, name: o.name, symbols: o.symbols }),
                ),
                o.id)
          } catch (t) {
            return T(t.message), null
          }
        }
      }
      const L = (0, d.respectLatest)((t) => {
        const e = (0, i.service)(l.SYMBOL_LIST_REPOSITORY_BACKEND_SERVICE)
        return async (s, o) => {
          try {
            const o = await (0, d.respectAbort)(t, e.getCustomWatchLists()),
              n = Date.now()
            s(
              (0, r.setup)({
                lists: o.map((t) => ({
                  id: t.id,
                  name: t.name,
                  description: t.description,
                  symbols: t.symbols,
                  shared: t.shared,
                  collapsedSeparators: t.collapsedSeparators,
                  timestamp: n,
                })),
                timestamp: n,
              }),
            )
          } catch (t) {
            ;(0, d.skipAbortError)(t)
          }
        }
      })
      function E(t, e) {
        const s = (0, i.service)(l.SYMBOL_LIST_REPOSITORY_BACKEND_SERVICE)
        return async (o, n) => {
          try {
            const n = await (0, d.respectAbort)(t, s.putWatchList(e))
            o(
              (0, r.put)({
                id: n.id,
                name: n.name,
                description: n.description,
                symbols: n.symbols,
                shared: n.shared,
                collapsedSeparators: n.collapsedSeparators,
              }),
            )
          } catch (t) {
            ;(0, d.rethrowAbortError)(t), T(t.message)
          }
        }
      }
      function v(t, e, s) {
        const o = (0, i.service)(l.SYMBOL_LIST_REPOSITORY_BACKEND_SERVICE)
        return async (n, i) => {
          n((0, r.rename)({ id: e.id, name: s })),
            await (0, d.respectAbort)(t, o.renameWatchList(e, s))
        }
      }
      function A(t, e, s, o) {
        const n = (0, i.service)(l.SYMBOL_LIST_REPOSITORY_BACKEND_SERVICE)
        return async (o, i) => {
          'custom' === e.type
            ? (o((0, r.exact)({ id: e.id, symbols: s })),
              await (0, d.respectAbort)(t, n.replaceSymbols(e, s)))
            : f.logWarn('Trying to modify not a custom watchlist')
        }
      }
      function C(t, e, s, o) {
        const n = (0, i.service)(l.SYMBOL_LIST_REPOSITORY_BACKEND_SERVICE)
        return async (i, l) => {
          if ('custom' === e.type) {
            0, i((0, r.insert)({ id: e.id, symbols: s }))
            try {
              await (0, d.respectAbort)(t, n.addSymbols(e, s))
            } catch (t) {
              if ((0, d.isAbortError)(t)) throw t
              const n = e.symbols.filter((t) => !s.includes(t))
              i((0, r.exact)({ id: e.id, symbols: n })), T(t.message, void 0, o)
            }
          } else f.logWarn('Trying to modify not a custom watchlist')
        }
      }
      function D(t, e, s) {
        const o = (0, i.service)(l.SYMBOL_LIST_REPOSITORY_BACKEND_SERVICE)
        return async (n, i) => {
          n((0, r.exclude)({ id: e.id, symbols: s })),
            await (0, d.respectAbort)(t, o.removeSymbols(e, s))
        }
      }
      function O(t, e) {
        const s = (0, i.service)(l.SYMBOL_LIST_REPOSITORY_BACKEND_SERVICE)
        return async (o, n) => {
          await (0, d.respectAbort)(t, s.removeWatchList(e)),
            o((0, r.remove)({ id: e.id }))
        }
      }
      function W(t, e) {
        const s = (0, i.service)(l.SYMBOL_LIST_REPOSITORY_BACKEND_SERVICE)
        return async (o, r) => {
          o((0, a.updateActiveList)(e)),
            await (0, d.respectAbort)(t, s.setActive(e))
        }
      }
      function w(t, e, s) {
        return async (o, n) => {
          const i = (0, b.separatorIsCollapsedByListIdSelector)(n(), t, e)
          o((0, r.replace)({ id: t, current: e, next: s })),
            i &&
              o(
                setSeparatorsCollapseLocal({
                  listId: t,
                  values: { [s]: !0, [e]: !1 },
                }),
              )
        }
      }
      function B(t, e, s, o) {
        const r = (0, i.service)(l.SYMBOL_LIST_REPOSITORY_BACKEND_SERVICE)
        return async (n, i) => {
          'custom' === e.type
            ? (n(w(e.id, s, o)),
              await (0, d.respectAbort)(
                t,
                r
                  .renameSeparator(e.id, s, o)
                  .catch(d.skipAbortError)
                  .catch((t) => {
                    T(t.message), n(w(e.id, o, s))
                  }),
              ))
            : f.logWarn('Trying to modify not a custom watchlist')
        }
      }
      const k = (0, d.respectLatest)((t) => {
        const e = (0, i.service)(l.SYMBOL_LIST_REPOSITORY_BACKEND_SERVICE)
        return async (s, o) => {
          try {
            const o = await (0, d.respectAbort)(t, e.getActive())
            'custom' !== o.type ||
              s(
                (0, r.put)({
                  id: o.id,
                  name: o.name,
                  description: o.description,
                  symbols: o.symbols,
                  shared: o.shared,
                  collapsedSeparators: o.collapsedSeparators,
                }),
              ),
              s((0, a.updateActiveList)('custom' === o.type ? o.id : o.color))
          } catch (t) {
            ;(0, d.skipAbortError)(t)
          }
        }
      })
    },
    697169: (t, e, s) => {
      function o(t) {
        return t
      }
      s.d(e, { asAction: () => o })
    },
    601373: (t, e, s) => {
      s.d(e, {
        columnsSelector: () => h,
        getCurrentViewableListByWidgetId: () => v,
        getCurrentViewableWatchListByWidgetId: () => A,
        getCustomListById: () => L,
        getCustomLists: () => I,
        getCustomListsMap: () => g,
        getGlobalActiveID: () => u,
        getGlobalActiveSymbolList: () => E,
        getIsReadyCustomLists: () => T,
        highlightedSymbolsSelector: () => p,
        isLoadingSelector: () => C,
        makeGetIsContainedByMultiSelection: () => O,
        positionSelector: () => D,
        scrollToIdSelector: () => S,
        selectedSymbolsSelector: () => m,
        shouldDisplayPositionsSelector: () => _,
        sortingSelector: () => y,
        tickerTypeSelector: () => b,
        widgetOptionsSelector: () => f,
        widgetSelector: () => d,
      })
      var o = s(377145),
        r = s(650151),
        n = s(244e3)
      function i(t) {
        return {
          type: 'custom',
          id: t.id,
          name: t.name,
          description: t.description,
          symbols: t.symbols,
          shared: t.shared,
        }
      }
      function l(t) {
        return t.customLists
      }
      const a = (t) => t.widgets,
        c = (t, e) => e,
        u = (t) => t.activeSymbolList,
        d = (0, o.createSelector)([a, c], (t, e) => t[e] || {}),
        m = (0, o.createSelector)(d, (t) => t.selectedSymbols || []),
        S = (0, o.createSelector)(d, (t) => t.scrollToId),
        y = (0, o.createSelector)(d, (t) => t.sorting || null),
        p = (0, o.createSelector)(d, (t) => t.highlightedSymbols || null),
        h = (0, o.createSelector)(d, (t) => t.columns),
        b = (0, o.createSelector)(d, (t) => t.tickerType),
        f = (0, o.createSelector)(d, (t) => t.options || {}),
        _ = (0, o.createSelector)(
          [f, (t) => t.isAuthenticated],
          (t, e) => t.shouldDisplayPositions && !0,
        ),
        I = (0, o.createSelector)(l, (t) =>
          (0, n.getListIds)(t).map((e) =>
            i((0, r.ensureNotNull)((0, n.getListById)(t, e))),
          ),
        ),
        T = (0, o.createSelector)([l], (t) => null !== t.timestamp),
        g = (0, o.createSelector)([l], n.getListsMap),
        L = (0, o.createSelector)([l, (t, e) => e], (t, e) => {
          const s = (0, n.getListById)(t, e)
          return null === s ? null : i(s)
        }),
        E =
          ((0, o.createSelector)([() => null], (t) =>
            t ? t.lists.byColor : null,
          ),
          (0, o.createSelector)([l, () => null, u], (t, e, s) => {
            if (null === s) return null
            {
              const e = (0, n.getListById)(t, s)
              return null === e ? null : i(e)
            }
          })),
        v = (0, o.createSelector)(
          [() => null, l, () => null, a, c],
          (t, e, s, o, r) => {
            const l = o[r]
            if (void 0 === l) return null
            const a = l.listId
            if (null === a) return null
            const c = (0, n.getListById)(e, a)
            return null !== c ? i(c) : null
          },
        ),
        A = (0, o.createSelector)([v], (t) =>
          t && 'hot' !== t.type ? t : null,
        )
      const C = (0, o.createSelector)(
          [d, v],
          (t, e) => null === e || t.isLoading || !1,
        ),
        D = (0, o.createSelector)(
          [(t) => t.positions, (t, e) => e],
          (t, e) => t[e],
        )
      function O() {
        const t = (0, o.createSelector)(
            [(t, e) => e.widgetId, (t) => t.widgets],
            (t, e) => e[t],
          ),
          e = (0, o.createSelector)(t, (t) => t.selectedSymbols || []),
          s = (0, o.createSelector)(e, (t) => new Set(t))
        return (0, o.createSelector)(
          [s, (t, e) => e.symbol],
          (t, e) => t.size > 1 && t.has(e),
        )
      }
    },
    607898: (t, e, s) => {
      s.r(e),
        s.d(e, {
          addSymbolsThunk: () => g,
          addSymbolsToCustomListThunk: () => O,
          changeDescriptionThunk: () => N,
          clearSymbolListThunk: () => A,
          findInWatchlistThunk: () => C,
          insertSymbolBeforeThunk: () => w,
          markSymbolsThunk: () => I,
          moveSymbolsToCustomListThunk: () => W,
          openSectionBySymbolThunk: () => P,
          removeSelectedSymbolsThunk: () => f,
          removeSymbolsThunk: () => T,
          renameSymbolListThunk: () => v,
          reorderSymbolsThunk: () => h,
          saveListAsThunk: () => R,
          selectSymbolListThunk: () => B,
          sortSymbolsThunk: () => b,
          updateScrollToIdThunk: () => D,
          userCreateWatchlistThunk: () => k,
        })
      var o = s(650151),
        r = s(244e3),
        n = s(609838),
        i = (s(32133), s(219769)),
        l = s(601373),
        a = s(398171),
        c = s(706474),
        u = s(979359),
        d = s(363940),
        m = s(148442),
        S = s(626800),
        y = s(153055),
        p = s(354364)
      s(156963)
      function h(t, e) {
        return (s, o) => {
          const r = o(),
            { isMovable: n } = (0, l.widgetOptionsSelector)(r, t)
          if (!n) return
          const i = (0, l.getCurrentViewableListByWidgetId)(r, t)
          if (null === i) return
          if ('hot' === i.type) return
          const a = e
          if ('custom' === i.type) {
            const t = { ...i, symbols: a }
            s((0, d.replaceWatchlistSymbolsThunk)(null, t, a))
          } else 0
        }
      }
      function b(t, e, s) {
        return (n, a) => {
          const u = a(),
            m = (0, l.getCurrentViewableListByWidgetId)(u, t)
          if (null === m) return
          if ('hot' === m.type) return
          const { symbolsBeforeSorting: S } = (0, l.widgetSelector)(u, t),
            y = (0, l.sortingSelector)(u, t),
            p = m.symbols
          let h
          if (null === e) h = (0, o.ensureNotNull)(S)
          else {
            const { column: o, direction: r } = e
            h = (0, c.sortSymbols)(t, p, o, r, s)
          }
          'custom' === m.type &&
            (n((0, r.exact)({ id: m.id, symbols: h })),
            n((0, d.replaceWatchlistSymbolsThunk)(null, m, h))),
            n(
              (0, i.updateWidget)(t, {
                symbolsBeforeSorting: null === y ? [...p] : S,
                sortingListId: m.id,
                sorting: e,
              }),
            )
        }
      }
      function f(t) {
        return (e, s) => {
          const o = s(),
            r = (0, l.getCurrentViewableListByWidgetId)(o, t)
          if (null === r) return
          if ('hot' === r.type) return
          const { isDeletable: n } = (0, l.widgetOptionsSelector)(o, t)
          if (!n) return
          const a = (0, l.selectedSymbolsSelector)(o, t)
          if (0 === a.length) return
          const u = a[a.length - 1],
            d = r.symbols[r.symbols.length - 1],
            m = r.symbols.some((t) => t === u),
            S = () => {
              e(
                m && u !== d
                  ? (0, i.selectNextAvailableSymbol)(t, u, 'next', !0)
                  : (0, i.updateWidget)(t, { selectedSymbols: [] }),
              ),
                'custom' === r.type && e(_(a, r)),
                (0, c.trackRemoveEvent)(a.length > 1)
            }
          if (1 === a.length) return void S()
          const p = document.activeElement
          ;(0, y.showConfirm)({
            text: (0, c.createConfirmRemoveText)(a.length),
            onConfirm: ({ dialogClose: t }) => {
              S(), t()
            },
            onClose: () => {
              null == p || p.focus()
            },
          })
        }
      }
      function _(t, e) {
        return (s, o) => {
          if ('custom' !== e.type);
          else {
            const o = { ...e, symbols: e.symbols.filter((e) => !t.includes(e)) }
            s((0, d.removeWatchlistSymbolsThunk)(null, o, t))
          }
        }
      }
      function I(t, e, s, o) {
        return (t, e) => {}
      }
      function T(t, e, s, o) {
        return (r, n) => {
          const i = n(),
            a = s
              ? (0, l.getCustomListById)(i, s)
              : (0, l.getCurrentViewableListByWidgetId)(i, t)
          if (null === a) return
          if ('hot' === a.type) return
          const u = new Set((0, l.selectedSymbolsSelector)(i, t)),
            m = u.has(e) && !o ? Array.from(u) : [e],
            S = () => {
              'custom' === a.type &&
                r((0, d.removeWatchlistSymbolsThunk)(null, a, m)),
                (0, c.trackRemoveEvent)(m.length > 1),
                r(
                  (a.id,
                  (t, e) => {
                    e()
                  }),
                )
            }
          if (1 === m.length || Boolean(s)) return void S()
          const p = document.activeElement
          ;(0, y.showConfirm)({
            text: (0, c.createConfirmRemoveText)(m.length),
            onConfirm: ({ dialogClose: t }) => {
              S(), t()
            },
            onClose: () => {
              null == p || p.focus()
            },
          })
        }
      }
      function g(t, e, s) {
        return (o, r) => {
          const n = r(),
            i = (0, l.getCurrentViewableListByWidgetId)(n, t)
          if (null === i) return
          if ('hot' === i.type) return
          Promise.resolve(e).then((e) => {
            var r
            let n
            'custom' === i.type && o(E(e, i, s)),
              n ||
                (n = null !== (r = e[e.length - 1]) && void 0 !== r ? r : null),
              o(L(t, e, n))
          })
        }
      }
      function L(t, e, s, o) {
        return (r, n) => {
          ;(e = e.slice(0, 10)),
            (0, p.expandWatchlist)(),
            (t !== u.WATCHLIST_WIDGET_ID ||
              n().widgets[u.WATCHLIST_WIDGET_ID]) &&
              (s && o && r(P(s, t)),
              r(
                (0, i.updateWidget)(t, {
                  highlightedSymbols: [...e],
                  scrollToId: s ? { id: s } : null,
                }),
              ),
              setTimeout(
                () => r((0, i.updateWidget)(t, { highlightedSymbols: null })),
                500,
              ))
        }
      }
      function E(t, e, s, o) {
        return (r, n) => {
          const i = new Set(e.symbols),
            l = t.filter((t) => !i.has(t) && !i.has((0, S.safeShortName)(t)))
          if (l.length) {
            const t = [...e.symbols],
              n = s ? e.symbols.indexOf(s) : -1
            ;-1 === n ? t.push(...l) : t.splice(n + 1, 0, ...l)
            const i = { ...e, symbols: t }
            r(
              -1 === n
                ? (0, d.addWatchlistSymbolsThunk)(null, i, l, o)
                : (0, d.replaceWatchlistSymbolsThunk)(null, i, t, o),
            )
          }
        }
      }
      function v(t, e) {
        return (s, r) => {
          const n = r()
          {
            const r = (0, o.ensureNotNull)((0, l.getCustomListById)(n, t))
            s((0, d.renameWatchlistThunk)(null, r, e))
          }
        }
      }
      function A(t) {
        return (e, s) => {
          const o = s(),
            r = (0, l.getCustomListById)(o, t)
          if (null !== r && 0 !== r.symbols.length) {
            if ('colored' === r.type) {
              e(remove({ color: r.color, symbols: r.symbols }))
            } else
              e(
                (0, d.replaceWatchlistSymbolsThunk)(
                  null,
                  { ...r, symbols: [] },
                  [],
                ),
              )
            e(
              (r.symbols,
              (t, e) => {
                e()
              }),
            )
          }
        }
      }
      function C(t, e) {
        return L(t, [e], e, !0)
      }
      function D(t, e) {
        return (s, o) => {
          const r = o(),
            n = (0, l.getCurrentViewableListByWidgetId)(r, t)
          if (!n) return
          const { symbols: a } = n
          a.includes(e) && s((0, i.updateWidget)(t, { scrollToId: { id: e } }))
        }
      }
      function O(t, e, s, o, r = !0) {
        return (n, i) => {
          var c
          const u = i(),
            d = (0, l.getCustomListById)(u, e)
          if (d) {
            const i = s.filter((t) => !(0, a.isSeparatorItem)(t))
            if (
              (n(E(i, d, void 0, o)), (0, l.getGlobalActiveID)(u) === e && r)
            ) {
              const e =
                null !== (c = i[i.length - 1]) && void 0 !== c ? c : null
              n(L(t, i, e))
            }
          }
        }
      }
      function W(t, e, s) {
        return async (o, r) => {
          const n = r(),
            i = (0, l.getCustomListById)(n, e),
            c = s.filter((t) => !(0, a.isSeparatorItem)(t))
          i && o(E(c, i))
          const u = (0, l.getCustomListById)(n, t)
          u && o((0, d.removeWatchlistSymbolsThunk)(null, u, s))
        }
      }
      function w(t, e, s) {
        return (o, r) => {
          const n = r(),
            i = (0, l.getCurrentViewableListByWidgetId)(n, t)
          if (null === i) return
          if ('hot' === i.type) return
          const { symbols: a } = i
          if (!a.includes(s))
            if ('custom' === i.type) {
              const t = a.indexOf(e),
                r = [...a.slice(0, t), s, ...a.slice(t)],
                n = { ...i, symbols: r }
              o((0, d.replaceWatchlistSymbolsThunk)(null, n, r))
            } else 0
        }
      }
      const B = (0, m.respectLatest)((t, e) => async (t, s) => {
        try {
          const r = (0, o.ensureNotNull)((0, l.getCustomListById)(s(), e))
          if (
            (t(
              (0, d.setActiveWatchlistThunk)(
                null,
                'custom' === r.type ? r.id : r.color,
              ),
            ),
            !s().widgets[u.WATCHLIST_WIDGET_ID])
          )
            return void (0, p.expandWatchlist)()
          t(
            (0, i.updateWidget)(u.WATCHLIST_WIDGET_ID, {
              isLoading: !1,
              listId: r.id,
              sorting: null,
              symbolsBeforeSorting: null,
              sortingListId: null,
              selectedSymbols: [],
              scrollToId: null,
            }),
          ),
            (0, p.expandWatchlist)()
        } catch (t) {
          ;(0, m.skipAbortError)(t)
        }
      })
      const k = (0, m.respectLatest)((t, e, r, i) => async (a, u) => {
        try {
          if (!(0, c.canUseMultipleLists)()) return
          if (!e || void 0 === e.name) {
            const o = await (0, m.respectAbort)(
              t,
              (0, c.createSaveRenameDialog)(
                n.t(null, void 0, s(279984)),
                void 0,
                i,
              )(),
            )
            e = { name: o, symbols: (null == e ? void 0 : e.symbols) || [] }
          }
          0
          const S = (0, d.createWatchlistThunk)(e),
            y = await (0, m.respectAbort)(t, a(S))
          if (null === y) return
          if ((a(B(null, y)), r)) {
            const t = (0, l.getCustomListById)(u(), r)
            if (!t) return
            await a(_((0, o.ensureDefined)(e.symbols), (0, o.ensureDefined)(t)))
          }
        } catch (t) {
          ;(0, m.skipAbortError)(t)
        }
      })
      function R(t, e, r = !0, i) {
        return async (t, a) => {
          if (!(0, c.canUseMultipleLists)()) return
          const m = await (0, c.createSaveRenameDialog)(
            n.t(null, void 0, s(799217)),
            i,
          )()
          if (!e) {
            const t = (0, o.ensureNotNull)(
              (0, l.getCurrentViewableListByWidgetId)(
                a(),
                u.WATCHLIST_WIDGET_ID,
              ),
            )
            e = t.symbols
          }
          const S = (0, d.createWatchlistThunk)({ name: m, symbols: e }),
            y = await t(S)
          null !== y && r && t(B(null, y))
        }
      }
      function N(t, e) {
        return async (t, e) => {}
      }
      function P(t, e) {
        return async (t, e) => {}
      }
    },
    706474: (t, e, s) => {
      s.d(e, {
        buildUniqueName: () => b,
        canUseMultipleLists: () => f,
        compareSymbols: () => A,
        convertToSeparatorName: () => h,
        createConfirmRemoveText: () => B,
        createSaveRenameDialog: () => I,
        createWatchList: () => v,
        findNextAvailableSymbol: () => W,
        getSymbolFromList: () => O,
        isEqualRecords: () => D,
        isImportDataValid: () => _,
        isValidSeparatorItem: () => y,
        separatorValToDisplayVal: () => p,
        sortSymbols: () => g,
        toPositionRecord: () => C,
        trackRemoveEvent: () => w,
      })
      var o = s(650151),
        r = s(609838),
        n = s(156963),
        i = s(153055),
        l = s(662654),
        a = s(37914),
        c = s(104728),
        u = s(398171),
        d = s(173850),
        m = s(32133),
        S = s(626800)
      function y(t) {
        return (0, u.isSeparatorItem)(t)
      }
      function p(t) {
        return t.replace(d.SEPARATOR_PREFIX, '')
      }
      function h(t) {
        return d.SEPARATOR_PREFIX + t
      }
      function b(t, e, s = !0) {
        const o = new Set(t),
          r = s ? ' 1' : ''
        if (!o.has(e + r)) return e + r
        let n = 2,
          i = ''
        while (n <= 2e3 && ((i = `${e} ${n}`), o.has(i))) n += 1
        return i
      }
      function f() {
        return n.enabled('multiple_watchlists') && !0
      }
      function _(t) {
        return (
          'string' == typeof t &&
          !/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(t) &&
          !/^[\r\n\t,]*$/.test(t)
        )
      }
      function I(t, e, o) {
        return () =>
          new Promise((n) => {
            ;(0, i.showRename)(
              {
                title: t,
                initValue: e,
                text: r.t(null, void 0, s(83796)) + ':',
                maxLength: 128,
                onRename: ({ newValue: t, dialogClose: e }) => {
                  n(t), e()
                },
              },
              o,
            )
          })
      }
      function T(t) {
        return t.replace('−', '-')
      }
      function g(t, e, s, r, n) {
        const i = ((t) => {
          const e = [],
            s = []
          t.forEach((t, e) => {
            ;(0, u.isSeparatorItem)(t) && s.push(e)
          })
          let o = 0
          s.forEach((s) => {
            e.push({ values: t.slice(o, s), separator: t[s] }), (o = s + 1)
          })
          const r = s[s.length - 1],
            n = t.slice(r + 1)
          return n.length > 0 && e.push({ values: n, separator: null }), e
        })(e)
        return (
          i.forEach((e) => {
            e.values.sort((e, i) => {
              const u = a.quoteSessionAdapters.get(t).getLastSymbolData(e),
                d = a.quoteSessionAdapters.get(t).getLastSymbolData(i),
                m = L(u),
                y = L(d),
                p = (t, e) => {
                  if (!t || 'flag' === s) return
                  var o
                  return 'error' === t.status
                    ? void 0
                    : n === l.TickerType.Description && 'short_name' === s
                      ? ((o = t.values),
                        (0, c.getTranslatedSymbolDescription)(o) ||
                          (0, S.safeShortName)(e))
                      : t.values[s]
                },
                h = p(u, e),
                b = p(d, i)
              return ((t, e) => {
                const s = -1 === e ? -1 / 0 : 1 / 0
                return (r, n, i, l) => {
                  if ('rchp' !== t) {
                    if (void 0 === r && void 0 === n) return 0
                    if (void 0 === r) return -e
                    if (void 0 === n) return e
                  }
                  switch (t) {
                    case 'short_name':
                      return (
                        e *
                        (r === n
                          ? 0
                          : (0, o.ensure)(r) < (0, o.ensure)(n)
                            ? -1
                            : 1)
                      )
                    case 'rchp':
                      return i !== l
                        ? i > l
                          ? -1
                          : 1
                        : (i || (r = void 0), l || (n = void 0), E(r, n, e, s))
                    case 'last_price':
                    case 'change':
                    case 'change_percent':
                      return E(r, n, e, s)
                    case 'volume': {
                      const t = (0, o.ensure)(r) >= 1e100 ? s : Number(r),
                        i = (0, o.ensure)(n) >= 1e100 ? s : Number(n)
                      return e * (t - i)
                    }
                    default:
                      return (0, o.ensure)(r) > (0, o.ensure)(n) ? -1 : 1
                  }
                }
              })(s, r)(h, b, m, y)
            })
          }),
          ((t) => {
            const e = []
            return (
              t.forEach(({ values: t, separator: s }) => {
                e.push(...t), null !== s && e.push(s)
              }),
              e
            )
          })(i)
        )
      }
      function L(t) {
        if (!t) return !1
        const e = 'pre_market' === t.values.current_session,
          s = 'post_market' === t.values.current_session
        return e || s
      }
      function E(t, e, s, o) {
        let r = Number.parseFloat(T(String(t))),
          n = Number.parseFloat(T(String(e)))
        return (r = isNaN(r) ? o : r), (n = isNaN(n) ? o : n), s * (r - n)
      }
      function v(t, e, s) {
        return {
          type: 'custom',
          id: t,
          name: e,
          description: null,
          symbols: s,
          shared: !1,
        }
      }
      function A(t, e) {
        return t === e || (0, S.safeShortName)(t) === e
      }
      function C(t) {
        return {
          symbol: t.symbol,
          side: t.side,
          qty: t.qty,
          avgPrice: t.avgPrice,
        }
      }
      function D(t, e) {
        return (
          t === e ||
          (void 0 !== t &&
            void 0 !== e &&
            t.side === e.side && t.qty === e.qty && t.avgPrice === e.avgPrice &&
            t.symbol === e.symbol)
        )
      }
      function O(t, e) {
        if (e.includes(t)) return t
        {
          const s = (0, S.safeShortName)(t)
          if (e.includes(s)) return s
        }
      }
      function W(t, e, s) {
        const o = 'next' === s
        for (let s = t; o ? s < e.length : s >= 0; o ? s++ : s--)
          if (!(0, u.isSeparatorItem)(e[s]) && s !== t) return e[s]
        for (let s = o ? 0 : e.length - 1; o ? s < t : s > t; o ? s++ : s--)
          if (!(0, u.isSeparatorItem)(e[s])) return e[s]
      }
      function w(t) {
        t
          ? (0, m.trackEvent)('Watchlist', 'Multi select', 'Remove')
          : (0, m.trackEvent)('Watchlist', 'Remove')
      }
      function B(t) {
        return r.t(
          null,
          {
            plural: 'Do you really want to delete {count} selected symbols?',
            context: 'symbols_and_drawings_count',
            count: t,
            replace: { count: t.toString() },
          },
          s(222045),
        )
      }
    },
    398171: (t, e, s) => {
      s.d(e, { isSeparatorItem: () => r })
      var o = s(173850)
      function r(t) {
        return (0, o.isSeparatorItem)(t)
      }
    },
    626800: (t, e, s) => {
      s.d(e, { safeShortName: () => r })
      var o = s(949345)
      function r(t) {
        try {
          return (0, o.shortName)(t)
        } catch (e) {
          return t
        }
      }
    },
  },
])
