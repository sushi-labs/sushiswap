;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5378],
  {
    45946: (e) => {
      e.exports = {
        button: 'button-D4RPB3ZC',
        content: 'content-D4RPB3ZC',
        iconOnly: 'iconOnly-D4RPB3ZC',
        link: 'link-D4RPB3ZC',
        brand: 'brand-D4RPB3ZC',
        primary: 'primary-D4RPB3ZC',
        secondary: 'secondary-D4RPB3ZC',
        gray: 'gray-D4RPB3ZC',
        green: 'green-D4RPB3ZC',
        red: 'red-D4RPB3ZC',
        black: 'black-D4RPB3ZC',
        'black-friday': 'black-friday-D4RPB3ZC',
        'cyber-monday': 'cyber-monday-D4RPB3ZC',
        slot: 'slot-D4RPB3ZC',
        xsmall: 'xsmall-D4RPB3ZC',
        withStartSlot: 'withStartSlot-D4RPB3ZC',
        withEndSlot: 'withEndSlot-D4RPB3ZC',
        startSlotWrap: 'startSlotWrap-D4RPB3ZC',
        endSlotWrap: 'endSlotWrap-D4RPB3ZC',
        small: 'small-D4RPB3ZC',
        medium: 'medium-D4RPB3ZC',
        large: 'large-D4RPB3ZC',
        xlarge: 'xlarge-D4RPB3ZC',
        animated: 'animated-D4RPB3ZC',
        stretch: 'stretch-D4RPB3ZC',
        grouped: 'grouped-D4RPB3ZC',
        adjustPosition: 'adjustPosition-D4RPB3ZC',
        firstRow: 'firstRow-D4RPB3ZC',
        firstCol: 'firstCol-D4RPB3ZC',
        'no-corner-top-left': 'no-corner-top-left-D4RPB3ZC',
        'no-corner-top-right': 'no-corner-top-right-D4RPB3ZC',
        'no-corner-bottom-right': 'no-corner-bottom-right-D4RPB3ZC',
        'no-corner-bottom-left': 'no-corner-bottom-left-D4RPB3ZC',
        textWrap: 'textWrap-D4RPB3ZC',
        multilineContent: 'multilineContent-D4RPB3ZC',
        secondaryText: 'secondaryText-D4RPB3ZC',
        primaryText: 'primaryText-D4RPB3ZC',
      }
    },
    92335: (e) => {
      e.exports = {
        container: 'container-qm7Rg5MB',
        mobile: 'mobile-qm7Rg5MB',
        inputContainer: 'inputContainer-qm7Rg5MB',
        withCancel: 'withCancel-qm7Rg5MB',
        input: 'input-qm7Rg5MB',
        icon: 'icon-qm7Rg5MB',
        cancel: 'cancel-qm7Rg5MB',
      }
    },
    94386: (e) => {
      e.exports = {
        container: 'container-QcG0kDOU',
        image: 'image-QcG0kDOU',
        title: 'title-QcG0kDOU',
        description: 'description-QcG0kDOU',
        button: 'button-QcG0kDOU',
      }
    },
    95059: (e) => {
      e.exports = { highlighted: 'highlighted-cwp8YRo6' }
    },
    67248: (e, t, n) => {
      var r, o, a
      function i(e = 'default') {
        switch (e) {
          case 'default':
            return 'primary'
          case 'stroke':
            return 'secondary'
        }
      }
      function l(e = 'primary') {
        switch (e) {
          case 'primary':
            return 'brand'
          case 'success':
            return 'green'
          case 'default':
            return 'gray'
          case 'danger':
            return 'red'
        }
      }
      function s(e = 'm') {
        switch (e) {
          case 's':
            return 'xsmall'
          case 'm':
            return 'small'
          case 'l':
            return 'large'
        }
      }
      n.d(t, { Button: () => B }),
        ((e) => {
          ;(e.Primary = 'primary'),
            (e.Success = 'success'),
            (e.Default = 'default'),
            (e.Danger = 'danger')
        })(r || (r = {})),
        ((e) => {
          ;(e.Small = 's'), (e.Medium = 'm'), (e.Large = 'l')
        })(o || (o = {})),
        ((e) => {
          ;(e.Default = 'default'), (e.Stroke = 'stroke')
        })(a || (a = {}))
      var c = n(50959),
        u = n(97754),
        m = n(95604)
      var d = n(45946),
        p = n.n(d)
      const h =
        'apply-overflow-tooltip apply-overflow-tooltip--check-children-recursively apply-overflow-tooltip--allow-text apply-common-tooltip'
      function g(e) {
        const {
            size: t = 'medium',
            variant: n = 'primary',
            stretch: r = !1,
            startSlot: o,
            endSlot: a,
            iconOnly: i = !1,
            className: l,
            isGrouped: s,
            cellState: c,
            disablePositionAdjustment: d = !1,
            primaryText: g,
            secondaryText: f,
            isAnchor: y = !1,
          } = e,
          x = ((e) => ('brand' === e ? 'black' : 'blue' === e ? 'brand' : e))(
            e.color ?? 'brand',
          ),
          C = ((e) => {
            let t = ''
            return (
              0 !== e &&
                (1 & e && (t = u(t, p()['no-corner-top-left'])),
                2 & e && (t = u(t, p()['no-corner-top-right'])),
                4 & e && (t = u(t, p()['no-corner-bottom-right'])),
                8 & e && (t = u(t, p()['no-corner-bottom-left']))),
              t
            )
          })((0, m.getGroupCellRemoveRoundBorders)(c)),
          R = i && (o || a)
        return u(
          l,
          p().button,
          p()[t],
          p()[x],
          p()[n],
          r && p().stretch,
          o && p().withStartIcon,
          a && p().withEndIcon,
          R && p().iconOnly,
          C,
          s && p().grouped,
          s && !d && p().adjustPosition,
          s && c.isTop && p().firstRow,
          s && c.isLeft && p().firstCol,
          g && f && p().multilineContent,
          y && p().link,
          h,
        )
      }
      function f(e) {
        const {
          startSlot: t,
          iconOnly: n,
          children: r,
          endSlot: o,
          primaryText: a,
          secondaryText: i,
        } = e
        if (t && o && n)
          return c.createElement(
            'span',
            { className: u(p().slot, p().startSlotWrap) },
            t,
          )
        const l = n && (t ?? o),
          s = !t && !o && !n && !r && a && i
        return c.createElement(
          c.Fragment,
          null,
          t &&
            c.createElement(
              'span',
              { className: u(p().slot, p().startSlotWrap) },
              t,
            ),
          r && !l && c.createElement('span', { className: p().content }, r),
          o &&
            c.createElement(
              'span',
              { className: u(p().slot, p().endSlotWrap) },
              o,
            ),
          s &&
            !l &&
            ((e) =>
              e.primaryText &&
              e.secondaryText &&
              c.createElement(
                'div',
                { className: u(p().textWrap, h) },
                c.createElement(
                  'span',
                  { className: p().primaryText },
                  ' ',
                  e.primaryText,
                  ' ',
                ),
                'string' == typeof e.secondaryText
                  ? c.createElement(
                      'span',
                      { className: p().secondaryText },
                      ' ',
                      e.secondaryText,
                      ' ',
                    )
                  : c.createElement(
                      'span',
                      { className: p().secondaryText },
                      c.createElement('span', null, e.secondaryText.firstLine),
                      c.createElement('span', null, e.secondaryText.secondLine),
                    ),
              ))(e),
        )
      }
      var y = n(34094),
        x = n(86332),
        C = n(90186)
      function R(e, t) {
        return (n) => {
          if (t) return n.preventDefault(), void n.stopPropagation()
          e?.(n)
        }
      }
      function P(e) {
        const {
          className: t,
          color: n,
          variant: r,
          size: o,
          stretch: a,
          animated: i,
          iconOnly: l,
          startSlot: s,
          endSlot: c,
          primaryText: u,
          secondaryText: m,
          ...d
        } = e
        return {
          ...d,
          ...(0, C.filterDataProps)(e),
          ...(0, C.filterAriaProps)(e),
        }
      }
      function v(e) {
        const {
            reference: t,
            tooltipText: n,
            disabled: r,
            onClick: o,
            onMouseOver: a,
            onMouseOut: i,
            onMouseDown: l,
            ...s
          } = e,
          {
            isGrouped: u,
            cellState: m,
            disablePositionAdjustment: d,
          } = (0, c.useContext)(x.ControlGroupContext),
          p = g({
            ...s,
            isGrouped: u,
            cellState: m,
            disablePositionAdjustment: d,
          }),
          h =
            n ??
            (e.primaryText
              ? [e.primaryText, e.secondaryText].join(' ')
              : (0, y.getTextForTooltip)(e.children))
        return c.createElement(
          'button',
          {
            ...P(s),
            'aria-disabled': r,
            tabIndex: e.tabIndex ?? (r ? -1 : 0),
            className: p,
            ref: t,
            onClick: R(o, r),
            onMouseDown: R(l, r),
            'data-overflow-tooltip-text': h,
          },
          c.createElement(f, { ...s }),
        )
      }
      n(49406)
      function w(e) {
        const {
          intent: t,
          size: n,
          appearance: r,
          useFullWidth: o,
          icon: a,
          ...c
        } = e
        return { ...c, color: l(t), size: s(n), variant: i(r), stretch: o }
      }
      function B(e) {
        return c.createElement(v, { ...w(e) })
      }
    },
    86332: (e, t, n) => {
      n.d(t, { ControlGroupContext: () => r })
      const r = n(50959).createContext({
        isGrouped: !1,
        cellState: { isTop: !0, isRight: !0, isBottom: !0, isLeft: !0 },
      })
    },
    95604: (e, t, n) => {
      function r(e) {
        let t = 0
        return (
          (e.isTop && e.isLeft) || (t += 1),
          (e.isTop && e.isRight) || (t += 2),
          (e.isBottom && e.isLeft) || (t += 8),
          (e.isBottom && e.isRight) || (t += 4),
          t
        )
      }
      n.d(t, { getGroupCellRemoveRoundBorders: () => r })
    },
    34094: (e, t, n) => {
      n.d(t, { getTextForTooltip: () => i })
      var r = n(50959)
      const o = (e) => (0, r.isValidElement)(e) && Boolean(e.props.children),
        a = (e) =>
          null == e || 'boolean' == typeof e || '{}' === JSON.stringify(e)
            ? ''
            : e.toString() + ' ',
        i = (e) =>
          Array.isArray(e) || (0, r.isValidElement)(e)
            ? r.Children.toArray(e)
                .reduce((e, t) => {
                  let n = ''
                  return (
                    (n =
                      (0, r.isValidElement)(t) && o(t)
                        ? i(t.props.children)
                        : (0, r.isValidElement)(t) && !o(t)
                          ? ''
                          : a(t)),
                    e.concat(n)
                  )
                }, '')
                .trim()
            : a(e)
    },
    87896: (e, t, n) => {
      n.d(t, { createReactRoot: () => m })
      var r = n(50959),
        o = n(32227),
        a = n(4237)
      const i = (0, r.createContext)({
        isOnMobileAppPage: () => !1,
        isRtl: !1,
        locale: 'en',
      })
      var l = n(84015),
        s = n(63273)
      const c = {
        iOs: 'old',
        android: 'new',
        old: 'old',
        new: 'new',
        any: 'any',
      }
      function u(e) {
        const [t] = (0, r.useState)({
          isOnMobileAppPage: (e) => (0, l.isOnMobileAppPage)(c[e]),
          isRtl: (0, s.isRtl)(),
          locale: window.locale,
        })
        return r.createElement(i.Provider, { value: t }, e.children)
      }
      function m(e, t, n = 'legacy') {
        const i = r.createElement(u, null, e)
        if ('modern' === n) {
          const e = (0, a.createRoot)(t)
          return (
            e.render(i),
            {
              render(t) {
                e.render(r.createElement(u, null, t))
              },
              unmount() {
                e.unmount()
              },
            }
          )
        }
        return (
          o.render(i, t),
          {
            render(e) {
              o.render(r.createElement(u, null, e), t)
            },
            unmount() {
              o.unmountComponentAtNode(t)
            },
          }
        )
      }
    },
    69654: (e, t, n) => {
      n.d(t, { DialogSearch: () => m })
      var r = n(50959),
        o = n(97754),
        a = n.n(o),
        i = n(11542),
        l = n(9745),
        s = n(6347),
        c = n(54313),
        u = n(92335)
      function m(e) {
        const {
          children: t,
          isMobile: o,
          renderInput: m,
          onCancel: p,
          containerClassName: h,
          inputContainerClassName: g,
          iconClassName: f,
          cancelTitle: y = i.t(null, void 0, n(4543)),
          ...x
        } = e
        return r.createElement(
          'div',
          { className: a()(u.container, o && u.mobile, h) },
          r.createElement(
            'div',
            {
              className: a()(
                u.inputContainer,
                o && u.mobile,
                g,
                p && u.withCancel,
              ),
            },
            m || r.createElement(d, { isMobile: o, ...x }),
          ),
          t,
          r.createElement(l.Icon, {
            className: a()(u.icon, o && u.mobile, f),
            icon: o ? c : s,
          }),
          p &&
            (!o || '' !== x.value) &&
            r.createElement(
              'div',
              { className: a()(u.cancel, o && u.mobile), onClick: p },
              y,
            ),
        )
      }
      function d(e) {
        const {
          className: t,
          reference: n,
          isMobile: o,
          value: i,
          onChange: l,
          onFocus: s,
          onBlur: c,
          onKeyDown: m,
          onSelect: d,
          placeholder: p,
          activeDescendant: h,
          ...g
        } = e
        return r.createElement('input', {
          ...g,
          ref: n,
          type: 'text',
          className: a()(t, u.input, o && u.mobile),
          autoComplete: 'off',
          role: 'searchbox',
          'data-role': 'search',
          placeholder: p,
          value: i,
          onChange: l,
          onFocus: s,
          onBlur: c,
          onSelect: d,
          onKeyDown: m,
          'aria-activedescendant': h,
        })
      }
    },
    92164: (e, t, n) => {
      n.d(t, { ContentIsNotFound: () => c })
      var r = n(50959),
        o = n(97754),
        a = n.n(o),
        i = n(9745),
        l = n(67248),
        s = n(94386)
      function c(e) {
        const {
          className: t,
          icon: n,
          title: o,
          description: c,
          buttonText: u,
          buttonAction: m,
        } = e
        return r.createElement(
          'div',
          { className: a()(s.container, t) },
          n && r.createElement(i.Icon, { icon: n, className: s.image }),
          o && r.createElement('h3', { className: s.title }, o),
          c && r.createElement('p', { className: s.description }, c),
          u &&
            m &&
            r.createElement(l.Button, { onClick: m, className: s.button }, u),
        )
      }
    },
    97006: (e, t, n) => {
      n.d(t, {
        createRegExpList: () => l,
        getHighlightedChars: () => s,
        rankedSearch: () => i,
      })
      var r = n(37265)
      function o(e) {
        return e.replace(/[!-/[-^{-}?]/g, '\\$&')
      }
      var a
      function i(e) {
        const {
          data: t,
          rules: n,
          queryString: o,
          isPreventedFromFiltering: a,
          primaryKey: i,
          secondaryKey: l = i,
          optionalPrimaryKey: s,
          tertiaryKey: c,
        } = e
        return t
          .map((e) => {
            const t = s && e[s] ? e[s] : e[i],
              a = e[l],
              u = c && e[c]
            let m,
              d = 0
            return (
              n.forEach((e) => {
                const { re: n, fullMatch: i } = e
                if (
                  ((n.lastIndex = 0),
                  (0, r.isString)(t) &&
                    t &&
                    t.toLowerCase() === o.toLowerCase())
                )
                  return (d = 4), void (m = t.match(i)?.index)
                if ((0, r.isString)(t) && i.test(t))
                  return (d = 3), void (m = t.match(i)?.index)
                if ((0, r.isString)(a) && i.test(a))
                  return (d = 2), void (m = a.match(i)?.index)
                if ((0, r.isString)(a) && n.test(a))
                  return (d = 2), void (m = a.match(n)?.index)
                if (Array.isArray(u))
                  for (const e of u)
                    if (i.test(e)) return (d = 1), void (m = e.match(i)?.index)
              }),
              { matchPriority: d, matchIndex: m, item: e }
            )
          })
          .filter((e) => a || e.matchPriority)
          .sort((e, t) => {
            if (e.matchPriority < t.matchPriority) return 1
            if (e.matchPriority > t.matchPriority) return -1
            if (e.matchPriority === t.matchPriority) {
              if (void 0 === e.matchIndex || void 0 === t.matchIndex) return 0
              if (e.matchIndex > t.matchIndex) return 1
              if (e.matchIndex < t.matchIndex) return -1
            }
            return 0
          })
          .map(({ item: e }) => e)
      }
      function l(e, t) {
        const n = [],
          r = e.toLowerCase(),
          a =
            e
              .split('')
              .map((e, t) => `(${0 !== t ? `[/\\s-]${o(e)}` : o(e)})`)
              .join('(.*?)') + '(.*)'
        return (
          n.push({
            fullMatch: new RegExp(`(${o(e)})`, 'i'),
            re: new RegExp(`^${a}`, 'i'),
            reserveRe: new RegExp(a, 'i'),
            fuzzyHighlight: !0,
          }),
          t &&
            Object.hasOwn(t, r) &&
            n.push({ fullMatch: t[r], re: t[r], fuzzyHighlight: !1 }),
          n
        )
      }
      function s(e, t, n) {
        const r = []
        return e && n
          ? (n.forEach((e) => {
              const { fullMatch: n, re: o, reserveRe: a } = e
              ;(n.lastIndex = 0), (o.lastIndex = 0)
              const i = n.exec(t),
                l = i || o.exec(t) || (a && a.exec(t))
              if (((e.fuzzyHighlight = !i), l))
                if (e.fuzzyHighlight) {
                  let e = l.index
                  for (let t = 1; t < l.length; t++) {
                    const n = l[t],
                      o = l[t].length
                    if (t % 2) {
                      const t =
                        n.startsWith(' ') ||
                        n.startsWith('/') ||
                        n.startsWith('-')
                      r[t ? e + 1 : e] = !0
                    }
                    e += o
                  }
                } else for (let e = 0; e < l[0].length; e++) r[l.index + e] = !0
            }),
            r)
          : r
      }
      !((e) => {
        ;(e[(e.Low = 0)] = 'Low'),
          (e[(e.MediumLow = 1)] = 'MediumLow'),
          (e[(e.Medium = 2)] = 'Medium'),
          (e[(e.High = 3)] = 'High'),
          (e[(e.Highest = 4)] = 'Highest')
      })(a || (a = {}))
    },
    24637: (e, t, n) => {
      n.d(t, { HighlightedText: () => l })
      var r = n(50959),
        o = n(97754),
        a = n(97006),
        i = n(95059)
      function l(e) {
        const { queryString: t, rules: n, text: l, className: s } = e,
          c = (0, r.useMemo)(
            () => (0, a.getHighlightedChars)(t, l, n),
            [t, n, l],
          )
        return r.createElement(
          r.Fragment,
          null,
          c.length
            ? l
                .split('')
                .map((e, t) =>
                  r.createElement(
                    r.Fragment,
                    { key: t },
                    c[t]
                      ? r.createElement(
                          'span',
                          { className: o(i.highlighted, s) },
                          e,
                        )
                      : r.createElement('span', null, e),
                  ),
                )
            : l,
        )
      }
    },
    4237: (e, t, n) => {
      var r = n(32227)
      ;(t.createRoot = r.createRoot), r.hydrateRoot
    },
    54313: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M18.5 12.5a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm-1.25 5.8a7.5 7.5 0 1 1 1.06-1.06l4.22 4.23.53.53L22 23.06l-.53-.53-4.22-4.22Z"/></svg>'
    },
    6347: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="M17.4 17.5a7 7 0 1 0-4.9 2c1.9 0 3.64-.76 4.9-2zm0 0l5.1 5"/></svg>'
    },
  },
])
