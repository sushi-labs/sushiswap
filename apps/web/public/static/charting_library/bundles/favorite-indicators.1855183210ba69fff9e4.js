;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9790],
  {
    23390: (e, t, r) => {
      r.r(t),
        r.d(t, {
          favoriteAdded: () => a,
          favoriteRemoved: () => o,
          favoritesSynced: () => s,
          isFavorite: () => u,
          saveFavorites: () => l,
          toggleFavorite: () => f,
        })
      var i = r(52033),
        n = r(56840)
      const a = new i.Delegate(),
        o = new i.Delegate(),
        s = new i.Delegate()
      let c = []
      function f(e) {
        return -1 === d(e)
          ? (((e) => {
              !u(e) && (c.push(e), l(), a.fire(e))
            })(e),
            !0)
          : (((e) => {
              const t = d(e)
              ;-1 !== t && (c.splice(t, 1), l(), o.fire(e))
            })(e),
            !1)
      }
      function u(e) {
        return -1 !== d(e)
      }
      function d(e) {
        return c.indexOf(e)
      }
      function v() {
        c = []
        const e = Boolean(
            void 0 === (0, n.getValue)('chart.favoriteLibraryIndicators'),
          ),
          t = (0, n.getJSON)('chart.favoriteLibraryIndicators', [])
        if (
          (c.push(...t), 0 === c.length && e && 'undefined' != typeof window)
        ) {
          const e = JSON.parse(window.urlParams?.favorites ?? '{}').indicators
          e && Array.isArray(e) && c.push(...e)
        }
        s.fire()
      }
      function l() {
        const e = c.slice()
        ;(0, n.setJSON)('chart.favoriteLibraryIndicators', e)
      }
      v(), n.onSync.subscribe(null, v)
    },
  },
])
