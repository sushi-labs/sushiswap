;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1754],
  {
    89324: (e, o, t) => {
      t.r(o),
        t.d(o, {
          Components: () => h,
          showDefaultSearchDialog: () => c,
          showSymbolSearchItemsDialog: () => n.showSymbolSearchItemsDialog,
        })
      var a = t(82992),
        l = (t(32563), t(79652)),
        s = t(94664),
        n = t(1861),
        r = t(64147),
        i = t(84015)
      t(56570), t(49483)
      !(0, i.isOnMobileAppPage)('any') &&
        window.matchMedia('(min-width: 602px) and (min-height: 445px)').matches
      function c(e) {
        new r.WatchedValue({})
        const o = (0, s.getSymbolSearchCompleteOverrideFunction)(),
          {
            defaultValue: t,
            showSpreadActions: i,
            source: c,
            onSearchComplete: h,
            trackResultsOptions: m,
            ...d
          } = e,
          u = {
            ...d,
            showSpreadActions: i ?? (0, l.canShowSpreadActions)(),
            onSymbolFiltersParamsChange: void 0,
            onSearchComplete: (e, t) => {
              o(e[0].symbol, e[0].result).then((e) => {
                a.linking.setSymbolAndLogInitiator(e.symbol, 'symbol search'),
                  h?.(e.symbol)
              })
            },
            onEmptyResults: void 0,
          }
        ;(0, n.showSymbolSearchItemsDialog)({ ...u, defaultValue: t })
      }
      const h = {
        SymbolSearchWatchlistDialogContentItem: null,
        SymbolSearchWatchlistDialog: null,
      }
    },
    1861: (e, o, t) => {
      t.d(o, { showSymbolSearchItemsDialog: () => i })
      var a = t(50959),
        l = t(50655),
        s = t(51826),
        n = t(73280),
        r = t(87896)
      function i(e) {
        const {
          symbolTypeFilter: o,
          initialMode: t = 'symbolSearch',
          autofocus: i = !0,
          defaultValue: c,
          showSpreadActions: h,
          selectSearchOnInit: m,
          onSearchComplete: d,
          dialogTitle: u,
          placeholder: p,
          fullscreen: g,
          initialScreen: S,
          wrapper: y,
          dialog: b,
          contentItem: w,
          onClose: C,
          onOpen: O,
          footer: f,
          symbolTypes: I,
          searchInput: M,
          emptyState: D,
          hideMarkedListFlag: v,
          dialogWidth: A = 'auto',
          manager: F,
          shouldReturnFocus: k,
          onSymbolFiltersParamsChange: R,
          onEmptyResults: E,
          customSearchSymbols: P,
          enableOptionsChain: T,
        } = e
        if (
          s.dialogsOpenerManager.isOpened('SymbolSearch') ||
          s.dialogsOpenerManager.isOpened('ChangeIntervalDialog')
        )
          return
        const V = document.createElement('div'),
          W = a.createElement(
            l.SlotContext.Provider,
            { value: F ?? null },
            a.createElement(n.SymbolSearchItemsDialog, {
              symbolTypeFilter: o,
              onClose: x,
              initialMode: t,
              defaultValue: c,
              showSpreadActions: h,
              hideMarkedListFlag: v,
              selectSearchOnInit: m,
              onSearchComplete: d,
              dialogTitle: u,
              placeholder: p,
              fullscreen: g,
              initialScreen: S,
              wrapper: y,
              dialog: b,
              contentItem: w,
              footer: f,
              symbolTypes: I,
              searchInput: M,
              emptyState: D,
              autofocus: i,
              dialogWidth: A,
              shouldReturnFocus: k,
              onSymbolFiltersParamsChange: R,
              onEmptyResults: E,
              customSearchSymbols: P,
              enableOptionsChain: T,
            }),
          ),
          _ = (0, r.createReactRoot)(W, V)
        function x() {
          _.unmount(),
            s.dialogsOpenerManager.setAsClosed('SymbolSearch'),
            C && C()
        }
        return (
          s.dialogsOpenerManager.setAsOpened('SymbolSearch'),
          O && O(),
          { close: x }
        )
      }
    },
    51826: (e, o, t) => {
      t.d(o, { DialogsOpenerManager: () => a, dialogsOpenerManager: () => l })
      class a {
        constructor() {
          this._storage = new Map()
        }
        setAsOpened(e, o) {
          this._storage.set(e, o)
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
      const l = new a()
    },
  },
])
