;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1702],
  {
    8255: (e) => {
      e.exports = {
        removeButton: 'removeButton-BadjY5sX',
        favoriteButton: 'favoriteButton-BadjY5sX',
        itemRow: 'itemRow-BadjY5sX',
        focused: 'focused-BadjY5sX',
        active: 'active-BadjY5sX',
        actionButton: 'actionButton-BadjY5sX',
        mobile: 'mobile-BadjY5sX',
        itemInfo: 'itemInfo-BadjY5sX',
        title: 'title-BadjY5sX',
        details: 'details-BadjY5sX',
        itemInfoWithPadding: 'itemInfoWithPadding-BadjY5sX',
        favorite: 'favorite-BadjY5sX',
        showOnFocus: 'showOnFocus-BadjY5sX',
      }
    },
    37443: (e) => {
      e.exports = {
        dialog: 'dialog-lmxpCvnK',
        dialogWrapper: 'dialogWrapper-lmxpCvnK',
        wrap: 'wrap-lmxpCvnK',
      }
    },
    48452: (e) => {
      e.exports = {
        title: 'title-QPktCwTY',
        container: 'container-QPktCwTY',
        mobile: 'mobile-QPktCwTY',
        empty: 'empty-QPktCwTY',
        image: 'image-QPktCwTY',
        spinner: 'spinner-QPktCwTY',
        contentList: 'contentList-QPktCwTY',
        item: 'item-QPktCwTY',
      }
    },
    64530: (e, t, n) => {
      n.d(t, { DialogContentItem: () => m })
      var i = n(50959),
        o = n(97754),
        a = n.n(o),
        l = n(49483),
        s = n(36189),
        r = n(96040)
      function c(e) {
        const { url: t, ...n } = e
        return t
          ? i.createElement('a', { ...n, href: t })
          : i.createElement('div', { ...n })
      }
      var d = n(60925),
        u = n(8255)
      function m(e) {
        const {
            title: t,
            subtitle: n,
            removeBtnLabel: o,
            onClick: m,
            onClickFavorite: h,
            onClickRemove: f,
            isActive: g,
            isFavorite: w,
            isFocused: b,
            isMobile: C = !1,
            showFavorite: p = !0,
            focusedActionIndex: y,
            className: E,
            tabIndex: S,
            index: B,
            focusVisible: k,
            getElementId: M,
            ...I
          } = e,
          R = [p && h ? 'favorite' : null, 'remove'].filter((e) => null !== e),
          Y = { favorite: R.indexOf('favorite'), remove: R.indexOf('remove') },
          N = (0, i.useId)()
        return i.createElement(
          c,
          {
            ...I,
            role: 'row',
            id: M?.(B),
            className: a()(
              u.itemRow,
              g && u.active,
              C && u.mobile,
              b && k && null === y && u.focused,
              E,
            ),
            tabIndex: S,
            onClick: v.bind(null, m),
            'data-role': 'list-item',
            'data-active': g,
            'aria-labelledby': N,
          },
          p &&
            h &&
            i.createElement(s.FavoriteButton, {
              id: M?.(B, Y.favorite),
              role: 'cell',
              className: a()(
                u.favoriteButton,
                u.actionButton,
                w && u.favorite,
                l.CheckMobile.any() && u.mobile,
                b && y === Y.favorite && u.focused,
                b && k && u.showOnFocus,
              ),
              isActive: g,
              isFilled: w,
              onClick: v.bind(null, h),
              'data-name': 'list-item-favorite-button',
              'data-role': 'list-item-action',
              'data-favorite': w,
            }),
          i.createElement(
            'div',
            {
              id: N,
              role: 'cell',
              className: a()(u.itemInfo, !p && u.itemInfoWithPadding),
            },
            i.createElement(
              'div',
              {
                className: a()(u.title, g && u.active, C && u.mobile),
                'data-name': 'list-item-title',
              },
              t,
            ),
            i.createElement(
              'div',
              { className: a()(u.details, g && u.active, C && u.mobile) },
              n,
            ),
          ),
          i.createElement(r.RemoveButton, {
            id: M?.(B, Y.remove),
            role: 'cell',
            className: a()(
              u.removeButton,
              u.actionButton,
              b && y === Y.remove && u.focused,
              b && k && u.showOnFocus,
            ),
            isActive: g,
            onClick: v.bind(null, f),
            'data-name': 'list-item-remove-button',
            'data-role': 'list-item-action',
            title: o,
            icon: d,
          }),
        )
      }
      function v(e, t) {
        t.defaultPrevented || (t.preventDefault(), e(t))
      }
    },
    41662: (e, t, n) => {
      n.r(t), n.d(t, { ManageDrawingsDialogRenderer: () => v })
      var i = n(50959),
        o = n(11542),
        a = n(16216),
        l = n(77788),
        s = n(79418),
        r = n(11386),
        c = n(37443)
      class d extends i.PureComponent {
        constructor(e) {
          super(e),
            (this._dialogRef = i.createRef()),
            (this._renderChildren = (e) =>
              i.createElement(
                'div',
                { className: c.wrap },
                i.createElement(r.ManageDrawings, {
                  isSmallWidth: e.isSmallWidth,
                  chartWidget: this._activeChartWidget,
                }),
              ))
          const t = (0, a.service)(l.CHART_WIDGET_COLLECTION_SERVICE)
          ;(this._activeChartWidget = t.activeChartWidget.value()),
            (this.state = { layoutName: t.metaInfo.name.value() })
        }
        render() {
          return i.createElement(s.AdaptivePopupDialog, {
            wrapperClassName: c.dialogWrapper,
            className: c.dialog,
            dataName: 'manage-drawings-dialog',
            isOpened: !0,
            onClickOutside: this.props.onClose,
            onClose: this.props.onClose,
            ref: this._dialogRef,
            render: this._renderChildren,
            showSeparator: !0,
            title: o.t(null, void 0, n(81031)),
            subtitle: this.state.layoutName,
          })
        }
      }
      var u = n(29280),
        m = n(87896)
      class v extends u.DialogRenderer {
        constructor(e) {
          super(),
            (this._handleClose = () => {
              this._onClose && this._onClose(),
                this._rootInstance?.unmount(),
                this._setVisibility(!1)
            }),
            (this._onClose = e)
        }
        hide() {
          this._handleClose()
        }
        show() {
          this.visible().value() ||
            ((this._rootInstance = (0, m.createReactRoot)(
              i.createElement(d, { onClose: this._handleClose }),
              this._container,
            )),
            this._setVisibility(!0))
        }
      }
    },
    11386: (e, t, n) => {
      n.d(t, { ManageDrawings: () => _ })
      var i = n(50959),
        o = n(20057),
        a = n(97754),
        l = n.n(a),
        s = n(9745),
        r = n(11542),
        c = n(45126),
        d = n(64147),
        u = n(9343),
        m = n(32755),
        v = n(64530),
        h = n(37265),
        f = n(63932),
        g = n(47308)
      const w = r.t(null, void 0, n(92931)),
        b = r.t(null, void 0, n(41870)),
        C = r.t(null, void 0, n(80996))
      function p(e) {
        const { sharingMode: t, onTabClick: n } = e,
          o = i.useMemo(
            () => [
              { children: w, id: '2' },
              { children: b, id: '1' },
              { children: C, id: '0' },
            ],
            [],
          )
        return i.createElement(g.RoundButtonTabs, {
          id: 'manage-drawings-tabs',
          isActive: (e) => Number.parseInt(e.id) === t,
          onActivate: (e) => {
            n(Number.parseInt(e.id))
          },
          overflowBehaviour: 'scroll',
          items: o,
        })
      }
      var y = n(29540),
        E = n(48452)
      const S = (0, u.getLogger)('Chart.ManageDrawings'),
        B = new Map()
      function k(e) {
        let t = B.get(e)
        return void 0 === t && ((t = new d.WatchedValue([])), B.set(e, t)), t
      }
      const M = new c.TranslatedString(
          'remove all line tools for {symbol}',
          r.t(null, void 0, n(58407)),
        ),
        I = (e) =>
          r
            .t(null, { plural: '{drawingsCount} drawings', count: e }, n(90755))
            .format({ drawingsCount: e.toString() }),
        R = r.t(null, void 0, n(8182)),
        Y = r.t(null, void 0, n(84212))
      function N(e) {
        const [t, n] = i.useState(null),
          [a, l] = i.useState(null),
          [s, r] = i.useState(null),
          [c, d] = (i.useRef(null), i.useState([]))
        return (
          i.useEffect(() => {
            let t
            const i = () => {
              t && l(t.mainSeries().proSymbol())
            }
            return (
              e.withModel(null, () => {
                ;(t = e.model()),
                  n(t),
                  i(),
                  t.mainSeries().symbolResolved().subscribe(null, i)
              }),
              () => {
                t?.mainSeries().symbolResolved().unsubscribe(null, i), n(null)
              }
            )
          }, [e]),
          i.useEffect(() => {
            if (null !== t) {
              const e = {},
                n = (0, o.default)(g, 250, { leading: !1 })
              return (
                g(),
                t.model().dataSourceCollectionChanged().subscribe(e, n),
                () => {
                  t.model().dataSourceCollectionChanged().unsubscribe(e, n)
                }
              )
            }
          }, [t]),
          i.useEffect(() => {
            if (null !== t) {
              const e = k(t.model().id()).spawn()
              return (
                d([...e.value()]),
                e.subscribe(() => d([...e.value()])),
                () => e?.destroy()
              )
            }
          }, [t]),
          i.useMemo(
            () => ({
              currentSymbol: a,
              symbolDrawingsMaps: s,
              removeSymbolDrawings: u,
              changeSymbol: v,
              hiddenSymbols: c,
            }),
            [a, s, u, v, c],
          )
        )
        async function u(e, n) {
          if (t && s) {
            const i = s[n].get(e)
            if (i) {
              const n = Array.from(i)
                .map((e) => t.model().dataSourceForId(e))
                .filter(h.notNull)
              n.length > 0 && t.removeSources(n, !1, M.format({ symbol: e }))
              const o = k(t.model().id())
              o.setValue([...o.value(), e])
              try {
                await g()
              } catch (e) {
                S.logError(`Error removing line tools: ${e}`)
              }
              o.setValue(o.value().filter((t) => t !== e))
            }
          }
        }
        function v(n) {
          e.setSymbol(n), null !== t && l(n)
        }
        async function f(e) {
          const t = ((e) => {
              const t = [new Map(), new Map(), new Map()]
              return (
                e.forEach((e) => {
                  if ((0, m.isLineTool)(e) && e.showInObjectTree()) {
                    const n = e.symbol() ?? '',
                      i = e.sharingMode().value()
                    t[i].set(n, (t[i].get(n) || new Set()).add(e.id()))
                  }
                }),
                t
              )
            })(e),
            n = await (async () => {
              const e = [new Map(), new Map(), new Map()]
              return e
            })()
          return (
            n.forEach((e, n) => {
              const i = t[n]
              e.forEach((e, t) => {
                const n = i.get(t) || new Set()
                e.forEach((e) => n.add(e)), i.set(t, n)
              })
            }),
            t
          )
        }
        async function g() {
          null !== t && r(await f(t.dataSources()))
        }
      }
      function _(e) {
        const {
            isMobile: t,
            isSmallWidth: n,
            chartWidget: o,
            onClose: a,
            onInitialized: r,
          } = e,
          {
            currentSymbol: c,
            symbolDrawingsMaps: d,
            removeSymbolDrawings: u,
            changeSymbol: m,
            hiddenSymbols: h,
          } = N(o),
          [g, w] = i.useState(null),
          [b, C] = i.useMemo(() => {
            if (null !== c && null !== d) {
              const e = []
              let t = g
              if (null === t)
                for (t = 2; t > 0 && !((d[t].get(c)?.size || 0) > 0); ) t--
              return (
                d[t].forEach((t, n) => {
                  h.includes(n) ||
                    e.push({
                      symbol: n,
                      drawingsCount: t.size,
                      onRemove: () =>
                        ((e) => {
                          u(e, C)
                        })(n),
                      onClick: () =>
                        ((e) => {
                          '' !== e && (m(e), a?.())
                        })(n),
                    })
                }),
                e.sort((e, t) =>
                  e.drawingsCount === t.drawingsCount
                    ? e.symbol.localeCompare(t.symbol)
                    : e.drawingsCount > t.drawingsCount
                      ? -1
                      : 1,
                ),
                [e, t]
              )
            }
            return [[], 0]
          }, [c, g, d, h])
        return (
          i.useEffect(() => {
            null !== d && r?.()
          }, [d]),
          i.createElement(
            i.Fragment,
            null,
            i.createElement(
              'div',
              { className: l()(E.container, (n || t) && E.mobile) },
              i.createElement(p, { sharingMode: C, onTabClick: w }),
            ),
            0 === b.length
              ? null === d
                ? i.createElement(f.Spinner, { className: E.spinner })
                : i.createElement(
                    'div',
                    { className: E.empty },
                    i.createElement(s.Icon, { className: E.image, icon: y }),
                    i.createElement('span', null, Y),
                  )
              : b.map(
                  (
                    { symbol: e, drawingsCount: n, onRemove: o, onClick: a },
                    l,
                  ) =>
                    i.createElement(v.DialogContentItem, {
                      key: e,
                      index: l,
                      title: e,
                      subtitle: I(n),
                      removeBtnLabel: R,
                      isActive: e === c,
                      isMobile: t,
                      onClick: a,
                      onClickRemove: o,
                      showFavorite: !1,
                      className: E.item,
                    }),
                ),
          )
        )
      }
    },
    29540: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" width="72" height="72"><path fill="currentColor" d="M15 24a21 21 0 1 1 42 0v7.41l8.97 5.01 1.08.6-.82.94-7.77 8.82 2.34 2.53-1.47 1.36L57 48.15V69H46v-7h-6v5h-9V56h-6v13H15V48.15l-2.33 2.52-1.47-1.36 2.35-2.53-7.78-8.82-.82-.93 1.08-.6L15 31.4V24Zm0 9.7-6.9 3.87L15 45.4V33.7Zm42 11.7 6.91-7.83-6.9-3.87v11.7ZM36 5a19 19 0 0 0-19 19v43h6V54h10v11h5v-5h10v7h7V24A19 19 0 0 0 36 5Zm-5 19.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM42.5 26a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/></svg>'
    },
  },
])
