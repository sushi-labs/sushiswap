;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [4389],
  {
    7960: (e, t, n) => {
      n.r(t),
        n.d(t, {
          copyToClipboardClientScreenshot: () => g,
          copyToClipboardImageOfChart: () => m,
          downloadClientScreenshot: () => u,
          getImageOfChartSilently: () => h,
        })
      var a = n(9343),
        o = n(52388),
        i = n(13665),
        r = n(56616),
        c = n(7372),
        s = n(7986),
        l = (n(21251), n(11542), n(84906))
      function d(e, t = {}) {
        return new Promise((n, a) => {
          !(async (e, t, n, a = {}) => {
            const o = new FormData()
            if (void 0 !== a.previews)
              for (const e of a.previews) o.append('previews[]', e)
            void 0 !== a.cme && o.append('cme', String(a.cme))
            void 0 !== a.wl && o.append('wl', String(a.wl))
            void 0 !== a.onWidget && o.append('onWidget', String(a.onWidget))
            a.isReport && o.append('isReport', String(a.isReport))
            a.asyncSave && o.append('asyncSave', String(a.asyncSave))
            const i = window.urlParams
            i && i.locale && o.append('language', i.locale)
            const r = e.activeChartWidget.value(),
              c = r.widgetCustomer()
            void 0 !== c && o.append('customer', c)
            const s =
              r.model().model().timezoneExceptExchange().value() ?? 'exchange'
            o.append('timezone', s),
              o.append('symbol', r.model().mainSeries().symbol())
            const d = await e.clientSnapshot({
                showHeaderMainSymbol: a.showHeaderMainSymbol,
              }),
              p = await new Promise((e) => d.toBlob(e))
            null !== p && o.append('preparedImage', p)
            !(async (e, t, n, a = {}) => {
              const o = a.snapshotUrl || 'https://www.tradingview.com/snapshot/'
              try {
                const a = await (0, l.fetch)(o, {
                    body: e,
                    method: 'POST',
                    credentials: 'same-origin',
                  }),
                  i = await a.text()
                a.ok ? t(i) : n()
              } catch {
                n()
              }
            })(o, t, n, a)
          })(e, n, a, t)
        })
      }
      const p = (0, a.getLogger)('Platform.TakeChartImage'),
        w = new o.DateTimeFormatter({
          dateTimeSeparator: '_',
          timeFormat: '%h-%m-%s',
        })
      async function m(e, t) {
        const n = 'text/plain',
          a = d(e, t),
          o = a.then((e) =>
            t.snapshotUrl ? e : (0, s.convertImageNameToUrl)(e),
          ),
          i = o.then((e) => new Blob([e], { type: n }))
        try {
          return await (0, r.writePromiseUsingApi)(i, n), a
        } catch (e) {
          throw (window.open(await o), e)
        }
      }
      async function h(e, t) {
        try {
          return await d(e, t)
        } catch (e) {
          throw (p.logWarn('Error while trying to create snapshot'), e)
        }
      }
      async function g(e) {
        const t = e.clientSnapshot(),
          n = t.then(
            (e) =>
              new Promise((t) =>
                e.toBlob((e) => {
                  null !== e && t(e)
                }),
              ),
          )
        try {
          return await (0, r.writePromiseUsingApi)(n, 'image/png')
        } catch (e) {
          const n = window.open()
          throw (
            (n &&
              n.document.write(
                `<img width="100%" src="${(await t).toDataURL()}"/>`,
              ),
            e)
          )
        }
      }
      async function u(e) {
        const t = e.activeChartWidget
            .value()
            .model()
            .mainSeries()
            .actualSymbol(),
          n = `${(0, i.shortName)(t)}_${w.formatLocal(new Date())}`,
          a = await e.clientSnapshot()
        ;(0, c.downloadFile)(`${n}.png`, a.toDataURL())
      }
    },
    7986: (e, t, n) => {
      function a(e) {
        return 'https://www.tradingview.com/x/' + e + '/'
      }
      n.d(t, { convertImageNameToUrl: () => a })
    },
    7372: (e, t, n) => {
      function a(e, t) {
        const n = document.createElement('a')
        ;(n.style.display = 'none'), (n.href = t), (n.download = e), n.click()
      }
      n.d(t, { downloadFile: () => a })
    },
  },
])
