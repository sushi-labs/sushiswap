;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [4665],
  {
    65692: (t, n, e) => {
      var o
      e.r(n),
        e.d(n, { Twitter: () => o }),
        ((t) => {
          function n(t, n) {
            return 'cme' === TradingView.widgetCustomer
              ? n + ' from cmegroup.com via @tradingview $' + t
              : `Check out my #${t} analysis on @TradingView: ${n}`
          }
          function e(t = 'about:blank', n = 'snapshot_tweet') {
            const e = Math.round(screen.width / 2 - 275),
              o = Math.round(screen.height / 2 - 210)
            return window.open(
              t,
              n,
              `scrollbars=yes,resizable=yes,toolbar=no,location=yes,\n\t\t\t\twidth=550,height=420,\n\t\t\t\tleft=${e},top=${o}`,
            )
          }
          ;(t.getStatus = n),
            (t.shareSnapshot = (t) => {
              const o = e()
              return {
                onFailure: () => {
                  o.close()
                },
                onSuccess: (e) => {
                  o.location.href = ((t, e) =>
                    'https://twitter.com/intent/tweet?&text=' +
                    encodeURIComponent(
                      n(
                        t,
                        ((t) =>
                          window.location.protocol +
                          '//' +
                          window.location.host +
                          '/x/' +
                          t +
                          '/')(e),
                      ),
                    ))(t, e)
                },
              }
            }),
            (t.shareSnapshotInstantly = (t, o) => {
              e(
                ((t, e) =>
                  'https://twitter.com/intent/tweet?&text=' +
                  encodeURIComponent(n(t, e)))(t, o),
              )
            })
        })(o || (o = {}))
    },
  },
])
