;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7102],
  {
    672511: (e, n, r) => {
      r.d(n, { Spinner: () => a })
      var s = r(50959),
        t = r(497754),
        i = r(843442)
      r(683135)
      function a(e) {
        const n = t(
          e.className,
          'tv-spinner',
          'tv-spinner--shown',
          `tv-spinner--size_${i.spinnerSizeMap[e.size || i.DEFAULT_SIZE]}`,
        )
        return s.createElement('div', {
          className: n,
          style: e.style,
          role: 'progressbar',
        })
      }
    },
    974063: (e, n, r) => {
      r.r(n), r.d(n, { destroy: () => p, render: () => a })
      var s = r(50959),
        t = r(500962),
        i = r(132455)
      function a(e) {
        t.render(s.createElement(i.Spinner), e)
      }
      function p(e) {
        t.unmountComponentAtNode(e)
      }
    },
    132455: (e, n, r) => {
      r.d(n, { Spinner: () => s.Spinner })
      var s = r(672511)
    },
  },
])
