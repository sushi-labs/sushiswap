;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1702],
  {
    425398: (n) => {
      n.exports = {
        'round-button': 'round-button-FujgyDpN',
        icon: 'icon-FujgyDpN',
        content: 'content-FujgyDpN',
        link: 'link-FujgyDpN',
        'color-brand': 'color-brand-FujgyDpN',
        'variant-primary': 'variant-primary-FujgyDpN',
        'disable-themes': 'disable-themes-FujgyDpN',
        activated: 'activated-FujgyDpN',
        'variant-quiet-primary': 'variant-quiet-primary-FujgyDpN',
        'variant-secondary': 'variant-secondary-FujgyDpN',
        'variant-ghost': 'variant-ghost-FujgyDpN',
        'color-gray': 'color-gray-FujgyDpN',
        'color-red': 'color-red-FujgyDpN',
        'color-black': 'color-black-FujgyDpN',
        'color-invertedblack': 'color-invertedblack-FujgyDpN',
        'size-xsmall': 'size-xsmall-FujgyDpN',
        'icon-only': 'icon-only-FujgyDpN',
        'with-start-icon': 'with-start-icon-FujgyDpN',
        'with-end-icon': 'with-end-icon-FujgyDpN',
        startIcon: 'startIcon-FujgyDpN',
        endIcon: 'endIcon-FujgyDpN',
        'size-small': 'size-small-FujgyDpN',
        'size-medium': 'size-medium-FujgyDpN',
        'size-large': 'size-large-FujgyDpN',
        'size-xlarge': 'size-xlarge-FujgyDpN',
        'size-xxlarge': 'size-xxlarge-FujgyDpN',
        animated: 'animated-FujgyDpN',
        stretch: 'stretch-FujgyDpN',
      }
    },
    448729: (n) => {
      n.exports = {
        'round-tabs': 'round-tabs-J4T7wK54',
        'align-start': 'align-start-J4T7wK54',
        'align-center': 'align-center-J4T7wK54',
        tab: 'tab-J4T7wK54',
        'tab-primary': 'tab-primary-J4T7wK54',
        checked: 'checked-J4T7wK54',
        'tab-ghost': 'tab-ghost-J4T7wK54',
        'size-xsmall': 'size-xsmall-J4T7wK54',
        'size-small': 'size-small-J4T7wK54',
        'size-large': 'size-large-J4T7wK54',
      }
    },
    412228: (n) => {
      n.exports = {
        itemRow: 'itemRow-BadjY5sX',
        favoriteButton: 'favoriteButton-BadjY5sX',
        active: 'active-BadjY5sX',
        selected: 'selected-BadjY5sX',
        mobile: 'mobile-BadjY5sX',
        itemInfo: 'itemInfo-BadjY5sX',
        title: 'title-BadjY5sX',
        details: 'details-BadjY5sX',
        itemInfoWithPadding: 'itemInfoWithPadding-BadjY5sX',
        favorite: 'favorite-BadjY5sX',
        removeButton: 'removeButton-BadjY5sX',
      }
    },
    95002: (n) => {
      n.exports = {
        dialog: 'dialog-lmxpCvnK',
        dialogWrapper: 'dialogWrapper-lmxpCvnK',
        wrap: 'wrap-lmxpCvnK',
      }
    },
    528355: (n) => {
      n.exports = {
        title: 'title-QPktCwTY',
        tabs: 'tabs-QPktCwTY',
        empty: 'empty-QPktCwTY',
        image: 'image-QPktCwTY',
        spinner: 'spinner-QPktCwTY',
        contentList: 'contentList-QPktCwTY',
      }
    },
    73572: (n, e, o) => {
      o.d(e, { DialogContentItem: () => m })
      var t = o(50959),
        s = o(497754),
        a = o.n(s),
        i = o(601227),
        l = o(577687),
        r = o(72621)
      function u(n) {
        const { url: e, ...o } = n
        return e
          ? t.createElement('a', { ...o, href: e })
          : t.createElement('div', { ...o })
      }
      var d = o(412228)
      function m(n) {
        const {
          title: e,
          subtitle: o,
          removeBtnLabel: s,
          onClick: m,
          onClickFavorite: g,
          onClickRemove: b,
          isActive: y,
          isSelected: w,
          isFavorite: C,
          isMobile: h = !1,
          showFavorite: v = !0,
          ...p
        } = n
        return t.createElement(
          u,
          {
            ...p,
            className: a()(
              d.itemRow,
              y && !w && d.active,
              h && d.mobile,
              w && d.selected,
            ),
            onClick: c.bind(null, m),
            'data-role': 'list-item',
            'data-active': y,
          },
          v &&
            g &&
            t.createElement(l.FavoriteButton, {
              className: a()(
                d.favoriteButton,
                C && d.favorite,
                i.CheckMobile.any() && d.mobile,
              ),
              isActive: y && !w,
              isFilled: C,
              onClick: c.bind(null, g),
              'data-name': 'list-item-favorite-button',
              'data-favorite': C,
            }),
          t.createElement(
            'div',
            { className: a()(d.itemInfo, !v && d.itemInfoWithPadding) },
            t.createElement(
              'div',
              {
                className: a()(d.title, y && !w && d.active, h && d.mobile),
                'data-name': 'list-item-title',
              },
              e,
            ),
            t.createElement(
              'div',
              { className: a()(d.details, y && !w && d.active, h && d.mobile) },
              o,
            ),
          ),
          t.createElement(r.RemoveButton, {
            className: d.removeButton,
            isActive: y && !w,
            onClick: c.bind(null, b),
            'data-name': 'list-item-remove-button',
            title: s,
          }),
        )
      }
      function c(n, e) {
        e.defaultPrevented || (e.preventDefault(), n(e))
      }
    },
    305624: (n, e, o) => {
      o.r(e), o.d(e, { ManageDrawingsDialogRenderer: () => c })
      var t = o(50959),
        s = o(500962),
        a = o(609838),
        i = o(33290),
        l = o(557883),
        r = o(533408),
        u = o(340092),
        d = o(95002)
      class m extends t.PureComponent {
        constructor(n) {
          super(n),
            (this._dialogRef = t.createRef()),
            (this._renderChildren = (n) =>
              t.createElement(
                'div',
                { className: d.wrap },
                t.createElement(u.ManageDrawings, {
                  onInitialized: n.centerAndFit,
                  chartWidget: this._activeChartWidget,
                }),
              ))
          const e = (0, i.service)(l.CHART_WIDGET_COLLECTION_SERVICE)
          ;(this._activeChartWidget = e.activeChartWidget.value()),
            (this.state = { layoutName: e.metaInfo.name.value() })
        }
        render() {
          return t.createElement(r.AdaptivePopupDialog, {
            wrapperClassName: d.dialogWrapper,
            className: d.dialog,
            dataName: 'manage-drawings-dialog',
            isOpened: !0,
            onClickOutside: this.props.onClose,
            onClose: this.props.onClose,
            ref: this._dialogRef,
            render: this._renderChildren,
            showSeparator: !0,
            title: a.t(null, void 0, o(72357)),
            subtitle: this.state.layoutName,
          })
        }
      }
      class c {
        constructor(n) {
          ;(this._container = document.createElement('div')),
            (this._isVisible = !1),
            (this._handleClose = () => {
              this._onClose && this._onClose(),
                s.unmountComponentAtNode(this._container),
                (this._isVisible = !1)
            }),
            (this._onClose = n)
        }
        hide() {
          this._handleClose()
        }
        isVisible() {
          return this._isVisible
        }
        show() {
          s.render(
            t.createElement(m, { onClose: this._handleClose }),
            this._container,
          ),
            (this._isVisible = !0)
        }
      }
    },
    340092: (n, e, o) => {
      o.d(e, { ManageDrawings: () => B })
      var t = o(50959),
        s = o(343370),
        a = (o(650151), o(72571)),
        i = o(609838),
        l = o(664902),
        r = o(650802),
        u = o(6835),
        d = o(919577),
        m = o(73572),
        c = o(372605),
        g = o(132455),
        b = o(497754),
        y = o.n(b)
      var w = o(800417),
        C = o(959189),
        h = o(425398),
        v = o.n(h)
      function p(n) {
        const {
          className: e,
          color: o,
          variant: t,
          size: s,
          stretch: a,
          animated: i,
          disableThemes: l,
          isInvertedColorTheme: r,
          ...u
        } = n
        return {
          ...u,
          ...(0, w.filterDataProps)(n),
          ...(0, w.filterAriaProps)(n),
        }
      }
      function f(n) {
        const {
            reference: e,
            children: o,
            iconOnly: s,
            startIcon: i,
            endIcon: l,
            ...r
          } = n,
          u = ((n, e) => {
            const {
                className: o,
                color: t = 'brand',
                variant: s = 'primary',
                size: a = 'xlarge',
                stretch: i,
                animated: l = !1,
                disableThemes: r = !1,
                iconOnly: u = !1,
                isAnchor: d = !1,
                isActivated: m = !1,
                isInvertedColorTheme: c = !1,
                endIcon: g,
                startIcon: y,
              } = e,
              w = ((n, e) => !!e && 'black' === n)(t, c)
            return b(
              o,
              n['round-button'],
              w ? n[`color-inverted${t}`] : n[`color-${t}`],
              n[`variant-${s}`],
              n[`size-${a}`],
              l && n.animated,
              i && n.stretch,
              r && n['disable-themes'],
              u && n['icon-only'],
              d && n.link,
              m && n.activated,
              y && n['with-start-icon'],
              g && n['with-end-icon'],
            )
          })(v(), n)
        return t.createElement(
          'button',
          { ...p(r), className: u, ref: e },
          i &&
            t.createElement(a.Icon, {
              className: y()(v().icon, v().startIcon),
              icon: i,
            }),
          !(0, C.isIconOnly)(o, s) &&
            t.createElement('span', { className: v().content }, o),
          l &&
            t.createElement(a.Icon, {
              className: y()(v().icon, v().endIcon),
              icon: l,
            }),
        )
      }
      o(591365)
      function k(n, e) {
        const { align: o = 'start', size: t = 'xsmall' } = e
        return b(n['round-tabs'], n[`align-${o}`], n[`size-${t}`])
      }
      function _(n, e) {
        const { variant: o = 'primary', isChecked: t } = e
        return b(n.tab, n[`tab-${o}`], t && n.checked)
      }
      var z = o(448729),
        N = o.n(z)
      const S = t.forwardRef((n, e) => {
        const {
          tabs: o,
          size: s = 'xsmall',
          variant: a = 'primary',
          theme: i = N(),
        } = n
        return t.createElement(
          'div',
          { className: k(i, n), ref: e },
          o.map((n) => {
            const { isChecked: e, ...o } = n
            return t.createElement(f, {
              ...o,
              className: _(i, { ...o, variant: a, isChecked: e }),
              size: s,
              variant: a,
            })
          }),
        )
      })
      S.displayName = 'RoundTabsButtons'
      i.t(null, void 0, o(587871)),
        i.t(null, void 0, o(310538)),
        i.t(null, void 0, o(274860))
      var D = o(229540),
        j = o(528355)
      const E = (0, u.getLogger)('Chart.ManageDrawings'),
        I = new Map()
      function x(n) {
        let e = I.get(n)
        return void 0 === e && ((e = new r.WatchedValue([])), I.set(n, e)), e
      }
      const L = new l.TranslatedString(
          'remove all line tools for {symbol}',
          i.t(null, void 0, o(923481)),
        ),
        T = (n) =>
          i
            .t(
              null,
              { plural: '{drawingsCount} drawings', count: n },
              o(988143),
            )
            .format({ drawingsCount: n.toString() }),
        F = i.t(null, void 0, o(985128)),
        M = i.t(null, void 0, o(318570))
      function R(n) {
        const [e, o] = t.useState(null),
          [a, i] = t.useState(null),
          [l, r] = t.useState(null),
          [u, m] = (t.useRef(null), t.useState([]))
        return (
          t.useEffect(() => {
            let e
            const t = () => {
              e && i(e.mainSeries().proSymbol())
            }
            return (
              n.withModel(null, () => {
                ;(e = n.model()),
                  o(e),
                  t(),
                  e.mainSeries().symbolResolved().subscribe(null, t)
              }),
              () => {
                null == e ||
                  e.mainSeries().symbolResolved().unsubscribe(null, t),
                  o(null)
              }
            )
          }, [n]),
          t.useEffect(() => {
            if (null !== e) {
              const n = {},
                o = (0, s.default)(w, 250, { leading: !1 })
              return (
                w(),
                e.model().dataSourceCollectionChanged().subscribe(n, o),
                () => {
                  e.model().dataSourceCollectionChanged().unsubscribe(n, o)
                }
              )
            }
          }, [e]),
          t.useEffect(() => {
            if (null !== e) {
              const n = x(e.model().id()).spawn()
              return (
                m([...n.value()]),
                n.subscribe(() => m([...n.value()])),
                () => (null == n ? void 0 : n.destroy())
              )
            }
          }, [e]),
          t.useMemo(
            () => ({
              currentSymbol: a,
              symbolDrawingsMaps: l,
              removeSymbolDrawings: g,
              changeSymbol: b,
              hiddenSymbols: u,
            }),
            [a, l, g, b, u],
          )
        )
        async function g(n, o) {
          if (e && l) {
            const t = l[o].get(n)
            if (t) {
              const o = Array.from(t)
                .map((n) => e.model().dataSourceForId(n))
                .filter(c.notNull)
              o.length > 0 && e.removeSources(o, !1, L.format({ symbol: n }))
              const s = x(e.model().id())
              s.setValue([...s.value(), n])
              try {
                await w()
              } catch (n) {
                E.logError(`Error removing line tools: ${n}`)
              }
              s.setValue(s.value().filter((e) => e !== n))
            }
          }
        }
        function b(o) {
          n.setSymbol(o), null !== e && i(o)
        }
        async function y(n) {
          const e = ((n) => {
            const e = [new Map(), new Map(), new Map()]
            {
              const o = e[0]
              n.forEach((n) => {
                var e
                if ((0, d.isLineTool)(n) && n.showInObjectTree()) {
                  const t = null !== (e = n.symbol()) && void 0 !== e ? e : '',
                    s = o.get(t) || new Set()
                  s.add(n.id()), o.set(t, s)
                }
              })
            }
            return e
          })(n)
          return (
            (await (async () => [new Map(), new Map(), new Map()])()).forEach(
              (n, o) => {
                const t = e[o]
                n.forEach((n, e) => {
                  const o = t.get(e) || new Set()
                  n.forEach((n) => o.add(n)), t.set(e, o)
                })
              },
            ),
            e
          )
        }
        async function w() {
          null !== e && r(await y(e.dataSources()))
        }
      }
      function B(n) {
        const { isMobile: e, chartWidget: s, onClose: l, onInitialized: r } = n,
          {
            currentSymbol: u,
            symbolDrawingsMaps: d,
            removeSymbolDrawings: c,
            changeSymbol: b,
            hiddenSymbols: y,
          } = R(s),
          [w, C] = t.useState(0),
          [h, v, p] = t.useMemo(() => {
            var n
            if (null !== u && null !== d) {
              const e = []
              let o = 0,
                t = w
              if (null === t)
                for (
                  t = 2;
                  t > 0 &&
                  !(
                    ((null === (n = d[t].get(u)) || void 0 === n
                      ? void 0
                      : n.size) || 0) > 0
                  );
                )
                  t--
              return (
                d[t].forEach((n, t) => {
                  y.includes(t) ||
                    (e.push({
                      symbol: t,
                      drawingsCount: n.size,
                      onRemove: () =>
                        ((n) => {
                          c(n, p)
                        })(t),
                      onClick: () =>
                        ((n) => {
                          '' !== n && (b(n), null == l || l())
                        })(t),
                    }),
                    (o += n.size))
                }),
                e.sort((n, e) =>
                  n.drawingsCount === e.drawingsCount
                    ? n.symbol.localeCompare(e.symbol)
                    : n.drawingsCount > e.drawingsCount
                      ? -1
                      : 1,
                ),
                [e, o, t]
              )
            }
            return [[], 0, 0]
          }, [u, w, d, y])
        return (
          t.useEffect(() => {
            null !== d && (null == r || r())
          }, [d]),
          t.createElement(
            t.Fragment,
            null,
            h.length > 0 &&
              t.createElement(
                'div',
                { className: j.title },
                `${((f = d ? d[p].size : 0), i.t(null, { plural: '{symbolsCount} symbols', context: 'symbols_and_drawings_count', count: f }, o(352908)).format({ symbolsCount: f.toString() }))} ${((n) => i.t(null, { plural: 'with {drawingsCount} drawings', context: 'symbols_and_drawings_count', count: n }, o(542743)).format({ drawingsCount: n.toString() }))(v)}`,
              ),
            0 === h.length
              ? null === d
                ? t.createElement(g.Spinner, { className: j.spinner })
                : t.createElement(
                    'div',
                    { className: j.empty },
                    t.createElement(a.Icon, { className: j.image, icon: D }),
                    t.createElement('span', null, M),
                  )
              : h.map(
                  ({ symbol: n, drawingsCount: o, onRemove: s, onClick: a }) =>
                    t.createElement(m.DialogContentItem, {
                      key: n,
                      title: n,
                      subtitle: T(o),
                      removeBtnLabel: F,
                      isActive: n === u,
                      isMobile: e,
                      onClick: a,
                      onClickRemove: s,
                      showFavorite: !1,
                    }),
                ),
          )
        )
        var f
      }
    },
    229540: (n) => {
      n.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" width="72" height="72"><path fill="currentColor" d="M15 24a21 21 0 1 1 42 0v7.41l8.97 5.01 1.08.6-.82.94-7.77 8.82 2.34 2.53-1.47 1.36L57 48.15V69H46v-7h-6v5h-9V56h-6v13H15V48.15l-2.33 2.52-1.47-1.36 2.35-2.53-7.78-8.82-.82-.93 1.08-.6L15 31.4V24Zm0 9.7-6.9 3.87L15 45.4V33.7Zm42 11.7 6.91-7.83-6.9-3.87v11.7ZM36 5a19 19 0 0 0-19 19v43h6V54h10v11h5v-5h10v7h7V24A19 19 0 0 0 36 5Zm-5 19.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM42.5 26a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/></svg>'
    },
    274860: (n) => {
      n.exports = {
        ar: ['رسومات محلية'],
        ca_ES: ['Dibuixos locals'],
        cs: 'Local drawings',
        de: ['Lokale Zeichnungen'],
        el: 'Local drawings',
        en: 'Local drawings',
        es: ['Dibujos locales'],
        fa: 'Local drawings',
        fr: ['Dessins locaux'],
        he_IL: ['שרטוטים מקומיים'],
        hu_HU: 'Local drawings',
        id_ID: ['Gambar lokal'],
        it: ['Disegni in loco'],
        ja: ['ローカルの描画'],
        ko: ['로컬 드로잉'],
        ms_MY: ['Lukisan tempatan'],
        nl_NL: 'Local drawings',
        pl: ['Rysunki lokalne'],
        pt: ['Desenhos locais'],
        ro: 'Local drawings',
        ru: ['На выбранном графике'],
        sv: ['Lokala ritningar'],
        th: ['ภาพวาดท้องถิ่น'],
        tr: ['Lokal çizimler'],
        vi: ['Bản vẽ cục bộ'],
        zh: ['本地绘图'],
        zh_TW: ['當地繪圖'],
      }
    },
    318570: (n) => {
      n.exports = {
        ar: ['لا يوجد رسوم حتى الآن'],
        ca_ES: ['Encara no hi ha dibuixos'],
        cs: ['Zatím Žádné Nákresy'],
        de: ['Noch keine Zeichnungen'],
        el: ['Δεν υπάρχουν ακομα σχέδια'],
        en: 'No drawings yet',
        es: ['No hay dibujos todavía'],
        fa: ['شکلی رسم نشده است'],
        fr: ['Pas de Dessins pour le moment'],
        he_IL: ['אין שרטוט עדיין'],
        hu_HU: ['Nincs még rajz'],
        id_ID: ['Belum ada gambar saat ini'],
        it: ['Nessun disegno disponibile'],
        ja: ['未描画'],
        ko: ['그림없음'],
        ms_MY: ['Masih belum ada lukisan'],
        nl_NL: ['Nog geen tekeningen'],
        pl: ['Brak rysunków'],
        pt: ['Ainda sem desenhos'],
        ro: 'No drawings yet',
        ru: ['Нет инструментов рисования'],
        sv: ['Inga ritningar än'],
        th: ['ยังไม่มีรูปวาด'],
        tr: ['Henüz çizim yok'],
        vi: ['Chưa có bản vẽ nào'],
        zh: ['尚未绘图'],
        zh_TW: ['尚無任何繪圖'],
      }
    },
    587871: (n) => {
      n.exports = {
        ar: ['متزامن كليًا'],
        ca_ES: ['Sincronitzat globalment'],
        cs: 'Synced globally',
        de: ['Global synchronisiert'],
        el: 'Synced globally',
        en: 'Synced globally',
        es: ['Sincronizado globalmente'],
        fa: 'Synced globally',
        fr: ['Synchronisé globalement'],
        he_IL: ['מסונכרן ברחבי העולם'],
        hu_HU: 'Synced globally',
        id_ID: ['Disinkronisasi secara global'],
        it: ['Sincronizzazione globale'],
        ja: ['グローバルに同期'],
        ko: ['전체 싱크'],
        ms_MY: ['Disegerakkan secara sejagat'],
        nl_NL: 'Synced globally',
        pl: ['Zsynchronizowane globalnie'],
        pt: ['Sincronizado em tudo'],
        ro: 'Synced globally',
        ru: ['Синхр. везде'],
        sv: ['Synkad globalt'],
        th: ['ซิงค์ทั่วโลก'],
        tr: ['Küresel senkronize'],
        vi: ['Đã đồng bộ hóa trên toàn cầu'],
        zh: ['全局同步'],
        zh_TW: ['全球同步'],
      }
    },
    310538: (n) => {
      n.exports = {
        ar: ['تمت المزامنة في التنسيق'],
        ca_ES: ['Sincronitzat a la plantilla'],
        cs: 'Synced in layout',
        de: ['Im Layout synchronisiert'],
        el: 'Synced in layout',
        en: 'Synced in layout',
        es: ['Sincronizado en la plantilla'],
        fa: 'Synced in layout',
        fr: ['Synchronisé dans la mise en page'],
        he_IL: ['מסונכרן בפריסה'],
        hu_HU: 'Synced in layout',
        id_ID: ['Disinkronisasi dalam layout'],
        it: ['Sincronizzazione su layout'],
        ja: ['レイアウト内で同期'],
        ko: ['레이아웃 싱크'],
        ms_MY: ['Disegerakkan di dalam susun atur'],
        nl_NL: 'Synced in layout',
        pl: ['Zsynchronizowane w układzie'],
        pt: ['Sincronizado no layout'],
        ro: 'Synced in layout',
        ru: ['Синхр. на всех графиках'],
        sv: ['Synkad i layout'],
        th: ['ซิงค์ในเลย์เอาต์'],
        tr: ['Düzende senkronize'],
        vi: ['Đã đồng bộ hóa trong bố cục'],
        zh: ['在布局内同步'],
        zh_TW: ['版面同步'],
      }
    },
    985128: (n) => {
      n.exports = {
        ar: ['إزالة كافة الرسومات لهذا الرمز'],
        ca_ES: ['Elimina tots els dibuixos per a aquest símbol'],
        cs: 'Remove all drawings for this symbol',
        de: ['Alle Zeichnungen für dieses Symbol entfernen'],
        el: 'Remove all drawings for this symbol',
        en: 'Remove all drawings for this symbol',
        es: ['Eliminar todos los dibujos para este símbolo'],
        fa: 'Remove all drawings for this symbol',
        fr: ['Supprimer tous les dessins pour ce symbole'],
        he_IL: ['הסר את כל השרטוטים לסימול זה'],
        hu_HU: 'Remove all drawings for this symbol',
        id_ID: ['Hilangkan seluruh gambar pada simbol ini'],
        it: ['Rimuove tutti i disegni su questo simbolo'],
        ja: ['このシンボルのすべての描画を削除'],
        ko: ['이 심볼에 대한 모든 드로잉 없애기'],
        ms_MY: ['Buang semua lukisan untuk simbol ini'],
        nl_NL: 'Remove all drawings for this symbol',
        pl: ['Usuń wszystkie obiekty rysowania dla tego symbolu'],
        pt: ['Remover todos os desenhos deste símbolo'],
        ro: 'Remove all drawings for this symbol',
        ru: ['Удалить все объекты рисования для этого символа'],
        sv: ['Ta bort alla ritningar för denna symbol'],
        th: ['ลบการวาดทั้งหมดของตัวย่อนี้'],
        tr: ['Bu sembol için tüm çizimleri kaldır'],
        vi: ['Loại bỏ tất cả nét vẽ cho mã này'],
        zh: ['移除该商品代码的所有绘图'],
        zh_TW: ['刪除此商品代碼的所有繪圖'],
      }
    },
    923481: (n) => {
      n.exports = {
        ar: ['حذف كافة خطوط الأدوات لـ {symbol}'],
        ca_ES: ['elimina totes les eines de línies per a {symbol}'],
        cs: 'remove all line tools for {symbol}',
        de: ['alle Linienwerkzeuge für {symbol} entfernen'],
        el: 'remove all line tools for {symbol}',
        en: 'remove all line tools for {symbol}',
        es: ['eliminar todas las herramientas de líneas para {symbol}'],
        fa: 'remove all line tools for {symbol}',
        fr: ['supprimer tous les outils de ligne pour {symbol}.'],
        he_IL: ['הסרת כל קבוצת כלי קו ‎{symbol}‎'],
        hu_HU: 'remove all line tools for {symbol}',
        id_ID: ['Hilangkan semua peralatan garis untuk {symbol}'],
        it: ['rimuovi tutte le linee da {symbol}'],
        ja: ['{symbol}のすべてのラインツールの削除'],
        ko: ['{symbol}의 모든 줄 도구 제거'],
        ms_MY: ['buang semua alat garisan untuk {symbol}'],
        nl_NL: 'remove all line tools for {symbol}',
        pl: ['usuń wszystkie narzędzia linii dla {symbol}'],
        pt: ['remover todas as ferramentas de linhas para {symbol}'],
        ro: 'remove all line tools for {symbol}',
        ru: ['удаление всех объектов рисования для {symbol}'],
        sv: ['Ta bort alla linjeverktyg för {symbol}'],
        th: ['ลบเครื่องมือเส้นทั้งหมดสำหรับ {symbol}'],
        tr: ['{symbol} için tüm çizgi araçlarını kaldır'],
        vi: ['loại bỏ tất cả đường công cụ cho {symbol}'],
        zh: ['移除{symbol}的所有线条工具'],
        zh_TW: ['移除{symbol}的所有線條工具'],
      }
    },
    542743: (n) => {
      n.exports = {
        ar: [
          'مع ‎{drawingsCount}‎ رسم',
          'مع ‎{drawingsCount}‎ رسم',
          'مع ‎{drawingsCount}‎ رسم',
          'مع ‎{drawingsCount}‎ رسوم',
          'مع ‎{drawingsCount}‎ رسماً',
          'مع ‎{drawingsCount}‎ رسماً',
        ],
        ca_ES: ['amb {drawingsCount} dibuix', 'amb {drawingsCount} dibuixos'],
        cs: 'with {drawingsCount} drawing',
        de: [
          'mit {drawingsCount} Zeichnung',
          'mit {drawingsCount} Zeichnungen',
        ],
        el: 'with {drawingsCount} drawing',
        en: 'with {drawingsCount} drawing',
        es: ['con {drawingsCount} dibujo', 'con {drawingsCount} dibujos'],
        fa: ['with {drawingsCount} drawings'],
        fr: ['avec {drawingsCount} dessin', 'avec {drawingsCount} dessins'],
        he_IL: [
          'עם שרטוט ‎{drawingsCount}‎',
          'עם ‎{drawingsCount}‎ שרטוטים',
          'עם ‎{drawingsCount}‎ שרטוטים',
          'עם ‎{drawingsCount}‎ שרטוטים',
        ],
        hu_HU: ['with {drawingsCount} drawings'],
        id_ID: ['dengan {drawingsCount} gambar'],
        it: ['con {drawingsCount} disegno', 'con {drawingsCount} disegni'],
        ja: ['に{drawingsCount}個の描画'],
        ko: ['{drawingsCount} 드로잉이 있는'],
        ms_MY: ['dengan {drawingsCount} lukisan'],
        nl_NL: 'with {drawingsCount} drawing',
        pl: [
          'z {drawingsCount} rysunkiem',
          'z {drawingsCount} rysunkami',
          'z {drawingsCount} rysunkami',
          'z {drawingsCount} rysunkami',
        ],
        pt: ['com {drawingsCount} desenho', 'com {drawingsCount} desenhos'],
        ro: 'with {drawingsCount} drawing',
        ru: [
          'с {drawingsCount} объектом рисования',
          'с {drawingsCount} объектами рисования',
          'с {drawingsCount} объектами рисования',
          'с {drawingsCount} объектами рисования',
        ],
        sv: [
          'med {drawingsCount} ritverktyg',
          'med {drawingsCount} ritverktyg',
        ],
        th: ['กับ {drawingsCount} การวาด'],
        tr: ['{drawingsCount} çizim ile', '{drawingsCount} çizim ile'],
        vi: ['với {drawingsCount} nét vẽ'],
        zh: ['含{drawingsCount}个绘图'],
        zh_TW: ['含{drawingsCount}個繪圖'],
      }
    },
    988143: (n) => {
      n.exports = {
        ar: [
          '‎{drawingsCount}‎ رسم',
          '‎{drawingsCount}‎ رسم',
          '‎{drawingsCount}‎ رسم',
          '‎{drawingsCount}‎ رسوم',
          '‎{drawingsCount}‎ رسماً',
          '‎{drawingsCount}‎ رسماً',
        ],
        ca_ES: ['{drawingsCount} dibuix', '{drawingsCount} dibuixos'],
        cs: '{drawingsCount} drawing',
        de: ['{drawingsCount} Zeichnung', '{drawingsCount} Zeichnungen'],
        el: '{drawingsCount} drawing',
        en: '{drawingsCount} drawing',
        es: ['{drawingsCount} dibujo', '{drawingsCount} dibujos'],
        fa: ['{drawingsCount} drawings'],
        fr: ['{drawingsCount} dessin', '{drawingsCount} dessins'],
        he_IL: [
          'שרטוט ‎{drawingsCount}‎',
          '‎{drawingsCount}‎ שרטוטים',
          '‎{drawingsCount}‎ שרטוטים',
          '‎{drawingsCount}‎ שרטוטים',
        ],
        hu_HU: ['{drawingsCount} drawings'],
        id_ID: ['{drawingsCount} gambar'],
        it: ['{drawingsCount} disegno', '{drawingsCount} disegni'],
        ja: ['{drawingsCount}個の描画'],
        ko: ['{drawingsCount} 드로잉'],
        ms_MY: ['{drawingsCount} lukisan'],
        nl_NL: '{drawingsCount} drawing',
        pl: [
          '{drawingsCount} rysunek',
          '{drawingsCount} rysunki',
          '{drawingsCount} rysunków',
          '{drawingsCount} rysunków',
        ],
        pt: ['{drawingsCount} desenho', '{drawingsCount} desenhos'],
        ro: '{drawingsCount} drawing',
        ru: [
          '{drawingsCount} объект рисования',
          '{drawingsCount} объекта рисования',
          '{drawingsCount} объектов рисования',
          '{drawingsCount} объектов рисования',
        ],
        sv: ['{drawingsCount} ritverktyg', '{drawingsCount} ritverktyg'],
        th: ['{drawingsCount} การวาด'],
        tr: ['{drawingsCount} çizimi', '{drawingsCount} çizimi'],
        vi: ['{drawingsCount} nét vẽ'],
        zh: ['{drawingsCount}个绘图'],
        zh_TW: ['{drawingsCount}個繪圖'],
      }
    },
    352908: (n) => {
      n.exports = {
        ar: [
          '‎{symbolsCount}‎ رمز',
          '‎{symbolsCount}‎ رمز',
          '‎{symbolsCount}‎ رمز',
          '‎{symbolsCount}‎ رموز',
          '‎{symbolsCount}‎ رمزاً',
          '‎{symbolsCount}‎ رمزاً',
        ],
        ca_ES: ['{symbolsCount} símbol', '{symbolsCount} símbols'],
        cs: '{symbolsCount} symbol',
        de: ['{symbolsCount} Symbol', '{symbolsCount} Symbole'],
        el: '{symbolsCount} symbol',
        en: '{symbolsCount} symbol',
        es: ['{symbolsCount} símbolo', '{symbolsCount} símbolos'],
        fa: ['{symbolsCount} symbols'],
        fr: ['{symbolsCount} symbole', '{symbolsCount} symboles'],
        he_IL: [
          'סימול ‎{symbolsCount}‎',
          '‎{symbolsCount}‎ סימולים',
          '‎{symbolsCount}‎ סימולים',
          '‎{symbolsCount}‎ סימולים',
        ],
        hu_HU: ['{symbolsCount} symbols'],
        id_ID: ['{symbolsCount} simbol'],
        it: ['{symbolsCount} simbolo', '{symbolsCount} simboli'],
        ja: ['{symbolsCount}シンボル'],
        ko: ['{symbolsCount} 심볼'],
        ms_MY: ['Simbol {symbolsCount}'],
        nl_NL: '{symbolsCount} symbol',
        pl: '{symbolsCount} symbol',
        pt: ['{symbolsCount} símbolo', '{symbolsCount} símbolos'],
        ro: '{symbolsCount} symbol',
        ru: [
          '{symbolsCount} символ',
          '{symbolsCount} символа',
          '{symbolsCount} символов',
          '{symbolsCount} символов',
        ],
        sv: '{symbolsCount} symbol',
        th: ['{symbolsCount} สัญลักษณ์'],
        tr: ['{symbolsCount} sembol', '{symbolsCount} sembol'],
        vi: ['{symbolsCount} mã giao dịch'],
        zh: ['{symbolsCount}个商品'],
        zh_TW: ['{symbolsCount}個商品'],
      }
    },
  },
])
